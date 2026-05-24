export type RhPrediction = "Positive" | "Negative" | "Unknown";

export interface RhMarkerResult {
  snp: string;
  genotype: string;
  prediction: RhPrediction;
  confidence: number;
}

export interface BloodGroupProfile {
  aboGroup: "A" | "B" | "AB" | "O" | "Unknown";
  rhFactor: RhPrediction;
  aggregateConfidence: number; 
  markers: RhMarkerResult[];
}
