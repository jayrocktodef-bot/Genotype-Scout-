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

export interface MtHaplogroupBranch {
  branchName: string;
  mutations: string[];
}

export interface MitoTrait {
  position: string;
  allele: string;
  traits: string[];
  status: string;
}

export interface IsoggBranch {
  branchName: string;
  definingSNPs: string[];
  rsids: string[];
}

export interface MasterMtdna {
  haplogroups: MtHaplogroupBranch[];
  traits: MitoTrait[];
  descriptions: Record<string, string>;
  lastUpdated: string;
}

export interface MasterYdna {
  isoggTree: IsoggBranch[];
  lastUpdated: string;
}

