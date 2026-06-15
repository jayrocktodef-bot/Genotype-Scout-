import fs from 'fs';
import { parseDNAFile } from '../utils/dnaParser';
import hoReferenceKernel from '../data/raw_aims/ho_modern_reference_kernel.json';

function alignGenotype(genotype: string, targetAlleles: string[]): string {
  const upperGeno = genotype.toUpperCase();
  if (upperGeno === '--' || upperGeno.length === 0) return upperGeno;

  const hasDirectMatch = upperGeno.split('').some(char => targetAlleles.includes(char));
  if (hasDirectMatch) {
    return upperGeno;
  }

  const complementMap: Record<string, string> = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
  const complementGeno = upperGeno.split('').map(b => complementMap[b] || b).join('');
  const hasCompMatch = complementGeno.split('').some(char => targetAlleles.includes(char));
  if (hasCompMatch) {
    return complementGeno;
  }

  return upperGeno;
}

function projectToSimplex(v: Float32Array): Float32Array {
  const n = v.length;
  const sorted = new Float32Array(v).sort((a, b) => b - a);
  let runningSum = 0;
  let rho = 0;
  for (let i = 0; i < n; i++) {
    runningSum += sorted[i];
    if (sorted[i] + (1 - runningSum) / (i + 1) > 0) {
      rho = i;
    }
  }
  const theta = (1 - sorted.slice(0, rho + 1).reduce((a, b) => a + b, 0)) / (rho + 1);
  const projected = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    projected[i] = Math.max(0, v[i] + theta);
  }
  return projected;
}

function solveAdmixtureProportionsCoordinateDescent(
  userDosages: Float32Array,
  popExpectedDosages: Record<string, Float32Array>,
  aimWeights: Float32Array,
  numIterations = 200
): { result: Record<string, number>; iterations: number } {
  const popCodes = Object.keys(popExpectedDosages);
  if (popCodes.length === 0 || userDosages.length === 0) return { result: {}, iterations: 0 };

  const P = popCodes.length;
  const M = userDosages.length;

  let weights = new Float32Array(P);
  for (let p = 0; p < P; p++) {
    weights[p] = 1.0 / P;
  }

  const a = new Float32Array(P);
  for (let p = 0; p < P; p++) {
    const x_p = popExpectedDosages[popCodes[p]];
    let sumVal = 0;
    for (let i = 0; i < M; i++) {
      sumVal += x_p[i] * x_p[i] * aimWeights[i];
    }
    a[p] = sumVal || 1.0;
  }

  let iter = 0;
  for (; iter < numIterations; iter++) {
    let maxDelta = 0;
    
    const predicted = new Float32Array(M);
    for (let i = 0; i < M; i++) {
      for (let p = 0; p < P; p++) {
        predicted[i] += weights[p] * popExpectedDosages[popCodes[p]][i];
      }
    }

    const nextWeights = new Float32Array(weights);

    for (let p = 0; p < P; p++) {
      let G_p = 0;
      const x_p = popExpectedDosages[popCodes[p]];
      
      for (let i = 0; i < M; i++) {
        const diff = userDosages[i] - predicted[i];
        G_p -= diff * x_p[i] * aimWeights[i];
      }
      
      const oldWeight = weights[p];
      const newWeight = Math.max(0, oldWeight - G_p / a[p]);
      nextWeights[p] = newWeight;
      
      const delta = newWeight - oldWeight;
      if (delta !== 0) {
        for (let i = 0; i < M; i++) {
          predicted[i] += delta * x_p[i];
        }
      }
    }

    const projected = projectToSimplex(nextWeights);
    for (let p = 0; p < P; p++) {
      maxDelta = Math.max(maxDelta, Math.abs(projected[p] - weights[p]));
    }
    weights = projected;

    if (maxDelta < 0.0001) {
      break;
    }
  }

  const result: Record<string, number> = {};
  popCodes.forEach((code, idx) => {
    if (weights[idx] > 0.005) {
      result[code] = weights[idx] * 100;
    }
  });

  return { result, iterations: iter };
}

const masterAims = JSON.parse(fs.readFileSync('/home/jequan/Desktop/Antigrav/WITG-Genotype-Scout/src/data/master_aims_normalized.json', 'utf-8'));
const graf10kIndex = JSON.parse(fs.readFileSync('/home/jequan/Desktop/Antigrav/WITG-Genotype-Scout/src/data/raw_aims/graf_10k_index.json', 'utf-8'));

