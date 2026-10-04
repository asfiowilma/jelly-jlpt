"use strict";

// Placement test flow (ticket 39): intro → test → result, one full-screen layer (.ql, the quiz look).
// The engine (lib.js placement*) picks and grades; this file only shows questions and collects
// answers (option index for choices, typed text otherwise; null = "I don't know"), with no right /
// wrong feedback. Nothing is written until the result is confirmed (props.onApply); leaving saves
// nothing. A retake (some stages already done) only searches the stages after the furthest done one.

var PLACEMENT_ABOUT = 17; // "Question n of about 17": 7 probes x 2 + 3 spot-checks

// PlacementQuestion: one question, same markup/classes as the quiz layer, answered with Next or
// "I don't know". Remounted per question (key), so its pick / typed text start empty.
function PlacementQuestion(props) {
  var h = React.createElement, ex = props.ex, lv = props.level;
  var L = function (key) { return t(key, lv); };
  var _a = React.useState(''), answer = _a[0], setAnswer = _a[1];
  var _p = React.useState(null), pick = _p[0], setPick = _p[1];
  var isOpt = !!ex.options && typeof ex.correct === 'number';
  var ready = isOpt ? pick !== null : answer.trim() !== '';
  var submit = function () {
    if (!ready) return;
    props.onAnswer(isOpt ? pick : (ex.kana ? answer.replace(/n$/, 'ん') : answer)); // lone trailing n = ん, as in quizzes
  };
  var keyRef = React.useRef(null);
  keyRef.current = function (e) {
    var tag = e.target && e.target.tagName;
    if (e.key === 'Enter') {
      if (tag === 'BUTTON' || (e.nativeEvent || e).isComposing) return;
      e.preventDefault();
      submit();
    } else if (isOpt && tag !== 'INPUT' && /^[1-9]$/.test(e.key) && Number(e.key) <= ex.options.length) setPick(Number(e.key) - 1);
  };
  React.useEffect(function () {
    var on = function (e) { if (keyRef.current) keyRef.current(e); };
    document.addEventListener('keydown', on);
    return function () { document.removeEventListener('keydown', on); };
  }, []);
  var st = { chosen: pick, revealed: false, selected: null, tone: '' };
  var partsEl = function (parts) { return exPartsEl(ex, parts, st); };
  var q = ex.parts ? ex.parts.map(function (p) { return p.t; }).join('') : ex.question;
  var question = (ex.question || ex.parts) && h("div", { key: "q", className: QZ_SENTENCE.indexOf(ex.type) >= 0 ? "qz-sent" : "qz-big" + exBigClass(q), lang: "ja" },
    ex.parts ? partsEl(ex.parts) : ex.question);
  var body = isOpt
    ? h("div", { key: "opts", className: "qz-opts " + (ex.options.length % 2 === 1 || ex.options.some(function (o) { return String(o).length > 8; }) ? 'g1' : 'g2') },
      ex.options.map(function (opt, i) {
        return h("button", { key: i, className: "qz-opt" + (pick === i ? " sel" : ""), type: "button", 'aria-pressed': pick === i, lang: QZ_JA.test(opt) ? "ja" : "en",
          onClick: function () { setPick(i); } }, h("kbd", null, i + 1), h("span", null, ex.optionParts ? partsEl(ex.optionParts[i]) : opt));
      }))
    : h("input", { key: "in", className: "qz-input", type: "text", value: answer, 'aria-label': ex.prompt, lang: "ja", placeholder: L('pt_placeholder'),
      autoFocus: true, autoComplete: "off", autoCapitalize: "off", spellCheck: false,
      onChange: function (e) { setAnswer(ex.kana ? romajiToKana(e.target.value) : e.target.value); },
      onKeyDown: function (e) { if (e.key === 'Enter' && !(e.nativeEvent && e.nativeEvent.isComposing)) { e.stopPropagation(); submit(); } } });
  return h(React.Fragment, null,
    h("div", { className: "qz-main" }, h("div", { className: "qz-col" },
      h("p", { className: "qz-prompt" }, translatePrompt(ex.prompt, lv)),
      question,
      ex.note && h("p", { className: "qz-gloss" }, ex.note),
      body,
      !isOpt && ex.hint && h("p", { className: "qz-hint" }, ex.hint))),
    h("div", { className: "qz-dock" }, h("div", { className: "qz-in" },
      h("button", { className: "qz-gb", type: "button", onClick: function () { props.onAnswer(null); } }, L('pt_dk')),
      h("span", { className: "qz-sp" }),
      h("button", { className: "qz-btn qz-check", type: "button", disabled: !ready, onClick: submit }, L('pt_next')))));
}

