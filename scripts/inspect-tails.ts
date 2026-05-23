import fs from 'fs';

const files = [
  './src/data/master_aims_normalized.json',
  './src/data/master_ydna.json'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    const stat = fs.statSync(file);
    console.log(`\nFile: ${file}`);
    console.log(`Size: ${stat.size} bytes`);
    
    // Read the last 500 bytes
    const fd = fs.openSync(file, 'r');
    const bufferSize = Math.min(500, stat.size);
    const buffer = Buffer.alloc(bufferSize);
    fs.readSync(fd, buffer, 0, bufferSize, stat.size - bufferSize);
    fs.closeSync(fd);
    
    console.log('--- Last 500 characters ---');
    console.log(buffer.toString('utf-8'));
    console.log('---------------------------');
  } else {
    console.log(`File NOT found: ${file}`);
  }
}
