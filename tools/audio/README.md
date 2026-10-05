# Listening audio tracks

`tracks.json` lists every N5 listening item as a flat play sequence, for the Colab TTS notebook
that renders the audio. Each track has `lines` of `{ role, text, kana }`: `text` is the natural
Japanese (kanji kept, full-width spaces removed), `kana` the reading the Web Speech voice uses.
Role N is the narrator, M the man, F the woman. `man` is the track's man archetype, or null.

Regenerate after any change to `data/n5/listening.js` or the archetype files:

    node tools/export-tracks.js

`man-archetypes.json` holds the six voice-design prompts. `man-assignments.json` maps every track
with a man to an archetype, with a one-line reason; it was written by reading each transcript.
The tool fails if a man track has no assignment or names an unknown archetype. New listening
items need an entry there.

The notebook dedupes clips with `clipKey = role + '|' + (role === 'M' ? archetype : '') + '|' + text`,
so identical lines across tracks render once.

## Voice decisions (locked)

- Woman: Qwen3-TTS preset Ono_Anna with the lively instruction.
- Narrator: preset Serena with the exam-style instruction, the same for every track.
- Man: a designed voice per archetype, from `man-archetypes.json`.
- Loudness: TARGET_DB -20, GAIN_DB F +1, M 0, N 0.
- Output: MP3, mono. Clips are cached by the service worker on first play.
