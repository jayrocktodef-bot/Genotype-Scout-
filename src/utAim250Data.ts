import { AIMWeights } from './services/aimService';

/**
 * UT-AIM250 Reference Data
 * This file contains the Ancestry Informative Markers (AIMs) from the UT-AIM250 dataset.
 * To populate this file, you can run the fetch script or manually add the merged 
 * data from AIM250_info.txt and AIM250_freq.txt.
 */
export const UT_AIM250_DATA: AIMWeights = {
  "rs2814778": {
    targetAllele: "C",
    freq: {
      "Sub-Saharan Africa": 0.99,
      "Europe": 0.01,
      "East Asian": 0.01
    }
  },
  "rs1426654": {
    targetAllele: "A",
    freq: {
      "Sub-Saharan Africa": 0.05,
      "Europe": 0.99,
      "East Asian": 0.05
    }
  },
  "rs3827760": {
    targetAllele: "G",
    freq: {
      "Sub-Saharan Africa": 0.01,
      "Europe": 0.01,
      "East Asian": 0.95
    }
  }
};
