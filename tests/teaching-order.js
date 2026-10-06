"use strict";

// Teaching order (audit P1-1, docs/adr/0002): sentences shown or asked in a lesson use only items
// (by `uses`) taught by that lesson.
QUnit.module('teaching order', function () {
  var lessons = function () { return buildUnits(PLAN, CATALOG).filter(function (u) { return u.level === 'N5' && u.kind === 'lesson'; }); };
  // later(s, known): s.uses not taught yet; another spelling (alt) counts with the one the plan teaches
  var later = function (s, known) {
    return (s.uses || []).filter(function (id) { var it = CATALOG.items[id]; return !known[id] && !(it && it.alt && known[it.alt]); });
  };

  QUnit.test('every lesson grammar point has 3 examples using nothing taught later', function (assert) {
    var short = [];
    lessons().forEach(function (u) {
      var known = taughtIds(u);
      (u.grammar || []).forEach(function (g) {
        var clean = (g.examples || []).filter(function (id) { return !later(CATALOG.items[id], known).length; });
        if (clean.length < 3) short.push(u.id + ' ' + g.id + ' ' + clean.length);
      });
    });
    assert.deepEqual(short, [], 'points short of clean examples');
  });

  QUnit.test('lessonExamples: at most 3, fewest later-taught items first, nothing dropped from the data', function (assert) {
    var u = lessons().filter(function (x) { return x.id === 'n5.u019'; })[0], g = CATALOG.items['g:wa-desu'];
    assert.strictEqual(g.examples[0], 's:tatoeba:218088', 'authored first example uses 本, taught later');
    assert.deepEqual(lessonExamples(g, u).map(function (s) { return s.id; }),
      ['s:own:n5-wa-desu', 's:own:n5-wa-desu-sensei', 's:own:n5-wa-desu-koohii'], 'clean ones shown, authored order');
    var bad = [];
    lessons().forEach(function (x) {
      var known = taughtIds(x);
      (x.grammar || []).forEach(function (p) {
        var n = lessonExamples(p, x).map(function (s) { return later(s, known).length; });
        var all = (p.examples || []).map(function (id) { return later(CATALOG.items[id], known).length; }).sort(function (a, b) { return a - b; });
        if (n.length > 3 || n.join() !== all.slice(0, n.length).join()) bad.push(x.id + ' ' + p.id + ' ' + n.join());
      });
    });
    assert.deepEqual(bad, [], 'shown examples not the cleanest');
  });

  // Quiz questions: a sentence form never uses an item taught after the unit. makeQuestion's last
  // resort (a leaky sentence when no form fits at all, tagged `leaky`) is allowed only for the
  // '<unitId> <itemId>' pairs in LEAK_FALLBACK_OK.
  var LEAK_FALLBACK_OK = [];
  function seeded(seed) {
    return function () { // mulberry32
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  QUnit.test('untaughtCount / byUntaught / quizSentences', function (assert) {
    var a = { id: 'a', uses: ['x', 'y'] }, b = { id: 'b', uses: ['x'] }, c = { id: 'c', uses: ['x', 'z'] };
    var known = { x: true };
    assert.strictEqual(untaughtCount(a, known), 1);
    assert.strictEqual(untaughtCount({ id: 'n' }, known), 0, 'no uses: nothing untaught');
    assert.strictEqual(untaughtCount({ id: 'm', uses: ['v:一番|いちばん'] }, { 'v:いちばん|いちばん': true }), 0, 'alt spelling of a taught word');
    assert.deepEqual(byUntaught([a, c, b], known).map(function (s) { return s.id; }), ['b', 'a', 'c'], 'fewest first, ties keep order');
    assert.deepEqual(quizSentences([a, b, c], { taught: known }).map(function (s) { return s.id; }), ['b'], 'clean only');
    assert.deepEqual(quizSentences([a, b], { taught: known, leakOk: true }).map(function (s) { return s.id; }), ['b', 'a'], 'leakOk: cleanest first');
  });

  QUnit.test('5 builds of every N5 lesson: no sentence question uses an item taught later', function (assert) {
    var rnd = Math.random, bad = [], sent = 0, fallback = [];
    Math.random = seeded(11);
    try {
      lessons().forEach(function (u) {
        var known = taughtIds(u);
        for (var r = 0; r < 5; r++) buildExercises(u).forEach(function (ex) {
          if (ex.leaky && LEAK_FALLBACK_OK.indexOf(u.id + ' ' + ex.itemId) < 0) fallback.push(u.id + ' ' + ex.itemId);
          var s = ex.sentence && CATALOG.items[ex.sentence];
          if (!s || s.kind !== 'sentence') return;
          sent++;
          if (later(s, known).length && !ex.leaky) bad.push(u.id + ' ' + ex.form + ' ' + s.id);
        });
      });
    } finally { Math.random = rnd; }
    assert.ok(sent > 50, sent + ' sentence-based questions');
    assert.deepEqual(bad, [], 'sentences with later-taught items');
    assert.deepEqual(fallback, [], 'leaky fallback outside LEAK_FALLBACK_OK');
  });

  QUnit.test('makeQuestion falls back to the cleanest leaky sentence only when nothing else fits', function (assert) {
    var u = lessons().filter(function (x) { return x.id === 'n5.u019'; })[0];
    var ctx = quizContext(u), g = CATALOG.items['g:wa-desu'];
    // only the order form: every ★ sentence for は…です uses items taught after u019
    var forms = formsFor;
    formsFor = function (it, c) { return forms(it, c).filter(function (f) { return f.name === 'order'; }); };
    try {
      var ex = makeQuestion(g, ctx, null, [], false);
      assert.ok(ex && ex.leaky && ex.type === 'order', 'leaky order question as last resort');
      assert.notOk(ctx.leakOk, 'leakOk reset');
    } finally { formsFor = forms; }
  });
});
