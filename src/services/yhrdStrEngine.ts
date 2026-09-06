/**
 * 🔬 YHRD (Y-STR Haplotype Reference Database) Forensic & Surname Alignment Engine
 * Reference: YHRD (https://yhrd.org), Roewer et al. / GSU Library Y-DNA Guidelines
 */

export interface YStrLocusProfile {
  locus: string;
  fullName: string;
  mutationRateClass: 'Rapidly Mutating (RM-YSTR)' | 'Moderate Forensic' | 'Standard Baseline';
  typicalRepeatUnit: string;
  hgModalAlleles: Record<string, number | string>; // e.g. R1b: 13, E1b1a: 15
  description: string;
}

export interface YhrdHaplogroupProfile {
  clade: string;
  cladeName: string;
  modalMinimalHaplotype: Record<string, number | string>;
  genealogicalTimeDepth: string;
  surnameProjectStrategy: string;
  yhrdDistributionSummary: string;
}

// Core Forensic Minimal Haplotype (Y-Filer / PowerPlex Y23 standard loci)
export const YHRD_CORE_LOCI: YStrLocusProfile[] = [
  {
    locus: 'DYS393',
    fullName: 'Y-Chromosome STR Locus DYS393',
    mutationRateClass: 'Standard Baseline',
    typicalRepeatUnit: 'AGAT (Tetranucleotide)',
    hgModalAlleles: { 'R1b': 13, 'R1a': 13, 'E1b1a': 13, 'E1b1b': 13, 'I1': 13, 'I2': 13, 'J2': 12, 'Q': 13, 'G2a': 14 },
    description: 'High stability locus; essential component of the international minimal forensic haplotype.'
  },
  {
    locus: 'DYS390',
    fullName: 'Y-Chromosome STR Locus DYS390',
    mutationRateClass: 'Moderate Forensic',
    typicalRepeatUnit: 'TCTG / TCTA (Tetranucleotide)',
    hgModalAlleles: { 'R1b': 24, 'R1a': 25, 'E1b1a': 21, 'E1b1b': 24, 'I1': 22, 'I2': 24, 'J2': 23, 'Q': 24, 'G2a': 22 },
    description: 'Highly diagnostic for major continental branches; differentiates African E1b1a (modal 21) from Eurasian R1b (modal 24).'
  },
  {
    locus: 'DYS19',
    fullName: 'Y-Chromosome STR Locus DYS19 (DYS394)',
    mutationRateClass: 'Moderate Forensic',
    typicalRepeatUnit: 'TAGA (Tetranucleotide)',
    hgModalAlleles: { 'R1b': 14, 'R1a': 16, 'E1b1a': 15, 'E1b1b': 13, 'I1': 14, 'I2': 16, 'J2': 15, 'Q': 13, 'G2a': 15 },
    description: 'Foundational forensic locus; R1a typically carries an elevated repeat value (16) compared to R1b (14).'
  },
  {
    locus: 'DYS391',
    fullName: 'Y-Chromosome STR Locus DYS391',
    mutationRateClass: 'Standard Baseline',
    typicalRepeatUnit: 'TCTA (Tetranucleotide)',
    hgModalAlleles: { 'R1b': 11, 'R1a': 10, 'E1b1a': 10, 'E1b1b': 10, 'I1': 10, 'I2': 10, 'J2': 10, 'Q': 10, 'G2a': 10 },
    description: 'Key standard discriminator; 11 repeats is strongly characteristic of Atlantic R1b lineages.'
  },
  {
    locus: 'DYS385a/b',
    fullName: 'Y-Chromosome Duplicated Locus DYS385',
    mutationRateClass: 'Rapidly Mutating (RM-YSTR)',
    typicalRepeatUnit: 'GAAA (Tetranucleotide Palindrome)',
    hgModalAlleles: { 'R1b': '11,14', 'R1a': '11,14', 'E1b1a': '15,18', 'E1b1b': '11,14', 'I1': '14,14', 'I2': '14,15', 'J2': '14,15', 'Q': '11,13', 'G2a': '14,15' },
    description: 'Duplicated locus with rapid mutation rates; essential for resolving recent surname branches within 3-8 generations.'
  },
  {
    locus: 'DYS392',
    fullName: 'Y-Chromosome STR Locus DYS392',
    mutationRateClass: 'Standard Baseline',
    typicalRepeatUnit: 'TAT (Trinucleotide)',
    hgModalAlleles: { 'R1b': 13, 'R1a': 11, 'E1b1a': 11, 'E1b1b': 11, 'I1': 11, 'I2': 11, 'J2': 11, 'Q': 14, 'G2a': 11, 'N': 16 },
    description: 'Exceptionally slow mutation rate; 13 repeats is unique to R1b, while N carries an extreme allele of 16 repeats.'
  },
  {
    locus: 'DYS439',
    fullName: 'Y-Chromosome STR Locus DYS439 (GATA A4)',
    mutationRateClass: 'Moderate Forensic',
    typicalRepeatUnit: 'GATA (Tetranucleotide)',
    hgModalAlleles: { 'R1b': 12, 'R1a': 10, 'E1b1a': 12, 'E1b1b': 12, 'I1': 11, 'I2': 12, 'J2': 12, 'Q': 12, 'G2a': 12 },
    description: 'Standard Y-Filer locus; distinguishes Scandinavian I1 (modal 11) and Slavic R1a (modal 10).'
  }
];

