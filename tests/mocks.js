"use strict";

// Mock exams, timed quizzes and prep drills (ticket 18, Q36-Q39).
QUnit.module('mock exams', function () {
  var mocks = function () { return catalogOf('mock'); };
  var text = function (parts) { return parts.map(function (p) { return p.t; }).join(''); };
  var stripRuby = function (s) { return s.replace(/\[([^|\]]+)\|[^\]]*\]/g, '$1'); };
  var isPerm = function (o, n) { return Array.isArray(o) && o.length === n && o.slice().sort().join() === Array.from({ length: n }, function (_, i) { return i; }).join(); };
  // what a fixed question refers to, for "no item twice" checks
  var qKey = function (q) { return [q.m, q.s || q.f || q.item || q.p || q.l, q.w || q.blank || q.q || ''].join(' '); };

  QUnit.test('every mock follows its blueprint: questions per mondai, 3 sections, real N5 timing', function (assert) {
    assert.deepEqual(mocks().map(function (m) { return m.id + ' ' + m.format; }), ['x:n5-mock-1 full', 'x:n5-mock-2 full', 'x:n5-mock-3 diagnostic']);
    mocks().forEach(function (m) {
      var bp = MOCK_BLUEPRINT[m.format];
      MOCK_SECTIONS.forEach(function (s) {
        var got = {};
        m.sections[s.key].forEach(function (q) { var k = mondaiKey(q); got[k] = (got[k] || 0) + 1; });
        assert.deepEqual(got, bp[s.key], m.id + ' ' + s.key);
      });
    });
    var full = mockSections(CATALOG.items['x:n5-mock-1']).map(function (s) { return s.seconds / 60; });
    assert.deepEqual(full, [20, 40, 30], 'full mock: 20 / 40 / 30 minutes');
    var diag = mockSections(CATALOG.items['x:n5-mock-3']);
    assert.ok(diag.every(function (s, i) { return s.seconds < full[i] * 60 && s.seconds > full[i] * 20; }), 'diagnostic: about half the time');
  });

  QUnit.test('every reference exists, is N5 and of the right kind; nothing twice in a mock', function (assert) {
    var errs = [];
    var need = function (m, id, kind) {
      var it = CATALOG.items[id];
      if (!it || it.kind !== kind) errs.push(m.id + ': ' + id + ' is not a ' + kind);
      else if (it.level !== 'N5') errs.push(m.id + ': ' + id + ' is ' + it.level);
    };
    mocks().forEach(function (m) {
      var seen = {};
      MOCK_SECTIONS.forEach(function (s) {
        m.sections[s.key].forEach(function (q) {
          if (seen[qKey(q)]) errs.push(m.id + ': twice ' + qKey(q));
          seen[qKey(q)] = true;
          if (q.s) need(m, q.s, 'sentence');
          if (q.w) need(m, q.w, 'vocab');
          if (q.item) need(m, q.item, 'mondai');
          if (q.p) need(m, q.p, 'passage');
          if (q.l) need(m, q.l, 'listening');
        });
      });
    });
    assert.deepEqual(errs, []);
  });

  QUnit.test('mocks share no passage, listening item, authored mondai or sentence; none of them is in a lesson review', function (assert) {
    var owner = {}, errs = [];
    allUnits().forEach(function (u) { (u.passages || []).concat(u.listening || []).forEach(function (id) { owner[id] = u.id; }); });
    mocks().forEach(function (m) {
      var mine = {};
      MOCK_SECTIONS.forEach(function (s) {
        m.sections[s.key].forEach(function (q) { var id = q.p || q.l || q.item || q.s; if (id) mine[id] = true; });
      });
      Object.keys(mine).forEach(function (id) {
        if (owner[id]) errs.push(id + ' in ' + m.id + ' and ' + owner[id]);
        owner[id] = m.id;
      });
    });
    assert.deepEqual(errs, []);
    var ids = mockItemIds();
    assert.ok(ids['p:n5-bakery'] && ids['l:n5-where-box'] && ids['m:n5-iikae-kurai'], 'mockItemIds covers passages, listening and mondai');
  });

  QUnit.test('fixed answers are valid and the question never shows its answer', function (assert) {
    var errs = [];
    var e = function (m, q, msg) { errs.push(m.id + ' ' + qKey(q) + ': ' + msg); };
    mocks().forEach(function (m) {
      MOCK_SECTIONS.forEach(function (s) {
        m.sections[s.key].forEach(function (q) {
          if (q.o && !q.f && !q.w && !isPerm(q.o, q.m === 'order' ? 4 : (q.m === 'reading' ? CATALOG.items[q.p].questions[q.q].options.length
            : q.m === 'bunshou' ? CATALOG.items[q.item].blanks[q.blank - 1].options.length : CATALOG.items[q.item].options.length))) e(m, q, 'o is not an order of the options');
          if (q.w || q.f) {
            var opts = q.o.map(stripRuby);
            if (opts.length !== 4 || new Set(opts).size !== 4 || !(q.a >= 0 && q.a < 4)) e(m, q, 'needs 4 distinct options + answer');
          }
          if (q.w) {
            var sen = CATALOG.items[q.s], w = CATALOG.items[q.w];
            if (!wordSpan(furiganaParts(sen.furigana || sen.jp), w.word, w.reading)) e(m, q, 'word not once in the sentence with its reading');
            if (!Array.from(w.word).filter(hasKanji).every(function (c) { return CATALOG.items['k:' + c] && CATALOG.items['k:' + c].level === 'N5'; })) e(m, q, 'tests a non-N5 kanji');
            var same = catalogOf('vocab').filter(function (v) { return q.m === 'kanjiYomi' ? v.word === w.word : kataToHira(v.reading) === kataToHira(w.reading); })
              .map(function (v) { return q.m === 'kanjiYomi' ? kataToHira(v.reading) : v.word; });
            var right = q.m === 'kanjiYomi' ? kataToHira(w.reading) : w.word;
            if (q.o[q.a] !== right) e(m, q, 'answer ' + q.o[q.a] + ' ≠ ' + right);
            q.o.forEach(function (o, i) { if (i !== q.a && same.indexOf(o) >= 0) e(m, q, 'distractor ' + o + ' is also right'); });
          }
          if (q.m === 'order') {
            var c = CATALOG.items[q.s].chunks;
            if (!c || (c.star || [0, 1, 2, 3]).indexOf(q.star) < 0) e(m, q, 'star slot not allowed by the author');
          }
          if (q.f) {
            if (q.f.split('（　）').length !== 2) e(m, q, 'needs exactly one （　）');
            if (!q.en || !q.explain) e(m, q, 'needs en + explain');
          }
        });
      });
      mockSections(m).forEach(function (s) {
        s.questions.forEach(function (ex, i) {
          var q = m.sections[s.key][i];
          if (!ex || !ex.options || !(ex.correct >= 0 && ex.correct < ex.options.length)) return e(m, q, 'does not build');
          if (!ex.explain) e(m, q, 'no explanation for the results');
          var leak = answerLeaks(Object.assign({}, ex, { item: CATALOG.items[q.w] }));
          if (leak) e(m, q, 'answer leak (ticket 39 guard): ' + leak);
          if (ex.parts) {
            var shown = text(ex.parts), ans = ex.options[ex.correct];
            if (ex.type === 'hyouki' && shown.indexOf(ans) >= 0) e(m, q, 'sentence shows the spelling');
            if (ex.type === 'kanji_yomi' && ex.parts.some(function (p) { return p.u && p.r; })) e(m, q, 'furigana on the tested word');
            if ((ex.type === 'gap' || ex.type === 'bunmyaku') && ans.length > 1 && shown.indexOf(ans) >= 0) e(m, q, 'prompt shows the answer');
          }
        });
      });
    });
    assert.deepEqual(errs, []);
  });

  QUnit.test('the same mock always builds the same test', function (assert) {
    var m = CATALOG.items['x:n5-mock-2'];
    var a = JSON.stringify(mockSections(m)), b = JSON.stringify(mockSections(m));
    assert.strictEqual(a, b);
    var answers = mockSections(m).map(function (s) { return s.questions.map(function (ex) { return ex.correct; }); });
    var spread = [0, 0, 0, 0];
    answers.slice(0, 2).forEach(function (xs) { xs.forEach(function (c) { if (c < 4) spread[c]++; }); });
    assert.ok(spread.every(function (n) { return n >= 5; }), 'answers spread over the four positions: ' + spread);
  });

  // ── scoring (Q38) ──────────────────────────────────────────────────────────
  QUnit.test('mockEstimate: linear scaled score with the real N5 pass rules', function (assert) {
    var p = function (v, g, r, l) { return { vocab: v, grammar: g, reading: r, listening: l }; };
    assert.deepEqual(mockEstimate(p(1, 1, 1, 1)), { lkr: 120, listening: 60, total: 180, passed: true }, 'all right');
    assert.deepEqual(mockEstimate(p(0, 0, 0, 0)), { lkr: 0, listening: 0, total: 0, passed: false }, 'all wrong');
    assert.strictEqual(mockEstimate(p(1, 0, 0, 0)).lkr, Math.round(120 * 21 / 43), 'parts weighted by official item counts (21 / 17 / 5)');
    assert.strictEqual(mockEstimate(p(0, 0, 1, 0)).lkr, Math.round(120 * 5 / 43));
    assert.strictEqual(mockEstimate(p(0.5, 0.5, 0.5, 0.5)).total, 90);
    var lowListening = mockEstimate(p(1, 1, 1, 0.3));
    assert.ok(lowListening.total >= 80 && lowListening.listening === 18 && !lowListening.passed, 'listening under 19 fails even with a high total');
    var lowLkr = mockEstimate(p(0.3, 0.3, 0.3, 1));
    assert.ok(lowLkr.total >= 80 && lowLkr.lkr === 36 && !lowLkr.passed, 'language knowledge + reading under 38 fails');
    var edge = mockEstimate(p(0.35, 0.35, 0.35, 0.7));
    assert.deepEqual([edge.lkr, edge.listening, edge.total, edge.passed], [42, 42, 84, true], 'over every mark passes');
    var under = mockEstimate(p(0.4, 0.4, 0.4, 0.5));
    assert.deepEqual([under.lkr, under.listening, under.total, under.passed], [48, 30, 78, false], 'total under 80 fails');
  });

  QUnit.test('mockResult: right / total per part and per mondai; unanswered counts wrong', function (assert) {
    var m = CATALOG.items['x:n5-mock-3'], secs = mockSections(m), answers = {};
    secs.forEach(function (s) { answers[s.key] = s.questions.map(function (ex) { return ex.correct; }); });
    var all = mockResult(m, secs, answers, 1000);
    assert.deepEqual(all.estimate, { lkr: 120, listening: 60, total: 180, passed: true });
    assert.deepEqual(all.parts.reading, [4, 4], 'reading counted apart from grammar');
    assert.deepEqual(all.parts.grammar, [10, 10]);
    assert.deepEqual(all.byMondai.kanjiYomi, [4, 4]);
    answers.listening = answers.listening.map(function () { return null; }); // ran out of time
    answers.vocab[0] = (answers.vocab[0] + 1) % 4;
    var r = mockResult(m, secs, answers, 2000);
    assert.deepEqual(r.parts.listening, [0, 11]);
    assert.deepEqual(r.byMondai.kanjiYomi, [3, 4]);
    assert.ok(!r.estimate.passed && r.estimate.listening === 0, 'no listening, no pass');
    assert.strictEqual(r.mockId, 'x:n5-mock-3');
    assert.strictEqual(r.takenAt, 2000);
  });

  QUnit.test('mock result docs: id shape, snapshot (newest first), progress file check', function (assert) {
    var body = { mockId: 'x:n5-mock-1', takenAt: 5, parts: {}, byMondai: {}, answers: {}, estimate: { lkr: 1, listening: 1, total: 2, passed: false } };
    assert.ok(STORE_ID_RE.test('mock:x:n5-mock-1:5'));
    assert.notOk(STORE_ID_RE.test('mock:n5-mock-1'), 'needs the x: id and a time');
    var docs = [Object.assign({ _id: 'mock:x:n5-mock-1:5', updatedAt: 1 }, body), Object.assign({ _id: 'mock:x:n5-mock-1:9', updatedAt: 1 }, body, { takenAt: 9 })];
    assert.deepEqual(docsToSnapshot(docs).mocks.map(function (x) { return x.takenAt; }), [9, 5]);
    assert.ok(validateProgressData({ version: PROGRESS_VERSION, docs: docs.slice(0, 1) }).valid);
    assert.notOk(validateProgressData({ version: PROGRESS_VERSION, docs: docs.slice(1).map(function (d) { return Object.assign({}, d, { takenAt: 8 }); }) }).valid, 'id must match mockId + takenAt');
  });

  // ── timed quizzes (Q32 / Q36) ──────────────────────────────────────────────
  QUnit.test('lesson reviews and prep drills are timed at real pacing; lessons and kana reviews are not', function (assert) {
    var units = allUnits();
    var reviews = units.filter(function (u) { return u.kind === 'review'; });
    assert.notOk(isTimedQuiz(reviews[0]), 'hiragana review untimed');
    assert.ok(isTimedQuiz(reviews[reviews.length - 1]), 'last lesson review timed');
    assert.notOk(isTimedQuiz(units.filter(function (u) { return u.kind === 'lesson'; })[0]), 'lesson untimed');
    assert.ok(units.filter(function (u) { return u.kind === 'prep'; }).every(isTimedQuiz), 'prep drills timed');
    var ex = function (type, form) { return { type: type, form: form }; };
    assert.strictEqual(quizSeconds([ex('kanji_yomi', 'kanjiYomi'), ex('gap', 'gap'), ex('reading', 'reading'), ex('listen_dialog', 'listening'), ex('typing', 'meaningType')]),
      Math.round(1200 / 21 * 2 + 60 + 276 + 75));
    assert.strictEqual(quizSeconds([Object.assign(ex('gap', 'gap'), { requeue: true })]), 0, 're-asked questions add no time');
    assert.deepEqual(timeUpResults([1, 2, 3, 4], [true]), [true, false, false, false], 'unanswered = wrong');
    var s = scoreQuiz('review', [{}, {}, {}, {}], timeUpResults([1, 2, 3, 4], [true]));
    assert.deepEqual([s.right, s.total], [1, 4]);
  });

  QUnit.test('prep drills: every prep unit builds a drill in test order, never from a mock', function (assert) {
    var ids = mockItemIds();
    allUnits().filter(function (u) { return u.kind === 'prep'; }).forEach(function (u) {
      var exs = prepDrill(u);
      assert.ok(exs.length >= 5, u.id + ': ' + exs.length + ' questions');
      exs.forEach(function (ex) {
        if (!ex.options || !(ex.correct >= 0)) assert.ok(false, u.id + ' ' + ex.form + ' not MC');
        if (ids[ex.itemId]) assert.ok(false, u.id + ' uses mock item ' + ex.itemId);
      });
    });
    var mocksUnits = allUnits().filter(function (u) { return u.kind === 'mock'; });
    assert.deepEqual(mocksUnits.map(function (u) { return u.mock; }), ['x:n5-mock-1', 'x:n5-mock-2'], 'the two full mocks are plan units');
  });

  QUnit.test('mockSteps: start and between screens show three steps with the right state and copy', function (assert) {
    var secs = mockSections(CATALOG.items['x:n5-mock-1']);
    var states = function (m) { return m.steps.map(function (s) { return s.state; }).join(); };
    var intro = mockSteps(secs, 'intro', 0);
    assert.equal(states(intro), 'live,later,later');
    assert.equal(intro.label, 'Three parts, one at a time');
    assert.deepEqual(intro.steps.map(function (s) { return s.side; }), ['Start part 1', 'Starts after part 1', 'Starts after part 2']);
    var b1 = mockSteps(secs, 'between', 1);
    assert.equal(states(b1), 'done,live,later');
    assert.equal(b1.label, 'Part 1 done');
    assert.deepEqual(b1.steps.map(function (s) { return s.side; }), ['Done', 'Start part 2', 'Starts after part 2']);
    assert.equal(b1.note, 'Rest if you need to. The clock for part 2 starts when you press Start.');
    var b2 = mockSteps(secs, 'between', 2);
    assert.equal(states(b2), 'done,done,live');
    assert.equal(b2.steps[2].side, 'Start part 3');
  });

  QUnit.test('mock sections carry furigana markup next to the plain name', function (assert) {
    mockSections(CATALOG.items['x:n5-mock-1']).forEach(function (s) {
      assert.equal(stripRuby(s.nameF), s.name, s.key);
    });
  });
});
