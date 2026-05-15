import { ANCHOR_AIMS, loadGlobalAnchors } from '../anchorAims';
import { SNP_DB } from '../data/snpDatabase';
import { imputeTargetedGenotypes } from './imputationService';
import { getPopFrequencies, PopFrequencyEntry, findFrequency } from '../data/GenomicDataService';

const anchorMap = new Map(ANCHOR_AIMS.map(a => [a.rsid.toLowerCase(), a]));
const anchorRsids = new Set(ANCHOR_AIMS.map(a => a.rsid.toLowerCase()));

// We'll populate these dynamically if global anchors are loaded
let extendedAnchorMap = new Map(anchorMap);
let extendedAnchorRsids = new Set(anchorRsids);

export async function initializeGlobalAnchors() {
  const global = await loadGlobalAnchors();
  Object.entries(global).forEach(([id, aim]) => {
    extendedAnchorMap.set(id.toLowerCase(), aim);
    extendedAnchorRsids.add(id.toLowerCase());
  });
  console.log(`📡 Ancestry Engine: Integrated ${Object.keys(global).length} Global Anchors`);
}

const POP_CODE_TO_REGION: Record<string, string> = {
  'GBR': 'EUR', 'CEU': 'EUR', 'FIN': 'EUR', 'IBS': 'EUR', 'TSI': 'EUR',
  'YRI': 'AFR', 'LWK': 'AFR', 'GWD': 'AFR', 'MSL': 'AFR', 'ESN': 'AFR', 'ASW': 'AFR', 'ACB': 'AFR',
  'CHB': 'EAS', 'CHS': 'EAS', 'CDX': 'EAS', 'KHV': 'EAS', 'JPT': 'EAS',
  'GIH': 'SAS', 'PJL': 'SAS', 'BEB': 'SAS', 'STU': 'SAS', 'ITU': 'SAS',
  'PUR': 'AMR', 'CLM': 'AMR', 'MXL': 'AMR', 'PEL': 'AMR'
};
import { CONTINENT_TO_CODE } from '../constants/genotypeConstants';
import { isSubpopMatch } from '../utils/genotypeUtils';
import { AncestryInferenceResult } from '../types/genotype';

const DOUBLE_WEIGHT_MARKERS = new Set([
  "rs10456243", "rs10456244", "rs10456245",
  "rs10456257", "rs10456259", "rs10456260", "rs10456261", "rs10456262", "rs10456263",
  "rs10456267", "rs10456268", "rs2285644", "rs334",
  "rs1426654", "rs16891982", "rs1042602", "rs1800407",
  "rs12124819", "rs174537", "rs1126809", "rs1229984", "rs7388531",
  "rs1805007", "rs12821256", "rs1800562", "rs2395129",
  "rs1129038", "rs12896399", "rs1805008", "rs1805009", "rs11547464",
  "rs4833103", "rs1800404", "rs12203594", "rs16891985", "rs1805010", "rs4988238",
  "rs10811661", "rs12779790",
  "rs11887534", "rs60910145", "rs10486573", "rs4242382", "rs12752445",
  "rs7460469", "rs10424072", "rs17388247", "rs694339", "rs1042604",
  "rs10486574", "rs10486575", "rs4242383", "rs4242384", "rs12752446", "rs12752447",
  "rs10424073", "rs10424074", "rs13136401", "rs13136402", "rs13136403",
  "rs10900598", "rs1129039",
  "rs10456305", "rs10456306", "rs10456310", "rs10456308", "rs10456311", "rs10456309", "rs10456312",
  "rs10456313", "rs10456314", "rs10456315", "rs10456316",
  "rs10456293", "rs10456294", "rs10456317", "rs10456318",
  "rs10456319", "rs10456320", "rs10456321", "rs10456322",
  "rs10456323", "rs10456324", "rs10456325", "rs10456326",
  "rs10456327", "rs10456328", "rs10456329", "rs10456330",
  "rs10456331", "rs10456332", "rs10456333", "rs10456334",
  "rs10456335", "rs10456336", "rs10456337", "rs10456338", "rs10456339",
  "rs10456340", "rs10456341", "rs10456342", "rs10456343", "rs10456344",
  "rs10456345", "rs10456346", "rs10456347", "rs10456348", "rs10456349",
  "rs10456350", "rs10456351", "rs10456352", "rs10456353", "rs10456354",
  "rs10456355", "rs10456356",
  "rs10456357", "rs10456358", "rs10456359", "rs10456360", "rs10456361", "rs10456362",
  "rs10456363", "rs10456367", "rs10456368", "rs10456369", "rs10456370", "rs10456371",
  "rs10456388", "rs10456389", "rs10456391", "rs10456393", "rs10456396", "rs10456399",
  "rs10456401", "rs10456402", "rs10456403", "rs10456404", "rs10456405", "rs10456408",
  "rs10456409", "rs10456410", "rs10456418", "rs10456419",
  "rs10456421", "rs10456422", "rs10456423", "rs10456425", "rs10456426"
]);

