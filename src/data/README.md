# Genotype Scout Reference & AIM Data Provenance

## 1. Frequency Object Rounding Provenance

Approximately 15% of population frequency objects in reference databases and Ancestry Informative Marker (AIM) panels (`src/data/aims/*.json`, `src/data/master_aims_normalized.json`, and reference frequencies) exhibit discrete fractional values such as `0.500`, `0.250`, `0.125`, `0.375`, `0.750`, etc.

### Provenance Rationale
- **Cohort Sample Binning**: This rounding is standard and consistent with the 1000 Genomes Project (1000G) and Human Genome Diversity Project (HGDP) subpopulation sample sizes. In small reference cohorts (e.g., $N = 2$, $N = 4$, or $N = 8$ diploid individuals), allele frequencies are empirical discrete ratios of observed alternate allele counts to total alleles ($k / 2N$).
- **Standing Invariant**: **Zero invented frequencies and zero continuous smoothing of raw cohort counts**. These frequencies must not be modified, interpolated, or altered; they accurately represent the empirical discrete counts published in the upstream genomic panels.
