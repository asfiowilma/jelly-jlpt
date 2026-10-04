"use strict";

// PWA helpers (ticket 42): storage persist runs once per device after the first progress; install state.
QUnit.module('pwa', function () {
  function fakeLs() {
    var d = {};
    return { get: function (k) { return d[k] === undefined ? null : d[k]; }, set: function (k, v) { d[k] = String(v); } };
  }
  function fakeStorage(grant) {
    var s = { calls: 0 };
    s.persist = function () { s.calls++; return Promise.resolve(grant); };
    return s;
  }
  var progress = [{ _id: 'unit:n5.u001' }], none = [{ _id: 'prefs:learning' }];

  QUnit.test('persistOnce waits for the first progress doc', function (assert) {
    var st = fakeStorage(true), ls = fakeLs();
    return persistOnce(none, st, ls).then(function (r) {
      assert.strictEqual(r, null);
      assert.equal(st.calls, 0);
      assert.strictEqual(ls.get(PERSIST_KEY), null);
    });
  });

  QUnit.test('persistOnce asks once, remembers the outcome, never asks again', function (assert) {
    var st = fakeStorage(true), ls = fakeLs();
    return persistOnce(progress, st, ls).then(function (r) {
      assert.equal(r, 'granted');
      return persistOnce(progress, st, ls);
    }).then(function (r) {
      assert.equal(r, 'granted');
      assert.equal(st.calls, 1, 'persist() called once');
    });
  });

  QUnit.test('persistOnce: a denial is remembered too (no nagging)', function (assert) {
    var st = fakeStorage(false), ls = fakeLs();
    return persistOnce(progress, st, ls).then(function (r) {
      assert.equal(r, 'denied');
      return persistOnce(progress, st, ls);
    }).then(function (r) {
      assert.equal(r, 'denied');
      assert.equal(st.calls, 1);
    });
  });

  QUnit.test('persistOnce: unsupported or throwing storage is not remembered', function (assert) {
    var ls = fakeLs();
    var bad = { persist: function () { return Promise.reject(new Error('no')); } };
    return persistOnce(progress, undefined, ls).then(function (r) {
      assert.equal(r, 'unsupported');
      return persistOnce(progress, bad, ls);
    }).then(function (r) {
      assert.equal(r, 'unsupported');
      assert.strictEqual(ls.get(PERSIST_KEY), null);
    });
  });

  QUnit.test('the persist outcome is device-only, never exported', function (assert) {
    assert.strictEqual(DEVICE_PREF_KEYS.indexOf(PERSIST_KEY), -1);
  });

  QUnit.test('pwaInstallState covers every card state', function (assert) {
    var base = { http: true, standalone: false, hasPrompt: false, ios: false };
    function st(o) { return pwaInstallState(Object.assign({}, base, o)); }
    assert.equal(st({}), 'none');
    assert.equal(st({ hasPrompt: true }), 'prompt');
    assert.equal(st({ ios: true }), 'ios');
    assert.equal(st({ standalone: true, hasPrompt: true }), 'installed');
    assert.equal(st({ http: false }), 'hidden', 'file://');
    assert.equal(st({ http: false, standalone: true }), 'installed');
  });
});
