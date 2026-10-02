"use strict";

QUnit.module('validateProgressData', function () {
  QUnit.test('accepts a valid progress object', function (assert) {
    var data = { version: 1, exported: '2026-01-01T00:00:00.000Z', keys: { n5_day: '5', n5_completed: '[]' } };
    var result = validateProgressData(data);
    assert.ok(result.valid, 'valid object passes');
    assert.strictEqual(result.error, null);
  });
  QUnit.test('rejects non-object input', function (assert) {
    assert.notOk(validateProgressData(null).valid, 'null fails');
    assert.notOk(validateProgressData('string').valid, 'string fails');
  });
  QUnit.test('rejects wrong version', function (assert) {
    var result = validateProgressData({ version: 2, keys: {} });
    assert.notOk(result.valid, 'wrong version fails');
    assert.ok(result.error.indexOf('version') !== -1, 'error mentions version');
  });
  QUnit.test('rejects missing keys field', function (assert) {
    var result = validateProgressData({ version: 1 });
    assert.notOk(result.valid);
    assert.ok(result.error.indexOf('keys') !== -1);
  });
  QUnit.test('rejects unknown key in keys', function (assert) {
    var result = validateProgressData({ version: 1, keys: { malicious_key: 'x' } });
    assert.notOk(result.valid, 'unknown key fails');
    assert.ok(result.error.indexOf('unknown') !== -1, 'error mentions unknown');
  });
  QUnit.test('accepts empty keys object', function (assert) {
    var result = validateProgressData({ version: 1, keys: {} });
    assert.ok(result.valid, 'empty keys passes');
  });
  QUnit.test('accepts all known keys', function (assert) {
    var keys = { n5_day: '1', n5_completed: '[]', n5_furigana: 'true', n5_srs: '{}', n5_2025: '{}', jlpt_tts_rate: '0.85' };
    var result = validateProgressData({ version: 1, keys: keys });
    assert.ok(result.valid, 'all known keys pass');
  });
});
