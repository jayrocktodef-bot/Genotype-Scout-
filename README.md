<div align="center"><img width="1200" height="475" alt="Genotype Scout banner" src="https://writteninthegenome.blog/wp-content/uploads/2026/04/17762177921467E26841384755661462607.webp" /></div>

# Genotype Scout — V5.16.0

> ⚠️ **Beta — research & educational tool.** Genotype Scout is in active beta and is **not an ethnicity calculator**. Its results are exploratory, are **not directly comparable** to the ethnicity estimates from commercial tests (23andMe, AncestryDNA), and are **not medical or diagnostic advice**.

**Genotype Scout** is a privacy-first genomic analysis suite created by Jequan Davis. It lets you process your raw DNA files **entirely in your browser**, so sensitive genetic data never leaves your device for standard analysis. Installable as a **Progressive Web App (PWA)** for offline access on any device.

[🚀 Launch the app](https://witg-genotype-scout.vercel.app/) · [📖 Blog](https://WrittenInTheGenome.blog) · [💬 Facebook Group](https://www.facebook.com/share/g/1EFyWD35tB/)

---

## ✨ What's New in V5.16.0

- **Archaic Hominin Introgression Engine** — Direct calculation of Neanderthal and Denisovan introgression affinity across diagnostic genomic loci, quantifying deep hominin inheritance.
- **Ancient Archaeological Match Engine** — Deep lineage matching connecting user Y-DNA and mtDNA haplogroups against radiocarbon-dated ancient fossil genomes across paleogenomic eras.
- **Forensic & Mitochondrial Database Suite**:
  - *EMPOP Forensic Engine*: Mitochondrial DNA forensic database matching for high-confidence lineage verification.
  - *Phylotree Build 17 & gnomAD mtDNA*: Integrated full Phylotree mtDNA tree navigation and gnomAD mitochondrial allele frequencies.
  - *MITOMAP & hMitoGeo Engines*: Pathogenic mitochondrial mutation tracking and geographical haplogroup distribution mapping.
  - *TMRCA Coalescent Estimator*: Time to Most Recent Common Ancestor timeline estimator for paternal and maternal clades.
  - *YHRD Y-STR Engine*: Y-chromosome Haplotype Reference Database forensic matching.
- **Optimized Multi-Threaded Worker Pipeline** — Direct `sanitizePayload` payload sanitization removes JSON serialization overhead when transferring results from `genotypeWorker.ts` to the UI.
- **Autosomal Masking in Deconvolution** — Isolated sex chromosomes (`X`, `Y`, `MT`) during subpopulation oracle calculations to eliminate haplogroup marker interference in autosomal admixture.

---

## ✨ Highlights from V5.15

- **Log-Likelihood Ratio (LLR) Specificity Weighting** — Replaced unweighted binary marker matching with LLR probability scoring ($\text{LLR}_k = \ln[P(G \mid p_k)/P(G \mid p_{\text{bg}})]$) and diagnostic private SNP gating.
- **Elastic-Net Regularized NNLS Solver ($\lambda_1 / \lambda_2$)** — L1 soft-thresholding ($\lambda_1 = 10^{-4}$) and L2 Ridge regularization ($\lambda_2 = 10^{-4}$) to prevent admixed profiles from collapsing into intermediate centroid proxies.
- **Enriched Macro-Groups & Minor Signal Retention** — Expanded `MACRO_GROUPS` to map 150+ HGDP/SGDP/1000G reference populations and lowered Pass 2 continental selection thresholds to `0.05%`.
- **True Multi-Worker Parallelism** — Parallelized CPU-bound analysis engines using a dynamically dispatched Web Worker pool (`navigator.hardwareConcurrency`, up to 8 threads).
- **Desktop UI Overhaul** — Sleek, native OS-style desktop environment with floating app modules and optimized accessibility.

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
| **Admixture Engine** | Human Origins (K61) with Lawson-Hanson NNLS solver |
| **PWA** | `vite-plugin-pwa` with Workbox service worker, offline precaching, runtime font/asset caching |
| **Theme** | Light (default) / Dark mode toggle with CSS custom properties |

---

## 🧬 Ancestry Informative Markers (AIMs) & Forensic Architecture

Genotype Scout leverages an extensive, curated database of **Ancestry Informative Markers (AIMs)** and specialized forensic panels to deliver high-resolution biogeographical ancestry estimation and subpopulation deconvolution.

### 📊 AIMs Database Breakdown

| Marker Database / Panel | Marker Count | Purpose / Scope |
| :--- | :---: | :--- |
| **Regional & Global AIMs** (`src/data/aims/`) | **21,105** | Curated multi-population marker library spanning 11 biogeographical regions. |
| **Normalized Master AIMs** (`master_aims_normalized.json`) | **17,886** | Standardized, Ensembl-validated markers with LLR probability weights and reference allele frequencies. |
| **Cosmopolitan AIMs** | **10,076** | Core high-divergence markers for continental macro-group separation. |
| **GRAF-10k Panel** | **8,821** | High-resolution genomic ancestry refinement and subcontinental clustering. |
| **Forensic Microhaplotypes** | **3,053** | High-density multi-SNP forensic microhaplotype loci for mixture deconvolution. |
| **VISAGE Phenotypic Panel** | Comprehensive | Complex appearance, pigmentation (eye, hair, skin), and phenotypic trait estimation. |
| **EUROFORGEN NAME Panel** | Validated | High-sensitivity forensic biogeographical ancestry markers. |
| **EMPOP & YHRD** | Full Databases | Comprehensive mitochondrial DNA (Phylotree 17) and Y-STR population databases. |

#### 🌍 Regional AIMs Distribution (21,105 Markers)
* **Global Core Anchors:** 15,560 markers
* **European Substructure:** 3,180 markers
* **African Lineages:** 1,101 markers
* **North African:** 995 markers
* **South Asian:** 986 markers
* **Middle Eastern:** 978 markers
* **Oceanian:** 974 markers
* **Native American (Indigenous Americas):** 968 markers
* **East Asian:** 966 markers
* **African American Specific:** 929 markers
* **Central Asian:** 914 markers

---

## 📋 Feature Breakdown

### 🌍 High-Precision Ancestry
Calculate complex admixture percentages using advanced Non-Negative Least Squares (NNLS) methods with Human Origins (K61) reference populations. Your genotype is compared against dense population frequency datasets with LD-pruned, strand-aligned markers for high-dimensional ancestral origin estimation. 95% confidence intervals are computed per population.

### 🏛️ Ancient DNA & Archaic Hominin Oracle
Weighted Ancient DNA matching and archaic introgression scoring. Quantifies Neanderthal and Denisovan affinity while connecting user lineages against 54 radiocarbon-dated ancient fossil genomes.

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
