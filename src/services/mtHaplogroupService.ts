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
  const matches: { branch: MtHaplogroupBranch, matches: string[], similarity: number }[] = [];
  
  for (const branch of MT_HAPLOGROUP_DB) {
    const branchMatches = branch.mutations.filter(m => userMutations.includes(m));
    
    if (branchMatches.length > 0) {
      // Calculate Jaccard similarity to improve accuracy
      const unionSize = new Set([...userMutations, ...branch.mutations]).size;
      const similarity = branchMatches.length / Math.max(userMutations.length, branch.mutations.length); // Use a modified Jaccard to reward branch coverage
      
      matches.push({ branch, matches: branchMatches, similarity });
    }
  }
  
  // Sort matches by similarity score descending
  return matches.sort((a,b) => b.similarity - a.similarity);
}

export function searchMtHaplogroupTree(term: string) {
  if (!term || term.length < 2) return [];
  const search = term.toLowerCase();
  
  return MT_HAPLOGROUP_DB.filter(h => 
    h.branchName.toLowerCase().includes(search) || 
    h.mutations.some(m => m.toLowerCase().includes(search))
  );
}
