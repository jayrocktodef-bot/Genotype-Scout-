# Genotype Scout Ship Checklist

**Date:** 2026-10-10
**Goal:** Ship main to production cleanly, with zero known bugs.
**Status:** Draft — awaiting Jequan's go-ahead on each phase.

---

## Phase 1: Pre-deploy (Antigravity)

- [ ] Merge `romani-proxy-v0` → main (Orbit-verified, awaiting merge)
- [ ] Run full validation on main:
  - [ ] `npm run validate:data` — must exit 0
  - [ ] `npx tsc --noEmit` — must pass with zero errors
  - [ ] `npx vitest run` — must pass (known flaky: auditRegressions20261003.test.ts timeout, unrelated)
- [ ] Confirm the PGx TypeScript fix from merge 56999e7 is clean (no regressions)
- [ ] Report validation results to Orbit before proceeding

**Do not proceed to Phase 2 until Orbit confirms Phase 1 is green.**

---

## Phase 2: Deploy (Jequan or Antigravity)

- [ ] Deploy main to production (Vercel)
- [ ] Confirm deployed version is NOT v5.22.0 (that's the stale build)
- [ ] Confirm the deployed commit SHA matches main tip
- [ ] Report the live version number

**Current production:** v5.22.0 (none of today's 8 merges are live)

---

## Phase 3: Post-deploy verification (Orbit + Jequan)

Each item must be checked on the LIVE site, not just in code.

### Critical (ship-blockers if broken)

- [ ] Scout Profile loads without crashing (PR #22 fixed this, never confirmed live)
- [ ] Native Roots dashboard card appears and routes to `native_roots` correctly
- [ ] Native Roots broadened detection works (mtDNA A/B/C/D/X, Y-DNA subclade gating)
- [ ] Disease-risk consent flow works (age gate, opt-in, trait masking)
- [ ] PGx reports show informational copy, no prescribing language

### Known unresolved bugs (investigate, may not block ship)

- [ ] Chromosome Painter: overview shows one ethnicity, detail view shows several
      (source review needed: `ChromosomePainter.tsx`, `getSegmentColor`)
- [ ] Ti/Tv ratio displays 5.19 — calculation source unidentified
      (screenshot: `workspace/user/files/752_0_kky3.png`)
- [ ] Scout Score "looks off" per testers post-NNLS-fix
      (need: screenshots, expected vs shown, whether testers re-ran kits)

### Smoke test

- [ ] Upload a test kit, run full analysis, no console errors
- [ ] Check all 8 dashboard cards route to the correct views
- [ ] Verify no synthetic rsIDs in any panel output

---

## Deferred (not ship-blockers)

- Romani AIM panel (`romani.json`) — blocked on Font-Porterias 2019 dataset
- Blog integrity fixes — separate from app ship, in progress
- Endogamy phases 2-4 — parked
- Recombination map painting — parked

---

## Sign-off

- [ ] Jequan approves ship
- [ ] Production version confirmed live
- [ ] Post-deploy verification complete
- [ ] Known bugs triaged (fixed or documented as known issues)
