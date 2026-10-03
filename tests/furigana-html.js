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

QUnit.module('furiganaParts', function () {
  QUnit.test('block reading, per-kanji readings, plain text', function (assert) {
    assert.deepEqual(furiganaParts('[毎日|まい|にち]ここで[食|た]べる。'),
      [{ t: '毎', r: 'まい' }, { t: '日', r: 'にち' }, { t: 'ここで' }, { t: '食', r: 'た' }, { t: 'べる。' }]);
    assert.deepEqual(furiganaParts('[今日|きょう]は'), [{ t: '今日', r: 'きょう' }, { t: 'は' }], 'one reading for the block');
    assert.deepEqual(furiganaParts('これは本です。'), [{ t: 'これは本です。' }], 'no brackets');
  });

  QUnit.test('every shipped sentence furigana rebuilds its jp text', function (assert) {
    var bad = catalogOf('sentence').filter(function (s) {
      return s.furigana && furiganaParts(s.furigana).map(function (p) { return p.t; }).join('') !== s.jp;
    }).map(function (s) { return s.id; });
    assert.deepEqual(bad, []);
  });
});