// YHRD & Surname Project profiles for major paternal haplogroups
const YHRD_HAPLOGROUP_PROFILES: Record<string, YhrdHaplogroupProfile> = {
  'R1B': {
    clade: 'R1b',
    cladeName: 'R-M269 / R-M343',
    modalMinimalHaplotype: { 'DYS393': 13, 'DYS390': 24, 'DYS19': 14, 'DYS391': 11, 'DYS385': '11,14', 'DYS392': 13, 'DYS439': 12 },
    genealogicalTimeDepth: 'Western European Atlantic Modal Haplotype (AMH); lineage expanded massively in Bronze Age (~4,500 BP).',
    surnameProjectStrategy: 'Test 37 to 111 STR markers on FamilyTreeDNA or YHRD to identify exact 17th–19th century British, Irish, French, or German surname clusters.',
    yhrdDistributionSummary: 'Dominates Western European YHRD metapopulations (up to 80% in Ireland, Wales, and Highland Scotland).'
  },
  'R1A': {
    clade: 'R1a',
    cladeName: 'R-M417 / R-M512',
    modalMinimalHaplotype: { 'DYS393': 13, 'DYS390': 25, 'DYS19': 16, 'DYS391': 10, 'DYS385': '11,14', 'DYS392': 11, 'DYS439': 10 },
    genealogicalTimeDepth: 'Corded Ware / Indo-European Steppe expansion (~5,000 BP) to Slavic and Scandinavian medieval horizons.',
    surnameProjectStrategy: 'Compare against Polish, Ukrainian, Scandinavian, and British Isles Norse surname projects.',
    yhrdDistributionSummary: 'High prevalence in Eastern Europe (50-60%), Scandinavia (20%), and Northern India / Pakistan.'
  },
  'E1B1A': {
    clade: 'E1b1a',
    cladeName: 'E-M2 / E-V38',
    modalMinimalHaplotype: { 'DYS393': 13, 'DYS390': 21, 'DYS19': 15, 'DYS391': 10, 'DYS385': '15,18', 'DYS392': 11, 'DYS439': 12 },
    genealogicalTimeDepth: 'Major Niger-Congo and Bantu agricultural expansion (~4,000 BP); primary African American patrilineal ancestor (~60%).',
    surnameProjectStrategy: 'Use 37+ Y-STR matching to locate enslaved ancestors and reconstruct patrilineal surnames across 18th-century Tidewater VA, MD, NC, and SC plantation records.',
    yhrdDistributionSummary: 'Dominates Sub-Saharan West and Central African YHRD population samples (Nigeria, Ghana, Cameroon, Benin).'
  },
  'E1B1B': {
    clade: 'E1b1b',
    cladeName: 'E-M35 / E-M78 / E-V13',
    modalMinimalHaplotype: { 'DYS393': 13, 'DYS390': 24, 'DYS19': 13, 'DYS391': 10, 'DYS385': '11,14', 'DYS392': 11, 'DYS439': 12 },
    genealogicalTimeDepth: 'Afroasiatic and Mediterranean Neolithic expansion (~10,000 – 6,000 BP).',
    surnameProjectStrategy: 'Search Balkan, Greek, Italian, Iberian, and Jewish surname projects on FTDNA and YHRD.',
    yhrdDistributionSummary: 'Frequent in North Africa, Horn of Africa, Balkans (up to 40% in Kosovo/Greece), and Mediterranean basin.'
  },
  'I1': {
    clade: 'I1',
    cladeName: 'I-M253',
    modalMinimalHaplotype: { 'DYS393': 13, 'DYS390': 22, 'DYS19': 14, 'DYS391': 10, 'DYS385': '14,14', 'DYS392': 11, 'DYS439': 11 },
    genealogicalTimeDepth: 'Pre-Viking Scandinavian founder bottleneck (~4,500 BP); dispersed across Europe during the Viking Age.',
    surnameProjectStrategy: 'Trace Scandinavian, Anglo-Saxon, and Norman patrilineal surname trees.',
    yhrdDistributionSummary: 'Dominates Nordic YHRD collections (Sweden 35%, Norway 32%, Denmark 30%).'
  },
  'I2': {
    clade: 'I2',
    cladeName: 'I-M438 / I-M223 / I-P37',
    modalMinimalHaplotype: { 'DYS393': 13, 'DYS390': 24, 'DYS19': 16, 'DYS391': 10, 'DYS385': '14,15', 'DYS392': 11, 'DYS439': 12 },
    genealogicalTimeDepth: 'Indigenous Mesolithic Western Hunter-Gatherer (WHG) lineage with Slavic Dinaric Bronze Age expansions.',
    surnameProjectStrategy: 'Examine Balkan (I2a-Dinaric), Sardinian, and British/Germanic (I2a2-M223) surname groups.',
    yhrdDistributionSummary: 'Dominates Dinaric Alps (Bosnia up to 70%, Croatia 40%) and Sardinia.'
  },
  'J2': {
    clade: 'J2',
    cladeName: 'J-M172',
    modalMinimalHaplotype: { 'DYS393': 12, 'DYS390': 23, 'DYS19': 15, 'DYS391': 10, 'DYS385': '14,15', 'DYS392': 11, 'DYS439': 12 },
    genealogicalTimeDepth: 'Fertile Crescent Neolithic agricultural and maritime Phoenician/Greek expansion.',
    surnameProjectStrategy: 'Check Mediterranean, Italian, Levantine, Caucasus, and Sephardic surname projects.',
    yhrdDistributionSummary: 'High density in Anatolia, Greece, Italy (up to 25%), and the Caucasus.'
  },
  'Q': {
    clade: 'Q',
    cladeName: 'Q-M242 / Q-M3 / Q-L54',
    modalMinimalHaplotype: { 'DYS393': 13, 'DYS390': 24, 'DYS19': 13, 'DYS391': 10, 'DYS385': '11,13', 'DYS392': 14, 'DYS439': 12 },
    genealogicalTimeDepth: 'Indigenous American founder lineage (>15,000 BP) across Beringia and ancient Siberian populations.',
    surnameProjectStrategy: 'Cross-reference Indigenous American tribal rolls, Dawes Commission genealogies, and Siberian/Arctic surname projects.',
    yhrdDistributionSummary: 'Dominates Indigenous North, Central, and South American YHRD cohorts (>85% in Native Mesoamerican/Andean populations).'
  }
};

