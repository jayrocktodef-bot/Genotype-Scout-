// src/data/index.ts

// ==========================================
// 1. ANCIENT & HISTORICAL KERNELS
// ==========================================
import masterAncientRaw from './master_ancient_profiles.json?raw';
const masterAncient = JSON.parse(masterAncientRaw);

// ==========================================
// 2. HEALTH & PHARMACOGENOMICS
// ==========================================
import masterHealthRaw from './master_health_pgx.json?raw';
const masterHealth = JSON.parse(masterHealthRaw);

// ==========================================
// 3. PHENOTYPE & FORENSIC
// ==========================================
import appearanceTraitsRaw from './raw_aims/appearance_traits.json?raw';
const appearanceTraits = JSON.parse(appearanceTraitsRaw);
import appearanceWeightsRaw from './raw_aims/appearance_weights.json?raw';
const appearanceWeights = JSON.parse(appearanceWeightsRaw);
import forensicAimsMasterRaw from './raw_aims/forensic_aims_master.json?raw';
const forensicAimsMaster = JSON.parse(forensicAimsMasterRaw);
import microhapTop100KernelRaw from './raw_aims/microhap_top100_kernel.json?raw';
const microhapTop100Kernel = JSON.parse(microhapTop100KernelRaw);
import deepResolutionAimsRaw from './raw_aims/deep_resolution_aims.json?raw';
const deepResolutionAims = JSON.parse(deepResolutionAimsRaw);
import euroforgenNamePanelRaw from './raw_aims/euroforgen_name_panel.json?raw';
const euroforgenNamePanel = JSON.parse(euroforgenNamePanelRaw);

// ==========================================
// 4. ANCESTRY & ADMIXTURE
// ==========================================
import commercialAimWeightsRaw from './raw_aims/commercial_aim_weights.json?raw';
const commercialAimWeights = JSON.parse(commercialAimWeightsRaw);
import colonialAimWeightsRaw from './raw_aims/colonial_aim_weights.json?raw';
const colonialAimWeights = JSON.parse(colonialAimWeightsRaw);
import africanDeepResWeightsRaw from './raw_aims/african_deep_res_weights.json?raw';
const africanDeepResWeights = JSON.parse(africanDeepResWeightsRaw);
import graf10kWeightsRaw from './raw_aims/graf_10k_weights.json?raw';
const graf10kWeights = JSON.parse(graf10kWeightsRaw);
import graf10kIndexRaw from './raw_aims/graf_10k_index.json?raw';
const graf10kIndex = JSON.parse(graf10kIndexRaw);
import customCuratedMarkersRaw from './raw_aims/custom_curated_markers.json?raw';
const customCuratedMarkers = JSON.parse(customCuratedMarkersRaw);
import keyAimsRaw from './raw_aims/key_aims.json?raw';
const keyAims = JSON.parse(keyAimsRaw);

// Export everything as a clean module
export {
  // Ancient & Historical
  masterAncient,

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
  keyAims
};
