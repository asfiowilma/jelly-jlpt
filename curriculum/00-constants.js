"use strict";

var curriculum = [];

;

// Phases per JLPT level (first, last) — same split as dayToLevel's day ranges in lib.js.
var LEVEL_PHASES = { N5: [1, 8], N4: [9, 14], N3: [15, 20], N2: [21, 26], N1: [27, 32] };

// phaseTone: { level, step } for a phase. step = index within the level,
// centred on 0 (N5's 8 phases → -3.5..3.5, the 6-phase levels → -2.5..2.5).
// Returns null for an unknown phase.
function phaseTone(p) {
  for (var lv in LEVEL_PHASES) {
    var r = LEVEL_PHASES[lv];
    if (p >= r[0] && p <= r[1]) return { level: lv, step: (p - r[0]) - (r[1] - r[0]) / 2 };
  }
  return null;
}

// Phase colors are CSS color strings, not hex: the level token (--n5..--n1,
// which follows the active palette/theme) nudged in lightness + hue by step,
// so a level's phases read as one family but stay distinguishable.
// Browsers without relative color syntax get the flat level color.
var PHASE_COLORS = {};
var PHASE_BG = {};
(function () {
  var rel = typeof CSS === 'undefined' || !CSS.supports || CSS.supports('color', 'oklch(from red l c h)');
  function signed(n) { return (n < 0 ? ' - ' : ' + ') + Math.abs(n); }
  for (var p = 1; p <= 32; p++) {
    var tone = phaseTone(p);
    var lv = 'var(--' + tone.level.toLowerCase() + ')';
    var dl = Math.round(tone.step * 0.02 * 1000) / 1000;
    var dh = Math.round(tone.step * 6 * 10) / 10;
    PHASE_COLORS[p] = rel ? 'oklch(from ' + lv + ' calc(l' + signed(dl) + ') c calc(h' + signed(dh) + '))' : lv;
    PHASE_BG[p] = 'color-mix(in oklab, ' + PHASE_COLORS[p] + ' 14%, var(--surface))';
  }
}());

var PHASE_NAMES = {
  1: 'Hiragana',
  2: 'Katakana',
  3: 'Foundations',
  4: 'Vocabulary',
  5: 'Verbs',
  6: 'Grammar',
  7: 'Kanji',
  8: 'Test Prep',
  9: 'N5 Review',
  10: 'N4 Vocabulary',
  11: 'N4 Verbs',
  12: 'N4 Grammar',
  13: 'N4 Kanji',
  14: 'N4 Test Prep',
  15: 'N4 Review',
  16: 'N3 Vocabulary',
  17: 'N3 Verbs & Adjectives',
  18: 'N3 Grammar',
  19: 'N3 Kanji',
  20: 'N3 Test Prep',
  21: 'N3 Review',
  22: 'N2 Vocabulary',
  23: 'N2 Verbs & Expressions',
  24: 'N2 Grammar',
  25: 'N2 Kanji',
  26: 'N2 Test Prep',
  27: 'N2 Review',
  28: 'N1 Vocabulary',
  29: 'N1 Verbs & Expressions',
  30: 'N1 Grammar',
  31: 'N1 Kanji',
  32: 'N1 Test Prep'
};
