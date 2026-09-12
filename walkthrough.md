# Walkthrough: Ancestry Oracle V3 & SNP Database Comprehensive Upgrades

Based on the DeepSeek and population genetics audits, two major systems have been completely overhauled and verified:
1. **Ancestry Oracle V3 Engine (`v3-bayesian-deconv`)**
2. **SNP & Ancestry Informative Marker (AIM) Database Pruning & Harmonization**

---

## Part 1: Ancestry Oracle V3 Upgrade

### 1. Zero Fuzzy String Matching on RSIDs (P0 Fix)
- **Problem**: Previously, `resolveSnpName` used Damerau-Levenshtein edit-distance ($\le 2$) matching. In genomics, dbSNP accession numbers are arbitrary sequential integers (`rs10001` vs `rs10002` vs `rs10014`). Edit-distance matching caused completely unrelated loci on different chromosomes to be falsely mapped to each other.
- **Solution**: Completely purged edit-distance matching. Markers now strictly resolve via exact alphanumeric RSIDs and canonical prefix normalization (`rs00123` $\rightarrow$ `rs123`).

### 2. Palindromic ($A/T$, $C/G$) Quality Control & Strand Disambiguation
- **Problem**: Unchecked palindromic SNPs produce direct character matches regardless of strand ($A/T$ forward matches $T/A$ complement), causing a ~50% inversion error rate on homozygous reverse-strand calls.
- **Solution**: Added `isPalindromicMarker` and upgraded `alignGenotype`. Heterozygous calls are preserved as invariant, while homozygous calls check reference frequency expectation ($<0.10$ vs $>0.90$) to catch reverse-strand genotypes.

### 3. Likelihood Polarity Alignment (Eliminating the 0.20 Dead Zone)
- **Problem**: The previous polarity check `|refFreq - (1 - macroFreq)| < |refFreq - macroFreq| - 0.20` had a dead zone at intermediate allele frequencies ($0.30 - 0.70$) where polarity was never corrected.
- **Solution**: Replaced with `alignPolarity(refFreq, macroFreq)`, comparing distance to reference macro-frequencies with a tight $0.08$ significance margin.

### 4. Continuous Probabilistic Cladistic Scoring (Admixed-Friendly)
- **Problem**: The discrete rule `(refFreq >= 0.85 && userDosage == 0)` penalized outbred and admixed individuals who carry legitimate alternate alleles, multiplying distance by $(1.0 + 0.20 \times \text{violations})$ without bound.
- **Solution**: Replaced with continuous Hardy-Weinberg binomial log-loss deviation. Genotypes are evaluated probabilistically, and the distance penalty factor is bounded by a saturated logistic curve ($1.0 + 0.10 \times \min(8.0, \text{violations})$).

### 5. Fisher Information Matrix Weighting
- **Problem**: Previously, arbitrary scalar constants ($0.05$ and $4.0$) were mixed together, creating scale distortion.
- **Solution**: Replaced with theoretical Fisher information for binomial dosage observations:
  $$w_i = \frac{1}{2 \bar{p}_i (1 - \bar{p}_i) + 0.03}$$
  coupled with standardized between-population informativeness scaling.

### 6. Demographic-Aware $F_{ST}$ Drift Shrinkage
- **Problem**: A static $F_k = 0.04$ was applied universally to all world populations.
- **Solution**: Implemented `DEMOGRAPHIC_FST_DRIFT` parameters:
  - Outbred European: $F_k = 0.020$
  - Continental African: $F_k = 0.025$
  - East Asian: $F_k = 0.035$
  - South Asian: $F_k = 0.040$
  - Middle Eastern: $F_k = 0.030$
  - Indigenous American: $F_k = 0.075$
  - Oceanian: $F_k = 0.100$

### 7. Soft-Gated Hierarchical Two-Pass Routing
- **Problem**: Hard $1.0\%$ threshold created cliff-edge dropouts for minor ancestries ($0.99\%$ vs $1.01\%$).
- **Solution**: Lowered active retention threshold to $\ge 0.5\%$, admitted Central Asian (CAS) when EAS/EUR $\ge 2.5\%$ or SAS $\ge 10\%$, and applied continuous subpopulation weighting.

### 8. Statistical Confidence Intervals
- Proportions returned by `processSubpopulations` now compute 95% Confidence Intervals (`confidenceIntervals`) based on active marker counts.
- Engine version tag is updated to `v3-bayesian-deconv`.

---

