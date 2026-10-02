"use strict";

QUnit.module('phase constants', function () {
  var EXPECTED_PHASES = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32];
  var EXPECTED_NAMES = {
    1: 'Hiragana', 2: 'Katakana', 3: 'Foundations',
    4: 'Vocabulary', 5: 'Verbs', 6: 'Grammar',
    7: 'Kanji', 8: 'Test Prep', 9: 'N5 Review',
    10: 'N4 Vocabulary', 11: 'N4 Verbs', 12: 'N4 Grammar',
    13: 'N4 Kanji', 14: 'N4 Test Prep',
    15: 'N4 Review', 16: 'N3 Vocabulary', 17: 'N3 Verbs & Adjectives',
    18: 'N3 Grammar', 19: 'N3 Kanji', 20: 'N3 Test Prep',
    21: 'N3 Review', 22: 'N2 Vocabulary', 23: 'N2 Verbs & Expressions',
    24: 'N2 Grammar', 25: 'N2 Kanji', 26: 'N2 Test Prep',
    27: 'N2 Review', 28: 'N1 Vocabulary', 29: 'N1 Verbs & Expressions',
    30: 'N1 Grammar', 31: 'N1 Kanji', 32: 'N1 Test Prep'
  };

  QUnit.test('PHASE_COLORS is defined with all 32 phase keys', function (assert) {
    assert.ok(typeof PHASE_COLORS === 'object' && PHASE_COLORS !== null, 'PHASE_COLORS exists');
    EXPECTED_PHASES.forEach(function (p) {
      assert.ok(typeof PHASE_COLORS[p] === 'string' && PHASE_COLORS[p].length > 0,
        'PHASE_COLORS[' + p + '] is a non-empty string');
    });
  });

  QUnit.test('PHASE_BG is defined with all 32 phase keys', function (assert) {
    assert.ok(typeof PHASE_BG === 'object' && PHASE_BG !== null, 'PHASE_BG exists');
    EXPECTED_PHASES.forEach(function (p) {
      assert.ok(typeof PHASE_BG[p] === 'string' && PHASE_BG[p].length > 0,
        'PHASE_BG[' + p + '] is a non-empty string');
    });
  });

  QUnit.test('PHASE_NAMES is defined with all 32 phase keys', function (assert) {
    assert.ok(typeof PHASE_NAMES === 'object' && PHASE_NAMES !== null, 'PHASE_NAMES exists');
    EXPECTED_PHASES.forEach(function (p) {
      assert.equal(PHASE_NAMES[p], EXPECTED_NAMES[p],
        'PHASE_NAMES[' + p + '] matches expected name');
    });
  });

  QUnit.test('every phaseNum in the curriculum has an entry in each constant', function (assert) {
    var seen = new Set(curriculum.map(function (l) { return l.phaseNum; }));
    seen.forEach(function (p) {
      assert.ok(PHASE_COLORS[p], 'PHASE_COLORS has key ' + p);
      assert.ok(PHASE_BG[p], 'PHASE_BG has key ' + p);
      assert.ok(PHASE_NAMES[p], 'PHASE_NAMES has key ' + p);
    });
  });
});

// ── 13. New lib.js helpers ──────────────────────────────────────────────────
