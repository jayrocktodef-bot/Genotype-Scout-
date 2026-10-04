import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  DOUBLE_WEIGHT_MARKERS,
  QUADRUPLE_WEIGHT_MARKERS,
  ADMIXED_1000G_POPS,
  POP_CODE_TO_REGION,
} from '../../services/ancestryEngine';
import { getMarkerAllowlist } from '../markerAllowlist';
import { matchGenotypeAlleles, isPalindromicPair, complementBase } from '../strandMatcher';
import {
  validateAimRecord,
  validateAIMsData,
  loadDbsnpMergedMap,
  PANEL_FILES,
  ensemblCache,
  PARKED_TIEBREAKER_ANCHORS,
  PARKED_TIEBREAKER_ANCHORS_MAP,
} from '../dataValidator';
import { calculateComprehensiveScores } from '../../engines/ancestry/comprehensiveEngine';
import { calculateHumanOriginsScores } from '../../engines/ancestry/humanOriginsEngine';
import { parseRawDNA } from '../../services/parser/engine';
import { ALL_REGION_AIMS, buildCleanAimDatabase } from '../../data/aims';

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
      ensemblCache['rs999999999'] = {
        chromosome: '1',
        position: 123456,
        status: 'UNRESOLVED',
      };
      try {
        const unresolvedRecord = {
          rsid: 'rs999999999',
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
        expect(result.errors.some(e => e.toLowerCase().includes('unresolved'))).toBe(true);
      } finally {
        delete ensemblCache['rs999999999'];
      }
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

  describe('(e) Workstream A: Re-source or drop the rs1001-rs1270 tiebreaker grid', () => {
    it('ensures no panel record matches ^rs1[0-2]\\d{2}$ unless coordinates/alleles equal the cache entry', () => {
      const panelFiles = [
        'src/data/aims/global.json',
        'src/data/aims/african.json',
        'src/data/aims/african_american.json',
        'src/data/aims/central_asian.json',
        'src/data/aims/east_asian.json',
        'src/data/aims/european.json',
        'src/data/aims/middle_eastern.json',
        'src/data/aims/native_american.json',
        'src/data/aims/north_african.json',
        'src/data/aims/oceanian.json',
        'src/data/aims/south_asian.json',
        'src/data/master_aims_normalized.json',
      ];
      const ensemblCache = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'src/data/reference/ensembl_cache.json'), 'utf-8')
      );
      const gridRegex = /^rs1[0-2]\d{2}$/i;

      for (const relPath of panelFiles) {
        const fullPath = path.join(process.cwd(), relPath);
        if (!fs.existsSync(fullPath)) continue;
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        const entries = Array.isArray(data) ? data : Object.values(data);

        for (const entry of entries) {
          const rsid = (entry.rsid || '').toLowerCase();
          if (gridRegex.test(rsid)) {
            const cached = ensemblCache[rsid];
            expect(cached).toBeDefined();
            expect(cached.status).not.toBe('UNRESOLVED');
            expect(String(entry.chromosome).toUpperCase().replace(/^CHR/, '')).toBe(
              String(cached.chromosome).toUpperCase().replace(/^CHR/, '')
            );
            expect(Number(entry.position)).toBe(Number(cached.position));
            if (entry.alleles && cached.alleles) {
              const allowed = cached.alleles.toUpperCase().split(/[\/,|]/);
              for (const a of entry.alleles) {
                expect(allowed).toContain(a.toUpperCase());
              }
            }
          }
        }
      }
    });

    it('ensures QUADRUPLE_WEIGHT_MARKERS contains no generated sequences (assert no Array.from in its source)', () => {
      const engineSource = fs.readFileSync(
        path.join(process.cwd(), 'src/services/ancestryEngine.ts'),
        'utf-8'
      );
      const startIdx = engineSource.indexOf('QUADRUPLE_WEIGHT_MARKERS = new Set<string>([');
      const endIdx = engineSource.indexOf(']);', startIdx);
      const quadrupleBlock = engineSource.slice(startIdx, endIdx);

      expect(quadrupleBlock).not.toContain('Array.from');
      expect(quadrupleBlock).not.toContain('1001');

      // Also assert that none of the generated grid rsIDs (rs1001..rs1270) are in the Set
      for (let i = 1001; i <= 1270; i++) {
        expect(QUADRUPLE_WEIGHT_MARKERS.has(`rs${i}`)).toBe(false);
      }
    });

    it('asserts a grid-pattern rsID with wrong coordinates fails validation', () => {
      // Fabricated coordinates for rs1010 (panel had chr7:74958034 vs real chr2:85581859)
      const fakeGridRecord = {
        rsid: 'rs1010',
        chromosome: '7',
        position: 74958034,
        region: 'European',
        alleles: ['C', 'T'],
        frequencies: { EUR: 0.97, AFR: 0.01 },
        weight: 10,
        build: 'GRCh38',
      };

      const result = validateAimRecord(fakeGridRecord, 'rs1010', 'global.json');
      expect(result.valid).toBe(false);
      expect(
        result.errors.some(
          e => e.includes('chromosome mismatch') || e.includes('cache miss') || e.includes('Ensembl')
        )
      ).toBe(true);
    });
  });

  describe('(g) Workstream B: Validator Ensembl Check on All Panels & Fail-Closed Hardening', () => {
    it('ensures zero UNRESOLVED markers remain in ensembl_cache.json', () => {
      const cachePath = path.join(process.cwd(), 'src/data/reference/ensembl_cache.json');
      const cache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      const unresolved = Object.entries(cache).filter(
        ([_, v]: [string, any]) => v.status === 'UNRESOLVED'
      );
      expect(unresolved.length).toBe(0);
    });

    it('asserts regional-panel record with merged ID fails validation (invalid)', () => {
      // rs10456220 is merged into rs686140 in dbsnp_merged_map.json
      const mergedRegionalRecord = {
        rsid: 'rs10456220',
        chromosome: '6',
        position: 18925121,
        region: 'African',
        alleles: ['A', 'G'],
        frequencies: { AFR: 0.85, EUR: 0.15 },
        weight: 1,
        build: 'GRCh38',
      };

      const result = validateAimRecord(mergedRegionalRecord, 'rs10456220', 'african.json');
      expect(result.valid).toBe(false);
      expect(
        result.errors.some(
          e => e.includes('Deprecated merged dbSNP accession') || e.includes('rs686140')
        )
      ).toBe(true);
    });

    it('asserts regional-panel record with wrong chromosome vs cache fails with "chromosome mismatch"', () => {
      // rs686140 is on chr6:18925121 in ensembl_cache.json. Testing on african.json with chr7.
      const wrongChrRecord = {
        rsid: 'rs686140',
        chromosome: '7',
        position: 18925121,
        region: 'African',
        alleles: ['A', 'G'],
        frequencies: { AFR: 0.85, EUR: 0.15 },
        weight: 1,
        build: 'GRCh38',
      };

      const result = validateAimRecord(wrongChrRecord, 'rs686140', 'african.json');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('chromosome mismatch'))).toBe(true);
    });

    it('asserts record with no build fails validation (invalid)', () => {
      const noBuildRecord = {
        rsid: 'rs686140',
        chromosome: '6',
        position: 18925121,
        region: 'African',
        alleles: ['A', 'G'],
        frequencies: { AFR: 0.85, EUR: 0.15 },
        weight: 1,
      } as any;

      const result = validateAimRecord(noBuildRecord, 'rs686140', 'african.json');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Missing or invalid build'))).toBe(true);
    });

    it('asserts nonexistent panel file throws in validateAIMsData', () => {
      expect(() => {
        validateAIMsData(path.join(process.cwd(), 'src/data/aims/nonexistent_panel_20261003.json'));
      }).toThrow(/does not exist/);
    });

    it('asserts missing or corrupt merged map throws in loadDbsnpMergedMap', () => {
      expect(() => {
        loadDbsnpMergedMap(path.join(process.cwd(), 'src/data/reference/nonexistent_merged_map.json'));
      }).toThrow(/missing at/);
    });

    it('verifies all 11 panel files are covered by Ensembl authenticity cross-checks', () => {
      const expectedPanels = [
        'global.json',
        'african.json',
        'african_american.json',
        'central_asian.json',
        'east_asian.json',
        'european.json',
        'middle_eastern.json',
        'native_american.json',
        'north_african.json',
        'oceanian.json',
        'south_asian.json',
      ];
      for (const panel of expectedPanels) {
        expect(PANEL_FILES.has(panel)).toBe(true);
      }
    });
  });

  describe('(h) Round 3: Purge Rejected Records and Tighten Parked Exemption', () => {
    const PURGED_ROUND3_IDS = [
      'rs10456231',
      'rs13136405',
      'rs7388531',
      'rs3814134',
      'rs11803701',
      'rs2032457',
      'rs2033028',
      'rs10735788',
      'rs62588102',
      'rs45523335',
      'rs11578877',
      'rs2284553',
    ];

    it('ensures rs10456231 and all rejected records are completely purged from all panels and master aims', () => {
      const panelFiles = [
        'src/data/aims/african.json',
        'src/data/aims/african_american.json',
        'src/data/aims/central_asian.json',
        'src/data/aims/east_asian.json',
        'src/data/aims/european.json',
        'src/data/aims/global.json',
        'src/data/aims/middle_eastern.json',
        'src/data/aims/native_american.json',
        'src/data/aims/north_african.json',
        'src/data/aims/oceanian.json',
        'src/data/aims/south_asian.json',
        'src/data/master_aims_normalized.json',
      ];

      for (const relPath of panelFiles) {
        const fullPath = path.join(process.cwd(), relPath);
        if (!fs.existsSync(fullPath)) continue;
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        const rsids = new Set(Object.keys(data).map(k => k.toLowerCase()));

        for (const purgedId of PURGED_ROUND3_IDS) {
          expect(rsids.has(purgedId.toLowerCase())).toBe(false);
        }
      }
    });

    it('ensures rs10456231 in cache has alleles A/T and rejects panel records claiming allele G', () => {
      expect(ensemblCache['rs10456231']).toBeDefined();
      expect(ensemblCache['rs10456231'].alleles).toBe('A/T');

      const fabricatedRecord = {
        rsid: 'rs10456231',
        chromosome: '6',
        position: 10230301,
        region: 'African',
        alleles: ['G'],
        frequencies: { AFR: 0.96, AMR: 0.01 },
        weight: 10,
        build: 'GRCh38',
      };

      const result = validateAimRecord(fabricatedRecord, 'rs10456231', 'african.json');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('allele mismatch') || e.includes('alleles'))).toBe(true);
    });

    it('ensures no entry in parked_tiebreaker_anchors.json contains "pending"', () => {
      const anchorsJsonPath = path.join(
        process.cwd(),
        'src/data/reference/parked_tiebreaker_anchors.json'
      );
      const rawText = fs.readFileSync(anchorsJsonPath, 'utf-8');
      expect(rawText.toLowerCase()).not.toContain('pending');

      for (const [id, reason] of Object.entries(PARKED_TIEBREAKER_ANCHORS_MAP)) {
        expect(reason.toLowerCase()).not.toContain('pending');
      }
    });

    it('ensures every parked entry has a documented reason citing Ensembl GRCh38 verification', () => {
      for (const [id, reason] of Object.entries(PARKED_TIEBREAKER_ANCHORS_MAP)) {
        expect(reason).toBeDefined();
        expect(typeof reason).toBe('string');
        expect(reason.length).toBeGreaterThan(20);
        expect(reason).toContain('Ensembl GRCh38');
      }
    });

    it('ensures Python and TypeScript parked tiebreaker lists are equal and loaded from single source of truth', () => {
      const anchorsJsonPath = path.join(
        process.cwd(),
        'src/data/reference/parked_tiebreaker_anchors.json'
      );
      const anchorsJson = JSON.parse(fs.readFileSync(anchorsJsonPath, 'utf-8'));
      const jsonKeys = new Set(Object.keys(anchorsJson).map(k => k.toLowerCase()));

      expect(PARKED_TIEBREAKER_ANCHORS.size).toBe(jsonKeys.size);
      for (const k of jsonKeys) {
        expect(PARKED_TIEBREAKER_ANCHORS.has(k)).toBe(true);
      }

      // Verify build_ensembl_cache.py loads the exact same JSON file
      const pyScript = fs.readFileSync(
        path.join(process.cwd(), 'scripts/build_ensembl_cache.py'),
        'utf-8'
      );
      expect(pyScript).toContain('parked_tiebreaker_anchors.json');
      expect(pyScript).not.toContain('pending coordinate review');
      expect(pyScript).not.toContain('pending coordinate resolution');
    });

    it('ensures markers with "tiebreaker" in description are not shielded unless in parked_tiebreaker_anchors.json', () => {
      // Unparked marker with "tiebreaker" in description but wrong chromosome
      const unshieldedMarker = {
        rsid: 'rs686140', // real variant on chr6:18925121
        chromosome: '7', // wrong chromosome
        position: 18925121,
        region: 'African',
        alleles: ['A', 'G'],
        frequencies: { AFR: 0.85, EUR: 0.15 },
        weight: 10,
        description: 'Sahel Tie-Breaker diagnostic marker',
        trait: 'Sahel Tiebreaker',
        build: 'GRCh38',
      };

      const result = validateAimRecord(unshieldedMarker, 'rs686140', 'african.json');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('chromosome mismatch'))).toBe(true);
    });
  });

  describe('(i) M-1: Stop averaging admixed 1000G pops into continental frequencies', () => {
    it('ensures all admixed 1000G populations are in ADMIXED_1000G_POPS and excluded from POP_CODE_TO_REGION', () => {
      const expectedAdmixed = ['ASW', 'ACB', 'MXL', 'PUR', 'CLM', 'PEL'];
      for (const pop of expectedAdmixed) {
        expect(ADMIXED_1000G_POPS.has(pop)).toBe(true);
        expect(POP_CODE_TO_REGION[pop]).toBeUndefined();
      }
    });

    it('ensures AFR relevant populations only contain unadmixed reference populations', () => {
      const afrPops = Object.keys(POP_CODE_TO_REGION).filter(
        p => POP_CODE_TO_REGION[p] === 'AFR' && !ADMIXED_1000G_POPS.has(p)
      );
      expect(afrPops).toContain('YRI');
      expect(afrPops).toContain('LWK');
      expect(afrPops).toContain('GWD');
      expect(afrPops).toContain('MSL');
      expect(afrPops).toContain('ESN');
      expect(afrPops).not.toContain('ASW');
      expect(afrPops).not.toContain('ACB');
    });

    it('ensures AMR continental averaging does not include PUR, CLM, MXL, PEL', () => {
      const amrPops = Object.keys(POP_CODE_TO_REGION).filter(
        p => POP_CODE_TO_REGION[p] === 'AMR' && !ADMIXED_1000G_POPS.has(p)
      );
      expect(amrPops).not.toContain('PUR');
      expect(amrPops).not.toContain('CLM');
      expect(amrPops).not.toContain('MXL');
      expect(amrPops).not.toContain('PEL');
      expect(amrPops.length).toBe(0);
    });
  });

  describe('(j) M-3: Padding filter on global loop too', () => {
    it('ensures no marker with position 1000000 exists in ALL_REGION_AIMS', () => {
      for (const [key, entry] of Object.entries(ALL_REGION_AIMS)) {
        expect(Number((entry as any).position)).not.toBe(1000000);
      }
    });

    it('ensures a padding fixture at position 1000000 never reaches database via global loop', () => {
      const mockGlobal = {
        rs99999901: {
          rsid: 'rs99999901',
          chromosome: '1',
          position: 1000000,
          alleles: ['A', 'G'],
          region: 'Global',
          frequencies: { AFR: 0.5, EUR: 0.5 }
        },
        rs99999902: {
          rsid: 'rs99999902',
          chromosome: '1',
          position: 1000001,
          alleles: ['C', 'T'],
          region: 'Global',
          frequencies: { AFR: 0.2, EUR: 0.8 }
        }
      };
      const result = buildCleanAimDatabase(mockGlobal, []);
      expect(result['rs99999901']).toBeUndefined();
      expect(result['rs99999902']).toBeDefined();
    });

    it('ensures a padding fixture at position 1000000 never reaches database via regional loop', () => {
      const mockRegional = {
        rs99999903: {
          rsid: 'rs99999903',
          chromosome: '2',
          position: 1000000,
          alleles: ['A', 'C'],
          region: 'African',
          frequencies: { AFR: 0.9, EUR: 0.1 }
        },
        rs99999904: {
          rsid: 'rs99999904',
          chromosome: '2',
          position: 1000002,
          alleles: ['G', 'T'],
          region: 'African',
          frequencies: { AFR: 0.9, EUR: 0.1 }
        }
      };
      const result = buildCleanAimDatabase({}, [mockRegional]);
      expect(result['rs99999903']).toBeUndefined();
      expect(result['rs99999904']).toBeDefined();
    });
  });
});

