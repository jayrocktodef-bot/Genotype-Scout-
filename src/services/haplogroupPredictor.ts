import { HaplogroupNode } from '../types/genotype';
import { SNP_LOOKUP } from '../data/snpDatabase';
import { Y_DNA_TREE, MT_DNA_TREE } from '../constants/haplogroups';
import { getMarkerDescription } from './snpMatcher';

export function predictYDNAHaplogroup(yMap: Record<string, string>, rootNode: HaplogroupNode = Y_DNA_TREE) {
  const testedMarkers: any[] = [];
  let bestNode: any = null;
  let bestPath: string[] = [];
  let maxDerivedCount = -1;

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

  return {
    predicted: bestNode && bestNode.branchName !== "Y-DNA Root (Adam)" ? {
      name: bestNode.branchName.replace("Haplogroup ", ""),
      marker: bestNode.snp ? bestNode.snp[0] : "Unknown",
      continent: bestNode.region || "Global",
      description: bestNode.description || `A paternal lineage characterized by the ${bestNode.snp?.[0] || 'specific'} marker.`
    } : null,
    testedMarkers: uniqueMarkers.sort((a, b) => (b.isDerived ? 1 : 0) - (a.isDerived ? 1 : 0)),
    path: bestPath
  };
}

export function predictMtHaplogroup(userMutations: string[], mtMap: Record<string, string>, currentNode: any, currentPath: string[] = [], currentScore: number = 0): any[] {
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
  
  let results = [{
    name: currentNode.branchName,
    score: newScore,
    path: newPath,
    matchCount: matches,
    mismatchCount: mismatches,
    region: currentNode.region,
    description: currentNode.description
  }];

  if (currentNode.children) {
    for (const child of currentNode.children) {
      results = results.concat(predictMtHaplogroup(userMutations, mtMap, child, newPath, newScore));
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
    const mtMatch = mutation.match(/^([A-Z])(\d+)([A-Za-z])$/);
    if (!mtMatch) return;

    const ancestral = mtMatch[1];
    const pos = mtMatch[2];
    const derived = mtMatch[3];
    
    const userAllele = mtMap[pos];
    
    if (derived.toLowerCase() === 'd') {
      if (userAllele === '-' || userAllele === 'D' || !userAllele) {
        userMutations.push(mutation);
        testedMarkers.push({ mutation, pos, derived, ancestral, status: 'derived', description: getMarkerDescription(mutation) });
      } else if (userAllele === ancestral) {
        testedMarkers.push({ mutation, pos, derived, ancestral, status: 'ancestral', description: getMarkerDescription(mutation) });
      }
      return;
    }

    if (userAllele && userAllele.toUpperCase() === derived.toUpperCase()) {
      userMutations.push(mutation);
      testedMarkers.push({ mutation, pos, derived, ancestral, status: 'derived', description: getMarkerDescription(mutation) });
    } else if (userAllele && userAllele.toUpperCase() === ancestral.toUpperCase()) {
      testedMarkers.push({ mutation, pos, derived, ancestral, status: 'ancestral', description: getMarkerDescription(mutation) });
    }
  });

  const allResults = predictMtHaplogroup(userMutations, mtMap, MT_DNA_TREE);
  
  allResults.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.path.length - a.path.length;
  });

  const bestMatch = allResults[0];
  const predictedHaplogroup = bestMatch.name;
  
  return {
    predicted: predictedHaplogroup !== "mtDNA Root (Mitochondrial Eve)" && predictedHaplogroup !== "mtDNA Root (Eve)" ? predictedHaplogroup : null,
    path: predictedHaplogroup !== "mtDNA Root (Mitochondrial Eve)" && predictedHaplogroup !== "mtDNA Root (Eve)" ? bestMatch.path : [],
    region: bestMatch.region || "Global",
    description: bestMatch.description || "",
    testedMarkers,
    userMutations,
    score: bestMatch.score
  };
}
