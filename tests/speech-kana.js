"use strict";

QUnit.module('speech text is kana', function () {
  var KANJI = /[㐀-鿿]/;
  QUnit.test('sentence, vocab and review card hand kana to the voice', function (assert) {
    var s = speechText('[何|なん]ですか');
    assert.equal(s, 'なんですか');
    assert.notOk(KANJI.test(s), 'sentence');
    var v = { word: '何', reading: 'なに' };
    assert.notOk(KANJI.test(v.reading), 'vocab speaks the reading');
    assert.equal(cardSpeech({ type: 'vocab', front: '何', reading: 'なに' }), 'なに', 'vocab card');
    assert.equal(cardSpeech({ type: 'kanji', front: '食', reading: 'た.べる・ショク' }), 'たべる', 'kanji card: main reading, markers stripped');
    assert.equal(cardSpeech({ type: 'kana', front: 'あ', romaji: 'a' }), 'あ', 'kana card unchanged');
  });
});
