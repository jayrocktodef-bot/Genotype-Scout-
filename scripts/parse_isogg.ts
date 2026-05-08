import * as fs from 'fs';
import * as readline from 'readline';

interface HaplogroupNode {
  branchName: string;
  definingSNPs: string[];
  rsids: string[];
}

async function parseIsoggData(inputFilePath: string, outputFilePath: string) {
  const fileStream = fs.createReadStream(inputFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const haploMap = new Map<string, HaplogroupNode>();
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
    const rsNumber = columns[3].trim();     

    if (!subgroupName) continue;

    if (!haploMap.has(subgroupName)) {
      haploMap.set(subgroupName, { branchName: subgroupName, definingSNPs: [], rsids: [] });
    }

    const node = haploMap.get(subgroupName)!;

    if (snpName && !node.definingSNPs.includes(snpName)) {
      node.definingSNPs.push(snpName);
    }

    if (rsNumber && rsNumber.startsWith('rs') && !node.rsids.includes(rsNumber)) {
      node.rsids.push(rsNumber);
    }
  }

  const finalDataset = Array.from(haploMap.values()).filter(
    (node) => node.definingSNPs.length > 0 || node.rsids.length > 0
  );

  fs.writeFileSync(outputFilePath, JSON.stringify(finalDataset, null, 2));
  console.log(`Successfully parsed ${finalDataset.length} haplogroup branches to ${outputFilePath}!`);
}

// Ensure your CSV file is named exactly like this and is in the root folder
parseIsoggData('./SNP Index - Human.csv', './src/data/parsed_haplogroups.json')
  .catch(console.error);
