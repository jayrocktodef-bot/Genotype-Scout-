# Handoff folder — Orbit ↔ Antigravity contract

This folder is the standing contract between Orbit (analysis, specs, verification)
and Antigravity (implementation). Task briefs live here instead of chat pastes.

## How it works

1. Orbit writes the next task as `handoff/YYYY-MM-DD-<slug>.md` with: goal, exact
   steps, acceptance criteria, and what "done" looks like.
2. Antigravity picks up the newest open task, works it on the task branch, and
   updates `handoff/STATUS.md` when pushed.
3. Orbit independently verifies the diff against the brief's acceptance criteria
   before anything merges to main.
4. Nothing merges to main without Jequan's go-ahead plus Orbit's verification.

## Brief conventions

- One task per file. Briefs are self-contained: no assumed chat context.
- Reference exact paths, commits, and expected counts. No "as discussed."
- Public reference data only — never commit raw genomic data of living individuals,
  credentials, or secrets.

## Current queue

See `handoff/STATUS.md`.
