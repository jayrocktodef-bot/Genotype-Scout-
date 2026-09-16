import { describe, it, expect } from 'vitest';
import {
  parseMtMutation,
  matchPhyloTreeBuild17,
  refineMtdnaWithBuild17,
  getMtdnaCircularDistance,
  PhylotreeBranch
} from './phylotreeMtdnaEngine';

describe('PhyloTree mtDNA Engine', () => {
  describe('parseMtMutation', () => {
    it('parses standard RefPosAlt mutations (e.g. G263A)', () => {
      const mut = parseMtMutation('G263A');
      expect(mut).not.toBeNull();
      expect(mut?.ancestral).toBe('G');
      expect(mut?.position).toBe(263);
      expect(mut?.derived).toBe('A');
      expect(mut?.isTransversion).toBe(false);
    });

    it('parses transversion mutations with 4.5x weight multiplier', () => {
      const transition = parseMtMutation('A263G'); // Transition A<->G
      const transversion = parseMtMutation('A263C'); // Transversion A<->C

      expect(transition?.weight).toBe(1.0);
      expect(transversion?.weight).toBe(4.5);
    });

    it('parses insertion notation like 309.1C and 315.1C', () => {
      const mut1 = parseMtMutation('309.1C');
      const mut2 = parseMtMutation('315.1C');

      expect(mut1).not.toBeNull();
      expect(mut1?.position).toBe(309);
      expect(mut1?.derived).toBe('C');

      expect(mut2).not.toBeNull();
      expect(mut2?.position).toBe(315);
      expect(mut2?.derived).toBe('C');
    });

    it('dampens weights for hypervariable mutational hotspots (16519, 309, 315, 16189)', () => {
      const normalMut = parseMtMutation('C1048T');
      const hotspotMut = parseMtMutation('T16519C');

      expect(normalMut?.isHotspot).toBe(false);
      expect(hotspotMut?.isHotspot).toBe(true);
      expect(hotspotMut?.weight).toBeLessThan(normalMut!.weight);
    });
  });

  describe('getMtdnaCircularDistance', () => {
    it('calculates direct and wrap-around circular distances on rCRS (16,569 bp)', () => {
      expect(getMtdnaCircularDistance(100, 200)).toBe(100);
      // Distance across origin (16560 -> 10 = 19 bp)
      expect(getMtdnaCircularDistance(16560, 10)).toBe(19);
    });
  });

  describe('matchPhyloTreeBuild17 & IUPAC / Allele Matching', () => {
    const testBranches: PhylotreeBranch[] = [
      { branchName: 'H1a', mutations: ['G263A', 'A73G', 'C7028T', 'G3010A'] },
      { branchName: 'L0a', mutations: ['C146T', 'A182G', 'A189G', 'T16519C'] }
    ];

    it('matches user mutations against PhyloTree branches using single or IUPAC calls', () => {
      const userPosMap: Record<number, string> = {
        263: 'A',    // derived for H1a
        73: 'R',     // IUPAC code 'R' (A/G) matching G
        7028: 'T',   // derived for H1a
        3010: 'A'    // derived for H1a
      };

      const matches = matchPhyloTreeBuild17(userPosMap, testBranches);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].branchName).toBe('H1a');
      expect(matches[0].matchedCount).toBe(4);
    });

    it('downweights ancestral clashes on deeply nested branches', () => {
      const userPosMap: Record<number, string> = {
        263: 'G',    // ancestral call for H1a
        73: 'A',     // ancestral call for H1a
        7028: 'C'    // ancestral call for H1a
      };

      const matches = matchPhyloTreeBuild17(userPosMap, testBranches);
      expect(matches.length).toBe(0);
    });
  });

  describe('refineMtdnaWithBuild17 Macro-Haplogroup Fallback', () => {
    it('falls back gracefully to parent macro-haplogroup if derived mutation coverage is insufficient', () => {
      const baseLineage: any = {
        terminalHaplogroup: { code: 'H', shortName: 'mtDNA-H' },
        confidenceScore: 75,
        coverage: 50
      };

      // Weak match score (< 1.5) or 0 non-NUMT derived matches
      const weakMatches: any[] = [
        {
          branchName: 'H1a1b',
          score: 0.5,
          matchedCount: 1,
          nonNumtMatchedCount: 0,
          totalMutations: 6,
          pathConsistencyPct: 20
        }
      ];

      const refined = refineMtdnaWithBuild17(baseLineage, weakMatches);
      // Should fall back to macro-haplogroup H
      expect(refined.terminalHaplogroup.code).toBe('H');
    });
  });
});
