import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseRawDNAStream } from './dnaParser';
import { getMarkerAllowlist } from '../utils/markerAllowlist';
import { calculateHumanOriginsScores } from '../engines/ancestry/humanOriginsEngine';
import { calculateAncientAdmixture } from '../lib/AncientAdmixtureCalculator';
import { calculateBloodType } from '../engines/bloodTypeCalculator';
import { dietLogic } from '../engines/dietaryCalculator';
import { calculateSecretorStatus } from '../engines/health/secretorCalculator';

describe('Public WGS DNA File Ingestion and Analysis', () => {
  const wgsPath = path.resolve(process.cwd(), 'scratch/NA12878_HG001_WGS.vcf.gz');

  it('verifies public GIAB NA12878 whole genome sequencing file exists', () => {
    expect(fs.existsSync(wgsPath)).toBe(true);
    const stats = fs.statSync(wgsPath);
    expect(stats.size).toBeGreaterThan(100 * 1024 * 1024); // > 100 MB compressed
  });

  it('streams and parses NA12878 WGS VCF without memory explosion', async () => {
    const allowlist = getMarkerAllowlist();
    expect(allowlist.size).toBeGreaterThan(15000);

    const buf = fs.readFileSync(wgsPath);
    const file = new File([buf], 'NA12878_HG001_WGS.vcf.gz', { type: 'application/gzip' });

    const parsed = await parseRawDNAStream(file, allowlist);

    expect(parsed.format).toBe('VCF');
    expect(parsed.chip).toContain('Variant Call Format');
    expect(parsed.build).toBe('GRCh37');
    expect(parsed.snpCount).toBeGreaterThan(7000);
    expect(parsed.yDnaCalledSnps).toBe(0); // NA12878 is an XX female specimen

    // Check specific known high-confidence calls for NA12878
    expect(parsed.snpMap['rs3094315']).toBe('AA');
    expect(parsed.snpMap['rs7555426']).toBe('TT');
    expect(parsed.snpMap['rs3737720']).toBe('GG');

    // Run Human Origins Engine (K61)
    const hoResults = await calculateHumanOriginsScores(parsed.snpMap);
    expect(hoResults.length).toBeGreaterThan(0);
    // NA12878 has CEU / Northern & Western European ancestry
    console.log('NA12878 Top Human Origins Populations:', hoResults.slice(0, 5));
    const topHo = hoResults[0];
    expect(topHo.population).toBeDefined();
    expect(topHo.percentage).toBeGreaterThan(0);

    // Run Ancient Admixture Engine
    const ancientMatches = await calculateAncientAdmixture(parsed.snpMap);
    expect(ancientMatches.length).toBeGreaterThan(0);
    console.log('NA12878 Top Ancient Matches:', ancientMatches.slice(0, 3));

    // Run Blood Type Engine
    const bloodType = calculateBloodType(parsed.snpMap);
    expect(bloodType).toBeDefined();
    expect(bloodType.bloodType).toBeDefined();
    expect(bloodType.details.abo).toBeDefined();
    console.log('NA12878 Predicted Blood Type:', bloodType.bloodType, 'ABO:', bloodType.details.abo);

    // Run Dietary Traits via dietLogic
    const caffeineGeno = parsed.snpMap['rs762551'] || '';
    const caffeineTrait = dietLogic.caffeine.interpret(caffeineGeno);
    expect(caffeineTrait).toBeDefined();
    console.log('NA12878 Caffeine Metabolism:', caffeineTrait);

    // Run Secretor Status Engine
    const secretor = calculateSecretorStatus(parsed.snpMap);
    expect(secretor).toBeDefined();
    expect(secretor.status).toBeDefined();
    console.log('NA12878 Secretor Status:', secretor);
  }, 120000);
});
