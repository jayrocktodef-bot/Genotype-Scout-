import rhData from '../data/blood_markers.json';
import { RhPrediction, RhMarkerResult, RhDetailedResult } from '../types/blood';

function getComplement(allele: string): string {
  const complements: Record<string, string> = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
  return complements[allele] || allele;
}

function normalizeAndComplement(genotype: string): { original: string, complement: string } {
  const clean = genotype.trim().toUpperCase().replace(/[\s\/_]/g, '');
  const sortedOriginal = clean.split('').sort().join('');
  const complement = clean.split('').map(getComplement).sort().join('');
  return { original: sortedOriginal, complement };
}

function getGenotypeVal(genotypeMap: Map<string, string> | Record<string, string> | undefined, snp: string): string | null {
  if (!genotypeMap) return null;
  let val: string | undefined;
  if (genotypeMap instanceof Map) {
    val = genotypeMap.get(snp) || genotypeMap.get(snp.toLowerCase()) || genotypeMap.get(snp.toUpperCase());
  } else if (typeof genotypeMap === 'object') {
    val = (genotypeMap as Record<string, string>)[snp] || 
          (genotypeMap as Record<string, string>)[snp.toLowerCase()] || 
          (genotypeMap as Record<string, string>)[snp.toUpperCase()];
  }
  if (!val || val === '--' || val === '00' || val === 'NN' || val === 'No Call') {
    return null;
  }
  return val.trim().toUpperCase();
}

/**
 * Infers Rh Factor based on multi-tag RHD deletion ensemble and RHCE antigen proxies.
 * @param genotypeMap - A Map or record of SNP -> Allele pairs extracted from raw genotype data
 */
