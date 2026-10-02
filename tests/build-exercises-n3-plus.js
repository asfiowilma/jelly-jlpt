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

  QUnit.test('N2 grammar lesson generates error_find exercise', function (assert) {
    var lesson = { day: 1200, type: 'grammar', chars: [],
      vocab: [['限る', 'かぎる', 'to be limited to']],
      grammar: { pattern: '～に限って', meaning: 'only when / it is always the case that',
        example_jp: '大事なときに限って失敗する。', example_en: 'I always fail at the important moments.' } };
    var exs = buildExercises(lesson);
    var types = exs.map(function (e) { return e.type; });
    assert.ok(types.indexOf('error_find') >= 0, 'N2 grammar lesson generates error_find exercise');
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
