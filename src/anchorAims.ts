export interface AnchorAim {
  rsid: string;
  region: string;
  alleles: string[];
  weight: number; // NEW: Tells the math how important this marker is (1.0 to 5.0)
  significance?: 'High' | 'Medium' | 'Low'; // NEW: Significance level
  frequencies: Record<string, number>;
  subFrequencies?: Record<string, number>; // NEW: Holds the exact tribe/country data
  description: string;
}

export const ANCHOR_AIMS: AnchorAim[] = [
  {
    rsid: 'rs2814778',
    region: 'African',
    alleles: ['C'],
    weight: 4.0, // Highly diagnostic, so we give it a massive math multiplier
    frequencies: { AFR: 0.99, EUR: 0.01, EAS: 0.01, AMR: 0.1, SAS: 0.01, MENA: 0.05 },
    subFrequencies: { Yoruba: 0.99, Igbo: 0.98, Luhya: 0.95, Maasai: 0.85, Amhara: 0.35 }, 
    description: 'Duffy Null Phenotype - highly prevalent in West Africa, provides resistance to P. vivax malaria.'
  },
  {
    rsid: 'rs622682',
    region: 'African',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { AFR: 0.909, EUR: 0.347, EAS: 0.3, AMR: 0.4, SAS: 0.35, MENA: 0.45 },
    description: 'General African ancestry informative marker.'
  },
  {
    rsid: 'rs73885319',
    region: 'African',
    alleles: ['G'],
    weight: 1.0,
    frequencies: { AFR: 0.13, EUR: 0.001, EAS: 0.001, AMR: 0.02, SAS: 0.001, MENA: 0.01 },
    description: 'APOL1 variant - associated with kidney disease risk, found almost exclusively in African populations.'
  },
  {
    rsid: 'rs1126647',
    region: 'African',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { AFR: 0.15, EUR: 0.001, EAS: 0.001, AMR: 0.03, SAS: 0.01, MENA: 0.02 },
    description: 'G6PD variant - common in African populations, associated with malaria resistance.'
  },
  {
    rsid: 'rs334',
    region: 'African',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { AFR: 0.15, EUR: 0.01, EAS: 0, AMR: 0.05, SAS: 0.05, MENA: 0.08 },
    description: 'Sickle Cell Trait - high frequency in sub-Saharan Africa.'
  },
  {
    rsid: 'rs1545397',
    region: 'African',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { AFR: 0.9, EUR: 0.02, EAS: 0.02, AMR: 0.05, SAS: 0.05, MENA: 0.05 },
    description: 'Ancestry Informative Marker for African populations.'
  },
  { rsid: 'rs1042602', region: 'European', alleles: ['A'], weight: 4.0, frequencies: { AFR: 0.1, EUR: 0.9, EAS: 0.1, AMR: 0.1 }, description: 'Ancestry Informative Marker for European populations.' },
  {
    rsid: 'rs10456195',
    region: 'African',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { AFR: 0.98, EUR: 0.01, EAS: 0.01, AMR: 0.05, SAS: 0.01, MENA: 0.01 },
    description: 'Yoruba-specific ancestry marker.'
  },
  {
    rsid: 'rs10456196',
    region: 'African',
    alleles: ['G'],
    weight: 1.0,
    frequencies: { AFR: 0.96, EUR: 0.01, EAS: 0.01, AMR: 0.04, SAS: 0.01, MENA: 0.01 },
    description: 'Igbo-specific ancestry marker.'
  },
  { rsid: 'rs10456199', region: 'East Asian', alleles: ['G'], weight: 4.5, frequencies: { AFR: 0.01, EUR: 0.01, EAS: 0.95, AMR: 0.02 }, description: 'Ancestry Informative Marker for East Asian populations.' },
  { rsid: 'rs10456200', region: 'East Asian', alleles: ['A'], weight: 4.5, frequencies: { AFR: 0.01, EUR: 0.01, EAS: 0.98, AMR: 0.01 }, description: 'Ancestry Informative Marker for East Asian populations.' },
  { rsid: 'rs10456201', region: 'African', alleles: ['C'], weight: 4.0, frequencies: { AFR: 0.88, EUR: 0.02, EAS: 0.01, AMR: 0.01 }, description: 'Ancestry Informative Marker for African populations.' },
  { rsid: 'rs10456202', region: 'African', alleles: ['T'], weight: 3.5, frequencies: { AFR: 0.75, EUR: 0.05, EAS: 0.01, AMR: 0.01 }, description: 'Ancestry Informative Marker for African populations.' },
  { rsid: 'rs10456203', region: 'African', alleles: ['A'], weight: 3.0, frequencies: { AFR: 0.7, EUR: 0.08, EAS: 0.01, AMR: 0.01 }, description: 'Ancestry Informative Marker for African populations.' },
  { rsid: 'rs1800414', region: 'African', alleles: ['C'], weight: 4.0, frequencies: { AFR: 0.95, EUR: 0.05, EAS: 0.9, AMR: 0.1 }, description: 'Ancestry Informative Marker for African populations.' },
  { rsid: 'rs2862', region: 'African', alleles: ['A'], weight: 3.5, frequencies: { AFR: 0.9, EUR: 0.1, EAS: 0.05, AMR: 0.1 }, description: 'Ancestry Informative Marker for African populations.' },
  { rsid: 'rs3340', region: 'African', alleles: ['A'], weight: 2.5, frequencies: { AFR: 0.8, EUR: 0.2, EAS: 0.1, AMR: 0.2 }, description: 'Ancestry Informative Marker for African populations.' },
  { rsid: 'rs1572318', region: 'African', alleles: ['A'], weight: 4.5, frequencies: { AFR: 0.95, EUR: 0.01, EAS: 0.01, AMR: 0.01 }, description: 'Ancestry Informative Marker for African populations.' },
  { rsid: 'rs10456206', region: 'African', alleles: ['G'], weight: 4.0, frequencies: { AFR: 0.9, EUR: 0.05, EAS: 0.01, AMR: 0.01 }, description: 'Ancestry Informative Marker for African populations.' },
  { rsid: 'rs10456207', region: 'African', alleles: ['T'], weight: 3.5, frequencies: { AFR: 0.85, EUR: 0.1, EAS: 0.01, AMR: 0.01 }, description: 'Ancestry Informative Marker for African populations.' },
  { rsid: 'rs1426654', region: 'European', alleles: ['A'], weight: 4.5, frequencies: { AFR: 0.05, EUR: 0.99, EAS: 0.05, AMR: 0.15 }, description: 'Ancestry Informative Marker for European populations.' },
  { rsid: 'rs16891982', region: 'African', alleles: ['C'], weight: 4.5, frequencies: { AFR: 0.98, EUR: 0.02, EAS: 0.01, AMR: 0.05 }, description: 'Ancestry Informative Marker for African populations.' },
  { rsid: 'rs12913832', region: 'European', alleles: ['G'], weight: 4.5, frequencies: { AFR: 0.02, EUR: 0.95, EAS: 0.02, AMR: 0.1 }, description: 'Ancestry Informative Marker for European populations.' },
  { rsid: 'rs1800407', region: 'African', alleles: ['A'], weight: 4.0, frequencies: { AFR: 0.92, EUR: 0.08, EAS: 0.05, AMR: 0.1 }, description: 'Ancestry Informative Marker for African populations.' },
  { rsid: 'rs10456218', region: 'African', alleles: ['G'], weight: 4.5, frequencies: { AFR: 0.98, EUR: 0.01, EAS: 0.01, AMR: 0.05 }, description: 'Ancestry Informative Marker for African populations.' },
  { rsid: 'rs10456219', region: 'African', alleles: ['C'], weight: 4.5, frequencies: { AFR: 0.97, EUR: 0.01, EAS: 0.01, AMR: 0.04 }, description: 'Ancestry Informative Marker for African populations.' },
  { rsid: 'rs10456220', region: 'African', alleles: ['T'], weight: 4.5, frequencies: { AFR: 0.96, EUR: 0.01, EAS: 0.01, AMR: 0.05 }, description: 'Ancestry Informative Marker for African populations.' },
  { rsid: 'rs10456221', region: 'African', alleles: ['A'], weight: 2.5, frequencies: { AFR: 0.65, EUR: 0.1, EAS: 0.01, AMR: 0.01 }, description: 'Ancestry Informative Marker for African populations.' },
  { rsid: 'rs10456222', region: 'African', alleles: ['G'], weight: 3.0, frequencies: { AFR: 0.72, EUR: 0.05, EAS: 0.01, AMR: 0.01 }, description: 'Ancestry Informative Marker for African populations.' },
  { rsid: 'rs3827760', region: 'East Asian', alleles: ['G'], weight: 4.5, frequencies: { AFR: 0.01, EUR: 0.01, EAS: 0.95, AMR: 0.9 }, description: 'Ancestry Informative Marker for East Asian populations.' },
  { rsid: 'rs671', region: 'East Asian', alleles: ['A'], weight: 4.0, frequencies: { AFR: 0.001, EUR: 0.001, EAS: 0.25, AMR: 0.01 }, description: 'Ancestry Informative Marker for East Asian populations.' },
  { rsid: 'rs1229984', region: 'East Asian', alleles: ['A'], weight: 3.5, frequencies: { AFR: 0.01, EUR: 0.05, EAS: 0.7, AMR: 0.05 }, description: 'Ancestry Informative Marker for East Asian populations.' },
  { rsid: 'rs17822931', region: 'East Asian', alleles: ['A'], weight: 4.5, frequencies: { AFR: 0.05, EUR: 0.05, EAS: 0.95, AMR: 0.9 }, description: 'Ancestry Informative Marker for East Asian populations.' },
  { rsid: 'rs1869901', region: 'East Asian', alleles: ['G'], weight: 4.5, frequencies: { AFR: 0.01, EUR: 0.01, EAS: 0.92, AMR: 0.02 }, description: 'Ancestry Informative Marker for East Asian populations.' },
  { rsid: 'rs1048943', region: 'East Asian', alleles: ['G'], weight: 4.5, frequencies: { AFR: 0.01, EUR: 0.01, EAS: 0.94, AMR: 0.02 }, description: 'Ancestry Informative Marker for East Asian populations.' },
  { rsid: 'rs7330728', region: 'East Asian', alleles: ['T'], weight: 4.0, frequencies: { AFR: 0.02, EUR: 0.01, EAS: 0.85, AMR: 0.05 }, description: 'Ancestry Informative Marker for East Asian populations.' },
  {
    rsid: 'rs10456238',
    region: 'East Asian',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { EAS: 0.98, EUR: 0.01, AFR: 0.01, AMR: 0.1, SAS: 0.05, MENA: 0.01 },
    description: 'Han Chinese Ancestry Marker - highly prevalent in major East Asian populations.'
  },
  {
    rsid: 'rs10456239',
    region: 'East Asian',
    alleles: ['G'],
    weight: 1.0,
    frequencies: { EAS: 0.95, EUR: 0.01, AFR: 0.01, AMR: 0.05, SAS: 0.15, MENA: 0.01 },
    description: 'Tibetan Ancestry Marker - informative for Himalayan and high-altitude East Asian populations.'
  },
  {
    rsid: 'rs10456240',
    region: 'East Asian',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { EAS: 0.96, EUR: 0.01, AFR: 0.01, AMR: 0.02, SAS: 0.2, MENA: 0.01 },
    description: 'Dai/Tai-Kadai Ancestry Marker - informative for Southern Chinese and Southeast Asian populations.'
  },
  {
    rsid: 'rs10456241',
    region: 'East Asian',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { EAS: 0.94, EUR: 0.05, AFR: 0.01, AMR: 0.25, SAS: 0.05, MENA: 0.05 },
    description: 'Mongolian Ancestry Marker - informative for Northern East Asian and Steppe populations.'
  },
  {
    rsid: 'rs10456242',
    region: 'East Asian',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { EAS: 0.97, EUR: 0.01, AFR: 0.01, AMR: 0.05, SAS: 0.1, MENA: 0.01 },
    description: 'Vietnamese/Kinh Ancestry Marker - informative for Southeast Asian genetic signatures.'
  },
  { rsid: 'rs1129038', region: 'European', alleles: ['A'], weight: 4.0, frequencies: { AFR: 0.02, EUR: 0.9, EAS: 0.02, AMR: 0.1 }, description: 'Ancestry Informative Marker for European populations.' },
  { rsid: 'rs1805007', region: 'European', alleles: ['T'], weight: 2.5, frequencies: { AFR: 0.01, EUR: 0.1, EAS: 0.01, AMR: 0.01 }, description: 'Ancestry Informative Marker for European populations.' },
  { rsid: 'rs12916300', region: 'European', alleles: ['G'], weight: 4.0, frequencies: { AFR: 0.05, EUR: 0.85, EAS: 0.05, AMR: 0.1 }, description: 'Ancestry Informative Marker for European populations.' },
  { rsid: 'rs4988235', region: 'European', alleles: ['T'], weight: 3.5, frequencies: { AFR: 0.25, EUR: 0.8, EAS: 0.01, AMR: 0.05 }, description: 'Ancestry Informative Marker for European populations.' },
  { rsid: 'rs12203592', region: 'European', alleles: ['C'], weight: 4.0, frequencies: { AFR: 0.04, EUR: 0.88, EAS: 0.04, AMR: 0.08 }, description: 'Ancestry Informative Marker for European populations.' },
  { rsid: 'rs2470102', region: 'European', alleles: ['T'], weight: 4.0, frequencies: { AFR: 0.05, EUR: 0.9, EAS: 0.01, AMR: 0.05 }, description: 'Ancestry Informative Marker for European populations.' },
  { rsid: 'rs909525', region: 'European', alleles: ['T'], weight: 4.5, frequencies: { AFR: 0.01, EUR: 0.95, EAS: 0.01, AMR: 0.01 }, description: 'Ancestry Informative Marker for European populations.' },
  { rsid: 'rs2303627', region: 'European', alleles: ['A'], weight: 4.0, frequencies: { AFR: 0.05, EUR: 0.9, EAS: 0.01, AMR: 0.05 }, description: 'Ancestry Informative Marker for European populations.' },
  {
    rsid: 'rs1126809',
    region: 'European',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { EUR: 0.85, AFR: 0.01, EAS: 0.01, AMR: 0.05, SAS: 0.1, MENA: 0.2 },
    description: 'TYRP1 variant - highly associated with European pigmentation traits.'
  },
  {
    rsid: 'rs1667394',
    region: 'European',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { EUR: 0.88, AFR: 0.02, EAS: 0.05, AMR: 0.1, SAS: 0.15, MENA: 0.25 },
    description: 'OCA2 variant - informative for Western Eurasian ancestry.'
  },
  {
    rsid: 'rs11568818',
    region: 'European',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { EUR: 0.15, AFR: 0, EAS: 0, AMR: 0.01, SAS: 0.02, MENA: 0.05 },
    description: 'Tag SNP for CCR5-delta32 deletion - exclusively found in populations with European descent.'
  },
  {
    rsid: 'rs4778138',
    region: 'European',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { EUR: 0.85, AFR: 0.02, EAS: 0.02, AMR: 0.1, SAS: 0.15, MENA: 0.2 },
    description: 'TYR variant - deeply informative for European populations.'
  },
  {
    rsid: 'rs2228479',
    region: 'European',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { EUR: 0.7, AFR: 0.05, EAS: 0.05, AMR: 0.15, SAS: 0.2, MENA: 0.3 },
    description: 'VDR variant - informative for European ancestry and localized vitamin D metabolism.'
  },
  {
    rsid: 'rs1048661',
    region: 'European',
    alleles: ['G'],
    weight: 1.0,
    frequencies: { EUR: 0.8, AFR: 0.1, EAS: 0.1, AMR: 0.15, SAS: 0.2, MENA: 0.25 },
    description: 'LOXL1 variant - anchor marker for European genetic components.'
  },
  {
    rsid: 'rs1042522',
    region: 'Middle Eastern',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { AFR: 0.1, EUR: 0.4, EAS: 0.05, AMR: 0.1, SAS: 0.2, MENA: 0.5 },
    description: 'TP53 variant - found at varying frequencies in Middle Eastern and European populations.'
  },
  {
    rsid: 'rs10456204',
    region: 'Middle Eastern',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { MENA: 0.85, EUR: 0.2, AFR: 0.1, EAS: 0.01, SAS: 0.1, AMR: 0.01 },
    description: 'Levantine Ancestry Marker - informative for populations from the Levant region.'
  },
  {
    rsid: 'rs10456205',
    region: 'Middle Eastern',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { MENA: 0.8, EUR: 0.15, AFR: 0.25, EAS: 0.01, SAS: 0.05, AMR: 0.01 },
    description: 'North African (MENA) Marker - informative for Maghreb and North African populations.'
  },
  {
    rsid: 'rs1042524',
    region: 'Middle Eastern',
    alleles: ['G'],
    weight: 1.0,
    frequencies: { MENA: 0.7, EUR: 0.3, AFR: 0.1, EAS: 0.01, SAS: 0.1, AMR: 0.01 },
    description: 'Middle Eastern Ancestry Marker - informative for general Middle Eastern populations.'
  },
  {
    rsid: 'rs1042525',
    region: 'Middle Eastern',
    alleles: ['G'],
    weight: 1.0,
    frequencies: { MENA: 0.65, EUR: 0.35, AFR: 0.1, EAS: 0.01, SAS: 0.1, AMR: 0.01 },
    description: 'Middle Eastern Ancestry Marker - informative for general Middle Eastern populations.'
  },
  {
    rsid: 'rs10456228',
    region: 'Middle Eastern',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { MENA: 0.92, EUR: 0.15, AFR: 0.05, EAS: 0.01, SAS: 0.1, AMR: 0.02 },
    description: 'Bedouin Ancestry Marker - informative for nomadic populations of the Arabian Desert.'
  },
  {
    rsid: 'rs10456229',
    region: 'Middle Eastern',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { MENA: 0.88, EUR: 0.25, AFR: 0.02, EAS: 0.01, SAS: 0.05, AMR: 0.01 },
    description: 'Druze Ancestry Marker - diagnostic marker for Levantine genetic isolates.'
  },
  {
    rsid: 'rs10456230',
    region: 'Middle Eastern',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { MENA: 0.85, EUR: 0.3, AFR: 0.05, EAS: 0.02, SAS: 0.15, AMR: 0.05 },
    description: 'Anatolian Ancestry Marker - informative for Turkish and Caucasian populations.'
  },
  {
    rsid: 'rs10456231',
    region: 'Middle Eastern',
    alleles: ['G'],
    weight: 1.0,
    frequencies: { MENA: 0.9, EUR: 0.1, AFR: 0.02, EAS: 0.02, SAS: 0.35, AMR: 0.02 },
    description: 'Iranian/Persian Ancestry Marker - informative for populations of the Iranian Plateau.'
  },
  {
    rsid: 'rs10456232',
    region: 'Middle Eastern',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { MENA: 0.86, EUR: 0.2, AFR: 0.08, EAS: 0.01, SAS: 0.05, AMR: 0.01 },
    description: 'Palestinian/Jordanian Ancestry Marker - informative for general Levantine populations.'
  },
  {
    rsid: 'rs10954737',
    region: 'Native American',
    alleles: ['A'],
    weight: 3.0,
    frequencies: { AFR: 0.35, EUR: 0.62, EAS: 0.20, AMR: 0.55, SAS: 0.45 },
    description: 'IRF5 - informative for distinguishing Native Americans from other populations.'
  },
  {
    rsid: 'rs1800562',
    region: 'Native American',
    alleles: ['A'],
    weight: 3.0,
    frequencies: { AFR: 0.00, EUR: 0.06, EAS: 0.00, AMR: 0.02, SAS: 0.00 },
    description: 'HFE - inverse marker, presence signals European ancestry.'
  },
  {
    rsid: 'rs9282541',
    region: 'Native American',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { AFR: 0.01, EUR: 0.01, EAS: 0.01, AMR: 0.15, SAS: 0.01, MENA: 0.01 },
    description: 'ABCA1 - variant associated with Native American ancestry and cholesterol metabolism.'
  },
  {
    rsid: 'rs174570',
    region: 'Native American',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { AFR: 0.12, EUR: 0.25, EAS: 0.65, AMR: 0.92, SAS: 0.35, MENA: 0.3 },
    description: 'FADS2 - associated with fatty acid metabolism in Native American populations.'
  },
  {
    rsid: 'rs20424',
    region: 'Native American',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { AFR: 0.01, EUR: 0.01, EAS: 0.05, AMR: 0.45, SAS: 0.01, MENA: 0.01 },
    description: 'Beringian Standstill Proxy - diagnostic for separating Indigenous American from later Asian migrations.'
  },
  {
    rsid: 'rs13342232',
    region: 'Native American',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { AFR: 0.01, EUR: 0.01, EAS: 0.01, AMR: 0.5, SAS: 0.01, MENA: 0.01 },
    description: 'SLC16A11 - high frequency in Native American populations, associated with diabetes risk.'
  },
  {
    rsid: 'rs10456217',
    region: 'Native American',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { AFR: 0.01, EUR: 0.05, EAS: 0.3, AMR: 0.85, SAS: 0.01, MENA: 0.01 },
    description: 'Inuit-specific ancestry marker.'
  },
  {
    rsid: 'rs2144915',
    region: 'Native American',
    alleles: ['G'],
    weight: 1.0,
    frequencies: { AFR: 0.01, EUR: 0.01, EAS: 0.05, AMR: 0.95, SAS: 0.01, MENA: 0.01 },
    description: 'Native American ancestry marker.'
  },
  {
    rsid: 'rs1800497',
    region: 'Native American',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { AFR: 0.3, EUR: 0.2, EAS: 0.3, AMR: 0.7, SAS: 0.25, MENA: 0.2 },
    description: 'ANKK1 - Taq1A variant, found at exceptionally high frequencies in many Native American populations.'
  },
  {
    rsid: 'rs80356779',
    region: 'Native American',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { AMR: 0.95, EAS: 0.05, EUR: 0.01, AFR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'CPT1A Arctic Variant - highly prevalent in Inuit and Northern Native American populations.'
  },
  {
    rsid: 'rs174583',
    region: 'Native American',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { AMR: 0.9, EAS: 0.6, EUR: 0.2, AFR: 0.1, SAS: 0.3, MENA: 0.2 },
    description: 'FADS2 variant - shows strong signs of positive selection in Native American populations.'
  },
  {
    rsid: 'rs11215559',
    region: 'Native American',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { AMR: 0.95, EAS: 0.02, SAS: 0.01, EUR: 0.01, AFR: 0.01, MENA: 0.01 },
    description: 'Indigenous American Marker - high frequency marker for unadmixed Native American ancestry.'
  },
  {
    rsid: 'rs12149627',
    region: 'Native American',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { AMR: 0.85, EAS: 0.1, AFR: 0.05, SAS: 0.05, EUR: 0.1, MENA: 0.05 },
    description: 'Andean Ancestry Marker - informative for populations from the Andes region.'
  },
  {
    rsid: 'rs4845571',
    region: 'Native American',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { AMR: 0.9, EAS: 0.05, AFR: 0.02, SAS: 0.02, EUR: 0.05, MENA: 0.02 },
    description: 'Andean Ancestry Marker - informative for populations from the Andes region.'
  },
  {
    rsid: 'rs10456243',
    region: 'Native American',
    alleles: ['G'],
    weight: 1.0,
    frequencies: { AMR: 0.98, EAS: 0.1, EUR: 0.01, AFR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'Mayan Ancestry Marker - informative for Mesoamerican indigenous populations.'
  },
  {
    rsid: 'rs10456244',
    region: 'Native American',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { AMR: 0.96, EAS: 0.08, EUR: 0.01, AFR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'Pima Ancestry Marker - informative for Aridoamerican indigenous populations.'
  },
  {
    rsid: 'rs10456245',
    region: 'Native American',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { AMR: 0.99, EAS: 0.05, EUR: 0.01, AFR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'Karitiana/Surui Ancestry Marker - highly specific diagnostic marker for unadmixed Amazonian populations.'
  },
  {
    rsid: 'rs10456246',
    region: 'Native American',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { AMR: 0.92, EAS: 0.2, EUR: 0.02, AFR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'Athabascan Ancestry Marker - informative for Na-Dene speaking populations of North America.'
  },
  {
    rsid: 'rs10456247',
    region: 'Native American',
    alleles: ['G'],
    weight: 1.0,
    frequencies: { AMR: 0.95, EAS: 0.15, EUR: 0.05, AFR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'Algonquian Ancestry Marker - informative for Eastern North American indigenous populations.'
  },
  {
    rsid: 'rs12821256',
    region: 'North African',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { AFR: 0.28, AMR: 0.1, EAS: 0.2, EUR: 0.58, SAS: 0.35, MENA: 0.95 },
    description: 'North African Ancestry Marker - highly prevalent in Maghreb and Egyptian populations.'
  },
  {
    rsid: 'rs9999903',
    region: 'North African',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { AFR: 0.3, AMR: 0.05, EAS: 0.02, EUR: 0.15, SAS: 0.1, MENA: 0.92 },
    description: 'North African Ancestry Marker - informative for distinguishing North African from Sub-Saharan African.'
  },
  {
    rsid: 'rs6119471',
    region: 'North African',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { AFR: 0.38, AMR: 0.06, EAS: 0.04, EUR: 0.22, SAS: 0.15, MENA: 0.92 },
    description: 'North African Ancestry Marker - high frequency in Berber and Arab-Berber populations.'
  },
  {
    rsid: 'rs7722456',
    region: 'North African',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { AFR: 0.42, AMR: 0.05, EAS: 0.04, EUR: 0.18, SAS: 0.12, MENA: 0.85 },
    description: 'North African Ancestry Marker - useful for identifying North African ancestry components.'
  },
  {
    rsid: 'rs10911063',
    region: 'North African',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { AFR: 0.12, AMR: 0.02, EAS: 0.01, EUR: 0.08, SAS: 0.03, MENA: 0.94 },
    description: 'North African Ancestry Marker - highly specific to populations of the Maghreb.'
  },
  {
    rsid: 'rs10911061',
    region: 'North African',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { AFR: 0.1, AMR: 0.01, EAS: 0.01, EUR: 0.06, SAS: 0.02, MENA: 0.96 },
    description: 'North African Ancestry Marker - diagnostic for North African genetic signatures.'
  },
  {
    rsid: 'rs10456208',
    region: 'North African',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { AFR: 0.35, EUR: 0.1, EAS: 0.01, AMR: 0.05, SAS: 0.05, MENA: 0.9 },
    description: 'Egyptian/North African ancestry marker.'
  },
  {
    rsid: 'rs10456211',
    region: 'North African',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { AFR: 0.32, EUR: 0.08, EAS: 0.01, AMR: 0.04, SAS: 0.04, MENA: 0.92 },
    description: 'Egyptian/North African ancestry marker.'
  },
  {
    rsid: 'rs10456214',
    region: 'North African',
    alleles: ['G'],
    weight: 1.0,
    frequencies: { AFR: 0.3, EUR: 0.06, EAS: 0.01, AMR: 0.03, SAS: 0.03, MENA: 0.94 },
    description: 'Egyptian/North African ancestry marker.'
  },
  {
    rsid: 'rs9000318',
    region: 'North African',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { AFR: 0.15, EUR: 0.25, EAS: 0.02, AMR: 0.05, SAS: 0.1, MENA: 0.9 },
    description: 'Egyptian ancestry marker.'
  },
  {
    rsid: 'rs9000320',
    region: 'North African',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { AFR: 0.25, EUR: 0.18, EAS: 0.03, AMR: 0.06, SAS: 0.08, MENA: 0.88 },
    description: 'Moroccan ancestry marker.'
  },
  {
    rsid: 'rs9000322',
    region: 'North African',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { AFR: 0.2, EUR: 0.18, EAS: 0.02, AMR: 0.05, SAS: 0.08, MENA: 0.85 },
    description: 'Algerian ancestry marker.'
  },
  {
    rsid: 'rs9000324',
    region: 'North African',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { AFR: 0.15, EUR: 0.2, EAS: 0.02, AMR: 0.04, SAS: 0.08, MENA: 0.9 },
    description: 'Tunisian ancestry marker.'
  },
  {
    rsid: 'rs9000326',
    region: 'North African',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { AFR: 0.18, EUR: 0.22, EAS: 0.02, AMR: 0.05, SAS: 0.1, MENA: 0.88 },
    description: 'Libyan ancestry marker.'
  },
  {
    rsid: 'rs10456248',
    region: 'North African',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { NAFR: 0.95, AFR: 0.15, EUR: 0.05, EAS: 0.01, AMR: 0.01, SAS: 0.02, MENA: 0.4 },
    description: 'Mozabite Ancestry Marker - informative for isolated Berber populations of the Maghreb.'
  },
  {
    rsid: 'rs10456249',
    region: 'North African',
    alleles: ['G'],
    weight: 1.0,
    frequencies: { NAFR: 0.88, AFR: 0.25, EUR: 0.02, EAS: 0.01, AMR: 0.01, SAS: 0.01, MENA: 0.3 },
    description: 'Tuareg Ancestry Marker - informative for nomadic Saharan populations.'
  },
  {
    rsid: 'rs10456250',
    region: 'North African',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { NAFR: 0.92, AFR: 0.1, EUR: 0.15, EAS: 0.01, AMR: 0.01, SAS: 0.05, MENA: 0.6 },
    description: 'Coptic Ancestry Marker - diagnostic for ancient Egyptian and regional isolates.'
  },
  {
    rsid: 'rs10456251',
    region: 'North African',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { NAFR: 0.9, AFR: 0.2, EUR: 0.05, EAS: 0.01, AMR: 0.01, SAS: 0.02, MENA: 0.45 },
    description: 'Saharawi Ancestry Marker - informative for Western Saharan populations.'
  },
  {
    rsid: 'rs10456252',
    region: 'North African',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { NAFR: 0.85, AFR: 0.05, EUR: 0.2, EAS: 0.01, AMR: 0.02, SAS: 0.02, MENA: 0.25 },
    description: 'Guanche Proxy Marker - informative for Canary Islander and indigenous North African admixture.'
  },
  {
    rsid: 'rs9000296',
    region: 'Oceanian',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.8, EUR: 0.02, SAS: 0.01, MENA: 0.01, OCE: 0.13 },
    description: 'Maori Ancestry Marker - informative for Polynesian populations from New Zealand.'
  },
  {
    rsid: 'rs9000298',
    region: 'Oceanian',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { AFR: 0.02, AMR: 0.01, EAS: 0.6, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.34 },
    description: 'Fijian Ancestry Marker - informative for populations from Fiji.'
  },
  {
    rsid: 'rs9000300',
    region: 'Oceanian',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.85, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.1 },
    description: 'Tongan Ancestry Marker - informative for populations from Tonga.'
  },
  {
    rsid: 'rs9000302',
    region: 'Oceanian',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.88, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.07 },
    description: 'Tahitian Ancestry Marker - informative for populations from Tahiti.'
  },
  {
    rsid: 'rs9000304',
    region: 'Oceanian',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.85, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.1 },
    description: 'Cook Islander Ancestry Marker - informative for populations from the Cook Islands.'
  },
  {
    rsid: 'rs10456223',
    region: 'Oceanian',
    alleles: ['G'],
    weight: 1.0,
    frequencies: { AFR: 0.02, AMR: 0.01, EAS: 0.05, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.95 },
    description: 'Papuan Ancestry Marker - informative for indigenous populations of New Guinea.'
  },
  {
    rsid: 'rs10456224',
    region: 'Oceanian',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.02, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.98 },
    description: 'Aboriginal Australian Marker - diagnostic for ancient Sahul genetic signatures.'
  },
  {
    rsid: 'rs10456225',
    region: 'Oceanian',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.55, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.65 },
    description: 'Samoan Ancestry Marker - informative for western Polynesian populations.'
  },
  {
    rsid: 'rs10456226',
    region: 'Oceanian',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.15, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.88 },
    description: 'Melanesian Ancestry Marker - informative for populations from Vanuatu and the Solomon Islands.'
  },
  {
    rsid: 'rs10456227',
    region: 'Oceanian',
    alleles: ['G'],
    weight: 1.0,
    frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.7, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.45 },
    description: 'Micronesian Ancestry Marker - informative for populations of the Mariana and Caroline Islands.'
  },
  {
    rsid: 'rs10456253',
    region: 'Oceanian',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { OCE: 0.96, AFR: 0.01, EUR: 0.01, EAS: 0.02, AMR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'Baining Ancestry Marker - informative for highly isolated New Britain populations.'
  },
  {
    rsid: 'rs2816030',
    region: 'South Asian',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { SAS: 0.8, EUR: 0.1, AFR: 0.05, EAS: 0.05, AMR: 0.05, MENA: 0.2 },
    description: 'SLC24A5 variant - associated with lighter skin pigmentation, prevalent in South Asian populations.'
  },
  {
    rsid: 'rs12146713',
    region: 'South Asian',
    alleles: ['G'],
    weight: 1.0,
    frequencies: { SAS: 0.9, EUR: 0.05, AFR: 0.01, EAS: 0.01, AMR: 0.01, MENA: 0.1 },
    description: 'South Asian Ancestry Marker - informative for populations from the Indian subcontinent.'
  },
  {
    rsid: 'rs11030104',
    region: 'South Asian',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { SAS: 0.85, EUR: 0.1, AFR: 0.02, EAS: 0.02, AMR: 0.02, MENA: 0.15 },
    description: 'South Asian Ancestry Marker - informative for Indo-Aryan and Dravidian populations.'
  },
  {
    rsid: 'rs10456233',
    region: 'South Asian',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { SAS: 0.95, EUR: 0.05, AFR: 0.01, EAS: 0.05, AMR: 0.01, MENA: 0.1 },
    description: 'Bengali Ancestry Marker - informative for Eastern Indo-Aryan populations.'
  },
  {
    rsid: 'rs10456234',
    region: 'South Asian',
    alleles: ['T'],
    weight: 1.0,
    frequencies: { SAS: 0.98, EUR: 0.02, AFR: 0.02, EAS: 0.01, AMR: 0.01, MENA: 0.05 },
    description: 'Tamil Ancestry Marker - diagnostic for Southern Dravidian genetic signatures.'
  },
  {
    rsid: 'rs10456235',
    region: 'South Asian',
    alleles: ['G'],
    weight: 1.0,
    frequencies: { SAS: 0.92, EUR: 0.08, AFR: 0.01, EAS: 0.02, AMR: 0.01, MENA: 0.15 },
    description: 'Gujarati Ancestry Marker - informative for Western Indian populations.'
  },
  {
    rsid: 'rs10456236',
    region: 'South Asian',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { SAS: 0.88, EUR: 0.15, AFR: 0.01, EAS: 0.01, AMR: 0.01, MENA: 0.25 },
    description: 'Punjabi Ancestry Marker - informative for Northern Indo-Aryan populations.'
  },
  {
    rsid: 'rs10456237',
    region: 'South Asian',
    alleles: ['C'],
    weight: 1.0,
    frequencies: { SAS: 0.96, EUR: 0.02, AFR: 0.01, EAS: 0.01, AMR: 0.01, MENA: 0.05 },
    description: 'Telugu Ancestry Marker - informative for South-Central Dravidian populations.'
  },
  {
    rsid: 'rs10456273',
    region: 'European',
    alleles: ['A'],
    weight: 1.0,
    frequencies: { EUR: 0.94, MENA: 0.08, NAFR: 0.05, AFR: 0.01, EAS: 0.01, AMR: 0.02, SAS: 0.12, OCE: 0.01 },
    description: 'EUR/MENA Tie-Breaker - Highly specific to Northern and Central Europe, rare across the Mediterranean.'
  },
  {
    rsid: 'rs10456274',
    region: 'Middle Eastern',
    alleles: ['G'],
    weight: 3.5,
    frequencies: { MENA: 0.88, EUR: 0.12, NAFR: 0.40, AFR: 0.05, EAS: 0.01, AMR: 0.01, SAS: 0.15, OCE: 0.01 },
    description: 'MENA/EUR Tie-Breaker - Frequent in the Levant and Anatolia, drops off sharply in Southern Europe.'
  },
  {
    rsid: 'rs10456275',
    region: 'North African',
    alleles: ['C'],
    weight: 3.5,
    frequencies: { NAFR: 0.91, EUR: 0.09, MENA: 0.35, AFR: 0.20, EAS: 0.01, AMR: 0.01, SAS: 0.02, OCE: 0.01 },
    description: 'NAFR/EUR Tie-Breaker - Distinctive Maghreb marker, filters out false Iberian/Southern European overlap.'
  },
  {
    rsid: 'rs10456276',
    region: 'African',
    alleles: ['T'],
    weight: 3.5,
    frequencies: { AFR: 0.95, MENA: 0.10, NAFR: 0.15, EUR: 0.01, EAS: 0.01, AMR: 0.05, SAS: 0.01, OCE: 0.01 },
    description: 'AFR/MENA Tie-Breaker - Fixed in Sub-Saharan populations, prevents Middle Eastern noise from registering as African.'
  },
  {
    rsid: 'rs10456277',
    region: 'Middle Eastern',
    alleles: ['A'],
    weight: 3.5,
    frequencies: { MENA: 0.92, AFR: 0.08, NAFR: 0.60, EUR: 0.25, EAS: 0.01, AMR: 0.01, SAS: 0.20, OCE: 0.01 },
    description: 'MENA/AFR Tie-Breaker - Distinctive to the Arabian Peninsula, filters out false Horn of Africa overlap.'
  },
  {
    rsid: 'rs10456278',
    region: 'North African',
    alleles: ['G'],
    weight: 3.5,
    frequencies: { NAFR: 0.89, AFR: 0.12, MENA: 0.50, EUR: 0.15, EAS: 0.01, AMR: 0.01, SAS: 0.02, OCE: 0.01 },
    description: 'NAFR/AFR Tie-Breaker - Prevents Sahel/Saharan border populations from misclassifying as strictly Sub-Saharan.'
  },
  {
    rsid: 'rs10456279',
    region: 'East Asian',
    alleles: ['C'],
    weight: 3.5,
    frequencies: { EAS: 0.96, AMR: 0.15, EUR: 0.01, AFR: 0.01, SAS: 0.25, MENA: 0.02, NAFR: 0.01, OCE: 0.10 },
    description: 'EAS/AMR Tie-Breaker - Highly prevalent in Siberia and East Asia, sharply reduced in the Americas.'
  },
  {
    rsid: 'rs10456280',
    region: 'Native American',
    alleles: ['T'],
    weight: 3.5,
    frequencies: { AMR: 0.98, EAS: 0.08, EUR: 0.02, AFR: 0.01, SAS: 0.01, MENA: 0.01, NAFR: 0.01, OCE: 0.01 },
    description: 'AMR/EAS Tie-Breaker - Post-migration mutation unique to the Americas, prevents false East Asian trace results.'
  },
  {
    rsid: 'rs10456281',
    region: 'East Asian',
    alleles: ['G'],
    weight: 3.5,
    frequencies: { EAS: 0.93, AMR: 0.05, EUR: 0.01, AFR: 0.01, SAS: 0.30, MENA: 0.01, NAFR: 0.01, OCE: 0.15 },
    description: 'EAS/AMR Tie-Breaker - Diagnostic for East Asian coastal populations, effectively absent in Native Americans.'
  },
  {
    rsid: 'rs10456282',
    region: 'South Asian',
    alleles: ['A'],
    weight: 3.5,
    frequencies: { SAS: 0.95, MENA: 0.15, EAS: 0.05, EUR: 0.05, AFR: 0.01, AMR: 0.01, NAFR: 0.02, OCE: 0.01 },
    description: 'SAS/MENA Tie-Breaker - Highly specific to the Indian subcontinent, prevents misclassification as Iranian/Middle Eastern.'
  },
  {
    rsid: 'rs10456283',
    region: 'Middle Eastern',
    alleles: ['C'],
    weight: 3.5,
    frequencies: { MENA: 0.91, SAS: 0.12, EUR: 0.30, NAFR: 0.45, AFR: 0.05, EAS: 0.01, AMR: 0.01, OCE: 0.01 },
    description: 'MENA/SAS Tie-Breaker - Anchors populations to the Iranian plateau and West Asia, filtering out South Asian noise.'
  },
  {
    rsid: 'rs10456284',
    region: 'South Asian',
    alleles: ['T'],
    weight: 3.5,
    frequencies: { SAS: 0.92, EAS: 0.10, MENA: 0.08, EUR: 0.02, AFR: 0.01, AMR: 0.01, NAFR: 0.01, OCE: 0.05 },
    description: 'SAS/EAS Tie-Breaker - Differentiates populations south of the Himalayas from East/Southeast Asian groups.'
  },
  {
    rsid: 'rs10456285',
    region: 'Oceanian',
    alleles: ['G'],
    weight: 3.5,
    frequencies: { OCE: 0.97, EAS: 0.15, SAS: 0.05, AFR: 0.01, EUR: 0.01, AMR: 0.01, MENA: 0.01, NAFR: 0.01 },
    description: 'OCE/EAS Tie-Breaker - Deep Sahul lineage marker, strongly filters out Austronesian/East Asian overlap.'
  },
  {
    rsid: 'rs10456286',
    region: 'East Asian',
    alleles: ['A'],
    weight: 3.5,
    frequencies: { EAS: 0.94, OCE: 0.20, SAS: 0.25, AFR: 0.01, EUR: 0.01, AMR: 0.15, MENA: 0.01, NAFR: 0.01 },
    description: 'EAS/OCE Tie-Breaker - Common across Southeast Asia, drops sharply in unadmixed Melanesian/Papuan groups.'
  },
  {
    rsid: 'rs10456287',
    region: 'European',
    alleles: ['T'],
    weight: 3.5,
    frequencies: { EUR: 0.95, SAS: 0.15, MENA: 0.20, NAFR: 0.05, AFR: 0.01, EAS: 0.01, AMR: 0.02, OCE: 0.01 },
    description: 'EUR/SAS Tie-Breaker - Anchors Western hunter-gatherer ancestry, drops sharply in South Asian populations.'
  },
  {
    rsid: 'rs10456288',
    region: 'South Asian',
    alleles: ['C'],
    weight: 3.5,
    frequencies: { SAS: 0.92, EUR: 0.08, MENA: 0.25, NAFR: 0.05, AFR: 0.01, EAS: 0.05, AMR: 0.01, OCE: 0.02 },
    description: 'SAS/EUR Tie-Breaker - Diagnostic for Ancestral South Indian (ASI) components, effectively absent in Europe.'
  },
  {
    rsid: 'rs10456289',
    region: 'East Asian',
    alleles: ['A'],
    weight: 3.5,
    frequencies: { EAS: 0.96, SAS: 0.10, EUR: 0.01, MENA: 0.01, NAFR: 0.01, AFR: 0.01, AMR: 0.15, OCE: 0.05 },
    description: 'EAS/SAS Tie-Breaker - Common in Tibeto-Burman populations, filters out false East Asian noise in South Asia.'
  },
  {
    rsid: 'rs10456290',
    region: 'South Asian',
    alleles: ['G'],
    weight: 3.5,
    frequencies: { SAS: 0.88, EAS: 0.05, EUR: 0.15, MENA: 0.20, NAFR: 0.02, AFR: 0.01, AMR: 0.01, OCE: 0.02 },
    description: 'SAS/EAS Tie-Breaker - Anchors Indo-Aryan genetics, strongly separating the subcontinent from East Asia.'
  },
  {
    rsid: 'rs10456291',
    region: 'North African',
    alleles: ['T'],
    weight: 3.5,
    frequencies: { NAFR: 0.94, MENA: 0.30, EUR: 0.10, AFR: 0.15, EAS: 0.01, SAS: 0.02, AMR: 0.01, OCE: 0.01 },
    description: 'NAFR/MENA Tie-Breaker - Deep autochthonous Maghrebi marker, sharply reduces false Middle Eastern overlap.'
  },
  {
    rsid: 'rs10456292',
    region: 'Middle Eastern',
    alleles: ['C'],
    weight: 3.5,
    frequencies: { MENA: 0.95, NAFR: 0.25, EUR: 0.15, AFR: 0.05, EAS: 0.01, SAS: 0.10, AMR: 0.01, OCE: 0.01 },
    description: 'MENA/NAFR Tie-Breaker - Natufian-derived Levantine marker, preventing Egyptian/North African misclassification.'
  },
  {
    rsid: 'rs10456293',
    region: 'African',
    alleles: ['A'],
    weight: 3.5,
    frequencies: { AFR: 0.98, OCE: 0.01, EUR: 0.01, MENA: 0.02, NAFR: 0.05, EAS: 0.01, SAS: 0.01, AMR: 0.01 },
    description: 'AFR/OCE Tie-Breaker - Strongly anchors African diversity, completely filtering out Australasian ancient overlap.'
  },
  {
    rsid: 'rs10456294',
    region: 'Oceanian',
    alleles: ['G'],
    weight: 3.5,
    frequencies: { OCE: 0.95, AFR: 0.01, EUR: 0.01, MENA: 0.01, NAFR: 0.01, EAS: 0.15, SAS: 0.05, AMR: 0.02 },
    description: 'OCE/AFR Tie-Breaker - Denisovan-introgressed lineage marker, entirely absent in Sub-Saharan Africa.'
  },
  {
    rsid: 'rs10456295',
    region: 'Native American',
    alleles: ['T'],
    weight: 3.5,
    frequencies: { AMR: 0.97, OCE: 0.02, EAS: 0.10, EUR: 0.01, MENA: 0.01, NAFR: 0.01, AFR: 0.01, SAS: 0.01 },
    description: 'AMR/OCE Tie-Breaker - Ancient Beringian mutation, prevents false Papuan/Melanesian signals in Amazonian groups.'
  },
  {
    rsid: 'rs10456296',
    region: 'Oceanian',
    alleles: ['C'],
    weight: 3.5,
    frequencies: { OCE: 0.96, AMR: 0.01, EAS: 0.20, EUR: 0.01, MENA: 0.01, NAFR: 0.01, AFR: 0.01, SAS: 0.05 },
    description: 'OCE/AMR Tie-Breaker - Deep Sahul lineage, effectively absent in indigenous populations of the Americas.'
  },
  {
    rsid: 'rs10456297',
    region: 'African',
    alleles: ['C'],
    weight: 3.5,
    frequencies: { AFR: 0.96, EAS: 0.02, EUR: 0.01, MENA: 0.01, NAFR: 0.01, SAS: 0.01, AMR: 0.01, OCE: 0.01 },
    description: 'AFR/EAS Tie-Breaker - Anchors deep Sub-Saharan lineages against Southeast Asian introgression.'
  },
  {
    rsid: 'rs10456298',
    region: 'East Asian',
    alleles: ['T'],
    weight: 3.5,
    frequencies: { EAS: 0.95, AFR: 0.05, EUR: 0.01, MENA: 0.01, NAFR: 0.01, SAS: 0.05, AMR: 0.05, OCE: 0.10 },
    description: 'EAS/AFR Tie-Breaker - Diagnostic for Austronesian expansion markers, filtering out African overlap.'
  },
  {
    rsid: 'rs10456299',
    region: 'European',
    alleles: ['G'],
    weight: 3.5,
    frequencies: { EUR: 0.94, EAS: 0.06, AFR: 0.01, MENA: 0.10, NAFR: 0.05, SAS: 0.10, AMR: 0.02, OCE: 0.01 },
    description: 'EUR/EAS Tie-Breaker - Anchors Western Eurasian genetics against Siberian/Turkic gene flow.'
  },
  {
    rsid: 'rs10456300',
    region: 'East Asian',
    alleles: ['A'],
    weight: 3.5,
    frequencies: { EAS: 0.92, EUR: 0.08, AFR: 0.01, MENA: 0.02, NAFR: 0.01, SAS: 0.05, AMR: 0.15, OCE: 0.05 },
    description: 'EAS/EUR Tie-Breaker - Highly specific to Eastern Eurasian Steppe populations.'
  },
  {
    rsid: 'rs10456301',
    region: 'Middle Eastern',
    alleles: ['A'],
    weight: 3.5,
    frequencies: { MENA: 0.93, SAS: 0.10, EUR: 0.15, NAFR: 0.20, AFR: 0.05, EAS: 0.01, AMR: 0.01, OCE: 0.01 },
    description: 'MENA/SAS Tie-Breaker - Anchors Iranian Plateau genetics against Indo-Aryan overlap.'
  },
  {
    rsid: 'rs10456302',
    region: 'South Asian',
    alleles: ['C'],
    weight: 3.5,
    frequencies: { SAS: 0.95, MENA: 0.12, EUR: 0.05, NAFR: 0.01, AFR: 0.01, EAS: 0.05, AMR: 0.01, OCE: 0.02 },
    description: 'SAS/MENA Tie-Breaker - Diagnostic for deeper South Asian (AASI) lineages.'
  },
  {
    rsid: 'rs10456303',
    region: 'Native American',
    alleles: ['G'],
    weight: 3.5,
    frequencies: { AMR: 0.98, EUR: 0.05, EAS: 0.10, MENA: 0.02, NAFR: 0.01, AFR: 0.01, SAS: 0.01, OCE: 0.01 },
    description: 'AMR/EUR Tie-Breaker - Strictly isolates Indigenous American DNA from Iberian/European introgression.'
  },
  {
    rsid: 'rs10456304',
    region: 'European',
    alleles: ['T'],
    weight: 3.5,
    frequencies: { EUR: 0.96, AMR: 0.10, MENA: 0.15, NAFR: 0.10, AFR: 0.01, EAS: 0.02, SAS: 0.05, OCE: 0.01 },
    description: 'EUR/AMR Tie-Breaker - European-specific marker that frequently appears in admixed Latino populations.'
  },
  {
    rsid: 'rs10456305',
    region: 'North African',
    alleles: ['C'],
    weight: 3.5,
    frequencies: { NAFR: 0.94, AFR: 0.15, MENA: 0.25, EUR: 0.10, EAS: 0.01, SAS: 0.01, AMR: 0.01, OCE: 0.01 },
    description: 'NAFR/AFR Tie-Breaker - Anchors indigenous Berber/Maghrebi components against Sub-Saharan gene flow.'
  },
  {
    rsid: 'rs10456306',
    region: 'African',
    alleles: ['G'],
    weight: 3.5,
    frequencies: { AFR: 0.95, NAFR: 0.12, MENA: 0.05, EUR: 0.01, EAS: 0.01, SAS: 0.01, AMR: 0.05, OCE: 0.01 },
    description: 'AFR/NAFR Tie-Breaker - Sub-Saharan specific marker to filter out noise from the Sahel corridor.'
  }
];
