/**
 * engineMarkerSlicer.ts — Memory-Optimized Slicing for Parallel Worker Engines.
 *
 * Prevents structured-cloning memory storms on mobile devices (e.g. iOS Safari ~1.5GB OOM limit)
 * when fanning out tasks across multiple Web Worker threads.
 *
 * Instead of duplicating a 1M-SNP dataset (~80MB JSON / structured clone) 11 times across
 * thread pool dispatches (~880MB RAM spike), this utility extracts ONLY the ~300 to ~18,000 markers
 * queried by each specific calculation engine.
 */

import { loadMasterAims, getAncestryIndex } from '../data/index';
import { SNP_DB } from '../data/snpDatabase';
import { ANCHOR_AIMS } from '../anchorAims';
import masterAncient from '../data/master_ancient_profiles.json';
import ancientSamplesRaw from '../data/raw_ancient/ancient_samples.json';
import ancientMatchesRaw from '../data/raw_ancient/ancientMatches.json';
import v5MarkersMaster from '../data/v5_markers_master.json';
import bloodMarkers from '../data/blood_markers.json';
import masterHealth from '../data/master_health_pgx.json';
import appearanceTraits from '../data/raw_aims/appearance_traits.json';
import { PGX_MARKERS_MAP } from '../engines/health/pypgxEngine';
import { dietLogic } from '../engines/dietaryCalculator';
import microHapKernel from '../data/raw_aims/microhap_top100_kernel.json';
import grafIndex from '../data/raw_aims/graf_10k_index.json';
import forensicAims from '../data/raw_aims/forensic_aims_master.json';
import deepAims from '../data/raw_aims/deep_resolution_aims.json';
import euroforgenPanel from '../data/raw_aims/euroforgen_name_panel.json';
import customCuratedMarkers from '../data/raw_aims/custom_curated_markers.json';
import ancientCladesFrequencies from '../data/raw_ancient/ancient_clades_frequencies.json';
import { SNP_PROXY_MAP } from '../utils/genotypeUtils';

// Cache of marker sets per engine to ensure O(1) set retrieval after lazy initialization
const engineMarkerCache = new Map<string, Set<string>>();

function addMarkerKey(set: Set<string>, rsid?: string, chrom?: string | number, pos?: string | number) {
  if (rsid) {
    const lower = rsid.toLowerCase();
    const upper = rsid.toUpperCase();
    set.add(lower);
    set.add(upper);
    set.add(rsid);

    const split = lower.split('_')[0];
    if (split !== lower) {
      set.add(split);
      set.add(split.toUpperCase());
    }
  }
  if (chrom !== undefined && pos !== undefined) {
    const c = String(chrom).trim().replace(/^chr/i, '').toLowerCase();
    const p = String(pos).trim();
    if (c && p) {
      set.add(`chr${c}_${p}`);
      set.add(`${c}_${p}`);
      set.add(`chr${c}:${p}`);
      set.add(`${c}:${p}`);
      set.add(`chr${c.toUpperCase()}_${p}`);
      set.add(`${c.toUpperCase()}_${p}`);
      set.add(`chr${c.toUpperCase()}:${p}`);
      set.add(`${c.toUpperCase()}:${p}`);
    }
  }
}

