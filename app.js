"use strict";

// Navbar view tabs (label = UI_STRINGS key, icon = ICONS key in app-helpers.js)
// Catalog + plan → ordered unit list, once at load (data/*.js are loaded before lib.js).
var PLAN_CHECK = validatePlan(PLAN, CATALOG);
var UNITS = PLAN_CHECK.valid ? buildUnits(PLAN, CATALOG) : [];

var NAV_TABS = [
  { view: 'unit', label: 'view_today', icon: 'today' },
  { view: 'units', label: 'view_units', icon: 'units' },
  { view: 'stats', label: 'view_stats', icon: 'stats' },
  { view: 'review', label: 'view_review', icon: 'review' }
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
  // Pace (units/day, PACE_MODES in lib.js) + optional exam date 'YYYY-MM-DD'; synced prefs.
  var _React$useStatePace = React.useState(snap0.pace),
    pace = _React$useStatePace[0],
    setPace = _React$useStatePace[1];
  var _React$useStateExam = React.useState(snap0.examDate),
    examDate = _React$useStateExam[0],
    setExamDate = _React$useStateExam[1];
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
  // Docs changed under us (another tab, a synced device, a merge): re-read the
  // snapshot. The unit being viewed stays put; currentUnit only applies on load.
  React.useEffect(function () {
    function refresh() {
      var s = Store.snapshot();
      setCompleted(new Set(s.completed));
      setSrsCards(s.srsCards);
      setFuriganaPref(s.furiganaPref);
      setUiLang(s.uiLang);
      setLogTick(function (n) { return n + 1; });
    }
    window.addEventListener('store-changed', refresh);
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
  var toggleDone = function toggleDone() {
    var wasDone = completed.has(unit.id);
    Store.putUnit(unit.id, !wasDone);
    if (!wasDone) Store.logLesson(unit.id);
    setCompleted(function (prev) {
      var n = new Set(prev);
      n.has(unit.id) ? n["delete"](unit.id) : n.add(unit.id);
      return n;
    });
    // Un-marking only flips unit:<id> (sync design decision 10) — SRS cards are kept.
    if (!wasDone) setSrsCards(function (prev) {
      var cards = Object.assign({}, prev);
      if (srsAddCards(unit, cards)) Store.putCards(cards);
      return cards;
    });
  };
  React.useEffect(function () {
    if (unit) Store.putPrefs({ currentUnit: unit.id });
  }, [unit && unit.id]);
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
            setPace(s.pace);
            setExamDate(s.examDate);
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
  }, Store.backend === 'memory' ? "\u26a0\ufe0f Progress can't be saved in this browser \u2014 it lasts only until you close this tab. Export before closing. " : "\u26a0\ufe0f Unable to save progress \u2014 storage may be full or disabled. ", /*#__PURE__*/React.createElement("button", {
    onClick: function() { setStorageError(false); },
    className: "storage-warning-dismiss"
  }, "Dismiss")), /*#__PURE__*/React.createElement("header", {
    className: "header"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "brand"
  }, "日本語 ", /*#__PURE__*/React.createElement("small", null, "N5 → N1")), /*#__PURE__*/React.createElement("nav", {
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
    }, " due")));
  })
  // Slot: Achievements tab (実績) joins NAV_TABS once achievements exist.
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
    className: view === 'units' || view === 'stats' ? "main wide" : "main"
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
    sync: Store.syncInfo,
    savedCreds: loadSyncCreds(),
    onConnect: connectSync,
    onDisconnect: disconnectSync,
    onSyncNow: Store.syncNow,
    onBack: function onBack() {
      return setView(prevView);
    }
  }) : view === 'review' ? /*#__PURE__*/React.createElement(ReviewMode, {
    cards: srsCards,
    level: level,
    onUpdate: function onUpdate(updated) {
      setSrsCards(updated);
      Store.putCards(updated);
    }
  }) : view === 'stats' ? React.createElement(StatsView, {
    cards: srsCards,
    onReview: function () { setView('review'); }
  }) : view === 'units' ? /*#__PURE__*/React.createElement(Overview, {
    units: UNITS,
    completed: completed,
    current: unit.index,
    suggested: nextUnit(UNITS, completed),
    pace: pace,
    doneToday: doneToday,
    examDate: examDate,
    setUnit: function setUnit(i) {
      setUnitIdx(i);
      setView('unit');
    }
  }) : /*#__PURE__*/React.createElement(UnitView, {
    unit: unit,
    units: UNITS,
    completed: completed,
    toggleDone: toggleDone,
    setUnit: setUnitIdx,
    pace: pace,
    doneToday: doneToday,
    showFurigana: showFurigana,
    toggleFurigana: toggleFurigana
  })));
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
