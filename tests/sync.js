"use strict";

// Remote sync: pure helpers in lib.js + Store's changes-feed / connect wiring
// (store.js) with fake backends. Also run headlessly by
// .claude/hooks/run-tests.js through its QUnit shim (same file, no copy).
QUnit.module('sync', function () {
  function fakeLs() {
    var d = {};
    return { get: function (k) { return d[k] === undefined ? null : d[k]; }, set: function (k, v) { d[k] = String(v); } };
  }
  // Memory backend + the pouch-only hooks the store looks for (watch, db).
  function fakeBackend(db) {
    var b = memoryBackend();
    b.puts = [];
    var put = b.put;
    b.put = function (doc) { b.puts.push(doc); return put(doc); };
    b.watch = function (onDoc, onDelete) { b.onDoc = onDoc; b.onDelete = onDelete; };
    b.db = db;
    return b;
  }
  function storeOn(backend) {
    var s = createStore({ ls: fakeLs(), openBackend: function () { return Promise.resolve(backend); } });
    return s.init().then(function () { return s; });
  }
  function emitter() {
    var h = { fns: {}, cancelled: false };
    h.on = function (ev, fn) { h.fns[ev] = fn; return h; };
    h.fire = function (ev, x) { h.fns[ev](x); };
    h.cancel = function () { h.cancelled = true; };
    return h;
  }
  function fakeRemote(opts) {
    opts = opts || {};
    return {
      info: function () { return opts.infoErr ? Promise.reject(opts.infoErr) : Promise.resolve({ doc_count: opts.docCount || 0 }); },
      get: function () { return Promise.reject({ status: 404 }); },
      put: function () { return opts.putErr ? Promise.reject(opts.putErr) : Promise.resolve({ rev: '1-a' }); },
      remove: function () { return Promise.resolve({ ok: true }); }
    };
  }

  QUnit.test('checkSyncUrl: https required (loopback http ok), db name required, no creds in URL', function (assert) {
    assert.deepEqual(checkSyncUrl(' https://acct.cloudant.com/jelly/ '), { ok: true, url: 'https://acct.cloudant.com/jelly', error: null });
    assert.strictEqual(checkSyncUrl('http://localhost:5984/jelly').url, 'http://localhost:5984/jelly');
    assert.ok(checkSyncUrl('http://127.0.0.1:5984/jelly').ok);
    assert.ok(checkSyncUrl('https://host/prefix/jelly').ok, 'reverse-proxy prefix path is fine');
    assert.strictEqual(checkSyncUrl('').error, 'sync_err_url_empty');
    assert.strictEqual(checkSyncUrl('not a url').error, 'sync_err_url');
    assert.strictEqual(checkSyncUrl('ftp://host/jelly').error, 'sync_err_url');
    assert.strictEqual(checkSyncUrl('http://example.com/jelly').error, 'sync_err_https');
    assert.strictEqual(checkSyncUrl('https://example.com').error, 'sync_err_url_db');
    assert.strictEqual(checkSyncUrl('https://example.com/jelly?x=1').error, 'sync_err_url_db');
    assert.strictEqual(checkSyncUrl('https://me:pw@example.com/jelly').error, 'sync_err_url_creds');
  });

  QUnit.test('syncStatusFor: replication events → synced / syncing / offline / error', function (assert) {
    assert.strictEqual(syncStatusFor('active'), 'syncing');
    assert.strictEqual(syncStatusFor('change'), 'syncing');
    assert.strictEqual(syncStatusFor('paused', undefined, true), 'synced');
    assert.strictEqual(syncStatusFor('paused', undefined, false), 'offline', 'browser offline');
    assert.strictEqual(syncStatusFor('paused', { message: 'Failed to fetch' }, true), 'offline', 'retrying after a network error');
    assert.strictEqual(syncStatusFor('denied', { status: 403 }), 'error');
    assert.strictEqual(syncStatusFor('error', { status: 401 }), 'error');
    assert.strictEqual(syncStatusFor('error', { name: 'TypeError', message: 'NetworkError when attempting to fetch resource.' }), 'offline');
    assert.strictEqual(syncStatusFor('complete'), 'off');
  });

  QUnit.test('syncErrorKey: network/CORS, 401, 403, 404, other', function (assert) {
    assert.strictEqual(syncErrorKey(null), null);
    assert.strictEqual(syncErrorKey({ name: 'TypeError', message: 'Failed to fetch' }), 'sync_err_network');
    assert.strictEqual(syncErrorKey({ status: 500, message: 'Load failed' }), 'sync_err_network', 'Safari wording');
    assert.strictEqual(syncErrorKey({ status: 401, message: 'Name or password is incorrect.' }), 'sync_err_auth');
    assert.strictEqual(syncErrorKey({ status: 403, message: 'You are not allowed to access this db.' }), 'sync_err_forbidden');
    assert.strictEqual(syncErrorKey({ status: 404, message: 'Database does not exist.' }), 'sync_err_missing');
    assert.strictEqual(syncErrorKey({ status: 500, message: 'boom' }), 'sync_err_other');
  });

  QUnit.test('syncMergeSummary: units done + cards', function (assert) {
    assert.deepEqual(syncMergeSummary([
      { _id: 'unit:n5.u001', done: true }, { _id: 'unit:n5.u002', done: false },
      { _id: 'card:k:人', interval: 1 }, { _id: 'card:k:日', interval: 1 }, { _id: 'prefs:learning' }
    ]), { units: 1, cards: 2 });
  });

  QUnit.test('mergeLogDocs: union lessons + quizzes, max counters, no rewrite when nothing new', function (assert) {
    var a = { _id: 'log:2026-05-01:d', date: '2026-05-01', lessons: ['n5.u001'], quizzes: [{ unit: 'n5.u001', right: 1, total: 2, at: 10 }], reviews: { count: 3, again: 1 }, updatedAt: 5, deviceId: 'd' };
    var b = { _id: 'log:2026-05-01:d', date: '2026-05-01', lessons: ['n5.u002'], quizzes: [{ unit: 'n5.u001', right: 1, total: 2, at: 10 }, { unit: 'n5.u002', right: 2, total: 2, at: 5 }], reviews: { count: 2, again: 2 }, updatedAt: 7, deviceId: 'd' };
    var m = mergeLogDocs(a, b);
    assert.deepEqual(m.lessons, ['n5.u001', 'n5.u002']);
    assert.deepEqual(m.quizzes.map(function (q) { return q.at; }), [5, 10], 'deduped by at+unit, sorted');
    assert.deepEqual(m.reviews, { count: 3, again: 2 });
    assert.strictEqual(m.updatedAt, 7);
    assert.strictEqual(mergeLogDocs(m, a), m, 'already covers a → same object');
    assert.strictEqual(mergeLogDocs(a, m), m, 'b covers a → b');
    assert.strictEqual(mergeStoreDocs(a, b).lessons.length, 2, 'mergeStoreDocs routes log docs');
    var u1 = { _id: 'unit:n5.u001', updatedAt: 1, deviceId: 'a' }, u2 = { _id: 'unit:n5.u001', updatedAt: 2, deviceId: 'a' };
    assert.strictEqual(mergeStoreDocs(u1, u2), u2, 'other docs → pickStoreWinner');
  });

  QUnit.test('changes feed: replicated docs update the snapshot; own echo, stale and foreign docs are ignored', function (assert) {
    var b = fakeBackend();
    return storeOn(b).then(function (s) {
      assert.strictEqual(typeof b.onDoc, 'function', 'store subscribes to the changes feed');
      b.onDoc({ _id: 'unit:n5.u004', _rev: '1-r', done: true, completedAt: 1, updatedAt: 10, deviceId: 'other' });
      assert.deepEqual(s.snapshot().completed, ['n5.u004'], 'remote unit applied');
      b.onDoc({ _id: 'unit:n5.u004', _rev: '1-r', done: true, completedAt: 1, updatedAt: 10, deviceId: 'other' });
      assert.strictEqual(b.puts.length, 0, 'same stamp → no write');
      b.onDoc({ _id: 'unit:n5.u004', _rev: '3-r', done: false, completedAt: null, updatedAt: 30, deviceId: 'other' });
      b.onDoc({ _id: 'unit:n5.u004', _rev: '2-r', done: true, completedAt: 1, updatedAt: 20, deviceId: 'other' });
      assert.deepEqual(s.snapshot().completed, [], 'older rev event ignored');
      b.onDoc({ _id: '_design/x', _rev: '1-z', views: {} });
      b.onDoc({ _id: 'jlpt_theme', _rev: '1-z', value: 'light' });
      assert.ok(s.docs().every(function (d) { return STORE_ID_RE.test(d._id); }), 'foreign / device-pref ids never enter the store');
      b.onDelete('unit:n5.u004');
      assert.strictEqual(s.docs().length, 0, 'replicated delete applied');
    });
  });

  QUnit.test('changes feed: our newer card review beats an incoming older one and is rewritten', function (assert) {
    var b = fakeBackend();
    return storeOn(b).then(function (s) {
      var card = { id: 'k:人', type: 'kanji', front: '人', back: 'person', interval: 6, ease: 2.5, due: 9, reps: 2, lastReviewedAt: 500 };
      s.putCards({ 'k:人': card });
      return s.flush().then(function () {
        b.puts.length = 0;
        b.onDoc(Object.assign({ _id: 'card:k:人', _rev: '2-x' }, card, { reps: 0, lastReviewedAt: 100, updatedAt: Date.now() + 1000, deviceId: 'zz' }));
        assert.strictEqual(s.snapshot().srsCards['k:人'].reps, 2, 'ours kept');
        return s.flush();
      }).then(function () {
        assert.strictEqual(b.puts.length, 1, 'rewritten on top of the incoming rev');
        assert.strictEqual(b.puts[0]._rev, '2-x');
        // App state lagging a replicated review: putCards skips the older card.
        b.onDoc(Object.assign({ _id: 'card:k:人', _rev: '4-y' }, card, { reps: 5, lastReviewedAt: 900, updatedAt: 1, deviceId: 'zz' }));
        s.putCards({ 'k:人': card });
        assert.strictEqual(s.snapshot().srsCards['k:人'].reps, 5, 'newer replicated review kept');
      });
    });
  });

  QUnit.test('changes feed: two-tab log race merges field-wise', function (assert) {
    var b = fakeBackend();
    return storeOn(b).then(function (s) {
      s.logLesson('n5.u001');
      var mine = s.logs()[0];
      return s.flush().then(function () {
        b.puts.length = 0;
        b.onDoc(Object.assign({}, mine, { _rev: '2-t', lessons: ['n5.u002'], updatedAt: mine.updatedAt + 1 }));
        var l = s.logs()[0];
        assert.deepEqual(l.lessons.slice().sort(), ['n5.u001', 'n5.u002'], 'both tabs\' lessons kept');
        return s.flush();
      }).then(function () {
        assert.strictEqual(b.puts.length, 1, 'merged log written back');
      });
    });
  });

  QUnit.test('409 retry where the other copy wins refreshes the memory copy', function (assert) {
    var b = memoryBackend();
    var other = { _id: 'prefs:learning', _rev: '2-o', currentUnit: 'n5.u009', updatedAt: Date.now() + 5000, deviceId: 'zz' };
    b.put = function () { return Promise.resolve({ rev: other._rev, doc: other }); };
    return storeOn(b).then(function (s) {
      s.putPrefs({ currentUnit: 'n5.u002' });
      return s.flush().then(function () {
        assert.strictEqual(s.snapshot().currentUnit, 'n5.u009');
      });
    });
  });

  QUnit.test('connect: checks the remote, then live two-way sync; statuses + first-merge summary', function (assert) {
    var h = emitter(), opts = null;
    var db = { sync: function (remote, o) { opts = o; return h; } };
    return storeOn(fakeBackend(db)).then(function (s) {
      s.putUnit('n5.u001', true);
      var p = s.connect(fakeRemote({ docCount: 3 }));
      assert.strictEqual(s.syncInfo.status, 'connecting');
      return p.then(function () {
        assert.deepEqual(opts, { live: true, retry: true });
        assert.ok(s.syncInfo.connected);
        h.fire('active');
        assert.strictEqual(s.syncInfo.status, 'syncing');
        h.fire('paused');
        assert.strictEqual(s.syncInfo.status, 'synced');
        assert.deepEqual(s.syncInfo.summary, { units: 1, cards: 0 }, 'both sides had data → summary');
        h.fire('paused', { message: 'Failed to fetch' });
        assert.strictEqual(s.syncInfo.status, 'offline');
        h.fire('error', { status: 401, message: 'unauthorized' });
        assert.deepEqual([s.syncInfo.status, s.syncInfo.error], ['error', 'sync_err_auth']);
        s.disconnect();
        assert.ok(h.cancelled, 'replication cancelled');
        assert.deepEqual([s.syncInfo.connected, s.syncInfo.status], [false, 'off']);
        assert.deepEqual(s.snapshot().completed, ['n5.u001'], 'local data kept');
      });
    });
  });

  QUnit.test('connect: no summary when one side is empty; errors surface as UI keys', function (assert) {
    var h = emitter();
    var db = { sync: function () { return h; } };
    return storeOn(fakeBackend(db)).then(function (s) {
      return s.connect(fakeRemote({ docCount: 5 })).then(function () {
        h.fire('paused');
        assert.strictEqual(s.syncInfo.summary, null, 'empty local → plain sync');
        return s.connect(fakeRemote({ infoErr: { status: 404, message: 'Database does not exist.' } }));
      }).then(function () { assert.ok(false, 'should reject'); }, function () {
        assert.ok(h.cancelled, 'previous replication stopped');
        assert.deepEqual([s.syncInfo.connected, s.syncInfo.status, s.syncInfo.error], [false, 'error', 'sync_err_missing']);
        return s.connect(fakeRemote({ putErr: { status: 403, message: 'forbidden' } }));
      }).then(function () { assert.ok(false, 'should reject'); }, function () {
        assert.strictEqual(s.syncInfo.error, 'sync_err_forbidden', 'read-only db is caught by the write check');
      });
    });
  });

  QUnit.test('connect without a local PouchDB (memory fallback) → sync_err_local', function (assert) {
    return storeOn(memoryBackend()).then(function (s) {
      return s.connect(fakeRemote()).then(function () { assert.ok(false); }, function () {
        assert.strictEqual(s.syncInfo.error, 'sync_err_local');
      });
    });
  });

  QUnit.test('connectSync validates before touching the network; saved login never exported', function (assert) {
    return connectSync({ url: 'http://example.com/jelly', username: 'u', password: 'p' }).then(function (r) {
      assert.strictEqual(r.error, 'sync_err_https');
      return connectSync({ url: 'https://example.com/jelly', username: '', password: 'p' });
    }).then(function (r) {
      assert.strictEqual(r.error, 'sync_err_creds_empty');
      assert.strictEqual(DEVICE_PREF_KEYS.indexOf(SYNC_CREDS_KEY), -1, 'not a device pref → not exported');
      var file = { version: PROGRESS_VERSION, docs: [], device: {} };
      file.device[SYNC_CREDS_KEY] = '{}';
      assert.notOk(validateProgressData(file).valid, 'and an import can\'t carry it');
    });
  });
});
