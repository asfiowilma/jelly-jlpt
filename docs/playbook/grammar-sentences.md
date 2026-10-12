# Grammar inventory and example sentences

Load when: building the grammar inventory, grammar entries, or Tatoeba sentences. Source: [archive/level-playbook-full.md](archive/level-playbook-full.md) §2 and §3. The Tatoeba match tables are in [tatoeba-hints.md](tatoeba-hints.md). Mark N4-added rules with `[N4+]`.

## Inventory

- The Tanos grammar list is patterns only and misses the conjugation forms. Add form points explicitly (ます / ません / ました, dictionary form, て / ない / た forms, copula past), and place them before every pattern built on them.
- The Tanos list is thin: 40 points at N5, against 84 at JLPT Sensei. Use JLPT Sensei names only as a gap checklist. A gap counts only when a second source confirms its level (Bunpro, Genki index, japanesetest4you). Never copy their text.
- Some extras are really vocabulary (いつも, とても). Do not pad the grammar catalog with them. N5 shipped `g:itsumo` and `g:totemo` anyway and keeps them (decision 2026-10-12): ids are stable once a level ships, their notes teach a usage contrast (frequency scale; とても vs あまり + negative), and retiring them would churn ~25 `uses` lists and the gap pools for no learner gain. Do not repeat this at N4+.
- `[N4+]` Method (per-point record in `tools/n4-grammar-notes.md`):
  1. The 50 Tanos names are must-cover. An entry's `ref` spells the Tanos name exactly as in `tools/ref/<lvl>.json`. One entry may answer two names (～よう / ～おう).
  2. JLPT Sensei names are the gap checklist. CONFIRMED when Bunpro, japanesetest4you or Genki II puts it at the level. DISPUTED (Tanos files it higher) waits for that level. UNCONFIRMED or really a word is dropped.
  3. Form points the patterns rest on, as their own entries: potential, imperative, prohibitive な, noun-modifying clauses, adjective/noun て-form, なくて, ていた, plus six basic keigo entries.
  4. Order into teaching blocks, each form before every pattern built on it.
- `[N4+]` Ship what the sources support, not a round number. N4 shipped 94 core + 2 optional = 96. Splitting entries to reach a round number is padding.
- `[N4+]` Read ambiguous Tanos names against other sources. Bare ～られる became the passive, with the potential as a separate `offList` entry. Garbled ～のようてほしい is ～てほしい (three sources agree). Run the end-of-run check that every Tanos name is covered.
- `[N4+]` Every inflected point gets an `hl` (regex sources; first capture group marked). Particles and nouns don't. Test each against the point's own examples (`dialogueGrammarRes` in `lib.js`).
- `[N4+]` `conjForm` on every form point, and the form must exist in `CONJ_FORMS`. New forms are appended so existing indexes hold.
- `[N4+]` Causative-passive: godan verbs take the short 〜される (飲まされる), except す-verbs (話させられる). Ichidan, する and 来る take the long させられる form.
- `[N4+]` Tanos level beats a textbook level, but say so in `notes`. 〜始める is Tanos N3 yet confirmed N4 by Bunpro and japanesetest4you: shipped at N4 with the Tanos level in `notes`. ことになる, ようになる, らしい, まま and たばかり stay at N3.

## Example sentences

- Candidate matching is loose. Check every pick by hand.
- Unreviewed furigana can be wrong (行った read as おこなった, 二人 as ににん). Verify every reading.
- Attribution: skip sentences with no recorded author. Prefer native authors, and pick the most accurate English translation among the alternatives.
- Tatoeba audio is not a listening source. Only 27 Japanese clips are CC BY.
- Teaching order (ADR 0002): quiz and lesson-example sentences use only taught items (`quizSentences`, `untaughtCount` over `uses`; an `alt` spelling counts as taught). `tests/teaching-order.js` is a ratchet: zero leaks, empty exception list.
- `[N4+]` `uses` must be complete, form ids included: every grammar id the sentence exemplifies, every form it relies on (`g:te-form`, `g:ta-form`, `g:nai-form`, `g:te-iru`, `g:potential`, `g:ba`), every kanji (`k:`), and every content word (`v:`, exact catalog key). A test checks that N5 sentences list the て / た / ない form they show.
- `[N4+]` Words outside the catalog count as untaught. Prefer sentences whose every word is in the catalog of this level or lower.
- `[N4+]` The surface rule decides what `uses` can hold. A form id is listed only where its token is visible (`g:te-iru` is not on contracted 〜てる; `v:する` is not on すれば). Write patterns so the rule finds them in every example.
- `[N4+]` The kanji rule cuts natural sentences. At N4, 合, 必 / 要, 降, 回, 寝, 番, 全 / 然, 頃, 召, 申, 参 are not on the N5/N4 lists, so own sentences write those words in kana.
- `[N4+]` Own sentences for each block's first points, using only N5 words plus the point. N4: 417 sentences, 284 Tatoeba and 133 own, 46 chunk sets for ★ ordering.
- `[N4+]` Two authors, one brief, one validator. The validator checks: ids unique across levels; every `examples` / `uses` id exists; furigana, jp and reading agree; no kanji outside ruby, and every kanji at or below the level; chunks concatenate and do not cut ruby; every `hl` matches ≥1 example; the surface rule finds every listed id; Tatoeba text and all six attribution fields equal the source file. Zero errors before handing in.
