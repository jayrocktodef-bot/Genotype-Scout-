/**
 * Calculates a simple genetic distance based on allele frequency differences.
 * Sum of Squared Differences (SSD).
 */
export const calculateGeneticDistance = (userSnps: Record<string, string>, popFrequencies: Record<string, number>): number => {
  let distance = 0;
  let count = 0;

  Object.entries(popFrequencies).forEach(([rsid, freq]) => {
    if (userSnps[rsid]) {
      // Simplified: assume AA=0, AG=0.5, GG=1 for reference mapping
      // Note: We should ideally know which allele is the reference in the frequency data.
      // For this lightweight version, we assume the frequency is for the 'G' or 'A' allele consistently.
      const userVal = userSnps[rsid] === 'AA' ? 0 : userSnps[rsid] === 'AG' ? 0.5 : 1;
      distance += Math.pow(userVal - freq, 2);
      count++;
    }
  });

  return count > 0 ? Math.sqrt(distance / count) : 1.0;
};
