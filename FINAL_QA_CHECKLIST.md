# Final QA Checklist

## Core layout
- [ ] editor is on the left and preview is on the right
- [ ] default split still feels comfortable on a 14-inch laptop
- [ ] divider hover help appears
- [ ] divider drag updates cleanly
- [ ] divider double-click reset works

## Header and workspace chrome
- [ ] top bar remains compact
- [ ] no noisy patch-brand text appears in active writing surfaces
- [ ] document popover still opens and closes correctly
- [ ] grouped menus still work

## File handling
- [ ] Open/Upload label matches the browser capability
- [ ] Save/Download label matches the browser capability
- [ ] opening a markdown file still loads content correctly
- [ ] saving or downloading still clears the dirty state

## App setup and backup
- [ ] App setup modal opens and scrolls correctly on a small laptop screen
- [ ] exporting a workspace backup downloads a JSON file
- [ ] importing a workspace backup restores the workspace
- [ ] restore browser backup works after a backup has been written
- [ ] clear browser backup works
- [ ] request persistent storage does not throw errors

## Offline and install shell
- [ ] `manifest.webmanifest` loads
- [ ] `service-worker.js` loads
- [ ] service worker registers on a local or hosted secure context
- [ ] install button state behaves sensibly in the test browser

## Existing feature regression checks
- [ ] slash commands still work
- [ ] selection toolbar still appears
- [ ] exports still work
- [ ] templates, versions, diff, and style studio still open
- [ ] settings, release notes, and welcome modal still scroll
- [ ] preview sync meter still matches preview width

## GitHub Pages smoke test
- [ ] app loads from the published Pages URL
- [ ] refreshing the root URL still loads the app
- [ ] browser upload/download fallback works if native file access is unavailable
- [ ] command palette still opens on the hosted site
- [ ] browser backup export/import still works on the hosted site
