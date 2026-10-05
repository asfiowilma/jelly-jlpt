"use strict";

// Settings view, opened from the navbar gear. Holds everything that used to
// crowd the header: appearance, audio, data export/import (and later sync).
function SettingsView(props) {
  var themePrefs = props.themePrefs,
    setThemePrefs = props.setThemePrefs;
  var ce = React.createElement;
  var L = function (key) { return t(key, props.level); };
  var section = function (id, title) {
    var children = Array.prototype.slice.call(arguments, 2);
    return ce.apply(React, ["section", { className: "settings-section", 'aria-labelledby': id },
      ce("h3", { id: id }, title)].concat(children));
  };
  // A setting row: label + helper text on the left, the control on the right
  var field = function (id, label, hint, control) {
    return ce("div", { className: "setting-row" },
      ce("div", { className: "setting-l" },
        ce("label", { htmlFor: id }, label),
        hint && ce("span", { className: "setting-sub", id: id + "-hint" }, hint)),
      control);
  };
  var labeled = function (label, hint, control) {
    return ce("div", { className: "setting-row" },
      ce("div", { className: "setting-l" }, ce("span", { className: "setting-lbl" }, label), ce("span", { className: "setting-sub" }, hint)),
      control);
  };
  var group = function (id, title, desc) {
    var children = Array.prototype.slice.call(arguments, 3);
    return ce.apply(React, ["div", { className: "set-grp set-grp-" + id, id: "set-grp-" + id },
      ce("h2", null, title), desc && ce("p", null, desc)].concat(children));
  };
  var jump = function (id) {
    return function () {
      var el = document.getElementById(id);
      var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (el) el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
    };
  };
  var GROUPS = ['study', 'look', 'data', 'about'];
  var mode = PACE_MODES.filter(function (m) { return m.pace === props.pace; })[0] || PACE_MODES[1];
  var dots = ['--bg', '--accent', '--jm'].map(function (v) {
    return ce("i", { key: v, style: { background: 'var(' + v + ')' } });
  });
  var made = L("set_made_with").split("♥");
  return ce("div", { className: "settings" },
    ce("div", { className: "settings-head" },
      ce("button", { className: "back-btn", onClick: props.onBack }, L("settings_back")),
      ce("h2", null, L("settings_title"))),
    ce(InstallCardLive, { L: L }),
    ce("nav", { className: "set-chips", 'aria-label': L("settings_title") }, GROUPS.map(function (g) {
      return ce("button", { key: g, type: "button", className: "set-chip", onClick: jump("set-grp-" + g) }, L("set_grp_" + g));
    })),
    group("study", L("set_grp_study"), L("set_grp_study_d"),
      section("set-pace", L("set_pace_section"),
        field("set-pace-mode", L("set_pace"), L(mode.key + "_h"),
          ce("select", {
            id: "set-pace-mode",
            className: "theme-select",
            'aria-describedby': "set-pace-mode-hint",
            value: String(props.pace),
            onChange: function (e) { props.setPace(parseFloat(e.target.value)); }
          }, PACE_MODES.map(function (m) {
            return ce("option", { key: m.pace, value: String(m.pace) }, L(m.key + "_n"));
          }))),
        props.pace >= 3 && ce("p", { className: "setting-hint setting-note", role: "note" }, L("pace_super_note")),
        field("set-exam-date", L("set_exam_date"), L("set_exam_hint"),
          ce("input", {
            id: "set-exam-date",
            type: "date",
            className: "theme-select",
            'aria-describedby': "set-exam-date-hint",
            value: props.examDate || "",
            onChange: function (e) { props.setExamDate(e.target.value || null); }
          }))),
      section("set-language", L("set_language"),
        field("set-ui-lang", L("set_ui_lang"), L("set_lang_h_" + props.uiLang),
          ce("select", {
            id: "set-ui-lang",
            className: "theme-select",
            'aria-describedby': "set-ui-lang-hint",
            value: props.uiLang,
            onChange: function (e) { props.setUiLang(e.target.value); }
          },
            ce("option", { value: "auto" }, L("set_lang_auto")),
            ce("option", { value: "en" }, "English"),
            ce("option", { value: "ja" }, "日本語"))),
        field("set-furigana", L("set_furigana"), L("set_furi_h_" + props.furiganaMode),
          ce("select", {
            id: "set-furigana",
            className: "theme-select",
            'aria-describedby': "set-furigana-hint",
            value: props.furiganaMode,
            onChange: function (e) { props.setFuriganaMode(e.target.value); }
          },
            ce("option", { value: "auto" }, L("set_furi_auto")),
            ce("option", { value: "true" }, L("set_furi_always")),
            ce("option", { value: "false" }, L("set_furi_never"))))),
      section("set-start", L("set_start"),
        labeled(L("set_placement_l"), L(props.placementOpen ? "set_placement_hint" : "set_placement_done"),
          ce("button", { id: "set-placement", className: "data-btn", type: "button", disabled: !props.placementOpen, onClick: props.onPlacement }, L("set_placement"))),
        labeled(L("set_welcome_l"), L("set_welcome_hint"),
          ce("button", { id: "set-welcome", className: "data-btn", type: "button", onClick: props.onWelcome }, L("set_welcome")))),
      section("set-known", L("set_known"),
        ce(ImportSettings, { L: L, level: props.level, cards: props.cards, units: props.units }))),
    group("look", L("set_grp_look"), L("set_grp_look_d"),
      section("set-appearance", L("set_appearance"),
        ce("div", { className: "setting-row" },
          ce("label", { htmlFor: "set-palette" }, L("set_palette")),
          ce("div", { className: "setting-ctl" },
            ce("span", { className: "pal-dots", 'aria-hidden': "true" }, dots),
            ce("select", {
              id: "set-palette",
              className: "theme-select",
              value: themePrefs.palette,
              onChange: function (e) { setThemePrefs({ palette: e.target.value, theme: themePrefs.theme }); }
            }, THEME_PALETTES.map(function (p) {
              return ce("option", { key: p.id, value: p.id }, p.k + ' ' + p.name);
            })))),
        ce("div", { className: "setting-row" },
          ce("span", { id: "set-dark-label" }, L("set_dark")),
          ce("button", {
            className: "theme-toggle",
            role: "switch",
            'aria-checked': themePrefs.theme === 'dark',
            'aria-labelledby': "set-dark-label",
            onClick: function () { setThemePrefs({ palette: themePrefs.palette, theme: themePrefs.theme === 'dark' ? 'light' : 'dark' }); }
          }, themePrefs.theme === 'dark' ? L("set_on") : L("set_off")))),
      section("set-audio", L("set_audio"),
        ce("div", { className: "setting-row" },
          ce("label", { htmlFor: "set-tts-rate" }, L("set_speech_speed")),
          ce("select", {
            id: "set-tts-rate",
            className: "tts-rate-select",
            value: String(props.speechRate),
            onChange: function (e) { props.setSpeechRate(parseFloat(e.target.value)); }
          }, ["0.5", "0.75", "0.85", "1", "1.25"].map(function (v) {
            return ce("option", { key: v, value: v }, (v === "1" ? "1.0" : v) + "×");
          }))),
        ce("div", { className: "setting-row" },
          ce("span", { id: "set-sfx-label" }, L("set_sfx")),
          ce("button", {
            className: "theme-toggle",
            role: "switch",
            'aria-checked': props.sfxOn,
            'aria-labelledby': "set-sfx-label",
            onClick: function () { props.setSfxOn(!props.sfxOn); if (!props.sfxOn) playSfx('correct'); }
          }, props.sfxOn ? L("set_on") : L("set_off"))),
        // Listening in the app is the browser's own voice (ticket 16); the official samples are real audio
        labeled(L("set_official_audio_l"), L("set_official_audio_hint"),
          ce("a", { className: "data-btn", href: "https://www.jlpt.jp/e/samples/sampleindex.html", target: "_blank", rel: "noopener noreferrer" }, L("set_official_audio"))))),
    group("data", L("set_grp_data"), L("set_grp_data_d"),
      section("set-data", L("set_data"),
        ce("div", { className: "setting-row" },
          ce("span", { className: "setting-hint" }, L("set_data_hint")),
          ce("div", { className: "setting-btns" },
            ce("button", { className: "data-btn", onClick: props.onExport, 'aria-label': "Export progress to file" }, L("set_export")),
            ce("button", { className: "data-btn", onClick: props.onImport, 'aria-label': "Import progress from file" }, L("set_import")))),
        ce("p", { id: "persist-status", className: "setting-hint persist-" + (props.persist || "pending"), role: "status" },
          L(props.persist === "granted" ? "persist_granted" : props.persist ? "persist_denied" : "persist_pending"))),
      section("set-sync", L("set_sync"),
        ce(NetLineLive, { L: L }),
        ce(SyncSettings, { L: L, sync: props.sync, savedCreds: props.savedCreds,
          onConnect: props.onConnect, onDisconnect: props.onDisconnect, onSyncNow: props.onSyncNow }))),
    group("about", L("set_grp_about"), null,
      SupportSection({ L: L }),
      ce("details", { className: "settings-section credits-card" },
        ce("summary", null,
          ce("span", { className: "cr-t" }, L("set_credits")),
          ce("span", { className: "cr-n" }, L("set_credits_n").replace("{n}", CREDITS.length))),
        ce("ul", { className: "credits" }, CREDITS.map(function (c) {
          return ce("li", { key: c.name },
            ce("a", { href: c.url, target: "_blank", rel: "noopener noreferrer" }, c.name),
            ': ' + L(c.key) + ' (',
            ce("a", { href: c.licenseUrl, target: "_blank", rel: "noopener noreferrer" }, c.license), ')');
        }))),
      ce(ResetZone, { L: L, onExport: props.onExport, onReset: props.onReset, synced: !!(props.sync && props.sync.connected) })),
    ce("footer", { className: "settings-foot" }, made[0], icon("heart"), made[1]));
}

