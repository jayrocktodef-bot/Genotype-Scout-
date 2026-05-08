import * as fs from 'fs';
import * as readline from 'readline';

interface MitoTrait {
  position: string;
  allele: string;
  traits: string[];
  status: string;
}

async function parseMitomap(inputFilePath: string, outputFilePath: string) {
  if (!fs.existsSync(inputFilePath)) {
    console.error(`Input file not found: ${inputFilePath}`);
    return;
  }

  const fileStream = fs.createReadStream(inputFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const traitsMap: MitoTrait[] = [];
  let isFirstLine = true;

  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }

    // Regex to split CSV by commas but ignore commas inside quotes
    const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(col => col.replace(/(^"|"$)/g, '').trim());
    
    // Check if we have enough columns
    if (columns.length < 8) continue;

    const diseasesRaw = columns[3];
    const alleleRaw = columns[4];
    const position = columns[5];
    const status = columns[7];

    if (!position || !diseasesRaw) continue;

    // Clean up the allele string
    const alleleMatch = alleleRaw.match(/m\.\d+([A-Z]>[A-Z]|del[A-Z]+|ins[A-Z]+)/);
    const cleanAllele = alleleMatch ? alleleMatch[1] : alleleRaw.replace(/<[^>]+>/g, '');

    // Split multiple diseases
    const traits = diseasesRaw.split(/[\/;]/).map(t => t.trim()).filter(t => t.length > 0);

    traitsMap.push({
      position,
      allele: cleanAllele,
      traits,
      status
    });
  }

  fs.writeFileSync(outputFilePath, JSON.stringify(traitsMap, null, 2));
  console.log(`Successfully parsed ${traitsMap.length} traits to ${outputFilePath}!`);
}

// Execute the parser with corrected path
parseMitomap('./src/data/mitomap_confirmed.csv', './src/data/mito_traits.json')
  .catch(console.error);
