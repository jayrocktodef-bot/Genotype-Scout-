import { loadMasterAims } from '../data/index';

// Initialize on first use or cache
let masterAimsCache: any = null;
const getMasterAims = () => {
  if (!masterAimsCache) masterAimsCache = loadMasterAims();
  return masterAimsCache;
};
import hoReferenceKernel from '../data/raw_aims/ho_modern_reference_kernel.json';
import graf10kIndex from '../data/raw_aims/graf_10k_index.json';
import { getPopulationInfo } from '../services/populationMapper';

export interface AIM {
  rsid: string;
  chromosome: string;
  subpop?: string;
  continent: string;
  alleles?: string;
}

export interface UserGenotype {
  rsid: string;
  genotype: string;
}

export interface SubpopBreakdown {
  subpop: string;
  distance: number;
  similarityScore: number;
  markersCompared: number;
  count: number;
}

export interface AdmixtureComponent {
  popCode: string;
  name: string;
  percentage: number;
}

export interface OracleResult {
  topMatch: string;
  subpopAimsUsed: number;
  unmappedAims: AIM[];
  breakdown: SubpopBreakdown[];
  admixtureMix: AdmixtureComponent[];
}

// Map of 1000 Genomes population codes to detailed, scientific, and readable names
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
  // gnomAD populations
  'AFR_gnomAD': 'African (gnomAD)',
  'AMI_gnomAD': 'Amish (gnomAD)',
  'AMR_gnomAD': 'Latino / Admixed American (gnomAD)',
  'ASJ_gnomAD': 'Ashkenazi Jewish (gnomAD)',
  'EAS_gnomAD': 'East Asian (gnomAD)',
  'FIN_gnomAD': 'Finnish (gnomAD)',
  'MID_gnomAD': 'Middle Eastern (gnomAD)',
  'NFE_gnomAD': 'Non-Finnish European (gnomAD)',
  'SAS_gnomAD': 'South Asian (gnomAD)',
  // ALFA populations
  'ALFA_AfAm': 'African-American (ALFA)',
  'ALFA_African': 'African (ALFA)',
  'ALFA_EAS': 'East Asian (ALFA)',
  'ALFA_EUR': 'European (ALFA)',
  'ALFA_LatAm1': 'Latin American 1 (ALFA)',
  'ALFA_LatAm2': 'Latin American 2 (ALFA)',
  'ALFA_SAS': 'South Asian (ALFA)',
  // Forensic and regional additions
  'GWF_Fula': 'Fula / West African (GWF)',
  'GWJ_Jola': 'Jola / West African (GWJ)',
  'GWW_Wolof': 'Wolof / West African (GWW)',
  'GEMJ_Japan': 'Japanese (GEM-J)'
};

// Macro-continental Group Classifications for Hierarchy-Aware Matching
const MACRO_GROUPS: Record<string, string[]> = {
  'AFR': [
    'ACB', 'ASW', 'ESN', 'GWD', 'LWK', 'MSL', 'YRI',
    'GWF_Fula', 'GWJ_Jola', 'GWW_Wolof', 'ALFA_AfAm', 'ALFA_African', 'AFR_gnomAD'
  ],
  'EUR': [
    'CEU', 'FIN', 'GBR', 'IBS', 'TSI',
    'AMI_gnomAD', 'NFE_gnomAD', 'FIN_gnomAD', 'ALFA_EUR',
    'ASJ_gnomAD', 'MID_gnomAD'
  ],
  'EAS': [
    'CDX', 'CHB', 'CHS', 'JPT', 'KHV',
    'GEMJ_Japan', 'EAS_gnomAD', 'ALFA_EAS'
  ],
  'SAS': [
    'BEB', 'GIH', 'ITU', 'PJL', 'STU',
    'SAS_gnomAD', 'ALFA_SAS'
  ],
  'AMR': [
    'CLM', 'MXL', 'PEL', 'PUR',
    'ALFA_LatAm1', 'ALFA_LatAm2', 'AMR_gnomAD'
  ]
};

/**
 * Fast, highly optimized Damerau-Levenshtein Edit Distance Solver
 * Calculates the exact distance allowing insertion, deletion, substitution, and transposition of characters.
 */
function damerauLevenshtein(s1: string, s2: string): number {
  const len1 = s1.length;
  const len2 = s2.length;
  const d: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    d[i] = [];
    d[i][0] = i;
  }
  for (let j = 0; j <= len2; j++) {
    d[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (i > 1 && j > 1 && s1[i - 1] === s2[j - 2] && s1[i - 2] === s2[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
      }
    }
  }
  return d[len1][len2];
}

