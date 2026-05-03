import africa from '../data/ancestry/africa.json';
import americas from '../data/ancestry/americas.json';
import europe from '../data/ancestry/europe.json';
import eastAsia from '../data/ancestry/east-asia.json';
import southAsia from '../data/ancestry/south-asia.json';
import oceania from '../data/ancestry/oceania.json';

const POPULATIONS = {
  AFR: africa,
  AMR: americas,
  EUR: europe,
  EAS: eastAsia,
  SAS: southAsia,
  OCN: oceania,
};

export interface Genotype {
  rsid: string;
  genotype: string; // "AA", "AG", etc., or "0", "1", "2"
}

// Convert genotype to frequency (0.0, 0.5, 1.0)
const genotypeToFreq = (genotype: any, referenceAllele: string): number | null => {
  if (typeof genotype !== 'string') return null;
  if (genotype === "0" || genotype === "1" || genotype === "2") return parseInt(genotype) / 2.0;

  // Assuming biallelic for simplicity if not 0/1/2
  const count = (genotype.match(new RegExp(referenceAllele, 'g')) || []).length;
  return count / 2.0;
};

export const calculateGeneticDistances = (userGenotypes: Genotype[]) => {
  const distances: Record<string, number> = {};

  Object.entries(POPULATIONS).forEach(([popCode, markers]) => {
    let sumSquaredDiff = 0;
    let markerCount = 0;

    markers.forEach((marker: any) => {
      const userMatch = userGenotypes.find(g => g.rsid === marker.rsid);
      if (userMatch && marker.frequencies[popCode] !== undefined) {
        const userFreq = genotypeToFreq(userMatch.genotype, marker.alleles[0]);
        const popFreq = marker.frequencies[popCode];
        if (userFreq !== null) {
          sumSquaredDiff += Math.pow(userFreq - popFreq, 2);
          markerCount++;
        }
      }
    });


    if (markerCount > 0) {
      distances[popCode] = Math.sqrt(sumSquaredDiff / markerCount);
    }
  });

  return distances;
};
