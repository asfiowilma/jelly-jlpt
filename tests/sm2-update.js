"use strict";


// ── 1. SM-2 Algorithm — sm2Update(card, grade) ───────────────────────────────
QUnit.module('sm2Update', function () {

  QUnit.test('null card uses SM-2 defaults (ef=2.5, interval=1, reps=0)', function (assert) {
    var result = sm2Update(null, 3);
    assert.equal(result.reps, 1, 'reps increments from 0 to 1');
    assert.equal(result.interval, 1, 'reps was 0, so interval stays 1');
    assert.ok(typeof result.due === 'number', 'due is a number');
  });

  QUnit.test('grade >= 3, reps=0 → interval=1, reps becomes 1', function (assert) {
    var result = sm2Update({ interval: 1, ef: 2.5, reps: 0 }, 3);
    assert.equal(result.interval, 1);
    assert.equal(result.reps, 1);
  });

  QUnit.test('grade >= 3, reps=1 → interval=6, reps becomes 2', function (assert) {
    var result = sm2Update({ interval: 1, ef: 2.5, reps: 1 }, 3);
    assert.equal(result.interval, 6);
    assert.equal(result.reps, 2);
  });

  QUnit.test('grade >= 3, reps>=2 → interval=round(interval * ef)', function (assert) {
    var card = { interval: 6, ef: 2.5, reps: 2 };
    var result = sm2Update(card, 3);
    assert.equal(result.interval, Math.round(6 * 2.5)); // 15
    assert.equal(result.reps, 3);
  });

  QUnit.test('grade < 3 resets reps to 0 and interval to 1', function (assert) {
    var card = { interval: 15, ef: 2.5, reps: 5 };
    var result = sm2Update(card, 2);
    assert.equal(result.reps, 0);
    assert.equal(result.interval, 1);
  });

  QUnit.test('grade=0 also resets card', function (assert) {
    var result = sm2Update({ interval: 30, ef: 2.5, reps: 10 }, 0);
    assert.equal(result.reps, 0);
    assert.equal(result.interval, 1);
  });

  QUnit.test('grade=5 (perfect) increases EF', function (assert) {
    var result = sm2Update({ interval: 1, ef: 2.5, reps: 1 }, 5);
    assert.ok(result.ef > 2.5, 'EF increases on perfect grade');
  });

  QUnit.test('grade=3 (bare pass) decreases EF', function (assert) {
    var result = sm2Update({ interval: 1, ef: 2.5, reps: 1 }, 3);
    assert.ok(result.ef < 2.5, 'EF decreases on grade 3');
  });

  QUnit.test('EF is never below 1.3 (clamp)', function (assert) {
    // Start at minimum EF and apply grade 3 repeatedly
    var card = { interval: 1, ef: 1.3, reps: 2 };
    for (var i = 0; i < 5; i++) {
      card = sm2Update(card, 3);
      assert.ok(card.ef >= 1.3, 'EF must never drop below 1.3 (iteration ' + (i + 1) + ')');
    }
  });

  QUnit.test('due date is set to interval days from now', function (assert) {
    var before = Date.now();
    // reps=1 → interval becomes 6
    var result = sm2Update({ interval: 1, ef: 2.5, reps: 1 }, 3);
    var after = Date.now();
    var msPerDay = 24 * 60 * 60 * 1000;
    var expectedMin = before + 6 * msPerDay;
    var expectedMax = after + 6 * msPerDay;
    assert.ok(result.due >= expectedMin && result.due <= expectedMax,
      'due is approximately 6 days from now');
  });

  QUnit.test('grade=5 EF formula: ef + 0.1 - 0*(0.08+0*0.02)', function (assert) {
    var card = { interval: 1, ef: 2.5, reps: 0 };
    var result = sm2Update(card, 5);
    var expected = Math.max(1.3, 2.5 + 0.1 - 0 * (0.08 + 0 * 0.02));
    assert.ok(Math.abs(result.ef - expected) < 0.0001, 'EF formula correct for grade 5');
  });

  QUnit.test('grade=4 EF formula: ef + 0.1 - 1*(0.08+1*0.02)', function (assert) {
    var card = { interval: 1, ef: 2.5, reps: 0 };
    var result = sm2Update(card, 4);
    var expected = Math.max(1.3, 2.5 + 0.1 - 1 * (0.08 + 1 * 0.02));
    assert.ok(Math.abs(result.ef - expected) < 0.0001, 'EF formula correct for grade 4');
  });

  QUnit.test('returns a new object, does not mutate input card', function (assert) {
    var card = { interval: 6, ef: 2.5, reps: 2 };
    var original = { interval: 6, ef: 2.5, reps: 2 };
    sm2Update(card, 5);
    assert.deepEqual(card, original, 'input card should not be mutated');
  });
});


// ── 2. Answer Checking — checkTyping(userAns, answers) ───────────────────────
