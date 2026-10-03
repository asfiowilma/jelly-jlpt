"use strict";

// Already-known import (ticket 37): seeding known cards, undo, batches, text matching.
QUnit.module('import-known', function () {
  var NOW = new Date(2026, 4, 10, 15, 0).getTime();
  var DAY = 86400000;
  var V = ['v:会う|あう', 'v:青|あお', 'v:青い|あおい', 'v:赤|あか', 'v:赤い|あかい', 'v:学生|がくせい', 'v:先生|せんせい', 'v:食べる|たべる', 'k:日', 'v:テレビ|テレビ'];
  var daysOut = function (c) { return Math.round((c.due - dayStart(NOW, 0)) / DAY); };
  var opts = function (o) { return Object.assign({ source: 'test', batchId: 'b1', budget: 100, rnd: function () { return 0.5; } }, o); };

  QUnit.test('seedKnownCards: long interval, reps 2, imported flag, no addedAt', function (assert) {
    var cards = {};
    var r = seedKnownCards(['v:会う|あう', 'k:日'], cards, NOW, opts());
    assert.deepEqual(r, { added: ['v:会う|あう', 'k:日'], replaced: [], skipped: [] });
    var c = cards['v:会う|あう'];
    assert.ok(c.interval >= KNOWN_MIN_DAYS && c.interval <= KNOWN_MAX_DAYS, 'interval in 21–28');
    assert.strictEqual(daysOut(c), c.interval, 'due = local midnight interval days out');
    assert.deepEqual([c.reps, c.ease, c.lastReviewedAt, c.front, c.type], [2, 2.5, 0, '会う', 'vocab']);
    assert.deepEqual(c.imported, { source: 'test', at: NOW, batchId: 'b1' });
    assert.notOk('addedAt' in c, 'does not use up the daily new-card cap');
    assert.strictEqual(cardsAddedToday(cards, NOW), 0);
  });

  QUnit.test('seedKnownCards: due dates spread so no day exceeds the budget', function (assert) {
    var cards = {};
    var i = 0, rs = [0, 0.99, 0.3, 0.6];
    seedKnownCards(V, cards, NOW, opts({ budget: 2, rnd: function () { return rs[i++ % rs.length]; } }));
    var per = {};
    V.forEach(function (id) { var d = daysOut(cards[id]); per[d] = (per[d] || 0) + 1; assert.ok(d >= KNOWN_MIN_DAYS, id + ' not before day 21'); });
    Object.keys(per).forEach(function (d) { assert.ok(per[d] <= 2, 'day ' + d + ' has ' + per[d]); });
  });

  QUnit.test('seedKnownCards: existing due load counts against the budget', function (assert) {
    var cards = { 'k:月': { id: 'k:月', due: dayStart(NOW, 21) + 3600000, reps: 3, lastReviewedAt: 1, interval: 21 } };
    seedKnownCards(['v:会う|あう'], cards, NOW, opts({ budget: 1, rnd: function () { return 0; } }));
    assert.strictEqual(daysOut(cards['v:会う|あう']), 22, 'day 21 full → day 22');
  });

  QUnit.test('seedKnownCards: never clobbers reviewed cards; replaces an unreviewed new card', function (assert) {
    var reviewed = { id: 'v:青|あお', reps: 1, interval: 1, ease: 2.5, due: NOW, lastReviewedAt: NOW - DAY };
    var lapsed = { id: 'v:赤|あか', reps: 0, interval: 1, ease: 2.3, due: NOW, lastReviewedAt: NOW - DAY };
    var fresh = { id: 'k:日', reps: 0, interval: 1, ease: 2.5, due: NOW, addedAt: NOW };
    var cards = { 'v:青|あお': reviewed, 'v:赤|あか': lapsed, 'k:日': fresh };
    var r = seedKnownCards(['v:青|あお', 'v:赤|あか', 'k:日', 'v:nope|nope'], cards, NOW, opts());
    assert.deepEqual(r, { added: [], replaced: ['k:日'], skipped: ['v:青|あお', 'v:赤|あか', 'v:nope|nope'] });
    assert.strictEqual(cards['v:青|あお'], reviewed);
    assert.strictEqual(cards['v:赤|あか'], lapsed);
    assert.strictEqual(cards['k:日'].imported.prior, fresh);
    var again = seedKnownCards(['k:日'], cards, NOW, opts({ batchId: 'b2' }));
    assert.deepEqual(again.skipped, ['k:日'], 'already known = skipped');
  });

  QUnit.test('known card: first review is a real test (miss lapses, pass grows)', function (assert) {
    var cards = {};
    seedKnownCards(['v:会う|あう'], cards, NOW, opts());
    var c = cards['v:会う|あう'];
    var miss = srsReview(c, 0);
    assert.deepEqual([miss.reps, miss.interval], [0, 1], 'miss → relearn');
    var pass = srsReview(c, 2);
    assert.ok(pass.interval > c.interval, 'pass → longer interval');
  });

  QUnit.test('undoImport: removes added, restores replaced, keeps reviewed; ids filter', function (assert) {
    var fresh = { id: 'k:日', reps: 0, interval: 1, ease: 2.5, due: NOW, addedAt: NOW };
    var cards = { 'k:日': fresh };
    seedKnownCards(['v:会う|あう', 'v:青|あお', 'k:日', 'v:赤|あか'], cards, NOW, opts());
    seedKnownCards(['v:学生|がくせい'], cards, NOW, opts({ batchId: 'other' }));
    cards['v:青|あお'] = srsReview(cards['v:青|あお'], 2);
    var one = undoImport('b1', cards, ['v:赤|あか']);
    assert.deepEqual(one, { removed: ['v:赤|あか'], restored: [], skipped: [] });
    var r = undoImport('b1', cards);
    assert.deepEqual(r, { removed: ['v:会う|あう'], restored: ['k:日'], skipped: ['v:青|あお'] });
    assert.strictEqual(cards['k:日'], fresh);
    assert.ok(cards['v:学生|がくせい'], 'other batch untouched');
  });

  QUnit.test('importBatches: one row per batch, newest first, reviewed count', function (assert) {
    var cards = {};
    seedKnownCards(['v:会う|あう', 'v:青|あお'], cards, NOW, opts());
    seedKnownCards(['k:日'], cards, NOW + 1000, opts({ batchId: 'b2', source: 'paste' }));
    cards['v:青|あお'] = Object.assign({}, cards['v:青|あお'], { lastReviewedAt: NOW + 5 });
    assert.deepEqual(importBatches(cards), [
      { batchId: 'b2', source: 'paste', at: NOW + 1000, count: 1, reviewed: 0 },
      { batchId: 'b1', source: 'test', at: NOW, count: 2, reviewed: 1 }
    ]);
    assert.strictEqual(knownCount([{ id: 'k:日' }, { id: 'k:月' }, { id: 'v:会う|あう' }], cards), 2);
  });

  QUnit.test('reviewBudget = REVIEW_BUDGET_FACTOR × daily new-card cap', function (assert) {
    assert.strictEqual(reviewBudget(10), 10 * REVIEW_BUDGET_FACTOR);
  });

  QUnit.test('quickSortItems: kana / vocab / kanji of the level in teaching order, no grammar', function (assert) {
    var units = buildUnits(PLAN, CATALOG);
    var items = quickSortItems(units, 'N5');
    assert.ok(items.length > 500, 'N5 has hundreds of items: ' + items.length);
    assert.strictEqual(items[0].kind, 'kana', 'kana first');
    assert.notOk(items.some(function (it) { return it.kind === 'grammar' || it.alt; }));
    assert.deepEqual(quickSortItems(units, 'N1'), []);
  });

  QUnit.test('matchCatalogText: longest match on word or reading, alt → taught spelling, kanji chars', function (assert) {
    var anki = '食べる\tたべる\tto eat\nがくせい\tstudent\nテレビ\n先生です\n行く (ゆく)';
    var ids = matchCatalogText(anki);
    ['v:食べる|たべる', 'v:学生|がくせい', 'v:テレビ|テレビ', 'v:先生|せんせい', 'v:行く|いく', 'k:食', 'k:先', 'k:生', 'k:行'].forEach(function (id) {
      assert.ok(ids.indexOf(id) >= 0, 'found ' + id);
    });
    assert.notOk(ids.indexOf('v:行く|ゆく') >= 0, 'duplicate spelling maps to its alt');
    assert.strictEqual(ids.length, new Set(ids).size, 'no duplicates');
    assert.deepEqual(matchCatalogText('hello, world 123'), []);
    assert.deepEqual(matchCatalogText(''), []);
  });
});
