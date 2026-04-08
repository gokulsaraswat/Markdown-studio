# GitHub Pages Deployment Guide

This project is designed to work as a **static site**.

## Goal
Deploy the app so people can open it online with no backend and no server-side build requirements.

## Recommended repo layout
Place the app files at the repository root.

Example:

```text
index.html
404.html
manifest.webmanifest
service-worker.js
.nojekyll
assets/
js/
styles/
vendor/
```

## Deploy from a branch

### 1. Create a repository
Create a new repository on GitHub.

### 2. Upload the project
Commit the full folder contents to the repository root.

### 3. Enable Pages
In GitHub:
- open **Settings**
- open **Pages**
- under **Build and deployment**, choose **Deploy from a branch**
- select your main branch and `/ (root)`
- save

### 4. Wait for the site URL
GitHub Pages will publish the static site and show the final URL.

## User site vs project site

### User site
Example:
- `username.github.io`

### Project site
Example:
- `username.github.io/repo-name`

This build uses **relative asset paths**, so it is safe for both layouts.

## Static web behavior

### Works online
- editor and preview
- markdown rendering
- exports
- slash commands
- templates, snapshots, versions
- browser autosave
- workspace backup export/import

### Adapts automatically
- browsers with native file APIs show **Open / Save / Save As**
- browsers without them show **Upload / Download / Download As**

## PWA and offline notes
This build includes:
- `manifest.webmanifest`
- `service-worker.js`
- app icons

That means supported browsers can:
- cache the app shell
- sometimes show an install prompt
- reuse the interface offline after the first online visit

## Best browser expectations
For the strongest local-like behavior, test in a modern Chromium-based browser.

Other browsers may still work well, but can fall back to upload/download rather than native file save/open.

## Deployment checklist
- [ ] GitHub Pages is enabled
- [ ] `index.html` loads from the Pages URL
- [ ] `manifest.webmanifest` returns successfully
- [ ] `service-worker.js` returns successfully
- [ ] the app still opens with the editor on the left and preview on the right
- [ ] Open/Save labels match the browser capability
- [ ] backup export/import works
- [ ] refresh still loads the app

## What not to add here yet
Keep Patch 9 static-only.

Do **not** add yet:
- backend auth
- cloud documents
- real-time collaboration
- database dependencies
- server-rendered routes

That keeps deployment simple and durable.
