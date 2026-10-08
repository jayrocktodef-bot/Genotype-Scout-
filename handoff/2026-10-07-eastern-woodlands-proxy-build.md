# Handoff Brief: Eastern Woodlands Proxy Signal

**Date:** 2026-10-07
**Status:** SPEC COMPLETE, RESEARCH COMPLETE — AWAITING USER BUILD
AUTHORIZATION (do not start until Jequan gives the go-ahead)
**Spec:** `~/workspace/aim-panels/EASTERN_WOODLANDS_PROXY_SPEC.md` (full detail)

## Goal

Directional proxy for Northeastern Woodlands Indigenous ancestry (Nanticoke,
Lenape, Powhatan-descendant, Delmarva communities) — the group with zero
modern pure reference representation. This is Jequan's own community; the
honesty bar is the highest in the codebase.

## Research findings (deep audit completed 2026-10-07)

- Exactly ONE public genome-wide ancient dataset from the culture area:
  Scheib et al. 2018 (Science, DOI 10.1121/science.aar6851) — 91 ancient
  genomes, southwestern Ontario (Huron-Wendat: Teston Road, Turnbull ossuaries,
  Lucier site). Tribal permissions documented. Raw: ENA PRJEB25445. Curated
  1240K genotypes: AADR v54.1 (Dataverse doi:10.7910/DVN/FFIDCW).
- NOTHING from the US Eastern Woodlands (VA/MD/DE/PA/NY/Carolinas) is public.
  Everything else regional is mtDNA-only.
- Coverage is ultra-low (0.007–13.6×, pseudo-haploid); usable for group-level
  statistics, NOT robust per-SNP frequencies. ~4,600-year date spread.
- AADR calls are GRCh37/hg19; no documented liftover path (use standard chains).
- Key quantitative backbone: ANC-B ancestry 0% (Anzick-1) → 100% (Ontario +
  modern Algonquian speakers); Central/South Americans 42–71%. No published
  Fst/per-SNP tables — compute de novo.
- Full report: `~/workspace/research_notes/eastern-woodlands-ancient-dna-audit-20261008-0018/report.md`

## The two anchors

### Anchor A: Ancient DNA (Scheib 2018 Ontario)

Retrieve the AADR v54.1 Ontario genotypes (or ENA PRJEB25445 raw reads).
Liftover GRCh37→GRCh38 via chain files; reject ambiguous mappings. Compute
allele frequencies de novo across the Ontario group. These anchor the
"northern-affiliated" signal. Thin but real.

### Anchor B: North–south cline

Markers where northern Native American references (Pima, Maya, Ontario
ancient) diverge from Amazonian references (Karitiana, Surui):
Fst ≥ 0.10 on the Native American axis. MUST exclude SNPs where the
"northern" signal is European admixture (check EUR frequencies).

## Implementation

- `easternWoodlandsProxySNPs.json`: {rsid, weight, rationale, anchor} —
  Anchor A markers weighted above Anchor B.
- Frequencies resolve from existing panels + ancient reference at runtime.
- Output is DIRECTIONAL (northern-affiliated / indeterminate /
  southern-affiliated), NEVER a percentage, NEVER tribal.

## Honesty guardrails (non-negotiable)

- Every UI surface states the reference gap: "compared against Central/South
  American references and ancient North American genomes; no modern
  Northeastern Woodlands reference exists."
- No tribal assignment (Nanticoke, Lenape, or otherwise) — ever.
- The existing Native Roots guardrails apply in full (East Asian confounding
  flag, reference-gap disclosure, genealogical next steps).
- Before production: methodology must be explainable in plain language to a
  non-technical community member.

## Acceptance criteria

- `npm run validate:data`, `npx vitest run`, `npx tsc --noEmit` all green
- Ancient genotype retrieval documented: source, version, sample count,
  liftover method, rejection log
- No fabricated frequencies; proxy SNP list with per-SNP rationale
- Side branch + PR; do NOT merge without go-ahead

**Model:** Gemini 3.1 Pro Low
