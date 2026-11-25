# FEATURES: Markdown-studio (do-not-break contract)

One line per feature. Verify = how to prove it still works. "walk:`step`" = a step of the scripted walk
(`tests/smoke/walk.mjs`, see Baseline) that must stay `ok`. Every keyboard shortcut below is frozen: any change
must keep each one working and re-run the walk.

## Baseline 2026-11-25 (commit 82d9c77, Node 24.14.1, Chrome stable, Windows 11)
- Build: none (static site, no build step). Lint: none configured. Unit tests: none.
- Syntax check: `node --check js/app.js && node --check service-worker.js` passes (3.6 s).
- Smoke walk: 48/48 steps ok, 0 console errors, 0 page errors, ~29 s; two runs give identical fingerprints.
- Shipped size: `js/app.js` 512,484 B (11,966 lines); vendor 343,891 B (react 6,610, react-dom 103,096,
  marked 101,167, highlight.js 133,308); CSS 125,671 B; precache list 18 entries, 999,855 B.
- Cold load (local `python -m http.server`, no compression, cache off, median of 3): 11 requests, 988,069 B,
  DOMContentLoaded 260-495 ms, app ready (editor mounted) 264-502 ms (3 walk runs), JS heap 4.6 MB.
- Lighthouse 12, live Pages (gzip): mobile perf 93, a11y 86, best practices 100, SEO 100 (FCP 2.6 s, LCP 2.6 s,
  TBT 40 ms, CLS 0, 229 KiB transfer); desktop perf 100, a11y 90, BP 100, SEO 100 (FCP 0.6 s).
- Lighthouse 12, local uncompressed: mobile perf 61 (FCP 6.7 s, render-blocking 5.9 s), desktop perf 94.
- Lighthouse a11y failures: preview task-list checkboxes have no label; `hljs-keyword` contrast in preview code;
  `.view-segment` `role=tablist` without `tab` children (BACKLOG MDS-B-002..004).

### How to run the walk
```sh
# 1. serve the repo root
cd Markdown-studio && python -m http.server 8765 --bind 127.0.0.1
# 2. in a scratch dir (NOT the repo): npm i puppeteer-core
node <repo>/tests/smoke/walk.mjs http://127.0.0.1:8765/ after.json <repo>/tests/smoke/baseline.fingerprint.json
```
Exit code 0 = all steps ok and the fingerprint is identical to the baseline. An intended behaviour change must
update `tests/smoke/baseline.fingerprint.json` in the same commit and say why. `CHROME_PATH` overrides Chrome.
The walk stubs the native file pickers (records calls), `window.open` and download anchors, accepts confirm
dialogs and answers the word-goal prompt with 500.

## Routes and static files
| Feature | Verify |
|---|---|
| `/` (`index.html`) loads the app, theme applied before paint (`markdown-studio-local:v1` or system) | walk:`boot`; open `/` with dark system theme, no light flash |
| `404.html` redirects to the app root (Pages project path aware) | open `/Markdown-studio/nope` on Pages, lands on app |
| `manifest.webmanifest` (name, start_url `./`, standalone, icons 192/512/svg) | walk:`install.manifest` (0 installability errors) |
| `service-worker.js` precaches 18-file `APP_SHELL`, cache `markdown-studio-shell-v9` | walk:`offline.reload` (`cacheInfo` n=18) |
| Offline: reload with network off renders the app with the saved document | walk:`offline.reload` |
| `sample.md` / welcome document on first visit (`welcome.md`) | walk:`boot.sampleLoaded` |
| `.nojekyll`, `run-local.sh`, `run-local.bat` | files exist; `run-local.sh` serves on 8080 |

