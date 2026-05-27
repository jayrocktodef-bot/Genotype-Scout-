<div align="center"><img width="1200" height="475" alt="Banner" src="https://jequandavis.wpcomstaging.com/wp-content/uploads/2026/04/17762177921467E26841384755661462607.webp" /></div>

# Genotype Scout

**Genotype Scout** is a professional-grade, privacy-first genomic analysis suite built by [Jequan Davis](https://writteninthegenome.blog). Every computation — from ancestry admixture to pharmacogenomics — runs entirely inside your browser. Your raw DNA never touches a server.

[![Live App](https://img.shields.io/badge/Launch-Genotype_Scout-0d9488?style=for-the-badge&logo=vercel&logoColor=white)](https://witg-genotype-scout.vercel.app/)

---

## Table of Contents

- [Privacy Architecture](#-privacy-architecture)
- [Feature Overview](#-feature-overview)
- [Ancestry Analysis](#-ancestry-analysis)
- [Forensic Marker Panels](#-forensic-marker-panels)
- [Ancient DNA Analysis](#-ancient-dna-analysis)
- [Haplogroup Classification](#-haplogroup-classification)
- [Health & Wellness](#-health--wellness)
- [Blood Type Systems](#-blood-type-systems)
- [Phenotype Prediction](#-phenotype-prediction)
- [Supported File Formats](#-supported-file-formats)
- [Technical Architecture](#-technical-architecture)
- [Installation](#-installation)
- [License](#-license)

---

## 🔒 Privacy Architecture

Privacy is not a feature — it's the architecture. Genotype Scout implements a **Zero-Footprint** strategy: every byte of your genetic data is processed locally and never transmitted.

| Layer | Mechanism |
| :--- | :--- |
| **File Ingestion** | `FileReader` API loads raw data into isolated RAM |
| **Computation** | Sandboxed Web Workers execute all parsing, matching, and scoring off the main thread |
| **Storage** | Optional `IndexedDB` persistence — a browser-native database physically on *your* disk, scoped to this origin |
| **Verification** | Open DevTools → Network tab during analysis. Zero outbound traffic for DNA data. |

> **No uploads. No server-side processing. No telemetry on genetic data. Verifiable by design.**

---

## 🧬 Feature Overview

| Module | What It Does |
| :--- | :--- |
| **Dashboard** | At-a-glance admixture chart, top regions, health marker summary, and navigation hub |
| **Ancestry Oracle** | Continental + sub-population admixture via 10,000 SNP GRAF panel and Bayesian likelihood |
| **Scout Score** | Naive ethnicity estimation with custom Ancestry Informative Markers (AIMs) |
| **Ancient DNA Oracle** | Weighted matching against ancient genome samples and historical population clusters |
| **Haplogroups / Lineages** | Terminal SNP identification for Y-DNA and mtDNA with phylogenetic tree visualization |
| **Blood Type** | Full ABO, Rh, and 12+ extended blood group system predictions |
| **Health & Wellness** | Pharmacogenomics (PGx), dietary traits, clinical risk markers, and APOE analysis |
| **Phenotype** | Eye, hair, and skin color prediction via the HIrisPlex-S 41-SNP panel |
| **Chromosome Painter** | Canvas-rendered ideogram showing continental ancestry assignments across all 23 chromosomes |
| **PCA Map** | Interactive SVG scatter plot projecting your genome into HGDP + 1000 Genomes PC1×PC2 space |
| **Methodology** | Full transparency into the algorithms, solvers, and reference data behind every result |
| **Passport Export** | One-click PDF export of your complete results profile |

---

## 🌍 Ancestry Analysis

### Continental Admixture (Oracle Engine)
The primary ancestry engine uses a **10,000 SNP GRAF-pop reference panel** across **26 sub-populations** from the 1000 Genomes Project. Admixture proportions are solved using **Non-Negative Least Squares (NNLS)** with Bayesian likelihood scoring.

- **5 super-populations**: EUR, AFR, EAS, SAS, AMR
- **26 sub-populations**: GBR, CEU, FIN, TSI, IBS, YRI, LWK, GWD, MSL, ESN, ASW, ACB, CHB, CHS, CDX, KHV, JPT, GIH, PJL, BEB, STU, ITU, CLM, MXL, PEL, PUR
- **Exclusive Native cohorts**: Curated Amerind AIMs optimized to isolate high-precision indigenous North, Central, and South American genomic profiles
- Confidence intervals via bootstrap resampling
- Quality control scoring for input data integrity

### Deep Regional Matching (Sub-Population Bento)
Goes beyond continental labels to identify your closest sub-population affinity using Euclidean distance and admixture modeling. Results include proximity labels (Exceptional → Distal) and detailed breakdowns.

### PCA Projection
Your genome is projected into principal component space alongside HGDP and 1000 Genomes reference samples. Interactive SVG visualization shows exactly where you cluster relative to global populations.

### Chromosome Painting
A canvas-rendered ideogram colors each chromosome segment by inferred continental ancestry. Visual, immediate, and exportable.

### Population Comparison
Head-to-head proximity analysis against all reference populations with ranked affinity scores.

---

## 🔬 Forensic Marker Panels

Genotype Scout integrates multiple industry-recognized forensic and research panels:

| Panel | Markers | Purpose |
| :--- | :--- | :--- |
| **GRAF 10K** | ~10,000 SNPs | High-resolution genomic ancestry refinement |
| **VISAGE** | Targeted panel | Phenotypic and appearance-related marker identification |
| **EUROFORGEN NAME** | Forensic AIMs | High-sensitivity biogeographical ancestry markers |
| **Kidd 55 AISNP** | 55 SNPs | Standard forensic ancestry-informative panel |
| **Seldin 128** | 128 SNPs | Population structure and stratification markers |
| **MicroHaplotypes** | Top 100 kernel | Multi-allelic microhaplotype analysis for fine-scale ancestry |
| **Custom Curated** | Hand-selected | Proprietary AIMs optimized for complex admixed populations |
| **Colonial AIMs** | Specialized | Markers targeting colonial-era admixture patterns |
| **Deep African Resolution** | Specialized | High-resolution West African sub-structure markers |

---

## 🏛️ Ancient DNA Analysis

### Ancient Admixture Calculator
Weighted matching against curated ancient genome profiles. The engine applies region-specific weight boosts to Ancestry Informative Markers, reducing noise for high-confidence ancient population affinity.

### Individual Sample Matching
Match your genotype against specific ancient individuals with affinity percentages, geographic origins, and era information.

### Historical Cluster Engine
Identifies your closest historical population clusters — groups of ancient samples that share a common geographic and temporal context.

---

## 🧠 Haplogroup Classification

### Y-DNA (Paternal)
- Hierarchical tree traversal from the root of the Y-chromosome phylogeny
- Terminal SNP identification using the ISOGG Y-DNA tree (PhyloTree Build 17)
- Derived/ancestral allele scoring with IUPAC code support
- Deep subclade resolution with specificity ranking

### mtDNA (Maternal)
- Mitochondrial haplogroup prediction using MITOMAP-confirmed variants
- Phylogenetic tree visualization for maternal lineage navigation
- Haplogroup enrichment logic for maximum subclade depth

---

## 🩺 Health & Wellness

> ⚠️ **Educational research only.** Genotype Scout does not provide medical advice. All health-related features are framed as genomic exploration, not clinical diagnostics.

### Pharmacogenomics (PGx)
Star-allele calling for key drug-metabolism genes using PyPGx-compatible logic:
- **CYP2D6** — metabolizer status for codeine, tramadol, tamoxifen, and 25% of all prescribed drugs
- **CYP2C19** — clopidogrel, omeprazole, and SSRI metabolism
- **DPYD** — fluoropyrimidine toxicity risk (5-FU, capecitabine)

Clinical medication safety reports flag actionable gene–drug interactions.

### Dietary & Wellness Traits
Genotype-driven insights for nutrition and lifestyle markers including lactose tolerance, caffeine metabolism, alcohol flush response, and more.

### APOE Analysis
Genotyping of the APOE ε2/ε3/ε4 alleles with educational context on associated health research.

---

## 🩸 Blood Type Systems

Comprehensive blood group prediction across **14 antigen systems**:

| System | Key Markers | What It Predicts |
| :--- | :--- | :--- |
| **ABO** | rs8176719, rs8176746, rs8176747, + 5 more | A/B/AB/O blood group |
| **Rh** | rs590787, rs676785, + 8 more | Rh factor (positive/negative) |
| **Duffy** | rs2814778, rs12075, rs34599049 | Duffy antigen (malaria resistance marker) |
| **Kidd** | rs1058396, rs10755968 | Jk(a)/Jk(b) phenotype |
| **MNS** | rs7683365, rs11273308, rs2250101 | M/N/S antigens |
| **Kell** | rs8176058, rs12046423 | K/k antigen |
| **Secretor** | rs601338, rs602662, rs1047781 | FUT2 secretor status |
| **Lewis** | rs3894326, rs3745635, rs28362491 | Le(a)/Le(b) |
| **Colton** | rs2836269 | Co(a)/Co(b) |
| **Lutheran** | rs2298661 | Lu(a)/Lu(b) |
| **Cartwright** | rs11551124 | Yt(a)/Yt(b) |
| **Dombrock** | rs11276 | Do(a)/Do(b) |
| **Knops** | rs1145322 | Kn(a)/Kn(b) |
| **H Antigen** | rs1047781 | H status (Bombay phenotype marker) |

---

## 👁️ Phenotype Prediction

Leverages the **HIrisPlex-S 41-SNP panel** — the forensic standard for externally visible characteristic (EVC) prediction:
- **Eye color** — blue, brown, intermediate
- **Hair color** — black, brown, red, blond
- **Skin color** — very pale to very dark (5-category scale)

---

## 📂 Supported File Formats

| Provider / Format | Extension | Support |
| :--- | :--- | :--- |
| **23andMe** | `.txt` | ✅ Full |
| **AncestryDNA** | `.txt` | ✅ Full |
| **MyHeritage** | `.csv` | ✅ Full |
| **PLINK** | `.bed` / `.bim` / `.fam` | ✅ Full |
| **ZIP archives** | `.zip` | ✅ Auto-extraction |

The streaming DNA parser handles files up to 45 MB with support for non-standard genotype calls (N, I, D). Malformed files receive detailed diagnostic messages with suggested solutions.

---

## ⚙️ Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│  Browser (Client-Side Only)                         │
│                                                     │
│  ┌──────────┐    ┌──────────────────────────────┐   │
│  │ React 19 │◄──►│   Web Workers (Sandboxed)    │   │
│  │ + Vite   │    │                              │   │
│  │ + TS     │    │  ┌─ genotypeWorker ────────┐ │   │
│  │          │    │  │  DNA parsing             │ │   │
│  │          │    │  │  SNP matching            │ │   │
│  │          │    │  │  Ancestry calculation    │ │   │
│  │          │    │  │  Haplogroup prediction   │ │   │
│  │          │    │  └─────────────────────────┘ │   │
│  │          │    │  ┌─ healthWorker ──────────┐ │   │
│  │          │    │  │  PGx star-allele calling│ │   │
│  │          │    │  │  Blood type prediction  │ │   │
│  │          │    │  │  Dietary trait analysis  │ │   │
│  │          │    │  └─────────────────────────┘ │   │
│  │          │    │  ┌─ plinkWorker ──────────┐  │   │
│  │          │    │  │  PLINK binary parsing   │  │   │
│  │          │    │  └─────────────────────────┘  │   │
│  └──────────┘    └──────────────────────────────┘   │
│       │                                             │
│  ┌────┴──────────────────────────────────────────┐  │
│  │  ONNX Runtime (In-Browser ML)                 │  │
│  │  → Ancestry classification model              │  │
│  └───────────────────────────────────────────────┘  │
│       │                                             │
│  ┌────┴──────────────────────────────────────────┐  │
│  │  IndexedDB (Optional Local Persistence)       │  │
│  │  → Results only. Raw data never stored.       │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
         ▲
         │ Zero outbound DNA traffic
         ▼
    ┌──────────┐
    │  Vercel  │  Static hosting only
    └──────────┘
```

### Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React 19 |
| **Build** | Vite 6 |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS v4 |
| **Charts** | Recharts |
| **Animation** | Motion (Framer Motion) |
| **PDF Export** | jsPDF |
| **ML Inference** | ONNX Runtime Web |
| **Hosting** | Vercel |
| **Analytics** | Vercel Analytics + Speed Insights |

### Engine Architecture

| Engine | File | Purpose |
| :--- | :--- | :--- |
| `oracleEngine` | `src/engines/ancestry/oracleEngine.ts` | Primary NNLS ancestry solver |
| `fastMatrixEngine` | `src/engines/ancestry/fastMatrixEngine.ts` | Optimized Float32Array population proximity |
| `comprehensiveEngine` | `src/engines/ancestry/comprehensiveEngine.ts` | Multi-panel ensemble ancestry |
| `grafAncEngine` | `src/engines/ancestry/grafAncEngine.ts` | GRAF-specific ancestry refinement |
| `k27AncEngine` | `src/engines/ancestry/k27AncEngine.ts` | K=27 population model |
| `microHapEngine` | `src/engines/ancestry/microHapEngine.ts` | Microhaplotype-based fine ancestry |
| `historicalClusterEngine` | `src/engines/ancestry/historicalClusterEngine.ts` | Ancient population cluster matching |
| `admixtureCalculator` | `src/engines/admixtureCalculator.ts` | Statistical admixture estimation |
| `bloodTypeCalculator` | `src/engines/bloodTypeCalculator.ts` | ABO + extended blood group inference |
| `dietaryCalculator` | `src/engines/dietaryCalculator.ts` | Genotype-driven dietary trait logic |
| `comprehensiveHealthEngine` | `src/engines/health/comprehensiveHealthEngine.ts` | Orchestrates all health analyses |
| `pgxCalculator` | `src/engines/health/pgxCalculator.ts` | Clinical medication safety reports |
| `pypgxEngine` | `src/engines/health/pypgxEngine.ts` | Star-allele calling (CYP2D6, CYP2C19, DPYD) |

### Reference Data

| Dataset | File | Records |
| :--- | :--- | :--- |
| Master AIMs (normalized) | `src/data/master_aims_normalized.json` | 10,000+ markers |
| GRAF 10K index | `src/data/raw_aims/graf_10k_index.json` | GRAF panel reference |
| Ancient profiles | `src/data/master_ancient_profiles.json` | Curated ancient genomes |
| Y-DNA tree | `src/constants/haplogroups.ts` | Full Y-chromosome phylogeny |
| mtDNA tree | `src/constants/haplogroups.ts` | Mitochondrial phylogeny |
| PhyloTree Build 17 | `src/data/haplogroups/PhyloTreeBuild17.csv` | ISOGG haplogroup definitions |
| MITOMAP confirmed | `src/data/mitochondrial/mitomap_confirmed.csv` | Confirmed mtDNA variants |
| Health & PGx | `src/data/master_health_pgx.json` | Clinical + pharmacogenomic markers |
| 1000 Genomes frequencies | `src/data/reference/1000genomes_frequencies.json` | Population allele frequencies |
| PCA reference | `src/data/raw_aims/pca_reference_data.json` | HGDP + 1kGP PCA coordinates |

---

## 🚀 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- npm 9+

### Setup

```bash
# Clone the repository
git clone https://github.com/jayrocktodef-bot/WITG-Genotype-Scout.git
cd WITG-Genotype-Scout

# Install dependencies
npm install

# Configure environment (optional — for AI-powered trait interpretation)
cp .env.example .env
# Edit .env and add your Gemini API key

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm run preview
```

### Data Sync Scripts

```bash
npm run sync-all      # Rebuild all reference data and compile
npm run sync-pgx      # Update pharmacogenomics data
npm run sync-graf     # Refresh GRAF weights
npm run sync-pca      # Refresh PCA reference data
npm run build-health  # Rebuild health marker database
npm run build-ancient # Rebuild ancient DNA profiles
npm run test          # Run test suite (Vitest)
```

---

## 🏗️ License

This project is proprietary software created by Jequan Davis. Unauthorized distribution or commercial use is prohibited without express written permission.

---

<div align="center">
  <strong>GENOTYPE SCOUT™</strong> — Your privacy-first local genomic analysis suite.
  <br /><br />
  <a href="https://writteninthegenome.blog">Blog</a> · <a href="https://witg-genotype-scout.vercel.app/">Live App</a>
</div>
