"use strict";

QUnit.module('curriculum data integrity', function () {

  QUnit.test('curriculum is not empty', function (assert) {
    assert.ok(curriculum.length >= 1720, 'should have at least 1720 lessons (N5 through N1 complete)');
  });

  QUnit.test('day numbers are sequential from 1', function (assert) {
    var failures = [];
    curriculum.forEach(function (lesson, i) {
      if (lesson.day !== i + 1) {
        failures.push('index ' + i + ' has day=' + lesson.day + ', expected ' + (i + 1));
      }
    });
    assert.equal(failures.length, 0, failures.join('; '));
  });

  QUnit.test('no duplicate day numbers', function (assert) {
    var days = curriculum.map(function (l) { return l.day; });
    var unique = new Set(days);
    assert.equal(unique.size, curriculum.length, 'all day numbers should be unique');
  });

  QUnit.test('every lesson has non-empty required string fields', function (assert) {
    var required = ['title', 'type', 'intro', 'practice', 'tip'];
    var failures = [];
    curriculum.forEach(function (lesson) {
      required.forEach(function (field) {
        if (!lesson[field] || typeof lesson[field] !== 'string' || !lesson[field].trim()) {
          failures.push('day ' + lesson.day + ' missing/empty: ' + field);
        }
      });
    });
    assert.equal(failures.length, 0, failures.join('\n'));
  });

  QUnit.test('type field is always a known value', function (assert) {
    // All types legitimately used in the curriculum — 'numbers', 'particles', 'verbs'
    // are distinct sub-types under the Foundations / Verbs phases.
    // A non-string type value (e.g. an array) will never match and will be flagged here.
    var validTypes = new Set(['script', 'lesson', 'grammar', 'kanji', 'review',
                              'numbers', 'particles', 'verbs', 'vocab', 'reading']);
    var failures = [];
    curriculum.forEach(function (lesson) {
      if (!validTypes.has(lesson.type)) {
        failures.push('day ' + lesson.day + ' has unknown type: ' + lesson.type);
      }
    });
    assert.equal(failures.length, 0, failures.join('\n'));
  });

  QUnit.test('vocab entries are always 3-element arrays with non-empty jp and meaning', function (assert) {
    var failures = [];
    curriculum.forEach(function (lesson) {
      (lesson.vocab || []).forEach(function (v, i) {
        if (!Array.isArray(v) || v.length !== 3) {
          failures.push('day ' + lesson.day + ' vocab[' + i + '] wrong length');
          return;
        }
        if (!v[0] || !v[0].trim()) {
          failures.push('day ' + lesson.day + ' vocab[' + i + '][0] (jp) is empty');
        }
        if (!v[2] || !v[2].trim()) {
          failures.push('day ' + lesson.day + ' vocab[' + i + '][2] (meaning) is empty');
        }
      });
    });
    assert.equal(failures.length, 0, failures.join('\n'));
  });

  QUnit.test('chars entries are always 2-element arrays with non-empty char and reading', function (assert) {
    var failures = [];
    curriculum.forEach(function (lesson) {
      (lesson.chars || []).forEach(function (c, i) {
        if (!Array.isArray(c) || c.length !== 2) {
          failures.push('day ' + lesson.day + ' chars[' + i + '] wrong length');
          return;
        }
        if (!c[0] || !c[0].trim()) {
          failures.push('day ' + lesson.day + ' chars[' + i + '][0] (char) is empty');
        }
        if (!c[1] || !c[1].trim()) {
          failures.push('day ' + lesson.day + ' chars[' + i + '][1] (reading) is empty');
        }
      });
    });
    assert.equal(failures.length, 0, failures.join('\n'));
  });

  QUnit.test('phase numbers are integers from 1 to 32', function (assert) {
    var failures = [];
    curriculum.forEach(function (lesson) {
      if (typeof lesson.phaseNum !== 'number' || lesson.phaseNum < 1 || lesson.phaseNum > 32) {
        failures.push('day ' + lesson.day + ' phaseNum=' + lesson.phaseNum);
      }
    });
    assert.equal(failures.length, 0, failures.join('\n'));
  });

  QUnit.test('week numbers are integers from 1 to 246', function (assert) {
    var failures = [];
    curriculum.forEach(function (lesson) {
      if (typeof lesson.week !== 'number' || lesson.week < 1 || lesson.week > 246) {
        failures.push('day ' + lesson.day + ' week=' + lesson.week);
      }
    });
    assert.equal(failures.length, 0, failures.join('\n'));
  });

  QUnit.test('lessons of type "script" always have at least one char', function (assert) {
    var failures = [];
    curriculum.filter(function (l) { return l.type === 'script'; }).forEach(function (lesson) {
      if (!lesson.chars || lesson.chars.length === 0) {
        failures.push('day ' + lesson.day + ' (type=script) has no chars');
      }
    });
    assert.equal(failures.length, 0, failures.join('\n'));
  });

  QUnit.test('Hiragana phase covers days 1-14 (phaseNum=1)', function (assert) {
    var hira = curriculum.slice(0, 14);
    var failures = hira.filter(function (l) { return l.phaseNum !== 1; })
                       .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-1: ' + failures.join(', '));
  });

  QUnit.test('Katakana phase covers days 15-28 (phaseNum=2)', function (assert) {
    var kata = curriculum.slice(14, 28);
    var failures = kata.filter(function (l) { return l.phaseNum !== 2; })
                       .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-2: ' + failures.join(', '));
  });

  QUnit.test('day 365, 960, 1320, and 1720 exist', function (assert) {
    assert.equal(curriculum[364].day, 365, 'day 365 exists');
    assert.equal(curriculum[659].day, 660, 'day 660 exists');
    assert.equal(curriculum[959].day, 960, 'day 960 exists');
    assert.equal(curriculum[1319].day, 1320, 'day 1320 exists');
    assert.equal(curriculum[curriculum.length - 1].day, 1720, 'last day is 1720');
  });

  QUnit.test('phaseName matches phaseNum for all lessons', function (assert) {
    var phaseMap = {
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
    var failures = [];
    curriculum.forEach(function (lesson) {
      var expected = phaseMap[lesson.phaseNum];
      if (expected && lesson.phaseName !== expected) {
        failures.push('day ' + lesson.day + ': phaseNum=' + lesson.phaseNum +
          ' but phaseName="' + lesson.phaseName + '" (expected "' + expected + '")');
      }
    });
    assert.equal(failures.length, 0, failures.join('\n'));
  });

  QUnit.test('N5 Review phase covers days 366-395 (phaseNum=9)', function (assert) {
    var phase9 = curriculum.slice(365, 395);
    var failures = phase9.filter(function (l) { return l.phaseNum !== 9; })
                         .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-9: ' + failures.join(', '));
  });

  QUnit.test('N4 Vocabulary phase covers days 396-455 (phaseNum=10)', function (assert) {
    var phase10 = curriculum.slice(395, 455);
    var failures = phase10.filter(function (l) { return l.phaseNum !== 10; })
                          .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-10: ' + failures.join(', '));
  });

  QUnit.test('N4 Verbs phase covers days 456-500 (phaseNum=11)', function (assert) {
    var phase11 = curriculum.slice(455, 500);
    var failures = phase11.filter(function (l) { return l.phaseNum !== 11; })
                          .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-11: ' + failures.join(', '));
  });

  QUnit.test('N4 Grammar phase covers days 501-555 (phaseNum=12)', function (assert) {
    var phase12 = curriculum.slice(500, 555);
    var failures = phase12.filter(function (l) { return l.phaseNum !== 12; })
                          .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-12: ' + failures.join(', '));
  });

  QUnit.test('N4 Kanji phase covers days 556-620 (phaseNum=13)', function (assert) {
    var phase13 = curriculum.slice(555, 620);
    var failures = phase13.filter(function (l) { return l.phaseNum !== 13; })
                          .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-13: ' + failures.join(', '));
  });

  QUnit.test('N4 Test Prep phase covers days 621-660 (phaseNum=14)', function (assert) {
    var phase14 = curriculum.slice(620, 660);
    var failures = phase14.filter(function (l) { return l.phaseNum !== 14; })
                          .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-14: ' + failures.join(', '));
  });

  // N3 phase range tests
  QUnit.test('N4 Review phase covers days 661-690 (phaseNum=15)', function (assert) {
    var phase = curriculum.slice(660, 690);
    var failures = phase.filter(function (l) { return l.phaseNum !== 15; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-15: ' + failures.join(', '));
  });

  QUnit.test('N3 Vocabulary phase covers days 691-770 (phaseNum=16)', function (assert) {
    var phase = curriculum.slice(690, 770);
    var failures = phase.filter(function (l) { return l.phaseNum !== 16; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-16: ' + failures.join(', '));
  });

  QUnit.test('N3 Verbs & Adjectives phase covers days 771-820 (phaseNum=17)', function (assert) {
    var phase = curriculum.slice(770, 820);
    var failures = phase.filter(function (l) { return l.phaseNum !== 17; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-17: ' + failures.join(', '));
  });

  QUnit.test('N3 Grammar phase covers days 821-895 (phaseNum=18)', function (assert) {
    var phase = curriculum.slice(820, 895);
    var failures = phase.filter(function (l) { return l.phaseNum !== 18; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-18: ' + failures.join(', '));
  });

  QUnit.test('N3 Kanji phase covers days 896-930 (phaseNum=19)', function (assert) {
    var phase = curriculum.slice(895, 930);
    var failures = phase.filter(function (l) { return l.phaseNum !== 19; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-19: ' + failures.join(', '));
  });

  QUnit.test('N3 Test Prep phase covers days 931-960 (phaseNum=20)', function (assert) {
    var phase = curriculum.slice(930, 960);
    var failures = phase.filter(function (l) { return l.phaseNum !== 20; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-20: ' + failures.join(', '));
  });

  // Level boundary tests
  QUnit.test('JLPT level day ranges do not overlap', function (assert) {
    var levels = [
      { name: 'N5', start: 1, end: 365 },
      { name: 'N4', start: 366, end: 660 },
      { name: 'N3', start: 661, end: 960 },
      { name: 'N2', start: 961, end: 1320 },
      { name: 'N1', start: 1321, end: 1720 }
    ];
    for (var i = 0; i < levels.length - 1; i++) {
      assert.ok(levels[i].end < levels[i + 1].start,
        levels[i].name + ' ends at ' + levels[i].end + ' before ' + levels[i + 1].name + ' starts at ' + levels[i + 1].start);
    }
    assert.equal(levels[levels.length - 1].end, 1720, 'N1 ends at day 1720');
  });

  // N2 phase range tests
  QUnit.test('N3 Review phase covers days 961-990 (phaseNum=21)', function (assert) {
    var phase = curriculum.slice(960, 990);
    var failures = phase.filter(function (l) { return l.phaseNum !== 21; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-21: ' + failures.join(', '));
  });

  QUnit.test('N2 Vocabulary phase covers days 991-1090 (phaseNum=22)', function (assert) {
    var phase = curriculum.slice(990, 1090);
    var failures = phase.filter(function (l) { return l.phaseNum !== 22; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-22: ' + failures.join(', '));
  });

  QUnit.test('N2 Verbs & Expressions phase covers days 1091-1140 (phaseNum=23)', function (assert) {
    var phase = curriculum.slice(1090, 1140);
    var failures = phase.filter(function (l) { return l.phaseNum !== 23; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-23: ' + failures.join(', '));
  });

  QUnit.test('N2 Grammar phase covers days 1141-1230 (phaseNum=24)', function (assert) {
    var phase = curriculum.slice(1140, 1230);
    var failures = phase.filter(function (l) { return l.phaseNum !== 24; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-24: ' + failures.join(', '));
  });

  QUnit.test('N2 Kanji phase covers days 1231-1275 (phaseNum=25)', function (assert) {
    var phase = curriculum.slice(1230, 1275);
    var failures = phase.filter(function (l) { return l.phaseNum !== 25; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-25: ' + failures.join(', '));
  });

  QUnit.test('N2 Test Prep phase covers days 1276-1320 (phaseNum=26)', function (assert) {
    var phase = curriculum.slice(1275, 1320);
    var failures = phase.filter(function (l) { return l.phaseNum !== 26; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-26: ' + failures.join(', '));
  });

  // N1 phase range tests
  QUnit.test('N2 Review phase covers days 1321-1350 (phaseNum=27)', function (assert) {
    var phase = curriculum.slice(1320, 1350);
    var failures = phase.filter(function (l) { return l.phaseNum !== 27; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-27: ' + failures.join(', '));
  });

  QUnit.test('N1 Vocabulary phase covers days 1351-1470 (phaseNum=28)', function (assert) {
    var phase = curriculum.slice(1350, 1470);
    var failures = phase.filter(function (l) { return l.phaseNum !== 28; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-28: ' + failures.join(', '));
  });

  QUnit.test('N1 Verbs & Expressions phase covers days 1471-1530 (phaseNum=29)', function (assert) {
    var phase = curriculum.slice(1470, 1530);
    var failures = phase.filter(function (l) { return l.phaseNum !== 29; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-29: ' + failures.join(', '));
  });

  QUnit.test('N1 Grammar phase covers days 1531-1640 (phaseNum=30)', function (assert) {
    var phase = curriculum.slice(1530, 1640);
    var failures = phase.filter(function (l) { return l.phaseNum !== 30; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-30: ' + failures.join(', '));
  });

  QUnit.test('N1 Kanji phase covers days 1641-1690 (phaseNum=31)', function (assert) {
    var phase = curriculum.slice(1640, 1690);
    var failures = phase.filter(function (l) { return l.phaseNum !== 31; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-31: ' + failures.join(', '));
  });

  QUnit.test('N1 Test Prep phase covers days 1691-1720 (phaseNum=32)', function (assert) {
    var phase = curriculum.slice(1690, 1720);
    var failures = phase.filter(function (l) { return l.phaseNum !== 32; })
                        .map(function (l) { return 'day ' + l.day; });
    assert.equal(failures.length, 0, 'Non-phase-32: ' + failures.join(', '));
  });
});

// ── Phase constants ───────────────────────────────────────────────────────────
