/**
 * Markdown Studio sign-in (shared platform contract: Google + GitHub through Supabase, PKCE).
 * Self-contained: mounts its own control into the top bar and never touches editor state.
 * Guests keep full use of the editor and its local save; signing in is identity only and
 * files an access request for the "studio" app so admins can approve it.
 */
(function () {
  'use strict';

  var cfg = window.MDS_SUPABASE_CONFIG;
  if (!cfg || !cfg.url || !cfg.anonKey || !window.supabase || typeof window.supabase.createClient !== 'function') return;

  var PROVIDERS = [
    { id: 'google', label: 'Google' },
    { id: 'github', label: 'GitHub' }
  ];
  var ICONS = {
    google: '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>',
    github: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>'
  };
  var STATUS_TEXT = {
    admin: 'Studio admin',
    member: 'Studio member',
    pending: 'Access pending approval',
    denied: 'Access not approved',
    none: 'No studio access yet',
    unknown: 'Access status unavailable'
  };

  var client = window.supabase.createClient(cfg.url, cfg.anonKey, {
    auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'markdown-studio-auth' }
  });

  var state = { session: null, access: 'unknown', ready: false };
  var slot = null;
  var openLayer = null;
  var returnFocus = null;

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function redirectUrl() {
    return window.location.origin + window.location.pathname;
  }

  function cleanAuthParams() {
    var url = new URL(window.location.href);
    var keys = ['code', 'error', 'error_code', 'error_description', 'state'];
    var touched = keys.some(function (key) { return url.searchParams.has(key); });
    if (!touched) return null;
    var problem = url.searchParams.get('error_description') || url.searchParams.get('error');
    keys.forEach(function (key) { url.searchParams.delete(key); });
    window.history.replaceState(window.history.state, document.title, url.pathname + url.search + url.hash);
    return problem;
  }

  function explain(error) {
    var text = (error && (error.message || error.error_description)) || String(error || 'Unknown error');
    if (/manual linking/i.test(text)) return 'Account linking is switched off in Supabase (Authentication → "Allow manual linking").';
    if (/identity_already_exists|already linked/i.test(text)) return 'That account is already linked to another user.';
    return text;
  }

  function notice(message, tone) {
    var el = document.createElement('div');
    el.className = 'mds-auth-notice' + (tone ? ' is-' + tone : '');
    el.setAttribute('role', 'status');
    el.textContent = message;
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('is-visible'); });
    setTimeout(function () {
      el.classList.remove('is-visible');
      setTimeout(function () { el.remove(); }, 300);
    }, 4200);
  }

  function user() {
    return state.session && state.session.user;
  }

  function displayName(u) {
    var meta = (u && u.user_metadata) || {};
    return meta.full_name || meta.name || meta.user_name || (u && u.email) || 'Account';
  }

  async function loadAccess() {
    var u = user();
    if (!u) { state.access = 'unknown'; return; }
    try {
      var roles = await client.from('user_roles').select('app, role').eq('user_id', u.id);
      if (roles.error) throw roles.error;
      var rows = roles.data || [];
      var isSuper = rows.some(function (r) { return r.app === '*' && r.role === 'super_admin'; });
      var own = rows.filter(function (r) { return r.app === cfg.app; });
      if (isSuper || own.some(function (r) { return r.role === 'admin'; })) { state.access = 'admin'; return; }
      if (own.length) { state.access = 'member'; return; }
      var request = await client.rpc('request_access', { p_app: cfg.app });
      if (request.error) throw request.error;
      var status = request.data && request.data.status;
      state.access = status === 'pending' ? 'pending' : status === 'denied' ? 'denied' : 'none';
    } catch (error) {
      console.warn('[studio-auth] access check failed', error);
      state.access = 'unknown';
    }
  }

  function closeLayer() {
    if (!openLayer) return;
    var layer = openLayer;
    openLayer = null;
    layer.classList.remove('is-open');
    setTimeout(function () { layer.remove(); }, 200);
    document.removeEventListener('keydown', onLayerKey, true);
    document.removeEventListener('pointerdown', onOutside, true);
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus();
    returnFocus = null;
  }

  function onLayerKey(event) {
    if (!openLayer) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeLayer();
      return;
    }
    if (event.key === 'Tab') {
      var items = openLayer.querySelectorAll('button:not([disabled]), a[href]');
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }

  function onOutside(event) {
    if (openLayer && !openLayer.contains(event.target) && !(slot && slot.contains(event.target))) closeLayer();
  }

  function showLayer(layer, focusTarget) {
    closeLayer();
    returnFocus = document.activeElement;
    openLayer = layer;
    document.body.appendChild(layer);
    requestAnimationFrame(function () {
      layer.classList.add('is-open');
      var target = focusTarget ? layer.querySelector(focusTarget) : layer.querySelector('button');
      if (target) target.focus();
    });
    document.addEventListener('keydown', onLayerKey, true);
    document.addEventListener('pointerdown', onOutside, true);
  }

  function dialog(title, subtitle, bodyHtml) {
    var layer = document.createElement('div');
    layer.className = 'mds-auth-backdrop';
    layer.innerHTML =
      '<div class="mds-auth-dialog" role="dialog" aria-modal="true" aria-labelledby="mds-auth-title">' +
        '<div class="mds-auth-dialog__head">' +
          '<div><h2 id="mds-auth-title">' + escapeHtml(title) + '</h2>' +
          (subtitle ? '<p>' + escapeHtml(subtitle) + '</p>' : '') + '</div>' +
          '<button type="button" class="mds-auth-close" data-close aria-label="Close">×</button>' +
        '</div>' +
        '<div class="mds-auth-dialog__body">' + bodyHtml + '</div>' +
      '</div>';
    layer.addEventListener('click', function (event) {
      if (event.target === layer || event.target.closest('[data-close]')) closeLayer();
    });
    return layer;
  }

  async function signIn(provider, button) {
    if (button) { button.disabled = true; button.querySelector('span').textContent = 'Opening ' + provider + '…'; }
    var result = await client.auth.signInWithOAuth({ provider: provider, options: { redirectTo: redirectUrl() } });
    if (result.error) {
      notice('Could not start sign-in: ' + explain(result.error), 'error');
      if (button) { button.disabled = false; render(); }
    }
  }

  function openChooser() {
    var layer = dialog('Sign in to Markdown Studio', 'Optional. The editor and local saves keep working without an account.',
      '<div class="mds-auth-providers">' + PROVIDERS.map(function (p) {
        return '<button type="button" class="mds-auth-provider" data-provider="' + p.id + '">' + ICONS[p.id] + '<span>Continue with ' + p.label + '</span></button>';
      }).join('') + '</div>' +
      '<p class="mds-auth-foot">One account works across Gokul\'s apps. Google and GitHub with the same verified email link automatically.</p>');
    layer.addEventListener('click', function (event) {
      var button = event.target.closest('[data-provider]');
      if (button) signIn(button.getAttribute('data-provider'), button);
    });
    showLayer(layer, '[data-provider]');
  }

  async function openConnectedAccounts() {
    var layer = dialog('Connected accounts', 'Sign in with any of these. The last one cannot be removed.', '<div class="mds-auth-list" data-list><p class="mds-auth-muted">Loading…</p></div>');
    showLayer(layer, '[data-close]');
    var list = layer.querySelector('[data-list]');
    var identities = [];

    async function load() {
      var result = await client.auth.getUserIdentities();
      if (result.error) { list.innerHTML = '<p class="mds-auth-error">' + escapeHtml(explain(result.error)) + '</p>'; return; }
      identities = (result.data && result.data.identities) || [];
      list.innerHTML = PROVIDERS.map(function (p) {
        var identity = identities.find(function (i) { return i.provider === p.id; });
        var data = (identity && identity.identity_data) || {};
        var detail = identity ? escapeHtml(data.email || data.user_name || 'Connected') : 'Not connected';
        var action = !identity
          ? '<button type="button" class="app-btn app-btn--primary app-btn--compact" data-link="' + p.id + '"><span>Link</span></button>'
          : identities.length < 2
            ? '<span class="mds-auth-chip">Only way in</span>'
            : '<button type="button" class="app-btn app-btn--secondary app-btn--compact" data-unlink="' + escapeHtml(identity.identity_id) + '"><span>Unlink</span></button>';
        return '<div class="mds-auth-row"><span class="mds-auth-row__icon">' + ICONS[p.id] + '</span>' +
          '<span class="mds-auth-row__text"><strong>' + p.label + '</strong><small>' + detail + '</small></span>' + action + '</div>';
      }).join('');
    }

    list.addEventListener('click', async function (event) {
      var link = event.target.closest('[data-link]');
      var unlink = event.target.closest('[data-unlink]');
      if (link) {
        link.disabled = true;
        var linked = await client.auth.linkIdentity({ provider: link.getAttribute('data-link'), options: { redirectTo: redirectUrl() } });
        if (linked.error) { notice('Could not link: ' + explain(linked.error), 'error'); link.disabled = false; }
        return;
      }
      if (unlink) {
        var identity = identities.find(function (i) { return i.identity_id === unlink.getAttribute('data-unlink'); });
        if (!identity || identities.length < 2) return;
        if (!window.confirm('Unlink ' + identity.provider + '? You can still sign in with your other account.')) return;
        unlink.disabled = true;
        var removed = await client.auth.unlinkIdentity(identity);
        if (removed.error) { notice('Could not unlink: ' + explain(removed.error), 'error'); unlink.disabled = false; return; }
        notice('Account unlinked', 'success');
        load();
      }
    });
    load();
  }

  function openMenu() {
    var u = user();
    if (!u) return;
    var layer = document.createElement('div');
    layer.className = 'mds-auth-menu';
    layer.setAttribute('role', 'menu');
    layer.setAttribute('aria-label', 'Account');
    layer.innerHTML =
      '<div class="mds-auth-menu__who"><strong>' + escapeHtml(displayName(u)) + '</strong><small>' + escapeHtml(u.email || '') + '</small>' +
      '<span class="mds-auth-chip is-' + state.access + '">' + escapeHtml(STATUS_TEXT[state.access] || STATUS_TEXT.unknown) + '</span></div>' +
      '<button type="button" role="menuitem" data-action="accounts">Connected accounts</button>' +
      '<button type="button" role="menuitem" data-action="signout">Sign out</button>';
    var anchor = slot && slot.querySelector('button');
    if (anchor) {
      var rect = anchor.getBoundingClientRect();
      layer.style.top = Math.round(rect.bottom + 8) + 'px';
      layer.style.right = Math.max(12, Math.round(window.innerWidth - rect.right)) + 'px';
    }
    layer.addEventListener('click', function (event) {
      var action = event.target.closest('[data-action]');
      if (!action) return;
      var name = action.getAttribute('data-action');
      closeLayer();
      if (name === 'accounts') openConnectedAccounts();
      if (name === 'signout') client.auth.signOut().then(function () { notice('Signed out. Your local work is untouched.'); });
    });
    showLayer(layer, '[role="menuitem"]');
  }

  function render() {
    if (!slot) return;
    var u = user();
    if (!state.ready) { slot.innerHTML = ''; return; }
    if (!u) {
      slot.innerHTML = '<button type="button" class="app-btn app-btn--secondary app-btn--compact mds-auth-trigger" title="Sign in with Google or GitHub (optional)"><span class="btn-icon" aria-hidden="true">👤</span><span>Sign in</span></button>';
    } else {
      var meta = u.user_metadata || {};
      var avatar = meta.avatar_url
        ? '<img src="' + escapeHtml(meta.avatar_url) + '" alt="" referrerpolicy="no-referrer">'
        : '<span>' + escapeHtml(displayName(u).charAt(0).toUpperCase()) + '</span>';
      slot.innerHTML = '<button type="button" class="mds-auth-avatar" aria-haspopup="menu" title="' + escapeHtml(u.email || 'Account') + '" aria-label="Account menu">' + avatar + '</button>';
    }
    slot.querySelector('button').addEventListener('click', function () {
      if (openLayer) { closeLayer(); return; }
      if (user()) openMenu(); else openChooser();
    });
  }

  function mount() {
    var host = document.querySelector('.app-topbar .topbar-actions');
    if (!host) return;
    if (slot && host.contains(slot)) return;
    slot = document.createElement('div');
    slot.className = 'mds-auth-slot';
    host.appendChild(slot);
    render();
  }

  var observer = new MutationObserver(mount);
  observer.observe(document.getElementById('app') || document.body, { childList: true, subtree: true });
  mount();

  client.auth.onAuthStateChange(function (event, session) {
    var hadUser = !!user();
    state.session = session;
    if (event === 'SIGNED_OUT') state.access = 'unknown';
    if (state.ready) {
      render();
      if (session && !hadUser) loadAccess().then(render);
    }
  });

  client.auth.getSession().then(async function (result) {
    var problem = cleanAuthParams();
    if (problem) notice('Sign-in did not finish: ' + problem, 'error');
    state.session = result.data && result.data.session;
    state.ready = true;
    render();
    if (user()) { await loadAccess(); render(); }
  }).catch(function (error) {
    console.warn('[studio-auth] session restore failed', error);
    cleanAuthParams();
    state.ready = true;
    render();
  });

  window.MarkdownStudioAuth = Object.freeze({
    openSignIn: openChooser,
    openConnectedAccounts: openConnectedAccounts,
    signOut: function () { return client.auth.signOut(); },
    getUser: user
  });
})();
