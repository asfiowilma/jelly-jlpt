"use strict";

// Review hub (shown before a session): due count + Start, type filter, 7-day
// forecast, new/learning/known split. Reuses dueForecast / srsStats.
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
  var st = srsStats(p.cards), known = st.young + st.mature;
  var pct = function (x) { return st.total ? x / st.total * 100 + '%' : '0%'; };
  var chip = function (key, label, count) {
    return h('button', { key: key, className: 'rv-chip', 'aria-pressed': filter === key, onClick: function () { p.setFilter(key); } }, label + ' · ' + count);
  };
  return h('div', { className: 'rv-hub' },
    h('div', { className: 'rv-due' },
      h('div', null, h('strong', null, n), h('span', null, n === 1 ? t('rv_card_due', level) : t('rv_cards_due', level))),
      h('button', { className: 'ex-retry-btn', disabled: !n, onClick: function () { p.onStart(filter); } }, t('rv_start', level))),
    n === 0 && h('div', { className: 'rv-caught' }, jelly('sleepy', 64), t(st.total ? 'all_caught_up' : 'rv_no_cards', level)),
    types.length > 0 && h('div', { className: 'rv-chips', role: 'group' },
      chip('all', t('rv_all', level), due.length),
      types.map(function (ty) { return chip(ty, t(labels[ty], level), byType[ty]); })),
    st.total > 0 && h('h3', { className: 'rv-h' }, t('rv_next7', level)),
    st.total > 0 && h('div', { className: 'rv-fc' }, perDay.map(function (v, i) {
      var day = i === 0 ? t('rv_today', level) : new Date(dayStart(Date.now(), i)).toLocaleDateString(undefined, { weekday: 'short' });
      return h('div', { key: i, className: i === 0 ? 'today' : '' }, v, h('i', { style: { height: v / max * 72 } }), day);
    })),
    st.total > 0 && h('div', null,
      h('h3', { className: 'rv-h' }, t('rv_know', level)),
      h('div', { className: 'rv-mat' },
        h('i', { style: { width: pct(st['new']), background: 'var(--m-new)' } }),
        h('i', { style: { width: pct(st.learning), background: 'var(--m-learn)' } }),
        h('i', { style: { width: pct(known), background: 'var(--m-mature)' } })),
      h('div', { className: 'rv-leg' },
        h('span', null, t('rv_new', level) + ' ' + st['new']),
        h('span', null, t('rv_learning', level) + ' ' + st.learning),
        h('span', null, t('rv_known', level) + ' ' + known))),
    p.pendingEl);
}

