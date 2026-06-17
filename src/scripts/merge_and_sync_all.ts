import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { PCA } from 'ml-pca';

// Map population codes to Macro-Regions and UI colors
const REGION_MAP: Record<string, { region: string, color: string }> = {
  // 1kGP Core
  'YRI': { region: 'Africa', color: '#10b981' },
  'LWK': { region: 'Africa', color: '#10b981' },
  'GWD': { region: 'Africa', color: '#10b981' },
  'MSL': { region: 'Africa', color: '#10b981' },
  'ESN': { region: 'Africa', color: '#10b981' },
  'ASW': { region: 'Africa', color: '#10b981' },
  'ACB': { region: 'Africa', color: '#10b981' },
  'CEU': { region: 'Europe', color: '#3b82f6' },
  'GBR': { region: 'Europe', color: '#3b82f6' },
  'FIN': { region: 'Europe', color: '#3b82f6' },
  'IBS': { region: 'Europe', color: '#3b82f6' },
  'TSI': { region: 'Europe', color: '#3b82f6' },
  'CHB': { region: 'Asia', color: '#ef4444' },
  'CHS': { region: 'Asia', color: '#ef4444' },
  'CDX': { region: 'Asia', color: '#ef4444' },
  'KHV': { region: 'Asia', color: '#ef4444' },
  'JPT': { region: 'Asia', color: '#ef4444' },
  'GIH': { region: 'South Asia', color: '#ec4899' },
  'PJL': { region: 'South Asia', color: '#ec4899' },
  'BEB': { region: 'South Asia', color: '#ec4899' },
  'STU': { region: 'South Asia', color: '#ec4899' },
  'ITU': { region: 'South Asia', color: '#ec4899' },
  'PUR': { region: 'Americas', color: '#a855f7' },
  'CLM': { region: 'Americas', color: '#a855f7' },
  'MXL': { region: 'Americas', color: '#a855f7' },
  'PEL': { region: 'Americas', color: '#a855f7' },

  // HGDP
  'Karitiana': { region: 'Americas', color: '#a855f7' },
  'Surui': { region: 'Americas', color: '#a855f7' },
  'Pima': { region: 'Americas', color: '#a855f7' },
  'Maya': { region: 'Americas', color: '#a855f7' },
  'Colombian': { region: 'Americas', color: '#a855f7' },
  'Russian': { region: 'Europe', color: '#3b82f6' },
  'French': { region: 'Europe', color: '#3b82f6' },
  'Sardinian': { region: 'Europe', color: '#3b82f6' },
  'Basque': { region: 'Europe', color: '#3b82f6' },
  'Orcadian': { region: 'Europe', color: '#3b82f6' },
  'Tuscan': { region: 'Europe', color: '#3b82f6' },
  'Bergamo': { region: 'Europe', color: '#3b82f6' },
  'Adygei': { region: 'Europe', color: '#3b82f6' },
  'Druze': { region: 'Middle East', color: '#f59e0b' },
  'Bedouin': { region: 'Middle East', color: '#f59e0b' },
  'Palestinian': { region: 'Middle East', color: '#f59e0b' },
  'Mbuti': { region: 'Africa', color: '#10b981' },
  'Biaka': { region: 'Africa', color: '#10b981' },
  'San': { region: 'Africa', color: '#10b981' },
  'BantuKenya': { region: 'Africa', color: '#10b981' },
  'BantuSouthAfrica': { region: 'Africa', color: '#10b981' },
  'Mandenka': { region: 'Africa', color: '#10b981' },
  'Yoruba': { region: 'Africa', color: '#10b981' },
  'Kalash': { region: 'Central Asia', color: '#8b5cf6' },
  'Papuan': { region: 'Oceania', color: '#06b6d4' },
  'Melanesian': { region: 'Oceania', color: '#06b6d4' },
  'Korean': { region: 'Asia', color: '#ef4444' },
  'Filipino': { region: 'Asia', color: '#ef4444' },
  'Japanese': { region: 'Asia', color: '#ef4444' },
  'Yakut': { region: 'Asia', color: '#ef4444' },
  'Han': { region: 'Asia', color: '#ef4444' },
  'Uygur': { region: 'Asia', color: '#ef4444' },
  'Hazara': { region: 'Asia', color: '#ef4444' },

  // gnomAD / ALFA / Forensic additions
  'ASJ_gnomAD': { region: 'Europe', color: '#3b82f6' },
  'AMI_gnomAD': { region: 'Europe', color: '#3b82f6' },
  'MID_gnomAD': { region: 'Middle East', color: '#f59e0b' },
  'GWF_Fula': { region: 'Africa', color: '#10b981' },
  'GWJ_Jola': { region: 'Africa', color: '#10b981' },
  'GWW_Wolof': { region: 'Africa', color: '#10b981' },
  'GEMJ_Japan': { region: 'Asia', color: '#ef4444' },
  'ALFA_AfAm': { region: 'Africa', color: '#10b981' },
  'ALFA_LatAm1': { region: 'Americas', color: '#a855f7' },
  'ALFA_African': { region: 'Africa', color: '#10b981' },
  'NFE_gnomAD': { region: 'Europe', color: '#3b82f6' },
  'AFR_gnomAD': { region: 'Africa', color: '#10b981' },
  'AMR_gnomAD': { region: 'Americas', color: '#a855f7' },
  'EAS_gnomAD': { region: 'Asia', color: '#ef4444' },
  'SAS_gnomAD': { region: 'South Asia', color: '#ec4899' },
  'FIN_gnomAD': { region: 'Europe', color: '#3b82f6' },
  'ALFA_EUR': { region: 'Europe', color: '#3b82f6' },
  'ALFA_EAS': { region: 'Asia', color: '#ef4444' },
  'ALFA_LatAm2': { region: 'Americas', color: '#a855f7' },
  'ALFA_SAS': { region: 'South Asia', color: '#ec4899' },

  // Custom admixed sub-populations
  'LMB': { region: 'Americas', color: '#a855f7' },
  'GLL': { region: 'Africa', color: '#10b981' },
  'CHK': { region: 'Americas', color: '#a855f7' },
  'LNP': { region: 'Americas', color: '#a855f7' },
  'NAN': { region: 'Americas', color: '#a855f7' },
  'WDN': { region: 'Americas', color: '#a855f7' },
  'ASJ': { region: 'Europe', color: '#3b82f6' },
  'SEJ': { region: 'Europe', color: '#3b82f6' },
  'MZJ': { region: 'Middle East', color: '#f59e0b' },
  'YMJ': { region: 'Middle East', color: '#f59e0b' },
  'MEL': { region: 'Americas', color: '#a855f7' }
};

