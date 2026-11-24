// Markdown-studio behaviour walk (edit, preview, shortcuts, slash, file keys, export, copy, backup/restore,
// theme, persistence, install manifest, offline). puppeteer-core is NOT a repo dependency: run from a scratch
// dir that has it installed (npm i puppeteer-core), serving the repo root on a local port:
//   node <repo>/tests/smoke/walk.mjs http://127.0.0.1:8765/ out.json [baseline.fingerprint.json]
// Writes out.json (full detail) and out.fingerprint.json (timing-free). Exit 1 on a failed step or fingerprint diff.
// CHROME_PATH overrides the Chrome binary.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';

const puppeteer = createRequire(path.join(process.cwd(), 'noop.js'))('puppeteer-core');
const BASE = process.argv[2] || 'http://127.0.0.1:8765/';
const OUT = process.argv[3] || 'walk-result.json';
const BASELINE = process.argv[4] || null;
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const sha = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const result = { base: BASE, startup: [], steps: {}, commands: [], slash: [], shortcutsSheet: [], downloads: [], errors: [], pageErrors: [] };
const fail = [];
function check(name, ok, observed) {
  result.steps[name] = { ok: !!ok, observed };
  if (!ok) fail.push(name);
}

const INIT = () => {
  window.__walk = { downloads: [], pickers: [], opened: 0, readyAt: null };
  const origClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download) {
      const href = this.href; const name = this.download;
      const rec = { name, size: null, head: null, text: null };
      window.__walk.downloads.push(rec);
      fetch(href).then((r) => r.arrayBuffer()).then((buf) => {
        rec.size = buf.byteLength;
        const u8 = new Uint8Array(buf.slice(0, 4));
        rec.head = Array.from(u8).map((b) => b.toString(16).padStart(2, '0')).join('');
        if (/\.(json|md|txt|html)$/.test(name)) rec.text = new TextDecoder().decode(buf);
      });
      return;
    }
    return origClick.call(this);
  };
  const abort = (kind) => function () { window.__walk.pickers.push(kind); const e = new DOMException('walk', 'AbortError'); return Promise.reject(e); };
  if (window.showSaveFilePicker) window.showSaveFilePicker = abort('save');
  if (window.showOpenFilePicker) window.showOpenFilePicker = abort('open');
  window.open = function () { window.__walk.opened++; return null; };
  const mo = new MutationObserver(() => {
    if (!window.__walk.readyAt && document.querySelector('#app textarea')) { window.__walk.readyAt = performance.now(); mo.disconnect(); }
  });
  document.addEventListener('DOMContentLoaded', () => mo.observe(document.getElementById('app') || document.body, { childList: true, subtree: true }));
};

const APP = `(() => { const r = document.getElementById('app')._reactRootContainer; const root = r._internalRoot || r; let f = root.current.child; while (f && !(f.stateNode && f.stateNode.setState)) f = f.child; return f.stateNode; })()`;
const st = (page, keys) => page.evaluate((APP, keys) => { const a = eval(APP); const o = {}; keys.forEach((k) => { o[k] = a.state[k]; }); return o; }, APP, keys);
const call = (page, fn, ...args) => page.evaluate((APP, fn, args) => { const a = eval(APP); return a[fn].apply(a, args); }, APP, fn, args);
const setMd = (page, md) => page.evaluate((md) => {
  const ta = document.querySelector('#app textarea');
  Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(ta, md);
  ta.dispatchEvent(new Event('input', { bubbles: true }));
}, md);
const md = (page) => page.evaluate((APP) => eval(APP).state.markdown, APP);
async function press(page, combo) {
  const keys = combo.split('+');
  for (const k of keys.slice(0, -1)) await page.keyboard.down(k);
  await page.keyboard.press(keys[keys.length - 1]);
  for (const k of keys.slice(0, -1).reverse()) await page.keyboard.up(k);
  await sleep(120);
}
async function focusEditor(page, selStart, selEnd) {
  await page.evaluate((a, b) => { const ta = document.querySelector('#app textarea'); ta.focus(); if (a != null) ta.setSelectionRange(a, b); }, selStart, selEnd);
  await sleep(50);
}

