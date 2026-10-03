"use strict";

// ── Store: the one persistence seam for SYNCED learning data ────────────────
// Sync design: .scratch/roadmap/issues/20-sync-design.md. Doc shapes and the
// pure merge/export helpers live in lib.js (stripDocMeta, pickStoreWinner,
// docsToSnapshot). Device-only prefs (palette, theme, TTS rate) are NOT
// here — they stay in localStorage.
//
// Store.init() → Promise: opens PouchDB (IndexedDB); if PouchDB is missing or
// fails to open, falls back to an in-memory backend for the session (Node test
// runner, IndexedDB blocked). Then holds every doc in a memory mirror. After
// that, reads are synchronous (snapshot/docs) and writes update the mirror
// immediately, then persist through a serial async queue (write-through).
// No migration from the old day-keyed 'jlpt' DB or localStorage (map Q5).

var STORE_DB_NAME = 'jelly'; // IndexedDB: _pouch_jelly (old day-keyed data lives in _pouch_jlpt)

function memoryBackend() {
  var data = {};
  return {
    name: 'memory',
    loadAll: function () {
      return Promise.resolve(Object.keys(data).map(function (k) { return Object.assign({}, data[k]); }));
    },
    // put → { rev, doc }: doc = what ended up stored when it isn't the one passed
    // (another writer won the merge), else null.
    put: function (doc) { data[doc._id] = Object.assign({}, doc); return Promise.resolve({ rev: '1', doc: null }); },
    remove: function (id) { delete data[id]; return Promise.resolve(); }
  };
}

// Conflicting revisions (other tabs, other devices via sync): keep the merge
// rules' result (mergeStoreDocs) on the winning rev, delete the losing leaves.
// Two replicas resolving the same conflict converge: they see the same
// CouchDB winner and the merge is deterministic.
function resolveConflicts(db, doc) {
  return Promise.all(doc._conflicts.map(function (rev) {
    return db.get(doc._id, { rev: rev });
  })).then(function (losers) {
    var winner = [doc].concat(losers).reduce(mergeStoreDocs);
    var merged = Object.assign({}, winner, { _rev: doc._rev });
    delete merged._conflicts;
    var writes = losers.map(function (l) { return { _id: l._id, _rev: l._rev, _deleted: true }; });
    if (winner !== doc) writes.push(merged);
    return db.bulkDocs(writes).then(function (res) {
      var last = res[res.length - 1];
      if (winner !== doc && last && last.ok) merged._rev = last.rev;
      return merged;
    });
  });
}

function pouchBackend(db) {
  return {
    name: 'pouchdb',
    loadAll: function () {
      return db.allDocs({ include_docs: true, conflicts: true }).then(function (res) {
        // Foreign docs (e.g. a _design doc on the remote) replicate too; ignore them.
        return Promise.all(res.rows.filter(function (row) { return STORE_ID_RE.test(row.id); }).map(function (row) {
          return row.doc._conflicts ? resolveConflicts(db, row.doc) : row.doc;
        }));
      });
    },
    put: function (doc) {
      return db.put(doc).then(function (res) { return { rev: res.rev, doc: null }; }, function (err) {
        if (err.status !== 409) throw err;
        // Another tab (or a replicated device) wrote this doc since we read it:
        // merge rules decide, and the caller refreshes its memory copy from `doc`.
        return db.get(doc._id).then(function (cur) {
          var w = mergeStoreDocs(cur, doc);
          if (w === cur) return { rev: cur._rev, doc: cur };
          var out = Object.assign({}, w, { _rev: cur._rev });
          return db.put(out).then(function (res) { return { rev: res.rev, doc: w === doc ? null : out }; });
        });
      });
    },
    remove: function (id) {
      return db.get(id).then(function (cur) { return db.remove(cur); }).catch(function (err) {
        if (err.status !== 404) throw err;
      });
    },
    // watch: live local changes feed — other tabs' writes and replicated docs
    // (our own writes too; the store skips those by stamp). Conflicted docs are
    // resolved first, so onDoc gets the merged winner. Returns the feed (cancel()).
    watch: function (onDoc, onDelete) {
      var feed = db.changes({ since: 'now', live: true, include_docs: true, conflicts: true });
      feed.on('change', function (ch) {
        if (!STORE_ID_RE.test(ch.id)) return;
        if (ch.deleted) return onDelete(ch.id);
        var doc = ch.doc;
        (doc._conflicts && doc._conflicts.length ? resolveConflicts(db, doc) : Promise.resolve(doc))
          .then(onDoc).catch(function (e) { console.error('Store change failed:', e); });
      });
      feed.on('error', function (e) { console.error('Store changes feed stopped:', e); });
      return feed;
    },
    db: db
  };
}

