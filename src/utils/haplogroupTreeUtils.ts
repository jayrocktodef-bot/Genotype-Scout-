export const normalizeBranchName = (name: string): string => 
  (name || "").toLowerCase().replace("haplogroup ", "").trim();

export function enrichHaplogroupTree(tree: any, userPath: string[], testedMarkers: any[]) {
  if (!tree) return null;
  const cloned = structuredClone(tree);
  if (!userPath || userPath.length <= 1) return cloned;
  
  function findNodeInCloned(root: any, normalizedName: string): any | null {
    if (normalizeBranchName(root.branchName) === normalizedName) return root;
    if (root.children) {
      for (const child of root.children) {
        const found = findNodeInCloned(child, normalizedName);
        if (found) return found;
      }
    }
    return null;
  }
  
  for (let i = 1; i < userPath.length; i++) {
    const step = userPath[i];
    if (!step) continue;
    const normalizedStep = normalizeBranchName(step);
    
    const existing = findNodeInCloned(cloned, normalizedStep);
    if (!existing) {
      const parentStep = userPath[i - 1];
      const normalizedParent = normalizeBranchName(parentStep);
      const parentNode = findNodeInCloned(cloned, normalizedParent);
      
      if (parentNode) {
        if (!parentNode.children) parentNode.children = [];
        
        const snpsForNode = (testedMarkers || [])
          .filter((tm: any) => {
            const tmBranch = tm.branch || tm.mutation || "";
            const tmTrait = tm.trait || tm.description || "";
            return normalizeBranchName(tmBranch) === normalizedStep || normalizeBranchName(tmTrait).includes(normalizedStep);
          })
          .map((tm: any) => tm.marker || tm.mutation);

        parentNode.children.push({
          branchName: step.startsWith("Haplogroup ") ? step : `Haplogroup ${step}`,
          snp: snpsForNode.length > 0 ? snpsForNode : [],
          region: parentNode.region || "Global",
          description: `Precise sub-lineage identified via genotyping markers.`,
          children: []
        });
      }
    }
  }
  return cloned;
}

export const HAPLO_COLORS: Record<string, string> = {
  'R1b': '#7f1d1d', 'R1a': '#be123c', 'Q': '#991b1b', 'O3': '#ea580c',
  'J': '#65a30d', 'I': '#166534', 'H': '#059669', 'G': '#0ea5e9',
  'E3b': '#1e3a8a', 'E': '#2563eb', 'A': '#4338ca', 'B': '#6d28d9',
  'C': '#7c3aed', 'D': '#db2777', 'L': '#ca8a04', 'T': '#0891b2',
};

export const MT_HAPLO_COLORS: Record<string, string> = {
  'L0': '#991b1b', 'L1': '#be123c', 'L2': '#e11d48', 'L3': '#f43f5e',
  'L4': '#fb7185', 'L5': '#fda4af', 'L6': '#fecdd3', 'M': '#7c3aed',
  'N': '#2563eb', 'R': '#0ea5e9', 'H': '#0891b2', 'V': '#0d9488',
  'J': '#059669', 'T': '#16a34a', 'U': '#65a30d', 'K': '#ca8a04',
  'I': '#d97706', 'W': '#ea580c', 'X': '#dc2626',
};

export const getHaploColor = (name: string, isMt: boolean = false): string => {
  const map = isMt ? MT_HAPLO_COLORS : HAPLO_COLORS;
  if (map[name]) return map[name];
  for (const key in map) {
    if (name.startsWith(key)) return map[key];
  }
  return isMt ? '#f43f5e' : '#64748b';
};
