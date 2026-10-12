---
name: triage-findings
description: Turn one review round's reviewer reports into a single fix-batches-<level>-r<N>.md. Use after all reviewer slices for a round finish, or when asked to triage or batch findings. One triage per round. Writes no code.
model: haiku
---

# triage-findings

Input: `.scratch/<level-folder>/review/<level>/r<N>/` reports (`teacher-*.md`, `newbie-*.md`).
Output: `.scratch/<level-folder>/fix-batches-<level>-r<N>.md`, plus one status line in `STATE.md`. Nothing else.

## Model

Haiku by default. Switch to sonnet if the round has more than 40 findings or a root cause spans several files. Never opus.

## Steps

1. Wait for every reviewer slice of the round. Never triage a partial set.
2. Keep finding ids as written (`T<n>` teacher, `N<n>` newbie). Ids are unique only within one report, so prefix each with its report slug in batch files, e.g. `teacher-vocab-kanji/T1`, `newbie-u001-u036/N3`.
3. Sort by severity:
   - blocker, major: batch.
   - nit: row in `known-issues.md`. Not batched.
   - unsure: list under "Unsure". Not batched.
4. Group into batches. One batch = one fixer = one surgical change. Same root cause or same function: one batch. Batches touching the same function run serially, flagged in "after".
5. Anything the owner must choose goes under DECISIONS with options and a recommendation. Batches that depend on it say so in "after".
6. Write the batch file (format below) with a coverage check: every blocker and major id maps to a batch.
7. Append to `STATE.md`: `<date> triage rN DONE: <n> batches, <m> decisions, nits to known-issues`.

## Batch file format

```
# <Level> round <N>: fix batches

Source: review/<level>/r<N>/. Scope for re-review: <units or ids touched by the fix wave>.

| batch | title | covers | severity | files | ~lines | after |
|---|---|---|---|---|---|---|

Order: <dependencies>.

## <id> <title>
- Findings: <ids, one line each>
- Root: <cause, one line>
- Touch: <exact functions, keys, ids>. No "clean up".
- Proof: <check and expected result>
- Tests: <named test files>
- Diff: ~<n> lines. Rerender: yes/no.

## DECISIONS (owner)
- DECISION-<n>: <question>. (a) ... (b) ... Recommend (b): <reason>.

## Leave as nit
<ids, one phrase each, target known-issues.md>

## Unsure
<ids and what could not be sourced>

## Coverage check
Blockers: <ids> -> <batches>. Majors: <ids> -> <batches>. Gaps: <none or list>.
```

## Rules

- Batch diff about 40 to 90 lines. Split bigger work.
- Ids are never renamed between rounds.
- Do not spawn fixers. The orchestrator does that, one batch each.
- No second triage in the same round. Late findings go to the next round.
- Never hand-edit generated files. Name the input and the tool that regenerates them.
- Never open or copy official exam PDFs. If a reviewer used a sample, the batch says so.
- No Co-Authored-By anywhere.
