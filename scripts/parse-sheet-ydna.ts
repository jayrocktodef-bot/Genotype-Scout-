import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { YSnpRecord, YSnpIndex, YPhylotreeBranch, YPhylotreeDataset, parentHaplogroup } from '../src/utils/yPhylotree';

const CSV_PATH = '/home/jequan/.gemini/antigravity/brain/47873f56-a14c-4d4f-92a3-c543f7590994/.system_generated/steps/9301/content.md';
const OUT_TREE = 'src/data/y_phylotree.json';
const OUT_INDEX = 'src/data/y_snp_index.json';

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Clean SNP names (e.g. remove "[maybe L333]" brackets, select first)
function cleanSnpName(raw: string): string {
  let name = raw.replace(/^\[maybe\s+|\]$/gi, '').trim();
  name = name.split('/')[0].split(';')[0].trim();
  return name;
}

async function main() {
  console.log('🏁 Starting Google Sheet Y-DNA Parse & Phylotree Build...');
  
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ CSV File not found at: ${CSV_PATH}`);
    process.exit(1);
  }

  const fileStream = fs.createReadStream(CSV_PATH);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const snpIndex: YSnpIndex = {};
  let lineCount = 0;
  let addedSnps = 0;
  let isHeader = true;

  for await (const line of rl) {
    lineCount++;
    if (lineCount < 10) continue; // skip file header descriptions
    if (isHeader) {
      isHeader = false;
      continue; // skip column header row
    }
    if (!line.trim()) continue;

    const fields = parseCsvLine(line);
    if (fields.length < 7) continue;

    const subgroupName = fields[0];
    const rawName = fields[1];
    const alternateNamesRaw = fields[2];
    const rsidsRaw = fields[3];
    const build37Raw = fields[4];
    const build38Raw = fields[5];
    const mutationInfo = fields[6];

    if (!rawName) continue;

    const name = cleanSnpName(rawName);
    if (!name) continue;

    // Parse mutation info (e.g. A->G, C->T)
    let ancestral = '';
    let derived = '';
    if (mutationInfo && mutationInfo.includes('->')) {
      const parts = mutationInfo.split('->');
      ancestral = parts[0].trim().toUpperCase();
      derived = parts[1].trim().toUpperCase();
    }

    if (!ancestral || !derived || ancestral.length !== 1 || derived.length !== 1) {
      // Skip if we don't have valid single-nucleotide mutation info
      continue;
    }

    const posHg37 = build37Raw ? parseInt(build37Raw, 10) : undefined;
    const posHg38 = build38Raw ? parseInt(build38Raw, 10) : undefined;
    
    // Parse rsids
    const rsids = rsidsRaw ? rsidsRaw.split(';').map(r => r.trim()).filter(r => r.startsWith('rs')) : [];
    const mainRsid = rsids[0] || undefined;

    const record: YSnpRecord = {
      name,
      rsid: mainRsid,
      posHg38,
      posHg19: posHg37,
      ancestral,
      derived,
      isoggHaplogroup: subgroupName || undefined,
      mutation: `${ancestral} to ${derived}`
    };

    const keys = new Set<string>();
    keys.add(name.toUpperCase());
    
    // Add aliases
    if (alternateNamesRaw) {
      alternateNamesRaw.split(';').forEach(alt => {
        const cleaned = cleanSnpName(alt);
        if (cleaned) {
          keys.add(cleaned.toUpperCase());
        }
      });
    }

    // Add rsids to keys
    rsids.forEach(r => keys.add(r.toUpperCase()));

    // Store in index
    for (const key of keys) {
      if (!snpIndex[key]) {
        snpIndex[key] = record;
      }
    }
    addedSnps++;
  }

  console.log(`✅ Finished parsing CSV. Processed ${addedSnps} valid Y-SNPs. Index size: ${Object.keys(snpIndex).length} entries.`);

  // Write out the SNP index
  fs.writeFileSync(OUT_INDEX, JSON.stringify(snpIndex, null, 2));
  console.log(`✍️ Wrote ${OUT_INDEX}`);

  // Now load master_ydna.json to resolve branches
  const masterYdnaPath = 'src/data/master_ydna.json';
  if (!fs.existsSync(masterYdnaPath)) {
    console.error(`❌ Master Y-DNA file not found at: ${masterYdnaPath}`);
    process.exit(1);
  }

  const masterYdna = JSON.parse(fs.readFileSync(masterYdnaPath, 'utf8'));
  const isoggTree = masterYdna.isoggTree || [];

  const branches: YPhylotreeBranch[] = [];
  let resolvedBranchesCount = 0;

  for (const b of isoggTree) {
    if (!b.branchName || b.branchName === 'Subgroup Name' || b.branchName.toLowerCase() === 'name') continue;

    const definingSNPs: YSnpRecord[] = [];
    const unresolvedSNPs: string[] = [];

    const snpList = b.definingSNPs || [];
    for (const snp of snpList) {
      const key = String(snp).toUpperCase().replace(/^\[MAYBE\s+|\]$/g, '').trim();
      const rec = snpIndex[key];
      if (rec) {
        definingSNPs.push(rec);
      } else {
        unresolvedSNPs.push(snp);
      }
    }

    if (definingSNPs.length > 0) {
      resolvedBranchesCount++;
    }

    branches.push({
      branchName: b.branchName,
      parent: parentHaplogroup(b.branchName),
      definingSNPs,
      unresolvedSNPs,
      rsids: b.rsids || []
    });
  }

  const dataset: YPhylotreeDataset = {
    version: '1.1.0',
    source: 'Google Sheets Y-DNA curated classification references joined with repo ISOGG branch list',
    generatedAt: new Date().toISOString(),
    snpCount: Object.keys(snpIndex).length,
    branchCount: branches.length,
    resolvedBranchCount: resolvedBranchesCount,
    branches
  };

  fs.writeFileSync(OUT_TREE, JSON.stringify(dataset, null, 2));
  console.log(`✍️ Wrote ${OUT_TREE}`);
  console.log(`📊 Statistics:`);
  console.log(`   - Total branches in tree: ${dataset.branchCount}`);
  console.log(`   - Resolved branches: ${dataset.resolvedBranchCount} (${Math.round(100 * dataset.resolvedBranchCount / dataset.branchCount)}%)`);

  // Let's also run build-haplogroup-master.ts to consolidate if needed
  console.log('🎉 Done compiling Y-DNA trees from Google Sheet data.');
}

main().catch(e => {
  console.error('❌ Parse execution failed:', e);
  process.exit(1);
});
