"use strict";

// Achievement engine (ticket 08): the list, every rule, unlock docs, batching.
// Fixtures are built from the real N5 catalog + plan.
QUnit.module('achievements', function () {
  var UNITS_ = buildUnits(PLAN, CATALOG).filter(liveUnit); // the shipped levels, as the app sees them
  var CTX = function (now) { return { units: UNITS_, catalog: CATALOG, now: now || at(2026, 6, 1) }; };
  function at(y, m, d, h, mi) { return new Date(y, m - 1, d, h === undefined ? 12 : h, mi || 0).getTime(); }
  function ids(res) { return res.map(function (r) { return r.id; }); }
  function earned(docs, unlocked, now) { return ids(evaluateAchievements(docs, unlocked || {}, CTX(now))); }

  var EXPECTED = ['first-steps', 'units-10', 'units-25', 'units-50', 'units-100', 'hiragana-blitz', 'completionist',
    'n5-all-lessons', 'n5-all-reviews', 'n5-prep', 'n5-clear', 'n5-hiragana', 'n5-katakana',
    'streak-4', 'streak-7', 'streak-30', 'streak-100', 'streak-365', 'study-days-30', 'study-days-100', 'study-days-200',
    'double-feature', 'hat-trick', 'binge', 'comeback', 'early-bird', 'night-owl', 'new-year',
    'first-quiz', 'first-perfect', 'perfect-10', 'perfect-50', 'ippatsu', 'redemption-arc', 'n5-quiz-sweep',
    'mock-sittings-5', 'mock-sittings-15', 'n5-diagnostic', 'n5-mock-sat', 'n5-mock-pass', 'n5-mock-pass-all', 'n5-mock-honors', 'n5-mock-perfect', 'n5-mock-balanced',
    'first-review', 'reviews-100', 'reviews-1000', 'reviews-5000', 'review-day-50', 'review-day-100', 'mature-1', 'mature-100', 'mature-500', 'interval-365', 'import-first', 'import-proved',
    'kanji-mature-25', 'kanji-mature-50', 'hiragana-mastered', 'katakana-mastered', 'n5-vocab-mature', 'n5-kanji-mature', 'n5-grammar-mature', 'n5-all-mature'];

  // Level template rows a later level (N4+) instantiates, when it has the unit kinds / mocks for them.
  var TEMPLATE = ['all-lessons', 'all-reviews', 'prep', 'clear', 'quiz-sweep', 'diagnostic', 'mock-sat', 'mock-pass', 'mock-pass-all',
    'mock-honors', 'mock-perfect', 'mock-balanced', 'vocab-mature', 'kanji-mature', 'grammar-mature', 'all-mature'];
  var laterLevels = PLAN.map(function (p) { return p.level; }).filter(function (lv) { return lv !== 'N5'; });
  // N4-only rows after the template (.scratch/n4-launch/achievements-n4.md), in list order.
  var N4_EXTRAS = ['first', 'keigo', 'voice', 'conditionals', 'giving', 'mock-ears', 'diag-first', 'speedrun'];
  var levelRow = function (lv, id) {
    var l = lv.toLowerCase(), t = id.replace(l + '-', '');
    return id.indexOf(l + '-') === 0 && (TEMPLATE.indexOf(t) >= 0 || (lv === 'N4' && N4_EXTRAS.indexOf(t) >= 0));
  };
  // N4 stand-in: the N5 plan relabelled (every template row) plus lessons teaching the N4 grammar the
  // extras name, and three N4 mocks (the real N4 plan has no mocks or prep yet, so it can't reach every row).
  var G = function (ids) { return ids.map(function (id) { return CATALOG.items[id]; }); };
  var N4U = UNITS_.map(function (u) { return Object.assign({}, u, { id: u.id.replace('n5.', 'n4.'), level: 'N4' }); }).concat([
    { id: 'n4.k1', level: 'N4', kind: 'lesson', grammar: G(['g:sonkeigo-verbs', 'g:o-ni-naru', 'g:o-kudasai']) },
    { id: 'n4.k2', level: 'N4', kind: 'lesson', grammar: G(['g:o-suru', 'g:itasu', 'g:gozaimasu']) },
    { id: 'n4.v1', level: 'N4', kind: 'lesson', grammar: G(['g:passive', 'g:causative', 'g:causative-passive']) },
    { id: 'n4.c1', level: 'N4', kind: 'lesson', grammar: G(['g:to-conditional', 'g:tara', 'g:ba', 'g:nara', 'g:te-ageru', 'g:te-kureru', 'g:te-morau']) }]);
  var N4CAT = { items: Object.assign({}, CATALOG.items) };
  ['x:n4-mock-1', 'x:n4-mock-2', 'x:n4-mock-3'].forEach(function (id, i) { N4CAT.items[id] = { id: id, kind: 'mock', level: 'N4', format: i < 2 ? 'full' : 'diagnostic' }; });
  var N4ROWS = levelAchievements('N4', N4U, N4CAT);

  QUnit.test('the list matches the approved draft: ids, categories, rarities, hidden', function (assert) {
    var n5List = ACHIEVEMENTS.filter(function (a) { return !a.level || a.level === 'N5'; });
    var tally = function (key) { var o = {}; n5List.forEach(function (a) { o[a[key]] = (o[a[key]] || 0) + 1; }); return o; };
    assert.deepEqual(n5List.map(function (a) { return a.id; }).sort(), EXPECTED.slice().sort());
    assert.equal(n5List.length, 64);
    assert.deepEqual(tally('category'), { progress: 13, habit: 15, quiz: 7, mock: 9, review: 12, mastery: 8 });
    assert.deepEqual(tally('rarity'), { common: 15, uncommon: 20, rare: 17, epic: 7, legendary: 5 });
    assert.deepEqual(n5List.filter(function (a) { return a.hidden; }).map(function (a) { return a.id; }).sort(),
      ['comeback', 'completionist', 'early-bird', 'hiragana-blitz', 'new-year', 'night-owl', 'redemption-arc']);
    // a level still being built (ready: false) is out of ACHIEVEMENTS; check its rows as they will ship
    var PLANNED = achievementDefs(buildUnits(PLAN, CATALOG), CATALOG);
    PLANNED.forEach(function (a) {
      assert.ok(a.name && a.desc && ACH_CATEGORIES[a.category], a.id + ' has text and a known category');
      assert.equal(a.hidden ? !!a.revealed : !a.revealed, true, a.id + ': revealed text only on hidden rows');
    });
    assert.equal(new Set(PLANNED.map(function (a) { return a.name; })).size, PLANNED.length, 'names are unique');
    // every later planned level adds only template rows, ids <lvl>-<template> (N4 also its extras)
    laterLevels.forEach(function (lv) {
      var rows = PLANNED.filter(function (a) { return a.level === lv; });
      assert.ok(rows.length >= 4, lv + ' template rows');
      rows.forEach(function (a) { assert.ok(levelRow(lv, a.id), a.id); });
    });
    assert.equal(ACHIEVEMENTS.length - n5List.length, ACHIEVEMENTS.filter(function (a) { return laterLevels.indexOf(a.level) >= 0; }).length, 'nothing else');
    assert.equal(PLANNED.length - n5List.length, PLANNED.filter(function (a) { return laterLevels.indexOf(a.level) >= 0; }).length, 'nothing else once every level ships');
  });

  QUnit.test('N4 rows: ids n4-*, their own pun names (no "(N4)" placeholder, no "N5")', function (assert) {
    var n4 = N4U, rows = N4ROWS;
    assert.deepEqual(rows.map(function (r) { return r.id; }), TEMPLATE.concat(N4_EXTRAS).map(function (t) { return 'n4-' + t; }), 'every template row, then the extras, no kana rows');
    var n5Names = levelAchievements('N5', UNITS_, CATALOG).map(function (r) { return r.name; });
    var globalNames = globalAchievements().map(function (r) { return r.name; });
    rows.forEach(function (r) {
      assert.ok(!/\(N4\)|N5/.test(r.name), r.id + ': ' + r.name);
      assert.ok(n5Names.indexOf(r.name) < 0, r.id + ' differs from its N5 name');
      assert.ok(globalNames.indexOf(r.name) < 0, r.id + ' does not reuse a level-independent name');
      assert.ok((r.desc + r.revealed).indexOf('N4') >= 0, r.id + ' desc names the level: ' + r.desc);
      assert.equal(r.hidden ? !!r.revealed : !r.revealed, true, r.id + ': revealed text only on hidden rows');
    });
    var extras = rows.slice(TEMPLATE.length), tally = function (key) { var o = {}; extras.forEach(function (a) { o[a[key]] = (o[a[key]] || 0) + 1; }); return o; };
    assert.deepEqual(tally('rarity'), { common: 1, uncommon: 3, rare: 3, epic: 1 }, 'extras by effort');
    assert.deepEqual(tally('category'), { progress: 4, mastery: 2, mock: 2 });
    assert.deepEqual(extras.filter(function (r) { return r.hidden; }).map(function (r) { return r.id; }), ['n4-diag-first', 'n4-speedrun'], 'hidden only for surprises');
    // a plan that doesn't teach the grammar (or lacks the mocks) doesn't get those rows, never unearnable ones
    var bare = levelAchievements('N4', UNITS_.map(function (u) { return Object.assign({}, u, { level: 'N4' }); }), CATALOG).map(function (r) { return r.id; });
    ['n4-keigo', 'n4-voice', 'n4-conditionals', 'n4-giving'].forEach(function (id) { assert.ok(bare.indexOf(id) < 0, id + ' needs its grammar'); }); // the mock rows key on the catalog's N4 mocks, which now exist
    var partKeigo = levelAchievements('N4', N4U.filter(function (u) { return u.id !== 'n4.k2'; }), N4CAT).map(function (r) { return r.id; });
    assert.ok(partKeigo.indexOf('n4-keigo') < 0, 'keigo row needs every keigo point taught');
    // the real N4 plan teaches every point the extras name (the mock rows wait for the N4 mocks)
    var real = levelAchievements('N4', buildUnits(PLAN, CATALOG), CATALOG).map(function (r) { return r.id; });
    ['n4-first', 'n4-keigo', 'n4-voice', 'n4-conditionals', 'n4-giving', 'n4-speedrun', 'n4-mock-ears', 'n4-diag-first'].forEach(function (id) { assert.ok(real.indexOf(id) >= 0, id + ' on the real N4 plan'); });
    assert.equal(new Set(rows.map(function (r) { return r.name; })).size, rows.length, 'N4 names unique');
    assert.ok(/\(N3\)$/.test(levelAchievements('N3', n4.map(function (u) { return Object.assign({}, u, { level: 'N3' }); }), CATALOG)[0].name), 'N3 keeps the placeholder until written');
  });

  QUnit.test('N5 template values match the draft (74 lessons, 15 reviews, 5 prep, 112 units, 110 quizzed)', function (assert) {
    var rows = achievementList([], {}, CTX());
    var goal = function (id) { return rows.filter(function (r) { return r.id === id; })[0].progress[1]; };
    assert.equal(goal('n5-all-lessons'), 74);
    assert.equal(goal('n5-all-reviews'), 15);
    assert.equal(goal('n5-prep'), 5);
    assert.equal(goal('n5-clear'), 112);
    assert.equal(goal('n5-quiz-sweep'), 110);
    assert.equal(goal('n5-hiragana'), 10);
    assert.equal(goal('n5-katakana'), 8);
    assert.equal(goal('n5-all-mature'), 1078);
    assert.equal(goal('n5-vocab-mature'), 721);
    assert.equal(goal('n5-kanji-mature'), 79);
    assert.equal(goal('n5-grammar-mature'), 67);
    assert.equal(goal('hiragana-mastered'), 104);
    assert.equal(goal('katakana-mastered'), 107);
  });

  // ── fixtures ──
  function unitDoc(id, t) { return { _id: 'unit:' + id, done: true, completedAt: t, updatedAt: 1 }; }
  function cardDoc(it, over) {
    return Object.assign({ _id: 'card:' + it.id, id: it.id, type: it.kind, interval: 400, ease: 2.5, due: 1, reps: 6, lastReviewedAt: 5, updatedAt: 1 }, over);
  }
  function logDoc(date, body) { return Object.assign({ _id: 'log:' + date + ':d', date: date, lessons: [], quizzes: [], reviews: { count: 0, again: 0 }, updatedAt: 1, deviceId: 'd' }, body); }
  function ymd(d) { return localDate(d); }
  function quiz(unit, right, total, t, over) { return Object.assign({ unit: unit, right: right, total: total, at: t }, over); }
  function mockDoc(id, t, o) {
    var full = !o || !o.blank;
    var ans = { vocab: [0, 0, 0, 0], grammar: [0, 0, 0, 0], listening: [0, 0, 0, 0] };
    if (!full) ans = { vocab: [null, null, null, null], grammar: [null, null, null, null], listening: [null, null, null, null] };
    var parts = (o && o.parts) || { vocab: [21, 21], grammar: [17, 17], reading: [5, 5], listening: [24, 24] };
    var est = (o && o.estimate) || { lkr: 120, listening: 60, total: 180, passed: true };
    return { _id: 'mock:' + id + ':' + t, mockId: id, takenAt: t, parts: parts, byMondai: {}, answers: ans, estimate: est, updatedAt: 1 };
  }
  var QUIZZED = UNITS_.filter(function (u) { return u.kind !== 'mock'; });
  var NONHIRA = QUIZZED.filter(function (u) { return !(u.kana.length && u.kana.every(function (k) { return k.script === 'hiragana'; })); });
  var HIRA = UNITS_.filter(function (u) { return u.kana.length && u.kana.every(function (k) { return k.script === 'hiragana'; }); });

  // The "everything earned" world: proves every shipping rule is satisfiable (no softlock).
  function everything() {
    var docs = [], day0 = at(2025, 1, 1);
    UNITS_.forEach(function (u, i) {
      // five units finished on one day (binge), the rest on separate days
      docs.push(unitDoc(u.id, i < 5 ? at(2025, 1, 2, 9 + i) : day0 + i * 86400000));
    });
    unitItems(UNITS_).forEach(function (it, i) { docs.push(cardDoc(it, i < 30 ? { imported: { source: 'x', at: 1, batchId: 'b' } } : {})); });
    docs[docs.length - 1].interval = 400;
    var dayQuizzes = {};
    var put = function (date, q) { (dayQuizzes[date] = dayQuizzes[date] || []).push(q); };
    QUIZZED.forEach(function (u, i) {
      var t = HIRA.indexOf(u) >= 0 ? at(2025, 3, 3, 9, i) : at(2025, 4, 1, 8, i); // all hiragana units on 2025-03-03
      put(ymd(new Date(t)), quiz(u.id, u.id === NONHIRA[5].id ? 1 : 10, 10, t)); // one unit starts with a failure
    });
    // redemption: that unit gets a clean perfect on a later day
    put('2025-04-05', quiz(NONHIRA[5].id, 10, 10, at(2025, 4, 5, 9)));
    put('2025-04-06', quiz(QUIZZED[6].id, 10, 10, at(2025, 4, 6, 5, 30))); // early bird
    put('2025-04-07', quiz(QUIZZED[6].id, 10, 10, at(2025, 4, 7, 1, 0))); // night owl
    // streak block 2024-01-01 .. 2024-12-31 (366 days), a gap, then a comeback
    var d = new Date(2024, 0, 1);
    var logs = {};
    for (var n = 0; n < 366; n++) { logs[ymd(d)] = { reviews: { count: 20, again: 0 } }; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1); }
    logs['2024-12-30'].reviews.count = 100;
    logs['2025-03-03'] = logs['2025-03-03'] || {};
    Object.keys(dayQuizzes).forEach(function (k) { logs[k] = Object.assign(logs[k] || {}, { quizzes: dayQuizzes[k] }); });
    for (n = 0; n < 200; n++) { var dd = ymd(new Date(2023, 0, 1 + n)); logs[dd] = logs[dd] || { reviews: { count: 1, again: 0 } }; } // 200+ study days (2023: gap before 2024)
    Object.keys(logs).forEach(function (k) { docs.push(logDoc(k, logs[k])); });
    // mocks: full 1 and 2 (perfect first sitting), diagnostic, plus enough sittings for 15
    docs.push(mockDoc('x:n5-mock-1', at(2025, 5, 1)), mockDoc('x:n5-mock-2', at(2025, 5, 2)), mockDoc('x:n5-mock-3', at(2025, 5, 3)));
    for (n = 0; n < 13; n++) docs.push(mockDoc('x:n5-mock-3', at(2025, 5, 10 + n)));
    // first-attempt perfects for 25 units
    return docs;
  }

  QUnit.test('no softlock: a world that has done everything earns every shipping achievement', function (assert) {
    var got = earned(everything());
    var missing = EXPECTED.filter(function (id) { return got.indexOf(id) < 0; });
    assert.deepEqual(missing, [], 'unreachable: ' + missing.join(', '));
    assert.equal(got.length, 64);
    assert.equal(got[got.length - 1], 'completionist', 'completionist is last');
  });

  QUnit.test('an empty world earns nothing', function (assert) {
    assert.deepEqual(earned([]), []);
  });

  QUnit.test('every locked rule is individually blocked without its ingredient (one-removed worlds)', function (assert) {
    var all = everything();
    // drop all cards: no mastery / review-maturity rows, everything else still fires
    var noCards = all.filter(function (d) { return d._id.indexOf('card:') !== 0; });
    var got = earned(noCards);
    ['mature-1', 'n5-all-mature', 'kanji-mature-25', 'interval-365', 'import-first', 'completionist'].forEach(function (id) {
      assert.ok(got.indexOf(id) < 0, id + ' needs cards');
    });
    assert.ok(got.indexOf('streak-365') >= 0);
  });

  // ── import-exploit guard ──
  QUnit.test('"already known" import never counts as mature until really reviewed', function (assert) {
    var items = unitItems(UNITS_);
    var seeded = items.map(function (it) { return cardDoc(it, { interval: 25, reps: 2, lastReviewedAt: 0, imported: { source: 'x', at: 1, batchId: 'b' } }); });
    var got = earned(seeded);
    assert.deepEqual(got, ['import-first'], 'only the feature-use stamp');
    var one = seeded.slice();
    one[0] = Object.assign({}, one[0], { lastReviewedAt: 9, reps: 3 });
    assert.ok(earned(one).indexOf('mature-1') >= 0, 'a real review proves it');
    assert.ok(earned(one).indexOf('import-proved') < 0, '25 are needed');
    var many = seeded.map(function (c, i) { return i < 25 ? Object.assign({}, c, { lastReviewedAt: 9, reps: 3 }) : c; });
    assert.ok(earned(many).indexOf('import-proved') >= 0);
    // a card seeded then missed in review (reps reset) is not "proved"
    var missed = seeded.map(function (c, i) { return i < 25 ? Object.assign({}, c, { lastReviewedAt: 9, reps: 0, interval: 1 }) : c; });
    assert.ok(earned(missed).indexOf('import-proved') < 0);
  });
  QUnit.test('import does not touch unit achievements', function (assert) {
    var seeded = unitItems(UNITS_).map(function (it) { return cardDoc(it, { interval: 25, lastReviewedAt: 0, imported: { source: 'x' } }); });
    var got = earned(seeded);
    assert.ok(got.indexOf('first-steps') < 0 && got.indexOf('first-review') < 0);
  });

  // ── first-try-only and clean-perfect rules ──
  QUnit.test('ippatsu counts first attempts only; perfect-N counts distinct units', function (assert) {
    var qs = QUIZZED.slice(0, 25);
    var retries = qs.map(function (u, i) { return logDoc('2026-02-' + String(i + 1).padStart(2, '0'), { quizzes: [quiz(u.id, 3, 10, at(2026, 2, i + 1, 8)), quiz(u.id, 10, 10, at(2026, 2, i + 1, 9))] }); });
    var got = earned(retries);
    assert.ok(got.indexOf('ippatsu') < 0, 'failed first tries');
    assert.ok(got.indexOf('perfect-10') >= 0, 'retries still ace distinct units');
    var firsts = qs.map(function (u, i) { return logDoc('2026-02-' + String(i + 1).padStart(2, '0'), { quizzes: [quiz(u.id, 10, 10, at(2026, 2, i + 1, 8))] }); });
    assert.ok(earned(firsts).indexOf('ippatsu') >= 0);
    var same = logDoc('2026-02-01', { quizzes: QUIZZED.slice(0, 1).concat(QUIZZED.slice(0, 1), QUIZZED.slice(0, 1)).map(function (u, i) { return quiz(u.id, 10, 10, at(2026, 2, 1, 8 + i)); }) });
    assert.ok(earned([same]).indexOf('perfect-10') < 0, 'one unit aced three times is one unit');
  });
  QUnit.test('clean perfect: not with "I was right" overrides, not under 5 questions', function (assert) {
    var u = QUIZZED[0].id;
    assert.ok(earned([logDoc('2026-02-01', { quizzes: [quiz(u, 10, 10, at(2026, 2, 1), { overrides: 1 })] })]).indexOf('first-perfect') < 0);
    assert.ok(earned([logDoc('2026-02-01', { quizzes: [quiz(u, 4, 4, at(2026, 2, 1))] })]).indexOf('first-perfect') < 0);
    assert.ok(earned([logDoc('2026-02-01', { quizzes: [quiz(u, 5, 5, at(2026, 2, 1))] })]).indexOf('first-perfect') >= 0);
    assert.ok(earned([logDoc('2026-02-01', { quizzes: [quiz(u, 1, 10, at(2026, 2, 1))] })]).indexOf('first-quiz') >= 0, 'any finished quiz');
  });
  QUnit.test('redemption-arc: weak first attempt, perfect on a later date only', function (assert) {
    var u = QUIZZED[3].id;
    var sameDay = logDoc('2026-02-01', { quizzes: [quiz(u, 2, 10, at(2026, 2, 1, 8)), quiz(u, 10, 10, at(2026, 2, 1, 9))] });
    assert.ok(earned([sameDay]).indexOf('redemption-arc') < 0);
    var later = [logDoc('2026-02-01', { quizzes: [quiz(u, 2, 10, at(2026, 2, 1, 8))] }), logDoc('2026-02-03', { quizzes: [quiz(u, 10, 10, at(2026, 2, 3, 8))] })];
    assert.deepEqual(evaluateAchievements(later, {}, CTX()).filter(function (r) { return r.id === 'redemption-arc'; }), [{ id: 'redemption-arc', at: at(2026, 2, 3, 8) }]);
    var fine = [logDoc('2026-02-01', { quizzes: [quiz(u, 7, 10, at(2026, 2, 1, 8))] }), logDoc('2026-02-03', { quizzes: [quiz(u, 10, 10, at(2026, 2, 3, 8))] })];
    assert.ok(earned(fine).indexOf('redemption-arc') < 0, '70% first try is not a struggle');
  });
  QUnit.test('hiragana-blitz: passing entries on one local date, any attempt; fails and split days do not count', function (assert) {
    assert.equal(HIRA.length, 10);
    var pass = function (u, t) { return quiz(u.id, 10, 10, t); };
    var oneDay = logDoc('2026-02-01', { quizzes: HIRA.map(function (u, i) { return pass(u, at(2026, 2, 1, 8, i)); }) });
    assert.ok(earned([oneDay]).indexOf('hiragana-blitz') >= 0);
    var retry = logDoc('2026-02-01', { quizzes: [quiz(HIRA[0].id, 1, 10, at(2026, 2, 1, 7))].concat(HIRA.map(function (u, i) { return pass(u, at(2026, 2, 1, 8, i)); })) });
    assert.ok(earned([retry]).indexOf('hiragana-blitz') >= 0, 'a failed first try the same day is fine');
    var split = [logDoc('2026-02-01', { quizzes: HIRA.slice(0, 9).map(function (u, i) { return pass(u, at(2026, 2, 1, 8, i)); }) }),
      logDoc('2026-02-02', { quizzes: [pass(HIRA[9], at(2026, 2, 2, 8))] })];
    assert.ok(earned(split).indexOf('hiragana-blitz') < 0);
    // a kana quiz passes on chars 90% / words 80%, which can be under 90% overall (16/18)
    var lowish = logDoc('2026-02-01', { quizzes: HIRA.map(function (u, i) { return quiz(u.id, 16, 18, at(2026, 2, 1, 8, i)); }) });
    assert.ok(earned([lowish]).indexOf('hiragana-blitz') >= 0, 'legacy entry, 89% overall');
    var flagged = logDoc('2026-02-01', { quizzes: HIRA.map(function (u, i) { return Object.assign(quiz(u.id, 2, 10, at(2026, 2, 1, 8, i)), { passed: true }); }) });
    assert.ok(earned([flagged]).indexOf('hiragana-blitz') >= 0, 'logged passed flag wins');
    var failing = logDoc('2026-02-01', { quizzes: HIRA.map(function (u, i) { return quiz(u.id, 2, 10, at(2026, 2, 1, 8, i)); }) });
    assert.ok(earned([failing]).indexOf('hiragana-blitz') < 0);
  });

  // ── mocks ──
  QUnit.test('mock rules: counted sittings, first-sitting-only honors/perfect, any-sitting pass', function (assert) {
    var weak = { parts: { vocab: [10, 21], grammar: [8, 17], reading: [2, 5], listening: [12, 24] }, estimate: { lkr: 60, listening: 30, total: 90, passed: true } };
    var strong = { parts: { vocab: [20, 21], grammar: [16, 17], reading: [5, 5], listening: [23, 24] }, estimate: { lkr: 110, listening: 55, total: 165, passed: true } };
    var got = earned([mockDoc('x:n5-mock-1', at(2026, 1, 1), weak), mockDoc('x:n5-mock-1', at(2026, 1, 8), strong)]);
    assert.ok(got.indexOf('n5-mock-pass') >= 0 && got.indexOf('n5-mock-sat') >= 0 && got.indexOf('n5-mock-balanced') >= 0, 'retakes count for pass and balanced');
    assert.ok(got.indexOf('n5-mock-honors') < 0 && got.indexOf('n5-mock-perfect') < 0, 'honors/perfect need the FIRST sitting');
    assert.ok(earned([mockDoc('x:n5-mock-1', at(2026, 1, 1), strong)]).indexOf('n5-mock-honors') >= 0);
    assert.ok(earned([mockDoc('x:n5-mock-1', at(2026, 1, 1), strong)]).indexOf('n5-mock-perfect') < 0);
    assert.ok(earned([mockDoc('x:n5-mock-1', at(2026, 1, 1))]).indexOf('n5-mock-perfect') >= 0);
    assert.ok(earned([mockDoc('x:n5-mock-1', at(2026, 1, 1), weak)]).indexOf('n5-mock-balanced') < 0);
    assert.ok(earned([mockDoc('x:n5-mock-1', at(2026, 1, 1), weak)]).indexOf('n5-mock-pass-all') < 0, 'both full mocks are needed');
    assert.ok(earned([mockDoc('x:n5-mock-1', at(2026, 1, 1), weak), mockDoc('x:n5-mock-2', at(2026, 1, 2), weak)]).indexOf('n5-mock-pass-all') >= 0);
  });
  QUnit.test('a blank mock submit is not a sitting; the diagnostic is its own stamp', function (assert) {
    assert.deepEqual(earned([mockDoc('x:n5-mock-1', at(2026, 1, 1), { blank: true })]), []);
    var d = earned([mockDoc('x:n5-mock-3', at(2026, 1, 1))]);
    assert.ok(d.indexOf('n5-diagnostic') >= 0 && d.indexOf('n5-mock-sat') < 0, 'diagnostic is not a full mock');
    assert.ok(d.indexOf('n5-mock-perfect') < 0, 'only full mocks');
  });

  // ── N4 extras: one positive and one negative world each ──
  function earned4(docs) { return ids(evaluateAchievements(docs, {}, { units: N4U, catalog: N4CAT, defs: N4ROWS, now: at(2026, 12, 1) })); }
  function has4(docs, id) { return earned4(docs).indexOf(id) >= 0; }
  var N4C = function (ids_, over) { return G(ids_).map(function (it) { return cardDoc(it, over); }); };
  QUnit.test('n4-first: any N4 unit passed; an N5 unit is not', function (assert) {
    assert.ok(has4([unitDoc('n4.u020', at(2026, 3, 1))], 'n4-first'));
    assert.notOk(has4([unitDoc('n5.u020', at(2026, 3, 1))], 'n4-first'));
  });
  QUnit.test('n4-keigo and n4-voice: every lesson teaching the points, picked by grammar id', function (assert) {
    assert.ok(has4([unitDoc('n4.k1', at(2026, 3, 1)), unitDoc('n4.k2', at(2026, 3, 2))], 'n4-keigo'));
    assert.notOk(has4([unitDoc('n4.k1', at(2026, 3, 1))], 'n4-keigo'), 'half the keigo lessons');
    var row = achievementList([unitDoc('n4.k1', at(2026, 3, 1))], {}, { units: N4U, catalog: N4CAT, defs: N4ROWS }).filter(function (r) { return r.id === 'n4-keigo'; })[0];
    assert.deepEqual(row.progress, [1, 2]);
    assert.ok(has4([unitDoc('n4.v1', at(2026, 3, 1))], 'n4-voice'));
    assert.notOk(has4([unitDoc('n4.k1', at(2026, 3, 1))], 'n4-voice'));
  });
  QUnit.test('n4-conditionals and n4-giving: real-mature cards only (an import seed does not count)', function (assert) {
    var cond = ['g:to-conditional', 'g:tara', 'g:ba', 'g:nara'], give = ['g:te-ageru', 'g:te-kureru', 'g:te-morau'];
    assert.ok(has4(N4C(cond), 'n4-conditionals'));
    assert.notOk(has4(N4C(cond.slice(0, 3)).concat(N4C(['g:nara'], { lastReviewedAt: 0, imported: { source: 'x' } })), 'n4-conditionals'));
    assert.ok(has4(N4C(give), 'n4-giving'));
    assert.notOk(has4(N4C(give.slice(0, 2)).concat(N4C(['g:te-morau'], { interval: 15 })), 'n4-giving'), 'one still young');
  });
  QUnit.test('n4-mock-ears: a passed full N4 mock with listening at 80%+', function (assert) {
    var o = function (lis, pass) { return { parts: { vocab: [10, 21], grammar: [8, 17], reading: [2, 5], listening: lis }, estimate: { lkr: 60, listening: 30, total: 90, passed: pass } }; };
    assert.ok(has4([mockDoc('x:n4-mock-1', at(2026, 3, 1), o([20, 24], true))], 'n4-mock-ears'));
    assert.notOk(has4([mockDoc('x:n4-mock-1', at(2026, 3, 1), o([18, 24], true))], 'n4-mock-ears'), '75% listening');
    assert.notOk(has4([mockDoc('x:n4-mock-1', at(2026, 3, 1), o([24, 24], false))], 'n4-mock-ears'), 'not passed');
    assert.notOk(has4([mockDoc('x:n4-mock-3', at(2026, 3, 1), o([24, 24], true))], 'n4-mock-ears'), 'the diagnostic is not a full mock');
  });
  QUnit.test('n4-diag-first: diagnostic before any N4 lesson activity, earned at the first lesson pass', function (assert) {
    var diag = mockDoc('x:n4-mock-3', at(2026, 3, 1));
    var res = evaluateAchievements([diag, unitDoc('n4.k1', at(2026, 3, 2))], {}, { units: N4U, catalog: N4CAT, defs: N4ROWS, now: at(2026, 12, 1) });
    assert.deepEqual(res.filter(function (r) { return r.id === 'n4-diag-first'; }), [{ id: 'n4-diag-first', at: at(2026, 3, 2) }]);
    assert.notOk(has4([diag], 'n4-diag-first'), 'no lesson yet');
    assert.notOk(has4([diag, unitDoc('n4.k1', at(2026, 2, 20))], 'n4-diag-first'), 'a lesson came first');
    assert.notOk(has4([logDoc('2026-02-27', { quizzes: [quiz('n4.k1', 2, 10, at(2026, 2, 27))] }), diag, unitDoc('n4.k1', at(2026, 3, 2))], 'n4-diag-first'), 'a failed lesson quiz came first');
  });
  QUnit.test('n4-speedrun: every N4 unit within 90 days of starting, no placement skips', function (assert) {
    var run = function (step) { return N4U.map(function (u, i) { return unitDoc(u.id, at(2026, 1, 1) + i * step); }); };
    assert.ok(N4U.length * 12 * 3600000 < 90 * 86400000);
    assert.ok(has4(run(12 * 3600000), 'n4-speedrun'));
    assert.notOk(has4(run(86400000), 'n4-speedrun'), 'over 90 days');
    var early = [logDoc('2025-09-01', { quizzes: [quiz(N4U[0].id, 1, 10, at(2025, 9, 1))] })];
    assert.notOk(has4(early.concat(run(12 * 3600000)), 'n4-speedrun'), 'started long before');
    var skip = run(12 * 3600000);
    skip[3].skipped = true;
    assert.notOk(has4(skip, 'n4-speedrun'), 'placement skip');
    assert.notOk(has4(run(12 * 3600000).slice(1), 'n4-speedrun'), 'one unit left');
  });

  // ── habit ──
  QUnit.test('habit rules: streak, comeback gap, early bird / night owl, new year, same-day units', function (assert) {
    var run = function (from, n) { var out = [], d = new Date(from[0], from[1] - 1, from[2]); for (var i = 0; i < n; i++) { out.push(logDoc(ymd(d), { reviews: { count: 1, again: 0 } })); d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1); } return out; };
    assert.ok(earned(run([2026, 3, 1], 4)).indexOf('streak-4') >= 0);
    assert.ok(earned(run([2026, 3, 1], 3)).indexOf('streak-4') < 0);
    var g = earned(run([2026, 3, 1], 1).concat(run([2026, 3, 9], 1)));
    assert.ok(g.indexOf('comeback') >= 0, '8 days later');
    assert.ok(earned(run([2026, 3, 1], 1).concat(run([2026, 3, 8], 1))).indexOf('comeback') < 0, '7 days later is not enough');
    assert.ok(earned(run([2025, 12, 31], 2)).indexOf('new-year') >= 0);
    assert.ok(earned(run([2026, 1, 2], 2)).indexOf('new-year') < 0);
    var q = function (h, m) { return earned([logDoc('2026-02-01', { quizzes: [quiz(QUIZZED[0].id, 1, 10, at(2026, 2, 1, h, m))] })]); };
    assert.ok(q(5, 0).indexOf('early-bird') >= 0 && q(6, 59).indexOf('early-bird') >= 0 && q(7, 0).indexOf('early-bird') < 0 && q(4, 59).indexOf('early-bird') < 0);
    assert.ok(q(0, 0).indexOf('night-owl') >= 0 && q(3, 59).indexOf('night-owl') >= 0 && q(4, 0).indexOf('night-owl') < 0);
    var day = function (n) { return QUIZZED.slice(0, n).map(function (u, i) { return unitDoc(u.id, at(2026, 2, 1, 8 + i)); }); };
    var d2 = earned(day(2)), d5 = earned(day(5));
    assert.ok(d2.indexOf('double-feature') >= 0 && d2.indexOf('hat-trick') < 0);
    assert.ok(d5.indexOf('hat-trick') >= 0 && d5.indexOf('binge') >= 0);
    var split = [unitDoc(QUIZZED[0].id, at(2026, 2, 1)), unitDoc(QUIZZED[1].id, at(2026, 2, 2))];
    assert.ok(earned(split).indexOf('double-feature') < 0);
  });
  QUnit.test('review counters: per-day, lifetime, no logged review for import', function (assert) {
    var d = earned([logDoc('2026-02-01', { reviews: { count: 50, again: 5 } })]);
    assert.ok(d.indexOf('review-day-50') >= 0 && d.indexOf('review-day-100') < 0 && d.indexOf('reviews-100') < 0 && d.indexOf('first-review') >= 0);
    assert.ok(earned([logDoc('2026-02-01', { reviews: { count: 49, again: 0 } })]).indexOf('review-day-50') < 0);
  });
  QUnit.test('un-marking a unit does not matter to the engine: only sticky unlocks do', function (assert) {
    var res = evaluateAchievements([unitDoc(QUIZZED[0].id, at(2026, 2, 1))], {}, CTX());
    assert.deepEqual(res.map(function (r) { return r.id; }), ['first-steps']);
    assert.equal(res[0].at, at(2026, 2, 1), 'dated by completedAt');
    assert.deepEqual(earned([], { 'first-steps': 5 }), [], 'held unlocks are never re-emitted nor revoked');
  });
  QUnit.test('completionist: earned once every other row is held, dated by the last one', function (assert) {
    var held = {};
    ACHIEVEMENTS.forEach(function (a) { if (a.id !== 'completionist') held[a.id] = 1000; });
    var res = evaluateAchievements([], held, CTX(5000));
    assert.deepEqual(res, [{ id: 'completionist', at: 1000 }]);
    delete held['units-10'];
    assert.deepEqual(earned([], held), []);
  });

  // ── progress, hidden text, batching, badge ──
  QUnit.test('list: locked counters show progress, hidden rows show nothing until unlocked', function (assert) {
    var docs = QUIZZED.slice(0, 4).map(function (u, i) { return unitDoc(u.id, at(2026, 2, 1 + i)); });
    var rows = achievementList(docs, {}, CTX()), by = function (id) { return rows.filter(function (r) { return r.id === id; })[0]; };
    assert.deepEqual(by('units-10').progress, [4, 10]);
    var h = by('night-owl');
    assert.deepEqual([h.name, h.desc, h.revealed, h.progress], ['???', '', '', null]);
    var rows2 = achievementList(docs, { 'night-owl': 5, 'units-10': 5 }, CTX());
    var h2 = rows2.filter(function (r) { return r.id === 'night-owl'; })[0];
    assert.equal(h2.name, 'Yoru no Fukurō');
    assert.equal(h2.revealed, 'Finished a quiz after midnight.');
    assert.equal(h2.unlockedAt, 5);
    assert.equal(rows2.filter(function (r) { return r.id === 'units-10'; })[0].progress, null, 'unlocked: no bar');
  });
  QUnit.test('batch: retro = one silent summary; live = newest first, max 3 + more, one jingle', function (assert) {
    var n = ['a', 'b', 'c', 'd', 'e'].map(function (id) { return { id: id, at: 1 }; });
    assert.deepEqual(achievementBatch(n, 'retro'), { summary: 5, toasts: [], more: 0, jingle: false });
    assert.deepEqual(achievementBatch(n, 'live'), { summary: 0, toasts: ['e', 'd', 'c'], more: 2, jingle: true });
    assert.deepEqual(achievementBatch(n.slice(0, 1), 'live'), { summary: 0, toasts: ['a'], more: 0, jingle: true });
    assert.strictEqual(achievementBatch([], 'live'), null);
  });
  QUnit.test('unseenUnlocks: remote unlocks count toward the badge; opened ones do not', function (assert) {
    assert.deepEqual(unseenUnlocks({ a: 1, b: 2, c: 3 }, ['b']), ['a', 'c']);
    assert.deepEqual(unseenUnlocks({}, null), []);
  });

  // ── store doc shape ──
  QUnit.test('ach docs: id shape, merge (earliest wins), snapshot, validation', function (assert) {
    assert.ok(STORE_ID_RE.test('ach:n5-all-lessons') && STORE_ID_RE.test('ach:first-steps'));
    assert.notOk(STORE_ID_RE.test('ach:'));
    var a = { _id: 'ach:first-steps', unlockedAt: 100, updatedAt: 900, deviceId: 'a' };
    var b = { _id: 'ach:first-steps', unlockedAt: 200, updatedAt: 100, deviceId: 'b' };
    assert.strictEqual(mergeStoreDocs(a, b), a);
    assert.strictEqual(mergeStoreDocs(b, a), a, 'order-independent, not last-write-wins');
    var t1 = { _id: 'ach:x', unlockedAt: 5, updatedAt: 1, deviceId: 'a' }, t2 = { _id: 'ach:x', unlockedAt: 5, updatedAt: 2, deviceId: 'b' };
    assert.strictEqual(mergeStoreDocs(t1, t2), t2, 'tie → higher deviceId');
    assert.deepEqual(docsToSnapshot([a, { _id: 'ach:zz', unlockedAt: 7, updatedAt: 1 }]).unlocked, { 'first-steps': 100, zz: 7 });
    assert.ok(validateProgressData({ version: 3, docs: [a] }).valid);
    assert.notOk(validateProgressData({ version: 3, docs: [{ _id: 'ach:first-steps', updatedAt: 1 }] }).valid);
    var exp = exportProgress([a], function () { return null; });
    assert.equal(exp.docs[0]._id, 'ach:first-steps', 'exported with the other docs');
  });
  QUnit.test('Store.putUnlocks is sticky; replaceAll and unit un-marking keep unlocks', function (assert) {
        var d = {};
    var st = createStore({ ls: { get: function (k) { return d[k] || null; }, set: function (k, v) { d[k] = String(v); } }, openBackend: function () { return Promise.resolve(memoryBackend()); } });
    return st.init().then(function () {
      st.putUnlocks([{ id: 'first-steps', at: 100 }]);
      st.putUnlocks([{ id: 'first-steps', at: 999 }, { id: 'units-10', at: 50 }]);
      assert.deepEqual(st.snapshot().unlocked, { 'first-steps': 100, 'units-10': 50 });
      st.putUnit('n5.u001', true);
      st.putUnit('n5.u001', false);
      return st.replaceAll([{ _id: 'unit:n5.u002', done: true, completedAt: 1, updatedAt: 1 }]);
    }).then(function () {
      assert.deepEqual(st.snapshot().unlocked, { 'first-steps': 100, 'units-10': 50 }, 'a restore never revokes');
      assert.deepEqual(st.snapshot().completed, ['n5.u002']);
    });
  });
});