## Editor and preview
| Feature | Verify |
|---|---|
| Textarea editor left, live preview right (marked GFM: headings, emphasis, code, tables, task lists) | walk:`edit.preview` |
| Syntax highlighting in preview code blocks (highlight.js) | walk:`edit.preview` (`hljs` true) |
| Preview links open in a new tab with `rel=noopener noreferrer` (href is HTML-escaped only; see MDS-B-001) | inspect a preview link |
| Frontmatter bar, lite math, lite diagrams (patch 4; toggles in settings) | Templates > frontmatter / math / mermaid snippet renders |
| Synced scrolling editor/preview + sync meter | scroll editor, preview follows |
| Draggable divider, double-click resets; split presets editor-first / balanced / review | drag + double-click divider; palette `patch6-split-*` |
| Line numbers gutter, current-line highlight, wrap toggle, tab size, editor font size | Settings modal toggles reflect in editor |
| Undo / redo history (own stack) | walk:`key.Ctrl+Z`, `key.Ctrl+Y`, `key.Ctrl+Shift+Z` |
| Find and replace bar (Enter next, Shift+Enter previous, Enter in replace field replaces, Esc closes) | walk:`key.Ctrl+F`, `key.Escape.find` |
| Selection toolbar (contextual formatting on selection) | select text, toolbar appears |
| Slash menu (type `/`; arrows, Enter/Tab run, Esc closes), 14 items: heading1, heading2, bullet, task, quote, checklist, meeting, review, code, table, image, gif, callout, datetime | walk:`slash.open`, `slash.escape`, `slash.enterInserts`; fingerprint `slash` list |
| Typewriter mode, paragraph focus, spellcheck toggle, word goal | walk:`key.Alt+Shift+T/P/S/G` |
| Clipboard image paste and drag-and-drop image embed (data URL) | paste a screenshot into the editor |
| Zen mode, focus mode, preview hide/show | walk:`key.Ctrl+/`, `key.Ctrl+.`; palette `togglePreview` |
| Utility sidebar: outline (jump to heading), stats, recent sessions | walk:`key.Ctrl+Shift+O`, `key.Ctrl+Shift+R`, `key.Ctrl+Alt+S` |

## Keyboard shortcuts (frozen)
Global handler `handleKeyDown` (window keydown) unless noted. Ctrl = Ctrl on Windows/Linux, Cmd on macOS.
| Shortcut | Action | Verify |
|---|---|---|
| Ctrl+N | New document (confirms discard if dirty) | walk:`key.Ctrl+N` |
| Ctrl+O | Open file (native picker or upload input) | walk:`key.Ctrl+S/Ctrl+Shift+S/Ctrl+O` (`open` picker) |
| Ctrl+S | Save (native, reuses handle) or download | same step (`save` picker) |
| Ctrl+Shift+S | Save As (always picker) or download | same step (second `save`) |
| Ctrl+P | Command palette (Up/Down move, Enter run, Esc close) | walk:`key.Ctrl+P`, `key.Escape.palette` |
| Ctrl+, | Workspace settings | walk:`key.Ctrl+Comma` |
| Ctrl+B / Ctrl+I / Ctrl+K | Bold / italic / link (`[text](https://example.com)`) on selection | walk:`key.Ctrl+B`, `key.Ctrl+I`, `key.Ctrl+K` |
| Ctrl+F | Find / replace (also from editor `onKeyDown`) | walk:`key.Ctrl+F` |
| Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y | Undo / redo / redo (not when focus is in another input) | walk:`key.Ctrl+Z`, `key.Ctrl+Shift+Z`, `key.Ctrl+Y` |
| Tab / Shift+Tab (editor) | Indent / outdent by tab size | walk:`key.Tab`, `key.Shift+Tab` |
| Ctrl+/ | Toggle zen mode | walk:`key.Ctrl+/` |
| Ctrl+. | Toggle focus mode | walk:`key.Ctrl+.`, `key.Ctrl+..off` |
| Ctrl+Shift+O | Outline sidebar | walk:`key.Ctrl+Shift+O` |
| Ctrl+Alt+S | Stats sidebar | walk:`key.Ctrl+Alt+S` |
| Ctrl+Shift+R | Recent sessions sidebar | walk:`key.Ctrl+Shift+R` |
| Alt+Shift+T | Typewriter mode | walk:`key.Alt+Shift+T` |
| Alt+Shift+P | Paragraph focus | walk:`key.Alt+Shift+P` |
| Alt+Shift+S | Spellcheck toggle | walk:`key.Alt+Shift+S` |
| Alt+Shift+G | Set word goal (prompt) | walk:`key.Alt+Shift+G` |
| F1 | Shortcuts sheet | walk:`key.F1`; fingerprint `shortcutsSheet` (28 entries) |
| Esc | Closes, in order: toolbar/document menu, dialog, palette, shortcuts, find bar, sidebar, zen | walk:`key.Escape.*` |
| Esc in Settings | Does NOT close Settings today (observed, recorded) | walk:`key.Escape.settings(observed)` = still open |
| `/` (editor) | Slash menu | walk:`slash.open` |
| Ctrl+V (editor) | Paste; images become embeds | manual paste |
| Double-click divider | Reset split | manual |

