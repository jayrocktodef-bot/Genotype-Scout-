import axios from 'axios';
import fs from 'fs';
import path from 'path';

const INDEX_FILE = './src/data/ancestry/graf_10k_index.json';
const OUTPUT_FILE = './src/data/ancestry/graf_10k_weights.json';

// 26 Sub-populations from 1000 Genomes Project
const TARGET_POPS = [
    'GBR', 'FIN', 'CEU', 'IBS', 'TSI', // Europe
    'YRI', 'LWK', 'GWD', 'MSL', 'ESN', // Africa
    'CHB', 'CHS', 'JPT', 'CDX', 'KHV', // East Asia
    'GIH', 'PJL', 'BEB', 'STU', 'ITU', // South Asia
    'MXL', 'PUR', 'CLM', 'PEL', 'ASW', 'ACB' // Admixed/Americas
];

export async function fetchGrafWeights() {
    console.log('🧬 Starting GRAF 10k weights fetcher...');
    
    if (!fs.existsSync(INDEX_FILE)) {
        console.error('❌ Index file not found at', INDEX_FILE);
        return;
    }

    const index = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
    const rsids = Object.keys(index);
    const total = rsids.length;
    
    console.log(`📊 Found ${total} SNPs to process.`);
    
    let weights: Record<string, Record<string, number>> = {};
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            weights = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
            console.log(`♻️  Resuming from ${Object.keys(weights).length} existing entries.`);
        } catch (e) {
            console.warn('⚠️  Could not parse existing weights file, starting fresh.');
        }
    }

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Process in small batches to respect rate limits
    for (let i = 0; i < total; i++) {
        const rsid = rsids[i];
        if (weights[rsid]) continue; // Skip already fetched

        try {
            console.log(`[${i + 1}/${total}] Fetching ${rsid}...`);
            const response = await axios.get(`https://rest.ensembl.org/variation/human/${rsid}?content-type=application/json&pops=1`);
            
            if (response.status === 200) {
                const data = response.data;
                const popFreqs: Record<string, number> = {};
                
                (data.populations || []).forEach((pop: any) => {
                    const popName = pop.population || '';
                    if (popName.includes('1000GENOMES:phase_3')) {
                        const code = popName.split(':').pop();
                        if (TARGET_POPS.includes(code)) {
                            popFreqs[code] = pop.frequency || 0.0;
                        }
                    }
                });

                if (Object.keys(popFreqs).length > 0) {
                    weights[rsid] = popFreqs;
                }
            }

            // Save progress every 50 SNPs
            if (i % 50 === 0) {
                fs.writeFileSync(OUTPUT_FILE, JSON.stringify(weights, null, 2));
            }

            // Rate limit friendliness
            await delay(100); 

        } catch (error: any) {
            if (error.response?.status === 404) {
                console.warn(`⚠️  ${rsid} not found in Ensembl.`);
            } else if (error.response?.status === 429) {
                console.error('🛑 Rate limited! Cooling down for 5 seconds...');
                await delay(5000);
                i--; // Retry this one
            } else {
                console.error(`❌ Error fetching ${rsid}:`, error.message);
            }
        }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(weights, null, 2));
    console.log(`✅ Success! Data for ${Object.keys(weights).length} SNPs saved to ${OUTPUT_FILE}`);
}

// Allow running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchGrafWeights();
}
