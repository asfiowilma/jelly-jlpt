# Vocab example sentences

Load when: giving a level's words their word-sheet example sentences, or checking them. Authoring rules for one slice live in the skill: [../../.claude/skills/vocab-example/SKILL.md](../../.claude/skills/vocab-example/SKILL.md). This file is the orchestrator's side: what they are, how the run goes, and what the N5 and N4 run (2026-10-14 to 15) taught.

## What they are

- Ordinary catalog sentences (`kind: 'sentence'`) appended to `data/<level>/sentences.js`, one block per slice headed `// ── Vocabulary examples, units uAAA-uBBB ──`. Nothing is added to the vocab entries.
- A sentence belongs to a word because the word's id is in its `uses`. `sentencesUsing(id)` in `lib.js` finds them; the lesson's word sheet shows them, and the same sentences feed that word's quiz questions once every item in `uses` is taught.
- Up to 3 per word, counting the sentences the level already has for it. Each has an English meaning.
- Prerequisites: the level's vocab catalog, its grammar sentences and the plan. In [build-n3.md](build-n3.md) this is step 10b.

## Process that worked

1. **Slice by units.** Walk the plan's units in order, take each unit's `vocab` ids at their first teach, and cut a slice every ~90 words (a slice ends on a unit boundary). Fold a tail under ~20 words into the slice before it. N5 made 8 slices, N4 7. One slice is about 100k tokens for one author.
2. **Brief per slice.** Level, unit range, the pasted list of vocab keys, worktree and branch, decisions file path, output block heading, a diff size stop (800 lines), commit rules, and the rules below under "Brief must say". Spawn a `level-author` (type `vocab-example`, sonnet) per slice. Slices touch the same file, so run them one after another, each from the newest main.
3. **Author.** The skill: every key gets `example (n)` or `skip: <reason>` in the decisions file, sentences Tatoeba first, own only from a named model.
4. **Spot check per slice** (orchestrator, before landing). Read the decisions file first, then sample: false skips of common words, English that does not match the Japanese, furigana, incomplete `uses`, grammar ahead of the unit. Run the three checks below.
5. **One correction round.** Send the findings back to the same agent once. Re-sample. In the run about half the slices needed it (7 of 15 by the state rows) and none failed twice. A second failure is a stop, not a third round.
6. **Gate and land.** Three checks clean for the new block, `node tools/build-sw.js`, full suite (`CLAUDE_PROJECT_DIR=$(pwd) node .claude/hooks/run-tests.js`), then rebase and fast-forward ([merge-and-gate](../../.claude/skills/merge-and-gate/SKILL.md)). Record the slice row (counts, skips by reason, no-fitting list) in the run's state file.

## Checks

The teaching-order test does not cover these sentences fully, so three repo tools do. Each reads `data/<level>/sentences.js` of the checkout it runs from, looks only at the vocab-example blocks, and exits 1 on a finding.

| Tool | Catches |
|---|---|
| `node tools/check-vocab-example-grammar.js --level n3` | a grammar id in `uses` taught after every word in the sentence |
| `node tools/check-vocab-example-own.js --level n3 --tatoeba <dir>` | an own sentence with no `tatoeba:<id>` model in `notes`, a model that does not exist, or a verbatim copy of its model |
| `node tools/check-vocab-example-sources.js --level n3 --tatoeba <dir>` | a Tatoeba entry whose jp, author, license, enId, en, enAuthor or enLicense differs from the source |

