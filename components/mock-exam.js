"use strict";

// MockExam (ticket 18, Q37-Q39): one fixed mock (data/<lvl>/mocks.js) sat like the real test.
// Three parts in order, each with its own clock (mockSections: 20 / 40 / 30 min for a full N5
// mock); a finished or timed-out part can't be reopened. Inside a part: answer in any order,
// change answers, flag questions to come back to. Listening: play + one replay, options heard
// only for utterance / quick. No feedback until the end; then an estimated scaled score with the
// real pass rules (mockEstimate) as a score slip (jelly ring, one section table), a heat grid of the
// 14 question types, and every missed question as a collapsible row. Furigana follows the pref.
// The result is saved as a mock:<id>:<takenAt> doc (Store.putMock); onTaken(result) after that.
// Parts and the between-parts screen take over the screen like the unit quiz (.ql layer, quiz-shell.js):
// top bar, one question, a dock with Prev / Flag / Next (Finish on the last question), and a bottom
// sheet (the "7 / 25 · 3 flagged" button) that lists the questions, answered / flagged / current, tap
// to jump, with an early "Finish part". ✕ asks "Quit the test?" and discards the attempt (nothing saved).
// The start screen and the results stay in the page.
// A running attempt is kept in localStorage (mockRun*, device-only) so a reload can Resume or Discard it;
// quitting or finishing clears it.
// Props: mock (catalog item), onTaken?, onClose? (shows a Back button), now? (clock, for tests),
// showFurigana? (part names), guided? (inside a unit whose exam guide already explains the rules).
var OFFICIAL_SAMPLES_URL = 'https://www.jlpt.jp/e/samples/sampleindex.html';

