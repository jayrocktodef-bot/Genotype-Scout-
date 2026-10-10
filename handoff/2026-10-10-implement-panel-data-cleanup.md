# IMPLEMENT: Panel Data Cleanup (12,531 Validator Violations)

**Date:** 2026-10-10
**Branch:** Create from main: cleanup-panel-data
**Status:** Approved by Jequan — implement now
**Prerequisite:** harden-data-validator branch must be merged first, OR
  work from the harden-data-validator branch as base so the new checks
  are available during cleanup.

---

## Context

The hardened validator (harden-data-validator branch) exposed 12,531
hard rule violations in the existing panel data. These are real data
quality issues that were previously invisible:

1. **Missing/generic descriptions** — widespread empty descriptions or
   the generic "Ancestry Informative Marker" template
2. **Missing tiers** — tier is overwhelmingly undefined across panels
3. **Separation failures** — markers below the 0.10 hard threshold
   (e.g., CAS markers down to 0.0024, EUR markers down to 0.0389)

## Task

Fix all 12,531 violations across all panel JSONs in src/data/aims/.

### Priority 1: Separation failures (hard fails)

For every marker below 0.10 separation:
- If the marker has genuine informativeness for its panel despite low
  separation (e.g., it's part of a haplotype block or has high combined
  informativeness), document the justification in the marker's
  description and flag for Orbit review.
- Otherwise, remove the marker from the panel. Do not keep weak markers
  just to preserve count.

### Priority 2: Missing tiers

Assign every marker a tier from the valid set:
- `diagnostic` — high separation, panel-defining
- `highly-informative` — strong separation
- `informative` — moderate separation
- `supporting` — low but useful separation

Use the separation values to guide tier assignment. Be honest — don't
inflate tiers to make the data look better.

### Priority 3: Missing/generic descriptions

Write a proper description for every marker with empty or generic text.
Each description must:
- Name the panel/region the marker informs
- Describe what the marker distinguishes (e.g., "Distinguishes West
  African from East African ancestry")
- NOT be copy-pasted from another panel
- NOT use the generic "Ancestry Informative Marker" template

## Rules

- Do NOT weaken the validator thresholds to make violations disappear.
- Do NOT delete markers en masse without checking if they're load-bearing
  for the NNLS engine. If removing a marker would break the panel,
  flag it for Orbit review instead.
- Every change must keep `npm run validate:data` passing with zero new
  violations (the count should go DOWN, not up).
- Work panel by panel. Commit after each panel is clean so progress is
  trackable.
- If a panel has so many violations that it's effectively unusable,
  report that instead of papering over it.

## Process

- Branch from main (or from harden-data-validator if not yet merged):
  cleanup-panel-data
- Run npm run validate:data after each panel — violations must decrease
- Run npx vitest run, npx tsc --noEmit — all green
- Push, do NOT open a PR or merge
- Update handoff/STATUS.md with per-panel violation counts
- Report back for Orbit verification

Model: Gemini 3.1 Pro Low.
