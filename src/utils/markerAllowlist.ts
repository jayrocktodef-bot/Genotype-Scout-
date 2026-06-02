import { loadMasterAims } from '../data/index';

// Initialize on first use or cache
let masterAimsCache: any = null;
const getMasterAims = () => {
  if (!masterAimsCache) masterAimsCache = loadMasterAims();
  return masterAimsCache;
};
import { SNP_DB } from '../data/snpDatabase';
import { ANCHOR_AIMS } from '../anchorAims';
import masterAncient from '../data/master_ancient_profiles.json';
import v5MarkersMaster from '../data/v5_markers_master.json' with { type: 'json' };
import bloodMarkers from '../data/blood_markers.json' with { type: 'json' };
import masterHealth from '../data/master_health_pgx.json' with { type: 'json' };
import { PGX_MARKERS_MAP } from '../engines/health/pypgxEngine';
import { dietLogic } from '../engines/dietaryCalculator';

export function getMarkerAllowlist(): Set<string> {
  const allowlist = new Set<string>();

  // 1. Master Normalized Aims (includes GRAF, Forensic, Deep, Euroforgen, etc.)
  Object.values(getMasterAims()).forEach((m: any) => {
    if (m.rsid) allowlist.add(m.rsid.toLowerCase());
  });

  // 1.1 Health, Wellness & PGx (v5MarkersMaster)
  v5MarkersMaster.forEach((m: any) => {
    if (m.rsid) allowlist.add(m.rsid.toLowerCase());
  });

  // 1.2 Master Health PGx Table
  Object.keys(masterHealth).forEach((rsid: string) => {
    allowlist.add(rsid.toLowerCase());
  });

  // 1.3 Blood Type Markers
  if (bloodMarkers) {
    if ((bloodMarkers as any).rhSystem) {
      Object.keys((bloodMarkers as any).rhSystem).forEach((rsid: string) => {
        allowlist.add(rsid.toLowerCase());
      });
    }
    if ((bloodMarkers as any).aboSystem) {
      Object.keys((bloodMarkers as any).aboSystem).forEach((rsid: string) => {
        allowlist.add(rsid.toLowerCase());
      });
    }
  }

  // 1.4 Additional PGx Markers
  Object.values(PGX_MARKERS_MAP).forEach(snps => {
    snps.forEach(rsid => allowlist.add(rsid.toLowerCase()));
  });

  // 1.5 Dietary Traits Markers
  Object.values(dietLogic).forEach(config => {
    if (config.rsid) allowlist.add(config.rsid.toLowerCase());
  });

  // 1.6 Secretor Status Markers
  allowlist.add('rs601338');
  allowlist.add('rs1047781');

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
