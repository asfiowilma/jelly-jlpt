"use strict";

// Question loop of the mastery challenge (full-screen flow), on the shared quiz shell (quiz-shell.js).
// An answer is final (no re-ask). Leaving writes nothing; the last answer writes the cleared stages and the run record.
// props: level, mode, retakeOf (a stored chrun doc: the next run starts from its missed stages), onClose, onDone({ run, scores, misses })
var CH_TAG = { vocab: 'section_vocabulary', kanaword: 'section_vocabulary', kanji: 'section_kanji', grammar: 'section_grammar', kana: 'section_kana' };

function challengeExercises(level, mode, retakeOf) {
  var stages = challengeStages(level);
  var c = retakeOf ? challengeRetake(retakeOf, stages, Store.docs(), Math.random) : null;
  var pool = c ? c.pool : challengePool(stages, Store.docs(), mode);
  if (!c) c = challengeCompose(pool, [], Math.random);
  var ctxs = {};
  var qs = [], exs = [];
  c.questions.forEach(function (q) {
    var unit = stages.filter(function (u) { return u.id === q.stage; })[0];
    var ctx = ctxs[q.stage] || (ctxs[q.stage] = quizContext(unit));
    var ex = makeQuestion(q.item, ctx, false, [], false) || makeQuestion(q.item, ctx, null, [], false);
    if (ex) { qs.push(q); exs.push(ex); }
  });
  return { pool: pool, deferred: c.deferred, questions: qs, exs: exs };
}

