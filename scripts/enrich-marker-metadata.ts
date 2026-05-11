
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const SNPS_FILE = path.join(process.cwd(), 'src', 'data', 'reference', 'snps.json');

interface SNP {
  markerId: string;
  rsid: string;
  gene: string;
  trait: string;
  continent: string;
  category: string;
  significance: string;
  alleles: string[];
  description: string;
  referenceUrl: string;
}

const SUPERPOP_TO_REGION: Record<string, string> = {
  'EUR': 'European',
  'AFR': 'African',
  'EAS': 'East Asian',
  'AMR': 'American',
  'SAS': 'South Asian'
};

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function enrichMarkers() {
  console.log("🧬 Starting Marker Metadata Enrichment...");

  if (!fs.existsSync(SNPS_FILE)) {
    console.error(`File not found: ${SNPS_FILE}`);
    return;
  }

  const snps: SNP[] = JSON.parse(fs.readFileSync(SNPS_FILE, 'utf-8'));
  
  // Filter for markers needing enrichment
  // Using 'continent' to match the file's schema, but checking 'Global' as requested
  const toEnrich = snps.filter(s => s.continent === 'Global' || s.gene === 'Unknown' || s.description.includes('Unknown'));
  
  console.log(`🔍 Found ${toEnrich.length} markers to enrich.`);

  let enrichedCount = 0;
  const MAX_BATCH = 50;

  for (let i = 0; i < toEnrich.length && enrichedCount < MAX_BATCH; i++) {
    const snp = toEnrich[i];
    const rsid = snp.rsid || snp.markerId;

    if (!rsid.startsWith('rs')) {
       console.log(`Skipping non-rsID: ${rsid}`);
       continue;
    }

    try {
      console.log(`[${i+1}/${toEnrich.length}] Querying Ensembl for ${rsid}...`);
      const response = await axios.get(`https://rest.ensembl.org/variation/human/${rsid}?content-type=application/json&pops=1`, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      const data = response.data;
      
      // 1. Extract Gene
      if (snp.gene === 'Unknown' || !snp.gene) {
        const transcripts = data.transcript_consequences || [];
        const geneMatch = transcripts.find((t: any) => t.gene_symbol);
        if (geneMatch) {
          snp.gene = geneMatch.gene_symbol;
          console.log(`   Mapped gene: ${snp.gene}`);
        }
      }

      // 2. Extract Continent (Highest frequency 1000G Superpop)
      if (snp.continent === 'Global') {
        const populations = data.populations || [];
        let maxFreq = -1;
        let bestPop = '';

        populations.forEach((p: any) => {
          // Look for 1000GENOMES:phase_3:XXX
          const match = p.population.match(/1000GENOMES:phase_3:([A-Z]{3})/);
          if (match) {
            const superpop = match[1];
            if (SUPERPOP_TO_REGION[superpop] && p.frequency > maxFreq) {
              maxFreq = p.frequency;
              bestPop = superpop;
            }
          }
        });

        if (bestPop) {
          snp.continent = SUPERPOP_TO_REGION[bestPop];
          console.log(`   Mapped continent: ${snp.continent} (${bestPop} @ ${maxFreq})`);
        }
      }

      enrichedCount++;
      
      // Save every 10 updates to be safe
      if (enrichedCount % 10 === 0) {
        fs.writeFileSync(SNPS_FILE, JSON.stringify(snps, null, 2));
      }

      // Rate limiting: Ensembl recommends not more than 15 requests per second
      await sleep(200); 

    } catch (error: any) {
      if (error.response?.status === 429) {
        console.warn("⚠️ Rate limit hit. Waiting 5 seconds...");
        await sleep(5000);
        i--; // Retry
      } else if (error.response?.status === 404) {
        console.warn(`❌ Marker ${rsid} not found in Ensembl.`);
      } else {
        console.error(`Error fetching ${rsid}:`, error.message);
      }
    }
  }

  // Final Save
  fs.writeFileSync(SNPS_FILE, JSON.stringify(snps, null, 2));
  console.log(`✅ Enrichment complete. Updated ${enrichedCount} markers.`);
}

enrichMarkers();
