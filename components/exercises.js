"use strict";

// ── Quiz helpers (pure) ─────────────────────────────────────────────────────

// The right answer as text, for the feedback dock and the missed list.
function exAnswer(ex) {
  if (ex.type === 'pair_match') {
    var meaningOf = {};
    (ex.pairs || []).forEach(function (p) { meaningOf[p[0]] = p[1]; });
    return ex.items.map(function (w) { return w + ' = ' + meaningOf[w]; }).join(' · ');
  }
  if (ex.type === 'reorder') return ex.answer;
  if (ex.options && typeof ex.correct === 'number') return ex.options[ex.correct];
  return (ex.answers || [])[0] || '';
}
// A short label for the question (missed list).
function exQuestionText(ex) {
  if (ex.type === 'listen_dialog' || ex.type === 'listen') return 'Listening';
  if (ex.type === 'reading') return ex.prompt;
  if (ex.parts) return ex.parts.map(function (p) { return p.t; }).join('');
  return ex.question || ex.prompt;
}
// What the dock speaker reads out after answering: the word or kana asked about. '' = none.
function exSpeech(ex) {
  var it = ex.item;
  if (ex.speech) return ex.speech; // a bound morpheme: the whole compound (日本人), never the bare suffix
  if (!it || ex.type === 'listen_dialog' || ex.type === 'listen') return '';
  if (it.kind === 'vocab') return it.reading || it.word;
  if (it.kind === 'kana') return it.char || it.kana || '';
  if (it.kind === 'kanaword') return it.word; // a kana reading word (ticket 44)
  return '';
}

