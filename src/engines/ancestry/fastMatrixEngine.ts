import { get, set } from 'idb-keyval';
import hoReferenceKernel from '../../data/raw_aims/ho_modern_reference_kernel.json';

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
let isCompiling = false;
let globalRsIDs: string[] = [];
let popNames: string[] = [];
let popRegions: string[] = [];
let popFrequencies: Float32Array[] = []; // Array of binary arrays

const CACHE_KEY = 'genotype_scout_matrix_cache_v2';

export async function compileReferenceKernel() {
  if (isCompiled || isCompiling) return;
  isCompiling = true;

  let cachedData = null;

  // 1. SAFELY CHECK CACHE (Ignores iframe security blocks)
  try {
    console.log("🔍 Checking IndexedDB for cached binary kernel...");
    cachedData = await get(CACHE_KEY);
  } catch (e) {
    console.warn("⚠️ IndexedDB access blocked (iframe environment). Skipping cache read.");
  }

  if (cachedData) {
    globalRsIDs = cachedData.globalRsIDs;
    popNames = cachedData.popNames;
    popRegions = cachedData.popRegions;
    popFrequencies = cachedData.popFrequencies;
    isCompiled = true;
    isCompiling = false;
    console.log(`⚡ BOOTSTRAP FAST: Loaded ${popNames.length} populations from IndexedDB.`);
    return;
  }

  try {
    console.log("⚙️ Compiling JSON kernel into Float32 binary arrays...");

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

    // 3. SAFELY SAVE CACHE (Ignores iframe security blocks)
    try {
      await set(CACHE_KEY, {
        globalRsIDs,
        popNames,
        popRegions,
        popFrequencies
      });
      console.log(`✅ Cache Saved. Mapped ${popNames.length} populations.`);
    } catch (e) {
      console.warn("⚠️ IndexedDB save blocked. Running purely in RAM for this session.");
    }

    isCompiled = true;
  } catch (error) {
    console.error("Failed to compile kernel:", error);
  } finally {
    isCompiling = false;
  }
}

// --------------------------------------------------------
// HIGH-SPEED MATH ENGINE
// --------------------------------------------------------
export async function calculatePopulationProximityOptimized(userSnps: Map<string, string>): Promise<PopulationProximity[]> {
  // Ensure the kernel is compiled into memory
  if (!isCompiled) {
    await compileReferenceKernel();
  }

  const numMarkers = globalRsIDs.length;
  const numPops = popNames.length;
  
  // Pre-process user calls to match the Float32Array index
  // 0.5 = Heterozygous, 1.0 = Homozygous, -1.0 = Missing
  const userCalls = new Float32Array(numMarkers);
  
  for (let i = 0; i < numMarkers; i++) {
    const call = userSnps.get(globalRsIDs[i]);
    if (!call || call.length !== 2) {
      userCalls[i] = -1.0; 
      continue;
    }
    
    // Check if Heterozygous (e.g. "AG")
    if (call[0] !== call[1]) {
      userCalls[i] = 0.5;
    } else {
      userCalls[i] = 1.0; // Mark as Homozygous, dosage finalized in loop below
    }
  }

  const results: PopulationProximity[] = [];

  // Loop through populations by pure integer index (incredibly fast)
  for (let p = 0; p < numPops; p++) {
    const refArray = popFrequencies[p];
    let totalEuclideanDistance = 0.0;
    let validMarkers = 0;

    for (let i = 0; i < numMarkers; i++) {
      const refFreq = refArray[i];
      const uCall = userCalls[i];

      // Skip if user or reference is missing this marker
      if (uCall === -1.0 || refFreq === -1.0) continue;

      // Finalize Homozygous dosage based on the reference frequency
      let dosage = uCall;
      if (dosage === 1.0) {
        dosage = refFreq > 0.5 ? 1.0 : 0.0;
      }

      // Calculate distance
      const diff = dosage - refFreq;
      totalEuclideanDistance += (diff * diff);
      validMarkers++;
    }

    if (validMarkers > 0) {
      const meanDistance = Math.sqrt(totalEuclideanDistance / validMarkers);
      const similarityScore = Math.max(0, 100 - (meanDistance * 100));

      results.push({
        population: popNames[p],
        region: popRegions[p],
        distance: meanDistance,
        similarityScore: parseFloat(similarityScore.toFixed(2)),
        markersCompared: validMarkers
      });
    }
  }

  return results.sort((a, b) => b.similarityScore - a.similarityScore);
}
