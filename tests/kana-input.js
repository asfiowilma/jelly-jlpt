"use strict";

// romajiToKana: live romaji → hiragana for the kana answer boxes.
QUnit.module('kana-input', function () {
  QUnit.test('romajiToKana', function (assert) {
    var cases = {
      kanji: 'かんじ', nihonn: 'にほん', gakkou: 'がっこう', shashinn: 'しゃしん', konnichiha: 'こんにちは',
      "kon'nichi": 'こんにち', onna: 'おんな', nn: 'ん', ryokou: 'りょこう', ju: 'じゅ', 'ra-menn': 'らーめん',
      ka: 'か', k: 'k', sh: 'sh', n: 'n', 'かn': 'かn', 'たべru': 'たべる', '食べru': '食べる'
    };
    Object.keys(cases).forEach(function (k) { assert.equal(romajiToKana(k), cases[k], k); });
    assert.equal(romajiToKana(romajiToKana('kanji')), 'かんじ', 'idempotent');
  });
});
