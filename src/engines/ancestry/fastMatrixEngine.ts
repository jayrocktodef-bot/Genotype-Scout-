import { get, set } from 'idb-keyval';
import graf10kIndex from '../../data/raw_aims/graf_10k_index.json';
import { fetchJsonAsset } from '../../utils/fetchHelper';

export interface PopulationProximity {
  population: string;
  region: string;
  distance: number;
  similarityScore: number;
  markersCompared: number;
}

// --------------------------------------------------------
// THE BINARY KERNEL (Cached in RAM)
// --------------------------------------------------------
let isCompiled = false;
let compilationPromise: Promise<void> | null = null;
let globalRsIDs: string[] = [];
let popNames: string[] = [];
let popRegions: string[] = [];
let popFrequencies: Float32Array[] = []; // Array of binary arrays
let rsidToIndexMap: Map<string, number> = new Map();

const CACHE_KEY = 'genotype_scout_matrix_cache_v5_51pop';

export function compileReferenceKernel(): Promise<void> {
  if (isCompiled) return Promise.resolve();
  if (compilationPromise) return compilationPromise;

  compilationPromise = (async () => {
    let cachedData = null;

    // 1. SAFELY CHECK CACHE (Ignores iframe security blocks, wrapped in timeout to prevent indefinite stalls)
    try {
      console.log("🔍 Checking IndexedDB for cached binary kernel...");
      const getWithTimeout = (key: string, timeoutMs = 500) => {
        return Promise.race([
          get(key),
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error("IndexedDB get timeout")), timeoutMs))
        ]);
      };
      cachedData = await getWithTimeout(CACHE_KEY);
    } catch (e) {
      console.warn("⚠️ IndexedDB access blocked or timed out. Skipping cache read.", e);
    }

    if (cachedData) {
      globalRsIDs = cachedData.globalRsIDs;
      popNames = cachedData.popNames;
      popRegions = cachedData.popRegions;
      popFrequencies = cachedData.popFrequencies.map((f: any[]) => new Float32Array(f));
      rsidToIndexMap = new Map(globalRsIDs.map((rsid, index) => [rsid, index]));
      isCompiled = true;
      console.log(`⚡ BOOTSTRAP FAST: Loaded ${popNames.length} populations from IndexedDB.`);
      return;
    }

    try {
      console.log("⚙️ Compiling JSON kernel into Float32 binary arrays...");
      const hoReferenceKernel = await fetchJsonAsset('/data/ho_modern_reference_kernel.json');

      // 1. Extract all unique markers across all populations
      const rsIDSet = new Set<string>();
      for (const popData of Object.values(hoReferenceKernel as any)) {
        const frequencies = (popData as any).frequencies;
        if (frequencies) {
          for (const rsid of Object.keys(frequencies)) {
            rsIDSet.add(rsid);
          }
        }
      }
      globalRsIDs = Array.from(rsIDSet);
      rsidToIndexMap = new Map(globalRsIDs.map((rsid, index) => [rsid, index]));
      const numMarkers = globalRsIDs.length;

      // 2. Build the contiguous binary arrays
      for (const [popCode, popDataRaw] of Object.entries(hoReferenceKernel as any)) {
        const popData = popDataRaw as any;
        popNames.push(popCode.replace(/_/g, ' '));
        popRegions.push(popData.region);

        // Create a fixed-size memory block for this population's frequencies
        const freqArray = new Float32Array(numMarkers);

        // Map frequencies exactly to the globalRsIDs index. Use -1 if missing.
        for (let i = 0; i < numMarkers; i++) {
          const rsid = globalRsIDs[i];
          freqArray[i] = (popData as any).frequencies?.[rsid] ?? -1.0; 
        }
        popFrequencies.push(freqArray);
      }

      // 3. SAFELY SAVE CACHE (Ignores iframe security blocks, wrapped in timeout to prevent indefinite stalls)
      try {
        const setWithTimeout = (key: string, val: any, timeoutMs = 500) => {
          return Promise.race([
            set(key, val),
            new Promise<void>((_, reject) => setTimeout(() => reject(new Error("IndexedDB set timeout")), timeoutMs))
          ]);
        };
        await setWithTimeout(CACHE_KEY, {
          globalRsIDs,
          popNames,
          popRegions,
          popFrequencies: popFrequencies.map(f => Array.from(f))
        });
        console.log(`✅ Cache Saved. Mapped ${popNames.length} populations.`);
      } catch (e) {
        console.warn("⚠️ IndexedDB save blocked or timed out. Running purely in RAM for this session.", e);
      }

      isCompiled = true;
    } catch (error) {
      console.error("Failed to compile kernel:", error);
    }
  })();

  return compilationPromise;
}

