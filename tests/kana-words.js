"use strict";

// Ticket 42 (Q45): kana units teach real N5 words spelled in kana. Their quiz is ~60% character
// questions and ~40% word questions (romaji typing, romaji → kana, meaning, word for a meaning),
// and passes only with ≥90% on characters AND ≥80% on words. Seeded Math.random so a failure reproduces.
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
    ok.forEach(function (c) { assert.ok(romajiMatches(c[1], c[0]), c[0] + ' ← ' + c[1]); });
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

  QUnit.test('quiz mix: ~60% characters / ~40% words in every kana unit and kana review (20 builds each)', function (assert) {
    var all = 0, words = 0;
    withSeed(42, function () {
      kanaUnits().concat(kanaReviews()).forEach(function (u) {
        for (var run = 0; run < 20; run++) {
          var exs = buildExercises(u), w = exs.filter(function (e) { return !isChar(e); }).length;
          all += exs.length; words += w;
          var share = w / exs.length;
          if (share < 0.3 - 1e-9 || share > 0.45) assert.ok(false, u.id + ' run ' + run + ': word share ' + share.toFixed(2));
          if (run === 0 && u.kind === 'kana') {
            var asked = {};
            exs.forEach(function (e) { asked[e.itemId] = true; });
            quizItems(u).forEach(function (it) { if (!asked[it.id]) assert.ok(false, u.id + ' never asks ' + it.id); });
          }
        }
      });
    });
    var mean = words / all;
    assert.ok(Math.abs(mean - 0.4) <= 0.05, 'mean word share ' + mean.toFixed(3));
  });

  QUnit.test('word questions: the four kana forms only, kana only, options readable, one right answer', function (assert) {
    var forms = {};
    withSeed(3, function () {
      kanaUnits().concat(kanaReviews()).forEach(function (u) {
        var learned = learnedKana(u), taught = taughtIds(u);
        for (var run = 0; run < 5; run++) buildExercises(u).filter(function (e) { return !isChar(e); }).forEach(function (e) {
          forms[e.form] = true;
          var tag = u.id + ' ' + e.form + ' ' + e.itemId;
          if (['romajiType', 'romajiPick', 'meaningMc', 'wordMc'].indexOf(e.form) < 0) assert.ok(false, tag + ': unexpected form');
          if (hasKanji(e.question || '') || (e.options || []).some(hasKanji)) assert.ok(false, tag + ': kanji shown');
          if (e.question && /[ぁ-ヺ]/.test(e.question) && !kanaReadable(e.question, learned)) assert.ok(false, tag + ': question uses unlearned kana');
          if (answerLeaks(e)) assert.ok(false, tag + ': leaks ' + answerLeaks(e));
          if (e.form === 'romajiType') assert.ok(answerIsRight(e, kanaToRomaji(e.item.word)) && !answerIsRight(e, e.item.word + 'x'), tag);
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
    assert.deepEqual(Object.keys(forms).sort(), ['meaningMc', 'romajiPick', 'romajiType', 'wordMc']);
  });

  QUnit.test('split pass mark: ≥90% on characters AND ≥80% on words', function (assert) {
    var exs = function (nc, nw) {
      var out = [];
      for (var i = 0; i < nc; i++) out.push({ itemId: 'c:' + i });
      for (var j = 0; j < nw; j++) out.push({ itemId: 'v:' + j });
      return out;
    };
    var res = function (rc, nc, rw, nw) {
      var out = [];
      for (var i = 0; i < nc; i++) out.push(i < rc);
      for (var j = 0; j < nw; j++) out.push(j < rw);
      return out;
    };
    var s = scoreQuiz('kana', exs(10, 5), res(9, 10, 4, 5));
    assert.ok(s.passed, '9/10 + 4/5 passes');
    assert.deepEqual([s.split.chars.right, s.split.chars.total, s.split.chars.need], [9, 10, 0.9]);
    assert.deepEqual([s.split.words.right, s.split.words.total, s.split.words.need], [4, 5, 0.8]);
    assert.notOk(scoreQuiz('kana', exs(10, 5), res(10, 10, 3, 5)).passed, 'words 60% fail, though 87% overall');
    assert.notOk(scoreQuiz('kana', exs(10, 5), res(8, 10, 5, 5)).passed, 'chars 80% fail, though 87% overall');
    assert.notOk(scoreQuiz('review', exs(12, 8), res(10, 12, 8, 8)).passed, 'a kana review splits too (chars 83%)');
    assert.ok(scoreQuiz('review', exs(12, 8), res(11, 12, 7, 8)).passed, 'kana review 92% / 88%');
    var lesson = scoreQuiz('lesson', exs(0, 10), res(0, 0, 8, 10));
    assert.ok(lesson.passed && lesson.split === null, 'no characters: one 80% mark, no split');
    var req = exs(10, 5).concat([{ itemId: 'v:0', requeue: true }]);
    s = scoreQuiz('kana', req, res(9, 10, 4, 5).concat([false]));
    assert.strictEqual(s.split.words.total, 5, 're-asked questions are not scored');
  });

  QUnit.test('pass mark text: kana units and kana reviews name both marks', function (assert) {
    var k = kanaUnits()[0], rev = kanaReviews()[0], lesson = units().filter(function (u) { return u.kind === 'lesson'; })[0];
    assert.strictEqual(passMarkText(k), '90% on characters, 80% on words');
    assert.strictEqual(passMarkText(rev), '90% on characters, 80% on words');
    assert.strictEqual(passMarkText(lesson), '80%');
  });

  QUnit.test('playthrough: a kana unit with words passes all right, fails on words alone', function (assert) {
    withSeed(11, function () {
      kanaUnits().forEach(function (u) {
        var exs = buildExercises(u);
        var all = exs.map(function (e) { return answerIsRight(e, rightAnswer(e)); });
        assert.ok(all.every(Boolean), u.id + ': every right answer scores right');
        var s = scoreQuiz(u.kind, exs, all);
        assert.ok(s.passed && s.split, u.id + ': all right passes, split');
        var noWords = exs.map(function (e) { return isChar(e) ? true : !answerIsRight(e, typeof rightAnswer(e) === 'number' ? (rightAnswer(e) + 1) % e.options.length : 'zzz'); });
        var s2 = scoreQuiz(u.kind, exs, noWords.map(function (x, i) { return isChar(exs[i]) ? x : false; }));
        assert.notOk(s2.passed, u.id + ': characters perfect, words all wrong → not passed');
        noWords.forEach(function (x, i) { if (!x) assert.ok(false, u.id + ' ' + exs[i].form + ': a wrong answer scored right'); });
      });
    });
  });
});
