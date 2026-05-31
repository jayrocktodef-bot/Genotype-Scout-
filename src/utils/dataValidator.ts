
/**
 * Utility to validate critical data integrity before application runtime.
 * Ensures format, weight, and frequency exist and are of correct type.
 */
import * as fs from 'fs';
import * as path from 'path';

interface AimEntry {
  rsid: string;
  chromosome: string;
  position: number;
  region: string;
  color: string;
  alleles: string[];
  frequencies: Record<string, number>;
  weight: number;
  gene: string;
  trait: string;
  description: string;
  [key: string]: any;
}

export function validateAIMsData(filePath: string) {
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const data: Record<string, AimEntry> = JSON.parse(rawData);
    
    if (typeof data !== 'object' || data === null) {
      throw new Error('Data is not a valid JSON object');
    }

    const errors: string[] = [];
    const requiredFields: (keyof AimEntry)[] = [
      'rsid', 'chromosome', 'position', 'region', 'color', 
      'alleles', 'frequencies', 'weight', 'gene', 'trait', 'description'
    ];

    // Validate entries
    for (const [key, entry] of Object.entries(data)) {
      for (const field of requiredFields) {
        if (entry[field] === undefined || entry[field] === null) {
            errors.push(`Entry ${key} missing required field: ${field}`);
        }
      }
      if (typeof entry.weight !== 'number') {
        errors.push(`Entry ${key} has invalid 'weight' (expected number)`);
      }
      if (typeof entry.frequencies !== 'object' || entry.frequencies === null) {
        errors.push(`Entry ${key} has invalid 'frequencies' object`);
      }
    }

    if (errors.length > 0) {
      console.error(`Found ${errors.length} integrity errors:`);
      errors.slice(0, 10).forEach(e => console.error(` - ${e}`));
      if (errors.length > 10) console.error(` ... and ${errors.length - 10} more.`);
      process.exit(1);
    }

    console.log(`Successfully validated ${Object.keys(data).length} AIM entries.`);
    return true;
  } catch (error) {
    console.error(`Data Integrity Error for ${filePath}:`, error);
    process.exit(1);
  }
}

// Simple usage: run this script as part of build pipeline
validateAIMsData(path.join(process.cwd(), 'src/data/aims/global.json'));
