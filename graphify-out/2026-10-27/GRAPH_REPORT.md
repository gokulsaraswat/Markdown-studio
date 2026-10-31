# Graph Report - Markdown-studio  (2026-10-27)

## Corpus Check
- 47 files · ~215,140 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: .css 7, (none) 2, .webmanifest 2)

## Summary
- 1942 nodes · 5096 edges · 83 communities (77 shown, 6 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 370 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0389289c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- markdown_editor_pro_patch9_files/js/app.js
- Markdown-studio/js/app.js
- Nb
- highlight.min.js
- MarkdownStudioApp
- MarkdownStudioApp
- MarkdownStudioApp
- .render
- Patch 7/js/app.js
- .renderToolbarDropdown
- .renderToolbarDropdown
- .renderToolbarDropdown
- .renderToolbarDropdown
- MarkdownStudioApp
- markdown_editor_pro_patch8_files/js/app.js
- .showToast
- .showToast
- .showToast
- clamp
- .render
- We
- .componentDidMount
- .componentDidMount
- marked.js
- .showToast
- .componentDidMount
- .handleExportDocx
- .handleExportDocx
- .updateMarkdown
- Markdown Studio — Patch 9 Web Deployment and Reliability
- Markdown Studio — Patch 9 Web Deployment and Reliability
- GitHub Pages Deployment Guide
- GitHub Pages Deployment Guide
- m
- Pe
- Markdown Studio Local — Patch 7 Smart Writing
- .renderEditorPane
- .renderVersionsModal
- .renderDocumentPopover
- .renderVersionsModal
- .renderDocumentPopover
- y
- Markdown Studio Local — Patch 8 Workspace Refinement
- Patch 6 Agent Guide — UX Redesign and Workspace Cleanup
- Patch 8 Agent Guide — Stability, Accessibility, Performance, and UX Hardening
- Patch 8 Agent Guide — Stability, Accessibility, Performance, and UX Hardening
- .exportWorkspaceBackup
- Key implementation points
- .exportWorkspaceBackup
- Key implementation points
- Changelog
- Patch 2 Agent Guide — Export and Insert Features
- Changelog
- $e
- Markdown Studio Local — Changelog
- Ue
- c
- Patch 5 Agent Guide — Final polish update
- Final QA Checklist
- Markdown Studio
- Markdown Studio Local — Changelog
- Final QA Checklist
- Markdown Studio
- Patch 3 Agent Guide — Markdown Studio Local
- Patch 4 Agent Guide
- Patch 7 Agent Guide — Smart Writing
- .renderVersionsModal
- Patch 7 Agent Guide — Smart Writing
- Prompt Playbook — CLAUDE.md Workflow
- Markdown Studio Local — Final QA Checklist
- Markdown Studio Local — Final QA Checklist
- maybePreventDefault
- Workspace refinement sample
- .patch7InsertQuickSnippetAtRange
- Patch 7 smart-writing sample
- .patch7InsertQuickSnippetAtRange
- Codebase Blueprint & Structural Graph
- sync-architecture.sh
- markdown_editor_pro_patch9_files/service-worker.js
- implementation_plan.md
- run-local.sh
- Markdown-studio/service-worker.js
- THIRD_PARTY_NOTICES.md

## God Nodes (most connected - your core abstractions)
1. `MarkdownStudioApp()` - 222 edges
2. `MarkdownStudioApp()` - 222 edges
3. `MarkdownStudioApp()` - 209 edges
4. `MarkdownStudioApp()` - 209 edges
5. `Nb()` - 128 edges
6. `m()` - 39 edges
7. `We()` - 28 edges
8. `StatusChip()` - 25 edges
9. `StatusChip()` - 25 edges
10. `rc()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `g()` --indirect_call--> `A()`  [INFERRED]
  Markdown-studio/vendor/highlight.min.js → Markdown-studio/vendor/react-dom.production.min.js
- `h()` --indirect_call--> `D()`  [INFERRED]
  Markdown-studio/vendor/react-dom.production.min.js → Markdown-studio/vendor/react.production.min.js
- `k()` --indirect_call--> `D()`  [INFERRED]
  Markdown-studio/vendor/react-dom.production.min.js → Markdown-studio/vendor/react.production.min.js

## Import Cycles
- None detected.

## Communities (83 total, 6 thin omitted)

### Community 0 - "markdown_editor_pro_patch9_files/js/app.js"
Cohesion: 0.07
Nodes (52): ActionButton(), buildCalloutMarkdown(), buildMarkdownImage(), buildMarkdownLink(), buildMarkdownTable(), CommandPaletteModal(), computeCrc32(), createLineNumberElements() (+44 more)

### Community 1 - "Markdown-studio/js/app.js"
Cohesion: 0.07
Nodes (52): ActionButton(), buildCalloutMarkdown(), buildMarkdownImage(), buildMarkdownLink(), buildMarkdownTable(), CommandPaletteModal(), computeCrc32(), createLineNumberElements() (+44 more)

### Community 2 - "Nb"
Cohesion: 0.04
Nodes (31): Nb(), Af(), Bf(), $c(), ce(), Cf(), df(), Ed() (+23 more)

### Community 3 - "highlight.min.js"
Cohesion: 0.07
Nodes (39): ⏱️ Communication Constraints (Zero Waste Mode), 📐 Engineering Guardrails, 🎨 Frontend Architecture, UI/UX & Motion Standard, 🛠️ Project Execution Modes (Personal vs. Organization), 🤖 System Architecture & Co-Worker Protocol, 📉 Token-Optimized Communication Mode, 🧪 Verification Scope (Token-Efficient Testing), a (+31 more)

### Community 4 - "MarkdownStudioApp"
Cohesion: 0.05
Nodes (7): hasFilesInTransfer(), MarkdownStudioApp(), maybePreventDefault(), normalizeThemePreset(), Patch6MenuTrigger(), readFileAsDataUrl(), ToolbarSelect()

### Community 5 - "MarkdownStudioApp"
Cohesion: 0.05
Nodes (9): clamp(), createComposerDialogState(), hasFilesInTransfer(), MarkdownStudioApp(), maybePreventDefault(), normalizeThemePreset(), patch7SlashCommandItems(), Patch7SlashMenu() (+1 more)

### Community 6 - "MarkdownStudioApp"
Cohesion: 0.05
Nodes (7): hasFilesInTransfer(), MarkdownStudioApp(), maybePreventDefault(), normalizeThemePreset(), Patch6MenuTrigger(), readFileAsDataUrl(), ToolbarSelect()

### Community 7 - ".render"
Cohesion: 0.07
Nodes (30): ActionButton(), CommandPaletteModal(), createLineNumberElements(), cx(), formatDateTime(), formatTime(), HiddenFileInput(), patch4BuildLineDiff() (+22 more)

### Community 8 - "Patch 7/js/app.js"
Cohesion: 0.06
Nodes (49): buildCalloutMarkdown(), buildDocxBlobFromHtml(), buildHeadingOutline(), buildMarkdownImage(), buildMarkdownLink(), buildMarkdownTable(), buildStandaloneExportHtml(), computeCrc32() (+41 more)

### Community 9 - ".renderToolbarDropdown"
Cohesion: 0.06
Nodes (11): copyTextToClipboard(), getFileBaseName(), getHighlightedHtmlFragment(), htmlToPlainText(), patch5BuildReleaseNotesSummary(), patch5BuildShortcutCheatSheet(), Patch6PanelAction(), Patch6PanelSection() (+3 more)

### Community 10 - ".renderToolbarDropdown"
Cohesion: 0.06
Nodes (9): copyTextToClipboard(), getFileBaseName(), getHighlightedHtmlFragment(), htmlToPlainText(), patch5BuildReleaseNotesSummary(), patch5BuildShortcutCheatSheet(), Patch6PanelSection(), Patch6SelectField() (+1 more)

### Community 11 - ".renderToolbarDropdown"
Cohesion: 0.06
Nodes (9): copyTextToClipboard(), patch5BuildReleaseNotesSummary(), patch5BuildShortcutCheatSheet(), Patch6PanelAction(), Patch6PanelSection(), Patch6SelectField(), patch7GetGoalProgress(), patch7NormalizeWordGoal() (+1 more)

### Community 12 - ".renderToolbarDropdown"
Cohesion: 0.06
Nodes (9): copyTextToClipboard(), patch5BuildReleaseNotesSummary(), patch5BuildShortcutCheatSheet(), Patch6PanelAction(), Patch6PanelSection(), Patch6SelectField(), patch7GetGoalProgress(), patch7NormalizeWordGoal() (+1 more)

### Community 13 - "MarkdownStudioApp"
Cohesion: 0.06
Nodes (5): MarkdownStudioApp(), normalizeThemePreset(), Patch6MenuTrigger(), readFileAsDataUrl(), ToolbarSelect()

### Community 14 - "markdown_editor_pro_patch8_files/js/app.js"
Cohesion: 0.08
Nodes (38): buildCalloutMarkdown(), buildDocxBlobFromHtml(), buildHeadingOutline(), buildMarkdownImage(), buildMarkdownLink(), buildMarkdownTable(), buildStandaloneExportHtml(), computeCrc32() (+30 more)

### Community 15 - ".showToast"
Cohesion: 0.11
Nodes (9): computeDocumentInsights(), computeStats(), getPlainSearchMatches(), patch5CreateToastId(), patch9NormalizeWorkspacePackage(), patch9RestoreWorkspacePackage(), postProcessRenderedHtml(), renderMarkdown() (+1 more)

### Community 16 - ".showToast"
Cohesion: 0.11
Nodes (9): computeDocumentInsights(), computeStats(), getPlainSearchMatches(), patch5CreateToastId(), patch9NormalizeWorkspacePackage(), patch9RestoreWorkspacePackage(), postProcessRenderedHtml(), renderMarkdown() (+1 more)

### Community 17 - ".showToast"
Cohesion: 0.12
Nodes (7): computeDocumentInsights(), computeStats(), getPlainSearchMatches(), patch5CreateToastId(), postProcessRenderedHtml(), renderMarkdown(), renderMarkdownPatch4()

### Community 18 - "clamp"
Cohesion: 0.12
Nodes (9): clamp(), getLineNumberForPosition(), patch4ApplyPreviewCss(), patch5NormalizeEditorFontSize(), patch5ReadSettings(), patch7GetGoalProgress(), patch7GetParagraphInfo(), patch7NormalizeWordGoal() (+1 more)

### Community 19 - ".render"
Cohesion: 0.12
Nodes (14): ActionButton(), CommandPaletteModal(), cx(), Patch6SegmentButton(), Patch7ReleaseNotesModal(), Patch7WelcomeModal(), ReleaseNotesModal(), SettingsModal() (+6 more)

### Community 20 - "We"
Cohesion: 0.19
Nodes (32): cc(), dc(), ec(), F(), fc(), Ia(), Ja(), md() (+24 more)

### Community 21 - ".componentDidMount"
Cohesion: 0.11
Nodes (9): clamp(), getLineNumberForPosition(), patch4ApplyPreviewCss(), patch5NormalizeEditorFontSize(), patch5ReadSettings(), patch6ReadSettings(), patch7GetParagraphInfo(), patch7ReadSettings() (+1 more)

### Community 22 - ".componentDidMount"
Cohesion: 0.11
Nodes (9): clamp(), getLineNumberForPosition(), patch4ApplyPreviewCss(), patch5NormalizeEditorFontSize(), patch5ReadSettings(), patch6ReadSettings(), patch7GetParagraphInfo(), patch7ReadSettings() (+1 more)

### Community 23 - "marked.js"
Cohesion: 0.09
Nodes (21): RFC-3986, _arrayLikeToArray(), checkSanitizeDeprecation(), cleanUrl(), _createClass(), _createForOfIteratorHelperLoose(), _defineProperties(), escape() (+13 more)

### Community 24 - ".showToast"
Cohesion: 0.12
Nodes (6): computeStats(), ensureNode(), patch4CreateSnapshotId(), patch4NormalizeSnapshots(), patch4ParseMermaidNode(), patch5CreateToastId()

### Community 25 - ".componentDidMount"
Cohesion: 0.15
Nodes (6): getLineNumberForPosition(), patch4ApplyPreviewCss(), patch5NormalizeEditorFontSize(), patch5ReadSettings(), patch7GetParagraphInfo(), patch7ReadSettings()

### Community 26 - ".handleExportDocx"
Cohesion: 0.10
Nodes (15): buildDocxBlobFromHtml(), buildStandaloneExportHtml(), escapeHtml(), getFileBaseName(), getHighlightedHtmlFragment(), htmlToPlainText(), patch4BuildMermaidSvg(), ensureNode() (+7 more)

### Community 27 - ".handleExportDocx"
Cohesion: 0.10
Nodes (15): buildDocxBlobFromHtml(), buildStandaloneExportHtml(), escapeHtml(), getFileBaseName(), getHighlightedHtmlFragment(), htmlToPlainText(), patch4BuildMermaidSvg(), ensureNode() (+7 more)

### Community 28 - ".updateMarkdown"
Cohesion: 0.15
Nodes (3): createComposerDialogState(), getPlainSearchMatches(), patch7SlashCommandItems()

### Community 29 - "Markdown Studio — Patch 9 Web Deployment and Reliability"
Cohesion: 0.10
Nodes (19): Adaptive file behavior, Agent patch files, App setup modal, Browser backup and recovery, Core features still included, Deploying to GitHub Pages, Editor and preview, Insert and export (+11 more)

### Community 30 - "Markdown Studio — Patch 9 Web Deployment and Reliability"
Cohesion: 0.10
Nodes (19): Adaptive file behavior, Agent patch files, App setup modal, Browser backup and recovery, Core features still included, Deploying to GitHub Pages, Editor and preview, Insert and export (+11 more)

### Community 31 - "GitHub Pages Deployment Guide"
Cohesion: 0.11
Nodes (18): 1. Create a repository, 2. Upload the project, 3. Enable Pages, 4. Wait for the site URL, Adapts automatically, Best browser expectations, Deploy from a branch, Deployment checklist (+10 more)

### Community 32 - "GitHub Pages Deployment Guide"
Cohesion: 0.11
Nodes (18): 1. Create a repository, 2. Upload the project, 3. Enable Pages, 4. Wait for the site URL, Adapts automatically, Best browser expectations, Deploy from a branch, Deployment checklist (+10 more)

### Community 33 - "m"
Cohesion: 0.14
Nodes (18): ab(), ad(), Ba(), Bb(), hd(), ic(), Kd(), m() (+10 more)

### Community 34 - "Pe"
Cohesion: 0.19
Nodes (15): cd(), Pe(), c(), e(), eb(), ed(), f(), fb() (+7 more)

### Community 35 - "Markdown Studio Local — Patch 7 Smart Writing"
Cohesion: 0.12
Nodes (16): Best experience, Core workspace, Direct open, Editing and writing, Files, Files and export, Full feature set, Included documentation (+8 more)

### Community 36 - ".renderEditorPane"
Cohesion: 0.20
Nodes (3): createLineNumberElements(), Patch6MenuTrigger(), ToolbarSelect()

### Community 37 - ".renderVersionsModal"
Cohesion: 0.16
Nodes (7): buildHeadingOutline(), patch4CreateSnapshotId(), patch4NormalizeSnapshots(), patch4ParseMermaidNode(), slugifyHeading(), stripMarkdownFormatting(), summarizeMarkdown()

### Community 38 - ".renderDocumentPopover"
Cohesion: 0.21
Nodes (8): formatTime(), patch6AutosaveLabel(), patch6DiskLabel(), Patch6InfoField(), Patch6Metric(), patch6SplitLabel(), patch6ViewLabel(), StatBlock()

### Community 39 - ".renderVersionsModal"
Cohesion: 0.16
Nodes (7): buildHeadingOutline(), patch4CreateSnapshotId(), patch4NormalizeSnapshots(), patch4ParseMermaidNode(), slugifyHeading(), stripMarkdownFormatting(), summarizeMarkdown()

### Community 40 - ".renderDocumentPopover"
Cohesion: 0.21
Nodes (8): formatTime(), patch6AutosaveLabel(), patch6DiskLabel(), Patch6InfoField(), Patch6Metric(), patch6SplitLabel(), patch6ViewLabel(), StatBlock()

### Community 41 - "y"
Cohesion: 0.18
Nodes (7): y(), F(), G(), K(), L(), u(), z()

### Community 42 - "Markdown Studio Local — Patch 8 Workspace Refinement"
Cohesion: 0.15
Nodes (12): Agent patch files, Core workspace, Full feature set, Insert and export, Markdown Studio Local — Patch 8 Workspace Refinement, Notes, Patch 8 UX goals, Recommended testing flow (+4 more)

### Community 43 - "Patch 6 Agent Guide — UX Redesign and Workspace Cleanup"
Cohesion: 0.17
Nodes (11): 1. Compact document-first header, 2. Grouped action menus, 3. Better divider UX, 4. More writing space, Changed files, Goal, Main changes, Manual validation checklist (+3 more)

### Community 44 - "Patch 8 Agent Guide — Stability, Accessibility, Performance, and UX Hardening"
Cohesion: 0.17
Nodes (11): Acceptance checks, Behavioral goals, CSS updates, Files changed, Goal, JavaScript updates, Main requested fixes, Merge note (+3 more)

### Community 45 - "Patch 8 Agent Guide — Stability, Accessibility, Performance, and UX Hardening"
Cohesion: 0.17
Nodes (11): Acceptance checks, Behavioral goals, CSS updates, Files changed, Goal, JavaScript updates, Main requested fixes, Merge note (+3 more)

### Community 46 - ".exportWorkspaceBackup"
Cohesion: 0.18
Nodes (8): normalizeRecentDocuments(), patch9BackupFileName(), patch9BuildWorkspaceState(), patch9CreateWorkspacePackage(), patch9DbDelete(), patch9DbRead(), patch9DbWrite(), patch9OpenDatabase()

### Community 47 - "Key implementation points"
Cohesion: 0.17
Nodes (11): 1. Keep the app static-only, 2. Add web app files, 3. Adaptive file UX, 4. Browser backup layer, 5. App setup surface, Acceptance checks, Files changed in Patch 9, Goal (+3 more)

### Community 48 - ".exportWorkspaceBackup"
Cohesion: 0.18
Nodes (8): normalizeRecentDocuments(), patch9BackupFileName(), patch9BuildWorkspaceState(), patch9CreateWorkspacePackage(), patch9DbDelete(), patch9DbRead(), patch9DbWrite(), patch9OpenDatabase()

### Community 49 - "Key implementation points"
Cohesion: 0.17
Nodes (11): 1. Keep the app static-only, 2. Add web app files, 3. Adaptive file UX, 4. Browser backup layer, 5. App setup surface, Acceptance checks, Files changed in Patch 9, Goal (+3 more)

### Community 50 - "Changelog"
Cohesion: 0.18
Nodes (10): Changelog, Patch 1 — Editor power, Patch 2 — Export and insert, Patch 3 — Productivity, Patch 4 — Power tools, Patch 5 — Final polish, Patch 6 — UX cleanup and workspace structure, Patch 7 — Smart writing (+2 more)

### Community 51 - "Patch 2 Agent Guide — Export and Insert Features"
Cohesion: 0.18
Nodes (10): Acceptance checklist, Export, Files changed, Goal, Insert, Merge notes, Notes for next patches, Patch 2 Agent Guide — Export and Insert Features (+2 more)

### Community 52 - "Changelog"
Cohesion: 0.18
Nodes (10): Changelog, Patch 1 — Editor power, Patch 2 — Export and insert, Patch 3 — Productivity, Patch 4 — Power tools, Patch 5 — Final polish, Patch 6 — UX cleanup and workspace structure, Patch 7 — Smart writing (+2 more)

### Community 53 - "$e"
Cohesion: 0.20
Nodes (10): ac(), bc(), Da(), $e(), gc(), hb(), ie(), Nd() (+2 more)

### Community 54 - "Markdown Studio Local — Changelog"
Cohesion: 0.20
Nodes (9): Markdown Studio Local — Changelog, Patch 1 — Editor power, Patch 2 — Export and insert, Patch 3 — Productivity layer, Patch 4 — Advanced power-user tools, Patch 5 — Final polish, Patch 6 — UX redesign, Patch 7 — Smart writing (+1 more)

### Community 55 - "Ue"
Cohesion: 0.24
Nodes (10): Ca(), dd(), Ea(), gb(), id(), jd(), K(), L() (+2 more)

### Community 56 - "c"
Cohesion: 0.33
Nodes (10): gd(), ka(), h(), k(), c(), e(), b(), c() (+2 more)

### Community 57 - "Patch 5 Agent Guide — Final polish update"
Cohesion: 0.22
Nodes (8): Expected behavior after merge, Features added in Patch 5, Files changed in Patch 5, Integration rules, Objective, Patch 5 Agent Guide — Final polish update, Suggested merge order, Validation tip

### Community 58 - "Final QA Checklist"
Cohesion: 0.22
Nodes (8): App setup and backup, Core layout, Existing feature regression checks, File handling, Final QA Checklist, GitHub Pages smoke test, Header and workspace chrome, Offline and install shell

### Community 59 - "Markdown Studio"
Cohesion: 0.22
Nodes (8): App setup checklist, Code block, Example markdown, Markdown Studio, Patch 9 highlights, Table, Task list, Why this matters

### Community 60 - "Markdown Studio Local — Changelog"
Cohesion: 0.22
Nodes (8): Markdown Studio Local — Changelog, Patch 1 — Editor foundation, Patch 2 — Export and insert tools, Patch 3 — Productivity layer, Patch 4 — Advanced power-user tools, Patch 5 — Final polish, Patch 6 — UX redesign, Patch 7 — Smart writing

### Community 61 - "Final QA Checklist"
Cohesion: 0.22
Nodes (8): App setup and backup, Core layout, Existing feature regression checks, File handling, Final QA Checklist, GitHub Pages smoke test, Header and workspace chrome, Offline and install shell

### Community 62 - "Markdown Studio"
Cohesion: 0.22
Nodes (8): App setup checklist, Code block, Example markdown, Markdown Studio, Patch 9 highlights, Table, Task list, Why this matters

### Community 63 - "Patch 3 Agent Guide — Markdown Studio Local"
Cohesion: 0.25
Nodes (7): Acceptance checklist, Files changed, Main Patch 3 features, Merge notes, Notes for future patches, Patch 3 Agent Guide — Markdown Studio Local, Scope

### Community 64 - "Patch 4 Agent Guide"
Cohesion: 0.25
Nodes (7): Acceptance checklist, Features added, Files changed in Patch 4, Goal, Implementation notes, Patch 4 Agent Guide, Recommended manual smoke test

### Community 65 - "Patch 7 Agent Guide — Smart Writing"
Cohesion: 0.25
Nodes (7): Acceptance checks, Goal, Implementation notes, Main files changed, Merge strategy, Patch 7 Agent Guide — Smart Writing, Scope

### Community 67 - "Patch 7 Agent Guide — Smart Writing"
Cohesion: 0.25
Nodes (7): Acceptance checks, Goal, Implementation notes, Main files changed, Merge strategy, Patch 7 Agent Guide — Smart Writing, Scope

### Community 68 - "Prompt Playbook — CLAUDE.md Workflow"
Cohesion: 0.25
Nodes (7): 1. Starting a New Folder / Project, 2. Starting with an Existing Project, 3. The "After-Command" Chaser, 4. Start / Debug Prompt Template, 5. Session Wrap-Up Prompt Template, 6. The Context Recovery Prompt (Anti-Hallucination Trigger), Prompt Playbook — CLAUDE.md Workflow

### Community 69 - "Markdown Studio Local — Final QA Checklist"
Cohesion: 0.29
Nodes (6): Core workspace, Files and exports, Markdown Studio Local — Final QA Checklist, Patch 8 workspace refinement, Power features, Writing and editing

### Community 70 - "Markdown Studio Local — Final QA Checklist"
Cohesion: 0.29
Nodes (6): Core workspace, Files and exports, Markdown Studio Local — Final QA Checklist, Patch 6 UX cleanup, Patch 7 smart writing, Power features

### Community 71 - "maybePreventDefault"
Cohesion: 0.40
Nodes (3): hasFilesInTransfer(), maybePreventDefault(), Patch7SlashMenu()

### Community 72 - "Workspace refinement sample"
Cohesion: 0.33
Nodes (5): Example code block, Example table, Example task list, Try these interactions, Workspace refinement sample

### Community 73 - ".patch7InsertQuickSnippetAtRange"
Cohesion: 0.40
Nodes (3): createComposerDialogState(), patch7GetQuickSnippet(), patch7SlashCommandItems()

### Community 74 - "Patch 7 smart-writing sample"
Cohesion: 0.33
Nodes (5): Example code block, Example table, Example task list, Patch 7 smart-writing sample, Try these interactions

### Community 75 - ".patch7InsertQuickSnippetAtRange"
Cohesion: 0.40
Nodes (3): createComposerDialogState(), patch7GetQuickSnippet(), patch7SlashCommandItems()

### Community 76 - "Codebase Blueprint & Structural Graph"
Cohesion: 0.40
Nodes (4): 1. High-Level Design (HLD) Topology, 2. Current Target Directory Tree, 3. Low-Level Design (LLD) & SOLID Class Schemas, Codebase Blueprint & Structural Graph

### Community 77 - "sync-architecture.sh"
Cohesion: 0.70
Nodes (3): edge(), node(), sync-architecture.sh script

## Knowledge Gaps
- **261 isolated node(s):** `APP_SHELL`, `run-local.sh script`, `APP_SHELL`, `RFC-3986`, `1. High-Level Design (HLD) Topology` (+256 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 462 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MarkdownStudioApp()` connect `MarkdownStudioApp` to `.render`, `maybePreventDefault`, `.renderToolbarDropdown`, `markdown_editor_pro_patch8_files/js/app.js`, `clamp`, `.showToast`, `.updateMarkdown`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `MarkdownStudioApp()` connect `MarkdownStudioApp` to `.renderVersionsModal`, `.renderEditorPane`, `Patch 7/js/app.js`, `.renderToolbarDropdown`, `.showToast`, `.render`, `.componentDidMount`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `MarkdownStudioApp()` connect `MarkdownStudioApp` to `markdown_editor_pro_patch9_files/js/app.js`, `.renderVersionsModal`, `.renderDocumentPopover`, `.patch7InsertQuickSnippetAtRange`, `.renderToolbarDropdown`, `.exportWorkspaceBackup`, `.showToast`, `.componentDidMount`, `.handleExportDocx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Are the 24 inferred relationships involving `Nb()` (e.g. with `react-dom.production.min.js` and `ab()`) actually correct?**
  _`Nb()` has 24 INFERRED edges - model-reasoned connections that need verification._
- **What connects `APP_SHELL`, `run-local.sh script`, `APP_SHELL` to the rest of the system?**
  _261 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `markdown_editor_pro_patch9_files/js/app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06558558558558558 - nodes in this community are weakly interconnected._
- **Should `Markdown-studio/js/app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06558558558558558 - nodes in this community are weakly interconnected._