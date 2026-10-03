"use strict";

// Dated activity log (log:* docs): lib.js helpers + Store.log*. Run headlessly by
// .claude/hooks/run-tests.js through a minimal QUnit shim (same file, no copy).
QUnit.module('activity-log', function () {
  function fakeLs(init) {
    var d = Object.assign({}, init);
    return {
      get: function (k) { return Object.prototype.hasOwnProperty.call(d, k) ? d[k] : null; },
      set: function (k, v) { d[k] = String(v); }
    };
  }
  function memStore(backend) {
    return createStore({
      ls: fakeLs({ jlpt_device_id: 'devA' }),
      openBackend: function () { return Promise.resolve(backend || memoryBackend()); }
    });
  }
  function log(date, dev, body) {
    return Object.assign({ _id: 'log:' + date + ':' + dev, date: date, updatedAt: 1, deviceId: dev }, body);
  }
  // Two devices, overlapping dates; devB's 05-02 doc is missing fields (older writer).
  var LOGS = [
    log('2026-05-01', 'devA', { lessons: ['n5.u001'], quizzes: [{ unit: 'n5.u001', right: 3, total: 5, at: 200 }], reviews: { count: 4, again: 1 } }),
    log('2026-05-01', 'devB', { lessons: ['n5.u001', 'n5.u002'], quizzes: [{ unit: 'n5.u001', right: 5, total: 5, at: 100 }], reviews: { count: 2, again: 0 } }),
    log('2026-05-02', 'devB', { reviews: { count: 3 } }),
    log('2026-05-04', 'devA', { lessons: [], quizzes: [], reviews: { count: 0, again: 0 } }) // empty day
  ];

  QUnit.test('localDate: local calendar date, zero-padded', function (assert) {
    assert.strictEqual(localDate(new Date(2026, 0, 5, 23, 59)), '2026-01-05');
  });

  QUnit.test('aggregateLogs: merges devices per date, missing fields = empty', function (assert) {
    var agg = aggregateLogs(LOGS);
    assert.deepEqual(agg['2026-05-01'].lessons, ['n5.u001', 'n5.u002'], 'unique lessons');
    assert.deepEqual(agg['2026-05-01'].quizzes.map(function (q) { return q.at; }), [100, 200], 'quizzes sorted by at');
    assert.deepEqual(agg['2026-05-01'].reviews, { count: 6, again: 1 });
    assert.deepEqual(agg['2026-05-02'], { lessons: [], quizzes: [], reviews: { count: 3, again: 0 } });
  });

  QUnit.test('studyDates: sorted unique dates with any activity', function (assert) {
    assert.deepEqual(studyDates(LOGS), ['2026-05-01', '2026-05-02']);
    assert.deepEqual(studyDates([]), []);
  });

  QUnit.test('computeStreak: today, yesterday, gap, longest', function (assert) {
    var d = ['2026-04-28', '2026-04-29', '2026-04-30', '2026-05-01', '2026-05-03', '2026-05-04'];
    assert.deepEqual(computeStreak(d, '2026-05-04'), { current: 2, longest: 4 }, 'counts back from today');
    assert.deepEqual(computeStreak(d, '2026-05-05'), { current: 2, longest: 4 }, 'nothing today yet → from yesterday');
    assert.deepEqual(computeStreak(d, '2026-05-06'), { current: 0, longest: 4 }, 'gap → 0');
    assert.deepEqual(computeStreak(['2026-03-31', '2026-02-28', '2026-03-01', '2026-03-31'], '2026-03-01'),
      { current: 2, longest: 2 }, 'month boundary, unsorted + duplicate input');
    assert.deepEqual(computeStreak(['2026-03-28', '2026-03-29', '2026-03-30'], '2026-03-30'),
      { current: 3, longest: 3 }, 'across a DST change');
    assert.deepEqual(computeStreak([], '2026-05-01'), { current: 0, longest: 0 });
  });

  QUnit.test('activityTotals: lifetime lessons/quizzes/perfect/reviews', function (assert) {
    assert.deepEqual(activityTotals(LOGS), { lessons: 2, quizzes: 2, perfectQuizzes: 1, reviews: 9, overrides: 0 });
    var withOverride = LOGS.concat([log('2026-05-05', 'devA', { quizzes: [{ unit: 'n5.u002', right: 9, total: 10, at: 300, overrides: 2 }] })]);
    assert.equal(activityTotals(withOverride).overrides, 2, '"I was right" overrides counted');
  });

  QUnit.test('firstQuizAttempts: earliest entry per lesson across devices', function (assert) {
    var first = firstQuizAttempts(LOGS);
    assert.deepEqual(Object.keys(first), ['n5.u001']);
    assert.deepEqual([first['n5.u001'].right, first['n5.u001'].at], [5, 100], 'devB attempt came first');
  });

  QUnit.test('Store: log writes append to today\'s doc for this device', function (assert) {
    var backend = memoryBackend();
    var s = memStore(backend);
    var id = 'log:' + localDate() + ':devA';
    return s.init().then(function () {
      s.logLesson('n5.u002');
      s.logLesson('n5.u002'); // re-marking the same unit is not a second lesson
      s.logQuiz('n5.u002', 4, 5);
      s.logReview(0);
      s.logReview(2);
      return s.flush();
    }).then(function () {
      return memStore(backend).init().then(function () { return backend.loadAll(); });
    }).then(function (docs) {
      var d = docs.filter(function (x) { return x._id === id; })[0];
      assert.ok(d, 'persisted ' + id);
      assert.deepEqual(d.lessons, ['n5.u002']);
      assert.deepEqual([d.quizzes.length, d.quizzes[0].unit, d.quizzes[0].right, d.quizzes[0].total], [1, 'n5.u002', 4, 5]);
      assert.strictEqual(typeof d.quizzes[0].at, 'number');
      assert.deepEqual(d.reviews, { count: 2, again: 1 });
      assert.strictEqual(d.deviceId, 'devA');
      assert.deepEqual(computeStreak(studyDates(s.logs()), localDate()), { current: 1, longest: 1 });
    });
  });

  QUnit.test('Store: export v3 → validate → import round-trips log docs', function (assert) {
    var s = memStore();
    return s.init().then(function () {
      s.logQuiz('n5.u003', 2, 3);
      var file = JSON.parse(JSON.stringify(exportProgress(s.docs().concat(LOGS), function () { return null; })));
      var check = validateProgressData(file);
      assert.ok(check.valid, check.error);
      var s2 = memStore();
      return s2.init().then(function () {
        return s2.replaceAll(progressFileToDocs(file).docs);
      }).then(function () {
        assert.strictEqual(s2.logs().length, LOGS.length + 1, 'all log docs imported');
        assert.deepEqual(activityTotals(s2.logs()), { lessons: 2, quizzes: 3, perfectQuizzes: 1, reviews: 9, overrides: 0 });
      });
    });
  });

  QUnit.test('validateProgressData: log doc id/date checks', function (assert) {
    function v(doc) { return validateProgressData({ version: 3, docs: [doc] }).valid; }
    assert.ok(v(log('2026-05-01', 'a1b2-c3', {})));
    assert.notOk(v(Object.assign(log('2026-05-01', 'a', {}), { date: '2026-05-02' })), 'date mismatch');
    assert.notOk(v(log('2026-5-1', 'a', {})), 'bad date in id');
  });
});
