/**
 * 🧬 HelixMTdb (Helix Mitochondrial Database) Population Frequency Engine
 * Dataset: 195,983 high-depth sequenced individuals (Bolze et al. 2020)
 */

export interface HelixVariantFrequency {
  pos: number;
  ref: string;
  alt: string;
  gene: string;
  feature: string;
  hom: number;
  afHom: number;
  het: number;
  afHet: number;
  topHaplos: [string, number][];
}

let cachedHelixDb: Record<string, HelixVariantFrequency> | null = null;
let loadPromise: Promise<Record<string, HelixVariantFrequency>> | null = null;

export async function loadHelixDatabase(): Promise<Record<string, HelixVariantFrequency>> {
  if (cachedHelixDb) return cachedHelixDb;
  if (loadPromise) return loadPromise;

  loadPromise = fetch('/data/helix_mtdna_freqs.json')
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load HelixMTdb: ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      cachedHelixDb = data;
      return data;
    })
    .catch(err => {
      console.warn('HelixMTdb loading skipped or failed:', err);
      return {};
    });

  return loadPromise;
}

/**
 * Synchronously look up HelixMTdb stats if already loaded
 */
export function getCachedHelixFrequency(pos: number, ref?: string, alt?: string): HelixVariantFrequency | null {
  if (!cachedHelixDb) return null;

  if (ref && alt) {
    const key = `${pos}_${ref.toUpperCase()}>${alt.toUpperCase()}`;
    if (cachedHelixDb[key]) return cachedHelixDb[key];
  }

  // Fallback: search by position prefix
  const prefix = `${pos}_`;
  for (const [key, val] of Object.entries(cachedHelixDb)) {
    if (key.startsWith(prefix)) {
      if (!alt || val.alt.toUpperCase() === alt.toUpperCase()) {
        return val;
      }
    }
  }

  return null;
}
