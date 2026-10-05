"use strict";

QUnit.module('navbar', function () {
  QUnit.test('nav tab labels: kanji JA with furigana readings', function (assert) {
    assert.deepEqual(UI_STRINGS.view_today, { en: 'Today', ja: '今日', rt: 'きょう' });
    assert.deepEqual(UI_STRINGS.view_units, { en: 'Stages', ja: 'ステージ' });
    assert.deepEqual(UI_STRINGS.view_stats, { en: 'Stats', ja: '統計', rt: 'とうけい' });
  });

  QUnit.test('every UI string has en + ja and no `since`', function (assert) {
    Object.keys(UI_STRINGS).forEach(function (k) {
      var s = UI_STRINGS[k];
      assert.ok(s.en && s.ja && !('since' in s), k);
    });
  });

  QUnit.test('t(): N5 all English; N4+ by learned kanji; catalog-less kanji English', function (assert) {
    var prev = window._uiLang, prevK = window._learnedKanji;
    window._uiLang = 'auto'; window._learnedKanji = { '今': true, '日': true };
    assert.equal(t('unit_label', 'N5'), 'Stage', 'N5 kana-only string stays English');
    assert.equal(t('view_today', 'N5'), 'Today', 'N5 kanji string stays English');
    assert.equal(t('unit_label', 'N4'), 'ステージ', 'N4 kana-only → ja');
    assert.equal(t('view_today', 'N4'), '今日', 'all kanji learned → ja');
    window._learnedKanji = { '今': true };
    assert.equal(t('view_today', 'N4'), 'Today', 'one kanji unlearned → en');
    window._learnedKanji = { '統': true, '計': true };
    assert.equal(t('view_stats', 'N1'), '統計', 'learned → ja');
    window._learnedKanji = {};
    assert.equal(t('view_stats', 'N1'), 'Stats', 'not learned (e.g. not in catalog) → en');
    assert.equal(t('nope_key', 'N1'), 'nope_key', 'unknown key → key');
    window._uiLang = prev; window._learnedKanji = prevK;
  });

  QUnit.test('t(): Settings language override (window._uiLang en/ja) wins', function (assert) {
    var prev = window._uiLang, prevK = window._learnedKanji;
    window._learnedKanji = {};
    window._uiLang = 'en'; assert.equal(t('view_review', 'N1'), 'Review');
    window._uiLang = 'ja'; assert.equal(t('view_review', 'N5'), '復習');
    window._uiLang = 'auto'; assert.equal(t('view_review', 'N5'), 'Review');
    window._uiLang = prev; window._learnedKanji = prevK;
  });

  QUnit.test('learnedKanji: kanji of completed (incl. skipped) units only', function (assert) {
    var k = function (c) { return { id: 'k:' + c, kind: 'kanji', char: c }; };
    var units = [{ id: 'u1', kanji: [k('日')] }, { id: 'u2', kanji: [k('本')] }, { id: 'u3', kanji: [k('語')] }];
    // a placement skip marks the unit done like any completion
    assert.deepEqual(learnedKanji(units, new Set(['u1', 'u3'])), { '日': true, '語': true });
    assert.deepEqual(learnedKanji(units, new Set()), {});
  });

  QUnit.test('tRuby: plain string unless JA kanji label with furigana on', function (assert) {
    var prev = window._uiLang, prevK = window._learnedKanji; window._uiLang = 'auto'; window._learnedKanji = { '今': true, '日': true };
    assert.equal(tRuby('view_today', 'N5', true), 'Today');
    assert.equal(tRuby('view_today', 'N4', false), '今日');
    if (typeof React !== 'undefined') { // tests.html doesn't load React
      assert.equal(typeof tRuby('view_today', 'N4', true), 'object', 'ruby element');
    }
    assert.equal(tRuby('unit_label', 'N4', true), 'ステージ', 'no rt → plain t()');
    window._uiLang = prev; window._learnedKanji = prevK;
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
