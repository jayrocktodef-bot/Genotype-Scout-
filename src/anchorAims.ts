import aimsData from './aims.cleaned.json' with { type: 'json' };

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

export const ANCHOR_AIMS: AnchorAim[] = aimsData as AnchorAim[];
