# Patch 4 Agent Guide

## Goal
Upgrade the Patch 3 markdown editor with advanced power-user capabilities while keeping the app fully local, fast, and stable on laptop screens.

## Files changed in Patch 4
- `js/app.js`
- `styles/app.css`
- `README.md`
- `sample.md`

## Features added
- Template gallery with document starters and snippets
- Snapshot version history with restore, delete, and compare actions
- Diff viewer for snapshot vs current editor state
- Preview style studio with theme presets
- Custom preview CSS editor
- Print layout mode
- Frontmatter-aware preview metadata bar
- Lightweight local math rendering
- Lightweight local diagram rendering for simple mermaid flowcharts
- Auto disk sync toggle for native file handles

## Implementation notes
- Patch 4 builds directly on the existing Patch 3 architecture and keeps all prior features.
- Frontmatter is parsed locally and removed from the rendered markdown body.
- Snapshot history is stored locally through the existing local storage flow.
- Diagram and math rendering are intentionally lightweight and local-first; no new external CDN dependency was added.
- Custom preview CSS is injected into the live preview and also bundled into exported HTML and PDF print output.

## Acceptance checklist
- [ ] App loads without console syntax errors
- [ ] Existing Patch 1 to Patch 3 features still work
- [ ] Templates modal opens and applies both document and snippet templates
- [ ] Snapshots can be captured, restored, deleted, and compared
- [ ] Diff modal renders side-by-side snapshot vs current content
- [ ] Frontmatter metadata appears above the preview body
- [ ] Preview themes switch correctly
- [ ] Custom CSS updates the preview instantly
- [ ] Print layout mode changes the preview surface
- [ ] Lightweight math rendering works for inline and display examples
- [ ] Lightweight diagram rendering works for simple `graph TD` or `graph LR` mermaid blocks
- [ ] Auto disk sync can be enabled after opening or saving a native file handle

## Recommended manual smoke test
1. Run the app locally.
2. Open `sample.md`.
3. Use Templates, Snapshot, Versions, and Style studio from the Patch 4 ribbon.
4. Save the file, edit it again, and verify snapshots and disk save behavior.
5. Export HTML and PDF after applying a custom preview theme.
