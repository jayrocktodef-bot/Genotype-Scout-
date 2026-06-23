import { ANCHOR_AIMS } from './anchorAims';
import { SNP_DB } from './genotypeData';

export interface MappedAim {
  rsid: string;
  region: string;
  alleles: string[];
  weight: number;
  frequencies: Record<string, number>;
  subFrequencies?: Record<string, number>;
  description: string;
  gene: string;
  trait: string;
  category: string;
}

export const getMappedAims = (): MappedAim[] => {
  return ANCHOR_AIMS.map(aim => {
    const snp = SNP_DB.find(s => s.rsid === aim.rsid);
    if (snp) {
      return {
        ...aim,
        gene: snp.gene || 'Unknown',
        trait: snp.trait || 'Unknown',
        category: snp.category || 'Unknown',
      };
    } else {
      return {
        ...aim,
        gene: 'Unknown',
        trait: 'Unknown',
        category: 'Unknown',
      };
    }
  });
};
