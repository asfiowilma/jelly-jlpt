# Review rubric: common rules

Shared by every persona and slice. Read with [index.md](index.md), [known-open.md](known-open.md) and `levels/<level>.md`.

## A1. What you are

Independent reviewer. Judge only what ships. No author reasoning; do not seek it. Prior audits, tests, `verified:true` = claims, not evidence: re-derive everything reported. "Test suite green" is never a finding.

## A2. Paths you MAY read

| Path | Why |
|---|---|
| `data/catalog.js`, `data/<level>/*.js` (file list in `levels/<level>.md`) | shipped content = review target |
| `lib.js` | only to understand/drive question generation headlessly (`makeQuestion`, `mondaiQuestions`, `pickDistractors`, `quizSentences`, `taughtIds`, `conjugate`, `checkTyping`, `mockSections`, `listeningScript`, `dialogueView`, `dialogueSpeech`, `prepDrill`, `mockEstimate`) |
| `app-helpers.js`, `components/*.js`, `index.html`, `styles.css`, `sw.js` | newbie only, find UI dead ends; teacher only `components/settings-view.js` `CREDITS` |
| `run-tests.js` (vm loader at top) | copy loader to run `lib.js` + data in Node; test bodies not evidence |
| `tools/ref/<level>.json`, `tools/ref/README.md` | reference list (Tanos lineage) level claims to cover |
| `tools/coverage.js` | run: `node tools/coverage.js` |
| `.scratch/content-audit/research/data/vocab-<level>.json`, `kanji-<level>.json`, `grammar-<level>.json` | Tanos + elzup (vocab/grammar); KANJIDIC via kanji-data (kanji: `strokes`, `on`, `kun`, `meanings`) |
| `.scratch/content-audit/research/data/jisho-cache/<keyword>.json` | cached Jisho/JMdict (1,381 files, `{keyword, fetched, data:[{slug, jlpt, japanese:[{word,reading}], senses:[{english_definitions, parts_of_speech}]}]}`) |
| `.scratch/content-audit/research/data/wiktionary-kanji/` | 2nd source, kanji strokes |
| `.scratch/content-audit/research/data/tatoeba/` (`pairs-jpn-eng.jsonl`, `n5-candidates.json`) | Tatoeba pool: attribution, text |
| `docs/review/**` | this rubric |
| `.claude/review/newbie-walk.js` | run only (newbie persona, `node` command in agent file); never read its source |
| own output folder `.scratch/n4-launch/review/<level>/r<round>/` | |

## A3. Paths you MUST NOT open

`CLAUDE.md`; `docs/` except `docs/review/`; `.scratch/n5-audit/`; `.scratch/content-audit/` except `research/data/`; `.scratch/lesson-dialogs/`; `.scratch/roadmap/`; `.scratch/n4-launch/` except own output folder; `tests/`; `tools/*.js` except `coverage.js` (encode author decisions); `tools/n5-grammar-notes.md`; `tools/*-overrides.json`; git log; any chat/session log under `C:\Users\ACER\.claude\`. Opened by mistake: say so in report header, do not use it.

## A4. Facts come from sources, never memory alone

- Readings, meanings, pos, verb class, JLPT tag: `jisho-cache/<word>.json`. Not cached: fetch `https://jisho.org/api/v1/search/words?keyword=<word>` at most 1/s, save nothing into cache folder, cite URL + `slug`.
- Kanji readings, strokes, meanings: `kanji-<level>.json` (KANJIDIC). Strokes need 2nd source: `wiktionary-kanji/`.
- Level placement: `vocab-<level>.json`, `kanji-<level>.json`, `grammar-<level>.json` (Tanos). Tanos wins over Jisho `jlpt` tags, Genki, Bunpro, JLPT Sensei. Tanos lists word at several levels: lowest right.
- Exam format: `https://www.jlpt.jp/e/guideline/testsections.html`; composition table linked from `https://www.jlpt.jp/e/topics/202009091599642827.html`. Composition numbers per level in `levels/<level>.md`; fetch the table for the level yourself.
- Tatoeba text/authorship: `tatoeba/pairs-jpn-eng.jsonl`, else `https://tatoeba.org/en/api_v0/sentence/<id>`.
- Unsourceable fact: report `UNSURE`; never a finding, never silently dropped.

