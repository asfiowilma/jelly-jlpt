QUnit.module('reviewTabs', function () {
  QUnit.test('non-review units get no tabs', function (assert) {
    assert.deepEqual(reviewTabs({ kind: 'lesson', kana: [], vocab: [1], kanji: [], grammar: [] }), []);
  });
  QUnit.test('order is kana, words, kanji, grammar; empty groups dropped; counts shown', function (assert) {
    assert.deepEqual(reviewTabs({ kind: 'review', kana: [], vocab: [1, 2], kanji: [1], grammar: [1, 2, 3] }),
      [{ id: 'words', label: 'Words', n: 2 }, { id: 'kanji', label: 'Kanji', n: 1 }, { id: 'grammar', label: 'Grammar', n: 3 }]);
    assert.equal(reviewTabs({ kind: 'review', kana: [1], vocab: [], kanji: [], grammar: [] })[0].id, 'kana');
  });
  QUnit.test('every shipped review unit has a first tab', function (assert) {
    buildUnits(PLAN, CATALOG).filter(function (u) { return u.kind === 'review'; }).forEach(function (u) {
      assert.ok(reviewTabs(u).length > 0, u.id);
    });
  });
  QUnit.test('pageTerms splits by tab: grammar text vs word types', function (assert) {
    var u = { kind: 'review', kana: [], vocab: [{ pos: 'adj-i' }], kanji: [], grammar: [{ pattern: 'は', formation: 'noun + particle', notes: '' }] };
    assert.deepEqual(pageTerms(u, 'grammar').map(function (x) { return x.label; }), ['particle']);
    assert.deepEqual(pageTerms(u, 'words').map(function (x) { return x.label; }), ['い-adjective']);
    assert.equal(pageTerms(u).length, 2, 'no part = both');
  });
  QUnit.test('reviewFuriTabs: grammar always, words only with ruby in usage or tip', function (assert) {
    var base = { kind: 'review', kana: [], vocab: [{ usage: 'ひらがな' }], kanji: [1], grammar: [1] };
    assert.deepEqual(reviewFuriTabs(base), ['grammar']);
    base.vocab = [{ usage: '[本|ほん]をよむ' }];
    assert.deepEqual(reviewFuriTabs(base), ['words', 'grammar']);
    assert.deepEqual(reviewFuriTabs({ kind: 'review', kana: [1], vocab: [], kanji: [], grammar: [] }), []);
  });
});
