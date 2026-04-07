# Markdown Studio Local — Patch 8 Workspace Refinement

A fully local markdown studio with a **left editor**, **right preview**, grouped menus, exports, writing modes, templates, snapshots, and a cleaner laptop-first interface.

Patch 8 is a **hardening and UX cleanup** update. It keeps the feature set from patches 1–7, but makes the workspace calmer and more usable on 14-inch and 15-inch laptop screens.

## What Patch 8 improves

- reduces noisy always-visible chrome in the header
- keeps file details behind the file button instead of exposing every status label all the time
- keeps grouped menus for Insert, Export, View, Tools, Panels, and Workspace
- reduces the quick toolbar to a smaller set of high-frequency actions
- makes the **preview sync meter align with the preview frame width**
- gives the editor a wider default split for better writing space
- makes **settings, release notes, workspace surfaces, and longer panels scroll correctly** on smaller screens
- removes repeated patch branding from the main UI so the app feels more like a real product

## Full feature set

### Core workspace
- editor on the left and preview on the right
- live preview while typing
- synced scrolling between editor and preview
- draggable divider with hover guidance and double-click reset
- split, editor-only, preview-hidden, and zen workflows
- dark and light themes
- accent presets

### Writing and editing
- slash commands
- contextual selection toolbar
- typewriter mode
- paragraph focus mode
- spellcheck toggle
- autosave toggle
- tab size control
- wrap toggle
- find and replace
- undo and redo
- line numbers and current-line highlight
- word goal tracking

### Insert and export
- insert image, GIF, file link, code block, table, callout, date/time
- clipboard image paste
- drag-and-drop image embed
- export TXT, HTML, PDF, and DOCX
- copy markdown source and rendered HTML

### Workspace and power features
- command palette
- utility sidebar with outline, stats, and recents
- templates and snippets
- version snapshots
- diff view
- style studio and custom preview CSS
- print layout mode
- lightweight math and diagram rendering
- release notes and quick-start modal

## Running locally

Best option after extracting:
- **Windows:** run `run-local.bat`
- **macOS / Linux:** run `run-local.sh`

Opening `index.html` directly still works, but serving over localhost gives the best support for the File System Access API.

## Patch 8 UX goals

This patch is specifically meant to fix the following problems from the previous build:

- too many static labels competing for space
- too little writing room on laptop screens
- scroll clipping in long modals and workspace surfaces
- preview meter width looking detached from the preview pane
- power-user text and patch labels showing up too often in the interface

## Recommended testing flow

1. Open the app and confirm the editor starts on the left and preview on the right.
2. Check that the header feels smaller and calmer than before.
3. Drag the divider and confirm the tooltip appears and double-click reset works.
4. Open **Settings**, **Updates**, and **Workspace** surfaces on a laptop-sized window and verify they scroll.
5. Confirm the preview sync meter spans the same framed width as the preview area.
6. Use slash commands, selection toolbar, exports, templates, and snapshots to confirm older features still work.

## Agent patch files

This project now includes:
- `PATCH_8_AGENT_GUIDE.md`
- `PATCH_8_DIFF.txt`
- `PATCH_8_MANIFEST.txt`
- `FINAL_QA_CHECKLIST.md`

## Notes

Patch 8 is the right place to stop adding major UI chrome. From here, future work should focus on **accessibility, stability, performance, and careful quality improvements**, not random permanent buttons.
