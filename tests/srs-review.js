"use strict";

QUnit.module('srsReview', function () {

  QUnit.test('quality=0 (again) resets reps=0 and interval=1', function (assert) {
    var card = { interval: 15, ease: 2.5, reps: 5, due: 0 };
    var result = srsReview(card, 0);
    assert.equal(result.reps, 0);
    assert.equal(result.interval, 1);
  });

  QUnit.test('quality=1 (hard, grade=3): reps=0 → interval=1', function (assert) {
    var card = { interval: 1, ease: 2.5, reps: 0, due: 0 };
    var result = srsReview(card, 1);
    assert.equal(result.interval, 1);
    assert.equal(result.reps, 1);
  });

  QUnit.test('quality=1 (hard): reps=1 → interval=5 (0.8 × the 6d pass)', function (assert) {
    var card = { interval: 1, ease: 2.5, reps: 1, due: 0 };
    var result = srsReview(card, 1);
    assert.equal(result.interval, 5);
    assert.equal(result.reps, 2);
  });

  QUnit.test('hard, good and easy give different intervals once the pass interval is above 1', function (assert) {
    var card = { interval: 6, ease: 2.5, reps: 2, due: 0 };
    assert.deepEqual([1, 2, 3].map(function (q) { return srsReview(card, q).interval; }), [12, 15, 20]);
    assert.equal(srsReview(card, 0).interval, 1);
  });

  QUnit.test('srsPreview: first review, second review, later', function (assert) {
    assert.deepEqual(srsPreview({ interval: 1, ease: 2.5, reps: 0 }), { again: 1, hard: 1, good: 1, easy: 2 });
    assert.deepEqual(srsPreview({ interval: 1, ease: 2.5, reps: 1 }), { again: 1, hard: 5, good: 6, easy: 8 });
    assert.deepEqual(srsPreview({ interval: 6, ease: 2.5, reps: 2 }), { again: 1, hard: 12, good: 15, easy: 20 });
  });

  QUnit.test('srsPreview never drifts from srsReview', function (assert) {
    [{ interval: 1, ease: 2.5, reps: 0 }, { interval: 6, ease: 1.3, reps: 3 }, { interval: 40, ease: 2.2, reps: 7 }].forEach(function (c) {
      var p = srsPreview(c);
      ['again', 'hard', 'good', 'easy'].forEach(function (k, q) {
        assert.equal(srsReview(c, q).interval, p[k], k + ' @ interval ' + c.interval);
      });
    });
  });

  QUnit.test('quality=3 (easy, grade=5) increases ease', function (assert) {
    var card = { interval: 1, ease: 2.5, reps: 0, due: 0 };
    var result = srsReview(card, 3);
    assert.ok(result.ease > 2.5, 'ease increases on quality=3 (perfect)');
  });

  QUnit.test('ease is never below 1.3', function (assert) {
    var card = { interval: 1, ease: 1.3, reps: 2, due: 0 };
    for (var i = 0; i < 5; i++) {
      card = srsReview(card, 1); // quality=1 (grade 3) decreases ease
      assert.ok(card.ease >= 1.3, 'ease must never drop below 1.3 (iteration ' + (i + 1) + ')');
    }
  });

  QUnit.test('returns a new card object (does not mutate input)', function (assert) {
    var card = { interval: 6, ease: 2.5, reps: 2, due: 0 };
    var original = { interval: 6, ease: 2.5, reps: 2, due: 0 };
    var result = srsReview(card, 3);
    assert.deepEqual(card, original, 'input card should not be mutated');
    assert.notStrictEqual(result, card, 'result should be a new object');
  });

  QUnit.test('due date is set to interval days from now', function (assert) {
    var before = Date.now();
    // reps=1 → interval becomes 6
    var card = { interval: 1, ease: 2.5, reps: 1, due: 0 };
    var result = srsReview(card, 2); // good: the 6d pass
    var after = Date.now();
    var msPerDay = 86400000;
    assert.ok(
      result.due >= before + 6 * msPerDay && result.due <= after + 6 * msPerDay,
      'due is approximately 6 days from now'
    );
  });
});

QUnit.module('stageOf / cardExample', function () {
  QUnit.test('stageOf finds the unit that teaches an item, null for unknown ids', function (assert) {
    var u = allUnits().filter(function (x) { return (x.vocab || []).length; })[0];
    assert.equal(stageOf(u.vocab[0].id).index, u.index);
    assert.strictEqual(stageOf('v:nope|nope'), null);
  });

  QUnit.test('no example for kana or unknown ids', function (assert) {
    assert.strictEqual(cardExample('c:あ'), null);
    assert.strictEqual(cardExample('v:nope|nope'), null);
  });

  QUnit.test('example is a catalog sentence that uses the item, deterministic, range spells the word', function (assert) {
    var found = 0;
    allUnits().forEach(function (u) {
      unitItems([u]).forEach(function (it) {
        var ex = cardExample(it.id);
        if (!ex) return;
        found++;
        assert.ok(ex.s.uses.indexOf(it.id) >= 0, it.id + ' is in uses');
        assert.deepEqual(cardExample(it.id), ex, it.id + ' same pick twice');
        if (ex.at !== null) {
          var w = ex.s.jp.slice(ex.at, ex.end);
          assert.ok(it.kind === 'kanji' ? w === it.char : w === it.word, it.id + ' highlight is the word');
        }
      });
    });
    assert.ok(found > 20, 'many cards have examples (' + found + ')');
  });

  QUnit.test('prefers sentences with nothing untaught at that stage', function (assert) {
    allUnits().forEach(function (u) {
      (u.vocab || []).forEach(function (v) {
        var ex = cardExample(v.id);
        if (!ex) return;
        var known = taughtIds(stageOf(v.id)), miss = function (s) { // another spelling counts as taught with the one the plan teaches (alt)
          return s.uses.filter(function (x) { var it = CATALOG.items[x]; return !known[x] && !(it && it.alt && known[it.alt]); }).length;
        };
        assert.ok(miss(ex.s) <= EXAMPLE_MAX_UNTAUGHT, v.id + ' leans on few later items');
        sentencesUsing(v.id).forEach(function (s) { assert.ok(miss(ex.s) <= miss(s), v.id + ' picks the fewest untaught'); });
      });
    });
  });
});


// ── 10. srsAddCards(dayLesson, cards) ────────────────────────────────────────
