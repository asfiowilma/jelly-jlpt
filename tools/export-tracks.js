#!/usr/bin/env node
// Export every N5 listening item as a flat track list for the TTS notebook.
// Run: node tools/export-tracks.js  ->  tools/audio/tracks.json
//
// clipKey rule (the notebook hashes it so identical lines across tracks render once):
//   clipKey = role + '|' + (role === 'M' ? archetype : '') + '|' + text
// where role is N / M / F, archetype is the track's man key (tracks.json `man`),
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
const archetypes = read('man-archetypes.json'), assign = read('man-assignments.json');
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
  const hasM = nat.some(l => l.speaker === 'M');
  let man = null;
  if (hasM) {
    man = assign[it.id] && assign[it.id].man;
    if (!man) errors.push(it.id + ': M track has no assignment');
    else if (!archetypes[man]) errors.push(it.id + ': unknown archetype ' + man);
  }
  tracks.push({ id: it.id, format: it.format, man: man || null,
    lines: nat.map((l, i) => ({ role: l.speaker, text: l.text, kana: kana[i].text })) });
  nat.forEach(function (l) {
    total++; allChars += l.text.length;
    const key = l.speaker + '|' + (l.speaker === 'M' ? man : '') + '|' + l.text;
    if (!clips.has(key)) { clips.add(key); chars += l.text.length; }
  });
});
Object.keys(assign).forEach(id => { if (!tracks.some(t => t.id === id)) errors.push(id + ': assignment for unknown track'); });
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

fs.writeFileSync(path.join(__dirname, 'audio', 'tracks.json'),
  JSON.stringify({ generatedFrom: 'catalog', tracks }, null, 1) + '\n');
const dist = {};
tracks.forEach(t => { if (t.man) dist[t.man] = (dist[t.man] || 0) + 1; });
console.log('tracks ' + tracks.length + ', lines ' + total + ', unique clips ' + clips.size + ', total chars ' + allChars + ', unique chars ' + chars);
console.log('man archetypes ' + JSON.stringify(dist));
