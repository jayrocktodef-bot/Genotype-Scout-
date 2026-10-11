# IMPLEMENT: Chromosome Painter Full-Screen Detail View

**Date:** 2026-10-10
**Branch:** Create from main: chromosome-detail-view
**Status:** Approved by Jequan — implement now
**Trigger:** User request for more visual variation and a full-screen per-chromosome view.

---

## Goal

Add a full-screen detail view when the user taps a chromosome in the
Chromosome Painter. The current "Chr Focus" dropdown only filters the list
— it doesn't enlarge or add detail. This is new functionality.

---

## What to Build

### 1. Tap-to-expand interaction

In `ChromosomePainter.tsx`, make each chromosome row tappable. Tapping
opens a full-screen modal/detail view for that chromosome.

- Add an expand icon or chevron on each chromosome row (visual affordance)
- Tapping anywhere on the chromosome row opens the detail view
- Include a close button and swipe-down-to-dismiss on mobile

### 2. Full-screen chromosome layout

The detail view should show:

**Header:**
- Chromosome number and length (e.g., "Chromosome 1 — 249 Mbp")
- Left/right arrows to navigate to previous/next chromosome
- Close button

**Main visualization (large):**
- Maternal strand (Strand A) rendered as a tall track (minimum 48px height
  for touch accessibility, per AGENTS.md guidelines)
- Paternal strand (Strand B) below, same height
- Clear labels: "Maternal" and "Paternal"
- Segments rendered proportionally by base-pair position
- Use the existing ancestry color scheme from `ancestryThemes.ts`
- Respect the user's selected colorblind palette

**SNP density track:**
- Below the ancestry tracks, render a histogram showing SNP density
  across the chromosome
- This reveals where ancestry calls are well-supported vs thin
- Use data already available in the LAI segments (`snpsCount` per segment)
- If per-position density isn't available, aggregate by segment

**Segment inspector (integrated):**
- Tapping a segment in the detail view shows its details inline
  (no separate drawer needed):
  - Ancestry assignment (continent + icon)
  - Base-pair range (start – end)
  - Length in Mbp
  - Confidence percentage
  - SNP count supporting the call
  - Strand (maternal/paternal)

### 3. Confidence visualization

In the detail view, encode segment confidence visually:
- High confidence (>80%): solid color
- Medium confidence (50-80%): slight transparency (80% opacity)
- Low confidence (<50%): hatched pattern overlay (use existing texture
  patterns from `ancestryThemes.ts`)

This lets users see at a glance which calls are solid vs uncertain.

### 4. Cytoband-style rendering (overview improvement)

In the main overview (`ChromosomePainter.tsx`), render chromosomes with
a centromere pinch instead of plain rectangles:
- Each chromosome has a known centromere position (add a constants file
  or extend existing chromosome metadata)
- Render the chromosome shape with a narrowing at the centromere
- This is visual only — does not affect segment positioning

Centromere positions (GRCh38, approximate Mbp):
Chr1: 125, Chr2: 93, Chr3: 91, Chr4: 50, Chr5: 48, Chr6: 60, Chr7: 59,
Chr8: 45, Chr9: 49, Chr10: 40, Chr11: 53, Chr12: 35, Chr13: 17, Chr14: 17,
Chr15: 19, Chr16: 36, Chr17: 25, Chr18: 17, Chr19: 26, Chr20: 28,
Chr21: 13, Chr22: 15, ChrX: 60, ChrY: 13

(Verify these against a reliable source before implementing.)

---

## Technical Notes

- **Data source:** The LAI engine output (`segments` record in
  `paintedAncestry.ts`) already has everything needed. No engine changes.
- **Reuse:** The detail view can reuse segment rendering logic from
  `ChromosomePainter.tsx` with larger dimensions.
- **State:** Add `selectedChromosome` state to `ChromosomePainterView.tsx`
  (or create a new `ChromosomeDetailView.tsx` component).
- **Mobile:** Detail view must work well on mobile. Minimum 48px touch
  targets. Swipe left/right for chromosome navigation.
- **Performance:** The detail view renders only one chromosome, so DOM
  count is manageable. No Canvas needed for this view.

---

## Out of Scope

- Do NOT change the LAI computation engine
- Do NOT change the overview/discrepancy logic (that's a separate issue)
- Do NOT modify the segment inspector drawer in the overview
  (keep it as-is for now)

---

## Process

- Branch from main: chromosome-detail-view
- Implement tap-to-expand + full-screen detail view
- Add SNP density track
- Add confidence visualization
- Add cytoband centromere rendering to overview
- Run: `npx tsc --noEmit` (must exit 0)
- Run: `npx vitest run` (must show 0 failures)
- Push, do NOT open a PR or merge
- Report back for Orbit verification

Model: Gemini 3.1 Pro Low.
