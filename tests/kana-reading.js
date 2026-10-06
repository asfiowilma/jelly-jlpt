"use strict";

// Ticket 44: kana stages test reading mostly through words written only with the kana taught up
// to the stage (plan order), even words not taught as vocab: kana → romaji typed, romaji → kana
// typed or picked. Never the meaning of an untaught word. Single-kana questions only for a new
// kana no word holds. Seeded Math.random so a failure reproduces.
QUnit.module('kana reading through words (ticket 44)', function () {
  function withSeed(seed, fn) {
    var rnd = Math.random;
    Math.random = function () { // mulberry32
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    try { return fn(); } finally { Math.random = rnd; }
  }
  var units = function () { return buildUnits(PLAN, CATALOG); };
  var kanaStages = function () {
    return units().filter(function (u) { return u.kind === 'kana' || u.kind === 'review' && quizItems(u).some(function (it) { return it.kind === 'kana'; }); });
  };
  var scriptOf = function (u) { var ks = quizItems(u).filter(function (it) { return it.kind === 'kana'; }); return ks[ks.length - 1].script; };

  QUnit.test('kanaReadWords: verified free N5 words, only learned kana, the stage script, ≥2 syllables', function (assert) {
    kanaStages().forEach(function (u) {
      var learned = learnedKana(u), kata = scriptOf(u) === 'katakana', seen = {};
      var own = quizItems(u).filter(function (it) { return it.kind === 'vocab'; }).map(function (v) { return v.word; });
      kanaReadWords(u).forEach(function (w) {
        var tag = u.id + ' ' + w.word;
        var src = w.level === 'N5' ? catalogOf('vocab').filter(function (v) { return (kata ? v.word : v.reading) === w.word && v.verified && !isBound(v) && v.pos !== 'particle'; })
          : (KANA_READ_EXTRA[w.level] || []).filter(function (s) { return s === w.word; });
        if (!src.length) assert.ok(false, tag + ': not a verified free N5 word nor in KANA_READ_EXTRA.' + w.level);
        if (!hasNewKana(u, w.word)) assert.ok(false, tag + ': holds none of the stage\'s new kana');
        if (!kanaReadable(w.word, learned)) assert.ok(false, tag + ': unlearned kana');
        if (!(kata ? /^[ァ-ヺー]+$/ : /^[ぁ-ゖ]+$/).test(w.word)) assert.ok(false, tag + ': not in the stage script');
        if (kanaSyllables(w.word).length < 2) assert.ok(false, tag + ': one syllable');
        if (own.indexOf(w.word) >= 0) assert.ok(false, tag + ': already a quiz item');
        if (seen[w.word]) assert.ok(false, tag + ': twice');
        if (w.kind !== 'kanaword' || w.id !== 'w:' + w.word) assert.ok(false, tag + ': shape');
        seen[w.word] = true;
      });
    });
    var u3 = units().filter(function (u) { return u.id === 'n5.u003'; })[0];
    var words = kanaReadWords(u3).map(function (w) { return w.word; });
    assert.ok(words.indexOf('さかな') >= 0, 'a kanji word is read through its hiragana reading (魚 → さかな)');
    assert.ok(words.indexOf('では') < 0, 'では (read dewa) never');
    var kataStage = units().filter(function (u) { return u.kind === 'kana' && scriptOf(u) === 'katakana'; })[3];
    assert.ok(kanaReadWords(kataStage).every(function (w) { return /^[ァ-ヺー]+$/.test(w.word); }), 'katakana stage: katakana words only, never a transliterated one');
  });

  QUnit.test('every new kana (and mark) of a stage is read in a word when any word holds it; else alone', function (assert) {
    withSeed(5, function () {
      units().filter(function (u) { return u.kind === 'kana'; }).forEach(function (u) {
        var words = kanaReadWords(u).concat(quizItems(u).filter(function (it) { return it.kind === 'vocab'; }));
        var holds = function (c) { return words.some(function (w) { return kanaSyllables(w.word).indexOf(c) >= 0; }); };
        for (var run = 0; run < 5; run++) {
          var exs = buildExercises(u), inWord = {}, alone = {};
          exs.forEach(function (e) {
            if (e.part !== 'read') return;
            if (e.item.kind === 'kana') alone[e.item.char] = true;
            else kanaSyllables(e.item.word).forEach(function (c) { inWord[c] = true; });
          });
          u.kana.map(function (k) { return k.char; }).concat(u.marks || []).forEach(function (c) {
            if (holds(c) && !inWord[c]) assert.ok(false, u.id + ' run ' + run + ': ' + c + ' never read in a word');
            if (!holds(c) && !alone[c] && u.kana.some(function (k) { return k.char === c; })) assert.ok(false, u.id + ': ' + c + ' (no word holds it) never asked');
          });
          Object.keys(alone).forEach(function (c) { if (holds(c)) assert.ok(false, u.id + ': ' + c + ' asked alone though a word holds it'); });
        }
      });
    });
  });

  QUnit.test('single-kana questions: ≤20% per stage where words allow, ≤20% overall, none in reviews', function (assert) {
    // u009 (ひゃ, びゃ, ぴゃ, みゃ…), u016 / u017 (katakana yōon): hardly a word holds them, even at N3
    var SPARSE = ['n5.u009', 'n5.u016', 'n5.u017'], tot = { w: 0, s: 0 };
    var share = function (x) { return x.s / (x.s + x.w); };
    withSeed(9, function () {
      kanaStages().forEach(function (u) {
        var one = { w: 0, s: 0 };
        for (var run = 0; run < 5; run++) buildExercises(u).forEach(function (e) {
          if (e.part !== 'read') return;
          var single = e.item.kind === 'kana';
          if (single && u.kind === 'review') assert.ok(false, u.id + ': single kana in a review');
          tot[single ? 's' : 'w']++;
          one[single ? 's' : 'w']++;
        });
        if (SPARSE.indexOf(u.id) < 0 && share(one) > 0.2 + 1e-9) assert.ok(false, u.id + ': single share ' + share(one).toFixed(3));
      });
    });
    assert.ok(share(tot) <= 0.2, 'all kana stages: single share ' + share(tot).toFixed(3));
  });

  QUnit.test('never the meaning of a word not taught up to the stage; reading words get reading forms only', function (assert) {
    withSeed(13, function () {
      kanaStages().forEach(function (u) {
        var taught = taughtIds(u);
        for (var run = 0; run < 5; run++) buildExercises(u).forEach(function (e) {
          if (e.item.kind === 'kanaword' && e.part !== 'read') assert.ok(false, u.id + ' ' + e.item.word + ': ' + e.form + ' on a reading-only word');
          if (e.item.kind === 'kanaword' && e.itemId) assert.ok(false, u.id + ': a reading word carries an itemId (no SRS card)');
          if (e.part === 'meaning' && !(e.item.kind === 'vocab' && taught[e.item.id])) assert.ok(false, u.id + ' ' + e.item.id + ': meaning asked of an untaught item');
          if (!e.part) assert.ok(false, u.id + ' ' + e.form + ': no part');
        });
      });
    });
    assert.ok(true);
  });

  QUnit.test('romaji shown for a word: Hepburn, n\' before a vowel or y; kanaSpellable only one-spelling romaji', function (assert) {
    assert.strictEqual(kanaToRomaji('きんようび'), "kin'youbi");
    assert.strictEqual(kanaToRomaji('ほんや'), "hon'ya");
    assert.strictEqual(kanaToRomaji('かばん'), 'kaban');
    assert.strictEqual(kanaToRomaji('おんな'), 'onna');
    assert.ok(romajiMatches("kin'youbi", 'きんようび') && romajiMatches('kinyoubi', 'きんようび'), 'romaji typing still takes either');
    assert.strictEqual(romajiToKana("kin'youbi"), 'きんようび', 'typing the shown romaji spells the word');
    assert.strictEqual(romajiToKana('ookii'), 'おおきい', 'long o written おお stays おお');
    assert.strictEqual(romajiToKana('otousann'), 'おとうさん', 'long o written おう stays おう');
    ['つづく', 'はなぢ', 'パーティー', 'フォーク', 'をかし'].forEach(function (w) { assert.notOk(kanaSpellable(w), w + ': romaji names another spelling too'); });
    ['さかな', 'きって', 'テスト', 'シャツ', 'ベッド', 'コーヒー'].forEach(function (w) { assert.ok(kanaSpellable(w), w); });
    assert.strictEqual(kanaBox({ kata: true }, 'shatsu'), 'シャツ', 'katakana box');
    assert.strictEqual(kanaBox({ kata: true }, 'beddo'), 'ベッド');
    assert.strictEqual(kanaBox({}, 'sakana'), 'さかな');
  });

  QUnit.test('Q47-2: - types ー; ー words are shown with a macron and can be spelled from romaji', function (assert) {
    assert.strictEqual(kanaBox({ kata: true }, 'ko-hi-'), 'コーヒー', 'like an IME');
    assert.strictEqual(kanaToRomaji('コーヒー', true), 'kōhī');
    assert.strictEqual(kanaToRomaji('セーター', true), 'sētā');
    assert.strictEqual(kanaToRomaji('コーヒー'), 'koohii', 'typed romaji answers keep the doubled vowel');
    assert.strictEqual(kanaToRomaji('おおきい', true), 'ookii', 'hiragana long vowels stay spelled out');
    var u = units().filter(function (x) { return x.id === 'n5.u012'; })[0];
    var ctx = quizContext(u), w = { kind: 'kanaword', id: 'w:コーヒー', word: 'コーヒー', level: 'N5' }, ex = null;
    for (var i = 0; i < 30 && !ex; i++) { var e = makeQuestion(w, ctx, true, [], true, 'read'); if (e && e.form === 'kanaSpell') ex = e; }
    assert.ok(ex, 'kanaSpell made for a ー word');
    assert.strictEqual(ex.question, 'kōhī');
    assert.ok(ex.kata && /Type - for ー/.test(ex.hint), 'katakana box, hint for ー');
    assert.ok(answerIsRight(ex, kanaBox(ex, 'ko-hi-')), 'ko-hi- is right');
    assert.notOk(answerIsRight(ex, kanaBox(ex, 'koohii')), 'コオヒイ is not how it is written');
    assert.notOk(answerLeaks(ex), 'no leak');
  });

  QUnit.test('Q47 rule: on a kana stage every word read holds a new kana or mark; reviews draw from all words', function (assert) {
    withSeed(17, function () {
      kanaStages().forEach(function (u) {
        for (var run = 0; run < 5; run++) buildExercises(u).forEach(function (e) {
          if (e.part === 'read' && e.item.word && !hasNewKana(u, e.item.word)) assert.ok(false, u.id + ': ' + e.item.word + ' uses only earlier kana');
        });
      });
    });
    var rev = kanaStages().filter(function (u) { return u.kind === 'review'; })[0];
    assert.ok(kanaReadWords(rev).some(function (w) { return /^[あいうえお]+$/.test(w.word); }), 'a review reads words of the first stage too');
  });

  QUnit.test('Q47-1: beyond-N5 words only fill in; N5 words first', function (assert) {
    ['N4', 'N3'].forEach(function (lv) {
      assert.ok(KANA_READ_EXTRA[lv].length > 20, lv + ': ' + KANA_READ_EXTRA[lv].length + ' extra words');
      KANA_READ_EXTRA[lv].forEach(function (s) { if (!/^([ァ-ヺー]+|[ぁ-ゖ]+)$/.test(s)) assert.ok(false, lv + ' ' + s + ': not one kana script'); });
    });
    kanaStages().forEach(function (u) {
      var lv = kanaReadWords(u).map(function (w) { return levelRank(w.level); });
      if (lv.some(function (x, i) { return i && x < lv[i - 1]; })) assert.ok(false, u.id + ': pool not ordered N5, N4, N3');
    });
    var u2 = units().filter(function (x) { return x.id === 'n5.u002'; })[0];
    withSeed(2, function () {
      for (var run = 0; run < 5; run++) buildExercises(u2).forEach(function (e) {
        if (e.item.kind === 'kanaword' && e.item.level !== 'N5') assert.ok(false, 'u002 has plenty of N5 words, yet read ' + e.item.word + ' (' + e.item.level + ')');
      });
    });
    var u9 = units().filter(function (x) { return x.id === 'n5.u009'; })[0];
    assert.ok(kanaReadWords(u9).some(function (w) { return w.level !== 'N5'; }), 'u009 (にゃ–りょ) gets beyond-N5 words');
  });

  QUnit.test('kanaSpell: romaji → typed kana, accepts only the word\'s own kana', function (assert) {
    var u = units().filter(function (x) { return x.id === 'n5.u006'; })[0];
    var ctx = quizContext(u), ex = null;
    var w = ctx.readWords.filter(function (x) { return x.word === 'おおぜい'; })[0];
    assert.ok(w, 'おおぜい readable at u006 (holds ぜ)');
    for (var i = 0; i < 30 && !ex; i++) { var e = makeQuestion(w, ctx, true, [], true, 'read'); if (e && e.form === 'kanaSpell') ex = e; }
    assert.ok(ex, 'kanaSpell made');
    assert.strictEqual(ex.question, 'oozei');
    assert.ok(ex.kana && /IME/.test(ex.hint), 'kana answer box with the IME hint');
    assert.ok(answerIsRight(ex, 'おおぜい'));
    assert.notOk(answerIsRight(ex, 'おうぜい'), 'おう is not how this word is written');
    assert.notOk(answerIsRight(ex, 'オオゼイ'), 'wrong script');
    assert.notOk(answerLeaks(ex), 'no leak');
  });
  QUnit.test('kanaHear: every kana stage hears 2-3 words; 4 distinct options, one right spelling, learned kana only', function (assert) {
    var orig = window.speechSynthesis;
    window.speechSynthesis = {};
    try {
      withSeed(11, function () {
        kanaStages().forEach(function (u) {
          var learned = learnedKana(u), hear = 0, runs = 6;
          for (var run = 0; run < runs; run++) {
            var exs = buildExercises(u), n = 0;
            exs.forEach(function (e) {
              if (e.form !== 'kanaHear') return;
              n++;
              var tag = u.id + ' ' + e.audio;
              assert.strictEqual(e.type, 'listen', tag + ': listen type');
              assert.strictEqual(e.part, 'read', tag + ': reading part');
              assert.strictEqual(e.options.length, 4, tag + ': 4 options');
              assert.strictEqual(new Set(e.options).size, 4, tag + ': distinct');
              assert.strictEqual(e.options[e.correct], e.audio, tag + ': the spoken word is the answer');
              var keys = e.options.map(soundKey);
              assert.strictEqual(new Set(keys).size, 4, tag + ': no homophone option');
              assert.ok(e.options.every(function (o) { return kanaReadable(o, learned); }), tag + ': learned kana only');
              assert.notOk(answerLeaks(e), tag + ': no leak');
              assert.strictEqual(e.question, '', tag + ': no text shown');
            });
            assert.ok(n <= KANA_HEAR_COUNT, u.id + ': at most ' + KANA_HEAR_COUNT);
            hear += n;
          }
          assert.ok(hear >= runs, u.id + ': hearing questions appear (' + hear + ' in ' + runs + ' quizzes)');
        });
      });
      window.speechSynthesis = undefined;
      kanaStages().forEach(function (u) {
        assert.ok(buildExercises(u).every(function (e) { return e.form !== 'kanaHear'; }), u.id + ': none without speech synthesis');
      });
    } finally { window.speechSynthesis = orig; }
    assert.strictEqual(soundKey('こうこう'), soundKey('こおこお'), 'おう = おお'); assert.strictEqual(soundKey('はなぢ'), soundKey('はなじ'), 'ぢ = じ');
  });
});
