import microHapDb from '../../data/raw_aims/microhap_db.json';
import microHapKernel from '../../data/raw_aims/microhap_top100_kernel.json';
import { loadMasterAims } from '../../data/index';
import { solveAdmixtureProportions } from '../../components/ancestryOracleLogic';

export interface MicroHapResult {
  popCode: string;
  name: string;
  percentage: number;
}

const POP_LABEL_MAP: Record<string, string> = {
  'EUR': 'European Reference (EUR)',
  'AFR': 'African Reference (AFR)',
  'EAS': 'East Asian Reference (EAS)',
  'SAS': 'South Asian Reference (SAS)',
  'AMR': 'Indigenous American Reference (AMR)',
  'ACB': 'African Caribbean / Barbados (ACB)',
  'ASW': 'African-American / SW US (ASW)',
  'BEB': 'Bengali / South Asian (BEB)',
  'CDX': 'Chinese Dai / SE Asian (CDX)',
  'CEU': 'Central European (CEU)',
  'CHB': 'Han Chinese / Beijing (CHB)',
  'CHS': 'Southern Han Chinese (CHS)',
  'CLM': 'Colombian / Indigenous-Admixed (CLM)',
  'ESN': 'Esan / West African (ESN)',
  'FIN': 'Uralic & North-East European (FIN)',
  'GBR': 'British Isles (GBR)',
  'GIH': 'Gujarati / South Asian (GIH)',
  'GWD': 'Gambian / West African (GWD)',
  'IBS': 'Iberian Peninsula (IBS)',
  'ITU': 'Telugu / South Asian (ITU)',
  'JPT': 'Japanese / Yamato (JPT)',
  'KHV': 'Kinh Vietnamese / SE Asian (KHV)',
  'LWK': 'Luhya / East African (LWK)',
  'MSL': 'Mende / Sierra Leonean (MSL)',
  'MXL': 'Mexican / Indigenous-Admixed (MXL)',
  'PEL': 'Peruvian / Indigenous American (PEL)',
  'PJL': 'Punjabi / South Asian (PJL)',
  'PUR': 'Puerto Rican / Indigenous-Admixed (PUR)',
  'STU': 'Tamil / South Asian (STU)',
  'TSI': 'Central Mediterranean / Tuscan (TSI)',
  'YRI': 'Yoruba / West African (YRI)'
};

/**
 * Performs mixed deconvolution using microhaplotype allele frequencies across 3,053 global microhaplotype loci.
 */
export function deconvolveMicrohaplotypes(userSnps: Record<string, string>): MicroHapResult[] {
  const normalizedSnps = Object.fromEntries(
    Object.entries(userSnps).map(([k, v]) => [k.toLowerCase(), v])
  );

  const masterAims = (loadMasterAims() || {}) as Record<string, any>;

  const matchedHaps: Array<{
    id: string;
    dosage: number;
    freqs: Record<string, number>;
  }> = [];

  // 1. Check block-based haplotypes from microHapKernel if present
  if (Array.isArray(microHapKernel) && microHapKernel.length > 0) {
    microHapKernel.forEach((hap: any) => {
      let hasAllSnps = true;
      const userAlleles: string[] = [];

      for (const rsid of hap.snps) {
        const g = normalizedSnps[rsid.toLowerCase()];
        if (!g || g === '--' || g === '00' || g === '??') {
          hasAllSnps = false;
          break;
        }
        const cleanG = g.toUpperCase().replace(/[\s\/_]/g, '');
        userAlleles.push(cleanG[0] || 'A');
      }

      if (!hasAllSnps) return;

      const hapStrNoColons = userAlleles.join('');
      const hapStrWithColons = userAlleles.join(':');

      const freqs: Record<string, number> = {};

      if (hap.weights) {
        Object.entries(hap.weights).forEach(([pop, map]: [string, any]) => {
          const f = map[hapStrNoColons] ?? map[hapStrWithColons] ?? 0;
          freqs[pop] = f;
        });
      } else {
        const dbEntry = (microHapDb as any)[hap.id];
        if (dbEntry && dbEntry.frequencies) {
          Object.entries(dbEntry.frequencies).forEach(([pop, val]: [string, any]) => {
            freqs[pop] = typeof val === 'number' ? val : (Array.isArray(val) ? val[0] : 0);
          });
        }
      }

      if (Object.keys(freqs).length > 0) {
        matchedHaps.push({
          id: hap.id,
          dosage: 1.0,
          freqs
        });
      }
    });
  }

  // 2. Direct RSID and coordinate locus matching against master microhaplotypes
  Object.entries(masterAims).forEach(([aimKey, aimEntry]) => {
    if (!aimKey.toLowerCase().startsWith('mh') && aimEntry.trait !== 'Forensic Microhaplotype') return;

    const dbEntry = (microHapDb as any)[aimKey] || aimEntry;
    const rsid = dbEntry.rsid || aimKey;
    const g = normalizedSnps[rsid.toLowerCase()] || normalizedSnps[aimKey.toLowerCase()];
    if (!g || g === '--' || g === '00' || g === '??') return;

    const cleanG = g.toUpperCase().replace(/[\s\/_]/g, '');
    const alt = (dbEntry.alt || aimEntry.alt || 'G').toUpperCase();
    let dosage = 0;
    for (const char of cleanG) {
      if (char === alt) dosage += 1.0;
    }

    const freqs: Record<string, number> = {};
    const freqSource = dbEntry.frequencies || aimEntry.frequencies;
    if (freqSource && typeof freqSource === 'object') {
      Object.entries(freqSource).forEach(([pop, val]: [string, any]) => {
        if (typeof val === 'number') {
          freqs[pop] = val;
        } else if (Array.isArray(val) && val.length > 0) {
          freqs[pop] = val[0];
        }
      });
    }

    if (Object.keys(freqs).length > 0) {
      matchedHaps.push({
        id: aimKey,
        dosage: dosage / 2.0,
        freqs
      });
    }
  });

  if (matchedHaps.length === 0) {
    return [];
  }

  const popSet = new Set<string>();
  matchedHaps.forEach(h => Object.keys(h.freqs).forEach(p => popSet.add(p)));
  
  const superPops = new Set(['AFR', 'EUR', 'EAS', 'SAS', 'AMR']);
  let popCodes = Array.from(popSet).filter(p => p !== 'GLOBAL' && p !== 'ALL');
  
  // If macro superpopulation frequencies exist (EUR, AFR, EAS, SAS, AMR), isolate them from sub-clades to prevent zero-fill bias
  const hasSuperPops = popCodes.some(p => superPops.has(p));
  if (hasSuperPops) {
    popCodes = popCodes.filter(p => superPops.has(p));
  }

  const M = matchedHaps.length;
  const userDosages = new Float32Array(M);
  const popExpectedDosages: Record<string, Float32Array> = {};
  popCodes.forEach(p => {
    popExpectedDosages[p] = new Float32Array(M);
  });
  const aimWeights = new Float32Array(M).fill(1.5);

  matchedHaps.forEach((h: any, idx) => {
    userDosages[idx] = h.dosage;
    popCodes.forEach(p => {
      popExpectedDosages[p][idx] = h.freqs[p] ?? 0;
    });
  });

  const proportions = solveAdmixtureProportions(userDosages, popExpectedDosages, aimWeights);
  
  return Object.entries(proportions)
    .map(([popCode, percentage]) => ({
      popCode,
      name: POP_LABEL_MAP[popCode] || popCode,
      percentage
    }))
    .filter(item => item.percentage > 0.1)
    .sort((a, b) => b.percentage - a.percentage);
}
