import ancientMarkers from './ancient_historical/ancient_dna_markers.json';
import popFrequencies from './reference/1000genomes_frequencies.json';
import aimsAndTraits from './reference/aims_and_traits.json';
import { ANCESTRY_MARKERS } from './ancestry';

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
  }
}

export const getAncientMarkers = () => ancientMarkers as unknown as Record<string, AncientMarker>;
export const getPopFrequencies = () => popFrequencies as Record<string, PopFrequencyEntry | any>;
export const getAimsAndTraits = () => aimsAndTraits as any;
export const getAncestryMarkers = () => ANCESTRY_MARKERS;

export const findFrequency = (rsid: string, genotype: string, popCode: string) => {
  const entry = (popFrequencies as any)[rsid] as PopFrequencyEntry;
  if (!entry || !entry.populations) return null;
  const popData = entry.populations[popCode];
  if (popData && popData[genotype] !== undefined) {
    return popData[genotype];
  }
  return null;
};
