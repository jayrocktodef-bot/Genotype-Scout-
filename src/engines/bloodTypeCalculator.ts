import { inferRhFactor } from '../services/bloodPredictorService';
import { 
  ABODiplotypeResult, 
  RhDetailedResult, 
  ExtendedBloodSystemResult, 
  BloodGroupProfile, 
  RhPrediction 
} from '../types/blood';

function getGenotype(userSnps: Record<string, string> | undefined, rsid: string): string | null {
  if (!userSnps) return null;
  const val = userSnps[rsid] || 
              userSnps[rsid.toLowerCase()] || 
              userSnps[rsid.toUpperCase()];
  if (!val || val === '--' || val === '00' || val === 'NN' || val === 'No Call') {
    return null;
  }
  return val.trim().toUpperCase().replace(/[\s\/_]/g, '');
}

/**
 * Determines whether a genotype represents the O 261delG frameshift deletion.
 */
function isODeletionHom(genotype: string | null): boolean {
  if (!genotype) return false;
  const g = genotype.toUpperCase();
  return ['DD', 'O/O', '-/-', 'D/D', 'DEL/DEL', '--'].includes(g) || 
         (g.length >= 2 && g.split('').every(c => c === '-' || c === 'D' || c === 'O'));
}

function isODeletionHet(genotype: string | null): boolean {
  if (!genotype) return false;
  const g = genotype.toUpperCase();
  if (isODeletionHom(g)) return false;
  return g.includes('D') || g.includes('-') || g.includes('DEL') || g === 'DI' || g === 'ID' || g === 'GD' || g === 'DG';
}

/**
 * Evaluates Bombay Oh phenotype based on FUT1 loss-of-function markers.
 */
function checkBombayPhenotype(userSnps: Record<string, string> | undefined): boolean {
  const fut1_w242x = getGenotype(userSnps, 'rs1048570'); // Trp242Ter (null)
  const fut1_q140x = getGenotype(userSnps, 'rs1048571'); // Gln140Ter (null)
  
  if (fut1_w242x && ['AA', 'TT'].includes(fut1_w242x)) return true;
  if (fut1_q140x && ['TT', 'AA'].includes(fut1_q140x)) return true;
  return false;
}

/**
 * Deterministically infers ABO Alleles and phased diplotype.
 */