// --------------------------------------------------------
// HIGH-SPEED MATH ENGINE
// --------------------------------------------------------
export async function calculatePopulationProximityOptimized(userSnps: Map<string, string>): Promise<PopulationProximity[]> {
  // Ensure the kernel is compiled into memory
  if (!isCompiled) {
    await compileReferenceKernel();
  }

  const numPops = popNames.length;
  
  // Pre-process only user markers present in the reference
  const activeMarkers: { index: number, dosage: number }[] = [];
  
  const complement = (a: string) => {
    if (a === 'A') return 'T';
    if (a === 'T') return 'A';
    if (a === 'C') return 'G';
    if (a === 'G') return 'C';
    // Protect against indels (I/D) or other weird calls silently passing
    if (a === 'I' || a === 'D') return a; 
    return a;
  };

  for (const [rsid, call] of userSnps.entries()) {
    const index = rsidToIndexMap.get(rsid);
    if (index === undefined || call.length !== 2) continue;
    
    const marker = (graf10kIndex as any)[rsid] || (graf10kIndex as any)[rsid.toUpperCase()];
    if (!marker) continue;

    // Determine exact user dosage of the alternative allele
    let dosage = 0.0;
    let a1 = call[0].toUpperCase();
    let a2 = call[1].toUpperCase();
    const alt = marker.alt.toUpperCase();
    const ref = marker.ref ? marker.ref.toUpperCase() : '';

    // If neither allele matches ref or alt directly, but complements do, complement user call
    if ((a1 !== ref && a1 !== alt) || (a2 !== ref && a2 !== alt)) {
      const comp1 = complement(a1);
      const comp2 = complement(a2);
      if ((comp1 === ref || comp1 === alt) && (comp2 === ref || comp2 === alt)) {
        a1 = comp1;
        a2 = comp2;
      }
    }

    if (a1 === alt) dosage += 0.5;
    if (a2 === alt) dosage += 0.5;
    
    activeMarkers.push({ index, dosage });
  }

  const results: PopulationProximity[] = [];
  const EPSILON = 1e-6;
  const D_MAX = 3.5; // Constant to scale average negative log-likelihood to a 0-100% score

  // Loop through populations
  for (let p = 0; p < numPops; p++) {
    const refArray = popFrequencies[p];
    let sumLogP = 0.0;
    let validMarkers = 0;

    for (const { index, dosage } of activeMarkers) {
      const refFreq = refArray[index];

      // Skip if reference is missing this marker
      if (refFreq === -1.0) continue;

      // Hardy-Weinberg probability
      const safeP = Math.max(EPSILON, Math.min(refFreq, 1 - EPSILON));
      let prob = EPSILON;

      if (dosage === 1.0) {
        prob = safeP * safeP;
      } else if (dosage === 0.5) {
        prob = 2 * safeP * (1 - safeP);
      } else if (dosage === 0.0) {
        prob = (1 - safeP) * (1 - safeP);
      }

      sumLogP += Math.log(prob);
      validMarkers++;
    }

    if (validMarkers > 0) {
      const avgNegLogL = -sumLogP / validMarkers;
      // Map average negative log-likelihood to a highly descriptive 0-100% score
      const similarityScore = Math.max(0, 100 * (1 - avgNegLogL / D_MAX));

      results.push({
        population: popNames[p],
        region: popRegions[p],
        distance: avgNegLogL,
        similarityScore: parseFloat(similarityScore.toFixed(2)),
        markersCompared: validMarkers
      });
    }
  }

  return results.sort((a, b) => b.similarityScore - a.similarityScore);
}
