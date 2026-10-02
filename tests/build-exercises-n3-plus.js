"use strict";

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

  QUnit.test('N3 grammar lesson generates fill_blank exercise', function (assert) {
    var lesson = { day: 830, type: 'grammar', vocab: [['試験', 'しけん', 'exam'], ['結果', 'けっか', 'result'], ['合格', 'ごうかく', 'pass']], chars: [],
      grammar: { pattern: '～おかげで', meaning: 'thanks to', example_jp: '先生のおかげで合格した。', example_en: 'I passed thanks to my teacher.' } };
    var exs = buildExercises(lesson);
    var types = exs.map(function (e) { return e.type; });
    assert.ok(types.indexOf('fill_blank') >= 0 || types.indexOf('mc') >= 0, 'generates fill_blank or mc exercise');
  });

  QUnit.test('N3 verb lesson generates conjugation exercise', function (assert) {
    var lesson = { day: 780, type: 'verbs', vocab: [['上げる', 'あげる', 'to raise'], ['下げる', 'さげる', 'to lower'], ['始める', 'はじめる', 'to begin'], ['集める', 'あつめる', 'to gather']], chars: [],
      grammar: { pattern: 'transitive pairs', meaning: 'verb pairs', example_jp: '手を上げる。', example_en: 'Raise your hand.' } };
    var exs = buildExercises(lesson);
    var types = exs.map(function (e) { return e.type; });
    assert.ok(types.indexOf('conjugation') >= 0 || types.indexOf('pair_match') >= 0, 'generates conjugation or pair_match');
  });

  QUnit.test('pair_match carries word→meaning pairs covering its shuffled items', function (assert) {
    var lesson = { day: 780, type: 'verbs', chars: [],
      vocab: [['上げる', 'あげる', 'to raise'], ['下げる', 'さげる', 'to lower'], ['始める', 'はじめる', 'to begin'], ['集める', 'あつめる', 'to gather']] };
    var pm = null;
    for (var i = 0; i < 20 && !pm; i++) {
      pm = buildExercises(lesson).filter(function (e) { return e.type === 'pair_match'; })[0] || null;
    }
    assert.ok(pm, 'pair_match generated');
    var meaning = {};
    pm.pairs.forEach(function (p) { meaning[p[0]] = p[1]; });
    pm.items.forEach(function (w) {
      assert.ok(pm.options.indexOf(meaning[w]) >= 0, w + ' maps to an option');
    });
    assert.strictEqual(meaning['上げる'], 'to raise');
  });

  QUnit.test('exercise cap is respected for N3 lessons', function (assert) {
    var lesson = curriculum[700] || curriculum[0]; // N3 lesson or fallback
    var exs = buildExercises(lesson);
    var cap = exerciseCap(lesson.day);
    assert.ok(exs.length <= cap, 'exercises count ' + exs.length + ' <= cap ' + cap);
  });

  QUnit.test('N2 vocab lesson generates synonym exercise', function (assert) {
    var lesson = { day: 1050, type: 'vocab', chars: [],
      vocab: [
        ['契約', 'けいやく', 'contract'], ['利益', 'りえき', 'profit'], ['投資', 'とうし', 'investment'],
        ['経営', 'けいえい', 'management'], ['売上', 'うりあげ', 'sales']
      ] };
    var exs = buildExercises(lesson);
    var types = exs.map(function (e) { return e.type; });
    assert.ok(types.indexOf('synonym') >= 0, 'N2 vocab lesson generates synonym exercise');
  });

  QUnit.test('N2 grammar lesson generates reorder exercise', function (assert) {
    var lesson = { day: 1180, type: 'grammar', chars: [],
      vocab: [['わけだ', 'わけだ', "that's why"]],
      grammar: { pattern: '～わけだ', meaning: "that's why / no wonder",
        example_jp: 'だから彼女は怒っているわけだ。', example_en: "So that's why she is angry." } };
    var exs = buildExercises(lesson);
    var types = exs.map(function (e) { return e.type; });
    assert.ok(types.indexOf('reorder') >= 0, 'N2 grammar lesson generates reorder exercise');
  });

  QUnit.test('conjugation answers are real conjugations; non-verbs skipped', function (assert) {
    var lesson = { day: 771, type: 'verbs', chars: [], // 771 % 7 = 1 → ない-form
      vocab: [['書く', 'かく', 'to write'], ['難しい', 'むずかしい', 'difficult']] };
    for (var i = 0; i < 10; i++) {
      buildExercises(lesson).filter(function (e) { return e.type === 'conjugation'; }).forEach(function (c) {
        assert.strictEqual(c.question, '書く (かく)');
        assert.deepEqual(c.answers, ['書かない', 'かかない']);
      });
    }
  });

  QUnit.test('reorderChunks splits on spaces, else after particles, never mid-word', function (assert) {
    assert.deepEqual(reorderChunks('私は 毎日 学校に 行きます。'), ['私は', '毎日', '学校に', '行きます']);
    assert.deepEqual(reorderChunks('先生のおかげで試験に合格した。'), ['先生の', 'おかげで', '試験に', '合格した']);
    assert.deepEqual(reorderChunks('鳥が空に上がった。'), ['鳥が', '空に', '上がった']);
    assert.strictEqual(reorderChunks('はい。'), null);
  });

  QUnit.test('fill_blank never uses placeholder patterns', function (assert) {
    curriculum.slice(660).forEach(function (lesson) {
      buildExercises(lesson).filter(function (e) { return e.type === 'fill_blank'; }).forEach(function (ex) {
        ex.options.forEach(function (o) { assert.notOk(isPlaceholderPattern(o), 'day ' + lesson.day + ': ' + o); });
      });
    });
    assert.ok(isPlaceholderPattern('Review & Practice') && isPlaceholderPattern('Phase 18 grammar patterns comprehensive review'));
  });

  QUnit.test('N2 kanji lesson generates kanji_reading exercise', function (assert) {
    var lesson = { day: 1240, type: 'kanji', vocab: [],
      chars: [['裁', 'さい'], ['憲', 'けん'], ['権', 'けん'], ['議', 'ぎ'], ['税', 'ぜい']] };
    var exs = buildExercises(lesson);
    var types = exs.map(function (e) { return e.type; });
    assert.ok(types.indexOf('kanji_reading') >= 0, 'N2 kanji lesson generates kanji_reading exercise');
  });

  QUnit.test('exercise cap is respected for N2 lessons', function (assert) {
    var lesson = curriculum[1000] || curriculum[0]; // N2 lesson or fallback
    var exs = buildExercises(lesson);
    var cap = exerciseCap(lesson.day);
    assert.ok(exs.length <= cap, 'exercises count ' + exs.length + ' <= cap ' + cap);
  });
});

// ── 15. Passage field validation ────────────────────────────────────────────
