// Fails the build if any data JSON file is malformed (e.g. truncated writes).
// Guards against the recurring global.json truncation bug.
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/data';
let checked = 0;
const bad = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (p.endsWith('.json')) {
      checked++;
      try {
        JSON.parse(readFileSync(p, 'utf8'));
      } catch (err) {
        bad.push(`  ✗ ${p}: ${err.message}`);
      }
    }
  }
}

walk(ROOT);
console.log(`[validate:json] Checked ${checked} JSON files under ${ROOT}.`);
if (bad.length) {
  console.error(`\n[validate:json] ${bad.length} INVALID JSON file(s):\n${bad.join('\n')}`);
  process.exit(1);
}
console.log('[validate:json] All data JSON files are valid. ✓');
