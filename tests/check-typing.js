"use strict";

QUnit.module('checkTyping', function () {

  QUnit.test('exact match passes', function (assert) {
    assert.ok(checkTyping('cat', ['cat']));
  });

  QUnit.test('case-insensitive: uppercase user input passes', function (assert) {
    assert.ok(checkTyping('CAT', ['cat']));
  });

  QUnit.test('case-insensitive: uppercase answer passes', function (assert) {
    assert.ok(checkTyping('cat', ['CAT']));
  });

  QUnit.test('leading/trailing whitespace in user answer is trimmed', function (assert) {
    assert.ok(checkTyping('  cat  ', ['cat']));
  });

  QUnit.test('leading/trailing whitespace in answer entry is trimmed', function (assert) {
    assert.ok(checkTyping('cat', ['  cat  ']));
  });

  QUnit.test('wrong answer fails', function (assert) {
    assert.notOk(checkTyping('dog', ['cat']));
  });

  QUnit.test('empty user input does not match non-empty answer', function (assert) {
    assert.notOk(checkTyping('', ['cat']));
  });

  QUnit.test('slash-separated alternative: first part matches', function (assert) {
    // e.g. "sake/salmon" in the answer list
    assert.ok(checkTyping('sake', ['sake/salmon']));
  });

  QUnit.test('slash-separated alternative: second part matches', function (assert) {
    assert.ok(checkTyping('salmon', ['sake/salmon']));
  });

  QUnit.test('comma-separated alternative: first part matches', function (assert) {
    // e.g. "flower,nose" in the answer list
    assert.ok(checkTyping('flower', ['flower,nose']));
  });

  QUnit.test('comma-separated alternative: second part matches', function (assert) {
    assert.ok(checkTyping('nose', ['flower,nose']));
  });

  QUnit.test('matches any entry in a multi-answer array', function (assert) {
    assert.ok(checkTyping('bird', ['cat', 'bird', 'fish']));
  });

  QUnit.test('fails when no entry matches', function (assert) {
    assert.notOk(checkTyping('horse', ['cat', 'dog', 'fish']));
  });

  QUnit.test('alternatives matching is case-insensitive', function (assert) {
    assert.ok(checkTyping('SALMON', ['sake/salmon']));
  });

  QUnit.test('trailing punctuation in user input is ignored', function (assert) {
    assert.ok(checkTyping('hey!', ['hey']));
  });

  QUnit.test('trailing question mark in user input is ignored', function (assert) {
    assert.ok(checkTyping('hello?', ['hello']));
  });

  QUnit.test('punctuation in answer is ignored when user omits it', function (assert) {
    assert.ok(checkTyping('hello', ['hello!']));
  });

  QUnit.test('punctuation ignored for slash-separated alternatives', function (assert) {
    assert.ok(checkTyping('sake!', ['sake/salmon']));
  });

  QUnit.test('missing/empty answers returns false instead of throwing', function (assert) {
    assert.strictEqual(checkTyping('cat', undefined), false);
    assert.strictEqual(checkTyping('cat', []), false);
    assert.strictEqual(checkTyping('cat', [undefined]), false);
  });
});


// ── 3. Card ID helper — cardId(type, day, idx) ───────────────────────────────
