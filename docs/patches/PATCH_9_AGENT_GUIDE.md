# Patch 9 Agent Guide — Web Deployment and Reliability

## Goal
Upgrade the latest refined markdown studio so it works better as a **static web app** while keeping the current local-first workflow intact.

This patch is specifically about:
- GitHub Pages readiness
- installable web app support
- adaptive browser file handling
- safer browser-backed workspace backup and restore
- agent-facing deployment documentation

## Key implementation points

### 1. Keep the app static-only
Do not add a backend.
Do not add auth.
Do not add server routes.

### 2. Add web app files
Add or update:
- `manifest.webmanifest`
- `service-worker.js`
- `404.html`
- `.nojekyll`
- install icons in `assets/`

### 3. Adaptive file UX
The UI should not pretend every browser supports native file APIs.

Use this behavior:
- if native open is supported, show `Open`
- otherwise show `Upload`
- if native save is supported, show `Save` and `Save As`
- otherwise show `Download` and `Download As`

### 4. Browser backup layer
Add a browser-backed workspace backup using IndexedDB.

Support:
- automatic backup mirroring when autosave is enabled
- manual export of a JSON backup
- manual import of a JSON backup
- restore last browser backup
- clear stored browser backup

### 5. App setup surface
Add a focused modal or panel for:
- browser mode details
- backup controls
- install action
- persistent storage request
- deployment-oriented explanation

Keep this surface scrollable on smaller laptop screens.

## Files changed in Patch 9
- `index.html`
- `404.html`
- `.nojekyll`
- `manifest.webmanifest`
- `service-worker.js`
- `assets/icon-192.png`
- `assets/icon-512.png`
- `assets/apple-touch-icon.png`
- `js/app.js`
- `styles/app.css`
- `README.md`
- `GITHUB_PAGES_DEPLOYMENT.md`
- `CHANGELOG.md`
- `FINAL_QA_CHECKLIST.md`
- `sample.md`

## Acceptance checks
- [ ] header labels switch correctly between native and fallback actions
- [ ] App setup opens and is scrollable on a small laptop screen
- [ ] workspace backup export/import works
- [ ] browser backup restore works
- [ ] service worker registers in a secure context
- [ ] app still works locally without regressions
- [ ] static hosting still loads editor left and preview right
- [ ] UI does not bring back noisy patch branding in active writing surfaces

## Notes for the agent
- keep the product feeling simple and reliable
- prefer grouped menus and focused surfaces over more permanent buttons
- do not break the current split-pane editor experience
- do not remove old working features while adding web-mode behavior
