import { getAncestryMarkers } from '../data/GenomicDataService';
import { solveNNLS } from '../utils/nnls';
import { 
  graf10kIndex as grafIndex,
  forensicAimsMaster as forensicAims,
  deepResolutionAims as deepAims,
  euroforgenNamePanel as euroforgenPanel,
  graf10kWeights as grafWeights,
  commercialAimWeights,
  microhapTop100Kernel as microhapKernel,
  colonialAimWeights as colonialWeights,
  africanDeepResWeights as deepAfricanWeights,
  customCuratedMarkers as customCuratedWeights
} from '../data';

/**
 * Admixture Calculator (Statistical Engine)
 * Estimates ethnicity percentages using 1000 Genomes reference data.
 */

interface GenotypeFrequencies {
  [genotype: string]: number;
}

interface PopulationData {
  [popCode: string]: GenotypeFrequencies;
}

interface ReferenceDatabase {
  [rsid: string]: {
    populations: PopulationData;
  };
}

const SUPER_POPS = ['EUR', 'AFR', 'EAS', 'SAS', 'AMR'];

const KIDD_55 = ["rs10756819", "rs10958548", "rs1108232", "rs1129038", "rs12203592", "rs12913832", "rs13214040", "rs1351394", "rs1426654", "rs1476413", "rs1544325", "rs1617682", "rs16891982", "rs17287498", "rs1800407", "rs1927914", "rs2066827", "rs2104511", "rs2184030", "rs2238289", "rs2315024", "rs2336873", "rs2395858", "rs2527993", "rs2814778", "rs3027440", "rs3122629", "rs3811801", "rs3827760", "rs444326", "rs4540055", "rs4821544", "rs4973341", "rs4988235", "rs5006884", "rs5757827", "rs6119471", "rs6133167", "rs682", "rs6995436", "rs7041", "rs7131232", "rs7251928", "rs738322", "rs7495174", "rs7671167", "rs7739969", "rs8038629", "rs849140", "rs8862", "rs910624", "rs9272376", "rs9829807", "rs9883255", "rs9951171"];
const SELDIN_128 = ["rs1008121", "rs10129215", "rs1042531", "rs10484725", "rs10521310", "rs10741285", "rs10776839", "rs10862024", "rs10865507", "rs10888503", "rs10931559", "rs11003444", "rs11024523", "rs11065987", "rs11083324", "rs11119561", "rs11211843", "rs11612053", "rs11618683", "rs11646276", "rs11736767", "rs12048995", "rs12057771", "rs12242137", "rs12255743", "rs12411516", "rs12519119", "rs12521575", "rs12543329", "rs12550186", "rs12558488", "rs12563300", "rs12702758", "rs12723223", "rs12725178", "rs12752179", "rs12771217", "rs12779603", "rs12781443", "rs12913832", "rs13028308", "rs13083697", "rs13104680", "rs13115450", "rs13222530", "rs1337424", "rs1351394", "rs1380629", "rs1385413", "rs1416952", "rs1418385", "rs1426654", "rs1433857", "rs1454530", "rs1459424", "rs1469581", "rs1469584", "rs1481119", "rs1544325", "rs1544983", "rs1551607", "rs1569420", "rs1600277", "rs1617682", "rs1617757", "rs1649987", "rs167527", "rs16891982", "rs16912386", "rs17132398", "rs17205166", "rs17287498", "rs17424610", "rs17441589", "rs1744654", "rs17457788", "rs17631341", "rs17711929", "rs17713481", "rs17726590", "rs1800407", "rs1819777", "rs1864195", "rs1878347", "rs1880476", "rs1883652", "rs1906252", "rs1927914", "rs2030509", "rs2064239", "rs2066827", "rs2071650", "rs2075677", "rs2104511", "rs2120610", "rs2227658", "rs2238289", "rs2240751", "rs2243550", "rs2252119", "rs2254425", "rs2268750", "rs2286950", "rs2294101", "rs2297127", "rs2336873", "rs2358908", "rs2372580", "rs2382813", "rs2395858", "rs2411933", "rs2432968", "rs2438183", "rs2527993", "rs2581024", "rs2581030", "rs2610580", "rs2615462", "rs2814778", "rs2814800", "rs2855800", "rs2891333", "rs3027440", "rs3122629", "rs346853", "rs3811801", "rs3827760", "rs444326"];

const ALL_COMMERCIAL_AIMS = Array.from(new Set([...KIDD_55, ...SELDIN_128]));