`<dir>` is the Tatoeba research folder: `pairs-jpn-eng.jsonl` and `raw/jpn_sentences_detailed.tsv` (see [source-data.md](source-data.md); on the owner's machine `.scratch/content-audit/research/data/tatoeba` in the main checkout, so pass an absolute path from a worktree).

State at the end of the run: N4 is clean on all three. N5 has 20 grammar flags in its first three blocks (written before the grammar check existed; most are a particle a few kana units early, three are real: `s:tatoeba:6010` ている, `s:own:n5-vx-doa-1` てください, `s:own:n5-vx-hashi-1` で) and one verbatim own sentence (`s:own:n5-vx-fooku-1` = Tatoeba 197208). These are open follow-ups, not a reason to ignore the tools.

## Brief must say

These were added to briefs mid-run after the same mistakes came back. Put them in the first brief.

- **Grammar is not relaxed.** Words and kanji may run ahead of the lessons (owner decision, see the skill); grammar may not. `tests/teaching-order.js` does not check grammar in word-sheet sentences, so run the grammar check. Plain forms (dictionary form, だ, た-form) are grammar, also in Tatoeba picks. Never drop a visible `g:` id from `uses` to silence it.
- **A rejected Tatoeba hit is still a model.** A hit that cannot ship (non-catalog word, later grammar, wrong spelling) can model an own sentence. "No fitting sentence" means no attested use of the sense at all, after a real search; name the rejected candidate ids in the decisions file. Skipping common words for this reason was the most common correction.
- **Own is never verbatim.** If a Tatoeba sentence fits as it is, ship it as Tatoeba with full attribution.
- **`enAuthor: null`**, the value, for an English sentence with no owner. The string `'null'` fails the sentence-credits test.
- **Tatoeba picks need a recorded author** (not `\N` in the export).
- **Count only same-level sentences** for the cap and for a "have N" skip. `sentencesUsing` also sees other levels.
- **Catalog spelling only.** The catalog check accepts a listed word only in its catalog spelling, so 片仮名 is written かたかな and a sentence with 下さい in kanji is dropped. Never leave a visible catalog word out of `uses` to pass the check.
- **`uses` traps.** A sentence with 彼女 also lists `v:彼|かれ`. この / その / あの and particles that are grammar points (`g:no`, `g:ni`, `g:mo`) are listed like on neighbouring entries.
- **Budget.** Decide skips fast (count first; skip words at 3 or non-sentence words without searching), then spend effort on words that need sentences. One N5 slice ran out and left 9 common words at 1 or 2.

## Rules and decisions

- **Cap 3**, plainest first, a second or third only for a new sense, form or partner. No word reached 3 in the run; most got one.
- **Skips are expected.** Expected skip rate: N4 ran about 10 to 15% (suffixes, counters, set phrases, grammar-point words, a few with no attested use). N5 ran about 40% because many words already had grammar sentences and whole units were numbers and dates. N3 vocab is mostly content words, so expect the N4 rate. Every skip has a reason in the decisions file.
- **Words not in the catalog** have no `uses` id, so `quizSentences` cannot hold the sentence back. They are not allowed until a code follow-up marks such sentences (for example an `intro: true` flag that `quizSentences`, `unitExamples` and `lessonExamples` skip). Until then the word goes under "no fitting sentence". One exception was allowed in the run: the name トム, as in many shipped Tatoeba sentences. Other proper nouns (ボストン) are out.
- **Kanji above the level.** A catalog word keeps its catalog spelling with furigana even when its kanji are above the level (牛乳, 紅茶, 鉛筆, 地震 in N5 and N4 sentences), because the catalog check needs that spelling. Other above-level kanji go in kana. Every kanji has furigana.
- **Furigana for whole-word readings: PROPOSED house rule, not yet confirmed by the owner.** A word whose reading does not split into its kanji's readings (the `special` entries of `tools/<level>-kanji-overrides.json`, jukujikun such as 今日, 部屋, 時計, 上手, 二人) takes one unsplit ruby: `[部屋|へや]`, `[上手|じょうず]`. Every other word is split per kanji: `[毎日|まい|にち]`, `[本当|ほん|とう]`. Why: `main` already does this in most places (部屋 13 unsplit to 4 split, 時計 7 to 1, 二人 23 to 1, 上手 11 to 7, 下手 7 to 1, 今年 6 to 1; 今日, 明日, 一人, 大人 always whole), it matches how `author-kanji.js` treats `special` words, and a split jukujikun ruby (`[部屋|へ|や]`) wrongly suggests each kanji has that reading. The split forms on main are in `data/n5/grammar.js` and both levels' `sentences.js`; until the owner confirms, new blocks use the unsplit form and existing entries stay as they are.
- **`verified: false`** on every sentence. Each rests on one source: Tatoeba copied with attribution and checked by the sources tool, or an own sentence modelled on one named Tatoeba sentence. No reading was checked against Jisho or JMdict in the run; a reviewer pass against Jisho is what would let them move to verified. Say so in `notes` per the skill.
- **Attribution.** Tatoeba sentences keep id, `author`, `license`, `enId`, `enAuthor`, `enLicense`, equal to the source. Own: `sources: ['own']`, `author: 'jelly-jlpt'`, `license: 'own'`, id `s:own:<level>-vx-<slug>-<n>`, model in `notes` as `tatoeba:<id>`. Tatoeba is already in `CREDITS`; any other source is named in the author's return message and added by the orchestrator.

## N5 and N4 numbers

| | N5 | N4 |
|---|---|---|
| Words with an example | ~410 | ~588 |
| Sentences added (Tatoeba / own) | 417 (240 / 177) | 741 (448 / 293) |
| Slices needing a correction round | 5 of 8 | 2 of 7 |

Words with no fitting sentence after a real search (good retry candidates once non-catalog words are allowed): N5 しょうゆ, カレンダー, 家庭, 伯母さん, 方, たばこ, 先, 飲み物, 一月 (ひとつき), 丈夫, うるさい, 登る, 財布, ああ, ペット, 留学生, さ来年, おととし, 二十歳; N4 ハンバーグ, すると, または, パート, だす, おわる, 冷房, 昼休み, 港, 舟, 乗り物, 味噌, 漬ける, 割合, 押し入れ, スクリーン, ごらんになる, 盛ん. Left at 1 or 2 by budget (N5): 分かる, 夏休み, 写真, 買う, 所, いくら, 楽しい, 広い, 冷たい, 果物, 開く, 歌う, 授業, まだ, 漢字, 覚える, 教える, 朝御飯.
