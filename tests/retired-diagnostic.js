"use strict";

// The diagnostic mock is gone: no catalog entry, blueprint, route, achievement or overview hook remains.
QUnit.module('retired diagnostic', function () {
  var total = function (o) { return Object.keys(o).reduce(function (n, k) { return n + o[k]; }, 0); };
  var bpTotal = function (lv) {
    var full = MOCK_BLUEPRINT[lv].full;
    return Object.keys(full).reduce(function (n, s) { return n + total(full[s]); }, 0);
  };
  var count = function (m) { return Object.keys(m.sections).reduce(function (n, s) { return n + m.sections[s].length; }, 0); };

  QUnit.test('no third mock exists at N5 or N4', function (assert) {
    ['n5', 'n4'].forEach(function (l) { assert.notOk(CATALOG.items['x:' + l + '-mock-3'], l + ' mock 3 absent'); });
  });

  QUnit.test('the two full mocks per level remain and match the full blueprint total', function (assert) {
    ['N5', 'N4'].forEach(function (lv) {
      var l = lv.toLowerCase();
      [1, 2].forEach(function (n) {
        var m = CATALOG.items['x:' + l + '-mock-' + n];
        assert.ok(m, lv + ' mock ' + n + ' exists');
        assert.strictEqual(m.format, 'full', lv + ' mock ' + n + ' is full');
        assert.strictEqual(count(m), bpTotal(lv), lv + ' mock ' + n + ' question total');
      });
    });
  });

  QUnit.test('the blueprint has only the full format', function (assert) {
    ['N5', 'N4'].forEach(function (lv) {
      assert.notOk('diagnostic' in MOCK_BLUEPRINT[lv], lv + ' has no diagnostic blueprint');
      assert.deepEqual(Object.keys(MOCK_BLUEPRINT[lv]), ['full'], lv);
    });
  });

  QUnit.test('the diagnostic route is unknown and parses to null', function (assert) {
    assert.strictEqual(ROUTE_VIEWS.indexOf('diagnostic'), -1);
    assert.strictEqual(parseRoute('#/diagnostic', ['n5.u001']), null);
  });

  QUnit.test('no diagnostic achievements are defined', function (assert) {
    var ids = ACHIEVEMENTS.map(function (a) { return a.id; });
    assert.strictEqual(ids.indexOf('n5-diagnostic'), -1);
    assert.strictEqual(ids.indexOf('n4-diag-first'), -1);
    assert.deepEqual(ids.filter(function (i) { return /diag/.test(i); }), [], 'no diag-like id at all');
  });

  QUnit.test('the overview panel, its helper and its string are gone', function (assert) {
    assert.strictEqual(typeof DiagnosticPanel, 'undefined');
    assert.strictEqual(typeof diagnosticMockId, 'undefined');
    assert.notOk('pt_diag' in UI_STRINGS);
  });
});
