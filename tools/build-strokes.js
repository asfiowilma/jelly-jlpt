#!/usr/bin/env node
// Bundles kanji-svg/<hex>.svg into kanji-svg/strokes.js (global KANJI_SVG: hex -> <svg> markup),
// so stroke order works on file:// where fetch() is blocked. Zero deps. Rerun after adding SVGs.
// The prolog (<?xml?>, DOCTYPE, per-file comment) is dropped; the licence header below carries it.
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'kanji-svg');
const map = {};
fs.readdirSync(dir).filter(f => /^[0-9a-f]{5}\.svg$/.test(f)).sort().forEach(f => {
  const raw = fs.readFileSync(path.join(dir, f), 'utf8');
  map[f.slice(0, 5)] = raw.slice(raw.indexOf('<svg')).trim();
});
const header = `// KanjiVG stroke-order data, bundled from kanji-svg/*.svg by tools/build-strokes.js. Do not edit by hand.
// Copyright (C) 2009/2010/2011 Ulrich Apel. Licensed under Creative Commons Attribution-Share Alike 3.0
// (https://creativecommons.org/licenses/by-sa/3.0/). Source: http://kanjivg.tagaini.net
// This file is a derivative of KanjiVG and stays under the same licence; keep it separate from app code.
`;
fs.writeFileSync(path.join(dir, 'strokes.js'), header + 'var KANJI_SVG = ' + JSON.stringify(map) + ';\n');
console.log('bundled ' + Object.keys(map).length + ' SVGs');
