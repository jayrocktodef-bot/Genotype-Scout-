/**
 * Light Imputation for Genotype Scout
 * Implements basic frequency-based SNP fill for missing key ancestry markers.
 */
import { ANCHOR_AIMS } from "../../anchorAims";

// Mapping of marker to most frequent genotype (placeholder for a fuller frequency table)
const frequencyMap: Record<string, string> = {
  // Common markers needed for high-resolution ancestry
  "rs4988235": "AG", // Lactase persistence
  "rs10757274": "GG",
  "rs12913832": "AA",
};

export function applyLightImputation(snpMap: Record<string, string>): Record<string, string> {
  const imputedMap = { ...snpMap };
  
  ANCHOR_AIMS.forEach(aim => {
    if (!imputedMap[aim.rsid]) {
      // If marker is missing, fill with known frequent genotype
      if (frequencyMap[aim.rsid]) {
        imputedMap[aim.rsid] = frequencyMap[aim.rsid];
      }
    }
  });

  return imputedMap;
}
