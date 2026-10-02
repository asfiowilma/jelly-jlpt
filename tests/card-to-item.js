"use strict";

QUnit.module('cardToItem', function () {

  QUnit.test('vocab card resolves to correct fields', function (assert) {
    // Day 1, vocab[0] = ["いえ","いえ","house"]
    var item = cardToItem('v_1_0', {});
    assert.equal(item.type, 'vocab');
    assert.equal(item.front, 'いえ');
    assert.equal(item.back, 'house');
    assert.equal(item.day, 1);
  });

  QUnit.test('char card resolves to correct fields', function (assert) {
    // Day 1, chars[0] = ["あ","a"]
    var item = cardToItem('c_1_0', {});
    assert.equal(item.type, 'char');
    assert.equal(item.front, 'あ');
    assert.equal(item.back, 'a');
    assert.equal(item.day, 1);
  });

  QUnit.test('reading is null when reading equals front (pure hiragana vocab)', function (assert) {
    // Day 1 vocab[0]: front="いえ", reading="いえ" — same, so reading should be null
    var item = cardToItem('v_1_0', {});
    assert.equal(item.reading, null,
      'reading should be null when the reading string matches the front');
  });

  QUnit.test('out-of-range day index returns null', function (assert) {
    assert.equal(cardToItem('v_99999_0', {}), null);
  });

  QUnit.test('out-of-range vocab index returns null', function (assert) {
    assert.equal(cardToItem('v_1_999', {}), null);
  });

  QUnit.test('out-of-range char index returns null', function (assert) {
    assert.equal(cardToItem('c_1_999', {}), null);
  });

  QUnit.test('day 0 (non-existent) returns null', function (assert) {
    assert.equal(cardToItem('v_0_0', {}), null);
  });
});


// ── 7. Array shuffle — rndShuffle(arr) ───────────────────────────────────────
