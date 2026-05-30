<div align="center"><img width="1200" height="475" alt="Banner" src="https://jequandavis.wpcomstaging.com/wp-content/uploads/2026/04/17762177921467E26841384755661462607.webp" /></div>

# Genotype Scout

**Genotype Scout** is a professional-grade, privacy-first genomic analysis suite built by [Jequan Davis](https://writteninthegenome.blog). Every computation — from ancestry admixture to pharmacogenomics — runs entirely inside your browser. Your raw DNA never touches a server.

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
>
> 📖 **[Read the full privacy deep-dive: "Your DNA, Your Device" →](https://writteninthegenome.blog/writteninthegenome-privacy-policy/your-dna-your-device-the-engineering-behind-genotype-scouts-zero-footprint-privacy/)**

---

## 🧬 Feature Overview

| Module | What It Does |
| :--- | :--- |
| **Dashboard** | At-a-glance admixture chart, top regions, health marker summary, and navigation hub |
| **Ancestry Oracle** | Continental + sub-population admixture via multi-engine ensemble analysis |
| **Scout Score** | Naive ethnicity estimation with Ancestry Informative Markers (AIMs) |
| **Engine Oracle** | Ensemble ancestry combining all engines for maximum accuracy |
| **Modern Oracle** | MDLP K16 population model for modern population matching |
| **Granular Ancestry** | Fine-grained sub-population analysis with detailed regional breakdowns |
| **Ancient DNA Oracle** | Weighted matching against ancient genome samples and historical population clusters |
| **Haplogroups / Lineages** | Terminal SNP identification for Y-DNA and mtDNA with phylogenetic tree visualization |
| **Blood Type** | Full ABO, Rh, and 12+ extended blood group system predictions |
| **Health & Wellness** | Pharmacogenomics (PGx), dietary traits, clinical risk markers, and APOE analysis |
| **Phenotype** | Eye, hair, and skin color prediction via the HIrisPlex-S 41-SNP panel |
| **Chromosome Painter** | Canvas-rendered ideogram showing continental ancestry assignments across all 23 chromosomes |
| **PCA Map** | Interactive SVG scatter plot projecting your genome into HGDP + 1000 Genomes PC1×PC2 space |
| **Population Comparison** | Head-to-head proximity analysis against all reference populations |
| **Famous Matches** | Compare your genotype against famous historical figures |
| **Methodology** | Full transparency into the algorithms, solvers, and reference data behind every result |
| **Passport Export** | One-click PDF export of your complete results profile |

---

## 🌍 Ancestry Analysis

### Multi-Engine Architecture
Genotype Scout uses an ensemble of 8 specialized ancestry engines, each optimized for different aspects of genomic ancestry:

| Engine | Method |
| :--- | :--- |
| **Oracle** | Primary NNLS solver — Non-Negative Least Squares against 26 sub-populations |
| **Comprehensive** | Bayesian likelihood across 7-population AIM database |
| **GRAF** | 10,000 SNP GRAF-pop panel with sub-population resonance scoring |
| **MDLP K16** | 16-population model using Human Origins reference kernel |
| **Fast Matrix** | Float32Array optimized population proximity calculations |
| **MicroHaplotype** | Multi-allelic microhaplotype-based fine-scale ancestry |
| **Historical Cluster** | Ancient population cluster matching |
| **LAI Worker Pool** | RFMix-style local ancestry inference for chromosome-level deconvolution |

### Continental Admixture
- **7 super-populations**: AFR, EUR, EAS, SAS, AMR, MENA, OCE
- **26 sub-populations**: GBR, CEU, FIN, TSI, IBS, YRI, LWK, GWD, MSL, ESN, ASW, ACB, CHB, CHS, CDX, KHV, JPT, GIH, PJL, BEB, STU, ITU, CLM, MXL, PEL, PUR
- **Exclusive Native cohorts**: Curated Amerind AIMs optimized to isolate high-precision indigenous North, Central, and South American genomic profiles
- Confidence intervals via bootstrap resampling
- Quality control scoring for input data integrity

### Deep Regional Matching (Sub-Population Bento)
Goes beyond continental labels to identify your closest sub-population affinity using Euclidean distance and admixture modeling. Results include proximity labels (Exceptional → Distal) and detailed breakdowns.

### PCA Projection
Your genome is projected into principal component space alongside HGDP and 1000 Genomes reference samples. Interactive SVG visualization shows exactly where you cluster relative to global populations.

### Chromosome Painting
A canvas-rendered ideogram colors each chromosome segment by inferred continental ancestry using local ancestry inference. Visual, immediate, and exportable.

---

## 📊 Marker Database

Genotype Scout maintains a curated database of **6,600+ Ancestry Informative Markers** organized into 10 region-specific panels:

| Region | Markers | Purpose |
| :--- | :--- | :--- |
| **Global** | 5,496 | General ancestry-informative markers sourced from gnomAD v4 |
| **African** | 464 | High-resolution West African sub-structure differentiation |
| **African American** | 201 | Admixed population optimization |
| **European** | 143 | European sub-structure markers |
| **South Asian** | 75 | South Asian population differentiation |
| **Native American** | 74 | Indigenous American ancestry markers |
| **Middle Eastern** | 66 | MENA region markers |
| **Oceanian** | 62 | Oceanian and Melanesian markers |
| **East Asian** | 40 | East Asian sub-structure markers |
| **North African** | 2 | North African differentiation |

### Population Frequency Coverage
Every marker carries standardized allele frequencies across **7 global populations** — African, European, East Asian, South Asian, Native American, Middle Eastern, and Oceanian — sourced from gnomAD v4 genomes and the Ensembl VEP API.

### Informativeness Weighting
Markers are dynamically weighted by their ancestry-informativeness (maximum allele frequency delta across populations), ranging from w=2 (low differentiation) to w=10 (highly informative, delta ≥ 0.8).

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

## 🧩 Local Ancestry Inference

Genotype Scout includes chromosome-level ancestry deconvolution via a TypeScript Local Ancestry Inference (LAI) pipeline:

- **RFMix-style smoothing** — High-throughput LAI across genomic windows
- **Pseudo-phasing** — Lightweight phasing of commercial DTC data for LAI compatibility
- **Genetic map interpolation** — Recombination-aware cM position mapping
- **Optional WASM acceleration** — WebAssembly bridge for computationally intensive steps
- **Chromosome Painter output** — Canvas-rendered ideogram showing per-segment continental assignments

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
| **Hosting** | Vercel |
| **Analytics** | Vercel Analytics + Speed Insights |

---

## 🏗️ License

This project is proprietary software created by Jequan Davis. Unauthorized distribution or commercial use is prohibited without express written permission.

---

<div align="center">
  <strong>GENOTYPE SCOUT™</strong> — Your privacy-first local genomic analysis suite.
  <br /><br />
  <a href="https://writteninthegenome.blog">Blog</a> · <a href="https://witg-genotype-scout.vercel.app/">Live App</a> · <a href="https://writteninthegenome.blog/writteninthegenome-privacy-policy/">Privacy Policy</a>
</div>
