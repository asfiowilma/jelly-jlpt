QUnit.module('prep guide', function () {
  var units = buildUnits(PLAN, CATALOG);
  var guided = units.filter(function (u) { return u.kind === 'prep' || u.kind === 'mock'; });
  var strings = function (g) {
    var out = [g.lead, g.time];
    g.kinds.forEach(function (k) { out.push(k.ask, k.trap, k.tip); });
    (g.rules || []).forEach(function (r) { out.push(r[0], r[1]); });
    return out.filter(Boolean);
  };
  var marks = function (s) { return (s.match(/\*\*/g) || []).length; };

  QUnit.test('every prep and mock unit has a guide that survives buildUnits', function (assert) {
    assert.equal(guided.length, 7, 'u106-u112');
    guided.forEach(function (u) {
      var g = u.guide;
      assert.ok(g && g.lead && g.facts.length && g.kinds.length && g.kindsLabel, u.id);
    });
  });

  QUnit.test('kinds are complete; jp may be empty only on the weak-spot unit', function (assert) {
    guided.forEach(function (u) {
      u.guide.kinds.forEach(function (k) {
        assert.ok(k.en && k.ask && k.trap && k.tip, u.id + ' ' + k.en);
        if (!k.jp) assert.equal(u.title.indexOf('After the mock'), 0, u.id + ' empty jp');
      });
    });
  });

  QUnit.test('mock kinds carry minutes, prep kinds do not; the parts sum to 90', function (assert) {
    guided.forEach(function (u) {
      u.guide.kinds.forEach(function (k) { assert.equal(typeof k.min, u.kind === 'mock' ? 'number' : 'undefined', u.id); });
      if (u.kind === 'mock') assert.ok(u.guide.rules.length > 0, u.id + ' rules');
    });
    var m = guided.filter(function (u) { return u.id === 'n5.u110'; })[0];
    assert.equal(m.guide.kinds.reduce(function (n, k) { return n + k.min; }, 0), 90);
  });

  QUnit.test('** markers are balanced; at most one highlight per trap and in time', function (assert) {
    guided.forEach(function (u) {
      strings(u.guide).forEach(function (s) { assert.equal(marks(s) % 2, 0, u.id + ': ' + s); });
      u.guide.kinds.forEach(function (k) { assert.ok(marks(k.trap) <= 2, u.id + ' trap ' + k.en); });
      if (u.guide.time) assert.ok(marks(u.guide.time) <= 2, u.id + ' time');
    });
  });
});
