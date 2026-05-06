import { ANCHOR_AIMS } from '../anchorAims';
import { SNP_PROXY_MAP } from '../utils/genotypeUtils';

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

    // Check if we have a proxy match in the user data
    const proxies = SNP_PROXY_MAP[rsid];
    let foundProxy = false;
    if (proxies) {
      for (const proxy of proxies) {
        if (imputedGenotype[proxy.toLowerCase()]) {
          imputedGenotype[rsid] = imputedGenotype[proxy.toLowerCase()];
          foundProxy = true;
          break;
        }
      }
    }
    if (foundProxy) continue;

    // Only impute high-value markers defined in the anchor database
    const aim = ANCHOR_AIMS.find(a => a.rsid.toLowerCase() === rsid);
    if (!aim || !aim.frequencies || !aim.alleles || aim.alleles.length === 0) continue;

    const freqs = Object.values(aim.frequencies) as number[];
    if (freqs.length === 0) continue;
    
    // Calculate simple average frequency
    const avgFreq = freqs.reduce((a, b) => a + b, 0) / freqs.length;

    // Deterministic imputation based on most likely allele (Mode)
    // This improves accuracy over random guessing when sample sizes are small
    const allele1 = avgFreq >= 0.5 ? aim.alleles[0] : (aim.alleles[1] || aim.alleles[0]);
    const allele2 = avgFreq >= 0.5 ? aim.alleles[0] : (aim.alleles[1] || aim.alleles[0]);
    
    imputedGenotype[rsid] = allele1 + allele2;
  }

  return imputedGenotype;
}
