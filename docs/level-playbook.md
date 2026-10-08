# Level playbook: lessons learned building N5 and N4

Read this before building any new level (N3, N2, …). Each item is something that went wrong
or nearly went wrong, with the rule that prevents it next time. Sections 1 to 9 hold the N5
lessons, each followed by what N4 added. Section 10 compares the exam formats per level, and
section 11 lists the exact steps for building N3.

Tickets and working files referenced here are gitignored: N5 lives in `.scratch/content-audit/issues/`,
N4 in `.scratch/n4-launch/`. The committed authoring notes are `tools/n5-grammar-notes.md`,
`tools/n4-grammar-notes.md` and `tools/n4-exam-notes.md`. This file must work without the scratch folders.

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

### N4 additions

- **The N4 list had more errors than N5.** All fixed in `build-ref.js`, each with a comment:
  - elzup swapped the word and reading columns on some rows (嘘, 頂く, 一杯, 格好, お陰, 嬉しい had
    the kana in the word column). `build-ref.js` now detects a reading that holds the kanji and
    swaps it back; あいさつする|挨拶 also had する glued on.
  - Tanos old okurigana on seven verbs: 上る (あがる), 集る, 起す, 落る, 落す, 決る, 下る (さがる).
    The standard spelling goes first as `standard/old` (上がる/上る), like N5's 終わる/終る. Watch
    for spellings that are a different word on their own: 上る is normally のぼる, 下る is くだる.
  - 楽む is a typo, not a spelling (→ 楽しむ).
  - `・する` rows (けんか・する, 遠慮|えんりょ・する) and readings with する glued on: list the noun.
    The generic rule strips する from a reading when the word does not end in する.
  - `・` also separates two readings (明日|あす・あした) and marks an optional prefix (お・金持ち).
  - elzup repeats a Tanos row once its variants are read (お金持ち, けれど; けれども, the する
    forms of 故障, 遠慮, 入院 …). Grammar patterns filed as words (～(て) しまう, ～(に) よると).
    These go in `VOCAB_SKIP` with the reason.
- **Lowest level wins, mechanically.** `build-ref.js` leaves out any entry already on a lower
  level's ref, so build the levels from N5 up in one command (`N5 N4 N3`). At N4 this dropped
  明日, そう and 目 (713 rows became 683 entries).
- **Vocab overrides were authored in 4 parallel parts** from one brief: each author got a key
  slice (`keys-<n>.txt`) and wrote `part-<n>.json` (`items` + `skip`), merged by the orchestrator
  into `tools/<lvl>-vocab-overrides.json`. The brief that worked:
  - Facts from the cached JMdict (Jisho) responses only; fetch and save any missing key (≤1 request/s).
  - The gloss must share a content word with a JMdict sense, or the item won't verify.
  - Gloss, accept, usage, tip, notes, `alt`, `alsoRead`, `contexts` rules as in `tools/author-vocab.js`'s header.
  - Bound items (suffix, prefix, counter, words that only occur bound: ～目, ～製, 倍) need ≥2 `contexts`
    with the sound changes checked.
  - New tags allowed (work, society, travel, feelings, health …), consistent inside a part.
  - Unsure → a `notes` starting with `UNSURE:`; the orchestrator reads every one and audits every `skip`.
- **Cross-part and cross-level collisions are the merge risk.** No `accept` entry may equal the
  primary gloss of another taught item of the same pos family, **at any level**: teaching N4 made
  58 N5 accepts collide with N4 glosses (御飯 "rice" vs 米, 声 "sound" vs 音, そして "then" vs すると),
  and a later pass trimmed 37 more N5 and 95 N4 entries (132). Parallel authors can't see each other's
  glosses, so run `tests/english-answers.js` right after the merge, and again when the next level lands.
- N4 result: 686 items, 684 verified (あ and うん have no pos on Jisho).

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

### N4 additions

- **Inventory method** (`tools/n4-grammar-notes.md` has the per-point record):
  1. The 50 Tanos names are must-cover. Each entry's `ref` spells the Tanos name exactly as in
     `tools/ref/<lvl>.json`; one entry may answer two names (～よう / ～おう, ～のような / ～のように).
  2. JLPT Sensei names (130 at N4) are the gap checklist. Verdicts: CONFIRMED when Bunpro,
     japanesetest4you or Genki II puts it at the level; DISPUTED (Tanos files it higher) → it waits
     for that level; UNCONFIRMED or really a word → dropped.
  3. Form points the patterns rest on, as their own entries: potential, imperative, prohibitive な,
     noun-modifying clauses, adjective/noun て-form, なくて, ていた, plus six basic keigo entries.
  4. Order in teaching blocks (14 at N4), each form before every pattern built on it.
- **Ship what the sources support, not a round number.** The first estimate was ~110; the honest
  count was 94 core + 2 optional = **96**. Reaching 110 meant splitting entries (のような / のように,
  始める / 終わる / 続ける / 出す), which is padding.
- **Read ambiguous Tanos names against the other sources.** Tanos's bare ～られる became the
  passive (its `ref`), with the potential a separate `offList` entry. The garbled ～のようてほしい is
  ～てほしい (three sources agree). Tanos's ～かどうか was in no teaching block; part B caught it only
  by checking coverage of every Tanos name at the end. Always run that check.
