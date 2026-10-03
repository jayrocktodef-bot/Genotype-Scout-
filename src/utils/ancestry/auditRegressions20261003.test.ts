import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { DOUBLE_WEIGHT_MARKERS, QUADRUPLE_WEIGHT_MARKERS } from '../../services/ancestryEngine';
import { getMarkerAllowlist } from '../markerAllowlist';
import { matchGenotypeAlleles, isPalindromicPair, complementBase } from '../strandMatcher';
import { validateAimRecord } from '../dataValidator';

const DEPRECATED_IDS = [
  'rs10456220',
  'rs10456230',
  'rs10456345',
  'rs10456353',
  'rs10456393',
  'rs10456403',
  'rs10456418',
  'rs10456315',
];

describe('2026-10-03 AIM Database Audit Regression Suite', () => {
  describe('(a) Critical C-1: All 8 deprecated IDs absent from panels and weight sets', () => {
    it('ensures all 8 deprecated rsIDs are removed from DOUBLE_WEIGHT_MARKERS and QUADRUPLE_WEIGHT_MARKERS', () => {
      for (const id of DEPRECATED_IDS) {
        expect(DOUBLE_WEIGHT_MARKERS.has(id)).toBe(false);
        expect(QUADRUPLE_WEIGHT_MARKERS.has(id)).toBe(false);
      }
    });

    it('ensures all 8 deprecated rsIDs are purged from all AIM panel files and master_aims_normalized.json', () => {
      const panelFiles = [
        'src/data/aims/african.json',
        'src/data/aims/global.json',
        'src/data/aims/native_american.json',
        'src/data/aims/central_asian.json',
        'src/data/aims/east_asian.json',
        'src/data/aims/european.json',
        'src/data/master_aims_normalized.json',
      ];

      for (const relPath of panelFiles) {
        const fullPath = path.join(process.cwd(), relPath);
        if (!fs.existsSync(fullPath)) continue;
        const content = fs.readFileSync(fullPath, 'utf-8');
        const data = JSON.parse(content);

        const rsids = new Set<string>();
        if (Array.isArray(data)) {
          data.forEach(item => {
            if (item.rsid) rsids.add(item.rsid.toLowerCase());
          });
        } else {
          Object.keys(data).forEach(k => rsids.add(k.toLowerCase()));
        }

        for (const id of DEPRECATED_IDS) {
          expect(rsids.has(id.toLowerCase())).toBe(false);
        }
      }
    });
  });

  describe('(b) Critical C-2: Authenticity check fails on merged/deprecated dbSNP IDs', () => {
    it('throws or logs an authenticity error when validating a record with a merged/deprecated rsID', () => {
      // Seeded merged rsID fixture
      const fixtureRecord = {
        rsid: 'rs10456220', // Deprecated; merged into rs686140
        chromosome: '6',
        position: 18925121,
        region: 'African',
        alleles: ['A', 'G'],
        frequencies: { EUR: 0.1, AFR: 0.9 },
        weight: 1,
        build: 'GRCh38',
      };

      const result = validateAimRecord(fixtureRecord);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('merged/deprecated') || e.includes('rs686140'))).toBe(true);
    });

    it('passes validation for authentic current rsIDs', () => {
      const validRecord = {
        rsid: 'rs686140', // Current valid ID for merged rs10456220
        chromosome: '6',
        position: 18925121,
        region: 'African',
        alleles: ['A', 'G'],
        frequencies: { EUR: 0.1, AFR: 0.9 },
        weight: 1,
        build: 'GRCh38',
      };

      const result = validateAimRecord(validRecord);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe('(c) High H-1: Marker allowlist keys are build-namespaced', () => {
    it('contains grch38: and grch37: namespaced coordinate keys', () => {
      const allowlist = getMarkerAllowlist();

      // Check that namespaced keys exist in the allowlist
      let hasGrch38 = false;
      let hasGrch37 = false;

      for (const key of allowlist) {
        if (key.startsWith('grch38:')) hasGrch38 = true;
        if (key.startsWith('grch37:')) hasGrch37 = true;
        if (hasGrch38 && hasGrch37) break;
      }

      expect(hasGrch38).toBe(true);
      expect(hasGrch37).toBe(true);
    });
  });

  describe('(d) High H-3: Strand matcher handles forward, reverse-complement, and palindromic cases', () => {
    it('correctly matches forward strand without complementing', () => {
      const res = matchGenotypeAlleles('AG', 'A', { otherAllele: 'G' });
      expect(res.dosage).toBe(1);
      expect(res.isComplement).toBe(false);
      expect(res.isPalindromic).toBe(false);
    });

    it('correctly complements reverse-strand non-palindromic SNPs', () => {
      // User kit on minus strand: call is TC for an A/G forward locus. Target is A.
      const res = matchGenotypeAlleles('TC', 'A', { otherAllele: 'G' });
      expect(res.dosage).toBe(1);
      expect(res.isComplement).toBe(true);
      expect(res.isPalindromic).toBe(false);
    });

    it('strictly forbids complementing palindromic SNPs (A/T and C/G)', () => {
      // Palindromic A/T SNP: Target is A.
      expect(isPalindromicPair('A', 'T')).toBe(true);

      // User has homozygous TT. In a naive complement-tolerant engine, TT -> AA -> dosage 2.
      // Under H-3 invariant, TT must NEVER be complemented to AA:
      const resTT = matchGenotypeAlleles('TT', 'A', { otherAllele: 'T' });
      expect(resTT.dosage).toBe(0);
      expect(resTT.isComplement).toBe(false);
      expect(resTT.isPalindromic).toBe(true);

      // Heterozygote AT with target A: forward matches A, T is NOT complemented.
      const resAT = matchGenotypeAlleles('AT', 'A', { otherAllele: 'T' });
      expect(resAT.dosage).toBe(1);
      expect(resAT.isComplement).toBe(false);
      expect(resAT.isPalindromic).toBe(true);
    });
  });
});
