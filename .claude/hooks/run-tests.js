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
for (const lv of fs.readdirSync(dataDir).filter(function (f) { return fs.statSync(path.join(dataDir, f)).isDirectory(); }).sort()) {
  for (const file of fs.readdirSync(path.join(dataDir, lv)).sort()) load(path.join("data", lv, file));
}
// Mirrors the <script src> order in index.html after data/
var appFiles = [
  "lib.js",
  "store.js",
  "app-helpers.js",
  "sfx.js",
  path.join("components", "kanji-section.js"),
  path.join("components", "kana-section.js"),
  path.join("components", "vocab-section.js"),
  path.join("components", "exercises.js"),
  path.join("components", "mock-exam.js"),
  path.join("components", "unit-view.js"),
  path.join("components", "review-mode.js"),
  path.join("components", "overview.js"),
  path.join("components", "stats-view.js"),
  path.join("components", "import-view.js"),
  path.join("components", "settings-view.js"),
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

  test("vocabGroups / vocabHasReading: grouping by part of speech; reading column only for kanji words", function (a) {
    var u = units.filter(function (x) { return x.id === "n5.u044"; })[0];
    var g = vocabGroups(u.vocab, u.level);
    a.deepEqual(g.map(function (x) { return x.key; }), ["verb", "adj", "noun"], "verbs, adjectives, nouns");
    a.equal(g.reduce(function (n, x) { return n + x.items.length; }, 0), u.vocab.length, "every word lands in a group");
    var by = function (w) { return u.vocab.filter(function (v) { return v.word === w; })[0]; };
    a.equal(vocabHasReading(by("部屋")), true, "部屋 has a reading to test");
    a.equal(vocabHasReading(by("いす")), false, "kana-only いす does not");
    a.equal(vocabHasReading(by("ベッド")), false, "katakana ベッド does not");
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

  test("React render: ReviewMode() renders empty and with due item cards", function (a) {
    try {
      ReviewMode({ cards: {}, level: "N5", onUpdate: noop });
      var cards = {};
      units.forEach(function (u) { srsAddCards(u, cards); });
      ReviewMode({ cards: cards, level: "N5", onUpdate: noop });
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
      if (result.passed !== quizPassed(result.right, result.total, unit.kind)) errors.push(unit.id + ": passed flag");
      var requeued = plan.filter(function (p) { return p[0].requeue; }).length;
      if (requeued !== wrongFirst.length) errors.push(unit.id + "@" + unit.level + ": " + wrongFirst.length + " misses, " + requeued + " re-asked");
      wrongFirst.forEach(function (p) { if (result.missed.indexOf(p[0].itemId) < 0) errors.push(unit.id + ": miss not flagged " + p[0].itemId); });
      if (!find(cls(/qz-verdict/)).length) errors.push(unit.id + ": no pass/fail verdict");
    };
    try {
      global.setTimeout = function (fn) { fn(); };
      React.useRef = function () { return { current: null }; };
      pool.forEach(function (unit, qi) {
        try { play(unit, qi); } catch (e) { errors.push(unit.id + "@" + unit.level + ": " + e.message); }
      });
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
    window.speechSynthesis = { getVoices: function () { return []; }, cancel: function () {}, speak: function (u) { spoken++; if (u.onend) u.onend(); } };
    global.SpeechSynthesisUtterance = function (text) { this.text = text; };
    var clock = 1000000, intervals = [];
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
      click(/quiz-start-btn/);
      // part 1 (vocab): answer every question; question 2 wrong, question 3 flagged
      secs[0].questions.forEach(function (ex, i) {
        click(/mock-nav-btn/, i);
        click(/mock-option/, i === 1 ? (ex.correct + 1) % ex.options.length : ex.correct);
        if (i === 2) click(/mock-flag/);
      });
      a.ok(find(/mock-nav-btn/)[2].props.className.indexOf("flagged") >= 0, "flag shows in the question list");
      click(/mock-nav-btn/, 1);
      a.ok(find(/mock-option/)[(secs[0].questions[1].correct + 1) % 4].props.className.indexOf("selected") >= 0, "answer kept when coming back");
      click(/mock-end/);
      a.ok(find(/quiz-start-btn/).length === 1 && !find(/mock-option/).length, "between parts: start screen, no questions");
      click(/quiz-start-btn/);
      // part 2 (grammar + reading): all right
      secs[1].questions.forEach(function (ex, i) { click(/mock-nav-btn/, i); click(/mock-option/, ex.correct); });
      click(/mock-end/);
      click(/quiz-start-btn/);
      // part 3 (listening): play twice (1 replay), then the button is spent; two answers, then time out
      var before3 = spoken;
      click(/ex-listen-btn/); click(/ex-listen-btn/);
      a.ok(spoken > before3, "the dialogue is spoken");
      a.ok(find(/ex-listen-btn/)[0].props.disabled, "no third play");
      click(/mock-option/, secs[2].questions[0].correct);
      click(/mock-nav-btn/, 1);
      click(/mock-option/, secs[2].questions[1].correct);
      a.ok(!taken, "not finished before time is up");
      clock += secs[2].seconds * 1000 + 1;
      intervals.filter(Boolean).slice(-1)[0]();
      render();
      a.ok(taken, "time-out ends the test");
      want = { vocab: [secs[0].questions.length - 1, secs[0].questions.length], grammar: [10, 10], reading: [4, 4], listening: [2, secs[2].questions.length] };
      a.deepEqual(taken.parts, want, "scored: one vocab miss, unanswered listening wrong");
      a.deepEqual(taken.estimate, mockEstimate({ vocab: want.vocab[0] / want.vocab[1], grammar: 1, reading: 1, listening: 2 / want.listening[1] }));
      a.ok(find(/mock-estimate/).length && find(/mock-missed/).length, "results: estimate + missed list");
      var saved = Store.snapshot().mocks.filter(function (m) { return m.mockId === mock.id; });
      a.equal(saved.length, 1, "one mock: doc saved");
      a.ok(STORE_ID_RE.test("mock:" + saved[0].mockId + ":" + saved[0].takenAt), "doc id shape");
      // a later visit lists the attempt in the history
      state = []; refs = []; deps = []; cleanups = [];
      render();
      a.ok(find(/link-btn/).length === 1, "history lists the attempt");
    } catch (err) {
      a.ok(false, err.stack);
    } finally {
      React.useState = orig.useState; React.createElement = orig.createElement; React.useRef = orig.useRef; React.useEffect = orig.useEffect;
      global.setInterval = orig.setInterval; global.clearInterval = orig.clearInterval;
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
