"use strict";

// Catalog + plan integrity (spec §9) and the lib.js loader (validatePlan,
// buildUnits, nextUnit, levelRamp).
QUnit.module('catalog + plan', function () {
  function all() { return Object.keys(CATALOG.items).map(function (k) { return CATALOG.items[k]; }); }
  function nonEmptyStrings(a) { return Array.isArray(a) && a.length > 0 && a.every(function (s) { return typeof s === 'string' && s; }); }

  QUnit.test('every item: id prefix matches kind, valid level, sources, verified flag', function (assert) {
    var bad = all().filter(function (it) {
      return it.id.indexOf(CATALOG_ID_PREFIX[it.kind]) !== 0 || levelRank(it.level) < 0 ||
        !nonEmptyStrings(it.sources) || typeof it.verified !== 'boolean';
    });
    assert.ok(all().length > 0, 'catalog not empty');
    assert.deepEqual(bad.map(function (it) { return it.id; }), []);
  });

  QUnit.test('verified:true needs ≥2 sources (map Q1)', function (assert) {
    var bad = all().filter(function (it) { return it.verified && it.sources.length < 2; });
    assert.deepEqual(bad.map(function (it) { return it.id; }), []);
  });

  QUnit.test('required fields per kind; ids are content-keyed', function (assert) {
    var errors = [];
    all().forEach(function (it) {
      var ok;
      if (it.kind === 'vocab') ok = it.word && it.reading && nonEmptyStrings(it.gloss) && it.id === 'v:' + it.word + '|' + it.reading;
      else if (it.kind === 'kanji') ok = it.char && Array.isArray(it.on) && Array.isArray(it.kun) && it.on.length + it.kun.length > 0 &&
        nonEmptyStrings(it.meaning) && it.id === 'k:' + it.char;
      else if (it.kind === 'grammar') ok = it.pattern && it.meaning && /^g:[a-z0-9-]+$/.test(it.id) &&
        (it.examples || []).every(function (s) { return CATALOG.items[s] && CATALOG.items[s].kind === 'sentence'; });
      else if (it.kind === 'sentence') ok = it.jp && it.en && /^s:(own:[a-z0-9-]+|tatoeba:\d+)$/.test(it.id) &&
        (it.uses || []).every(function (id) { return CATALOG.items[id]; });
      if (!ok) errors.push(it.id);
    });
    assert.deepEqual(errors, []);
  });

  QUnit.test('CATALOG.add rejects duplicate ids and bad shapes', function (assert) {
    var id = Object.keys(CATALOG.items)[0];
    assert.throws(function () { CATALOG.add([CATALOG.items[id]]); }, /duplicate/);
    assert.throws(function () { CATALOG.add([{ id: 'x:1', kind: 'vocab' }]); }, /bad item/);
    assert.throws(function () { CATALOG.add([{ id: 'k:x', kind: 'nope' }]); }, /bad item/);
  });

  QUnit.test('the shipped plan is valid: every reference resolves', function (assert) {
    var r = validatePlan(PLAN, CATALOG);
    assert.ok(r.valid, r.error);
    assert.ok(PLAN.some(function (p) { return p.level === 'N5'; }), 'N5 plan present');
  });

  QUnit.test('validatePlan catches broken plans', function (assert) {
    function err(units) { return validatePlan([{ level: 'N5', units: units }], CATALOG).error || ''; }
    var u = { id: 'n5.u901', level: 'N5', kind: 'lesson', title: 't' };
    assert.ok(/missing v:nope/.test(err([Object.assign({}, u, { vocab: ['v:nope|nope'] })])), 'missing ref');
    var kanjiId = all().filter(function (it) { return it.kind === 'kanji'; })[0].id;
    assert.ok(/has kanji/.test(err([Object.assign({}, u, { vocab: [kanjiId] })])), 'wrong kind in field');
    assert.ok(/duplicate unit/.test(err([u, u])), 'duplicate unit id');
    assert.ok(/bad unit id/.test(err([Object.assign({}, u, { id: 'day-1' })])), 'opaque id format');
    assert.ok(/kind/.test(err([Object.assign({}, u, { kind: 'day' })])), 'unit kind');
    assert.ok(/level/.test(err([Object.assign({}, u, { level: 'N4' })])), 'unit level matches plan');
    assert.notOk(validatePlan([{ level: 'N6', units: [] }], CATALOG).valid, 'plan level');
  });

  QUnit.test('buildUnits: ordered by level, global index, items resolved', function (assert) {
    var units = buildUnits(PLAN, CATALOG);
    assert.ok(units.length >= 4, units.length + ' units');
    units.forEach(function (u, i) {
      assert.strictEqual(u.index, i, u.id + ' index');
      ['vocab', 'kanji', 'grammar'].forEach(function (f) {
        assert.ok(u[f].every(function (it) { return it && it.id; }), u.id + '.' + f + ' resolved');
      });
    });
    var ranks = units.map(function (u) { return levelRank(u.level); });
    assert.deepEqual(ranks, ranks.slice().sort(), 'N5 first');
    assert.ok(units.filter(function (u) { return u.kind === 'lesson'; }).every(function (u) { return u.vocab.length > 0; }), 'lessons teach vocab');
  });

  QUnit.test('buildUnits: a review unit quizzes the previous lesson units', function (assert) {
    var mk = function (id, kind, vocab) { return { id: id, level: 'N5', kind: kind, title: id, vocab: vocab }; };
    var v = all().filter(function (it) { return it.kind === 'vocab'; }).map(function (it) { return it.id; });
    var units = buildUnits([{ level: 'N5', units: [mk('n5.u001', 'lesson', [v[0]]), mk('n5.u002', 'lesson', [v[1]]), mk('n5.u003', 'review')] }], CATALOG);
    assert.deepEqual(units[2].vocab.map(function (it) { return it.id; }), [v[0], v[1]]);
    assert.deepEqual(units[2].kanji, []);
  });

  QUnit.test('nextUnit: first unit not done (nothing locked)', function (assert) {
    var units = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    assert.strictEqual(nextUnit(units, new Set()), 0);
    assert.strictEqual(nextUnit(units, new Set(['a', 'c'])), 1);
    assert.strictEqual(nextUnit(units, new Set(['a', 'b', 'c'])), 2, 'all done → last');
  });

  QUnit.test('levelRamp: one segment per level with units, filled up to the current unit', function (assert) {
    var units = ['N5', 'N5', 'N5', 'N5', 'N4', 'N4'].map(function (lv, i) { return { level: lv, index: i }; });
    var r = levelRamp(units, 0);
    assert.deepEqual(r.segments.map(function (s) { return s.level + ':' + s.start + '+' + s.len; }), ['N5:0+4', 'N4:4+2']);
    assert.deepEqual(r.segments.map(function (s) { return Math.round(s.fill); }), [25, 0]);
    assert.deepEqual(levelRamp(units, 4).segments.map(function (s) { return s.fill; }), [100, 50]);
    assert.ok(Math.abs(levelRamp(units, 2).here - 2.5 / 6 * 100) < 0.01, 'marker centred on the unit');
  });
});
