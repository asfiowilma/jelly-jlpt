# Reference lists (test fixture)

`<level>.json` (`n5.json`, `n4.json`) lists which vocabulary (`word|reading`), kanji and
grammar point names belong to that JLPT level. `tests/catalog-checks.js` uses it to check catalog levels,
and `tools/coverage.js` uses it for the coverage report. It is a dev fixture;
the app never loads it.

Regenerate from the dev-only research lists (`.scratch/content-audit/research/data`):

```bash
node tools/build-ref.js .scratch/content-audit/research/data N5 N4
```

`build-ref.js` fixes a few known list errors on the way (`VOCAB_FIXES`: the 明い
typo, おじいさん filed under 伯父/叔父, readings with する glued on, the truncated
ラジオカセ, and others). Each fix is commented there. `VOCAB_SKIP` drops rows that repeat
another row or are grammar patterns filed as words. A word already on a lower level's list
is left out of the higher level (the lowest level wins), so build N5 before N4.

`data/<level>/vocab.js` is generated from this list by `tools/author-vocab.js --level <level>` (see its header).

## Credits

- Vocabulary, kanji and grammar lists: Jonathan Waller's JLPT resources,
  [tanos.co.uk](http://www.tanos.co.uk/jlpt/) (CC BY, "use anything here however
  you like, but credit my site").
- Vocabulary cross-check: [elzup/jlpt-word-list](https://github.com/elzup/jlpt-word-list)
  (MIT), itself derived from the Tanos lists.

Only list membership is kept here. No KANJIDIC fields (CC BY-SA) and nothing from
JLPT Sensei.
