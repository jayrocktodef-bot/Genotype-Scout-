# PGx copy rewrite — remove prescribing directives

Date: 2026-10-07
Author: Orbit (audit) — for Antigravity (implementation)
Status: BRIEF READY — awaiting Jequan's go-ahead before Antigravity starts

## Goal

Remove every prescribing directive from Genotype Scout's pharmacogenomics
output and replace it with informational, phenotype-first copy plus a
clinician-discussion call to action and authoritative references. This
resolves the internal contradiction where the clickwrap
(`LegalOnboardingModal.tsx`) states the app "does NOT provide prescribing
directives" while the PGx engines do exactly that.

Out of scope: changing which variants are tested, changing phenotype
calling logic, removing the PGx feature, any disease-risk gating (see
`handoff/2026-10-07-disease-risk-gated-consent.md`).

## Background (self-contained)

Orbit's 2026-10-07 health/legal audit found directive medical copy in two
engines, rendered in the UI as "Pharmacogenomic Alerts" with
"High Priority Alert" badges and a "Print Summary" button:

- `src/engines/health/pgxCalculator.ts` → `calculateMedicationSafety()`
  returns `MedicationReport[]` with status `'Normal' | 'Caution' |
  'Action Required'`. Rendered via `healthWorker.ts` →
  `HealthWellnessTab.tsx` → `PGxCard.tsx`.
- `src/services/pgxEngine.ts` → `calculatePharmacogenomics()` returns
  `PGxReport[]`; merged into the same `clinicalRisks` list by
  `src/engines/health/comprehensiveHealthEngine.ts`
  (`analyzeHealthProfile`), severity High → status "Action Required".

Flagged strings (verbatim, current): "Avoid use.", "Lower initial doses
may be required to prevent bleeding risk.", "Consider alternative statin
(e.g. pravastatin, rosuvastatin) or reduced starting dose.", "CPIC
recommends alternative antiplatelet therapy (e.g., prasugrel or
ticagrelor).", "CPIC recommends considering a 50% reduction of starting
dose", "CPIC recommends avoiding codeine", "CPIC recommends prescribing
a lower dose", "CPIC recommends starting with a substantially lower
dose", "CPIC recommends alternative agents or 50%+ dose reduction".

## Exact changes

### 1. `src/engines/health/pgxCalculator.ts`

Replace the `MedicationReport` status vocabulary:

- `'Normal' | 'Caution' | 'Action Required'` →
  `'Typical' | 'Review with clinician' | 'Discuss with clinician'`
- Mapping: `Action Required` → `Discuss with clinician`;
  `Caution` → `Review with clinician`; `Normal` → `Typical`.
- Update the interface (lines 5-10) and every `status:` literal.

Replace each `insight` string (keep gene/drug/severity fields as-is):

a) Codeine / Tramadol, CYP2D6 poor metabolizer (line ~32). New:
"CYP2D6 poor metabolizer phenotype predicted from your raw file. Codeine
and tramadol are prodrugs that need CYP2D6 to become active, so pain
relief may be reduced. Consumer microarray calls can be wrong, especially
for rare variants. Share this result with your doctor or pharmacist
before any medication change."

b) Codeine, CYP2D6 ultrarapid (line ~39). New:
"CYP2D6 ultrarapid metabolizer phenotype predicted from your raw file.
Codeine can convert to morphine faster than usual. Do not change or stop
any medication on the basis of this app. Talk to your doctor or
pharmacist, who can confirm with clinical testing."

c) Warfarin, VKORC1 (line ~54). New:
"A VKORC1 variant associated with higher warfarin sensitivity was found
in your raw file. Warfarin dosing is managed by clinicians using INR
blood tests. Do not adjust any dose based on this app. Bring this result
to your prescriber."

d) Simvastatin, SLCO1B1 poor function (line ~74). New:
"An SLCO1B1 reduced-function genotype was found in your raw file,
associated in research with higher rates of statin-related muscle
symptoms. Do not change or stop your statin based on this app. Discuss
with your prescriber."

e) Simvastatin, SLCO1B1 intermediate (line ~79). New:
"An SLCO1B1 intermediate-function genotype was found in your raw file,
associated in research with a modest increase in statin-related muscle
symptoms. Do not change dosing based on this app. Discuss with your
prescriber."

### 2. `src/services/pgxEngine.ts`

Replace each `message` string (keep gene/drug/severity/phenotype as-is):

a) Clopidogrel, CYP2C19 poor (line 52). New:
"CYP2C19 poor metabolizer phenotype predicted from your raw file.
Research links this phenotype with reduced clopidogrel activation. Do not
change antiplatelet therapy based on this app. Your prescriber can order
confirmatory testing; published guidance is available from CPIC
(https://cpicpgx.org/guidelines/)."

b) SSRIs, CYP2C19 poor (line 59). New:
"CYP2C19 poor metabolizer phenotype predicted from your raw file. Research
links this phenotype with slower clearance of some SSRIs (escitalopram,
citalopram). Do not change dose or stop antidepressants based on this app.
Discuss with your prescriber."