// ── Exercises: the unit quiz (ticket 35) ────────────────────────────────────
// Pass mark gates completion (Q28); a missed question comes back once at the
// end in another form, unscored (Q31). onResult(scoreQuiz(...)) when finished.
// build(unit) → questions (default buildExercises; mocks pass their own section list).
//
// Starting the quiz opens a full-screen layer (.ql) over the app: body scroll is locked, the
// lesson is just covered. Layout is fixed: top bar (✕, progress, count, clock), the question,
// and a dock that holds Skip + Check while asking, then the feedback + Continue. Choices are
// selected first and checked after (Enter checks, 1-4 pick); nothing auto-advances.
// onNextStage: optional, shows "Next stage" on a passed result.
function Exercises(_ref9) {
  var h = React.createElement;
  var unit = _ref9.unit,
    onStart = _ref9.onStart,
    onFinish = _ref9.onFinish,
    onResult = _ref9.onResult,
    onNextStage = _ref9.onNextStage,
    handoff = _ref9.handoff, // Today's plan after a pass: { line, primary, secondary } (quizHandoff)
    sfxOn = _ref9.sfxOn,
    setSfxOn = _ref9.setSfxOn, // same pref as Settings; omitted = no mute button
    passed = _ref9.passed, // the stage is already done: the entry card offers a retake
    build = _ref9.build || buildExercises;
  var lv = unit.level;
  var _exs = React.useState(function () { return build(unit); }), exs = _exs[0], setExs = _exs[1];
  var _cur = React.useState(0), cur = _cur[0], setCur = _cur[1];
  var _answer = React.useState(''), answer = _answer[0], setAnswer = _answer[1];
  var _selected = React.useState(null), selected = _selected[0], setSelected = _selected[1]; // checked option (-1 = skipped)
  var _revealed = React.useState(false), revealed = _revealed[0], setRevealed = _revealed[1]; // this question is checked
  var _done = React.useState(false), done = _done[0], setDone = _done[1];
  var _started = React.useState(false), started = _started[0], setStarted = _started[1];
  useQuizBusy(started && !done);
  // Per-answer results (true/false) in order, parallel to exs (scoreQuiz)
  var _results = React.useState([]), results = _results[0], setResults = _results[1];
  // reorder: picked item indices in order; pair_match: picks[itemIdx] = optionIdx
  var _picks = React.useState([]), picks = _picks[0], setPicks = _picks[1];
  var inputRef = React.useRef(null);
  // listen_dialog (ticket 17): plays used, transcript shown early (no ja voice), voice status
  var _plays = React.useState(0), plays = _plays[0], setPlays = _plays[1];
  var _early = React.useState(false), showEarly = _early[0], setShowEarly = _early[1];
  var _voice = React.useState(function () { return jaVoiceStatus(false); }), voiceStatus = _voice[0], setVoiceStatus = _voice[1];
  var stopRef = React.useRef(null);
  // Timed quizzes (ticket 18, Q36): lesson reviews (mini-mocks) and prep drills run against a clock
  // at real N5 pacing (quizSeconds); when it runs out, every unanswered question counts as wrong.
  var timed = isTimedQuiz(unit);
  var _dl = React.useState(null), deadline = _dl[0], setDeadline = _dl[1];
  var _to = React.useState(false), timedOut = _to[0], setTimedOut = _to[1];
  var _ask = React.useState(null), supportAsk = _ask[0], setSupportAsk = _ask[1]; // milestone to ask for (donation jar), set on a pass
  var _tick = React.useState(0), setTick = _tick[1];
  var _pick = React.useState(null), pick = _pick[0], setPick = _pick[1]; // chosen option, not checked yet
  var _leaving = React.useState(false), leaving = _leaving[0], setLeaving = _leaving[1]; // "Leave the quiz?"
  var _left = React.useState(null), pairLeft = _left[0], setPairLeft = _left[1]; // pair_match: word waiting for its meaning
  var _speaking = React.useState(false), speaking = _speaking[0], setSpeaking = _speaking[1];
  // typed another reading of the same spelling (人: じん for ひと): which word is meant, try again
  var _notice = React.useState(null), notice = _notice[0], setNotice = _notice[1];
  var stopAudio = function () { if (stopRef.current) stopRef.current(); stopRef.current = null; setSpeaking(false); };
  React.useEffect(function () { return stopAudio; }, [cur, started]); // question change / unmount
  React.useEffect(function () {
    var ss = window.speechSynthesis;
    if (!ss || !ss.addEventListener) return undefined;
    var check = function () { setVoiceStatus(jaVoiceStatus(true)); };
    ss.addEventListener('voiceschanged', check);
    var tm = setTimeout(check, 2000); // no voiceschanged at all → settle as 'none' if still empty
    return function () { ss.removeEventListener('voiceschanged', check); clearTimeout(tm); };
  }, []);
  var latest = React.useRef(null);
  latest.current = { exs: exs, results: results };
  var finishedRef = React.useRef(false);
  React.useEffect(function () {
    if (!deadline || done) return undefined;
    var id = setInterval(function () {
      if (Date.now() < deadline) return setTick(function (n) { return n + 1; });
      clearInterval(id);
      var L = latest.current;
      setTimedOut(true);
      finish(L.exs, timeUpResults(L.exs, L.results));
    }, 1000);
    return function () { clearInterval(id); };
  }, [deadline, done]);
  // The .ql layer (scroll lock, keyboard, focus, Tab trap): quiz-shell.js. keyRef.current is replaced
  // every render so the handler sees the current question.
  var shell = useQuizLayer(started, leaving);
  var keyRef = shell.keyRef, trapTab = shell.trapTab;
  if (exs.length === 0) return null;
  var needPct = passMarkText(unit);
  var clock = function (s) { return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  // finish(exs, results): score, log and report the quiz (last answer or time up), once.
  var finish = function finish(nextExs, nextRes) {
    if (finishedRef.current) return;
    finishedRef.current = true;
    stopAudio();
    var s = scoreQuiz(unit.kind, nextExs, nextRes);
    setResults(nextRes);
    setLeaving(false);
    setDone(true);
    Store.logQuiz(unit.id, s.right, s.total, nextExs.filter(function (e) { return e.overridden; }).length, s.passed);
    playSfx('complete');
    if (s.passed) setSupportAsk(supportAskNow(unit));
    onResult && onResult(s);
  };

  // launch(questions): a fresh run of the quiz, clock started when timed.
  var launch = function launch(nextExs) {
    stopAudio();
    setExs(nextExs);
    setCur(0);
    setAnswer('');
    setSelected(null);
    setPick(null);
    setRevealed(false);
    setPicks([]);
    setPairLeft(null);
    setResults([]);
    setPlays(0);
    setShowEarly(false);
    setDone(false);
    setLeaving(false);
    setTimedOut(false);
    setDeadline(timed ? Date.now() + quizSeconds(nextExs) * 1000 : null);
    finishedRef.current = false;
    setStarted(true);
    onStart && onStart();
  };
  // Back to the lesson: the quiz is dropped, the Start banner comes back (Q28: retake = new questions).
  var leaveQuiz = function leaveQuiz() {
    stopAudio();
    setExs(build(unit));
    setCur(0);
    setAnswer('');
    setSelected(null);
    setPick(null);
    setRevealed(false);
    setPicks([]);
    setPairLeft(null);
    setResults([]);
    setPlays(0);
    setShowEarly(false);
    setDone(false);
    setLeaving(false);
    setStarted(false);
    setDeadline(null);
    setTimedOut(false);
    finishedRef.current = false;
    onFinish && onFinish();
  };

  // ── Not started: the Start banner (the quiz itself is the layer below) ─────
  if (!started) {
    // The one filled button on the stage page until the stage is passed; after that the stage bar's
    // "Next stage" is, and this card turns quiet (a retake).
    return h("div", { className: "qz-entry" },
      h("div", { className: "txt" },
        h("div", { className: "eyebrow" }, "Stage quiz", passed && " · passed"),
        h("h3", null, passed ? "Want another go?" : t('quiz_title', lv)),
        h("div", { className: "chips" },
          h("span", { className: "chip" }, exs.length, " questions"),
          h("span", { className: "chip" }, "Pass mark ", needPct),
          timed && h("span", { className: "chip" }, "Timed · ", clock(quizSeconds(exs)))),
        h("p", { className: "note" }, passed ? "A retake uses new questions. Your stage stays complete."
          : timed ? "Like the real test: unanswered questions count as wrong when time runs out." : "Opens full screen. Esc leaves.")),
      h("button", { className: "qz-cta" + (passed ? " quiet" : "") + " quiz-start-btn", onClick: function () { launch(exs); } },
        !passed && icon('play'), passed ? "Retake quiz" : t('start_quiz', lv)));
  }

  // advance(wasRight): record the answer and queue a re-ask of a miss. The learner moves on with Continue.
  var advance = function advance(wasRight) {
    playSfx(wasRight ? 'correct' : 'wrong');
    var ex = exs[cur];
    rememberAsked(ex); // device-local recent memory (ticket 43)
    var again = !wasRight && !ex.requeue ? requeueExercise(unit, ex) : null;
    if (again) setExs(exs.concat([Object.assign(again, { requeueOf: cur })]));
    setResults(results.concat([wasRight]));
  };
  var proceed = function proceed(nextExs, nextRes) {
    stopAudio();
    setPlays(0);
    setShowEarly(false);
    if (finishedRef.current) return; // the clock already ended the quiz
    if (cur + 1 >= nextExs.length) {
      finish(nextExs, nextRes);
    } else {
      setCur(function (c) { return c + 1; });
      setAnswer('');
      setSelected(null);
      setPick(null);
      setRevealed(false);
      setPicks([]);
      setPairLeft(null);
      setTimeout(function () { return inputRef.current && inputRef.current.focus(); }, 50);
    }
  };
  var clockLeft = deadline ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000)) : 0;
  // One segment per question: answered → ok/bad, current → now; re-asked ones are longer than the quiz
  var topBar = function (label, ex) {
    return qzTop(h, {
      xLabel: "Leave quiz", onX: function () { if (done) leaveQuiz(); else setLeaving(true); },
      progLabel: "Quiz progress", now: results.length,
      segs: exs.map(function (_, i) { return i < results.length ? results[i] ? 'ok' : 'bad' : !done && i === cur ? 'now' : ''; }),
      meta: [
        ex && ex.requeue && h("span", { key: "again", className: "qz-again" }, "Again · not scored"),
        h("span", { key: "label" }, label),
        setSfxOn && h("button", {
          key: "snd", className: "qz-snd", 'aria-pressed': !sfxOn, 'aria-label': sfxOn ? "Mute sounds" : "Unmute sounds",
          onClick: function () { setSfxOn(!sfxOn); if (!sfxOn) playSfx('correct'); }
        }, icon(sfxOn ? 'speaker' : 'speakerOff')),
        deadline && !done && h("span", { key: "timer", className: "qz-timer" + (clockLeft < 60 ? " low" : ""), role: "timer", 'aria-label': "Time left" }, icon('clock'), clock(clockLeft))]
    });
  };
  var leaveDialog = leaving && qzLeaveDialog(h, {
    label: "Leave the quiz", title: "Leave the quiz?", text: "Your answers so far won’t be saved. You can retake it with new questions.",
    stay: "Keep going", leave: "Leave", onStay: function () { setLeaving(false); }, onLeave: leaveQuiz });
  var layer = function (top, main, dock, wide) {
    return qzLayer(h, shell, { label: t('section_exercises', lv), top: top, main: main, dock: dock, wide: wide, overlay: leaveDialog });
  };

  // ── Result ────────────────────────────────────────────────────────────────
  if (done) {
    var s = scoreQuiz(unit.kind, exs, results);
    var pct = s.total ? Math.round(s.right / s.total * 100) : 0;
    var missed = [];
    exs.forEach(function (e, i) { if (results[i] === false && !e.requeue) missed.push(e); });
    var shown = missed.slice(0, 8);
    var retake = function () { launch(build(unit)); };
    keyRef.current = function (e) { if (trapTab(e)) return; if (e.key === 'Escape') leaveQuiz(); };
    return layer(topBar("Done"), [
      h("div", { key: "res", className: "qz-res" },
        h("div", { className: "qz-ring" },
          h("svg", { viewBox: "0 0 140 140", 'aria-hidden': "true" },
            h("circle", { className: "t", cx: 70, cy: 70, r: 60 }),
            h("circle", { className: "v " + (s.passed ? 'pass' : 'fail'), cx: 70, cy: 70, r: 60, strokeDasharray: (QZ_RING * pct / 100) + " " + QZ_RING })),
          h("span", { className: "qz-jelly" }, s.passed ? h(JellyExcited, { size: 84 }) : jelly('oops', 84))),
        h("div", null,
          h("h3", { className: "qz-verdict " + (s.passed ? 'pass' : 'fail'), role: "status" }, s.passed ? "Quiz passed. Stage complete" : "Not quite yet"),
          h("p", null, s.right, " / ", s.total, " · ", pct, "% · pass mark ", needPct, s.passed ? "." : ". Reread the lesson, then try again. Your answers so far still count toward review."),
          s.passed && handoff && h("p", { className: "qz-today" }, handoff.line),
          // kana quizzes (ticket 42): both parts must pass
          s.split && h("ul", { className: "qz-parts" }, [["Reading", s.split.read], ["Meanings", s.split.meaning]].filter(function (p) { return p[1].total > 0; }).map(function (p) {
            var ok = p[1].right / p[1].total >= p[1].need - 1e-9;
            return h("li", { key: p[0], className: ok ? "pass" : "fail" }, p[0], ": ", p[1].right, " / ", p[1].total,
              " · ", Math.round(p[1].need * 100), "% needed · ", ok ? "passed" : "not yet");
          })),
          timedOut && h("p", { className: "qz-timeup" }, "Time is up: unanswered questions count as wrong."))),
      supportAsk && h(SupportAsk, { key: "ask", kind: supportAsk, level: lv, onNo: function () { supportDismiss(); setSupportAsk(null); } }),
      missed.length > 0 && h("div", { key: "mh", className: "qz-miss-h" }, "Missed (", missed.length, ")"),
      missed.length > 0 && h("ul", { key: "ml", className: "qz-miss" }, shown.map(function (e, i) {
        var say = exSpeech(e);
        return h("li", { key: i },
          h("span", { className: "q", lang: "ja" }, exQuestionText(e)),
          h("span", { className: "a", lang: QZ_JA.test(exAnswer(e)) ? "ja" : "en" }, exAnswer(e)),
          say ? h("button", { className: "qz-gb", 'aria-label': "Hear it", onClick: function () { speak(say); } }, icon('speaker')) : h("span", null));
      })),
      missed.length > shown.length && h("p", { key: "more", className: "qz-more" }, "and ", missed.length - shown.length, " more")
    ], h("div", { className: "qz-dock resd" }, h("div", { className: "qz-in" },
      h("button", { className: "qz-gb", onClick: leaveQuiz }, "Back to the lesson"),
      s.passed && h("button", { className: "qz-gb", onClick: retake }, "Retake"),
      h("span", { className: "qz-sp" }),
      s.passed ? (handoff
        ? [handoff.secondary && h("button", { key: "s", className: "qz-gb", onClick: handoff.secondary.onClick }, handoff.secondary.label),
           h("button", { key: "p", className: "qz-btn ok", onClick: handoff.primary.onClick }, handoff.primary.label)]
        : onNextStage && h("button", { className: "qz-btn ok", onClick: onNextStage }, "Next stage →"))
        : h("button", { className: "qz-btn", onClick: retake }, "Try again"))));
  }

  // ── A question ────────────────────────────────────────────────────────────
  var ex = exs[cur];
  var isOpt = !!ex.options && typeof ex.correct === 'number' && ex.type !== 'pair_match';
  var isPair = ex.type === 'pair_match', isReorder = ex.type === 'reorder';
  var isListen = ex.type === 'listen_dialog';
  var isType = !isOpt && !isPair && !isReorder;
  var ready = isOpt ? pick !== null
    : isReorder ? picks.length === (ex.need || ex.items.length) // need: a Remix chunk list holds a distractor
    : isPair ? ex.items.every(function (_, i) { return typeof picks[i] === 'number'; })
    : answer.trim() !== '';
  var okNow = revealed && results[cur] === true;
  var tone = !revealed ? '' : okNow ? ' ok' : ' bad';
  // Check: kana answers take a lone trailing n as ん (it waits for a vowel while typing)
  var check = function () {
    if (revealed || !ready) return;
    var resp = isOpt ? pick : isReorder || isPair ? picks : (ex.kana ? kanaBox(ex, answer.replace(/n$/, 'ん')) : answer);
    if (typeof resp === 'string') setAnswer(resp);
    var other = isType && otherReading(ex, resp);
    if (other) return setNotice(otherReadingNote(ex, other)); // not a miss: say which word, try again
    var twin = isType && otherMeaning(ex, resp);
    if (twin) return setNotice(otherMeaningNote(ex, twin));
    setNotice(null);
    if (isOpt) setSelected(pick); // the track keeps playing; leaving the question stops it
    setRevealed(true);
    advance(answerIsRight(ex, resp));
  };
  var skip = function () {
    if (revealed) return;
    stopAudio();
    if (isOpt) setSelected(-1);
    setRevealed(true);
    advance(false);
  };
  var next = function () { setNotice(null); proceed(exs, results); };
  // "I was right" (typed answers only): the miss counts as right for the score and the SRS, its
  // re-ask is dropped, and the quiz log counts the override.
  var overrule = function () {
    playSfx('correct');
    setResults(results.map(function (r, i) { return i === cur ? true : r; }));
    setExs(exs.filter(function (e) { return e.requeueOf !== cur; }).map(function (e, i) {
      return i === cur ? Object.assign({}, e, { overridden: true }) : e;
    }));
  };
  keyRef.current = function (e) {
    if (trapTab(e)) return;
    if (e.key === 'Escape') { if (leaving) setLeaving(false); else setLeaving(true); return; }
    if (leaving) return;
    var tag = e.target && e.target.tagName;
    if (e.key === 'Enter') {
      // A clicked option keeps focus: Enter then checks the picked answer (a not-yet-picked focused option keeps its native Enter = pick).
      var onOpt = tag === 'BUTTON' && e.target.classList.contains('qz-opt') && (revealed || ready);
      if ((tag === 'BUTTON' && !onOpt) || (tag === 'INPUT' && !revealed) || (e.nativeEvent || e).isComposing) return;
      e.preventDefault();
      return revealed ? next() : check();
    }
    if (tag === 'INPUT' || tag === 'SELECT') return;
    if (e.key === ' ' && (ex.type === 'listen_dialog' || ex.type === 'listen')) { e.preventDefault(); if (!e.repeat) { if (ex.type === 'listen') speak(ex.audio); else play(ex.script); } return; }
    var n =/^[1-9]$/.test(e.key) ? Number(e.key) - 1 : -1;
    if (isOpt && !revealed && n >= 0 && n < ex.options.length) setPick(n); // picking never cuts a playing listening track
  };

  // Choices, furigana and the listen button render in quiz-shell.js (qzKit), shared with the mock.
  var playsLeft = ex.maxPlays ? ex.maxPlays - plays : Infinity;
  var play = function (lines) {
    if (playsLeft <= 0) return;
    setPlays(plays + 1);
    stopAudio();
    setSpeaking(true);
    stopRef.current = speakScript(lines, { onEnd: function () { setSpeaking(false); } });
  };
  var kit = qzKit(h, ex, {
    lv: lv, pick: pick, revealed: revealed, selected: selected, tone: tone, onPick: setPick,
    plays: plays, speaking: speaking, play: play, voiceStatus: voiceStatus, showEarly: showEarly, onEarly: function () { setShowEarly(true); } });
  var promptEl = kit.promptEl, questionEl = kit.questionEl;
  var main, wide = false, extra = null;

  if (isListen || isOpt) {
    var c = kit.choice();
    main = c.main;
    wide = c.wide;
  } else if (isReorder) {
    // Reorder: tap tiles to build the sentence, tap a placed tile to remove it
    main = [ex.scene && h("p", { key: "recap", className: "qz-recap" }, ex.scene, " ",
        h("button", { className: "link-btn", onClick: function () {
          leaveQuiz();
          setTimeout(function () { var el = document.getElementById('dlg-hero'); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 80);
        } }, "Replay dialog")),
      promptEl, questionEl(),
      h("div", { key: "built", className: "qz-answerline" + tone, lang: "ja" }, picks.map(function (itemIdx, pos) {
        return h("button", {
          key: pos, className: "qz-tile", disabled: revealed,
          onClick: function () { setPicks(picks.filter(function (_, p) { return p !== pos; })); }
        }, ex.items[itemIdx]);
      })),
      h("div", { key: "bank", className: "qz-bank", lang: "ja" }, ex.items.map(function (item, i) {
        return h("button", {
          key: i, className: "qz-tile" + (picks.indexOf(i) >= 0 ? " used" : ""), disabled: revealed || picks.indexOf(i) >= 0,
          onClick: function () { setPicks(picks.concat([i])); }
        }, item);
      }))];
    extra = h("button", { className: "qz-gb", disabled: !picks.length, onClick: function () { setPicks([]); } }, icon('undo'), "Reset");
  } else if (isPair) {
    // Pair match: tap a word, then its meaning; a linked pair shares a number. Tap a linked word to undo.
    var owner = {};
    picks.forEach(function (o, i) { if (typeof o === 'number') owner[o] = i; });
    var meaningOf = {};
    ex.pairs.forEach(function (p) { meaningOf[p[0]] = p[1]; });
    main = [promptEl,
      h("div", { key: "pair", className: "qz-pair" },
        h("div", null, ex.items.map(function (w, i) {
          var linked = typeof picks[i] === 'number', c = 'qz-pc l';
          if (revealed) c += ex.options[picks[i]] === meaningOf[w] ? ' ok' : ' bad'; else if (linked) c += ' linked'; else if (pairLeft === i) c += ' focus';
          return h("button", {
            key: i, className: c, disabled: revealed, 'data-n': (i % 4) + 1, lang: "ja",
            onClick: function () {
              if (linked) { var np = picks.slice(); np[i] = undefined; setPicks(np); setPairLeft(null); } else setPairLeft(i);
            }
          }, h("span", null, w), linked && h("span", { className: "pn" }, i + 1));
        })),
        h("div", null, ex.options.map(function (opt, j) {
          var o = owner[j], c = 'qz-pc r';
          if (revealed && o !== undefined) c += ex.options[j] === meaningOf[ex.items[o]] ? ' ok' : ' bad'; else if (o !== undefined) c += ' linked';
          return h("button", {
            key: j, className: c, disabled: revealed || pairLeft === null && o === undefined, 'data-n': o !== undefined ? (o % 4) + 1 : undefined,
            onClick: function () {
              if (pairLeft === null) return;
              var np = picks.slice();
              np.forEach(function (x, k) { if (x === j) np[k] = undefined; });
              np[pairLeft] = j;
              setPicks(np);
              setPairLeft(null);
            }
          }, h("span", null, opt), o !== undefined && h("span", { className: "pn" }, o + 1));
        }))),
      h("p", { key: "hint", className: "qz-hint" }, "Tap a word, then its meaning. Tap a linked word to undo.")];
  } else {
    // Typing exercise (typing, conjugation)
    main = [promptEl,
      ex.passage && h("div", { key: "pg", className: "qz-passage" }, ex.passage),
      questionEl(),
      h("input", {
        key: "in", ref: inputRef, className: "qz-input" + tone, type: "text", value: answer, 'aria-label': ex.prompt, lang: "ja",
        placeholder: ex.placeholder || 'Type your answer...', disabled: revealed, autoFocus: true,
        autoComplete: "off", autoCapitalize: "off", spellCheck: false,
        onChange: function (e) { setNotice(null); setAnswer(ex.kana ? kanaBox(ex, e.target.value) : e.target.value); },
        // Enter while an IME is composing confirms the kana, not the answer
        onKeyDown: function (e) { if (e.key === 'Enter' && !(e.nativeEvent && e.nativeEvent.isComposing)) { e.stopPropagation(); check(); } }
      }),
      ex.hint && h("p", { key: "hint", className: "qz-hint" }, ex.hint),
      notice && !revealed && h("div", { key: "other", className: "qz-warn qz-other", role: "status" }, notice)];
  }

  // The dock: Skip + Check while asking; feedback + Continue once checked
  var say = revealed ? exSpeech(ex) : '';
  var dock;
  if (!revealed) {
    dock = h("div", { className: "qz-dock" }, h("div", { className: "qz-in" },
      h("button", { className: "qz-gb", onClick: skip }, "Skip"),
      extra,
      h("span", { className: "qz-sp" }, isOpt && h("span", { className: "qz-keys" }, (ex.type === 'listen_dialog' || ex.type === 'listen') && [h("kbd", { key: "sp" }, "Space"), " play "], h("kbd", null, "1–" + ex.options.length), " choose ", h("kbd", null, "Enter"), " check")),
      h("button", { className: "qz-btn qz-check", disabled: !ready, onClick: check }, t('check_btn', lv))));
  } else {
    // a missed typed answer lists every accepted answer, so the learner sees the range
    var accepted = isType && !okNow ? acceptedAnswers(ex) : [];
    var ansText = accepted.length > 1 ? accepted.join(' · ') : exAnswer(ex);
    dock = h("div", { className: "qz-dock " + (okNow ? 'right' : 'wrong') }, h("div", { className: "qz-in" },
      h("div", { className: "qz-fb", role: "status", 'aria-live': "polite" },
        h("b", null, icon(okNow ? 'check' : 'x'), okNow ? (ex.overridden ? "Counted as right" : "Correct") : "Not quite"),
        !okNow && h("div", { className: "ans" }, accepted.length > 1 ? "Accepted answers: " : "Answer: ", h("span", { lang: QZ_JA.test(ansText) ? "ja" : "en" }, ansText)),
        ex.explain && h("p", null, ex.explain)),
      isType && !okNow && answer.trim() !== '' && h("button", { className: "qz-gb qz-override", onClick: overrule, title: "Count this answer as right (a typo or a fair synonym)" }, "I was right"),
      say && h("button", { className: "qz-gb", 'aria-label': "Hear it", onClick: function () { speak(say); } }, icon('speaker')),
      h("button", { className: "qz-btn qz-next " + (okNow ? 'ok' : 'bad'), onClick: next }, "Continue")));
  }
  return layer(topBar(cur + 1 + " / " + exs.length, ex), main, dock, wide);
}
