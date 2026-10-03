# Level playbook: lessons learned building N5

Read this before building any new level (N4, N3, …). Each item is something that went wrong
or nearly went wrong on N5, with the rule that prevents it next time. Tickets referenced live
in `.scratch/content-audit/issues/`.

## 1. Source data

- **Tanos list pages are often down** (HTTP 500). Fetch Wayback snapshots, and record the
  snapshot dates. The Tanos grammar PDFs stayed live.
- **The lists contain errors.** On N5 we found:
  - 明い (should be 明るい)
  - おじいさん filed under 伯父/叔父
  - 半分 glossed "half minute"
  - a truncated ラジオカセ
  - する inside readings
  - ～ inside readings
  - N4 `～のようてほしい`, which is two points (～のよう / ～てほしい)

  Fix them in `tools/build-ref.js` (`VOCAB_FIXES`), never by hand in generated files, and log
  each fix.
- **Count independence honestly.**
  - elzup/jlpt-word-list is derived from Tanos.
  - kanji-data takes its levels from Tanos.
  - Jisho kanji pages and kanjiapi.dev both serve KANJIDIC.

  None of these is a second source for what it copied. On N5 the independent pairs were
  Tanos + JMdict (vocab) and KANJIDIC + Wiktionary (kanji).
- **Strip WaniKani fields** from kanji-data. They're proprietary.
- **Words listed at several levels** go to their lowest level. **Cross-source level
  conflicts:** Tanos wins.
- **Kana and kanji duplicate spellings** (いす/椅子, あびる/浴びる): teach one card. Prefer
  the kana form when the kanji is above level. Mark the other with `alt`.
- **Verb class (godan vs ichidan) comes from JMdict pos tags only.** Never guess from the
  ending: 帰る, 入る, 切る, 要る, 知る and 走る are godan.

## 2. Grammar inventory

- **The Tanos grammar list is patterns only, so it misses the conjugation forms.** The N5
  catalog shipped without ます / ません / ました, dictionary form, て / ない / た forms or the
  copula past (ticket 36). Add form points explicitly, and place them before every pattern
  built on them.
- **The Tanos list is thin:** 40 points at N5, against 84 at JLPT Sensei. Use JLPT Sensei
  **names only** as a gap checklist. A gap counts only when a second source confirms its
  level (Bunpro, Genki index, japanesetest4you). Never copy their text.
- **Some extras are really vocabulary** (いつも, とても). Avoid padding the grammar catalog
  with them.

## 3. Example sentences (Tatoeba)

- **Candidate matching is loose; check every pick by hand.** False matches seen on N5:

  | Looking for | Matched by mistake |
  |---|---|
  | ので | の + です |
  | いる "exist" | いる "need" (要る) |
  | 〜たい | みたい |
  | でしょう | だろう |
  | 前に "before" | 前に "in front of" |
  | から "because" | から "from" |
  | まで | までに |
  | てもいい | とても / どうでもいい |
  | ましょう | どうしましょう |
  | 〜ている | で + いる |
  | よ | あばよ |
  | sentence-final の | — |

- **Unreviewed furigana can be wrong** (行った read as おこなった, 二人 as ににん). Verify
  every reading.
- **Attribution:** skip sentences with no recorded author. Prefer native authors, and pick
  the most accurate English translation among the alternatives.
- **Tatoeba audio is not a listening source.** Only 27 Japanese clips are CC BY.

## 4. Kanji

- Choose readings by teaching need: the readings this level's vocab actually uses, plus at
  most 2 extras. Don't dump KANJIDIC.
- Whole-word readings (今日, 大人, 一人, お父さん…) don't add a reading to the kanji, but
  stay in its word list.
- Stroke counts need two agreeing sources (KANJIDIC + Wiktionary/Unihan).
- Add KanjiVG SVGs for every new kanji (CC BY-SA 3.0, separate files). The loader strips the
  `<?xml?>`/DOCTYPE header, which otherwise shows a stray `]>`.

## 5. Plan

- **A from-zero course needs kana units first.** Each kana unit also teaches 2–5 real words
  spelled in its own script (moved out of their lessons, so they get cards early), plus
  read-only practice words. Every word may use only kana already taught (a test enforces
  this). Keep the こそあど series, particles, bound items and words a grammar point rests on
  in their lessons. Kana quizzes are ~60% characters / ~40% words, passed with ≥90% on
  characters and ≥80% on words.
- **Load guide per lesson** (N5: about 8 vocab, about 2 kanji, 1 grammar; ±25%). Vocab-only
  lessons are fine when grammar runs out.
- **A kanji appears only at or after the first lesson teaching a word that uses it.**
- **Reviews** come every ≤6 lessons. A review introduces nothing new.
- **Review passages and listening** must use only what has been taught by that review. Late
  framing lines like 男の人と女の人が, or じゃあ / でも, push most task/point listening into
  test prep. That's expected.
- **The plan is generated** from the outline in `tools/author-plan.js`. Edit the outline,
  never `plan.js`. Once a level ships, never renumber its unit ids.