// Settings → Danger zone (ticket 43): one button, a confirm dialog that needs the word typed.
var RESET_WORD = 'RESET';
function resetWordOk(text) { return String(text || '').trim().toUpperCase() === RESET_WORD; }
function ResetZone(props) {
  var L = props.L, ce = React.createElement;
  var _o = React.useState(false), open = _o[0], setOpen = _o[1];
  return ce("section", { className: "settings-section danger-zone", 'aria-labelledby': "set-danger" },
    ce("h3", { id: "set-danger" }, L("set_danger")),
    ce("div", { className: "setting-row" },
      ce("span", { className: "setting-hint" }, L("reset_hint")),
      ce("button", { id: "set-reset", className: "data-btn danger-btn", type: "button", onClick: function () { setOpen(true); } }, L("reset_btn"))),
    open && ce(ResetDialog, { L: L, synced: props.synced, onExport: props.onExport, onReset: props.onReset, onClose: function () { setOpen(false); } }));
}
function ResetDialog(props) {
  var L = props.L, ce = React.createElement;
  var _t = React.useState(''), word = _t[0], setWord = _t[1];
  var _b = React.useState(false), busy = _b[0], setBusy = _b[1];
  var _e = React.useState(false), failed = _e[0], setFailed = _e[1];
  var ref = React.useRef(null), cancelRef = React.useRef(null);
  var ready = resetWordOk(word) && !busy;
  React.useEffect(function () { if (cancelRef.current && cancelRef.current.focus) cancelRef.current.focus(); }, []); // Cancel is the default focus
  // Escape closes; Tab wraps inside the dialog (same idea as the quiz layer's trapTab)
  var onKey = function (e) {
    if (e.key === 'Escape') { if (!busy) props.onClose(); return; }
    if (e.key !== 'Tab' || !ref.current) return;
    var f = [].slice.call(ref.current.querySelectorAll('button,input')).filter(function (el) { return !el.disabled; });
    var a = document.activeElement;
    if (e.shiftKey && (a === f[0] || !ref.current.contains(a))) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && (a === f[f.length - 1] || !ref.current.contains(a))) { e.preventDefault(); f[0].focus(); }
  };
  var go = function () {
    if (!ready) return;
    setBusy(true);
    setFailed(false);
    Promise.resolve(props.onReset()).then(props.onClose, function () { setBusy(false); setFailed(true); });
  };
  return ce("div", { className: "reset-scrim", onMouseDown: function (e) { if (e.target === e.currentTarget && !busy) props.onClose(); } },
    ce("div", { className: "reset-dlg", ref: ref, role: "dialog", 'aria-modal': "true", 'aria-labelledby': "reset-title", 'aria-describedby': "reset-body", onKeyDown: onKey },
      ce("h2", { id: "reset-title" }, L("reset_title")),
      ce("p", { id: "reset-body" }, L("reset_body")),
      props.synced && ce("p", { className: "reset-sync" }, L("reset_sync")),
      ce("button", { id: "reset-backup", className: "data-btn", type: "button", onClick: props.onExport }, L("reset_backup")),
      ce("label", { htmlFor: "reset-word", className: "reset-label" }, L("reset_type").replace("{word}", RESET_WORD)),
      ce("input", { id: "reset-word", className: "sync-input", type: "text", value: word, autoComplete: "off", spellCheck: false, autoCapitalize: "characters",
        onChange: function (e) { setWord(e.target.value); }, onKeyDown: function (e) { if (e.key === 'Enter') go(); } }),
      failed && ce("p", { className: "sync-form-err", role: "alert" }, L("reset_failed")),
      ce("div", { className: "reset-row" },
        ce("button", { id: "reset-cancel", className: "data-btn", type: "button", ref: cancelRef, onClick: props.onClose }, L("reset_cancel")),
        ce("button", { id: "reset-go", className: "data-btn danger-btn solid", type: "button", disabled: !ready, onClick: go }, L("reset_go")))));
}

