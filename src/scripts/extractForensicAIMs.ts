import fs from 'fs';
import axios from 'axios';

const MARKER_RAW_URL = 'https://raw.githubusercontent.com/bioforensics/MicroHapDB/master/microhapdb/data/marker.csv';

export async function generateForensicPanel() {
  console.log('🔍 Filtering MicroHapDB for high-Informativeness AIMs...');
  
  try {
    const response = await axios.get(MARKER_RAW_URL);
    const rows = response.data.split('\n');
    
    // Header: Name,Source,Chrom,Start,End,Ae,In...
    const forensicAIMs = rows.slice(1).map((row: string) => {
      const cols = row.split(',');
      if (cols.length < 7) return null;
      return {
        id: cols[0],
        chrom: cols[2],
        start: parseInt(cols[3]),
        end: parseInt(cols[4]),
        ae: parseFloat(cols[5]), // Effective number of alleles
        in: parseFloat(cols[6])  // Informativeness (the true AIM metric)
      };
    })
    .filter((m): m is any => m !== null && !isNaN(m.ae) && !isNaN(m.in))
    // Filter for top-tier AIMs only (Ae > 3.0 and high In)
    .filter(m => m.ae > 3.0 && m.in > 0.3)
    .sort((a, b) => b.in - a.in);

    if (!fs.existsSync('./src/data')) {
      fs.mkdirSync('./src/data', { recursive: true });
    }

    fs.writeFileSync(
      './src/data/forensic_aims.json', 
      JSON.stringify(forensicAIMs.slice(0, 100), null, 2)
    );

    console.log(`✅ Success! Extracted top ${Math.min(forensicAIMs.length, 100)} forensic AIMs.`);
  } catch (error) {
    console.error('❌ Failed to generate forensic panel:', error);
  }
}

// If running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateForensicPanel();
}