/**
 * Returns the YHRD forensic profile & surname project recommendations for a Y-DNA haplogroup.
 */
export function getYhrdProfile(haplogroupCode: string): YhrdHaplogroupProfile {
  const clean = haplogroupCode.trim().toUpperCase();

  // 1. Prefix scan (e.g. R1b1a1b -> R1b, E1b1a1 -> E1b1a, I1a -> I1)
  for (const [key, profile] of Object.entries(YHRD_HAPLOGROUP_PROFILES)) {
    if (clean.startsWith(key)) {
      return profile;
    }
  }

  // Fallback generic Y-DNA profile
  return {
    clade: haplogroupCode,
    cladeName: haplogroupCode,
    modalMinimalHaplotype: { 'DYS393': 13, 'DYS390': 24, 'DYS19': 14, 'DYS391': 10, 'DYS385': '11,14', 'DYS392': 11, 'DYS439': 12 },
    genealogicalTimeDepth: 'Ancient patrilineal lineage defined by canonical single nucleotide polymorphisms (SNPs).',
    surnameProjectStrategy: 'Combine Haplotype Scout deep Y-SNP results with 37–111 marker Y-STR tests on YHRD or FTDNA surname projects to identify recent patrilineal cousins and biological surnames.',
    yhrdDistributionSummary: 'Calibrated against global YHRD reference populations.'
  };
}
