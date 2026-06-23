import * as fs from 'fs';
import * as path from 'path';

// GenomicRisk/aeon 1KGP pre-computed allele frequencies
const FREQS_URL = 'https://raw.githubusercontent.com/GenomicRisk/aeon/main/aeon_ancestry/refs/g1k_allele_freqs.txt';

interface StandardAim {
  rsid: string;
  region: string;
  alleles: string[];
  frequencies: Record<string, number>;
  weight: number;
  trait?: string;
}

async function syncGlobalAnchors() {
  try {
    console.log(`🌍 Fetching 1000 Genomes Global Anchor AIMs from: ${FREQS_URL}`);

    const response = await fetch(FREQS_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch anchor data. Status: ${response.status}`);
    }

    console.log(`✅ Success! Data fetched.`);
    const text = await response.text();
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // The first line contains the population headers
    const headers = lines[0].split('\t');
    const populations = headers.slice(4); // CHR, POS, REF, ALT, ...pops

    const POP_CODE_TO_CONTINENT: Record<string, string> = {
      'GBR': 'EUR', 'CEU': 'EUR', 'FIN': 'EUR', 'IBS': 'EUR', 'TSI': 'EUR',
      'YRI': 'AFR', 'LWK': 'AFR', 'GWD': 'AFR', 'MSL': 'AFR', 'ESN': 'AFR', 'ASW': 'AFR', 'ACB': 'AFR',
      'CHB': 'EAS', 'CHS': 'EAS', 'CDX': 'EAS', 'KHV': 'EAS', 'JPT': 'EAS',
      'GIH': 'SAS', 'PJL': 'SAS', 'BEB': 'SAS', 'STU': 'SAS', 'ITU': 'SAS',
      'PUR': 'AMR', 'CLM': 'AMR', 'MXL': 'AMR', 'PEL': 'AMR'
    };

    const anchors: Record<string, any> = {};

    console.log(`📊 Parsing frequencies for ${populations.length} global populations...`);

    // Parse the data lines
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split('\t');
      if (cols.length < populations.length + 4) continue;

      const chrom = cols[0];
      const pos = cols[1];
      const refAllele = cols[2];
      const altAllele = cols[3];
      
      const markerId = `chr${chrom}_${pos}`; 

      const continentalFreqs: Record<string, { sum: number, count: number }> = {};
      const subFreqs: Record<string, number> = {};

      populations.forEach((pop, index) => {
        const freqIndex = index + 4;
        const altFrequency = parseFloat(cols[freqIndex]);
        
        if (!isNaN(altFrequency)) {
          subFreqs[pop] = altFrequency;
          
          const continent = POP_CODE_TO_CONTINENT[pop];
          if (continent) {
            if (!continentalFreqs[continent]) {
              continentalFreqs[continent] = { sum: 0, count: 0 };
            }
            continentalFreqs[continent].sum += altFrequency;
            continentalFreqs[continent].count++;
          }
        }
      });

      const finalFreqs: Record<string, number> = {};
      Object.entries(continentalFreqs).forEach(([continent, data]) => {
        finalFreqs[continent] = Math.round((data.sum / data.count) * 10000) / 10000;
      });

      anchors[markerId] = {
        rsid: markerId,
        region: 'GLOBAL_1GP',
        alleles: [altAllele], 
        frequencies: finalFreqs,
        subFrequencies: Object.fromEntries(
          Object.entries(subFreqs).map(([pop, f]) => [pop, Math.round(f * 10000) / 10000])
        ),
        weight: 1.0,
        significance: 'Medium',
        description: `1KGP Global Ancestry Informative Marker at ${markerId}`
      };
    }

    const outputPath = path.resolve(process.cwd(), 'public/data/1kgp_global_anchors.json');
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Use stringify with no spaces for minimum size
    fs.writeFileSync(outputPath, JSON.stringify(anchors));

    console.log(`✅ Successfully extracted ${Object.keys(anchors).length} Global Anchor AIMs!`);
    console.log(`Output saved to: ${outputPath}`);

  } catch (error) {
    console.error('❌ Extraction Failed:', error);
  }
}

syncGlobalAnchors();
