(function () {
  var e = React.createElement;
  var STORAGE_KEY = 'markdown-studio-local:v1';
  var DIVIDER_WIDTH = 14;
  var MAX_HISTORY = 180;
  var EDITOR_LINE_HEIGHT = 24;
  var EDITOR_PADDING_Y = 14;
  var MAX_RECENTS = 8;
  var MAX_RECENT_SNAPSHOT_CHARS = 120000;

  var THEME_PRESETS = [
    { value: 'sky', label: 'Sky blue' },
    { value: 'violet', label: 'Violet' },
    { value: 'emerald', label: 'Emerald' }
  ];

  var UTILITY_TABS = [
    { value: 'outline', label: 'Outline' },
    { value: 'stats', label: 'Stats' },
    { value: 'recent', label: 'Recent' }
  ];

  var SHORTCUT_GROUPS = [
    {
      title: 'File and command palette',
      items: [
        ['Ctrl/Cmd + N', 'New document'],
        ['Ctrl/Cmd + O', 'Open markdown file'],
        ['Ctrl/Cmd + S', 'Save'],
        ['Ctrl/Cmd + Shift + S', 'Save As'],
        ['Ctrl/Cmd + P', 'Open command palette']
      ]
    },
    {
      title: 'Editing',
      items: [
        ['Ctrl/Cmd + B', 'Bold'],
        ['Ctrl/Cmd + I', 'Italic'],
        ['Ctrl/Cmd + K', 'Insert link'],
        ['Ctrl/Cmd + F', 'Open find / replace'],
        ['Tab', 'Indent selection'],
        ['Shift + Tab', 'Outdent selection']
      ]
    },
    {
      title: 'Panels and views',
      items: [
        ['Ctrl/Cmd + /', 'Toggle zen mode'],
        ['Ctrl/Cmd + .', 'Toggle focus mode'],
        ['Ctrl/Cmd + Shift + O', 'Open outline sidebar'],
        ['Ctrl/Cmd + Alt + S', 'Open stats sidebar'],
        ['Ctrl/Cmd + Shift + R', 'Open recent sessions']
      ]
    },
    {
      title: 'Navigation',
      items: [
        ['↑ / ↓', 'Move inside the command palette'],
        ['Enter', 'Run the selected command'],
        ['F1', 'Open shortcuts help'],
        ['Esc', 'Close panels, dialogs, or exit zen']
      ]
    }
  ];

  var DEFAULT_MARKDOWN = [
    '# Markdown Studio Local',
    '',
    'The **final polished build** keeps everything local while combining split editing, exports, templates, snapshots, style studio, and a new settings center into one laptop-friendly workspace.',
    '',
    '## Final polish highlights',
    '',
    '- [x] Editor stays on the left and preview stays on the right',
    '- [x] Quick-start guide and release notes are available inside the app',
    '- [x] Workspace settings now control writing, preview, motion, and cleanup options',
    '- [x] Stacked toasts make file, export, and workflow feedback easier to follow',
    '- [x] The project remains fully local and browser-based',
    '',
    '## Best workflow',
    '',
    '1. Start with **Ctrl/Cmd + P** for the command palette.',
    '2. Press **Ctrl/Cmd + ,** to open workspace settings.',
    '3. Use **Ctrl/Cmd + /** for zen mode or **Ctrl/Cmd + .** for focus mode.',
    '4. Capture snapshots before larger edits and export when the note is ready.',
    '',
    '> [!TIP]',
    '> Use headings like the ones below to populate the live outline sidebar automatically.',
    '',
    '## Outline demo',
    '',
    '### Editor workflow',
    '',
    'Write on the left, review on the right, and let the preview stay in sync as you scroll.',
    '',
    '### Review checklist',
    '',
    '- [x] Live preview stays synced',
    '- [x] Export flows remain local',
    '- [x] Patch 5 final polish is applied',
    '',
    '## Metrics sample',
    '',
    '| Metric | Why it matters |',
    '| :--- | :--- |',
    '| Reading time | Helps you pace reviews |',
    '| Heading count | Shows document structure |',
    '| Snapshot count | Helps you verify version safety |',
    '',
    '```js',
    'function openSettings() {',
    '  return "Press Ctrl/Cmd + , for the final settings center.";',
    '}',
    '```',
    '',
    'Keep writing on the left, inspect structure on the right, and open the guide or settings whenever you want to tune the workspace.'
  ].join('\n');

  var NEW_DOCUMENT_MARKDOWN = ['# Untitled', '', 'Start writing here...'].join('\n');


  var CALLOUT_LABELS = {
    note: 'Note',
    tip: 'Tip',
    important: 'Important',
    warning: 'Warning',
    caution: 'Caution'
  };

  var INSERT_LANGUAGES = [
    { value: 'text', label: 'Plain text' },
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'tsx', label: 'TSX / React' },
    { value: 'jsx', label: 'JSX / React' },
    { value: 'json', label: 'JSON' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'md', label: 'Markdown' },
    { value: 'bash', label: 'Bash' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'sql', label: 'SQL' },
    { value: 'yaml', label: 'YAML' }
  ];

  var EXPORT_DOCUMENT_CSS = [
    ':root { color-scheme: light; }',
    '* { box-sizing: border-box; }',
    'body { margin: 0; background: #f8fafc; color: #0f172a; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }',
    '.export-shell { max-width: 920px; margin: 0 auto; padding: 40px 28px 64px; }',
    '.markdown-body { font-size: 16px; line-height: 1.78; color: #334155; }',
    '.markdown-body > * + * { margin-top: 1rem; }',
    '.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 { color: #0f172a; line-height: 1.25; letter-spacing: -0.02em; }',
    '.markdown-body h1 { margin: 0 0 0.9rem; padding-bottom: 0.8rem; border-bottom: 1px solid rgba(148, 163, 184, 0.3); font-size: 2rem; }',
    '.markdown-body h2 { margin-top: 1.8rem; padding-bottom: 0.45rem; border-bottom: 1px solid rgba(148, 163, 184, 0.22); font-size: 1.45rem; }',
    '.markdown-body h3 { margin-top: 1.45rem; font-size: 1.2rem; }',
    '.markdown-body a { color: #0369a1; text-decoration: none; font-weight: 600; }',
    '.markdown-body a:hover { text-decoration: underline; }',
    '.markdown-body blockquote { margin: 1rem 0; border-left: 4px solid rgba(14, 165, 233, 0.62); border-radius: 0 14px 14px 0; padding: 0.9rem 1rem; background: rgba(14, 165, 233, 0.08); color: #0f172a; }',
    '.markdown-body .md-callout { border-left-width: 4px; border-left-style: solid; border-radius: 0 16px 16px 0; padding: 0.95rem 1rem; }',
    '.markdown-body .callout-label { display: inline-flex; align-items: center; padding: 0.2rem 0.55rem; border-radius: 999px; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.55rem; }',
    '.markdown-body .md-callout--note { background: rgba(14, 165, 233, 0.08); border-left-color: #0ea5e9; }',
    '.markdown-body .md-callout--note .callout-label { background: rgba(14, 165, 233, 0.14); color: #0369a1; }',
    '.markdown-body .md-callout--tip { background: rgba(16, 185, 129, 0.08); border-left-color: #10b981; }',
    '.markdown-body .md-callout--tip .callout-label { background: rgba(16, 185, 129, 0.14); color: #047857; }',
    '.markdown-body .md-callout--important { background: rgba(79, 70, 229, 0.08); border-left-color: #4f46e5; }',
    '.markdown-body .md-callout--important .callout-label { background: rgba(79, 70, 229, 0.14); color: #4338ca; }',
    '.markdown-body .md-callout--warning, .markdown-body .md-callout--caution { background: rgba(245, 158, 11, 0.1); border-left-color: #f59e0b; }',
    '.markdown-body .md-callout--warning .callout-label, .markdown-body .md-callout--caution .callout-label { background: rgba(245, 158, 11, 0.16); color: #b45309; }',
    '.markdown-body table { width: 100%; border-collapse: collapse; overflow: hidden; border-radius: 14px; border: 1px solid rgba(148, 163, 184, 0.28); background: #ffffff; }',
    '.markdown-body th, .markdown-body td { padding: 0.78rem 0.9rem; border-bottom: 1px solid rgba(148, 163, 184, 0.18); text-align: left; }',
    '.markdown-body th { background: rgba(15, 23, 42, 0.04); color: #0f172a; font-weight: 800; }',
    '.markdown-body tr:last-child td { border-bottom: none; }',
    '.markdown-body code:not(pre code) { display: inline-block; padding: 0.16rem 0.45rem; margin: 0 0.08rem; border-radius: 0.45rem; background: rgba(15, 23, 42, 0.06); color: #0f172a; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }',
    '.markdown-body pre { overflow: auto; border-radius: 16px; border: 1px solid rgba(148, 163, 184, 0.18); background: #0f172a; color: #e2e8f0; }',
    '.markdown-body pre code { display: block; padding: 1rem 1.1rem; font-size: 0.92rem; line-height: 1.68; }',
    '.markdown-body img { display: block; max-width: 100%; border-radius: 16px; border: 1px solid rgba(148, 163, 184, 0.18); }',
    '.hljs { color: #e2e8f0; background: transparent; }',
    '.hljs-comment, .hljs-quote { color: #94a3b8; font-style: italic; }',
    '.hljs-keyword, .hljs-selector-tag, .hljs-section, .hljs-title { color: #93c5fd; }',
    '.hljs-string, .hljs-attr, .hljs-attribute, .hljs-template-tag { color: #86efac; }',
    '.hljs-number, .hljs-literal, .hljs-symbol, .hljs-bullet { color: #fca5a5; }',
    '.hljs-built_in, .hljs-type, .hljs-class, .hljs-function { color: #f9a8d4; }',
    '.hljs-meta, .hljs-meta-string { color: #fcd34d; }',
    '@media print { body { background: #ffffff; } .export-shell { max-width: none; padding: 0; } }'
  ].join('\n');

  function cx() {
    var classes = [];
    for (var i = 0; i < arguments.length; i += 1) {
      if (arguments[i]) {
        classes.push(arguments[i]);
      }
    }
    return classes.join(' ');
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function maybePreventDefault(event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
  }

  function readStoredSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (error) {
      console.warn('Unable to read saved state.', error);
      return {};
    }
  }

  function computeStats(text) {
    var normalized = text || '';
    var words = null;
    try {
      words = normalized.trim().match(/[\p{L}\p{N}_'-]+/gu);
    } catch (error) {
      words = normalized.trim().match(/[A-Za-z0-9_'-]+/g);
    }
    return {
      words: words ? words.length : 0,
      characters: normalized.length,
      charactersNoSpaces: normalized.replace(/\s/g, '').length,
      lines: normalized.split(/\n/).length,
      readingMinutes: normalized.trim() ? Math.max(1, Math.ceil((words ? words.length : 0) / 220)) : 0
    };
  }

  function hasFilesInTransfer(dataTransfer) {
    var types = dataTransfer && dataTransfer.types;
    if (!types) {
      return false;
    }
    if (typeof types.contains === 'function') {
      return types.contains('Files');
    }
    if (typeof types.indexOf === 'function') {
      return types.indexOf('Files') !== -1;
    }
    for (var i = 0; i < types.length; i += 1) {
      if (types[i] === 'Files') {
        return true;
      }
    }
    return false;
  }

  function formatTime(isoString) {
    if (!isoString) {
      return 'not saved yet';
    }
    try {
      return new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(isoString));
    } catch (error) {
      return isoString;
    }
  }

  function formatDateTime(isoString) {
    if (!isoString) {
      return 'not available';
    }
    try {
      return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(isoString));
    } catch (error) {
      return isoString;
    }
  }

  function normalizeThemePreset(value) {
    for (var i = 0; i < THEME_PRESETS.length; i += 1) {
      if (THEME_PRESETS[i].value === value) {
        return value;
      }
    }
    return THEME_PRESETS[0].value;
  }

  function stripMarkdownFormatting(text) {
    return String(text || '')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/~~([^~]+)~~/g, '$1')
      .replace(/[>#*`~-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function slugifyHeading(text) {
    return String(text || 'heading')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') || 'heading';
  }

  function buildHeadingOutline(text) {
    var lines = String(text || '').split(/\r?\n/);
    var outline = [];
    var offset = 0;
    var seen = {};

    for (var i = 0; i < lines.length; i += 1) {
      var line = lines[i];
      var match = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
      if (match) {
        var raw = match[2].replace(/\s+#+\s*$/, '');
        var label = stripMarkdownFormatting(raw) || 'Heading';
        var slug = slugifyHeading(label);
        seen[slug] = (seen[slug] || 0) + 1;
        outline.push({
          id: slug + '-' + seen[slug],
          level: match[1].length,
          text: label,
          line: i + 1,
          position: offset
        });
      }
      offset += line.length + 1;
    }

    return outline;
  }

  function summarizeMarkdown(text) {
    var summary = stripMarkdownFormatting(text).replace(/\s+/g, ' ').trim();
    if (summary.length > 160) {
      return summary.slice(0, 157).trim() + '...';
    }
    return summary;
  }

  function computeDocumentInsights(text) {
    var source = String(text || '');
    var outline = buildHeadingOutline(source);
    var lines = source.split(/\r?\n/);
    var imageCount = (source.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
    var linkCount = Math.max(0, (source.match(/\[[^\]]+\]\([^)]+\)/g) || []).length - imageCount);
    var codeFenceCount = (source.match(/^```/gm) || []).length;
    var taskTotal = (source.match(/^\s*[-*+]\s+\[[ xX]\]/gm) || []).length;
    var taskDone = (source.match(/^\s*[-*+]\s+\[[xX]\]/gm) || []).length;
    var bulletCount = (source.match(/^\s*[-*+]\s+(?!\[[ xX]\])/gm) || []).length;
    var orderedCount = (source.match(/^\s*\d+\.\s+/gm) || []).length;
    var quoteCount = (source.match(/^\s*>\s+/gm) || []).length;
    var paragraphCount = 0;
    var tableCount = 0;
    var i = 0;

    for (i = 0; i < lines.length - 1; i += 1) {
      if (lines[i].indexOf('|') !== -1 && /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(lines[i + 1])) {
        tableCount += 1;
      }
    }

    var blocks = source.split(/\n\s*\n/);
    for (i = 0; i < blocks.length; i += 1) {
      var trimmed = blocks[i].trim();
      if (!trimmed) {
        continue;
      }
      if (/^(#{1,6}\s|```|>|[-*+]\s|\d+\.\s|\|)/.test(trimmed)) {
        continue;
      }
      paragraphCount += 1;
    }

    return {
      outline: outline,
      headings: outline.length,
      images: imageCount,
      links: linkCount,
      codeBlocks: Math.ceil(codeFenceCount / 2),
      tables: tableCount,
      tasksTotal: taskTotal,
      tasksDone: taskDone,
      bulletItems: bulletCount,
      orderedItems: orderedCount,
      quotes: quoteCount,
      paragraphs: paragraphCount
    };
  }

  function normalizeRecentDocuments(items) {
    if (!Array.isArray(items)) {
      return [];
    }
    var normalized = [];

    for (var i = 0; i < items.length; i += 1) {
      var entry = items[i];
      if (!entry || !entry.fileName) {
        continue;
      }
      normalized.push({
        id: entry.id || (entry.fileName + '-' + i),
        fileName: entry.fileName,
        updatedAt: entry.updatedAt || null,
        snippet: entry.snippet || '',
        markdown: typeof entry.markdown === 'string' ? entry.markdown : null,
        source: entry.source || 'snapshot',
        size: Number(entry.size) || (entry.markdown ? entry.markdown.length : 0)
      });
    }

    return normalized.slice(0, MAX_RECENTS);
  }

  function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      try {
        var helper = document.createElement('textarea');
        helper.value = text;
        helper.setAttribute('readonly', 'readonly');
        helper.style.position = 'fixed';
        helper.style.top = '-9999px';
        helper.style.left = '-9999px';
        document.body.appendChild(helper);
        helper.focus();
        helper.select();
        var didCopy = document.execCommand('copy');
        document.body.removeChild(helper);
        if (!didCopy) {
          reject(new Error('Clipboard copy was rejected.'));
          return;
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  function getPlainSearchMatches(text, query) {
    var source = String(text || '');
    var needle = String(query || '');
    if (!needle) {
      return [];
    }

    var lowerSource = source.toLowerCase();
    var lowerNeedle = needle.toLowerCase();
    var matches = [];
    var cursor = 0;

    while (cursor <= lowerSource.length) {
      var nextIndex = lowerSource.indexOf(lowerNeedle, cursor);
      if (nextIndex === -1) {
        break;
      }
      matches.push({
        start: nextIndex,
        end: nextIndex + needle.length
      });
      cursor = nextIndex + Math.max(needle.length, 1);
    }

    return matches;
  }

  function getLineNumberForPosition(text, position) {
    return String(text || '').slice(0, Math.max(0, position)).split('\n').length;
  }

  function createLineNumberElements(lineCount, currentLine) {
    var items = [];
    for (var i = 0; i < lineCount; i += 1) {
      items.push(
        e(
          'div',
          {
            key: i,
            className: cx('editor-line-number', currentLine === i + 1 ? 'is-current' : '')
          },
          i + 1
        )
      );
    }
    return items;
  }


  function getFileBaseName(fileName) {
    var name = String(fileName || 'document.md');
    var base = name.replace(/\.[^./\\]+$/, '');
    return base || 'document';
  }

  function escapeAttributeValue(value) {
    return String(value || '').replace(/"/g, '\\"');
  }

  function buildMarkdownImage(alt, src, title) {
    var safeAlt = alt || 'Image';
    var safeSrc = src || '';
    var titlePart = title ? ' "' + escapeAttributeValue(title) + '"' : '';
    return '![' + safeAlt + '](' + safeSrc + titlePart + ')';
  }

  function buildMarkdownLink(label, href, title) {
    var safeLabel = label || 'Link';
    var safeHref = href || '#';
    var titlePart = title ? ' "' + escapeAttributeValue(title) + '"' : '';
    return '[' + safeLabel + '](' + safeHref + titlePart + ')';
  }

  function buildMarkdownTable(columnCount, rowCount, alignment) {
    var columns = clamp(Number(columnCount) || 3, 1, 8);
    var rows = clamp(Number(rowCount) || 3, 1, 12);
    var alignToken = alignment === 'center' ? ':---:' : alignment === 'right' ? '---:' : ':---';
    var header = [];
    var divider = [];
    var body = [];

    for (var col = 0; col < columns; col += 1) {
      header.push('Column ' + (col + 1));
      divider.push(alignToken);
    }

    for (var row = 0; row < rows; row += 1) {
      var cells = [];
      for (var colIndex = 0; colIndex < columns; colIndex += 1) {
        cells.push(row === 0 ? 'Value' : 'Row ' + (row + 1));
      }
      body.push('| ' + cells.join(' | ') + ' |');
    }

    return ['| ' + header.join(' | ') + ' |', '| ' + divider.join(' | ') + ' |'].concat(body).join('\n');
  }

  function buildCalloutMarkdown(tone, heading, body) {
    var normalizedTone = String(tone || 'NOTE').toUpperCase();
    var lines = ['> [!' + normalizedTone + ']'];
    if (heading) {
      lines.push('> **' + heading + '**');
    }
    String(body || 'Add your message here.').split(/\r?\n/).forEach(function (line) {
      lines.push('> ' + (line || ' '));
    });
    return lines.join('\n');
  }

  function formatInsertedDateTime(mode) {
    var now = new Date();
    try {
      if (mode === 'date') {
        return new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(now);
      }
      if (mode === 'time') {
        return new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(now);
      }
      if (mode === 'iso') {
        return now.toISOString();
      }
      return new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeStyle: 'short' }).format(now);
    } catch (error) {
      return mode === 'time' ? now.toLocaleTimeString() : now.toLocaleString();
    }
  }

  function readFileAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      try {
        var reader = new FileReader();
        reader.onload = function () {
          resolve(String(reader.result || ''));
        };
        reader.onerror = function () {
          reject(reader.error || new Error('Unable to read the selected file.'));
        };
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  }

  function postProcessRenderedHtml(html) {
    if (typeof DOMParser === 'undefined') {
      return html;
    }

    try {
      var documentParser = new DOMParser();
      var doc = documentParser.parseFromString('<!doctype html><html><body>' + html + '</body></html>', 'text/html');
      var blockquotes = doc.querySelectorAll('blockquote');
      for (var i = 0; i < blockquotes.length; i += 1) {
        var blockquote = blockquotes[i];
        var firstParagraph = blockquote.querySelector('p');
        if (!firstParagraph) {
          continue;
        }
        var match = firstParagraph.innerHTML.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i);
        if (!match) {
          continue;
        }
        var tone = String(match[1] || '').toLowerCase();
        firstParagraph.innerHTML = firstParagraph.innerHTML.replace(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, '');
        blockquote.classList.add('md-callout', 'md-callout--' + tone);
        var label = doc.createElement('div');
        label.className = 'callout-label';
        label.textContent = CALLOUT_LABELS[tone] || tone;
        blockquote.insertBefore(label, blockquote.firstChild);
        if (!firstParagraph.textContent.trim() && !firstParagraph.children.length && firstParagraph.nextElementSibling) {
          firstParagraph.parentNode.removeChild(firstParagraph);
        }
      }
      return doc.body.innerHTML;
    } catch (error) {
      console.warn('Unable to post-process rendered markdown.', error);
      return html;
    }
  }

  function getHighlightedHtmlFragment(html) {
    if (typeof document === 'undefined') {
      return html;
    }
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    if (window.hljs && window.hljs.highlightElement) {
      var blocks = wrapper.querySelectorAll('pre code');
      for (var i = 0; i < blocks.length; i += 1) {
        var rawText = blocks[i].textContent;
        blocks[i].textContent = rawText;
        if (blocks[i].dataset) {
          delete blocks[i].dataset.highlighted;
        }
        blocks[i].classList.remove('hljs');
        window.hljs.highlightElement(blocks[i]);
      }
    }
    return wrapper.innerHTML;
  }

  function htmlToPlainText(html) {
    if (typeof document === 'undefined') {
      return String(html || '');
    }
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    var text = wrapper.innerText || wrapper.textContent || '';
    return text.replace(/\n{3,}/g, '\n\n').trim() + '\n';
  }

  function buildStandaloneExportHtml(title, innerHtml) {
    return [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '<head>',
      '<meta charset="UTF-8" />',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
      '<title>' + escapeHtml(title) + '</title>',
      '<style>' + EXPORT_DOCUMENT_CSS + '</style>',
      '</head>',
      '<body>',
      '<main class="export-shell">',
      '<article class="markdown-body">' + innerHtml + '</article>',
      '</main>',
      '</body>',
      '</html>'
    ].join('');
  }

  function triggerBlobDownload(filename, blob) {
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function createComposerDialogState(type) {
    if (type === 'image') {
      return {
        type: 'image',
        title: 'Insert image',
        description: 'Paste an image URL or embed a local image file directly into the markdown document.',
        mode: 'url',
        url: '',
        alt: 'Image description',
        assetTitle: '',
        dataUrl: '',
        fileName: '',
        accept: 'image/*',
        loading: false
      };
    }
    if (type === 'gif') {
      return {
        type: 'gif',
        title: 'Insert GIF',
        description: 'Paste a GIF URL or embed a local GIF so the markdown stays fully portable.',
        mode: 'url',
        url: '',
        alt: 'Animated GIF',
        assetTitle: '',
        dataUrl: '',
        fileName: '',
        accept: 'image/gif',
        loading: false
      };
    }
    if (type === 'file') {
      return {
        type: 'file',
        title: 'Insert file link',
        description: 'Add a download link from a URL or embed a local file as a self-contained data URL.',
        mode: 'url',
        url: '',
        label: 'Download file',
        assetTitle: '',
        dataUrl: '',
        fileName: '',
        accept: '*/*',
        loading: false
      };
    }
    if (type === 'code') {
      return {
        type: 'code',
        title: 'Insert code block',
        description: 'Choose a language and add a starter snippet for syntax-highlighted preview blocks.',
        language: 'js',
        snippet: 'console.log("Hello, Markdown Studio");'
      };
    }
    if (type === 'table') {
      return {
        type: 'table',
        title: 'Insert table',
        description: 'Generate a GitHub-flavored markdown table with your preferred number of columns and rows.',
        columns: '3',
        rows: '3',
        alignment: 'left'
      };
    }
    if (type === 'callout') {
      return {
        type: 'callout',
        title: 'Insert callout',
        description: 'Add a note, tip, warning, or important callout using Markdown Studio callout styling.',
        tone: 'NOTE',
        heading: 'Note',
        body: 'Add a short message here.'
      };
    }
    return {
      type: 'datetime',
      title: 'Insert date / time',
      description: 'Insert a timestamp into the markdown source using a local browser-formatted value.',
      format: 'datetime'
    };
  }

  function createCrc32Table() {
    var table = [];
    for (var n = 0; n < 256; n += 1) {
      var c = n;
      for (var k = 0; k < 8; k += 1) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[n] = c >>> 0;
    }
    return table;
  }

  var CRC32_TABLE = createCrc32Table();

  function computeCrc32(bytes) {
    var crc = 0 ^ (-1);
    for (var i = 0; i < bytes.length; i += 1) {
      crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ bytes[i]) & 0xff];
    }
    return (crc ^ (-1)) >>> 0;
  }

  function toByteArray(value) {
    if (value instanceof Uint8Array) {
      return value;
    }
    if (value instanceof ArrayBuffer) {
      return new Uint8Array(value);
    }
    if (ArrayBuffer.isView(value)) {
      return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    }
    return new TextEncoder().encode(String(value || ''));
  }

  function getDosDateTime(date) {
    var safeDate = date || new Date();
    return {
      time: ((safeDate.getHours() & 31) << 11) | ((safeDate.getMinutes() & 63) << 5) | ((Math.floor(safeDate.getSeconds() / 2)) & 31),
      date: ((((safeDate.getFullYear() - 1980) & 127) << 9) | (((safeDate.getMonth() + 1) & 15) << 5) | (safeDate.getDate() & 31)) >>> 0
    };
  }

  function createStoredZipBlob(entries, mimeType) {
    var now = getDosDateTime(new Date());
    var fileParts = [];
    var centralParts = [];
    var offset = 0;
    var centralSize = 0;

    for (var i = 0; i < entries.length; i += 1) {
      var entry = entries[i];
      var nameBytes = toByteArray(entry.name);
      var dataBytes = toByteArray(entry.data);
      var crc = computeCrc32(dataBytes);

      var localHeader = new Uint8Array(30 + nameBytes.length);
      var localView = new DataView(localHeader.buffer);
      localView.setUint32(0, 0x04034b50, true);
      localView.setUint16(4, 20, true);
      localView.setUint16(6, 0, true);
      localView.setUint16(8, 0, true);
      localView.setUint16(10, now.time, true);
      localView.setUint16(12, now.date, true);
      localView.setUint32(14, crc, true);
      localView.setUint32(18, dataBytes.length, true);
      localView.setUint32(22, dataBytes.length, true);
      localView.setUint16(26, nameBytes.length, true);
      localView.setUint16(28, 0, true);
      localHeader.set(nameBytes, 30);

      var centralHeader = new Uint8Array(46 + nameBytes.length);
      var centralView = new DataView(centralHeader.buffer);
      centralView.setUint32(0, 0x02014b50, true);
      centralView.setUint16(4, 20, true);
      centralView.setUint16(6, 20, true);
      centralView.setUint16(8, 0, true);
      centralView.setUint16(10, 0, true);
      centralView.setUint16(12, now.time, true);
      centralView.setUint16(14, now.date, true);
      centralView.setUint32(16, crc, true);
      centralView.setUint32(20, dataBytes.length, true);
      centralView.setUint32(24, dataBytes.length, true);
      centralView.setUint16(28, nameBytes.length, true);
      centralView.setUint16(30, 0, true);
      centralView.setUint16(32, 0, true);
      centralView.setUint16(34, 0, true);
      centralView.setUint16(36, 0, true);
      centralView.setUint32(38, 0, true);
      centralView.setUint32(42, offset, true);
      centralHeader.set(nameBytes, 46);

      fileParts.push(localHeader, dataBytes);
      centralParts.push(centralHeader);
      offset += localHeader.length + dataBytes.length;
      centralSize += centralHeader.length;
    }

    var endOfCentral = new Uint8Array(22);
    var endView = new DataView(endOfCentral.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(4, 0, true);
    endView.setUint16(6, 0, true);
    endView.setUint16(8, entries.length, true);
    endView.setUint16(10, entries.length, true);
    endView.setUint32(12, centralSize, true);
    endView.setUint32(16, offset, true);
    endView.setUint16(20, 0, true);

    return new Blob(fileParts.concat(centralParts).concat([endOfCentral]), {
      type: mimeType || 'application/zip'
    });
  }

  function buildDocxBlobFromHtml(title, htmlDocument) {
    var safeTitle = title || 'document';
    var timestamp = new Date().toISOString();
    var contentTypes = [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
      '<Default Extension="xml" ContentType="application/xml"/>',
      '<Default Extension="html" ContentType="text/html"/>',
      '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>',
      '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>',
      '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>',
      '</Types>'
    ].join('');
    var packageRels = [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>',
      '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>',
      '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>',
      '</Relationships>'
    ].join('');
    var documentXml = [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">',
      '<w:body>',
      '<w:altChunk r:id="htmlChunk"/>',
      '<w:sectPr>',
      '<w:pgSz w:w="12240" w:h="15840"/>',
      '<w:pgMar w:top="1440" w:right="1200" w:bottom="1440" w:left="1200" w:header="708" w:footer="708" w:gutter="0"/>',
      '<w:cols w:space="708"/>',
      '<w:docGrid w:linePitch="360"/>',
      '</w:sectPr>',
      '</w:body>',
      '</w:document>'
    ].join('');
    var documentRels = [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
      '<Relationship Id="htmlChunk" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk" Target="afchunk.html"/>',
      '</Relationships>'
    ].join('');
    var appProps = [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">',
      '<Application>Markdown Studio Local</Application>',
      '<DocSecurity>0</DocSecurity>',
      '<ScaleCrop>false</ScaleCrop>',
      '<Company></Company>',
      '<LinksUpToDate>false</LinksUpToDate>',
      '<SharedDoc>false</SharedDoc>',
      '<HyperlinksChanged>false</HyperlinksChanged>',
      '<AppVersion>1.0</AppVersion>',
      '</Properties>'
    ].join('');
    var coreProps = [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
      '<dc:title>' + escapeHtml(safeTitle) + '</dc:title>',
      '<dc:creator>Markdown Studio Local</dc:creator>',
      '<cp:lastModifiedBy>Markdown Studio Local</cp:lastModifiedBy>',
      '<dcterms:created xsi:type="dcterms:W3CDTF">' + timestamp + '</dcterms:created>',
      '<dcterms:modified xsi:type="dcterms:W3CDTF">' + timestamp + '</dcterms:modified>',
      '</cp:coreProperties>'
    ].join('');

    return createStoredZipBlob([
      { name: '[Content_Types].xml', data: contentTypes },
      { name: '_rels/.rels', data: packageRels },
      { name: 'docProps/app.xml', data: appProps },
      { name: 'docProps/core.xml', data: coreProps },
      { name: 'word/document.xml', data: documentXml },
      { name: 'word/_rels/document.xml.rels', data: documentRels },
      { name: 'word/afchunk.html', data: htmlDocument }
    ], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  }

  var renderer = new marked.Renderer();
  renderer.link = function (href, title, text) {
    var safeHref = href || '#';
    var titleAttribute = title ? ' title="' + escapeHtml(title) + '"' : '';
    return '<a href="' + escapeHtml(safeHref) + '" target="_blank" rel="noopener noreferrer"' + titleAttribute + '>' + text + '</a>';
  };

  marked.setOptions({
    renderer: renderer,
    gfm: true,
    breaks: false,
    smartLists: true,
    smartypants: true,
    headerIds: true,
    mangle: false
  });

  function renderMarkdown(markdown) {
    try {
      var html = '';
      if (marked.parse) {
        html = marked.parse(markdown || '');
      } else if (marked.marked) {
        html = marked.marked(markdown || '');
      } else {
        html = '<p>Markdown parser not available.</p>';
      }
      return postProcessRenderedHtml(html);
    } catch (error) {
      return '<pre class="render-error">' + escapeHtml(error.message || String(error)) + '</pre>';
    }
  }

  function ActionButton(props) {
    return e(
      'button',
      {
        type: 'button',
        onClick: props.onClick,
        title: props.title || props.label,
        disabled: !!props.disabled,
        className: cx(
          'app-btn',
          props.primary ? 'app-btn--primary' : 'app-btn--secondary',
          props.compact ? 'app-btn--compact' : '',
          props.active ? 'is-active' : ''
        )
      },
      [
        props.icon ? e('span', { key: 'icon', className: 'btn-icon' }, props.icon) : null,
        e('span', { key: 'label' }, props.label)
      ]
    );
  }

  function ToolbarButton(props) {
    return e(
      'button',
      {
        type: 'button',
        onClick: props.onClick,
        title: props.title || props.label,
        disabled: !!props.disabled,
        className: cx(
          'toolbar-btn',
          props.emphasis ? 'toolbar-btn--accent' : '',
          props.active ? 'is-active' : ''
        )
      },
      [
        props.icon ? e('span', { key: 'icon', className: 'toolbar-btn__icon' }, props.icon) : null,
        props.label ? e('span', { key: 'label', className: 'toolbar-btn__label' }, props.label) : null
      ]
    );
  }

  function StatusChip(props) {
    return e(
      'span',
      {
        className: cx(
          'status-chip',
          props.tone === 'success'
            ? 'chip--success'
            : props.tone === 'warning'
              ? 'chip--warning'
              : props.tone === 'accent'
                ? 'chip--accent'
                : ''
        )
      },
      props.children
    );
  }

  function StatBlock(props) {
    return e(
      'div',
      {
        className: 'stat-block'
      },
      [
        e('span', { key: 'label', className: 'stat-block__label' }, props.label),
        e('span', { key: 'value', className: 'stat-block__value' }, props.value)
      ]
    );
  }

  function Toast(props) {
    if (!props.message) {
      return null;
    }
    return e(
      'div',
      {
        className: cx(
          'app-toast',
          props.tone === 'error' ? 'app-toast--error' : 'app-toast--success'
        )
      },
      props.message
    );
  }

  function HiddenFileInput(props) {
    return e('input', {
      ref: props.fileInputRef,
      type: 'file',
      accept: '.md,.markdown,.txt,text/markdown,text/plain',
      className: 'hidden',
      onChange: props.onChange
    });
  }

  function ShortcutsModal(props) {
    if (!props.open) {
      return null;
    }

    return e('div', {
      className: 'modal-backdrop',
      onClick: function (event) {
        if (event.target === event.currentTarget) {
          props.onClose();
        }
      }
    }, e('div', { className: 'modal-card' }, [
      e('div', { key: 'header', className: 'modal-card__header' }, [
        e('div', { key: 'copy' }, [
          e('h3', { key: 'title', className: 'modal-card__title' }, 'Keyboard shortcuts'),
          e('p', { key: 'subtitle', className: 'modal-card__subtitle' }, 'Keyboard shortcuts for file actions, formatting, search, view controls, and editor workflows.')
        ]),
        e(ActionButton, {
          key: 'close',
          onClick: props.onClose,
          label: 'Close',
          compact: true,
          title: 'Close shortcuts help',
          icon: '✕'
        })
      ]),
      e('div', { key: 'body', className: 'modal-card__body custom-scroll' },
        SHORTCUT_GROUPS.map(function (group) {
          return e('section', { key: group.title, className: 'shortcut-group' }, [
            e('h4', { key: 'heading', className: 'shortcut-group__title' }, group.title),
            e('div', { key: 'items', className: 'shortcut-list' },
              group.items.map(function (item) {
                return e('div', { key: item[0] + item[1], className: 'shortcut-item' }, [
                  e('kbd', { key: 'key', className: 'shortcut-item__key' }, item[0]),
                  e('span', { key: 'label', className: 'shortcut-item__label' }, item[1])
                ]);
              })
            )
          ]);
        })
      )
    ]));
  }


  function ToolbarSelect(props) {
    return e('label', { className: 'toolbar-select-wrap' }, [
      props.label ? e('span', { key: 'text', className: 'toolbar-label toolbar-label--inline' }, props.label) : null,
      e('select', {
        key: 'select',
        value: props.value,
        onChange: props.onChange,
        className: 'toolbar-select',
        title: props.title || props.label
      }, props.options.map(function (option) {
        return e('option', { key: option.value, value: option.value }, option.label);
      }))
    ]);
  }

  function CommandPaletteModal(props) {
    if (!props.open) {
      return null;
    }

    return e('div', {
      className: 'modal-backdrop command-backdrop',
      onClick: function (event) {
        if (event.target === event.currentTarget) {
          props.onClose();
        }
      }
    }, e('div', { className: 'command-palette' }, [
      e('div', { key: 'header', className: 'command-palette__header' }, [
        e('input', {
          key: 'input',
          ref: props.inputRef,
          type: 'text',
          value: props.query,
          onChange: props.onQueryChange,
          onKeyDown: props.onKeyDown,
          className: 'command-palette__input',
          placeholder: 'Type a command, setting, or view...'
        }),
        e(ActionButton, {
          key: 'close',
          onClick: props.onClose,
          label: 'Close',
          compact: true,
          icon: '✕',
          title: 'Close command palette'
        })
      ]),
      e('div', { key: 'meta', className: 'command-palette__meta' }, [
        e(StatusChip, { key: 'hint1', tone: 'accent' }, 'Enter to run'),
        e(StatusChip, { key: 'hint2' }, 'Arrow keys to move'),
        e(StatusChip, { key: 'hint3' }, props.items.length + ' commands')
      ]),
      e('div', { key: 'body', className: 'command-palette__body custom-scroll' },
        props.items.length ? props.items.map(function (item, index) {
          return e('button', {
            key: item.id,
            type: 'button',
            onClick: function () {
              props.onRun(item.id);
            },
            onMouseEnter: function () {
              props.onSelect(index);
            },
            className: cx('command-item', index === props.selectedIndex ? 'is-selected' : '')
          }, [
            e('div', { key: 'copy', className: 'command-item__copy' }, [
              e('span', { key: 'group', className: 'command-item__group' }, item.group),
              e('span', { key: 'title', className: 'command-item__title' }, item.title),
              item.subtitle ? e('span', { key: 'subtitle', className: 'command-item__subtitle' }, item.subtitle) : null
            ]),
            item.shortcut ? e('kbd', { key: 'shortcut', className: 'command-item__shortcut' }, item.shortcut) : null
          ]);
        }) : e('div', { className: 'command-empty' }, [
          e('h4', { key: 'title', className: 'command-empty__title' }, 'No commands found'),
          e('p', { key: 'subtitle', className: 'command-empty__subtitle' }, 'Try searching for save, export, outline, preview, theme, or focus.')
        ])
      )
    ]));
  }

  function MarkdownStudioApp(props) {
    React.Component.call(this, props);

    var persisted = readStoredSettings();
    var prefersDark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var theme = persisted.theme || (prefersDark ? 'dark' : 'light');
    var markdown = typeof persisted.markdown === 'string' ? persisted.markdown : DEFAULT_MARKDOWN;
    var tabSize = Number(persisted.tabSize);
    var themePreset = normalizeThemePreset(persisted.themePreset);
    var recentDocuments = normalizeRecentDocuments(persisted.recentDocuments);
    var restoredSession = typeof persisted.markdown === 'string' && persisted.markdown.length > 0;
    var insights = computeDocumentInsights(markdown);

    if (tabSize !== 2 && tabSize !== 4 && tabSize !== 8) {
      tabSize = 2;
    }

    this.fileHandle = null;
    this.editorRef = null;
    this.previewRef = null;
    this.gutterRef = null;
    this.fileInputRef = null;
    this.layoutRef = null;
    this.findInputRef = null;
    this.commandInputRef = null;
    this.currentLineHighlightRef = null;
    this.dragLockTimeout = null;
    this.toastTimeout = null;
    this.persistTimeout = null;
    this.syncIndicatorTimeout = null;
    this.isProgrammaticScroll = false;
    this.isDraggingDivider = false;
    this.undoStack = [];
    this.redoStack = [];
    this.savedMarkdown = markdown;
    this.pendingMarkdownPersist = false;

    this.state = {
      markdown: markdown,
      renderedHtml: renderMarkdown(markdown),
      stats: computeStats(markdown),
      insights: insights,
      outline: insights.outline,
      fileName: persisted.fileName || 'welcome.md',
      theme: theme,
      themePreset: themePreset,
      splitRatio: clamp(Number(persisted.splitRatio) || 50, 34, 66),
      dirty: false,
      lastSavedAt: persisted.lastSavedAt || null,
      lastAutosavedAt: persisted.lastAutosavedAt || null,
      autosaveStatus: persisted.autosaveEnabled === false ? 'disabled' : (restoredSession ? 'restored' : 'idle'),
      toast: null,
      isFsApiAvailable: !!(window.showOpenFilePicker && window.showSaveFilePicker),
      isDragging: false,
      dragHover: false,
      wrapEnabled: !!persisted.wrapEnabled,
      autosaveEnabled: persisted.autosaveEnabled !== false,
      showPreview: persisted.showPreview !== false,
      zenMode: !!persisted.zenMode,
      focusMode: !!persisted.focusMode,
      activePane: 'editor',
      tabSize: tabSize,
      shortcutsOpen: false,
      findOpen: false,
      findQuery: '',
      replaceQuery: '',
      searchMatchCount: 0,
      activeSearchIndex: -1,
      currentLine: 1,
      canUndo: false,
      canRedo: false,
      dialog: null,
      commandPaletteOpen: false,
      commandQuery: '',
      commandSelectionIndex: 0,
      utilitySidebarOpen: false,
      utilitySidebarTab: persisted.utilitySidebarTab || 'outline',
      recentDocuments: recentDocuments,
      sessionRestored: restoredSession,
      syncPercent: 0,
      syncSource: 'editor'
    };

    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleEditorScroll = this.handleEditorScroll.bind(this);
    this.handleEditorKeyDown = this.handleEditorKeyDown.bind(this);
    this.handlePreviewScroll = this.handlePreviewScroll.bind(this);
    this.handleThemeToggle = this.handleThemeToggle.bind(this);
    this.handleThemePresetChange = this.handleThemePresetChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    this.handleOpenFile = this.handleOpenFile.bind(this);
    this.handleSaveFile = this.handleSaveFile.bind(this);
    this.handleSaveAsFile = this.handleSaveAsFile.bind(this);
    this.handleFallbackFileOpen = this.handleFallbackFileOpen.bind(this);
    this.startDividerDrag = this.startDividerDrag.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.stopDividerDrag = this.stopDividerDrag.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleWindowDragLeave = this.handleWindowDragLeave.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
    this.toggleWrap = this.toggleWrap.bind(this);
    this.handleCopyHtml = this.handleCopyHtml.bind(this);
    this.handleNewDocument = this.handleNewDocument.bind(this);
    this.handleEditorSelectionChange = this.handleEditorSelectionChange.bind(this);
    this.performUndo = this.performUndo.bind(this);
    this.performRedo = this.performRedo.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
    this.toggleZenMode = this.toggleZenMode.bind(this);
    this.toggleFocusMode = this.toggleFocusMode.bind(this);
    this.toggleAutosave = this.toggleAutosave.bind(this);
    this.handleTabSizeChange = this.handleTabSizeChange.bind(this);
    this.openShortcuts = this.openShortcuts.bind(this);
    this.closeShortcuts = this.closeShortcuts.bind(this);
    this.openFindBar = this.openFindBar.bind(this);
    this.closeFindBar = this.closeFindBar.bind(this);
    this.handleFindQueryChange = this.handleFindQueryChange.bind(this);
    this.handleReplaceQueryChange = this.handleReplaceQueryChange.bind(this);
    this.handleFindInputKeyDown = this.handleFindInputKeyDown.bind(this);
    this.findNext = this.findNext.bind(this);
    this.findPrevious = this.findPrevious.bind(this);
    this.replaceCurrentMatch = this.replaceCurrentMatch.bind(this);
    this.replaceAllMatches = this.replaceAllMatches.bind(this);
    this.jumpToTop = this.jumpToTop.bind(this);
    this.jumpToBottom = this.jumpToBottom.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.patchDialogState = this.patchDialogState.bind(this);
    this.handleDialogFieldChange = this.handleDialogFieldChange.bind(this);
    this.handleDialogFileChange = this.handleDialogFileChange.bind(this);
    this.submitDialog = this.submitDialog.bind(this);
    this.handleCopyMarkdown = this.handleCopyMarkdown.bind(this);
    this.handleExportText = this.handleExportText.bind(this);
    this.handleExportHtml = this.handleExportHtml.bind(this);
    this.handleExportPdf = this.handleExportPdf.bind(this);
    this.handleExportDocx = this.handleExportDocx.bind(this);
    this.setActivePane = this.setActivePane.bind(this);
    this.openCommandPalette = this.openCommandPalette.bind(this);
    this.closeCommandPalette = this.closeCommandPalette.bind(this);
    this.handleCommandQueryChange = this.handleCommandQueryChange.bind(this);
    this.handleCommandPaletteKeyDown = this.handleCommandPaletteKeyDown.bind(this);
    this.setCommandSelection = this.setCommandSelection.bind(this);
    this.runCommandFromPalette = this.runCommandFromPalette.bind(this);
    this.openUtilitySidebar = this.openUtilitySidebar.bind(this);
    this.closeUtilitySidebar = this.closeUtilitySidebar.bind(this);
    this.handleSidebarTabChange = this.handleSidebarTabChange.bind(this);
    this.restoreRecentDocument = this.restoreRecentDocument.bind(this);
    this.removeRecentDocument = this.removeRecentDocument.bind(this);
    this.clearRecentDocuments = this.clearRecentDocuments.bind(this);
    this.jumpToOutlineItem = this.jumpToOutlineItem.bind(this);
  }

  MarkdownStudioApp.prototype = Object.create(React.Component.prototype);
  MarkdownStudioApp.prototype.constructor = MarkdownStudioApp;

  MarkdownStudioApp.prototype.componentDidMount = function () {
    this.applyTheme(this.state.theme);
    if (window.hljs && window.hljs.configure) {
      window.hljs.configure({ ignoreUnescapedHTML: true });
    }
    this.highlightPreview();
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    window.addEventListener('mousemove', this.handlePointerMove);
    window.addEventListener('mouseup', this.stopDividerDrag);
    window.addEventListener('dragover', this.handleDragOver);
    window.addEventListener('dragleave', this.handleWindowDragLeave);
    window.addEventListener('drop', this.handleDrop);
    this.syncEditorGutter();
    this.handleEditorSelectionChange();

    if (this.state.sessionRestored) {
      this.showToast('Restored your last local draft and workspace settings.', 'success');
    }
  };

  MarkdownStudioApp.prototype.componentDidUpdate = function (prevProps, prevState) {
    if (prevState.theme !== this.state.theme || prevState.themePreset !== this.state.themePreset) {
      this.applyTheme(this.state.theme);
    }

    if (
      prevState.renderedHtml !== this.state.renderedHtml ||
      prevState.theme !== this.state.theme ||
      prevState.themePreset !== this.state.themePreset ||
      prevState.showPreview !== this.state.showPreview ||
      prevState.zenMode !== this.state.zenMode
    ) {
      this.highlightPreview();
      if (this.isPreviewVisible()) {
        this.syncScrollFrom('editor');
      }
    }

    if (
      prevState.markdown !== this.state.markdown ||
      prevState.theme !== this.state.theme ||
      prevState.themePreset !== this.state.themePreset ||
      prevState.fileName !== this.state.fileName ||
      prevState.splitRatio !== this.state.splitRatio ||
      prevState.lastSavedAt !== this.state.lastSavedAt ||
      prevState.wrapEnabled !== this.state.wrapEnabled ||
      prevState.autosaveEnabled !== this.state.autosaveEnabled ||
      prevState.showPreview !== this.state.showPreview ||
      prevState.zenMode !== this.state.zenMode ||
      prevState.focusMode !== this.state.focusMode ||
      prevState.tabSize !== this.state.tabSize ||
      prevState.utilitySidebarTab !== this.state.utilitySidebarTab ||
      prevState.recentDocuments !== this.state.recentDocuments
    ) {
      this.schedulePersistLocalState();
    }

    if (
      prevState.currentLine !== this.state.currentLine ||
      prevState.wrapEnabled !== this.state.wrapEnabled
    ) {
      this.syncCurrentLineHighlight();
    }

    if (!prevState.findOpen && this.state.findOpen && this.findInputRef) {
      this.findInputRef.focus();
      this.findInputRef.select();
    }

    if (!prevState.commandPaletteOpen && this.state.commandPaletteOpen && this.commandInputRef) {
      this.commandInputRef.focus();
      this.commandInputRef.select();
    }
  };

  MarkdownStudioApp.prototype.componentWillUnmount = function () {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    window.removeEventListener('mousemove', this.handlePointerMove);
    window.removeEventListener('mouseup', this.stopDividerDrag);
    window.removeEventListener('dragover', this.handleDragOver);
    window.removeEventListener('dragleave', this.handleWindowDragLeave);
    window.removeEventListener('drop', this.handleDrop);

    if (this.toastTimeout) {
      window.clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    if (this.dragLockTimeout) {
      window.clearTimeout(this.dragLockTimeout);
      this.dragLockTimeout = null;
    }
    if (this.persistTimeout) {
      window.clearTimeout(this.persistTimeout);
      this.persistTimeout = null;
    }
    if (this.syncIndicatorTimeout) {
      window.clearTimeout(this.syncIndicatorTimeout);
      this.syncIndicatorTimeout = null;
    }
  };

  MarkdownStudioApp.prototype.isPreviewVisible = function () {
    return !!(this.state.showPreview && !this.state.zenMode);
  };

  MarkdownStudioApp.prototype.schedulePersistLocalState = function () {
    var self = this;
    if (this.persistTimeout) {
      window.clearTimeout(this.persistTimeout);
      this.persistTimeout = null;
    }
    this.persistTimeout = window.setTimeout(function () {
      self.persistLocalState();
      self.persistTimeout = null;
    }, 180);
  };

  MarkdownStudioApp.prototype.persistLocalState = function () {
    try {
      var payload = {
        theme: this.state.theme,
        themePreset: this.state.themePreset,
        splitRatio: this.state.splitRatio,
        fileName: this.state.fileName,
        lastSavedAt: this.state.lastSavedAt,
        lastAutosavedAt: this.state.lastAutosavedAt,
        wrapEnabled: this.state.wrapEnabled,
        autosaveEnabled: this.state.autosaveEnabled,
        showPreview: this.state.showPreview,
        zenMode: this.state.zenMode,
        focusMode: this.state.focusMode,
        tabSize: this.state.tabSize,
        utilitySidebarTab: this.state.utilitySidebarTab,
        recentDocuments: this.state.recentDocuments
      };

      if (this.state.autosaveEnabled) {
        payload.markdown = this.state.markdown;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

      if (this.pendingMarkdownPersist && this.state.autosaveEnabled) {
        var stamp = new Date().toISOString();
        this.pendingMarkdownPersist = false;
        if (this.state.lastAutosavedAt !== stamp || this.state.autosaveStatus !== 'saved') {
          this.setState({
            lastAutosavedAt: stamp,
            autosaveStatus: 'saved'
          });
        }
      } else if (!this.state.autosaveEnabled && this.state.autosaveStatus !== 'disabled') {
        this.setState({ autosaveStatus: 'disabled' });
      }
    } catch (error) {
      console.warn('Unable to persist local draft.', error);
      if (this.state.autosaveEnabled) {
        this.setState({ autosaveStatus: 'error' });
      }
    }
  };

  MarkdownStudioApp.prototype.applyTheme = function (theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-accent', this.state.themePreset || THEME_PRESETS[0].value);
    var link = document.getElementById('hljs-theme');
    if (link) {
      link.href = theme === 'dark' ? 'styles/highlight-dark.css' : 'styles/highlight-light.css';
    }
  };

  MarkdownStudioApp.prototype.highlightPreview = function () {
    var self = this;
    if (!this.previewRef || !window.hljs) {
      return;
    }
    window.requestAnimationFrame(function () {
      if (!self.previewRef) {
        return;
      }
      var blocks = self.previewRef.querySelectorAll('pre code');
      for (var i = 0; i < blocks.length; i += 1) {
        var rawText = blocks[i].textContent;
        blocks[i].textContent = rawText;
        if (blocks[i].dataset) {
          delete blocks[i].dataset.highlighted;
        }
        blocks[i].classList.remove('hljs');
        window.hljs.highlightElement(blocks[i]);
      }
    });
  };

  MarkdownStudioApp.prototype.showToast = function (message, tone) {
    var self = this;
    if (this.toastTimeout) {
      window.clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    this.setState({ toast: { message: message, tone: tone || 'success' } });
    this.toastTimeout = window.setTimeout(function () {
      self.dismissToast();
    }, 2400);
  };

  MarkdownStudioApp.prototype.dismissToast = function () {
    if (this.toastTimeout) {
      window.clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    this.setState({ toast: null });
  };


  MarkdownStudioApp.prototype.buildRecentDocumentEntry = function (source) {
    var markdown = this.state.markdown || '';
    return {
      id: this.state.fileName || 'untitled.md',
      fileName: this.state.fileName || 'untitled.md',
      updatedAt: new Date().toISOString(),
      snippet: summarizeMarkdown(markdown) || 'No preview available yet.',
      markdown: markdown.length <= MAX_RECENT_SNAPSHOT_CHARS ? markdown : null,
      source: source || 'snapshot',
      size: markdown.length
    };
  };

  MarkdownStudioApp.prototype.rememberCurrentDocument = function (source) {
    var entry = this.buildRecentDocumentEntry(source);
    this.setState(function (prevState) {
      var next = [entry];
      for (var i = 0; i < prevState.recentDocuments.length; i += 1) {
        if (prevState.recentDocuments[i].id === entry.id) {
          continue;
        }
        next.push(prevState.recentDocuments[i]);
      }
      return {
        recentDocuments: next.slice(0, MAX_RECENTS)
      };
    });
  };

  MarkdownStudioApp.prototype.removeRecentDocument = function (entryId) {
    this.setState(function (prevState) {
      return {
        recentDocuments: prevState.recentDocuments.filter(function (entry) {
          return entry.id !== entryId;
        })
      };
    });
  };

  MarkdownStudioApp.prototype.clearRecentDocuments = function () {
    this.setState({ recentDocuments: [] });
    this.showToast('Cleared recent local sessions.', 'success');
  };

  MarkdownStudioApp.prototype.restoreRecentDocument = function (entryId) {
    var entry = null;
    var insights = null;
    var self = this;

    for (var i = 0; i < this.state.recentDocuments.length; i += 1) {
      if (this.state.recentDocuments[i].id === entryId) {
        entry = this.state.recentDocuments[i];
        break;
      }
    }

    if (!entry) {
      return;
    }
    if (!entry.markdown) {
      this.showToast('Only metadata was stored for this session. Open the file from disk to reload it.', 'error');
      return;
    }
    if (!this.confirmDiscardIfNeeded()) {
      return;
    }

    insights = computeDocumentInsights(entry.markdown);
    this.fileHandle = null;
    this.savedMarkdown = entry.markdown;
    this.resetHistory();
    this.setState({
      markdown: entry.markdown,
      renderedHtml: renderMarkdown(entry.markdown),
      stats: computeStats(entry.markdown),
      insights: insights,
      outline: insights.outline,
      fileName: entry.fileName || 'untitled.md',
      dirty: false,
      lastSavedAt: entry.updatedAt || null,
      autosaveStatus: this.state.autosaveEnabled ? 'restored' : 'disabled',
      findOpen: false,
      findQuery: '',
      replaceQuery: '',
      searchMatchCount: 0,
      activeSearchIndex: -1,
      commandPaletteOpen: false,
      commandQuery: '',
      commandSelectionIndex: 0,
      utilitySidebarOpen: true,
      utilitySidebarTab: 'recent'
    }, function () {
      self.focusSelection(0, 0);
      self.showToast('Restored ' + (entry.fileName || 'session') + ' from local history.', 'success');
    });
  };

  MarkdownStudioApp.prototype.updateSyncIndicator = function (ratio, source) {
    var percent = clamp(Math.round((ratio || 0) * 100), 0, 100);
    if (
      Math.abs(percent - this.state.syncPercent) >= 2 ||
      source !== this.state.syncSource ||
      percent === 0 ||
      percent === 100
    ) {
      this.setState({
        syncPercent: percent,
        syncSource: source
      });
    }
  };

  MarkdownStudioApp.prototype.syncHistoryState = function () {
    this.setState({
      canUndo: this.undoStack.length > 0,
      canRedo: this.redoStack.length > 0
    });
  };

  MarkdownStudioApp.prototype.resetHistory = function () {
    this.undoStack = [];
    this.redoStack = [];
    this.syncHistoryState();
  };

  MarkdownStudioApp.prototype.pushHistorySnapshot = function (markdown) {
    if (!this.undoStack.length || this.undoStack[this.undoStack.length - 1] !== markdown) {
      this.undoStack.push(markdown);
      if (this.undoStack.length > MAX_HISTORY) {
        this.undoStack.shift();
      }
    }
    this.redoStack = [];
    this.syncHistoryState();
  };

  MarkdownStudioApp.prototype.syncEditorGutter = function () {
    if (this.gutterRef && this.editorRef) {
      this.gutterRef.scrollTop = this.editorRef.scrollTop;
    }
  };

  MarkdownStudioApp.prototype.syncCurrentLineHighlight = function () {
    if (!this.currentLineHighlightRef || !this.editorRef) {
      return;
    }

    if (this.state.wrapEnabled) {
      this.currentLineHighlightRef.style.opacity = '0';
      return;
    }

    var top = EDITOR_PADDING_Y + ((this.state.currentLine - 1) * EDITOR_LINE_HEIGHT) - this.editorRef.scrollTop;
    this.currentLineHighlightRef.style.opacity = '1';
    this.currentLineHighlightRef.style.transform = 'translateY(' + top + 'px)';
    this.currentLineHighlightRef.style.height = EDITOR_LINE_HEIGHT + 'px';
  };

  MarkdownStudioApp.prototype.releaseScrollLock = function () {
    var self = this;
    if (this.dragLockTimeout) {
      window.clearTimeout(this.dragLockTimeout);
      this.dragLockTimeout = null;
    }
    this.dragLockTimeout = window.setTimeout(function () {
      self.isProgrammaticScroll = false;
      self.dragLockTimeout = null;
    }, 24);
  };

  MarkdownStudioApp.prototype.syncScrollFrom = function (source) {
    if (this.isProgrammaticScroll || !this.isPreviewVisible()) {
      return;
    }

    var sourceEl = source === 'editor' ? this.editorRef : this.previewRef;
    var targetEl = source === 'editor' ? this.previewRef : this.editorRef;

    if (!sourceEl || !targetEl) {
      return;
    }

    var sourceMax = Math.max(0, sourceEl.scrollHeight - sourceEl.clientHeight);
    var targetMax = Math.max(0, targetEl.scrollHeight - targetEl.clientHeight);
    var ratio = sourceMax > 0 ? sourceEl.scrollTop / sourceMax : 0;
    var targetScrollTop = ratio * targetMax;

    this.isProgrammaticScroll = true;
    targetEl.scrollTop = targetScrollTop;

    if (source === 'editor') {
      this.syncEditorGutter();
    } else if (this.gutterRef) {
      this.gutterRef.scrollTop = targetScrollTop;
    }

    this.updateSyncIndicator(ratio, source);
    this.releaseScrollLock();
  };

  MarkdownStudioApp.prototype.updateSearchStatus = function (matchCount, activeIndex) {
    if (
      this.state.searchMatchCount !== matchCount ||
      this.state.activeSearchIndex !== activeIndex
    ) {
      this.setState({
        searchMatchCount: matchCount,
        activeSearchIndex: activeIndex
      });
    }
  };

  MarkdownStudioApp.prototype.refreshSearchInfo = function (textOverride) {
    var text = typeof textOverride === 'string' ? textOverride : this.state.markdown;
    var query = this.state.findQuery;
    var matches = getPlainSearchMatches(text, query);
    var activeIndex = -1;

    if (matches.length && this.editorRef) {
      var selectionStart = this.editorRef.selectionStart;
      var selectionEnd = this.editorRef.selectionEnd;
      for (var i = 0; i < matches.length; i += 1) {
        if (matches[i].start === selectionStart && matches[i].end === selectionEnd) {
          activeIndex = i;
          break;
        }
      }
    }

    this.updateSearchStatus(matches.length, activeIndex);
    return matches;
  };

  MarkdownStudioApp.prototype.updateMarkdown = function (nextMarkdown, extraState, callback, options) {
    var self = this;
    var opts = options || {};
    var currentMarkdown = this.state.markdown;
    var hasChanged = nextMarkdown !== currentMarkdown;
    var insights = computeDocumentInsights(nextMarkdown);

    if (hasChanged && opts.recordHistory !== false) {
      this.pushHistorySnapshot(currentMarkdown);
    }

    if (hasChanged && this.state.autosaveEnabled) {
      this.pendingMarkdownPersist = true;
    }

    var nextState = Object.assign(
      {
        markdown: nextMarkdown,
        renderedHtml: renderMarkdown(nextMarkdown),
        stats: computeStats(nextMarkdown),
        insights: insights,
        outline: insights.outline,
        dirty: nextMarkdown !== this.savedMarkdown
      },
      extraState || {}
    );

    if (hasChanged && typeof nextState.autosaveStatus === 'undefined') {
      nextState.autosaveStatus = this.state.autosaveEnabled ? 'saving' : 'disabled';
    }

    this.setState(nextState, function () {
      self.handleEditorSelectionChange();
      if (self.state.findOpen && self.state.findQuery) {
        self.refreshSearchInfo(nextMarkdown);
      } else if (self.state.findOpen) {
        self.updateSearchStatus(0, -1);
      }
      if (callback) {
        callback();
      }
    });
  };

  MarkdownStudioApp.prototype.handleEditorChange = function (event) {
    this.updateMarkdown(event.target.value);
  };

  MarkdownStudioApp.prototype.handleEditorSelectionChange = function () {
    if (!this.editorRef) {
      return;
    }
    var line = getLineNumberForPosition(this.state.markdown, this.editorRef.selectionStart || 0);
    if (line !== this.state.currentLine) {
      this.setState({ currentLine: line });
      return;
    }
    this.syncCurrentLineHighlight();
  };

  MarkdownStudioApp.prototype.handleEditorKeyDown = function (event) {
    if (event.key === 'Tab' && !event.metaKey && !event.ctrlKey && !event.altKey) {
      maybePreventDefault(event);
      this.indentSelection(!!event.shiftKey);
      return;
    }

    if ((event.metaKey || event.ctrlKey) && String(event.key || '').toLowerCase() === 'f') {
      maybePreventDefault(event);
      this.openFindBar();
      return;
    }
  };

  MarkdownStudioApp.prototype.indentSelection = function (outdent) {
    var context = this.getSelectionContext();
    var self = this;
    var indent = new Array(this.state.tabSize + 1).join(' ');

    if (!context) {
      return;
    }

    if (!outdent && context.start === context.end) {
      var inserted = context.value.slice(0, context.start) + indent + context.value.slice(context.end);
      var nextPos = context.start + indent.length;
      this.updateMarkdown(inserted, null, function () {
        self.focusSelection(nextPos, nextPos);
      });
      return;
    }

    var blockStart = context.value.lastIndexOf('\n', context.start - 1) + 1;
    var blockEnd = context.value.indexOf('\n', context.end);
    if (blockEnd === -1) {
      blockEnd = context.value.length;
    }

    var block = context.value.slice(blockStart, blockEnd);
    var lines = block.split('\n');
    var changed = false;

    var nextLines = lines.map(function (line) {
      if (outdent) {
        if (line.indexOf(indent) === 0) {
          changed = true;
          return line.slice(indent.length);
        }
        if (line.indexOf('\t') === 0) {
          changed = true;
          return line.slice(1);
        }
        return line;
      }
      changed = true;
      return indent + line;
    });

    if (!changed) {
      return;
    }

    var nextBlock = nextLines.join('\n');
    var newValue = context.value.slice(0, blockStart) + nextBlock + context.value.slice(blockEnd);

    this.updateMarkdown(newValue, null, function () {
      self.focusSelection(blockStart, blockStart + nextBlock.length);
    });
  };

  MarkdownStudioApp.prototype.handleEditorScroll = function () {
    this.setActivePane('editor');
    this.syncEditorGutter();
    this.syncCurrentLineHighlight();
    this.syncScrollFrom('editor');
  };

  MarkdownStudioApp.prototype.handlePreviewScroll = function () {
    this.setActivePane('preview');
    this.syncScrollFrom('preview');
  };

  MarkdownStudioApp.prototype.handleThemeToggle = function () {
    this.setState({ theme: this.state.theme === 'dark' ? 'light' : 'dark' });
  };

  MarkdownStudioApp.prototype.handleThemePresetChange = function (event) {
    this.setState({ themePreset: normalizeThemePreset(event.target.value) });
  };

  MarkdownStudioApp.prototype.toggleWrap = function () {
    this.setState({ wrapEnabled: !this.state.wrapEnabled });
  };

  MarkdownStudioApp.prototype.togglePreview = function () {
    if (this.state.zenMode) {
      this.setState({
        zenMode: false,
        showPreview: true
      });
      return;
    }
    this.setState({ showPreview: !this.state.showPreview });
  };

  MarkdownStudioApp.prototype.toggleZenMode = function () {
    this.setState({
      zenMode: !this.state.zenMode,
      utilitySidebarOpen: this.state.zenMode ? this.state.utilitySidebarOpen : false
    });
  };

  MarkdownStudioApp.prototype.toggleFocusMode = function () {
    this.setState({
      focusMode: !this.state.focusMode,
      activePane: this.state.activePane || 'editor'
    });
  };

  MarkdownStudioApp.prototype.toggleAutosave = function () {
    var nextEnabled = !this.state.autosaveEnabled;
    if (nextEnabled) {
      this.pendingMarkdownPersist = true;
    }
    this.setState({
      autosaveEnabled: nextEnabled,
      autosaveStatus: nextEnabled ? 'saving' : 'disabled'
    });
  };

  MarkdownStudioApp.prototype.handleTabSizeChange = function (event) {
    this.setState({ tabSize: Number(event.target.value) || 2 });
  };

  MarkdownStudioApp.prototype.setActivePane = function (pane) {
    if (pane && this.state.activePane !== pane) {
      this.setState({ activePane: pane });
    }
  };

  MarkdownStudioApp.prototype.openShortcuts = function () {
    this.setState({ shortcutsOpen: true });
  };

  MarkdownStudioApp.prototype.closeShortcuts = function () {
    this.setState({ shortcutsOpen: false });
  };



  MarkdownStudioApp.prototype.openCommandPalette = function (initialQuery) {
    this.setState({
      commandPaletteOpen: true,
      commandQuery: typeof initialQuery === 'string' ? initialQuery : '',
      commandSelectionIndex: 0
    });
  };

  MarkdownStudioApp.prototype.closeCommandPalette = function () {
    this.setState({
      commandPaletteOpen: false,
      commandQuery: '',
      commandSelectionIndex: 0
    });
  };

  MarkdownStudioApp.prototype.handleCommandQueryChange = function (event) {
    this.setState({
      commandQuery: event.target.value,
      commandSelectionIndex: 0
    });
  };

  MarkdownStudioApp.prototype.setCommandSelection = function (index) {
    this.setState({ commandSelectionIndex: index });
  };

  MarkdownStudioApp.prototype.getCommandItems = function () {
    var self = this;
    return [
      { id: 'new', group: 'File', title: 'New document', subtitle: 'Start a clean markdown file', shortcut: 'Ctrl/Cmd + N', keywords: 'new blank create', run: function () { self.handleNewDocument(); } },
      { id: 'open', group: 'File', title: 'Open document', subtitle: 'Pick a markdown file from disk', shortcut: 'Ctrl/Cmd + O', keywords: 'open file disk import', run: function () { self.handleOpenFile(); } },
      { id: 'save', group: 'File', title: 'Save document', subtitle: 'Write the current markdown file to disk', shortcut: 'Ctrl/Cmd + S', keywords: 'save disk write', run: function () { self.handleSaveFile(); } },
      { id: 'saveAs', group: 'File', title: 'Save As', subtitle: 'Choose a new file name or location', shortcut: 'Ctrl/Cmd + Shift + S', keywords: 'save as duplicate', run: function () { self.handleSaveAsFile(); } },
      { id: 'exportTxt', group: 'Export', title: 'Export TXT', subtitle: 'Create a plain-text export', keywords: 'export text txt', run: function () { self.handleExportText(); } },
      { id: 'exportHtml', group: 'Export', title: 'Export HTML', subtitle: 'Create a standalone HTML document', keywords: 'export html web', run: function () { self.handleExportHtml(); } },
      { id: 'exportPdf', group: 'Export', title: 'Export PDF', subtitle: 'Open the browser print flow for PDF', keywords: 'export pdf print', run: function () { self.handleExportPdf(); } },
      { id: 'exportDocx', group: 'Export', title: 'Export DOCX', subtitle: 'Generate a Word-friendly document', keywords: 'export docx word', run: function () { self.handleExportDocx(); } },
      { id: 'togglePreview', group: 'View', title: self.isPreviewVisible() ? 'Hide preview' : 'Show preview', subtitle: 'Toggle the live rendered pane', keywords: 'preview split pane view', run: function () { self.togglePreview(); } },
      { id: 'toggleZen', group: 'View', title: self.state.zenMode ? 'Disable zen mode' : 'Enable zen mode', subtitle: 'Show only the editor for distraction-free writing', shortcut: 'Ctrl/Cmd + /', keywords: 'zen focus editor only', run: function () { self.toggleZenMode(); } },
      { id: 'toggleFocus', group: 'View', title: self.state.focusMode ? 'Disable focus mode' : 'Enable focus mode', subtitle: 'Dim secondary chrome and emphasize the active pane', shortcut: 'Ctrl/Cmd + .', keywords: 'focus dim workspace', run: function () { self.toggleFocusMode(); } },
      { id: 'outline', group: 'Sidebar', title: 'Open outline', subtitle: 'Jump between headings in the current document', shortcut: 'Ctrl/Cmd + Shift + O', keywords: 'outline headings sidebar structure', run: function () { self.openUtilitySidebar('outline'); } },
      { id: 'stats', group: 'Sidebar', title: 'Open document stats', subtitle: 'Inspect counts, reading time, and task progress', shortcut: 'Ctrl/Cmd + Alt + S', keywords: 'stats metrics analytics sidebar', run: function () { self.openUtilitySidebar('stats'); } },
      { id: 'recent', group: 'Sidebar', title: 'Open recent local sessions', subtitle: 'Restore recent browser snapshots of your work', shortcut: 'Ctrl/Cmd + Shift + R', keywords: 'recent history restore sidebar', run: function () { self.openUtilitySidebar('recent'); } },
      { id: 'find', group: 'Tools', title: 'Find and replace', subtitle: 'Search and replace inside the markdown source', shortcut: 'Ctrl/Cmd + F', keywords: 'find search replace', run: function () { self.openFindBar(); } },
      { id: 'shortcuts', group: 'Tools', title: 'Show keyboard shortcuts', subtitle: 'Open the shortcuts help dialog', shortcut: 'F1', keywords: 'shortcuts help keyboard', run: function () { self.openShortcuts(); } },
      { id: 'copyMd', group: 'Tools', title: 'Copy markdown source', subtitle: 'Copy the raw markdown to the clipboard', keywords: 'copy markdown source', run: function () { self.handleCopyMarkdown(); } },
      { id: 'copyHtml', group: 'Tools', title: 'Copy rendered HTML', subtitle: 'Copy the preview HTML to the clipboard', keywords: 'copy html rendered', run: function () { self.handleCopyHtml(); } },
      { id: 'top', group: 'Navigate', title: 'Jump to top', subtitle: 'Move the editor cursor to the top of the document', keywords: 'top beginning first line', run: function () { self.jumpToTop(); } },
      { id: 'bottom', group: 'Navigate', title: 'Jump to bottom', subtitle: 'Move the editor cursor to the end of the document', keywords: 'bottom end last line', run: function () { self.jumpToBottom(); } },
      { id: 'themeToggle', group: 'Theme', title: self.state.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme', subtitle: 'Toggle the primary app theme', keywords: 'theme dark light toggle', run: function () { self.handleThemeToggle(); } },
      { id: 'presetSky', group: 'Theme', title: 'Accent preset: Sky blue', subtitle: 'Use the default blue SaaS accent', keywords: 'accent theme blue sky', run: function () { self.setState({ themePreset: 'sky' }); } },
      { id: 'presetViolet', group: 'Theme', title: 'Accent preset: Violet', subtitle: 'Apply a richer violet accent preset', keywords: 'accent theme purple violet', run: function () { self.setState({ themePreset: 'violet' }); } },
      { id: 'presetEmerald', group: 'Theme', title: 'Accent preset: Emerald', subtitle: 'Apply a calm emerald accent preset', keywords: 'accent theme green emerald', run: function () { self.setState({ themePreset: 'emerald' }); } }
    ];
  };

  MarkdownStudioApp.prototype.getFilteredCommandItems = function () {
    var query = String(this.state.commandQuery || '').trim().toLowerCase();
    var items = this.getCommandItems();

    if (!query) {
      return items;
    }

    return items.filter(function (item) {
      var haystack = [item.group, item.title, item.subtitle, item.keywords].join(' ').toLowerCase();
      return haystack.indexOf(query) !== -1;
    });
  };

  MarkdownStudioApp.prototype.runCommandFromPalette = function (commandId) {
    var items = this.getCommandItems();
    var selected = null;
    var i = 0;

    for (i = 0; i < items.length; i += 1) {
      if (items[i].id === commandId) {
        selected = items[i];
        break;
      }
    }

    if (!selected) {
      return;
    }

    this.setState({
      commandPaletteOpen: false,
      commandQuery: '',
      commandSelectionIndex: 0
    }, function () {
      selected.run();
    });
  };

  MarkdownStudioApp.prototype.handleCommandPaletteKeyDown = function (event) {
    var items = this.getFilteredCommandItems();
    var currentIndex = clamp(this.state.commandSelectionIndex, 0, Math.max(0, items.length - 1));
    var nextIndex = 0;

    if (event.key === 'Escape') {
      maybePreventDefault(event);
      this.closeCommandPalette();
      return;
    }

    if (!items.length) {
      return;
    }

    if (event.key === 'ArrowDown') {
      maybePreventDefault(event);
      nextIndex = (currentIndex + 1) % items.length;
      this.setCommandSelection(nextIndex);
      return;
    }

    if (event.key === 'ArrowUp') {
      maybePreventDefault(event);
      nextIndex = (currentIndex - 1 + items.length) % items.length;
      this.setCommandSelection(nextIndex);
      return;
    }

    if (event.key === 'Enter') {
      maybePreventDefault(event);
      this.runCommandFromPalette(items[currentIndex].id);
    }
  };

  MarkdownStudioApp.prototype.openUtilitySidebar = function (tab) {
    this.setState({
      utilitySidebarOpen: true,
      utilitySidebarTab: tab || this.state.utilitySidebarTab || 'outline',
      zenMode: false,
      commandPaletteOpen: false
    });
  };

  MarkdownStudioApp.prototype.closeUtilitySidebar = function () {
    this.setState({ utilitySidebarOpen: false });
  };

  MarkdownStudioApp.prototype.handleSidebarTabChange = function (tab) {
    this.setState({
      utilitySidebarOpen: true,
      utilitySidebarTab: tab
    });
  };

  MarkdownStudioApp.prototype.jumpToOutlineItem = function (position) {
    var line = getLineNumberForPosition(this.state.markdown, position || 0);
    var self = this;
    this.setActivePane('editor');
    this.focusSelection(position || 0, position || 0);
    window.requestAnimationFrame(function () {
      if (!self.editorRef) {
        return;
      }
      self.editorRef.scrollTop = Math.max(0, ((line - 3) * EDITOR_LINE_HEIGHT));
      self.syncEditorGutter();
      self.syncCurrentLineHighlight();
    });
  };

  MarkdownStudioApp.prototype.getBaseFileName = function () {
    return getFileBaseName(this.state.fileName);
  };

  MarkdownStudioApp.prototype.getPreviewSheetHtml = function () {
    if (this.previewRef) {
      var previewSheet = this.previewRef.querySelector('.preview-sheet');
      if (previewSheet) {
        return previewSheet.innerHTML;
      }
    }
    return getHighlightedHtmlFragment(this.state.renderedHtml);
  };

  MarkdownStudioApp.prototype.buildStandaloneHtmlDocument = function () {
    return buildStandaloneExportHtml(this.getBaseFileName(), this.getPreviewSheetHtml());
  };

  MarkdownStudioApp.prototype.openDialog = function (type) {
    this.setState({ dialog: createComposerDialogState(type) });
  };

  MarkdownStudioApp.prototype.closeDialog = function () {
    this.setState({ dialog: null });
  };

  MarkdownStudioApp.prototype.patchDialogState = function (patch) {
    this.setState(function (prevState) {
      if (!prevState.dialog) {
        return null;
      }
      return {
        dialog: Object.assign({}, prevState.dialog, patch)
      };
    });
  };

  MarkdownStudioApp.prototype.handleDialogFieldChange = function (field, valueOrEvent) {
    var value = valueOrEvent && valueOrEvent.target ? valueOrEvent.target.value : valueOrEvent;
    var patch = {};
    patch[field] = value;
    this.patchDialogState(patch);
  };

  MarkdownStudioApp.prototype.handleDialogFileChange = function (event) {
    var self = this;
    var file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file || !this.state.dialog) {
      return;
    }

    if (this.state.dialog.type === 'gif' && file.type && file.type !== 'image/gif') {
      this.showToast('Choose a GIF file for this insert action.', 'error');
      return;
    }
    if (this.state.dialog.type === 'image' && file.type && file.type.indexOf('image/') !== 0) {
      this.showToast('Choose an image file for this insert action.', 'error');
      return;
    }

    this.patchDialogState({ loading: true });

    readFileAsDataUrl(file)
      .then(function (dataUrl) {
        var nextPatch = {
          mode: 'file',
          dataUrl: dataUrl,
          url: '',
          fileName: file.name || 'embedded-file',
          loading: false
        };
        if (self.state.dialog && (self.state.dialog.type === 'image' || self.state.dialog.type === 'gif')) {
          nextPatch.alt = self.state.dialog.alt || (file.name || 'Image').replace(/\.[^.]+$/, '');
        }
        if (self.state.dialog && self.state.dialog.type === 'file') {
          nextPatch.label = self.state.dialog.label || file.name || 'Download file';
        }
        self.patchDialogState(nextPatch);
      })
      .catch(function (error) {
        console.error(error);
        self.patchDialogState({ loading: false });
        self.showToast('Unable to embed the selected file.', 'error');
      });
  };

  MarkdownStudioApp.prototype.insertSnippet = function (text, selectionStartOffset, selectionEndOffset) {
    var startOffset = typeof selectionStartOffset === 'number' ? selectionStartOffset : 0;
    var endOffset = typeof selectionEndOffset === 'number' ? selectionEndOffset : text.length;
    this.replaceSelection(function (context) {
      return {
        text: text,
        selectionStart: context.start + startOffset,
        selectionEnd: context.start + endOffset
      };
    });
  };

  MarkdownStudioApp.prototype.submitDialog = function () {
    if (!this.state.dialog) {
      return;
    }

    var dialog = this.state.dialog;
    var inserted = '';

    if (dialog.type === 'image' || dialog.type === 'gif') {
      var src = dialog.mode === 'file' ? dialog.dataUrl : String(dialog.url || '').trim();
      if (!src) {
        this.showToast('Choose a file or paste a URL before inserting media.', 'error');
        return;
      }
      inserted = buildMarkdownImage(String(dialog.alt || '').trim() || (dialog.type === 'gif' ? 'Animated GIF' : 'Image'), src, String(dialog.assetTitle || '').trim());
      this.insertSnippet(inserted);
      this.closeDialog();
      this.showToast(dialog.type === 'gif' ? 'Inserted GIF markdown.' : 'Inserted image markdown.', 'success');
      return;
    }

    if (dialog.type === 'file') {
      var href = dialog.mode === 'file' ? dialog.dataUrl : String(dialog.url || '').trim();
      if (!href) {
        this.showToast('Choose a file or paste a URL before inserting a file link.', 'error');
        return;
      }
      inserted = buildMarkdownLink(String(dialog.label || '').trim() || (dialog.fileName || 'Download file'), href, String(dialog.assetTitle || '').trim());
      this.insertSnippet(inserted);
      this.closeDialog();
      this.showToast('Inserted file link markdown.', 'success');
      return;
    }

    if (dialog.type === 'code') {
      var language = dialog.language && dialog.language !== 'text' ? dialog.language : '';
      var prefix = '```' + language + '\n';
      var snippetBody = String(dialog.snippet || '');
      inserted = prefix + snippetBody + '\n```';
      this.insertSnippet(inserted, prefix.length, prefix.length + snippetBody.length);
      this.closeDialog();
      this.showToast('Inserted fenced code block.', 'success');
      return;
    }
    if (dialog.type === 'table') {
      inserted = buildMarkdownTable(dialog.columns, dialog.rows, dialog.alignment);
      this.insertSnippet(inserted);
      this.closeDialog();
      this.showToast('Inserted markdown table.', 'success');
      return;
    }

    if (dialog.type === 'callout') {
      inserted = buildCalloutMarkdown(dialog.tone, String(dialog.heading || '').trim(), String(dialog.body || '').trim());
      this.insertSnippet(inserted);
      this.closeDialog();
      this.showToast('Inserted markdown callout.', 'success');
      return;
    }

    inserted = formatInsertedDateTime(dialog.format);
    this.insertSnippet(inserted);
    this.closeDialog();
    this.showToast('Inserted date / time stamp.', 'success');
  };

  MarkdownStudioApp.prototype.handleCopyMarkdown = function () {
    var self = this;
    copyTextToClipboard(this.state.markdown)
      .then(function () {
        self.showToast('Markdown source copied to clipboard.', 'success');
      })
      .catch(function (error) {
        console.error(error);
        self.showToast('Unable to copy markdown.', 'error');
      });
  };

  MarkdownStudioApp.prototype.handleExportText = function () {
    try {
      var plainText = htmlToPlainText(this.getPreviewSheetHtml());
      this.downloadFallback(this.getBaseFileName() + '.txt', plainText, 'text/plain;charset=utf-8');
      this.showToast('Exported plain text.', 'success');
    } catch (error) {
      console.error(error);
      this.showToast('Unable to export TXT.', 'error');
    }
  };

  MarkdownStudioApp.prototype.handleExportHtml = function () {
    try {
      var htmlDocument = this.buildStandaloneHtmlDocument();
      this.downloadFallback(this.getBaseFileName() + '.html', htmlDocument, 'text/html;charset=utf-8');
      this.showToast('Exported standalone HTML.', 'success');
    } catch (error) {
      console.error(error);
      this.showToast('Unable to export HTML.', 'error');
    }
  };

  MarkdownStudioApp.prototype.handleExportPdf = function () {
    try {
      var htmlDocument = this.buildStandaloneHtmlDocument();
      var printWindow = window.open('', '_blank');
      if (!printWindow) {
        this.showToast('Popup blocked. Allow popups to open the PDF export view.', 'error');
        return;
      }
      printWindow.document.open();
      printWindow.document.write(htmlDocument);
      printWindow.document.close();
      printWindow.focus();
      printWindow.onafterprint = function () {
        try {
          printWindow.close();
        } catch (error) {
          // Ignore close errors after print.
        }
      };
      window.setTimeout(function () {
        printWindow.print();
      }, 280);
      this.showToast('Print dialog opened. Choose “Save as PDF” in your browser.', 'success');
    } catch (error) {
      console.error(error);
      this.showToast('Unable to prepare PDF export.', 'error');
    }
  };

  MarkdownStudioApp.prototype.handleExportDocx = function () {
    try {
      var htmlDocument = this.buildStandaloneHtmlDocument();
      var blob = buildDocxBlobFromHtml(this.getBaseFileName(), htmlDocument);
      triggerBlobDownload(this.getBaseFileName() + '.docx', blob);
      this.showToast('Exported DOCX.', 'success');
    } catch (error) {
      console.error(error);
      this.showToast('Unable to export DOCX.', 'error');
    }
  };

  MarkdownStudioApp.prototype.openFindBar = function () {
    var context = this.getSelectionContext();
    var initialQuery = this.state.findQuery;
    if (!initialQuery && context && context.selected && context.selected.indexOf('\n') === -1) {
      initialQuery = context.selected;
    }

    this.setState({
      findOpen: true,
      findQuery: initialQuery,
      searchMatchCount: initialQuery ? getPlainSearchMatches(this.state.markdown, initialQuery).length : 0,
      activeSearchIndex: -1
    });
  };

  MarkdownStudioApp.prototype.closeFindBar = function () {
    this.setState({
      findOpen: false,
      findQuery: '',
      replaceQuery: '',
      searchMatchCount: 0,
      activeSearchIndex: -1
    }, this.handleEditorSelectionChange);
  };

  MarkdownStudioApp.prototype.handleFindQueryChange = function (event) {
    var query = event.target.value;
    var matches = getPlainSearchMatches(this.state.markdown, query);
    this.setState({
      findQuery: query,
      searchMatchCount: matches.length,
      activeSearchIndex: -1
    });
  };

  MarkdownStudioApp.prototype.handleReplaceQueryChange = function (event) {
    this.setState({ replaceQuery: event.target.value });
  };

  MarkdownStudioApp.prototype.handleFindInputKeyDown = function (event) {
    if (event.key === 'Escape') {
      maybePreventDefault(event);
      this.closeFindBar();
      return;
    }
    if (event.key === 'Enter') {
      maybePreventDefault(event);
      if (event.target && event.target.getAttribute('data-role') === 'replace') {
        this.replaceCurrentMatch();
      } else if (event.shiftKey) {
        this.findPrevious();
      } else {
        this.findNext();
      }
    }
  };

  MarkdownStudioApp.prototype.getCurrentSearchIndex = function (matches) {
    if (!matches.length) {
      return -1;
    }

    var selectionStart = this.editorRef ? this.editorRef.selectionStart : 0;
    var selectionEnd = this.editorRef ? this.editorRef.selectionEnd : 0;

    for (var i = 0; i < matches.length; i += 1) {
      if (matches[i].start === selectionStart && matches[i].end === selectionEnd) {
        return i;
      }
    }

    return this.state.activeSearchIndex;
  };

  MarkdownStudioApp.prototype.jumpToMatch = function (index) {
    var matches = getPlainSearchMatches(this.state.markdown, this.state.findQuery);

    if (!matches.length) {
      this.updateSearchStatus(0, -1);
      this.showToast('No matches found.', 'error');
      return;
    }

    var nextIndex = ((index % matches.length) + matches.length) % matches.length;
    var match = matches[nextIndex];
    this.updateSearchStatus(matches.length, nextIndex);
    this.focusSelection(match.start, match.end);
  };

  MarkdownStudioApp.prototype.findNext = function () {
    var matches = getPlainSearchMatches(this.state.markdown, this.state.findQuery);
    if (!matches.length) {
      this.updateSearchStatus(0, -1);
      this.showToast('No matches found.', 'error');
      return;
    }

    var currentIndex = this.getCurrentSearchIndex(matches);
    if (currentIndex === -1) {
      var selectionStart = this.editorRef ? this.editorRef.selectionStart : 0;
      for (var i = 0; i < matches.length; i += 1) {
        if (matches[i].start >= selectionStart) {
          currentIndex = i - 1;
          break;
        }
      }
      if (currentIndex === -1) {
        currentIndex = matches.length - 1;
      }
    }

    this.jumpToMatch(currentIndex + 1);
  };

  MarkdownStudioApp.prototype.findPrevious = function () {
    var matches = getPlainSearchMatches(this.state.markdown, this.state.findQuery);
    if (!matches.length) {
      this.updateSearchStatus(0, -1);
      this.showToast('No matches found.', 'error');
      return;
    }

    var currentIndex = this.getCurrentSearchIndex(matches);
    if (currentIndex === -1) {
      var selectionStart = this.editorRef ? this.editorRef.selectionStart : 0;
      currentIndex = 0;
      for (var i = 0; i < matches.length; i += 1) {
        if (matches[i].start >= selectionStart) {
          currentIndex = i;
          break;
        }
        currentIndex = i;
      }
    }

    this.jumpToMatch(currentIndex - 1);
  };

  MarkdownStudioApp.prototype.replaceCurrentMatch = function () {
    var query = this.state.findQuery;
    var replacement = this.state.replaceQuery;
    var matches = getPlainSearchMatches(this.state.markdown, query);

    if (!query || !matches.length) {
      this.showToast('Nothing to replace.', 'error');
      return;
    }

    var activeIndex = this.getCurrentSearchIndex(matches);
    if (activeIndex === -1) {
      activeIndex = 0;
    }

    var match = matches[activeIndex];
    var newValue = this.state.markdown.slice(0, match.start) + replacement + this.state.markdown.slice(match.end);
    var nextCursor = match.start + replacement.length;
    var self = this;

    this.updateMarkdown(newValue, null, function () {
      self.focusSelection(nextCursor, nextCursor);
      var nextMatches = getPlainSearchMatches(newValue, query);
      var nextIndex = nextMatches.length ? Math.min(activeIndex, nextMatches.length - 1) : -1;
      self.updateSearchStatus(nextMatches.length, nextIndex);
      self.showToast('Replaced current match.', 'success');
    });
  };

  MarkdownStudioApp.prototype.replaceAllMatches = function () {
    var query = this.state.findQuery;
    var replacement = this.state.replaceQuery;
    var matches = getPlainSearchMatches(this.state.markdown, query);

    if (!query || !matches.length) {
      this.showToast('Nothing to replace.', 'error');
      return;
    }

    var nextValue = this.state.markdown;
    for (var i = matches.length - 1; i >= 0; i -= 1) {
      nextValue = nextValue.slice(0, matches[i].start) + replacement + nextValue.slice(matches[i].end);
    }

    var self = this;
    this.updateMarkdown(nextValue, null, function () {
      self.updateSearchStatus(getPlainSearchMatches(nextValue, query).length, -1);
      self.showToast('Replaced ' + matches.length + ' matches.', 'success');
    });
  };

  MarkdownStudioApp.prototype.jumpToTop = function () {
    if (!this.editorRef) {
      return;
    }
    this.editorRef.scrollTop = 0;
    this.syncEditorGutter();
    this.syncCurrentLineHighlight();
    this.focusSelection(0, 0);
  };

  MarkdownStudioApp.prototype.jumpToBottom = function () {
    if (!this.editorRef) {
      return;
    }
    var target = this.state.markdown.length;
    this.editorRef.scrollTop = this.editorRef.scrollHeight;
    this.syncEditorGutter();
    this.syncCurrentLineHighlight();
    this.focusSelection(target, target);
  };

  MarkdownStudioApp.prototype.handleBeforeUnload = function (event) {
    if (!this.state.dirty) {
      return;
    }
    event.preventDefault();
    event.returnValue = '';
  };

  MarkdownStudioApp.prototype.confirmDiscardIfNeeded = function () {
    if (!this.state.dirty) {
      return true;
    }
    return window.confirm('Discard unsaved changes and continue?');
  };

  MarkdownStudioApp.prototype.handleKeyDown = function (event) {
    if (event.key === 'Escape') {
      if (this.state.dialog) {
        maybePreventDefault(event);
        this.closeDialog();
        return;
      }
      if (this.state.commandPaletteOpen) {
        maybePreventDefault(event);
        this.closeCommandPalette();
        return;
      }
      if (this.state.shortcutsOpen) {
        maybePreventDefault(event);
        this.closeShortcuts();
        return;
      }
      if (this.state.findOpen) {
        maybePreventDefault(event);
        this.closeFindBar();
        return;
      }
      if (this.state.utilitySidebarOpen) {
        maybePreventDefault(event);
        this.closeUtilitySidebar();
        return;
      }
      if (this.state.zenMode) {
        maybePreventDefault(event);
        this.toggleZenMode();
        return;
      }
    }

    if (event.key === 'F1') {
      maybePreventDefault(event);
      this.openShortcuts();
      return;
    }

    var isModifier = event.metaKey || event.ctrlKey;
    if (!isModifier) {
      return;
    }

    var activeElement = document.activeElement;
    var isAuxInput = !!(
      activeElement &&
      activeElement !== this.editorRef &&
      (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT'
      )
    );

    var key = String(event.key || '').toLowerCase();

    if (key === 'p') {
      maybePreventDefault(event);
      this.openCommandPalette();
      return;
    }

    if (key === 'o' && event.shiftKey) {
      maybePreventDefault(event);
      this.openUtilitySidebar('outline');
      return;
    }

    if (key === 'r' && event.shiftKey) {
      maybePreventDefault(event);
      this.openUtilitySidebar('recent');
      return;
    }

    if (key === 's' && event.altKey) {
      maybePreventDefault(event);
      this.openUtilitySidebar('stats');
      return;
    }

    if (key === 's') {
      maybePreventDefault(event);
      if (event.shiftKey) {
        this.handleSaveAsFile();
      } else {
        this.handleSaveFile();
      }
      return;
    }

    if (key === 'o') {
      maybePreventDefault(event);
      this.handleOpenFile();
      return;
    }

    if (key === 'n') {
      maybePreventDefault(event);
      this.handleNewDocument();
      return;
    }

    if (key === '/') {
      maybePreventDefault(event);
      this.toggleZenMode();
      return;
    }

    if (key === '.') {
      maybePreventDefault(event);
      this.toggleFocusMode();
      return;
    }

    if (isAuxInput) {
      return;
    }

    if (key === 'f') {
      maybePreventDefault(event);
      this.openFindBar();
      return;
    }

    if (key === 'z') {
      maybePreventDefault(event);
      if (event.shiftKey) {
        this.performRedo();
      } else {
        this.performUndo();
      }
      return;
    }

    if (key === 'y') {
      maybePreventDefault(event);
      this.performRedo();
      return;
    }

    if (key === 'b') {
      maybePreventDefault(event);
      this.applyInlineFormat('bold');
      return;
    }

    if (key === 'i') {
      maybePreventDefault(event);
      this.applyInlineFormat('italic');
      return;
    }

    if (key === 'k') {
      maybePreventDefault(event);
      this.applyInlineFormat('link');
      return;
    }
  };

  MarkdownStudioApp.prototype.getSelectionContext = function () {
    if (!this.editorRef) {
      return null;
    }

    var start = this.editorRef.selectionStart;
    var end = this.editorRef.selectionEnd;
    var value = this.state.markdown;

    return {
      value: value,
      start: start,
      end: end,
      selected: value.slice(start, end)
    };
  };

  MarkdownStudioApp.prototype.focusSelection = function (selectionStart, selectionEnd) {
    var self = this;
    window.requestAnimationFrame(function () {
      if (!self.editorRef) {
        return;
      }
      self.editorRef.focus();
      self.editorRef.setSelectionRange(selectionStart, selectionEnd);
      self.handleEditorSelectionChange();
    });
  };

  MarkdownStudioApp.prototype.replaceSelection = function (transformer) {
    var context = this.getSelectionContext();
    if (!context) {
      return;
    }

    var next = transformer(context);
    if (!next || typeof next.text !== 'string') {
      return;
    }

    var value = context.value;
    var newValue = value.slice(0, context.start) + next.text + value.slice(context.end);
    var selectionStart = typeof next.selectionStart === 'number' ? next.selectionStart : context.start;
    var selectionEnd = typeof next.selectionEnd === 'number' ? next.selectionEnd : selectionStart + next.text.length;
    var self = this;

    this.updateMarkdown(newValue, null, function () {
      self.focusSelection(selectionStart, selectionEnd);
    });
  };

  MarkdownStudioApp.prototype.wrapSelection = function (prefix, suffix, placeholder) {
    this.replaceSelection(function (context) {
      var selection = context.selected || placeholder;
      var text = prefix + selection + suffix;
      var selectionStart = context.start + prefix.length;
      var selectionEnd = selectionStart + selection.length;
      return {
        text: text,
        selectionStart: selectionStart,
        selectionEnd: selectionEnd
      };
    });
  };

  MarkdownStudioApp.prototype.transformSelectedLines = function (transformLine) {
    this.replaceSelection(function (context) {
      var blockStart = context.value.lastIndexOf('\n', context.start - 1) + 1;
      var blockEnd = context.value.indexOf('\n', context.end);
      if (blockEnd === -1) {
        blockEnd = context.value.length;
      }
      var block = context.value.slice(blockStart, blockEnd);
      var lines = block.split('\n');
      var nextLines = transformLine(lines);
      var text = nextLines.join('\n');
      return {
        text: text,
        selectionStart: blockStart,
        selectionEnd: blockStart + text.length
      };
    });
  };

  MarkdownStudioApp.prototype.toggleHeader = function (level) {
    var hashes = new Array(level + 1).join('#') + ' ';
    this.transformSelectedLines(function (lines) {
      var nonEmpty = lines.filter(function (line) { return line.trim(); });
      var regex = new RegExp('^#{' + level + '}\\s+');
      var allMatch = nonEmpty.length > 0 && nonEmpty.every(function (line) { return regex.test(line); });
      return lines.map(function (line) {
        if (!line.trim()) {
          return line;
        }
        var stripped = line.replace(/^#{1,6}\s+/, '');
        return allMatch ? stripped : hashes + stripped;
      });
    });
  };

  MarkdownStudioApp.prototype.togglePrefixedList = function (prefixFactory, matcher) {
    this.transformSelectedLines(function (lines) {
      var nonEmpty = lines.filter(function (line) { return line.trim(); });
      var allPrefixed = nonEmpty.length > 0 && nonEmpty.every(function (line) { return matcher.test(line); });
      var itemIndex = 0;
      return lines.map(function (line) {
        if (!line.trim()) {
          return line;
        }
        if (allPrefixed) {
          return line.replace(matcher, '');
        }
        var prefix = prefixFactory(itemIndex);
        itemIndex += 1;
        return prefix + line;
      });
    });
  };

  MarkdownStudioApp.prototype.insertCodeBlock = function () {
    this.replaceSelection(function (context) {
      var selection = context.selected || 'console.log("Hello, Markdown");';
      var text = '```js\n' + selection + '\n```';
      var start = context.start + 6;
      return {
        text: text,
        selectionStart: start,
        selectionEnd: start + selection.length
      };
    });
  };

  MarkdownStudioApp.prototype.insertMarkdownTable = function () {
    this.replaceSelection(function (context) {
      var selection = context.selected || '| Column 1 | Column 2 |\n| --- | --- |\n| Value | Value |';
      return {
        text: selection,
        selectionStart: context.start,
        selectionEnd: context.start + selection.length
      };
    });
  };

  MarkdownStudioApp.prototype.insertHorizontalRule = function () {
    this.replaceSelection(function (context) {
      var text = context.selected || '---';
      return {
        text: text,
        selectionStart: context.start,
        selectionEnd: context.start + text.length
      };
    });
  };

  MarkdownStudioApp.prototype.applyInlineFormat = function (type) {
    if (type === 'bold') {
      this.wrapSelection('**', '**', 'bold text');
      return;
    }
    if (type === 'italic') {
      this.wrapSelection('*', '*', 'italic text');
      return;
    }
    if (type === 'link') {
      this.replaceSelection(function (context) {
        var label = context.selected || 'Link text';
        var url = 'https://example.com';
        var text = '[' + label + '](' + url + ')';
        var selectionStart = context.start + label.length + 3;
        return {
          text: text,
          selectionStart: selectionStart,
          selectionEnd: selectionStart + url.length
        };
      });
    }
  };

  MarkdownStudioApp.prototype.handleToolbarAction = function (action) {
    if (action === 'h1') {
      this.toggleHeader(1);
      return;
    }
    if (action === 'h2') {
      this.toggleHeader(2);
      return;
    }
    if (action === 'bullet') {
      this.togglePrefixedList(function () { return '- '; }, /^-\s+/);
      return;
    }
    if (action === 'ordered') {
      this.togglePrefixedList(function (index) { return String(index + 1) + '. '; }, /^\d+\.\s+/);
      return;
    }
    if (action === 'task') {
      this.togglePrefixedList(function () { return '- [ ] '; }, /^-\s+\[[ xX]\]\s+/);
      return;
    }
    if (action === 'quote') {
      this.togglePrefixedList(function () { return '> '; }, /^>\s+/);
      return;
    }
    if (action === 'code') {
      this.insertCodeBlock();
      return;
    }
    if (action === 'table') {
      this.insertMarkdownTable();
      return;
    }
    if (action === 'rule') {
      this.insertHorizontalRule();
    }
  };

  MarkdownStudioApp.prototype.performUndo = function () {
    if (!this.undoStack.length) {
      return;
    }

    var previous = this.undoStack.pop();
    var cursor = this.editorRef ? this.editorRef.selectionStart : previous.length;
    this.redoStack.push(this.state.markdown);
    this.syncHistoryState();
    var self = this;

    this.updateMarkdown(previous, null, function () {
      var clamped = clamp(cursor, 0, previous.length);
      self.focusSelection(clamped, clamped);
    }, { recordHistory: false });
  };

  MarkdownStudioApp.prototype.performRedo = function () {
    if (!this.redoStack.length) {
      return;
    }

    var next = this.redoStack.pop();
    var cursor = this.editorRef ? this.editorRef.selectionStart : next.length;
    this.undoStack.push(this.state.markdown);
    this.syncHistoryState();
    var self = this;

    this.updateMarkdown(next, null, function () {
      var clamped = clamp(cursor, 0, next.length);
      self.focusSelection(clamped, clamped);
    }, { recordHistory: false });
  };

  MarkdownStudioApp.prototype.handleNewDocument = function () {
    var self = this;
    var insights = computeDocumentInsights(NEW_DOCUMENT_MARKDOWN);
    if (!this.confirmDiscardIfNeeded()) {
      return;
    }
    this.fileHandle = null;
    this.savedMarkdown = NEW_DOCUMENT_MARKDOWN;
    this.pendingMarkdownPersist = this.state.autosaveEnabled;
    this.resetHistory();
    this.setState({
      markdown: NEW_DOCUMENT_MARKDOWN,
      renderedHtml: renderMarkdown(NEW_DOCUMENT_MARKDOWN),
      stats: computeStats(NEW_DOCUMENT_MARKDOWN),
      insights: insights,
      outline: insights.outline,
      fileName: 'untitled.md',
      dirty: false,
      lastSavedAt: null,
      lastAutosavedAt: null,
      autosaveStatus: this.state.autosaveEnabled ? 'saving' : 'disabled',
      findOpen: false,
      findQuery: '',
      replaceQuery: '',
      searchMatchCount: 0,
      activeSearchIndex: -1,
      utilitySidebarOpen: false,
      commandPaletteOpen: false
    }, function () {
      self.focusSelection(0, 0);
      self.rememberCurrentDocument('new');
      self.showToast('Started a new markdown file.', 'success');
    });
  };

  MarkdownStudioApp.prototype.handleCopyHtml = function () {
    var self = this;
    copyTextToClipboard(this.getPreviewSheetHtml())
      .then(function () {
        self.showToast('Rendered HTML copied to clipboard.', 'success');
      })
      .catch(function (error) {
        console.error(error);
        self.showToast('Unable to copy HTML.', 'error');
      });
  };

  MarkdownStudioApp.prototype.readFileObject = function (file, fileHandle) {
    var self = this;
    return file.text().then(function (text) {
      var insights = computeDocumentInsights(text);
      self.fileHandle = fileHandle || null;
      self.savedMarkdown = text;
      self.pendingMarkdownPersist = self.state.autosaveEnabled;
      self.resetHistory();
      self.setState({
        markdown: text,
        renderedHtml: renderMarkdown(text),
        stats: computeStats(text),
        insights: insights,
        outline: insights.outline,
        fileName: file.name || 'untitled.md',
        dirty: false,
        lastSavedAt: null,
        autosaveStatus: self.state.autosaveEnabled ? 'saving' : 'disabled',
        dragHover: false,
        findOpen: false,
        findQuery: '',
        replaceQuery: '',
        searchMatchCount: 0,
        activeSearchIndex: -1,
        utilitySidebarOpen: false,
        commandPaletteOpen: false
      }, function () {
        self.focusSelection(0, 0);
        self.rememberCurrentDocument('opened');
        self.showToast('Opened ' + (file.name || 'document') + '.', 'success');
      });
    });
  };

  MarkdownStudioApp.prototype.handleFallbackFileOpen = function (event) {
    var self = this;
    var file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file) {
      return;
    }
    if (!this.confirmDiscardIfNeeded()) {
      return;
    }
    this.readFileObject(file, null).catch(function (error) {
      console.error(error);
      self.showToast('Unable to open file.', 'error');
    });
  };

  MarkdownStudioApp.prototype.handleOpenFile = function () {
    var self = this;
    if (!this.confirmDiscardIfNeeded()) {
      return;
    }

    if (window.showOpenFilePicker) {
      window.showOpenFilePicker({
        multiple: false,
        types: [
          {
            description: 'Markdown files',
            accept: {
              'text/markdown': ['.md', '.markdown'],
              'text/plain': ['.txt']
            }
          }
        ]
      }).then(function (handles) {
        if (!handles || !handles.length) {
          return null;
        }
        return handles[0].getFile().then(function (file) {
          return self.readFileObject(file, handles[0]);
        });
      }).catch(function (error) {
        if (error && error.name === 'AbortError') {
          return;
        }
        console.error(error);
        self.showToast('Unable to open file.', 'error');
      });
      return;
    }

    if (this.fileInputRef) {
      this.fileInputRef.click();
    }
  };

  MarkdownStudioApp.prototype.downloadFallback = function (filename, contents, mimeType) {
    var blob = new Blob([contents], { type: mimeType || 'text/markdown;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename || this.state.fileName || 'document.md';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  MarkdownStudioApp.prototype.afterSuccessfulSave = function (fileName) {
    var self = this;
    var stamp = new Date().toISOString();
    this.savedMarkdown = this.state.markdown;
    this.setState({
      fileName: fileName || this.state.fileName,
      dirty: false,
      lastSavedAt: stamp
    }, function () {
      self.rememberCurrentDocument('saved');
      self.showToast('Saved to disk.', 'success');
    });
  };

  MarkdownStudioApp.prototype.handleSaveFile = function () {
    this.saveToDisk(false);
  };

  MarkdownStudioApp.prototype.handleSaveAsFile = function () {
    this.saveToDisk(true);
  };

  MarkdownStudioApp.prototype.saveToDisk = function (forcePicker) {
    var self = this;
    if (window.showSaveFilePicker) {
      var handlePromise = this.fileHandle && !forcePicker
        ? Promise.resolve(this.fileHandle)
        : window.showSaveFilePicker({
            suggestedName: this.state.fileName || 'document.md',
            types: [
              {
                description: 'Markdown files',
                accept: {
                  'text/markdown': ['.md', '.markdown'],
                  'text/plain': ['.txt']
                }
              }
            ]
          });

      handlePromise
        .then(function (handle) {
          if (!handle) {
            return null;
          }
          self.fileHandle = handle;
          return handle.createWritable().then(function (writable) {
            return writable.write(self.state.markdown).then(function () {
              return writable.close().then(function () {
                self.afterSuccessfulSave(handle.name || self.state.fileName);
              });
            });
          });
        })
        .catch(function (error) {
          if (error && error.name === 'AbortError') {
            return;
          }
          console.error(error);
          self.showToast('Unable to save file.', 'error');
        });
      return;
    }

    try {
      this.downloadFallback(this.state.fileName || 'document.md', this.state.markdown, 'text/markdown;charset=utf-8');
      this.afterSuccessfulSave(this.state.fileName || 'document.md');
    } catch (error) {
      console.error(error);
      this.showToast('Unable to download file.', 'error');
    }
  };

  MarkdownStudioApp.prototype.startDividerDrag = function (event) {
    if (!this.isPreviewVisible()) {
      return;
    }
    maybePreventDefault(event);
    this.isDraggingDivider = true;
    this.setState({ isDragging: true });
  };

  MarkdownStudioApp.prototype.handlePointerMove = function (event) {
    if (!this.isDraggingDivider || !this.layoutRef) {
      return;
    }
    var rect = this.layoutRef.getBoundingClientRect();
    var ratio = ((event.clientX - rect.left) / rect.width) * 100;
    this.setState({ splitRatio: clamp(ratio, 34, 66) });
  };

  MarkdownStudioApp.prototype.stopDividerDrag = function () {
    if (!this.isDraggingDivider) {
      return;
    }
    this.isDraggingDivider = false;
    this.setState({ isDragging: false });
  };

  MarkdownStudioApp.prototype.handleDragOver = function (event) {
    if (!hasFilesInTransfer(event.dataTransfer)) {
      return;
    }
    maybePreventDefault(event);
    if (!this.state.dragHover) {
      this.setState({ dragHover: true });
    }
  };

  MarkdownStudioApp.prototype.handleDragEnter = function (event) {
    if (!hasFilesInTransfer(event.dataTransfer)) {
      return;
    }
    maybePreventDefault(event);
    if (!this.state.dragHover) {
      this.setState({ dragHover: true });
    }
  };

  MarkdownStudioApp.prototype.handleDragLeave = function (event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      this.setState({ dragHover: false });
    }
  };

  MarkdownStudioApp.prototype.handleWindowDragLeave = function (event) {
    if (event.clientX <= 0 && event.clientY <= 0) {
      this.setState({ dragHover: false });
    }
  };

  MarkdownStudioApp.prototype.handleDrop = function (event) {
    if (!event.dataTransfer || !event.dataTransfer.files || !event.dataTransfer.files.length) {
      return;
    }
    maybePreventDefault(event);
    this.setState({ dragHover: false });
    if (!this.confirmDiscardIfNeeded()) {
      return;
    }
    var file = event.dataTransfer.files[0];
    var self = this;
    this.readFileObject(file, null).catch(function (error) {
      console.error(error);
      self.showToast('Unable to open dropped file.', 'error');
    });
  };

  MarkdownStudioApp.prototype.renderHeader = function () {
    var viewMode = this.state.zenMode ? 'Zen mode' : (this.isPreviewVisible() ? 'Split view' : 'Editor only');
    var autosaveLabel = !this.state.autosaveEnabled
      ? 'Autosave off'
      : this.state.autosaveStatus === 'saving'
        ? 'Draft syncing...'
        : this.state.autosaveStatus === 'saved'
          ? 'Draft saved ' + formatTime(this.state.lastAutosavedAt)
          : this.state.autosaveStatus === 'restored'
            ? 'Draft restored'
            : this.state.autosaveStatus === 'error'
              ? 'Autosave issue'
              : 'Autosave ready';
    var presetLabel = this.state.themePreset;
    var i = 0;

    for (i = 0; i < THEME_PRESETS.length; i += 1) {
      if (THEME_PRESETS[i].value === this.state.themePreset) {
        presetLabel = THEME_PRESETS[i].label;
        break;
      }
    }

    return e('header', { className: 'app-topbar' }, [
      e('div', { key: 'brand', className: 'app-brand' }, [
        e('div', {
          key: 'logo',
          className: 'brand-logo'
        }, 'M'),
        e('div', { key: 'copy', className: 'brand-copy' }, [
          e('div', { key: 'titleRow', className: 'brand-title-row' }, [
            e('h1', {
              key: 'title',
              className: 'brand-title'
            }, 'Markdown Studio Local'),
            e(StatusChip, {
              key: 'mode',
              tone: this.state.isFsApiAvailable ? 'success' : 'warning'
            }, this.state.isFsApiAvailable ? 'Native file access' : 'Download save mode')
          ]),
          e('p', {
            key: 'subtitle',
            className: 'brand-subtitle'
          }, 'Patch 3 adds a faster productivity layer with command palette, outline navigation, local session restore, recent snapshots, and cleaner laptop-sized workflows.'),
          e('div', { key: 'meta', className: 'brand-meta' }, [
            e(StatusChip, { key: 'filename', tone: 'accent' }, this.state.fileName),
            e(StatusChip, {
              key: 'dirty',
              tone: this.state.dirty ? 'warning' : 'success'
            }, this.state.dirty ? 'Unsaved disk changes' : 'Disk copy saved'),
            e(StatusChip, { key: 'saved' }, 'Last save ' + formatTime(this.state.lastSavedAt)),
            e(StatusChip, {
              key: 'autosave',
              tone: this.state.autosaveEnabled && this.state.autosaveStatus !== 'error' ? 'success' : 'warning'
            }, autosaveLabel),
            e(StatusChip, { key: 'view' }, viewMode),
            e(StatusChip, { key: 'preset' }, presetLabel)
          ])
        ])
      ]),
      e('div', { key: 'actions', className: 'topbar-actions' }, [
        e(ActionButton, {
          key: 'new',
          onClick: this.handleNewDocument,
          label: 'New',
          compact: true,
          icon: '＋',
          title: 'Create a new markdown document (Ctrl/Cmd + N)'
        }),
        e(ActionButton, {
          key: 'open',
          onClick: this.handleOpenFile,
          label: 'Open',
          compact: true,
          icon: '↥',
          title: 'Open a markdown file (Ctrl/Cmd + O)'
        }),
        e(ActionButton, {
          key: 'save',
          onClick: this.handleSaveFile,
          label: 'Save',
          compact: true,
          primary: true,
          icon: '💾',
          title: 'Save current document (Ctrl/Cmd + S)'
        }),
        e(ActionButton, {
          key: 'palette',
          onClick: this.openCommandPalette,
          label: 'Palette',
          compact: true,
          icon: '⌘',
          title: 'Open command palette (Ctrl/Cmd + P)'
        }),
        e(ActionButton, {
          key: 'help',
          onClick: this.openShortcuts,
          label: 'Shortcuts',
          compact: true,
          icon: '⌨',
          title: 'Open keyboard shortcuts help (F1)'
        }),
        e(ActionButton, {
          key: 'theme',
          onClick: this.handleThemeToggle,
          label: this.state.theme === 'dark' ? 'Light' : 'Dark',
          compact: true,
          icon: this.state.theme === 'dark' ? '☀' : '☾',
          title: 'Toggle light and dark themes'
        })
      ])
    ]);
  };

  MarkdownStudioApp.prototype.renderToolbar = function () {
    var self = this;
    return e('div', { className: 'toolbar-strip custom-scroll' }, [
      e('div', { key: 'history', className: 'toolbar-group' }, [
        e('span', { key: 'label', className: 'toolbar-label' }, 'History'),
        e(ToolbarButton, {
          key: 'undo',
          onClick: this.performUndo,
          label: 'Undo',
          icon: '↺',
          disabled: !this.state.canUndo,
          title: 'Undo (Ctrl/Cmd + Z)'
        }),
        e(ToolbarButton, {
          key: 'redo',
          onClick: this.performRedo,
          label: 'Redo',
          icon: '↻',
          disabled: !this.state.canRedo,
          title: 'Redo (Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y)'
        })
      ]),
      e('div', { key: 'inline', className: 'toolbar-group' }, [
        e('span', { key: 'label', className: 'toolbar-label' }, 'Inline'),
        e(ToolbarButton, { key: 'bold', onClick: function () { self.applyInlineFormat('bold'); }, label: 'Bold', icon: 'B', title: 'Bold (Ctrl/Cmd + B)', emphasis: true }),
        e(ToolbarButton, { key: 'italic', onClick: function () { self.applyInlineFormat('italic'); }, label: 'Italic', icon: 'I', title: 'Italic (Ctrl/Cmd + I)', emphasis: true }),
        e(ToolbarButton, { key: 'link', onClick: function () { self.applyInlineFormat('link'); }, label: 'Link', icon: '🔗', title: 'Insert link (Ctrl/Cmd + K)' })
      ]),
      e('div', { key: 'structure', className: 'toolbar-group' }, [
        e('span', { key: 'label', className: 'toolbar-label' }, 'Structure'),
        e(ToolbarButton, { key: 'h1', onClick: function () { self.handleToolbarAction('h1'); }, label: 'H1', title: 'Toggle heading level 1' }),
        e(ToolbarButton, { key: 'h2', onClick: function () { self.handleToolbarAction('h2'); }, label: 'H2', title: 'Toggle heading level 2' }),
        e(ToolbarButton, { key: 'bullet', onClick: function () { self.handleToolbarAction('bullet'); }, label: 'Bullet', icon: '•', title: 'Toggle bullet list' }),
        e(ToolbarButton, { key: 'ordered', onClick: function () { self.handleToolbarAction('ordered'); }, label: 'Numbered', icon: '1.', title: 'Toggle numbered list' }),
        e(ToolbarButton, { key: 'task', onClick: function () { self.handleToolbarAction('task'); }, label: 'Task', icon: '☐', title: 'Toggle task list' }),
        e(ToolbarButton, { key: 'quote', onClick: function () { self.handleToolbarAction('quote'); }, label: 'Quote', icon: '❝', title: 'Toggle quote block' }),
        e(ToolbarButton, { key: 'rule', onClick: function () { self.handleToolbarAction('rule'); }, label: 'Rule', icon: '─', title: 'Insert horizontal rule' })
      ]),
      e('div', { key: 'insert', className: 'toolbar-group toolbar-group--wrap' }, [
        e('span', { key: 'label', className: 'toolbar-label' }, 'Insert'),
        e(ToolbarButton, { key: 'image', onClick: this.openDialog.bind(this, 'image'), label: 'Image', icon: '🖼', title: 'Insert image from a URL or local file' }),
        e(ToolbarButton, { key: 'gif', onClick: this.openDialog.bind(this, 'gif'), label: 'GIF', icon: '🎞', title: 'Insert animated GIF from a URL or local file' }),
        e(ToolbarButton, { key: 'file', onClick: this.openDialog.bind(this, 'file'), label: 'File', icon: '📎', title: 'Insert file link from a URL or embedded local file' }),
        e(ToolbarButton, { key: 'code', onClick: this.openDialog.bind(this, 'code'), label: 'Code', icon: '{}', title: 'Insert fenced code block with a language selector' }),
        e(ToolbarButton, { key: 'table', onClick: this.openDialog.bind(this, 'table'), label: 'Table', icon: '▦', title: 'Insert markdown table with custom size' }),
        e(ToolbarButton, { key: 'callout', onClick: this.openDialog.bind(this, 'callout'), label: 'Callout', icon: '💡', title: 'Insert note, tip, warning, or important callout' }),
        e(ToolbarButton, { key: 'datetime', onClick: this.openDialog.bind(this, 'datetime'), label: 'Date', icon: '🕒', title: 'Insert date or time stamp' })
      ]),
      e('div', { key: 'export', className: 'toolbar-group toolbar-group--wrap' }, [
        e('span', { key: 'label', className: 'toolbar-label' }, 'Export'),
        e(ToolbarButton, { key: 'txt', onClick: this.handleExportText, label: 'TXT', icon: '📄', title: 'Export plain text' }),
        e(ToolbarButton, { key: 'html', onClick: this.handleExportHtml, label: 'HTML', icon: '</>', title: 'Export standalone HTML' }),
        e(ToolbarButton, { key: 'pdf', onClick: this.handleExportPdf, label: 'PDF', icon: '🖨', title: 'Open browser PDF export via print' }),
        e(ToolbarButton, { key: 'docx', onClick: this.handleExportDocx, label: 'DOCX', icon: 'W', title: 'Export a Word-friendly DOCX file' })
      ]),
      e('div', { key: 'view', className: 'toolbar-group toolbar-group--wrap' }, [
        e('span', { key: 'label', className: 'toolbar-label' }, 'Workspace'),
        e(ToolbarButton, {
          key: 'preview',
          onClick: this.togglePreview,
          label: this.isPreviewVisible() ? 'Preview on' : 'Preview off',
          icon: '⌗',
          title: 'Toggle preview visibility',
          active: this.isPreviewVisible()
        }),
        e(ToolbarButton, {
          key: 'zen',
          onClick: this.toggleZenMode,
          label: this.state.zenMode ? 'Zen on' : 'Zen',
          icon: '☯',
          title: 'Toggle zen mode (Ctrl/Cmd + /)',
          active: this.state.zenMode
        }),
        e(ToolbarButton, {
          key: 'focus',
          onClick: this.toggleFocusMode,
          label: this.state.focusMode ? 'Focus on' : 'Focus',
          icon: '◐',
          title: 'Toggle focus mode (Ctrl/Cmd + .)',
          active: this.state.focusMode
        }),
        e(ToolbarButton, {
          key: 'palette',
          onClick: this.openCommandPalette,
          label: 'Palette',
          icon: '⌘',
          title: 'Open command palette (Ctrl/Cmd + P)'
        })
      ]),
      e('div', { key: 'sidebar', className: 'toolbar-group toolbar-group--wrap' }, [
        e('span', { key: 'label', className: 'toolbar-label' }, 'Sidebar'),
        e(ToolbarButton, {
          key: 'outline',
          onClick: this.openUtilitySidebar.bind(this, 'outline'),
          label: 'Outline',
          icon: '≡',
          title: 'Open the heading outline sidebar',
          active: this.state.utilitySidebarOpen && this.state.utilitySidebarTab === 'outline'
        }),
        e(ToolbarButton, {
          key: 'stats',
          onClick: this.openUtilitySidebar.bind(this, 'stats'),
          label: 'Stats',
          icon: '◫',
          title: 'Open the document stats sidebar',
          active: this.state.utilitySidebarOpen && this.state.utilitySidebarTab === 'stats'
        }),
        e(ToolbarButton, {
          key: 'recent',
          onClick: this.openUtilitySidebar.bind(this, 'recent'),
          label: 'Recent',
          icon: '🕘',
          title: 'Open recent local sessions',
          active: this.state.utilitySidebarOpen && this.state.utilitySidebarTab === 'recent'
        })
      ]),
      e('div', { key: 'tools', className: 'toolbar-group toolbar-group--wrap' }, [
        e('span', { key: 'label', className: 'toolbar-label' }, 'Tools'),
        e(ToolbarButton, {
          key: 'find',
          onClick: this.openFindBar,
          label: 'Find',
          icon: '⌕',
          title: 'Open find and replace (Ctrl/Cmd + F)'
        }),
        e(ToolbarButton, {
          key: 'copyMd',
          onClick: this.handleCopyMarkdown,
          label: 'Copy MD',
          icon: '⎘',
          title: 'Copy markdown source to the clipboard'
        }),
        e(ToolbarButton, {
          key: 'wrap',
          onClick: this.toggleWrap,
          label: this.state.wrapEnabled ? 'Wrap on' : 'Wrap off',
          icon: '↵',
          title: 'Toggle line wrapping in the editor',
          active: this.state.wrapEnabled
        }),
        e(ToolbarButton, {
          key: 'autosave',
          onClick: this.toggleAutosave,
          label: this.state.autosaveEnabled ? 'Autosave on' : 'Autosave off',
          icon: '◎',
          title: 'Toggle local draft autosave',
          active: this.state.autosaveEnabled
        }),
        e(ToolbarButton, {
          key: 'top',
          onClick: this.jumpToTop,
          label: 'Top',
          icon: '↑',
          title: 'Jump to the top of the document'
        }),
        e(ToolbarButton, {
          key: 'bottom',
          onClick: this.jumpToBottom,
          label: 'Bottom',
          icon: '↓',
          title: 'Jump to the bottom of the document'
        }),
        e(ToolbarSelect, {
          key: 'tabSize',
          label: 'Tab',
          value: String(this.state.tabSize),
          onChange: this.handleTabSizeChange,
          title: 'Select indentation size',
          options: [
            { value: '2', label: '2 spaces' },
            { value: '4', label: '4 spaces' },
            { value: '8', label: '8 spaces' }
          ]
        }),
        e(ToolbarSelect, {
          key: 'accent',
          label: 'Accent',
          value: this.state.themePreset,
          onChange: this.handleThemePresetChange,
          title: 'Select the accent preset',
          options: THEME_PRESETS
        })
      ])
    ]);
  };

  MarkdownStudioApp.prototype.renderFindBar = function () {
    if (!this.state.findOpen) {
      return null;
    }

    var status = 'Type to search';
    if (this.state.findQuery) {
      status = this.state.searchMatchCount
        ? (this.state.activeSearchIndex >= 0 ? (this.state.activeSearchIndex + 1) : 0) + ' / ' + this.state.searchMatchCount + ' matches'
        : 'No matches';
    }

    return e('div', { className: 'findbar' }, [
      e('div', { key: 'inputs', className: 'findbar__inputs' }, [
        e('label', { key: 'find', className: 'findbar-field' }, [
          e('span', { key: 'label', className: 'findbar-field__label' }, 'Find'),
          e('input', {
            key: 'input',
            ref: function (node) { this.findInputRef = node; }.bind(this),
            type: 'text',
            value: this.state.findQuery,
            onChange: this.handleFindQueryChange,
            onKeyDown: this.handleFindInputKeyDown,
            className: 'findbar-input',
            placeholder: 'Search the markdown source'
          })
        ]),
        e('label', { key: 'replace', className: 'findbar-field' }, [
          e('span', { key: 'label', className: 'findbar-field__label' }, 'Replace'),
          e('input', {
            key: 'input',
            'data-role': 'replace',
            type: 'text',
            value: this.state.replaceQuery,
            onChange: this.handleReplaceQueryChange,
            onKeyDown: this.handleFindInputKeyDown,
            className: 'findbar-input',
            placeholder: 'Replacement text'
          })
        ])
      ]),
      e('div', { key: 'actions', className: 'findbar__actions' }, [
        e(StatusChip, {
          key: 'status',
          tone: this.state.searchMatchCount ? 'accent' : 'warning'
        }, status),
        e(ToolbarButton, {
          key: 'prev',
          onClick: this.findPrevious,
          label: 'Prev',
          icon: '↑',
          disabled: !this.state.findQuery,
          title: 'Go to the previous match (Shift + Enter in find field)'
        }),
        e(ToolbarButton, {
          key: 'next',
          onClick: this.findNext,
          label: 'Next',
          icon: '↓',
          disabled: !this.state.findQuery,
          title: 'Go to the next match (Enter in find field)'
        }),
        e(ToolbarButton, {
          key: 'replaceOne',
          onClick: this.replaceCurrentMatch,
          label: 'Replace',
          icon: '⇄',
          disabled: !this.state.findQuery,
          title: 'Replace the current match'
        }),
        e(ToolbarButton, {
          key: 'replaceAll',
          onClick: this.replaceAllMatches,
          label: 'All',
          icon: '⧉',
          disabled: !this.state.findQuery,
          title: 'Replace all matches'
        }),
        e(ToolbarButton, {
          key: 'close',
          onClick: this.closeFindBar,
          label: 'Close',
          icon: '✕',
          title: 'Close find and replace'
        })
      ])
    ]);
  };

  MarkdownStudioApp.prototype.renderEditorPane = function () {
    var self = this;
    var autosaveLabel = !this.state.autosaveEnabled
      ? 'Autosave off'
      : this.state.autosaveStatus === 'saving'
        ? 'Draft syncing...'
        : this.state.autosaveStatus === 'saved'
          ? 'Draft saved ' + formatTime(this.state.lastAutosavedAt)
          : this.state.autosaveStatus === 'restored'
            ? 'Draft restored'
            : this.state.autosaveStatus === 'error'
              ? 'Autosave issue'
              : 'Autosave ready';

    return e('section', {
      className: cx(
        'pane pane--editor',
        this.state.activePane === 'editor' ? 'is-active-pane' : '',
        this.state.focusMode && this.state.activePane !== 'editor' ? 'is-dimmed-pane' : ''
      )
    }, [
      e('div', {
        key: 'header',
        className: 'pane-header'
      }, [
        e('div', { key: 'titleWrap' }, [
          e('h2', { key: 'title', className: 'pane-title' }, 'Markdown file'),
          e('p', { key: 'caption', className: 'pane-subtitle' }, this.state.zenMode ? 'Zen mode is active. Write with the editor stretched edge to edge.' : (this.state.focusMode ? 'Focus mode is active. The editor stays visually primary while you write.' : 'Write markdown on the left. The preview, outline, and stats stay in sync.'))
        ]),
        e('div', { key: 'actions', className: 'pane-header-actions' }, [
          e(StatusChip, { key: 'line', tone: 'accent' }, 'Line ' + this.state.currentLine),
          e(StatusChip, { key: 'headings' }, this.state.insights.headings + ' headings'),
          e(StatusChip, { key: 'tabs' }, 'Tabs ' + this.state.tabSize),
          e(StatusChip, {
            key: 'autosave',
            tone: this.state.autosaveEnabled && this.state.autosaveStatus !== 'error' ? 'success' : 'warning'
          }, autosaveLabel)
        ])
      ]),
      this.renderFindBar(),
      e('div', {
        key: 'body',
        className: 'pane-body editor-body',
        onMouseEnter: function () { self.setActivePane('editor'); },
        onClick: function () { self.setActivePane('editor'); }
      }, [
        this.state.dragHover ? e('div', {
          key: 'overlay',
          className: 'drop-overlay'
        }, e('div', { className: 'drop-overlay__content' }, 'Drop a markdown file to open it locally')) : null,
        e('div', {
          key: 'gutter',
          ref: function (node) { self.gutterRef = node; },
          className: cx('line-numbers custom-scroll editor-gutter', this.state.wrapEnabled ? 'is-muted' : '')
        }, e('div', null, createLineNumberElements(this.state.stats.lines, this.state.currentLine))),
        e('div', {
          key: 'inputWrap',
          className: 'editor-input-wrap'
        }, [
          e('div', {
            key: 'currentLine',
            ref: function (node) { self.currentLineHighlightRef = node; },
            className: cx('editor-current-line', this.state.wrapEnabled ? 'is-hidden' : '')
          }),
          e('textarea', {
            key: 'textarea',
            ref: function (node) { self.editorRef = node; },
            value: this.state.markdown,
            onChange: this.handleEditorChange,
            onScroll: this.handleEditorScroll,
            onKeyDown: this.handleEditorKeyDown,
            onKeyUp: this.handleEditorSelectionChange,
            onClick: this.handleEditorSelectionChange,
            onFocus: function () {
              self.setActivePane('editor');
              self.handleEditorSelectionChange();
            },
            onSelect: this.handleEditorSelectionChange,
            onDragEnter: this.handleDragEnter,
            onDragLeave: this.handleDragLeave,
            spellCheck: false,
            wrap: this.state.wrapEnabled ? 'soft' : 'off',
            style: {
              tabSize: this.state.tabSize,
              MozTabSize: this.state.tabSize
            },
            className: cx('editor-textarea custom-scroll', this.state.wrapEnabled ? 'is-wrapped' : ''),
            placeholder: 'Write markdown here...'
          })
        ])
      ])
    ]);
  };

  MarkdownStudioApp.prototype.renderPreviewPane = function () {
    var self = this;
    var syncLabel = 'Sync ' + this.state.syncPercent + '% · ' + (this.state.syncSource === 'editor' ? 'Editor to preview' : 'Preview to editor');

    return e('section', {
      className: cx(
        'pane pane--preview',
        this.state.activePane === 'preview' ? 'is-active-pane' : '',
        this.state.focusMode && this.state.activePane !== 'preview' ? 'is-dimmed-pane' : ''
      )
    }, [
      e('div', {
        key: 'header',
        className: 'pane-header'
      }, [
        e('div', { key: 'titleWrap' }, [
          e('h2', { key: 'title', className: 'pane-title' }, 'Live preview'),
          e('p', { key: 'caption', className: 'pane-subtitle' }, 'Rendered HTML with syntax highlighting, GFM tables, callouts, media embeds, and productivity overlays.')
        ]),
        e('div', { key: 'actions', className: 'pane-header-actions' }, [
          e(ToolbarButton, {
            key: 'copy',
            onClick: this.handleCopyHtml,
            label: 'Copy HTML',
            icon: '⎘',
            title: 'Copy rendered HTML to the clipboard'
          }),
          e(ToolbarButton, {
            key: 'copyMd',
            onClick: this.handleCopyMarkdown,
            label: 'Copy MD',
            icon: '⌘',
            title: 'Copy the markdown source to the clipboard'
          }),
          e(ToolbarButton, {
            key: 'pdf',
            onClick: this.handleExportPdf,
            label: 'PDF',
            icon: '🖨',
            title: 'Open the browser print flow for PDF export'
          }),
          e(StatusChip, { key: 'status', tone: 'success' }, syncLabel)
        ])
      ]),
      e('div', { key: 'meter', className: 'preview-sync-meter' },
        e('div', {
          className: 'preview-sync-meter__fill',
          style: { width: this.state.syncPercent + '%' }
        })
      ),
      e('div', {
        key: 'body',
        ref: function (node) { self.previewRef = node; },
        onScroll: this.handlePreviewScroll,
        onMouseEnter: function () { self.setActivePane('preview'); },
        onClick: function () { self.setActivePane('preview'); },
        className: 'pane-body preview-scroller custom-scroll'
      }, e('article', {
        className: 'preview-sheet markdown-body',
        dangerouslySetInnerHTML: { __html: this.state.renderedHtml }
      }))
    ]);
  };

  MarkdownStudioApp.prototype.renderComposerModal = function () {
    var dialog = this.state.dialog;
    if (!dialog) {
      return null;
    }

    var self = this;

    function renderField(key, label, control, hint) {
      return e('label', { key: key, className: 'composer-field' }, [
        e('span', { key: 'label', className: 'composer-field__label' }, label),
        control,
        hint ? e('span', { key: 'hint', className: 'composer-field__hint' }, hint) : null
      ]);
    }

    function renderTextInput(key, field, label, placeholder) {
      return renderField(
        key,
        label,
        e('input', {
          key: 'control',
          type: 'text',
          value: dialog[field] || '',
          onChange: self.handleDialogFieldChange.bind(self, field),
          className: 'composer-input',
          placeholder: placeholder || ''
        })
      );
    }

    function renderModeSwitch() {
      return e('div', { key: 'mode', className: 'composer-mode-switch' }, [
        e(ToolbarButton, {
          key: 'url',
          onClick: self.handleDialogFieldChange.bind(self, 'mode', 'url'),
          label: 'URL',
          icon: '🔗',
          active: dialog.mode === 'url',
          title: 'Insert from a URL'
        }),
        e(ToolbarButton, {
          key: 'file',
          onClick: self.handleDialogFieldChange.bind(self, 'mode', 'file'),
          label: 'Local file',
          icon: '📁',
          active: dialog.mode === 'file',
          title: 'Embed a local file'
        })
      ]);
    }

    var bodyNodes = [
      e('p', { key: 'description', className: 'composer-description' }, dialog.description)
    ];

    if (dialog.type === 'image' || dialog.type === 'gif') {
      bodyNodes.push(renderTextInput('alt', 'alt', 'Alt text', dialog.type === 'gif' ? 'Animated GIF' : 'Describe the image'));
      bodyNodes.push(renderTextInput('title', 'assetTitle', 'Title (optional)', 'Shown on hover in some renderers'));
      bodyNodes.push(renderField('source', 'Source', renderModeSwitch(), 'Choose a remote URL or embed a local file as a data URL.'));
      if (dialog.mode === 'url') {
        bodyNodes.push(renderTextInput('url', 'url', dialog.type === 'gif' ? 'GIF URL' : 'Image URL', dialog.type === 'gif' ? 'https://media.example.com/clip.gif' : 'https://images.example.com/photo.png'));
      } else {
        bodyNodes.push(renderField('file', 'Local file', e('input', {
          key: 'control',
          type: 'file',
          accept: dialog.accept,
          onChange: self.handleDialogFileChange,
          className: 'composer-file-input'
        }), dialog.loading ? 'Embedding file…' : 'Embedded files travel with the markdown because they are stored as data URLs.'));
        if (dialog.fileName) {
          bodyNodes.push(e('div', { key: 'fileMeta', className: 'composer-chip-row' }, [
            e(StatusChip, { key: 'name', tone: 'accent' }, dialog.fileName)
          ]));
        }
      }
    } else if (dialog.type === 'file') {
      bodyNodes.push(renderTextInput('label', 'label', 'Link label', 'Download file'));
      bodyNodes.push(renderTextInput('title', 'assetTitle', 'Title (optional)', 'Tooltip or helper text'));
      bodyNodes.push(renderField('source', 'Source', renderModeSwitch(), 'Use a remote URL or embed a local file.'));
      if (dialog.mode === 'url') {
        bodyNodes.push(renderTextInput('url', 'url', 'File URL', 'https://example.com/file.pdf'));
      } else {
        bodyNodes.push(renderField('file', 'Local file', e('input', {
          key: 'control',
          type: 'file',
          accept: dialog.accept,
          onChange: self.handleDialogFileChange,
          className: 'composer-file-input'
        }), dialog.loading ? 'Embedding file…' : 'Local files are embedded as data URLs so the note remains self-contained.'));
        if (dialog.fileName) {
          bodyNodes.push(e('div', { key: 'fileMeta', className: 'composer-chip-row' }, [
            e(StatusChip, { key: 'name', tone: 'accent' }, dialog.fileName)
          ]));
        }
      }
    } else if (dialog.type === 'code') {
      bodyNodes.push(renderField('language', 'Language', e('select', {
        key: 'control',
        value: dialog.language,
        onChange: self.handleDialogFieldChange.bind(self, 'language'),
        className: 'composer-select'
      }, INSERT_LANGUAGES.map(function (option) {
        return e('option', { key: option.value, value: option.value }, option.label);
      }))));
      bodyNodes.push(renderField('snippet', 'Snippet', e('textarea', {
        key: 'control',
        value: dialog.snippet || '',
        onChange: self.handleDialogFieldChange.bind(self, 'snippet'),
        className: 'composer-textarea custom-scroll',
        rows: 8,
        placeholder: 'Paste or write your snippet here...'
      })));
    } else if (dialog.type === 'table') {
      bodyNodes.push(e('div', { key: 'grid', className: 'composer-grid composer-grid--tight' }, [
        renderField('columns', 'Columns', e('input', {
          key: 'control',
          type: 'number',
          min: '1',
          max: '8',
          value: dialog.columns,
          onChange: self.handleDialogFieldChange.bind(self, 'columns'),
          className: 'composer-input'
        })),
        renderField('rows', 'Body rows', e('input', {
          key: 'control',
          type: 'number',
          min: '1',
          max: '12',
          value: dialog.rows,
          onChange: self.handleDialogFieldChange.bind(self, 'rows'),
          className: 'composer-input'
        })),
        renderField('alignment', 'Alignment', e('select', {
          key: 'control',
          value: dialog.alignment,
          onChange: self.handleDialogFieldChange.bind(self, 'alignment'),
          className: 'composer-select'
        }, [
          e('option', { key: 'left', value: 'left' }, 'Left'),
          e('option', { key: 'center', value: 'center' }, 'Center'),
          e('option', { key: 'right', value: 'right' }, 'Right')
        ]))
      ]));
    } else if (dialog.type === 'callout') {
      bodyNodes.push(e('div', { key: 'grid', className: 'composer-grid composer-grid--tight' }, [
        renderField('tone', 'Tone', e('select', {
          key: 'control',
          value: dialog.tone,
          onChange: self.handleDialogFieldChange.bind(self, 'tone'),
          className: 'composer-select'
        }, [
          e('option', { key: 'NOTE', value: 'NOTE' }, 'Note'),
          e('option', { key: 'TIP', value: 'TIP' }, 'Tip'),
          e('option', { key: 'IMPORTANT', value: 'IMPORTANT' }, 'Important'),
          e('option', { key: 'WARNING', value: 'WARNING' }, 'Warning'),
          e('option', { key: 'CAUTION', value: 'CAUTION' }, 'Caution')
        ])),
        renderTextInput('heading', 'heading', 'Heading', 'Callout title')
      ]));
      bodyNodes.push(renderField('body', 'Message', e('textarea', {
        key: 'control',
        value: dialog.body || '',
        onChange: self.handleDialogFieldChange.bind(self, 'body'),
        className: 'composer-textarea custom-scroll',
        rows: 6,
        placeholder: 'Add the callout message here...'
      }), 'Rendered callouts use Markdown Studio styling in the live preview and exported HTML.'));
    } else {
      bodyNodes.push(renderField('format', 'Insert format', e('select', {
        key: 'control',
        value: dialog.format,
        onChange: self.handleDialogFieldChange.bind(self, 'format'),
        className: 'composer-select'
      }, [
        e('option', { key: 'datetime', value: 'datetime' }, 'Date & time'),
        e('option', { key: 'date', value: 'date' }, 'Date only'),
        e('option', { key: 'time', value: 'time' }, 'Time only'),
        e('option', { key: 'iso', value: 'iso' }, 'ISO 8601 timestamp')
      ]), 'Inserted using your browser locale or an ISO timestamp.'));
    }

    return e('div', {
      className: 'modal-backdrop',
      onClick: function (event) {
        if (event.target === event.currentTarget) {
          self.closeDialog();
        }
      }
    }, e('div', { className: 'modal-card modal-card--composer' }, [
      e('div', { key: 'header', className: 'modal-card__header' }, [
        e('div', { key: 'copy' }, [
          e('h3', { key: 'title', className: 'modal-card__title' }, dialog.title),
          e('p', { key: 'subtitle', className: 'modal-card__subtitle' }, 'Patch 2 adds richer insert tools and local-first exports without leaving the editor.')
        ]),
        e(ActionButton, {
          key: 'close',
          onClick: self.closeDialog,
          label: 'Close',
          compact: true,
          title: 'Close this dialog',
          icon: '✕'
        })
      ]),
      e('div', { key: 'body', className: 'modal-card__body modal-card__body--composer custom-scroll' }, bodyNodes),
      e('div', { key: 'footer', className: 'modal-card__footer' }, [
        e(StatusChip, { key: 'chip', tone: 'accent' }, dialog.type === 'file' ? 'Embedded links stay local' : dialog.type === 'datetime' ? 'Uses local browser time' : 'Insert at cursor position'),
        e('div', { key: 'actions', className: 'modal-card__actions' }, [
          e(ActionButton, {
            key: 'cancel',
            onClick: self.closeDialog,
            label: 'Cancel',
            compact: true,
            title: 'Cancel and close this dialog'
          }),
          e(ActionButton, {
            key: 'insert',
            onClick: self.submitDialog,
            label: 'Insert',
            primary: true,
            compact: true,
            title: 'Insert this content at the cursor'
          })
        ])
      ])
    ]));
  };

  MarkdownStudioApp.prototype.renderUtilitySidebar = function () {
    if (!this.state.utilitySidebarOpen) {
      return null;
    }

    var self = this;
    var tab = this.state.utilitySidebarTab;
    var outline = this.state.outline || [];
    var insights = this.state.insights || {};
    var recent = this.state.recentDocuments || [];
    var subtitle = tab === 'outline'
      ? outline.length + ' headings detected in the current note'
      : tab === 'stats'
        ? 'Live document metrics and reading progress'
        : 'Recent local browser snapshots and restore points';
    var activeOutlineId = null;
    var i = 0;

    for (i = 0; i < outline.length; i += 1) {
      if (this.state.currentLine >= outline[i].line) {
        activeOutlineId = outline[i].id;
      }
    }

    var taskPercent = insights.tasksTotal ? Math.round((insights.tasksDone / insights.tasksTotal) * 100) : 0;
    var body = null;

    if (tab === 'outline') {
      body = outline.length ? e('div', { className: 'outline-list' }, outline.map(function (item) {
        return e('button', {
          key: item.id,
          type: 'button',
          onClick: function () {
            self.jumpToOutlineItem(item.position);
          },
          className: cx('outline-item', activeOutlineId === item.id ? 'is-active' : ''),
          style: { paddingLeft: (14 + ((item.level - 1) * 14)) + 'px' }
        }, [
          e('span', { key: 'line', className: 'outline-item__line' }, 'L' + item.line),
          e('span', { key: 'text', className: 'outline-item__text' }, item.text)
        ]);
      })) : e('div', { className: 'sidebar-empty' }, [
        e('h4', { key: 'title', className: 'sidebar-empty__title' }, 'No headings yet'),
        e('p', { key: 'subtitle', className: 'sidebar-empty__subtitle' }, 'Add markdown headings like # or ## to generate a live outline.')
      ]);
    } else if (tab === 'stats') {
      body = e('div', { className: 'sidebar-stats' }, [
        e('div', { key: 'grid', className: 'sidebar-stats-grid' }, [
          { label: 'Words', value: this.state.stats.words },
          { label: 'Characters', value: this.state.stats.characters },
          { label: 'Lines', value: this.state.stats.lines },
          { label: 'Read time', value: this.state.stats.readingMinutes ? this.state.stats.readingMinutes + ' min' : '--' },
          { label: 'Headings', value: insights.headings || 0 },
          { label: 'Paragraphs', value: insights.paragraphs || 0 },
          { label: 'Tables', value: insights.tables || 0 },
          { label: 'Code blocks', value: insights.codeBlocks || 0 },
          { label: 'Images', value: insights.images || 0 },
          { label: 'Links', value: insights.links || 0 }
        ].map(function (item) {
          return e('div', { key: item.label, className: 'sidebar-stat-card' }, [
            e('span', { key: 'label', className: 'sidebar-stat-card__label' }, item.label),
            e('strong', { key: 'value', className: 'sidebar-stat-card__value' }, item.value)
          ]);
        })),
        e('div', { key: 'tasks', className: 'task-progress-card' }, [
          e('div', { key: 'top', className: 'task-progress-card__top' }, [
            e('span', { key: 'label', className: 'task-progress-card__label' }, 'Task progress'),
            e('strong', { key: 'value', className: 'task-progress-card__value' }, insights.tasksTotal ? (insights.tasksDone + ' / ' + insights.tasksTotal) : 'No tasks')
          ]),
          e('div', { key: 'bar', className: 'task-progress-card__bar' },
            e('div', {
              className: 'task-progress-card__fill',
              style: { width: taskPercent + '%' }
            })
          ),
          e('p', { key: 'hint', className: 'task-progress-card__hint' }, insights.tasksTotal ? (taskPercent + '% complete across markdown task lists.') : 'Add markdown task lists like - [ ] and - [x] to track progress.')
        ])
      ]);
    } else {
      body = recent.length ? e('div', { className: 'recent-list' }, [
        e('div', { key: 'actions', className: 'recent-list__actions' }, [
          e(ToolbarButton, {
            key: 'clear',
            onClick: this.clearRecentDocuments,
            label: 'Clear list',
            icon: '✕',
            title: 'Remove every recent local snapshot'
          }),
          e(ToolbarButton, {
            key: 'open',
            onClick: this.handleOpenFile,
            label: 'Open file',
            icon: '↥',
            title: 'Open a markdown file from disk'
          })
        ]),
        recent.map(function (entry) {
          return e('article', { key: entry.id, className: 'recent-card' }, [
            e('div', { key: 'top', className: 'recent-card__top' }, [
              e('div', { key: 'copy', className: 'recent-card__copy' }, [
                e('h4', { key: 'title', className: 'recent-card__title' }, entry.fileName),
                e('p', { key: 'time', className: 'recent-card__time' }, formatDateTime(entry.updatedAt))
              ]),
              e(StatusChip, {
                key: 'status',
                tone: entry.markdown ? 'success' : 'warning'
              }, entry.markdown ? 'Snapshot stored' : 'Metadata only')
            ]),
            e('p', { key: 'snippet', className: 'recent-card__snippet' }, entry.snippet || 'No preview text stored for this entry.'),
            e('div', { key: 'footer', className: 'recent-card__footer' }, [
              e(ToolbarButton, {
                key: 'restore',
                onClick: self.restoreRecentDocument.bind(self, entry.id),
                label: 'Restore',
                icon: '↺',
                disabled: !entry.markdown,
                title: entry.markdown ? 'Restore this local snapshot' : 'Snapshot content was too large to store'
              }),
              e(ToolbarButton, {
                key: 'remove',
                onClick: self.removeRecentDocument.bind(self, entry.id),
                label: 'Remove',
                icon: '🗑',
                title: 'Remove this entry from recent local sessions'
              })
            ])
          ]);
        })
      ]) : e('div', { className: 'sidebar-empty' }, [
        e('h4', { key: 'title', className: 'sidebar-empty__title' }, 'No recent sessions yet'),
        e('p', { key: 'subtitle', className: 'sidebar-empty__subtitle' }, 'Open, save, or create files to build a list of local browser snapshots you can revisit quickly.')
      ]);
    }

    return e('div', { className: 'utility-sidebar-layer' }, [
      e('button', {
        key: 'backdrop',
        type: 'button',
        onClick: this.closeUtilitySidebar,
        className: 'utility-sidebar-backdrop',
        title: 'Close utility sidebar'
      }),
      e('aside', { key: 'sidebar', className: 'utility-sidebar custom-scroll' }, [
        e('div', { key: 'header', className: 'utility-sidebar__header' }, [
          e('div', { key: 'copy' }, [
            e('h3', { key: 'title', className: 'utility-sidebar__title' }, tab === 'outline' ? 'Document outline' : (tab === 'stats' ? 'Document stats' : 'Recent local sessions')),
            e('p', { key: 'subtitle', className: 'utility-sidebar__subtitle' }, subtitle)
          ]),
          e(ActionButton, {
            key: 'close',
            onClick: this.closeUtilitySidebar,
            label: 'Close',
            compact: true,
            icon: '✕',
            title: 'Close utility sidebar'
          })
        ]),
        e('div', { key: 'tabs', className: 'utility-sidebar__tabs' }, UTILITY_TABS.map(function (item) {
          return e('button', {
            key: item.value,
            type: 'button',
            onClick: function () {
              self.handleSidebarTabChange(item.value);
            },
            className: cx('utility-tab', self.state.utilitySidebarTab === item.value ? 'is-active' : '')
          }, item.label);
        })),
        e('div', { key: 'body', className: 'utility-sidebar__body' }, body)
      ])
    ]);
  };

  MarkdownStudioApp.prototype.renderStatusBar = function () {
    var autosaveLabel = !this.state.autosaveEnabled
      ? 'Autosave off'
      : this.state.autosaveStatus === 'saving'
        ? 'Draft syncing...'
        : this.state.autosaveStatus === 'saved'
          ? 'Draft saved ' + formatTime(this.state.lastAutosavedAt)
          : this.state.autosaveStatus === 'restored'
            ? 'Draft restored'
            : this.state.autosaveStatus === 'error'
              ? 'Autosave issue'
              : 'Autosave ready';

    return e('footer', { className: 'app-statusbar' }, [
      e('div', { key: 'stats', className: 'status-cluster' }, [
        e(StatBlock, { key: 'words', label: 'Words', value: this.state.stats.words }),
        e(StatBlock, { key: 'chars', label: 'Characters', value: this.state.stats.characters }),
        e(StatBlock, { key: 'lines', label: 'Lines', value: this.state.stats.lines }),
        e(StatBlock, { key: 'read', label: 'Read time', value: this.state.stats.readingMinutes ? this.state.stats.readingMinutes + ' min' : '--' }),
        e(StatBlock, { key: 'headings', label: 'Headings', value: this.state.insights.headings || 0 })
      ]),
      e('div', { key: 'hints', className: 'status-cluster status-cluster--hints' }, [
        e(StatusChip, {
          key: 'autosave',
          tone: this.state.autosaveEnabled && this.state.autosaveStatus !== 'error' ? 'success' : 'warning'
        }, autosaveLabel),
        e(StatusChip, { key: 'sync' }, this.isPreviewVisible() ? ('Sync ' + this.state.syncPercent + '%') : (this.state.zenMode ? 'Zen editor' : 'Editor only')),
        e(StatusChip, { key: 'saved' }, this.state.lastSavedAt ? ('Disk saved ' + formatDateTime(this.state.lastSavedAt)) : 'Disk save pending'),
        e(StatusChip, { key: 'recent' }, this.state.recentDocuments.length + ' recent sessions'),
        e(StatusChip, { key: 'tasks', tone: 'accent' }, this.state.insights.tasksTotal ? (this.state.insights.tasksDone + ' / ' + this.state.insights.tasksTotal + ' tasks complete') : ((this.state.insights.tables || 0) + ' tables · ' + (this.state.insights.codeBlocks || 0) + ' code blocks'))
      ])
    ]);
  };

  MarkdownStudioApp.prototype.render = function () {
    var isEditorOnly = !this.isPreviewVisible();
    var leftWidth = 'minmax(0, calc(' + this.state.splitRatio + '% - ' + (DIVIDER_WIDTH / 2) + 'px))';
    var rightWidth = 'minmax(0, calc(' + (100 - this.state.splitRatio) + '% - ' + (DIVIDER_WIDTH / 2) + 'px))';
    var paletteItems = this.getFilteredCommandItems();
    var paletteSelectedIndex = clamp(this.state.commandSelectionIndex, 0, Math.max(0, paletteItems.length - 1));

    return e('div', {
      className: cx(
        'app-shell',
        this.state.zenMode ? 'is-zen' : '',
        this.state.focusMode ? 'is-focus-mode' : '',
        this.state.activePane === 'preview' ? 'focus-preview' : 'focus-editor'
      )
    }, [
      e(HiddenFileInput, {
        key: 'hiddenInput',
        fileInputRef: function (node) { this.fileInputRef = node; }.bind(this),
        onChange: this.handleFallbackFileOpen
      }),
      e(ShortcutsModal, {
        key: 'shortcuts',
        open: this.state.shortcutsOpen,
        onClose: this.closeShortcuts
      }),
      e(CommandPaletteModal, {
        key: 'palette',
        open: this.state.commandPaletteOpen,
        inputRef: function (node) { this.commandInputRef = node; }.bind(this),
        query: this.state.commandQuery,
        onQueryChange: this.handleCommandQueryChange,
        onKeyDown: this.handleCommandPaletteKeyDown,
        items: paletteItems,
        selectedIndex: paletteSelectedIndex,
        onSelect: this.setCommandSelection,
        onRun: this.runCommandFromPalette,
        onClose: this.closeCommandPalette
      }),
      this.renderComposerModal(),
      e('div', { key: 'toastWrap', className: 'toast-wrap' },
        e(Toast, {
          message: this.state.toast && this.state.toast.message,
          tone: this.state.toast && this.state.toast.tone
        })
      ),
      e('div', {
        key: 'frame',
        className: 'app-frame'
      }, [
        this.renderHeader(),
        this.renderToolbar(),
        e('main', {
          key: 'workspace',
          className: 'workspace-wrap'
        }, [
          e('div', {
            key: 'grid',
            ref: function (node) { this.layoutRef = node; }.bind(this),
            className: cx('workspace-grid', isEditorOnly ? 'is-editor-only' : ''),
            style: {
              gridTemplateColumns: isEditorOnly ? 'minmax(0, 1fr)' : (leftWidth + ' ' + DIVIDER_WIDTH + 'px ' + rightWidth)
            }
          }, [
            this.renderEditorPane(),
            isEditorOnly ? null : e('div', {
              key: 'divider',
              onMouseDown: this.startDividerDrag,
              className: cx(
                'drag-divider',
                this.state.isDragging ? 'is-dragging' : ''
              ),
              title: 'Drag to resize panes'
            }),
            isEditorOnly ? null : this.renderPreviewPane()
          ]),
          this.renderUtilitySidebar()
        ]),
        this.renderStatusBar()
      ])
    ]);
  };

  var PATCH4_PREVIEW_THEMES = [
    { value: 'studio', label: 'Studio' },
    { value: 'paper', label: 'Paper' },
    { value: 'midnight', label: 'Midnight' },
    { value: 'terminal', label: 'Terminal' }
  ];

  var PATCH4_TEMPLATE_LIBRARY = [
    {
      id: 'blank-note',
      kind: 'document',
      title: 'Blank note',
      description: 'A clean starting point for a new markdown document.',
      fileName: 'untitled.md',
      content: ['# Untitled', '', 'Start writing here...'].join('\n')
    },
    {
      id: 'meeting-notes',
      kind: 'document',
      title: 'Meeting notes',
      description: 'Agenda, notes, decisions, and action items.',
      fileName: 'meeting-notes.md',
      content: [
        '---',
        'title: Team sync',
        'owner: Engineering',
        'status: Draft',
        'tags: [meeting, team]',
        '---',
        '',
        '# Meeting notes',
        '',
        '## Agenda',
        '',
        '- Updates',
        '- Decisions',
        '- Risks',
        '',
        '## Notes',
        '',
        '- ',
        '',
        '## Action items',
        '',
        '- [ ] ',
        '',
        '## Decisions',
        '',
        '- '
      ].join('\n')
    },
    {
      id: 'readme',
      kind: 'document',
      title: 'Project README',
      description: 'A structured project README with frontmatter.',
      fileName: 'README.md',
      content: [
        '---',
        'title: Project name',
        'owner: Team',
        'status: Active',
        'tags: [readme, docs]',
        '---',
        '',
        '# Project name',
        '',
        'A short summary of the project.',
        '',
        '## Getting started',
        '',
        '1. Install dependencies',
        '2. Run the project locally',
        '3. Explore the docs',
        '',
        '## Scripts',
        '',
        '```bash',
        'npm install',
        'npm run dev',
        '```',
        '',
        '## Architecture',
        '',
        '- '
      ].join('\n')
    },
    {
      id: 'release-notes',
      kind: 'document',
      title: 'Release notes',
      description: 'A changelog style document for shipping notes.',
      fileName: 'release-notes.md',
      content: [
        '---',
        'title: Release notes',
        'status: Draft',
        'version: v1.0.0',
        '---',
        '',
        '# Release notes',
        '',
        '## Highlights',
        '',
        '- ',
        '',
        '## Improvements',
        '',
        '- ',
        '',
        '## Fixes',
        '',
        '- '
      ].join('\n')
    },
    {
      id: 'frontmatter-snippet',
      kind: 'snippet',
      title: 'Frontmatter block',
      description: 'Insert a frontmatter header for metadata driven notes.',
      content: [
        '---',
        'title: Document title',
        'owner: Team name',
        'status: Draft',
        'tags: [docs, notes]',
        '---',
        ''
      ].join('\n')
    },
    {
      id: 'mermaid-snippet',
      kind: 'snippet',
      title: 'Flowchart snippet',
      description: 'Insert a mermaid style flowchart block.',
      content: [
        '```mermaid',
        'graph TD',
        '  A[Start] --> B{Validate}',
        '  B -->|Yes| C[Ship]',
        '  B -->|No| D[Revise]',
        '  D --> B',
        '```'
      ].join('\n')
    },
    {
      id: 'math-snippet',
      kind: 'snippet',
      title: 'Math snippet',
      description: 'Insert inline and display math examples.',
      content: [
        'Inline math: $E = mc^2$',
        '',
        '$$',
        '\\frac{\\Delta y}{\\Delta x} = x^2 + \\alpha',
        '$$'
      ].join('\n')
    },
    {
      id: 'callout-snippet',
      kind: 'snippet',
      title: 'Callout snippet',
      description: 'Insert a note style callout block.',
      content: ['> [!TIP]', '> Write a short highlight or reminder here.'].join('\n')
    }
  ];

  var PATCH4_MATH_SYMBOLS = {
    alpha: '&alpha;',
    beta: '&beta;',
    gamma: '&gamma;',
    delta: '&delta;',
    epsilon: '&epsilon;',
    theta: '&theta;',
    lambda: '&lambda;',
    mu: '&mu;',
    pi: '&pi;',
    sigma: '&sigma;',
    phi: '&phi;',
    omega: '&omega;',
    Delta: '&Delta;',
    Theta: '&Theta;',
    Lambda: '&Lambda;',
    Pi: '&Pi;',
    Sigma: '&Sigma;',
    Phi: '&Phi;',
    Omega: '&Omega;',
    cdot: '&middot;',
    times: '&times;',
    pm: '&plusmn;',
    neq: '&ne;',
    leq: '&le;',
    geq: '&ge;',
    approx: '&asymp;',
    infty: '&infin;',
    to: '&rarr;',
    leftarrow: '&larr;',
    rightarrow: '&rarr;',
    sum: '&sum;',
    prod: '&prod;',
    int: '&int;',
    partial: '&part;'
  };

  function patch4ReadSettings() {
    return readStoredSettings();
  }

  function patch4CreateSnapshotId() {
    return 'snap-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

  function patch4NormalizeSnapshots(value) {
    return Array.isArray(value) ? value.map(function (item) {
      return {
        id: item.id || patch4CreateSnapshotId(),
        label: item.label || 'Snapshot',
        createdAt: item.createdAt || new Date().toISOString(),
        markdown: typeof item.markdown === 'string' ? item.markdown : ''
      };
    }).slice(0, 24) : [];
  }

  function patch4ParseFrontmatter(markdown) {
    var source = String(markdown || '');
    var match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (!match) {
      return {
        hasFrontmatter: false,
        raw: '',
        body: source,
        attributes: {}
      };
    }

    var raw = match[1] || '';
    var attributes = {};
    raw.split(/\r?\n/).forEach(function (line) {
      var trimmed = line.trim();
      if (!trimmed || trimmed.charAt(0) === '#') {
        return;
      }
      var index = trimmed.indexOf(':');
      if (index === -1) {
        return;
      }
      var key = trimmed.slice(0, index).trim();
      var value = trimmed.slice(index + 1).trim();
      if (!key) {
        return;
      }
      if (value.charAt(0) === '[' && value.charAt(value.length - 1) === ']') {
        value = value.slice(1, -1).split(',').map(function (item) {
          return item.trim();
        }).filter(Boolean);
      } else if (/^-?\d+(\.\d+)?$/.test(value)) {
        value = Number(value);
      } else if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      } else if ((value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') || (value.charAt(0) === '\'' && value.charAt(value.length - 1) === '\'')) {
        value = value.slice(1, -1);
      }
      attributes[key] = value;
    });

    return {
      hasFrontmatter: true,
      raw: raw,
      body: source.slice(match[0].length),
      attributes: attributes
    };
  }

  function patch4MetadataItems(frontmatter) {
    var attributes = frontmatter && frontmatter.attributes ? frontmatter.attributes : {};
    var items = [];
    Object.keys(attributes).forEach(function (key) {
      var value = attributes[key];
      if (value == null || value === '') {
        return;
      }
      items.push({
        key: key,
        value: Array.isArray(value) ? value.join(', ') : String(value)
      });
    });
    return items;
  }

  function renderMarkdownPatch4(markdown) {
    var parsed = patch4ParseFrontmatter(markdown);
    try {
      var html = '';
      if (marked.parse) {
        html = marked.parse(parsed.body || '');
      } else if (marked.marked) {
        html = marked.marked(parsed.body || '');
      } else {
        html = '<p>Markdown parser not available.</p>';
      }
      return postProcessRenderedHtml(html);
    } catch (error) {
      return '<pre class="render-error">' + escapeHtml(error.message || String(error)) + '</pre>';
    }
  }

  function patch4ApplyPreviewCss(cssText) {
    if (typeof document === 'undefined') {
      return;
    }
    var styleNode = document.getElementById('patch4-custom-preview-style');
    if (!styleNode) {
      styleNode = document.createElement('style');
      styleNode.id = 'patch4-custom-preview-style';
      document.head.appendChild(styleNode);
    }
    styleNode.textContent = String(cssText || '');
  }
  function patch4RenderMathLite(tex) {
    var output = escapeHtml(String(tex || '').trim());

    function loopReplace(pattern, replacer) {
      var previous = null;
      while (previous !== output) {
        previous = output;
        output = output.replace(pattern, replacer);
      }
    }

    loopReplace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, function (_, top, bottom) {
      return '<span class="math-frac"><span class="math-frac__top">' + patch4RenderMathLite(top) + '</span><span class="math-frac__bar"></span><span class="math-frac__bottom">' + patch4RenderMathLite(bottom) + '</span></span>';
    });

    loopReplace(/\\sqrt\{([^{}]+)\}/g, function (_, body) {
      return '<span class="math-root"><span class="math-root__symbol">&radic;</span><span class="math-root__body">' + patch4RenderMathLite(body) + '</span></span>';
    });

    output = output.replace(/\\([A-Za-z]+)/g, function (match, name) {
      return Object.prototype.hasOwnProperty.call(PATCH4_MATH_SYMBOLS, name) ? PATCH4_MATH_SYMBOLS[name] : match;
    });

    loopReplace(/([A-Za-z0-9)\]])\^\{([^{}]+)\}/g, function (_, base, exponent) {
      return base + '<sup>' + patch4RenderMathLite(exponent) + '</sup>';
    });
    loopReplace(/([A-Za-z0-9)\]])_\{([^{}]+)\}/g, function (_, base, subscript) {
      return base + '<sub>' + patch4RenderMathLite(subscript) + '</sub>';
    });
    output = output.replace(/([A-Za-z0-9)\]])\^([A-Za-z0-9+\-])/g, '$1<sup>$2</sup>');
    output = output.replace(/([A-Za-z0-9)\]])_([A-Za-z0-9+\-])/g, '$1<sub>$2</sub>');
    output = output.replace(/\\left|\\right/g, '');
    output = output.replace(/[{}]/g, '');
    return output;
  }

  function patch4ReplaceInlineMathNode(textNode) {
    if (!textNode || !textNode.nodeValue || textNode.nodeValue.indexOf('$') === -1) {
      return;
    }
    var value = textNode.nodeValue;
    var fragment = document.createDocumentFragment();
    var pattern = /(^|[^\\])\$([^$\n]+?)\$/g;
    var cursor = 0;
    var match = null;

    while ((match = pattern.exec(value))) {
      var start = match.index + match[1].length;
      if (start > cursor) {
        fragment.appendChild(document.createTextNode(value.slice(cursor, start)));
      }
      var math = document.createElement('span');
      math.className = 'math-inline';
      math.innerHTML = patch4RenderMathLite(match[2]);
      fragment.appendChild(math);
      cursor = pattern.lastIndex;
    }

    if (cursor === 0) {
      return;
    }
    if (cursor < value.length) {
      fragment.appendChild(document.createTextNode(value.slice(cursor)));
    }
    if (textNode.parentNode) {
      textNode.parentNode.replaceChild(fragment, textNode);
    }
  }

  function patch4ParseMermaidNode(spec) {
    var raw = String(spec || '').trim().replace(/;$/, '');
    var match = null;
    if (!raw) {
      return null;
    }
    if ((match = raw.match(/^([A-Za-z0-9_-]+)\{(.+)\}$/))) {
      return { id: match[1], label: match[2], shape: 'diamond' };
    }
    if ((match = raw.match(/^([A-Za-z0-9_-]+)\((.+)\)$/))) {
      return { id: match[1], label: match[2], shape: 'round' };
    }
    if ((match = raw.match(/^([A-Za-z0-9_-]+)\[(.+)\]$/))) {
      return { id: match[1], label: match[2], shape: 'rect' };
    }
    if ((match = raw.match(/^([A-Za-z0-9_-]+)$/))) {
      return { id: match[1], label: match[1], shape: 'rect' };
    }
    return { id: raw.replace(/[^A-Za-z0-9_-]+/g, '') || patch4CreateSnapshotId(), label: raw, shape: 'rect' };
  }

  function patch4SvgText(label, x, y, className) {
    return '<text class="' + className + '" x="' + x + '" y="' + y + '" text-anchor="middle">' + escapeHtml(label) + '</text>';
  }

  function patch4BuildMermaidSvg(code) {
    var lines = String(code || '').replace(/\t/g, '  ').split(/\r?\n/).map(function (line) {
      return line.trim();
    }).filter(Boolean);

    if (!lines.length) {
      return '<div class="mermaid-lite__empty">Add a simple graph TD or graph LR block to render a local flowchart preview.</div>';
    }

    var direction = 'TD';
    var header = lines[0].match(/^(graph|flowchart)\s+(TD|TB|BT|LR|RL)/i);
    if (header) {
      direction = header[2].toUpperCase();
      lines.shift();
    }

    var nodes = {};
    var order = [];
    var edges = [];

    function ensureNode(spec) {
      var parsed = patch4ParseMermaidNode(spec);
      if (!parsed) {
        return null;
      }
      if (!nodes[parsed.id]) {
        nodes[parsed.id] = parsed;
        order.push(parsed.id);
      } else if (parsed.label && parsed.label !== parsed.id) {
        nodes[parsed.id].label = parsed.label;
        nodes[parsed.id].shape = parsed.shape;
      }
      return nodes[parsed.id];
    }

    lines.forEach(function (line) {
      if (!line || /^%%/.test(line) || /^(classDef|style|linkStyle|click|subgraph|end)\b/i.test(line)) {
        return;
      }
      var normalized = line.replace(/\|/g, '@@PIPE@@');
      var match = normalized.match(/^(.*?)\s*(-->|---|==>|-.->)\s*(?:@@PIPE@@([^@]+)@@PIPE@@\s*)?(.*)$/);
      if (!match) {
        ensureNode(line);
        return;
      }
      var fromNode = ensureNode(match[1]);
      var toNode = ensureNode(match[4]);
      if (!fromNode || !toNode) {
        return;
      }
      edges.push({ from: fromNode.id, to: toNode.id, label: match[3] ? match[3].trim() : '' });
    });

    if (!order.length) {
      return '<div class="mermaid-lite__empty">Unable to parse the mermaid block. Use a small graph TD or graph LR example.</div>';
    }

    var indegree = {};
    var adjacency = {};
    order.forEach(function (id) {
      indegree[id] = 0;
      adjacency[id] = [];
    });
    edges.forEach(function (edge) {
      indegree[edge.to] = (indegree[edge.to] || 0) + 1;
      adjacency[edge.from] = adjacency[edge.from] || [];
      adjacency[edge.from].push(edge.to);
    });

    var queue = [];
    var levels = {};
    order.forEach(function (id) {
      if (!indegree[id]) {
        queue.push(id);
        levels[id] = 0;
      }
    });
    if (!queue.length) {
      queue.push(order[0]);
      levels[order[0]] = 0;
    }

    var visited = {};
    while (queue.length) {
      var current = queue.shift();
      visited[current] = true;
      var nextNodes = adjacency[current] || [];
      for (var i = 0; i < nextNodes.length; i += 1) {
        var nextId = nextNodes[i];
        var nextLevel = (levels[current] || 0) + 1;
        levels[nextId] = Math.max(levels[nextId] || 0, nextLevel);
        indegree[nextId] = Math.max(0, (indegree[nextId] || 0) - 1);
        if (!visited[nextId] && indegree[nextId] === 0) {
          queue.push(nextId);
        }
      }
    }

    order.forEach(function (id, index) {
      if (typeof levels[id] !== 'number') {
        levels[id] = index;
      }
    });

    var grouped = {};
    order.forEach(function (id) {
      var level = levels[id] || 0;
      if (!grouped[level]) {
        grouped[level] = [];
      }
      grouped[level].push(nodes[id]);
    });

    var levelKeys = Object.keys(grouped).map(function (key) { return Number(key); }).sort(function (a, b) { return a - b; });
    var horizontal = direction === 'LR' || direction === 'RL';
    var maxPerLevel = 1;
    levelKeys.forEach(function (key) {
      maxPerLevel = Math.max(maxPerLevel, grouped[key].length);
    });

    var laneGap = 180;
    var trackGap = 120;
    var width = horizontal ? (levelKeys.length * laneGap) + 160 : (maxPerLevel * laneGap) + 120;
    var height = horizontal ? (maxPerLevel * trackGap) + 120 : (levelKeys.length * trackGap) + 120;
    var positions = {};

    levelKeys.forEach(function (level) {
      var group = grouped[level];
      group.forEach(function (node, index) {
        var total = group.length;
        var offset = ((horizontal ? height : width) - ((total - 1) * laneGap + 120)) / 2;
        if (horizontal) {
          positions[node.id] = {
            x: 80 + (direction === 'RL' ? (levelKeys.length - level - 1) : level) * laneGap,
            y: offset + index * laneGap
          };
        } else {
          positions[node.id] = {
            x: offset + index * laneGap,
            y: 60 + (direction === 'BT' ? (levelKeys.length - level - 1) : level) * trackGap
          };
        }
      });
    });

    var svg = [];
    svg.push('<svg class="mermaid-lite__svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Diagram preview">');
    svg.push('<defs><marker id="patch4Arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="currentColor"></path></marker></defs>');

    edges.forEach(function (edge) {
      var from = positions[edge.from];
      var to = positions[edge.to];
      if (!from || !to) {
        return;
      }
      var startX = from.x + 60;
      var startY = from.y + 28;
      var endX = to.x + 60;
      var endY = to.y + 28;
      svg.push('<path class="mermaid-lite__edge" d="M' + startX + ' ' + startY + ' L' + endX + ' ' + endY + '" marker-end="url(#patch4Arrow)"></path>');
      if (edge.label) {
        svg.push(patch4SvgText(edge.label, (startX + endX) / 2, (startY + endY) / 2 - 8, 'mermaid-lite__edge-label'));
      }
    });

    order.forEach(function (id) {
      var node = nodes[id];
      var position = positions[id];
      if (!position) {
        return;
      }
      if (node.shape === 'diamond') {
        svg.push('<path class="mermaid-lite__node mermaid-lite__node--diamond" d="M' + (position.x + 60) + ' ' + position.y + ' L' + (position.x + 120) + ' ' + (position.y + 28) + ' L' + (position.x + 60) + ' ' + (position.y + 56) + ' L' + position.x + ' ' + (position.y + 28) + ' Z"></path>');
      } else if (node.shape === 'round') {
        svg.push('<rect class="mermaid-lite__node mermaid-lite__node--round" x="' + position.x + '" y="' + position.y + '" rx="24" ry="24" width="120" height="56"></rect>');
      } else {
        svg.push('<rect class="mermaid-lite__node" x="' + position.x + '" y="' + position.y + '" rx="16" ry="16" width="120" height="56"></rect>');
      }
      svg.push(patch4SvgText(node.label, position.x + 60, position.y + 33, 'mermaid-lite__label-text'));
    });

    svg.push('</svg>');
    return svg.join('');
  }

  function patch4EnhancePreview(root, options) {
    if (!root) {
      return;
    }
    var opts = options || {};
    var blocks = root.querySelectorAll('pre code');
    for (var i = 0; i < blocks.length; i += 1) {
      var block = blocks[i];
      var className = block.className || '';
      if (opts.diagrams !== false && /language-mermaid/.test(className)) {
        var wrapper = document.createElement('div');
        wrapper.className = 'mermaid-lite';
        wrapper.innerHTML = '<div class="mermaid-lite__meta"><span class="mermaid-lite__badge">Diagram preview</span><span class="mermaid-lite__hint">Local lightweight renderer</span></div>' + patch4BuildMermaidSvg(block.textContent || '');
        var pre = block.parentNode;
        if (pre && pre.parentNode) {
          pre.parentNode.replaceChild(wrapper, pre);
        }
        continue;
      }
      if (window.hljs && window.hljs.highlightElement) {
        var rawText = block.textContent;
        block.textContent = rawText;
        if (block.dataset) {
          delete block.dataset.highlighted;
        }
        block.classList.remove('hljs');
        window.hljs.highlightElement(block);
      }
    }

    if (opts.math !== false && typeof document !== 'undefined' && typeof NodeFilter !== 'undefined') {
      var displayElements = root.querySelectorAll('p, li, td, th, blockquote p');
      for (var d = 0; d < displayElements.length; d += 1) {
        var element = displayElements[d];
        if (!element || element.childElementCount > 0) {
          continue;
        }
        var text = (element.textContent || '').trim();
        var displayMatch = text.match(/^\$\$([\s\S]+)\$\$$/);
        if (!displayMatch) {
          continue;
        }
        var displayNode = document.createElement('div');
        displayNode.className = 'math-block';
        displayNode.innerHTML = patch4RenderMathLite(displayMatch[1]);
        element.parentNode.replaceChild(displayNode, element);
      }

      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          if (!node || !node.nodeValue || node.nodeValue.indexOf('$') === -1) {
            return NodeFilter.FILTER_REJECT;
          }
          var parent = node.parentNode;
          if (!parent || !parent.tagName) {
            return NodeFilter.FILTER_REJECT;
          }
          var tag = parent.tagName.toLowerCase();
          if (tag === 'code' || tag === 'pre' || tag === 'script' || tag === 'style') {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.closest && parent.closest('.math-inline, .math-block, .mermaid-lite, svg')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      var pending = [];
      var current = walker.nextNode();
      while (current) {
        pending.push(current);
        current = walker.nextNode();
      }
      pending.forEach(patch4ReplaceInlineMathNode);
    }
  }

  function patch4BuildLineDiff(previousText, nextText) {
    var left = String(previousText || '').split('\n');
    var right = String(nextText || '').split('\n');
    if ((left.length * right.length) > 90000) {
      var maxRows = Math.max(left.length, right.length);
      var simpleRows = [];
      for (var i = 0; i < maxRows; i += 1) {
        var leftText = typeof left[i] === 'string' ? left[i] : '';
        var rightText = typeof right[i] === 'string' ? right[i] : '';
        simpleRows.push({
          type: leftText === rightText ? 'same' : (!leftText ? 'added' : (!rightText ? 'removed' : 'changed')),
          leftNo: left[i] == null ? '' : i + 1,
          rightNo: right[i] == null ? '' : i + 1,
          leftText: leftText,
          rightText: rightText
        });
      }
      return simpleRows;
    }

    var m = left.length;
    var n = right.length;
    var table = new Array(m + 1);
    var row = 0;
    var col = 0;
    for (row = 0; row <= m; row += 1) {
      table[row] = new Array(n + 1);
      for (col = 0; col <= n; col += 1) {
        table[row][col] = 0;
      }
    }

    for (row = m - 1; row >= 0; row -= 1) {
      for (col = n - 1; col >= 0; col -= 1) {
        if (left[row] === right[col]) {
          table[row][col] = table[row + 1][col + 1] + 1;
        } else {
          table[row][col] = Math.max(table[row + 1][col], table[row][col + 1]);
        }
      }
    }

    var iCursor = 0;
    var jCursor = 0;
    var rows = [];
    while (iCursor < m && jCursor < n) {
      if (left[iCursor] === right[jCursor]) {
        rows.push({ type: 'same', leftNo: iCursor + 1, rightNo: jCursor + 1, leftText: left[iCursor], rightText: right[jCursor] });
        iCursor += 1;
        jCursor += 1;
      } else if (table[iCursor + 1][jCursor] >= table[iCursor][jCursor + 1]) {
        rows.push({ type: 'removed', leftNo: iCursor + 1, rightNo: '', leftText: left[iCursor], rightText: '' });
        iCursor += 1;
      } else {
        rows.push({ type: 'added', leftNo: '', rightNo: jCursor + 1, leftText: '', rightText: right[jCursor] });
        jCursor += 1;
      }
    }
    while (iCursor < m) {
      rows.push({ type: 'removed', leftNo: iCursor + 1, rightNo: '', leftText: left[iCursor], rightText: '' });
      iCursor += 1;
    }
    while (jCursor < n) {
      rows.push({ type: 'added', leftNo: '', rightNo: jCursor + 1, leftText: '', rightText: right[jCursor] });
      jCursor += 1;
    }
    return rows;
  }
  var patch4BaseComponentDidMount = MarkdownStudioApp.prototype.componentDidMount;
  var patch4BaseComponentDidUpdate = MarkdownStudioApp.prototype.componentDidUpdate;
  var patch4BaseComponentWillUnmount = MarkdownStudioApp.prototype.componentWillUnmount;
  var patch4BaseRender = MarkdownStudioApp.prototype.render;

  MarkdownStudioApp.prototype.componentDidMount = function () {
    var self = this;
    patch4BaseComponentDidMount.call(this);

    if (!this._patch4Bootstrapped) {
      var persisted = patch4ReadSettings();
      this._patch4Bootstrapped = true;
      this.diskSyncTimeout = null;
      this.setState({
        previewTheme: (persisted.previewTheme || 'studio'),
        customCss: typeof persisted.customCss === 'string' ? persisted.customCss : '',
        printLayout: !!persisted.printLayout,
        diskSyncEnabled: !!persisted.diskSyncEnabled,
        snapshots: patch4NormalizeSnapshots(persisted.snapshots),
        templatesOpen: false,
        versionsOpen: false,
        styleStudioOpen: false,
        diffOpen: false,
        diffSnapshotId: null,
        liteDiagramsEnabled: persisted.liteDiagramsEnabled !== false,
        liteMathEnabled: persisted.liteMathEnabled !== false
      }, function () {
        patch4ApplyPreviewCss(self.state.customCss);
        self.updateMarkdown(self.state.markdown, null, null, { recordHistory: false });
      });
    }
  };

  MarkdownStudioApp.prototype.componentDidUpdate = function (prevProps, prevState) {
    patch4BaseComponentDidUpdate.call(this, prevProps, prevState);

    if (prevState.customCss !== this.state.customCss) {
      patch4ApplyPreviewCss(this.state.customCss);
    }

    if (
      prevState.previewTheme !== this.state.previewTheme ||
      prevState.customCss !== this.state.customCss ||
      prevState.printLayout !== this.state.printLayout ||
      prevState.diskSyncEnabled !== this.state.diskSyncEnabled ||
      prevState.snapshots !== this.state.snapshots ||
      prevState.liteDiagramsEnabled !== this.state.liteDiagramsEnabled ||
      prevState.liteMathEnabled !== this.state.liteMathEnabled
    ) {
      this.schedulePersistLocalState();
    }

    if (
      prevState.liteDiagramsEnabled !== this.state.liteDiagramsEnabled ||
      prevState.liteMathEnabled !== this.state.liteMathEnabled ||
      prevState.printLayout !== this.state.printLayout ||
      prevState.previewTheme !== this.state.previewTheme
    ) {
      this.highlightPreview();
    }

    if (
      this.state.diskSyncEnabled &&
      this.fileHandle &&
      prevState.markdown !== this.state.markdown
    ) {
      this.scheduleDiskSync();
    }
  };

  MarkdownStudioApp.prototype.componentWillUnmount = function () {
    if (this.diskSyncTimeout) {
      window.clearTimeout(this.diskSyncTimeout);
      this.diskSyncTimeout = null;
    }
    patch4BaseComponentWillUnmount.call(this);
  };

  MarkdownStudioApp.prototype.persistLocalState = function () {
    try {
      var payload = {
        theme: this.state.theme,
        themePreset: this.state.themePreset,
        splitRatio: this.state.splitRatio,
        fileName: this.state.fileName,
        lastSavedAt: this.state.lastSavedAt,
        lastAutosavedAt: this.state.lastAutosavedAt,
        wrapEnabled: this.state.wrapEnabled,
        autosaveEnabled: this.state.autosaveEnabled,
        showPreview: this.state.showPreview,
        zenMode: this.state.zenMode,
        focusMode: this.state.focusMode,
        tabSize: this.state.tabSize,
        utilitySidebarTab: this.state.utilitySidebarTab,
        recentDocuments: this.state.recentDocuments,
        previewTheme: this.state.previewTheme || 'studio',
        customCss: this.state.customCss || '',
        printLayout: !!this.state.printLayout,
        diskSyncEnabled: !!this.state.diskSyncEnabled,
        snapshots: patch4NormalizeSnapshots(this.state.snapshots),
        liteDiagramsEnabled: this.state.liteDiagramsEnabled !== false,
        liteMathEnabled: this.state.liteMathEnabled !== false
      };

      if (this.state.autosaveEnabled) {
        payload.markdown = this.state.markdown;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

      if (this.pendingMarkdownPersist && this.state.autosaveEnabled) {
        var stamp = new Date().toISOString();
        this.pendingMarkdownPersist = false;
        if (this.state.lastAutosavedAt !== stamp || this.state.autosaveStatus !== 'saved') {
          this.setState({
            lastAutosavedAt: stamp,
            autosaveStatus: 'saved'
          });
        }
      } else if (!this.state.autosaveEnabled && this.state.autosaveStatus !== 'disabled') {
        this.setState({ autosaveStatus: 'disabled' });
      }
    } catch (error) {
      console.warn('Unable to persist local draft.', error);
      if (this.state.autosaveEnabled) {
        this.setState({ autosaveStatus: 'error' });
      }
    }
  };

  MarkdownStudioApp.prototype.highlightPreview = function () {
    var self = this;
    if (!this.previewRef) {
      return;
    }
    window.requestAnimationFrame(function () {
      if (!self.previewRef) {
        return;
      }
      patch4EnhancePreview(self.previewRef, {
        diagrams: self.state.liteDiagramsEnabled !== false,
        math: self.state.liteMathEnabled !== false
      });
    });
  };

  MarkdownStudioApp.prototype.updateMarkdown = function (nextMarkdown, extraState, callback, options) {
    var self = this;
    var opts = options || {};
    var currentMarkdown = this.state.markdown;
    var hasChanged = nextMarkdown !== currentMarkdown;
    var insights = computeDocumentInsights(nextMarkdown);

    if (hasChanged && opts.recordHistory !== false) {
      this.pushHistorySnapshot(currentMarkdown);
    }

    if (hasChanged && this.state.autosaveEnabled) {
      this.pendingMarkdownPersist = true;
    }

    var nextState = Object.assign({
      markdown: nextMarkdown,
      renderedHtml: renderMarkdownPatch4(nextMarkdown),
      stats: computeStats(nextMarkdown),
      insights: insights,
      outline: insights.outline,
      dirty: nextMarkdown !== this.savedMarkdown
    }, extraState || {});

    if (hasChanged && typeof nextState.autosaveStatus === 'undefined') {
      nextState.autosaveStatus = this.state.autosaveEnabled ? 'saving' : 'disabled';
    }

    this.setState(nextState, function () {
      self.handleEditorSelectionChange();
      if (self.state.findOpen && self.state.findQuery) {
        self.refreshSearchInfo(nextMarkdown);
      } else if (self.state.findOpen) {
        self.updateSearchStatus(0, -1);
      }
      if (callback) {
        callback();
      }
    });
  };

  MarkdownStudioApp.prototype.buildStandaloneHtmlDocument = function () {
    var themeCss = '';
    if ((this.state.previewTheme || 'studio') === 'paper') {
      themeCss = 'body { background: #f8fafc; } .markdown-body { max-width: 840px; margin: 0 auto; background: #ffffff; color: #111827; } .frontmatter-bar { background: #f8fafc; border-color: #dbe3f0; }';
    } else if ((this.state.previewTheme || 'studio') === 'midnight') {
      themeCss = 'body { background: #020617; color: #e2e8f0; } .markdown-body { background: #0f172a; color: #cbd5e1; } .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 { color: #f8fafc; } .frontmatter-bar { background: rgba(15, 23, 42, 0.9); border-color: rgba(51, 65, 85, 0.85); } .frontmatter-chip { background: rgba(30, 41, 59, 0.9); color: #e2e8f0; }';
    } else if ((this.state.previewTheme || 'studio') === 'terminal') {
      themeCss = 'body { background: #03131a; color: #d1fae5; } .markdown-body { background: #071b23; color: #d1fae5; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; } .markdown-body a { color: #67e8f9; } .frontmatter-bar { background: rgba(6, 24, 32, 0.96); border-color: rgba(20, 184, 166, 0.28); } .frontmatter-chip { background: rgba(8, 47, 73, 0.9); color: #ccfbf1; border-color: rgba(45, 212, 191, 0.22); }';
    }
    if (this.state.printLayout) {
      themeCss += ' body { background: #eef2ff; padding: 28px; } .markdown-body { max-width: 840px; margin: 0 auto; box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18); } @media print { body { background: #ffffff; padding: 0; } .markdown-body { box-shadow: none; max-width: none; } }';
    }
    var htmlDocument = buildStandaloneExportHtml(this.getBaseFileName(), this.getPreviewSheetHtml());
    return htmlDocument.replace('</style>', '\n' + themeCss + '\n' + (this.state.customCss || '') + '\n</style>');
  };

  MarkdownStudioApp.prototype.readFileObject = function (file, fileHandle) {
    var self = this;
    return file.text().then(function (text) {
      var insights = computeDocumentInsights(text);
      self.fileHandle = fileHandle || null;
      self.savedMarkdown = text;
      self.pendingMarkdownPersist = self.state.autosaveEnabled;
      self.resetHistory();
      self.setState({
        markdown: text,
        renderedHtml: renderMarkdownPatch4(text),
        stats: computeStats(text),
        insights: insights,
        outline: insights.outline,
        fileName: file.name || 'untitled.md',
        dirty: false,
        lastSavedAt: null,
        autosaveStatus: self.state.autosaveEnabled ? 'saving' : 'disabled',
        dragHover: false,
        findOpen: false,
        findQuery: '',
        replaceQuery: '',
        searchMatchCount: 0,
        activeSearchIndex: -1,
        utilitySidebarOpen: false,
        commandPaletteOpen: false,
        snapshots: []
      }, function () {
        self.focusSelection(0, 0);
        self.rememberCurrentDocument('opened');
        self.showToast('Opened ' + (file.name || 'document') + '.', 'success');
      });
    });
  };

  MarkdownStudioApp.prototype.handleNewDocument = function () {
    var self = this;
    var insights = computeDocumentInsights(NEW_DOCUMENT_MARKDOWN);
    if (!this.confirmDiscardIfNeeded()) {
      return;
    }
    this.fileHandle = null;
    this.savedMarkdown = NEW_DOCUMENT_MARKDOWN;
    this.pendingMarkdownPersist = this.state.autosaveEnabled;
    this.resetHistory();
    this.setState({
      markdown: NEW_DOCUMENT_MARKDOWN,
      renderedHtml: renderMarkdownPatch4(NEW_DOCUMENT_MARKDOWN),
      stats: computeStats(NEW_DOCUMENT_MARKDOWN),
      insights: insights,
      outline: insights.outline,
      fileName: 'untitled.md',
      dirty: false,
      lastSavedAt: null,
      findOpen: false,
      findQuery: '',
      replaceQuery: '',
      searchMatchCount: 0,
      activeSearchIndex: -1,
      commandPaletteOpen: false,
      utilitySidebarOpen: false,
      snapshots: []
    }, function () {
      self.focusSelection(0, 0);
      self.rememberCurrentDocument('new');
      self.showToast('Started a new markdown file.', 'success');
    });
  };

  MarkdownStudioApp.prototype.afterSuccessfulSave = function (fileName) {
    var self = this;
    var stamp = new Date().toISOString();
    this.savedMarkdown = this.state.markdown;
    this.setState({
      fileName: fileName || this.state.fileName,
      dirty: false,
      lastSavedAt: stamp
    }, function () {
      self.rememberCurrentDocument('saved');
      self.captureSnapshot('Disk save', true);
      self.showToast('Saved to disk.', 'success');
    });
  };

  MarkdownStudioApp.prototype.scheduleDiskSync = function () {
    var self = this;
    if (this.diskSyncTimeout) {
      window.clearTimeout(this.diskSyncTimeout);
      this.diskSyncTimeout = null;
    }
    this.diskSyncTimeout = window.setTimeout(function () {
      self.diskSyncTimeout = null;
      if (!self.fileHandle || !self.state.diskSyncEnabled) {
        return;
      }
      self.fileHandle.createWritable().then(function (writable) {
        return writable.write(self.state.markdown).then(function () {
          return writable.close();
        });
      }).then(function () {
        self.savedMarkdown = self.state.markdown;
        self.setState({
          dirty: false,
          lastSavedAt: new Date().toISOString()
        });
      }).catch(function (error) {
        console.error(error);
        self.showToast('Automatic disk sync failed.', 'error');
      });
    }, 1000);
  };

  MarkdownStudioApp.prototype.openTemplatesModal = function () {
    this.setState({ templatesOpen: true });
  };

  MarkdownStudioApp.prototype.closeTemplatesModal = function () {
    this.setState({ templatesOpen: false });
  };

  MarkdownStudioApp.prototype.openVersionsModal = function () {
    this.setState({ versionsOpen: true });
  };

  MarkdownStudioApp.prototype.closeVersionsModal = function () {
    this.setState({ versionsOpen: false });
  };

  MarkdownStudioApp.prototype.openStyleStudio = function () {
    this.setState({ styleStudioOpen: true });
  };

  MarkdownStudioApp.prototype.closeStyleStudio = function () {
    this.setState({ styleStudioOpen: false });
  };

  MarkdownStudioApp.prototype.closeDiffModal = function () {
    this.setState({ diffOpen: false, diffSnapshotId: null });
  };

  MarkdownStudioApp.prototype.handlePreviewThemeChange = function (event) {
    this.setState({ previewTheme: event.target.value });
  };

  MarkdownStudioApp.prototype.handleCustomCssChange = function (event) {
    this.setState({ customCss: event.target.value });
  };

  MarkdownStudioApp.prototype.resetCustomCss = function () {
    this.setState({ customCss: '' });
  };

  MarkdownStudioApp.prototype.togglePrintLayout = function () {
    this.setState({ printLayout: !this.state.printLayout });
  };

  MarkdownStudioApp.prototype.toggleDiskSync = function () {
    if (!this.state.diskSyncEnabled && !this.fileHandle) {
      this.showToast('Save or open a file with native file access before enabling auto sync.', 'error');
      return;
    }
    this.setState({ diskSyncEnabled: !this.state.diskSyncEnabled });
  };

  MarkdownStudioApp.prototype.toggleLiteDiagrams = function () {
    this.setState({ liteDiagramsEnabled: !(this.state.liteDiagramsEnabled !== false) });
  };

  MarkdownStudioApp.prototype.toggleLiteMath = function () {
    this.setState({ liteMathEnabled: !(this.state.liteMathEnabled !== false) });
  };

  MarkdownStudioApp.prototype.captureSnapshot = function (label, silent) {
    var nextSnapshot = {
      id: patch4CreateSnapshotId(),
      label: label || ('Snapshot ' + (((this.state.snapshots && this.state.snapshots.length) || 0) + 1)),
      createdAt: new Date().toISOString(),
      markdown: this.state.markdown
    };
    var snapshots = patch4NormalizeSnapshots(this.state.snapshots || []);
    if (snapshots.length && snapshots[0].markdown === nextSnapshot.markdown) {
      if (!silent) {
        this.showToast('No changes since the latest snapshot.', 'error');
      }
      return;
    }
    snapshots.unshift(nextSnapshot);
    snapshots = snapshots.slice(0, 24);
    this.setState({ snapshots: snapshots });
    if (!silent) {
      this.showToast('Snapshot captured.', 'success');
    }
  };

  MarkdownStudioApp.prototype.restoreSnapshot = function (snapshotId) {
    var snapshots = patch4NormalizeSnapshots(this.state.snapshots || []);
    var snapshot = null;
    var i = 0;
    for (i = 0; i < snapshots.length; i += 1) {
      if (snapshots[i].id === snapshotId) {
        snapshot = snapshots[i];
        break;
      }
    }
    if (!snapshot) {
      return;
    }
    if (!window.confirm('Restore this snapshot into the current document?')) {
      return;
    }
    var self = this;
    this.updateMarkdown(snapshot.markdown, null, function () {
      self.showToast('Snapshot restored into the current document.', 'success');
    });
  };

  MarkdownStudioApp.prototype.deleteSnapshot = function (snapshotId) {
    var snapshots = patch4NormalizeSnapshots(this.state.snapshots || []).filter(function (item) {
      return item.id !== snapshotId;
    });
    this.setState({ snapshots: snapshots });
  };

  MarkdownStudioApp.prototype.openDiffFromSnapshot = function (snapshotId) {
    this.setState({ diffOpen: true, diffSnapshotId: snapshotId });
  };

  MarkdownStudioApp.prototype.applyTemplate = function (templateId) {
    var template = null;
    var i = 0;
    for (i = 0; i < PATCH4_TEMPLATE_LIBRARY.length; i += 1) {
      if (PATCH4_TEMPLATE_LIBRARY[i].id === templateId) {
        template = PATCH4_TEMPLATE_LIBRARY[i];
        break;
      }
    }
    if (!template) {
      return;
    }

    var self = this;
    if (template.kind === 'snippet') {
      this.replaceSelection(function (context) {
        var text = template.content;
        var selectionStart = context.start;
        var selectionEnd = context.start + text.length;
        return {
          text: text,
          selectionStart: selectionStart,
          selectionEnd: selectionEnd
        };
      });
      this.setState({ templatesOpen: false }, function () {
        self.showToast('Inserted ' + template.title + '.', 'success');
      });
      return;
    }

    if (this.state.dirty && !window.confirm('Replace the current document with the selected template?')) {
      return;
    }

    this.fileHandle = null;
    this.savedMarkdown = '';
    this.pendingMarkdownPersist = this.state.autosaveEnabled;
    this.resetHistory();
    this.setState({
      fileName: template.fileName || 'untitled.md',
      lastSavedAt: null,
      snapshots: [],
      templatesOpen: false,
      utilitySidebarOpen: false,
      commandPaletteOpen: false
    }, function () {
      self.updateMarkdown(template.content, null, function () {
        self.focusSelection(0, 0);
        self.showToast('Loaded ' + template.title + '.', 'success');
      });
    });
  };

  MarkdownStudioApp.prototype.renderFrontmatterBar = function () {
    var frontmatter = patch4ParseFrontmatter(this.state.markdown);
    var items = patch4MetadataItems(frontmatter);
    if (!items.length) {
      return null;
    }
    var title = frontmatter.attributes.title || this.getBaseFileName();
    return e('div', { className: 'frontmatter-bar' }, [
      e('div', { key: 'copy', className: 'frontmatter-bar__copy' }, [
        e('div', { key: 'eyebrow', className: 'frontmatter-bar__eyebrow' }, 'Document metadata'),
        e('div', { key: 'title', className: 'frontmatter-bar__title' }, title)
      ]),
      e('div', { key: 'chips', className: 'frontmatter-bar__chips' }, items.map(function (item) {
        return e('div', { key: item.key, className: 'frontmatter-chip' }, [
          e('span', { key: 'k', className: 'frontmatter-chip__key' }, item.key),
          e('span', { key: 'v', className: 'frontmatter-chip__value' }, item.value)
        ]);
      }))
    ]);
  };

  MarkdownStudioApp.prototype.renderPatch4Bar = function () {
    var snapshotCount = (this.state.snapshots && this.state.snapshots.length) || 0;
    return e('div', { className: 'patch4-ribbon custom-scroll' }, [
      e('div', { key: 'title', className: 'patch4-ribbon__copy' }, [
        e('div', { key: 'eyebrow', className: 'patch4-ribbon__eyebrow' }, 'Patch 4 power tools'),
        e('div', { key: 'subtitle', className: 'patch4-ribbon__subtitle' }, 'Templates, version history, preview themes, custom CSS, frontmatter, and local diagram and math rendering.')
      ]),
      e('div', { key: 'actions', className: 'patch4-ribbon__actions' }, [
        e(ActionButton, {
          key: 'templates',
          onClick: this.openTemplatesModal.bind(this),
          label: 'Templates',
          compact: true,
          icon: 'T',
          title: 'Open the template gallery'
        }),
        e(ActionButton, {
          key: 'snapshot',
          onClick: this.captureSnapshot.bind(this, 'Manual snapshot', false),
          label: 'Snapshot',
          compact: true,
          icon: 'S',
          title: 'Capture a manual version snapshot'
        }),
        e(ActionButton, {
          key: 'versions',
          onClick: this.openVersionsModal.bind(this),
          label: 'Versions',
          compact: true,
          icon: 'V',
          title: 'Open version history and diff tools'
        }),
        e(ActionButton, {
          key: 'styles',
          onClick: this.openStyleStudio.bind(this),
          label: 'Style studio',
          compact: true,
          icon: 'C',
          title: 'Open preview themes and custom CSS controls'
        }),
        e(StatusChip, { key: 'theme', tone: 'accent' }, 'Theme ' + (this.state.previewTheme || 'studio')),
        e(StatusChip, { key: 'snapshots' }, snapshotCount + ' snapshots')
      ])
    ]);
  };

  MarkdownStudioApp.prototype.renderTemplatesModal = function () {
    var self = this;
    if (!this.state.templatesOpen) {
      return null;
    }
    return e('div', {
      className: 'modal-backdrop',
      onClick: function (event) {
        if (event.target === event.currentTarget) {
          self.closeTemplatesModal();
        }
      }
    }, e('div', { className: 'modal-card modal-card--patch4' }, [
      e('div', { key: 'header', className: 'modal-card__header' }, [
        e('div', { key: 'copy' }, [
          e('h3', { key: 'title', className: 'modal-card__title' }, 'Template gallery'),
          e('p', { key: 'subtitle', className: 'modal-card__subtitle' }, 'Load document starters or insert reusable snippets without leaving the editor.')
        ]),
        e(ActionButton, {
          key: 'close',
          onClick: this.closeTemplatesModal.bind(this),
          label: 'Close',
          compact: true,
          icon: 'X',
          title: 'Close the template gallery'
        })
      ]),
      e('div', { key: 'body', className: 'modal-card__body modal-card__body--patch4 custom-scroll' }, [
        e('div', { key: 'grid', className: 'template-grid' }, PATCH4_TEMPLATE_LIBRARY.map(function (template) {
          return e('section', { key: template.id, className: 'template-card' }, [
            e('div', { key: 'top', className: 'template-card__top' }, [
              e(StatusChip, { key: 'kind', tone: template.kind === 'document' ? 'accent' : 'success' }, template.kind === 'document' ? 'Document' : 'Snippet'),
              e('h4', { key: 'title', className: 'template-card__title' }, template.title),
              e('p', { key: 'description', className: 'template-card__description' }, template.description)
            ]),
            e('pre', { key: 'preview', className: 'template-card__preview custom-scroll' }, template.content.slice(0, 240)),
            e('div', { key: 'actions', className: 'template-card__actions' }, [
              e(ActionButton, {
                key: 'use',
                onClick: function () { self.applyTemplate(template.id); },
                label: template.kind === 'document' ? 'Load' : 'Insert',
                compact: true,
                primary: true,
                title: template.kind === 'document' ? 'Replace the current document with this template' : 'Insert this snippet at the current cursor position'
              })
            ])
          ]);
        }))
      ])
    ]));
  };

  MarkdownStudioApp.prototype.renderStyleStudioModal = function () {
    var self = this;
    if (!this.state.styleStudioOpen) {
      return null;
    }
    return e('div', {
      className: 'modal-backdrop',
      onClick: function (event) {
        if (event.target === event.currentTarget) {
          self.closeStyleStudio();
        }
      }
    }, e('div', { className: 'modal-card modal-card--patch4' }, [
      e('div', { key: 'header', className: 'modal-card__header' }, [
        e('div', { key: 'copy' }, [
          e('h3', { key: 'title', className: 'modal-card__title' }, 'Preview style studio'),
          e('p', { key: 'subtitle', className: 'modal-card__subtitle' }, 'Tune the rendered preview with theme presets, print mode, custom CSS, and lightweight math and diagram rendering.')
        ]),
        e(ActionButton, {
          key: 'close',
          onClick: this.closeStyleStudio.bind(this),
          label: 'Close',
          compact: true,
          icon: 'X',
          title: 'Close the preview style studio'
        })
      ]),
      e('div', { key: 'body', className: 'modal-card__body modal-card__body--patch4 custom-scroll' }, [
        e('div', { key: 'grid', className: 'patch4-modal-grid' }, [
          e('label', { key: 'theme', className: 'composer-field' }, [
            e('span', { key: 'label', className: 'composer-field__label' }, 'Preview theme'),
            e('select', {
              key: 'select',
              value: this.state.previewTheme || 'studio',
              onChange: this.handlePreviewThemeChange.bind(this),
              className: 'composer-select'
            }, PATCH4_PREVIEW_THEMES.map(function (item) {
              return e('option', { key: item.value, value: item.value }, item.label);
            })),
            e('span', { key: 'hint', className: 'composer-field__hint' }, 'Switch between polished preview surfaces optimized for docs, print, and night sessions.')
          ]),
          e('div', { key: 'toggles', className: 'patch4-toggle-list' }, [
            e('label', { key: 'print', className: 'patch4-toggle' }, [
              e('input', { key: 'input', type: 'checkbox', checked: !!this.state.printLayout, onChange: this.togglePrintLayout.bind(this) }),
              e('span', { key: 'text' }, 'Print layout mode')
            ]),
            e('label', { key: 'sync', className: 'patch4-toggle' }, [
              e('input', { key: 'input', type: 'checkbox', checked: !!this.state.diskSyncEnabled, onChange: this.toggleDiskSync.bind(this) }),
              e('span', { key: 'text' }, 'Auto sync to active disk file')
            ]),
            e('label', { key: 'diag', className: 'patch4-toggle' }, [
              e('input', { key: 'input', type: 'checkbox', checked: this.state.liteDiagramsEnabled !== false, onChange: this.toggleLiteDiagrams.bind(this) }),
              e('span', { key: 'text' }, 'Lightweight diagram rendering for mermaid blocks')
            ]),
            e('label', { key: 'math', className: 'patch4-toggle' }, [
              e('input', { key: 'input', type: 'checkbox', checked: this.state.liteMathEnabled !== false, onChange: this.toggleLiteMath.bind(this) }),
              e('span', { key: 'text' }, 'Lightweight inline and display math rendering')
            ])
          ]),
          e('label', { key: 'css', className: 'composer-field composer-field--full' }, [
            e('span', { key: 'label', className: 'composer-field__label' }, 'Custom preview CSS'),
            e('textarea', {
              key: 'input',
              value: this.state.customCss || '',
              onChange: this.handleCustomCssChange.bind(this),
              className: 'composer-textarea',
              placeholder: '.markdown-body h1 { letter-spacing: -0.02em; }\n.frontmatter-bar { border-color: rgba(99, 102, 241, 0.28); }'
            }),
            e('span', { key: 'hint', className: 'composer-field__hint' }, 'Applies instantly in preview and is bundled into exported HTML and PDF print views.')
          ]),
          e('div', { key: 'actions', className: 'patch4-inline-actions' }, [
            e(ActionButton, {
              key: 'reset',
              onClick: this.resetCustomCss.bind(this),
              label: 'Reset CSS',
              compact: true,
              title: 'Clear custom preview CSS'
            })
          ])
        ])
      ])
    ]));
  };

  MarkdownStudioApp.prototype.renderVersionsModal = function () {
    var self = this;
    var snapshots = patch4NormalizeSnapshots(this.state.snapshots || []);
    if (!this.state.versionsOpen) {
      return null;
    }
    return e('div', {
      className: 'modal-backdrop',
      onClick: function (event) {
        if (event.target === event.currentTarget) {
          self.closeVersionsModal();
        }
      }
    }, e('div', { className: 'modal-card modal-card--patch4 modal-card--versions' }, [
      e('div', { key: 'header', className: 'modal-card__header' }, [
        e('div', { key: 'copy' }, [
          e('h3', { key: 'title', className: 'modal-card__title' }, 'Version history'),
          e('p', { key: 'subtitle', className: 'modal-card__subtitle' }, 'Capture manual snapshots, restore older drafts, or compare a saved snapshot against the current editor state.')
        ]),
        e('div', { key: 'actions', className: 'patch4-inline-actions' }, [
          e(ActionButton, {
            key: 'capture',
            onClick: this.captureSnapshot.bind(this, 'Manual snapshot', false),
            label: 'Capture',
            compact: true,
            primary: true,
            title: 'Capture a new version snapshot'
          }),
          e(ActionButton, {
            key: 'close',
            onClick: this.closeVersionsModal.bind(this),
            label: 'Close',
            compact: true,
            icon: 'X',
            title: 'Close version history'
          })
        ])
      ]),
      e('div', { key: 'body', className: 'modal-card__body modal-card__body--patch4 custom-scroll' }, snapshots.length ? snapshots.map(function (snapshot) {
        var stats = computeStats(snapshot.markdown || '');
        return e('section', { key: snapshot.id, className: 'snapshot-card' }, [
          e('div', { key: 'top', className: 'snapshot-card__top' }, [
            e('div', { key: 'copy', className: 'snapshot-card__copy' }, [
              e('h4', { key: 'title', className: 'snapshot-card__title' }, snapshot.label),
              e('p', { key: 'meta', className: 'snapshot-card__meta' }, formatDateTime(snapshot.createdAt) + '  |  ' + stats.words + ' words  |  ' + stats.lines + ' lines')
            ]),
            e('div', { key: 'actions', className: 'snapshot-card__actions' }, [
              e(ActionButton, {
                key: 'restore',
                onClick: function () { self.restoreSnapshot(snapshot.id); },
                label: 'Restore',
                compact: true,
                title: 'Restore this snapshot into the current document'
              }),
              e(ActionButton, {
                key: 'compare',
                onClick: function () { self.openDiffFromSnapshot(snapshot.id); },
                label: 'Compare',
                compact: true,
                title: 'Compare this snapshot with the current editor state'
              }),
              e(ActionButton, {
                key: 'delete',
                onClick: function () { self.deleteSnapshot(snapshot.id); },
                label: 'Delete',
                compact: true,
                title: 'Delete this snapshot from local history'
              })
            ])
          ]),
          e('pre', { key: 'preview', className: 'snapshot-card__preview custom-scroll' }, summarizeMarkdown(snapshot.markdown || '') || 'No preview available.')
        ]);
      }) : e('div', { className: 'patch4-empty' }, [
        e('h4', { key: 'title', className: 'patch4-empty__title' }, 'No snapshots yet'),
        e('p', { key: 'subtitle', className: 'patch4-empty__subtitle' }, 'Capture your first manual snapshot or save the document to disk to create a version entry.')
      ]))
    ]));
  };

  MarkdownStudioApp.prototype.renderDiffModal = function () {
    var self = this;
    if (!this.state.diffOpen) {
      return null;
    }
    var snapshots = patch4NormalizeSnapshots(this.state.snapshots || []);
    var snapshot = null;
    var i = 0;
    for (i = 0; i < snapshots.length; i += 1) {
      if (snapshots[i].id === this.state.diffSnapshotId) {
        snapshot = snapshots[i];
        break;
      }
    }
    var rows = patch4BuildLineDiff(snapshot ? snapshot.markdown : '', this.state.markdown || '');
    var added = 0;
    var removed = 0;
    rows.forEach(function (row) {
      if (row.type === 'added') {
        added += 1;
      }
      if (row.type === 'removed') {
        removed += 1;
      }
    });

    return e('div', {
      className: 'modal-backdrop',
      onClick: function (event) {
        if (event.target === event.currentTarget) {
          self.closeDiffModal();
        }
      }
    }, e('div', { className: 'modal-card modal-card--patch4 modal-card--diff' }, [
      e('div', { key: 'header', className: 'modal-card__header' }, [
        e('div', { key: 'copy' }, [
          e('h3', { key: 'title', className: 'modal-card__title' }, 'Snapshot diff'),
          e('p', { key: 'subtitle', className: 'modal-card__subtitle' }, snapshot ? ('Comparing ' + snapshot.label + ' with the current editor state.') : 'Snapshot not found.')
        ]),
        e('div', { key: 'actions', className: 'patch4-inline-actions' }, [
          e(StatusChip, { key: 'added', tone: 'success' }, added + ' added'),
          e(StatusChip, { key: 'removed', tone: 'warning' }, removed + ' removed'),
          e(ActionButton, {
            key: 'close',
            onClick: this.closeDiffModal.bind(this),
            label: 'Close',
            compact: true,
            icon: 'X',
            title: 'Close the diff viewer'
          })
        ])
      ]),
      e('div', { key: 'body', className: 'modal-card__body modal-card__body--patch4 modal-card__body--diff custom-scroll' }, [
        e('div', { key: 'head', className: 'diff-grid diff-grid--head' }, [
          e('div', { key: 'lefthead', className: 'diff-cell diff-cell--head' }, 'Snapshot'),
          e('div', { key: 'righthead', className: 'diff-cell diff-cell--head' }, 'Current document')
        ]),
        e('div', { key: 'rows', className: 'diff-grid' }, rows.map(function (row, index) {
          return e('div', { key: index, className: cx('diff-row', row.type === 'added' ? 'is-added' : (row.type === 'removed' ? 'is-removed' : (row.type === 'changed' ? 'is-changed' : 'is-same'))) }, [
            e('div', { key: 'left', className: 'diff-cell' }, [
              e('span', { key: 'ln', className: 'diff-cell__line' }, row.leftNo || ''),
              e('code', { key: 'txt', className: 'diff-cell__code' }, row.leftText || ' ')
            ]),
            e('div', { key: 'right', className: 'diff-cell' }, [
              e('span', { key: 'ln', className: 'diff-cell__line' }, row.rightNo || ''),
              e('code', { key: 'txt', className: 'diff-cell__code' }, row.rightText || ' ')
            ])
          ]);
        }))
      ])
    ]));
  };

  MarkdownStudioApp.prototype.renderPreviewPane = function () {
    var self = this;
    var syncLabel = 'Sync ' + this.state.syncPercent + '%  |  ' + (this.state.syncSource === 'editor' ? 'Editor to preview' : 'Preview to editor');
    return e('section', {
      className: cx(
        'pane pane--preview',
        this.state.activePane === 'preview' ? 'is-active-pane' : '',
        this.state.focusMode && this.state.activePane !== 'preview' ? 'is-dimmed-pane' : ''
      )
    }, [
      e('div', {
        key: 'header',
        className: 'pane-header'
      }, [
        e('div', { key: 'titleWrap' }, [
          e('h2', { key: 'title', className: 'pane-title' }, 'Live preview'),
          e('p', { key: 'caption', className: 'pane-subtitle' }, 'Rendered HTML with syntax highlighting, frontmatter summaries, version tools, and local math and diagram rendering.')
        ]),
        e('div', { key: 'actions', className: 'pane-header-actions' }, [
          e(ToolbarButton, {
            key: 'styles',
            onClick: this.openStyleStudio.bind(this),
            label: 'Styles',
            icon: 'C',
            title: 'Open preview style studio'
          }),
          e(ToolbarButton, {
            key: 'versions',
            onClick: this.openVersionsModal.bind(this),
            label: 'Versions',
            icon: 'V',
            title: 'Open version history'
          }),
          e(ToolbarButton, {
            key: 'copy',
            onClick: this.handleCopyHtml,
            label: 'Copy HTML',
            icon: 'H',
            title: 'Copy rendered HTML to the clipboard'
          }),
          e(StatusChip, { key: 'status', tone: 'success' }, syncLabel),
          e(StatusChip, { key: 'theme' }, (this.state.previewTheme || 'studio'))
        ])
      ]),
      e('div', { key: 'meter', className: 'preview-sync-meter' },
        e('div', {
          className: 'preview-sync-meter__fill',
          style: { width: this.state.syncPercent + '%' }
        })
      ),
      e('div', {
        key: 'body',
        ref: function (node) { self.previewRef = node; },
        onScroll: this.handlePreviewScroll,
        onMouseEnter: function () { self.setActivePane('preview'); },
        onClick: function () { self.setActivePane('preview'); },
        className: 'pane-body preview-scroller custom-scroll'
      }, e('article', {
        className: cx('preview-sheet markdown-body', 'preview-theme--' + (this.state.previewTheme || 'studio'), this.state.printLayout ? 'is-print-layout' : '')
      }, [
        this.renderFrontmatterBar(),
        e('div', {
          key: 'content',
          className: 'preview-sheet__content',
          dangerouslySetInnerHTML: { __html: this.state.renderedHtml }
        })
      ]))
    ]);
  };

  MarkdownStudioApp.prototype.renderStatusBar = function () {
    var autosaveLabel = !this.state.autosaveEnabled
      ? 'Autosave off'
      : this.state.autosaveStatus === 'saving'
        ? 'Draft syncing...'
        : this.state.autosaveStatus === 'saved'
          ? 'Draft saved ' + formatTime(this.state.lastAutosavedAt)
          : this.state.autosaveStatus === 'restored'
            ? 'Draft restored'
            : this.state.autosaveStatus === 'error'
              ? 'Autosave issue'
              : 'Autosave ready';

    return e('footer', { className: 'app-statusbar' }, [
      e('div', { key: 'stats', className: 'status-cluster' }, [
        e(StatBlock, { key: 'words', label: 'Words', value: this.state.stats.words }),
        e(StatBlock, { key: 'chars', label: 'Characters', value: this.state.stats.characters }),
        e(StatBlock, { key: 'lines', label: 'Lines', value: this.state.stats.lines }),
        e(StatBlock, { key: 'read', label: 'Read time', value: this.state.stats.readingMinutes ? this.state.stats.readingMinutes + ' min' : '--' }),
        e(StatBlock, { key: 'headings', label: 'Headings', value: this.state.insights.headings || 0 })
      ]),
      e('div', { key: 'hints', className: 'status-cluster status-cluster--hints' }, [
        e(StatusChip, {
          key: 'autosave',
          tone: this.state.autosaveEnabled && this.state.autosaveStatus !== 'error' ? 'success' : 'warning'
        }, autosaveLabel),
        e(StatusChip, { key: 'sync' }, this.isPreviewVisible() ? ('Sync ' + this.state.syncPercent + '%') : (this.state.zenMode ? 'Zen editor' : 'Editor only')),
        e(StatusChip, { key: 'saved' }, this.state.lastSavedAt ? ('Disk saved ' + formatDateTime(this.state.lastSavedAt)) : 'Disk save pending'),
        e(StatusChip, { key: 'snapshots' }, ((this.state.snapshots && this.state.snapshots.length) || 0) + ' snapshots'),
        e(StatusChip, { key: 'previewTheme', tone: 'accent' }, 'Preview ' + (this.state.previewTheme || 'studio')),
        e(StatusChip, { key: 'math' }, (this.state.liteMathEnabled !== false ? 'Math on' : 'Math off') + ' / ' + (this.state.liteDiagramsEnabled !== false ? 'Diagrams on' : 'Diagrams off'))
      ])
    ]);
  };

  MarkdownStudioApp.prototype.render = function () {
    var isEditorOnly = !this.isPreviewVisible();
    var leftWidth = 'minmax(0, calc(' + this.state.splitRatio + '% - ' + (DIVIDER_WIDTH / 2) + 'px))';
    var rightWidth = 'minmax(0, calc(' + (100 - this.state.splitRatio) + '% - ' + (DIVIDER_WIDTH / 2) + 'px))';
    var paletteItems = this.getFilteredCommandItems();
    var paletteSelectedIndex = clamp(this.state.commandSelectionIndex, 0, Math.max(0, paletteItems.length - 1));

    return e('div', {
      className: cx(
        'app-shell',
        this.state.zenMode ? 'is-zen' : '',
        this.state.focusMode ? 'is-focus-mode' : '',
        this.state.activePane === 'preview' ? 'focus-preview' : 'focus-editor'
      )
    }, [
      e(HiddenFileInput, {
        key: 'hiddenInput',
        fileInputRef: function (node) { this.fileInputRef = node; }.bind(this),
        onChange: this.handleFallbackFileOpen
      }),
      e(ShortcutsModal, {
        key: 'shortcuts',
        open: this.state.shortcutsOpen,
        onClose: this.closeShortcuts
      }),
      e(CommandPaletteModal, {
        key: 'palette',
        open: this.state.commandPaletteOpen,
        inputRef: function (node) { this.commandInputRef = node; }.bind(this),
        query: this.state.commandQuery,
        onQueryChange: this.handleCommandQueryChange,
        onKeyDown: this.handleCommandPaletteKeyDown,
        items: paletteItems,
        selectedIndex: paletteSelectedIndex,
        onSelect: this.setCommandSelection,
        onRun: this.runCommandFromPalette,
        onClose: this.closeCommandPalette
      }),
      this.renderTemplatesModal(),
      this.renderVersionsModal(),
      this.renderStyleStudioModal(),
      this.renderDiffModal(),
      this.renderComposerModal(),
      e('div', { key: 'toastWrap', className: 'toast-wrap' },
        e(Toast, {
          message: this.state.toast && this.state.toast.message,
          tone: this.state.toast && this.state.toast.tone
        })
      ),
      e('div', {
        key: 'frame',
        className: 'app-frame'
      }, [
        this.renderHeader(),
        this.renderToolbar(),
        this.renderPatch4Bar(),
        e('main', {
          key: 'workspace',
          className: 'workspace-wrap'
        }, [
          e('div', {
            key: 'grid',
            ref: function (node) { this.layoutRef = node; }.bind(this),
            className: cx('workspace-grid', isEditorOnly ? 'is-editor-only' : ''),
            style: {
              gridTemplateColumns: isEditorOnly ? 'minmax(0, 1fr)' : (leftWidth + ' ' + DIVIDER_WIDTH + 'px ' + rightWidth)
            }
          }, [
            this.renderEditorPane(),
            isEditorOnly ? null : e('div', {
              key: 'divider',
              onMouseDown: this.startDividerDrag,
              className: cx('drag-divider', this.state.isDragging ? 'is-dragging' : ''),
              title: 'Drag to resize panes'
            }),
            isEditorOnly ? null : this.renderPreviewPane()
          ]),
          this.renderUtilitySidebar()
        ]),
        this.renderStatusBar()
      ])
    ]);
  };

  var PATCH5_VERSION_TOKEN = 'patch5-final';
  var PATCH5_VERSION_LABEL = 'Patch 5 · Final polish';
  var PATCH5_EDITOR_FONT_SIZES = [
    { value: '14', label: '14 px' },
    { value: '15', label: '15 px' },
    { value: '16', label: '16 px' },
    { value: '18', label: '18 px' }
  ];

  var PATCH5_RELEASE_SECTIONS = [
    {
      title: 'Final polish update',
      items: [
        'A unified settings center for writing, workspace, preview, and local storage preferences.',
        'A welcome and quick-start guide that introduces the fastest local workflows and key shortcuts.',
        'A richer stacked notification system with clearer success, warning, info, and error states.',
        'Release notes, changelog, and final QA documentation for your AI agent and manual verification.',
        'Laptop-first UI refinements, reduced-motion support, and a cleaner app header and status bar.'
      ]
    },
    {
      title: 'Patch 4 power-user layer',
      items: [
        'Template gallery for full documents and snippets.',
        'Snapshot history, restore, and side-by-side diff tools.',
        'Style studio with preview themes, print layout, and custom preview CSS.',
        'Frontmatter chips plus lightweight local math and diagram rendering.',
        'Optional automatic disk sync when a native file handle is available.'
      ]
    },
    {
      title: 'Patch 3 productivity layer',
      items: [
        'Command palette for navigation and actions.',
        'Outline, stats, and recent-session sidebar panels.',
        'Focus mode, autosave feedback, recent sessions, and improved laptop layout polish.'
      ]
    },
    {
      title: 'Patch 2 export and insert tools',
      items: [
        'Export TXT, HTML, PDF print view, and DOCX.',
        'Insert images, GIFs, file links, code blocks, tables, callouts, and date stamps.'
      ]
    },
    {
      title: 'Patch 1 editor foundation',
      items: [
        'Zen mode, preview toggle, autosave toggle, and tab size controls.',
        'Undo and redo, find and replace, current-line highlight, and jump navigation.'
      ]
    }
  ];

  function patch5ReadSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (error) {
      return {};
    }
  }

  function patch5NormalizeEditorFontSize(value) {
    var numeric = Number(value);
    if (numeric !== 14 && numeric !== 15 && numeric !== 16 && numeric !== 18) {
      return 15;
    }
    return numeric;
  }

  function patch5BuildShortcutCheatSheet() {
    var lines = ['Markdown Studio Local — keyboard shortcut cheat sheet', ''];
    SHORTCUT_GROUPS.forEach(function (group) {
      lines.push(group.title);
      group.items.forEach(function (item) {
        lines.push('- ' + item[0] + ' — ' + item[1]);
      });
      lines.push('');
    });
    return lines.join('\n');
  }

  function patch5BuildReleaseNotesSummary() {
    var lines = ['# ' + PATCH5_VERSION_LABEL, ''];
    PATCH5_RELEASE_SECTIONS.forEach(function (section) {
      lines.push('## ' + section.title);
      section.items.forEach(function (item) {
        lines.push('- ' + item);
      });
      lines.push('');
    });
    return lines.join('\n');
  }

  function patch5ToastIcon(tone) {
    if (tone === 'error') {
      return '!';
    }
    if (tone === 'warning') {
      return '!';
    }
    if (tone === 'info') {
      return 'i';
    }
    return '✓';
  }

  function patch5CreateToastId() {
    return 'toast-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  }

  function SettingsToggle(props) {
    return e('button', {
      type: 'button',
      onClick: props.onClick,
      className: cx('settings-toggle', props.active ? 'is-active' : '')
    }, props.active ? (props.onLabel || 'On') : (props.offLabel || 'Off'));
  }

  function ToastStack(props) {
    var items = props.items || [];
    if (!items.length) {
      return null;
    }
    var children = [];
    if (items.length > 1 && props.onDismissAll) {
      children.push(e('div', { key: 'tools', className: 'toast-stack__tools' }, [
        e('button', {
          key: 'clear',
          type: 'button',
          onClick: props.onDismissAll,
          className: 'toast-stack__clear'
        }, 'Clear all')
      ]));
    }
    items.forEach(function (item) {
      children.push(e('div', {
        key: item.id,
        className: cx('app-toast', 'app-toast--' + (item.tone || 'success'))
      }, [
        e('span', { key: 'icon', className: 'app-toast__icon', 'aria-hidden': 'true' }, patch5ToastIcon(item.tone)),
        e('div', { key: 'body', className: 'app-toast__body' }, [
          e('div', { key: 'message', className: 'app-toast__message' }, item.message),
          item.meta ? e('div', { key: 'meta', className: 'app-toast__meta' }, item.meta) : null
        ]),
        e('button', {
          key: 'close',
          type: 'button',
          onClick: function () { props.onDismiss(item.id); },
          className: 'app-toast__close',
          title: 'Dismiss notification'
        }, '×')
      ]));
    });
    return e('div', { className: 'toast-stack', role: 'status', 'aria-live': 'polite' }, children);
  }

  function SettingsModal(props) {
    if (!props.open) {
      return null;
    }

    function renderRow(key, title, description, controls) {
      return e('div', { key: key, className: 'settings-row' }, [
        e('div', { key: 'copy', className: 'settings-row__copy' }, [
          e('h4', { key: 'title', className: 'settings-row__title' }, title),
          e('p', { key: 'description', className: 'settings-row__description' }, description)
        ]),
        e('div', { key: 'controls', className: 'settings-row__controls' }, controls)
      ]);
    }

    function renderSelect(value, onChange, options, title) {
      return e('select', {
        value: String(value),
        onChange: onChange,
        title: title,
        className: 'toolbar-select settings-select'
      }, options.map(function (option) {
        return e('option', { key: option.value, value: option.value }, option.label);
      }));
    }

    return e('div', {
      className: 'modal-backdrop',
      onClick: function (event) {
        if (event.target === event.currentTarget) {
          props.onClose();
        }
      }
    }, e('div', { className: 'modal-card modal-card--settings' }, [
      e('div', { key: 'header', className: 'modal-card__header' }, [
        e('div', { key: 'copy' }, [
          e('h3', { key: 'title', className: 'modal-card__title' }, 'Workspace settings'),
          e('p', { key: 'subtitle', className: 'modal-card__subtitle' }, 'Everything below stays local in this browser. Adjust writing, preview, motion, and workspace preferences without leaving the app.')
        ]),
        e(ActionButton, {
          key: 'close',
          onClick: props.onClose,
          label: 'Close',
          compact: true,
          icon: '✕',
          title: 'Close settings'
        })
      ]),
      e('div', { key: 'hero', className: 'settings-hero' }, [
        e(StatusChip, { key: 'local', tone: 'accent' }, 'Fully local preferences'),
        e(StatusChip, { key: 'version' }, PATCH5_VERSION_LABEL),
        e(StatusChip, { key: 'font' }, 'Editor ' + props.editorFontSize + ' px')
      ]),
      e('div', { key: 'body', className: 'modal-card__body modal-card__body--settings custom-scroll' }, [
        e('div', { key: 'grid', className: 'settings-grid' }, [
          e('section', { key: 'writing', className: 'settings-section' }, [
            e('h4', { key: 'title', className: 'settings-section__title' }, 'Writing'),
            renderRow('autosave', 'Autosave draft', 'Store your current markdown in local browser storage while you type.',
              e(SettingsToggle, { active: props.autosaveEnabled, onClick: props.onToggleAutosave, onLabel: 'Enabled', offLabel: 'Disabled' })
            ),
            renderRow('wrap', 'Word wrap', 'Wrap long lines in the editor without affecting the actual markdown content.',
              e(SettingsToggle, { active: props.wrapEnabled, onClick: props.onToggleWrap, onLabel: 'Wrapped', offLabel: 'No wrap' })
            ),
            renderRow('tabs', 'Tab size', 'Control how much indentation is inserted for tab and shift-tab actions.',
              renderSelect(props.tabSize, props.onTabSizeChange, [
                { value: '2', label: '2 spaces' },
                { value: '4', label: '4 spaces' },
                { value: '8', label: '8 spaces' }
              ], 'Choose editor tab size')
            ),
            renderRow('font', 'Editor font size', 'Tune the markdown editor for denser screens or more comfortable reading.',
              renderSelect(props.editorFontSize, props.onEditorFontSizeChange, PATCH5_EDITOR_FONT_SIZES, 'Choose editor font size')
            )
          ]),
          e('section', { key: 'workspace', className: 'settings-section' }, [
            e('h4', { key: 'title', className: 'settings-section__title' }, 'Workspace'),
            renderRow('preview', 'Live preview pane', 'Keep the right preview visible for split view or hide it for editor-first work.',
              e(SettingsToggle, { active: props.previewVisible, onClick: props.onTogglePreview, onLabel: 'Visible', offLabel: 'Hidden' })
            ),
            renderRow('zen', 'Zen mode', 'Collapse secondary chrome and stretch the editor across the full workspace.',
              e(SettingsToggle, { active: props.zenMode, onClick: props.onToggleZen, onLabel: 'Enabled', offLabel: 'Disabled' })
            ),
            renderRow('focus', 'Focus mode', 'Dim the inactive side of the workspace and keep attention on the active pane.',
              e(SettingsToggle, { active: props.focusMode, onClick: props.onToggleFocus, onLabel: 'Enabled', offLabel: 'Disabled' })
            ),
            renderRow('theme', 'App theme', 'Switch the full interface between light and dark chrome.',
              e(ActionButton, {
                onClick: props.onThemeToggle,
                label: props.theme === 'dark' ? 'Use light theme' : 'Use dark theme',
                compact: true,
                icon: props.theme === 'dark' ? '☀' : '☾'
              })
            ),
            renderRow('accent', 'Accent preset', 'Pick the main accent color used throughout the interface.',
              renderSelect(props.themePreset, props.onThemePresetChange, THEME_PRESETS, 'Choose accent preset')
            )
          ]),
          e('section', { key: 'preview', className: 'settings-section' }, [
            e('h4', { key: 'title', className: 'settings-section__title' }, 'Preview and export'),
            renderRow('previewTheme', 'Preview theme', 'Set the rendered document style used inside the preview and HTML export.',
              renderSelect(props.previewTheme, props.onPreviewThemeChange, PATCH4_PREVIEW_THEMES, 'Choose preview theme')
            ),
            renderRow('print', 'Print layout', 'Wrap the preview in a paper-like sheet for cleaner print and PDF output.',
              e(SettingsToggle, { active: props.printLayout, onClick: props.onTogglePrintLayout, onLabel: 'Paper', offLabel: 'Fluid' })
            ),
            renderRow('math', 'Lightweight math', 'Render simple inline and display math expressions locally inside the preview.',
              e(SettingsToggle, { active: props.liteMathEnabled, onClick: props.onToggleLiteMath, onLabel: 'Enabled', offLabel: 'Disabled' })
            ),
            renderRow('diagrams', 'Lightweight diagrams', 'Render simple mermaid-style flowcharts locally inside the preview.',
              e(SettingsToggle, { active: props.liteDiagramsEnabled, onClick: props.onToggleLiteDiagrams, onLabel: 'Enabled', offLabel: 'Disabled' })
            ),
            renderRow('diskSync', 'Automatic disk sync', 'When native file access is available, save changes back to the opened file automatically.',
              e(SettingsToggle, { active: props.diskSyncEnabled, onClick: props.onToggleDiskSync, onLabel: 'Enabled', offLabel: 'Disabled' })
            )
          ]),
          e('section', { key: 'help', className: 'settings-section' }, [
            e('h4', { key: 'title', className: 'settings-section__title' }, 'Help and polish'),
            renderRow('motion', 'Reduced motion', 'Tone down transitions and animated chrome for a steadier workspace.',
              e(SettingsToggle, { active: props.reduceMotion, onClick: props.onToggleReduceMotion, onLabel: 'Reduced', offLabel: 'Standard' })
            ),
            renderRow('guide', 'Quick start guide', 'Reopen the launch guide with the best workflow tips, phases, and quick actions.',
              e(ActionButton, { onClick: props.onOpenWelcome, label: 'Open guide', compact: true, icon: '➜' })
            ),
            renderRow('shortcuts', 'Shortcut cheat sheet', 'Review the full in-app keyboard reference or copy it to the clipboard.',
              e('div', { className: 'settings-actions' }, [
                e(ActionButton, { key: 'sheet', onClick: props.onOpenShortcuts, label: 'Open sheet', compact: true, icon: '⌨' }),
                e(ActionButton, { key: 'copy', onClick: props.onCopyShortcuts, label: 'Copy', compact: true, icon: '⧉' })
              ])
            ),
            renderRow('updates', 'Release notes', 'See everything added across patches 1 through 7 and copy the summary.',
              e('div', { className: 'settings-actions' }, [
                e(ActionButton, { key: 'view', onClick: props.onOpenReleaseNotes, label: 'View updates', compact: true, icon: '✦' }),
                e(ActionButton, { key: 'copy', onClick: props.onCopyReleaseNotes, label: 'Copy summary', compact: true, icon: '⧉' })
              ])
            )
          ]),
          e('section', { key: 'cleanup', className: 'settings-section settings-section--danger' }, [
            e('h4', { key: 'title', className: 'settings-section__title' }, 'Cleanup and reset'),
            renderRow('reset', 'Reset workspace preferences', 'Return layout, theme, preview, and writing settings to the default polished state.',
              e(ActionButton, { onClick: props.onResetWorkspace, label: 'Reset preferences', compact: true, icon: '↺' })
            ),
            renderRow('recents', 'Clear recent sessions', 'Remove the browser-side recent session list without touching the current document.',
              e(ActionButton, { onClick: props.onClearRecents, label: 'Clear recents', compact: true, icon: '⌫' })
            ),
            renderRow('snapshots', 'Clear version snapshots', 'Delete all locally stored snapshots for the current browser workspace.',
              e(ActionButton, { onClick: props.onClearSnapshots, label: 'Clear snapshots', compact: true, icon: '🗑' })
            )
          ])
        ])
      ]),
      e('div', { key: 'footer', className: 'modal-card__footer' }, [
        e(StatusChip, { key: 'hint', tone: 'accent' }, 'Tip: press Ctrl/Cmd + , to reopen settings quickly'),
        e('div', { key: 'actions', className: 'settings-actions' }, [
          e(ActionButton, { key: 'guide', onClick: props.onOpenWelcome, label: 'Guide', compact: true, icon: '➜' }),
          e(ActionButton, { key: 'done', onClick: props.onClose, label: 'Done', compact: true, primary: true, icon: '✓' })
        ])
      ])
    ]));
  }

  function WelcomeModal(props) {
    if (!props.open) {
      return null;
    }

    var quickShortcuts = [
      ['Ctrl/Cmd + P', 'Command palette'],
      ['Ctrl/Cmd + S', 'Save to disk'],
      ['Ctrl/Cmd + /', 'Toggle zen mode'],
      ['Ctrl/Cmd + ,', 'Open settings'],
      ['F1', 'Shortcut sheet'],
      ['Tab / Shift + Tab', 'Indent and outdent']
    ];

    return e('div', {
      className: 'modal-backdrop',
      onClick: function (event) {
        if (event.target === event.currentTarget) {
          props.onClose();
        }
      }
    }, e('div', { className: 'modal-card modal-card--welcome' }, [
      e('div', { key: 'header', className: 'modal-card__header modal-card__header--welcome' }, [
        e('div', { key: 'copy' }, [
          e('div', { key: 'eyebrow', className: 'welcome-eyebrow' }, PATCH5_VERSION_LABEL),
          e('h3', { key: 'title', className: 'modal-card__title welcome-title' }, 'Welcome to the final local markdown studio'),
          e('p', { key: 'subtitle', className: 'modal-card__subtitle welcome-subtitle' }, 'This polished build keeps the editor fully local while giving you a cleaner launch flow, stronger settings, richer notifications, and better agent-facing release docs.')
        ]),
        e(ActionButton, {
          key: 'close',
          onClick: props.onClose,
          label: 'Close',
          compact: true,
          icon: '✕',
          title: 'Close quick start guide'
        })
      ]),
      e('div', { key: 'body', className: 'modal-card__body modal-card__body--welcome custom-scroll' }, [
        e('section', { key: 'hero', className: 'welcome-hero' }, [
          e('div', { key: 'left', className: 'welcome-panel welcome-panel--primary' }, [
            e('div', { key: 'chips', className: 'welcome-chip-row' }, [
              e(StatusChip, { key: 'local', tone: 'success' }, 'Fully local'),
              e(StatusChip, { key: 'split' }, 'Split editor + preview'),
              e(StatusChip, { key: 'power', tone: 'accent' }, 'Patches 1–5 merged')
            ]),
            e('h4', { key: 'stepsTitle', className: 'welcome-section-title' }, 'Best workflow to start fast'),
            e('ol', { key: 'steps', className: 'welcome-steps' }, [
              e('li', { key: '1' }, 'Open a file or start from a template. The app can use native file handles when available.'),
              e('li', { key: '2' }, 'Write on the left, review on the right, then switch to focus or zen mode whenever you need less chrome.'),
              e('li', { key: '3' }, 'Use the command palette, outline, versions, and style studio to move faster without leaving the keyboard.'),
              e('li', { key: '4' }, 'Export to TXT, HTML, PDF, or DOCX and keep snapshots for version safety.'),
              e('li', { key: '5' }, 'Use the new settings center whenever you want to tune motion, font size, preview themes, or workspace defaults.')
            ])
          ]),
          e('div', { key: 'right', className: 'welcome-panel' }, [
            e('h4', { key: 'shortcutsTitle', className: 'welcome-section-title' }, 'Quick shortcut cheat sheet'),
            e('div', { key: 'shortcuts', className: 'welcome-shortcuts' }, quickShortcuts.map(function (item) {
              return e('div', { key: item[0], className: 'welcome-shortcut' }, [
                e('kbd', { key: 'key', className: 'shortcut-item__key' }, item[0]),
                e('span', { key: 'label', className: 'welcome-shortcut__label' }, item[1])
              ]);
            })),
            e('div', { key: 'help', className: 'welcome-note' }, 'Tip: press F1 for the full keyboard sheet or Ctrl/Cmd + P to search commands instantly.')
          ])
        ]),
        e('section', { key: 'patches', className: 'welcome-feature-grid' }, [
          e('article', { key: 'editing', className: 'welcome-feature-card' }, [
            e('h4', { key: 'title', className: 'welcome-feature-card__title' }, 'Editing power'),
            e('p', { key: 'copy', className: 'welcome-feature-card__copy' }, 'Undo, redo, find and replace, media insertion, tab sizing, autosave, and calm laptop-friendly layout tuning are already built in.')
          ]),
          e('article', { key: 'productivity', className: 'welcome-feature-card' }, [
            e('h4', { key: 'title', className: 'welcome-feature-card__title' }, 'Productivity tools'),
            e('p', { key: 'copy', className: 'welcome-feature-card__copy' }, 'Use the outline, stats, recent sessions, command palette, snapshots, diff tools, and style studio without any backend service.')
          ]),
          e('article', { key: 'final', className: 'welcome-feature-card' }, [
            e('h4', { key: 'title', className: 'welcome-feature-card__title' }, 'Final polish'),
            e('p', { key: 'copy', className: 'welcome-feature-card__copy' }, 'The last update adds a quick-start guide, better notifications, a central settings panel, reduced motion support, and agent-ready release docs.')
          ])
        ])
      ]),
      e('div', { key: 'footer', className: 'modal-card__footer modal-card__footer--welcome' }, [
        e('div', { key: 'left', className: 'settings-actions' }, [
          e(ActionButton, { key: 'templates', onClick: props.onTemplates, label: 'Templates', compact: true, icon: '◇' }),
          e(ActionButton, { key: 'shortcuts', onClick: props.onShortcuts, label: 'Shortcuts', compact: true, icon: '⌨' }),
          e(ActionButton, { key: 'settings', onClick: props.onSettings, label: 'Settings', compact: true, icon: '⚙' }),
          e(ActionButton, { key: 'updates', onClick: props.onReleaseNotes, label: 'Updates', compact: true, icon: '✦' })
        ]),
        e(ActionButton, { key: 'start', onClick: props.onClose, label: 'Start writing', compact: true, primary: true, icon: '→' })
      ])
    ]));
  }

  function ReleaseNotesModal(props) {
    if (!props.open) {
      return null;
    }

    return e('div', {
      className: 'modal-backdrop',
      onClick: function (event) {
        if (event.target === event.currentTarget) {
          props.onClose();
        }
      }
    }, e('div', { className: 'modal-card modal-card--release' }, [
      e('div', { key: 'header', className: 'modal-card__header' }, [
        e('div', { key: 'copy' }, [
          e('h3', { key: 'title', className: 'modal-card__title' }, 'Release notes and patch history'),
          e('p', { key: 'subtitle', className: 'modal-card__subtitle' }, 'Everything shipped across patches 1 through 5, including the final polish update and the supporting files your agent can use while merging changes.')
        ]),
        e(ActionButton, {
          key: 'close',
          onClick: props.onClose,
          label: 'Close',
          compact: true,
          icon: '✕',
          title: 'Close release notes'
        })
      ]),
      e('div', { key: 'hero', className: 'settings-hero' }, [
        e(StatusChip, { key: 'version', tone: 'accent' }, PATCH5_VERSION_LABEL),
        e(StatusChip, { key: 'history' }, 'Patch series complete'),
        e(StatusChip, { key: 'local', tone: 'success' }, 'No backend required')
      ]),
      e('div', { key: 'body', className: 'modal-card__body modal-card__body--release custom-scroll' },
        PATCH5_RELEASE_SECTIONS.map(function (section) {
          return e('section', { key: section.title, className: 'release-section' }, [
            e('h4', { key: 'title', className: 'release-section__title' }, section.title),
            e('ul', { key: 'items', className: 'release-section__list' }, section.items.map(function (item) {
              return e('li', { key: item, className: 'release-section__item' }, item);
            }))
          ]);
        })
      ),
      e('div', { key: 'footer', className: 'modal-card__footer' }, [
        e('div', { key: 'left', className: 'settings-actions' }, [
          e(ActionButton, { key: 'copy', onClick: props.onCopy, label: 'Copy summary', compact: true, icon: '⧉' }),
          e(ActionButton, { key: 'template', onClick: props.onLoadReleaseTemplate, label: 'Load release notes template', compact: true, icon: '◇' })
        ]),
        e(ActionButton, { key: 'done', onClick: props.onClose, label: 'Done', compact: true, primary: true, icon: '✓' })
      ])
    ]));
  }

  SHORTCUT_GROUPS[0].items.push(['Ctrl/Cmd + ,', 'Open workspace settings']);

  PATCH4_TEMPLATE_LIBRARY.unshift({
    id: 'final-qa-checklist',
    kind: 'document',
    title: 'Final QA checklist',
    description: 'A final merged-build verification sheet for the local markdown studio.',
    fileName: 'final-qa-checklist.md',
    content: [
      '---',
      'title: Final QA checklist',
      'owner: Local app review',
      'status: Draft',
      'tags: [qa, validation, release]',
      '---',
      '',
      '# Final QA checklist',
      '',
      '## Core workspace',
      '',
      '- [ ] Editor is on the left and preview is on the right',
      '- [ ] Live preview updates while typing',
      '- [ ] Synced scrolling works both ways',
      '- [ ] Laptop layout feels stable at common widths',
      '',
      '## Editing and inserts',
      '',
      '- [ ] Toolbar actions insert at the cursor',
      '- [ ] Find and replace works',
      '- [ ] Image, GIF, file, table, code, and callout inserts all render correctly',
      '',
      '## Files and exports',
      '',
      '- [ ] Native open/save works when served on localhost',
      '- [ ] TXT, HTML, PDF, and DOCX exports complete successfully',
      '',
      '## Power features',
      '',
      '- [ ] Command palette, outline, recents, snapshots, diff, and style studio all open correctly',
      '- [ ] Settings, quick start, release notes, and notification stack work as expected'
    ].join('\n')
  });

  var patch5BaseComponentDidMount = MarkdownStudioApp.prototype.componentDidMount;
  var patch5BaseComponentDidUpdate = MarkdownStudioApp.prototype.componentDidUpdate;
  var patch5BaseComponentWillUnmount = MarkdownStudioApp.prototype.componentWillUnmount;
  var patch5BasePersistLocalState = MarkdownStudioApp.prototype.persistLocalState;
  var patch5BaseGetCommandItems = MarkdownStudioApp.prototype.getCommandItems;

  MarkdownStudioApp.prototype.componentDidMount = function () {
    patch5BaseComponentDidMount.call(this);
    if (!this._patch5Bootstrapped) {
      var persisted = patch5ReadSettings();
      this._patch5Bootstrapped = true;
      this.toastTimers = {};
      var welcomeSeenVersion = typeof persisted.welcomeSeenVersion === 'string' ? persisted.welcomeSeenVersion : '';
      var shouldOpenWelcome = welcomeSeenVersion !== PATCH5_VERSION_TOKEN;
      this.setState({
        settingsOpen: false,
        welcomeOpen: shouldOpenWelcome,
        releaseNotesOpen: false,
        releaseNotesSeenVersion: typeof persisted.releaseNotesSeenVersion === 'string' ? persisted.releaseNotesSeenVersion : '',
        welcomeSeenVersion: welcomeSeenVersion,
        editorFontSize: patch5NormalizeEditorFontSize(persisted.editorFontSize),
        reduceMotion: !!persisted.reduceMotion,
        toasts: []
      });
    }
  };

  MarkdownStudioApp.prototype.componentDidUpdate = function (prevProps, prevState) {
    patch5BaseComponentDidUpdate.call(this, prevProps, prevState);
    if (
      prevState.editorFontSize !== this.state.editorFontSize ||
      prevState.reduceMotion !== this.state.reduceMotion ||
      prevState.welcomeSeenVersion !== this.state.welcomeSeenVersion ||
      prevState.releaseNotesSeenVersion !== this.state.releaseNotesSeenVersion
    ) {
      this.schedulePersistLocalState();
    }
  };

  MarkdownStudioApp.prototype.componentWillUnmount = function () {
    var key = null;
    if (this.toastTimers) {
      for (key in this.toastTimers) {
        if (Object.prototype.hasOwnProperty.call(this.toastTimers, key)) {
          window.clearTimeout(this.toastTimers[key]);
        }
      }
      this.toastTimers = {};
    }
    patch5BaseComponentWillUnmount.call(this);
  };

  MarkdownStudioApp.prototype.persistLocalState = function () {
    patch5BasePersistLocalState.call(this);
    try {
      var payload = patch5ReadSettings();
      payload.editorFontSize = this.state.editorFontSize || 15;
      payload.reduceMotion = !!this.state.reduceMotion;
      payload.welcomeSeenVersion = this.state.welcomeSeenVersion || '';
      payload.releaseNotesSeenVersion = this.state.releaseNotesSeenVersion || '';
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.warn('Unable to persist final polish settings.', error);
    }
  };

  MarkdownStudioApp.prototype.showToast = function (message, tone, options) {
    var self = this;
    var toast = {
      id: patch5CreateToastId(),
      message: String(message || ''),
      tone: tone || 'success',
      meta: options && options.meta ? String(options.meta) : ''
    };
    var duration = options && options.duration ? Number(options.duration) : ((tone === 'error' || tone === 'warning') ? 4200 : 2600);
    this.toastTimers = this.toastTimers || {};
    this.setState(function (prevState) {
      var nextToasts = (prevState.toasts || []).slice(-3);
      nextToasts.push(toast);
      return {
        toast: toast,
        toasts: nextToasts
      };
    });
    this.toastTimers[toast.id] = window.setTimeout(function () {
      self.dismissToast(toast.id);
    }, duration);
  };

  MarkdownStudioApp.prototype.dismissToast = function (toastId) {
    var key = null;
    this.toastTimers = this.toastTimers || {};
    if (!toastId) {
      for (key in this.toastTimers) {
        if (Object.prototype.hasOwnProperty.call(this.toastTimers, key)) {
          window.clearTimeout(this.toastTimers[key]);
        }
      }
      this.toastTimers = {};
      this.setState({ toast: null, toasts: [] });
      return;
    }

    if (this.toastTimers[toastId]) {
      window.clearTimeout(this.toastTimers[toastId]);
      delete this.toastTimers[toastId];
    }

    this.setState(function (prevState) {
      var nextToasts = (prevState.toasts || []).filter(function (item) {
        return item.id !== toastId;
      });
      return {
        toast: nextToasts.length ? nextToasts[nextToasts.length - 1] : null,
        toasts: nextToasts
      };
    });
  };

  MarkdownStudioApp.prototype.openSettings = function () {
    this.setState({ settingsOpen: true });
  };

  MarkdownStudioApp.prototype.closeSettings = function () {
    this.setState({ settingsOpen: false });
  };

  MarkdownStudioApp.prototype.openWelcomeModal = function () {
    this.setState({ welcomeOpen: true });
  };

  MarkdownStudioApp.prototype.closeWelcomeModal = function () {
    this.setState({
      welcomeOpen: false,
      welcomeSeenVersion: PATCH5_VERSION_TOKEN
    });
  };

  MarkdownStudioApp.prototype.openReleaseNotesModal = function () {
    this.setState({ releaseNotesOpen: true });
  };

  MarkdownStudioApp.prototype.closeReleaseNotesModal = function () {
    this.setState({
      releaseNotesOpen: false,
      releaseNotesSeenVersion: PATCH5_VERSION_TOKEN
    });
  };

  MarkdownStudioApp.prototype.handleEditorFontSizeChange = function (event) {
    this.setState({ editorFontSize: patch5NormalizeEditorFontSize(event.target.value) });
  };

  MarkdownStudioApp.prototype.toggleReduceMotion = function () {
    this.setState({ reduceMotion: !this.state.reduceMotion });
  };

  MarkdownStudioApp.prototype.copyShortcutCheatSheet = function () {
    var self = this;
    copyTextToClipboard(patch5BuildShortcutCheatSheet())
      .then(function () {
        self.showToast('Shortcut cheat sheet copied.', 'success');
      })
      .catch(function () {
        self.showToast('Unable to copy the shortcut cheat sheet.', 'error');
      });
  };

  MarkdownStudioApp.prototype.copyReleaseNotesSummary = function () {
    var self = this;
    copyTextToClipboard(patch5BuildReleaseNotesSummary())
      .then(function () {
        self.showToast('Release notes summary copied.', 'success');
      })
      .catch(function () {
        self.showToast('Unable to copy release notes.', 'error');
      });
  };

  MarkdownStudioApp.prototype.clearAllSnapshots = function () {
    if (!(this.state.snapshots && this.state.snapshots.length)) {
      this.showToast('There are no snapshots to clear.', 'info');
      return;
    }
    if (!window.confirm('Clear all local snapshots for this workspace?')) {
      return;
    }
    this.setState({ snapshots: [] });
    this.showToast('Cleared all local snapshots.', 'success');
  };

  MarkdownStudioApp.prototype.resetWorkspacePreferences = function () {
    if (!window.confirm('Reset workspace preferences to the polished default set?')) {
      return;
    }
    this.setState({
      theme: 'light',
      themePreset: 'sky',
      splitRatio: 50,
      wrapEnabled: false,
      autosaveEnabled: true,
      showPreview: true,
      zenMode: false,
      focusMode: false,
      tabSize: 2,
      utilitySidebarOpen: false,
      utilitySidebarTab: 'outline',
      previewTheme: 'studio',
      customCss: '',
      printLayout: false,
      diskSyncEnabled: false,
      liteDiagramsEnabled: true,
      liteMathEnabled: true,
      editorFontSize: 15,
      reduceMotion: false,
      settingsOpen: false
    });
    this.showToast('Workspace preferences reset.', 'success');
  };

  MarkdownStudioApp.prototype.getCommandItems = function () {
    var self = this;
    var baseItems = patch5BaseGetCommandItems.call(this);
    return baseItems.concat([
      { id: 'settings', group: 'Tools', title: 'Open workspace settings', subtitle: 'Adjust writing, preview, motion, and local storage preferences', shortcut: 'Ctrl/Cmd + ,', keywords: 'settings preferences workspace final polish', run: function () { self.openSettings(); } },
      { id: 'guide', group: 'Tools', title: 'Open quick start guide', subtitle: 'Show the welcome and workflow guide again', keywords: 'guide welcome quick start help', run: function () { self.openWelcomeModal(); } },
      { id: 'updates', group: 'Tools', title: 'Open release notes', subtitle: 'See the patch history and final polish notes', keywords: 'release notes changelog updates patch history', run: function () { self.openReleaseNotesModal(); } },
      { id: 'copyShortcuts', group: 'Tools', title: 'Copy shortcut cheat sheet', subtitle: 'Copy the in-app keyboard reference', keywords: 'copy shortcuts cheat sheet keyboard', run: function () { self.copyShortcutCheatSheet(); } },
      { id: 'copyReleaseNotes', group: 'Tools', title: 'Copy release notes summary', subtitle: 'Copy the merged patch history as markdown', keywords: 'copy release notes summary changelog', run: function () { self.copyReleaseNotesSummary(); } },
      { id: 'templates', group: 'Tools', title: 'Open templates', subtitle: 'Browse starter documents and snippets', keywords: 'templates snippets starter', run: function () { self.openTemplatesModal(); } },
      { id: 'resetWorkspace', group: 'Tools', title: 'Reset workspace preferences', subtitle: 'Restore the polished default settings', keywords: 'reset preferences defaults', run: function () { self.resetWorkspacePreferences(); } }
    ]);
  };

  var patch5BaseHandleKeyDown = MarkdownStudioApp.prototype.handleKeyDown;
  MarkdownStudioApp.prototype.handleKeyDown = function (event) {
    if ((event.metaKey || event.ctrlKey) && String(event.key || '') === ',') {
      maybePreventDefault(event);
      this.openSettings();
      return;
    }
    return patch5BaseHandleKeyDown.call(this, event);
  };

  MarkdownStudioApp.prototype.renderSettingsModal = function () {
    return e(SettingsModal, {
      open: !!this.state.settingsOpen,
      onClose: this.closeSettings.bind(this),
      autosaveEnabled: this.state.autosaveEnabled,
      onToggleAutosave: this.toggleAutosave,
      wrapEnabled: this.state.wrapEnabled,
      onToggleWrap: this.toggleWrap,
      tabSize: this.state.tabSize,
      onTabSizeChange: this.handleTabSizeChange,
      editorFontSize: this.state.editorFontSize || 15,
      onEditorFontSizeChange: this.handleEditorFontSizeChange.bind(this),
      previewVisible: !!this.state.showPreview,
      onTogglePreview: this.togglePreview,
      zenMode: this.state.zenMode,
      onToggleZen: this.toggleZenMode,
      focusMode: this.state.focusMode,
      onToggleFocus: this.toggleFocusMode,
      theme: this.state.theme,
      onThemeToggle: this.handleThemeToggle,
      themePreset: this.state.themePreset,
      onThemePresetChange: this.handleThemePresetChange,
      previewTheme: this.state.previewTheme || 'studio',
      onPreviewThemeChange: this.handlePreviewThemeChange.bind(this),
      printLayout: !!this.state.printLayout,
      onTogglePrintLayout: this.togglePrintLayout.bind(this),
      liteMathEnabled: this.state.liteMathEnabled !== false,
      onToggleLiteMath: this.toggleLiteMath.bind(this),
      liteDiagramsEnabled: this.state.liteDiagramsEnabled !== false,
      onToggleLiteDiagrams: this.toggleLiteDiagrams.bind(this),
      diskSyncEnabled: !!this.state.diskSyncEnabled,
      onToggleDiskSync: this.toggleDiskSync.bind(this),
      reduceMotion: !!this.state.reduceMotion,
      onToggleReduceMotion: this.toggleReduceMotion.bind(this),
      onOpenWelcome: function () {
        this.openWelcomeModal();
        this.closeSettings();
      }.bind(this),
      onOpenShortcuts: function () {
        this.openShortcuts();
        this.closeSettings();
      }.bind(this),
      onCopyShortcuts: this.copyShortcutCheatSheet.bind(this),
      onOpenReleaseNotes: function () {
        this.openReleaseNotesModal();
        this.closeSettings();
      }.bind(this),
      onCopyReleaseNotes: this.copyReleaseNotesSummary.bind(this),
      onResetWorkspace: this.resetWorkspacePreferences.bind(this),
      onClearRecents: this.clearRecentDocuments,
      onClearSnapshots: this.clearAllSnapshots.bind(this)
    });
  };

  MarkdownStudioApp.prototype.renderWelcomeModal = function () {
    return e(WelcomeModal, {
      open: !!this.state.welcomeOpen,
      onClose: this.closeWelcomeModal.bind(this),
      onTemplates: function () {
        this.closeWelcomeModal();
        this.openTemplatesModal();
      }.bind(this),
      onShortcuts: function () {
        this.closeWelcomeModal();
        this.openShortcuts();
      }.bind(this),
      onSettings: function () {
        this.closeWelcomeModal();
        this.openSettings();
      }.bind(this),
      onReleaseNotes: function () {
        this.closeWelcomeModal();
        this.openReleaseNotesModal();
      }.bind(this)
    });
  };

  MarkdownStudioApp.prototype.renderReleaseNotesModal = function () {
    return e(ReleaseNotesModal, {
      open: !!this.state.releaseNotesOpen,
      onClose: this.closeReleaseNotesModal.bind(this),
      onCopy: this.copyReleaseNotesSummary.bind(this),
      onLoadReleaseTemplate: function () {
        this.closeReleaseNotesModal();
        this.applyTemplate('release-notes');
      }.bind(this)
    });
  };

  MarkdownStudioApp.prototype.renderHeader = function () {
    var viewMode = this.state.zenMode ? 'Zen mode' : (this.isPreviewVisible() ? 'Split view' : 'Editor only');
    var autosaveLabel = !this.state.autosaveEnabled
      ? 'Autosave off'
      : this.state.autosaveStatus === 'saving'
        ? 'Draft syncing...'
        : this.state.autosaveStatus === 'saved'
          ? 'Draft saved ' + formatTime(this.state.lastAutosavedAt)
          : this.state.autosaveStatus === 'restored'
            ? 'Draft restored'
            : this.state.autosaveStatus === 'error'
              ? 'Autosave issue'
              : 'Autosave ready';
    var presetLabel = this.state.themePreset;
    var i = 0;

    for (i = 0; i < THEME_PRESETS.length; i += 1) {
      if (THEME_PRESETS[i].value === this.state.themePreset) {
        presetLabel = THEME_PRESETS[i].label;
        break;
      }
    }

    return e('header', { className: 'app-topbar' }, [
      e('div', { key: 'brand', className: 'app-brand' }, [
        e('div', { key: 'logo', className: 'brand-logo' }, 'M'),
        e('div', { key: 'copy', className: 'brand-copy' }, [
          e('div', { key: 'titleRow', className: 'brand-title-row' }, [
            e('h1', { key: 'title', className: 'brand-title' }, 'Markdown Studio Local'),
            e(StatusChip, { key: 'version', tone: 'accent' }, PATCH5_VERSION_LABEL),
            e(StatusChip, {
              key: 'mode',
              tone: this.state.isFsApiAvailable ? 'success' : 'warning'
            }, this.state.isFsApiAvailable ? 'Native file access' : 'Download save mode')
          ]),
          e('p', { key: 'subtitle', className: 'brand-subtitle' }, 'The final polish update adds a unified settings center, quick-start guide, richer notifications, reduced-motion support, and agent-friendly release docs while keeping the whole editor fully local and laptop-friendly.'),
          e('div', { key: 'meta', className: 'brand-meta' }, [
            e(StatusChip, { key: 'filename', tone: 'accent' }, this.state.fileName),
            e(StatusChip, { key: 'dirty', tone: this.state.dirty ? 'warning' : 'success' }, this.state.dirty ? 'Unsaved disk changes' : 'Disk copy saved'),
            e(StatusChip, { key: 'saved' }, 'Last save ' + formatTime(this.state.lastSavedAt)),
            e(StatusChip, { key: 'autosave', tone: this.state.autosaveEnabled && this.state.autosaveStatus !== 'error' ? 'success' : 'warning' }, autosaveLabel),
            e(StatusChip, { key: 'view' }, viewMode),
            e(StatusChip, { key: 'preset' }, presetLabel),
            e(StatusChip, { key: 'font' }, 'Editor ' + (this.state.editorFontSize || 15) + ' px'),
            this.state.reduceMotion ? e(StatusChip, { key: 'motion' }, 'Reduced motion') : null
          ])
        ])
      ]),
      e('div', { key: 'actions', className: 'topbar-actions' }, [
        e(ActionButton, { key: 'new', onClick: this.handleNewDocument, label: 'New', compact: true, icon: '＋', title: 'Create a new markdown document (Ctrl/Cmd + N)' }),
        e(ActionButton, { key: 'open', onClick: this.handleOpenFile, label: 'Open', compact: true, icon: '↥', title: 'Open a markdown file (Ctrl/Cmd + O)' }),
        e(ActionButton, { key: 'save', onClick: this.handleSaveFile, label: 'Save', compact: true, primary: true, icon: '💾', title: 'Save current document (Ctrl/Cmd + S)' }),
        e(ActionButton, { key: 'palette', onClick: this.openCommandPalette, label: 'Palette', compact: true, icon: '⌘', title: 'Open command palette (Ctrl/Cmd + P)' }),
        e(ActionButton, { key: 'guide', onClick: this.openWelcomeModal.bind(this), label: 'Guide', compact: true, icon: '➜', title: 'Open the quick start guide' }),
        e(ActionButton, { key: 'shortcuts', onClick: this.openShortcuts, label: 'Shortcuts', compact: true, icon: '⌨', title: 'Open keyboard shortcuts help (F1)' }),
        e(ActionButton, { key: 'settings', onClick: this.openSettings.bind(this), label: 'Settings', compact: true, icon: '⚙', title: 'Open workspace settings (Ctrl/Cmd + ,)' }),
        e(ActionButton, { key: 'theme', onClick: this.handleThemeToggle, label: this.state.theme === 'dark' ? 'Light' : 'Dark', compact: true, icon: this.state.theme === 'dark' ? '☀' : '☾', title: 'Toggle light and dark themes' })
      ])
    ]);
  };

  MarkdownStudioApp.prototype.renderStatusBar = function () {
    var autosaveLabel = !this.state.autosaveEnabled
      ? 'Autosave off'
      : this.state.autosaveStatus === 'saving'
        ? 'Draft syncing...'
        : this.state.autosaveStatus === 'saved'
          ? 'Draft saved ' + formatTime(this.state.lastAutosavedAt)
          : this.state.autosaveStatus === 'restored'
            ? 'Draft restored'
            : this.state.autosaveStatus === 'error'
              ? 'Autosave issue'
              : 'Autosave ready';

    return e('footer', { className: 'app-statusbar' }, [
      e('div', { key: 'stats', className: 'status-cluster' }, [
        e(StatBlock, { key: 'words', label: 'Words', value: this.state.stats.words }),
        e(StatBlock, { key: 'chars', label: 'Characters', value: this.state.stats.characters }),
        e(StatBlock, { key: 'lines', label: 'Lines', value: this.state.stats.lines }),
        e(StatBlock, { key: 'read', label: 'Read time', value: this.state.stats.readingMinutes ? this.state.stats.readingMinutes + ' min' : '--' }),
        e(StatBlock, { key: 'headings', label: 'Headings', value: this.state.insights.headings || 0 })
      ]),
      e('div', { key: 'hints', className: 'status-cluster status-cluster--hints' }, [
        e(StatusChip, { key: 'autosave', tone: this.state.autosaveEnabled && this.state.autosaveStatus !== 'error' ? 'success' : 'warning' }, autosaveLabel),
        e(StatusChip, { key: 'sync' }, this.isPreviewVisible() ? ('Sync ' + this.state.syncPercent + '%') : (this.state.zenMode ? 'Zen editor' : 'Editor only')),
        e(StatusChip, { key: 'saved' }, this.state.lastSavedAt ? ('Disk saved ' + formatDateTime(this.state.lastSavedAt)) : 'Disk save pending'),
        e(StatusChip, { key: 'snapshots' }, ((this.state.snapshots && this.state.snapshots.length) || 0) + ' snapshots'),
        e(StatusChip, { key: 'previewTheme', tone: 'accent' }, 'Preview ' + (this.state.previewTheme || 'studio')),
        e(StatusChip, { key: 'math' }, (this.state.liteMathEnabled !== false ? 'Math on' : 'Math off') + ' / ' + (this.state.liteDiagramsEnabled !== false ? 'Diagrams on' : 'Diagrams off')),
        e(StatusChip, { key: 'version' }, PATCH5_VERSION_LABEL),
        this.state.reduceMotion ? e(StatusChip, { key: 'motion' }, 'Reduced motion') : null
      ])
    ]);
  };

  MarkdownStudioApp.prototype.render = function () {
    var isEditorOnly = !this.isPreviewVisible();
    var leftWidth = 'minmax(0, calc(' + this.state.splitRatio + '% - ' + (DIVIDER_WIDTH / 2) + 'px))';
    var rightWidth = 'minmax(0, calc(' + (100 - this.state.splitRatio) + '% - ' + (DIVIDER_WIDTH / 2) + 'px))';
    var paletteItems = this.getFilteredCommandItems();
    var paletteSelectedIndex = clamp(this.state.commandSelectionIndex, 0, Math.max(0, paletteItems.length - 1));

    return e('div', {
      className: cx(
        'app-shell',
        this.state.zenMode ? 'is-zen' : '',
        this.state.focusMode ? 'is-focus-mode' : '',
        this.state.activePane === 'preview' ? 'focus-preview' : 'focus-editor',
        this.state.reduceMotion ? 'is-reduced-motion' : ''
      ),
      style: {
        '--editor-font-size': (this.state.editorFontSize || 15) + 'px'
      }
    }, [
      e(HiddenFileInput, {
        key: 'hiddenInput',
        fileInputRef: function (node) { this.fileInputRef = node; }.bind(this),
        onChange: this.handleFallbackFileOpen
      }),
      e(ShortcutsModal, {
        key: 'shortcuts',
        open: this.state.shortcutsOpen,
        onClose: this.closeShortcuts
      }),
      e(CommandPaletteModal, {
        key: 'palette',
        open: this.state.commandPaletteOpen,
        inputRef: function (node) { this.commandInputRef = node; }.bind(this),
        query: this.state.commandQuery,
        onQueryChange: this.handleCommandQueryChange,
        onKeyDown: this.handleCommandPaletteKeyDown,
        items: paletteItems,
        selectedIndex: paletteSelectedIndex,
        onSelect: this.setCommandSelection,
        onRun: this.runCommandFromPalette,
        onClose: this.closeCommandPalette
      }),
      this.renderWelcomeModal(),
      this.renderSettingsModal(),
      this.renderReleaseNotesModal(),
      this.renderTemplatesModal(),
      this.renderVersionsModal(),
      this.renderStyleStudioModal(),
      this.renderDiffModal(),
      this.renderComposerModal(),
      e('div', { key: 'toastWrap', className: 'toast-wrap' },
        e(ToastStack, {
          items: this.state.toasts || [],
          onDismiss: this.dismissToast.bind(this),
          onDismissAll: this.dismissToast.bind(this, null)
        })
      ),
      e('div', { key: 'frame', className: 'app-frame' }, [
        this.renderHeader(),
        this.renderToolbar(),
        this.renderPatch4Bar(),
        e('main', { key: 'workspace', className: 'workspace-wrap' }, [
          e('div', {
            key: 'grid',
            ref: function (node) { this.layoutRef = node; }.bind(this),
            className: cx('workspace-grid', isEditorOnly ? 'is-editor-only' : ''),
            style: {
              gridTemplateColumns: isEditorOnly ? 'minmax(0, 1fr)' : (leftWidth + ' ' + DIVIDER_WIDTH + 'px ' + rightWidth)
            }
          }, [
            this.renderEditorPane(),
            isEditorOnly ? null : e('div', {
              key: 'divider',
              onMouseDown: this.startDividerDrag,
              className: cx('drag-divider', this.state.isDragging ? 'is-dragging' : ''),
              title: 'Drag to resize panes'
            }),
            isEditorOnly ? null : this.renderPreviewPane()
          ]),
          this.renderUtilitySidebar()
        ]),
        this.renderStatusBar()
      ])
    ]);
  };

  /* ===== Patch 6: UX redesign, grouped menus, smarter status surfaces ===== */
  var PATCH6_VERSION_TOKEN = 'patch6-ux-redesign';
  var PATCH6_VERSION_LABEL = 'Patch 6 · UX redesign';
  var PATCH6_DEFAULT_SPLIT_RATIO = 62;
  var PATCH6_MIN_SPLIT = 38;
  var PATCH6_MAX_SPLIT = 74;

  var PATCH6_PREVIOUS_RELEASE_SECTIONS = PATCH5_RELEASE_SECTIONS && PATCH5_RELEASE_SECTIONS.slice
    ? PATCH5_RELEASE_SECTIONS.slice()
    : (PATCH5_RELEASE_SECTIONS || []);

  PATCH5_VERSION_TOKEN = PATCH6_VERSION_TOKEN;
  PATCH5_VERSION_LABEL = PATCH6_VERSION_LABEL;
  PATCH5_RELEASE_SECTIONS = [{
    title: 'Patch 6 — UX redesign',
    items: [
      'A compact document-first header with a click-to-open document popover replaces static status labels.',
      'Grouped menu buttons now reveal focused action panels for format, insert, export, view, panels, tools, and workspace tasks.',
      'The divider now shows hover and drag guidance, live split ratios, and a double-click reset tuned for laptop screens.',
      'Pane headers and the bottom status bar were condensed to reclaim writing space while keeping important context nearby.',
      'Patch 6 also refreshes the release notes, changelog, sample file, and agent guidance for the UX cleanup pass.'
    ]
  }].concat(PATCH6_PREVIOUS_RELEASE_SECTIONS);

  DEFAULT_MARKDOWN = [
    '# Markdown Studio Local',
    '',
    'Patch 6 redesigns the workspace around **writing space first**. The header is compact, tool groups open on demand, and the split handle now explains itself while you drag.',
    '',
    '## What changed',
    '',
    '- [x] Static status labels moved into a document popover and compact bottom bar',
    '- [x] Format stays quick, while insert, export, view, tools, panels, and workspace actions live in grouped menus',
    '- [x] The split starts editor-first for better laptop writing space',
    '- [x] Hover or drag the divider to see resize help and live ratios',
    '- [x] Pane headers are tighter so the editor and preview get more room',
    '',
    '## Suggested workflow',
    '',
    '1. Click the file name in the header to check save state, file access, and quick document actions.',
    '2. Use the **Format** menu or the quick formatting strip for common markdown edits.',
    '3. Open **View** to switch between Split, Editor, and Zen modes or apply laptop-friendly split presets.',
    '4. Open **Workspace** for templates, snapshots, versions, style studio, settings, and updates.',
    '',
    '> [!TIP]',
    '> Double-click the divider any time you want to return to the editor-first split.',
    '',
    '## Table sample',
    '',
    '| Area | Goal |',
    '| :--- | :--- |',
    '| Header | Show only core actions |',
    '| Menus | Reveal advanced options on demand |',
    '| Status bar | Keep save and layout context compact |',
    '',
    '```js',
    'function focusOnWriting() {',
    '  return "Less chrome, more markdown.";',
    '}',
    '```',
    '',
    'Open the **Workspace** menu for the full power-user layer when you need it, and keep the editor front and center the rest of the time.'
  ].join('\n');

  for (var patch6TemplateIndex = 0; patch6TemplateIndex < PATCH4_TEMPLATE_LIBRARY.length; patch6TemplateIndex += 1) {
    if (PATCH4_TEMPLATE_LIBRARY[patch6TemplateIndex].id === 'final-qa-checklist') {
      PATCH4_TEMPLATE_LIBRARY[patch6TemplateIndex].description = 'A final merged-build verification sheet including Patch 6 UX cleanup checks.';
      PATCH4_TEMPLATE_LIBRARY[patch6TemplateIndex].content = [
        '---',
        'title: Final QA checklist',
        'owner: Local app review',
        'status: Draft',
        'tags: [qa, validation, release]',
        '---',
        '',
        '# Final QA checklist',
        '',
        '## Patch 6 UX cleanup',
        '',
        '- [ ] The file name opens a document popover',
        '- [ ] Static save labels are no longer permanently visible in the header',
        '- [ ] Grouped menus open correctly and actions still work',
        '- [ ] Divider hover, drag, and double-click reset all work',
        '- [ ] Laptop layout feels less cramped than Patch 5',
        '',
        '## Core workspace',
        '',
        '- [ ] Editor is on the left and preview is on the right',
        '- [ ] Live preview updates while typing',
        '- [ ] Synced scrolling works both ways',
        '',
        '## Files and exports',
        '',
        '- [ ] Native open/save works when served on localhost',
        '- [ ] TXT, HTML, PDF, and DOCX exports complete successfully',
        '',
        '## Power features',
        '',
        '- [ ] Command palette, outline, recents, snapshots, diff, and style studio all open correctly',
        '- [ ] Settings, quick start, release notes, and notifications work as expected'
      ].join('\n');
      break;
    }
  }

  if (!SHORTCUT_GROUPS[2].items.some(function (item) { return item[0] === 'Double-click divider'; })) {
    SHORTCUT_GROUPS[2].items.push(['Double-click divider', 'Reset split to the editor-first layout']);
  }

  function patch6ReadSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (error) {
      return {};
    }
  }

  function patch6AutosaveLabel(state) {
    if (!state.autosaveEnabled) {
      return 'Autosave off';
    }
    if (state.autosaveStatus === 'saving') {
      return 'Draft syncing';
    }
    if (state.autosaveStatus === 'saved') {
      return 'Draft saved ' + formatTime(state.lastAutosavedAt);
    }
    if (state.autosaveStatus === 'restored') {
      return 'Draft restored';
    }
    if (state.autosaveStatus === 'error') {
      return 'Autosave issue';
    }
    return 'Autosave ready';
  }

  function patch6DiskLabel(state) {
    if (state.dirty) {
      return 'Unsaved changes';
    }
    if (state.lastSavedAt) {
      return 'Saved ' + formatTime(state.lastSavedAt);
    }
    return 'Not saved yet';
  }

  function patch6ViewLabel(app) {
    if (app.state.zenMode) {
      return 'Zen mode';
    }
    return app.isPreviewVisible() ? 'Split view' : 'Editor only';
  }

  function patch6SplitLabel(app) {
    if (!app.isPreviewVisible()) {
      return app.state.zenMode ? 'Zen editor' : 'Editor only';
    }
    var left = Math.round(Number(app.state.splitRatio) || PATCH6_DEFAULT_SPLIT_RATIO);
    var right = Math.max(0, 100 - left);
    return left + ' / ' + right;
  }

  function Patch6MenuTrigger(props) {
    return e('button', {
      type: 'button',
      onClick: props.onClick,
      title: props.title || props.label,
      className: cx('toolbar-menu-pill', props.active ? 'is-active' : '')
    }, [
      props.icon ? e('span', { key: 'icon', className: 'toolbar-menu-pill__icon', 'aria-hidden': 'true' }, props.icon) : null,
      e('span', { key: 'label', className: 'toolbar-menu-pill__label' }, props.label),
      e('span', { key: 'caret', className: 'toolbar-menu-pill__caret', 'aria-hidden': 'true' }, props.active ? '▴' : '▾')
    ]);
  }

  function Patch6PanelAction(props) {
    return e('button', {
      type: 'button',
      onClick: props.onClick,
      title: props.title || props.label,
      disabled: !!props.disabled,
      className: cx(
        'panel-action',
        props.primary ? 'panel-action--primary' : '',
        props.active ? 'is-active' : ''
      )
    }, [
      e('div', { key: 'main', className: 'panel-action__main' }, [
        props.icon ? e('span', { key: 'icon', className: 'panel-action__icon', 'aria-hidden': 'true' }, props.icon) : null,
        e('div', { key: 'copy', className: 'panel-action__copy' }, [
          e('span', { key: 'label', className: 'panel-action__label' }, props.label),
          props.description ? e('span', { key: 'description', className: 'panel-action__description' }, props.description) : null
        ])
      ]),
      props.meta ? e('span', { key: 'meta', className: 'panel-action__meta' }, props.meta) : null
    ]);
  }

  function Patch6PanelSection(props) {
    return e('section', { className: 'patch6-panel-section' }, [
      e('div', { key: 'header', className: 'patch6-panel-section__header' }, [
        e('h4', { key: 'title', className: 'patch6-panel-section__title' }, props.title),
        props.tip ? e('span', { key: 'tip', className: 'patch6-panel-section__tip' }, props.tip) : null
      ]),
      e('div', { key: 'body', className: 'patch6-panel-actions' }, props.children)
    ]);
  }

  function Patch6SelectField(props) {
    return e('label', { className: 'patch6-select-field' }, [
      e('span', { key: 'label', className: 'patch6-select-field__label' }, props.label),
      e('select', {
        key: 'select',
        value: String(props.value),
        onChange: props.onChange,
        className: 'toolbar-select patch6-select-field__control',
        title: props.title || props.label
      }, (props.options || []).map(function (option) {
        return e('option', { key: option.value, value: option.value }, option.label);
      }))
    ]);
  }

  function Patch6Metric(props) {
    return e('div', { className: 'status-metric' }, [
      e('span', { key: 'label', className: 'status-metric__label' }, props.label),
      e('strong', { key: 'value', className: 'status-metric__value' }, props.value)
    ]);
  }

  function Patch6SegmentButton(props) {
    return e('button', {
      type: 'button',
      onClick: props.onClick,
      title: props.title || props.label,
      className: cx('view-segment__btn', props.active ? 'is-active' : '')
    }, props.label);
  }

  function Patch6InfoField(props) {
    return e('div', { className: 'patch6-info-field' }, [
      e('span', { key: 'label', className: 'patch6-info-field__label' }, props.label),
      e('strong', { key: 'value', className: 'patch6-info-field__value' }, props.value)
    ]);
  }

  var WelcomeModal = function (props) {
    if (!props.open) {
      return null;
    }

    var quickShortcuts = [
      ['Ctrl/Cmd + P', 'Command palette'],
      ['Ctrl/Cmd + ,', 'Workspace settings'],
      ['Ctrl/Cmd + /', 'Zen mode'],
      ['Ctrl/Cmd + B', 'Bold'],
      ['F1', 'Shortcut sheet']
    ];

    return e('div', {
      className: 'modal-backdrop',
      onClick: function (event) {
        if (event.target === event.currentTarget) {
          props.onClose();
        }
      }
    }, e('div', { className: 'modal-card modal-card--welcome' }, [
      e('div', { key: 'header', className: 'modal-card__header' }, [
        e('div', { key: 'copy' }, [
          e('h3', { key: 'title', className: 'modal-card__title' }, 'Welcome to the Patch 6 workspace'),
          e('p', { key: 'subtitle', className: 'modal-card__subtitle' }, 'Patch 6 clears visual clutter: grouped menus hide advanced actions until you ask for them, the file name opens document details, and the editor gets more space on laptop screens.')
        ]),
        e(ActionButton, {
          key: 'close',
          onClick: props.onClose,
          label: 'Close',
          compact: true,
          icon: '✕',
          title: 'Close the quick-start guide'
        })
      ]),
      e('div', { key: 'body', className: 'modal-card__body modal-card__body--welcome custom-scroll' }, [
        e('div', { key: 'hero', className: 'welcome-hero' }, [
          e('div', { key: 'left', className: 'welcome-panel welcome-panel--primary' }, [
            e('div', { key: 'chips', className: 'welcome-chip-row' }, [
              e(StatusChip, { key: 'local', tone: 'success' }, 'Fully local'),
              e(StatusChip, { key: 'patch', tone: 'accent' }, 'Patches 1–6 merged'),
              e(StatusChip, { key: 'laptop' }, 'Laptop-first workspace')
            ]),
            e('h4', { key: 'stepsTitle', className: 'welcome-section-title' }, 'What to try first'),
            e('ol', { key: 'steps', className: 'welcome-steps' }, [
              e('li', { key: '1' }, 'Click the file name in the header to open the document popover. Save state, file access mode, and quick document actions live there now.'),
              e('li', { key: '2' }, 'Use the slim quick-format strip for common markdown edits, then open grouped menus for insert, export, view, tools, panels, or workspace actions.'),
              e('li', { key: '3' }, 'Hover or drag the divider to resize the panes. Double-click it any time you want the editor-first split back.'),
              e('li', { key: '4' }, 'Keep the right drawer closed unless you need outline, stats, or recents. That preserves writing space on smaller screens.'),
              e('li', { key: '5' }, 'Open Workspace for templates, snapshots, versions, style studio, settings, and release notes.'),
              e('li', { key: '6' }, 'Use the command palette whenever you want to move faster than the mouse.')
            ])
          ]),
          e('div', { key: 'right', className: 'welcome-panel' }, [
            e('h4', { key: 'shortcutsTitle', className: 'welcome-section-title' }, 'Quick shortcut cheat sheet'),
            e('div', { key: 'shortcuts', className: 'welcome-shortcuts' }, quickShortcuts.map(function (item) {
              return e('div', { key: item[0], className: 'welcome-shortcut' }, [
                e('kbd', { key: 'key', className: 'shortcut-item__key' }, item[0]),
                e('span', { key: 'label', className: 'welcome-shortcut__label' }, item[1])
              ]);
            })),
            e('div', { key: 'help', className: 'welcome-note' }, 'Tip: the bottom status bar is now compact on purpose. Detailed file and save information moved into the file-name popover in the header.')
          ])
        ]),
        e('section', { key: 'patches', className: 'welcome-feature-grid' }, [
          e('article', { key: 'editing', className: 'welcome-feature-card' }, [
            e('h4', { key: 'title', className: 'welcome-feature-card__title' }, 'Less clutter'),
            e('p', { key: 'copy', className: 'welcome-feature-card__copy' }, 'The header is smaller, status text moved into a popover, advanced actions are grouped, and pane headers are tighter so more of the screen belongs to your document.')
          ]),
          e('article', { key: 'productivity', className: 'welcome-feature-card' }, [
            e('h4', { key: 'title', className: 'welcome-feature-card__title' }, 'Still powerful'),
            e('p', { key: 'copy', className: 'welcome-feature-card__copy' }, 'Templates, snapshots, diff, style studio, command palette, exports, dialogs, and the utility sidebar all remain available—just behind smarter entry points.')
          ]),
          e('article', { key: 'ux', className: 'welcome-feature-card' }, [
            e('h4', { key: 'title', className: 'welcome-feature-card__title' }, 'Patch 6 focus'),
            e('p', { key: 'copy', className: 'welcome-feature-card__copy' }, 'This patch prioritizes ergonomic writing space, grouped menus, divider guidance, and laptop-friendly layout defaults over adding more permanent buttons.')
          ])
        ])
      ]),
      e('div', { key: 'footer', className: 'modal-card__footer modal-card__footer--welcome' }, [
        e('div', { key: 'left', className: 'settings-actions' }, [
          e(ActionButton, { key: 'templates', onClick: props.onTemplates, label: 'Templates', compact: true, icon: '◇' }),
          e(ActionButton, { key: 'shortcuts', onClick: props.onShortcuts, label: 'Shortcuts', compact: true, icon: '⌨' }),
          e(ActionButton, { key: 'settings', onClick: props.onSettings, label: 'Settings', compact: true, icon: '⚙' }),
          e(ActionButton, { key: 'updates', onClick: props.onReleaseNotes, label: 'Updates', compact: true, icon: '✦' })
        ]),
        e(ActionButton, { key: 'start', onClick: props.onClose, label: 'Start writing', compact: true, primary: true, icon: '→' })
      ])
    ]));
  };

  var ReleaseNotesModal = function (props) {
    if (!props.open) {
      return null;
    }

    return e('div', {
      className: 'modal-backdrop',
      onClick: function (event) {
        if (event.target === event.currentTarget) {
          props.onClose();
        }
      }
    }, e('div', { className: 'modal-card modal-card--release' }, [
      e('div', { key: 'header', className: 'modal-card__header' }, [
        e('div', { key: 'copy' }, [
          e('h3', { key: 'title', className: 'modal-card__title' }, 'Release notes and patch history'),
          e('p', { key: 'subtitle', className: 'modal-card__subtitle' }, 'Everything shipped across patches 1 through 6, now ending with the UX cleanup pass that condenses chrome, groups actions, and gives the editor more room on laptop screens.')
        ]),
        e(ActionButton, {
          key: 'close',
          onClick: props.onClose,
          label: 'Close',
          compact: true,
          icon: '✕',
          title: 'Close release notes'
        })
      ]),
      e('div', { key: 'hero', className: 'settings-hero' }, [
        e(StatusChip, { key: 'version', tone: 'accent' }, PATCH5_VERSION_LABEL),
        e(StatusChip, { key: 'history' }, 'Patch series evolving'),
        e(StatusChip, { key: 'local', tone: 'success' }, 'No backend required')
      ]),
      e('div', { key: 'body', className: 'modal-card__body modal-card__body--release custom-scroll' },
        PATCH5_RELEASE_SECTIONS.map(function (section) {
          return e('section', { key: section.title, className: 'release-section' }, [
            e('h4', { key: 'title', className: 'release-section__title' }, section.title),
            e('ul', { key: 'items', className: 'release-section__list' }, section.items.map(function (item) {
              return e('li', { key: item, className: 'release-section__item' }, item);
            }))
          ]);
        })
      ),
      e('div', { key: 'footer', className: 'modal-card__footer' }, [
        e('div', { key: 'left', className: 'settings-actions' }, [
          e(ActionButton, { key: 'copy', onClick: props.onCopy, label: 'Copy summary', compact: true, icon: '⧉' }),
          e(ActionButton, { key: 'template', onClick: props.onLoadReleaseTemplate, label: 'Load release notes template', compact: true, icon: '◇' })
        ]),
        e(ActionButton, { key: 'done', onClick: props.onClose, label: 'Done', compact: true, primary: true, icon: '✓' })
      ])
    ]));
  };

  var patch6BaseComponentDidMount = MarkdownStudioApp.prototype.componentDidMount;
  var patch6BaseComponentDidUpdate = MarkdownStudioApp.prototype.componentDidUpdate;
  var patch6BaseComponentWillUnmount = MarkdownStudioApp.prototype.componentWillUnmount;
  var patch6BaseHandleKeyDown = MarkdownStudioApp.prototype.handleKeyDown;
  var patch6BaseGetCommandItems = MarkdownStudioApp.prototype.getCommandItems;

  MarkdownStudioApp.prototype.closeTransientMenus = function () {
    if (!this.state.toolbarMenu && !this.state.documentMenuOpen && !this.state.dividerHover) {
      return;
    }
    this.setState({ toolbarMenu: null, documentMenuOpen: false, dividerHover: false });
  };

  MarkdownStudioApp.prototype.toggleToolbarMenu = function (menu) {
    this.setState({
      toolbarMenu: this.state.toolbarMenu === menu ? null : menu,
      documentMenuOpen: false
    });
  };

  MarkdownStudioApp.prototype.toggleDocumentMenu = function () {
    this.setState({
      documentMenuOpen: !this.state.documentMenuOpen,
      toolbarMenu: null
    });
  };

  MarkdownStudioApp.prototype.toggleUtilityPanel = function (tab) {
    if (this.state.utilitySidebarOpen && this.state.utilitySidebarTab === tab) {
      this.closeUtilitySidebar();
      return;
    }
    this.openUtilitySidebar(tab);
    this.setState({ toolbarMenu: null });
  };

  MarkdownStudioApp.prototype.handlePatch6WindowMouseDown = function (event) {
    var target = event && event.target;
    if (!target || !target.closest) {
      this.closeTransientMenus();
      return;
    }
    if (
      target.closest('.topbar-doc-anchor') ||
      target.closest('.topbar-doc-popover') ||
      target.closest('.toolbar-menu-pill') ||
      target.closest('.toolbar-panel') ||
      target.closest('.view-segment') ||
      target.closest('.drag-divider')
    ) {
      return;
    }
    if (this.state.toolbarMenu || this.state.documentMenuOpen) {
      this.setState({ toolbarMenu: null, documentMenuOpen: false });
    }
  };

  MarkdownStudioApp.prototype.setWorkspaceView = function (mode) {
    var nextState = {
      toolbarMenu: null,
      documentMenuOpen: false,
      dividerHover: false
    };

    if (mode === 'split') {
      nextState.showPreview = true;
      nextState.zenMode = false;
      if (!this.state.splitRatio || Math.abs(Number(this.state.splitRatio) - 50) < 0.1) {
        nextState.splitRatio = PATCH6_DEFAULT_SPLIT_RATIO;
      }
      this.setState(nextState);
      return;
    }

    if (mode === 'editor') {
      nextState.showPreview = false;
      nextState.zenMode = false;
      nextState.activePane = 'editor';
      this.setState(nextState);
      return;
    }

    if (mode === 'zen') {
      nextState.showPreview = true;
      nextState.zenMode = true;
      nextState.activePane = 'editor';
      nextState.utilitySidebarOpen = false;
      this.setState(nextState);
      return;
    }
  };

  MarkdownStudioApp.prototype.applySplitPreset = function (ratio) {
    this.setState({
      splitRatio: clamp(Number(ratio) || PATCH6_DEFAULT_SPLIT_RATIO, PATCH6_MIN_SPLIT, PATCH6_MAX_SPLIT),
      toolbarMenu: null,
      documentMenuOpen: false
    });
  };

  MarkdownStudioApp.prototype.resetSplitRatio = function () {
    this.applySplitPreset(PATCH6_DEFAULT_SPLIT_RATIO);
    this.showToast('Reset the split to the editor-first default.', 'success');
  };

  MarkdownStudioApp.prototype.handleDividerMouseEnter = function () {
    if (!this.isPreviewVisible()) {
      return;
    }
    if (!this.state.dividerHover) {
      this.setState({ dividerHover: true });
    }
  };

  MarkdownStudioApp.prototype.handleDividerMouseLeave = function () {
    if (this.state.isDragging) {
      return;
    }
    if (this.state.dividerHover) {
      this.setState({ dividerHover: false });
    }
  };

  MarkdownStudioApp.prototype.handleDividerDoubleClick = function () {
    if (!this.isPreviewVisible()) {
      return;
    }
    this.resetSplitRatio();
  };

  MarkdownStudioApp.prototype.startDividerDrag = function (event) {
    if (!this.isPreviewVisible()) {
      return;
    }
    maybePreventDefault(event);
    this.isDraggingDivider = true;
    this.setState({ isDragging: true, dividerHover: true, toolbarMenu: null, documentMenuOpen: false });
  };

  MarkdownStudioApp.prototype.handlePointerMove = function (event) {
    if (!this.isDraggingDivider || !this.layoutRef) {
      return;
    }
    var rect = this.layoutRef.getBoundingClientRect();
    var ratio = ((event.clientX - rect.left) / rect.width) * 100;
    this.setState({ splitRatio: clamp(ratio, PATCH6_MIN_SPLIT, PATCH6_MAX_SPLIT), dividerHover: true });
  };

  MarkdownStudioApp.prototype.stopDividerDrag = function () {
    if (!this.isDraggingDivider) {
      return;
    }
    this.isDraggingDivider = false;
    this.setState({ isDragging: false, dividerHover: false });
  };

  MarkdownStudioApp.prototype.resetWorkspacePreferences = function () {
    if (!window.confirm('Reset workspace preferences to the Patch 6 defaults?')) {
      return;
    }
    this.setState({
      theme: 'light',
      themePreset: 'sky',
      splitRatio: PATCH6_DEFAULT_SPLIT_RATIO,
      wrapEnabled: false,
      autosaveEnabled: true,
      showPreview: true,
      zenMode: false,
      focusMode: false,
      tabSize: 2,
      utilitySidebarOpen: false,
      utilitySidebarTab: 'outline',
      previewTheme: 'studio',
      customCss: '',
      printLayout: false,
      diskSyncEnabled: false,
      liteDiagramsEnabled: true,
      liteMathEnabled: true,
      editorFontSize: 15,
      reduceMotion: false,
      settingsOpen: false,
      toolbarMenu: null,
      documentMenuOpen: false,
      dividerHover: false
    });
    this.showToast('Workspace preferences reset to the Patch 6 layout.', 'success');
  };

  MarkdownStudioApp.prototype.componentDidMount = function () {
    patch6BaseComponentDidMount.call(this);
    if (!this._patch6Bootstrapped) {
      var persisted = patch6ReadSettings();
      var persistedSplit = Number(persisted.splitRatio);
      var shouldUsePatch6Split = !persisted.splitRatio || Math.abs(persistedSplit - 50) < 0.1;
      this._patch6Bootstrapped = true;
      this._patch6WindowMouseDownHandler = this.handlePatch6WindowMouseDown.bind(this);
      window.addEventListener('mousedown', this._patch6WindowMouseDownHandler);
      this.setState({
        toolbarMenu: null,
        documentMenuOpen: false,
        dividerHover: false,
        splitRatio: shouldUsePatch6Split
          ? PATCH6_DEFAULT_SPLIT_RATIO
          : clamp(Number(this.state.splitRatio) || PATCH6_DEFAULT_SPLIT_RATIO, PATCH6_MIN_SPLIT, PATCH6_MAX_SPLIT)
      });
    }
  };

  MarkdownStudioApp.prototype.componentDidUpdate = function (prevProps, prevState) {
    patch6BaseComponentDidUpdate.call(this, prevProps, prevState);
    if (
      (!prevState.dialog && this.state.dialog) ||
      (!prevState.commandPaletteOpen && this.state.commandPaletteOpen) ||
      (!prevState.shortcutsOpen && this.state.shortcutsOpen) ||
      (!prevState.settingsOpen && this.state.settingsOpen) ||
      (!prevState.welcomeOpen && this.state.welcomeOpen) ||
      (!prevState.releaseNotesOpen && this.state.releaseNotesOpen)
    ) {
      if (this.state.toolbarMenu || this.state.documentMenuOpen) {
        this.setState({ toolbarMenu: null, documentMenuOpen: false });
      }
    }
    if ((prevState.showPreview !== this.state.showPreview || prevState.zenMode !== this.state.zenMode) && !this.isPreviewVisible() && this.state.dividerHover) {
      this.setState({ dividerHover: false });
    }
  };

  MarkdownStudioApp.prototype.componentWillUnmount = function () {
    if (this._patch6WindowMouseDownHandler) {
      window.removeEventListener('mousedown', this._patch6WindowMouseDownHandler);
      this._patch6WindowMouseDownHandler = null;
    }
    patch6BaseComponentWillUnmount.call(this);
  };

  MarkdownStudioApp.prototype.handleKeyDown = function (event) {
    if (String(event && event.key || '') === 'Escape' && (this.state.toolbarMenu || this.state.documentMenuOpen)) {
      maybePreventDefault(event);
      this.closeTransientMenus();
      return;
    }
    return patch6BaseHandleKeyDown.call(this, event);
  };

  MarkdownStudioApp.prototype.getCommandItems = function () {
    var self = this;
    return patch6BaseGetCommandItems.call(this).concat([
      {
        id: 'patch6-doc-info',
        group: 'View',
        title: 'Open document details',
        subtitle: 'Show save state, file access mode, and quick document actions',
        keywords: 'document details info save state file access popover',
        run: function () {
          self.setState({ documentMenuOpen: true, toolbarMenu: null });
        }
      },
      {
        id: 'patch6-split-editor-first',
        group: 'View',
        title: 'Use editor-first split',
        subtitle: 'Set the editor to about 62% width and preview to about 38%',
        keywords: 'split ratio editor first laptop',
        run: function () {
          self.applySplitPreset(PATCH6_DEFAULT_SPLIT_RATIO);
        }
      },
      {
        id: 'patch6-split-balanced',
        group: 'View',
        title: 'Use balanced split',
        subtitle: 'Set the editor to about 55% width and preview to about 45%',
        keywords: 'split ratio balanced preview',
        run: function () {
          self.applySplitPreset(55);
        }
      },
      {
        id: 'patch6-split-review',
        group: 'View',
        title: 'Use review split',
        subtitle: 'Set the editor to about 70% width and preview to about 30%',
        keywords: 'split ratio review wide editor',
        run: function () {
          self.applySplitPreset(70);
        }
      }
    ]);
  };

  MarkdownStudioApp.prototype.renderDocumentPopover = function () {
    var self = this;
    return e('div', { className: 'topbar-doc-popover' }, [
      e('div', { key: 'hero', className: 'topbar-doc-popover__hero' }, [
        e(StatusChip, { key: 'disk', tone: this.state.dirty ? 'warning' : 'success' }, patch6DiskLabel(this.state)),
        e(StatusChip, { key: 'autosave', tone: this.state.autosaveEnabled && this.state.autosaveStatus !== 'error' ? 'accent' : 'warning' }, patch6AutosaveLabel(this.state)),
        e(StatusChip, { key: 'view', tone: 'accent' }, patch6ViewLabel(this))
      ]),
      e('div', { key: 'grid', className: 'topbar-doc-popover__grid' }, [
        e(Patch6InfoField, { key: 'file', label: 'File access', value: this.state.isFsApiAvailable ? 'Native file access' : 'Download save mode' }),
        e(Patch6InfoField, { key: 'saved', label: 'Last disk save', value: this.state.lastSavedAt ? formatDateTime(this.state.lastSavedAt) : 'Not saved yet' }),
        e(Patch6InfoField, { key: 'draft', label: 'Draft state', value: patch6AutosaveLabel(this.state) }),
        e(Patch6InfoField, { key: 'split', label: 'Split', value: patch6SplitLabel(this) }),
        e(Patch6InfoField, { key: 'editor', label: 'Editor', value: 'Tab ' + this.state.tabSize + ' · ' + (this.state.editorFontSize || 15) + ' px' }),
        e(Patch6InfoField, { key: 'build', label: 'Build', value: PATCH6_VERSION_LABEL })
      ]),
      e('div', { key: 'actions', className: 'topbar-doc-popover__actions' }, [
        e(ActionButton, {
          key: 'open',
          onClick: function () { self.closeTransientMenus(); self.handleOpenFile(); },
          label: 'Open',
          compact: true,
          icon: '↥'
        }),
        e(ActionButton, {
          key: 'saveAs',
          onClick: function () { self.closeTransientMenus(); self.handleSaveAsFile(); },
          label: 'Save As',
          compact: true,
          icon: '⇪'
        }),
        e(ActionButton, {
          key: 'settings',
          onClick: function () { self.closeTransientMenus(); self.openSettings(); },
          label: 'Settings',
          compact: true,
          icon: '⚙'
        }),
        e(ActionButton, {
          key: 'updates',
          onClick: function () { self.closeTransientMenus(); self.openReleaseNotesModal(); },
          label: 'Updates',
          compact: true,
          icon: '✦'
        })
      ])
    ]);
  };

  MarkdownStudioApp.prototype.renderHeader = function () {
    var self = this;
    var isSplit = this.isPreviewVisible() && !this.state.zenMode;
    var isEditorOnly = !this.isPreviewVisible() && !this.state.zenMode;
    return e('header', { className: 'app-topbar app-topbar--patch6' }, [
      e('div', { key: 'left', className: 'topbar-left' }, [
        e('div', { key: 'docWrap', className: 'topbar-doc-wrap' }, [
          e('button', {
            key: 'doc',
            type: 'button',
            onClick: this.toggleDocumentMenu.bind(this),
            className: cx('topbar-doc-anchor', this.state.documentMenuOpen ? 'is-active' : ''),
            title: 'Open document details, save state, and quick actions'
          }, [
            e('span', { key: 'logo', className: 'brand-logo brand-logo--mini', 'aria-hidden': 'true' }, 'M'),
            e('span', { key: 'indicator', className: cx('save-indicator', this.state.dirty ? 'is-dirty' : 'is-clean') }),
            e('div', { key: 'copy', className: 'topbar-doc-copy' }, [
              e('div', { key: 'titleRow', className: 'topbar-doc-title-row' }, [
                e('strong', { key: 'title', className: 'topbar-doc-title' }, this.state.fileName),
                e('span', { key: 'state', className: 'topbar-doc-state' }, this.state.dirty ? 'Unsaved' : 'Saved')
              ]),
              e('span', { key: 'subtitle', className: 'topbar-doc-subtitle' }, this.state.isFsApiAvailable ? 'Local workspace · native file access ready' : 'Local workspace · download save mode')
            ]),
            e('span', { key: 'chevron', className: 'topbar-doc-chevron', 'aria-hidden': 'true' }, this.state.documentMenuOpen ? '▴' : '▾')
          ]),
          this.state.documentMenuOpen ? this.renderDocumentPopover() : null
        ])
      ]),
      e('div', { key: 'center', className: 'topbar-center' },
        e('div', { className: 'view-segment', role: 'tablist', 'aria-label': 'Workspace view mode' }, [
          e(Patch6SegmentButton, {
            key: 'split',
            label: 'Split',
            active: isSplit,
            onClick: function () { self.setWorkspaceView('split'); },
            title: 'Show editor and preview side by side'
          }),
          e(Patch6SegmentButton, {
            key: 'editor',
            label: 'Editor',
            active: isEditorOnly,
            onClick: function () { self.setWorkspaceView('editor'); },
            title: 'Hide the preview and keep only the editor visible'
          }),
          e(Patch6SegmentButton, {
            key: 'zen',
            label: 'Zen',
            active: this.state.zenMode,
            onClick: function () { self.setWorkspaceView('zen'); },
            title: 'Stretch the editor and reduce chrome'
          })
        ])
      ),
      e('div', { key: 'actions', className: 'topbar-actions topbar-actions--compact' }, [
        e(ActionButton, { key: 'new', onClick: this.handleNewDocument, label: 'New', compact: true, icon: '＋', title: 'Create a new markdown document (Ctrl/Cmd + N)' }),
        e(ActionButton, { key: 'open', onClick: this.handleOpenFile, label: 'Open', compact: true, icon: '↥', title: 'Open a markdown file (Ctrl/Cmd + O)' }),
        e(ActionButton, { key: 'save', onClick: this.handleSaveFile, label: 'Save', compact: true, primary: true, icon: '💾', title: 'Save current document (Ctrl/Cmd + S)' }),
        e(ActionButton, { key: 'palette', onClick: this.openCommandPalette, label: 'Palette', compact: true, icon: '⌘', title: 'Open command palette (Ctrl/Cmd + P)' }),
        e(ActionButton, { key: 'settings', onClick: this.openSettings.bind(this), label: 'Settings', compact: true, icon: '⚙', title: 'Open workspace settings (Ctrl/Cmd + ,)' }),
        e(ActionButton, { key: 'theme', onClick: this.handleThemeToggle, label: this.state.theme === 'dark' ? 'Light' : 'Dark', compact: true, icon: this.state.theme === 'dark' ? '☀' : '☾', title: 'Toggle light and dark themes' })
      ])
    ]);
  };

  MarkdownStudioApp.prototype.renderToolbarDropdown = function () {
    var self = this;
    var menu = this.state.toolbarMenu;
    if (!menu) {
      return null;
    }

    function action(key, label, description, icon, onClick, meta, active, disabled, primary) {
      return e(Patch6PanelAction, {
        key: key,
        label: label,
        description: description,
        icon: icon,
        meta: meta,
        active: !!active,
        disabled: !!disabled,
        primary: !!primary,
        onClick: function () {
          self.closeTransientMenus();
          onClick();
        }
      });
    }

    var metaMap = {
      format: ['Format', 'Quick markdown structure and inline emphasis controls.'],
      insert: ['Insert', 'Open builders for richer markdown content without memorizing syntax.'],
      export: ['Export', 'Local output flows, copy helpers, and print-ready options.'],
      view: ['View', 'Switch workspace modes and apply laptop-friendly split presets.'],
      tools: ['Tools', 'Search, history, writing helpers, and editor preferences.'],
      panels: ['Panels', 'Toggle outline, stats, or recent sessions on demand.'],
      workspace: ['Workspace', 'Templates, snapshots, settings, style tools, and release notes.']
    };

    var sections = [];

    if (menu === 'format') {
      sections = [
        e(Patch6PanelSection, { key: 'inline', title: 'Inline', tip: 'Selection-aware markdown' }, [
          action('bold', 'Bold', 'Wrap the current selection with strong emphasis.', 'B', function () { self.applyInlineFormat('bold'); }, 'Ctrl/Cmd + B'),
          action('italic', 'Italic', 'Wrap the current selection with emphasis.', 'I', function () { self.applyInlineFormat('italic'); }, 'Ctrl/Cmd + I'),
          action('link', 'Link', 'Insert inline link markdown or wrap a selection.', '🔗', function () { self.applyInlineFormat('link'); }, 'Ctrl/Cmd + K')
        ]),
        e(Patch6PanelSection, { key: 'blocks', title: 'Blocks and lists', tip: 'Document structure' }, [
          action('h1', 'Heading 1', 'Toggle a first-level heading on the current line.', 'H1', function () { self.handleToolbarAction('h1'); }),
          action('h2', 'Heading 2', 'Toggle a second-level heading on the current line.', 'H2', function () { self.handleToolbarAction('h2'); }),
          action('bullet', 'Bullet list', 'Create or remove a bulleted list.', '•', function () { self.handleToolbarAction('bullet'); }),
          action('ordered', 'Numbered list', 'Create or remove an ordered list.', '1.', function () { self.handleToolbarAction('ordered'); }),
          action('task', 'Task list', 'Insert task list markdown with checkboxes.', '☐', function () { self.handleToolbarAction('task'); }),
          action('quote', 'Quote', 'Prefix the selection as a block quote.', '❝', function () { self.handleToolbarAction('quote'); }),
          action('rule', 'Horizontal rule', 'Insert a divider line at the cursor.', '─', function () { self.handleToolbarAction('rule'); })
        ])
      ];
    } else if (menu === 'insert') {
      sections = [
        e(Patch6PanelSection, { key: 'media', title: 'Media and links', tip: 'Insert at cursor' }, [
          action('image', 'Image', 'Insert image markdown from a URL or local file.', '🖼', function () { self.openDialog('image'); }),
          action('gif', 'GIF', 'Insert an animated GIF from a URL or local file.', '🎞', function () { self.openDialog('gif'); }),
          action('file', 'File link', 'Embed or reference a local file or URL.', '📎', function () { self.openDialog('file'); })
        ]),
        e(Patch6PanelSection, { key: 'blocks', title: 'Blocks and helpers', tip: 'Structured markdown' }, [
          action('code', 'Code block', 'Open the fenced code builder with language selection.', '{}', function () { self.openDialog('code'); }),
          action('table', 'Table', 'Create a markdown table with custom size.', '▦', function () { self.openDialog('table'); }),
          action('callout', 'Callout', 'Insert a note, tip, warning, or important callout.', '💡', function () { self.openDialog('callout'); }),
          action('datetime', 'Date / time', 'Insert a local timestamp at the cursor.', '🕒', function () { self.openDialog('datetime'); })
        ])
      ];
    } else if (menu === 'export') {
      sections = [
        e(Patch6PanelSection, { key: 'files', title: 'File export', tip: 'Keep everything local' }, [
          action('txt', 'TXT', 'Download a plain text copy of the current document.', 'TXT', function () { self.handleExportText(); }),
          action('html', 'HTML', 'Export a standalone HTML document with styles.', 'HTML', function () { self.handleExportHtml(); }),
          action('pdf', 'PDF', 'Open the browser print flow for PDF export.', 'PDF', function () { self.handleExportPdf(); }, 'Print dialog'),
          action('docx', 'DOCX', 'Export a Word-friendly document.', 'DOCX', function () { self.handleExportDocx(); })
        ]),
        e(Patch6PanelSection, { key: 'copy', title: 'Copy helpers', tip: 'For handoff and sharing' }, [
          action('copyHtml', 'Copy HTML', 'Copy the rendered HTML preview to the clipboard.', '⧉', function () { self.handleCopyHtml(); }),
          action('copyMd', 'Copy markdown', 'Copy the markdown source to the clipboard.', '⌘', function () { self.handleCopyMarkdown(); })
        ])
      ];
    } else if (menu === 'view') {
      sections = [
        e(Patch6PanelSection, { key: 'mode', title: 'Workspace mode', tip: 'Choose how much chrome stays visible' }, [
          action('split', 'Split view', 'Keep the editor on the left and preview on the right.', '⇆', function () { self.setWorkspaceView('split'); }, patch6SplitLabel(self), self.isPreviewVisible() && !self.state.zenMode),
          action('editor', 'Editor only', 'Hide the preview and maximize writing space.', '📝', function () { self.setWorkspaceView('editor'); }, null, !self.isPreviewVisible() && !self.state.zenMode),
          action('zen', 'Zen mode', 'Stretch the editor and remove secondary chrome.', '☯', function () { self.setWorkspaceView('zen'); }, null, self.state.zenMode),
          action('focus', self.state.focusMode ? 'Focus mode on' : 'Focus mode off', 'Dim the inactive side while preserving split view.', '◐', function () { self.toggleFocusMode(); }, self.state.focusMode ? 'Active' : 'Optional', self.state.focusMode)
        ]),
        e(Patch6PanelSection, { key: 'split', title: 'Divider presets', tip: 'Tuned for laptop screens' }, [
          action('preset1', '62 / 38', 'Editor-first default with a readable preview column.', '▥', function () { self.applySplitPreset(62); }, 'Default', Math.round(self.state.splitRatio) === 62),
          action('preset2', '55 / 45', 'Balanced layout for side-by-side review.', '◫', function () { self.applySplitPreset(55); }, null, Math.round(self.state.splitRatio) === 55),
          action('preset3', '70 / 30', 'Wider editor for focused drafting on smaller screens.', '▦', function () { self.applySplitPreset(70); }, null, Math.round(self.state.splitRatio) === 70),
          action('reset', 'Reset split', 'Double-clicking the divider does this too.', '↺', function () { self.resetSplitRatio(); })
        ]),
        e(Patch6PanelSection, { key: 'appearance', title: 'Appearance', tip: 'Tone and presentation' }, [
          action('theme', self.state.theme === 'dark' ? 'Use light theme' : 'Use dark theme', 'Toggle the full workspace theme.', self.state.theme === 'dark' ? '☀' : '☾', function () { self.handleThemeToggle(); }),
          e(Patch6SelectField, {
            key: 'previewTheme',
            label: 'Preview theme',
            value: self.state.previewTheme || 'studio',
            onChange: self.handlePreviewThemeChange.bind(self),
            options: PATCH4_PREVIEW_THEMES,
            title: 'Choose preview theme'
          }),
          e(Patch6SelectField, {
            key: 'accent',
            label: 'Accent preset',
            value: self.state.themePreset,
            onChange: self.handleThemePresetChange,
            options: THEME_PRESETS,
            title: 'Choose accent preset'
          })
        ])
      ];
    } else if (menu === 'tools') {
      sections = [
        e(Patch6PanelSection, { key: 'editing', title: 'Editing helpers', tip: 'Stay in flow' }, [
          action('find', 'Find and replace', 'Search the markdown source and replace matches.', '⌕', function () { self.openFindBar(); }, 'Ctrl/Cmd + F'),
          action('undo', 'Undo', 'Step back through recent edits.', '↺', function () { self.performUndo(); }, null, false, !self.state.canUndo),
          action('redo', 'Redo', 'Re-apply an undone edit.', '↻', function () { self.performRedo(); }, null, false, !self.state.canRedo),
          action('wrap', self.state.wrapEnabled ? 'Disable wrap' : 'Enable wrap', 'Toggle visual wrapping in the editor.', '↵', function () { self.toggleWrap(); }, self.state.wrapEnabled ? 'Wrapped' : 'No wrap', self.state.wrapEnabled),
          action('autosave', self.state.autosaveEnabled ? 'Pause autosave' : 'Resume autosave', 'Toggle local draft storage while typing.', '◎', function () { self.toggleAutosave(); }, self.state.autosaveEnabled ? 'On' : 'Off', self.state.autosaveEnabled),
          action('top', 'Jump to top', 'Move quickly to the first line.', '↑', function () { self.jumpToTop(); }),
          action('bottom', 'Jump to bottom', 'Move quickly to the last line.', '↓', function () { self.jumpToBottom(); }),
          action('shortcuts', 'Shortcuts', 'Open the keyboard shortcut sheet.', '⌨', function () { self.openShortcuts(); }, 'F1')
        ]),
        e(Patch6PanelSection, { key: 'preferences', title: 'Editor preferences', tip: 'Applies immediately' }, [
          e(Patch6SelectField, {
            key: 'tabs',
            label: 'Tab size',
            value: self.state.tabSize,
            onChange: self.handleTabSizeChange,
            options: [
              { value: '2', label: '2 spaces' },
              { value: '4', label: '4 spaces' },
              { value: '8', label: '8 spaces' }
            ],
            title: 'Choose editor tab size'
          }),
          e(Patch6SelectField, {
            key: 'font',
            label: 'Editor font',
            value: self.state.editorFontSize || 15,
            onChange: self.handleEditorFontSizeChange.bind(self),
            options: PATCH5_EDITOR_FONT_SIZES,
            title: 'Choose editor font size'
          })
        ])
      ];
    } else if (menu === 'panels') {
      sections = [
        e(Patch6PanelSection, { key: 'sidebar', title: 'Right drawer', tip: 'Open only when needed' }, [
          action('outline', 'Outline', 'Jump between headings as the document grows.', '≡', function () { self.toggleUtilityPanel('outline'); }, null, self.state.utilitySidebarOpen && self.state.utilitySidebarTab === 'outline'),
          action('stats', 'Stats', 'Inspect counts, reading time, and task progress.', '◫', function () { self.toggleUtilityPanel('stats'); }, null, self.state.utilitySidebarOpen && self.state.utilitySidebarTab === 'stats'),
          action('recent', 'Recent', 'Restore recent browser-local sessions.', '🕘', function () { self.toggleUtilityPanel('recent'); }, null, self.state.utilitySidebarOpen && self.state.utilitySidebarTab === 'recent'),
          action('close', 'Close panel', 'Hide the right drawer and reclaim space.', '✕', function () { self.closeUtilitySidebar(); }, self.state.utilitySidebarOpen ? 'Visible' : 'Already hidden')
        ])
      ];
    } else if (menu === 'workspace') {
      sections = [
        e(Patch6PanelSection, { key: 'workflows', title: 'Power workspace', tip: 'Advanced actions grouped here' }, [
          action('templates', 'Templates', 'Open starter documents and snippets.', '◇', function () { self.openTemplatesModal(); }),
          action('snapshot', 'Snapshot', 'Capture a manual version checkpoint.', '◉', function () { self.captureSnapshot('Manual snapshot', false); }, ((self.state.snapshots && self.state.snapshots.length) || 0) + ' saved'),
          action('versions', 'Versions', 'Review history and compare snapshots.', '🕘', function () { self.openVersionsModal(); }),
          action('style', 'Style studio', 'Tune preview themes, print layout, and custom CSS.', '✦', function () { self.openStyleStudio(); }),
          action('settings', 'Settings', 'Open workspace settings and cleanup tools.', '⚙', function () { self.openSettings(); }, 'Ctrl/Cmd + ,'),
          action('guide', 'Quick start', 'Reopen the guided intro for the latest workflow tips.', '➜', function () { self.openWelcomeModal(); }),
          action('updates', 'Release notes', 'Review what shipped across all patches.', '⧉', function () { self.openReleaseNotesModal(); })
        ])
      ];
    }

    return e('div', { className: 'toolbar-panel' }, [
      e('div', { key: 'header', className: 'toolbar-panel__header' }, [
        e('div', { key: 'copy' }, [
          e('h3', { key: 'title', className: 'toolbar-panel__title' }, metaMap[menu][0]),
          e('p', { key: 'subtitle', className: 'toolbar-panel__subtitle' }, metaMap[menu][1])
        ]),
        e('div', { key: 'meta', className: 'toolbar-panel__meta' }, [
          e(StatusChip, { key: 'esc' }, 'Esc to close'),
          e(StatusChip, { key: 'palette', tone: 'accent' }, 'Ctrl/Cmd + P')
        ])
      ]),
      e('div', { key: 'content', className: 'toolbar-panel__content custom-scroll' }, sections)
    ]);
  };

  MarkdownStudioApp.prototype.renderToolbar = function () {
    var self = this;
    return e('div', { className: 'toolbar-shell' }, [
      e('div', { key: 'menubar', className: 'toolbar-menubar custom-scroll' }, [
        e('div', { key: 'left', className: 'toolbar-menubar__left' }, [
          e(Patch6MenuTrigger, { key: 'format', label: 'Format', icon: '✎', active: this.state.toolbarMenu === 'format', onClick: function () { self.toggleToolbarMenu('format'); }, title: 'Show markdown formatting actions' }),
          e(Patch6MenuTrigger, { key: 'insert', label: 'Insert', icon: '+', active: this.state.toolbarMenu === 'insert', onClick: function () { self.toggleToolbarMenu('insert'); }, title: 'Show insert builders for media and blocks' }),
          e(Patch6MenuTrigger, { key: 'export', label: 'Export', icon: '↓', active: this.state.toolbarMenu === 'export', onClick: function () { self.toggleToolbarMenu('export'); }, title: 'Show export and copy actions' }),
          e(Patch6MenuTrigger, { key: 'view', label: 'View', icon: '▣', active: this.state.toolbarMenu === 'view', onClick: function () { self.toggleToolbarMenu('view'); }, title: 'Show view modes and split presets' }),
          e(Patch6MenuTrigger, { key: 'tools', label: 'Tools', icon: '⚙', active: this.state.toolbarMenu === 'tools', onClick: function () { self.toggleToolbarMenu('tools'); }, title: 'Show editing tools and preferences' }),
          e(Patch6MenuTrigger, { key: 'panels', label: 'Panels', icon: '☰', active: this.state.toolbarMenu === 'panels', onClick: function () { self.toggleToolbarMenu('panels'); }, title: 'Show right drawer controls' }),
          e(Patch6MenuTrigger, { key: 'workspace', label: 'Workspace', icon: '◇', active: this.state.toolbarMenu === 'workspace', onClick: function () { self.toggleToolbarMenu('workspace'); }, title: 'Show templates, versions, settings, and updates' })
        ]),
        e('div', { key: 'right', className: 'toolbar-menubar__right' }, [
          e('span', { key: 'hint', className: 'toolbar-menubar__hint' }, 'Quick format'),
          e(ToolbarButton, { key: 'bold', onClick: function () { self.applyInlineFormat('bold'); }, label: 'Bold', icon: 'B', title: 'Bold (Ctrl/Cmd + B)', emphasis: true }),
          e(ToolbarButton, { key: 'italic', onClick: function () { self.applyInlineFormat('italic'); }, label: 'Italic', icon: 'I', title: 'Italic (Ctrl/Cmd + I)', emphasis: true }),
          e(ToolbarButton, { key: 'link', onClick: function () { self.applyInlineFormat('link'); }, label: 'Link', icon: '🔗', title: 'Insert link (Ctrl/Cmd + K)' }),
          e(ToolbarButton, { key: 'h1', onClick: function () { self.handleToolbarAction('h1'); }, label: 'H1', title: 'Toggle heading 1' }),
          e(ToolbarButton, { key: 'bullet', onClick: function () { self.handleToolbarAction('bullet'); }, label: 'List', icon: '•', title: 'Toggle bullet list' }),
          e(ToolbarButton, { key: 'task', onClick: function () { self.handleToolbarAction('task'); }, label: 'Task', icon: '☐', title: 'Toggle task list' })
        ])
      ]),
      this.state.toolbarMenu ? this.renderToolbarDropdown() : null
    ]);
  };

  MarkdownStudioApp.prototype.renderPatch4Bar = function () {
    return null;
  };

  MarkdownStudioApp.prototype.renderEditorPane = function () {
    var self = this;
    return e('section', {
      className: cx(
        'pane pane--editor',
        this.state.activePane === 'editor' ? 'is-active-pane' : '',
        this.state.focusMode && this.state.activePane !== 'editor' ? 'is-dimmed-pane' : ''
      )
    }, [
      e('div', { key: 'header', className: 'pane-header pane-header--compact' }, [
        e('div', { key: 'titleWrap', className: 'pane-header__main' }, [
          e('span', { key: 'eyebrow', className: 'pane-header__eyebrow' }, 'Markdown source'),
          e('h2', { key: 'title', className: 'pane-title' }, 'Editor')
        ]),
        e('div', { key: 'actions', className: 'pane-header-actions' }, [
          e(StatusChip, { key: 'line', tone: 'accent' }, 'Line ' + this.state.currentLine),
          e(StatusChip, { key: 'words' }, this.state.stats.words + ' words'),
          e(ToolbarButton, { key: 'find', onClick: this.openFindBar, label: 'Find', icon: '⌕', title: 'Open find and replace (Ctrl/Cmd + F)' }),
          e(ToolbarButton, { key: 'wrap', onClick: this.toggleWrap, label: this.state.wrapEnabled ? 'Wrap on' : 'Wrap off', icon: '↵', title: 'Toggle word wrap', active: this.state.wrapEnabled })
        ])
      ]),
      this.renderFindBar(),
      e('div', {
        key: 'body',
        className: 'pane-body editor-body',
        onMouseEnter: function () { self.setActivePane('editor'); },
        onClick: function () { self.setActivePane('editor'); }
      }, [
        this.state.dragHover ? e('div', { key: 'overlay', className: 'drop-overlay' }, e('div', { className: 'drop-overlay__content' }, 'Drop a markdown file to open it locally')) : null,
        e('div', {
          key: 'gutter',
          ref: function (node) { self.gutterRef = node; },
          className: cx('line-numbers custom-scroll editor-gutter', this.state.wrapEnabled ? 'is-muted' : '')
        }, e('div', null, createLineNumberElements(this.state.stats.lines, this.state.currentLine))),
        e('div', { key: 'inputWrap', className: 'editor-input-wrap' }, [
          e('div', {
            key: 'currentLine',
            ref: function (node) { self.currentLineHighlightRef = node; },
            className: cx('editor-current-line', this.state.wrapEnabled ? 'is-hidden' : '')
          }),
          e('textarea', {
            key: 'textarea',
            ref: function (node) { self.editorRef = node; },
            value: this.state.markdown,
            onChange: this.handleEditorChange,
            onScroll: this.handleEditorScroll,
            onKeyDown: this.handleEditorKeyDown,
            onKeyUp: this.handleEditorSelectionChange,
            onClick: this.handleEditorSelectionChange,
            onFocus: function () {
              self.setActivePane('editor');
              self.handleEditorSelectionChange();
            },
            onSelect: this.handleEditorSelectionChange,
            onDragEnter: this.handleDragEnter,
            onDragLeave: this.handleDragLeave,
            spellCheck: false,
            wrap: this.state.wrapEnabled ? 'soft' : 'off',
            style: {
              tabSize: this.state.tabSize,
              MozTabSize: this.state.tabSize
            },
            className: cx('editor-textarea custom-scroll', this.state.wrapEnabled ? 'is-wrapped' : ''),
            placeholder: 'Write markdown here...'
          })
        ])
      ])
    ]);
  };

  MarkdownStudioApp.prototype.renderPreviewPane = function () {
    var self = this;
    var syncLabel = 'Sync ' + this.state.syncPercent + '%';

    return e('section', {
      className: cx(
        'pane pane--preview',
        this.state.activePane === 'preview' ? 'is-active-pane' : '',
        this.state.focusMode && this.state.activePane !== 'preview' ? 'is-dimmed-pane' : ''
      )
    }, [
      e('div', { key: 'header', className: 'pane-header pane-header--compact' }, [
        e('div', { key: 'titleWrap', className: 'pane-header__main' }, [
          e('span', { key: 'eyebrow', className: 'pane-header__eyebrow' }, 'Rendered output'),
          e('h2', { key: 'title', className: 'pane-title' }, 'Preview')
        ]),
        e('div', { key: 'actions', className: 'pane-header-actions' }, [
          e(StatusChip, { key: 'theme', tone: 'accent' }, (this.state.previewTheme || 'studio') + ' theme'),
          e(StatusChip, { key: 'status', tone: 'success' }, syncLabel),
          e(ToolbarButton, { key: 'copy', onClick: this.handleCopyHtml, label: 'Copy HTML', icon: '⧉', title: 'Copy rendered HTML to the clipboard' }),
          e(ToolbarButton, { key: 'pdf', onClick: this.handleExportPdf, label: 'PDF', icon: '🖨', title: 'Open the browser print flow for PDF export' })
        ])
      ]),
      e('div', { key: 'meter', className: 'preview-sync-meter' },
        e('div', {
          className: 'preview-sync-meter__fill',
          style: { width: this.state.syncPercent + '%' }
        })
      ),
      e('div', {
        key: 'body',
        ref: function (node) { self.previewRef = node; },
        onScroll: this.handlePreviewScroll,
        onMouseEnter: function () { self.setActivePane('preview'); },
        onClick: function () { self.setActivePane('preview'); },
        className: 'pane-body preview-scroller custom-scroll'
      }, e('article', {
        className: 'preview-sheet markdown-body',
        dangerouslySetInnerHTML: { __html: this.state.renderedHtml }
      }))
    ]);
  };

  MarkdownStudioApp.prototype.renderStatusBar = function () {
    return e('footer', { className: 'app-statusbar app-statusbar--patch6' }, [
      e('div', { key: 'metrics', className: 'status-cluster status-cluster--metrics' }, [
        e(Patch6Metric, { key: 'words', label: 'Words', value: this.state.stats.words }),
        e(Patch6Metric, { key: 'chars', label: 'Chars', value: this.state.stats.characters }),
        e(Patch6Metric, { key: 'lines', label: 'Lines', value: this.state.stats.lines }),
        e(Patch6Metric, { key: 'read', label: 'Read', value: this.state.stats.readingMinutes ? this.state.stats.readingMinutes + ' min' : '--' })
      ]),
      e('div', { key: 'signals', className: 'status-cluster status-cluster--signals' }, [
        e(StatusChip, { key: 'disk', tone: this.state.dirty ? 'warning' : 'success' }, patch6DiskLabel(this.state)),
        e(StatusChip, { key: 'autosave', tone: this.state.autosaveEnabled && this.state.autosaveStatus !== 'error' ? 'success' : 'warning' }, patch6AutosaveLabel(this.state)),
        e(StatusChip, { key: 'view' }, patch6ViewLabel(this)),
        e(StatusChip, { key: 'split' }, patch6SplitLabel(this)),
        e(StatusChip, { key: 'tabs' }, 'Tab ' + this.state.tabSize),
        e(StatusChip, { key: 'wrap' }, this.state.wrapEnabled ? 'Wrap on' : 'Wrap off'),
        e(StatusChip, { key: 'access', tone: 'accent' }, this.state.isFsApiAvailable ? 'Native access' : 'Download save')
      ])
    ]);
  };

  MarkdownStudioApp.prototype.render = function () {
    var isEditorOnly = !this.isPreviewVisible();
    var leftWidth = 'minmax(0, calc(' + this.state.splitRatio + '% - ' + (DIVIDER_WIDTH / 2) + 'px))';
    var rightWidth = 'minmax(0, calc(' + (100 - this.state.splitRatio) + '% - ' + (DIVIDER_WIDTH / 2) + 'px))';
    var paletteItems = this.getFilteredCommandItems();
    var paletteSelectedIndex = clamp(this.state.commandSelectionIndex, 0, Math.max(0, paletteItems.length - 1));
    var dividerHintVisible = this.isPreviewVisible() && (this.state.dividerHover || this.state.isDragging);
    var dividerTitle = this.state.isDragging ? (patch6SplitLabel(this) + ' split') : 'Drag to resize panes';
    var dividerCopy = this.state.isDragging
      ? 'Release to keep this width. Double-click to reset.'
      : 'Double-click to reset to the laptop-friendly editor-first layout.';

    return e('div', {
      className: cx(
        'app-shell',
        this.state.zenMode ? 'is-zen' : '',
        this.state.focusMode ? 'is-focus-mode' : '',
        this.state.activePane === 'preview' ? 'focus-preview' : 'focus-editor',
        this.state.reduceMotion ? 'is-reduced-motion' : '',
        this.state.toolbarMenu ? 'has-toolbar-panel' : '',
        this.state.documentMenuOpen ? 'has-doc-popover' : ''
      ),
      style: {
        '--editor-font-size': (this.state.editorFontSize || 15) + 'px'
      }
    }, [
      e(HiddenFileInput, {
        key: 'hiddenInput',
        fileInputRef: function (node) { this.fileInputRef = node; }.bind(this),
        onChange: this.handleFallbackFileOpen
      }),
      e(ShortcutsModal, {
        key: 'shortcuts',
        open: this.state.shortcutsOpen,
        onClose: this.closeShortcuts
      }),
      e(CommandPaletteModal, {
        key: 'palette',
        open: this.state.commandPaletteOpen,
        inputRef: function (node) { this.commandInputRef = node; }.bind(this),
        query: this.state.commandQuery,
        onQueryChange: this.handleCommandQueryChange,
        onKeyDown: this.handleCommandPaletteKeyDown,
        items: paletteItems,
        selectedIndex: paletteSelectedIndex,
        onSelect: this.setCommandSelection,
        onRun: this.runCommandFromPalette,
        onClose: this.closeCommandPalette
      }),
      this.renderWelcomeModal(),
      this.renderSettingsModal(),
      this.renderReleaseNotesModal(),
      this.renderTemplatesModal(),
      this.renderVersionsModal(),
      this.renderStyleStudioModal(),
      this.renderDiffModal(),
      this.renderComposerModal(),
      e('div', { key: 'toastWrap', className: 'toast-wrap' },
        e(ToastStack, {
          items: this.state.toasts || [],
          onDismiss: this.dismissToast.bind(this),
          onDismissAll: this.dismissToast.bind(this, null)
        })
      ),
      e('div', { key: 'frame', className: 'app-frame' }, [
        this.renderHeader(),
        this.renderToolbar(),
        e('main', { key: 'workspace', className: 'workspace-wrap' }, [
          e('div', {
            key: 'grid',
            ref: function (node) { this.layoutRef = node; }.bind(this),
            className: cx('workspace-grid', isEditorOnly ? 'is-editor-only' : ''),
            style: {
              gridTemplateColumns: isEditorOnly ? 'minmax(0, 1fr)' : (leftWidth + ' ' + DIVIDER_WIDTH + 'px ' + rightWidth)
            }
          }, [
            this.renderEditorPane(),
            isEditorOnly ? null : e('div', {
              key: 'divider',
              onMouseDown: this.startDividerDrag,
              onMouseEnter: this.handleDividerMouseEnter.bind(this),
              onMouseLeave: this.handleDividerMouseLeave.bind(this),
              onDoubleClick: this.handleDividerDoubleClick.bind(this),
              className: cx('drag-divider', this.state.isDragging ? 'is-dragging' : '', this.state.dividerHover ? 'is-hovered' : ''),
              title: 'Drag to resize panes'
            }, dividerHintVisible ? e('div', { className: 'divider-tooltip' }, [
              e('span', { key: 'title', className: 'divider-tooltip__title' }, dividerTitle),
              e('span', { key: 'copy', className: 'divider-tooltip__copy' }, dividerCopy)
            ]) : null),
            isEditorOnly ? null : this.renderPreviewPane()
          ]),
          this.renderUtilitySidebar()
        ]),
        this.renderStatusBar()
      ])
    ]);
  };


  /* ===== Patch 7: Smart writing, slash commands, and richer editor input ===== */
  var PATCH7_VERSION_TOKEN = 'patch7-smart-writing';
  var PATCH7_VERSION_LABEL = 'Patch 7 · Smart writing';

  var PATCH7_PREVIOUS_RELEASE_SECTIONS = PATCH5_RELEASE_SECTIONS && PATCH5_RELEASE_SECTIONS.slice
    ? PATCH5_RELEASE_SECTIONS.slice()
    : (PATCH5_RELEASE_SECTIONS || []);

  PATCH5_VERSION_TOKEN = PATCH7_VERSION_TOKEN;
  PATCH5_VERSION_LABEL = PATCH7_VERSION_LABEL;
  PATCH6_VERSION_TOKEN = PATCH7_VERSION_TOKEN;
  PATCH6_VERSION_LABEL = PATCH7_VERSION_LABEL;
  PATCH5_RELEASE_SECTIONS = [{
    title: 'Patch 7 — Smart writing',
    items: [
      'Slash commands now insert headings, media, tables, callouts, and quick snippets without leaving the keyboard.',
      'A contextual selection toolbar appears only when text is selected, so common formatting stays close without taking permanent space.',
      'Typewriter mode, paragraph focus mode, spellcheck, and word goals turn the editor into a calmer writing-first workspace.',
      'Images and GIFs can now be pasted from the clipboard or dropped into the editor as local embedded markdown assets.',
      'Patch 7 refreshes the sample content, changelog, QA docs, and agent guide for the smart-writing workflow.'
    ]
  }].concat(PATCH7_PREVIOUS_RELEASE_SECTIONS);

  DEFAULT_MARKDOWN = [
    '# Markdown Studio Local',
    '',
    'Patch 7 turns the editor into a more **writing-first workspace**. Use slash commands, contextual selection actions, clipboard image paste, and writing modes to stay focused with less toolbar hunting.',
    '',
    '## Patch 7 highlights',
    '',
    '- [x] Type `/` inside the editor to open slash commands for headings, snippets, media, tables, and callouts',
    '- [x] Select text to show a compact inline formatting toolbar near the editor',
    '- [x] Toggle typewriter mode to keep the active line centered while drafting',
    '- [x] Toggle paragraph focus mode to dim surrounding text and isolate the current block',
    '- [x] Paste images from the clipboard or drop image files straight into the editor',
    '- [x] Set a word goal and track progress from the bottom status bar',
    '',
    '## Suggested smart-writing workflow',
    '',
    '1. Press `/` on a new line and choose **Heading 2**, **Checklist**, or **Meeting notes**.',
    '2. Select a sentence to reveal the compact selection toolbar for bold, italic, links, code, quote, or note callouts.',
    '3. Use **Tools** to enable **Typewriter mode**, **Paragraph focus**, or **Spellcheck**.',
    '4. Paste an image from the clipboard or drag a local image into the editor to embed it directly as markdown.',
    '5. Set a **word goal** from the Tools menu or command palette and watch the progress chip update as you write.',
    '',
    '> [!TIP]',
    '> Patch 7 is designed to feel lighter than adding more always-visible buttons. Most new actions now appear only when you need them.',
    '',
    '## Slash command examples',
    '',
    '- `/h1` or `/h2` for headings',
    '- `/checklist` for a quick task list',
    '- `/meeting` for structured notes',
    '- `/image` or `/gif` for media builders',
    '- `/table` for a markdown table builder',
    '- `/callout` for a note or warning block',
    '',
    '## Word-goal sample',
    '',
    '| Mode | Why it helps |',
    '| :--- | :--- |',
    '| Typewriter | Keeps your active line near the visual center |',
    '| Paragraph focus | Reduces noise around the block you are editing |',
    '| Word goal | Makes progress visible without leaving the editor |',
    '',
    '```js',
    'function patchSevenWorkflow() {',
    '  return "Less chrome. Faster writing.";',
    '}',
    '```',
    '',
    'Stay in the editor, let context reveal the right controls, and use the command palette only when you want global power.'
  ].join('\n');

  if (!SHORTCUT_GROUPS.some(function (group) { return group.title === 'Smart writing'; })) {
    SHORTCUT_GROUPS.push({
      title: 'Smart writing',
      items: [
        ['Type /', 'Open slash commands on the current line'],
        ['Alt + Shift + T', 'Toggle typewriter mode'],
        ['Alt + Shift + P', 'Toggle paragraph focus mode'],
        ['Alt + Shift + S', 'Toggle spellcheck'],
        ['Alt + Shift + G', 'Set or update the word goal'],
        ['Ctrl/Cmd + V', 'Paste image from clipboard into markdown']
      ]
    });
  }

  function patch7ReadSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (error) {
      return {};
    }
  }

  function patch7NormalizeWordGoal(value) {
    var number = Math.round(Number(value));
    if (!isFinite(number) || number <= 0) {
      return 0;
    }
    return clamp(number, 1, 500000);
  }

  function patch7EscapeAltText(value) {
    return String(value || 'Image').replace(/\]/g, '').trim() || 'Image';
  }

  function patch7BuildMediaMarkdown(src, alt) {
    return '![' + patch7EscapeAltText(alt) + '](' + src + ')';
  }

  function patch7GetQuickSnippet(kind) {
    var text = '';
    var cursorTarget = '';
    var label = '';
    var cursorMarker = '{{cursor}}';
    var selectionStartOffset = 0;
    var selectionEndOffset = 0;

    if (kind === 'checklist') {
      text = ['## Checklist', '', '- [ ] First item', '- [ ] Second item'].join('\n');
      cursorTarget = 'First item';
      label = 'Checklist';
    } else if (kind === 'meeting') {
      text = [
        '## Meeting notes',
        '',
        '**Date:** {{cursor}}',
        '**Attendees:** ',
        '',
        '### Agenda',
        '- ',
        '',
        '### Notes',
        '- ',
        '',
        '### Next steps',
        '- '
      ].join('\n');
      label = 'Meeting notes';
    } else if (kind === 'review') {
      text = [
        '## Review summary',
        '',
        '### Wins',
        '- {{cursor}}',
        '',
        '### Risks',
        '- ',
        '',
        '### Next steps',
        '- '
      ].join('\n');
      label = 'Review summary';
    } else if (kind === 'noteCallout') {
      text = buildCalloutMarkdown('NOTE', '', 'Add note here.');
      cursorTarget = 'Add note here.';
      label = 'Note callout';
    } else if (kind === 'code') {
      text = ['```js', 'console.log("Write here");', '```'].join('\n');
      cursorTarget = 'console.log("Write here");';
      label = 'Code fence';
    } else {
      return null;
    }

    if (text.indexOf(cursorMarker) !== -1) {
      selectionStartOffset = text.indexOf(cursorMarker);
      text = text.replace(cursorMarker, '');
      selectionEndOffset = selectionStartOffset;
    } else {
      selectionStartOffset = text.indexOf(cursorTarget);
      if (selectionStartOffset < 0) {
        selectionStartOffset = text.length;
      }
      selectionEndOffset = selectionStartOffset + cursorTarget.length;
    }

    return {
      kind: kind,
      label: label,
      text: text,
      selectionStartOffset: selectionStartOffset,
      selectionEndOffset: selectionEndOffset
    };
  }

  function patch7GetParagraphInfo(text, position) {
    var source = String(text || '');
    var lines = source.split('\n');
    var total = Math.max(1, lines.length);
    var currentLine = clamp(getLineNumberForPosition(source, position || 0), 1, total);
    var startLine = currentLine;
    var endLine = currentLine;
    var currentValue = String(lines[currentLine - 1] || '');

    if (currentValue.trim()) {
      while (startLine > 1 && String(lines[startLine - 2] || '').trim()) {
        startLine -= 1;
      }
      while (endLine < total && String(lines[endLine] || '').trim()) {
        endLine += 1;
      }
    }

    return {
      startLine: startLine,
      endLine: endLine,
      lineCount: Math.max(1, endLine - startLine + 1)
    };
  }

  function patch7GetGoalProgress(app) {
    var goal = patch7NormalizeWordGoal(app.state.wordGoal);
    if (!goal) {
      return null;
    }
    var words = (app.state.stats && app.state.stats.words) || 0;
    return {
      goal: goal,
      words: words,
      percent: clamp(Math.round((words / goal) * 100), 0, 999),
      remaining: Math.max(0, goal - words),
      reached: words >= goal
    };
  }

  function patch7SlashCommandItems(app) {
    return [
      {
        id: 'heading1',
        icon: 'H1',
        label: 'Heading 1',
        description: 'Insert a top-level heading marker.',
        keywords: 'h1 heading title',
        run: function (context) {
          context.app.patch7ReplaceRange(context.start, context.end, '# ', 2, 2);
        }
      },
      {
        id: 'heading2',
        icon: 'H2',
        label: 'Heading 2',
        description: 'Insert a section heading marker.',
        keywords: 'h2 heading section',
        run: function (context) {
          context.app.patch7ReplaceRange(context.start, context.end, '## ', 3, 3);
        }
      },
      {
        id: 'bullet',
        icon: '•',
        label: 'Bullet list',
        description: 'Start a bulleted list item.',
        keywords: 'list bullet unordered',
        run: function (context) {
          context.app.patch7ReplaceRange(context.start, context.end, '- ', 2, 2);
        }
      },
      {
        id: 'task',
        icon: '☐',
        label: 'Task list',
        description: 'Start a task list checkbox item.',
        keywords: 'task checklist todo checkbox',
        run: function (context) {
          context.app.patch7ReplaceRange(context.start, context.end, '- [ ] ', 6, 6);
        }
      },
      {
        id: 'quote',
        icon: '❝',
        label: 'Quote',
        description: 'Insert a block quote marker.',
        keywords: 'quote blockquote',
        run: function (context) {
          context.app.patch7ReplaceRange(context.start, context.end, '> ', 2, 2);
        }
      },
      {
        id: 'checklist',
        icon: '✓',
        label: 'Checklist snippet',
        description: 'Insert a reusable checklist starter.',
        keywords: 'checklist tasks todo snippet',
        run: function (context) {
          context.app.patch7InsertQuickSnippetAtRange('checklist', context.start, context.end);
        }
      },
      {
        id: 'meeting',
        icon: '🗒',
        label: 'Meeting notes',
        description: 'Insert a structured meeting-notes snippet.',
        keywords: 'meeting notes agenda summary snippet',
        run: function (context) {
          context.app.patch7InsertQuickSnippetAtRange('meeting', context.start, context.end);
        }
      },
      {
        id: 'review',
        icon: '◇',
        label: 'Review summary',
        description: 'Insert a short review or handoff outline.',
        keywords: 'review handoff summary snippet',
        run: function (context) {
          context.app.patch7InsertQuickSnippetAtRange('review', context.start, context.end);
        }
      },
      {
        id: 'code',
        icon: '{}',
        label: 'Code block',
        description: 'Open the code block builder.',
        keywords: 'code block snippet developer',
        run: function (context) {
          context.app.patch7ReplaceRange(context.start, context.end, '', 0, 0, function () {
            context.app.openDialog('code');
          });
        }
      },
      {
        id: 'table',
        icon: '▦',
        label: 'Table',
        description: 'Open the markdown table builder.',
        keywords: 'table columns rows grid',
        run: function (context) {
          context.app.patch7ReplaceRange(context.start, context.end, '', 0, 0, function () {
            context.app.openDialog('table');
          });
        }
      },
      {
        id: 'image',
        icon: '🖼',
        label: 'Image',
        description: 'Open the image insert dialog.',
        keywords: 'image media photo screenshot',
        run: function (context) {
          context.app.patch7ReplaceRange(context.start, context.end, '', 0, 0, function () {
            context.app.openDialog('image');
          });
        }
      },
      {
        id: 'gif',
        icon: '🎞',
        label: 'GIF',
        description: 'Open the GIF insert dialog.',
        keywords: 'gif animation media',
        run: function (context) {
          context.app.patch7ReplaceRange(context.start, context.end, '', 0, 0, function () {
            context.app.openDialog('gif');
          });
        }
      },
      {
        id: 'callout',
        icon: '💡',
        label: 'Callout',
        description: 'Open the callout builder.',
        keywords: 'callout note warning info tip',
        run: function (context) {
          context.app.patch7ReplaceRange(context.start, context.end, '', 0, 0, function () {
            context.app.openDialog('callout');
          });
        }
      },
      {
        id: 'datetime',
        icon: '🕒',
        label: 'Date / time',
        description: 'Insert a local timestamp.',
        keywords: 'date time timestamp now',
        run: function (context) {
          context.app.patch7ReplaceRange(context.start, context.end, '', 0, 0, function () {
            context.app.openDialog('datetime');
          });
        }
      }
    ];
  }

  function Patch7SelectionAction(props) {
    return e('button', {
      type: 'button',
      onClick: props.onClick,
      title: props.title || props.label,
      className: cx('selection-toolbar__btn', props.emphasis ? 'is-accent' : '')
    }, [
      props.icon ? e('span', { key: 'icon', className: 'selection-toolbar__btn-icon', 'aria-hidden': 'true' }, props.icon) : null,
      e('span', { key: 'label', className: 'selection-toolbar__btn-label' }, props.label)
    ]);
  }

  function Patch7SelectionToolbar(props) {
    if (!props.visible) {
      return null;
    }

    return e('div', { className: 'selection-toolbar' }, [
      e('span', { key: 'meta', className: 'selection-toolbar__meta' }, props.meta || 'Selection'),
      e(Patch7SelectionAction, { key: 'bold', onClick: props.onBold, label: 'Bold', icon: 'B', title: 'Bold the selection' }),
      e(Patch7SelectionAction, { key: 'italic', onClick: props.onItalic, label: 'Italic', icon: 'I', title: 'Italicize the selection' }),
      e(Patch7SelectionAction, { key: 'link', onClick: props.onLink, label: 'Link', icon: '🔗', title: 'Convert the selection into a link' }),
      e(Patch7SelectionAction, { key: 'code', onClick: props.onCode, label: 'Code', icon: '`', title: 'Wrap the selection in inline code' }),
      e(Patch7SelectionAction, { key: 'quote', onClick: props.onQuote, label: 'Quote', icon: '❝', title: 'Turn the selection into a block quote' }),
      e(Patch7SelectionAction, { key: 'note', onClick: props.onNote, label: 'Note', icon: '💡', title: 'Wrap the selection in a note callout', emphasis: true })
    ]);
  }

  function Patch7SlashMenu(props) {
    if (!props.open) {
      return null;
    }

    return e('div', {
      className: 'slash-menu',
      style: { top: (props.top || 18) + 'px' }
    }, [
      e('div', { key: 'header', className: 'slash-menu__header' }, [
        e('div', { key: 'copy', className: 'slash-menu__header-copy' }, [
          e('strong', { key: 'title', className: 'slash-menu__title' }, props.fromTyping ? 'Slash commands' : 'Quick insert'),
          e('span', { key: 'subtitle', className: 'slash-menu__subtitle' }, props.fromTyping ? 'Type more to filter, then press Enter.' : 'Choose a smart insert for the cursor.')
        ]),
        e('span', { key: 'query', className: 'slash-menu__query' }, props.query ? '/' + props.query : '/ …')
      ]),
      e('div', { key: 'list', className: 'slash-menu__list custom-scroll' },
        props.items.length
          ? props.items.map(function (item, index) {
              return e('button', {
                key: item.id,
                type: 'button',
                onMouseDown: function (event) { maybePreventDefault(event); },
                onMouseEnter: function () { props.onHover(index); },
                onClick: function () { props.onRun(item.id); },
                className: cx('slash-menu__item', index === props.selectedIndex ? 'is-active' : '')
              }, [
                e('span', { key: 'icon', className: 'slash-menu__icon', 'aria-hidden': 'true' }, item.icon || '/'),
                e('span', { key: 'body', className: 'slash-menu__body' }, [
                  e('span', { key: 'label', className: 'slash-menu__label' }, item.label),
                  e('span', { key: 'description', className: 'slash-menu__description' }, item.description)
                ])
              ]);
            })
          : e('div', { className: 'slash-menu__empty' }, 'No slash commands match this filter yet.')
      )
    ]);
  }

  var patch7BaseComponentDidMount = MarkdownStudioApp.prototype.componentDidMount;
  var patch7BaseComponentDidUpdate = MarkdownStudioApp.prototype.componentDidUpdate;
  var patch7BaseComponentWillUnmount = MarkdownStudioApp.prototype.componentWillUnmount;
  var patch7BaseHandleKeyDown = MarkdownStudioApp.prototype.handleKeyDown;
  var patch7BaseGetCommandItems = MarkdownStudioApp.prototype.getCommandItems;
  var patch7BasePersistLocalState = MarkdownStudioApp.prototype.persistLocalState;
  var patch7BaseHandleEditorChange = MarkdownStudioApp.prototype.handleEditorChange;
  var patch7BaseHandleEditorSelectionChange = MarkdownStudioApp.prototype.handleEditorSelectionChange;
  var patch7BaseHandleEditorKeyDown = MarkdownStudioApp.prototype.handleEditorKeyDown;
  var patch7BaseHandleEditorScroll = MarkdownStudioApp.prototype.handleEditorScroll;
  var patch7BaseHandleDrop = MarkdownStudioApp.prototype.handleDrop;
  var patch7BaseRenderToolbarDropdown = MarkdownStudioApp.prototype.renderToolbarDropdown;

  MarkdownStudioApp.prototype.patch7ReplaceRange = function (start, end, text, selectionStartOffset, selectionEndOffset, callback) {
    var rangeStart = typeof start === 'number' ? start : 0;
    var rangeEnd = typeof end === 'number' ? end : rangeStart;
    var nextText = typeof text === 'string' ? text : '';
    var source = this.state.markdown || '';
    var newValue = source.slice(0, rangeStart) + nextText + source.slice(rangeEnd);
    var nextSelectionStart = rangeStart + (typeof selectionStartOffset === 'number' ? selectionStartOffset : nextText.length);
    var nextSelectionEnd = rangeStart + (typeof selectionEndOffset === 'number' ? selectionEndOffset : nextSelectionStart);
    var self = this;

    this.updateMarkdown(newValue, null, function () {
      self.focusSelection(nextSelectionStart, nextSelectionEnd);
      if (callback) {
        callback();
      }
    });
  };

  MarkdownStudioApp.prototype.patch7InsertQuickSnippetAtRange = function (kind, start, end) {
    var snippet = patch7GetQuickSnippet(kind);
    if (!snippet) {
      return;
    }
    this.patch7ReplaceRange(start, end, snippet.text, snippet.selectionStartOffset, snippet.selectionEndOffset);
    this.showToast('Inserted ' + snippet.label.toLowerCase() + '.', 'success');
  };

  MarkdownStudioApp.prototype.insertQuickSnippet = function (kind) {
    var context = this.getSelectionContext();
    var start = context ? context.start : (this.state.markdown || '').length;
    var end = context ? context.end : start;
    this.patch7InsertQuickSnippetAtRange(kind, start, end);
  };

  MarkdownStudioApp.prototype.openSlashMenuAtCursor = function () {
    var cursor = this.editorRef ? this.editorRef.selectionStart : 0;
    this.setState({
      slashMenuOpen: true,
      slashQuery: '',
      slashStart: cursor,
      slashEnd: cursor,
      slashUsesToken: false,
      slashSelectedIndex: 0,
      editorFocused: true
    }, function () {
      if (this.editorRef) {
        this.editorRef.focus();
      }
    }.bind(this));
  };

  MarkdownStudioApp.prototype.closeSlashMenu = function () {
    if (!this.state.slashMenuOpen && !this.state.slashQuery) {
      return;
    }
    this.setState({
      slashMenuOpen: false,
      slashQuery: '',
      slashStart: null,
      slashEnd: null,
      slashUsesToken: false,
      slashSelectedIndex: 0
    });
  };

  MarkdownStudioApp.prototype.getFilteredSlashCommandItems = function () {
    var query = String(this.state.slashQuery || '').trim().toLowerCase();
    var items = patch7SlashCommandItems(this);
    if (!query) {
      return items;
    }
    return items.filter(function (item) {
      var haystack = [item.label, item.description, item.keywords].join(' ').toLowerCase();
      return haystack.indexOf(query) !== -1;
    });
  };

  MarkdownStudioApp.prototype.updateSlashStateFromInput = function (value, cursor, isCollapsed) {
    if (!isCollapsed) {
      if (this.state.slashMenuOpen) {
        this.closeSlashMenu();
      }
      return;
    }

    var before = String(value || '').slice(0, cursor);
    var lineStart = before.lastIndexOf('\n') + 1;
    var linePrefix = before.slice(lineStart);
    var match = linePrefix.match(/(?:^|\s)\/([a-z0-9-]*)$/i);

    if (!match) {
      if (this.state.slashMenuOpen) {
        this.closeSlashMenu();
      }
      return;
    }

    var query = String(match[1] || '').toLowerCase();
    var slashStart = cursor - query.length - 1;
    var shouldResetSelection = !this.state.slashMenuOpen || query !== this.state.slashQuery || slashStart !== this.state.slashStart;
    var nextState = {
      slashMenuOpen: true,
      slashQuery: query,
      slashStart: slashStart,
      slashEnd: cursor,
      slashUsesToken: true
    };

    if (shouldResetSelection) {
      nextState.slashSelectedIndex = 0;
    }

    this.setState(nextState);
  };

  MarkdownStudioApp.prototype.runSlashCommand = function (commandId) {
    var items = patch7SlashCommandItems(this);
    var selected = null;
    var i = 0;

    for (i = 0; i < items.length; i += 1) {
      if (items[i].id === commandId) {
        selected = items[i];
        break;
      }
    }

    if (!selected) {
      return;
    }

    var start = typeof this.state.slashStart === 'number'
      ? this.state.slashStart
      : (this.editorRef ? this.editorRef.selectionStart : 0);
    var end = this.state.slashUsesToken
      ? (typeof this.state.slashEnd === 'number' ? this.state.slashEnd : start)
      : start;
    var self = this;

    this.setState({
      slashMenuOpen: false,
      slashQuery: '',
      slashStart: null,
      slashEnd: null,
      slashUsesToken: false,
      slashSelectedIndex: 0
    }, function () {
      selected.run({ start: start, end: end, app: self });
    });
  };

  MarkdownStudioApp.prototype.getSlashMenuTop = function () {
    if (!this.editorRef) {
      return 18;
    }
    var viewport = this.editorRef.clientHeight || 0;
    var top = EDITOR_PADDING_Y + ((this.state.currentLine - 1) * EDITOR_LINE_HEIGHT) - this.editorRef.scrollTop + EDITOR_LINE_HEIGHT + 10;
    return clamp(top, 16, Math.max(16, viewport - 220));
  };

  MarkdownStudioApp.prototype.toggleTypewriterMode = function () {
    this.setState({ typewriterMode: !this.state.typewriterMode }, function () {
      if (this.state.typewriterMode) {
        this.syncTypewriterView(true);
      }
    }.bind(this));
  };

  MarkdownStudioApp.prototype.toggleFocusParagraphMode = function () {
    this.setState({ focusParagraphMode: !this.state.focusParagraphMode }, function () {
      this.syncFocusParagraphMask();
    }.bind(this));
  };

  MarkdownStudioApp.prototype.toggleSpellcheck = function () {
    this.setState({ spellcheckEnabled: this.state.spellcheckEnabled === false ? true : !this.state.spellcheckEnabled });
  };

  MarkdownStudioApp.prototype.promptForWordGoal = function () {
    var current = patch7NormalizeWordGoal(this.state.wordGoal);
    var response = window.prompt('Set a word goal (enter 0 to clear it):', current ? String(current) : '800');
    if (response === null) {
      return;
    }
    var trimmed = String(response).trim();
    if (!trimmed || trimmed === '0') {
      this.clearWordGoal();
      return;
    }
    var nextGoal = patch7NormalizeWordGoal(trimmed);
    if (!nextGoal) {
      this.showToast('Enter a numeric word goal or 0 to clear it.', 'error');
      return;
    }
    this.setState({ wordGoal: nextGoal });
    this.showToast('Word goal set to ' + nextGoal + ' words.', 'success');
  };

  MarkdownStudioApp.prototype.clearWordGoal = function () {
    if (!patch7NormalizeWordGoal(this.state.wordGoal)) {
      this.setState({ wordGoal: 0 });
      return;
    }
    this.setState({ wordGoal: 0 });
    this.showToast('Word goal cleared.', 'success');
  };

  MarkdownStudioApp.prototype.handleEditorFocus = function () {
    if (!this.state.editorFocused) {
      this.setState({ editorFocused: true });
    }
    this.setActivePane('editor');
    this.handleEditorSelectionChange();
  };

  MarkdownStudioApp.prototype.handleEditorBlur = function () {
    var self = this;
    window.setTimeout(function () {
      if (document.activeElement !== self.editorRef) {
        self.setState({ editorFocused: false });
      }
    }, 24);
  };

  MarkdownStudioApp.prototype.syncTypewriterView = function (force) {
    if (!this.state.typewriterMode || !this.editorRef) {
      return;
    }
    var viewport = this.editorRef.clientHeight || 0;
    if (!viewport) {
      return;
    }
    var lineTop = EDITOR_PADDING_Y + ((Math.max(1, this.state.currentLine) - 1) * EDITOR_LINE_HEIGHT);
    var desiredScrollTop = Math.max(0, lineTop - Math.round(viewport * 0.42));
    if (force || Math.abs(this.editorRef.scrollTop - desiredScrollTop) > (EDITOR_LINE_HEIGHT * 1.35)) {
      this.editorRef.scrollTop = desiredScrollTop;
      this.syncEditorGutter();
      this.syncCurrentLineHighlight();
      this.syncScrollFrom('editor');
      this.syncFocusParagraphMask();
    }
  };

  MarkdownStudioApp.prototype.syncFocusParagraphMask = function () {
    if (!this.focusMaskRef || !this.editorRef) {
      return;
    }

    if (!this.state.focusParagraphMode || !this.state.editorFocused) {
      this.focusMaskRef.style.opacity = '0';
      if (this.focusBandRef) {
        this.focusBandRef.style.opacity = '0';
      }
      return;
    }

    var info = this.state.wrapEnabled
      ? { startLine: this.state.currentLine, endLine: this.state.currentLine, lineCount: 1 }
      : patch7GetParagraphInfo(this.state.markdown, this.editorRef.selectionStart || 0);
    var viewport = this.editorRef.clientHeight || 0;
    var top = EDITOR_PADDING_Y + ((Math.max(1, info.startLine) - 1) * EDITOR_LINE_HEIGHT) - this.editorRef.scrollTop - 6;
    var height = Math.max(EDITOR_LINE_HEIGHT + 10, (info.lineCount * EDITOR_LINE_HEIGHT) + 12);
    var focusTop = clamp(top, 0, Math.max(0, viewport));
    var focusBottom = clamp(top + height, 0, Math.max(0, viewport));

    this.focusMaskRef.style.opacity = '1';
    this.focusMaskRef.style.setProperty('--focus-top', focusTop + 'px');
    this.focusMaskRef.style.setProperty('--focus-bottom', focusBottom + 'px');

    if (this.focusBandRef) {
      this.focusBandRef.style.opacity = '1';
      this.focusBandRef.style.transform = 'translateY(' + focusTop + 'px)';
      this.focusBandRef.style.height = Math.max(EDITOR_LINE_HEIGHT, focusBottom - focusTop) + 'px';
    }
  };

  MarkdownStudioApp.prototype.insertImageFilesFromClipboardOrDrop = function (files, sourceLabel) {
    var self = this;
    if (!files || !files.length) {
      return;
    }

    Promise.all(files.map(function (file) {
      return readFileAsDataUrl(file);
    })).then(function (dataUrls) {
      var snippets = dataUrls.map(function (dataUrl, index) {
        var file = files[index];
        var baseName = file && file.name ? file.name.replace(/\.[^.]+$/, '') : ('Image ' + (index + 1));
        return patch7BuildMediaMarkdown(dataUrl, baseName);
      }).join('\n\n');

      self.setActivePane('editor');
      self.insertSnippet(snippets);
      self.showToast((files.length === 1 ? 'Inserted image' : ('Inserted ' + files.length + ' images')) + (sourceLabel ? ' from ' + sourceLabel : '') + '.', 'success');
    }).catch(function (error) {
      console.error(error);
      self.showToast('Unable to embed the selected image files.', 'error');
    });
  };

  MarkdownStudioApp.prototype.handleEditorPaste = function (event) {
    if (!event.clipboardData || !event.clipboardData.items) {
      return;
    }
    var items = event.clipboardData.items;
    var files = [];
    var i = 0;

    for (i = 0; i < items.length; i += 1) {
      if (items[i].kind === 'file') {
        var file = items[i].getAsFile();
        if (file && file.type && file.type.indexOf('image/') === 0) {
          files.push(file);
        }
      }
    }

    if (!files.length) {
      return;
    }

    maybePreventDefault(event);
    this.insertImageFilesFromClipboardOrDrop(files, 'clipboard');
  };

  MarkdownStudioApp.prototype.componentDidMount = function () {
    patch7BaseComponentDidMount.call(this);
    if (!this._patch7Bootstrapped) {
      var persisted = patch7ReadSettings();
      this._patch7Bootstrapped = true;
      this.setState({
        typewriterMode: !!persisted.typewriterMode,
        focusParagraphMode: !!persisted.focusParagraphMode,
        spellcheckEnabled: persisted.spellcheckEnabled !== false,
        wordGoal: patch7NormalizeWordGoal(persisted.wordGoal),
        selectionTextLength: 0,
        editorFocused: false,
        slashMenuOpen: false,
        slashQuery: '',
        slashStart: null,
        slashEnd: null,
        slashUsesToken: false,
        slashSelectedIndex: 0
      }, function () {
        this.syncFocusParagraphMask();
        if (this.state.typewriterMode) {
          this.syncTypewriterView(true);
        }
      }.bind(this));
    }
  };

  MarkdownStudioApp.prototype.componentDidUpdate = function (prevProps, prevState) {
    patch7BaseComponentDidUpdate.call(this, prevProps, prevState);

    if (
      prevState.typewriterMode !== this.state.typewriterMode ||
      prevState.focusParagraphMode !== this.state.focusParagraphMode ||
      prevState.spellcheckEnabled !== this.state.spellcheckEnabled ||
      prevState.wordGoal !== this.state.wordGoal
    ) {
      this.schedulePersistLocalState();
    }

    if (
      prevState.currentLine !== this.state.currentLine ||
      prevState.markdown !== this.state.markdown ||
      prevState.wrapEnabled !== this.state.wrapEnabled ||
      prevState.focusParagraphMode !== this.state.focusParagraphMode ||
      prevState.typewriterMode !== this.state.typewriterMode ||
      prevState.editorFocused !== this.state.editorFocused
    ) {
      this.syncFocusParagraphMask();
      if (this.state.typewriterMode) {
        this.syncTypewriterView(prevState.typewriterMode !== this.state.typewriterMode);
      }
    }

    var nextGoal = patch7NormalizeWordGoal(this.state.wordGoal);
    var prevWords = prevState.stats ? prevState.stats.words : 0;
    var nextWords = this.state.stats ? this.state.stats.words : 0;
    if (nextGoal && prevWords < nextGoal && nextWords >= nextGoal) {
      this.showToast('Word goal reached: ' + nextWords + ' / ' + nextGoal + '.', 'success');
    }

    if (this.state.slashMenuOpen) {
      var items = this.getFilteredSlashCommandItems();
      if (this.state.slashSelectedIndex >= items.length && this.state.slashSelectedIndex !== 0) {
        this.setState({ slashSelectedIndex: 0 });
      }
    }
  };

  MarkdownStudioApp.prototype.componentWillUnmount = function () {
    patch7BaseComponentWillUnmount.call(this);
  };

  MarkdownStudioApp.prototype.persistLocalState = function () {
    patch7BasePersistLocalState.call(this);
    try {
      var payload = patch7ReadSettings();
      payload.typewriterMode = !!this.state.typewriterMode;
      payload.focusParagraphMode = !!this.state.focusParagraphMode;
      payload.spellcheckEnabled = this.state.spellcheckEnabled !== false;
      payload.wordGoal = patch7NormalizeWordGoal(this.state.wordGoal);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.warn('Unable to persist Patch 7 settings.', error);
    }
  };

  MarkdownStudioApp.prototype.handleKeyDown = function (event) {
    var key = String(event && event.key || '').toLowerCase();
    if (event.altKey && event.shiftKey && !event.metaKey && !event.ctrlKey) {
      if (key === 't') {
        maybePreventDefault(event);
        this.toggleTypewriterMode();
        return;
      }
      if (key === 'p') {
        maybePreventDefault(event);
        this.toggleFocusParagraphMode();
        return;
      }
      if (key === 's') {
        maybePreventDefault(event);
        this.toggleSpellcheck();
        return;
      }
      if (key === 'g') {
        maybePreventDefault(event);
        this.promptForWordGoal();
        return;
      }
    }
    return patch7BaseHandleKeyDown.call(this, event);
  };

  MarkdownStudioApp.prototype.getCommandItems = function () {
    var self = this;
    return patch7BaseGetCommandItems.call(this).concat([
      {
        id: 'patch7-slash',
        group: 'Writing',
        title: 'Open slash commands',
        subtitle: 'Show the smart insert menu at the current cursor position',
        keywords: 'slash commands quick insert snippets',
        run: function () { self.openSlashMenuAtCursor(); }
      },
      {
        id: 'patch7-typewriter',
        group: 'Writing',
        title: this.state.typewriterMode ? 'Disable typewriter mode' : 'Enable typewriter mode',
        subtitle: 'Keep the current line closer to the center while drafting',
        keywords: 'typewriter focused drafting center line',
        run: function () { self.toggleTypewriterMode(); }
      },
      {
        id: 'patch7-focus-paragraph',
        group: 'Writing',
        title: this.state.focusParagraphMode ? 'Disable paragraph focus' : 'Enable paragraph focus',
        subtitle: 'Dim surrounding text and emphasize the current paragraph',
        keywords: 'paragraph focus writing calm dim',
        run: function () { self.toggleFocusParagraphMode(); }
      },
      {
        id: 'patch7-spellcheck',
        group: 'Writing',
        title: this.state.spellcheckEnabled === false ? 'Enable spellcheck' : 'Disable spellcheck',
        subtitle: 'Toggle browser spellcheck inside the markdown editor',
        keywords: 'spellcheck spelling editor text',
        run: function () { self.toggleSpellcheck(); }
      },
      {
        id: 'patch7-word-goal',
        group: 'Writing',
        title: patch7NormalizeWordGoal(this.state.wordGoal) ? 'Update word goal' : 'Set word goal',
        subtitle: 'Track progress toward a writing target in the status bar',
        keywords: 'word goal target progress writing',
        run: function () { self.promptForWordGoal(); }
      },
      {
        id: 'patch7-clear-goal',
        group: 'Writing',
        title: 'Clear word goal',
        subtitle: 'Remove the active writing target',
        keywords: 'clear word goal remove target',
        run: function () { self.clearWordGoal(); }
      },
      {
        id: 'patch7-snippet-checklist',
        group: 'Insert',
        title: 'Insert checklist snippet',
        subtitle: 'Start a reusable markdown checklist',
        keywords: 'snippet checklist tasks todo',
        run: function () { self.insertQuickSnippet('checklist'); }
      },
      {
        id: 'patch7-snippet-meeting',
        group: 'Insert',
        title: 'Insert meeting notes snippet',
        subtitle: 'Drop in a simple meeting-notes structure',
        keywords: 'snippet meeting agenda notes',
        run: function () { self.insertQuickSnippet('meeting'); }
      }
    ]);
  };

  MarkdownStudioApp.prototype.handleEditorChange = function (event) {
    patch7BaseHandleEditorChange.call(this, event);
    this.updateSlashStateFromInput(event.target.value, event.target.selectionStart, event.target.selectionStart === event.target.selectionEnd);
  };

  MarkdownStudioApp.prototype.handleEditorSelectionChange = function () {
    patch7BaseHandleEditorSelectionChange.call(this);
    if (!this.editorRef) {
      return;
    }

    var selectionLength = Math.abs((this.editorRef.selectionEnd || 0) - (this.editorRef.selectionStart || 0));
    var nextState = null;

    if (selectionLength !== (this.state.selectionTextLength || 0)) {
      nextState = Object.assign({}, nextState || {}, { selectionTextLength: selectionLength });
    }

    if (selectionLength > 0 && this.state.slashMenuOpen) {
      nextState = Object.assign({}, nextState || {}, {
        slashMenuOpen: false,
        slashQuery: '',
        slashStart: null,
        slashEnd: null,
        slashUsesToken: false,
        slashSelectedIndex: 0
      });
    }

    if (nextState) {
      this.setState(nextState);
    }

    this.syncFocusParagraphMask();
    if (this.state.typewriterMode) {
      this.syncTypewriterView(false);
    }
  };

  MarkdownStudioApp.prototype.handleEditorKeyDown = function (event) {
    if (this.state.slashMenuOpen) {
      var items = this.getFilteredSlashCommandItems();
      var currentIndex = clamp(this.state.slashSelectedIndex, 0, Math.max(0, items.length - 1));
      if (event.key === 'Escape') {
        maybePreventDefault(event);
        this.closeSlashMenu();
        return;
      }
      if (items.length) {
        if (event.key === 'ArrowDown') {
          maybePreventDefault(event);
          this.setState({ slashSelectedIndex: (currentIndex + 1) % items.length });
          return;
        }
        if (event.key === 'ArrowUp') {
          maybePreventDefault(event);
          this.setState({ slashSelectedIndex: (currentIndex - 1 + items.length) % items.length });
          return;
        }
        if (event.key === 'Enter' || event.key === 'Tab') {
          maybePreventDefault(event);
          this.runSlashCommand(items[currentIndex].id);
          return;
        }
      }
    }
    return patch7BaseHandleEditorKeyDown.call(this, event);
  };

  MarkdownStudioApp.prototype.handleEditorScroll = function () {
    patch7BaseHandleEditorScroll.call(this);
    this.syncFocusParagraphMask();
  };

  MarkdownStudioApp.prototype.handleDrop = function (event) {
    if (!event.dataTransfer || !event.dataTransfer.files || !event.dataTransfer.files.length) {
      return;
    }

    var files = Array.prototype.slice.call(event.dataTransfer.files || []);
    var imageFiles = files.filter(function (file) {
      return file && file.type && file.type.indexOf('image/') === 0;
    });

    if (imageFiles.length && imageFiles.length === files.length) {
      maybePreventDefault(event);
      this.setState({ dragHover: false });
      this.insertImageFilesFromClipboardOrDrop(imageFiles, 'drop');
      return;
    }

    return patch7BaseHandleDrop.call(this, event);
  };

  MarkdownStudioApp.prototype.resetWorkspacePreferences = function () {
    if (!window.confirm('Reset workspace preferences to the Patch 7 defaults?')) {
      return;
    }
    this.setState({
      theme: 'light',
      themePreset: 'sky',
      splitRatio: PATCH6_DEFAULT_SPLIT_RATIO,
      wrapEnabled: false,
      autosaveEnabled: true,
      showPreview: true,
      zenMode: false,
      focusMode: false,
      tabSize: 2,
      utilitySidebarOpen: false,
      utilitySidebarTab: 'outline',
      previewTheme: 'studio',
      customCss: '',
      printLayout: false,
      diskSyncEnabled: false,
      liteDiagramsEnabled: true,
      liteMathEnabled: true,
      editorFontSize: 15,
      reduceMotion: false,
      settingsOpen: false,
      toolbarMenu: null,
      documentMenuOpen: false,
      dividerHover: false,
      typewriterMode: false,
      focusParagraphMode: false,
      spellcheckEnabled: true,
      wordGoal: 0,
      slashMenuOpen: false,
      slashQuery: '',
      slashStart: null,
      slashEnd: null,
      slashUsesToken: false,
      slashSelectedIndex: 0,
      selectionTextLength: 0
    });
    this.showToast('Workspace preferences reset to the Patch 7 defaults.', 'success');
  };

  MarkdownStudioApp.prototype.renderToolbarDropdown = function () {
    var menu = this.state.toolbarMenu;
    if (menu !== 'insert' && menu !== 'tools') {
      return patch7BaseRenderToolbarDropdown.call(this);
    }

    var self = this;
    function action(key, label, description, icon, onClick, meta, active, disabled, primary) {
      return e(Patch6PanelAction, {
        key: key,
        label: label,
        description: description,
        icon: icon,
        meta: meta,
        active: !!active,
        disabled: !!disabled,
        primary: !!primary,
        onClick: function () {
          self.closeTransientMenus();
          onClick();
        }
      });
    }

    var metaMap = {
      insert: ['Insert', 'Use snippets, media builders, and block helpers without leaving the keyboard flow.'],
      tools: ['Tools', 'Patch 7 writing modes, word goals, and editor helpers tuned for focused drafting.']
    };

    var sections = [];

    if (menu === 'insert') {
      sections = [
        e(Patch6PanelSection, { key: 'snippets', title: 'Quick snippets', tip: 'Drop structure in one click' }, [
          action('snippetChecklist', 'Checklist', 'Insert a compact task-list starter.', '✓', function () { self.insertQuickSnippet('checklist'); }),
          action('snippetMeeting', 'Meeting notes', 'Insert agenda, notes, and next-step placeholders.', '🗒', function () { self.insertQuickSnippet('meeting'); }),
          action('snippetReview', 'Review summary', 'Insert wins, risks, and next-step sections.', '◇', function () { self.insertQuickSnippet('review'); }),
          action('snippetNote', 'Note callout', 'Insert a simple note callout block.', '💡', function () { self.insertQuickSnippet('noteCallout'); }),
          action('snippetCode', 'Code fence', 'Insert a JavaScript code fence starter.', '{}', function () { self.insertQuickSnippet('code'); })
        ]),
        e(Patch6PanelSection, { key: 'media', title: 'Media and links', tip: 'Embed at the cursor' }, [
          action('image', 'Image', 'Insert image markdown from a URL or local file.', '🖼', function () { self.openDialog('image'); }),
          action('gif', 'GIF', 'Insert an animated GIF from a URL or local file.', '🎞', function () { self.openDialog('gif'); }),
          action('file', 'File link', 'Embed or reference a local file or URL.', '📎', function () { self.openDialog('file'); })
        ]),
        e(Patch6PanelSection, { key: 'blocks', title: 'Blocks and helpers', tip: 'Structured markdown' }, [
          action('code', 'Code block', 'Open the fenced code builder with language selection.', '{}', function () { self.openDialog('code'); }),
          action('table', 'Table', 'Create a markdown table with custom size.', '▦', function () { self.openDialog('table'); }),
          action('callout', 'Callout', 'Insert a note, tip, warning, or important callout.', '💬', function () { self.openDialog('callout'); }),
          action('datetime', 'Date / time', 'Insert a local timestamp at the cursor.', '🕒', function () { self.openDialog('datetime'); })
        ])
      ];
    } else {
      var goal = patch7GetGoalProgress(this);
      sections = [
        e(Patch6PanelSection, { key: 'writing', title: 'Smart writing', tip: 'Keyboard-first drafting helpers' }, [
          action('slash', 'Slash commands', 'Open the smart insert menu at the current cursor position.', '/', function () { self.openSlashMenuAtCursor(); }, 'Type /'),
          action('typewriter', this.state.typewriterMode ? 'Disable typewriter mode' : 'Enable typewriter mode', 'Keep the active line closer to the center while you write.', '⌲', function () { self.toggleTypewriterMode(); }, this.state.typewriterMode ? 'On' : 'Off', this.state.typewriterMode),
          action('paragraph', this.state.focusParagraphMode ? 'Disable paragraph focus' : 'Enable paragraph focus', 'Dim surrounding text and isolate the current block.', '◫', function () { self.toggleFocusParagraphMode(); }, this.state.focusParagraphMode ? 'On' : 'Off', this.state.focusParagraphMode),
          action('spellcheck', this.state.spellcheckEnabled === false ? 'Enable spellcheck' : 'Disable spellcheck', 'Toggle browser spellcheck inside the markdown editor.', 'ABC', function () { self.toggleSpellcheck(); }, this.state.spellcheckEnabled === false ? 'Off' : 'On', this.state.spellcheckEnabled !== false),
          action('goal', goal ? 'Update word goal' : 'Set word goal', 'Track progress in the bottom status bar while you write.', '◎', function () { self.promptForWordGoal(); }, goal ? (goal.words + ' / ' + goal.goal) : 'Off'),
          action('clearGoal', 'Clear word goal', 'Remove the active writing target when you are done.', '⌫', function () { self.clearWordGoal(); }, null, false, !goal)
        ]),
        e(Patch6PanelSection, { key: 'editing', title: 'Editing helpers', tip: 'Stay in flow' }, [
          action('find', 'Find and replace', 'Search the markdown source and replace matches.', '⌕', function () { self.openFindBar(); }, 'Ctrl/Cmd + F'),
          action('undo', 'Undo', 'Step back through recent edits.', '↺', function () { self.performUndo(); }, null, false, !self.state.canUndo),
          action('redo', 'Redo', 'Re-apply an undone edit.', '↻', function () { self.performRedo(); }, null, false, !self.state.canRedo),
          action('wrap', self.state.wrapEnabled ? 'Disable wrap' : 'Enable wrap', 'Toggle visual wrapping in the editor.', '↵', function () { self.toggleWrap(); }, self.state.wrapEnabled ? 'Wrapped' : 'No wrap', self.state.wrapEnabled),
          action('autosave', self.state.autosaveEnabled ? 'Pause autosave' : 'Resume autosave', 'Toggle local draft storage while typing.', '◎', function () { self.toggleAutosave(); }, self.state.autosaveEnabled ? 'On' : 'Off', self.state.autosaveEnabled),
          action('top', 'Jump to top', 'Move quickly to the first line.', '↑', function () { self.jumpToTop(); }),
          action('bottom', 'Jump to bottom', 'Move quickly to the last line.', '↓', function () { self.jumpToBottom(); }),
          action('shortcuts', 'Shortcuts', 'Open the keyboard shortcut sheet.', '⌨', function () { self.openShortcuts(); }, 'F1')
        ]),
        e(Patch6PanelSection, { key: 'preferences', title: 'Editor preferences', tip: 'Applies immediately' }, [
          e(Patch6SelectField, {
            key: 'tabs',
            label: 'Tab size',
            value: self.state.tabSize,
            onChange: self.handleTabSizeChange,
            options: [
              { value: '2', label: '2 spaces' },
              { value: '4', label: '4 spaces' },
              { value: '8', label: '8 spaces' }
            ],
            title: 'Choose editor tab size'
          }),
          e(Patch6SelectField, {
            key: 'font',
            label: 'Editor font',
            value: self.state.editorFontSize || 15,
            onChange: self.handleEditorFontSizeChange.bind(self),
            options: PATCH5_EDITOR_FONT_SIZES,
            title: 'Choose editor font size'
          })
        ])
      ];
    }

    return e('div', { className: 'toolbar-panel toolbar-panel--patch7' }, [
      e('div', { key: 'header', className: 'toolbar-panel__header' }, [
        e('div', { key: 'copy' }, [
          e('h3', { key: 'title', className: 'toolbar-panel__title' }, metaMap[menu][0]),
          e('p', { key: 'subtitle', className: 'toolbar-panel__subtitle' }, metaMap[menu][1])
        ]),
        e('div', { key: 'meta', className: 'toolbar-panel__meta' }, [
          e(StatusChip, { key: 'esc' }, 'Esc to close'),
          e(StatusChip, { key: 'palette', tone: 'accent' }, 'Ctrl/Cmd + P')
        ])
      ]),
      e('div', { key: 'content', className: 'toolbar-panel__content custom-scroll' }, sections)
    ]);
  };

  MarkdownStudioApp.prototype.renderEditorPane = function () {
    var self = this;
    var goal = patch7GetGoalProgress(this);
    var slashItems = this.getFilteredSlashCommandItems().slice(0, 9);
    var selectionMeta = (this.state.selectionTextLength || 0) > 0
      ? ((this.state.selectionTextLength || 0) + ' selected')
      : 'Selection';

    return e('section', {
      className: cx(
        'pane pane--editor',
        this.state.activePane === 'editor' ? 'is-active-pane' : '',
        this.state.focusMode && this.state.activePane !== 'editor' ? 'is-dimmed-pane' : ''
      )
    }, [
      e('div', { key: 'header', className: 'pane-header pane-header--compact' }, [
        e('div', { key: 'titleWrap', className: 'pane-header__main' }, [
          e('span', { key: 'eyebrow', className: 'pane-header__eyebrow' }, 'Markdown source'),
          e('h2', { key: 'title', className: 'pane-title' }, 'Editor')
        ]),
        e('div', { key: 'actions', className: 'pane-header-actions' }, [
          e(StatusChip, { key: 'line', tone: 'accent' }, 'Line ' + this.state.currentLine),
          e(StatusChip, { key: 'words' }, this.state.stats.words + ' words'),
          goal ? e(StatusChip, { key: 'goal', tone: goal.reached ? 'success' : 'accent' }, 'Goal ' + goal.words + ' / ' + goal.goal) : null,
          e(ToolbarButton, { key: 'slash', onClick: this.openSlashMenuAtCursor.bind(this), label: 'Slash', icon: '/', title: 'Open slash commands at the cursor' }),
          e(ToolbarButton, { key: 'find', onClick: this.openFindBar, label: 'Find', icon: '⌕', title: 'Open find and replace (Ctrl/Cmd + F)' }),
          e(ToolbarButton, { key: 'wrap', onClick: this.toggleWrap, label: this.state.wrapEnabled ? 'Wrap on' : 'Wrap off', icon: '↵', title: 'Toggle word wrap', active: this.state.wrapEnabled })
        ])
      ]),
      this.renderFindBar(),
      e('div', {
        key: 'body',
        className: 'pane-body editor-body',
        onMouseEnter: function () { self.setActivePane('editor'); },
        onClick: function () { self.setActivePane('editor'); }
      }, [
        this.state.dragHover ? e('div', { key: 'overlay', className: 'drop-overlay' }, e('div', { className: 'drop-overlay__content' }, [
          e('strong', { key: 'title', className: 'drop-overlay__title' }, 'Drop files into the editor'),
          e('span', { key: 'copy', className: 'drop-overlay__copy' }, 'Drop a markdown file to open it locally, or drop images and GIFs to embed them directly as markdown.')
        ])) : null,
        e('div', {
          key: 'gutter',
          ref: function (node) { self.gutterRef = node; },
          className: cx('line-numbers custom-scroll editor-gutter', this.state.wrapEnabled ? 'is-muted' : '')
        }, e('div', null, createLineNumberElements(this.state.stats.lines, this.state.currentLine))),
        e('div', { key: 'inputWrap', className: 'editor-input-wrap' }, [
          e('div', {
            key: 'focusBand',
            ref: function (node) { self.focusBandRef = node; },
            className: cx('editor-focus-band', this.state.focusParagraphMode ? 'is-active' : '')
          }),
          e('div', {
            key: 'currentLine',
            ref: function (node) { self.currentLineHighlightRef = node; },
            className: cx('editor-current-line', this.state.wrapEnabled ? 'is-hidden' : '')
          }),
          e('textarea', {
            key: 'textarea',
            ref: function (node) { self.editorRef = node; },
            value: this.state.markdown,
            onChange: this.handleEditorChange,
            onScroll: this.handleEditorScroll,
            onKeyDown: this.handleEditorKeyDown,
            onKeyUp: this.handleEditorSelectionChange,
            onClick: this.handleEditorSelectionChange,
            onFocus: this.handleEditorFocus.bind(this),
            onBlur: this.handleEditorBlur.bind(this),
            onSelect: this.handleEditorSelectionChange,
            onPaste: this.handleEditorPaste.bind(this),
            onDragEnter: this.handleDragEnter,
            onDragLeave: this.handleDragLeave,
            spellCheck: this.state.spellcheckEnabled !== false,
            wrap: this.state.wrapEnabled ? 'soft' : 'off',
            style: {
              tabSize: this.state.tabSize,
              MozTabSize: this.state.tabSize
            },
            className: cx('editor-textarea custom-scroll', this.state.wrapEnabled ? 'is-wrapped' : ''),
            placeholder: 'Write markdown here...'
          }),
          e('div', {
            key: 'focusMask',
            ref: function (node) { self.focusMaskRef = node; },
            className: cx('editor-focus-mask', this.state.focusParagraphMode ? 'is-active' : '')
          }),
          e(Patch7SelectionToolbar, {
            key: 'selectionToolbar',
            visible: !!(this.state.editorFocused && (this.state.selectionTextLength || 0) > 0 && !this.state.slashMenuOpen),
            meta: selectionMeta,
            onBold: function () { self.applyInlineFormat('bold'); },
            onItalic: function () { self.applyInlineFormat('italic'); },
            onLink: function () { self.applyInlineFormat('link'); },
            onCode: function () { self.wrapSelection('`', '`', 'inline code'); },
            onQuote: function () { self.handleToolbarAction('quote'); },
            onNote: function () {
              self.replaceSelection(function (context) {
                var callout = buildCalloutMarkdown('NOTE', '', context.selected || 'Add note here.');
                return {
                  text: callout,
                  selectionStart: context.start,
                  selectionEnd: context.start + callout.length
                };
              });
            }
          }),
          e(Patch7SlashMenu, {
            key: 'slashMenu',
            open: !!this.state.slashMenuOpen,
            top: this.getSlashMenuTop(),
            query: this.state.slashQuery,
            fromTyping: !!this.state.slashUsesToken,
            items: slashItems,
            selectedIndex: clamp(this.state.slashSelectedIndex, 0, Math.max(0, slashItems.length - 1)),
            onHover: function (index) { self.setState({ slashSelectedIndex: index }); },
            onRun: function (id) { self.runSlashCommand(id); }
          })
        ])
      ])
    ]);
  };

  MarkdownStudioApp.prototype.renderStatusBar = function () {
    var goal = patch7GetGoalProgress(this);
    var signals = [
      e(StatusChip, { key: 'disk', tone: this.state.dirty ? 'warning' : 'success' }, patch6DiskLabel(this.state)),
      e(StatusChip, { key: 'autosave', tone: this.state.autosaveEnabled && this.state.autosaveStatus !== 'error' ? 'success' : 'warning' }, patch6AutosaveLabel(this.state))
    ];

    if (goal) {
      signals.push(e(StatusChip, { key: 'goal', tone: goal.reached ? 'success' : 'accent' }, 'Goal ' + goal.words + ' / ' + goal.goal));
    }
    if (this.state.typewriterMode) {
      signals.push(e(StatusChip, { key: 'typewriter', tone: 'accent' }, 'Typewriter'));
    }
    if (this.state.focusParagraphMode) {
      signals.push(e(StatusChip, { key: 'paragraph', tone: 'accent' }, 'Paragraph focus'));
    }
    if (this.state.spellcheckEnabled === false) {
      signals.push(e(StatusChip, { key: 'spell', tone: 'warning' }, 'Spell off'));
    }

    signals.push(e(StatusChip, { key: 'view' }, patch6ViewLabel(this)));
    signals.push(e(StatusChip, { key: 'split' }, patch6SplitLabel(this)));
    signals.push(e(StatusChip, { key: 'tabs' }, 'Tab ' + this.state.tabSize));
    signals.push(e(StatusChip, { key: 'wrap' }, this.state.wrapEnabled ? 'Wrap on' : 'Wrap off'));
    signals.push(e(StatusChip, { key: 'access', tone: 'accent' }, this.state.isFsApiAvailable ? 'Native access' : 'Download save'));

    return e('footer', { className: 'app-statusbar app-statusbar--patch6 app-statusbar--patch7' }, [
      e('div', { key: 'metrics', className: 'status-cluster status-cluster--metrics' }, [
        e(Patch6Metric, { key: 'words', label: 'Words', value: this.state.stats.words }),
        e(Patch6Metric, { key: 'chars', label: 'Chars', value: this.state.stats.characters }),
        e(Patch6Metric, { key: 'lines', label: 'Lines', value: this.state.stats.lines }),
        e(Patch6Metric, { key: 'read', label: 'Read', value: this.state.stats.readingMinutes ? this.state.stats.readingMinutes + ' min' : '--' })
      ]),
      e('div', { key: 'signals', className: 'status-cluster status-cluster--signals' }, signals)
    ]);
  };


  function Patch7WelcomeModal(props) {
    if (!props.open) {
      return null;
    }

    var quickShortcuts = [
      ['Type /', 'Slash commands'],
      ['Ctrl/Cmd + P', 'Command palette'],
      ['Alt + Shift + T', 'Typewriter mode'],
      ['Alt + Shift + P', 'Paragraph focus'],
      ['Ctrl/Cmd + V', 'Paste image'],
      ['F1', 'Shortcut sheet']
    ];

    return e('div', {
      className: 'modal-backdrop',
      onClick: function (event) {
        if (event.target === event.currentTarget) {
          props.onClose();
        }
      }
    }, e('div', { className: 'modal-card modal-card--welcome' }, [
      e('div', { key: 'header', className: 'modal-card__header modal-card__header--welcome' }, [
        e('div', { key: 'copy' }, [
          e('div', { key: 'eyebrow', className: 'welcome-eyebrow' }, PATCH7_VERSION_LABEL),
          e('h3', { key: 'title', className: 'modal-card__title welcome-title' }, 'Welcome to the smart-writing local markdown studio'),
          e('p', { key: 'subtitle', className: 'modal-card__subtitle welcome-subtitle' }, 'Patch 7 keeps the app fully local while moving the next layer of power directly into the editor with slash commands, contextual formatting, writing modes, and clipboard-friendly media inserts.')
        ]),
        e(ActionButton, {
          key: 'close',
          onClick: props.onClose,
          label: 'Close',
          compact: true,
          icon: '✕',
          title: 'Close quick start guide'
        })
      ]),
      e('div', { key: 'body', className: 'modal-card__body modal-card__body--welcome custom-scroll' }, [
        e('section', { key: 'hero', className: 'welcome-hero' }, [
          e('div', { key: 'left', className: 'welcome-panel welcome-panel--primary' }, [
            e('div', { key: 'chips', className: 'welcome-chip-row' }, [
              e(StatusChip, { key: 'local', tone: 'success' }, 'Fully local'),
              e(StatusChip, { key: 'smart', tone: 'accent' }, 'Smart writing'),
              e(StatusChip, { key: 'merged' }, 'Patches 1–7 merged')
            ]),
            e('h4', { key: 'stepsTitle', className: 'welcome-section-title' }, 'Best workflow to start fast'),
            e('ol', { key: 'steps', className: 'welcome-steps' }, [
              e('li', { key: '1' }, 'Open a file or start from a template. Native file handles still work when the browser supports them.'),
              e('li', { key: '2' }, 'Type `/` in the editor for headings, snippets, media, tables, callouts, and timestamps.'),
              e('li', { key: '3' }, 'Select text whenever you want the compact selection toolbar for inline formatting and note callouts.'),
              e('li', { key: '4' }, 'Turn on typewriter mode or paragraph focus when you want the editor to feel calmer on a laptop screen.'),
              e('li', { key: '5' }, 'Paste or drop images into the editor, then export or save locally when the note is ready.')
            ])
          ]),
          e('div', { key: 'right', className: 'welcome-panel' }, [
            e('h4', { key: 'shortcutsTitle', className: 'welcome-section-title' }, 'Quick shortcut cheat sheet'),
            e('div', { key: 'shortcuts', className: 'welcome-shortcuts' }, quickShortcuts.map(function (item) {
              return e('div', { key: item[0], className: 'welcome-shortcut' }, [
                e('kbd', { key: 'key', className: 'shortcut-item__key' }, item[0]),
                e('span', { key: 'label', className: 'welcome-shortcut__label' }, item[1])
              ]);
            })),
            e('div', { key: 'help', className: 'welcome-note' }, 'Tip: use the command palette for global actions, but prefer slash commands and the selection toolbar when you are actively writing.')
          ])
        ]),
        e('section', { key: 'patches', className: 'welcome-feature-grid' }, [
          e('article', { key: 'slash', className: 'welcome-feature-card' }, [
            e('h4', { key: 'title', className: 'welcome-feature-card__title' }, 'Slash commands'),
            e('p', { key: 'copy', className: 'welcome-feature-card__copy' }, 'Headings, snippets, media, tables, and callouts now open from the editor itself instead of requiring more permanent toolbar space.')
          ]),
          e('article', { key: 'focus', className: 'welcome-feature-card' }, [
            e('h4', { key: 'title', className: 'welcome-feature-card__title' }, 'Writing focus'),
            e('p', { key: 'copy', className: 'welcome-feature-card__copy' }, 'Typewriter mode, paragraph focus, spellcheck, and word goals make drafting feel lighter without removing your live preview or local file workflows.')
          ]),
          e('article', { key: 'media', className: 'welcome-feature-card' }, [
            e('h4', { key: 'title', className: 'welcome-feature-card__title' }, 'Media flow'),
            e('p', { key: 'copy', className: 'welcome-feature-card__copy' }, 'Paste images from the clipboard or drag them into the editor to embed them directly as markdown data URLs, still fully local.')
          ])
        ])
      ]),
      e('div', { key: 'footer', className: 'modal-card__footer modal-card__footer--welcome' }, [
        e('div', { key: 'left', className: 'settings-actions' }, [
          e(ActionButton, { key: 'templates', onClick: props.onTemplates, label: 'Templates', compact: true, icon: '◇' }),
          e(ActionButton, { key: 'shortcuts', onClick: props.onShortcuts, label: 'Shortcuts', compact: true, icon: '⌨' }),
          e(ActionButton, { key: 'settings', onClick: props.onSettings, label: 'Settings', compact: true, icon: '⚙' }),
          e(ActionButton, { key: 'updates', onClick: props.onReleaseNotes, label: 'Updates', compact: true, icon: '✦' })
        ]),
        e(ActionButton, { key: 'start', onClick: props.onClose, label: 'Start writing', compact: true, primary: true, icon: '→' })
      ])
    ]));
  }

  function Patch7ReleaseNotesModal(props) {
    if (!props.open) {
      return null;
    }

    return e('div', {
      className: 'modal-backdrop',
      onClick: function (event) {
        if (event.target === event.currentTarget) {
          props.onClose();
        }
      }
    }, e('div', { className: 'modal-card modal-card--release' }, [
      e('div', { key: 'header', className: 'modal-card__header' }, [
        e('div', { key: 'copy' }, [
          e('h3', { key: 'title', className: 'modal-card__title' }, 'Release notes and patch history'),
          e('p', { key: 'subtitle', className: 'modal-card__subtitle' }, 'Everything shipped across patches 1 through 7, including the smart-writing layer added in Patch 7 and the supporting files your agent can use while merging changes.')
        ]),
        e(ActionButton, {
          key: 'close',
          onClick: props.onClose,
          label: 'Close',
          compact: true,
          icon: '✕',
          title: 'Close release notes'
        })
      ]),
      e('div', { key: 'body', className: 'modal-card__body custom-scroll' }, [
        e('div', { key: 'hero', className: 'welcome-chip-row' }, [
          e(StatusChip, { key: 'current', tone: 'accent' }, PATCH7_VERSION_LABEL),
          e(StatusChip, { key: 'local', tone: 'success' }, 'Fully local'),
          e(StatusChip, { key: 'history' }, 'Patch history')
        ]),
        (PATCH5_RELEASE_SECTIONS || []).map(function (section) {
          return e('section', { key: section.title, className: 'release-section' }, [
            e('h4', { key: 'title', className: 'release-section__title' }, section.title),
            e('ul', { key: 'list', className: 'release-section__list' }, (section.items || []).map(function (item, index) {
              return e('li', { key: section.title + index, className: 'release-section__item' }, item);
            }))
          ]);
        })
      ]),
      e('div', { key: 'footer', className: 'modal-card__footer' }, [
        e(StatusChip, { key: 'hint', tone: 'accent' }, 'Tip: copy the summary if your agent needs a patch overview'),
        e('div', { key: 'actions', className: 'settings-actions' }, [
          e(ActionButton, { key: 'copy', onClick: props.onCopy, label: 'Copy summary', compact: true, icon: '⧉' }),
          e(ActionButton, { key: 'done', onClick: props.onClose, label: 'Done', compact: true, primary: true, icon: '✓' })
        ])
      ])
    ]));
  }

  MarkdownStudioApp.prototype.renderWelcomeModal = function () {
    return e(Patch7WelcomeModal, {
      open: !!this.state.welcomeOpen,
      onClose: this.closeWelcomeModal.bind(this),
      onTemplates: function () {
        this.closeWelcomeModal();
        this.openTemplatesModal();
      }.bind(this),
      onShortcuts: function () {
        this.closeWelcomeModal();
        this.openShortcuts();
      }.bind(this),
      onSettings: function () {
        this.closeWelcomeModal();
        this.openSettings();
      }.bind(this),
      onReleaseNotes: function () {
        this.closeWelcomeModal();
        this.openReleaseNotesModal();
      }.bind(this)
    });
  };

  MarkdownStudioApp.prototype.renderReleaseNotesModal = function () {
    return e(Patch7ReleaseNotesModal, {
      open: !!this.state.releaseNotesOpen,
      onClose: this.closeReleaseNotesModal.bind(this),
      onCopy: this.copyReleaseNotesSummary.bind(this)
    });
  };


  /* ===== Patch 8: stability, accessibility, performance, and laptop polish ===== */
  var PATCH8_VERSION_TOKEN = 'patch8-stability-accessibility-performance';
  var PATCH8_VERSION_LABEL = 'Workspace refinement';

  PATCH5_VERSION_TOKEN = PATCH8_VERSION_TOKEN;
  PATCH5_VERSION_LABEL = PATCH8_VERSION_LABEL;
  PATCH6_VERSION_TOKEN = PATCH8_VERSION_TOKEN;
  PATCH6_VERSION_LABEL = PATCH8_VERSION_LABEL;
  PATCH7_VERSION_TOKEN = PATCH8_VERSION_TOKEN;
  PATCH7_VERSION_LABEL = PATCH8_VERSION_LABEL;
  PATCH6_DEFAULT_SPLIT_RATIO = 66;
  PATCH6_MIN_SPLIT = 42;
  PATCH6_MAX_SPLIT = 78;

  PATCH5_RELEASE_SECTIONS = [{
    title: 'Workspace refinement',
    items: [
      'The top chrome is smaller and calmer: grouped menus stay available, but noisy patch labels and static status text are no longer emphasized in the interface.',
      'The default split now gives the editor more room on laptop screens while keeping the live preview available on the right.',
      'The preview sync meter now stretches to the same framed width as the preview scroller, so it feels aligned instead of floating.',
      'Workspace menus, settings, release notes, and other long surfaces now behave better on shorter laptop screens with stronger internal scrolling.',
      'Patch 8 also refreshes the README, changelog, QA checklist, sample content, and agent guide for the hardening pass.'
    ]
  }].concat(PATCH5_RELEASE_SECTIONS && PATCH5_RELEASE_SECTIONS.slice ? PATCH5_RELEASE_SECTIONS.slice() : (PATCH5_RELEASE_SECTIONS || []));

  DEFAULT_MARKDOWN = [
    '# Markdown Studio Local',
    '',
    'This refined build keeps the **editor on the left** and the **preview on the right**, while reducing permanent chrome so a laptop screen can stay focused on writing.',
    '',
    '## What to verify',
    '',
    '- [x] The divider starts editor-first and still supports drag plus double-click reset',
    '- [x] The preview sync meter matches the framed width of the preview area',
    '- [x] File state, autosave, and view mode stay compact instead of living as large static labels',
    '- [x] Workspace menus, settings, release notes, and longer panels scroll cleanly on smaller screens',
    '- [x] Slash commands, selection actions, exports, templates, snapshots, and style tools all remain available',
    '',
    '## Recommended workflow',
    '',
    '1. Use the file button in the header whenever you need document details, save state, or quick file actions.',
    '2. Keep **Format** for frequent markdown actions and open **Insert**, **View**, **Tools**, or **Workspace** only when you need deeper controls.',
    '3. Drag the center divider to review a note, or double-click it to reset to the laptop-friendly editor-first layout.',
    '4. Open **Settings** or **Release notes** from the Workspace menu so they stay available without stealing writing space full time.',
    '',
    '> [!TIP]',
    '> Type `/` in the editor for headings, media, snippets, tables, and callouts without leaving the keyboard flow.',
    '',
    '## Sample table',
    '',
    '| Area | Improvement |',
    '| :--- | :--- |',
    '| Header | Less noise, quicker file context |',
    '| Toolbar | Grouped actions with fewer permanent buttons |',
    '| Preview | Better alignment and meter width |',
    '| Laptop UX | More writing room and stronger scrolling behavior |',
    '',
    '```js',
    'function keepTheChromeCalm() {',
    '  return "More writing room, fewer always-on labels.";',
    '}',
    '```',
    '',
    'Open the Workspace menu whenever you want templates, snapshots, style tools, settings, or release notes, then close it and return to writing.'
  ].join('\n');

  for (var patch8TemplateIndex = 0; patch8TemplateIndex < PATCH4_TEMPLATE_LIBRARY.length; patch8TemplateIndex += 1) {
    if (PATCH4_TEMPLATE_LIBRARY[patch8TemplateIndex].id === 'final-qa-checklist') {
      PATCH4_TEMPLATE_LIBRARY[patch8TemplateIndex].description = 'A merged-build verification sheet including Patch 8 laptop, scrolling, and chrome-reduction checks.';
      PATCH4_TEMPLATE_LIBRARY[patch8TemplateIndex].content = [
        '---',
        'title: Final QA checklist',
        'owner: Local app review',
        'status: Draft',
        'tags: [qa, validation, release]',
        '---',
        '',
        '# Final QA checklist',
        '',
        '## Patch 8 workspace refinement',
        '',
        '- [ ] The editor still stays on the left and the preview stays on the right in split view',
        '- [ ] The preview sync meter spans the same framed width as the preview content area',
        '- [ ] Header chrome feels smaller and less noisy than Patch 7',
        '- [ ] Workspace settings, release notes, welcome, and other long surfaces scroll on a laptop screen',
        '- [ ] The divider shows hover help, live ratios, and double-click reset',
        '',
        '## Core workspace',
        '',
        '- [ ] Live preview updates while typing',
        '- [ ] Synced scrolling still works both ways',
        '- [ ] Slash commands, selection toolbar, and writing modes still work',
        '',
        '## Files and exports',
        '',
        '- [ ] Native open/save works when served on localhost',
        '- [ ] TXT, HTML, PDF, and DOCX exports complete successfully',
        '',
        '## Power features',
        '',
        '- [ ] Templates, versions, snapshots, diff, style studio, settings, and release notes all open correctly',
        '- [ ] The bottom status bar stays compact and the app remains comfortable on 14-inch laptops'
      ].join('\n');
      break;
    }
  }

  for (var patch8ShortcutIndex = 0; patch8ShortcutIndex < SHORTCUT_GROUPS.length; patch8ShortcutIndex += 1) {
    if (SHORTCUT_GROUPS[patch8ShortcutIndex].title === 'Smart writing') {
      SHORTCUT_GROUPS[patch8ShortcutIndex].title = 'Writing flow';
    }
  }

  var patch8BaseRenderToolbarDropdown = MarkdownStudioApp.prototype.renderToolbarDropdown;

  MarkdownStudioApp.prototype.resetWorkspacePreferences = function () {
    if (!window.confirm('Reset workspace preferences to the default workspace layout?')) {
      return;
    }
    this.setState({
      theme: 'light',
      themePreset: 'sky',
      splitRatio: PATCH6_DEFAULT_SPLIT_RATIO,
      wrapEnabled: false,
      autosaveEnabled: true,
      showPreview: true,
      zenMode: false,
      focusMode: false,
      tabSize: 2,
      utilitySidebarOpen: false,
      utilitySidebarTab: 'outline',
      previewTheme: 'studio',
      customCss: '',
      printLayout: false,
      diskSyncEnabled: false,
      liteDiagramsEnabled: true,
      liteMathEnabled: true,
      editorFontSize: 15,
      reduceMotion: false,
      settingsOpen: false,
      toolbarMenu: null,
      documentMenuOpen: false,
      dividerHover: false,
      typewriterMode: false,
      focusParagraphMode: false,
      spellcheckEnabled: true,
      wordGoal: 0,
      slashMenuOpen: false,
      slashQuery: '',
      slashStart: null,
      slashEnd: null,
      slashUsesToken: false,
      slashSelectedIndex: 0,
      selectionTextLength: 0
    });
    this.showToast('Workspace preferences reset.', 'success');
  };

  MarkdownStudioApp.prototype.renderDocumentPopover = function () {
    var self = this;
    return e('div', { className: 'topbar-doc-popover topbar-doc-popover--patch8 custom-scroll' }, [
      e('div', { key: 'hero', className: 'topbar-doc-popover__hero' }, [
        e(StatusChip, { key: 'disk', tone: this.state.dirty ? 'warning' : 'success' }, patch6DiskLabel(this.state)),
        e(StatusChip, { key: 'autosave', tone: this.state.autosaveEnabled && this.state.autosaveStatus !== 'error' ? 'accent' : 'warning' }, patch6AutosaveLabel(this.state)),
        e(StatusChip, { key: 'view', tone: 'accent' }, patch6ViewLabel(this))
      ]),
      e('div', { key: 'summary', className: 'patch8-doc-summary' }, [
        e('div', { key: 'access', className: 'patch8-doc-summary__item' }, [
          e('span', { key: 'label', className: 'patch8-doc-summary__label' }, 'File access'),
          e('strong', { key: 'value', className: 'patch8-doc-summary__value' }, this.state.isFsApiAvailable ? 'Native access ready' : 'Download save mode')
        ]),
        e('div', { key: 'saved', className: 'patch8-doc-summary__item' }, [
          e('span', { key: 'label', className: 'patch8-doc-summary__label' }, 'Last disk save'),
          e('strong', { key: 'value', className: 'patch8-doc-summary__value' }, this.state.lastSavedAt ? formatDateTime(this.state.lastSavedAt) : 'Not saved yet')
        ]),
        e('div', { key: 'draft', className: 'patch8-doc-summary__item' }, [
          e('span', { key: 'label', className: 'patch8-doc-summary__label' }, 'Draft state'),
          e('strong', { key: 'value', className: 'patch8-doc-summary__value' }, patch6AutosaveLabel(this.state))
        ]),
        e('div', { key: 'split', className: 'patch8-doc-summary__item' }, [
          e('span', { key: 'label', className: 'patch8-doc-summary__label' }, 'Layout'),
          e('strong', { key: 'value', className: 'patch8-doc-summary__value' }, patch6ViewLabel(this) + ' · ' + patch6SplitLabel(this))
        ])
      ]),
      e('div', { key: 'actions', className: 'topbar-doc-popover__actions' }, [
        e(ActionButton, {
          key: 'new',
          onClick: function () { self.closeTransientMenus(); self.handleNewDocument(); },
          label: 'New',
          compact: true,
          icon: '＋'
        }),
        e(ActionButton, {
          key: 'open',
          onClick: function () { self.closeTransientMenus(); self.handleOpenFile(); },
          label: 'Open',
          compact: true,
          icon: '↥'
        }),
        e(ActionButton, {
          key: 'saveAs',
          onClick: function () { self.closeTransientMenus(); self.handleSaveAsFile(); },
          label: 'Save As',
          compact: true,
          icon: '⇪'
        }),
        e(ActionButton, {
          key: 'settings',
          onClick: function () { self.closeTransientMenus(); self.openSettings(); },
          label: 'Settings',
          compact: true,
          icon: '⚙'
        })
      ])
    ]);
  };

  MarkdownStudioApp.prototype.renderHeader = function () {
    var self = this;
    var isSplit = this.isPreviewVisible() && !this.state.zenMode;
    var isEditorOnly = !this.isPreviewVisible() && !this.state.zenMode;

    return e('header', { className: 'app-topbar app-topbar--patch6 app-topbar--patch8' }, [
      e('div', { key: 'left', className: 'topbar-left topbar-left--patch8' }, [
        e('div', { key: 'docWrap', className: 'topbar-doc-wrap' }, [
          e('button', {
            key: 'doc',
            type: 'button',
            onClick: this.toggleDocumentMenu.bind(this),
            className: cx('topbar-doc-anchor topbar-doc-anchor--patch8', this.state.documentMenuOpen ? 'is-active' : ''),
            title: 'Open document details, save state, and quick file actions'
          }, [
            e('span', { key: 'logo', className: 'brand-logo brand-logo--mini', 'aria-hidden': 'true' }, 'M'),
            e('span', { key: 'indicator', className: cx('save-indicator', this.state.dirty ? 'is-dirty' : 'is-clean') }),
            e('div', { key: 'copy', className: 'topbar-doc-copy' }, [
              e('strong', { key: 'title', className: 'topbar-doc-title' }, this.state.fileName || 'untitled.md'),
              e('span', { key: 'subtitle', className: 'topbar-doc-state topbar-doc-state--muted' }, this.state.dirty ? 'Edited locally' : 'Saved locally')
            ]),
            e('span', { key: 'chevron', className: 'topbar-doc-chevron', 'aria-hidden': 'true' }, this.state.documentMenuOpen ? '▴' : '▾')
          ]),
          this.state.documentMenuOpen ? this.renderDocumentPopover() : null
        ])
      ]),
      e('div', { key: 'center', className: 'topbar-center topbar-center--patch8' },
        e('div', { className: 'view-segment', role: 'tablist', 'aria-label': 'Workspace view mode' }, [
          e(Patch6SegmentButton, {
            key: 'split',
            label: 'Split',
            active: isSplit,
            onClick: function () { self.setWorkspaceView('split'); },
            title: 'Show editor and preview side by side'
          }),
          e(Patch6SegmentButton, {
            key: 'editor',
            label: 'Editor',
            active: isEditorOnly,
            onClick: function () { self.setWorkspaceView('editor'); },
            title: 'Hide the preview and keep only the editor visible'
          }),
          e(Patch6SegmentButton, {
            key: 'zen',
            label: 'Zen',
            active: this.state.zenMode,
            onClick: function () { self.setWorkspaceView('zen'); },
            title: 'Stretch the editor and reduce chrome'
          })
        ])
      ),
      e('div', { key: 'actions', className: 'topbar-actions topbar-actions--compact topbar-actions--patch8' }, [
        e(ActionButton, { key: 'open', onClick: this.handleOpenFile, label: 'Open', compact: true, icon: '↥', title: 'Open a markdown file (Ctrl/Cmd + O)' }),
        e(ActionButton, { key: 'save', onClick: this.handleSaveFile, label: 'Save', compact: true, primary: true, icon: '💾', title: 'Save current document (Ctrl/Cmd + S)' }),
        e(ActionButton, { key: 'palette', onClick: this.openCommandPalette, label: 'Palette', compact: true, icon: '⌘', title: 'Open command palette (Ctrl/Cmd + P)' }),
        e(ActionButton, { key: 'theme', onClick: this.handleThemeToggle, label: this.state.theme === 'dark' ? 'Light' : 'Dark', compact: true, icon: this.state.theme === 'dark' ? '☀' : '☾', title: 'Toggle light and dark themes' })
      ])
    ]);
  };

  MarkdownStudioApp.prototype.renderToolbar = function () {
    var self = this;
    return e('section', { className: 'toolbar-shell toolbar-shell--patch8' }, [
      e('div', { key: 'bar', className: 'toolbar-menubar toolbar-menubar--patch8' }, [
        e('div', { key: 'left', className: 'toolbar-menubar__left toolbar-menubar__left--patch8 custom-scroll' }, [
          e(Patch6MenuTrigger, { key: 'format', label: 'Format', icon: '✎', active: this.state.toolbarMenu === 'format', onClick: function () { self.toggleToolbarMenu('format'); }, title: 'Show formatting groups' }),
          e(Patch6MenuTrigger, { key: 'insert', label: 'Insert', icon: '＋', active: this.state.toolbarMenu === 'insert', onClick: function () { self.toggleToolbarMenu('insert'); }, title: 'Show insert builders and snippets' }),
          e(Patch6MenuTrigger, { key: 'export', label: 'Export', icon: '⇪', active: this.state.toolbarMenu === 'export', onClick: function () { self.toggleToolbarMenu('export'); }, title: 'Show export options' }),
          e(Patch6MenuTrigger, { key: 'view', label: 'View', icon: '⇆', active: this.state.toolbarMenu === 'view', onClick: function () { self.toggleToolbarMenu('view'); }, title: 'Show layout and preview controls' }),
          e(Patch6MenuTrigger, { key: 'tools', label: 'Tools', icon: '⚙', active: this.state.toolbarMenu === 'tools', onClick: function () { self.toggleToolbarMenu('tools'); }, title: 'Show editor helpers and writing controls' }),
          e(Patch6MenuTrigger, { key: 'panels', label: 'Panels', icon: '☰', active: this.state.toolbarMenu === 'panels', onClick: function () { self.toggleToolbarMenu('panels'); }, title: 'Show outline, stats, and recent sessions' }),
          e(Patch6MenuTrigger, { key: 'workspace', label: 'Workspace', icon: '◇', active: this.state.toolbarMenu === 'workspace', onClick: function () { self.toggleToolbarMenu('workspace'); }, title: 'Show templates, snapshots, settings, and updates' })
        ]),
        e('div', { key: 'right', className: 'toolbar-menubar__right toolbar-menubar__right--patch8' }, [
          e(ToolbarButton, { key: 'bold', onClick: function () { self.applyInlineFormat('bold'); }, label: 'Bold', icon: 'B', title: 'Bold (Ctrl/Cmd + B)', emphasis: true }),
          e(ToolbarButton, { key: 'italic', onClick: function () { self.applyInlineFormat('italic'); }, label: 'Italic', icon: 'I', title: 'Italic (Ctrl/Cmd + I)', emphasis: true }),
          e(ToolbarButton, { key: 'link', onClick: function () { self.applyInlineFormat('link'); }, label: 'Link', icon: '🔗', title: 'Insert link (Ctrl/Cmd + K)' }),
          e(ToolbarButton, { key: 'code', onClick: function () { self.wrapSelection('`', '`', 'inline code'); }, label: 'Code', icon: '{}', title: 'Wrap the current selection in inline code' }),
          e(ToolbarButton, { key: 'slash', onClick: function () { self.openSlashMenuAtCursor(); }, label: 'Slash', icon: '/', title: 'Open slash commands at the cursor' })
        ])
      ]),
      this.state.toolbarMenu ? this.renderToolbarDropdown() : null
    ]);
  };

  MarkdownStudioApp.prototype.renderToolbarDropdown = function () {
    var menu = this.state.toolbarMenu;
    if (menu !== 'insert' && menu !== 'tools') {
      return patch8BaseRenderToolbarDropdown.call(this);
    }

    var self = this;
    function action(key, label, description, icon, onClick, meta, active, disabled, primary) {
      return e(Patch6PanelAction, {
        key: key,
        label: label,
        description: description,
        icon: icon,
        meta: meta,
        active: !!active,
        disabled: !!disabled,
        primary: !!primary,
        onClick: function () {
          self.closeTransientMenus();
          onClick();
        }
      });
    }

    var metaMap = {
      insert: ['Insert', 'Place snippets, media, tables, and helpers at the cursor without leaving the writing flow.'],
      tools: ['Tools', 'Keep drafting fast with writing modes, goals, search, and editor preferences grouped in one place.']
    };

    var sections = [];

    if (menu === 'insert') {
      sections = [
        e(Patch6PanelSection, { key: 'snippets', title: 'Quick snippets', tip: 'Drop structure in one click' }, [
          action('snippetChecklist', 'Checklist', 'Insert a compact task-list starter.', '✓', function () { self.insertQuickSnippet('checklist'); }),
          action('snippetMeeting', 'Meeting notes', 'Insert agenda, notes, and next-step placeholders.', '🗒', function () { self.insertQuickSnippet('meeting'); }),
          action('snippetReview', 'Review summary', 'Insert wins, risks, and next-step sections.', '◇', function () { self.insertQuickSnippet('review'); }),
          action('snippetNote', 'Note callout', 'Insert a simple note callout block.', '💡', function () { self.insertQuickSnippet('noteCallout'); }),
          action('snippetCode', 'Code fence', 'Insert a JavaScript code fence starter.', '{}', function () { self.insertQuickSnippet('code'); })
        ]),
        e(Patch6PanelSection, { key: 'media', title: 'Media and links', tip: 'Embed at the cursor' }, [
          action('image', 'Image', 'Insert image markdown from a URL or local file.', '🖼', function () { self.openDialog('image'); }),
          action('gif', 'GIF', 'Insert an animated GIF from a URL or local file.', '🎞', function () { self.openDialog('gif'); }),
          action('file', 'File link', 'Embed or reference a local file or URL.', '📎', function () { self.openDialog('file'); })
        ]),
        e(Patch6PanelSection, { key: 'blocks', title: 'Blocks and helpers', tip: 'Structured markdown' }, [
          action('code', 'Code block', 'Open the fenced code builder with language selection.', '{}', function () { self.openDialog('code'); }),
          action('table', 'Table', 'Create a markdown table with custom size.', '▦', function () { self.openDialog('table'); }),
          action('callout', 'Callout', 'Insert a note, tip, warning, or important callout.', '💬', function () { self.openDialog('callout'); }),
          action('datetime', 'Date / time', 'Insert a local timestamp at the cursor.', '🕒', function () { self.openDialog('datetime'); })
        ])
      ];
    } else {
      var goal = patch7GetGoalProgress(this);
      sections = [
        e(Patch6PanelSection, { key: 'writing', title: 'Writing flow', tip: 'Keyboard-first drafting helpers' }, [
          action('slash', 'Slash commands', 'Open the insert menu at the current cursor position.', '/', function () { self.openSlashMenuAtCursor(); }, 'Type /'),
          action('typewriter', this.state.typewriterMode ? 'Disable typewriter mode' : 'Enable typewriter mode', 'Keep the active line closer to the center while you write.', '⌲', function () { self.toggleTypewriterMode(); }, this.state.typewriterMode ? 'On' : 'Off', this.state.typewriterMode),
          action('paragraph', this.state.focusParagraphMode ? 'Disable paragraph focus' : 'Enable paragraph focus', 'Dim surrounding text and isolate the current block.', '◫', function () { self.toggleFocusParagraphMode(); }, this.state.focusParagraphMode ? 'On' : 'Off', this.state.focusParagraphMode),
          action('spellcheck', this.state.spellcheckEnabled === false ? 'Enable spellcheck' : 'Disable spellcheck', 'Toggle browser spellcheck inside the markdown editor.', 'ABC', function () { self.toggleSpellcheck(); }, this.state.spellcheckEnabled === false ? 'Off' : 'On', this.state.spellcheckEnabled !== false),
          action('goal', goal ? 'Update word goal' : 'Set word goal', 'Track progress in the bottom status bar while you write.', '◎', function () { self.promptForWordGoal(); }, goal ? (goal.words + ' / ' + goal.goal) : 'Off'),
          action('clearGoal', 'Clear word goal', 'Remove the active writing target when you are done.', '⌫', function () { self.clearWordGoal(); }, null, false, !goal)
        ]),
        e(Patch6PanelSection, { key: 'editing', title: 'Editing helpers', tip: 'Stay in flow' }, [
          action('find', 'Find and replace', 'Search the markdown source and replace matches.', '⌕', function () { self.openFindBar(); }, 'Ctrl/Cmd + F'),
          action('undo', 'Undo', 'Step back through recent edits.', '↺', function () { self.performUndo(); }, null, false, !self.state.canUndo),
          action('redo', 'Redo', 'Re-apply an undone edit.', '↻', function () { self.performRedo(); }, null, false, !self.state.canRedo),
          action('wrap', self.state.wrapEnabled ? 'Disable wrap' : 'Enable wrap', 'Toggle visual wrapping in the editor.', '↵', function () { self.toggleWrap(); }, self.state.wrapEnabled ? 'Wrapped' : 'No wrap', self.state.wrapEnabled),
          action('autosave', self.state.autosaveEnabled ? 'Pause autosave' : 'Resume autosave', 'Toggle local draft storage while typing.', '◎', function () { self.toggleAutosave(); }, self.state.autosaveEnabled ? 'On' : 'Off', self.state.autosaveEnabled),
          action('top', 'Jump to top', 'Move quickly to the first line.', '↑', function () { self.jumpToTop(); }),
          action('bottom', 'Jump to bottom', 'Move quickly to the last line.', '↓', function () { self.jumpToBottom(); }),
          action('shortcuts', 'Shortcuts', 'Open the keyboard shortcut sheet.', '⌨', function () { self.openShortcuts(); }, 'F1')
        ]),
        e(Patch6PanelSection, { key: 'preferences', title: 'Editor preferences', tip: 'Applies immediately' }, [
          e(Patch6SelectField, {
            key: 'tabs',
            label: 'Tab size',
            value: self.state.tabSize,
            onChange: self.handleTabSizeChange,
            options: [
              { value: '2', label: '2 spaces' },
              { value: '4', label: '4 spaces' },
              { value: '8', label: '8 spaces' }
            ],
            title: 'Choose editor tab size'
          }),
          e(Patch6SelectField, {
            key: 'font',
            label: 'Editor font',
            value: self.state.editorFontSize || 15,
            onChange: self.handleEditorFontSizeChange.bind(self),
            options: PATCH5_EDITOR_FONT_SIZES,
            title: 'Choose editor font size'
          })
        ])
      ];
    }

    return e('div', { className: 'toolbar-panel toolbar-panel--patch7 toolbar-panel--patch8' }, [
      e('div', { key: 'header', className: 'toolbar-panel__header' }, [
        e('div', { key: 'copy' }, [
          e('h3', { key: 'title', className: 'toolbar-panel__title' }, metaMap[menu][0]),
          e('p', { key: 'subtitle', className: 'toolbar-panel__subtitle' }, metaMap[menu][1])
        ]),
        e('div', { key: 'meta', className: 'toolbar-panel__meta' }, [
          e(StatusChip, { key: 'esc' }, 'Esc to close'),
          e(StatusChip, { key: 'palette', tone: 'accent' }, 'Ctrl/Cmd + P')
        ])
      ]),
      e('div', { key: 'content', className: 'toolbar-panel__content custom-scroll' }, sections)
    ]);
  };

  MarkdownStudioApp.prototype.renderStatusBar = function () {
    var goal = patch7GetGoalProgress(this);
    var signals = [
      e(StatusChip, { key: 'disk', tone: this.state.dirty ? 'warning' : 'success' }, patch6DiskLabel(this.state)),
      e(StatusChip, { key: 'autosave', tone: this.state.autosaveEnabled && this.state.autosaveStatus !== 'error' ? 'success' : 'warning' }, patch6AutosaveLabel(this.state))
    ];

    if (goal) {
      signals.push(e(StatusChip, { key: 'goal', tone: goal.reached ? 'success' : 'accent' }, 'Goal ' + goal.words + ' / ' + goal.goal));
    }
    if (this.state.typewriterMode) {
      signals.push(e(StatusChip, { key: 'typewriter', tone: 'accent' }, 'Typewriter'));
    }
    if (this.state.focusParagraphMode) {
      signals.push(e(StatusChip, { key: 'paragraph', tone: 'accent' }, 'Paragraph focus'));
    }
    if (this.state.spellcheckEnabled === false) {
      signals.push(e(StatusChip, { key: 'spell', tone: 'warning' }, 'Spell off'));
    }

    signals.push(e(StatusChip, { key: 'view' }, patch6ViewLabel(this)));
    if (this.isPreviewVisible() && !this.state.zenMode) {
      signals.push(e(StatusChip, { key: 'split' }, patch6SplitLabel(this)));
    }
    signals.push(e(StatusChip, { key: 'tabs' }, 'Tab ' + this.state.tabSize));
    signals.push(e(StatusChip, { key: 'wrap' }, this.state.wrapEnabled ? 'Wrap on' : 'Wrap off'));

    return e('footer', { className: 'app-statusbar app-statusbar--patch6 app-statusbar--patch7 app-statusbar--patch8' }, [
      e('div', { key: 'metrics', className: 'status-cluster status-cluster--metrics' }, [
        e(Patch6Metric, { key: 'words', label: 'Words', value: this.state.stats.words }),
        e(Patch6Metric, { key: 'chars', label: 'Chars', value: this.state.stats.characters }),
        e(Patch6Metric, { key: 'lines', label: 'Lines', value: this.state.stats.lines }),
        e(Patch6Metric, { key: 'read', label: 'Read', value: this.state.stats.readingMinutes ? this.state.stats.readingMinutes + ' min' : '--' })
      ]),
      e('div', { key: 'signals', className: 'status-cluster status-cluster--signals' }, signals)
    ]);
  };

  function Patch8WelcomeModal(props) {
    if (!props.open) {
      return null;
    }

    var quickShortcuts = [
      ['Type /', 'Slash commands'],
      ['Ctrl/Cmd + P', 'Command palette'],
      ['Alt + Shift + T', 'Typewriter mode'],
      ['Alt + Shift + P', 'Paragraph focus'],
      ['Ctrl/Cmd + V', 'Paste image'],
      ['F1', 'Shortcut sheet']
    ];

    return e('div', {
      className: 'modal-backdrop',
      onClick: function (event) {
        if (event.target === event.currentTarget) {
          props.onClose();
        }
      }
    }, e('div', { className: 'modal-card modal-card--welcome modal-card--patch8' }, [
      e('div', { key: 'header', className: 'modal-card__header modal-card__header--welcome' }, [
        e('div', { key: 'copy' }, [
          e('div', { key: 'eyebrow', className: 'welcome-eyebrow' }, 'Welcome'),
          e('h3', { key: 'title', className: 'modal-card__title welcome-title' }, 'Local markdown workspace'),
          e('p', { key: 'subtitle', className: 'modal-card__subtitle welcome-subtitle' }, 'Fully local, keyboard-first, and tuned for laptop screens. The editor stays on the left, the preview stays on the right, and deeper controls stay grouped until you need them.')
        ]),
        e(ActionButton, {
          key: 'close',
          onClick: props.onClose,
          label: 'Close',
          compact: true,
          icon: '✕',
          title: 'Close quick start guide'
        })
      ]),
      e('div', { key: 'body', className: 'modal-card__body modal-card__body--welcome custom-scroll' }, [
        e('section', { key: 'hero', className: 'welcome-hero' }, [
          e('div', { key: 'left', className: 'welcome-panel welcome-panel--primary' }, [
            e('div', { key: 'chips', className: 'welcome-chip-row' }, [
              e(StatusChip, { key: 'local', tone: 'success' }, 'Fully local'),
              e(StatusChip, { key: 'laptop', tone: 'accent' }, 'Laptop friendly'),
              e(StatusChip, { key: 'keyboard' }, 'Keyboard first')
            ]),
            e('h4', { key: 'stepsTitle', className: 'welcome-section-title' }, 'Fast start workflow'),
            e('ol', { key: 'steps', className: 'welcome-steps' }, [
              e('li', { key: '1' }, 'Open a note or start from a template. File details and save state live behind the file button in the header.'),
              e('li', { key: '2' }, 'Use the grouped menus for insert, export, view, tools, and workspace actions, then close them to get the screen back.'),
              e('li', { key: '3' }, 'Type `/` in the editor for headings, media, snippets, tables, and callouts without leaving the keyboard flow.'),
              e('li', { key: '4' }, 'Drag the divider while reviewing. Double-click it any time to return to the editor-first layout.'),
              e('li', { key: '5' }, 'Open Settings or Updates only when needed so more vertical space stays available for writing and previewing.')
            ])
          ]),
          e('div', { key: 'right', className: 'welcome-panel' }, [
            e('h4', { key: 'shortcutsTitle', className: 'welcome-section-title' }, 'Quick shortcut cheat sheet'),
            e('div', { key: 'shortcuts', className: 'welcome-shortcuts' }, quickShortcuts.map(function (item) {
              return e('div', { key: item[0], className: 'welcome-shortcut' }, [
                e('kbd', { key: 'key', className: 'shortcut-item__key' }, item[0]),
                e('span', { key: 'label', className: 'welcome-shortcut__label' }, item[1])
              ]);
            })),
            e('div', { key: 'help', className: 'welcome-note' }, 'Tip: keep the quick formatting buttons for the most common edits and let the grouped menus carry everything else.')
          ])
        ]),
        e('section', { key: 'features', className: 'welcome-feature-grid' }, [
          e('article', { key: 'chrome', className: 'welcome-feature-card' }, [
            e('h4', { key: 'title', className: 'welcome-feature-card__title' }, 'Calmer chrome'),
            e('p', { key: 'copy', className: 'welcome-feature-card__copy' }, 'Top-level controls stay compact so the editor and preview keep more of the screen, especially on 14-inch laptops.')
          ]),
          e('article', { key: 'preview', className: 'welcome-feature-card' }, [
            e('h4', { key: 'title', className: 'welcome-feature-card__title' }, 'Aligned preview'),
            e('p', { key: 'copy', className: 'welcome-feature-card__copy' }, 'The preview sync meter now follows the same framed width as the preview area so the right pane feels more polished.')
          ]),
          e('article', { key: 'scroll', className: 'welcome-feature-card' }, [
            e('h4', { key: 'title', className: 'welcome-feature-card__title' }, 'Better scrolling'),
            e('p', { key: 'copy', className: 'welcome-feature-card__copy' }, 'Settings, release notes, and other longer surfaces stay usable on shorter screens instead of spilling past the viewport.')
          ])
        ])
      ]),
      e('div', { key: 'footer', className: 'modal-card__footer modal-card__footer--welcome' }, [
        e('div', { key: 'left', className: 'settings-actions' }, [
          e(ActionButton, { key: 'templates', onClick: props.onTemplates, label: 'Templates', compact: true, icon: '◇' }),
          e(ActionButton, { key: 'shortcuts', onClick: props.onShortcuts, label: 'Shortcuts', compact: true, icon: '⌨' }),
          e(ActionButton, { key: 'settings', onClick: props.onSettings, label: 'Settings', compact: true, icon: '⚙' }),
          e(ActionButton, { key: 'updates', onClick: props.onReleaseNotes, label: 'Updates', compact: true, icon: '✦' })
        ]),
        e(ActionButton, { key: 'start', onClick: props.onClose, label: 'Start writing', compact: true, primary: true, icon: '→' })
      ])
    ]));
  }

  function Patch8ReleaseNotesModal(props) {
    if (!props.open) {
      return null;
    }

    return e('div', {
      className: 'modal-backdrop',
      onClick: function (event) {
        if (event.target === event.currentTarget) {
          props.onClose();
        }
      }
    }, e('div', { className: 'modal-card modal-card--release modal-card--patch8' }, [
      e('div', { key: 'header', className: 'modal-card__header' }, [
        e('div', { key: 'copy' }, [
          e('h3', { key: 'title', className: 'modal-card__title' }, 'Workspace updates'),
          e('p', { key: 'subtitle', className: 'modal-card__subtitle' }, 'This merged local build now favors writing space more aggressively on laptop screens while keeping the full toolset available behind grouped menus, settings, and workspace panels.')
        ]),
        e(ActionButton, {
          key: 'close',
          onClick: props.onClose,
          label: 'Close',
          compact: true,
          icon: '✕',
          title: 'Close updates'
        })
      ]),
      e('div', { key: 'hero', className: 'settings-hero' }, [
        e(StatusChip, { key: 'current', tone: 'accent' }, 'Current build'),
        e(StatusChip, { key: 'local', tone: 'success' }, 'Fully local'),
        e(StatusChip, { key: 'docs' }, 'Agent-ready docs')
      ]),
      e('div', { key: 'body', className: 'modal-card__body modal-card__body--release custom-scroll' },
        PATCH5_RELEASE_SECTIONS.map(function (section) {
          return e('section', { key: section.title, className: 'release-section' }, [
            e('h4', { key: 'title', className: 'release-section__title' }, section.title),
            e('ul', { key: 'items', className: 'release-section__list' }, (section.items || []).map(function (item, index) {
              return e('li', { key: section.title + index, className: 'release-section__item' }, item);
            }))
          ]);
        })
      ),
      e('div', { key: 'footer', className: 'modal-card__footer' }, [
        e(StatusChip, { key: 'hint', tone: 'accent' }, 'Tip: copy the summary if your agent needs the full patch history'),
        e('div', { key: 'actions', className: 'settings-actions' }, [
          e(ActionButton, { key: 'copy', onClick: props.onCopy, label: 'Copy summary', compact: true, icon: '⧉' }),
          e(ActionButton, { key: 'done', onClick: props.onClose, label: 'Done', compact: true, primary: true, icon: '✓' })
        ])
      ])
    ]));
  }

  MarkdownStudioApp.prototype.renderWelcomeModal = function () {
    return e(Patch8WelcomeModal, {
      open: !!this.state.welcomeOpen,
      onClose: this.closeWelcomeModal.bind(this),
      onTemplates: function () {
        this.closeWelcomeModal();
        this.openTemplatesModal();
      }.bind(this),
      onShortcuts: function () {
        this.closeWelcomeModal();
        this.openShortcuts();
      }.bind(this),
      onSettings: function () {
        this.closeWelcomeModal();
        this.openSettings();
      }.bind(this),
      onReleaseNotes: function () {
        this.closeWelcomeModal();
        this.openReleaseNotesModal();
      }.bind(this)
    });
  };

  MarkdownStudioApp.prototype.renderReleaseNotesModal = function () {
    return e(Patch8ReleaseNotesModal, {
      open: !!this.state.releaseNotesOpen,
      onClose: this.closeReleaseNotesModal.bind(this),
      onCopy: this.copyReleaseNotesSummary.bind(this)
    });
  };


  ReactDOM.render(e(MarkdownStudioApp), document.getElementById('app'));
})();
