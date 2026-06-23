import rhData from '../data/blood_markers.json';
import { RhPrediction, RhMarkerResult } from '../types/blood';

function getComplement(allele: string): string {
  const complements: Record<string, string> = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
  return complements[allele] || allele;
}

function normalizeAndComplement(genotype: string): { original: string, complement: string } {
  const sortedOriginal = genotype.split('').sort().join('');
  const complement = genotype.split('').map(getComplement).sort().join('');
  return { original: sortedOriginal, complement };
}

/**
 * Infers Rh Factor based on surrogate RHCE markers.
 * @param genotypeMap - A Map or record of SNP -> Allele pairs extracted from raw genotype data
 */
export function inferRhFactor(genotypeMap: Map<string, string> | Record<string, string>): { 
  phenotype: RhPrediction; 
  results: RhMarkerResult[]; 
  confidence: number 
} {
  const results: RhMarkerResult[] = [];
  let negativeScore = 0;
  let positiveScore = 0;
  let totalConfidence = 0;

  const targetSnps = Object.keys(rhData.rhSystem);

  for (const snp of targetSnps) {
    // Standardize handling of no-calls (e.g., '--', '00', or missing completely)
    let rawGenotype: string | undefined;
    if (genotypeMap instanceof Map) {
      rawGenotype = genotypeMap.get(snp);
    } else if (genotypeMap && typeof genotypeMap === 'object') {
      rawGenotype = (genotypeMap as Record<string, string>)[snp];
    }

    const genotype = !rawGenotype || rawGenotype === '--' || rawGenotype === '00' 
      ? null 
      : rawGenotype;

    const snpConfig = (rhData.rhSystem as any)[snp];
    if (genotype && snpConfig) {
      const { original, complement } = normalizeAndComplement(genotype);
      const markerInfo = snpConfig.alleles[original] || snpConfig.alleles[complement];
      
      if (markerInfo) {
        results.push({
          snp,
          genotype,
          prediction: markerInfo.prediction as RhPrediction,
          confidence: markerInfo.confidence
        });

        // Weight the scores by the statistical confidence of the surrogate
        if (markerInfo.prediction === "Negative") {
          negativeScore += markerInfo.confidence;
        } else if (markerInfo.prediction === "Positive") {
          positiveScore += markerInfo.confidence;
        }
        totalConfidence += markerInfo.confidence;
      } else {
         // Push "Unknown" for UI rendering in the molecular breakdown table
         results.push({ snp, genotype: genotype || "No Call", prediction: "Unknown", confidence: 0 });
      }
    } else {
       // Push "Unknown" for UI rendering in the molecular breakdown table
       results.push({ snp, genotype: genotype || "No Call", prediction: "Unknown", confidence: 0 });
    }
  }

  // Evaluate final state
  if (totalConfidence === 0) {
    return { phenotype: "Unknown", results, confidence: 0 };
  }

  // Calculate proportional probability
  const isLikelyNegative = negativeScore > positiveScore;
  const finalConfidence = isLikelyNegative 
    ? (negativeScore / totalConfidence) 
    : (positiveScore / totalConfidence);

  return {
    phenotype: isLikelyNegative ? "Negative" : "Positive",
    results,
    confidence: finalConfidence
  };
}
