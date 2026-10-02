"use strict";

QUnit.module('srsDueCards', function () {

  QUnit.test('returns card objects (not IDs) that are due', function (assert) {
    var pastCard = { id: 'v_1_0', due: Date.now() - 1000 };
    var futureCard = { id: 'v_1_1', due: Date.now() + 99999 };
    var result = srsDueCards({ 'v_1_0': pastCard, 'v_1_1': futureCard });
    assert.equal(result.length, 1);
    assert.deepEqual(result[0], pastCard);
  });

  QUnit.test('returns empty array when no cards are due', function (assert) {
    var cards = { 'v_1_0': { due: Date.now() + 99999 } };
    assert.equal(srsDueCards(cards).length, 0);
  });

  QUnit.test('returns empty array for empty cards object', function (assert) {
    assert.equal(srsDueCards({}).length, 0);
  });

  QUnit.test('returns all cards when all are overdue', function (assert) {
    var past = Date.now() - 1000;
    var cards = {
      'v_1_0': { due: past },
      'v_1_1': { due: past },
      'c_1_0': { due: past }
    };
    assert.equal(srsDueCards(cards).length, 3);
  });
});


// ── 12. Curriculum Data Integrity ────────────────────────────────────────────
