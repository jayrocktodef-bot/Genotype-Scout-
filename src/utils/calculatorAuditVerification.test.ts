import { describe, it, expect } from 'vitest';
import { calculateBloodType } from '../engines/bloodTypeCalculator';
import { calculateCYP2D6Status, MetabolizerStatus } from './pgxAdvanced';
import { callStarAlleles } from '../engines/health/pypgxEngine';
import { calculateMedicationSafety } from '../engines/health/pgxCalculator';
import { dietLogic } from '../engines/dietaryCalculator';
import { evaluateXLinkedTraits } from '../services/xLinkedHealthEngine';
import { calculateTmrcaEstimate } from '../services/tmrcaEngine';
import { calculateSecretorStatus } from '../engines/health/secretorCalculator';

describe('Calculator Audit Verification Test Suite', () => {

  describe('ABO Blood Type Engine Polarity (rs8176750)', () => {
    it('does not classify consensus A1/O allele rs8176750 (G) as a B allele', () => {
      // User is homozygous O deletion (DD) and carries rs8176750 GG (consensus A1/O).
      // Prior bug: checking for G/C falsely assigned B allele, resulting in B/O1 phenotype B.
      const snps = {
        'rs8176719': 'DD', // Homozygous O1 frameshift deletion
        'rs8176750': 'GG'  // Consensus A1/O allele (NOT B allele)
      };

      const result = calculateBloodType(snps);
      expect(result.details.abo).toBe('O');
      expect(result.aboDetails?.diplotype).toBe('O1/O1');
    });

    it('correctly detects B allele when rs8176750 carries the A allele (or T on minus strand)', () => {
      const snps = {
        'rs8176719': 'DI', // Heterozygous O1 deletion carrier
        'rs8176750': 'AA'  // True B-allele defining mutation (c.703G>A)
      };

      const result = calculateBloodType(snps);
      expect(result.details.abo).toBe('B');
      expect(result.aboDetails?.diplotype).toBe('B/O1');
    });
  });

  describe('CYP2D6 Duplication Logic (CPIC Guideline Compliance)', () => {
    it('retains Poor Metabolizer status for *4/*4 carrying a gene duplication (*4xN/*4)', () => {
      // Under CPIC, duplicating a null allele produces zero functional enzyme (activity score = 0).
      // Prior bug: || isDuplication forced status to ULTRARAPID.
      const snps = {
        'rs3892097': 'AA',       // *4 homozygous (Null)
        'rs1065852': 'GG',
        'rs28371725': 'GG',
        'CYP2D6_DUP': 'DUP'      // Duplication present
      };

      const result = calculateCYP2D6Status(snps);
      expect(result.totalScore).toBe(0.0);
      expect(result.status).toBe(MetabolizerStatus.POOR);
    });

    it('promotes functional wildtype *1/*1 with duplication to Ultrarapid Metabolizer', () => {
      const snps = {
        'rs3892097': 'GG',       // *1 wildtype
        'rs1065852': 'GG',
        'rs28371725': 'GG',
        'CYP2D6_DUP': 'DUP'      // Duplication of active allele
      };

      const result = calculateCYP2D6Status(snps);
      expect(result.totalScore).toBe(3.0);
      expect(result.status).toBe(MetabolizerStatus.ULTRARAPID);
    });
  });

  describe('PyPGx Engine Multi-Strand & Alternate Marker Coverage', () => {
    it('recognizes forward strand TT for rs3892097 as *4/*4 Poor Metabolizer', () => {
      const snps = {
        'rs3892097': 'TT',       // Forward strand call for *4 homozygous
        'rs1065852': 'CC',
        'rs28371725': 'CC'
      };

      const result = callStarAlleles('CYP2D6', snps);
      expect(result.diplotype).toBe('*4/*4');
      expect(result.activityScore).toBe(0.0);
      expect(result.phenotype).toBe('Poor Metabolizer');
    });

    it('resolves CYP2C19 *2 using canonical CPIC marker rs4244285', () => {
      const snps = {
        'rs12248560': 'CC',      // *17 wildtype
        'rs4244285': 'AA'        // *2 homozygous null
      };

      const result = callStarAlleles('CYP2C19', snps);
      expect(result.diplotype).toBe('*2/*2');
      expect(result.activityScore).toBe(0.0);
      expect(result.phenotype).toBe('Poor Metabolizer');
    });
  });

  describe('SLCO1B1 Statin Risk & Case-Insensitive Medication Safety', () => {
    it('flags Caution (Moderate severity) for heterozygous SLCO1B1*5 CT carriers', () => {
      const snps = {
        'rs4149056': 'CT'        // Intermediate function
      };

      const reports = calculateMedicationSafety(snps);
      const statinReport = reports.find(r => r.drug === 'Simvastatin');
      expect(statinReport).toBeDefined();
      expect(statinReport?.severity).toBe('Moderate');
      expect(statinReport?.status).toBe('Caution');
    });

    it('flags Action Required (High severity) for homozygous SLCO1B1*5 CC carriers', () => {
      const snps = {
        'RS4149056': 'CC'        // Uppercase key test + homozygous poor function
      };

      const reports = calculateMedicationSafety(snps);
      const statinReport = reports.find(r => r.drug === 'Simvastatin');
      expect(statinReport).toBeDefined();
      expect(statinReport?.severity).toBe('High');
      expect(statinReport?.status).toBe('Action Required');
    });
  });

  describe('Dietary Calculator Uncalled / Missing Genotype Handling', () => {
    it('returns Unknown when caffeine or fat markers are not genotyped or uncalled', () => {
      const caffeineUncalled = dietLogic.caffeine.interpret('--');
      expect(caffeineUncalled.desc).toBe('Unknown');
      expect(caffeineUncalled.advice).toContain('not genotyped');

      const caffeineMissing = dietLogic.caffeine.interpret('');
      expect(caffeineMissing.desc).toBe('Unknown');

      const fatUncalled = dietLogic.saturatedFat.interpret('--');
      expect(fatUncalled.desc).toBe('Unknown');

      const fatMissing = dietLogic.saturatedFat.interpret('');
      expect(fatMissing.desc).toBe('Unknown');
    });

    it('correctly interprets called genotypes', () => {
      const fastCaffeine = dietLogic.caffeine.interpret('AA');
      expect(fastCaffeine.desc).toBe('Fast Metabolizer');

      const sensitiveFat = dietLogic.saturatedFat.interpret('CC');
      expect(sensitiveFat.desc).toBe('High Sensitivity');
    });
  });

  describe('X-Linked Engine Missing Data Safety', () => {
    it('does not classify an uncalled marker (--) as homozygous wildtype Normal / Low Risk', () => {
      const snpMap = {
        'rs1050829': '--', // Uncalled G6PD
        'rs5030868': '00'  // Uncalled G6PD Med
      };

      const report = evaluateXLinkedTraits(snpMap, 'male');
      const g6pdA = report.evaluatedTraits.find(t => t.rsid === 'rs1050829');
      expect(g6pdA).toBeDefined();
      expect(g6pdA?.zygosity).toBe('uncalled');
      expect(g6pdA?.phenotypeStatus).toBe('No Data');
      expect(g6pdA?.riskLevel).toBe('unknown');
    });

    it('correctly detects hemizygous male G6PD variant', () => {
      const snpMap = {
        'rs1050829': 'T' // Hemizygous risk allele in male
      };

      const report = evaluateXLinkedTraits(snpMap, 'male');
      const g6pdA = report.evaluatedTraits.find(t => t.rsid === 'rs1050829');
      expect(g6pdA?.zygosity).toBe('hemizygous_variant');
      expect(g6pdA?.phenotypeStatus).toBe('Affected / High Susceptibility');
      expect(g6pdA?.riskLevel).toBe('high');
      expect(report.overallRiskCategory).toBe('High Risk Flagged');
    });
  });

  describe('TMRCA Poisson Confidence Interval Scaling', () => {
    it('scales confidence interval width appropriately based on Poisson mutation count', () => {
      const mockClade = {
        code: 'R-M269',
        shortName: 'R-M269',
        cladeName: 'R-M269',
        lineageType: 'PATERNAL_YDNA' as const,
        parentClade: null,
        definingSnps: [],
        ageYearsBp: '~4,500 BP',
        originRegion: 'Europe',
        historicalDescription: '',
        ancientCultures: [],
        highFrequencyModern: [],
        migrationPath: []
      };

      // When derivedCount is small (k = 1), uncertainty is high
      const estK1 = calculateTmrcaEstimate(mockClade, 'PATERNAL_YDNA', 1);
      const spanK1 = estK1.ci95MaxYearsBp - estK1.ci95MinYearsBp;
      const relSpanK1 = spanK1 / estK1.tmrcaYearsBp;

      // When derivedCount is larger (k = 16), uncertainty tightens
      const estK16 = calculateTmrcaEstimate(mockClade, 'PATERNAL_YDNA', 16);
      const spanK16 = estK16.ci95MaxYearsBp - estK16.ci95MinYearsBp;
      const relSpanK16 = spanK16 / estK16.tmrcaYearsBp;

      expect(relSpanK1).toBeGreaterThan(relSpanK16);
      expect(estK1.ci95MinYearsBp).toBeGreaterThanOrEqual(200);
      expect(estK16.ci95MinYearsBp).toBeGreaterThanOrEqual(200);
    });
  });

  describe('Secretor Calculator Case-Insensitive Lookup', () => {
    it('resolves secretor status when rsid keys are uppercase', () => {
      const snps = {
        'RS601338': 'AA' // Uppercase key, Non-secretor
      };

      const result = calculateSecretorStatus(snps);
      expect(result.status).toBe('Non-Secretor');
      expect(result.traits.length).toBeGreaterThan(0);
    });
  });
});
