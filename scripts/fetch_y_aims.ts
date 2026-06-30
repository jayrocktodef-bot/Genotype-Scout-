import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchYChromosomeAIMs() {
  console.log('🧬 Fetching Y-chromosome variations from Ensembl...');
  
  const regions = [
    'Y:2000000..6000000',
    'Y:6000000..10000000',
    'Y:10000000..14000000',
    'Y:14000000..18000000',
    'Y:18000000..22000000'
  ];
  
  const allRsids = new Set<string>();
  
  for (const region of regions) {
    try {
      const res = await fetch(`https://rest.ensembl.org/overlap/region/human/${region}?feature=variation`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) continue;
      const data = await res.json() as any[];
      if (!Array.isArray(data)) continue;
      for (const item of data) {
        if (item.id && item.id.startsWith('rs') && !item.id.includes(':')) {
          allRsids.add(item.id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  
  const rsidsList = Array.from(allRsids);
  console.log(`🔍 Found ${rsidsList.length} candidate Y rsIDs.`);
  
  const superPopMapping: Record<string, string> = {
    'ACB': 'AFR', 'ASW': 'AFR', 'ESN': 'AFR', 'GWD': 'AFR', 'LWK': 'AFR', 'MSL': 'AFR', 'YRI': 'AFR', 'AFR': 'AFR',
    'CEU': 'EUR', 'FIN': 'EUR', 'GBR': 'EUR', 'IBS': 'EUR', 'TSI': 'EUR', 'EUR': 'EUR',
    'CDX': 'EAS', 'CHB': 'EAS', 'CHS': 'EAS', 'JPT': 'EAS', 'KHV': 'EAS', 'EAS': 'EAS',
    'BEB': 'SAS', 'GIH': 'SAS', 'ITU': 'SAS', 'PJL': 'SAS', 'STU': 'SAS', 'SAS': 'SAS',
    'CLM': 'AMR', 'MXL': 'AMR', 'PEL': 'AMR', 'PUR': 'AMR', 'AMR': 'AMR'
  };
  
  const aims: any[] = [];
  const batchSize = 200;
  
  for (let i = 0; i < Math.min(rsidsList.length, 1000); i += batchSize) {
    const batch = rsidsList.slice(i, i + batchSize);
    await new Promise(r => setTimeout(r, 250));
    
    try {
      const res = await fetch('https://rest.ensembl.org/variation/human?population_genotypes=1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ ids: batch })
      });
      if (!res.ok) continue;
      const results = await res.json() as Record<string, any>;
      
      for (const [rsid, details] of Object.entries(results)) {
        if (!details || !details.mappings || !details.mappings[0]) continue;
        const mapping = details.mappings[0];
        if (mapping.seq_region_name !== 'Y') continue;
        
        const ancestralAllele = mapping.ancestral_allele || mapping.allele_string.split('/')[0];
        const parts = mapping.allele_string.split('/');
        const altAllele = parts.find(p => p !== ancestralAllele) || parts[1];
        if (!altAllele) continue;
        
        const popGeno = details.population_genotypes || [];
        if (popGeno.length === 0) continue;
        
        const superPopData: Record<string, { alt: number; tot: number }> = {
          AFR: { alt: 0, tot: 0 },
          EUR: { alt: 0, tot: 0 },
          EAS: { alt: 0, tot: 0 },
          SAS: { alt: 0, tot: 0 },
          AMR: { alt: 0, tot: 0 }
        };
        
        popGeno.forEach((g: any) => {
          const popName = g.population || '';
          if (!popName.startsWith('1000GENOMES:phase_3:')) return;
          const popCode = popName.replace('1000GENOMES:phase_3:', '');
          const superCode = superPopMapping[popCode];
          if (!superCode) return;
          
          const genotype = g.genotype || '';
          const count = g.count || 0;
          const gParts = genotype.split(/[|/]/);
          
          let altCountInGenotype = 0;
          gParts.forEach(a => { if (a === altAllele) altCountInGenotype++; });
          
          superPopData[superCode].alt += altCountInGenotype * count;
          superPopData[superCode].tot += gParts.length * count;
        });
        
        const freqs: Record<string, number> = {};
        let validPops = 0;
        
        Object.entries(superPopData).forEach(([pop, data]) => {
          if (data.tot > 0) {
            freqs[pop] = data.alt / data.tot;
            validPops++;
          }
        });
        
        if (validPops < 5) continue;
        
        const freqValues = Object.values(freqs);
        const maxFreq = Math.max(...freqValues);
        const minFreq = Math.min(...freqValues);
        const delta = maxFreq - minFreq;
        
        if (delta >= 0.25) { // Threshold for Y chromosome markers
          aims.push({
            rsid,
            chromosome: 'Y',
            position: mapping.start,
            region: 'Global',
            ref: ancestralAllele,
            alt: altAllele,
            alleles: [altAllele],
            frequencies: freqs,
            weight: parseFloat((delta * 5).toFixed(1)),
            description: `Y-chromosomal ancestry informative marker (delta = ${delta.toFixed(2)})`
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  
  console.log(`✅ Found ${aims.length} high-quality Y-chromosomal AIMs!`);
  if (aims.length >= 5) { // Require at least 5 AIMs to be written
    const outputPath = path.resolve(__dirname, '../src/data/raw_aims/y_chromosome_aims.json');
    fs.writeFileSync(outputPath, JSON.stringify(aims, null, 2));
    console.log(`💾 Saved Y-chromosomal AIMs to ${outputPath}`);
    process.exit(0);
  } else {
    console.warn('⚠️ Found less than 5 AIMs. Skipping save to protect current file.');
    process.exit(1);
  }
}

fetchYChromosomeAIMs();
