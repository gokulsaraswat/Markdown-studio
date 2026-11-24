# ARCHITECTURE: Markdown-studio

Describes only what exists (2026-11-25). Wishes go to `docs/BACKLOG.md`. Feature contract: `docs/FEATURES.md`.

## Runtime
- Static site, no build step, no package.json, no backend. Served from the repo root on `main` by GitHub Pages
  (https://gokulsaraswat.github.io/Markdown-studio/). Local: `run-local.sh` / `run-local.bat` (`python -m http.server 8080`).
- Browser globals loaded as classic scripts in `index.html` (order matters): `vendor/react.production.min.js`
  (React 16.0.0), `vendor/react-dom.production.min.js`, `vendor/marked.js` (marked, 2022 build),
  `vendor/highlight.min.js` (highlight.js 11.0.1), then `js/app.js`.
- Styles: `styles/tailwind.generated.css` (Tailwind v4.1.10 compiled output, committed; no config in repo),
  `styles/app.css` (app styles), `styles/highlight-light.css` / `highlight-dark.css` (swapped via `#hljs-theme`).
- Inline script in `index.html` applies the saved or system theme (`html.dark`) before first paint.

## Files
| Path | Role |
|---|---|
| `index.html` | App shell, `#app` mount, theme bootstrap, script/style order |
| `404.html` | Redirect to app root (GitHub Pages project path aware) |
| `manifest.webmanifest` | PWA manifest (standalone, icons 192/512/svg) |
| `service-worker.js` | Offline shell cache (`CACHE_NAME = markdown-studio-shell-v9`, `APP_SHELL` precache list) |
| `js/app.js` | Whole app (~512 KB, 11,966 lines), one IIFE |
| `sample.md` | Sample document (precached) |
| `assets/` | Icons (svg, 192, 512, apple-touch) |
| `vendor/` | Third-party UMD builds (see THIRD_PARTY_NOTICES.md) |
| `tests/smoke/walk.mjs` | Scripted behaviour walk (puppeteer-core from a scratch dir; not a repo dependency) |
| `docs/patches/` | Historical agent guides for patches 2-9 |
| `sync-architecture.sh` | Generates `.project-architecture.md` (pre-commit hook) |

## js/app.js structure
One IIFE; `e = React.createElement`. A single class component `MarkdownStudioApp` (plus small function/class
components such as `SettingsModal`, `ToolbarButton`, `ActionButton`, `StatusChip`) rendered with
`ReactDOM.render(e(MarkdownStudioApp), #app)`.
Features were added as layered "patches": the base (patches 1-5, lines ~1-7250) then patch 6 (UX), 7 (smart writing),
8 (stability/a11y), 9 (web/PWA/backup), each reassigning `MarkdownStudioApp.prototype.<method>` and calling the
previous implementation it captured (`patchNBase<Method>`). The effective behaviour of a method is therefore its
LAST assignment in the file (e.g. `handleKeyDown` is wrapped by patches 5, 6, 7; `getCommandItems` by 5, 6, 7, 9;
`handleOpenFile` / `saveToDisk` by 9).
- Markdown: `marked` with a custom renderer (safe `href`, `target=_blank rel=noopener`), GFM, smartypants;
  preview HTML is set via `dangerouslySetInnerHTML` without sanitizing (see BACKLOG MDS-B-001).
  Patch 4 adds frontmatter, lite math and lite diagram rendering.
- Highlighting: `window.hljs.highlightElement` on preview `pre code` blocks.
- Input: global `keydown` listener on `window` (`handleKeyDown`), editor `onKeyDown` (`handleEditorKeyDown`),
  palette / find / slash menu key handlers. Shortcut list: `SHORTCUT_GROUPS` (+ `Ctrl/Cmd + ,` pushed by patch 5).
- File access: File System Access API when `isSecureContext && showOpenFilePicker/showSaveFilePicker`, else
  `<input type=file>` upload and anchor-download fallback (`downloadFallback`, `triggerBlobDownload`).
- Exports: TXT (`htmlToPlainText`), standalone HTML (`buildStandaloneHtmlDocument`), DOCX (`buildDocxBlobFromHtml`,
  hand-built zip), PDF (`window.open` + `print()`).

## Data (all client-side, per browser origin)
| Store | Key | Holds |
|---|---|---|
| localStorage | `markdown-studio-local:v1` | Document, settings, theme, recents, snapshots, writing modes, word goal |
| IndexedDB | db `markdown-studio-patch9`, store `workspace`, key `current-workspace` | Autosave mirror / last backup package |
| Workspace backup JSON (download) | keys `app, exportedAt, schema, source, state, version` | Export/import format |
| Cache Storage | `markdown-studio-shell-v9` | 18 precached shell files |

## Service worker
Install: precache `APP_SHELL`, `skipWaiting`. Activate: delete other caches, `clients.claim`. Navigations:
network-first, cache `index.html` copy, offline fallback to cached `index.html`. Other same-origin GETs:
cache-first, then network (stores 200s). Any file added/moved must be added to `APP_SHELL` and `CACHE_NAME` bumped.

## Integrations
None at runtime (no network calls besides its own static files). Planned hub path `/studio` is not implemented
(see BACKLOG).
