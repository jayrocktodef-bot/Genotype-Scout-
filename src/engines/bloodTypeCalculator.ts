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
  // Note: 'D' = Deletion (O), 'I' = Insertion (A or B)
  if (oMarker === 'DD' || oMarker === 'O/O') {
    phenotype = "O";
  } else {
    // If not O, check if B markers are present
    const hasB = bMarker && (bMarker.includes('C'));
    const isHomozygousB = bMarker === 'CC';
    
    if (hasB) {
      // If they have B and are not Type O, they are either B or AB
      // A truly robust app would check A-specific SNPs too, but B is the most distinct
      phenotype = (oMarker === 'II' && isHomozygousB) ? "B" : "AB"; 
      // Simplification: most non-O carriers with B variants are B or AB
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

