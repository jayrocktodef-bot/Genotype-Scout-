import fs from 'fs';
import { parseDNAFile } from '../utils/dnaParser';
import hoReferenceKernel from '../data/raw_aims/ho_modern_reference_kernel.json';

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

  Array.from(usedAimsSet).forEach((rsid, idx) => {
    const meta = prunedGenotypesMap.get(rsid)!;
    nnlsWeights[idx] = meta.weight;

    const aim = masterAims[rsid] || masterAims[rsid.toUpperCase()];
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

  // Run solver and print iterations details
  const lr = 10.0;
  console.log(`Running solver with LR = ${lr}, M = ${activeM}, P = ${P}`);
  
  let weights = new Float32Array(P);
  for (let p = 0; p < P; p++) {
    weights[p] = 1.0 / P;
  }

  for (let iter = 0; iter < 10; iter++) {
    const grad = new Float32Array(P);
    
    for (let i = 0; i < activeM; i++) {
      let predicted = 0;
      for (let p = 0; p < P; p++) {
        predicted += weights[p] * nnlsPopExpectedDosages[popCodes[p]][i];
      }
      const diff = nnlsUserDosages[i] - predicted;
      
      for (let p = 0; p < P; p++) {
        grad[p] -= diff * nnlsPopExpectedDosages[popCodes[p]][i] * nnlsWeights[i];
      }
    }

    // Print top weights and gradients
    console.log(`\nIteration ${iter}:`);
    const stats = popCodes.map((code, idx) => ({
      code,
      weight: weights[idx],
      gradVal: grad[idx],
      normGrad: grad[idx] / activeM
    }));
    
    console.log('  Top 5 weights:');
    [...stats].sort((a, b) => b.weight - a.weight).slice(0, 5).forEach(s => {
      console.log(`    ${s.code}: weight = ${s.weight.toFixed(4)}, normGrad = ${s.normGrad.toFixed(4)}`);
    });
    
    console.log('  Most negative gradients (pushing weight UP):');
    [...stats].sort((a, b) => a.normGrad - b.normGrad).slice(0, 5).forEach(s => {
      console.log(`    ${s.code}: weight = ${s.weight.toFixed(4)}, normGrad = ${s.normGrad.toFixed(4)}`);
    });

    console.log('  Most positive gradients (pushing weight DOWN):');
    [...stats].sort((a, b) => b.normGrad - a.normGrad).slice(0, 5).forEach(s => {
      console.log(`    ${s.code}: weight = ${s.weight.toFixed(4)}, normGrad = ${s.normGrad.toFixed(4)}`);
    });

    const nextWeights = new Float32Array(P);
    for (let p = 0; p < P; p++) {
      nextWeights[p] = weights[p] - lr * (grad[p] / activeM);
    }

    weights = projectToSimplex(nextWeights);
  }
}

main();
