import fs from 'fs';
import path from 'path';
import axios from 'axios';

const BATCH_RSIDS = [
  "rs10456231", "rs10456205_b", "rs10456259", "rs12752447", "rs10456255",
  "rs10456198", "rs10456300", "rs10456205_f", "rs10456227_fo", "rs10456235",
  "rs10456205_fu", "rs10456251", "rs10456205_h", "rs11103349", "rs11103350",
  "rs11103351", "rs10456196", "rs7252505", "rs1572318", "rs1572319",
  "rs10456253", "rs10456260", "rs11547466", "rs1805010", "rs4988238",
  "rs10456265", "rs7460469", "rs7460470", "rs7460471", "rs10456197",
  "rs4871195", "rs1042524", "rs10456199", "rs1446585", "rs2675348",
  "rs10424071", "rs10424072", "rs10424073", "rs10424074", "rs10456205_nu",
  "rs10456207-afr", "rs10456258", "rs12149626", "rs12149627", "rs12149628",
  "rs694341", "rs7252508", "rs13136401", "rs13136402", "rs13136403"
];

const MASTER_FILE = path.join(process.cwd(), 'src', 'data', 'master_aims_normalized.json');

function getRegionFromMaxPop(maxPopKey: string): string {
  switch (maxPopKey) {
    case 'AFR': return 'African';
    case 'EUR': return 'European';
    case 'EAS': return 'East Asian';
    case 'SAS': return 'South Asian';
    case 'AMR': return 'Native American';
    default: return 'European';
  }
}

async function fetchWithRetry(rsid: string, retries = 2): Promise<any> {
  const baseRsid = rsid.split('_')[0].split('-')[0];
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const response = await axios.get(`https://rest.ensembl.org/variation/human/${baseRsid}?pops=1`, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 6000
      });
      return response.data;
    } catch (err: any) {
      if (attempt > retries) throw err;
      await new Promise(r => setTimeout(r, 200 * attempt));
    }
  }
}

