"use strict";

// Ticket 43: fewer repeats within and across quizzes. Each item at most twice per quiz (re-asks
// of misses don't count), never within 3 questions of itself; few items → a shorter quiz (min 8);
// a widened distractor pool early on; a device-local memory of recent questions (localStorage
// jlpt_recent_q) that the next quiz steers away from. Seeded Math.random so a failure reproduces.
QUnit.module('quiz variety (ticket 43)', {
  beforeEach: function () {
    this._origSpeech = window.speechSynthesis;
    try { delete window.speechSynthesis; } catch (e) { window.speechSynthesis = undefined; }
  },
  afterEach: function () { if (this._origSpeech !== undefined) window.speechSynthesis = this._origSpeech; }
}, function () {
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
  // withStore(fn): fn runs against an empty recent memory: the real localStorage when it works
  // (browser; the key is restored afterwards), else an in-memory stub (Node runner).
  function withStore(fn) {
    var real = false;
    try { localStorage.setItem('__jq', '1'); real = localStorage.getItem('__jq') === '1'; localStorage.removeItem('__jq'); } catch (e) {}
    if (real) {
      var saved = localStorage.getItem(RECENT_Q_KEY);
      localStorage.removeItem(RECENT_Q_KEY);
      try { return fn(); } finally { if (saved === null) localStorage.removeItem(RECENT_Q_KEY); else localStorage.setItem(RECENT_Q_KEY, saved); }
    }
    var g = typeof globalThis !== 'undefined' ? globalThis : window, orig = g.localStorage, mem = {};
    g.localStorage = { getItem: function (k) { return k in mem ? mem[k] : null; }, setItem: function (k, v) { mem[k] = String(v); }, removeItem: function (k) { delete mem[k]; } };
    try { return fn(mem); } finally { g.localStorage = orig; }
  }
  var units = function () { return buildUnits(PLAN, CATALOG); };
  var key = function (e) { return e.item ? e.item.id : e.itemId; };

  QUnit.test('every kana/lesson/review quiz: an item at most twice, never within 3 questions of itself', function (assert) {
    withSeed(21, function () {
      units().filter(function (u) { return u.kind !== 'prep' && u.kind !== 'mock'; }).forEach(function (u) {
        for (var run = 0; run < 3; run++) {
          var exs = buildExercises(u), count = {};
          exs.forEach(function (e, i) {
            var k = key(e);
            count[k] = (count[k] || 0) + 1;
            if (count[k] > QUIZ_ITEM_MAX) assert.ok(false, u.id + ': ' + k + ' asked ' + count[k] + ' times');
            for (var j = Math.max(0, i - QUIZ_SPACING); j < i; j++) if (key(exs[j]) === k) assert.ok(false, u.id + ': ' + k + ' at ' + j + ' and ' + i);
          });
        }
      });
    });
    assert.ok(true);
  });

  QUnit.test('few items: a shorter quiz; under 8 items, second asks reach 8, spaced', function (assert) {
    var u027 = units().filter(function (u) { return u.id === 'n5.u027'; })[0];
    assert.strictEqual(buildExercises(u027).length, quizItems(u027).length, 'an 8-item lesson asks 8, not 12');
    var vs = ['v:水|みず', 'v:食べる|たべる', 'v:飲む|のむ', 'v:本|ほん', 'v:先生|せんせい'].map(function (id) { return CATALOG.items[id]; });
    var small = { id: 'n5.u999', level: 'N5', kind: 'lesson', index: 30, vocab: vs, kanji: [], grammar: [] };
    withSeed(4, function () {
      for (var run = 0; run < 10; run++) {
        var exs = buildExercises(small), count = {};
        assert.strictEqual(exs.length, 8, '5 items → 8 questions');
        exs.forEach(function (e, i) {
          count[e.itemId] = (count[e.itemId] || 0) + 1;
          for (var j = Math.max(0, i - QUIZ_SPACING); j < i; j++) if (exs[j].itemId === e.itemId) assert.ok(false, 'run ' + run + ': ' + e.itemId + ' too close');
        });
        vs.forEach(function (v) { if (!count[v.id] || count[v.id] > 2) assert.ok(false, v.id + ' asked ' + (count[v.id] || 0) + ' times'); });
      }
    });
  });

  QUnit.test('early units: wrong options come from a wider pool than the few taught words', function (assert) {
    var u = units().filter(function (x) { return x.id === 'n5.u002'; })[0], ctx = quizContext(u);
    var opts = {};
    withSeed(8, function () {
      for (var run = 0; run < 20; run++) {
        var e = makeQuestion(CATALOG.items['v:いす|いす'], ctx, false, [], true, 'meaning');
        if (e && e.form === 'meaningMc') e.options.forEach(function (o, i) { if (i !== e.correct) opts[o] = true; });
      }
    });
    assert.ok(Object.keys(opts).length >= 10, Object.keys(opts).length + ' distinct wrong meanings over 20 questions');
  });

  QUnit.test('recent memory: last 100 questions, device-local, robust to bad storage', function (assert) {
    withStore(function () {
      assert.deepEqual(recentAsked(), {}, 'empty');
      for (var i = 0; i < 120; i++) rememberAsked({ itemId: 'v:' + i, form: 'meaningMc' });
      rememberAsked({ item: { id: 'w:さかな', kind: 'kanaword', word: 'さかな' }, form: 'romajiType' });
      rememberAsked({ itemId: 'v:119', form: 'meaningMc' }); // again: moves to the end, no duplicate
      var list = JSON.parse(localStorage.getItem(RECENT_Q_KEY));
      assert.strictEqual(list.length, RECENT_Q_MAX);
      assert.strictEqual(list[list.length - 1], 'v:119|meaningMc');
      assert.ok(recentAsked()['w:さかな|romajiType'], 'a reading word is remembered by its kana');
      assert.notOk(recentAsked()['v:0|meaningMc'], 'the oldest dropped');
      rememberAsked({ form: 'x' }); // no item: ignored
      localStorage.setItem(RECENT_Q_KEY, '{not json');
      assert.deepEqual(recentAsked(), {}, 'garbage reads as empty');
      rememberAsked({ itemId: 'v:a', form: 'f' });
      assert.ok(recentAsked()['v:a|f'], 'and is overwritten');
    });
    var g = typeof globalThis !== 'undefined' ? globalThis : window, orig = g.localStorage, threw = false;
    try {
      try { g.localStorage = { getItem: function () { throw new Error('blocked'); }, setItem: function () { throw new Error('blocked'); } }; } catch (e) {}
      rememberAsked({ itemId: 'v:x', form: 'f' });
      recentAsked();
      buildExercises(units()[20]);
    } catch (e) { threw = true; } finally { try { g.localStorage = orig; } catch (e) {} }
    assert.notOk(threw, 'blocked storage never breaks a quiz');
  });

  QUnit.test('recent memory: the next quiz prefers other forms, a review other items; no taught item dropped', function (assert) {
    withSeed(30, function () {
      withStore(function () {
        var us = units(), lesson = us.filter(function (u) { return u.id === 'n5.u028'; })[0];
        var repeat = function (u) {
          var a = buildExercises(u);
          a.forEach(rememberAsked);
          var recent = recentAsked(), b = buildExercises(u);
          return { a: a, b: b, same: b.filter(function (e) { return recent[key(e) + '|' + e.form]; }).length };
        };
        var r = repeat(lesson);
        assert.ok(r.same <= Math.ceil(r.b.length * 0.25), 'lesson retake repeats ' + r.same + '/' + r.b.length + ' item+form pairs');
        var asked = {};
        r.b.forEach(function (e) { asked[e.itemId] = true; });
        quizItems(lesson).forEach(function (it) { if (!asked[it.id]) assert.ok(false, 'retake dropped ' + it.id); });
        // a review samples 20 of its items: the retake asks other ones (grammar is always asked first)
        var rev = us.filter(function (u) { return u.id === 'n5.u025'; })[0];
        r = repeat(rev);
        var first = {};
        r.a.forEach(function (e) { if (e.item && e.item.kind !== 'grammar') first[e.itemId] = true; });
        var again = r.b.filter(function (e) { return e.item && e.item.kind !== 'grammar' && first[e.itemId]; }).length;
        assert.strictEqual(again, 0, 'review retake: ' + again + ' non-grammar items asked again');
        // a kana stage still reads every kana with full memory
        var u2 = us.filter(function (u) { return u.id === 'n5.u002'; })[0];
        r = repeat(u2);
        var read = {};
        r.b.forEach(function (e) { if (e.part === 'read') (e.item.kind === 'kana' ? [e.item.char] : kanaSyllables(e.item.word)).forEach(function (c) { read[c] = true; }); });
        u2.kana.forEach(function (k) { if (!read[k.char]) assert.ok(false, 'u002 retake never reads ' + k.char); });
      });
    });
  });

  // (reset wipes it: the resetAllData check in .claude/hooks/run-tests.js)
  QUnit.test('recent memory is written only by answering, under its own key', function (assert) {
    withStore(function (mem) {
      buildExercises(units()[1]);
      assert.deepEqual(recentAsked(), {}, 'building a quiz records nothing');
      if (mem) assert.deepEqual(Object.keys(mem), [], 'no other key written');
    });
  });
});
