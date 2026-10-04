# Round 7 full run — frequency-vector validation & ethnic-label audit (7 panels)

Reference: Ensembl REST variation/human?pops=1, pulled 2026-10-04 (5,289 variants).
Panel ALT = alleles[0] (forward strand). Reference = 1000G Phase 3 super-populations
(AFR/EAS/EUR/SAS) + gnomAD Middle East (MENA). Panel AMR (panel-defined unadmixed
Native American) excluded from comparison — not comparable to admixed 1000G/gnomAD AMR.

## Totals: 5,439 -> 4,839 markers

| Panel | In | Out | Purged | Re-keyed | Vectors corrected | Labels demoted | Contradictions |
|---|---|---|---|---|---|---|---|
| african | 676 | 536 | 140 | 16 | 401 | 189 | 18 |
| african_american | 515 | 436 | 79 | 4 | 159 | 0 | 0 |
| european | 690 | 656 | 34 | 0 | 294 | 28 | 4 |
| middle_eastern | 559 | 480 | 79 | 1 | 143 | 11 | 0 |
| north_african | 877 | 842 | 35 | 6 | 155 | 10 | 1 |
| oceanian | 724 | 647 | 77 | 4 | 141 | 3 | 3 |
| south_asian | 1398 | 1242 | 156 | 3 | 817 | 0 | 1 |
| **Total** | **5439** | **4839** | **600** | **34** | **2110** | **241** | **27** |

## Rules applied
- Flag: |panel - reference| > 0.25 per continent (SEVERE if > 0.5); exclusivity-contradiction;
  inversion with margin. Calibration: 25 Seldin markers -> 0 severe flags.
- Purge: max divergence across corrected checkable vector < 0.15 (not an AIM).
- Re-key merged IDs to current Ensembl accessions (34 mappings, consistent across panels).
- Ethnic labels demoted to continental unless named group maps to a 1000G population
  AND |f(group) - f(continent)| >= 0.25. Trait/description contradictions rewritten.
- Never invented: no reference data -> panel vector kept, marked unverifiable.

## Open items (not applied, need decisions)
- Low-separation markers (e.g. Oceanian-peaking markers in african.json): move panel or keep as contrast.
- Weight-10 markers with corrected divergence < 0.3: weight review.
- Validator code gap: Ensembl cross-check never compares position (rs10456430 233bp drift).
- 5 oversized files (global, central_asian, east_asian, native_american, master_aims_normalized):
  see BIGFILES_HANDOFF.md for the Antigravity run.

## Files
- `{panel}.fixed.json` — corrected panel (7 files)
- `{panel}.report.json` — per-marker decisions (7 files)
- `{panel}.flags.json` — raw comparison flags (7 files)
- `ensembl_ref_snapshot.json` — reference data (5,289 variants)
- `AGGREGATE.json` — this table as JSON
