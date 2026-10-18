"use strict";

// Ticket 41: typed English answers. Normalisation, plural, typo tolerance with a reject set
// (another word's meaning is never a typo), per-item accept lists.
QUnit.module('typed English answers', function () {

  QUnit.test('normalisation: case, articles, "to", punctuation, hyphens, parentheses, accents, UK/US spelling', function (assert) {
    [
      ['Overseas', ['overseas']], ['the dog', ['dog']], ['A cat', ['cat']], ['an apple', ['apple']],
      ['to eat', ['eat']], ['eat', ['to eat']], ['bread!', ['bread']], ['see', ['to see (a person)']],
      ['well lit', ['well-lit']], ['welllit', ['well-lit']], ['cafe', ['café']], ['oclock', ["o'clock"]],
      ['colour', ['color']], ['color', ['colour']], ['memorise', ['to memorize']], ['theatre', ['theater']],
      ['grey', ['gray']], ['favourite', ['favorite']], ['neighbour', ['neighbor']], ['metre', ['meter']]
    ].forEach(function (c) { assert.ok(checkTyping(c[0], c[1]), c[0] + ' ~ ' + c[1][0]); });
    [['cat', ['dog']], ['to', ['to eat']], ['', ['eat']], ['the', ['the dog']]].forEach(function (c) {
      assert.notOk(checkTyping(c[0], c[1]), c[0] + ' !~ ' + c[1][0]);
    });
  });

  QUnit.test('plurals both ways', function (assert) {
    [['dogs', 'dog'], ['dog', 'dogs'], ['boxes', 'box'], ['cities', 'city'], ['glasses', 'glass'], ['chopstick', 'chopsticks']]
      .forEach(function (c) { assert.ok(checkTyping(c[0], [c[1]]), c[0] + ' ~ ' + c[1]); });
  });

  QUnit.test('typos: 1 edit from 5 letters, 2 from 10, swaps count once; short answers exact', function (assert) {
    [['delicous', 'delicious'], ['hosue', 'house'], ['hoose', 'house'], ['librery', 'library'],
      ['refrigirater', 'refrigerator'], ['foriegn country', 'foreign country']]
      .forEach(function (c) { assert.ok(checkTyping(c[0], [c[1]]), c[0] + ' ~ ' + c[1]); });
    [['dgo', 'dog'], ['bok', 'book'], ['hse', 'house'], ['dellisiusly', 'deliciously'], ['refrijirater', 'refrigerator']]
      .forEach(function (c) { assert.notOk(checkTyping(c[0], [c[1]]), c[0] + ' !~ ' + c[1]); });
  });

  QUnit.test('reject set: a typo or plural that is another meaning is wrong; own answers never blocked', function (assert) {
    assert.ok(checkTyping('socket', ['pocket']), 'without a reject set: a typo');
    assert.notOk(checkTyping('socket', ['pocket'], ['socket']), 'socket is another word');
    assert.ok(checkTyping('news', ['new']), 'plural of new');
    assert.notOk(checkTyping('news', ['new'], ['news', 'old']), 'news is ニュース');
    assert.ok(checkTyping('fruits', ['fruit'], ['fruit', 'vegetable']), 'own plural stays right');
    assert.ok(checkTyping('pocket', ['pocket'], ['pocket']), 'exact always right');
  });
  QUnit.test('a noun\'s own meaning as a plural is right even when another word means the plural (N4 r1 vocab T5)', function (assert) {
    var pool = englishPool();
    [['v:計画|けいかく', 'plans'], ['v:看護師|かんごし', 'nurses'], ['v:準備|じゅんび', 'preparations'], ['v:場合|ばあい', 'cases'],
     ['v:気持ち|きもち', 'feelings'], ['v:日|ひ', 'days'], ['v:利用|りよう', 'uses']].forEach(function (c) {
      var v = CATALOG.items[c[0]], ex = { answers: meaningAnswers(v.gloss).concat(v.accept || []), item: v, form: 'meaningType' };
      assert.ok(answerIsRight(ex, c[1]), c[0] + ' takes ' + c[1]);
    });
    var adj = CATALOG.items['v:新しい|あたらしい'];
    assert.notOk(answerIsRight({ answers: meaningAnswers(adj.gloss).concat(adj.accept || []), item: adj, form: 'meaningType' }, 'news'), 'not an adjective: news ≠ new');
    assert.notOk(checkTyping('news', ['new'], pool), 'no noun flag: reject set as before');
  });

  QUnit.test('be / get / become / grow are one prefix on the same core; typos and voice stay strict', function (assert) {
    var ok = function (id, typed) { var v = CATALOG.items[id]; return checkTyping(typed, meaningAnswers(v.gloss).concat(v.accept || []), englishPool()); };
    ['to be accustomed', 'to get accustomed', 'to be accustomed to', 'be used to', 'to grow accustomed', 'to become familiar'].forEach(function (t) {
      assert.ok(ok('v:慣れる|なれる', t), 'なれる: ' + t);
    });
    ['mostly', 'to be', 'to get', 'to be accustom', 'accustomed'].forEach(function (t) { assert.notOk(ok('v:慣れる|なれる', t), 'なれる: ' + t + ' stays wrong'); });
    assert.notOk(ok('v:大分|だいぶ', 'mostly'), 'だいぶ: mostly is a stretch');
    assert.ok(ok('v:大分|だいぶ', 'a lot'), 'だいぶ: a lot');
    assert.ok(checkTyping('to become surprised', ['to be surprised']), 'prefix swap on a shared core');
    assert.notOk(checkTyping('to surprise', ['to be surprised']), 'active is not passive');
    var oex = { type: 'typing', form: 'meaningType', item: CATALOG.items['v:驚く|おどろく'], answers: meaningAnswers(CATALOG.items['v:驚く|おどろく'].gloss).concat(CATALOG.items['v:驚く|おどろく'].accept || []) };
    assert.ok(/voice/.test(retryNotice(oex, 'to surprise')), 'おどろく: to surprise is still a retry note');
    assert.ok(answerIsRight(oex, 'to get surprised'), 'おどろく: get surprised');
  });
  QUnit.test('a bracket that lists examples: each example is an answer (着る put on a shirt)', function (assert) {
    var ok = function (id, typed) { var v = CATALOG.items[id]; return checkTyping(typed, meaningAnswers(v.gloss).concat(v.accept || []), englishPool()); };
    ['to put on a shirt', 'put on a coat', 'put on'].forEach(function (t) { assert.ok(ok('v:着る|きる', t), '着る: ' + t); });
    ['to play the piano', 'play guitar'].forEach(function (t) { assert.ok(ok('v:弾く|ひく', t), '弾く: ' + t); });
    ['to cross a road', 'cross a bridge'].forEach(function (t) { assert.ok(ok('v:渡る|わたる', t), '渡る: ' + t); });
    assert.ok(ok('v:受ける|うける', 'to take an exam'), '受ける: take an exam');
    assert.notOk(ok('v:着る|きる', 'put on a hat'), '着る: an unlisted object');
    assert.notOk(ok('v:着る|きる', 'coat'), '着る: the bare example');
  });
  QUnit.test('audit additions: found by two sources, accepted (N5/N4 high-miss items)', function (assert) {
    [['v:勤める|つとめる', 'to work at'], ['v:勤める|つとめる', 'to be employed'], ['v:かける|かける', 'to make a call'],
      ['v:少し|すこし', 'a little bit'], ['v:ちょっと|ちょっと', 'a little bit'], ['v:受ける|うける', 'to take a test'], 
      ['v:大体|だいたい', 'for the most part']].forEach(function (c) {
      var v = CATALOG.items[c[0]];
      assert.ok(checkTyping(c[1], meaningAnswers(v.gloss).concat(v.accept || []), englishPool()), c[0] + ' takes ' + c[1]);
    });
  });

  QUnit.test('kana answers stay exact (script matters), romaji items unaffected', function (assert) {
    assert.ok(checkTyping('にほんじん', ['にほんじん']));
    assert.notOk(checkTyping('ニホンジン', ['にほんじん']), 'katakana ≠ hiragana');
    assert.notOk(checkTyping('にほんじ', ['にほんじん']), 'no kana typo tolerance');
    assert.notOk(answerIsRight({ type: 'typing', answers: ['ka'] }, 'kas'), 'romaji: no plural rule');
  });

  QUnit.test('catalog: typed meaning accepts the accept list, rejects every near-miss that is another meaning', function (assert) {
    var ex = function (v) { return { type: 'typing', answers: meaningAnswers(v.gloss).concat(v.accept || []), item: v }; };
    var gaikoku = CATALOG.items['v:外国|がいこく'];
    assert.ok(answerIsRight(ex(gaikoku), 'overseas'), '外国: overseas (owner report)');
    assert.ok(answerIsRight(ex(gaikoku), 'Foreign countries'), '外国: plural + case');
    // every pair of meanings one typo apart (both ≥ 5 letters): typing the other one is wrong
    var vocab = catalogOf('vocab').filter(function (v) { return !v.alt; });
    var forms = vocab.map(function (v) { return { v: v, a: acceptedAnswers(ex(v)).map(normEn) }; });
    var pairs = 0, wrong = [];
    forms.forEach(function (x) {
      forms.forEach(function (y) {
        if (x === y) return;
        x.a.forEach(function (a) {
          y.a.forEach(function (b) {
            if (a === b || typoTolerance(a) === 0 || osaDistance(a, b) > typoTolerance(a)) return;
            if (x.a.some(function (o) { return o.replace(/ /g, '') === b.replace(/ /g, ''); })) return; // its own answer too
            pairs++;
            if (answerIsRight(ex(x.v), b)) wrong.push(x.v.id + ' accepts ' + b);
          });
        });
      });
    });
    assert.ok(pairs > 0, pairs + ' near-miss pairs in the catalog');
    assert.deepEqual(wrong, [], 'another meaning accepted as a typo');
  });

  QUnit.test('accept lists: short, English-only, not repeating the gloss', function (assert) {
    var n = 0, items = 0;
    catalogOf('vocab').concat(catalogOf('kanji')).forEach(function (it) {
      if (!it.accept) return;
      items++;
      var own = meaningAnswers(it.gloss || it.meaning).map(normEn);
      assert.ok(Array.isArray(it.accept) && it.accept.length >= 1 && it.accept.length <= 5, it.id + ': 1-5 entries');
      it.accept.forEach(function (a) {
        n++;
        if (JA_CHARS.test(a) || !normEn(a)) assert.ok(false, it.id + ': "' + a + '" is not English');
        if (own.indexOf(normEn(a)) >= 0) assert.ok(false, it.id + ': "' + a + '" repeats the gloss');
      });
    });
    assert.ok(items > 300 && n > 600, items + ' items, ' + n + ' accept entries');
  });

  QUnit.test('acceptedAnswers: one per meaning, in order', function (assert) {
    assert.deepEqual(acceptedAnswers({ answers: meaningAnswers(['to meet', 'to see (a person)']).concat(['to encounter']) }),
      ['to meet', 'to see', 'to encounter']); // the bracketed note is dropped for display only
    assert.deepEqual(acceptedAnswers({ answers: ['にほんじん', 'にっぽんじん'] }), ['にほんじん', 'にっぽんじん']);
  });

  QUnit.test('P1-12 no accept entry is a gloss of another taught word of the same kind', function (assert) {
    // same pos family only: 降る "to rain" vs 雨 "rain" names the action, not the noun. Every gloss, not only
    // the first: N5 r1 T5 found 40 entries (洗う "to clean" = 掃除's second gloss) the primary-only check missed.
    // SHARED: a textbook answer two words really share; nearSynonyms keeps the pair apart in every quiz.
    var SHARED = { 'v:元気|げんき': ['fine'], 'v:大丈夫|だいじょうぶ': ['fine'] };
    var taught = {};
    allUnits().forEach(function (u) { Object.assign(taught, taughtIds(u)); });
    var vs = catalogOf('vocab').filter(function (v) { return taught[v.id] && !v.alt; }), meant = {};
    // enForms: a gloss read with its bracket dropped and kept, as typed: それ "that (one)" means "that one" (N5 r2 vocab T1)
    vs.forEach(function (v) { v.gloss.forEach(function (g) { enForms(g).forEach(function (k) { (meant[k] = meant[k] || []).push(v); }); }); });
    vs.forEach(function (v) {
      (v.accept || []).forEach(function (a) {
        [].concat.apply([], enForms(a).map(function (k) { return meant[k] || []; })).forEach(function (x) {
          if (x === v || x.word === v.word) return;
          if (!nearSynonyms(v, x)) assert.ok(false, v.id + ' accepts "' + a + '" but is an option against ' + x.id);
          var same = x.gloss.some(function (g) { return normEn(g) === normEn(a); }); // the strict shared-meaning list keeps its first key
          if (same && posFamily(x.pos) === posFamily(v.pos) && (SHARED[v.id] || []).indexOf(a) < 0) assert.ok(false, v.id + ' accepts "' + a + '", the meaning of ' + x.id);
        });
      });
    });
    ['v:元気|げんき', 'v:大丈夫|だいじょうぶ'].forEach(function (id) {
      var v = CATALOG.items[id], x = CATALOG.items['v:結構|けっこう'];
      assert.notOk(pickDistractors(x, catalogOf('vocab'), 'word', 40).some(function (w) { return w === v.word; }), id + ' is never a wrong option for 結構 "fine"');
    });
    ['v:兄|あに', 'v:弟|おとうと', 'v:姉|あね', 'v:妹|いもうと'].forEach(function (id) {
      var acc = (CATALOG.items[id].accept || []).map(normEn);
      assert.ok(acc.indexOf('brother') < 0 && acc.indexOf('sister') < 0, id + ': bare brother / sister never tests older vs younger');
    });
  });
  QUnit.test('natural answers built from a gloss in brackets pass; the bracketed word alone does not (N5 r1 newbie N2)', function (assert) {
    var ok = function (id, typed) { var v = CATALOG.items[id]; return checkTyping(typed, meaningAnswers(v.gloss).concat(v.accept || []), englishPool()); };
    ['ask a favour', 'ask a favor', 'ask favour', 'order food', 'ask'].forEach(function (t) { assert.ok(ok('v:頼む|たのむ', t), 'たのむ: ' + t); });
    ['take time', 'cost money', 'take'].forEach(function (t) { assert.ok(ok('v:かかる|かかる', t), 'かかる: ' + t); });
    assert.ok(ok('v:そう|そう', "that's right"), "そう: that's right");
    assert.notOk(ok('v:かかる|かかる', 'time'), 'かかる: time alone');
    assert.notOk(ok('v:頼む|たのむ', 'food'), 'たのむ: food alone');
    assert.strictEqual(normEn('the cost of a meal'), 'cost of meal', 'articles go anywhere');
    var u = buildUnits(PLAN, CATALOG).filter(function (x) { return (x.vocab || []).some(function (v) { return v.id === 'v:人|ひと'; }); })[0];
    var ex = formsFor(CATALOG.items['v:人|ひと'], quizContext(u)).filter(function (f) { return f.name === 'meaningType'; })[0].make();
    assert.ok(otherMeaning(ex, 'person from'), '人: the じん meaning is a retry, not a miss');
  });
  QUnit.test('a comma inside brackets does not split the answer (N5 r3 vocab T2)', function (assert) {
    var ok = function (id, typed) { var v = CATALOG.items[id]; return checkTyping(typed, meaningAnswers(v.gloss).concat(v.accept || []), englishPool()); };
    ['guitar', 'fire'].forEach(function (t) { assert.notOk(ok(t === 'guitar' ? 'v:弾く|ひく' : 'v:消える|きえる', t), t + ' alone'); });
    assert.notOk(ok('v:着る|きる', 'coat'), 'きる: coat alone');
  });

  QUnit.test('near miss: a less specific or other-voice meaning is a retry note, a clearly wrong one is not', function (assert) {
    var kanji = catalogOf('kanji').filter(function (k) { return k.char === '田'; })[0], v = function (id) { return CATALOG.items[id]; };
    var kex = { type: 'typing', form: 'kanjiMeanType', item: kanji, answers: meaningAnswers(kanji.meaning).concat(kanji.accept || []) };
    var vex = function (id) { var x = v(id); return { type: 'typing', form: 'meaningType', item: x, answers: meaningAnswers(x.gloss).concat(x.accept || []) }; };
    assert.notOk(answerIsRight(kex, 'field'), '田 field is not right');
    assert.ok(/more specific/.test(nearMiss(kex, 'field')), '田 field: be more specific');
    assert.strictEqual(nearMiss(kex, 'rice field'), null, 'a right answer is no near miss');
    assert.ok(/more specific/.test(nearMiss(vex('v:小鳥|ことり'), 'bird')), '小鳥 bird');
    assert.ok(/voice/.test(nearMiss(vex('v:驚く|おどろく'), 'to surprise')), 'おどろく: to surprise is the other voice');
    assert.strictEqual(nearMiss(vex('v:驚く|おどろく'), 'to be surprised'), null);
    // distinct meanings, wrong words and stop words stay plain misses (no retry), and none of them became right
    [[kex, 'house'], [kex, 'water'], [kex, 'the'], [vex('v:小鳥|ことり'), 'chick'], [vex('v:市民|しみん'), 'commoner'],
      [vex('v:建てる|たてる'), 'to raise'], [vex('v:髪|かみ'), 'paper'], [vex('v:驚く|おどろく'), 'to eat'], [vex('v:紙|かみ'), 'hair']].forEach(function (c) {
      assert.strictEqual(nearMiss(c[0], c[1]), null, c[1] + ' is no near miss');
      assert.notOk(answerIsRight(c[0], c[1]), c[1] + ' stays wrong');
    });
    // every own answer, and Japanese or kana-form questions, never get a note
    catalogOf('vocab').slice(0, 400).forEach(function (x) {
      var e = vex(x.id);
      e.answers.forEach(function (a) { if (nearMiss(e, a)) assert.ok(false, x.id + ' own answer ' + a + ' got a note'); });
    });
    assert.strictEqual(nearMiss({ type: 'typing', form: 'kanaType', answers: ['ka'] }, 'k'), null, 'kana items');
    assert.strictEqual(nearMiss({ type: 'typing', form: 'readingType', answers: ['ひと'] }, 'ひ'), null, 'kana answers');
  });
  QUnit.test('retryNotice: other reading, twin meaning and near miss all retry; a plain miss does not', function (assert) {
    var ctx = quizContext(allUnits().filter(function (u) { return u.kind === 'lesson'; })[30]), n = 0;
    ['v:内|うち', 'v:うち|うち'].forEach(function (id) {
      var ex = formsFor(CATALOG.items[id], ctx).filter(function (f) { return f.name === 'meaningType'; })[0].make();
      if (!ex) return;
      n++;
      ex.item = CATALOG.items[id];
      assert.strictEqual(retryNotice(ex, 'zzzz'), null, 'plain miss');
    });
    assert.ok(n > 0);
    var twin = { type: 'typing', form: 'meaningType', answers: ['within'], twinMeanings: [{ word: 'うち', answers: ['house'] }] };
    assert.ok(/another word/.test(retryNotice(twin, 'house')), 'twin meaning retries');
    var homo = { type: 'typing', answers: ['ひと'], others: [{ word: '人', reading: 'じん', gloss: 'person from' }], kana: true };
    assert.ok(/じん/.test(retryNotice(homo, 'じん')), 'other reading retries');
    assert.strictEqual(retryNotice(homo, 'ひと'), null, 'right answer');
  });
  QUnit.test('retries are capped at 3 per question; the 4th is a plain miss', function (assert) {
    var homo = { type: 'typing', answers: ['ひと'], others: [{ word: '人', reading: 'じん', gloss: 'person from' }], kana: true };
    for (var i = 0; i < 3; i++) assert.ok(retryNotice(homo, 'じん', i), 'retry ' + (i + 1));
    assert.strictEqual(retryNotice(homo, 'じん', 3), null, '4th try is graded');
    assert.strictEqual(answerIsRight(homo, 'じん'), false);
  });
  QUnit.test('missed list shows a gloss without its trailing bracket, grading unchanged', function (assert) {
    var ex = { type: 'typing', form: 'meaningType', answers: ['doctor (title)', 'physician'] };
    assert.deepEqual(acceptedAnswers(ex), ['doctor', 'physician']);
    assert.ok(answerIsRight(ex, 'doctor (title)'), 'still accepted as written');
  });
  QUnit.test('kanji meaning prompt says any one meaning will do', function (assert) {
    var kj = CATALOG.items[Object.keys(CATALOG.items).filter(function (k) { return CATALOG.items[k].kind === 'kanji'; })[0]];
    var ex = formsFor(kj, quizContext(allUnits().filter(function (u) { return u.kind === 'lesson'; })[30])).filter(function (f) { return f.name === 'kanjiMeanType'; })[0].make();
    assert.strictEqual(ex.prompt, 'What does this kanji mean? (any one meaning, in English)');
  });
});
