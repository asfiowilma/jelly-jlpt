"use strict";

// Donation jar (たすかる): a heart in the navbar that opens a small popover, and a Settings section.
// Plain links to two tip pages, no gating, no tracking. Trakteer covers Indonesian rails (QRIS,
// e-wallets), Ko-fi covers cards and PayPal. Logos are local files (CSP img-src 'self').
var DONATE_LINKS = [
  { id: 'trakteer', name: 'Trakteer', url: 'https://trakteer.id/lyth/tip?open=true', logo: 'icons/logo-trakteer.svg' },
  { id: 'kofi', name: 'Ko-fi', url: 'https://ko-fi.com/tulalyth/tip', logo: 'icons/logo-kofi.svg' }
];

// DonateButtons: the two links. onTip fires on click (the link still opens in a new tab).
function DonateButtons(props) {
  var ce = React.createElement;
  return ce('div', { className: 'dj-btns' }, DONATE_LINKS.map(function (l) {
    return ce('a', {
      key: l.id, className: 'dj-btn', href: l.url, target: '_blank', rel: 'noopener noreferrer',
      title: 'Tip Jelly on ' + l.name, onClick: props.onTip
    }, ce('img', { src: l.logo, alt: '' }), l.name);
  }));
}

// SupportPopover: heart button + popover. Closes on Esc, outside press, or Esc-then-focus back to the heart.
function SupportPopover(props) {
  var ce = React.createElement;
  var L = function (key) { return t(key, props.level); };
  var _o = React.useState(false), open = _o[0], setOpen = _o[1];
  var _t = React.useState(false), thanked = _t[0], setThanked = _t[1];
  var wrap = React.useRef(null), btn = React.useRef(null);
  React.useEffect(function () {
    if (!open) return undefined;
    var onDown = function (e) { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    var onKey = function (e) { if (e.key === 'Escape') { setOpen(false); if (btn.current) btn.current.focus(); } };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return function () { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);
  return ce('div', { className: 'pop-wrap', ref: wrap },
    ce('button', {
      ref: btn, className: 'icon-btn heart', type: 'button',
      'aria-label': L('support_label'), title: L('support_label'),
      'aria-haspopup': 'dialog', 'aria-expanded': open ? 'true' : 'false', 'aria-controls': 'support-pop',
      onClick: function () { setOpen(!open); }
    }, icon('heart')),
    open && ce('div', { className: 'pop', id: 'support-pop', role: 'dialog', 'aria-label': L('support_pop_title') },
      ce('div', { className: 'dj-head' }, jelly('idle', 34), ce('span', { className: 'dj-title' }, L('support_pop_title'))),
      ce('p', { className: 'dj-gloss' }, L('support_pop_gloss')),
      ce('p', { className: 'dj-body' }, L('support_pop_body')),
      ce(DonateButtons, { onTip: function () { setThanked(true); } }),
      thanked && ce('p', { className: 'dj-thanks', role: 'status' }, L('support_thanks')),
      ce('p', { className: 'dj-fine' }, L('support_rails'))));
}

// SupportSection: the Settings → "たすかる" tip jar block. `section` is SettingsView's helper.
function SupportSection(props) {
  var ce = React.createElement, L = props.L;
  // Gradient entry card, not a plain section: this is the one place we ask for support
  return ce('section', { className: 'tip-card', 'aria-labelledby': 'set-support' },
    ce('span', { className: 'tip-chip' }, L('support_chip')),
    ce('div', { className: 'tip-top' },
      ce('div', { className: 'txt' },
        ce('h3', { id: 'set-support' }, L('support_card_title')),
        ce('p', { className: 'tip-gloss' }, L('support_pop_gloss')),
        ce('p', { className: 'tip-body' }, L('support_card_body'))),
      jelly('happy', 104, true)),
    ce(DonateButtons, {}),
    ce('p', { className: 'dj-fine' }, L('support_rails')));
}

// ── Soft prompt on the passed-quiz result screen ─────────────────────────────
// Device-only state (like jlpt_welcome_seen: not synced, not exported, cleared by reset).
var SUPPORT_KEY = 'jlpt_support';
function supportState() {
  try { return JSON.parse(localStorage.getItem(SUPPORT_KEY)) || {}; } catch (e) { return {}; }
}
function supportSave(patch) { safeSave(SUPPORT_KEY, JSON.stringify(Object.assign(supportState(), patch))); }
function supportDismiss() { supportSave({ dismissed: true }); }
// supportAskNow(unit): the milestone to ask for after a PASS, or null. Records the ask, so a retake never repeats it.
function supportAskNow(unit) {
  var kind = supportMilestone(unit, UNITS);
  if (!shouldAskSupport(kind, supportState(), Date.now())) return null;
  supportSave({ lastAskedAt: Date.now() });
  return kind;
}

// SupportAsk: the quiet card under the result. kind = 'review' | 'mock' | 'level'.
function SupportAsk(props) {
  var ce = React.createElement;
  var L = function (key) { return t(key, props.level); };
  var _t = React.useState(false), thanked = _t[0], setThanked = _t[1];
  var n = parseInt(String(props.level).slice(1), 10);
  var kind = props.kind === 'level' && !(n > 1) ? 'review' : props.kind; // no next level after N1
  var line = L('support_ask_' + kind).replace('{lv}', props.level).replace('{next}', 'N' + (n - 1));
  return ce('aside', { className: 'ask', 'aria-label': L('support_label') },
    jelly('idle', 36),
    ce('div', { className: 'txt' }, ce('strong', null, L('support_ask_h')), ce('span', null, line)),
    ce('div', { className: 'acts' },
      ce(DonateButtons, { onTip: function () { setThanked(true); } }),
      ce('button', { className: 'dj-quiet', type: 'button', onClick: props.onNo }, L('support_ask_no'))),
    thanked && ce('p', { className: 'dj-thanks', role: 'status' }, L('support_thanks')));
}
