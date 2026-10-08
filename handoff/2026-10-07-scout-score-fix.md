# Handoff Brief: Scout Score Naive Bayes Fix

**Date:** 2026-10-07
**Status:** AUTHORIZED FOR BUILD (user approved 2026-10-07)
**Auditor:** Orbit — verified against main @ 5.22.0

## Problem

Scout Score (`NaiveAncestryOracle`, the "Scout Score / Marker Frequency Est."
view) produces flat, wrong continental percentages. A benchmark Iberian
Portuguese sample reads 22.2% European / 18.5% MENA / 16.6% South Asian /
15.2% Native American. A Portuguese sample should be 85%+ European.

## Root cause (verified)

Scout Score is powered by `calculateComprehensiveScores` in
`src/engines/ancestry/comprehensiveEngine.ts` — a naive Bayes classifier
(log-likelihood per continental group, softmax-normalized) that is separate
from the main NNLS oracle.

The frequency lookup has a fatal missing-data default:

```ts
const p = Math.max(0.001, Math.min(0.999, frequencies?.[popCode] || 0.01));
```

When a continental frequency is missing for a marker, it silently defaults
to 0.01. Orbit verified against `src/data/aims/european.json` (656 markers):
AMR missing 36.7%, MENA missing 55.3%, OCE missing 69.1% — all becoming 0.01.

At markers where Europeans genuinely have low derived-allele frequencies
(very common), the 0.01 defaults make MENA/AMR/OCE look nearly identical to
Europeans. Log-likelihoods flatten across groups, the softmax spreads
probability everywhere, and the result is the observed 22/18/16/15 split.

Two compounding issues:
1. `|| 0.01` also corrupts genuine zero frequencies (0 becomes 0.01).
2. This missing-data handling is inconsistent with the main NNLS oracle in
   `src/components/ancestryOracleLogic.ts`, which imputes the empirical mean
   of defined continental frequencies (a sound approach).

## Fix (preferred)

Replace the naive Bayes continental estimation in Scout Score with the
Pass 1 continental NNLS proportions the main oracle already computes
(`continentalProportions` in `ancestryOracleLogic.ts` → `solveAdmixtureProportions`
over `CANONICAL_CONTINENTAL_CLADES`). This:
- reuses the validated Patterson-standardized NNLS path,
- handles missing frequencies via mean imputation (consistent with the rest
  of the app),
- eliminates the duplicate estimator entirely.

`NaiveAncestryOracle.tsx` currently reads `results?.naiveEstimates`. Wire it
to the NNLS continental proportions instead. Keep the component's trait-driver
section (DRIVER_SNPS) untouched — only the percentage computation changes.

If a full swap is risky, the minimum viable fix is to replace the 0.01
default with the same empirical-mean imputation the NNLS path uses, and fix
the `||` to distinguish missing (`undefined`) from genuine zero. But the
preferred fix is the swap — one estimator, not two.

## Verification

1. Run the benchmark Iberian Portuguese file through Scout Score: European
   must be dominant (85%+). Report the full 8-group distribution.
2. Run at least two other benchmark profiles (one African, one East Asian):
   dominant continental group must match expectation.
3. `npm run validate:data`, `npx vitest run`, `npx tsc --noEmit` all green.
4. No new estimators, no duplicated frequency logic.

Note: every Scout Score result produced before this fix is suspect. Do not
attempt to backfill or correct historical results — fix forward only.

## Delivery

Side branch, push, update `handoff/STATUS.md`, report back for Orbit
verification. No PR, no merge without Jequan's go-ahead + Orbit verification.

**Model:** Gemini 3.1 Pro Low