function buildMarkerSetForEngine(engine: string): Set<string> {
  const set = new Set<string>();

  switch (engine) {
    case 'matchHealthAndWellness': {
      // 1. V5 Master Markers
      for (const m of (v5MarkersMaster as any[])) {
        addMarkerKey(set, m.rsid, m.chromosome || m.chrom, m.position || m.pos);
      }
      // 2. Master Health PGX
      for (const rsid of Object.keys(masterHealth)) {
        addMarkerKey(set, rsid);
      }
      // 3. Appearance Traits
      for (const m of (appearanceTraits as any[])) {
        addMarkerKey(set, m.rsid, m.chrom, m.pos);
      }
      // 4. Blood Markers
      if (bloodMarkers) {
        if ((bloodMarkers as any).rhSystem) {
          for (const rsid of Object.keys((bloodMarkers as any).rhSystem)) {
            addMarkerKey(set, rsid);
          }
        }
        if ((bloodMarkers as any).aboSystem) {
          for (const rsid of Object.keys((bloodMarkers as any).aboSystem)) {
            addMarkerKey(set, rsid);
          }
        }
      }
      // 5. PGx Map
      for (const snps of Object.values(PGX_MARKERS_MAP)) {
        for (const rsid of snps) addMarkerKey(set, rsid);
      }
      // 6. Dietary traits
      for (const config of Object.values(dietLogic)) {
        if (config.rsid) addMarkerKey(set, config.rsid);
      }
      // 7. Secretor and additional blood groups
      ['rs601338', 'rs1047781', 'rs2285603', 'rs1018780', 'rs11545624', 'rs2075592', 'rs311103'].forEach(r => {
        addMarkerKey(set, r);
      });
      break;
    }

    case 'calculateAncientAdmixture': {
      for (const [rsid, marker] of Object.entries(grafIndex)) {
        addMarkerKey(set, rsid, (marker as any).chr, (marker as any).pos);
      }
      for (const rsid of Object.keys(ancientCladesFrequencies)) {
        addMarkerKey(set, rsid);
      }
      break;
    }

    case 'calculateIndividualMatches': {
      // 1. Master Ancient Samples & Matches
      const rawSamples = [
        ...Object.values(masterAncient.samples || {}),
        ...((masterAncient as any).matches || []),
        ...(Array.isArray(ancientSamplesRaw) ? ancientSamplesRaw : Object.values(ancientSamplesRaw || {})),
        ...(Array.isArray(ancientMatchesRaw) ? ancientMatchesRaw : Object.values(ancientMatchesRaw || {}))
      ];
      for (const s of rawSamples) {
        if (!s) continue;
        const markers = { ...(s.snps || {}), ...(s.genotypes || {}) };
        for (const rsid of Object.keys(markers)) {
          addMarkerKey(set, rsid);
        }
      }
      // 2. GRAF Index coordinates for coordinate fallback matching
      for (const [rsid, marker] of Object.entries(grafIndex)) {
        addMarkerKey(set, rsid, (marker as any).chr, (marker as any).pos);
      }
      break;
    }

    case 'calculateFamousMatches': {
      const rawSamples = [
        ...Object.values(masterAncient.samples || {}),
        ...((masterAncient as any).matches || [])
      ];
      for (const s of rawSamples) {
        if (!s) continue;
        const markers = (s as any).snps || (s as any).genotypes || {};
        for (const rsid of Object.keys(markers)) {
          addMarkerKey(set, rsid);
        }
      }
      break;
    }

    case 'calculateMarkerBenchmarks': {
      for (const [rsid, marker] of Object.entries(grafIndex)) {
        addMarkerKey(set, rsid, (marker as any).chr, (marker as any).pos);
      }
      for (const aim of (forensicAims as any[])) {
        addMarkerKey(set, aim.rsid, aim.chromosome || aim.chrom, aim.position || aim.pos);
      }
      for (const aim of (deepAims as any[])) {
        addMarkerKey(set, aim.rsid, aim.chromosome || aim.chrom, aim.position || aim.pos);
      }
      if (Array.isArray((euroforgenPanel as any)?.markers)) {
        for (const rsid of (euroforgenPanel as any).markers) {
          addMarkerKey(set, rsid);
        }
      }
      for (const rsid of Object.keys(customCuratedMarkers)) {
        addMarkerKey(set, rsid);
      }
      break;
    }

    case 'calculateHumanOriginsScores':
    case 'calculatePopulationProximityOptimized': {
      for (const [rsid, marker] of Object.entries(grafIndex)) {
        addMarkerKey(set, rsid, (marker as any).chr, (marker as any).pos);
      }
      const aims = loadMasterAims() as Record<string, any>;
      for (const m of Object.values(aims)) {
        addMarkerKey(set, m.rsid, m.chromosome || m.chrom, m.position || m.pos);
      }
      break;
    }

    case 'calculateRegionalScores': {
      for (const [rsid, marker] of Object.entries(grafIndex)) {
        addMarkerKey(set, rsid, (marker as any).chr, (marker as any).pos);
      }
      break;
    }

    case 'identifyMicroHapSignatures': {
      for (const hap of (microHapKernel as any[])) {
        if (hap.snps) {
          for (const rsid of hap.snps) {
            addMarkerKey(set, rsid);
          }
        }
      }
      break;
    }

    case 'calculateComprehensiveScores': {
      const aims = loadMasterAims() as Record<string, any>;
      for (const m of Object.values(aims)) {
        addMarkerKey(set, m.rsid, m.chromosome || m.chrom, m.position || m.pos);
      }
      break;
    }

    case 'matchSNPs': {
      // 1. SNP_DB
      for (const snp of SNP_DB) {
        addMarkerKey(set, snp.markerId);
        addMarkerKey(set, snp.rsid);
        if (snp.aliases) {
          for (const a of snp.aliases) addMarkerKey(set, a);
        }
      }
      // 2. ANCHOR_AIMS
      for (const aim of ANCHOR_AIMS) {
        addMarkerKey(set, aim.rsid, (aim as any).chromosome || (aim as any).chrom, (aim as any).position || (aim as any).pos);
      }
      // 3. Ancestry Index
      const ancestryMarkers = getAncestryIndex().getAllMarkers();
      for (const m of ancestryMarkers) {
        addMarkerKey(set, m.rsid, (m as any).chromosome || (m as any).chrom, (m as any).position || (m as any).pos);
      }
      // 4. V5 Markers Master
      for (const m of (v5MarkersMaster as any[])) {
        addMarkerKey(set, m.rsid, m.chromosome || m.chrom, m.position || m.pos);
      }
      // 5. SNP Proxies
      for (const [target, proxies] of Object.entries(SNP_PROXY_MAP)) {
        addMarkerKey(set, target);
        for (const p of proxies) addMarkerKey(set, p);
      }
      break;
    }

    default:
      // Unknown engine: return empty set (will signal fallback to full snpMap)
      break;
  }

  return set;
}

