"use strict";

QUnit.module('getDueCards', function () {

  QUnit.test('returns cards whose due <= now', function (assert) {
    var srs = {
      'v_1_0': { due: Date.now() - 1000 },   // past  → due
      'v_1_1': { due: Date.now() + 99999 }   // future → not due
    };
    var due = getDueCards(srs);
    assert.deepEqual(due, ['v_1_0']);
  });

  QUnit.test('returns empty array when no cards are due', function (assert) {
    var srs = { 'v_1_0': { due: Date.now() + 99999 } };
    assert.equal(getDueCards(srs).length, 0);
  });

  QUnit.test('returns all cards when all are past-due', function (assert) {
    var past = Date.now() - 1000;
    var srs = {
      'v_1_0': { due: past },
      'v_1_1': { due: past },
      'c_1_0': { due: past }
    };
    assert.equal(getDueCards(srs).length, 3);
  });

  QUnit.test('returns empty array for empty srs', function (assert) {
    assert.equal(getDueCards({}).length, 0);
  });

  QUnit.test('returns card ids (strings), not card objects', function (assert) {
    var srs = { 'v_1_0': { due: Date.now() - 1 } };
    var due = getDueCards(srs);
    assert.equal(typeof due[0], 'string', 'each entry is a card ID string');
  });
});


// ── 6. Card-ID to display item — cardToItem(id, srs) ─────────────────────────
