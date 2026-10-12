# Kanji

Load when: writing kanji overrides or running `author-kanji.js`. Source: [archive/level-playbook-full.md](archive/level-playbook-full.md) §4. Mark N4-added rules with `[N4+]`.

## Rules

- Choose readings by teaching need: the readings this level's vocab actually uses, plus at most 2 extras. Do not dump KANJIDIC.
- Whole-word readings (今日, 大人, 一人, お父さん) add no reading to the kanji, but stay in its word list.
- The typed kanji reading accepts on + kun + `extra` + bare kun stems (長 → なが).
- Stroke counts need two agreeing sources (KANJIDIC + Wiktionary/Unihan).
- Add a KanjiVG SVG for every new kanji (CC BY-SA 3.0, separate files). The loader strips the `<?xml?>`/DOCTYPE header, which otherwise shows a stray `]>`.
- `[N4+]` A level's kanji draw words from every lower level. `tools/author-kanji.js --level N4` loads N5 and N4 vocab, so N5 kanji are reading candidates when an N4 word is split.
- `[N4+]` KanjiVG is the third stroke source. `author-kanji.js` counts the `<path>`s in the SVG and keeps a count any two sources agree on. `node tools/build-strokes.js --fetch` downloads missing SVGs for every kanji on a `tools/ref` list, then bundles.
- `[N4+]` A kanji no word splits into (京; 田, read only inside 田舎) takes its `extra` readings as on/kun, so reading questions have an answer. The plan places it by hand (see [plan.md](plan.md)).
- `[N4+]` Whole-word readings go in the override's `special` (jukujikun such as 今日 きょう, 田舎 いなか), each with a reason. `author-kanji.js` stops and lists every word that will not split into its kanji's readings until it is added.
- `[N4+]` Wiktionary is a credited source. Every kanji lists it, so `CREDITS` needs its row.
