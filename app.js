"use strict";

// Navbar view tabs (label = UI_STRINGS key, icon = ICONS key in app-helpers.js)
// Catalog + plan → ordered unit list, once at load (data/*.js are loaded before lib.js).
var PLAN_CHECK = validatePlan(PLAN, CATALOG);
var UNITS = PLAN_CHECK.valid ? buildUnits(PLAN, CATALOG) : [];

// ── Unit completion + new-card cap (ticket 35, Q28/Q31/Q34) ─────────────────
// Store writes, then 'store-changed' so App re-reads the snapshot.
function notifyStoreChanged() {
  if (typeof window !== 'undefined' && window.dispatchEvent && typeof CustomEvent !== 'undefined') {
    window.dispatchEvent(new CustomEvent('store-changed'));
  }
}
// markUnitsDone(ids): marks units done and adds their SRS cards up to today's
// new-card cap; the rest wait in prefs.pendingCards. A passed quiz calls it;
// placement / skip-ahead (ticket 37) can call it with many ids.
function markUnitsDone(ids, now, opts) {
  now = now || Date.now();
  var skipped = !!(opts && opts.skipped);
  var snap = Store.snapshot();
  // A real pass also takes a skipped stage (clears its flag); placement (opts.skipped) never
  // touches a stage that is already done. Skipped stages add no cards (placement seeds them
  // with seedKnown) and no lesson log, so they don't count toward today's pace.
  var units = UNITS.filter(function (u) {
    return ids.indexOf(u.id) >= 0 && (snap.completed.indexOf(u.id) < 0 || (!skipped && snap.skipped.indexOf(u.id) >= 0));
  });
  if (!units.length) return;
  if (skipped) {
    units.forEach(function (u) { Store.putUnit(u.id, true, true); });
    notifyStoreChanged();
    return;
  }
  units.forEach(function (u) { Store.putUnit(u.id, true); Store.logLesson(u.id); });
  var cards = Object.assign({}, snap.srsCards);
  var room = dailyCardCap(snap.pace, UNITS, units[0].index) - cardsAddedToday(cards, now);
  var r = admitCards(unitItems(units), cards, snap.pendingCards, Math.max(0, room), now);
  Store.putCards(cards);
  Store.putPrefs({ pendingCards: r.pending });
  notifyStoreChanged();
}
// releasePendingCards(extra): adds waiting cards — up to today's remaining room
// (on load), or one more day's cap on top when `extra` ("learn extra today").
// Returns how many were added.
function releasePendingCards(extra, now) {
  now = now || Date.now();
  var snap = Store.snapshot();
  if (!snap.pendingCards.length) return 0;
  var cards = Object.assign({}, snap.srsCards);
  var cap = dailyCardCap(snap.pace, UNITS, nextUnit(UNITS, new Set(snap.completed)));
  var r = admitCards([], cards, snap.pendingCards, Math.max(0, extra ? cap : cap - cardsAddedToday(cards, now)), now);
  if (!r.added) return 0;
  Store.putCards(cards);
  Store.putPrefs({ pendingCards: r.pending });
  notifyStoreChanged();
  return r.added;
}
// flagMissedItems(ids): quiz misses come back sooner in SRS (Q31).
function flagMissedItems(ids, now) {
  var cards = Object.assign({}, Store.snapshot().srsCards);
  if (!srsFlagMissed(cards, ids, now || Date.now())) return;
  Store.putCards(cards);
  notifyStoreChanged();
}

