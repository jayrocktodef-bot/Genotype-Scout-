# Handoff Brief: Native Roots View — Verification Fixes

**Date:** 2026-10-07
**Status:** FIXES REQUIRED — do not merge until Orbit re-verifies
**Branch under review:** `native-roots-view-v2` @ `440f7017`
**Prior brief:** `handoff/2026-10-07-native-roots-build.md`

## Verdict

Structure is correct (three pillars, guardrails prominent, confidence
framework, Q-M3 gate). Blocked on data honesty issues below. Fix on the same
branch (`native-roots-view-v2`), push, and report back for re-verification.

## Blocking fixes (must resolve before merge)

### 1. cM values are actually megabases

`src/components/NativeRootsView.tsx` computes:

```ts
const lengthCm = (s.end - s.start) / 1000000; // "rough proxy for cM"
```

This is megabases labeled as centimorgans in the UI
("Length: ~{s.lengthCm.toFixed(1)} cM"). These are not the same unit.

Fix: resolve the real genetic-map length. Options in order of preference:
(a) use the segment's existing cM field if the LAI converter provides one;
(b) interpolate against a genetic map (e.g. HapMap/1000G recombination rates);
(c) if neither is available, display megabases labeled honestly as "Mb
(physical length — genetic distance unavailable)". Never display Mb as cM.

### 2. SNP counts are fabricated

```ts
const snpCount = Math.floor((s.end - s.start) / 5000); // "rough proxy"
```

This invents a SNP count from base-pair length and renders it as a measured
value. The project has zero tolerance for fabricated marker data.

Fix: count the actual SNPs. The segments come from `dataset.analysis.segments`
— resolve the real SNP count per segment from the underlying genotype data
(number of called SNPs in [start, end]). If the count is genuinely
unavailable, omit the SNP count from the UI rather than estimating it, and
downgrade the confidence tier accordingly (the ≥500 SNP threshold cannot be
evaluated without a real count).

### 3. rs1063198 is not an mtDNA marker

The 9-bp deletion check cites `rs1063198` as "one of the known rsIDs in this
region." rs1063198 is a chromosome 7 SNP, not a mitochondrial marker in the
8272–8289 region. Remove this reference.

Fix: the deletion check should rely only on genuine mtDNA evidence —
per-position calls in 8272–8289 (keys `MT:{pos}` / `26:{pos}`) with deletion
alleles (`-`, `D`, `--`), or a proper indel rsID actually located in the
mitochondrial 9-bp region. If no such evidence exists in the user's data,
"Not tested" is the correct and honest result. Do not substitute an
unrelated nuclear rsID.

## Non-blocking fixes (expected in the same pass)

### 4. Below-threshold segments are silently dropped

The build brief required: "below threshold greyed with explanation, never
silently dropped." Currently segments under 3 cM / 500 SNPs are filtered out
entirely.

Fix: render sub-threshold segments in a collapsed "below confidence
threshold" section, greyed, with a one-line explanation of why they don't
qualify. Users should see what was found, not wonder what was hidden.

### 5. Unused import

`CHROMOSOME_LENGTHS` is imported from `./ChromosomePainter` but never used.
Remove it (or use it if the cM fix needs chromosome bounds).

### 6. Empty state is thin

Most users will land on this view with zero Native signal. The brief asked
for a designed empty state, not just "Not detected." Add: a short plain-language
paragraph on what zero signal means (and doesn't mean), the reference-gap
reminder, and the genealogical next steps — distinct from the guardrail box
so it reads as guidance, not a disclaimer restatement.

## Acceptance criteria

- `npm run validate:data`, `npx vitest run`, `npx tsc --noEmit` all green
- No estimated values presented as measured (cM, SNP counts, or otherwise)
- No incorrect rsID references; every marker resolves to a real dbSNP entry
- Push to `native-roots-view-v2`; update `handoff/STATUS.md`; report back
  for Orbit re-verification. No PR, no merge until verified.

**Model:** Gemini 3.1 Pro Low
