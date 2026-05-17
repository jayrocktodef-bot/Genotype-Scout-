export interface AIM {
  rsid: string;
  chromosome: string;
  subpop?: string;
  continent: string;
  alleles?: string; // Add alleles for robust matching
}

export interface UserGenotype {
  rsid: string;
  genotype: string;
}

export interface OracleResult {
  topMatch: string;
  subpopAimsUsed: number;
  unmappedAims: AIM[];
}

export function processSubpopulations(userGenotypes: UserGenotype[], aimsDatabase: AIM[]): OracleResult {
  const genotypeMap = new Map<string, string>();
  for (const g of userGenotypes) {
    genotypeMap.set(g.rsid.toLowerCase(), g.genotype);
  }

  const subpopCounts = new Map<string, number>();
  const unmappedAims: AIM[] = [];
  let subpopAimsUsed = 0;

  for (const aim of aimsDatabase) {
    const userGenotype = genotypeMap.get(aim.rsid.toLowerCase());
    
    if (userGenotype && userGenotype !== '--') {
      if (aim.subpop && aim.subpop !== 'General') {
        subpopCounts.set(aim.subpop, (subpopCounts.get(aim.subpop) || 0) + 1);
        subpopAimsUsed += 1;
      } else {
        unmappedAims.push(aim);
      }
    }
  }

  let topMatch = 'Unknown';
  let maxCount = 0;
  for (const [subpop, count] of subpopCounts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      topMatch = subpop;
    }
  }

  return {
    topMatch,
    subpopAimsUsed,
    unmappedAims
  };
}
