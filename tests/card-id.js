"use strict";

QUnit.module('cardId', function () {

  QUnit.test('vocab card: type=v', function (assert) {
    assert.equal(cardId('v', 1, 0), 'v_1_0');
  });

  QUnit.test('char card: type=c', function (assert) {
    assert.equal(cardId('c', 14, 3), 'c_14_3');
  });

  QUnit.test('large day and index', function (assert) {
    assert.equal(cardId('v', 365, 99), 'v_365_99');
  });
});


// ── 4. Adding SRS cards — addDayCards(srs, lesson) ───────────────────────────
