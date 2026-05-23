// src/data/index.ts

// ==========================================
// 1. ANCIENT & HISTORICAL KERNELS
// ==========================================
import masterAncient from './master_ancient_profiles.json';

// ==========================================
// 2. HEALTH & PHARMACOGENOMICS
// ==========================================
import masterHealth from './master_health_pgx.json';

// ==========================================
// 3. PHENOTYPE & FORENSIC
// ==========================================
import appearanceTraits from './raw_aims/appearance_traits.json';
import appearanceWeights from './raw_aims/appearance_weights.json';
import forensicAimsMaster from './raw_aims/forensic_aims_master.json';
import microhapTop100Kernel from './raw_aims/microhap_top100_kernel.json';
import deepResolutionAims from './raw_aims/deep_resolution_aims.json';
import euroforgenNamePanel from './raw_aims/euroforgen_name_panel.json';

// ==========================================
// 4. ANCESTRY & ADMIXTURE
// ==========================================
import commercialAimWeights from './raw_aims/commercial_aim_weights.json';
import colonialAimWeights from './raw_aims/colonial_aim_weights.json';
import africanDeepResWeights from './raw_aims/african_deep_res_weights.json';
import graf10kWeights from './raw_aims/graf_10k_weights.json';
import graf10kIndex from './raw_aims/graf_10k_index.json';
import customCuratedMarkers from './raw_aims/custom_curated_markers.json';
import keyAims from './raw_aims/key_aims.json';
import masterAims from './master_aims_normalized.json';
import masterMtdna from './master_mtdna.json';
import masterYdna from './master_ydna.json';
import { AimsRegistry, getAllAims } from './raw_aims/index';

// Export everything as a clean module
export {
  // Ancient & Historical
  masterAncient,

  // Haplogroups & Mitochondrial
  masterMtdna,
  masterYdna,

  // Health & PGx
  masterHealth,

  // Phenotype & Forensic
  appearanceTraits,
  appearanceWeights,
  forensicAimsMaster,
  microhapTop100Kernel,
  deepResolutionAims,
  euroforgenNamePanel,

  // Ancestry
  commercialAimWeights,
  colonialAimWeights,
  africanDeepResWeights,
  graf10kWeights,
  graf10kIndex,
  customCuratedMarkers,
  keyAims,
  masterAims,
  AimsRegistry,
  getAllAims
};
