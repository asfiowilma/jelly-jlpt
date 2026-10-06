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
    { speaker: 'sasuke',  furigana: '……サスケです。', en: '...Sasuke.', tone: 'quiet, curt, low energy' },
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
| `lines[]` | 6-10 lines. `speaker` = a cast key, `furigana` = kana with `[漢字\|かな]` ruby and U+3000 between phrases, `en` = English of the line, `tone` (optional, below). Both characters speak. |
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
- 6-10 lines; two cast characters, both speak; every line has `en`; `tone` is a non-empty string without `|`
- names canon only and complete; the Practice swaps: 1-3, answer chunks present, exactly 1 distractor, distinct chunks
- every ruby reading backed by a used word, a name or the kanji's readings; every katakana word a used word or a name
- the cast matches `tools/audio/cast.json` (`run-tests.js`, headless)
- the audio hash test: every rendered line's clip name equals the sha1 of its clipKey (skipped for a dialogue until its track is in `audio/manifest.js`)

## Characters, voices and tone

`tools/audio/cast.json` is the roster: 14 characters, each with `name`, `jp`, `gender`, `role`, `personality` and `voice` (a Qwen3-TTS voice-design prompt). One fixed voice per
character, reused in every dialogue. Pick the pair for the scene from `.scratch/lesson-dialogs/cast.md` and `scenarios.html` (register: polite pairs early, plain-form pairs only after the plain form is taught).

A line's voice is its character (`role|<character id>|<kana reading>`). Any pairing works (man+man, woman+woman, man+woman). In the browser-voice fallback the second character of a gender gets
another voice or a different pitch.

`tone` is optional: a short English delivery hint ("quiet, curt, low energy", "dry, amused, lazy"), appended to the voice prompt at render time. It changes the clip name only when set.
A line that starts with `……` starts with a pause marker (not spoken): put the curt delivery in `tone`. Use tones sparingly, only where the line differs from the character's usual manner.

## Adding a dialogue

1. Write the item in `data/n5/listening.js` (the dialogue block at the end). Check what the unit and earlier units taught: `taughtIds(unit)` (see `tests/dialogue.js`).
2. `tools/author-plan.js`: add `"<lesson title>": "l:n5-dlg-<slug>"` to `DIALOGUES`, then `node tools/author-plan.js` (regenerates `data/n5/plan.js`).
3. `node tools/export-tracks.js`: fails on an unknown character or a gender mismatch; prints how many clips need rendering. Writes `tools/audio/tracks.json` and the gitignored `render-input.json`.
4. Render the missing clips in Colab (`tools/audio/render-notebook-v2.ipynb`): upload `render-input.json`, Run all, download `jelly-audio-new.zip`.
5. Unzip, copy the mp3s into `audio/`, `node tools/build-audio-manifest.js <rendered dir>` (verifies every clip name and file, writes `audio/manifest.js`).
6. `node tools/build-sw.js`, then `CLAUDE_PROJECT_DIR=$(pwd) node .claude/hooks/run-tests.js`. Commit `sw.js` with the change.

Until step 5 the dialogue plays in the browser voice; the test suite is green without clips. To retire or replace a dialogue see "Replacing or removing a track" in `tools/audio/README.md`.
