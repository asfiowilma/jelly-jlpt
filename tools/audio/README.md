# Listening audio tracks

`tracks.json` lists every N5 listening item as a flat play sequence, for the Colab TTS notebook
that renders the audio. Each track has `lines` of `{ role, text, kana, say }`: `text` is the natural
Japanese (kanji kept, full-width spaces removed, for reading only), `kana` the text the Web Speech
fallback uses, and `say` = `kana` with full-width spaces removed: the text the clips are rendered from. A dialogue line may also carry
`take` (a re-render, below).
Exam tracks speak the kana reading, so the authored readings (何人, 四日, 九時...) decide the pronunciation;
lesson dialogues speak natural full-kanji text (below), so for them `kana` and `say` hold that text.
Role N is the narrator, M the man, F the woman. `man` and `woman` are the track's archetypes, or null when that voice is absent.

A lesson dialogue (format `dialogue`) has no man / woman archetype (both null). Each line is voiced by its **character**
(`cast.json`): `role` = the character's gender (M / F), `arch` = the character id (`kakashi`, `yor`...), or `<id>@<rev>` once its voice is revised (below). One voice per character, no per-line tone.
Any two characters work (man + man, woman + woman, man + woman). Non-dialogue tracks are unchanged.

## Characters (`cast.json`)

