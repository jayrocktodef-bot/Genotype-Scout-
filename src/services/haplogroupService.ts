import haploDataRaw from '../data/haplogroups/parsed_haplogroups.json?raw';
const haploData = JSON.parse(haploDataRaw);

export interface IsoggBranch {
  branchName: string;
  definingSNPs: string[];
  rsids: string[];
}

export const HAPLOGROUP_DB = haploData as IsoggBranch[];

export function findMatchesInHaplogroups(userSnpMap: Record<string, string>) {
  const matches: { branch: IsoggBranch, matches: string[] }[] = [];
  
  for (const branch of HAPLOGROUP_DB) {
    const branchMatches: string[] = [];
    
    // Check rsids
    for (const rsid of branch.rsids) {
      if (userSnpMap[rsid.toLowerCase()]) {
        branchMatches.push(rsid);
      }
    }
    
    if (branchMatches.length > 0) {
      matches.push({ branch, matches: branchMatches });
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
