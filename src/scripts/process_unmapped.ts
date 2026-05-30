import fs from 'fs';
import path from 'path';

function main() {
  const aimsPath = path.resolve('my_aims.txt');
  const regionsPath = path.resolve('my_regions.txt');

  if (!fs.existsSync(aimsPath) || !fs.existsSync(regionsPath)) {
    console.error('my_aims.txt or my_regions.txt not found in workspace root!');
    return;
  }

  const aimsLines = fs.readFileSync(aimsPath, 'utf8').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const regionsLines = fs.readFileSync(regionsPath, 'utf8').split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  if (aimsLines.length !== regionsLines.length) {
    console.warn(`Line mismatch: aims has ${aimsLines.length}, regions has ${regionsLines.length}`);
  }

  // Build local knowledge map: rsid -> { chromosome, position }
  const localMap = new Map<string, { chromosome: string; position: number }>();
  for (let i = 0; i < Math.min(aimsLines.length, regionsLines.length); i++) {
    const rsid = aimsLines[i].toLowerCase();
    const regionParts = regionsLines[i].split(/\s+/);
    if (regionParts.length >= 2) {
      const chromosome = regionParts[0];
      const position = parseInt(regionParts[1], 10);
      if (chromosome && !isNaN(position)) {
        localMap.set(rsid, { chromosome, position });
      }
    }
  }

  console.log(`Successfully parsed ${localMap.size} unique rsID mappings from my_aims/regions files.`);

  // Now inspect all JSON files in raw_aims to see which unmapped markers we can resolve!
  const rawAimsDir = path.resolve('src/data/raw_aims');
  const files = fs.readdirSync(rawAimsDir).filter(f => f.endsWith('.json'));

  let totalMappable = 0;
  let totalStillUnmapped = 0;

  const mappingUpdates: Record<string, Array<{ rsid: string, chrom: string, pos: number }>> = {};

  for (const file of files) {
    const filePath = path.join(rawAimsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    try {
      const data = JSON.parse(content);
      const isArray = Array.isArray(data);
      const entries = isArray ? data : Object.entries(data).map(([k, v]) => ({ ...(v as object), rsid: k }));

      const updatesForFile: Array<{ rsid: string, chrom: string, pos: number }> = [];

      for (const entry of entries) {
        if (!entry.rsid) continue;
        const normalizedRsid = entry.rsid.replace(/_global|_AFR|_EUR|_EAS|_SAS|_NAT|_AMR|_SIB|_OCE/gi, '').toLowerCase().trim();
        const chrom = entry.chromosome || entry.chrom || entry.chr;
        const pos = entry.position || entry.pos;

        const isUnmapped = !chrom || chrom === 'Unknown' || typeof pos !== 'number' || pos <= 0;

        if (isUnmapped) {
          const mapping = localMap.get(normalizedRsid);
          if (mapping) {
            updatesForFile.push({
              rsid: entry.rsid,
              chrom: mapping.chromosome,
              pos: mapping.position
            });
            totalMappable++;
          } else {
            totalStillUnmapped++;
          }
        }
      }

      if (updatesForFile.length > 0) {
        mappingUpdates[file] = updatesForFile;
      }
    } catch (e) {
      console.error(`Error reading ${file}:`, e);
    }
  }

  console.log(`\n--- MAPPABILITY REPORT ---`);
  console.log(`Total unmapped markers that can be mapped: ${totalMappable}`);
  console.log(`Total unmapped markers that still remain unmappable: ${totalStillUnmapped}`);

  console.log('\nUpdates per file:');
  for (const [file, list] of Object.entries(mappingUpdates)) {
    console.log(`- ${file}: ${list.length} updates possible. Sample:`, list.slice(0, 3));
  }
}

main();
