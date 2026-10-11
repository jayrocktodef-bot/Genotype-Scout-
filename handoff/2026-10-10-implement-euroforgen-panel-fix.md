# IMPLEMENT: EuroForGen Panel Completion

**Date:** 2026-10-10
**Branch:** Create from main: fix-euroforgen-panel
**Status:** Approved by Jequan — implement now
**Trigger:** Cross-panel audit found the EuroForGen panel file has only 30 of the 128 published markers.

---

## Problem (HIGH): Panel file is incomplete

File: `src/data/raw_aims/forensic_panels.json` (key: `euroforgen`)
- Markers in file: 30
- Markers in published panel: 128
- UI correctly claims: "128 AIMs"

The 30 markers present are all real and valid. But 98 are missing.

### Source

The EUROFORGEN Global AIM-SNP panel (Phillips et al. 2014):
"Building a forensic ancestry panel from the ground up: The EUROFORGEN
Global AIM-SNP set"
Forensic Science International: Genetics, 11:13-25
PubMed: 24631693
DOI: 10.1016/j.fsigen.2014.02.012

This is a 128-marker forensic multiplex designed to differentiate ancestry
among five continental groups: Africa, Europe, East Asia, Native America,
and Oceania.

Note: One marker (rs2080161) was later excluded due to genotyping issues
(Eduardoff et al. 2016). The panel is effectively 127 markers, but the
published set is 128. Include all 128 from the original publication; note
the rs2080161 caveat in a comment.

---

## Fix

1. Obtain the full 128 rsID list from Phillips et al. 2014 (Supplementary
   materials or published tables).
2. Compare against the 30 already in the file.
3. Add the 98 missing rsIDs to the `euroforgen` array in
   `forensic_panels.json`.
4. Verify each added rsID:
   - Matches rs[0-9]+ pattern (no synthetic suffixes)
   - Exists in the master AIMs DB (or flag if missing)
5. Do NOT remove the existing 30.

---

## Process

- Branch from main: fix-euroforgen-panel
- Add the 98 missing markers
- Run: `npm run validate:data` (must exit 0)
- Run: `npx vitest run` (must show 0 failures)
- Push, do NOT open a PR or merge
- Report back for Orbit verification with the source used for the 128 list

**Do NOT:**
- Change the UI label (it's correct at 128)
- Modify kidd55, seldin128, or ramos

Model: Gemini 3.1 Pro Low.
