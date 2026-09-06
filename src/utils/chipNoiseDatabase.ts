/**
 * Commercial Microarray Platform Noise Database
 * 
 * Curates known platform-specific probe anomalies, cross-hybridization hotspots,
 * and high-error loci across major direct-to-consumer genotyping chips:
 * 1. Illumina Global Screening Array (GSA v1/v2/v3 - 23andMe v5, Ancestry v2)
 * 2. Illumina OmniExpress (23andMe v3/v4, FTDNA earlier chips)
 * 3. Affymetrix Axiom (MyHeritage, FTDNA Family Finder)
 * 
 * In rigorous deconvolution, a single derived call on a known platform-noisy locus
 * is treated with reduced weight to prevent spurious terminal branch calls.
 */

export interface ChipNoiseRecord {
  rsid: string;
  name?: string;
  platforms: string[]; // e.g. ['GSA', 'OmniExpress', 'Affymetrix']
  issue: string;
}

export const KNOWN_CHIP_NOISE_LOCI: Record<string, ChipNoiseRecord> = {
  // GSA known high-error probe artifacts
  'rs9786184': {
    rsid: 'rs9786184',
    name: 'M130',
    platforms: ['GSA', 'OmniExpress'],
    issue: 'Known probe cross-hybridization with homologous sequence on chromosome 1'
  },
  'rs2032666': {
    rsid: 'rs2032666',
    name: 'P25',
    platforms: ['GSA', 'Affymetrix'],
    issue: 'Ampliconic palindrome copy-number crosstalk; elevated false-positive heterozygous calls'
  },
  'rs3900': {
    rsid: 'rs3900',
    name: 'M175_pseudo',
    platforms: ['Affymetrix'],
    issue: 'Probe hybridization artifact on Affymetrix Axiom arrays'
  },
  'rs17250787': {
    rsid: 'rs17250787',
    name: 'CTS10834',
    platforms: ['GSA'],
    issue: 'Repeated non-specific binding on Illumina GSA beadchips'
  },
  'rs34280735': {
    rsid: 'rs34280735',
    name: 'L138',
    platforms: ['OmniExpress'],
    issue: 'High no-call rate and sporadic false transitions on Omni chips'
  }
};

/**
 * Checks if a given marker is known to be prone to platform-specific probe noise.
 */
export function isPlatformNoisyLocus(name: string, rsid?: string, platform?: string): boolean {
  const cleanName = (name || '').trim().toLowerCase();
  const cleanRsid = (rsid || '').trim().toLowerCase();

  for (const record of Object.values(KNOWN_CHIP_NOISE_LOCI)) {
    const matchName = record.name && record.name.toLowerCase() === cleanName;
    const matchRsid = record.rsid.toLowerCase() === cleanRsid;

    if (matchName || matchRsid) {
      if (!platform) return true;
      const cleanPlat = platform.toLowerCase();
      return record.platforms.some(p => cleanPlat.includes(p.toLowerCase()));
    }
  }

  return false;
}

/**
 * Returns the noise record for a locus, if available.
 */
export function getPlatformNoiseRecord(name: string, rsid?: string): ChipNoiseRecord | null {
  const cleanName = (name || '').trim().toLowerCase();
  const cleanRsid = (rsid || '').trim().toLowerCase();

  for (const record of Object.values(KNOWN_CHIP_NOISE_LOCI)) {
    if (
      (record.name && record.name.toLowerCase() === cleanName) ||
      record.rsid.toLowerCase() === cleanRsid
    ) {
      return record;
    }
  }

  return null;
}
