"use strict";

// Ticket 42 (Q45): kana units teach real N5 words spelled in kana; their quiz asks them in romaji,
// spelled from romaji, their meaning and the word for a meaning. Ticket 44: the quiz reads mostly
// words (tests/kana-reading.js) and passes only with ≥85% on reading AND ≥80% on meanings.
// Seeded Math.random so a failure reproduces.
QUnit.module('kana unit words (ticket 42)', function () {
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
  var kanaUnits = function () { return units().filter(function (u) { return u.kind === 'kana'; }); };
  var kanaReviews = function () {
    return units().filter(function (u) { return u.kind === 'review' && quizItems(u).some(function (it) { return it.kind === 'kana'; }); });
  };
  var isChar = function (e) { return /^c:/.test(e.itemId); };
  // the correct response to a question (option index or typed text)
  var rightAnswer = function (e) { return e.options && typeof e.correct === 'number' ? e.correct : e.answers[0]; };

  QUnit.test('kanaToRomaji: modified Hepburn, っ doubles, ー repeats the vowel', function (assert) {
    var cases = { 'テレビ': 'terebi', 'コーヒー': 'koohii', 'ちょっと': 'chotto', 'マッチ': 'matchi', 'しょうゆ': 'shouyu',
      'パーティー': 'paatii', 'フォーク': 'fooku', 'おばあさん': 'obaasan', 'かぎ': 'kagi', 'ニュース': 'nyuusu',
      'まっすぐ': 'massugu', 'せっけん': 'sekken', 'つまらない': 'tsumaranai', 'ふろ': 'furo', 'シャワー': 'shawaa' };
    Object.keys(cases).forEach(function (w) { assert.strictEqual(kanaToRomaji(w), cases[w], w); });
  });

  QUnit.test('romajiMatches: every accepted kana spelling, macrons, case; no typo tolerance', function (assert) {
    var ok = [['ちょっと', 'chotto'], ['ちょっと', 'tyotto'], ['ちょっと', 'CHOTTO '], ['マッチ', 'macchi'], ['マッチ', 'matti'],
      ['コーヒー', 'kōhī'], ['コーヒー', 'ko-hi-'], ['しょうゆ', 'shōyu'], ['しょうゆ', 'syouyu'], ['つまらない', 'tumaranai'],
      ['ふろ', 'huro'], ['きれい', 'kirei'], ['きれい', 'kirē'], ['テレビ', 'te re bi'], ['かばん', 'kabann']];
    // traditional Hepburn m for ん before p / b / m
    ok = ok.concat([['コンピューター', 'kompyuutaa'], ['コンピューター', 'konpyuutaa'], ['さんびゃく', 'sambyaku'], ['しんぶん', 'shimbun'],
      ['しんぶん', 'shinbun'], ['あんまり', 'ammari'], ['てんぷら', 'tempura']]);
    ok.forEach(function (c) { assert.ok(romajiMatches(c[1], c[0]), c[0] + ' ← ' + c[1]); });
    [['きんようび', 'kimyoubi'], ['ほんや', 'homya'], ['かばん', 'kabam'], ['しんぶん', 'shimbum']].forEach(function (c) {
      assert.notOk(romajiMatches(c[1], c[0]), c[0] + ' ✗ ' + c[1] + ' (m only before p/b/m)');
    });
    assert.strictEqual(kanaToRomaji('しんぶん'), 'shinbun', 'displayed romaji unchanged');
    var bad = [['テレビ', 'terebe'], ['コーヒー', 'kohi'], ['コーヒー', 'koohi'], ['ちょっと', 'choto'], ['おばあさん', 'obasan'],
      ['かぎ', 'kaki'], ['テレビ', 'テレビ'], ['テレビ', ''], ['テレビ', null]];
    bad.forEach(function (c) { assert.notOk(romajiMatches(c[1], c[0]), c[0] + ' ✗ ' + c[1]); });
  });

  QUnit.test('kanaWordFakes: same script, only learned kana, never read like the word', function (assert) {
    withSeed(7, function () {
      kanaUnits().forEach(function (u) {
        var learned = learnedKana(u);
        u.vocab.forEach(function (v) {
          var fakes = kanaWordFakes(v.word, learned), r = kanaToRomaji(v.word);
          assert.ok(fakes.length >= 3, u.id + ' ' + v.word + ': ' + fakes.length + ' fakes');
          fakes.forEach(function (f) {
            if (f === v.word || kanaToRomaji(f) === r) assert.ok(false, v.word + ': fake ' + f + ' reads the same');
            if (!kanaReadable(f, learned)) assert.ok(false, v.word + ': fake ' + f + ' uses unlearned kana');
            if (/[ァ-ヺ]/.test(f) !== /[ァ-ヺ]/.test(v.word) || /[ぁ-ゖ]/.test(f) !== /[ぁ-ゖ]/.test(v.word)) assert.ok(false, v.word + ': fake ' + f + ' in another script');
          });
        });
      });
    });
  });

  QUnit.test('shipped plan: every kana unit teaches 2–5 kana words, ≥3 words with practice; ~50 in all', function (assert) {
    var total = 0, seen = {};
    kanaUnits().forEach(function (u) {
      var n = u.vocab.length;
      total += n;
      assert.ok(n >= 2 && n <= 5, u.id + ': ' + n + ' taught words');
      assert.ok(n + u.practice.length >= 3, u.id + ': ' + (n + u.practice.length) + ' words with practice');
      u.vocab.forEach(function (v) {
        if (isBound(v) || v.alt || !KANA_WORD_RE.test(v.word)) assert.ok(false, u.id + ': ' + v.id + ' is bound, an alt spelling or not kana');
        if (seen[v.id]) assert.ok(false, v.id + ' twice');
        seen[v.id] = true;
      });
    });
    assert.ok(total >= 40 && total <= 60, total + ' kana-unit words');
    // each moved word is no longer in a lesson
    units().filter(function (u) { return u.kind === 'lesson'; }).forEach(function (u) {
      u.vocab.forEach(function (v) { if (seen[v.id]) assert.ok(false, v.id + ' also taught in ' + u.id); });
    });
  });

  QUnit.test('word questions: the five kana-word forms only, kana only, options readable, one right answer', function (assert) {
    var forms = {};
    withSeed(3, function () {
      kanaUnits().concat(kanaReviews()).forEach(function (u) {
        var learned = learnedKana(u), taught = taughtIds(u);
        for (var run = 0; run < 5; run++) buildExercises(u).filter(function (e) { return !isChar(e); }).forEach(function (e) {
          forms[e.form] = true;
          var tag = u.id + ' ' + e.form + ' ' + e.item.id;
          if (['romajiType', 'romajiPick', 'kanaSpell', 'meaningMc', 'wordMc'].indexOf(e.form) < 0) assert.ok(false, tag + ': unexpected form');
          if (hasKanji(e.question || '') || (e.options || []).some(hasKanji)) assert.ok(false, tag + ': kanji shown');
          if (e.question && /[ぁ-ヺ]/.test(e.question) && !kanaReadable(e.question, learned)) assert.ok(false, tag + ': question uses unlearned kana');
          if (answerLeaks(e)) assert.ok(false, tag + ': leaks ' + answerLeaks(e));
          if (e.form === 'romajiType') assert.ok(answerIsRight(e, kanaToRomaji(e.item.word)) && !answerIsRight(e, e.item.word + 'x'), tag);
          if (e.form === 'kanaSpell') {
            var typeKana = function (s) { // as a learner types it (ō → o-), then the answer box + Check
              s = s.replace(/[āīūēō]/g, function (c) { return 'aiueo'.charAt('āīūēō'.indexOf(c)) + '-'; });
              return kanaBox(e, kanaBox(e, s).replace(/n$/, 'ん'));
            };
            if (!answerIsRight(e, typeKana(e.question)) || answerIsRight(e, typeKana(e.question + 'a'))) assert.ok(false, tag + ': typing the shown romaji must spell the word, nothing else');
            if (!kanaReadable(e.answers[0], learned)) assert.ok(false, tag + ': answer uses unlearned kana');
          }
          if (e.form === 'romajiPick' || e.form === 'wordMc') {
            e.options.forEach(function (o) { if (!kanaReadable(o, learned)) assert.ok(false, tag + ': option ' + o + ' uses unlearned kana'); });
          }
          if (e.form === 'wordMc') {
            // no other option is a taught word with the same meaning
            e.options.forEach(function (o, i) {
              if (i === e.correct) return;
              catalogOf('vocab').forEach(function (x) {
                if (x.word === o && taught[x.id] && sharesSense(glossText(x), glossText(e.item))) assert.ok(false, tag + ': option ' + o + ' also right');
              });
            });
          }
        });
      });
    });
    assert.deepEqual(Object.keys(forms).sort(), ['kanaSpell', 'meaningMc', 'romajiPick', 'romajiType', 'wordMc']);
  });

  QUnit.test('split pass mark (ticket 44): ≥85% on reading AND ≥80% on meanings', function (assert) {
    var exs = function (nr, nm) {
      var out = [];
      for (var i = 0; i < nr; i++) out.push({ itemId: 'c:' + i, part: 'read' });
      for (var j = 0; j < nm; j++) out.push({ itemId: 'v:' + j, part: 'meaning' });
      return out;
    };
    var res = function (rr, nr, rm, nm) {
      var out = [];
      for (var i = 0; i < nr; i++) out.push(i < rr);
      for (var j = 0; j < nm; j++) out.push(j < rm);
      return out;
    };
    var s = scoreQuiz('kana', exs(20, 5), res(17, 20, 4, 5));
    assert.ok(s.passed, '17/20 (85%) + 4/5 passes');
    assert.deepEqual([s.split.read.right, s.split.read.total, s.split.read.need], [17, 20, 0.85]);
    assert.deepEqual([s.split.meaning.right, s.split.meaning.total, s.split.meaning.need], [4, 5, 0.8]);
    assert.notOk(scoreQuiz('kana', exs(20, 5), res(20, 20, 3, 5)).passed, 'meanings 60% fail, though 92% overall');
    assert.notOk(scoreQuiz('kana', exs(20, 5), res(16, 20, 5, 5)).passed, 'reading 80% fails, though 84% overall');
    assert.notOk(scoreQuiz('review', exs(14, 6), res(11, 14, 6, 6)).passed, 'a kana review splits too (reading 79%)');
    assert.ok(scoreQuiz('review', exs(14, 6), res(12, 14, 5, 6)).passed, 'kana review 86% / 83%');
    assert.ok(scoreQuiz('kana', exs(10, 0), res(9, 10, 0, 0)).passed, 'no meaning questions: reading alone decides');
    var lesson = scoreQuiz('lesson', [{ itemId: 'v:1' }, { itemId: 'v:2' }, { itemId: 'v:3' }, { itemId: 'v:4' }, { itemId: 'v:5' }], [true, true, true, true, false]);
    assert.ok(lesson.passed && lesson.split === null, 'not a kana quiz: one 80% mark, no split');
    var req = exs(20, 5).concat([{ itemId: 'v:0', part: 'meaning', requeue: true }]);
    s = scoreQuiz('kana', req, res(17, 20, 4, 5).concat([false]));
    assert.strictEqual(s.split.meaning.total, 5, 're-asked questions are not scored');
    var word = scoreQuiz('kana', [{ part: 'read' }], [false]);
    assert.deepEqual(word.missed, [], 'a reading word (no card) is never flagged for the SRS');
  });

  QUnit.test('pass mark text: kana units and kana reviews name both marks', function (assert) {
    var k = kanaUnits()[0], rev = kanaReviews()[0], lesson = units().filter(function (u) { return u.kind === 'lesson'; })[0];
    assert.strictEqual(passMarkText(k), '85% on reading, 80% on meanings');
    assert.strictEqual(passMarkText(rev), '85% on reading, 80% on meanings');
    assert.strictEqual(passMarkText(lesson), '80%');
  });

  QUnit.test('playthrough: every kana stage passes all right, fails on meanings alone and on reading alone', function (assert) {
    withSeed(11, function () {
      kanaUnits().concat(kanaReviews()).forEach(function (u) {
        var exs = buildExercises(u);
        var all = exs.map(function (e) { return answerIsRight(e, rightAnswer(e)); });
        assert.ok(all.every(Boolean), u.id + ': every right answer scores right');
        var s = scoreQuiz(u.kind, exs, all);
        assert.ok(s.passed && s.split, u.id + ': all right passes, split');
        var wrong = exs.map(function (e) { return answerIsRight(e, typeof rightAnswer(e) === 'number' ? (rightAnswer(e) + 1) % e.options.length : 'zzz'); });
        wrong.forEach(function (x, i) { if (x) assert.ok(false, u.id + ' ' + exs[i].form + ': a wrong answer scored right'); });
        var meaningsWrong = exs.map(function (e) { return e.part === 'read'; });
        var readingWrong = exs.map(function (e) { return e.part === 'meaning'; });
        assert.notOk(scoreQuiz(u.kind, exs, meaningsWrong).passed, u.id + ': reading perfect, meanings all wrong → not passed');
        assert.notOk(scoreQuiz(u.kind, exs, readingWrong).passed, u.id + ': meanings perfect, reading all wrong → not passed');
      });
    });
  });
});
