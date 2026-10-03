"use strict";

QUnit.module('theme', function () {
  QUnit.test('normalizeThemePrefs defaults to Aizome dark and keeps valid values', function (assert) {
    assert.deepEqual(normalizeThemePrefs(null, null), { palette: 'kokuban', theme: 'dark' });
    assert.deepEqual(normalizeThemePrefs('nope', 'sepia'), { palette: 'kokuban', theme: 'dark' });
    assert.deepEqual(normalizeThemePrefs('kokuban', 'light'), { palette: 'kokuban', theme: 'light' });
    THEME_PALETTES.forEach(function (p) {
      assert.equal(normalizeThemePrefs(p.id, 'dark').palette, p.id, p.id + ' is accepted');
    });
  });

  QUnit.test('LEVEL_COLORS has a level token per level', function (assert) {
    LEVELS.forEach(function (lv) {
      assert.strictEqual(LEVEL_COLORS[lv], 'var(--' + lv.toLowerCase() + ')');
    });
  });
});
