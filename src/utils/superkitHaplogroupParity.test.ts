import { describe, it, expect } from 'vitest';
import { parseRawDNA, parseRawDNAStream } from '../services/dnaParser';
import { YDnaPredictorV2 } from '../services/yDnaPredictorV2';
import { YPhylotreeDataset, YSnpRecord, YPhylotreeBranch } from './yPhylotree';
import { analyzePhase2YDna } from '../services/phase2YDnaAdapter';
import { predictYDNAHaplogroup, analyzeMtDNA } from '../services/haplogroupPredictor';

describe('Superkit Parity & Coordinate-Aware Haplogroup Calling', () => {
  describe('1. VCF Dot (.) ID Collision Elimination', () => {
    const vcfData = `##fileformat=VCFv4.2
##source=WGS_Sequencer
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE1
chrY\t2655180\t.\tA\tG\t99\tPASS\t.\tGT\t1
chrY\t2655181\t.\tC\tT\t99\tPASS\t.\tGT\t1
chrY\t2655182\t.\tG\tA\t99\tPASS\t.\tGT\t1
chrY\t2655183\t.\tT\tC\t99\tPASS\t.\tGT\t1
chrY\t2655184\t.\tA\tC\t99\tPASS\t.\tGT\t1
`;

    it('parseRawDNA retains all unannotated Y-SNPs without collision', () => {
      const parsed = parseRawDNA(vcfData);

      // Verify that the dot identifier did NOT collapse all 5 SNPs into yMap['.']
      expect(parsed.yMap['.']).toBeUndefined();

      // All 5 SNPs must be indexed by physical coordinate
      expect(parsed.yMap['y:2655180']).toBe('G');
      expect(parsed.yMap['y:2655181']).toBe('T');
      expect(parsed.yMap['y:2655182']).toBe('A');
      expect(parsed.yMap['y:2655183']).toBe('C');
      expect(parsed.yMap['y:2655184']).toBe('C');

      // Total Y-SNPs parsed must be exactly 5
      expect(Object.keys(parsed.yMap).length).toBeGreaterThanOrEqual(5);

      // Coordinates must also exist in snpByPosition
      expect(parsed.snpByPosition['y:2655180']).toBe('G');
      expect(parsed.snpByPosition['y:2655181']).toBe('T');
      expect(parsed.snpByPosition['y:2655182']).toBe('A');
      expect(parsed.snpByPosition['y:2655183']).toBe('C');
      expect(parsed.snpByPosition['y:2655184']).toBe('C');
    });

    it('parseRawDNAStream retains all unannotated Y-SNPs without collision', async () => {
      const blob = new Blob([vcfData], { type: 'text/plain' });
      const parsed = await parseRawDNAStream(blob);

      expect(parsed.yMap['.']).toBeUndefined();
      expect(parsed.yMap['y:2655180']).toBe('G');
      expect(parsed.yMap['y:2655181']).toBe('T');
      expect(parsed.yMap['y:2655182']).toBe('A');
      expect(parsed.yMap['y:2655183']).toBe('C');
      expect(parsed.yMap['y:2655184']).toBe('C');
      expect(parsed.snpByPosition['y:2655180']).toBe('G');
    });
  });

  describe('2. Phase 2 Coordinate-Only Calling in YDnaPredictorV2', () => {
    function createCoordinateDataset(): YPhylotreeDataset {
      const snps: YSnpRecord[] = [
        {
          name: 'M168',
          ancestral: 'C',
          derived: 'T',
          posHg38: 1000,
          isoggHaplogroup: 'CT',
        },
        {
          name: 'M96',
          ancestral: 'C',
          derived: 'G',
          posHg38: 3000,
          isoggHaplogroup: 'E',
        },
        {
          name: 'M2',
          ancestral: 'A',
          derived: 'G',
          posHg38: 4000,
          isoggHaplogroup: 'E1b1',
        },
      ];

      const branches: YPhylotreeBranch[] = [
        {
          branchName: 'Root',
          parent: null,
          definingSNPs: [],
          unresolvedSNPs: [],
          rsids: [],
        },
        {
          branchName: 'CT',
          parent: 'Root',
          definingSNPs: [snps[0]], // M168
          unresolvedSNPs: [],
          rsids: [],
        },
        {
          branchName: 'E',
          parent: 'CT',
          definingSNPs: [snps[1]], // M96
          unresolvedSNPs: [],
          rsids: [],
        },
        {
          branchName: 'E1b1',
          parent: 'E',
          definingSNPs: [snps[1], snps[2]], // M96 + M2
          unresolvedSNPs: [],
          rsids: [],
        },
      ];

      return {
        version: '1.0.0',
        source: 'test',
        generatedAt: new Date().toISOString(),
        snpCount: snps.length,
        branchCount: branches.length,
        resolvedBranchCount: branches.length,
        branches,
      };
    }

    it('resolves terminal haplogroup via physical coordinates without any rsIDs or marker names', () => {
      const predictor = new YDnaPredictorV2(createCoordinateDataset());

      // Genomic input that contains ONLY hg38 coordinates, zero rsIDs, zero names
      const result = predictor.predict({
        snpByRsid: {},
        snpByPosition: {
          'y:1000': 'T', // M168 derived
          'y:3000': 'G', // M96 derived
          'y:4000': 'G', // M2 derived
        },
      });

      expect(result.terminalHaplogroup).toBe('E1b1');
      expect(result.confidence).toBe(100);
      expect(result.derivedSnpCount).toBe(3);
      expect(result.ancestralSnpCount).toBe(0);
    });

    it('resolves terminal haplogroup even when position key is formatted with upper or alternate prefix', () => {
      const predictor = new YDnaPredictorV2(createCoordinateDataset());

      const result = predictor.predict({
        snpByRsid: {},
        snpByPosition: {
          'Y:1000': 'T',
          'chry:3000': 'G',
          '4000': 'G',
        },
      });

      expect(result.terminalHaplogroup).toBe('E1b1');
      expect(result.confidence).toBe(100);
      expect(result.derivedSnpCount).toBe(3);
    });
  });

  describe('3. mtDNA Multi-Format Coordinate Resolution', () => {
    it('resolves mutations regardless of whether position is prefixed with m., mt:, chrM:, or raw digits', () => {
      // 769 -> A769G defining Haplogroup H in curated tree
      const mtMapWithPrefixes = {
        'm.769': 'G',
      };
      const snpByPosition = {
        'mt:769': 'G',
        'chrM:769': 'G',
      };

      const result = analyzeMtDNA(mtMapWithPrefixes, snpByPosition);
      expect(result.userMutations).toContain('A769G');
      expect(result.predicted).toMatch(/H/);
    });

    it('resolves mtDNA deletions and insertions when coordinates are provided via snpByPosition', () => {
      const mtMap = {};
      const snpByPosition = {
        'mt:769': 'G',
      };

      const result = analyzeMtDNA(mtMap, snpByPosition);
      expect(result.userMutations).toContain('A769G');
      expect(result.predicted).toMatch(/H/);
    });
  });
});
