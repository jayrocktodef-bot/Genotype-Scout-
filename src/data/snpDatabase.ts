import { ANCHOR_AIMS } from '../anchorAims';
import snps from './snps.json';
import { SNP } from '../types/genotype';

export const SNP_DB: SNP[] = snps as any as SNP[];
export const SNP_LOOKUP = new Map<string, any>();

// Initialize the global lookup map
SNP_DB.forEach(snp => {
  SNP_LOOKUP.set(snp.markerId.toLowerCase(), snp);
  if (snp.rsid) SNP_LOOKUP.set(snp.rsid.toLowerCase(), snp);
  if (snp.aliases) snp.aliases.forEach(alias => SNP_LOOKUP.set(alias.toLowerCase(), snp));
});

// Also include ANCHOR_AIMS in the lookup
ANCHOR_AIMS.forEach(aim => {
  if (!SNP_LOOKUP.has(aim.rsid.toLowerCase())) {
    SNP_LOOKUP.set(aim.rsid.toLowerCase(), aim);
  }
});
