import fs from 'fs';
import path from 'path';
import axios from 'axios';

const markerData = fs.readFileSync('markers.txt', 'utf8');
const allMarkers = markerData.split(',').map(m => m.trim());

async function hydrate() {
  const result: any = {};
  
  for (const rsid of allMarkers) {
    if (!rsid) continue;
    try {
      // Check if it already exists in global.json to avoid re-fetching
      // ... (for now, skip this check for simplicity)

      const resp = await axios.get(`https://rest.ensembl.org/variation/human/${rsid}?pops=1`, {
        headers: { 'Accept': 'application/json' },
        timeout: 5000
      });
      const data = resp.data;
      const populations = data.populations || [];

      const getP = (pName: string) => populations.find((p: any) => p.population.toLowerCase().includes(pName))?.frequency || 0;

      const freqs = {
          AFR: parseFloat(getP('afr')),
          EUR: parseFloat(getP('nfe') || getP('eur')),
          EAS: parseFloat(getP('eas')),
          SAS: parseFloat(getP('sas')),
          AMR: parseFloat(getP('amr')),
      };

      const mena = Math.max(0.001, parseFloat((0.5 * freqs.EUR + 0.3 * freqs.SAS + 0.2 * freqs.AFR).toFixed(4)));
      const oce = Math.max(0.001, parseFloat((0.4 * freqs.EAS + 0.4 * freqs.SAS + 0.2 * freqs.AMR).toFixed(4)));

      const allFreqs = { ...freqs, MENA: mena, OCE: oce };
      
      const freqsArr = Object.values(allFreqs);
      const delta = Math.max(...freqsArr) - Math.min(...freqsArr);
      
      let weight = 2;
      if (delta >= 0.8) weight = 10;
      else if (delta >= 0.6) weight = 8;
      else if (delta >= 0.4) weight = 6;
      else if (delta >= 0.2) weight = 4;
      
      const region = Object.keys(allFreqs).reduce((a, b) => allFreqs[a as keyof typeof allFreqs] > allFreqs[b as keyof typeof allFreqs] ? a : b);
      const regionMap: Record<string, string> = {
          AFR: "African", EUR: "European", EAS: "East Asian", SAS: "South Asian", 
          AMR: "Native American", MENA: "Middle Eastern", OCE: "Oceanian"
      };

      result[rsid] = {
        rsid,
        chromosome: data.mappings?.[0]?.seq_region_name || "Unknown",
        position: data.mappings?.[0]?.start || 0,
        region: regionMap[region] || "European",
        color: "#95A5A6",
        alleles: [data.minor_allele || 'A'],
        frequencies: allFreqs,
        subFrequencies: {},
        deepFrequencies: {},
        weight,
        gene: data.mappings?.[0]?.gene_symbol || "Intergenic",
        trait: "Ancestry",
        description: `Marker associated with ${regionMap[region] || "population"} ancestry.`
      };

      // Progress indication
      process.stdout.write(`Processed ${rsid}\n`);

      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      process.stdout.write(`Skipped ${rsid}\n`);
    }
  }

  process.stdout.write(JSON.stringify(result, null, 1));
}

hydrate();
