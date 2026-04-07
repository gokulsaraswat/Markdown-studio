# Patch 5 Agent Guide — Final polish update

## Objective
Apply the final polish layer on top of the Patch 4 build without breaking any existing editor, export, or power-user workflow.

## Files changed in Patch 5
- `js/app.js`
- `styles/app.css`
- `README.md`
- `sample.md`
- `CHANGELOG.md`
- `FINAL_QA_CHECKLIST.md`
- `PATCH_5_AGENT_GUIDE.md`
- `PATCH_5_DIFF.txt`
- `PATCH_5_MANIFEST.txt`

## Features added in Patch 5
- workspace settings modal
- quick-start guide modal
- release notes modal
- stacked toast notifications
- reduced motion toggle
- editor font size control
- refreshed default markdown and sample markdown
- packaged changelog and QA docs

## Integration rules
- preserve the existing left-editor / right-preview layout
- do not remove any Patch 1 to Patch 4 feature
- keep the app fully local and browser-first
- preserve File System Access API support and fallback save behavior
- keep the UI stable on typical laptop widths

## Expected behavior after merge
- the app opens with the normal editor layout and may show the quick-start guide if Patch 5 has not been acknowledged in local storage
- `Ctrl/Cmd + ,` opens the settings modal
- the header includes guide and settings actions
- toast notifications can stack and be dismissed individually
- a release notes modal is available from the command palette and help flows
- the package includes a changelog and final QA checklist

## Suggested merge order
1. replace `js/app.js`
2. replace `styles/app.css`
3. update `README.md` and `sample.md`
4. add the new documentation files
5. run a syntax check on `js/app.js`
6. perform the manual checks from `FINAL_QA_CHECKLIST.md`

## Validation tip
At minimum, verify:
- syntax passes for `js/app.js`
- settings modal opens
- quick-start guide opens
- release notes modal opens
- toasts stack and dismiss correctly
- split layout still works on laptop sizes
