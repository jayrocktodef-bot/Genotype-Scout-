const fs = require('fs');
const path = require('path');

const AIMS_DIR = path.join(__dirname, '../src/data/aims');
const FILES_TO_PROCESS = [
  'african.json', 'african_american.json', 'central_asian.json',
  'east_asian.json', 'european.json', 'global.json',
  'middle_eastern.json', 'native_american.json', 'north_african.json',
  'oceanian.json', 'south_asian.json'
];

const popMap = {
  '1000GENOMES:phase_3:AFR': 'AFR',
  '1000GENOMES:phase_3:AMR': 'AMR',
  '1000GENOMES:phase_3:EAS': 'EAS',
  '1000GENOMES:phase_3:EUR': 'EUR',
  '1000GENOMES:phase_3:SAS': 'SAS'
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchEnsembl(ids) {
  const res = await fetch('https://rest.ensembl.org/variation/homo_sapiens?pops=1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ ids })
  });

  if (res.status === 429) {
    const retryAfter = res.headers.get('retry-after') || 1;
    throw { status: 429, retryAfter: parseFloat(retryAfter) };
  }
  
  if (!res.ok) {
    // some IDs might be invalid, try fetching one by one if 400?
    // Actually Ensembl 400 means "Bad Request", likely one of the IDs is not found.
    // If we get 400, we just return empty so we skip.
    return {};
  }

  return await res.json();
}

async function main() {
  for (const file of FILES_TO_PROCESS) {
    const filePath = path.join(AIMS_DIR, file);
    if (!fs.existsSync(filePath)) continue;
    
    console.log(`Processing ${file}...`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const missingKeys = Object.keys(data).filter(k => {
      const entry = data[k];
      const noAlleles = !entry.alleles || entry.alleles.length === 0;
      const noFreqs = !entry.frequencies || Object.keys(entry.frequencies).length === 0;
      const noPos = !entry.chromosome || entry.chromosome === 'Unknown' || entry.position === undefined;
      return noAlleles || noFreqs || noPos;
    });

    console.log(`Found ${missingKeys.length} markers missing data in ${file}.`);

    const BATCH_SIZE = 100;
    for (let i = 0; i < missingKeys.length; i += BATCH_SIZE) {
      const batchKeys = missingKeys.slice(i, i + BATCH_SIZE);
      const batchIds = batchKeys.map(k => k.split('_')[0]);
      const uniqueIds = [...new Set(batchIds)];

      let response = null;
      try {
        response = await fetchEnsembl(uniqueIds);
      } catch (e) {
        if (e.status === 429) {
          console.log(`Rate limited. Waiting ${e.retryAfter}s...`);
          await sleep((e.retryAfter + 1) * 1000);
          response = await fetchEnsembl(uniqueIds).catch(() => ({}));
        } else {
          console.error('Error fetching batch:', e);
        }
      }

      if (!response || Object.keys(response).length === 0) {
        console.log(`Batch ${i/BATCH_SIZE + 1} skipped or failed (possibly some invalid RSIDs)`);
        continue;
      }

      let updatedCount = 0;
      for (const key of batchKeys) {
        const rsid = key.split('_')[0];
        const ensemblData = response[rsid];
        
        if (ensemblData) {
          const entry = data[key];
          
          if (ensemblData.mappings && ensemblData.mappings.length > 0) {
            const mapping = ensemblData.mappings[0];
            entry.chromosome = mapping.seq_region_name;
            entry.position = mapping.start;
          }

          const freqs = {};
          if (ensemblData.populations) {
            for (const pop of ensemblData.populations) {
              const mappedPop = popMap[pop.population];
              if (mappedPop) {
                if (!freqs[pop.allele]) freqs[pop.allele] = {};
                freqs[pop.allele][mappedPop] = pop.frequency;
              }
            }
          }

          const alleles = Object.keys(freqs);
          if (alleles.length > 0) {
             if (!entry.alleles || entry.alleles.length === 0) {
                 entry.alleles = [alleles[0]];
             }
             const target = entry.alleles[0];
             if (freqs[target]) {
                if (!entry.frequencies) entry.frequencies = {};
                for (const p in freqs[target]) {
                    entry.frequencies[p] = freqs[target][p];
                }
             }
          }
          updatedCount++;
        }
      }
      
      console.log(`Updated ${updatedCount} markers in batch ${i/BATCH_SIZE + 1}.`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      await sleep(100);
    }
  }
  console.log("Hydration complete!");
}

main().catch(console.error);
