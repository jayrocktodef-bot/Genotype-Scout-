# ONNX Ancestry Classifier: Phase 0 Diagnosis

Scope: why `genotype_scout_classifier.onnx` v2.0.0 reports 19.23% accuracy and 10.8989 log loss on real 1000 Genomes validation samples. Reproduce with `scripts/diagnose_onnx.py` and `scripts/diagnose_allele_alignment.py`.

## Verdict

The 10.9 log loss is not weak signal. It is a pipeline and data-definition failure with three independent causes, in order of impact:

1. **Model collapse, not scatter.** All 26 validation samples are predicted `Indigenous_American` with p = 1.000. The 19.23% accuracy is exactly the 5 genuine AMR samples (5/26). The model carries zero information about the other four validatable classes.
2. **The per-marker allele label does not reliably match the stored frequencies.** The training definition ("dosage of `alleles[0]`, frequencies are P(`alleles[0]`)") is false for a large share of markers. This is a marker-level orientation mix, not a single global flip.
3. **MENA and Oceanian "frequencies" are placeholders, not measurements**, and the divergence-based feature selection preferentially picked markers whose only divergence is those placeholders. This also violates the spirit of H-2 (no synthetic training frequencies).

The HW-simulated training distribution (cause 2 and 3 together) is the prime suspect; the validation pipeline has a further defect (missing coded as homozygous REF). Decision gate below.

## 1. Confusion matrix (26 validation samples)

| True \ Pred | African | East_Asian | European | Indigenous_American | Middle_Eastern | Oceanian | South_Asian |
|---|---|---|---|---|---|---|---|
| African (5) | 0 | 0 | 0 | 5 | 0 | 0 | 0 |
| East_Asian (5) | 0 | 0 | 0 | 5 | 0 | 0 | 0 |
| European (6, incl. Iberian) | 0 | 0 | 0 | 6 | 0 | 0 | 0 |
| Indigenous_American (5) | 0 | 0 | 0 | 5 | 0 | 0 | 0 |
| South_Asian (5) | 0 | 0 | 0 | 5 | 0 | 0 | 0 |

Systematic single-class mass, every prediction at p = 1.000 (severely overconfident, which is what yields log loss near 10.9 on 21 wrong samples). An all-zero input (100% missing) predicts near-uniform probabilities (0.141 to 0.144), so the collapse is driven by real input structure, not by the missing-data default.

## 2. Dosage-definition audit

Original hypothesis: validation counts a different allele than training, giving negative correlation with the true class vector.

Raw correlation of each sample's dosage vector against class frequency vectors is near zero for every class (average with the true class +0.020), which does not match a clean global flip (that would be strongly negative).

Per-class agreement between mean validation allele frequency (dosage/2 over that class's samples) and the panel frequency f, across the 1,132 markers present in both:

| Class | r(val, f) | r(val, 1-f) |
|---|---|---|
| European | +0.025 | -0.025 |
| African | +0.131 | -0.131 |
| East_Asian | +0.048 | -0.048 |
| South_Asian | +0.040 | -0.040 |
| Indigenous_American | +0.021 | -0.021 |

Per-marker orientation (EUR + AFR, validation vs panel vs complement): 154 consistent with f, 114 consistent with 1-f, 864 undecidable. Restricting to markers with 5-class spread of at least 0.7 gives mean r of only +0.035.

Spot checks against known biology (validation allele frequency per class):

| Marker | Panel alt, panel f (EUR/AFR/EAS) | Validation | Reading |
|---|---|---|---|
| rs2814778 | C, 0.001 / 0.99 / 0.002 | 0 / 1.0 / 0 | consistent |
| rs3827760 | A, 0.002 / 0.001 / 0.92 | 1.0 / 1.0 / 0.2 | frequencies describe the other allele (flipped) |
| rs16891982 | G, 0.035 / 0.99 / 0.005 | 0.9 / 0 / 0.1 | flipped |
| rs1426654 | G, 0.01 / 0.98 / 0.01 | 0 / 0.9 / 1.0 | mixed: AFR consistent, EAS panel value contradicts real data |

Conclusion: **partially confirmed, in a different form.** It is not one global allele flip; it is a marker-level orientation inconsistency, plus at least some per-population values that are curated diagnostic scores rather than measured allele frequencies of `alleles[0]`. A classifier trained on frequencies of `alleles[0]` therefore learns patterns that real `alleles[0]` dosages do not follow.

## 3. Strand audit

- The panel stores a single allele (`alleles[0]`) for 1,131 of the 1,133 master-present features; only 2 carry two alleles.
- Against the Ensembl GRCh38 cache: `alleles[0]` equals the Ensembl REF for 574 features and the Ensembl ALT for 554 (5 uncached). "ALT" in the sidecar is therefore not a consistent REF/ALT notion.
- 156 features are palindromic A/T or C/G (cache-resolved), where strand cannot be inferred from letters.
- The validation extraction (`scripts/fetch_1000g_validation.py`) counts VCF alleles equal to the sidecar `alt` letter on the VCF forward strand, matched by GRCh37 position taken from a consumer chip file. For non-palindromic markers this is forward-strand correct; for the 156 palindromic markers an unverified position match cannot rule out a different allele.

## 4. Missingness audit

- Validation: exactly 59 of 1,197 features (4.9%) are missing in every 1000G sample, the identical set. The Iberian sample misses 1 (0.1%). The pattern is structural and class-independent, so it adds a constant offset, not class-correlated bias, and does not explain the collapse. It is still wrong: missing is coded 0.0 (homozygous REF) via `calls.get(rs, 0.0)`.
- 64 of the 1,197 sidecar features (the purged `rs1001`-`rs1270` grid) no longer exist in `master_aims_normalized.json`. The deployed model was trained on frequencies for those fabricated records. They are dead inputs at inference for nearly all users.
- Training adds 3% random dropout to 0.0, never NaN.

## 5. M2 train/inference skew

`extractOnnxFeatureMatrix` routes through `matchGenotypeAlleles` (complement matching for known non-palindromic markers) while the model was trained exact-only. Because 1,131 of 1,133 features expose a single allele, `refAllele` is null, palindromicity is unknown, and since the L4 fix matching fails closed to exact. The skew is therefore numerically small (at most 2 features) but the contract still differs, the inference path still codes missing as 0.0, and the sidecar remains v2.0.0 with no feature-definition pointer. This is fixed structurally in Phase 1 by a single canonical feature function.

## Decision gate

Findings select **Branch A (orientation/definition) and Branch C (HW-simulated training on non-measured frequencies)**, both pre-authorized:

- Phase 1: one canonical forward-strand dosage definition (alleles[0], NaN missing, mean imputation, palindromic MAF > 0.40 excluded), re-derived 1000G validation, shared Python/TypeScript fixture.
- Phase 2: train on real 1000G individuals, which makes the orientation of panel frequencies irrelevant to the training signal (dosage is counted directly from genotypes), excluding ASW, ACB, MXL, PUR, CLM, PEL.
- Phase 3: MENA and Oceanian have no 1000G representation and the panel values are placeholders, so they will be marked unvalidated unless real HGDP/SGDP data can be sourced.
