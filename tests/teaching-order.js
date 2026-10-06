"use strict";

// Teaching order (audit P1-1, docs/adr/0002): sentences shown or asked in a lesson use only items
// (by `uses`) taught by that lesson.
QUnit.module('teaching order', function () {
  var lessons = function () { return buildUnits(PLAN, CATALOG).filter(function (u) { return u.level === 'N5' && u.kind === 'lesson'; }); };
  // later(s, known): s.uses not taught yet; another spelling (alt) counts with the one the plan teaches
  var later = function (s, known) {
    return (s.uses || []).filter(function (id) { var it = CATALOG.items[id]; return !known[id] && !(it && it.alt && known[it.alt]); });
  };

  QUnit.test('every lesson grammar point has 3 examples using nothing taught later', function (assert) {
    var short = [];
    lessons().forEach(function (u) {
      var known = taughtIds(u);
      (u.grammar || []).forEach(function (g) {
        var clean = (g.examples || []).filter(function (id) { return !later(CATALOG.items[id], known).length; });
        if (clean.length < 3) short.push(u.id + ' ' + g.id + ' ' + clean.length);
      });
    });
    assert.deepEqual(short, [], 'points short of clean examples');
  });
});
