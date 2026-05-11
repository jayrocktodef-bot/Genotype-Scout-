import grafIndex from '../data/ancestry/graf_10k_index.json';
import forensicAims from '../data/phenotype_forensic/forensic_aims_master.json';
import deepAims from '../data/phenotype_forensic/deep_resolution_aims.json';
import euroforgenPanel from '../data/phenotype_forensic/euroforgen_name_panel.json';
import { SNP_DB } from '../data/snpDatabase';
import { ANCHOR_AIMS } from '../anchorAims';
import { ANCESTRY_MARKERS } from '../data/ancestry';
import ancientSamples from '../data/ancient_historical/ancient_samples.json';

export function getMarkerAllowlist(): Set<string> {
  const allowlist = new Set<string>();

  // 1. GRAF-10k
  Object.keys(grafIndex).forEach(rsid => allowlist.add(rsid.toLowerCase()));

  // 2. Forensic Aims
  (forensicAims as any[]).forEach(aim => {
    if (aim.rsid) allowlist.add(aim.rsid.toLowerCase());
  });

  // 3. Deep Resolution
  (deepAims as any[]).forEach(aim => {
    if (aim.rsid) allowlist.add(aim.rsid.toLowerCase());
  });

  // 4. Euroforgen
  if (euroforgenPanel && euroforgenPanel.markers) {
    euroforgenPanel.markers.forEach(rsid => allowlist.add(rsid.toLowerCase()));
  }

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

  // 7. Ancestry Markers
  (ANCESTRY_MARKERS as any[]).forEach(m => {
    if (m.rsid) allowlist.add(m.rsid.toLowerCase());
    if (m.markerId) allowlist.add(m.markerId.toLowerCase());
  });

  // 8. Ancient Individual Samples
  Object.entries(ancientSamples).forEach(([id, data]: [string, any]) => {
    if (id === "_metadata") return;
    const markers = data.snps || data.genotypes || {};
    Object.keys(markers).forEach(rsid => allowlist.add(rsid.toLowerCase()));
  });

  return allowlist;
}
