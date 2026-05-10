import grafIndex from '../data/graf_10k_index.json';
import forensicAims from '../data/forensic_aims_master.json';
import deepAims from '../data/deep_resolution_aims.json';
import euroforgenPanel from '../data/euroforgen_name_panel.json';
import grafWeights from '../data/graf_10k_weights.json';
import commercialAimWeights from '../data/commercial_aim_weights.json';
import microhapKernel from '../data/microhap_top100_kernel.json';
import colonialWeights from '../data/ancestry/colonial_aim_weights.json';
import deepAfricanWeights from '../data/ancestry/african_deep_res_weights.json';
import ancientAfricanWeights from '../data/ancestry/ancient_african_weights.json';

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


export function calculateProAncestry(
  userSnps: Record<string, string>,
  referenceData: any
) {
  // 1. Normalize user SNPs for lookup
  const normalizedUserSnps = Object.fromEntries(
    Object.entries(userSnps).map(([k, v]) => [k.toLowerCase(), v])
  );

  // 2. Build a combined informative marker set from all high-precision panels
  const allInformativeMarkers = new Set<string>();
  
  // Add GRAF-10k
  Object.keys(grafIndex).forEach(rsid => allInformativeMarkers.add(rsid.toLowerCase()));
  
  // Add Forensic AIMs
  (forensicAims as any[]).forEach(aim => {
    if (aim.rsid) allInformativeMarkers.add(aim.rsid.toLowerCase());
  });
  
  // Add Deep Resolution
  (deepAims as any[]).forEach(aim => {
    if (aim.rsid) allInformativeMarkers.add(aim.rsid.toLowerCase());
  });
  
  // Add Euroforgen
  if (euroforgenPanel && euroforgenPanel.markers) {
    euroforgenPanel.markers.forEach(rsid => allInformativeMarkers.add(rsid.toLowerCase()));
  }

  // 3. Inject GRAF Weights into the reference dataset for higher precision
  const enhancedRef = { ...referenceData };
  Object.entries(grafWeights as Record<string, Record<string, number>>).forEach(([rsid, popFreqs]) => {
    const key = rsid.toLowerCase();
    if (enhancedRef[key]) return; // Prefer existing high-fidelity markers if available

    const marker = (grafIndex as any)[rsid];
    if (!marker) return;

    enhancedRef[key] = {
        populations: Object.fromEntries(
            Object.entries(popFreqs).map(([popCode, p]) => {
                const q = 1 - p;
                return [popCode, {
                   [marker.alt + marker.alt]: p * p,
                   [marker.ref + marker.alt]: 2 * p * q,
                   [marker.alt + marker.ref]: 2 * p * q,
                   [marker.ref + marker.ref]: q * q
                }];
            })
        )
    };
  });

  // 4. Inject Commercial AIM Weights
  Object.entries(commercialAimWeights as Record<string, Record<string, number>>).forEach(([rsid, popFreqs]) => {
    const key = rsid.toLowerCase();
    if (enhancedRef[key]) return;

    const marker = (grafIndex as any)[rsid];
    if (!marker) return; // Need index for Ref/Alt labels

    enhancedRef[key] = {
        populations: Object.fromEntries(
            Object.entries(popFreqs).map(([popCode, p]) => {
                const q = 1 - p;
                return [popCode, {
                    [marker.alt + marker.alt]: p * p,
                    [marker.ref + marker.alt]: 2 * p * q,
                    [marker.alt + marker.ref]: 2 * p * q,
                    [marker.ref + marker.ref]: q * q
                }];
            })
        )
    };
  });

  // 4.1 Inject Curated African Deep-Resolution & Colonial Weights
  const curatedWeights = [colonialWeights, deepAfricanWeights, ancientAfricanWeights];
  curatedWeights.forEach(weightGroup => {
    Object.entries(weightGroup as Record<string, any>).forEach(([rsid, data]) => {
        const key = rsid.toLowerCase();
        
        const popData = data.populations || data;
        const marker = (grafIndex as any)[rsid.toUpperCase()] || (grafIndex as any)[rsid];
        
        if (marker && popData) {
            const populations: Record<string, any> = {};
            
            Object.entries(popData).forEach(([popCode, freqData]: [string, any]) => {
                // Determine frequency p
                let p = 0.5;
                if (typeof freqData === 'number') {
                    p = freqData;
                } else if (Array.isArray(freqData)) {
                    // Handle array of population objects if necessary
                    const pEntry = freqData.find(pe => pe.allele === marker.alt || pe.frequency !== undefined);
                    p = pEntry ? (pEntry.frequency ?? 0.5) : 0.5;
                } else if (freqData && typeof freqData === 'object') {
                    p = freqData.frequency ?? 0.5;
                }

                const q = 1 - p;
                populations[popCode] = {
                    [marker.alt + marker.alt]: p * p,
                    [marker.ref + marker.alt]: 2 * p * q,
                    [marker.alt + marker.ref]: 2 * p * q,
                    [marker.ref + marker.ref]: q * q
                };
            });

            enhancedRef[key] = { populations };
            allInformativeMarkers.add(key);
        }
    });
  });

  // 5. Filter user SNPs to those in our informative panels that ARE ALSO in the reference frequencies
  const informativeRsids = Array.from(allInformativeMarkers).filter(rsid => {
    const key = rsid.toLowerCase();
    // Must be in user data, must have valid genotype, and must be in our reference database
    return normalizedUserSnps[key] && 
           normalizedUserSnps[key] !== '--' && 
           (enhancedRef[key] || enhancedRef[rsid]);
  });

  const scores: Record<string, number> = {
    EUR: 0,
    AFR: 0,
    EAS: 0,
    SAS: 0,
    AMR: 0
  };

  let markersUsed = 0;
  let commercialAimsDetected = 0;
  const detectedMicroHaps: any[] = [];

  // Internal frequency helper
  const getSuperPopFreq = (rsid: string, genotype: string, superPop: string) => {
    const marker = enhancedRef[rsid];
    if (!marker || !marker.populations) return 0.001;

    const subPops = Object.keys(POP_TO_SUPERPOP).filter(p => POP_TO_SUPERPOP[p] === superPop);
    let totalFreq = 0;
    let count = 0;

    const sortedGenotype = genotype.split('').sort().join('');

    for (const popCode of subPops) {
      const popData = marker.populations[popCode];
      if (popData) {
        // Match genotype regardless of order
        let freq = 0;
        let found = false;
        for (const [g, f] of Object.entries(popData as any)) {
          if (g.split('').sort().join('') === sortedGenotype) {
            freq = f as number;
            found = true;
            break;
          }
        }
        
        if (found) {
          totalFreq += freq;
          count++;
        }
      }
    }

    return count > 0 ? (totalFreq / count) : 0.001;
  };

  // 6. Primary SNP-based Admixture
  for (const rsid of informativeRsids) {
    const genotype = normalizedUserSnps[rsid.toLowerCase()];
    
    let refKey = rsid;
    if (!enhancedRef[refKey]) {
      if (enhancedRef[rsid.toLowerCase()]) {
        refKey = rsid.toLowerCase();
      } else {
        continue;
      }
    }

    markersUsed++;

    let weight = 1.0;
    const lsid = rsid.toLowerCase();
    
    // Check if it's in a known AIM panel
    const isForensic = (forensicAims as any[]).some(aim => aim.rsid?.toLowerCase() === lsid);
    const isDeep = (deepAims as any[]).some(aim => aim.rsid?.toLowerCase() === lsid);
    const isCommercial = ALL_COMMERCIAL_AIMS.some(id => id.toLowerCase() === lsid);
    
    if (isForensic || isDeep) {
        weight = 10.0;
    }

    if (isCommercial) {
        commercialAimsDetected++;
        weight = Math.max(weight, 15.0);
    }

    // Diagnostic "Super Weight" markers for specific regions
    const diagnosticSuperWeights: Record<string, number> = {
        'rs1426654': 25.0, 'rs3827760': 25.0, 'rs16891982': 20.0, 'rs12913832': 18.0, 
        'rs4988235': 12.0, 'rs16139': 15.0, 'rs12916300': 15.0, 'rs885479': 12.0, 
        'rs1042602': 10.0, 'rs1800414': 10.0, 'rs73885319': 15.0, 'rs334': 15.0
    };

    if (diagnosticSuperWeights[lsid]) weight = diagnosticSuperWeights[lsid];

    for (const pop of SUPER_POPS) {
      const freq = getSuperPopFreq(refKey, genotype, pop);
      scores[pop] += Math.log(Math.max(0.0001, freq)) * weight;
    }
  }

  // 7. MicroHap Haplotype Matching (Forensic Boost)
  microhapKernel.forEach((hap: any) => {
      // Extract user's alleles for this SNP cluster (Homozygous assurance)
      const components = hap.snps.map((rsid: string) => {
          const g = normalizedUserSnps[rsid.toLowerCase()];
          if (g && g.length === 2 && g[0] === g[1]) return g[0];
          return null;
      });

      if (components.every((c: any) => c !== null)) {
          const userHaplotype = components.join('');
          
          // Find the population where this signature is most frequent (Diagnostic Signature)
          const popEntries = Object.entries(hap.weights);
          if (popEntries.length > 0) {
              const topPopEntry = popEntries.reduce((prev: [string, any], curr: [string, any]) => {
                  const prevFreq = prev[1][userHaplotype] || 0;
                  const currFreq = curr[1][userHaplotype] || 0;
                  return currFreq > prevFreq ? curr : prev;
              });

              const topFreq = (topPopEntry[1] as any)[userHaplotype] || 0;

              if (topFreq > 0.4) { // 40% frequency threshold for "Signature"
                  detectedMicroHaps.push({
                      id: hap.id,
                      population: topPopEntry[0],
                      signature: userHaplotype,
                      confidence: hap.global_ae
                  });

                  // Apply Likelihood Boost for the matching Super-Population
                  const superPop = POP_TO_SUPERPOP[topPopEntry[0]] || (SUPER_POPS.includes(topPopEntry[0]) ? topPopEntry[0] : null);
                  if (superPop) {
                      // 50x Likelihood Boost for MicroHap Signature
                      scores[superPop] += Math.log(Math.max(0.0001, topFreq)) * 50.0;
                  }
              }
          }
      }
  });

  // Convert Log scores back to percentages using a Softmax function
  const values = Object.values(scores);
  if (values.length === 0 || markersUsed === 0) {
    return { results: {}, markersUsed: 0, precision: "Standard" };
  }

  const maxScore = Math.max(...values);
  let totalProbability = 0;
  const probabilities: Record<string, number> = {};

  for (const pop of SUPER_POPS) {
    const prob = Math.exp(scores[pop] - maxScore);
    probabilities[pop] = prob;
    totalProbability += prob;
  }

  const finalPercentages: Record<string, number> = {};
  for (const pop of SUPER_POPS) {
    const percentage = (probabilities[pop] / totalProbability) * 100;
    if (percentage >= 0.1) finalPercentages[pop] = Number(percentage.toFixed(2));
  }

  const commercialCoreActive = (commercialAimsDetected / ALL_COMMERCIAL_AIMS.length) >= 0.8;

  return {
    results: finalPercentages,
    markersUsed: markersUsed,
    precision: commercialCoreActive ? "Commercial Core High-Res" : (markersUsed > 5000 ? "Forensic Grade" : "Standard"),
    commercialCoreActive,
    microHaps: detectedMicroHaps
  };
}
