import masterAncient from './master_ancient_profiles.json';
import popFrequencies from './reference/1000genomes_frequencies.json';
import aimsAndTraits from './reference/aims_and_traits.json';
import { loadMasterAims } from './index';
import { getAllAims } from './raw_aims/index';

// Initialize on first use or cache
let masterAimsCache: any = null;
const getMasterAims = () => {
  if (!masterAimsCache) {
      masterAimsCache = {
          ...loadMasterAims(),
          ...getAllAims().reduce((acc, aim) => {
              const normalizedRsid = aim.rsid.toLowerCase();
              acc[normalizedRsid] = {
                  rsid: normalizedRsid,
                  region: aim.region || "Unknown",
                  color: aim.color || "#95A5A6",
                  alleles: aim.alleles || [],
                  frequencies: aim.frequencies || {},
                  subFrequencies: aim.subFrequencies || {},
                  deepFrequencies: aim.deepFrequencies || {},
                  weight: aim.weight || 1,
                  gene: aim.gene || "N/A",
                  trait: aim.trait || "Ancestry",
                  description: aim.description || "N/A"
              };
              return acc;
          }, {} as Record<string, any>)
      };
  }
  return masterAimsCache;
};

export interface PopFrequencyEntry {
  gene?: string;
  trait?: string;
  chromosome?: string;
  position?: number;
  ref?: string;
  alt?: string;
  populations: {
    [popCode: string]: {
      [genotype: string]: number;
    }
  }
}

export interface AncientMarker {
  gene?: string;
  trait?: string;
  derived_allele: string;
  ancestral_allele: string;
  ancient_context: {
    [pop: string]: {
      frequency: string;
      note: string;
    }
  };
  introgression?: {
    source: string;
  };
  history?: string;
  chromosome?: string;
  position?: number;
}

export const getAncientMarkers = () => {
  const data = (masterAncient as any).markers;
  // Inject metadata for compatibility if expected
  if ((masterAncient as any).metadata?.ancient_populations) {
    (data as any)._metadata = { 
      ancient_populations: (masterAncient as any).metadata.ancient_populations 
    };
  }
  return data as Record<string, AncientMarker>;
};
export const getPopFrequencies = () => popFrequencies as Record<string, PopFrequencyEntry | any>;
export const getAimsAndTraits = () => aimsAndTraits as any;
export const getAncestryMarkers = () => Object.values(getMasterAims()) as any[];

export const findFrequency = (rsid: string, genotype: string, popCode: string) => {
  const entry = (popFrequencies as any)[rsid] as PopFrequencyEntry;
  if (!entry || !entry.populations) return null;
  const popData = entry.populations[popCode];
  if (popData && popData[genotype] !== undefined) {
    return popData[genotype];
  }
  return null;
};
