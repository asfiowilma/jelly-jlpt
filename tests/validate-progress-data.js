"use strict";

QUnit.module('validateProgressData', function () {
  var ok = { _id: 'unit:n5.u001', done: true, completedAt: 5, updatedAt: 1 };
  var card = { _id: 'card:v:家族|かぞく', interval: 1, ease: 2.5, due: 1, reps: 0, updatedAt: 1 };
  function err(data) { return validateProgressData(data).error || ''; }

  QUnit.test('accepts a valid v3 file', function (assert) {
    var r = validateProgressData({ version: 3, docs: [ok, card, { _id: 'card:k:人', interval: 1, ease: 2.5, due: 1, reps: 0, updatedAt: 1 },
      { _id: 'card:g:te-mo-ii', interval: 1, ease: 2.5, due: 1, reps: 0, updatedAt: 1 }, { _id: 'prefs:learning', currentUnit: 'n5.u001', pace: 1, updatedAt: 1 }] });
    assert.ok(r.valid, r.error);
    assert.strictEqual(r.error, null);
  });

  QUnit.test('rejects non-objects and old versions (v1 localStorage dump, v2 day docs)', function (assert) {
    assert.notOk(validateProgressData(null).valid);
    assert.notOk(validateProgressData('string').valid);
    assert.ok(err({ version: 1, keys: {} }).indexOf('version') !== -1);
    assert.ok(err({ version: 2, docs: [] }).indexOf('version') !== -1);
  });

  QUnit.test('rejects malformed docs', function (assert) {
    assert.ok(err({ version: 3 }).indexOf('docs') !== -1, 'missing docs');
    assert.ok(err({ version: 3, docs: [{ _id: 'evil', updatedAt: 1 }] }).indexOf('bad doc id') !== -1);
    assert.ok(err({ version: 3, docs: [{ _id: 'day:1', done: true, updatedAt: 1 }] }).indexOf('bad doc id') !== -1, 'old day docs');
    assert.ok(err({ version: 3, docs: [{ _id: 'card:v_1_0', interval: 1, ease: 2.5, due: 1, reps: 0, updatedAt: 1 }] }).indexOf('bad doc id') !== -1, 'old card ids');
    assert.ok(err({ version: 3, docs: [{ _id: 'unit:n5.u001', done: true }] }).indexOf('updatedAt') !== -1);
    assert.ok(err({ version: 3, docs: [{ _id: 'unit:n5.u001', done: 'yes', updatedAt: 1 }] }).indexOf('done') !== -1);
    assert.ok(err({ version: 3, docs: [{ _id: 'card:k:人', updatedAt: 1 }] }).indexOf('SRS') !== -1);
  });

  QUnit.test('device prefs: known string keys only', function (assert) {
    assert.ok(err({ version: 3, docs: [ok], device: { n5_srs: '{}' } }).indexOf('unknown device key') !== -1);
    assert.ok(err({ version: 3, docs: [ok], device: { jlpt_theme: 1 } }).indexOf('not a string') !== -1);
    assert.ok(validateProgressData({ version: 3, docs: [ok], device: { jlpt_theme: 'dark', jlpt_palette: 'shu' } }).valid);
  });
});
