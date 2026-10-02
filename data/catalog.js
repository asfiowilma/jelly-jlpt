"use strict";

// ── Catalog + plan (spec: .scratch/content-audit/spec.md §2-4) ──────────────
// CATALOG.items: every teachable item exactly once, keyed by its content id
//   v:<word>|<reading>  k:<char>  g:<slug>  s:own:<slug> / s:tatoeba:<n>
// PLAN: one entry per level, { level, units: [...] }, pushed by data/<lvl>/plan.js.
// Item files (data/<lvl>/<kind>.js) call CATALOG.add([...]). lib.js joins the two
// (buildUnits); validatePlan checks every reference resolves.
var PLAN = [];
var CATALOG_ID_PREFIX = { vocab: 'v:', kanji: 'k:', grammar: 'g:', sentence: 's:' };
var CATALOG = {
  items: {},
  // ponytail: light shape check only (id/kind/prefix/duplicates); per-kind field
  // checks live in tests/catalog-plan.js so a bad item doesn't blank the app.
  add: function (items) {
    items.forEach(function (it) {
      var prefix = it && CATALOG_ID_PREFIX[it.kind];
      if (!prefix || typeof it.id !== 'string' || it.id.indexOf(prefix) !== 0) {
        throw new Error('CATALOG.add: bad item ' + JSON.stringify(it));
      }
      if (CATALOG.items[it.id]) throw new Error('CATALOG.add: duplicate id ' + it.id);
      CATALOG.items[it.id] = it;
    });
  }
};
