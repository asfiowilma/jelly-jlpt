"use strict";

// dayPlan (lib.js): the Today checklist from pace + progress.
QUnit.module('day-plan', function () {
  var NOW = new Date(2026, 4, 10, 15, 0).getTime();
  var DAY = 86400000;
  var u = function (n) { return { id: 'u' + n, index: n - 1, title: 'Stage ' + n }; };
  var card = function (id, due) { return { id: id, due: due, interval: 1, ease: 2.5, reps: 0 }; };
  // n cards due `ago` ms before NOW
  var cards = function (n, ago, tag) {
    var c = {};
    for (var i = 0; i < n; i++) c[(tag || 'c') + i] = card((tag || 'c') + i, NOW - ago);
    return c;
  };
  var plan = function (o) { return dayPlan(Object.assign({ pace: 1, now: NOW, cards: {}, doneToday: [], ahead: [u(1), u(2), u(3)], lastStageDate: null, reviewedToday: 0 }, o)); };
  var shape = function (p) { return p.steps.map(function (s) { return s.kind + ':' + s.status; }).join(' '); };

  QUnit.test('pace 1, start of day: stage now, review next, complete next', function (assert) {
    var p = plan({ cards: cards(4, 1000) });
    assert.equal(shape(p), 'stage:now review:next complete:next');
    assert.strictEqual(p.done, false);
    assert.strictEqual(p.due, 4);
    assert.equal(p.steps[0].unit.id, 'u1');
  });

  QUnit.test('stage passed: review is now (its cards are due at once)', function (assert) {
    var p = plan({ doneToday: [u(1)], ahead: [u(2)], cards: cards(12, 1000) });
    assert.equal(shape(p), 'stage:done review:now complete:next');
  });

  QUnit.test('stage passed and review cleared: day complete', function (assert) {
    var p = plan({ doneToday: [u(1)], ahead: [u(2)], reviewedToday: 12 });
    assert.equal(shape(p), 'stage:done review:done complete:done');
    assert.strictEqual(p.done, true);
  });

  QUnit.test('pace 2: both stages first, one review at the end', function (assert) {
    var p = plan({ pace: 2, doneToday: [u(1)], ahead: [u(2), u(3)], cards: cards(6, 1000) });
    assert.equal(shape(p), 'stage:done stage:now review:next complete:next');
    assert.equal(p.stageTarget, 2);
  });

  QUnit.test('pace 0.5: day after a stage is a rest day (review only, stage row informational)', function (assert) {
    var p = plan({ pace: 0.5, lastStageDate: '2026-05-09', cards: cards(9, 1000) });
    assert.equal(shape(p), 'review:now stage:rest complete:next');
    assert.strictEqual(p.rest, true);
    assert.equal(p.nextStageIn, 1);
  });

  QUnit.test('pace 0.5: two days after a stage is a stage day again', function (assert) {
    var p = plan({ pace: 0.5, lastStageDate: '2026-05-08' });
    assert.strictEqual(p.rest, false);
    assert.equal(p.steps[0].kind, 'stage');
  });

  QUnit.test('rest day with nothing due is already complete', function (assert) {
    var p = plan({ pace: 0.5, lastStageDate: '2026-05-09' });
    assert.strictEqual(p.done, true);
  });

  QUnit.test('backlog: 20+ cards overdue sends review first', function (assert) {
    var p = plan({ cards: cards(34, 2 * DAY) });
    assert.strictEqual(p.backlog, true);
    assert.equal(shape(p), 'review:now stage:next complete:next');
  });

  QUnit.test('cards due today (not overdue) never make a backlog, however many', function (assert) {
    var p = plan({ doneToday: [u(1)], cards: cards(40, 1000) });
    assert.strictEqual(p.backlog, false);
    assert.equal(shape(p), 'stage:done review:now complete:next');
  });

  QUnit.test('day 1, no cards: review waits behind the stage and is not done', function (assert) {
    var p = plan({});
    assert.equal(shape(p), 'stage:now review:next complete:next');
  });

  QUnit.test('every stage done: level end, nothing due = day complete; due cards still get a review', function (assert) {
    var p = plan({ ahead: [] });
    assert.strictEqual(p.levelEnd, true);
    assert.strictEqual(p.done, true);
    assert.equal(shape(plan({ ahead: [], cards: cards(3, 1000) })), 'review:now complete:next');
  });

  QUnit.test('realCompletions: passed stages only (skipped and undone are out), oldest first', function (assert) {
    var docs = [
      { _id: 'unit:b', done: true, completedAt: 20 },
      { _id: 'unit:a', done: true, completedAt: 10 },
      { _id: 'unit:s', done: true, skipped: true, completedAt: 5 },
      { _id: 'unit:n', done: false, completedAt: null },
      { _id: 'prefs:learning' }
    ];
    assert.deepEqual(realCompletions(docs), [{ id: 'a', at: 10 }, { id: 'b', at: 20 }]);
  });

  QUnit.test('quizHandoff: review first when the stage target is met, next stage first when it is not', function (assert) {
    var units = [u(1), u(2), u(3)].map(function (x) { return Object.assign({ level: 'N5' }, x); });
    var h = { nextStage: function () {}, openStage: function () {}, review: function () {}, today: function () {} };
    var met = quizHandoff(plan({ doneToday: [u(1)], ahead: [u(2)], cards: cards(12, 1000) }), units[0], units, h);
    assert.equal(met.primary.label, 'Review 12 cards now');
    assert.equal(met.secondary.label, t('nav_next_stage', 'N5'));
    assert.equal(met.line, "Today: 1 / 1 stages ✓. Review left, then you're done.");
    var two = quizHandoff(plan({ pace: 2, doneToday: [u(1)], ahead: [u(2), u(3)], cards: cards(12, 1000) }), units[0], units, h);
    assert.equal(two.primary.label, 'Start stage 2');
    assert.equal(two.secondary.label, 'Review 12 cards');
    assert.equal(two.line, 'Today: 1 / 2 stages. One more, then review.');
    var done = quizHandoff(plan({ doneToday: [u(1)], ahead: [u(2)], reviewedToday: 3 }), units[0], units, h);
    assert.equal(done.primary.label, 'Back to Today');
    assert.equal(done.line, "Today: 1 / 1 stages ✓. That's today done.");
  });

  QUnit.test('foldDoneStages: merges done stages into one step above the limit, keeps order', function (assert) {
    var d = [u(1), u(2), u(3), u(4)];
    var p = plan({ pace: 2, doneToday: d, ahead: [u(5)], cards: cards(5, 1000) });
    assert.equal(foldDoneStages(p.steps, 4), p.steps, 'at the limit: untouched');
    var f = foldDoneStages(p.steps, 3);
    assert.deepEqual(f.map(function (s) { return s.kind; }), ['fold', 'review', 'complete']);
    assert.equal(f[0].status, 'done');
    assert.equal(f[0].units.length, 4);
    assert.equal(p.steps.length, 6, 'input not mutated');
    var b = plan({ doneToday: d, ahead: [u(5)], cards: cards(30, 3 * DAY) });
    assert.ok(b.backlog);
    assert.deepEqual(foldDoneStages(b.steps, 3).map(function (s) { return s.kind; }), ['review', 'fold', 'complete']);
  });

  QUnit.test('quizHandoff: a grind day reads capped, never "21 / 2"', function (assert) {
    var many = [];
    for (var i = 1; i <= 21; i++) many.push(u(i));
    var units = [u(1), u(2)].map(function (x) { return Object.assign({ level: 'N5' }, x); });
    var h = { nextStage: function () {}, openStage: function () {}, review: function () {}, today: function () {} };
    var r = quizHandoff(plan({ pace: 2, doneToday: many, ahead: [u(22)], reviewedToday: 3 }), units[0], units, h);
    assert.equal(r.line, "Today: 2 / 2 stages ✓. That's today done.");
  });
});
