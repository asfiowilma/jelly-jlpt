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
- **Headwords use standard okurigana** (終わる, not the ref list's 終る; same for 曲がる).
  Check every ref-list spelling against JMdict's preferred form. Other readings of one
  spelling (明日 あす) go in `alsoRead`, JMdict-checked, so typed and MC answers accept them.

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
- **Teaching order** (ADR 0002): quiz and lesson-example sentences use only taught items
  (`quizSentences`, `untaughtCount` over `uses`; an `alt` spelling counts as taught). On N5,
  144 of 226 lesson sentence questions used a later-taught item; filtering plus 59 own
  sentences took it to 0. `tests/teaching-order.js` is a ratchet: zero leaks, empty exception list.

## 4. Kanji

- Choose readings by teaching need: the readings this level's vocab actually uses, plus at
  most 2 extras. Don't dump KANJIDIC.
- Whole-word readings (今日, 大人, 一人, お父さん…) don't add a reading to the kanji, but
  stay in its word list.
- The typed kanji reading accepts on + kun + `extra` + bare kun stems (長 → なが). On N5, 75 of
  the 215 listed readings were rejected before.
- Stroke counts need two agreeing sources (KANJIDIC + Wiktionary/Unihan).
- Add KanjiVG SVGs for every new kanji (CC BY-SA 3.0, separate files). The loader strips the
  `<?xml?>`/DOCTYPE header, which otherwise shows a stray `]>`.

## 5. Plan

- **A from-zero course needs kana units first.** Each kana unit also teaches 2–5 real words
  spelled in its own script (moved out of their lessons, so they get cards early), plus
  read-only practice words. Every word may use only kana already taught (a test enforces
  this). Keep the こそあど series, particles, bound items and words a grammar point rests on
  in their lessons. Kana quizzes read mostly **words** (any verified word of the level spelled
  with kana learned so far, read only, never asked for its meaning), single kana only for a new
  kana no word holds; passed with ≥85% on reading and ≥80% on the taught words' meanings.
- **Single-sound kana questions felt like flashcards** (ticket 44). Check per stage how many
  new kana no level word holds: on N5, にゃ–りょ, katakana yōon and the first katakana rows
  have almost no words. Reading-only words from higher Tanos lists (N4/N3, reading checked
  against JMdict, `tools/build-read-words.js`) fill them in; N5 words always come first.
- **Old-kana filler words** (owner, Q47): a kana stage's words must each hold one of that
  stage's new kana or marks; a review is exempt. Run the per-stage word/single count after
  any change to the kana plan or word lists.
- **Load guide per lesson** (N5: about 8 vocab, about 2 kanji, 1 grammar; ±25%). Vocab-only
  lessons are fine when grammar runs out.
- **A kanji appears only at or after the first lesson teaching a word that uses it.**
  The same holds for vocab: a word with a kanji not taught yet (隣, 家, 犬: Tanos lists the word, the
  kanji is above level) shows its kana only (`displayWord`), in lessons, review cards and quiz
  prompts, and gets no kanji→reading question. It keeps meaning and type-the-Japanese questions.
- **Write own `s:own:` sentences for the early grammar units from the start.** Tatoeba has
  almost nothing that uses only the first few dozen words; use kana while a kanji is untaught
  (がっこう before 校). Don't reorder the plan to fit Tatoeba (ADR 0002).
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

## 7. Passages, listening, mocks

- Own passages and listening are `verified:true` only if every `uses` item is verified and
  the checks pass: every kanji at or below the level and inside ruby; every ruby reading
  backed by a used word, a name or the kanji's readings; every katakana word in `uses` or
  `names`. A kana-only word missing from `uses` can't be detected (there's no tokenizer), so
  maintain `uses` by hand.
- Listening options aren't shuffled at runtime (scripts refer to 1–4), so authored order sets
  the key. On N5, option 1 was the key in 16 of 24 quick-response items; the options were
  reordered so keys spread. `tests/listening.js` holds every slot ≤45% per format and per mock,
  and the key the single longest option in ≤40%. Author options of similar length from the
  start: a length can't change without new clips. Quick-response and utterance options are
  audio only until answered.
- Mocks are fixed, follow the official mondai counts (`.scratch/roadmap/research/jlpt-scoring.md`),
  share no items with each other or with reviews, and show an estimated score labelled as an
  estimate. The linear estimate is optimistic against real scaled scores; the result copy says so.
- **No answer string inside another question of the same mock** (電話 answered in one item,
  printed in another stem). `tests/mocks.js` checks stems and passages.
- **Mock gaps have exactly one grammatical answer with no English note** (N5 mock-1 had けど
  and から both fit). Each full mock carries one katakana 表記 item.
- Never copy jlpt.jp items or audio. Link to the official samples. **Don't follow an official
  sample's skeleton either**: a self-introduction 文章 tracking もんだい3's structure was a
  structural copy risk and got rewritten.
- **Audio** (`tools/audio/README.md`):
  - Render from the kana reading (`say`), never the kanji text: the TTS guessed 何人, 四日/八日.
    The clipKey hashes the spoken text.
  - The test hashes the live `listeningScript()` output, not an exported file: a stale clip
    contradicted its transcript while a tracks.json check passed.
  - CSP needs `media-src 'self' blob:`. Without it no clip played over http(s), and the Web
    Speech fallback hid it. Verify playback over http(s) in a real browser, not file://.
  - The fallback must be visible in mocks (a notice), never silent.
  - Particle は/へ in `say` can be spoken ha/he (母は先生です came out ははは): write `[は|わ]` ruby for the
    clip; the shown text stays は. The catalog check allows only that pair. Check particle lines when
    listening to a render.
  - Later levels reuse the narrator いち, に, さん clips (same clipKey, already in `have`); don't re-render them.

## 7b. Exam guide voice

The guide on prep and mock units (`unit.guide`, `tools/author-plan.js`) speaks like a senpai
coaching a kouhai the week before the exam: warm, direct, a little dry.

- At most one light joke per question type, in the `trap` or `tip` line, never in `ask`, which
  stays literal and exact. The joke is about the learner's situation (panic, rushing,
  overthinking), never at the learner and never at Japanese. The tip must still work without it.
  Leave about a third of the lines plain.
- No emoji, no em dashes (use a period, comma or colon), no dated slang.
- Facts, numbers and Japanese examples never change for the sake of a joke.
- Sentences of about 8 to 18 words, sentence case, plain English a 7th grader follows.
- One `**highlight**` per trap and one in `time`.
- Every kanji in a guide string sits in a `[漢字|かんじ]` block. Check each reading against the
  catalog or a dictionary. Titles stay plain text with no Japanese.

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
- **Run an independent multi-domain audit before each level release** (vocab/kanji,
  grammar/sentences, exam/reading, listening/audio, legal). The N5 audit found 5 release
  blockers the build process had missed (`.scratch/n5-audit/SYNTHESIS.md`).
- **Measure over many seeded builds**, not one quiz: leak, key-spread and centre-option
  rates only show up in aggregate.
- **Save the repro scripts** in the repo or `.scratch/<slug>/`, so the fix check reruns the
  same measurement. N5's lived in a session scratchpad and were lost.

## 9. Licences and release

- Show each Tatoeba sentence's author (Settings lists them all); one generic credit line
  doesn't meet CC BY.
- Credit EDRDG whenever `jmdict` appears in `sources`; credit Tanos with its author and a
  licence link. Precache the licence files so Settings links work offline.
- State the content licence: code MIT, own content CC BY 4.0.
- Japanese UI strings stay hidden (`UI_JA_READY`) until a native speaker reviews them.
- The README is part of the release: update it before the level ships.
