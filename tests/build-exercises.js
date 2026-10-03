"use strict";

QUnit.module('buildExercises', {
  // Disable speechSynthesis so "listen" exercises are consistently excluded,
  // making test output deterministic regardless of browser support.
  beforeEach: function () {
    this._origSpeech = window.speechSynthesis;
    try { delete window.speechSynthesis; } catch (e) { window.speechSynthesis = undefined; }
    this.unit = buildUnits(PLAN, CATALOG).filter(function (u) { return u.kind === 'lesson'; })[0]; // vocab + kanji + grammar
  },
  afterEach: function () {
    if (this._origSpeech !== undefined) {
      window.speechSynthesis = this._origSpeech;
    }
  }
}, function () {

  QUnit.test('never returns more than the N5 cap (5)', function (assert) {
    var exs = buildExercises(this.unit);
    assert.ok(exs.length > 0 && exs.length <= 5, 'got ' + exs.length + ' exercises (max 5)');
  });

  QUnit.test('per-unit quiz.cap overrides the level cap', function (assert) {
    var exs = buildExercises(Object.assign({}, this.unit, { quiz: { cap: 2 } }));
    assert.strictEqual(exs.length, 2);
  });

  QUnit.test('returns empty array for a unit with no items', function (assert) {
    var exs = buildExercises({ id: 'n5.u999', level: 'N5', index: 0, vocab: [], kanji: [], grammar: [] });
    assert.equal(exs.length, 0);
  });

  QUnit.test('mc exercises have required fields and in-bounds correct index (10 runs)', function (assert) {
    for (var run = 0; run < 10; run++) {
      buildExercises(this.unit).filter(function (e) { return e.type === 'mc'; }).forEach(function (mc) {
        assert.ok(mc.prompt, 'mc.prompt is non-empty');
        assert.ok(mc.options.length >= 2, 'mc has at least 2 options');
        assert.ok(mc.correct >= 0 && mc.correct < mc.options.length, 'correct=' + mc.correct);
      });
    }
  });

  QUnit.test('typing exercises have a non-empty answers array', function (assert) {
    for (var run = 0; run < 5; run++) {
      buildExercises(this.unit).filter(function (e) { return e.type === 'typing'; }).forEach(function (t) {
        assert.ok(Array.isArray(t.answers) && t.answers.length > 0, 'typing.answers is non-empty');
      });
    }
  });

  QUnit.test('kanji typing accepts kun, on (katakana) and on typed in hiragana', function (assert) {
    var k = CATALOG.items['k:人'];
    var unit = { id: 'n5.u999', level: 'N5', index: 0, vocab: [], kanji: [k, k], grammar: [] };
    var typing = null;
    for (var i = 0; i < 20 && !typing; i++) {
      typing = buildExercises(unit).filter(function (e) { return e.type === 'typing'; })[0] || null;
    }
    assert.ok(typing, 'typing generated');
    ['ひと', 'ジン', 'じん'].forEach(function (a) { assert.ok(checkTyping(a, typing.answers), a); });
  });

  QUnit.test('kana unit: kana → romaji MC, romaji typing, romaji → kana MC; unambiguous same-script options', function (assert) {
    var kanaUnit = buildUnits(PLAN, CATALOG).filter(function (u) { return u.kind === 'kana'; })[1]; // か/さ rows
    var types = {};
    for (var run = 0; run < 20; run++) {
      buildExercises(kanaUnit).forEach(function (e) {
        var k = CATALOG.items['c:' + e.question] || catalogOf('kana').filter(function (x) { return x.script === 'hiragana' && x.romaji === e.question; })[0];
        assert.ok(k && k.kind === 'kana', 'question is a unit kana or its romaji: ' + e.question);
        if (e.type === 'typing') {
          types.typing = true;
          assert.ok(checkTyping(k.romaji, e.answers) && checkTyping(k.answers[k.answers.length - 1], e.answers), 'accepts every romaji spelling');
          return;
        }
        var toRomaji = e.question === k.char;
        types[toRomaji ? 'toRomaji' : 'toKana'] = true;
        assert.strictEqual(e.options.length, 4, '4 options');
        assert.strictEqual(new Set(e.options).size, 4, 'distinct options');
        assert.strictEqual(e.options[e.correct], toRomaji ? k.romaji : k.char, 'correct option');
        if (!toRomaji) {
          assert.ok(e.options.every(function (c) { return /^[ぁ-ゖ]+$/.test(c); }), 'same script');
          assert.ok(e.options.every(function (c, i) { return i === e.correct || CATALOG.items['c:' + c].answers.indexOf(k.romaji) < 0; }), 'no other option reads ' + k.romaji);
        }
      });
    }
    assert.deepEqual(Object.keys(types).sort(), ['toKana', 'toRomaji', 'typing']);
    assert.strictEqual(buildExercises(kanaUnit).length, 10, 'quiz.cap 10 for a 10-kana unit');
  });

  QUnit.test('kanaDistractors: look-alikes and dakuten siblings first, never a same-sounding kana', function (assert) {
    var c = function (ch) { return CATALOG.items['c:' + ch]; };
    var shi = kanaDistractors(c('シ'), 3, []).map(function (x) { return x.char; });
    assert.ok(shi.indexOf('ツ') >= 0, 'シ → ツ: ' + shi.join(''));
    for (var i = 0; i < 20; i++) {
      assert.ok(kanaDistractors(c('じ'), 3, []).every(function (x) { return x.char !== 'ぢ'; }), 'じ never gets ぢ (both ji)');
    }
    var kya = kanaDistractors(c('きゃ'), 3, []);
    assert.ok(kya.every(function (x) { return x.char.length === 2 && x.script === 'hiragana'; }), 'combos get combos');
    assert.ok(kya.some(function (x) { return x.char.charAt(0) === 'き' || x.char.charAt(0) === 'ぎ'; }), 'きゃ → きゅ/きょ/ぎゃ…');
  });

  QUnit.test('every shipped unit builds a quiz', function (assert) {
    buildUnits(PLAN, CATALOG).forEach(function (u) {
      assert.ok(buildExercises(u).length > 0, u.id);
    });
  });
});
