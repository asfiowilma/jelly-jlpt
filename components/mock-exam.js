"use strict";

// MockExam (ticket 18, Q37-Q39): one fixed mock (data/<lvl>/mocks.js) sat like the real test.
// Three parts in order, each with its own clock (mockSections: 20 / 40 / 30 min for a full N5
// mock); a finished or timed-out part can't be reopened. Inside a part: answer in any order,
// change answers, flag questions to come back to. Listening: play + one replay, options heard
// only for utterance / quick. No feedback until the end; then an estimated scaled score with the
// real pass rules (mockEstimate), a table per mondai and every missed question explained.
// The result is saved as a mock:<id>:<takenAt> doc (Store.putMock); onTaken(result) after that.
// Props: mock (catalog item), onTaken?, onClose? (shows a Back button), now? (clock, for tests).
var OFFICIAL_SAMPLES_URL = 'https://www.jlpt.jp/e/samples/sampleindex.html';

function mockPartsEl(parts) {
  return (parts || []).map(function (p, i) {
    var el = p.r ? React.createElement("ruby", { key: i }, p.t, React.createElement("rt", null, p.r)) : p.t;
    return p.u ? React.createElement("u", { key: i, className: "ex-u" }, el) : React.createElement(React.Fragment, { key: i }, el);
  });
}
function mockClock(s) { return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
function mockLabel(k) { return MONDAI[k] ? MONDAI[k].name : MOCK_LABELS[k] || k; }
// mockQuestionText(ex): the question as one line of text (results list).
function mockQuestionText(ex) {
  if (ex.type === 'listen_dialog') return ex.questionParts ? ex.questionParts.map(function (p) { return p.t; }).join('') : '(listening)';
  return ex.question || '';
}

function MockExam(props) {
  var mock = props.mock, ce = React.createElement;
  var now = props.now || Date.now;
  var _s = React.useState(function () { return mockSections(mock); }), sections = _s[0];
  var blank = function () {
    var a = {};
    sections.forEach(function (s) { a[s.key] = s.questions.map(function () { return null; }); });
    return a;
  };
  var _ph = React.useState('intro'), phase = _ph[0], setPhase = _ph[1]; // intro | part | between | results
  var _sec = React.useState(0), sec = _sec[0], setSec = _sec[1];
  var _cur = React.useState(0), cur = _cur[0], setCur = _cur[1];
  var _ans = React.useState(blank), answers = _ans[0], setAnswers = _ans[1];
  var _fl = React.useState({}), flags = _fl[0], setFlags = _fl[1]; // 'part:i' → true
  var _pl = React.useState({}), plays = _pl[0], setPlays = _pl[1]; // 'part:i' → plays used
  var _dl = React.useState(null), deadline = _dl[0], setDeadline = _dl[1];
  var _res = React.useState(null), result = _res[0], setResult = _res[1];
  var _tick = React.useState(0), setTick = _tick[1];
  var latest = React.useRef(null);
  latest.current = { sec: sec, answers: answers };
  var stopRef = React.useRef(null);
  var stopAudio = function () { if (stopRef.current) stopRef.current(); stopRef.current = null; };
  React.useEffect(function () { return stopAudio; }, [sec, cur, phase]);

  // endPart(secIdx, answers): lock the part; next part's start screen, or the results.
  var endPart = function (si, ans) {
    stopAudio();
    setDeadline(null);
    if (si + 1 < sections.length) { setSec(si + 1); setCur(0); setPhase('between'); return; }
    var r = mockResult(mock, sections, ans, now());
    Store.putMock(r);
    setResult(r);
    setPhase('results');
    playSfx('complete');
    if (props.onTaken) props.onTaken(r);
  };
  React.useEffect(function () {
    if (phase !== 'part' || !deadline) return undefined;
    var id = setInterval(function () {
      if (now() < deadline) return setTick(function (n) { return n + 1; });
      clearInterval(id);
      endPart(latest.current.sec, latest.current.answers); // time up: unanswered stay null = wrong
    }, 1000);
    return function () { clearInterval(id); };
  }, [phase, deadline]);

  var startPart = function () {
    setPhase('part');
    setCur(0);
    setDeadline(now() + sections[sec].seconds * 1000);
  };
  var history = (Store.snapshot().mocks || []).filter(function (m) { return m.mockId === mock.id; });
  var minutes = function (s) { return Math.round(s.seconds / 60); };
  var back = props.onClose && ce("button", { className: "link-btn mock-back", onClick: props.onClose }, "← Back to stages");

  // ── start screen + history ────────────────────────────────────────────────
  if (phase === 'intro') {
    return ce("div", { className: "mock" },
      back,
      ce("div", { className: "quiz-start-box mock-intro" },
        ce("div", { className: "quiz-start-title" }, mock.title),
        ce("ul", { className: "mock-parts" }, sections.map(function (s) {
          return ce("li", { key: s.key }, ce("b", { lang: "ja" }, s.name), " ", s.en, ": ", s.questions.length, " questions, ", minutes(s), " min");
        })),
        ce("p", { className: "quiz-start-hint" },
          "One part at a time, each with its own clock. Inside a part you can answer in any order, change answers and flag questions to come back to. ",
          "When a part ends (you finish it or time runs out) you can't go back to it; unanswered questions count as wrong. ",
          "Listening: each question plays once, with one replay. You get your answers and an estimated score at the end."),
        ce("button", { className: "quiz-start-btn", onClick: startPart }, "Start part 1: " + sections[0].en)),
      history.length > 0 && ce("div", { className: "mock-history" },
        ce("div", { className: "section-label" }, "Earlier attempts"),
        ce("ul", null, history.map(function (h) {
          return ce("li", { key: h.takenAt },
            ce("button", { className: "link-btn", onClick: function () { setResult(h); setAnswers(h.answers); setPhase('results'); } },
              new Date(h.takenAt).toLocaleString()), " · estimate ", h.estimate.total, " / 180 · ", h.estimate.passed ? "pass" : "not yet");
        }))));
  }

  var S = sections[sec];
  if (phase === 'between') {
    return ce("div", { className: "mock" },
      ce("div", { className: "quiz-start-box" },
        ce("div", { className: "quiz-start-title" }, "Part " + sec + " done"),
        ce("p", { className: "quiz-start-hint" }, "Next: ", ce("b", { lang: "ja" }, S.name), " ", S.en, ", ", S.questions.length,
          " questions in ", minutes(S), " minutes. Take a break if you need one; the clock starts when you press Start."),
        ce("button", { className: "quiz-start-btn", onClick: startPart }, "Start part " + (sec + 1) + ": " + S.en)));
  }

  // ── results ───────────────────────────────────────────────────────────────
  if (phase === 'results') {
    var r = result, est = r.estimate, rule = JLPT_PASS[mock.level];
    var pct = function (x) { return x[1] ? Math.round(x[0] / x[1] * 100) + '%' : '–'; };
    var row = function (label, x) { return ce("tr", { key: label }, ce("td", null, label), ce("td", null, x[0], " / ", x[1]), ce("td", null, pct(x))); };
    var missed = [];
    sections.forEach(function (s) {
      s.questions.forEach(function (ex, i) {
        var a = (r.answers[s.key] || [])[i];
        if (a !== ex.correct) missed.push({ s: s, ex: ex, i: i, a: a });
      });
    });
    var optText = function (ex, i) { return i === null || i === undefined ? '(no answer)' : (ex.spokenOptions ? (i + 1) + '. ' : '') + ex.options[i]; };
    return ce("div", { className: "mock" },
      back,
      ce("div", { className: "section-label" }, mock.title, ": results"),
      ce("div", { className: "mock-estimate " + (est.passed ? 'pass' : 'fail'), role: "status" },
        ce("div", { className: "mock-estimate-head" }, est.passed ? ce(JellyExcited, { size: 56 }) : jelly('oops', 56, true),
          ce("div", { className: "mock-estimate-total" }, "Estimated score: ", ce("b", null, est.total), " / 180 · ",
            est.passed ? "would pass" : "not a pass yet")),
        ce("ul", null,
          ce("li", null, ce("span", { lang: "ja" }, "言語知識・読解"), " (vocabulary, grammar, reading): ", est.lkr, " / 120, minimum ", rule.lkr, est.lkr < rule.lkr ? " ✗" : " ✓"),
          ce("li", null, ce("span", { lang: "ja" }, "聴解"), " (listening): ", est.listening, " / 60, minimum ", rule.listening, est.listening < rule.listening ? " ✗" : " ✓"),
          ce("li", null, "Total: ", est.total, " / 180, pass mark ", rule.total, est.total < rule.total ? " ✗" : " ✓")),
        ce("p", { className: "mock-note" }, "This is an estimate. Each part's share of right answers is scaled straight onto the official ranges: ",
          "言語知識・読解 = 120 × (21 × vocabulary + 17 × grammar + 5 × reading) ÷ 43, 聴解 = 60 × listening. ",
          "The real JLPT scores answer patterns with item response theory and adjusts for each test's difficulty, so no exact conversion exists, ",
          "and these questions come from what you studied here, so the estimate probably runs high."),
        ce("p", { className: "mock-note" }, "Listening is the least certain part: it uses your browser's computer voice, not the test recording. Practise with the ",
          ce("a", { href: OFFICIAL_SAMPLES_URL, target: "_blank", rel: "noopener noreferrer" }, "official sample audio (jlpt.jp)"), " too.")),
      ce("table", { className: "mock-table" },
        ce("thead", null, ce("tr", null, ce("th", null, "Part"), ce("th", null, "Right"), ce("th", null, "%"))),
        ce("tbody", null, row("Vocabulary", r.parts.vocab), row("Grammar", r.parts.grammar), row("Reading", r.parts.reading), row("Listening", r.parts.listening))),
      ce("table", { className: "mock-table" },
        ce("thead", null, ce("tr", null, ce("th", null, "もんだい"), ce("th", null, "Right"), ce("th", null, "%"))),
        ce("tbody", null, Object.keys(r.byMondai).map(function (k) { return row(mockLabel(k), r.byMondai[k]); }))),
      ce("div", { className: "section-label" }, missed.length ? "Missed questions (" + missed.length + ")" : "No questions missed"),
      ce("ol", { className: "mock-missed" }, missed.map(function (m) {
        return ce("li", { key: m.s.key + m.i },
          ce("div", { className: "mock-missed-q", lang: "ja" }, ce("span", { className: "ex-count" }, m.s.en, " ", m.i + 1, " · ", mockLabel(m.ex.mondai)), " ", mockQuestionText(m.ex)),
          ce("div", null, "Your answer: ", ce("span", { lang: "ja" }, optText(m.ex, m.a)), " · Right answer: ", ce("b", { lang: "ja" }, optText(m.ex, m.ex.correct))),
          m.ex.type === 'listen_dialog' && m.ex.en && ce("div", { className: "ex-note" }, m.ex.en),
          m.ex.explain && ce("div", { className: "ex-note" }, m.ex.explain));
      })));
  }

  // ── a part in progress ────────────────────────────────────────────────────
  var ex = S.questions[cur], key = S.key + ':' + cur, chosen = answers[S.key][cur];
  var left = deadline ? Math.max(0, Math.ceil((deadline - now()) / 1000)) : 0;
  var choose = function (i) {
    var a = Object.assign({}, answers);
    a[S.key] = a[S.key].slice();
    a[S.key][cur] = i;
    setAnswers(a);
  };
  var go = function (i) { stopAudio(); setCur(i); };
  var usedPlays = plays[key] || 0, playsLeft = ex.maxPlays ? ex.maxPlays - usedPlays : Infinity;
  var play = function (lines) {
    if (playsLeft <= 0) return;
    var p = Object.assign({}, plays);
    p[key] = usedPlays + 1;
    setPlays(p);
    stopAudio();
    stopRef.current = speakScript(lines);
  };
  var unanswered = answers[S.key].filter(function (a) { return a === null; }).length;
  return ce("div", { className: "mock" },
    ce("div", { className: "mock-bar" },
      ce("span", { className: "section-label" }, ce("span", { lang: "ja" }, S.name), " ", S.en, ce("span", { className: "ex-count" }, cur + 1, " / ", S.questions.length)),
      ce("span", { className: "ex-timer" + (left < 60 ? " low" : ""), role: "timer", 'aria-label': "Time left in this part" }, "⏱ ", mockClock(left))),
    ce("div", { className: "mock-nav", role: "navigation", 'aria-label': "Questions in this part" }, S.questions.map(function (_, i) {
      var st = (answers[S.key][i] !== null ? " answered" : "") + (flags[S.key + ':' + i] ? " flagged" : "") + (i === cur ? " now" : "");
      return ce("button", { key: i, className: "mock-nav-btn" + st, 'aria-current': i === cur ? 'true' : undefined, onClick: function () { go(i); } }, i + 1);
    })),
    ce("div", { className: "exercise-box" },
      ce("div", { className: "ex-prompt" }, ce("span", { className: "ex-count" }, mockLabel(ex.mondai)), " ", ex.prompt),
      ex.type === 'reading' && ce("div", { className: "passage-box", lang: "ja" }, mockPartsEl(ex.passage)),
      ex.passageParts && ce("div", { className: "passage-box", lang: "ja" }, mockPartsEl(ex.passageParts)),
      ex.type === 'listen_dialog' ? ce("div", { className: "ex-question" },
        ce("button", { className: "ex-listen-btn", disabled: playsLeft <= 0, onClick: function () { play(ex.script); } }, usedPlays ? "🔊 Play again" : "🔊 Play"),
        ce("div", { className: "ex-hint" }, playsLeft > 0 ? playsLeft + (playsLeft === 1 ? " play" : " plays") + " left" : "No replays left"),
        !ex.spokenOptions && ex.questionParts && ce("div", { className: "ex-question sentence", lang: "ja" }, mockPartsEl(ex.questionParts)))
        : !ex.passageParts && ce("div", { className: "ex-question sentence", lang: "ja" }, ex.parts ? mockPartsEl(ex.parts) : ex.question),
      ce("div", { className: "ex-options" }, ex.options.map(function (o, i) {
        return ce("button", { key: i, className: "ex-option mock-option" + (chosen === i ? " selected" : ""), lang: "ja", 'aria-pressed': chosen === i,
          onClick: function () { choose(i); } },
          ce("span", { className: "mock-opt-n" }, i + 1), " ", ex.spokenOptions ? "" : ex.optionParts ? mockPartsEl(ex.optionParts[i]) : o);
      })),
      ce("div", { className: "ex-typing-row mock-actions" },
        ce("button", { className: "ex-check-btn", disabled: cur === 0, onClick: function () { go(cur - 1); } }, "← Previous"),
        ce("button", { className: "ex-check-btn mock-flag" + (flags[key] ? " on" : ""), 'aria-pressed': !!flags[key],
          onClick: function () { var f = Object.assign({}, flags); f[key] = !f[key]; setFlags(f); } }, flags[key] ? "⚑ Flagged" : "⚐ Flag"),
        cur + 1 < S.questions.length && ce("button", { className: "ex-check-btn", onClick: function () { go(cur + 1); } }, "Next →"))),
    ce("div", { className: "mock-submit" },
      ce("span", { className: "ex-hint" }, unanswered ? unanswered + " unanswered" : "All answered",
        Object.keys(flags).filter(function (k) { return flags[k] && k.indexOf(S.key + ':') === 0; }).length ? " · flagged questions are marked in the list above" : ""),
      ce("button", { className: "quiz-start-btn mock-end", onClick: function () { endPart(sec, answers); } },
        sec + 1 < sections.length ? "Finish this part" : "Finish the test")));
}
