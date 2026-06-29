import { describe, it, expect } from 'vitest';
import { pruneMarkersByPhysicalDistance } from './ldPruner';
import { processSubpopulations } from '../../components/ancestryOracleLogic';

describe('LD Pruner Utility', () => {
  it('should prune physically linked markers on the same chromosome', () => {
    const markers = [
      { rsid: 'm1', chromosome: '1', position: 10000, weight: 1.0 },
      { rsid: 'm2', chromosome: '1', position: 20000, weight: 2.0 }, // links with m1, keeps m2 because of weight
      { rsid: 'm3', chromosome: '1', position: 80000, weight: 1.0 }, // outside 50kb window
      { rsid: 'm4', chromosome: '2', position: 15000, weight: 1.0 }, // different chromosome
    ];

    const pruned = pruneMarkersByPhysicalDistance(markers, 50000);
    const rsids = pruned.map(m => m.rsid);

    expect(rsids).toContain('m2');
    expect(rsids).not.toContain('m1'); // m1 should be pruned in favor of higher-weighted m2
    expect(rsids).toContain('m3');
    expect(rsids).toContain('m4');
  });
});

describe('Hierarchical Deconvolution Routing', () => {
  it('should process subpopulation deconvolution and yield valid percentages', async () => {
    // Generate a mock dataset of user genotypes
    const userGenotypes = [
      { rsid: 'rs2887286', genotype: 'TT' },
      { rsid: 'rs2840528', genotype: 'AA' },
      { rsid: 'rs3890745', genotype: 'TT' },
      { rsid: 'rs1181875', genotype: 'TT' },
      { rsid: 'rs6663840', genotype: 'GG' }
    ];

    // Mock AIM database
    const aimsDatabase = [
      { rsid: 'rs2887286', chromosome: '1', position: 1220751, continent: 'EUR' },
      { rsid: 'rs2840528', chromosome: '1', position: 2352457, continent: 'EUR' },
      { rsid: 'rs3890745', chromosome: '1', position: 2622185, continent: 'EUR' },
      { rsid: 'rs1181875', chromosome: '1', position: 3765267, continent: 'EUR' },
      { rsid: 'rs6663840', chromosome: '1', position: 3826755, continent: 'EUR' }
    ];

    const results = await processSubpopulations(userGenotypes, aimsDatabase);
    
    expect(results).toHaveProperty('topMatch');
    expect(results).toHaveProperty('admixtureMix');
    expect(results.admixtureMix.length).toBeGreaterThan(0);
    
    // Total proportions should sum to 100%
    const totalPercentage = results.admixtureMix.reduce((sum: number, item: any) => sum + item.percentage, 0);
    expect(totalPercentage).toBeCloseTo(100.0, 1);
  });
});
