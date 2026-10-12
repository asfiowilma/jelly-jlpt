# Bug history: what went wrong and the rule it produced

Moved out of the topic files. The rules live in [quiz-rules.md](../quiz-rules.md) and the other topic files. Read this only to learn why a rule exists. Full section text: [level-playbook-full.md](level-playbook-full.md).

## Quiz bugs seen on N5 (archive §6)

| Bug seen on N5 | Rule |
|---|---|
| **Answer shown in the prompt.** 702 leaks in 20 builds: "Which word means 'Mr., Ms. (～さん)'?" | Glosses and meanings are English only; Japanese hints go in `usage` (lessons only). The catalog check rejects kana/kanji in gloss/meaning. `answerLeaks` runs in `makeQuestion` and `mondaiQuestions`; `tests/quiz-leaks.js` is an independent checker. |
| **Placeholder text showing an answer** ("e.g. うまれる", "ひらがな…" for 平仮名, "にほんご…") | Placeholders never contain a sample answer. |
| **Bound items asked alone** ("Type the Japanese for 'person from'" → じん) | Suffixes, prefixes and counters are asked only in context: host + blank + English, or the reading of the compound. ≥2 authored contexts per item. Check counter sound changes (三杯 さんばい, 一杯 いっぱい, 三階 さんがい/さんかい); JMdict lacks most number + counter compounds. |
| **Another valid reading marked wrong** (人 → にん when じん was asked) | WaniKani rule: another reading of the same spelling or kanji → neutral notice + retry, not a miss. Same-word alternate readings (九 きゅう/く) are both accepted. Ambiguous spellings show a meaning hint. MC never offers another valid reading. |
| **Fair English answers rejected** ("overseas" for 外国, "big brother", "ballpoint") | Every vocab/kanji item gets an `accept` list (own wording, checked against JMdict senses). Normalise case, accents, articles, "to", plurals and UK/US spelling. Allow typos (1 edit at ≥5 letters, 2 at ≥10) but never onto another catalog meaning. Show "Accepted answers" on a miss; offer "I was right". **When authoring a gloss, ask: what would a learner naturally type?** Include the short form (ballpoint, sister) and the common synonym. |
| **An `accept` entry was another word's meaning** (黒い "dark" with 暗い taught, bare "brother" for 兄) | No `accept` entry equals the primary gloss of another taught item of the same pos family. 75 removed on N5; `tests/english-answers.js` checks it. |
| **Distractors too easy** (random words from every level) | `pickDistractors`: taught items first, same level/pos/topic/script/length, sound and look-alike confusers. Never a second correct answer (shared sense word) and never a duplicate option. |
| **Near synonyms as rival options** (する/やる, コップ/カップ: their glosses share no sense word) | `NEAR_SYNONYMS` pairs are never options or typed answers against each other. Extend the list per level. |
| **Reading MC fakes gave the answer away** (every fake one edit from the answer, so the "centre" option won 82-100%) | `squareFakes`: two one-edit fakes at different places plus both edits together, so no option is the centre. After any distractor change, measure answer position and centre share over many seeded builds. |
| **Kana options duplicated** (ず/づ both "zu") | Options are distinct by displayed text. |
| **Kana pick offered unlearned kana** (ゼ, ヒ, ビ in the さ stage) | Kana distractors come only from kana already learned. |
| **Fake readings rendering oddly** (ゔ) | `readingFakes` only for reading questions, and no ゔ. |
| **Placeholder patterns as options** ("Review & Practice") | No placeholder text in the catalog; the check enforces it. |
| **Interchangeable answers in one blank** (から/ので, ましょう/ませんか/ましょうか, てもいい/てはいけません/ないでください: 46 of 65 N5 gap stems had 2+ right options) | `GAP_INTERCHANGEABLE` lists whole sibling families as exclusion groups (one-way cases in `GAP_ANSWER_BLOCKS`): no option set holds two of one group, tested over every gap stem. Trade-off: a point whose only confusables are its siblings gets no gap question (11 points at N5). |
| **Conjugation "answer" was the dictionary form** | Rule-based `conjugate()` driven by item `pos`. ら抜き potentials not accepted (decide per level). |
| **Reorder split words in half** (信頼で\|きる) | ★ questions use authored chunks only, with `star` slots restricted where several orders are valid. |
| **文脈規定 with more than one fitting word** | Generated ones rely on the English note shown, which stays the only disambiguator (code can't rule out other noun-slot fits; owner kept it). Mocks use authored items with exactly one fit and no note. |
| **Generator types with no renderer crashed the quiz** | Every type has a renderer. The full playthrough test answers every type, right and wrong. |
| **Quiz UI redesign dropped the reading question** (passage + options shown, no question) | The playthrough test fails any question whose question line isn't rendered. After any quiz-layout change, play one question of every type in the browser. |
| **Same question over and over** (kana items asked up to 4×, "cigarette" a wrong option 31× in 10 quizzes) | Quiz length is a maximum: few items → shorter quiz (min 8), an item ≤2× and 3+ questions apart. Fewer than 15 taught candidates → widen with untaught same-level items (no cap on a good trap). Device-local recent memory steers retakes to other forms. Measure max-per-item and quiz length over many builds after any composition change. |
| **Romaji that names two spellings** (zu: ず/づ, o: お/を, ti: チ/ティ, koohii: コーヒー or コオヒイ) | Typed romaji → kana only when the romaji names one spelling (`kanaSpellable`); ん before a vowel shown as n'; ー shown as a macron (kōhī) and typed as -, like an IME. |
| **Flaky tests from randomness** | Seed random in tests, and run the suite 3× before merging. |

## Quiz bugs found by the N5 review round 1 (archive §6)

Rows marked † landed on the `n5-audit-r1-newbie` branch.

| Bug the reviewers found | Rule |
|---|---|
| **Type the Japanese accepted only one spelling** (椅子 for いす, ご飯 for 御飯 rejected; blocker) | The typed answer accepts the item's `alt` partners and an `altSpell` list (other JMdict spellings, checked by `author-vocab.js` against the cached lookup). |
| **A same-kana word as a wrong option** (あつい shown in kana for 暑い, while "thick" 厚い is also あつい; blocker) | A word option is rejected when any word written or read the same way shares the answer's sense (`sharesSense`). Kana display (`displayWord`) makes homophones collide. |
| **Reading MC fakes that are real readings** (三つ みつ, 四つ よつ, 先 さっき, 川 がわ) | Every JMdict reading of the spelling goes in `alsoRead`, which is accepted when typed and never used as a fake. |
| **Counters stored as plain nouns** (分, 週間 asked bare, no sound changes) | Every counter is `pos: counter` with ≥2 `contexts`. A bound item whose kanji is untaught (側, 匹, 階) shows that kanji with its reading as ruby when the compound is read. A miss names the sound change (三杯 さんばい). |
| **An `accept` list overlapping another option's gloss** (洗う accepts "to clean", offered against 掃除 "to clean") | Any pair where one item's accept holds the other's meaning never meets as answer and wrong option (`nearSynonyms`). The overlap test checks every gloss, not only the first. Re-run across levels when a new level lands. |
| **文章の文法 / 言い換え / 用法 options printed untaught kanji bare** (好きだった in an N5 drill) | Authored options carry furigana markup and render through `quizFurigana` (`optionParts`), like passages. `tests/mondai.js` asserts no option prints an untaught kanji without ruby. |
| **A 表記 answer printed in an earlier stem of the same part** (名前 in Q3, 前 asked in Q10) | No 表記 answer kanji in an earlier stem of its part (`tests/mocks.js`). Learners can navigate freely inside a part. |
| **漢字読み key was the "centre" option** in 10 of 18 mock items (every distractor one sound off the key) | Authored mock distractors follow the same square shape as `squareFakes`; test: centre share ≤35%. |
| **Items echoing the official sample workbook** (forgot one's watch and asks the time; the 雨 distractor set; the stamp counters) | Read the official samples once to learn the format, then write scenes, distractor sets and skeletons that don't track them. A reviewer compares against the sample booklet. |
| **A narrator line used an untaught pattern** (〜てもらいたい in an N5 mock) | Listening and option text obey the same teaching order as sentences; list every pattern in `uses`. A mock is graded, so a form the course never teaches is a defect, not a nit. |
| **Dialogue word chips showed kanji the vocab table shows in kana** (私 先生 名前 at Stage 19) | Chips are spelled through `displayWord` with ruby, like the vocab table. |
| **Notes assumed grammar jargon** ("ます-stem", "ichidan", "copula") and showed raw ids ("(g:deshita)") | Define a term in plain words the first time it appears (る-verb / う-verb, not ichidan / godan). Never print an internal id. Every kanji in a tip or note sits in ruby (catalog check). |
| **Review queue flooded with kana** (107 of 130 due cards were single kana after 34 stages) † | `srsDueCards` caps single-kana cards at `KANA_DUE_MAX` (20), most overdue first; words are never capped. Kana stage quizzes stop at `KANA_QUIZ_MAX` (22). |
| **A prep drill showed its own answers** (ノート printed in Q3, asked in Q8) † | `prepDrill` drops a question whose key shows in another stem, or that reuses a sentence (`drillLeak`). The check doesn't scan passage text yet. |
| **Mock verdict unreadable** ("Unlikely to pass" in red next to a total far over the mark) † | `mockOutlook` names the mark that decides the verdict (`marks`: "the listening minimum of 19"). |
| **Grammar quizzed by label only** (the right option is the pattern title just shown; 25% of lesson grammar questions made a form) † | `makeQuestion` makes the grammar point (gap, ★, conjugation) before falling back to the label match. Ratchet test in `tests/quiz-variety.js`: ≥40% made. 39 N5 points still get only the label (no confusable set, no chunked sentence). |
| **Off-catalog words in shown sentences** (彼, ビール, 人形, 親切) † | `OFF_CATALOG` in `lib.js` counts them as untaught, unless the sentence lists the word in `uses` (a higher level teaches 彼). `tests/mocks.js`: no mock stem holds one. Shrink the list as levels add the words. |

## Review-round findings (N5 round 1, archive §8)

Seven reviewer reports failed with 2 blockers, 33 majors and 73 nits, on a level whose suite was green.

| Class | Findings | Examples |
|---|---|---|
| Teaching-order leaks hidden by incomplete `uses` | 11 | より, plain past, 彼, を, counters, てもらう, plain だ before taught |
| Untaught kanji printed bare | 9 | 文章の文法 options, counter compounds, tips and notes, word chips, 上手 split ruby |
| Distractor tells and second right options | 9 | centre key 56%, real readings as fakes, あつい homophone, accept vs gloss |
| Fair typed answers rejected | 6 | 椅子 for いす, "return home", "ask a favour", "that's right" |
| Learner-hostile notes | 6 | ichidan / stem / copula undefined, raw `g:` ids |
| Dialogue content | 6 | a show catchphrase, a stranger's name used, few new words, an odd scene |
| Grammar quizzed by label, or vocab as grammar | 4 | いつも / とても as points, label-match questions |
| Answer shown elsewhere in the same part or drill | 2 | 表記 key in an earlier stem, drill key in an earlier stem |
| Ambiguous gaps | 2 | ている vs てください on a bare て stem, まで vs で |
| Bound items and sound changes | 2 | 分 / 週間 asked bare, 三杯 さんばい untaught |
| Overload and flooding | 2 | 20 new katakana in one stage, 107 kana cards due |
| Mock result copy | 2 | verdict headline, diagnostic plotted as a mock |
| Official-sample echo | 1 | the watch / time scene and its distractor sets |
| Credits | 1 | Wiktionary missing |
