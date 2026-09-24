import { describe, it, expect } from 'vitest';
import { SUBPOPULATION_GLOSSARY_DATA, getPopulationGlossaryItem } from './subpopulationGlossaryData';
import { assignContinent } from '../constants/ancestryThemes';

describe('South Asian Subpopulation Glossary & Continent Mapping', () => {
  it('contains at least 11 verified South Asian cohort entries', () => {
    const southAsianItems = SUBPOPULATION_GLOSSARY_DATA.filter(item => item.category === 'South Asia');
    expect(southAsianItems.length).toBeGreaterThanOrEqual(11);
  });

  it('correctly retrieves 1000 Genomes South Asian populations via getPopulationGlossaryItem', () => {
    const gih = getPopulationGlossaryItem('GIH');
    expect(gih).toBeDefined();
    expect(gih?.name).toContain('Gujarati');
    expect(gih?.category).toBe('South Asia');

    const pjl = getPopulationGlossaryItem('PJL');
    expect(pjl).toBeDefined();
    expect(pjl?.name).toContain('Punjabi');

    const beb = getPopulationGlossaryItem('beb');
    expect(beb).toBeDefined();
    expect(beb?.name).toContain('Bengali');

    const itu = getPopulationGlossaryItem('ITU');
    expect(itu).toBeDefined();
    expect(itu?.name).toContain('Telugu');

    const stu = getPopulationGlossaryItem('stu');
    expect(stu).toBeDefined();
    expect(stu?.name).toContain('Tamil');
  });

  it('correctly resolves SGDP / HGDP South Asian cohorts and aliases', () => {
    const kalash = getPopulationGlossaryItem('sgdp_kalash');
    expect(kalash).toBeDefined();
    expect(kalash?.name).toContain('Kalash');

    const kalashByAlias = getPopulationGlossaryItem('hgdp_kalash');
    expect(kalashByAlias?.code).toBe('sgdp_kalash');

    const paniya = getPopulationGlossaryItem('sgdp_paniya');
    expect(paniya).toBeDefined();
    expect(paniya?.name).toContain('Paniya');

    const irulaAlias = getPopulationGlossaryItem('sgdp_irula');
    expect(irulaAlias?.code).toBe('sgdp_paniya');

    const brahui = getPopulationGlossaryItem('sgdp_brahui');
    expect(brahui).toBeDefined();
    expect(brahui?.name).toContain('Brahui');

    const burusho = getPopulationGlossaryItem('sgdp_burusho');
    expect(burusho).toBeDefined();
    expect(burusho?.name).toContain('Burusho');
  });

  it('assignContinent assigns "South Asian" to all South Asian codes and text', () => {
    const codes = [
      'gih', 'pjl', 'beb', 'itu', 'stu', 'sas', 'sas_gnomad',
      'sgdp_brahui', 'sgdp_balochi', 'sgdp_sindhi', 'sgdp_punjabi', 'sgdp_bengali',
      'sgdp_brahmin', 'sgdp_kapu', 'sgdp_madiga', 'sgdp_mala', 'sgdp_relli',
      'sgdp_yadava', 'sgdp_irula', 'sgdp_paniya', 'sgdp_kalash', 'sgdp_khonda',
      'sgdp_burusho', 'sgdp_pathan', 'hgdp_kalash', 'hgdp_sindhi', 'hgdp_burusho'
    ];

    for (const code of codes) {
      expect(assignContinent('', code)).toBe('South Asian');
    }

    expect(assignContinent('Gujarati Indian')).toBe('South Asian');
    expect(assignContinent('Punjabi in Lahore')).toBe('South Asian');
    expect(assignContinent('Bengali delta')).toBe('South Asian');
    expect(assignContinent('Tamil Insular Dravidian')).toBe('South Asian');
    expect(assignContinent('Kalash isolate')).toBe('South Asian');
    expect(assignContinent('Paniya hunter-gatherer')).toBe('South Asian');
  });

  it('all South Asian glossary entries have complete evolutionary adaptations and historical metadata', () => {
    const southAsianItems = SUBPOPULATION_GLOSSARY_DATA.filter(item => item.category === 'South Asia');
    for (const item of southAsianItems) {
      expect(item.code).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.geographicCenter).toBeTruthy();
      expect(item.historicalTimeline).toBeTruthy();
      expect(item.migrationPath.length).toBeGreaterThanOrEqual(3);
      expect(item.evolutionaryAdaptations.length).toBeGreaterThanOrEqual(2);
      expect(item.description).toBeTruthy();
      expect(item.keyMarkers.length).toBeGreaterThanOrEqual(4);
      expect(item.empiricalSource).toBeDefined();
      expect(item.empiricalSource?.sampleSize).toBeGreaterThan(0);
    }
  });
});
