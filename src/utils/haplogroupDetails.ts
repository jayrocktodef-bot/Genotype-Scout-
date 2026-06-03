import { Y_DNA_TREE, MT_DNA_TREE } from '../constants/haplogroups';
import { parentHaplogroup } from './yPhylotree';

// Cache maps for flattened trees
let yDnaMetadataMap: Map<string, { region: string; description: string; historicalContext?: string }> | null = null;
let mtDnaMetadataMap: Map<string, { region: string; description: string; historicalContext?: string }> | null = null;

function flattenHaploTree(node: any, map: Map<string, any>) {
  if (!node) return;
  if (node.branchName) {
    const cleanName = node.branchName.replace(/^Haplogroup\s+/, '').trim();
    map.set(cleanName, {
      region: node.region || null,
      description: node.description || null,
      historicalContext: node.historicalContext || null
    });
  }
  if (node.children) {
    for (const child of node.children) {
      flattenHaploTree(child, map);
    }
  }
}

/**
 * Traverses up the phylogenetic tree for the given haplogroup name,
 * returning the closest regional origin and description from the curated tree.
 */
export function getHaplogroupDetails(name: string, isMaternal: boolean): { region: string; description: string; historicalContext?: string } {
  if (!name) {
    return {
      region: "Global",
      description: `A ${isMaternal ? 'maternal' : 'paternal'} lineage branch.`,
    };
  }

  const cleanName = name.replace(/^Haplogroup\s+/, '').trim();
  
  if (isMaternal) {
    if (!mtDnaMetadataMap) {
      mtDnaMetadataMap = new Map();
      flattenHaploTree(MT_DNA_TREE, mtDnaMetadataMap);
    }
  } else {
    if (!yDnaMetadataMap) {
      yDnaMetadataMap = new Map();
      flattenHaploTree(Y_DNA_TREE, yDnaMetadataMap);
    }
  }
  
  const map = isMaternal ? mtDnaMetadataMap! : yDnaMetadataMap!;
  
  // 1. Direct match check
  const direct = map.get(cleanName);
  if (direct && direct.region && direct.description) {
    return {
      region: direct.region,
      description: direct.description,
      historicalContext: direct.historicalContext || undefined
    };
  }
  
  // 2. Walk up parent tree to find closest ancestor's region and description
  let current: string | null = cleanName;
  let resolvedRegion: string | null = direct?.region || null;
  let resolvedDesc: string | null = direct?.description || null;
  let resolvedHist: string | null = direct?.historicalContext || null;
  
  while (current && (!resolvedRegion || !resolvedDesc)) {
    const parent = parentHaplogroup(current);
    if (!parent) break;
    const parentMeta = map.get(parent);
    if (parentMeta) {
      if (!resolvedRegion && parentMeta.region) {
        resolvedRegion = parentMeta.region;
      }
      if (!resolvedDesc && parentMeta.description) {
        resolvedDesc = parentMeta.description;
      }
      if (!resolvedHist && parentMeta.historicalContext) {
        resolvedHist = parentMeta.historicalContext;
      }
    }
    current = parent;
  }
  
  // Fallbacks if not fully resolved
  return {
    region: resolvedRegion || "Global",
    description: resolvedDesc || `A ${isMaternal ? 'maternal' : 'paternal'} lineage branch characterized by specific phylogenetic markers.`,
    historicalContext: resolvedHist || undefined
  };
}
