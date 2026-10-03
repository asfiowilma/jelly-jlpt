"use strict";

// Maps exercise prompt strings to UI_STRINGS keys for translation
var PROMPT_KEYS = {
  'Listen and choose the meaning:': 'prompt_listen',
  'What is the reading for this character?': 'prompt_mc_char',
  'What does this word mean?': 'prompt_mc_word',
  'Type the reading for this character:': 'prompt_type_char',
  'What does this word mean? (type in English)': 'prompt_type_word',
};
function translatePrompt(prompt, level) {
  var key = PROMPT_KEYS[prompt];
  if (!key) return prompt;
  return t(key, level);
}

// Furigana parts ({ t, r? }, lib.js furiganaParts) → text and <ruby> elements (reading passages)
function rubyEls(parts) {
  return parts.map(function (p, i) {
    return p.r ? React.createElement("ruby", { key: i }, p.t, React.createElement("rt", null, p.r)) : p.t;
  });
}

// ── Exercises: the unit quiz (ticket 35) ────────────────────────────────────
// Pass mark gates completion (Q28); a missed question comes back once at the
// end in another form, unscored (Q31). onResult(scoreQuiz(...)) when finished.
// build(unit) → questions (default buildExercises; mocks pass their own section list).
function Exercises(_ref9) {
  var unit = _ref9.unit,
    onStart = _ref9.onStart,
    onFinish = _ref9.onFinish,
    onResult = _ref9.onResult,
    build = _ref9.build || buildExercises;
  var _React$useState9 = React.useState(function () {
      return build(unit);
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
  var _React$useState19 = React.useState(false),
    _React$useState20 = _slicedToArray(_React$useState19, 2),
    done = _React$useState20[0],
    setDone = _React$useState20[1];
  var _React$useState21 = React.useState(false),
    _React$useState22 = _slicedToArray(_React$useState21, 2),
    started = _React$useState22[0],
    setStarted = _React$useState22[1];
  // Per-answer results (true/false) in order, parallel to exs (scoreQuiz)
  var _React$useStateRes = React.useState([]),
    _React$useStateRes2 = _slicedToArray(_React$useStateRes, 2),
    results = _React$useStateRes2[0],
    setResults = _React$useStateRes2[1];
  // reorder: picked item indices in order; pair_match: picks[itemIdx] = optionIdx
  var _React$useState23 = React.useState([]),
    _React$useState24 = _slicedToArray(_React$useState23, 2),
    picks = _React$useState24[0],
    setPicks = _React$useState24[1];
  var inputRef = React.useRef(null);
  // listen_dialog (ticket 17): plays used, transcript shown early (no ja voice), voice status
  var _plays = React.useState(0), plays = _plays[0], setPlays = _plays[1];
  var _early = React.useState(false), showEarly = _early[0], setShowEarly = _early[1];
  var _voice = React.useState(function () { return jaVoiceStatus(false); }), voiceStatus = _voice[0], setVoiceStatus = _voice[1];
  var stopRef = React.useRef(null);
  var stopAudio = function () { if (stopRef.current) stopRef.current(); stopRef.current = null; };
  React.useEffect(function () { return stopAudio; }, [cur, started]); // question change / unmount
  React.useEffect(function () {
    var ss = window.speechSynthesis;
    if (!ss || !ss.addEventListener) return undefined;
    var check = function () { setVoiceStatus(jaVoiceStatus(true)); };
    ss.addEventListener('voiceschanged', check);
    var tm = setTimeout(check, 2000); // no voiceschanged at all → settle as 'none' if still empty
    return function () { ss.removeEventListener('voiceschanged', check); clearTimeout(tm); };
  }, []);
  if (exs.length === 0) return null;
  var needPct = Math.round(passMark(unit.kind) * 100) + '%';

  // ── Not started: show Start Quiz button ──────────────────────────────────
  if (!started) {
    return /*#__PURE__*/React.createElement("div", {
      className: "quiz-start-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "quiz-start-box"
    }, /*#__PURE__*/React.createElement("div", {
      className: "quiz-start-title"
    }, t('quiz_title', unit.level)), /*#__PURE__*/React.createElement("div", {
      className: "quiz-start-hint"
    }, "The lesson content above will be hidden while you answer ", exs.length, " questions. Score ", needPct,
      " or more to complete this unit."), /*#__PURE__*/React.createElement("button", {
      className: "quiz-start-btn",
      onClick: function onClick() {
        setStarted(true);
        onStart && onStart();
      }
    }, t('start_quiz', unit.level))));
  }
  // Retake: a fresh set of questions (Q28)
  var retry = function retry() {
    setExs(build(unit));
    setCur(0);
    setAnswer('');
    setSelected(null);
    setRevealed(false);
    setPicks([]);
    setResults([]);
    setPlays(0);
    setShowEarly(false);
    stopAudio();
    setDone(false);
    setStarted(false);
    onFinish && onFinish();
  };
  // advance(wasRight, manual): record the answer, then move on after 1 s, or (manual) when the
  // learner presses Next (listen_dialog: time to read the transcript).
  var advance = function advance(wasRight, manual) {
    playSfx(wasRight ? 'correct' : 'wrong');
    var ex = exs[cur];
    var again = !wasRight && !ex.requeue ? requeueExercise(unit, ex) : null;
    var nextExs = again ? exs.concat([again]) : exs;
    var nextRes = results.concat([wasRight]);
    if (again) setExs(nextExs);
    setResults(nextRes);
    if (!manual) setTimeout(function () { proceed(nextExs, nextRes); }, 1000);
  };
  var proceed = function proceed(nextExs, nextRes) {
    stopAudio();
    setPlays(0);
    setShowEarly(false);
    if (cur + 1 >= nextExs.length) {
      var s = scoreQuiz(unit.kind, nextExs, nextRes);
      setDone(true);
      Store.logQuiz(unit.id, s.right, s.total);
      playSfx('complete');
      onFinish && onFinish();
      onResult && onResult(s);
    } else {
      setCur(function (c) {
        return c + 1;
      });
      setAnswer('');
      setSelected(null);
      setRevealed(false);
      setPicks([]);
      setTimeout(function () {
        return inputRef.current && inputRef.current.focus();
      }, 50);
    }
  };
  // One segment per question: answered → ok/bad, current → now; re-asked ones dashed
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
    var s = scoreQuiz(unit.kind, exs, results);
    var pct = Math.round(s.right / s.total * 100);
    return /*#__PURE__*/React.createElement("div", {
      className: "section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-label"
    }, t('section_exercises', unit.level)), /*#__PURE__*/React.createElement("div", {
      className: "exercise-box"
    }, progressBar(), /*#__PURE__*/React.createElement("div", {
      className: "ex-finish"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ex-finish-score"
    }, s.passed ? (pct === 100 ? '🌟' : '✅') : '📚', " ", s.right, " / ", s.total, " correct (", pct, "%)"),
    React.createElement("div", {
      className: "ex-finish-verdict " + (s.passed ? 'pass' : 'fail'),
      role: "status"
    }, s.passed ? "Passed (pass mark " + needPct + ") — unit complete." : "Not passed yet: you need " + needPct + ". Retake with new questions."),
    /*#__PURE__*/React.createElement("button", {
      className: "ex-retry-btn",
      onClick: retry
    }, t('try_again', unit.level)))));
  }
  var ex = exs[cur];
  var progress = "".concat(cur + 1, " / ").concat(exs.length);
  // Furigana parts (quiz rules, Q33) → ruby; u = the underlined / asked part (mondai).
  var partsEl = function partsEl(parts) {
    return parts.map(function (p, i) {
      var el = p.r ? React.createElement("ruby", { key: i }, p.t, React.createElement("rt", null, p.r)) : p.t;
      return p.u ? React.createElement("u", { key: i, className: "ex-u" }, el) : el;
    });
  };
  var SENTENCE_TYPES = ['gap', 'kanji_yomi', 'hyouki', 'bunmyaku', 'order', 'iikae', 'bunshou'];
  // The question line (plus the passage of a text-with-blanks, and the English of a
  // gap sentence).
  var questionEl = function questionEl() {
    return [ex.passageParts && React.createElement("div", { key: "p", className: "passage-box", lang: "ja" }, partsEl(ex.passageParts)),
      !ex.passageParts && (ex.question || ex.parts) && React.createElement("div", {
        key: "q", className: "ex-question" + (SENTENCE_TYPES.indexOf(ex.type) >= 0 ? ' sentence' : ''), lang: "ja"
      }, ex.parts ? partsEl(ex.parts) : ex.question), ex.note && React.createElement("div", { key: "n", className: "ex-note" }, ex.note)];
  };
  var header = function header() {
    return [React.createElement("div", {
      key: "label", className: "section-label"
    }, t('section_exercises', unit.level), " ", React.createElement("span", {
      className: "ex-count"
    }, progress), ex.requeue && React.createElement("span", { className: "ex-count" }, " · again, not scored"))];
  };
  // Shared frame for the reorder / pair_match branches below
  var frame = function frame(body, feedback) {
    return React.createElement("div", {
      className: "section"
    }, header(), React.createElement("div", {
      className: "exercise-box"
    }, progressBar(), React.createElement("div", {
      className: "ex-prompt"
    }, translatePrompt(ex.prompt, unit.level)), questionEl(), body, revealed && React.createElement("div", {
      className: "ex-feedback ".concat(feedback.right ? 'correct' : 'wrong'),
      'aria-live': "polite",
      role: "status"
    }, feedback.right ? '✓ Correct!' : "✗  Answer: ".concat(feedback.answer))));
  };
  var checkBtn = function checkBtn(ready, isRight) {
    return React.createElement("button", {
      className: "ex-check-btn",
      disabled: !ready || revealed,
      onClick: function onClick() {
        setRevealed(true);
        advance(isRight);
      }
    }, t('check_btn', unit.level));
  };

  // Reorder: tap tiles to build the sentence, tap a placed tile to remove it
  if (ex.type === 'reorder') {
    var builtRight = answerIsRight(ex, picks);
    return frame([React.createElement("div", {
      key: "built",
      className: "ex-options ex-reorder-built"
    }, picks.map(function (itemIdx, pos) {
      return React.createElement("button", {
        key: pos,
        className: "ex-option",
        disabled: revealed,
        onClick: function onClick() {
          setPicks(picks.filter(function (_, p) {
            return p !== pos;
          }));
        }
      }, ex.items[itemIdx]);
    })), React.createElement("div", {
      key: "pool",
      className: "ex-options"
    }, ex.items.map(function (item, i) {
      return picks.indexOf(i) === -1 && React.createElement("button", {
        key: i,
        className: "ex-option",
        disabled: revealed,
        onClick: function onClick() {
          setPicks(picks.concat([i]));
        }
      }, item);
    })), React.createElement("div", {
      key: "actions",
      className: "ex-typing-row"
    }, React.createElement("button", {
      className: "ex-check-btn",
      disabled: !picks.length || revealed,
      onClick: function onClick() {
        setPicks([]);
      }
    }, "Reset"), checkBtn(picks.length === ex.items.length, builtRight))], {
      right: builtRight,
      answer: ex.answer
    });
  }

  // Pair match: pick a meaning for each (shuffled) word
  if (ex.type === 'pair_match') {
    var meaningOf = {};
    (ex.pairs || []).forEach(function (p) {
      meaningOf[p[0]] = p[1];
    });
    var allPicked = ex.items.every(function (_, i) {
      return typeof picks[i] === 'number';
    });
    var pairsRight = answerIsRight(ex, picks);
    return frame([ex.items.map(function (w, i) {
      return React.createElement("div", {
        key: i,
        className: "ex-typing-row"
      }, React.createElement("span", {
        className: "ex-pair-word"
      }, w), React.createElement("select", {
        className: "ex-input",
        'aria-label': 'Meaning of ' + w,
        value: typeof picks[i] === 'number' ? String(picks[i]) : '',
        disabled: revealed,
        onChange: function onChange(e) {
          var next = picks.slice();
          next[i] = e.target.value === '' ? undefined : Number(e.target.value);
          setPicks(next);
        }
      }, React.createElement("option", {
        value: ""
      }, "—"), ex.options.map(function (opt, oi) {
        return React.createElement("option", {
          key: oi,
          value: String(oi)
        }, opt);
      })));
    }), React.createElement("div", {
      key: "actions",
      className: "ex-typing-row"
    }, checkBtn(allPicked, pairsRight))], {
      right: pairsRight,
      answer: ex.items.map(function (w) {
        return w + ' = ' + meaningOf[w];
      }).join(', ')
    });
  }
  // Listening (ticket 17): Play speaks the script (speakScript); the transcript, English and
  // explanation show after answering, then Next. Spoken options (utterance / quick) are
  // numbered buttons with their own play button; their text shows only after answering.
  if (ex.type === 'listen_dialog') {
    var answered = selected !== null;
    var playsLeft = ex.maxPlays ? ex.maxPlays - plays : Infinity;
    var play = function (lines) {
      if (playsLeft <= 0) return;
      setPlays(plays + 1);
      stopAudio();
      stopRef.current = speakScript(lines);
    };
    var SPEAKER = { M: 'Man', F: 'Woman', N: 'Narrator' };
    var transcript = function () { return React.createElement("div", { key: "script", className: "passage-box listen-script", lang: "ja" },
      ex.lines.map(function (l, i) {
        return React.createElement("div", { key: i, className: "listen-line" },
          React.createElement("span", { className: "listen-who", lang: "en" }, SPEAKER[l.speaker]), partsEl(l.parts));
      }),
      ex.questionParts && React.createElement("div", { className: "listen-line" },
        React.createElement("span", { className: "listen-who", lang: "en" }, SPEAKER.N), partsEl(ex.questionParts)),
      (answered || !ex.spokenOptions) ? null : React.createElement("div", { className: "ex-hint", lang: "en" }, "The replies show after you answer."),
      answered && React.createElement("div", { className: "passage-en", lang: "en" }, ex.en)); };
    return React.createElement("div", { className: "section" }, header(), React.createElement("div", { className: "exercise-box" },
      progressBar(),
      React.createElement("div", { className: "ex-prompt" }, ex.prompt),
      React.createElement("div", { className: "ex-question" },
        React.createElement("button", {
          className: "ex-listen-btn", disabled: playsLeft <= 0, onClick: function () { play(ex.script); }
        }, plays ? "🔊 Play again" : "🔊 Play"),
        ex.maxPlays ? React.createElement("div", { className: "ex-hint" }, playsLeft > 0 ? playsLeft + (playsLeft === 1 ? " play" : " plays") + " left" : "No replays left") : null),
      voiceStatus === 'none' && !answered && React.createElement("div", { className: "ex-note listen-warn", role: "status" },
        "This browser has no Japanese voice, so the audio may be silent or wrong. ",
        showEarly ? "The transcript is below." : React.createElement("button", { className: "link-btn", onClick: function () { setShowEarly(true); } }, "Read the transcript instead")),
      (answered || showEarly) && transcript(),
      React.createElement("div", { className: "ex-options" + (ex.spokenOptions ? " listen-options" : "") }, ex.options.map(function (opt, i) {
        var cls = 'ex-option';
        if (answered) {
          if (i === ex.correct) cls += ' correct';else if (i === selected) cls += ' wrong';
        }
        var choose = React.createElement("button", {
          key: ex.spokenOptions ? "c" : i, className: cls, lang: "ja", disabled: answered,
          'aria-label': ex.spokenOptions && !answered ? "Choose reply " + (i + 1) : undefined,
          onClick: function () { stopAudio(); setSelected(i); advance(answerIsRight(ex, i), true); }
        }, ex.spokenOptions ? [String(i + 1), answered ? React.createElement("span", { key: "t" }, "  ", partsEl(ex.optionParts[i])) : null] : partsEl(ex.optionParts[i]));
        if (!ex.spokenOptions) return choose;
        return React.createElement("div", { key: i, className: "listen-option" },
          React.createElement("button", {
            className: "ex-listen-opt", 'aria-label': "Play reply " + (i + 1), disabled: playsLeft <= 0,
            onClick: function () { play([ex.optionSpeech[i]]); }
          }, "🔊"), choose);
      })),
      answered && ex.explain && React.createElement("div", { className: "ex-note", role: "status" }, ex.explain),
      answered && React.createElement("div", { className: "ex-typing-row" },
        React.createElement("button", { className: "ex-check-btn ex-next-btn", onClick: function () { proceed(exs, results); } }, t('nav_next', unit.level)))));
  }
  if (ex.options && typeof ex.correct === 'number') {
    return /*#__PURE__*/React.createElement("div", {
      className: "section"
    }, header(), /*#__PURE__*/React.createElement("div", {
      className: "exercise-box"
    }, progressBar(), /*#__PURE__*/React.createElement("div", {
      className: "ex-prompt"
    }, translatePrompt(ex.prompt, unit.level)), ex.type === 'reading' && React.createElement("div", {
      className: "passage-box", lang: "ja"
    }, rubyEls(ex.passage)), ex.type === 'listen' ? /*#__PURE__*/React.createElement("div", {
      className: "ex-question"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ex-listen-btn",
      onClick: function onClick() {
        return speak(ex.audio);
      },
      'aria-label': "Listen to audio"
    }, "🔊 Play")) : questionEl(), /*#__PURE__*/React.createElement("div", {
      className: "ex-options"
    }, ex.options.map(function (opt, i) {
      var cls = 'ex-option';
      if (selected !== null) {
        if (i === ex.correct) cls += ' correct';else if (i === selected) cls += ' wrong';
      }
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        className: cls,
        lang: SENTENCE_TYPES.indexOf(ex.type) >= 0 ? "ja" : undefined,
        disabled: selected !== null,
        onClick: function onClick() {
          setSelected(i);
          advance(answerIsRight(ex, i));
        }
      }, ex.optionParts ? partsEl(ex.optionParts[i]) : opt);
    })), selected !== null && ex.explain && React.createElement("div", {
      className: "ex-note", role: "status"
    }, ex.explain)));
  }

  // Typing exercise (typing, conjugation)
  var handleCheck = function handleCheck() {
    if (!answer.trim() || revealed) return;
    var final = ex.kana ? answer.replace(/n$/, 'ん') : answer; // a lone trailing n waits for a vowel while typing
    setAnswer(final);
    setRevealed(true);
    advance(answerIsRight(ex, final));
  };
  var isRight = revealed && answerIsRight(ex, answer);
  return /*#__PURE__*/React.createElement("div", {
    className: "section"
  }, header(), /*#__PURE__*/React.createElement("div", {
    className: "exercise-box"
  }, progressBar(), /*#__PURE__*/React.createElement("div", {
    className: "ex-prompt"
  }, translatePrompt(ex.prompt, unit.level)), ex.passage && React.createElement("div", {
    className: "passage-box"
  }, ex.passage), questionEl(), /*#__PURE__*/React.createElement("div", {
    className: "ex-typing-row"
  }, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    className: "ex-input",
    type: "text",
    value: answer,
    onChange: function onChange(e) {
      return setAnswer(ex.kana ? romajiToKana(e.target.value) : e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      // Enter while an IME is composing confirms the kana, not the answer
      if (e.key === 'Enter' && !(e.nativeEvent && e.nativeEvent.isComposing)) handleCheck();
    },
    placeholder: ex.placeholder || 'Type your answer...',
    'aria-label': ex.prompt,
    disabled: revealed,
    autoFocus: true
  }), /*#__PURE__*/React.createElement("button", {
    className: "ex-check-btn",
    onClick: handleCheck,
    disabled: !answer.trim() || revealed
  }, t('check_btn', unit.level))), ex.hint && React.createElement("div", {
    className: "ex-hint"
  }, ex.hint), revealed && /*#__PURE__*/React.createElement("div", {
    className: "ex-feedback ".concat(isRight ? 'correct' : 'wrong'),
    'aria-live': "polite",
    role: "status"
  }, isRight ? '✓ Correct!' : "✗  Answer: ".concat((ex.answers || [])[0] || ''))));
}
