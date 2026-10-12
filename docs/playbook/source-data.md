# Source data

Load when: building a ref list, vocab overrides, or `build-ref.js`. Source: [archive/level-playbook-full.md](archive/level-playbook-full.md) §1. Bug history is in [archive/bug-history.md](archive/bug-history.md). Mark N4-added rules with `[N4+]`.

## Rules

- Authority: Tanos levels; JMdict for vocab facts; KANJIDIC and Wiktionary for kanji facts. Tanos wins cross-source level conflicts.
- Fix list errors in `tools/build-ref.js` (`VOCAB_FIXES`), never by hand in generated files. Log each fix.
- Count sources honestly. elzup/jlpt-word-list is derived from Tanos; kanji-data takes levels from Tanos; Jisho and kanjiapi.dev both serve KANJIDIC. None of these is an independent second source for what it copied. Independent pairs: Tanos + JMdict (vocab), KANJIDIC + Wiktionary (kanji).
- Strip WaniKani fields from kanji-data. They are proprietary.
- A word listed at several levels goes to its lowest level.
- Kana and kanji duplicate spellings (いす/椅子, あびる/浴びる): teach one card. Prefer the kana form when the kanji is above level. Mark the other with `alt`.
- Verb class (godan vs ichidan) comes from JMdict pos tags only. Never guess from the ending: 帰る, 入る, 切る, 要る, 知る and 走る are godan.
- Headwords use standard okurigana (終わる, not 終る; 曲がる). Check every ref-list spelling against JMdict's preferred form.
- Other readings of one spelling (明日 あす) go in `alsoRead`, JMdict-checked.
- Tanos list pages are often down (HTTP 500). Use Wayback snapshots and record the snapshot dates. The Tanos grammar PDFs stayed live.
- `[N4+]` Old okurigana: the standard spelling goes first as `standard/old` (上がる/上る). Watch for spellings that are a different word on their own: 上る is normally のぼる, 下る is くだる.
- `[N4+]` A `・する` row (けんか・する) lists the noun. The generic rule strips する from a reading when the word does not end in する.
- `[N4+]` `・` also separates two readings (明日|あす・あした) and marks an optional prefix (お・金持ち).
- `[N4+]` Repeated rows and grammar patterns filed as words go in `VOCAB_SKIP` with the reason.
- `[N4+]` Lowest level wins mechanically. `build-ref.js` leaves out any entry already on a lower level's ref, so build the levels from N5 up in one command (`N5 N4 N3`).
- `[N4+]` Vocab overrides are authored in parallel parts from one brief: each author gets a key slice (`keys-<n>.txt`) and writes `part-<n>.json` (`items` + `skip`), merged into `tools/<lvl>-vocab-overrides.json`.
- `[N4+]` Authoring brief: facts from cached JMdict (Jisho) responses only; fetch and save any missing key at ≤1 request/s. The gloss must share a content word with a JMdict sense. Bound items (suffix, prefix, counter, words that only occur bound) need ≥2 `contexts` with sound changes checked. Unsure → a `notes` starting with `UNSURE:`; the orchestrator reads every one and audits every `skip`.
- `[N4+]` Cross-part and cross-level collisions are the merge risk. Run `tests/english-answers.js` right after the merge, and again when the next level lands.
