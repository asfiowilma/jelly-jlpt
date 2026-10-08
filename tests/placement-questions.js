"use strict";

// Roadmap ticket 37: one-stage question builder for the placement test.
QUnit.module('placementQuestions', function () {
  var stages = function () { return buildUnits(PLAN, CATALOG).filter(liveUnit).filter(function (u) { return u.kind === 'kana' || u.kind === 'lesson'; }); }; // the shipped levels, as the app sees them

  QUnit.test('every teaching stage yields 2 + 1 distinct questions, no leaks, no single letters', function (assert) {
    // every planned level, live or not: ready: false keeps N4 out of the app's placement, not out of this check
    var list = buildUnits(PLAN, CATALOG).filter(function (u) { return u.kind === 'kana' || u.kind === 'lesson'; }), bad = [];
    PLAN.forEach(function (p) {
      var n = list.filter(function (u) { return u.level === p.level; }).length;
      if (p.level === 'N5') assert.strictEqual(n, 90, '90 N5 teaching stages');
      else assert.ok(n > 0, n + ' ' + p.level + ' teaching stages');
    });
    list.forEach(function (u) {
      for (var run = 0; run < 5; run++) { // random forms: repeat
        var a = placementQuestions(u, 2, []), b = placementQuestions(u, 1, a.map(function (q) { return q.itemId; }));
        if (a.length < 2 || b.length < 1) { bad.push(u.id + ' ' + a.length + '+' + b.length); return; }
        var ids = a.concat(b).map(function (q) { return q.itemId; });
        if (new Set(ids).size !== 3) bad.push(u.id + ' duplicate item');
        a.concat(b).forEach(function (q) {
          if (answerLeaks(q)) bad.push(u.id + ' leak ' + q.itemId);
          if (u.kind === 'kana' && (!/^v:/.test(q.itemId) || Array.from(q.item.word).length < 2)) bad.push(u.id + ' single/non-word ' + q.itemId);
          if (q.item.kind === 'vocab' && isBound(q.item) && !/^(ctx)/.test(q.form)) bad.push(u.id + ' bound outside context ' + q.itemId);
          if (q.item.kind === 'grammar' && q.recall) bad.push(u.id + ' grammar typed');
        });
      }
    });
    assert.deepEqual(bad, [], 'problems');
  });

  QUnit.test('typed forms are the norm for words and kanji; no repeats across a 20-question test', function (assert) {
    var u = stages().filter(function (x) { return x.kind === 'lesson'; })[5], taken = [], all = [];
    for (var i = 0; i < 20; i++) { var q = placementQuestions(u, 1, taken)[0]; if (!q) break; taken.push(q.itemId); all.push(q); }
    assert.strictEqual(new Set(taken).size, taken.length, 'distinct');
    assert.ok(all.length > 3 && all.every(function (q) { return q.item.kind === 'grammar' || q.recall; }), 'typed');
    var some = stages()[0], n = (some.vocab || []).length + (some.practice || []).length;
    assert.strictEqual(placementQuestions(some, n + 5, []).length <= n, true, 'never more than the stage has');
  });

  QUnit.test('review / prep / mock units give nothing', function (assert) {
    buildUnits(PLAN, CATALOG).filter(liveUnit).filter(function (u) { return u.kind !== 'kana' && u.kind !== 'lesson'; }).forEach(function (u) {
      assert.strictEqual(placementQuestions(u, 2, []).length, 0, u.id);
    });
  });
});
