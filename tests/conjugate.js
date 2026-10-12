"use strict";

// Also run headlessly: .claude/hooks/run-tests.js loads this file via a QUnit shim
// (only module/test/strictEqual are shimmed — keep to those).
// N4 forms (ば, たら, imperative, causative-passive, なくて) and adjectives, each fact checked
// against two sources:
//   Tae Kim: https://guidetojapanese.org/learn/grammar/conditionals (ば: e-row + ば, 食べれば;
//     い-adj ければ; たら = past + ら), https://guidetojapanese.org/learn/grammar/requests (command:
//     ru ろ, u e-row, しろ, こい, くれ), https://guidetojapanese.org/learn/grammar/causepass (long
//     させられる; short される for u-verbs, not for す-verbs; させられる, こさせられる),
//     https://guidetojapanese.org/learn/grammar/adjectives (くない, かった, いい → よ).
//   Genki II ch.23 via https://wp.stolaf.edu/japanese/grammar-index/genki-i-ii-grammar-index/causative-passive-sentences-genki-ii-chapter-23/
//     (かかされる, はなさせられる, たべさせられる); Wikipedia, https://en.wikipedia.org/wiki/Japanese_verb_conjugation
//     (読めば / 読め, 見れば / 見ろ, すれば / しろ, くれば / こい, よければ, 大きくない / 大きかった).
//   なくて = the ない-form's い → くて (Genki I ch.7 te-form of adjectives, applied to ない; Bunpro なくて).
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

  QUnit.test('item pos overrides the る-verb guess', function (assert) {
    // かえる (kana only) guesses ichidan; pos says godan (帰る)
    assert.strictEqual(conjugate('かえる', 'かえる', 'ない-form').kana, 'かえない');
    assert.strictEqual(conjugate('かえる', 'かえる', 'ない-form', 'verb-godan').kana, 'かえらない');
    // pos wins over the exception list too
    assert.strictEqual(conjugate('入る', 'はいる', 'て-form', 'verb-ichidan').kanji, '入て');
  });

  QUnit.test('returns null when not a conjugatable verb', function (assert) {
    assert.strictEqual(conjugate('難しい', 'むずかしい', 'て-form'), null);
    assert.strictEqual(conjugate('ある', 'ある', 'ない-form'), null);
    assert.strictEqual(conjugate('信ずる', 'しんずる', 'て-form'), null);
    assert.strictEqual(conjugate('食べる', 'たべる', 'bogus'), null);
  });

  // N4 forms, appended to CONJ_FORMS (the first seven keep their indexes)
  var N4_FORMS = ['ば-form', 'たら-form', 'imperative', 'causative-passive', 'なくて-form'];
  var N4_TABLE = [
    ['食べる', 'たべる', ['食べれば', '食べたら', '食べろ', '食べさせられる', '食べなくて']],
    ['書く', 'かく', ['書けば', '書いたら', '書け', '書かされる', '書かなくて']],
    ['行く', 'いく', ['行けば', '行ったら', '行け', '行かされる', '行かなくて']],
    ['泳ぐ', 'およぐ', ['泳げば', '泳いだら', '泳げ', '泳がされる', '泳がなくて']],
    ['話す', 'はなす', ['話せば', '話したら', '話せ', '話させられる', '話さなくて']],
    ['待つ', 'まつ', ['待てば', '待ったら', '待て', '待たされる', '待たなくて']],
    ['死ぬ', 'しぬ', ['死ねば', '死んだら', '死ね', '死なされる', '死ななくて']],
    ['遊ぶ', 'あそぶ', ['遊べば', '遊んだら', '遊べ', '遊ばされる', '遊ばなくて']],
    ['読む', 'よむ', ['読めば', '読んだら', '読め', '読まされる', '読まなくて']],
    ['帰る', 'かえる', ['帰れば', '帰ったら', '帰れ', '帰らされる', '帰らなくて']],
    ['買う', 'かう', ['買えば', '買ったら', '買え', '買わされる', '買わなくて']],
    ['する', 'する', ['すれば', 'したら', 'しろ', 'させられる', 'しなくて']],
    ['来る', 'くる', ['来れば', '来たら', '来い', '来させられる', '来なくて']],
    ['勉強する', 'べんきょうする', ['勉強すれば', '勉強したら', '勉強しろ', '勉強させられる', '勉強しなくて']]
  ];
  QUnit.test('CONJ_FORMS keeps the N5 order and appends the N4 forms', function (assert) {
    assert.strictEqual(CONJ_FORMS.join(), FORMS.concat(N4_FORMS).join());
  });
  N4_TABLE.forEach(function (row) {
    QUnit.test(row[0] + ' N4 forms', function (assert) {
      N4_FORMS.forEach(function (f, i) {
        var r = conjugate(row[0], row[1], f);
        assert.strictEqual(r && r.kanji, row[2][i], row[0] + ' ' + f);
      });
    });
  });
  QUnit.test('N4 forms in kana, る-exceptions, いる, くれる', function (assert) {
    var kana = function (d, r, f, p) { var c = conjugate(d, r, f, p); return c && c.kana; };
    assert.strictEqual(kana('来る', 'くる', 'ば-form'), 'くれば');
    assert.strictEqual(kana('来る', 'くる', 'たら-form'), 'きたら');
    assert.strictEqual(kana('来る', 'くる', 'imperative'), 'こい');
    assert.strictEqual(kana('来る', 'くる', 'causative-passive'), 'こさせられる');
    assert.strictEqual(kana('来る', 'くる', 'なくて-form'), 'こなくて');
    assert.strictEqual(kana('行く', 'いく', 'たら-form'), 'いったら');
    assert.strictEqual(kana('入る', 'はいる', 'ば-form'), 'はいれば');
    assert.strictEqual(kana('入る', 'はいる', 'imperative'), 'はいれ');
    assert.strictEqual(kana('知る', 'しる', 'なくて-form'), 'しらなくて');
    assert.strictEqual(kana('走る', 'はしる', 'causative-passive'), 'はしらされる');
    assert.strictEqual(kana('見る', 'みる', 'imperative'), 'みろ');
    assert.strictEqual(kana('見る', 'みる', 'ば-form'), 'みれば');
    assert.strictEqual(kana('いる', 'いる', 'たら-form'), 'いたら');
    assert.strictEqual(kana('起きる', 'おきる', 'causative-passive'), 'おきさせられる');
    assert.strictEqual(kana('かえる', 'かえる', 'imperative', 'verb-godan'), 'かえれ');
    assert.strictEqual(kana('くれる', 'くれる', 'imperative'), 'くれ');
    assert.strictEqual(kana('寝る', 'ねる', 'imperative'), 'ねろ');
    assert.strictEqual(conjugate('ある', 'ある', 'ば-form'), null, 'ある stays unhandled');
    assert.strictEqual(conjugate('安い', 'やすい', 'ば-form'), null, 'adjectives go through conjugateAdj');
    assert.strictEqual(conjugate('安い', 'やすい', 'くて-form'), null, 'くて-form is adjective-only');
  });

  var ADJ = [
    ['安い', 'やすい', 'adj-i', ['安くて', '安くない', '安かった', '安ければ', '安くなくて'], ['やすくて', 'やすくない', 'やすかった', 'やすければ', 'やすくなくて']],
    ['いい', 'いい', 'adj-i', ['よくて', 'よくない', 'よかった', 'よければ', 'よくなくて'], ['よくて', 'よくない', 'よかった', 'よければ', 'よくなくて']],
    ['大きい', 'おおきい', 'adj-i', ['大きくて', '大きくない', '大きかった', '大きければ', '大きくなくて'], ['おおきくて', 'おおきくない', 'おおきかった', 'おおきければ', 'おおきくなくて']],
    ['静か', 'しずか', 'adj-na', ['静かで', '静かじゃない', '静かだった', '静かなら', '静かじゃなくて'], ['しずかで', 'しずかじゃない', 'しずかだった', 'しずかなら', 'しずかじゃなくて']],
    ['学生', 'がくせい', 'noun', ['学生で', '学生じゃない', '学生だった', '学生なら', '学生じゃなくて'], ['がくせいで', 'がくせいじゃない', 'がくせいだった', 'がくせいなら', 'がくせいじゃなくて']]
  ];
  ADJ.forEach(function (row) {
    QUnit.test('conjugateAdj ' + row[0], function (assert) {
      ADJ_FORMS.forEach(function (f, i) {
        var r = conjugateAdj(row[0], row[1], f, row[2]);
        assert.strictEqual(r && r.kanji, row[3][i], row[0] + ' ' + f);
        assert.strictEqual(r && r.kana, row[4][i], row[0] + ' ' + f + ' kana');
      });
    });
  });
  QUnit.test('conjugateAdj: ではない / であれば also right; null outside adjectives and nouns', function (assert) {
    assert.strictEqual(conjugateAdj('静か', 'しずか', 'ない-form', 'adj-na').also.join(), '静かではない,しずかではない');
    assert.strictEqual(conjugateAdj('静か', 'しずか', 'ば-form', 'adj-na').also.join(), '静かであれば,しずかであれば');
    assert.strictEqual(conjugateAdj('安い', 'やすい', 'ない-form', 'adj-i').also, undefined);
    assert.strictEqual(conjugateAdj('食べる', 'たべる', 'くて-form', 'verb-ichidan'), null);
    assert.strictEqual(conjugateAdj('安い', 'やすい', 'potential', 'adj-i'), null);
    assert.strictEqual(conjugateItem({ word: '安い', reading: 'やすい', pos: 'adj-i' }, 'ば-form').kanji, '安ければ');
    assert.strictEqual(conjugateItem({ word: '書く', reading: 'かく', pos: 'verb-godan' }, 'ば-form').kanji, '書けば');
  });
  QUnit.test('a conjugation prompt names the meaning when another verb reads the same (N5 r1 newbie N3: きる)', function (assert) {
    var u = buildUnits(PLAN, CATALOG).filter(function (x) { return (x.grammar || []).some(function (g) { return g.conjForm === 'ない-form'; }); })[0];
    var ctx = quizContext(u), conj = function (id) { return formsFor(CATALOG.items[id], ctx).filter(function (f) { return f.name === 'conj'; })[0].make(); };
    var cut = conj('v:切る|きる'), wear = conj('v:着る|きる'), eat = conj('v:食べる|たべる');
    assert.strictEqual(cut.note, '"' + glossText(CATALOG.items['v:切る|きる']) + '"');
    assert.ok(cut.answers.indexOf('きらない') >= 0 && wear.answers.indexOf('きない') >= 0, cut.answers + ' / ' + wear.answers);
    assert.notStrictEqual(cut.note, wear.note, 'each names its own meaning');
    assert.strictEqual(eat.note, undefined, 'no twin, no note');
  });
  QUnit.test('a form the verb never takes (conjSkip) is never asked (N4 r1 grammar T4: 決まろう, 空かれる)', function (assert) {
    var it = function (id) { return CATALOG.items[id]; };
    assert.strictEqual(conjugateItem(it('v:決まる|きまる'), 'volitional'), null, '決まろう');
    assert.strictEqual(conjugateItem(it('v:空く|あく'), 'passive'), null, '空かれる');
    assert.strictEqual(conjugateItem(it('v:込む|こむ'), 'causative'), null, '込ませる');
    assert.strictEqual(conjugateItem(it('v:決まる|きまる'), 'て-form').kana, 'きまって', 'plain forms stay');
    assert.ok(conjugateItem(it('v:降る|ふる'), 'passive'), '雨に降られる (suffering passive) stays');
    var odd = /^(過ぎよう|決まろう|鳴ろう|見つかろう|空かれる|込まれる|込ませる)$/; // kanji spellings: なろう (なる become) is fine
    buildUnits(PLAN, CATALOG).filter(function (u) { return u.level === 'N4' && (u.grammar || []).some(function (g) { return g.conjForm; }); }).forEach(function (u) {
      var g = u.grammar.filter(function (x) { return x.conjForm; })[0], f = formsFor(g, quizContext(u)).filter(function (x) { return x.name === 'conj'; })[0];
      for (var i = 0; i < 4; i++) { var ex = f.make(); if (ex) ex.answers.forEach(function (a) { assert.notOk(odd.test(a), u.id + ': ' + a); }); }
    });
  });
});
