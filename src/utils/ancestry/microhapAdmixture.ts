import microHapDb from '../../data/raw_aims/microhap_db.json';
import microHapKernel from '../../data/raw_aims/microhap_top100_kernel.json';
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

  const matchedHaps: Array<{
    id: string;
    dosage: number;
    freqs: Record<string, number>;
  }> = [];

  // 1. First check block-based haplotypes from microHapKernel if present
  if (Array.isArray(microHapKernel) && microHapKernel.length > 0) {
    microHapKernel.forEach((hap: any) => {
      const locusAlleles: string[][] = [];
      let hasAllSnps = true;

      for (const rsid of hap.snps) {
        const g = normalizedSnps[rsid.toLowerCase()];
        if (!g || g === '--' || g === '00' || g === '??') {
          hasAllSnps = false;
          break;
        }
        const cleanG = g.toUpperCase().replace(/[\s\/_]/g, '');
        const alleles = Array.from(new Set(cleanG.split('')));
        if (alleles.length === 0) {
          hasAllSnps = false;
          break;
        }
        locusAlleles.push(alleles);
      }

      if (!hasAllSnps) return;

      const cartesian = (arrays: string[][]): string[][] => {
        return arrays.reduce((acc, curr) => {
          return acc.flatMap(d => curr.map(e => [...d, e]));
        }, [[]] as string[][]);
      };

      const possibleHaploVectors = cartesian(locusAlleles);
      const numHaplos = possibleHaploVectors.length;
      if (numHaplos === 0) return;

      const dosagePerHaplo = 2.0 / numHaplos;
      const dbEntry = (microHapDb as any)[hap.id];
      if (!dbEntry || !dbEntry.alleles) return;

      possibleHaploVectors.forEach((vector) => {
        const haplotypeString = vector.join(':');
        const matchIdx = dbEntry.alleles.indexOf(haplotypeString);
        if (matchIdx !== -1) {
          const freqs: Record<string, number> = {};
          Object.entries(dbEntry.frequencies).forEach(([pop, freqArray]: [string, any]) => {
            if (Array.isArray(freqArray)) {
              freqs[pop] = freqArray[matchIdx] || 0;
            } else if (typeof freqArray === 'number') {
              freqs[pop] = freqArray;
            }
          });

          matchedHaps.push({
            id: hap.id,
            dosage: dosagePerHaplo,
            freqs
          });
        }
      });
    });
  }

  // 2. Direct locus matching against 3,053 microhaplotypes in microHapDb
  Object.entries(microHapDb as Record<string, any>).forEach(([hapId, dbEntry]) => {
    const rsid = dbEntry.rsid || hapId;
    const g = normalizedSnps[rsid.toLowerCase()] || normalizedSnps[hapId.toLowerCase()];
    if (!g || g === '--' || g === '00' || g === '??') return;

    const cleanG = g.toUpperCase().replace(/[\s\/_]/g, '');
    const ref = (dbEntry.ref || 'A').toUpperCase();
    const alt = (dbEntry.alt || 'G').toUpperCase();
    let dosage = 0;
    for (const char of cleanG) {
      if (char === alt) dosage += 1.0;
    }

    const freqs: Record<string, number> = {};
    if (dbEntry.frequencies && typeof dbEntry.frequencies === 'object') {
      Object.entries(dbEntry.frequencies).forEach(([pop, val]: [string, any]) => {
        if (typeof val === 'number') {
          freqs[pop] = val;
        } else if (Array.isArray(val) && val.length > 0) {
          freqs[pop] = val[0];
        }
      });
    }

    if (Object.keys(freqs).length > 0) {
      matchedHaps.push({
        id: hapId,
        dosage,
        freqs
      });
    }
  });

  if (matchedHaps.length === 0) {
    return [];
  }

  const popSet = new Set<string>();
  matchedHaps.forEach(h => Object.keys(h.freqs).forEach(p => popSet.add(p)));
  const popCodes = Array.from(popSet).filter(p => p !== 'GLOBAL' && p !== 'ALL');

  const M = matchedHaps.length;
  const userDosages = new Float32Array(M);
  const popExpectedDosages: Record<string, Float32Array> = {};
  popCodes.forEach(p => {
    popExpectedDosages[p] = new Float32Array(M);
  });
  const aimWeights = new Float32Array(M);

  matchedHaps.forEach((h: any, idx) => {
    userDosages[idx] = h.dosage;
    aimWeights[idx] = 1.5;
    popCodes.forEach(p => {
      popExpectedDosages[p][idx] = (h.freqs[p] || 0) * 2.0;
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
