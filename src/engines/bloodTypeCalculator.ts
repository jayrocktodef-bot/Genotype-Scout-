import { inferRhFactor } from '../services/bloodPredictorService';

export function calculateBloodType(userSnps: Record<string, string> | undefined) {
  if (!userSnps) {
    return {
      bloodType: "Unknown",
      confidence: "Low",
      details: { abo: "Unknown", rh: "Unknown" }
    };
  }
  const oMarker = userSnps['rs8176719']; // O vs non-O
  const bMarker = userSnps['rs8176747']; // B-specific variant
  const a2Marker = userSnps['rs8176746']; // A1 vs A2
  const abDiffMarker = userSnps['rs8176750']; // A/B differentiation

  let phenotype = "Unknown";
  
  // Predict Rh using our advanced multi-marker inferRhFactor function
  const rhInference = inferRhFactor(userSnps);
  let rhFactor = "Unknown";
  if (rhInference.phenotype === "Positive") {
    rhFactor = "+";
  } else if (rhInference.phenotype === "Negative") {
    rhFactor = "-";
  }

  // 2. Determine ABO Phenotype
  const isOVal = (val: string) => 
    val && val !== '--' && val !== '00' && val !== 'NN' && (
      ["DD", "O/O", "-/-", "D/D"].includes(val) ||
      val.split('').every(c => c === '-' || c === 'D' || c === 'O')
    );

  const isNoCallO = !oMarker || oMarker === '--' || oMarker === '00' || oMarker === 'NN';

  if (!isNoCallO) {
    if (isOVal(oMarker)) {
      phenotype = "O";
    } else {
      const hasA = (a2Marker && a2Marker !== '--' && (a2Marker.includes('G') || a2Marker.includes('A')));
      const hasB = (bMarker && bMarker !== '--' && bMarker.includes('C'));
      if (hasA && hasB) phenotype = "AB";
      else if (hasA) phenotype = "A";
      else if (hasB) phenotype = "B";
    }
  } else {
    // If oMarker is missing/no-call but we have A/B indicators
    const hasA = (a2Marker && a2Marker !== '--' && (a2Marker.includes('G') || a2Marker.includes('A')));
    const hasB = (bMarker && bMarker !== '--' && bMarker.includes('C'));
    if (hasA && hasB) phenotype = "AB";
    else if (hasA) phenotype = "A";
    else if (hasB) phenotype = "B";
  }

  return {
    bloodType: phenotype === "Unknown" ? "Unknown" : `${phenotype}${rhFactor === "Unknown" ? "?" : rhFactor}`,
    confidence: (oMarker && oMarker !== '--' && oMarker !== '00' && rhInference.phenotype !== "Unknown") ? "High" : "Low",
    details: {
      abo: phenotype,
      rh: rhFactor,
      rhConfidence: rhInference.confidence,
      rhPhenotype: rhInference.phenotype,
      rhResults: rhInference.results
    }
  };
}

