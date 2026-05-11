import { SNP_DB, SNP_LOOKUP } from '../data/snpDatabase';
import mtDescriptions from '../data/mitochondrial/mtDescriptions.json';
import { ANCHOR_AIMS } from '../anchorAims';
import { ANCESTRY_MARKERS } from '../data/ancestry';
import v5MarkersMaster from '../data/v5_markers_master.json' with { type: 'json' };
import { SNP } from '../types/genotype';
import { SNP_PROXY_MAP } from '../utils/genotypeUtils';

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

export function getPrivateSNPs(snpMap: Record<string, string>) {
  // Combine all known source IDs into a single Set for efficient lookup
  const knownSNPs = new Set<string>();
  
  // Need to include all sources defined in matchSNPs
  const allSources: any[] = [
    ...SNP_DB,
    ...ANCHOR_AIMS,
    ...ANCESTRY_MARKERS
  ];
  
  for (const snp of allSources) {
    if (snp.markerId) knownSNPs.add(snp.markerId.toLowerCase());
    if (snp.rsid) knownSNPs.add(snp.rsid.toLowerCase());
    if (snp.aliases) {
      for (const alias of snp.aliases) {
        knownSNPs.add(alias.toLowerCase());
      }
    }
  }

  // Find SNPs in the user map that are not in the known set
  const privateSNPs: string[] = [];
  for (const markerId in snpMap) {
    if (!knownSNPs.has(markerId.toLowerCase())) {
      privateSNPs.push(markerId);
    }
  }
  
  return privateSNPs;
}

let cachedAllSources: any[] | null = null;

function getAllSources() {
  if (cachedAllSources) return cachedAllSources;

  const sources: any[] = [
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
    })),
    ...(ANCESTRY_MARKERS as any[]).map((m: any) => ({
      markerId: m.rsid,
      rsid: m.rsid,
      gene: m.gene || "Intergenic",
      trait: m.trait || m.description,
      continent: m.region,
      description: m.description,
      alleles: m.alleles,
      significance: m.significance || "Medium",
      category: "Ancestry" as const,
      frequencies: m.frequencies,
      subPopulation: m.region
    })),
    ...v5MarkersMaster.filter((m: any) => m.frequency && Object.keys(m.frequency).length > 0).map((m: any) => ({
      markerId: m.rsid,
      rsid: m.rsid,
      gene: m.gene || "Intergenic",
      trait: m.clinical_impact_short || m.variant || m.rsid,
      continent: Object.keys(m.frequency).join('/'),
      description: m.clinical_impact || m.clinical_impact_short,
      alleles: [m.risk_allele].filter(Boolean),
      significance: m.actionable?.priority === 'HIGH' ? "High" : "Medium",
      category: "Ancestry" as const,
      frequencies: m.frequency
    }))
  ];

  cachedAllSources = sources;
  return sources;
}

export function matchSNPs(snpMap: Record<string, string>, snpMetaMap?: Record<string, { chrom: string, pos: number }>) {
  const seen = new Set<string>();
  const allSources = getAllSources();
  const results: any[] = [];
  
  const sourcesCount = allSources.length;
  for (let i = 0; i < sourcesCount; i++) {
    const snp = allSources[i];
    const markerIdLower = snp.markerId.toLowerCase();
    
    if (seen.has(markerIdLower)) continue;
    seen.add(markerIdLower);
    
    let raw = '';
    let meta = null;
    
    // Check markerId
    if (snpMap[markerIdLower]) {
      raw = snpMap[markerIdLower];
      if (snpMetaMap?.[markerIdLower]) meta = snpMetaMap[markerIdLower];
    } 
    // Check rsid
    else if (snp.rsid && snpMap[snp.rsid.toLowerCase()]) {
      const k = snp.rsid.toLowerCase();
      raw = snpMap[k];
      if (snpMetaMap?.[k]) meta = snpMetaMap[k];
    }
    // Check aliases
    else if (snp.aliases) {
      for (const alias of snp.aliases) {
        const k = alias.toLowerCase();
        if (snpMap[k]) {
          raw = snpMap[k];
          if (snpMetaMap?.[k]) meta = snpMetaMap[k];
          break;
        }
      }
    }

    // Proxy Lookup
    if (!raw && snp.rsid) {
      const proxies = SNP_PROXY_MAP[snp.rsid.toLowerCase()];
      if (proxies) {
        for (const proxy of proxies) {
          const k = proxy.toLowerCase();
          if (snpMap[k]) {
            raw = snpMap[k];
            if (snpMetaMap?.[k]) meta = snpMetaMap[k];
            snp.description = (snp.description || "") + ` [Proxy matched via ${proxy}]`;
            break;
          }
        }
      }
    }

    if (!raw) {
      results.push({ ...snp, status: 'not_tested' });
      continue;
    }
    
    const normalizedGenotype = raw.toUpperCase();
    const sortedGenotype = raw.length === 2 ? (raw[0] > raw[1] ? raw[1] + raw[0] : raw).toUpperCase() : normalizedGenotype;
    
    let interpretation = null;
    const interpretations = snp.interpretations;
    
    if (interpretations) {
      for (const key in interpretations) {
        const upperKey = key.toUpperCase();
        if (upperKey === normalizedGenotype) {
          interpretation = interpretations[key];
          break;
        }
        if (raw.length === 2) {
           const sortedKey = key.length === 2 ? (key[0] > key[1] ? key[1] + key[0] : key).toUpperCase() : upperKey;
           if (sortedKey === sortedGenotype) {
             interpretation = interpretations[key];
             break;
           }
        }
      }
      
      if (!interpretation) {
        for (const key in interpretations) {
          if (key.includes('*') || key.includes('?')) {
            const pattern = key.replace(/\*/g, '.*').replace(/\?/g, '.');
            const regex = new RegExp(`^${pattern}$`, 'i');
            if (regex.test(raw)) {
              interpretation = `[Nuanced Match] ${interpretations[key]}`;
              break;
            }
          }
        }
      }
      
      if (!interpretation && interpretations['*']) interpretation = interpretations['*'];
    }

    let matchCount = 0;
    if (Array.isArray(snp.alleles)) {
      for (const allele of snp.alleles) {
        if (raw[0] === allele) matchCount++;
        if (raw[1] === allele) matchCount++;
      }
    }
    
    const isMatched = matchCount > 0 || !!interpretation;
    const isPartial = !interpretation && matchCount > 0 && matchCount < 2 && raw.length === 2;
    
    if (!interpretation) {
      const alleleStr = Array.isArray(snp.alleles) ? snp.alleles.join('/') : 'N/A';
      if (matchCount === 2) {
        interpretation = `Homozygous for the ${alleleStr} allele. Carry two copies.`;
      } else if (matchCount === 1) {
        interpretation = `Heterozygous for the ${alleleStr} allele. Carry one copy.`;
      } else {
        interpretation = `No ${alleleStr} variant detected.`;
      }
      if (isPartial) interpretation = `[Partial Match] ${interpretation}`;
      if (snp.description) interpretation += ` ${snp.description}`;
    }
      
    results.push({ ...snp, genotype: raw, interpretation, status: isMatched ? (isPartial ? 'partial' : 'matched') : 'unmatched', chrom: meta?.chrom, pos: meta?.pos });
  }
  return results;
}
