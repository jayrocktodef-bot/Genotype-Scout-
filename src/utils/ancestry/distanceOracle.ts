// src/utils/ancestry/distanceOracle.ts

export function calculateGeneticDistance(userCoords: number[], popCoords: number[]) {
  // Classic Euclidean Distance in N-dimensions
  const sumOfSquares = userCoords.reduce((sum: number, val: number, i: number) => {
    return sum + Math.pow(val - popCoords[i], 2);
  }, 0);
  
  return Math.sqrt(sumOfSquares);
}

export function rankPopulations(userCoords: number[], referenceDatabase: any[]) {
  return referenceDatabase.map((pop: any) => ({
    name: pop.name,
    distance: calculateGeneticDistance(userCoords, pop.coordinates),
    fit: interpretDistance(calculateGeneticDistance(userCoords, pop.coordinates))
  })).sort((a: any, b: any) => a.distance - b.distance);
}

function interpretDistance(dist: number): string {
  if (dist < 0.015) return "Very Close";
  if (dist < 0.030) return "Close Match";
  if (dist < 0.050) return "Broad Relation";
  return "Distant";
}