function PlacementFlow(props) {
  var h = React.createElement, units = props.units, lv = props.level, completed = props.completed;
  var L = function (key) { return t(key, lv); };
  var fill = function (s, vals) { return Object.keys(vals).reduce(function (out, k) { return out.split('{' + k + '}').join(vals[k]); }, s); };
  var _sc = React.useState(function () { return placementScope(units, completed); }), scope = _sc[0];
  var teaching = units.filter(function (u) { return u.kind === 'kana' || u.kind === 'lesson'; });
  var retake = scope.length < units.length;
  var _s = React.useState('intro'), screen = _s[0], setScreen = _s[1];
  var _c = React.useState(null), cur = _c[0], setCur = _c[1];
  var _q = React.useState(0), qi = _q[0], setQi = _q[1];
  var _r = React.useState(null), res = _r[0], setRes = _r[1];
  var _p = React.useState(0), pos = _p[0], setPos = _p[1];
  var _l = React.useState(false), leaving = _l[0], setLeaving = _l[1];
  var eng = React.useRef(null), answers = React.useRef([]), layerRef = React.useRef(null);
  useLayerLock();
  var step = function () {
    var s = eng.current, next = placementNext(s);
    answers.current = [];
    if (next) { setCur(next); setQi(0); return; }
    var r = placementResult(s), at = s.stages.map(function (u) { return u.id; }).indexOf(r.startStageId);
    setRes(r);
    setPos(at < 0 ? s.stages.length : at);
    setScreen('result');
  };
  var begin = function () {
    eng.current = placementStart(scope);
    setScreen('test');
    step();
  };
  var answer = function (resp) {
    answers.current.push(resp);
    if (qi + 1 < cur.questions.length) return setQi(qi + 1);
    placementAnswer(eng.current, answers.current);
    step();
  };
  var close = function () { if (screen === 'intro') props.onClose(); else setLeaving(true); };
  var keyRef = React.useRef(null);
  keyRef.current = function (e) { if (e.key === 'Escape') { if (leaving) setLeaving(false); else close(); } };
  React.useEffect(function () {
    var on = function (e) { if (keyRef.current) keyRef.current(e); };
    document.addEventListener('keydown', on);
    return function () { document.removeEventListener('keydown', on); };
  }, []);
  React.useEffect(function () { // focus the layer on each screen, the dialog when it opens
    var d = leaving && document.querySelector && document.querySelector('.qz-dlg button'), l = layerRef.current;
    if (d) d.focus(); else if (l && l.focus && !(l.contains && l.contains(document.activeElement))) l.focus();
  }, [screen, leaving]);

  var leaveDialog = leaving && h("div", { className: "qz-scrim" },
    h("div", { className: "qz-dlg", role: "alertdialog", 'aria-label': L('pt_leave_title') },
      h("b", null, L('pt_leave_title')),
      h("p", null, L('pt_leave_body')),
      h("div", { className: "qz-row" },
        h("button", { className: "qz-gb", type: "button", onClick: function () { setLeaving(false); } }, L('pt_keep')),
        h("button", { className: "qz-btn bad", type: "button", onClick: props.onClose }, L('pt_leave')))));
  var top = function (meta, bar) {
    return h("div", { className: "qz-top" },
      h("button", { className: "qz-x", type: "button", 'aria-label': L('pt_leave_aria'), onClick: close }, icon('x')),
      bar || h("span", { className: "qz-sp" }),
      meta && h("div", { className: "qz-meta" }, h("span", null, meta)));
  };
  var layer = function () {
    return h.apply(null, ["div", { className: "ql pl-layer" + (props.swap ? " ql-swap" : ""), ref: layerRef, tabIndex: -1, role: "dialog", 'aria-modal': "true", 'aria-label': L('pt_title') }]
      .concat(Array.prototype.slice.call(arguments), [leaveDialog]));
  };

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (screen === 'intro') {
    return layer(top(),
      h("div", { key: "m", className: "qz-main" }, h("div", { className: "qz-col pl-col" },
        h("h1", { className: "pl-h1" }, L('pt_intro_title')),
        h("p", { className: "pl-sub" }, L('pt_intro_sub')),
        h("ul", { className: "pl-facts" }, ['pt_intro_1', 'pt_intro_2', 'pt_intro_3'].concat(retake ? ['pt_intro_retake'] : []).map(function (k) { return h("li", { key: k }, L(k)); })),
        h("div", { className: "pl-actions" },
          h("button", { id: "pt-begin", className: "qz-btn", type: "button", onClick: begin }, L('pt_start')),
          h("button", { className: "pl-link", type: "button", onClick: props.onClose }, L('pt_back'))))));
  }

  // ── Test ──────────────────────────────────────────────────────────────────
  if (screen === 'test' && cur) {
    var n = eng.current.answered + qi + 1, total = Math.max(PLACEMENT_ABOUT, n);
    return layer(
      top(fill(L('pt_q'), { n: n, total: total }), h("div", { className: "qz-prog pl-bar", role: "progressbar", 'aria-label': L('pt_progress'), 'aria-valuemin': 0, 'aria-valuemax': total, 'aria-valuenow': n - 1 },
        h("i", { className: "pl-fill", style: { width: Math.min(100, (n - 1) / total * 100) + '%' } }))),
      h(PlacementQuestion, { key: cur.stageId + ':' + qi + ':' + eng.current.answered, ex: cur.questions[qi], level: lv, onAnswer: answer }));
  }

  // ── Result ────────────────────────────────────────────────────────────────
  var stages = eng.current ? eng.current.stages : scope.filter(function (u) { return u.kind === 'kana' || u.kind === 'lesson'; });
  if (!res) return null;
  var def = res.startStageId ? stages.map(function (u) { return u.id; }).indexOf(res.startStageId) : stages.length;
  var trimmed = placementTrim(res, stages, pos), plan = placementApply(trimmed, units);
  var byId = {};
  units.forEach(function (u) { byId[u.id] = u; });
  var startUnit = stages[pos] || null;
  var marked = {}, holes = {};
  trimmed.passedStageIds.forEach(function (id) { marked[id] = true; });
  trimmed.holeStageIds.forEach(function (id) { holes[id] = true; });
  var waiting = pos > 0 ? placementReviewsWaiting(units, startUnit ? startUnit.index : units.length, completed).length : 0;
  var stageNo = function (u) { return u.index + 1; };
  var title = !stages.length || pos >= stages.length ? L('pt_res_all')
    : pos === 0 ? fill(L('pt_res_zero'), { n: stageNo(startUnit) }) : fill(L('pt_res_start'), { n: stageNo(startUnit), title: startUnit.title });
  var sub = pos >= stages.length ? L('pt_res_all_sub') : pos === 0 ? L('pt_res_zero_sub') : L('pt_res_sub');
  var apply = function (opts) { props.onApply(trimmed, startUnit, opts); };
  var stat = function (num, label) { return h("div", { className: "pl-stat" }, h("b", null, num), h("span", null, label)); };
  var legend = [['marked', 'pt_lg_marked'], ['start', 'pt_lg_start'], ['todo', 'pt_lg_todo']].concat(plan.skippedIds.length ? [['hole', 'pt_lg_hole']] : []).concat(retake ? [['done', 'pt_lg_done']] : []);
  return layer(top(),
    h("div", { key: "m", className: "qz-main" }, h("div", { className: "qz-col wide pl-col" },
      h("h1", { className: "pl-h1" }, title),
      h("p", { className: "pl-sub" }, sub),
      h("div", { className: "pl-rail", role: "img", 'aria-label': L('pt_rail') + ': ' + plan.doneIds.length + ' ' + L('pt_stat_stages') }, teaching.map(function (u) {
        var c = completed.has(u.id) ? 'done' : marked[u.id] ? 'marked' : startUnit && u.id === startUnit.id ? 'start' : holes[u.id] ? 'hole' : 'todo';
        return h("i", { key: u.id, className: "pl-seg " + c, title: fill(L('pt_stage_n'), { n: stageNo(u) }) + ': ' + u.title });
      })),
      h("div", { className: "pl-legend" }, legend.map(function (g) { return h("span", { key: g[0] }, h("i", { className: "pl-seg " + g[0], 'aria-hidden': "true" }), L(g[1])); })),
      h("div", { className: "pl-stats" },
        stat(plan.doneIds.length, L('pt_stat_stages')), stat(plan.cardItems.length, L('pt_stat_cards')), stat(eng.current.answered, L('pt_stat_qs'))),
      def > 0 && h("div", { className: "pl-field" },
        h("label", { htmlFor: "pt-earlier" }, L('pt_earlier')),
        h("input", { id: "pt-earlier", type: "range", min: 0, max: def, step: 1, value: pos, onChange: function (e) { setPos(Math.min(def, Math.max(0, +e.target.value))); } }),
        h("span", { className: "pl-note" }, pos < stages.length ? fill(L('pt_stage_n'), { n: stageNo(stages[pos]) }) : L('pt_res_all'))),
      waiting > 0 && h("p", { className: "pl-note", role: "status" }, fill(L(waiting === 1 ? 'pt_reviews_one' : 'pt_reviews_many'), { n: waiting })),
      plan.skippedIds.map(function (id) { return h("p", { key: id, className: "pl-note" }, fill(L('pt_hole'), { n: stageNo(byId[id]), title: byId[id].title })); }),
      h("div", { className: "pl-actions" },
        h("button", { id: "pt-apply", className: "qz-btn", type: "button", onClick: function () { apply({}); } },
          startUnit ? fill(L('pt_apply'), { n: stageNo(startUnit) }) : L('pt_apply_all')),
        h("button", { className: "qz-gb", type: "button", onClick: function () { apply({ diagnostic: true }); } }, L('pt_diag')),
        h("button", { className: "pl-link", type: "button", onClick: props.onClose }, L('pt_discard'))),
      h("p", { className: "pl-note" }, L('pt_res_note')),
      h("details", { className: "pl-how" },
        h("summary", null, fill(L('pt_how'), { n: res.log.length })),
        h("table", null,
          h("thead", null, h("tr", null, ['pt_col_step', 'pt_col_stage', 'pt_col_result', 'pt_col_note'].map(function (k) { return h("th", { key: k }, L(k)); }))),
          h("tbody", null, res.log.map(function (r, i) {
            var u = byId[r.stageId];
            return h("tr", { key: i },
              h("td", null, L(r.k === 'probe' ? 'pt_k_probe' : 'pt_k_spot')),
              h("td", null, u ? stageNo(u) + ' · ' + u.title : ''),
              h("td", { className: r.pass ? 'ok' : 'no' }, r.asked ? r.right + '/' + r.asked : '–'),
              h("td", { className: "pl-note" }, L(r.pass === null ? 'pt_n_none' : 'pt_n_' + r.k + (r.pass ? '_ok' : '_no'))));
          })))))));
}
