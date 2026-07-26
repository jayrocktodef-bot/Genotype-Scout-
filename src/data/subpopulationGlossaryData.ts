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
    haplogroupNotes: 'Predominantly Y-DNA R1b-M269 and R1a-M417; mtDNA H, U5, T, J, K.'
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
    code: 'BASQUE',
    aliases: ['sgdp_basque'],
    name: 'Basque / Southwestern European (BASQUE)',
    category: 'Europe',
    geographicCenter: 'Western Pyrenees (Franco-Cantabrian Region, Spain/France)',
    historicalTimeline: 'Genetic isolate retaining high Early European Farmer (EEF) and Western Hunter-Gatherer (WHG) ancestry with minimal imperial Roman or North African admixture, preserving the non-Indo-European Euskara language.',
    migrationPath: [
      'Paleolithic Franco-Cantabrian cave refuge during Last Glacial Maximum (~20,000 BP)',
      'Neolithic Cardial and Iberian agricultural expansion (~7,000 BP)',
      'Bronze Age Bell Beaker introgressions followed by long-term geographic & linguistic isolation in Pyrenean valleys'
    ],
    evolutionaryAdaptations: [
      { trait: 'Rh-Negative Blood Group Enrichment', gene: 'RHD', impact: 'World-highest frequency (~30-35%) of Rh-negative blood type alleles.' },
      { trait: 'Lipid Regulation', gene: 'APOE / LCT', impact: 'Distinctive lipid metabolism frequencies adapted to montane pastoralism.' }
    ],
    description: 'Basque populations represent an ancient genetic isolate of Southwestern Europe. While carrying Bronze Age Steppe Y-DNA (R1b-P312), Basque autosomal profiles preserve an unadmixed pre-Roman Iberian genetic baseline.',
    keyMarkers: ['RHD negative', 'rs1426654-A', 'Y-DNA R1b-DF27'],
    haplogroupNotes: 'Y-DNA R1b-DF27 (>85%); mtDNA H1, H3, V, U5.'
  },
  {
    code: 'SCANDINAVIAN',
    aliases: ['SWEDISH', 'sgdp_norwegian', 'sgdp_icelandic'],
    name: 'Scandinavian / Northern European (SCANDINAVIAN)',
    category: 'Europe',
    geographicCenter: 'Sweden, Norway, Denmark, Iceland',
    historicalTimeline: 'North European maritime lineage formed by Scandinavian Hunter-Gatherers (SHG, WHG+EHG blend), Battle-Axe Steppe herders (~2800 BCE), and Iron Age Viking expansions.',
    migrationPath: [
      'Post-glacial colonization of Scandinavian peninsula from south and northeast (~11,000 BP)',
      'Neolithic Pitted Ware & Funnelbeaker farming coastal interactions (~6,000 BP)',
      'Battle-Axe Corded Ware Steppe migration (~4,800 BP)',
      'Viking Age maritime navigation and insular settlements across Atlantic (800–1050 CE)'
    ],
    evolutionaryAdaptations: [
      { trait: 'Highest Lactase Persistence', gene: 'MCM6', rsid: 'rs4988235', impact: 'Near complete fixation (~90-95%) driven by dairy cattle farming.' },
      { trait: 'Blonde Hair & Blue Eyes', gene: 'HERC2 / KITLG / SLC45A2', impact: 'Fixation of depigmentation alleles in northern maritime light environments.' }
    ],
    description: 'Scandinavian populations combine Scandinavian Hunter-Gatherer (SHG) heritage with high Steppe herder and Germanic Iron Age components, exhibiting the highest lactase persistence in Europe.',
    keyMarkers: ['rs4988235-T', 'Y-DNA I1-M253', 'R1b-U106', 'R1a-Z284'],
    haplogroupNotes: 'Y-DNA I1-M253 (~35-40%), R1a-Z284 (~20-25%), R1b (~25%); mtDNA H1, H3, U5a, K.'
  },
  {
    code: 'BALKAN',
    aliases: ['GREEK', 'sgdp_albanian', 'sgdp_bulgarian', 'sgdp_greek'],
    name: 'Balkan / Southeastern European (BALKAN / GREEK)',
    category: 'Europe',
    geographicCenter: 'Balkan Peninsula, Greece, Albania, Bulgaria, Aegean Islands',
    historicalTimeline: 'Southeastern European crossroads lineage blending European Mesolithic hunter-gatherers, Neolithic Aegean farmers, Bronze Age Mycenaean/Minoan Greeks, and Medieval Slavic expansions.',
    migrationPath: [
      'Neolithic Aegean farmer expansion into Balkans (~8,500 BP)',
      'Bronze Age Helladic and Mycenaean Greek civilization development (~4,000 BP)',
      'Slavic migrations into the Balkan peninsula during 6th–7th Century CE'
    ],
    evolutionaryAdaptations: [
      { trait: 'G6PD Deficiency & Thalassemia Resistance', gene: 'G6PD / HBB', impact: 'Malaria protective balancing selection in Mediterranean coastal plains.' }
    ],
    description: 'Balkan and Greek populations bridge Southern Europe with Anatolia and the Near East, combining ancient Aegean Neolithic and Classical Greek ancestry with Slavic intake.',
    keyMarkers: ['Y-DNA E-V13', 'J2a-M410', 'R1b-L23'],
    haplogroupNotes: 'Y-DNA E-V13 (~25-35%), J2a, R1a, I2a-CTS10228; mtDNA H, J, T2, HV.'
  },

  // ==========================================
  // MEDITERRANEAN & SOUTHERN EUROPE
  // ==========================================
  {
    code: 'TSI',
    aliases: ['sgdp_bergamo', 'sgdp_cretan'],
    name: 'Central Mediterranean / Tuscan (TSI)',
    category: 'Europe',
    geographicCenter: 'Tuscany, Central & Southern Italy',
    historicalTimeline: 'Central Mediterranean population formed by Neolithic Anatolian Farmers, Bronze Age Aegean/Levantine sea trade, Etruscan civilization, and Roman Imperial demography.',
    migrationPath: [
      'Early Neolithic Maritime Impressed Cardial Ware farmer expansion (~8,000 BP)',
      'Bronze Age Aegean and Peloponnesian maritime migrations (~4,000 BP)',
      'Etruscan Iron Age urbanization and Roman Imperial urban cosmopolitan influx'
    ],
    evolutionaryAdaptations: [
      { trait: 'Thalassemia / Malaria Protection', gene: 'HBB / G6PD', impact: 'Balancing selection for heterozygous hemoglobin mutations in coastal Mediterranean marshes.' },
      { trait: 'Olive Oil & PUFA Lipid Metabolism', gene: 'FADS1 / FADS2', rsid: 'rs174546', impact: 'Enhanced synthesis of long-chain polyunsaturated fatty acids on Mediterranean plant-rich diets.' }
    ],
    description: 'Tuscan (TSI) and Central/Southern Mediterranean European populations reflect high Early European Farmer (EEF) and Caucasus/Near Eastern hunter-gatherer components with lower Steppe herder proportions than Northern Europe.',
    keyMarkers: ['rs174546-C', 'rs1426654-A', 'rs12913832-A'],
    haplogroupNotes: 'Y-DNA R1b-U152, J2a, G2a, E-V13; mtDNA H, J, T2, K.'
  },
  {
    code: 'IBS',
    aliases: ['SPANISH', 'sgdp_spanish'],
    name: 'Iberian Peninsula (IBS / SPANISH)',
    category: 'Europe',
    geographicCenter: 'Spain, Portugal, Balearic Islands',
    historicalTimeline: 'Southwestern Mediterranean population combining Neolithic Cardial Farmers, Bronze Age Bell Beakers, Phoenician/Greek maritime colonies, Roman Hispania, and medieval North African Amazigh intake.',
    migrationPath: [
      'Neolithic Cardial Mediterranean farmer expansion (~7,500 BP)',
      'Bell Beaker Steppe herder migration (~4,500 BP)',
      'Roman and Germanic Suebi/Visigothic settlements',
      'Islamic Al-Andalus period North African gene flow (8th–15th Century CE)'
    ],
    evolutionaryAdaptations: [
      { trait: 'FADS Polyunsaturated Fatty Acid Adaptation', gene: 'FADS1', rsid: 'rs174546', impact: 'High-efficiency PUFA synthesis adapted to Mediterranean olive oil and fish diet.' }
    ],
    description: 'Iberian (IBS/Spanish) populations reflect Southwestern European Bell Beaker ancestry with distinct Mediterranean farmer components and ~5-10% historical North African admixture.',
    keyMarkers: ['Y-DNA R1b-DF27', 'rs174546-C', 'rs1426654-A'],
    haplogroupNotes: 'Y-DNA R1b-DF27 (~60-70%), E-M81, J2; mtDNA H1, H3, V, T2, U5b.'
  },
  {
    code: 'SARDINIAN',
    aliases: ['sgdp_sardinian'],
    name: 'Sardinian / Mediterranean (SARDINIAN)',
    category: 'Europe',
    geographicCenter: 'Sardinia (Western Mediterranean Island)',
    historicalTimeline: 'Island genetic isolate preserving the highest proportion of Early European Farmer (EEF / Anatolian Neolithic) genome in Europe, with Nuragic Bronze Age continuity.',
    migrationPath: [
      'Early Neolithic Cardial Ware maritime farmer settlement (~8,000 BP)',
      'Nuragic megalithic bronze-age culture development (~3,800 BP)',
      'Relative genetic isolation from post-Bronze Age continental migrations'
    ],
    evolutionaryAdaptations: [
      { trait: 'Beta-Thalassemia & G6PD Def.', gene: 'HBB / G6PD', impact: 'High frequency of malaria-protective alleles due to historical endemic falciparum malaria in lowland plains.' },
      { trait: 'Longevity & Low Autoimmunity Variants', gene: 'FOXO3 / FOXO1', impact: 'Enriched centenarian genetic clusters in inland Ogliastra highlands.' }
    ],
    description: 'Sardiniana is a primary genetic reference for Early European Farmer (EEF) ancestry. Having escaped major Bronze Age Steppe herder replacements, Sardinians are the closest modern relatives of Iceman Ötzi.',
    keyMarkers: ['Y-DNA I2a1a1-M26', 'G2a2b', 'rs1426654-A'],
    haplogroupNotes: 'Y-DNA I2a-M26 (~40%), R1b-V88, G2a, E-M81; mtDNA H1, H3, V, K.'
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
    code: 'SEJ',
    aliases: ['Sephardic'],
    name: 'Sephardic Jewish (SEJ)',
    category: 'Middle East & Jewish',
    geographicCenter: 'Iberian Peninsula (pre-1492), Ottoman Mediterranean, North Africa',
    historicalTimeline: 'Levantine Judean diaspora lineage established in Roman Hispania, flourishing during Al-Andalus, and dispersing across Ottoman Mediterranean ports (Salonica, Istanbul, North Africa) after the 1492 Alhambra Decree.',
    migrationPath: [
      'Roman Judean migration to Iberian Peninsula (~1st–4th Century CE)',
      'Cultural & genetic development in medieval Islamic and Christian Iberia',
      'Post-1492 expulsion migration to Ottoman Empire, North Africa, and Netherlands'
    ],
    evolutionaryAdaptations: [
      { trait: 'Familial Mediterranean Fever (FMF)', gene: 'MEFV', rsid: 'rs28937871 (M694V)', impact: 'High carrier frequency of MEFV mutations conferring resistance to bacterial sepsis.' }
    ],
    description: 'Sephardic Jewish (SEJ) represents the Jewish population of Iberian origin, combining Levantine ancestral stock with Mediterranean European components.',
    keyMarkers: ['MEFV M694V', 'Y-DNA J1-M267', 'J2a', 'E-M123'],
    haplogroupNotes: 'Y-DNA J1, J2a, E1b1b, T; mtDNA H, J, T2, V.'
  },
  {
    code: 'MZJ',
    aliases: ['sgdp_jew_iraqi', 'sgdp_jew_yemenite', 'YMJ', 'Mizrahi'],
    name: 'Mizrahi & Yemenite Jewish (MZJ / YMJ)',
    category: 'Middle East & Jewish',
    geographicCenter: 'Mesopotamia (Iraq, Iran), Yemen, Levant',
    historicalTimeline: 'Ancient Jewish communities residing continuous in Near East since Babylonian Captivity (586 BCE) and Ancient South Arabia (Yemenite Himyarite Kingdom).',
    migrationPath: [
      'Babylonian Exile of Judean population to Mesopotamia (6th Century BCE)',
      'Ancient trade routes establishing Jewish communities in Yemen & Persia',
      'Endogamous preservation of ancient Near Eastern gene pool for over 2,500 years'
    ],
    evolutionaryAdaptations: [
      { trait: 'G6PD Deficiency (Favism Resistance)', gene: 'G6PD', rsid: 'G6PD Mediterranean variant', impact: 'Extreme high frequency protecting against falciparum malaria in Mesopotamian and Yemenite oases.' }
    ],
    description: 'Mizrahi and Yemenite Jewish populations preserve ancient Levantine and Near Eastern genetic continuity predating European Diaspora admixture.',
    keyMarkers: ['G6PD Mediterranean', 'Y-DNA J1-P58', 'J2a'],
    haplogroupNotes: 'Y-DNA J1-P58 (>60%), J2a, E-M123; mtDNA R0a, HV1, U1a.'
  },
  {
    code: 'Druze',
    aliases: ['sgdp_druze', 'hgdp_druze', 'MID_gnomAD', 'sgdp_palestinian', 'sgdp_jordanian', 'sgdp_bedouinb', 'sgdp_samaritan', 'sgdp_iranian'],
    name: 'Levant & Near Eastern (Druze / Levantine)',
    category: 'Middle East & Jewish',
    geographicCenter: 'Mount Lebanon, Hermon, Levant, Arabian Peninsula, Iranian Plateau',
    historicalTimeline: 'Ancient Levantine genetic isolate formed during the 11th Century CE Fatimid Era under strict endogamy, preserving Bronze Age & Iron Age Near Eastern genomic structure.',
    migrationPath: [
      'Ancient Canaanite / Phoenician Levantine Bronze Age settlements (~4,000 BP)',
      'Establishment of the Druze faith in Cairo/Levant (1017 CE)',
      'Strict religious endogamy preventing outside gene flow for over 1,000 years'
    ],
    evolutionaryAdaptations: [
      { trait: 'Arid Climate Water & Salt Retention', gene: 'AGENT / AGT', impact: 'Osmoregulation adaptation to Near Eastern Mediterranean summer droughts.' }
    ],
    description: 'Druze represents one of the most unadmixed reference populations for ancient Levantine Bronze Age ancestry, serving as a genetic proxy for pre-Hellenistic Near Eastern populations.',
    keyMarkers: ['Y-DNA J2a', 'J1', 'G2a', 'L-M20'],
    haplogroupNotes: 'Y-DNA J2 (~35%), L (~15%), E-M35, G; mtDNA X2a, K, T.'
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
    code: 'GWD',
    aliases: ['GWF_Fula', 'GWJ_Jola', 'GWW_Wolof', 'MSL', 'sgdp_mandenka', 'sgdp_mende', 'sgdp_gambian'],
    name: 'Senegambian & Upper Guinea (GWD / Wolof / Mandenka / Mende)',
    category: 'Africa',
    geographicCenter: 'The Gambia, Senegal, Sierra Leone, Upper Guinea Coast',
    historicalTimeline: 'Atlantic West African populations associated with the ancient Ghana and Mali Empires, Wolof kingdoms, and Senegambian rice cultivation.',
    migrationPath: [
      'Holocene savanna & riverine foraging along Gambia and Senegal river basins',
      'Mande agricultural expansion and Mali Empire unification (~13th Century CE)',
      'Atlantic coastal trading and rice farming specialization'
    ],
    evolutionaryAdaptations: [
      { trait: 'Duffy Null Fixation', gene: 'ACKR1', rsid: 'rs2814778', impact: 'Complete protection against P. vivax malaria.' },
      { trait: 'Hemoglobin C Variant', gene: 'HBB', rsid: 'rs33930165 (HbC)', impact: 'Protective hemoglobin variant prevalent in Upper Guinea.' }
    ],
    description: 'Senegambian and West African coastal populations (Gambian GWD, Wolof, Mende MSL) represent foundational West African populations with high genetic diversity and specialized rice-farming adaptations.',
    keyMarkers: ['rs2814778-C', 'rs33930165-A', 'Y-DNA E-M2'],
    haplogroupNotes: 'Y-DNA E-M2, E-M33; mtDNA L2a, L1b, L0a.'
  },
  {
    code: 'GLL',
    aliases: ['ASW', 'ACB', 'ALFA_AfAm'],
    name: 'Gullah Geechee & African Diaspora (GLL / ASW / ACB)',
    category: 'Africa',
    geographicCenter: 'Sea Islands (SC/GA/FL), African Caribbean (Barbados), African-American SW US',
    historicalTimeline: 'African Diaspora populations preserved on coastal Sea Islands and Caribbean, descended from West African rice-cultivating populations (Sierra Leone, Windward Coast, Bight of Biafra, Central Africa).',
    migrationPath: [
      'Enslavement & transport from Windward Coast, Senegambia, Biafra, and West-Central Africa (18th Century CE)',
      'Geographic & cultural isolation on barrier Sea Islands enabling preservation of Gullah language & traditions',
      'Admixture profiles ranging from ~90-95% West African (Gullah) to ~75-80% West African with European components (ASW/ACB)'
    ],
    evolutionaryAdaptations: [
      { trait: 'Malaria Protective Alleles', gene: 'ACKR1 / HBB', rsid: 'rs2814778', impact: 'High retention of Duffy null and sickle cell alleles conferring resistance in Lowcountry rice swamps.' }
    ],
    description: 'Gullah Geechee (GLL) and African Diaspora reference groups (ASW, ACB) represent historical West and Central African lineages enriched for coastal rice-farming ancestral heritage.',
    keyMarkers: ['rs2814778-C', 'Y-DNA E-M2', 'mtDNA L2a1, L3e, L1b'],
    haplogroupNotes: 'Y-DNA E-M2 (~85%), R1b; mtDNA L2a1, L3e, L1b, L3b.'
  },
  {
    code: 'sgdp_biaka',
    aliases: ['sgdp_mbuti', 'sgdp_khomani_san', 'sgdp_ju_hoan_north', 'sgdp_bantuherero', 'lemba_proxy', 'sgdp_bantutswana'],
    name: 'Central Pygmy & Southern Khoesan (Biaka / Mbuti / ‡Khomani San)',
    category: 'Africa',
    geographicCenter: 'Congo Basin Forests, Kalahari Desert (Namibia, Botswana, South Africa)',
    historicalTimeline: 'Deepest modern human lineage divergences (L0 mtDNA & A/B Y-DNA), representing hunter-gatherer populations isolated prior to the Bantu agricultural expansion (~100,000–150,000 BP).',
    migrationPath: [
      'Deepest internal modern human divergence in Africa (>100,000 BP)',
      'Continuous hunter-gatherer foraging in Congo rainforests (Pygmies) and Kalahari desert (Khoesan)',
      'Encounter & admixture with migrating Bantu pastoralists (~2,000 BP)'
    ],
    evolutionaryAdaptations: [
      { trait: 'Pygmy Short Stature Adaptation', gene: 'GHSR / IGF1', impact: 'Natural selection on growth hormone signaling for thermoregulation and dense tropical jungle mobility.' },
      { trait: 'UV & Arid Desert Metabolism', gene: 'SLC24A5 / APOL1', impact: 'Extreme light skin/yellow skin tone adaptations in southern latitude Kalahari.' }
    ],
    description: 'Central African Pygmy (Biaka, Mbuti) and Southern African Khoesan (Ju|\'hoansi, ‡Khomani) populations represent the most ancient, deeply-diverged ancestral branches of humanity.',
    keyMarkers: ['Y-DNA A-M13', 'B-M60', 'mtDNA L0d', 'L0k'],
    haplogroupNotes: 'Y-DNA A1b, B2b; mtDNA L0d, L0k (Khoesan), L1c (Pygmy).'
  },

  // ==========================================
  // EAST AFRICAN & NILOTIC LINEAGES
  // ==========================================
  {
    code: 'LWK',
    aliases: ['sgdp_luo', 'sgdp_masai', 'sgdp_somali', 'sgdp_bantukenya', 'sgdp_luhya'],
    name: 'Luhya & East African Nilotic/Cushitic (LWK / Luo / Maasai / Somali)',
    category: 'Africa',
    geographicCenter: 'Western Kenya, Horn of Africa, Rift Valley',
    historicalTimeline: 'East African populations formed by Bantu agriculturalist expansion into Great Lakes (~1000 BCE) interacting with indigenous Nilotic cattle herders and Afroasiatic Cushitic pastoralists.',
    migrationPath: [
      'Bantu Migration out of West-Central Africa (Nigeria/Cameroon borderland, ~4,000 BP)',
      'Eastward expansion around Lake Victoria (~2,500 BP)',
      'Admixture with indigenous East African hunter-gatherers and Cushitic pastoralists'
    ],
    evolutionaryAdaptations: [
      { trait: 'Independent Lactase Persistence', gene: 'MCM6', rsid: 'rs145414006 (-14010*C)', impact: 'Convergent evolution for adult milk digestion in East African pastoralist environments.' },
      { trait: 'High-Altitude Hypoxia Tolerance', gene: 'EGLN1 / EPAS1', impact: 'Adaptive variants for Rift Valley highland altitudes.' }
    ],
    description: 'Luhya (LWK), Luo, and Maasai represent East African populations blending Bantu agriculturalist heritage with Nilotic cattle-herding and ancient Cushitic pastoralist lineages.',
    keyMarkers: ['rs145414006-C', 'rs2814778-C', 'Y-DNA E-M2', 'E-M35'],
    haplogroupNotes: 'Y-DNA E-M2 (~70%), E-M35 (~15%); mtDNA L2a, L3x, L0a, M1.'
  },
  {
    code: 'Mota',
    name: 'Mota Ancient East African (Mota)',
    category: 'Africa',
    geographicCenter: 'Mota Cave, Gamo Highlands, Ethiopia',
    historicalTimeline: 'Landmark 4,500-year-old Stone Age hunter-gatherer genome from the Ethiopian highlands, predating the Eurasian backflow into East Africa.',
    migrationPath: [
      'Ancient Horn of Africa hunter-gatherer lineage isolated in southern Ethiopian highlands (~4,500 BP)',
      'Genome represents unadmixed pre-Eurasian East African baseline prior to Neolithic Near Eastern migrations into Africa'
    ],
    evolutionaryAdaptations: [
      { trait: 'High-Altitude Adaptation', gene: 'EGLN1', impact: 'Genetic adaptations to life at 2,000+ meters in Gamo Highlands.' },
      { trait: 'Ancestral Pigmentation', gene: 'SLC24A5 / ACKR1', rsid: 'rs1426654-G', impact: 'Ancestral tropical dark skin alleles and Duffy null protection.' }
    ],
    description: 'Mota Man is the cornerstone ancient African reference genome. Living ~4,500 years ago in Ethiopia, his DNA predates the major Eurasian back-migrations that shaped modern Horn of Africa populations.',
    keyMarkers: ['Y-DNA E-M215 / E1b1b', 'mtDNA L3x2a', 'rs1426654-G'],
    haplogroupNotes: 'Y-DNA E-M215 (E-P2); mtDNA L3x2a.'
  },

  // ==========================================
  // SOUTH ASIAN / INDIAN SUBCONTINENT
  // ==========================================
  {
    code: 'BEB',
    aliases: ['SAS_gnomAD', 'ALFA_SAS', 'GIH', 'PJL', 'ITU', 'STU'],
    name: 'South Asian & Bengali Subcontinent (BEB / GIH / PJL / ITU / STU)',
    category: 'South Asia',
    geographicCenter: 'Bengal Delta, Gujarat, Punjab, South India (Tamil Nadu, Andhra Pradesh)',
    historicalTimeline: 'Tri-partite genetic mix across Subcontinent: Ancestral South Indian (ASI, Ancient AASI hunter-gatherers + Iranian Farmers) and Ancestral North Indian (ANI / Steppe herder R1a-M417 expansion, ~3800 BP).',
    migrationPath: [
      'First Wave Out-of-Africa coastal migration into South Asia (~60,000 BP)',
      'Indus Valley & Iranian Farmer migration into Subcontinent (~7,000–5,000 BP)',
      'Bronze Age Yamnaya Steppe herder expansion carrying Indo-Aryan languages (~3,800 BP)',
      'East Asian Tibeto-Burman & Austroasiatic gene flow down Brahmaputra Valley in eastern regions'
    ],
    evolutionaryAdaptations: [
      { trait: 'Arsenic Metabolism Adaptation', gene: 'AS3MT', rsid: 'rs3740393', impact: 'Natural selection for efficient enzymatic clearance of inorganic arsenic in Ganges Delta groundwater.' },
      { trait: 'Thalassemia / Cholera Resistance', gene: 'HBB / ABO', impact: 'Balancing selection in tropical deltaic river systems.' }
    ],
    description: 'South Asian reference populations (Bengali BEB, Gujarati GIH, Punjabi PJL, Telugu ITU, Tamil STU) encompass the complex Ancestral North Indian (ANI) and Ancestral South Indian (ASI) genetic gradient across India.',
    keyMarkers: ['rs3740393-G (AS3MT)', 'Y-DNA R1a-L657', 'H-M69', 'L-M20'],
    haplogroupNotes: 'Y-DNA R1a-L657, H-M69, L-M20, R2; mtDNA M30, M3, R0a, U2, N5.'
  },
  {
    code: 'Rakhigarhi',
    name: 'Rakhigarhi Indus Valley Ancestor',
    category: 'South Asia',
    geographicCenter: 'Rakhigarhi, Haryana, India (Indus Valley Civilization)',
    historicalTimeline: 'Landmark 4,500-year-old Harappan civilization genome. Combines Ancient Ancestral South Indian (AASI) hunter-gatherers with Iranian agriculturalist-related ancestry, without Steppe pastoralist DNA.',
    migrationPath: [
      'Ancient South Asian hunter-gatherer (AASI) lineage (~50,000 BP)',
      'Pre-Neolithic Iranian hunter-gatherer/farmer migration into northwestern India (~9,000 BP)',
      'Formation of the Indus Valley Civilization gene pool (~5,000 BP) prior to Indo-Aryan Steppe migrations'
    ],
    evolutionaryAdaptations: [
      { trait: 'Subtropical Agricultural Metabolism', gene: 'FADS1 / FADS2', impact: 'Adapted to plant-based cereal and pulse agriculture in the Indus basin.' }
    ],
    description: 'Rakhigarhi I6113 is the primary reference genome for the Indus Valley Civilization (IVC). Lacking Steppe herder R1a-M417 DNA, it represents the foundational Ancestral South Indian (ASI) ancestor of South Asia.',
    keyMarkers: ['Y-DNA H-M69', 'mtDNA U2b2', 'rs1426654-G'],
    haplogroupNotes: 'mtDNA U2b2; Y-DNA H / J2a.'
  },

  // ==========================================
  // EAST ASIAN & SOUTHEAST ASIAN
  // ==========================================
  {
    code: 'CHB',
    aliases: ['CHS', 'KHV', 'CDX', 'EAS_gnomAD', 'ALFA_EAS', 'GEMJ_Japan'],
    name: 'Han Chinese & East/SE Asian (CHB / CHS / KHV / CDX)',
    category: 'East Asia',
    geographicCenter: 'Northern China (Beijing), Southern China, Vietnam, Dai Autonomous Region',
    historicalTimeline: 'East Asian civilization lineage formed by Yellow River millet agriculturalists (~8000 BCE) in the north and Yangtze River rice agriculturalists (~7000 BCE) in the south.',
    migrationPath: [
      'Southern route Out-of-Africa migration across South & SE Asia into East Asia (~50,000 BP)',
      'Upper Paleolithic establishment in East Asia (e.g. Tianyuan Man, ~40,000 BP)',
      'Neolithic Yellow River & Yangtze agricultural demographic expansion (~9,000–5,000 BP)',
      'Imperial Han dynasty expansions unifying Northern and Southern Han groups'
    ],
    evolutionaryAdaptations: [
      { trait: 'Alcohol Flush Reaction (ALDH2 Deficiency)', gene: 'ALDH2', rsid: 'rs671', impact: 'Derived A allele causes inactive acetaldehyde dehydrogenase, causing flushing and protective against alcoholism.' },
      { trait: 'East Asian Hair, Sweat & Dental Morph.', gene: 'EDAR', rsid: 'rs3827760', impact: 'Derived Val370Ala variant causing coarse hair shafts, shovel-shaped incisors, and increased eccrine sweat glands.' },
      { trait: 'Dry Earwax & Low Body Odor', gene: 'ABCC11', rsid: 'rs17822931', impact: 'Loss-of-function 538G>A mutation producing dry earwax and reduced apocrine body odor.' }
    ],
    description: 'Han Chinese (CHB/CHS), Kinh Vietnamese (KHV), and Dai (CDX) represent East and Southeast Asian populations characterized by near-fixation of EDAR 370A and ABCC11 dry earwax alleles.',
    keyMarkers: ['rs3827760-G (EDAR 370A)', 'rs671-A (ALDH2)', 'rs17822931-T (ABCC11)'],
    haplogroupNotes: 'Y-DNA O-M122 (O2), O-F3288, N-M231; mtDNA D4, M7, F1, B4, C.'
  },
  {
    code: 'JPT',
    aliases: ['jomon'],
    name: 'Japanese & Jōmon (JPT / Jōmon)',
    category: 'East Asia',
    geographicCenter: 'Mainland Japan (Honshu, Kyushu, Shikoku, Hokkaido)',
    historicalTimeline: 'Dual-structure population formed by indigenous Jōmon hunter-gatherers (~15,000–3000 BCE) admixed with Yayoi wet-rice farmers migrating from the Korean Peninsula (~900 BCE–300 CE) and Kofun Period migrations.',
    migrationPath: [
      'Paleolithic land-bridge entry into Japanese archipelago (~30,000 BP)',
      'Jōmon hunter-gatherer ceramic culture isolation (~15,000–3,000 BP)',
      'Yayoi agricultural migration from Korean peninsula across Tsushima Strait (~2,900 BP)',
      'Admixture producing ~15-20% Jōmon and ~80-85% Yayoi/Kofun genomic structure in modern Yamato'
    ],
    evolutionaryAdaptations: [
      { trait: 'Alcohol Metabolism (ADH1B Fast Oxidizer)', gene: 'ADH1B', rsid: 'rs1229984', impact: 'His48Arg derived allele causes rapid conversion of ethanol to acetaldehyde, selected during rice agriculture.' },
      { trait: 'EDAR 370A Variant', gene: 'EDAR', rsid: 'rs3827760', impact: 'High frequency derived allele from Yayoi continental intake.' }
    ],
    description: 'Japanese (JPT) represents the Yamato population of Japan. Genetics reveal a classic dual-structure origin combining ~15-20% indigenous island Jōmon hunter-gatherer ancestry with ~80-85% East Asian continental Yayoi/Kofun farmer ancestry.',
    keyMarkers: ['Y-DNA D-M55 (Jōmon)', 'O-M175 (Yayoi)', 'rs1229984-T', 'rs3827760-G'],
    haplogroupNotes: 'Y-DNA D-M55 (~33%, unique Jōmon lineage), O-M122 (~35%), O-M119; mtDNA D4, M7a (Jōmon), G, N9a.'
  },

  // ==========================================
  // INDIGENOUS AMERICAS & ADMIXED AMERICAS
  // ==========================================
  {
    code: 'PEL',
    aliases: ['MXL', 'PUR', 'CLM', 'AMR_gnomAD', 'ALFA_LatAm1', 'ALFA_LatAm2', 'sgdp_karitiana', 'sgdp_surui', 'sgdp_pima', 'sgdp_mixe', 'sgdp_mixtec', 'sgdp_mayan', 'sgdp_mexico_zapotec', 'sgdp_quechua', 'sgdp_piapoco', 'sgdp_tlingit', 'sgdp_aleut', 'sgdp_eskimo_chaplin', 'sgdp_eskimo_naukan', 'sgdp_eskimo_sireniki'],
    name: 'Indigenous & Admixed Americas (PEL / MXL / PUR / CLM / Andean / Amazonian)',
    category: 'Americas',
    geographicCenter: 'Andes (Peru), Mesoamerica (Mexico, Guatemala), Amazonia, Caribbean, North America',
    historicalTimeline: 'High Indigenous American genetic component derived from Paleo-Indian expansion down the Pacific Rim (~15,000 BP), Central Andean highland adaptation (Lauricocha, ~8600 BP), Mesoamerican maize farming, and European/African colonial admixture.',
    migrationPath: [
      'Siberian-Beringian migration across Bering Land Bridge / Kelp Highway (~16,000 BP)',
      'Rapid coastal Pacific route migration down South America (~15,000 BP)',
      'Development of Maya, Zapotec, Aztec, and Inca civilizations',
      '500 years of European (Spanish/Portuguese) and African colonial admixture in LATAM groups'
    ],
    evolutionaryAdaptations: [
      { trait: 'High-Altitude Hypoxia Tolerance', gene: 'EGLN1 / PRKAA1', impact: 'Natural selection for lower hemoglobin concentration to prevent polycythemia at 3,500+ meters altitude in Andes.' },
      { trait: 'Lipid Regulation & Fatty Liver Vulnerability', gene: 'PNPLA3', rsid: 'rs738409', impact: 'Derived G allele (I148M) selected under historic feast-and-famine conditions, predisposing to hepatic fat storage on modern diets.' },
      { trait: 'EDAR 370A Fixation', gene: 'EDAR', rsid: 'rs3827760', impact: 'Near 100% fixation of derived G allele inherited from Siberian ancestral stock.' }
    ],
    description: 'Indigenous American and Latino reference populations (PEL, MXL, PUR, CLM, Maya, Quechua, Amazonian) preserve Paleo-Indian genomic heritage combined with varying proportions of Spanish and West African ancestry.',
    keyMarkers: ['rs3827760-G', 'rs738409-G', 'Y-DNA Q-M3', 'mtDNA B2, C1, D1, A2'],
    haplogroupNotes: 'Y-DNA Q-M3 / Q-L54 (>90% in unadmixed males); mtDNA B2, C1b, D1, A2.'
  },
  {
    code: 'LMB',
    aliases: ['CHK', 'LNP', 'NAN', 'CAT', 'WDN', 'MEL'],
    name: 'Native North American & Eastern Woodlands (Lumbee / Cherokee / Lenape / Catawba)',
    category: 'Americas',
    geographicCenter: 'North Carolina Coastal Plain, Southern Appalachia, Delaware Valley, Piedmont Siouan',
    historicalTimeline: 'Indigenous North American and tri-racial admixed populations of the Atlantic seaboard and Eastern Woodlands, descended from Mississippian, Algonquian, Iroquoian, and Siouan nations.',
    migrationPath: [
      'Paleo-Indian colonization of North America (~15,000 BP)',
      'Archaic & Woodland Period mound-building agricultural civilizations',
      'Post-contact resilience, community formation, and European/African admixture along Atlantic frontier'
    ],
    evolutionaryAdaptations: [
      { trait: 'Native American Metabolic Profile', gene: 'PNPLA3 / ABCA1', impact: 'Enriched lipid metabolism alleles adapted to traditional hunter-gatherer and maize agriculture diets.' }
    ],
    description: 'Eastern Woodlands Indigenous reference populations (Lumbee LMB, Cherokee CHK, Lenape LNP, Melungeon MEL) represent North American Indigenous heritage preserved in eastern states.',
    keyMarkers: ['Y-DNA Q-M3', 'R1b', 'mtDNA A2, B2, C1, D1'],
    haplogroupNotes: 'Y-DNA Q-M3, R1b, E-M2; mtDNA A2, B2, C1, X2a.'
  },
  {
    code: 'usr1',
    aliases: ['anzick1', 'luzia', 'saqqaq', 'kennewick', 'spirit_cave'],
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
 * (e.g. 'sgdp_yoruba', 'AFR_gnomAD', 'FRENCH', 'NFE_gnomAD', 'jomon')
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

  // 3. Partial / fallback match (e.g. 'sgdp_spanish' -> 'SPANISH' / 'IBS')
  return SUBPOPULATION_GLOSSARY_DATA.find(item => 
    item.name.toLowerCase().includes(target) || 
    item.code.toLowerCase().includes(target)
  );
}
