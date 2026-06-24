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
 * Performs mixed deconvolution using microhaplotype allele frequencies
 */
export function deconvolveMicrohaplotypes(userSnps: Record<string, string>): MicroHapResult[] {
  const normalizedSnps = Object.fromEntries(
    Object.entries(userSnps).map(([k, v]) => [k.toLowerCase(), v])
  );

  const matchedHaps: Array<{
    id: string;
    observedAllele: string;
    freqs: Record<string, number>;
  }> = [];

  // Match user alleles to known microhap regions in the microhap_top100_kernel
  microHapKernel.forEach((hap: any) => {
    const userAlleles = hap.snps.map((rsid: string) => {
      const g = normalizedSnps[rsid.toLowerCase()];
      // Check for homozygous call to reconstruct haplotype string
      if (g && g.length === 2 && g[0] === g[1]) {
        return g[0];
      }
      return null;
    });

    if (userAlleles.every((a: string | null) => a !== null)) {
      const haplotypeString = userAlleles.join(':'); // Format: "A:G:T"
      
      // Look up in the larger microhap_db.json
      const dbEntry = (microHapDb as any)[hap.id];
      if (dbEntry && dbEntry.alleles) {
        // Find index of the matching haplotype string
        const matchIdx = dbEntry.alleles.indexOf(haplotypeString);
        if (matchIdx !== -1) {
          // Compile pop frequencies for this allele
          const freqs: Record<string, number> = {};
          Object.entries(dbEntry.frequencies).forEach(([pop, freqArray]: [string, any]) => {
            if (Array.isArray(freqArray)) {
              freqs[pop] = freqArray[matchIdx] || 0;
            } else if (typeof freqArray === 'number') {
              // Fallback for single allele profiles
              freqs[pop] = freqArray;
            }
          });

          matchedHaps.push({
            id: hap.id,
            observedAllele: haplotypeString,
            freqs
          });
        }
      }
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

  matchedHaps.forEach((h, idx) => {
    userDosages[idx] = 2.0; // Since we filter for homozygous haplotype reconstructions
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
    .sort((a, b) => b.percentage - a.percentage);
}
