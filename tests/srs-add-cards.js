"use strict";

QUnit.module('srsAddCards', function () {

  var sampleLesson = {
    day: 5,
    vocab: [['ねこ', 'ねこ', 'cat'], ['いぬ', 'いぬ', 'dog']],
    chars: [['な', 'na'], ['に', 'ni']]
  };

  QUnit.test('adds vocab cards with embedded front/back/reading', function (assert) {
    var cards = {};
    srsAddCards(sampleLesson, cards);
    var card = cards['v_5_0'];
    assert.ok(card, 'vocab card 0 added');
    assert.equal(card.front, 'ねこ');
    assert.equal(card.back, 'cat');
    assert.equal(card.type, 'vocab');
  });

  QUnit.test('adds char cards with embedded front/back', function (assert) {
    var cards = {};
    srsAddCards(sampleLesson, cards);
    var card = cards['c_5_0'];
    assert.ok(card, 'char card 0 added');
    assert.equal(card.front, 'な');
    assert.equal(card.back, 'na');
    assert.equal(card.type, 'char');
  });

  QUnit.test('new cards start with interval=1, ease=2.5, reps=0', function (assert) {
    var cards = {};
    srsAddCards(sampleLesson, cards);
    var card = cards['v_5_0'];
    assert.equal(card.interval, 1);
    assert.equal(card.ease, 2.5);
    assert.equal(card.reps, 0);
  });

  QUnit.test('does not overwrite an existing card', function (assert) {
    var existing = { interval: 14, ease: 1.9, reps: 8, due: 42, front: 'ねこ', back: 'cat', type: 'vocab', id: 'v_5_0' };
    var cards = { 'v_5_0': existing };
    srsAddCards(sampleLesson, cards);
    assert.deepEqual(cards['v_5_0'], existing, 'existing card data must be preserved');
  });

  QUnit.test('returns true when new cards were added', function (assert) {
    var changed = srsAddCards(sampleLesson, {});
    assert.equal(changed, true);
  });

  QUnit.test('returns false when all cards already exist', function (assert) {
    var cards = {};
    srsAddCards(sampleLesson, cards); // first call adds them
    var changed = srsAddCards(sampleLesson, cards); // second call: nothing new
    assert.equal(changed, false);
  });
});


// ── 11. srsDueCards(cards) ───────────────────────────────────────────────────
