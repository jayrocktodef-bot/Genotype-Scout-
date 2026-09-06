import { LineageAnalysis } from '../types/haplogroup';
import { isPotentialNumtLocus } from '../utils/genomicMasks';

export interface PhylotreeMutation {
  position: number;
  ancestral: string;
  derived: string;
  rawString: string;
  isTransversion: boolean;
  isHotspot: boolean;
  isNumtProne: boolean;
  weight: number;
}

export interface PhylotreeBranch {
  branchName: string;
  mutations: string[];
}

// Known hypervariable & homoplastic mutational hotspots (HaploGrep 2 / 3 consensus)
export const MTDNA_MUTATION_HOTSPOTS = new Set<number>([
  146, 152, 195, 309, 315, 524, 525, 16182, 16183, 16189, 16311, 16519
]);

/**
 * Parses mutation string like "G263A", "C1048T", "A263G!", "315.1C", "524-525d"
 */
export function parseMtMutation(raw: string): PhylotreeMutation | null {
  const clean = raw.trim().replace('!', '');
  
  // Format: RefPosAlt (e.g. G263A or C16188G)
  const match = clean.match(/^([ACGT])(\d+)([ACGT])$/i);
  if (match) {
    const ancestral = match[1].toUpperCase();
    const pos = parseInt(match[2], 10);
    const derived = match[3].toUpperCase();

    // Check transition vs transversion
    const isTransition = (ancestral === 'A' && derived === 'G') || (ancestral === 'G' && derived === 'A') ||
                         (ancestral === 'C' && derived === 'T') || (ancestral === 'T' && derived === 'C');

    const isHotspot = MTDNA_MUTATION_HOTSPOTS.has(pos);
    const isNumtProne = isPotentialNumtLocus(pos);

    let weight = isTransition ? 1.0 : 4.5;
    if (isHotspot) {
      weight *= 0.35; // Dampen hypervariable mutational hotspots
    }
    if (isNumtProne) {
      weight *= 0.65; // Protect against autosomal NUMT pseudogene cross-hybridization
    }

    return {
      position: pos,
      ancestral,
      derived,
      rawString: raw,
      isTransversion: !isTransition,
      isHotspot,
      isNumtProne,
      weight
    };
  }

  // Fallback for indels / deletions (e.g. 524d)
  const indelMatch = clean.match(/^(\d+)/);
  if (indelMatch) {
    const pos = parseInt(indelMatch[1], 10);
    const isHotspot = MTDNA_MUTATION_HOTSPOTS.has(pos);
    const isNumtProne = isPotentialNumtLocus(pos);
    return {
      position: pos,
      ancestral: '-',
      derived: '+',
      rawString: raw,
      isTransversion: true,
      isHotspot,
      isNumtProne,
      weight: isHotspot ? 0.8 : (isNumtProne ? 1.5 : 2.5)
    };
  }

  return null;
}

export interface MtDnaMatchScore {
  branchName: string;
  score: number;
  matchedCount: number;
  totalMutations: number;
  matchedMutations: string[];
  transversionsMatched: number;
  nonNumtMatchedCount: number;
  pathConsistencyPct: number;
}

/**
 * Evaluates user's mtDNA mutations against Van Oven PhyloTree Build 17
 * Applies 4.5x weight to transversions, dampens hotspots, and penalizes ancestral clashes.
 */
