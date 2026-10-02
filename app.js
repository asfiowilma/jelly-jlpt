"use strict";

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
  var pct = Math.round(completed.size / totalDays * 100);
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
  }, /*#__PURE__*/React.createElement("h1", null, "\u65E5\u672C\u8A9E N5\u2013N1 Course"), /*#__PURE__*/React.createElement("div", {
    className: "header-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-bar",
    role: "progressbar",
    'aria-valuenow': pct,
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-label': "Course progress: " + pct + "%"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-fill",
    style: {
      width: pct + '%'
    }
  })), /*#__PURE__*/React.createElement("span", null, completed.size, " / ", totalDays)), /*#__PURE__*/React.createElement("label", {
    className: "tts-rate-label"
  }, "\uD83D\uDD0A\u00A0", /*#__PURE__*/React.createElement("select", {
    className: "tts-rate-select",
    value: String(speechRate),
    onChange: function(e) { setSpeechRate(parseFloat(e.target.value)); },
    'aria-label': "TTS playback speed"
  }, /*#__PURE__*/React.createElement("option", { value: "0.5" }, "0.5\u00D7"),
     /*#__PURE__*/React.createElement("option", { value: "0.75" }, "0.75\u00D7"),
     /*#__PURE__*/React.createElement("option", { value: "0.85" }, "0.85\u00D7"),
     /*#__PURE__*/React.createElement("option", { value: "1" }, "1.0\u00D7"),
     /*#__PURE__*/React.createElement("option", { value: "1.25" }, "1.25\u00D7")
  )), /*#__PURE__*/React.createElement("select", {
    className: "theme-select",
    value: themePrefs.palette,
    onChange: function(e) { setThemePrefs({ palette: e.target.value, theme: themePrefs.theme }); },
    'aria-label': "Color palette"
  }, THEME_PALETTES.map(function (p) {
    return /*#__PURE__*/React.createElement("option", { key: p.id, value: p.id }, p.k + ' ' + p.name);
  })), /*#__PURE__*/React.createElement("button", {
    className: "theme-toggle",
    'aria-pressed': themePrefs.theme === 'dark',
    onClick: function() { setThemePrefs({ palette: themePrefs.palette, theme: themePrefs.theme === 'dark' ? 'light' : 'dark' }); },
    title: "Toggle dark mode"
  }, "☾ Dark mode"), /*#__PURE__*/React.createElement("button", {
    className: "data-btn",
    onClick: handleExport,
    'aria-label': "Export progress to file",
    title: "Export progress"
  }, "Export"), /*#__PURE__*/React.createElement("button", {
    className: "data-btn",
    onClick: handleImport,
    'aria-label': "Import progress from file",
    title: "Import progress"
  }, "Import"), /*#__PURE__*/React.createElement("div", {
    className: "view-btns",
    role: "navigation",
    'aria-label': "View navigation"
  }, /*#__PURE__*/React.createElement("button", {
    className: "view-btn ".concat(view === 'day' ? 'active' : ''),
    onClick: function onClick() {
      return setView('day');
    }
  }, "Day View"), /*#__PURE__*/React.createElement("button", {
    className: "view-btn ".concat(view === 'overview' ? 'active' : ''),
    onClick: function onClick() {
      return setView('overview');
    }
  }, "Overview"), /*#__PURE__*/React.createElement("button", {
    className: "view-btn ".concat(view === 'review' ? 'active' : ''),
    onClick: function onClick() {
      return setView('review');
    }
  }, t('view_review', dayNum), srsDueCards(srsCards).length > 0 ? " (".concat(srsDueCards(srsCards).length, ")") : '')))), /*#__PURE__*/React.createElement("main", {
    className: "main"
  }, view === 'review' ? /*#__PURE__*/React.createElement(ReviewMode, {
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
    setDay: setDayNum
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
