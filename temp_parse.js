
  const ANCHOR_AIMS = [
  // --- AFRICAN (AFR) ---
  {
    rsid: 'rs2814778',
    region: 'African',
    alleles: ['C'],
    frequencies: { AFR: 0.99, EUR: 0.01, EAS: 0.01, AMR: 0.1, SAS: 0.01, MENA: 0.05 },
    description: 'Duffy Null Phenotype - highly prevalent in West Africa, provides resistance to P. vivax malaria.'
  },
  {
    rsid: 'rs622682',
    region: 'African',
    alleles: ['A'],
    frequencies: { AFR: 0.909, EUR: 0.347, EAS: 0.3, AMR: 0.4, SAS: 0.35, MENA: 0.45 },
    description: 'General African ancestry informative marker.'
  },
  {
    rsid: 'rs73885319',
    region: 'African',
    alleles: ['G'],
    frequencies: { AFR: 0.13, EUR: 0.001, EAS: 0.001, AMR: 0.02, SAS: 0.001, MENA: 0.01 },
    description: 'APOL1 variant - associated with kidney disease risk, found almost exclusively in African populations.'
  },
  {
    rsid: 'rs1126647',
    region: 'African',
    alleles: ['A'],
    frequencies: { AFR: 0.15, EUR: 0.001, EAS: 0.001, AMR: 0.03, SAS: 0.01, MENA: 0.02 },
    description: 'G6PD variant - common in African populations, associated with malaria resistance.'
  },
  {
    rsid: 'rs334',
    region: 'African',
    alleles: ['T'],
    frequencies: { AFR: 0.15, EUR: 0.01, EAS: 0, AMR: 0.05, SAS: 0.05, MENA: 0.08 },
    description: 'Sickle Cell Trait - high frequency in sub-Saharan Africa.'
  },
  {
    rsid: 'rs1545397',
    region: 'African',
    alleles: ['A'],
    frequencies: { AFR: 0.9, EUR: 0.02, EAS: 0.02, AMR: 0.05, SAS: 0.05, MENA: 0.05 },
    description: 'Ancestry Informative Marker for African populations.'
  },
  {
    rsid: 'rs1042602',
    region: 'African',
    alleles: ['C'],
    frequencies: { AFR: 0.95, EUR: 0.05, EAS: 0.05, AMR: 0.05, SAS: 0.1, MENA: 0.1 },
    description: 'Ancestry Informative Marker for African populations.'
  },
  {
    rsid: 'rs10456195',
    region: 'African',
    alleles: ['A'],
    frequencies: { AFR: 0.98, EUR: 0.01, EAS: 0.01, AMR: 0.05, SAS: 0.01, MENA: 0.01 },
    description: 'Yoruba-specific ancestry marker.'
  },
  {
    rsid: 'rs10456196',
    region: 'African',
    alleles: ['G'],
    frequencies: { AFR: 0.96, EUR: 0.01, EAS: 0.01, AMR: 0.04, SAS: 0.01, MENA: 0.01 },
    description: 'Igbo-specific ancestry marker.'
  },
  {
    rsid: 'rs10456199',
    region: 'African',
    alleles: ['A'],
    frequencies: { AFR: 0.95, EUR: 0.01, EAS: 0.01, AMR: 0.05, SAS: 0.01, MENA: 0.01 },
    description: 'Mende-specific ancestry marker.'
  },
  {
    rsid: 'rs10456200',
    region: 'African',
    alleles: ['G'],
    frequencies: { AFR: 0.92, EUR: 0.01, EAS: 0.01, AMR: 0.02, SAS: 0.05, MENA: 0.02 },
    description: 'Luhya-specific ancestry marker.'
  },
  {
    rsid: 'rs10456201',
    region: 'African',
    alleles: ['C'],
    frequencies: { AFR: 0.88, EUR: 0.02, EAS: 0.01, AMR: 0.01, SAS: 0.08, MENA: 0.05 },
    description: 'Maasai-specific ancestry marker.'
  },
  {
    rsid: 'rs10456202',
    region: 'African',
    alleles: ['T'],
    frequencies: { AFR: 0.75, EUR: 0.05, EAS: 0.01, AMR: 0.01, SAS: 0.1, MENA: 0.25 },
    description: 'Somali-specific ancestry marker.'
  },
  {
    rsid: 'rs10456203',
    region: 'African',
    alleles: ['A'],
    frequencies: { AFR: 0.7, EUR: 0.08, EAS: 0.01, AMR: 0.01, SAS: 0.12, MENA: 0.3 },
    description: 'Ethiopian-specific ancestry marker.'
  },
  {
    rsid: 'rs10456218',
    region: 'African / Oceanian',
    alleles: ['G'],
    frequencies: { AFR: 0.98, EUR: 0.01, EAS: 0.01, AMR: 0.05, SAS: 0.01, MENA: 0.01, OCE: 0.05 },
    description: 'Ancestry Informative Marker for West African and Papuan populations.'
  },
  {
    rsid: 'rs10456219',
    region: 'African / Oceanian',
    alleles: ['C'],
    frequencies: { AFR: 0.97, EUR: 0.01, EAS: 0.01, AMR: 0.04, SAS: 0.01, MENA: 0.01, OCE: 0.02 },
    description: 'Ancestry Informative Marker for West African and Aboriginal Australian populations.'
  },
  {
    rsid: 'rs10456220',
    region: 'African / Oceanian',
    alleles: ['T'],
    frequencies: { AFR: 0.96, EUR: 0.01, EAS: 0.01, AMR: 0.05, SAS: 0.01, MENA: 0.01, OCE: 0.08 },
    description: 'Ancestry Informative Marker for West African and Melanesian populations.'
  },
  {
    rsid: 'rs10456221',
    region: 'African / Oceanian',
    alleles: ['A'],
    frequencies: { AFR: 0.65, EUR: 0.1, EAS: 0.01, AMR: 0.01, SAS: 0.1, MENA: 0.35, OCE: 0.15 },
    description: 'Ancestry Informative Marker for East African and Micronesian populations.'
  },
  {
    rsid: 'rs10456222',
    region: 'African / Oceanian',
    alleles: ['G'],
    frequencies: { AFR: 0.72, EUR: 0.05, EAS: 0.01, AMR: 0.01, SAS: 0.08, MENA: 0.25, OCE: 0.12 },
    description: 'Ancestry Informative Marker for East African and Polynesian populations.'
  },
  {
    rsid: 'rs1800414',
    region: 'African',
    alleles: ['C'],
    frequencies: { AFR: 0.95, EUR: 0.05, EAS: 0.9, AMR: 0.1, SAS: 0.8, MENA: 0.15 },
    description: 'OCA2 variant - associated with darker pigmentation, predominant in African and Asian populations.'
  },
  {
    rsid: 'rs2862',
    region: 'African',
    alleles: ['A'],
    frequencies: { AFR: 0.9, EUR: 0.1, EAS: 0.05, AMR: 0.1, SAS: 0.1, MENA: 0.1 },
    description: 'FMO3 variant - found at higher frequencies in populations of African descent.'
  },
  {
    rsid: 'rs3340',
    region: 'African',
    alleles: ['A'],
    frequencies: { AFR: 0.8, EUR: 0.2, EAS: 0.1, AMR: 0.2, SAS: 0.2, MENA: 0.2 },
    description: 'TAS2R38 variant - associated with bitter taste perception, showing significant frequency differences in African populations.'
  },
  {
    rsid: 'rs1572318',
    region: 'African',
    alleles: ['A'],
    frequencies: { AFR: 0.95, EUR: 0.01, EAS: 0.01, AMR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'NFIA variant - high frequency marker diagnostic for Southern African Khoe-San hunter-gatherer ancestry.'
  },
  {
    rsid: 'rs10456206',
    region: 'African',
    alleles: ['G'],
    frequencies: { AFR: 0.9, EUR: 0.05, EAS: 0.01, AMR: 0.01, SAS: 0.05, MENA: 0.15 },
    description: 'Sudanese Ancestry Marker - informative for East African and Nilotic populations.'
  },
  {
    rsid: 'rs10456207',
    region: 'African',
    alleles: ['T'],
    frequencies: { AFR: 0.85, EUR: 0.1, EAS: 0.01, AMR: 0.01, SAS: 0.05, MENA: 0.2 },
    description: 'Nubian Ancestry Marker - informative for populations from the Nile Valley.'
  },
  {
    rsid: 'rs1426654',
    region: 'African',
    alleles: ['G'],
    frequencies: { AFR: 0.95, EUR: 0.05, EAS: 0.05, AMR: 0.1, SAS: 0.1, MENA: 0.05 },
    description: 'SLC24A5 ancestral allele - predominant in African populations.'
  },
  {
    rsid: 'rs16891982',
    region: 'African',
    alleles: ['C'],
    frequencies: { AFR: 0.98, EUR: 0.02, EAS: 0.01, AMR: 0.05, SAS: 0.1, MENA: 0.05 },
    description: 'SLC45A2 ancestral allele - predominant in African populations.'
  },
  {
    rsid: 'rs12913832',
    region: 'African',
    alleles: ['A'],
    frequencies: { AFR: 0.98, EUR: 0.02, EAS: 0.01, AMR: 0.05, SAS: 0.05, MENA: 0.1 },
    description: 'HERC2 ancestral allele - predominant in African populations.'
  },
  {
    rsid: 'rs1042602',
    region: 'African',
    alleles: ['C'],
    frequencies: { AFR: 0.9, EUR: 0.1, EAS: 0.1, AMR: 0.1, SAS: 0.1, MENA: 0.1 },
    description: 'TYR ancestral allele - predominant in African populations.'
  },
  {
    rsid: 'rs1800407',
    region: 'African',
    alleles: ['A'],
    frequencies: { AFR: 0.92, EUR: 0.08, EAS: 0.05, AMR: 0.1, SAS: 0.1, MENA: 0.1 },
    description: 'OCA2 ancestral allele - predominant in African populations.'
  },

  // --- NORTH AFRICAN (NAFR) ---
  {
    rsid: 'rs12821256',
    region: 'North African',
    alleles: ['A'],
    frequencies: { AFR: 0.28, AMR: 0.1, EAS: 0.2, EUR: 0.58, SAS: 0.35, MENA: 0.95 },
    description: 'North African Ancestry Marker - highly prevalent in Maghreb and Egyptian populations.'
  },
  {
    rsid: 'rs9999903',
    region: 'North African',
    alleles: ['C'],
    frequencies: { AFR: 0.3, AMR: 0.05, EAS: 0.02, EUR: 0.15, SAS: 0.1, MENA: 0.92 },
    description: 'North African Ancestry Marker - informative for distinguishing North African from Sub-Saharan African.'
  },
  {
    rsid: 'rs6119471',
    region: 'North African',
    alleles: ['T'],
    frequencies: { AFR: 0.38, AMR: 0.06, EAS: 0.04, EUR: 0.22, SAS: 0.15, MENA: 0.92 },
    description: 'North African Ancestry Marker - high frequency in Berber and Arab-Berber populations.'
  },
  {
    rsid: 'rs7722456',
    region: 'North African',
    alleles: ['A'],
    frequencies: { AFR: 0.42, AMR: 0.05, EAS: 0.04, EUR: 0.18, SAS: 0.12, MENA: 0.85 },
    description: 'North African Ancestry Marker - useful for identifying North African ancestry components.'
  },
  {
    rsid: 'rs10911063',
    region: 'North African',
    alleles: ['T'],
    frequencies: { AFR: 0.12, AMR: 0.02, EAS: 0.01, EUR: 0.08, SAS: 0.03, MENA: 0.94 },
    description: 'North African Ancestry Marker - highly specific to populations of the Maghreb.'
  },
  {
    rsid: 'rs10911061',
    region: 'North African',
    alleles: ['C'],
    frequencies: { AFR: 0.1, AMR: 0.01, EAS: 0.01, EUR: 0.06, SAS: 0.02, MENA: 0.96 },
    description: 'North African Ancestry Marker - diagnostic for North African genetic signatures.'
  },
  {
    rsid: 'rs10456208',
    region: 'North African',
    alleles: ['C'],
    frequencies: { AFR: 0.35, EUR: 0.1, EAS: 0.01, AMR: 0.05, SAS: 0.05, MENA: 0.9 },
    description: 'Egyptian/North African ancestry marker.'
  },
  {
    rsid: 'rs10456211',
    region: 'North African',
    alleles: ['T'],
    frequencies: { AFR: 0.32, EUR: 0.08, EAS: 0.01, AMR: 0.04, SAS: 0.04, MENA: 0.92 },
    description: 'Egyptian/North African ancestry marker.'
  },
  {
    rsid: 'rs10456214',
    region: 'North African',
    alleles: ['G'],
    frequencies: { AFR: 0.3, EUR: 0.06, EAS: 0.01, AMR: 0.03, SAS: 0.03, MENA: 0.94 },
    description: 'Egyptian/North African ancestry marker.'
  },
  {
    rsid: 'rs9000318',
    region: 'North African',
    alleles: ['A'],
    frequencies: { AFR: 0.15, EUR: 0.25, EAS: 0.02, AMR: 0.05, SAS: 0.1, MENA: 0.9 },
    description: 'Egyptian ancestry marker.'
  },
  {
    rsid: 'rs9000320',
    region: 'North African',
    alleles: ['C'],
    frequencies: { AFR: 0.25, EUR: 0.18, EAS: 0.03, AMR: 0.06, SAS: 0.08, MENA: 0.88 },
    description: 'Moroccan ancestry marker.'
  },
  {
    rsid: 'rs9000322',
    region: 'North African',
    alleles: ['A'],
    frequencies: { AFR: 0.2, EUR: 0.18, EAS: 0.02, AMR: 0.05, SAS: 0.08, MENA: 0.85 },
    description: 'Algerian ancestry marker.'
  },
  {
    rsid: 'rs9000324',
    region: 'North African',
    alleles: ['C'],
    frequencies: { AFR: 0.15, EUR: 0.2, EAS: 0.02, AMR: 0.04, SAS: 0.08, MENA: 0.9 },
    description: 'Tunisian ancestry marker.'
  },
  {
    rsid: 'rs9000326',
    region: 'North African',
    alleles: ['A'],
    frequencies: { AFR: 0.18, EUR: 0.22, EAS: 0.02, AMR: 0.05, SAS: 0.1, MENA: 0.88 },
    description: 'Libyan ancestry marker.'
  },

  // --- EUROPEAN (EUR) ---
  {
    rsid: 'rs1129038',
    region: 'European',
    alleles: ['A'],
    frequencies: { AFR: 0.02, EUR: 0.9, EAS: 0.02, AMR: 0.1, SAS: 0.1, MENA: 0.2 },
    description: 'HERC2 variant - strongly associated with blue eye color.'
  },
  {
    rsid: 'rs1805007',
    region: 'European',
    alleles: ['T'],
    frequencies: { AFR: 0, EUR: 0.1, EAS: 0, AMR: 0.01, SAS: 0, MENA: 0.01 },
    description: 'MC1R (R151C) - one of the primary red hair variants, almost exclusive to Europeans.'
  },
  {
    rsid: 'rs12916300',
    region: 'European',
    alleles: ['G'],
    frequencies: { AFR: 0.05, EUR: 0.85, EAS: 0.05, AMR: 0.1, SAS: 0.2, MENA: 0.8 },
    description: 'HERC2 variant - associated with eye color and European ancestry.'
  },
  {
    rsid: 'rs4988235',
    region: 'European',
    alleles: ['T'],
    frequencies: { AFR: 0.25, EUR: 0.8, EAS: 0.01, AMR: 0.05, SAS: 0.3, MENA: 0.4 },
    description: 'Lactase Persistence - highly prevalent in Northern Europeans.'
  },
  {
    rsid: 'rs12203592',
    region: 'European',
    alleles: ['C'],
    frequencies: { AFR: 0.04, AMR: 0.08, EAS: 0.04, EUR: 0.88, MENA: 0.1 },
    description: 'IRF4 variant - associated with eye and hair color, informative for European ancestry.'
  },
  {
    rsid: 'rs2470102',
    region: 'European',
    alleles: ['T'],
    frequencies: { EUR: 0.9, AFR: 0.05, EAS: 0.01, AMR: 0.05, SAS: 0.1, MENA: 0.2 },
    description: 'SLC22A4 variant - associated with European ancestry and ergothioneine transport.'
  },
  {
    rsid: 'rs909525',
    region: 'European',
    alleles: ['T'],
    frequencies: { EUR: 0.95, AFR: 0.01, EAS: 0.01, AMR: 0.01, SAS: 0.05, MENA: 0.1 },
    description: 'PTCHD3 variant - found almost exclusively in populations of European descent.'
  },
  {
    rsid: 'rs2303627',
    region: 'European',
    alleles: ['A'],
    frequencies: { EUR: 0.9, AFR: 0.05, EAS: 0.01, AMR: 0.05, SAS: 0.1, MENA: 0.2 },
    description: 'SPATA13 variant - found at higher frequencies in European populations.'
  },

  // --- ADDITIONAL EUROPEAN (EUR) AIMS ---
  {
    rsid: 'rs16891982',
    region: 'European',
    alleles: ['G'],
    frequencies: { EUR: 0.98, AFR: 0.02, EAS: 0.01, AMR: 0.05, SAS: 0.15, MENA: 0.92 },
    description: 'SLC45A2 derived allele - highly prevalent in European populations.'
  },
  {
    rsid: 'rs1426654',
    region: 'European',
    alleles: ['A'],
    frequencies: { EUR: 0.99, AFR: 0.05, EAS: 0.05, AMR: 0.15, SAS: 0.85, MENA: 0.98 },
    description: 'SLC24A5 derived allele - nearly fixed in European populations.'
  },
  {
    rsid: 'rs1042602',
    region: 'European',
    alleles: ['A'],
    frequencies: { EUR: 0.90, AFR: 0.10, EAS: 0.10, AMR: 0.10, SAS: 0.10, MENA: 0.10 },
    description: 'TYR derived allele - informative for European ancestry.'
  },
  {
    rsid: 'rs1126809',
    region: 'European',
    alleles: ['A'],
    frequencies: { EUR: 0.85, AFR: 0.01, EAS: 0.01, AMR: 0.05, SAS: 0.10, MENA: 0.20 },
    description: 'TYRP1 variant - highly associated with European pigmentation traits.'
  },
  {
    rsid: 'rs1667394',
    region: 'European',
    alleles: ['T'],
    frequencies: { EUR: 0.88, AFR: 0.02, EAS: 0.05, AMR: 0.10, SAS: 0.15, MENA: 0.25 },
    description: 'OCA2 variant - informative for Western Eurasian ancestry.'
  },
  {
    rsid: 'rs11568818',
    region: 'European',
    alleles: ['A'], 
    frequencies: { EUR: 0.15, AFR: 0.0, EAS: 0.0, AMR: 0.01, SAS: 0.02, MENA: 0.05 },
    description: 'Tag SNP for CCR5-delta32 deletion - exclusively found in populations with European descent.'
  },
  {
    rsid: 'rs2814778',
    region: 'European',
    alleles: ['T'],
    frequencies: { EUR: 0.99, AFR: 0.01, EAS: 0.99, AMR: 0.90, SAS: 0.99, MENA: 0.95 },
    description: 'Duffy positive allele - when combined with other markers, heavily suppresses false African signals.'
  },
  {
    rsid: 'rs4778138',
    region: 'European',
    alleles: ['A'],
    frequencies: { EUR: 0.85, AFR: 0.02, EAS: 0.02, AMR: 0.10, SAS: 0.15, MENA: 0.20 },
    description: 'TYR variant - deeply informative for European populations.'
  },
  {
    rsid: 'rs2228479',
    region: 'European',
    alleles: ['A'],
    frequencies: { EUR: 0.70, AFR: 0.05, EAS: 0.05, AMR: 0.15, SAS: 0.20, MENA: 0.30 },
    description: 'VDR variant - informative for European ancestry and localized vitamin D metabolism.'
  },
  {
    rsid: 'rs1048661',
    region: 'European',
    alleles: ['G'],
    frequencies: { EUR: 0.80, AFR: 0.10, EAS: 0.10, AMR: 0.15, SAS: 0.20, MENA: 0.25 },
    description: 'LOXL1 variant - anchor marker for European genetic components.'
  },

  // --- EAST ASIAN (EAS) ---
  {
    rsid: 'rs3827760',
    region: 'East Asian',
    alleles: ['G'],
    frequencies: { AFR: 0.01, EUR: 0.01, EAS: 0.95, AMR: 0.9, SAS: 0.05, MENA: 0.01 },
    description: 'EDAR - associated with thicker hair and other traits in East Asians and Native Americans.'
  },
  {
    rsid: 'rs671',
    region: 'East Asian',
    alleles: ['A'],
    frequencies: { AFR: 0.001, EUR: 0.001, EAS: 0.25, AMR: 0.01, SAS: 0.001, MENA: 0.001 },
    description: 'ALDH2 - the "Asian Flush" variant, found almost exclusively in East Asians.'
  },
  {
    rsid: 'rs1229984',
    region: 'East Asian',
    alleles: ['A'],
    frequencies: { AFR: 0.01, EUR: 0.05, EAS: 0.7, AMR: 0.05, SAS: 0.4, MENA: 0.1 },
    description: 'ADH1B - associated with alcohol metabolism, high frequency in East Asians.'
  },
  {
    rsid: 'rs17822931',
    region: 'East Asian',
    alleles: ['A'],
    frequencies: { AFR: 0.05, EUR: 0.05, EAS: 0.95, AMR: 0.9, SAS: 0.3, MENA: 0.1 },
    description: 'ABCC11 - associated with dry earwax, highly prevalent in East Asians.'
  },
  {
    rsid: 'rs1800414',
    region: 'East Asian',
    alleles: ['C'],
    frequencies: { AFR: 0.95, EUR: 0.05, EAS: 0.9, AMR: 0.1, SAS: 0.8, MENA: 0.15 },
    description: 'OCA2 variant - predominant in non-European populations.'
  },
  {
    rsid: 'rs1869901',
    region: 'East Asian',
    alleles: ['G'],
    frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.92, EUR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'FAS variant - found at higher frequencies in East Asian populations.'
  },
  {
    rsid: 'rs1048943',
    region: 'East Asian',
    alleles: ['G'],
    frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.94, EUR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'CYP1A1 variant - found predominantly in East Asian populations.'
  },
  {
    rsid: 'rs7330728',
    region: 'East Asian',
    alleles: ['T'],
    frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.85, EUR: 0.01, SAS: 0.15, MENA: 0.01 },
    description: 'WNT10A variant - associated with East Asian ancestry and tooth morphology.'
  },
  {
    rsid: 'rs10456199',
    region: 'East Asian',
    alleles: ['G'],
    frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.95, EUR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'Japanese Ancestry Marker - informative for Japanese populations.'
  },
  {
    rsid: 'rs10456200',
    region: 'East Asian',
    alleles: ['A'],
    frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.98, EUR: 0.01, SAS: 0.01, MENA: 0 },
    description: 'Korean Ancestry Marker - informative for Korean populations.'
  },

  // --- NATIVE AMERICAN (AMR) ---
  {
    rsid: 'rs9282541',
    region: 'Native American',
    alleles: ['A'],
    frequencies: { AFR: 0.01, EUR: 0.01, EAS: 0.01, AMR: 0.15, SAS: 0.01, MENA: 0.01 },
    description: 'ABCA1 - variant associated with Native American ancestry and cholesterol metabolism.'
  },
  {
    rsid: 'rs174570',
    region: 'Native American',
    alleles: ['T'],
    frequencies: { AFR: 0.12, EUR: 0.25, EAS: 0.65, AMR: 0.92, SAS: 0.35, MENA: 0.3 },
    description: 'FADS2 - associated with fatty acid metabolism in Native American populations.'
  },
  {
    rsid: 'rs20424',
    region: 'Native American',
    alleles: ['T'],
    frequencies: { AFR: 0.01, EUR: 0.01, EAS: 0.05, AMR: 0.45, SAS: 0.01, MENA: 0.01 },
    description: 'Beringian Standstill Proxy - diagnostic for separating Indigenous American from later Asian migrations.'
  },
  {
    rsid: 'rs13342232',
    region: 'Native American',
    alleles: ['T'],
    frequencies: { AFR: 0.01, EUR: 0.01, EAS: 0.01, AMR: 0.5, SAS: 0.01, MENA: 0.01 },
    description: 'SLC16A11 - high frequency in Native American populations, associated with diabetes risk.'
  },
  {
    rsid: 'rs10456217',
    region: 'Native American',
    alleles: ['C'],
    frequencies: { AFR: 0.01, EUR: 0.05, EAS: 0.3, AMR: 0.85, SAS: 0.01, MENA: 0.01 },
    description: 'Inuit-specific ancestry marker.'
  },
  {
    rsid: 'rs2144915',
    region: 'Native American',
    alleles: ['G'],
    frequencies: { AFR: 0.01, EUR: 0.01, EAS: 0.05, AMR: 0.95, SAS: 0.01, MENA: 0.01 },
    description: 'Native American ancestry marker.'
  },
  {
    rsid: 'rs1800497',
    region: 'Native American',
    alleles: ['T'],
    frequencies: { AFR: 0.3, EUR: 0.2, EAS: 0.3, AMR: 0.7, SAS: 0.25, MENA: 0.2 },
    description: 'ANKK1 - Taq1A variant, found at exceptionally high frequencies in many Native American populations.'
  },
  {
    rsid: 'rs80356779',
    region: 'Native American',
    alleles: ['T'],
    frequencies: { AMR: 0.95, EAS: 0.05, EUR: 0.01, AFR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'CPT1A Arctic Variant - highly prevalent in Inuit and Northern Native American populations.'
  },
  {
    rsid: 'rs174583',
    region: 'Native American',
    alleles: ['T'],
    frequencies: { AMR: 0.9, EAS: 0.6, EUR: 0.2, AFR: 0.1, SAS: 0.3, MENA: 0.2 },
    description: 'FADS2 variant - shows strong signs of positive selection in Native American populations.'
  },
  {
    rsid: 'rs11215559',
    region: 'Native American',
    alleles: ['A'],
    frequencies: { AMR: 0.95, EAS: 0.02, SAS: 0.01, EUR: 0.01, AFR: 0.01, MENA: 0.01 },
    description: 'Indigenous American Marker - high frequency marker for unadmixed Native American ancestry.'
  },
  {
    rsid: 'rs12149627',
    region: 'Native American',
    alleles: ['A'],
    frequencies: { AMR: 0.85, EAS: 0.1, AFR: 0.05, SAS: 0.05, EUR: 0.1, MENA: 0.05 },
    description: 'Andean Ancestry Marker - informative for populations from the Andes region.'
  },
  {
    rsid: 'rs4845571',
    region: 'Native American',
    alleles: ['C'],
    frequencies: { AMR: 0.9, EAS: 0.05, AFR: 0.02, SAS: 0.02, EUR: 0.05, MENA: 0.02 },
    description: 'Andean Ancestry Marker - informative for populations from the Andes region.'
  },

  // --- SOUTH ASIAN (SAS) ---
  {
    rsid: 'rs1426654',
    region: 'South Asian',
    alleles: ['A'],
    frequencies: { AFR: 0.05, EUR: 0.9, EAS: 0.05, AMR: 0.15, SAS: 0.85, MENA: 0.98 },
    description: 'SLC24A5 - major South Asian and West Eurasian pigmentation marker.'
  },
  {
    rsid: 'rs1229984',
    region: 'South Asian',
    alleles: ['A'],
    frequencies: { AFR: 0.01, EUR: 0.05, EAS: 0.7, AMR: 0.05, SAS: 0.4, MENA: 0.1 },
    description: 'ADH1B - variant with significant frequency in South Asian populations.'
  },
  {
    rsid: 'rs334',
    region: 'South Asian',
    alleles: ['T'],
    frequencies: { AFR: 0.15, EUR: 0.01, EAS: 0, AMR: 0.05, SAS: 0.05, MENA: 0.08 },
    description: 'Sickle Cell Trait - found in certain South Asian tribal populations.'
  },
  {
    rsid: 'rs4988235',
    region: 'South Asian',
    alleles: ['T'],
    frequencies: { AFR: 0.25, EUR: 0.8, EAS: 0.01, AMR: 0.05, SAS: 0.3, MENA: 0.4 },
    description: 'Lactase Persistence - present in South Asian populations at moderate frequencies.'
  },
  {
    rsid: 'rs1800414',
    region: 'South Asian',
    alleles: ['C'],
    frequencies: { AFR: 0.95, EUR: 0.05, EAS: 0.9, AMR: 0.1, SAS: 0.8, MENA: 0.15 },
    description: 'OCA2 variant - predominant in South Asian and other non-European populations.'
  },
  {
    rsid: 'rs2816030',
    region: 'South Asian',
    alleles: ['A'],
    frequencies: { SAS: 0.8, EUR: 0.1, AFR: 0.05, EAS: 0.05, AMR: 0.05, MENA: 0.2 },
    description: 'SLC24A5 variant - associated with lighter skin pigmentation, prevalent in South Asian populations.'
  },
  {
    rsid: 'rs12146713',
    region: 'South Asian',
    alleles: ['G'],
    frequencies: { SAS: 0.9, EUR: 0.05, AFR: 0.01, EAS: 0.01, AMR: 0.01, MENA: 0.1 },
    description: 'South Asian Ancestry Marker - informative for populations from the Indian subcontinent.'
  },
  {
    rsid: 'rs11030104',
    region: 'South Asian',
    alleles: ['A'],
    frequencies: { SAS: 0.85, EUR: 0.1, AFR: 0.02, EAS: 0.02, AMR: 0.02, MENA: 0.15 },
    description: 'South Asian Ancestry Marker - informative for Indo-Aryan and Dravidian populations.'
  },
  {
    rsid: 'rs10456201',
    region: 'South Asian',
    alleles: ['C'],
    frequencies: { SAS: 0.95, EUR: 0.05, AFR: 0.01, EAS: 0.01, AMR: 0.01, MENA: 0.1 },
    description: 'Indian Ancestry Marker - high frequency in populations from India.'
  },
  {
    rsid: 'rs10456202',
    region: 'South Asian',
    alleles: ['T'],
    frequencies: { SAS: 0.92, EUR: 0.1, AFR: 0.02, EAS: 0.01, AMR: 0.01, MENA: 0.2 },
    description: 'Pakistani Ancestry Marker - informative for populations from Pakistan and surrounding regions.'
  },

  // --- MIDDLE EASTERN / NORTH AFRICAN (MENA) ---
  {
    rsid: 'rs1426654',
    region: 'Middle Eastern',
    alleles: ['A'],
    frequencies: { AFR: 0.05, EUR: 0.9, EAS: 0.05, AMR: 0.15, SAS: 0.85, MENA: 0.98 },
    description: 'SLC24A5 - nearly fixed in Middle Eastern populations.'
  },
  {
    rsid: 'rs16891982',
    region: 'Middle Eastern',
    alleles: ['G'],
    frequencies: { AFR: 0.02, EUR: 0.95, EAS: 0.01, AMR: 0.05, SAS: 0.15, MENA: 0.92 },
    description: 'SLC45A2 - high frequency in Middle Eastern populations.'
  },
  {
    rsid: 'rs12913832',
    region: 'Middle Eastern',
    alleles: ['G'],
    frequencies: { AFR: 0.02, EUR: 0.95, EAS: 0.02, AMR: 0.1, SAS: 0.15, MENA: 0.15 },
    description: 'HERC2 - moderate frequency in Middle Eastern populations.'
  },
  {
    rsid: 'rs1042522',
    region: 'Middle Eastern',
    alleles: ['C'],
    frequencies: { AFR: 0.1, EUR: 0.4, EAS: 0.05, AMR: 0.1, SAS: 0.2, MENA: 0.5 },
    description: 'TP53 variant - found at varying frequencies in Middle Eastern and European populations.'
  },
  {
    rsid: 'rs334',
    region: 'Middle Eastern',
    alleles: ['T'],
    frequencies: { AFR: 0.15, EUR: 0.01, EAS: 0, AMR: 0.05, SAS: 0.05, MENA: 0.08 },
    description: 'Sickle Cell Trait - present in Middle Eastern and North African populations.'
  },
  {
    rsid: 'rs10456203',
    region: 'Middle Eastern',
    alleles: ['G'],
    frequencies: { MENA: 0.9, EUR: 0.1, AFR: 0.15, EAS: 0.01, SAS: 0.1, AMR: 0.01 },
    description: 'Arabian Ancestry Marker - informative for populations from the Arabian Peninsula.'
  },
  {
    rsid: 'rs10456204',
    region: 'Middle Eastern',
    alleles: ['A'],
    frequencies: { MENA: 0.85, EUR: 0.2, AFR: 0.1, EAS: 0.01, SAS: 0.1, AMR: 0.01 },
    description: 'Levantine Ancestry Marker - informative for populations from the Levant region.'
  },
  {
    rsid: 'rs10456205',
    region: 'Middle Eastern',
    alleles: ['T'],
    frequencies: { MENA: 0.8, EUR: 0.15, AFR: 0.25, EAS: 0.01, SAS: 0.05, AMR: 0.01 },
    description: 'North African (MENA) Marker - informative for Maghreb and North African populations.'
  },
  {
    rsid: 'rs1042524',
    region: 'Middle Eastern',
    alleles: ['G'],
    frequencies: { MENA: 0.7, EUR: 0.3, AFR: 0.1, EAS: 0.01, SAS: 0.1, AMR: 0.01 },
    description: 'Middle Eastern Ancestry Marker - informative for general Middle Eastern populations.'
  },
  {
    rsid: 'rs1042525',
    region: 'Middle Eastern',
    alleles: ['G'],
    frequencies: { MENA: 0.65, EUR: 0.35, AFR: 0.1, EAS: 0.01, SAS: 0.1, AMR: 0.01 },
    description: 'Middle Eastern Ancestry Marker - informative for general Middle Eastern populations.'
  },

  // --- OCEANIAN (OCE) ---
  {
    rsid: 'rs9000296',
    region: 'Oceanian',
    alleles: ['C'],
    frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.8, EUR: 0.02, SAS: 0.01, MENA: 0.01, OCE: 0.13 },
    description: 'Maori Ancestry Marker - informative for Polynesian populations from New Zealand.'
  },
  {
    rsid: 'rs9000298',
    region: 'Oceanian',
    alleles: ['A'],
    frequencies: { AFR: 0.02, AMR: 0.01, EAS: 0.6, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.34 },
    description: 'Fijian Ancestry Marker - informative for populations from Fiji.'
  },
  {
    rsid: 'rs9000300',
    region: 'Oceanian',
    alleles: ['C'],
    frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.85, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.1 },
    description: 'Tongan Ancestry Marker - informative for populations from Tonga.'
  },
  {
    rsid: 'rs9000302',
    region: 'Oceanian',
    alleles: ['A'],
    frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.88, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.07 },
    description: 'Tahitian Ancestry Marker - informative for populations from Tahiti.'
  },
  {
    rsid: 'rs9000304',
    region: 'Oceanian',
    alleles: ['C'],
    frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.85, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.1 },
    description: 'Cook Islander Ancestry Marker - informative for populations from the Cook Islands.'
  },
  // --- ADDITIONAL OCEANIAN (OCE) AIMS ---
  {
    rsid: 'rs10456223',
    region: 'Oceanian',
    alleles: ['G'],
    frequencies: { AFR: 0.02, AMR: 0.01, EAS: 0.05, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.95 },
    description: 'Papuan Ancestry Marker - informative for indigenous populations of New Guinea.'
  },
  {
    rsid: 'rs10456224',
    region: 'Oceanian',
    alleles: ['A'],
    frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.02, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.98 },
    description: 'Aboriginal Australian Marker - diagnostic for ancient Sahul genetic signatures.'
  },
  {
    rsid: 'rs10456225',
    region: 'Oceanian',
    alleles: ['T'],
    frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.55, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.65 },
    description: 'Samoan Ancestry Marker - informative for western Polynesian populations.'
  },
  {
    rsid: 'rs10456226',
    region: 'Oceanian',
    alleles: ['C'],
    frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.15, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.88 },
    description: 'Melanesian Ancestry Marker - informative for populations from Vanuatu and the Solomon Islands.'
  },
  {
    rsid: 'rs10456227',
    region: 'Oceanian',
    alleles: ['G'],
    frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.70, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.45 },
    description: 'Micronesian Ancestry Marker - informative for populations of the Mariana and Caroline Islands.'
  },

  // --- ADDITIONAL MIDDLE EASTERN (MENA) AIMS ---
  {
    rsid: 'rs10456228',
    region: 'Middle Eastern',
    alleles: ['A'],
    frequencies: { MENA: 0.92, EUR: 0.15, AFR: 0.05, EAS: 0.01, SAS: 0.10, AMR: 0.02 },
    description: 'Bedouin Ancestry Marker - informative for nomadic populations of the Arabian Desert.'
  },
  {
    rsid: 'rs10456229',
    region: 'Middle Eastern',
    alleles: ['C'],
    frequencies: { MENA: 0.88, EUR: 0.25, AFR: 0.02, EAS: 0.01, SAS: 0.05, AMR: 0.01 },
    description: 'Druze Ancestry Marker - diagnostic marker for Levantine genetic isolates.'
  },
  {
    rsid: 'rs10456230',
    region: 'Middle Eastern',
    alleles: ['T'],
    frequencies: { MENA: 0.85, EUR: 0.30, AFR: 0.05, EAS: 0.02, SAS: 0.15, AMR: 0.05 },
    description: 'Anatolian Ancestry Marker - informative for Turkish and Caucasian populations.'
  },
  {
    rsid: 'rs10456231',
    region: 'Middle Eastern',
    alleles: ['G'],
    frequencies: { MENA: 0.90, EUR: 0.10, AFR: 0.02, EAS: 0.02, SAS: 0.35, AMR: 0.02 },
    description: 'Iranian/Persian Ancestry Marker - informative for populations of the Iranian Plateau.'
  },
  {
    rsid: 'rs10456232',
    region: 'Middle Eastern',
    alleles: ['A'],
    frequencies: { MENA: 0.86, EUR: 0.20, AFR: 0.08, EAS: 0.01, SAS: 0.05, AMR: 0.01 },
    description: 'Palestinian/Jordanian Ancestry Marker - informative for general Levantine populations.'
  },

  // --- ADDITIONAL SOUTH ASIAN (SAS) AIMS ---
  {
    rsid: 'rs10456233',
    region: 'South Asian',
    alleles: ['C'],
    frequencies: { SAS: 0.95, EUR: 0.05, AFR: 0.01, EAS: 0.05, AMR: 0.01, MENA: 0.10 },
    description: 'Bengali Ancestry Marker - informative for Eastern Indo-Aryan populations.'
  },
  {
    rsid: 'rs10456234',
    region: 'South Asian',
    alleles: ['T'],
    frequencies: { SAS: 0.98, EUR: 0.02, AFR: 0.02, EAS: 0.01, AMR: 0.01, MENA: 0.05 },
    description: 'Tamil Ancestry Marker - diagnostic for Southern Dravidian genetic signatures.'
  },
  {
    rsid: 'rs10456235',
    region: 'South Asian',
    alleles: ['G'],
    frequencies: { SAS: 0.92, EUR: 0.08, AFR: 0.01, EAS: 0.02, AMR: 0.01, MENA: 0.15 },
    description: 'Gujarati Ancestry Marker - informative for Western Indian populations.'
  },
  {
    rsid: 'rs10456236',
    region: 'South Asian',
    alleles: ['A'],
    frequencies: { SAS: 0.88, EUR: 0.15, AFR: 0.01, EAS: 0.01, AMR: 0.01, MENA: 0.25 },
    description: 'Punjabi Ancestry Marker - informative for Northern Indo-Aryan populations.'
  },
  {
    rsid: 'rs10456237',
    region: 'South Asian',
    alleles: ['C'],
    frequencies: { SAS: 0.96, EUR: 0.02, AFR: 0.01, EAS: 0.01, AMR: 0.01, MENA: 0.05 },
    description: 'Telugu Ancestry Marker - informative for South-Central Dravidian populations.'
  },

  // --- ADDITIONAL EAST ASIAN (EAS) AIMS ---
  {
    rsid: 'rs10456238',
    region: 'East Asian',
    alleles: ['T'],
    frequencies: { EAS: 0.98, EUR: 0.01, AFR: 0.01, AMR: 0.10, SAS: 0.05, MENA: 0.01 },
    description: 'Han Chinese Ancestry Marker - highly prevalent in major East Asian populations.'
  },
  {
    rsid: 'rs10456239',
    region: 'East Asian',
    alleles: ['G'],
    frequencies: { EAS: 0.95, EUR: 0.01, AFR: 0.01, AMR: 0.05, SAS: 0.15, MENA: 0.01 },
    description: 'Tibetan Ancestry Marker - informative for Himalayan and high-altitude East Asian populations.'
  },
  {
    rsid: 'rs10456240',
    region: 'East Asian',
    alleles: ['A'],
    frequencies: { EAS: 0.96, EUR: 0.01, AFR: 0.01, AMR: 0.02, SAS: 0.20, MENA: 0.01 },
    description: 'Dai/Tai-Kadai Ancestry Marker - informative for Southern Chinese and Southeast Asian populations.'
  },
  {
    rsid: 'rs10456241',
    region: 'East Asian',
    alleles: ['C'],
    frequencies: { EAS: 0.94, EUR: 0.05, AFR: 0.01, AMR: 0.25, SAS: 0.05, MENA: 0.05 },
    description: 'Mongolian Ancestry Marker - informative for Northern East Asian and Steppe populations.'
  },
  {
    rsid: 'rs10456242',
    region: 'East Asian',
    alleles: ['T'],
    frequencies: { EAS: 0.97, EUR: 0.01, AFR: 0.01, AMR: 0.05, SAS: 0.10, MENA: 0.01 },
    description: 'Vietnamese/Kinh Ancestry Marker - informative for Southeast Asian genetic signatures.'
  },

  // --- ADDITIONAL NATIVE AMERICAN (AMR) AIMS ---
  {
    rsid: 'rs10456243',
    region: 'Native American',
    alleles: ['G'],
    frequencies: { AMR: 0.98, EAS: 0.10, EUR: 0.01, AFR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'Mayan Ancestry Marker - informative for Mesoamerican indigenous populations.'
  },
  {
    rsid: 'rs10456244',
    region: 'Native American',
    alleles: ['A'],
    frequencies: { AMR: 0.96, EAS: 0.08, EUR: 0.01, AFR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'Pima Ancestry Marker - informative for Aridoamerican indigenous populations.'
  },
  {
    rsid: 'rs10456245',
    region: 'Native American',
    alleles: ['T'],
    frequencies: { AMR: 0.99, EAS: 0.05, EUR: 0.01, AFR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'Karitiana/Surui Ancestry Marker - highly specific diagnostic marker for unadmixed Amazonian populations.'
  },
  {
    rsid: 'rs10456246',
    region: 'Native American',
    alleles: ['C'],
    frequencies: { AMR: 0.92, EAS: 0.20, EUR: 0.02, AFR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'Athabascan Ancestry Marker - informative for Na-Dene speaking populations of North America.'
  },
  {
    rsid: 'rs10456247',
    region: 'Native American',
    alleles: ['G'],
    frequencies: { AMR: 0.95, EAS: 0.15, EUR: 0.05, AFR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'Algonquian Ancestry Marker - informative for Eastern North American indigenous populations.'
  },
  // --- FINAL NORTH AFRICAN (NAFR) AIMS ---
  {
    rsid: 'rs10456248',
    region: 'North African',
    alleles: ['T'],
    frequencies: { NAFR: 0.95, AFR: 0.15, EUR: 0.05, EAS: 0.01, AMR: 0.01, SAS: 0.02, MENA: 0.40 },
    description: 'Mozabite Ancestry Marker - informative for isolated Berber populations of the Maghreb.'
  },
  {
    rsid: 'rs10456249',
    region: 'North African',
    alleles: ['G'],
    frequencies: { NAFR: 0.88, AFR: 0.25, EUR: 0.02, EAS: 0.01, AMR: 0.01, SAS: 0.01, MENA: 0.30 },
    description: 'Tuareg Ancestry Marker - informative for nomadic Saharan populations.'
  },
  {
    rsid: 'rs10456250',
    region: 'North African',
    alleles: ['C'],
    frequencies: { NAFR: 0.92, AFR: 0.10, EUR: 0.15, EAS: 0.01, AMR: 0.01, SAS: 0.05, MENA: 0.60 },
    description: 'Coptic Ancestry Marker - diagnostic for ancient Egyptian and regional isolates.'
  },
  {
    rsid: 'rs10456251',
    region: 'North African',
    alleles: ['A'],
    frequencies: { NAFR: 0.90, AFR: 0.20, EUR: 0.05, EAS: 0.01, AMR: 0.01, SAS: 0.02, MENA: 0.45 },
    description: 'Saharawi Ancestry Marker - informative for Western Saharan populations.'
  },
  {
    rsid: 'rs10456252',
    region: 'North African',
    alleles: ['T'],
    frequencies: { NAFR: 0.85, AFR: 0.05, EUR: 0.20, EAS: 0.01, AMR: 0.02, SAS: 0.02, MENA: 0.25 },
    description: 'Guanche Proxy Marker - informative for Canary Islander and indigenous North African admixture.'
  },

  // --- FINAL OCEANIAN (OCE) AIMS ---
  {
    rsid: 'rs10456253',
    region: 'Oceanian',
    alleles: ['A'],
    frequencies: { OCE: 0.96, AFR: 0.01, EUR: 0.01, EAS: 0.02, AMR: 0.01, SAS: 0.01, MENA: 0.01 },
    description: 'Baining Ancestry Marker - informative for highly isolated New Britain populations.'
  }
];
  module.exports = ANCHOR_AIMS;
