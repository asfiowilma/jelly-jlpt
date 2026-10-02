"use strict";

QUnit.module('addDayCards', function () {

  var sampleLesson = {
    day: 1,
    vocab: [['いえ', 'いえ', 'house'], ['あお', 'あお', 'blue'], ['うえ', 'うえ', 'above']],
    chars: [['あ', 'a'], ['い', 'i']]
  };

  QUnit.test('adds a vocab card for each vocab entry', function (assert) {
    var result = addDayCards({}, sampleLesson);
    assert.ok(result['v_1_0'], 'vocab card 0 added');
    assert.ok(result['v_1_1'], 'vocab card 1 added');
    assert.ok(result['v_1_2'], 'vocab card 2 added');
  });

  QUnit.test('adds a char card for each char entry', function (assert) {
    var result = addDayCards({}, sampleLesson);
    assert.ok(result['c_1_0'], 'char card 0 added');
    assert.ok(result['c_1_1'], 'char card 1 added');
  });

  QUnit.test('new cards have correct initial SM-2 values', function (assert) {
    var card = addDayCards({}, sampleLesson)['v_1_0'];
    assert.equal(card.interval, 1, 'initial interval = 1');
    assert.equal(card.ef, 2.5, 'initial ef = 2.5');
    assert.equal(card.reps, 0, 'initial reps = 0');
    assert.ok(typeof card.due === 'number', 'due is a number');
  });

  QUnit.test('does NOT overwrite an existing card (guard: if !srs[id])', function (assert) {
    var existing = { interval: 10, ef: 1.8, reps: 7, due: 9999999 };
    var srs = { 'v_1_0': existing };
    var result = addDayCards(srs, sampleLesson);
    assert.deepEqual(result['v_1_0'], existing, 'existing card data must be preserved');
  });

  QUnit.test('empty vocab and chars produce no error', function (assert) {
    var result = addDayCards({}, { day: 99, vocab: [], chars: [] });
    assert.equal(Object.keys(result).length, 0, 'no cards added for empty lesson');
  });

  QUnit.test('lesson with only vocab (no chars) works', function (assert) {
    var result = addDayCards({}, { day: 50, vocab: [['ねこ', 'ねこ', 'cat']], chars: [] });
    assert.ok(result['v_50_0'], 'vocab card added');
    assert.notOk(result['c_50_0'], 'no char card added');
  });
});


// ── 5. Due card filtering — getDueCards(srs) ─────────────────────────────────
