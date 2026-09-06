/**
 * Homoplasy & Recurrent Mutation Database
 * 
 * Curates known parallel recurrent mutations (homoplasies) across the human Y chromosome
 * and mtDNA that have arisen independently in multiple disjoint clades.
 * 
 * In rigorous phylogenetic deconvolution, a recurrent SNP alone cannot confirm a new 
 * sub-branch unless paired with at least one non-recurrent (private) defining SNP.
 */

// Well-documented Y-chromosome recurrent homoplasies (ISOGG & YFull consensus)
export const Y_RECURRENT_SNPS: Record<string, { clades: string[]; rationale: string }> = {
  'p25': { clades: ['R1b1', 'Q', 'BT'], rationale: 'Located in ampliconic palindrome P4; prone to recurrent homologous recombination' },
  'm130': { clades: ['C', 'F'], rationale: 'Parallel mutation hotspot' },
  'l138': { clades: ['I2a2', 'R1b'], rationale: 'Recurrent transition independently observed in Western and Eastern Eurasian lineages' },
  'cts10834': { clades: ['J2a', 'R1b'], rationale: 'Known mutational hotspot at Y:20,700,000' },
  'p189': { clades: ['J2', 'I'], rationale: 'Parallel transversion in IJ clade' },
  'm498': { clades: ['E1b1a', 'R1b'], rationale: 'Recurrent indel/transition' },
  'v12': { clades: ['E1b1b1a1', 'G'], rationale: 'Parallel transition in non-recombining region' },
  'm377': { clades: ['Q1b', 'G2a'], rationale: 'Independent mutation in distinct Eurasian clades' },
  'v22': { clades: ['E1b1b1a2', 'R1a'], rationale: 'Recurrent allele in North African and Steppe clades' },
  'l238': { clades: ['I1', 'R1b'], rationale: 'Recurrent Scandinavian marker' }
};

// Common rsIDs for recurrent Y-SNPs
export const Y_RECURRENT_RSIDS = new Set<string>([
  'rs2032666', // P25
  'rs9786184', // M130
  'rs34534814',
  'rs17250787',
  'rs34280735'
]);

/**
 * Checks if a Y-SNP is documented as a parallel homoplasy / recurrent mutation.
 */
export function isRecurrentSnp(name: string, rsid?: string): boolean {
  if (!name && !rsid) return false;

  const cleanName = (name || '').trim().toLowerCase();
  if (Y_RECURRENT_SNPS[cleanName]) return true;

  if (rsid) {
    const cleanRsid = rsid.trim().toLowerCase();
    if (Y_RECURRENT_RSIDS.has(cleanRsid)) return true;
  }

  return false;
}

/**
 * Returns the homoplasy metadata for a given SNP, or null if it is private/unique.
 */
export function getRecurrentSnpInfo(name: string, rsid?: string) {
  const cleanName = (name || '').trim().toLowerCase();
  return Y_RECURRENT_SNPS[cleanName] || null;
}
