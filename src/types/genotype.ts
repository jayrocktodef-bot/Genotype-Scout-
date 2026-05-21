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
  genotype?: string;
  status?: 'matched' | 'unmatched' | 'not_tested' | 'partial';
  userGenotype?: string;
}

export interface AnchorAim {
  rsid: string;
  region: string;
  alleles: string[];
  weight: number;
  significance?: 'High' | 'Medium' | 'Low';
  frequencies: Record<string, number>;
  subFrequencies?: Record<string, number>;
  subpop?: string;
  description: string;
}

export interface HaplogroupNode {
  branchName: string;
  snp?: string[];
  mutations?: string[];
  region?: string;
  description?: string;
  historicalContext?: string;
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
  segments?: Record<string, { continent: string, start: number, end: number, confidence: number }[]>;
  confidenceIntervals: Record<string, { low: number, high: number }>;
}

export type OnnxInferenceInput = number[] | Float32Array;

export interface OnnxInferenceOutput {
  population: string;
  confidence: number;
  probabilities?: Record<string, number>;
}

