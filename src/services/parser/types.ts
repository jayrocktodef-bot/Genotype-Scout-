import {
  GenomicsError,
  GenomicsErrorCode,
  type GenomicsDiagnosticDetails,
  type GenomicsSubsystem,
  type SerializedGenomicsError
} from '../errorCaller';

export {
  GenomicsError,
  GenomicsErrorCode,
  type GenomicsDiagnosticDetails,
  type GenomicsSubsystem,
  type SerializedGenomicsError
};

export class GenomicsParseError extends GenomicsError {
  constructor(
    message: string,
    details: Partial<GenomicsDiagnosticDetails> & { errorCode?: string; errorCategory?: string }
  ) {
    super(message, {
      subsystem: details.subsystem || 'STREAM_PARSER',
      errorCode: details.errorCode || GenomicsErrorCode.ERR_PARSE_UNKNOWN_COLUMNS,
      legacyCode: details.legacyCode || 'ERR-4025FGD1',
      ...details
    });
    this.name = 'GenomicsParseError';
  }
}

export type GenotypeFormat =
  | 'VCF'
  | 'gVCF'
  | '23andMe'
  | 'AncestryDNA'
  | 'MyHeritage'
  | 'FTDNA'
  | 'Living DNA'
  | 'Helix'
  | 'Color Genomics'
  | 'Sequencing.com'
  | 'Sano Genetics'
  | 'Veritas Genetics'
  | 'TellmeGen'
  | '24Genetics'
  | 'WeGene'
  | 'Dante Labs'
  | 'Nebula Genomics'
  | 'Geno 2.0'
  | 'Genes for Good'
  | 'CircleDNA'
  | 'Generic TSV'
  | 'Generic CSV'
  | 'Generic SSV'
  | 'Unknown';

export interface VariantRecord {
  markerId: string;
  chrom: string;
  pos: number;
  posStr: string;
  genotype: string;
  isPhased?: boolean;
  allele1?: string;
  allele2?: string;
  phaseSet?: string;
}

export interface ColumnMapping {
  rsidIdx: number;
  chromIdx: number;
  posIdx: number;
  gtIdx: number;
  allele1Idx: number;
  allele2Idx: number;
  hasSplitAlleles: boolean;
  isCustom: boolean;
}

export interface VcfColumnLayout {
  chromIdx: number;
  posIdx: number;
  idIdx: number;
  refIdx: number;
  altIdx: number;
  qualIdx: number;
  filterIdx: number;
  infoIdx: number;
  formatIdx: number;
  sampleIdx: number;
  sampleNames: string[];
  selectedSampleName?: string;
}

export type ParseProgressCallback = (bytesProcessed: number, totalBytes: number, snpsFound: number) => void;

export interface ParseOptions {
  allowlist?: Set<string>;
  onProgress?: ParseProgressCallback;
  targetSample?: string | number;
  signal?: AbortSignal;
}

export interface ParsedGenomicDataset {
  format: string;
  chip: string;
  build: 'GRCh37' | 'GRCh38' | 'T2T-CHM13' | 'hg18' | 'UNKNOWN';
  sampleNames?: string[];
  selectedSample?: string;
  totalSnps: number;
  yDnaSnps: number;
  yDnaCalledSnps: number;
  mtDnaSnps: number;
  inferredBiologicalSex: 'MALE' | 'FEMALE' | 'UNKNOWN';
  snpMap: Record<string, string>;
  snpMetaMap: Record<string, { chrom: string; pos: number }>;
  xMap: Record<string, string>;
  yMap: Record<string, string>;
  mtMap: Record<string, string>;
  snpCount: number;
  rawSnpsCount?: number;
  snpByRsid: Record<string, string>;
  snpByPosition: Record<string, string>;
  isPhased: boolean;
  phasedCount?: number;
  phasingMethod: 'VCF_PHASED' | 'STATISTICAL_MICROPHASED' | 'TRIO' | 'UNPHASED';
  haplotype1Map?: Record<string, string>;
  haplotype2Map?: Record<string, string>;
  phaseSets?: Record<string, string>;
}

export interface SniffedPlan {
  format: GenotypeFormat | string;
  chip: string;
  build: 'GRCh37' | 'GRCh38' | 'T2T-CHM13' | 'hg18' | 'UNKNOWN';
  delim: number;
  delimStr: string;
  isVcf: boolean;
  isStandard23andMe: boolean;
  isStandardAncestry: boolean;
  mapping: ColumnMapping;
  vcfLayout?: VcfColumnLayout;
  headerLineIndex: number;
}
