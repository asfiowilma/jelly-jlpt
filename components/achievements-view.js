"use strict";

// Achievements screen (ticket 09): every achievement as a stamp, grouped by category,
// unearned greyed, hidden ones "???", progress counters, unlock date.
//
// THE SEAM with the achievement engine (ticket 08): everything this screen needs comes
// from achievementsData(). It expects
//   ACHIEVEMENTS         global array of { id, name, desc, category, rarity, hidden, revealed, level }
//   achievementUnlocks() global function returning { [id]: unlockedAtMs }
// TODO(08): both are defined by the engine; until it merges the screen shows its empty state.
function achievementsData() {
  return {
    defs: typeof ACHIEVEMENTS !== 'undefined' ? ACHIEVEMENTS : [],
    unlocks: typeof achievementUnlocks === 'function' ? achievementUnlocks() : {}
  };
}

var ACH_CATEGORY_ORDER = ['progress', 'habit', 'quiz', 'mock', 'review', 'mastery'];

// Pure. -> { earned, total, groups: [{ category, earned, total, items: [def + { earnedAt }] }] }.
// Categories in ACH_CATEGORY_ORDER (unknown ones last), definition order kept inside each.
function groupAchievements(defs, unlocks) {
  unlocks = unlocks || {};
  var by = {}, earned = 0;
  defs.forEach(function (d) {
    var at = unlocks[d.id] || 0;
    if (at) earned++;
    (by[d.category] = by[d.category] || []).push(Object.assign({}, d, { earnedAt: at }));
  });
  var cats = Object.keys(by).sort(function (a, b) {
    var x = ACH_CATEGORY_ORDER.indexOf(a), y = ACH_CATEGORY_ORDER.indexOf(b);
    return (x < 0 ? 99 : x) - (y < 0 ? 99 : y);
  });
  return {
    earned: earned, total: defs.length,
    groups: cats.map(function (c) {
      return { category: c, items: by[c], total: by[c].length, earned: by[c].filter(function (i) { return i.earnedAt; }).length };
    })
  };
}

function AchievementsView(props) {
  var level = props.level || 'N5';
  var data = props.defs ? { defs: props.defs, unlocks: props.unlocks } : achievementsData();
  var g = groupAchievements(data.defs, data.unlocks);
  var h = React.createElement;
  var of = ' ' + t('ach_of', level) + ' ';
  if (!g.total) return h('div', { className: 'panel ach-empty' }, t('ach_empty', level));
  return h('div', { className: 'achievements' },
    h('div', { className: 'panel' },
      h('h2', { className: 'ach-title' }, t('view_achievements', level) + ' · ' + g.earned + of + g.total),
      h('div', { className: 'ach-bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': g.total, 'aria-valuenow': g.earned },
        h('i', { style: { width: (g.earned / g.total * 100) + '%' } }))),
    g.groups.map(function (grp) {
      var jp = (STAMP_CATS[grp.category] || {}).jp || '';
      return h('section', { key: grp.category, className: 'panel ach-cat', 'aria-label': t('ach_cat_' + grp.category, level) },
        h('h3', { className: 'panel-h' }, h('span', { className: 'ach-jp', lang: 'ja', 'aria-hidden': 'true' }, jp),
          t('ach_cat_' + grp.category, level), h('span', { className: 'r' }, grp.earned + of + grp.total)),
        h('div', { className: 'ach-grid' }, grp.items.map(function (a) {
          var earned = !!a.earnedAt, secret = a.hidden && !earned;
          return h('div', { key: a.id, className: 'ach' + (earned ? ' earned' : ' locked') },
            h(Stamp, { id: a.id, category: a.category, rarity: a.rarity, level: a.level, earned: earned, hidden: a.hidden, name: a.name }),
            h('b', { className: 'ach-name' }, secret ? '???' : a.name),
            h('span', { className: 'ach-desc' }, secret ? t('ach_secret', level) : (earned && a.revealed) || a.desc),
            h('span', { className: 'ach-meta' }, t('ach_r_' + a.rarity, level) + ' · ' +
              (earned ? new Date(a.earnedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : t('ach_locked', level))));
        })));
    }));
}
