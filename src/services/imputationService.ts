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

    // Probabilistic simulation based on frequency for both alleles
    // This simulates the uncertainty inherent in genotype imputation
    const freq1 = avgFreq;
    const freq2 = avgFreq;
    const allele1 = Math.random() < freq1 ? aim.alleles[0] : aim.alleles[1];
    const allele2 = Math.random() < freq2 ? aim.alleles[0] : aim.alleles[1];
    
    imputedGenotype[rsid] = allele1 + allele2;
  }

  return imputedGenotype;
}