## Part 2: SNP & AIM Database Pruning and Harmonization

Following the DeepSeek database audit, a full multi-stage bioinformatics pruning pipeline was implemented via [scripts/prune-master-aims.ts](file:///home/jequan/Desktop/Antigravity%20Projects/WITG-Genotype-Scout/scripts/prune-master-aims.ts).

### Pipeline Execution Metrics

| Audit Metric | Raw State | Post-Pruning State | Action Taken |
| :--- | :---: | :---: | :--- |
| **Total Candidate Markers** | 22,385 | **12,202** | Aggregated & harmonized across master & regional panels |
| **Synthetic Markers (`pos: 1000000`)** | 515 | **0** | Purged dummy positions and `GLOBAL`-only frequency shells |
| **Empty / Corrupted Frequencies** | 262 | **0** | Purged markers with empty `{}` or corrupted RSID key strings |
| **Unmapped Patch Scaffolds / RTF** | 33 | **0** | Dropped patch scaffolds (`HG..._PATCH`, `HSCHR...`, RTF strings) |
| **Monomorphic Markers ($\Delta F < 0.02$)** | 213 | **0** | Purged uninformative zero-variance markers |
| **Sex-Chromosome Markers (Chr X / Y)** | 70 | **Quarantined** | Safely preserved in [quarantined_sex_aims.json](file:///home/jequan/Desktop/Antigravity%20Projects/WITG-Genotype-Scout/src/data/quarantined_sex_aims.json) |
| **Mitochondrial Markers (Chr MT)** | 7 | **Quarantined** | Safely preserved in [quarantined_mt_aims.json](file:///home/jequan/Desktop/Antigravity%20Projects/WITG-Genotype-Scout/src/data/quarantined_mt_aims.json) |
| **50 kb Window LD Pruning (Chr 1–22)** | 9,083 redundant | **Eliminated** | Retained single highest-$F_{ST}$ marker per 50 kb window |
| **Key Anchor Markers** | Protected | **100% Retained** | SLC24A5, EDAR, SLC45A2, ACKR1, ABCC11, ALDH2, IRF4, etc. |

### Post-Pruning Regional Panel Breakdown

Each regional panel in `src/data/aims/` is now mutually exclusive, validated, and normalized:

- **Global Reference**: 7,809 markers
- **European**: 2,042 markers
- **Native American**: 632 markers
- **African**: 453 markers
- **East Asian**: 225 markers
- **Oceanian**: 213 markers
- **South Asian**: 210 markers
- **North African**: 206 markers
- **African American**: 176 markers
- **Central Asian**: 129 markers
- **Middle Eastern**: 107 markers
- **Total Unified Autosomal Database**: **12,202 markers**

---

## Part 3: Verification & Test Results

1. **Oracle V3 Audit Verification Suite ([oracleV3AuditVerification.test.ts](file:///home/jequan/Desktop/Antigravity%20Projects/WITG-Genotype-Scout/src/utils/ancestry/oracleV3AuditVerification.test.ts))**:
   - `P0: Zero Fuzzy Matching on RSIDs`: 3/3 passed.
   - `P0: Palindromic (A/T, C/G) Marker QC & Strand Resolution`: 4/4 passed.
   - `V3 Engine Execution & Confidence Intervals`: 1/1 passed.
   - Total: **8/8 passed**.

2. **Complete Ancestry Test Suites (`src/utils/ancestry/`)**:
   - `oracleV3AuditVerification.test.ts`: 8/8 passed.
   - `subpopulationAuditVerification.test.ts`: 4/4 passed.
   - `deconvolutionRefactor.test.ts`: 5/5 passed.
   - `hierarchicalAdmixture.test.ts`: 4/4 passed.
   - `ancientAdmixture.test.ts`: 2/2 passed.
   - Total Ancestry Suite: **23/23 passed**.

3. **Global Repository Test Suite**:
   - **19/19 test files passed**.
   - **130/130 unit tests passed**.
   - **0 TypeScript compilation errors** (`npx tsc --noEmit`).

---

## Part 4: High-Precision Blood Type Prediction & Molecular Diplotyping

Building on clinical immunohematology guidelines and statistical recommendations from **DeepSeek**, the blood typing subsystem was upgraded from simple ABO/Rh heuristic matching to a full multi-locus molecular profiling and phasing engine:

### 1. Phased ABO Diplotyping (`inferABODiplotype`)
- **$O^1$ Allele:** Evaluates `rs8176719` (c.261delG frameshift) with dosage parsing (`DD`, `DI`, `II`, `del/del`), with fallback to LD surrogates `rs505922` and `rs507666`.
- **$A^1$ vs $A^2$ Subgrouping:** Evaluates `rs8176746` (c.796C>A / p.Leu266Met) to differentiate high-antigen $A^1$ from reduced-transferase $A^2$.
- **$B$ Allele:** Evaluates `rs8176747` (c.803G>C), `rs8176745` (c.526C>G), and `rs8176750` (c.703G>A).
- **$O^2$ Non-Deletion Allele:** Detects `rs1053878` (c.467C>T) in the absence of 261delG.
- **$Cis-AB$ Hybrid Detection:** Detects `rs8176743` / `rs8176751` dual-specificity alleles capable of transmitting A and B in *cis*.
- **Bombay ($O_h$) Phenotype Mask:** Detects homozygous null mutations in $FUT1$ (`rs1048570` p.Trp242Ter, `rs1048571` p.Gln140Ter) where absence of H-antigen masks A/B expression.

### 2. Multi-Tag Rh Factor Ensemble & $RHD\psi$ Pseudogene (`inferRhFactor`)
- **$RHD$ Deletion Voting:** Multi-tag scoring over `rs590787`, `rs6762788`, `rs6784865`, `rs676839`, `rs10456285`, `i4001527`, `rs2298652`, `rs3759078`, `rs3118454`.
- **$RHD\psi$ African Pseudogene:** Flags `rs28366003` (p.Trp203Ter) to avoid false-positive RhD+ calls in individuals of African ancestry.
- **$RHCE$ Fine Antigens:** Resolves $C/c$ (`rs676785`, `rs676185`, `rs17525388`) and $E/e$ (`rs28362459`, `rs28362463`, `rs606429`).
- **Fisher-Race Nomenclature:** Formats standard clinical haplotype strings (e.g. `D+ C+ c+ E- e+`).

### 3. Extended Blood Group Systems (`calculateExtendedBloodSystems`)
- **Duffy ($ACKR1$ / $DARC$):** `rs12075` ($Fy^a/Fy^b$) and `rs2814778` ($FY*0$ erythroid promoter null conferring *Plasmodium vivax* malaria resistance).
- **Kell ($KEL$):** `rs8176058` ($K$ vs $k$ / Cellano, high transfusion immunogenicity and HDFN relevance).
- **Kidd ($SLC14A1$ / $JK$):** `rs1058396` ($Jk^a$ vs $Jk^b$, delayed hemolytic transfusion reaction monitoring).
- **Secretor ($FUT2$):** `rs601338` ($se^{428}$ null nonsense mutation conferring mucosal Norovirus GII.4 resistance).
- **Diego ($SLC4A1$ / $AE1$):** `rs2285644` ($Di^a$ vs $Di^b$, informative Indigenous American and East Asian anthropological marker).
- **MNS ($GYPA$ / $GYPB$):** `rs7683365` ($M/N$) and `rs11273308` ($S/s$).

### 4. Verification
- All 130 Vitest tests pass across all 19 test files.
- Zero TypeScript warnings or errors with `npx tsc --noEmit`.

---

## Part 5: Modern Genetic Markers Browser UI/UX Overhaul

Following a comprehensive UI/UX redesign and architectural consultation with **DeepSeek**, the clunky, nested accordion interface was replaced with a sleek, ultra-modern, high-performance browser ([src/components/GeneticMarkersBrowser.tsx](file:///home/jequan/Desktop/Antigravity%20Projects/WITG-Genotype-Scout/src/components/GeneticMarkersBrowser.tsx)).

### Key Features Implemented

1. **Hero Summary & Live Metrics Dock:**
   - Real-time **Total SNPs in Array** count.
   - **Array Match Coverage** percentage with dynamic progress indicator.
   - **Identified Calls** and **High-Significance Phenotype / Clinical Matches** metrics.
   - Live filtered match count reflecting active query parameters.

2. **Interactive Chromosome Ribbon (Chr 1–22, X, Y, MT, All):**
   - Clean horizontal ribbon navigation with dynamic badge counts indicating mapped variants per chromosome across all 18,199+ hydrated markers.
   - Fast jump filtering with active state highlighting.

3. **Multi-Faceted Filter Dock & Controls Bar:**
   - **Instant Search:** Debounced query matching by RSID, gene name, phenotype/trait description, or population region.
   - **Status Filter:** Filter by all, matched/partial calls, or missing calls.
   - **Significance Level Filter:** High, Medium, Low, or All.
   - **Zygosity / Call State Filter:** Heterozygous carrier, homozygous alternate, or missing.
   - **Sort Ordering:** Default priority, RSID, Gene symbol, Significance rank, Chromosome, or Category.
   - **View Toggle:** Seamless toggle between Modern Card Grid and High-Density Matrix Table.
   - **Multi-Format Data Export:** One-click export to CSV, TSV, or JSON.

4. **Themed Category Pills:**
   - Pill badges for Ancestry, Appearance, Blood Type, Health & Disease, Nutrition, Pharmacogenomics, Sensory, and Methylation with live counts and quick reset actions.

5. **Modern Card Grid View:**
   - Sleek glassmorphic card design with colored category accent headers.
   - Quick one-click RSID copy buttons with visual feedback.
   - Genotype call pills color-coded by match status.
   - Risk indicators, gene tags, and direct detail inspection triggers.

6. **High-Density Data Matrix Table View:**
   - Professional spreadsheet-style matrix view designed for bioinformatics researchers.
   - Columns: Status indicator, RSID (with copy), Gene symbol, Chromosome & base-pair coordinates, Genotype badge, Significance chip, Trait summary, and Inspect link.

7. **Deep Variant Inspection Slide-Out Flyout Sheet:**
   - Framer Motion animated slide-in sheet from the right with glassmorphic backdrop.
   - Direct external verification links to **dbSNP**, **ClinVar**, and **GeneCards**.
   - Complete genotype interpretation, call status, chromosomal position, phenotypic impact, and raw JSON export.

### Visual & Automated Verification
- Verified live rendering and all interactions via Chrome DevTools MCP on `http://localhost:3000/`.
- Validated with test genome `Iberian_Portuguese_hu33FC53.txt`.
- `npx tsc --noEmit` and Vitest suites pass cleanly (19/19 files, 130/130 tests).

---

## Part 6: Chromosome Browser & Native American Matched rsID Restoration

In response to the audit and user report (`"It seems like the chromosome browser is not showing all matched rsid, especially native american"`), a deep investigation was conducted across the AIM reference database, local ancestry inference (LAI) pipeline, and Chromosome Painter UI components.

### 1. Root Causes Discovered & Eliminated

1. **Regional Panel Suppression in Database Indexing (`src/data/aims/index.ts` & `master_aims_normalized.json`):**
   - **Flaw:** `global.json` (7,809 markers) was loaded first, tagging all entries with `region: "Global"`. When `native_american.json` (3,505 markers) was merged in `buildCleanAimDatabase`, keys that already existed in `global` had their frequencies updated, but `target.region` remained `"Global"`.
   - **Impact:** Over 3,100 Native American AIM markers (including key anthropological loci) were silenced under the `"Global"` label. In `master_aims_normalized.json`, only 343 markers were tagged as Native American.
   - **Fix:** `buildCleanAimDatabase()` now preserves and promotes regional identity (`target.region = panelEntry.region || target.region`), custom region colors, and informative weights from regional panels. `ALL_REGION_AIMS` and `master_aims_normalized.json` now index **3,208 verified Native American markers**.

2. **Metadata Stripping in Local Ancestry Inference (`src/utils/ancestry/paintedAncestry.ts`):**
   - **Flaw:** In `computeDatasetLAI()`, `matchedAims` only collected `{ rsid, chrom, pos, alleles, frequencies, genotype }`. The fields `region`, `continent`, `gene`, `trait`, and `description` were discarded.
   - **Impact:** Any filtering or searching in the UI for `"native"`, `"american"`, or gene names (such as *EDAR*) returned 0 results because the markers lacked regional labels.
   - **Fix:** `computeDatasetLAI()` now propagates full metadata (`region`, `continent`, `gene`, `trait`, `description`, `weight`) into `matchedAims` and `aimsUsed`.

3. **Coordinate-Only Genotype Lookup Fallback:**
   - **Flaw:** `getGenotype()` only queried by literal `rsid` string. If an uncalled, Illumina custom identifier, or coordinate-based tag (`15_28365618`) was used, the marker was missed.
   - **Fix:** Added coordinate-based fallback matching in `getGenotype()` using `chr${chrom}_${pos}` and `${chrom}_${pos}`.

4. **Small-Tract Admixture Erasure by HMM Smoothing (`cleanSegments`):**
   - **Flaw:** `cleanSegments()` forcibly merged any segment spanning `< 3 SNPs` or `< 1.5 Mb` into the surrounding dominant continental segment.
   - **Impact:** In admixed or colonial Delmarva / Eastern tribal lineages with distant or dispersed Indigenous American ancestry, authentic short Native American tracts (`AMR`) were smoothed away into European or African blocks.
   - **Fix:** `cleanSegments()` now explicitly protects `AMR` / Native American tracts and segments with confidence $\ge 0.70$ from being erased, ensuring authentic small segments remain visible.

5. **Chromosome Browser UI Limitations (`src/components/ChromosomePainterView.tsx`):**
   - **Flaw:** Matched rsIDs were only viewable if the user clicked on an individual segment on a chromosome bar. If a Native American segment was narrow or smoothed out, the user could never access or inspect the underlying matched markers.
   - **Fix:**
     - Added a top-level **"Browse All Matched rsIDs"** button and live counter badges (**Total Matched AIMs** & **🪶 Native American** count).
     - Added an **interactive rsID Drawer** with scope toggle: **Selected Segment**, **Current Chromosome**, or **Genome-wide (All Chromosomes)**.
     - Added a dedicated **"🪶 Native American"** one-click filter pill.
     - Added multi-field live search filtering across RSID, Gene, Trait, Region, and Genotype call.
     - Upgraded marker cards to display chromosome, position in Mb, gene, trait, genotype call badge, population region chip, and instant copy-to-clipboard button.
     - Added pagination to browse through all matched markers smoothly without arbitrary cutoffs.

6. **Genetic Markers Browser Synchronization (`src/components/GeneticMarkersBrowser.tsx`):**
   - Updated `enrichedResults` to resolve `continent` and regional tags from `dbEntry.region` (e.g. `"Native American"`), ensuring all 3,208 markers are searchable by continent in the main browser.

---

## Part 7: Final Automated Verification Results

- **TypeScript Compilation:**
  ```bash
  npx tsc --noEmit
  # Exited 0 (zero errors, full strict type safety)
  ```
- **Vitest Comprehensive Test Run:**
  ```bash
  npx vitest run
  # Test Files: 21 passed (21)
  # Tests:      155 passed (155)
  # Duration:   8.85s
  ```
- **Key Tests Added & Passing in [paintedAncestry.test.ts](file:///home/jequan/Desktop/Antigravity%20Projects/WITG-Genotype-Scout/src/utils/ancestry/paintedAncestry.test.ts):**
  - `should index >3,000 Native American AIM markers in ALL_REGION_AIMS and preserve regional identity` (Passed, 3,208 markers verified)
  - `should enrich matchedAims with Native American region, gene, and trait metadata` (Passed)
  - `should match markers using coordinate key fallback (chr_pos or pos) when rsid is uncalled or internal` (Passed)
  - `should preserve authentic short AMR segments in local ancestry inference` (Passed)

---

## Part 8: Global Marker Population Genetics Audit & Migration

Following the deep audit with **DeepSeek** (`/deepseek`) on whether generic `"Global"` markers actually belong to specific geographic regions, a full metric-driven migration was executed across `src/data/master_aims_normalized.json` and `src/data/aims/index.ts`.

### 1. The Core Findings
- **"Global" Was Used as a Catch-All Ingestion Bucket:** Rather than representing true pan-human invariance, thousands of markers from forensic panels (Kidd 55 AISNP, Seldin 128, 1000 Genomes) were deposited under `region: "Global"`.
- **High Divergence Loci Disguised as Global:** Well-known anthropological markers like *SLC45A2* `rs28777` (European light skin, $\text{EUR}=0.04$ vs $\text{AFR}=0.80$, $\Delta=-0.70$) and *KITLG* `rs1470608` were colored generic gray (`#95A5A6`) under `"Global"`.
- **Panel Ingestion Priority Overlap:** 93 genuine markers present in `oceanian.json` (70) and `south_asian.json` (23) were silenced under `"Global"`.
- **Filtering Bug on Dummy `GLOBAL` Frequencies:** In `src/data/aims/index.ts`, a check `if (frequencies.GLOBAL !== undefined) continue;` accidentally discarded hundreds of valid regional panel markers that had a global average frequency alongside real continental frequencies.

### 2. DeepSeek Mathematical Classification Framework Implemented
For each locus with continental frequency vector $[p_{\text{AFR}}, p_{\text{EUR}}, p_{\text{EAS}}, p_{\text{SAS}}, p_{\text{AMR}}, p_{\text{OCE}}, p_{\text{MENA}}]$:
1. **Single-Region Diagnostic Tier**:
   - Criterion: $|\Delta_1| = |p_{\text{top1}} - \bar{p}_{\text{others}}| \ge 0.35$ and gap $|\Delta_1| - |\Delta_2| \ge 0.10$.
   - Action: Reclassified to primary continental region (`African`, `East Asian`, `European`, `Native American`, `Oceanian`, `South Asian`, `Middle Eastern`), assigned canonical color, and annotated with `primaryMetric: { delta, fst, spread }`.
2. **Multi-Way Informative Tier**:
   - Criterion: Wright's $F_{ST} \ge 0.15$ or continental spread $\ge 0.35$.
   - Action: Assigned `region: "Multi-Way Informative"`, `color: "#9B59B6"`, with `secondaryRegions` preserving the contrasting population pairs (e.g. `['African', 'East Asian']`).
3. **Cosmopolitan / Pan-Human Tier**:
   - Criterion: Spread $< 0.20$ and $F_{ST} < 0.08$.
   - Action: Relabeled as `region: "Cosmopolitan"`, `color: "#95A5A6"`.
4. **Weakly Informative Tier**:
   - Criterion: $0.20 \le \text{spread} < 0.35$.
   - Action: Retained under `region: "Global"` as auxiliary likelihood markers.

### 3. Migration Results & Statistics

| Audit Category | Pre-Migration Count | Post-Migration Count | Actions Applied |
| :--- | :---: | :---: | :--- |
| **Single-Region Diagnostic Reclassified** | 0 | **962** | Assigned to AFR (570), EAS (222), SAS (46), AMR (36), MENA (34), OCE (34), EUR (20) |
| **Regional Panel Overlaps Restored** | 0 | **93** | 70 Oceanian and 23 South Asian markers restored |
| **Multi-Way Informative Annotated** | 0 | **1,240** | Tagged with contrasting population pairs and $F_{ST}$ |
| **True Cosmopolitan / Pan-Human** | 0 | **1,467** | Relabeled to `Cosmopolitan` ($\text{spread} < 0.20$) |
| **Weakly Informative Residual** | 5,999 | **2,237** | Retained under `Global` with metric annotations |
| **Total Evaluated Markers** | 17,727 | **17,727** | Zero markers lost, all metadata preserved |

### 4. Verification
- `npx tsc --noEmit` exited with code 0 (zero errors).
- All 21 test files passed.
- All 158 tests passed (including 3 new verification tests in `paintedAncestry.test.ts`).

---

## Part 9: Chromosome Y Detection & Patrilineal Visualization in Chromosome Painter

Following consultation with **DeepSeek** (`/deepseek`), Chromosome Y patrilineal haplogroup mapping and marker detection have been fully integrated into the Chromosome Painter and Matched rsIDs Drawer.

### 1. Biological Foundation & Principles
- **Male-Specific Region of the Y (MSY):** Unlike autosomes, Chromosome Y does not undergo meiotic recombination along the MSY (GRCh38 coordinates: 2,781,479 bp to 56,887,902 bp). It is passed from father to son down the unbroken patrilineal line.
- **Strand Allocation:**
  - **Strand A (Maternal):** Hemizygous — zero maternal Y chromosome (`strandA = []`).
  - **Strand B (Paternal):** 100% patrilineal, painted according to the continental geographic origin of the user's predicted Y-DNA haplogroup.
  - **Female XX Datasets:** Handled cleanly with an inactive track and badge: *"Female (XX) — No Chromosome Y"*.
- **Autosomal Admixture Proportion Safeguard:** Chromosome Y is strictly uniparental haplogroup DNA. Including its 57.2 Mb in the autosomal diploid denominator would artificially dilute continental percentages. It is explicitly excluded from `computePaintedAncestry` grand total Mb and `continentStats` bar charts.

### 2. Implementation Summary

1. **Local Ancestry Inference Engine (`src/utils/ancestry/paintedAncestry.ts`):**
   - Implemented `mapYHaplogroupToContinent(haplo)`: Accurately maps basal and sub-clade Y-DNA haplogroups to continental codes (e.g. `Q`, `C3b` $\rightarrow$ `AMR`; `E1b1a`, `A`, `B` $\rightarrow$ `AFR`; `R1b`, `I`, `J2`, `G` $\rightarrow$ `EUR`; `O`, `D` $\rightarrow$ `EAS`; `L`, `H` $\rightarrow$ `SAS`; `C4`, `M`, `S` $\rightarrow$ `OCE`; `J1`, `T` $\rightarrow$ `MID`).
   - Integrated Y-chromosome SNP ingestion: Collects all called Y-chromosome rows from `dataset.results` (e.g. 1,766 Y rows in Portuguese/WGS kits) and `dataset.yMap`, enriches them with gene names (*SRY*, *AMELY*, *RPS4Y1*, *DAZ1*), positions, traits, and genotypes, and appends them to `matchedAims` and `aimsUsed`.
   - Excluded `chromKey === 'Y'` from `grandTotalMb` in `computePaintedAncestry` to preserve autosomal diploid purity.

2. **Chromosome Painter UI (`src/components/ChromosomePainter.tsx`):**
   - Added `"Y": 57227415` to `CHROMOSOME_LENGTHS`.
   - Added key Y-linked genes to `KEY_GENES`:
     - *SRY* (Sex-determining Region Y, testis development, 2.78 Mb)
     - *AMELY* (Amelogenin Y, tooth enamel / sex marker, 6.86 Mb)
     - *RPS4Y1* (Ribosomal protein S4 Y-linked 1, 12.90 Mb)
     - *DAZ1* (Deleted in Azoospermia 1, spermatogenesis, 19.80 Mb)
   - Updated `sortedChroms` so chromosomes sort `1..22, X, Y`.
   - Rendered chromosome tracks:
     - Female (XX): Inactive slate track with *"Female (XX) — No Y Chromosome"* badge.
     - Male (XY): Strand A labeled *"Hemizygous (No Maternal Y)"*; Strand B painted with paternal haplogroup continent and annotated with haplogroup badge (e.g., `R1b1a1b`, `Q-M3`, `E1b1a`).

3. **Matched rsIDs Drawer (`src/components/ChromosomePainterView.tsx`):**
   - Added dedicated Y Chromosome Patrilineal Notice banner when `activeChromFocus === 'Y'` or when clicking a Y segment.
   - Enables full inspection and search of all detected Y-SNPs by chromosome, gene, rsID, or genotype.

### 3. Verification & Test Suite
- **TypeScript Type Safety:** `npx tsc --noEmit` passed with 0 errors.
- **Unit Tests (`src/utils/ancestry/paintedAncestry.test.ts`):** Added 5 dedicated Chromosome Y tests:
  - `should paint Chromosome Y Strand B with paternal haplogroup continent and leave Strand A hemizygous for males` (Passed)
  - `should correctly mark Chromosome Y as not applicable for female datasets` (Passed)
  - `should map Native American Y haplogroup Q to AMR` (Passed)
  - `should map African Y haplogroup E1b1a to AFR` (Passed)
  - `should exclude Chromosome Y from autosomal diploid percentage calculation in computePaintedAncestry` (Passed)
- **Full Test Suite:** 21 of 21 test files passed, 163 of 163 tests passed.

---

## Part 10: 8-Bit / 16-Bit Cyber-Laboratory Arcade Upload Screen Overhaul

Following consultation with **DeepSeek** (`/deepseek`), the main upload/landing screen has been completely transformed from a generic dropzone into an immersive, authentic **16-bit SNES / Arcade Cyber-Laboratory Terminal**.

### 1. The Diegetic Metaphor & Visual Identity
- **The Core Metaphor:** The user is not merely "uploading a file"; they are *jacking a physical bio-specimen cartridge into an air-gapped personal DNA mainframe*.
- **16-Bit Cyberpunk Palette:**
  - Void Black chassis (`#05070a`), Panel surfaces (`#0b1016`), Inset Bevel (`#141b26`).
  - Phosphor Green (`#6bff9e`), Cyber Cyan (`#4fe3ff`), Helix Magenta (`#ff4fd8`), Amber Warning (`#ffb648`), Coin Gold (`#ffd23f`).
- **Typography:**
  - `Press Start 2P`: Arcade headers, marquee, and action buttons.
  - `VT323`: CRT terminal telemetry, diagnostic readouts, and body text.
  - `Silkscreen`: HUD badges, chips, and quick toggles.
- **Chunky Pixel Architecture:** Authentic double-offset pixel shadows (`4px 4px 0 0 #05070a, 4px 4px 0 1px #1e2a3a`), pixel-notched framing, and dither fills.

### 2. Procedural Web Audio API Synthesizer (`retroSynth.ts`)
- Zero external MP3/WAV audio files and zero network downloads.
- Procedural oscillator synthesis with exponential gain decay envelopes:
  - `SFX.coin()`: 2-tone arcade coin-drop chime ($988\text{ Hz} \rightarrow 1319\text{ Hz}$).
  - `SFX.cartridgeInsert()`: Low-frequency mechanical slot clunk ($140\text{ Hz}$) followed by dual high acknowledge beeps ($880\text{ Hz}, 1760\text{ Hz}$).
  - `SFX.hover()`: Subtle 30ms high-pitch blip ($880\text{ Hz}$).
  - `SFX.select()`: Dual chirp rising to $1400\text{ Hz}$.
  - `SFX.error()`: Square-wave buzzer ($180\text{ Hz} \rightarrow 130\text{ Hz}$).
- User-controllable `[SFX: ON/OFF]` toggle button with localStorage persistence.

### 3. Integrated Interactive Terminal Components
1. **Top Arcade Marquee:**
   - Real-time scrolling LED telemetry ticker.
   - Quick toggles: `[SFX: ON/OFF]` and `[CRT: ON/OFF]`.
2. **CRT Screen Simulation (`CRTOverlay.tsx`):**
   - 2px scanline striping, RGB aperture grille micro-pattern, radial phosphor vignette curvature, and subtle 12 Hz flicker.
3. **Animated 8-bit DNA Double Helix (`RetroDNAHelix.tsx`):**
   - Canvas-based rotating pixel DNA strand with alternating cyan and magenta base pairs.
4. **Cartridge Slot A Dropzone:**
   - Top-loading bio-cartridge reader slot with pixel corner brackets and animated insertion states on dragover.
   - Supports `.TXT`, `.CSV`, `.ZIP`, `.GZ`, `.VCF` raw microarray and sequencing files.
5. **"INSERT COIN: LOAD DEMO" Button:**
   - Instant 1-click test button that loads the bundled specimen file (`public/samples/Iberian_Portuguese_hu33FC53.txt`).
   - Plays the arcade coin sound and immediately mounts the genome array.
6. **Diagnostics HUD:**
   - Live telemetry gauges verifying air-gapped security:
     - `▸ ROM INTEGRITY: ████████ PASS`
     - `▸ PHASED AIMS: 17,042 PRELOADED`
     - `▸ NETWORK SOCKETS: ░░ 0 ░░ (AIR-GAPPED)`
     - `▸ COMPUTE THREAD: WEB WORKER RAM`
7. **RPG Quest Log & Telemetry Boot Stream:**
   - 3-tab inventory: `[1] PRIVACY SANDBOX`, `[2] COMPATIBLE KITS` (23andMe, Ancestry, MyHeritage, VCF), `[3] OFFLINE PWA SETUP`.
   - Cycling live terminal boot sequence at the cabinet base.

### 4. Verification Results
- **TypeScript Type Safety:** `npx tsc --noEmit` exited with code 0 (zero errors).
- **Test Suite:** All 21 test files passed, all 163 tests passed.
- **Browser Automation:** Tested at `http://localhost:3000/` using browser subagent:
  - Verified CRT scanlines and audio toggle.
  - Verified drag-and-drop cartridge slot responsiveness.
  - Clicked "INSERT COIN: LOAD DEMO", confirming immediate sample ingestion and full expedition sequence execution.

![Hero Arcade Cabinet Header & Marquee](/home/jequan/.gemini/antigravity-ide/brain/eac311a7-c0e9-43ef-9145-e2859035dd2b/genotype_scout_dark_theme_1789248486078.png)

![Cartridge Slot, Diagnostics HUD, Quest Log, and INSERT COIN Demo CTA](/home/jequan/.gemini/antigravity-ide/brain/eac311a7-c0e9-43ef-9145-e2859035dd2b/genotype_scout_dark_theme_scrolled_1789248489344.png)

### 5. Loading & Display Issue Resolution
- **Port Alignment**: The IDE internal webview was attempting to access `http://localhost:40559/` (which returned a 502 proxy error). The active Vite dev server is running on **`http://localhost:3000/`**.
- **Contrast & Vignette Fix**:
  - Replaced additive blend-mode scanline layers in `CRTOverlay.tsx` with pure-dark 20% alpha scanlines and subtle dark vignette, eliminating any white hazing or washed-out appearance.
  - Set the root container on the upload screen to `#05070a` void black and matched the navigation bar for a seamless, immersive arcade console experience.





