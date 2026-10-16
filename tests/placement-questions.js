"use strict";

// Roadmap ticket 37: one-stage question builder for the placement test.
QUnit.module('placementQuestions', function () {
  var stages = function () { return buildUnits(PLAN, CATALOG).filter(liveUnit).filter(function (u) { return u.kind === 'kana' || u.kind === 'lesson'; }); }; // the shipped levels, as the app sees them

  QUnit.test('every teaching stage yields 2 + 1 distinct questions, no leaks, no single letters', function (assert) {
    // every planned level, live or not (a level with ready: false is still checked here)
    var list = buildUnits(PLAN, CATALOG).filter(function (u) { return u.kind === 'kana' || u.kind === 'lesson'; }), bad = [];
    PLAN.forEach(function (p) {
      var n = list.filter(function (u) { return u.level === p.level; }).length;
      if (p.level === 'N5') assert.strictEqual(n, 90, '90 N5 teaching stages');
      else if (p.level === 'N4') assert.strictEqual(n, 87, '87 N4 teaching stages');
      else assert.ok(n > 0, n + ' ' + p.level + ' teaching stages');
    });
    list.forEach(function (u) {
      for (var run = 0; run < 4; run++) { // random forms: repeat
        var a = placementQuestions(u, 2, []), b = placementQuestions(u, 1, a.map(function (q) { return q.itemId; }));
        if (a.length < 2 || b.length < 1) { bad.push(u.id + ' ' + a.length + '+' + b.length); return; }
        var ids = a.concat(b).map(function (q) { return q.itemId; });
        if (new Set(ids).size !== 3) bad.push(u.id + ' duplicate item');
        a.concat(b).forEach(function (q) {
          if (answerLeaks(q)) bad.push(u.id + ' leak ' + q.itemId);
          if (u.kind === 'kana' && (!/^v:/.test(q.itemId) || Array.from(q.item.word).length < 2)) bad.push(u.id + ' single/non-word ' + q.itemId);
          if (q.item.kind === 'vocab' && isBound(q.item) && !/^(ctx)/.test(q.form)) bad.push(u.id + ' bound outside context ' + q.itemId);
          if (q.item.kind === 'grammar' && q.recall) bad.push(u.id + ' grammar typed');
        });
      }
    });
    assert.deepEqual(bad, [], 'problems');
  });

  QUnit.test('typed forms are the norm for words and kanji; no repeats across a 20-question test', function (assert) {
    var u = stages().filter(function (x) { return x.kind === 'lesson'; })[5], taken = [], all = [];
    for (var i = 0; i < 20; i++) { var q = placementQuestions(u, 1, taken)[0]; if (!q) break; taken.push(q.itemId); all.push(q); }
    assert.strictEqual(new Set(taken).size, taken.length, 'distinct');
    assert.ok(all.length > 3 && all.every(function (q) { return q.item.kind === 'grammar' || q.recall; }), 'typed');
    var some = stages()[0], n = (some.vocab || []).length + (some.practice || []).length;
    assert.strictEqual(placementQuestions(some, n + 5, []).length <= n, true, 'never more than the stage has');
  });

  // kana-stage questions, repeated: random forms and distractors
  var kanaQs = function () {
    var out = [];
    stages().filter(function (u) { return u.kind === 'kana'; }).forEach(function (u) {
      for (var run = 0; run < 6; run++) placementQuestions(u, 3, []).forEach(function (q) { out.push({ u: u, q: q }); });
    });
    return out;
  };
  var isKata = function (s) { return /^[ァ-ヺー]+$/.test(s) && !/[ぁ-ゖ]/.test(s); };
  var isHira = function (s) { return /^[ぁ-ゖー]+$/.test(s); };

  QUnit.test('kana stages ask multiple choice only, never a typed or recall form', function (assert) {
    var all = kanaQs(), bad = all.filter(function (x) { return x.q.recall || x.q.answers || x.q.form === 'meaningMc' || x.q.type !== 'mc' || !x.q.options || x.q.options.length !== 4; });
    assert.ok(all.length > 100, all.length + ' kana questions sampled');
    assert.deepEqual(bad.map(function (x) { return x.u.id + ' ' + x.q.form; }), [], 'non-multiple-choice kana questions');
  });

  QUnit.test('kana multiple-choice distractors are kana of the same type as the answer', function (assert) {
    var bad = [];
    kanaQs().forEach(function (x) {
      var kata = isKata(x.q.item.word), same = kata ? isKata : isHira;
      x.q.options.forEach(function (o) { if (!same(o)) bad.push(x.q.form + ' ' + x.q.item.word + ' ' + o); });
      if (x.q.options[x.q.correct] !== x.q.item.word) bad.push('answer differs from item ' + x.q.item.word);
    });
    assert.deepEqual(bad, [], 'mixed-script options');
  });

  QUnit.test('katakana items are never shown as hiragana', function (assert) {
    var bad = [], kata = 0;
    kanaQs().forEach(function (x) {
      if (!isKata(x.q.item.word)) return;
      kata++;
      var shown = [x.q.question].concat(x.q.options).filter(function (s) { return KANA_WORD_RE.test(s || ''); });
      shown.forEach(function (s) { if (/[ぁ-ゖ]/.test(s)) bad.push(x.q.form + ' ' + x.q.item.word + ' ' + s); });
      if (!isKata(x.q.options[x.q.correct])) bad.push('answer not katakana ' + x.q.item.word);
    });
    assert.ok(kata > 10, kata + ' katakana questions sampled');
    assert.deepEqual(bad, [], 'hiragana shown for katakana');
  });

  QUnit.test('no kana question shows its own answer', function (assert) {
    assert.deepEqual(kanaQs().filter(function (x) { return answerLeaks(x.q); }).map(function (x) { return x.q.itemId; }), [], 'leaks');
  });

  QUnit.test('no placement question on any stage is a typed katakana answer', function (assert) {
    var real = Math.random, seed = 12345, bad = [], typed = 0;
    Math.random = function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
    try {
      stages().forEach(function (u) {
        for (var run = 0; run < 6; run++) {
          var a = placementQuestions(u, 2, []);
          a.concat(placementQuestions(u, 1, a.map(function (q) { return q.itemId; }))).forEach(function (q) {
            if (q.type !== 'typing') return;
            typed++;
            if ((q.answers || []).some(function (x) { return /[゠-ヿ]/.test(x); })) bad.push(u.id + ' ' + q.form + ' ' + q.itemId);
          });
        }
      });
    } finally { Math.random = real; }
    assert.ok(typed > 0, 'hiragana typed recall still appears on lesson stages');
    assert.deepEqual(bad, [], 'katakana typing');
  });

  QUnit.test('review / prep / mock units give nothing', function (assert) {
    buildUnits(PLAN, CATALOG).filter(liveUnit).filter(function (u) { return u.kind !== 'kana' && u.kind !== 'lesson'; }).forEach(function (u) {
      assert.strictEqual(placementQuestions(u, 2, []).length, 0, u.id);
    });
  });
});
