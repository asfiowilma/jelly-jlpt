"use strict";

// Stats view helpers (lib.js): maturity, due forecast, retention, heatmap.
QUnit.module('stats', function () {
  var DAY = 86400000;
  var NOW = new Date(2026, 9, 3, 15, 0).getTime(); // 2026-10-03 local, mid-afternoon
  var card = function (type, interval, reps, due, last) {
    return { type: type, interval: interval, reps: reps, due: due, ease: 2.5, lastReviewedAt: last };
  };
  var log = function (date, count, again, lessons) {
    return { _id: 'log:' + date + ':d1', date: date, lessons: lessons || [], quizzes: [], reviews: { count: count, again: again } };
  };

  QUnit.test('srsStats: empty deck', function (assert) {
    var s = srsStats({});
    assert.strictEqual(s.total, 0);
    assert.deepEqual([s.new, s.learning, s.young, s.mature], [0, 0, 0, 0]);
    assert.deepEqual(s.byType.vocab, [0, 0, 0, 0]);
  });

  QUnit.test('srsStats: stages by interval, lapsed card is learning, per type', function (assert) {
    var s = srsStats({
      a: card('vocab', 1, 0, NOW, 0),          // never reviewed → new
      b: card('vocab', 1, 0, NOW, NOW - DAY),  // lapsed (Again) → learning
      c: card('kanji', 6, 2, NOW, NOW),        // learning
      d: card('kanji', 7, 3, NOW, NOW),        // young
      e: card('grammar', 20, 3, NOW, NOW),     // young
      f: card('grammar', 21, 4, NOW, NOW),     // mature
      g: card('kana', 60, 5, NOW, NOW)         // mature
    });
    assert.strictEqual(s.total, 7);
    assert.deepEqual([s.new, s.learning, s.young, s.mature], [1, 2, 2, 2]);
    assert.deepEqual(s.byType.vocab, [1, 1, 0, 0]);
    assert.deepEqual(s.byType.kanji, [0, 1, 1, 0]);
    assert.deepEqual(s.byType.grammar, [0, 0, 1, 1]);
    assert.deepEqual(s.byType.kana, [0, 0, 0, 1]);
  });

  QUnit.test('srsStats: all new', function (assert) {
    var cards = {};
    var unit = { vocab: [], kanji: [], grammar: [], kana: [{ id: 'c:あ', char: 'あ', romaji: ['a'] }] };
    srsAddCards(unit, cards);
    var s = srsStats(cards);
    assert.deepEqual([s.total, s.new, s.mature], [1, 1, 0]);
  });

  QUnit.test('dueForecast: overdue vs today vs later days; window bounds', function (assert) {
    var mid = new Date(2026, 9, 3).getTime();
    var f = dueForecast({
      a: card('vocab', 1, 1, mid - 1),                         // yesterday 23:59:59 → overdue
      b: card('vocab', 1, 1, mid - 5 * DAY),                   // overdue
      c: card('vocab', 1, 1, mid),                             // today 00:00
      d: card('vocab', 1, 1, new Date(2026, 9, 3, 23, 59).getTime()), // later today
      e: card('vocab', 1, 1, new Date(2026, 9, 4, 0, 0).getTime()),   // tomorrow
      f: card('vocab', 1, 1, new Date(2026, 9, 16, 12).getTime()),    // day 13 (last)
      g: card('vocab', 1, 1, new Date(2026, 9, 17).getTime())         // past the window
    }, NOW);
    assert.strictEqual(f.overdue, 2);
    assert.strictEqual(f.perDay.length, 14);
    assert.strictEqual(f.perDay[0], 2, 'today counts earlier + later today');
    assert.strictEqual(f.perDay[1], 1);
    assert.strictEqual(f.perDay[13], 1);
    assert.strictEqual(f.perDay.reduce(function (a, b) { return a + b; }, 0), 4, 'beyond window dropped');
  });

  QUnit.test('dueForecast: empty deck, custom window', function (assert) {
    assert.deepEqual(dueForecast({}, NOW, 3), { overdue: 0, perDay: [0, 0, 0] });
  });

  QUnit.test('dueForecast: day boundaries are local midnights across a DST change', function (assert) {
    // Bounds come from calendar fields, so each bucket starts at local 00:00
    // even when a day is 23 or 25 hours long (whatever zone runs the test).
    var start = new Date(2026, 2, 1, 12).getTime(); // spans March (US/EU spring-forward)
    var cards = {};
    for (var i = 0; i < 40; i++) cards['x' + i] = card('vocab', 1, 1, new Date(2026, 2, 1 + i, 0, 0).getTime());
    var f = dueForecast(cards, start, 40);
    assert.ok(f.perDay.every(function (n) { return n === 1; }), 'one card per local day');
    assert.strictEqual(dayStart(start, 30), new Date(2026, 2, 31).getTime());
  });

  QUnit.test('retention: last N days ending today; null without reviews', function (assert) {
    var logs = [
      log('2026-10-03', 10, 1),
      log('2026-09-04', 10, 9),   // day 30 back (inclusive)
      log('2026-09-03', 100, 100) // 31 days back → outside
    ];
    var r = retention(logs, '2026-10-03', 30);
    assert.deepEqual([r.reviews, r.again], [20, 10]);
    assert.strictEqual(r.rate, 0.5);
    assert.strictEqual(retention([], '2026-10-03', 30).rate, null);
    assert.strictEqual(retention([log('2026-10-03', 0, 0, ['n5.u001'])], '2026-10-03').rate, null, 'lessons only → null');
  });

  QUnit.test('retention: sums devices for one day', function (assert) {
    var a = log('2026-10-02', 4, 1), b = log('2026-10-02', 6, 1);
    b._id = 'log:2026-10-02:d2';
    assert.strictEqual(retention([a, b], '2026-10-03', 30).rate, 0.8);
  });

  QUnit.test('weeklyRetention: oldest first, last week ends today, null for empty weeks', function (assert) {
    var w = weeklyRetention([log('2026-10-03', 4, 1), log('2026-09-27', 2, 0), log('2026-09-26', 10, 5)], '2026-10-03', 3);
    assert.deepEqual(w, [null, 0.5, 0.8333333333333334]);
    assert.deepEqual(weeklyRetention([], '2026-10-03'), Array(12).fill(null));
  });

  QUnit.test('studyHeatmap: 52×7 cells from a Sunday, levels, future cells', function (assert) {
    var cells = studyHeatmap([log('2026-10-03', 10, 0), log('2026-10-01', 0, 0, ['n5.u001', 'n5.u002']), log('2026-09-30', 100, 3)], '2026-10-03');
    assert.strictEqual(cells.length, 364);
    assert.strictEqual(new Date(cells[0].date + 'T12:00').getDay(), 0, 'starts on a Sunday');
    var by = {};
    cells.forEach(function (c) { by[c.date] = c; });
    assert.strictEqual(by['2026-10-03'].level, 1);
    assert.strictEqual(by['2026-10-01'].level, 2, '2 units = 40');
    assert.strictEqual(by['2026-09-30'].level, 4);
    assert.strictEqual(by['2026-10-02'].level, 0);
    assert.notOk(by['2026-10-03'].future);
    assert.strictEqual(cells[cells.length - 1].date, '2026-10-03', 'today is a Saturday → last cell');
    var c2 = studyHeatmap([], '2026-10-01', 2);
    assert.strictEqual(c2.length, 14);
    assert.deepEqual(c2.filter(function (c) { return c.future; }).map(function (c) { return c.date; }), ['2026-10-02', '2026-10-03']);
  });

  QUnit.test('studyHeatmap: consecutive dates across DST', function (assert) {
    var cells = studyHeatmap([], '2026-04-04', 8);
    for (var i = 1; i < cells.length; i++) {
      assert.strictEqual(dateToDayIndex(cells[i].date) - dateToDayIndex(cells[i - 1].date), 1, cells[i].date);
    }
  });
});
