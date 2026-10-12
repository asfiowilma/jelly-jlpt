# Lesson dialogues

Load when: writing or validating lesson dialogues. Contract and full rules: [../dialogue-authoring.md](../dialogue-authoring.md).

- One dialogue per lesson. Reviews get none. N4: 87 dialogues.
- Writers work in batches by unit range. Each writes `batch-<n>.js` (items), `batch-<n>-map.json` (unit id → dialogue id) and `batch-<n>-notes.md` (pairings, threads, bridges, `say` overrides, unsure). The map is converted to the `DIALOGUES` map in `tools/plan-<lvl>.js`, keyed by lesson title. Later batches read earlier notes first. Batches can run in parallel once the plan exists.
- Brief:
  - Compute `taughtIds(unit)` from the real plan.
  - At most 3 glossed bridges.
  - The unit's grammar used clearly, ideally 2 to 3 ways.
  - At least 4 of the unit's new words, naturally.
  - Register follows what is taught (keigo only after the keigo block).
  - 6–10 lines, each answering the last, a small arc, at most one humour beat, no catchphrases or copied lines.
  - Remixes swap one detail and never rebuild a line. Canon names only.
  - Use `say` where `dialogueSpeech` gets a reading wrong.
  - Pairs must read naturally. Yor and Anya is the default pair. Yor and Killua are not friends (coworkers is fine). Loid and Yor speak politely to each other.
  - Honorifics follow the canon speaker: -kun where the character would use it (Kakashi and Sakura call Sasuke -kun). Don't force -san. If the vocab needs -san, change the scene and cast.
  - Pick the scene so the stage's vocab appears naturally.
  - Every line follows from the one before. A reply answers a question or states a fact, with its subject set up (no bare "aru").
  - Jokes must make sense on a second read.
  - Remixes: 2-3 per dialogue (owner preference; the validator allows 1-3).
- One shared validator: loads the catalog, `lib.js` and the batch; attaches dialogues to units from the map; runs `dialogueErrors` / `ownTextErrors` plus `tests/dialogue.js` logic (teaching order, bridges, grammar marked in `dialogueView`, remix-not-rebuild, cast matches `cast.json`). Run with `--speech` to print every line's speech text to read. Zero errors before handing in.
- Line order matches the script. Check every stage, not only the one reported.
- Spawn a reviewer agent to double-check fixes after order or remix changes.
- Threads: keep a running list. Close or hand on per batch. Pairing rotation: no pair repeats within 6 stages, and every character appears regularly. Record the unit → pair table in batch notes.
- Library limit: a same-spelled word blocks the grammar mark. `dialogueView` marks the unit's new words before its grammar, and a marked cell cannot take a grammar mark. When the unit teaches a word spelled like its grammar point (それに / それでも, 予定, やすい / にくい, 間, 場合), the point gets no mark. Fix belongs in `lib.js` (grammar match wins) before dialogues land. Writer workarounds: no phrase space before くれ / ありがとう; potential forms instead of もらう forms; `unmark` for a look-alike (開いて vs 開く).
- Words the catalog lacks stay out of `uses`. Set phrases (ありがとう, すみません) are allowed by rule. Common words not on the list (すごい, ちゃんと, メール) are avoided. Note each case.
- `say` overrides found by reading `--speech`: 答え became 答, 帰る became 変える, なっていきます became 生きます, おばさん became 伯母さん, 〜てみる became 見る, ておく became 置く, この became 子の, ひとりで became 火とりで, and かえば could be heard as 帰る (written 買えば).
- N4 threads closed: trip, moving, part-time job, Sasuke + Sakura, Kakashi late, Yor's cooking. Left open for N3: Anya's school, Maomao testing medicine, Emilia's job hunt.
