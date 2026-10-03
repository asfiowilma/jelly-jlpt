"use strict";

// Settings view, opened from the navbar gear. Holds everything that used to
// crowd the header: appearance, audio, data export/import (and later sync).
function SettingsView(props) {
  var themePrefs = props.themePrefs,
    setThemePrefs = props.setThemePrefs;
  var L = function (key) { return t(key, props.level); };
  var section = function (id, title) {
    var children = Array.prototype.slice.call(arguments, 2);
    return React.createElement.apply(React, ["section", { className: "settings-section", 'aria-labelledby': id },
      React.createElement("h3", { id: id }, title)].concat(children));
  };
  return React.createElement("div", { className: "settings" },
    React.createElement("div", { className: "settings-head" },
      React.createElement("button", { className: "back-btn", onClick: props.onBack }, L("settings_back")),
      React.createElement("h2", null, L("settings_title"))),
    section("set-appearance", L("set_appearance"),
      React.createElement("div", { className: "setting-row" },
        React.createElement("label", { htmlFor: "set-palette" }, L("set_palette")),
        React.createElement("select", {
          id: "set-palette",
          className: "theme-select",
          value: themePrefs.palette,
          onChange: function (e) { setThemePrefs({ palette: e.target.value, theme: themePrefs.theme }); }
        }, THEME_PALETTES.map(function (p) {
          return React.createElement("option", { key: p.id, value: p.id }, p.k + ' ' + p.name);
        }))),
      React.createElement("div", { className: "setting-row" },
        React.createElement("span", { id: "set-dark-label" }, L("set_dark")),
        React.createElement("button", {
          className: "theme-toggle",
          role: "switch",
          'aria-checked': themePrefs.theme === 'dark',
          'aria-labelledby': "set-dark-label",
          onClick: function () { setThemePrefs({ palette: themePrefs.palette, theme: themePrefs.theme === 'dark' ? 'light' : 'dark' }); }
        }, themePrefs.theme === 'dark' ? L("set_on") : L("set_off")))),
    section("set-pace", L("set_pace_section"),
      React.createElement("div", { className: "setting-row" },
        React.createElement("label", { htmlFor: "set-pace-mode" }, L("set_pace")),
        React.createElement("select", {
          id: "set-pace-mode",
          className: "theme-select",
          value: String(props.pace),
          onChange: function (e) { props.setPace(parseFloat(e.target.value)); }
        }, PACE_MODES.map(function (m) {
          return React.createElement("option", { key: m.pace, value: String(m.pace) }, L(m.key));
        }))),
      props.pace >= 3 && React.createElement("p", { className: "setting-hint", role: "note" }, L("pace_super_note")),
      React.createElement("div", { className: "setting-row" },
        React.createElement("label", { htmlFor: "set-exam-date" }, L("set_exam_date")),
        React.createElement("input", {
          id: "set-exam-date",
          type: "date",
          className: "theme-select",
          value: props.examDate || "",
          onChange: function (e) { props.setExamDate(e.target.value || null); }
        })),
      React.createElement("p", { className: "setting-hint" }, L("set_exam_hint"))),
    section("set-language", L("set_language"),
      React.createElement("div", { className: "setting-row" },
        React.createElement("label", { htmlFor: "set-ui-lang" }, L("set_ui_lang")),
        React.createElement("select", {
          id: "set-ui-lang",
          className: "theme-select",
          value: props.uiLang,
          onChange: function (e) { props.setUiLang(e.target.value); }
        },
          React.createElement("option", { value: "auto" }, L("set_lang_auto")),
          React.createElement("option", { value: "en" }, "English"),
          React.createElement("option", { value: "ja" }, "日本語"))),
      React.createElement("div", { className: "setting-row" },
        React.createElement("label", { htmlFor: "set-furigana" }, L("set_furigana")),
        React.createElement("select", {
          id: "set-furigana",
          className: "theme-select",
          value: props.furiganaMode,
          onChange: function (e) { props.setFuriganaMode(e.target.value); }
        },
          React.createElement("option", { value: "auto" }, L("set_furi_auto")),
          React.createElement("option", { value: "true" }, L("set_furi_always")),
          React.createElement("option", { value: "false" }, L("set_furi_never"))))),
    section("set-audio", L("set_audio"),
      React.createElement("div", { className: "setting-row" },
        React.createElement("label", { htmlFor: "set-tts-rate" }, L("set_speech_speed")),
        React.createElement("select", {
          id: "set-tts-rate",
          className: "tts-rate-select",
          value: String(props.speechRate),
          onChange: function (e) { props.setSpeechRate(parseFloat(e.target.value)); }
        }, ["0.5", "0.75", "0.85", "1", "1.25"].map(function (v) {
          return React.createElement("option", { key: v, value: v }, (v === "1" ? "1.0" : v) + "×");
        }))),
      React.createElement("div", { className: "setting-row" },
        React.createElement("span", { id: "set-sfx-label" }, L("set_sfx")),
        React.createElement("button", {
          className: "theme-toggle",
          role: "switch",
          'aria-checked': props.sfxOn,
          'aria-labelledby': "set-sfx-label",
          onClick: function () { props.setSfxOn(!props.sfxOn); if (!props.sfxOn) playSfx('correct'); }
        }, props.sfxOn ? L("set_on") : L("set_off"))),
      // Listening in the app is the browser's own voice (ticket 16); the official samples are real audio
      React.createElement("div", { className: "setting-row" },
        React.createElement("span", { className: "setting-hint" }, L("set_official_audio_hint")),
        React.createElement("a", { className: "data-btn", href: "https://www.jlpt.jp/e/samples/sampleindex.html", target: "_blank", rel: "noopener noreferrer" }, L("set_official_audio")))
    ),
    section("set-data", L("set_data"),
      React.createElement("div", { className: "setting-row" },
        React.createElement("span", { className: "setting-hint" }, L("set_data_hint")),
        React.createElement("div", { className: "setting-btns" },
          React.createElement("button", { className: "data-btn", onClick: props.onExport, 'aria-label': "Export progress to file" }, L("set_export")),
          React.createElement("button", { className: "data-btn", onClick: props.onImport, 'aria-label': "Import progress from file" }, L("set_import"))))),
    section("set-known", L("set_known"),
      React.createElement(ImportSettings, { L: L, level: props.level, cards: props.cards, units: props.units })),
    section("set-sync", L("set_sync"),
      React.createElement(SyncSettings, { L: L, sync: props.sync, savedCreds: props.savedCreds,
        onConnect: props.onConnect, onDisconnect: props.onDisconnect, onSyncNow: props.onSyncNow })),
    section("set-credits", L("set_credits"),
      React.createElement("ul", { className: "credits" }, CREDITS.map(function (c) {
        return React.createElement("li", { key: c.name },
          React.createElement("a", { href: c.url, target: "_blank", rel: "noopener noreferrer" }, c.name),
          ': ' + L(c.key) + ' (',
          React.createElement("a", { href: c.licenseUrl, target: "_blank", rel: "noopener noreferrer" }, c.license), ')');
      }))));
}

