"use strict";

function DayView(_ref0) {
  var lesson = _ref0.lesson,
    dayNum = _ref0.dayNum,
    totalDays = _ref0.totalDays,
    pColor = _ref0.pColor,
    pBg = _ref0.pBg,
    completed = _ref0.completed,
    toggleDone = _ref0.toggleDone,
    setDay = _ref0.setDay;
  var isDone = completed.has(dayNum);
  var _React$useState31 = React.useState(false),
    _React$useState32 = _slicedToArray(_React$useState31, 2),
    quizActive = _React$useState32[0],
    setQuizActive = _React$useState32[1];
  var defaultFurigana = dayNum <= 1320;
  var _React$useStateFuri = React.useState(function () {
    try { var v = localStorage.getItem('n5_furigana'); return v !== null ? v === 'true' : defaultFurigana; } catch (e) { return defaultFurigana; }
  }),
    _React$useStateFuri2 = _slicedToArray(_React$useStateFuri, 2),
    showFurigana = _React$useStateFuri2[0],
    setShowFurigana = _React$useStateFuri2[1];
  var toggleFurigana = function () {
    setShowFurigana(function (v) { safeSave('n5_furigana', String(!v)); return !v; });
  };
  React.useEffect(function () {
    setQuizActive(false);
  }, [dayNum]);
  return /*#__PURE__*/React.createElement("div", {
    className: "day-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "day-header",
    style: {
      background: pBg
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "day-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "day-num"
  }, t('day_label', dayNum), " ", dayNum), /*#__PURE__*/React.createElement("span", {
    className: "phase-badge",
    style: {
      background: pColor
    }
  }, lesson.phaseName), /*#__PURE__*/React.createElement("span", {
    className: "week-badge"
  }, t('week_label', dayNum), " ", lesson.week), isDone && /*#__PURE__*/React.createElement("span", {
    className: "complete-badge"
  }, t('complete_badge', dayNum))), /*#__PURE__*/React.createElement("h2", {
    className: "day-title"
  }, lesson.title)), /*#__PURE__*/React.createElement("div", {
    className: "day-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lesson-blurrable".concat(quizActive ? ' blurred' : '')
  }, lesson.intro && /*#__PURE__*/React.createElement("div", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label"
  }, "Overview"), /*#__PURE__*/React.createElement("div", {
    className: "intro-text"
  }, lesson.intro)), lesson.chars && lesson.chars.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label"
  }, t('section_characters', dayNum)), /*#__PURE__*/React.createElement("div", {
    className: "chars-table"
  }, lesson.chars.map(function (c, i) {
    return /*#__PURE__*/React.createElement(CharCard, {
      key: i,
      char: c,
      isKanji: lesson.type === 'kanji'
    });
  }))), /*#__PURE__*/React.createElement(TypingTip, {
    lesson: lesson
  }), lesson.vocab && lesson.vocab.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label"
  }, t('section_vocabulary', dayNum)), function () {
    var hasReadings = lesson.vocab.some(function (v) {
      return v[1] && v[1] !== v[0];
    });
    return /*#__PURE__*/React.createElement("table", {
      className: "vocab-table"
    }, hasReadings && /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, t('vocab_word', dayNum)), /*#__PURE__*/React.createElement("th", null, t('vocab_reading', dayNum)), /*#__PURE__*/React.createElement("th", null, t('vocab_meaning', dayNum)))), /*#__PURE__*/React.createElement("tbody", null, lesson.vocab.map(function (v, i) {
      return /*#__PURE__*/React.createElement("tr", {
        key: i
      }, /*#__PURE__*/React.createElement("td", null, hasKanji(v[0]) && v[1] && v[1] !== v[0] ? /*#__PURE__*/React.createElement("ruby", null, v[0], /*#__PURE__*/React.createElement("rt", null, v[1])) : v[0], /*#__PURE__*/React.createElement("button", {
        className: "speak-btn",
        onClick: function onClick() {
          return speak(v[0]);
        },
        title: "Listen to pronunciation",
        'aria-label': "Listen to " + v[0]
      }, "\uD83D\uDD0A")), hasReadings && !hasKanji(v[0]) && /*#__PURE__*/React.createElement("td", null, v[1]), hasReadings && hasKanji(v[0]) && /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null, v[2]));
    })));
  }()), lesson.grammar && lesson.grammar.pattern && /*#__PURE__*/React.createElement("div", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label"
  }, t('section_grammar', dayNum)), /*#__PURE__*/React.createElement("div", {
    className: "grammar-box"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grammar-pattern"
  }, lesson.grammar.pattern), /*#__PURE__*/React.createElement("div", {
    className: "grammar-meaning"
  }, lesson.grammar.meaning), /*#__PURE__*/React.createElement("div", {
    className: "grammar-example"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jp"
  }, lesson.grammar.example_jp), /*#__PURE__*/React.createElement("div", {
    className: "en"
  }, lesson.grammar.example_en)))), lesson.practice && /*#__PURE__*/React.createElement("div", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label"
  }, t('section_practice', dayNum)), /*#__PURE__*/React.createElement("div", {
    className: "practice-box"
  }, lesson.practice)), lesson.tip && /*#__PURE__*/React.createElement("div", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tip-box"
  }, lesson.tip)),
  // Furigana toggle button (shown when lesson has kanji vocab or passage)
  (lesson.vocab && lesson.vocab.some(function(v) { return hasKanji(v[0]); }) || lesson.passage) && /*#__PURE__*/React.createElement("button", {
    className: "furigana-toggle" + (showFurigana ? " active" : ""),
    onClick: toggleFurigana
  }, showFurigana ? t('furigana_hide', dayNum) : t('furigana_show', dayNum)),
  // Passage rendering for reading comprehension days
  lesson.passage && /*#__PURE__*/React.createElement("div", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label"
  }, t('reading_passage', dayNum)), /*#__PURE__*/React.createElement("div", {
    className: "passage-box" + (showFurigana ? "" : " hide-furigana")
  }, /*#__PURE__*/React.createElement("div", null, lesson.passage.text_jp), lesson.passage.text_en && /*#__PURE__*/React.createElement("div", {
    className: "passage-en"
  }, lesson.passage.text_en)), lesson.passage.questions && lesson.passage.questions.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "passage-questions"
  }, lesson.passage.questions.map(function(q, qi) {
    return /*#__PURE__*/React.createElement("div", { key: qi, className: "passage-q" },
      /*#__PURE__*/React.createElement("div", { className: "passage-q-jp" }, q.question_jp),
      q.question_en && /*#__PURE__*/React.createElement("div", { className: "passage-q-en" }, q.question_en)
    );
  })))
  ), /*#__PURE__*/React.createElement(Exercises, {
    key: lesson.day,
    lesson: lesson,
    onStart: function onStart() {
      return setQuizActive(true);
    },
    onFinish: function onFinish() {
      return setQuizActive(false);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "nav-bar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nav-btn prev",
    onClick: function onClick() {
      return setDay(Math.max(1, dayNum - 1));
    },
    disabled: dayNum === 1,
    title: "Previous day (←)"
  }, t('nav_prev', dayNum)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "day-counter"
  }, t('day_label', dayNum), " ", dayNum, " / ", totalDays), /*#__PURE__*/React.createElement("button", {
    className: "nav-btn complete ".concat(isDone ? 'done' : ''),
    onClick: toggleDone
  }, isDone ? t('mark_incomplete', dayNum) : t('mark_complete', dayNum))), /*#__PURE__*/React.createElement("button", {
    className: "nav-btn next",
    onClick: function onClick() {
      return setDay(Math.min(totalDays, dayNum + 1));
    },
    disabled: dayNum === totalDays,
    title: "Next day (→)"
  }, t('nav_next', dayNum))));
}
