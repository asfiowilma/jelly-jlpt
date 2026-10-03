"use strict";

// Achievement stamp (ticket 09; look locked in ticket 07, "Postage" style).
// Pure: stampSVG() builds the SVG string, Stamp() wraps it. Glyph = identicon path data
// from data/stamp-icons.js (STAMP_ICONS, id -> path), everything else is drawn here.
//
// Ink is per achievement and never follows the palette: hue per category, lightness and
// chroma step per rarity tier, levels walk a hue gradient N5 -> N1. Theme only changes
// which of two precomputed inks shows (light mode lowers lightness), via CSS, so a stamp
// already on screen follows a theme switch without re-rendering (see .stamp in styles.css).
var STAMP_CATS = {
  progress: { jp: '進', hue: 245 },
  habit:    { jp: '習', hue: 55 },
  quiz:     { jp: '問', hue: 95 },
  mock:     { jp: '試', hue: 290 },
  review:   { jp: '復', hue: 155 },
  mastery:  { jp: '極', hue: 5 }
};
var STAMP_TIERS = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
var STAMP_PRICE = ['10円', '50円', '100円', '500円', '1000円'];
var STAMP_LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];
var STAMP_LEVEL_STEP = 62;   // hue degrees per level
var STAMP_LIGHT_DROP = 0.14; // light mode lowers L only
var STAMP_PAPER = 'oklch(0.97 0.015 85)';

// { l, c, h } of the ink. light = light-theme variant.
function stampInkParts(category, rarity, level, light) {
  var t = Math.max(0, STAMP_TIERS.indexOf(rarity));
  var cat = STAMP_CATS[category] || STAMP_CATS.progress;
  var lv = Math.max(0, STAMP_LEVELS.indexOf(String(level || '').toLowerCase()));
  return {
    l: +(0.74 - t * 0.04 - (light ? STAMP_LIGHT_DROP : 0)).toFixed(3),
    c: +(0.13 + t * 0.02).toFixed(3),
    h: (cat.hue + t * 6 + lv * STAMP_LEVEL_STEP) % 360
  };
}
function stampInk(category, rarity, level, light) {
  var p = stampInkParts(category, rarity, level, light);
  return 'oklch(' + p.l + ' ' + p.c + ' ' + p.h + ')';
}

function stampEsc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// s = { id, category, rarity, level, earned, hidden, name }. uid keeps mask/gradient ids
// unique when the same stamp is on the page twice. Returns an SVG string.
function stampSVG(s, uid) {
  var earned = !!s.earned, t = Math.max(0, STAMP_TIERS.indexOf(s.rarity));
  var u = 'st-' + (uid || s.id);
  var cat = STAMP_CATS[s.category] || STAMP_CATS.progress;
  var d = (typeof STAMP_ICONS !== 'undefined' && STAMP_ICONS[s.id]) || '';
  var fg = earned ? STAMP_PAPER : 'currentColor'; // knocked out of the print block
  var dash = earned ? '' : ' stroke-dasharray="3 3"';
  var legend = t >= 4 && earned, foil = 'url(#foil-' + u + ')';
  var holes = '';
  for (var i = 0; i <= 10; i++) {
    var p = 8 + i * 8.4;
    holes += '<circle cx="' + p + '" cy="8" r="2.6"/><circle cx="' + p + '" cy="92" r="2.6"/><circle cx="8" cy="' + p + '" r="2.6"/><circle cx="92" cy="' + p + '" r="2.6"/>';
  }
  var body = '<mask id="perf-' + u + '"><rect x="6" y="6" width="88" height="88" fill="#fff"/><g fill="#000">' + holes + '</g></mask>' +
    '<g mask="url(#perf-' + u + ')"><rect x="6" y="6" width="88" height="88" fill="' + (earned ? STAMP_PAPER : 'transparent') + '"' +
    (earned ? '' : ' stroke="currentColor" stroke-width="1.5"' + dash) + '/></g>' +
    '<rect x="15" y="15" width="70" height="70" rx="1.5" fill="' + (earned ? 'currentColor' : 'transparent') + '"' +
    (earned ? '' : ' stroke="currentColor" stroke-width="0.9"' + dash) + '/>';
  if (t >= 1) body += '<rect x="18.5" y="18.5" width="63" height="63" fill="none" stroke="' + fg + '" stroke-width="0.8" opacity=".75"/>';
  if (t >= 2) {
    [[18.5, 18.5], [81.5, 18.5], [18.5, 81.5], [81.5, 81.5]].forEach(function (q) {
      body += '<rect x="' + (q[0] - 2) + '" y="' + (q[1] - 2) + '" width="4" height="4" transform="rotate(45 ' + q[0] + ' ' + q[1] + ')" fill="' + fg + '"/>';
    });
  }
  body += '<g transform="translate(32 27) scale(' + 36 / 5 + ')" fill="' + fg + '" opacity="' + (earned ? 1 : 0.18) + '"><path d="' + d + '"/></g>' +
    '<text x="22" y="77" font-size="7.5" font-weight="800" fill="' + fg + '">' + STAMP_PRICE[t] + '</text>' +
    '<text x="78" y="77" font-size="7" font-weight="700" text-anchor="end" fill="' + fg + '" font-family="Yu Mincho, Hiragino Mincho ProN, serif">' + cat.jp + '</text>';
  if (t >= 3) body += '<text x="50" y="25.5" font-size="6" text-anchor="middle" letter-spacing="1" fill="' + (legend ? foil : fg) + '">★★★</text>';
  if (legend) body += '<rect x="13" y="13" width="74" height="74" rx="2" fill="none" stroke="' + foil + '" stroke-width="2.4"/>';
  var defs = legend ?
    '<defs><linearGradient id="foil-' + u + '" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" style="stop-color:var(--stamp-gold)"/><stop offset=".45" style="stop-color:var(--stamp-gold)"/>' +
    '<stop offset=".5" stop-color="oklch(0.98 0.03 90)"/><stop offset=".55" style="stop-color:var(--stamp-gold)"/><stop offset="1" style="stop-color:var(--stamp-gold)"/>' +
    '<animateTransform attributeName="gradientTransform" type="translate" values="-1 -1; 1 1" dur="3.2s" repeatCount="indefinite"/></linearGradient></defs>' : '';
  var a = stampInkParts(s.category, s.rarity, s.level, false), b = stampInkParts(s.category, s.rarity, s.level, true);
  var ink = function (p) { return 'oklch(' + p.l + ' ' + p.c + ' ' + p.h + ')'; };
  var label = s.hidden && !earned ? '???' : s.name;
  return '<svg class="stamp ' + (earned ? 'earned' : 'locked') + '" viewBox="0 0 100 100" role="img" aria-label="' + stampEsc(label) +
    '" style="--ink-d:' + ink(a) + ';--ink-l:' + ink(b) + '">' + defs + body + '</svg>';
}

// Stamp({ id, category, rarity, level, earned, hidden, name }) -> <span> holding the SVG.
function Stamp(props) {
  return React.createElement('span', { className: 'stamp-wrap', dangerouslySetInnerHTML: { __html: stampSVG(props, props.uid) } });
}
