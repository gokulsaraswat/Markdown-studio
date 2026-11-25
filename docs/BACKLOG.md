# BACKLOG: Markdown-studio (MDS)

Rules: `RULES.md` section 4. Architecture: `docs/ARCHITECTURE.md`. Public-safe: no secrets, no employer material.
Priority: P0 broken/blocking or security, P1 important, P2 worthwhile, P3 nice to have.
Status: open, doing, blocked, done, dropped. Cross-repo: `needs:` waits on, `blocks:` is waited on by.

## Bugs
| ID | Title | Pri | Status | Needs/Blocks | Notes (where, repro, evidence) |
|---|---|---|---|---|---|
| MDS-B-002 | a11y: preview task-list checkboxes have no accessible label | P2 | open | | Lighthouse `label`, `article.preview-sheet > ul > li > input` |
| MDS-B-003 | a11y: `hljs-keyword` colour fails contrast in preview code | P2 | open | | Lighthouse `color-contrast`, highlight-light/dark.css |
| MDS-B-004 | a11y: `.view-segment` has `role=tablist` without `tab` children | P2 | open | | Lighthouse `aria-required-children`, header view switch |

## Improvements
| ID | Title | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|
| MDS-I-002 | Startup: 4 render-blocking vendor scripts + 512 KB app.js; lazy-load highlight.js (133 KB) | P2 | open | | Lighthouse local mobile 61 (render-blocking 5.9 s), live mobile 93; keep SW precache in sync + bump cache |
| MDS-I-003 | Esc does not close the Settings modal (other modals close) | P3 | open | | Recorded as current behaviour in walk `key.Escape.settings(observed)`; change only with a fingerprint update |

## Features
| ID | Title | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|
| MDS-F-001 | Serve under hub path `/studio` (relative paths already; check SW scope + 404 redirect) | P2 | open | | From docs/CONTEXT.md vision |

## Ideas (unscoped, not committed to)
| ID | Idea | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|

## Tech debt
| ID | Title | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|
| MDS-D-003 | js/app.js is one 11,966-line IIFE with patch 1-9 prototype overrides | P2 | open | | Split into ES modules only if tests/smoke/walk.mjs fingerprint stays identical |
| MDS-D-004 | Old vendored libs: React 16.0.0, highlight.js 11.0.1, marked (2022 build) | P2 | open | | No package.json; update with walk + fingerprint check |
| MDS-D-005 | Stale root docs: README "Patch 9" lists PATCH_9_DIFF.txt / PATCH_9_MANIFEST.txt that do not exist; FINAL_QA_CHECKLIST / GITHUB_PAGES_DEPLOYMENT overlap docs/FEATURES.md | P3 | open | | docs/patches/ holds the guides |

## Done (recent)
| ID | Title | Commit | Date |
|---|---|---|---|
| MDS-B-001 | Preview XSS fixed: DOMPurify 3.2.6 sanitizes all preview HTML (`sanitizePreviewHtml` in postProcessRenderedHtml); payload test: script, onerror, javascript: link, iframe removed, 0 alerts; walk 48/48 fingerprint identical | (this commit) | 2026-11-25 |
| MDS-I-004 | docs/FEATURES.md inventory (routes, features, 49 commands, 14 slash items, all shortcuts) + baseline numbers | a1f5ba4 | 2026-11-25 |
| MDS-F-002 | Optional Google/GitHub sign-in (shared contract, app `studio`): js/auth.js, supabase-config.js, styles/auth.css, vendor/supabase.js; walk fingerprint unchanged | 3206216 | 2026-11-25 |
| MDS-D-002 | Add docs/ARCHITECTURE.md (only what exists) | 660662e | 2026-11-25 |
| MDS-I-001 | Scripted behaviour walk tests/smoke/walk.mjs + baseline fingerprint (48 steps) | ecaeb40 | 2026-11-25 |
| MDS-D-001 | Replace duplicated docs/master, docs/project, WORKLOG-PROJECT.md with docs/PLATFORM-DOCS.md; fix CLAUDE.md tracking rule | 82d9c77 | 2026-11-25 |
