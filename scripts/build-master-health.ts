import fs from 'fs';
import path from 'path';

const RAW_DIR = path.join(process.cwd(), 'src/data/raw_health');
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/master_health_pgx.json');

function main() {
  const master: Record<string, any> = {};

  if (!fs.existsSync(RAW_DIR)) {
    console.error(`❌ Directory not found: ${RAW_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(RAW_DIR).filter(file => file.endsWith('.json'));

  files.forEach(file => {
    const filePath = path.join(RAW_DIR, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (file === 'blood_markers.json') {
      // Array of objects with rsid field
      content.forEach((marker: any) => {
        const rsid = marker.rsid;
        if (rsid) {
          master[rsid] = { 
            ...(master[rsid] || {}), 
            ...marker, 
            _source: file 
          };
        }
      });
    } else if (file === 'autoimmune_hla_panel.json') {
      // Flat object keyed by rsid
      Object.entries(content).forEach(([rsid, data]: [string, any]) => {
        master[rsid] = { 
          ...(master[rsid] || {}), 
          ...(data as any), 
          _source: file 
        };
      });
    } else {
      // Nested objects (clinical_health.json: category/rsid, pharmacogenomics.json: drug/rsid)
      Object.entries(content).forEach(([group, markers]: [string, any]) => {
        if (typeof markers === 'object' && markers !== null) {
          Object.entries(markers).forEach(([rsid, data]: [string, any]) => {
            master[rsid] = { 
              ...(master[rsid] || {}), 
              ...(data as any), 
              _group: group,
              _source: file 
            };
          });
        }
      });
    }
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(master, null, 2));
  console.log(`✅ Master health file generated at ${OUTPUT_FILE} with ${Object.keys(master).length} markers.`);
}

main();
