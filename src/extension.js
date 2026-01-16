const vscode = require('vscode');
const { WebSocketServer } = require('ws');

let wss = null;
let statusBar = null;
let clients = new Set();

function activate(context) {
  console.log('ScriptCat Sync activé');

  // Status bar
  statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBar.command = 'scriptcat-sync.start';
  updateStatus('stopped');
  statusBar.show();

  // Commands
  context.subscriptions.push(
    vscode.commands.registerCommand('scriptcat-sync.start', startServer),
    vscode.commands.registerCommand('scriptcat-sync.stop', stopServer),
    vscode.commands.registerCommand('scriptcat-sync.push', pushCurrentScript),
    statusBar
  );

  // Auto-push on save
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((doc) => {
      if (doc.fileName.endsWith('.user.js') && clients.size > 0) {
        pushScript(doc);
      }
    })
  );

  // Auto-start server
  const config = vscode.workspace.getConfiguration('scriptcat-sync');
  if (config.get('autoConnect')) {
    startServer();
  }
}

function updateStatus(state, clientCount = 0) {
  if (state === 'running') {
    statusBar.text = `$(broadcast) ScriptCat (${clientCount})`;
    statusBar.backgroundColor = undefined;
    statusBar.tooltip = `Server running - ${clientCount} client(s) connected\nClick to stop`;
    statusBar.command = 'scriptcat-sync.stop';
  } else {
    statusBar.text = '$(plug) ScriptCat';
    statusBar.tooltip = 'Server stopped - Click to start';
    statusBar.command = 'scriptcat-sync.start';
  }
}

function startServer() {
  if (wss) {
    vscode.window.showInformationMessage('ScriptCat server already running');
    return;
  }

  const config = vscode.workspace.getConfiguration('scriptcat-sync');
  const port = config.get('port') || 8642;

  try {
    wss = new WebSocketServer({ port });

    wss.on('listening', () => {
      updateStatus('running', 0);
      vscode.window.showInformationMessage(`ScriptCat server started on port ${port}`);
    });

    wss.on('connection', (ws) => {
      clients.add(ws);
      updateStatus('running', clients.size);
      vscode.window.setStatusBarMessage(`ScriptCat: Client connected (${clients.size} total)`, 3000);

      ws.on('close', () => {
        clients.delete(ws);
        updateStatus('running', clients.size);
      });

      ws.on('error', () => {
        clients.delete(ws);
        updateStatus('running', clients.size);
      });
    });

    wss.on('error', (err) => {
      updateStatus('stopped');
      vscode.window.showErrorMessage(`ScriptCat server error: ${err.message}`);
      wss = null;
    });
  } catch (err) {
    updateStatus('stopped');
    vscode.window.showErrorMessage(`Failed to start server: ${err.message}`);
  }
}

function stopServer() {
  return new Promise((resolve) => {
    if (wss) {
      clients.forEach(client => client.close());
      clients.clear();
      wss.close(() => {
        wss = null;
        updateStatus('stopped');
        vscode.window.showInformationMessage('ScriptCat server stopped');
        resolve();
      });
    } else {
      resolve();
    }
  });
}

function parseUserScriptMeta(code) {
  const meta = {};
  const metaMatch = code.match(/\/\/\s*==UserScript==([\s\S]*?)\/\/\s*==\/UserScript==/);

  if (metaMatch) {
    const metaBlock = metaMatch[1];
    const lines = metaBlock.split('\n');

    for (const line of lines) {
      const match = line.match(/\/\/\s*@(\S+)\s+(.*)/);
      if (match) {
        const [, key, value] = match;
        if (meta[key]) {
          if (Array.isArray(meta[key])) {
            meta[key].push(value.trim());
          } else {
            meta[key] = [meta[key], value.trim()];
          }
        } else {
          meta[key] = value.trim();
        }
      }
    }
  }

  return meta;
}

function pushScript(document) {
  const code = document.getText();
  const meta = parseUserScriptMeta(code);

  // Format compatible ScriptCat
  const message = {
    action: 'onchange',
    data: {
      script: code,
      uri: document.uri.toString()
    }
  };

  const messageStr = JSON.stringify(message);
  let sent = 0;

  clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(messageStr);
      sent++;
    }
  });

  if (sent > 0) {
    vscode.window.setStatusBarMessage(`ScriptCat: Pushed ${meta.name || 'script'} to ${sent} client(s)`, 2000);
  }
}

function pushCurrentScript() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showWarningMessage('No active editor');
    return;
  }

  if (!editor.document.fileName.endsWith('.user.js')) {
    vscode.window.showWarningMessage('Current file is not a userscript (.user.js)');
    return;
  }

  if (clients.size === 0) {
    vscode.window.showWarningMessage('No ScriptCat clients connected');
    return;
  }

  pushScript(editor.document);
}

function deactivate() {
  return stopServer();
}

module.exports = { activate, deactivate };
