import mtHaploData from '../data/mt_haplogroups.json';

export interface MtHaplogroupBranch {
  branchName: string;
  mutations: string[];
}

export const MT_HAPLOGROUP_DB = mtHaploData as MtHaplogroupBranch[];

/**
 * Finds mtDNA haplogroup matches based on user mutations.
 * Unlike Y-DNA which uses SNPs, mtDNA primarily uses mutations relative to a reference.
 */
export function findMatchesInMtHaplogroups(userMutations: string[]) {
  const matches: { branch: MtHaplogroupBranch, matches: string[] }[] = [];
  
  for (const branch of MT_HAPLOGROUP_DB) {
    const branchMatches: string[] = [];
    
    for (const mutation of branch.mutations) {
      if (userMutations.includes(mutation)) {
        branchMatches.push(mutation);
      }
    }
    
    // We expect a significant number of matches for a branch to be considered a match
    // especially for deeper branches
    if (branchMatches.length > 0) {
      matches.push({ branch, matches: branchMatches });
    }
  }
  
  return matches;
}

export function searchMtHaplogroupTree(term: string) {
  if (!term || term.length < 2) return [];
  const search = term.toLowerCase();
  
  return MT_HAPLOGROUP_DB.filter(h => 
    h.branchName.toLowerCase().includes(search) || 
    h.mutations.some(m => m.toLowerCase().includes(search))
  );
}
