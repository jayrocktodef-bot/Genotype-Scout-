import { SNP_DB, SNP_LOOKUP } from '../data/snpDatabase';
import mtDescriptions from '../data/mtDescriptions.json';
import { ANCHOR_AIMS } from '../anchorAims';
import { SNP } from '../types/genotype';

const MT_MARKER_DESCRIPTIONS: Record<string, string> = mtDescriptions;

export function getMarkerDescription(markerId: string): string {
  if (MT_MARKER_DESCRIPTIONS[markerId]) return MT_MARKER_DESCRIPTIONS[markerId];
  
  const snp = SNP_LOOKUP.get(markerId.toLowerCase());
  if (snp) return snp.description;
  
  // Fallback for mtDNA mutations like "A769G", "C186a", "A2395d"
  const mtMatch = markerId.match(/^([A-Z])(\d+)([A-Za-z])$/);
  if (mtMatch) {
    const ancestral = mtMatch[1];
    const pos = mtMatch[2];
    const derived = mtMatch[3];
    
    if (derived.toLowerCase() === 'd') {
      return `Mitochondrial deletion at position ${pos}. The ancestral allele ${ancestral} is missing.`;
    }
    
    const baseNames: Record<string, string> = {
      'A': 'Adenine', 'T': 'Thymine', 'C': 'Cytosine', 'G': 'Guanine',
      'a': 'Adenine (insertion/variant)', 't': 'Thymine (insertion/variant)', 
      'c': 'Cytosine (insertion/variant)', 'g': 'Guanine (insertion/variant)'
    };
    
    const aName = baseNames[ancestral] || ancestral;
    const dName = baseNames[derived] || derived;
    
    return `Mitochondrial mutation at position ${pos}, changing ${aName} (${ancestral}) to ${dName} (${derived}). This marker helps define specific maternal lineages.`;
  }
  
  return "Significance data not available for this specific marker.";
}

export function matchSNPs(snpMap: Record<string, string>, snpMetaMap?: Record<string, { chrom: string, pos: number }>) {
  const seen = new Set<string>();
  
  // Combine SNP_DB with ANCHOR_AIMS to ensure the Oracle has enough data
  const allSources: any[] = [
    ...SNP_DB,
    ...ANCHOR_AIMS.map(aim => ({
      markerId: aim.rsid,
      rsid: aim.rsid,
      gene: "Intergenic",
      trait: aim.description,
      continent: aim.region,
      description: aim.description,
      alleles: aim.alleles,
      significance: aim.significance || "Low",
      category: "Ancestry" as const,
      frequencies: aim.frequencies || aim.subFrequencies
    }))
  ];

  return allSources.flatMap(snp => {
    const markerId = snp.markerId.toLowerCase();
    if (seen.has(markerId)) return [];
    seen.add(markerId);
    
    // Check markerId, rsid, and aliases
    const keysToCheck = [snp.markerId, snp.rsid, ...(snp.aliases || [])]
      .filter(Boolean)
      .map(k => k!.toLowerCase());
    
    let raw = '';
    let meta = null;
    for (const k of keysToCheck) {
      if (snpMap[k]) {
        raw = snpMap[k];
        if (snpMetaMap && snpMetaMap[k]) {
          meta = snpMetaMap[k];
        }
        break;
      }
    }

    if (!raw) {
      return [{ ...snp, status: 'not_tested' }];
    }
    
    // Hierarchical Key-Value Matching system
    const getNuancedInterpretation = (genotype: string, interpretations?: Record<string, string>) => {
      if (!interpretations) return null;
      
      const normalizedGenotype = genotype.toUpperCase();
      const sortedGenotype = genotype.split('').sort().join('').toUpperCase();
      
      // Level 1: Exact Match (Case-insensitive)
      for (const [key, value] of Object.entries(interpretations)) {
        if (key.toUpperCase() === normalizedGenotype) return value;
      }
      
      // Level 2: Normalized/Sorted Match (for heterozygous SNPs)
      if (genotype.length === 2) {
        for (const [key, value] of Object.entries(interpretations)) {
          const sortedKey = key.split('').sort().join('').toUpperCase();
          if (sortedKey === sortedGenotype) return value;
        }
      }
      
      // Level 3: Wildcard/Pattern Matching (e.g., "A*", "*G", "A?")
      for (const [key, value] of Object.entries(interpretations)) {
        if (key.includes('*') || key.includes('?')) {
          const pattern = key.replace(/\*/g, '.*').replace(/\?/g, '.');
          const regex = new RegExp(`^${pattern}$`, 'i');
          if (regex.test(genotype)) return `[Nuanced Match] ${value}`;
        }
      }
      
      // Level 4: Partial/Ambiguous Match (e.g., "A" matches "AA" or "AG")
      if (genotype.length === 1) {
        for (const [key, value] of Object.entries(interpretations)) {
          if (key.toUpperCase().includes(normalizedGenotype)) {
            return `[Partial Match: ${genotype} in ${key}] ${value}`;
          }
        }
      }
      
      // Level 5: Default/Catch-all
      if (interpretations['*'] || interpretations['default']) {
        return interpretations['*'] || interpretations['default'];
      }
      
      return null;
    };

    // Count matches for the alleles of interest
    let matchCount = 0;
    for (const allele of snp.alleles) {
      for (const char of raw) {
        if (char === allele) matchCount++;
      }
    }
    
    let interpretation = getNuancedInterpretation(raw, snp.interpretations);
    
    const isMatched = matchCount > 0 || !!interpretation;
    const isPartial = !interpretation && matchCount > 0 && matchCount < 2 && raw.length === 2;
    
    if (!interpretation) {
      if (matchCount === 2) {
        interpretation = `Homozygous for the ${snp.alleles.join('/')} allele. You carry two copies of the variant associated with this trait.`;
      } else if (matchCount === 1) {
        interpretation = `Heterozygous for the ${snp.alleles.join('/')} allele. You carry one copy of the variant associated with this trait.`;
      } else {
        interpretation = `You do not carry the ${snp.alleles.join('/')} variant associated with this trait.`;
      }
      
      if (isPartial) {
        interpretation = `[Partial Match] ${interpretation}`;
      }
      
      // Incorporate more detailed medical or ancestry information from SNP_DB
      if (snp.description) {
        interpretation += ` ${snp.description}`;
      }
    }
      
    return [{ ...snp, genotype: raw, interpretation, status: isMatched ? (isPartial ? 'partial' : 'matched') : 'unmatched', chrom: meta?.chrom, pos: meta?.pos }];
  });
}
