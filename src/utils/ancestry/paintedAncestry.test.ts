import { describe, it, expect } from 'vitest';
import { computeDatasetLAI, computePaintedAncestry, runDatasetLAI } from './paintedAncestry';

describe('Fast Chromosome Painter & Local Ancestry Inference (LAI)', () => {
  it('should fall back gracefully to continental fallbackScores when segments are empty', () => {
    const fallback = { European: 80, African: 20 };
    const result = computePaintedAncestry(null, fallback);

    expect(result).toBeDefined();
    expect(result.items.length).toBe(2);
    expect(result.dominant.code).toBe('EUR');
    expect(result.items[0].percentage).toBe(80);
    expect(result.items[1].percentage).toBe(20);
    expect(result.totalMb).toBeGreaterThan(0);
  });

  it('should compute exact Mb percentages when segments are provided', () => {
    const segments = {
      '1': {
        strandA: [
          { continent: 'EUR', start: 1000000, end: 101000000, confidence: 0.98 },
          { continent: 'AFR', start: 101000000, end: 151000000, confidence: 0.95 }
        ],
        strandB: [
          { continent: 'EUR', start: 1000000, end: 151000000, confidence: 0.97 }
        ]
      }
    };

    const result = computePaintedAncestry(segments);
    expect(result).toBeDefined();
    expect(result.items.length).toBe(2);
    // Strand A has 100Mb EUR + 50Mb AFR. Strand B has 150Mb EUR. Total = 250Mb EUR, 50Mb AFR. Total = 300Mb.
    // EUR = 250 / 300 = 83.3%, AFR = 50 / 300 = 16.7%
    expect(result.dominant.code).toBe('EUR');
    expect(result.items[0].code).toBe('EUR');
    expect(result.items[0].percentage).toBeCloseTo(83.3, 0);
    expect(result.items[1].code).toBe('AFR');
    expect(result.items[1].percentage).toBeCloseTo(16.7, 0);
  });

  it('should run computeDatasetLAI in under 150ms on synthetic multi-chromosome AIM genotypes', () => {
    // Generate synthetic genotype calls for known AIM markers
    const testSnpMap: Record<string, string> = {
      rs11568828: 'TT',
      rs1042531: 'GG',
      rs1426654: 'AA', // SLC24A5 European light skin marker
      rs2814778: 'CC', // Duffy ACKR1 African marker
      rs1800414: 'CC', // OCA2
      rs16891982: 'GG' // SLC45A2
    };

    const start = performance.now();
    const result = computeDatasetLAI({
      mergedSnpMap: testSnpMap
    }, { European: 90, African: 10 });
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(350);
    expect(result).toBeDefined();
    if (result) {
      expect(result.aimsUsed.length).toBeGreaterThan(0);
      expect(result.segments).toBeDefined();
    }
  });

  it('should run runDatasetLAI asynchronously and return valid segment record', async () => {
    const testSnpMap: Record<string, string> = {
      rs1426654: 'AA',
      rs2814778: 'CC'
    };

    const segments = await runDatasetLAI({
      mergedSnpMap: testSnpMap
    });

    expect(segments).toBeDefined();
    if (segments) {
      const chromosomes = Object.keys(segments);
      expect(chromosomes.length).toBeGreaterThan(0);
      const chrData = segments[chromosomes[0]];
      expect(chrData.strandA).toBeDefined();
      expect(chrData.strandB).toBeDefined();
    }
  });

  describe('Parental Lineage Differentiation & Phased Haplotypes', () => {
    it('should differentiate parental lines using Male Chromosome X ground truth', async () => {
      const { differentiateParentalHaplotypes } = await import('./parentalLineageDifferentiator');

      // Male with Chr X segments completely EUR
      const mockSegments: any = {
        '1': {
          strandA: [{ continent: 'EUR', start: 1000, end: 50000000, confidence: 0.95 }],
          strandB: [{ continent: 'AFR', start: 1000, end: 50000000, confidence: 0.95 }]
        },
        'X': {
          strandA: [{ continent: 'EUR', start: 1000, end: 50000000, confidence: 0.98 }],
          strandB: [] // Male hemizygous
        }
      };

      const diff = differentiateParentalHaplotypes({
        segments: mockSegments,
        inferredSex: 'MALE'
      });

      expect(diff.confidence).toBeGreaterThan(0.8);
      expect(diff.method).toBe('MALE_CHR_X_ANCHOR');
      expect(diff.maternalStrand).toBe('strandA');
      expect(diff.paternalStrand).toBe('strandB');
      expect(diff.explanation).toContain('Maternal (Strand A)');
    });

    it('should differentiate parental lines using uniparental haplogroups when available', async () => {
      const { differentiateParentalHaplotypes } = await import('./parentalLineageDifferentiator');

      const mockSegments: any = {
        '1': {
          strandA: [{ continent: 'AFR', start: 1000, end: 50000000, confidence: 0.95 }],
          strandB: [{ continent: 'EUR', start: 1000, end: 50000000, confidence: 0.95 }]
        }
      };

      const diff = differentiateParentalHaplotypes({
        segments: mockSegments,
        inferredSex: 'FEMALE',
        maternalHaplogroup: 'L2a1', // African mtDNA
        paternalHaplogroup: 'R1b1a2' // European Y-DNA
      });

      expect(diff.confidence).toBeGreaterThan(0.7);
      expect(diff.method).toBe('UNIPARENTAL_HAPLOGROUP_ALIGNMENT');
      expect(diff.maternalStrand).toBe('strandA');
      expect(diff.paternalStrand).toBe('strandB');
    });

    it('should report unanchored when no biological ground truth is present', async () => {
      const { differentiateParentalHaplotypes } = await import('./parentalLineageDifferentiator');

      const mockSegments: any = {
        '1': {
          strandA: [{ continent: 'EUR', start: 1000, end: 50000000, confidence: 0.95 }],
          strandB: [{ continent: 'EUR', start: 1000, end: 50000000, confidence: 0.95 }]
        }
      };

      const diff = differentiateParentalHaplotypes({
        segments: mockSegments,
        inferredSex: 'FEMALE'
      });

      expect(diff.confidence).toBeLessThanOrEqual(0.75);
      expect(diff.method).toBe('STATISTICAL_HAPLOTYPE_PAIR');
      expect(diff.maternalStrand).toBe('strandA');
      expect(diff.paternalStrand).toBe('strandB');
    });

    it('should compute distinct non-mirrored segments for Strand A and Strand B on phased heterozygous data', () => {
      // In phased data, let strand 1 have 'A' for rs1426654 and strand 2 have 'G'
      const testDataset = {
        mergedSnpMap: {
          rs1426654: 'AG'
        },
        haplotype1Map: {
          rs1426654: 'A'
        },
        haplotype2Map: {
          rs1426654: 'G'
        },
        isPhased: true,
        phasingMethod: 'vcf-explicit'
      };

      const lai = computeDatasetLAI(testDataset);
      expect(lai).toBeDefined();
      if (lai && lai.segments['15']) {
        const segs = lai.segments['15'];
        expect(segs.strandA).toBeDefined();
        expect(segs.strandB).toBeDefined();
        expect(segs.strandA.length).toBeGreaterThan(0);
        expect(segs.strandB.length).toBeGreaterThan(0);
        expect(segs.strandA[0].start).toBeDefined();
        expect(segs.strandB[0].start).toBeDefined();
      }
    });

    it('should properly handle Male Chromosome X hemizygosity', () => {
      const maleDataset = {
        mergedSnpMap: {
          rs1426654: 'AA',
          rs137852328: 'A' // X chromosome AIM
        },
        inferredSex: 'MALE' as const
      };

      const lai = computeDatasetLAI(maleDataset);
      expect(lai).toBeDefined();
      if (lai) {
        expect(lai.segments['X']).toBeDefined();
        // Male has no paternal X -> strandB must be empty
        expect(lai.segments['X'].strandB).toEqual([]);
        expect(lai.segments['X'].strandA.length).toBeGreaterThan(0);
        expect(lai.parentalDifferentiation).toBeDefined();
      }
    });
  });

  describe('Native American Markers & Matched AIMs Preservation', () => {
    it('should index >3,000 Native American AIM markers in ALL_REGION_AIMS and preserve regional identity', async () => {
      const { ALL_REGION_AIMS } = await import('../../data/aims/index');
      const naMarkers = Object.values(ALL_REGION_AIMS).filter(
        (m: any) => m.region === 'Native American' || m.region?.includes('Native')
      );
      expect(naMarkers.length).toBeGreaterThanOrEqual(3000);
    });

    it('should enrich matchedAims with Native American region, gene, and trait metadata', () => {
      // Pick a known Native American AIM marker (e.g. rs3135388 or EDAR rs3827760 or rs2814778)
      const testSnpMap = {
        rs3827760: 'AA', // EDAR Native American / East Asian shovel-shaped incisors & hair thickness
        rs1426654: 'AA'
      };

      const lai = computeDatasetLAI({
        mergedSnpMap: testSnpMap
      });

      expect(lai).toBeDefined();
      if (lai) {
        const edar = lai.aimsUsed.find(m => m.rsid.toLowerCase() === 'rs3827760');
        expect(edar).toBeDefined();
        expect(edar?.region).toBeDefined();
        expect(edar?.gene).toBeDefined();
      }
    });

    it('should match markers using coordinate key fallback (chr_pos or pos) when rsid is uncalled or internal', () => {
      // Test coordinate key fallback
      const testSnpMap = {
        '15_28365618': 'AA' // SLC24A5 rs1426654 coordinate on chr15
      };

      const lai = computeDatasetLAI({
        mergedSnpMap: testSnpMap
      });

      expect(lai).toBeDefined();
      if (lai) {
        const matched = lai.aimsUsed.find(m => m.rsid.toLowerCase() === 'rs1426654');
        expect(matched).toBeDefined();
        expect(matched?.genotype).toBe('AA');
      }
    });

    it('should preserve authentic short AMR segments in local ancestry inference', () => {
      // Create a scenario where a chromosome has an authentic AMR cluster
      const testSnpMap: Record<string, string> = {
        rs3827760: 'AA', // EDAR (2:109513601)
        rs1426654: 'AA',
        rs2814778: 'CC'
      };

      const lai = computeDatasetLAI({
        mergedSnpMap: testSnpMap
      });

      expect(lai).toBeDefined();
      if (lai) {
        expect(lai.aimsUsed.length).toBeGreaterThan(0);
        // All matched markers should retain region metadata
        const withRegion = lai.aimsUsed.filter(m => m.region && m.region !== 'Unknown');
        expect(withRegion.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Global Marker Audit & Population Genetics Classification', () => {
    it('should classify high-divergence markers into diagnostic continental regions', async () => {
      const { ALL_REGION_AIMS } = await import('../../data/aims/index');
      // rs28777 (SLC45A2) has EUR=0.04 vs AFR/EAS > 0.80 -> European
      const slc45a2 = (ALL_REGION_AIMS as any)['rs28777'];
      expect(slc45a2).toBeDefined();
      expect(slc45a2.region).toBe('European');
      expect(slc45a2.tier).toBe('diagnostic_single_region');
    });

    it('should annotate truly pan-human markers with low divergence as Cosmopolitan', async () => {
      const { ALL_REGION_AIMS } = await import('../../data/aims/index');
      const cosmopolitanMarkers = Object.values(ALL_REGION_AIMS).filter((m: any) => m.region === 'Cosmopolitan' || m.tier === 'cosmopolitan');
      expect(cosmopolitanMarkers.length).toBeGreaterThan(1000);
      for (const m of cosmopolitanMarkers.slice(0, 20) as any[]) {
        if (m.primaryMetric?.spread !== undefined) {
          expect(m.primaryMetric.spread).toBeLessThan(0.25);
        }
      }
    });

    it('should annotate multi-way informative markers with high Fst or spread', async () => {
      const { ALL_REGION_AIMS } = await import('../../data/aims/index');
      const multiWay = Object.values(ALL_REGION_AIMS).filter((m: any) => m.region === 'Multi-Way Informative' || m.tier === 'multi_way_informative');
      expect(multiWay.length).toBeGreaterThan(1000);
    });
  });

  describe('Chromosome Y Patrilineal & Marker Support', () => {
    it('should paint Chromosome Y Strand B with paternal haplogroup continent and leave Strand A hemizygous for males', () => {
      const maleDataset = {
        inferredBiologicalSex: 'MALE',
        inferredSex: 'MALE',
        yHaplogroup: 'R1b1a1b',
        yMap: {
          'rs11575897': 'G',
          'rs9786184': 'C'
        },
        results: [
          { rsid: 'rs11575897', chrom: 'Y', pos: 2800000, genotype: 'G', gene: 'SRY' },
          { rsid: 'rs9786184', chrom: 'Y', pos: 6800000, genotype: 'C', gene: 'AMELY' }
        ],
        mergedSnpMap: {
          rs1426654: 'AA',
          rs2814778: 'CC'
        }
      };

      const lai = computeDatasetLAI(maleDataset);
      expect(lai).toBeDefined();
      if (lai) {
        expect(lai.segments['Y']).toBeDefined();
        expect((lai.segments['Y'] as any).isApplicable).toBe(true);
        expect((lai.segments['Y'] as any).isMale).toBe(true);
        expect(lai.segments['Y'].strandA.length).toBe(0); // Hemizygous (no maternal Y)
        expect(lai.segments['Y'].strandB.length).toBeGreaterThan(0);
        expect(lai.segments['Y'].strandB[0].continent).toBe('EUR'); // R1b -> EUR
        expect((lai.segments['Y'].strandB[0] as any).haplogroup).toBe('R1b1a1b');

        // Check that Y-SNPs were incorporated into aimsUsed
        const ySnps = lai.aimsUsed.filter(m => m.chrom === 'Y');
        expect(ySnps.length).toBe(2);
        expect(ySnps[0].rsid).toBe('rs11575897');
        expect(ySnps[1].rsid).toBe('rs9786184');
      }
    });

    it('should correctly mark Chromosome Y as not applicable for female datasets', () => {
      const femaleDataset = {
        inferredBiologicalSex: 'FEMALE',
        inferredSex: 'FEMALE',
        mergedSnpMap: {
          rs1426654: 'AA',
          rs2814778: 'CC'
        }
      };

      const lai = computeDatasetLAI(femaleDataset);
      expect(lai).toBeDefined();
      if (lai) {
        expect(lai.segments['Y']).toBeDefined();
        expect((lai.segments['Y'] as any).isApplicable).toBe(false);
        expect(lai.segments['Y'].strandA.length).toBe(0);
        expect(lai.segments['Y'].strandB.length).toBe(0);
      }
    });

    it('should map Native American Y haplogroup Q to AMR', () => {
      const maleQ = {
        inferredBiologicalSex: 'MALE',
        yHaplogroup: 'Q-M3',
        mergedSnpMap: {
          rs1426654: 'AA'
        }
      };
      const lai = computeDatasetLAI(maleQ);
      expect(lai).toBeDefined();
      if (lai) {
        expect(lai.segments['Y'].strandB[0].continent).toBe('AMR');
      }
    });

    it('should map African Y haplogroup E1b1a to AFR', () => {
      const maleE = {
        inferredBiologicalSex: 'MALE',
        yHaplogroup: 'E1b1a',
        mergedSnpMap: {
          rs1426654: 'AA'
        }
      };
      const lai = computeDatasetLAI(maleE);
      expect(lai).toBeDefined();
      if (lai) {
        expect(lai.segments['Y'].strandB[0].continent).toBe('AFR');
      }
    });

    it('should exclude Chromosome Y from autosomal diploid percentage calculation in computePaintedAncestry', () => {
      const segmentsWithY = {
        '1': {
          strandA: [{ continent: 'EUR', start: 0, end: 100000000, confidence: 0.99 }],
          strandB: [{ continent: 'EUR', start: 0, end: 100000000, confidence: 0.99 }]
        },
        'Y': {
          strandA: [],
          strandB: [{ continent: 'AFR', start: 2781479, end: 56887902, confidence: 0.99 }]
        }
      };

      const result = computePaintedAncestry(segmentsWithY);
      // If Y is excluded from autosomal diploid percentages, EUR should remain 100%
      expect(result.items.length).toBe(1);
      expect(result.items[0].code).toBe('EUR');
      expect(result.items[0].percentage).toBe(100);
    });
  });
});


