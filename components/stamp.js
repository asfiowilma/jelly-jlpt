"use strict";

// Achievement stamp (ticket 09; look locked in ticket 07, "Postage" style; colors, rarity layers and
// per-rarity print treatments settled from the stamp sheet sketch).
// Pure: stampSVG() builds the SVG string, Stamp() wraps it. Glyph = identicon path data
// from data/stamp-icons.js (STAMP_ICONS, id -> path), everything else is drawn here.
//
// Color never follows the theme or the palette, and never follows rarity. Each category has a base hue;
// every stamp gets its own hue (within STAMP_SPREAD degrees of the base), lightness and chroma from a
// hash of its id, so a stamp always looks the same everywhere. Levels walk the hue N5 -> N1.
// Rarity is shown with layers (gradient steps, frame ladder, engraved lines, foil, gold edge) and a
// per-tier print treatment (STAMP_STYLE: icon style, soft gradient, motif pattern, band, postmark, grain).
var STAMP_CATS = {
  progress: { jp: '進', hue: 245 },
  habit:    { jp: '習', hue: 55 },
  quiz:     { jp: '問', hue: 4.6 },
  mock:     { jp: '試', hue: 290 },
  review:   { jp: '復', hue: 155 },
  mastery:  { jp: '極', hue: 5 }
};
var STAMP_TIERS = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
var STAMP_PRICE = ['10円', '50円', '100円', '500円', '1000円'];
var STAMP_LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];
var STAMP_LEVEL_STEP = 62;   // hue degrees per level
var STAMP_SPREAD = 35;       // +- degrees of hue around the category base
var STAMP_PAPER = 'oklch(0.97 0.015 85)';
// Print treatment per tier: glyph = icon style, soft = soft vertical gradient instead of the tier gradient,
// pattern = category motif, band = darker price band, postmark = cancellation mark, grain = ink speckle.
var STAMP_STYLE = [
  { glyph: 'duotone', soft: 1, pattern: 1, band: 1, postmark: 1, grain: 0 },
  { glyph: 'medallion', soft: 1, pattern: 1, band: 0, postmark: 1, grain: 0 },
  { glyph: 'engraved', soft: 0, pattern: 1, band: 0, postmark: 0, grain: 1 },
  { glyph: 'emboss', soft: 0, pattern: 0, band: 0, postmark: 0, grain: 0 },
  { glyph: 'overprint', soft: 0, pattern: 0, band: 0, postmark: 0, grain: 0 }
];