// Third-party content shipped with the app (map Q4: credits live in Settings).
var CREDITS = [
  { name: 'KanjiVG', url: 'https://kanjivg.tagaini.net/', key: 'cred_kanjivg', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/' },
  { name: 'Tanos', url: 'https://www.tanos.co.uk/jlpt/', key: 'cred_tanos', license: 'CC BY', licenseUrl: 'https://www.tanos.co.uk/jlpt/' }, // ponytail: site states CC BY without a version
  { name: 'Tatoeba', url: 'https://tatoeba.org/', key: 'cred_tatoeba', license: 'CC BY 2.0 FR', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/fr/' },
  { name: 'elzup/jlpt-word-list', url: 'https://github.com/elzup/jlpt-word-list', key: 'cred_wordlist', license: 'MIT', licenseUrl: 'https://github.com/elzup/jlpt-word-list/blob/master/LICENSE' }
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
  var status = React.createElement("p", { className: "sync-status", role: "status" },
    React.createElement("span", { className: "sync-dot sync-" + sync.status, 'aria-hidden': "true" }),
    L("sync_" + sync.status),
    sync.connected && sync.error ? ". " + errText(sync.error, sync.detail) : null,
    sync.summary ? " · " + L("sync_merged").replace('{units}', sync.summary.units).replace('{cards}', sync.summary.cards) : null);
  var check = function (checked, onChange, label, describedBy) {
    return React.createElement("label", { className: "sync-check" },
      React.createElement("input", { type: "checkbox", checked: checked, onChange: onChange, 'aria-describedby': describedBy }), label);
  };
  if (sync.connected) {
    return React.createElement(React.Fragment, null, hint, status,
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
  return React.createElement("form", { className: "sync-form", onSubmit: submit, noValidate: true }, hint,
    input("url", "set_sync_url", "url", "url"),
    input("username", "set_sync_user", "text", "username"),
    input("password", "set_sync_pass", "password", "current-password"),
    React.createElement("div", { className: "setting-row" },
      check(form.remember, function (e) { var v = e.target.checked; setForm(function (f) { return Object.assign({}, f, { remember: v }); }); },
        L("set_sync_remember"), "sync-remember-hint"),
      React.createElement("button", { className: "data-btn", type: "submit", disabled: busy }, busy ? L("sync_connecting") : L("set_sync_connect"))),
    React.createElement("p", { id: "sync-remember-hint", className: "setting-hint" }, L("set_sync_remember_hint")),
    formErr ? React.createElement("p", { id: "sync-form-err", className: "sync-form-err", role: "alert" }, errText(formErr.error, formErr.detail)) : status);
}
