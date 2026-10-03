"use strict";

// Achievement engine (ticket 08): the list, every rule, unlock docs, batching.
// Fixtures are built from the real N5 catalog + plan.
QUnit.module('achievements', function () {
  var UNITS_ = buildUnits(PLAN, CATALOG);
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

  QUnit.test('the list matches the approved draft: ids, categories, rarities, hidden', function (assert) {
    var tally = function (key) { var o = {}; ACHIEVEMENTS.forEach(function (a) { o[a[key]] = (o[a[key]] || 0) + 1; }); return o; };
    assert.deepEqual(ACHIEVEMENTS.map(function (a) { return a.id; }).sort(), EXPECTED.slice().sort());
    assert.equal(ACHIEVEMENTS.length, 64);
    assert.deepEqual(tally('category'), { progress: 13, habit: 15, quiz: 7, mock: 9, review: 12, mastery: 8 });
    assert.deepEqual(tally('rarity'), { common: 15, uncommon: 20, rare: 17, epic: 7, legendary: 5 });
    assert.deepEqual(ACHIEVEMENTS.filter(function (a) { return a.hidden; }).map(function (a) { return a.id; }).sort(),
      ['comeback', 'completionist', 'early-bird', 'hiragana-blitz', 'new-year', 'night-owl', 'redemption-arc']);
    ACHIEVEMENTS.forEach(function (a) {
      assert.ok(a.name && a.desc && ACH_CATEGORIES[a.category], a.id + ' has text and a known category');
      assert.equal(a.hidden ? !!a.revealed : !a.revealed, true, a.id + ': revealed text only on hidden rows');
    });
    assert.equal(new Set(ACHIEVEMENTS.map(function (a) { return a.name; })).size, 64, 'names are unique');
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
