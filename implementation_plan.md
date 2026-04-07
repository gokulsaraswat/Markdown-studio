# Implementation Plan

[Overview]
Deliver Patch 8 as the final cleanup pass by applying the Patch 8 content, relocating patch-history artifacts into a dedicated documentation area, removing non-runtime clutter from the project root, verifying the app still runs locally, and preparing the repository for a clean final push to GitHub.

The current project is a fully local, browser-based Markdown editor using `index.html` with static assets and pre-bundled vendor scripts. Patch 8 is intended to finalize the build and reduce repository clutter by keeping only runtime-essential files at the root while preserving patch history in a dedicated `/docs` or `/patches` area. The cleanup should not alter runtime behavior: `index.html`, `js/app.js`, styles, `vendor/`, `assets/`, and run scripts must remain intact and referenced as-is. Documentation should be updated to reflect Patch 8 as the final release and the new structure for historical patch artifacts.

[Types]
No type system changes are required because the codebase is plain JavaScript and static assets.

No new type definitions, interfaces, or schemas will be introduced. The cleanup is file-structure and documentation oriented only.

[Files]
The change set will relocate and prune non-runtime files while preserving runtime assets and required documentation.

Detailed breakdown:
- **New folders (if not present):**
  - `docs/patches/` (or `docs/` with a `patches/` subfolder) to store patch guides, diffs, manifests, and legacy patch folders.
- **Existing files to be moved (from project root):**
  - `PATCH_2_AGENT_GUIDE.md`, `PATCH_2_DIFF.txt`, `PATCH_2_MANIFEST.txt`
  - `PATCH_3_AGENT_GUIDE.md`, `PATCH_3_DIFF.txt`, `PATCH_3_MANIFEST.txt`
  - `PATCH_4_AGENT_GUIDE.md`, `PATCH_4_DIFF.txt`, `PATCH_4_MANIFEST.txt`
  - `PATCH_5_AGENT_GUIDE.md`, `PATCH_5_DIFF.txt`, `PATCH_5_MANIFEST.txt`
  - `PATCH_6_AGENT_GUIDE.md`, `PATCH_6_DIFF.txt`, `PATCH_6_MANIFEST.txt`
  - `PATCH_7_AGENT_GUIDE.md`, `PATCH_7_DIFF.txt`, `PATCH_7_MANIFEST.txt`
- **Existing folders to be moved (from project root):**
  - `Patches/` → `docs/patches/` (or `docs/` based on final naming) to keep patch bundles out of root.
- **Files to remain in root (runtime + primary docs):**
  - `index.html`, `js/app.js`, `styles/`, `vendor/`, `assets/`, `run-local.bat`, `run-local.sh`
  - `README.md`, `CHANGELOG.md`, `FINAL_QA_CHECKLIST.md`, `THIRD_PARTY_NOTICES.md`, `sample.md`
- **Documentation updates:**
  - `README.md` updated to describe Patch 8 as final release and mention patch history location.
  - `CHANGELOG.md` updated to include Patch 8 cleanup entry.
  - `FINAL_QA_CHECKLIST.md` updated to include verification for cleaned structure and runtime sanity check.

[Functions]
No new functions will be added because Patch 8 focuses on file organization and documentation only.

No function modifications are required unless Patch 8 introduces new UI behavior; if Patch 8 includes code changes, they will be applied by replacing `js/app.js` and `styles/app.css` with patch-provided versions.

[Classes]
No class additions or modifications are required for the cleanup plan.

The existing React-based app in `js/app.js` remains unchanged unless Patch 8 provides an updated build.

[Dependencies]
No dependency changes are required; the project remains a static bundle with vendor scripts.

No package manager files or dependency manifests will be introduced.

[Testing]
Validation will be manual smoke-testing using the existing local server script.

Steps:
- Run `run-local.bat` (Windows) or `run-local.sh` (macOS/Linux).
- Verify the app loads, editor/preview render, and primary menus/open/save flows are accessible.
- Confirm no missing asset errors occur due to file moves (especially for `assets/`, `vendor/`, `styles/`, and `js/`).

[Implementation Order]
Apply Patch 8 updates first, then clean and reorganize files, update documentation, and run a local smoke test before pushing.

1. Apply Patch 8 files (replace `js/app.js`, `styles/app.css`, docs, and sample if Patch 8 provides updates).
2. Create `docs/patches/` (or confirmed destination) and move all `PATCH_*` files plus `Patches/` into it.
3. Update `README.md`, `CHANGELOG.md`, and `FINAL_QA_CHECKLIST.md` to reflect Patch 8 finalization and new patch-history location.
4. Run the local server via `run-local.bat` (or `run-local.sh`) and perform a quick smoke test.
5. Commit and push the cleaned repository to GitHub once verification passes.