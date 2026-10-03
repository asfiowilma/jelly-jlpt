"use strict";

// Distractor engine (ticket 09): pickDistractors(target, pool, field, n, opts).
QUnit.module('pickDistractors', function () {
  var I = function (id) { return CATALOG.items[id]; };
  var RUNS = 20;
  function each(fn) { for (var i = 0; i < RUNS; i++) fn(); }

  QUnit.test('distinct options, never the answer, n honoured', function (assert) {
    var pools = { vocab: catalogOf('vocab'), kanji: catalogOf('kanji'), grammar: catalogOf('grammar') };
    [['v:食べる|たべる', 'gloss'], ['v:食べる|たべる', 'word'], ['v:先生|せんせい', 'reading'],
     ['k:日', 'kanjiReading'], ['k:三', 'kanjiMeaning'], ['g:te-mo-ii', 'pattern']].forEach(function (c) {
      var t = I(c[0]);
      each(function () {
        var d = pickDistractors(t, pools[t.kind], c[1], 3);
        assert.strictEqual(d.length, 3, c.join(' ') + ': 3 distractors');
        assert.strictEqual(new Set(d).size, 3, 'distinct: ' + d.join(' | '));
        assert.ok(d.indexOf(DISTRACTOR_RULES[c[1]].texts(t)[0]) < 0, 'answer not a distractor');
      });
    });
  });

  QUnit.test('gloss: no distractor shares a sense word with the answer (no second correct answer)', function (assert) {
    var pool = catalogOf('vocab');
    ['v:青|あお', 'v:大きい|おおきい', 'v:食べる|たべる', 'v:先生|せんせい'].forEach(function (id) {
      var t = I(id);
      each(function () {
        pickDistractors(t, pool, 'gloss', 3).forEach(function (g) {
          assert.notOk(sharesSense(g, glossText(t)), glossText(t) + ' vs ' + g);
        });
      });
    });
    assert.ok(sharesSense('blue / green (traffic light)', 'green'), 'sharesSense sees green');
    assert.notOk(sharesSense('to eat', 'to drink'), '"to" is not a sense word');
  });

  QUnit.test('gloss: same pos and same level preferred', function (assert) {
    var pool = catalogOf('vocab');
    var t = I('v:食べる|たべる');
    each(function () {
      pickDistractors(t, pool, 'gloss', 3).forEach(function (g) {
        var it = pool.filter(function (v) { return glossText(v) === g; })[0];
        assert.ok(/^verb/.test(it.pos) && it.level === 'N5', g + ' is an N5 verb (' + it.pos + ')');
      });
    });
    var adj = I('v:赤い|あかい');
    each(function () {
      pickDistractors(adj, pool, 'gloss', 3).forEach(function (g) {
        assert.ok(pool.some(function (v) { return glossText(v) === g && v.pos === 'adj-i'; }), g + ' is adj-i');
      });
    });
  });

  QUnit.test('taught items come first', function (assert) {
    var pool = catalogOf('vocab');
    var t = I('v:食べる|たべる');
    var taught = {};
    ['v:飲む|のむ', 'v:書く|かく', 'v:読む|よむ'].forEach(function (id) { taught[id] = true; });
    each(function () {
      assert.deepEqual(pickDistractors(t, pool, 'gloss', 3, { taught: taught }).sort(),
        ['v:飲む|のむ', 'v:書く|かく', 'v:読む|よむ'].map(function (id) { return glossText(I(id)); }).sort());
    });
  });

  QUnit.test('word: same script shape, no option meaning the same thing', function (assert) {
    var pool = catalogOf('vocab');
    var t = I('v:食べる|たべる');
    each(function () {
      pickDistractors(t, pool, 'word', 3).forEach(function (w) {
        assert.ok(hasKanji(w), w + ' has kanji like 食べる');
      });
    });
    var kana = pool.filter(function (v) { return !hasKanji(v.word) && /^[ぁ-ゖ]+$/.test(v.word); })[0];
    each(function () {
      pickDistractors(kana, pool, 'word', 3).forEach(function (w) {
        assert.ok(/^[ぁ-ゖ]+$/.test(w), w + ' is hiragana like ' + kana.word);
      });
    });
  });

  QUnit.test('reading: confusers are never a valid reading of the word', function (assert) {
    var pool = catalogOf('vocab');
    var withKanji = pool.filter(function (v) { return hasKanji(v.word); });
    withKanji.forEach(function (t) {
      var valid = pool.filter(function (v) { return v.word === t.word; }).map(function (v) { return v.reading; });
      pickDistractors(t, pool, 'reading', 3).forEach(function (r) {
        if (valid.indexOf(r) >= 0) assert.ok(false, t.word + ': ' + r + ' is a valid reading');
      });
    });
    assert.ok(true, withKanji.length + ' words checked');
  });

  QUnit.test('readingFakes: lengthen/shorten vowel, toggle dakuten, add/remove っ', function (assert) {
    var f = function (s) { return readingFakes(s); };
    assert.ok(f('おばさん').indexOf('おばあさん') >= 0, 'おばさん → おばあさん');
    assert.ok(f('おばあさん').indexOf('おばさん') >= 0, 'おばあさん → おばさん');
    assert.ok(f('かいしゃ').indexOf('がいしゃ') >= 0, 'か → が');
    assert.ok(f('きって').indexOf('きて') >= 0, 'きって → きて');
    assert.ok(f('きて').indexOf('きって') >= 0, 'きて → きって');
    assert.ok(f('がっこう').indexOf('がっこ') >= 0, 'がっこう → がっこ');
    assert.ok(f('きて').every(function (s) { return s !== 'きて' && !/^[っゃゅょん]/.test(s) && !/っ$/.test(s); }), 'no malformed fakes');
  });

  QUnit.test('kanjiReading: look-alike kanji used when in the pool; never a reading of the target', function (assert) {
    var pool = catalogOf('kanji');
    var ki = I('k:木'); // look-alikes in pool: 本, 休
    var lookReadings = [];
    ['k:本', 'k:休'].forEach(function (id) {
      kanjiReadings(I(id)).forEach(function (r) { lookReadings.push(kataToHira(r)); });
    });
    var hit = 0;
    each(function () {
      if (pickDistractors(ki, pool, 'kanjiReading', 3, { answer: 'き' }).some(function (r) { return lookReadings.indexOf(kataToHira(r)) >= 0; })) hit++;
    });
    assert.strictEqual(hit, RUNS, '木 always gets a reading of 本/休');
    pool.forEach(function (k) {
      var valid = kanjiValidReadings(k);
      kanjiReadings(k).forEach(function (ans) {
        var d = pickDistractors(k, pool, 'kanjiReading', 3, { answer: ans });
        d.forEach(function (r) {
          if (valid.indexOf(kataToHira(r)) >= 0) assert.ok(false, k.char + ': ' + r + ' is its own reading');
        });
        var kata = /[ァ-ヶ]/.test(ans);
        if (!d.every(function (r) { return /[ァ-ヶ]/.test(r) === kata; })) assert.ok(false, k.char + ' ' + ans + ': mixed scripts ' + d.join(' '));
      });
    });
  });

  QUnit.test('kanjiMeaning: same category (numbers with numbers, directions with directions)', function (assert) {
    var pool = catalogOf('kanji');
    var nums = '一二三四五六七八九十百千万';
    each(function () {
      pickDistractors(I('k:三'), pool, 'kanjiMeaning', 3).forEach(function (m) {
        var k = pool.filter(function (x) { return x.meaning.join(', ') === m; })[0];
        assert.ok(nums.indexOf(k.char) >= 0, m + ' is a number');
      });
      pickDistractors(I('k:東'), pool, 'kanjiMeaning', 3).forEach(function (m) {
        var k = pool.filter(function (x) { return x.meaning.join(', ') === m; })[0];
        assert.ok('東西南北上下左右中前後外'.indexOf(k.char) >= 0, m + ' is a direction');
      });
    });
  });

  QUnit.test('pattern: confusable patterns first, none meaning the same', function (assert) {
    var pool = catalogOf('grammar');
    each(function () {
      var d = pickDistractors(I('g:te-mo-ii'), pool, 'pattern', 2);
      d.forEach(function (p) {
        assert.ok(['〜てはいけません', '〜ないでください', '〜なくてはいけない/〜なくてはいけません',
          '〜なくてはならない/〜なくてはなりません', '〜なくちゃ(いけない)'].indexOf(p) >= 0, 'てもいい ↔ ' + p);
      });
      pickDistractors(I('g:kedo'), pool, 'pattern', 3).forEach(function (p) {
        assert.notStrictEqual(p, '〜けれども', 'けれども means the same as けど');
      });
    });
  });
});

