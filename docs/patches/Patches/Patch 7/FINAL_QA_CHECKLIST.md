# Markdown Studio Local — Final QA Checklist

## Patch 7 smart writing
- [ ] typing `/` inside the editor opens the slash command menu
- [ ] slash commands can insert a heading, checklist, meeting notes snippet, and open media/table/callout builders
- [ ] selecting text shows the contextual selection toolbar
- [ ] selection toolbar actions apply bold, italic, link, code, quote, and note formatting correctly
- [ ] typewriter mode keeps the active line closer to the center while editing
- [ ] paragraph focus mode dims surrounding text and follows the current block
- [ ] spellcheck toggle changes browser spellchecking inside the editor
- [ ] setting a word goal updates the progress chip in the status bar
- [ ] reaching the word goal shows progress correctly and does not break typing flow
- [ ] pasting an image from the clipboard inserts markdown with an embedded data URL
- [ ] dropping image files into the editor embeds them instead of opening them as a document

## Patch 6 UX cleanup
- [ ] the file name in the header opens a document popover
- [ ] static labels like save state and file access are no longer permanently visible in the main header
- [ ] grouped menu buttons open the correct panels: Format, Insert, Export, View, Tools, Panels, Workspace
- [ ] the quick-format strip still applies common markdown actions immediately
- [ ] the divider shows guidance on hover and live ratios while dragging
- [ ] double-clicking the divider resets to the editor-first split
- [ ] the default split feels better on a laptop-sized screen
- [ ] the header, pane headers, and status bar consume less vertical space than before

## Core workspace
- [ ] editor is on the left and preview is on the right in split mode
- [ ] live preview updates while typing
- [ ] synced scrolling works both ways
- [ ] laptop layout feels stable at common widths

## Files and exports
- [ ] native open/save works when served on localhost
- [ ] TXT, HTML, PDF, and DOCX exports complete successfully
- [ ] document popover reflects correct file/save state

## Power features
- [ ] command palette, outline, recents, snapshots, diff, and style studio all open correctly
- [ ] settings, quick start, release notes, and notification stack work as expected
