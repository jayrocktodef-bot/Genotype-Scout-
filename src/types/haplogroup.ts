export interface RawSnp {
  rsid: string; // Could be RSID or SNP name
  allele: string; // The observed genotype (e.g., 'A', 'T')
}

export interface YTreeSnp {
  name: string;        // e.g., 'M123'
  haplogroup: string;  // e.g., 'R'
  ancestral: string;   // e.g., 'A'
  derived: string;     // e.g., 'G'
  parent: string | null; // e.g., 'P' (Parent haplogroup)
}

export interface PredictionResult {
  terminalHaplogroup: string;
  confidence: number;
  path: string[];
}
