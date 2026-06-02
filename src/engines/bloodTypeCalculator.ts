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
  // Note: 'D' = Deletion (O), 'I' = Insertion (A or B), '-' = Deletion
  const isHomozygousO = oMarker && (
    ["DD", "--", "O/O", "-/-", "D/D"].includes(oMarker) ||
    oMarker.split('').every(c => c === '-' || c === 'D' || c === 'O')
  );

  if (isHomozygousO) {
    phenotype = "O";
  } else {
    // If not O, check if B markers are present
    const hasB = bMarker && (bMarker.includes('C'));
    const isHomozygousB = bMarker === 'CC';
    
    if (hasB) {
      // If they have B and are not Type O, they are either B or AB
      phenotype = (oMarker === 'II' && isHomozygousB) ? "B" : "AB"; 
    } else {
      phenotype = "A";
    }
  }

  return {
    bloodType: `${phenotype}${rhFactor === "Unknown" ? "?" : rhFactor}`,
    confidence: (oMarker && rhInference.phenotype !== "Unknown") ? "High" : "Low",
    details: {
      abo: phenotype,
      rh: rhFactor,
      rhConfidence: rhInference.confidence,
      rhPhenotype: rhInference.phenotype,
      rhResults: rhInference.results
    }
  };
}

