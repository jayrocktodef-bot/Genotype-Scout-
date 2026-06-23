import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

// MicroHapDB Raw URLs (Verified via GitHub API)
const MARKERS_URL = 'https://raw.githubusercontent.com/bioforensics/microhapdb/master/microhapdb/data/marker.csv';
const FREQS_URL = 'https://raw.githubusercontent.com/bioforensics/microhapdb/master/microhapdb/data/frequency.csv.gz';

interface StandardAim {
  rsid: string;
  region: string;
  alleles: string[];
  frequencies: Record<string, number>;
  weight: number;
  trait?: string;
}

async function fetchCsv(url: string): Promise<string[]> {
  console.log(`Fetching: ${url}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  
  let textContent: string;
  if (url.endsWith('.gz')) {
    const buffer = Buffer.from(await response.arrayBuffer());
    textContent = zlib.gunzipSync(buffer).toString();
  } else {
    textContent = await response.text();
  }
  
  return textContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
}

export async function syncMicroHapDB() {
  try {
    console.log('🧬 Starting MicroHapDB Extraction (with Gzip decompression)...');

    const markersCsv = await fetchCsv(MARKERS_URL);
    const freqsCsv = await fetchCsv(FREQS_URL);

    const microHaps: Record<string, StandardAim> = {};

    // Parse Markers (ID, Chromosome, Start, End, etc.)
    // Note: MicroHapDB CSVs use comma separation. Header: ID,Chrom,Start,End,Core,Flank
    markersCsv.slice(1).forEach(line => {
      const cols = line.split(',');
      if (cols.length < 4) return;
      
      const id = cols[0];
      microHaps[id] = {
        rsid: id,
        region: 'GLOBAL',
        alleles: [],
        frequencies: {},
        weight: 1.5,
        trait: 'Forensic Microhaplotype'
      };
    });

    // Parse Frequencies (MarkerID, Population, Haplotype, Frequency)
    // Note: Headers are MarkerID,Population,Haplotype,Frequency
    freqsCsv.slice(1).forEach(line => {
      const cols = line.split(',');
      if (cols.length < 4) return;

      const id = cols[0];
      const pop = cols[1];
      const allele = cols[2];
      const freq = parseFloat(cols[3]);

      if (microHaps[id]) {
        if (!microHaps[id].alleles.includes(allele)) {
          microHaps[id].alleles.push(allele);
        }
        microHaps[id].frequencies[pop] = freq;
      }
    });

    // Save to the raw_aims folder
    const outputPath = path.resolve(process.cwd(), 'src/data/raw_aims/microhap_db.json');
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, JSON.stringify(microHaps, null, 2));

    console.log(`✅ Successfully extracted ${Object.keys(microHaps).length} Microhaplotypes!`);
    console.log(`Output saved to: ${outputPath}`);

  } catch (error) {
    console.error('❌ Extraction Failed:', error);
  }
}

syncMicroHapDB();
