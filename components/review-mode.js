"use strict";

function ReviewMode(_ref1) {
  var cards = _ref1.cards,
    onUpdate = _ref1.onUpdate,
    level = _ref1.level || 'N5',
    pending = _ref1.pending || 0,
    onLearnExtra = _ref1.onLearnExtra;
  // Passed items over the daily new-card cap (Q34): count + 'learn extra today'.
  var pendingEl = pending > 0 && React.createElement("div", { className: "pending-line" },
    pending, pending === 1 ? " new card" : " new cards", " waiting (daily new-card limit). ",
    onLearnExtra && React.createElement("button", { className: "ex-retry-btn", onClick: onLearnExtra }, "Learn extra today"));
  var _React$useStateQ = React.useState(function() { return rndShuffle(srsDueCards(cards)); }),
    _React$useStateQS = _slicedToArray(_React$useStateQ, 2),
    due = _React$useStateQS[0];
  var _React$useState33 = React.useState(0),
    _React$useState34 = _slicedToArray(_React$useState33, 2),
    idx = _React$useState34[0],
    setIdx = _React$useState34[1];
  var _React$useState35 = React.useState(false),
    _React$useState36 = _slicedToArray(_React$useState35, 2),
    flipped = _React$useState36[0],
    setFlipped = _React$useState36[1];
  if (due.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "review-empty"
    }, /*#__PURE__*/React.createElement("div", {
      className: "review-empty-icon"
    }, "\u2705"), /*#__PURE__*/React.createElement("div", {
      className: "review-empty-title"
    }, t('all_caught_up', level)), /*#__PURE__*/React.createElement("div", {
      className: "review-empty-sub"
    }, t('no_cards_due', level)), pendingEl);
  }
  if (idx >= due.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "review-empty"
    }, /*#__PURE__*/React.createElement("div", {
      className: "review-empty-icon"
    }, "\uD83C\uDF1F"), /*#__PURE__*/React.createElement("div", {
      className: "review-empty-title"
    }, t('session_done', level)), /*#__PURE__*/React.createElement("div", {
      className: "review-empty-sub"
    }, "Reviewed ", due.length, " card", due.length !== 1 ? 's' : '', "."), pendingEl);
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
  return /*#__PURE__*/React.createElement("div", {
    className: "review-wrap"
  }, /*#__PURE__*/React.createElement("div", {
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
  }, t('click_reveal', level)), pendingEl);
}