// ── Already-known import (ticket 37) ────────────────────────────────────────
// seedKnown(ids, source, batchId): seeds the items as known cards (lib.js
// seedKnownCards), spread under today's review budget. Returns the result.
function seedKnown(ids, source, batchId, now, mode) {
  now = now || Date.now();
  var snap = Store.snapshot();
  var cards = Object.assign({}, snap.srsCards);
  var cap = dailyCardCap(snap.pace, UNITS, nextUnit(UNITS, new Set(snap.completed)));
  var r = seedKnownCards(ids, cards, now, { source: source, batchId: batchId, budget: reviewBudget(cap) });
  if (r.added.length || r.replaced.length) {
    Store.putCards(cards);
    notifyStoreChanged();
    scheduleAchievements(mode || 'live'); // placement passes 'retro': one summary toast, no per-achievement toasts
  }
  return r;
}
// applyPlacement(result): the confirmed placement result (lib.js placementApply) → stages done+skipped
// (no cards of their own), their items seeded as known cards in one undoable "placement" batch
// (Settings → Already known). Returns { marked, cards }.
function applyPlacement(res, now) {
  now = now || Date.now();
  var plan = placementApply(res, UNITS);
  markUnitsDone(plan.doneIds, now, { skipped: true });
  var r = plan.cardItems.length ? seedKnown(plan.cardItems, 'placement', newBatchId('placement'), now, 'retro') : null;
  return { marked: plan.doneIds.length, cards: r ? r.added.length + r.replaced.length : 0 };
}
// Welcome screen (ticket 39): "seen" is a device-only flag (like jlpt_ach_seen), not a synced pref and
// not in the export: it is about this browser having greeted the learner. New devices that sync in
// progress never show it anyway (progressIsEmpty).
var WELCOME_SEEN_KEY = 'jlpt_welcome_seen';
function welcomeSeen() { try { return localStorage.getItem(WELCOME_SEEN_KEY) === '1'; } catch (e) { return false; } }
function markWelcomeSeen() { safeSave(WELCOME_SEEN_KEY, '1'); }
// undoKnown(batchId, ids?): takes back a batch (or some of its ids).
function undoKnown(batchId, ids) {
  var cards = Object.assign({}, Store.snapshot().srsCards);
  var r = undoImport(batchId, cards, ids);
  if (r.removed.length) Store.removeCards(r.removed);
  if (r.restored.length) Store.putCards(cards);
  if (r.removed.length || r.restored.length) notifyStoreChanged();
  return r;
}
function newBatchId(source) { return source + ':' + Date.now().toString(36); }

// ── Achievements (ticket 08; mechanics ticket 30) ───────────────────────────
// scheduleAchievements(mode): debounced evaluation. 'live' = after a logged event (stacked toasts + one
// jingle); 'retro' = app start / store changed under us (silent, one summary toast). 'live' wins when both
// land in one window. Unlocks are written as ach:<id> docs; the App listens for 'achievement-batch'.
var _achTimer = null, _achMode = 'retro';
function scheduleAchievements(mode) {
  if (mode === 'live') _achMode = 'live';
  if (_achTimer) return;
  _achTimer = setTimeout(function () {
    var m = _achMode;
    _achTimer = null;
    _achMode = 'retro';
    runAchievements(m);
  }, 250);
}
function runAchievements(mode) {
  var res = evaluateAchievements(Store.docs(), Store.snapshot().unlocked, { units: UNITS, catalog: CATALOG, now: Date.now() });
  if (!res.length) return;
  Store.putUnlocks(res);
  window.dispatchEvent(new CustomEvent('achievement-batch', { detail: achievementBatch(res, mode) }));
}
// Unseen-unlock badge (per device, cleared when the Achievements tab opens): ids opened here live in
// localStorage, so unlocks synced from another device count too.
var ACH_SEEN_KEY = 'jlpt_ach_seen';
function achSeenIds() {
  try { var v = JSON.parse(localStorage.getItem(ACH_SEEN_KEY)); return Array.isArray(v) ? v : []; } catch (e) { return []; }
}
function achievementBadge() { return unseenUnlocks(achievementUnlocks(), achSeenIds()).length; }
function markAchievementsSeen() { safeSave(ACH_SEEN_KEY, JSON.stringify(Object.keys(achievementUnlocks()))); }

var NAV_TABS = [
  { view: 'unit', label: 'view_today', icon: 'today' },
  { view: 'units', label: 'view_units', icon: 'units' },
  { view: 'stats', label: 'view_stats', icon: 'stats' },
  { view: 'review', label: 'view_review', icon: 'review' },
  { view: 'achievements', label: 'view_achievements', icon: 'achievements' }
];

