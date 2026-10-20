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
// Default loudness for every sound effect (the jingles are full-scale and were too loud for a quiz).
var SFX_VOLUME = 0.25;

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
    a.volume = SFX_VOLUME;
    a.currentTime = 0;
    var p = a.play();
    // Autoplay blocks (no user gesture yet) are expected and harmless.
    if (p && p.catch) p.catch(function () {});
  } catch (e) {}
}

// Synthesized sounds, no files: 'whoosh' (soft air, mastery challenge opens) and 'stamp'
// (wood thump, a result stamp lands). Picked in the audition page; same mute and volume as playSfx.
var SYNTH_SFX = {
  whoosh: { dur: 0.7, f0: 500, f1: 1800, q: 0.8, peak: 0.5 },
  stamp: { dur: 0.22, f0: 180, f1: 55, click: 0.5, peak: 0.7 }
};
var _synthCtx = null;
function synthNoise(c, secs) {
  var len = Math.floor(c.sampleRate * secs), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}
function playSynthSfx(name) {
  if (typeof window === 'undefined' || sfxMuted()) return;
  try {
    var C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    if (!_synthCtx) _synthCtx = new C();
    var c = _synthCtx;
    if (c.state === 'suspended') c.resume();
    var s = SYNTH_SFX[name], t0 = c.currentTime, master = c.createGain();
    master.gain.value = SFX_VOLUME;
    master.connect(c.destination);
    if (name === 'whoosh') {
      var src = c.createBufferSource(); src.buffer = synthNoise(c, s.dur + 0.1);
      var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = s.q;
      bp.frequency.setValueAtTime(s.f0, t0);
      bp.frequency.exponentialRampToValueAtTime(s.f1, t0 + s.dur);
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(s.peak, t0 + s.dur * 0.35);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + s.dur);
      src.connect(bp); bp.connect(g); g.connect(master);
      src.start(t0); src.stop(t0 + s.dur + 0.05);
    } else {
      var o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(s.f0, t0);
      o.frequency.exponentialRampToValueAtTime(s.f1, t0 + s.dur);
      var og = c.createGain();
      og.gain.setValueAtTime(s.peak, t0);
      og.gain.exponentialRampToValueAtTime(0.0001, t0 + s.dur);
      o.connect(og); og.connect(master);
      o.start(t0); o.stop(t0 + s.dur + 0.05);
      var nsrc = c.createBufferSource(); nsrc.buffer = synthNoise(c, 0.03);
      var hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1800;
      var ng = c.createGain();
      ng.gain.setValueAtTime(s.click, t0);
      ng.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.03);
      nsrc.connect(hp); hp.connect(ng); ng.connect(master);
      nsrc.start(t0); nsrc.stop(t0 + 0.04);
    }
  } catch (e) {}
}
