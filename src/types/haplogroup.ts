export interface RawSnp {
  rsid?: string; // dbSNP id or rsid alias
  name?: string; // SNP name (e.g., 'M269', 'M2')
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

// ============================================================================
// Haplotype-Scout Unified Phylogenetic & Forensic Types
// ============================================================================

export type LineageType = 'PATERNAL_YDNA' | 'MATERNAL_MTDNA';

export type MarkerStatus = 
  | 'POSITIVE_DERIVED'   // Matches defining mutation (Derived)
  | 'NEGATIVE_ANCESTRAL'  // Matches ancestral base (Not mutated)
  | 'NO_CALL'             // Missing, uncalled (--), or low quality
  | 'MISMATCH';           // Call differs from both ancestral & expected derived

export interface SnpMarker {
  name: string;             // e.g. "M269", "U152", "7028C", "H1-defining"
  rsid: string;             // e.g. "rs9786184", "rs2853499"
  chromosome: string;       // "Y" or "MT" / "M"
  position: number;         // Genomic coordinate
  ancestralAllele: string;  // e.g. "C"
  derivedAllele: string;    // e.g. "T"
  haplogroup: string;       // Associated clade, e.g. "R1b-U152"
  lineageType: LineageType;
  description: string;
}

export interface EvaluatedMarker {
  snp: SnpMarker;
  userGenotype: string;     // e.g. "T", "TT", "AG", "--"
  status: MarkerStatus;
  details: string;
  isImputed?: boolean;
  imputedFrom?: string;
  mutationWeight?: number;  // Higher for rare transversions (e.g. 5x vs 1x transitions)
}

export interface MigrationStep {
  order: number;
  region: string;
  timePeriod: string;
  description: string;
  lat?: number;
  lng?: number;
}

export interface HaplogroupDefinition {
  code: string;             // e.g. "R1b-U152", "H1", "I1-M253", "J1c"
  shortName: string;        // e.g. "R-U152", "H1"
  cladeName: string;        // e.g. "R1b1a1b1a1a2", "H1"
  lineageType: LineageType;
  parentClade: string | null;
  definingSnps: string[];
  ageYearsBp: string;       // e.g. "~4,500 BP (Early Bronze Age)"
  originRegion: string;     // e.g. "Alps / Central Europe"
  historicalDescription: string;
  ancientCultures: string[];
  highFrequencyModern: string[];
  migrationPath: MigrationStep[];
}

export interface Phase2YDnaDetails {
  terminalHaplogroup: string;
  confidence: number;
  coverage: number;
  derivedSnpCount: number;
  ancestralSnpCount: number;
  nonPalindromicDerivedCount: number;
  palindromicDerivedCount: number;
  recurrentDerivedCount: number;
  isPalindromicAmbiguous: boolean;
  isProvisionalTerminal?: boolean;
  apexAnchorClade?: string;
  inferredBiologicalSex?: 'MALE' | 'FEMALE' | 'UNKNOWN';
  path: string[];
  rejectedBranches: string[];
  derivedMarkers: {
    name: string;
    rsid?: string;
    allele: string;
    mutation?: string;
    branch: string;
    isPalindromic?: boolean;
    isAmpliconic?: boolean;
    isRecurrent?: boolean;
    isChipNoiseProne?: boolean;
  }[];
  ancestralMarkers: {
    name: string;
    rsid?: string;
    allele: string;
    mutation?: string;
    branch: string;
    isPalindromic?: boolean;
    isAmpliconic?: boolean;
    isRecurrent?: boolean;
    isChipNoiseProne?: boolean;
  }[];
}

export interface LineageAnalysis {
  lineageType: LineageType;
  terminalHaplogroup: HaplogroupDefinition;
  confidenceScore: number;      // 0 - 100%
  positiveCount: number;
  negativeCount: number;
  totalTestedMarkers: number;
  lineageTreePath: HaplogroupDefinition[]; // From root down to terminal
  evaluatedMarkers: EvaluatedMarker[];
  novelOrUntestedMarkers?: string[];
  phase2Details?: Phase2YDnaDetails;
  coverage?: number;
  rejectedBranches?: string[];
}

export interface MicroHapResult {
  popCode: string;
  name: string;
  percentage: number;
}

export interface ArchaicLocusMatch {
  rsid: string;
  gene?: string;
  hominin: 'NEANDERTHAL' | 'DENISOVAN' | 'BOTH';
  traitOrFunction: string;
  userGenotype: string;
  archaicAllele: string;
  isDerivedMatch: boolean;
  modernFrequencyPct: string;
}

export interface ArchaicAffinityResult {
  neanderthalPercentage: number;     // e.g. 1.85%
  denisovanPercentage: number;       // e.g. 0.12%
  neanderthalVariantCount: number;
  denisovanVariantCount: number;
  totalInformativeTested: number;
  globalPercentile: number;          // e.g. 74th percentile
  functionalLoci: ArchaicLocusMatch[];
}

export interface EmpopFlaggedArtifact {
  position: number;
  observedGenotype: string;
  expectedState: string;
  artifactType: 'PHANTOM_MUTATION' | 'POLY_C_LENGTH_HETEROPLASMY' | 'CHIP_PROBE_DYE_SHIFT' | 'SYNTHETIC_INDEL_DISCORDANCE';
  confidence: 'HIGH_RISK_ARTIFACT' | 'POSSIBLE_CHIP_NOISE';
  explanation: string;
}

export interface EmpopForensicQcReport {
  overallStatus: 'PASSED_FORENSIC_STANDARDS' | 'CONTAINS_FLAGGED_CHIP_ARTIFACTS';
  forensicCoherenceScorePct: number; // 0 - 100%
  normalizedIndelCount: number;
  flaggedArtifacts: EmpopFlaggedArtifact[];
  samAlignmentNotes: string[];
}

export interface DnaAnalysisResult {
  id: string;
  kitName: string;
  timestamp: number;
  rawFileFormat: string;
  detectedBuild?: 'GRCh37' | 'GRCh38' | 'UNKNOWN';
  totalSnpsParsed: number;
  yDnaSnpsCount: number;
  mtDnaSnpsCount: number;
  paternalLineage: LineageAnalysis | null;
  maternalLineage: LineageAnalysis | null;
  microhaplotypes?: MicroHapResult[];
  archaicAffinity?: ArchaicAffinityResult;
  empopQcReport?: EmpopForensicQcReport;
  isMaleSample: boolean;
}

export interface SampleDnaKit {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  paternalHaplo: string;
  maternalHaplo: string;
  rawSnippetContent: string;
}
