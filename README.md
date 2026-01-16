# VS_pkscriptcatws

Extension VS Code pour synchroniser vos userscripts (`.user.js`) directement avec l'extension de navigateur [ScriptCat](https://scriptcat.org/).

## Fonctionnalités

- **Serveur WebSocket Intégré** : Démarre un serveur local pour communiquer avec ScriptCat.
- **Auto-Sync** : Envoie automatiquement vos scripts à ScriptCat lors de chaque sauvegarde d'un fichier `.user.js`.
- **Barre d'État** : Affiche l'état de la connexion et le nombre de clients connectés directement dans la barre d'état de VS Code.
- **Poussée Manuelle** : Permet d'envoyer manuellement le script ouvert vers le navigateur.

## Installation

1. Installez l'extension dans VS Code.
2. Assurez-vous d'avoir l'extension **ScriptCat** installée dans votre navigateur.
3. Configurez ScriptCat pour se connecter au serveur WebSocket (port par défaut : `8642`).

## Assets

Les logos carrés pour le Marketplace sont générés dans `release/` :
- `release/logo-128.png`
- `release/logo-256.png`
- `release/logo-512.png`

## Commandes

| Commande | Description |
| --- | --- |
| `ScriptCat: Start Server` | Démarre le serveur WebSocket. |
| `ScriptCat: Stop Server` | Arrête le serveur WebSocket. |
| `ScriptCat: Push Current Script` | Envoie le script actuel au navigateur. |

## Configuration

Vous pouvez modifier les paramètres de l'extension dans les réglages de VS Code (`File` > `Preferences` > `Settings`) :

- `scriptcat-sync.port` : Le port WebSocket utilisé (par défaut `8642`).
- `scriptcat-sync.autoConnect` : Démarre automatiquement le serveur à l'ouverture d'un projet contenant des userscripts (par défaut `true`).

## Comment l'utiliser

1. Ouvrez un dossier contenant vos fichiers `.user.js`.
2. Le serveur devrait démarrer automatiquement (vérifiez l'icône dans la barre d'état en bas à droite).
3. Connectez ScriptCat au serveur WebSocket.
4. À chaque fois que vous sauvegardez un fichier `.user.js`, il sera instantanément mis à jour dans ScriptCat.

## Licence

ISC
