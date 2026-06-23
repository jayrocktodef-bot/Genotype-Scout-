import fs from 'fs';
import path from 'path';

const TARGET_RSIDS = [
  "rs10456200", "rs10456201", "rs10456202", "rs10456203", "rs10456204", "rs10456205", "rs10456206", "rs10456207", "rs10456209", "rs10456210", "rs10456212", "rs10456213", "rs10456215", "rs10456216", "rs10456217", "rs10456218", "rs10456219", "rs10456220", "rs10456221", "rs10456222", "rs10456223", "rs10456224", "rs10456225", "rs10456226", "rs10456227", "rs10456228", "rs10456229", "rs10456230", "rs10456231", "rs10456232", "rs10456233", "rs10456234", "rs10456235", "rs10456236", "rs10456237", "rs10456238", "rs10456239", "rs10456240", "rs10456241", "rs10456242", "rs10456243", "rs10456244", "rs10456245", "rs10456247", "rs10456248", "rs10456249", "rs10456252", "rs10456254", "rs10456256", "rs10456257", "rs10456258", "rs10456259", "rs10456260", "rs10456261", "rs10456262", "rs10456263", "rs10456265", "rs10456266", "rs10456267", "rs10456268", "rs10456269", "rs10456271", "rs10456291", "rs10456293", "rs10456294", "rs10456295", "rs10456296", "rs10456297", "rs10456298", "rs10456299", "rs10456300", "rs10456301", "rs10456302", "rs10456303", "rs10456304", "rs10456305", "rs10456306", "rs10456308", "rs10456309", "rs10456310", "rs10456311", "rs10456312", "rs10456313", "rs10456314", "rs10456315", "rs10456316", "rs10456317", "rs10456318", "rs10456319", "rs10456320", "rs10456321", "rs10456322", "rs10456323", "rs10456324", "rs10456325", "rs10456326", "rs10456327", "rs10456328", "rs10456329", "rs10456330", "rs10456331", "rs10456332", "rs10456333", "rs10456334", "rs10456335", "rs10456336", "rs10456337", "rs10456338", "rs10456339", "rs10456340", "rs10456341", "rs10456342", "rs10456343", "rs10456344", "rs10456345", "rs10456346", "rs10456347", "rs10456348", "rs10456349", "rs10456350", "rs10456351", "rs10456352", "rs10456353", "rs10456354", "rs10456355", "rs10456356", "rs10456357", "rs10456358", "rs10456359", "rs10456360", "rs10456361", "rs10456362", "rs10456363", "rs10456364", "rs10456365", "rs10456366", "rs10456367", "rs10456368", "rs10456369", "rs10456370", "rs10456371", "rs10456388", "rs10456389", "rs10456391", "rs10456393", "rs10456396", "rs10456399", "rs10456401", "rs10456402", "rs10456403", "rs10456404", "rs10456405", "rs10456408", "rs10456409", "rs10456410", "rs10456418", "rs10456419", "rs10456421", "rs10456422", "rs10456423", "rs10456425", "rs10456426", "rs10456444"
];

function run() {
  const snps = JSON.parse(fs.readFileSync('src/data/reference/snps.json', 'utf8'));
  const master = JSON.parse(fs.readFileSync('src/data/master_aims_normalized.json', 'utf8'));

  let foundInSnps = 0;
  let matchesWithRoundFreqs = 0;

  for (const rsid of TARGET_RSIDS) {
    const snpEntries = snps.filter((x: any) => x.rsid === rsid);
    const mEntry = master[rsid];
    
    // Check if there are frequencies in master or snps.json
    let mergedFreqs: Record<string, number> = {};
    if (mEntry && mEntry.frequencies && Object.keys(mEntry.frequencies).length > 0) {
      mergedFreqs = mEntry.frequencies;
    } else if (snpEntries.length > 0) {
      // accumulate frequencies across subpops or take the first one
      snpEntries.forEach((x: any) => {
        if (x.frequencies) {
          mergedFreqs = { ...mergedFreqs, ...x.frequencies };
        }
      });
    }

    const hasFreqs = Object.keys(mergedFreqs).length > 0;
    if (snpEntries.length > 0) foundInSnps++;

    if (hasFreqs) {
      // check if frequencies are suspicious (fabricated rounding like 0.05, 0.95, 0.01 etc.)
      const isRound = Object.values(mergedFreqs).every((v: any) => {
        const val = parseFloat(v);
        if (isNaN(val)) return false;
        // Check if val is multiple of 0.05 or 0.01 exactly
        const cents = Math.round(val * 100);
        return cents % 5 === 0 || cents % 10 === 0 || cents === 98 || cents === 2 || cents === 1 || cents === 99;
      });
      if (isRound) {
        matchesWithRoundFreqs++;
      }
    }
  }

  console.log(`Summary of Targeted list checking:`);
  console.log(`Total targeted rsIDs: ${TARGET_RSIDS.length}`);
  console.log(`Found in snps.json: ${foundInSnps}`);
  console.log(`Frequencies looking fabricated (ROUND_FREQS matches): ${matchesWithRoundFreqs}`);
}

run();
