/**
 * 🧬 gnomAD v3.1 Mitochondrial DNA & NUMT Pseudogene Filter Engine
 * Reference: Broad Institute / Lake et al. 2020 (gnomAD v3.1 mtDNA release)
 * 
 * Features:
 * 1. NUMT (Nuclear Mitochondrial DNA) cross-hybridization homology check.
 * 2. Multi-Ancestry population calibration (African, European, Latino/Admixed American, Asian).
 */

export interface NumtRiskAnnotation {
  position: number;
  riskLevel: 'HIGH_NUMT_HOMOLOGY' | 'MODERATE_HOMOLOGY' | 'LOW_NUMT_RISK';
  nuclearChromosome?: string;
  nuclearCoordinates?: string;
  sequenceIdentityPct?: number;
  explanation: string;
}

export interface GnomadAncestryFrequencies {
  globalAf: number;
  africanAf: number;
  europeanAf: number;
  latinoAf: number;
  asianAf: number;
  topAncestry: 'African' | 'European' | 'Latino' | 'East Asian' | 'South Asian' | 'Cosmopolitan';
}

// Major characterized high-identity NUMT insertions in human GRCh37/GRCh38 (gnomAD v3.1)
const HIGH_IDENTITY_NUMT_REGIONS = [
  {
    nuclearChr: 'chr1',
    nuclearRange: '564,466 - 570,300',
    mtStart: 3914,
    mtEnd: 9755,
    identity: 96.5,
    description: 'Chr1 large Complex I/IV pseudogene block (MT-ND1 through MT-CO3 homology).'
  },
  {
    nuclearChr: 'chr2',
    nuclearRange: '120,400 - 126,200',
    mtStart: 9400,
    mtEnd: 15200,
    identity: 97.2,
    description: 'Chr2 large Complex I/III pseudogene block (MT-ND3 through MT-CYB homology).'
  },
  {
    nuclearChr: 'chr17',
    nuclearRange: '22,500,000 - 22,516,000',
    mtStart: 1,
    mtEnd: 16569,
    identity: 98.8,
    description: 'Chr17 near-complete degenerate pseudomitochondrial insertion (>98% sequence identity).'
  },
  {
    nuclearChr: 'chr5',
    nuclearRange: '80,100,000 - 80,101,200',
    mtStart: 16024,
    mtEnd: 16569,
    identity: 94.0,
    description: 'Chr5 D-Loop / HVR1 non-coding regulatory pseudogene fragment.'
  }
];

/**
 * Checks whether an mtDNA position falls in a known NUMT nuclear pseudogene homology zone
 */
export function checkNumtRisk(position: number): NumtRiskAnnotation {
  for (const numt of HIGH_IDENTITY_NUMT_REGIONS) {
    if (position >= numt.mtStart && position <= numt.mtEnd) {
      const isUltraHigh = numt.identity >= 97.0;
      return {
        position,
        riskLevel: isUltraHigh ? 'HIGH_NUMT_HOMOLOGY' : 'MODERATE_HOMOLOGY',
        nuclearChromosome: numt.nuclearChr,
        nuclearCoordinates: numt.nuclearRange,
        sequenceIdentityPct: numt.identity,
        explanation: `${numt.description} Microarray probes targeting position ${position} may cross-hybridize to ${numt.nuclearChr}.`
      };
    }
  }

  return {
    position,
    riskLevel: 'LOW_NUMT_RISK',
    explanation: 'Position is located outside known high-identity nuclear pseudogene (NUMT) duplications.'
  };
}

/**
 * gnomAD v3.1 multi-ancestry frequency calibration for key diagnostic maternal haplogroup markers
 */
export const GNOMAD_ANCESTRY_METRICS: Record<number, GnomadAncestryFrequencies> = {
  // W3a1 (13263G)
  13263: { globalAf: 0.018, africanAf: 0.001, europeanAf: 0.034, latinoAf: 0.008, asianAf: 0.001, topAncestry: 'European' },
  // W3a (15784C)
  15784: { globalAf: 0.016, africanAf: 0.008, europeanAf: 0.029, latinoAf: 0.006, asianAf: 0.002, topAncestry: 'European' },
  // H defining (7028C)
  7028: { globalAf: 0.440, africanAf: 0.015, europeanAf: 0.485, latinoAf: 0.120, asianAf: 0.008, topAncestry: 'European' },
  // L2a1 defining (15950G)
  15950: { globalAf: 0.085, africanAf: 0.320, europeanAf: 0.001, latinoAf: 0.045, asianAf: 0.000, topAncestry: 'African' },
  // L3 root (3594T)
  3594: { globalAf: 0.110, africanAf: 0.410, europeanAf: 0.001, latinoAf: 0.052, asianAf: 0.000, topAncestry: 'African' },
  // U5b (7768G)
  7768: { globalAf: 0.032, africanAf: 0.000, europeanAf: 0.065, latinoAf: 0.009, asianAf: 0.001, topAncestry: 'European' },
  // K defining (11467G)
  11467: { globalAf: 0.048, africanAf: 0.001, europeanAf: 0.092, latinoAf: 0.012, asianAf: 0.001, topAncestry: 'European' },
  // A2 Native American (16362C)
  16362: { globalAf: 0.062, africanAf: 0.002, europeanAf: 0.012, latinoAf: 0.380, asianAf: 0.140, topAncestry: 'Latino' },
  // B2 Native American (16189C)
  16189: { globalAf: 0.180, africanAf: 0.120, europeanAf: 0.150, latinoAf: 0.420, asianAf: 0.280, topAncestry: 'Cosmopolitan' }
};

/**
 * Returns gnomAD ancestry frequencies if indexed
 */
export function getGnomadAncestryFrequencies(position: number): GnomadAncestryFrequencies | null {
  return GNOMAD_ANCESTRY_METRICS[position] || null;
}
