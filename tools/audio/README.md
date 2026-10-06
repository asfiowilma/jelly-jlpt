# Listening audio tracks

`tracks.json` lists every N5 listening item as a flat play sequence, for the Colab TTS notebook
that renders the audio. Each track has `lines` of `{ role, text, kana, say }`: `text` is the natural
Japanese (kanji kept, full-width spaces removed, for reading only), `kana` the reading the Web Speech
fallback uses, and `say` = `kana` with full-width spaces removed: the text the clips are rendered from,
so the authored readings (何人, 四日, 九時...) decide the pronunciation, not the TTS model.
Role N is the narrator, M the man, F the woman. `man` and `woman` are the track's archetypes, or null when that voice is absent.

A lesson dialogue (format `dialogue`) has no man / woman archetype (both null). Each line is voiced by its **character**
(`cast.json`): `role` = the character's gender (M / F), `arch` = the character id (`kakashi`, `yor`...), and an optional `tone`.
Any two characters work (man + man, woman + woman, man + woman). Non-dialogue tracks are unchanged.

## Characters (`cast.json`)

14 recurring characters, one fixed voice each, reused in every dialogue they appear in. Per id: `name` (shown), `jp` (katakana, shown and
the chip initial), `gender` M / F (the clipKey role), `role` (typical part), `personality`, `voice` (a Qwen3-TTS voice-design prompt in the style of
`man-archetypes.json`; every prompt is different so the characters sound apart). Both genders use voice design (`design()` in the notebook): six women on the
single preset Ono_Anna would sound alike. A dialogue item's `cast` must match `name`, `jp`, `gender` here (checked by `run-tests.js`; `export-tracks.js` fails on an unknown id or a gender mismatch).
Changing a `voice` prompt does not rename clips (the key has the id, not the prompt): to re-voice a character, delete that character's clips from `audio/` and the manifest, then re-render.

### Tone

A dialogue line may carry `tone`, a short English delivery hint ("quiet, curt, low energy"). The notebook appends it to the character's voice prompt
("... Delivery: <tone>.") and renders that line with its own locked voice (same designed voice, that delivery). It is part of the clipKey **only when set**
(`role|char|say|tone`), so lines without one keep their names. No `|` in a tone. A line starting with 「……」 is a pause marker: the speech text drops the dots, so use `tone` for the curt, quiet delivery.
Use a tone sparingly (each distinct tone is one more reference render): the character's `voice` already carries their usual manner.

Regenerate after any change to `data/n5/listening.js` or the archetype files:

    node tools/export-tracks.js

`man-archetypes.json` (six voice-design prompts) and `woman-archetypes.json` (four Ono_Anna
instructions) define the characters. `man-assignments.json` and `woman-assignments.json` map every
track with that voice to an archetype, with a one-line reason; written by reading each transcript.
The tool fails if such a track has no assignment or names an unknown archetype. New listening
items need an entry in both (dialogues do not: they use `cast.json`).

The notebook dedupes clips with `clipKey = role + '|' + (role === 'N' ? '' : archetype) + '|' + say [+ '|' + tone]`
(archetype = the character id for a dialogue line), so identical lines across tracks render once. (Before the switch to `say` the key used `text`; lines
written all in kana hash the same either way, so their clips were reused.)

## Voice decisions (locked)

- Woman: Qwen3-TTS preset Ono_Anna for all; only the instruction changes per archetype (lively is the approved base).
- Narrator: preset Serena with the exam-style instruction, one fixed voice for every track.
- Man: a designed voice per archetype, from `man-archetypes.json`.
- Dialogue characters: a designed voice each (either gender), from `cast.json`; Ono_Anna is only for the old woman archetypes.
- Loudness: TARGET_DB -20, GAIN_DB F +1, M 0, N 0.
- Output: MP3, mono. Clips are cached by the service worker on first play.

## Replacing or removing a track

A dialogue whose text changes gets a **new id** (clips are keyed by text, but the manifest is keyed by track id and the tests compare per line).
To retire an old track: delete its `"l:...": [...]` line from `audio/manifest.js` (and its entry in the assignments json, if any), then re-run
`node tools/export-tracks.js`. Its mp3s stay in `audio/` as orphans until you delete them by hand (then `node tools/build-sw.js`).

## After rendering (ship the clips)

The notebook (`render-notebook-v2.ipynb`, run on Colab; `render-notebook.ipynb` is the old one that rendered
from `text`) reads one input file and writes `<12 hex>.mp3` clips plus `manifest.json`
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
