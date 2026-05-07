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
  const rhMarker = userSnps['rs590787']; // Rh Factor

  let phenotype = "Unknown";
  let rhFactor = "Unknown";

  // 1. Determine Rh Factor
  if (rhMarker === 'CC') rhFactor = "-";
  else if (rhMarker === 'CT' || rhMarker === 'TT') rhFactor = "+";

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
    bloodType: `${phenotype}${rhFactor}`,
    confidence: (oMarker && rhMarker) ? "High" : "Low",
    details: {
      abo: phenotype,
      rh: rhFactor
    }
  };
}
