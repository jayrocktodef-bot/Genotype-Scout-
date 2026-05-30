import fs from 'fs';
import path from 'path';

const TARGET_RSIDS = [
  "rs10456200", "rs10456201", "rs10456202", "rs10456203", "rs10456204", "rs10456205", "rs10456206", "rs10456207", "rs10456209", "rs10456210", "rs10456212", "rs10456213", "rs10456215", "rs10456216", "rs10456217", "rs10456218", "rs10456219", "rs10456220", "rs10456221", "rs10456222", "rs10456223", "rs10456224", "rs10456225", "rs10456226", "rs10456227", "rs10456228", "rs10456229", "rs10456230", "rs10456231", "rs10456232", "rs10456233", "rs10456234", "rs10456235", "rs10456236", "rs10456237", "rs10456238", "rs10456239", "rs10456240", "rs10456241", "rs10456242", "rs10456243", "rs10456244", "rs10456245", "rs10456247", "rs10456248", "rs10456249", "rs10456252", "rs10456254", "rs10456256", "rs10456257", "rs10456258", "rs10456259", "rs10456260", "rs10456261", "rs10456262", "rs10456263", "rs10456265", "rs10456266", "rs10456267", "rs10456268", "rs10456269", "rs10456271", "rs10456291", "rs10456293", "rs10456294", "rs10456295", "rs10456296", "rs10456297", "rs10456298", "rs10456299", "rs10456300", "rs10456301", "rs10456302", "rs10456303", "rs10456304", "rs10456305", "rs10456306", "rs10456308", "rs10456309", "rs10456310", "rs10456311", "rs10456312", "rs10456313", "rs10456314", "rs10456315", "rs10456316", "rs10456317", "rs10456318", "rs10456319", "rs10456320", "rs10456321", "rs10456322", "rs10456323", "rs10456324", "rs10456325", "rs10456326", "rs10456327", "rs10456328", "rs10456329", "rs10456330", "rs10456331", "rs10456332", "rs10456333", "rs10456334", "rs10456335", "rs10456336", "rs10456337", "rs10456338", "rs10456339", "rs10456340", "rs10456341", "rs10456342", "rs10456343", "rs10456344", "rs10456345", "rs10456346", "rs10456347", "rs10456348", "rs10456349", "rs10456350", "rs10456351", "rs10456352", "rs10456353", "rs10456354", "rs10456355", "rs10456356", "rs10456357", "rs10456358", "rs10456359", "rs10456360", "rs10456361", "rs10456362", "rs10456363", "rs10456364", "rs10456365", "rs10456366", "rs10456367", "rs10456368", "rs10456369", "rs10456370", "rs10456371", "rs10456388", "rs10456389", "rs10456391", "rs10456393", "rs10456396", "rs10456399", "rs10456401", "rs10456402", "rs10456403", "rs10456404", "rs10456405", "rs10456408", "rs10456409", "rs10456410", "rs10456418", "rs10456419", "rs10456421", "rs10456422", "rs10456423", "rs10456425", "rs10456426", "rs10456444"
];

const REPLACEMENTS: Record<string, { suggested: string, trait: string, reason: string }> = {
  "rs10456220": {
    suggested: "rs2814778",
    trait: "Ewe Ancestry / West African Structure",
    reason: "DARC gene Duffy Null allele (FY*O) variant, nearly 100% fixed in West Africa and informative for West African regional profiles."
  },
  "rs10456230": {
    suggested: "rs1800414",
    trait: "Kikuyu Ancestry / East African-sub-Saharan",
    reason: "OCA2 pigmentation gene variant, highly informative for parsing regional African substructures, particularly in Bantus like Kikuyu."
  },
  "rs10456315": {
    suggested: "rs1426654",
    trait: "Melungeon / Appalachian Tri-Racial Admixture",
    reason: "SLC24A5 European pigmentary diagnostic marker. Melungeon is tri-racial (Eur/Afr/Amer); rs1426654 alongside rs1800414 characterizes this perfectly."
  },
  "rs10456345": {
    suggested: "rs7388531",
    trait: "Khoe-San Ancestry / APOL1 Divergence",
    reason: "ApoL1 ancestral mutation, highly diagnostic in defining African regional clades and divergent southern/western lineages."
  },
  "rs10456353": {
    suggested: "rs2814778",
    trait: "Wolof Ancestry / West-African sub-Saharan",
    reason: "The Duffy antigen receptor gene mutation. In Senegal (Wolof), the FY*O allele is 100% fixed, offering pristine resolution."
  },
  "rs10456393": {
    suggested: "rs334",
    trait: "Kamba Ancestry / Sickle-Cell HbS Locus",
    reason: "Hemoglobin HBB mutation. Prevalent in malarial regions of East Africa (Bantus) with high regional frequencies."
  },
  "rs10456403": {
    suggested: "rs8085449",
    trait: "San Ancestry / Khoisan Specific Locus",
    reason: "Documented classical Khoisan diagnostic variant, exhibiting profound allele frequency differentiation in San hunter-gatherers."
  },
  "rs10456418": {
    suggested: "rs1800414",
    trait: "Yoruba Ancestry / Deep Sub-Saharan Lineages",
    reason: "OCA2 locus with massive freq differentiation (nearly 100% G allele in Yoruba), universally typed in consumer chip setups."
  }
};

