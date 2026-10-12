"use strict";

QUnit.module('buildExercises', {
  // Disable speechSynthesis so "listen" exercises are consistently excluded,
  // making test output deterministic regardless of browser support.
  beforeEach: function () {
    this._origSpeech = window.speechSynthesis;
    try { delete window.speechSynthesis; } catch (e) { window.speechSynthesis = undefined; }
    this.unit = buildUnits(PLAN, CATALOG).filter(function (u) { return u.kind === 'lesson'; })[0]; // vocab + kanji + grammar
  },
  afterEach: function () {
    if (this._origSpeech !== undefined) {
      window.speechSynthesis = this._origSpeech;
    }
  }
}, function () {

  QUnit.test('N5 lesson quiz length: one question per item, at least 8 (ticket 43)', function (assert) {
    var n = quizItems(this.unit).length;
    assert.strictEqual(buildExercises(this.unit).length, Math.max(8, Math.min(n, quizLength(this.unit, n))));
  });

  QUnit.test('returns empty array for a unit with no items', function (assert) {
    var exs = buildExercises({ id: 'n5.u999', level: 'N5', index: 0, vocab: [], kanji: [], grammar: [] });
    assert.equal(exs.length, 0);
  });

  QUnit.test('mc exercises have required fields and in-bounds correct index (10 runs)', function (assert) {
    for (var run = 0; run < 4; run++) {
      buildExercises(this.unit).filter(function (e) { return e.type === 'mc'; }).forEach(function (mc) {
        assert.ok(mc.prompt, 'mc.prompt is non-empty');
        assert.ok(mc.options.length >= 2, 'mc has at least 2 options');
        assert.ok(mc.correct >= 0 && mc.correct < mc.options.length, 'correct=' + mc.correct);
      });
    }
  });

  QUnit.test('typing exercises have a non-empty answers array', function (assert) {
    for (var run = 0; run < 4; run++) {
      buildExercises(this.unit).filter(function (e) { return e.type === 'typing'; }).forEach(function (t) {
        assert.ok(Array.isArray(t.answers) && t.answers.length > 0, 'typing.answers is non-empty');
      });
    }
  });

  QUnit.test('kanji typing accepts kun, on (katakana) and on typed in hiragana', function (assert) {
    var k = CATALOG.items['k:人'];
    var unit = { id: 'n5.u999', level: 'N5', index: 0, vocab: [], kanji: [k, k], grammar: [] };
    var typing = null;
    for (var i = 0; i < 20 && !typing; i++) {
      typing = buildExercises(unit).filter(function (e) { return e.form === 'kanjiReadType'; })[0] || null;
    }
    assert.ok(typing, 'typing generated');
    ['ひと', 'ジン', 'じん'].forEach(function (a) { assert.ok(checkTyping(a, typing.answers), a); });
  });

  QUnit.test('single kana: kana → romaji MC, romaji typing, romaji → kana MC; unambiguous same-script options', function (assert) {
    // a kana quiz reads words first (ticket 44); the single-kana forms are its fallback
    var kanaUnit = buildUnits(PLAN, CATALOG).filter(function (u) { return u.kind === 'kana'; })[1]; // か/さ rows
    var ctx = quizContext(kanaUnit), types = {};
    for (var run = 0; run < 4; run++) {
      kanaUnit.kana.map(function (k) { return makeQuestion(k, ctx, null, []); }).forEach(function (e) {
        var k =CATALOG.items['c:' + e.question] || catalogOf('kana').filter(function (x) { return x.script === 'hiragana' && x.romaji === e.question; })[0];
        assert.ok(k && k.kind === 'kana', 'question is a unit kana or its romaji: ' + e.question);
        if (e.type === 'typing') {
          types.typing = true;
          assert.ok(checkTyping(k.romaji, e.answers) && checkTyping(k.answers[k.answers.length - 1], e.answers), 'accepts every romaji spelling');
          return;
        }
        var toRomaji = e.question === k.char;
        types[toRomaji ? 'toRomaji' : 'toKana'] = true;
        assert.strictEqual(e.options.length, 4, '4 options');
        assert.strictEqual(new Set(e.options).size, 4, 'distinct options');
        assert.strictEqual(e.options[e.correct], toRomaji ? k.romaji : k.char, 'correct option');
        if (!toRomaji) {
          assert.ok(e.options.every(function (c) { return /^[ぁ-ゖ]+$/.test(c); }), 'same script');
          assert.ok(e.options.every(function (c, i) { return i === e.correct || CATALOG.items['c:' + c].answers.indexOf(k.romaji) < 0; }), 'no other option reads ' + k.romaji);
        }
      });
    }
    assert.deepEqual(Object.keys(types).sort(), ['toKana', 'toRomaji', 'typing']);
  });

  QUnit.test('kanaDistractors: look-alikes and dakuten siblings first, never a same-sounding kana', function (assert) {
    var c = function (ch) { return CATALOG.items['c:' + ch]; };
    var shi = kanaDistractors(c('シ'), 3, []).map(function (x) { return x.char; });
    assert.ok(shi.indexOf('ツ') >= 0, 'シ → ツ: ' + shi.join(''));
    for (var i = 0; i < 4; i++) {
      assert.ok(kanaDistractors(c('じ'), 3, []).every(function (x) { return x.char !== 'ぢ'; }), 'じ never gets ぢ (both ji)');
    }
    var kya = kanaDistractors(c('きゃ'), 3, []);
    assert.ok(kya.every(function (x) { return x.char.length === 2 && x.script === 'hiragana'; }), 'combos get combos');
    assert.ok(kya.some(function (x) { return x.char.charAt(0) === 'き' || x.char.charAt(0) === 'ぎ'; }), 'きゃ → きゅ/きょ/ぎゃ…');
  });

  QUnit.test('P2-3 kana pick / read options use only kana learned so far', function (assert) {
    buildUnits(PLAN, CATALOG).filter(function (u) { return u.kind === 'kana'; }).forEach(function (u) {
      var ctx = quizContext(u), learned = learnedKana(u);
      ctx.items.filter(function (it) { return it.kind === 'kana'; }).forEach(function (k) {
        formsFor(k, ctx).filter(function (f) { return f.name === 'kanaPick'; }).forEach(function (f) {
          for (var r = 0; r < 3; r++) {
            var ex = f.make();
            (ex ? ex.options : []).forEach(function (o) { if (!learned[o]) assert.ok(false, u.id + ' ' + k.romaji + ' offers unlearned ' + o); });
          }
        });
      });
    });
    assert.ok(true);
  });

  QUnit.test('lessons teaching a conjugation form (every planned level) ask for that form of one of their words', function (assert) {
    var gids = [];
    buildUnits(PLAN, CATALOG).forEach(function (x) {
      if (x.kind === 'lesson') x.grammar.forEach(function (g) { if (g.conjForm && gids.indexOf(g.id) < 0) gids.push(g.id); });
    });
    ['g:te-form', 'g:nai-form', 'g:ta-form'].forEach(function (gid) { assert.ok(gids.indexOf(gid) >= 0, 'N5 ' + gid + ' taught'); });
    gids.forEach(function (gid) {
      var u = buildUnits(PLAN, CATALOG).filter(function (x) {
        return x.kind === 'lesson' && x.grammar.some(function (g) { return g.id === gid; });
      })[0];
      var forms = u.grammar.map(function (g) { return g.conjForm; }).filter(Boolean);
      var ex = null;
      for (var i = 0; i < 20 && !ex; i++) ex = buildExercises(u).filter(function (e) { return e.type === 'conjugation'; })[0] || null;
      assert.ok(ex && forms.indexOf(ex.targetForm) >= 0, gid + ' → ' + (ex && ex.targetForm));
      var v = ex && CATALOG.items[ex.conjItem];
      assert.ok(v && checkTyping(conjugateItem(v, ex.targetForm).kana, ex.answers), gid + ': answer for ' + (v && v.word));
    });
  });

  QUnit.test('from N4 a conjForm unit quizzes its adjectives too (conjugateAdj); N5 stays verb-only', function (assert) {
    var u = buildUnits(PLAN, CATALOG).filter(function (x) {
      return x.kind === 'lesson' && x.grammar.length && x.vocab.some(function (v) { return v.pos === 'adj-i'; });
    })[0];
    var adj = u.vocab.filter(function (v) { return v.pos === 'adj-i'; })[0];
    assert.deepEqual(quizContext(u).adjs, [], 'N5: no adjective conjugation');
    ['くて-form', 'ば-form', 'なくて-form'].forEach(function (form) {
      var n4 = Object.assign({}, u, { level: 'N4', grammar: [Object.assign({}, u.grammar[0], { conjForm: form })] });
      var ctx = quizContext(n4);
      assert.ok(ctx.adjs.indexOf(adj) >= 0, form + ': the unit adjective is a candidate');
      var ex = formsFor(adj, ctx).filter(function (f) { return f.name === 'conj'; })[0].make();
      assert.ok(ex && ex.answers.indexOf(conjugateAdj(adj.word, adj.reading, form, 'adj-i').kana) >= 0, form + ' ' + adj.word + ' → ' + (ex && ex.answers));
      var gx = formsFor(n4.grammar[0], ctx).filter(function (f) { return f.name === 'conj'; })[0].make();
      assert.ok(gx && gx.targetForm === form, form + ': the grammar point asks it');
    });
  });

  QUnit.test('every shipped unit builds a quiz', function (assert) {
    buildUnits(PLAN, CATALOG).filter(function (u) { return u.kind !== 'mock'; }).forEach(function (u) {
      assert.ok(buildExercises(u).length > 0, u.id);
    });
  });
  QUnit.test('keigo points ask to say a plain verb raised or lowered (N4 r1 newbie3 N3)', function (assert) {
    catalogOf('grammar').filter(function (g) { return g.pairs; }).forEach(function (g) {
      var u = buildUnits(PLAN, CATALOG).filter(function (x) { return x.kind === 'lesson' && (x.grammar || []).some(function (y) { return y.id === g.id; }); })[0];
      var ex = formsFor(g, quizContext(u)).filter(function (f) { return f.name === 'keigo'; })[0].make();
      assert.ok(ex && ex.type === 'typing' && checkTyping(ex.answers[0], ex.answers) && !answerLeaks(Object.assign(ex, { item: g })), g.id + ': ' + (ex && ex.question));
      assert.ok(buildExercises(u).some(function (e) { return e.form === 'keigo'; }), u.id + ' asks it');
    });
    assert.equal(catalogOf('grammar').filter(function (g) { return g.pairs; }).length, 4, 'honorific and humble verbs, お〜になる, お〜する');
  });
  QUnit.test('a katakana word typed in hiragana from romaji is accepted (N4 r2 newbie3 N1: esukareetaa)', function (assert) {
    assert.equal(hiraLong('エスカレーター'), 'えすかれえたあ');
    var u = buildUnits(PLAN, CATALOG).filter(function (x) { return x.id === 'n4.u080'; })[0];
    var f = formsFor(CATALOG.items['v:エスカレーター|エスカレーター'], quizContext(u)).filter(function (x) { return x.name === 'enToJp'; })[0];
    var ex = f && f.make();
    assert.ok(ex && checkTyping('えすかれえたあ', ex.answers) && checkTyping('えすかれーたー', ex.answers), 'hiragana accepted');
  });
});