- **Every inflected point gets an `hl`** (regex sources; the first capture group is marked). Particles
  and nouns don't. Test each against the point's own examples (`dialogueGrammarRes` in `lib.js`).
  N5 shipped `hl`s that missed the polite forms of their own examples (たことがあります, なりません).
- **`conjForm` on every form point**, and the form must exist in `CONJ_FORMS`. N4 added to
  `conjugate()`: ば-form, たら-form, imperative, causative-passive and なくて-form, plus
  `conjugateAdj()` for い / な adjectives (くて / で, ければ / なら …). New forms are appended to
  `CONJ_FORMS` so the existing indexes hold; adjectives join a quiz only from N4 on, on a unit that
  teaches a form point. Extend `tests/conjugate.js` for every new column.
- **Causative-passive standard:** godan verbs take the short 〜される (飲まされる), except す-verbs
  (話させられる); ichidan, する and 来る take the long させられる form. It is not just causative +
  passive stacked.
- **Tanos level beats a textbook level, but say so.** 〜始める is Tanos N3 yet confirmed N4 by Bunpro
  and japanesetest4you: shipped with the Tanos level in `notes`. ことになる, ようになる, らしい, まま and
  たばかり stay at N3.

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

### N4 additions

- **`uses` must be complete, form ids included.** This was the top finding of the N5 audit: the
  filter can only hide what `uses` names. Sentences showed 働いてる, 食べなかった, 話した or より before
  those were taught, and the tests stayed green. List every grammar id the sentence exemplifies,
  **every form it relies on** (`g:te-form`, `g:ta-form`, `g:nai-form`, `g:te-iru`, `g:potential`,
  `g:ba` …), every kanji (`k:`) and every content word (`v:`, exact catalog key). A test now
  checks that N5 sentences list the て / た / ない form they show.
- **Words outside the catalog count as untaught.** 彼, 親切, 象, 動物園 in an N5 example can't be
  listed in `uses`, so no filter saw them. Prefer sentences whose every word is in the catalog of
  this level or lower; the N5 fix replaced them with own sentences.
- **Two authors, one brief, one validator.** N4 split the 14 blocks between two authors (A = 1-7,
  B = 8-14). Each wrote `grammar-<X>.js`, `sentences-<X>.js` and notes. B's validator loaded A's
  files first so a repeated id failed the load. The validator checked: ids unique across levels;
  every `examples` / `uses` id exists; furigana ↔ jp ↔ reading agree; no kanji outside ruby, every
  kanji at or below the level; chunks concatenate and don't cut ruby; every `hl` matches ≥1 example;
  the catalog's own surface rule (`surfaceMatch` in `tests/catalog-checks.js`) finds every listed id;
  Tatoeba text and all six attribution fields equal the source file. Zero errors before handing in.
- **The surface rule decides what `uses` can hold.** A form id is listed only where its token is
  visible (`g:te-iru` isn't on contracted 〜てる, `v:する` isn't on すれば). Write patterns so the
  rule finds them in every example.
- **The kanji rule cuts many natural sentences.** At N4, 合 (場合), 必 / 要 (必要), 降, 回, 寝, 番,
  全 / 然, 頃, 召, 申, 参 are not on the N5/N4 lists, so own sentences write those words in kana.
- **Own sentences for each block's first points**, using only N5 words plus the point: always
  teachable early. N4: 417 sentences, 284 Tatoeba and 133 own, 46 chunk sets for ★ ordering.
- **Tatoeba regex hints for the trickier N4 points** (false matches to exclude; always hand-check):

  | Looking for | Exclude or label |
  |---|---|
  | ～し (reasons) | し inside words (話し, 少し, 美しい), しか, して, しまう, しよう |
  | そうだ hearsay | appearance そう on a stem (おいしそう), そうですね / そうですか, そう思う |
  | そうだ appearance | hearsay (plain + そう), the adverb そう (そうしましょう) |
  | なら | ならう, ならぶ, ならない (なければならない), 奈良 |
  | たがる | がる on adjectives (嫌がる, 怖がる), 下がる, 上がる, 曲がる |
  | しか～ない | しかし, 確か; ない must close the same clause |
  | ておく | 置く as a full verb; label the とく contraction |
  | volitional よう / おう | ようだ / ように / ような, 用 / 曜, 思う / 言う (dictionary forms ending in おう) |
  | てあげる / てくれる / てもらう | 上げる "raise", 暮れる, あげる / もらう without て |
  | といいです | といいます / という (a name or quote) |
  | させる | lexical 見せる, 乗せる, 知らせる, 聞かせる |
  | ば-form | 例えば, そういえば, と言えば, なければならない (its own point), しばらく, ばかり |
  | ても | てもいい (N5), とても, いつでも / 誰でも, sentence-initial でも |
  | たら | たらどう (own point), 〜たらしい, あたらしい |
  | みたい | 〜たい, 見たい |
  | dict + と | と "and" / "with", と思う / と言う, という |
  | ながら | 長らく, sentence-initial ながら; require a ます-stem |
  | やすい / にくい | 安い "cheap", 憎い; require a ます-stem |
  | passive られる / れる | potential (え-row + る), lexical れる (疲れる, 忘れる, 生まれる); る-verbs are ambiguous: tag by hand |
  | てある | ある as a full verb, written copula である |
  | のに | the purpose のに (作るのに三時間, N3), の + に after a nominaliser |
  | させられる | される as the passive of する (勉強される), 見せられる |
  | ところだ | ところ "place", ところで, 〜たところ "when I did" (N3) |
  | potential | 寝る, 出る, 見る (ichidan verbs that look like え-row potentials); できる only under ことができる |
  | imperative | 行け inside 行けば / 行ける |
  | な prohibitive | な-adjective な, sentence-final softener な (高いな) |
  | ございます | おはようございます / ありがとうございます |
  | お～ください | お + noun + ください (お茶ください); require a ます-stem |

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

