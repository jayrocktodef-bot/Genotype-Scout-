# Gated consent for disease-risk results (18+ attestation + opt-in)

Date: 2026-10-07
Author: Orbit (audit) — for Antigravity (implementation)
Status: BRIEF READY — awaiting Jequan's go-ahead before Antigravity starts

## Goal

Disease-risk results in Genotype Scout (Alzheimer's/APOE, cancer-risk
markers, HLA autoimmune panel, polygenic risk scores for CAD/T2D, and all
`clinical_health.json` categories) become visible ONLY to users who (a)
attest they are 18 or older and (b) give separate, explicit opt-in consent
for disease-risk results. Until both are recorded, no disease trait name,
genotype, interpretation, or risk category appears anywhere in the app.

Out of scope: the PGx copy rewrite (see
`handoff/2026-10-07-pgx-copy-rewrite.md`); changing variant calling logic;
removing features.

## Background (self-contained)

Orbit's 2026-10-07 health/legal audit found:

- `src/utils/healthMatching.ts` masks only some sensitive traits
  (`SENSITIVE_TRAITS`: Alzheimer, Breast Cancer, BRCA1/2, APOE, Huntington,
  Parkinson, Lynch Syndrome, Macular Degeneration), and only in the
  `v5_markers_master` matching path. Masked items show the trait NAME with
  a one-click "Reveal Analysis" button (no age gate, no second consent).
- The `clinical_health.json` path (category "Clinical Health": APOE/
  alzheimers_apoe, cardiovascular, cancer_risk, diabetes, clotting,
  autoimmune, celiac, macular_degeneration, thalassemia) and the
  `autoimmune_hla_panel.json` path (category "Autoimmune/HLA": celiac,
  type 1 diabetes, lupus, ankylosing spondylitis with odds ratios up to
  69) render UNMASKED with red "high impact" badges.
- PRS results (`polygenicRisks`: CAD, T2D) render in
  `HealthWellnessTab.tsx` lines ~219-250 with red "Elevated" badges.
- The dashboard (`Dashboard.tsx` lines ~238-264) shows a "Clinical Health
  Snapshot" card to every user.
- The legal modal has no age attestation. A minor can currently view APOE
  Alzheimer's status and cancer markers, contrary to AAP/ACMG guidance to
  defer predictive testing for adult-onset conditions in minors.

## Exact changes

### 1. `src/stores/useLegalConsentStore.ts`

- Bump `CURRENT_CONSENT_VERSION` (e.g. `'1.0.0'` → `'1.1.0'`) so existing
  users re-consent under the new terms.
- Add to `ConsentRecord` and state:
  - `ageAttested18Plus: boolean` + `ageAttestedAt: string | null`
  - `diseaseRiskConsent: { accepted: boolean; version: string;
    timestamp: string | null }`
- Add actions: `attestAge()`, `grantDiseaseRiskConsent()`,
  `revokeDiseaseRiskConsent()`. Revoking re-masks everything immediately.
- Persist both in the existing localStorage record
  (`genotype_scout_consent_v1`, or a new versioned key if cleaner).
- Export a selector/hook, e.g. `useDiseaseRiskAccess()` returning
  `ageAttested18Plus && diseaseRiskConsent.accepted`.

### 2. `src/components/LegalOnboardingModal.tsx`

- New mandatory checkbox (blocks app use until checked, same as the
  existing four): "I confirm I am 18 years of age or older, or I am the
  parent/legal guardian uploading and viewing results on behalf of my
  minor child." Store the attestation with timestamp.
- New SEPARATE opt-in section (not pre-checked, not bundled with the base
  terms): "Disease-risk results (optional)". Plain-English copy:
  "Genotype Scout can show research-grade estimates related to disease
  risk (for example APOE/Alzheimer's markers, cancer-risk markers,
  autoimmune markers, and polygenic risk scores). These are exploratory,
  not diagnoses. Consumer microarrays have documented 40-50%+ false
  positive rates on rare clinical alleles. These results can cause
  distress. They are hidden unless you explicitly opt in here, and you
  can revoke access at any time."