export function matchPhyloTreeBuild17(
  userPosMap: Record<number, string>, // pos -> userGenotype
  branches: PhylotreeBranch[]
): MtDnaMatchScore[] {
  const results: MtDnaMatchScore[] = [];

  for (const branch of branches) {
    let score = 0;
    let matchedCount = 0;
    let ancestralClashCount = 0;
    let nonNumtMatchedCount = 0;
    let transversionsMatched = 0;
    const matchedMutations: string[] = [];

    for (const rawMut of branch.mutations) {
      const parsed = parseMtMutation(rawMut);
      if (!parsed) continue;

      const userAllele = userPosMap[parsed.position];
      if (!userAllele || userAllele === '--' || userAllele === '00' || userAllele === '??') {
        continue;
      }

      const u = userAllele.toUpperCase();
      if (u.includes(parsed.derived)) {
        matchedCount++;
        if (!parsed.isNumtProne) {
          nonNumtMatchedCount++;
        }
        score += parsed.weight;
        matchedMutations.push(rawMut);
        if (parsed.isTransversion) {
          transversionsMatched++;
        }
      } else if (u.includes(parsed.ancestral)) {
        ancestralClashCount++;
        // Ancestral observation: slight negative pressure for deeply nested branches
        score -= parsed.isHotspot ? 0.2 : 0.6;
      }
    }

    if (matchedCount > 0) {
      const totalObserved = matchedCount + ancestralClashCount;
      const pathConsistencyPct = totalObserved > 0
        ? Math.max(0, Math.round(((matchedCount - (ancestralClashCount * 0.5)) / totalObserved) * 100))
        : 0;

      results.push({
        branchName: branch.branchName,
        score,
        matchedCount,
        totalMutations: branch.mutations.length,
        matchedMutations,
        transversionsMatched,
        nonNumtMatchedCount,
        pathConsistencyPct
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

/**
 * Dynamically refines maternal lineage if Build 17 discovers a deeper confirmed sub-branch
 */
export function refineMtdnaWithBuild17(
  currentLineage: LineageAnalysis,
  deepMatches: MtDnaMatchScore[]
): LineageAnalysis {
  if (!deepMatches || deepMatches.length === 0 || !currentLineage.terminalHaplogroup) {
    return currentLineage;
  }

  const top = deepMatches[0];
  const currentCode = currentLineage.terminalHaplogroup.code;

  // Broad descendant and macro-haplogroup relationship check
  const isDescendant =
    top.branchName.startsWith(currentCode) ||
    (currentCode === 'L3' && (top.branchName.startsWith('M') || top.branchName.startsWith('N'))) ||
    (currentCode === 'N' && (top.branchName.startsWith('R') || top.branchName.startsWith('A') || top.branchName.startsWith('I') || top.branchName.startsWith('W') || top.branchName.startsWith('X') || top.branchName.startsWith('Y'))) ||
    (currentCode === 'R' && (top.branchName.startsWith('H') || top.branchName.startsWith('V') || top.branchName.startsWith('U') || top.branchName.startsWith('K') || top.branchName.startsWith('J') || top.branchName.startsWith('T') || top.branchName.startsWith('B') || top.branchName.startsWith('F'))) ||
    (currentCode === 'HV' && (top.branchName.startsWith('H') || top.branchName.startsWith('V'))) ||
    (currentCode === 'JT' && (top.branchName.startsWith('J') || top.branchName.startsWith('T'))) ||
    (currentCode === 'U' && top.branchName.startsWith('K'));

  const coveragePct = Math.round((top.matchedCount / Math.max(1, top.totalMutations)) * 100);

  // Guard: require at least one non-NUMT derived mutation and >= 40% path consistency
  if (isDescendant && top.score >= 1.5 && top.matchedCount >= 1 && top.nonNumtMatchedCount >= 1 && top.pathConsistencyPct >= 40) {
    const existingNovel = currentLineage.novelOrUntestedMarkers || [];
    return {
      ...currentLineage,
      terminalHaplogroup: {
        ...currentLineage.terminalHaplogroup,
        code: top.branchName,
        shortName: `mtDNA-${top.branchName}`,
        cladeName: `PhyloTree-${top.branchName}`,
        historicalDescription: `Deep maternal subclade confirmed via ${top.matchedCount} PhyloTree Build 17 mutations (${coveragePct}% coverage).`
      },
      confidenceScore: Math.min(99, Math.max(currentLineage.confidenceScore, Math.round(Math.min(99, 80 + top.score * 5)))),
      coverage: coveragePct,
      novelOrUntestedMarkers: Array.from(new Set([...existingNovel, ...top.matchedMutations]))
    };
  }

  return currentLineage;
}
