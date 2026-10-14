"use strict";

// Review unit panels: source stages (buildUnits), the grouped word list, the flashcard deck, kanji tile meaning.
QUnit.module('review panels', function () {
  var units = function () { return buildUnits(PLAN, CATALOG); };

  QUnit.test('sources are the kana / lesson stages since the previous review, in order', function (assert) {
    var all = units(), prev = {}, bad = [];
    all.forEach(function (u) {
      if (u.kind === 'review') {
        var from = prev[u.level] === undefined ? -1 : prev[u.level];
        var want = all.filter(function (x) { return x.level === u.level && x.index > from && x.index < u.index && (x.kind === 'lesson' || x.kind === 'kana'); });
        if (u.sources.map(function (s) { return s.index; }).join() !== want.map(function (x) { return x.index; }).join()) bad.push(u.id);
        u.sources.forEach(function (s) { if (!all[s.index] || all[s.index].id !== s.unitId || all[s.index].title !== s.title) bad.push(u.id + ' source ' + s.unitId); });
        if (!u.sources.length) bad.push(u.id + ' has no sources');
        prev[u.level] = u.index;
      } else if (u.sources) bad.push(u.id + ' has sources');
    });
    assert.deepEqual(bad, [], 'review sources match the stages before them');
  });

  QUnit.test('every vocab / grammar item of a review is in exactly one source group', function (assert) {
    var bad = [];
    units().filter(function (u) { return u.kind === 'review'; }).forEach(function (u) {
      ['vocab', 'grammar'].forEach(function (f) {
        var groups = reviewSourceGroups(u, f), count = {};
        groups.forEach(function (g) { g.items.forEach(function (it) { count[it.id] = (count[it.id] || 0) + 1; }); });
        u[f].forEach(function (it) { if (count[it.id] !== 1) bad.push(u.id + ' ' + f + ' ' + it.id + ' x' + (count[it.id] || 0)); });
        groups.forEach(function (g) { g.items.forEach(function (it) { if (g.source[f].indexOf(it.id) < 0) bad.push(u.id + ' misplaced ' + it.id); }); });
      });
    });
    assert.deepEqual(bad, []);
  });

  QUnit.test('reviewSourceGroups: first stage wins a repeated item, empty stages drop', function (assert) {
    var u = { vocab: [{ id: 'v:a' }, { id: 'v:b' }], sources: [{ index: 1, vocab: ['v:a'] }, { index: 2, vocab: [] }, { index: 3, vocab: ['v:a', 'v:b'] }] };
    var g = reviewSourceGroups(u, 'vocab');
    assert.deepEqual(g.map(function (x) { return [x.source.index, x.items.map(function (i) { return i.id; })]; }), [[1, ['v:a']], [3, ['v:b']]]);
  });

  QUnit.test('deck: Again re-queues at the back, Know advances, done when empty', function (assert) {
    var d = deckStart(['a', 'b', 'c']);
    d = deckAnswer(d, false);
    assert.deepEqual(d.queue, ['b', 'c', 'a']);
    assert.strictEqual(d.again, 1);
    d = deckAnswer(deckAnswer(d, true), true);
    assert.deepEqual(d.queue, ['a']);
    d = deckAnswer(deckAnswer(d, false), false);
    assert.deepEqual(d.queue, ['a']);
    assert.deepEqual(d.missed, ['a'], 'one card counted once');
    assert.strictEqual(d.again, 3);
    d = deckAnswer(d, true);
    assert.deepEqual(d.queue, []);
    assert.strictEqual(d.total, 3);
    assert.strictEqual(deckAnswer(d, true), d, 'an empty deck stays done');
  });

  QUnit.test('firstMeaning: first segment of a kanji meaning', function (assert) {
    assert.strictEqual(firstMeaning({ meaning: ['life', 'birth'] }), 'life');
    assert.strictEqual(firstMeaning({ meaning: ['book · origin'] }), 'book');
    assert.strictEqual(firstMeaning({ meaning: ['previous, ahead'] }), 'previous');
    assert.strictEqual(firstMeaning({ meaning: [] }), '');
  });
});
