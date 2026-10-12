# Quiz rules

Load when: changing quiz generation, distractors, answer checking, or lib quiz code. Why each rule exists: [archive/bug-history.md](archive/bug-history.md). Rules added on N4 are tagged `[N4+]`.

## Prompts and answers

- Glosses and meanings are English only. Japanese hints go in `usage` (lessons only). The catalog check rejects kana or kanji in gloss/meaning. `answerLeaks` runs in `makeQuestion` and `mondaiQuestions`.
- Placeholders never contain a sample answer.
- Every vocab and kanji item has an `accept` list: own wording, checked against JMdict senses. Normalise case, accents, articles, "to", plurals and UK/US spelling. Typos: 1 edit at ≥5 letters, 2 at ≥10, never onto another catalog meaning. A miss shows "Accepted answers" and offers "I was right".
- No `accept` entry equals the primary gloss of another taught item of the same pos family, at any level. `tests/english-answers.js` checks it; re-run when a level lands.
- Any pair where one item's accept holds the other's meaning never meets as answer and wrong option (`nearSynonyms`).
- The typed answer accepts `alt` partners and an `altSpell` list.
- Every JMdict reading of a spelling goes in `alsoRead`: accepted when typed, never used as a fake.
- Typed romaji becomes kana only when it names one spelling (`kanaSpellable`). ん before a vowel is shown as n'. ー is shown as a macron and typed as -.
- Another valid reading of the same spelling gets a neutral notice and a retry, not a miss. Same-word alternate readings (九 きゅう/く) are both accepted. Ambiguous spellings show a meaning hint. MC never offers another valid reading.
- A bound item (counter, suffix, prefix) is asked only in context, with ≥2 authored contexts. A miss names the sound change (三杯 さんばい).

## Distractors and options

- `pickDistractors`: taught items first, same level, pos, topic, script and length; sound and look-alike confusers. Never a second correct answer (shared sense word), never a duplicate option.
- A word option is rejected when any word written or read the same way shares the answer's sense (`sharesSense`). Kana display (`displayWord`) makes homophones collide.
- `NEAR_SYNONYMS` pairs never appear against each other. Extend the list per level.
- Reading MC fakes use `squareFakes`: two one-edit fakes at different places plus both edits together, so no option is the centre. Measure answer position and centre share over many seeded builds after any change.
- Options are distinct by displayed text. Kana distractors come only from kana already learned.
- `readingFakes` only for reading questions, never ゔ.
- Authored options carry furigana markup and render through `quizFurigana` (`optionParts`). `tests/mondai.js` asserts no option prints an untaught kanji without ruby.
- Authored mock distractors follow the `squareFakes` shape. Centre share ≤35%.
- `GAP_INTERCHANGEABLE` lists sibling families as exclusion groups (one-way cases in `GAP_ANSWER_BLOCKS`). No option set holds two of one group, tested over every gap stem. A point whose only confusables are its siblings gets no gap question (11 points at N5).
- `[N4+]` Adjectives join a quiz only from N4, on a unit that teaches a form point.

## Question types and composition

- Every question type has a renderer. The full playthrough test answers every type, right and wrong.
- The playthrough test fails any question whose question line is not rendered. After any quiz-layout change, play one question of every type in the browser.
- ★ reorder questions use authored chunks only. `star` slots are restricted where several orders are valid.
- Generated 文脈規定 rely on the English note shown, the only disambiguator. Mocks use authored items with exactly one fit and no note.
- Prep drills (no English on the real paper): the 文法1 gap pool skips points whose siblings share one slot (tense, polarity, mood, guess / certainty endings, て-endings, stem endings, amount and time words; `PREP_GAP_SKIP`). Generated 文脈規定 cannot be made single-fit for noun keys: the note waits behind a hint button and shows after the answer. To close this, author single-fit 文脈規定 items for the drill pool at N3 (N4 r3-r4 exam).
- From N4 every grammar question carries `explain` (pattern = meaning, built from the formation), so a miss says why (N4 r3 newbie).
- Conjugation is rule-based from item `pos`. ら抜き potentials are not accepted (decide per level).
- `[N4+]` `conjugate()` covers ば-form, たら-form, imperative, causative-passive and なくて-form; `conjugateAdj()` covers い and な adjectives. Extend `tests/conjugate.js` for each new column.
- Grammar is quizzed by its own point (gap, ★, conjugation) before falling back to the label match. Ratchet in `tests/quiz-variety.js`: ≥40% made.
- Kana stage quizzes stop at `KANA_QUIZ_MAX` (22). Single-kana review cards are capped at `KANA_DUE_MAX` (20); words are never capped.
- A prep drill drops a question whose key shows in another stem, or that reuses a sentence (`drillLeak`). The check does not scan passage text yet.
- A 表記 answer kanji never appears in an earlier stem of its part (`tests/mocks.js`).
- Mock stems hold no off-catalog word (`OFF_CATALOG` in `lib.js`), unless the sentence lists the word in `uses`.
- Mock verdict: `mockOutlook` names the mark that decides the verdict.

## Composition and measurement

- Quiz length is a maximum: few items gives a shorter quiz (min 8). An item appears ≤2 times and 3+ questions apart.
- Fewer than 15 taught candidates: widen with untaught same-level items.
- Device-local recent memory steers retakes to other forms.
- Measure max-per-item and quiz length over many builds after any composition change.
- Seed random in tests; run the suite 3× before merging.