export function inferABODiplotype(userSnps: Record<string, string> | undefined): ABODiplotypeResult {
  if (!userSnps || Object.keys(userSnps).length === 0) {
    return {
      diplotype: "Unknown",
      phenotype: "Unknown",
      subgroup: "Unknown",
      probability: 0,
      isBombay: false,
      isCisAB: false,
      markersCompared: 0,
      detectedAlleles: []
    };
  }

  // 1. Bombay check
  const isBombay = checkBombayPhenotype(userSnps);

  // 2. Query key ABO polymorphic markers
  const o1Marker = getGenotype(userSnps, 'rs8176719'); // c.261delG frameshift
  const oSurrogate1 = getGenotype(userSnps, 'rs505922'); // T = O allele, C = Non-O
  const oSurrogate2 = getGenotype(userSnps, 'rs507666'); // T = O allele, C = Non-O
  const bMarker1 = getGenotype(userSnps, 'rs8176747');   // c.803G>C: C = B allele, G = Non-B
  const bMarker2 = getGenotype(userSnps, 'rs8176745');   // c.526C>G/T: A/T = B allele, G/C = Non-B
  const bMarker3 = getGenotype(userSnps, 'rs8176750');   // c.703G>A: G/C = B allele
  const aMarker1 = getGenotype(userSnps, 'rs8176746');  // c.796C>A: G/C = A1/O, A/T = A2
  const aMarker2 = getGenotype(userSnps, 'rs8176741');  // G/C = A allele
  const cisAbMarker = getGenotype(userSnps, 'rs8176743'); // Cis-AB hybrid mutation
  const o2Marker = getGenotype(userSnps, 'rs1053878');   // c.467C>T: C = O2 allele

  let markersCompared = 0;
  const countedSnps = [o1Marker, oSurrogate1, oSurrogate2, bMarker1, bMarker2, aMarker1, aMarker2, cisAbMarker, o2Marker];
  markersCompared = countedSnps.filter(Boolean).length;

  // Evaluate B allele
  let bCopies = 0;
  if (bMarker1) {
    if (bMarker1 === 'CC' || bMarker1 === 'GG') {
      if (bMarker1 === 'CC') bCopies = 2;
    }
    if (bMarker1.includes('C') && bMarker1 !== 'CC') bCopies = Math.max(bCopies, 1);
  }
  if (bCopies === 0 && bMarker2) {
    if (bMarker2.includes('A') || bMarker2.includes('T')) bCopies = Math.max(bCopies, 1);
  }
  if (bCopies === 0 && bMarker3) {
    if (bMarker3.includes('G') || bMarker3.includes('C')) bCopies = Math.max(bCopies, 1);
  }

  // Evaluate Cis-AB
  let isCisAB = false;
  if (cisAbMarker && (cisAbMarker.includes('C') || cisAbMarker.includes('A'))) {
    isCisAB = true;
  }

  // Evaluate O frameshift (261delG)
  let o1Copies = 0;
  if (o1Marker) {
    if (isODeletionHom(o1Marker)) {
      o1Copies = 2;
    } else if (isODeletionHet(o1Marker)) {
      o1Copies = 1;
    }
  } else {
    // Surrogate inference
    if (oSurrogate1 === 'TT' || oSurrogate1 === 'AA') {
      o1Copies = 2;
    } else if (oSurrogate1 === 'CT' || oSurrogate1 === 'TC' || oSurrogate1 === 'GA' || oSurrogate1 === 'AG') {
      o1Copies = 1;
    } else if (oSurrogate2 === 'TT' || oSurrogate2 === 'AA') {
      o1Copies = 2;
    } else if (oSurrogate2 === 'CT' || oSurrogate2 === 'TC' || oSurrogate2 === 'GA' || oSurrogate2 === 'AG') {
      o1Copies = 1;
    }
  }

  // Evaluate A1 vs A2
  let aSubtype: "A1" | "A2" | "A" = "A1";
  let hasA = false;
  if (aMarker1) {
    if (aMarker1 === 'AA' || aMarker1 === 'TT') {
      aSubtype = "A2";
      hasA = true;
    } else if (aMarker1.includes('G') || aMarker1.includes('C')) {
      aSubtype = "A1";
      hasA = true;
    }
  }
  if (!hasA && aMarker2) {
    if (aMarker2.includes('G') || aMarker2.includes('C')) {
      hasA = true;
    }
  }

  // Evaluate O2 non-deletion variant
  let hasO2 = false;
  if (o2Marker && (o2Marker.includes('C') || o2Marker.includes('G')) && o1Copies === 0) {
    hasO2 = true;
  }

  // Assemble detected alleles & diplotype
  let diplotype = "O1/O1";
  let phenotype: "A" | "B" | "AB" | "O" | "Bombay (Oh)" | "Cis-AB" | "Unknown" = "O";
  let subgroup = "O1";
  let probability = 0.95;
  const detectedAlleles: string[] = [];

  if (isBombay) {
    phenotype = "Bombay (Oh)";
    diplotype = "Oh (FUT1-null)";
    subgroup = "Oh";
    probability = 0.99;
    detectedAlleles.push("FUT1-null");
  } else if (isCisAB) {
    phenotype = "Cis-AB";
    diplotype = o1Copies > 0 ? "cis-AB/O1" : "cis-AB/A1";
    subgroup = "cis-AB";
    probability = 0.92;
    detectedAlleles.push("cis-AB", o1Copies > 0 ? "O1" : "A1");
  } else if (o1Copies === 2) {
    // Homozygous O
    phenotype = "O";
    diplotype = "O1/O1";
    subgroup = "O1";
    probability = 0.98;
    detectedAlleles.push("O1", "O1");
  } else if (o1Copies === 1) {
    // Heterozygous O carrier
    if (bCopies > 0 && hasA) {
      phenotype = "AB";
      diplotype = `${aSubtype}/B`;
      subgroup = `${aSubtype}B`;
      probability = 0.90;
      detectedAlleles.push(aSubtype, "B");
    } else if (bCopies > 0) {
      phenotype = "B";
      diplotype = "B/O1";
      subgroup = "B";
      probability = 0.95;
      detectedAlleles.push("B", "O1");
    } else if (hasA) {
      phenotype = "A";
      diplotype = `${aSubtype}/O1`;
      subgroup = aSubtype;
      probability = 0.95;
      detectedAlleles.push(aSubtype, "O1");
    } else {
      phenotype = "O";
      diplotype = "O1/O1v";
      subgroup = "O1";
      probability = 0.85;
      detectedAlleles.push("O1");
    }
  } else {
    // 0 copies of O1 frameshift
    if (bCopies > 0 && hasA) {
      phenotype = "AB";
      diplotype = `${aSubtype}/B`;
      subgroup = `${aSubtype}B`;
      probability = 0.95;
      detectedAlleles.push(aSubtype, "B");
    } else if (bCopies > 0) {
      phenotype = "B";
      diplotype = bCopies >= 2 ? "B/B" : (hasO2 ? "B/O2" : "B/B");
      subgroup = "B";
      probability = 0.92;
      detectedAlleles.push("B", bCopies >= 2 ? "B" : "O2");
    } else if (hasA) {
      phenotype = "A";
      diplotype = aSubtype === "A2" ? "A2/A2" : (hasO2 ? "A1/O2" : "A1/A1");
      subgroup = aSubtype;
      probability = 0.92;
      detectedAlleles.push(aSubtype, hasO2 ? "O2" : aSubtype);
    } else if (hasO2) {
      phenotype = "O";
      diplotype = "O2/O2";
      subgroup = "O2";
      probability = 0.88;
      detectedAlleles.push("O2", "O2");
    } else if (oSurrogate1 || oSurrogate2 || aMarker1 || bMarker1) {
      phenotype = "O";
      diplotype = "O1/O1";
      subgroup = "O1";
      probability = 0.80;
      detectedAlleles.push("O1");
    } else {
      phenotype = "Unknown";
      diplotype = "Unknown";
      subgroup = "Unknown";
      probability = 0;
    }
  }

  return {
    diplotype,
    phenotype,
    subgroup,
    probability,
    isBombay,
    isCisAB,
    markersCompared,
    detectedAlleles
  };
}

