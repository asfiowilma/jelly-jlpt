"use strict";

// PWA UI (ticket 42): the Settings "Install app" card, the "Update ready" toast, the online line.
// Presentational pieces take plain props (smoke-tested for every state); the *Live wrappers read the browser.

// The install prompt can fire before Settings is ever opened: keep it on window, tell listeners.
if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    window.__installPrompt = e;
    window.dispatchEvent(new Event('install-available'));
  });
  window.addEventListener('appinstalled', function () {
    window.__installPrompt = null;
    window.dispatchEvent(new Event('install-available'));
  });
}

function pwaEnv() {
  var mq = window.matchMedia && window.matchMedia('(display-mode: standalone)');
  var ua = navigator.userAgent || '';
  return {
    http: /^https?:$/.test(location.protocol),
    standalone: !!(mq && mq.matches) || navigator.standalone === true,
    hasPrompt: !!window.__installPrompt,
    ios: /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  };
}

// state = pwaInstallState(...) in lib.js. The card always shows (it is the offline pitch); 'none' and 'hidden' replace the button with a hint.
function InstallCard(props) {
  var L = props.L, h = React.createElement, state = props.state;
  var installed = state === 'installed';
  var hint = { ios: 'install_ios', none: 'install_none', hidden: 'install_file' }[state];
  // Same gradient entry card as Up next / stage quiz; notice is helper text, the button keeps its label
  return h('section', { className: 'qz-entry install-card' + (installed ? ' installed' : ''), 'aria-labelledby': 'install-title' },
    jelly('idle', 64, true, true),
    h('div', { className: 'txt' },
      h('h3', { id: 'install-title' }, L(installed ? 'install_done_title' : 'install_title')),
      h('p', { className: 'install-lead' }, L(installed ? 'install_done' : 'install_lead')),),
    !installed && state !== 'ios' && h('button', { id: 'install-btn', className: 'quiz-start-btn', type: 'button', disabled: state !== 'prompt', onClick: props.onInstall }, L('install_btn')),
    hint && h('p', { className: 'install-hint' }, h('span', { 'aria-hidden': 'true' }, '💡'), L(hint)));
}

function InstallCardLive(props) {
  var _s = React.useState(0), setTick = _s[1];
  React.useEffect(function () {
    var bump = function () { setTick(function (n) { return n + 1; }); };
    window.addEventListener('install-available', bump);
    return function () { window.removeEventListener('install-available', bump); };
  }, []);
  var onInstall = function () {
    var p = window.__installPrompt;
    if (!p) return;
    p.prompt();
    Promise.resolve(p.userChoice).then(function () { window.__installPrompt = null; setTick(function (n) { return n + 1; }); });
  };
  return React.createElement(InstallCard, { L: props.L, state: pwaInstallState(pwaEnv()), onInstall: onInstall });
}

// Reuses the achievements toast look (.toast-stack/.toast). Never applies itself; while a quiz or mock runs
// the button is disabled and says why.
function UpdateToast(props) {
  var L = props.L, h = React.createElement;
  return h('div', { className: 'toast-stack update-stack', role: 'status', 'aria-live': 'polite' },
    h('div', { className: 'toast toast-update' },
      h('span', { className: 'toast-body' },
        h('strong', null, L('update_title')),
        h('span', { className: 'toast-sub' }, L(props.busy ? 'update_wait' : 'update_body'))),
      h('button', { id: 'update-reload', className: 'data-btn', type: 'button', disabled: props.busy, onClick: props.onApply }, L('update_btn')),
      h('button', { className: 'data-btn', type: 'button', onClick: props.onLater }, L('update_later'))));
}

function NetLine(props) {
  return React.createElement('p', { className: 'setting-hint net-line', role: 'status' }, props.L(props.online ? 'net_online' : 'net_offline'));
}
function NetLineLive(props) {
  var _o = React.useState(navigator.onLine !== false), online = _o[0], setOnline = _o[1];
  React.useEffect(function () {
    var on = function () { setOnline(true); }, off = function () { setOnline(false); };
    window.addEventListener('online', on); window.addEventListener('offline', off);
    return function () { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return React.createElement(NetLine, { L: props.L, online: online });
}
