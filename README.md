<div align="center"><img width="1200" height="475" alt="Banner" src="https://jequandavis.wpcomstaging.com/wp-content/uploads/2026/04/17762177921467E26841384755661462607.webp" /></div>

# Genotype Scout

**Genotype Scout** is a professional-grade, privacy-first genomic analysis suite created by Jequan Davis. Designed for precision, this platform allows users to process their raw DNA files locally, ensuring sensitive genetic data never leaves the user's browser or device unnecessarily. 

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
Genotype Scout leverages modern web technologies to handle computationally intensive genomic processing tasks without compromising the user experience.

*   **Runtime:** React 18+ with Vite.
*   **Infrastructure:** TypeScript for mission-critical type safety across all genetic calculations.
*   **Performance:** Offloads heavy string parsing and matrix calculations to Web Workers to ensure a responsive UI during data heavy-lifting.
*   **AI Integration:** Optional AI-powered features for trait analysis (requires API key).

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
Calculate complex admixture percentages using advanced Least Squares Methods. Compare your unique genotype against dense population frequency datasets to interpret your ancestral origins with high dimensionality.

### 🏛️ Ancient DNA Oracle
Utilize weighted Ancient DNA matching. Our engine applies specific weight boosts to region-specific Ancestry Informative Markers (AIMs), reducing noise and providing high-confidence matches to ancestral populations.

### 🧠 Haplogroup Classification
Hierarchical matching systems identify your Terminal SNP. Navigate complex paternal and maternal lineages with advanced classification logic, prioritizing the highest hierarchical rank for maximum specificity.

### 🩺 Health & Wellness Reports
Actionable insights based on your genotype:
*   **ABO Blood Type:** AI-assisted inference.
*   **Secretor Status:** FUT2 and matching markers analysis.
*   **APOE Risk:** Genetic marker analysis for health-related metrics.

---

## 🚀 Installation

Ensure you have [Node.js](https://nodejs.org/) installed, then follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/genotype-scout.git
   cd genotype-scout
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   You will need a Gemini API Key to enable advanced AI-powered trait interpretation. Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 🏗️ License
This project is proprietary software created by Jequan Davis. Unauthorized distribution or commercial use is prohibited without express written permission.