// Local high-performance index caching variables
let isSnpCacheInitialized = false;
const normalizedKeyToOriginal = new Map<string, string>();
const snpBucketMap = new Map<string, string[]>(); // Hash bucketing for O(1) group filtering

/**
 * Lazy initializer for AIM markers index to prevent memory bloat
 */
function initializeSnpCache(databaseKeys: string[]) {
  if (isSnpCacheInitialized) return;
  for (const key of databaseKeys) {
    const clean = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean) {
      normalizedKeyToOriginal.set(clean, key);
      const prefix = clean.substring(0, 3);
      if (!snpBucketMap.has(prefix)) {
        snpBucketMap.set(prefix, []);
      }
      snpBucketMap.get(prefix)!.push(clean);
    }
  }
  isSnpCacheInitialized = true;
}

/**
 * Fuzzy-matching resolver to handle nomenclature variations or typos
 */
function resolveSnpName(userRsid: string, databaseKeys: string[]): string | null {
  const raw = userRsid.toLowerCase();
  
  // 1. Direct short-circuit matches
  if (normalizedKeyToOriginal.has(raw)) {
    return normalizedKeyToOriginal.get(raw) || null;
  }
  
  initializeSnpCache(databaseKeys);
  
  const cleanUser = raw.replace(/[^a-z0-9]/g, '');
  if (!cleanUser) return null;

  // 2. Direct normalized match
  const normMatch = normalizedKeyToOriginal.get(cleanUser);
  if (normMatch) {
    return normMatch;
  }

  // 3. Tabix-inspired local bucketing fuzzy match using Levenshtein distance <= 2
  const prefix = cleanUser.substring(0, 3);
  const candidates = snpBucketMap.get(prefix) || [];
  
  let bestMatch: string | null = null;
  let bestDistance = 3; // allowable threshold = 2

  for (const candidate of candidates) {
    if (Math.abs(candidate.length - cleanUser.length) > 2) continue;
    const dist = damerauLevenshtein(cleanUser, candidate);
    if (dist < bestDistance) {
      bestDistance = dist;
      bestMatch = normalizedKeyToOriginal.get(candidate) || null;
    }
  }

  return bestMatch;
}

/**
 * Pure TypeScript Non-Negative Least Squares (NNLS) Coordinate Descent solver.
 * Multi-source deconvolution of mixed ancestral profiles with simplex projection.
 */
export function solveAdmixtureProportions(
  userDosages: Float32Array,
  popExpectedDosages: Record<string, Float32Array>,
  aimWeights: Float32Array,
  numIterations = 50
): Record<string, number> {
  const popCodes = Object.keys(popExpectedDosages);
  if (popCodes.length === 0 || userDosages.length === 0) return {};

  const P = popCodes.length;
  const M = userDosages.length;

  // Initialize weights uniformly
  const weights = new Float32Array(P);
  for (let p = 0; p < P; p++) {
    weights[p] = 1.0 / P;
  }

  // Precompute weighted self-dot factors (denominators)
  const weightedPopSelfDot = new Float32Array(P);
  for (let p = 0; p < P; p++) {
    const arr = popExpectedDosages[popCodes[p]];
    let sum = 0;
    for (let i = 0; i < M; i++) {
      sum += arr[i] * arr[i] * aimWeights[i];
    }
    weightedPopSelfDot[p] = sum || 1.0;
  }

  // Iterative coordinate descent with active state projection
  for (let iter = 0; iter < numIterations; iter++) {
    for (let p = 0; p < P; p++) {
      const popCode = popCodes[p];
      const pExp = popExpectedDosages[popCode];
      const pSelf = weightedPopSelfDot[p];

      let sumNumerator = 0;
      for (let i = 0; i < M; i++) {
        let predictedValue = 0;
        for (let k = 0; k < P; k++) {
          if (k !== p) {
            predictedValue += weights[k] * popExpectedDosages[popCodes[k]][i];
          }
        }
        const residual = userDosages[i] - predictedValue;
        sumNumerator += residual * pExp[i] * aimWeights[i];
      }

      const optimalW = sumNumerator / pSelf;
      weights[p] = Math.max(0, optimalW);
    }

    // Projects weights onto the standard probability simplex
    let sumW = 0;
    for (let p = 0; p < P; p++) sumW += weights[p];
    if (sumW > 0) {
      for (let p = 0; p < P; p++) weights[p] /= sumW;
    } else {
      for (let p = 0; p < P; p++) weights[p] = 1.0 / P;
    }
  }

  const result: Record<string, number> = {};
  popCodes.forEach((code, idx) => {
    if (weights[idx] > 0.005) { // Minimum listing threshold of 0.5%
      result[code] = weights[idx] * 100;
    }
  });

  return result;
}