const POP_TO_SUPERPOP: Record<string, string> = {
  // European
  'GBR': 'EUR', 'CEU': 'EUR', 'FIN': 'EUR', 'TSI': 'EUR', 'IBS': 'EUR',
  // African
  'YRI': 'AFR', 'LWK': 'AFR', 'GWD': 'AFR', 'MSL': 'AFR', 'ESN': 'AFR', 'ASW': 'AFR', 'ACB': 'AFR',
  // East Asian
  'CHB': 'EAS', 'CHS': 'EAS', 'CDX': 'EAS', 'KHV': 'EAS', 'JPT': 'EAS',
  // South Asian
  'GIH': 'SAS', 'PJL': 'SAS', 'BEB': 'SAS', 'STU': 'SAS', 'ITU': 'SAS',
  // Indigenous American
  'PUR': 'AMR', 'CLM': 'AMR', 'MXL': 'AMR', 'PEL': 'AMR'
};


let globalEnhancedRef: any = null;
let globalInformativeMarkers: Set<string> | null = null;

function getEnhancedReference(baseReference: any) {
  if (globalEnhancedRef) return { enhancedRef: globalEnhancedRef, allInformativeMarkers: globalInformativeMarkers! };

  console.log("🚀 Enhancing Admixture Reference Kernel...");
  const enhancedRef = { ...baseReference };
  const allInformativeMarkers = new Set<string>();

  // Add GRAF-10k
  for (const rsid in grafIndex) {
    allInformativeMarkers.add(rsid.toLowerCase());
  }
  
  // Create a map for quick weight lookup
  const markerWeightMap: Record<string, number> = {};

  // Add All Ancestry Markers
  const ancestryMarkers = getAncestryMarkers();
  for (let i = 0; i < ancestryMarkers.length; i++) {
    const markerDef = ancestryMarkers[i];
    if (!markerDef.rsid) continue;
    
    // Regional boost logic
    let baseWeight = markerDef.weight || 1.0;
    if (markerDef.region && markerDef.region !== "Unknown") {
        baseWeight *= 8.0;
    }
    const cleanRsid = markerDef.rsid.split('_')[0].toLowerCase();
    allInformativeMarkers.add(cleanRsid);
    
    // Store weight
    markerWeightMap[cleanRsid] = baseWeight;

    if ((markerDef as any).frequencies) {
      const rsid = markerDef.rsid.split('_')[0];
      const key = rsid.toLowerCase();
      const marker = (grafIndex as any)[rsid.toUpperCase()] || (grafIndex as any)[rsid];
      
      if (marker) {
        const populations: Record<string, any> = {};
        for (const [popCode, pVal] of Object.entries((markerDef as any).frequencies)) {
          const p = pVal as number;
          const q = 1 - p;
          const aa = p * p;
          const ra = 2 * p * q;
          const rr = q * q;
          populations[popCode] = {
            [marker.alt + marker.alt]: aa,
            [marker.ref + marker.alt]: ra,
            [marker.alt + marker.ref]: ra,
            [marker.ref + marker.ref]: rr
          };
        }
        enhancedRef[key] = { populations };
      }
    }
  }
  
  // Add Euroforgen
  if (euroforgenPanel && euroforgenPanel.markers) {
    for (const rsid of euroforgenPanel.markers) {
      allInformativeMarkers.add(rsid.toLowerCase());
    }
  }

  // Inject additional weights
  for (const [rsid, popFreqs] of Object.entries(grafWeights as Record<string, Record<string, number>>)) {
    const key = rsid.toLowerCase();
    if (enhancedRef[key]) continue; 

    const marker = (grafIndex as any)[rsid];
    if (!marker) continue;

    const populations: Record<string, any> = {};
    for (const [popCode, p] of Object.entries(popFreqs)) {
      const q = 1 - p;
      const aa = p * p;
      const ra = 2 * p * q;
      const rr = q * q;
      populations[popCode] = {
        [marker.alt + marker.alt]: aa,
        [marker.ref + marker.alt]: ra,
        [marker.alt + marker.ref]: ra,
        [marker.ref + marker.ref]: rr
      };
    }
    enhancedRef[key] = { populations };
  }

  globalEnhancedRef = enhancedRef;
  globalInformativeMarkers = allInformativeMarkers;
  return { enhancedRef, allInformativeMarkers, markerWeightMap };
}

