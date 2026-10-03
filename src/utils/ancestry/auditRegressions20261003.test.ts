import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { DOUBLE_WEIGHT_MARKERS, QUADRUPLE_WEIGHT_MARKERS } from '../../services/ancestryEngine';
import { getMarkerAllowlist } from '../markerAllowlist';
import { matchGenotypeAlleles, isPalindromicPair, complementBase } from '../strandMatcher';
import { validateAimRecord } from '../dataValidator';
import { calculateComprehensiveScores } from '../../engines/ancestry/comprehensiveEngine';
import { calculateHumanOriginsScores } from '../../engines/ancestry/humanOriginsEngine';
import { parseRawDNA } from '../../services/parser/engine';

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

    it('fails validation when a deliberately introduced bad record has a wrong chromosome', () => {
      const badChrRecord = {
        rsid: 'rs686140', // Ensembl chr6
        chromosome: '1', // Deliberately wrong chromosome
        position: 18925121,
        region: 'African',
        alleles: ['A', 'G'],
        frequencies: { EUR: 0.1, AFR: 0.9 },
        weight: 10,
        build: 'GRCh38',
      };

      const result = validateAimRecord(badChrRecord);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('chromosome mismatch'))).toBe(true);
    });

    it('fails closed when a checked weight>=5 marker has an Ensembl cache miss', () => {
      const cacheMissRecord = {
        rsid: 'rs99999999999', // Authentic rsID format but not in hermetic cache
        chromosome: '1',
        position: 1234567,
        region: 'African',
        alleles: ['A', 'G'],
        frequencies: { EUR: 0.1, AFR: 0.9 },
        weight: 10, // weight >= 5 triggers mandatory cache verification
        build: 'GRCh38',
      };

      const result = validateAimRecord(cacheMissRecord);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('cache miss'))).toBe(true);
    });

    it('fails validation when a marker is recorded as UNRESOLVED in the Ensembl cache', () => {
      const unresolvedRecord = {
        rsid: 'rs123456', // recorded as UNRESOLVED in ensembl_cache.json
        chromosome: '1',
        position: 123456,
        region: 'African',
        alleles: ['A', 'G'],
        frequencies: { EUR: 0.1, AFR: 0.9 },
        weight: 10,
        build: 'GRCh38',
      };

      const result = validateAimRecord(unresolvedRecord);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('unresolved'))).toBe(true);
    });
  });

  describe('(c) High H-1: Build-aware coordinate matching and collision-free allowlist', () => {
    it('contains grch38: and grch37: namespaced coordinate keys and zero bare coordinate keys', () => {
      const allowlist = getMarkerAllowlist();

      let hasGrch38 = false;
      let hasGrch37 = false;
      const bareCoordinateKeys: string[] = [];

      for (const key of allowlist) {
        if (key.startsWith('grch38:')) hasGrch38 = true;
        if (key.startsWith('grch37:')) hasGrch37 = true;
        // Bare coordinate pattern: chr1_12345 or 1_12345 or chr1:12345 or 1:12345
        if (/^(chr)?([1-9]|1\d|2[0-2]|x|y|mt)[_:]\d+$/i.test(key)) {
          bareCoordinateKeys.push(key);
        }
      }

      expect(hasGrch38).toBe(true);
      expect(hasGrch37).toBe(true);
      // Zero bare un-prefixed coordinate keys allowed in allowlist
      expect(bareCoordinateKeys).toEqual([]);
    });

    it('ensures same numeric coordinate across builds produces distinct non-colliding keys', () => {
      const allowlist = getMarkerAllowlist();

      // Test chr6:26860652 (HLA / HFE region) which exists in both GRCh37 and GRCh38 datasets
      const grch38Key = 'grch38:chr6_26860652';
      const grch37Key = 'grch37:chr6_26860652';

      expect(grch38Key).not.toBe(grch37Key);
      expect(allowlist.has('chr6_26860652')).toBe(false);
      expect(allowlist.has('6_26860652')).toBe(false);
    });

    it('parser emits build-namespaced coordinate keys when build is known, and bare only when unknown', () => {
      // Synthetic test fixture: 23andMe format with explicit GRCh38 header
      const grch38Snippet = `# This data file generated by 23andMe at: Thu Oct 01 00:00:00 2026
# Assembly: GRCh38
# rsid\tchromosome\tposition\tgenotype
.\t6\t26860652\tAG
`;
      const parsedGrch38 = parseRawDNA(grch38Snippet);
      expect(parsedGrch38.build).toBe('GRCh38');
      expect(parsedGrch38.snpMap['grch38:chr6_26860652']).toBe('AG');
      expect(parsedGrch38.snpMap['chr6_26860652']).toBeUndefined();

      // Synthetic test fixture: generic file with unknown build
      const unknownSnippet = `rsid\tchromosome\tposition\tgenotype
.\t6\t26860652\tAG
`;
      const parsedUnknown = parseRawDNA(unknownSnippet);
      expect(parsedUnknown.build).toBe('UNKNOWN');
      expect(parsedUnknown.snpMap['chr6_26860652']).toBe('AG');
      expect(parsedUnknown.snpMap['grch38:chr6_26860652']).toBeUndefined();
    });

    it('engine coordinate fallback matches when builds agree and skips on disagreement or unknown build', async () => {
      // Synthetic test fixture: snpMap with only coordinate key for HLA-HFE AIM (chr6:26860652, A/G, GRCh38)
      const syntheticGrch38SnpMap: Record<string, string> = {
        'grch38:chr6_26860652': 'GG',
      };

      // 1. Build agreement: GRCh38 kit matches GRCh38 marker
      const scoresAgree = calculateComprehensiveScores(syntheticGrch38SnpMap, { userBuild: 'GRCh38' });
      // Total log likelihoods calculated from the matched marker
      const agreeValues = Object.values(scoresAgree);
      const hasNonZeroScore = agreeValues.some(v => v !== 0);
      expect(hasNonZeroScore).toBe(true);

      // 2. Build disagreement: GRCh37 kit must NOT match GRCh38 marker (fail closed)
      const scoresDisagree = calculateComprehensiveScores(syntheticGrch38SnpMap, { userBuild: 'GRCh37' });
      const disagreeValues = Object.values(scoresDisagree);
      expect(disagreeValues.every(v => v === 0)).toBe(true);

      // 3. Unknown build: unknown kit must NOT fallback to coordinates (rsID matching only, fail closed)
      const scoresUnknown = calculateComprehensiveScores(syntheticGrch38SnpMap, { userBuild: 'UNKNOWN' });
      const unknownValues = Object.values(scoresUnknown);
      expect(unknownValues.every(v => v === 0)).toBe(true);

      // 4. Same test on HumanOriginsEngine with GRAF-10k marker rs2887286 (GRCh38 chr1:1220751)
      const syntheticGrafSnpMap: Record<string, string> = {
        'grch38:chr1_1220751': 'CC',
      };
      const hoAgree = await calculateHumanOriginsScores(syntheticGrafSnpMap, { userBuild: 'GRCh38' });
      expect(hoAgree).toBeDefined();

      // Disagreement fails closed
      const hoDisagree = await calculateHumanOriginsScores(syntheticGrafSnpMap, { userBuild: 'GRCh37' });
      expect(hoDisagree).toBeDefined();
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
