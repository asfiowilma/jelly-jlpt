"use strict";

QUnit.module('buildExercises', {
  // Disable speechSynthesis so "listen" exercises are consistently excluded,
  // making test output deterministic regardless of browser support.
  beforeEach: function () {
    this._origSpeech = window.speechSynthesis;
    try { delete window.speechSynthesis; } catch (e) { window.speechSynthesis = undefined; }
    this.unit = buildUnits(PLAN, CATALOG)[0]; // N5 lesson: vocab + kanji + grammar
  },
  afterEach: function () {
    if (this._origSpeech !== undefined) {
      window.speechSynthesis = this._origSpeech;
    }
  }
}, function () {

  QUnit.test('never returns more than the N5 cap (5)', function (assert) {
    var exs = buildExercises(this.unit);
    assert.ok(exs.length > 0 && exs.length <= 5, 'got ' + exs.length + ' exercises (max 5)');
  });

  QUnit.test('per-unit quiz.cap overrides the level cap', function (assert) {
    var exs = buildExercises(Object.assign({}, this.unit, { quiz: { cap: 2 } }));
    assert.strictEqual(exs.length, 2);
  });

  QUnit.test('returns empty array for a unit with no items', function (assert) {
    var exs = buildExercises({ id: 'n5.u999', level: 'N5', index: 0, vocab: [], kanji: [], grammar: [] });
    assert.equal(exs.length, 0);
  });

  QUnit.test('mc exercises have required fields and in-bounds correct index (10 runs)', function (assert) {
    for (var run = 0; run < 10; run++) {
      buildExercises(this.unit).filter(function (e) { return e.type === 'mc'; }).forEach(function (mc) {
        assert.ok(mc.prompt, 'mc.prompt is non-empty');
        assert.ok(mc.options.length >= 2, 'mc has at least 2 options');
        assert.ok(mc.correct >= 0 && mc.correct < mc.options.length, 'correct=' + mc.correct);
      });
    }
  });

  QUnit.test('typing exercises have a non-empty answers array', function (assert) {
    for (var run = 0; run < 5; run++) {
      buildExercises(this.unit).filter(function (e) { return e.type === 'typing'; }).forEach(function (t) {
        assert.ok(Array.isArray(t.answers) && t.answers.length > 0, 'typing.answers is non-empty');
      });
    }
  });

  QUnit.test('kanji typing accepts kun, on (katakana) and on typed in hiragana', function (assert) {
    var k = CATALOG.items['k:人'];
    var unit = { id: 'n5.u999', level: 'N5', index: 0, vocab: [], kanji: [k, k], grammar: [] };
    var typing = null;
    for (var i = 0; i < 20 && !typing; i++) {
      typing = buildExercises(unit).filter(function (e) { return e.type === 'typing'; })[0] || null;
    }
    assert.ok(typing, 'typing generated');
    ['ひと', 'ジン', 'じん'].forEach(function (a) { assert.ok(checkTyping(a, typing.answers), a); });
  });

  QUnit.test('every shipped unit builds a quiz', function (assert) {
    buildUnits(PLAN, CATALOG).forEach(function (u) {
      assert.ok(buildExercises(u).length > 0, u.id);
    });
  });
});