### N4 additions

- **A level's kanji draw words from every lower level.** `tools/author-kanji.js --level N4` loads N5
  and N4 vocab, so an N4 kanji's readings and `words` include N5 words, and N5 kanji are reading
  candidates when an N4 word is split.
- **KanjiVG is the third stroke source.** Wiktionary counts traditional radical forms (近 = 8 for 辶),
  so 12 N4 kanji split KANJIDIC and Wiktionary. `author-kanji.js` now counts the `<path>`s in the
  KanjiVG SVG and keeps a count any two sources agree on; KanjiVG sided with KANJIDIC on all 12.
  `node tools/build-strokes.js --fetch` downloads the missing SVG of every kanji on any `tools/ref`
  list, then bundles.
- **A kanji no word splits into** (京: 東京 is no vocab item; 田: only 田舎, read whole) takes its
  `extra` readings as on/kun, so reading questions and cards always have an answer. The plan places
  it by hand (§5).
- **Whole-word readings go in the override's `special`** (jukujikun such as 今日 きょう, 田舎 いなか),
  each with the reason. `author-kanji.js` stops and lists every word that won't split into its
  kanji's readings until it is added.
- **Wiktionary is a credited source.** Every kanji lists it, so `CREDITS` needs its row (an N5 review
  finding).
- N4 result: 166 kanji, all verified.

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

### N4 additions

- **The outline lives in `tools/plan-<lvl>.js`**, a module exporting `level, READY, LESSONS,
  LESSON_NOTES, DIALOGUES, GUIDES, PREP` (N5 adds `HIRAGANA, KATAKANA`). `node tools/author-plan.js N4`
  reads it and writes `data/n4/plan.js`. A level with no kana lists gets no kana units.
- **A lesson row** is `[title, grammar id(s), vocab tokens, fixed kanji?]`. The grammar cell may
  hold two space-separated ids, only for close siblings or a short form (`g:yasui g:nikui`,
  `g:nado g:toka-toka`). Vocab tokens are `word`, or `word|reading` when the word isn't unique.
- **Kanji placement above N5.** A kanji written in a lower level's word may come early (明 in N5
  明日), in the order the lessons' grammar examples need it (3-lesson look-ahead), so every point
  has 3 clean examples. A kanji no word of any level uses (京) is pinned by hand in the 4th column.
- **`READY` flag.** `READY: false` writes `ready: false` on the plan, and `liveUnit()` in `lib.js`
  keeps the level out of the app (Overview shows "Coming soon", no placement, no Today, no
  achievements). `allUnits()` still holds every level, so tests and `taughtIds` work on the hidden
  level. Flip to `true` and rerun `author-plan.js` as the last commit of the level.
- **Unit ids are append-only from the first plan commit.** Lessons and reviews come first
  (n4.u001-u102); prep units, mocks and dialogues land later and are appended, so lesson ids never move.
- **Tests that pinned N5 had to loop over every planned level** (teaching order, quiz leaks,
  bound items, untaught kanji, the load guide). Add the new level's `LOAD_GUIDE` entry in
  `tests/catalog-checks.js`, or the load check silently skips it.
- **N4 load:** 87 lessons + 15 reviews = 102 units for 686 vocab, 166 kanji, 96 grammar points
  (about 7.9 / 1.9 / 1.1 per lesson), the same guide as N5. Coverage 100% of the catalog; Tanos 677 of 679
  (高等学校 and 様|よう left out).

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

### Found by the N5 review round 1, after every test was green

Rows marked † landed on the `n5-audit-r1-newbie` branch; check the symbol names with `git grep`
once it is on main.

