"use strict";

QUnit.module('dayToLevel', function () {
  QUnit.test('days 1-365 are N5', function (assert) {
    assert.equal(dayToLevel(1), 'N5');
    assert.equal(dayToLevel(365), 'N5');
  });

  QUnit.test('days 366-660 are N4', function (assert) {
    assert.equal(dayToLevel(366), 'N4');
    assert.equal(dayToLevel(660), 'N4');
  });

  QUnit.test('days 661-960 are N3', function (assert) {
    assert.equal(dayToLevel(661), 'N3');
    assert.equal(dayToLevel(960), 'N3');
  });

  QUnit.test('days 961-1320 are N2', function (assert) {
    assert.equal(dayToLevel(961), 'N2');
    assert.equal(dayToLevel(1320), 'N2');
  });

  QUnit.test('days 1321-1720 are N1', function (assert) {
    assert.equal(dayToLevel(1321), 'N1');
    assert.equal(dayToLevel(1720), 'N1');
  });
});
