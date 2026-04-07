# Patch 3 Agent Guide — Markdown Studio Local

## Scope
Patch 3 upgrades the refined Patch 2 build with **productivity and polish** features while preserving the current local-first architecture and laptop-friendly split workspace.

## Files changed
- `js/app.js`
- `styles/app.css`
- `README.md`
- `sample.md`

## Main Patch 3 features
- command palette with search + keyboard navigation
- utility sidebar with **outline / stats / recent** tabs
- autosave status + last autosave / last disk save indicators
- recent local sessions with restore/remove/clear actions
- session restore on reload when autosave is enabled
- focus mode with active-pane emphasis
- accent presets: sky / violet / emerald
- preview sync meter in the preview pane header
- smoother UI transitions for palette, panes, sidebar, and status feedback

## Merge notes
- This patch is intentionally layered on top of the Patch 2 React class app instead of rewriting the project.
- No new external runtime dependencies were added.
- All new Patch 3 persistence stays inside local browser storage.
- Recent local sessions store markdown snapshots only up to a size cap; larger entries keep metadata and snippet text.
- The app still works offline after extraction and local serving.

## Acceptance checklist
- [ ] Left editor / right preview layout still works on laptop widths
- [ ] `Ctrl/Cmd + P` opens the command palette
- [ ] Arrow keys + Enter work inside the command palette
- [ ] Outline sidebar jumps to headings in the editor
- [ ] Stats sidebar updates live while typing
- [ ] Recent sessions list updates after save/open/new/restore
- [ ] Focus mode emphasizes the active pane
- [ ] Accent preset dropdown changes the app accent styling
- [ ] Autosave state shows saving / saved / restored as expected
- [ ] Refresh restores the draft when autosave is enabled

## Notes for future patches
Patch 4 can safely build on top of this by adding Mermaid, math, templates, frontmatter, version history, and preview customization.
