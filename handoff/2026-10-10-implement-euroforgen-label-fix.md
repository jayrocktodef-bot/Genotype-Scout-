# IMPLEMENT: EuroForGen UI Label Fix

**Date:** 2026-10-10
**Branch:** Create from main: fix-euroforgen-label
**Status:** Approved by Jequan — implement now
**Trigger:** Cross-panel audit found UI/data mismatch.

---

## Problem (MEDIUM): UI claims 128 AIMs, file has 30

File: `src/data/raw_aims/forensic_panels.json` (key: `euroforgen`)
- Actual rsIDs in file: 30
- UI badge claims: "128 AIMs"
- UI countLabel: "128 Substructure AIMs"

The 30 markers in the file are all real, validated AIMs. The data is clean.
The label is wrong.

---

## Fix

Find where the EuroForGen panel label is defined (likely in
`src/components/SubpopulationBento.tsx` in `PANEL_METADATA`, or similar).

Change:
- Badge/count from "128 AIMs" to "30 AIMs"
- Description from "128 Substructure AIMs" to "30 Substructure AIMs"

**Do NOT** pad the panel to 128 markers. The 30 markers are the real
EuroForGen European substructure set. The UI was wrong, not the data.

---

## Process

- Branch from main: fix-euroforgen-label
- Update the UI labels
- Run: `npx tsc --noEmit` (must exit 0)
- Push, do NOT open a PR or merge
- Report back for Orbit verification

Model: Gemini 3.1 Pro Low.
