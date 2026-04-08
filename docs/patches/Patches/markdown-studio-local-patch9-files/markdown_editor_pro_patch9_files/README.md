# Markdown Studio — Patch 9 Web Deployment and Reliability

Markdown Studio is a local-first markdown workspace with a **left editor**, **right preview**, grouped menus, exports, writing modes, templates, snapshots, and a calmer laptop-friendly UI.

Patch 9 keeps the existing writing workflow, but adds the next step you asked for:

- **GitHub Pages-ready static deployment**
- **installable web app behavior** through a manifest and service worker
- **adaptive open/save actions** that switch between native file access and upload/download fallbacks
- **browser-backed workspace backup** with IndexedDB mirroring plus JSON export/import
- **agent-facing deployment docs** for static hosting

## What Patch 9 adds

### Static web deployment
- deploy the same folder to GitHub Pages or another static host
- ships with `manifest.webmanifest`
- ships with `service-worker.js`
- ships with `.nojekyll`
- includes app icons for install prompts
- includes `404.html` for friendlier static hosting fallback behavior

### Adaptive file behavior
The app now adjusts itself to the current environment:

- **supported secure browser**: native `Open`, `Save`, and `Save As`
- **unsupported browser**: `Upload`, `Download`, and `Download As`
- **localhost**: still works like the local app you already used
- **GitHub Pages**: keeps writing, preview, export, autosave, and backup behavior usable without breaking when native file access is unavailable

### Browser backup and recovery
- background workspace mirroring into **IndexedDB** when autosave is enabled
- export a **workspace backup JSON**
- import a saved workspace backup JSON
- restore the last browser backup from **App setup** or the command palette
- request persistent browser storage when supported

### Installable web mode
- install prompt support where the browser exposes it
- offline shell caching through the service worker
- install status and backup controls inside the new **App setup** modal

## Core features still included

### Editor and preview
- editor on the left and preview on the right
- live preview while typing
- synced scrolling
- draggable divider with hover help and reset
- split, editor-only, and zen workflows

### Writing features
- slash commands
- contextual selection toolbar
- typewriter mode
- paragraph focus mode
- spellcheck toggle
- autosave toggle
- tab size and wrap control
- find and replace
- undo/redo
- line numbers and current-line highlight
- word goal tracking

### Insert and export
- insert image, GIF, file link, code block, table, callout, date/time
- clipboard image paste
- drag-and-drop image embed
- export TXT, HTML, PDF, and DOCX
- copy markdown source and rendered HTML

### Workspace and power tools
- command palette
- outline, stats, and recents
- templates and snippets
- snapshots and diff view
- style studio and custom preview CSS
- release notes and welcome modal

## Running locally

Best option after extracting:

- **Windows:** run `run-local.bat`
- **macOS / Linux:** run `run-local.sh`

Opening `index.html` directly still works, but a local server gives the best browser compatibility for native file access and service worker registration.

## Deploying to GitHub Pages

This build is designed to stay **static-only** so it can be deployed easily.

### Simple deployment flow
1. Create a GitHub repository.
2. Upload the contents of this folder to the repository root.
3. Commit and push.
4. In GitHub, open **Settings → Pages**.
5. Choose **Deploy from a branch**.
6. Select your main branch and the root folder.
7. Save.

After deployment, the app works as a static site.

### What changes on GitHub Pages
- writing, preview, exports, templates, snapshots, slash commands, and UI features keep working
- browser autosave and backup keep working
- if native file pickers are unavailable, the buttons switch to **Upload** and **Download** instead of failing
- install prompt behavior depends on the browser

See `GITHUB_PAGES_DEPLOYMENT.md` for a more detailed checklist.

## App setup modal

Patch 9 adds **App setup**.

Use it for:
- browser mode and hosting details
- backup export/import
- restoring the last browser backup
- requesting persistent storage
- install prompt access when supported

## Recommended smoke test

1. Open the app locally.
2. Confirm the header still feels compact.
3. Open **App setup**.
4. Export a workspace backup.
5. Import the backup back in.
6. Save or download a markdown file.
7. Confirm the label changes make sense for your browser.
8. Serve the folder and confirm `manifest.webmanifest` and `service-worker.js` both load.

## Agent patch files

This project now includes:
- `PATCH_9_AGENT_GUIDE.md`
- `PATCH_9_DIFF.txt`
- `PATCH_9_MANIFEST.txt`
- `GITHUB_PAGES_DEPLOYMENT.md`
- `FINAL_QA_CHECKLIST.md`

## Notes

Patch 9 is the right bridge from **local-only tool** to **simple static web app**. The product still stays backend-free and reliable, while becoming much easier to share or publish later.