const QUADRUPLE_WEIGHT_MARKERS = new Set([
  "rs2814778", "rs3827760", "rs4988235", "rs12913832", "rs10456265", "rs10456266",
  "rs10456247", "rs10456249", "rs10456252", "rs10456256",
  "rs10456213", "rs10456215", "rs10456216", "rs10456198",
  "rs12203592", "rs1393350", "rs11614913", "rs121913059",
  "rs1229984", "rs671", "rs7388531", "rs17822931", "rs10954737",
  "rs10456271", "rs10456234", "rs10456258", "rs10456248", "rs10456269",
  "rs7252505", "rs1572319", "rs10456197", "rs12149626",
  "rs12149628", "rs7252508", "rs1426654", "rs10456301",
  "rs10456302", "rs10456303", "rs10456304", "rs16891982",
  "rs1129038", "rs10456305", "rs10456306", "rs13430441",
  "rs16139", "rs4988238", "rs60910145", "rs10456364",
  "rs10456365", "rs10456366", "rs10456367", "rs10456368",
  "rs10456369", "rs10456370",
  "rs6119471", "rs11190870", "rs7431289", "rs12224928", "rs9271160",
  "rs16847050", "rs10456426", "rs12149627", "rs10456440", "rs13136405", "rs7252509", "rs11887534",
  "rs12913832", "rs1426654", "rs11887534", "rs10456345",
  "rs60910144", "rs16892766", "rs7712345", "rs11122334", "rs10456272", "rs5857297"
]);

// Viterbi decoding for HMM
function viterbi(
  observations: number[],
  frequencies: number[][], // [marker][continent]
  numStates: number,
  recombinationRate = 0.0001
): number[] {
  const numMarkers = observations.length;
  if (numMarkers === 0) return [];

  const viterbiTable = new Array(numStates).fill(0).map(() => new Array(numMarkers).fill(0));
  const backpointer = new Array(numStates).fill(0).map(() => new Array(numMarkers).fill(0));

  // Initialization
  for (let i = 0; i < numStates; i++) {
    const emission = frequencies[0][i];
    viterbiTable[i][0] = Math.log(1 / numStates) + Math.log(Math.max(0.001, emission));
  }

  // Recursion
  for (let t = 1; t < numMarkers; t++) {
    for (let i = 0; i < numStates; i++) {
      let maxProb = -Infinity;
      let prevStateIndex = 0;
      
      const emission = Math.log(Math.max(0.001, frequencies[t][i]));

      for (let j = 0; j < numStates; j++) {
        const transition = Math.log((i === j) ? (1 - recombinationRate) : (recombinationRate / (numStates - 1)));
        const prob = viterbiTable[j][t - 1] + transition + emission;
        if (prob > maxProb) {
          maxProb = prob;
          prevStateIndex = j;
        }
      }
      viterbiTable[i][t] = maxProb;
      backpointer[i][t] = prevStateIndex;
    }
  }

  // Backtracking
  const path = new Array(numMarkers);
  let maxFinalProb = -Infinity;
  for (let i = 0; i < numStates; i++) {
    if (viterbiTable[i][numMarkers - 1] > maxFinalProb) {
      maxFinalProb = viterbiTable[i][numMarkers - 1];
      path[numMarkers - 1] = i;
    }
  }

  for (let t = numMarkers - 2; t >= 0; t--) {
    path[t] = backpointer[path[t + 1]][t + 1];
  }

  return path;
}

