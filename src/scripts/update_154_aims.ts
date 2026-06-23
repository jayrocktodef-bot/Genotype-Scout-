// src/scripts/update_154_aims.ts
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const KIDD_55 = [
  "rs10756819", "rs10958548", "rs1108232", "rs1129038", "rs12203592", "rs12913832",
  "rs13214040", "rs1351394", "rs1426654", "rs1476413", "rs1544325", "rs1617682",
  "rs16891982", "rs17287498", "rs1800407", "rs1927914", "rs2066827", "rs2104511",
  "rs2184030", "rs2238289", "rs2315024", "rs2336873", "rs2395858", "rs2527993",
  "rs2814778", "rs3027440", "rs3122629", "rs3811801", "rs3827760", "rs444326",
  "rs4540055", "rs4821544", "rs4973341", "rs4988235", "rs5006884", "rs5757827",
  "rs6119471", "rs6133167", "rs682", "rs6995436", "rs7041", "rs7131232",
  "rs7251928", "rs738322", "rs7495174", "rs7671167", "rs7739969", "rs8038629",
  "rs849140", "rs8862", "rs910624", "rs9272376", "rs9829807", "rs9883255", "rs9951171"
];

const SELDIN_128 = [
  "rs1008121", "rs10129215", "rs1042531", "rs10484725", "rs10521310", "rs10741285",
  "rs10776839", "rs10862024", "rs10865507", "rs10888503", "rs10931559", "rs11003444",
  "rs11024523", "rs11065987", "rs11083324", "rs11119561", "rs11211843", "rs11612053",
  "rs11618683", "rs11646276", "rs11736767", "rs12048995", "rs12057771", "rs12242137",
  "rs12255743", "rs12411516", "rs12519119", "rs12521575", "rs12543329", "rs12550186",
  "rs12558488", "rs12563300", "rs12702758", "rs12723223", "rs12725178", "rs12752179",
  "rs12771217", "rs12779603", "rs12781443", "rs12913832", "rs13028308", "rs13083697",
  "rs13104680", "rs13115450", "rs13222530", "rs1337424", "rs1351394", "rs1380629",
  "rs1385413", "rs1416952", "rs1418385", "rs1426654", "rs1433857", "rs1454530",
  "rs1459424", "rs1469581", "rs1469584", "rs1481119", "rs1544325", "rs1544983",
  "rs1551607", "rs1569420", "rs1600277", "rs1617682", "rs1617757", "rs1649987",
  "rs167527", "rs16891982", "rs16912386", "rs17132398", "rs17205166", "rs17287498",
  "rs17424610", "rs17441589", "rs1744654", "rs17457788", "rs17631341", "rs17711929",
  "rs17713481", "rs17726590", "rs1800407", "rs1819777", "rs1864195", "rs1878347",
  "rs1880476", "rs1883652", "rs1906252", "rs1927914", "rs2030509", "rs2064239",
  "rs2066827", "rs2071650", "rs2075677", "rs2104511", "rs2120610", "rs2227658",
  "rs2238289", "rs2240751", "rs2243550", "rs2252119", "rs2254425", "rs2268750",
  "rs2286950", "rs2294101", "rs2297127", "rs2336873", "rs2358908", "rs2372580",
  "rs2382813", "rs2395858", "rs2411933", "rs2432968", "rs2438183", "rs2527993",
  "rs2581024", "rs2581030", "rs2610580", "rs2615462", "rs2814778", "rs2814800",
  "rs2855800", "rs2891333", "rs3027440", "rs3122629", "rs346853", "rs3811801",
  "rs3827760", "rs444326"
];