function stampHash(str, salt) {
  var h = 2166136261 ^ salt;
  for (var i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967296;
}
function stampOk(l, c, h) {
  return 'oklch(' + l.toFixed(3) + ' ' + c.toFixed(3) + ' ' + (((h % 360) + 360) % 360).toFixed(1) + ')';
}

// { l, c, h } of a stamp's ink: only the id, category and level matter (not rarity, theme or palette).
function stampInkParts(id, category, level) {
  var cat = STAMP_CATS[category] || STAMP_CATS.progress;
  var lv = Math.max(0, STAMP_LEVELS.indexOf(String(level || '').toLowerCase()));
  return {
    l: +(0.56 + stampHash(id, 2) * 0.17).toFixed(3),
    c: +(0.09 + stampHash(id, 3) * 0.10).toFixed(3),
    h: +(((cat.hue + (stampHash(id, 1) - 0.5) * 2 * STAMP_SPREAD + lv * STAMP_LEVEL_STEP) % 360 + 360) % 360).toFixed(1)
  };
}
// [ink, lighter neighbouring hue, darker opposite neighbouring hue]: the stops of the gradients.
function stampInks(id, category, level) {
  var p = stampInkParts(id, category, level);
  return [stampOk(p.l, p.c, p.h), stampOk(Math.min(0.9, p.l + 0.05), p.c * 1.05, p.h + 24), stampOk(p.l - 0.06, p.c * 0.95, p.h - 22)];
}
function stampInk(id, category, level) { return stampInks(id, category, level)[0]; }

function stampEsc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Category motif, tone on tone in paper color. -> { def, body }
function stampMotif(cat, u, op) {
  var P = STAMP_PAPER, a = 'fill="none" stroke="' + P + '" stroke-width="0.55"';
  var pat = function (w, h, inner, rot) {
    return '<pattern id="pt-' + u + '" width="' + w + '" height="' + h + '" patternUnits="userSpaceOnUse"' + (rot ? ' patternTransform="rotate(' + rot + ')"' : '') + '>' + inner + '</pattern>';
  };
  var def;
  if (cat === 'progress') def = pat(5, 5, '<path d="M0 0V5" ' + a + '/>', 35);
  else if (cat === 'habit') def = pat(5, 5, '<circle cx="2.5" cy="2.5" r="0.9" fill="' + P + '"/>');
  else if (cat === 'quiz') def = pat(8, 8, '<rect width="4" height="4" fill="' + P + '"/><rect x="4" y="4" width="4" height="4" fill="' + P + '"/>');
  else if (cat === 'mock') def = pat(10, 5, '<path d="M0 5a5 5 0 0 1 10 0M-5 2.5a5 5 0 0 1 10 0M5 2.5a5 5 0 0 1 10 0" ' + a + '/>');
  else if (cat === 'review') def = pat(11, 11, '<circle cx="5.5" cy="5.5" r="4" ' + a + '/><circle cx="5.5" cy="5.5" r="1.6" ' + a + '/>');
  else { // mastery: sunburst
    var rays = '';
    for (var i = 0; i < 24; i++) { var an = i * Math.PI / 12; rays += 'M50 52L' + (50 + 70 * Math.cos(an)).toFixed(1) + ' ' + (52 + 70 * Math.sin(an)).toFixed(1); }
    return { def: '', body: '<g clip-path="url(#blk-' + u + ')"><path d="' + rays + '" ' + a + ' opacity="' + op + '"/></g>' };
  }
  return { def: def, body: '<rect x="15" y="15" width="70" height="70" fill="url(#pt-' + u + ')" opacity="' + op + '"/>' };
}

// The icon in one of the print styles. -> { def, body }
function stampGlyph(d, mode, earned, fg, u) {
  var tr = 'translate(32 27) scale(7.2)', P = STAMP_PAPER;
  var g = function (attrs, extraTr) { return '<g transform="' + tr + (extraTr || '') + '" ' + attrs + '><path d="' + d + '"/></g>'; };
  if (!earned) return { def: '', body: g('fill="currentColor" opacity="0.18"') };
  var out = function (body, def) { return { def: def || '', body: body }; };
  if (mode === 'duotone') return out(g('fill="color-mix(in oklch,' + P + ' 55%,var(--ink2))"'));
  if (mode === 'emboss') return out(g('fill="#000" opacity=".32"', ' translate(.08 .1)') + g('fill="#fff" opacity=".5"', ' translate(-.07 -.08)') + g('fill="color-mix(in oklch,var(--ink) 82%,white)"'));
  if (mode === 'medallion') {
    return out('<circle cx="50" cy="45" r="23.5" fill="' + P + '" opacity=".95"/><circle cx="50" cy="45" r="21.5" fill="none" stroke="var(--ink)" stroke-width=".7" opacity=".55"/>' +
      '<g transform="translate(34.5 29.5) scale(6.2)" fill="var(--ink3)"><path d="' + d + '"/></g>');
  }
  if (mode === 'engraved') { // fine horizontal rules, like stamp line engraving
    return out('<g clip-path="url(#gc-' + u + ')"><rect x="30" y="25" width="40" height="40" fill="url(#hatch-' + u + ')"/></g>' +
      '<g transform="' + tr + '" fill="none" stroke="' + P + '" stroke-width=".07" stroke-linejoin="round"><path d="' + d + '"/></g>',
      '<pattern id="hatch-' + u + '" width="4" height="1.15" patternUnits="userSpaceOnUse"><rect width="4" height=".66" fill="' + P + '"/></pattern>' +
      '<clipPath id="gc-' + u + '"><path transform="' + tr + '" d="' + d + '"/></clipPath>');
  }
  if (mode === 'overprint') return out(g('fill="color-mix(in oklch,var(--ink2) 45%,white)"', ' translate(.1 .08)') + g('fill="' + P + '" opacity=".96"', ' translate(-.05 -.04)')); // off-register two-colour print
  return out(g('fill="' + P + '"'));
}

// s = { id, category, rarity, level, earned, hidden, name }. uid keeps mask/gradient ids
// unique when the same stamp is on the page twice. Returns an SVG string.
function stampSVG(s, uid) {
  var earned = !!s.earned, t = Math.max(0, STAMP_TIERS.indexOf(s.rarity)), P = STAMP_PAPER, st = STAMP_STYLE[t];
  var u = 'st-' + (uid || s.id);
  var cat = STAMP_CATS[s.category] || STAMP_CATS.progress;
  var d = (typeof STAMP_ICONS !== 'undefined' && STAMP_ICONS[s.id]) || '';
  var fg = earned ? P : 'currentColor'; // knocked out of the print block
  var legend = t === 4 && earned, foil = 'url(#foil-' + u + ')';
  var holes = '';
  for (var i = 0; i <= 10; i++) {
    var p = 8 + i * 8.4;
    holes += '<circle cx="' + p + '" cy="8" r="2.6"/><circle cx="' + p + '" cy="92" r="2.6"/><circle cx="8" cy="' + p + '" r="2.6"/><circle cx="92" cy="' + p + '" r="2.6"/>';
  }
  var defs = '<mask id="perf-' + u + '"><rect x="6" y="6" width="88" height="88" fill="#fff"/><g fill="#000">' + holes + '</g></mask>' +
    '<clipPath id="blk-' + u + '"><rect x="15" y="15" width="70" height="70"/></clipPath>';
  var fill = 'currentColor';
  if (earned) {
    if (legend) { // gold foil for the legendary frame and edge
      defs += '<linearGradient id="foil-' + u + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--stamp-gold)"/><stop offset=".45" style="stop-color:var(--stamp-gold)"/>' +
        '<stop offset=".5" stop-color="oklch(0.98 0.03 90)"/><stop offset=".55" style="stop-color:var(--stamp-gold)"/><stop offset="1" style="stop-color:var(--stamp-gold)"/>' +
        '<animateTransform attributeName="gradientTransform" type="translate" values="-1 -1; 1 1" dur="3.2s" repeatCount="indefinite"/></linearGradient>';
    }
    // gradient fill: soft vertical for the tiers that ask for it, else richer with each tier
    if (st.soft || t > 0) {
      var stops, vert = !!st.soft, col = function (o, c) { return '<stop offset="' + o + '" style="stop-color:' + c + '"/>'; };
      if (st.soft) stops = col(0, 'color-mix(in oklch,var(--ink) 86%,white)') + col(1, 'color-mix(in oklch,var(--ink) 90%,black)');
      else if (t === 1) stops = col(0, 'var(--ink)') + col(1, 'color-mix(in oklch,var(--ink) 65%,var(--ink2))');
      else if (t === 2) stops = col(0, 'var(--ink)') + col(1, 'var(--ink2)');
      else if (t === 3) stops = col(0, 'var(--ink3)') + col(0.5, 'var(--ink)') + col(1, 'var(--ink2)');
      else stops = col(0, 'var(--ink3)') + col(0.32, 'var(--ink)') + col(0.5, 'color-mix(in oklch,var(--ink2) 45%,oklch(0.96 0.07 90))') + col(0.68, 'var(--ink2)') + col(1, 'var(--ink3)');
      defs += '<linearGradient id="bg-' + u + '" x1="0" y1="0" x2="' + (vert ? 0 : 1) + '" y2="1">' + stops + '</linearGradient>';
      fill = 'url(#bg-' + u + ')';
    }
    if (t >= 2) { // iridescent foil overlay (rare and up)
      defs += '<linearGradient id="hl-' + u + '" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="oklch(0.85 0.14 20)"/><stop offset=".2" stop-color="oklch(0.88 0.14 90)"/><stop offset=".4" stop-color="oklch(0.86 0.14 160)"/><stop offset=".6" stop-color="oklch(0.84 0.14 230)"/><stop offset=".8" stop-color="oklch(0.84 0.15 300)"/><stop offset="1" stop-color="oklch(0.86 0.14 20)"/>' +
        (t === 4 ? '<animateTransform attributeName="gradientTransform" type="translate" values="-0.6 0; 0.6 0; -0.6 0" dur="5s" repeatCount="indefinite"/>' : '') + '</linearGradient>';
    }
    if (st.grain) { // sparse speckle over the print block
      defs += '<filter id="grain-' + u + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="11" result="n"/>' +
        '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -4 0 0 0 3.55" result="speck"/><feComposite in="SourceGraphic" in2="speck" operator="in"/></filter>';
    }
  }
  var paper = earned && t >= 3 ? (t === 4 ? 'oklch(0.95 0.06 88)' : 'oklch(0.965 0.03 88)') : P;
  var b = '<g mask="url(#perf-' + u + ')"><rect x="6" y="6" width="88" height="88" fill="' + (earned ? paper : 'transparent') + '"' +
    (earned ? '' : ' stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"') + '/></g>';
  if (earned && t >= 3) b += '<rect x="6.6" y="6.6" width="86.8" height="86.8" fill="none" stroke="' + (legend ? foil : 'var(--stamp-gold)') + '" stroke-width="' + (legend ? 1.1 : 0.7) + '" opacity="' + (legend ? 1 : 0.8) + '"/>';
  b += '<rect x="15" y="15" width="70" height="70" rx="1.5" fill="' + (earned ? fill : 'transparent') + '"' + (earned && st.grain ? ' filter="url(#grain-' + u + ')"' : '') +
    (earned ? '' : ' stroke="currentColor" stroke-width="0.9" stroke-dasharray="3 3"') + '/>';
  if (earned && st.pattern) { var m = stampMotif(s.category, u, [0.15, 0.12, 0.1, 0.08, 0.07][t]); defs += m.def; b += m.body; }
  if (earned && t >= 1) { // engraved wave lines, denser per tier
    var n = 2 + t * 3, path = '';
    for (var k = 0; k < n; k++) {
      var y0 = 15 + (k + 0.5) * 70 / n, pts = [];
      for (var x = 15; x <= 85; x += 2.5) pts.push((x === 15 ? 'M' : 'L') + x + ' ' + (y0 + 2.4 * Math.sin((x - 15) / 70 * Math.PI * 2 * (1 + t * 0.45) + k * 0.9)).toFixed(2));
      path += pts.join('');
    }
    b += '<g clip-path="url(#blk-' + u + ')"><path d="' + path + '" fill="none" stroke="' + P + '" stroke-width="0.45" opacity="' + (0.13 + t * 0.02).toFixed(2) + '"/></g>';
  }
  if (earned && st.band) b += '<rect x="15" y="67" width="70" height="18" fill="#000" opacity=".2"/><path d="M15 67H85" stroke="' + P + '" stroke-width=".4" opacity=".4"/>';
  if (earned && t >= 2) b += '<rect x="15" y="15" width="70" height="70" fill="url(#hl-' + u + ')" opacity="' + [0, 0, 0.22, 0.32, 0.42][t] + '" style="mix-blend-mode:soft-light"/>';
  // frame ladder: line, corner dots (uncommon), diamonds (rare+), second line (epic+), gold frame (legendary)
  if (t >= 1) b += '<rect x="18.5" y="18.5" width="63" height="63" fill="none" stroke="' + fg + '" stroke-width="0.8" opacity=".75"/>';
  var corners = [[18.5, 18.5], [81.5, 18.5], [18.5, 81.5], [81.5, 81.5]];
  if (t === 1) corners.forEach(function (q) { b += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="1.5" fill="' + fg + '"/>'; });
  if (t >= 3) b += '<rect x="21.5" y="21.5" width="57" height="57" fill="none" stroke="' + fg + '" stroke-width="0.5" opacity=".6"/>';
  if (t >= 2) corners.forEach(function (q) { b += '<rect x="' + (q[0] - 2) + '" y="' + (q[1] - 2) + '" width="4" height="4" transform="rotate(45 ' + q[0] + ' ' + q[1] + ')" fill="' + fg + '"/>'; });
  if (legend) b += '<rect x="13" y="13" width="74" height="74" rx="2" fill="none" stroke="' + foil + '" stroke-width="2.4"/>';
  var gl = stampGlyph(d, st.glyph, earned, fg, u);
  defs += gl.def;
  b += gl.body +
    '<text x="22" y="77" font-size="9.5" font-weight="800" fill="' + fg + '">' + STAMP_PRICE[t] + '</text>' +
    '<text x="78" y="77" font-size="7" font-weight="700" text-anchor="end" fill="' + fg + '" font-family="Yu Mincho, Hiragino Mincho ProN, serif">' + cat.jp + '</text>';
  if (t >= 3) b += '<text x="50" y="25.5" font-size="6" text-anchor="middle" letter-spacing="1" fill="' + (legend ? foil : fg) + '">★★★</text>';
  if (earned && st.postmark) { // cancellation mark: ring, level, wavy bars
    var cx = 70, cy = 31;
    b += '<g opacity=".3" fill="none" stroke="#000" stroke-linecap="round"><circle cx="' + cx + '" cy="' + cy + '" r="11" stroke-width="1"/><circle cx="' + cx + '" cy="' + cy + '" r="8.6" stroke-width=".5"/>' +
      '<path d="M' + (cx - 28) + ' ' + (cy - 5) + 'q4 -2.5 8 0t8 0t8 0M' + (cx - 28) + ' ' + cy + 'q4 -2.5 8 0t8 0t8 0M' + (cx - 28) + ' ' + (cy + 5) + 'q4 -2.5 8 0t8 0t8 0" stroke-width=".8"/></g>' +
      '<text x="' + cx + '" y="' + (cy + 2) + '" font-size="6" font-weight="800" text-anchor="middle" fill="#000" opacity=".3">' + stampEsc(String(s.level || 'N5').toUpperCase()) + '</text>';
  }
  var ink = stampInks(s.id, s.category, s.level);
  var label = s.hidden && !earned ? '???' : s.name;
  return '<svg class="stamp ' + (earned ? 'earned' : 'locked') + '" viewBox="0 0 100 100" role="img" aria-label="' + stampEsc(label) +
    '" style="--ink:' + ink[0] + ';--ink2:' + ink[1] + ';--ink3:' + ink[2] + '"><defs>' + defs + '</defs>' + b + '</svg>';
}

// Stamp({ id, category, rarity, level, earned, hidden, name }) -> <span> holding the SVG.
function Stamp(props) {
  return React.createElement('span', { className: 'stamp-wrap', dangerouslySetInnerHTML: { __html: stampSVG(props, props.uid) } });
}
