import { ANCHOR_AIMS } from '../anchorAims';

/**
 * Targeted imputation using allele frequencies from reference population data.
 * If a critical Ancestry Informative Marker (AIM) is missing, 
 * estimate the most likely genotype based on the reference population frequencies.
 */
export function imputeTargetedGenotypes(
  userGenotype: Record<string, string>,
  markers: any[]
): Record<string, string> {
  const imputedGenotype = { ...userGenotype };

  for (const marker of markers) {
    const rsid = (marker.rsid || marker.markerId).toLowerCase();
    
    // If the marker is already present, skip
    if (imputedGenotype[rsid]) continue;

    // Only impute high-value markers defined in the anchor database
    const aim = ANCHOR_AIMS.find(a => a.rsid.toLowerCase() === rsid);
    if (!aim || !aim.frequencies || !aim.alleles || aim.alleles.length === 0) continue;

    const freqs = Object.values(aim.frequencies) as number[];
    if (freqs.length === 0) continue;
    
    // Calculate simple average frequency
    const avgFreq = freqs.reduce((a, b) => a + b, 0) / freqs.length;

    // If allele is highly prevalent across populations (>0.85), impute to homozygote
    if (avgFreq > 0.85) {
        // Assuming first allele in aim.alleles is the primary one, which is common.
        // This is a rough heuristic.
        imputedGenotype[rsid] = aim.alleles[0] + aim.alleles[0];
    }
  }

  return imputedGenotype;
}
