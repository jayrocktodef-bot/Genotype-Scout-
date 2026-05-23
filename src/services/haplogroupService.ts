import masterYdna from '../data/master_ydna.json';

export interface IsoggBranch {
  branchName: string;
  definingSNPs: string[];
  rsids: string[];
}

export const HAPLOGROUP_DB = masterYdna.isoggTree as IsoggBranch[];

export function findMatchesInHaplogroups(userSnpMap: Record<string, string>) {
  const matches: { branch: IsoggBranch, matches: string[] }[] = [];
  
  for (const branch of HAPLOGROUP_DB) {
    const branchMatches: Set<string> = new Set();
    
    // Check rsids
    for (const rsid of branch.rsids) {
      const rsidLower = rsid.toLowerCase();
      const baseRsid = rsidLower.split('_')[0];
      
      if (userSnpMap[rsidLower]) {
        branchMatches.add(rsidLower);
      } else if (userSnpMap[baseRsid]) {
        branchMatches.add(baseRsid);
      }
    }

    // Check definingSNPs
    for (const snp of branch.definingSNPs) {
      const snpLower = snp.toLowerCase();
      if (userSnpMap[snpLower]) {
        branchMatches.add(snpLower);
      }
    }
    
    if (branchMatches.size > 0) {
      matches.push({ branch, matches: Array.from(branchMatches) });
    }
  }
  
  return matches;
}

export function searchHaplogroupTree(term: string) {
  if (!term || term.length < 2) return [];
  const search = term.toLowerCase();
  
  return HAPLOGROUP_DB.filter(h => 
    h.branchName.toLowerCase().includes(search) || 
    h.definingSNPs.some(s => s.toLowerCase().includes(search)) ||
    h.rsids.some(r => r.toLowerCase().includes(search))
  );
}
