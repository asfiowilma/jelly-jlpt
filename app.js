"use strict";

// Navbar view tabs (label = UI_STRINGS key, icon = ICONS key in app-helpers.js)
var NAV_TABS = [
  { view: 'day', label: 'view_today', icon: 'today' },
  { view: 'overview', label: 'view_overview', icon: 'overview' },
  { view: 'review', label: 'view_review', icon: 'review' }
];

function App() {
  var _React$useState23 = React.useState(function () {
      try {
        return parseInt(localStorage.getItem('n5_day') || '1') || 1;
      } catch (e) {
        return 1;
      }
    }),
    _React$useState24 = _slicedToArray(_React$useState23, 2),
    dayNum = _React$useState24[0],
    setDayNum = _React$useState24[1];
  var _React$useState25 = React.useState(function () {
      return srsLoad();
    }),
    _React$useState26 = _slicedToArray(_React$useState25, 2),
    srsCards = _React$useState26[0],
    setSrsCards = _React$useState26[1];
  var _React$useState27 = React.useState(function () {
      try {
        return new Set(JSON.parse(localStorage.getItem('n5_completed') || '[]'));
      } catch (e) {
        return new Set();
      }
    }),
    _React$useState28 = _slicedToArray(_React$useState27, 2),
    completed = _React$useState28[0],
    setCompleted = _React$useState28[1];
  var _React$useState29 = React.useState('day'),
    _React$useState30 = _slicedToArray(_React$useState29, 2),
    view = _React$useState30[0],
    setView = _React$useState30[1];
  // View to return to when Settings is closed
  var _React$useStatePrev = React.useState('day'),
    _React$useStatePrev2 = _slicedToArray(_React$useStatePrev, 2),
    prevView = _React$useStatePrev2[0],
    setPrevView = _React$useStatePrev2[1];
  // Raw n5_furigana pref (null = unset → day-based default, see furiganaOn).
  // Lives here, not in DayView, so the navbar ruby follows the same toggle.
  var _React$useStateFuri = React.useState(function () {
      try {
        return localStorage.getItem('n5_furigana');
      } catch (e) {
        return null;
      }
    }),
    _React$useStateFuri2 = _slicedToArray(_React$useStateFuri, 2),
    furiganaPref = _React$useStateFuri2[0],
    setFuriganaPref = _React$useStateFuri2[1];
  // Interface language: 'auto' (progressive EN→JA by day), 'en' or 'ja'.
  // ponytail: defaults to 'en' while the app is under development; flip the
  // fallback to 'auto' for release.
  var _React$useStateLang = React.useState(function () {
      try {
        var v = localStorage.getItem('jlpt_ui_lang');
        return v === 'auto' || v === 'ja' ? v : 'en';
      } catch (e) {
        return 'en';
      }
    }),
    _React$useStateLang2 = _slicedToArray(_React$useStateLang, 2),
    uiLang = _React$useStateLang2[0],
    setUiLang = _React$useStateLang2[1];
  // Set during render (not in an effect) so t() in this render already sees it.
  window._uiLang = uiLang;
  React.useEffect(function () {
    safeSave('jlpt_ui_lang', uiLang);
  }, [uiLang]);
  var _React$useStateStorageErr = React.useState(!storageAvailable()),
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
  var curriculumCheck = validateCurriculum(curriculum);
  if (!curriculumCheck.valid) {
    return React.createElement('div', { style: { padding: 40, textAlign: 'center', fontFamily: 'sans-serif' } },
      React.createElement('h2', null, 'Curriculum failed to load'),
      React.createElement('p', { style: { color: 'var(--bad)' } }, curriculumCheck.error),
      React.createElement('button', { onClick: function() { location.reload(); } }, 'Reload')
    );
  }
  var lesson = curriculum[dayNum - 1];
  var pColor = PHASE_COLORS[lesson.phaseNum] || 'var(--muted)';
  var pBg = PHASE_BG[lesson.phaseNum] || 'var(--surface2)';
  var totalDays = curriculum.length;
  var dueCount = srsDueCards(srsCards).length;
  var showFurigana = furiganaOn(furiganaPref, dayNum);
  var toggleFurigana = function toggleFurigana() {
    var next = String(!showFurigana);
    safeSave('n5_furigana', next);
    setFuriganaPref(next);
  };
  // Settings select: 'auto' clears the stored pref (day-based default), else 'true'/'false'.
  var setFuriganaMode = function setFuriganaMode(mode) {
    if (mode === 'auto') {
      try { localStorage.removeItem('n5_furigana'); } catch (e) {}
      setFuriganaPref(null);
    } else {
      safeSave('n5_furigana', mode);
      setFuriganaPref(mode);
    }
  };
  var openSettings = function openSettings() {
    if (view === 'settings') return;
    setPrevView(view);
    setView('settings');
  };
  var toggleDone = function toggleDone() {
    var wasDone = completed.has(dayNum);
    setCompleted(function (prev) {
      var n = new Set(prev);
      n.has(dayNum) ? n["delete"](dayNum) : n.add(dayNum);
      return n;
    });
    setSrsCards(function (prev) {
      var cards = Object.assign({}, prev);
      if (wasDone) {
        var prefix1 = 'v_' + dayNum + '_';
        var prefix2 = 'c_' + dayNum + '_';
        Object.keys(cards).forEach(function (id) {
          if (id.startsWith(prefix1) || id.startsWith(prefix2)) {
            delete cards[id];
          }
        });
      } else {
        srsAddCards(lesson, cards);
      }
      srsSave(cards);
      return cards;
    });
  };
  React.useEffect(function () {
    safeSave('n5_day', String(dayNum));
  }, [dayNum]);
  React.useEffect(function () {
    safeSave('n5_completed', JSON.stringify(_toConsumableArray(completed)));
  }, [completed]);
  function handleExport() {
    var data = exportProgress();
    if (!data) { alert('Unable to access storage for export.'); return; }
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    var d = new Date();
    var stamp = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    a.href = url;
    a.download = 'jlpt-progress-' + stamp + '.json';
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
          Object.keys(parsed.keys).forEach(function (k) {
            safeSave(k, parsed.keys[k]);
          });
          location.reload();
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
  }, "\u26a0\ufe0f Unable to save progress \u2014 storage may be full or disabled. ", /*#__PURE__*/React.createElement("button", {
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
    }, icon(tab.icon), /*#__PURE__*/React.createElement("span", null, tRuby(tab.label, dayNum, showFurigana)), tab.view === 'review' && dueCount > 0 && /*#__PURE__*/React.createElement("span", {
      className: "pill"
    }, dueCount, /*#__PURE__*/React.createElement("span", {
      className: "sr-only"
    }, " due")));
  })
  // Slot: Achievements tab (実績) joins NAV_TABS once achievements exist.
  ),
  // Slot: streak pill goes here (before the gear) once the dated activity log exists.
  /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    'aria-label': "Settings",
    title: "Settings",
    'aria-current': view === 'settings' ? 'page' : undefined,
    onClick: openSettings
  }, icon('gear'))), /*#__PURE__*/React.createElement("main", {
    className: "main"
  }, view === 'settings' ? /*#__PURE__*/React.createElement(SettingsView, {
    themePrefs: themePrefs,
    setThemePrefs: setThemePrefs,
    speechRate: speechRate,
    setSpeechRate: setSpeechRate,
    dayNum: dayNum,
    uiLang: uiLang,
    setUiLang: setUiLang,
    furiganaMode: furiganaPref === 'true' || furiganaPref === 'false' ? furiganaPref : 'auto',
    setFuriganaMode: setFuriganaMode,
    onExport: handleExport,
    onImport: handleImport,
    onBack: function onBack() {
      return setView(prevView);
    }
  }) : view === 'review' ? /*#__PURE__*/React.createElement(ReviewMode, {
    cards: srsCards,
    dayNum: dayNum,
    onUpdate: function onUpdate(updated) {
      setSrsCards(updated);
      srsSave(updated);
    }
  }) : view === 'overview' ? /*#__PURE__*/React.createElement(Overview, {
    curriculum: curriculum,
    completed: completed,
    dayNum: dayNum,
    setDay: function setDay(d) {
      setDayNum(d);
      setView('day');
    },
    currentDay: dayNum
  }) : /*#__PURE__*/React.createElement(DayView, {
    lesson: lesson,
    dayNum: dayNum,
    totalDays: totalDays,
    pColor: pColor,
    pBg: pBg,
    completed: completed,
    toggleDone: toggleDone,
    setDay: setDayNum,
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
        React.createElement('button', { onClick: function() { localStorage.clear(); location.reload(); } }, 'Reset all data')
      );
    }
    return this.props.children;
  };
  return ErrorBoundary;
}());
ReactDOM.createRoot(document.getElementById('root')).render(
  /*#__PURE__*/React.createElement(ErrorBoundary, null, React.createElement(App, null))
);
