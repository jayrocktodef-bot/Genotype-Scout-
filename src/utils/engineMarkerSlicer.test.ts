import { describe, it, expect } from 'vitest';
import { sliceSnpsForEngine, getEngineMarkerSet } from './engineMarkerSlicer';

describe('engineMarkerSlicer', () => {
  const ALL_ENGINES = [
    'matchSNPs',
    'calculateAncientAdmixture',
    'calculateIndividualMatches',
    'calculateFamousMatches',
    'matchHealthAndWellness',
    'calculatePopulationProximityOptimized',
    'calculateMarkerBenchmarks',
    'calculateHumanOriginsScores',
    'calculateRegionalScores',
    'identifyMicroHapSignatures',
    'calculateComprehensiveScores'
  ];

  it('provides a non-empty marker set for all 11 worker engines', () => {
    for (const engine of ALL_ENGINES) {
      const set = getEngineMarkerSet(engine);
      expect(set.size).toBeGreaterThan(0);
    }
  });

  it('bypasses slicing when snpMap has <= 2,500 markers (test fixtures & small kits)', () => {
    const smallMap: Record<string, string> = {
      rs12913832: 'AA',
      rs1805007: 'CC',
      rs4988235: 'GG'
    };
    const smallMeta: Record<string, { chrom: string; pos: number }> = {
      rs12913832: { chrom: '15', pos: 28365618 }
    };

    const result = sliceSnpsForEngine('matchSNPs', smallMap, smallMeta);
    // Reference equality: bypasses expensive cloning entirely
    expect(result.slicedSnpMap).toBe(smallMap);
    expect(result.slicedMetaMap).toBe(smallMeta);
  });

  it('accurately slices large SNP datasets down to target engine markers only', () => {
    // Generate a mock dataset with 10,000 synthetic background markers and 2 real target markers
    const largeMap: Record<string, string> = {};
    for (let i = 0; i < 10000; i++) {
      largeMap[`bg_marker_${i}`] = 'AA';
    }

    // rs12913832 is in v5MarkersMaster (health), grafIndex, and ancient profiles
    largeMap['rs12913832'] = 'AG';
    // rs1800407 is in MC1R / health
    largeMap['rs1800407'] = 'CC';

    const healthSlice = sliceSnpsForEngine('matchHealthAndWellness', largeMap);
    expect(healthSlice.slicedSnpMap['rs12913832']).toBe('AG');
    expect(healthSlice.slicedSnpMap['rs1800407']).toBe('CC');
    // None of the 10,000 background markers should leak into the worker payload
    expect(Object.keys(healthSlice.slicedSnpMap).length).toBe(2);
  });

  it('preserves uppercase, lowercase, and chromosome coordinate key variants', () => {
    const mapWithCoords: Record<string, string> = {};
    for (let i = 0; i < 3000; i++) mapWithCoords[`dummy_${i}`] = 'TT';

    // Microhaplotype marker in microHapKernel
    mapWithCoords['rs333113'] = 'AA';

    const microHapSlice = sliceSnpsForEngine('identifyMicroHapSignatures', mapWithCoords);
    expect(microHapSlice.slicedSnpMap['rs333113']).toBe('AA');
    expect(Object.keys(microHapSlice.slicedSnpMap).length).toBe(1);
  });

  it('safely falls back to full snpMap for unrecognized engine names', () => {
    const largeMap: Record<string, string> = {};
    for (let i = 0; i < 3000; i++) largeMap[`m_${i}`] = 'GG';

    const fallback = sliceSnpsForEngine('unknown_custom_engine', largeMap);
    expect(fallback.slicedSnpMap).toBe(largeMap);
  });
});
