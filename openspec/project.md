# Project Context

## Purpose
Provide a minimal VS Code extension that syncs `.user.js` userscripts to the ScriptCat browser extension over WebSocket.

## Tech Stack
- JavaScript (CommonJS)
- VS Code Extension API
- Node.js with `ws` for WebSocket client

## Project Conventions

### Code Style
- Minimal, single-file implementation unless growth requires splitting
- Keep dependencies light; avoid scaffolding generated folders
- Use straightforward imperative JS; no framework patterns

### Architecture Patterns
- Single activation entry (`activate`) with command registration
- Stateless helpers where possible; WebSocket stored as module-level singleton

### Testing Strategy
- No automated tests yet; add targeted tests when behavior becomes complex

### Git Workflow
- Not specified; keep releases aligned with SemVer and update `CHANGELOG.md`

## Domain Context
- Userscripts are `.user.js` files with `// ==UserScript==` metadata blocks
- ScriptCat expects push messages over local WebSocket (default port 9222)

## Important Constraints
- Only sync `.user.js` files; avoid broad file watchers
- Prefer minimal scaffold; no heavy deps or generated folders in repo
- Follow PK base project rules: compile/deploy scripts and changelog are required when formalizing releases

## External Dependencies
- VS Code extension host APIs
- ScriptCat browser extension (local WebSocket server)
- `ws` npm package
