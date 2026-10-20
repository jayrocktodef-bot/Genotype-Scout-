<div align="center"><img width="1200" height="475" alt="Genotype Scout banner" src="https://writteninthegenome.blog/wp-content/uploads/2026/04/17762177921467E26841384755661462607.webp" /></div>

# Genotype Scout — V5.24.0

> **Research and education tool.** Genotype Scout is exploratory, not an ethnicity calculator. Results are estimates, not directly comparable to commercial ethnicity reports, and not medical advice.

**Genotype Scout** is a free DNA analysis app by Jequan Davis. You load your raw DNA file from 23andMe, AncestryDNA, MyHeritage, or FamilyTreeDNA, and it runs a full analysis: ancestry breakdown, chromosome painting, haplogroups, ancient DNA matches, health-related markers, traits, and more.

Everything runs **inside your web browser**. Your DNA file never leaves your device. There is no server, no account, no upload.

[Launch Genotype Scout](https://scout.writteninthegenome.blog) · [Research Blog](https://writteninthegenome.blog) · [Community](https://www.facebook.com/share/g/1EFyWD35tB/) · [Chromosome Phaser Studio](https://phaser.writteninthegenome.blog) · [Superkit Maker](https://merge.writteninthegenome.blog)

---

## How the ancestry engine works

Most DNA tools give you a pie chart and stop there. Scout shows its work.

**Ancestry estimation (the Oracle).** Your DNA is compared against reference populations using a method called non-negative least squares (NNLS). In plain terms: the app looks at thousands of markers in your file, checks how common each variant is in each reference population, and finds the mixture that best explains what it sees. The reference panels were rebuilt in October 2026 with denser, validated population data.

**Chromosome painting.** Instead of one overall percentage, the painter walks along each of your chromosomes and figures out which ancestry each segment came from. It uses a published method called Recomb-Mix (2023) that models how DNA gets shuffled each generation. You can see exactly where each piece of your ancestry sits.

**Family-based phasing.** When you load kits from relatives (a parent, a child), Scout uses the rules of inheritance to sort your DNA into the copy you got from your mother and the copy from your father. This is called Mendelian phasing, and it is more accurate than the statistical guessing most tools rely on. Without family kits, the app falls back to a frequency-based estimate and labels it honestly.

**What the app will not do.** It will not invent precision it does not have. When a result is uncertain, it says so. When the reference data behind an estimate is thin, it tells you. A label never outruns the measurement.

---

## What is in the app

- **Scout Profile** — Your genomic passport: file integrity, marker counts, ancestry summary, haplogroups, and ancient matches in one view.
- **Ancestry Oracle** — Continental and sub-population breakdown with the NNLS engine.
- **Chromosome Painter** — Segment-by-segment ancestry across all 22 autosomes and the X chromosome, with family phasing when relatives are loaded.
- **Global PCA** — See where your DNA lands on a principal component map of world populations, including UMAP projection.
- **Haplotypes** — Y-DNA and mtDNA haplogroup calling, synced with the FamilyTreeDNA Y-tree (110,000+ branches) and PhyloTree Build 17.
- **Native Roots** — Evidence-based Native American ancestry discovery: trait markers, subclade-resolved haplogroup matching, regional markers (Andean, Arctic), and ancient specimen affinity.
- **Ancient Matches** — Compare against 46 ancient specimens re-extracted from the Allen Ancient DNA Resource, with f3 shared-drift statistics and archaic (Neanderthal/Denisovan) affinity.
- **Health** — Polygenic risk scores using only studies validated across multiple ancestries, plus gnomAD rare variant annotation and GWAS trait markers. Research use only, not medical advice.
- **Traits, Blood Predictor, Rare Variants, Kit Comparison, File Integrity** — Appearance traits, serology prediction, rare variant lookup, side-by-side kit comparison, and upload QC.

---

## Privacy

This is the core of the app, not a feature bullet.

- **100% in-browser.** Parsing, ancestry calculation, haplogroup calling, and health analysis all run locally in Web Workers on your machine.
- **Zero uploads, zero telemetry.** No genetic data and no usage analytics leave your device.
- **Optional session encryption.** You can encrypt locally cached sessions with a passphrase (AES-GCM-256 via WebCrypto).
- **No account, no email, no signup.**

---

## Reference data

| Panel | Markers | Purpose |
| :--- | :---: | :--- |
| **Master AIMs** | ~17,700 | Curated ancestry-informative markers, Ensembl-validated |
| **K61 / Human Origins** | Dense | Continental reference frequencies for the NNLS engine |
| **Sub-population panels** | Various | Kidd55, Seldin128, EuroForGen, Ramos, and microhaplotype sets for fine-scale breakdown |
| **AADR ancient specimens** | 46 | Re-extracted from the Allen Ancient DNA Resource v54.1 |
| **FTDNA Y-tree** | 110,000+ branches | Y-DNA haplogroup resolution |
| **PhyloTree Build 17** | Full tree | mtDNA haplogroup classification |

All coordinates are explicit about their genome build (GRCh37 vs GRCh38). Forward strand only. No synthetic markers, ever.

---

## For developers

| Component | Technology |
| :--- | :--- |
| **Runtime** | React 19 + Vite |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS v4, dark-mode design tokens |
| **Concurrency** | Web Worker pool |
| **PWA** | Installable, works offline |

---

## License

Copyright © 2026 Jequan Davis / Written In The Genome. All rights reserved.
Exploratory bioinformatics software for research and educational purposes.