function ReviewMode(_ref1) {
  var cards = _ref1.cards,
    onUpdate = _ref1.onUpdate,
    level = _ref1.level || 'N5',
    pending = _ref1.pending || 0,
    onLearnExtra = _ref1.onLearnExtra,
    onKnown = _ref1.onKnown,
    dayDone = _ref1.dayDone,
    streak = _ref1.streak,
    onToday = _ref1.onToday;
  // Passed items over the daily new-card cap (Q34): count + 'learn extra today'.
  var pendingEl = pending > 0 && React.createElement("div", { className: "pending-line" },
    pending, pending === 1 ? " new card" : " new cards", " waiting (daily new-card limit). ",
    onLearnExtra && React.createElement("button", { className: "ex-retry-btn", onClick: onLearnExtra }, "Learn extra today"));
  // autoStart (from the Today plan): skip the hub and start on the due deck
  var _s = React.useState(function () { return _ref1.autoStart && srsDueCards(cards).length ? rndShuffle(srsDueCards(cards)) : null; }),
    due = _s[0],
    setDue = _s[1];
  var _f = React.useState('all'),
    filter = _f[0],
    setFilter = _f[1];
  var _React$useState33 = React.useState(0),
    _React$useState34 = _slicedToArray(_React$useState33, 2),
    idx = _React$useState34[0],
    setIdx = _React$useState34[1];
  var _React$useState35 = React.useState(false),
    _React$useState36 = _slicedToArray(_React$useState35, 2),
    flipped = _React$useState36[0],
    setFlipped = _React$useState36[1];
  if (due === null) {
    return React.createElement("div", { className: "review-wrap rv-wrap" }, React.createElement(ReviewHub, {
      cards: cards, level: level, filter: filter, setFilter: setFilter, pendingEl: pendingEl,
      onStart: function (f) {
        setIdx(0);
        setFlipped(false);
        setDue(rndShuffle(srsDueCards(cards).filter(function (c) { return f === 'all' || c.type === f; })));
      }
    }));
  }
  var backBtn = React.createElement("button", { className: "ex-retry-btn rv-back", onClick: function () { setDue(null); } }, t('rv_back', level));
  if (idx >= due.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "review-empty"
    }, /*#__PURE__*/React.createElement("div", {
      className: "review-empty-icon"
    }, React.createElement(JellyExcited, { size: 96 })), /*#__PURE__*/React.createElement("div", {
      className: "review-empty-title"
    }, t('session_done', level)), /*#__PURE__*/React.createElement("div", {
      className: "review-empty-sub"
    }, "Reviewed ", due.length, " card", due.length !== 1 ? 's' : '', ".", dayDone && " That's today done." + (streak ? " Streak " + streak + " 🔥" : "")), onToday && React.createElement("button", { className: "quiz-start-btn", onClick: onToday }, "Back to Today"), backBtn);
  }
  var card = due[idx];
  var rate = function rate(quality) {
    var updated = _objectSpread(_objectSpread({}, cards), {}, _defineProperty({}, card.id, srsReview(card, quality)));
    onUpdate(updated);
    Store.logReview(quality);
    setFlipped(false);
    setIdx(function (i) {
      return i + 1;
    });
  };
  // A new card's first appearance: "I already know this" seeds it as known
  // (ticket 37): back in 3–4 weeks as a real test, no review logged.
  var isNew = onKnown && !hasRealReviews(card) && !card.imported;
  var knownEl = isNew && React.createElement("button", {
    className: "data-btn known-btn",
    onClick: function () {
      onKnown(card.id);
      setFlipped(false);
      setIdx(function (i) { return i + 1; });
    }
  }, t('known_btn', level));
  return /*#__PURE__*/React.createElement("div", {
    className: "review-wrap"
  }, backBtn, /*#__PURE__*/React.createElement("div", {
    className: "review-progress"
  }, idx + 1, " / ", due.length, " due"), /*#__PURE__*/React.createElement("div", {
    className: "review-card",
    onClick: function onClick() {
      return !flipped && setFlipped(true);
    },
    tabIndex: 0,
    'aria-label': flipped ? "Card revealed" : "Click or press Enter to reveal answer",
    onKeyDown: function onKeyDown(e) {
      if ((e.key === 'Enter' || e.key === ' ') && !flipped) { e.preventDefault(); setFlipped(true); }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "review-card-type"
  }, t({ kanji: 'section_kanji', grammar: 'section_grammar', kana: 'section_kana' }[card.type] || 'card_vocab', level)), /*#__PURE__*/React.createElement("div", {
    className: "review-card-front"
  }, card.front, /*#__PURE__*/React.createElement("button", {
    className: "speak-btn",
    style: {
      fontSize: '1.2rem',
      marginLeft: '8px'
    },
    onClick: function onClick(e) {
      e.stopPropagation();
      speak(card.front);
    },
    'aria-label': "Listen to pronunciation of " + card.front
  }, "\uD83D\uDD0A")), flipped ? /*#__PURE__*/React.createElement("div", {
    className: "review-card-back"
  }, card.reading && card.reading !== card.front && /*#__PURE__*/React.createElement("div", {
    className: "review-reading"
  }, card.reading), /*#__PURE__*/React.createElement("div", {
    className: "review-meaning"
  }, card.back)) : /*#__PURE__*/React.createElement("div", {
    className: "review-card-hint"
  }, t('tap_reveal', level))), flipped && /*#__PURE__*/React.createElement("div", {
    className: "review-btns"
  }, /*#__PURE__*/React.createElement("button", {
    className: "review-btn again",
    onClick: function onClick() {
      return rate(0);
    }
  }, t('btn_again', level)), /*#__PURE__*/React.createElement("button", {
    className: "review-btn hard",
    onClick: function onClick() {
      return rate(1);
    }
  }, t('btn_hard', level)), /*#__PURE__*/React.createElement("button", {
    className: "review-btn good",
    onClick: function onClick() {
      return rate(2);
    }
  }, t('btn_good', level)), /*#__PURE__*/React.createElement("button", {
    className: "review-btn easy",
    onClick: function onClick() {
      return rate(3);
    }
  }, t('btn_easy', level))), !flipped && /*#__PURE__*/React.createElement("div", {
    className: "review-flip-hint"
  }, t('click_reveal', level)), knownEl, pendingEl);
}
