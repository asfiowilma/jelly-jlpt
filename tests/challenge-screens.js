"use strict";

// Mastery challenge screens: overview Dare card, pool pick, run, result, retake and run storage.
// Components are called directly with a small hook emulator (persisting useState and useRef slots,
// effects not run) and a createElement that records every element, so the tests read the same
// buttons and text a learner sees.
QUnit.module('challenge screens', function () {
  var noop = function () {};

  function mount(Comp, props, seed) {
    var state = seed ? seed.slice() : [], refs = [], k = 0, r = 0, els = [];
    var orig = { us: React.useState, ur: React.useRef, ce: React.createElement };
    var api = {
      state: state, props: props,
      render: function () {
        k = 0; r = 0; els = [];
        React.useState = function (init) {
          var i = k++;
          if (!(i in state)) state[i] = typeof init === 'function' ? init() : init;
          return [state[i], function (v) { state[i] = typeof v === 'function' ? v(state[i]) : v; }];
        };
        React.useRef = function (init) { var i = r++; return refs[i] || (refs[i] = { current: init === undefined ? null : init }); };
        React.createElement = function (type, p) {
          var el = { type: type, props: p || {}, children: [].slice.call(arguments, 2) };
          els.push(el);
          return el;
        };
        try { Comp(api.props); } finally { React.useState = orig.us; React.useRef = orig.ur; React.createElement = orig.ce; }
        return els;
      }
    };
    api.render();
    return api;
  }
  function textOf(el) {
    if (el === false || el == null) return '';
    if (typeof el !== 'object') return String(el);
    if (Array.isArray(el)) return el.map(textOf).join('');
    return (el.children || []).map(textOf).join('');
  }
  function btn(els, label) {
    return els.filter(function (e) { return e.type === 'button' && textOf(e).indexOf(label) >= 0; })[0];
  }
  var TEXT_TAGS = ['button', 'p', 'b', 'h3', 'h4', 'span', 'small', 'li'];
  function allText(els) { return els.filter(function (e) { return TEXT_TAGS.indexOf(e.type) >= 0; }).map(textOf).join(' | '); }
  function withStore(over, fn) {
    var saved = {};
    Object.keys(over).forEach(function (n) { saved[n] = Store[n]; Store[n] = over[n]; });
    try { return fn(); } finally { Object.keys(over).forEach(function (n) { Store[n] = saved[n]; }); }
  }
  var ids = function (list) { return list.map(function (u) { return u.id; }); };
  var stages = function () { return challengeStages('N5'); };
  function unitDocs(list) { return list.map(function (id) { return { _id: 'unit:' + id, done: true }; }); }

  // ── overview Dare card ────────────────────────────────────────────────────
  QUnit.test('Dare card early state (under 10% of stages cleared) uses the cheeky copy and Prove yourself', function (assert) {
    ['N5', 'N4'].forEach(function (lv) {
      var els = mount(function () { dareCard(lv, new Set(), noop); }, {}).render();
      assert.ok(els.some(function (e) { return e.props.className === 'panel dare'; }), lv + ' card present');
      assert.ok(allText(els).indexOf('Bet you already know this.') >= 0, lv + ' early copy');
      assert.ok(allText(els).indexOf("Bet you've forgotten") < 0, lv + ' no forgotten pitch early');
      assert.ok(btn(els, 'Prove yourself'), lv + ' button');
    });
  });

  QUnit.test('Dare card at 10% cleared or more uses the forgotten copy and Prove me wrong', function (assert) {
    var n = stages().length, tenth = new Set(ids(stages()).slice(0, Math.ceil(n / 10)));
    var els = mount(function () { dareCard('N5', tenth, noop); }, {}).render();
    assert.ok(allText(els).indexOf("Bet you've forgotten some of it.") >= 0, 'late stages-left copy');
    assert.ok(btn(els, 'Prove me wrong'), 'late button');
  });

  QUnit.test('Dare card with nothing left says so and still offers Prove me wrong', function (assert) {
    var all = new Set(ids(stages()));
    var els = mount(function () { dareCard('N5', all, noop); }, {}).render();
    assert.ok(allText(els).indexOf('Fine, you remembered everything.') >= 0);
    assert.ok(allText(els).indexOf("Bet you've forgotten") < 0);
    assert.ok(btn(els, 'Prove me wrong'));
  });

  QUnit.test('Dare card is absent for a level with no stages and carries no last-run or rematch text', function (assert) {
    var none = ['N3', 'N2', 'N1'].filter(function (lv) { return challengeStages(lv).length === 0; });
    assert.ok(none.length > 0, 'some level has no stages');
    none.forEach(function (lv) {
      assert.strictEqual(mount(function () { return dareCard(lv, new Set(), noop); }, {}).render().length, 0, lv + ' renders nothing');
    });
    var txt = allText(mount(function () { dareCard('N5', new Set(), noop); }, {}).render());
    assert.notOk(/last run|rematch|last time/i.test(txt));
  });

  QUnit.test('Dare card button hands its level to the entry handler', function (assert) {
    var got = [];
    var els = mount(function () { dareCard('N4', new Set(), function (lv) { got.push(lv); }); }, {}).render();
    btn(els, 'Prove yourself').props.onClick();
    assert.deepEqual(got, ['N4']);
  });

  // ── entry routes ──────────────────────────────────────────────────────────
  // the App on its Stages tab: the view slot is the first useState holding 'today'
  function appOnStages() {
    var m = mount(App, {});
    m.state[m.state.indexOf('today')] = 'units';
    return m;
  }

  QUnit.test('the app routes the overview Dare button to the pool pick for that level', function (assert) {
    var m = appOnStages();
    var ov = m.render().filter(function (e) { return e.type === Overview; })[0];
    assert.ok(ov, 'overview rendered');
    ov.props.onChallenge('N4');
    var pool = m.render().filter(function (e) { return e.type === ChallengePool; })[0];
    assert.ok(pool, 'pool pick is shown');
    assert.strictEqual(pool.props.level, 'N4');
  });

  QUnit.test('the placement result challenge button applies with the challenge level', function (assert) {
    var calls = [];
    var us = buildUnits(PLAN, CATALOG).filter(liveUnit);
    var s = placementRunStart(us, function () { return 0.5; }), cur, n = 0;
    while ((cur = placementRunNext(s))) { if (++n > 80) throw new Error('runaway'); placementRunAnswer(s, null); }
    var res = placementRunResult(s);
    var props = { units: us, completed: new Set(), level: 'N5', onApply: function (r, u, o) { calls.push(o); }, onClose: noop };
    var els = mount(PlacementFlow, props, [us, 'result', null, 0, res, res.placement]).render();
    var b = els.filter(function (e) { return e.props.id === 'pt-challenge'; })[0];
    assert.ok(b, 'challenge button on the result');
    b.props.onClick();
    assert.strictEqual(calls.length, 1);
    assert.ok(calls[0] && calls[0].challenge, 'apply carries the challenge level');
  });

  QUnit.test('the app opens the pool pick after a placement apply that asks for the challenge', function (assert) {
    var m = appOnStages();
    m.render().filter(function (e) { return e.type === Overview; })[0].props.onChallenge('N5');
    var flowIdx = Object.keys(m.state).filter(function (i) { return m.state[i] && m.state[i].screen === 'challenge-pool'; })[0];
    assert.ok(flowIdx !== undefined, 'flow slot found');
    m.state[flowIdx] = { screen: 'placement' };
    var pf = m.render().filter(function (e) { return e.type === PlacementFlow; })[0];
    assert.ok(pf, 'placement shown');
    pf.props.onApply({ placement: 0, passedStageIds: [], holeStageIds: [], startStageId: null, log: [] }, null, { challenge: 'N5' });
    assert.deepEqual(m.state[flowIdx], { screen: 'challenge-pool', level: 'N5' });
  });

  // ── pool pick ─────────────────────────────────────────────────────────────
  var checked = function (els) { return els.filter(function (e) { return e.props.role === 'radio' && e.props['aria-checked']; }).map(textOf); };
  QUnit.test('pool pick offers both doors and defaults to what is left when something is left', function (assert) {
    var els = mount(ChallengePool, { level: 'N5', completed: new Set(), onClose: noop, onGo: noop }).render();
    assert.ok(btn(els, "Just what's left"));
    assert.ok(btn(els, 'The whole level'));
    assert.ok(checked(els)[0].indexOf("Just what's left") >= 0, 'default is what is left');
  });

  QUnit.test('pool pick hides what-is-left when nothing is left and defaults to the whole level', function (assert) {
    var got = [];
    var els = mount(ChallengePool, { level: 'N5', completed: new Set(ids(stages())), onClose: noop, onGo: function (md) { got.push(md); } }).render();
    assert.notOk(btn(els, "Just what's left"));
    assert.ok(btn(els, 'The whole level'));
    assert.ok(checked(els)[0].indexOf('The whole level') >= 0);
    btn(els, "Let's go").props.onClick();
    assert.deepEqual(got, ['whole']);
  });

  QUnit.test('pool pick Lets go passes the chosen door and never names a stage', function (assert) {
    var got = [];
    var m = mount(ChallengePool, { level: 'N5', completed: new Set(), onClose: noop, onGo: function (md) { got.push(md); } });
    btn(m.render(), 'The whole level').props.onClick();
    var els = m.render();
    btn(els, "Let's go").props.onClick();
    assert.deepEqual(got, ['whole']);
    var txt = allText(els);
    stages().forEach(function (u) { assert.ok(txt.indexOf(u.title) < 0, 'no stage title ' + u.title); });
  });

  // ── retake ────────────────────────────────────────────────────────────────
  var NODOCS = { docs: function () { return []; } };

  QUnit.test('a retake starts with the missed stages and fills from the remembered pool up to the stage cap', function (assert) {
    var pool = stages().slice(0, 8), missed = [pool[6].id, pool[7].id];
    var run = { level: 'n5', startedAt: 1, mode: 'whole', pool: ids(pool), stages: [], missed: missed, cleared: [] };
    withStore(NODOCS, function () {
      var c = challengeExercises('N5', null, run), seen = [];
      c.questions.forEach(function (q) { if (seen.indexOf(q.stage) < 0) seen.push(q.stage); });
      assert.ok(missed.every(function (id) { return seen.indexOf(id) >= 0; }), 'missed stages are in the run');
      assert.ok(seen.length <= CH_MAX_STAGES, 'at most the stage cap');
      assert.ok(seen.every(function (id) { return run.pool.indexOf(id) >= 0; }), 'only remembered pool stages');
      assert.deepEqual(ids(c.pool), ids(pool));
    });
  });

  QUnit.test('a retake from a short remembered pool gives a shorter run', function (assert) {
    var pool = stages().slice(0, 2);
    var run = { level: 'n5', startedAt: 1, mode: 'whole', pool: ids(pool), stages: [], missed: [pool[0].id], cleared: [] };
    withStore(NODOCS, function () {
      var c = challengeExercises('N5', null, run), seen = {};
      c.questions.forEach(function (q) { seen[q.stage] = true; });
      assert.ok(Object.keys(seen).length <= 2);
      assert.ok(c.questions.length > 0);
    });
  });

  QUnit.test('go again after a perfect run uses the remembered pool', function (assert) {
    var pool = stages().slice(0, 3);
    var run = { level: 'n5', startedAt: 1, mode: 'whole', pool: ids(pool), stages: ids(pool), missed: [], cleared: ids(pool) };
    withStore(NODOCS, function () {
      var c = challengeExercises('N5', null, run);
      assert.deepEqual(ids(c.pool), ids(pool));
      assert.ok(c.questions.every(function (q) { return run.pool.indexOf(q.stage) >= 0; }));
    });
  });

  QUnit.test('go again after a perfect run in incomplete mode falls back to the whole remembered pool when none is left', function (assert) {
    var pool = stages().slice(0, 3);
    var run = { level: 'n5', startedAt: 1, mode: 'incomplete', pool: ids(pool), stages: ids(pool), missed: [], cleared: ids(pool) };
    withStore({ docs: function () { return unitDocs(ids(pool)); } }, function () {
      var c = challengeExercises('N5', null, run);
      assert.deepEqual(ids(c.pool), ids(pool), 'empty incomplete pool becomes the whole remembered pool');
      assert.ok(c.questions.length > 0);
    });
  });

  QUnit.test('a retake uses the stored mode and pool and ignores the mode prop', function (assert) {
    var pool = stages().slice(0, 4);
    var run = { level: 'n5', startedAt: 1, mode: 'incomplete', pool: ids(pool), stages: [], missed: [], cleared: [] };
    withStore({ docs: function () { return unitDocs([pool[0].id]); } }, function () {
      var c = challengeExercises('N5', 'whole', run);
      assert.deepEqual(ids(c.pool), ids(pool.slice(1)), 'incomplete drops the stage done since');
    });
  });

  QUnit.test('missed stages that did not fit are deferred and stay missed in the next run record', function (assert) {
    var big = stages().filter(function (u) { return quizItems(u).length >= 15; }).slice(0, 4);
    assert.ok(big.length >= 3, 'enough big stages');
    var run = { level: 'n5', startedAt: 1, mode: 'whole', pool: ids(big), stages: [], missed: ids(big), cleared: [] };
    withStore(NODOCS, function () {
      var c = challengeExercises('N5', null, run);
      var inRun = {};
      c.questions.forEach(function (q) { inRun[q.stage] = true; });
      var rec = challengeRecord('N5', run.mode, c.pool, challengeScore(c.questions, c.questions.map(function () { return true; })), 5, c.deferred);
      assert.ok(c.deferred.length > 0, 'something is deferred');
      c.deferred.forEach(function (id) { assert.ok(rec.missed.indexOf(id) >= 0, id + ' stays missed'); });
    });
  });

  // play a run through the real component: every option question right, every typed one wrong
  function playRun(props) {
    var done = null, wrote = [], units = [], mocks = 0;
    withStore({ docs: function () { return []; }, putChrun: function (d) { wrote.push(d); }, putUnit: function (id, v) { units.push([id, v]); },
      putMock: function () { mocks++; } }, function () {
      var m = mount(ChallengeRun, Object.assign({ onClose: noop, onDone: function (r) { done = r; } }, props));
      for (var guard = 0; !done && guard < 200; guard++) {
        var ex = m.state[0].exs[m.state[1]];
        m.render();
        if (ex.options && typeof ex.correct === 'number') m.state[2] = ex.correct; else m.state[3] = 'zzz';
        btn(m.render(), 'Check').props.onClick();
        btn(m.render(), 'Next').props.onClick();
      }
    });
    return { done: done, wrote: wrote, units: units, mocks: mocks };
  }

  QUnit.test('finishing a run writes exactly one run record and marks only cleared stages done', function (assert) {
    var out = playRun({ level: 'N5', mode: 'whole' });
    assert.ok(out.done, 'run finished');
    assert.strictEqual(out.wrote.length, 1, 'one run record');
    assert.ok(/^chrun:n5:\d+$/.test(out.wrote[0]._id));
    assert.deepEqual(out.done.run, out.wrote[0]);
    out.units.forEach(function (u) { assert.strictEqual(u[1], true); });
    assert.strictEqual(out.units.length, out.done.scores.filter(function (s) { return s.cleared; }).length);
  });

  QUnit.test('a retake run records the stored mode and stays inside the remembered pool', function (assert) {
    var pool = stages().slice(0, 3);
    var run = { level: 'n5', startedAt: 1, mode: 'whole', pool: ids(pool), stages: [], missed: [pool[0].id], cleared: [] };
    var out = playRun({ level: 'N5', mode: 'incomplete', retakeOf: run });
    assert.strictEqual(out.wrote.length, 1);
    assert.strictEqual(out.wrote[0].mode, 'whole');
    assert.ok(out.wrote[0].pool.every(function (id) { return run.pool.indexOf(id) >= 0; }));
  });

  QUnit.test('runs and retakes never write a mock sitting', function (assert) {
    assert.strictEqual(playRun({ level: 'N5', mode: 'whole' }).mocks, 0);
    var pool = stages().slice(0, 2);
    var run = { level: 'n5', startedAt: 1, mode: 'whole', pool: ids(pool), stages: [], missed: [pool[0].id], cleared: [] };
    assert.strictEqual(playRun({ level: 'N5', retakeOf: run }).mocks, 0);
  });

  // ── storing a run ─────────────────────────────────────────────────────────
  QUnit.test('putChrun writes one run doc with the record body and no mock doc or card', function (assert) {
    var d = {};
    var s = createStore({ ls: { get: function (k) { return d[k] || null; }, set: function (k, v) { d[k] = String(v); } },
      openBackend: function () { return Promise.resolve(memoryBackend()); } });
    var st = stages();
    var rec = challengeRecord('N5', 'whole', st.slice(0, 2), [{ stage: st[0].id, cleared: true }, { stage: st[1].id, cleared: false }], 1234, []);
    var before;
    return s.init().then(function () {
      before = s.docs().length;
      return s.putChrun(rec);
    }).then(function () {
      var docs = s.docs(), added = docs.filter(function (x) { return x._id === rec._id; })[0];
      assert.strictEqual(docs.length - before, 1, 'exactly one doc added');
      assert.strictEqual(rec._id, 'chrun:n5:1234');
      assert.ok(added, 'chrun doc stored');
      assert.strictEqual(added.level, 'n5');
      assert.deepEqual(added.missed, [st[1].id]);
      assert.deepEqual(added.cleared, [st[0].id]);
      assert.notOk(docs.some(function (x) { return /^(mock|card):/.test(x._id); }), 'no mock doc or card');
    });
  });

  // ── result ────────────────────────────────────────────────────────────────
  function resultEls(scores, misses) {
    var prev = window.matchMedia;
    window.matchMedia = function () { return { matches: true }; }; // reduced motion: every stamp and the verdict show at once
    try {
      return mount(ChallengeResult, { level: 'N5', scores: scores, misses: misses || [], run: {}, onClose: noop, onRetake: noop }).render();
    } finally { window.matchMedia = prev; }
  }
  var sc = function (cleared) { return { stage: stages()[cleared ? 0 : 1].id, cleared: cleared, missed: cleared ? 0 : 2, total: 5 }; };

  QUnit.test('result stamps read the cleared mark and NOT YET', function (assert) {
    var els = resultEls([sc(true), sc(false)]);
    assert.deepEqual(els.filter(function (e) { return e.props.className === 'st'; }).map(textOf), ['済', 'NOT YET']);
  });

  QUnit.test('result shows no JLPT estimate and no pass or fail text', function (assert) {
    var miss = [{ stage: stages()[1].id, kind: 'kana', item: { kind: 'kana', char: 'あ', romaji: 'a' } }];
    [[sc(true)], [sc(false)], [sc(true), sc(false)]].forEach(function (scores) {
      var txt = allText(resultEls(scores, miss)).toLowerCase();
      ['180', 'jlpt', 'estimate', 'pass mark', 'passed', 'failed', 'pass/fail'].forEach(function (w) {
        assert.ok(txt.indexOf(w) < 0, 'no "' + w + '"');
      });
    });
  });

  QUnit.test('result offers Retake missed after a miss and Go again after a clean run', function (assert) {
    assert.ok(btn(resultEls([sc(false)]), 'Retake missed'));
    assert.ok(btn(resultEls([sc(true)]), 'Go again'));
  });

  QUnit.test('result caps the missed list at eight and counts the rest', function (assert) {
    var q = stages()[1], items = quizItems(q), misses = [];
    for (var i = 0; i < 12; i++) misses.push({ stage: q.id, kind: items[i % items.length].kind, item: items[i % items.length] });
    var els = resultEls([sc(false)], misses);
    assert.strictEqual(els.filter(function (e) { return e.type === 'li'; }).length, 8);
    assert.ok(allText(els).indexOf('and 4 more') >= 0);
  });

  // ── jelly ─────────────────────────────────────────────────────────────────
  QUnit.test('smug jelly has a lid, brow and look and every other mood has them at zero', function (assert) {
    var s = JELLY_MOODS.smug;
    assert.ok(s.lid > 0 && s.brow > 0 && s.look > 0);
    Object.keys(JELLY_MOODS).filter(function (m) { return m !== 'smug'; }).forEach(function (m) {
      ['lid', 'brow', 'look'].forEach(function (k) { assert.strictEqual(JELLY_MOODS[m][k], 0, m + '.' + k); });
    });
  });
});
