# IMPLEMENT: Ancestry Visual Overhaul (4 Components)

**Date:** 2026-10-10
**Branch:** Create from main: ancestry-visual-overhaul
**Status:** Approved by Jequan — implement now

---

## Overview

Four visual upgrades to make ancestry results more intuitive, distinctive,
and shareable. All are UI-only — no engine changes needed.

Work in the order listed. Each component is independent.

---

## 1. Population Distance Scatter Plot

**Current:** Ranked list with horizontal bars showing genetic distance.

**Build:** A 2D scatter plot (PCA-style) showing the user as a point among
reference populations.

- X and Y axes represent the first two principal components of the
  population distance matrix (compute via simple MDS or use precomputed
  coordinates if available)
- Each reference population is a dot, colored by continent
  (use existing `ancestryThemes.ts` colors)
- The user's position is a larger, highlighted dot (pulsing ring or star)
- Hovering a population dot shows: name, region, distance to user
- Tapping a dot could select it as the "compared" population
- Keep the existing ranked list as a toggleable alternative view
  (some users prefer precision over visualization)

**Files likely touched:**
- `src/components/SubpopulationBento.tsx` (or wherever the distance
  spectrum is rendered)
- May need a small MDS/PCA utility if coordinates aren't precomputed

---

## 2. Ancestry Wheel (Composition Visualization)

**Current:** Stacked horizontal percentage bar.

**Build:** A circular "ancestry wheel" as an alternative to the bar.

- Each ancestry component is a wedge, sized proportionally to percentage
- Center shows the top ancestry label and percentage
- Wedges colored by continent (existing theme colors)
- Hovering/tapping a wedge shows: continent name, percentage, Mb total
- Add a toggle to switch between "Wheel" and "Bar" views
- Design it to be screenshot-friendly (people share these on social media)
- Include a subtle "Genotype Scout" watermark option for shared images

**Files likely touched:**
- Component that renders the composition header
  (find the stacked bar in `ChromosomePainterView.tsx` or similar)

---

## 3. Panel Switcher Card Previews

**Current:** Cards show panel name and marker count only.

**Build:** Add a mini geographic coverage visualization to each panel card.

- A tiny world map silhouette or continental dot grid
- Highlight the regions the panel covers well
- For example:
  - Global K61: all continents highlighted
  - Ramos Africa: Africa highlighted, others dimmed
  - EuroForGen: Europe highlighted
  - Kidd 55 / Seldin 128: global but smaller (fewer markers)
- Keep it small — a 60×40px preview per card
- Use a simplified continent outline (SVG paths) or a dot-matrix world map

**Files likely touched:**
- `src/components/SubpopulationBento.tsx` (`PANEL_METADATA`)

---

## 4. Haplogroup Phylogenetic Tree

**Current:** (Audit needed — check what's currently shown for Y-DNA/mtDNA.)

**Build:** If haplogroup views are text-only, add a phylogenetic tree.

- Vertical or radial tree showing the haplogroup hierarchy
- User's branch highlighted with a glowing path from root to tip
- Each node shows: haplogroup label, defining mutations (on tap)
- Sibling branches shown dimmed for context
- Zoomable/pannable for large trees (Y-DNA can be deep)

**First step:** Audit the current haplogroup UI before building.
If a tree already exists, skip this component.

**Files likely touched:**
- Haplotype/haplogroup view components (find via search)

---

## Design Constraints

- Dark-mode first (`#0a0d14`/`#0f1420` backgrounds)
- Glassmorphism where appropriate (backdrop-blur, `border-white/10`)
- Accent colors: cyan/teal/sky primary
- Use existing `ancestryThemes.ts` for continent colors
- Lucide icons, no emoji in UI
- Mobile-friendly: all visualizations must work on small screens
- 48px minimum touch targets

---

## Process

- Branch from main: ancestry-visual-overhaul
- Implement in order: 1 → 2 → 3 → 4
- After each component: `npx tsc --noEmit` must exit 0
- Final: `npx vitest run` must show 0 failures
- Push, do NOT open a PR or merge
- Report back for Orbit verification with screenshots of each component

Model: Gemini 3.1 Pro Low.
