"use strict";

// ── ReviewView ────────────────────────────────────────────────────────────────
function ReviewView(_ref6) {
  var srs = _ref6.srs,
    onUpdate = _ref6.onUpdate,
    dayNum = _ref6.dayNum || 1;
  var dueIds = getDueCards(srs);
  var allItems = dueIds.map(function (id) {
    return cardToItem(id, srs);
  }).filter(Boolean);
  var _React$useState = React.useState(function () {
      return rndShuffle(_toConsumableArray(allItems));
    }),
    _React$useState2 = _slicedToArray(_React$useState, 1),
    queue = _React$useState2[0];
  var _React$useState3 = React.useState(0),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    cur = _React$useState4[0],
    setCur = _React$useState4[1];
  var _React$useState5 = React.useState(false),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    flipped = _React$useState6[0],
    setFlipped = _React$useState6[1];
  var _React$useState7 = React.useState({
      right: 0,
      wrong: 0
    }),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    score = _React$useState8[0],
    setScore = _React$useState8[1];
  if (dueIds.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "review-wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "review-done"
    }, /*#__PURE__*/React.createElement("div", {
      className: "review-done-icon"
    }, "\uD83C\uDF89"), /*#__PURE__*/React.createElement("div", {
      className: "review-done-title"
    }, t('all_caught_up', dayNum)), /*#__PURE__*/React.createElement("div", {
      className: "review-done-sub"
    }, t('no_cards_due', dayNum))));
  }
  if (cur >= queue.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "review-wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "review-done"
    }, /*#__PURE__*/React.createElement("div", {
      className: "review-done-icon"
    }, "\u2705"), /*#__PURE__*/React.createElement("div", {
      className: "review-done-title"
    }, t('session_done', dayNum)), /*#__PURE__*/React.createElement("div", {
      className: "review-done-sub"
    }, "\u2713 ", score.right, " correct \xB7 \u2717 ", score.wrong, " again")));
  }
  var item = queue[cur];
  var grade = function grade(g) {
    var updated = sm2Update(srs[item.id], g);
    onUpdate(_objectSpread(_objectSpread({}, srs), {}, _defineProperty({}, item.id, updated)));
    setScore(function (s) {
      return {
        right: s.right + (g >= 3 ? 1 : 0),
        wrong: s.wrong + (g < 3 ? 1 : 0)
      };
    });
    setCur(function (c) {
      return c + 1;
    });
    setFlipped(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "review-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "review-progress"
  }, cur + 1, " / ", queue.length, " cards due"), /*#__PURE__*/React.createElement("div", {
    className: "review-card",
    onClick: function onClick() {
      return setFlipped(true);
    },
    tabIndex: 0,
    'aria-label': flipped ? "Card revealed" : "Click or press Enter to reveal answer",
    onKeyDown: function onKeyDown(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped(true); }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "review-char"
  }, item.front), item.type === 'vocab' && /*#__PURE__*/React.createElement("button", {
    className: "review-speak",
    onClick: function onClick(e) {
      e.stopPropagation();
      speak(item.front);
    },
    'aria-label': "Listen to pronunciation of " + item.front
  }, "\uD83D\uDD0A"), !flipped && /*#__PURE__*/React.createElement("div", {
    className: "review-tap"
  }, t('tap_reveal', dayNum)), flipped && /*#__PURE__*/React.createElement("div", {
    className: "review-back"
  }, /*#__PURE__*/React.createElement("div", {
    className: "review-answer"
  }, item.back), item.reading && /*#__PURE__*/React.createElement("div", {
    className: "review-reading"
  }, item.reading))), flipped ? /*#__PURE__*/React.createElement("div", {
    className: "review-btns review-btns--3"
  }, /*#__PURE__*/React.createElement("button", {
    className: "review-btn again",
    onClick: function onClick() {
      return grade(1);
    }
  }, t('btn_again', dayNum)), /*#__PURE__*/React.createElement("button", {
    className: "review-btn good",
    onClick: function onClick() {
      return grade(3);
    }
  }, t('btn_good', dayNum)), /*#__PURE__*/React.createElement("button", {
    className: "review-btn easy",
    onClick: function onClick() {
      return grade(5);
    }
  }, t('btn_easy', dayNum))) : /*#__PURE__*/React.createElement("div", {
    style: {
      height: '56px'
    }
  }));
}