// Third-party content shipped with the app (map Q4: credits live in Settings).
var CREDITS = [
  { name: 'alanfwilliams/jlpt', url: 'https://github.com/alanfwilliams/jlpt', key: 'cred_upstream', license: 'MIT', licenseUrl: 'https://github.com/alanfwilliams/jlpt' }, // ponytail: upstream README states MIT, no LICENSE file to deep-link
  { name: 'KanjiVG', url: 'https://kanjivg.tagaini.net/', key: 'cred_kanjivg', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/' },
  { name: 'Tanos', url: 'https://www.tanos.co.uk/jlpt/', key: 'cred_tanos', license: 'CC BY', licenseUrl: 'https://www.tanos.co.uk/jlpt/' }, // ponytail: site states CC BY without a version
  { name: 'Tatoeba', url: 'https://tatoeba.org/', key: 'cred_tatoeba', license: 'CC BY 2.0 FR', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/fr/' },
  { name: 'elzup/jlpt-word-list', url: 'https://github.com/elzup/jlpt-word-list', key: 'cred_wordlist', license: 'MIT', licenseUrl: 'https://github.com/elzup/jlpt-word-list/blob/master/LICENSE' },
  { name: 'Kenney', url: 'https://kenney.nl/assets/music-jingles', key: 'cred_kenney', license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' },
  { name: 'Qwen3-TTS (Alibaba Qwen team)', url: 'https://github.com/QwenLM/Qwen3-TTS', key: 'cred_qwen3tts', license: 'Apache 2.0', licenseUrl: 'https://github.com/QwenLM/Qwen3-TTS/blob/main/LICENSE' },
  { name: 'DiceBear', url: 'https://www.dicebear.com/', key: 'cred_dicebear', license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' },
  { name: 'React', url: 'https://react.dev/', key: 'cred_react', license: 'MIT', licenseUrl: 'vendor/LICENSE-react.txt' },
  { name: 'PouchDB', url: 'https://pouchdb.com/', key: 'cred_pouchdb', license: 'Apache 2.0', licenseUrl: 'vendor/LICENSE-pouchdb.txt' }
];

// Settings → Sync: connect form when not connected, status + controls when
// connected. sync = Store.syncInfo; savedCreds = loadSyncCreds();
// onConnect(form) → Promise<{ error, detail }>.
function SyncSettings(props) {
  var L = props.L, sync = props.sync, saved = props.savedCreds || {};
  var _f = React.useState(function () {
      return { url: saved.url || '', username: saved.username || '', password: saved.password || '', remember: !!saved.remember };
    }), form = _f[0], setForm = _f[1];
  var _e = React.useState(null), formErr = _e[0], setFormErr = _e[1];
  var _b = React.useState(false), busy = _b[0], setBusy = _b[1];
  var _g = React.useState(false), forget = _g[0], setForget = _g[1];
  var errText = function (key, detail) { return L(key) + (key === 'sync_err_other' && detail ? ' ' + detail : ''); };
  var hint = React.createElement("p", { className: "setting-hint" }, L("set_sync_hint"));
  var status = React.createElement("p", { className: "sync-status sync-corner", role: "status" },
    React.createElement("span", { className: "sync-dot sync-" + sync.status, 'aria-hidden': "true" }),
    L("sync_" + sync.status),
    sync.summary ? " · " + L("sync_merged").replace('{units}', sync.summary.units).replace('{cards}', sync.summary.cards) : null);
  var check = function (checked, onChange, label, describedBy) {
    return React.createElement("label", { className: "sync-check" },
      React.createElement("input", { type: "checkbox", checked: checked, onChange: onChange, 'aria-describedby': describedBy }), label);
  };
  if (sync.connected) {
    return React.createElement(React.Fragment, null, status, hint,
      sync.error ? React.createElement("p", { className: "sync-form-err", role: "alert" }, errText(sync.error, sync.detail)) : null,
      React.createElement("p", { className: "setting-hint sync-who" }, L("set_sync_as") + ' ' + saved.username + ' · ' + saved.url),
      React.createElement("div", { className: "setting-row" },
        check(forget, function (e) { setForget(e.target.checked); }, L("set_sync_forget")),
        React.createElement("div", { className: "setting-btns" },
          React.createElement("button", { className: "data-btn", type: "button", onClick: props.onSyncNow }, L("set_sync_now")),
          React.createElement("button", { className: "data-btn", type: "button", onClick: function () { props.onDisconnect(forget); } }, L("set_sync_disconnect")))));
  }
  var submit = function (e) {
    e.preventDefault();
    setBusy(true);
    setFormErr(null);
    props.onConnect(form).then(function (r) {
      setBusy(false);
      setFormErr(r.error ? r : null);
    });
  };
  var input = function (key, label, type, autoComplete) {
    var urlErr = formErr && /url|https|missing|network/.test(formErr.error);
    return React.createElement("div", { className: "setting-row" },
      React.createElement("label", { htmlFor: "sync-" + key }, L(label)),
      React.createElement("input", {
        id: "sync-" + key, className: "sync-input", type: type, autoComplete: autoComplete,
        value: form[key], spellCheck: false, autoCapitalize: "none",
        placeholder: type === 'url' ? 'https://example.com/jelly' : undefined,
        'aria-invalid': formErr && (key === 'url') === !!urlErr ? true : undefined,
        'aria-describedby': formErr ? "sync-form-err" : undefined,
        onChange: function (e) { var v = e.target.value; setForm(function (f) { var n = Object.assign({}, f); n[key] = v; return n; }); }
      }));
  };
  return React.createElement("form", { className: "sync-form", onSubmit: submit, noValidate: true }, status, hint,
    input("url", "set_sync_url", "url", "url"),
    input("username", "set_sync_user", "text", "username"),
    input("password", "set_sync_pass", "password", "current-password"),
    React.createElement("div", { className: "setting-row" },
      check(form.remember, function (e) { var v = e.target.checked; setForm(function (f) { return Object.assign({}, f, { remember: v }); }); },
        L("set_sync_remember"), "sync-remember-hint"),
      React.createElement("button", { className: "data-btn", type: "submit", disabled: busy }, busy ? L("sync_connecting") : L("set_sync_connect"))),
    React.createElement("p", { id: "sync-remember-hint", className: "setting-hint" }, L("set_sync_remember_hint")),
    formErr ? React.createElement("p", { id: "sync-form-err", className: "sync-form-err", role: "alert" }, errText(formErr.error, formErr.detail)) : null);
}
