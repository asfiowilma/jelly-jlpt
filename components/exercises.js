"use strict";

// Maps exercise prompt strings to UI_STRINGS keys for translation
var PROMPT_KEYS = {
  'Listen and choose the meaning:': 'prompt_listen',
  'What is the reading for this character?': 'prompt_mc_char',
  'What does this word mean?': 'prompt_mc_word',
  'Type the reading for this character:': 'prompt_type_char',
  'What does this word mean? (type in English)': 'prompt_type_word',
};
function translatePrompt(prompt, dayNum) {
  var key = PROMPT_KEYS[prompt];
  if (!key) return prompt;
  return t(key, dayNum);
}

// ── Exercises ────────────────────────────────────────────────────────────────
function Exercises(_ref9) {
  var lesson = _ref9.lesson,
    onStart = _ref9.onStart,
    onFinish = _ref9.onFinish;
  var _React$useState9 = React.useState(function () {
      return buildExercises(lesson);
    }),
    _React$useState0 = _slicedToArray(_React$useState9, 2),
    exs = _React$useState0[0],
    setExs = _React$useState0[1];
  var _React$useState1 = React.useState(0),
    _React$useState10 = _slicedToArray(_React$useState1, 2),
    cur = _React$useState10[0],
    setCur = _React$useState10[1];
  var _React$useState11 = React.useState(''),
    _React$useState12 = _slicedToArray(_React$useState11, 2),
    answer = _React$useState12[0],
    setAnswer = _React$useState12[1];
  var _React$useState13 = React.useState(null),
    _React$useState14 = _slicedToArray(_React$useState13, 2),
    selected = _React$useState14[0],
    setSelected = _React$useState14[1];
  var _React$useState15 = React.useState(false),
    _React$useState16 = _slicedToArray(_React$useState15, 2),
    revealed = _React$useState16[0],
    setRevealed = _React$useState16[1];
  var _React$useState17 = React.useState({
      right: 0,
      total: 0
    }),
    _React$useState18 = _slicedToArray(_React$useState17, 2),
    score = _React$useState18[0],
    setScore = _React$useState18[1];
  var _React$useState19 = React.useState(false),
    _React$useState20 = _slicedToArray(_React$useState19, 2),
    done = _React$useState20[0],
    setDone = _React$useState20[1];
  var _React$useState21 = React.useState(false),
    _React$useState22 = _slicedToArray(_React$useState21, 2),
    started = _React$useState22[0],
    setStarted = _React$useState22[1];
  // Per-answer results (true/false) in order, for the segmented progress bar
  var _React$useStateRes = React.useState([]),
    _React$useStateRes2 = _slicedToArray(_React$useStateRes, 2),
    results = _React$useStateRes2[0],
    setResults = _React$useStateRes2[1];
  var inputRef = React.useRef(null);
  if (exs.length === 0) return null;

  // ── Not started: show Start Quiz button ──────────────────────────────────
  if (!started) {
    return /*#__PURE__*/React.createElement("div", {
      className: "quiz-start-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "quiz-start-box"
    }, /*#__PURE__*/React.createElement("div", {
      className: "quiz-start-title"
    }, t('quiz_title', lesson.day)), /*#__PURE__*/React.createElement("div", {
      className: "quiz-start-hint"
    }, "The lesson content above will be hidden while you answer ", exs.length, " questions."), /*#__PURE__*/React.createElement("button", {
      className: "quiz-start-btn",
      onClick: function onClick() {
        setStarted(true);
        onStart && onStart();
      }
    }, t('start_quiz', lesson.day))));
  }
  var retry = function retry() {
    setExs(buildExercises(lesson));
    setCur(0);
    setAnswer('');
    setSelected(null);
    setRevealed(false);
    setScore({
      right: 0,
      total: 0
    });
    setResults([]);
    setDone(false);
    setStarted(false);
    onFinish && onFinish();
  };
  var advance = function advance(wasRight) {
    setResults(function (r) {
      return r.concat([wasRight]);
    });
    setScore(function (s) {
      return {
        right: s.right + (wasRight ? 1 : 0),
        total: s.total + 1
      };
    });
    setTimeout(function () {
      if (cur + 1 >= exs.length) {
        setDone(true);
        onFinish && onFinish();
      } else {
        setCur(function (c) {
          return c + 1;
        });
        setAnswer('');
        setSelected(null);
        setRevealed(false);
        setTimeout(function () {
          return inputRef.current && inputRef.current.focus();
        }, 50);
      }
    }, 1000);
  };
  // One segment per question: answered → ok/bad, current → now
  var progressBar = function progressBar() {
    return /*#__PURE__*/React.createElement("div", {
      className: "quiz-progress",
      role: "progressbar",
      'aria-label': "Quiz progress",
      'aria-valuemin': 0,
      'aria-valuemax': exs.length,
      'aria-valuenow': results.length
    }, exs.map(function (_, i) {
      var state = i < results.length ? results[i] ? ' ok' : ' bad' : !done && i === cur ? ' now' : '';
      return /*#__PURE__*/React.createElement("i", {
        key: i,
        className: "quiz-seg" + state
      });
    }));
  };
  if (done) {
    var pct = score.right / score.total;
    var emoji = pct === 1 ? '🌟' : pct >= 0.6 ? '✅' : '📚';
    return /*#__PURE__*/React.createElement("div", {
      className: "section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-label"
    }, t('section_exercises', lesson.day)), /*#__PURE__*/React.createElement("div", {
      className: "exercise-box"
    }, progressBar(), /*#__PURE__*/React.createElement("div", {
      className: "ex-finish"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ex-finish-score"
    }, emoji, " ", score.right, " / ", score.total, " correct"), /*#__PURE__*/React.createElement("button", {
      className: "ex-retry-btn",
      onClick: retry
    }, t('try_again', lesson.day)))));
  }
  var ex = exs[cur];
  var progress = "".concat(cur + 1, " / ").concat(exs.length);
  if (ex.type === 'mc' || ex.type === 'listen') {
    return /*#__PURE__*/React.createElement("div", {
      className: "section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-label"
    }, t('section_exercises', lesson.day), " ", /*#__PURE__*/React.createElement("span", {
      className: "ex-count"
    }, progress)), /*#__PURE__*/React.createElement("div", {
      className: "exercise-box"
    }, progressBar(), /*#__PURE__*/React.createElement("div", {
      className: "ex-prompt"
    }, translatePrompt(ex.prompt, lesson.day)), ex.type === 'listen' ? /*#__PURE__*/React.createElement("div", {
      className: "ex-question"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ex-listen-btn",
      onClick: function onClick() {
        return speak(ex.audio);
      },
      'aria-label': "Listen to audio"
    }, "\uD83D\uDD0A Play")) : ex.question && /*#__PURE__*/React.createElement("div", {
      className: "ex-question"
    }, ex.question), /*#__PURE__*/React.createElement("div", {
      className: "ex-options"
    }, ex.options.map(function (opt, i) {
      var cls = 'ex-option';
      if (selected !== null) {
        if (i === ex.correct) cls += ' correct';else if (i === selected) cls += ' wrong';
      }
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        className: cls,
        disabled: selected !== null,
        onClick: function onClick() {
          setSelected(i);
          advance(i === ex.correct);
        }
      }, opt);
    }))));
  }

  // Typing exercise
  var handleCheck = function handleCheck() {
    if (!answer.trim() || revealed) return;
    setRevealed(true);
    advance(checkTyping(answer, ex.answers));
  };
  var isRight = revealed && checkTyping(answer, ex.answers);
  return /*#__PURE__*/React.createElement("div", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label"
  }, t('section_exercises', lesson.day), " ", /*#__PURE__*/React.createElement("span", {
    className: "ex-count"
  }, progress)), /*#__PURE__*/React.createElement("div", {
    className: "exercise-box"
  }, progressBar(), /*#__PURE__*/React.createElement("div", {
    className: "ex-prompt"
  }, translatePrompt(ex.prompt, lesson.day)), ex.question && /*#__PURE__*/React.createElement("div", {
    className: "ex-question"
  }, ex.question), /*#__PURE__*/React.createElement("div", {
    className: "ex-typing-row"
  }, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    className: "ex-input",
    type: "text",
    value: answer,
    onChange: function onChange(e) {
      return setAnswer(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === 'Enter') handleCheck();
    },
    placeholder: ex.placeholder || 'Type your answer...',
    disabled: revealed,
    autoFocus: true
  }), /*#__PURE__*/React.createElement("button", {
    className: "ex-check-btn",
    onClick: handleCheck,
    disabled: !answer.trim() || revealed
  }, t('check_btn', lesson.day))), revealed && /*#__PURE__*/React.createElement("div", {
    className: "ex-feedback ".concat(isRight ? 'correct' : 'wrong'),
    'aria-live': "polite",
    role: "status"
  }, isRight ? '✓ Correct!' : "\u2717  Answer: ".concat(ex.answers[0]))));
}
