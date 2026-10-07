#!/usr/bin/env node
// Export every N5 listening item as a flat track list for the TTS notebook.
// Run: node tools/export-tracks.js  ->  tools/audio/tracks.json + tools/audio/render-input.json
//
// clipKey rule (the notebook hashes it so identical lines across tracks render once):
//   clipKey = role + '|' + (role === 'N' ? '' : archetype) + '|' + say
// where role is N / M / F, archetype is the track's man / woman key (tracks.json `man` / `woman`;
// the narrator is one fixed voice, no archetype). A dialogue line (format dialogue) is voiced by its character:
// role = the character's gender (M / F), archetype = the character id (tools/audio/cast.json, per-line `arch`
// in tracks.json), and say is the line's listeningScript text with U+3000 spaces removed: the TTS input.
// Non-dialogue lines: the kana reading, so the authored readings decide how each kanji is spoken.
// Dialogue lines: the speech text (dialogueSpeech in lib.js: the display text, kanji kept, numerals from their
// ruby, or the line's `say`), so `kana` holds that same text there. `text` (natural, kanji kept) is kept
// for reading the transcript only.
// render-input.json (gitignored) is the one file the Colab notebook uploads:
//   { tracks, manArchetypes, womanArchetypes, characters (cast.json), have: [clip names already in audio/] }
const fs = require('fs'), path = require('path'), vm = require('vm');
const { archOf, clipKey, clipName, sayText } = require('./build-audio-manifest.js');
const root = path.join(__dirname, '..');
const ctx = { localStorage: { getItem() { return null; }, setItem() {} }, document: {} };
ctx.window = ctx;
vm.createContext(ctx);
['data/catalog.js', 'data/n5/listening.js', 'lib.js'].forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
});
const read = f => JSON.parse(fs.readFileSync(path.join(__dirname, 'audio', f), 'utf8'));
const CAST = read('cast.json');
const A = { M: { arch: read('man-archetypes.json'), assign: read('man-assignments.json') },
  F: { arch: read('woman-archetypes.json'), assign: read('woman-assignments.json') } };
const natural = s => ctx.furiganaParts(s).map(p => p.t).join('').replace(/　/g, '');

// natural-text twin of lib.js listeningScript (same order, same speakers)
function naturalScript(it) {
  const say = (sp, s) => ({ speaker: sp, text: natural(s) });
  const lines = it.lines.map(l => say(it.format === 'dialogue' ? it.cast[l.speaker].gender : l.speaker, l.furigana));
  const q = it.question && say('N', it.question);
  if (it.format === 'dialogue') return lines;
  if (!ctx.LISTEN_SPOKEN_OPTIONS[it.format]) return [lines[0], q].concat(lines.slice(1), [q]);
  const opts = [].concat.apply([], it.options.map((o, i) =>
    [{ speaker: 'N', text: ctx.LISTEN_NUMBERS[i] }, say(it.optionSpeaker, o)]));
  return lines.concat(q ? [q] : [], opts);
}

const tracks = [], clips = new Set(), errors = [];
let total = 0, chars = 0, allChars = 0;
ctx.listeningFor('N5').forEach(function (it) {
  const kana = ctx.listeningScript(it), nat = naturalScript(it);
  if (kana.length !== nat.length || kana.some((l, i) => l.speaker !== nat[i].speaker))
    throw new Error(it.id + ': natural sequence does not match listeningScript');
  const pick = {}, dlg = it.format === 'dialogue';
  if (dlg) kana.forEach(function (l) { // per-character voices: no man / woman assignment
    const c = CAST[l.who];
    if (!c) errors.push(it.id + ': character ' + l.who + ' is not in cast.json');
    else if (c.gender !== l.speaker) errors.push(it.id + ': ' + l.who + ' is ' + c.gender + ' in cast.json, ' + l.speaker + ' in the item');
  });
  else [['M', 'M', 'man'], ['F', 'F', 'woman']].forEach(function (x) {
    const r = x[0], a = A[x[1]];
    if (!nat.some(l => l.speaker === r)) return;
    const e = a.assign[it.id], k = e && e[x[2]];
    if (!k) errors.push(it.id + ': ' + r + ' track has no assignment');
    else if (!a.arch[k]) errors.push(it.id + ': unknown ' + r + ' archetype ' + k);
    else pick[r] = k;
  });
  const man = pick.M || null, woman = pick.F || null;
  tracks.push({ id: it.id, format: it.format, man, woman,
    lines: nat.map((l, i) => ({ role: l.speaker, ...(kana[i].who ? { arch: kana[i].who } : {}),
      text: l.text, kana: kana[i].text, say: sayText(kana[i].text) })) });
  tracks[tracks.length - 1].lines.forEach(function (l) {
    total++; allChars += l.say.length;
    const key = clipKey(l.role, archOf(tracks[tracks.length - 1], l), l.say);
    if (!clips.has(key)) { clips.add(key); chars += l.say.length; }
  });
});
['M', 'F'].forEach(r => Object.keys(A[r].assign).forEach(id => { if (!tracks.some(t => t.id === id)) errors.push(id + ': ' + r + ' assignment for unknown track'); }));
Object.keys(CAST).forEach(id => { const c = CAST[id]; if (!c.name || !c.jp || !/^[MF]$/.test(c.gender) || !c.role || !c.personality || !c.voice) errors.push('cast.json ' + id + ': needs name, jp, gender M/F, role, personality, voice'); });
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

fs.writeFileSync(path.join(__dirname, 'audio', 'tracks.json'),
  JSON.stringify({ generatedFrom: 'catalog', tracks }, null, 1) + '\n');
const have = fs.readdirSync(path.join(root, 'audio')).filter(f => /^[0-9a-f]{12}\.mp3$/.test(f)).sort();
fs.writeFileSync(path.join(__dirname, 'audio', 'render-input.json'),
  JSON.stringify({ tracks, manArchetypes: A.M.arch, womanArchetypes: A.F.arch, characters: CAST, have }) + '\n');
const names = new Set([...clips].map(clipName)), reused = [...names].filter(n => have.includes(n)).length;
const dist = {}, wdist = {};
tracks.forEach(t => { if (t.man) dist[t.man] = (dist[t.man] || 0) + 1; if (t.woman) wdist[t.woman] = (wdist[t.woman] || 0) + 1; });
console.log('tracks ' + tracks.length + ', lines ' + total + ', unique clips ' + clips.size + ', total chars ' + allChars + ', unique chars ' + chars);
console.log('to render ' + (names.size - reused) + ', reused from audio/ ' + reused + ' (tools/audio/render-input.json)');
console.log('man archetypes ' + JSON.stringify(dist) + ', woman archetypes ' + JSON.stringify(wdist));
