"use strict";

// Placement test flow (ticket 39): intro → test → result, one full-screen layer (.ql, the quiz look).
// The engine (lib.js placement*) picks and grades; this file only shows questions and collects
// answers (option index for choices, typed text otherwise; null = "I don't know"), with no right /
// wrong feedback. Nothing is written until the result is confirmed (props.onApply); leaving saves
// nothing. A retake (some stages already done) only searches the stages after the furthest done one.

// PlacementQuestion: one question, same markup/classes as the quiz layer, answered with Next or
// "I don't know". Remounted per question (key), so its pick / typed text start empty.
function PlacementQuestion(props) {
  var h = React.createElement, ex = props.ex, lv = props.level;
  var L = function (key) { return t(key, lv); };
  var _a = React.useState(''), answer = _a[0], setAnswer = _a[1];
  var _p = React.useState(null), pick = _p[0], setPick = _p[1];
  var _n = React.useState(null), notice = _n[0], setNotice = _n[1];
  var retries = React.useRef(0); // retry notices given (capped, RETRY_CAP); the component remounts per question
  var isOpt = !!ex.options && typeof ex.correct === 'number';
  var ready = isOpt ? pick !== null : answer.trim() !== '';
  var submit = function () {
    if (!ready) return;
    var resp = isOpt ? pick : (ex.kana ? kanaBox(ex, answer.replace(/n$/, 'ん')) : answer); // lone trailing n = ん, as in quizzes
    var note = !isOpt && retryNotice(ex, resp, retries.current); // same as the stage quiz: another reading / twin meaning / near miss is a retry, not an answer
    if (note) { retries.current++; return setNotice(note); }
    props.onAnswer(resp);
  };
  var keyRef = React.useRef(null);
  keyRef.current = function (e) {
    var tag = e.target && e.target.tagName;
    if (e.key === 'Enter' && e.shiftKey) { // Shift+Enter = "I don't know"
      if ((e.nativeEvent || e).isComposing) return;
      e.preventDefault();
      if (!e.repeat) props.onAnswer(null);
      return;
    }
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
  var question = (ex.question || ex.parts) && h("div", Object.assign({ key: "q" }, exQuestionProps(ex, q)),
    ex.parts ? exSentEls(ex, partsEl) : ex.question);
  var body = isOpt
    ? h("div", { key: "opts", className: "qz-opts " + (ex.options.length % 2 === 1 || ex.options.some(function (o) { return String(o).length > 8; }) ? 'g1' : 'g2') },
      ex.options.map(function (opt, i) {
        return h("button", { key: i, className: "qz-opt" + (pick === i ? " sel" : ""), type: "button", 'aria-pressed': pick === i, lang: QZ_JA.test(opt) ? "ja" : "en",
          onClick: function () { setPick(i); } }, h("kbd", null, i + 1), h("span", null, ex.optionParts ? partsEl(ex.optionParts[i]) : opt));
      }))
    : h("input", { key: "in", className: "qz-input", type: "text", value: answer, 'aria-label': ex.prompt, lang: "ja", placeholder: L(placementHintKey(ex)),
      autoFocus: true, autoComplete: "off", autoCapitalize: "off", spellCheck: false,
      onChange: function (e) { setNotice(null); setAnswer(ex.kana ? kanaBox(ex, e.target.value) : e.target.value); },
      onKeyDown: function (e) {
        if (e.key !== 'Enter' || (e.nativeEvent && e.nativeEvent.isComposing)) return;
        e.stopPropagation();
        if (e.shiftKey) { e.preventDefault(); if (!e.repeat) props.onAnswer(null); } else submit();
      } });
  return h(React.Fragment, null,
    h("div", { className: "qz-main" }, h("div", { className: "qz-col" },
      h("p", { className: promptCls(ex) }, promptEls(translatePrompt(ex.prompt, lv), ex)),
      question,
      exHelp(ex, lv),
      ex.note && h("p", { className: "qz-gloss" }, ex.note),
      body,
      !isOpt && ex.hint && h("p", { className: "qz-hint" }, ex.hint),
      notice && h("div", { className: "qz-warn qz-other", role: "status" }, notice))),
    h("div", { className: "qz-dock" }, h("div", { className: "qz-in" },
      h("button", { className: "qz-gb pl-dk", type: "button", onClick: function () { props.onAnswer(null); } }, L('pt_dk'), h("kbd", { 'aria-hidden': "true" }, "Shift+Enter")),
      h("span", { className: "qz-sp" }),
      h("button", { className: "qz-btn qz-check", type: "button", disabled: !ready, onClick: submit }, L('pt_next')))));
}

// Review helpers: the answer the question wanted, and its text in one line.
function placementExpected(ex) {
  if (ex.options && typeof ex.correct === 'number') return ex.options[ex.correct];
  return (ex.answers && ex.answers.length ? acceptedAnswers(ex).join(' · ') : '') || ex.romaji || '';
}
function placementQText(ex) { return ex.parts ? ex.parts.map(function (p) { return p.t; }).join('') : ex.question || ''; }

// placementSmooth(points [[x, y], …], x rising) → SVG path through every point: monotone cubic
// Hermite (Fritsch-Carlson), so the line never overshoots above or below its neighbours.
function placementSmooth(p) {
  var n = p.length, dx = [], m = [], t = [], i;
  if (n < 2) return n ? 'M' + p[0][0] + ' ' + p[0][1] : '';
  for (i = 0; i < n - 1; i++) { dx[i] = p[i + 1][0] - p[i][0]; m[i] = (p[i + 1][1] - p[i][1]) / dx[i]; }
  t[0] = m[0]; t[n - 1] = m[n - 2];
  for (i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = t[i + 1] = 0; continue; }
    var a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b;
    if (s > 9) { var k = 3 / Math.sqrt(s); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i]; }
  }
  var d = 'M' + p[0][0] + ' ' + p[0][1];
  for (i = 0; i < n - 1; i++) {
    var c = dx[i] / 3;
    d += ' C' + (p[i][0] + c) + ' ' + (p[i][1] + t[i] * c) + ' ' + (p[i + 1][0] - c) + ' ' + (p[i + 1][1] - t[i + 1] * c) + ' ' + p[i + 1][0] + ' ' + p[i + 1][1];
  }
  return d;
}