## Command palette (49 commands; ids frozen; walk fingerprint `commands`)
File: `new`, `open`, `save`, `saveAs`. Export: `exportTxt`, `exportHtml`, `exportPdf`, `exportDocx`.
View: `togglePreview`, `toggleZen`, `toggleFocus`, `patch6-doc-info`, `patch6-split-editor-first`,
`patch6-split-balanced`, `patch6-split-review`. Sidebar: `outline`, `stats`, `recent`.
Tools: `find`, `shortcuts`, `copyMd`, `copyHtml`, `settings`, `guide`, `updates`, `copyShortcuts`,
`copyReleaseNotes`, `templates`, `resetWorkspace`. Navigate: `top`, `bottom`.
Theme: `themeToggle`, `presetSky`, `presetViolet`, `presetEmerald`.
Writing: `patch7-slash`, `patch7-typewriter`, `patch7-focus-paragraph`, `patch7-spellcheck`, `patch7-word-goal`,
`patch7-clear-goal`. Insert: `patch7-snippet-checklist`, `patch7-snippet-meeting`.
Workspace: `appSetup`, `exportWorkspaceBackup`, `importWorkspaceBackup`, `restoreBrowserBackup`,
`requestPersistentStorage`, `installApp`.

## Toolbar, menus and modals
| Feature | Verify |
|---|---|
| Header actions New / Open / Save / Palette (labels switch to Upload / Download without FS Access API) | open over plain http on a LAN IP: labels read Upload/Download |
| Toolbar menus: format, insert, view, panels, tools, export, workspace (Esc / outside click closes) | click each menu |
| Format actions h1, h2, bullet, ordered, task, quote, code, table, rule | toolbar Format menu |
| Insert dialogs: image, gif, file link, code, table, callout, date/time | toolbar Insert menu, submit each |
| Templates modal (blank-note, meeting-notes, readme, release-notes, frontmatter, mermaid, math, callout snippets) | palette `templates` |
| Snapshots / versions modal, restore, delete, clear all, diff view | toolbar Workspace menu > Versions |
| Style studio: preview themes studio / paper / midnight / terminal, print layout, custom preview CSS, reset | toolbar Workspace menu > Style studio |
| Settings modal (app theme, accent, autosave, disk sync, wrap, tab size, font size, preview theme, live preview, focus mode, reduced motion, print layout, lightweight math/diagrams, clear recents/snapshots) | walk:`key.Ctrl+Comma`; toggle each |
| Welcome / quick start modal, release notes modal | first visit; palette `guide`, `updates` |
| Document popover (disk state, autosave, host, last save, browser backup, storage) | click file name in header |
| App setup modal (install, backup export/import/restore/clear, persistent storage, runtime info) | palette `appSetup` |
| Toasts for success/error | any export shows a toast |

## Export, copy, file IO
| Feature | Verify |
|---|---|
| Export TXT (`<name>.txt`, plain text of preview) | walk:`export.txt` |
| Export standalone HTML (`<name>.html`) | walk:`export.html` |
| Export DOCX (`<name>.docx`, zip `PK..`) | walk:`export.docx` |
| Export PDF (opens print window, "Save as PDF") | walk:`export.pdf(window.open)` |
| Copy markdown / copy rendered HTML | walk:`copy.markdown`; palette `copyHtml` |
| Native open/save via File System Access API (secure context); upload/download fallback otherwise | walk:`key.Ctrl+S/Ctrl+Shift+S/Ctrl+O` |

## Workspace, storage, PWA
| Feature | Verify |
|---|---|
| Autosave to localStorage `markdown-studio-local:v1`; survives reload | walk:`persist.reload` |
| IndexedDB mirror (`markdown-studio-patch9`/`workspace`/`current-workspace`) ~720 ms after edits | walk:`backup.restoreBrowser` |
| Workspace backup export (`<name>-workspace.json`, keys app, exportedAt, schema, source, state, version) | walk:`backup.export` |
| Workspace backup import (JSON file input) | walk:`backup.import` |
| Restore browser backup, clear browser backup, request persistent storage | walk:`backup.restoreBrowser`; App setup buttons |
| Recent documents list (restore / remove / clear) | Ctrl+Shift+R sidebar |
| Theme toggle light/dark (`html.dark`, highlight theme swap) + accent presets sky / violet / emerald | walk:`theme.toggle` |
| Unsaved-changes guard (`beforeunload`, confirm on new/open) | walk:`key.Ctrl+N` dialogs list has `confirm` |
| Service worker registration (secure context), update toast when a new SW is waiting | walk:`offline.reload` (`swReady`, `controlled`) |
| Install prompt (`beforeinstallprompt`) via App setup / palette `installApp` | Chrome desktop: install icon; palette shows toast |

## Sign-in (added 3206216, shared contract app `studio`)
| Feature | Verify |
|---|---|
| Optional "Continue with Google / GitHub" in the top bar (`js/auth.js`, `js/supabase-config.js`, `styles/auth.css`, `vendor/supabase.js`), loaded after the editor; guests keep every feature and local save | open app signed out: editor works, sign-in button visible; walk 48/48 unchanged |
| Precache now includes the sign-in files; cache name `markdown-studio-shell-v10` | walk:`offline.reload` |
