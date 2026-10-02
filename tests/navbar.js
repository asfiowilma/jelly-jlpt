"use strict";

QUnit.module('navbar', function () {
  QUnit.test('nav tab labels: kanji JA with furigana readings', function (assert) {
    assert.deepEqual(UI_STRINGS.view_today, { en: 'Today', ja: '今日', rt: 'きょう', since: 38 });
    assert.deepEqual(UI_STRINGS.view_overview, { en: 'Overview', ja: '一覧', rt: 'いちらん', since: 1044 });
    assert.deepEqual(UI_STRINGS.view_review, { en: 'Review', ja: '復習', rt: 'ふくしゅう', since: 49 });
  });

  QUnit.test('nav tab labels switch EN→JA at `since`', function (assert) {
    var prev = window._uiLang; window._uiLang = 'auto';
    assert.equal(t('view_today', 37), 'Today');
    assert.equal(t('view_today', 38), '今日');
    assert.equal(t('view_overview', 1043), 'Overview');
    assert.equal(t('view_overview', 1044), '一覧');
    assert.equal(t('view_review', 48), 'Review');
    assert.equal(t('view_review', 49), '復習');
    window._uiLang = prev;
  });

  QUnit.test('t(): window._uiLang en/ja overrides the progressive switch', function (assert) {
    var prev = window._uiLang;
    window._uiLang = 'en'; assert.equal(t('view_review', 1700), 'Review');
    window._uiLang = 'ja'; assert.equal(t('view_review', 1), '復習');
    window._uiLang = 'auto'; assert.equal(t('view_review', 1), 'Review');
    window._uiLang = prev;
  });

  QUnit.test('settings strings: every set_*/settings_* key has en + ja', function (assert) {
    Object.keys(UI_STRINGS).filter(function (k) { return /^(set_|settings_)/.test(k); }).forEach(function (k) {
      assert.ok(UI_STRINGS[k].en && UI_STRINGS[k].ja, k);
    });
  });

  QUnit.test('furiganaOn: stored pref wins, unset defaults on through day 1320', function (assert) {
    assert.strictEqual(furiganaOn('true', 1700), true);
    assert.strictEqual(furiganaOn('false', 1), false);
    assert.strictEqual(furiganaOn(null, 1320), true);
    assert.strictEqual(furiganaOn(null, 1321), false);
  });

  QUnit.test('levelRamp: segments sized by level day ranges', function (assert) {
    var r = levelRamp(1, 1720);
    assert.deepEqual(r.segments.map(function (s) { return s.level + ':' + s.start + '+' + s.len; }),
      ['N5:1+365', 'N4:366+295', 'N3:661+300', 'N2:961+360', 'N1:1321+400']);
  });

  QUnit.test('levelRamp: filled up to and including the current day', function (assert) {
    var fills = function (day) { return levelRamp(day, 1720).segments.map(function (s) { return Math.round(s.fill); }); };
    assert.deepEqual(fills(1), [0, 0, 0, 0, 0]);
    assert.deepEqual(fills(365), [100, 0, 0, 0, 0]);
    assert.deepEqual(fills(513), [100, 50, 0, 0, 0]);
    assert.deepEqual(fills(1720), [100, 100, 100, 100, 100]);
    assert.ok(Math.abs(levelRamp(860, 1720).here - 50) < 0.1, 'marker at the middle for day 860');
  });
});
