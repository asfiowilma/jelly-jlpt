# Reference lists (test fixture)

`n5.json` lists which vocabulary (`word|reading`), kanji and grammar point names
belong to JLPT N5. `tests/catalog-checks.js` uses it to check catalog levels,
and `tools/coverage.js` uses it for the coverage report. It is a dev fixture;
the app never loads it.

Regenerate from the dev-only research lists (`.scratch/content-audit/research/data`):

```bash
node tools/build-ref.js .scratch/content-audit/research/data N5
```

## Credits

- Vocabulary, kanji and grammar lists: Jonathan Waller's JLPT resources,
  [tanos.co.uk](http://www.tanos.co.uk/jlpt/) (CC BY, "use anything here however
  you like, but credit my site").
- Vocabulary cross-check: [elzup/jlpt-word-list](https://github.com/elzup/jlpt-word-list)
  (MIT), itself derived from the Tanos lists.

Only list membership is kept here. No KANJIDIC fields (CC BY-SA) and nothing from
JLPT Sensei.