export function getEngineMarkerSet(engine: string): Set<string> {
  let set = engineMarkerCache.get(engine);
  if (!set) {
    set = buildMarkerSetForEngine(engine);
    engineMarkerCache.set(engine, set);
  }
  return set;
}

/**
 * Slices the input snpMap and optional snpMetaMap to contain only the markers needed
 * by the target engine.
 *
 * If the input dataset is already small (<= 2,500 markers, e.g. in test suites or sparse files),
 * the input maps are returned directly to bypass slicing overhead.
 */
export function sliceSnpsForEngine(
  engine: string,
  snpMap: Record<string, string>,
  snpMetaMap?: Record<string, { chrom: string; pos: number }>
): {
  slicedSnpMap: Record<string, string>;
  slicedMetaMap?: Record<string, { chrom: string; pos: number }>;
} {
  if (!snpMap) {
    return { slicedSnpMap: {}, slicedMetaMap: undefined };
  }

  // Small kit bypass (e.g. unit test fixtures, partial kits)
  const markerCount = Object.keys(snpMap).length;
  if (markerCount <= 2500) {
    return { slicedSnpMap: snpMap, slicedMetaMap: snpMetaMap };
  }

  const engineSet = getEngineMarkerSet(engine);
  if (!engineSet || engineSet.size === 0) {
    // If engine is not recognized or has no marker set, safely preserve original maps
    return { slicedSnpMap: snpMap, slicedMetaMap: snpMetaMap };
  }

  const slicedSnpMap: Record<string, string> = {};
  const slicedMetaMap: Record<string, { chrom: string; pos: number }> | undefined = snpMetaMap ? {} : undefined;

  // Set-driven iteration: O(engineSet.size) instead of O(snpMap.length)
  for (const key of engineSet) {
    const val = snpMap[key];
    if (val !== undefined) {
      slicedSnpMap[key] = val;
      if (slicedMetaMap && snpMetaMap && snpMetaMap[key]) {
        slicedMetaMap[key] = snpMetaMap[key];
      }
    }
  }

  return { slicedSnpMap, slicedMetaMap };
}