function ChallengeRun(props) {
  var h = React.createElement, lv = props.level;
  var _run = React.useState(function () { return challengeExercises(lv, props.mode, props.retakeOf); }), run = _run[0];
  var startedAt = React.useRef(Date.now()).current;
  var _cur = React.useState(0), cur = _cur[0], setCur = _cur[1];
  var _pick = React.useState(null), pick = _pick[0], setPick = _pick[1];
  var _answer = React.useState(''), answer = _answer[0], setAnswer = _answer[1];
  var _rev = React.useState(false), revealed = _rev[0], setRevealed = _rev[1];
  var _res = React.useState([]), results = _res[0], setResults = _res[1];
  var _leaving = React.useState(false), leaving = _leaving[0], setLeaving = _leaving[1];
  var _early = React.useState(false), showEarly = _early[0], setShowEarly = _early[1];
  var voiceStatus = React.useState(function () { return jaVoiceStatus(false); })[0];
  var shell = useQuizLayer(true, leaving);
  useQuizBusy(true);
  React.useEffect(function () { playSynthSfx('whoosh'); }, []); // the challenge opens with a whoosh
  var exs = run.exs;
  if (!exs.length) return null;
  var ex = exs[cur];
  var isOpt = !!ex.options && typeof ex.correct === 'number';
  var ready = isOpt ? pick !== null : answer.trim() !== '';
  var okNow = revealed && results[cur] === true;
  var tone = !revealed ? '' : okNow ? ' ok' : ' bad';
  var check = function () {
    if (revealed || !ready) return;
    var resp = isOpt ? pick : (ex.kana ? kanaBox(ex, answer.replace(/n$/, 'ん')) : answer);
    if (typeof resp === 'string') setAnswer(resp);
    var ok = answerIsRight(ex, resp);
    playSfx(ok ? 'correct' : 'wrong');
    setRevealed(true);
    setResults(results.concat([ok]));
  };
  var finish = function (all) {
    var scores = challengeScore(run.questions, all);
    playSfx('complete');
    var docs = Store.docs();
    challengeApply(scores, docs, Date.now()).forEach(function (d) { Store.putUnit(d._id.slice(5), true); });
    notifyStoreChanged(); // App re-reads completed, so the Stages list shows the cleared stages without a reload
    var chrun = challengeRecord(lv, props.retakeOf ? props.retakeOf.mode : props.mode, run.pool, scores, startedAt, run.deferred);
    Store.putChrun(chrun);
    var misses = run.questions.filter(function (_, i) { return all[i] !== true; });
    props.onDone({ run: chrun, scores: scores, misses: misses });
  };
  var next = function () {
    if (cur + 1 >= exs.length) return finish(results);
    setCur(cur + 1); setPick(null); setAnswer(''); setRevealed(false); setShowEarly(false);
  };
  shell.keyRef.current = function (e) {
    if (shell.trapTab(e)) return;
    if (e.key === 'Escape') { setLeaving(!leaving); return; }
    if (leaving) return;
    var tag = e.target && e.target.tagName;
    if (e.key === 'Enter') {
      var onOpt = tag === 'BUTTON' && e.target.classList.contains('qz-opt') && (revealed || ready);
      if ((tag === 'BUTTON' && !onOpt) || (tag === 'INPUT' && !revealed) || (e.nativeEvent || e).isComposing) return;
      e.preventDefault();
      return revealed ? next() : check();
    }
    if (tag === 'INPUT') return;
    if (e.key === ' ' && (ex.type === 'listen' || ex.type === 'listen_dialog')) { e.preventDefault(); if (!e.repeat) { if (ex.type === 'listen') speak(ex.audio); else speakScript(ex.script, {}); } return; }
    var n = /^[1-9]$/.test(e.key) ? Number(e.key) - 1 : -1;
    if (isOpt && !revealed && n >= 0 && n < ex.options.length) setPick(n);
  };
  var kit = qzKit(h, ex, {
    help: true, lv: lv, pick: pick, revealed: revealed, selected: revealed && isOpt ? pick : null, tone: tone, onPick: setPick,
    plays: 0, play: function (lines) { speakScript(lines, {}); }, voiceStatus: voiceStatus, showEarly: showEarly, onEarly: function () { setShowEarly(true); } });
  var body;
  if (isOpt) body = kit.choice();
  else body = { wide: false, main: [kit.promptEl, kit.questionEl(),
    h("input", {
      key: "in", className: "qz-input" + tone, type: "text", value: answer, 'aria-label': ex.prompt, lang: "ja",
      placeholder: ex.placeholder || 'Type your answer...', disabled: revealed, autoFocus: true, autoComplete: "off", autoCapitalize: "off", spellCheck: false,
      onChange: function (e) { setAnswer(ex.kana ? kanaBox(ex, e.target.value) : e.target.value); },
      onKeyDown: function (e) { if (e.key === 'Enter' && !(e.nativeEvent && e.nativeEvent.isComposing)) { e.stopPropagation(); check(); } }
    })] };
  var tagKey = CH_TAG[run.questions[cur].kind];
  var ansText = exAnswer(ex);
  var main = [tagKey && h("span", { key: "tag", className: "ch-tag" }, t(tagKey, lv))].concat(body.main,
    revealed ? [h("div", { key: "fb", className: "ch-fb " + (okNow ? 'ok' : 'bad'), role: "status", 'aria-live': "polite" },
      h("b", null, okNow ? "Fine, that one is right." : "Nope. Not that one."),
      !okNow && h("span", { lang: QZ_JA.test(ansText) ? "ja" : "en" }, exAnswerEl(ex, ansText)))] : []);
  var mood = revealed && okNow ? 'happy' : 'smug';
  var say = !revealed ? "Take your time. I have all day." : okNow ? "Hm. Lucky." : "Called it.";
  var dock = h("div", { className: "qz-dock" }, h("div", { className: "qz-in" },
    jelly(mood, 48), h("span", { className: "ch-say" }, say),
    revealed ? h("button", { className: "qz-btn", onClick: next }, "Next")
      : h("button", { className: "qz-btn qz-check", disabled: !ready, onClick: check }, "Check")));
  var top = qzTop(h, {
    xLabel: "Leave challenge", onX: function () { setLeaving(true); }, progLabel: "Challenge progress", now: results.length,
    segs: exs.map(function (_, i) { return i < results.length ? results[i] ? 'ok' : 'bad' : i === cur ? 'now' : ''; }),
    meta: [h("span", { key: "l" }, cur + 1 + " / " + exs.length)] });
  var leaveDialog = leaving && qzLeaveDialog(h, {
    label: "Leave the challenge", title: "Leave the challenge?", text: "Your answers so far won’t be saved.",
    stay: "Keep going", leave: "Leave", onStay: function () { setLeaving(false); }, onLeave: props.onClose });
  return qzLayer(h, shell, { label: "Mastery challenge", top: top, main: main, dock: dock, wide: body.wide, overlay: leaveDialog });
}