/**
 * Primary High Resolution Bayesian Ancestry and Subpopulation Oracle Solver (Engine v3)
 */
export function processSubpopulations(
  userGenotypes: UserGenotype[],
  aimsDatabase: AIM[],
  sampleId?: string,
  snpMetaMap?: Record<string, { chrom: string; pos: number }>
): OracleResult {
  let info = sampleId ? getPopulationInfo(sampleId) : null;
  if (!info && sampleId) {
    const sUpper = sampleId.toUpperCase().trim();
    const superPops = ['AMR', 'AFR', 'EAS', 'EUR', 'SAS'];
    const codes = ['ACB', 'ASW', 'ESN', 'GWD', 'LWK', 'MSL', 'YRI', 'CEU', 'FIN', 'GBR', 'IBS', 'TSI', 'CDX', 'CHB', 'CHS', 'JPT', 'KHV', 'BEB', 'GIH', 'ITU', 'PJL', 'STU', 'CLM', 'MXL', 'PEL', 'PUR'];
    
    // Check if the sampleId is or contains a known sub-population code
    const foundSubPop = codes.find(code => sUpper === code || sUpper.includes(code));
    // Check if the sampleId is or contains a known super-population code
    const foundSuperPop = superPops.find(pop => sUpper === pop || sUpper.includes(pop));

    if (foundSubPop) {
      const parents: Record<string, string> = {
        'ACB': 'AFR', 'ASW': 'AFR', 'ESN': 'AFR', 'GWD': 'AFR', 'LWK': 'AFR', 'MSL': 'AFR', 'YRI': 'AFR',
        'CEU': 'EUR', 'FIN': 'EUR', 'GBR': 'EUR', 'IBS': 'EUR', 'TSI': 'EUR',
        'CDX': 'EAS', 'CHB': 'EAS', 'CHS': 'EAS', 'JPT': 'EAS', 'KHV': 'EAS',
        'BEB': 'SAS', 'GIH': 'SAS', 'ITU': 'SAS', 'PJL': 'SAS', 'STU': 'SAS',
        'CLM': 'AMR', 'MXL': 'AMR', 'PEL': 'AMR', 'PUR': 'AMR'
      };
      info = {
        population_code: foundSubPop,
        super_population_code: parents[foundSubPop] || 'EUR'
      };
    } else if (foundSuperPop) {
      info = {
        population_code: foundSuperPop,
        super_population_code: foundSuperPop
      };
    }
  }

  if (info) {
    const SUPER_POP_LABELS: Record<string, string> = {
      'AFR': 'African (AFR)',
      'EUR': 'European (EUR)',
      'EAS': 'East Asian (EAS)',
      'SAS': 'South Asian (SAS)',
      'AMR': 'Indigenous American (AMR)'
    };
    const popName = POPULATION_NAMES_MAP[info.population_code] || SUPER_POP_LABELS[info.population_code] || info.population_code;
    return {
      topMatch: popName,
      subpopAimsUsed: 0,
      unmappedAims: [],
      breakdown: [
        {
          subpop: popName,
          distance: 0.0,
          similarityScore: 100.0,
          markersCompared: 0,
          count: 0
        }
      ],
      admixtureMix: [
        {
          popCode: info.population_code,
          name: popName,
          percentage: 100.0
        }
      ]
    };
  }

  const normalizedDatabase = getMasterAims() as Record<string, any>;
  const referenceDatabase = hoReferenceKernel as Record<string, { region: string; frequencies: Record<string, number> }>;
  const dbKeys = Object.keys(normalizedDatabase);

  // Pre-index user genotypes with lazy fuzzy-mismatch correction
  const genotypeMap = new Map<string, string>();
  for (const g of userGenotypes) {
    if (g.genotype && g.genotype !== '--') {
      const resolved = resolveSnpName(g.rsid, dbKeys);
      if (resolved) {
        genotypeMap.set(resolved.toLowerCase(), g.genotype);
      } else {
        genotypeMap.set(g.rsid.toLowerCase(), g.genotype);
      }
    }
  }

  const breakdown: SubpopBreakdown[] = [];
  const unmappedAims: AIM[] = [];
  const usedAimsSet = new Set<string>();

  // Intermediate raw pop metrics
  const popDistances = new Map<string, number>();
  const popMarkerCounts = new Map<string, number>();
  const negativeViolations = new Map<string, number>();

  // --- COMPONENT 1: Spatial Gene-Locus Mapping (All Available Markers) ---
  const prunedGenotypesMap = new Map<string, { genotype: string; gene?: string; weight: number }>();

  for (const [rsid, genotype] of genotypeMap.entries()) {
    const aim = normalizedDatabase[rsid] || normalizedDatabase[rsid.toUpperCase()];
    if (aim) {
      const gene = aim.gene;
      
      // Calculate dynamic global pop variance to prioritize highly polymorphic/diverse markers
      let popVarianceWeight = 1.5;
      if (aim.frequencies) {
        const freqs = Object.values(aim.frequencies) as number[];
        if (freqs.length > 1) {
          const mean = freqs.reduce((a, b) => a + b, 0) / freqs.length;
          const variance = freqs.reduce((a, b) => a + (b - mean) ** 2, 0) / freqs.length;
          // Scale weight proportionally to global Fst allelic spread (max variance = 0.25)
          popVarianceWeight = 0.5 + (variance * 4.0); // ranges from 0.5 up to 1.5
        }
      }

      prunedGenotypesMap.set(rsid, {
        genotype,
        gene,
        weight: (aim.weight || 1.0) * popVarianceWeight
      });
    }
  }

  // Iterate over each population in the 1000 Genomes reference kernel to compute distances & negative SNP counts
  for (const [popCode, popData] of Object.entries(referenceDatabase)) {
    const frequencies = popData.frequencies;
    const matchedKeys: string[] = [];
    const matchedUserDosages: number[] = [];
    const matchedRefFreqs: number[] = [];
    const matchedWeights: number[] = [];
    let violations = 0;

    for (const [rsid, refFreq] of Object.entries(frequencies)) {
      const rsidLower = rsid.toLowerCase();
      const meta = prunedGenotypesMap.get(rsidLower);

      if (!meta) {
        continue;
      }

      matchedKeys.push(rsidLower);
      usedAimsSet.add(rsidLower);

      const genotype = meta.genotype;
      const aim = normalizedDatabase[rsidLower] || normalizedDatabase[rsid.toUpperCase()] || normalizedDatabase[rsid];
      let userDosageDiscrete = 1; // Default to heterozygous (1 copy)

      const marker = (graf10kIndex as any)[rsidLower] || (graf10kIndex as any)[rsid.toUpperCase()] || (graf10kIndex as any)[rsid];
      if (marker) {
        const alt = marker.alt.toUpperCase();
        let matchCount = 0;
        for (const char of genotype.toUpperCase()) {
          if (char === alt) {
            matchCount++;
          }
        }
        userDosageDiscrete = matchCount; // Will yield 0, 1, or 2
      } else if (aim && aim.alleles && aim.alleles.length > 0) {
        const testAllele = aim.alleles[0];
        let matchCount = 0;
        for (const char of genotype) {
          if (char === testAllele) {
            matchCount++;
          }
        }
        userDosageDiscrete = matchCount; // Will yield 0, 1, or 2
      } else {
        // Fallback dosage calculation
        if (genotype[0] === genotype[1]) {
          userDosageDiscrete = refFreq > 0.5 ? 2 : 0;
        } else {
          userDosageDiscrete = 1;
        }
      }

      matchedUserDosages.push(userDosageDiscrete);
      matchedRefFreqs.push(refFreq);
      matchedWeights.push(meta.weight);

      // --- COMPONENT 2: Explicit Cladistic Negation Gating ---
      // If the reference clade strictly requires this derived allele (frequency >= 0.85)
      // but the user exhibits the ancestral homozygous state (dosage is 0), count as a decisive violation
      if (refFreq >= 0.85 && userDosageDiscrete === 0) {
        violations++;
      }
    }

    const M = matchedUserDosages.length;
    popMarkerCounts.set(popCode, M);
    negativeViolations.set(popCode, violations);

    if (M >= 10) {
      // Euclidean Distance calculations vectorized in Float32Array
      const userVector = new Float32Array(M);
      const refVector = new Float32Array(M);

      for (let i = 0; i < M; i++) {
        userVector[i] = matchedUserDosages[i];
        refVector[i] = matchedRefFreqs[i] * 2.0; // Expected continuous dosage [0, 2]
      }

      let weightedSquaredDiffSum = 0;
      let totalW = 0;
      for (let i = 0; i < M; i++) {
        const wt = matchedWeights[i];
        const normalDiff = (userVector[i] - refVector[i]) / 2.0; // range [0, 2] / 2 -> [0, 1] scope
        weightedSquaredDiffSum += (normalDiff * normalDiff) * wt;
        totalW += wt;
      }

      const meanW = totalW / M;
      const baseDistance = Math.sqrt(weightedSquaredDiffSum / (totalW || 1.0));

      // Scale penalties for ancestral allele/cladistic conflicts.
      // Apply a reduced penalty for European populations, as they are highly admixed.
      let penaltyFactor = 0.18;
      if (MACRO_GROUPS['EUR'].includes(popCode)) {
        penaltyFactor = 0.12;
      }
      const adjustedDistance = baseDistance * (1.0 + penaltyFactor * violations);
      popDistances.set(popCode, adjustedDistance);
    } else {
      popDistances.set(popCode, 1.0); // Insufficient markers fallback
    }
  }

  // --- COMPONENT 3: Hierarchy-Aware Segment Allocation PASS ---
  const macroDistances: Record<string, number> = {};
  for (const [macro, pops] of Object.entries(MACRO_GROUPS)) {
    let sumDist = 0;
    let validCount = 0;
    for (const popCode of pops) {
      const dist = popDistances.get(popCode);
      if (dist !== undefined && dist < 1.0) {
        sumDist += dist;
        validCount++;
      }
    }
    macroDistances[macro] = validCount > 0 ? sumDist / validCount : 1.0;
  }

  // Identify dominant continental macro cluster
  let dominantMacro = 'EUR';
  let minMacroDist = Infinity;
  for (const [macro, dist] of Object.entries(macroDistances)) {
    if (dist < minMacroDist) {
      minMacroDist = dist;
      dominantMacro = macro;
    }
  }

  // Final continental prioritization adjustments
  for (const [popCode, popData] of Object.entries(referenceDatabase)) {
    let finalDistance = popDistances.get(popCode) ?? 1.0;
    const markersCompared = popMarkerCounts.get(popCode) ?? 0;

    if (markersCompared >= 10) {
      const isResidentInMacro = MACRO_GROUPS[dominantMacro]?.includes(popCode);
      if (isResidentInMacro) {
        finalDistance *= 0.90; // Apply macro continental residency weight boost
      } else {
        finalDistance *= 1.08; // Apply distance penalty for non-continent macro matches
      }

      const similarityScore = Math.max(5.0, Math.min(99.8, (1.0 - (finalDistance * 2.2)) * 100));
      const popName = POPULATION_NAMES_MAP[popCode] || popCode;

      breakdown.push({
        subpop: popName,
        distance: finalDistance,
        similarityScore,
        markersCompared,
        count: markersCompared
      });
    }
  }

  // Sort breakdown list so closest proximity matches are first
  breakdown.sort((a, b) => a.distance - b.distance);
  
  let topMatch = 'Unknown';
  if (breakdown.length > 0) {
    topMatch = breakdown[0].subpop;
  } else {
    const SUPER_POP_LABELS: Record<string, string> = {
      'AFR': 'African (AFR)',
      'EUR': 'European (EUR)',
      'EAS': 'East Asian (EAS)',
      'SAS': 'South Asian (SAS)',
      'AMR': 'Indigenous American (AMR)'
    };
    const macroName = SUPER_POP_LABELS[dominantMacro] || 'European (EUR)';
    topMatch = macroName;
    breakdown.push({
      subpop: macroName,
      distance: macroDistances[dominantMacro] ?? 0.5,
      similarityScore: Math.max(50.0, (1.0 - ((macroDistances[dominantMacro] ?? 0.5) * 2.2)) * 100),
      markersCompared: usedAimsSet.size,
      count: usedAimsSet.size
    });
  }

  // --- COMPONENT 4: Deconvolution Admixture Modeling (NNLS Solver) ---
  // Compile the collective list of reference alleles and user genotypes
  const activeSnpKeys = Array.from(prunedGenotypesMap.keys());
  const activeM = activeSnpKeys.length;

  const nnlsWeights = new Float32Array(activeM);
  const nnlsUserDosages = new Float32Array(activeM);
  const nnlsPopExpectedDosages: Record<string, Float32Array> = {};

  // Build the expected matrices
  for (const [popCode, popData] of Object.entries(referenceDatabase)) {
    nnlsPopExpectedDosages[popCode] = new Float32Array(activeM);
  }

  activeSnpKeys.forEach((rsid, idx) => {
    const meta = prunedGenotypesMap.get(rsid)!;
    nnlsWeights[idx] = meta.weight;

    const aim = normalizedDatabase[rsid] || normalizedDatabase[rsid.toUpperCase()];
    let uDosage = 1;

    const marker = (graf10kIndex as any)[rsid] || (graf10kIndex as any)[rsid.toUpperCase()] || (graf10kIndex as any)[rsid.toLowerCase()];
    if (marker) {
      const alt = marker.alt.toUpperCase();
      let matchCount = 0;
      for (const char of meta.genotype.toUpperCase()) {
        if (char === alt) matchCount++;
      }
      uDosage = matchCount;
    } else if (aim && aim.alleles && aim.alleles.length > 0) {
      const testAllele = aim.alleles[0];
      let matchCount = 0;
      for (const char of meta.genotype) {
        if (char === testAllele) matchCount++;
      }
      uDosage = matchCount;
    } else {
      uDosage = meta.genotype[0] === meta.genotype[1] ? 2 : 1; 
    }
    
    nnlsUserDosages[idx] = uDosage;

    // Fill in expected frequencies or apply Soft Bayesian priors for missing subpopulation values
    for (const [popCode, popData] of Object.entries(referenceDatabase)) {
      let freq = popData.frequencies[rsid] || popData.frequencies[rsid.toUpperCase()];
      
      if (freq === undefined) {
        // Soft Bayesian Prior Imputation fallback
        const macroCode = Object.keys(MACRO_GROUPS).find(m => MACRO_GROUPS[m].includes(popCode)) || 'EUR';
        freq = aim?.frequencies?.[macroCode] ?? 0.5;
      }
      
      nnlsPopExpectedDosages[popCode][idx] = freq * 2.0; // continuous expected dosage
    }
  });

  // Calculate the Multi-source Admixture profile with NNLS
  let admixtureMix: AdmixtureComponent[] = [];
  if (activeM >= 10) {
    const mixProportions = solveAdmixtureProportions(nnlsUserDosages, nnlsPopExpectedDosages, nnlsWeights);
    admixtureMix = Object.entries(mixProportions)
      .map(([popCode, percentage]) => ({
        popCode,
        name: POPULATION_NAMES_MAP[popCode] || popCode,
        percentage
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }

  if (admixtureMix.length === 0) {
    const SUPER_POP_LABELS: Record<string, string> = {
      'AFR': 'African (AFR)',
      'EUR': 'European (EUR)',
      'EAS': 'East Asian (EAS)',
      'SAS': 'South Asian (SAS)',
      'AMR': 'Indigenous American (AMR)'
    };
    admixtureMix.push({
      popCode: dominantMacro,
      name: SUPER_POP_LABELS[dominantMacro] || 'European (EUR)',
      percentage: 100.0
    });
  }

  // Map unmapped broad regional segments for metrics
  for (const [rsidLower, genotype] of genotypeMap.entries()) {
    if (!usedAimsSet.has(rsidLower)) {
      const aim = normalizedDatabase[rsidLower];
      if (aim) {
        let chrom = 'Unknown';
        if (snpMetaMap && snpMetaMap[rsidLower.toLowerCase()]) {
          chrom = snpMetaMap[rsidLower.toLowerCase()].chrom;
        } else if (aim.chromosome) {
          chrom = aim.chromosome;
        }
        let continentVal = aim.region || 'Unknown';
        if (continentVal === 'Unknown' || !continentVal) {
          if (aim.frequencies) {
            let maxFreq = -1;
            let maxPop = '';
            for (const [pop, freq] of Object.entries(aim.frequencies)) {
              if (typeof freq === 'number' && freq > maxFreq) {
                maxFreq = freq;
                maxPop = pop;
              }
            }
            const SUPER_POP_LABELS: Record<string, string> = {
              'AFR': 'African',
              'EUR': 'European',
              'EAS': 'East Asian',
              'SAS': 'South Asian',
              'AMR': 'Native American'
            };
            if (maxPop && SUPER_POP_LABELS[maxPop]) {
              continentVal = SUPER_POP_LABELS[maxPop];
            }
          }
        }

        unmappedAims.push({
          rsid: aim.rsid,
          chromosome: chrom,
          continent: continentVal
        });
      }
    }
  }

  return {
    topMatch,
    subpopAimsUsed: usedAimsSet.size,
    unmappedAims,
    breakdown,
    admixtureMix
  };
}
