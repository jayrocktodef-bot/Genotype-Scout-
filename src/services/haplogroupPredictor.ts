import { HaplogroupNode } from '../types/genotype';
import { SNP_LOOKUP } from '../data/snpDatabase';
import { Y_DNA_TREE, MT_DNA_TREE } from '../constants/haplogroups';
import { getMarkerDescription } from './snpMatcher';
import { findMatchesInHaplogroups } from './haplogroupService';
import { findMatchesInMtHaplogroups } from './mtHaplogroupService';
import { analyzePhase2YDna, formatPhase2Result } from './phase2YDnaAdapter';
import { getHaplogroupDetails } from '../utils/haplogroupDetails';

export interface YDnaAnalysisResult {
  predicted: { name: string; marker: string; continent: string; description: string } | null;
  isoggMatches: any[];
  testedMarkers: any[];
  path: string[];
  phase2?: {
    haplogroup: string;
    confidence: number;
    coverage: number;
    derivedMarkers: number;
    ancestralMarkers: number;
    rejectedBranches: string[];
    region?: string;
    description?: string;
  };
}

export function predictYDNAHaplogroup(yMap: Record<string, string>, rootNode: HaplogroupNode = Y_DNA_TREE): YDnaAnalysisResult {
  const testedMarkers: any[] = [];
  let bestNode: any = null;
  let bestPath: string[] = [];
  let maxDerivedCount = -1;

  // Deep ISOGG matches
  const isoggMatches = findMatchesInHaplogroups(yMap);
  
  // Sort ISOGG matches by specificity (branch name length as proxy for depth)
  // and match count, prioritizing deeper subclades
  const sortedIsogg = [...isoggMatches].sort((a, b) => {
    // 1. More allele-CONFIRMED derived markers is better (true evidence, not mere presence).
    if (b.derivedCount !== a.derivedCount) {
      return b.derivedCount - a.derivedCount;
    }
    // 2. Fewer contradicting ancestral calls is better.
    if (a.ancestralCount !== b.ancestralCount) {
      return a.ancestralCount - b.ancestralCount;
    }
    // 3. Tie-break on branch depth (dot-count) rather than raw name length.
    const depth = (n: string) => (n.match(/\d|[a-z]/g) || []).length;
    return depth(b.branch.branchName) - depth(a.branch.branchName);
  });

  const topIsogg = sortedIsogg[0];

  function getNodeStats(node: HaplogroupNode) {
    let pos = 0;
    let neg = 0;
    let total = 0;
    const markers: any[] = [];

    const IUPAC_MAP: Record<string, string> = {
      'R': 'AG', 'Y': 'CT', 'S': 'GC', 'W': 'AT', 'K': 'GT', 'M': 'AC',
      'B': 'CGT', 'D': 'AGT', 'H': 'ACT', 'V': 'ACG', 'N': 'ACGT'
    };

    if (node.snp) {
      for (const snpId of node.snp) {
        if (!snpId) continue;
        const snpIdLower = snpId.toLowerCase();
        const snpInfo = SNP_LOOKUP.get(snpIdLower);
        let genotype = yMap[snpIdLower];
        
        if (!genotype && snpInfo) {
          const keysToCheck = [
            snpInfo.markerId,
            snpInfo.rsid,
            ...(snpInfo.aliases || [])
          ].filter(Boolean) as string[];

          for (const k of keysToCheck) {
            const val = yMap[k.toLowerCase()];
            if (val) {
              genotype = val;
              break;
            }
          }
        }

        if (!genotype || genotype === '--' || genotype === '00' || genotype === '??' || genotype === '.') {
          continue;
        }

        let normalized = genotype.toUpperCase();
        if (normalized.length === 2 && normalized[0] === normalized[1]) {
          normalized = normalized[0];
        } else if (normalized.length === 1 && IUPAC_MAP[normalized]) {
          normalized = IUPAC_MAP[normalized];
        }

        // Y-DNA is haploid: a heterozygous call is an unreliable no-call, skip it.
        if (normalized.length === 2 && normalized[0] !== normalized[1]) {
          continue;
        }
        
        let isDerived = false;
        let isTested = false;

        if (snpInfo) {
          isTested = true;
          for (const derivedAllele of snpInfo.alleles) {
            const da = derivedAllele.toUpperCase();
            if (normalized.includes(da)) {
              isDerived = true;
              break;
            }
          }
        }

        if (isTested) {
          total++;
          if (isDerived) pos++;
          else neg++;
          
          markers.push({
            marker: snpId,
            genotype: genotype,
            isDerived,
            trait: `Marker for ${node.branchName}`,
            branch: node.branchName,
            region: node.region || "Global",
            description: getMarkerDescription(snpId)
          });
        }
      }
    }
    return { pos, neg, total, markers };
  }

  function walk(node: HaplogroupNode, path: string[] = [], cumulativeDerived = 0, cumulativeAncestral = 0) {
    const { pos, neg, markers } = getNodeStats(node);
    testedMarkers.push(...markers);

    const currentPath = [...path, node.branchName];
    const currentDerived = cumulativeDerived + pos;
    const currentAncestral = cumulativeAncestral + neg;

    const isStronglyNegative = neg > pos && neg > 0;
    
    if (!isStronglyNegative) {
      if (currentDerived > maxDerivedCount || (currentDerived === maxDerivedCount && currentPath.length > bestPath.length)) {
        if (pos > 0 || node.branchName === "Y-DNA Root (Adam)") {
          bestNode = node;
          bestPath = currentPath;
          maxDerivedCount = currentDerived;
        }
      }

      if (node.children) {
        for (const child of node.children) {
          walk(child, currentPath, currentDerived, currentAncestral);
        }
      }
    }
  }

  walk(rootNode);

  const uniqueMarkers = Array.from(new Map(testedMarkers.map(m => [m.marker, m])).values());

  let prediction = null;
  if (bestNode && bestNode.branchName !== "Y-DNA Root (Adam)") {
    const details = getHaplogroupDetails(bestNode.branchName, false);
    prediction = {
      name: bestNode.branchName.replace("Haplogroup ", ""),
      marker: bestNode.snp ? bestNode.snp[0] : "Unknown",
      continent: details.region,
      description: details.description
    };
  }

  // If we have a very specific ISOGG match that is deeper than our basic tree prediction
  // or if we have no basic tree prediction, use ISOGG.
  let finalPath = bestPath;
  // Only let an ISOGG deep-match become the terminal call when it is ALLELE-CONFIRMED
  // (>=2 derived markers) AND carries more confirmed-derived evidence than the curated
  // tree path. The old logic overrode on mere SNP *presence* + branch-name length, which
  // produced false, over-deep haplogroups.
  const ISOGG_MIN_DERIVED = 2;
  if (
    topIsogg &&
    topIsogg.derivedCount >= ISOGG_MIN_DERIVED &&
    topIsogg.derivedCount > Math.max(0, maxDerivedCount)
  ) {
    const details = getHaplogroupDetails(topIsogg.branch.branchName, false);
    prediction = {
      name: topIsogg.branch.branchName,
      marker: topIsogg.derivedMatches[0] || topIsogg.branch.definingSNPs[0] || topIsogg.branch.rsids[0] || "Unknown",
      continent: details.region,
      description: details.description || `Deep subclade confirmed via ${topIsogg.derivedCount} derived ISOGG markers: ${topIsogg.derivedMatches.join(', ')}.`
    };
    // Ensure the final predicted branch is in the path
    if (!finalPath.includes(prediction.name) && !finalPath.includes("Haplogroup " + prediction.name)) {
      finalPath = [...finalPath, prediction.name];
    }
  }

  // === PHASE 2: Run enriched Y-phylotree analysis ===
  let phase2Result: any = null;
  try {
    const phase2Analysis = analyzePhase2YDna(yMap);
    if (phase2Analysis) {
      phase2Result = formatPhase2Result(phase2Analysis);
      
      // Log Phase 2 findings
      console.log(`[Phase 2] Haplogroup: ${phase2Result.haplogroup}, Confidence: ${phase2Result.confidence}%, Coverage: ${phase2Result.coverage}%`);
      if (phase2Result.rejectedBranches.length > 0) {
        console.log(`[Phase 2] Rejected branches (ancestral SNPs): ${phase2Result.rejectedBranches.join(', ')}`);
      }
    }
  } catch (e) {
    console.warn('[Phase 2] Analysis failed, continuing with Phase 1 results:', e);
  }

  return {
    predicted: prediction,
    isoggMatches: sortedIsogg.slice(0, 100), // Cap at 100 deep matches
    testedMarkers: uniqueMarkers.sort((a, b) => (b.isDerived ? 1 : 0) - (a.isDerived ? 1 : 0)),
    path: finalPath,
    phase2: phase2Result
  };
}