export function calculateProAncestry(
  userSnps: Record<string, string>,
  referenceData: any
) {
  // 1. Normalize user SNPs for lookup (Faster than Object.fromEntries)
  const normalizedUserSnps: Record<string, string> = {};
  for (const rsid in userSnps) {
    normalizedUserSnps[rsid.toLowerCase()] = userSnps[rsid];
  }

  // 2. Build/Get enhanced reference
  const { enhancedRef, allInformativeMarkers, markerWeightMap } = getEnhancedReference(referenceData);

  // 3. Filter user SNPs (Optimized loop)
  const informativeRsids: string[] = [];
  allInformativeMarkers.forEach(rsid => {
    if (normalizedUserSnps[rsid] && normalizedUserSnps[rsid] !== '--' && enhancedRef[rsid]) {
      informativeRsids.push(rsid);
    }
  });

  // PREPARE MATRICES FOR NNLS
  const numPops = SUPER_POPS.length;
  
  const A: number[][] = [];
  const b: number[] = [];
  const weights: number[] = [];

  let markersUsed = 0;
  let commercialAimsDetected = 0;

  // Pre-calculate sets for faster lookups
  const forensicSet = new Set((forensicAims as any[]).map(a => a.rsid?.toLowerCase()).filter(Boolean));
  const deepSet = new Set((deepAims as any[]).map(a => a.rsid?.toLowerCase()).filter(Boolean));
  const commercialSet = new Set(ALL_COMMERCIAL_AIMS.map(id => id.toLowerCase()));

  const diagnosticSuperWeights: Record<string, number> = {
      'rs1426654': 25.0, 'rs3827760': 25.0, 'rs16891982': 20.0, 'rs12913832': 18.0, 
      'rs4988235': 12.0, 'rs16139': 15.0, 'rs12916300': 15.0, 'rs885479': 12.0, 
      'rs1042602': 10.0, 'rs1800414': 10.0, 'rs73885319': 15.0, 'rs334': 15.0
  };

  for (let i = 0; i < informativeRsids.length; i++) {
    const rsid = informativeRsids[i];
    const genotype = normalizedUserSnps[rsid];
    
    // Quick validation
    if (genotype.length !== 2) continue;

    const marker = (grafIndex as any)[rsid.toUpperCase()] || (grafIndex as any)[rsid];
    if (!marker) continue;

    const markerRefData = enhancedRef[rsid];
    if (!markerRefData || !markerRefData.populations) continue;
    
    let dosage = 0;
    const a1 = genotype[0];
    const a2 = genotype[1];
    const alt = marker.alt;
    if (a1 === alt) dosage++;
    if (a2 === alt) dosage++;

    // Calculate pop expectations for this marker
    const popExpectations: number[] = Array(numPops).fill(0);
    let hasRefPopData = false;
    for (let j = 0; j < numPops; j++) {
      const pop = SUPER_POPS[j];
      const refPopData = markerRefData.populations[pop];
      if (!refPopData) continue;
      
      hasRefPopData = true;
      let popExpectation = 0;
      // Faster dosage-expectation calculation
      for (const [g, pVal] of Object.entries(refPopData)) {
          const p = pVal as number;
          let gDosage = 0;
          if (g[0] === alt) gDosage++;
          if (g[1] === alt) gDosage++;
          popExpectation += p * gDosage;
      }
      popExpectations[j] = popExpectation;
    }

    if (!hasRefPopData) continue;

    markersUsed++;
    b.push(dosage);
    A.push(popExpectations);

    let weight = markerWeightMap?.[rsid] || 1.0;
    if (forensicSet.has(rsid) || deepSet.has(rsid)) weight = Math.max(weight, 10.0);
    if (commercialSet.has(rsid)) {
        commercialAimsDetected++;
        weight = Math.max(weight, 15.0);
    }
    if (diagnosticSuperWeights[rsid]) weight = diagnosticSuperWeights[rsid];
    weights.push(weight);
  }

  // NNLS CALCULATION
  const proportions = markersUsed > 0 ? solveNNLS(A, b, weights) : new Array(numPops).fill(0);

  const finalPercentages: Record<string, number> = {};
  const totalWeight = proportions.reduce((sum, val) => sum + val, 0);

  if (totalWeight > 0) {
    for (let l = 0; l < SUPER_POPS.length; l++) {
      const pop = SUPER_POPS[l];
      const percentage = (proportions[l] / totalWeight) * 100;
      if (percentage >= 0.1) finalPercentages[pop] = Number(percentage.toFixed(2));
    }
  }

  const commercialCoreActive = (commercialAimsDetected / ALL_COMMERCIAL_AIMS.length) >= 0.8;

  return {
    results: finalPercentages,
    markersUsed: markersUsed,
    precision: commercialCoreActive ? "Commercial Core High-Res" : (markersUsed > 5000 ? "Forensic Grade" : "Standard"),
    commercialCoreActive,
    microHaps: []
  };
}
