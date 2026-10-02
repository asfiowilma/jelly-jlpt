"use strict";

var curriculum = [];

;

var PHASE_COLORS = {
  1: '#e91e8c',
  2: '#8e44ad',
  3: '#2980b9',
  4: '#16a085',
  5: '#e67e22',
  6: '#2c3e50',
  7: '#c0392b',
  8: '#27ae60',
  9: '#9b59b6',
  10: '#1abc9c',
  11: '#e74c3c',
  12: '#f39c12',
  13: '#34495e',
  14: '#2ecc71',
  // N3
  15: '#7f8c8d',
  16: '#0984e3',
  17: '#d63031',
  18: '#6c5ce7',
  19: '#e17055',
  20: '#00b894',
  // N2
  21: '#636e72',
  22: '#00cec9',
  23: '#e84393',
  24: '#fdcb6e',
  25: '#d35400',
  26: '#6ab04c',
  // N1
  27: '#95a5a6',
  28: '#0652DD',
  29: '#c0392b',
  30: '#8854d0',
  31: '#e15f41',
  32: '#10ac84'
};

var PHASE_BG = {
  1: '#fce4f0',
  2: '#f5e6ff',
  3: '#e8f4fd',
  4: '#e8f8f5',
  5: '#fef5e7',
  6: '#eaecee',
  7: '#fdedec',
  8: '#e9f7ef',
  9: '#f4ecf7',
  10: '#e8f8f5',
  11: '#fadbd8',
  12: '#fef5e7',
  13: '#eaecee',
  14: '#e8f8f5',
  // N3
  15: '#ebedef',
  16: '#dceefb',
  17: '#fbe4e4',
  18: '#ece7fa',
  19: '#fae5de',
  20: '#defaf4',
  // N2
  21: '#e8eaeb',
  22: '#defaf9',
  23: '#fce4f0',
  24: '#fef9e7',
  25: '#fbeee6',
  26: '#e8f8e8',
  // N1
  27: '#eef0f0',
  28: '#dce4fb',
  29: '#fbe4e2',
  30: '#ede7f6',
  31: '#fae5e0',
  32: '#e0f5ef'
};

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
