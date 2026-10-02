"use strict";

QUnit.module('exerciseCap', function () {
  QUnit.test('N5/N4 cap is 5', function (assert) {
    assert.equal(exerciseCap(1), 5);
    assert.equal(exerciseCap(660), 5);
  });

  QUnit.test('N3 cap is 7', function (assert) {
    assert.equal(exerciseCap(661), 7);
    assert.equal(exerciseCap(960), 7);
  });

  QUnit.test('N2/N1 cap is 9', function (assert) {
    assert.equal(exerciseCap(961), 9);
    assert.equal(exerciseCap(1720), 9);
  });
});

// ── 14. N3+ exercise types in buildExercises ────────────────────────────────
