<div align="center"><img width="1200" height="475" alt="Banner" src="https://jequandavis.wpcomstaging.com/wp-content/uploads/2026/04/17762177921467E26841384755661462607.webp" /></div>

# Genotype Scout

**Genotype Scout** is a professional-grade, privacy-first genomic analysis suite built by [Jequan Davis](https://writteninthegenome.blog). Every computation — from ancestry admixture to pharmacogenomics — runs entirely inside the browser. Raw DNA never touches a server.

[![Live App](https://img.shields.io/badge/Launch-Genotype_Scout-0d9488?style=for-the-badge&logo=vercel&logoColor=white)](https://witg-genotype-scout.vercel.app/)
[![Blog](https://img.shields.io/badge/Blog-Written_In_The_Genome-8B5CF6?style=for-the-badge&logo=wordpress&logoColor=white)](https://writteninthegenome.blog)

---

## Table of Contents

- [Privacy Architecture](#-privacy-architecture)
- [Feature Overview](#-feature-overview)
- [Ancestry Analysis](#-ancestry-analysis)
- [Marker Database](#-marker-database)
- [Forensic Marker Panels](#-forensic-marker-panels)
- [Ancient DNA Analysis](#-ancient-dna-analysis)
- [Haplogroup Classification](#-haplogroup-classification)
- [Health & Wellness](#-health--wellness)
- [Blood Type Systems](#-blood-type-systems)
- [Phenotype Prediction](#-phenotype-prediction)
- [Local Ancestry Inference](#-local-ancestry-inference)
- [Supported File Formats](#-supported-file-formats)
- [Technical Architecture](#-technical-architecture)
- [Installation](#-installation)
- [License](#-license)

---

## 🔒 Privacy Architecture

Privacy is not a feature — it's the architecture. Genotype Scout implements a **Zero-Footprint** strategy: every byte of genetic data is processed locally and never transmitted.

| Layer | Mechanism |
| :--- | :--- |
| **File Ingestion** | `FileReader` API loads raw data into isolated RAM |
| **Computation** | Sandboxed Web Workers execute all parsing, matching, and scoring off the main thread |
| **Storage** | Optional `IndexedDB` persistence — browser-native, physically on *your* disk, scoped to this origin |
| **Verification** | Open DevTools → Network tab during analysis. Zero outbound traffic for DNA data. |

> **No uploads. No server-side processing. No telemetry on genetic data. Verifiable by design.**
>
> 📖 **[Read the full privacy deep-dive: "Your DNA, Your Device" →](https://writteninthegenome.blog/writteninthegenome-privacy-policy/your-dna-your-device-the-engineering-behind-genotype-scouts-zero-footprint-privacy/)**

---

## 🧬 Feature Overview

| Module | What It Does |
| :--- | :--- |
| **Dashboard** | At-a-glance admixture chart, top regions, health marker summary, and navigation hub |
| **Ancestry Oracle** | Continental + sub-population admixture via multi-engine analysis |
| **Scout Score** | Naive ethnicity estimation with Ancestry Informative Markers (AIMs) |
| **Engine Oracle** | Ensemble ancestry analysis combining all engines for highest accuracy |
| **Modern Oracle** | MDLP K16 population model for modern population matching |
| **Granular Ancestry** | Fine-grained sub-population analysis with detailed regional breakdowns |
| **Ancient DNA Oracle** | Weighted matching against ancient genome samples and historical populations |
| **Haplogroups / Lineages** | Terminal SNP identification for Y-DNA and mtDNA with phylogenetic tree visualization |
| **Blood Type** | Full ABO, Rh, and 12+ extended blood group system predictions |
| **Health & Wellness** | Pharmacogenomics (PGx), dietary traits, clinical risk markers, and APOE analysis |
| **Phenotype** | Eye, hair, and skin color prediction via the HIrisPlex-S 41-SNP panel |
| **Chromosome Painter** | Canvas-rendered ideogram showing continental ancestry assignments across all 23 chromosomes |
| **PCA Map** | Interactive SVG scatter plot projecting your genome into HGDP + 1000 Genomes PC1×PC2 space |
| **Population Comparison** | Head-to-head proximity analysis against all reference populations |
| **Famous Matches** | Compare your genotype against famous historical figures |
| **Marker Benchmarks** | Detailed analysis of marker coverage and quality metrics |
| **Methodology** | Full transparency into the algorithms, solvers, and reference data behind every result |
| **Passport Export** | One-click PDF export of your complete results profile |

---

## 🌍 Ancestry Analysis

### Multi-Engine Architecture
Genotype Scout uses an ensemble of specialized ancestry engines, each optimized for different aspects of genomic ancestry:

| Engine | File | Method |
| :--- | :--- | :--- |
| **Oracle** | `oracleEngine.ts` | Primary NNLS solver — Non-Negative Least Squares against 26 sub-populations |
| **Comprehensive** | `comprehensiveEngine.ts` | Bayesian likelihood across 7-population AIM database |
| **GRAF** | `grafAncEngine.ts` | 10,000 SNP GRAF-pop panel with sub-population resonance scoring |
| **MDLP K16** | `mdlpAncEngine.ts` | 16-population model using Human Origins reference kernel |
| **Fast Matrix** | `fastMatrixEngine.ts` | Float32Array optimized proximity calculations |
| **MicroHaplotype** | `microHapEngine.ts` | Multi-allelic microhaplotype-based fine-scale ancestry |
| **Historical Cluster** | `historicalClusterEngine.ts` | Ancient population cluster matching |
| **Worker Pool** | `workerPoolEngine.ts` | RFMix-style local ancestry inference |

### Continental Admixture
- **7 super-populations**: AFR, EUR, EAS, SAS, AMR, MENA, OCE
- **26 sub-populations**: GBR, CEU, FIN, TSI, IBS, YRI, LWK, GWD, MSL, ESN, ASW, ACB, CHB, CHS, CDX, KHV, JPT, GIH, PJL, BEB, STU, ITU, CLM, MXL, PEL, PUR
- Confidence intervals via bootstrap resampling
- Quality control scoring for input data integrity

### Deep Regional Matching
Goes beyond continental labels to identify your closest sub-population affinity using Euclidean distance and admixture modeling. Results include proximity labels (Exceptional → Distal) and detailed breakdowns.

### PCA Projection
Your genome is projected into principal component space alongside HGDP and 1000 Genomes reference samples. Interactive SVG visualization shows exactly where you cluster relative to global populations.

### Chromosome Painting
Canvas-rendered ideogram colors each chromosome segment by inferred continental ancestry via a TypeScript Local Ancestry Inference (LAI) pipeline.

---

## 📊 Marker Database

### Regional AIM Architecture
Markers are organized into 10 region-specific files loaded via `aimLoader.ts`:

| Region File | Markers | Purpose |
| :--- | :--- | :--- |
| `global.json` | 5,496 | General ancestry-informative markers (gnomAD-sourced frequencies) |
| `african.json` | 464 | High-resolution African sub-structure markers |
| `african_american.json` | 201 | Admixed African American optimization |
| `european.json` | 143 | European sub-structure differentiation |
| `south_asian.json` | 75 | South Asian population markers |
| `native_american.json` | 74 | Indigenous American ancestry markers |
| `middle_eastern.json` | 66 | MENA region differentiation |
| `oceanian.json` | 62 | Oceanian/Melanesian markers |
| `east_asian.json` | 40 | East Asian sub-structure markers |
| `north_african.json` | 2 | North African differentiation |
| **Total** | **6,623** | |

### Population Frequency Coverage
All markers carry standardized frequencies across 7 populations:

| Population | Key | Source |
| :--- | :--- | :--- |
| African | `AFR` | gnomAD v4 genomes (afr) |
| European | `EUR` | gnomAD v4 genomes (nfe) |
| East Asian | `EAS` | gnomAD v4 genomes (eas) |
| South Asian | `SAS` | gnomAD v4 genomes (sas) |
| Native American | `AMR` | gnomAD v4 genomes (amr) |
| Middle Eastern | `MENA` | gnomAD v4 genomes (mid) |
| Oceanian | `OCE` | Estimated (EAS+SAS+AMR weighted) |

### Weight System
Markers are weighted by informativeness (max allele frequency delta across populations):

| Weight | Delta Range | Count | Meaning |
| :--- | :--- | :--- | :--- |
| w=2 | < 0.2 | ~1,273 | Low differentiation |
| w=4 | 0.2 – 0.4 | ~2,724 | Moderate |
| w=6 | 0.4 – 0.6 | ~1,044 | Good |
| w=8 | 0.6 – 0.8 | ~180 | Strong |
| w=10 | 0.8+ | ~26 | Highly informative |

---

## 🔬 Forensic Marker Panels

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

## 🧩 Local Ancestry Inference

Genotype Scout includes a TypeScript implementation of local ancestry inference (LAI) for chromosome-level ancestry deconvolution:

- **RFMix TypeScript** — Pure TS implementation of LAI smoothing logic for high-throughput genomic window processing
- **MicroPhaser** — Lightweight pseudo-phasing of commercial DNA data, splitting unphased genotype calls into two strands for LAI engines
- **Phasing Corrector** — Post-processing to correct phasing artifacts
- **Genetic Map Interpolator** — cM-position interpolation for recombination-aware analysis
- **WASM Bridge** — Optional WebAssembly acceleration for computationally intensive LAI steps

---

## 📂 Supported File Formats

| Provider / Format | Extension | Support |
| :--- | :--- | :--- |
| **23andMe** | `.txt` | ✅ Full |
| **AncestryDNA** | `.txt` | ✅ Full |
| **MyHeritage** | `.csv` | ✅ Full |
| **PLINK** | `.bed` / `.bim` / `.fam` | ✅ Full |
| **ZIP archives** | `.zip` | ✅ Auto-extraction |

The streaming DNA parser handles files up to 45 MB with support for non-standard genotype calls (N, I, D). Malformed files receive detailed diagnostic messages.

---

## ⚙️ Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser (Client-Side Only)                                     │
│                                                                 │
│  ┌──────────┐    ┌──────────────────────────────────────────┐   │
│  │ React 19 │◄──►│   Web Workers (Sandboxed)                │   │
│  │ + Vite 6 │    │                                          │   │
│  │ + TS     │    │  ┌─ genotypeWorker ───────────────────┐  │   │
│  │ +Tailwind│    │  │  DNA parsing & SNP matching         │  │   │
│  │          │    │  │  Multi-engine ancestry ensemble     │  │   │
│  │          │    │  │  Haplogroup prediction              │  │   │
│  │          │    │  └────────────────────────────────────┘  │   │
│  │          │    │  ┌─ healthWorker ──────────────────────┐ │   │
│  │          │    │  │  PGx star-allele calling            │ │   │
│  │          │    │  │  Blood type + dietary traits        │ │   │
│  │          │    │  └────────────────────────────────────┘  │   │
│  │          │    │  ┌─ plinkWorker ──────────────────────┐  │   │
│  │          │    │  │  PLINK binary format parsing        │  │   │
│  │          │    │  └────────────────────────────────────┘  │   │
│  │          │    │  ┌─ rfmixWorker ──────────────────────┐  │   │
│  │          │    │  │  Local Ancestry Inference (LAI)     │  │   │
│  │          │    │  └────────────────────────────────────┘  │   │
│  └──────────┘    └──────────────────────────────────────────┘   │
│       │                                                         │
│  ┌────┴──────────────────────────────────────────────────────┐  │
│  │  ONNX Runtime (In-Browser ML)                             │  │
│  │  → Ancestry classification model                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│       │                                                         │
│  ┌────┴──────────────────────────────────────────────────────┐  │
│  │  IndexedDB (Optional Local Persistence)                   │  │
│  │  → Results only. Raw data never stored.                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
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
| **Auth** | Firebase |
| **Hosting** | Vercel |
| **Analytics** | Vercel Analytics + Speed Insights |

### Engine Architecture

| Engine | File | Purpose |
| :--- | :--- | :--- |
| `oracleEngine` | `src/engines/ancestry/oracleEngine.ts` | Primary NNLS ancestry solver |
| `comprehensiveEngine` | `src/engines/ancestry/comprehensiveEngine.ts` | Bayesian multi-panel ancestry |
| `grafAncEngine` | `src/engines/ancestry/grafAncEngine.ts` | GRAF-specific ancestry refinement |
| `mdlpAncEngine` | `src/engines/ancestry/mdlpAncEngine.ts` | MDLP K16 population model |
| `fastMatrixEngine` | `src/engines/ancestry/fastMatrixEngine.ts` | Float32Array population proximity |
| `microHapEngine` | `src/engines/ancestry/microHapEngine.ts` | Microhaplotype-based fine ancestry |
| `historicalClusterEngine` | `src/engines/ancestry/historicalClusterEngine.ts` | Ancient population cluster matching |
| `workerPoolEngine` | `src/engines/ancestry/workerPoolEngine.ts` | RFMix-style local ancestry inference |
| `rfmixTypeScript` | `src/engines/ancestry/rfmixTypeScript.ts` | LAI smoothing implementation |
| `microPhaser` | `src/engines/ancestry/microPhaser.ts` | Pseudo-phasing for unphased data |
| `phasingCorrector` | `src/engines/ancestry/phasingCorrector.ts` | Phasing artifact correction |
| `geneticMapInterpolator` | `src/engines/ancestry/geneticMapInterpolator.ts` | cM position interpolation |
| `admixtureCalculator` | `src/engines/admixtureCalculator.ts` | Statistical admixture estimation |
| `bloodTypeCalculator` | `src/engines/bloodTypeCalculator.ts` | ABO + extended blood group inference |
| `dietaryCalculator` | `src/engines/dietaryCalculator.ts` | Genotype-driven dietary trait logic |
| `comprehensiveHealthEngine` | `src/engines/health/comprehensiveHealthEngine.ts` | Orchestrates all health analyses |
| `pgxCalculator` | `src/engines/health/pgxCalculator.ts` | Clinical medication safety reports |
| `pypgxEngine` | `src/engines/health/pypgxEngine.ts` | Star-allele calling (CYP2D6, CYP2C19, DPYD) |
| `secretorCalculator` | `src/engines/health/secretorCalculator.ts` | FUT2 secretor status analysis |

### Reference Data

| Dataset | Location | Description |
| :--- | :--- | :--- |
| Regional AIMs (10 files) | `src/data/aims/` | 6,623 ancestry-informative markers with 7-pop frequencies |
| Master AIMs (legacy) | `src/data/master_aims_normalized.json` | Legacy normalized marker database |
| GRAF 10K index | `src/data/raw_aims/graf_10k_index.json` | GRAF panel reference coordinates |
| GRAF 10K weights | `src/data/raw_aims/graf_10k_weights.json` | GRAF marker informativeness scores |
| HO Reference Kernel | `src/data/raw_aims/ho_modern_reference_kernel.json` | Human Origins modern reference |
| PCA model | `src/data/raw_aims/pca_model.json` | PCA model weights |
| PCA reference | `src/data/raw_aims/pca_reference_data.json` | HGDP + 1kGP coordinates |
| MicroHap kernel | `src/data/raw_aims/microhap_top100_kernel.json` | Top 100 microhaplotype reference |
| Ancient profiles | `src/data/master_ancient_profiles.json` | Curated ancient genomes |
| Health & PGx markers | `src/data/master_health_pgx.json` | Clinical + pharmacogenomic markers |
| Blood markers | `src/data/blood_markers.json` | Blood group system definitions |
| Genetic map | `src/data/master_genetic_map.json` | Recombination rate reference |
| Y-DNA tree | `src/constants/haplogroups.ts` | Full Y-chromosome phylogeny |
| mtDNA tree | `src/data/mitochondrial/` | MITOMAP + mitochondrial phylogeny |
| PhyloTree Build 17 | `src/data/haplogroups/PhyloTreeBuild17.csv` | ISOGG haplogroup definitions |
| 33 raw panel files | `src/data/raw_aims/` | Forensic panels, regional weights, appearance traits |

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

### Data Sync & Build Scripts

| Script | Purpose |
| :--- | :--- |
| `npm run sync-all` | Rebuild all reference data and compile |
| `npm run sync-pgx` | Update pharmacogenomics data |
| `npm run sync-graf` | Refresh GRAF weights |
| `npm run sync-pca` | Refresh PCA reference data |
| `npm run sync-admixture` | Sync admixture reference data |
| `npm run build-health` | Rebuild health marker database |
| `npm run build-ancient` | Rebuild ancient DNA profiles |
| `npm run enrich-markers` | Enrich marker annotations |
| `npm run test` | Run test suite (Vitest) |

---

## 🏗️ License

This project is proprietary software created by Jequan Davis. Unauthorized distribution or commercial use is prohibited without express written permission.

---

<div align="center">
  <strong>GENOTYPE SCOUT™</strong> — Your privacy-first local genomic analysis suite.
  <br /><br />
  <a href="https://writteninthegenome.blog">Blog</a> · <a href="https://witg-genotype-scout.vercel.app/">Live App</a> · <a href="https://writteninthegenome.blog/writteninthegenome-privacy-policy/">Privacy Policy</a>
</div>