| Bug the reviewers found | Rule |
|---|---|
| **Type the Japanese accepted only one spelling** (椅子 for いす, ご飯 for 御飯 rejected; blocker) | The typed answer accepts the item's `alt` partners and an `altSpell` list (other JMdict spellings, checked by `author-vocab.js` against the cached lookup). |
| **A same-kana word as a wrong option** (あつい shown in kana for 暑い, while "thick" 厚い is also あつい; blocker) | A word option is rejected when any word written or read the same way shares the answer's sense (`sharesSense`). Kana display (`displayWord`) makes homophones collide. |
| **Reading MC fakes that are real readings** (三つ みつ, 四つ よつ, 先 さっき, 川 がわ) | Every JMdict reading of the spelling goes in `alsoRead`, which is accepted when typed and never used as a fake. |
| **Counters stored as plain nouns** (分, 週間 asked bare, no sound changes) | Every counter is `pos: counter` with ≥2 `contexts`. A bound item whose kanji is untaught (側, 匹, 階) shows that kanji with its reading as ruby when the compound is read. A miss names the sound change (三杯 さんばい). |
| **An `accept` list overlapping another option's gloss** (洗う accepts "to clean", offered against 掃除 "to clean") | Any pair where one item's accept holds the other's meaning never meets as answer and wrong option (`nearSynonyms`). The overlap test checks every gloss, not only the first. Re-run across levels when a new level lands (§1). |
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
- Mocks are fixed, follow the official mondai counts (§10), share no items with each other or
  with reviews, and show an estimated score labelled as an estimate. The linear estimate is
  optimistic against real scaled scores; the result copy says so.
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

### N4 additions

- **Everything exam-shaped is keyed by level**: `MOCK_PACE`, `MOCK_BLUEPRINT`, `JLPT_PASS`
  (read through `levelTable()`, which falls back to the nearest easier level), `PASSAGE_FORMATS` in
  `tests/catalog-checks.js`, the estimate weights (from the blueprint, no longer N5's 21 / 17 / 5),
  `quizSeconds` (takes the unit or mock level), and the diagnostic (`x:<lvl>-mock-3`). A new level
  adds its rows; §10 has the numbers.
- **New mondai type 用法 (`MONDAI.youhou`, N4 and up):** the word plus four sentences, one using it
  right. Authored like 言い換え. Distractors are wrong in meaning, not grammar (the real test works
  that way). Drop any distractor that turns out to be a valid use: N4 replaced おさらをつつむ,
  手がかわく, かぜがさわぐ, ふくざつなかばん and a ふくざつ cake (複雑な味 is a real collocation), and the
  item なれる (also the potential of なる).
- **`uses` on mondai = the right reading only** (iikae: sentence + paraphrase; youhou: word + right
  sentence; bunshou: filled text). Listing the distractor sentences' words added 142 ids nobody needed.
- **N4 texts are unspaced** (the N4 test prints them so); N5 stays spaced. Nothing in the engine
  depends on the phrase spaces outside dialogues.
- **N4 lengths** (no whitespace): short 100–200 (authored 103–147), mid ≈450 with 3 questions
  (407–454), info ≈400 with 2 questions (300–323 without spaces, close to 400 with them), bunshou
  150–260. Check windows: short 80–260, mid 340–580, info 280–520.
- **Kanji gaps force kana.** 分, 回, 点, 部, 番, 所, 客, 乗, 昨, 好, 階, 降, 次 and others are not on the
  Tanos N5/N4 lists, so じぶん, はんぶん, へや, ばあい, 30ぷん stay kana and "1週間に4度" stands in for 4回.
  `[四|よ]` and `[十|じゅっ]` have no backing reading: write よ[人|にん], じゅっぷん.
- **Key spread by construction.** Author every item with the key first, then let the build script
  rotate it (cycle 0,2,1,3,2,0,3,1 for 4 options; 0,2,1,1,0,2 for 3), keeping the distractor order.
  No `explain` may refer to an option position. N4 result:

  | Format | n | per slot | top | key = single longest |
  |---|---|---|---|---|
  | short | 24 | 6/6/6/6 | 25% | — |
  | mid (questions) | 18 | 5/4/5/4 | 28% | — |
  | info (questions) | 16 | 4/4/4/4 | 25% | — |
  | 言い換え / 用法 | 14 / 14 | 4/3/4/3 | 29% | — |
  | task | 26 | 7/6/7/6 | 27% | 4% |
  | point | 24 | 6/6/6/6 | 25% | 4% |
  | utterance | 16 | 5/6/5 | 38% | 6% |
  | quick | 24 | 8/8/8 | 33% | 25% (nine rebalanced) |

- **Listening shape at N4:** task / point = one narrator scene line + 4–7 speaker lines (mean 5.6),
  each script making the listener track a change of mind, a correction, a reason or a condition.
  Same frame text as N5 (`男の人と女の人が話しています。`, `なんといいますか。`). Registers: plain
  between friends, polite with coworkers, keigo in service scenes.
- **Split listening into sets before the plan exists:** mock-1, mock-2, diagnostic, review (with
  spares for prep drills), no item shared, top slot ≤45% per set. Review items are placed after the
  unit that teaches their words; swap in a spare when one leaks.
- **Exam voices: archetype assignments.** Every non-dialogue item needs an entry in
  `tools/audio/man-assignments.json` and `woman-assignments.json` (archetype + one-line reason, read
  from the transcript); `export-tracks.js` fails otherwise. Dialogues use `cast.json` instead.
- **Rendering: one v5 session.** `tools/audio/render-notebook-v5.ipynb` renders every missing clip
  of every level (dialogue characters and exam voices) from saved references, resumable after a
  disconnect. Steps in `tools/audio/README.md` "Rendering with v5". The N4 launch was about 1,380
  clips (509 N4 exam, 862 N4 dialogue, 6 N5), 1.5–3 hours on a T4.
- **`AUDIO_STALE_OK=1` opt-out protocol.** When a transcript changes on purpose (a review fix), its
  clip is stale until the next render. Running the suite with `AUDIO_STALE_OK=1` turns **only** the
  stale-clip hash check into a warning; everything else still fails. Rules: list every changed
  line in the branch's rerender notes (id, line, why) at the time of the change; never use the flag
  for a line nobody listed; drop the flag once the owner renders and `build-audio-manifest.js` runs.
  A brand-new item with no manifest track is skipped without the flag.

## 7b. Exam guide voice

The guide on prep and mock units (`unit.guide`, `GUIDES` in `tools/plan-<lvl>.js`) speaks like a senpai
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
- **Every number in a guide belongs to its level.** The N5 guides said "about 21 questions in 20
  minutes", "one question out of 67" and "Kanji from the N5 list show no furigana". The N4 guides say:
  - Vocabulary: about **28** questions in **25** minutes, **5** types; the fifth is **用法** (word given,
    pick the one sentence that uses it right; check the part of speech and the particle before the word).
  - Grammar: about **21** questions, 13 of them gap-fill; keep about 20 of the 55 minutes for it.
  - Reading: about **8** questions in the rest of the 55: 3 short texts (100–200 characters), one mid
    text of about 450 with 3 questions, an information search with 2. "Kanji from the N4 list show no furigana."
  - Listening: about **28** questions in **35** minutes; 即時応答 is 8 items (the biggest jump).
  - Mock: "A full N4 test: 85 questions in three timed parts", 25 / 55 / 35 minutes, "Set aside about two
    hours". Pass line 90 total, minimums 38 / 19.
- Don't state a distractor pattern as an absolute ("wrong choices differ by one sound"): the official
  samples also use other-word and semantic distractors.

## 7c. Lesson dialogues

Contract and rules: `docs/dialogue-authoring.md`. N4 wrote one dialogue per lesson (87), none for reviews.

- **Three batch writers, one brief**, by unit range (N4: u001-u035, u036-u070, u071-u102). Each wrote
  `batch-<n>.js` (the items), `batch-<n>-map.json` (unit id → dialogue id; the lander converts it to the `DIALOGUES` map in
  `tools/plan-<lvl>.js`, which is keyed by lesson title) and `batch-<n>-notes.md` (pairings, threads, bridges, `say` overrides, unsure).
  Batches 2 and 3 read the earlier notes first. Batches can run in parallel once the plan exists.
- **The brief:** compute `taughtIds(unit)` from the real plan; ≤3 glossed bridges; the unit's grammar
  used clearly, ideally 2–3 ways; ≥4 of the unit's new words, naturally; register by what is taught
  (keigo only after the keigo block); 6–10 lines, each answering the last, a small arc, ≤1 humour beat,
  no catchphrases or copied lines; remixes swap one detail and never rebuild a line; canon names only;
  `say` where `dialogueSpeech` gets a reading wrong.
- **One shared validator** (N4: `.scratch/n4-launch/dialogues/validate.js <batch> [--speech]`). It loads
  the catalog, `lib.js` and the batch, attaches each dialogue to its unit from the map, and runs
  `dialogueErrors` / `ownTextErrors` (pulled out of `tests/catalog-checks.js` with QUnit stubbed) plus
  the `tests/dialogue.js` logic: teaching order, bridges present, the unit grammar marked in
  `dialogueView`, remix-not-rebuild, cast matches `cast.json`. `--speech` prints the speech text of
  every line to read. Zero errors before handing in.
- **Threads give the course a story.** Keep a list of running threads and close or hand them on per
  batch. N4 continued N5's (Sasuke + Sakura, Anya's school, Nami's money, Sanji's cooking, Kakashi
  late) and opened a few (a trip, moving house, a part-time job, Frieren and time). Closed by the last
  batch: trip, moving, part-time job, Sasuke + Sakura, Kakashi late, Yor's cooking. Left open for N3:
  Anya's school, Maomao testing medicine, Emilia's job hunt.
