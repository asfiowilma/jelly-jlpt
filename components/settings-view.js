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
        }, props.sfxOn ? L("set_on") : L("set_off")))
    ),
    section("set-data", L("set_data"),
      React.createElement("div", { className: "setting-row" },
        React.createElement("span", { className: "setting-hint" }, L("set_data_hint")),
        React.createElement("div", { className: "setting-btns" },
          React.createElement("button", { className: "data-btn", onClick: props.onExport, 'aria-label': "Export progress to file" }, L("set_export")),
          React.createElement("button", { className: "data-btn", onClick: props.onImport, 'aria-label': "Import progress from file" }, L("set_import"))))),
    section("set-sync", L("set_sync"),
      React.createElement("p", { className: "setting-hint" }, L("set_sync_soon"))));
}
