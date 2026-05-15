import masterAims from '../data/master_aims_normalized.json' with { type: 'json' };
import { SNP_DB } from '../data/snpDatabase';
import { ANCHOR_AIMS } from '../anchorAims';
import masterAncient from '../data/master_ancient_profiles.json';

export function getMarkerAllowlist(): Set<string> {
  const allowlist = new Set<string>();

  // 1. Master Normalized Aims (includes GRAF, Forensic, Deep, Euroforgen, etc.)
  Object.values(masterAims).forEach((m: any) => {
    if (m.rsid) allowlist.add(m.rsid.toLowerCase());
  });

  // 5. SNP_DB (Health, Traits, etc.)
  SNP_DB.forEach(snp => {
    if (snp.markerId) allowlist.add(snp.markerId.toLowerCase());
    if (snp.rsid) allowlist.add(snp.rsid.toLowerCase());
    if (snp.aliases) snp.aliases.forEach(a => allowlist.add(a.toLowerCase()));
  });

  // 6. Anchor AIMs
  ANCHOR_AIMS.forEach(aim => {
    if (aim.rsid) allowlist.add(aim.rsid.toLowerCase());
  });

  // 7. Ancient Individual Samples
  Object.entries(masterAncient.samples).forEach(([id, data]: [string, any]) => {
    if (id === "_metadata") return;
    const markers = data.snps || data.genotypes || {};
    Object.keys(markers).forEach(rsid => allowlist.add(rsid.toLowerCase()));
  });

  return allowlist;
}
