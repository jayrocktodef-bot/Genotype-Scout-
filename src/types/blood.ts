export type RhPrediction = "Positive" | "Negative" | "Unknown";

export interface RhMarkerResult {
  snp: string;
  genotype: string;
  prediction: RhPrediction;
  confidence: number;
}

export interface ExtendedBloodSystemResult {
  system: string;
  gene: string;
  phenotype: string;
  genotype: string;
  antigens: string;
  confidence: "High" | "Moderate" | "Low";
  description: string;
  clinicalSignificance?: string;
  markers: Array<{ snp: string; genotype: string; effect: string }>;
}

export interface ABODiplotypeResult {
  diplotype: string;
  phenotype: "A" | "B" | "AB" | "O" | "Bombay (Oh)" | "Cis-AB" | "Unknown";
  subgroup?: string; // e.g. "A1", "A2", "B", "O1", "O1v", "O2"
  probability: number;
  isBombay: boolean;
  isCisAB: boolean;
  markersCompared: number;
  detectedAlleles: string[];
}

export interface RhDetailedResult {
  rhD: RhPrediction;
  rhConfidence: number;
  confidence: number;
  phenotype: RhPrediction;
  fisherRace: string; // e.g. "D+ C+ c+ E- e+"
  cAntigen: "C+" | "c+" | "C+ c+" | "Unknown";
  eAntigen: "E+" | "e+" | "E+ e+" | "Unknown";
  isRhdPsi: boolean; // African RHD pseudogene flag
  isHybridSuspected: boolean;
  results: RhMarkerResult[];
}

export interface BloodGroupProfile {
  bloodType: string;
  aboGroup: "A" | "B" | "AB" | "O" | "Bombay (Oh)" | "Cis-AB" | "Unknown";
  rhFactor: RhPrediction;
  aggregateConfidence: number;
  confidence: "High" | "Moderate" | "Low";
  aboDetails: ABODiplotypeResult;
  rhDetails: RhDetailedResult;
  extendedSystems: Record<string, ExtendedBloodSystemResult>;
  markers: RhMarkerResult[];
}

