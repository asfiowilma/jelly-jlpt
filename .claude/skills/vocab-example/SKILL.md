---
name: vocab-example
description: Vocabulary example sentences for jelly-jlpt. Use when authoring up to three example sentences (Japanese, furigana, English meaning) for the common content words of one level's vocab, added to data/<level>/sentences.js with the vocab id in `uses`. Sets the write ceiling for the level-author vocab-example type. Not for grammar sentences, dialogues, mondai, or the vocab entries themselves.
model: sonnet
---

# Vocab example (level-author)

Gives each common word of one level up to three short example sentences, each with its English meaning. The lesson's word sheet shows them. Words that do not appear in everyday sentences get none.

The sentences are ordinary catalog sentences (`kind: 'sentence'`) in `data/<level>/sentences.js`. A sentence belongs to a word because the word's id is in its `uses`. Nothing is added to the vocab entries. The app already finds them with `sentencesUsing(id)` in `lib.js`, so the same sentences also feed that word's quiz questions.

## Sources to read (only these)

1. `CLAUDE.md`: hard constraints, content rules, attribution, commit rules.
2. `docs/playbook/index.md`, then [vocab-examples.md](../../../docs/playbook/vocab-examples.md) (lessons from the N5 and N4 run, the furigana rule, the checks), [grammar-sentences.md](../../../docs/playbook/grammar-sentences.md) (Example sentences) and [tatoeba-hints.md](../../../docs/playbook/tatoeba-hints.md).
3. The header of `data/<level>/sentences.js` and two of its entries, one Tatoeba and one own, for the exact field shape.
4. `data/<level>/vocab.js` for the keys in the brief (read only, generated), and `data/<level>/plan.js` for the unit each word is taught in.
5. The brief given by the orchestrator: level, unit range, output paths.

Do not read review reports, `STATE.md` or `known-issues.md`.

## Write ceiling

- Allowed to edit: `data/<level>/sentences.js` (append a block headed `// ── Vocabulary examples, units A-B ──`; never change an existing entry), and the decisions file the brief names (default `.scratch/<level>-launch/vocab-examples-<range>.md`).
- Allowed to run: the validator the brief names, `tests/teaching-order.js`, the three checks `node tools/check-vocab-example-grammar.js --level <level>`, `node tools/check-vocab-example-own.js --level <level> --tatoeba <dir>` and `node tools/check-vocab-example-sources.js --level <level> --tatoeba <dir>` (the brief gives `<dir>`; each must report nothing for your block), `node tools/build-sw.js`, and the test runner.
- Not allowed: `data/<level>/vocab.js` and the other generated files, `tools/*-vocab-overrides.json`, grammar items, `CREDITS` (name the new source in your return message), `sw.js` by hand.

## Step 1: decide which words get examples

Every vocab key in the brief ends up in the decisions file as `example` or `skip` with a one-line reason. No word stays silent.

Give examples to common words that people use inside ordinary sentences: nouns, verbs, い- and な-adjectives, adverbs, and conjunctions a learner will meet again.

Skipping is a normal, expected result, not a failure. Never write a sentence just to fill a slot. A contrived sentence is worse than none, and a word with no example is the correct outcome when the word does not live inside sentences. The test: would a native speaker say this word inside a sentence with other content? If the honest answer is "it stands alone" (はい, いいえ, ええ, うん, いや, あのう, ええと, ありがとう, すみません, おはよう), skip it.

Skip, with the reason named:

- interjections, replies, greetings and set phrases (`pos` interj or expression; はい, いいえ, ええ, おはよう, どうも, ええと)
- particles and anything the grammar notes already teach as a point
- numbers, counters, suffixes and prefixes (their `contexts` already show use)
- proper nouns and one-off place or culture words
- words so rare or so tied to one phrase that a sentence would only repeat the phrase
- words that already have three sentences in `sentences.js` (count them with `sentencesUsing`)

When unsure, skip and say why. A missing example is cheap to add later; a weak one teaches the wrong thing.

Do not invent to avoid a skip. If a word qualifies but no natural sentence fits the rules and the sources, list it under "no fitting sentence" in the return message instead of stretching the rules or making up a thin sentence. The same goes for the sentence count: one real sentence beats three padded ones.

## Step 2: write one to three sentences per word

