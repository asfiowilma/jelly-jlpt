"use strict";

// Ticket 40: suffixes, prefixes and counters are only asked inside an authored context, and a
// context question has exactly one right answer. Ticket 41 addendum: a homograph's reading is a
// retry, not a miss. Seeded Math.random so a failure reproduces.
QUnit.module('bound morphemes and homograph readings', function () {
  var BOUND_FORMS = { ctxGap: true, ctxRead: true, ctxReadMc: true };
  function seeded(seed) {
    return function () { // mulberry32
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function withSeed(seed, fn) {
    var rnd = Math.random;
    Math.random = seeded(seed);
    try { return fn(); } finally { Math.random = rnd; }
  }
  var bound = function () { return catalogOf('vocab').filter(isBound); };
  var v = function (id) { return CATALOG.items[id]; };
  var unitTeaching = function (id) {
    return buildUnits(PLAN, CATALOG).filter(function (u) { return (u.vocab || []).some(function (x) { return x.id === id; }); })[0];
  };

  QUnit.test('the 30 N5 suffixes / prefixes / counters each have ≥ 2 well-formed contexts', function (assert) {
    var bs = bound();
    assert.equal(bs.length, 30, '30 bound items');
    bs.forEach(function (b) {
      var cs = boundContexts(b);
      assert.ok(cs.length >= 2 && cs.length === (b.contexts || []).length, b.id + ': ' + cs.length + ' contexts, all parse');
      cs.forEach(function (c) {
        assert.ok(c.host.length > 0, b.id + ' ' + c.word + ': has a host');
        assert.ok(/^[ぁ-ゖー]+$/.test(c.reading), b.id + ' ' + c.word + ': hiragana reading ' + c.reading);
        assert.notOk(JA_CHARS.test(c.en), b.id + ' ' + c.word + ': English-only note');
        // the morpheme reads as taught, or with a sound change on its first kana (三階 がい, 一杯 ぱい)
        var mr = kataToHira(sliceParts(c.parts, c.at, c.end).map(function (p) { return p.r || p.t; }).join(''));
        var base = kataToHira(b.reading);
        assert.ok(mr === base || (mr.slice(1) === base.slice(1) && kanaBase(mr.charAt(0)) === kanaBase(base.charAt(0))),
          b.id + ' ' + c.word + ': morpheme read ' + mr);
      });
    });
  });

  QUnit.test('20 builds of every N5 unit: a bound item is only asked in context, never offered bare', function (assert) {
    var standalone = {}, bareOption = 0, asked = 0, ex1 = null;
    var glosses = {};
    bound().forEach(function (b) { glosses[glossText(b)] = b.id; });
    withSeed(40, function () {
      buildUnits(PLAN, CATALOG).filter(function (u) { return u.level === 'N5'; }).forEach(function (u) {
        for (var r = 0; r < 20; r++) buildExercises(u).forEach(function (ex) {
          if (isBound(ex.item)) {
            asked++;
            if (!BOUND_FORMS[ex.form]) standalone[ex.form] = (standalone[ex.form] || 0) + 1;
          } else if (ex.options && ex.form !== 'hyouki' && ex.options.some(function (o) { return glosses[o]; })) {
            bareOption++;
            ex1 = ex1 || u.id + ' ' + ex.form + ': ' + ex.options.join(' | ');
          }
        });
      });
    });
    assert.ok(asked > 100, asked + ' bound-item questions');
    assert.deepEqual(standalone, {}, 'standalone forms');
    assert.equal(bareOption, 0, 'a bound gloss offered as a distractor: ' + ex1);
  });

  QUnit.test('context gap: one right answer, never a synonym or a meaning the English names, 4 options', function (assert) {
    var problems = [];
    withSeed(7, function () {
      bound().forEach(function (b) {
        boundContexts(b).forEach(function (c) {
          for (var r = 0; r < 10; r++) {
            var d = boundGapOptions(b, c);
            if (d.length < 3) problems.push(b.id + ' ' + c.word + ': ' + d.length + ' distractors');
            d.forEach(function (x) {
              if (x.id === b.id || boundLabel(x) === boundLabel(b)) problems.push(b.id + ': itself offered');
              if (BOUND_SYNONYMS.some(function (s) { return s.indexOf(x.id) >= 0 && s.indexOf(b.id) >= 0; })) problems.push(b.id + ' ' + c.word + ': synonym ' + x.id);
              if (sharesSense(glossText(x), c.en)) problems.push(b.id + ' ' + c.word + ': ' + x.id + ' fits "' + c.en + '"');
            });
          }
        });
      });
    });
    assert.deepEqual(problems.slice(0, 5), [], problems.length + ' problems');
    // the hand-checked pairs: 三回 / 三度 both "three times"; 日本人 offers 人 (にん) as the trap
    var once = boundContexts(v('v:回|かい')).filter(function (c) { return c.word === '一回'; })[0];
    assert.ok(once, '一回 context');
    for (var i = 0; i < 20; i++) assert.ok(boundGapOptions(v('v:回|かい'), once).every(function (x) { return x.id !== 'v:度|ど'; }), '一度 never offered for "once"');
    var jp = boundContexts(v('v:人|じん'))[0];
    assert.equal(jp.word, '日本人');
    assert.ok(boundGapOptions(v('v:人|じん'), jp).some(function (x) { return x.id === 'v:人|にん'; }), '人 (にん) is the first distractor');
  });

  QUnit.test('context questions: shapes of gap, typed reading (sound changes, alt readings) and MC reading', function (assert) {
    var u = unitTeaching('v:階|かい');
    var ctx = quizContext(u), item = v('v:階|かい');
    var forms = formsFor(item, ctx), by = {};
    forms.forEach(function (fm) { by[fm.name] = fm; });
    assert.deepEqual(Object.keys(by).sort(), ['ctxGap', 'ctxRead', 'ctxReadMc']);
    withSeed(3, function () {
      for (var i = 0; i < 15; i++) {
        var g = by.ctxGap.make();
        assert.equal(g.type, 'gap');
        assert.equal(g.options[g.correct], '階 (かい)');
        assert.ok(g.parts.some(function (p) { return p.t === GAP_BLANK; }) && /floor/.test(g.note), 'blank + English');
        assert.equal(new Set(g.options).size, 4, 'four distinct options');
        var t = by.ctxRead.make();
        assert.ok(t.answers.indexOf('さんがい') >= 0 || t.answers.indexOf('にかい') >= 0 || t.answers.indexOf('いっかい') >= 0, t.question + ' → ' + t.answers.join('/'));
        if (t.question === '三階') assert.ok(answerIsRight(t, 'さんかい') && answerIsRight(t, 'さんがい'), '三階: both readings JMdict lists');
        assert.notOk(t.parts.some(function (p) { return p.t.indexOf('階') >= 0 && p.r; }), 'no ruby on the asked morpheme');
        var m = by.ctxReadMc.make();
        if (m) {
          var bc = boundContexts(item).filter(function (c) { return c.word === m.question; })[0];
          m.options.forEach(function (o, k) { if (k !== m.correct) assert.ok(bc.answers.indexOf(o) < 0, 'MC distractor ' + o + ' is not a valid reading'); });
        }
      }
    });
    // kana-only morphemes: no reading question (it would test the host only)
    var san = formsFor(v('v:さん|さん'), quizContext(unitTeaching('v:さん|さん'))).map(function (fm) { return fm.make() && fm.name; }).filter(Boolean);
    assert.deepEqual(san, ['ctxGap'], 'さん: gap only');
  });

  QUnit.test('homographs: reading question names the meaning, another reading of the spelling is a retry', function (assert) {
    var hito = v('v:人|ひと');
    var late = buildUnits(PLAN, CATALOG).filter(function (u) { return u.level === 'N5'; }).slice(-1)[0];
    var ctx = quizContext(late);
    ctx.taught['v:人|じん'] = true;
    var rt = formsFor(hito, ctx).filter(function (fm) { return fm.name === 'readingType'; })[0].make();
    rt.item = hito;
    assert.equal(rt.note, '"' + glossText(hito) + '"', 'hint names the meaning');
    assert.equal(otherReading(rt, 'じん').id, 'v:人|じん', 'じん → retry');
    assert.equal(otherReading(rt, 'にん').id, 'v:人|にん', 'にん → retry');
    assert.equal(otherReading(rt, 'ひと'), null, 'the asked reading is just right');
    assert.equal(otherReading(rt, 'いぬ'), null, 'a plain miss stays a miss');
    assert.ok(/じん is a reading of 人 too/.test(otherReadingNote(rt, otherReading(rt, 'じん'))), 'note');
    var nan = formsFor(v('v:何|なに'), ctx).filter(function (fm) { return fm.name === 'readingType'; })[0].make();
    // same meaning (何 なに / なん "what", 九 きゅう / く): the other reading is simply right
    assert.ok(answerIsRight(nan, 'なん') && answerIsRight(nan, 'なに'), '何: なに and なん both right');
    assert.equal(otherReading(nan, 'なん'), null, 'no retry for a same-meaning reading');
    assert.equal(nan.note, undefined, 'no hint needed');
    var tsuitachi = formsFor(v('v:一日|いちにち'), ctx).filter(function (fm) { return fm.name === 'readingType'; })[0].make();
    assert.equal(otherReading(tsuitachi, 'ついたち').id, 'v:一日|ついたち', '一日: ついたち (the 1st) is another word → retry');
    // MC readings never offer another reading of the same spelling
    withSeed(9, function () {
      for (var i = 0; i < 30; i++) {
        var mc = formsFor(hito, ctx).filter(function (fm) { return fm.name === 'readingMc'; })[0].make();
        assert.ok(mc.options.every(function (o, k) { return k === mc.correct || ['じん', 'にん'].indexOf(o) < 0; }), mc.options.join(' '));
      }
    });
  });
});

QUnit.module('twin words (早い / 速い)', function () {
  QUnit.test('the twin meaning is a retry, not a miss, and never an option', function (assert) {
    var hayai = CATALOG.items['v:早い|はやい'];
    var late = buildUnits(PLAN, CATALOG).filter(function (u) { return u.level === 'N5'; }).slice(-1)[0];
    var ctx = quizContext(late);
    var mt = formsFor(hayai, ctx).filter(function (fm) { return fm.name === 'meaningType'; })[0].make();
    assert.ok(mt.twinMeanings && mt.twinMeanings.length, 'twin listed while both show as はやい');
    assert.equal(otherMeaning(mt, 'fast').word, '速い', 'fast → retry');
    assert.equal(otherMeaning(mt, 'early'), null, 'own meaning is just right');
    assert.equal(otherMeaning(mt, 'dog'), null, 'plain miss stays a miss');
    for (var i = 0; i < 20; i++) {
      var mc = formsFor(hayai, ctx).filter(function (fm) { return fm.name === 'meaningMc'; })[0].make();
      assert.ok(!mc || mc.options.every(function (o) { return !/fast|quick/.test(o); }), 'no twin meaning option');
    }
  });
});

QUnit.module('near-synonym typed meaning (コップ / カップ)', function () {
  QUnit.test('typing the look-alike word\'s meaning is a retry, not a miss', function (assert) {
    var item = catalogOf('vocab').filter(function (v) { return v.id === 'v:コップ|コップ'; })[0];
    var ex = buildExercises({ id: 't', kind: 'lesson', items: [item], vocab: [item] }).filter(function (e) { return e.twinMeanings; })[0];
    assert.ok(ex, 'typed meaning question built');
    var t = otherMeaning(ex, 'cup');
    assert.equal(t && t.word, 'カップ', 'cup → retry');
    assert.ok(/カップ/.test(otherMeaningNote(ex, t)));
    assert.equal(otherMeaning(ex, 'tumbler'), null, 'own meaning is right');
  });
});
