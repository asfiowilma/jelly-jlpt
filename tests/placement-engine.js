"use strict";

// Roadmap ticket 36: placement engine (binary search + spot-checks) over the real N5 plan.
QUnit.module('placement engine', function () {
  var units = function () { return buildUnits(PLAN, CATALOG); };
  var seeded = function (seed) { var x = seed; return function () { x = (x * 1664525 + 1013904223) % 4294967296; return x / 4294967296; }; };
  var right = function (q) { return q.options && typeof q.correct === 'number' ? q.correct : q.answers[0]; };
  var wrong = function (q) { return q.options && typeof q.correct === 'number' ? (q.correct + 1) % q.options.length : 'zzz'; };

  // learner: knows(stageNumber) → true; guess = chance to answer an unknown stage right
  function run(knows, seed, guess) {
    var us = units(), s = placementStart(us, seeded(seed || 1)), g = seeded((seed || 1) + 99), asked = [], set, n = 0;
    var num = {};
    s.stages.forEach(function (u, i) { num[u.id] = i + 1; });
    while ((set = placementNext(s))) {
      if (++n > 60) throw new Error('runaway');
      asked.push(set);
      placementAnswer(s, set.questions.map(function (q) {
        return knows(num[set.stageId]) || (guess && g() < guess) ? right(q) : wrong(q);
      }));
    }
    return { s: s, res: placementResult(s), asked: asked, num: num, us: us };
  }
  var N = 90;

  QUnit.test('knows nothing: nothing passed, starts at stage 1, no holes', function (assert) {
    var r = run(function () { return false; });
    assert.deepEqual(r.res.passedStageIds, []);
    assert.deepEqual(r.res.holeStageIds, []);
    assert.strictEqual(r.res.startStageId, r.s.stages[0].id);
  });

  QUnit.test('knows everything: all 90 passed, nothing to start', function (assert) {
    var r = run(function () { return true; });
    assert.strictEqual(r.res.passedStageIds.length, N);
    assert.strictEqual(r.res.startStageId, null);
    assert.deepEqual(r.res.holeStageIds, []);
  });

  QUnit.test('knows the first K stages: boundary lands exactly after K', function (assert) {
    [1, 7, 23, 44, 71, 89].forEach(function (k) {
      var r = run(function (n) { return n <= k; }, k);
      assert.strictEqual(r.res.passedStageIds.length, k, 'K=' + k);
      assert.strictEqual(r.res.startStageId, r.s.stages[k].id, 'start after ' + k);
      assert.deepEqual(r.res.holeStageIds, [], 'no holes ' + k);
    });
  });

  QUnit.test('question budget: about 14 + 3, never a stage or an item twice', function (assert) {
    [0, 5, 30, 60, 90].forEach(function (k) {
      var r = run(function (n) { return n <= k; }, k + 3), stageIds = r.asked.map(function (a) { return a.stageId; });
      var items = [].concat.apply([], r.asked.map(function (a) { return a.questions.map(function (q) { return q.itemId; }); }));
      assert.ok(r.s.answered <= 17, 'K=' + k + ' asked ' + r.s.answered);
      assert.strictEqual(new Set(stageIds).size, stageIds.length, 'no stage twice');
      assert.strictEqual(new Set(items).size, items.length, 'no item twice');
    });
  });

  QUnit.test('never selects review / prep / mock units', function (assert) {
    var r = run(function (n) { return n <= 50; });
    r.asked.forEach(function (a) { assert.ok(/^(kana|lesson)$/.test(r.us.filter(function (u) { return u.id === a.stageId; })[0].kind), a.stageId); });
    assert.strictEqual(r.s.stages.length, N);
  });

  QUnit.test('hole: a stage failing its spot-check is a hole, not passed, and the boundary stays', function (assert) {
    var r = run(function (n) { return n <= 60 && n !== 12 && n !== 30; });
    var spots = r.asked.filter(function (a) { return a.kind === 'spot'; }).map(function (a) { return r.num[a.stageId]; });
    var missed = spots.filter(function (n) { return n === 12 || n === 30; });
    assert.ok(missed.length > 0, 'a hole was probed (spots ' + spots + ')');
    assert.strictEqual(r.res.holeStageIds.length, missed.length);
    missed.forEach(function (n) { assert.strictEqual(r.res.passedStageIds.indexOf(r.s.stages[n - 1].id), -1, 'hole ' + n + ' not passed'); });
    assert.strictEqual(r.res.startStageId, r.s.stages[60].id, 'start stays after the confirmed boundary');
    assert.strictEqual(r.res.passedStageIds.length, 60 - missed.length);
  });

  QUnit.test('spot rounds are capped at 2 and round 2 only follows a miss', function (assert) {
    var all = run(function (n) { return n <= 60 && n % 2 === 0 || n <= 3; }, 4), clean = run(function (n) { return n <= 60; }, 4);
    var rounds = function (r) { return Math.max.apply(null, [0].concat(r.asked.filter(function (a) { return a.kind === 'spot'; }).map(function (a) { return a.round; }))); };
    assert.strictEqual(rounds(all), 2, 'two rounds when holes keep showing');
    assert.strictEqual(rounds(clean), 1, 'one round when clean');
    assert.ok(all.asked.filter(function (a) { return a.kind === 'spot'; }).length <= 6);
  });

  QUnit.test('lucky guesser (25%) still gets a sane result and bounded questions', function (assert) {
    for (var seed = 1; seed <= 15; seed++) {
      var r = run(function (n) { return n <= 20; }, seed, 0.25);
      assert.ok(r.s.answered <= 20, 'seed ' + seed + ' asked ' + r.s.answered);
      assert.strictEqual(r.res.passedStageIds.length + r.res.holeStageIds.length, r.s.lo, 'passed + holes = boundary');
      assert.ok(r.s.lo >= 15 && r.s.lo <= 60, 'boundary ' + r.s.lo + ' plausible');
    }
  });

  QUnit.test('"I don\'t know" (null) is wrong; deterministic for the same rng', function (assert) {
    var s = placementStart(units(), seeded(5)), set = placementNext(s);
    placementAnswer(s, set.questions.map(function () { return null; }));
    assert.strictEqual(s.log[0].pass, false);
    var a = run(function (n) { return n <= 33; }, 8), b = run(function (n) { return n <= 33; }, 8);
    assert.deepEqual(a.asked.map(function (x) { return x.stageId + x.questions.map(function (q) { return q.itemId; }); }),
      b.asked.map(function (x) { return x.stageId + x.questions.map(function (q) { return q.itemId; }); }));
  });

  QUnit.test('stage that yields too few questions is judged on what it gave; none = not known', function (assert) {
    var us = units().filter(function (u) { return u.kind === 'lesson'; }).slice(0, 4), s = placementStart(us, seeded(2));
    var empty = Object.assign({}, us[1], { vocab: [], kanji: [], grammar: [], practice: [], sentences: [] });
    s.stages[1] = empty; // stage 2 can't make questions; probe order: ceil(4/2)=2 first
    placementNext(s);
    assert.strictEqual(s.log[0].asked, 0);
    assert.strictEqual(s.log[0].pass, false);
    assert.strictEqual(s.hi, 1, 'treated as not known');
  });

  QUnit.test('placementApply: done = passed stages, cards = their items only, holes left unmarked', function (assert) {
    var r = run(function (n) { return n <= 40 && n !== 9; }, 3), us = r.us;
    var plan = placementApply(r.res, us);
    assert.deepEqual(plan.doneIds, us.filter(function (u) { return r.res.passedStageIds.indexOf(u.id) >= 0; }).map(function (u) { return u.id; }));
    assert.deepEqual(plan.skippedIds, us.filter(function (u) { return r.res.holeStageIds.indexOf(u.id) >= 0; }).map(function (u) { return u.id; }));
    assert.ok(plan.doneIds.every(function (id) { return !/^n5\.review/.test(id) && us.filter(function (u) { return u.id === id; })[0].kind !== 'review'; }), 'no review stage marked done');
    assert.ok(plan.cardItems.length > 100 && new Set(plan.cardItems).size === plan.cardItems.length, 'deduped item ids');
    var holeItems = unitItems(us.filter(function (u) { return r.res.holeStageIds.indexOf(u.id) >= 0; })).map(function (i) { return i.id; });
    var later = unitItems(us.filter(function (u) { return r.res.passedStageIds.indexOf(u.id) >= 0; })).map(function (i) { return i.id; });
    holeItems.forEach(function (id) { if (later.indexOf(id) < 0) assert.strictEqual(plan.cardItems.indexOf(id), -1, 'hole item not seeded ' + id); });
    var cards = {}, out = seedKnownCards(plan.cardItems, cards, Date.now(), { source: 'placement', batchId: 'b1', budget: 40 });
    assert.ok(out.added.length > 0 && out.skipped.length === 0, 'seedKnownCards accepts them');
  });
});
