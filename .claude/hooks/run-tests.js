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
  path.join("components", "char-card.js"),
  path.join("components", "exercises.js"),
  path.join("components", "unit-view.js"),
  path.join("components", "review-mode.js"),
  path.join("components", "overview.js"),
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
          UnitView({ unit: u, units: units, completed: new Set([u.id]), toggleDone: noop, setUnit: noop,
            showFurigana: furi, toggleFurigana: noop });
        } catch (e) { a.ok(false, u.id + ": " + e.message); }
      });
    });
    a.ok(units.some(function (u) { return u.kind === "review"; }), "a review unit is rendered");
  });

  test("React render: CharCard() renders a catalog kanji", function (a) {
    try { CharCard({ kanji: CATALOG.items["k:人"] }); a.ok(true); } catch (e) { a.ok(false, e.message); }
  });

  test("React render: Overview() renders units + coming-soon levels", function (a) {
    try {
      Overview({ units: units, completed: emptySet, current: 0, suggested: 0, setUnit: noop });
      Overview({ units: units, completed: new Set([units[0].id]), current: units.length - 1, suggested: 1, setUnit: noop });
      a.ok(true);
    } catch (e) { a.ok(false, e.message); }
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

  test("React render: SettingsView() renders without throwing", function (a) {
    try {
      SettingsView({
        themePrefs: { palette: "ai", theme: "dark" }, setThemePrefs: noop,
        speechRate: 0.85, setSpeechRate: noop,
        level: "N5", uiLang: "auto", setUiLang: noop, sfxOn: true, setSfxOn: noop, furiganaMode: "auto", setFuriganaMode: noop,
        onExport: noop, onImport: noop, onBack: noop,
      });
      a.ok(true);
    } catch (e) { a.ok(false, e.message); }
  });

  test("playSfx: no-op without Audio (Node) and never throws", function (a) {
    a.equal(typeof playSfx, "function");
    playSfx("correct"); playSfx("nope");
    a.ok(["ogg", "mp3"].indexOf(SFX_EXT) !== -1, "SFX_EXT is ogg or mp3");
  });

  // Render every exercise type buildExercises emits, both unanswered and
  // answered, by forcing Exercises' useState slots in order:
  // exs, cur, answer, selected, revealed, score, done, started, results, picks.
  // Shipped units are N5 only, so they are also replayed at N2 (all types on).
  test("React render: Exercises renders every exercise type without throwing", function (a) {
    var origUseState = React.useState;
    var origSpeech = window.speechSynthesis;
    window.speechSynthesis = {}; // include listen exercises
    var seen = {}, errors = [];
    var pool = units.concat(units.map(function (u) { return Object.assign({}, u, { level: "N2" }); }));
    try {
      for (var run = 0; run < 5; run++) pool.forEach(function (unit) {
        var exs = buildExercises(unit);
        exs.forEach(function (ex, cur) {
          seen[ex.type] = true;
          var n = (ex.items || []).length;
          var allIdx = Array.apply(null, Array(n)).map(function (_, i) { return i; });
          [[exs, cur, '', null, false, undefined, false, true, [], []],
           [exs, cur, 'x', 0, true, undefined, false, true, [], ex.type === 'pair_match' ? allIdx.map(function () { return 0; }) : allIdx]
          ].forEach(function (slots) {
            var k = 0;
            React.useState = function (init) {
              var v = slots[k++];
              if (v === undefined) v = typeof init === "function" ? init() : init;
              return [v, function () {}];
            };
            try { Exercises({ unit: unit, onStart: noop, onFinish: noop }); }
            catch (e) { errors.push(unit.id + "@" + unit.level + " " + ex.type + ": " + e.message); }
          });
        });
      });
    } finally {
      React.useState = origUseState;
      window.speechSynthesis = origSpeech;
    }
    a.equal(errors.length, 0, errors.slice(0, 5).join("\n"));
    // ponytail: no "reading" (needs passage items) or "conjugation" (no shipped verbs) yet
    ["mc", "listen", "typing", "pair_match", "fill_blank", "synonym", "kanji_reading"].forEach(function (t) {
      a.ok(seen[t], "type " + t + " was rendered");
    });
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