// Question type (mondai) → [name with furigana markup, English helper], in test order (results grid).
var MONDAI_ORDER = ['kanjiYomi', 'hyouki', 'bunmyaku', 'iikae', 'gap', 'order', 'bunshou', 'short', 'mid', 'info', 'task', 'point', 'utterance', 'quick'];
var MONDAI_NAMES = {
  kanjiYomi: ['[漢字|かんじ][読|よ]み', 'Kanji reading'], hyouki: ['[表記|ひょうき]', 'Writing the word'],
  bunmyaku: ['[文脈規定|ぶんみゃくきてい]', 'Word in context'], iikae: ['[言|い]い[換|か]え[類義|るいぎ]', 'Same meaning'],
  gap: ['[文|ぶん]の[文法|ぶんぽう]1', 'Grammar: fill the blank'], order: ['[文|ぶん]の[文法|ぶんぽう]2', 'Grammar: order ★'],
  bunshou: ['[文章|ぶんしょう]の[文法|ぶんぽう]', 'Grammar in a text'],
  short: ['[内容理解|ないようりかい]（[短文|たんぶん]）', 'Short passages'], mid: ['[内容理解|ないようりかい]（[中文|ちゅうぶん]）', 'Medium passages'],
  info: ['[情報検索|じょうほうけんさく]', 'Find the info'], task: ['[課題理解|かだいりかい]', 'Task listening'],
  point: ['ポイント[理解|りかい]', 'Key-point listening'], utterance: ['[発話表現|はつわひょうげん]', 'What do you say?'],
  quick: ['[即時応答|そくじおうとう]', 'Quick replies']
};
// mockPartsEl(parts, furi?): furigana parts → text / <ruby>; furi === false drops the readings.
function mockPartsEl(parts, furi) {
  return (parts || []).map(function (p, i) {
    var el = p.r && furi !== false ? React.createElement("ruby", { key: i }, p.t, React.createElement("rt", null, p.r)) : p.t;
    return p.u ? React.createElement("u", { key: i, className: "ex-u" }, el) : React.createElement(React.Fragment, { key: i }, el);
  });
}
// "Oct 5, 5:33 PM"
function mockWhen(ts) {
  var d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
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
  useQuizBusy(phase === 'part' || phase === 'between');
  var _sec = React.useState(0), sec = _sec[0], setSec = _sec[1];
  var _cur = React.useState(0), cur = _cur[0], setCur = _cur[1];
  var _ans = React.useState(blank), answers = _ans[0], setAnswers = _ans[1];
  var _fl = React.useState({}), flags = _fl[0], setFlags = _fl[1]; // 'part:i' → true
  var _pl = React.useState({}), plays = _pl[0], setPlays = _pl[1]; // 'part:i' → plays used
  var _dl = React.useState(null), deadline = _dl[0], setDeadline = _dl[1];
  var _res = React.useState(null), result = _res[0], setResult = _res[1];
  var _tick = React.useState(0), setTick = _tick[1];
  var _sh = React.useState(false), sheet = _sh[0], setSheet = _sh[1]; // question list open
  var _qt = React.useState(false), quitting = _qt[0], setQuitting = _qt[1]; // "Quit the test?" open
  var _sp = React.useState(false), speaking = _sp[0], setSpeaking = _sp[1];
  var _sv = React.useState(function () { return mockRunLoad(mock.id); }), saved = _sv[0], setSaved = _sv[1]; // a left attempt
  var resultRef = React.useRef(null);
  var _fa = React.useState(false), finishAsk = _fa[0], setFinishAsk = _fa[1]; // "Finish with blanks?" open
  var _nt = React.useState(null), done = _nt[0], setDone = _nt[1]; // the part just ended: { part, answered, blank, flagged, timeUp }
  var _fb = React.useState(false), fallback = _fb[0], setFallback = _fb[1]; // browser voice read a script instead of the clips
  var shell = useQuizLayer(phase === 'part' || phase === 'between', quitting);
  var latest = React.useRef(null);
  latest.current = { sec: sec, answers: answers, flags: flags };
  var stopRef = React.useRef(null);
  var stopAudio = function () { if (stopRef.current) stopRef.current(); stopRef.current = null; setSpeaking(false); };
  React.useEffect(function () { return stopAudio; }, [sec, cur, phase]);
  // keep the running attempt on this device; warn before a reload / tab close while a part runs
  React.useEffect(function () {
    if (phase === 'part' || phase === 'between') mockRunSave({ mockId: mock.id, phase: phase, sec: sec, cur: cur, deadline: deadline, answers: answers, flags: flags, plays: plays, done: done, at: now() });
  }, [phase, sec, cur, deadline, answers, flags, plays, done]);
  React.useEffect(function () {
    if (phase !== 'part' || typeof window === 'undefined' || !window.addEventListener) return undefined;
    var warn = function (e) { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return function () { window.removeEventListener('beforeunload', warn); };
  }, [phase]);
  // arriving on the result: bring the card into view (the unit page is long)
  React.useEffect(function () {
    var el = phase === 'results' && resultRef.current;
    if (el && el.scrollIntoView) { el.scrollIntoView({ block: 'start' }); if (el.focus) el.focus({ preventScroll: true }); }
  }, [phase]);

  // endPart(secIdx, answers): lock the part; next part's start screen, or the results.
  var endPart = function (si, ans, timeUp, fl) {
    var qs = sections[si].questions, blankN = ans[sections[si].key].filter(function (a) { return a === null; }).length;
    fl = fl || latest.current.flags || {};
    setDone({ part: si + 1, total: qs.length, blank: blankN, flagged: qs.filter(function (_, i) { return fl[sections[si].key + ':' + i]; }).length, timeUp: !!timeUp });
    setFinishAsk(false);
    stopAudio();
    setDeadline(null);
    setSheet(false);
    setQuitting(false);
    if (si + 1 >= sections.length) mockRunClear();
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
      endPart(latest.current.sec, latest.current.answers, true); // time up: unanswered stay null = wrong
    }, 1000);
    return function () { clearInterval(id); };
  }, [phase, deadline]);

  var startPart = function () {
    playSfx('next');
    setPhase('part');
    setCur(0);
    setDeadline(now() + sections[sec].seconds * 1000);
  };
  // Quit: the attempt is dropped (no Store.putMock), the clock stops, back to the start screen.
  var quit = function () {
    stopAudio();
    mockRunClear();
    setDeadline(null); setSheet(false); setQuitting(false); setDone(null);
    setSec(0); setCur(0); setAnswers(blank()); setFlags({}); setPlays({});
    setPhase('intro');
  };
  // Resume a left attempt (a part whose clock ran out meanwhile ends as time-up), or discard it.
  var resume = function () {
    var s = saved;
    setSaved(null);
    setDone(s.done || null); setAnswers(s.answers); setFlags(s.flags || {}); setPlays(s.plays || {}); setSec(s.sec); setCur(s.cur || 0);
    if (s.phase === 'between') return setPhase('between');
    if (now() >= s.deadline) return endPart(s.sec, s.answers, true, s.flags);
    setDeadline(s.deadline);
    setPhase('part');
  };
  var discard = function () { mockRunClear(); setSaved(null); };
  // Take again: a fresh attempt straight into part 1 (later sittings of a mock are practice, ticket 49)
  var takeAgain = function () {
    mockRunClear();
    setDone(null);
    setSaved(null); setResult(null); setSec(0); setCur(0); setAnswers(blank()); setFlags({}); setPlays({});
    setPhase('part');
    setDeadline(now() + sections[0].seconds * 1000);
  };
  var allMocks = Store.snapshot().mocks || [];
  var history = allMocks.filter(function (m) { return m.mockId === mock.id; });
  var attemptN = {}; // takenAt → attempt number of this mock (ticket 49: later ones are practice)
  mockAttempts(history).forEach(function (a) { attemptN[a.doc.takenAt] = a.n; });
  var minutes = function (s) { return Math.round(s.seconds / 60); };
  // mockSteps rows for the start + between screens; the "How the exam works" details only outside a guided unit
  var stepsEl = function (ph) {
    var m = mockSteps(sections, ph, sec);
    return ce(React.Fragment, null,
      ce("div", { className: "ms" },
        ce("div", { className: "section-label" }, m.label),
        m.steps.map(function (st) {
          var s = sections[st.n - 1];
          return ce("div", { key: st.key, className: "ms-row " + st.state },
            ce("span", { className: "ms-n" }, st.state === 'done' ? "✓" : st.n),
            ce("span", { className: "ms-name" },
              ce("span", { className: "jp", lang: "ja" }, pgText(s.nameF, props.showFurigana)), ce("span", { className: "ms-en" }, s.en), ce("br"),
              ce("span", { className: "ms-meta" }, s.questions.length, " questions · ", minutes(s), " min")),
            st.state === 'live' ? ce("button", { className: "quiz-start-btn ms-btn", onClick: startPart }, st.side) : ce("span", { className: "ms-side" }, st.side));
        }),
        ce("p", { className: "ms-note" }, ce("b", null, "Timing"), m.note)),
      !props.guided && ph === 'intro' && ce("details", { className: "ms-how" },
        ce("summary", null, "How the exam works"),
        ce("p", null, "You take the parts one at a time. Each part has its own clock. Inside a part you can answer in any order and change answers. Flag questions to come back to them."),
        ce("p", null, "When a part ends, you can't go back to it. Unanswered questions count as wrong."),
        ce("p", null, "Listening plays each question once, with one replay. Each spoken reply can be played once."),
        ce("p", null, "At the end you get your answers and an estimated score.")));
  };
  var back = props.onClose && ce("button", { className: "link-btn mock-back", onClick: props.onClose }, "← Back to stages");

  // ── start screen + history ────────────────────────────────────────────────
  if (phase === 'intro') {
    return ce("div", { className: "mock" },
      back,
      saved && ce("div", { className: "mock-resume", role: "status" },
        ce("p", null, ce("b", null, "You have a test in progress."), " ",
          saved.phase === 'part' && saved.deadline ? "Part " + (saved.sec + 1) + ": " + (now() < saved.deadline ? mockClock(Math.ceil((saved.deadline - now()) / 1000)) + " left." : "its time ran out while you were away.")
            : "Part " + (saved.sec + 1) + " is next."),
        ce("div", { className: "qz-row" },
          ce("button", { className: "quiz-start-btn ms-btn", onClick: resume }, "Resume"),
          ce("button", { className: "link-btn", onClick: discard }, "Discard"))),
      stepsEl('intro'),
      history.length > 0 && ce("div", { className: "mock-history" },
        ce("div", { className: "section-label" }, "Earlier attempts"),
        ce("ul", null, history.map(function (h) {
          return ce("li", { key: h.takenAt },
            ce("span", { className: "ms-res" }, attemptN[h.takenAt] > 1 ? "Practice " + attemptN[h.takenAt] : "First attempt"),
            ce("button", { className: "link-btn", onClick: function () { setResult(h); setAnswers(h.answers); setPhase('results'); } },
              mockWhen(h.takenAt)), ce("span", { className: "ms-res" }, "estimate ", ce("b", null, h.estimate.total), " / 180 · ", h.estimate.passed ? "pass" : "not yet"));
        }))));
  }

  var S = sections[sec];
  // one line on the part just ended; time-up says so
  var partNote = function () {
    if (!done) return null;
    var answered = done.total - done.blank;
    return ce("div", { key: "done", className: "mock-done" + (done.timeUp ? " timeup" : ""), role: "status" },
      done.timeUp && ce("b", null, "Time ran out. "),
      "Part " + done.part + ": " + answered + " answered, " + done.blank + " blank" + (done.timeUp && done.blank ? " (counts as wrong)" : "") + ", " + done.flagged + " flagged.");
  };
  var finishDialog = finishAsk && qzLeaveDialog(ce, {
    label: "Finish with blanks", title: "Finish with blank answers?", text: "Blank answers count as wrong, and you can't come back to this part.",
    stay: "Keep answering", leave: "Finish", onStay: function () { setFinishAsk(false); }, onLeave: function () { endPart(sec, answers); } });
  var quitDialog = quitting && qzLeaveDialog(ce, {
    label: "Quit the test", title: "Quit the test?", text: "Nothing is saved. You will start again from the beginning.",
    stay: "Keep going", leave: "Quit", onStay: function () { setQuitting(false); }, onLeave: quit });
  if (phase === 'between') {
    shell.keyRef.current = function (e) { if (shell.trapTab(e)) return; if (e.key === 'Escape') setQuitting(!quitting); };
    return qzLayer(ce, shell, { label: mock.title, overlay: quitDialog,
      top: qzTop(ce, { xLabel: "Quit the test", onX: function () { setQuitting(true); }, progLabel: "Parts done", now: sec,
        segs: sections.map(function (_, i) { return i < sec ? 'ans' : i === sec ? 'now' : ''; }), meta: [] }),
      main: [partNote(), stepsEl('between')] });
  }

  // ── results ───────────────────────────────────────────────────────────────
  if (phase === 'results') {
    var practice = mockIsPractice(allMocks, result);
    var r = result, est = r.estimate, rule = JLPT_PASS[mock.level], out = mockOutlook(r.parts, mock.level), ringLen = 2 * Math.PI * 46;
    var tone = { likely: 'pass', borderline: 'warn', unlikely: 'fail' }[out.verdict];
    var vcls = { likely: 'ok', borderline: 'warn', unlikely: 'bad' }[out.verdict];
    var furi = furiganaOn(Store.snapshot().furiganaPref, mock.level);
    var jp = function (markup) { return mockPartsEl(furiganaParts(markup), furi); };
    var range = function (x) { return x[0] + '–' + x[1]; };
    var pctN = function (x) { return x[1] ? Math.round(x[0] / x[1] * 100) : 0; };
    var heat = function (p) { return p < 70 ? 'bad' : p < 90 ? 'warn' : 'ok'; };
    var mark = function (okay) { return ce("span", { className: okay ? 'ok' : 'bad', 'aria-label': okay ? 'met' : 'not met' }, okay ? " ✓" : " ✗"); };
    var subRow = function (label, x) {
      var p = pctN(x);
      return ce("tr", { key: label, className: "mr-sub" },
        ce("th", { scope: "row" }, label),
        ce("td", { className: "mr-bar-cell" }, ce("span", { className: "mr-bar", 'aria-hidden': "true" }, ce("i", { className: "t-" + heat(p), style: { width: p + '%' } }))),
        ce("td", { className: "mr-n" }, x[0], "/", x[1]),
        ce("td", { className: "mr-n mr-hide-s" }, x[1] ? p + '%' : '–'));
    };
    var missed = [];
    sections.forEach(function (s) {
      s.questions.forEach(function (ex, i) {
        var a = (r.answers[s.key] || [])[i];
        if (a !== ex.correct) missed.push({ s: s, ex: ex, i: i, a: a });
      });
    });
    var optText = function (ex, i) {
      if (i === null || i === undefined) return '(no answer)';
      var n = ex.spokenOptions ? (i + 1) + '. ' : '';
      return ex.optionParts ? [n, mockPartsEl(ex.optionParts[i], furi)] : n + ex.options[i];
    };
    var qEl = function (ex) {
      var ps = ex.parts || ex.questionParts;
      return ps ? mockPartsEl(ps, furi) : mockQuestionText(ex);
    };
    var types = MONDAI_ORDER.filter(function (k) { return r.byMondai[k]; });
    return ce("div", { className: "mock mock-results", ref: resultRef, tabIndex: -1 },
      back,
      ce("div", { className: "section-label" }, mock.title, ": results"),
      done && done.timeUp && partNote(),
      ce("div", { className: "mr-card " + tone },
        ce("div", { className: "mr-head", role: "status" },
          ce("div", { className: "mr-ring" },
            ce("svg", { viewBox: "0 0 104 104", 'aria-hidden': "true" },
              ce("circle", { cx: 52, cy: 52, r: 46, fill: "none", stroke: "var(--surface2)", strokeWidth: 7 }),
              ce("circle", { cx: 52, cy: 52, r: 46, fill: "none", stroke: "var(--" + vcls + ")", strokeWidth: 7, strokeLinecap: "round",
                strokeDasharray: (ringLen * est.total / 180) + " " + ringLen, transform: "rotate(-90 52 52)" })),
            ce("div", { className: "mr-jelly" }, out.verdict === 'likely' ? ce(JellyExcited, { size: 64 }) : jelly('oops', 64, true))),
          ce("div", { className: "mr-verdict" },
            practice && ce("span", { className: "mock-practice" }, "Practice attempt"),
            ce("h2", { className: vcls }, out.verdict === 'likely' ? "Likely pass" : out.verdict === 'borderline' ? "Borderline" : "Unlikely to pass yet"),
            ce("div", null, ce("span", { className: "mr-total" }, est.total), " ", ce("span", { className: "mr-muted" }, "/ 180")),
            ce("p", { className: "mr-small mr-muted" }, "Likely range " + range(out.total) + ". ",
              out.verdict === 'likely' ? "Even the low end clears the pass mark and both section minimums."
                : out.verdict === 'borderline' ? "The range crosses a pass mark. A longer test or another attempt would tell you more."
                : "Even the high end misses the total or a section minimum."))),
        practice && ce("p", { className: "mr-small mr-muted" }, "You have sat this mock before, so the questions are known. This attempt is practice and does not change your headline estimate", (function () { var f = mockHeadline(allMocks, mock.id); return f ? " (first attempt: " + f.estimate.total + " / 180)." : "."; })()),
        ce("table", { className: "mr-slip" },
          ce("caption", { className: "mr-sr" }, "Estimated scores by section"),
          ce("tbody", null,
            ce("tr", { className: "mr-sec" },
              ce("th", { scope: "row", colSpan: 2, lang: "ja" }, jp("[言語知識|げんごちしき]・[読解|どっかい]"), ce("span", { className: "mr-en" }, "Vocabulary, grammar, reading")),
              ce("td", { className: "mr-n" }, ce("b", null, est.lkr, " / 120")),
              ce("td", { className: "mr-n mr-small mr-muted mr-hide-s" }, range(out.lkr) + " · min " + rule.lkr, mark(est.lkr >= rule.lkr))),
            subRow("Vocabulary", r.parts.vocab), subRow("Grammar", r.parts.grammar), subRow("Reading", r.parts.reading),
            ce("tr", { className: "mr-sec" },
              ce("th", { scope: "row", colSpan: 2, lang: "ja" }, jp("[聴解|ちょうかい]"), ce("span", { className: "mr-en" }, "Listening")),
              ce("td", { className: "mr-n" }, ce("b", null, est.listening, " / 60")),
              ce("td", { className: "mr-n mr-small mr-muted mr-hide-s" }, range(out.listening) + " · min " + rule.listening, mark(est.listening >= rule.listening))),
            subRow("Listening", r.parts.listening),
            ce("tr", { className: "mr-tot" },
              ce("th", { scope: "row", colSpan: 2 }, "Total · pass mark " + rule.total, mark(est.total >= rule.total)),
              ce("td", { className: "mr-n" }, est.total),
              ce("td", { className: "mr-n mr-small mr-muted mr-hide-s" }, range(out.total))))),
        ce("div", { className: "mr-actions" },
          ce("button", { className: "quiz-start-btn mr-again", onClick: takeAgain }, "Take again"),
          ce("span", { className: "mr-small mr-muted" }, "80% range estimate; the real test adjusts per sitting."))),
      ce("div", { className: "section-label mr-gap" }, "All " + types.length + " question types"),
      ce("div", { className: "mr-grid" }, types.map(function (k) {
        var x = r.byMondai[k], p = pctN(x), nm = MONDAI_NAMES[k] || [mockLabel(k), k];
        return ce("div", { key: k, className: "mr-tile t-" + heat(p) },
          ce("b", { lang: "ja" }, jp(nm[0])), ce("span", { className: "mr-en" }, nm[1]),
          ce("span", { className: "mr-sc" }, x[0] + " / " + x[1] + " · " + p + "%", x[1] === 1 && ce("span", { className: "mr-muted" }, " (1 question)")));
      })),
      ce("div", { className: "mr-legend" },
        ce("span", null, ce("i", { className: "t-bad" }), "under 70%"), ce("span", null, ce("i", { className: "t-warn" }), "70–89%"), ce("span", null, ce("i", { className: "t-ok" }), "90%+")),
      ce("div", { className: "section-label mr-gap" }, missed.length ? "Missed questions (" + missed.length + ")" : "No questions missed"),
      missed.map(function (m, n) {
        var nm = MONDAI_NAMES[m.ex.mondai];
        return ce("details", { key: m.s.key + m.i, className: "mr-q", open: n === 0 ? true : undefined },
          ce("summary", null,
            ce("span", { className: "mr-tag" }, m.s.en + " " + (m.i + 1)),
            ce("span", { className: "mr-tag", lang: "ja" }, nm ? mockPartsEl(furiganaParts(nm[0]), false) : mockLabel(m.ex.mondai)),
            ce("span", { className: "mr-sq", lang: "ja" }, qEl(m.ex))),
          ce("div", { className: "mr-qbody" },
            ce("p", { className: "mr-qtext", lang: "ja" }, qEl(m.ex)),
            ce("div", { className: "mr-ans", lang: "ja" },
              ce("div", { className: "you" }, ce("small", null, "You"), optText(m.ex, m.a)),
              ce("div", { className: "right" }, ce("small", null, "Answer"), optText(m.ex, m.ex.correct))),
            m.ex.type === 'listen_dialog' && m.ex.en && ce("p", { className: "mr-why" }, m.ex.en),
            m.ex.explain && ce("p", { className: "mr-why", lang: "ja" }, m.ex.explain)));
      }),
      ce("details", { className: "mr-how" },
        ce("summary", null, "How this estimate works"),
        ce("p", { className: "mock-note" }, "This is an estimate. The range is an 80% range from how many questions you answered (fewer questions, wider range). Each part's share of right answers is scaled straight onto the official ranges: ",
          "言語知識・読解 = 120 × (21 × vocabulary + 17 × grammar + 5 × reading) ÷ 43, 聴解 = 60 × listening. ",
          "The real JLPT scores answer patterns with item response theory and adjusts for each test's difficulty, so no exact conversion exists, ",
          "and these questions come from what you studied here, so the estimate probably runs high."),
        ce("p", { className: "mock-note" }, "Listening is the least certain part: it uses your browser's computer voice, not the test recording. Practise with the ",
          ce("a", { href: OFFICIAL_SAMPLES_URL, target: "_blank", rel: "noopener noreferrer" }, "official sample audio (jlpt.jp)"), " too.")));
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
  var go = function (i) { stopAudio(); playSfx('next'); setCur(i); setSheet(false); };
  var usedPlays = plays[key] || 0, playsLeft = ex.maxPlays ? ex.maxPlays - usedPlays : Infinity;
  // r = reply index of a spoken option: each reply has its own single listen (main Play keeps maxPlays)
  var replyUsed = function (r) { return plays[key + ':r' + r] || 0; };
  var play = function (lines, r) {
    var k = r == null ? key : key + ':r' + r;
    if (r == null ? playsLeft <= 0 : replyUsed(r) >= 1) return;
    var p = Object.assign({}, plays);
    p[k] = (plays[k] || 0) + 1;
    setPlays(p);
    stopAudio();
    setSpeaking(true);
    // natural speed like the real test; a fallback to the browser voice shows a notice (audit P1-5)
    stopRef.current = speakScript(lines, { rate: 1, onEnd: function () { setSpeaking(false); }, onFallback: function () { setFallback(true); } });
  };
  var last = cur + 1 >= S.questions.length, lastPart = sec + 1 >= sections.length;
  var isFlagged = function (i) { return !!flags[S.key + ':' + i]; };
  var nFlag = S.questions.filter(function (_, i) { return isFlagged(i); }).length;
  var nAns = answers[S.key].filter(function (a) { return a !== null; }).length;
  var blankN = S.questions.length - nAns, finLabel = (lastPart ? "Finish the test" : "Finish part") + (blankN ? " (" + blankN + " unanswered)" : "");
  var finish = function () { if (blankN) { setSheet(false); setFinishAsk(true); } else endPart(sec, answers); };
  shell.keyRef.current = function (e) {
    if (shell.trapTab(e)) return;
    if (e.key === 'Escape') { if (sheet) setSheet(false); else setQuitting(!quitting); return; }
    if (quitting || sheet || finishAsk) return;
    var n = /^[1-9]$/.test(e.key) ? Number(e.key) - 1 : -1;
    if (n >= 0 && n < ex.options.length) choose(n);
    else if (e.key === 'ArrowLeft' && cur > 0) go(cur - 1);
    else if (e.key === 'ArrowRight' && !last) go(cur + 1);
    else if (e.key === 'Enter' && !last && !e.isComposing && !(e.target && e.target.tagName === 'BUTTON' && !e.target.classList.contains('qz-opt'))) { e.preventDefault(); go(cur + 1); } // never finishes the part
  };
  // No feedback in a mock: an option is only picked (revealed stays false), nothing is checked.
  var kit = qzKit(ce, ex, { lv: mock.level, pick: chosen, revealed: false, selected: null, tone: '', onPick: choose,
    plays: usedPlays, replyUsed: replyUsed, speaking: speaking, play: play, voiceStatus: fallback ? 'fallback' : 'ok', replyHint: "The reply texts show in your results.", showEarly: false, onEarly: function () {} });
  var c = kit.choice();
  var sheetEl = sheet && ce("div", { className: "qz-scrim qz-sheet-wrap", onClick: function (e) { if (e.target === e.currentTarget) setSheet(false); } },
    ce("div", { className: "qz-sheet", role: "dialog", 'aria-label': "Questions in this part" },
      ce("div", { className: "qz-sheet-h" },
        ce("b", null, S.en, ": ", nAns, " / ", S.questions.length, " answered", nFlag ? " · " + nFlag + " flagged" : ""),
        ce("button", { className: "qz-gb qz-sheet-x", 'aria-label': "Close the list", onClick: function () { setSheet(false); } }, icon('x'))),
      ce("div", { className: "qz-sheet-grid" }, S.questions.map(function (_, i) {
        var st = (answers[S.key][i] !== null ? " ans" : "") + (isFlagged(i) ? " flag" : "") + (i === cur ? " now" : "");
        return ce("button", { key: i, className: "qz-qn" + st, 'aria-current': i === cur ? 'true' : undefined,
          'aria-label': "Question " + (i + 1) + (answers[S.key][i] !== null ? ", answered" : "") + (isFlagged(i) ? ", flagged" : ""),
          onClick: function () { go(i); } }, i + 1);
      })),
      ce("p", { className: "qz-sheet-key" }, ce("i", { className: "qz-qn ans" }), " answered ", ce("i", { className: "qz-qn flag" }), " flagged ", ce("i", { className: "qz-qn now" }), " this one"),
      ce("button", { className: "qz-btn qz-sheet-end", onClick: finish }, finLabel)));
  return qzLayer(ce, shell, { label: mock.title, wide: c.wide, overlay: quitDialog || finishDialog || sheetEl,
    top: qzTop(ce, { xLabel: "Quit the test", onX: function () { setQuitting(true); }, progLabel: "Questions answered", now: nAns, fill: Math.round(nAns / S.questions.length * 100),
      segs: S.questions.map(function (_, i) { return (i === cur ? 'now' : answers[S.key][i] !== null ? 'ans' : '') + (isFlagged(i) ? ' flag' : ''); }),
      meta: [
        ce("button", { key: "list", className: "qz-qlist", 'aria-haspopup': "dialog", onClick: function () { setSheet(true); } },
          cur + 1, " / ", S.questions.length, nFlag ? " · " + nFlag + " flagged" : ""),
        ce("span", { key: "timer", className: "qz-timer" + (left < 60 ? " low" : left < 300 ? " warn" : ""), role: "timer", 'aria-label': "Time left in this part" }, icon('clock'), mockClock(left))] }),
    main: [ce("p", { key: "cap", className: "qz-cap" }, "Part ", sec + 1, " · ", S.en, " · ", mockLabel(ex.mondai))].concat(c.main),
    dock: ce("div", { className: "qz-dock" }, ce("div", { className: "qz-in" },
      ce("button", { className: "qz-gb qz-prev", disabled: cur === 0, onClick: function () { go(cur - 1); } }, "← Prev"),
      ce("button", { className: "qz-gb qz-flag" + (flags[key] ? " on" : ""), 'aria-pressed': !!flags[key],
        onClick: function () { var f = Object.assign({}, flags); f[key] = !f[key]; setFlags(f); } }, flags[key] ? "⚑ Flagged" : "⚑ Flag"),
      ce("span", { className: "qz-sp" }, ce("span", { className: "qz-keys" }, ce("kbd", null, "1–" + ex.options.length), " choose ", last ? null : [ce("kbd", { key: "k" }, "Enter"), " next"])),
      last ? ce("button", { className: "qz-btn ok qz-finish", onClick: finish }, finLabel)
        : ce("button", { className: "qz-btn qz-nextq", onClick: function () { go(cur + 1); } }, "Next →"))) });
}
