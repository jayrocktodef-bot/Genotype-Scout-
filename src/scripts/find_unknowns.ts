import fs from 'fs';
import path from 'path';

function main() {
  const masterPath = path.resolve('src/data/master_aims_normalized.json');
  if (!fs.existsSync(masterPath)) {
    console.error('Master path does not exist');
    return;
  }
  const data = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
  const allKeys = Object.keys(data);
  console.log('Total keys in master:', allKeys.length);

  const missingChromOrPos: string[] = [];
  for (const k of allKeys) {
    const item = data[k];
    if (!item.chromosome || item.chromosome === 'Unknown' || typeof item.position !== 'number' || item.position <= 0) {
      missingChromOrPos.push(k);
    }
  }

  console.log('Total unmapped/missing markers:', missingChromOrPos.length);
  console.log('Sample of 50 unmapped markers:', missingChromOrPos.slice(0, 50));
  
  // Let's write them to a temp file for analysis if needed
  fs.writeFileSync('src/data/temp_unmapped.json', JSON.stringify(missingChromOrPos, null, 2), 'utf8');
}

main();