- The opt-in must be a distinct checkbox with its own acknowledged-clause
  key (e.g. `disease_risk_opt_in_ack`), recorded in
  `acknowledgedClauses`.

### 3. `src/utils/healthMatching.ts`

- Define `DISEASE_RISK_CATEGORIES = ['Clinical Health',
  'Autoimmune/HLA']` and treat any impact whose `trait`/`name` matches
  `SENSITIVE_TRAITS` as disease-risk regardless of path.
- In the `clinical_health.json` branch and the
  `autoimmune_hla_panel.json` branch, set `masked: true` unconditionally
  (disease content is never shown without consent; the old one-click
  reveal is removed, see section 4).
- When an item is masked AND the user lacks disease-risk access, blank
  the display fields: return `name: 'Disease-risk result'`,
  `trait: 'Hidden until consent'`, `genotype: ''`, `interpretation: ''`,
  `evidence: ''`. Never leak the trait name pre-consent (current code
  shows the name, e.g. "Alzheimer's", above the lock card).
- Keep the existing `SENSITIVE_TRAITS` masking behavior for the
  `v5_markers_master` path, but route its reveal through the same
  consent gate (section 4), not the one-click button.

### 4. `src/components/HealthWellnessTab.tsx`

- `HealthItemCard` (line ~581): remove the one-click "Reveal Analysis"
  button. For masked disease-risk items without access, render a consent
  card: "Disease-risk results are hidden. They require 18+ attestation
  and explicit opt-in." with a button "Review consent options" that
  opens `LegalOnboardingModal` at the disease-risk section. No reveal
  path that bypasses recorded consent.
- Category filter (lines ~90-110): hide the 'Clinical Health',
  'Autoimmune/HLA', and 'Polygenic Risk' filter options unless
  `useDiseaseRiskAccess()` is true.
- PRS section (lines ~219-250): render only when access is granted.
- The `showPgx`/`showPrs` category logic (line 109) must respect the
  gate.

### 5. `src/components/Dashboard.tsx`

- "Clinical Health Snapshot" card (lines ~238-264): when access is not
  granted, replace with a neutral consent-prompt card ("Disease-risk
  results are off. Review consent options.") that opens the legal modal.
  Never list disease findings on the dashboard pre-consent.

### 6. Print path

- `window.print()` output ("Print Summary") must not include masked
  disease-risk content when access is not granted. Verify the print CSS /
  render path excludes gated sections.

## Rules (do not violate)

- Opt-in is never pre-checked and never bundled into the base terms
  acceptance. Base app use (ancestry, haplogroups, non-disease traits)
  must work fully without disease-risk consent.
- Age attestation is mandatory for app use; answering "no" keeps the
  app usable for non-disease features but permanently hides
  disease-risk sections for that install (until attestation changes).
- Consent version bump forces existing users through the new modal on
  next visit. Their prior `acceptedAt` must not auto-grant the new
  scopes.

## Acceptance criteria

- Fresh install, no consent: grep the rendered DOM (or component tests)
  for "Alzheimer", "APOE", "BRCA", "Celiac", "Lupus", "Ankylosing",
  "Polygenic" returns zero hits in dashboard, tabs, filters, and print
  output. Trait names do not leak.
- Attested 18+ but disease-risk opt-in declined: same as above; PGx
  section still visible (it is covered by the base terms + the PGx copy
  rewrite brief).
- Attested 18+ with opt-in: disease sections render as before (with
  existing masking UX removed in favor of the gate).
- Revoking disease-risk consent immediately re-hides all gated content
  without a reload.
- Consent record in localStorage contains version, timestamps, and the
  `disease_risk_opt_in_ack` clause key.
- `tsc --noEmit` green, vitest suite green (add tests for the gate:
  masked fields blank pre-consent, categories hidden, revocation
  re-masks).

## Open question for Jequan

Age threshold is 18+ in this brief. If you want a parent/guardian flow
for minors' kits beyond the attestation line in section 2, say so before
Antigravity starts.

## Done looks like

No user sees a disease-risk result (or its name) without 18+
attestation plus explicit opt-in; the one-click reveal is gone; minors
get the full non-disease app with disease sections absent.
