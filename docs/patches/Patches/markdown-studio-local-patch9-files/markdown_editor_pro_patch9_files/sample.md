# Markdown Studio

A local-first markdown workspace that can also be published as a **simple static web app**.

## Patch 9 highlights

- adaptive **Open / Upload** behavior depending on browser support
- adaptive **Save / Download** behavior depending on browser support
- browser-backed **workspace backup** with export and import
- installable shell through a **manifest** and **service worker**
- GitHub Pages-ready file layout with no backend required

## Why this matters

You can keep the same workflow:

1. Write locally.
2. Publish the app folder later.
3. Let users open it online.
4. Keep the editor fast and reliable even when native file APIs are unavailable.

## App setup checklist

- open **App setup** from the document menu or command palette
- export a workspace backup before publishing
- test the hosted build in your target browser
- verify whether the browser shows **Open / Save** or **Upload / Download**
- install the app when supported if you want a more desktop-like shell

## Example markdown

### Task list
- [x] Write in the left pane
- [x] Preview on the right
- [x] Export markdown or HTML
- [x] Keep a browser backup
- [ ] Decide whether to add online sync later

### Table

| Mode | Open action | Save action |
| --- | --- | --- |
| Localhost + supported browser | Open | Save |
| Static host without native picker support | Upload | Download |
| Installed web app | Open or Upload | Save or Download |

### Code block

```js
function deploymentMode(nativeOpen, nativeSave) {
  if (nativeOpen && nativeSave) return 'native';
  return 'upload-download-fallback';
}
```

> Keep the app static for now. Simplicity and reliability are the point of this release.