export function runAncestryInference(
  allMarkers: any[],
  userGenotype: Record<string, string>,
  yHaploRegion?: string | null,
  mtHaploRegion?: string | null,
  isPrimary: boolean = false,
  priorResults?: { graf?: any, k27?: any }
): AncestryInferenceResult {
  const continentsToScore = [
    'African', 'European', 'East Asian', 'South Asian', 
    'Middle Eastern', 'Native American', 'Oceanian', 'North African', 'Central Asian'
  ];

  if (allMarkers.length === 0) {
    return { continentalScores: {}, regionalScores: {}, deepScores: {}, continents: [], subPopulations: {}, subPopMarkers: {}, confidenceScore: 0, chromosomeData: {}, confidenceIntervals: {} };
  }

  // Helper: Marker QC
  const isReliable = (m: any) => {
    // Basic QC: Filter markers with extremely low or missing significance
    return m.significance !== 'Low';
  };

  // Helper: Consensus Weighting
  const getPriorAdjustment = (m: any, continent: string) => {
    if (!priorResults) return 1.0;
    
    let boost = 1.0;
    // Simple consensus: boost if continent matches top results from engines
    const checkEngine = (res: any) => {
      if (res && res.continentalScores && res.continentalScores[continent] > 30) {
        boost += 0.5;
      }
    };
    checkEngine(priorResults.graf);
    checkEngine(priorResults.k27);
    return boost;
  };

  // 2. Segment-Based Continental Analysis (Windowing)
  const WINDOW_SIZE = 40; // SNPs per window
  const continentalCounts: Record<string, number> = {};
  continentsToScore.forEach(c => continentalCounts[c] = 0);

  // Group markers by chromosome for Chromosome Painting
  const markersByChrom: Record<string, any[]> = {};
  allMarkers.forEach(m => {
    const chrom = m.chrom.replace('chr', '').toUpperCase();
    if (!markersByChrom[chrom]) markersByChrom[chrom] = [];
    markersByChrom[chrom].push(m);
  });

  // LD Pruning: Remove markers within 50kb of each other to prevent LD bias, 
  // but be less aggressive for AIMs which are often pre-selected for independence.
  Object.keys(markersByChrom).forEach(chrom => {
    const markers = markersByChrom[chrom].sort((a, b) => a.pos - b.pos);
    const pruned: any[] = [];
    let lastPos = -1000000;
    
    for (const m of markers) {
      // If a marker is explicitly an anchor AIM, we prefer to keep it even if slightly close
      const rsidKey = (m.rsid || m.markerId).toLowerCase();
      const isAnchor = extendedAnchorRsids.has(rsidKey);
      const pruneDist = isAnchor ? 25000 : 50000; // 25kb for AIMs, 50kb for others
      
      if (m.pos - lastPos > pruneDist) {
        pruned.push(m);
        lastPos = m.pos;
      } else if (isAnchor && !extendedAnchorRsids.has((pruned[pruned.length - 1]?.rsid || pruned[pruned.length - 1]?.markerId)?.toLowerCase())) {
        // If current is anchor and previous wasn't, swap them to prioritize anchor
        pruned[pruned.length - 1] = m;
        lastPos = m.pos;
      }
    }
    markersByChrom[chrom] = pruned;
  });

  const chromosomeData: Record<string, Record<string, number>> = {};
  const segments: Record<string, { continent: string, start: number, end: number, confidence: number }[]> = {};
  const allWindowProportions: number[][] = []; // To calculate confidence intervals

  const matchesContinent = (markerContinent: string, targetContinent: string) => {
    if (!markerContinent) return false;
    const parts = markerContinent.split('/').map(p => p.trim());
    return parts.includes(targetContinent);
  };

  const subPopDistances: Record<string, Record<string, number>> = {}; // continent -> subpop -> distance
  const subPopMarkers: Record<string, any[]> = {};

  // Pre-calculate sub-populations for each continent and initialize markers
  const continentSubpopsMap: Record<string, string[]> = {};
  continentsToScore.forEach(continent => {
    const continentSubpopsSet = new Set<string>();
    SNP_DB.filter(s => matchesContinent(s.continent, continent) && s.subpop).forEach(s => continentSubpopsSet.add(s.subpop as string));
    ANCHOR_AIMS.filter(a => matchesContinent(a.region, continent) && a.subFrequencies).forEach(a => {
      if (a.subFrequencies) Object.keys(a.subFrequencies).forEach(sp => continentSubpopsSet.add(sp));
    });
    continentSubpopsMap[continent] = Array.from(continentSubpopsSet);
    
    continentSubpopsMap[continent].forEach(sp => {
      if (!subPopMarkers[sp]) subPopMarkers[sp] = [];
    });
  });

  const duffyGenotype = userGenotype["rs2814778"];
  const hasDuffyNullVariant = !!duffyGenotype && duffyGenotype.includes('C');
  const dNullTested = !!duffyGenotype && duffyGenotype !== '--';
  const afrBaseReduction = (dNullTested && !hasDuffyNullVariant) ? 0.25 : 1.0;
  const afrEastReduction = (dNullTested && !hasDuffyNullVariant) ? 0.75 : 1.0; // Milder reduction for East Africa
  
  const popFreqs = getPopFrequencies();

  for (const chrom of Object.keys(markersByChrom)) {
    const chromMarkers = markersByChrom[chrom];
    const chromCounts: Record<string, number> = {};
    continentsToScore.forEach(c => chromCounts[c] = 0);

    const windowMarkers: any[][] = [];
    const STEP_SIZE = 20; // Overlapping windows for smoother results
    segments[chrom] = [];

    for (let i = 0; i < chromMarkers.length; i += STEP_SIZE) {
      const end = Math.min(i + WINDOW_SIZE, chromMarkers.length);
      windowMarkers.push(chromMarkers.slice(i, end));
      if (end === chromMarkers.length) break;
    }

    for (const window of windowMarkers) {
      const windowGenotypes: number[] = [];
      const windowFrequencies: number[][] = [];
      const windowWeights: number[] = [];

      for (const marker of window) {
        if (!isReliable(marker)) continue;
        const rsid = (marker.rsid || marker.markerId).toLowerCase();
        const genotype = userGenotype[rsid] || marker.genotype;
        if (!genotype) continue;

        const alleles = marker.alleles;
        let matchCount = 0;
        for (const char of genotype) {
          if (alleles.includes(char)) matchCount++;
        }
        
        // Partial match logic: half weight if only one allele matches
        const weightFactor = genotype.length === 2 && matchCount === 1 ? 0.5 : (matchCount === 2 ? 1.0 : 0);
        if (weightFactor === 0) continue;
        
        windowGenotypes.push(matchCount);
        
        const markerFreqs: number[] = [];
        const aim = extendedAnchorMap.get(rsid);

        for (const continent of continentsToScore) {
          let freq = 0.01; 
          const code = CONTINENT_TO_CODE[continent];

          if (aim && aim.frequencies) {
            if (code && aim.frequencies[code] !== undefined) {
              freq = aim.frequencies[code];
            } else if (continent === 'North African' && aim.frequencies['MENA'] !== undefined) {
              freq = aim.frequencies['MENA'];
            } else if (continent === 'Middle Eastern' && aim.frequencies['NAFR'] !== undefined) {
              freq = aim.frequencies['NAFR'];
            }
          } else if (marker.frequencies) {
            if (code && marker.frequencies[code] !== undefined) {
              freq = marker.frequencies[code];
            } else if (continent === 'Native American' && marker.frequencies['Native_American_unadmixed'] !== undefined) {
              freq = marker.frequencies['Native_American_unadmixed'];
            } else if (continent === 'Native American' && marker.frequencies['AMR_admixed'] !== undefined) {
              freq = marker.frequencies['AMR_admixed'];
            } else if (continent === 'North African' && marker.frequencies['MENA'] !== undefined) {
              freq = marker.frequencies['MENA'];
            }
          } else if (matchesContinent(marker.continent, continent)) {
            freq = 0.8;
          }
          
          if (code) {
            const relevantPops = Object.keys(POP_CODE_TO_REGION).filter(p => POP_CODE_TO_REGION[p] === code);
            let totalPopFreq = 0;
            let popEntries = 0;
            const normGenotype = genotype.split('').sort().join('');
            for (const popCode of relevantPops) {
              const f = findFrequency(rsid, normGenotype, popCode);
              if (f !== null) {
                totalPopFreq += f;
                popEntries++;
              }
            }
            if (popEntries > 0) {
              freq = (totalPopFreq / popEntries);
            }
          }
          
          markerFreqs.push(Math.max(0.001, Math.min(0.999, freq)));
        }
        windowFrequencies.push(markerFreqs);

        // Shannon Entropy to measure informative value: lower entropy = higher informativity
        const markerEntropy = markerFreqs.reduce((sum, f) => {
          if (f <= 0 || f >= 1) return sum;
          return sum - f * Math.log2(f);
        }, 0);
        const markerInformativeValue = Math.max(0.1, 1 / (markerEntropy + 0.1));

        const isHeavy = extendedAnchorRsids.has(rsid) || DOUBLE_WEIGHT_MARKERS.has(rsid);
        const isTieBreaker = QUADRUPLE_WEIGHT_MARKERS.has(rsid);
        const isNamedPop = (!!marker.subpop && marker.subpop.toLowerCase() !== 'general') || !!aim?.subFrequencies;
        let weightMultiplier = isTieBreaker ? 5.0 : (isNamedPop ? 3.5 : (isHeavy ? 2.5 : 1.0));
        
        const oceFreq = aim?.frequencies?.OCE || marker.frequencies?.OCE || 0;
        const easFreq = aim?.frequencies?.EAS || marker.frequencies?.EAS || 0;
        
        if (matchesContinent(marker.continent, 'Oceanian')) {
          if (oceFreq > easFreq) {
            weightMultiplier *= 0.01; 
          } else {
            weightMultiplier *= 1.0; 
          }
        }
        
        let effectiveSignificance = marker.significance;
        if (isNamedPop) effectiveSignificance = 'High';
        
        let significanceWeight = (effectiveSignificance === 'High' ? 3.0 : effectiveSignificance === 'Medium' ? 2.0 : 1.0);
        
        const maxFreq = Math.max(...markerFreqs);
        const minFreq = Math.min(...markerFreqs);
        const distributionWeight = 1.0 + (maxFreq - minFreq) * 4.0; 

        let continentSpecificWeight = 1.0;
        const sortedFreqs = [...markerFreqs].sort((a, b) => b - a);
        if (sortedFreqs[0] > 0.90 && sortedFreqs[1] < 0.01) {
          continentSpecificWeight = 10.0; // Very high resolution
        } else if (sortedFreqs[0] > 0.75 && sortedFreqs[1] < 0.05) {
          continentSpecificWeight = 5.0; // Medium resolution
        }

        let weight = (isPrimary ? 6.0 : 1.0) * (aim?.weight || 1.0) * significanceWeight * weightMultiplier * distributionWeight * continentSpecificWeight * weightFactor * markerInformativeValue;
        
        // Option 1: Context-aware marker reliability adjustment
        // Penalize markers where frequencies are too similar across all sampled continental populations
        const freqMean = markerFreqs.reduce((a, b) => a + b, 0) / markerFreqs.length;
        const freqVar = markerFreqs.reduce((a, b) => a + (b - freqMean) ** 2, 0) / markerFreqs.length;
        const reliabilityFactor = Math.max(0.5, Math.min(1.0, freqVar * 5.0)); // Uninformative markers (low var) get penalized
        weight *= reliabilityFactor;
        
        // Option 2: Population-Specific Relative Uniqueness Adjustment 
        // Dampen markers that have high frequencies in nearly all populations (pan-continental)
        const sortedFreqsOption2 = [...markerFreqs].sort((a, b) => b - a);
        const ratio = sortedFreqsOption2[0] / (sortedFreqsOption2[1] || 0.01);
        if (sortedFreqsOption2[0] > 0.7 && ratio < 1.5) {
          weight *= 0.7; // Pan-continental markers are less informative
        }

        // Duffy-Null logic: Regional specific balancing
        if (matchesContinent(marker.continent, 'African')) {
          const subpopSearch = ((marker.subpop || "") + " " + (marker.trait || "") + " " + (aim?.description || "")).toLowerCase();
          const isEastAfr = subpopSearch.includes("east") || subpopSearch.includes("horn") || subpopSearch.includes("ethiopia") || subpopSearch.includes("somali") || subpopSearch.includes("nilotic");
          weight *= isEastAfr ? afrEastReduction : afrBaseReduction;
        }

        windowWeights.push(weight);
      }

      const damping = new Array(continentsToScore.length).fill(1.0);
      const oceIndex = continentsToScore.indexOf('Oceanian');
      if (oceIndex !== -1) damping[oceIndex] = 0.25; 
      const amerIndex = continentsToScore.indexOf('Native American');
      if (amerIndex !== -1) damping[amerIndex] = 0.35; 
      const casIndex = continentsToScore.indexOf('Central Asian');
      if (casIndex !== -1) damping[casIndex] = 0.5;

      const pathIndices = viterbi(windowGenotypes, windowFrequencies, continentsToScore.length);
      const windowProportions = new Array(continentsToScore.length).fill(0);
      pathIndices.forEach(idx => windowProportions[idx] += 1 / pathIndices.length);
      
      if (pathIndices.length > 0) {
        allWindowProportions.push(windowProportions);
        
        // Detailed segment tracking
        const topIndex = pathIndices[Math.floor(pathIndices.length / 2)];
        const topContinent = continentsToScore[topIndex];
        
        // HMM provides a direct assignment, which we treat as high confidence
        segments[chrom].push({
          continent: topContinent,
          start: window[0].pos,
          end: window[window.length - 1].pos,
          confidence: 0.9 // High confidence for Viterbi decoding
        });

        windowProportions.forEach((prob, i) => {
          const continent = continentsToScore[i];
          let filteredProb = prob < 0.01 ? 0 : prob; // Reduced threshold to allow trace amounts
          
          if (continent === 'African') {
             // Use base reduction for continental probability scaling
             filteredProb *= afrBaseReduction;
          }

          continentalCounts[continent] += filteredProb;
          chromCounts[continent] += filteredProb;
        });
      }

      for (const continent of continentsToScore) {
        if (!subPopDistances[continent]) subPopDistances[continent] = {};
        const continentSubpops = continentSubpopsMap[continent] || [];

        for (const sp of continentSubpops) {
          if (subPopDistances[continent][sp] === undefined) {
            subPopDistances[continent][sp] = 0;
          }

          for (const marker of window) {
            if (marker.subpop?.toLowerCase() === 'general') continue;

            const rsid = (marker.rsid || marker.markerId).toLowerCase();
            const genotype = userGenotype[rsid] || marker.genotype;
            if (!genotype) continue;
            let matchCount = 0;
            for (const char of genotype) if (marker.alleles.includes(char)) matchCount++;

            // Partial match logic: half weight if only one allele matches
            const weightFactor = genotype.length === 2 && matchCount === 1 ? 0.5 : (matchCount === 2 ? 1.0 : 0);
            if (weightFactor === 0) continue;

            const aim = extendedAnchorMap.get(rsid);
            let freq = 0.01;
            const code = CONTINENT_TO_CODE[continent];

            if (aim && aim.subFrequencies && aim.subFrequencies[sp] !== undefined) {
              freq = aim.subFrequencies[sp];
              subPopMarkers[sp].push({ rsid: aim.rsid, trait: aim.description, contribution: freq * (aim.weight || 1.0) * weightFactor, genotype });
            } else if (isSubpopMatch(marker.subpop, sp)) {
              freq = 0.8;
              subPopMarkers[sp].push({ rsid: marker.rsid, trait: marker.trait, contribution: 2.0 * weightFactor, genotype });
            } else if (aim && aim.frequencies && code && aim.frequencies[code] !== undefined) {
              freq = aim.frequencies[code];
            } else if (marker.frequencies && code && marker.frequencies[code] !== undefined) {
              freq = marker.frequencies[code];
            } else if (matchesContinent(marker.continent, continent)) {
              freq = 0.5;
            }

            const f = Math.max(0.001, Math.min(0.999, freq));
            const isNamedPop = (!!marker.subpop && marker.subpop.toLowerCase() !== 'general') || !!aim?.subFrequencies;
            const isHeavy = extendedAnchorRsids.has(rsid) || DOUBLE_WEIGHT_MARKERS.has(rsid);
            const isTieBreaker = QUADRUPLE_WEIGHT_MARKERS.has(rsid);
            const weightMultiplier = isTieBreaker ? 5.0 : (isNamedPop ? 3.5 : (isHeavy ? 2.5 : 1.0));
            
            let effectiveSignificance = marker.significance;
            if (isNamedPop) effectiveSignificance = 'High';
            let significanceWeight = (effectiveSignificance === 'High' ? 3.0 : effectiveSignificance === 'Medium' ? 2.0 : 1.0);
            
            const regionalMultiplier = isNamedPop ? 4.0 : 1.0;
            
            const subPopFreqs: number[] = [];
            for (const c of continentsToScore) {
              const cCode = CONTINENT_TO_CODE[c];
              let f = 0.01;
              if (aim && aim.frequencies && cCode && aim.frequencies[cCode] !== undefined) f = aim.frequencies[cCode];
              else if (marker.frequencies && cCode && marker.frequencies[cCode] !== undefined) f = marker.frequencies[cCode];
              subPopFreqs.push(f);
            }
            const maxF = Math.max(...subPopFreqs);
            const minF = Math.min(...subPopFreqs);
            const distributionWeight = 1.0 + (maxF - minF) * 6.0;

            let continentSpecificWeight = 1.0;
            const sortedSubFreqs = [...subPopFreqs].sort((a, b) => b - a);
            if (sortedSubFreqs[0] > 0.65 && sortedSubFreqs[1] < 0.1) {
              continentSpecificWeight = 8.0;
            }

            let weight = (isPrimary ? 8.0 : 1.0) * (aim?.weight || 1.0) * regionalMultiplier * weightMultiplier * significanceWeight * distributionWeight * continentSpecificWeight * weightFactor;
            
            if (continent === 'African') {
              const subpopSearch = ((marker.subpop || "") + " " + (marker.trait || "") + " " + (aim?.description || "")).toLowerCase();
              const isEastAfr = subpopSearch.includes("east") || subpopSearch.includes("horn") || subpopSearch.includes("ethiopia") || subpopSearch.includes("somali") || subpopSearch.includes("nilotic");
              weight *= isEastAfr ? afrEastReduction : afrBaseReduction;
            }

            const error = (matchCount / 2) - f;
            const distSq = weight * (error * error);
            subPopDistances[continent][sp] += distSq;
          }
        }
      }
    }

    // Normalize chromosome data
    const chromTotal = Object.values(chromCounts).reduce((a, b) => a + b, 0);
    if (chromTotal > 0) {
      chromosomeData[chrom] = {};
      continentsToScore.forEach(c => {
        const pct = (chromCounts[c] / chromTotal) * 100;
        if (pct >= 0.5) chromosomeData[chrom][c] = pct;
      });
    }
  }

  const applyHaploWeight = (regionStr: string | null | undefined) => {
    if (!regionStr) return;
    continentsToScore.forEach(continent => {
      if (regionStr.includes(continent)) {
        // Boost European haplogroup signals for finer resolution
        const boost = continent === 'European' ? 2.5 : 1.5;
        continentalCounts[continent] = (continentalCounts[continent] || 0) + boost;
      }
    });
  };
  // Removed haplogroup weighing
  // applyHaploWeight(yHaploRegion);
  // applyHaploWeight(mtHaploRegion);

  const totalSegments = Object.values(continentalCounts).reduce((a, b) => a + b, 0);
  const continentalScores: Record<string, number> = {};
  if (totalSegments > 0) {
    continentsToScore.forEach(c => {
      const pct = (continentalCounts[c] / totalSegments) * 100;
      if (pct >= 0.75) continentalScores[c] = pct;
    });

    const newTotal = Object.values(continentalScores).reduce((a, b) => a + b, 0);
    if (newTotal > 0) {
      Object.keys(continentalScores).forEach(c => continentalScores[c] = (continentalScores[c] / newTotal) * 100);
    }
  }

  const subPopulations: Record<string, any[]> = {};
  for (const continent of Object.keys(subPopDistances)) {
    const subProbs = Object.entries(subPopDistances[continent])
      .map(([name, d]) => ({ name, dist: d }));
    
    let minDist = Infinity;
    for (const p of subProbs) if (p.dist < minDist) minDist = p.dist;
    const probs = subProbs.map(p => ({ name: p.name, prob: Math.exp(-(p.dist - minDist)) }));
    const totalProb = probs.reduce((s, p) => s + p.prob, 0);

    if (totalProb > 0) {
      const filtered = probs
        .map(p => {
          const rawDist = subProbs.find(sp => sp.name === p.name)?.dist || 0;
          // Normalize distance: sqrt(sum of weighted squares) / normalization factor
          // We use a constant to scale it to the familiar 1-10 range where < 3 is good
          const normalizedDist = Math.sqrt(rawDist) / 10; 
          
          return {
            name: p.name,
            distance: normalizedDist,
            percentage: (p.prob / totalProb) * 100,
            confidence: (p.prob / totalProb) * 100,
            topMarkers: (subPopMarkers[p.name] || [])
              .sort((a, b) => b.contribution - a.contribution)
              .slice(0, 5)
          };
        })
        .filter(p => p.percentage > 0);
      
      const filteredTotal = filtered.reduce((s, p) => s + p.percentage, 0);
      if (filteredTotal > 0) {
        subPopulations[continent] = filtered.map(p => ({
          ...p,
          percentage: (p.percentage / filteredTotal) * 100,
          confidence: (p.percentage / filteredTotal) * 100
        })).sort((a, b) => b.percentage - a.percentage);
      }
    }
  }

  // Apply mtDNA Haplogroup Prior (ignoring ydna)
  /*
  if (mtHaploRegion) {
    const BIAS_FACTOR = 1.15; // 15% gentle bias
    
    // Mapping mtDNA haplogroups to continent keys
    const regionToContinentMap: Record<string, string> = {
      'African': 'African',
      'European': 'European',
      'East Asian': 'East Asian',
      'South Asian': 'South Asian',
      'Middle Eastern': 'Middle Eastern',
      'Native American': 'Native American',
      'Oceanian': 'Oceanian',
      'North African': 'North African',
      'Central Asian': 'Central Asian'
    };

    const targetContinent = regionToContinentMap[mtHaploRegion as string];
    if (targetContinent && continentalScores[targetContinent] !== undefined) {
       continentalScores[targetContinent] *= BIAS_FACTOR;
    }
  }
  */

  const filteredContinental = Object.entries(continentalScores).filter(([_, p]) => p > 0);
  const totalFiltered = filteredContinental.reduce((s, [_, p]) => s + p, 0);
  const normalizedContinental: Record<string, number> = {};
  if (totalFiltered > 0) {
    filteredContinental.forEach(([c, p]) => {
      normalizedContinental[c] = (p / totalFiltered) * 100;
    });
  }

  const confidenceIntervals: Record<string, { low: number, high: number }> = {};
  if (allWindowProportions.length > 0) {
    continentsToScore.forEach((continent, i) => {
      const continentProportions = allWindowProportions.map(wp => wp[i]);
      const mean = continentProportions.reduce((a, b) => a + b, 0) / continentProportions.length;
      const variance = continentProportions.reduce((a, b) => a + (b - mean) ** 2, 0) / continentProportions.length;
      const stdDev = Math.sqrt(variance);
      
      const marginOfError = (1.96 * stdDev) / Math.sqrt(allWindowProportions.length);
      const score = (continentalScores[continent] || 0);
      
      if (score > 0) {
        confidenceIntervals[continent] = {
          low: Math.max(0, score - marginOfError * 100),
          high: Math.min(100, score + marginOfError * 100)
        };
      }
    });
  }

  const deepScores: Record<string, number> = {};
  const regionalScores: Record<string, number> = {};

  // Aggregate subPopulations into flat regional and deep scores for the new Aurora API structure
  Object.entries(subPopulations).forEach(([continent, populations]) => {
    const continentWeight = normalizedContinental[continent] || 0;
    populations.forEach((pop: any) => {
      const scaledPercentage = (pop.percentage / 100) * continentWeight;
      
      // Only keep regional scores that are statistically significant
      if (scaledPercentage >= 0.75) {
        regionalScores[pop.name] = scaledPercentage;
      }
      
      // If the population is highly dominant within its continent OR has a strong overall presence
      if (pop.percentage > 60 || scaledPercentage > 8) {
        deepScores[pop.name] = scaledPercentage;
      }
    });
  });

  return { 
    continentalScores: normalizedContinental, 
    regionalScores, 
    deepScores, 
    continents: Object.keys(normalizedContinental), 
    subPopulations, 
    subPopMarkers, 
    confidenceScore: 0,
    chromosomeData,
    segments,
    confidenceIntervals
  };
}