const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mds-walk-'));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', userDataDir, args: ['--no-first-run', '--window-size=1440,1000'], defaultViewport: { width: 1440, height: 1000 } });

try {
  // Startup: 3 cold loads in isolated contexts
  for (let i = 0; i < 3; i++) {
    const ctx = await browser.createBrowserContext();
    const p = await ctx.newPage();
    await p.setCacheEnabled(false);
    await p.evaluateOnNewDocument(INIT);
    await p.goto(BASE, { waitUntil: 'load' });
    await p.waitForFunction(() => window.__walk.readyAt, { timeout: 15000 });
    const m = await p.evaluate(() => {
      const n = performance.getEntriesByType('navigation')[0];
      const res = performance.getEntriesByType('resource');
      return { dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), appReady: Math.round(window.__walk.readyAt), requests: res.length + 1, bytes: res.reduce((s, r) => s + (r.transferSize || r.encodedBodySize || 0), 0) + (n.transferSize || 0) };
    });
    const pm = await p.metrics();
    m.jsHeapMB = +(pm.JSHeapUsedSize / 1048576).toFixed(1);
    result.startup.push(m);
    await ctx.close();
  }

  const page = await browser.newPage();
  page.on('console', (m) => { if (m.type() === 'error') result.errors.push(m.text()); });
  page.on('pageerror', (e) => result.pageErrors.push(String(e.message || e)));
  const dialogs = [];
  page.on('dialog', async (d) => { dialogs.push({ type: d.type(), message: d.message() }); if (d.type() === 'prompt') await d.accept('500'); else await d.accept(); });
  await page.evaluateOnNewDocument(INIT);
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__walk.readyAt, { timeout: 15000 });
  await sleep(600);
  const initial = await st(page, ['welcomeOpen', 'theme', 'zenMode', 'focusMode', 'autosaveEnabled', 'isFsApiAvailable', 'serviceWorkerReady', 'fileName']);
  check('boot', true, initial);
  check('boot.sampleLoaded', (await md(page)).length > 0, { mdLen: (await md(page)).length });
  await page.evaluate((APP) => { const a = eval(APP); if (a.closeWelcomeModal) a.closeWelcomeModal(); a.closeTransientMenus && a.closeTransientMenus(); }, APP);
  await sleep(200);

  // Inventory: commands and slash commands
  result.commands = await page.evaluate((APP) => eval(APP).getCommandItems().map((c) => ({ id: c.id, group: c.group, title: c.title, shortcut: c.shortcut || '' })), APP);
  result.slash = await page.evaluate((APP) => { const a = eval(APP); const s = a.state; a.state = Object.assign({}, s, { slashQuery: '' }); const items = a.getFilteredSlashCommandItems(); a.state = s; return items.map((c) => ({ id: c.id, title: c.title || c.label })); }, APP);

  // Edit + preview
  const DOC = '# Walk heading\n\nSome **bold** and *em* text.\n\n```js\nconst x = 1;\n```\n\n- [ ] task\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\nword\n';
  await setMd(page, DOC);
  await sleep(700);
  const prev = await page.evaluate((APP) => { const a = eval(APP); const el = a.previewRef; return { h1: (el.querySelector('h1') || {}).textContent || null, strong: !!el.querySelector('strong'), code: !!el.querySelector('pre code'), hljs: !!el.querySelector('pre code.hljs, pre code [class^="hljs-"]'), table: !!el.querySelector('table'), task: !!el.querySelector('input[type=checkbox]') }; }, APP);
  check('edit.preview', prev.h1 === 'Walk heading' && prev.strong && prev.code && prev.table, prev);

  // Shortcuts (global)
  await focusEditor(page, 0, 0);
  await press(page, 'Control+p'); let s = await st(page, ['commandPaletteOpen']); check('key.Ctrl+P', s.commandPaletteOpen === true, s);
  await press(page, 'Escape'); s = await st(page, ['commandPaletteOpen']); check('key.Escape.palette', s.commandPaletteOpen === false, s);
  await press(page, 'F1'); s = await st(page, ['shortcutsOpen']); check('key.F1', s.shortcutsOpen === true, s);
  result.shortcutsSheet = await page.evaluate(() => Array.from(document.querySelectorAll('kbd')).map((k) => k.textContent.trim()).filter(Boolean));
  await press(page, 'Escape'); s = await st(page, ['shortcutsOpen']); check('key.Escape.shortcuts', s.shortcutsOpen === false, s);
  await focusEditor(page);
  await press(page, 'Control+,'); s = await st(page, ['settingsOpen']); check('key.Ctrl+Comma', s.settingsOpen === true, s);
  await press(page, 'Escape'); s = await st(page, ['settingsOpen']); check('key.Escape.settings(observed)', true, s);
  await call(page, 'closeSettings'); await sleep(100);
  await focusEditor(page);
  await press(page, 'Control+/'); s = await st(page, ['zenMode']); check('key.Ctrl+/', s.zenMode === true, s);
  await press(page, 'Escape'); s = await st(page, ['zenMode']); check('key.Escape.zen', s.zenMode === false, s);
  await focusEditor(page);
  await press(page, 'Control+.'); s = await st(page, ['focusMode']); check('key.Ctrl+.', s.focusMode === true, s);
  await press(page, 'Control+.'); s = await st(page, ['focusMode']); check('key.Ctrl+..off', s.focusMode === false, s);
  await press(page, 'Control+Shift+O'); s = await st(page, ['utilitySidebarOpen', 'utilitySidebarTab']); check('key.Ctrl+Shift+O', s.utilitySidebarOpen && s.utilitySidebarTab === 'outline', s);
  await press(page, 'Control+Shift+R'); s = await st(page, ['utilitySidebarOpen', 'utilitySidebarTab']); check('key.Ctrl+Shift+R', s.utilitySidebarOpen && s.utilitySidebarTab === 'recent', s);
  await press(page, 'Control+Alt+S'); s = await st(page, ['utilitySidebarOpen', 'utilitySidebarTab']); check('key.Ctrl+Alt+S', s.utilitySidebarOpen && s.utilitySidebarTab === 'stats', s);
  await press(page, 'Escape'); s = await st(page, ['utilitySidebarOpen']); check('key.Escape.sidebar', s.utilitySidebarOpen === false, s);
  await focusEditor(page);
  await press(page, 'Control+f'); s = await st(page, ['findOpen']); check('key.Ctrl+F', s.findOpen === true, s);
  await press(page, 'Escape'); s = await st(page, ['findOpen']); check('key.Escape.find', s.findOpen === false, s);

  // Formatting
  const W = DOC.indexOf('word');
  await focusEditor(page, W, W + 4); await press(page, 'Control+b'); let m1 = await md(page); check('key.Ctrl+B', m1.includes('**word**'), { tail: m1.slice(-14) });
  await press(page, 'Control+z'); await sleep(200); let m2 = await md(page); check('key.Ctrl+Z', m2 === DOC, { tail: m2.slice(-14) });
  await focusEditor(page); await press(page, 'Control+y'); await sleep(200); let m3 = await md(page); check('key.Ctrl+Y', m3.includes('**word**'), { tail: m3.slice(-14) });
  await focusEditor(page); await press(page, 'Control+z'); await sleep(150); await focusEditor(page); await press(page, 'Control+Shift+Z'); await sleep(200); m3 = await md(page); check('key.Ctrl+Shift+Z', m3.includes('**word**'), { tail: m3.slice(-14) });
  await setMd(page, DOC); await sleep(300);
  await focusEditor(page, W, W + 4); await press(page, 'Control+i'); m1 = await md(page); check('key.Ctrl+I', /[*_]word[*_]/.test(m1) && !m1.includes('**word**'), { tail: m1.slice(-14) });
  await setMd(page, DOC); await sleep(300);
  await focusEditor(page, W, W + 4); await press(page, 'Control+k'); m1 = await md(page); s = await st(page, ['dialog']); check('key.Ctrl+K', m1.includes('[word]') || !!s.dialog, { tail: m1.slice(-24), dialog: s.dialog ? s.dialog.type || s.dialog.kind || true : null });
  if (s.dialog) { await call(page, 'closeDialog'); await sleep(100); }
  await setMd(page, DOC); await sleep(300);
  await focusEditor(page, W, W); await press(page, 'Tab'); m1 = await md(page); check('key.Tab', m1.includes('  word') || m1.includes('    word') || m1.includes('\tword'), { tail: JSON.stringify(m1.slice(-10)) });
  const W2 = m1.indexOf('word');
  await focusEditor(page, W2, W2); await press(page, 'Shift+Tab'); m1 = await md(page); check('key.Shift+Tab', m1 === DOC, { tail: JSON.stringify(m1.slice(-10)) });

  // Writing modes (Alt+Shift)
  await focusEditor(page);
  let before = await st(page, ['typewriterMode', 'focusParagraphMode', 'spellcheckEnabled', 'wordGoal']);
  await press(page, 'Alt+Shift+T'); s = await st(page, ['typewriterMode']); check('key.Alt+Shift+T', s.typewriterMode === !before.typewriterMode, s); await press(page, 'Alt+Shift+T');
  await press(page, 'Alt+Shift+P'); s = await st(page, ['focusParagraphMode']); check('key.Alt+Shift+P', s.focusParagraphMode === !before.focusParagraphMode, s); await press(page, 'Alt+Shift+P');
  await press(page, 'Alt+Shift+S'); s = await st(page, ['spellcheckEnabled']); check('key.Alt+Shift+S', s.spellcheckEnabled === !before.spellcheckEnabled, s); await press(page, 'Alt+Shift+S');
  await press(page, 'Alt+Shift+G'); await sleep(200); s = await st(page, ['wordGoal']); check('key.Alt+Shift+G', s.wordGoal === 500, s);

  // Slash menu
  await setMd(page, DOC + '\n'); await sleep(300);
  const end = (DOC + '\n').length;
  await focusEditor(page, end, end); await page.keyboard.type('/'); await sleep(250);
  s = await st(page, ['slashMenuOpen']); check('slash.open', s.slashMenuOpen === true, s);
  await press(page, 'ArrowDown'); await press(page, 'Escape'); s = await st(page, ['slashMenuOpen']); check('slash.escape', s.slashMenuOpen === false, s);
  await focusEditor(page, end + 1, end + 1); await page.keyboard.type('/'); await sleep(250); await press(page, 'Enter'); await sleep(250); m1 = await md(page); check('slash.enterInserts', m1.length > end + 2, { added: m1.length - end });

  // File keys (picker stubs record calls)
  await setMd(page, DOC); await sleep(200);
  await focusEditor(page); await press(page, 'Control+s'); await sleep(200);
  await focusEditor(page); await press(page, 'Control+Shift+S'); await sleep(200);
  await focusEditor(page); await press(page, 'Control+o'); await sleep(200);
  const pickers = await page.evaluate(() => window.__walk.pickers.slice());
  check('key.Ctrl+S/Ctrl+Shift+S/Ctrl+O', pickers.join(',') === 'save,save,open', { pickers, dialogs: dialogs.map((d) => d.type) });
  await focusEditor(page); await press(page, 'Control+n'); await sleep(300); m1 = await md(page); s = await st(page, ['fileName', 'dirty']); check('key.Ctrl+N', m1 !== DOC, { mdLen: m1.length, mdHash: sha(m1), ...s });

  // Exports
  await setMd(page, DOC); await sleep(500);
  await page.evaluate(() => { window.__walk.downloads.length = 0; });
  await call(page, 'handleExportText'); await call(page, 'handleExportHtml'); await call(page, 'handleExportDocx'); await call(page, 'handleExportPdf');
  await sleep(800);
  let dl = await page.evaluate(() => window.__walk.downloads.map((d) => ({ name: d.name, size: d.size, head: d.head, hasHeading: d.text ? d.text.includes('Walk heading') : null })));
  const opened = await page.evaluate(() => window.__walk.opened);
  check('export.txt', dl.some((d) => /\.txt$/.test(d.name) && d.hasHeading), dl.filter((d) => /\.txt$/.test(d.name)));
  check('export.html', dl.some((d) => /\.html$/.test(d.name) && d.hasHeading), dl.filter((d) => /\.html$/.test(d.name)));
  check('export.docx', dl.some((d) => /\.docx$/.test(d.name) && d.head === '504b0304'), dl.filter((d) => /\.docx$/.test(d.name)));
  check('export.pdf(window.open)', opened === 1, { opened });
  result.downloads.push(...dl);
  // Copy markdown / html
  await page.browserContext().overridePermissions(new URL(BASE).origin, ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write']);
  await call(page, 'handleCopyMarkdown'); await sleep(300);
  const clip = await page.evaluate(() => navigator.clipboard.readText().catch((e) => 'ERR ' + e.message));
  check('copy.markdown', clip.split('\r\n').join('\n') === DOC, { len: clip.length, note: 'Windows clipboard uses CRLF' });

  // Backup: export, mutate, import, restore browser backup
  await page.evaluate(() => { window.__walk.downloads.length = 0; });
  await call(page, 'exportWorkspaceBackup'); await sleep(600);
  const bk = await page.evaluate(() => window.__walk.downloads.find((d) => /\.json$/.test(d.name)));
  const bkJson = bk && bk.text ? JSON.parse(bk.text) : null;
  check('backup.export', !!bkJson, { name: bk && bk.name, keys: bkJson ? Object.keys(bkJson).sort() : null });
  const bkPath = path.join(userDataDir, 'backup.json'); if (bk && bk.text) fs.writeFileSync(bkPath, bk.text);
  await setMd(page, 'mutated\n'); await sleep(300);
  const input = await page.evaluateHandle((APP) => eval(APP).workspaceImportInputRef, APP);
  await input.asElement().uploadFile(bkPath); await sleep(800);
  m1 = await md(page); check('backup.import', m1 === DOC, { mdLen: m1.length });
  await sleep(1200);
  await setMd(page, 'mutated again\n'); await sleep(200);
  await page.evaluate((APP) => { const a = eval(APP); if (a.patch9BackupTimeout) { clearTimeout(a.patch9BackupTimeout); a.patch9BackupTimeout = null; } }, APP);
  await call(page, 'restoreBrowserBackup'); await sleep(800);
  m1 = await md(page); check('backup.restoreBrowser', m1 === DOC, { mdLen: m1.length });

  // Theme toggle
  before = await st(page, ['theme']);
  await call(page, 'handleThemeToggle'); await sleep(200);
  s = await st(page, ['theme']); const dark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  check('theme.toggle', s.theme !== before.theme && dark === (s.theme === 'dark'), { from: before.theme, to: s.theme, htmlDark: dark });
  await call(page, 'handleThemeToggle'); await sleep(200);

  // Persistence across reload
  await setMd(page, DOC); await sleep(1500);
  await page.reload({ waitUntil: 'load' }); await page.waitForFunction(() => window.__walk.readyAt, { timeout: 15000 }); await sleep(600);
  m1 = await md(page); check('persist.reload', m1 === DOC, { mdLen: m1.length });

  // Install + offline
  const manifest = await page.evaluate(() => fetch('manifest.webmanifest').then((r) => r.json()));
  const client = await page.createCDPSession();
  const inst = await client.send('Page.getInstallabilityErrors').catch((e) => ({ err: e.message }));
  check('install.manifest', !!manifest.name && manifest.icons.length >= 2, { name: manifest.name, start_url: manifest.start_url, icons: manifest.icons.length, installabilityErrors: inst.installabilityErrors || inst });
  const swReady = await page.evaluate(() => navigator.serviceWorker.ready.then((r) => !!r.active).catch(() => false));
  await page.reload({ waitUntil: 'load' }); await sleep(500);
  const controlled = await page.evaluate(() => !!navigator.serviceWorker.controller);
  const cacheInfo = await page.evaluate(() => caches.keys().then((ks) => Promise.all(ks.map((k) => caches.open(k).then((c) => c.keys()).then((r) => ({ k, n: r.length }))))));
  await page.setOfflineMode(true);
  await page.reload({ waitUntil: 'load' }).catch(() => null);
  let offOk = false;
  try { await page.waitForFunction(() => window.__walk && window.__walk.readyAt, { timeout: 10000 }); offOk = true; } catch (e) { offOk = false; }
  const offMd = offOk ? await md(page) : null;
  check('offline.reload', swReady && controlled && offOk && offMd === DOC, { swReady, controlled, cacheInfo, offOk, mdMatches: offMd === DOC });
  await page.setOfflineMode(false);
  result.dialogs = dialogs;
} catch (err) {
  result.fatal = String(err && err.stack || err);
  fail.push('fatal');
} finally {
  await browser.close();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) { /* ignore */ }
}
result.failed = fail;
const st0 = result.startup;
const med = (k) => st0.map((x) => x[k]).sort((a, b) => a - b)[Math.floor(st0.length / 2)];
result.startupMedian = st0.length ? { dcl: med('dcl'), load: med('load'), appReady: med('appReady'), requests: med('requests'), bytes: med('bytes'), jsHeapMB: med('jsHeapMB') } : null;
fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
const fingerprint = {
  steps: Object.fromEntries(Object.entries(result.steps).map(([k, v]) => [k, v.ok])),
  observed: Object.fromEntries(Object.entries(result.steps).filter(([k]) => !/^(boot$|offline|install|backup\.export)/.test(k)).map(([k, v]) => [k, v.observed])),
  commands: result.commands, slash: result.slash, shortcutsSheet: result.shortcutsSheet,
  downloads: result.downloads.map((d) => ({ name: d.name, head: d.head, hasHeading: d.hasHeading })),
  dialogs: result.dialogs || null
};
const fpPath = OUT.replace(/\.json$/, '') + '.fingerprint.json';
fs.writeFileSync(fpPath, JSON.stringify(fingerprint, null, 2));
let diff = [];
if (BASELINE) {
  const base = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
  for (const k of Object.keys(fingerprint)) {
    if (JSON.stringify(base[k]) !== JSON.stringify(fingerprint[k])) diff.push(k);
  }
}
const n = Object.keys(result.steps).length;
console.log(`steps ${n - fail.filter((f) => f !== 'fatal').length}/${n} pass; failed: ${fail.join(', ') || 'none'}; console errors ${result.errors.length}; page errors ${result.pageErrors.length}`);
console.log('startup median', JSON.stringify(result.startupMedian));
console.log(`commands ${result.commands.length}, slash ${result.slash.length}`);
if (BASELINE) console.log(`fingerprint vs ${BASELINE}: ${diff.length ? 'DIFF in ' + diff.join(', ') : 'identical'}`);
process.exitCode = fail.length || diff.length ? 1 : 0;
