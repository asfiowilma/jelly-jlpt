"use strict";

QUnit.module('placement apply', function () {
  var units = function () { return buildUnits(PLAN, CATALOG).filter(liveUnit); };
  var seeded = function (seed) { var x = seed; return function () { x = (x * 1664525 + 1013904223) % 4294967296; return x / 4294967296; }; };
  var right = function (q) { return q.options && typeof q.correct === 'number' ? q.correct : q.answers[0]; };
  function run(seed) { // a learner who knows the stages up to 40
    var us = units(), s = placementRunStart(us, seeded(seed)), q, n = 0;
    while ((q = placementRunNext(s)) && n++ < 60) placementRunAnswer(s, q.stage <= 40 ? right(q.question) : null);
    return { res: placementRunResult(s), us: us };
  }

  QUnit.test('placementApply: done = passed stages, cards = their items only, holes left unmarked', function (assert) {
    var r = run(3), us = r.us;
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

QUnit.module('placement belief model', function () {
  var sum = function (b) { return b.reduce(function (a, x) { return a + x; }, 0); };
  var mass = function (b, s) { return b.slice(s).reduce(function (a, x) { return a + x; }, 0); };
  // Likelihoods written out from the spec table: [knows stage, does not know]
  var L = { correct: [0.88, 0.30], wrong: [0.10, 0.30], dontKnow: [0.02, 0.40] };

  QUnit.test('flat prior over 0..N sums to 1', function (assert) {
    var b = placementBeliefStart(10);
    assert.strictEqual(b.length, 11);
    assert.ok(Math.abs(sum(b) - 1) < 1e-12);
    b.forEach(function (w) { assert.ok(Math.abs(w - 1 / 11) < 1e-12); });
  });

  QUnit.test('five scripted answers give the normalized product of the spec likelihoods', function (assert) {
    var script = [[4, 'correct'], [7, 'wrong'], [5, 'dontKnow'], [2, 'correct'], [6, 'wrong']];
    var expected = [], k, total = 0;
    for (k = 0; k <= 10; k++) {
      var w = 1 / 11;
      script.forEach(function (a) { w *= L[a[1]][k >= a[0] ? 0 : 1]; });
      expected.push(w); total += w;
    }
    var b = placementBeliefStart(10);
    script.forEach(function (a) { b = placementBeliefAnswer(b, a[0], a[1]); });
    assert.strictEqual(b.length, 11);
    expected.forEach(function (w, i) { assert.ok(Math.abs(b[i] - w / total) < 1e-9, 'k=' + i); });
    assert.ok(Math.abs(sum(b) - 1) < 1e-9);
  });

  QUnit.test('a correct answer on a stage raises the mass at or above it', function (assert) {
    var b = placementBeliefStart(10);
    assert.ok(mass(placementBeliefAnswer(b, 6, 'correct'), 6) > mass(b, 6));
  });

  QUnit.test('"I don\'t know" lowers the mass at or above the stage more than a wrong answer', function (assert) {
    var b = placementBeliefStart(10);
    var dk = mass(placementBeliefAnswer(b, 6, 'dontKnow'), 6), wr = mass(placementBeliefAnswer(b, 6, 'wrong'), 6);
    assert.ok(dk < wr && wr < mass(b, 6));
  });

  QUnit.test('answering does not mutate the input belief', function (assert) {
    var b = placementBeliefStart(10), copy = b.slice();
    var out = placementBeliefAnswer(b, 3, 'wrong');
    assert.deepEqual(b, copy);
    assert.notStrictEqual(out, b);
  });

  QUnit.test('unknown outcome or out-of-range stage throws', function (assert) {
    var b = placementBeliefStart(10);
    assert.throws(function () { placementBeliefAnswer(b, 3, 'maybe'); });
    assert.throws(function () { placementBeliefAnswer(b, 0, 'correct'); });
    assert.throws(function () { placementBeliefAnswer(b, 11, 'correct'); });
    assert.throws(function () { placementBeliefAnswer(b, 2.5, 'correct'); });
  });
});

QUnit.module('placement run: question choice, stop rule, result', function () {
  var units = function () { return buildUnits(PLAN, CATALOG).filter(liveUnit); };
  var seeded = function (seed) { var x = seed; return function () { x = (x * 1664525 + 1013904223) % 4294967296; return x / 4294967296; }; };
  var right = function (q) { return q.options && typeof q.correct === 'number' ? q.correct : q.answers[0]; };
  var wrong = function (q) { return q.options && typeof q.correct === 'number' ? (q.correct + 1) % q.options.length : 'zzz'; };
  var N = units().filter(function (u) { return u.kind === 'kana' || u.kind === 'lesson'; }).length;
  var median = function (b) { var c = 0; for (var k = 0; k < b.length; k++) { c += b[k]; if (c >= 0.5) return k; } return b.length - 1; };
  var mass = function (b, st) { return b.slice(st).reduce(function (a, x) { return a + x; }, 0); };

  // policy(stage, belief, index) → 'right' | 'wrong' | 'dk'; runs to the end, returns the state
  function play(policy, seed, maxSteps) {
    var s = placementRunStart(units(), seeded(seed || 1)), q, i = 0;
    while ((q = placementRunNext(s))) {
      if (i > (maxSteps || 60)) throw new Error('runaway');
      var p = policy(q.stage, s.belief, i++);
      placementRunAnswer(s, p === 'right' ? right(q.question) : p === 'wrong' ? wrong(q.question) : null);
    }
    return s;
  }

  function passCheck(s) { for (var i = 0; i < 2; i++) { var q = placementRunNext(s); placementRunAnswer(s, right(q.question)); } return s; }

  QUnit.test('one wrong answer on a stage the learner knows does not drop the placement below it', function (assert) {
    [1, 2, 3, 4, 5].forEach(function (seed) {
      var missed = null;
      var s = play(function (st) {
        if (st > 60) return 'wrong';
        if (missed === null) { missed = st; return 'wrong'; }
        return 'right';
      }, seed);
      var k = placementRunResult(s).placement;
      assert.ok(missed !== null && s.answered > 1, 'seed ' + seed + ' reached a known stage');
      assert.ok(k >= missed, 'seed ' + seed + ': placement ' + k + ' >= ' + missed);
    });
  });

  QUnit.test('three correct answers above the current placement raise it', function (assert) {
    var s = passCheck(placementRunStart(units(), seeded(3))), before = placementRunResult(s).placement;
    for (var i = 0; i < 3; i++) { var q = placementRunNext(s); assert.ok(q.stage > before, 'asked above placement'); placementRunAnswer(s, right(q.question)); }
    assert.ok(placementRunResult(s).placement > before, before + ' -> ' + placementRunResult(s).placement);
  });

  QUnit.test('"I don\'t know" moves a run further down than a wrong answer', function (assert) {
    var a = placementRunStart(units(), seeded(7)), b = placementRunStart(units(), seeded(7));
    var qa = placementRunNext(a), qb = placementRunNext(b);
    assert.strictEqual(qa.stage, qb.stage, 'same first question');
    placementRunAnswer(a, null); placementRunAnswer(b, wrong(qb.question));
    assert.ok(mass(a.belief, qa.stage) < mass(b.belief, qa.stage), 'less mass at or above the stage');
    assert.ok(placementRunResult(a).placement <= placementRunResult(b).placement);
  });

  QUnit.test('never more than 25 counted questions plus 2 check answers under adversarial answer sequences', function (assert) {
    var policies = {
      alternating: function (st, b, i) { return i % 2 ? 'wrong' : 'right'; },
      allDontKnow: function () { return 'dk'; },
      contradictsBelief: function (st, b) { return st > median(b) ? 'right' : 'wrong'; },
      contradictsBeliefDk: function (st, b) { return st > median(b) ? 'right' : 'dk'; },
      allRight: function () { return 'right'; }
    };
    Object.keys(policies).forEach(function (name) {
      [1, 2, 3].forEach(function (seed) {
        var s = play(policies[name], seed, 40);
        assert.ok(s.counted <= PLACEMENT_MAX_QUESTIONS, name + ' seed ' + seed + ' counted ' + s.counted);
        assert.ok(s.answered <= PLACEMENT_MAX_QUESTIONS + 2, name + ' seed ' + seed + ' asked ' + s.answered);
      });
    });
  });

  QUnit.test('placementShouldStop is true at 25 counted whatever the belief', function (assert) {
    var flat = placementBeliefStart(100);
    assert.strictEqual(placementShouldStop(flat, 100, 24), false);
    assert.strictEqual(placementShouldStop(flat, 100, 25), true);
    assert.strictEqual(placementShouldStop(flat, 100, 35), true);
    assert.strictEqual(PLACEMENT_MAX_QUESTIONS, 25);
  });

  QUnit.test('stop window is max(3, 2% of the stages)', function (assert) {
    assert.strictEqual(placementStopWindow(3), 3);
    assert.strictEqual(placementStopWindow(177), 4);
    assert.strictEqual(placementStopWindow(200), 4);
    assert.strictEqual(placementStopWindow(600), 12);
  });

  QUnit.test('stops once the best window holds 90% and not before', function (assert) {
    var n = 10, mk = function (inWin) { var b = new Array(n + 1).fill((1 - inWin) / (n + 1 - 3)); b[4] = b[5] = b[6] = inWin / 3; return b; };
    assert.ok(Math.abs(placementWindowShare(mk(0.9), 3) - 0.9) < 1e-9);
    assert.strictEqual(placementShouldStop(mk(0.9), n, 5), true, 'exactly 0.9');
    assert.strictEqual(placementShouldStop(mk(0.89), n, 5), false, 'just under');
    assert.strictEqual(placementShouldStop(placementBeliefStart(n), n, 5), false, 'flat belief');
  });

  QUnit.test('next stage is the unasked one where P(known) is nearest one half', function (assert) {
    var b = [0.2].concat(new Array(10).fill(0.08)), all = function () { return true; }; // P(k >= s) = 0.08 * (11 - s): s = 5 is .48
    assert.strictEqual(placementPickStage(b, [], all).stage, 5);
    assert.strictEqual(placementPickStage(b, [5], all).stage, 4, 'asked stage passed over');
    assert.strictEqual(placementPickStage(b, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], all).stage, 5, 'all asked: reuse nearest');
  });

  QUnit.test('unusable stages are skipped and reported', function (assert) {
    var b = [0.2].concat(new Array(10).fill(0.08)), r = placementPickStage(b, [], function (s) { return s !== 5 && s !== 4; });
    assert.strictEqual(r.stage, 6);
    assert.deepEqual(r.skipped, [4, 5]);
  });

  QUnit.test('a stage with no question is skipped, logged and left out', function (assert) {
    var s = passCheck(placementRunStart(units(), seeded(2))), first = placementPickStage(s.belief, [], function () { return true; }).stage;
    s.stages[first - 1] = Object.assign({}, s.stages[first - 1], { vocab: [], kanji: [], grammar: [], practice: [], sentences: [] });
    var q = placementRunNext(s);
    assert.ok(q.stage !== first);
    assert.ok(s.log.some(function (l) { return l.stage === first && l.outcome === null && /skipped/.test(l.note); }));
  });

  QUnit.test('result is the 10th percentile; passed stages 1..k, start is stage k + 1', function (assert) {
    var s = placementRunStart(units(), seeded(1)), q = placementRunNext(s);
    placementRunAnswer(s, right(q.question));
    var k = 0, cum = s.belief[0]; while (cum < PLACEMENT_RESULT_CUT - 1e-9) cum += s.belief[++k]; // smallest k with cumulative >= the cut
    var r = placementRunResult(s);
    assert.ok(k > 0 && k < N, 'a mid-range k, ' + k);
    assert.strictEqual(r.placement, k);
    assert.deepEqual(r.passedStageIds, s.stages.slice(0, k).map(function (u) { return u.id; }));
    assert.strictEqual(r.startStageId, s.stages[k].id);
  });

  QUnit.test('result at the last stage has nothing to start; N comes from the units given', function (assert) {
    var few = units().filter(function (u) { return u.kind === 'lesson'; }).slice(0, 6), s = placementRunStart(few, seeded(4));
    assert.strictEqual(s.stages.length, 6);
    assert.strictEqual(s.belief.length, 7);
    s.belief = [0, 0, 0, 0, 0, 0, 1];
    var r = placementRunResult(s);
    assert.strictEqual(r.placement, 6);
    assert.strictEqual(r.passedStageIds.length, 6);
    assert.strictEqual(r.startStageId, null);
    s.belief = [1, 0, 0, 0, 0, 0, 0];
    assert.strictEqual(placementRunResult(s).placement, 0);
    assert.strictEqual(placementRunResult(s).startStageId, few[0].id);
    assert.ok(N > 6);
  });

  QUnit.test('no item is asked twice in a run', function (assert) {
    [1, 2, 3, 4].forEach(function (seed) {
      var s = play(function (st, b, i) { return i % 3 ? 'right' : 'wrong'; }, seed), ids = s.log.filter(function (l) { return l.itemId; }).map(function (l) { return l.itemId; });
      assert.strictEqual(new Set(ids).size, ids.length, 'seed ' + seed);
      assert.strictEqual(s.taken.length, ids.length);
    });
  });

  function checkRun(a, b) {
    var s = placementRunStart(units(), seeded(5)), q1 = placementRunNext(s), q2;
    placementRunAnswer(s, a(q1.question)); q2 = placementRunNext(s); placementRunAnswer(s, b(q2.question));
    return { s: s, q1: q1, q2: q2 };
  }
  var dk = function () { return null; };

  QUnit.test('beginner check: both answers wrong ends the run at placement 0 from the first stage', function (assert) {
    var c = checkRun(wrong, wrong), r = placementRunResult(c.s);
    assert.ok(c.q1.check && c.q2.check && c.q1.stage === 1 && c.q2.stage === 1, 'two check questions from the first stage');
    assert.strictEqual(placementRunNext(c.s), null, 'no further question');
    assert.ok(c.s.checkMiss && c.s.done);
    assert.strictEqual(r.placement, 0);
    assert.deepEqual(r.passedStageIds, []);
    assert.strictEqual(r.startStageId, c.s.stages[0].id);
    assert.ok(r.log.some(function (l) { return /beginner check missed both/.test(l.note); }));
  });

  QUnit.test('beginner check: a wrong answer and "I don\'t know" end the run the same way', function (assert) {
    [[wrong, dk], [dk, wrong], [dk, dk]].forEach(function (p, i) {
      var c = checkRun(p[0], p[1]), r = placementRunResult(c.s);
      assert.strictEqual(placementRunNext(c.s), null, 'case ' + i + ' no further question');
      assert.strictEqual(r.placement, 0);
      assert.deepEqual(r.passedStageIds, []);
      assert.strictEqual(r.startStageId, c.s.stages[0].id);
    });
  });

  QUnit.test('beginner check: one right and one wrong lets the engine continue', function (assert) {
    [[right, wrong], [wrong, right]].forEach(function (p, i) {
      var c = checkRun(p[0], p[1]), q = placementRunNext(c.s);
      assert.ok(q && !q.check, 'case ' + i + ' next question exists and is not a check');
      assert.ok(!c.s.checkMiss && !c.s.done);
      assert.strictEqual(c.s.answered, 2);
    });
  });

  QUnit.test('check answers do not count toward the 25 question cap', function (assert) {
    [1, 2, 3].forEach(function (seed) {
      var s = play(function (st, b, i) { return i < 2 ? 'right' : i % 2 ? 'wrong' : 'dk'; }, seed, 25);
      assert.ok(s.log.slice(0, 2).every(function (l) { return l.stage === 1 && l.outcome === 'correct'; }), 'check passed');
      assert.strictEqual(s.counted, s.answered - 2, 'seed ' + seed + ' counted excludes the 2 check answers');
      assert.ok(s.counted <= PLACEMENT_MAX_QUESTIONS && s.answered <= PLACEMENT_MAX_QUESTIONS + 2, 'seed ' + seed + ' asked ' + s.answered);
    });
  });

  QUnit.test('decided constants: cap 25, stop share 0.9, result cut 0.10, likelihood table', function (assert) {
    assert.strictEqual(PLACEMENT_MAX_QUESTIONS, 25);
    assert.strictEqual(PLACEMENT_STOP_SHARE, 0.9);
    assert.strictEqual(PLACEMENT_RESULT_CUT, 0.10);
    assert.deepEqual(PLACEMENT_LIKELIHOOD, { correct: { known: 0.88, unknown: 0.30 }, wrong: { known: 0.10, unknown: 0.30 }, dontKnow: { known: 0.02, unknown: 0.40 } });
  });

  QUnit.test('pinned run: seeded slip-and-guess learner on the real catalog lands on a fixed placement', function (assert) {
    var s = placementRunStart(units(), seeded(11)), g = seeded(77), q;
    while ((q = placementRunNext(s))) {
      var knows = q.check || q.stage <= 40, slip = g() < 0.05, guess = g() < 0.30;
      placementRunAnswer(s, (knows ? !slip : guess) ? right(q.question) : wrong(q.question));
    }
    var r = placementRunResult(s);
    assert.deepEqual([r.placement, s.answered, s.counted, r.startStageId], [29, 27, 25, "n5.u034"]);
  });
});
