import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { ALL_REGION_AIMS } from '../../data/aims/index';

describe('AADR & Forensic AIM Integrity and Deduplication Test Suite', () => {
  const naFilePath = path.resolve(__dirname, '../../data/aims/native_american.json');
  const afFilePath = path.resolve(__dirname, '../../data/aims/african.json');

  it('should have zero duplicate keys in native_american.json (case-insensitive)', () => {
    const rawData = JSON.parse(fs.readFileSync(naFilePath, 'utf-8'));
    const keys = Object.keys(rawData);
    const lowerKeys = keys.map(k => k.toLowerCase().split('_')[0].trim());
    const uniqueKeys = new Set(lowerKeys);

    expect(uniqueKeys.size).toBe(keys.length);
    expect(keys.length).toBeGreaterThanOrEqual(3500);
  });

  it('should have zero duplicate keys in african.json (case-insensitive)', () => {
    const rawData = JSON.parse(fs.readFileSync(afFilePath, 'utf-8'));
    const keys = Object.keys(rawData);
    const lowerKeys = keys.map(k => k.toLowerCase().split('_')[0].trim());
    const uniqueKeys = new Set(lowerKeys);

    expect(uniqueKeys.size).toBe(keys.length);
    expect(keys.length).toBeGreaterThanOrEqual(875);
  });

  it('should contain enriched subFrequencies for AADR ancient & regional Native American lineages', () => {
    const rawData = JSON.parse(fs.readFileSync(naFilePath, 'utf-8'));
    const edar = rawData['rs3827760'];
    expect(edar).toBeDefined();
    expect(edar.weight).toBeGreaterThanOrEqual(14);
    expect(edar.subFrequencies).toBeDefined();
    expect(edar.subFrequencies.Northern_Native).toBeGreaterThanOrEqual(0.95);
    expect(edar.subFrequencies.Woodlands_Ancient).toBeGreaterThanOrEqual(0.95);
    expect(edar.subFrequencies.Ancient_Beringian).toBeGreaterThanOrEqual(0.95);
    expect(edar.subFrequencies.Anzick_Paleo).toBe(1.0);

    const slc24a5 = rawData['rs1426654'];
    expect(slc24a5).toBeDefined();
    expect(slc24a5.subFrequencies.Anzick_Paleo).toBe(1.0);
    expect(slc24a5.subFrequencies.Northern_Native).toBeGreaterThanOrEqual(0.90);
  });

  it('should contain enriched subFrequencies for AADR ancient & regional African lineages', () => {
    const rawData = JSON.parse(fs.readFileSync(afFilePath, 'utf-8'));
    const duffy = rawData['rs2814778'];
    expect(duffy).toBeDefined();
    expect(duffy.weight).toBeGreaterThanOrEqual(15);
    expect(duffy.subFrequencies).toBeDefined();
    expect(duffy.subFrequencies.West_African_Coastal).toBeGreaterThanOrEqual(0.99);
    expect(duffy.subFrequencies.Ancient_African_Basal).toBe(1.0);
    expect(duffy.subFrequencies.Shum_Laka).toBe(1.0);

    const apol1 = rawData['rs73885319'];
    expect(apol1).toBeDefined();
    expect(apol1.gene).toBe('APOL1');
    expect(apol1.subFrequencies.West_African_Coastal).toBeGreaterThanOrEqual(0.35);

    const sickle = rawData['rs334'];
    expect(sickle).toBeDefined();
    expect(sickle.gene).toBe('HBB');
    expect(sickle.subFrequencies.West_African_Coastal).toBeDefined();
  });

  it('should preserve all markers with valid chromosome coordinates and bounds in ALL_REGION_AIMS', () => {
    const validChrs = new Set([
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
      '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
      '21', '22', 'X', 'Y', 'MT', 'M'
    ]);

    const targetRsids = ['rs3827760', 'rs10756819', 'rs2814778', 'rs1426654', 'rs16891982', 'rs73885319'];
    for (const rsid of targetRsids) {
      const marker = (ALL_REGION_AIMS as any)[rsid];
      expect(marker).toBeDefined();
      const chrStr = String(marker.chromosome).toUpperCase().replace(/^CHR/, '');
      expect(validChrs.has(chrStr)).toBe(true);
      expect(typeof marker.position).toBe('number');
      expect(marker.position).toBeGreaterThan(0);
      expect(marker.frequencies).toBeDefined();
      for (const [p, f] of Object.entries(marker.frequencies)) {
        expect(typeof f).toBe('number');
        expect(f).toBeGreaterThanOrEqual(0);
        expect(f).toBeLessThanOrEqual(1);
      }
    }
  });

  it('should have 100% subFrequencies coverage in native_american.json (0 empty)', () => {
    const rawData = JSON.parse(fs.readFileSync(naFilePath, 'utf-8'));
    const emptySub = Object.entries(rawData).filter(
      ([_, v]: [string, any]) => !v.subFrequencies || Object.keys(v.subFrequencies).length === 0
    );
    expect(emptySub.length).toBe(0);
  });

  it('should have 100% subFrequencies coverage in african.json (0 empty)', () => {
    const rawData = JSON.parse(fs.readFileSync(afFilePath, 'utf-8'));
    const emptySub = Object.entries(rawData).filter(
      ([_, v]: [string, any]) => !v.subFrequencies || Object.keys(v.subFrequencies).length === 0
    );
    expect(emptySub.length).toBe(0);
  });

  it('should have populated deepFrequencies across thousands of markers in master_aims_normalized.json', () => {
    const masterPath = path.resolve(__dirname, '../../data/master_aims_normalized.json');
    const masterData = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));
    const withDeep = Object.values(masterData).filter(
      (v: any) => v.deepFrequencies && Object.keys(v.deepFrequencies).length > 0
    );
    expect(withDeep.length).toBeGreaterThanOrEqual(7500);

    // Verify presence of ancient clades on a sample SNP (e.g. rs2887286)
    const sample = masterData['rs2887286'];
    expect(sample).toBeDefined();
    expect(sample.deepFrequencies.WHG).toBeDefined();
    expect(sample.deepFrequencies.EEF).toBeDefined();
    expect(sample.deepFrequencies.Yamnaya).toBeDefined();
  });
});
