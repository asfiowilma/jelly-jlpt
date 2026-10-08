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

  QUnit.test('at most KANA_DUE_MAX kana cards are due, most overdue first; words are never capped (N5 r1 newbie N7)', function (assert) {
    var now = Date.now(), cards = {};
    for (var i = 0; i < 107; i++) cards['k' + i] = { id: 'k' + i, type: 'kana', due: now - 1000 - i };
    for (var j = 0; j < 23; j++) cards['v' + j] = { id: 'v' + j, type: 'vocab', due: now - 1000 };
    var due = srsDueCards(cards), kana = due.filter(function (c) { return c.type === 'kana'; });
    assert.equal(kana.length, KANA_DUE_MAX);
    assert.equal(due.length - kana.length, 23, 'every due word');
    assert.ok(kana.every(function (c) { return +c.id.slice(1) >= 107 - KANA_DUE_MAX; }), 'the most overdue kana');
  });
});


// ── 12. Curriculum Data Integrity ────────────────────────────────────────────
