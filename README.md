<div align="center"><img width="1200" height="475" alt="Genotype Scout banner" src="https://writteninthegenome.blog/wp-content/uploads/2026/04/17762177921467E26841384755661462607.webp" /></div>

# Genotype Scout

> ⚠️ **Beta — research & educational tool.** Genotype Scout is in active beta and is **not an ethnicity calculator**. Its results are exploratory, are **not directly comparable** to the ethnicity estimates from commercial tests (23andMe, AncestryDNA), and are **not medical or diagnostic advice**.

**Genotype Scout** is a privacy-first genomic analysis suite created by Jequan Davis. It lets you process your raw DNA files **entirely in your browser**, so sensitive genetic data never leaves your device for standard analysis.

[Access the hosted application here](https://witg-genotype-scout.vercel.app/)

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
*   **Performance:** Heavy string parsing and matrix calculations are offloaded to Web Workers to keep the UI responsive. The production bundle is code-split (large genomic datasets and the ML runtime load on demand) so the app shell loads fast.
*   **On-device ML:** A local ONNX model runs **in the browser** via `onnxruntime-web` — no cloud calls and no API key required.

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
Calculate complex admixture percentages using advanced Least Squares (NNLS) methods. Your genotype is compared against dense population frequency datasets to interpret ancestral origins with high dimensionality.

### 🏛️ Ancient DNA Oracle
Weighted Ancient DNA matching. The engine applies weight boosts to region-specific Ancestry Informative Markers (AIMs), reducing noise and providing higher-confidence matches to ancestral populations.

### 🧠 Haplogroup Classification
Hierarchical matching identifies your terminal SNP. Navigate paternal (Y-DNA) and maternal (mtDNA) lineages with classification logic that prioritizes the highest hierarchical rank for maximum specificity.

### 🩺 Health & Wellness Reports
Educational, genotype-based insights (not medical advice):
*   **ABO & Rh Blood Type:** inferred from genotype markers.
*   **Secretor Status:** FUT2 and related marker analysis.
*   **APOE & other risk markers:** genetic marker analysis for health-related context.

---

## 🚀 Local Development

Ensure you have [Node.js](https://nodejs.org/) (v20+) installed, then:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jayrocktodef-bot/WITG-Genotype-Scout.git
   cd WITG-Genotype-Scout
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

### Useful scripts
```bash
npm run build          # production build (runs the data-JSON validation guard first)
npm test               # run the vitest suite
npm run lint           # type-check (tsc --noEmit, strict)
npm run validate:json  # verify all data JSON files parse (guards against truncation)
```

---

## 🏗️ License
This project is proprietary software created by Jequan Davis. Unauthorized distribution or commercial use is prohibited without express written permission.