export async function calculateAncestryOracle(results: any[], yHaploRegion?: string | null, mtHaploRegion?: string | null, grafResults?: any, k27Results?: any, comprehensiveResults?: any) {
  // Ensure global anchors are loaded
  await initializeGlobalAnchors();

  const userGenotype: Record<string, string> = {};
  results.forEach(r => {
    const rsid = (r.rsid || r.markerId).toLowerCase();
    if (r.genotype && r.genotype !== '--') {
      userGenotype[rsid] = r.genotype;
    }
  });

  const imputedGenotype = imputeTargetedGenotypes(userGenotype, results);
  
  const isAutosomal = (r: any) => {
    if (r.status === 'not_tested' || !r.chrom || r.pos === undefined) return false;
    if (r.gene === 'Y-DNA' || r.gene === 'mtDNA') return false;
    const chrom = r.chrom.replace('chr', '').toUpperCase();
    const n = parseInt(chrom);
    return !isNaN(n) && n >= 1 && n <= 22;
  };

  const sortMarkers = (markers: any[]) => {
    return [...markers].sort((a, b) => {
      const nA = parseInt(a.chrom.replace('chr', ''));
      const nB = parseInt(b.chrom.replace('chr', ''));
      if (nA !== nB) return nA - nB;
      return a.pos - b.pos;
    });
  };

  const primaryMarkers = sortMarkers(results.filter(r => 
    isAutosomal(r) && extendedAnchorRsids.has((r.rsid || r.markerId).toLowerCase())
  ));

  const comprehensiveMarkers = sortMarkers(results.filter(r => 
    isAutosomal(r) && (r.genotype || r.status === 'matched' || r.status === 'partial')
  ));

  const secondaryMarkers = sortMarkers(results.filter(r => 
    isAutosomal(r) && 
    (extendedAnchorRsids.has((r.rsid || r.markerId).toLowerCase()) || r.category === 'Ancestry' || r.category === 'Health')
  ));

  const commercialMarkers = sortMarkers(results.filter(r => 
    isAutosomal(r) && 
    extendedAnchorRsids.has((r.rsid || r.markerId).toLowerCase().split('_')[0])
  ));

  return {
    primary: runAncestryInference(primaryMarkers, imputedGenotype, yHaploRegion, mtHaploRegion, true, { graf: grafResults, k27: k27Results }),
    comprehensive: comprehensiveResults ? { continentalScores: comprehensiveResults, regionalScores: {}, deepScores: {}, continents: Object.keys(comprehensiveResults), subPopulations: {}, subPopMarkers: {}, confidenceScore: 0, chromosomeData: {}, confidenceIntervals: {} } : runAncestryInference(comprehensiveMarkers, imputedGenotype, yHaploRegion, mtHaploRegion, false, { graf: grafResults, k27: k27Results }),
    secondary: runAncestryInference(secondaryMarkers, imputedGenotype, yHaploRegion, mtHaploRegion, false, { graf: grafResults, k27: k27Results }),
    commercial: runAncestryInference(commercialMarkers, imputedGenotype, yHaploRegion, mtHaploRegion, false, { graf: grafResults, k27: k27Results })
  };
}