export function inferRhFactor(genotypeMap: Map<string, string> | Record<string, string> | undefined): RhDetailedResult {
  const results: RhMarkerResult[] = [];
  let negativeScore = 0;
  let positiveScore = 0;
  let totalConfidence = 0;

  const targetSnps = Object.keys(rhData.rhSystem);

  for (const snp of targetSnps) {
    const rawGenotype = getGenotypeVal(genotypeMap, snp);
    const snpConfig = (rhData.rhSystem as any)[snp];

    if (rawGenotype && snpConfig) {
      const { original, complement } = normalizeAndComplement(rawGenotype);
      const markerInfo = snpConfig.alleles[original] || snpConfig.alleles[complement];
      
      if (markerInfo) {
        results.push({
          snp,
          genotype: rawGenotype,
          prediction: markerInfo.prediction as RhPrediction,
          confidence: markerInfo.confidence
        });

        // Weight scores by the statistical confidence of the surrogate
        if (markerInfo.prediction === "Negative") {
          negativeScore += markerInfo.confidence;
        } else if (markerInfo.prediction === "Positive") {
          positiveScore += markerInfo.confidence;
        }
        totalConfidence += markerInfo.confidence;
      } else {
        results.push({ snp, genotype: rawGenotype, prediction: "Unknown", confidence: 0 });
      }
    } else {
      results.push({ snp, genotype: rawGenotype || "No Call", prediction: "Unknown", confidence: 0 });
    }
  }

  // 1. Evaluate African RHDpsi Pseudogene (rs28366003: c.609G>A p.Trp203Ter)
  const rhdPsiVal = getGenotypeVal(genotypeMap, 'rs28366003');
  let isRhdPsi = false;
  if (rhdPsiVal) {
    const cleanPsi = rhdPsiVal.replace(/[\s\/_]/g, '');
    if (cleanPsi === 'AA' || cleanPsi === 'TT') {
      isRhdPsi = true;
      // Inactive RHD pseudogene: functionally RhD- despite genomic presence
      negativeScore += 2.0;
      totalConfidence += 2.0;
    } else if (cleanPsi === 'GA' || cleanPsi === 'AG' || cleanPsi === 'CT' || cleanPsi === 'TC') {
      isRhdPsi = true; // Carrier
    }
  }

  // 2. Evaluate RHCE C/c Antigens (rs676785: G=C, A=c; rs676185: C=C, T=c; rs17525388: C=C, T=c)
  let cAntigen: "C+" | "c+" | "C+ c+" | "Unknown" = "Unknown";
  const cSnp1 = getGenotypeVal(genotypeMap, 'rs676785');
  const cSnp2 = getGenotypeVal(genotypeMap, 'rs676185');
  const cSnp3 = getGenotypeVal(genotypeMap, 'rs17525388');

  const cVal = cSnp1 || cSnp2 || cSnp3;
  if (cVal) {
    const cleanC = cVal.replace(/[\s\/_]/g, '');
    if (cSnp1) {
      if (cleanC === 'GG' || cleanC === 'CC') cAntigen = "C+";
      else if (['GA', 'AG', 'CT', 'TC'].includes(cleanC)) cAntigen = "C+ c+";
      else if (cleanC === 'AA' || cleanC === 'TT') cAntigen = "c+";
    } else {
      if (cleanC === 'CC' || cleanC === 'GG') cAntigen = "C+";
      else if (['CT', 'TC', 'GA', 'AG'].includes(cleanC)) cAntigen = "C+ c+";
      else if (cleanC === 'TT' || cleanC === 'AA') cAntigen = "c+";
    }
  }

  // 3. Evaluate RHCE E/e Antigens (rs28362459: C=E, T=e; rs28362463: G=E, A=e; rs606429: A=E, G=e)
  let eAntigen: "E+" | "e+" | "E+ e+" | "Unknown" = "Unknown";
  const eSnp1 = getGenotypeVal(genotypeMap, 'rs28362459');
  const eSnp2 = getGenotypeVal(genotypeMap, 'rs28362463');
  const eSnp3 = getGenotypeVal(genotypeMap, 'rs606429');

  const eVal = eSnp1 || eSnp2 || eSnp3;
  if (eVal) {
    const cleanE = eVal.replace(/[\s\/_]/g, '');
    if (eSnp1) {
      if (cleanE === 'CC' || cleanE === 'GG') eAntigen = "E+";
      else if (['CT', 'TC', 'GA', 'AG'].includes(cleanE)) eAntigen = "E+ e+";
      else if (cleanE === 'TT' || cleanE === 'AA') eAntigen = "e+";
    } else if (eSnp2) {
      if (cleanE === 'GG' || cleanE === 'CC') eAntigen = "E+";
      else if (['GA', 'AG', 'CT', 'TC'].includes(cleanE)) eAntigen = "E+ e+";
      else if (cleanE === 'AA' || cleanE === 'TT') eAntigen = "e+";
    } else if (eSnp3) {
      if (cleanE === 'AA' || cleanE === 'TT') eAntigen = "E+";
      else if (['AG', 'GA', 'TC', 'CT'].includes(cleanE)) eAntigen = "E+ e+";
      else if (cleanE === 'GG' || cleanE === 'CC') eAntigen = "e+";
    }
  }

  // 4. Determine final D status
  let finalPhenotype: RhPrediction = "Unknown";
  let finalConfidence = 0;

  if (totalConfidence > 0) {
    const isLikelyNegative = negativeScore > positiveScore;
    finalPhenotype = isLikelyNegative ? "Negative" : "Positive";
    finalConfidence = isLikelyNegative 
      ? (negativeScore / totalConfidence) 
      : (positiveScore / totalConfidence);
  }

  // 5. Build Fisher-Race representation (e.g. "D+ C+ c+ E- e+")
  const dSymbol = finalPhenotype === "Positive" ? "D+" : finalPhenotype === "Negative" ? "D-" : "D?";
  let cSymbol = "";
  if (cAntigen === "C+") cSymbol = "C+ c-";
  else if (cAntigen === "c+") cSymbol = "C- c+";
  else if (cAntigen === "C+ c+") cSymbol = "C+ c+";
  else cSymbol = "C? c?";

  let eSymbol = "";
  if (eAntigen === "E+") eSymbol = "E+ e-";
  else if (eAntigen === "e+") eSymbol = "E- e+";
  else if (eAntigen === "E+ e+") eSymbol = "E+ e+";
  else eSymbol = "E? e?";

  const fisherRace = `${dSymbol} ${cSymbol} ${eSymbol}`.trim();

  return {
    phenotype: finalPhenotype,
    rhD: finalPhenotype,
    rhConfidence: finalConfidence,
    confidence: finalConfidence,
    fisherRace,
    cAntigen,
    eAntigen,
    isRhdPsi,
    isHybridSuspected: false,
    results
  };
}

