# Canonical ONNX Feature Specification

This document defines the canonical feature representation for the ONNX ancestry classifier.

## 1. Feature Definition
The feature extracted per marker is the **forward-strand dosage** of the canonical feature allele (`featureAllele`). The dosage is an integer in $\{0, 1, 2\}$, representing the count of the feature allele in the individual's genotype.

Missing values or unresolvable genotypes are strictly represented as `NaN` (Not a Number), which are then mean-imputed per marker immediately before feeding the model. **Zero is strictly reserved for a homozygous alternate allele state**, not as a proxy for missingness.

## 2. Allele Alignment
Given the `panel_allele` (from legacy definitions) and `ensembl_alleles` (the verified forward-strand REF and ALT from the genome build):
- **Feature Allele ($F$)**: 
  - Equals `panel_allele` if it exists in `ensembl_alleles`.
  - Otherwise, equals the complement of `panel_allele` if the marker is non-palindromic and the complement exists in `ensembl_alleles`.
  - Otherwise, the marker is unresolvable and excluded.
- **Other Allele ($O$)**:
  - The remaining allele in `ensembl_alleles`.

## 3. Dosage Counting Logic
For an input genotype pair (e.g., from VCF or user data):
1. **Exact Match**: If the genotype alleles are a subset of $\{F, O\}$, dosage is the count of $F$.
2. **Complement Match (Non-Palindromic Only)**: If the marker is strictly non-palindromic (not A/T or C/G) and the genotype alleles are a subset of $\{\text{comp}(F), \text{comp}(O)\}$, dosage is the count of $\text{comp}(F)$.
3. **Invalid/Missing**: Anything else yields `NaN`.

## 4. Palindromic Markers
Palindromic markers (A/T, C/G) cannot be safely matched via complement logic because strand flips cannot be distinguished from allele substitutions.
- Inference on palindromic markers requires exact allele matches (rule 1 only).
- During training, palindromic markers with an observed Minor Allele Frequency (MAF) $> 0.40$ are excluded to prevent severe errors when orientation assumptions fail.

## 5. Contract
The Python training pipeline and the TypeScript inference engine must use identical implementations of this logic. A shared fixture file is used to guarantee identically computed vectors across languages.
