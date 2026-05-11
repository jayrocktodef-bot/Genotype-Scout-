// src/data/index.ts

// ==========================================
// 1. ANCIENT & HISTORICAL KERNELS
// ==========================================
import ancientMatches from './ancient_historical/ancientMatches.json';
import ancientAfricanWeights from './ancient_historical/ancient_african_weights.json';
import historicalClusters from './ancient_historical/historical_clusters.json';
import ancientDnaMarkers from './ancient_historical/ancient_dna_markers.json';
import ancientSamples from './ancient_historical/ancient_samples.json';

// ==========================================
// 2. HEALTH & PHARMACOGENOMICS
// ==========================================
import pharmacogenomics from './health_pgx/pharmacogenomics.json';
import autoimmuneHlaPanel from './health_pgx/autoimmune_hla_panel.json';
import bloodMarkers from './health_pgx/blood_markers.json';
import clinicalHealth from './health_pgx/clinical_health.json';

// ==========================================
// 3. PHENOTYPE & FORENSIC
// ==========================================
import appearanceTraits from './phenotype_forensic/appearance_traits.json';
import appearanceWeights from './phenotype_forensic/appearance_weights.json';
import forensicAimsMaster from './phenotype_forensic/forensic_aims_master.json';
import microhapTop100Kernel from './phenotype_forensic/microhap_top100_kernel.json';
import deepResolutionAims from './phenotype_forensic/deep_resolution_aims.json';
import euroforgenNamePanel from './phenotype_forensic/euroforgen_name_panel.json';

// ==========================================
// 4. ANCESTRY & ADMIXTURE
// ==========================================
import commercialAimWeights from './ancestry/commercial_aim_weights.json';
import colonialAimWeights from './ancestry/colonial_aim_weights.json';
import africanDeepResWeights from './ancestry/african_deep_res_weights.json';
import graf10kWeights from './ancestry/graf_10k_weights.json';
import graf10kIndex from './ancestry/graf_10k_index.json';
import customCuratedMarkers from './ancestry/custom_curated_markers.json';
import keyAims from './ancestry/key_aims.json';

// Export everything as a clean module
export {
  // Ancient & Historical
  ancientMatches,
  ancientAfricanWeights,
  historicalClusters,
  ancientDnaMarkers,
  ancientSamples,

  // Health & PGx
  pharmacogenomics,
  autoimmuneHlaPanel,
  bloodMarkers,
  clinicalHealth,

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
