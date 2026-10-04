"use strict";

// Ticket 38: unit:<id> docs may carry skipped:true (done by placement, not by a quiz pass).
QUnit.module('skipped units', function () {
  var UNITS_ = buildUnits(PLAN, CATALOG);
  function fakeLs() { var d = {}; return { get: function (k) { return d[k] || null; }, set: function (k, v) { d[k] = String(v); } }; }
  function newStore() { return createStore({ ls: fakeLs(), openBackend: function () { return Promise.resolve(memoryBackend()); } }); }
  var T = new Date(2026, 5, 1, 12).getTime();
  function skippedDoc(id, t) { return { _id: 'unit:' + id, done: true, completedAt: t, skipped: true, updatedAt: 1 }; }

  QUnit.test('Store.putUnit: skipped flag, real pass clears it, un-mark clears it, no-op when unchanged', function (assert) {
    var s = newStore();
    return s.init().then(function () {
      s.putUnit('n5.u001', true, true);
      assert.strictEqual(s.docs()[0].skipped, true);
      assert.deepEqual(s.snapshot().skipped, ['n5.u001']);
      assert.deepEqual(s.snapshot().completed, ['n5.u001'], 'skipped stays in completed');
      var first = s.docs()[0];
      s.putUnit('n5.u001', true, true);
      assert.strictEqual(s.docs()[0], first, 'same state = no rewrite');
      s.putUnit('n5.u001', true);
      assert.notOk('skipped' in s.docs()[0], 'a real pass drops the flag');
      assert.deepEqual(s.snapshot().skipped, []);
      s.putUnit('n5.u002', true, true);
      s.putUnit('n5.u002', false, true);
      assert.notOk('skipped' in s.docs().filter(function (d) { return d._id === 'unit:n5.u002'; })[0], 'not done = never skipped');
    });
  });

  QUnit.test('merge keeps the winning revision incl. its flag; real pass beats older skip', function (assert) {
    var sk = { _id: 'unit:n5.u001', done: true, skipped: true, updatedAt: 100, deviceId: 'a' };
    var pass = { _id: 'unit:n5.u001', done: true, updatedAt: 200, deviceId: 'b' };
    assert.strictEqual(mergeStoreDocs(sk, pass), pass);
    assert.strictEqual(mergeStoreDocs(pass, sk), pass);
    assert.strictEqual(mergeStoreDocs(sk, { _id: sk._id, done: true, updatedAt: 50 }), sk);
  });

  QUnit.test('export round-trip and validation', function (assert) {
    var exp = exportProgress([skippedDoc('n5.u001', 5)], function () { return null; });
    var back = JSON.parse(JSON.stringify(exp));
    assert.ok(validateProgressData(back).valid);
    assert.deepEqual(docsToSnapshot(progressFileToDocs(back).docs).skipped, ['n5.u001']);
    assert.notOk(validateProgressData({ version: 3, docs: [{ _id: 'unit:n5.u001', done: false, skipped: true, updatedAt: 1 }], device: {} }).valid, 'skipped needs done');
    assert.notOk(validateProgressData({ version: 3, docs: [{ _id: 'unit:n5.u001', done: true, skipped: 'yes', updatedAt: 1 }], device: {} }).valid);
  });

  QUnit.test('skipped units do not count toward today\'s pace', function (assert) {
    assert.equal(unitsDoneToday([skippedDoc('n5.u001', T), { _id: 'unit:n5.u002', done: true, completedAt: T, updatedAt: 1 }], T), 1);
  });

  QUnit.test('achievements: progress counts skipped, quiz rows and per-day rows never do', function (assert) {
    var ctx = { units: UNITS_, catalog: CATALOG, now: T + 1000 };
    var docs = UNITS_.filter(function (u) { return u.kind !== 'mock'; }).map(function (u) { return skippedDoc(u.id, T); });
    var got = evaluateAchievements(docs, {}, ctx).map(function (r) { return r.id; });
    assert.ok(got.indexOf('first-steps') >= 0 && got.indexOf('units-10') >= 0, 'progress rows count skipped as done');
    var byId = {};
    ACHIEVEMENTS.forEach(function (d) { byId[d.id] = d; });
    got.forEach(function (id) { assert.notEqual(byId[id].category, 'quiz', id + ' is not a quiz row'); });
    ['hiragana-blitz', 'first-quiz', 'first-perfect', 'perfect-10', 'n5-quiz-sweep'].forEach(function (id) {
      assert.ok(got.indexOf(id) < 0, id + ' needs a real quiz entry');
    });
    var real = docs.map(function (d) { return { _id: d._id, done: true, completedAt: T, updatedAt: 1 }; });
    var gotReal = evaluateAchievements(real, {}, ctx).map(function (r) { return r.id; });
    assert.ok(got.length <= gotReal.length, 'skipped never earns more than real passes');
  });

  QUnit.test('stages list renders a skipped stage with its own mark and label', function (assert) {
    // record every element's props + text children (headless React stub returns {}, real React is fine too)
    var orig = React.createElement, seen = [];
    React.createElement = function (type, props) {
      seen.push(JSON.stringify(props || {}, function (k, v) { return typeof v === 'function' ? undefined : v; }));
      for (var i = 2; i < arguments.length; i++) if (typeof arguments[i] === 'string' || typeof arguments[i] === 'number') seen.push(String(arguments[i]));
      return orig.apply(React, arguments);
    };
    try {
      Overview({ units: UNITS_, completed: new Set([UNITS_[1].id]), skipped: new Set([UNITS_[1].id]),
        current: 0, suggested: 0, setUnit: function () {}, cards: {} });
    } finally { React.createElement = orig; }
    var json = seen.join(' | ');
    assert.ok(json.indexOf('unit-skipped') >= 0, 'skipped mark present');
    assert.ok(json.indexOf('Skipped, verified by placement') >= 0, 'accessible label');
    assert.ok(json.indexOf('unit-row skipped') >= 0, 'skipped row class');
    assert.ok(json.indexOf('1 skipped') >= 0, 'bucket count');
  });
});
