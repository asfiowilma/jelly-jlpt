#!/usr/bin/env node
/**
 * Headless test runner for jelly-jlpt.
 *
 * Loads the same scripts as index.html, in the same order, via Node's vm
 * module (so top-level `var` declarations become globals):
 *   data/catalog.js → data/<level>/*.js (sorted) → lib.js → store.js →
 *   app-helpers.js → sfx.js → components/*.js → app.js
 * then runs every tests/*.js file (the QUnit suite tests.html loads) through a
 * minimal QUnit shim, plus a few Node-only checks below (React render smoke
 * tests with a stubbed React, safeSave, sanitizeSvg, stroke-order fetch).
 *
 * Exit 0  → all tests passed
 * Exit 1  → one or more tests failed
 */
"use strict";

const vm   = require("vm");
const fs   = require("fs");
const path = require("path");

// ── locate project root ───────────────────────────────────────────────────────
const projectDir = process.env.CLAUDE_PROJECT_DIR ||
  path.resolve(__dirname, "..", "..");
function load(rel) { vm.runInThisContext(fs.readFileSync(path.join(projectDir, rel), "utf8"), { filename: rel }); }

// ── browser-API stubs ─────────────────────────────────────────────────────────
// speechSynthesis absent → buildExercises skips the first "listen" exercise
global.window = { speechSynthesis: undefined };
global.React = {
  createElement: function () { return {}; },
  useState: function (init) {
    var v = typeof init === "function" ? init() : init;
    return [v, function () {}];
  },
  useEffect: function () {},
  useRef:    function () { return { current: null }; },
  Component: function () {},
  Fragment:  "fragment",
};
global.React.Component.prototype.setState = function () {};
global.React.Component.prototype.render = function () { return null; };
global.ReactDOM = { createRoot: function () { return { render: function () {} }; } };
global.localStorage = { getItem: function () { return null; }, setItem: function () {}, removeItem: function () {} };
global.document = { getElementById: function () { return {}; } };

// ── load scripts into global scope (mirrors index.html) ──────────────────────
const dataDir = path.join(projectDir, "data");
load(path.join("data", "catalog.js"));
load(path.join("data", "stamp-icons.js"));
for (const lv of fs.readdirSync(dataDir).filter(function (f) { return fs.statSync(path.join(dataDir, f)).isDirectory(); }).sort()) {
  for (const file of fs.readdirSync(path.join(dataDir, lv)).sort()) load(path.join("data", lv, file));
}
// Mirrors the <script src> order in index.html after data/
var appFiles = [
  path.join("audio", "manifest.js"),
  "lib.js",
  "store.js",
  "app-helpers.js",
  "sfx.js",
  path.join("components", "kanji-section.js"),
  path.join("components", "kana-section.js"),
  path.join("components", "vocab-section.js"),
  path.join("components", "dialogue-section.js"),
  path.join("components", "dialogue-practice.js"),
  path.join("components", "quiz-shell.js"),
  path.join("components", "exercises.js"),
  path.join("components", "mock-exam.js"),
  path.join("components", "prep-guide.js"),
  path.join("components", "unit-view.js"),
  path.join("components", "review-mode.js"),
  path.join("components", "overview.js"),
  path.join("components", "today-view.js"),
  path.join("components", "stats-view.js"),
  path.join("components", "stamp.js"),
  path.join("components", "achievements-view.js"),
  path.join("components", "import-view.js"),
  path.join("components", "welcome-view.js"),
  path.join("components", "placement-view.js"),
  path.join("components", "settings-view.js"),
  path.join("components", "toast-stack.js"),
  path.join("components", "donate.js"),
  path.join("components", "pwa-ui.js"),
  "app.js",
];

// ── minimal test harness ──────────────────────────────────────────────────────
var _pass = 0, _fail = 0;

function makeAssert(failures) {
  return {
    equal: function (a, b, m) {
      if (a != b) // eslint-disable-line eqeqeq -- QUnit equal is non-strict
        failures.push((m ? m + " — " : "") + "expected " + JSON.stringify(b) + ", got " + JSON.stringify(a));
    },
    strictEqual: function (a, b, m) {
      if (a !== b)
        failures.push((m ? m + " — " : "") + "expected " + JSON.stringify(b) + ", got " + JSON.stringify(a));
    },
    notEqual: function (a, b, m) { if (a == b) failures.push(m || "expected values to differ: " + JSON.stringify(a)); }, // eslint-disable-line eqeqeq
    ok: function (v, m) { if (!v) failures.push(m || "expected truthy, got " + v); },
    notOk: function (v, m) { if (v)  failures.push(m || "expected falsy, got "  + v); },
    deepEqual: function (a, b, m) {
      if (JSON.stringify(a) !== JSON.stringify(b))
        failures.push((m || "deepEqual") + "\n    got: " + JSON.stringify(a) + "\n    exp: " + JSON.stringify(b));
    },
    notStrictEqual: function (a, b, m) {
      if (a === b) failures.push(m || "expected different references");
    },
    throws: function (fn, re, m) {
      try { fn(); } catch (e) {
        if (re instanceof RegExp && !re.test(e.message)) failures.push((m || "throws") + ": " + e.message + " !~ " + re);
        return;
      }
      failures.push(m || "expected a throw");
    },
  };
}
function record(name, failures) {
  if (failures.length === 0) {
    _pass++;
  } else {
    _fail++;
    console.error("  FAIL  " + name);
    failures.forEach(function (f) { console.error("         " + f); });
  }
}

function test(name, fn) {
  var failures = [];
  try {
    fn(makeAssert(failures));
    record(name, failures);
  } catch (e) {
    _fail++;
    console.error("  ERROR " + name + ": " + e.message);
  }
}

// testAsync: fn returns a promise (or nothing). Async tests run one after
// another; the summary at the bottom waits for the chain.
var _asyncChain = Promise.resolve();
function testAsync(name, fn) {
  _asyncChain = _asyncChain.then(function () {
    var failures = [];
    return Promise.resolve().then(function () { return fn(makeAssert(failures)); }).then(function () {
      record(name, failures);
    }, function (e) {
      _fail++;
      console.error("  ERROR " + name + ": " + (e && e.message || e));
    });
  });
}

// ── app scripts ───────────────────────────────────────────────────────────────
test("scripts: lib.js + store.js + app-helpers.js + components/*.js + app.js execute without error", function (a) {
  appFiles.forEach(load);
  a.ok(true);
});

// ── reference lists for tests/catalog-checks.js: tools/ref/n5.json → REF.N5 ──
global.REF = {};
fs.readdirSync(path.join(projectDir, "tools", "ref")).filter(function (f) { return /\.json$/.test(f); }).forEach(function (f) {
  global.REF[f.replace(".json", "").toUpperCase()] = JSON.parse(fs.readFileSync(path.join(projectDir, "tools", "ref", f), "utf8"));
});

// ── tests/*.js through a minimal QUnit shim ──────────────────────────────────
// QUnit.module(name, [hooks], [fn]): hooks = { beforeEach, afterEach }, run with
// a fresh `this` per test. A module without fn applies to the tests after it.
(function () {
  var modName = "", hooks = {};
  global.QUnit = {
    module: function (name, a, b) {
      var fn = typeof a === "function" ? a : b;
      modName = name; hooks = typeof a === "object" && a ? a : {};
      if (fn) { fn(); modName = ""; hooks = {}; }
    },
    test: function (name, fn) {
      var h = hooks;
      testAsync(modName + ": " + name, function (assert) {
        var ctx = {};
        if (h.beforeEach) h.beforeEach.call(ctx);
        return Promise.resolve(fn.call(ctx, assert)).then(function () {
          if (h.afterEach) h.afterEach.call(ctx);
        });
      });
    },
  };
  fs.readdirSync(path.join(projectDir, "tests")).filter(function (f) { return /\.js$/.test(f); }).sort().forEach(function (f) {
    load(path.join("tests", f));
  });
}());

