"use strict";

// Hash routes (lib.js parseRoute / routeHash). Ids are the shape of real catalog ids.
QUnit.module('url routing', function () {
  var IDS = ['n5.u001', 'n5.u002'];

  QUnit.test('empty, malformed and unknown hashes parse to null (app falls back to today)', function (assert) {
    assert.strictEqual(parseRoute('', IDS), null);
    assert.strictEqual(parseRoute('#', IDS), null);
    assert.strictEqual(parseRoute('#/nope', IDS), null);
    assert.strictEqual(parseRoute('#/unit', IDS), null, 'unit needs an id');
    assert.strictEqual(parseRoute('#/unit/n5.u001/done', IDS), null, 'only /quiz follows a unit id');
    assert.strictEqual(parseRoute('#/unit/%E0%A4%A/quiz', IDS), null, 'bad percent-encoding');
  });

  QUnit.test('top-level views parse, with or without the leading slash', function (assert) {
    ['today', 'units', 'review', 'stats', 'achievements', 'settings'].forEach(function (v) {
      assert.deepEqual(parseRoute('#/' + v, IDS), { view: v }, v);
      assert.deepEqual(parseRoute('#' + v, IDS), { view: v }, v + ' without slash');
    });
  });

  QUnit.test('unit and unit quiz routes carry the id', function (assert) {
    assert.deepEqual(parseRoute('#/unit/n5.u001', IDS), { view: 'unit', unitId: 'n5.u001', quiz: false });
    assert.deepEqual(parseRoute('#/unit/n5.u002/quiz', IDS), { view: 'unit', unitId: 'n5.u002', quiz: true });
  });

  QUnit.test('unknown unit id falls back to the units list, not an error', function (assert) {
    assert.deepEqual(parseRoute('#/unit/n5.u999/quiz', IDS), { view: 'units' });
  });

  QUnit.test('routeHash writes the same hash parseRoute reads', function (assert) {
    assert.strictEqual(routeHash({ view: 'today' }), '#/today');
    assert.strictEqual(routeHash({ view: 'unit', unitId: 'n5.u001', quiz: false }), '#/unit/n5.u001');
    assert.strictEqual(routeHash({ view: 'unit', unitId: 'n5.u001', quiz: true }), '#/unit/n5.u001/quiz');
    var r = { view: 'unit', unitId: 'n5.u002', quiz: true };
    assert.deepEqual(parseRoute(routeHash(r), IDS), r, 'round trip');
  });
});
