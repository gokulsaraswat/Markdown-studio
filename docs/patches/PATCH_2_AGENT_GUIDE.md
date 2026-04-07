# Patch 2 Agent Guide — Export and Insert Features

## Goal
Upgrade the Patch 1 editor with local-first export tools and richer insert workflows while preserving the stable laptop-friendly split layout.

## Files changed
- `js/app.js`
- `styles/app.css`
- `README.md`
- `sample.md`

## Patch 2 scope
### Export
- TXT export
- HTML export
- PDF export through browser print flow
- DOCX export through fully local packaging
- Copy markdown source
- Improved copy rendered HTML

### Insert
- Image insert from URL or local file
- GIF insert from URL or local file
- File link insert from URL or local file
- Code block insert with language dropdown
- Table builder dialog
- Callout builder dialog
- Date / time insert dialog

### Preview polish
- Callout rendering and styling
- Rich modal composer styling
- Export-ready standalone HTML styling

## Merge notes
- `js/app.js` adds dialog state, export helpers, insert helpers, DOCX packaging helpers, and new toolbar groups.
- `styles/app.css` adds callout styles and composer modal styles.
- Patch 2 should remain backward-compatible with Patch 1 content and autosaved drafts.

## Acceptance checklist
- [ ] Editor still opens with no console errors
- [ ] Split editor / preview layout still works on laptop screens
- [ ] Existing Patch 1 features still work
- [ ] Insert dialogs open and insert content at the cursor
- [ ] Local image or GIF insertion renders in preview
- [ ] Export TXT downloads a `.txt` file
- [ ] Export HTML downloads a standalone `.html` file
- [ ] Export PDF opens a print flow for saving to PDF
- [ ] Export DOCX downloads a `.docx` file
- [ ] Copy markdown and copy HTML both work

## Notes for next patches
- Patch 3 can layer command palette, outline, recent files, autosave state, and subtle motion.
- Patch 4 can layer Mermaid, math, templates, frontmatter, version history, and custom CSS.
