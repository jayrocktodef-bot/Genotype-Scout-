# Handoff status

## Active

- [ ] 2026-10-06 — Round 7: regenerate 5 oversized AIM panels, validate all 12
      Brief: `round7/BIGFILES_HANDOFF.md` (on this branch)
      Branch: `round7-frequency-fixes`
      Acceptance: counts match `round7/AGGREGATE.json` exactly
      (5,439 → 4,839 markers; 600 purged; 2,110 corrected);
      `npm run validate:data`, vitest, and `tsc --noEmit` green;
      open PR; await Orbit diff verification before merge.

## Backburner

- [ ] Blog integrity fixes (writteninthegenome.blog) — ranked findings in Orbit's
      2026-10-04 audit report (C1/C2 open-source claims + medical disclaimer,
      H1/H2 stats + donation block, H3/H4 policy pages + tool cards, M1-M4).
      Task brief to be written when prioritized.

## Open decisions (Jequan)

- 45 low-separation markers: move to a more fitting panel vs keep as contrast
- 77 surviving weight-10 markers: weight review after corrected divergences
- Validator: add exact GRCh38 position comparison (currently chromosome + alleles only)
