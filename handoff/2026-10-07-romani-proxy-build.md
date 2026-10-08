# Handoff Brief: Romani Proxy Signal

**Date:** 2026-10-07
**Status:** SPEC COMPLETE — AWAITING USER BUILD AUTHORIZATION (do not start
until Jequan gives the go-ahead)
**Spec:** `~/workspace/aim-panels/ROMANI_PROXY_SPEC.md` (full detail)

## Goal

Detect a Romani-consistent ancestry pattern using ONLY existing data — no new
reference panel, no new frequency collection. Composite four-component signal.

## Background (why a proxy, not a panel)

Deep research (2026-10-07) found only ONE unrestricted public genome-wide
Romani dataset (Font-Porterias 2019, 34 Iberian Roma, figshare — contents
unverified). The clinical SNP supplementary (~90 SNPs) yielded ZERO candidates
at Fst ≥ 0.15. No Roma in gnomAD/1000G/HGDP/SGDP. The full `romani.json` panel
is parked until the figshare set is retrieved. This proxy is the buildable
signal from existing data, versioned v0.

## The four components

### 1. NW Indian ancestry component (primary)

Select SNPs from south_asian.json + european.json with Fst ≥ 0.15 between
northwestern Indian populations (PJL Punjabi, GIH Gujarati) and Europeans
(CEU/TSI/IBS). Prefer SNPs where the NW Indian profile differs from
Dravidian/Tamil/Bengali — this separates the Romani source region from generic
South Asian ancestry. Genome-wide spread, no chromosome clustering. Reuse
existing panel entries by rsID — do NOT duplicate frequency objects.

Expected pattern: elevated NW Indian alleles against a European background,
roughly 20–35% of the South Asian axis.

### 2. Direct Roma-frequency SNPs (corroborating)

- rs1229984 (ADH1B): Roma 0.179 vs EUR 0.029 — confirmed in european.json
  (chr4:99318162 GRCh38); flag as selected locus, not neutral
- rs4833103 (TLR1/TLR6): Roma DAF 0.3, Fst Roma–Indian 0.49 — flag as selected
- Font-Porterias supplementary SNPs (pending re-check resolution)

Few and noisy (n≈35 Roma). Corroborate only.

### 3. Endogamy signature (corroborating)

Elevated F_ROH from the ROH detector (endogamy engine Phase 1). Expected
population structure in Romani users, not diagnostic. Report with explanation.

### 4. Uniparental (corroborating, when data exists)

Y-DNA H-M69; mtDNA M5a1, M18, M35b. "Not tested" distinct from negative.

## Implementation

- `romaniProxySNPs.json`: list of {rsid, weight, rationale} referencing
  existing panel entries by rsID. NO frequency objects — frequencies resolve
  from panels at runtime.
- Scoring function: weighted NW-Indian-allele dosage → normalized 0–1 score,
  calibrated against 1000G PJL/GIH (high), CEU/TSI (low), admixed profiles.
- Confidence tiers: Strong (score high + F_ROH elevated + ≥1 direct SNP);
  Moderate (score high + one corroborator); Weak (score alone → "South Asian
  ancestry present; Romani pattern not confirmed").

## Honesty guardrails

- UI label: "pattern consistent with Romani origins" — never "Romani detected"
  or a Romani percentage.
- Cannot distinguish Romani from generic NW Indian admixture in a
  European-background user. State this.
- Selected loci flagged as non-neutral in the UI.
- If the figshare genome-wide set is later retrieved, the proxy is superseded
  by the real panel.

## Acceptance criteria

- `npm run validate:data`, `npx vitest run`, `npx tsc --noEmit` all green
- No duplicated frequency data; no fabricated SNPs
- Calibration report: score distributions on 1000G test profiles
- Side branch + PR; do NOT merge without go-ahead

**Model:** Gemini 3.1 Pro Low
