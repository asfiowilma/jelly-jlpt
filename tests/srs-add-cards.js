"use strict";

QUnit.module('srsAddCards', function () {
  // A resolved unit (buildUnits shape): catalog items, not day/position rows.
  var unit = {
    id: 'n5.u999', level: 'N5',
    vocab: [{ id: 'v:猫|ねこ', kind: 'vocab', word: '猫', reading: 'ねこ', gloss: ['cat'] }],
    kanji: [{ id: 'k:人', kind: 'kanji', char: '人', on: ['ジン'], kun: ['ひと'], meaning: ['person'] }],
    grammar: [{ id: 'g:mo', kind: 'grammar', pattern: '〜も', meaning: '~ too' }]
  };

  QUnit.test('cards are keyed by item id with embedded front/back/reading', function (assert) {
    var cards = {};
    srsAddCards(unit, cards);
    assert.deepEqual(Object.keys(cards).sort(), ['g:mo', 'k:人', 'v:猫|ねこ']);
    var v = cards['v:猫|ねこ'];
    assert.deepEqual([v.id, v.type, v.front, v.back, v.reading], ['v:猫|ねこ', 'vocab', '猫', 'cat', 'ねこ']);
    var k = cards['k:人'];
    assert.deepEqual([k.type, k.front, k.back, k.reading], ['kanji', '人', 'person', 'ひと・ジン']);
    var g = cards['g:mo'];
    assert.deepEqual([g.type, g.front, g.back], ['grammar', '〜も', '~ too']);
  });

  QUnit.test('new cards start with interval=1, ease=2.5, reps=0', function (assert) {
    var cards = {};
    srsAddCards(unit, cards);
    var card = cards['v:猫|ねこ'];
    assert.deepEqual([card.interval, card.ease, card.reps], [1, 2.5, 0]);
  });

  QUnit.test('same item in another unit is the same card (no overwrite)', function (assert) {
    var existing = { id: 'v:猫|ねこ', interval: 14, ease: 1.9, reps: 8, due: 42, front: '猫', back: 'cat', type: 'vocab' };
    var cards = { 'v:猫|ねこ': existing };
    srsAddCards({ vocab: unit.vocab, kanji: [], grammar: [] }, cards);
    assert.deepEqual(cards['v:猫|ねこ'], existing, 'existing card data must be preserved');
    assert.strictEqual(Object.keys(cards).length, 1);
  });

  QUnit.test('returns true when cards were added, false when all exist', function (assert) {
    var cards = {};
    assert.strictEqual(srsAddCards(unit, cards), true);
    assert.strictEqual(srsAddCards(unit, cards), false);
  });

  QUnit.test('kana units add kana cards (char → romaji) and cards for their words; practice words get no card', function (assert) {
    var cards = {};
    var kanaUnit = buildUnits(PLAN, CATALOG).filter(function (u) { return u.kind === 'kana'; })[0];
    srsAddCards(kanaUnit, cards);
    var a = cards['c:あ'];
    assert.deepEqual([a.type, a.front, a.back], ['kana', 'あ', 'a']);
    var want = kanaUnit.kana.concat(kanaUnit.vocab).map(function (it) { return it.id; }).sort();
    assert.deepEqual(Object.keys(cards).sort(), want, 'kana + taught words only');
    assert.ok(kanaUnit.vocab.length >= 2 && cards[kanaUnit.vocab[0].id].type === 'vocab', 'word cards');
    kanaUnit.practice.forEach(function (v) { assert.notOk(cards[v.id], 'no card for practice ' + v.id); });
  });

  QUnit.test('card ids are valid store doc ids', function (assert) {
    var cards = {};
    buildUnits(PLAN, CATALOG).forEach(function (u) { srsAddCards(u, cards); });
    var bad = Object.keys(cards).filter(function (id) { return !STORE_ID_RE.test('card:' + id); });
    assert.deepEqual(bad, []);
  });
});
