import { ParsedGenomicDataset } from '../../services/parser/types';

export interface RohParams {
  minLengthMb?: number;
  minSnps?: number;
  maxHeterozygousCount?: number;
  maxMissingCount?: number;
  maxGapMb?: number;
}

export interface RohInterval {
  chrom: string;
  start: number;
  end: number;
  lengthMb: number;
  snpCount: number;
}

export interface RohResult {
  intervals: RohInterval[];
  totalRohMb: number;
  fRoh: number;
}

const GRCH38_AUTOSOMAL_MB = 2875.001522; // Approximate total length of GRCh38 autosomes in Mb

export class RohDetector {
  private params: Required<RohParams>;

  constructor(params?: RohParams) {
    this.params = {
      minLengthMb: params?.minLengthMb ?? 1.5,
      minSnps: params?.minSnps ?? 50,
      maxHeterozygousCount: params?.maxHeterozygousCount ?? 1,
      maxMissingCount: params?.maxMissingCount ?? 5,
      maxGapMb: params?.maxGapMb ?? 1.0,
    };
  }

  public detect(dataset: ParsedGenomicDataset): RohResult {
    const snpsByChrom: Record<string, Array<{ rsid: string; pos: number; genotype: string }>> = {};

    for (const [rsid, meta] of Object.entries(dataset.snpMetaMap)) {
      if (!meta.chrom || !meta.pos) continue;
      
      const chrom = meta.chrom.replace(/^chr/i, '');
      const parsedChrom = parseInt(chrom, 10);
      
      // Only consider autosomes 1-22
      if (isNaN(parsedChrom) || parsedChrom < 1 || parsedChrom > 22) {
        continue;
      }

      const genotype = dataset.snpMap[rsid] || '--';

      if (!snpsByChrom[chrom]) {
        snpsByChrom[chrom] = [];
      }

      snpsByChrom[chrom].push({ rsid, pos: meta.pos, genotype });
    }

    const intervals: RohInterval[] = [];

    for (let i = 1; i <= 22; i++) {
      const chrom = i.toString();
      const snps = snpsByChrom[chrom];
      if (!snps || snps.length === 0) continue;

      snps.sort((a, b) => a.pos - b.pos);
      const chromIntervals = this.scanChromosome(chrom, snps);
      intervals.push(...chromIntervals);
    }

    const totalRohMb = intervals.reduce((sum, interval) => sum + interval.lengthMb, 0);
    const fRoh = totalRohMb / GRCH38_AUTOSOMAL_MB;

    return {
      intervals,
      totalRohMb,
      fRoh,
    };
  }

  private isHomozygous(genotype: string): boolean {
    if (genotype.length !== 2) return false;
    return genotype[0] === genotype[1] && genotype[0] !== '-';
  }

  private isMissing(genotype: string): boolean {
    return genotype === '--' || genotype === '-' || genotype.includes('-');
  }

  private scanChromosome(chrom: string, snps: Array<{ rsid: string; pos: number; genotype: string }>): RohInterval[] {
    const intervals: RohInterval[] = [];
    const inRoh = new Array(snps.length).fill(false);
    const windowSize = this.params.minSnps;

    // 1. Evaluate windows
    for (let i = 0; i <= snps.length - windowSize; i++) {
      let hetCount = 0;
      let missingCount = 0;
      let valid = true;

      // Check gap within window
      for (let j = 0; j < windowSize; j++) {
        const snp = snps[i + j];
        if (this.isMissing(snp.genotype)) {
          missingCount++;
        } else if (!this.isHomozygous(snp.genotype)) {
          hetCount++;
        }

        if (j > 0) {
          const gapMb = (snps[i + j].pos - snps[i + j - 1].pos) / 1e6;
          if (gapMb > this.params.maxGapMb) {
            valid = false;
            break;
          }
        }
      }

      if (valid && hetCount <= this.params.maxHeterozygousCount && missingCount <= this.params.maxMissingCount) {
        // Mark all SNPs in this window as in ROH
        for (let j = 0; j < windowSize; j++) {
          inRoh[i + j] = true;
        }
      }
    }

    // 2. Extract contiguous blocks
    let startIdx = -1;
    for (let i = 0; i < snps.length; i++) {
      if (inRoh[i]) {
        if (startIdx === -1) {
          startIdx = i;
        }
      } else {
        if (startIdx !== -1) {
          this.evaluateRun(chrom, snps, startIdx, i - 1, intervals);
          startIdx = -1;
        }
      }
    }
    if (startIdx !== -1) {
      this.evaluateRun(chrom, snps, startIdx, snps.length - 1, intervals);
    }

    return intervals;
  }

  private evaluateRun(
    chrom: string, 
    snps: Array<{ rsid: string; pos: number; genotype: string }>, 
    startIdx: number, 
    endIdx: number, 
    intervals: RohInterval[]
  ) {
    if (endIdx < startIdx) return;
    
    // Trim hets/missing from ends to ensure the run starts and ends on a homozygous SNP
    let actualStartIdx = startIdx;
    while (actualStartIdx <= endIdx && (!this.isHomozygous(snps[actualStartIdx].genotype) || this.isMissing(snps[actualStartIdx].genotype))) {
      actualStartIdx++;
    }

    let actualEndIdx = endIdx;
    while (actualEndIdx >= actualStartIdx && (!this.isHomozygous(snps[actualEndIdx].genotype) || this.isMissing(snps[actualEndIdx].genotype))) {
      actualEndIdx--;
    }

    if (actualStartIdx > actualEndIdx) return;

    const snpCount = actualEndIdx - actualStartIdx + 1;
    if (snpCount < this.params.minSnps) return;

    const startPos = snps[actualStartIdx].pos;
    const endPos = snps[actualEndIdx].pos;
    const lengthMb = (endPos - startPos) / 1e6;

    if (lengthMb >= this.params.minLengthMb) {
      intervals.push({
        chrom,
        start: startPos,
        end: endPos,
        lengthMb,
        snpCount
      });
    }
  }
}
