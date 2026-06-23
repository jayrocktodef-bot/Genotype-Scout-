import { describe, it, expect, vi } from 'vitest';

// Mock the ISOGG data with a single test branch + the converter header row (must be dropped).
vi.mock('../data/master_ydna.json', () => ({
  default: {
    isoggTree: [
      { branchName: 'Subgroup Name', definingSNPs: ['Name'], rsids: ['rs numbers'] }, // junk header
      { branchName: 'R1b-TEST', definingSNPs: ['M269'], rsids: ['rs9999001'] },
    ],
    lastUpdated: 'test',
  },
}));

// Mock SNP metadata: derived allele for the test SNP is 'T'.
vi.mock('../data/snpDatabase', () => ({
  SNP_LOOKUP: new Map<string, any>([
    ['rs9999001', { alleles: ['T'], markerId: 'rs9999001' }],
  ]),
}));

import { findMatchesInHaplogroups, HAPLOGROUP_DB, classifyYGenotype } from './haplogroupService';

describe('haplogroupService allele-aware matching', () => {
  it('drops the converter header/placeholder row', () => {
    expect(HAPLOGROUP_DB.find((b) => b.branchName === 'Subgroup Name')).toBeUndefined();
    expect(HAPLOGROUP_DB.length).toBe(1);
  });

  it('counts a derived allele as a confirmed match', () => {
    const m = findMatchesInHaplogroups({ rs9999001: 'T' });
    expect(m.length).toBe(1);
    expect(m[0].derivedCount).toBe(1);
  });

  it('does NOT credit a branch when the user carries the ancestral allele', () => {
    const m = findMatchesInHaplogroups({ rs9999001: 'C' }); // present but ancestral
    expect(m.length).toBe(0);
  });

  it('treats heterozygous calls as unknown (no derived credit)', () => {
    expect(classifyYGenotype('TC', { alleles: ['T'] })).toBe('unknown');
    expect(classifyYGenotype('TT', { alleles: ['T'] })).toBe('derived');
    expect(classifyYGenotype('CC', { alleles: ['T'] })).toBe('ancestral');
    expect(classifyYGenotype('T', { alleles: [] })).toBe('unknown'); // no derived info
  });
});
