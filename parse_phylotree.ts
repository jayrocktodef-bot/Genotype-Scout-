import * as fs from 'fs';
import * as readline from 'readline';

interface MtHaplogroupNode {
  branchName: string;
  mutations: string[];
}

async function parsePhyloTree(inputFilePath: string, outputFilePath: string) {
  const fileStream = fs.createReadStream(inputFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const haplogroups: MtHaplogroupNode[] = [];
  let isFirstLine = true;

  for await (const line of rl) {
    // The PhyloTree CSV might have a header row
    if (isFirstLine && line.toLowerCase().includes('haplogroup')) {
      isFirstLine = false;
      continue;
    }
    isFirstLine = false;

    // Split the CSV row by commas and clean up any stray quotes
    const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
    if (columns.length < 3) continue;

    const rawData = columns[2]; // Third column has "Haplogroup / Mutations"
    if (!rawData) continue;

    let branchName = "";
    let mutations: string[] = [];

    if (rawData.includes('/')) {
      const parts = rawData.split('/');
      branchName = parts[0].trim();
      // Mutations follow the slash
      const rawMutations = parts.slice(1).join(' ').split(/\s+/);
      mutations = rawMutations.filter(m => m.length > 0 && !m.includes('(') && !m.includes(')'));
    } else {
      // If no slash, it might be just a mutation or just a branch
      // Looking at line 10: "11,10,A200G,1", A200G is a mutation.
      // But we need the branch name. 
      // Actually, standard PhyloTree might have branch names that are just numbers in some specific cases, 
      // but usually they are letters.
      branchName = rawData;
    }

    // Only add branches that actually have defining mutations or a valid looking name
    if (branchName && (mutations.length > 0 || branchName.length > 1)) {
      haplogroups.push({
        branchName,
        mutations
      });
    }
  }

  fs.writeFileSync(outputFilePath, JSON.stringify(haplogroups, null, 2));
  console.log(`Successfully parsed ${haplogroups.length} mtDNA haplogroups to ${outputFilePath}!`);
}

// Make sure the CSV filename matches exactly what you downloaded
parsePhyloTree('./src/data/PhyloTreeBuild17.csv', './src/data/mt_haplogroups.json')
  .catch(console.error);
