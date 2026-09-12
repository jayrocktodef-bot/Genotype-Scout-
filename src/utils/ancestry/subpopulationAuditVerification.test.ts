import { describe, it, expect } from 'vitest';
import { processSubpopulations, humanizePopName } from '../../components/ancestryOracleLogic';
import { assignContinent, CONTINENT_PALETTES } from '../../constants/ancestryThemes';

describe('Subpopulation Audit Verification', () => {
  describe('Theme and Taxonomy Classifications', () => {
    it('assigns correct continent categories for new and updated clades', () => {
      // Caucasus
      expect(assignContinent('sgdp_chechen')).toBe('Caucasus');
      expect(assignContinent('sgdp_georgian')).toBe('Caucasus');
      expect(assignContinent('sgdp_lezgin')).toBe('Caucasus');
      expect(assignContinent('sgdp_adygei')).toBe('Caucasus');
      expect(assignContinent('sgdp_russia_northossetian')).toBe('Caucasus');

      // Central Asian & Siberian
      expect(assignContinent('sgdp_uyghur')).toBe('Central Asian & Siberian');
      expect(assignContinent('sgdp_yakut')).toBe('Central Asian & Siberian');
      expect(assignContinent('sgdp_altaian')).toBe('Central Asian & Siberian');
      expect(assignContinent('sgdp_kyrgyz_kyrgyzstan')).toBe('Central Asian & Siberian');
      expect(assignContinent('sgdp_tajik')).toBe('Central Asian & Siberian');

      // Reclassified East Asian (Daur, Tujia, Hezhen, Oroqen, Xibo)
      expect(assignContinent('sgdp_daur')).toBe('East Asian');
      expect(assignContinent('sgdp_tujia')).toBe('East Asian');
      expect(assignContinent('sgdp_hezhen')).toBe('East Asian');
      expect(assignContinent('sgdp_oroqen')).toBe('East Asian');
      expect(assignContinent('sgdp_xibo')).toBe('East Asian');

      // North African / Middle Eastern (Amazigh, Tuareg, Mozabite)
      expect(assignContinent('AMAZIGH_BERBER')).toBe('Middle Eastern');
      expect(assignContinent('TUAREG')).toBe('Middle Eastern');
      expect(assignContinent('sgdp_mozabite')).toBe('Middle Eastern');
    });

    it('has palette tokens defined for all categories including Caucasus and Central Asian & Siberian', () => {
      expect(CONTINENT_PALETTES['Caucasus']).toBeDefined();
      expect(CONTINENT_PALETTES['Caucasus'].text).toContain('violet');

      expect(CONTINENT_PALETTES['Central Asian & Siberian']).toBeDefined();
      expect(CONTINENT_PALETTES['Central Asian & Siberian'].text).toContain('amber');

      expect(CONTINENT_PALETTES['Oceanian']).toBeDefined();
      expect(CONTINENT_PALETTES['East Asian']).toBeDefined();
    });

    it('humanizes newly registered populations', () => {
      expect(humanizePopName('sgdp_lezgin')).toContain('Lezgin');
      expect(humanizePopName('CAU')).toContain('Caucasus');
      expect(humanizePopName('CAS')).toContain('Central Asian');
    });
  });

  describe('Admixture Engine Pass 1 & Pass 2 Routing', () => {
    it('executes processSubpopulations without crashing and returns valid admixtureMix', async () => {
      // Mock user genotype array with genuine AIM markers
      const userGenotypes = [
        { rsid: 'rs2814778', genotype: 'CC' }, // Duffy null (AFR specific)
        { rsid: 'rs1426654', genotype: 'AA' }, // SLC24A5 (EUR/SAS light skin)
        { rsid: 'rs1800407', genotype: 'CT' }, // OCA2
        { rsid: 'rs12913832', genotype: 'GG' }, // HERC2 blue eyes
        { rsid: 'rs16891982', genotype: 'CC' }, // SLC45A2
        { rsid: 'rs1042602', genotype: 'AA' }, // TYR
        { rsid: 'rs671', genotype: 'GG' },     // ALDH2
        { rsid: 'rs3827760', genotype: 'AA' }  // EDAR (EAS specific)
      ];

      const result = await processSubpopulations(userGenotypes, []);
      expect(result).toBeDefined();
      expect(result.admixtureMix).toBeDefined();
      expect(Array.isArray(result.admixtureMix)).toBe(true);

      // Verify that admixed basis cohorts (like ACB, ASW, CLM, MXL, PUR) are not injected as basis reference mixtures
      const admixedPops = new Set(['ACB', 'ASW', 'CLM', 'MXL', 'PUR', 'GLL', 'ALFA_AfAm', 'ALFA_LatAm1', 'ALFA_LatAm2', 'lemba_proxy', 'romani_proxy']);
      for (const component of result.admixtureMix) {
        // Pass 2 NNLS should only allocate proportions to genuine source populations, not admixed basis cohorts
        expect(admixedPops.has(component.popCode)).toBe(false);
      }
    });
  });
});
