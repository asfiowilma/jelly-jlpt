"use strict";

// A word's kanji spelling is only asked for its reading once every kanji in it is taught
// (by the unit or earlier). Words with an untaught kanji (隣 となり) keep meaning / kana forms.
QUnit.module('no reading question for untaught kanji', function () {
  var READING_FORMS = { readingType: 1, readingMc: 1, kanjiYomi: 1 };
  var units = function () { return buildUnits(PLAN, CATALOG).filter(function (u) { return u.level === 'N5'; }); };

  QUnit.test('every N5 unit: reading forms only for fully taught kanji words', function (assert) {
    var bad = [], n = 0, tonari = 0;
    units().forEach(function (u) {
      if (u.kind === 'prep' || u.kind === 'mock') return;
      var tk = quizContext(u).taughtKanji;
      for (var r = 0; r < 15; r++) buildExercises(u).forEach(function (ex) {
        var it = ex.item;
        if (!it || it.kind !== 'vocab' || !READING_FORMS[ex.form]) return;
        n++;
        if (it.id === 'v:隣|となり') tonari++;
        if (!allKanjiTaught(it.word, tk)) bad.push(u.id + ' ' + ex.form + ' ' + it.word);
      });
    });
    assert.ok(n > 100, n + ' reading questions built');
    assert.deepEqual(bad.slice(0, 10), [], 'untaught kanji asked for a reading');
    assert.equal(tonari, 0, '隣 is never asked for its reading (kanji 隣 is not taught)');
  });

  QUnit.test('an untaught-kanji word still has meaning questions', function (assert) {
    var v = CATALOG.items['v:隣|となり'];
    var u = units().filter(function (x) { return (x.vocab || []).some(function (i) { return i.id === v.id; }); })[0];
    assert.ok(u, 'a unit teaches 隣');
    var forms = {};
    for (var r = 0; r < 30; r++) buildExercises(u).forEach(function (ex) { if (ex.item && ex.item.id === v.id) forms[ex.form] = 1; });
    assert.ok(forms.meaningMc || forms.meaningType, 'asked for its meaning: ' + Object.keys(forms));
  });
});

// displayWord: a word with an untaught kanji shows only its kana reading everywhere.
QUnit.module('displayWord hides untaught kanji', function () {
  var unitOf = function (id) { return buildUnits(PLAN, CATALOG).filter(function (x) { return (x.vocab || []).some(function (i) { return i.id === id; }); })[0]; };
  QUnit.test('kana for 隣, the spelling once every kanji is taught', function (assert) {
    var tonari = CATALOG.items['v:隣|となり'], gakkou = CATALOG.items['v:学校|がっこう'];
    assert.equal(displayWord(tonari, {}), 'となり');
    assert.equal(displayWord(gakkou, { 学: true }), 'がっこう', 'one kanji still missing');
    assert.equal(displayWord(gakkou, { 学: true, 校: true }), '学校');
    assert.equal(displayWord(tonari, unitTaughtKanji(unitOf(tonari.id))), 'となり', 'at its own lesson');
    assert.equal(displayWord({ word: 'ねこ', reading: 'ねこ' }, {}), 'ねこ');
  });
  QUnit.test('quiz question text shows the kana for 隣', function (assert) {
    var u = unitOf('v:隣|となり'), seen = 0;
    for (var r = 0; r < 30; r++) buildExercises(u).forEach(function (ex) {
      if (ex.item && ex.item.id === 'v:隣|となり' && (ex.form === 'meaningMc' || ex.form === 'meaningType')) {
        seen++; assert.equal(ex.question, 'となり');
        assert.equal(ex.parts.map(function (p) { return p.t + (p.r || ''); }).join(''), 'となり');
      }
    });
    assert.ok(seen > 0, 'a meaning question was built');
  });
});

// No untaught kanji as an option or stem of a vocab question (靴 was shown as a kanji option in its lesson).
QUnit.module('no untaught kanji in quiz options', function () {
  var units = function () { return buildUnits(PLAN, CATALOG).filter(function (u) { return u.level === 'N5' && u.kind !== 'prep' && u.kind !== 'mock'; }); };
  var untaught = function (text, tk) { return Array.from(String(text || '')).filter(function (c) { return hasKanji(c) && !tk[c]; }); };
  // intentional kanji: 表記 and underlined-reading forms, kanji-kind questions
  var KANJI_FORMS = { hyouki: 1, kanjiYomi: 1, kanjiReadType: 1, kanjiMeanType: 1, kanjiReadMc: 1, kanjiMeanMc: 1 };

  QUnit.test('wordMc options are kana for words with untaught kanji', function (assert) {
    var bad = [], n = 0;
    units().forEach(function (u) {
      var tk = unitTaughtKanji(u);
      for (var r = 0; r < 15; r++) buildExercises(u).forEach(function (ex) {
        if (ex.form !== 'wordMc') return;
        n++;
        ex.options.forEach(function (o) { if (untaught(o, tk).length) bad.push(u.id + ' ' + o); });
        if (new Set(ex.options).size !== ex.options.length) bad.push(u.id + ' duplicate options ' + ex.options);
      });
    });
    assert.ok(n > 100, n + ' wordMc questions built');
    assert.deepEqual(bad.slice(0, 10), []);
  });

  QUnit.test('靴: kana options, one right answer, four distinct', function (assert) {
    var u = buildUnits(PLAN, CATALOG).filter(function (x) { return (x.vocab || []).some(function (i) { return i.id === 'v:靴|くつ'; }); })[0];
    var seen = 0;
    for (var r = 0; r < 40; r++) buildExercises(u).forEach(function (ex) {
      if (ex.form !== 'wordMc' || ex.item.id !== 'v:靴|くつ') return;
      seen++;
      assert.equal(ex.options[ex.correct], 'くつ');
      assert.equal(new Set(ex.options).size, 4);
      assert.ok(ex.options.every(function (o) { return !hasKanji(o); }), ex.options.join(' '));
    });
    assert.ok(seen > 0, '靴 wordMc built');
  });

  QUnit.test('generic scan: option and stem text never shows an untaught kanji', function (assert) {
    var bad = {}, n = 0;
    units().forEach(function (u) {
      var tk = unitTaughtKanji(u);
      for (var r = 0; r < 15; r++) buildExercises(u).forEach(function (ex) {
        // patternMc: grammar text. ctxRead(Mc): the bound morpheme's reading is the question. reading: passage text
        if (ex.form === 'patternMc' || ex.form === 'ctxRead' || ex.form === 'ctxReadMc' || ex.type === 'reading') return;
        if (KANJI_FORMS[ex.form] || ex.type === 'hyouki' || ex.type === 'kanji_yomi') return;
        n++;
        var texts = [].concat(ex.optionParts ? [] : ex.options || [], ex.items || [], ex.pairs ? [].concat.apply([], ex.pairs) : [], ex.prompt, ex.parts ? [] : ex.question);
        (ex.optionParts || []).forEach(function (ps) { ps.forEach(function (p) { if (!p.r) texts.push(p.t); }); });
        (ex.parts || []).forEach(function (p) { if (!p.r) texts.push(p.t); });
        texts.forEach(function (t) {
          var k = untaught(t, tk);
          if (k.length) bad[u.id + ' ' + ex.form + ' ' + k.join('') + ' in ' + String(t).slice(0, 30)] = 1;
        });
      });
    });
    assert.ok(n > 500, n + ' questions scanned');
    assert.deepEqual(Object.keys(bad).slice(0, 15), []);
  });
});
