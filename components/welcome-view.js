"use strict";

// Welcome takeover (ticket 39): shown once over the app when progress is completely empty, and again
// from Settings ("Show the welcome again", props.again). Pitch, four facts, pace (with a weeks-to-finish
// line) and an optional exam date, then the fork: start from zero or find a starting point
// (placement test). Skip just closes it. Furigana and UI language keep their automatic defaults.
// Layout reuses the quiz layer (.ql) so it covers the app the same way.

// layerLock(open): lock body scroll while a full-screen layer is up (shared with the placement test).
function useLayerLock() {
  React.useEffect(function () {
    var b = typeof document !== 'undefined' && document.body;
    if (!b || !b.classList) return undefined;
    b.classList.add('quiz-open');
    return function () { b.classList.remove('quiz-open'); };
  }, []);
}

function WelcomeView(props) {
  var ce = React.createElement, lv = props.level, units = props.units;
  var L = function (key) { return t(key, lv); };
  var fill = function (s, vals) { return Object.keys(vals).reduce(function (out, k) { return out.split('{' + k + '}').join(vals[k]); }, s); };
  var _d = React.useState(props.examDate || ''), draft = _d[0], setDraft = _d[1];
  var layerRef = React.useRef(null);
  useLayerLock();
  React.useEffect(function () {
    var l = layerRef.current;
    if (l && l.focus) l.focus();
    var on = function (e) { if (e.key === 'Escape') props.onSkip(); };
    if (typeof document !== 'undefined' && document.addEventListener) document.addEventListener('keydown', on);
    return function () { if (typeof document !== 'undefined' && document.removeEventListener) document.removeEventListener('keydown', on); };
  }, []);
  var now = Date.now();
  // units still to do at the course's first level; pace → days → weeks (pace helpers in lib.js)
  var first = units[0].level, left = units.filter(function (u) { return u.level === first; }).length;
  var weeks = Math.max(1, Math.ceil(Math.ceil(left / props.pace) / 7));
  var err = draft ? examDateError(draft, now) : null;
  var sug = draft && !err ? suggestPace(left, draft, now) : undefined; // undefined = no exam date to judge
  var examNote = err ? L('wl_exam_' + err)
    : sug === undefined ? null
    : sug === null ? L('wl_exam_tight')
    : props.pace >= sug ? L('wl_exam_ok')
    : fill(L('wl_exam_try'), { pace: L(paceMode(sug).key).split(/[:：]/)[0] });
  var choice = function (id, title, sub, onClick) {
    return ce("button", { id: id, className: "pl-choice", type: "button", onClick: onClick },
      ce("b", null, title), ce("span", null, sub));
  };
  return ce("div", { className: "ql pl-layer", ref: layerRef, tabIndex: -1, role: "dialog", 'aria-modal': "true", 'aria-labelledby': "wl-title" },
    ce("div", { className: "qz-top" },
      ce("span", { className: "pl-brand" }, jelly('idle', 28), "日本語"),
      ce("span", { className: "qz-sp" }),
      ce("button", { className: "pl-link", type: "button", onClick: props.onSkip }, props.again ? L('wl_close') : L('wl_skip'))),
    ce("div", { className: "qz-main" }, ce("div", { className: "qz-col pl-col" },
      ce("h1", { id: "wl-title", className: "pl-h1" }, L('wl_title')),
      ce("p", { className: "pl-sub" }, L('wl_sub')),
      ce("ul", { className: "pl-facts" }, [1, 2, 3, 4].map(function (n) { return ce("li", { key: n }, L('wl_fact_' + n)); })),
      ce("div", { className: "pl-field" },
        ce("label", { htmlFor: "wl-pace" }, L('wl_pace')),
        ce("select", { id: "wl-pace", className: "theme-select", value: String(props.pace), onChange: function (e) { props.setPace(parseFloat(e.target.value)); } },
          PACE_MODES.map(function (m) { return ce("option", { key: m.pace, value: String(m.pace) }, L(m.key)); }))),
      ce("p", { className: "pl-note" }, fill(L(weeks === 1 ? 'wl_pace_week' : 'wl_pace_weeks'), { n: weeks, lv: first })),
      ce("div", { className: "pl-field" },
        ce("label", { htmlFor: "wl-exam" }, L('wl_exam')),
        ce("input", { id: "wl-exam", type: "date", className: "theme-select", value: draft, 'aria-invalid': err ? "true" : undefined, 'aria-describedby': "wl-exam-note",
          onChange: function (e) {
            var v = e.target.value;
            setDraft(v);
            if (!v) props.setExamDate(null);
            else if (!examDateError(v, Date.now())) props.setExamDate(v);
          } })),
      ce("p", { id: "wl-exam-note", className: "pl-note" + (err ? " bad" : ""), role: err ? "alert" : undefined }, examNote),
      ce("div", { className: "pl-fork" },
        props.again
          ? choice("wl-keep", L('wl_keep'), L('wl_keep_sub'), props.onSkip)
          : choice("wl-zero", L('wl_zero'), L('wl_zero_sub'), props.onZero),
        choice("wl-find", L('wl_find'), L('wl_find_sub'), props.onFind)))));
}
