"use strict";

QUnit.module('passage rendering', function () {
  QUnit.test('reading type days with passage have required structure', function (assert) {
    var readingDays = curriculum.filter(function (l) { return l.type === 'reading'; });
    var failures = [];
    readingDays.forEach(function (lesson) {
      if (!lesson.passage) {
        failures.push('day ' + lesson.day + ' type=reading but no passage field');
        return;
      }
      if (!lesson.passage.text_jp || !lesson.passage.text_jp.trim()) {
        failures.push('day ' + lesson.day + ' passage.text_jp is empty');
      }
      if (!lesson.passage.text_en || !lesson.passage.text_en.trim()) {
        failures.push('day ' + lesson.day + ' passage.text_en is empty');
      }
    });
    assert.equal(failures.length, 0, failures.join('\n'));
  });
});
