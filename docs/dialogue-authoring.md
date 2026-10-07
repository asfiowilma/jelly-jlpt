# Lesson dialogue authoring guide

A lesson unit may carry one short dialogue (6-10 lines, two characters) shown above its vocabulary, with a Practice card of 1-3 swaps.
It is a listening catalog item of `format: 'dialogue'` in `data/n5/listening.js`. It is not a test format: no question, options or answer,
no SRS card, nothing scored. Two shipped examples: `l:n5-dlg-first-class` (Stage 19, `n5.u019`) and `l:n5-dlg-forger-table` (Stage 28, `n5.u028`).

## Item shape

```js
L({ id: 'l:n5-dlg-first-class', format: 'dialogue',          // l:<level>-dlg-<slug>
  title: 'First class', goal: "You can say who you are and ask someone's name.",
  scene: 'Kakashi-sensei meets a new student on the first day of class.',   // English, one line
  cast: { kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Teacher' },
          sasuke:  { name: 'Sasuke',  jp: 'サスケ', gender: 'M', role: 'Student' } },
  lines: [
    { speaker: 'kakashi', furigana: 'はじめまして。わたしは　カカシです。せんせいです。', en: 'Nice to meet you. I am Kakashi. I am a teacher.' },
    { speaker: 'sasuke',  furigana: '……サスケです。', en: '...Sasuke.' },
    ...
  ],
  bridge: [ { text: 'お', ctx: 'おなまえ', gloss: '...' }, { text: 'ね', ctx: 'ですね', id: 'g:ne', gloss: '...' }, { text: 'しずかな', gloss: '...' } ],
  remixes: [{ scene, en, chunks: [...], answer: [...], explain }],      // the Practice swaps, 1-3
  names: ['カカシ', 'サスケ', 'エミリア'],
  uses: ['g:wa-desu', 'v:私|わたし', 'k:学', ...],
  verified: true });                                                 // else false + `notes` with the reason
```