const TARGET_RSIDS = Array.from(new Set([
  "rs1008121", "rs10129215", "rs1042531", "rs10484725", "rs10521310", "rs10741285",
  "rs10756819", "rs10776839", "rs10862024", "rs10865507", "rs10888503", "rs10931559",
  "rs10958548", "rs11003444", "rs11024523", "rs11065987", "rs11083324", "rs11119561",
  "rs11211843", "rs1129038", "rs11612053", "rs11618683", "rs11646276", "rs11736767",
  "rs12048995", "rs12057771", "rs12242137", "rs12255743", "rs12411516", "rs12519119",
  "rs12521575", "rs12543329", "rs12550186", "rs12558488", "rs12563300", "rs12702758",
  "rs12723223", "rs12725178", "rs12752179", "rs12771217", "rs12779603", "rs12781443",
  "rs12913832", "rs13028308", "rs13083697", "rs13104680", "rs13115450", "rs13214040",
  "rs13222530", "rs1337424", "rs1351394", "rs1380629", "rs1385413", "rs1418385",
  "rs1433857", "rs1454530", "rs1459424", "rs1469584", "rs1476413", "rs1481119",
  "rs1544325", "rs1544983", "rs1551607", "rs1569420", "rs1600277", "rs1617682",
  "rs1617757", "rs1649987", "rs167527", "rs16912386", "rs17132398", "rs17205166",
  "rs17287498", "rs17424610", "rs17441589", "rs1744654", "rs17457788", "rs17631341",
  "rs17711929", "rs17713481", "rs17726590", "rs1800407", "rs1819777", "rs1864195",
  "rs1878347", "rs1880476", "rs1883652", "rs1906252", "rs1927914", "rs2030509",
  "rs2064239", "rs2066827", "rs2071650", "rs2075677", "rs2104511", "rs2120610",
  "rs2184030", "rs2227658", "rs2238289", "rs2240751", "rs2243550", "rs2252119",
  "rs2254425", "rs2268750", "rs2286950", "rs2294101", "rs2297127", "rs2315024",
  "rs2336873", "rs2358908", "rs2372580", "rs2382813", "rs2395858", "rs2411933",
  "rs2432968", "rs2438183", "rs2527993", "rs2581024", "rs2581030", "rs2610580",
  "rs2615462", "rs2814778", "rs2814800", "rs2855800", "rs2891333", "rs3027440",
  "rs3122629", "rs346853", "rs444326", "rs4540055", "rs4821544", "rs4973341",
  "rs4988235", "rs5006884", "rs5757827", "rs6119471", "rs6133167", "rs682",
  "rs6995436", "rs7041", "rs7131232", "rs7251928", "rs738322", "rs7495174",
  "rs7671167", "rs7739969", "rs8038629", "rs849140", "rs8862", "rs910624",
  "rs9272376", "rs9829807", "rs9883255", "rs9951171"
]));

const POP_MAP: Record<string, string> = {
  'YRI': 'Yoruba',
  'LWK': 'Luhya',
  'GWD': 'Gambian',
  'MSL': 'Mende',
  'ESN': 'Esan',
  'ASW': 'African Ancestry SW US',
  'ACB': 'African Caribbean',
  'MXL': 'Mexican Ancestry',
  'PUR': 'Puerto Rican',
  'PEL': 'Peruvian',
  'CLM': 'Colombian',
  'CHB': 'Han Chinese',
  'JPT': 'Japanese',
  'CHS': 'Southern Han',
  'CDX': 'Chinese Dai',
  'KHV': 'Kinh Vietnamese',
  'CEU': 'NW European',
  'TSI': 'Tuscan',
  'FIN': 'Finnish',
  'GBR': 'British',
  'IBS': 'Iberian',
  'GIH': 'Gujarati Indian',
  'PJL': 'Punjabi',
  'BEB': 'Bengali',
  'STU': 'Sri Lankan Tamil',
  'ITU': 'Indian Telugu'
};

const SPEC_METADATA: Record<string, { gene: string, trait: string, description: string }> = {
  "rs1129038": {
    "gene": "SLC14A2",
    "trait": "African Ancestry Marker",
    "description": "A variant common in West African ancestry and linked to physiological adaptation."
  },
  "rs2814778": {
    "gene": "ACKR1",
    "trait": "Duffy Null Allele (Malaria Resistance)",
    "description": "The Duffy Null variant provides high-resistance adaptation against vivax malaria; it is nearly fixed in African lineages compared to others."
  },
  "rs12913832": {
    "gene": "HERC2",
    "trait": "Ancestral Pigmentation Marker",
    "description": "A chief HERC2 enhancer variant and strong European pigmentary marker driving light-pigment hair and blue eyes."
  },
  "rs1800407": {
    "gene": "OCA2",
    "trait": "African Pigmentation Marker",
    "description": "An OCA2 pigmentation marker whose ancestral alleles are primarily found in sub-Saharan populations."
  },
  "rs4988235": {
    "gene": "MCM6/LCT",
    "trait": "Lactase Persistence",
    "description": "Variant regulating adult lactase production, highly common in historic European dairy communities."
  },
  "rs6119471": {
    "gene": "ASIP",
    "trait": "Hair/skin color",
    "description": "Variant in the ASIP gene driving pigmentation variation across Eurasian populations."
  },
  "rs7495174": {
    "gene": "OCA2",
    "trait": "Pimentation Variant",
    "description": "Pigmentary lineage modifier variant in the OCA2 gene."
  }
};

