import fs from 'fs';
import path from 'path';
import axios from 'axios';

const markers = [
  "rs1129038", "rs2814778", "rs12913832", "rs1800407", "rs1042602"
];

async function fetchAndFormat() {
  const result: any = {};

  for (const rsid of markers) {
    try {
      const resp = await axios.get(`https://rest.ensembl.org/variation/human/${rsid}?pops=1`, {
        headers: { 'Accept': 'application/json' },
        timeout: 5000
      });
      const data = resp.data;
      const populations = data.populations || [];

      // Mapping helpers
      const getFreq = (popSubstrings: string[]) => {
        const p = populations.find((p: any) => 
            popSubstrings.some(s => p.population.toLowerCase().includes(s))
        );
        return p ? parseFloat(parseFloat(p.frequency).toFixed(4)) : 0.0;
      };

      const frequencies = {
        AFR: getFreq(['afr']),
        EUR: getFreq(['nfe', 'eur']),
        EAS: getFreq(['eas']),
        SAS: getFreq(['sas']),
        AMR: getFreq(['amr']),
        MENA: getFreq(['mid', 'nfe_nwe']),
        OCE: 0.1 // Estimation
      };

      const freqsArr = Object.values(frequencies);
      const delta = Math.max(...freqsArr) - Math.min(...freqsArr);
      let weight = 2;
      if (delta >= 0.8) weight = 10;
      else if (delta >= 0.6) weight = 8;
      else if (delta >= 0.4) weight = 6;
      else if (delta >= 0.2) weight = 4;

      // Determine region
      const maxFreq = Math.max(...freqsArr);
      const popKeys = Object.keys(frequencies);
      let maxPop = popKeys[freqsArr.indexOf(maxFreq)];
      const regionMap: Record<string, string> = {
        AFR: "African", EUR: "European", EAS: "East Asian", SAS: "South Asian", 
        AMR: "Native American", MENA: "Middle Eastern", OCE: "Oceanian"
      };

      result[rsid] = {
        rsid,
        region: regionMap[maxPop] || "European",
        color: "#95A5A6",
        alleles: [data.minor_allele || 'A'],
        frequencies,
        subFrequencies: {},
        deepFrequencies: {},
        weight,
        gene: data.most_severe_consequence === "intergenic_variant" ? "Intergenic" : (data.mappings?.[0]?.gene_symbol || "Intergenic"),
        trait: "Ancestry",
        description: `Marker associated with ${regionMap[maxPop]} ancestry distribution.`
      };

      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      result[rsid] = { "SKIP": true, "reason": "Failed to resolve or fetch" };
    }
  }

  process.stdout.write(JSON.stringify(result, null, 1));
}

fetchAndFormat();
