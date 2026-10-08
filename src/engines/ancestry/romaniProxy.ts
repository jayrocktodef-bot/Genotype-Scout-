import { ParsedGenomicDataset } from '../../services/parser/types';
import proxyData from '../../data/aims/romaniProxySNPs.json';
import { RohResult } from './rohDetector';

export interface RomaniProxyResult {
  score: number;
  confidenceTier: 'Strong' | 'Moderate' | 'Weak' | 'None';
  nwIndianAllelesDetected: number;
  directSnpsDetected: string[];
  fRoh: number;
  yDnaMatch: boolean;
  mtDnaMatch: boolean;
  message: string;
}

export function computeRomaniProxySignal(
  dataset: ParsedGenomicDataset,
  rohResult?: RohResult,
  yDnaPath?: string[],
  mtDnaPath?: string[]
): RomaniProxyResult {
  let nwScore = 0;
  let maxNwScore = 0;
  let nwIndianCount = 0;
  const directSnpsDetected: string[] = [];

  const userSnps = dataset.snpMap || {};

  // Uniparental checks
  // Y-DNA H-M69; mtDNA M5a1, M18, M35b
  const yDnaMatch = yDnaPath ? yDnaPath.some(c => c.startsWith('H-') || c === 'H') : false;
  const mtDnaMatch = mtDnaPath ? mtDnaPath.some(c => c.startsWith('M5a1') || c.startsWith('M18') || c.startsWith('M35b')) : false;

  for (const snp of proxyData) {
    const genotype = userSnps[snp.rsid];
    if (!genotype || genotype === '--' || genotype === '-') continue;

    let dosage = 0;
    if (genotype[0] === snp.targetAllele) dosage++;
    if (genotype.length > 1 && genotype[1] === snp.targetAllele) dosage++;

    if (snp.type === 'nw_indian') {
      maxNwScore += snp.weight * 2;
      nwScore += snp.weight * dosage;
      if (dosage > 0) nwIndianCount++;
    } else if (snp.type === 'direct_roma') {
      if (dosage > 0) directSnpsDetected.push(snp.rsid);
    }
  }

  // Normalize score
  const normalizedScore = maxNwScore > 0 ? nwScore / maxNwScore : 0;
  
  // Check F_ROH
  const fRoh = rohResult?.fRoh || 0;
  const isEndogamous = fRoh >= 0.012; // 1.2% threshold for endogamy 

  const hasUniparental = yDnaMatch || mtDnaMatch;
  const numDirect = directSnpsDetected.length;

  let confidenceTier: 'Strong' | 'Moderate' | 'Weak' | 'None' = 'None';
  let message = '';

  if (normalizedScore > 0.4) {
    // High NW Indian signal detected
    let corroborators = 0;
    if (isEndogamous) corroborators++;
    if (numDirect >= 1) corroborators++;
    if (hasUniparental) corroborators++;

    if (corroborators >= 2) {
      confidenceTier = 'Strong';
      message = 'Pattern strongly consistent with Romani origins. Significant NW Indian genetic trace accompanied by characteristic endogamy and specific functional alleles.';
    } else if (corroborators === 1) {
      confidenceTier = 'Moderate';
      message = 'Pattern consistent with Romani origins. NW Indian trace found along with one corroborating signal (endogamy or direct locus).';
    } else {
      confidenceTier = 'Weak';
      message = 'South Asian ancestry present; Romani pattern not confirmed. Cannot distinguish Romani from generic NW Indian admixture.';
    }
  } else {
    message = 'No significant NW Indian proxy signal detected.';
  }

  return {
    score: normalizedScore,
    confidenceTier,
    nwIndianAllelesDetected: nwIndianCount,
    directSnpsDetected,
    fRoh,
    yDnaMatch,
    mtDnaMatch,
    message
  };
}
