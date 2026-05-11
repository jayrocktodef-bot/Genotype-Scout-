import africa from './africa.json' with { type: 'json' };
import europe from './europe.json' with { type: 'json' };
import eastAsia from './east-asia.json' with { type: 'json' };
import southAsia from './south-asia.json' with { type: 'json' };
import middleEast from './middle-east.json' with { type: 'json' };
import americas from './americas.json' with { type: 'json' };
import oceania from './oceania.json' with { type: 'json' };
import centralAsia from './central-asia.json' with { type: 'json' };
import globalMarkers from './global.json' with { type: 'json' };
import keyAims from './key_aims.json' with { type: 'json' };
import forensicAims from '../phenotype_forensic/forensic_aims_master.json' with { type: 'json' };
import deepResolutionAims from '../phenotype_forensic/deep_resolution_aims.json' with { type: 'json' };
import commercialAimWeights from './commercial_aim_weights.json' with { type: 'json' };
import colonialAimWeights from './colonial_aim_weights.json' with { type: 'json' };
import africanDeepResWeights from './african_deep_res_weights.json' with { type: 'json' };
import graf10kWeights from './graf_10k_weights.json' with { type: 'json' };
import customCuratedMarkers from './custom_curated_markers.json' with { type: 'json' };
import { formatProfessionalMarkers } from '../professionalPanels';

export const ANCESTRY_MARKERS = [
  ...africa,
  ...europe,
  ...eastAsia,
  ...southAsia,
  ...middleEast,
  ...americas,
  ...oceania,
  ...centralAsia,
  ...globalMarkers,
  ...keyAims,
  ...formatProfessionalMarkers(forensicAims),
  ...formatProfessionalMarkers(deepResolutionAims),
  ...formatProfessionalMarkers(commercialAimWeights),
  ...formatProfessionalMarkers(colonialAimWeights),
  ...formatProfessionalMarkers(africanDeepResWeights),
  ...formatProfessionalMarkers(graf10kWeights),
  ...formatProfessionalMarkers(customCuratedMarkers)
];