const POPULATION_NAMES_MAP: Record<string, string> = {
  'CEU': 'Central European (CEU)',
  'GBR': 'British Isles (GBR)',
  'FIN': 'Uralic & North-East European (FIN)',
  'TSI': 'Central Mediterranean / Tuscan (TSI)',
  'IBS': 'Iberian Peninsula (IBS)',
  'YRI': 'Yoruba / West African (YRI)',
  'ESN': 'Esan / West African (ESN)',
  'GWD': 'Gambian / West African (GWD)',
  'MSL': 'Mende / Sierra Leonean (MSL)',
  'LWK': 'Luhya / East African (LWK)',
  'BEB': 'Bengali / South Asian (BEB)',
  'GIH': 'Gujarati / South Asian (GIH)',
  'PJL': 'Punjabi / South Asian (PJL)',
  'ITU': 'Telugu / South Asian (ITU)',
  'STU': 'Tamil / South Asian (STU)',
  'CHB': 'Han Chinese / Beijing (CHB)',
  'CHS': 'Southern Han Chinese (CHS)',
  'JPT': 'Japanese / Yamato (JPT)',
  'KHV': 'Kinh Vietnamese / SE Asian (KHV)',
  'CDX': 'Chinese Dai / SE Asian (CDX)',
  'MXL': 'Mexican / Indigenous-Admixed (MXL)',
  'PUR': 'Puerto Rican / Indigenous-Admixed (PUR)',
  'CLM': 'Colombian / Indigenous-Admixed (CLM)',
  'PEL': 'Peruvian / Indigenous American (PEL)',
  'ASW': 'African-American / SW US (ASW)',
  'ACB': 'African Caribbean / Barbados (ACB)',
  'AFR_gnomAD': 'African (gnomAD)',
  'AMI_gnomAD': 'Amish (gnomAD)',
  'AMR_gnomAD': 'Latino / Admixed American (gnomAD)',
  'ASJ_gnomAD': 'Ashkenazi Jewish (gnomAD)',
  'EAS_gnomAD': 'East Asian (gnomAD)',
  'FIN_gnomAD': 'Finnish (gnomAD)',
  'MID_gnomAD': 'Middle Eastern (gnomAD)',
  'NFE_gnomAD': 'Non-Finnish European (gnomAD)',
  'SAS_gnomAD': 'South Asian (gnomAD)',
  'ALFA_AfAm': 'African-American (ALFA)',
  'ALFA_African': 'African (ALFA)',
  'ALFA_EAS': 'East Asian (ALFA)',
  'ALFA_EUR': 'European (ALFA)',
  'ALFA_LatAm1': 'Latin American 1 (ALFA)',
  'ALFA_LatAm2': 'Latin American 2 (ALFA)',
  'ALFA_SAS': 'South Asian (ALFA)',
  'GWF_Fula': 'Fula / West African (GWF)',
  'GWJ_Jola': 'Jola / West African (GWJ)',
  'GWW_Wolof': 'Wolof / West African (GWW)',
  'GEMJ_Japan': 'Japanese (GEM-J)'
};

const MACRO_GROUPS: Record<string, string[]> = {
  'AFR': ['ACB', 'ASW', 'ESN', 'GWD', 'LWK', 'MSL', 'YRI', 'GWF_Fula', 'GWJ_Jola', 'GWW_Wolof', 'ALFA_AfAm', 'ALFA_African', 'AFR_gnomAD'],
  'EUR': ['CEU', 'FIN', 'GBR', 'IBS', 'TSI', 'AMI_gnomAD', 'NFE_gnomAD', 'FIN_gnomAD', 'ALFA_EUR', 'ASJ_gnomAD'],
  'EAS': ['CDX', 'CHB', 'CHS', 'JPT', 'KHV', 'GEMJ_Japan', 'EAS_gnomAD', 'ALFA_EAS'],
  'SAS': ['BEB', 'GIH', 'ITU', 'PJL', 'STU', 'SAS_gnomAD', 'ALFA_SAS'],
  'AMR': ['CLM', 'MXL', 'PEL', 'PUR', 'ALFA_LatAm1', 'ALFA_LatAm2', 'AMR_gnomAD'],
  'MENA': ['MID_gnomAD']
};