QUnit.module('buildExercises distractors', {
  beforeEach: function () {
    this._origSpeech = window.speechSynthesis;
    try { delete window.speechSynthesis; } catch (e) { window.speechSynthesis = undefined; }
  },
  afterEach: function () {
    if (this._origSpeech !== undefined) window.speechSynthesis = this._origSpeech;
  }
}, function () {
  QUnit.test('every N5 lesson MC: 4 distinct options, correct index points at the answer', function (assert) {
    var lessons = buildUnits(PLAN, CATALOG).filter(function (u) { return u.kind === 'lesson' || u.kind === 'review'; });
    var n = 0, kinds = {};
    lessons.forEach(function (u) {
      for (var r = 0; r < 3; r++) {
        buildExercises(u).forEach(function (e) {
          if (!e.options || e.type === 'pair_match') return;
          n++;
          kinds[e.prompt.replace(/".*"/, '"…"')] = true;
          if (new Set(e.options).size !== e.options.length) assert.ok(false, u.id + ' duplicate options ' + e.options.join(' | '));
          if (!(e.correct >= 0 && e.correct < e.options.length)) assert.ok(false, u.id + ' bad correct');
        });
      }
    });
    assert.ok(n > 100, n + ' MC checked: ' + Object.keys(kinds).join(' / '));
  });

  QUnit.test('vocab reading MC and kanji meaning MC are generated', function (assert) {
    var u = buildUnits(PLAN, CATALOG).filter(function (x) { return x.kind === 'lesson' && x.kanji.length; })[0];
    var seen = {};
    for (var i = 0; i < 40; i++) buildExercises(u).forEach(function (e) { seen[e.prompt] = e; });
    var rd = seen['How do you read this word?'];
    assert.ok(rd, 'reading MC');
    var v = u.vocab.filter(function (x) { return x.word === rd.question; })[0];
    assert.strictEqual(rd.options[rd.correct], v.reading);
    var km = seen['What does this kanji mean?'];
    assert.ok(km, 'kanji meaning MC');
    assert.strictEqual(km.options[km.correct], CATALOG.items['k:' + km.question].meaning.join(', '));
  });
});