| Field | Rule |
|---|---|
| `id` | `l:<level>-dlg-<slug>`. New text = new id (clips and manifest are keyed per track). |
| `title`, `goal`, `scene` | English, shown in the hero / opened panel. `goal` starts "You can ...". |
| `cast` | Exactly two characters. Key = character id from `tools/audio/cast.json`. The first key is the left speaker (chip colour `a`), the second the right (`b`). Per entry: `name`, `jp` (same as cast.json; first character is the chip initial), `gender` M / F (same as cast.json), `role` (this scene's part, English, shown under the name). |
| `lines[]` | 6-10 lines. `speaker` = a cast key, `furigana` = kana with `[漢字\|かな]` ruby and U+3000 between phrases, `en` = English of the line, `say` (optional speech override, below), `take` (optional integer > 1: re-render this line's clip, below). No `tone`: one voice per character. Both characters speak. |
| `bridge[]` | At most 3 words the unit has not taught yet, each `{ text, gloss, ctx?, id? }`. `gloss` is mandatory. `ctx` = the surrounding text when the word is only a bridge inside it (お in おなまえ). `id` = the grammar / vocab id when it is a catalog item taught later (it must also be in `uses`). Shown with a dashed mark; the gloss strip explains it. |
| `remixes[]` | The Practice card's swaps (ungraded, not in the quiz): `scene`, `en` (the target in English), `chunks` (the answer chunks plus exactly 1 distractor, all distinct), `answer` (ordered chunks), `explain`. Every katakana word in the chunks is in `names`. A chunk holding a one-character bridge word (を) gets its gloss as a note automatically. |
| `names` | Every spoken name, exactly as written (katakana), canon only; includes both cast `jp` values. The test has the allowed list (the 14 characters). Never invent a given or family name the original does not use in speech. |
| `uses` | Every grammar point (`g:`), content word (`v:`) and kanji (`k:`) in the lines. Set phrases (はじめまして, よろしく, おねがいします, いただきます, ごちそうさま, ありがとう, すみません) are plain text, not in `uses`. |
| `verified` | `true` only when every `uses` item is verified and the checks pass; otherwise `false` plus `notes` with the reason. |

Dialogue text is hand-written for this project (`sources: ['own']`, set by `L()`). Wholesome scenes only; canon names only; no artwork.

## Rules the tests enforce

`tests/catalog-checks.js` (`dialogueErrors`, `ownTextErrors`) and `tests/dialogue.js`:

- teaching order: every `uses` id is taught by the unit or an earlier one, or is a declared bridge; at most 3 bridge words; each bridge text appears in the lines
- the unit's own grammar point is used (`は/です` in Stage 19, `ます` in Stage 28): its id is in `uses` and its tokens appear
- kanji appear only when taught by the unit or earlier, inside a ruby block, and are in `uses` (`k:...`); everything else in kana
- 6-10 lines; two cast characters, both speak; every line has `en`; no `tone`; a `say` (when set) is a non-empty string; a `take` (when set) an integer above 1
- names canon only and complete; the Practice swaps: 1-3, answer chunks present, exactly 1 distractor, distinct chunks
- every ruby reading backed by a used word, a name or the kanji's readings; every katakana word a used word or a name
- the cast matches `tools/audio/cast.json` (`run-tests.js`, headless)
- the audio hash test: every rendered line's clip name equals the sha1 of its clipKey (skipped for a dialogue until its track is in `audio/manifest.js`)

## Characters, voices and speech text

`tools/audio/cast.json` is the roster: 14 characters, each with `name`, `jp`, `gender`, `role`, `personality` and `voice` (a Qwen3-TTS voice-design prompt). One fixed voice per
character, reused for all their lines in every dialogue. Pick the pair for the scene from `.scratch/lesson-dialogs/cast.md` and `scenarios.html` (register: polite pairs early, plain-form pairs only after the plain form is taught).

A line's voice is its character (clipKey `role|<character id>|<speech text>`, with `<id>@<rev>` and `#<take>` below). Any pairing works (man+man, woman+woman, man+woman). In the browser-voice fallback the second character of a gender gets
another voice or a different pitch.

Speech text: the voice (clips and the browser fallback) reads natural adult Japanese in full kanji, not the learner's kana. TTS misreads
kana-only and half-kanji text (ごごは read "gogo-ha", 金ようび read "kane-youbi"); with the normal spelling it gets word boundaries, particles
and accent right. `dialogueSpeech(line, item)` in lib.js builds it from the line and the item's `uses`, so a new dialogue needs nothing extra:

- every `uses` vocab word that appears in kana (or kana + ruby kanji) is written in its normal spelling (`word`): `ごごは　はたらきます。` →
  `午後は働きます。`, `[金|きん]ようびは？` → `金曜日は？`, `わたしの　かさ` → `私の傘`. Verbs and i-adjectives in their conjugated forms
  (ます / ません / ました / ませんでした / ましょう / て / た / ない / dictionary..., くない / かった / くて...): kanji stem + kana ending.
- only at a word boundary: the start of the line or phrase (after U+3000, punctuation or katakana), right after の, or after a phrase-initial
  お / ご (`おなまえ` → `お名前`); longest word first; a non-conjugating word must be followed by the phrase end or a particle / copula
  (`SPEECH_AFTER`). So `いえ` is never swapped inside `いいえ`, and nothing is swapped right after a ruby block.
- words the catalog spells in kana stay kana (これ, どこ, ください); bound morphemes (さん, 時, お), numbers and words holding a numeral
  (三日, 一人) are never swapped. Words not in `uses` stay as written: no kanji is invented.
- numbers: from a ruby block whose kanji hold a numeral (一二三四五六七八九十百千万) to the end of its phrase, the ruby blocks are spoken
  as their authored kana (`[九|く][時|じ]` → くじ, `[一|いち]まん[三|さん]ぜん[円|えん]` → いちまんさんぜんえん) and nothing is swapped:
  numbers, counters, dates and times are where TTS misreads.
- punctuation and `……` kept, the U+3000 phrase spaces removed. The display text never changes; the speech text is never shown, so kanji
  the learner has not learned yet are fine in it.

`say` (optional) overrides the speech text of one line for anything the rule above gets wrong (a wrong swap, a kanji misread, an odd accent): the text as it should
be spoken, used as is (U+3000 removed). The learner never sees `say`; it changes that line's clip name.

`take` (optional integer, 2, 3...) re-renders one line whose clip came out wrong (drifted to another voice, broken file) without changing its text:
the clipKey gets `#<take>`, so the clip has a new name and the notebook renders it. Delete nothing.

No per-line tone: each character has one locked voice (their `voice` prompt in `cast.json` carries their usual delivery: Sasuke quiet and curt, Gojo teasing,
Frieren flat). Delivery within a line comes from punctuation only: `……` (hesitation), `！`, `？`. To change how a character sounds, edit their prompt
(try it first in the notebook's "Tweak a voice" cell) and bump their `rev` in `cast.json` (absent = 1; set 2, then 3...): the clipKey's archetype
becomes `<id>@<rev>`, so all their clips get new names and re-render. Delete nothing: see `tools/audio/README.md`.

## Adding a dialogue

1. Write the item in `data/n5/listening.js` (the dialogue block at the end). Check what the unit and earlier units taught: `taughtIds(unit)` (see `tests/dialogue.js`).
2. `tools/author-plan.js`: add `"<lesson title>": "l:n5-dlg-<slug>"` to `DIALOGUES`, then `node tools/author-plan.js` (regenerates `data/n5/plan.js`).
3. `node tools/export-tracks.js`: fails on an unknown character or a gender mismatch; prints how many clips need rendering. Writes `tools/audio/tracks.json` and the gitignored `render-input.json`.
4. Render the missing clips in Colab (`tools/audio/render-notebook-v2.ipynb`): upload `render-input.json`, Run all, download `jelly-audio-new.zip`.
5. Unzip, copy the mp3s into `audio/`, `node tools/build-audio-manifest.js <rendered dir>` (verifies every clip name and file, writes `audio/manifest.js`).
6. `node tools/build-sw.js`, then `CLAUDE_PROJECT_DIR=$(pwd) node .claude/hooks/run-tests.js`. Commit `sw.js` with the change.

Until step 5 the dialogue plays in the browser voice; the test suite is green without clips. To retire or replace a dialogue see "Replacing or removing a track" in `tools/audio/README.md`.
