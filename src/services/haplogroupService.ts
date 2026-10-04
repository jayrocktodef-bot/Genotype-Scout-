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

function resolve(userSnpMap: Record<string, string>, key: string, snpByPosition?: Record<string, string>, userBuild?: string): { geno?: string; snpInfo?: any } {
  const lower = key.toLowerCase();
  const base = lower.split('_')[0];
  let geno = userSnpMap[lower] ?? userSnpMap[base];
  const snpInfo = SNP_LOOKUP.get(lower) ?? SNP_LOOKUP.get(base);
  if (!geno && snpInfo) {
    let build = (userBuild || (userSnpMap as any)?.__build)?.toUpperCase();
    if (!build && snpByPosition) {
      for (const k of Object.keys(snpByPosition)) {
        if (k.startsWith('grch38:')) { build = 'GRCH38'; break; }
        if (k.startsWith('grch37:')) { build = 'GRCH37'; break; }
      }
    }

    if (build === 'GRCH38') {
      const p = snpInfo.posHg38 || (snpInfo.build === 'GRCh38' ? snpInfo.pos : undefined);
      if (p) {
        const pStr = String(p);
        geno =
          snpByPosition?.[`grch38:chry:${pStr}`] ||
          snpByPosition?.[`grch38:chrY:${pStr}`] ||
          snpByPosition?.[`grch38:y:${pStr}`] ||
          snpByPosition?.[`grch38:Y:${pStr}`] ||
          snpByPosition?.[`grch38:chrY_${pStr}`] ||
          userSnpMap[`grch38:chry:${pStr}`] ||
          userSnpMap[`grch38:y:${pStr}`] ||
          (snpByPosition?.[`y:${pStr}`] || snpByPosition?.[`Y:${pStr}`] || snpByPosition?.[`chry:${pStr}`] || snpByPosition?.[pStr] || userSnpMap[`y:${pStr}`] || userSnpMap[`chry:${pStr}`] || userSnpMap[pStr]);
      }
    } else if (build === 'GRCH37') {
      const p = snpInfo.posHg19 || (snpInfo.build === 'GRCh37' ? snpInfo.pos : undefined);
      if (p) {
        const pStr = String(p);
        geno =
          snpByPosition?.[`grch37:chry:${pStr}`] ||
          snpByPosition?.[`grch37:chrY:${pStr}`] ||
          snpByPosition?.[`grch37:y:${pStr}`] ||
          snpByPosition?.[`grch37:Y:${pStr}`] ||
          snpByPosition?.[`grch37:chrY_${pStr}`] ||
          userSnpMap[`grch37:chry:${pStr}`] ||
          userSnpMap[`grch37:y:${pStr}`] ||
          (snpByPosition?.[`y:${pStr}`] || snpByPosition?.[`Y:${pStr}`] || snpByPosition?.[`chry:${pStr}`] || snpByPosition?.[pStr] || userSnpMap[`y:${pStr}`] || userSnpMap[`chry:${pStr}`] || userSnpMap[pStr]);
      }
    } else if (!build) {
      const positions = [snpInfo.pos, snpInfo.posHg38, snpInfo.posHg19].filter(Boolean);
      for (const p of positions) {
        const pStr = String(p);
        geno = userSnpMap[`y:${pStr}`] || userSnpMap[`chry:${pStr}`] || userSnpMap[pStr];
        if (!geno && snpByPosition) {
          geno = snpByPosition[`y:${pStr}`] || snpByPosition[`Y:${pStr}`] || snpByPosition[`chry:${pStr}`] || snpByPosition[pStr];
        }
        if (geno) break;
      }
    }
  }
  return { geno, snpInfo };
}

/**
 * Allele-aware ISOGG branch matcher. A branch only earns "derived" credit when the
 * user actually carries the mutation (derived allele) at a defining SNP -- not merely
 * because the position was present on the chip.
 */
export function findMatchesInHaplogroups(
  userSnpMap: Record<string, string>,
  snpByPosition?: Record<string, string>,
  userBuild?: string
): IsoggMatch[] {
  const matches: IsoggMatch[] = [];

  for (const branch of HAPLOGROUP_DB) {
    const tested = new Set<string>();
    const derivedMatches = new Set<string>();
    let ancestralCount = 0;

    for (const key of [...(branch.rsids || []), ...(branch.definingSNPs || [])]) {
      if (!key) continue;
      const { geno, snpInfo } = resolve(userSnpMap, key, snpByPosition, userBuild);
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