function main() {
  const samplePath = '/home/jequan/Desktop/Jequan.txt';
  const content = fs.readFileSync(samplePath, 'utf-8');
  const userGenotypesMap = parseDNAFile(content);

  const genotypeMap = new Map<string, string>();
  for (const [rsid, genotype] of Object.entries(userGenotypesMap)) {
    if (genotype && genotype !== '--') {
      const base = rsid.split('_')[0].toLowerCase();
      genotypeMap.set(base, genotype);
    }
  }

  const prunedGenotypesMap = new Map<string, { genotype: string; weight: number }>();
  for (const [rsid, genotype] of genotypeMap.entries()) {
    const aim = masterAims[rsid] || masterAims[rsid.toUpperCase()];
    if (aim) {
      prunedGenotypesMap.set(rsid, { genotype, weight: aim.weight || 1.0 });
    }
  }

  const usedAimsSet = new Set<string>();
  const referenceDatabase = hoReferenceKernel as Record<string, { region: string; frequencies: Record<string, number> }>;

  for (const [popCode, popData] of Object.entries(referenceDatabase)) {
    for (const rsid of Object.keys(popData.frequencies)) {
      const rsidLower = rsid.toLowerCase();
      if (prunedGenotypesMap.has(rsidLower)) {
        usedAimsSet.add(rsidLower);
      }
    }
  }

  const activeM = usedAimsSet.size;
  const nnlsWeights = new Float32Array(activeM);
  const nnlsUserDosages = new Float32Array(activeM);
  const nnlsPopExpectedDosages: Record<string, Float32Array> = {};

  const popCodes = Object.keys(referenceDatabase);
  const P = popCodes.length;

  for (const popCode of popCodes) {
    nnlsPopExpectedDosages[popCode] = new Float32Array(activeM);
  }

  const targetAllelesMap = new Map<string, string[]>();
  Array.from(usedAimsSet).forEach(rsid => {
    const aim = masterAims[rsid] || masterAims[rsid.toUpperCase()];
    const marker = (graf10kIndex as any)[rsid] || (graf10kIndex as any)[rsid.toUpperCase()] || (graf10kIndex as any)[rsid.toLowerCase()];
    if (marker) {
      targetAllelesMap.set(rsid, [marker.ref.toUpperCase(), marker.alt.toUpperCase()]);
    } else if (aim && aim.alleles) {
      targetAllelesMap.set(rsid, aim.alleles.map((a: string) => a.toUpperCase()));
    }
  });

  const popDistances = new Map<string, number>();
  const popMarkerCounts = new Map<string, number>();
  const negativeViolations = new Map<string, number>();

  for (const [popCode, popData] of Object.entries(referenceDatabase)) {
    const frequencies = popData.frequencies;
    const matchedUserDosages: number[] = [];
    const matchedRefFreqs: number[] = [];
    const matchedWeights: number[] = [];
    let violations = 0;

    for (const [rsid, refFreq] of Object.entries(frequencies)) {
      const rsidLower = rsid.toLowerCase();
      const meta = prunedGenotypesMap.get(rsidLower);

      if (!meta) continue;

      const targetAlleles = targetAllelesMap.get(rsidLower) || [];
      const genotype = alignGenotype(meta.genotype, targetAlleles);

      let uDosage = 1;
      const aim = masterAims[rsidLower] || masterAims[rsidLower.toUpperCase()];
      const marker = (graf10kIndex as any)[rsidLower] || (graf10kIndex as any)[rsidLower.toUpperCase()];

      if (marker) {
        const alt = marker.alt.toUpperCase();
        let matchCount = 0;
        for (const char of genotype.toUpperCase()) {
          if (char === alt) matchCount++;
        }
        uDosage = matchCount;
      } else if (aim && aim.alleles && aim.alleles.length > 0) {
        const testAllele = aim.alleles[0].toUpperCase();
        let matchCount = 0;
        for (const char of genotype.toUpperCase()) {
          if (char === testAllele) matchCount++;
        }
        uDosage = matchCount;
      } else {
        uDosage = 1;
      }

      matchedUserDosages.push(uDosage);
      matchedRefFreqs.push(refFreq);
      matchedWeights.push(meta.weight);

      if (refFreq >= 0.85 && uDosage === 0) {
        violations++;
      }
    }

    const M_pop = matchedUserDosages.length;
    popMarkerCounts.set(popCode, M_pop);
    negativeViolations.set(popCode, violations);

    if (M_pop >= 5) {
      let weightedSquaredDiffSum = 0;
      let totalW = 0;
      for (let i = 0; i < M_pop; i++) {
        const wt = matchedWeights[i];
        const normalDiff = (matchedUserDosages[i] - matchedRefFreqs[i] * 2.0) / 2.0;
        weightedSquaredDiffSum += (normalDiff * normalDiff) * wt;
        totalW += wt;
      }

      const baseDistance = Math.sqrt(weightedSquaredDiffSum / (totalW || 1.0));
      // Normalize violations: scale penalty by violations relative to the number of SNPs compared,
      // assuming a baseline normalization of 100 markers.
      const penaltyFactor = 0.18;
      const normalizedViolations = violations / (M_pop / 100.0);
      const adjustedDistance = baseDistance * (1.0 + penaltyFactor * normalizedViolations);
      popDistances.set(popCode, adjustedDistance);
    } else {
      popDistances.set(popCode, 1.0);
    }
  }

  const rawBreakdown = popCodes.map(popCode => {
    const distance = popDistances.get(popCode) ?? 1.0;
    return {
      popCode,
      name: POPULATION_NAMES_MAP[popCode] || popCode,
      distance,
      violations: negativeViolations.get(popCode) ?? 0
    };
  }).sort((a, b) => a.distance - b.distance);

  const minDist = rawBreakdown.length > 0 ? rawBreakdown[0].distance : 0.0;
  const breakdown = rawBreakdown.map(item => {
    const uiDistance = 0.05 + (item.distance - minDist);
    const similarityScore = Math.max(5.0, Math.min(99.8, (1.0 - (uiDistance * 2.2)) * 100));
    return {
      ...item,
      similarityScore
    };
  });

  console.log('\n--- Proximity Fit (Normalized Penalty & Aligned Genotypes & Shift-and-Scale UI) ---');
  breakdown.slice(0, 10).forEach(item => {
    console.log(`  ${item.name}: d = ${item.distance.toFixed(4)}, similarity = ${item.similarityScore.toFixed(1)}%, violations = ${item.violations}`);
  });

  // --- Deconvolution Admixture Modeling (NNLS Solver) ---
  const activeSnpKeys = Array.from(usedAimsSet);
  activeSnpKeys.forEach((rsid, idx) => {
    const meta = prunedGenotypesMap.get(rsid)!;
    nnlsWeights[idx] = meta.weight || 1.0;

    const targetAlleles = targetAllelesMap.get(rsid) || [];
    const genotype = alignGenotype(meta.genotype, targetAlleles);

    const aim = masterAims[rsid] || masterAims[rsid.toUpperCase()];
    const marker = (graf10kIndex as any)[rsid] || (graf10kIndex as any)[rsid.toUpperCase()] || (graf10kIndex as any)[rsid.toLowerCase()];
    let uDosage = 1;

    if (marker) {
      const alt = marker.alt.toUpperCase();
      let matchCount = 0;
      for (const char of genotype.toUpperCase()) {
        if (char === alt) matchCount++;
      }
      uDosage = matchCount;
    } else if (aim && aim.alleles && aim.alleles.length > 0) {
      const testAllele = aim.alleles[0].toUpperCase();
      let matchCount = 0;
      for (const char of genotype.toUpperCase()) {
        if (char === testAllele) matchCount++;
      }
      uDosage = matchCount;
    } else {
      uDosage = 1;
    }

    nnlsUserDosages[idx] = uDosage;

    for (const [popCode, popData] of Object.entries(referenceDatabase)) {
      let freq = popData.frequencies[rsid] || popData.frequencies[rsid.toUpperCase()];
      if (freq === undefined) {
        const macroCode = Object.keys(MACRO_GROUPS).find(m => MACRO_GROUPS[m].includes(popCode)) ?? null;
        freq = macroCode ? (aim?.frequencies?.[macroCode] ?? 0.5) : 0.5;
      }
      nnlsPopExpectedDosages[popCode][idx] = freq * 2.0;
    }
  });

  console.log(`\nRunning NNLS Coordinate Descent on ${activeM} active SNPs...`);
  const { result: admixtureMix, iterations } = solveAdmixtureProportionsCoordinateDescent(
    nnlsUserDosages,
    nnlsPopExpectedDosages,
    nnlsWeights
  );

  console.log(`\n--- Multi-Source Admixture (NNLS Coordinate Descent) [Converged in ${iterations} iterations] ---`);
  Object.entries(admixtureMix)
    .sort((a, b) => b[1] - a[1])
    .forEach(([popCode, percentage]) => {
      const name = POPULATION_NAMES_MAP[popCode] || popCode;
      console.log(`  ${name}: ${percentage.toFixed(1)}%`);
    });
}

main();

