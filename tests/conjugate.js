"use strict";

// Also run headlessly: .claude/hooks/run-tests.js loads this file via a QUnit shim
// (only module/test/strictEqual are shimmed — keep to those).
QUnit.module('conjugate', function () {
  var FORMS = ['て-form', 'ない-form', 'た-form', 'potential', 'passive', 'causative', 'volitional'];
  // [dict, reading, kanji forms in FORMS order]
  var TABLE = [
    ['食べる', 'たべる', ['食べて', '食べない', '食べた', '食べられる', '食べられる', '食べさせる', '食べよう']],
    ['書く', 'かく', ['書いて', '書かない', '書いた', '書ける', '書かれる', '書かせる', '書こう']],
    ['行く', 'いく', ['行って', '行かない', '行った', '行ける', '行かれる', '行かせる', '行こう']],
    ['泳ぐ', 'およぐ', ['泳いで', '泳がない', '泳いだ', '泳げる', '泳がれる', '泳がせる', '泳ごう']],
    ['話す', 'はなす', ['話して', '話さない', '話した', '話せる', '話される', '話させる', '話そう']],
    ['待つ', 'まつ', ['待って', '待たない', '待った', '待てる', '待たれる', '待たせる', '待とう']],
    ['死ぬ', 'しぬ', ['死んで', '死なない', '死んだ', '死ねる', '死なれる', '死なせる', '死のう']],
    ['遊ぶ', 'あそぶ', ['遊んで', '遊ばない', '遊んだ', '遊べる', '遊ばれる', '遊ばせる', '遊ぼう']],
    ['読む', 'よむ', ['読んで', '読まない', '読んだ', '読める', '読まれる', '読ませる', '読もう']],
    ['帰る', 'かえる', ['帰って', '帰らない', '帰った', '帰れる', '帰られる', '帰らせる', '帰ろう']],
    ['買う', 'かう', ['買って', '買わない', '買った', '買える', '買われる', '買わせる', '買おう']],
    ['する', 'する', ['して', 'しない', 'した', 'できる', 'される', 'させる', 'しよう']],
    ['来る', 'くる', ['来て', '来ない', '来た', '来られる', '来られる', '来させる', '来よう']],
    ['勉強する', 'べんきょうする', ['勉強して', '勉強しない', '勉強した', '勉強できる', '勉強される', '勉強させる', '勉強しよう']]
  ];
  var KANA = {
    '食べる': ['たべて', 'たべない', 'たべた', 'たべられる', 'たべられる', 'たべさせる', 'たべよう'],
    '行く': ['いって', 'いかない', 'いった', 'いける', 'いかれる', 'いかせる', 'いこう'],
    '帰る': ['かえって', 'かえらない', 'かえった', 'かえれる', 'かえられる', 'かえらせる', 'かえろう'],
    '来る': ['きて', 'こない', 'きた', 'こられる', 'こられる', 'こさせる', 'こよう'],
    '勉強する': ['べんきょうして', 'べんきょうしない', 'べんきょうした', 'べんきょうできる', 'べんきょうされる', 'べんきょうさせる', 'べんきょうしよう']
  };

  TABLE.forEach(function (row) {
    QUnit.test(row[0] + ' kanji forms', function (assert) {
      FORMS.forEach(function (f, i) {
        var r = conjugate(row[0], row[1], f);
        assert.strictEqual(r && r.kanji, row[2][i], row[0] + ' ' + f);
      });
    });
  });

  Object.keys(KANA).forEach(function (dict) {
    QUnit.test(dict + ' kana forms', function (assert) {
      var reading = TABLE.filter(function (r) { return r[0] === dict; })[0][1];
      FORMS.forEach(function (f, i) {
        var r = conjugate(dict, reading, f);
        assert.strictEqual(r && r.kana, KANA[dict][i], dict + ' ' + f);
      });
    });
  });

  QUnit.test('i/e-row godan exceptions and ichidan', function (assert) {
    assert.strictEqual(conjugate('入る', 'はいる', 'て-form').kanji, '入って');
    assert.strictEqual(conjugate('知る', 'しる', 'ない-form').kanji, '知らない');
    assert.strictEqual(conjugate('見る', 'みる', 'て-form').kanji, '見て');
    assert.strictEqual(conjugate('力を入れる', 'ちからをいれる', 'て-form').kanji, '力を入れて');
    assert.strictEqual(conjugate('信じる', 'しんじる', 'ない-form').kana, 'しんじない');
  });

  QUnit.test('returns null when not a conjugatable verb', function (assert) {
    assert.strictEqual(conjugate('難しい', 'むずかしい', 'て-form'), null);
    assert.strictEqual(conjugate('ある', 'ある', 'ない-form'), null);
    assert.strictEqual(conjugate('信ずる', 'しんずる', 'て-form'), null);
    assert.strictEqual(conjugate('食べる', 'たべる', 'bogus'), null);
  });
});
