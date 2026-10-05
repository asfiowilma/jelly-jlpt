"use strict";

// MockExam (ticket 18, Q37-Q39): one fixed mock (data/<lvl>/mocks.js) sat like the real test.
// Three parts in order, each with its own clock (mockSections: 20 / 40 / 30 min for a full N5
// mock); a finished or timed-out part can't be reopened. Inside a part: answer in any order,
// change answers, flag questions to come back to. Listening: play + one replay, options heard
// only for utterance / quick. No feedback until the end; then an estimated scaled score with the
// real pass rules (mockEstimate), a table per mondai and every missed question explained.
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

function mockPartsEl(parts) {
  return (parts || []).map(function (p, i) {
    var el = p.r ? React.createElement("ruby", { key: i }, p.t, React.createElement("rt", null, p.r)) : p.t;
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
        ce("p", null, "Listening plays each question once, with one replay."),
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
    var r = result, est = r.estimate, rule = JLPT_PASS[mock.level], out = mockOutlook(r.parts, mock.level), ring = 2 * Math.PI * 60;
    var tone = { likely: 'pass', borderline: 'warn', unlikely: 'fail' }[out.verdict];
    var range = function (x) { return x[0] + '–' + x[1]; };
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
    return ce("div", { className: "mock", ref: resultRef, tabIndex: -1 },
      back,
      ce("div", { className: "section-label" }, mock.title, ": results"),
      done && done.timeUp && partNote(),
      ce("div", { className: "mock-estimate " + tone, role: "status" },
        ce("div", { className: "qz-res" },
          ce("div", { className: "qz-ring" },
            ce("svg", { viewBox: "0 0 140 140", 'aria-hidden': "true" },
              ce("circle", { className: "t", cx: 70, cy: 70, r: 60 }),
              ce("circle", { className: "v " + tone, cx: 70, cy: 70, r: 60, strokeDasharray: (ring * est.total / 180) + " " + ring })),
            ce("span", { className: "qz-jelly" }, out.verdict === 'likely' ? ce(JellyExcited, { size: 84 }) : jelly('oops', 84))),
          ce("div", null,
            practice && ce("span", { className: "mock-practice" }, "Practice attempt"),
            ce("h3", { className: "qz-verdict " + tone }, out.verdict === 'likely' ? "Likely pass" : out.verdict === 'borderline' ? "Borderline" : "Unlikely to pass yet"),
            ce("p", { className: "mock-estimate-total" }, "Estimate: ", ce("b", null, est.total), " / 180 · likely range ", range(out.total)),
            practice && ce("p", null, "You have sat this mock before, so the questions are known. This attempt is practice and does not change your headline estimate", (function () { var f = mockHeadline(allMocks, mock.id); return f ? " (first attempt: " + f.estimate.total + " / 180)." : "."; })()),
            ce("p", null, out.verdict === 'likely' ? "Even the low end of the range clears the pass mark and both section minimums."
              : out.verdict === 'borderline' ? "The range crosses a pass mark. A longer test or another attempt would tell you more."
              : "Even the high end of the range misses the total or a section minimum."))),
        ce("ul", null,
          ce("li", null, ce("span", { lang: "ja" }, "言語知識・読解"), " (vocabulary, grammar, reading): ", est.lkr, " / 120 (", range(out.lkr), "), minimum ", rule.lkr, est.lkr < rule.lkr ? " ✗" : " ✓"),
          ce("li", null, ce("span", { lang: "ja" }, "聴解"), " (listening): ", est.listening, " / 60 (", range(out.listening), "), minimum ", rule.listening, est.listening < rule.listening ? " ✗" : " ✓"),
          ce("li", null, "Total: ", est.total, " / 180 (", range(out.total), "), pass mark ", rule.total, est.total < rule.total ? " ✗" : " ✓")),
        ce("p", { className: "mock-note" }, "This is an estimate. The range is an 80% range from how many questions you answered (fewer questions, wider range). Each part's share of right answers is scaled straight onto the official ranges: ",
          "言語知識・読解 = 120 × (21 × vocabulary + 17 × grammar + 5 × reading) ÷ 43, 聴解 = 60 × listening. ",
          "The real JLPT scores answer patterns with item response theory and adjusts for each test's difficulty, so no exact conversion exists, ",
          "and these questions come from what you studied here, so the estimate probably runs high."),
        ce("p", { className: "mock-note" }, "Listening is the least certain part: it uses your browser's computer voice, not the test recording. Practise with the ",
          ce("a", { href: OFFICIAL_SAMPLES_URL, target: "_blank", rel: "noopener noreferrer" }, "official sample audio (jlpt.jp)"), " too.")),
      ce("button", { className: "btn-outline mock-again", onClick: takeAgain }, "Take again"),
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
  var go = function (i) { stopAudio(); playSfx('next'); setCur(i); setSheet(false); };
  var usedPlays = plays[key] || 0, playsLeft = ex.maxPlays ? ex.maxPlays - usedPlays : Infinity;
  var play = function (lines) {
    if (playsLeft <= 0) return;
    var p = Object.assign({}, plays);
    p[key] = usedPlays + 1;
    setPlays(p);
    stopAudio();
    setSpeaking(true);
    stopRef.current = speakScript(lines, { onEnd: function () { setSpeaking(false); } });
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
    plays: usedPlays, speaking: speaking, play: play, voiceStatus: 'ok', replyHint: "The reply texts show in your results.", showEarly: false, onEarly: function () {} });
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