export function predictMtHaplogroup(
  userMutations: string[], 
  mtMap: Record<string, string>, 
  currentNode: any, 
  currentPath: string[] = [], 
  currentScore: number = 0,
  cumulativeMatches: number = 0,
  cumulativeMismatches: number = 0
): any[] {
  const nodeMutations = currentNode.mutations || [];
  let matches = 0;
  let mismatches = 0;

  nodeMutations.forEach((m: string) => {
    if (userMutations.includes(m)) {
      matches++;
    } else {
      const ancestral = m[0];
      const pos = m.slice(1, -1);
      if (mtMap[pos] === ancestral) {
        mismatches++;
      }
    }
  });

  const newScore = currentScore + matches - (mismatches * 0.5);
  const newPath = [...currentPath, currentNode.branchName];
  const newCumulativeMatches = cumulativeMatches + matches;
  const newCumulativeMismatches = cumulativeMismatches + mismatches;
  
  let results = [{
    name: currentNode.branchName,
    score: newScore,
    path: newPath,
    matchCount: newCumulativeMatches,
    mismatchCount: newCumulativeMismatches,
    region: currentNode.region,
    description: currentNode.description
  }];

  if (currentNode.children) {
    for (const child of currentNode.children) {
      results = results.concat(predictMtHaplogroup(
        userMutations, 
        mtMap, 
        child, 
        newPath, 
        newScore, 
        newCumulativeMatches, 
        newCumulativeMismatches
      ));
    }
  }

  return results;
}

