# Patch 7 Agent Guide — Smart Writing

## Goal
Apply Patch 7 on top of the Patch 6 project to make the editor more writing-first and keyboard-first without adding more permanent chrome.

## Scope
Patch 7 adds:
- slash commands in the editor
- contextual selection toolbar
- typewriter mode
- paragraph focus mode
- spellcheck toggle
- word goal tracking
- clipboard image paste
- image/GIF drag-drop embed
- updated docs and QA files

## Main files changed
- `js/app.js`
- `styles/app.css`
- `README.md`
- `CHANGELOG.md`
- `FINAL_QA_CHECKLIST.md`
- `sample.md`

## Implementation notes
- Patch 7 is appended as a new override layer on top of the existing patch chain.
- Existing Patch 6 menus are preserved, but **Insert** and **Tools** are extended with smart-writing actions.
- New writing settings are persisted locally through the same browser storage key already used by the app.
- Image paste and drag-drop embedding use **data URLs** so the app stays fully local.
- The contextual toolbar and slash menu are editor overlays; they should not interfere with preview sync or export behavior.

## Acceptance checks
1. Typing `/` opens the slash menu and filtering works while continuing to type.
2. `Enter`, `Tab`, `ArrowUp`, `ArrowDown`, and `Escape` work inside the slash menu.
3. Selection toolbar appears only when text is selected and the editor is focused.
4. Typewriter mode and paragraph focus mode do not break basic editing or scroll sync.
5. Clipboard image paste inserts markdown with embedded image data.
6. Dropping only image files into the editor embeds them instead of opening them.
7. Word goal progress updates as the word count changes.
8. All previous Patch 6 features still work.

## Merge strategy
- Replace the files in the project with the Patch 7 versions.
- Run the final QA checklist.
- Serve the app locally and smoke-test the editor manually in a Chromium-based browser.
