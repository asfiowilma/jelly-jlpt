# Process and review loop

Load when: orchestrating a level build, running review rounds, or landing branches. Source: [archive/level-playbook-full.md](archive/level-playbook-full.md) §8. Rules added on N4 are tagged `[N4+]`.

## Rules

- The owner can't check Japanese. Every fact needs ≥2 sources plus a machine check. The lead spot-checks samples from every agent report before merging. Reviewing samples is mandatory: spot checks caught the missing conjugation forms (ticket 36).
- Agents in worktrees: main moves while they work, so land by rebasing in a temporary worktree, then fast-forward. The owner's uncommitted edits block the merge: ask the owner to commit. Delete the branch after landing. Windows locks worktree folders, so prune and delete leftovers. Run tests with `CLAUDE_PROJECT_DIR=$(pwd)` inside a worktree.
- The owner's real progress lives in the browser (PouchDB on file://). For browser checks, use a temporary DB name and do not commit it. Never complete units in the owner's data.
- Long agent runs can die (sleep or shutdown). Commit WIP early as 🚧, then rebase and squash when resuming.
- Keep the map current: mark a ticket claimed in the ticket file and in `map.md` before starting it.
- Run an independent multi-domain audit before each level release (vocab/kanji, grammar/sentences, exam/reading, listening/audio, legal).
- Measure over many seeded builds, not one quiz: leak, key-spread and centre-option rates only show up in aggregate.
- Save repro scripts in the repo or `.scratch/<slug>/`, so the fix check reruns the same measurement.

## `[N4+]` Orchestration

- Orchestrator plus at most 4 subagents at a time. The orchestrator keeps one `STATE.md` (decisions, merged commits, what's in flight, todo order, expected-red list) and writes it after every merge. Subagents get a brief file and scratch output folders; parallel authors never edit the repo.
- One branch per phase (`n4-lib`, `n4-plan`, `n4-data-exam`, `n4-data-mocks`, `n4-achievements`), each in its own worktree, landed by rebase + fast-forward, branch deleted after. No merge commits.
- Serialize shared files: `lib.js`, `index.html` + `tests.html`, `tools/plan-<lvl>.js` / `data/<lvl>/plan.js`, `.claude/hooks/run-tests.js`, the exact-count tests, and `sw.js` (regenerate on every rebase, never merge by hand; rebuild it in the branch's last commit).
- Phase order that worked, each needing the one before: tools take `--level` → ref list → vocab + kanji + KanjiVG → grammar + sentences → lib (forms, level tables) → plan (`READY: false`) → exam content (passages, mondai, listening) → mocks + prep → dialogues → achievements → audio render → review rounds → flip `READY`.
- Model choice: the cheapest that fits. Opus where voice and judgment decide quality (the orchestrator, dialogues, reading texts, the last teacher review of a level). Sonnet for facts and structure (stage, mondai, outline, other reviews, lib changes). Haiku for mechanical work (triage, merges, mocks, small fixes). A skill's or agent's `model:` frontmatter sets the default. Never fable for subagents: it hit the session limit.
- Session-limit and shutdown deaths happened twice in one day. Commit WIP early, write scratch output incrementally (a part file per slice), keep `STATE.md` current, and make every build script rerunnable from its sources.
- Red main between phases is allowed, with a list. Tests that demand a complete level are red on main until their phase lands. The level stays hidden (`READY: false`). `STATE.md` keeps the exact expected-red list; a new red is a bug. The list shrinks to zero before the flip.
- The suite takes about 8 minutes. Run the narrow test file while iterating, and the full suite before each commit.

## Review loop (two personas)

Tests passing proved nothing about quality: in N5 round 1, seven reviewer reports all failed.

- Two personas, fresh agents every round, read-only. Each gets only the rubric and the shipped code. It may not open `CLAUDE.md`, `docs/`, the tests, the authoring tools' decisions, the overrides or any scratch notes. `verified: true`, prior audits and a green suite are claims, not evidence.
  - Expert Japanese teacher: re-derives facts from sources (cached JMdict, KANJIDIC, Wiktionary, Tanos, jlpt.jp, the Tatoeba file), drives `lib.js` headlessly with seeded builds, and solves every mock and drill item before looking at the key. Checks vocab and kanji facts, grammar notes and inventory, sentences and attribution, teaching order, coverage and load, dialogues and listening scripts, exam-format fidelity, distractor tells and answer leaks in aggregate, originality and credits.
  - Complete newbie: knows only baby Japanese, no dictionary, no grammar terms. Walks the level in a real browser over http on a fresh port (fresh storage), unit by unit: reads everything, plays audio, takes every quiz honestly. Reports every point of confusion, feeling cheated, getting stuck or wanting to give up, with screenshots. Judges experience, never Japanese facts.
- Slices: the teacher by domain (vocab-kanji, grammar-sentences, exam-reading, listening-dialogues), every slice loading the whole catalog for cross-cutting checks; the newbie by contiguous unit ranges ending on a review, with prep + mocks as their own slice.
- Severity: blocker = the learner is taught something false, marked wrong for a right answer in a graded quiz or mock, can't proceed, or a legal/source rule breaks. Major = hurts learning or trust for many learners or misrepresents the exam. Nit = polish. A review fails on any blocker or major; nits are logged and never force a round. A finding is one defect class with an evidence list, not a row per occurrence. Unsourceable facts go in an `UNSURE` list.
- Loop: review → collect → fix → re-review with fresh reviewers, who read the previous round's findings for their slice only to confirm fixes and still run the whole checklist. Cap 4 rounds per level; anything open after round 4 goes to `.scratch/<launch>/known-issues.md` and the level moves on.
- Reports: one file per persona and slice, a findings table (id, severity, unit/item, finding, evidence, suggested fix), last line `PASS` / `FAIL` with the three counts. A round passes only when every slice of both personas passes.
- Review-round findings by class are in [archive/bug-history.md](archive/bug-history.md).

## `[N5 r5]` Cheap review runs

- The newbie walks the level through `.claude/review/newbie-walk.js`, not by hand in a shared browser. The orchestrator runs the script once per slice (distinct `--port` each, all in parallel), checks one `summary.json` as a canary, then spawns the reviewer on the JSON. A newbie slice then costs about 70-90k sonnet tokens.
- The walk JSON must carry what the newbie judges: `lessonText` (page text with the lesson dialogue opened), `again: true` on the missed-question retry (the UI tags it "Again · not scored"), and `mock.parts` / `mock.resultsShown` for mock units. Without these, round 5's first newbies judged lessons from quiz text only and filed the retry as a duplicate-question bug.
- Jargon findings recur every round when fixed note by note. Fix them once in code: the "Terms on this page" box (`GRAMMAR_TERMS`, `pageTerms` in `lib.js`) gives a plain line for each grammar term a page uses. Add a row when a note starts using a new term; examples stay in kana, since the box shows on kana stages too.
- Agent files in `.claude/agents/` list Claude Code tool names (`Read`, `Bash`, ...) before the Copilot names, or Claude Code refuses to spawn them. Agent definitions load at session start: after editing one, spawn `general-purpose` told to read the file until the next session.
