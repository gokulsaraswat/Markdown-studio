# WORKLOG: Markdown-studio

Master status of all repos: platform/docs/WORKLOG.md (see docs/PLATFORM-DOCS.md). Update this file after every step.

## Current state
Static vanilla JS app (React 16 UMD, no build step) deployed from `main` root to GitHub Pages:
https://gokulsaraswat.github.io/Markdown-studio/. Upgrade run phase A (inventory) in progress.

## Done
- 2026-11-25 kit fix: removed duplicated `docs/master/`, `docs/project/`, `WORKLOG-PROJECT.md` (23 tracked files,
  stale copies of platform/docs); added `docs/PLATFORM-DOCS.md` pointer; CLAUDE.md tracking rule now points to
  platform/docs/WORKLOG.md and keeps PRIVATE-*.md at the workspace root only.

- 2026-11-25 smoke: `tests/smoke/walk.mjs` (puppeteer-core from a scratch dir, not a dependency) walks boot, edit +
  preview, every keyboard shortcut, slash menu, file keys (pickers stubbed), TXT/HTML/DOCX/PDF export, copy,
  backup export/import/restore, theme, reload persistence, manifest, offline reload. 48/48 ok, 0 console errors;
  `tests/smoke/baseline.fingerprint.json` is the timing-free baseline (two runs identical).

## In progress / next
- Phase A: docs/ARCHITECTURE.md, docs/FEATURES.md (inventory + shortcut list + baseline numbers), smoke walk.

## Blockers / requests to other repos
- platform: `platform/docs/CONTEXT.md` line 36 still says "then `docs/master/WORKLOG.md` if present". This repo's copy
  now points to `platform/docs/WORKLOG.md` via docs/PLATFORM-DOCS.md; update the master so sync-kit does not revert it.

## Assumptions
- `docs/CONTEXT.md` is a synced copy, but its `docs/master/` pointer would dangle after the kit fix, so it was updated
  here (one line) and a request was logged for platform.

## Reminders
- Scope of this repo is not final; see docs/KICKOFF-PROMPT.md "Questions to ask me first".