// ── React render smoke tests ──────────────────────────────────────────────────
// Call each top-level component with the stub React to verify all referenced
// globals exist. createElement returns {} without recursing into children, so
// only the function body of each component is exercised.
(function () {
  var units     = buildUnits(PLAN, CATALOG);
  var emptySet  = new Set();
  var noop      = function () {};

  test("React render: App() renders without throwing", function (a) {
    try { App(); a.ok(true); } catch (e) { a.ok(false, e.message); }
  });

  test("React render: UnitView() renders every shipped unit (lesson + review)", function (a) {
    units.forEach(function (u) {
      [true, false].forEach(function (furi) {
        try {
          UnitView({ unit: u, units: units, completed: new Set([u.id]), unmarkDone: noop, onQuizResult: noop, setUnit: noop,
            showFurigana: furi, toggleFurigana: noop });
        } catch (e) { a.ok(false, u.id + ": " + e.message); }
      });
    });
    a.ok(units.some(function (u) { return u.kind === "review"; }), "a review unit is rendered");
  });

  // Ticket 50: Today / Settings showed raw keys (pace_standard_n, set_grp_study ...) because t() had no entry.
  test("UI strings: every literal L('key') / t('key') in the app has an entry, and so do the dynamic pace / hint keys", function (a) {
    var missing = {};
    ["app.js"].concat(fs.readdirSync(path.join(projectDir, "components")).map(function (f) { return "components/" + f; })).forEach(function (f) {
      var src = fs.readFileSync(path.join(projectDir, f), "utf8");
      src.replace(/\b(?:L|t)\(\s*["'](\w+)["']/g, function (_, k) { if (!/_$/.test(k) && !UI_STRINGS[k]) missing[k] = f; return _; });
    });
    PACE_MODES.forEach(function (m) { ["_n", "_h"].forEach(function (s) { if (!UI_STRINGS[m.key + s]) missing[m.key + s] = "pace"; }); });
    ["set_lang_h_auto", "set_lang_h_en", "set_lang_h_ja", "set_furi_h_auto", "set_furi_h_true", "set_furi_h_false", "set_grp_study", "set_grp_look", "set_grp_data", "set_grp_about"].forEach(function (k) { if (!UI_STRINGS[k]) missing[k] = "settings"; });
    a.deepEqual(Object.keys(missing), [], "missing UI strings");
  });

  test("React render: PrepGuide() renders every prep and mock guide", function (a) {
    var g = units.filter(function (u) { return u.guide; });
    a.equal(g.length, 7, "seven guided units");
    g.forEach(function (u) {
      try { PrepGuide({ guide: u.guide }); } catch (e) { a.ok(false, u.id + ": " + e.message); }
    });
  });

  test("React render: MockExam() renders the start screen, guided and not, furigana on and off", function (a) {
    var mock = CATALOG.items["x:n5-mock-1"];
    [[true, true], [false, false], [false, true]].forEach(function (c) {
      try { MockExam({ mock: mock, guided: c[0], showFurigana: c[1], onClose: noop }); } catch (e) { a.ok(false, e.message); }
    });
    a.ok(true);
  });

  test("React render: KanjiSection() renders every kanji unit in rows and focus layouts", function (a) {
    var withKanji = units.filter(function (u) { return u.kanji.length > 0; });
    a.ok(withKanji.length > 0, "units with kanji exist");
    withKanji.forEach(function (u) {
      ["rows", "focus"].forEach(function (view) {
        try { KanjiSection({ unit: u, kanjiView: view, setKanjiView: noop }); }
        catch (e) { a.ok(false, u.id + " " + view + ": " + e.message); }
      });
    });
  });

  test("React render: VocabSection() renders every unit with vocabulary", function (a) {
    var withVocab = units.filter(function (u) { return u.vocab.length > 0; });
    a.ok(withVocab.length > 0, "units with vocabulary exist");
    withVocab.forEach(function (u) {
      try { VocabSection({ unit: u }); } catch (e) { a.ok(false, u.id + ": " + e.message); }
    });
  });

  test("React render: DialogueSection() renders collapsed, open and heard; Replay plays every line; open state is remembered", function (a) {
    var withD = units.filter(function (u) { return u.dialogue; });
    a.equal(withD.length, 74, "stages 19 to 104 (pilot + batches 1 to 4) carry a dialogue");
    var orig = { useState: React.useState, useRef: React.useRef, useEffect: React.useEffect, useMemo: React.useMemo, createElement: React.createElement, setTimeout: global.setTimeout };
    var origSpeech = window.speechSynthesis, origUtt = global.SpeechSynthesisUtterance, origLs = global.localStorage, mem = {}, spoken = [];
    global.localStorage = { getItem: function (k) { return k in mem ? mem[k] : null; }, setItem: function (k, v) { mem[k] = String(v); }, removeItem: function (k) { delete mem[k]; } };
    window.speechSynthesis = { getVoices: function () { return [{ name: "Ichiro", lang: "ja-JP", localService: true }, { name: "Keita", lang: "ja-JP", localService: true }]; },
      cancel: function () {}, speak: function (u) { spoken.push(u); if (u.onend) u.onend(); } };
    global.SpeechSynthesisUtterance = function (text) { this.text = text; };
    try {
      withD.forEach(function (u) {
        var state = [], k = 0, els = [], refs = [], r = 0, effects = [];
        React.useState = function (init) { var i = k++; if (!(i in state)) state[i] = typeof init === "function" ? init() : init; return [state[i], function (v) { state[i] = typeof v === "function" ? v(state[i]) : v; }]; };
        React.useRef = function (init) { var i = r++; if (!(i in refs)) refs[i] = { current: init === undefined ? null : init }; return refs[i]; };
        React.useMemo = function (fn) { return fn(); };
        React.useEffect = function (fn) { effects.push(fn); };
        React.createElement = function (type, props) { var el = { type: type, props: props || {}, children: [].slice.call(arguments, 2) }; els.push(el); return el; };
        var render = function () { k = 0; r = 0; els = []; effects = []; DialogueSection({ unit: u, showFurigana: true, toggleFurigana: noop }); effects.forEach(function (fn) { fn(); }); };
        var cls = function (re) { return els.filter(function (el) { return re.test(el.props.className || ""); }); };
        var text = function (el) { return [].concat(el.children).map(function (c) { return typeof c === "string" ? c : c && c.children ? text(c) : ""; }).join(""); };
        try { global.localStorage && global.localStorage.removeItem && global.localStorage.removeItem(DIALOGS_KEY); } catch (e) {}
        render();
        a.equal(cls(/dlg-hero/).length, 1, u.id + ": collapsed hero");
        a.equal(cls(/dlg-msg/).length, 0, u.id + ": no script before Play / Read first");
        a.ok(cls(/dlg-side/).length === 1 && cls(/dlg-cast/).length === 2, u.id + ": cast column present (CSS hides it on a phone)");
        a.ok(!cls(/dlg-heard/).length && /Play/.test(text(cls(/dlg-play/)[0])), u.id + ": Play, not heard yet");
        cls(/dlg-ghost/)[0].props.onClick(); render(); // Read first
        a.equal(cls(/dlg-msg/).length, CATALOG.items[u.dialogue].lines.length, u.id + ": one bubble per line");
        a.equal(spoken.length, 0, u.id + ": Read first is silent");
        a.ok(cls(/dlg-nw|dlg-br/).length > 0, u.id + ": marks rendered");
        cls(/dlg-nw/)[0].props.onClick({ stopPropagation: noop }); render();
        a.ok(cls(/dlg-gloss g-nw/).length === 1, u.id + ": tapping a new word fills the gloss strip");
        cls(/dlg-msg/)[1].props.onClick(); render(); // one line
        a.equal(spoken.length, 1, u.id + ": a tapped line speaks once");
        a.equal(state[1], false, u.id + ": a single line is not a full play-through");
        global.setTimeout = function (fn) { fn(); };
        render();
        cls(/dlg-tool strong/)[0].props.onClick(); render(); // Replay
        global.setTimeout = orig.setTimeout;
        a.equal(spoken.length, 1 + CATALOG.items[u.dialogue].lines.length, u.id + ": Replay speaks every line");
        a.equal(state[1], true, u.id + ": heard after one full play-through");
        cls(/dlg-tool/).filter(function (el) { return text(el) === "Collapse"; })[0].props.onClick(); render();
        a.ok(cls(/dlg-heard/).length === 1 && /Replay/.test(text(cls(/dlg-play/)[0])), u.id + ": collapsed again, Heard, Replay / Read");
        a.deepEqual(dialogState(u.id), { open: false, heard: true, practiced: false }, u.id + ": remembered on this device");
        try { global.localStorage && global.localStorage.removeItem && global.localStorage.removeItem(DIALOGS_KEY); } catch (e) {}
        spoken.length = 0;
      });
    } finally {
      React.useState = orig.useState; React.useRef = orig.useRef; React.useEffect = orig.useEffect; React.useMemo = orig.useMemo; React.createElement = orig.createElement;
      global.setTimeout = orig.setTimeout; window.speechSynthesis = origSpeech; global.SpeechSynthesisUtterance = origUtt; global.localStorage = origLs;
    }
  });

  test("React render: DialoguePractice() shows one swap, grades it, Next / Done, remembers done, never touches the quiz", function (a) {
    var u = units.filter(function (x) { return x.id === "n5.u019"; })[0], it = CATALOG.items[u.dialogue], real = it.remixes;
    var orig = { useState: React.useState, createElement: React.createElement }, origLs = global.localStorage, mem = {};
    global.localStorage = { getItem: function (k) { return k in mem ? mem[k] : null; }, setItem: function (k, v) { mem[k] = String(v); }, removeItem: function (k) { delete mem[k]; } };
    var fixture = [0, 1, 2].map(function (n) { return Object.assign({}, real[0], { scene: "Swap " + (n + 1) + " scene." }); });
    var run = function (remixes) {
      it.remixes = remixes;
      var state = [], k = 0, els = [];
      React.useState = function (init) { var i = k++; if (!(i in state)) state[i] = typeof init === "function" ? init() : init; return [state[i], function (v) { state[i] = typeof v === "function" ? v(state[i]) : v; }]; };
      React.createElement = function (type, props) { var el = { type: type, props: props || {}, children: [].slice.call(arguments, 2) }; els.push(el); return el; };
      var out;
      var render = function () { k = 0; els = []; out = DialoguePractice({ unit: u }); };
      var cls = function (re) { return els.filter(function (el) { return re.test(el.props.className || ""); }); };
      var text = function (el) { return [].concat(el.children).map(function (c) { return typeof c === "string" ? c : Array.isArray(c) ? c.map(function (x) { return typeof x === "string" ? x : x && x.children ? text(x) : ""; }).join("") : c && c.children ? text(c) : ""; }).join(""); };
      var btn = function (label) { return els.filter(function (el) { return el.type === "button" && text(el) === label; })[0]; };
      var build = function (order) { // tap bank tiles for the chunks, in order
        order.forEach(function (c) {
          render();
          var tile = els.filter(function (el) { return el.type === "button" && /qz-tile/.test(el.props.className) && !/used/.test(el.props.className) && text(el) === c && !el.props.disabled; })[0];
          tile.props.onClick();
        });
        render();
      };
      return { render: render, cls: cls, text: text, btn: btn, build: build, state: state, out: function () { return out; }, els: function () { return els; } };
    };
    try {
      delete mem[DIALOGS_KEY];
      // one real swap: no counter, no Next, Done after the right answer
      var p = run(real); p.render();
      a.ok(p.out() && p.cls(/dlg-practice/).length === 1, "card renders");
      a.equal(p.cls(/dlg-pr-count/).length, 0, "single swap: no progress counter");
      a.ok(p.btn("Replay dialog"), "Replay dialog link");
      a.equal(p.btn("Check").props.disabled, true, "Check disabled until the chunks are placed");
      p.build(real[0].answer.slice().reverse()); p.btn("Check").props.onClick(); p.render();
      a.ok(p.cls(/dlg-pr-why bad/).length === 1 && !p.btn("Next swap") && !p.cls(/dlg-pr-ok/).length, "wrong: explanation, no Done");
      a.equal(p.cls(/qz-answerline bad/).length, 1, "wrong tone");
      p.els().filter(function (el) { return /qz-answerline/.test(el.props.className || ""); })[0].children[0][0].props.onClick(); p.render(); // remove a tile: free to rearrange
      a.equal(p.cls(/qz-answerline$/).length, 1, "rearranging clears the verdict");
      p.state[3] = []; p.render(); // picks (state slot 3): start over
      p.build(real[0].answer); p.btn("Check").props.onClick(); p.render();
      a.ok(p.cls(/dlg-pr-why ok/).length === 1 && p.btn("Practise again") && !p.btn("Next swap"), "right: Done check and Practise again, no Next");
      a.ok(/Done/.test(p.text(p.cls(/dlg-pr-ok/)[0])), "Done ✓ shown");
      a.equal(dialogState(u.id).practiced, true, "done remembered on this device");
      var p2 = run(real); p2.render(); // revisit
      a.ok(p2.cls(/dlg-pr-done/).length === 1 && /Done/.test(p2.text(p2.cls(/dlg-pr-ok/)[0])), "revisited stage shows Done ✓");
      p2.btn("Practise again").props.onClick(); p2.render();
      a.equal(dialogState(u.id).practiced, false, "Practise again clears it");
      a.ok(p2.btn("Check"), "back to a swap");
      // three swaps (fixture): progress, Next, Done on the last
      var q = run(fixture); q.render();
      a.equal(q.text(q.cls(/dlg-pr-count/)[0]), "1 / 3", "progress 1 / 3");
      q.build(fixture[0].answer); q.btn("Check").props.onClick(); q.render();
      a.ok(q.btn("Next swap") && !q.cls(/dlg-pr-ok/).length, "right on swap 1: Next swap, not done");
      a.equal(dialogState(u.id).practiced, false, "not done after swap 1");
      q.btn("Next swap").props.onClick(); q.render();
      a.equal(q.text(q.cls(/dlg-pr-count/)[0]), "2 / 3", "progress 2 / 3");
      a.ok(/Swap 2/.test(q.text(q.cls(/dlg-pr-scene/)[0])), "swap 2 scene");
      q.build(fixture[1].answer); q.btn("Check").props.onClick(); q.render(); q.btn("Next swap").props.onClick(); q.render();
      q.build(fixture[2].answer); q.btn("Check").props.onClick(); q.render();
      a.ok(!q.btn("Next swap") && q.cls(/dlg-pr-ok/).length === 1 && q.btn("Practise again"), "last swap: Done ✓ + Practise again");
      a.equal(dialogState(u.id).practiced, true, "done after the last");
      // ungraded: the quiz of the same unit has no reorder and no card for the dialogue
      a.ok(!buildExercises(u).some(function (e) { return e.type === "reorder" || e.itemId === u.dialogue; }), "quiz untouched");
    } finally {
      it.remixes = real; React.useState = orig.useState; React.createElement = orig.createElement; global.localStorage = origLs;
    }
  });

  test("vocabGroups / vocabHasReading: grouping by part of speech; reading column only for kanji words", function (a) {
    var u = units.filter(function (x) { return x.id === "n5.u044"; })[0];
    var g = vocabGroups(u.vocab, u.level);
    a.deepEqual(g.map(function (x) { return x.key; }), ["verb", "adj", "noun"], "verbs, adjectives, nouns");
    a.equal(g.reduce(function (n, x) { return n + x.items.length; }, 0), u.vocab.length, "every word lands in a group");
    var by = function (w) { return u.vocab.filter(function (v) { return v.word === w; })[0]; };
    a.equal(vocabHasReading(by("部屋")), true, "部屋 has a reading to test");
    a.equal(vocabHasReading(by("ある")), false, "kana-only ある does not");
    a.equal(vocabHasReading(by("ドア")), false, "katakana ドア does not");
  });

  test("React render: KanaSection() renders every kana unit in rows and focus layouts", function (a) {
    var withKana = units.filter(function (u) { return u.kana.length > 0; });
    a.ok(withKana.length > 0, "units with kana exist");
    withKana.forEach(function (u) {
      ["rows", "focus"].forEach(function (view) {
        try { KanaSection({ unit: u, kanjiView: view, setKanjiView: noop }); }
        catch (e) { a.ok(false, u.id + " " + view + ": " + e.message); }
      });
    });
  });

  test("kanaChart: gojuon rows by vowel column; youon uses ya/yu/yo; ん drops the headers", function (a) {
    var byId = function (u) { return kanaChart(units.filter(function (x) { return x.id === u; })[0].kana); };
    var k = byId("n5.u002");
    a.deepEqual([k.rows.length, k.cols, k.headers, k.youon], [2, [0, 1, 2, 3, 4], true, false], "か + さ rows");
    var y = byId("n5.u008");
    a.deepEqual([y.cols, y.headers, y.youon], [[0, 2, 4], true, true], "きゃ rows: three columns");
    var w = byId("n5.u005");
    a.equal(w.headers, false, "ん has no vowel column");
    a.equal(w.rows[w.rows.length - 1].filter(Boolean)[0].char, "ん", "ん sits in its own row");
    var look = function (u) { return kanaLookSets(units.filter(function (x) { return x.id === u; })[0].kana); };
    a.ok(look("n5.u002").indexOf("しつ") >= 0, "か/さ rows: し has a look-alike set");
    a.deepEqual(look("n5.u006"), [], "dakuten kana have no look-alike sets");
    var irr = function (id) { return kanaIrregular(CATALOG.items[id]); };
    a.equal(irr("c:し"), "shi, not si", "し is typed si but read shi");
    a.equal(irr("c:か"), null, "か is regular");
    a.ok(/object particle/.test(irr("c:を")), "を uses its catalog note");
    a.equal(irr("c:きゃ"), null, "combos are not flagged");
  });

  test("React render: Overview() renders units + coming-soon levels", function (a) {
    try {
      Overview({ units: units, completed: emptySet, current: 0, suggested: 0, setUnit: noop });
      Overview({ units: units, completed: new Set([units[0].id]), current: units.length - 1, suggested: 1, setUnit: noop, onDiagnostic: noop });
      DiagnosticPanel({ onStart: noop });
      a.ok(true);
    } catch (e) { a.ok(false, e.message); }
  });

  test("React render: StatsView() renders empty and with a reviewed deck + logs", function (a) {
    var origLogs = Store.logs;
    try {
      StatsView({ cards: {}, onReview: noop });
      var cards = {}, now = Date.now(), day = 86400000;
      units.slice(0, 3).forEach(function (u) { srsAddCards(u, cards); });
      Object.keys(cards).forEach(function (id, i) {
        cards[id] = Object.assign({}, cards[id], { interval: [1, 3, 9, 30][i % 4], reps: i % 5, lastReviewedAt: i % 5 ? now - day : 0, due: now + ((i % 9) - 3) * day });
      });
      Store.logs = function () { return [{ _id: 'log:' + localDate() + ':d1', date: localDate(), lessons: ['n5.u001'], quizzes: [], reviews: { count: 12, again: 2 } }]; };
      StatsView({ cards: cards, onReview: noop });
      a.ok(true);
    } catch (e) { a.ok(false, e.message); }
    finally { Store.logs = origLogs; }
  });

  test("React render: MockTrend() draws a dot per attempt (hollow = practice) and the pass line; StatsView shows it only with attempts", function (a) {
    var orig = { ce: React.createElement, snap: Store.snapshot }, els = [];
    React.createElement = function (type, props) { var el = { type: type, props: props || {}, children: [].slice.call(arguments, 2) }; els.push(el); return el; };
    try {
      var d = function (at, total) { return { mockId: "x:n5-mock-1", takenAt: at, estimate: { total: total, passed: total >= 80 } }; };
      MockTrend({ trend: mockTrend([d(3, 120), d(1, 60), d(2, 90)], "N5") });
      var dots = els.filter(function (el) { return el.type === "circle"; });
      a.equal(dots.length, 3, "one dot per attempt");
      a.deepEqual(dots.map(function (el) { return /practice/.test(el.props.className); }), [false, true, true], "oldest is the real attempt, later ones hollow");
      a.ok(els.some(function (el) { return el.type === "line" && /pass-line/.test(el.props.className); }), "pass line");
      var mocksOf = function (list) { Store.snapshot = function () { return Object.assign({}, orig.snap(), { mocks: list }); }; els = []; StatsView({ cards: {}, onReview: noop }); return els; };
      a.ok(!mocksOf([]).some(function (el) { return el.type === MockTrend; }), "no attempts, no chart");
      a.ok(mocksOf([d(1, 60)]).some(function (el) { return el.type === MockTrend; }), "an attempt adds the chart");
    } catch (e) { a.ok(false, e.stack); }
    finally { React.createElement = orig.ce; Store.snapshot = orig.snap; }
  });

  test("React render: AchievementsView() renders empty and with the fixture list", function (a) {
    try {
      AchievementsView({ level: "N5" });
      AchievementsView({ level: "N5", defs: ACHIEVEMENTS, unlocks: {} });
      Stamp({ id: "first-steps", category: "progress", rarity: "common", earned: true, name: "x" });
      a.ok(true);
    } catch (e) { a.ok(false, e.message); }
  });

  test("achievements: groupAchievements counts, orders categories, keeps hidden", function (a) {
    var g = groupAchievements(ACHIEVEMENTS, { "first-steps": 1700000000000, comeback: 1700000001000 });
    a.equal(g.total, 64); a.equal(g.earned, 2);
    a.deepEqual(g.groups.map(function (x) { return x.category; }), ["progress", "habit", "quiz", "mock", "review", "mastery"]);
    a.equal(g.groups.reduce(function (n, x) { return n + x.total; }, 0), 64);
    a.equal(g.groups[0].earned, 1);
    a.equal(ACHIEVEMENTS.filter(function (d) { return d.hidden; }).length, 7);
    a.ok(ACHIEVEMENTS.filter(function (d) { return d.hidden; }).every(function (d) { return d.revealed; }), "hidden rows carry revealed text");
  });

  test("stamp icons: one glyph per achievement id", function (a) {
    ACHIEVEMENTS.forEach(function (d) { a.ok(STAMP_ICONS[d.id], d.id + " has an icon"); });
    a.equal(Object.keys(STAMP_ICONS).length, ACHIEVEMENTS.length);
  });

  test("stamp ink: per-id variation around the category hue, never theme or rarity", function (a) {
    var ids = ACHIEVEMENTS.filter(function (d) { return d.category === "mock"; }).map(function (d) { return d.id; });
    var parts = ids.map(function (id) { return stampInkParts(id, "mock", "n5"); });
    a.deepEqual(stampInkParts(ids[0], "mock", "n5"), parts[0], "same id, same ink");
    parts.forEach(function (p) {
      var dh = Math.abs(((p.h - STAMP_CATS.mock.hue + 540) % 360) - 180);
      a.ok(dh <= STAMP_SPREAD + 0.1, "hue within the spread of the base");
      a.ok(p.l >= 0.56 && p.l <= 0.73 && p.c >= 0.09 && p.c <= 0.19, "lightness and chroma in range");
    });
    a.ok(new Set(parts.map(function (p) { return p.h; })).size > 1, "ids differ in hue");
    a.ok(stampInkParts(ids[0], "mock", "n4").h !== parts[0].h, "level steps the hue");
    a.equal(stampInk(ids[0], "mock", "n5"), "oklch(" + parts[0].l.toFixed(3) + " " + parts[0].c.toFixed(3) + " " + parts[0].h.toFixed(1) + ")");
    a.ok(!/ink-l|ink-d/.test(stampSVG({ id: ids[0], category: "mock", rarity: "common", earned: true, name: "x" })), "no theme variants");
    a.equal(stampSVG({ id: ids[0], category: "mock", rarity: "common", earned: true, name: "x" }, "a"), stampSVG({ id: ids[0], category: "mock", rarity: "common", earned: true, name: "x" }, "a"));
  });

  test("stampSVG: rarity ladder, locked, hidden", function (a) {
    var base = { id: "first-steps", category: "progress", name: "A <b>", earned: true };
    var svg = function (r, o) { return stampSVG(Object.assign({}, base, { rarity: r }, o || {})); };
    a.ok(/10円/.test(svg("common")) && /1000円/.test(svg("legendary")));
    a.ok(!/★/.test(svg("rare")) && /★★★/.test(svg("epic")));
    a.ok(/foil-/.test(svg("legendary")) && !/foil-/.test(svg("epic")), "foil only on earned legendary");
    a.ok(!/foil-/.test(svg("legendary", { earned: false })));
    a.ok(/stroke-dasharray/.test(svg("common", { earned: false })) && /class="stamp locked"/.test(svg("common", { earned: false })));
    a.ok(/aria-label="\?\?\?"/.test(svg("common", { earned: false, hidden: true })));
    a.ok(/aria-label="A &lt;b&gt;"/.test(svg("common")), "name escaped");
    a.ok(/<path d="M2 0h1v1H2z/.test(svg("common")), "glyph from STAMP_ICONS");
  });

  test("React render: ReviewMode() renders empty and with due item cards", function (a) {
    try {
      ReviewMode({ cards: {}, level: "N5", onUpdate: noop });
      var cards = {};
      units.forEach(function (u) { srsAddCards(u, cards); });
      ReviewMode({ cards: cards, level: "N5", onUpdate: noop });
      var made = [], ce0 = React.createElement;
      React.createElement = function () { made.push(JSON.stringify([].slice.call(arguments, 1))); return {}; };
      try { ReviewHub({ cards: {}, level: "N5", filter: "all", setFilter: noop }); } finally { React.createElement = ce0; }
      var hub = made.join("");
      a.ok(hub.indexOf("No cards yet") >= 0 && hub.indexOf("All caught up") < 0 && hub.indexOf("rv-fc") < 0, "empty deck: no 'caught up', no zero chart");
      a.ok(true);
    } catch (e) { a.ok(false, e.message); }
  });

  test("React render: import UI (ImportSettings, QuickSort, PasteImport, known button) renders", function (a) {
    var L = function (k) { return t(k, "N5"); };
    try {
      var cards = {};
      srsAddCards(units[0], cards);
      seedKnownCards(['v:食べる|たべる'], cards, Date.now(), { source: 'paste', batchId: 'paste:x', budget: 50 });
      ImportSettings({ L: L, level: "N5", cards: {}, units: units });
      ImportSettings({ L: L, level: "N5", cards: cards, units: units });
      QuickSort({ L: L, level: "N5", items: quickSortItems(units, "N5"), cards: cards, onClose: noop });
      QuickSort({ L: L, level: "N1", items: [], cards: cards, onClose: noop });
      PasteImport({ L: L, level: "N5", cards: cards });
      ReviewMode({ cards: cards, level: "N5", onUpdate: noop, onKnown: noop });
      Overview({ units: units, completed: emptySet, current: 0, suggested: 0, setUnit: noop, cards: cards });
      a.ok(true);
    } catch (e) { a.ok(false, e.message); }
  });

  test("React render: SettingsView() renders without throwing", function (a) {
    try {
      SettingsView({
        themePrefs: { palette: "ai", theme: "dark" }, setThemePrefs: noop,
        speechRate: 0.85, setSpeechRate: noop,
        level: "N5", uiLang: "auto", setUiLang: noop, sfxOn: true, setSfxOn: noop, furiganaMode: "auto", setFuriganaMode: noop,
        onExport: noop, onImport: noop, onBack: noop,
        sync: Store.syncInfo, savedCreds: null, onConnect: noop, onDisconnect: noop, onSyncNow: noop,
      });
      a.ok(true);
    } catch (e) { a.ok(false, e.message); }
  });

  test("Settings language: no Japanese choice until the ja strings are reviewed; stored ja shows as auto", function (a) {
    var ce0 = React.createElement, made = [];
    React.createElement = function () { made.push(JSON.stringify([].slice.call(arguments, 1))); return {}; };
    try {
      SettingsView({
        themePrefs: { palette: "ai", theme: "dark" }, setThemePrefs: noop, speechRate: 0.85, setSpeechRate: noop,
        level: "N5", uiLang: "ja", setUiLang: noop, sfxOn: true, setSfxOn: noop, furiganaMode: "auto", setFuriganaMode: noop,
        onExport: noop, onImport: noop, onBack: noop,
        sync: Store.syncInfo, savedCreds: null, onConnect: noop, onDisconnect: noop, onSyncNow: noop,
      });
    } finally { React.createElement = ce0; }
    var out = made.join(" ");
    a.strictEqual(UI_JA_READY, false, "ja strings still await native review");
    a.ok(out.indexOf("日本語") < 0, "no 日本語 option");
    a.ok(out.indexOf('"id":"set-ui-lang","className":"theme-select","aria-describedby":"set-ui-lang-hint","value":"auto"') >= 0, "stored ja shown as auto");
  });

  test("Sentence credits: every Tatoeba sentence listed with its JP author and licence, null enAuthor safe", function (a) {
    var rows = tatoebaCredits();
    var ids = Object.keys(CATALOG.items).filter(function (id) { return id.indexOf("s:tatoeba:") === 0; });
    a.equal(rows.length, ids.length, "one row per Tatoeba sentence");
    rows.forEach(function (r) { a.ok(r.s.author && r.s.license && r.s.enId, r.s.id + " has author, licence, enId"); });
    var ce0 = React.createElement, made = [];
    React.createElement = function () { made.push(JSON.stringify([].slice.call(arguments, 1))); return {}; };
    try { SentenceCredits({ L: function (k) { return t(k, "N5"); } }); } finally { React.createElement = ce0; }
    var out = made.join(" ");
    a.ok(out.indexOf("tatoeba.org/en/sentences/show/123124") >= 0, "links the sentence page");
    a.ok(out.indexOf("by null") < 0 && out.indexOf("undefined") < 0, "no null or undefined author text");
  });

  test("Donation jar: links are safe external tabs, logos ship, strings resolve without em dashes", function (a) {
    DONATE_LINKS.forEach(function (l) {
      a.ok(/^https:\/\//.test(l.url), l.id + " url is https");
      a.ok(fs.existsSync(path.join(projectDir, l.logo)), l.id + " logo file exists: " + l.logo);
    });
    ["support_label", "support_pop_title", "support_pop_gloss", "support_pop_body", "support_card_title",
      "support_card_body", "support_rails", "support_thanks"].forEach(function (k) {
      var s = t(k, "N5");
      a.notEqual(s, k, k + " has a string");
      a.ok(s.indexOf("—") < 0, k + " has no em dash");
    });
    try { SupportPopover({ level: "N5" }); DonateButtons({}); a.ok(true); } catch (e) { a.ok(false, e.message); }
  });

  test("React render: InstallCard, UpdateToast, NetLine and the Data persist line render in every state", function (a) {
    var L = function (k) { return t(k, "N5"); };
    // the stub createElement drops children: record every call's arguments instead
    var made;
    function rec(fn) {
      var ce0 = React.createElement; made = [];
      React.createElement = function () { made.push(JSON.stringify([].slice.call(arguments, 1))); return {}; };
      try { return fn(); } finally { React.createElement = ce0; }
    }
    function text() { return made.join(" "); }
    try {
      ["prompt", "ios", "installed", "none", "hidden"].forEach(function (state) {
        var el = rec(function () { return InstallCard({ L: L, state: state, onInstall: noop }); });
        a.ok(text().length > 20, state);
        a.ok(text().indexOf("install-card") >= 0, "card shows in every state: " + state);
        a.strictEqual(text().indexOf(L("install_none")) >= 0, state === "none", "browser-menu hint only when no prompt: " + state);
        a.strictEqual(text().indexOf(L("install_file")) >= 0, state === "hidden", "hosted-version hint only on file://: " + state);
        a.strictEqual(text().indexOf(L("install_btn")) >= 0, state === "prompt" || state === "none" || state === "hidden", "install button (disabled unless installable): " + state);
        a.strictEqual(text().indexOf(L("install_ios")) >= 0, state === "ios", "iOS hint only on iOS: " + state);
        if (state === "installed") a.ok(text().indexOf(L("install_done_title")) >= 0, "installed state");
      });
      [true, false].forEach(function (busy) {
        rec(function () { return UpdateToast({ L: L, busy: busy, onApply: noop, onLater: noop }); });
        a.ok(text().indexOf(L(busy ? "update_wait" : "update_body")) >= 0, "update toast busy=" + busy);
        a.ok(text().indexOf('"disabled":' + busy) >= 0, "reload button disabled=" + busy);
      });
      NetLine({ L: L, online: true }); NetLine({ L: L, online: false });
      ["granted", "denied", "unsupported", null].forEach(function (persist) {
        SettingsView({
          themePrefs: { palette: "ai", theme: "dark" }, setThemePrefs: noop, speechRate: 0.85, setSpeechRate: noop,
          level: "N5", uiLang: "auto", setUiLang: noop, sfxOn: true, setSfxOn: noop, furiganaMode: "auto", setFuriganaMode: noop,
          onExport: noop, onImport: noop, onBack: noop, persist: persist,
          sync: Store.syncInfo, savedCreds: null, onConnect: noop, onDisconnect: noop, onSyncNow: noop,
        });
      });
      a.ok(true);
    } catch (e) { a.ok(false, e.stack); }
  });

  test("React render: SyncSettings() renders off, connecting, connected and error states", function (a) {
    var L = function (k) { return t(k, "N5"); };
    var saved = { url: "https://example.com/jelly", username: "me", password: "pw", remember: true };
    try {
      [{ connected: false, status: "off" }, { connected: false, status: "connecting" },
       { connected: true, status: "synced", summary: { units: 2, cards: 9 } },
       { connected: true, status: "error", error: "sync_err_other", detail: "boom" },
       { connected: false, status: "error", error: "sync_err_auth" }].forEach(function (sync) {
        SyncSettings({ L: L, sync: sync, savedCreds: saved, onConnect: noop, onDisconnect: noop, onSyncNow: noop });
        SyncSettings({ L: L, sync: sync, savedCreds: null, onConnect: noop, onDisconnect: noop, onSyncNow: noop });
      });
      ["off", "connecting", "syncing", "synced", "offline", "error"].forEach(function (st) {
        a.ok(UI_STRINGS["sync_" + st], "status string sync_" + st);
      });
      a.ok(true);
    } catch (e) { a.ok(false, e.message); }
  });

  // Clear all data (ticket 43): ResetZone / ResetDialog render, and resetAllData end to end on the global Store.
  test("React render: ResetZone and ResetDialog; the delete button stays disabled until RESET is typed", function (a) {
    var L = function (k) { return t(k, "N5"); };
    var orig = { useState: React.useState, createElement: React.createElement };
    var els, slots = [], k;
    function draw(fn) {
      els = []; k = 0;
      React.useState = function (init) { var i = k++; if (!(i in slots)) slots[i] = typeof init === "function" ? init() : init; return [slots[i], function (v) { slots[i] = v; }]; };
      React.createElement = function (type, props) { var el = { type: type, props: props || {}, children: [].slice.call(arguments, 2) }; els.push(el); return el; };
      fn();
    }
    function byId(id) { return els.filter(function (e) { return e.props.id === id; })[0]; }
    function byClass(c) { return els.some(function (e) { return e.props.className === c; }); }
    var zone = function (synced) { return function () { ResetZone({ L: L, onExport: noop, onReset: noop, synced: synced }); }; };
    var dialog = function (synced) { return function () { ResetDialog({ L: L, synced: synced, onExport: noop, onReset: noop, onClose: noop }); }; };
    try {
      draw(zone(false));
      a.ok(byId("set-danger") && byId("set-reset"), "section + button");
      a.ok(String(byId("set-reset").props.className).indexOf("danger-btn") >= 0, "danger style");
      a.ok(!byId("reset-go"), "no dialog until the button is pressed");
      slots[0] = true; draw(zone(true));
      a.ok(els.some(function (e) { return e.type === ResetDialog; }), "pressing the button opens the dialog");
      slots = []; draw(dialog(true));
      var dlg = els.filter(function (e) { return e.props.role === "dialog"; })[0];
      a.strictEqual(dlg.props["aria-modal"], "true");
      a.ok(dlg.props["aria-labelledby"] && dlg.props["aria-describedby"], "labelled + described");
      a.strictEqual(byId("reset-go").props.disabled, true, "disabled at start");
      a.ok(byClass("reset-sync"), "sync note shown when connected");
      a.ok(byId("reset-cancel") && byId("reset-backup"), "cancel + backup present");
      slots[0] = "RESE"; draw(dialog(false));
      a.strictEqual(byId("reset-go").props.disabled, true, "still disabled on a partial word");
      a.ok(!byClass("reset-sync"), "no sync note when not connected");
      slots[0] = "reset"; draw(dialog(false));
      a.strictEqual(byId("reset-go").props.disabled, false, "enabled once typed");
    } catch (e) { a.ok(false, e.stack); }
    finally { React.useState = orig.useState; React.createElement = orig.createElement; }
  });

  testAsync("resetAllData: sync off first, store + device keys wiped, device id kept, welcome shows again", function (a) {
    var ls = {};
    var origLs = global.localStorage;
    global.localStorage = { getItem: function (k) { return k in ls ? ls[k] : null; }, setItem: function (k, v) { ls[k] = String(v); }, removeItem: function (k) { delete ls[k]; } };
    var order = [], origDisc = Store.disconnect, origWipe = Store.wipe;
    var done = function () { global.localStorage = origLs; Store.disconnect = origDisc; Store.wipe = origWipe; };
    return Store.init().then(function () {
      Store.putUnit("n5.u001", true); Store.putCards({ x: { id: "x", interval: 1, ease: 2.5, due: 1, reps: 0 } }); Store.logLesson("n5.u001");
      ["jlpt_palette", "jlpt_theme", "jlpt_tts_rate", "jlpt_sfx_mute", "jlpt_ach_seen", "jlpt_welcome_seen", "jlpt_persist", "jlpt_recent_q"].forEach(function (k) { ls[k] = "x"; });
      ls.jlpt_device_id = "dev-1";
      a.ok(!progressIsEmpty(Store.docs()), "has progress");
      Store.disconnect = function () { order.push("disconnect"); return origDisc.apply(Store, arguments); };
      Store.wipe = function () { order.push("wipe"); return origWipe.apply(Store, arguments); };
      scheduleAchievements("live"); // a pending evaluation must not survive the reset
      return resetAllData();
    }).then(function () {
      a.strictEqual(order[0], "disconnect", "sync stopped before the wipe");
      a.ok(order.indexOf("wipe") > 0, "then wiped");
      a.deepEqual(Object.keys(ls), ["jlpt_device_id"], "only the device id is left in localStorage");
      a.strictEqual(Store.docs().length, 0, "store empty");
      a.ok(progressIsEmpty(Store.docs()) && !welcomeSeen(), "welcome shows again");
      a.strictEqual(_achTimer, null, "achievement timer cancelled");
      done();
    }, function (e) { done(); throw e; });
  });

  test("playSfx: no-op without Audio (Node) and never throws", function (a) {
    a.equal(typeof playSfx, "function");
    playSfx("correct"); playSfx("nope");
    a.ok(["ogg", "mp3"].indexOf(SFX_EXT) !== -1, "SFX_EXT is ogg or mp3");
  });

  // Ticket 08 + 35: play whole quizzes through the real Exercises component.
  // A tiny hook emulator (useState slots that persist + re-render) and a
  // createElement that records elements, so the test clicks the same buttons a
  // user would: every exercise type is rendered, answered right or wrong on
  // purpose, misses come back once (re-queue), and onResult's score counts
  // first attempts only. N5 units are also replayed at N4-N1 (all types on).
  test("React render: Exercises plays every exercise type, right and wrong, with correct scoring", function (a) {
    var orig = { useState: React.useState, createElement: React.createElement, useRef: React.useRef, setTimeout: global.setTimeout };
    var origSpeech = window.speechSynthesis;
    // include listen exercises; a speech stub that ends each utterance at once (listen_dialog)
    var spoken = [];
    window.speechSynthesis = { getVoices: function () { return [{ name: "Haruka", lang: "ja-JP", localService: true }, { name: "Ichiro", lang: "ja-JP", localService: true }]; },
      cancel: function () {}, speak: function (u) { spoken.push(u); if (u.onend) u.onend(); } };
    var origUtt = global.SpeechSynthesisUtterance;
    global.SpeechSynthesisUtterance = function (text) { this.text = text; };
    var seen = {}, errors = [], retried = 0, overridden = 0;
    var playable = units.filter(function (u) { return u.kind !== "mock"; }); // mock units run MockExam (played below)
    var sample = playable.filter(function (u, i) { return i % 7 === 0 && u.kind !== "prep"; });
    var pool = playable.concat([].concat.apply([], ["N4", "N3", "N2", "N1"].map(function (lv) {
      return sample.map(function (u) { return Object.assign({}, u, { level: lv }); });
    })));
    var play = function (unit, qi, build) {
      var state = [], k = 0, els = [], result = null;
      React.useState = function (init) {
        var i = k++;
        if (!(i in state)) state[i] = typeof init === "function" ? init() : init;
        return [state[i], function (v) { state[i] = typeof v === "function" ? v(state[i]) : v; }];
      };
      React.createElement = function (type, props) {
        var el = { type: type, props: props || {}, children: [].slice.call(arguments, 2) };
        els.push(el);
        return el;
      };
      var render = function () { k = 0; els = []; Exercises({ unit: unit, build: build, onStart: noop, onFinish: noop, onResult: function (s) { result = s; } }); return els; };
      var find = function (pred) { return els.filter(pred); };
      var cls = function (re) { return function (el) { return re.test(el.props.className || ""); }; };
      render();
      find(cls(/quiz-start-btn/))[0].props.onClick();
      var plan = []; // [ex, answeredRight]
      for (var guard = 0; guard < 80 && !result; guard++) {
        render();
        var exs = state[0], ex = exs[state[1]];
        seen[ex.type] = true;
        // every question that has a question line must show it (the reading split layout once dropped it)
        if ((ex.parts || ex.question) && !/listen/.test(ex.type) && !ex.passageParts && !find(cls(/qz-(sent|big|readq)/)).length)
          errors.push(unit.id + " " + ex.type + ": question line not rendered");
        var right = ex.requeue || (qi + plan.length) % 3 !== 0; // every 3rd first attempt wrong
        plan.push([ex, right]);
        // Choices are picked, then checked (Check button), then the learner presses Continue.
        var click = function (re, n) { var b = find(cls(re))[n || 0]; if (!b) throw new Error("no " + re); b.props.onClick(); render(); };
        if (ex.type === "listen_dialog") {
          // transcript hidden until checked; Play speaks the whole script, reply buttons each speak
          if (find(cls(/qz-script/)).length) errors.push(unit.id + ": listening transcript shown before answering");
          var before = spoken.length;
          click(/qz-play/);
          if (spoken.length - before < ex.script.length) errors.push(unit.id + ": Play spoke " + (spoken.length - before) + " of " + ex.script.length + " lines");
          if (ex.spokenOptions) click(/qz-rp/);
          click(/qz-opt( |$)/, right ? ex.correct : (ex.correct + 1) % ex.options.length);
          if (find(cls(/qz-script/)).length) errors.push(unit.id + ": transcript shown before Check");
          click(/qz-check/);
          if (!find(cls(/qz-script/)).length) errors.push(unit.id + ": no transcript after answering");
        } else if (ex.options && typeof ex.correct === "number" && ex.type !== "pair_match") {
          var pick = right ? ex.correct : (ex.correct + 1) % ex.options.length;
          if (answerIsRight(ex, pick) !== right) errors.push(unit.id + " " + ex.form + ": answerIsRight disagrees on option " + pick);
          if (find(cls(/qz-check/))[0].props.disabled !== true) errors.push(unit.id + ": Check enabled before a choice");
          click(/qz-opt( |$)/, pick);
          if (find(cls(/qz-check/))[0].props.disabled) errors.push(unit.id + ": Check still disabled after a choice");
          if (state[7].length !== plan.length - 1) errors.push(unit.id + ": a choice counted before Check");
          click(/qz-check/);
        } else if (ex.type === "pair_match") {
          var meaningOf = {};
          ex.pairs.forEach(function (p) { meaningOf[p[0]] = p[1]; });
          ex.items.forEach(function (w, i) { // tap the word, then a meaning, like a user
            var oi = ex.options.indexOf(meaningOf[w]);
            click(/qz-pc l/, i);
            click(/qz-pc r/, right ? oi : (oi + 1) % ex.options.length);
          });
          click(/qz-check/);
        } else {
          var input = function (v) { find(function (el) { return el.type === "input"; })[0].props.onChange({ target: { value: v } }); render(); };
          if (ex.others && ex.others.length) {
            // another reading of the same spelling (人: じん for ひと): a notice and a retry, not a miss
            var before = state[7].length;
            input(ex.others[0].reading);
            click(/qz-check/);
            if (state[7].length !== before) errors.push(unit.id + " " + ex.form + ": homograph reading " + ex.others[0].reading + " scored");
            if (!find(cls(/qz-other/)).length) errors.push(unit.id + " " + ex.form + ": no homograph notice");
            retried++;
          }
          var typed = right ? ex.answers[0] : "zzz";
          if (answerIsRight(ex, typed) !== right) errors.push(unit.id + " " + ex.form + ": typed '" + typed + "' scored wrong way");
          input(typed);
          click(/qz-check/);
          if (!right && acceptedAnswers(ex).length > 1 && !find(function (el) { return el.children.indexOf("Accepted answers: ") >= 0; }).length) {
            errors.push(unit.id + " " + ex.form + ": accepted answers not listed");
          }
          if (!right && (overridden++ % 2 === 0)) { // "I was right" on every other typed miss
            click(/qz-override/);
            right = true;
            plan[plan.length - 1][1] = true;
          }
        }
        var res = state[7]; // Exercises' results slot
        if (res[res.length - 1] !== right) errors.push(unit.id + "@" + unit.level + " " + ex.form + ": answered " + (right ? "right" : "wrong") + ", scored the other way");
        if (!find(cls(/qz-dock (right|wrong)/)).length) errors.push(unit.id + ": no feedback dock after Check");
        click(/qz-next/);
      }
      render(); // finish screen
      if (!result) return errors.push(unit.id + "@" + unit.level + ": quiz never finished");
      var first = plan.filter(function (p) { return !p[0].requeue; });
      var wrongFirst = first.filter(function (p) { return !p[1]; });
      if (result.total !== first.length || result.right !== first.length - wrongFirst.length) {
        errors.push(unit.id + "@" + unit.level + ": score " + result.right + "/" + result.total + ", expected " + (first.length - wrongFirst.length) + "/" + first.length);
      }
      var sp = result.split, part = function (p) { return p.right / p.total >= p.need - 1e-9; };
      if (result.passed !== (sp ? (!sp.read.total || part(sp.read)) && (!sp.meaning.total || part(sp.meaning)) : quizPassed(result.right, result.total, unit.kind))) errors.push(unit.id + ": passed flag");
      if (sp && !find(cls(/qz-parts/)).length) errors.push(unit.id + ": no per-part score on a kana quiz");
      var requeued = plan.filter(function (p) { return p[0].requeue; }).length;
      if (requeued !== wrongFirst.length) errors.push(unit.id + "@" + unit.level + ": " + wrongFirst.length + " misses, " + requeued + " re-asked");
      wrongFirst.forEach(function (p) { if (p[0].itemId && result.missed.indexOf(p[0].itemId) < 0) errors.push(unit.id + ": miss not flagged " + p[0].itemId); });
      if (!find(cls(/qz-verdict/)).length) errors.push(unit.id + ": no pass/fail verdict");
    };
    try {
      global.setTimeout = function (fn) { fn(); };
      React.useRef = function () { return { current: null }; };
      pool.forEach(function (unit, qi) {
        try { play(unit, qi); } catch (e) { errors.push(unit.id + "@" + unit.level + ": " + e.message); }
      });
      // a guaranteed homograph retry (人: じん for ひと): the random sample may hold none
      var hu = playable.filter(function (u) { return u.kind === "lesson"; })[0], hctx = quizContext(hu), hex = null;
      catalogOf("vocab").some(function (v) {
        var fm = formsFor(v, hctx).filter(function (x) { return x.name === "enToJp"; })[0], e = fm && fm.make();
        return e && e.others && e.others.length && (hex = e);
      });
      a.ok(hex, "a homograph typed exercise exists");
      if (hex) try { play(hu, 1, function () { return [hex]; }); } catch (e) { errors.push("homograph: " + e.message); }
      // authored mondai (iikae, bunshou) as a mock would feed them (ticket 11 → 18)
      var mock = { id: "n5.mock", kind: "mock", level: "N5", index: units.length - 1 };
      var mondai = function (type) {
        return function (u) {
          var ctx = quizContext(u);
          return [].concat.apply([], catalogOf("mondai").filter(function (m) { return m.type === type; }).slice(0, 4).map(function (m) { return mondaiQuestions(type, m, ctx); }));
        };
      };
      ["iikae", "bunshou"].forEach(function (type, i) {
        try { play(mock, i, mondai(type)); } catch (e) { errors.push("mock " + type + ": " + e.message); }
      });
    } finally {
      React.useState = orig.useState;
      React.createElement = orig.createElement;
      React.useRef = orig.useRef;
      global.setTimeout = orig.setTimeout;
      window.speechSynthesis = origSpeech;
      global.SpeechSynthesisUtterance = origUtt;
    }
    a.equal(errors.length, 0, errors.slice(0, 8).join("\n"));
    a.ok(retried > 0, retried + " homograph retries played");
    a.ok(overridden > 1, Math.ceil(overridden / 2) + " \"I was right\" overrides played");
    // ponytail: no "reading" (passage items, ticket 15); tap-to-order "reorder" stays unused
    // (★ sentence composition is the MC "order" type)
    ["mc", "listen", "typing", "conjugation", "gap", "pair_match", "fill_blank", "synonym", "kanji_reading",
      "kanji_yomi", "hyouki", "bunmyaku", "order", "iikae", "bunshou", "listen_dialog"].forEach(function (t) {
      a.ok(seen[t], "type " + t + " was played");
    });
  });

  // Ticket 18: sit the whole diagnostic mock through the real MockExam component — hook emulator
  // with effects, a fake clock and a captured setInterval, a speech stub. Part 1: some right, one
  // wrong, one flagged, finished by hand; part 2 all right; part 3: one replay used up, two answers,
  // then the clock runs out. The saved mock: doc must score exactly that.
  testAsync("MockExam: full diagnostic playthrough (navigation, flags, replay limit, time-out, saved result)", function (a) {
    var before = Store.docs();
    var orig = { useState: React.useState, createElement: React.createElement, useRef: React.useRef, useEffect: React.useEffect,
      setInterval: global.setInterval, clearInterval: global.clearInterval };
    var origSpeech = window.speechSynthesis, origUtt = global.SpeechSynthesisUtterance;
    var spoken = 0;
    _scriptBusy = false; // speakScript defers while a script is mid-play (see app-helpers.js); start clean
    window.speechSynthesis = { getVoices: function () { return []; }, cancel: function () {}, speak: function (u) { spoken++; if (u.onend) u.onend(); } };
    global.SpeechSynthesisUtterance = function (text) { this.text = text; };
    var clock = 1000000, intervals = [], store = {}, origLS = global.localStorage;
    global.localStorage = { getItem: function (k) { return k in store ? store[k] : null; }, setItem: function (k, v) { store[k] = String(v); }, removeItem: function (k) { delete store[k]; } };
    var mock = CATALOG.items["x:n5-mock-3"], taken = null;
    var state = [], refs = [], deps = [], cleanups = [], k = 0, r = 0, e = 0, els = [];
    React.useState = function (init) {
      var i = k++;
      if (!(i in state)) state[i] = typeof init === "function" ? init() : init;
      return [state[i], function (v) { state[i] = typeof v === "function" ? v(state[i]) : v; }];
    };
    React.useRef = function (init) { var i = r++; if (!(i in refs)) refs[i] = { current: init === undefined ? null : init }; return refs[i]; };
    var pending = [];
    React.useEffect = function (fn, d) {
      var i = e++;
      if (deps[i] && d && d.every(function (x, j) { return x === deps[i][j]; })) return;
      deps[i] = d;
      pending.push(function () { if (cleanups[i]) cleanups[i](); cleanups[i] = fn(); });
    };
    React.createElement = function (type, props) {
      var el = { type: type, props: props || {}, children: [].slice.call(arguments, 2) };
      els.push(el);
      return el;
    };
    global.setInterval = function (fn) { intervals.push(fn); return intervals.length; };
    global.clearInterval = function (id) { intervals[id - 1] = null; };
    var render = function () {
      k = 0; r = 0; e = 0; els = []; pending = [];
      MockExam({ mock: mock, now: function () { return clock; }, onTaken: function (x) { taken = x; } });
      pending.forEach(function (f) { f(); });
      return els;
    };
    var find = function (re) { return els.filter(function (el) { return re.test(el.props.className || ""); }); };
    var click = function (re, n) { var b = find(re)[n || 0]; if (!b) throw new Error("no " + re); b.props.onClick(); render(); };
    try {
      var secs = mockSections(mock), want = {};
      render();
      var text = function (el) { return [].concat(el.children).join(""); };
      var docs0 = Store.snapshot().mocks.length;
      // quit: the layer opens, ✕ asks first, "Keep going" closes the dialog, "Quit" discards the attempt
      click(/quiz-start-btn/);
      a.ok(find(/^ql$/).length === 1 && find(/qz-dock/).length === 1, "a part runs on the quiz layer with a dock");
      click(/qz-opt( |$)/, 0);
      click(/qz-x/);
      a.ok(find(/qz-dlg/).length === 1, "✕ asks before quitting");
      click(/qz-gb$/);
      a.ok(!find(/qz-dlg/).length && find(/qz-opt( |$)/).length, "Keep going closes the dialog");
      click(/qz-x/);
      click(/qz-btn bad/);
      a.ok(find(/quiz-start-btn/).length === 1 && !find(/qz-opt( |$)/).length && !find(/^ql$/).length, "quit: back on the start screen");
      a.equal(Store.snapshot().mocks.length, docs0, "quit saves nothing");
      a.ok(!taken, "quit is not a taken test");
      a.equal(intervals.filter(Boolean).length, 0, "quit stops the part clock");
      click(/quiz-start-btn/);
      a.ok(find(/qz-opt( |$)/).every(function (o) { return o.props.className.indexOf("sel") < 0; }), "a fresh attempt starts blank");
      // reload mid-part: the attempt is offered back (Resume keeps answers + the same deadline), Discard drops it
      click(/qz-opt( |$)/, 2);
      a.ok(store.jlpt_mock_run, "the running attempt is kept on this device");
      var runDeadline = JSON.parse(store.jlpt_mock_run).deadline;
      state = []; refs = []; deps = []; cleanups = [];
      render();
      a.ok(find(/mock-resume/).length === 1 && !find(/^ql$/).length, "after a reload the start screen offers Resume");
      click(/quiz-start-btn/, 0);
      a.ok(find(/qz-opt( |$)/)[2].props.className.indexOf("sel") >= 0 && JSON.parse(store.jlpt_mock_run).deadline === runDeadline, "resumed: answer and deadline kept");
      state = []; refs = []; deps = []; cleanups = [];
      render();
      click(/link-btn/, 0); // Discard
      a.ok(!find(/mock-resume/).length && !store.jlpt_mock_run, "discard forgets the attempt");
      click(/quiz-start-btn/);
      // part 1 (vocab): answer every question; question 2 wrong, question 3 flagged
      secs[0].questions.forEach(function (ex, i) {
        if (i > 0) click(/qz-nextq|qz-finish/);
        click(/qz-opt( |$)/, i === 1 ? (ex.correct + 1) % ex.options.length : ex.correct);
        if (i === 2) click(/qz-flag/);
      });
      a.ok(find(/qz-finish/).length === 1 && !find(/qz-nextq/).length, "the last question offers Finish, not Next");
      a.ok(/ \/ .* · 1 flagged/.test(text(find(/qz-qlist/)[0])), "question list button counts flagged questions");
      click(/qz-qlist/);
      a.ok(find(/qz-sheet/).length && find(/qz-qn/)[2].props.className.indexOf("flag") >= 0, "flag shows in the question sheet");
      a.ok(find(/qz-qn/)[0].props.className.indexOf("ans") >= 0 && find(/qz-qn/)[secs[0].questions.length - 1].props.className.indexOf("now") >= 0, "sheet: answered and current");
      click(/qz-qn/, 1);
      a.ok(!find(/qz-sheet/).length, "jumping closes the sheet");
      a.ok(find(/qz-opt( |$)/)[(secs[0].questions[1].correct + 1) % 4].props.className.indexOf("sel") >= 0, "jump lands on the question, answer kept");
      click(/qz-prev/);
      click(/qz-nextq/); click(/qz-nextq/);
      click(/qz-qlist/);
      click(/qz-sheet-end/); // early finish from the sheet (nothing blank in part 1: no confirm)
      a.ok(find(/quiz-start-btn/).length === 1 && !find(/qz-opt( |$)/).length && find(/^ql$/).length === 1, "between parts: layer with the start button, no questions");
      click(/quiz-start-btn/);
      // part 2 (grammar + reading): all right except the last question, left blank; finished from the dock
      var q2 = secs[1].questions;
      q2.forEach(function (ex, i) {
        if (i > 0) click(/qz-nextq/);
        if (i < q2.length - 1) click(/qz-opt( |$)/, ex.correct);
      });
      a.ok(/(1 unanswered)/.test(text(find(/qz-finish/)[0])), "dock Finish shows the unanswered count");
      click(/qz-finish/);
      a.ok(find(/qz-dlg/).length === 1 && !find(/^ql$/).length === false, "finishing with a blank asks first");
      click(/qz-gb$/);
      a.ok(!find(/qz-dlg/).length && find(/qz-opt( |$)/).length, "Keep answering stays in the part");
      click(/qz-finish/);
      click(/qz-btn bad/);
      a.ok(/Part 2: 21 answered, 1 blank/.test(text(find(/mock-done/)[0]).replace(/false/g, "").replace(/^.*?Part 2/, "Part 2")) || /1 blank/.test(text(find(/mock-done/)[0])), "between parts: one-line summary of the part just ended");
      click(/quiz-start-btn/);
      // part 3 (listening): play twice (1 replay), then the button is spent; two answers, then time out
      var before3 = spoken;
      click(/qz-play( |$)/); click(/qz-play( |$)/);
      a.ok(spoken > before3, "the dialogue is spoken");
      a.ok(find(/qz-play( |$)/)[0].props.disabled, "no third play");
      click(/qz-opt( |$)/, secs[2].questions[0].correct);
      click(/qz-nextq/);
      click(/qz-opt( |$)/, secs[2].questions[1].correct);
      a.ok(!taken, "not finished before time is up");
      var started3 = clock, timerCls = function () { return find(/qz-timer/)[0].props.className; };
      clock = started3 + (secs[2].seconds - 299) * 1000; intervals.filter(Boolean).slice(-1)[0](); render();
      a.ok(/warn/.test(timerCls()) && !/low/.test(timerCls()), "under 5 minutes: warning colour");
      clock = started3 + (secs[2].seconds - 59) * 1000; intervals.filter(Boolean).slice(-1)[0](); render();
      a.ok(/low/.test(timerCls()), "under 1 minute: red");
      clock += secs[2].seconds * 1000 + 1;
      intervals.filter(Boolean).slice(-1)[0]();
      render();
      a.ok(taken, "time-out ends the test");
      a.ok(find(/mock-done timeup/).length === 1 && /Time ran out/.test(JSON.stringify(find(/mock-done timeup/)[0].children)), "time-up is announced on the result");
      want = { vocab: [secs[0].questions.length - 1, secs[0].questions.length], grammar: [10, 10], reading: [3, 4], listening: [2, secs[2].questions.length] };
      a.deepEqual(taken.parts, want, "scored: one vocab miss, unanswered listening wrong");
      a.deepEqual(taken.estimate, mockEstimate({ vocab: want.vocab[0] / want.vocab[1], grammar: 1, reading: 3 / 4, listening: 2 / want.listening[1] }));
      a.ok(find(/mr-card/).length && find(/mr-q$/).length, "results: score card + missed rows");
      a.equal(find(/mr-tile/).length, 14, "results: a tile per question type");
      a.ok(find(/mr-again/).length === 1, "results offer Take again");
      a.ok(find(/mr-verdict/).length === 1 && find(/mr-ring/).length === 1, "results: verdict + score ring in the score slip");
      a.ok(find(/mr-card (pass|warn|fail)/)[0].props.className.indexOf({ likely: "pass", borderline: "warn", unlikely: "fail" }[mockOutlook(taken.parts, mock.level).verdict]) > 0, "score card follows mockOutlook");
      a.ok(!store.jlpt_mock_run, "finishing clears the running attempt");
      var saved = Store.snapshot().mocks.filter(function (m) { return m.mockId === mock.id; });
      a.equal(saved.length, 1, "one mock: doc saved");
      a.ok(STORE_ID_RE.test("mock:" + saved[0].mockId + ":" + saved[0].takenAt), "doc id shape");
      // a later visit lists the attempt in the history
      state = []; refs = []; deps = []; cleanups = [];
      render();
      a.ok(find(/link-btn/).length === 1, "history lists the attempt");
      a.ok(find(/ms-res/).some(function (el) { return el.children[0] === "First attempt"; }), "history: the only sitting is the first attempt");
      // ticket 49: an earlier sitting makes this one practice, in the history and on its result
      Store.putMock(Object.assign({}, taken, { takenAt: taken.takenAt - 5000 }));
      render();
      a.ok(find(/ms-res/).some(function (el) { return el.children[0] === "Practice 2"; }), "history: the later sitting is marked practice");
      click(/link-btn/, 0);
      a.ok(find(/mock-practice/).length === 1, "result of a practice attempt says so");
    } catch (err) {
      a.ok(false, err.stack);
    } finally {
      React.useState = orig.useState; React.createElement = orig.createElement; React.useRef = orig.useRef; React.useEffect = orig.useEffect;
      global.setInterval = orig.setInterval; global.clearInterval = orig.clearInterval; global.localStorage = origLS;
      window.speechSynthesis = origSpeech; global.SpeechSynthesisUtterance = origUtt;
    }
    return Store.replaceAll(before);
  });

  // app.js: a passed quiz → markUnitsDone; cap + pending + learn extra + miss flag (Q31/Q34)
  testAsync("markUnitsDone: cards up to today's cap, rest pending; learn extra releases; misses flagged", function (a) {
    var before = Store.docs();
    var lessons = UNITS.filter(function (x) { return x.kind === "lesson"; }).slice(0, 2);
    return Store.replaceAll([]).then(function () {
      markUnitsDone([lessons[0].id]);
      var s = Store.snapshot();
      a.ok(s.completed.indexOf(lessons[0].id) >= 0, "unit done");
      a.equal(Object.keys(s.srsCards).length, Math.min(dailyCardCap(1, UNITS, lessons[0].index), unitItems([lessons[0]]).length));
      markUnitsDone([lessons[1].id]);
      s = Store.snapshot();
      a.equal(Object.keys(s.srsCards).length + s.pendingCards.length, unitItems(lessons).length, "every item is a card or pending");
      a.ok(s.pendingCards.length > 0, "a second unit the same day queues its cards");
      var waiting = s.pendingCards.length;
      a.equal(releasePendingCards(false), 0, "no room left today");
      a.ok(releasePendingCards(true) > 0, "learn extra releases");
      a.ok(Store.snapshot().pendingCards.length < waiting);
      var id = Object.keys(Store.snapshot().srsCards)[0];
      flagMissedItems([id]);
      a.equal(Store.snapshot().srsCards[id].ease, 2.3, "missed item flagged");
    }).then(function () { return Store.replaceAll(before); });
  });

  // ── Welcome + placement UI (ticket 39) ──────────────────────────────────────
  // seq(React, state, refs): feed useState / useRef from a call-order list (the stub React has no state),
  // run fn, restore. State order in PlacementFlow: scope, screen, cur, qi, res, pos, leaving; refs: eng, answers, layer, key.
  function withState(states, refs, fn) {
    var us = React.useState, ur = React.useRef, i = 0, j = 0;
    React.useState = function (init) { var k = i++; return [k < states.length ? states[k] : (typeof init === "function" ? init() : init), noop]; };
    React.useRef = function () { var k = j++; return refs && refs[k] ? refs[k] : { current: null }; };
    try { return fn(); } finally { React.useState = us; React.useRef = ur; }
  }
  // a learner who knows stages 1..known (1-based, teaching stages), optionally missing `hole`
  function scriptedPlacement(scope, known, hole) {
    var s = placementStart(scope, function () { return 0.5; }), set, n = 0, num = {};
    s.stages.forEach(function (u, i) { num[u.id] = i + 1; });
    while ((set = placementNext(s))) {
      if (++n > 60) throw new Error("runaway");
      var ok = num[set.stageId] <= known && num[set.stageId] !== hole;
      placementAnswer(s, set.questions.map(function (q) { return ok ? (q.options && typeof q.correct === "number" ? q.correct : q.answers[0]) : null; }));
    }
    return s;
  }

  test("React render: WelcomeView() renders first-launch and 'again' variants", function (a) {
    try {
      [false, true].forEach(function (again) {
        WelcomeView({ level: "N5", units: units, pace: 1, setPace: noop, examDate: null, setExamDate: noop, again: again, onZero: noop, onFind: noop, onSkip: noop });
      });
      WelcomeView({ level: "N5", units: units, pace: 3, setPace: noop, examDate: "2020-01-01", setExamDate: noop, onZero: noop, onFind: noop, onSkip: noop });
      a.ok(true);
    } catch (e) { a.ok(false, e.message); }
  });

  test("React render: PlacementQuestion() renders every question type the engine builds", function (a) {
    var seen = {};
    // a gap is picked only for some grammar points (P0-4), so a pass may miss it: retry a few passes
    for (var pass = 0; pass < 8 && !(seen.typing && seen.gap && seen.order && seen.mc); pass++) {
      units.filter(function (u) { return u.kind === "kana" || u.kind === "lesson"; }).forEach(function (u) {
        placementQuestions(u, 2, []).forEach(function (ex) {
          seen[ex.type] = true;
          try { PlacementQuestion({ ex: ex, level: "N5", onAnswer: noop }); } catch (e) { a.ok(false, u.id + " " + ex.type + ": " + e.message); }
        });
      });
    }
    a.ok(seen.typing && seen.gap && seen.order && seen.mc, "typed, gap, order and mc all rendered: " + Object.keys(seen));
  });

  test("React render: PlacementFlow() renders intro, a test question, and the result (incl. retake + holes)", function (a) {
    try {
      var props = { units: units, completed: new Set(), level: "N5", onApply: noop, onClose: noop };
      PlacementFlow(props);
      var s = scriptedPlacement(units, 20, 8), cur = placementNext(placementStart(units));
      withState([units, "test", cur, 0], [{ current: placementStart(units) }, { current: [] }], function () { return PlacementFlow(props); });
      var res = placementResult(s), pos = s.stages.map(function (u) { return u.id; }).indexOf(res.startStageId);
      [pos, 0, 3].forEach(function (p) {
        withState([units, "result", null, 0, res, p], [{ current: s }, { current: [] }], function () { return PlacementFlow(props); });
      });
      var done = new Set(units.filter(function (u) { return u.index < 10; }).map(function (u) { return u.id; }));
      var scope = placementScope(units, done), s2 = scriptedPlacement(scope, 4);
      withState([scope, "intro"], null, function () { return PlacementFlow(Object.assign({}, props, { completed: done })); });
      withState([scope, "result", null, 0, placementResult(s2), 4], [{ current: s2 }, { current: [] }], function () { return PlacementFlow(Object.assign({}, props, { completed: done })); });
      var all = scriptedPlacement(units, 999);
      withState([units, "result", null, 0, placementResult(all), all.stages.length], [{ current: all }, { current: [] }], function () { return PlacementFlow(props); });
      a.ok(true);
    } catch (e) { a.ok(false, e.stack); }
  });

  test("React render: SettingsView() shows the starting-point section (open and nothing left to skip)", function (a) {
    try {
      [true, false].forEach(function (open) {
        SettingsView({
          themePrefs: { palette: "ai", theme: "dark" }, setThemePrefs: noop, speechRate: 0.85, setSpeechRate: noop,
          level: "N5", uiLang: "auto", setUiLang: noop, sfxOn: true, setSfxOn: noop, furiganaMode: "auto", setFuriganaMode: noop,
          onExport: noop, onImport: noop, onBack: noop, placementOpen: open, onPlacement: noop, onWelcome: noop,
          sync: Store.syncInfo, savedCreds: null, onConnect: noop, onDisconnect: noop, onSyncNow: noop,
        });
      });
      a.ok(true);
    } catch (e) { a.ok(false, e.message); }
  });

  // Headless end to end: a scripted learner through the real engine, then the real apply path
  // (app.js applyPlacement → Store). Asserts the docs the store ends up holding.
  testAsync("placement end to end: scripted learner → apply → unit docs (skipped), cards (one undoable batch), holes unmarked", function (a) {
    var before = Store.docs();
    var teach = units.filter(function (u) { return u.kind === "kana" || u.kind === "lesson"; });
    var s = scriptedPlacement(units, 40, 8), res = placementResult(s);
    var plan = placementApply(res, units);
    return Store.replaceAll([]).then(function () {
      a.ok(progressIsEmpty(Store.docs()), "store starts empty");
      var out = applyPlacement(res);
      var snap = Store.snapshot(), docs = Store.docs();
      a.equal(out.marked, plan.doneIds.length);
      a.ok(out.marked >= 30 && out.marked <= 40, "about 40 stages marked: " + out.marked);
      a.deepEqual(snap.completed.slice().sort(), plan.doneIds.slice().sort(), "exactly the passed stages are done");
      a.deepEqual(snap.skipped.slice().sort(), plan.doneIds.slice().sort(), "…all flagged skipped");
      a.ok(snap.skipped.indexOf(teach[7].id) < 0 && res.holeStageIds.indexOf(teach[7].id) >= 0, "the hole stage stays unmarked");
      a.ok(!progressIsEmpty(docs), "progress is no longer empty (welcome never returns)");
      a.ok(docs.filter(function (d) { return /^log:/.test(d._id); }).length === 0, "skipped stages write no lesson log");
      var cards = snap.srsCards, ids = Object.keys(cards);
      a.equal(ids.length, plan.cardItems.length, "one card per item of the passed stages, none for others");
      a.ok(ids.every(function (id) { return cards[id].imported && cards[id].imported.source === "placement" && cards[id].lastReviewedAt === 0; }), "known cards, unreviewed");
      var batches = importBatches(cards);
      a.equal(batches.length, 1, "one batch in Settings → Already known");
      a.equal(batches[0].source, "placement");
      a.equal(snap.pendingCards.length, 0, "no pending queue");
      var again = applyPlacement(res);
      a.equal(again.cards, 0, "applying twice adds no cards");
      undoKnown(batches[0].batchId);
      a.equal(Object.keys(Store.snapshot().srsCards).length, 0, "undo takes the cards back");
      a.equal(Store.snapshot().completed.length, plan.doneIds.length, "stages stay marked (un-mark per stage as today)");
    }).then(function () { return Store.replaceAll(before); });
  });

  test("React render: ErrorBoundary renders children when no error", function (a) {
    try {
      var eb = new ErrorBoundary({ children: {} });
      eb.state = { hasError: false, error: null };
      eb.props = { children: {} };
      var out = eb.render();
      a.ok(out !== null && out !== undefined, "ErrorBoundary.render() returns children");
    } catch (e) { a.ok(false, e.message); }
  });

  test("React render: ErrorBoundary getDerivedStateFromError sets hasError", function (a) {
    try {
      var err = new Error("test crash");
      var state = ErrorBoundary.getDerivedStateFromError(err);
      a.ok(state.hasError === true, "hasError is true");
      a.ok(state.error === err, "error is set");
    } catch (e) { a.ok(false, e.message); }
  });
}());

// ── safeSave / storageAvailable ───────────────────────────────────────────────
(function () {
  // Minimal event emitter stubs for window (Node has no CustomEvent/dispatchEvent)
  var _listeners = {};
  global.window.addEventListener = function (type, fn) {
    (_listeners[type] = _listeners[type] || []).push(fn);
  };
  global.window.removeEventListener = function (type, fn) {
    _listeners[type] = (_listeners[type] || []).filter(function (f) { return f !== fn; });
  };
  global.window.dispatchEvent = function (evt) {
    (_listeners[evt.type] || []).forEach(function (fn) { fn(evt); });
  };
  global.CustomEvent = function (type, init) { this.type = type; this.detail = init && init.detail; };

  test("safeSave: returns ok:true on success", function (a) {
    var result = safeSave('__test_safesave__', 'hello');
    a.equal(result.ok, true, "ok is true");
    a.equal(result.error, null, "error is null");
  });

  test("safeSave: returns ok:false and fires event when setItem throws", function (a) {
    var fired = false;
    global.window.addEventListener('storage-save-error', function onErr() {
      fired = true;
      global.window.removeEventListener('storage-save-error', onErr);
    });
    var orig = localStorage.setItem;
    localStorage.setItem = function () { throw new Error("QuotaExceededError"); };
    var result = safeSave('__test_fail__', 'x');
    localStorage.setItem = orig;
    a.equal(result.ok, false, "ok is false on failure");
    a.ok(result.error, "error message is set");
    a.ok(fired, "storage-save-error event was dispatched");
  });

  test("storageAvailable: returns boolean", function (a) {
    var avail = storageAvailable();
    a.ok(typeof avail === 'boolean', "returns a boolean");
  });
}());

// ── sanitizeSvg ───────────────────────────────────────────────────────────────
(function () {
  test("sanitizeSvg: passes clean SVG through unchanged", function (a) {
    var clean = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>';
    a.equal(sanitizeSvg(clean), clean, "clean SVG unchanged");
  });

  test("sanitizeSvg: strips <script> blocks", function (a) {
    var svg = '<svg><script>alert(1)</script><path d="M0 0"/></svg>';
    var result = sanitizeSvg(svg);
    a.ok(result.indexOf('<script>') === -1, "script tag removed");
    a.ok(result.indexOf('alert') === -1, "script content removed");
    a.ok(result.indexOf('<path') !== -1, "legitimate content preserved");
  });

  test("sanitizeSvg: strips on* event attributes", function (a) {
    var svg = '<svg><circle onclick="alert(1)" cx="10" cy="10" r="5"/></svg>';
    var result = sanitizeSvg(svg);
    a.ok(result.indexOf('onclick') === -1, "onclick removed");
    a.ok(result.indexOf('<circle') !== -1, "element preserved");
  });

  test("sanitizeSvg: strips <foreignObject> blocks", function (a) {
    var svg = '<svg><foreignObject><body><img src=x onerror=alert(1)></body></foreignObject><path d="M0 0"/></svg>';
    var result = sanitizeSvg(svg);
    a.ok(result.indexOf('foreignObject') === -1, "foreignObject removed");
    a.ok(result.indexOf('<path') !== -1, "path preserved");
  });

  test("sanitizeSvg: strips javascript: href", function (a) {
    var svg = '<svg><a href="javascript:alert(1)"><text>click</text></a></svg>';
    var result = sanitizeSvg(svg);
    a.ok(result.indexOf('javascript:') === -1, "javascript: href removed");
  });

  test("sanitizeSvg: strips <use> with external URL", function (a) {
    var svg = '<svg><use href="https://evil.com/sprite.svg#arrow"/><path d="M0 0"/></svg>';
    var result = sanitizeSvg(svg);
    a.ok(result.indexOf('evil.com') === -1, "external use href removed");
    a.ok(result.indexOf('<path') !== -1, "path preserved");
  });

  test("sanitizeSvg: returns empty string for null/undefined input", function (a) {
    a.equal(sanitizeSvg(null), '', "null → empty string");
    a.equal(sanitizeSvg(undefined), '', "undefined → empty string");
    a.equal(sanitizeSvg(''), '', "empty string → empty string");
  });
}());

// ── loadStrokeOrderSvg (sessionStorage cache + retry) ─────────────────────────
(function () {
  // sessionStorage stub (per-test, reset each time)
  var _ssStore = {};
  global.sessionStorage = {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(_ssStore, k) ? _ssStore[k] : null; },
    setItem: function (k, v) { _ssStore[k] = v; },
    removeItem: function (k) { delete _ssStore[k]; },
  };

  test("loadStrokeOrderSvg: returns cached value from sessionStorage without fetching", function (a) {
    _ssStore = {};
    var fakeHex = '05b66'; // 学
    _ssStore['svg_' + fakeHex] = '<svg>cached</svg>';
    var fetchCalled = false;
    global.fetch = function () { fetchCalled = true; return Promise.resolve(); };
    var result = null;
    loadStrokeOrderSvg('学').then(function (v) { result = v; });
    // Synchronous check — Promise resolves on cached path without fetch
    a.ok(!fetchCalled, "fetch not called when cache hit");
  });

  test("loadStrokeOrderSvg: stores successful fetch result in sessionStorage", function (a) {
    _ssStore = {};
    var fakeSvg = '<svg><path d="M0 0"/></svg>';
    global.fetch = function () {
      return Promise.resolve({ ok: true, text: function () { return Promise.resolve(fakeSvg); } });
    };
    var stored = null;
    return loadStrokeOrderSvg('学').then(function (v) {
      stored = sessionStorage.getItem('svg_05b66');
      a.equal(stored, fakeSvg, "SVG stored in sessionStorage after successful fetch");
    }).catch(function () {
      a.ok(false, "should not reject on success");
    });
  });

  test("loadStrokeOrderSvg: rejects after 3 attempts on persistent failure", function (a) {
    _ssStore = {};
    var attempts = 0;
    global.fetch = function () {
      attempts++;
      return Promise.resolve({ ok: false });
    };
    // Patch setTimeout to execute callbacks immediately for test speed
    var origTimeout = global.setTimeout;
    global.setTimeout = function (fn) { fn(); };
    return loadStrokeOrderSvg('学').then(function () {
      a.ok(false, "should have rejected");
    }).catch(function () {
      global.setTimeout = origTimeout;
      a.ok(attempts === 3, "fetch called 3 times (1 + 2 retries), got " + attempts);
    });
  });

  test("loadStrokeOrderSvg: drops the KanjiVG <?xml?>/<!DOCTYPE> prolog before <svg>", function (a) {
    _ssStore = {};
    var raw = '<?xml version="1.0"?>\n<!DOCTYPE svg [\n<!ATTLIST g x CDATA #IMPLIED>\n]>\n<svg><path d="M0 0"/></svg>';
    global.fetch = function () {
      return Promise.resolve({ ok: true, text: function () { return Promise.resolve(raw); } });
    };
    return loadStrokeOrderSvg('学').then(function (v) {
      a.equal(v, '<svg><path d="M0 0"/></svg>', "only the <svg> element is returned");
    });
  });

  test("kanji-svg/strokes.js: bundle covers every N5 kanji/kana, prolog-free, and loader uses it without fetch", function (a) {
    var bundle = new Function(fs.readFileSync(path.join(projectDir, 'kanji-svg', 'strokes.js'), 'utf8') + ';return KANJI_SVG;')();
    var missing = Object.keys(CATALOG.items).map(function (id) { return CATALOG.items[id]; })
      .filter(function (it) { return (it.kind === 'kanji' || it.kind === 'kana') && Array.from(it.char).length === 1; })
      .filter(function (it) { return !bundle[kanjiToUnicodeHex(it.char)]; })
      .map(function (it) { return it.char; });
    a.deepEqual(missing, [], "chars missing from bundle");
    a.ok(Object.keys(bundle).every(function (k) { return bundle[k].indexOf('<svg') === 0; }), "every entry starts at <svg");
    _ssStore = {};
    global.KANJI_SVG = bundle;
    var fetchCalled = false;
    global.fetch = function () { fetchCalled = true; return Promise.reject(new Error('no')); };
    return loadStrokeOrderSvg('学').then(function (v) {
      delete global.KANJI_SVG;
      a.equal(v, bundle['05b66'], "served from bundle");
      a.ok(!fetchCalled, "no fetch when bundled");
    });
  });

  test("kanji-svg/: every N5 kanji and single kana in the catalog has a stroke SVG", function (a) {
    var missing = Object.keys(CATALOG.items).map(function (id) { return CATALOG.items[id]; })
      .filter(function (it) { return (it.kind === 'kanji' || it.kind === 'kana') && Array.from(it.char).length === 1; })
      .filter(function (it) { return !fs.existsSync(path.join(projectDir, 'kanji-svg', kanjiToUnicodeHex(it.char) + '.svg')); })
      .map(function (it) { return it.char; });
    a.deepEqual(missing, [], "missing stroke SVGs");
  });
}());

// ── Listening audio: clips (audio/manifest.js) and speakScript playback ──────
(function () {
  var audioTool = require(path.join(projectDir, "tools", "build-audio-manifest.js"));

  test("audio: every live listeningScript line maps (sha1 of clipKey) to its manifest clip and the mp3 exists", function (a) {
    // On failure: a transcript or archetype changed without re-rendering. See tools/audio/README.md.
    // Hashes the live catalog (not tracks.json), so a stale export cannot hide a stale clip.
    var assign = function (f) { return JSON.parse(fs.readFileSync(path.join(projectDir, "tools", "audio", f), "utf8")); };
    var man = assign("man-assignments.json"), woman = assign("woman-assignments.json"), cast = assign("cast.json");
    // a dialogue has no clips until rendered (Web Speech fallback): skipped here while the manifest has no track for it
    var tracks = listeningFor("N5").filter(function (it) { return it.format !== "dialogue" || AUDIO_MANIFEST.tracks[it.id]; }).map(function (it) {
      // a dialogue line is voiced by its character (arch = who, '<who>@<rev>' after a voice revision; take = a re-render); other tracks by the track's man / woman archetype
      return { id: it.id, man: (man[it.id] || {}).man || null, woman: (woman[it.id] || {}).woman || null,
        lines: listeningScript(it).map(function (l) { return { role: l.speaker, arch: l.who && audioTool.charArch(l.who, cast), say: audioTool.sayText(l.text), take: l.take }; }) };
    });
    var errs = audioTool.check(projectDir, AUDIO_MANIFEST, tracks);
    a.ok(errs.length === 0, errs.length + " of " + tracks.reduce(function (n, t) { return n + t.lines.length; }, 0) +
      " clip lines stale: re-render (tools/audio/render-notebook-v2.ipynb), rerun tools/build-audio-manifest.js (tools/audio/README.md)\n    " +
      errs.slice(0, 5).join("\n    ") + (errs.length > 5 ? "\n    ..." : ""));
  });

  test("audio: every dialogue character is in tools/audio/cast.json with the same name, jp and gender; cast.json is complete", function (a) {
    var cast = JSON.parse(fs.readFileSync(path.join(projectDir, "tools", "audio", "cast.json"), "utf8"));
    Object.keys(cast).forEach(function (id) {
      var c = cast[id];
      a.ok(c.name && c.jp && /^[MF]$/.test(c.gender) && c.role && c.personality && /^Native Japanese speaker/.test(c.voice), id + ": cast.json fields");
    });
    a.equal(new Set(Object.keys(cast).map(function (id) { return cast[id].voice; })).size, Object.keys(cast).length, "every character has its own voice prompt");
    listeningFor("N5").filter(function (it) { return it.format === "dialogue"; }).forEach(function (it) {
      Object.keys(it.cast).forEach(function (id) {
        var c = cast[id], d = it.cast[id];
        a.ok(c && c.name === d.name && c.jp === d.jp && c.gender === d.gender, it.id + ": " + id + " matches cast.json");
      });
    });
  });

  test("sw.js: audio mp3s are runtime-cached, never precached; no mp3 is missed by RUNTIME_ONLY", function (a) {
    var sw = require(path.join(projectDir, "tools", "build-sw.js"));
    var built = sw.build(projectDir);
    var mp3 = fs.readdirSync(path.join(projectDir, "audio")).filter(function (f) { return /\.mp3$/.test(f); }).map(function (f) { return "audio/" + f; });
    a.ok(mp3.length > 0, "clips on disk");
    a.deepEqual(mp3.filter(function (u) { return !sw.RUNTIME_ONLY.test(u); }), [], "every clip matches RUNTIME_ONLY");
    a.deepEqual(built.files.filter(function (u) { return sw.RUNTIME_ONLY.test(u); }), [], "no clip precached");
    a.ok(built.files.indexOf("audio/manifest.js") >= 0, "audio/manifest.js precached");
    a.ok(/AUDIO_CACHE/.test(built.source) && /k !== CACHE && k !== AUDIO_CACHE/.test(built.source), "activate keeps the audio cache");
  });

  function clipEnv() {
    var env = { played: [], spoken: [], ended: 0 };
    env.orig = { Audio: global.Audio, location: global.location, ss: window.speechSynthesis, utt: global.SpeechSynthesisUtterance };
    global.location = { protocol: "file:" };
    global.Audio = function (url) {
      var self = this;
      this.url = url;
      this.pause = function () { this.paused = true; };
      this.play = function () {
        env.played.push(url);
        setTimeout(function () {
          if (self.paused) return;
          if (env.failOn && env.failOn(url)) { if (self.onerror) self.onerror(); } else if (self.onended) self.onended();
        }, 0);
        return Promise.resolve();
      };
    };
    window.speechSynthesis = { getVoices: function () { return []; }, cancel: function () {}, speak: function (u) { env.spoken.push(u.text); setTimeout(function () { if (u.onend) u.onend(); }, 0); } };
    global.SpeechSynthesisUtterance = function (text) { this.text = text; };
    env.restore = function () { global.Audio = env.orig.Audio; global.location = env.orig.location; window.speechSynthesis = env.orig.ss; global.SpeechSynthesisUtterance = env.orig.utt; };
    return env;
  }
  var CLIP_LINES = [{ speaker: "N", text: "あ", clip: "a.mp3" }, { speaker: "M", text: "い", clip: "b.mp3" }, { speaker: "F", text: "う", clip: "c.mp3" }];
  // poll (a busy event loop makes fixed sleeps race the 0 ms timer chain)
  var until = function (cond) {
    return new Promise(function (r) { var n = 0; (function tick() { if (cond() || ++n > 400) r(); else setTimeout(tick, 5); }());});
  };
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  testAsync("speakScript: lines with clips play the mp3s in order, then onEnd", function (a) {
    var env = clipEnv();
    speakScript(CLIP_LINES, { pause: 0, onEnd: function () { env.ended++; } });
    return until(function () { return env.ended; }).then(function () {
      a.deepEqual(env.played, ["audio/a.mp3", "audio/b.mp3", "audio/c.mp3"], "clips in order");
      a.equal(env.ended, 1, "onEnd once");
      a.deepEqual(env.spoken, [], "browser voice unused");
    }).then(env.restore, function (e) { env.restore(); throw e; });
  });

  testAsync("speakScript: a failing clip hands the rest (from that line) to the browser voice", function (a) {
    var env = clipEnv();
    env.failOn = function (u) { return u === "audio/b.mp3"; };
    speakScript(CLIP_LINES, { pause: 0, onEnd: function () { env.ended++; } });
    return until(function () { return env.ended; }).then(function () {
      a.deepEqual(env.played, ["audio/a.mp3", "audio/b.mp3"], "stopped at the failed clip");
      a.deepEqual(env.spoken, ["い", "う"], "remaining lines spoken");
      a.equal(env.ended, 1, "onEnd once, after the voice");
    }).then(env.restore, function (e) { env.restore(); throw e; });
  });

  testAsync("speakScript: first clip failing falls back for the whole script; stop() ends it silently", function (a) {
    var env = clipEnv();
    env.failOn = function () { return true; };
    speakScript(CLIP_LINES, { pause: 0, onEnd: function () { env.ended++; } });
    return until(function () { return env.spoken.length === 3; }).then(function () {
      a.deepEqual(env.spoken, ["あ", "い", "う"], "whole script by voice");
      env.failOn = null; env.spoken = []; env.played = []; env.ended = 0;
      var stop = speakScript(CLIP_LINES, { pause: 5, onEnd: function () { env.ended++; } });
      return until(function () { return env.played.length; }).then(function () { stop(); return wait(40); });
    }).then(function () {
      a.equal(env.ended, 0, "no onEnd after stop()");
      a.ok(env.played.length < 3, "stopped before the last clip");
    }).then(env.restore, function (e) { env.restore(); throw e; });
  });

  testAsync("speakScript: lines without clips keep the browser voice path", function (a) {
    var env = clipEnv();
    speakScript([{ speaker: "N", text: "あ" }, { speaker: "M", text: "い", clip: "b.mp3" }], { pause: 0, onEnd: function () { env.ended++; } });
    return until(function () { return env.ended; }).then(function () {
      a.deepEqual(env.played, [], "no clip played");
      a.deepEqual(env.spoken, ["あ", "い"], "voice speaks both");
      a.equal(env.ended, 1);
    }).then(env.restore, function (e) { env.restore(); throw e; });
  });
}());

// ── PWA: sw.js precache list (tools/build-sw.js) ──────────────────────────────
(function () {
  var sw = require(path.join(projectDir, "tools", "build-sw.js"));
  var built = sw.build(projectDir);
  var html = fs.readFileSync(path.join(projectDir, "index.html"), "utf8");
  function walkJs(dir) {
    return fs.readdirSync(path.join(projectDir, dir), { withFileTypes: true }).reduce(function (acc, e) {
      return acc.concat(e.isDirectory() ? walkJs(dir + "/" + e.name) : /\.js$/.test(e.name) ? [dir + "/" + e.name] : []);
    }, []);
  }

  test("sw.js: precache list covers every script/stylesheet index.html loads and every shipped js on disk", function (a) {
    var loaded = [];
    html.replace(/<(?:script[^>]*\ssrc|link[^>]*\shref)="([^"]+)"/g, function (_, u) { loaded.push(u); });
    a.deepEqual(loaded.filter(function (u) { return built.files.indexOf(u) < 0; }), [], "loaded by index.html but not precached");
    var shipped = ["data", "components", "vendor", "audio"].reduce(function (acc, d) { return acc.concat(walkJs(d)); }, [])
      .concat(["lib.js", "store.js", "app-helpers.js", "sfx.js", "app.js", "sw-register.js", "styles.css"]);
    a.deepEqual(shipped.filter(function (u) { return built.files.indexOf(u) < 0; }), [], "on disk but not in the list (add a <script> tag to index.html)");
    ["index.html", "manifest.webmanifest", "kanji-svg/strokes.js", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png",
      "vendor/LICENSE-react.txt", "vendor/LICENSE-pouchdb.txt", "sfx/LICENSE-kenney.txt", "kanji-svg/LICENSE.md"].forEach(function (u) {
      a.ok(built.files.indexOf(u) >= 0, u + " precached");
    });
  });

  test("sw.js: every precached file exists, all URLs are relative", function (a) {
    a.deepEqual(built.files.filter(function (u) { return !fs.existsSync(path.join(projectDir, u)); }), [], "listed but missing on disk");
    a.deepEqual(built.files.filter(function (u) { return /^([a-z]+:|\/|\.\.)/i.test(u); }), [], "absolute or parent-relative URLs");
    var m = JSON.parse(fs.readFileSync(path.join(projectDir, "manifest.webmanifest"), "utf8"));
    var urls = [m.start_url, m.scope].concat(m.icons.map(function (i) { return i.src; }));
    a.deepEqual(urls.filter(function (u) { return /^([a-z]+:|\/)/i.test(u); }), [], "manifest urls relative");
    m.icons.forEach(function (i) { a.ok(fs.existsSync(path.join(projectDir, i.src)), i.src + " exists"); });
    a.ok(/rel="manifest" href="manifest\.webmanifest"/.test(html), "index.html links the manifest");
  });

  test("sw.js: committed file is up to date (run node tools/build-sw.js)", function (a) {
    var onDisk = fs.readFileSync(path.join(projectDir, "sw.js"), "utf8").replace(/\r\n/g, "\n");
    a.ok(onDisk === built.source, "sw.js differs from generator output: run node tools/build-sw.js");
  });

  test("sw.js: version changes when a precached file changes; passes node --check", function (a) {
    var tmp = fs.mkdtempSync(path.join(require("os").tmpdir(), "jelly-sw-"));
    ["manifest.webmanifest", "styles.css"].forEach(function (f) { fs.copyFileSync(path.join(projectDir, f), path.join(tmp, f)); });
    fs.writeFileSync(path.join(tmp, "index.html"), '<link rel="stylesheet" href="styles.css">');
    var before = sw.build(tmp).version;
    fs.appendFileSync(path.join(tmp, "styles.css"), "\n/* x */");
    a.notEqual(sw.build(tmp).version, before, "version bumps on content change");
    fs.writeFileSync(path.join(tmp, "styles.css"), fs.readFileSync(path.join(projectDir, "styles.css")).toString().replace(/\r\n/g, "\n").replace(/\n/g, "\r\n"));
    a.equal(sw.build(tmp).version, before, "CRLF checkout hashes the same");
    require("child_process").execFileSync(process.execPath, ["--check", path.join(projectDir, "sw.js")]);
    require("child_process").execFileSync(process.execPath, ["--check", path.join(projectDir, "sw-register.js")]);
    a.ok(true, "node --check ok");
  });
}());

// ── summary ───────────────────────────────────────────────────────────────────
_asyncChain.then(function () {
  var total = _pass + _fail;
  if (_fail === 0) {
    console.log("Tests: " + _pass + "/" + total + " passed");
  } else {
    console.log("\nTests: " + _pass + " passed, " + _fail + " FAILED out of " + total);
  }
  process.exit(_fail > 0 ? 1 : 0);
});
