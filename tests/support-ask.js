"use strict";

// Donation jar soft prompt (lib.js): which passes are milestones, and when it may show.
QUnit.module('support-ask', function () {
  var DAY = 86400000;
  var UNITS_X = [
    { id: 'a', level: 'N5', kind: 'lesson' }, { id: 'b', level: 'N5', kind: 'review' },
    { id: 'c', level: 'N5', kind: 'prep' }, { id: 'd', level: 'N5', kind: 'mock' },
    { id: 'e', level: 'N5', kind: 'mock' }, { id: 'f', level: 'N4', kind: 'lesson' }
  ];

  QUnit.test('supportMilestone: lesson/prep none, review, mock, last unit of the level wins', function (assert) {
    assert.strictEqual(supportMilestone(UNITS_X[0], UNITS_X), null);
    assert.strictEqual(supportMilestone(UNITS_X[1], UNITS_X), 'review');
    assert.strictEqual(supportMilestone(UNITS_X[2], UNITS_X), null);
    assert.strictEqual(supportMilestone(UNITS_X[3], UNITS_X), 'mock');
    assert.strictEqual(supportMilestone(UNITS_X[4], UNITS_X), 'level', 'last N5 unit is a mock but counts as the level');
    assert.strictEqual(supportMilestone(UNITS_X[5], UNITS_X), 'level', 'a one-unit level ends on its only unit');
  });

  QUnit.test('shouldAskSupport: needs a milestone, not dismissed, 14 days since last ask', function (assert) {
    var now = 100 * DAY;
    assert.notOk(shouldAskSupport(null, {}, now), 'no milestone');
    assert.ok(shouldAskSupport('review', null, now), 'first time');
    assert.ok(shouldAskSupport('review', {}, now));
    assert.notOk(shouldAskSupport('review', { dismissed: true }, now), 'dismissed for good');
    assert.notOk(shouldAskSupport('mock', { lastAskedAt: now - 13 * DAY }, now), 'asked 13 days ago');
    assert.ok(shouldAskSupport('mock', { lastAskedAt: now - 14 * DAY }, now), 'asked 14 days ago');
  });
});