## A5. Headless run

Copy vm loader from top of `run-tests.js` into script in output folder: load `data/catalog.js`, then every `data/*/*.js` sorted, then `lib.js`. Seed `Math.random` (any LCG), state seed. Build units `buildUnits(PLAN, CATALOG)`; unit id pattern in `levels/<level>.md`. Save every script; name in report so fix can rerun.

## A6. Conduct

Read-only. No edit, commit, `tools/build-sw.js`, no writes outside output folder. Do not complete units in anyone's real data (C2). Do not re-report known-open items unless worse ([known-open.md](known-open.md)).

## D. Severity

| Severity | Definition | Examples |
|---|---|---|
| **blocker** | Learner taught something false, marked wrong for right answer in pass-gated quiz/mock, cannot proceed, or project breaks legal/source rule | wrong reading/gloss; wrong mock key; generated lesson-quiz question with two correct options; quiz with no question line; copied jlpt.jp item; Tatoeba author not shown; audio never plays over http; console error stopping a unit |
| **major** | Hurts learning/trust for many learners or misrepresents exam, workaround exists | teaching-order leak (sentence with later-taught words in lesson quiz); listening keys biased to one slot; answer visible in prompt; fair English answer rejected; bridge-less untaught word in dialogue; mock counts/timing off official table; grammar note missing core use an item relies on; false prep guide claim; non sequitur dialogue line; Practice swap rebuilding a line; lesson far above load guide; term used before defined that newbie cannot get past; service worker serving stale app |
| **nit** | Polish | stale comment; U+3000 spacing in option; weaker translation nuance; odd but grammatical collocation; joke not landing; one single-kana question too many |

Rules:
- Review FAILS on any blocker or major. PASSES with only nits.
- Nits logged, not looped: fixers may batch or leave; never force new round.
- Loop: review, collect, fix, re-review with fresh reviewers. Cap 4 rounds per level. Open after round 4 goes to `.scratch/n4-launch/known-issues.md`, level moves on.
- Finding = one defect class with evidence list, not row per occurrence ("15 lesson quizzes leak later words (list)" = one major).
- Unsourceable goes to `UNSURE` list; no severity, does not fail review.

## E. Report format

File: `.scratch/n4-launch/review/<level>/r<round>/<persona>[-<slice>].md`, e.g. `review/n5/r1/teacher-vocab-kanji.md`, `review/n5/r1/newbie-u001-u040.md`. Scripts + screenshots next to it.

```
# <Persona> review: <level> round <n>, slice <name>

Reviewer: fresh agent, read only. Paths read: <list>. Paths opened by mistake: none.
Method: <loader, seeds, builds per unit, sources fetched, time per unit for the newbie>.
Coverage: <what was checked exhaustively, what was sampled, sample sizes>.

## Findings

| id | severity | persona | unit / item | finding | evidence | suggested fix |
|---|---|---|---|---|---|---|
| T1 | blocker | teacher | v:終る|おわる, vocab.js:412 | headword uses obsolete okurigana; 終わらない rejected | jisho-cache/終わる.json slug 終わる first; answerIsRight('終わらない') false (script t1.js seed 42) | headword 終わる, keep 終る as alt, accept both |
| N1 | major | newbie | n5.u033 | quiz asked 毎晩 which no lesson so far showed | n5.u033-04.png, question "私は毎晩11時に寝る", expected only taught words | pick a sentence whose words I know |

## Unsure
- <fact>, why it could not be sourced, what was tried.

## Verdict
FAIL: 2 blockers, 5 majors, 11 nits   (or)   PASS: 0 blockers, 0 majors, 7 nits
```

Ids: `T<n>` teacher, `N<n>` newbie, unique within file. Severity exactly `blocker`/`major`/`nit`. Verdict = last line, exactly `PASS`/`FAIL` + three counts. Orchestrator merges slices into `review/<level>/r<round>/SUMMARY.md`; level passes round only when every slice of both personas passes.
