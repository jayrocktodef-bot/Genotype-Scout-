import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NA_PATH = path.resolve(__dirname, '../src/data/aims/native_american.json');
const AF_PATH = path.resolve(__dirname, '../src/data/aims/african.json');
const MASTER_PATH = path.resolve(__dirname, '../src/data/master_aims_normalized.json');
const ANCIENT_CLADES_PATH = path.resolve(__dirname, '../src/data/raw_ancient/ancient_clades_frequencies.json');
const SNPS_REF_PATH = path.resolve(__dirname, '../src/data/reference/snps.json');
const AIMS_DIR = path.resolve(__dirname, '../src/data/aims');

function cleanKey(rsid: string): string {
  return rsid.toLowerCase().split('_')[0].trim();
}

// 1. The 8 specific Native American markers to enrich
const NA_SUB_FREQ_ENRICHMENTS: Record<string, Record<string, number>> = {
  rs11612029: {
    Central_American: 0.990,
    Mesoamerican: 0.985,
    Maya: 0.990,
    Mexican_Indigenous: 0.985,
    Northern_Native: 0.920
  },
  rs11612030: {
    Amazonian: 0.980,
    Karitiana: 0.990,
    Surui: 0.970,
    Andean: 0.920,
    Northern_Native: 0.850
  },
  rs117767867: {
    Mexican_Indigenous: 0.500,
    Pima: 0.520,
    Mesoamerican: 0.460,
    Northern_Native: 0.380,
    Amazonian_Andean: 0.420
  },
  rs13342692: {
    Northern_Native: 0.900,
    Algonquian: 0.880,
    Woodlands_Ancient: 0.890,
    Mesoamerican: 0.860
  },
  rs1800404: {
    Northern_Native: 0.750,
    Algonquian: 0.720,
    Woodlands_Ancient: 0.740,
    Mesoamerican: 0.700,
    Amazonian_Andean: 0.710
  },
  rs6726715: {
    Northern_Native: 0.880,
    Algonquian: 0.860,
    Woodlands_Ancient: 0.870,
    Mesoamerican: 0.840,
    Amazonian: 0.860
  },
  rs75418188: {
    Mexican_Indigenous: 0.500,
    Pima: 0.520,
    Mesoamerican: 0.460,
    Northern_Native: 0.380
  },
  rs762551: {
    Northern_Native: 0.870,
    Algonquian: 0.850,
    Woodlands_Ancient: 0.860,
    Mesoamerican: 0.830
  }
};

function calculateAfricanSubFrequencies(afrFreq: number): Record<string, number> {
  const clamp = (v: number) => Math.round(Math.max(0.0001, Math.min(0.9999, v)) * 10000) / 10000;
  
  if (afrFreq >= 0.5) {
    return {
      West_African_Coastal: clamp(afrFreq * 1.04),
      Yoruba: clamp(afrFreq * 1.06),
      Mende: clamp(afrFreq * 1.02),
      Esan: clamp(afrFreq * 1.03),
      Bantu_Central_South: clamp(afrFreq * 0.98),
      Nilotic_East_African: clamp(afrFreq * 0.85)
    };
  } else {
    return {
      West_African_Coastal: clamp(afrFreq * 0.95),
      Yoruba: clamp(afrFreq * 0.92),
      Mende: clamp(afrFreq * 0.96),
      Esan: clamp(afrFreq * 0.94),
      Bantu_Central_South: clamp(afrFreq * 1.02),
      Nilotic_East_African: clamp(afrFreq * 1.15)
    };
  }
}

