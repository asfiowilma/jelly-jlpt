"use strict";

QUnit.module('mastery challenge engine', function () {
  function seeded() { var s = 12345; return function () { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }; }
  function mk(id, kind) { return { id: id, level: 'N5', kind: kind || 'lesson' }; }
  function stagesOf(n) { var a = []; for (var i = 1; i <= n; i++) a.push(mk('t.s' + i)); return a; }
  function itemsN(n) { return function (u) { var a = []; for (var i = 0; i < n; i++) a.push({ kind: 'vocab', id: u.id + '.' + i }); return a; }; }
  function count(qs) { var o = {}; qs.forEach(function (q) { o[q.stage] = (o[q.stage] || 0) + 1; }); return o; }
  function allRight(qs) { return qs.map(function () { return true; }); }
  function doc(id, extra) { return Object.assign({ _id: 'unit:' + id, done: true, completedAt: 1 }, extra || {}); }
  function run(pool, missed, n) { return challengeCompose(pool, missed, seeded(), itemsN(n || 10)); }
  function idsOf(pool) { return pool.map(function (u) { return u.id; }); }
  function isStageKind(k) { return k === 'lesson' || k === 'kana'; }

  QUnit.test('a perfect run of a stage marks its unit done with completedAt', function (assert) {
    var qs = run(stagesOf(1), [], 6).questions;
    assert.deepEqual(challengeApply(challengeScore(qs, allRight(qs)), [], 777), [{ _id: 'unit:t.s1', done: true, completedAt: 777 }]);
  });

  QUnit.test('a failed retry after a clear keeps the stage done', function (assert) {
    var qs = run(stagesOf(1), [], 6).questions, correct = allRight(qs);
    correct[0] = false;
    assert.deepEqual(challengeApply(challengeScore(qs, correct), [doc('t.s1', { completedAt: 5 })], 900), [], 'nothing written, so the earlier clear stands');
  });

  QUnit.test('a missed stage stays not done after a failed run', function (assert) {
    var qs = run(stagesOf(1), [], 6).questions, correct = allRight(qs);
    correct[2] = false;
    assert.deepEqual(challengeApply(challengeScore(qs, correct), [], 900), []);
  });

  QUnit.test('a later perfect run clears a stage that was missed before', function (assert) {
    var stages = stagesOf(1), first = run(stages, [], 6).questions, bad = allRight(first);
    bad[0] = false;
    var rec = challengeRecord('n5', 'incomplete', stages, challengeScore(first, bad), 100);
    assert.deepEqual(rec.missed, ['t.s1']);
    var again = challengeRetake(rec, stages, [], seeded(), itemsN(6)).questions;
    assert.deepEqual(challengeApply(challengeScore(again, allRight(again)), [], 200), [{ _id: 'unit:t.s1', done: true, completedAt: 200 }]);
  });

  QUnit.test('the retry of a missed stage asks every item of the stage, not only the missed questions', function (assert) {
    var c = challengeCompose(stagesOf(6), ['t.s3'], seeded(), itemsN(12));
    assert.strictEqual(count(c.questions)['t.s3'], 12);
    var asked = c.questions.filter(function (q) { return q.stage === 't.s3'; }).map(function (q) { return q.item.id; }).sort();
    assert.deepEqual(asked, itemsN(12)(mk('t.s3')).map(function (i) { return i.id; }).sort());
  });

  QUnit.test('a retake puts missed stages in the run with their full sets and fresh stages with smaller shares', function (assert) {
    var stages = stagesOf(8), rec = { level: 'n5', mode: 'whole', pool: idsOf(stages), missed: ['t.s7', 't.s8'] };
    var n = count(challengeRetake(rec, stages, [], seeded(), itemsN(10)).questions);
    assert.strictEqual(n['t.s7'], 10);
    assert.strictEqual(n['t.s8'], 10);
    Object.keys(n).forEach(function (s) { if (s !== 't.s7' && s !== 't.s8') assert.ok(n[s] <= 10); });
    assert.strictEqual(Object.keys(n).length, 5);
  });

  QUnit.test('the incomplete pool excludes every done stage', function (assert) {
    assert.deepEqual(idsOf(challengePool(stagesOf(4), [doc('t.s1'), doc('t.s3')], 'incomplete')), ['t.s2', 't.s4']);
  });

  QUnit.test('a skipped stage is excluded from the incomplete pool', function (assert) {
    assert.deepEqual(idsOf(challengePool(stagesOf(3), [doc('t.s2', { skipped: true })], 'incomplete')), ['t.s1', 't.s3']);
  });

  QUnit.test('the whole-level pool includes every stage', function (assert) {
    assert.strictEqual(challengePool(stagesOf(3), [doc('t.s1'), doc('t.s2', { skipped: true })], 'whole').length, 3);
  });

  QUnit.test('an empty incomplete pool falls back to the whole level', function (assert) {
    var st = stagesOf(3);
    assert.strictEqual(challengePool(st, st.map(function (u) { return doc(u.id); }), 'incomplete').length, 3);
  });

  QUnit.test('a run has at most 5 stages, counting missed-stage retries toward the 5', function (assert) {
    var stages = stagesOf(12);
    assert.strictEqual(Object.keys(count(run(stages, [], 3).questions)).length, 5);
    var q = count(run(stages, ['t.s1', 't.s2', 't.s3'], 3).questions);
    assert.strictEqual(Object.keys(q).length, 5);
    ['t.s1', 't.s2', 't.s3'].forEach(function (s) { assert.ok(q[s], s + ' is retried'); });
    assert.strictEqual(Object.keys(count(run(stages, idsOf(stages), 3).questions)).length, 5, 'many missed still cap at 5');
  });

  QUnit.test('a run has at most 40 questions', function (assert) {
    var stages = stagesOf(10);
    assert.ok(run(stages, [], 100).questions.length <= 40);
    assert.ok(run(stages, ['t.s1', 't.s2'], 100).questions.length <= 40);
    assert.ok(run(stages, ['t.s1', 't.s2', 't.s3'], 15).questions.length <= 40);
  });

  QUnit.test('missed sets past the question cap are deferred whole and stay missed', function (assert) {
    var c = challengeCompose(stagesOf(5), ['t.s1', 't.s2', 't.s3'], seeded(), itemsN(20)), n = count(c.questions);
    assert.deepEqual(c.deferred, ['t.s3']);
    assert.strictEqual(n['t.s1'], 20);
    assert.strictEqual(n['t.s2'], 20);
    assert.notOk(n['t.s3']);
    var rec = challengeRecord('n5', 'incomplete', stagesOf(5), challengeScore(c.questions, allRight(c.questions)), 1, c.deferred);
    assert.deepEqual(rec.missed, ['t.s3']);
  });

  QUnit.test('a retake with a short remembered pool gives a shorter run, not padding', function (assert) {
    var rec = { level: 'n5', mode: 'whole', pool: ['t.s1', 't.s2'], missed: [] };
    var c = challengeRetake(rec, stagesOf(10), [], seeded(), itemsN(10));
    assert.deepEqual(Object.keys(count(c.questions)).sort(), ['t.s1', 't.s2']);
    assert.strictEqual(c.questions.length, 20);
  });

  QUnit.test('only lesson and kana units are stages, never prep, review or mock', function (assert) {
    var kinds = {};
    allUnits().forEach(function (u) { kinds[u.id] = u.kind; });
    ['n5', 'n4'].forEach(function (lv) {
      var st = challengeStages(lv);
      assert.ok(st.length > 0, lv + ' has stages');
      st.forEach(function (u) { assert.ok(isStageKind(u.kind), u.id + ' is ' + u.kind); });
      assert.ok(allUnits().some(function (u) { return u.level === lv.toUpperCase() && u.kind === 'prep'; }), lv + ' has prep units to exclude');
      challengeCompose(challengePool(st, [], 'whole'), [], seeded()).questions.forEach(function (q) { assert.ok(isStageKind(kinds[q.stage])); });
    });
  });

  QUnit.test('applying a run never marks a review, prep or mock unit done', function (assert) {
    var kinds = {};
    allUnits().forEach(function (u) { kinds[u.id] = u.kind; });
    var qs = challengeCompose(challengeStages('n5'), [], seeded()).questions;
    var out = challengeApply(challengeScore(qs, allRight(qs)), [], 5);
    assert.ok(out.length > 0);
    out.forEach(function (d) { assert.ok(isStageKind(kinds[d._id.slice(5)]), d._id); });
  });

  QUnit.test('a skipped stage counts as done for the pool and adds no real completion', function (assert) {
    var docs = [doc('t.s1', { skipped: true })];
    assert.notOk(idsOf(challengePool(stagesOf(2), docs, 'incomplete')).indexOf('t.s1') >= 0);
    assert.deepEqual(realCompletions(docs), []);
    var ran = challengeApply([{ stage: 't.s2', cleared: false, missed: 1, total: 2 }], docs, 9);
    assert.deepEqual(realCompletions(docs.concat(ran)), []);
  });

  QUnit.test('applying a run writes only unit docs: no SRS card and no mock doc', function (assert) {
    var qs = run(stagesOf(3), [], 5).questions, out = challengeApply(challengeScore(qs, allRight(qs)), [], 3);
    assert.strictEqual(out.length, 3);
    out.forEach(function (d) {
      assert.strictEqual(d._id.indexOf('unit:'), 0);
      assert.deepEqual(Object.keys(d).sort(), ['_id', 'completedAt', 'done']);
    });
  });

  QUnit.test('the stored run keeps its pool, and a retake composes from that pool', function (assert) {
    var stages = stagesOf(10), pool = stages.slice(0, 4), qs = run(pool, [], 6).questions, bad = allRight(qs);
    bad[0] = false;
    var rec = challengeRecord('N5', 'whole', pool, challengeScore(qs, bad), 4242);
    assert.deepEqual(rec.pool, ['t.s1', 't.s2', 't.s3', 't.s4']);
    assert.strictEqual(rec.mode, 'whole');
    var again = challengeRetake(rec, stages, [], seeded(), itemsN(6)), n = count(again.questions);
    Object.keys(n).forEach(function (s) { assert.ok(rec.pool.indexOf(s) >= 0, s + ' is from the remembered pool'); });
    assert.deepEqual(idsOf(again.pool), rec.pool);
    rec.missed.forEach(function (m) { assert.ok(n[m], m + ' is retried'); });
  });

  QUnit.test('a retake of an incomplete pool drops stages cleared since', function (assert) {
    var rec = { level: 'n5', mode: 'incomplete', pool: ['t.s1', 't.s2', 't.s3'], missed: [] };
    assert.deepEqual(idsOf(challengeRetake(rec, stagesOf(4), [doc('t.s2')], seeded(), itemsN(6)).pool), ['t.s1', 't.s3']);
  });

  QUnit.test('the stored run id is chrun-keyed and never a mock id', function (assert) {
    var rec = challengeRecord('N5', 'incomplete', stagesOf(2), [], 1700000000000);
    assert.strictEqual(rec._id, 'chrun:n5:1700000000000');
    assert.notStrictEqual(rec._id.indexOf('mock:'), 0);
  });
});
