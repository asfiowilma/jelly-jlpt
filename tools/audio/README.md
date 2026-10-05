# Listening audio tracks

`tracks.json` lists every N5 listening item as a flat play sequence, for the Colab TTS notebook
that renders the audio. Each track has `lines` of `{ role, text, kana }`: `text` is the natural
Japanese (kanji kept, full-width spaces removed), `kana` the reading the Web Speech voice uses.
Role N is the narrator, M the man, F the woman. `man` and `woman` are the track's archetypes, or null when that voice is absent.

Regenerate after any change to `data/n5/listening.js` or the archetype files:

    node tools/export-tracks.js

`man-archetypes.json` (six voice-design prompts) and `woman-archetypes.json` (four Ono_Anna
instructions) define the characters. `man-assignments.json` and `woman-assignments.json` map every
track with that voice to an archetype, with a one-line reason; written by reading each transcript.
The tool fails if such a track has no assignment or names an unknown archetype. New listening
items need an entry in both.

The notebook dedupes clips with `clipKey = role + '|' + (role === 'N' ? '' : archetype) + '|' + text`,
so identical lines across tracks render once.

## Voice decisions (locked)

- Woman: Qwen3-TTS preset Ono_Anna for all; only the instruction changes per archetype (lively is the approved base).
- Narrator: preset Serena with the exam-style instruction, one fixed voice for every track.
- Man: a designed voice per archetype, from `man-archetypes.json`.
- Loudness: TARGET_DB -20, GAIN_DB F +1, M 0, N 0.
- Output: MP3, mono. Clips are cached by the service worker on first play.

## After rendering (ship the clips)

The notebook (`render-notebook.ipynb`, run on Colab) reads one input file and writes `<12 hex>.mp3` clips plus
`manifest.json` (`{ version: 1, tracks: { <id>: [file per line] } }`, same order and length as `lines`).

- Input assembly: `render-input.json` = one JSON `{ tracks, manArchetypes, womanArchetypes }` made from
  `tracks.json` (`.tracks`), `man-archetypes.json` and `woman-archetypes.json`.
- File name = first 12 hex of sha1 (UTF-8) of the clipKey above, plus `.mp3`.
- Copy the mp3s into `audio/` at the repo root, then run `node tools/build-audio-manifest.js <rendered dir or manifest.json>`.
  It verifies every name against `tracks.json` and every file on disk, then writes `audio/manifest.js`
  (`var AUDIO_MANIFEST`, a classic script so it works from file://).
- Run `node tools/build-sw.js` and the test suite. The suite recomputes every hash: editing a transcript or archetype
  without re-rendering fails with a pointer here. Re-render only the missing clips (the notebook skips existing files).
- Playback: `speakScript` plays the clips (600 ms between lines); if one cannot load it falls back to the browser voice.
