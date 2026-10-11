# IMPLEMENT: Microhaps Kernel Corrupt Loci Fix

**Date:** 2026-10-10
**Branch:** Create from main: fix-microhaps-kernel
**Status:** Approved by Jequan — implement now
**Trigger:** Cross-panel audit found 7 corrupt loci in the Microhaps kernel.

---

## Problem 1 (HIGH): 3 loci with frequency sums >1.0

File: `src/data/raw_aims/microhap_top100_kernel.json`

Haplotype frequencies are probability distributions and must sum to ~1.0.
Three loci materially exceed this:

| Locus | AFR | EUR | EAS | SAS | AMR |
|---|---|---|---|---|---|
| `mh10CP-003` | 1.166 | 1.504 | 1.288 | 1.285 | 1.428 |
| `mh11KK-091` | 1.232 | 1.498 | 1.472 | 1.477 | 1.422 |
| `mh14KK-068` | 1.081 | 1.301 | 1.041 | 1.210 | 1.146 |

**Fix:** Remove these 3 loci from the kernel. They cannot be repaired
without re-deriving from MicroHapDB source data.

---

## Problem 2 (HIGH): 4 loci with haplotype-length mismatches

Haplotype allele strings must have exactly one character per SNP.

- **`mh11KK-091`** (2 SNPs): contains 3-char haplotypes (`TGC`, `TGT`)
  alongside 2-char ones. This is the cause of its >1.0 sums. Corrupt.
- **`mh10KK-170.v2`** (3 SNPs): all haplotypes are 5-char (`GCATA`, etc.)
- **`mh21KK-313.v2`** (3 SNPs): all haplotypes are 5-char (`CCGGC`, etc.)
- **`mh15KK-067.v2`** (4 SNPs): all haplotypes are 5-char

Note: `mh11KK-091` appears in both Problem 1 and 2 (same root cause).

**Fix:** Remove all 4 loci from the kernel.

**Total loci removed:** 6 unique (mh11KK-091 counted once)
**Remaining:** 114 clean loci

---

## Problem 3 (MEDIUM): Version family duplicates

8 locus families have multiple versions (.v1, .v2, etc.):
mh01KK-001 (3 versions), mh01KK-211, mh02KK-004, mh05KK-120,
mh10KK-170, mh14KK-048, mh15KK-067 (3 versions), mh21KK-313

The build script takes top 120 by score without deduplicating, so both
.v1 and .v2 of the same physical locus can appear.

**Fix:** After removing the corrupt loci above, check for remaining
version duplicates. Keep only the version with valid haplotype lengths
and frequency sums closest to 1.0. Remove the others.

---

## Problem 4 (MEDIUM): Naming inconsistency (100 vs 120)

- UI says "Top 100"
- Filename says `microhap_top100_kernel.json`
- Build script says `slice(0, 120)` and logs "Top 120"
- Actual: 120 loci (114 after cleanup)

**Fix:** Update the UI label to match reality. Change "Top 100" to
"Top 114" (or whatever the final count is after cleanup). Update the
filename if practical, or leave it (filename doesn't affect function).

---

## Problem 5 (LOW): No validator coverage

`dataValidator.ts` does not check the microhap kernel.

**Fix:** Add validation for `microhap_top100_kernel.json`:
- Assert each locus has all required fields
- Assert haplotype string length == SNP count for every haplotype
- Assert per-population frequency sums are within [0.95, 1.05]
- Assert no duplicate locus IDs

---

## Process

- Branch from main: fix-microhaps-kernel
- Remove the 6 corrupt loci
- Deduplicate version families
- Update UI label to match final count
- Add microhap validation to dataValidator.ts
- Run: `npm run validate:data` (must exit 0)
- Run: `npx vitest run` (must show 0 failures)
- Push, do NOT open a PR or merge
- Report back for Orbit verification

Model: Gemini 3.1 Pro Low.
