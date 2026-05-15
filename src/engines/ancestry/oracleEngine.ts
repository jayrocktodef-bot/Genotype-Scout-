export function runAncestryOracle(userCoords: number[], refDataset: any[]) {
  // Logic: Find the 'K' populations with the smallest Euclidean distance
  const distances = refDataset.map(ref => {
    const dist = Math.sqrt(
      ref.coords.reduce((sum: number, val: number, i: number) => sum + Math.pow(val - userCoords[i], 2), 0)
    );
    return { population: ref.name, distance: dist };
  });

  // Sort by closest genetic match
  return distances.sort((a: any, b: any) => a.distance - b.distance).slice(0, 10);
}