- **Pairing rotation:** no pair repeats within 6 stages and every character appears regularly. Record
  the unit → pair table in the batch notes.
- **Library limit: a same-spelled word blocks the grammar mark.** `dialogueView` marks the unit's new
  words before its grammar, and a marked cell can't take a grammar mark. When the unit teaches a word
  spelled like its grammar point (それに / それでも, 予定, やすい / にくい, 間, 場合), the point gets no
  mark. N4 hit this in u015, u031, u034, u057, u064, u081, u097 and u099; the fix (grammar match wins)
  belongs in `lib.js` before the dialogues land. Writers worked around the rest: no phrase space
  before くれ / ありがとう (くれる as a unit word otherwise took it), potential forms instead of もらう forms,
  `unmark` for a look-alike (開いて vs the unit word 開く).
- **`say` overrides found by reading `--speech`:** the speech swap turned 答え into 答, 帰る into 変える,
  なっていきます into 生きます, おばさん into 伯母さん, 〜てみる into 見る, ておく into 置く, この into 子の,
  ひとりで into 火とりで, and kana かえば could be heard as 帰る (written 買えば). Read every line's speech text; add `say`
  or a `SPEECH_KANA_*` entry.
- **Words the catalog lacks stay out of `uses`:** set phrases (ありがとう, すみません …) by rule;
  common words not on the list (すごい, ちゃんと, メール) are avoided. Note every such case.