- **At most 3.** One good sentence is enough. Add a second or third only when it shows something the first does not: a different sense of the gloss (ふつう: ordinary, usually, the local train), a different form (dictionary, ます, ない, て), or a different partner word. Never three near-copies. Count existing sentences against the cap of 3.
- **Order** from plainest to richest. The first sentence is the simplest natural use.
- **Length**: one clause, about 8 to 25 characters. Natural spoken or written Japanese, not textbook filler ("This is a pen").
- **The target word appears in a visible form** and carries the sense the lesson teaches. Check the gloss: a sentence that uses a different sense of a homograph does not count.
- **Teaching order, relaxed for these sentences (owner decision).** ADR 0002 keeps quiz questions and grammar examples to taught items. These sentences are word-sheet examples, and the owner wants them to introduce learners to common words and kanji the lessons do not cover yet. So a sentence MAY contain words and kanji taught later or never, as long as: every kanji has furigana (the `furigana` field covers every kanji), every kanji is at or below the course level (kanji above it go in kana, except inside a catalog word, which keeps its catalog spelling with furigana: 牛乳, 紅茶), and the extra words are common and level-appropriate, not rare. Do not use this to make a sentence harder than it needs to be; the target word stays the point.
  - Still list every catalog word and kanji in `uses`, taught or not. That is what keeps these sentences out of quiz questions and grammar boxes (`quizSentences` and `unitExamples` drop any sentence with an untaught `uses` item). Never leave an item out of `uses` to hide it.
  - A word that is NOT in the catalog has no `uses` id, so the existing code cannot hold it back from quizzes. Until the follow-up that marks such sentences (see the brief) has landed, do not use non-catalog words: list the word under "no fitting sentence" instead.
  - `tests/teaching-order.js` must still pass. Run it. If a vocab sentence with an untaught item makes it fail, stop and report; do not edit the test.
- **Grammar**: only forms and patterns taught by that unit or earlier. No new grammar to carry the word. (The relaxation above covers words and kanji only.) `tests/teaching-order.js` does not check this; `tools/check-vocab-example-grammar.js` does.
- **Furigana**: follow the whole-word rule in [vocab-examples.md](../../../docs/playbook/vocab-examples.md) (jukujikun one unsplit ruby, other words split per kanji).
- **English meaning**: natural, accurate, our own wording of what the sentence says, not a word-for-word gloss. Keep it short. It must be the meaning of that Japanese sentence, not of the lesson gloss.
- Tatoeba first. Pick the most natural Japanese and the most accurate English among the alternatives. Own sentences only when no Tatoeba sentence fits, and only under the own-sentence rules below. See [grammar-sentences.md](../../../docs/playbook/grammar-sentences.md) for the picks and checks.

## Step 3: fields

Same shape as the neighbouring entries.

- Tatoeba: `id`, `jp`, `reading`, `en`, `furigana` (ruby on every kanji), `author`, `license`, `enId`, `enAuthor`, `enLicense`, `sources`. Text and all six attribution fields equal the source file. Skip sentences with no recorded author.
- Own: `sources: ['own']`, `author: 'jelly-jlpt'`, `license: 'own'`. Id like `s:own:<level>-vx-<slug>-<n>` (never reuse an id).
- **Own-sentence rules.** An own sentence is never made up from memory. It must be modelled on an attested use of that sense: a Tatoeba sentence or a Jisho/JMdict example. Name the model (id or entry) in the decisions file. Check the readings and furigana against Jisho/JMdict. A sentence resting on one source gets `verified: false` with the reason in `notes`. If no attested model exists, the word gets no example: that is the intended result, not a failure. The examples are optional in the app, so coverage follows what can be sourced, never a target number.
- `uses`: complete. The target vocab id, every other catalog word (`v:`), every kanji (`k:`), every form id whose token is visible (`g:te-form`, `g:nai-form`, `g:potential`, and so on). Missing entries hide leaks from the teaching-order test.
- `verified: false` for a single-source sentence, as the existing entries do. A reading you could not confirm gets `verified: false` and the reason in a note.
- Readings: check each against Jisho or JMdict. Unreviewed Tatoeba furigana can be wrong (行った read as おこなった).

## Rules

1. Japanese facts come from sources, never from memory alone. Do not ask the owner Japanese questions.
2. Never copy text from jlpt.jp workbooks, JLPT Sensei or NHK Web Easy.
3. No bulk EDRDG data. JMdict is for checking, not copying.
4. Any new third-party source is named in the return message; the orchestrator adds the `CREDITS` line.
5. Ids are stable. Never reuse or renumber.

## Decisions file

One line per word: `<vocab id> | example (n) | skip: <reason>`. For each own sentence add its model: `<sentence id> | model: <Tatoeba id or Jisho entry>`. The reviewer reads this file first, so a wrong skip is easy to see.

## Stop and report (do not guess)

- A word needs a sentence but nothing natural fits, even with the relaxed word and kanji rule. List it; do not stretch the grammar rule or make up a thin sentence.
- A reading or sense cannot be confirmed from two sources and a sentence depends on it.
- The brief asks for a file outside the write ceiling.
- Validator or tests still fail after one fix attempt.

## Output (return message)

- Branch, commit hash.
- Counts: words with examples, skipped (by reason), sentences added (Tatoeba / own), words capped at 3.
- `verified: false` list with reasons.
- Words with no fitting sentence.
- New sources to credit.
- Tests: pass/fail, count.
- `done`, or stopped at step N with reason.
