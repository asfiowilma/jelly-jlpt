---
name: merge-and-gate
description: Land a finished worktree branch on main. Rebase on main, rebuild sw.js, run the full suite on the rebased tip, fast-forward main, then remove the worktree and branch. Use when a fixer or builder branch is ready, or when asked to merge and gate, land a branch, or ff-merge. Never pushes.
model: haiku
---

# merge-and-gate

Input: branch name `<branch>`. Worktree: `.claude/worktrees/<branch>`. Repo root: `d:\projects\jelly-jlpt`. Callers: orchestrator only. Fixers and authors commit and stop; they never merge.

## Steps

1. Check state. In the worktree, `git status --porcelain` must be empty. If not, stop and report.
2. Rebase. In the worktree, run `git rebase main`.
   - Conflict in `sw.js`: `git checkout --theirs sw.js`, then `node tools/build-sw.js`.
   - Conflict in generated data (`data/<level>/*`, `audio/manifest.js`, `kanji-svg/strokes.js`): take main's version, then rerun the tool named in the file header. Never hand-edit.
   - Any other conflict: stop. Run `git rebase --abort`. Report the conflicting files. The caller re-runs on sonnet.
3. Rebuild sw. Run `node tools/build-sw.js` in the worktree. If `sw.js` changed, commit it on the branch as its own commit (`🔧 Rebuild sw.js`).
4. Gate. Run the full suite on the rebased tip, in the worktree, in the foreground:
   `AUDIO_STALE_OK=1 CLAUDE_PROJECT_DIR=$(pwd) node .claude/hooks/run-tests.js > .scratch/n4-launch/tests-<branch>-gate.log 2>&1`
   - Takes about 8 min. Wait for the `Tests:` line. Read only that line and the failures.
   - Any failure: stop, do not merge. Report failing test names and the log path.
   - Empty output or the run died: rerun once.
   - `build-exercises-n3-plus` "conjugation generated" is a known flaky test (ticket: `.scratch/roadmap/flaky-conjugation-test.md`). If it fails, rerun once. Report both results.
   - Audio-check warnings are not failures.
5. Fast-forward. From the repo root (on main, clean), run `git merge --ff-only <branch>`.
   - Not fast-forwardable: stop, go back to step 2.
   - Never create a merge commit.
6. Verify. `git log --oneline -3` on main and `git status` clean.
7. Clean up, only after step 5 succeeds:
   - `git worktree remove .claude/worktrees/<branch>`
   - `git branch -d <branch>` (lowercase, so git refuses if not merged).
8. Report: branch, gate result line, main tip hash, `sw.js` changed yes/no, worktree and branch removed yes/no.

## Hard rules

- Never push. Never force-push.
- Never use `git reset --hard`, `git clean`, `git branch -D`, or `git worktree remove --force`.
- Never delete the branch before the ff merge is confirmed.
- No Co-Authored-By line in any commit.
- Set `CLAUDE_PROJECT_DIR=$(pwd)` and `AUDIO_STALE_OK=1` in the env for any commit in the worktree. Without it the pre-commit hook tests main.
- Run commits in the foreground. Commits from background commands skip the Claude PreToolUse hook.
- Do not touch other worktrees.
- Do not start a second merge while a suite is running on main.
- Do not remove the `AUDIO_STALE_OK` flag. The owner removes it after the audio render.