/**
 * Calculates extended blood group system phenotypes (Duffy, Kell, Kidd, Secretor, Diego, MNS).
 */
export function calculateExtendedBloodSystems(userSnps: Record<string, string> | undefined): Record<string, ExtendedBloodSystemResult> {
  const extended: Record<string, ExtendedBloodSystemResult> = {};

  // 1. Duffy Blood Group System (ACKR1 / DARC)
  const fy12075 = getGenotype(userSnps, 'rs12075');   // c.125G>A: G = Fyb, A = Fya
  const fy2814778 = getGenotype(userSnps, 'rs2814778'); // c.-67T>C GATA-1: CC = Fy(null)
  
  if (fy12075 || fy2814778) {
    let fyPheno = "Unknown";
    let fyAntigens = "";
    let conf: "High" | "Moderate" | "Low" = "Moderate";
    const markers: Array<{ snp: string; genotype: string; effect: string }> = [];

    if (fy2814778) {
      markers.push({ snp: "rs2814778", genotype: fy2814778, effect: "Erythroid GATA-1 promoter null tag" });
    }
    if (fy12075) {
      markers.push({ snp: "rs12075", genotype: fy12075, effect: "p.Asp42Gly (Fya vs Fyb determinant)" });
    }

    if (fy2814778 === 'CC' || fy2814778 === 'GG') {
      fyPheno = "Fy(a-b-) [Duffy Null]";
      fyAntigens = "Erythroid Fya- Fyb-";
      conf = "High";
    } else if (fy12075) {
      conf = fy2814778 ? "High" : "Moderate";
      if (fy12075 === 'AA' || fy12075 === 'TT') {
        fyPheno = "Fy(a+b-)";
        fyAntigens = "Fya+ Fyb-";
      } else if (fy12075 === 'GG' || fy12075 === 'CC') {
        fyPheno = "Fy(a-b+)";
        fyAntigens = "Fya- Fyb+";
      } else {
        fyPheno = "Fy(a+b+)";
        fyAntigens = "Fya+ Fyb+";
      }
    }

    extended["Duffy"] = {
      system: "Duffy",
      gene: "ACKR1 (DARC)",
      phenotype: fyPheno,
      genotype: `${fy2814778 || '--'} / ${fy12075 || '--'}`,
      antigens: fyAntigens,
      confidence: conf,
      description: "Chemokine receptor ACKR1; red cell entry receptor for Plasmodium vivax malaria.",
      clinicalSignificance: "Duffy-null individuals exhibit complete erythrocyte resistance to Plasmodium vivax malaria infection. Anti-Fya/anti-Fyb can cause acute or delayed hemolytic transfusion reactions.",
      markers
    };
  }

  // 2. Kell Blood Group System (KEL)
  const kel8176058 = getGenotype(userSnps, 'rs8176058'); // c.578C>T: C = K (KEL1), T = k (KEL2)
  if (kel8176058) {
    let kelPheno = "K-k+";
    let kelAntigens = "K- k+";
    if (kel8176058 === 'CC' || kel8176058 === 'GG') {
      kelPheno = "K+k-";
      kelAntigens = "K+ k-";
    } else if (['CT', 'TC', 'GA', 'AG'].includes(kel8176058)) {
      kelPheno = "K+k+";
      kelAntigens = "K+ k+";
    } else if (kel8176058 === 'TT' || kel8176058 === 'AA') {
      kelPheno = "K-k+";
      kelAntigens = "K- k+";
    }

    extended["Kell"] = {
      system: "Kell",
      gene: "KEL",
      phenotype: kelPheno,
      genotype: kel8176058,
      antigens: kelAntigens,
      confidence: "High",
      description: "Type II transmembrane glycoprotein; KEL1 (K) is highly immunogenic in transfusion medicine.",
      clinicalSignificance: "KEL1 (K) is second only to RhD in clinical immunogenicity. Maternal anti-K causes severe fetal anemia and HDFN by suppressing erythroid progenitor proliferation.",
      markers: [{ snp: "rs8176058", genotype: kel8176058, effect: "p.Thr193Met (KEL1 K vs KEL2 k)" }]
    };
  }

  // 3. Kidd Blood Group System (SLC14A1 / JK)
  const jk1058396 = getGenotype(userSnps, 'rs1058396'); // c.838G>A: A = Jka, G = Jkb
  if (jk1058396) {
    let jkPheno = "Jk(a+b+)";
    let jkAntigens = "Jka+ Jkb+";
    if (jk1058396 === 'AA' || jk1058396 === 'TT') {
      jkPheno = "Jk(a+b-)";
      jkAntigens = "Jka+ Jkb-";
    } else if (jk1058396 === 'GG' || jk1058396 === 'CC') {
      jkPheno = "Jk(a-b+)";
      jkAntigens = "Jka- Jkb+";
    }

    extended["Kidd"] = {
      system: "Kidd",
      gene: "SLC14A1 (JK)",
      phenotype: jkPheno,
      genotype: jk1058396,
      antigens: jkAntigens,
      confidence: "High",
      description: "Erythrocyte urea transporter (UT-B); mediates rapid urea transport across RBC membranes.",
      clinicalSignificance: "Kidd antibodies (anti-Jka and anti-Jkb) are notorious for dropping below detectable titers over time and causing severe delayed hemolytic transfusion reactions (DHTR).",
      markers: [{ snp: "rs1058396", genotype: jk1058396, effect: "p.Asp280Asn (Jka vs Jkb polymorphism)" }]
    };
  }

  // 4. Secretor Status (FUT2)
  const se601338 = getGenotype(userSnps, 'rs601338'); // c.428G>A (se428 null)
  if (se601338) {
    const isNonSec = se601338 === 'AA' || se601338 === 'TT';
    extended["Secretor"] = {
      system: "Secretor",
      gene: "FUT2",
      phenotype: isNonSec ? "Non-secretor (se/se)" : "Secretor (Se/Se or Se/se)",
      genotype: se601338,
      antigens: isNonSec ? "Soluble ABH negative" : "Soluble ABH secreted",
      confidence: "High",
      description: "Alpha-(1,2)-fucosyltransferase governing the secretion of ABH blood group antigens into saliva, tears, and mucosal secretions.",
      clinicalSignificance: "Homozygous non-secretors (se/se) lack mucosal ABH histo-blood group antigens, conferring substantial resistance to common Norovirus GII.4 infections and altered gut microbiome composition.",
      markers: [{ snp: "rs601338", genotype: se601338, effect: "c.428G>A p.Trp143Ter (se428 null nonsense mutation)" }]
    };
  }

  // 5. Diego Blood Group System (SLC4A1 / AE1 / Band 3)
  const di2285644 = getGenotype(userSnps, 'rs2285644'); // c.2561C>T: T = Dia, C = Dib
  if (di2285644) {
    let diPheno = "Di(a-b+)";
    let diAntigens = "Dia- Dib+";
    if (di2285644 === 'TT' || di2285644 === 'AA') {
      diPheno = "Di(a+b-)";
      diAntigens = "Dia+ Dib-";
    } else if (['CT', 'TC', 'GA', 'AG'].includes(di2285644)) {
      diPheno = "Di(a+b+)";
      diAntigens = "Dia+ Dib+";
    }

    extended["Diego"] = {
      system: "Diego",
      gene: "SLC4A1 (AE1/Band 3)",
      phenotype: diPheno,
      genotype: di2285644,
      antigens: diAntigens,
      confidence: "High",
      description: "Anion exchanger 1 (Band 3) regulating erythrocyte chloride-bicarbonate exchange.",
      clinicalSignificance: "Dia is a classic anthropological marker present in Indigenous American (up to 36%) and East Asian populations, but extremely rare in European populations. Anti-Dia can cause severe HDFN.",
      markers: [{ snp: "rs2285644", genotype: di2285644, effect: "p.Pro854Leu (Dia vs Dib polymorphism)" }]
    };
  }

  // 6. MNS Blood Group System (GYPA / GYPB)
  const mns7683365 = getGenotype(userSnps, 'rs7683365'); // GYPA M/N: C = M, T = N
  const mns11273308 = getGenotype(userSnps, 'rs11273308'); // GYPB S/s: T = S, C = s
  if (mns7683365 || mns11273308) {
    let mnPart = "M/N Unknown";
    if (mns7683365 === 'CC' || mns7683365 === 'GG') mnPart = "M+N-";
    else if (mns7683365 === 'TT' || mns7683365 === 'AA') mnPart = "M-N+";
    else if (mns7683365) mnPart = "M+N+";

    let ssPart = "S/s Unknown";
    if (mns11273308 === 'TT' || mns11273308 === 'AA') ssPart = "S+s-";
    else if (mns11273308 === 'CC' || mns11273308 === 'GG') ssPart = "S-s+";
    else if (mns11273308) ssPart = "S+s+";

    const mnsPheno = `${mnPart} ${ssPart}`.trim();
    const markers: Array<{ snp: string; genotype: string; effect: string }> = [];
    if (mns7683365) markers.push({ snp: "rs7683365", genotype: mns7683365, effect: "GYPA Ser1Leu / Gly5Glu (M vs N)" });
    if (mns11273308) markers.push({ snp: "rs11273308", genotype: mns11273308, effect: "GYPB Met29Thr (S vs s)" });

    extended["MNS"] = {
      system: "MNS",
      gene: "GYPA / GYPB",
      phenotype: mnsPheno,
      genotype: `${mns7683365 || '--'} / ${mns11273308 || '--'}`,
      antigens: mnsPheno,
      confidence: (mns7683365 && mns11273308) ? "High" : "Moderate",
      description: "Major sialoglycoproteins of human erythrocytes (Glycophorin A and Glycophorin B).",
      clinicalSignificance: "Anti-S and anti-s are clinically significant IgG antibodies capable of causing acute and delayed hemolytic transfusion reactions as well as HDFN.",
      markers
    };
  }

  return extended;
}

