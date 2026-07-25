import { inferRhFactor } from '../services/bloodPredictorService';

export function calculateBloodType(userSnps: Record<string, string> | undefined) {
  if (!userSnps || Object.keys(userSnps).length === 0) {
    return {
      bloodType: "Unknown",
      confidence: "Low",
      details: { abo: "Unknown", rh: "Unknown" }
    };
  }

  const o1Marker = userSnps['rs8176719'] || userSnps['RS8176719']; // O 261delG frameshift
  const oSurrogate1 = userSnps['rs505922'] || userSnps['RS505922']; // T = O allele, C = Non-O
  const oSurrogate2 = userSnps['rs507666'] || userSnps['RS507666']; // T = O allele, C = Non-O
  const bMarker = userSnps['rs8176747'] || userSnps['RS8176747'];   // C = B allele, G = Non-B
  const aMarker1 = userSnps['rs8176746'] || userSnps['RS8176746'];  // G/C = A1/O, A/T = A2
  const aMarker2 = userSnps['rs8176741'] || userSnps['RS8176741'];  // G/C = A allele
  const aMarker3 = userSnps['rs8176745'] || userSnps['RS8176745'];  // G/C = A/O, A/T = B

  let isO = false;
  let hasA = false;
  let hasB = false;

  // 1. Direct O 261delG frameshift check
  if (o1Marker && o1Marker !== '--' && o1Marker !== '00' && o1Marker !== 'NN') {
    const cleanO = o1Marker.toUpperCase();
    if (['DD', 'O/O', '-/-', 'D/D'].includes(cleanO) || cleanO.split('').every(c => c === '-' || c === 'D' || c === 'O')) {
      isO = TrueHelper(cleanO);
    }
  }

  // 2. Surrogate O marker (rs505922: TT or AA = O/O homozygous)
  if (!isO && oSurrogate1 && oSurrogate1 !== '--' && oSurrogate1 !== '00') {
    const cleanO1 = oSurrogate1.toUpperCase().replace(/[\s\/_]/g, '');
    if (cleanO1 === 'TT' || cleanO1 === 'AA') {
      isO = true;
    }
  }

  if (!isO && oSurrogate2 && oSurrogate2 !== '--' && oSurrogate2 !== '00') {
    const cleanO2 = oSurrogate2.toUpperCase().replace(/[\s\/_]/g, '');
    if (cleanO2 === 'TT' || cleanO2 === 'AA') {
      isO = true;
    }
  }

  // 3. B allele check (rs8176747: C = B allele, or rs8176745: A/T = B allele)
  if (bMarker && bMarker !== '--' && bMarker !== '00') {
    const cleanB = bMarker.toUpperCase();
    if (cleanB.includes('C') || cleanB.includes('G')) {
      // In rs8176747: C is B-specific
      if (cleanB.includes('C')) hasB = true;
    }
  }
  if (!hasB && aMarker3 && aMarker3 !== '--' && aMarker3 !== '00') {
    const cleanB3 = aMarker3.toUpperCase();
    if (cleanB3.includes('A') || cleanB3.includes('T')) {
      hasB = true;
    }
  }

  // 4. A allele check (rs8176746: G/C = A1/O; rs8176741: G/C = A allele)
  if (aMarker1 && aMarker1 !== '--' && aMarker1 !== '00') {
    const cleanA1 = aMarker1.toUpperCase();
    if (cleanA1.includes('G') || cleanA1.includes('C')) {
      hasA = true;
    }
  }
  if (!hasA && aMarker2 && aMarker2 !== '--' && aMarker2 !== '00') {
    const cleanA2 = aMarker2.toUpperCase();
    if (cleanA2.includes('G') || cleanA2.includes('C')) {
      hasA = true;
    }
  }

  // 5. Deduce ABO Phenotype
  let phenotype = "Unknown";
  if (isO) {
    phenotype = "O";
  } else if (hasA && hasB) {
    phenotype = "AB";
  } else if (hasA) {
    phenotype = "A";
  } else if (hasB) {
    phenotype = "B";
  } else if (oSurrogate1 || oSurrogate2 || aMarker1 || aMarker2) {
    // If no A or B antigen found, default to O
    phenotype = "O";
  }

  // Predict Rh Factor using multi-marker inferRhFactor function
  const rhInference = inferRhFactor(userSnps);
  let rhFactor = "Unknown";
  if (rhInference.phenotype === "Positive") {
    rhFactor = "+";
  } else if (rhInference.phenotype === "Negative") {
    rhFactor = "-";
  }

  const confidenceScore = (phenotype !== "Unknown" && rhFactor !== "Unknown") 
    ? (rhInference.confidence >= 0.8 ? "High" : "Moderate")
    : (phenotype !== "Unknown" ? "Moderate" : "Low");

  return {
    bloodType: phenotype === "Unknown" ? "Uncertain" : `${phenotype}${rhFactor === "Unknown" ? "?" : rhFactor}`,
    confidence: confidenceScore,
    details: {
      abo: phenotype,
      rh: rhFactor,
      rhConfidence: rhInference.confidence,
      rhPhenotype: rhInference.phenotype,
      rhResults: rhInference.results
    }
  };
}

function TrueHelper(val: string): boolean {
  return val.length > 0;
}