function App() {
  // Synced learning data comes from Store (store.js), loaded before App mounts.
  var _React$useStateSnap = React.useState(function () {
      return Store.snapshot();
    }),
    snap0 = _React$useStateSnap[0];
  var _React$useState25 = React.useState(snap0.srsCards),
    _React$useState26 = _slicedToArray(_React$useState25, 2),
    srsCards = _React$useState26[0],
    setSrsCards = _React$useState26[1];
  var _React$useState27 = React.useState(function () {
      return new Set(snap0.completed);
    }),
    _React$useState28 = _slicedToArray(_React$useState27, 2),
    completed = _React$useState28[0],
    setCompleted = _React$useState28[1];
  // Index into UNITS of the unit being viewed; defaults to the suggested next unit.
  var _React$useStateUnit = React.useState(function () {
      var i = UNITS.map(function (u) { return u.id; }).indexOf(snap0.currentUnit);
      return i >= 0 ? i : nextUnit(UNITS, new Set(snap0.completed));
    }),
    unitIdx = _React$useStateUnit[0],
    setUnitIdx = _React$useStateUnit[1];
  var _React$useState29 = React.useState('unit'),
    _React$useState30 = _slicedToArray(_React$useState29, 2),
    view = _React$useState30[0],
    setView = _React$useState30[1];
  // View to return to when Settings is closed
  var _React$useStatePrev = React.useState('unit'),
    _React$useStatePrev2 = _slicedToArray(_React$useStatePrev, 2),
    prevView = _React$useStatePrev2[0],
    setPrevView = _React$useStatePrev2[1];
  // Raw furigana pref 'true'|'false' (null = unset → level-based default, see furiganaOn).
  // Lives here, not in UnitView, so the navbar ruby follows the same toggle.
  var _React$useStateFuri = React.useState(snap0.furiganaPref),
    _React$useStateFuri2 = _slicedToArray(_React$useStateFuri, 2),
    furiganaPref = _React$useStateFuri2[0],
    setFuriganaPref = _React$useStateFuri2[1];
  // Interface language: 'auto' (progressive EN→JA by level), 'en' or 'ja'.
  // ponytail: defaults to 'en' while the app is under development; flip the
  // fallback to 'auto' for release (docsToSnapshot in lib.js).
  var _React$useStateLang = React.useState(snap0.uiLang),
    _React$useStateLang2 = _slicedToArray(_React$useStateLang, 2),
    uiLang = _React$useStateLang2[0],
    setUiLang = _React$useStateLang2[1];
  // Lesson Kanji layout: 'rows' (all kanji stacked) or 'focus' (one at a time); synced pref.
  var _React$useStateKv = React.useState(snap0.kanjiView),
    kanjiView = _React$useStateKv[0],
    setKanjiViewState = _React$useStateKv[1];
  var setKanjiView = function setKanjiView(v) {
    Store.putPrefs({ kanjiView: v });
    setKanjiViewState(v);
  };
  // Pace (units/day, PACE_MODES in lib.js) + optional exam date 'YYYY-MM-DD'; synced prefs.
  var _React$useStatePace = React.useState(snap0.pace),
    pace = _React$useStatePace[0],
    setPace = _React$useStatePace[1];
  var _React$useStateExam = React.useState(snap0.examDate),
    examDate = _React$useStateExam[0],
    setExamDate = _React$useStateExam[1];
  // Passed items waiting for a later day's new-card room (Q34)
  var _React$useStatePending = React.useState(snap0.pendingCards),
    pendingCards = _React$useStatePending[0],
    setPendingCards = _React$useStatePending[1];
  // Full-screen takeovers (ticket 39): null | { screen: 'welcome', again? } | { screen: 'placement', fromWelcome? }.
  // The welcome opens once on a completely empty store (never after an import or sync brought data).
  var _React$useStateFlow = React.useState(function () {
      return !welcomeSeen() && progressIsEmpty(Store.docs()) ? { screen: 'welcome' } : null;
    }),
    flow = _React$useStateFlow[0],
    setFlow = _React$useStateFlow[1];
  React.useEffect(function () {
    Store.putPrefs({ pace: pace, examDate: examDate });
  }, [pace, examDate]);
  // Set during render (not in an effect) so t() in this render already sees it.
  window._uiLang = uiLang;
  React.useEffect(function () {
    Store.putPrefs({ uiLang: uiLang });
  }, [uiLang]);
  var _React$useStateStorageErr = React.useState(!storageAvailable() || Store.backend === 'memory'),
    _React$useStateStorageErrArr = _slicedToArray(_React$useStateStorageErr, 2),
    storageError = _React$useStateStorageErrArr[0],
    setStorageError = _React$useStateStorageErrArr[1];
  var _React$useStateSpeechRate = React.useState(function () {
      var stored = parseFloat(localStorage.getItem('jlpt_tts_rate'));
      return [0.5, 0.75, 1.0, 1.25].indexOf(stored) !== -1 ? stored : 0.85;
    }),
    _React$useStateSpeechRate2 = _slicedToArray(_React$useStateSpeechRate, 2),
    speechRate = _React$useStateSpeechRate2[0],
    setSpeechRate = _React$useStateSpeechRate2[1];
  React.useEffect(function () {
    window._ttsRate = speechRate;
    safeSave('jlpt_tts_rate', String(speechRate));
  }, [speechRate]);
  // Sound effects on/off (device-only); playSfx() reads jlpt_sfx_mute directly.
  var _React$useStateSfx = React.useState(function () {
      return !sfxMuted();
    }),
    _React$useStateSfx2 = _slicedToArray(_React$useStateSfx, 2),
    sfxOn = _React$useStateSfx2[0],
    setSfxOn = _React$useStateSfx2[1];
  React.useEffect(function () {
    safeSave('jlpt_sfx_mute', String(!sfxOn));
  }, [sfxOn]);
  var _React$useStateTheme = React.useState(function () {
      try {
        return normalizeThemePrefs(localStorage.getItem('jlpt_palette'), localStorage.getItem('jlpt_theme'));
      } catch (e) {
        return normalizeThemePrefs(null, null);
      }
    }),
    _React$useStateTheme2 = _slicedToArray(_React$useStateTheme, 2),
    themePrefs = _React$useStateTheme2[0],
    setThemePrefs = _React$useStateTheme2[1];
  // index.html's inline <head> script sets these attributes before first paint;
  // this keeps them in sync after the user changes a preference.
  React.useEffect(function () {
    document.documentElement.setAttribute('data-palette', themePrefs.palette);
    document.documentElement.setAttribute('data-theme', themePrefs.theme);
    safeSave('jlpt_palette', themePrefs.palette);
    safeSave('jlpt_theme', themePrefs.theme);
  }, [themePrefs.palette, themePrefs.theme]);
  React.useEffect(function () {
    function handleStorageError() { setStorageError(true); }
    window.addEventListener('storage-save-error', handleStorageError);
    return function () { window.removeEventListener('storage-save-error', handleStorageError); };
  }, []);
  // Re-render when any component appends to the activity log (streak pill) or
  // the sync status changes (Settings + gear dot read Store.syncInfo).
  var _React$useStateLogTick = React.useState(0),
    setLogTick = _React$useStateLogTick[1];
  React.useEffect(function () {
    function bump() { setLogTick(function (n) { return n + 1; }); }
    window.addEventListener('activity-logged', bump);
    window.addEventListener('sync-status', bump);
    return function () {
      window.removeEventListener('activity-logged', bump);
      window.removeEventListener('sync-status', bump);
    };
  }, []);
  // PWA (ticket 42): update toast (held while a quiz or mock runs) and the one-time storage-persist request.
  var _upd = React.useState(false), updateReady = _upd[0], setUpdateReady = _upd[1];
  var _qb = React.useState((window.__quizBusy || 0) > 0), quizBusy = _qb[0], setQuizBusy = _qb[1];
  var _per = React.useState(function () { try { return localStorage.getItem(PERSIST_KEY); } catch (e) { return null; } }), persist = _per[0], setPersist = _per[1];
  React.useEffect(function () {
    var ls = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
    function onUpdate() { setUpdateReady(true); }
    function onBusy() { setQuizBusy((window.__quizBusy || 0) > 0); }
    function askPersist() { persistOnce(Store.docs(), navigator.storage, ls).then(function (r) { if (r) setPersist(r); }); }
    window.addEventListener('sw-update-ready', onUpdate);
    window.addEventListener('quiz-busy', onBusy);
    window.addEventListener('activity-logged', askPersist);
    askPersist();
    if (navigator.serviceWorker && navigator.serviceWorker.getRegistration) {
      navigator.serviceWorker.getRegistration().then(function (r) { if (r && r.waiting && navigator.serviceWorker.controller) setUpdateReady(true); }, function () {});
    }
    return function () {
      window.removeEventListener('sw-update-ready', onUpdate);
      window.removeEventListener('quiz-busy', onBusy);
      window.removeEventListener('activity-logged', askPersist);
    };
  }, []);
  // Achievements: evaluate on start, after every logged event and when docs change under us; show the batch.
  var _React$useStateToast = React.useState(null),
    toastBatch = _React$useStateToast[0],
    setToastBatch = _React$useStateToast[1];
  React.useEffect(function () {
    function onLogged() { scheduleAchievements('live'); }
    function onChanged() { scheduleAchievements('retro'); }
    function onBatch(e) {
      var b = e.detail;
      setToastBatch(b);
      if (b && b.jingle) playSfx('achievement'); // once per batch; playSfx respects mute
      setLogTick(function (n) { return n + 1; });
    }
    window.addEventListener('activity-logged', onLogged);
    window.addEventListener('store-changed', onChanged);
    window.addEventListener('achievement-batch', onBatch);
    scheduleAchievements('retro');
    return function () {
      window.removeEventListener('activity-logged', onLogged);
      window.removeEventListener('store-changed', onChanged);
      window.removeEventListener('achievement-batch', onBatch);
    };
  }, []);
  // Docs changed under us (another tab, a synced device, a merge): re-read the
  // snapshot. The unit being viewed stays put; currentUnit only applies on load.
  React.useEffect(function () {
    function refresh() {
      var s = Store.snapshot();
      setCompleted(new Set(s.completed));
      setSrsCards(s.srsCards);
      setFuriganaPref(s.furiganaPref);
      setUiLang(s.uiLang);
      setKanjiViewState(s.kanjiView);
      setPendingCards(s.pendingCards);
      // data arrived under the first-launch welcome (sync, another tab): close it
      setFlow(function (f) { return f && f.screen === 'welcome' && !f.again && !progressIsEmpty(Store.docs()) ? null : f; });
      setLogTick(function (n) { return n + 1; });
    }
    window.addEventListener('store-changed', refresh);
    // A new day: waiting cards fill today's new-card room.
    releasePendingCards(false);
    // Reconnect sync on load if the user connected before (saved login).
    var c = loadSyncCreds();
    if (c && c.connected) connectSync(c);
    return function () { window.removeEventListener('store-changed', refresh); };
  }, []);
  // ponytail: recomputed every render from all log docs; memoize if it shows up in profiles.
  var streak = computeStreak(studyDates(Store.logs()), localDate()).current;
  // Hooks above run unconditionally; bail out here on a broken plan/catalog.
  if (!PLAN_CHECK.valid || !UNITS.length) {
    return React.createElement('div', { style: { padding: 40, textAlign: 'center', fontFamily: 'sans-serif' } },
      React.createElement('h2', null, 'Curriculum failed to load'),
      React.createElement('p', { style: { color: 'var(--bad)' } }, PLAN_CHECK.error || 'no units'),
      React.createElement('button', { onClick: function() { location.reload(); } }, 'Reload')
    );
  }
  var unit = UNITS[Math.min(unitIdx, UNITS.length - 1)];
  var level = unit.level;
  var dueCount = srsDueCards(srsCards).length;
  // Re-derived each render; completing a unit re-renders App (setCompleted).
  var doneToday = unitsDoneToday(Store.docs(), Date.now());
  var showFurigana = furiganaOn(furiganaPref, level);
  var toggleFurigana = function toggleFurigana() {
    Store.putPrefs({ furigana: !showFurigana });
    setFuriganaPref(String(!showFurigana));
  };
  // Settings select: 'auto' clears the stored pref (level-based default), else 'true'/'false'.
  var setFuriganaMode = function setFuriganaMode(mode) {
    Store.putPrefs({ furigana: mode === 'auto' ? null : mode === 'true' });
    setFuriganaPref(mode === 'auto' ? null : mode);
  };
  var openSettings = function openSettings() {
    if (view === 'settings') return;
    setPrevView(view);
    setView('settings');
  };
  // A unit completes only by passing its quiz (Q28); misses are flagged either way.
  var onQuizResult = function onQuizResult(s) {
    if (s.passed) markUnitsDone([unit.id]);
    if (s.missed.length) flagMissedItems(s.missed);
  };
  // Un-marking only flips unit:<id> (sync design decision 10) — SRS cards are kept.
  var unmarkDone = function unmarkDone() {
    Store.putUnit(unit.id, false);
    setCompleted(function (prev) {
      var n = new Set(prev);
      n["delete"](unit.id);
      return n;
    });
  };
  React.useEffect(function () {
    if (unit) Store.putPrefs({ currentUnit: unit.id });
  }, [unit && unit.id]);
  // Welcome / placement exits. Any way out of the welcome marks it seen on this device.
  var closeFlow = function closeFlow() {
    markWelcomeSeen();
    setFlow(null);
  };
  var startAt = function startAt(i, nextView) {
    setUnitIdx(i);
    setView(nextView || 'unit');
    closeFlow();
  };
  // Confirmed placement result: write it, then land on the start stage (or the diagnostic mock).
  var onPlacementApply = function onPlacementApply(res, startUnit, opts) {
    applyPlacement(res);
    var next = startUnit || UNITS[nextUnit(UNITS, new Set(Store.snapshot().completed))];
    startAt(next.index, opts && opts.diagnostic ? 'diagnostic' : 'unit');
  };
  var teachingLeft = placementScope(UNITS, completed).some(function (u) { return u.kind === 'kana' || u.kind === 'lesson'; });
  React.useEffect(function () {
    var open = function () { setView('achievements'); };
    window.addEventListener('open-achievements', open);
    return function () { window.removeEventListener('open-achievements', open); };
  }, []);
  React.useEffect(function () { if (view === 'achievements') markAchievementsSeen(); }, [view]);
  function handleExport() {
    var data = exportProgress(Store.docs(), function (k) {
      try { return localStorage.getItem(k); } catch (e) { return null; }
    });
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'jlpt-progress-' + localDate() + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  function handleImport() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        try {
          var parsed = JSON.parse(ev.target.result);
          var check = validateProgressData(parsed);
          if (!check.valid) { alert('Invalid progress file: ' + check.error); return; }
          if (!confirm('This will overwrite your current progress. Continue?')) return;
          var imported = progressFileToDocs(parsed);
          Object.keys(imported.device).forEach(function (k) {
            safeSave(k, imported.device[k]);
          });
          Store.replaceAll(imported.docs).then(function () {
            if (Store.backend !== 'memory') return location.reload();
            // In-memory session: a reload would lose the import, so apply it in place.
            var s = Store.snapshot();
            setCompleted(new Set(s.completed));
            setSrsCards(s.srsCards);
            var i = UNITS.map(function (u) { return u.id; }).indexOf(s.currentUnit);
            setUnitIdx(i >= 0 ? i : nextUnit(UNITS, new Set(s.completed)));
            setFuriganaPref(s.furiganaPref);
            setUiLang(s.uiLang);
            setKanjiViewState(s.kanjiView);
            setPace(s.pace);
            setExamDate(s.examDate);
            setPendingCards(s.pendingCards);
          });
        } catch (err) {
          alert('Failed to read file: ' + err.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, storageError && /*#__PURE__*/React.createElement("div", {
    className: "storage-warning",
    role: "alert"
  }, /*#__PURE__*/React.createElement("span", { className: "storage-warning-msg" }, jelly('oops', 28), Store.backend === 'memory' ? "\u26a0\ufe0f Progress can't be saved in this browser \u2014 it lasts only until you close this tab. Export before closing. " : "\u26a0\ufe0f Unable to save progress \u2014 storage may be full or disabled. "), /*#__PURE__*/React.createElement("button", {
    onClick: function() { setStorageError(false); },
    className: "storage-warning-dismiss"
  }, "Dismiss")), /*#__PURE__*/React.createElement("header", {
    className: "header"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "brand"
  }, jelly('idle', 30), "日本語 ", /*#__PURE__*/React.createElement("small", null, "N5 → N1")), /*#__PURE__*/React.createElement("nav", {
    className: "nav-tabs",
    role: "navigation",
    'aria-label': "View navigation"
  }, NAV_TABS.map(function (tab) {
    return /*#__PURE__*/React.createElement("button", {
      key: tab.view,
      className: "tab",
      'aria-current': view === tab.view ? 'page' : undefined,
      onClick: function onClick() {
        return setView(tab.view);
      }
    }, icon(tab.icon), /*#__PURE__*/React.createElement("span", null, tRuby(tab.label, level, showFurigana)), tab.view === 'review' && dueCount > 0 && /*#__PURE__*/React.createElement("span", {
      className: "pill"
    }, dueCount, /*#__PURE__*/React.createElement("span", {
      className: "sr-only"
    }, " due")), tab.view === 'achievements' && view !== 'achievements' && achievementBadge() > 0 && React.createElement("span", { className: "pill" }, achievementBadge()));
  })
  ),
  streak > 0 && /*#__PURE__*/React.createElement("span", {
    className: "streak",
    role: "img",
    'aria-label': "Current streak: " + streak + (streak === 1 ? " day" : " days"),
    title: "Current streak"
  }, "🔥 ", streak), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    'aria-label': Store.syncInfo.connected ? "Settings (sync: " + Store.syncInfo.status + ")" : "Settings",
    title: Store.syncInfo.connected ? "Settings · " + t('sync_' + Store.syncInfo.status, level) : "Settings",
    'aria-current': view === 'settings' ? 'page' : undefined,
    onClick: openSettings
  }, icon('gear'), Store.syncInfo.connected && /*#__PURE__*/React.createElement("span", {
    className: "sync-dot sync-" + Store.syncInfo.status,
    'aria-hidden': "true"
  }))), /*#__PURE__*/React.createElement("main", {
    className: view === 'units' || view === 'stats' || view === 'achievements' ? "main wide" : "main"
  }, view === 'settings' ? /*#__PURE__*/React.createElement(SettingsView, {
    themePrefs: themePrefs,
    setThemePrefs: setThemePrefs,
    speechRate: speechRate,
    sfxOn: sfxOn,
    setSfxOn: setSfxOn,
    setSpeechRate: setSpeechRate,
    level: level,
    uiLang: uiLang,
    setUiLang: setUiLang,
    pace: pace,
    setPace: setPace,
    examDate: examDate,
    setExamDate: setExamDate,
    furiganaMode: furiganaPref === 'true' || furiganaPref === 'false' ? furiganaPref : 'auto',
    setFuriganaMode: setFuriganaMode,
    onExport: handleExport,
    onImport: handleImport,
    persist: persist,
    sync: Store.syncInfo,
    savedCreds: loadSyncCreds(),
    onConnect: connectSync,
    onDisconnect: disconnectSync,
    onSyncNow: Store.syncNow,
    cards: srsCards,
    units: UNITS,
    placementOpen: teachingLeft,
    onPlacement: function () { setFlow({ screen: 'placement' }); },
    onWelcome: function () { setFlow({ screen: 'welcome', again: true }); },
    onBack: function onBack() {
      return setView(prevView);
    }
  }) : view === 'review' ? /*#__PURE__*/React.createElement(ReviewMode, {
    // remount when released cards change the due deck
    key: pendingCards.length,
    cards: srsCards,
    level: level,
    pending: pendingCards.length,
    onLearnExtra: function () { releasePendingCards(true); },
    onKnown: function (id) { seedKnown([id], 'known-button', 'known-button:' + localDate()); },
    onUpdate: function onUpdate(updated) {
      setSrsCards(updated);
      Store.putCards(updated);
    }
  }) : view === 'achievements' ? React.createElement(AchievementsView, { level: level }) : view === 'stats' ? React.createElement(StatsView, {
    cards: srsCards,
    onReview: function () { setView('review'); }
  }) : view === 'units' ? /*#__PURE__*/React.createElement(Overview, {
    units: UNITS,
    completed: completed,
    skipped: new Set(Store.snapshot().skipped),
    current: unit.index,
    suggested: nextUnit(UNITS, completed),
    pace: pace,
    doneToday: doneToday,
    examDate: examDate,
    cards: srsCards,
    setUnit: function setUnit(i) {
      setUnitIdx(i);
      setView('unit');
    },
    onDiagnostic: function () { setView('diagnostic'); }
  }) : view === 'diagnostic' ? React.createElement(MockExam, {
    mock: CATALOG.items[DIAGNOSTIC_MOCK],
    onClose: function () { setView('units'); }
  }) : /*#__PURE__*/React.createElement(UnitView, {
    unit: unit,
    units: UNITS,
    completed: completed,
    skipped: new Set(Store.snapshot().skipped),
    unmarkDone: unmarkDone,
    onQuizResult: onQuizResult,
    sfxOn: sfxOn,
    setSfxOn: setSfxOn,
    setUnit: setUnitIdx,
    pace: pace,
    doneToday: doneToday,
    showFurigana: showFurigana,
    toggleFurigana: toggleFurigana,
    kanjiView: kanjiView,
    setKanjiView: setKanjiView,
    cards: srsCards
  })), updateReady && React.createElement(UpdateToast, {
    L: function (k) { return t(k, level); },
    busy: quizBusy,
    onApply: function () { window.__swApplyUpdate && window.__swApplyUpdate(); },
    onLater: function () { setUpdateReady(false); }
  }), React.createElement(ToastStack, {
    batch: toastBatch,
    onDone: function () { setToastBatch(null); },
    // The Achievements screen (ticket 09) listens for 'open-achievements' ({ id? }) and navigates.
    onOpen: function (id) { setToastBatch(null); window.dispatchEvent(new CustomEvent('open-achievements', { detail: { id: id } })); },
    onMore: function () { setToastBatch(null); window.dispatchEvent(new CustomEvent('open-achievements', { detail: {} })); }
  }), flow && flow.screen === 'welcome' && React.createElement(WelcomeView, {
    level: level,
    units: UNITS,
    pace: pace,
    setPace: setPace,
    examDate: examDate,
    setExamDate: setExamDate,
    again: flow.again,
    onZero: function () { startAt(0); },
    onFind: function () { setFlow({ screen: 'placement', fromWelcome: true, again: flow.again }); },
    onSkip: closeFlow
  }), flow && flow.screen === 'placement' && React.createElement(PlacementFlow, {
    units: UNITS,
    completed: completed,
    level: level,
    onApply: onPlacementApply,
    // leaving saves nothing: back to the welcome it came from, else straight to where the learner was
    onClose: function () { setFlow(flow.fromWelcome ? { screen: 'welcome', again: flow.again } : null); }
  }));
}

