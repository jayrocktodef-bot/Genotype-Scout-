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
import prsModels from '../data/prs_models.json' with { type: 'json' };
import { PGX_MARKERS_MAP } from '../engines/health/pypgxEngine';
import { dietLogic } from '../engines/dietaryCalculator';
import microHapKernel from '../data/raw_aims/microhap_top100_kernel.json' with { type: 'json' };
import { ARCHAIC_INFORMATIVE_SNPS } from '../data/archaicSnpDatabase';
import { ALL_DEFINING_SNPS } from '../data/definingSnps';
import { SNP_ALIAS_CATALOG } from '../data/snpAliasIndex';
import { DIAGNOSTIC_LD_PROXIES } from '../data/ldProxies';

let cachedAllowlist: Set<string> | null = null;

export function getMarkerAllowlist(): Set<string> {
  if (cachedAllowlist) return cachedAllowlist;
  const allowlist = new Set<string>();

  const addCoordinates = (rawChrom?: string | number, rawPos?: string | number) => {
    if (rawChrom && rawPos) {
      const chrom = String(rawChrom).trim().replace(/^chr/i, '').toUpperCase();
      const posStr = String(rawPos).trim();
      allowlist.add(`chr${chrom}_${posStr}`.toLowerCase());
      allowlist.add(`${chrom}_${posStr}`.toLowerCase());
      allowlist.add(`chr${chrom}:${posStr}`.toLowerCase());
      allowlist.add(`${chrom}:${posStr}`.toLowerCase());
    }
  };

  // 1. Master Normalized Aims (includes GRAF, Forensic, Deep, Euroforgen, etc.)
  Object.values(getMasterAims()).forEach((m: any) => {
    if (m.rsid) allowlist.add(m.rsid.toLowerCase());
    addCoordinates(m.chromosome || m.chrom, m.position || m.pos);
  });

  // 1.1 Health, Wellness & PGx (v5MarkersMaster)
  v5MarkersMaster.forEach((m: any) => {
    if (m.rsid) allowlist.add(m.rsid.toLowerCase());
    addCoordinates(m.chromosome || m.chrom, m.position || m.pos);
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
  Object.values(PGX_MARKERS_MAP).forEach((snps) => {
    snps.forEach((rsid) => allowlist.add(rsid.toLowerCase()));
  });

  // 1.5 Dietary Traits Markers
  Object.values(dietLogic).forEach((config) => {
    if (config.rsid) allowlist.add(config.rsid.toLowerCase());
  });

  // 1.6 Secretor Status Markers
  allowlist.add('rs601338');
  allowlist.add('rs1047781');

  // 1.7 Additional Blood Group Markers (Diego, Scianna, LW, Gerbich, Xg)
  allowlist.add('rs2285603');
  allowlist.add('rs1018780');
  allowlist.add('rs11545624');
  allowlist.add('rs2075592');
  allowlist.add('rs311103');

  // 1.8 Microhaplotypes
  microHapKernel.forEach((hap: any) => {
    if (hap.snps) {
      hap.snps.forEach((rsid: string) => allowlist.add(rsid.toLowerCase()));
    }
  });

  // 1.9 Archaic Informative SNPs (Neanderthal & Denisovan)
  ARCHAIC_INFORMATIVE_SNPS.forEach((snp) => {
    if (snp.rsid) allowlist.add(snp.rsid.toLowerCase());
    addCoordinates(snp.chromosome, snp.position);
  });

  // 1.10 Haplogroup Defining SNPs (Y-DNA & mtDNA)
  ALL_DEFINING_SNPS.forEach((snp) => {
    if (snp.rsid) allowlist.add(snp.rsid.toLowerCase());
    if (snp.name) allowlist.add(snp.name.toLowerCase());
    addCoordinates(snp.chromosome, snp.position);
  });

  // 1.11 SNP Alias Catalog & Alternate Probes
  SNP_ALIAS_CATALOG.forEach((item) => {
    if (item.primaryName) allowlist.add(item.primaryName.toLowerCase());
    if (item.aliases) {
      item.aliases.forEach((alias) => allowlist.add(alias.toLowerCase()));
    }
    addCoordinates(item.chrom, item.posGrch37);
  });

  // 1.12 High-Confidence LD Proxies (r² ≥ 0.95)
  Object.entries(DIAGNOSTIC_LD_PROXIES).forEach(([targetRsid, proxies]) => {
    allowlist.add(targetRsid.toLowerCase());
    proxies.forEach((proxy) => {
      if (proxy.proxyRsid) allowlist.add(proxy.proxyRsid.toLowerCase());
      addCoordinates(proxy.proxyChr, proxy.proxyPos);
    });
  });

  // 1.13 Polygenic Risk Score (PRS) Models
  Object.values(prsModels).forEach((model: any) => {
    if (model && model.snps) {
      Object.keys(model.snps).forEach((rsid) => allowlist.add(rsid.toLowerCase()));
    }
  });

  // 2. SNP_DB (Health, Traits, etc.)
  SNP_DB.forEach((snp) => {
    if (snp.markerId) allowlist.add(snp.markerId.toLowerCase());
    if (snp.rsid) allowlist.add(snp.rsid.toLowerCase());
    if (snp.aliases) snp.aliases.forEach((a) => allowlist.add(a.toLowerCase()));
  });

  // 3. Anchor AIMs
  ANCHOR_AIMS.forEach((aim) => {
    if (aim.rsid) allowlist.add(aim.rsid.toLowerCase());
  });

  // 4. Ancient Individual Samples
  Object.entries(masterAncient.samples).forEach(([id, data]: [string, any]) => {
    if (id === '_metadata') return;
    const markers = data.snps || data.genotypes || {};
    Object.keys(markers).forEach((rsid) => allowlist.add(rsid.toLowerCase()));
  });

  cachedAllowlist = allowlist;
  return allowlist;
}
