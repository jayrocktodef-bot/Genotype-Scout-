import { ANCESTRY_MARKERS } from './data/ancestry';

export interface AnchorAim {
  rsid: string;
  region: string;
  alleles: string[];
  weight: number;
  significance?: 'High' | 'Medium' | 'Low';
  frequencies: Record<string, number>;
  subFrequencies?: Record<string, number>;
  description: string;
}

export const ANCHOR_AIMS: AnchorAim[] = ANCESTRY_MARKERS as AnchorAim[];