async function execute() {
  console.log("🌍 1. Fetching updated 1kGP Core frequencies from Ensembl variation API...");

  const weightsFile = './src/data/raw_aims/commercial_aim_weights.json';
  if (!fs.existsSync(weightsFile)) {
    console.error("❌ commercial_aim_weights.json not found.");
    return;
  }
  
  const targetMarkers = JSON.parse(fs.readFileSync(weightsFile, 'utf8'));
  const rsIDs = Object.keys(targetMarkers).slice(0, 150); // Top 150 AIMs for PCA

  const newKernel: Record<string, { region: string, frequencies: Record<string, number> }> = {};

  for (const rsid of rsIDs) {
    try {
      const response = await axios.get(`https://rest.ensembl.org/variation/human/${rsid}?content-type=application/json&pops=1`);
      if (response.data.populations) {
        response.data.populations
          .filter((p: any) => p.population.includes('1000GENOMES:phase_3') || p.population.includes('HGDP:'))
          .forEach((p: any) => {
            const popCode = p.population.split(':').pop();
            if (!newKernel[popCode]) {
              newKernel[popCode] = {
                region: REGION_MAP[popCode]?.region || 'Global',
                frequencies: {}
              };
            }
            newKernel[popCode].frequencies[rsid] = p.frequency;
          });
      }
      process.stdout.write('.');
      await new Promise(resolve => setTimeout(resolve, 150));
    } catch (e) {
      console.error(`\n❌ Failed to fetch ${rsid}`);
    }
  }
  console.log("\n✅ 1kGP Core fetched.");

  console.log("📂 2. Merging gnomAD, ALFA, and Forensic populations from git HEAD...");
  const gitOutput = execSync('git show HEAD:src/data/raw_aims/ho_modern_reference_kernel.json', { maxBuffer: 50 * 1024 * 1024 });
  const headKernel = JSON.parse(gitOutput.toString());

  const restoredPops = [
    'ASJ_gnomAD', 'AMI_gnomAD', 'MID_gnomAD',
    'GWF_Fula', 'GWJ_Jola', 'GWW_Wolof', 'GEMJ_Japan',
    'ALFA_AfAm', 'ALFA_LatAm1', 'ALFA_African',
    'NFE_gnomAD', 'AFR_gnomAD', 'AMR_gnomAD',
    'EAS_gnomAD', 'SAS_gnomAD', 'FIN_gnomAD',
    'ALFA_EUR', 'ALFA_EAS', 'ALFA_LatAm2', 'ALFA_SAS'
  ];

  restoredPops.forEach(pop => {
    if (headKernel[pop]) {
      newKernel[pop] = {
        region: REGION_MAP[pop]?.region || headKernel[pop].region,
        frequencies: headKernel[pop].frequencies
      };
      console.log(`  Merged population: ${pop} (${Object.keys(headKernel[pop].frequencies).length} SNPs)`);
    } else {
      console.warn(`  Warning: Population ${pop} not found in HEAD kernel!`);
    }
  });

  console.log("🧮 3. Recomputing custom admixed sub-populations...");
  const yriFreqs = newKernel['YRI']?.frequencies || {};
  const ceuFreqs = newKernel['CEU']?.frequencies || {};
  const pelFreqs = newKernel['PEL']?.frequencies || {};
  const midFreqs = newKernel['MID_gnomAD']?.frequencies || {};

  const allRsids = new Set([
    ...Object.keys(yriFreqs),
    ...Object.keys(ceuFreqs),
    ...Object.keys(pelFreqs),
    ...Object.keys(midFreqs),
    ...rsIDs
  ]);

  const lmbFreqs: Record<string, number> = {};
  const gllFreqs: Record<string, number> = {};
  const chkFreqs: Record<string, number> = {};
  const lnpFreqs: Record<string, number> = {};
  const nanFreqs: Record<string, number> = {};
  const wdnFreqs: Record<string, number> = {};
  const asjFreqs: Record<string, number> = {};
  const sejFreqs: Record<string, number> = {};
  const mzjFreqs: Record<string, number> = {};
  const ymjFreqs: Record<string, number> = {};
  const melFreqs: Record<string, number> = {};

  for (const rsid of allRsids) {
    const fAFR = yriFreqs[rsid] ?? 0;
    const fEUR = ceuFreqs[rsid] ?? 0;
    const fAMR = pelFreqs[rsid] ?? 0;
    const fMENA = midFreqs[rsid] ?? 0;

    lmbFreqs[rsid] = Number((0.35 * fAMR + 0.53 * fEUR + 0.12 * fAFR).toFixed(4));
    gllFreqs[rsid] = Number((0.93 * fAFR + 0.07 * fEUR).toFixed(4));
    chkFreqs[rsid] = Number((0.50 * fAMR + 0.45 * fEUR + 0.05 * fAFR).toFixed(4));
    lnpFreqs[rsid] = Number((0.45 * fAMR + 0.50 * fEUR + 0.05 * fAFR).toFixed(4));
    nanFreqs[rsid] = Number((0.35 * fAMR + 0.45 * fEUR + 0.20 * fAFR).toFixed(4));
    wdnFreqs[rsid] = Number((0.40 * fAMR + 0.50 * fEUR + 0.10 * fAFR).toFixed(4));
    asjFreqs[rsid] = Number((0.50 * fEUR + 0.50 * fMENA).toFixed(4));
    sejFreqs[rsid] = Number((0.35 * fEUR + 0.65 * fMENA).toFixed(4));
    mzjFreqs[rsid] = Number((0.10 * fEUR + 0.90 * fMENA).toFixed(4));
    ymjFreqs[rsid] = Number((0.85 * fMENA + 0.15 * fAFR).toFixed(4));
    melFreqs[rsid] = Number((0.85 * fEUR + 0.10 * fAFR + 0.03 * fAMR + 0.02 * fMENA).toFixed(4));
  }

  newKernel['LMB'] = { region: 'Americas', frequencies: lmbFreqs };
  newKernel['GLL'] = { region: 'Africa', frequencies: gllFreqs };
  newKernel['CHK'] = { region: 'Americas', frequencies: chkFreqs };
  newKernel['LNP'] = { region: 'Americas', frequencies: lnpFreqs };
  newKernel['NAN'] = { region: 'Americas', frequencies: nanFreqs };
  newKernel['WDN'] = { region: 'Americas', frequencies: wdnFreqs };
  newKernel['ASJ'] = { region: 'Europe', frequencies: asjFreqs };
  newKernel['SEJ'] = { region: 'Europe', frequencies: sejFreqs };
  newKernel['MZJ'] = { region: 'Middle East', frequencies: mzjFreqs };
  newKernel['YMJ'] = { region: 'Middle East', frequencies: ymjFreqs };
  newKernel['MEL'] = { region: 'Americas', frequencies: melFreqs };

  console.log("📈 4. Calculating PCA on the full 50+ population reference matrix...");
  const populations = Object.keys(newKernel);
  const matrix = populations.map(pop => {
    return rsIDs.map(rsid => newKernel[pop].frequencies[rsid] ?? 0.0);
  });

  const pca = new PCA(matrix);
  const coordinates = pca.predict(matrix).to2DArray();

  const pcaMapData = populations.map((pop, idx) => ({
    population: pop,
    region: newKernel[pop].region,
    color: REGION_MAP[pop]?.color || '#94a3b8',
    pc1: coordinates[idx][0],
    pc2: coordinates[idx][1]
  }));

  // Save the files
  fs.writeFileSync('./src/data/raw_aims/pca_reference_data.json', JSON.stringify(pcaMapData, null, 2));
  fs.writeFileSync('./src/data/raw_aims/ho_modern_reference_kernel.json', JSON.stringify(newKernel, null, 2));

  const pcaModel = {
    rsIDs,
    model: pca.toJSON()
  };
  fs.writeFileSync('./src/data/raw_aims/pca_model.json', JSON.stringify(pcaModel, null, 2));

  console.log(`✅ Completed successfully! Processed ${populations.length} populations.`);
}

execute().catch(console.error);
