# Teacher slice: listening-dialogues (B7, B10.5-B10.6)

Reads: `listening.js`, `plan.js`, `audio/manifest.js`, `tools/audio/cast.json` (names, genders only).
Load with [common.md](../common.md), [teaching-order.md](teaching-order.md), [known-open.md](../known-open.md), `levels/<level>.md`.

## B7. Dialogues (lesson scripts) and listening scripts

| # | Check | Pass | Fail |
|---|---|---|---|
| B7.1 | Correct natural Japanese; politeness consistent for stage (です/ます until plain taught); children talk like children | yes | unnatural collocation (じしょを読みます for "study"); register slip |
| B7.2 | Stage grammar point used clearly ≥1× (ideally 2-3 ways); fair share of new vocab appears naturally, not as list | yes | point absent or used once by accident |
| B7.3 | Flow: each line answers/reacts to previous; small arc; no non sequitur; no line only to show a word; same-speaker runs deliberate | yes | line from nowhere (bare どうぞ, nothing handed; "who is singing?" no singing in scene) |
| B7.4 | `en` matches Japanese exactly in meaning | yes | invented content; mistranslation |
| B7.5 | `furigana` ruby correct; every katakana word is a used word or `names` entry | yes | wrong ruby |
| B7.6 | Age-appropriate, wholesome; no catchphrases/lines from any show or textbook; canon names only; nobody addresses someone whose name they would not know | yes | verbatim quote; child using adult's unlearned name |
| B7.7 | Practice swaps (`remixes`): same scene, ONE detail swapped, stage grammar used; answer never a dialogue line or trimmed/merged/one-particle-changed version; exactly one distractor, a real wrong form; `explain` teaches | remix | rebuild (answer inside a line, or `en` = a line's `en`); swap skipping grammar point |
| B7.8 | `dialogueSpeech(line, item)` reads intended word: ambiguous readings (家 いえ, 明日 あした, 何 なに/なん, 入る はいる, 塩 しお) resolved; numbers/counters from authored kana | yes | kanji TTS would misread, no `say` override |
| B7.9 | Test-format listening (`quick`, `utterance`, `task`, `point`): exactly one defensible answer from audio alone; no gesture-dependent こっち; no sub-answer (reply to different question) | yes | two defensible options |
| B7.10 | Listening keys spread: per format and per mock no option slot >45%; key = single longest option ≤40% | yes | option 1 keyed in most items |
| B7.11 | Listening `say`/kana: particle は/へ written so clip says wa/e; 何人 なんにん vs なにじん, 四日/八日 resolved | yes | hazard line left to model |

Measure B7.10: count `answer` index per format over catalog, per mock over `mockSections(mock)`.

## B10.5-B10.6. Attribution of own and generic content

| # | Check | Pass | Fail |
|---|---|---|---|
| B10.5 | Own content `sources: ['own']`; `verified:false` items carry `notes` reason | yes | own passage marked verified with unverified `uses` item, no note |
| B10.6 | Character names in listening/dialogues generic (マイク, キム) or project cast; no real person | yes | real person |
