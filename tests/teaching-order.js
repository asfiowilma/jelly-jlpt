"use strict";

// Teaching order (audit P1-1, docs/adr/0002): sentences shown or asked in a lesson use only items
// (by `uses`) taught by that lesson.
QUnit.module('teaching order', function () {
  var lessons = function () { return buildUnits(PLAN, CATALOG).filter(function (u) { return u.kind === 'lesson'; }); }; // every planned level
  // later(s, known): s.uses not taught yet; another spelling (alt) counts with the one the plan teaches
  var later = function (s, known) {
    return (s.uses || []).filter(function (id) { var it = CATALOG.items[id]; return !known[id] && !(it && it.alt && known[it.alt]); });
  };

  // Words the course never teaches, so no `uses` id can hold them back (N5 r1 newbie N3/N6: 彼 in shown
  // examples and graded stems). Independent of lib.js OFF_CATALOG; a sentence holding one is never shown.
  var NOT_TAUGHT = ['彼', '彼女', 'ビール', '人形', '親切', '本当に', '経験', '象', '出発', '失礼', '動物園'];
  // a word a later level teaches is in that sentence's uses, so later() holds it back instead
  var offWord = function (s) {
    return NOT_TAUGHT.filter(function (w) { return (s.jp || '').indexOf(w) >= 0 && !(s.uses || []).some(function (id) { return id.indexOf('v:' + w + '|') === 0; }); });
  };

  QUnit.test('every lesson grammar point has 3 examples using nothing taught later', function (assert) {
    var short = [];
    lessons().forEach(function (u) {
      var known = taughtIds(u);
      (u.grammar || []).forEach(function (g) {
        var clean = (g.examples || []).filter(function (id) { return !later(CATALOG.items[id], known).length && !offWord(CATALOG.items[id]).length; });
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

  QUnit.test('shown lesson sentences (grammar box and Example sentences) use only taught items and no non-catalog word', function (assert) {
    var bad = [], n = 0;
    lessons().forEach(function (u) {
      var known = taughtIds(u), shown = unitExamples(u);
      (u.grammar || []).forEach(function (g) { shown = shown.concat(lessonExamples(g, u)); });
      shown.forEach(function (s) {
        n++;
        var why = later(s, known).concat(offWord(s));
        if (why.length) bad.push(u.id + ' ' + s.id + ' ' + why.join(','));
      });
    });
    assert.ok(n > 250, n + ' shown sentences');
    assert.deepEqual(bad, [], 'shown sentences with a later-taught or non-catalog word');
    assert.ok(untaughtCount({ jp: '彼は学生です。', uses: [] }, {}) > 0, 'a non-catalog word counts as untaught');
  });

  // Ratchet (audit P1-1 after-measurement: 0 of 201 shown examples and 0 of 137 sentence questions in 5
  // builds leaked; before: 60 / 201 and 144 / 226). Raise only with a reason in docs/adr/0002.
  var LEAK_SHARE_MAX = 0, EARLY_UNITS = ['n5.u019', 'n5.u020', 'n5.u028', 'n5.u030', 'n5.u031'];
  QUnit.test('lessons: share of shown examples and quiz sentences with later-taught items stays at the ratchet', function (assert) {
    var rnd = Math.random, n = 0, leaks = [];
    Math.random = seeded(23);
    try {
      lessons().forEach(function (u) {
        var known = taughtIds(u), check = function (s, what) { n++; if (later(s, known).length) leaks.push(u.id + ' ' + what + ' ' + s.id); };
        (u.grammar || []).forEach(function (g) { lessonExamples(g, u).forEach(function (s) { check(s, 'example'); }); });
        for (var r = 0; r < 3; r++) buildExercises(u).forEach(function (ex) {
          var s = ex.sentence && CATALOG.items[ex.sentence];
          if (s && s.kind === 'sentence') check(s, ex.form);
        });
      });
    } finally { Math.random = rnd; }
    assert.ok(n > 250, n + ' examples and sentence questions');
    assert.ok(leaks.length <= LEAK_SHARE_MAX * n, leaks.length + ' leak(s): ' + leaks.slice(0, 10).join(', '));
    assert.deepEqual(leaks.filter(function (l) { return EARLY_UNITS.indexOf(l.split(' ')[0]) >= 0; }), [], 'early grammar units: none');
  });

  // `uses` must name the conjugation a sentence shows, else untaughtCount cannot hold it back (N5 r1 grammar
  // T1/T2: 働いてる, 食べなかった, 話した shown before their form was taught). Conservative detectors: a hit
  // needs one id of the form's family in `uses`. ponytail: regexes miss a bare connective て (歩いて学校へ) and
  // casual てる / てます; those were added by hand. Exclusions keep とても, じゃない, くない, 少ない, ふたり out.
  var TE = ['g:te-form', 'g:te-iru', 'g:te-kudasai', 'g:te-kara', 'g:te-mo-ii', 'g:te-wa-ikemasen', 'g:mada-te-imasen',
    'g:nai-de-kudasai', 'g:nakute-wa-ikenai', 'g:nakute-wa-naranai', 'g:nakucha-ikenai'];
  var FORM_DETECTORS = [
    ['g:wo', /を/, ['g:wo']], // N5 r1 newbie N5: コーヒーを飲みます shown in u028, を taught in u036
    ['g:te-form', /(?<!と)(?:て|(?<=[いん])で)(?:い[るまたな]|ください|から|もいい|はいけ)/, TE],
    ['g:te-iru', /(?<!と)(?:て|(?<=[いん])で)い(?:る|ます|ました|ません|た|な)/, ['g:te-iru', 'g:mada-te-imasen']],
    ['g:ta-form', /(?<![あふまわ])(?:た|(?<=[いん])だ)(?:こと|り|ら|ほう)|(?<![まで])した(?=[。、？！よねのけ]|$)|(?<![かだ])った(?=[。、？！よねのけ]|$)|(?<=[べめれけせてね見来寝])た(?=[。、？！よねのけ])/,
      ['g:ta-form', 'g:ta-koto-ga-aru', 'g:tari-tari', 'g:hou-ga-ii']],
    ['g:nai-form', /(?<![くゃはすぶ少危汚])(?<!きた)(?<!つまら)(?:ない|なかった)/,
      ['g:nai-form', 'g:nai-de-kudasai', 'g:nakute-wa-ikenai', 'g:nakute-wa-naranai', 'g:nakucha-ikenai', 'g:mada-te-imasen', 'g:ta-koto-ga-aru', 'g:ta-form', 'v:ない|ない']]
  ];
  QUnit.test('every N5 sentence lists the て / た / ない form it shows in `uses`', function (assert) {
    var miss = [];
    catalogOf('sentence').filter(function (s) { return s.level === 'N5'; }).forEach(function (s) {
      FORM_DETECTORS.forEach(function (d) {
        if (d[1].test(s.jp) && !d[2].some(function (id) { return (s.uses || []).indexOf(id) >= 0; })) miss.push(d[0] + ' ' + s.id + ' ' + s.jp);
      });
    });
    assert.deepEqual(miss, [], 'sentences showing a form their uses omit');
    [['待っています。', 1], ['とてもいいです。', -1], ['学生じゃない。', -1], ['行ったことがある。', 2], ['食べなかった。', 3], ['話した。', 2], ['でした。', -1]].forEach(function (c) {
      var hit = FORM_DETECTORS.slice(1).map(function (d, i) { return d[1].test(c[0]) ? i : -1; }).filter(function (i) { return i >= 0; });
      assert.ok(c[1] < 0 ? !hit.length : hit.indexOf(c[1]) >= 0, c[0] + ' → ' + hit.join(','));
    });
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

  // reviews too, and every sentence form: gap, ★ order (chunked sentences: N5 r1 newbie, a より ★ item in u048 / u053)
  QUnit.test('5 builds of every planned lesson and review: no sentence question uses an item taught later', function (assert) {
    var rnd = Math.random, bad = [], sent = 0, fallback = [], orders = 0;
    Math.random = seeded(11);
    try {
      buildUnits(PLAN, CATALOG).filter(function (u) { return u.kind === 'lesson' || u.kind === 'review'; }).forEach(function (u) {
        var known = taughtIds(u);
        for (var r = 0; r < 5; r++) buildExercises(u).forEach(function (ex) {
          if (ex.leaky && LEAK_FALLBACK_OK.indexOf(u.id + ' ' + ex.itemId) < 0) fallback.push(u.id + ' ' + ex.itemId);
          var s = ex.sentence && CATALOG.items[ex.sentence];
          if (!s || s.kind !== 'sentence') return;
          sent++;
          if (ex.type === 'order') orders++;
          if ((later(s, known).length || offWord(s).length) && !ex.leaky) bad.push(u.id + ' ' + ex.form + ' ' + s.id);
        });
      });
    } finally { Math.random = rnd; }
    assert.ok(sent > 50, sent + ' sentence-based questions');
    assert.ok(orders > 20, orders + ' ★ order questions');
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
