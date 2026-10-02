"use strict";

QUnit.module('buildExercises', {
  // Disable speechSynthesis so "listen" exercises are consistently excluded,
  // making test output deterministic regardless of browser support.
  beforeEach: function () {
    this._origSpeech = window.speechSynthesis;
    try { delete window.speechSynthesis; } catch (e) { window.speechSynthesis = undefined; }
  },
  afterEach: function () {
    if (this._origSpeech !== undefined) {
      window.speechSynthesis = this._origSpeech;
    }
  }
}, function () {

  QUnit.test('never returns more than 5 exercises', function (assert) {
    var lesson = curriculum[0]; // Day 1: has both chars and vocab
    var exs = buildExercises(lesson);
    assert.ok(exs.length <= 5, 'got ' + exs.length + ' exercises (max 5)');
  });

  QUnit.test('returns empty array for lesson with no vocab or chars', function (assert) {
    var exs = buildExercises({ day: 1, vocab: [], chars: [] });
    assert.equal(exs.length, 0);
  });

  QUnit.test('mc exercises have required fields: type, prompt, options, correct', function (assert) {
    var lesson = curriculum[0]; // Day 1 has chars
    var exs = buildExercises(lesson);
    exs.filter(function (e) { return e.type === 'mc'; }).forEach(function (mc) {
      assert.equal(mc.type, 'mc');
      assert.ok(mc.prompt, 'mc.prompt is non-empty');
      assert.ok(Array.isArray(mc.options), 'mc.options is an array');
      assert.ok(typeof mc.correct === 'number', 'mc.correct is a number');
    });
  });

  QUnit.test('typing exercises have a non-empty answers array', function (assert) {
    var lesson = curriculum[0];
    var exs = buildExercises(lesson);
    exs.filter(function (e) { return e.type === 'typing'; }).forEach(function (t) {
      assert.ok(Array.isArray(t.answers), 'typing.answers is an array');
      assert.ok(t.answers.length > 0, 'typing.answers is non-empty');
    });
  });

  QUnit.test('mc correct index is always within options bounds (10 runs)', function (assert) {
    var lesson = curriculum[0];
    for (var run = 0; run < 10; run++) {
      buildExercises(lesson)
        .filter(function (e) { return e.type === 'mc'; })
        .forEach(function (mc) {
          assert.ok(
            mc.correct >= 0 && mc.correct < mc.options.length,
            'correct=' + mc.correct + ' out of ' + mc.options.length + ' options'
          );
        });
    }
  });

  QUnit.test('mc options array always has at least 2 entries', function (assert) {
    var lesson = curriculum[0];
    for (var run = 0; run < 5; run++) {
      buildExercises(lesson)
        .filter(function (e) { return e.type === 'mc'; })
        .forEach(function (mc) {
          assert.ok(mc.options.length >= 2, 'mc has at least 2 options');
        });
    }
  });

  QUnit.test('vocab-only lesson produces exercises', function (assert) {
    var lesson = curriculum[29]; // Day 30: Foundations — vocab but no chars
    var exs = buildExercises(lesson);
    assert.ok(exs.length > 0, 'exercises generated for vocab-only lesson');
  });
});


// ── 9. SRS2 update — srsReview(card, quality) ────────────────────────────────
// Note: srsReview uses `ease` field (same as SM-2 `ef`).
// quality 0→3 maps to SM-2 grades [0, 3, 4, 5].