async function run() {
  console.log("🧬 Starting Commercial AIMs synchronization script...");

  // Files
  const weightsFile = path.join(process.cwd(), 'src', 'data', 'raw_aims', 'commercial_aim_weights.json');
  const masterFile = path.join(process.cwd(), 'src', 'data', 'master_aims_normalized.json');
  const cacheFile = path.join(process.cwd(), 'src', 'data', 'raw_aims', 'ensembl_154_cache.json');

  if (!fs.existsSync(weightsFile)) {
    console.error("❌ Cannot find commercial_aim_weights.json. Please ensure it exists.");
    process.exit(1);
  }

  if (!fs.existsSync(masterFile)) {
    console.error("❌ Cannot find master_aims_normalized.json. Please ensure it exists.");
    process.exit(1);
  }

  const weights = JSON.parse(fs.readFileSync(weightsFile, 'utf8'));
  const master = JSON.parse(fs.readFileSync(masterFile, 'utf8'));

  // Load cache
  let cache: Record<string, any> = {};
  if (fs.existsSync(cacheFile)) {
    cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  }

  console.log(`Loaded ${TARGET_RSIDS.length} target rsIDs.`);
  console.log(`Loaded ${Object.keys(cache).length} cached entries from local Ensembl cache.`);

  const updatedEntries: Record<string, any> = {};

  for (let idx = 0; idx < TARGET_RSIDS.length; idx++) {
    const rsid = TARGET_RSIDS[idx];
    const item = weights[rsid];

    if (!item) {
      console.warn(`⚠️ Warning: rsID ${rsid} not found in commercial_aim_weights.json!`);
      continue;
    }

    // Collapse Freqs
    const afrVal = (item.YRI + item.LWK + item.GWD + item.MSL + item.ESN + item.ACB + item.ASW) / 7;
    const eurVal = (item.CEU + item.GBR + item.FIN + item.TSI + item.IBS) / 5;
    const easVal = (item.CHB + item.CHS + item.CDX + item.KHV + item.JPT) / 5;
    const sasVal = (item.GIH + item.PJL + item.BEB + item.STU + item.ITU) / 5;
    const amrVal = (item.MXL + item.PUR + item.CLM + item.PEL) / 4;

    // Region Selection based on most extreme deviation
    const pops = [
      { code: "AFR", value: afrVal, region: "African" },
      { code: "EUR", value: eurVal, region: "European" },
      { code: "EAS", value: easVal, region: "East Asian" },
      { code: "SAS", value: sasVal, region: "South Asian" },
      { code: "AMR", value: amrVal, region: "Native American" }
    ];

    let maxDev = -1;
    let extremePop = pops[0];
    for (let i = 0; i < pops.length; i++) {
      const v = pops[i].value;
      const others = pops.filter((_, idx) => idx !== i).map(p => p.value);
      const avgOthers = others.reduce((s, x) => s + x, 0) / others.length;
      const dev = Math.abs(v - avgOthers);
      if (dev > maxDev) {
        maxDev = dev;
        extremePop = pops[i];
      }
    }

    const assignedRegion = extremePop.region;

    // Weight selection based on max delta
    const minFreq = Math.min(afrVal, eurVal, easVal, sasVal, amrVal);
    const maxFreq = Math.max(afrVal, eurVal, easVal, sasVal, amrVal);
    const maxDelta = maxFreq - minFreq;

    let assignedWeight = 2;
    if (maxDelta >= 0.8) assignedWeight = 10;
    else if (maxDelta >= 0.6) assignedWeight = 8;
    else if (maxDelta >= 0.4) assignedWeight = 6;
    else if (maxDelta >= 0.2) assignedWeight = 4;
    else assignedWeight = 2;

    // Subfrequencies
    const subFrequencies: Record<string, number> = {};
    for (const [pCode, pFreq] of Object.entries(item)) {
      if (POP_MAP[pCode]) {
        subFrequencies[POP_MAP[pCode]] = parseFloat((pFreq as number).toFixed(4));
      }
    }

    // Live query ensembl if not cached
    let ensemblData = cache[rsid];
    if (!ensemblData) {
      console.log(`🌐 Fetching variation details from Ensembl for ${rsid} (${idx + 1}/${TARGET_RSIDS.length})...`);
      try {
        const res = await axios.get(`https://rest.ensembl.org/variation/human/${rsid}?content-type=application/json`);
        ensemblData = res.data;
        cache[rsid] = dataTrim(ensemblData);
        // Write interval cache to prevent data loss on crash
        fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
        await new Promise(r => setTimeout(r, 120)); // rate limit polite delay
      } catch (e: any) {
        console.error(`❌ Failed variation call for ${rsid}: ${e.message}`);
      }
    }

    // Determine alleles, ref, alt
    let ref = "A";
    let alt = "G";
    if (ensemblData) {
      const mappings = ensemblData.mappings || [];
      const primaryMapping = mappings.find((m: any) => m.assembly_name === "GRCh38") || mappings[0];
      if (primaryMapping) {
        ref = primaryMapping.ancestral_allele || "";
        const allele_string = primaryMapping.allele_string || "";
        const parts = allele_string.split('/');
        if (ref) {
          const rem = parts.filter((p: string) => p !== ref);
          alt = rem.length > 0 ? rem[0] : (ref === "A" ? "G" : "A");
        } else if (parts.length >= 2) {
          ref = parts[0];
          alt = parts[1];
        }
      } else if (ensemblData.minor_allele) {
        alt = ensemblData.minor_allele;
        ref = alt === "A" ? "G" : "A";
      }
    }

    // Fallback cleanup if ref is empty string
    if (!ref) ref = "A";
    if (!alt) alt = "G";

    // Known metadata
    const meta = SPEC_METADATA[rsid] || {
      gene: "",
      trait: "Ancestry",
      description: `Ancestry Informative Marker (AIM) from the ${
        KIDD_55.includes(rsid) ? "Kidd-55" : "Seldin-128"
      } genomic panel, facilitating regional substructure refinement.`
    };

    // Construct record
    const chromosome = ensemblData?.mappings?.[0]?.seq_region_name || master[rsid]?.chromosome || "Unknown";
    const position = ensemblData?.mappings?.[0]?.start || master[rsid]?.position || 0;

    const entry = {
      rsid: rsid,
      chromosome: chromosome,
      position: position,
      region: assignedRegion,
      color: "#95A5A6",
      alleles: [ref],
      ref: ref,
      alt: alt,
      frequencies: {
        AFR: parseFloat(afrVal.toFixed(4)),
        EUR: parseFloat(eurVal.toFixed(4)),
        EAS: parseFloat(easVal.toFixed(4)),
        AMR: parseFloat(amrVal.toFixed(4)),
        SAS: parseFloat(sasVal.toFixed(4)),
        MENA: 0.0,
        OCE: 0.0
      },
      subFrequencies: subFrequencies,
      deepFrequencies: {},
      weight: assignedWeight,
      gene: meta.gene,
      trait: meta.trait,
      description: meta.description
    };

    updatedEntries[rsid] = entry;
  }

  // Inject into master file
  let mutated = 0;
  for (const [rsid, entry] of Object.entries(updatedEntries)) {
    master[rsid] = {
      ...master[rsid],
      ...entry
    };
    mutated++;
  }

  fs.writeFileSync(masterFile, JSON.stringify(master, null, 2));
  console.log(`\n🎉 Processed ${mutated} commercial SNPs successfully.`);
  console.log(`Saved updated entries of ${mutated} SNPs to ${masterFile}.`);
  console.log(`All operations finalized successfully.`);
}

// Minimal trim to keep cached size compact
function dataTrim(d: any) {
  if (!d) return null;
  return {
    mappings: d.mappings?.map((m: any) => ({
      assembly_name: m.assembly_name,
      ancestral_allele: m.ancestral_allele,
      allele_string: m.allele_string,
      seq_region_name: m.seq_region_name,
      start: m.start
    })) || [],
    minor_allele: d.minor_allele
  };
}

run();
