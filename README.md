<div align="center"><img width="1200" height="475" alt="Genotype Scout banner" src="https://writteninthegenome.blog/wp-content/uploads/2026/04/17762177921467E26841384755661462607.webp" /></div>

# Genotype Scout — V4.5 Beta

> ⚠️ **Beta — research & educational tool.** Genotype Scout is in active beta and is **not an ethnicity calculator**. Its results are exploratory, are **not directly comparable** to the ethnicity estimates from commercial tests (23andMe, AncestryDNA), and are **not medical or diagnostic advice**.

**Genotype Scout** is a privacy-first genomic analysis suite created by Jequan Davis. It lets you process your raw DNA files **entirely in your browser**, so sensitive genetic data never leaves your device for standard analysis. Installable as a **Progressive Web App (PWA)** for offline access on any device.

[🚀 Launch the app](https://witg-genotype-scout.vercel.app/) · [📖 Blog](https://WrittenInTheGenome.blog) · [💬 Facebook Group](https://www.facebook.com/share/g/1EFyWD35tB/)

---

## ✨ What's New in V4.5

- **Ultra-Fast DNA Parsing** — Replaced global regex evaluation with a line-by-line index-based search, reducing parse times for massive DNA files to milliseconds.
- **True Multi-Worker Parallelism** — Parallelized all 11 CPU-bound analysis engines using a dynamically dispatched Web Worker pool (`navigator.hardwareConcurrency`), achieving a 2-3x speedup on post-parsing analysis.
- **Improved HMM Local Ancestry Inference** — Overhauled the Hidden Markov Model (HMM) Viterbi chromosome painter to model transition rates dynamically using physical base-pair distances (1 cM/Mb scale) and smoothed boundary emissions using a Laplace prior.
- **Ancestry-Aware Genotype Imputation** — Upgraded the targeted imputation engine to run regional cohort detection (sensing Native American, African, East Asian, and European diagnostic signals) to apply ancestry-aware imputation frequencies instead of a flat global average.
- **Expanded Regional Anchor AIMs** — Updated the core Ancestry Informative Markers database (Seldin 128 / FROG-kb panels) to incorporate highly diagnostic anchors for underrepresented Oceanian, Native American, and MENA cohorts.
- **Phenotype & Appearance Engine** — Exposed comprehensive phenotypic trait analysis to predict eye color, hair color, skin pigmentation, and baldness risk using the VISAGE forensics panel.
- **Autoimmune & Celiac Disease Tracking** — Integrated high-fidelity HLA risk markers to identify susceptibility to Celiac disease and other autoimmune conditions within the Health tab.
- **Marker Database Hydration** — Executed a massive automated metadata hydration pipeline, repairing structural defects and injecting missing chromosomal coordinates for over 5,000 diagnostic markers.
- **Fixed NNLS Admixture Proportions** — Resolved the single-population deconvolution collapse by implementing a stable numerical sort in the simplex projection logic.
- **Optimized Worker Payloads** — Replaced expensive global JSON serialization with direct targeted payload sanitization, removing execution bottlenecks.
- **Real-Time Progress Streaming** — Added streaming progress events per engine, keeping the UI fully interactive and informative during the post-parsing phase.
- **AIMs Database Normalization** — Fixed case-sensitive regional overrides and integrated missing Central Asian ancestry markers for higher accuracy.
- **Dark / Light Mode Toggle** — Switch freely between themes via the navbar Sun/Moon button. Light mode is the default.
- **PWA Support** — Install Genotype Scout to your home screen (Android, iOS, desktop). Works offline after the first load.
- **NNLS Admixture Solver** — Replaced least-squares with a Lawson-Hanson Non-Negative Least Squares engine for more accurate population mixing proportions.
- **Dynamic Strand Alignment** — Automatic complement-based flip correction ensures markers on the reverse strand are matched correctly.
- **LD Pruning** — 50 kb sliding-window linkage disequilibrium pruning removes redundant markers for cleaner ancestry signals.
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

---

## ⚙️ Technical Architecture

Genotype Scout leverages modern web technologies to handle computationally intensive genomic processing without compromising the user experience.

| Component | Technology |
| :--- | :--- |
| **Runtime** | React 19 + Vite |
| **Language** | TypeScript (`strict` mode) |
| **Styling** | Tailwind CSS v4 with custom design tokens |
| **Performance** | Multi-worker parallel thread pool for concurrent analysis engines; streaming parser; code-split chunks for fast app-shell load |
| **On-device ML** | ONNX model via `onnxruntime-web` — no cloud calls, no API key |
| **Admixture Engine** | MDLP K16 with Lawson-Hanson NNLS solver |
| **PWA** | `vite-plugin-pwa` with Workbox service worker, offline precaching, runtime font/asset caching |
| **Theme** | Light (default) / Dark mode toggle with CSS custom properties |

---

## 🧬 Forensic & High-Resolution Analysis

We utilize specialized, industry-recognized forensic panels to maximize the accuracy of our reports.

| Forensic Panel | Purpose |
| :--- | :--- |
| **10k GRAF** | High-resolution genomic ancestry refinement. |
| **VISAGE** | Phenotypic and appearance-related marker identification. |
| **EUROFORGEN NAME** | High-sensitivity forensic biogeographical ancestry markers. |

---

## 📋 Feature Breakdown

### 🌍 High-Precision Ancestry
Calculate complex admixture percentages using advanced Non-Negative Least Squares (NNLS) methods with MDLP K16 reference populations. Your genotype is compared against dense population frequency datasets with LD-pruned, strand-aligned markers for high-dimensional ancestral origin estimation. 95% confidence intervals are computed per population.

### 🏛️ Ancient DNA Oracle
Weighted Ancient DNA matching. The engine applies weight boosts to region-specific Ancestry Informative Markers (AIMs), reducing noise and providing higher-confidence matches to ancestral populations.

### 🧠 Haplogroup Classification
Hierarchical matching identifies your terminal SNP. Navigate paternal (Y-DNA) and maternal (mtDNA) lineages with classification logic that prioritizes the highest hierarchical rank for maximum specificity. Flanking branch consensus validation improves accuracy for deep subclades.

### 🩺 Health & Wellness Reports
Educational, genotype-based insights (not medical advice):
*   **ABO & Rh Blood Type:** inferred from genotype markers.
*   **Secretor Status:** FUT2 and related marker analysis.
*   **APOE & other risk markers:** genetic marker analysis for health-related context.

### 📱 Progressive Web App
Install Genotype Scout directly to your home screen on Android, iOS, or desktop. After the first visit, the app shell and core assets are cached for offline access — your DNA analysis works even without an internet connection.

---

## 🏗️ License
This project is proprietary software created by Jequan Davis. Unauthorized distribution or commercial use is prohibited without express written permission.
