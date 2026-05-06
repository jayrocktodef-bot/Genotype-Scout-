
/**
 * Admixture Calculator (Statistical Engine)
 * Estimates ethnicity percentages using 1000 Genomes reference data.
 */

interface GenotypeFrequencies {
  [genotype: string]: number;
}

interface PopulationData {
  [popCode: string]: GenotypeFrequencies;
}

interface ReferenceDatabase {
  [rsid: string]: {
    populations: PopulationData;
  };
}

const SUPER_POPS = ['EUR', 'AFR', 'EAS', 'SAS', 'AMR'];

const POP_TO_SUPERPOP: Record<string, string> = {
  // European
  'GBR': 'EUR', 'CEU': 'EUR', 'FIN': 'EUR', 'TSI': 'EUR', 'IBS': 'EUR',
  // African
  'YRI': 'AFR', 'LWK': 'AFR', 'GWD': 'AFR', 'MSL': 'AFR', 'ESN': 'AFR', 'ASW': 'AFR', 'ACB': 'AFR',
  // East Asian
  'CHB': 'EAS', 'CHS': 'EAS', 'CDX': 'EAS', 'KHV': 'EAS', 'JPT': 'EAS',
  // South Asian
  'GIH': 'SAS', 'PJL': 'SAS', 'BEB': 'SAS', 'STU': 'SAS', 'ITU': 'SAS',
  // Indigenous American
  'PUR': 'AMR', 'CLM': 'AMR', 'MXL': 'AMR', 'PEL': 'AMR'
};

export function calculateEthnicity(
  userSnps: Record<string, string>,
  referenceData: any
) {
  const scores: Record<string, number> = {
    EUR: 0,
    AFR: 0,
    EAS: 0,
    SAS: 0,
    AMR: 0
  };

  let markersUsed = 0;

  // Pre-calculate super-population average frequencies
  // This is a simplified approach: average of sub-population genotype frequencies
  const getSuperPopFreq = (rsid: string, genotype: string, superPop: string) => {
    const marker = referenceData[rsid];
    if (!marker || !marker.populations) return 0.001;

    const subPops = Object.keys(POP_TO_SUPERPOP).filter(p => POP_TO_SUPERPOP[p] === superPop);
    let totalFreq = 0;
    let count = 0;

    // Try normal and flipped genotype
    const flippedGenotype = genotype[1] + genotype[0];

    for (const popCode of subPops) {
      const popData = marker.populations[popCode];
      if (popData) {
        const val = popData[genotype] ?? popData[flippedGenotype];
        if (val !== undefined) {
          totalFreq += val;
          count++;
        }
      }
    }

    return count > 0 ? (totalFreq / count) : 0.001;
  };

  for (const [rsid, genotype] of Object.entries(userSnps)) {
    if (genotype === '--' || genotype.length !== 2) continue;
    
    const marker = referenceData[rsid];
    if (!marker) continue;

    markersUsed++;

    for (const pop of SUPER_POPS) {
      const freq = getSuperPopFreq(rsid, genotype, pop);
      // Use a floor for frequency to avoid -Infinity log
      scores[pop] += Math.log(Math.max(0.0001, freq));
    }
  }

  // Convert Log scores back to percentages using a Softmax function
  const values = Object.values(scores);
  if (values.length === 0 || markersUsed === 0) {
    return { results: {}, confidence: "None", markersAnalyzed: 0 };
  }

  const maxScore = Math.max(...values);
  let totalProbability = 0;
  const probabilities: Record<string, number> = {};

  for (const pop of SUPER_POPS) {
    const prob = Math.exp(scores[pop] - maxScore);
    probabilities[pop] = prob;
    totalProbability += prob;
  }

  const finalPercentages: Record<string, number> = {};
  for (const pop of SUPER_POPS) {
    const percentage = (probabilities[pop] / totalProbability) * 100;
    if (percentage >= 0.1) {
      finalPercentages[pop] = Number(percentage.toFixed(2));
    }
  }

  return {
    results: finalPercentages,
    confidence: markersUsed > 100 ? "High" : markersUsed > 30 ? "Medium" : "Low",
    markersAnalyzed: markersUsed
  };
}
