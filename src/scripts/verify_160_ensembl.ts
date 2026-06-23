import fs from 'fs';
import path from 'path';
import axios from 'axios';

const TARGET_RSIDS = [
  "rs10456200", "rs10456201", "rs10456202", "rs10456203", "rs10456204", "rs10456205", "rs10456206", "rs10456207", "rs10456209", "rs10456210", "rs10456212", "rs10456213", "rs10456215", "rs10456216", "rs10456217", "rs10456218", "rs10456219", "rs10456220", "rs10456221", "rs10456222", "rs10456223", "rs10456224", "rs10456225", "rs10456226", "rs10456227", "rs10456228", "rs10456229", "rs10456230", "rs10456231", "rs10456232", "rs10456233", "rs10456234", "rs10456235", "rs10456236", "rs10456237", "rs10456238", "rs10456239", "rs10456240", "rs10456241", "rs10456242", "rs10456243", "rs10456244", "rs10456245", "rs10456247", "rs10456248", "rs10456249", "rs10456252", "rs10456254", "rs10456256", "rs10456257", "rs10456258", "rs10456259", "rs10456260", "rs10456261", "rs10456262", "rs10456263", "rs10456265", "rs10456266", "rs10456267", "rs10456268", "rs10456269", "rs10456271", "rs10456291", "rs10456293", "rs10456294", "rs10456295", "rs10456296", "rs10456297", "rs10456298", "rs10456299", "rs10456300", "rs10456301", "rs10456302", "rs10456303", "rs10456304", "rs10456305", "rs10456306", "rs10456308", "rs10456309", "rs10456310", "rs10456311", "rs10456312", "rs10456313", "rs10456314", "rs10456315", "rs10456316", "rs10456317", "rs10456318", "rs10456319", "rs10456320", "rs10456321", "rs10456322", "rs10456323", "rs10456324", "rs10456325", "rs10456326", "rs10456327", "rs10456328", "rs10456329", "rs10456330", "rs10456331", "rs10456332", "rs10456333", "rs10456334", "rs10456335", "rs10456336", "rs10456337", "rs10456338", "rs10456339", "rs10456340", "rs10456341", "rs10456342", "rs10456343", "rs10456344", "rs10456345", "rs10456346", "rs10456347", "rs10456348", "rs10456349", "rs10456350", "rs10456351", "rs10456352", "rs10456353", "rs10456354", "rs10456355", "rs10456356", "rs10456357", "rs10456358", "rs10456359", "rs10456360", "rs10456361", "rs10456362", "rs10456363", "rs10456364", "rs10456365", "rs10456366", "rs10456367", "rs10456368", "rs10456369", "rs10456370", "rs10456371", "rs10456388", "rs10456389", "rs10456391", "rs10456393", "rs10456396", "rs10456399", "rs10456401", "rs10456402", "rs10456403", "rs10456404", "rs10456405", "rs10456408", "rs10456409", "rs10456410", "rs10456418", "rs10456419", "rs10456421", "rs10456422", "rs10456423", "rs10456425", "rs10456426", "rs10456444"
];

async function run() {
  console.log(`Starting Ensembl confirmation of ${TARGET_RSIDS.length} target rsIDs...`);
  
  // Ensembl accepts POST up to 1000 IDs
  const ensemblResults: Record<string, any> = {};
  
  // Slice into two batches of 85 to be ultra-safe and polite
  const batch1 = TARGET_RSIDS.slice(0, 85);
  const batch2 = TARGET_RSIDS.slice(85);
  
  const queryBatch = async (batch: string[]) => {
    try {
      const response = await axios.post('https://rest.ensembl.org/variation/human', {
        ids: batch
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      Object.assign(ensemblResults, response.data);
    } catch (e: any) {
      console.error(`Error querying batch: ${e.message}`);
    }
  };
  
  console.log(`Sending batch 1 (size ${batch1.length})...`);
  await queryBatch(batch1);
  await new Promise(r => setTimeout(r, 200));
  
  console.log(`Sending batch 2 (size ${batch2.length})...`);
  await queryBatch(batch2);
  
  console.log(`Fetched ${Object.keys(ensemblResults).length} results from Ensembl.`);
  
  const masterPath = path.join(process.cwd(), 'src', 'data', 'master_aims_normalized.json');
  const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

  const finalOutput: any[] = [];
  let validCount = 0;
  let invalidCount = 0;
  
  for (const rsid of TARGET_RSIDS) {
    const fetched = ensemblResults[rsid];
    const exists = !!fetched;
    
    // Check Round Freqs
    const masterItem = master[rsid] || {};
    const frequencies = masterItem.frequencies || {};
    
    // Fabrication rules:
    // Some mock frequencies look like exactly 0.95, 0.05, 0.01 etc. Let's see if numbers are very rounded
    let isRound = false;
    if (Object.keys(frequencies).length > 0) {
      isRound = Object.values(frequencies).every((v: any) => {
        const str = String(v);
        // check if it's rounded (e.g. 1 decimal digit or standard round numbers)
        const val = parseFloat(v);
        if (isNaN(val)) return false;
        // check if 2 decimal places or less and ends in 5 or 0
        const rounded = parseFloat(val.toFixed(2));
        return val === rounded && (Math.round(val * 100) % 5 === 0 || Math.round(val * 100) % 10 === 0);
      });
    }

    if (exists) {
      validCount++;
      const mappings = fetched.mappings || [];
      const primary = mappings.find((m: any) => m.assembly_name === 'GRCh38' && m.coord_system === 'chromosome') || mappings[0] || {};
      
      const chr = primary.seq_region_name || "Unknown";
      const pos = primary.start || 0;
      const ancestral = primary.ancestral_allele || "";
      const allele_string = primary.allele_string || "A/G";
      const parts = allele_string.split('/');
      const ref = ancestral || parts[0] || "A";
      const alt = parts.find((p: string) => p !== ref) || "G";
      
      finalOutput.push({
        rsid,
        status: "VALID",
        chromosome: chr,
        position: pos,
        gene: masterItem.gene || fetched.most_severe_consequence || "Unknown",
        alleles: `${ref}/${alt}`,
        roundFreqs: isRound ? "ROUND_FREQS" : "OK",
        description: masterItem.description || ""
      });
    } else {
      invalidCount++;
      finalOutput.push({
        rsid,
        status: "INVALID",
        roundFreqs: isRound ? "ROUND_FREQS" : "OK",
        description: masterItem.description || "",
        frequencies: frequencies
      });
    }
  }
  
  fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'validation_160_ensembl.json'), JSON.stringify(finalOutput, null, 2));
  console.log(`\n🎉 Completed validation! Valid: ${validCount}, Invalid: ${invalidCount}. Saved to src/data/validation_160_ensembl.json`);
}

run();
