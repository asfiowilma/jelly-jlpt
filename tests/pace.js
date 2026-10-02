"use strict";

// Pace math (lib.js): today target, units done today, projection, suggested pace, new-card cap.
QUnit.module('pace', function () {
  var NOW = new Date(2026, 4, 10, 15, 0); // 2026-05-10 local, mid-afternoon

  QUnit.test('todayTarget: ceil(pace) units; casual = 1 unit every 2 days', function (assert) {
    assert.deepEqual(todayTarget(0.5), { units: 1, everyDays: 2 });
    assert.deepEqual(todayTarget(1), { units: 1, everyDays: 1 });
    assert.deepEqual(todayTarget(2), { units: 2, everyDays: 1 });
    assert.deepEqual(todayTarget(3), { units: 3, everyDays: 1 });
  });

  QUnit.test('unitsDoneToday: counts done unit docs completed on the local date of now', function (assert) {
    var docs = [
      { _id: 'unit:n5.u001', done: true, completedAt: new Date(2026, 4, 10, 0, 5).getTime() },
      { _id: 'unit:n5.u002', done: true, completedAt: new Date(2026, 4, 10, 23, 55).getTime() },
      { _id: 'unit:n5.u003', done: true, completedAt: new Date(2026, 4, 9, 23, 59).getTime() }, // yesterday
      { _id: 'unit:n5.u004', done: false, completedAt: null },
      { _id: 'prefs:learning', pace: 2, updatedAt: NOW.getTime() }
    ];
    assert.strictEqual(unitsDoneToday(docs, NOW), 2);
    assert.strictEqual(unitsDoneToday([], NOW), 0);
  });

  QUnit.test('projectFinish: today + ceil(remaining / pace) calendar days', function (assert) {
    assert.strictEqual(localDate(projectFinish(10, 1, NOW)), '2026-05-20');
    assert.strictEqual(localDate(projectFinish(10, 3, NOW)), '2026-05-14', '4 days at 3/day');
    assert.strictEqual(localDate(projectFinish(3, 0.5, NOW)), '2026-05-16', '6 days at 0.5/day');
    assert.strictEqual(localDate(projectFinish(0, 1, NOW)), '2026-05-10', 'nothing left = today');
    assert.strictEqual(localDate(projectFinish(30, 1, NOW)), '2026-06-09', 'crosses month');
  });

  QUnit.test('suggestPace: slowest mode finishing ≥ 7 days before the exam, else null', function (assert) {
    // exam 2026-06-09 → 30 days away → 23 days to work with
    assert.strictEqual(suggestPace(10, '2026-06-09', NOW), 0.5, '20 days at casual fits');
    assert.strictEqual(suggestPace(23, '2026-06-09', NOW), 1, '23 days at standard fits exactly');
    assert.strictEqual(suggestPace(24, '2026-06-09', NOW), 2);
    assert.strictEqual(suggestPace(69, '2026-06-09', NOW), 3);
    assert.strictEqual(suggestPace(70, '2026-06-09', NOW), null, 'even super can not make it');
    assert.strictEqual(suggestPace(5, '2026-05-01', NOW), null, 'exam already past');
    assert.strictEqual(suggestPace(0, '2026-05-01', NOW), 0.5, 'nothing left = casual');
  });

  QUnit.test('newCardCap: items introduced by the next ceil(pace) units', function (assert) {
    var units = [
      { vocab: [1, 2], kanji: [3], grammar: [] },
      { vocab: [1], kanji: [], grammar: [4, 5] },
      { vocab: [1, 2, 3, 4], kanji: [], grammar: [] }
    ];
    assert.strictEqual(newCardCap(0.5, units), 3);
    assert.strictEqual(newCardCap(1, units), 3);
    assert.strictEqual(newCardCap(2, units), 6);
    assert.strictEqual(newCardCap(3, units), 10);
    assert.strictEqual(newCardCap(3, units.slice(2)), 4, 'fewer units left than the pace');
  });

  QUnit.test('PacePanel renders with and without an exam date', function (assert) {
    if (typeof PacePanel !== 'function') { assert.ok(true, 'components not loaded'); return; }
    var units = buildUnits(PLAN, CATALOG);
    ['2026-12-06', '2020-01-01', null].forEach(function (exam) {
      PacePanel({ units: units, completed: new Set([units[0].id]), level: units[0].level, pace: 2, doneToday: 1, examDate: exam });
    });
    assert.ok(paceTodayLine(0.5, 0, 'N5').indexOf('0 / 1') !== -1);
  });

  QUnit.test('PACE_MODES: casual 0.5 / standard 1 / intensive 2 / super 3', function (assert) {
    assert.deepEqual(PACE_MODES.map(function (m) { return m.pace; }), [0.5, 1, 2, 3]);
  });
});
