<div align="center"><img width="1200" height="475" alt="Genotype Scout banner" src="https://writteninthegenome.blog/wp-content/uploads/2026/04/17762177921467E26841384755661462607.webp" /></div>

# Genotype Scout

> ⚠️ **Beta — research & educational tool.** Genotype Scout is in active beta and is **not an ethnicity calculator**. Its results are exploratory, are **not directly comparable** to the ethnicity estimates from commercial tests (23andMe, AncestryDNA), and are **not medical or diagnostic advice**.

**Genotype Scout** is a privacy-first genomic analysis suite created by Jequan Davis. It lets you process your raw DNA files **entirely in your browser**, so sensitive genetic data never leaves your device for standard analysis.

[Access the hosted application here](https://witg-genotype-scout.vercel.app/)

---

## ✨ What's New in V4.5

- **Dark / Light Mode Toggle** — Switch freely between themes via the navbar Sun/Moon button. Light mode is the default.
- **PWA Support** — Install Genotype Scout to your home screen (Android, iOS, desktop). Works offline after the first load.
- **NNLS Admixture Solver** — Replaced least-squares with a Lawson-Hanson Non-Negative Least Squares engine for more accurate population mixing proportions.
- **Dynamic Strand Alignment** — Automatic complement-based flip correction ensures markers on the reverse strand are matched correctly.
- **LD Pruning** — 250 kb sliding-window linkage disequilibrium pruning removes redundant markers for cleaner ancestry signals.
- **Haplogroup Consensus Validation** — Flanking SNP checks allow bypassing ancestral rejection when sufficient descendant evidence exists.
- **Tactile UI Micro-interactions** — Hover lifts, press scaling, and smooth transitions across all tabs and buttons.
- **Streaming Tabs Navigation** — Horizontal scrolling navigation bar replacing the mobile hamburger menu, ensuring immediate access to all tools.
- **Ancient Matches Routing** — Renamed "Famous Comparisons" to "Ancient Matches", directing the user straight to the Ancient DNA tab.
- **Plain English Methodology Explainers** — Complete overhaul of the Methodology tab to explain all 10 calculation engines in plain English alongside the technical algorithms.

---

## 🔒 Commitment to Privacy & Security
The core philosophy of Genotype Scout is binary-level privacy. Your raw DNA file is parsed, analyzed, and visualized **entirely in your browser** using high-performance Web Workers. Your raw genetic data is never uploaded to or processed by any server.

To be fully transparent about what stays on your device and what (optionally) leaves it:

- **Core analysis is 100% local.** Raw DNA parsing, ancestry, haplogroups, and health/trait analysis run client-side. No raw data is transmitted anywhere.
- **Results are saved on your device.** Computed results are stored locally in your browser's IndexedDB so your session persists between visits. They remain on this device until you use the in-app **Clear** action (or clear your browser storage), and are not encrypted at rest — avoid running the tool on a shared/public computer, or clear your data when finished.
- **Optional, opt-in features that involve third parties:**
  - *Anonymous usage analytics* (Vercel Analytics & Speed Insights) collect aggregate page/performance metrics. No genetic data is included.
  - *Export to Google Slides* requires you to sign in with Google and sends an ancestry summary (health markers excluded) to **your own** Google account. It runs only when you explicitly trigger an export.

## ⚙️ Technical Architecture
Genotype Scout leverages modern web technologies to handle computationally intensive genomic processing without compromising the user experience.

*   **Runtime:** React 19 with Vite.
*   **Language:** TypeScript in `strict` mode for type safety across all genetic calculations.
*   **Performance:** Heavy string parsing and matrix calculations are offloaded to Web Workers to keep the UI responsive. The engine features on-device streaming file parsing to support processing large raw files without locking the browser thread.
*   **On-device ML:** A local ONNX model runs **in the browser** via `onnxruntime-web` — no cloud calls and no API key required.
*   **Mobile-First UI/UX:** Responsive bento-grid layouts, mobile-drawer navigation height constraints, and touch-swipeable tab scroll carousels to optimize rendering on small screens.
*   **PWA Integrations:** Precached application shell assets with fallback offline routing strategies using standard service workers.

## 🧬 Forensic & High-Resolution Analysis
We utilize specialized, industry-recognized forensic panels to maximize the accuracy of our reports.

| Forensic Panel | Purpose |
| :--- | :--- |
| **10k GRAF** | High-resolution genomic ancestry refinement. |
| **VISAGE** | Phenotypic and appearance-related marker identification. |
| **EUROFORGEN NAME** | High-sensitivity forensic biogeographical ancestry markers. |

---

## 📋 Feature Breakdown

### 📂 Universal & Streaming DNA Parsing
Stream-based or chunked parsing of major consumer file formats (23andMe, AncestryDNA, MyHeritage, FamilyTreeDNA, LivingDNA) and standard VCF (Variant Call Format) files, using regex cleanups and genotype verification directly in the browser.

### 🌍 High-Precision Ancestry
Calculate complex admixture percentages using advanced Least Squares (NNLS) methods constrained to the probability simplex ($\sum x_i \approx 1$). Your genotype is compared against dense population frequency datasets with robust complement-strand matching for flipped alleles (palindromic SNPs excluded), phenotypic override weight normalization, and a 1.5% trace noise floor filter to resolve over-scoring skews.

### 🏛️ Ancient DNA Oracle
Weighted Ancient DNA matching. The engine applies weight boosts to region-specific Ancestry Informative Markers (AIMs), reducing noise and providing higher-confidence matches to ancestral populations.

### 🧠 Haplogroup Classification
Hierarchical matching identifies your terminal SNP. Navigate paternal (Y-DNA) and maternal (mtDNA) lineages with classification logic that prioritizes the highest hierarchical rank for maximum specificity.

### 🩺 Health & Wellness Reports
Educational, genotype-based insights (not medical advice):
*   **Pharmacogenomics (PGx):** Mutated-allele counting and diplotype-assembly algorithm for key drug-metabolizing genes (`CYP2D6`, `CYP2C19`, and `DPYD`). Activity scores and phenotype classifications are calculated directly from active star alleles to correctly resolve complex carriers.
*   **ABO & Rh Blood Type:** Inferred from primary deletion markers (`rs8176719`, `rs8176750`) and sequence-specific checks, with linkage disequilibrium (LD) proxy fallbacks (`rs657152`, `rs505922`, `rs8176722`) to handle missing data. Unified parsing and prediction are shared between worker and UI threads for absolute consistency.
*   **Secretor Status:** FUT2 and related marker analysis.
*   **APOE & other risk markers:** genetic marker analysis for health-related context.

---

## 🏗️ License
This project is proprietary software created by Jequan Davis. Unauthorized distribution or commercial use is prohibited without express written permission.
