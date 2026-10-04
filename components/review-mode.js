"use strict";

// Review: a slim hub (due count, plan chip, type filter, 7-day forecast), a full-screen session
// (one card at a time, every rating saved the moment it is given) and a day-aware summary.
// Sketch: .scratch/review-page-sketch. Uses srsPreview / cardExample / stageOf (lib.js).
var RV_RATINGS = ['again', 'hard', 'good', 'easy'];
var RV_LABELS = ['btn_again', 'btn_hard', 'btn_good', 'btn_easy'];
// rvDays(n): 1d, 12d, 1.5mo, 1.2y
function rvDays(n) {
  return n < 30 ? n + 'd' : n < 365 ? (n / 30).toFixed(1).replace('.0', '') + 'mo' : (n / 365).toFixed(1).replace('.0', '') + 'y';
}
// rvSentence(ex, furigana): the example sentence as React nodes, the word <b>-highlighted when
// cardExample found it; ruby over kanji only when the furigana pref is on.
function rvSentence(ex, furigana) {
  var h = React.createElement, pos = 0;
  return furiganaParts(ex.s.furigana || ex.s.jp).map(function (p, i) {
    var a = pos, b = pos + p.t.length, hit = ex.at !== null && ex.at < b && ex.end > a;
    pos = b;
    var el = function (txt) { return furigana && p.r ? h('ruby', { key: i }, txt, h('rt', null, p.r)) : txt; };
    if (!hit) return h(React.Fragment, { key: i }, el(p.t));
    if (p.r) return h('b', { key: i }, el(p.t));
    var from = Math.max(ex.at, a) - a, to = Math.min(ex.end, b) - a;
    return h(React.Fragment, { key: i }, p.t.slice(0, from), h('b', null, p.t.slice(from, to)), p.t.slice(to));
  });
}

function ReviewHub(p) {
  var h = React.createElement, level = p.level;
  var due = srsDueCards(p.cards);
  var labels = { kana: 'section_kana', vocab: 'card_vocab', kanji: 'section_kanji', grammar: 'section_grammar' };
  var byType = {};
  due.forEach(function (c) { byType[c.type] = (byType[c.type] || 0) + 1; });
  var types = SRS_TYPES.filter(function (ty) { return byType[ty]; });
  var filter = byType[p.filter] ? p.filter : 'all';
  var n = filter === 'all' ? due.length : byType[filter];
  var fc = dueForecast(p.cards, Date.now(), 7), perDay = fc.perDay.slice();
  perDay[0] += fc.overdue;
  var max = Math.max.apply(null, perDay.concat(1));
  var total = Object.keys(p.cards).length;
  var chip = function (key, label, count) {
    return h('button', { key: key, className: 'rv-chip', 'aria-pressed': filter === key, onClick: function () { p.setFilter(key); } }, label + ' · ' + count);
  };
  var forecast = total > 0 && h('div', { key: 'fc' },
    h('h3', { className: 'rv-h' }, t('rv_next7', level)),
    h('div', { className: 'rv-fc' }, perDay.map(function (v, i) {
      var day = i === 0 ? t('rv_today', level) : new Date(dayStart(Date.now(), i)).toLocaleDateString(undefined, { weekday: 'short' });
      return h('div', { key: i, className: i === 0 ? 'today' : '' }, v, h('i', { style: { height: v / max * 72 } }), day);
    })));
  var statsLink = p.onStats && total > 0 && h('button', { key: 'st', className: 'rv-link m', onClick: p.onStats }, 'Full breakdown in Stats →');
  var tomorrow = perDay[1] || 0;
  var plan = p.plan && !p.plan.done ? p.plan.steps.filter(function (s) { return s.status !== 'rest'; }) : []; // same count as the Today tab
  var at = plan.map(function (s) { return s.status; }).indexOf('now');
  var chipEl = at >= 0 && h('span', { className: 'rv-plan' }, h('i', { 'aria-hidden': true }), "Today's plan · step " + (at + 1) + ' of ' + plan.length);
  return h('div', { className: 'rv-hub' },
    h('h1', { className: 'rv-title' }, t('view_review', level)),
    p.toast && h('div', { className: 'rv-toast', role: 'status' }, p.toast),
    n > 0 && chipEl,
    n > 0 && h('section', { className: 'rv-due', 'aria-label': t('view_review', level) },
      h('div', null, h('strong', null, n), h('span', null, (n === 1 ? t('rv_card_due', level) : t('rv_cards_due', level)) + ' · ~' + tdReviewMins(n) + ' min')),
      h('button', { className: 'rv-btn pri', onClick: function () { p.onStart(filter); } }, t('rv_start', level))),
    n === 0 && h('div', { className: 'rv-empty' }, jelly('sleepy', 72),
      total
        ? h(React.Fragment, null,
          h('h2', null, t('all_caught_up', level)),
          h('p', null, tomorrow ? dayPlural(tomorrow, 'Next card is due tomorrow ({n}).', 'Next cards are due tomorrow ({n}).') : 'Nothing is due for the next week.'),
          p.onLearn && h('button', { className: 'rv-btn', onClick: p.onLearn }, 'Learn a stage'))
        : h(React.Fragment, null,
          h('p', null, t('rv_no_cards', level)),
          p.onToday && h('button', { className: 'rv-btn pri', onClick: p.onToday }, 'Go to Today'))),
    n > 0 && types.length > 0 && h('div', { className: 'rv-chips', role: 'group', 'aria-label': 'Filter by type' },
      chip('all', t('rv_all', level), due.length),
      types.map(function (ty) { return chip(ty, t(labels[ty], level), byType[ty]); })),
    n > 0 && h('p', { className: 'rv-note' }, 'Stop any time. Every rating is saved the moment you give it.'),
    forecast,
    p.pendingEl,
    statsLink);
}

