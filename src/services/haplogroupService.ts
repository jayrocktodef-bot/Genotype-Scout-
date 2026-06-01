import masterYdna from '../data/master_ydna.json';
import { SNP_LOOKUP } from '../data/snpDatabase';

export interface IsoggBranch {
  branchName: string;
  definingSNPs: string[];
  rsids: string[];
}

export interface IsoggMatch {
  branch: IsoggBranch;
  matches: string[];        // keys the user was tested for on this branch
  derivedMatches: string[]; // keys where the user carries the DERIVED (mutation) allele
  derivedCount: number;
  ancestralCount: number;
}

// Drop the converter's header/placeholder row (e.g. {branchName:"Subgroup Name", rsids:["rs numbers"]}).
export const HAPLOGROUP_DB = (masterYdna.isoggTree as IsoggBranch[]).filter(
  (b) => b && b.branchName && b.branchName !== 'Subgroup Name' && b.branchName.toLowerCase() !== 'name'
);

const NO_CALLS = new Set(['', '--', '00', '??', '.', 'II', 'DD', 'NN', 'I', 'D']);

/**
 * Classify a (haploid Y) genotype against a SNP's known derived allele(s).
 * Returns 'derived' | 'ancestral' | 'unknown'.
 * - Heterozygous calls are treated as 'unknown' (no-calls on a haploid chromosome).
 * - Without derived-allele metadata we cannot judge state -> 'unknown'.
 */
export function classifyYGenotype(genotype: string | undefined, snpInfo: any): 'derived' | 'ancestral' | 'unknown' {
  if (!genotype) return 'unknown';
  const g = genotype.toUpperCase();
  if (NO_CALLS.has(g)) return 'unknown';
  // Collapse homozygous (AA -> A); reject heterozygous (AG) as an unreliable no-call for haploid Y.
  let allele = g;
  if (g.length === 2) {
    if (g[0] !== g[1]) return 'unknown';
    allele = g[0];
  }
  if (allele.length !== 1) return 'unknown';
  const derived = (snpInfo?.alleles || []).map((a: string) => a.toUpperCase()).filter((a: string) => a.length === 1);
  if (derived.length === 0) return 'unknown'; // no derived-allele info available
  return derived.includes(allele) ? 'derived' : 'ancestral';
}

function resolve(userSnpMap: Record<string, string>, key: string): { geno?: string; snpInfo?: any } {
  const lower = key.toLowerCase();
  const base = lower.split('_')[0];
  const geno = userSnpMap[lower] ?? userSnpMap[base];
  const snpInfo = SNP_LOOKUP.get(lower) ?? SNP_LOOKUP.get(base);
  return { geno, snpInfo };
}

/**
 * Allele-aware ISOGG branch matcher. A branch only earns "derived" credit when the
 * user actually carries the mutation (derived allele) at a defining SNP -- not merely
 * because the position was present on the chip.
 */
export function findMatchesInHaplogroups(userSnpMap: Record<string, string>): IsoggMatch[] {
  const matches: IsoggMatch[] = [];

  for (const branch of HAPLOGROUP_DB) {
    const tested = new Set<string>();
    const derivedMatches = new Set<string>();
    let ancestralCount = 0;

    for (const key of [...(branch.rsids || []), ...(branch.definingSNPs || [])]) {
      if (!key) continue;
      const { geno, snpInfo } = resolve(userSnpMap, key);
      if (!geno) continue;
      const state = classifyYGenotype(geno, snpInfo);
      if (state === 'unknown') continue; // present but allele state unverifiable -> not counted
      tested.add(key.toLowerCase());
      if (state === 'derived') derivedMatches.add(key.toLowerCase());
      else ancestralCount++;
    }

    if (derivedMatches.size > 0) {
      matches.push({
        branch,
        matches: Array.from(tested),
        derivedMatches: Array.from(derivedMatches),
        derivedCount: derivedMatches.size,
        ancestralCount,
      });
    }
  }

  return matches;
}

export function searchHaplogroupTree(term: string) {
  if (!term || term.length < 2) return [];
  const search = term.toLowerCase();
  return HAPLOGROUP_DB.filter((h) =>
    h.branchName.toLowerCase().includes(search) ||
    h.definingSNPs.some((s) => s.toLowerCase().includes(search)) ||
    h.rsids.some((r) => r.toLowerCase().includes(search))
  );
}
