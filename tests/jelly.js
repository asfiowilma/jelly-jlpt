"use strict";

QUnit.module('jelly', function () {
  QUnit.test('every mood has a closed path inside the viewBox, base on the floor', function (assert) {
    Object.keys(JELLY_MOODS).forEach(function (m) {
      var d = jellyPath(m), nums = d.slice(1, -1).split('L').map(function (p) { return p.split(',').map(Number); });
      assert.ok(/^M[\d.,L-]+Z$/.test(d), m + ' path is well-formed');
      var ys = nums.map(function (p) { return p[1]; }), xs = nums.map(function (p) { return p[0]; });
      assert.ok(Math.max.apply(null, ys) <= 493 && Math.min.apply(null, ys) >= 0, m + ' sits on the floor, inside the box');
      assert.ok(Math.min.apply(null, xs) >= -20 && Math.max.apply(null, xs) <= 532, m + ' stays near the box width');
    });
  });
  QUnit.test('jelly() falls back to idle for an unknown mood', function (assert) {
    assert.ok(jelly('nope', 24));
  });
});
