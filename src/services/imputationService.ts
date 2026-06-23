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

  // 1. Detect dominant ancestry prior to optimize imputation weights
  let nativeAmericanScore = 0;
  let africanScore = 0;
  let eastAsianScore = 0;
  let europeanScore = 0;
  let totalDiagnosticMarkers = 0;

  // SLC24A5 European vs African diagnostic marker check
  const slc24a5 = userGenotype['rs1426654'];
  if (slc24a5) {
    totalDiagnosticMarkers++;
    let counts = 0;
    for (const char of slc24a5) if (char === 'A') counts++;
    if (counts === 2) europeanScore += 2;
    else if (counts === 1) { europeanScore += 1; africanScore += 1; }
    else africanScore += 2;
  }

  // EDAR East Asian & Native American diagnostic marker check
  const edar = userGenotype['rs3827760'];
  if (edar) {
    totalDiagnosticMarkers++;
    let counts = 0;
    for (const char of edar) if (char === 'G') counts++;
    if (counts === 2) { eastAsianScore += 2; nativeAmericanScore += 2; }
    else if (counts === 1) { eastAsianScore += 1; nativeAmericanScore += 1; }
  }

  // Duffy Null African diagnostic marker check
  const duffy = userGenotype['rs2814778'];
  if (duffy) {
    totalDiagnosticMarkers++;
    let counts = 0;
    for (const char of duffy) if (char === 'C') counts++;
    if (counts === 2) africanScore += 2;
  }

  // rs3094315 Indigenous American diagnostic marker check
  const amrMarker = userGenotype['rs3094315'];
  if (amrMarker) {
    totalDiagnosticMarkers++;
    let counts = 0;
    for (const char of amrMarker) if (char === 'A') counts++;
    if (counts === 2) nativeAmericanScore += 2;
  }

  // Fallback to average if no diagnostics found
  const hasDiagnosticSignals = totalDiagnosticMarkers > 0;
  const maxScore = Math.max(europeanScore, africanScore, eastAsianScore, nativeAmericanScore);
  let predictedCohort = 'GLOBAL';
  if (hasDiagnosticSignals && maxScore > 0) {
    if (maxScore === nativeAmericanScore) predictedCohort = 'AMR';
    else if (maxScore === africanScore) predictedCohort = 'AFR';
    else if (maxScore === eastAsianScore) predictedCohort = 'EAS';
    else if (maxScore === europeanScore) predictedCohort = 'EUR';
  }

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

    // Ancestry-aware frequency extraction
    let freq = 0.5;
    if (predictedCohort !== 'GLOBAL' && aim.frequencies[predictedCohort] !== undefined) {
      freq = aim.frequencies[predictedCohort];
    } else {
      const freqs = Object.values(aim.frequencies) as number[];
      if (freqs.length > 0) {
        freq = freqs.reduce((a, b) => a + b, 0) / freqs.length;
      }
    }

    // Mode-based imputation
    const allele1 = freq >= 0.5 ? aim.alleles[0] : (aim.alleles[1] || aim.alleles[0]);
    const allele2 = freq >= 0.5 ? aim.alleles[0] : (aim.alleles[1] || aim.alleles[0]);
    
    imputedGenotype[rsid] = allele1 + allele2;
  }

  return imputedGenotype;
}
