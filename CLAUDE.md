# CLAUDE.md — jelly-jlpt

Free browser-only Japanese course for JLPT. Separate project (upstream no longer synced).
N5 and N4 built, N3–N1 "Coming soon" until rebuilt. Nothing is locked; every unit is open.

## Hard constraints

- **No build step, npm, bundler or ES modules.** Classic `<script src>` globals; React and
  PouchDB vendored in `vendor/`, no CDN.
- **Script load order is load-bearing** (see comment atop `<body>` in `index.html`). A new file
  needs its `<script src>` added by hand in `index.html`, `tests.html`, and `run-tests.js`
  `appFiles` (components only).
- **PWA: relative paths only** (no leading `/`, no absolute URLs). After changing ANY shipped
  file, run `node tools/build-sw.js` and commit `sw.js`. A new top-level shipped file type goes in
  `listFiles` in `tools/build-sw.js`.
- **Never hand-edit generated files**: `sw.js`, `data/n5/{vocab,kanji,plan,read-words}.js`, `data/n4/{vocab,kanji,plan}.js`,
  `audio/manifest.js`, `kanji-svg/strokes.js`, and `data/<level>/mocks.js` for levels built with
  `tools/author-mocks.js` (the N5 and N4 mock files are hand-written). Change the input (overrides JSON, plan outline,
  etc.) and rerun the tool named in the file header.
- **Ids are stable.** Catalog ids are content-keyed. Once a level ships, never reuse or
  renumber unit ids.
- **Device-only prefs** (palette, theme, TTS rate, sfx mute) stay in localStorage and never
  sync. No migration from the old day-keyed data.

## Content rules

Japanese facts come from research against sources, never from the project owner. Don't ask
the owner Japanese questions. Building a new level: read `docs/playbook/index.md` first, then the files it lists for your task.

1. **Authority order**: jlpt.jp (format, scoring) > Tanos (levels) > Jisho/JMdict, KANJIDIC
   (authoring-time checks only) > Tatoeba (sentences) > JLPT Sensei / Tofugu / NHK Easy
   (cross-check, links only).
2. **Verified** = ≥2 independent sources plus automated checks. Less ships `verified:false`
   with the reason in `notes`.
3. **Never copy** text, items or audio from jlpt.jp workbooks, JLPT Sensei or NHK Web Easy.
   Link out; write original items in official formats.
4. **No bulk EDRDG data** (JMdict, KANJIDIC are CC BY-SA): check facts, don't ship fields.
5. **Explanations in our own words.**
6. **Attribution**: every third-party source gets a credit in `CREDITS`
   (`components/settings-view.js`). Tatoeba sentences keep id, `author`, `license`, and
   `enId`/`enAuthor`/`enLicense`. KanjiVG SVGs stay separate files.

## Tests

The suite must pass before every commit, push and release: `node .claude/hooks/run-tests.js`
(the pre-commit hook enforces the commit gate). There is no tier flag. In a git worktree run
`CLAUDE_PROJECT_DIR=$(pwd) node .claude/hooks/run-tests.js`, else the hook tests main.

## Commits

Gitmoji: `<emoji> <Imperative message>`. One emoji, no scopes, brackets or colons in the
subject. Body only when the why isn't obvious. Linear history, no merge commits.
NEVER include claude as co-author in any commit messages. If you find yourself doing this, stop and rewrite the commit message. 

## Docs and tickets

Tickets: local markdown in `.scratch/<slug>/` (gitignored), see `docs/agents/issue-tracker.md`.
Domain docs: `docs/adr/`, see `docs/agents/domain.md`.
Content review rubric (per-level, per-persona): `docs/review/index.md`. Load only the files it lists.
