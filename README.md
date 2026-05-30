<div align="center"><img width="1200" height="475" alt="Banner" src="https://jequandavis.wpcomstaging.com/wp-content/uploads/2026/04/17762177921467E26841384755661462607.webp" /></div>

# Genotype Scout

**Genotype Scout** is a professional-grade, privacy-first genomic analysis suite created by [Jequan Davis](https://jequandavis.wpcomstaging.com). It processes raw DNA files entirely in the browser — no uploads, no servers, no tracking. Your genetic data never leaves your device.

[![Vercel](https://img.shields.io/badge/Hosted%20on-Vercel-black?logo=vercel)](https://witg-genotype-scout.vercel.app)
[![License](https://img.shields.io/badge/License-Proprietary-blue)](#license)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Privacy Architecture](#privacy-architecture)
- [Ancestry Analysis Engines](#ancestry-analysis-engines)
- [Health & Pharmacogenomics](#health--pharmacogenomics)
- [Marker Database](#marker-database)
- [Supported Formats](#supported-formats)
- [Project Structure](#project-structure)
- [Build & Development](#build--development)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

Genotype Scout is a client-side genomic analysis application built with React, TypeScript, and Vite. It accepts raw DNA files from major testing providers (23andMe, AncestryDNA, MyHeritage, FamilyTreeDNA, etc.) and runs ancestry estimation, haplogroup prediction, health trait analysis, and pharmacogenomics — all locally in Web Workers.

**Live app:** [witg-genotype-scout.vercel.app](https://witg-genotype-scout.vercel.app)

---

## Key Features

| Category | Capability |
|---|---|
| **Ancestry** | Continental + regional + deep sub-population breakdown |
| **Haplogroups** | Y-DNA and mtDNA haplogroup prediction with phylogenetic tree traversal |
| **Health** | Trait analysis, carrier status, wellness markers |
| **Pharmacogenomics** | Drug metabolism predictions via PGx star-allele calling |
| **Blood Type** | ABO and Rh factor determination |
| **Oracle** | Multi-engine consensus scoring with confidence intervals |
| **Ancient DNA** | Admixture estimates from ancient reference populations |
| **Forensic** | Eye/hair/skin pigmentation prediction panels |

---

## Privacy Architecture

- **Zero-upload design** — all processing runs in browser Web Workers
- **No server calls** — DNA data is never transmitted over the network
- **No analytics on genetic data** — Firebase Auth for login only
- **Session-only storage** — results are not persisted after tab close
- **Open analysis pipeline** — all engines and reference data ship client-side

---

## Ancestry Analysis Engines

Genotype Scout runs **12 ancestry engines** in parallel, combining results through an Oracle consensus system:

| Engine | File | Method |
|---|---|---|
| **Oracle** | `oracleEngine.ts` | Multi-engine weighted consensus with confidence intervals |
| **Comprehensive** | `comprehensiveEngine.ts` | Bayesian posterior on 6,300+ AIMs with 7-population priors |
| **GRAF** | `grafAncEngine.ts` | Sub-population resonance scoring against GRAF 10K panel |
| **MDLP K16** | `mdlpAncEngine.ts` | 16-component admixture model |
| **Fast Matrix** | `fastMatrixEngine.ts` | Float32 binary kernel for rapid batch scoring |
| **MicroHap** | `microHapEngine.ts` | Microhaplotype signature identification |
| **Historical Cluster** | `historicalClusterEngine.ts` | Ancient/medieval population cluster matching |
| **RFMix-TS** | `rfmixTypeScript.ts` | Local ancestry inference (TypeScript implementation) |
| **MicroPhaser** | `microPhaser.ts` | Statistical phasing for haplotype block analysis |
| **Phasing Corrector** | `phasingCorrector.ts` | Post-phasing error correction |
| **Genetic Map Interpolator** | `geneticMapInterpolator.ts` | Recombination rate interpolation |
| **Worker Pool** | `workerPoolEngine.ts` | Parallel engine orchestration |

---

## Health & Pharmacogenomics

| Engine | File | Purpose |
|---|---|---|
| **Health Engine** | `comprehensiveHealthEngine.ts` | Trait analysis and carrier status |
| **PGx Calculator** | `pgxCalculator.ts` | CYP450 star-allele calling and drug metabolism |
| **PyPGx Engine** | `pypgxEngine.ts` | Extended pharmacogenomic predictions |
| **Secretor Calculator** | `secretorCalculator.ts` | FUT2 secretor status determination |

---

## Marker Database

The analysis pipeline draws from **6,320 functional ancestry-informative markers** across 10 regional panels:

| Panel | File | Functional Markers |
|---|---|---|
| Global | `global.json` | 5,247 |
| African | `african.json` | 417 |
| African American | `african_american.json` | 198 |
| European | `european.json` | 143 |
| South Asian | `south_asian.json` | 75 |
| Native American | `native_american.json` | 71 |
| Middle Eastern | `middle_eastern.json` | 66 |
| Oceanian | `oceanian.json` | 62 |
| East Asian | `east_asian.json` | 39 |
| North African | `north_african.json` | 2 |

**Population coverage:** All functional markers include frequencies for 7 standardized populations: AFR, EUR, EAS, SAS, AMR, MENA, OCE.

Additional reference data:
- `reference/snps.json` — 1,352 curated SNP entries (including 337 Y-DNA/mtDNA markers)
- `reference/1000genomes_frequencies.json` — 1000 Genomes Project frequencies
- `raw_aims/` — 33 raw panel files for GRAF, appearance traits, and specialized analyses

---

## Supported Formats

| Provider | Format |
|---|---|
| 23andMe | v3, v4, v5 |
| AncestryDNA | v1, v2 |
| MyHeritage | Raw export |
| FamilyTreeDNA (FTDNA) | Build 36/37 |
| LivingDNA | Raw export |
| Genes for Good | Raw export |
| PLINK | .bed/.bim/.fam |
| VCF | .vcf, .vcf.gz |

---

## Project Structure

```
src/
├── App.tsx                     # Main application component
├── anchorAims.ts               # Anchor AIM definitions
├── components/                 # React UI components
├── data/
│   ├── aims/                   # 10 regional AIM panel files
│   ├── reference/              # Reference databases (snps, 1000G)
│   └── raw_aims/               # 33 raw panel files
├── engines/
│   ├── ancestry/               # 12 ancestry engines + WASM bridge
│   └── health/                 # 4 health/PGx engines
├── services/
│   ├── snpMatcher.ts           # Marker matching and source aggregation
│   ├── fileParser.ts           # Multi-format DNA file parser
│   └── ...
├── workers/
│   ├── genotypeWorker.ts       # Main processing orchestrator
│   ├── healthWorker.ts         # Health analysis worker
│   ├── markerProcessingWorker.ts # Parallel marker processing
│   ├── plinkWorker.ts          # PLINK format handler
│   └── rfmixWorker.ts         # RFMix worker
├── scripts/                    # Build and data processing scripts
├── types/                      # TypeScript type definitions
└── utils/                      # Shared utilities
```

---

## Build & Development

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

**Tech stack:** React 18 · TypeScript · Vite · Tailwind CSS · Firebase Auth · Web Workers · WASM

---

## Deployment

Hosted on [Vercel](https://vercel.com). Pushes to `main` auto-deploy to production.

**Live URL:** [witg-genotype-scout.vercel.app](https://witg-genotype-scout.vercel.app)

---

## License

Copyright © 2024–2026 Jequan Davis / Written In The Genome. All rights reserved.

This software is proprietary. Unauthorized copying, distribution, or modification is prohibited without express written permission from the author.

---

<div align="center">
  <strong>Built by <a href="https://jequandavis.wpcomstaging.com">Jequan Davis</a></strong><br>
  <em>Written In The Genome</em>
</div>
