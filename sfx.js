"use strict";

// UI sound effects: Kenney CC0 jingles in sfx/ (correct, wrong, complete,
// achievement; next = the mock's question tick, from Interface Sounds), .ogg with an .mp3 copy for browsers without Ogg Vorbis.
// Mute is a device-only pref (jlpt_sfx_mute), like TTS rate.
var SFX_EXT = (function () {
  try {
    return new Audio().canPlayType('audio/ogg; codecs="vorbis"') ? 'ogg' : 'mp3';
  } catch (e) {
    return 'mp3';
  }
})();
var _sfxCache = {};

function sfxMuted() {
  try {
    return localStorage.getItem('jlpt_sfx_mute') === 'true';
  } catch (e) {
    return false;
  }
}

function playSfx(name) {
  if (typeof Audio === 'undefined' || sfxMuted()) return;
  try {
    var a = _sfxCache[name] || (_sfxCache[name] = new Audio('sfx/' + name + '.' + SFX_EXT));
    a.currentTime = 0;
    var p = a.play();
    // Autoplay blocks (no user gesture yet) are expected and harmless.
    if (p && p.catch) p.catch(function () {});
  } catch (e) {}
}
