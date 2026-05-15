const fs = require('fs');
const path = require('path');

const dir = './src/data/raw_aims';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.json')) {
    const filePath = path.join(dir, file);
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Only process arrays
    if (Array.isArray(data)) {
      data = data.map(aim => {
        if (typeof aim.weight === 'number') {
          // Normalize weights: > 4 is high (8), <= 4 is low (4)
          aim.weight = aim.weight > 4 ? 8 : 4;
        }
        return aim;
      });
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
  }
});
