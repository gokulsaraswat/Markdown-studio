# Markdown Studio Local — Patch 7 Smart Writing

A fully local markdown studio with a left-side editor, right-side preview, export tools, power-user workflows, and a new writing-first patch that makes the editor faster to use on laptop screens.

Patch 7 keeps all earlier features, but brings the next layer of UX directly into the editor instead of adding more permanent chrome:
- **slash commands** inside the editor for headings, snippets, media, tables, callouts, and timestamps
- **contextual selection toolbar** that appears only when text is selected
- **typewriter mode** to keep the active line centered while drafting
- **paragraph focus mode** to dim surrounding text and isolate the current block
- **spellcheck toggle** for browser-native spelling hints
- **clipboard image paste** and **image/GIF drag-drop insert**
- **word goal tracking** with progress in the bottom status bar

## What Patch 7 adds

Patch 7 focuses on writing flow rather than more static buttons.

It adds:
- **slash commands** triggered by typing `/` in the editor
- **quick snippets** for checklist, meeting notes, review summary, note callout, and code fence
- **selection-aware mini toolbar** for bold, italic, links, code, quote, and note callouts
- **typewriter mode**, **paragraph focus mode**, and **spellcheck** controls under Tools and the command palette
- **word goal prompts** with progress shown in the compact status bar
- **image paste from clipboard** and **drop-to-embed image files** directly in markdown
- updated **README**, **sample markdown**, **changelog**, **QA checklist**, and **agent patch guide**

## Full feature set

### Core workspace
- editor on the left and preview on the right
- draggable split divider with hover guidance and reset behavior
- instant preview updates as you type
- synced scrolling between editor and preview
- dark and light themes
- accent presets
- grouped menus that keep advanced actions out of the way until needed

### Editing and writing
- quick-format strip for bold, italic, links, headings, lists, and tasks
- grouped format, insert, export, view, tools, panels, and workspace menus
- contextual selection toolbar for selection-only formatting
- slash commands for structure, snippets, media, tables, callouts, and timestamps
- quick snippets for common note patterns
- undo and redo
- autosave toggle
- wrap toggle
- tab size selector
- editor font size selector
- spellcheck toggle
- current-line highlight
- typewriter mode
- paragraph focus mode
- find and replace
- jump to top and bottom
- word-goal tracking

### Files and export
- native open/save and save-as with the File System Access API when available
- download fallback when native handles are unavailable
- export TXT
- export HTML
- export PDF through the browser print dialog
- export DOCX
- drag-and-drop markdown open
- drag-and-drop image embed
- clipboard image paste
- copy markdown and rendered HTML

### Productivity and power tools
- command palette
- focus mode and zen mode
- outline, stats, and recent sessions sidebar
- template gallery and snippets
- snapshot history, restore, and diff compare
- preview style studio and custom preview CSS
- frontmatter bar in preview
- lightweight local math rendering
- lightweight local diagram rendering
- optional automatic disk sync for native file handles
- grouped workspace menu for templates, versions, settings, and release notes

## Run it

### Best experience
Serve the folder locally so the File System Access API can work in supported Chromium-based browsers.

#### Windows
Run `run-local.bat`

#### macOS / Linux
```bash
chmod +x run-local.sh
./run-local.sh
```

Then open `http://localhost:8080`.

### Direct open
You can also open `index.html` directly. The editor still works, but browsers may fall back to download-based save/open behavior instead of native file handles.

## Useful Patch 7 workflow hints
- type **`/`** in the editor to open slash commands
- select text to reveal the **compact selection toolbar**
- use **Tools** or the **command palette** for typewriter mode, paragraph focus, spellcheck, and word goals
- paste images directly into the editor with **Ctrl/Cmd + V**
- drag images or GIFs into the editor to embed them as markdown assets
- keep the **right drawer** closed until you need outline, stats, or recent sessions

## Included documentation
- `CHANGELOG.md` — merged patch history including Patch 7 smart-writing improvements
- `FINAL_QA_CHECKLIST.md` — manual validation checklist for the merged build
- `PATCH_7_AGENT_GUIDE.md` — instructions for an AI agent applying Patch 7
- `PATCH_7_DIFF.txt` — summary of files changed in this patch
- `PATCH_7_MANIFEST.txt` — patch bundle manifest

## Files
- `index.html` — app entry point
- `js/app.js` — React app logic
- `styles/app.css` — application styling
- `styles/tailwind.generated.css` — bundled utility classes used by the UI
- `vendor/` — bundled local libraries
- `sample.md` — sample document for testing Patch 7 writing features

## Notes
- The app remains fully local and offline-friendly after the initial file load.
- Patch 7 is intentionally editor-first: it adds power by revealing context when needed, not by pinning more buttons to the UI.
- Clipboard image paste and image drag-drop embed data directly into the markdown file using local data URLs.
