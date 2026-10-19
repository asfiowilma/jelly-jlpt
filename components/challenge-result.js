"use strict";

// Result screen of the mastery challenge (full-screen flow), on the shared quiz shell (quiz-shell.js).
// Cards slide in one by one, then each stamp lands. props: level, scores (challengeScore output),
// misses ([{ stage, kind, item }]), run (the stored chrun doc), onClose, onRetake, onStamped() (fires once after the last stamp has landed).
// After the last stamp the verdict fades in, then the missed block.
var CH_MISS_CAP = 8;
// [Japanese text, answer] of a missed item
function challengeMissLine(it) {
  var a = it.kind === 'vocab' ? [it.word, (it.gloss || [])[0]] : it.kind === 'kanji' ? [it.char, (it.meaning || [])[0]]
    : it.kind === 'kana' ? [it.char, it.romaji] : it.kind === 'grammar' ? [it.pattern, it.meaning] : [it.word, ''];
  return [a[0] || '', a[1] || ''];
}
function ChallengeResult(props) {
  var h = React.createElement, scores = props.scores || [];
  var reduce = typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var shell = useQuizLayer(true, false);
  var _in = React.useState(reduce ? scores.length : 0), nIn = _in[0], setIn = _in[1];
  var _st = React.useState(reduce ? scores.length : 0), nSt = _st[0], setSt = _st[1];
  var _vd = React.useState(reduce), verdict = _vd[0], setVerdict = _vd[1];
  var _mb = React.useState(reduce), showMb = _mb[0], setShowMb = _mb[1];
  var doneRef = React.useRef(false);
  React.useEffect(function () {
    if (reduce) return undefined;
    var timers = [];
    scores.forEach(function (_, i) {
      timers.push(setTimeout(function () { setIn(i + 1); }, i * 1000 + 400));
      timers.push(setTimeout(function () { setSt(i + 1); }, i * 1000 + 1050));
    });
    return function () { timers.forEach(clearTimeout); };
  }, []);
  React.useEffect(function () {
    if (nSt >= scores.length && !doneRef.current) { doneRef.current = true; if (props.onStamped) props.onStamped(); }
  }, [nSt]);
  React.useEffect(function () {
    if (nSt < scores.length || reduce) return undefined;
    var a = setTimeout(function () { setVerdict(true); }, 600), b = setTimeout(function () { setShowMb(true); }, 1000);
    return function () { clearTimeout(a); clearTimeout(b); };
  }, [nSt]);
  var okN = scores.filter(function (s) { return s.cleared; }).length, noN = scores.length - okN;
  var mood = noN === 0 ? 'happy' : okN === 0 ? 'oops' : 'smug';
  var say = noN === 0 ? "Everything cleared. Show-off." : okN === 0 ? "Not one. Bold." : okN + " of " + scores.length + " cleared. Not bad. Not perfect either.";
  var sub = noN ? "A stage clears only on a perfect run. Cleared stages stay cleared." : "Every stage in this run is yours for keeps.";
  var all = props.misses || [], shown = all.slice(0, CH_MISS_CAP), groups = [];
  shown.forEach(function (m) {
    var g = groups.filter(function (x) { return x.stage === m.stage; })[0];
    if (!g) groups.push(g = { stage: m.stage, list: [] });
    g.list.push(challengeMissLine(m.item));
  });
  var retake = function () { props.onRetake(); };
  var names = {};
  challengeStages(props.level).forEach(function (u) { names[u.id] = u.title; });
  shell.keyRef.current = function (e) { if (e.key === 'Escape') props.onClose(); else shell.trapTab(e); };
  var top = qzTop(h, {
    xLabel: "Close", onX: props.onClose, progLabel: "Result", now: scores.length,
    segs: scores.map(function (s) { return s.cleared ? 'ok' : 'bad'; }),
    meta: [h("span", { key: "l" }, "Result")] });
  var main = [
    h("div", { key: "hd", className: "ch-res" }, jelly(verdict ? mood : 'smug', 84),
      h("div", null, h("h3", { id: "ch-verdict-head" }, verdict ? say : "Let's see how that went…"), h("p", { id: "ch-verdict" }, verdict ? sub : " "))),
    h("div", { key: "cards", className: "cards" }, scores.map(function (s, i) {
      return h("div", { key: s.stage, className: "sc2" + (s.cleared ? "" : " m") + (i < nIn ? " in" : "") },
        h("span", { className: "st", hidden: i >= nSt, 'aria-hidden': "true" }, s.cleared ? "済" : "NOT YET"),
        h("b", null, names[s.stage] || s.stage),
        h("small", null, s.cleared ? "Perfect" : (s.total - s.missed) + " of " + s.total + " right"));
    })),
    h("div", { key: "mb", id: "ch-missed", className: showMb ? "in" : "" }, groups.length > 0 && [
      h("h4", { key: "h" }, "What you missed")].concat(groups.map(function (g) {
      return h("div", { key: g.stage }, h("div", { className: "stg" }, names[g.stage] || g.stage),
        h("ul", null, g.list.map(function (l, i) {
          return h("li", { key: i }, h("span", { className: "ch-q", lang: "ja" }, l[0]), h("span", { className: "a" }, l[1]));
        })));
    }), all.length > CH_MISS_CAP ? [h("p", { key: "more", className: "more" }, "and " + (all.length - CH_MISS_CAP) + " more")] : []))];
  var dock = h("div", { className: "qz-dock" }, h("div", { className: "qz-in" },
    h("button", { className: "ch-gb", onClick: props.onClose }, "Back to stages"), h("span", { className: "ch-sp" }),
    h("button", { className: "qz-btn", onClick: retake }, noN ? "Retake missed" : "Go again")));
  return qzLayer(h, shell, { label: "Mastery Challenge result", top: top, main: main, dock: dock });
}
