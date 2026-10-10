# IMPLEMENT: K61 Panel Remediation

**Date:** 2026-10-10
**Branch:** Create from main: fix-k61-panel
**Status:** Approved by Jequan — implement now
**Trigger:** Beta tester (Emmy Wood) reported Global K61 results "completely
  off the rails" — French/Western European as #1 match for South Asian
  ancestry, GERMAN_AM and ITALIAN_AM appearing in results.

**Audit:** Orbit audited `ho_modern_reference_kernel.json` (35.3 MB, 259 pops)
  and `graf_10k_index.json` (8,821 markers) on 2026-10-10. Findings below.

---

## Problem 1 (CRITICAL): Admixed sink populations in NNLS basis

These 5 populations pass the engine's ≥7000-marker filter and sit in the
basal NNLS basis, violating the standing invariant:

- ASW (African-American, region mislabeled "Africa")
- MXL (Mexican-American)
- PUR (Puerto Rican)
- CLM (Colombian)
- ACB (Afro-Caribbean, region mislabeled "Africa")

**Fix:** Remove all 5 from `ho_modern_reference_kernel.json`. They may be
re-added later as distance-ranking-only references, but they must NOT be
in the NNLS basis matrix.

**Invariant:** "Admixed sink populations (ASW, MXL, PUR, CLM, Melungeon)
never go in the basal NNLS basis — 1-to-1 distance ranking only."

---

## Problem 2 (CRITICAL): 11 US-demographic populations in basis

These are not Human Origins references. All have 8,199-8,200 markers:

- AFRAM_NORTHEAST, AFRAM_SOUTH, AFRAM_WEST
- CUBAN_AM, DOMINICAN_AM, FILIPINO_AM
- GERMAN_AM, IRISH_AM, ITALIAN_AM
- VIETNAMESE_AM, LOUISIANA_CREOLE

**Fix:** Remove all 11 from the kernel. LOUISIANA_CREOLE is itself admixed
and doubly disqualified.

---

## Problem 3 (CRITICAL): Engine filter comment is false

`humanOriginsEngine.ts` line 81 claims the ≥7000 filter "cleanly isolates
the 222 primary Human Origins populations and excludes sparse proxy panels."
It does not — the basis includes the sinks, US demographics, `romani_proxy`,
`lemba_proxy`, and three `sgdp_ignore_*(discovery)` artifacts.

**Fix:** After removing the populations above, update the comment to reflect
reality. Also fix the "K61" naming — the basis has 222 populations, not 61.
Either rename or document why "K61" is used.

---

## Problem 4 (HIGH): romani_proxy region mislabeled

`romani_proxy` has `region='Americas'`. Romani are a European/South Asian
diaspora population.

**Fix:** Change region to `'Europe'`.

---

## Problem 5 (HIGH): 19 markers with wrong chromosome in graf index

All labeled `chr='X'` but positions match autosomal GRCh38 coordinates:

- rs1426654 (SLC24A5): listed X:48426484 → true chr15:48426484
- rs16891982 (SLC45A2): listed X:33951693 → true chr5:33951693
- rs2814778 (ACKR1/Duffy): listed X:159174683 → true chr1:159174683
- rs3827760 (EDAR): in the mislabeled set
- rs2066827: listed "X:219717011" — IMPOSSIBLE (chrX is ~156 Mb in GRCh38)

Plus 14 more in the same batch (audit the full list in graf_10k_index.json
for all entries with chr='X' and position > 156,000,000 or matching known
autosomal coordinates).

**Fix:** Correct the `chr` field for all 19 to their true autosomal
chromosomes. This looks like a pipeline bug that stamped chr=X on a batch.

**Impact:** rsID matching still works, but coordinate-fallback matching fails
for these markers, and any chrX-specific handling mishandles autosomal data.

---

## Problem 6 (HIGH): No build declarations in graf index

0 of 8,821 entries have a `build` field. Engine silently defaults to GRCh38.

**Fix:** Add `"build": "GRCh38"` to every entry in graf_10k_index.json.
(Verify they are actually GRCh38 first — do not just assume.)

---

## Problem 7 (MEDIUM): Additional data-quality issues

- 9 markers with `chr='Unknown'`, no position:
  rs444326, rs13028308, rs1617757, rs17457788, rs17631341,
  rs17711929, rs17713481, rs17726590, rs1819777
  → Quarantine or remove (coordinate matching impossible)
- 4 markers on patch contigs (HG256_PATCH, HG865_PATCH, HG1074_PATCH,
  HG1350_HG959_PATCH) → Remove (not primary assembly)
- `CAT` labeled region `Americas` → Should be `Europe` (if Catalan)
- 3 SGDP artifacts in basis: `sgdp_ignore_han(discovery)`,
  `sgdp_ignore_karitiana(discovery)`, `sgdp_ignore_papuan(discovery)`
  → Remove from kernel
- Near-duplicate references splitting NNLS weights: Yoruba ×2, Han ×3+,
  Karitiana ×3, Surui ×2, Pima ×2, Maya ×2, Druze ×2, Bedouin ×2,
  Mozabite ×2, Palestinian ×2 → Deduplicate, keep the highest-coverage entry

---

## Verified clean (do not touch)

- Zero synthetic rsIDs in graf index (no _afr/_eur suffixes)
- All 8,821 ref/alt alleles valid (A/C/G/T)
- No zero-variance populations
- All basis frequencies in [0,1], no -1 sentinels in basis pops

---

## Process

- Branch from main: fix-k61-panel
- Fix in order: Problems 1-2 (kernel removals), then 4 (region fix),
  then 5-6 (index fixes), then 7 (cleanup)
- After each fix: `npm run validate:data` must pass
- Final: `npx tsc --noEmit` and `npx vitest run` green
- Push, do NOT open a PR or merge
- Update handoff/STATUS.md
- Report back for Orbit verification

Model: Gemini 3.1 Pro Low.
