// @ts-ignore
import tsvContent from '../complete_1000_genomes_sample_list_.tsv?raw';

export interface PopulationLookup {
  population_code: string;
  super_population_code: string;
}

const lookupMap = new Map<string, PopulationLookup>();

// Parse TSV once on startup
try {
  const lines = tsvContent.split(/\r?\n/);
  // Header: Sample name	Sex	Biosample ID	Population code	Population name	Superpopulation code...
  // Usually index 0 = Sample name, 3 = Population code, 5 = Superpopulation code
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split('\t');
    if (parts.length >= 6) {
      const sampleId = parts[0].trim();
      const popCode = parts[3].trim();
      const superPopCode = parts[5].trim();
      
      if (sampleId) {
        lookupMap.set(sampleId.toUpperCase(), {
          population_code: popCode,
          super_population_code: superPopCode
        });
      }
    }
  }
  console.log(`📊 PopulationMapper: Successfully mapped ${lookupMap.size} reference samples.`);
} catch (error) {
  console.error('Failed to parse complete_1000_genomes_sample_list_.tsv:', error);
}

/**
 * Returns the subpopulation code and superpopulation code for a given sample ID.
 * Returns null if the sample is not found in the reference list.
 */
export function getPopulationInfo(sampleId: string): PopulationLookup | null {
  if (!sampleId) return null;
  return lookupMap.get(sampleId.trim().toUpperCase()) || null;
}

/**
 * Extracts a candidate sample ID from a filename or string.
 * Looks for standard 1000 Genomes project conventions (e.g., NA12878, HG00105)
 * which consist of 2 letters and 5 digits.
 */
export function extractSampleId(fileName: string): string | null {
  if (!fileName) return null;
  // Look for a pattern like HG00105 or NA12878 (2 letters + 5 digits)
  const match = fileName.match(/[A-Za-z]{2}\d{5}/);
  if (match) return match[0];

  // Fallback: strip the extension and any trailing path components
  const base = fileName.split('/').pop() || fileName;
  return base.replace(/\.[^/.]+$/, "").trim();
}