function ReviewMode(_ref1) {
  var h = React.createElement;
  var cards = _ref1.cards,
    onUpdate = _ref1.onUpdate,
    level = _ref1.level || 'N5',
    pending = _ref1.pending || 0,
    onLearnExtra = _ref1.onLearnExtra,
    onKnown = _ref1.onKnown,
    plan = _ref1.plan,
    streak = _ref1.streak,
    furigana = !!_ref1.showFurigana,
    onToday = _ref1.onToday;
  // Passed items over the daily new-card cap (Q34): count + 'learn extra today'.
  var pendingEl = pending > 0 && h('div', { key: 'pend', className: 'pending-line' },
    h('span', null, pending + (pending === 1 ? ' new card' : ' new cards') + ' waiting (daily new-card limit).'),
    onLearnExtra && h('button', { className: 'rv-link', onClick: onLearnExtra }, 'Learn extra today'));
  var dayDone = plan ? plan.done : !!_ref1.dayDone;
  // autoStart (from the Today plan): skip the hub and start on the due deck
  var _s = React.useState(function () { return _ref1.autoStart && srsDueCards(cards).length ? rndShuffle(srsDueCards(cards)) : null; }),
    due = _s[0], setDue = _s[1];
  var _f = React.useState('all'), filter = _f[0], setFilter = _f[1];
  var _i = React.useState(0), idx = _i[0], setIdx = _i[1];
  var _fl = React.useState(false), flipped = _fl[0], setFlipped = _fl[1];
  var _l = React.useState([]), log = _l[0], setLog = _l[1];
  var _t = React.useState(''), toast = _t[0], setToast = _t[1];
  var startDone = React.useRef(dayDone); // was today already done when this session began? (extra review)
  var layerRef = React.useRef(null);
  var keyRef = React.useRef(null);
  var open = due !== null;

  // The session covers the page and locks its scroll (same layer as the quiz).
  React.useEffect(function () {
    var b = typeof document !== 'undefined' && document.body;
    if (!open || !b || !b.classList) return undefined;
    b.classList.add('quiz-open');
    return function () { b.classList.remove('quiz-open'); };
  }, [open]);
  React.useEffect(function () {
    if (!open || typeof document === 'undefined' || !document.addEventListener) return undefined;
    var on = function (e) { if (keyRef.current) keyRef.current(e); };
    document.addEventListener('keydown', on);
    return function () { document.removeEventListener('keydown', on); };
  }, [open]);
  React.useEffect(function () {
    var l = layerRef.current;
    if (open && l && l.focus && !(l.contains && l.contains(document.activeElement))) l.focus();
  }, [open, idx, flipped]);
  React.useEffect(function () {
    if (!toast) return undefined;
    var id = setTimeout(function () { setToast(''); }, 5000);
    return function () { clearTimeout(id); };
  }, [toast]);

  var start = function (f) {
    startDone.current = dayDone;
    setIdx(0); setFlipped(false); setLog([]); setToast('');
    setDue(rndShuffle(srsDueCards(cards).filter(function (c) { return f === 'all' || c.type === f; })));
  };
  var leave = function () {
    if (due && idx > 0 && idx < due.length) setToast('Saved. ' + dayPlural(due.length - idx, '{n} card left.', '{n} cards left.'));
    setDue(null); setFlipped(false);
  };

  if (!open) {
    return h('div', { className: 'rv-wrap' }, h(ReviewHub, {
      cards: cards, level: level, filter: filter, setFilter: setFilter, pendingEl: pendingEl, plan: plan, toast: toast,
      onStart: start, onToday: onToday, onLearn: _ref1.onLearn, onStats: _ref1.onStats
    }));
  }

  var X = h('button', { className: 'qz-x', 'aria-label': 'Exit review. Progress is saved', onClick: leave }, icon('x'));
  var layer = function (top, main, bar) {
    return h('div', { className: 'ql rv-layer', ref: layerRef, tabIndex: -1, role: 'dialog', 'aria-modal': 'true', 'aria-label': t('view_review', level) }, top, main, bar);
  };
  var trapTab = function (e) {
    var root = layerRef.current;
    if (e.key !== 'Tab' || !root) return false;
    var f = [].slice.call(root.querySelectorAll('button,[tabindex="0"]')).filter(function (el) { return !el.disabled && el.getClientRects().length; });
    var a = document.activeElement;
    e.preventDefault();
    if (!f.length) return true;
    if (!root.contains(a)) f[e.shiftKey ? f.length - 1 : 0].focus();
    else if (e.shiftKey && a === f[0]) f[f.length - 1].focus();
    else if (!e.shiftKey && a === f[f.length - 1]) f[0].focus();
    else f[f.indexOf(a) + (e.shiftKey ? -1 : 1)].focus();
    return true;
  };

  // ── Summary ───────────────────────────────────────────────────────────────
  if (idx >= due.length) {
    keyRef.current = function (e) { if (trapTab(e)) return; if (e.key === 'Escape') leave(); };
    var tally = { again: 0, hard: 0, good: 0, easy: 0, known: 0 };
    log.forEach(function (l) { tally[l.r]++; });
    var now = plan && !plan.done ? plan.steps.filter(function (s) { return s.status === 'now'; })[0] : null;
    var kind = plan && plan.done && !startDone.current ? 'day' : now ? 'open' : 'extra';
    var left = plan ? plan.steps.filter(function (s) { return s.kind !== 'complete' && (s.status === 'now' || s.status === 'next'); }).length : 0;
    var n = due.length, cardsLine = dayPlural(n, '{n} card reviewed', '{n} cards reviewed');
    var tomorrow = dueForecast(cards, Date.now(), 2).perDay[1] || 0;
    var sub = kind === 'day' ? cardsLine + (streak > 0 ? ' · 🔥 ' + dayPlural(streak, '{n} day', '{n} days') : '')
      : kind === 'open' ? cardsLine + '. ' + (left > 1 ? left + ' steps left today.' : 'One step left today.')
      : cardsLine + '. Extra practice, nice.';
    if (tally.known) sub += ' ' + tally.known + ' marked as known.';
    var learn = _ref1.onLearn && !(plan && plan.levelEnd);
    var acts = kind === 'day'
      ? [h('button', { key: 'p', className: 'rv-btn pri', onClick: onToday }, 'Back to Today'), learn && h('button', { key: 's', className: 'rv-btn', onClick: _ref1.onLearn }, 'Learn a stage anyway')]
      : kind === 'open'
        ? (now.kind === 'stage'
          ? [h('button', { key: 'p', className: 'rv-btn pri', onClick: function () { _ref1.onPlanStage(now.unit.index); } }, 'Start stage ' + (now.unit.index + 1)),
            h('button', { key: 's', className: 'rv-btn', onClick: onToday }, 'Back to Today')]
          : [h('button', { key: 'p', className: 'rv-btn pri', onClick: onToday }, 'Back to Today')])
        : [h('button', { key: 'p', className: 'rv-btn pri', onClick: function () { setDue(null); } }, 'Back to Review')];
    var again = due.filter(function (c, i) { return log[i] && log[i].r === 'again'; });
    return layer(
      h('div', { className: 'qz-top' }, X),
      h('div', { className: 'qz-main rv-main' }, h('div', { className: 'rv-sum' },
        h('div', { className: 'rv-sum-top' }, h(JellyExcited, { size: 72 }),
          h('div', null, h('h2', { role: 'status' }, kind === 'day' ? "That's today done." : 'Review done'), h('p', { className: 'rv-note' }, sub))),
        h('div', { className: 'rv-tally' }, RV_RATINGS.map(function (r, i) { return h('div', { key: r }, t(RV_LABELS[i], level), h('b', null, tally[r])); })),
        again.length > 0 && h('div', { className: 'rv-watch' }, h('h3', null, 'Rated Again · back tomorrow'),
          h('ul', null, again.map(function (c) { return h('li', { key: c.id }, h('span', { className: 'rv-jp' }, c.front), h('span', null, c.back)); }))),
        h('p', { className: 'rv-note' }, tomorrow ? dayPlural(tomorrow, 'Next card is due tomorrow ({n}).', 'Next cards are due tomorrow ({n}).') : 'Nothing is due tomorrow.'),
        h('div', { className: 'rv-acts' }, acts))));
  }

  // ── Session ───────────────────────────────────────────────────────────────
  var card = due[idx];
  var preview = srsPreview(card);
  var ex = flipped ? cardExample(card.id) : null;
  var stage = flipped ? stageOf(card.id) : null;
  // A new card's first appearance: "I already know this" seeds it as known (ticket 37): back in
  // 3-4 weeks as a real test, no review logged.
  var isNew = !!onKnown && !hasRealReviews(card) && !card.imported;
  var next = function (entry) { setLog(log.concat([entry])); setFlipped(false); setIdx(idx + 1); };
  var rate = function (q) {
    var upd = Object.assign({}, cards);
    upd[card.id] = srsReview(card, q);
    onUpdate(upd);
    Store.logReview(q);
    next({ id: card.id, r: RV_RATINGS[q] });
  };
  var known = function () { onKnown(card.id); next({ id: card.id, r: 'known' }); };
  keyRef.current = function (e) {
    if (trapTab(e) || e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = document.activeElement && document.activeElement.tagName;
    if (e.key === 'Escape') leave();
    else if ((e.key === ' ' || e.key === 'Enter') && !flipped && tag !== 'BUTTON') { e.preventDefault(); setFlipped(true); }
    else if (flipped && e.key.length === 1 && '1234'.indexOf(e.key) >= 0) rate(+e.key - 1);
  };
  var kindLabel = t({ kanji: 'section_kanji', grammar: 'section_grammar', kana: 'section_kana' }[card.type] || 'card_vocab', level) + (isNew ? ' · new' : '');
  var progress = h('div', { className: 'qz-top' }, X,
    h('div', { className: 'qz-prog', role: 'progressbar', 'aria-label': 'Review progress', 'aria-valuemin': 0, 'aria-valuemax': due.length, 'aria-valuenow': idx },
      // ponytail: one segment per card up to 40, then a plain fill (segments would be slivers)
      due.length > 40
        ? h('i', { className: 'qz-seg rv-track' }, h('b', { style: { width: idx / due.length * 100 + '%' } }))
        : due.map(function (c, i) { return h('i', { key: i, className: 'qz-seg' + (i < idx ? ' ' + log[i].r : i === idx ? ' now' : '') }); })),
    h('span', { className: 'rv-count' }, (idx + 1) + ' / ' + due.length));
  var cardEl = h('div', {
    className: 'rv-card', tabIndex: flipped ? undefined : 0, role: flipped ? undefined : 'button',
    'aria-label': flipped ? undefined : 'Show answer',
    onClick: function () { if (!flipped) setFlipped(true); }
  },
    h('div', { className: 'rv-kind' }, kindLabel),
    h('div', { className: 'rv-front' }, card.front, h('button', {
      className: 'rv-spk', 'aria-label': 'Listen to ' + card.front,
      onClick: function (e) { e.stopPropagation(); speak(card.front); }
    }, icon('speaker'))),
    flipped ? h('div', { className: 'rv-back' },
      card.reading && card.reading !== card.front && h('div', { className: 'rv-rd' }, card.reading),
      h('div', { className: 'rv-mean' }, card.back),
      ex && h('div', { className: 'rv-ex' }, h('div', { className: 'rv-jp', lang: 'ja' }, rvSentence(ex, furigana)), h('small', null, ex.s.en)),
      stage && _ref1.onOpenStage && h('button', { className: 'rv-link', onClick: function () { _ref1.onOpenStage(stage.index); } }, 'From Stage ' + (stage.index + 1) + ' →'))
      : h('div', { className: 'rv-hint' }, t('tap_reveal', level), h('span', { className: 'rv-kh' }, ' or press Space')));
  var bar = flipped
    ? h('div', { className: 'qz-dock rv-bar' }, h('div', { className: 'rv-bar-in' }, h('div', { className: 'rv-rate' }, RV_RATINGS.map(function (r, q) {
      return h('button', {
        key: r, className: 'rv-rb ' + r, onClick: function () { rate(q); },
        'aria-label': t(RV_LABELS[q], level) + ', next review in ' + dayPlural(preview[r], '{n} day', '{n} days')
      }, t(RV_LABELS[q], level), h('small', null, rvDays(preview[r]), h('span', { className: 'rv-kh' }, ' · ' + (q + 1))));
    }))))
    : h('div', { className: 'qz-dock rv-bar' }, h('div', { className: 'rv-bar-in' },
      h('button', { className: 'rv-reveal', onClick: function () { setFlipped(true); } }, 'Show answer'),
      h('div', { className: 'rv-row2' },
        isNew ? h('button', { className: 'rv-link m', onClick: known }, t('known_btn', level)) : h('span', null),
        h('span', { className: 'rv-kh' }, 'Space to reveal'))));
  return layer(progress, h('div', { className: 'qz-main rv-main', 'aria-live': 'polite' }, cardEl), bar);
}
