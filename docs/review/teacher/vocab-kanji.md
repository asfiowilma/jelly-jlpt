# Teacher slice: vocab-kanji (B1, B2, B9)

Reads: `vocab.js`, `kanji.js`, `kana.js`, `read-words.js`, `plan.js`, Jisho/KANJIDIC/Wiktionary caches, `lib.js` (question builders).
Load with [common.md](../common.md), [teaching-order.md](teaching-order.md), [known-open.md](../known-open.md), `levels/<level>.md`.

Teacher evidence: item id (`v:食べる|たべる`, `k:食`, `g:te-mo-ii`, `s:tatoeba:123456`, `s:own:n5-...`, `m:n5-...`, `p:n5-...`, `l:n5-...`, `x:n5-mock-1`), file + line, source consulted (cache file/URL).

## B1. Vocabulary facts

| # | Check | Pass | Fail | Evidence |
|---|---|---|---|---|
| B1.1 | `reading` vs Jisho `japanese[].reading` for matching `word` | match, or `alsoRead` holds other | reading Jisho lacks for spelling | id, `vocab.js:<line>`, cache file |
| B1.2 | `gloss`/`accept`: English only, true to Jisho senses (own wording) | every gloss maps to sense | gloss with sense Jisho lacks; Japanese chars in `gloss` (leak answer) | id, line, sense quoted |
| B1.3 | `pos` = Jisho `parts_of_speech`; verb class (`verb-godan`/`verb-ichidan`/`verb-suru`/`verb-kuru`) from tag, never ending | 帰る 入る 切る 要る 知る 走る godan; 着る 見る 寝る 起きる 出る 居る ichidan | class differs from JMdict tag | id, line, tag |
| B1.4 | Headword = standard okurigana (Jisho first `japanese[].word`) | 終わる, 曲がる | obsolete headword (終る) w/o standard accepted | id, line, slug |
| B1.5 | `accept` lacks primary gloss of another taught item, same pos family | none | 黒い accepting "dark" while 暗い taught; 兄 accepting bare "brother" | both ids |
| B1.6 | Bound items (`pos` suffix/prefix/counter: さん, 人\|じん, 人\|にん, 時, 枚, 分, 週間) have ≥2 `contexts`, never asked bare | all have contexts | counter taught as plain noun; asked "Type the Japanese for 'person from'" | id, line |
| B1.7 | Counter sound changes in contexts: 一杯 いっぱい, 三杯 さんばい, 三階 さんがい/さんかい, 一分 いっぷん, 三分 さんぷん | correct | reading no dictionary supports | id, context, source |
| B1.8 | Words with above-level kanji (隣, 家, 犬) shown kana (`displayWord`) in lessons, review cards, quiz prompts; no kanji→reading question | kana shown | untaught kanji in prompt/option | unit id, question text |
| B1.9 | `verified:true` = ≥2 independent lineages. Tanos+elzup = ONE (elzup copies Tanos); KANJIDIC via Jisho and via kanjiapi.dev = ONE; kanji-data levels from Tanos | 2 independent (e.g. tanos+jmdict) | `verified:true` with one; `verified:false` with no `notes` reason | id, `sources` |

Measure B1.1-B1.3: exhaustive over level (size in `levels/<level>.md`). Cache lacks word: fetch (A4). Report sample size + count checked.

## B2. Kanji facts

| # | Check | Pass | Fail |
|---|---|---|---|
| B2.1 | Every `on`, `kun`, `extra` in KANJIDIC (`kanji-<level>.json`) | all listed | reading KANJIDIC lacks (word-specific rendaku like 中 ジュウ must be labelled, not listed as on) |
| B2.2 | `strokes` = KANJIDIC and Wiktionary | both agree | any disagreement |
| B2.3 | `meaning` consistent w/ KANJIDIC senses, own wording | yes | meaning KANJIDIC lacks |
| B2.4 | Readings by teaching need: those level vocab uses + ≤2 extras; no dump | ≤ used+2 | kanji with 6 readings no N5 word uses |
| B2.5 | Whole-word readings (今日, 大人, 一人, お父さん) add no kanji reading, stay in word list | yes | 今 listing きょ |
| B2.6 | Typed kanji-reading accepts on + kun + extra + bare kun stems (長 → なが, ちょう, ながい) | `answerIsRight` true each | listed reading rejected |
| B2.7 | Catalog kanji set = reference list both ways (`tools/ref/<level>.json`, `kanji-<level>.json`) | 0 missing, 0 extra | either |
| B2.8 | Kanji taught at/after first lesson teaching a word using it | yes | kanji unit before any word with it |
| B2.9 | Stroke-order SVG for every kanji and kana (`kanji-svg/`); path count = stroke count | yes | missing/mismatched |

Measure B2.6: per kanji build typed reading question via `makeQuestion`, test each listed reading with `answerIsRight`; report rejected list.

## B9. Distractors and answer leaks (aggregate, many seeded builds)

| # | Check | Pass | Fail |
|---|---|---|---|
| B9.1 | Answer never visible before answering: prompt, question, note, hint, placeholder, furigana parts never contain answer or (vocab word answer) its reading | 0 leaks | "Which word means 'Mr., Ms. (～さん)'?"; placeholder "e.g. うまれる" |
| B9.2 | MC options: 4 distinct by displayed text; no second correct answer (shared sense word, near synonym する/やる, コップ/カップ); never another valid reading of word/kanji | 0 | any |
| B9.3 | Reading MC: answer not the unique "centre" (smallest total edit distance to other three) | centre wins ≤30% (chance 25%) | ≥40% |
| B9.4 | Correct option longest ≤30%; unique script ≤30% | yes | a tell |
| B9.5 | Same-mock leaks: no answer string of one question printed in another stem/passage of same mock | 0 | 電話 answered Q9, printed Q10 |
| B9.6 | Homographs: another valid reading of same spelling gives neutral "we want the ___ reading" retry, not miss; same-word alternates (九 きゅう/く; 明日 あす) accepted | yes | valid reading marked wrong |
| B9.7 | Typed English: normalised (case, articles, "to", plurals, UK/US), typo tolerant (1 edit ≥5 letters, 2 ≥10) never onto another catalog meaning; natural learner answers accepted ("overseas" for 外国, "ballpoint", "big brother") | yes | fair answer rejected; wrong word accepted |
| B9.8 | Conjugation answers rule-based from `pos`, standard okurigana accepted; 行く → いって; する/来る irregulars | yes | 終らない only |
| B9.9 | Variety: item asked ≤2× per quiz, never within 3 questions of itself; small stages shorter quizzes (min 8), no padding; no cap on word appearing as wrong option (owner rule) | yes | same question 4× |
| B9.10 | Every generated question type renders and is answerable; question line present (passage with options but no question = blocker) | yes | missing question |

Measure B9.1-B9.4, B9.9: build every unit quiz 20× with seeds; per question record type, prompt, options, answer; compute leak count, centre-option share, longest-option share, max asks per item, quiz length. Report totals, ten worst units, seed list.
