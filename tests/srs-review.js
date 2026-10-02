"use strict";

QUnit.module('srsReview', function () {

  QUnit.test('quality=0 (again) resets reps=0 and interval=1', function (assert) {
    var card = { interval: 15, ease: 2.5, reps: 5, due: 0 };
    var result = srsReview(card, 0);
    assert.equal(result.reps, 0);
    assert.equal(result.interval, 1);
  });

  QUnit.test('quality=1 (hard, grade=3): reps=0 → interval=1', function (assert) {
    var card = { interval: 1, ease: 2.5, reps: 0, due: 0 };
    var result = srsReview(card, 1);
    assert.equal(result.interval, 1);
    assert.equal(result.reps, 1);
  });

  QUnit.test('quality=1 (hard, grade=3): reps=1 → interval=6', function (assert) {
    var card = { interval: 1, ease: 2.5, reps: 1, due: 0 };
    var result = srsReview(card, 1);
    assert.equal(result.interval, 6);
    assert.equal(result.reps, 2);
  });

  QUnit.test('quality=3 (easy, grade=5) increases ease', function (assert) {
    var card = { interval: 1, ease: 2.5, reps: 0, due: 0 };
    var result = srsReview(card, 3);
    assert.ok(result.ease > 2.5, 'ease increases on quality=3 (perfect)');
  });

  QUnit.test('ease is never below 1.3', function (assert) {
    var card = { interval: 1, ease: 1.3, reps: 2, due: 0 };
    for (var i = 0; i < 5; i++) {
      card = srsReview(card, 1); // quality=1 (grade 3) decreases ease
      assert.ok(card.ease >= 1.3, 'ease must never drop below 1.3 (iteration ' + (i + 1) + ')');
    }
  });

  QUnit.test('returns a new card object (does not mutate input)', function (assert) {
    var card = { interval: 6, ease: 2.5, reps: 2, due: 0 };
    var original = { interval: 6, ease: 2.5, reps: 2, due: 0 };
    var result = srsReview(card, 3);
    assert.deepEqual(card, original, 'input card should not be mutated');
    assert.notStrictEqual(result, card, 'result should be a new object');
  });

  QUnit.test('due date is set to interval days from now', function (assert) {
    var before = Date.now();
    // reps=1 → interval becomes 6
    var card = { interval: 1, ease: 2.5, reps: 1, due: 0 };
    var result = srsReview(card, 1); // grade 3
    var after = Date.now();
    var msPerDay = 86400000;
    assert.ok(
      result.due >= before + 6 * msPerDay && result.due <= after + 6 * msPerDay,
      'due is approximately 6 days from now'
    );
  });
});


// ── 10. srsAddCards(dayLesson, cards) ────────────────────────────────────────
