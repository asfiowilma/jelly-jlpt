"use strict";

// N5 grammar. ponytail: scaffolding stub (ticket 32) — Tanos N5 points with the
// legacy day's meaning (via research/grammar-mapping.json). Real authoring: ticket 14.
CATALOG.add([
  { id: 'g:wa-desu', kind: 'grammar', level: 'N5', pattern: 'X は Y です', meaning: 'X is Y (X is the topic)',
    formation: 'N は N です', examples: ['s:own:n5-wa-desu'], sources: ['legacy', 'tanos'], verified: false },
  { id: 'g:mo', kind: 'grammar', level: 'N5', pattern: '〜も', meaning: '~ too / ~ also',
    formation: 'N も', examples: ['s:own:n5-mo'], sources: ['legacy', 'tanos'], verified: false },
  { id: 'g:ni-ikimasu', kind: 'grammar', level: 'N5', pattern: '〜に いきます', meaning: 'go to ~',
    formation: 'Place に いきます', examples: ['s:own:n5-ni-ikimasu'], sources: ['legacy', 'tanos'], verified: false }
]);
