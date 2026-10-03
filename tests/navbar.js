"use strict";

QUnit.module('navbar', function () {
  QUnit.test('nav tab labels: kanji JA with furigana readings', function (assert) {
    assert.deepEqual(UI_STRINGS.view_today, { en: 'Today', ja: '今日', rt: 'きょう', since: 'N4' });
    assert.deepEqual(UI_STRINGS.view_units, { en: 'Units', ja: '単元', rt: 'たんげん', since: 'N1' });
    assert.deepEqual(UI_STRINGS.view_stats, { en: 'Stats', ja: '統計', rt: 'とうけい', since: 'N1' });
    assert.deepEqual(UI_STRINGS.view_review, { en: 'Review', ja: '復習', rt: 'ふくしゅう', since: 'N4' });
  });

  QUnit.test('every UI string has en + ja and a valid `since` level', function (assert) {
    Object.keys(UI_STRINGS).forEach(function (k) {
      var s = UI_STRINGS[k];
      assert.ok(s.en && s.ja && levelRank(s.since) >= 0, k);
    });
  });

  QUnit.test('t(): labels switch EN→JA at the `since` level (Q23)', function (assert) {
    var prev = window._uiLang; window._uiLang = 'auto';
    assert.equal(t('view_today', 'N5'), 'Today');
    assert.equal(t('view_today', 'N4'), '今日');
    assert.equal(t('view_today', 'N1'), '今日', 'stays JA at later levels');
    assert.equal(t('view_units', 'N2'), 'Units');
    assert.equal(t('view_units', 'N1'), '単元');
    assert.equal(t('nope_key', 'N1'), 'nope_key', 'unknown key → key');
    window._uiLang = prev;
  });

  QUnit.test('t(): Settings language override (window._uiLang en/ja) wins', function (assert) {
    var prev = window._uiLang;
    window._uiLang = 'en'; assert.equal(t('view_review', 'N1'), 'Review');
    window._uiLang = 'ja'; assert.equal(t('view_review', 'N5'), '復習');
    window._uiLang = 'auto'; assert.equal(t('view_review', 'N5'), 'Review');
    window._uiLang = prev;
  });

  QUnit.test('tRuby: plain string unless JA kanji label with furigana on', function (assert) {
    var prev = window._uiLang; window._uiLang = 'auto';
    assert.equal(tRuby('view_today', 'N5', true), 'Today');
    assert.equal(tRuby('view_today', 'N4', false), '今日');
    if (typeof React !== 'undefined') { // tests.html doesn't load React
      assert.equal(typeof tRuby('view_today', 'N4', true), 'object', 'ruby element');
    }
    assert.equal(tRuby('unit_label', 'N4', true), 'ユニット', 'no rt → plain t()');
    window._uiLang = prev;
  });

  QUnit.test('furiganaOn: stored pref wins, unset defaults on through N2', function (assert) {
    assert.strictEqual(furiganaOn('true', 'N1'), true);
    assert.strictEqual(furiganaOn('false', 'N5'), false);
    assert.strictEqual(furiganaOn(null, 'N5'), true);
    assert.strictEqual(furiganaOn(null, 'N2'), true);
    assert.strictEqual(furiganaOn(null, 'N1'), false);
  });

  QUnit.test('levelRank orders N5 → N1', function (assert) {
    assert.deepEqual(LEVELS.map(levelRank), [0, 1, 2, 3, 4]);
    assert.strictEqual(levelRank('N6'), -1);
  });
});
