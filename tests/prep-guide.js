QUnit.module('prep guide', function () {
  var units = buildUnits(PLAN, CATALOG);
  var guided = units.filter(function (u) { return u.kind === 'prep' || u.kind === 'mock'; });
  var strings = function (g) {
    var out = [g.lead, g.time, g.glance, g.partJp];
    g.kinds.forEach(function (k) { out.push(k.jp, k.en, k.ask, k.trap, k.tip, k.eg); });
    (g.rules || []).forEach(function (r) { out.push(r[0], r[1]); });
    return out.filter(Boolean);
  };
  var marks = function (s) { return (s.match(/\*\*/g) || []).length; };

  // Each planned level ends with the same 7-unit block: 4 section preps, mock 1, the fix-up drill, mock 2.
  var ofLevel = function (lv) { return guided.filter(function (u) { return u.level === lv; }); };

  QUnit.test('every prep and mock unit has a guide that survives buildUnits', function (assert) {
    PLAN.forEach(function (p) { assert.equal(ofLevel(p.level).length, 7, p.level + ': 7 guided units (N5 u106-u112)'); });
    guided.forEach(function (u) {
      var g = u.guide;
      assert.ok(g && g.lead && g.kinds.length && g.kindsLabel, u.id);
      assert.notOk('facts' in g, u.id + ' no facts line');
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

  QUnit.test('mock kinds carry minutes, prep kinds do not; the parts sum to the level\'s test (N5 90, N4 115)', function (assert) {
    guided.forEach(function (u) {
      u.guide.kinds.forEach(function (k) { assert.equal(typeof k.min, u.kind === 'mock' ? 'number' : 'undefined', u.id); });
      if (u.kind === 'mock') assert.ok(u.guide.rules.length > 0, u.id + ' rules');
    });
    PLAN.forEach(function (p) {
      var m = ofLevel(p.level).filter(function (u) { return u.kind === 'mock'; })[0];
      var total = mockMinutes(p.level).reduce(function (a, b) { return a + b; }, 0);
      assert.equal(m.guide.kinds.reduce(function (n, k) { return n + k.min; }, 0), total, m.id + ': ' + total + ' min');
      assert.deepEqual(m.guide.kinds.map(function (k) { return k.min; }), mockMinutes(p.level), m.id + ' part minutes');
    });
    assert.equal(mockMinutes('N5').reduce(function (a, b) { return a + b; }, 0), 90);
    assert.equal(mockMinutes('N4').reduce(function (a, b) { return a + b; }, 0), 115);
  });

  QUnit.test('** markers are balanced; at most one highlight per trap and in time', function (assert) {
    guided.forEach(function (u) {
      strings(u.guide).forEach(function (s) { assert.equal(marks(s) % 2, 0, u.id + ': ' + s); });
      u.guide.kinds.forEach(function (k) { assert.ok(marks(k.trap) <= 2, u.id + ' trap ' + k.en); });
      if (u.guide.time) assert.ok(marks(u.guide.time) <= 2, u.id + ' time');
    });
  });

  QUnit.test('part and glance: prep stages 1-4 only, part 0-2', function (assert) {
    guided.forEach(function (u) {
      var g = u.guide, lit = ofLevel(u.level).indexOf(u) < 4; // the four section preps (N5 u106-u109)
      assert.equal(g.part != null, lit, u.id + ' part');
      assert.equal(!!g.glance, lit, u.id + ' glance');
      if (lit) assert.ok(g.part >= 0 && g.part <= 2, u.id + ' range');
    });
  });

  QUnit.test('furigana markup: balanced, kana readings, no bare kanji, plain text clean', function (assert) {
    var kanji = /[㐀-鿿豈-﫿]/;
    guided.forEach(function (u) {
      strings(u.guide).forEach(function (s) {
        assert.equal((s.match(/\[/g) || []).length, (s.match(/\]/g) || []).length, u.id + ' balanced: ' + s);
        var bare = '';
        furiganaParts(s).forEach(function (p) {
          if (p.r) assert.ok(/^[぀-ヿー]+$/.test(p.r), u.id + ' reading ' + p.r);
          else bare += p.t;
        });
        assert.notOk(kanji.test(bare), u.id + ' bare kanji: ' + s);
        var plain = furiganaParts(s).map(function (p) { return p.t; }).join('');
        assert.notOk(/[\[\]|]/.test(plain), u.id + ' stray markup: ' + s);
        assert.notOk(/—/.test(s), u.id + ' em dash');
      });
    });
  });
});
