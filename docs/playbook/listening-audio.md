# Listening and audio

Load when: writing listening scripts, options, archetype assignments, rendering audio, or using `AUDIO_STALE_OK`. Source: [archive/level-playbook-full.md](archive/level-playbook-full.md) §7 and §10.

## Listening items

- Listening options are not shuffled at runtime (scripts refer to 1–4), so the authored order sets the key. On N5, option 1 was the key in 16 of 24 quick-response items. The options were reordered so keys spread.
- `tests/listening.js` holds every slot at most 45% per format and per mock, and the key the single longest option in at most 40%.
- Author options of similar length from the start. A length cannot change without new clips.
- Quick-response and utterance options are audio only until answered.
- Key spread: see [exam-content.md](exam-content.md).
- Listening shape at N4: task and point = one narrator scene line + 4–7 speaker lines (mean 5.6), each script making the listener track a change of mind, a correction, a reason or a condition. Frame text as N5 (`男の人と女の人が話しています。`, `なんといいますか。`). Registers: plain between friends, polite with coworkers, keigo in service scenes.
- Split listening into sets before the plan exists: mock-1, mock-2, diagnostic, review (with spares for prep drills). No item shared, top slot at most 45% per set. Review items go after the unit that teaches their words. Swap in a spare when one leaks.
- Archetype assignments: every non-dialogue item needs an entry in `tools/audio/man-assignments.json` and `woman-assignments.json` (archetype + one-line reason, read from the transcript). `export-tracks.js` fails otherwise. Dialogues use `cast.json` instead.

## Rendering

- Render from the kana reading (`say`), never the kanji text: the TTS guessed 何人, 四日/八日. The clipKey hashes the spoken text.
- The test hashes the live `listeningScript()` output, not an exported file. A stale clip once contradicted its transcript while a tracks.json check passed.
- CSP needs `media-src 'self' blob:`. Without it no clip played over http(s), and the Web Speech fallback hid it. Verify playback over http(s) in a real browser, not file://.
- The fallback must be visible in mocks (a notice), never silent.
- Particle は/へ in `say` can be spoken ha/he (母は先生です came out ははは): write `[は|わ]` ruby for the clip; the shown text stays は. The catalog check allows only that pair. Check particle lines when listening to a render.
- Later levels reuse the narrator いち, に, さん clips (same clipKey, already in `have`); do not re-render them.
- One v5 session renders every missing clip of every level (dialogue characters and exam voices) from saved references, resumable after a disconnect: `tools/audio/render-notebook-v5.ipynb`. Steps in `tools/audio/README.md` "Rendering with v5". The N4 launch was about 1,380 clips (509 N4 exam, 862 N4 dialogue, 6 N5), 1.5–3 hours on a T4.

## AUDIO_STALE_OK

- When a transcript changes on purpose (a review fix), its clip is stale until the next render.
- Running the suite with `AUDIO_STALE_OK=1` turns only the stale-clip hash check into a warning. Everything else still fails.
- Rules: list every changed line in the branch's rerender notes (id, line, why) at the time of the change. Never use the flag for a line nobody listed. Drop the flag once the owner renders and `build-audio-manifest.js` runs.
- A brand-new item with no manifest track is skipped without the flag.
