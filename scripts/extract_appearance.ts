import * as fs from 'fs';
import * as path from 'path';

const REPO_BASE = 'https://raw.githubusercontent.com/wkyleg/personal-genomics/main/markers';

const sourceFiles = [
  { url: `${REPO_BASE}/dermatology.py`, category: 'Dermatology' },
  { url: `${REPO_BASE}/skin_appearance.py`, category: 'Skin Appearance' },
  { url: `${REPO_BASE}/uv_sensitivity.py`, category: 'UV Sensitivity' }
];

async function extractAppearanceMarkers() {
  const allMarkers: any[] = [];
  const dataDir = path.join(process.cwd(), 'src', 'data');

  console.log('🚀 Extracting Appearance & Dermatology markers...\n');

  for (const source of sourceFiles) {
    try {
      const response = await fetch(source.url);
      const text = await response.text();

      // This regex looks for 'rs' followed by numbers, then finds the dictionary content { ... }
      const markerRegex = /"(rs\d+)"\s*:\s*\{([^}]+)\}/g;
      let match;

      while ((match = markerRegex.exec(text)) !== null) {
        const rsid = match[1];
        const rawContent = match[2];
        
        // Clean up the Python-style dictionary into a JS object
        const interpretation: Record<string, string> = {};
        const lines = rawContent.split(',');
        
        lines.forEach(line => {
          const parts = line.split(':').map(p => p.trim().replace(/['"]/g, ''));
          if (parts.length === 2) {
            interpretation[parts[0]] = parts[1];
          }
        });

        allMarkers.push({
          rsid,
          category: source.category,
          interpretation
        });
      }
      console.log(`✅ Processed ${source.category}`);
    } catch (error) {
      console.error(`❌ Failed to fetch ${source.category}`);
    }
  }

  fs.writeFileSync(
    path.join(dataDir, 'appearance_traits.json'), 
    JSON.stringify(allMarkers, null, 2)
  );
  
  console.log(`\n🎉 Success! Saved ${allMarkers.length} markers to appearance_traits.json`);
}

extractAppearanceMarkers();