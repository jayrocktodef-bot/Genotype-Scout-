// src/utils/ancestryAuditor.ts
import fs from 'fs';
import path from 'path';

const ANCESTRY_DIR = 'src/data/raw_aims/';

/**
 * Audit and patch ancestry data files.
 */
export function auditAndPatch() {
  const files = fs.readdirSync(ANCESTRY_DIR).filter(f => f.endsWith('.json'));
  
  files.forEach(file => {
    const filePath = path.join(ANCESTRY_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Safety check: Only process files that are arrays (markers list)
    if (!Array.isArray(data)) {
      console.log(`Skipping non-marker file: ${file}`);
      return;
    }
    
    // Infer subRegion from filename if missing or incorrect
    const inferredRegion = file.replace('.json', '').toUpperCase();
    
    const patched = data.map((marker: any) => {
      // Logic: If regional tag mismatches or is missing, override based on inferredRegion
      if (!marker.subRegion || (marker.region === 'African' && marker.subRegion === 'East Asia')) {
        return { 
           ...marker, 
           subRegion: inferredRegion,
           region: marker.region || 'Unknown' 
        };
      }
      return marker;
    });
    
    fs.writeFileSync(filePath, JSON.stringify(patched, null, 2));
    console.log(`Audited and patched ${file}`);
  });
}

// Execute if run directly
auditAndPatch();
