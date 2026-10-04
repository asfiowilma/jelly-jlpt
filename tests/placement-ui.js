"use strict";

// Roadmap ticket 39: pure helpers behind the welcome screen and the placement result screen.
QUnit.module('placement UI helpers', function () {
  var units = function () { return buildUnits(PLAN, CATALOG); };
  var teaching = function (us) { return us.filter(function (u) { return u.kind === 'kana' || u.kind === 'lesson'; }); };

  QUnit.test('progressIsEmpty: only unit / card / log / mock docs count', function (assert) {
    assert.strictEqual(progressIsEmpty([]), true);
    assert.strictEqual(progressIsEmpty([{ _id: 'prefs:learning' }, { _id: 'ach:first-steps' }]), true, 'prefs and unlocks are written on first open');
    ['unit:n5.u001', 'card:v:x|y', 'log:2026-01-01:d1', 'mock:x:n5-mock-1:5'].forEach(function (id) {
      assert.strictEqual(progressIsEmpty([{ _id: 'prefs:learning' }, { _id: id }]), false, id);
    });
    assert.strictEqual(progressIsEmpty([{ _id: 'unit:n5.u001', done: false }]), false, 'an un-marked unit doc is still progress');
  });

  QUnit.test('examDateError: real dates today or later only', function (assert) {
    var now = new Date(2026, 9, 4, 15).getTime();
    assert.strictEqual(examDateError('2027-07-04', now), null);
    assert.strictEqual(examDateError('2026-10-04', now), null, 'today is fine');
    assert.strictEqual(examDateError('2026-10-03', now), 'past');
    assert.strictEqual(examDateError('2027-02-30', now), 'bad');
    assert.strictEqual(examDateError('2027-7-4', now), 'bad');
    assert.strictEqual(examDateError('', now), 'bad');
    assert.strictEqual(examDateError(null, now), 'bad');
  });

  QUnit.test('placementScope: first take = everything, retake = after the furthest done teaching stage', function (assert) {
    var us = units(), t = teaching(us);
    assert.strictEqual(placementScope(us, new Set()).length, us.length);
    var done = new Set([t[0].id, t[4].id]);
    var scope = placementScope(us, done);
    assert.strictEqual(scope[0].index, t[4].index + 1, 'starts right after the furthest done stage');
    assert.strictEqual(scope.length, us.length - t[4].index - 1);
    var review = us.filter(function (u) { return u.kind === 'review'; })[0];
    assert.strictEqual(placementScope(us, new Set([review.id])).length, us.length, 'a done review unit does not move the floor');
    assert.strictEqual(teaching(placementScope(us, new Set(t.map(function (u) { return u.id; })))).length, 0, 'every teaching stage done = nothing to search');
  });

  QUnit.test('placementTrim: start earlier marks fewer stages, never more', function (assert) {
    var t = teaching(units());
    var res = { passedStageIds: [t[0].id, t[1].id, t[3].id], holeStageIds: [t[2].id], startStageId: t[4].id, log: [] };
    var cut = placementTrim(res, t, 2);
    assert.deepEqual(cut.passedStageIds, [t[0].id, t[1].id]);
    assert.deepEqual(cut.holeStageIds, [], 'a hole at or after the new start is just part of the path');
    assert.strictEqual(cut.startStageId, t[2].id);
    var keep = placementTrim(res, t, 4);
    assert.deepEqual(keep.passedStageIds, res.passedStageIds);
    assert.deepEqual(keep.holeStageIds, res.holeStageIds);
    var zero = placementApply(placementTrim(res, t, 0), units());
    assert.deepEqual(zero.doneIds, []);
    assert.deepEqual(zero.cardItems, []);
  });

  QUnit.test('placementReviewsWaiting: open review units before the start only', function (assert) {
    var us = units(), reviews = us.filter(function (u) { return u.kind === 'review'; });
    var second = reviews[1];
    assert.strictEqual(placementReviewsWaiting(us, 0, new Set()).length, 0);
    assert.strictEqual(placementReviewsWaiting(us, second.index, new Set()).length, 1, 'the second review is not before itself');
    assert.strictEqual(placementReviewsWaiting(us, second.index + 1, new Set()).length, 2);
    assert.strictEqual(placementReviewsWaiting(us, second.index + 1, new Set([reviews[0].id])).length, 1, 'done ones are not waiting');
    assert.strictEqual(placementReviewsWaiting(us, us.length, new Set()).length, reviews.length);
  });
});
