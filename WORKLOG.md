# WORKLOG: Markdown-studio

Master status of all repos: platform/docs/WORKLOG.md (see docs/PLATFORM-DOCS.md). Update this file after every step.

## Current state
Static vanilla JS app (React 16 UMD, no build step) deployed from `main` root to GitHub Pages:
https://gokulsaraswat.github.io/Markdown-studio/. Upgrade run phase A (inventory, kit fixes, smoke walk, baseline) done 2026-11-25.
Markdown Studio program (plan: workspace-root MARKDOWN-STUDIO-PLAN.md): Phase 0 DONE 2026-11-25 (security + a11y).
Next: Phase 1 = Vite + ES modules + React 19 refactor with an identical walk fingerprint; then CodeMirror 6 (phase 2).

## Done
- 2026-11-25 Phase 0: MDS-B-001 XSS fixed (DOMPurify 3.2.6 on all preview HTML, 98d7541; payload test 0 alerts);
  MDS-B-002..004 a11y (task checkbox labels, dark keyword contrast 5.7:1, view switch role=group + aria-pressed, b309f7a);
  FEATURES.md restored from the paused stash (a1f5ba4). Walk 48/48 every step; baseline changed only for +24 B HTML/DOCX export.
- 2026-11-25 kit fix: removed duplicated `docs/master/`, `docs/project/`, `WORKLOG-PROJECT.md` (23 tracked files,
  stale copies of platform/docs); added `docs/PLATFORM-DOCS.md` pointer; CLAUDE.md tracking rule now points to
  platform/docs/WORKLOG.md and keeps PRIVATE-*.md at the workspace root only.
- 2026-11-25 smoke: `tests/smoke/walk.mjs` (puppeteer-core from a scratch dir, not a dependency) walks boot, edit +
  preview, every keyboard shortcut, slash menu, file keys (pickers stubbed), TXT/HTML/DOCX/PDF export, copy,
  backup export/import/restore, theme, reload persistence, manifest, offline reload. 48/48 ok, 0 console errors;
  `tests/smoke/baseline.fingerprint.json` is the timing-free baseline (two runs identical).
- 2026-11-25 docs/ARCHITECTURE.md added (runtime, files, app.js patch layering, storage keys, SW strategy).
  Backlog: MDS-B-001 (P1, unsanitized preview HTML executes inline handlers, verified), MDS-B-002..004 (a11y),
  MDS-I-002/003, MDS-F-001, MDS-D-003..005.
- 2026-11-25 docs/FEATURES.md: do-not-break inventory with verify steps; baseline (at 82d9c77): no build/lint/unit
  tests exist; `node --check` js/app.js + service-worker.js ok; walk 48/48; app.js 512,484 B, vendor 343,891 B,
  CSS 125,671 B, precache 18 files 999,855 B; cold local load 11 req / 988 KB, app ready 264-502 ms;
  Lighthouse live mobile 93/86/100/100 (FCP 2.6 s, 229 KiB gzip), desktop 100/90/100/100.

- 2026-11-25 sign-in (shared platform contract, app id `studio`): optional Google/GitHub sign-in through Supabase
  (PKCE). Isolated for the planned refactor: `js/auth.js` (all logic, mounts a control into `.topbar-actions`,
  no edits to js/app.js), `js/supabase-config.js` (project URL + public anon key, RLS-protected), `styles/auth.css`,
  `vendor/supabase.js` (supabase-js 2.119.2 UMD). Guests keep everything incl. local save; signed-in menu shows
  account, access status (request_access('studio') filed once per load), Connected accounts (link/unlink, last one
  kept), sign out. SW: new files in APP_SHELL, CACHE_NAME v10. Walk 48/48, fingerprint identical; startup +4
  requests / +245 KB (deferred, after the editor). Needs in Supabase: redirect URLs
  `https://gokulsaraswat.github.io/Markdown-studio/**` and the local serving origin (e.g. `http://127.0.0.1:8765/**`).

## In progress / next
- Phase A (inventory) done. Next: phase B (fix MDS-B-001 sanitizer, a11y MDS-B-002..004, lazy-load highlight.js
  MDS-I-002), each proven with `tests/smoke/walk.mjs` against `tests/smoke/baseline.fingerprint.json`.
- Redesign (Margin flavor) goes on branch `redesign/Markdown-studio`, never merged to main.

## Blockers / requests to other repos
- platform: `platform/docs/CONTEXT.md` line 36 still says "then `docs/master/WORKLOG.md` if present". This repo's copy
  now points to `platform/docs/WORKLOG.md` via docs/PLATFORM-DOCS.md; update the master so sync-kit does not revert it.

## Assumptions
- No build/lint/test tooling exists, so the "green baseline" is `node --check` + the scripted walk + Lighthouse;
  no package.json was added (puppeteer-core and lighthouse stay in a scratch dir).
- Walk fingerprint records current behaviour as-is, including Esc not closing Settings (MDS-I-003).
- `docs/CONTEXT.md` is a synced copy, but its `docs/master/` pointer would dangle after the kit fix, so it was updated
  here (one line) and a request was logged for platform.

## Reminders
- Scope of this repo is not final; see docs/KICKOFF-PROMPT.md "Questions to ask me first".

- 2026-11-26 Upgrade program: status of all 7 repos and how to resume is in platform/docs/UPGRADE-PROGRAM.md (read it first).