var ErrorBoundary = (function () {
  function ErrorBoundary(props) { this.props = props; this.state = { hasError: false, error: null }; }
  ErrorBoundary.prototype = Object.create(React.Component.prototype);
  ErrorBoundary.prototype.constructor = ErrorBoundary;
  ErrorBoundary.getDerivedStateFromError = function (error) { return { hasError: true, error: error }; };
  ErrorBoundary.prototype.componentDidCatch = function (error, info) { console.error('App crash:', error, info); };
  ErrorBoundary.prototype.render = function () {
    if (this.state.hasError) {
      var self = this;
      return React.createElement('div', { style: { padding: 40, textAlign: 'center' } },
        React.createElement('h2', null, 'Something went wrong'),
        React.createElement('p', null, self.state.error && self.state.error.message),
        React.createElement('button', { onClick: function() { location.reload(); } }, 'Reload'),
        React.createElement('button', { onClick: function() {
          localStorage.clear();
          var wipe = typeof PouchDB !== 'undefined' ? new PouchDB(STORE_DB_NAME).destroy() : Promise.resolve();
          wipe.catch(function () {}).then(function () { location.reload(); });
        } }, 'Reset all data')
      );
    }
    return this.props.children;
  };
  return ErrorBoundary;
}());
// Brief loading state while Store reads every doc into memory, then mount App.
var appRoot = ReactDOM.createRoot(document.getElementById('root'));
appRoot.render(React.createElement('div', { role: 'status', style: { padding: 40, textAlign: 'center', color: 'var(--muted)' } }, 'Loading…'));
Store.init().then(function () {
  appRoot.render(/*#__PURE__*/React.createElement(ErrorBoundary, null, React.createElement(App, null)));
});
