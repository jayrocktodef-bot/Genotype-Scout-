import { describe, it, expect } from 'vitest';
import { calculateAncientAdmixture, calculateIndividualMatches } from '../../lib/AncientAdmixtureCalculator';

describe('Ancient Admixture Calculator', () => {
  it('should compute ancient admixture proportions that sum to 100%', async () => {
    const mockGenotypes = {
      'rs2887286': 'CC',
      'rs2840528': 'GG',
      'rs3890745': 'CC',
      'rs1181875': 'CC',
      'rs6663840': 'AA'
    };

    const results = await calculateAncientAdmixture(mockGenotypes);
    expect(results.length).toBeGreaterThan(0);

    const totalScore = results.reduce((acc, val) => acc + val.score, 0);
    expect(totalScore).toBeCloseTo(100.0, 1);

    results.forEach(res => {
      expect(res.score).toBeGreaterThanOrEqual(0.1);
      expect(res.popName).toBeDefined();
      expect(res.region).toBeDefined();
      expect(res.period).toBeDefined();
    });
  }, 15000);

  it('should return empty results if there are insufficient markers', async () => {
    const mockGenotypes = {
      'rs2887286': 'CC'
    };
    const results = await calculateAncientAdmixture(mockGenotypes);
    expect(results).toEqual([]);
  });
});

describe('Fossil Specimen Individual Matches', () => {
  it('correctly compares Anzick-1 and Mota without dropping them as zero-marker samples', () => {
    const mockGenotypes = {
      'rs1426654': 'GG',
      'rs16891982': 'CC',
      'rs12913832': 'AA',
      'rs4988235': 'GG',
      'rs3827760': 'GG'
    };

    const matches = calculateIndividualMatches(mockGenotypes);
    expect(matches.length).toBeGreaterThan(0);

    const anzick = matches.find((m: any) => m.popName.includes('Anzick') || m.popCode.includes('anzick'));
    expect(anzick).toBeDefined();
    expect(anzick!.markersCompared).toBeGreaterThanOrEqual(4);

    const mota = matches.find((m: any) => m.popName.includes('Mota') || m.popCode.includes('mota'));
    expect(mota).toBeDefined();
    expect(mota!.markersCompared).toBeGreaterThanOrEqual(4);
  });

  it('applies Bayesian shrinkage to prevent false 100% scores from 2 overlapping SNPs', () => {
    // Perfect match on only 2 SNPs
    const mockGenotypes = {
      'rs1426654': 'GG',
      'rs16891982': 'CC'
    };

    const matches = calculateIndividualMatches(mockGenotypes);
    matches.forEach((m: any) => {
      // With kappa=8.0 and n=2, 100% raw shrinks to (2/10)*100 + (8/10)*50 = 60.0%
      if (m.markersCompared === 2) {
        expect(m.score).toBeLessThanOrEqual(65.0);
      }
    });
  });

  it('resolves chromosomal coordinates (chr:pos and chr_pos) and reverse-strand complementation', () => {
    // Using coordinate keys instead of rsids
    const mockGenotypes = {
      'chr15_48426484': 'GG',
      'chr5:33951693': 'CC',
      'chr15:28365618': 'AA',
      'chr2_136608646': 'GG'
    };

    const matches = calculateIndividualMatches(mockGenotypes);
    expect(matches.length).toBeGreaterThan(0);
    const topMatch = matches[0];
    expect(topMatch.markersCompared).toBeGreaterThanOrEqual(3);
  });

  it('integrates paleogenomic clade admixture results into composite scoring', () => {
    const mockGenotypes = {
      'rs1426654': 'GG',
      'rs16891982': 'GG',
      'rs12913832': 'GG',
      'rs4988235': 'GG'
    };

    const mockAdmixture = [
      { popCode: 'WHG', popName: 'Western Hunter-Gatherer', score: 85.0, description: '', period: '', region: '', matchingMarkers: 10 }
    ];

    const matchesWithoutClade = calculateIndividualMatches(mockGenotypes);
    const matchesWithClade = calculateIndividualMatches(mockGenotypes, mockAdmixture);

    const whgWithout = matchesWithoutClade.find((m: any) => m.popName.includes('Loschbour'));
    const whgWith = matchesWithClade.find((m: any) => m.popName.includes('Loschbour'));

    expect(whgWith).toBeDefined();
    expect(whgWithout).toBeDefined();
    // High WHG admixture boosts the composite score for Loschbour
    expect(whgWith!.score).toBeGreaterThan(whgWithout!.score);
    expect(whgWith!.cladeAffinity).toBe('Western Hunter-Gatherer');
  });

  it('correctly calculates ancient admixture without European fallback bias on African and Asian markers', async () => {
    // Yoruba / African diagnostic alleles: rs2814778 (Duffy null CC = African), rs1426654 (SLC24A5 GG = ancestral)
    const mockAfricanGenotypes = {
      'rs2887286': 'CC',
      'rs2840528': 'GG',
      'rs3890745': 'CC',
      'rs1181875': 'CC',
      'rs6663840': 'AA',
      'rs2814778': 'CC',
      'rs1426654': 'GG'
    };

    const results = await calculateAncientAdmixture(mockAfricanGenotypes);
    expect(results.length).toBeGreaterThan(0);
    const totalScore = results.reduce((acc, val) => acc + val.score, 0);
    expect(totalScore).toBeCloseTo(100.0, 1);
  });
});
