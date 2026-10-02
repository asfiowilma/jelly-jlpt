"use strict";

QUnit.module('furiganaHTML', function () {
  QUnit.test('returns ruby tags for kanji word with reading', function (assert) {
    var result = furiganaHTML('食べる', 'たべる');
    assert.ok(result.indexOf('<ruby>') >= 0, 'contains ruby tag');
    assert.ok(result.indexOf('<rt>') >= 0, 'contains rt tag');
    assert.ok(result.indexOf('たべる') >= 0, 'contains reading');
  });

  QUnit.test('returns plain text for hiragana word', function (assert) {
    var result = furiganaHTML('たべる', 'たべる');
    assert.equal(result, 'たべる', 'no ruby for hiragana-only');
  });

  QUnit.test('returns plain text when reading matches word', function (assert) {
    var result = furiganaHTML('abc', 'abc');
    assert.equal(result, 'abc');
  });

  QUnit.test('returns word when no reading provided', function (assert) {
    assert.equal(furiganaHTML('test', null), 'test');
    assert.equal(furiganaHTML('test', ''), 'test');
  });
});