## 6. Quiz questions: the bugs we shipped and the rules that stop them

| Bug seen on N5 | Rule |
|---|---|
| **Answer shown in the prompt.** 702 leaks in 20 builds: "Which word means 'Mr., Ms. (～さん)'?" | Glosses and meanings are English only; Japanese hints go in `usage` (lessons only). The catalog check rejects kana/kanji in gloss/meaning. `answerLeaks` runs in `makeQuestion` and `mondaiQuestions`; `tests/quiz-leaks.js` is an independent checker. |
| **Placeholder text showing an answer** ("e.g. うまれる", "ひらがな…" for 平仮名, "にほんご…") | Placeholders never contain a sample answer. |
| **Bound items asked alone** ("Type the Japanese for 'person from'" → じん) | Suffixes, prefixes and counters are asked only in context: host + blank + English, or the reading of the compound. ≥2 authored contexts per item. Check counter sound changes (三杯 さんばい, 一杯 いっぱい, 三階 さんがい/さんかい); JMdict lacks most number + counter compounds. |
| **Another valid reading marked wrong** (人 → にん when じん was asked) | WaniKani rule: another reading of the same spelling or kanji → neutral notice + retry, not a miss. Same-word alternate readings (九 きゅう/く) are both accepted. Ambiguous spellings show a meaning hint. MC never offers another valid reading. |
| **Fair English answers rejected** ("overseas" for 外国, "big brother", "ballpoint") | Every vocab/kanji item gets an `accept` list (own wording, checked against JMdict senses). Normalise case, accents, articles, "to", plurals and UK/US spelling. Allow typos (1 edit at ≥5 letters, 2 at ≥10) but never onto another catalog meaning. Show "Accepted answers" on a miss; offer "I was right". **When authoring a gloss, ask: what would a learner naturally type?** Include the short form (ballpoint, sister) and the common synonym. |
| **Distractors too easy** (random words from every level) | `pickDistractors`: taught items first, same level/pos/topic/script/length, sound and look-alike confusers. Never a second correct answer (shared sense word) and never a duplicate option. |
| **Kana options duplicated** (ず/づ both "zu") | Options are distinct by displayed text. |
| **Fake readings rendering oddly** (ゔ) | `readingFakes` only for reading questions, and no ゔ. |
| **Placeholder patterns as options** ("Review & Practice") | No placeholder text in the catalog; the check enforces it. |
| **Interchangeable answers in one blank** (から/ので, けど/けれども, ね/よ) | `GAP_INTERCHANGEABLE`: never both in one question. |
| **Conjugation "answer" was the dictionary form** | Rule-based `conjugate()` driven by item `pos`. ら抜き potentials not accepted (decide per level). |
| **Reorder split words in half** (信頼で\|きる) | ★ questions use authored chunks only, with `star` slots restricted where several orders are valid. |
| **文脈規定 with more than one fitting word** | Generated ones rely on the English shown. Mocks use authored items with exactly one fit. |
| **Generator types with no renderer crashed the quiz** | Every type has a renderer. The full playthrough test answers every type, right and wrong. |
| **Flaky tests from randomness** | Seed random in tests, and run the suite 3× before merging. |

## 7. Passages, listening, mocks

- Own passages and listening are `verified:true` only if every `uses` item is verified and
  the checks pass: every kanji at or below the level and inside ruby; every ruby reading
  backed by a used word, a name or the kanji's readings; every katakana word in `uses` or
  `names`. A kana-only word missing from `uses` can't be detected (there's no tokenizer), so
  maintain `uses` by hand.
- Listening options aren't shuffled (scripts refer to 1–4). Quick-response and utterance
  options are audio only until answered.
- Mocks are fixed, follow the official mondai counts (`.scratch/roadmap/research/jlpt-scoring.md`),
  share no items with each other or with reviews, and show an estimated score labelled as an
  estimate.
- Never copy jlpt.jp items or audio. Link to the official samples.

## 8. Process

- **The owner can't check Japanese.** Every fact needs ≥2 sources plus a machine check, and
  the lead spot-checks samples from every agent report before merging.
- **Lead spot-checks of samples caught a content gap:** the missing conjugation forms (ticket
  36). Reviewing samples is mandatory.
- **Agents in worktrees:**
  - Main moves while they work, so land by rebasing in a temporary worktree, then
    fast-forward.
  - The owner's uncommitted edits block the merge: ask the owner to commit.
  - Delete the branch after landing. Windows locks worktree folders, so prune and delete
    leftovers.
  - Run tests with `CLAUDE_PROJECT_DIR=$(pwd)` inside a worktree.
- **The owner's real progress lives in the browser** (PouchDB on file://). For browser
  checks, use a temporary DB name and don't commit it. Never complete units in the owner's
  data.
- **Long agent runs can die** (machine sleep or shutdown). Commit WIP early as 🚧, then
  rebase and squash when resuming.
- **Keep the map current:** mark a ticket claimed in the ticket file and in `map.md` before
  starting it.
