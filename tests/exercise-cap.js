"use strict";

QUnit.module('exerciseCap', function () {
  QUnit.test('N5/N4 cap is 5', function (assert) {
    assert.equal(exerciseCap('N5'), 5);
    assert.equal(exerciseCap('N4'), 5);
  });

  QUnit.test('N3 cap is 7', function (assert) {
    assert.equal(exerciseCap('N3'), 7);
  });

  QUnit.test('N2/N1 cap is 9', function (assert) {
    assert.equal(exerciseCap('N2'), 9);
    assert.equal(exerciseCap('N1'), 9);
  });
});
