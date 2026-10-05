#!/usr/bin/env node
// Export every N5 listening item as a flat track list for the TTS notebook.
// Run: node tools/export-tracks.js  ->  tools/audio/tracks.json
//
// clipKey rule (the notebook hashes it so identical lines across tracks render once):
//   clipKey = role + '|' + (role === 'N' ? '' : archetype) + '|' + text
// where role is N / M / F, archetype is the track's man / woman key (tracks.json `man` / `woman`;
// the narrator is one fixed voice, no archetype),
// and text is the natural text (kanji kept, U+3000 spaces removed).
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const ctx = { localStorage: { getItem() { return null; }, setItem() {} }, document: {} };
ctx.window = ctx;
vm.createContext(ctx);
['data/catalog.js', 'data/n5/listening.js', 'lib.js'].forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
});
const read = f => JSON.parse(fs.readFileSync(path.join(__dirname, 'audio', f), 'utf8'));
const A = { M: { arch: read('man-archetypes.json'), assign: read('man-assignments.json') },
  F: { arch: read('woman-archetypes.json'), assign: read('woman-assignments.json') } };
const natural = s => ctx.furiganaParts(s).map(p => p.t).join('').replace(/　/g, '');

// natural-text twin of lib.js listeningScript (same order, same speakers)
function naturalScript(it) {
  const say = (sp, s) => ({ speaker: sp, text: natural(s) });
  const lines = it.lines.map(l => say(l.speaker, l.furigana));
  const q = it.question && say('N', it.question);
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
  const pick = {};
  ['M', 'F'].forEach(function (r) {
    if (!nat.some(l => l.speaker === r)) return;
    const e = A[r].assign[it.id], k = e && e[r === 'M' ? 'man' : 'woman'];
    if (!k) errors.push(it.id + ': ' + r + ' track has no assignment');
    else if (!A[r].arch[k]) errors.push(it.id + ': unknown ' + r + ' archetype ' + k);
    else pick[r] = k;
  });
  const man = pick.M || null, woman = pick.F || null;
  tracks.push({ id: it.id, format: it.format, man, woman,
    lines: nat.map((l, i) => ({ role: l.speaker, text: l.text, kana: kana[i].text })) });
  nat.forEach(function (l) {
    total++; allChars += l.text.length;
    const key = l.speaker + '|' + (l.speaker === 'M' ? man : l.speaker === 'F' ? woman : '') + '|' + l.text;
    if (!clips.has(key)) { clips.add(key); chars += l.text.length; }
  });
});
['M', 'F'].forEach(r => Object.keys(A[r].assign).forEach(id => { if (!tracks.some(t => t.id === id)) errors.push(id + ': ' + r + ' assignment for unknown track'); }));
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

fs.writeFileSync(path.join(__dirname, 'audio', 'tracks.json'),
  JSON.stringify({ generatedFrom: 'catalog', tracks }, null, 1) + '\n');
const dist = {}, wdist = {};
tracks.forEach(t => { if (t.man) dist[t.man] = (dist[t.man] || 0) + 1; if (t.woman) wdist[t.woman] = (wdist[t.woman] || 0) + 1; });
console.log('tracks ' + tracks.length + ', lines ' + total + ', unique clips ' + clips.size + ', total chars ' + allChars + ', unique chars ' + chars);
console.log('man archetypes ' + JSON.stringify(dist) + ', woman archetypes ' + JSON.stringify(wdist));
