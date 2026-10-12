"use strict";

// buildsOf(unit, n): n buildExercises() runs of one catalog unit, flattened into one list.
// buildExercises is slow and random, and many tests asked for the same units again and again.
// Results are memoized per (unit id, n) for the whole run, so tests with the same n share one set of builds.
// Loads first (the _ prefix sorts before the rest): tests.html and run-tests.js both load it before the tests.
var _buildsMemo = {};
function buildsOf(unit, n) {
  var key = unit.id + '|' + n;
  if (!_buildsMemo[key]) {
    var out = [];
    for (var r = 0; r < n; r++) out = out.concat(buildExercises(unit));
    _buildsMemo[key] = out;
  }
  return _buildsMemo[key];
}
