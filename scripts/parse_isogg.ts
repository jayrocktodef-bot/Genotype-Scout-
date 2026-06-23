import * as fs from 'fs';
import * as readline from 'readline';

// Unified structure
interface StandardizedHaplo {
  name: string;        // SNP name
  haplogroup: string;  // Haplogroup branch
  ancestral: string;   // Ancestral allele (placeholder if unknown)
  derived: string;     // Derived allele (placeholder if unknown)
  parent: string | null; // Parent haplogroup branch
}

async function parseIsoggData(inputFilePath: string, outputFilePath: string) {
  const fileStream = fs.createReadStream(inputFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const standardizedData: StandardizedHaplo[] = [];
  let isFirstLine = true;

  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }

    const columns = line.split(',');
    if (columns.length < 4) continue;

    const subgroupName = columns[0].trim(); 
    const snpName = columns[1].trim();      
    
    // In ISOGG, the parent is often implied by the hierarchy of the subgroup name
    // e.g., R1a is a child of R
    let parent = null;
    if (subgroupName.includes('-')) {
        parent = subgroupName.split('-').slice(0, -1).join('-');
    } else if (subgroupName.length > 1) {
        parent = subgroupName.slice(0, -1);
    }

    if (snpName) {
        standardizedData.push({
            name: snpName,
            haplogroup: subgroupName,
            ancestral: '?', // Unknown in raw ISOGG export without further lookup
            derived: '?',   // Unknown in raw ISOGG export without further lookup
            parent: parent
        });
    }
  }

  fs.writeFileSync(outputFilePath, JSON.stringify(standardizedData, null, 2));
  console.log(`Successfully parsed ${standardizedData.length} entries to ${outputFilePath}!`);
}

// Ensure your CSV file is named exactly like this and is in the root folder
parseIsoggData('./SNP Index - Human.csv', './src/data/haplogroups/parsed_haplogroups_unified.json')
  .catch(console.error);