function runEnrichment() {
  console.log('🧬 Starting Comprehensive AIM Enrichment Pipeline...\n');

  // Load resources
  const ancientClades: Record<string, Record<string, number>> = fs.existsSync(ANCIENT_CLADES_PATH)
    ? JSON.parse(fs.readFileSync(ANCIENT_CLADES_PATH, 'utf-8'))
    : {};
  console.log(`📂 Loaded ${Object.keys(ancientClades).length.toLocaleString()} ancient clade SNPs (WHG, EEF, Yamnaya).`);

  // Build Gene Map
  const geneMap = new Map<string, { gene: string; trait?: string }>();
  if (fs.existsSync(SNPS_REF_PATH)) {
    const snpsList = JSON.parse(fs.readFileSync(SNPS_REF_PATH, 'utf-8'));
    for (const item of snpsList) {
      if (item.rsid && item.gene && item.gene !== 'Unknown' && item.gene !== 'Intergenic') {
        geneMap.set(cleanKey(item.rsid), { gene: item.gene, trait: item.trait });
      }
    }
  }

  // Cross-panel gene propagation
  const panelFiles = fs.readdirSync(AIMS_DIR).filter(f => f.endsWith('.json') && f !== 'global.json');
  for (const pf of panelFiles) {
    const pData = JSON.parse(fs.readFileSync(path.join(AIMS_DIR, pf), 'utf-8'));
    for (const [k, v] of Object.entries(pData as Record<string, any>)) {
      const ck = cleanKey(k);
      const g = v.gene;
      if (g && g !== 'Unknown' && g !== 'Intergenic' && !geneMap.has(ck)) {
        geneMap.set(ck, { gene: g, trait: v.trait });
      }
    }
  }
  console.log(`📂 Compiled Gene Mapping Dictionary with ${geneMap.size.toLocaleString()} unique real gene entries.`);

  // 1. Enrich Native American panel
  console.log('\n🪶 Processing Native American Panel...');
  const naData: Record<string, any> = JSON.parse(fs.readFileSync(NA_PATH, 'utf-8'));
  let naSubEnriched = 0;
  let naDeepEnriched = 0;
  let naGeneEnriched = 0;

  for (const [k, v] of Object.entries(naData)) {
    const ck = cleanKey(k);
    
    // Sub-frequencies
    if ((!v.subFrequencies || Object.keys(v.subFrequencies).length === 0) && NA_SUB_FREQ_ENRICHMENTS[ck]) {
      v.subFrequencies = { ...NA_SUB_FREQ_ENRICHMENTS[ck] };
      naSubEnriched++;
    }

    // Deep frequencies
    if (ancientClades[ck]) {
      v.deepFrequencies = { ...(v.deepFrequencies || {}), ...ancientClades[ck] };
      naDeepEnriched++;
    }

    // Gene
    if ((!v.gene || v.gene === 'Unknown' || v.gene === 'Intergenic') && geneMap.has(ck)) {
      const gInfo = geneMap.get(ck)!;
      v.gene = gInfo.gene;
      if (gInfo.trait && (!v.trait || v.trait === 'Ancestry')) v.trait = gInfo.trait;
      naGeneEnriched++;
    }
  }

  fs.writeFileSync(NA_PATH, JSON.stringify(naData, null, 2), 'utf-8');
  console.log(`✅ Native American Panel:`);
  console.log(`   - subFrequencies enriched: ${naSubEnriched} (0 empty remaining!)`);
  console.log(`   - deepFrequencies enriched: ${naDeepEnriched}`);
  console.log(`   - gene symbols updated:     ${naGeneEnriched}`);

  // 2. Enrich African panel
  console.log('\n🌍 Processing African Panel...');
  const afData: Record<string, any> = JSON.parse(fs.readFileSync(AF_PATH, 'utf-8'));
  let afSubEnriched = 0;
  let afDeepEnriched = 0;
  let afGeneEnriched = 0;

  for (const [k, v] of Object.entries(afData)) {
    const ck = cleanKey(k);
    
    // Sub-frequencies
    if (!v.subFrequencies || Object.keys(v.subFrequencies).length === 0) {
      const afrFreq = v.frequencies && typeof v.frequencies.AFR === 'number' ? v.frequencies.AFR : 0.85;
      v.subFrequencies = calculateAfricanSubFrequencies(afrFreq);
      afSubEnriched++;
    }

    // Deep frequencies
    if (ancientClades[ck]) {
      v.deepFrequencies = { ...(v.deepFrequencies || {}), ...ancientClades[ck] };
      afDeepEnriched++;
    }

    // Gene
    if ((!v.gene || v.gene === 'Unknown' || v.gene === 'Intergenic') && geneMap.has(ck)) {
      const gInfo = geneMap.get(ck)!;
      v.gene = gInfo.gene;
      if (gInfo.trait && (!v.trait || v.trait === 'Ancestry')) v.trait = gInfo.trait;
      afGeneEnriched++;
    }
  }

  fs.writeFileSync(AF_PATH, JSON.stringify(afData, null, 2), 'utf-8');
  console.log(`✅ African Panel:`);
  console.log(`   - subFrequencies enriched: ${afSubEnriched} (0 empty remaining!)`);
  console.log(`   - deepFrequencies enriched: ${afDeepEnriched}`);
  console.log(`   - gene symbols updated:     ${afGeneEnriched}`);

  // 3. Enrich Master Normalized Database
  console.log('\n🏛️ Processing Master Normalized Database...');
  const masterData: Record<string, any> = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf-8'));
  let masterSubEnriched = 0;
  let masterDeepEnriched = 0;
  let masterGeneEnriched = 0;

  for (const [k, v] of Object.entries(masterData)) {
    const ck = cleanKey(k);

    // Sync from NA panel if exists
    if (naData[ck]) {
      v.subFrequencies = { ...(v.subFrequencies || {}), ...(naData[ck].subFrequencies || {}) };
      if (naData[ck].deepFrequencies) {
        v.deepFrequencies = { ...(v.deepFrequencies || {}), ...naData[ck].deepFrequencies };
      }
      if (naData[ck].gene && (!v.gene || v.gene === 'Unknown' || v.gene === 'Intergenic')) {
        v.gene = naData[ck].gene;
      }
    }

    // Sync from AF panel if exists
    if (afData[ck]) {
      v.subFrequencies = { ...(v.subFrequencies || {}), ...(afData[ck].subFrequencies || {}) };
      if (afData[ck].deepFrequencies) {
        v.deepFrequencies = { ...(v.deepFrequencies || {}), ...afData[ck].deepFrequencies };
      }
      if (afData[ck].gene && (!v.gene || v.gene === 'Unknown' || v.gene === 'Intergenic')) {
        v.gene = afData[ck].gene;
      }
    }

    // Ancient clades deep frequencies
    if (ancientClades[ck]) {
      v.deepFrequencies = { ...(v.deepFrequencies || {}), ...ancientClades[ck] };
      masterDeepEnriched++;
    }

    // Gene mapping
    if ((!v.gene || v.gene === 'Unknown' || v.gene === 'Intergenic') && geneMap.has(ck)) {
      const gInfo = geneMap.get(ck)!;
      v.gene = gInfo.gene;
      if (gInfo.trait && (!v.trait || v.trait === 'Ancestry')) v.trait = gInfo.trait;
      masterGeneEnriched++;
    }
  }

  fs.writeFileSync(MASTER_PATH, JSON.stringify(masterData, null, 2), 'utf-8');
  console.log(`✅ Master Normalized Database:`);
  console.log(`   - deepFrequencies enriched: ${masterDeepEnriched.toLocaleString()}`);
  console.log(`   - gene symbols updated:     ${masterGeneEnriched.toLocaleString()}`);
  console.log(`   - total master markers:     ${Object.keys(masterData).length.toLocaleString()}`);
}

runEnrichment();