function openDefaultBackend() {
  if (typeof PouchDB === 'undefined') return Promise.reject(new Error('PouchDB not loaded'));
  var db;
  try { db = new PouchDB(STORE_DB_NAME); } catch (e) { return Promise.reject(e); }
  return db.info().then(function () { return pouchBackend(db); });
}

function browserLocalStorage() {
  return {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
}

// createStore({ ls, openBackend }) — both injectable for tests; defaults are the
// browser's localStorage and PouchDB. `ls` = { get(k) → string|null, set(k, v) }.
function createStore(opts) {
  opts = opts || {};
  var ls = opts.ls || browserLocalStorage();
  var openBackend = opts.openBackend || openDefaultBackend;
  var mirror = {}; // _id → doc without _rev
  var revs = {};   // _id → latest known _rev
  var backend = memoryBackend();
  var queue = Promise.resolve();

  var deviceId = ls.get('jlpt_device_id');
  if (!deviceId) {
    deviceId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    ls.set('jlpt_device_id', deviceId);
  }

  function emit(name, detail) {
    if (typeof window !== 'undefined' && window.dispatchEvent && typeof CustomEvent !== 'undefined') {
      window.dispatchEvent(new CustomEvent(name, { detail: detail }));
    }
  }
  // 'store-changed': docs changed under App (other tab, replication, merge) —
  // App re-reads snapshot(). Batched so an initial sync doesn't render per doc.
  var changedTimer = null;
  function changed() {
    if (changedTimer || typeof setTimeout === 'undefined') return;
    changedTimer = setTimeout(function () { changedTimer = null; emit('store-changed'); }, 30);
  }
  function enqueue(fn) {
    queue = queue.then(fn).catch(function (e) {
      console.error('Store write failed:', e);
      emit('storage-save-error', String(e && e.message || e));
    });
    return queue;
  }
  function putNow(doc) {
    if (mirror[doc._id] !== doc) return Promise.resolve(); // superseded by a newer write
    var payload = Object.assign({}, doc);
    if (revs[doc._id]) payload._rev = revs[doc._id];
    return backend.put(payload).then(function (r) {
      revs[doc._id] = r.rev;
      // 409 where the other copy won (or merged): refresh this tab's memory copy.
      if (r.doc && mirror[doc._id] === doc) { mirror[doc._id] = withoutRev(r.doc); changed(); }
    });
  }
  function withoutRev(d) {
    var c = Object.assign({}, d);
    delete c._rev;
    delete c._conflicts;
    return c;
  }
  function revGen(rev) { return parseInt(rev, 10) || 0; }
  // A doc from the changes feed (other tab / replication; conflicts already
  // resolved). Our own writes come back too and are skipped by their stamp.
  function applyIncoming(doc) {
    var id = doc._id;
    if (!STORE_ID_RE.test(id) || revGen(doc._rev) < revGen(revs[id])) return; // foreign or stale event
    revs[id] = doc._rev;
    var inc = withoutRev(doc), cur = mirror[id];
    if (cur && cur.updatedAt === inc.updatedAt && cur.deviceId === inc.deviceId) return;
    var w = cur ? mergeStoreDocs(cur, inc) : inc;
    if (w !== inc) {
      // Ours wins (or a merged log): write it on top of the incoming rev.
      mirror[id] = w;
      enqueue(function () { return putNow(w); });
      if (w === cur) return;
    } else mirror[id] = inc;
    changed();
  }
  function applyDelete(id) {
    if (!mirror[id]) return;
    delete mirror[id];
    delete revs[id];
    changed();
  }
  function stamp(id, body) {
    return Object.assign({ _id: id }, body, { updatedAt: Date.now(), deviceId: deviceId });
  }
  // write: no-op when the body is unchanged (so re-saves don't bump updatedAt
  // and win LWW merges they shouldn't).
  function write(id, body) {
    var cur = mirror[id];
    if (cur && JSON.stringify(stripDocMeta(cur)) === JSON.stringify(body)) return queue;
    var doc = stamp(id, body);
    mirror[id] = doc;
    return enqueue(function () { return putNow(doc); });
  }

  function appendLog(fn) {
    var date = localDate();
    var id = 'log:' + date + ':' + deviceId;
    var cur = mirror[id] || { date: date };
    var body = Object.assign(stripDocMeta(cur), normalizeLog(cur)); // keeps unknown (newer) fields
    fn(body);
    var p = write(id, body);
    emit('activity-logged');
    return p;
  }

  // ── Remote sync state (Settings → Sync) ──
  var sync = null; // { handle, remote, mergeFirst } while connected
  function setSync(status, err) {
    store.syncInfo = Object.assign({}, store.syncInfo, {
      status: status,
      error: err ? syncErrorKey(err) : null,
      detail: err ? String(err.message || err.reason || err.name || err) : null
    });
    emit('sync-status');
  }
  function startLive(s) {
    var h = backend.db.sync(s.remote, { live: true, retry: true });
    s.handle = h;
    store.syncInfo = Object.assign({}, store.syncInfo, { connected: true });
    var mine = function (fn) { return function (x) { if (sync === s && s.handle === h) fn(x); }; };
    var online = function () { return typeof navigator === 'undefined' ? true : navigator.onLine; };
    h.on('active', mine(function () { setSync('syncing'); }))
      .on('change', mine(function () { setSync('syncing'); }))
      .on('paused', mine(function (err) {
        if (!err && s.mergeFirst) {
          // First connect with data on both sides: the merge rules already ran
          // (replication + conflict resolution); report the merged totals once.
          s.mergeFirst = false;
          store.syncInfo = Object.assign({}, store.syncInfo, { summary: syncMergeSummary(store.docs()) });
        }
        setSync(syncStatusFor('paused', err, online()), err);
      }))
      .on('denied', mine(function (err) { setSync('error', err); }))
      .on('error', mine(function (err) { setSync(syncStatusFor('error', err, online()), err); }));
  }

  var store = {
    backend: null, // 'pouchdb' | 'memory' once init() resolves
    deviceId: deviceId,
    init: function () {
      return openBackend().then(function (b) {
        return b.loadAll().then(function (docs) { return { b: b, docs: docs }; });
      }).catch(function (e) {
        console.warn('PouchDB unavailable, keeping progress in memory for this session:', String(e && e.message || e));
        return { b: memoryBackend(), docs: [] };
      }).then(function (r) {
        backend = r.b;
        store.backend = r.b.name;
        if (backend.watch) backend.watch(applyIncoming, applyDelete);
        r.docs.forEach(function (d) {
          revs[d._id] = d._rev;
          var c = Object.assign({}, d);
          delete c._rev;
          delete c._conflicts;
          mirror[d._id] = c;
        });
        return store.snapshot();
      });
    },
    // { completed: [unitId...], srsCards: {itemId: card}, currentUnit, pace, examDate,
    //   furiganaPref: 'true'|'false'|null, uiLang, charView: 'rows'|'focus' }
    snapshot: function () { return docsToSnapshot(store.docs()); },
    docs: function () { return Object.keys(mirror).map(function (k) { return mirror[k]; }); },
    // Re-marking with the same done state is a no-op (keeps completedAt).
    putUnit: function (id, done) {
      var cur = mirror['unit:' + id];
      if (cur && cur.done === !!done) return queue;
      return write('unit:' + id, { done: !!done, completedAt: done ? Date.now() : null });
    },
    // Writes only the cards that differ from what's stored.
    // ponytail: O(cards) JSON compare per call; track dirty ids if reviews get slow.
    // A card older (by lastReviewedAt) than the stored one is skipped: App state
    // can lag a replicated review by a render, and reviews are truth.
    putCards: function (cards) {
      Object.keys(cards).forEach(function (id) {
        var cur = mirror['card:' + id];
        if (cur && (cur.lastReviewedAt || 0) > (cards[id].lastReviewedAt || 0)) return;
        write('card:' + id, cards[id]);
      });
      return queue;
    },
    // Deletes card docs (undo of an already-known import, ticket 37).
    removeCards: function (ids) {
      ids.forEach(function (itemId) {
        var id = 'card:' + itemId;
        if (!mirror[id]) return;
        delete mirror[id];
        enqueue(function () { return backend.remove(id).then(function () { delete revs[id]; }); });
      });
      return queue;
    },
    // Partial update of prefs:learning; values equal to the current (or default) prefs are skipped.
    putPrefs: function (partial) {
      var cur = mirror['prefs:learning'];
      var body = Object.assign(cur ? stripDocMeta(cur) : {}, partial);
      var effective = Object.assign({}, PREFS_DEFAULTS, cur ? stripDocMeta(cur) : {});
      var changed = Object.keys(partial).some(function (k) { return effective[k] !== partial[k]; });
      return changed ? write('prefs:learning', body) : queue;
    },
    // Activity log: appends to today's log:<date>:<deviceId> doc (see lib.js).
    // Two tabs on one device can race on today's doc; the 409 path and the
    // changes feed merge it field-wise (mergeLogDocs).
    logLesson: function (unitId) {
      return appendLog(function (l) { if (l.lessons.indexOf(unitId) === -1) l.lessons.push(unitId); });
    },
    logQuiz: function (unitId, right, total) {
      return appendLog(function (l) { l.quizzes.push({ unit: unitId, right: right, total: total, at: Date.now() }); });
    },
    // quality: ReviewMode grade 0–3 (0 = Again, see srsReview).
    logReview: function (quality) {
      return appendLog(function (l) { l.reviews.count++; if (quality === 0) l.reviews.again++; });
    },
    logs: function () { return logDocs(store.docs()); },
    // A taken mock exam (ticket 18): one mock:<mockId>:<takenAt> doc per sitting (mockResult in lib.js).
    putMock: function (result) { return write('mock:' + result.mockId + ':' + result.takenAt, result); },
    // Import: replace every doc. Imported docs are re-stamped as this device's
    // fresh write so they win LWW against older copies elsewhere: units, prefs
    // and logs. Cards still merge on lastReviewedAt, so with sync on a restored
    // older backup does NOT roll back cards reviewed later on another device
    // (reviews are truth). Docs missing from the file are deleted, and with
    // sync on those deletions replicate.
    replaceAll: function (docs) {
      var keep = {};
      docs.forEach(function (d) { keep[d._id] = true; });
      Object.keys(mirror).forEach(function (id) {
        if (keep[id]) return;
        delete mirror[id];
        enqueue(function () { return backend.remove(id).then(function () { delete revs[id]; }); });
      });
      docs.forEach(function (d) {
        var doc = stamp(d._id, stripDocMeta(d));
        mirror[d._id] = doc;
        enqueue(function () { return putNow(doc); });
      });
      return queue;
    },
    flush: function () { return queue; },

    // Remote sync. syncInfo = { connected (replication running or retrying),
    // status: 'off'|'connecting'|'syncing'|'synced'|'offline'|'error', error:
    // UI_STRINGS key | null, detail, summary: { units, cards } | null };
    // changes fire a 'sync-status' window event.
    syncInfo: { connected: false, status: 'off', error: null, detail: null, summary: null },
    // connect(remote): remote = a PouchDB for the user's CouchDB database
    // (openRemote). Checks it, then starts live two-way replication.
    connect: function (remote) {
      store.disconnect();
      if (!backend.db) {
        store.syncInfo = { connected: false, status: 'error', error: 'sync_err_local', detail: null, summary: null };
        emit('sync-status');
        return Promise.reject(new Error('local database unavailable'));
      }
      var s = { remote: remote, handle: null, mergeFirst: false };
      var hadLocal = store.docs().length > 0;
      sync = s;
      store.syncInfo = { connected: false, status: 'connecting', error: null, detail: null, summary: null };
      emit('sync-status');
      return checkRemote(remote).then(function (info) {
        if (sync !== s) return info;
        s.mergeFirst = hadLocal && info.doc_count > 0;
        startLive(s);
        return info;
      }, function (err) {
        if (sync === s) { sync = null; setSync('error', err); }
        throw err;
      });
    },
    // Stops replication; local data stays, remote data is never touched.
    disconnect: function () {
      var s = sync;
      sync = null;
      if (s && s.handle) s.handle.cancel();
      if (s || store.syncInfo.status !== 'off') {
        store.syncInfo = { connected: false, status: 'off', error: null, detail: null, summary: null };
        emit('sync-status');
      }
    },
    // "Sync now": restart replication (skips the retry backoff after offline).
    syncNow: function () {
      if (!sync || !sync.handle) return;
      sync.handle.cancel();
      startLive(sync);
    },
    _applyIncoming: applyIncoming // tests: feed a changes-feed doc
  };
  return store;
}

// checkRemote: the remote database is reachable with these credentials (db
// info) and writable (a _local doc round-trip; _local docs never replicate).
// Never creates the database (openRemote sets skip_setup) and needs no admin.
function checkRemote(remote) {
  var id = '_local/jlpt-check';
  return remote.info().then(function (info) {
    return remote.get(id).catch(function (e) { if (e.status === 404) return { _id: id }; throw e; })
      .then(function (d) { return remote.put(Object.assign(d, { at: Date.now() })); })
      .then(function (r) { return remote.remove(id, r.rev); })
      .then(function () { return info; });
  });
}
function openRemote(creds) {
  return new PouchDB(creds.url, { auth: { username: creds.username, password: creds.password }, skip_setup: true });
}

// Saved sync login: sessionStorage by default (asked again next browser
// session), localStorage when "Remember on this device" is on. Readable by any
// page on this origin (all <user>.github.io project sites share it), hence the
// dedicated single-database user (README). Not a doc and not a
// DEVICE_PREF_KEYS key, so it never syncs and is never exported.
// { url, username, password, connected }: connected = reconnect on load.
var SYNC_CREDS_KEY = 'jlpt_sync_creds';
function loadSyncCreds() {
  var raw = null, remember = false;
  try { raw = localStorage.getItem(SYNC_CREDS_KEY); remember = !!raw; } catch (e) {}
  try { if (!raw) raw = sessionStorage.getItem(SYNC_CREDS_KEY); } catch (e) {}
  try {
    var c = JSON.parse(raw);
    if (c && typeof c.url === 'string' && typeof c.username === 'string' && typeof c.password === 'string') {
      return Object.assign(c, { remember: remember });
    }
  } catch (e) {}
  return null;
}
function saveSyncCreds(c, remember) {
  var v = JSON.stringify({ url: c.url, username: c.username, password: c.password, connected: !!c.connected });
  forgetSyncCreds();
  try { (remember ? localStorage : sessionStorage).setItem(SYNC_CREDS_KEY, v); } catch (e) {}
}
function forgetSyncCreds() {
  try { localStorage.removeItem(SYNC_CREDS_KEY); } catch (e) {}
  try { sessionStorage.removeItem(SYNC_CREDS_KEY); } catch (e) {}
}
// connectSync(form): Settings' Connect → Promise<{ error: UI_STRINGS key | null,
// detail }>. form = { url, username, password, remember }.
function connectSync(form) {
  var u = checkSyncUrl(form.url);
  if (!u.ok) return Promise.resolve({ error: u.error, detail: null });
  if (!form.username || !form.password) return Promise.resolve({ error: 'sync_err_creds_empty', detail: null });
  if (typeof PouchDB === 'undefined') return Promise.resolve({ error: 'sync_err_local', detail: null });
  var creds = { url: u.url, username: form.username, password: form.password };
  return Store.connect(openRemote(creds)).then(function () {
    saveSyncCreds(Object.assign({ connected: true }, creds), form.remember);
    return { error: null, detail: null };
  }, function () {
    return { error: Store.syncInfo.error || 'sync_err_other', detail: Store.syncInfo.detail };
  });
}
// disconnectSync(forget): stop syncing; keep the login for next time unless
// `forget`, but don't reconnect on load.
function disconnectSync(forget) {
  Store.disconnect();
  var c = loadSyncCreds();
  if (forget || !c) forgetSyncCreds();
  else saveSyncCreds(Object.assign(c, { connected: false }), c.remember);
}

var Store = createStore();
