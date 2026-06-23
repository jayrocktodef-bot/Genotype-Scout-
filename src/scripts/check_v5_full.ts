import fs from 'fs';
import path from 'path';

function run() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'v5_markers_master.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log('Total entries in v5_markers_master:', Object.keys(data).length);
    console.log('First entry sample:');
    const firstKey = Object.keys(data)[0];
    console.log(JSON.stringify(data[firstKey], null, 2));
  } else {
    console.log('v5_markers_master.json does not exist');
  }
}

run();
