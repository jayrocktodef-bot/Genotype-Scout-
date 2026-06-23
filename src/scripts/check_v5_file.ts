import fs from 'fs';
import path from 'path';

function run() {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const files = fs.readdirSync(dataDir);
  for (const f of files) {
    const filePath = path.join(dataDir, f);
    const stat = fs.statSync(filePath);
    if (stat.isFile() && f.endsWith('.json')) {
      console.log(`${f}: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  }

  // Also check some candidate files
  const v5Path = path.join(dataDir, 'v5_markers_master.json');
  if (fs.existsSync(v5Path)) {
    try {
      const v5Content = JSON.parse(fs.readFileSync(v5Path, 'utf8').slice(0, 5000) + '}');
      console.log('v5_markers_master sample keys:', Object.keys(v5Content).slice(0, 10));
    } catch {
      console.log('v5_markers_master is partially checked');
    }
  }
}

run();
