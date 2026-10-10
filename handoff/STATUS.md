# Handoff status

## Active

- [ ] 2026-10-10 — Native Roots launcher card fix
      Branch: `fix-nativeroots-launcher`
      Fixes: Added the Native Roots launcher card to the Dashboard module.
      Status: Built, validated locally, pushed. Awaiting Orbit verification. Do NOT merge yet.

- [ ] 2026-10-09 — Fix Eastern Woodlands mislabeled SNPs
      Branch: `fix-eastern-woodlands-snp-labels`
      Fixes: Reverted 2,568 contaminated "Eastern Woodlands..." descriptions in `native_american.json` to "Native American / Indigenous New World informative marker." and synced 1,385 occurrences out of `master_aims_normalized.json`.
      Status: Built, validated locally, pushed (commit: 2682e3f). Awaiting Orbit verification. Do NOT merge yet.

- [ ] 2026-10-09 — Fix ProfileSummary and NativeRootsView crashes
      Branch: `fix-profile-nativeroots-crashes`
      Fixes: Added destructuring defaults in ProfileSummary.tsx, added NativeRootsView to WorkspaceRouter rendering logic and ScoutWorkspace categorizations.
      Update: Added missing AFRAM, AMER, CAS, CAU to REGION_COLORS and mapCodeToName in NaiveAncestryOracle.tsx.
      Status: Built, validated locally. Awaiting Orbit verification. Do NOT merge yet.

- [x] 2026-10-07 — Native Roots discovery view (FIXES REQUIRED)
      Brief: `handoff/2026-10-07-native-roots-build.md`
      Fixes: `handoff/2026-10-07-native-roots-fixes.md`
      Branch: `native-roots-view-v2` @ c6a6e47 — Fixes applied: cM labeled as Mb, fabricated SNP counts removed, rs1063198 removed, threshold explanations added, zero-signal empty state added. Merged.

- [ ] 2026-10-06 — Round 7: regenerate 5 oversized AIM panels, validate all 12
      Brief: `round7/BIGFILES_HANDOFF.md` (on this branch)
      Branch: `round7-frequency-fixes`
      Acceptance: counts match `round7/AGGREGATE.json` exactly
      (5,439 → 4,839 markers; 600 purged; 2,110 corrected);
      `npm run validate:data`, vitest, and `tsc --noEmit` green;
      open PR; await Orbit diff verification before merge.
      Includes the judgment-call post-pass (round7/apply_judgment_calls.py):
      relabels + weight demotions apply automatically; manual_review and
      purge_misses lists in panels/judgment_calls.report.json need Jequan's
      ruling first — surface them, do not action unilaterally.

## Briefs ready — awaiting Jequan's go-ahead (do not start)

- [ ] 2026-10-07 — PGx copy rewrite (remove prescribing directives)
      Brief: `handoff/2026-10-07-pgx-copy-rewrite.md`
      Rewrites all directive PGx copy (`pgxCalculator.ts`,
      `pgxEngine.ts`, `PGxCard.tsx`, HealthWellnessTab PGx section) to
      informational phenotype-first language with clinician CTA plus
      CPIC/FDA reference links. Resolves the clickwrap contradiction
      ("does NOT provide prescribing directives"). Do NOT start until
      Jequan authorizes.

- [ ] 2026-10-07 — Gated consent for disease-risk results
      Brief: `handoff/2026-10-07-disease-risk-gated-consent.md`
      18+ attestation plus separate explicit opt-in for disease-risk
      results (APOE/Alzheimer's, cancer markers, HLA autoimmune panel,
      PRS CAD/T2D, clinical_health categories). Removes the one-click
      "Reveal Analysis"; trait names hidden until consent; dashboard
      snapshot and print path gated. Do NOT start until Jequan
      authorizes.

## Awaiting authorization (do not start)

- [ ] 2026-10-07 — Romani proxy signal (v0)
      Brief: `handoff/2026-10-07-romani-proxy-build.md`
      Status: built, awaiting Orbit verification. Branch: `romani-proxy-v0`.
      Composite signal from existing panels (NW Indian Fst SNPs + direct Roma
      SNPs + F_ROH + uniparental). No new frequency data.
- [x] 2026-10-07 — Eastern Woodlands proxy signal
      Brief: `handoff/2026-10-07-eastern-woodlands-proxy-build.md`
      Status: Merged @ fc09a4f. Branch: `eastern-woodlands-proxy`.
      Directional proxy (Scheib 2018 Ontario aDNA + north-south cline).
      Highest honesty bar — Jequan's own community.

## Backburner

- [ ] Blog integrity fixes (writteninthegenome.blog) — ranked findings in Orbit's
      2026-10-04 audit report (C1/C2 open-source claims + medical disclaimer,
      H1/H2 stats + donation block, H3/H4 policy pages + tool cards, M1-M4).
      Task brief to be written when prioritized.

- [ ] Romani AIM panel (`romani.json`) — spec at
      `~/workspace/aim-panels/ROMANI_AIM_PANEL_SPEC.md`. PARKED pending
      retrieval of the Font-Porterias 2019 figshare genome-wide dataset.
      Do not build from the clinical SNP supplementary alone.

## Open decisions (Jequan)

- 45 low-separation markers: move to a more fitting panel vs keep as contrast
- 77 surviving weight-10 markers: weight review after corrected divergences
- Validator: add exact GRCh38 position comparison (currently chromosome + alleles only)
- Romani proxy: authorize build?
- Eastern Woodlands proxy: authorize build?
