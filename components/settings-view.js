"use strict";

// Settings view, opened from the navbar gear. Holds everything that used to
// crowd the header: appearance, audio, data export/import (and later sync).
function SettingsView(props) {
  var themePrefs = props.themePrefs,
    setThemePrefs = props.setThemePrefs;
  var section = function (id, title) {
    var children = Array.prototype.slice.call(arguments, 2);
    return React.createElement.apply(React, ["section", { className: "settings-section", 'aria-labelledby': id },
      React.createElement("h3", { id: id }, title)].concat(children));
  };
  return React.createElement("div", { className: "settings" },
    React.createElement("div", { className: "settings-head" },
      React.createElement("button", { className: "back-btn", onClick: props.onBack }, "← Back"),
      React.createElement("h2", null, "Settings")),
    section("set-appearance", "Appearance",
      React.createElement("div", { className: "setting-row" },
        React.createElement("label", { htmlFor: "set-palette" }, "Color palette"),
        React.createElement("select", {
          id: "set-palette",
          className: "theme-select",
          value: themePrefs.palette,
          onChange: function (e) { setThemePrefs({ palette: e.target.value, theme: themePrefs.theme }); }
        }, THEME_PALETTES.map(function (p) {
          return React.createElement("option", { key: p.id, value: p.id }, p.k + ' ' + p.name);
        }))),
      React.createElement("div", { className: "setting-row" },
        React.createElement("span", { id: "set-dark-label" }, "☾ Dark mode"),
        React.createElement("button", {
          className: "theme-toggle",
          role: "switch",
          'aria-checked': themePrefs.theme === 'dark',
          'aria-labelledby': "set-dark-label",
          onClick: function () { setThemePrefs({ palette: themePrefs.palette, theme: themePrefs.theme === 'dark' ? 'light' : 'dark' }); }
        }, themePrefs.theme === 'dark' ? "On" : "Off"))),
    section("set-language", "Language",
      React.createElement("div", { className: "setting-row" },
        React.createElement("label", { htmlFor: "set-ui-lang" }, "Interface language"),
        React.createElement("select", {
          id: "set-ui-lang",
          className: "theme-select",
          value: props.uiLang,
          onChange: function (e) { props.setUiLang(e.target.value); }
        },
          React.createElement("option", { value: "auto" }, "Auto — switch to Japanese as you learn"),
          React.createElement("option", { value: "en" }, "English"),
          React.createElement("option", { value: "ja" }, "日本語"))),
      React.createElement("div", { className: "setting-row" },
        React.createElement("label", { htmlFor: "set-furigana" }, "Furigana"),
        React.createElement("select", {
          id: "set-furigana",
          className: "theme-select",
          value: props.furiganaMode,
          onChange: function (e) { props.setFuriganaMode(e.target.value); }
        },
          React.createElement("option", { value: "auto" }, "Auto — on until N1"),
          React.createElement("option", { value: "true" }, "Always show"),
          React.createElement("option", { value: "false" }, "Never show")))),
    section("set-audio", "Audio",
      React.createElement("div", { className: "setting-row" },
        React.createElement("label", { htmlFor: "set-tts-rate" }, "Speech speed"),
        React.createElement("select", {
          id: "set-tts-rate",
          className: "tts-rate-select",
          value: String(props.speechRate),
          onChange: function (e) { props.setSpeechRate(parseFloat(e.target.value)); }
        }, ["0.5", "0.75", "0.85", "1", "1.25"].map(function (v) {
          return React.createElement("option", { key: v, value: v }, (v === "1" ? "1.0" : v) + "×");
        })))
      // Slot: sound mute toggle (UI sound effects) goes here as another .setting-row.
    ),
    section("set-data", "Data",
      React.createElement("div", { className: "setting-row" },
        React.createElement("span", { className: "setting-hint" }, "Save your progress to a file, or restore it from one."),
        React.createElement("div", { className: "setting-btns" },
          React.createElement("button", { className: "data-btn", onClick: props.onExport, 'aria-label': "Export progress to file" }, "Export"),
          React.createElement("button", { className: "data-btn", onClick: props.onImport, 'aria-label': "Import progress from file" }, "Import")))),
    section("set-sync", "Sync",
      React.createElement("p", { className: "setting-hint" }, "Multi-device sync — coming soon")));
}
