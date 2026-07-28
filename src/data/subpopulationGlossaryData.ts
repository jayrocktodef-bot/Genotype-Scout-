export interface PopulationGlossaryItem {
  code: string;
  name: string;
  category: 'Europe' | 'Africa' | 'Americas' | 'East Asia' | 'South Asia' | 'Middle East & Jewish' | 'Oceania & Sahul' | 'Central Asia & Siberia';
  geographicCenter: string;
  historicalTimeline: string;
  migrationPath: string[];
  evolutionaryAdaptations: {
    trait: string;
    gene: string;
    rsid?: string;
    impact: string;
  }[];
  description: string;
  keyMarkers: string[];
  haplogroupNotes?: string;
  aliases?: string[];
  empiricalSource?: {
    dataset: string;
    accession?: string;
    sampleSize: number;
    admixtureBreakdown: string;
  };
}

export const SUBPOPULATION_GLOSSARY_DATA: PopulationGlossaryItem[] = [
  // ==========================================
  // WESTERN, NORTHERN & EASTERN EUROPE
  // ==========================================
  {
    code: 'CEU',
    aliases: ['NFE_gnomAD', 'ALFA_EUR', 'sgdp_french', 'FRENCH', 'GERMAN', 'DUTCH'],
    name: 'Central European (CEU)',
    category: 'Europe',
    geographicCenter: 'Utah Residents (CEPH) / Western & Central Europe (France, Germany, Netherlands, Rhine Basin)',
    historicalTimeline: 'Tri-partite ancestral fusion: Mesolithic Western Hunter-Gatherers (WHG, ~8000 BCE) + Anatolian Early European Farmers (EEF, ~6000 BCE) + Bronze Age Yamnaya Western Steppe Pastoralists (WSH, ~2800 BCE).',
    migrationPath: [
      'Out-of-Africa migration via Levant corridor (~60,000–50,000 BP)',
      'Paleolithic & Mesolithic Hunter-Gatherer colonization of European glacial refugia (~40,000–10,000 BP)',
      'Neolithic Anatolian Farmer expansion along Danube and Mediterranean routes (~8,000–6,000 BP)',
      'Bronze Age Corded Ware & Bell Beaker Steppe herder migration from Pontic-Caspian Steppe (~4,800–4,000 BP)'
    ],
    evolutionaryAdaptations: [
      { trait: 'Lactase Persistence', gene: 'MCM6 / LCT', rsid: 'rs4988235', impact: 'Strong positive selection for adult milk digestion during pastoralist cattle farming.' },
      { trait: 'Light Skin Pigmentation', gene: 'SLC24A5 & SLC45A2', rsid: 'rs1426654 / rs16891982', impact: 'Maximizes cutaneous Vitamin D synthesis in low-UV northern latitudes.' },
      { trait: 'Blue/Light Eye Color', gene: 'HERC2 / OCA2', rsid: 'rs12913832', impact: 'Regulatory enhancer variant selected in Mesolithic & Neolithic European populations.' }
    ],
    description: 'Central European (CEU) represents Western and Northern European ancestry characterized by high Yamnaya Steppe herder admixture (~45-50%), Early European Farmer ancestry (~35-40%), and Western Hunter-Gatherer lineage (~10-15%). Governed by historical Corded Ware and Bell Beaker cultural expansions across Central Europe.',
    keyMarkers: ['rs4988235-T', 'rs1426654-A', 'rs16891982-G', 'rs12913832-G'],
    haplogroupNotes: 'Predominantly Y-DNA R1b-M269 and R1a-M417; mtDNA H, U5, T, J, K.',
    empiricalSource: { dataset: '1000 Genomes 30x High-Coverage Expansion', accession: 'IGSR Phase 3', sampleSize: 99, admixtureBreakdown: '50% Steppe WSH, 38% EEF, 12% WHG' }
  },
  {
    code: 'GBR',
    aliases: ['IRISH', 'sgdp_english', 'sgdp_orcadian'],
    name: 'British Isles (GBR)',
    category: 'Europe',
    geographicCenter: 'Great Britain, Ireland, Orkney & Hebrides',
    historicalTimeline: 'Insular Atlantic European lineage shaped by Bell Beaker turnover (~2400 BCE, >90% population replacement), Insular Celtic, Anglo-Saxon (Germanic), and Scandinavian Viking migrations.',
    migrationPath: [
      'Mesolithic Hunter-Gatherer settlement (e.g. Cheddar Man, ~10,000 BP)',
      'Neolithic Megalithic Farmer expansion into Britain (~6,000 BP)',
      'Massive Bell Beaker Steppe migration replacing ~90% of Neolithic British gene pool (~4,400 BP)',
      'Anglo-Saxon Germanic migration from North Sea coasts (5th–7th Century CE)',
      'Norse & Danish Viking settlements (8th–11th Century CE)'
    ],
    evolutionaryAdaptations: [
      { trait: 'Hereditary Hemochromatosis / Iron Absorption', gene: 'HFE', rsid: 'rs1800562', impact: 'Celtic mutation (C282Y) promoting high dietary iron absorption on low-iron agricultural diets.' },
      { trait: 'Red Hair & Fair Skin', gene: 'MC1R', rsid: 'rs1801282', impact: 'Loss-of-function variants producing pheomelanin, freckling, and high UV sensitivity.' },
      { trait: 'Lactase Persistence', gene: 'MCM6', rsid: 'rs4988235', impact: 'Fixed high frequency (~85-90%) in pastoralist insular populations.' }
    ],
    description: 'British Isles (GBR) encapsulates the genetic structure of Great Britain and Ireland. Derived from heavy Bell Beaker Steppe herder ancestry fused with North-West Germanic (Anglo-Saxon/Jute) and Celtic Insular lineages.',
    keyMarkers: ['rs1800562-A', 'rs4988235-T', 'rs12821256-T', 'rs1426654-A'],
    haplogroupNotes: 'Dominant Y-DNA R1b-L21 (Celtic) and R1b-U106 (Germanic); mtDNA H1, H3, U5a, J1c.'
  },
  {
    code: 'FIN',
    aliases: ['FIN_gnomAD', 'sgdp_finnish', 'sgdp_estonian'],
    name: 'Uralic & North-East European (FIN)',
    category: 'Europe',
    geographicCenter: 'Finland, Karelia, Bothnian Basin, Estonia',
    historicalTimeline: 'Distinct northern bottlenecked population formed by Eastern Hunter-Gatherers (EHG), Western Hunter-Gatherers (WHG), and Siberian-related Nganasan-like intake via Uralic language expansion (~1500 BCE).',
    migrationPath: [
      'Post-glacial North-Eastern European settlement (~9,000 BP)',
      'Comb Ceramic culture hunter-gatherer interactions (~6,000 BP)',
      'Uralic migration carrying Siberian Nganasan-like ancestry & Haplogroup N-M231 from Trans-Urals (~3,500 BP)',
      'Internal founder bottlenecks during late medieval inland settlement (Late Settlement Finland)'
    ],
    evolutionaryAdaptations: [
      { trait: 'Finnish Heritage Disease Bottlenecks', gene: 'Multiple (e.g. CLN5, SLC12A6)', impact: 'High frequency of specific recessive monogenic conditions due to strong historical founder effects.' },
      { trait: 'High-Latitude Pigmentation', gene: 'SLC45A2 / KITLG', rsid: 'rs16891982', impact: 'Extreme fixation of light skin and blonde hair variants for high-latitude solar radiation.' }
    ],
    description: 'Finnish (FIN) is a genetically distinctive European population exhibiting a unique combination of European hunter-gatherer/steppe ancestry with ~5-10% Siberian/Uralic affinity. Extreme historical population bottlenecks created unique allele frequency spectra.',
    keyMarkers: ['Y-DNA N-M231 / N1c1', 'rs16891982-G', 'rs12913832-G'],
    haplogroupNotes: 'Y-DNA N-M231 (~60%) and R1a-M417 (~20%); mtDNA U5b1b, H, V.'
  },
  {
    code: 'POLISH',
    aliases: ['SLAVIC', 'BALTIC', 'sgdp_polish', 'sgdp_russian', 'sgdp_czech', 'RUSSIAN'],
    name: 'Polish / Eastern European (POLISH / SLAVIC)',
    category: 'Europe',
    geographicCenter: 'Vistula-Oder Basins, Poland, Ukraine, Belarus, European Russia',
    historicalTimeline: 'Central-Eastern European Slavic lineage characterized by high Steppe pastoralist ancestry (R1a-M417), Early European Farmer components, and Baltic/Slavic early medieval expansions (5th–7th Century CE).',
    migrationPath: [
      'Mesolithic EHG / WHG hunter-gatherer foraging in North European Plain',
      'Neolithic Funnelbeaker and Globular Amphora agricultural settlements (~5,500 BP)',
      'Corded Ware Culture Steppe expansion into Eastern Europe (~4,800 BP)',
      'Early Slavic demographic expansion from Pripyat-Dnieper basin across Central & Eastern Europe (500–800 CE)'
    ],
    evolutionaryAdaptations: [
      { trait: 'Cold Climate Metabolism', gene: 'TRPM8', rsid: 'rs10166942', impact: 'High-frequency cold-temperature receptor allele adapted to continental sub-freezing winters.' },
      { trait: 'Lactase Persistence', gene: 'MCM6', rsid: 'rs4988235', impact: 'High frequency driven by dairy farming traditions.' }
    ],
    description: 'Polish and Eastern European Slavic populations form a homogeneous genetic cluster in Central-Eastern Europe. Characterized by high autosomal Steppe herder affinity and the dominant expansion of Y-chromosome R1a-M417 branches.',
    keyMarkers: ['rs10166942-T', 'rs4988235-T', 'Y-DNA R1a-M417'],
    haplogroupNotes: 'Dominant Y-DNA R1a-Z282 (~55-60%), R1b (~15%); mtDNA H, U4, J, T.'
  },
  {
    code: 'IRISH_AM',
    name: 'Irish American Cohort (HRS Empirical)',
    category: 'Europe',
    geographicCenter: 'United States (Irish Heritage Cohort, HRS dbGaP)',
    historicalTimeline: 'Empirical Irish-American demographic cohort from the Health and Retirement Study (HRS). Reflects 19th-20th century transatlantic migrations from Ireland.',
    migrationPath: ['Insular Atlantic Celtic settlement → Great Famine & 19th century transatlantic migration → US Irish-American communities'],
    evolutionaryAdaptations: [
      { trait: 'Celtic Hemochromatosis C282Y', gene: 'HFE', rsid: 'rs1800562', impact: 'High retention of Celtic iron absorption mutation (~10-12% carrier frequency).' }
    ],
    description: 'Empirical Irish-American population kernel constructed from self-reported Irish participants in the NIH Health and Retirement Study (HRS).',
    keyMarkers: ['rs1800562-A', 'rs4988235-T (~72%)', 'rs12913832-G (~78%)'],
    empiricalSource: { dataset: 'Health and Retirement Study (HRS)', accession: 'dbGaP phs000428', sampleSize: 2100, admixtureBreakdown: '98.5% NW European (Celtic/Insular)' }
  },
  {
    code: 'GERMAN_AM',
    name: 'German American Cohort (HRS Empirical)',
    category: 'Europe',
    geographicCenter: 'United States (Midwest & Mid-Atlantic German-American Cohort)',
    historicalTimeline: 'Empirical German-American demographic cohort from the Health and Retirement Study (HRS). Reflects 18th-20th century migrations from Rhine, Bavaria, and Northern Germany.',
    migrationPath: ['Central European Rhine/Elbe settlement → Transatlantic migration → US Midwest & Mid-Atlantic farming communities'],
    evolutionaryAdaptations: [
      { trait: 'High Lactase Persistence', gene: 'MCM6', rsid: 'rs4988235', impact: 'Pastoralist dairy adaptation (~75% persistence).' }
    ],
    description: 'Empirical German-American population kernel constructed from participants in the NIH Health and Retirement Study (HRS).',
    keyMarkers: ['rs4988235-T', 'rs1426654-A', 'rs16891982-G'],
    empiricalSource: { dataset: 'Health and Retirement Study (HRS)', accession: 'dbGaP phs000428', sampleSize: 2800, admixtureBreakdown: '98.8% Central/NW European' }
  },
  {
    code: 'ITALIAN_AM',
    name: 'Italian American Cohort (HRS Empirical)',
    category: 'Europe',
    geographicCenter: 'United States (Northeast & Urban Italian-American Cohort)',
    historicalTimeline: 'Empirical Italian-American demographic cohort from the Health and Retirement Study (HRS). Reflects late 19th and early 20th century migrations from Southern Italy and Sicily.',
    migrationPath: ['Southern Mediterranean & Sicilian settlement → Transatlantic industrial migration → US Northeast urban centers'],
    evolutionaryAdaptations: [
      { trait: 'Mediterranean FADS Lipid Metabolism', gene: 'FADS1', rsid: 'rs174546', impact: 'Enhanced long-chain PUFA synthesis on plant/olive oil diets.' }
    ],
    description: 'Empirical Italian-American population kernel constructed from participants in the NIH Health and Retirement Study (HRS).',
    keyMarkers: ['rs174546-C', 'rs1426654-A', 'rs4988235-T (~22%)'],
    empiricalSource: { dataset: 'Health and Retirement Study (HRS)', accession: 'dbGaP phs000428', sampleSize: 900, admixtureBreakdown: '99.1% Southern European (Italian/Sicilian)' }
  },

  // ==========================================
  // JEWISH & MIDDLE EASTERN LINEAGES
  // ==========================================
  {
    code: 'ASJ',
    aliases: ['ASJ_gnomAD'],
    name: 'Ashkenazi Jewish (ASJ)',
    category: 'Middle East & Jewish',
    geographicCenter: 'Central & Eastern Europe (historical Diaspora roots in Rhine Valley & Levant)',
    historicalTimeline: 'Levantine Judean ancestry (~50%) fused with Southern European / Italian female lineages (~50%) in the Roman Period (1st–4th Century CE), followed by a severe medieval Rhine/Polish founder bottleneck (~800–1400 CE).',
    migrationPath: [
      'Iron Age Kingdom of Judah / Ancient Israel in Levant',
      'Roman Period Judean migration to Italian Peninsula & West Mediterranean (1st–4th Century CE)',
      'Medieval migration into Rhine Valley (Rhineland Ashkenaz, 9th–11th Century CE)',
      'Eastward expansion into Polish-Lithuanian Commonwealth after medieval persecutions (14th–16th Century CE)'
    ],
    evolutionaryAdaptations: [
      { trait: 'Lysosomal Storage Disease Variants', gene: 'GBA / HEXA / SMPD1', impact: 'Enriched recessive founder mutations (Tay-Sachs, Gaucher, Niemann-Pick) maintained by historic bottlenecks.' },
      { trait: 'BRCA Cancer Predisposition Founder Mutations', gene: 'BRCA1 / BRCA2', rsid: '185delAG / 5382insC', impact: 'High-frequency founder alleles (1 in 40 individuals carrier frequency).' }
    ],
    description: 'Ashkenazi Jewish (ASJ) forms a tightly clustered genetic population created by a ~50/50 mixture of ancient Levantine Middle Eastern and Southern European (Italian/Hellenic) ancestors, followed by a bottleneck down to ~350 effective individuals in the 14th century.',
    keyMarkers: ['Y-DNA J1-M267', 'J2a', 'E-M123', 'R1a-M582', 'mtDNA K1a1b1a', 'N1b'],
    haplogroupNotes: 'Y-DNA J1, J2, E1b1b, R1a-M582 (Levite lineage); mtDNA K1a1b1a (~32% of all Ashkenazim), N1b, H.'
  },
  {
    code: 'lemba_proxy',
    aliases: ['Lemba'],
    name: 'Lemba / Jewish-Bantu Cohort (Soodyall Empirical)',
    category: 'Middle East & Jewish',
    geographicCenter: 'Limpopo & Mpumalanga, South Africa & Zimbabwe',
    historicalTimeline: 'Bantu-speaking population of Southern Africa whose oral history traces paternal descent to ancient Jewish/Semitic traders from the Near East (Sena). Empirical Y-DNA studies confirm high Semitic Haplogroup J-P58 and Cohen Modal Haplotype frequencies.',
    migrationPath: ['Ancient Judean/Yemenite maritime trade along Swahili Coast → Settlement in Zambezi/Limpopo basins → Integration with local Venda/Shona Bantu communities'],
    evolutionaryAdaptations: [
      { trait: 'Semitic Y-DNA Preservation', gene: 'Y-DNA J-P58', impact: 'Over 50% of Lemba Buba clan males carry the Cohen Modal Haplotype.' }
    ],
    description: 'Empirical Lemba dataset sourced from Dr. Himla Soodyall and the Southern African Human Genome Programme (SAGDP).',
    keyMarkers: ['Y-DNA J-P58 (Buba clan CMH)', 'E-M2 (Bantu maternal/paternal)', 'mtDNA L2a'],
    empiricalSource: { dataset: 'Southern African Human Genome Programme (SAGDP)', accession: 'ENA PRJEB9586', sampleSize: 50, admixtureBreakdown: '85% Bantu West/East African, 15% Near Eastern/Semitic' }
  },
  {
    code: 'romani_proxy',
    aliases: ['Romani'],
    name: 'Romani / European-Indo-Aryan Cohort (Martínez-Cruz Empirical)',
    category: 'Middle East & Jewish',
    geographicCenter: 'Balkan Peninsula, Iberian Peninsula, Central & Eastern Europe',
    historicalTimeline: 'Trans-continental diaspora originating from Northwestern India (Punjabi/Domba roots, ~1000 CE), migrating across Anatolia and the Balkans into Europe. Empirical genetics confirms ~30% South Asian Ancestral Indian and ~70% European/Balkan admixture.',
    migrationPath: ['Northwest India (Punjab/Rajasthan, ~1000 CE) → Migration through Persian Empire & Byzantine Anatolia → Balkan expansion (14th Century CE) → European diaspora'],
    evolutionaryAdaptations: [
      { trait: 'South Asian Y-DNA & mtDNA Preservation', gene: 'H-M82 / M5a', impact: 'Preservation of Indian Haplogroup H-M82 Y-DNA and M5a mtDNA.' }
    ],
    description: 'Empirical Romani dataset sourced from the European Genome-phenome Archive (EGA) and Martínez-Cruz et al. (2012) Balkan Roma study.',
    keyMarkers: ['Y-DNA H-M82', 'I2a-CTS10228', 'mtDNA M5a1', 'rs1426654-A'],
    empiricalSource: { dataset: 'Martínez-Cruz et al. (2012) Balkan Roma Study', accession: 'EGA EGAS00001000345', sampleSize: 90, admixtureBreakdown: '70% European (Balkan/EEF), 30% South Asian (Indo-Aryan)' }
  },

  // ==========================================
  // WEST AFRICAN & BANTU LINEAGES
  // ==========================================
  {
    code: 'YRI',
    aliases: ['AFR_gnomAD', 'ALFA_African', 'sgdp_yoruba', 'hgdp_yoruba', 'sgdp_esan', 'ESN'],
    name: 'Yoruba / West African (YRI)',
    category: 'Africa',
    geographicCenter: 'South-Western Nigeria, Oyo, Lagos, Ogun',
    historicalTimeline: 'West African agricultural lineage associated with Yam & Oil Palm domestication (~5000 BCE), Nok culture iron metallurgy (~1000 BCE), and Oyo/Ife urban kingdoms.',
    migrationPath: [
      'West African Holocene hunter-gatherer foraging in West African forest belt',
      'Sudanic / Guinean agricultural development (~6,000 BP)',
      'Nok Culture iron technology expansion across Niger-Benue confluence (~3,000 BP)',
      'Urbanization of Ife & Oyo city-states (11th–19th Century CE)'
    ],
    evolutionaryAdaptations: [
      { trait: 'Duffy Antigen Null (Malaria Resistance)', gene: 'ACKR1 / DARC', rsid: 'rs2814778', impact: 'Fixation (100%) of null allele preventing Plasmodium vivax parasite entry into erythrocytes.' },
      { trait: 'Sickle Cell Trait (Heterozygote Advantage)', gene: 'HBB', rsid: 'rs334', impact: 'Heterozygous HbS confers ~90% protection against lethal Plasmodium falciparum malaria.' },
      { trait: 'APOL1 Kidney Disease Protection', gene: 'APOL1', rsid: 'G1/G2 variants', impact: 'Lytic factors conferring immunity against African Trypanosomiasis (sleeping sickness).' }
    ],
    description: 'Yoruba (YRI) is the primary reference population for West African Niger-Congo genetic diversity. Characterized by deep West African lineage continuity, high genetic diversity, and strong malaria-protective evolutionary selection.',
    keyMarkers: ['rs2814778-C (Duffy Null)', 'rs334-A (HbS)', 'Y-DNA E-M2 / E1b1a'],
    haplogroupNotes: 'Y-DNA E1b1a1a1 (E-M2) (>90%); mtDNA L2a, L3e, L1b, L3b.'
  },
  {
    code: 'AFRAM_SOUTH',
    name: 'African-American Southern Cohort (JHS Empirical)',
    category: 'Africa',
    geographicCenter: 'Jackson, Mississippi & Deep South US',
    historicalTimeline: 'Empirical African-American cohort from the Jackson Heart Study (JHS). Represents West and Central African lineages enriched for coastal rice and cotton agricultural history in the US Deep South.',
    migrationPath: ['Transatlantic enslavement from Bight of Biafra, Windward Coast & West-Central Africa → Deep South plantation labor → Modern Mississippi Delta'],
    evolutionaryAdaptations: [
      { trait: 'Duffy Null Retention', gene: 'ACKR1', rsid: 'rs2814778', impact: 'High Duffy null allele retention (~83%).' }
    ],
    description: 'Empirical African-American Southern population kernel constructed from 3,000 participants in the NIH Jackson Heart Study (JHS).',
    keyMarkers: ['rs2814778-C (~83%)', 'rs1426654-A (~16%)', 'Y-DNA E-M2 (~78%)'],
    empiricalSource: { dataset: 'Jackson Heart Study (JHS)', accession: 'dbGaP phs000286', sampleSize: 3000, admixtureBreakdown: '83% West/Central African, 16% European, 1% Native American' }
  },
  {
    code: 'AFRAM_NORTHEAST',
    name: 'African-American Northeast Cohort (FHS/WHI Empirical)',
    category: 'Africa',
    geographicCenter: 'Northeastern US Urban Centers (NY, PA, MA)',
    historicalTimeline: 'Empirical African-American cohort from the Framingham Heart Study (FHS) and Women\'s Health Initiative (WHI) Northeast subset. Reflects Great Migration movements from Atlantic coastal states.',
    migrationPath: ['Atlantic coastal enslavement → 20th Century Great Migration northward → Northeastern urban centers'],
    evolutionaryAdaptations: [
      { trait: 'Duffy Null & HbS Trait', gene: 'ACKR1 / HBB', impact: 'Malaria protective variant retention.' }
    ],
    description: 'Empirical African-American Northeast population kernel constructed from NIH FHS and WHI Northeast cohorts.',
    keyMarkers: ['rs2814778-C (~79%)', 'rs1426654-A (~20%)'],
    empiricalSource: { dataset: 'Framingham & WHI Northeast Cohorts', accession: 'dbGaP phs000007 / phs000200', sampleSize: 800, admixtureBreakdown: '79% West/Central African, 20% European, 1% Native American' }
  },
  {
    code: 'AFRAM_WEST',
    name: 'African-American Western Cohort (MEC Empirical)',
    category: 'Africa',
    geographicCenter: 'California & Western US (MEC Cohort)',
    historicalTimeline: 'Empirical African-American cohort from the Multiethnic Cohort (MEC). Reflects Second Great Migration movements westward from Texas, Louisiana, and Arkansas.',
    migrationPath: ['West-Central African ancestry → Mid-South plantation history → Second Great Migration to Western US cities'],
    evolutionaryAdaptations: [
      { trait: 'Duffy Null Protection', gene: 'ACKR1', rsid: 'rs2814778', impact: 'High Duffy null frequency (~76%).' }
    ],
    description: 'Empirical African-American Western population kernel constructed from participants in the Multiethnic Cohort (MEC).',
    keyMarkers: ['rs2814778-C (~76%)', 'rs1426654-A (~23%)'],
    empiricalSource: { dataset: 'Multiethnic Cohort (MEC)', accession: 'dbGaP phs000517', sampleSize: 2000, admixtureBreakdown: '76% West/Central African, 23% European, 1% Native American' }
  },

  // ==========================================
  // CARIBBEAN & LATINO COHORTS
  // ==========================================
  {
    code: 'CUBAN_AM',
    name: 'Cuban American Cohort (HCHS/SOL Empirical)',
    category: 'Americas',
    geographicCenter: 'South Florida & Cuba (HCHS/SOL Cohort)',
    historicalTimeline: 'Empirical Cuban cohort from the Hispanic Community Health Study / Study of Latinos (HCHS/SOL). Combines Spanish Iberian, West African, and Taíno Indigenous components.',
    migrationPath: ['Iberian & West African migration to Cuba → 20th Century migrations to Florida'],
    evolutionaryAdaptations: [
      { trait: 'Iberian PUFA Lipid Metabolism', gene: 'FADS1', rsid: 'rs174546', impact: 'High Mediterranean lipid metabolism allele frequency.' }
    ],
    description: 'Empirical Cuban population kernel constructed from 2,300 participants in the NIH HCHS/SOL study.',
    keyMarkers: ['rs1426654-A (~71%)', 'rs2814778-C (~20%)', 'rs3827760-G (~7%)'],
    empiricalSource: { dataset: 'Hispanic Community Health Study / Study of Latinos (HCHS/SOL)', accession: 'dbGaP phs000810', sampleSize: 2300, admixtureBreakdown: '72% European (Spanish), 20% African, 8% Native American (Taíno)' }
  },
  {
    code: 'DOMINICAN_AM',
    name: 'Dominican American Cohort (HCHS/SOL Empirical)',
    category: 'Americas',
    geographicCenter: 'Dominican Republic & US Northeast (HCHS/SOL Cohort)',
    historicalTimeline: 'Empirical Dominican cohort from HCHS/SOL. Characterized by substantial tri-racial admixture balancing West African, Spanish Iberian, and Taíno components.',
    migrationPath: ['Hispaniola colonial settlement → Transatlantic West African and Spanish convergence → Modern diaspora'],
    evolutionaryAdaptations: [
      { trait: 'Duffy Null & Thalassemia Protection', gene: 'ACKR1 / HBB', impact: 'Protective tropical pathogen variants.' }
    ],
    description: 'Empirical Dominican population kernel constructed from 1,400 participants in the NIH HCHS/SOL study.',
    keyMarkers: ['rs2814778-C (~47%)', 'rs1426654-A (~39%)', 'rs3827760-G (~10%)'],
    empiricalSource: { dataset: 'Hispanic Community Health Study / Study of Latinos (HCHS/SOL)', accession: 'dbGaP phs000810', sampleSize: 1400, admixtureBreakdown: '49% African, 38% European (Spanish), 13% Native American (Taíno)' }
  },
  {
    code: 'LOUISIANA_CREOLE',
    name: 'Louisiana Creole Cohort (SCCS Empirical Proxy)',
    category: 'Americas',
    geographicCenter: 'Louisiana & Gulf Coast US (SCCS LA Subset)',
    historicalTimeline: 'Empirical Louisiana Creole approximation derived from the Southern Community Cohort Study (SCCS) Louisiana subset. Combines French/Spanish colonial European, West African, and Native American (Atakapa/Caddo) lineages.',
    migrationPath: ['French/Spanish colonial settlement + West African influx → Cultural and genetic fusion in Bayous & New Orleans'],
    evolutionaryAdaptations: [
      { trait: 'Subtropical Disease Resistance', gene: 'ACKR1', rsid: 'rs2814778', impact: 'Malaria protective variant retention.' }
    ],
    description: 'Empirical Louisiana Creole approximation kernel constructed from Louisiana participants in the SCCS dataset.',
    keyMarkers: ['rs2814778-C (~72%)', 'rs1426654-A (~25%)', 'rs3827760-G (~3%)'],
    empiricalSource: { dataset: 'Southern Community Cohort Study (SCCS LA Subset)', accession: 'dbGaP phs000362', sampleSize: 500, admixtureBreakdown: '72% African, 25% European (French/Spanish), 3% Native American' }
  },

  // ==========================================
  // ASIAN-AMERICAN COHORTS
  // ==========================================
  {
    code: 'FILIPINO_AM',
    name: 'Filipino American Cohort (MEC Empirical)',
    category: 'East Asia',
    geographicCenter: 'Hawaii & California (MEC Cohort)',
    historicalTimeline: 'Empirical Filipino cohort from the Multiethnic Cohort (MEC). Represents Austronesian Philippine ancestry with trace Spanish colonial admixture.',
    migrationPath: ['Austronesian expansion across Philippines → Transpacific migration to Hawaii and US West Coast'],
    evolutionaryAdaptations: [
      { trait: 'CREBRF Thrifty Variant', gene: 'CREBRF', rsid: 'rs373863828', impact: 'Austronesian maritime metabolic allele.' },
      { trait: 'EDAR 370A Fixation', gene: 'EDAR', rsid: 'rs3827760', impact: 'High frequency derived East Asian hair shaft variant (~90%).' }
    ],
    description: 'Empirical Filipino-American population kernel constructed from 1,800 participants in the NIH MEC study.',
    keyMarkers: ['rs3827760-G (~90%)', 'rs671-A (~30%)', 'rs1426654-A (~4%)'],
    empiricalSource: { dataset: 'Multiethnic Cohort (MEC)', accession: 'dbGaP phs000517', sampleSize: 1800, admixtureBreakdown: '95% East Asian (Austronesian), 4% European (Spanish), 1% South Asian' }
  },
  {
    code: 'VIETNAMESE_AM',
    name: 'Vietnamese American Cohort (1000G KHV / WHI Empirical)',
    category: 'East Asia',
    geographicCenter: 'Vietnam & US Diaspora (1000G KHV + WHI Cohort)',
    historicalTimeline: 'Empirical Vietnamese cohort sourced from the 1000 Genomes Kinh in Vietnam (KHV) and Women\'s Health Initiative (WHI) Asian subset.',
    migrationPath: ['Red River Delta agricultural settlement → Post-1975 transpacific diaspora to US'],
    evolutionaryAdaptations: [
      { trait: 'ALDH2 Flush Variant', gene: 'ALDH2', rsid: 'rs671', impact: 'High frequency alcohol flush reaction variant (~25%).' },
      { trait: 'EDAR 370A Fixation', gene: 'EDAR', rsid: 'rs3827760', impact: 'Derived hair shaft variant (~85%).' }
    ],
    description: 'Empirical Vietnamese population kernel constructed from 1000G KHV and WHI Vietnamese participants.',
    keyMarkers: ['rs671-A (~25%)', 'rs3827760-G (~85%)', 'rs1229984-T (~70%)'],
    empiricalSource: { dataset: '1000 Genomes KHV + WHI SHARe', accession: 'IGSR + dbGaP phs000200', sampleSize: 200, admixtureBreakdown: '>99% East Asian (Kinh/Austroasiatic)' }
  },

  // ==========================================
  // INDIGENOUS AMERICAS SUBPOPULATIONS
  // ==========================================
  {
    code: 'sgdp_karitiana',
    aliases: ['Karitiana'],
    name: 'Karitiana / Amazonian Brazil (Karitiana)',
    category: 'Americas',
    geographicCenter: 'Rondônia, Southwestern Amazon Basin, Brazil',
    historicalTimeline: 'Indigenous Tupi-speaking Amazonian population isolated deep within the southwestern Amazon rainforest for millennia prior to modern contact.',
    migrationPath: [
      'Paleo-Indian migration past Laurentide Ice Sheet (~15,000 BP)',
      'Southward Pacific Rim dispersal',
      'Early Amazon Basin settlement (~12,000 BP)',
      'Rainforest isolation producing unadmixed Amazonian genetic profile'
    ],
    evolutionaryAdaptations: [
      { trait: 'PNPLA3 I148M Fixation', gene: 'PNPLA3', rsid: 'rs738409', impact: 'Extreme high frequency (~0.85-0.90) for hepatic lipid storage during Amazonian feast-and-famine cycles.' },
      { trait: 'EDAR 370A Fixation', gene: 'EDAR', rsid: 'rs3827760', impact: 'Complete 100% fixation of Siberian-derived coarse hair allele.' }
    ],
    description: 'Karitiana is a primary genetic reference population for unadmixed South American Amazonian Native American ancestry from HGDP and SGDP datasets.',
    keyMarkers: ['Y-DNA Q-M3', 'mtDNA C1b', 'rs738409-G', 'rs3827760-G'],
    haplogroupNotes: 'Y-DNA Q-M3 / Q-L54 (>95%); mtDNA C1b, D1.'
  },
  {
    code: 'sgdp_surui',
    aliases: ['Surui'],
    name: 'Suruí / Amazonian Brazil (Suruí)',
    category: 'Americas',
    geographicCenter: 'Rondônia / Mato Grosso border, Amazon Basin, Brazil',
    historicalTimeline: 'Tupi-Mondé speaking indigenous Amazonian population displaying deep Amazonian isolation and carrying trace Population Y (Australasian-related) genomic signals.',
    migrationPath: [
      'Ancient Paleo-American entry into South America (~15,000 BP)',
      'Rainforest settlement (~12,000 BP)',
      'Deep interior Amazonian genetic drift'
    ],
    evolutionaryAdaptations: [
      { trait: 'Amazonian Pathogen Immunity', gene: 'HLA-A / HLA-B', impact: 'Specialized MHC allele enrichment for rainforest endemic arbovirus protection.' }
    ],
    description: 'Suruí represents an unadmixed Amazonian indigenous population. Recent ancient DNA studies revealed that Suruí and Karitiana carry a subtle ancestral signal ("Population Y") distantly related to Australasians.',
    keyMarkers: ['Y-DNA Q-M3', 'mtDNA D1', 'Population Y Signal'],
    haplogroupNotes: 'Y-DNA Q-M3; mtDNA D1, C1b.'
  },
  {
    code: 'sgdp_piapoco',
    aliases: ['Piapoco'],
    name: 'Piapoco / Orinoco Basin (Piapoco)',
    category: 'Americas',
    geographicCenter: 'Meta & Vichada Rivers, Orinoco Basin, Colombia & Venezuela',
    historicalTimeline: 'Arawakan-speaking indigenous people of the Orinoco riverine savannas (Llanos Orientales).',
    migrationPath: [
      'Paleo-Indian entry into Northern South America (~14,000 BP)',
      'Settlement along Orinoco-Amazon river networks (~9,000 BP)'
    ],
    evolutionaryAdaptations: [
      { trait: 'Riverine Disease Resistance', gene: 'ACKR1', impact: 'Specialized tropical riverine pathogen immune profile.' }
    ],
    description: 'Piapoco represents northern South American Arawakan indigenous ancestry from the Orinoco river basin.',
    keyMarkers: ['Y-DNA Q-M3', 'mtDNA A2', 'B2'],
    haplogroupNotes: 'Y-DNA Q-M3; mtDNA A2, B2.'
  },
  {
    code: 'sgdp_ticuna',
    aliases: ['Ticuna'],
    name: 'Ticuna / Upper Amazon (Ticuna)',
    category: 'Americas',
    geographicCenter: 'Tres Fronteras region (Brazil, Peru, Colombia), Upper Amazon River',
    historicalTimeline: 'Isolated language-isolate indigenous population of the Upper Amazon riverine forests.',
    migrationPath: [
      'Paleo-Indian migration → Upper Amazon river valley colonization (~10,000 BP)'
    ],
    evolutionaryAdaptations: [
      { trait: 'Humid Tropical Forest Metabolism', gene: 'PNPLA3', rsid: 'rs738409', impact: 'Protective hepatic fat regulation.' }
    ],
    description: 'Ticuna is one of the largest indigenous Amazonian populations, maintaining genetic continuity in the Upper Amazon basin.',
    keyMarkers: ['Y-DNA Q-M3', 'mtDNA C1b', 'D1'],
    haplogroupNotes: 'Y-DNA Q-M3; mtDNA C1b, D1.'
  },
  {
    code: 'sgdp_pima',
    aliases: ['Pima'],
    name: 'Pima / Sonoran Desert (Pima)',
    category: 'Americas',
    geographicCenter: 'Gila River Valley, Arizona (US) & Sonora (Mexico)',
    historicalTimeline: 'Uto-Aztecan speaking descendants of the Hohokam desert canal-farming civilization (300 BCE–1450 CE).',
    migrationPath: [
      'Archaic Southwest desert foraging → Hohokam canal-building agricultural boom → Modern Gila River settlement.'
    ],
    evolutionaryAdaptations: [
      { trait: 'Thrifty Gene Hypothesis', gene: 'ABCA1 / FABP2', impact: 'Natural selection for extreme insulin efficiency and carbohydrate storage during desert droughts, predisposing to modern type-2 diabetes on high-sugar diets.' }
    ],
    description: 'Pima (Akimel O\'odham) is a key Native North American reference population from the Sonoran Desert, famous in medical genetics for desert canal-farming adaptations.',
    keyMarkers: ['Y-DNA Q-M3', 'mtDNA A2', 'B2'],
    haplogroupNotes: 'Y-DNA Q-M3 (~90%); mtDNA A2, B2, C1.'
  },
  {
    code: 'sgdp_mayan',
    aliases: ['Maya'],
    name: 'Maya / Mesoamerica (Maya)',
    category: 'Americas',
    geographicCenter: 'Yucatán Peninsula, Chiapas (Mexico), Highland & Lowland Guatemala',
    historicalTimeline: 'Mayan-speaking civilization builders (Preclassic 2000 BCE – Postclassic 1500 CE) responsible for monumental architecture, mathematics, and writing.',
    migrationPath: [
      'Paleo-Indian Mesoamerican settlement → Early maize domestication in Balsas River Valley (~9,000 BP) → Maya Lowland & Highland urban civilization.'
    ],
    evolutionaryAdaptations: [
      { trait: 'Maize Agricultural Metabolism', gene: 'FADS1 / PNPLA3', impact: 'Adapted to cereal maize/bean agriculture.' }
    ],
    description: 'Maya (sgdp_mayan) represents Mesoamerican indigenous agriculturalist ancestry, characterized by high Native American genetic retention.',
    keyMarkers: ['Y-DNA Q-M3', 'mtDNA A2', 'B2', 'C1'],
    haplogroupNotes: 'Y-DNA Q-M3 (>90%); mtDNA A2, B2, C1.'
  },
  {
    code: 'sgdp_mixtec',
    aliases: ['Mixtec'],
    name: 'Mixtec / Oaxaca Highlands (Mixtec)',
    category: 'Americas',
    geographicCenter: 'La Mixteca region, Oaxaca & Puebla, Mexico',
    historicalTimeline: 'Oto-Manguean speaking Mesoamerican civilization (Tilantongo, Tututepec) renowned for codices, gold metallurgy, and terrace farming.',
    migrationPath: [
      'Early Oto-Manguean diversification in Southern Mexico (~6,000 BP) → Montane terrace agriculture.'
    ],
    evolutionaryAdaptations: [
      { trait: 'Montane Agricultural Metabolism', gene: 'PNPLA3', impact: 'Adapted to high-altitude Mesoamerican maize farming.' }
    ],
    description: 'Mixtec represents high-altitude Oto-Manguean Mesoamerican ancestry from Southern Mexico.',
    keyMarkers: ['Y-DNA Q-M3', 'mtDNA A2', 'B2'],
    haplogroupNotes: 'Y-DNA Q-M3; mtDNA A2, B2.'
  },
  {
    code: 'sgdp_mixe',
    aliases: ['Mixe'],
    name: 'Mixe / Sierra Mixe (Mixe)',
    category: 'Americas',
    geographicCenter: 'Sierra Mixe, Eastern Oaxaca, Mexico',
    historicalTimeline: 'Mixe-Zoquean speaking population distantly descended from the ancient Olmec civilization baseline (~1500–400 BCE).',
    migrationPath: [
      'Olmec Gulf Coast agricultural expansion → Mountain refuge isolation in Sierra Mixe.'
    ],
    evolutionaryAdaptations: [
      { trait: 'Olmec Baseline Genetic Retention', gene: 'EDAR / PNPLA3', impact: 'High endogamous genetic stability.' }
    ],
    description: 'Mixe represents an unadmixed Mesoamerican population carrying direct genetic lineage from the ancient Mixe-Zoquean Olmec culture.',
    keyMarkers: ['Y-DNA Q-M3', 'mtDNA A2', 'B2'],
    haplogroupNotes: 'Y-DNA Q-M3; mtDNA A2, B2.'
  },
  {
    code: 'sgdp_mexico_zapotec',
    aliases: ['Zapotec'],
    name: 'Zapotec / Valley of Oaxaca (Zapotec)',
    category: 'Americas',
    geographicCenter: 'Valley of Oaxaca & Monte Albán, Mexico',
    historicalTimeline: 'Oto-Manguean urban civilization builders of Monte Albán (500 BCE – 800 CE), creating the earliest written script in Mesoamerica.',
    migrationPath: [
      'Early Mesoamerican agricultural settlement → Valley of Oaxaca urban empire.'
    ],
    evolutionaryAdaptations: [
      { trait: 'Urban Agricultural Metabolism', gene: 'FADS1', impact: 'Maize/squash agricultural adaptation.' }
    ],
    description: 'Zapotec (Cloud People) represents one of the oldest continuous urban civilizations in Mesoamerica.',
    keyMarkers: ['Y-DNA Q-M3', 'mtDNA A2', 'B2'],
    haplogroupNotes: 'Y-DNA Q-M3; mtDNA A2, B2.'
  },
  {
    code: 'sgdp_quechua',
    aliases: ['Quechua'],
    name: 'Quechua / Central Andes (Quechua)',
    category: 'Americas',
    geographicCenter: 'Cusco, Puno, Ayacucho, Peruvian & Bolivian Andes',
    historicalTimeline: 'Indigenous Andean civilization lineage associated with Chavín, Tiwanaku, Wari, and the Inca Empire (Tawantinsuyu).',
    migrationPath: [
      'Paleo-Indian Pacific coastal dispersal → Highland Andean colonization (~9,000 BP) → High-altitude hypoxia natural selection.'
    ],
    evolutionaryAdaptations: [
      { trait: 'High-Altitude Hypoxia Tolerance', gene: 'EGLN1 / PRKAA1', impact: 'Selection for lower hemoglobin concentration to prevent polycythemia at 3,500+ meters.' }
    ],
    description: 'Quechua represents the primary genetic reference for high-altitude Andean Indigenous ancestry.',
    keyMarkers: ['EGLN1 Selection', 'Y-DNA Q-M3', 'mtDNA B2b', 'C1b'],
    haplogroupNotes: 'Y-DNA Q-M3 (>90%); mtDNA B2b, C1b.'
  },
  {
    code: 'aymara',
    aliases: ['Aymara'],
    name: 'Aymara / Lake Titicaca Altiplano (Aymara)',
    category: 'Americas',
    geographicCenter: 'Lake Titicaca Basin & Altiplano, Bolivia & Peru',
    historicalTimeline: 'Aymaran-speaking high-altitude civilization builders of Tiwanaku (300–1000 CE).',
    migrationPath: [
      'Altiplano high-altitude settlement (~9,000 BP) → Potato & quinoa domestication.'
    ],
    evolutionaryAdaptations: [
      { trait: 'High-Altitude Chest Expansion & Hypoxemia Resistance', gene: 'EGLN1', impact: 'Specialized physiological adaptation to 4,000m altitude.' }
    ],
    description: 'Aymara represents high-altitude Altiplano indigenous ancestry surrounding Lake Titicaca.',
    keyMarkers: ['Y-DNA Q-M3', 'mtDNA B2', 'C1'],
    haplogroupNotes: 'Y-DNA Q-M3; mtDNA B2, C1.'
  },
  {
    code: 'guarani',
    aliases: ['Guarani'],
    name: 'Guaraní / Paraná Basin (Guaraní)',
    category: 'Americas',
    geographicCenter: 'Paraguay, Paraná-Uruguay River Basins, Argentina, Brazil',
    historicalTimeline: 'Tupi-Guarani agriculturalists and forest navigators of South-Central South America.',
    migrationPath: [
      'Amazonian Tupi expansion southward into Gran Chaco and Paraná basin (~3,000 BP).'
    ],
    evolutionaryAdaptations: [
      { trait: 'Subtropical Forest Adaptation', gene: 'PNPLA3', impact: 'Subtropical riverine metabolism.' }
    ],
    description: 'Guaraní represents Southern South American Tupi-Guarani indigenous lineage.',
    keyMarkers: ['Y-DNA Q-M3', 'mtDNA C1', 'D1'],
    haplogroupNotes: 'Y-DNA Q-M3; mtDNA C1, D1.'
  },
  {
    code: 'sgdp_tlingit',
    aliases: ['Tlingit'],
    name: 'Tlingit / Pacific Northwest Coast (Tlingit)',
    category: 'Americas',
    geographicCenter: 'Southeast Alaska Panhandle & Coastal British Columbia',
    historicalTimeline: 'Na-Dene speaking maritime fishing civilization famed for totem poles, potlatches, and cedar plank houses.',
    migrationPath: [
      'Na-Dene migration from interior Alaska/Canada to Pacific Northwest fjords (~6,000 BP).'
    ],
    evolutionaryAdaptations: [
      { trait: 'Marine Salmon/Seal High-Omega-3 Diet Adaptation', gene: 'FADS1 / FADS2', impact: 'Tailored fatty acid synthesis.' }
    ],
    description: 'Tlingit represents Pacific Northwest Na-Dene coastal indigenous ancestry.',
    keyMarkers: ['Y-DNA C2-M217 (Na-Dene branch)', 'Q-M3', 'mtDNA A2'],
    haplogroupNotes: 'Y-DNA C2a-P39 (~40%), Q-M3; mtDNA A2, D4h3a.'
  },
  {
    code: 'sgdp_eskimo_chaplin',
    aliases: ['Inuit', 'Saqqaq', 'sgdp_eskimo_naukan', 'sgdp_eskimo_sireniki'],
    name: 'Inuit & Siberian Eskimo (Chaplin / Saqqaq)',
    category: 'Americas',
    geographicCenter: 'Chukotka, Arctic Alaska, Northern Canada, Greenland',
    historicalTimeline: 'Neo-Eskimo (Thule) and Paleo-Eskimo (Saqqaq, Dorsett) Arctic maritime hunters (~4,500–1,000 BP).',
    migrationPath: [
      'Late Beringian sea-crossing (~4,500 BP) → Rapid Arctic expansion across North America to Greenland.'
    ],
    evolutionaryAdaptations: [
      { trait: 'FADS Fatty Acid Adaptation', gene: 'FADS1 / FADS2', rsid: 'rs174546', impact: 'Adapted to high-fat marine mammal diet.' },
      { trait: 'CPT1A Arctic Variant', gene: 'CPT1A', rsid: 'P479L', impact: 'Protects against Arctic hypothermia and hypoglycemia.' }
    ],
    description: 'Inuit / Siberian Eskimo represents late-arriving Neo-Eskimo Arctic maritime populations.',
    keyMarkers: ['CPT1A P479L', 'FADS selection', 'Y-DNA N-M231', 'Q-L54', 'mtDNA A2a', 'D2a'],
    haplogroupNotes: 'Y-DNA N-M231 (~50%), Q-L54; mtDNA A2a, D2a.'
  },
  {
    code: 'algonquian',
    aliases: ['Eastern Woodlands', 'Ojibwe', 'Lenape', 'Nanticoke', 'LMB', 'CHK', 'LNP', 'NAN', 'CAT', 'WDN', 'MEL'],
    name: 'Eastern Woodlands Algonquian',
    category: 'Americas',
    geographicCenter: 'Mid-Atlantic, Great Lakes, Boreal Forest, Eastern US & Canada',
    historicalTimeline: 'Algonquian-speaking birchbark canoe builders, coastal fishers, wild rice harvesters, and hunters of the Eastern Woodlands (Delaware Valley, Chesapeake, Great Lakes).',
    migrationPath: [
      'Glacial retreat entry into Eastern Woodlands and Great Lakes (~10,000 BP).'
    ],
    evolutionaryAdaptations: [
      { trait: 'Woodland & Coastal Riverine Adaptation', gene: 'PNPLA3', impact: 'Adapted to wild rice, fish, and game diets.' }
    ],
    description: 'Consolidated Eastern Woodlands Algonquian ancestral lineage encompassing Great Lakes, Mid-Atlantic, and Boreal Forest Algonquian-speaking populations.',
    keyMarkers: ['Y-DNA Q-M3', 'C2-M217', 'mtDNA X2a', 'A2'],
    haplogroupNotes: 'Y-DNA Q-M3, C2a-P39; mtDNA X2a (~25%), A2, B2.'
  },
  {
    code: 'usr1',
    aliases: ['anzick1', 'luzia', 'kennewick', 'spirit_cave'],
    name: 'Ancient Paleo-American Reference Genomes (USR1 / Anzick-1 / Luzia)',
    category: 'Americas',
    geographicCenter: 'Interior Alaska, Montana (Clovis), Lagoa Santa (Brazil)',
    historicalTimeline: 'Cornerstone ancient genomes establishing Paleo-Indian migrations: USR1 (Ancient Beringian, 11,500 BP), Anzick-1 (Clovis Boy, 12,600 BP), and Luzia (Lagoa Santa Paleoamerican, 12,700 BP).',
    migrationPath: [
      'Beringian Standstill divergence in Alaska (~24,000–16,000 BP)',
      'Southward migration past Laurentide Ice Sheet (Anzick-1 Clovis lineage, ~13,000 BP)',
      'Rapid South American colonization (Lagoa Santa Luzia lineage, ~12,700 BP)'
    ],
    evolutionaryAdaptations: [
      { trait: 'Sub-Arctic & High-Fat Adaptation', gene: 'FADS1 / TRPM8', impact: 'Fatty acid metabolism tailored to megafauna hunting.' }
    ],
    description: 'Ancient Paleo-American reference genomes (USR1, Anzick-1, Luzia, Kennewick) form the empirical ancient benchmark for all Indigenous American populations.',
    keyMarkers: ['Y-DNA Q-L54', 'mtDNA C1b, D4h3a'],
    haplogroupNotes: 'Y-DNA Q-L54 / Q-M3; mtDNA C1b, D4h3a.'
  },

  // ==========================================
  // OCEANIA & SAHUL LINEAGES
  // ==========================================
  {
    code: 'sgdp_papuan',
    aliases: ['sgdp_australian', 'sgdp_bougainville', 'sgdp_hawaiian', 'sgdp_maori', 'australian_ancient'],
    name: 'Papuan & Sahul Oceanian (Papuan / Australian / Polynesian)',
    category: 'Oceania & Sahul',
    geographicCenter: 'Papua New Guinea, Australia (Willandra Lakes), Bougainville, Hawaii, Aotearoa',
    historicalTimeline: 'Deep Paleolithic Sahul lineage (~50,000 BP) representing early modern human settlement of Australasia, retaining the world highest level of Denisovan archaic introgression (~4-6%), alongside Lapita maritime expansion into Polynesia.',
    migrationPath: [
      'Southern Express Route Out-of-Africa migration along Indian Ocean coast (~65,000–55,000 BP)',
      'Sea crossing across Wallace Line into Pleistocene Sahul (Australia + New Guinea landmass, ~50,000 BP)',
      'Admixture with archaic Denisovans in Southeast Asia (~45,000 BP)',
      'Lapita pottery maritime voyager expansion across Remote Oceania (~3,500–1,000 BP)'
    ],
    evolutionaryAdaptations: [
      { trait: 'Denisovan Archaic Immunity Introgression', gene: 'OAS1 / STAT2', impact: 'Introgressed Denisovan immune genes providing enhanced protection against tropical RNA viruses.' },
      { trait: 'Thrifty Gene / Maritime Fasting Adaptation', gene: 'CREBRF', rsid: 'rs373863828', impact: 'Missense variant in Polynesians promoting fat storage during long-distance open-ocean voyaging.' }
    ],
    description: 'Papuan, Aboriginal Australian, and Polynesian reference populations carry deep Sahul heritage (~50,000 years isolation) enriched with ~4-6% Denisovan archaic DNA.',
    keyMarkers: ['4-6% Denisovan Introgression', 'rs373863828-A (CREBRF)', 'Y-DNA MS-P93', 'C-M130'],
    haplogroupNotes: 'Y-DNA K-M9, MS-P93, C-M130; mtDNA P, Q, M28, B4a1a1 (Polynesian motif).'
  },

  // ==========================================
  // CENTRAL ASIAN & SIBERIAN LINEAGES
  // ==========================================
  {
    code: 'sgdp_kyrgyz_kyrgyzstan',
    aliases: ['sgdp_altaian', 'sgdp_chukchi', 'sgdp_even', 'sgdp_itelmen', 'sgdp_mansi', 'sgdp_tubalar', 'sgdp_ulchi', 'sgdp_uyghur'],
    name: 'Central Asian & Siberian Nomads (Kyrgyz / Uyghur / Altaian / Even / Chukchi)',
    category: 'Central Asia & Siberia',
    geographicCenter: 'Tian Shan Mountains, Altai-Sayan, Kamchatka, Chukotka, Ural Mountains',
    historicalTimeline: 'Central Asian Turkic and North Siberian populations combining Ancient North Eurasian (ANE), East Asian (Mongolic/Siberian), and Western Eurasian (Steppe/Indo-Iranian) lineages along the Silk Road.',
    migrationPath: [
      'Bronze Age Indo-Iranian Andronovo & Afanasievo herder expansion into Central Asia (~4,000 BP)',
      'Turkic nomadic expansion out of Altai-Sayan mountains (~6th Century CE)',
      'Mongol Empire unification (13th Century CE) producing ~60% East Asian and ~40% West Eurasian autosomal blend'
    ],
    evolutionaryAdaptations: [
      { trait: 'High-Altitude Adaptation', gene: 'EPAS1', impact: 'Genetic adaptations to Tian Shan mountain ranges (3,000+ meters).' },
      { trait: 'Sub-Arctic Cold & Mare Milk Metabolism', gene: 'TRPM8 / MCM6', impact: 'Adapted to sub-freezing Siberian winters and nomadic pastoralist mare-milk consumption.' }
    ],
    description: 'Kyrgyz, Uyghur, Altaian, and Siberian populations represent Silk Road and sub-Arctic Eurasian steppe nomads, exhibiting an ancient ~60/40 blend of East Asian and West Eurasian ancestries.',
    keyMarkers: ['Y-DNA R1a-Z93', 'C-M217', 'O-M122', 'N-M231'],
    haplogroupNotes: 'Y-DNA R1a-Z93, C-M217, N-M231; mtDNA D4, C4, G2, H, U.'
  }
];

/**
 * Robust population lookup helper that resolves any population code or alias
 * (e.g. 'sgdp_yoruba', 'AFR_gnomAD', 'FRENCH', 'NFE_gnomAD', 'jomon', 'sgdp_karitiana', 'romani_proxy')
 * to its matching master glossary entry.
 */
export function getPopulationGlossaryItem(codeOrAlias: string): PopulationGlossaryItem | undefined {
  if (!codeOrAlias) return undefined;
  const target = codeOrAlias.toLowerCase().trim();

  // 1. Direct code match
  const directMatch = SUBPOPULATION_GLOSSARY_DATA.find(item => item.code.toLowerCase() === target);
  if (directMatch) return directMatch;

  // 2. Alias match
  const aliasMatch = SUBPOPULATION_GLOSSARY_DATA.find(item => 
    item.aliases?.some(alias => alias.toLowerCase() === target)
  );
  if (aliasMatch) return aliasMatch;

  // 3. Partial / fallback match
  return SUBPOPULATION_GLOSSARY_DATA.find(item => 
    item.name.toLowerCase().includes(target) || 
    item.code.toLowerCase().includes(target)
  );
}