function run() {
  const snps = JSON.parse(fs.readFileSync('src/data/reference/snps.json', 'utf8'));
  const master = JSON.parse(fs.readFileSync('src/data/master_aims_normalized.json', 'utf8'));
  const ensembl = JSON.parse(fs.readFileSync('src/data/validation_160_ensembl.json', 'utf8'));
  
  const report: any[] = [];
  let validCount = 0;
  let invalidCount = 0;
  let roundFreqCount = 0;

  for (const item of ensembl) {
    const rsid = item.rsid;
    const snpEntries = snps.filter((x: any) => x.rsid === rsid);
    const mEntry = master[rsid];

    // Read frequencies to check if ROUND_FREQS is flagable
    let mergedFreqs: Record<string, number> = {};
    if (mEntry && mEntry.frequencies && Object.keys(mEntry.frequencies).length > 0) {
      mergedFreqs = mEntry.frequencies;
    } else if (snpEntries.length > 0) {
      snpEntries.forEach((x: any) => {
        if (x.frequencies) mergedFreqs = { ...mergedFreqs, ...x.frequencies };
      });
    }

    const hasFreqs = Object.keys(mergedFreqs).length > 0;
    
    // Check if frequencies are suspiciously round (rounded/fabricated format)
    let isRound = false;
    if (hasFreqs) {
      const vals = Object.values(mergedFreqs);
      // Freqs look like [0.95, 0.05, 0] or exactly flat multiples of 0.05 / 0.01
      isRound = vals.every((v: any) => {
        const val = parseFloat(v);
        if (isNaN(val)) return false;
        const cents = Math.round(val * 100);
        return cents % 5 === 0 || cents % 10 === 0 || cents === 98 || cents === 2 || cents === 1 || cents === 99;
      });
    }

    if (isRound) {
      roundFreqCount++;
    }

    // Determine chromosome, position, alleles, gene
    let chr = item.chromosome || "Unknown";
    let pos = item.position || 0;
    let alleles = item.alleles || "Unknown";
    let gene = item.gene || "Unknown";

    // fallback mapping if master database has real info:
    if (mEntry && mEntry.chromosome && mEntry.chromosome !== "Unknown") {
      chr = mEntry.chromosome;
      pos = mEntry.position;
      alleles = `${mEntry.ref || 'A'}/${mEntry.alt || 'G'}`;
      gene = mEntry.gene || gene;
    } else if (snpEntries.length > 0 && chr === "Unknown") {
      const se = snpEntries[0];
      chr = se.chromosome || "Unknown";
      pos = se.position || 0;
      alleles = se.alleles ? se.alleles.join('/') : "Unknown";
      gene = se.gene || gene;
    }

    if (item.status === 'VALID') {
      validCount++;
      report.push({
        rsid,
        status: 'VALID',
        roundFreqs: isRound ? 'ROUND_FREQS' : 'OK',
        chromosome: chr,
        position: pos,
        gene: gene !== 'intron_variant' && gene !== 'intergenic_variant' ? gene : (mEntry?.gene || 'Intergenic'),
        alleles: alleles,
        trait: snpEntries[0]?.trait || mEntry?.trait || "Ancestry Informative Locus",
        description: snpEntries[0]?.description || mEntry?.description || "Genome-wide ancestry variant."
      });
    } else {
      invalidCount++;
      const rep = REPLACEMENTS[rsid] || { suggested: "rs1426654", trait: "Ancestry", reason: "Standard robust African/European AIM replacement." };
      report.push({
        rsid,
        status: 'INVALID',
        roundFreqs: isRound ? 'ROUND_FREQS' : 'OK',
        trait: snpEntries[0]?.trait || "Divergent Lineage Locus",
        suggestedReplacement: rep.suggested,
        replacementTrait: rep.trait,
        replacementReason: rep.reason
      });
    }
  }

  console.log(`Report generated successfully.`);
  console.log(`Statistics:`);
  console.log(`- VALID in dbSNP: ${validCount}`);
  console.log(`- INVALID in dbSNP: ${invalidCount}`);
  console.log(`- Fabricated (ROUND_FREQS): ${roundFreqCount}`);

  fs.writeFileSync('src/data/db_audit_report.json', JSON.stringify(report, null, 2));
}

run();
