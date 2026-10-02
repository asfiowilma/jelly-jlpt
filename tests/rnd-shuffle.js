"use strict";

QUnit.module('rndShuffle', function () {

  QUnit.test('returns an array of the same length', function (assert) {
    var arr = [1, 2, 3, 4, 5];
    assert.equal(rndShuffle(arr).length, arr.length);
  });

  QUnit.test('contains exactly the same elements', function (assert) {
    var arr = ['a', 'b', 'c', 'd'];
    var shuffled = rndShuffle(arr);
    assert.deepEqual(shuffled.slice().sort(), arr.slice().sort());
  });

  QUnit.test('does not mutate the original array', function (assert) {
    var arr = [1, 2, 3];
    var copy = arr.slice();
    rndShuffle(arr);
    assert.deepEqual(arr, copy, 'original array is unchanged');
  });

  QUnit.test('works on an empty array', function (assert) {
    assert.deepEqual(rndShuffle([]), []);
  });

  QUnit.test('works on a single-element array', function (assert) {
    assert.deepEqual(rndShuffle([42]), [42]);
  });

  QUnit.test('returns a new array (not the same reference)', function (assert) {
    var arr = [1, 2, 3];
    assert.notStrictEqual(rndShuffle(arr), arr, 'should return a new array');
  });
});


// ── 8. Exercise generation — buildExercises(lesson) ─────────────────────────