/**
 * Main blood type calculator with backward-compatible API and expanded molecular profile.
 */
export function calculateBloodType(userSnps: Record<string, string> | undefined) {
  if (!userSnps || Object.keys(userSnps).length === 0) {
    const emptyRh: RhDetailedResult = {
      phenotype: "Unknown",
      rhD: "Unknown",
      rhConfidence: 0,
      confidence: 0,
      fisherRace: "D? C? c? E? e?",
      cAntigen: "Unknown",
      eAntigen: "Unknown",
      isRhdPsi: false,
      isHybridSuspected: false,
      results: []
    };
    const emptyAbo: ABODiplotypeResult = {
      diplotype: "Unknown",
      phenotype: "Unknown",
      subgroup: "Unknown",
      probability: 0,
      isBombay: false,
      isCisAB: false,
      markersCompared: 0,
      detectedAlleles: []
    };
    return {
      bloodType: "Unknown",
      confidence: "Low" as const,
      details: {
        abo: "Unknown",
        rh: "Unknown",
        rhConfidence: 0,
        rhPhenotype: "Unknown" as RhPrediction,
        rhResults: [],
        fisherRace: "D? C? c? E? e?",
        cAntigen: "Unknown",
        eAntigen: "Unknown",
        isRhdPsi: false,
        aboDiplotype: emptyAbo,
        extendedSystems: {} as Record<string, ExtendedBloodSystemResult>
      },
      aboDetails: emptyAbo,
      rhDetails: emptyRh,
      extendedSystems: {} as Record<string, ExtendedBloodSystemResult>
    };
  }

  // 1. Compute ABO Diplotype & Phenotype
  const aboResult = inferABODiplotype(userSnps);
  const phenotype = aboResult.phenotype;

  // 2. Compute Rh Factor via Multi-tag Ensemble
  const rhInference = inferRhFactor(userSnps);
  let rhFactor = "Unknown";
  if (rhInference.phenotype === "Positive") {
    rhFactor = "+";
  } else if (rhInference.phenotype === "Negative") {
    rhFactor = "-";
  }

  // 3. Compute Extended Blood Groups
  const extendedSystems = calculateExtendedBloodSystems(userSnps);

  // 4. Overall Confidence Tier
  const confidenceScore: "High" | "Moderate" | "Low" = 
    (phenotype !== "Unknown" && rhFactor !== "Unknown") 
      ? (rhInference.confidence >= 0.8 && aboResult.probability >= 0.8 ? "High" : "Moderate")
      : (phenotype !== "Unknown" ? "Moderate" : "Low");

  const fullBloodTypeStr = phenotype === "Unknown" 
    ? "Uncertain" 
    : `${phenotype}${rhFactor === "Unknown" ? "?" : rhFactor}`;

  const profile: BloodGroupProfile = {
    bloodType: fullBloodTypeStr,
    aboGroup: phenotype,
    rhFactor: rhInference.phenotype,
    aggregateConfidence: rhInference.confidence * (aboResult.probability || 0.8),
    confidence: confidenceScore,
    aboDetails: aboResult,
    rhDetails: rhInference,
    extendedSystems,
    markers: rhInference.results
  };

  return {
    bloodType: fullBloodTypeStr,
    confidence: confidenceScore,
    details: {
      abo: phenotype,
      rh: rhFactor,
      rhConfidence: rhInference.confidence,
      rhPhenotype: rhInference.phenotype,
      rhResults: rhInference.results,
      fisherRace: rhInference.fisherRace,
      cAntigen: rhInference.cAntigen,
      eAntigen: rhInference.eAntigen,
      isRhdPsi: rhInference.isRhdPsi,
      aboDiplotype: aboResult,
      extendedSystems
    },
    profile,
    aboDetails: aboResult,
    rhDetails: rhInference,
    extendedSystems
  };
}
