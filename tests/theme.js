"use strict";

QUnit.module('theme', function () {
  QUnit.test('phaseTone level agrees with dayToLevel for every lesson', function (assert) {
    var bad = curriculum.filter(function (l) { return phaseTone(l.phaseNum).level !== dayToLevel(l.day); });
    assert.equal(bad.length, 0, 'mismatched days: ' + bad.map(function (l) { return l.day; }).slice(0, 5).join(','));
  });

  QUnit.test('phaseTone steps are distinct and centred on 0 within each level', function (assert) {
    Object.keys(LEVEL_PHASES).forEach(function (lv) {
      var r = LEVEL_PHASES[lv], steps = [];
      for (var p = r[0]; p <= r[1]; p++) steps.push(phaseTone(p).step);
      var sum = steps.reduce(function (a, b) { return a + b; }, 0);
      assert.equal(sum, 0, lv + ' steps sum to 0');
      assert.equal(new Set(steps).size, steps.length, lv + ' steps are distinct');
    });
    assert.strictEqual(phaseTone(0), null, 'unknown phase → null');
    assert.strictEqual(phaseTone(33), null, 'unknown phase → null');
  });

  QUnit.test('PHASE_COLORS derive from the level token and differ within a level', function (assert) {
    for (var p = 1; p <= 32; p++) {
      var lv = phaseTone(p).level.toLowerCase();
      assert.ok(PHASE_COLORS[p].indexOf('var(--' + lv + ')') !== -1, 'phase ' + p + ' uses --' + lv);
      assert.ok(PHASE_BG[p].indexOf(PHASE_COLORS[p]) !== -1, 'PHASE_BG[' + p + '] tints PHASE_COLORS[' + p + ']');
    }
    assert.notEqual(PHASE_COLORS[1], PHASE_COLORS[2], 'neighbouring phases differ');
  });

  QUnit.test('normalizeThemePrefs defaults to Aizome dark and keeps valid values', function (assert) {
    assert.deepEqual(normalizeThemePrefs(null, null), { palette: 'ai', theme: 'dark' });
    assert.deepEqual(normalizeThemePrefs('nope', 'sepia'), { palette: 'ai', theme: 'dark' });
    assert.deepEqual(normalizeThemePrefs('kokuban', 'light'), { palette: 'kokuban', theme: 'light' });
    THEME_PALETTES.forEach(function (p) {
      assert.equal(normalizeThemePrefs(p.id, 'dark').palette, p.id, p.id + ' is accepted');
    });
  });

  QUnit.test('validateProgressData accepts the theme keys', function (assert) {
    assert.ok(validateProgressData({ version: 1, keys: { jlpt_palette: 'shu', jlpt_theme: 'light' } }).valid);
  });
});