export function analyzeMtDNA(mtMap: Record<string, string>) {
  const allMutations = new Set<string>();
  function extractMutations(node: any) {
    if (node.mutations) {
      node.mutations.forEach((m: string) => allMutations.add(m));
    }
    if (node.children) {
      node.children.forEach((child: any) => extractMutations(child));
    }
  }
  extractMutations(MT_DNA_TREE);

  const userMutations: string[] = [];
  const testedMarkers: any[] = [];
  
  allMutations.forEach(mutation => {
    // 1. Clean the mutation representation for parsing
    // Strip trailing '!' or '!!'
    const cleanMutation = mutation.replace(/!+$/, '');

    // Case A: Standard Substitution (e.g., A263G, C3516a) or Single Deletion (e.g., C498d), or Abbreviated Substitution (e.g., 263G, 16111t)
    const subMatch = cleanMutation.match(/^([A-Z]?)(\d+)([A-Za-z])$/);
    if (subMatch) {
      const ancestral = subMatch[1] || '';
      const pos = subMatch[2];
      const derived = subMatch[3];
      const userAllele = mtMap[pos];

      if (derived.toLowerCase() === 'd') {
        // Single deletion represented as [Base][Pos]d
        if (userAllele === '-' || userAllele === 'D' || userAllele === 'd') {
          userMutations.push(mutation);
          testedMarkers.push({ mutation, pos, derived, ancestral, status: 'derived', description: getMarkerDescription(mutation) });
        } else if (userAllele && userAllele.toUpperCase() === ancestral.toUpperCase()) {
          testedMarkers.push({ mutation, pos, derived, ancestral, status: 'ancestral', description: getMarkerDescription(mutation) });
        }
      } else {
        if (userAllele && userAllele.toUpperCase() === derived.toUpperCase()) {
          userMutations.push(mutation);
          testedMarkers.push({ mutation, pos, derived, ancestral, status: 'derived', description: getMarkerDescription(mutation) });
        } else if (userAllele && userAllele.toUpperCase() === ancestral.toUpperCase()) {
          testedMarkers.push({ mutation, pos, derived, ancestral, status: 'ancestral', description: getMarkerDescription(mutation) });
        }
      }
      return;
    }

    // Case B: Range Deletion (e.g., 8281-8289d, 106-111d)
    const rangeMatch = cleanMutation.match(/^(\d+)-(\d+)d$/);
    if (rangeMatch) {
      const startPos = parseInt(rangeMatch[1], 10);
      const endPos = parseInt(rangeMatch[2], 10);
      
      let hasAncestralBase = false;
      let hasExplicitDeletion = false;

      for (let p = startPos; p <= endPos; p++) {
        const allele = mtMap[p.toString()];
        if (allele && allele !== '-' && allele !== 'D' && allele !== 'd') {
          hasAncestralBase = true;
          break;
        } else if (allele === '-' || allele === 'D' || allele === 'd') {
          hasExplicitDeletion = true;
        }
      }

      if (!hasAncestralBase && hasExplicitDeletion) {
        userMutations.push(mutation);
        testedMarkers.push({ mutation, pos: `${startPos}-${endPos}`, derived: 'd', ancestral: 'R', status: 'derived', description: getMarkerDescription(mutation) });
      } else if (hasAncestralBase) {
        testedMarkers.push({ mutation, pos: `${startPos}-${endPos}`, derived: 'd', ancestral: 'R', status: 'ancestral', description: getMarkerDescription(mutation) });
      }
      return;
    }

    // Case C: Insertion (e.g., 2491.1C, 455.2T, 8289.1CCCCCTCTACCCCCTCTA, 5899.1d!)
    const insMatch = cleanMutation.match(/^(\d+)\.(\d+)([A-Za-z]+)$/);
    if (insMatch) {
      const pos = insMatch[1];
      const subPos = insMatch[2];
      const insertedVal = insMatch[3];
      
      const userAllele1 = mtMap[pos];
      const userAllele2 = mtMap[`${pos}.${subPos}`];
      const userAllele = userAllele2 || userAllele1;

      if (insertedVal.toLowerCase() === 'd') {
        if (userAllele === '-' || userAllele === 'D' || userAllele === 'd') {
          userMutations.push(mutation);
          testedMarkers.push({ mutation, pos: `${pos}.${subPos}`, derived: 'd', ancestral: '', status: 'derived', description: getMarkerDescription(mutation) });
        } else if (userAllele) {
          testedMarkers.push({ mutation, pos: `${pos}.${subPos}`, derived: 'd', ancestral: '', status: 'ancestral', description: getMarkerDescription(mutation) });
        }
      } else {
        if (userAllele && (
          userAllele.toUpperCase() === insertedVal.toUpperCase() ||
          userAllele.toUpperCase().includes(insertedVal.toUpperCase()) ||
          userAllele === 'I' || userAllele === 'i'
        )) {
          userMutations.push(mutation);
          testedMarkers.push({ mutation, pos: `${pos}.${subPos}`, derived: insertedVal, ancestral: '', status: 'derived', description: getMarkerDescription(mutation) });
        } else if (userAllele === '-' || userAllele === 'D' || userAllele === 'd') {
          testedMarkers.push({ mutation, pos: `${pos}.${subPos}`, derived: insertedVal, ancestral: '', status: 'ancestral', description: getMarkerDescription(mutation) });
        }
      }
      return;
    }

    // Case D: XC / Custom Insertions (e.g., 573.XC, 5899.XC)
    const xcMatch = cleanMutation.match(/^(\d+)\.XC([A-Za-z]*)$/);
    const genericXcMatch = xcMatch || cleanMutation.match(/^(\d+)\.XC$/);
    if (genericXcMatch) {
      const pos = genericXcMatch[1];
      const userAllele = mtMap[pos] || mtMap[`${pos}.1`] || mtMap[`${pos}.XC`];

      if (userAllele && (
        userAllele.toUpperCase() === 'C' ||
        userAllele === 'I' || userAllele === 'i' ||
        userAllele.toUpperCase().includes('C')
      )) {
        userMutations.push(mutation);
        testedMarkers.push({ mutation, pos, derived: 'C', ancestral: '', status: 'derived', description: getMarkerDescription(mutation) });
      } else if (userAllele) {
        testedMarkers.push({ mutation, pos, derived: 'C', ancestral: '', status: 'ancestral', description: getMarkerDescription(mutation) });
      }
      return;
    }
  });

  const allResults = predictMtHaplogroup(userMutations, mtMap, MT_DNA_TREE);
  
  allResults.sort((a, b) => {
    // 1. Prioritize cumulative derived mutation matches to prevent untested sibling branches (L0/L1/L2) from winning over true paths
    if (b.matchCount !== a.matchCount) {
      return b.matchCount - a.matchCount;
    }
    // 2. Secondary sort by score (which factors in mismatch penalties)
    if (b.score !== a.score) return b.score - a.score;
    // 3. Tie-breaker: prefer the shallower path to avoid false-positive deep predictions
    return a.path.length - b.path.length;
  });

  // Deep search in the large mtHaplogroup database
  const deepMatches = findMatchesInMtHaplogroups(userMutations);
  const sortedDeep = [...deepMatches].sort((a, b) => {
    // Sort by number of matches primarily, then by branch name length (specificity)
    if (b.matches.length !== a.matches.length) {
      return b.matches.length - a.matches.length;
    }
    return b.branch.branchName.length - a.branch.branchName.length;
  });

  const bestMatch = allResults[0];
  let predictedHaplogroup = bestMatch.name;
  let finalPath = bestMatch.path;

  // If we found a more specific deep match with significant overlap
  if (sortedDeep.length > 0) {
    const topDeep = sortedDeep[0];
    // Require at least 2 shared mutations before a PhyloTree deep-match can override the
    // curated tree call (a single shared mutation is too weak / noise-prone).
    if (topDeep.matches.length >= 2 && topDeep.matches.length >= bestMatch.matchCount) {
      predictedHaplogroup = topDeep.branch.branchName;
      
      // Ensure the deep match is at the end of the path if it's not already there
      if (!finalPath.includes(predictedHaplogroup) && !finalPath.includes("Haplogroup " + predictedHaplogroup)) {
        finalPath = [...finalPath, predictedHaplogroup];
      }
    }
  }

  // Resolve details dynamically using the tree walk-up logic
  const details = getHaplogroupDetails(predictedHaplogroup, true);
  let region = details.region;
  let description = details.description;
  
  return {
    predicted: predictedHaplogroup !== "mtDNA Root (Mitochondrial Eve)" && predictedHaplogroup !== "mtDNA Root (Eve)" ? predictedHaplogroup : null,
    path: predictedHaplogroup !== "mtDNA Root (Mitochondrial Eve)" && predictedHaplogroup !== "mtDNA Root (Eve)" ? finalPath : [],
    region,
    description,
    testedMarkers,
    userMutations,
    score: bestMatch.score,
    deepMatches: sortedDeep.slice(0, 50)
  };
}