// PlacementChart: the result chart, inline SVG. Y = stage position in the test's scope, one band
// per level tinted with its colour (N5 at the bottom), dashed strips on top for levels not built
// yet; X = answer order. Marks differ by shape (dot right, cross wrong, ring don't know), never by
// colour alone, and are buttons (props.onPick(i)). The green fade under the start line = what gets
// marked. Draw-in plays on the first mount only; later renders (stepper, picks) add .still.
var PL_H = 320, PL_X0 = 12;
function PlacementChart(props) {
  var h = React.createElement, rows = props.rows, N = Math.max(1, props.total), lv = props.level;
  var L = function (key) { return t(key, lv); };
  var _t = React.useState(null), tip = _t[0], setTip = _t[1];
  var first = React.useRef(true);
  React.useEffect(function () { first.current = false; }, []);
  // a narrower canvas on phones keeps the labels readable (read per render, not on resize)
  var W = window.matchMedia && window.matchMedia('(max-width: 480px)').matches ? 420 : 600;
  var top = 14 + props.soon.length * 22, yb = PL_H - 32, X0 = PL_X0, X1 = W - 70, w = X1 - X0;
  var y = function (v) { return Math.round((yb - v / N * (yb - top)) * 10) / 10; };
  var step = rows.length > 1 ? (w - 36) / (rows.length - 1) : 0;
  var pts = rows.map(function (row, i) { return [Math.round((X0 + (rows.length > 1 ? 18 + i * step : w / 2)) * 10) / 10, y(row.r.stage - 0.5)]; });
  var d = placementSmooth(pts), ys = y(props.pos), col = function (l) { return 'var(--' + l.toLowerCase() + ')'; };
  var chip = props.start, chipW = chip ? chip.length * 7 + 22 : 0;
  var stop = function (o, c, a) { return h("stop", { offset: o, style: { stopColor: c, stopOpacity: a } }); };
  var glyph = function (row, x, yy) {
    var o = row.r.outcome;
    if (o === 'correct') return h("circle", { cx: x, cy: yy, r: 4, fill: "var(--ok)", stroke: "var(--bg)", strokeWidth: 1.5 });
    if (o === 'wrong') return h("path", { d: 'M' + (x - 3.6) + ' ' + (yy - 3.6) + 'l7.2 7.2m0-7.2l-7.2 7.2', stroke: "var(--bad)", strokeWidth: 2.4, strokeLinecap: "round" });
    return h("circle", { cx: x, cy: yy, r: 4, fill: "var(--bg)", stroke: "var(--warn)", strokeWidth: 2 });
  };
  var tone = { correct: 'var(--ok)', wrong: 'var(--bad)', dontKnow: 'var(--warn)' };
  var tipRow = tip !== null && rows[tip];
  return h("div", { className: "pl-cwrap" },
    h("svg", { className: "pl-chart" + (first.current ? "" : " still"), viewBox: "0 0 " + W + " " + PL_H, role: "group", 'aria-label': L('pt_ch_aria') },
      h("defs", null,
        h("linearGradient", { id: "pl-gm", x1: 0, y1: 0, x2: 0, y2: 1 }, stop(0, 'var(--ok)', .34), stop(1, 'var(--ok)', .02)),
        h("linearGradient", { id: "pl-gl", x1: 0, y1: 0, x2: 1, y2: 0 }, stop(0, 'var(--muted)', .25), stop(1, 'var(--text)', .8)),
        h("linearGradient", { id: "pl-gs", x1: 0, y1: 0, x2: 1, y2: 0 }, stop(0, 'var(--accent)', .5), stop(.3, 'var(--accent)', 1)),
        h("filter", { id: "pl-glow", x: "-5%", y: "-30%", width: "110%", height: "160%" }, h("feGaussianBlur", { stdDeviation: 3 })),
        h("clipPath", { id: "pl-plot" }, h("rect", { x: X0, y: top - 4, width: w, height: yb - top + 8, rx: 10 }))),
      h("g", { clipPath: "url(#pl-plot)" },
        props.bands.map(function (b, i) {
          return h("rect", { key: b.level, x: X0, y: y(b.to), width: w, height: y(b.from) - y(b.to), fill: col(b.level), opacity: i % 2 ? .11 : .06 });
        }),
        h("rect", { className: "pl-fade", x: X0, y: ys, width: w, height: Math.max(0, yb + 4 - ys), fill: "url(#pl-gm)" })),
      props.bands.map(function (b, i) {
        var done = b.to <= props.pos;
        return h("g", { key: b.level },
          i < props.bands.length - 1 && h("line", { x1: X0, x2: X1, y1: y(b.to), y2: y(b.to), stroke: "var(--border)", strokeDasharray: "1 5", strokeLinecap: "round" }),
          h("text", { x: X1 + 14, y: (y(b.to) + y(b.from)) / 2 + 5, className: "pl-band", style: { fill: col(b.level), opacity: done ? 1 : .8 } }, b.level + (done ? ' ✓' : '')));
      }),
      props.soon.slice().reverse().map(function (l, i) {
        var yy = 14 + i * 22;
        return h("g", { key: l },
          h("rect", { x: X0, y: yy, width: w, height: 18, rx: 6, fill: "none", stroke: "var(--border)", strokeDasharray: "3 4" }),
          h("text", { x: X1 + 14, y: yy + 13, className: "pl-soon" }, L('pt_ch_soon').replace('{level}', l)));
      }),
      h("path", { d: d, fill: "none", stroke: "var(--text)", strokeOpacity: .28, strokeWidth: 7, strokeLinecap: "round", filter: "url(#pl-glow)", className: "pl-fade" }),
      h("path", { d: d, pathLength: 1, fill: "none", stroke: "url(#pl-gl)", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "pl-draw" }),
      h("line", { x1: X0, x2: X1, y1: ys, y2: ys, stroke: "url(#pl-gs)", strokeWidth: 2.5, strokeLinecap: "round" }),
      h("circle", { cx: X1, cy: ys, r: 9, fill: "var(--accent)", opacity: .25 }),
      h("circle", { cx: X1, cy: ys, r: 4.5, fill: "var(--accent)" }),
      chip && h("g", { className: "pl-fade" },
        h("rect", { x: X1 - chipW, y: ys + 12, width: chipW, height: 22, rx: 11, fill: "var(--accent)" }),
        h("text", { x: X1 - chipW / 2, y: ys + 27, textAnchor: "middle", className: "pl-chip" }, chip)),
      rows.map(function (row, i) {
        var x = pts[i][0], yy = pts[i][1];
        return h("g", { key: i, className: "pl-pt pl-pop", tabIndex: 0, role: "button", 'aria-label': row.label, style: { animationDelay: (.5 + i * .035) + 's' },
          onClick: function () { props.onPick(i); },
          onKeyDown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); props.onPick(i); } },
          onMouseEnter: function () { setTip(i); }, onMouseLeave: function () { setTip(null); },
          onFocus: function () { setTip(i); }, onBlur: function () { setTip(null); } },
          h("circle", { cx: x, cy: yy, r: 9, fill: tone[row.r.outcome], opacity: .14 }),
          props.sel === i && h("circle", { cx: x, cy: yy, r: 12, fill: "none", stroke: "var(--text)", strokeWidth: 1.5 }),
          glyph(row, x, yy),
          h("circle", { className: "pl-ring", cx: x, cy: yy, r: 11 }));
      }),
      h("text", { x: X0 + 4, y: PL_H - 10, className: "pl-axis" }, L('pt_ch_first')),
      h("text", { x: X1 - 4, y: PL_H - 10, textAnchor: "end", className: "pl-axis" }, L('pt_ch_last'))),
    tipRow && h("div", { className: "pl-tip", 'aria-hidden': "true", style: { left: pts[tip][0] / W * 100 + '%', top: pts[tip][1] / PL_H * 100 + '%' } },
      h("b", null, tipRow.name), tipRow.tag + ' · ',
      h("span", { className: { correct: 'ok', wrong: 'bad', dontKnow: 'warn' }[tipRow.r.outcome] }, L({ correct: 'pt_r_ok', wrong: 'pt_r_no', dontKnow: 'pt_r_dk' }[tipRow.r.outcome]))));
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
  var _rv = React.useState(false), rvOpen = _rv[0], setRvOpen = _rv[1]; // result: the answer review <details>
  var _f = React.useState(null), filter = _f[0], setFilter = _f[1]; // 'missed' | 'all' | 'right'; null = missed (all when none)
  var _o = React.useState({}), openRows = _o[0], setOpenRows = _o[1];
  var _sl = React.useState(null), sel = _sl[0], setSel = _sl[1]; // answer ringed on the chart
  var eng = React.useRef(null), layerRef = React.useRef(null);
  useLayerLock();
  var step = function () {
    var s = eng.current, next = placementRunNext(s);
    if (next) { setCur(next); setQi(0); return; }
    var r = placementRunResult(s), at = s.stages.map(function (u) { return u.id; }).indexOf(r.startStageId);
    setRes(r);
    setPos(at < 0 ? s.stages.length : at);
    setScreen('result');
  };
  var begin = function () {
    eng.current = placementRunStart(scope);
    setScreen('test');
    step();
  };
  var answer = function (resp) {
    placementRunAnswer(eng.current, resp);
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
  var scrollRef = React.useRef(null); // answer row to bring into view after a chart mark was picked
  React.useEffect(function () {
    var i = scrollRef.current, row = i !== null && document.getElementById && document.getElementById('pl-q-' + i);
    scrollRef.current = null;
    if (!row) return;
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    row.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center' });
    var b = row.querySelector('button');
    if (b) b.focus({ preventScroll: true });
  });

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
    var warm = !!cur.check, n = (warm ? eng.current.answered : eng.current.counted) + qi + 1, total = PLACEMENT_MAX_QUESTIONS;
    return layer(
      top(fill(L(warm ? 'pt_warm' : 'pt_q'), { n: n, total: total }), h("div", { className: "qz-prog pl-bar", role: "progressbar", 'aria-label': L('pt_progress'), 'aria-valuemin': 0, 'aria-valuemax': total, 'aria-valuenow': warm ? 0 : n - 1 },
        h("i", { className: "pl-fill", style: { width: warm ? 0 : Math.min(100, (n - 1) / total * 100) + '%' } }))),
      h(PlacementQuestion, { key: cur.stageId + ':' + qi + ':' + eng.current.answered, ex: cur.question, level: lv, onAnswer: answer }));
  }

  // ── Result ────────────────────────────────────────────────────────────────
  // Chart of the answers against the start line, level strip, evidence, "start earlier" stepper,
  // the answer review (closed by default) and the action dock. Stage numbers on this screen are
  // per level ("N4 · stage 39"): a unit's place among all units of its level, as the app's global
  // Stage n counts every unit too (N5 numbers match it exactly).
  var stages = eng.current ? eng.current.stages : scope.filter(function (u) { return u.kind === 'kana' || u.kind === 'lesson'; });
  if (!res) return null;
  var def = res.startStageId ? stages.map(function (u) { return u.id; }).indexOf(res.startStageId) : stages.length;
  var trimmed = placementTrim(res, stages, pos), plan = placementApply(trimmed, units);
  var startUnit = stages[pos] || null;
  var marked = {};
  trimmed.passedStageIds.forEach(function (id) { marked[id] = true; });
  var waiting = pos > 0 ? placementReviewsWaiting(units, startUnit ? startUnit.index : units.length, completed).length : 0;
  var lvFirst = {}, lvSize = {};
  units.forEach(function (u) { if (!(u.level in lvFirst)) lvFirst[u.level] = u.index; lvSize[u.level] = (lvSize[u.level] || 0) + 1; });
  var lvNo = function (u) { return u.index - lvFirst[u.level] + 1; };
  var tag = function (u) { return fill(L('pt_tag'), { level: u.level, n: lvNo(u) }); };
  // one band per level in the test's scope (stages run N5 first), positions in `stages`
  var bands = [];
  stages.forEach(function (u, i) {
    var b = bands[bands.length - 1];
    if (b && b.level === u.level) b.to = i + 1; else bands.push({ level: u.level, from: i, to: i + 1 });
  });
  var soon = LEVELS.filter(function (l) { return !units.some(function (u) { return u.level === l; }); }); // Overview's "Coming soon"
  // answered rows only (the log also notes skipped stages / checks); warm-up = the beginner check
  var outcomeKey = { correct: 'pt_r_ok', wrong: 'pt_r_no', dontKnow: 'pt_r_dk' }, wn = 0, qn = 0;
  var rows = res.log.filter(function (r) { return r.outcome; }).map(function (r, i) {
    var u = stages[r.stage - 1], name = r.check ? fill(L('pt_mk_w'), { n: ++wn }) : fill(L('pt_mk_q'), { n: ++qn });
    return { i: i, r: r, u: u, name: name, short: r.check ? 'W' + wn : 'Q' + qn, tag: u ? tag(u) : '',
      label: fill(L('pt_mk_label'), { q: name, level: u ? u.level : '', n: u ? lvNo(u) : '', result: L(outcomeKey[r.outcome]) }) };
  });
  var shows = function (f, row) { return f === 'all' || (f === 'right') === (row.r.outcome === 'correct'); };
  var missed = rows.filter(function (row) { return row.r.outcome !== 'correct'; }).length;
  var flt = filter || (missed ? 'missed' : 'all');
  var openRow = function (i, on) {
    setOpenRows(function (prev) { var o = Object.assign({}, prev); o[i] = on; return o; });
    setSel(on ? i : sel === i ? null : sel);
  };
  var pick = function (i) { // chart mark → its answer, opened and in view
    if (!shows(flt, rows[i])) setFilter('all');
    setRvOpen(true);
    openRow(i, true);
    scrollRef.current = i;
  };
  // right / total before the start and after it, counted questions only (not the warm-up)
  var ev = [0, 0, 0, 0];
  rows.forEach(function (row) {
    if (row.r.check) return;
    var j = row.r.stage <= pos ? 0 : 2;
    ev[j + 1]++;
    if (row.r.outcome === 'correct') ev[j]++;
  });
  var evText = ev[1] && ev[3] ? 'pt_ev' : ev[1] ? 'pt_ev_lo' : ev[3] ? 'pt_ev_hi' : null;
  var allKnown = !stages.length || pos >= stages.length;
  var title = allKnown ? L('pt_res_all')
    : pos === 0 ? fill(L('pt_res_zero'), { level: startUnit.level, n: lvNo(startUnit) }) : fill(L('pt_res_start'), { level: startUnit.level, title: startUnit.title });
  var sub = allKnown ? L('pt_res_all_sub') : pos === 0 ? L('pt_res_zero_sub')
    : fill(L('pt_res_where'), { level: startUnit.level, n: lvNo(startUnit), total: lvSize[startUnit.level], answers: rows.length });
  var apply = function (opts) { props.onApply(trimmed, startUnit, opts); };
  var move = function (d) { setPos(Math.min(def, Math.max(0, pos + d))); };
  var stepBtn = function (d, key) {
    return h("button", { key: key, className: "qz-gb", type: "button", 'aria-label': L(key), disabled: d < 0 ? pos <= 0 : pos >= def, onClick: function () { move(d); } },
      (d < 0 ? '−' : '+') + Math.abs(d));
  };
  // a retake's scope can open mid-level: only offer levels whose real first stage is in it
  var jumps = bands.filter(function (b) { return b.from < def && teaching.filter(function (u) { return u.level === b.level; })[0] === stages[b.from]; });
  var levelCard = function (lv) {
    var teach = teaching.filter(function (u) { return u.level === lv; });
    var k = teach.filter(function (u) { return completed.has(u.id) || marked[u.id]; }).length, n = teach.length;
    var status = !n ? L('pt_lv_soon') : k >= n ? L('pt_lv_done') : k ? fill(L('pt_lv_marked'), { k: k, n: n }) : L('pt_lv_todo');
    var here = startUnit && startUnit.level === lv;
    return h("div", { key: lv, className: "pl-lv" + (here ? " here" : "") + (n ? "" : " off"), style: { '--c': 'var(--' + lv.toLowerCase() + ')' } },
      h("b", null, lv), h("small", null, status),
      h("i", { 'aria-hidden': "true" }, h("u", { style: { width: (n ? k / n * 100 : 0) + '%' } })));
  };
  var answerBody = function (row) {
    var ex = row.r.question || {}, resp = row.r.response, isOpt = !!ex.options && typeof ex.correct === 'number';
    var st = { chosen: null, revealed: false, selected: null, tone: '' };
    var parts = function (p) { return exPartsEl(ex, p, st); };
    return h("div", { className: "pl-qb" },
      ex.prompt && h("p", { className: "pl-note" }, translatePrompt(ex.prompt, lv)),
      (ex.parts || ex.question) && h(ex.frame ? "div" : "p", { className: exSentCls(ex, "pl-qbig"), lang: "ja" }, ex.parts ? exSentEls(ex, parts) : ex.question),
      isOpt ? h("ul", { className: "pl-opts" }, ex.options.map(function (o, k) {
        var right = k === ex.correct, mine = k === resp;
        return h("li", { key: k, className: (right ? "right" : "") + (mine ? " mine" : ""), lang: QZ_JA.test(o) ? "ja" : "en" },
          h("span", null, ex.optionParts ? parts(ex.optionParts[k]) : o),
          (right || mine) && h("em", null, L(right ? (mine ? 'pt_rv_mine_ok' : 'pt_rv_right') : 'pt_rv_mine_no')));
      }))
      : h("dl", { className: "pl-ans" },
        resp != null && h("dt", null, L('pt_rv_typed')),
        resp != null && h("dd", { lang: "ja", className: row.r.outcome === 'correct' ? 'ok' : 'bad' }, resp),
        row.r.outcome !== 'correct' && h("dt", null, L('pt_rv_correct')),
        row.r.outcome !== 'correct' && h("dd", { lang: "ja", className: "ok" }, placementExpected(ex))),
      resp == null && h("p", { className: "pl-note" }, L('pt_rv_skip')));
  };
  var mark = { correct: ['ok', '✓'], wrong: ['bad', '✕'], dontKnow: ['warn', '?'] };
  return layer(top(),
    h("div", { key: "m", className: "qz-main" }, h("div", { className: "qz-col wide pl-col pl-res" },
      h("p", { className: "pl-eyebrow" }, L('pt_res_eyebrow')),
      h("h1", { className: "pl-h1" }, title),
      h("p", { className: "pl-sub" }, sub),
      rows.length > 0 && h(PlacementChart, { rows: rows, bands: bands, soon: soon, total: stages.length, pos: pos, sel: sel, onPick: pick, level: lv,
        start: startUnit ? fill(L('pt_ch_start'), { level: startUnit.level, n: lvNo(startUnit) }) : null }),
      rows.length > 0 && h("p", { className: "pl-legend" },
        h("span", null, h("b", { className: "ok", 'aria-hidden': "true" }, "●"), " ", L('pt_r_ok')),
        h("span", null, h("b", { className: "bad", 'aria-hidden': "true" }, "✕"), " ", L('pt_r_no')),
        h("span", null, h("b", { className: "warn", 'aria-hidden': "true" }, "○"), " ", L('pt_r_dk')),
        h("span", null, h("b", { className: "acc", 'aria-hidden': "true" }, "━"), " ", L('pt_lg_start')),
        h("span", null, L('pt_lg_tap'))),
      h("div", { className: "pl-lvs" }, LEVELS.map(levelCard)),
      evText && h("p", { className: "pl-ev" }, fill(L(evText), { a: ev[0], b: ev[1], c: ev[2], d: ev[3] })),
      h("p", { className: "pl-note" }, fill(L('pt_res_marked'), { marked: plan.doneIds.length, cards: plan.cardItems.length }),
        waiting > 0 && ' ' + fill(L(waiting === 1 ? 'pt_reviews_one' : 'pt_reviews_many'), { n: waiting })),
      def > 0 && h("div", { className: "pl-card" },
        h("div", { className: "pl-card-h" },
          h("div", null, h("b", null, L('pt_earlier_h')), h("p", { className: "pl-note" }, L('pt_earlier_p'))),
          jumps.length > 0 && h("select", { id: "pt-jump", className: "theme-select", 'aria-label': L('pt_jump'), value: jumps.some(function (b) { return b.from === pos; }) ? String(pos) : '',
            onChange: function (e) { if (e.target.value !== '') setPos(+e.target.value); } },
            h("option", { value: '', disabled: true }, L('pt_jump')),
            jumps.map(function (b) { return h("option", { key: b.level, value: String(b.from) }, fill(L('pt_jump_lv'), { level: b.level })); }))),
        h("div", { className: "pl-step" },
          stepBtn(-5, 'pt_back5'), stepBtn(-1, 'pt_back1'),
          h("output", { 'aria-live': "polite" }, startUnit ? fill(L('pt_step_out'), { where: tag(startUnit), title: startUnit.title }) : L('pt_res_all')),
          stepBtn(1, 'pt_fwd1'), stepBtn(5, 'pt_fwd5'))),
      rows.length > 0 && h("details", { className: "pl-rv", open: rvOpen, onToggle: function (e) { setRvOpen(e.target.open); } },
        h("summary", null, L('pt_rv'), " ", h("small", null, fill(L('pt_rv_n'), { n: rows.length }))),
        h("div", { className: "mode-seg pl-flt", role: "group", 'aria-label': L('pt_rv_filter') },
          [['missed', 'pt_f_missed', missed], ['all', 'pt_f_all', rows.length], ['right', 'pt_f_right', rows.length - missed]].map(function (f) {
            return h("button", { key: f[0], type: "button", 'aria-pressed': flt === f[0], onClick: function () { setFilter(f[0]); } }, fill(L(f[1]), { n: f[2] }));
          })),
        h("ol", { className: "pl-qs" }, rows.map(function (row) {
          var ex = row.r.question || {}, on = !!openRows[row.i], m = mark[row.r.outcome];
          return h("li", { key: row.i, id: "pl-q-" + row.i, className: "pl-q" + (on ? " open" : "") + (sel === row.i ? " sel" : ""), hidden: !shows(flt, row) },
            h("button", { className: "pl-qh", type: "button", 'aria-expanded': on, onClick: function () { openRow(row.i, !on); } },
              h("span", { className: "pl-mk " + m[0], role: "img", 'aria-label': L(outcomeKey[row.r.outcome]) }, m[1]),
              h("span", { className: "pl-qn" }, row.short),
              h("span", { className: "pl-qt", lang: "ja" }, (placementQText(ex) || translatePrompt(ex.prompt || '', lv)) + (row.r.outcome === 'correct' ? '' : ' → ' + placementExpected(ex))),
              h("span", { className: "pl-tag" }, row.tag)),
            on && answerBody(row));
        }))))),
    h("div", { key: "d", className: "qz-dock pl-dock" }, h("div", { className: "pl-dock-in" },
      h("button", { id: "pt-apply", className: "qz-btn", type: "button", onClick: function () { apply({}); } },
        startUnit ? fill(L('pt_apply'), { title: startUnit.title }) : L('pt_apply_all')),
      h("div", { className: "pl-dock-row" },
        h("button", { id: "pt-diag", className: "qz-gb", type: "button", onClick: function () { apply({ diagnostic: true }); } }, L('pt_diag')),
        h("button", { id: "pt-discard", className: "pl-link", type: "button", onClick: props.onClose }, L('pt_discard'))),
      h("p", { className: "pl-note" }, L('pt_res_note')))));
}
