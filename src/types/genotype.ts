export interface SNP {
  markerId: string; // Can be rsid or locus name
  rsid?: string;
  aliases?: string[];
  gene: string;
  trait: string;
  continent: string;
  subpop?: string | null;
  description: string;
  alleles: string[];
  significance: 'High' | 'Medium' | 'Low';
  category: 'Health' | 'Ancestry' | 'Lifestyle' | 'Nutrition' | 'Performance';
  interpretations?: Record<string, string>;
  referenceUrl?: string;
  frequencies?: Record<string, number>;
}

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

export interface HaplogroupNode {
  branchName: string;
  snp?: string[];
  mutations?: string[];
  region?: string;
  description?: string;
  children?: HaplogroupNode[];
}

export interface AncestryInferenceResult {
  continentalScores: Record<string, number>;
  regionalScores: Record<string, number>;
  deepScores: Record<string, number>;
  continents: string[];
  subPopulations: Record<string, any[]>;
  subPopMarkers: Record<string, any[]>;
  confidenceScore: number;
  chromosomeData: Record<string, Record<string, number>>;
  confidenceIntervals: Record<string, { low: number, high: number }>;
}