c) SSRIs, CYP2C19 ultrarapid (line 67). New:
"CYP2C19 ultrarapid metabolizer phenotype predicted from your raw file.
Research links this phenotype with faster clearance of some SSRIs. Do not
change or stop medication based on this app. Discuss with your
prescriber."

d) Codeine, CYP2D6 poor (line 103). New:
"CYP2D6 poor metabolizer phenotype predicted from your raw file. Codeine
needs CYP2D6 to become active, so pain relief may be reduced. Do not
change pain medication based on this app. Talk to your doctor or
pharmacist."

e) Simvastatin, SLCO1B1 poor (line 121). New:
"An SLCO1B1 poor-function genotype was found in your raw file, associated
in research with higher rates of statin-related muscle symptoms. Do not
change or stop your statin based on this app. Discuss with your
prescriber."

f) Simvastatin, SLCO1B1 intermediate (line 129). New:
"An SLCO1B1 intermediate-function genotype was found in your raw file,
associated in research with a modest increase in statin-related muscle
symptoms. Do not change dosing based on this app. Discuss with your
prescriber."

g) Warfarin, VKORC1/CYP2C9 (lines 148-150). New (both branches):
"VKORC1/CYP2C9 variants associated with warfarin sensitivity were found
in your raw file. Warfarin is dosed by clinicians using INR blood tests.
Do not adjust any dose based on this app. Bring this result to your
prescriber."

h) Fluorouracil / Capecitabine, DPYD (line 162). New:
"A DPYD loss-of-function allele (*2A, rs3918290) was found in your raw
file. In clinical care this gene is tested before fluoropyrimidine
chemotherapy because deficiency raises toxicity risk. This app is not a
clinical test and the microarray call may be wrong. If you ever face this
treatment decision, tell your oncology team and ask about clinical DPYD
testing."

### 3. `src/components/PGxCard.tsx`

- Heading line 21: `"{severity} Priority Alert"` → neutral label, e.g.
  `"{severity} relevance — informational"`. No alarmist styling change
  required beyond the label.
- Add to every card, below the message: a "Discuss with your doctor or
  pharmacist" line and two reference links:
  - CPIC guidelines: https://cpicpgx.org/guidelines/
  - FDA Table of Pharmacogenomic Biomarkers in Drug Labeling:
    https://www.fda.gov/drugs/science-and-research-drugs/table-pharmacogenomic-biomarkers-drug-labeling
    (URL verified live 2026-10-07)
- On High severity cards, append the microarray caveat: "Consumer
  microarray calls have documented 40-50%+ false-positive rates on rare
  clinical alleles. Confirm with clinical testing before acting."

### 4. `src/components/HealthWellnessTab.tsx` (PGx section only)

- Section heading (line ~455): "Pharmacogenomic Alerts" →
  "Pharmacogenomic Information".
- Severity filter options (lines ~473-477): "High Priority" →
  "High relevance", "Moderate Priority" → "Moderate relevance",
  "Low Priority" → "Low relevance". Keep the filter logic unchanged.
- "Print Summary" button: keep, but the printed output must include the
  RUO disclaimer footer ("Research Use Only — not a medical device, not
  medical advice; confirm with clinical testing and your clinician").
- The `report.status` badge: `PGxCard` currently receives severity only;
  if the status string is surfaced anywhere in this section, apply the
  section 1 vocabulary mapping.

### 5. Type updates

- `MedicationReport.status` (`pgxCalculator.ts` lines 5-10) and any
  mirrored type in `HealthWellnessTab.tsx` / `healthWorker.ts` message
  contracts must accept the new literals. `tsc --noEmit` must pass.

## Rules for all replacement copy (do not violate)

- No imperatives directed at medication behavior: no "avoid", no
  "consider", no "should", no dose numbers or percentages, no named
  alternative drugs.
- Every High-severity card ends with a clinician-discussion call to
  action AND the microarray false-positive caveat.
- Copy may describe what the phenotype means in plain English and may
  point to CPIC/FDA as external references. It must not restate a
  guideline recommendation as an instruction to the user.

## Acceptance criteria

- `grep -riE "action required|avoid use|may be required|priority alert" src/engines/health/pgxCalculator.ts src/services/pgxEngine.ts src/components/PGxCard.tsx src/components/HealthWellnessTab.tsx` returns zero hits
  (case-insensitive), excluding comments that reference this brief.
- No dose numbers/percentages ("50%", "dose reduction", "lower dose",
  "starting dose") and no named alternative drugs ("prasugrel",
  "ticagrelor", "pravastatin", "rosuvastatin") remain in user-facing PGx
  strings in those files.
- Every PGx card renders: phenotype, informational message,
  clinician-discussion CTA, CPIC + FDA label links.
- `tsc --noEmit` green, vitest suite green.
- Branch pushed; Orbit verifies the diff against this brief; nothing
  merges to main without Jequan's go-ahead.

## Done looks like

PGx output reads as research-grade phenotype information with clear
"talk to your clinician" framing, zero prescribing directives, and the
clickwrap's "does NOT provide prescribing directives" claim is true of
the code again.
