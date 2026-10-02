"use strict";

// N3+ exercise types. Units are synthetic (no N3+ content ships yet); items are
// shaped like catalog items but needn't be in CATALOG — only distractors are.
QUnit.module('buildExercises (N3+ types)', {
  beforeEach: function () {
    this._origSpeech = window.speechSynthesis;
    try { delete window.speechSynthesis; } catch (e) { window.speechSynthesis = undefined; }
  },
  afterEach: function () {
    if (this._origSpeech !== undefined) {
      window.speechSynthesis = this._origSpeech;
    }
  }
}, function () {
  function v(word, reading, gloss, pos) {
    var it = { id: 'v:' + word + '|' + reading, kind: 'vocab', word: word, reading: reading, gloss: [gloss] };
    if (pos) it.pos = pos;
    return it;
  }
  function unit(level, index, fields) {
    return Object.assign({ id: 'n5.u999', level: level, kind: 'lesson', index: index, vocab: [], kanji: [], grammar: [] }, fields);
  }
  function types(u, runs) {
    var seen = {};
    for (var i = 0; i < (runs || 20); i++) buildExercises(u).forEach(function (e) { seen[e.type] = true; });
    return seen;
  }
  var VERBS = [v('上げる', 'あげる', 'to raise', 'verb-ichidan'), v('下げる', 'さげる', 'to lower', 'verb-ichidan'),
    v('始める', 'はじめる', 'to begin', 'verb-ichidan'), v('集める', 'あつめる', 'to gather', 'verb-ichidan')];

  QUnit.test('N3 unit with grammar generates fill_blank from catalog patterns', function (assert) {
    var g = CATALOG.items['g:wa-desu'];
    var seen = types(unit('N3', 0, { vocab: VERBS.slice(0, 3), grammar: [g] }));
    assert.ok(seen.fill_blank, 'fill_blank generated');
  });

  QUnit.test('N3 verb unit generates conjugation and pair_match', function (assert) {
    var seen = types(unit('N3', 0, { vocab: VERBS }));
    assert.ok(seen.conjugation, 'conjugation');
    assert.ok(seen.pair_match, 'pair_match');
  });

  QUnit.test('N5 unit never gets N3+ types', function (assert) {
    var seen = types(unit('N5', 0, { vocab: VERBS, grammar: [CATALOG.items['g:mo']] }));
    assert.notOk(seen.conjugation || seen.pair_match || seen.fill_blank || seen.synonym);
  });

  QUnit.test('pair_match carries word→meaning pairs covering its shuffled items', function (assert) {
    var pm = null;
    for (var i = 0; i < 30 && !pm; i++) {
      pm = buildExercises(unit('N3', 0, { vocab: VERBS })).filter(function (e) { return e.type === 'pair_match'; })[0] || null;
    }
    assert.ok(pm, 'pair_match generated');
    var meaning = {};
    pm.pairs.forEach(function (p) { meaning[p[0]] = p[1]; });
    pm.items.forEach(function (w) { assert.ok(pm.options.indexOf(meaning[w]) >= 0, w + ' maps to an option'); });
    assert.strictEqual(meaning['上げる'], 'to raise');
  });

  QUnit.test('conjugation: form from unit index, uses pos; non-verbs skipped', function (assert) {
    // index 1 → ない-form. かえる without pos guesses ichidan; pos godan → かえらない.
    var u = unit('N3', 1, { vocab: [v('かえる', 'かえる', 'to return', 'verb-godan'), v('難しい', 'むずかしい', 'difficult', 'adj-i')] });
    var n = 0;
    for (var i = 0; i < 10; i++) {
      buildExercises(u).filter(function (e) { return e.type === 'conjugation'; }).forEach(function (c) {
        n++;
        assert.strictEqual(c.question, 'かえる');
        assert.deepEqual(c.answers, ['かえらない']);
      });
    }
    assert.ok(n > 0, 'conjugation generated');
  });

  QUnit.test('conjugation falls back to the "to …" gloss heuristic without pos', function (assert) {
    var u = unit('N3', 1, { vocab: [v('書く', 'かく', 'to write'), v('難しい', 'むずかしい', 'difficult')] });
    for (var i = 0; i < 10; i++) {
      buildExercises(u).filter(function (e) { return e.type === 'conjugation'; }).forEach(function (c) {
        assert.strictEqual(c.question, '書く (かく)');
        assert.deepEqual(c.answers, ['書かない', 'かかない']);
      });
    }
  });

  QUnit.test('N2 unit generates synonym and kanji_reading; no reorder', function (assert) {
    var seen = types(unit('N2', 0, { vocab: VERBS, kanji: [CATALOG.items['k:人'], CATALOG.items['k:大']] }));
    assert.ok(seen.synonym, 'synonym');
    assert.ok(seen.kanji_reading, 'kanji_reading');
    assert.notOk(seen.reorder, 'reorder disabled (needs authored chunks)');
  });

  QUnit.test('caps: N3 ≤ 7, N2 ≤ 9', function (assert) {
    var fields = { vocab: VERBS, kanji: [CATALOG.items['k:人'], CATALOG.items['k:大']], grammar: [CATALOG.items['g:mo']] };
    for (var i = 0; i < 10; i++) {
      assert.ok(buildExercises(unit('N3', 0, fields)).length <= 7);
      assert.ok(buildExercises(unit('N2', 0, fields)).length <= 9);
    }
  });
});
