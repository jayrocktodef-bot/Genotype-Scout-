# Handoff Brief: Native Roots Discovery View

**Date:** 2026-10-07
**Status:** AUTHORIZED FOR BUILD (user approved 2026-10-07)
**Spec:** `~/workspace/native-roots/NATIVE_ROOTS_SPEC.md` (full detail)

## Goal

Build the Native Roots discovery view for Genotype Scout — a three-pillar
evidence framework for users exploring Native American ancestry, with
tribal-honesty guardrails throughout.

## Architecture (verified against codebase — reuse, don't rebuild)

- **Segments:** The RFMix-like LAI worker (`src/workers/rfmixWorker.ts`) outputs
  per-window smoothed probabilities per chromosome per strand. Find and reuse
  the existing LAI→Segment converter that feeds ChromosomePainter — do not
  write a second one.
- **Painter:** ChromosomePainter already handles AMR/Indigenous American regions
  and has EDAR + ABCC11 gene overlays. Reuse it.
- **Integration work:**
  1. Add windowIndices (window→genomic coordinates) to the worker's postMessage payload.
  2. Confirm the reference population list includes Indigenous American — add it if missing.
  3. The strands are pseudo-phased (frequency sorting, not true phasing) — do not overclaim breakpoint precision anywhere in the UI.
- **"Oracle" note:** The *Oracle components aggregate painter LAI segments via
  `computePaintedAncestry()` as their primary engine (NNLS is fallback-only).
  Native Roots uses painter segments as the primary autosomal source (consistent
  with the rest of the app); ONNX v4.0.0 Indigenous American probability serves
  as an independent corroborating signal, not a competing percentage. If painter
  and ONNX disagree substantially, surface the disagreement.

## Pillar 1 — Autosomal segments

Argmax per LAI window → merge contiguous Indigenous-American windows →
`Segment[]` → painter + segment table (chr, start/end GRCh38, cM, SNP count,
supporting markers). Quality tiers: ≥7cM/500 SNPs high confidence; 3–7cM
moderate (flagged provisional); below threshold greyed with explanation, never
silently dropped. Interpretation bands: <0.5% not reported as ancestry;
0.5–2% trace; 2–5% modest; >5% strong.

## Pillar 2 — Traits strip

EDAR rs3827760 + ABCC11 rs17822931 cards showing the user's genotype and
associated traits in plain language. Mandatory copy: "common in Native American
and East Asian populations" — never "Native American gene." Associated-with
language only, no health claims.

## Pillar 3 — Uniparental

Add an EXPLICIT 9-bp deletion check (inspect mtDNA positions 8272–8289; report
present / absent / not tested as a first-class result, independent of the
haplogroup call). Badge haplogroup B (maternal) and Q (paternal — verify Q-M3
resolution first; if the caller stops at Q, do not fire the badge).
"Not tested" (e.g. AncestryDNA uploads) must render distinctly from negative.

## Confidence framework

Implement as a pure function (autosomal, traits, uniparental) →
{verdict, reasons[]}. Verdicts: Confirmed / Likely / Uncertain / Not detected
per the spec matrix. Include the East Asian confounding branch: if ONNX East
Asian is also elevated, flag "shared deep ancestry — cannot separate without
corroborating pillars."

## Honesty guardrails (required copy, prominent not buried)

1. DNA cannot name a tribe — tribal identity is genealogical and communal.
2. Reference gap: "compared against Central and South American reference
   populations; no Northeastern Woodlands reference exists."
3. Next steps are genealogical (older relatives, paper trail, community), not
   another test.

## Empty state

Design what the view shows with zero Native signal — most users land here;
it must be informative, not a dead end.

## Acceptance criteria

- `npm run validate:data`, `npx vitest run`, `npx tsc --noEmit` all green
- No fabricated SNPs, frequencies, or coordinates
- GRCh38 throughout; client-side only
- Side branch + PR; do NOT merge (awaiting Jequan's go-ahead + Orbit verification)

**Model:** Gemini 3.1 Pro Low
