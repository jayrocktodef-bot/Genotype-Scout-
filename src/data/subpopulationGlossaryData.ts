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
      'Out-of-Africa migration via Levant corridor (~60,000–50,000 years ago)',
      'Paleolithic & Mesolithic Hunter-Gatherer colonization of European glacial refugia (~40,000–10,000 years ago)',
      'Neolithic Anatolian Farmer expansion along Danube and Mediterranean routes (~8,000–6,000 years ago)',
      'Bronze Age Corded Ware & Bell Beaker Steppe herder migration from Pontic-Caspian Steppe (~4,800–4,000 years ago)'
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
      'Mesolithic Hunter-Gatherer settlement (e.g. Cheddar Man, ~10,000 years ago)',
      'Neolithic Megalithic Farmer expansion into Britain (~6,000 years ago)',
      'Massive Bell Beaker Steppe migration replacing ~90% of Neolithic British gene pool (~4,400 years ago)',
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
      'Post-glacial North-Eastern European settlement (~9,000 years ago)',
      'Comb Ceramic culture hunter-gatherer interactions (~6,000 years ago)',
      'Uralic migration carrying Siberian Nganasan-like ancestry & Haplogroup N-M231 from Trans-Urals (~3,500 years ago)',
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
      'Neolithic Funnelbeaker and Globular Amphora agricultural settlements (~5,500 years ago)',
      'Corded Ware Culture Steppe expansion into Eastern Europe (~4,800 years ago)',
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
      'Sudanic / Guinean agricultural development (~6,000 years ago)',
      'Nok Culture iron technology expansion across Niger-Benue confluence (~3,000 years ago)',
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
  {
    code: 'MSL',
    aliases: ['Mende', 'sgdp_mende', 'hgdp_mende'],
    name: 'Mende / Sierra Leone (MSL)',
    category: 'Africa',
    geographicCenter: 'Southern & Eastern Sierra Leone (Mande belt)',
    historicalTimeline: 'Mande-speaking West African lineage originating from the upper Niger River basin, settling the forested Windward Coast.',
    migrationPath: ['Upper Niger agricultural expansion → Windward Coast forest settlement (~1,500 years ago)'],
    evolutionaryAdaptations: [
      { trait: 'Duffy Null Malaria Resistance', gene: 'ACKR1', rsid: 'rs2814778', impact: 'Fixation (100%) conferring resistance to P. vivax.' },
      { trait: 'Sickle Cell Trait', gene: 'HBB', rsid: 'rs334', impact: 'Heterozygote advantage against falciparum malaria.' }
    ],
    description: 'Mende (MSL) from 1000 Genomes Phase 3 represents Mande-speaking West African Windward Coast genetic diversity.',
    keyMarkers: ['rs2814778-C', 'rs334-A', 'Y-DNA E-M2'],
    haplogroupNotes: 'Y-DNA E1b1a1a1 (E-M2); mtDNA L2a, L3b, L3e.'
  },
  {
    code: 'GWD',
    aliases: ['Mandinka', 'Wolof', 'sgdp_mandinka', 'sgdp_wolof'],
    name: 'Gambian in Mandeni (GWD)',
    category: 'Africa',
    geographicCenter: 'Gambia River Basin, Senegal, The Gambia',
    historicalTimeline: 'Upper Guinea coastal population shaped by the medieval Mali Empire and Jolof Empire.',
    migrationPath: ['Mali Empire westward expansion down the Gambia River (~13th Century CE)'],
    evolutionaryAdaptations: [
      { trait: 'APOL1 Sleeping Sickness Immunity', gene: 'APOL1', impact: 'Lytic factor variants G1/G2 against T. b. rhodesiense.' }
    ],
    description: 'Gambian in Mandeni (GWD) represents Upper Guinea Coast West African ancestry (Mandinka, Wolof, Jola).',
    keyMarkers: ['rs2814778-C', 'Y-DNA E-M2', 'E-M33'],
    haplogroupNotes: 'Y-DNA E1b1a (E-M2), E1b1a1a1g; mtDNA L2a1, L3b, L1b.'
  },
  {
    code: 'ESN',
    aliases: ['Esan', 'Edo', 'sgdp_esan'],
    name: 'Esan / Benin Kingdom (ESN)',
    category: 'Africa',
    geographicCenter: 'Edo State, Southwestern Nigeria',
    historicalTimeline: 'Edoid-speaking lineage historically integral to the ancient Kingdom of Benin (11th–19th Century CE).',
    migrationPath: ['Niger-Benue confluence agricultural expansion → Rainforest Kingdom of Benin urban development'],
    evolutionaryAdaptations: [
      { trait: 'Duffy Null Fixation', gene: 'ACKR1', rsid: 'rs2814778', impact: '100% fixation of P. vivax resistance.' }
    ],
    description: 'Esan (ESN) from 1000 Genomes Phase 3 represents Edoid West African ancestry from the Benin Kingdom region.',
    keyMarkers: ['rs2814778-C', 'rs334-A', 'Y-DNA E-M2'],
    haplogroupNotes: 'Y-DNA E-M2 (>95%); mtDNA L2a, L3e.'
  },
  {
    code: 'IGBO',
    aliases: ['Igbo', 'Ibo', 'Biafra'],
    name: 'Igbo / Southeastern Nigeria (IGBO)',
    category: 'Africa',
    geographicCenter: 'Southeastern Nigeria (Anambra, Enugu, Imo, Abia)',
    historicalTimeline: 'Volta-Niger speaking lineage associated with the Nri Kingdom (9th Century CE) and Bight of Biafra agricultural history.',
    migrationPath: ['Lower Niger basin agricultural settlement → Nri Kingdom economic & bronze metalwork expansion'],
    evolutionaryAdaptations: [
      { trait: 'Sickle Cell & APOL1 Selection', gene: 'HBB / APOL1', rsid: 'rs334', impact: 'High protection against malaria and sleeping sickness.' }
    ],
    description: 'Igbo represents major Southeastern Nigerian West African ancestry, a primary source region during historical transatlantic migrations.',
    keyMarkers: ['rs2814778-C', 'rs334-A', 'Y-DNA E-M2'],
    haplogroupNotes: 'Y-DNA E-M2 (~92%); mtDNA L2a1, L3e, L1b.'
  },
  {
    code: 'AKAN_ASHANTI',
    aliases: ['Akan', 'Ashanti', 'Fante', 'Ghana'],
    name: 'Akan & Ashanti / Gold Coast (AKAN)',
    category: 'Africa',
    geographicCenter: 'Ashanti Region, Southern Ghana & Ivory Coast',
    historicalTimeline: 'Kwa-speaking lineage associated with the Ashanti Empire (17th–19th Century CE) and Gold Coast history.',
    migrationPath: ['Sahelian agricultural shifts southward into Gold Coast forest zone → Ashanti Empire unification'],
    evolutionaryAdaptations: [
      { trait: 'G6PD Deficiency Malaria Protection', gene: 'G6PD', rsid: 'rs1050828', impact: 'G6PD A- variant conferring falciparum malaria protection.' }
    ],
    description: 'Akan & Ashanti represents Gold Coast West African ancestry, famed for gold metallurgy and Ashanti Empire history.',
    keyMarkers: ['rs1050828-T (G6PD A-)', 'rs2814778-C', 'Y-DNA E-M2'],
    haplogroupNotes: 'Y-DNA E-M2 (~90%); mtDNA L2a, L3e, L1b.'
  },
  {
    code: 'FULANI',
    aliases: ['Fulani', 'Peul', 'Fula', 'sgdp_fulani'],
    name: 'Fulani / Trans-Sahelian Pastoralist (FULANI)',
    category: 'Africa',
    geographicCenter: 'Sahel region across West & Central Africa (Senegal to Sudan)',
    historicalTimeline: 'Nomadic pastoralist population exhibiting Senegambian West African ancestry blended with ancient North African / Eurasian admixture (~20-30%).',
    migrationPath: ['Senegambian roots → Trans-Sahelian eastward pastoralist migrations across West Africa'],
    evolutionaryAdaptations: [
      { trait: 'African Lactase Persistence T-13910', gene: 'MCM6', rsid: 'rs4988235', impact: 'Pastoralist milk adaptation.' }
    ],
    description: 'Fulani (Peul) is a nomadic pastoralist African population characterized by West African roots with ancient Eurasian/North African admixture.',
    keyMarkers: ['rs4988235-T', 'Y-DNA E-M2', 'T1a', 'R1b-V88'],
    haplogroupNotes: 'Y-DNA E-M2, R1b-V88, T1a; mtDNA L2a, L3b, H1, J1.'
  },
  {
    code: 'HAUSA',
    aliases: ['Hausa', 'sgdp_hausa'],
    name: 'Hausa / Chadic Afroasiatic (HAUSA)',
    category: 'Africa',
    geographicCenter: 'Northern Nigeria & Southern Niger (Kano, Katsina, Sokoto)',
    historicalTimeline: 'Chadic Afroasiatic-speaking urban trade civilization of the Hausa Kingdoms (Kano, Katsina) across the trans-Saharan trade network.',
    migrationPath: ['Sahara desertification → Sahelian settlement → Trans-Saharan trade urban centers'],
    evolutionaryAdaptations: [
      { trait: 'Arid Climate Lipid Metabolism', gene: 'FADS1', impact: 'Adapted to Sahelian cereal and cattle trade diets.' }
    ],
    description: 'Hausa represents Northern Nigerian and Niger Chadic-speaking West African trade civilization ancestry.',
    keyMarkers: ['rs2814778-C', 'Y-DNA E-M2', 'R1b-V88'],
    haplogroupNotes: 'Y-DNA E-M2, R1b-V88 (~15-20%); mtDNA L2a, L3e, L3f.'
  },
  {
    code: 'BAKONGO',
    aliases: ['Bakongo', 'Kongo', 'sgdp_kongo', 'Angola'],
    name: 'Bakongo / Kingdom of Kongo (BAKONGO)',
    category: 'Africa',
    geographicCenter: 'Northern Angola, DRC, Congo Republic (Congo River estuary)',
    historicalTimeline: 'Bantu-speaking lineage associated with the Kingdom of Kongo (14th–19th Century CE). Major ancestral component in the Transatlantic Diaspora.',
    migrationPath: ['Early Bantu expansion southward from Cross River → Congo Basin riverine expansion → Kingdom of Kongo'],
    evolutionaryAdaptations: [
      { trait: 'Tropical Rainforest Immune Profiling', gene: 'ACKR1 / APOL1', impact: 'Fixation of Duffy null malaria resistance.' }
    ],
    description: 'Bakongo represents West-Central African Bantu ancestry from the Kingdom of Kongo and Angola coast.',
    keyMarkers: ['rs2814778-C', 'Y-DNA E-M2 (E-P252)', 'mtDNA L1b, L2a'],
    haplogroupNotes: 'Y-DNA E-M2 (~95%); mtDNA L1b, L2a, L3e.'
  },
  {
    code: 'LUBA',
    aliases: ['Luba', 'Baluba', 'sgdp_luba'],
    name: 'Luba / Central Congo (LUBA)',
    category: 'Africa',
    geographicCenter: 'Kasai & Katanga provinces, Democratic Republic of Congo',
    historicalTimeline: 'Bantu-speaking lineage associated with the Luba Empire (16th–19th Century CE) in Central Africa.',
    migrationPath: ['Central African riverine Bantu expansion → Luba Empire unification in Kasai-Katanga savannas'],
    evolutionaryAdaptations: [
      { trait: 'Central African Savanna Pathogen Immune Profile', gene: 'ACKR1', impact: 'Duffy null fixation.' }
    ],
    description: 'Luba (Baluba) represents Central African interior Bantu ancestry from the Congo Basin savannas.',
    keyMarkers: ['rs2814778-C', 'Y-DNA E-M2'],
    haplogroupNotes: 'Y-DNA E-M2 (>90%); mtDNA L0a, L2a, L3e.'
  },
  {
    code: 'MBUTI_BIAKA',
    aliases: ['Mbuti', 'Biaka', 'Baka', 'Pygmy', 'hgdp_mbuti', 'hgdp_biaka'],
    name: 'Mbuti & Biaka / Rainforest Hunter-Gatherers (PYGMY)',
    category: 'Africa',
    geographicCenter: 'Ituri Rainforest (DRC) & Central African Republic / Republic of Congo',
    historicalTimeline: 'Indigenous Central African Rainforest Hunter-Gatherers representing one of the earliest modern human population splits (~60,000–100,000 years ago).',
    migrationPath: ['Ancient Paleolithic Congo Basin rainforest foraging (~100,000 years ago isolation)'],
    evolutionaryAdaptations: [
      { trait: 'Rainforest Stature Phenotype (Pygmy Stature)', gene: 'GHSR / IGF1', impact: 'Genetic selection altering growth hormone pathways for rainforest canopy navigation and heat regulation.' },
      { trait: 'Deep Rainforest Immune Selection', gene: 'HLA / KIR', impact: 'Unique MHC immunity against rainforest tropical parasites.' }
    ],
    description: 'Mbuti & Biaka represent deep indigenous Central African Rainforest Hunter-Gatherer lineages with extreme genetic divergence.',
    keyMarkers: ['Y-DNA B-M60', 'A-M51', 'mtDNA L1c, L0d'],
    haplogroupNotes: 'Y-DNA B2b (B-M60) (~60-70%), A-M51; mtDNA L1c1 (~70%), L0a.'
  },
  {
    code: 'SOMALI',
    aliases: ['Somali', 'sgdp_somali', 'hgdp_somali'],
    name: 'Somali / Horn of Africa Cushitic (SOMALI)',
    category: 'Africa',
    geographicCenter: 'Somalia, Somaliland, Ogaden (Ethiopia), Djibouti',
    historicalTimeline: 'Afroasiatic Cushitic-speaking maritime trading lineage (Land of Punt, Sultanate of Adal) carrying ~60% Horn African & ~40% Eurasian/Near Eastern admixture (~3,000 BCE).',
    migrationPath: ['Ancient Afroasiatic expansion in Horn of Africa → Near Eastern / South Arabian maritime trade interactions'],
    evolutionaryAdaptations: [
      { trait: 'Cushitic Lactase Persistence C-14010', gene: 'MCM6', rsid: 'rs1456896', impact: 'Selected for camel and goat milk pastoralism.' }
    ],
    description: 'Somali represents Horn of Africa Cushitic ancestry characterized by ancient Afroasiatic pastoralism and trade.',
    keyMarkers: ['Y-DNA E-V32 (E1b1b)', 'mtDNA L3f1b, M1, N1a', 'rs1456896-G'],
    haplogroupNotes: 'Y-DNA E-V32 (~75-80%), T1a; mtDNA L3f1b, M1a, N1a.'
  },
  {
    code: 'AMHARA_TIGRAY',
    aliases: ['Amhara', 'Tigray', 'Ethiopian', 'sgdp_amhara', 'sgdp_tigray'],
    name: 'Amhara & Tigray / Ethiopian Highlands (AMHARA)',
    category: 'Africa',
    geographicCenter: 'Ethiopian Highlands (Gonder, Shewa, Tigray, Eritrea)',
    historicalTimeline: 'Ethiosemitic-speaking highland civilization builders of the Kingdom of Aksum (100–940 CE).',
    migrationPath: ['Highland Ethiopian agricultural development → South Arabian trade & Aksumite Empire expansion'],
    evolutionaryAdaptations: [
      { trait: 'High-Altitude Adaptation', gene: 'EGLN1', impact: 'Adapted to 2,500+ meter Ethiopian plateau elevation.' },
      { trait: 'Highland Dairy Metabolism', gene: 'MCM6', rsid: 'rs1456896', impact: 'Cushitic/Ethiosemitic pastoralist milk digestion.' }
    ],
    description: 'Amhara & Tigray represents Ethiosemitic highland Ethiopian ancestry associated with Aksumite civilization.',
    keyMarkers: ['Y-DNA E-M35', 'J-M267', 'T1a', 'mtDNA L3, M1, HV'],
    haplogroupNotes: 'Y-DNA E1b1b (E-M35), J1-M267, T1a; mtDNA L3, M1, HV, R0.'
  },
  {
    code: 'DINKA_NUER',
    aliases: ['Dinka', 'Nuer', 'Shilluk', 'Nilotic', 'sgdp_dinka'],
    name: 'Dinka & Nuer / South Sudan Nilotic (DINKA)',
    category: 'Africa',
    geographicCenter: 'Sudd Marshlands & Bahr el Ghazal, South Sudan',
    historicalTimeline: 'Nilo-Saharan speaking pastoralist population of the Upper Nile Valley exhibiting extreme physical stature and unadmixed Nilo-Saharan lineage continuity.',
    migrationPath: ['Upper Nile Valley Paleolithic foraging → Sudd marshland pastoralism & cattle culture'],
    evolutionaryAdaptations: [
      { trait: 'High-Stature Thermoregulation', gene: 'FBN1 / GH1', impact: 'Allen Rule adaptation producing long distal limbs for heat dissipation in tropical wetlands.' }
    ],
    description: 'Dinka & Nuer represents Nilotic Nilo-Saharan ancestry from South Sudan, famed for extreme height and cattle culture.',
    keyMarkers: ['Y-DNA A-M13', 'B-M60', 'E-M2', 'mtDNA L0a, L2a, L3f'],
    haplogroupNotes: 'Y-DNA A-M13 (~45-50%), E-M2; mtDNA L0a, L2a, L3f.'
  },
  {
    code: 'SAN_KHOE',
    aliases: ['San', 'Khoe', 'Bushman', 'Ju_hoansi', 'Nama', 'hgdp_san', 'sgdp_ju_hoansi'],
    name: 'San & Khoe / Kalahari Bushmen (KHOISAN)',
    category: 'Africa',
    geographicCenter: 'Kalahari Desert, Namibia, Botswana, Northern Cape (South Africa)',
    historicalTimeline: 'Indigenous Southern African Hunter-Gatherers representing the oldest ancestral lineage branch in modern human genetics (~150,000–200,000 years ago).',
    migrationPath: ['Deep Paleolithic Southern African isolation in Kalahari refugia (~160,000 years ago)'],
    evolutionaryAdaptations: [
      { trait: 'Arid Desert Water & Fat Regulation', gene: 'APOB / SLC24A5', impact: 'Adaptations for extreme desert survival and steatopygia.' },
      { trait: 'UV & Cold Night Adaptation', gene: 'TRPM8 / TYRP1', impact: 'Kalahari desert temperature swings adaptation.' }
    ],
    description: 'San & Khoe represents the earliest diverging lineage of Homo sapiens with unprecedented genetic diversity.',
    keyMarkers: ['Y-DNA A-M51', 'A-M114', 'mtDNA L0d', 'L0k'],
    haplogroupNotes: 'Y-DNA A1b1b (A-M51), B2b; mtDNA L0d (~80-90%), L0k.'
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
      'Paleo-Indian migration past Laurentide Ice Sheet (~15,000 years ago)',
      'Southward Pacific Rim dispersal',
      'Early Amazon Basin settlement (~12,000 years ago)',
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
      'Ancient Paleo-American entry into South America (~15,000 years ago)',
      'Rainforest settlement (~12,000 years ago)',
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
      'Paleo-Indian entry into Northern South America (~14,000 years ago)',
      'Settlement along Orinoco-Amazon river networks (~9,000 years ago)'
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
      'Paleo-Indian migration → Upper Amazon river valley colonization (~10,000 years ago)'
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
      'Paleo-Indian Mesoamerican settlement → Early maize domestication in Balsas River Valley (~9,000 years ago) → Maya Lowland & Highland urban civilization.'
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
      'Early Oto-Manguean diversification in Southern Mexico (~6,000 years ago) → Montane terrace agriculture.'
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
      'Paleo-Indian Pacific coastal dispersal → Highland Andean colonization (~9,000 years ago) → High-altitude hypoxia natural selection.'
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
      'Altiplano high-altitude settlement (~9,000 years ago) → Potato & quinoa domestication.'
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
      'Amazonian Tupi expansion southward into Gran Chaco and Paraná basin (~3,000 years ago).'
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
      'Na-Dene migration from interior Alaska/Canada to Pacific Northwest fjords (~6,000 years ago).'
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
    historicalTimeline: 'Neo-Eskimo (Thule) and Paleo-Eskimo (Saqqaq, Dorsett) Arctic maritime hunters (~4,500–1,000 years ago).',
    migrationPath: [
      'Late Beringian sea-crossing (~4,500 years ago) → Rapid Arctic expansion across North America to Greenland.'
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
      'Glacial retreat entry into Eastern Woodlands and Great Lakes (~10,000 years ago).'
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
    historicalTimeline: 'Cornerstone ancient genomes establishing Paleo-Indian migrations: USR1 (Ancient Beringian, 11,500 years ago), Anzick-1 (Clovis Boy, 12,600 years ago), and Luzia (Lagoa Santa Paleoamerican, 12,700 years ago).',
    migrationPath: [
      'Beringian Standstill divergence in Alaska (~24,000–16,000 years ago)',
      'Southward migration past Laurentide Ice Sheet (Anzick-1 Clovis lineage, ~13,000 years ago)',
      'Rapid South American colonization (Lagoa Santa Luzia lineage, ~12,700 years ago)'
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
    historicalTimeline: 'Deep Paleolithic Sahul lineage (~50,000 years ago) representing early modern human settlement of Australasia, retaining the world highest level of Denisovan archaic introgression (~4-6%), alongside Lapita maritime expansion into Polynesia.',
    migrationPath: [
      'Southern Express Route Out-of-Africa migration along Indian Ocean coast (~65,000–55,000 years ago)',
      'Sea crossing across Wallace Line into Pleistocene Sahul (Australia + New Guinea landmass, ~50,000 years ago)',
      'Admixture with archaic Denisovans in Southeast Asia (~45,000 years ago)',
      'Lapita pottery maritime voyager expansion across Remote Oceania (~3,500–1,000 years ago)'
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
      'Bronze Age Indo-Iranian Andronovo & Afanasievo herder expansion into Central Asia (~4,000 years ago)',
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
  },

  // ==========================================
  // SOUTH ASIAN LINEAGES (SAS)
  // ==========================================
  {
    code: 'GIH',
    aliases: ['sgdp_gujarati', 'GUJARATI', 'Western_India_GIH', 'alfa_sas_gih'],
    name: 'Gujarati Indian (GIH)',
    category: 'South Asia',
    geographicCenter: 'Gujarat, Western India (Kathiawar Peninsula, Gulf of Khambhat, Indus Valley Civilization perimeter: Lothal & Dholavira)',
    historicalTimeline: 'Formed at the crossroads of the Mature Indus Valley Civilization (Harappan IVC, ~2600–1900 BCE), maritime Arabian Sea trade networks, and subsequent post-Harappan migrations. Carries Ancestral North Indian (ANI, ~60–65%) and Ancestral South Indian (ASI, ~35–40%) admixture with prominent Zagros-related Neolithic farmer and Steppe Bronze Age pastoralist components.',
    migrationPath: [
      'Southern Coastal Out-of-Africa migration across Arabian Sea coastline (~60,000–50,000 years ago)',
      'Indigenous Ancient Ancestral South Indian (AASI) hunter-gatherer colonization of the subcontinent',
      'Zagros-related pastoralist & farmer expansion into Indus Valley & Gujarat (~7000–4000 BCE)',
      'Indo-Aryan Steppe MLBA pastoralist gene flow into Northern & Western India (~2000–1500 BCE)'
    ],
    evolutionaryAdaptations: [
      { trait: 'Plant-Based Polyunsaturated Fatty Acid Metabolism', gene: 'FADS1 / FADS2', rsid: 'rs174546', impact: 'Strong positive selection for FADS insertion alleles enabling efficient synthesis of omega-3 and omega-6 LCPUFAs from plant-derived precursors under strict vegetarian diets.' },
      { trait: 'Light Skin Depigmentation', gene: 'SLC24A5', rsid: 'rs1426654', impact: 'Near-fixation of the derived A111T allele introduced via West Eurasian/Zagros-related farmer gene flow.' },
      { trait: 'Lactase Persistence (Pastoralist)', gene: 'MCM6 / LCT', rsid: 'rs4988235', impact: 'Intermediate frequency of European Steppe -13910*T allele and camel-milk -13915*G variant in pastoral communities (Rabari, Bharwad).' }
    ],
    description: 'Gujarati Indian (GIH) represents Western Indo-Aryan populations of Gujarat. Exhibits high Zagros-related farmer ancestry from the Indus Valley Civilization substrate, coupled with substantial Steppe pastoralist ancestry (ANI) and indigenous South Asian hunter-gatherer (AASI) roots. Culturally distinguished by extensive historical maritime trade across the Indian Ocean.',
    keyMarkers: ['rs174546-C', 'rs1426654-A', 'rs4988235-T', 'Y-DNA J2a-M410', 'Y-DNA R1a-Z93', 'Y-DNA L-M20'],
    haplogroupNotes: 'Y-DNA: High frequencies of J2a-M410, R1a-Z93, L-M20, and H-M69; mtDNA: M-clades (M3, M4, M5), U7, U2, W.',
    empiricalSource: { dataset: '1000 Genomes High-Coverage 30x', accession: 'IGSR Phase 3 / PRJEB31736', sampleSize: 103, admixtureBreakdown: '62% ANI (38% Indus/Zagros + 24% Steppe MLBA), 38% ASI (AASI)' }
  },
  {
    code: 'PJL',
    aliases: ['sgdp_punjabi', 'PUNJABI', 'Indus_Basin_PJL', 'hgdp_punjabi'],
    name: 'Punjabi (PJL)',
    category: 'South Asia',
    geographicCenter: 'Punjab Region, Indus River & Five Tributaries (Lahore, Rawalpindi, Amritsar, Doaba, Potohar)',
    historicalTimeline: 'Epitomizes the primary northwestern gateway and heartland of Vedic civilization, the Harappan Indus Valley Civilization (Harappa core site), and Indo-Aryan Steppe expansions (~1900–1200 BCE). Features among the highest Steppe MLBA pastoralist (~25–35%) and Indus/Zagros farmer (~45–55%) ancestry proportions in South Asia.',
    migrationPath: [
      'Early Eurasian Out-of-Africa migration across southern Asian arc (~60,000 years ago)',
      'Indus Valley Neolithic & Bronze Age agricultural civilization (~7000–1900 BCE)',
      'Bronze Age Central Asian Steppe pastoralist expansion (Indo-Iranian / Sintashta-Andronovo, ~1900–1200 BCE)',
      'Post-Iron Age historical influxes from Greco-Bactrian, Saka (Scythian), Kushan, and Turkic-Iranian empires'
    ],
    evolutionaryAdaptations: [
      { trait: 'Lactase Persistence (Dairy Diet)', gene: 'MCM6 / LCT', rsid: 'rs4988235', impact: 'High frequency (~25-35%) of European-derived -13910*T allele driven by thousands of years of intensive cattle pastoralism and dairy consumption.' },
      { trait: 'Depigmentation', gene: 'SLC24A5', rsid: 'rs1426654', impact: 'Fixation (>95%) of the light pigmentation A111T allele.' },
      { trait: 'Metabolic Adaptation', gene: 'TCF7L2', rsid: 'rs7903146', impact: 'Genetic risk locus under complex metabolic selection reflecting ancestral boom-and-bust famine cycles.' }
    ],
    description: 'Punjabi in Lahore (PJL) represents the northwestern Indo-Aryan population of the fertile Indus river system. Autosomal structure is characterized by elevated Ancestral North Indian (ANI) ancestry, with robust Steppe pastoralist (R1a-Z93) and Neolithic Iranian/BMAC components, reflecting millennia as South Asia’s primary cultural and genetic transit corridor.',
    keyMarkers: ['rs4988235-T', 'rs1426654-A', 'Y-DNA R1a-Z93', 'Y-DNA J2-M172', 'Y-DNA L1a-M27'],
    haplogroupNotes: 'Y-DNA: Dominant R1a-Z93 (R1a1a), J2a-M410, L-M20, R2a-M124; mtDNA: U7, W, R0, M30, HV.',
    empiricalSource: { dataset: '1000 Genomes High-Coverage 30x', accession: 'IGSR Phase 3 / PRJEB31736', sampleSize: 96, admixtureBreakdown: '72% ANI (42% Indus/Zagros + 30% Steppe MLBA), 28% ASI (AASI)' }
  },
  {
    code: 'BEB',
    aliases: ['sgdp_bengali', 'BENGALI', 'Bengal_Delta_BEB'],
    name: 'Bengali (BEB)',
    category: 'South Asia',
    geographicCenter: 'Bengal Delta, Lower Ganges-Brahmaputra Basin (Bangladesh & West Bengal, Sundarbans)',
    historicalTimeline: 'Formed through the synthesis of Gangetic Indo-Aryan agrarian migrations with indigenous Austroasiatic (Munda-related) and Tibeto-Burman populations (~300 BCE–1200 CE). Unique among major South Asian cohorts for exhibiting significant East Asian/Southeast Asian admixture (~12–18%) alongside core South Asian ANI/ASI ancestry.',
    migrationPath: [
      'Indigenous South Asian hunter-gatherer lineage (AASI) colonization of eastern subcontinent',
      'Austroasiatic (Munda) rice agriculturalist migration from Southeast Asia (~2500–1500 BCE)',
      'Indo-Aryan Gangetic expansion eastward along the Ganges basin (~500 BCE–500 CE)',
      'Tibeto-Burman gene flow across Himalayan and Arakan mountain corridors'
    ],
    evolutionaryAdaptations: [
      { trait: 'Arsenic Metabolism Adaptation', gene: 'AS3MT', rsid: 'rs750373', impact: 'Strong positive selection for protective arsenic-methylating haplotypes in the Bengal Delta, adapted to geogenic arsenic in groundwater aquifers.' },
      { trait: 'Malaria Resistance (Thalassemia)', gene: 'HBB', rsid: 'rs334', impact: 'High endemic carriage of beta-thalassemia and HbE mutations conferring protection against Plasmodium falciparum malaria in deltaic wetlands.' },
      { trait: 'Vegetarian/Fish Polyunsaturated Fatty Acid Processing', gene: 'FADS1 / FADS2', rsid: 'rs174546', impact: 'Allelic balance adapted to riverine and floodplain subsistence.' }
    ],
    description: 'Bengali in Bangladesh (BEB) represents the easternmost Indo-Aryan population of South Asia in the massive Ganges-Brahmaputra delta. Distinguishable by ~15% East/Southeast Asian admixture derived from Austroasiatic and Tibeto-Burman contacts, unique environmental adaptations to deltaic arsenic, and balanced ANI/ASI ancestry.',
    keyMarkers: ['rs750373-G', 'rs1426654-A', 'Y-DNA R1a-Z93', 'Y-DNA O2-M122', 'Y-DNA H1a-M82'],
    haplogroupNotes: 'Y-DNA: Diverse blend of R1a-Z93, H-M69, O2a-M95 (Austroasiatic), O-M122 (East Asian), and J2a; mtDNA: M-subclades (M31, M35, M49), U2, R7.',
    empiricalSource: { dataset: '1000 Genomes High-Coverage 30x', accession: 'IGSR Phase 3 / PRJEB31736', sampleSize: 86, admixtureBreakdown: '52% ANI/ASI South Asian, 33% AASI, 15% Austroasiatic/East Asian' }
  },
  {
    code: 'ITU',
    aliases: ['TELUGU', 'Deccan_Dravidian_ITU', 'sgdp_kapu', 'sgdp_madiga', 'sgdp_mala', 'sgdp_relli', 'sgdp_yadava'],
    name: 'Indian Telugu (ITU)',
    category: 'South Asia',
    geographicCenter: 'Deccan Plateau, Andhra Pradesh & Telangana (Godavari and Krishna River Basins)',
    historicalTimeline: 'Ancient Dravidian-speaking lineage of the Deccan Plateau shaped by the expansion of megalithic culture, early iron working (~1200 BCE), and historic dynasties (Satavahana, Kakatiya). Carries a canonical South Asian baseline with balanced Ancestral South Indian (ASI, ~50–60%) and Ancestral North Indian (ANI, ~40–50%) proportions.',
    migrationPath: [
      'Pleistocene Southern Coastal migration and deep AASI hunter-gatherer presence in the Deccan',
      'Neolithic-Chalcolithic agricultural settlements in Krishna-Tungabhadra basins',
      'Deccan Dravidian megalithic expansion (~1200–300 BCE)',
      'Moderate northern ANI gene flow along historical trans-peninsular trade routes'
    ],
    evolutionaryAdaptations: [
      { trait: 'Skin Pigmentation Regulation', gene: 'SLC24A5', rsid: 'rs1426654', impact: 'Intermediate allele frequencies balancing photoprotection against intense tropical Deccan UV radiation with northern West Eurasian alleles.' },
      { trait: 'G6PD Deficiency (Malaria Defense)', gene: 'G6PD', rsid: 'rs1050828', impact: 'G6PD Mediterranean and Mahidol variants under natural selection against endemic vivax and falciparum malaria.' },
      { trait: 'Lipid & Glucose Homeostasis', gene: 'FADS1', rsid: 'rs174546', impact: 'High frequency of derived vegetarian haplotype accommodating pulse- and millet-dominated traditional diets.' }
    ],
    description: 'Indian Telugu (ITU) represents the central Dravidian linguistic core of the Deccan Plateau. Serves as a vital reference for mainland peninsular South Asia, balancing substantial indigenous South Asian (AASI) hunter-gatherer heritage with Indus Valley-related agricultural ancestry.',
    keyMarkers: ['rs1426654-A', 'rs174546-C', 'Y-DNA H1a-M82', 'Y-DNA L1a-M27', 'Y-DNA R1a-Z93'],
    haplogroupNotes: 'Y-DNA: Highly enriched in indigenous South Asian H-M69 (H1a-M82) and L-M20 (L1a), alongside R1a-Z93 and J2; mtDNA: M-lineages (M3, M5, M30, M33) >70%, U2, R6.',
    empiricalSource: { dataset: '1000 Genomes High-Coverage 30x', accession: 'IGSR Phase 3 / PRJEB31736', sampleSize: 102, admixtureBreakdown: '45% ANI (28% Indus + 17% Steppe), 55% ASI (AASI)' }
  },
  {
    code: 'STU',
    aliases: ['TAMIL', 'Sri_Lankan_Tamil_STU', 'Insular_Dravidian'],
    name: 'Sri Lankan Tamil (STU)',
    category: 'South Asia',
    geographicCenter: 'Northern & Eastern Sri Lanka (Jaffna Peninsula, Vanni, Batticaloa) & Coromandel Coast of Tamil Nadu',
    historicalTimeline: 'Ancient Southern Dravidian insular population connected across the Palk Strait to Tamilakam maritime culture. Preserves one of the highest proportions of Ancestral South Indian (ASI, ~65–75%) and indigenous Ancient Ancestral South Indian (AASI) hunter-gatherer ancestry among 1000 Genomes cohorts.',
    migrationPath: [
      'Pleistocene coastal foraging across former land bridges linking Tamil Nadu and Sri Lanka',
      'Microlithic hunter-gatherer cultures (Balangoda and South Indian Mesolithic)',
      'Iron Age Dravidian Megalithic culture expansion across Palk Strait (~1000–300 BCE)',
      'Maritime commercial interactions with Southeast Asia, Rome, and the Indian Ocean rim'
    ],
    evolutionaryAdaptations: [
      { trait: 'High UV Melanin Photoprotection', gene: 'SLC24A5 / TYR', rsid: 'rs1426654', impact: 'Retention of ancestral melanin-protective alleles under high UV tropical insular solar radiation.' },
      { trait: 'Hemoglobinopathy (Malaria Selection)', gene: 'HBB', rsid: 'rs334', impact: 'Hemoglobin E and beta-thalassemia protective selection in tropical lowland and lagoon environments.' },
      { trait: 'Arsenic/Heavy Metal Cleansing', gene: 'AS3MT', rsid: 'rs750373', impact: 'Aquifer and tropical soil mineral clearance adaptations.' }
    ],
    description: 'Sri Lankan Tamil (STU) represents southern Dravidian populations of northern Sri Lanka and adjacent coastal Tamil Nadu. Characterized by elevated Ancestral South Indian (ASI) and AASI hunter-gatherer heritage, minimal Steppe pastoralist admixture, and enduring genetic links to the earliest South Asian paleolithic settlers.',
    keyMarkers: ['rs1426654-G', 'rs174546-C', 'Y-DNA H1a-M82', 'Y-DNA L1a-M27', 'mtDNA M'],
    haplogroupNotes: 'Y-DNA: Heavily dominated by indigenous Indian H-M69 (H1a), L-M20, and C1b-M356; mtDNA: Overwhelmingly macro-haplogroup M (M3, M4, M5, M38), U2, R30.',
    empiricalSource: { dataset: '1000 Genomes High-Coverage 30x', accession: 'IGSR Phase 3 / PRJEB31736', sampleSize: 102, admixtureBreakdown: '32% ANI (22% Indus + 10% Steppe), 68% ASI (AASI)' }
  },
  {
    code: 'sgdp_kalash',
    aliases: ['hgdp_kalash', 'KALASH', 'Chitral_Kalash', 'Hindu_Kush_Isolate'],
    name: 'Kalash of Chitral (Hindu Kush)',
    category: 'South Asia',
    geographicCenter: 'Chitral District, Khyber Pakhtunkhwa, Pakistan (Bumburet, Rumbur, Birir valleys in the Hindu Kush)',
    historicalTimeline: 'The most genetically isolated population in South Asia. Linguistic and cultural isolate practicing ancient Indo-Aryan polytheistic traditions. Population genetics demonstrates extreme isolation and genetic drift with zero external gene flow over the past ~2,000–3,000 years, preserving an unadmixed ancient West Eurasian/Indo-Iranian branch.',
    migrationPath: [
      'Bronze Age Indo-Iranian pastoralist migrations through the Pamir-Karakoram and Hindu Kush valleys (~2000–1500 BCE)',
      'Geographic confinement within deep glacial mountain valleys of Chitral',
      'Extreme endogamy and genetic isolation preventing post-Iron Age gene flow from external Islamic, Hellenistic, or Turkic sources'
    ],
    evolutionaryAdaptations: [
      { trait: 'High-Altitude Hypoxia Resilience', gene: 'EPAS1 / EGLN1', impact: 'Physiological adaptations to high-altitude mountain life in the steep Hindu Kush gorges (2,000–4,000m).' },
      { trait: 'Depigmentation', gene: 'SLC24A5 / HERC2', rsid: 'rs1426654', impact: 'High rates of light pigmentation, blue/green eyes, and light hair resulting from West Eurasian Steppe legacy and localized genetic drift.' }
    ],
    description: 'The Kalash are an extraordinary paleogenomic isolate inhabiting the remote Hindu Kush valleys of Chitral, Pakistan. Celebrated in population genetics as an outgroup that split from general Eurasian populations thousands of years ago, maintaining extreme homozygosity, high endogamy, and preserving ancient Indo-European cultural and linguistic rites.',
    keyMarkers: ['rs1426654-A', 'rs12913832-G', 'Y-DNA L3a-PK3', 'Y-DNA R1a-Z93', 'Y-DNA G2a-P15'],
    haplogroupNotes: 'Y-DNA: Unique Kalash-specific clade L1c-PK3 (L3a), R1a-Z93, G2a-P15, J2; mtDNA: Ancient pre-HV, U4, U2e, H.',
    empiricalSource: { dataset: 'Simons Genome Diversity Project & HGDP', accession: 'SGDP Mallick et al. 2016 / HGDP-CEPH', sampleSize: 25, admixtureBreakdown: 'Deep isolate: ~65% West Eurasian Steppe/Zagros isolate + 35% ancient local substrate, drift-shifted' }
  },
  {
    code: 'sgdp_paniya',
    aliases: ['sgdp_irula', 'PANIYA', 'IRULA', 'Western_Ghats_AASI', 'AASI_Reference_Proxy'],
    name: 'Paniya & Irula (Western Ghats - AASI Proxy)',
    category: 'South Asia',
    geographicCenter: 'Wayanad, Nilgiri Hills & Western Ghats (Kerala & Tamil Nadu border rainforests)',
    historicalTimeline: 'Regarded in human population genetics (Narasimhan et al. Science 2019, Reich et al. 2009) as the cleanest modern proxy for Ancient Ancestral South Indian (AASI) ancestry (~70–75% AASI). Forest-dwelling hunter-gatherer tribal community that retained deep endogamy with minimal West Eurasian or Steppe pastoralist admixture.',
    migrationPath: [
      'Primary Out-of-Africa Pleistocene coastal migration into the Indian subcontinent (~60,000–50,000 years ago)',
      'Deep Paleolithic indigenous hunter-gatherer adaptation to Western Ghats rainforest biodiversity',
      'Persistence in forested highland refugia avoiding agrarian assimilation by Neolithic and Bronze Age expansions'
    ],
    evolutionaryAdaptations: [
      { trait: 'Dense Melanin Photoprotection', gene: 'SLC24A5 (Ancestral)', rsid: 'rs1426654', impact: 'Near-100% preservation of ancestral G allele maintaining high eumelanin density for maximum UV protection under dense tropical canopy.' },
      { trait: 'Tropical Parasite & Pathogen Clearance', gene: 'HLA-A / HLA-B', impact: 'Specialized MHC class I and II allele repertoires optimized for endemic tropical jungle arboviruses and parasites.' },
      { trait: 'Arboreal & Forest Locomotor Biometrics', gene: 'ACTN3', rsid: 'rs1815739', impact: 'Musculoskeletal adaptations to endurance foraging in rugged montane rainforest terrain.' }
    ],
    description: 'The Paniya and Irula of the Nilgiri Hills and Western Ghats represent the primary scientific benchmark for Ancient Ancestral South Indian (AASI) paleogenomics. Possessing over 70% indigenous South Asian hunter-gatherer ancestry, they provide the essential baseline for modeling the population architecture of all South Asians.',
    keyMarkers: ['rs1426654-G', 'Y-DNA H1a-M82', 'Y-DNA C1b-M356', 'mtDNA M2', 'mtDNA M3'],
    haplogroupNotes: 'Y-DNA: Overwhelmingly indigenous South Asian H1a-M82 (H-M69) and C1b-M356; mtDNA: Almost exclusively basal South Asian macro-haplogroup M (M2, M3, M6, M33).',
    empiricalSource: { dataset: 'Simons Genome Diversity Project', accession: 'SGDP Mallick et al. Nature 2016', sampleSize: 14, admixtureBreakdown: '74% AASI (Indigenous South Asian Hunter-Gatherer), 26% Indus/Zagros farmer' }
  },
  {
    code: 'sgdp_pathan',
    aliases: ['hgdp_pathan', 'PATHAN', 'PASHTUN', 'Northwest_Frontier_Pathan'],
    name: 'Pashtun / Pathan (Northwest Frontier)',
    category: 'South Asia',
    geographicCenter: 'Khyber Pakhtunkhwa & FATA (Peshawar, Khyber Pass, Hindu Kush foothills, Swat Valley)',
    historicalTimeline: 'Eastern Iranian-speaking population inhabiting the historic gateway between Central Asia and the Indian subcontinent. Deeply shaped by Bronze Age Steppe MLBA pastoralist migrations (Andronovo/Sintashta), the Bactria-Margiana Archaeological Complex (BMAC), and historical Silk Road empires (Gandhara, Kushan).',
    migrationPath: [
      'Out-of-Africa migration through Iranian plateau into Central/South Asia',
      'BMAC (Bactria-Margiana) agricultural interactions (~2200–1700 BCE)',
      'Indo-Iranian pastoralist migrations across Hindu Kush passes (~1800–1200 BCE)',
      'Formation of Eastern Iranian ethnolinguistic lineages across the historic Durand Line'
    ],
    evolutionaryAdaptations: [
      { trait: 'Lactase Persistence', gene: 'MCM6 / LCT', rsid: 'rs4988235', impact: 'Moderate-to-high carriage of -13910*T and Middle Eastern -13915*G lactase persistence alleles suited to pastoral nomadism.' },
      { trait: 'Depigmentation', gene: 'SLC24A5 / SLC45A2', rsid: 'rs1426654', impact: 'High frequency of derived West Eurasian depigmentation alleles.' },
      { trait: 'Cold & Montane Adaptation', gene: 'TRPM8', impact: 'Adaptive thermoregulatory variants for severe winter temperatures in rugged highland terrain.' }
    ],
    description: 'Pashtuns (Pathan) inhabit the rugged frontier between South and Central Asia. Genetically characterized by prominent West Eurasian Steppe pastoralist ancestry (~30–35%), Neolithic Iranian/BMAC components, and moderate South Asian substrate, reflecting their status as guardians of the historic Khyber Pass.',
    keyMarkers: ['rs1426654-A', 'rs4988235-T', 'Y-DNA R1a-Z93', 'Y-DNA G2a-P15', 'Y-DNA Q1b-M346'],
    haplogroupNotes: 'Y-DNA: Dominated by R1a-Z93 (R1a-M198), G2a, Q-M242, and J2a; mtDNA: West Eurasian U7, W, HV, H, alongside indigenous M clades.',
    empiricalSource: { dataset: 'Simons Genome Diversity Project & HGDP', accession: 'SGDP Mallick et al. 2016 / HGDP-CEPH', sampleSize: 26, admixtureBreakdown: '82% West Eurasian/Central Asian (35% Steppe MLBA + 47% Iran/BMAC), 18% AASI/ASI' }
  },
  {
    code: 'sgdp_brahmin',
    aliases: ['BRAHMIN', 'Gangetic_Brahmin', 'Indo_Aryan_Priestly_Lineage'],
    name: 'North Indian Brahmin (Gangetic Plain)',
    category: 'South Asia',
    geographicCenter: 'Northern India, Gangetic Plain (Uttar Pradesh, Bihar, Uttarakhand, Haryana)',
    historicalTimeline: 'Priestly and scholastic lineage of northern Indo-Aryan society whose genetic profile was extensively analyzed in Reich et al. Nature 2009 and Narasimhan et al. Science 2019. Demonstrates the highest proportion of Central Asian Bronze Age Steppe pastoralist ancestry (Steppe MLBA, ~30–40%) and Y-DNA R1a-Z93 (subclade R1a-L657) among northern South Asians.',
    migrationPath: [
      'Out-of-Africa expansion into northern Eurasian Steppe corridor',
      'Sintashta-Andronovo Bronze Age pastoralist expansion (~2000–1600 BCE)',
      'Indo-Aryan migration into the Saptasindhu and upper Gangetic plain (~1500–1000 BCE)',
      'Rigvedic cultural codification and strict jati/varna endogamy establishing sharp genetic boundaries'
    ],
    evolutionaryAdaptations: [
      { trait: 'Lactase Persistence (Dairy Diet)', gene: 'MCM6 / LCT', rsid: 'rs4988235', impact: 'Enriched for lactase persistence mutations linked to dairy-rich ritual and dietary practices (ghee, milk, curd).' },
      { trait: 'Plant-Based Lipid Desaturation', gene: 'FADS1', rsid: 'rs174546', impact: 'Fixation of vegetarian-adapted FADS1 haplotype for omega-3 synthesis.' },
      { trait: 'Light Pigmentation', gene: 'SLC24A5', rsid: 'rs1426654', impact: 'Fixation (>95%) of derived light skin allele.' }
    ],
    description: 'North Indian Brahmins exhibit the highest Steppe pastoralist genetic component (Ancestral North Indian / ANI) in mainland India, coupled with strong strict endogamy instituted during the Vedic period. Features prominent R1a-L657 patrilineages and classic Indo-European cultural and linguistic transmission.',
    keyMarkers: ['rs4988235-T', 'rs1426654-A', 'rs174546-C', 'Y-DNA R1a-L657', 'Y-DNA J2a'],
    haplogroupNotes: 'Y-DNA: Extremely enriched in R1a-Z93 (specifically Indo-Aryan branch R1a-L657 >60%), J2a-M410, R2; mtDNA: U7, W, M3, M30, R8.',
    empiricalSource: { dataset: 'Simons Genome Diversity Project & Reich Lab', accession: 'SGDP Mallick et al. 2016 / Narasimhan et al. 2019', sampleSize: 22, admixtureBreakdown: '78% ANI (36% Steppe MLBA + 42% Indus/Zagros), 22% ASI (AASI)' }
  },
  {
    code: 'sgdp_brahui',
    aliases: ['sgdp_balochi', 'hgdp_brahui', 'hgdp_balochi', 'BRAHUI', 'BALOCHI', 'Balochistan_Plateau'],
    name: 'Brahui & Balochi (Balochistan Plateau)',
    category: 'South Asia',
    geographicCenter: 'Balochistan Plateau (Quetta, Kalat, Makran Coast, Chagai Hills, Pakistan & Southeastern Iran)',
    historicalTimeline: 'The Brahui speak a Dravidian language in the midst of Iranian and Indo-Aryan tongues, representing either an archaic relic of the pre-Indo-Aryan Indus/Zagros farmer network or an early medieval migration. Genetically, both Brahui and Balochi harbor the highest proportion of Zagros Neolithic-related Iranian farmer ancestry (~60–70%) of any population in South Asia, coupled with low Steppe and moderate AASI admixture.',
    migrationPath: [
      'Pleistocene expansion across Zagros mountain corridor into Balochistan',
      'Early Neolithic pastoralist colonization of Mehrgarh (~7000–5500 BCE)',
      'Development of Indus-Balochistan agricultural communities (Kulli and Mehrgarh cultures)',
      'Centuries of arid highland pastoralism and tribal endogamy maintaining ancestral Zagros-related genetic core'
    ],
    evolutionaryAdaptations: [
      { trait: 'Arid Desert & Heat Endurance', gene: 'AGTR1 / ACE', impact: 'Renin-angiotensin system variations optimized for fluid retention and heat tolerance in hyper-arid desert basins.' },
      { trait: 'Lactase Persistence', gene: 'MCM6 / LCT', rsid: 'rs145946845', impact: 'Presence of both -13910*T and Afro-Asiatic/Arabian -13915*G lactase mutations reflecting sheep, goat, and camel herding.' },
      { trait: 'Depigmentation', gene: 'SLC24A5', rsid: 'rs1426654', impact: 'Near-fixation of the derived West Eurasian A111T allele.' }
    ],
    description: 'Brahui and Balochi of the arid Balochistan plateau are critical for understanding the peopling of South Asia. They harbor the closest modern autosomal affinity to the Neolithic farmers of Iran and the ancient inhabitants of Mehrgarh, representing the dominant ancestral component of the Indus Valley Civilization.',
    keyMarkers: ['rs1426654-A', 'rs145946845-G', 'Y-DNA J2a-M410', 'Y-DNA L1a-M27', 'Y-DNA R1a-Z93'],
    haplogroupNotes: 'Y-DNA: J2a-M410, L1a-M27, R1a-Z93, G2a; mtDNA: U7, W, HV, J1, M30.',
    empiricalSource: { dataset: 'Simons Genome Diversity Project & HGDP', accession: 'SGDP Mallick et al. 2016 / HGDP-CEPH', sampleSize: 45, admixtureBreakdown: '66% Zagros Neolithic Iranian farmer, 18% Steppe MLBA, 16% AASI' }
  },
  {
    code: 'sgdp_burusho',
    aliases: ['hgdp_burusho', 'BURUSHO', 'Hunza_Isolate', 'Karakoram_Burushaski'],
    name: 'Burusho of Hunza (Karakoram)',
    category: 'South Asia',
    geographicCenter: 'Hunza, Nagar, and Yasin Valleys, Gilgit-Baltistan, Pakistan (Karakoram Mountain Range)',
    historicalTimeline: 'Famed linguistic isolate speaking Burushaski, a language unrelated to Indo-European, Sino-Tibetan, or Dravidian families. Situated in high Karakoram glacial valleys beneath Rakaposhi and Ultar peaks. Demonstrates unique paleogenomic structure with elevated ancient northern Eurasian and Central Asian affinity, preserved through rigorous geographic isolation and terraced alpine agriculture.',
    migrationPath: [
      'Upper Paleolithic colonization of the inner Karakoram mountain valleys',
      'Persistence of an unclassified pre-Indo-European linguistic substrate in northern Pakistan',
      'Contact with ancient Silk Road mountain bypass routes connecting Gandhara with the Tarim Basin'
    ],
    evolutionaryAdaptations: [
      { trait: 'High-Altitude Hypoxia Resistance', gene: 'EPAS1 / EGLN1', impact: 'Cardiovascular and hematocrit regulation for permanent habitation at elevations exceeding 2,500 meters.' },
      { trait: 'Cold Climate Metabolism', gene: 'UCP1 / PPARGC1A', impact: 'Brown adipose tissue thermogenesis adaptations for sub-zero alpine Karakoram winters.' },
      { trait: 'Longevity & Oxidative Stress Defense', gene: 'FOXO3', rsid: 'rs2802292', impact: 'Genetic variants promoting cellular autophagy and cardiovascular longevity in traditional alpine agriculturalists.' }
    ],
    description: 'The Burusho of the Hunza Valley speak the extraordinary Burushaski language isolate in the Karakoram mountains. Renowned for longevity and mountain endurance, their autosomal profile reflects a preserved pre-Indo-European substrate with balanced West and Central Asian paleogenomic roots.',
    keyMarkers: ['rs1426654-A', 'rs2802292-G', 'Y-DNA R2a-M124', 'Y-DNA R1a-Z93', 'Y-DNA C2-M217'],
    haplogroupNotes: 'Y-DNA: High frequency of R2a-M124, R1a-Z93, J2, and C2-M217; mtDNA: U7, W, HV, A, D4 (showing minor Central/East Asian mountain contact).',
    empiricalSource: { dataset: 'Simons Genome Diversity Project & HGDP', accession: 'SGDP Mallick et al. 2016 / HGDP-CEPH', sampleSize: 24, admixtureBreakdown: '60% West Eurasian (Zagros + Steppe), 25% Ancient North Eurasian / Central Asian, 15% AASI' }
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
