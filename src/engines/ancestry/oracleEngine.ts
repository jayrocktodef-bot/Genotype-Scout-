import { solveAdmixtureProportions } from '../../components/ancestryOracleLogic';

export function runAncestryOracle(userCoords: number[], refDataset: any[]) {
  // Logic: Use NNLS to calculate ancestry proportions
  const userDosages = new Float32Array(userCoords);
  const popExpectedDosages: Record<string, Float32Array> = {};
  
  refDataset.forEach(ref => {
    popExpectedDosages[ref.name] = new Float32Array(ref.coords);
  });

  const aimWeights = new Float32Array(userCoords.length).fill(1.0); // Default weights

  const admixtureProportions = solveAdmixtureProportions(userDosages, popExpectedDosages, aimWeights);
  
  return Object.entries(admixtureProportions)
    .map(([population, percentage]) => ({ population, percentage }))
    .sort((a: any, b: any) => b.percentage - a.percentage);
}
