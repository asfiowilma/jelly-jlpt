"use strict";

// Stages tab: chapter builder and search.
QUnit.module('stage nav', function () {
  function u(i, level, kind, title, extra) { return Object.assign({ index: i, id: level + '.' + i, level: level, kind: kind, title: title }, extra || {}); }
  var FAKE = [
    u(0, 'N5', 'kana', 'Hiragana: vowels', { vocab: [{ word: 'いい', reading: 'いい', gloss: ['good', 'fine'] }] }),
    u(1, 'N5', 'lesson', 'Greetings', { vocab: [{ word: '会う', reading: 'あう', gloss: ['to meet'] }], kanji: [{ char: '会' }], grammar: [{ pattern: '〜も', meaning: '~ too' }] }),
    u(2, 'N5', 'review', 'Review: stages 1–2', { vocab: [{ word: '会う', reading: 'あう', gloss: ['to meet'] }] }),
    u(3, 'N5', 'lesson', 'Family'),
    u(4, 'N5', 'prep', 'Test prep: strategy'),
    u(5, 'N5', 'mock', 'Mock exam 1'),
    u(6, 'N4', 'lesson', 'Weather'),
    u(7, 'N4', 'review', 'Review: stages 7–7'),
    u(8, 'N4', 'prep', 'Test prep: grammar')
  ];

  QUnit.test('buildChapters: lessons up to each review, one closing chapter per level', function (assert) {
    var ch = buildChapters(FAKE);
    assert.deepEqual(ch.map(function (c) { return c.id + ':' + c.units.length; }), ['n5.c1:3', 'n5.c2:1', 'n5.cx:2', 'n4.c1:2', 'n4.cx:1']);
    assert.deepEqual(ch.map(function (c) { return c.name; }), ['Chapter 1', 'Chapter 2', 'Exam prep & mocks', 'Chapter 1', 'Exam prep & mocks']);
    assert.deepEqual(ch.map(function (c) { return c.range; }), ['Stages 1–3', 'Stage 4', 'Stages 5–6', 'Stages 7–8', 'Stage 9']);
    assert.strictEqual(ch[0].topics, 'vowels · Greetings', 'kana prefix stripped, review left out');
  });

  QUnit.test('buildChapters: real plan covers every stage once, in order', function (assert) {
    var units = buildUnits(PLAN, CATALOG), ch = buildChapters(units);
    var ids = [].concat.apply([], ch.map(function (c) { return c.units.map(function (x) { return x.index; }); })).sort(function (a, b) { return a - b; });
    assert.deepEqual(ids, units.map(function (x) { return x.index; }));
    assert.strictEqual(new Set(ch.map(function (c) { return c.id; })).size, ch.length, 'unique ids');
    ch.forEach(function (c) { assert.strictEqual(c.last - c.first + 1, c.units.length, c.id + ' contiguous'); });
  });

  QUnit.test('searchStages: number, level, kind, word, kanji, grammar; empty = null', function (assert) {
    var ix = buildStageIndex(FAKE), idx = function (q) { return searchStages(ix, q).map(function (r) { return r.unit.index; }); };
    assert.strictEqual(searchStages(ix, '  '), null);
    assert.deepEqual(idx('2'), [1], 'stage number');
    assert.deepEqual(idx('n4'), [6, 7, 8], 'level');
    assert.deepEqual(idx('review n4'), [7], 'kind + level');
    assert.deepEqual(idx('meet'), [1], 'gloss; the review repeats it but is not indexed');
    assert.deepEqual(idx('会'), [1]);
    assert.deepEqual(idx('too'), [1]);
    assert.deepEqual(idx('zzz'), []);
    assert.strictEqual(searchStages(ix, 'meet')[0].hits[0].kind, 'word');
    assert.strictEqual(searchStages(ix, '〜も')[0].hits[0].kind, 'grammar');
  });
});