- N4 result: 87 dialogues, 174 remixes, 32 bridge uses; every batch validated at 0 errors.

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

### N4 additions

- **Orchestrator + at most 4 subagents at a time.** The orchestrator keeps one `STATE.md` (decisions,
  merged commits, what's in flight, todo order, expected-red list) and writes it after every merge.
  Subagents get a brief file and scratch output folders; parallel authors never edit the repo.
- **One branch per phase** (`n4-lib`, `n4-plan`, `n4-data-exam`, `n4-data-mocks`, `n4-achievements` …),
  each in its own worktree, landed by rebase + fast-forward, branch deleted after. No merge commits.
- **Serialize the shared files:** `lib.js`, `index.html` + `tests.html`, `tools/plan-<lvl>.js` /
  `data/<lvl>/plan.js`, `.claude/hooks/run-tests.js`, the exact-count tests, and `sw.js` (regenerate
  on every rebase, never merge it by hand; rebuild it in the branch's last commit). Two branches that
  both touch one of these land one after the other.
- **Order of phases that worked** (each needs the one before): tools take `--level` → ref list →
  vocab + kanji + KanjiVG → grammar + sentences → lib (forms, level tables) → plan (`READY: false`) →
  exam content (passages, mondai, listening) → mocks + prep → dialogues → achievements → audio render →
  review rounds → flip `READY`. Achievements and dialogues can run beside exam content once the plan exists.
- **Model choice:** opus for authoring Japanese content, reviews and lib changes; sonnet for mechanical
  work (merges, regenerating, counting). Never fable for subagents unless nothing else can do it: it
  hit the session limit.
- **Session-limit and shutdown deaths happened twice in one day.** Commit WIP early (🚧), write scratch
  output incrementally (a part file per slice, not one file at the end), keep `STATE.md` current, and
  make every build script rerunnable from its sources.
- **Red main between phases is allowed, with a list.** Content lands in phases, so tests that demand a
  complete level (prep guide, achievements, mocks, listening counts) are red on main until their phase
  lands. The level stays hidden (`READY: false`). `STATE.md` keeps the exact expected-red list; a builder
  treats only those as expected, and a new red is a bug. The list shrinks to zero before the flip.
- **The suite got slow** (about 20 minutes with N4 in the sweeps). Run the narrow test file while
  iterating, the full suite before each commit.

### Review loop (two personas)

Tests passing proved nothing about quality: in N5 round 1, seven reviewer reports all failed, with
2 blockers, 33 majors and 73 nits, on a level whose suite was green. The loop:

- **Two personas, fresh agents every round, read-only.** Each gets only the rubric and the shipped
  code; it may not open `CLAUDE.md`, `docs/`, the tests, the authoring tools' decisions, the overrides
  or any scratch notes, because those carry the author's reasoning. `verified: true`, prior audits and a
  green suite are claims, not evidence.
  - **Expert Japanese teacher:** knows JLPT thoroughly. Re-derives facts from sources (cached JMdict,
    KANJIDIC, Wiktionary, Tanos, jlpt.jp, the Tatoeba file), drives `lib.js` headlessly with seeded
    builds, and solves every mock and drill item before looking at the key. Checks vocab and kanji
    facts, grammar notes and inventory, sentences and attribution, teaching order, coverage and load,
    dialogues and listening scripts, exam-format fidelity, distractor tells and answer leaks in
    aggregate, originality and credits.
  - **Complete newbie:** knows only baby Japanese, no dictionary, no grammar terms. Walks the level in
    a real browser over http on a fresh port (fresh storage), unit by unit: reads everything, plays
    audio, takes every quiz honestly. Reports every point of confusion, feeling cheated, getting stuck
    or wanting to give up, with screenshots. Judges experience, never Japanese facts.
- **Slices:** the teacher by domain (vocab-kanji, grammar-sentences, exam-reading, listening-dialogues),
  every slice loading the whole catalog for cross-cutting checks; the newbie by contiguous unit ranges
  ending on a review, with prep + mocks as their own slice. The orchestrator sizes slices per level.
- **Severity:** **blocker** = the learner is taught something false, marked wrong for a right answer
  in a graded quiz or mock, can't proceed, or a legal/source rule breaks. **major** = hurts learning or
  trust for many learners or misrepresents the exam (teaching-order leak, biased keys, answer visible,
  fair answer rejected, guide claim false, jargon a newbie can't get past). **nit** = polish. A review
  fails on any blocker or major; nits are logged and never force a round. A finding is one defect class
  with an evidence list, not a row per occurrence. Unsourceable facts go in an `UNSURE` list.
- **Loop:** review → collect → fix → re-review with fresh reviewers, who read the previous round's
  findings for their slice only to confirm fixes and still run the whole checklist (fixes regress
  other checks). **Cap 4 rounds per level**; anything open after round 4 goes to
  `.scratch/<launch>/known-issues.md` and the level moves on. A known-open list in the rubric stops
  reviewers re-reporting accepted trade-offs.
- **Reports:** one file per persona and slice, a findings table (id, severity, unit/item, finding,
  evidence, suggested fix), the scripts and seeds next to it, last line `PASS` / `FAIL` with the three
  counts. The orchestrator merges slices into a summary; a round passes only when every slice of both
  personas passes. The full rubric (checklists with ids) is in `.scratch/n4-launch/rubric.md`.
- **What the reviewers caught that authoring missed** (N5 round 1, by class, with the number of findings):

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

## 9. Licences and release

- Show each Tatoeba sentence's author (Settings lists them all); one generic credit line
  doesn't meet CC BY.
- Credit EDRDG whenever `jmdict` appears in `sources`; credit Tanos with its author and a
  licence link. Precache the licence files so Settings links work offline.
- State the content licence: code MIT, own content CC BY 4.0.
- Japanese UI strings stay hidden (`UI_JA_READY`) until a native speaker reviews them.
- The README is part of the release: update it before the level ships.
- Credit every source a level adds to `sources` (Wiktionary for kanji). A new source in the grammar
  `sources` (Bunpro, japanesetest4you, Genki index, Tae Kim) is a link for a level claim, not copied
  text; keep it that way.

## 10. Exam format per level

From jlpt.jp (`testsections.html`, `results.html`, the 2020 N4/N5 count images, the per-level guideline
PDFs). N5 and N4 were re-checked on 2026-10-08. **N3 figures are the 2009 Guidebook counts** (no later
official revision found) and must be re-fetched before building N3. Counts are approximate by JLPT's own
wording.

| | N5 | N4 | N3 (re-check) |
|---|---|---|---|
| Sections, minutes | vocab 20 / grammar・reading 40 / listening 30 = 90 | 25 / 55 / 35 = 115 | 30 / 70 / 40 = 140 |
| Scoring sections | LK・Reading 0–120, Listening 0–60 | same | LK 0–60, Reading 0–60, Listening 0–60 |
| Pass mark / section minimums | 80 / 38, 19 | 90 / 38, 19 | 95 / 19 each |
| 漢字読み | 7 | 7 | 8 |
| 表記 | 5 | 5 | 6 |
| 文脈規定 | 6 | 8 | 11 |
| 言い換え類義 | 3 | 4 | 5 |
| 用法 | — | 4 | 5 |
| **Vocab total** | **21** | **28** | **35** |
| 文の文法１ (gap) | 9 | 13 | 13 |
| 文の文法２ (★) | 4 | 4 | 5 |
| 文章の文法 | 4 | 4 | 5 |
| **Grammar total** | **17** | **21** | **23** |
| 短文 | 2 (≈80 chars) | 3 (100–200) | 4 |
| 中文 | 2 (1 text ≈250) | 3 (1 text ≈450) | 6 |
| 長文 | — | — | 4 |
| 情報検索 | 1 (≈250) | 2 (≈400) | 2 |
| **Reading total** | **5** | **8** | **16** |
| 課題理解 | 7 | 8 | 6 |
| ポイント理解 | 6 | 7 | 6 |
| 概要理解 | — | — | 3 |
| 発話表現 | 5 | 5 | 4 |
| 即時応答 | 6 | 8 | 9 |
| **Listening total** | **24** | **28** | **28** |
| **Items** | **67** | **85** | **102** |
| `MOCK_PACE` vocab / grammar / reading / listening (s) | 57 / 60 / 276 / 75 | 54 / 60 / 255 / 75 | derive: section seconds ÷ items |
| Furigana in booklet | on kanji above N5 | on kanji above N4 | check a sample booklet |
| Passages | spaced | unspaced | check a sample booklet |

What changes structurally at N3, so plan the code before the content:
- **Three scoring sections**: language knowledge (the vocab booklet plus the grammar part of the second
  booklet), reading and listening, each 0–60 with a minimum of 19. `JLPT_PASS`, `mockEstimate`,
  `mockOutlook` and the result slip assume one LK・Reading section today.
- **New mondai**: 長文 (long passage) and 概要理解 (summary listening). Each needs a `MONDAI` / format
  entry, a builder, a renderer, a blueprint row, check windows and a guide section.
- `MOCK_SECTIONS` stays three timed parts (the booklets don't merge until N2).
- `build-exercises-n3-plus.js` already gives N3+ units extra generated types (pairMatch, fill_blank):
  check they still fit once real N3 units exist.

## 11. Building N3: exact steps

Run each step on its own branch in a worktree; commit, run the suite, land by rebase + fast-forward.
Add every new `data/n3/*.js` to `index.html` and `tests.html` (after the N4 block), rebuild `sw.js`
in the branch's last commit. Keep `STATE.md` and the expected-red list current throughout.

1. **Research lists.** Check `.scratch/content-audit/research/data/{vocab,kanji,grammar}-n3.json`
   (Tanos + elzup; Wayback if tanos.co.uk is down; record the dates).
2. **Ref list.** Read the N3 rows for the §1 error kinds, add `VOCAB_FIXES` / `VOCAB_SKIP` entries,
   then `node tools/build-ref.js .scratch/content-audit/research/data N5 N4 N3`. N5 and N4 output must
   be unchanged (`git diff tools/ref/`). Read the "left out as already on a lower level" lines.
3. **Prefetch caches** (≤1 request/s, cached files skipped):
   `node tools/author-vocab.js .scratch/content-audit/research/data/jisho-cache --fetch --level N3` and
   `node tools/author-kanji.js .scratch/content-audit/research/data/wiktionary-kanji --fetch --level N3`.
4. **KanjiVG:** `node tools/build-strokes.js --fetch` (downloads every missing SVG on a ref list, bundles
   `kanji-svg/strokes.js`). Commit the SVGs separately (🍱).
5. **Vocab overrides in parts.** Split the N3 keys into 4–6 `keys-<n>.txt` slices, give each author the
   §1 brief, merge the `part-<n>.json` files into `tools/n3-vocab-overrides.json`, then
   `node tools/author-vocab.js .scratch/content-audit/research/data/jisho-cache --level N3`. Fix every
   unverified item or give it a reason. Run `tests/english-answers.js` and trim cross-level collisions
   in all three override files (§1).
6. **Kanji:** write `tools/n3-kanji-overrides.json` (meaning, extra, special, notes), then
   `node tools/author-kanji.js .scratch/content-audit/research/data/wiktionary-kanji --level N3` until it
   prints no unaligned word and every kanji verifies.
7. **Grammar inventory** (§2): Tanos N3 names + JLPT Sensei names with second sources + form points;
   pick up the points N4 deferred (ことになる, ようになる / ようにする, らしい, まま, ばかり, たばかり,
   ことがある, ことにしている). Order into blocks. Write per-pattern Tatoeba hints like §3's table before searching.
8. **Grammar + sentences, two or three authors** (§3 brief and validator). Concatenate into
   `data/n3/grammar.js` and `data/n3/sentences.js`; record the method in `tools/n3-grammar-notes.md`.
   Any new form gets a `conjugate()` column, `CONJ_FORMS` entry (appended) and `tests/conjugate.js` rows.
9. **Lib for N3:** `MOCK_PACE`, `MOCK_BLUEPRINT`, `JLPT_PASS`, `PASSAGE_FORMATS`, `LOAD_GUIDE` rows; the
   three-section scoring (§10); new mondai types; `GAP_INTERCHANGEABLE` / `NEAR_SYNONYMS` sets for N3
   confusables; `LEVEL_ACH_NAMES.N3`. Land before the plan.
10. **Plan:** write `tools/plan-n3.js` (`READY = false`, lessons in block order, 2 grammar ids only for
    siblings, the hand-pinned kanji column where needed), then `node tools/author-plan.js N3`. Check
    `node tools/coverage.js` (100% of catalog and ref) and the load per lesson. From this commit on, unit
    ids are append-only.
11. **Exam content, parallel authors:** passages (short / mid / long / info) and mondai (言い換え, 用法,
    文章の文法) in one batch, listening (task / point / summary / utterance / quick) in another, both with a
    build script that rotates keys and a validator using the catalog checks. Record decisions in
    `tools/n3-exam-notes.md`. Add archetype entries for every listening item.
12. **Mocks** (`data/n3/mocks.js`: `x:n3-mock-1`, `-2` full, `-3` diagnostic) per `MOCK_BLUEPRINT.N3`,
    no item shared with reviews or each other, one katakana 表記 per full mock. Then `PREP` and `GUIDES` in
    `tools/plan-n3.js` (§7b numbers for N3), `node tools/author-plan.js N3`.
13. **Dialogues** (§7c): batch writers on the real plan, shared validator, fix the same-spelling mark
    limit in `lib.js` first if it is still open, then append the items to `data/n3/listening.js`, fill
    `DIALOGUES` in `tools/plan-n3.js`, `node tools/author-plan.js N3`.
14. **Achievements:** `LEVEL_ACH_NAMES.N3` (own puns), any N3 extras (picked by kind and grammar ids,
    never unit ids), `n3` in `LEVELS` / `LEVEL_EXTRA` of `tools/build-stamp-icons.js`, rerun it (network),
    update `tests/achievements.js`.
15. **Tracks:** `node tools/export-tracks.js` (fails on a missing assignment or cast mismatch; prints the
    clip count).
16. **Render:** the owner runs `tools/audio/render-notebook-v5.ipynb` (steps in `tools/audio/README.md`),
    then copies the clips into `audio/`, runs `node tools/build-audio-manifest.js <render dir>`, commits
    any new `tools/audio/refs/` files. Drop `AUDIO_STALE_OK` once nothing stale is left.
17. **Review rounds** (§8): teacher + newbie, fresh agents per round, sliced, capped at 4 rounds; open
    items to `known-issues.md`. Re-review N4 in the same rounds if N3 changed shared code.
18. **Release:** `README.md` counts and pass rules, `CREDITS`, `CLAUDE.md` status line. Last commit: set
    `READY = true` in `tools/plan-n3.js`, `node tools/author-plan.js N3`, `node tools/build-sw.js`, full suite
    green with no expected-red list left.