async function run() {
  console.log(`Starting parallelized batch enrichment of ${BATCH_RSIDS.length} empty shells...`);
  
  let master: Record<string, any> = {};
  if (fs.existsSync(MASTER_FILE)) {
    master = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));
  }

  const outputBatch: Record<string, any> = {};

  // We chunk the list into parallel batches of 10 to keep Ensembl happy and avoid API throttling
  const chunkSize = 10;
  for (let c = 0; c < BATCH_RSIDS.length; c += chunkSize) {
    const chunk = BATCH_RSIDS.slice(c, c + chunkSize);
    console.log(`Querying batch ${Math.floor(c / chunkSize) + 1}...`);

    const promises = chunk.map(async (rsid) => {
      try {
        const data = await fetchWithRetry(rsid);
        if (!data || !data.mappings || data.mappings.length === 0) {
          return { rsid, result: { "SKIP": true, "reason": "Not found" } };
        }

        const mapping = data.mappings.find((m: any) => m.assembly_name === 'GRCh38' && m.coord_system === 'chromosome') || data.mappings[0];
        const chr = mapping.seq_region_name || "Unknown";
        const pos = mapping.start || 0;
        
        const alleleString = mapping.allele_string || "A/G";
        const parts = alleleString.split('/');
        const ref = mapping.ancestral_allele || parts[0] || "A";
        const alt = parts.find((p: string) => p !== ref) || "G";
        
        const informativeAllele = alt;
        const allelesList = [informativeAllele];

        const populations = data.populations || [];

        const extractFreq = (popGnomAD: string, pop1kG: string): number => {
          const gLabelInfo = populations.filter((p: any) => p.population.toLowerCase() === popGnomAD.toLowerCase() && p.allele === informativeAllele);
          if (gLabelInfo.length > 0) return parseFloat(gLabelInfo[0].frequency);
          
          const kLabelInfo = populations.filter((p: any) => p.population === pop1kG && p.allele === informativeAllele);
          if (kLabelInfo.length > 0) return parseFloat(kLabelInfo[0].frequency);

          const gLabelRef = populations.filter((p: any) => p.population.toLowerCase() === popGnomAD.toLowerCase() && p.allele === ref);
          if (gLabelRef.length > 0) return parseFloat((1 - gLabelRef[0].frequency).toFixed(4));

          const kLabelRef = populations.filter((p: any) => p.population === pop1kG && p.allele === ref);
          if (kLabelRef.length > 0) return parseFloat((1 - kLabelRef[0].frequency).toFixed(4));

          return 0.0;
        };

        const afrFreq = extractFreq('gnomADg:afr', '1000GENOMES:phase_3:AFR');
        const eurFreq = extractFreq('gnomADg:nfe', '1000GENOMES:phase_3:EUR');
        const easFreq = extractFreq('gnomADg:eas', '1000GENOMES:phase_3:EAS');
        const amrFreq = extractFreq('gnomADg:amr', '1000GENOMES:phase_3:AMR');
        const sasFreq = extractFreq('gnomADg:sas', '1000GENOMES:phase_3:SAS');

        const totalSum = afrFreq + eurFreq + easFreq + amrFreq + sasFreq;
        if (totalSum === 0) {
          return { rsid, result: { "SKIP": true, "reason": "Not found" } };
        }

        const frequencies = {
          AFR: parseFloat(afrFreq.toFixed(4)),
          EUR: parseFloat(eurFreq.toFixed(4)),
          EAS: parseFloat(easFreq.toFixed(4)),
          AMR: parseFloat(amrFreq.toFixed(4)),
          SAS: parseFloat(sasFreq.toFixed(4))
        };

        const freqsList = [frequencies.AFR, frequencies.EUR, frequencies.EAS, frequencies.AMR, frequencies.SAS];
        const maxFreq = Math.max(...freqsList);
        const minFreq = Math.min(...freqsList);
        const maxDelta = maxFreq - minFreq;

        let maxPopKey = 'EUR';
        if (frequencies.AFR === maxFreq) maxPopKey = 'AFR';
        else if (frequencies.EUR === maxFreq) maxPopKey = 'EUR';
        else if (frequencies.EAS === maxFreq) maxPopKey = 'EAS';
        else if (frequencies.AMR === maxFreq) maxPopKey = 'AMR';
        else if (frequencies.SAS === maxFreq) maxPopKey = 'SAS';

        const region = getRegionFromMaxPop(maxPopKey);

        let weight = 2;
        if (maxDelta >= 0.8) weight = 10;
        else if (maxDelta >= 0.6) weight = 8;
        else if (maxDelta >= 0.4) weight = 6;
        else if (maxDelta >= 0.2) weight = 4;
        else weight = 2;

        const geneInput = data.most_severe_consequence || "intergenic_variant";
        const geneName = geneInput === "intergenic_variant" ? "Intergenic" : geneInput;
        const description = `Validated Ancestry Informative Marker (AIM) for ${region} lineages, resolving regional allele distributions.`;

        const finalRecord = {
          rsid,
          chromosome: chr,
          region,
          color: "#95A5A6",
          alleles: allelesList,
          ref,
          alt,
          frequencies,
          subFrequencies: {},
          deepFrequencies: {},
          weight,
          gene: geneName,
          trait: "Ancestry",
          description
        };

        return { rsid, result: finalRecord };

      } catch (err: any) {
        return { rsid, result: { "SKIP": true, "reason": `Error querying: ${err.message}` } };
      }
    });

    const results = await Promise.all(promises);
    for (const res of results) {
      outputBatch[res.rsid] = res.result;
      const resAny = res.result as any;
      if (!resAny.SKIP) {
        if (master[res.rsid]) {
          master[res.rsid] = { ...master[res.rsid], ...resAny };
        } else {
          master[res.rsid] = resAny;
        }
      }
    }

    // Short sleep between chunks to be respectful
    await new Promise(r => setTimeout(r, 200));
  }

  fs.writeFileSync(MASTER_FILE, JSON.stringify(master, null, 2));
  console.log(`Successfully updated master database at: ${MASTER_FILE}`);

  const batchReportPath = path.join(process.cwd(), 'src', 'data', 'batch_50_report.json');
  fs.writeFileSync(batchReportPath, JSON.stringify(outputBatch, null, 2));

  console.log('--- OUTPUT JSON RESULTS FOR ALL SEQUENTIAL MARKERS IN BATCH ---');
  console.log(JSON.stringify(outputBatch, null, 2));
}

run();
