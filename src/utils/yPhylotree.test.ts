import { describe, it, expect } from 'vitest';
import { parentHaplogroup, ybrowseRowToRecord, buildSnpIndex } from './yPhylotree';

describe('parentHaplogroup', () => {
  it('strips the last alternating letter/number token', () => {
    expect(parentHaplogroup('R1b1a1a2')).toBe('R1b1a1a');
    expect(parentHaplogroup('R1')).toBe('R');
    expect(parentHaplogroup('E1b1a1a1')).toBe('E1b1a1a');
  });
  it('returns null for a single top-level letter or empty', () => {
    expect(parentHaplogroup('R')).toBeNull();
    expect(parentHaplogroup('')).toBeNull();
  });
  it('ignores trailing ~ / *', () => {
    expect(parentHaplogroup('E1b1a1~')).toBe('E1b1a');
  });
});

describe('ybrowseRowToRecord', () => {
  const row = ['chrY','point','snp','20577481','20577481','.','+','.','M269','M269','T','C','R1b1a1a2','R1b1a1a2','T to C','3','0','ref','.'];
  it('parses allele direction, position and ISOGG haplogroup', () => {
    const r = ybrowseRowToRecord(row)!;
    expect(r.name).toBe('M269');
    expect(r.ancestral).toBe('T');
    expect(r.derived).toBe('C');
    expect(r.posHg38).toBe(20577481);
    expect(r.isoggHaplogroup).toBe('R1b1a1a2');
  });
  it('skips indels / non-biallelic records', () => {
    const indel = [...row]; indel[10] = '8T'; indel[11] = '9T';
    expect(ybrowseRowToRecord(indel)).toBeNull();
  });
});

describe('buildSnpIndex', () => {
  it('keys by uppercased name (first occurrence wins)', () => {
    const a = ybrowseRowToRecord(['chrY','p','snp','1','1','.','+','.','M269','M269','T','C','R1b','R1b','T to C','0','0','r','.'])!;
    const b = { ...a, derived: 'A' };
    const idx = buildSnpIndex([a, b]);
    expect(idx['M269'].derived).toBe('C');
  });
});
