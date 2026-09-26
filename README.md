<div align="center"><img width="1200" height="475" alt="Genotype Scout banner" src="https://writteninthegenome.blog/wp-content/uploads/2026/04/17762177921467E26841384755661462607.webp" /></div>

# Genotype Scout — V5.22.0

> ⚠️ **Research & Educational Bioinformatics Tool.** Genotype Scout is an exploratory platform and is **not an ethnicity calculator**. Results are probabilistic, are **not directly comparable** to commercial black-box ethnicity estimates, and do **not constitute medical or diagnostic advice**.

**Genotype Scout** is a high-performance, privacy-first genomic analysis suite created by Jequan Davis. It processes raw DNA files **entirely inside the browser** via dedicated Web Workers — sensitive genetic data never leaves your device. Installable as a **Progressive Web App (PWA)** for instant offline genomic analysis on any desktop or mobile device.

[🚀 Launch Genotype Scout](https://genotype.writteninthegenome.blog) · [📖 Research Blog](https://writteninthegenome.blog) · [💬 Community](https://www.facebook.com/share/g/1EFyWD35tB/) · [🧬 Chromosome Phaser Studio](https://phaser.writteninthegenome.blog) · [🛠️ Superkit Maker](https://merge.writteninthegenome.blog)

---

## ✨ What's New in V5.22.0

- **1-Click Legal Terms & Scientific Advisory Assent** — Streamlined, enforceable clickwrap agreement with single-click affirmative assent and master "Select All" toggle covering microarray false-positive warning rates (40–50%+ on rare variants), Research Use Only (RUO) boundaries, and CLIA/CAP clinical confirmation requirements.
- **Universal Module Index & Command Palette (`⌘K` / `Ctrl+K`)** — Rapid searchable navigation directory indexing all 14 application modules, analytical algorithms, genomic sub-tools, and cross-suite utilities with keyboard navigation (`↑`/`↓`/`Enter`/`Esc`).
- **Client-Side WebCrypto Session Vault (AES-GCM-256)** — Client-side cryptographic session encryption using PBKDF2 (100,000 iterations, SHA-256) and authenticated AES-GCM-256 to seal sensitive genomic files and cached analysis results locally at rest.
- **Data Table Interactivity & Direct Exports** — One-click CSV and TSV table downloads across serological blood systems (`BloodTypeView`), genomic marker matrix (`GeneticMarkersBrowser`), and recombination crossovers with WCAG 2.1 AA accessibility attributes (`caption`, `scope="col"`, `aria-sort`).
- **Cross-Suite Phasing Integration (Chromosome Phaser ↔ Genotype Scout)** — Direct ingestion support for parent-phased dual haplotypes (`Maternal Haplotype` vs `Paternal Haplotype`), enabling true lineage-specific chromosome painting rather than statistical estimation.
- **Strict Open-Source & Third-Party License Compliance** — Comprehensive data audit replacing proprietary non-commercial databases with open public-domain sources (CPIC clinical guidelines, OpenPGx, public PharmGKB annotations) with zero synthetic SNPs or restrictive license entanglements.

---

## ✨ Core Analytical Features

### 🌍 High-Precision Biogeographical Ancestry
Calculate complex admixture percentages using advanced Non-Negative Least Squares (NNLS) with Human Origins (K61) reference populations. Your genotype is evaluated against dense population frequency datasets with LD-pruned, strand-aligned markers for high-dimensional ancestral origin estimation, including 95% confidence intervals per population.

### 🏛️ Ancient Archaeological Match & Archaic Introgression
Deep lineage matching connecting user Y-DNA and mtDNA haplogroups against 54 radiocarbon-dated ancient fossil genomes across paleogenomic eras. Direct calculation of Neanderthal and Denisovan introgression affinity across diagnostic genomic loci.

### 🧬 Forensic & Mitochondrial Database Suite
- **EMPOP Forensic Engine**: Mitochondrial DNA forensic database matching for high-confidence lineage verification.
- **Phylotree Build 17 & gnomAD mtDNA**: Integrated full Phylotree mtDNA tree navigation and gnomAD mitochondrial allele frequencies.
- **MITOMAP & hMitoGeo Engines**: Pathogenic mitochondrial mutation tracking and geographical haplogroup distribution mapping.
- **TMRCA Coalescent Estimator**: Time to Most Recent Common Ancestor timeline estimator for paternal and maternal clades.
- **YHRD Y-STR Engine**: Y-chromosome Haplotype Reference Database forensic matching.

### 🩸 Comprehensive Serological & Blood Group Phenotyping
Predicts major and extended blood systems using ISBT-standardized molecular markers:
- ABO diplotypes and subgroup variations (A1, A2, B, O1, O2, Bombay $O_h$, Cis-AB).
- Rh(D) deletion status, Fisher-Race antigens ($C/c$, $E/e$), and weak Rh variants.
- Extended antigen groups: Duffy ($Fy^a/Fy^b/Fy^{null}$), Kidd, MNS, Kell, Secretor ($FUT2$), Lewis, Diego, Colton, and Dombrock.
- Direct CSV table export of all observed serological markers and biochemical effects.

### 🎨 Chromosome Painter & Segmental Painting
Interactive ideogram visualizer displaying ancestral segment assignments across all 22 autosomes and Chr X. Supports dual phased maternal and paternal tracks when paired with Chromosome Phaser.

---

## 🔒 Commitment to Privacy & Security

The core philosophy of Genotype Scout is binary-level privacy:
- **100% In-Browser Computation:** Raw DNA parsing, ancestry calculation, haplogroup classification, and health/trait analysis run locally in client-side Web Workers.
- **Zero Server Uploads & Zero Telemetry:** No genetic files, variant calls, or usage analytics are transmitted to any remote server.
- **WebCrypto Session Encryption:** Users can encrypt locally cached sessions using AES-GCM-256 with a custom passphrase via the native WebCrypto API.
- **Optional Export:** Google Slides export sends an ancestry summary directly to your own authenticated Google account only upon explicit user request.

---

## ⚙️ Technical Architecture

| Component | Technology |
| :--- | :--- |
| **Runtime** | React 19 + Vite |
| **Language** | TypeScript (`strict` mode) |
| **Styling** | Tailwind CSS v4 with custom dark-mode design tokens |
| **Concurrency** | Multi-threaded Web Worker pool (`navigator.hardwareConcurrency`) |
| **On-device ML** | ONNX Runtime Web (`onnxruntime-web`) with WebAssembly SIMD |
| **Admixture Engine** | Human Origins (K61) with Lawson-Hanson NNLS solver |
| **Cryptography** | WebCrypto API (PBKDF2-HMAC-SHA256, AES-GCM-256) |
| **PWA** | `vite-plugin-pwa` with Workbox offline precaching and background sync |
| **Navigation** | Universal Keyboard Command Palette (`⌘K` / `Ctrl+K`) |

---

## 🧬 AIMs Database & Reference Architecture

| Marker Database / Panel | Marker Count | Purpose / Scope |
| :--- | :---: | :--- |
| **Regional & Global AIMs** (`src/data/aims/`) | **21,105** | Curated multi-population marker library spanning 11 biogeographical regions. |
| **Normalized Master AIMs** (`master_aims_normalized.json`) | **17,886** | Standardized, Ensembl-validated markers with LLR probability weights. |
| **Cosmopolitan AIMs** | **10,076** | Core high-divergence markers for continental macro-group separation. |
| **GRAF-10k Panel** | **8,821** | High-resolution genomic ancestry refinement and subcontinental clustering. |
| **Forensic Microhaplotypes** | **3,053** | High-density multi-SNP forensic microhaplotype loci for mixture deconvolution. |
| **VISAGE Phenotypic Panel** | Comprehensive | Complex appearance, pigmentation (eye, hair, skin), and phenotypic trait estimation. |
| **EMPOP & YHRD** | Full Databases | Comprehensive mitochondrial DNA (Phylotree 17) and Y-STR population databases. |

---

## 🏗️ License
Copyright © 2026 Jequan Davis / Written In The Genome. All rights reserved.
Exploratory bioinformatics software for research and educational purposes.
