"use strict";

// Mock exams, timed quizzes and prep drills (ticket 18, Q36-Q39).
QUnit.module('mock exams', function () {
  var mocks = function () { return catalogOf('mock'); };
  var text = function (parts) { return parts.map(function (p) { return p.t; }).join(''); };
  var stripRuby = function (s) { return s.replace(/\[([^|\]]+)\|[^\]]*\]/g, '$1'); };
  var isPerm = function (o, n) { return Array.isArray(o) && o.length === n && o.slice().sort().join() === Array.from({ length: n }, function (_, i) { return i; }).join(); };
  // what a fixed question refers to, for "no item twice" checks
  var qKey = function (q) { return [q.m, q.s || q.f || q.item || q.p || q.l, q.w || q.blank || q.q || ''].join(' '); };

  // Official section minutes (jlpt.jp/e/guideline/testsections.html, since 2020).
  var OFFICIAL_MINUTES = { N5: [20, 40, 30], N4: [25, 55, 35] };
  var mockLevels = function () { return LEVELS.filter(function (lv) { return mocks().some(function (m) { return m.level === lv; }); }); };

  QUnit.test('pace × blueprint gives the official minutes at every level with a pace table', function (assert) {
    Object.keys(OFFICIAL_MINUTES).forEach(function (lv) {
      assert.deepEqual(mockMinutes(lv), OFFICIAL_MINUTES[lv], lv);
      assert.ok(MOCK_PACE[lv] && MOCK_BLUEPRINT[lv] && JLPT_PASS[lv], lv + ' has pace, blueprint and pass rule');
    });
    assert.deepEqual(mockWeights('N4'), { vocab: 28, grammar: 21, reading: 8 }, 'N4 scoring weights');
    assert.strictEqual(levelTable(MOCK_PACE, 'N2'), MOCK_PACE.N4, 'a level without a table uses the nearest easier one');
    assert.strictEqual(levelTable(MOCK_PACE, undefined), MOCK_PACE.N5, 'no level = N5');
  });

  QUnit.test('every mock follows its blueprint: questions per mondai, 3 sections, the level\'s real timing', function (assert) {
    assert.ok(mockLevels().indexOf('N5') >= 0, 'N5 has mocks');
    mockLevels().forEach(function (lv) {
      var l = lv.toLowerCase();
      assert.deepEqual(mocks().filter(function (m) { return m.level === lv; }).map(function (m) { return m.id + ' ' + m.format; }),
        ['x:' + l + '-mock-1 full', 'x:' + l + '-mock-2 full'], lv + ' mocks');
      var full = mockSections(CATALOG.items['x:' + l + '-mock-1']).map(function (s) { return s.seconds / 60; });
      assert.deepEqual(full, OFFICIAL_MINUTES[lv], lv + ' full mock: ' + OFFICIAL_MINUTES[lv].join(' / ') + ' minutes');
    });
    mocks().forEach(function (m) {
      var bp = MOCK_BLUEPRINT[m.level][m.format];
      MOCK_SECTIONS.forEach(function (s) {
        var got = {};
        m.sections[s.key].forEach(function (q) { var k = mondaiKey(q); got[k] = (got[k] || 0) + 1; });
        assert.deepEqual(got, bp[s.key], m.id + ' ' + s.key);
      });
    });
  });

  // Passages, listening items and authored mondai belong to the mock's level; words and sentences
  // may come from an easier level (an N4 test still uses N5 words).
  QUnit.test('every reference exists, fits the mock\'s level and is of the right kind; nothing twice in a mock', function (assert) {
    var errs = [];
    var need = function (m, id, kind) {
      var it = CATALOG.items[id];
      if (!it || it.kind !== kind) errs.push(m.id + ': ' + id + ' is not a ' + kind);
      else if (kind === 'vocab' || kind === 'sentence' ? levelRank(it.level) > levelRank(m.level) : it.level !== m.level) errs.push(m.id + ': ' + id + ' is ' + it.level);
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
    assert.ok(ids['p:n5-bakery'] && ids['l:n5-where-box'] && ids['m:n5-iikae-kurai'] && ids['s:tatoeba:10901910'], 'mockItemIds covers passages, listening, mondai and sentences');
    // N5 r2 exam T1: no lesson, review or drill quiz asks a sentence a mock asks
    var used = [];
    allUnits().filter(function (u) { return u.level === 'N5' && u.kind !== 'mock' && u.kind !== 'kana'; }).forEach(function (u) {
      for (var r = 0; r < 3; r++) (u.kind === 'prep' ? prepDrill(u) : buildExercises(u)).forEach(function (ex) { if (ex.sentence && ids[ex.sentence]) used.push(u.id + ' ' + ex.form + ' ' + ex.sentence); });
    });
    assert.deepEqual(used.slice(0, 10), [], 'mock sentences asked elsewhere');
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
            if (!Array.from(w.word).filter(hasKanji).every(function (c) { return CATALOG.items['k:' + c] && levelRank(CATALOG.items['k:' + c].level) <= levelRank(m.level); })) e(m, q, 'tests a kanji above ' + m.level);
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

  // A later stem must not print the word an earlier 読み / 表記 question asks for.
  // ponytail: substring match, no tokenizer; so single-kanji spellings and 1-2 kana readings are skipped
  // (人, き, いま sit inside other words everywhere). Add a tokenizer if short answers need guarding.
  // N5 r1 newbie N3: a mock printed 彼はあまり本を読まない. A stem sentence holding a word the
  // course never teaches (lib.js OFF_CATALOG) is a leak on a graded test.
  QUnit.test('no mock stem sentence holds a word the course never teaches', function (assert) {
    var bad = [];
    mocks().forEach(function (m) {
      ['vocab', 'grammar'].forEach(function (k) {
        m.sections[k].forEach(function (q, i) { var s = q.s && CATALOG.items[q.s]; if (s && offCatalog(s)) bad.push(m.id + ' ' + k + ' Q' + (i + 1) + ' ' + s.jp); });
      });
    });
    assert.deepEqual(bad, []);
  });

  QUnit.test('no tested word shows up in another question of the same mock', function (assert) {
    var errs = [], shown = function (parts) { return (parts || []).map(function (p) { return p.t + (p.r || ''); }).join(''); };
    mocks().forEach(function (m) {
      var all = [];
      ['vocab', 'grammar'].forEach(function (k) {
        m.sections[k].forEach(function (q, i) { all.push({ q: q, ex: mockSections(m).filter(function (s) { return s.key === k; })[0].questions[i] }); });
      });
      all.forEach(function (a, ai) {
        if (!a.q.w) return;
        var ans = a.ex.options[a.ex.correct];
        if (ans.length < (a.q.m === 'hyouki' ? 2 : 3)) return;
        all.forEach(function (b, bi) {
          var stem = shown(b.ex.parts) + shown(b.ex.passageParts) + shown(b.ex.passage);
          if (bi !== ai && stem.indexOf(ans) >= 0) errs.push(m.id + ' Q' + (ai + 1) + ' ' + ans + ' shown in Q' + (bi + 1));
        });
      });
    });
    assert.deepEqual(errs, []);
  });

  // N4 r1 exam T2: options print words too (びょうき in an 言い換え option gave away a 漢字読み key; the 用法 word
  // おくれる gave away a 文脈規定 key). Inside one section, no 漢字読み / 表記 / 文脈規定 key shows in another question's
  // stem or options, and no 文法形式 key in another question's stem or ★ pieces. Short keys skipped as above.
  QUnit.test('no key shows in another question\'s stem or options in its section (N4 r1 exam T2)', function (assert) {
    var errs = [], txt = function (parts) { // the text and the text read through its ruby ([広|ひろ]い shows ひろい)
      parts = parts || [];
      return parts.map(function (p) { return p.t; }).join('') + ' ' + parts.map(function (p) { return p.r || p.t; }).join('');
    };
    // ponytail: N4 and up; the N5 mocks belong to the N5 audit
    mocks().filter(function (m) { return levelRank(m.level) >= 1; }).forEach(function (m) {
      mockSections(m).forEach(function (s) {
        s.questions.forEach(function (ex, i) {
          var q = m.sections[s.key][i];
          if (!/^(kanjiYomi|hyouki|bunmyaku|gap)$/.test(q.m || '')) return;
          var ans = ex.options[ex.correct];
          if (ans.length < (q.m === 'hyouki' || q.m === 'gap' ? 2 : 3)) return;
          s.questions.forEach(function (b, bi) {
            if (bi === i) return;
            var qb = m.sections[s.key][bi], opts = (b.options || []).join(' ') + (b.optionParts || []).map(txt).join(' ') + (b.items || []).join(' ');
            if (q.m === 'gap' && qb.m !== 'order') return; // grammar keys are function words: only a ★ piece gives one away
            var hay = q.m === 'gap' ? opts : txt(b.parts) + txt(b.passageParts) + (typeof b.question === 'string' ? b.question : '') + ' ' + opts;
            if (hay.indexOf(ans) >= 0) errs.push(m.id + ' ' + s.key + ' Q' + (i + 1) + ' ' + ans + ' shown in Q' + (bi + 1));
          });
        });
      });
    });
    assert.deepEqual(errs, []);
  });

  // N5 r1 exam T2: the learner moves freely inside a part, so a kanji a 表記 question asks for must not be
  // printed in an earlier question of the same section (名前 in Q3 gave away 前 in Q10). Char level: the
  // short spellings the test above skips are exactly the ones at risk.
  QUnit.test('no 表記 answer kanji is printed in an earlier question of its section', function (assert) {
    var errs = [];
    mocks().forEach(function (m) {
      mockSections(m).forEach(function (s) {
        s.questions.forEach(function (ex, i) {
          var q = m.sections[s.key][i];
          if (q.m !== 'hyouki') return;
          var ks = Array.from(CATALOG.items[q.w].word).filter(hasKanji);
          s.questions.slice(0, i).forEach(function (b, bi) {
            var stem = (b.parts || []).concat(b.passageParts || []).map(function (p) { return p.t; }).join('') + (b.optionParts ? '' : (b.options || []).join(''));
            ks.forEach(function (k) { if (stem.indexOf(k) >= 0) errs.push(m.id + ' ' + s.key + ' Q' + (i + 1) + ' ' + k + ' shown in Q' + (bi + 1)); });
          });
        });
      });
    });
    assert.deepEqual(errs, []);
  });

  // N5 r1 exam T3: with every fake one sound off the key, the key was the option the other three orbit
  // (smallest total edit distance) in 56% of the authored 漢字読み items. Square fakes (two one-edit fakes plus
  // both edits) tie all four; the generated drill already does this (squareFakes).
  QUnit.test('漢字読み: the key is the unique "centre" option in at most 35% of mock items', function (assert) {
    var n = 0, centre = 0;
    mocks().forEach(function (m) {
      m.sections.vocab.filter(function (q) { return q.m === 'kanjiYomi'; }).forEach(function (q) {
        var d = q.o.map(function (o) { return q.o.reduce(function (s, p) { return s + editDistance(o, p); }, 0); });
        var min = Math.min.apply(null, d);
        n++;
        if (d[q.a] === min && d.filter(function (x) { return x === min; }).length === 1) centre++;
      });
    });
    assert.ok(n >= 18, n + ' 漢字読み items');
    assert.ok(centre / n <= 0.35, centre + ' / ' + n + ' keys are the centre');
  });

  QUnit.test('every full mock has a katakana 表記 item: hiragana shown, wrong katakana as distractors', function (assert) {
    var words = {};
    catalogOf('vocab').forEach(function (v) { words[v.word] = true; });
    mocks().filter(function (m) { return m.format === 'full'; }).forEach(function (m) {
      var qs = m.sections.vocab.filter(function (q) { return q.m === 'hyouki' && !hasKanji(CATALOG.items[q.w].word); });
      assert.ok(qs.length >= 1, m.id + ' has a katakana hyouki');
      qs.forEach(function (q) {
        var ex = mockQuestion(q, levelKanji(m.level)), u = ex.parts.filter(function (p) { return p.u; })[0];
        assert.ok(/^[ぁ-ゖー]+$/.test(u.t), m.id + ' underline in hiragana: ' + u.t);
        q.o.forEach(function (o, i) {
          assert.ok(/^[ァ-ヶー]+$/.test(o), m.id + ' katakana option ' + o);
          if (i !== q.a) assert.notOk(words[o], m.id + ' distractor ' + o + ' is not a real word');
        });
      });
    });
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
    assert.deepEqual(mockEstimate(p(0.4, 0.4, 0.4, 0.5), 'N5'), under, 'level N5 = the default');
  });

  QUnit.test('mockEstimate / mockOutlook / mockTrend at N4: weights 28 / 21 / 8, pass mark 90', function (assert) {
    var p = function (v, g, r, l) { return { vocab: v, grammar: g, reading: r, listening: l }; };
    assert.strictEqual(mockEstimate(p(1, 0, 0, 0), 'N4').lkr, Math.round(120 * 28 / 57), 'vocab weight 28 of 57');
    assert.strictEqual(mockEstimate(p(0, 0, 1, 0), 'N4').lkr, Math.round(120 * 8 / 57), 'reading weight 8 of 57');
    var edge = mockEstimate(p(0.5, 0.5, 0.5, 0.6), 'N4');
    assert.deepEqual([edge.total, edge.passed], [96, true], '96 passes N4');
    var n5pass = mockEstimate(p(0.45, 0.45, 0.45, 0.45), 'N4');
    assert.deepEqual([n5pass.total, n5pass.passed], [81, false], '81 would pass N5 but not N4 (90)');
    assert.ok(mockEstimate(p(0.45, 0.45, 0.45, 0.45), 'N5').passed);
    var parts = function (v, g, r, l) { return { vocab: v, grammar: g, reading: r, listening: l }; };
    assert.strictEqual(mockOutlook(parts([14, 14], [10, 10], [8, 8], [14, 14]), 'N4').verdict, 'likely');
    var half = mockOutlook(parts([7, 14], [5, 10], [4, 8], [7, 14]), 'N4');
    assert.notStrictEqual(half.verdict, 'likely', 'half right is not a likely N4 pass (90 of 180)');
    assert.strictEqual(mockTrend([], 'N4').pass, 90, 'N4 pass line');
  });

  // ── range + verdict (ticket 48, research: .scratch/roadmap/research/jlpt-scoring.md §6) ──
  QUnit.test('wilson: 80% score interval, sane at the edges and with no data', function (assert) {
    var r = function (a) { return a.map(function (x) { return Math.round(x * 100) / 100; }); };
    assert.deepEqual(r(wilson(7, 10)), [0.5, 0.85], '7 of 10');
    assert.deepEqual(r(wilson(0, 10)), [0, 0.14]);
    assert.deepEqual(r(wilson(10, 10)), [0.86, 1]);
    assert.deepEqual(wilson(0, 0), [0, 1], 'nothing asked: anything is possible');
  });

  QUnit.test('mockOutlook: scaled ranges around the estimate and a 3-way verdict', function (assert) {
    var parts = function (v, g, r, l) { return { vocab: v, grammar: g, reading: r, listening: l }; };
    var perfect = mockOutlook(parts([6, 6], [10, 10], [4, 4], [11, 11]), 'N5');
    assert.strictEqual(perfect.verdict, 'likely', 'a perfect mock clears every mark even at the low end');
    assert.strictEqual(perfect.total[1], 180, 'upper end capped at the maximum');
    var none = mockOutlook(parts([0, 6], [0, 10], [0, 4], [0, 11]), 'N5');
    assert.strictEqual(none.verdict, 'unlikely');
    assert.strictEqual(none.total[0], 0);
    var mid = mockOutlook(parts([3, 6], [5, 10], [2, 4], [6, 11]), 'N5');
    assert.strictEqual(mid.verdict, 'borderline', 'about half right on a short test can go either way');
    [perfect, none, mid].forEach(function (o) {
      assert.ok(o.lkr[0] <= o.lkr[1] && o.listening[0] <= o.listening[1] && o.total[0] <= o.total[1], 'ordered ranges');
      assert.strictEqual(o.total[0], o.lkr[0] + o.listening[0], 'total range = sum of section ranges');
      assert.strictEqual(o.total[1], o.lkr[1] + o.listening[1]);
    });
    var est = mockEstimate({ vocab: 0.5, grammar: 0.5, reading: 0.5, listening: 6 / 11 });
    assert.ok(mid.total[0] <= est.total && est.total <= mid.total[1], 'the point estimate sits inside the range');
    // one weak section is enough to rule a pass out: listening 0 of 11 cannot reach 19, whatever the total
    var noListening = mockOutlook(parts([100, 100], [100, 100], [100, 100], [0, 11]), 'N5');
    assert.strictEqual(noListening.verdict, 'unlikely', 'upper end of listening misses its minimum');
    // not likely on the low end of a section minimum, but not out either: borderline
    var wobble = mockOutlook(parts([100, 100], [100, 100], [100, 100], [4, 11]), 'N5');
    assert.strictEqual(wobble.verdict, 'borderline', 'lower listening bound under 19, score and upper bound above it');
    // N5 r2 newbie N4: a score under a section minimum fails the test, whatever the range's top
    var under = mockOutlook(parts([100, 100], [100, 100], [100, 100], [3, 11]), 'N5');
    assert.strictEqual(under.verdict, 'unlikely', 'listening 3 of 11 scores 16, under 19');
    assert.deepEqual(under.marks, ['the listening minimum of 19'], 'names the missed minimum');
    // N5 r1 newbie N15: the headline names the mark that decides
    assert.deepEqual(wobble.marks, ['the listening minimum of 19'], 'borderline names only the crossed mark');
    assert.deepEqual(noListening.marks, ['the listening minimum of 19'], 'unlikely names the missed minimum');
    assert.deepEqual(perfect.marks, []);
    assert.ok(none.marks.length === 3, none.marks.join());
  });

  // ── attempts + trend (ticket 49): mock docs are write-once, so "practice" is derived from takenAt order ──
  QUnit.test('mock attempts: the first sitting of a mock counts, later ones of the same mock are practice', function (assert) {
    var doc = function (id, at, total) { return { mockId: id, takenAt: at, estimate: { total: total, passed: total >= 80 } }; };
    var snapshotOrder = [doc('x:n5-mock-1', 50, 120), doc('x:n5-mock-2', 40, 90), doc('x:n5-mock-1', 30, 100), doc('x:n5-mock-1', 10, 60)]; // newest first
    var at = mockAttempts(snapshotOrder);
    assert.deepEqual(at.map(function (a) { return a.doc.takenAt + ':' + a.n + (a.practice ? 'p' : ''); }), ['10:1', '30:2p', '40:1', '50:3p'], 'oldest first, numbered per mock');
    assert.strictEqual(mockHeadline(snapshotOrder, 'x:n5-mock-1').estimate.total, 60, 'headline = the first attempt, not the latest or the best');
    assert.strictEqual(mockHeadline(snapshotOrder, 'x:n5-mock-9'), null);
    assert.ok(mockIsPractice(snapshotOrder, snapshotOrder[0]) && mockIsPractice(snapshotOrder, snapshotOrder[2]) && !mockIsPractice(snapshotOrder, snapshotOrder[3]) && !mockIsPractice(snapshotOrder, snapshotOrder[1]));
    // a result not saved yet (just finished) is judged against the saved ones
    assert.ok(mockIsPractice(snapshotOrder, doc('x:n5-mock-2', 99, 50)) && !mockIsPractice(snapshotOrder, doc('x:n5-mock-9', 99, 50)));
    assert.deepEqual(mockTrend(snapshotOrder, 'N5').points.map(function (p) { return [p.total, p.practice]; }), [[60, false], [100, true], [90, false], [120, true]], 'one point per attempt');
    assert.strictEqual(mockTrend(snapshotOrder, 'N5').pass, 80, 'the pass line');
    assert.deepEqual(mockTrend([], 'N5').points, []);
  });

  QUnit.test('mockResult: right / total per part and per mondai; unanswered counts wrong', function (assert) {
    var m = CATALOG.items['x:n5-mock-1'], secs = mockSections(m), answers = {};
    secs.forEach(function (s) { answers[s.key] = s.questions.map(function (ex) { return ex.correct; }); });
    var all = mockResult(m, secs, answers, 1000);
    assert.deepEqual(all.estimate, { lkr: 120, listening: 60, total: 180, passed: true });
    assert.deepEqual(all.parts.reading, [5, 5], 'reading counted apart from grammar');
    assert.deepEqual(all.parts.grammar, [17, 17]);
    assert.deepEqual(all.byMondai.kanjiYomi, [7, 7]);
    answers.listening = answers.listening.map(function () { return null; }); // ran out of time
    answers.vocab[0] = (answers.vocab[0] + 1) % 4;
    var r = mockResult(m, secs, answers, 2000);
    assert.deepEqual(r.parts.listening, [0, 24]);
    assert.deepEqual(r.byMondai.kanjiYomi, [6, 7]);
    assert.ok(!r.estimate.passed && r.estimate.listening === 0, 'no listening, no pass');
    assert.strictEqual(r.mockId, 'x:n5-mock-1');
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
    assert.strictEqual(quizSeconds([ex('kanji_yomi', 'kanjiYomi'), ex('gap', 'gap'), ex('reading', 'reading'), ex('listen_dialog', 'listening')], 'N4'),
      Math.round(1500 / 28 + 60 + 255 + 75), 'N4 pace');
    assert.strictEqual(quizSeconds([ex('youhou', 'youhou')], 'N4'), Math.round(1500 / 28), '用法 at the vocabulary pace');
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
        if (ex.form === 'bunmyaku' && ex.note && !ex.noteLater) assert.ok(false, u.id + ' bunmyaku shows its English up front');
      });
    });
    // N5 r2 newbie N5: the listening drill drew review items while fresh ones were left
    var inReview = {};
    allUnits().forEach(function (u) { if (u.kind === 'review') (u.listening || []).forEach(function (id) { inReview[id] = true; }); });
    var lu = allUnits().filter(function (u) { return u.id === 'n5.u109'; })[0];
    if (lu) {
      var used = prepDrill(lu).filter(function (ex) { return ex.type === 'listen_dialog'; });
      Object.keys(LISTEN_PROMPTS).forEach(function (f) {
        var mine = used.filter(function (ex) { return ex.format === f; }), rev = mine.filter(function (ex) { return inReview[ex.itemId]; }).length;
        var freshN = catalogOf('listening').filter(function (l) { return l.level === 'N5' && l.format === f && !ids[l.id] && !inReview[l.id]; }).length;
        assert.ok(rev <= Math.max(0, mine.length - freshN), 'u109 ' + f + ': ' + rev + ' review items of ' + mine.length + ', ' + freshN + ' fresh');
      });
    }
    // N4 r1 exam T4: the sentences a mock is built on (q.s) are mock items too, and no N4+ quiz asks them
    assert.ok(ids['s:tatoeba:10901517'] && ids['s:own:n4-hazu-ga-nai-shiranai'], 'mockItemIds covers the 漢字読み and ★ sentences');
    allUnits().filter(function (u) { return levelRank(u.level) >= 1 && u.kind !== 'mock'; }).forEach(function (u) {
      buildsOf(u, 2).forEach(function (ex) {
        if (ex.sentence && ids[ex.sentence]) assert.ok(false, u.id + ' ' + ex.form + ' asks mock sentence ' + ex.sentence);
      });
    });
    var mocksUnits = allUnits().filter(function (u) { return u.kind === 'mock'; });
    var want = [].concat.apply([], PLAN.map(function (p) { var l = p.level.toLowerCase(); return ['x:' + l + '-mock-1', 'x:' + l + '-mock-2']; }));
    assert.deepEqual(mocksUnits.map(function (u) { return u.mock; }), want, 'the two full mocks of each planned level are plan units');
  });

  // N5 r1 newbie N6: u106 Q3 printed つくえの上に本やノートがあります, Q8 asked ノート; 父 was the key twice.
  QUnit.test('prep drills, 4 seeded builds: no key shows in another question, no sentence or 表記 kanji twice', function (assert) {
    var rnd = Math.random, x = 7, bad = [];
    Math.random = function () { x = (x * 1664525 + 1013904223) % 4294967296; return x / 4294967296; };
    var stem = function (ex) { return (ex.parts || ex.passageParts || []).map(function (p) { return p.t + (p.r || ''); }).join('') + (typeof ex.question === 'string' ? ex.question : ''); };
    try {
      allUnits().filter(function (u) { return u.kind === 'prep' && u.level === 'N5'; }).forEach(function (u) {
        for (var r = 0; r < 4; r++) {
          var exs = prepDrill(u), sents = {};
          exs.forEach(function (ex, i) {
            if (ex.sentence) { if (sents[ex.sentence]) bad.push(u.id + ' sentence twice ' + ex.sentence); sents[ex.sentence] = 1; }
            var key = ex.options[ex.correct];
            var ks = ex.form === 'hyouki' ? key.split('').filter(function (c) { return /[\u4e00-\u9faf]/.test(c); }) : key.length > 1 ? [key] : [];
            exs.forEach(function (o, j) {
              if (j === i || (o.passageParts && o.passageParts === ex.passageParts)) return;
              // later passages count too (N5 r2 exam T5)
              ks.forEach(function (k) { if (stem(o).indexOf(k) >= 0) bad.push(u.id + ' Q' + (i + 1) + ' key ' + k + ' in Q' + (j + 1)); });
            });
            if (ex.form === 'hyouki') ks.forEach(function (k) { // its own stem: 【いく】か行かないか
              if (ex.parts.some(function (p) { return !p.u && p.t.indexOf(k) >= 0; })) bad.push(u.id + ' Q' + (i + 1) + ' own stem shows ' + k);
            });
          });
        }
      });
    } finally { Math.random = rnd; }
    assert.deepEqual(bad.filter(function (b, i) { return bad.indexOf(b) === i; }), []);
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