14 recurring characters, one fixed voice each, reused in every dialogue they appear in. Per id: `name` (shown), `jp` (katakana, shown and
the chip initial), `gender` M / F (the clipKey role), `role` (typical part), `personality`, `voice` (a Qwen3-TTS voice-design prompt in the style of
`man-archetypes.json`; every prompt states the gender ("Clearly male" / "Clearly female") and a pitch range, carries the character's usual delivery, and is different so the characters sound apart). Both genders use voice design (`design()` in the notebook): six women on the
single preset Ono_Anna would sound alike. A dialogue item's `cast` must match `name`, `jp`, `gender` here (checked by `run-tests.js`; `export-tracks.js` fails on an unknown id or a gender mismatch).
ONE voice per character: a voice-design render of a reference sentence, cloned by the Base model for all their lines. The Base model takes no
per-line instruction, so there is no per-line tone: delivery comes from punctuation (……, ！, ？).

**`render-notebook-v5.ipynb` renders everything** (supersedes v4, v3 and v2 for rendering; same clip names, same refs). See
"Rendering with v5" below. The v3 sections here describe the shared model (saved references, `rev`, `take`); v3 and v4 are kept for
reference, v2 for its A/B text test.

### Saved voice references (`render-notebook-v3.ipynb`)

Dialogue characters render with `render-notebook-v3.ipynb`, one character at a time. v2 designed each reference again in every Colab session, and
VoiceDesign on an fp16 GPU is not reproducible, so a render resumed in another session could clone from a different reference (another voice). v3
designs it once: you tune it by ear (prompt + seed, 3 sample lines), then save it to Drive as `refs/<id>@<rev>.wav` + `.json` (audio, reference
text, prompt, seed) next to the clips. Every later session loads that file; the Render cell refuses to run without one, or when its prompt differs
from the input's `characters[<id>].voice`. A Review cell plays the new clips; a clip that still drifted is listed in `REDO` and rendered again
from the same reference with another seed, under the same name (only before it ships). v5 does the same for every voice, exam voices included.

The locked references live in the repo, `tools/audio/refs/<id>@<rev>.wav` + `.json`, one pair per character at its current rev (dev-only,
never shipped; about 7 MB). The Drive / `/content` refs folder is only a working copy: in a new session, upload the pairs from
`tools/audio/refs/` into the notebook's refs folder before rendering, and commit any newly saved pair back here.

### Changing a voice (`rev`) or re-rendering one clip (`take`)

Nothing is deleted by hand: a change gets new clip names, the notebook renders what is missing, the manifest points at the new clips.

1. In v3 (or v5 section 5, `TUNE = "<id>"`), choose the character, edit `VOICE` (and / or `VOICE_SEED`) in the Tune cell with `USE_SAVED = False`, run, listen, repeat.
2. Save it (`SAVE_REFERENCE = True`). A changed prompt is saved as the next rev (`refs/<id>@<rev+1>`) and the cell prints the `"rev"` and `"voice"`
   lines to paste into that character's entry in `cast.json` (optional integer `rev`, absent = 1). The clipKey's archetype becomes `<id>@<rev>`
   (e.g. `F|nami@3|...`), so every clip of that character gets a new name. To re-render a character with the same prompt (another seed), bump
   `rev` in `cast.json` first, re-export, then tune and save under the new rev.
3. `node tools/export-tracks.js`, upload the new `render-input.json`, render, ship as below. The old clips are no longer in the manifest;
   delete them from `audio/` whenever you like.

One bad clip (drifted to another voice, decodes to nothing): give that line `take: 2` (then 3...) in `data/n5/listening.js`. The clipKey
gets `#<take>` after the say text (`F|maomao|……そうですか。#2`), so only that clip is renamed and re-rendered; the spoken text is unchanged.
`@` and `#` never occur in a character id or a say text, so the names stay unambiguous. A changed speech text renames its clip by itself.

### Speech text (dialogue lines only)

A dialogue line is spoken from natural adult Japanese in full kanji, the way Japanese TTS reads best (kana-only text gets misread: ごごは
"gogo-ha", 金ようび "kane-youbi"). `dialogueSpeech(line, item)` in `lib.js` (the same text Web Speech gets) takes the display text and writes every
`uses` vocab word the learner sees in kana or kana + kanji in its normal spelling (`ごごは　はたらきます。` → `午後は働きます。`, `[金|きん]ようび` →
`金曜日`; verbs and i-adjectives as kanji stem + conjugated kana ending), only at word boundaries, longest first. Words spelled in kana in the
catalog stay kana, words not in `uses` stay as written. Punctuation and `……` kept, U+3000 removed. From a ruby block whose kanji hold a numeral to
the end of its phrase, ruby blocks are spoken as their authored kana (九時 くじ, 一万三千円 いちまんさんぜんえん) and nothing is swapped:
numbers, counters, dates and times are where TTS misreads. A line's optional `say` overrides the whole text for anything the rule gets wrong.
Full rule: `docs/dialogue-authoring.md`. The clipKey hashes this text, so clips, manifest and the audio-hash test agree. The v2 notebook's **A/B text test** cell plays three lines as
A (this text), B (display text with phrase spaces) and C (the old all-kana style) for comparison.
Non-dialogue tracks keep the written kana (their rendered clips keep their names).

Regenerate after any change to `data/n5/listening.js` or the archetype files:

    node tools/export-tracks.js

`man-archetypes.json` (six voice-design prompts) and `woman-archetypes.json` (four Ono_Anna
instructions) define the characters. `man-assignments.json` and `woman-assignments.json` map every
track with that voice to an archetype, with a one-line reason; written by reading each transcript.
The tool fails if such a track has no assignment or names an unknown archetype. New listening
items need an entry in both (dialogues do not: they use `cast.json`).

The notebook dedupes clips with `clipKey = role + '|' + (role === 'N' ? '' : archetype) + '|' + say [+ '#' + take]`
(archetype = the character id for a dialogue line, `<id>@<rev>` when its `rev` > 1; `#<take>` only when the line's `take` > 1), so identical lines across tracks render once. (Before the switch to `say` the key used `text`; lines
written all in kana hash the same either way, so their clips were reused.)

## Rendering with v5 (`render-notebook-v5.ipynb`)

One notebook for every missing clip of every level: dialogue lines (characters) and exam / listening tracks (narrator,
man / woman archetypes), N5 and N4 together. Every voice is cloned from a saved reference, so a resumed session clones the same voice:

- characters: `refs/<id>@<rev>` (as v3 / v4);
- exam voices: `refs/narrator`, `refs/man-<archetype>`, `refs/woman-<archetype>`. Section 4 makes each one the first time it has clips
  to render, from the approved v2 recipe (narrator: preset Serena + the exam instruction; women: preset Ono_Anna + the archetype
  instruction; men: voice design from `man-archetypes.json`; v2's reference sentence and seed 1234), saves it to Drive and plays it.
  v2 designed these again in every session, so the old N5 exam clips came from slightly different takes of the same prompts; from v5
  on each voice is fixed. The json holds `voice` (the prompt) and `speaker` (the preset, or null); the render refuses a ref whose
  prompt no longer matches the input.

Run steps:

1. In the repo: `node tools/export-tracks.js` (prints how many clips are to render).
2. Colab: open `tools/audio/render-notebook-v5.ipynb`, Runtime → Change runtime type → **T4 GPU**, then **Runtime → Run all**.
3. Allow the Drive prompt (`MyDrive/jelly-audio-render` holds clips, refs and the input).
4. First session only, two upload prompts: every file in `tools/audio/refs/` (section 2), then `tools/audio/render-input.json`
   (section 3). Both stay on Drive. After a re-export, set `NEW_INPUT = True` in section 3 for one run.
5. Section 4 designs the missing exam voices (about a minute each) and plays them. If one sounds wrong, give it another seed in
   section 5 (`TUNE = "man-worker"`, `VOICE_SEED`, then `SAVE_REFERENCE = True`, `OVERWRITE = True`) before rendering its clips.
6. Section 6 renders every remaining clip with one progress bar (ETA shown) and prints the seconds per clip at the end.
7. Section 8 downloads `jelly-audio-new.zip`: the new mp3s, `manifest.json` and `refs/`. Ship as in "After rendering" below, and copy
   the zip's `refs/` files into `tools/audio/refs/` (git shows only the new ones: commit them, so later sessions reuse those voices).

Optional: section 5 tunes a new or changed character (as v4 section 4); section 7 (`REVIEW = "<voice>"`) plays a voice's new clips,
50 at a time, and re-renders the ones listed in `REDO` with another seed under the same name.

**Disconnected** (idle timeout, free-tier GPU limit)? Reconnect and **Run all** again: nothing is uploaded twice, refs are reused,
finished clips are skipped (each clip is written to a temp file and renamed, so none is half-written). Only the clip in flight is lost.

**How long:** Qwen3-TTS 1.7B on a T4 (fp16) takes roughly 3-6 s per short clip, plus about 5 minutes of install and model download per
session. The N4 launch (about 1,380 clips: 509 N4 exam, 862 N4 dialogue, 6 N5) is about 1.5-3 hours of rendering. That fits one
session on Colab Pro, and usually one on the free tier too, but free GPU time is not guaranteed (a session can be cut after a few
hours, or a GPU refused for a while): the resume covers that. The Render cell prints the measured seconds per clip; use it for the
next estimate. Memory: the voice-design and preset models are loaded only to make references and freed before the render, which
loads only the Base model (well inside a T4's 15 GB).

## Voice decisions (locked)

- Woman: Qwen3-TTS preset Ono_Anna for all; only the instruction changes per archetype (lively is the approved base).
- Narrator: preset Serena with the exam-style instruction, one fixed voice for every track.
- Man: a designed voice per archetype, from `man-archetypes.json`.
- Dialogue characters: one designed, locked voice each (either gender) for all their lines, from `cast.json`, cloned from a saved reference (v3); no per-line tone; Ono_Anna is only for the old woman archetypes.
- Exam voices (narrator, man and woman archetypes): cloned from a saved reference too, from v5 on (`refs/narrator`, `refs/man-<arch>`, `refs/woman-<arch>`).
- Loudness: TARGET_DB -20, GAIN_DB F +1, M 0, N 0.
- Output: MP3, mono. Clips are cached by the service worker on first play.

## Replacing or removing a track

A dialogue whose text changes gets a **new id** (clips are keyed by text, but the manifest is keyed by track id and the tests compare per line).
To retire an old track: delete its `"l:...": [...]` line from `audio/manifest.js` (and its entry in the assignments json, if any), then re-run
`node tools/export-tracks.js`. Its mp3s stay in `audio/` as orphans until you delete them by hand (then `node tools/build-sw.js`).

## After rendering (ship the clips)

The notebook (`render-notebook-v5.ipynb` on Colab; v2, v3, v4 and `render-notebook.ipynb` are older) reads one input file, keeps
its output on Drive, and writes `<12 hex>.mp3` clips plus `manifest.json`
(`{ version: 1, tracks: { <id>: [file per line] } }`, same order and length as `lines`).

- Input: `tools/audio/render-input.json` (gitignored), written by `export-tracks.js`:
  `{ tracks, manArchetypes, womanArchetypes, characters, have }`, `have` = the clip names already in `audio/`.
  The notebook skips those and any clip already in its output folder (Google Drive, so a disconnect
  resumes), and downloads a zip of only the newly rendered mp3s plus the full `manifest.json`.
- File name = first 12 hex of sha1 (UTF-8) of the clipKey above, plus `.mp3`.
- Unzip, copy the mp3s into `audio/` at the repo root, then run `node tools/build-audio-manifest.js <rendered dir or manifest.json>`.
  It verifies every name against `tracks.json` and every file on disk (so copy first), then writes `audio/manifest.js`
  (`var AUDIO_MANIFEST`, a classic script so it works from file://).
- Run `node tools/build-sw.js` and the test suite. The suite recomputes every hash from the live `listeningScript()` output (not `tracks.json`): editing a transcript or archetype
  without re-rendering fails with a pointer here. Re-render only the missing clips (the notebook skips existing files).
- Playback: `speakScript` plays the clips (600 ms between lines); if one cannot load it falls back to the browser voice.
