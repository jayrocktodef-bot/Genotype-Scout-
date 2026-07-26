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
}

export const SUBPOPULATION_GLOSSARY_DATA: PopulationGlossaryItem[] = [
  // ==========================================
  // WESTERN, NORTHERN & EASTERN EUROPE
  // ==========================================
  {
    code: 'CEU',
    name: 'Central European (CEU)',
    category: 'Europe',
    geographicCenter: 'Utah Residents (CEPH) / Western & Central Europe (France, Germany, British Isles)',
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
    name: 'Uralic & North-East European (FIN)',
    category: 'Europe',
    geographicCenter: 'Finland, Karelia, Bothnian Basin',
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
    name: 'Polish / Eastern European (POLISH / SLAVIC)',
    category: 'Europe',
    geographicCenter: 'Vistula-Oder Basins, Poland, Ukraine, Belarus',
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

  // ==========================================
  // MEDITERRANEAN & SOUTHERN EUROPE
  // ==========================================
  {
    code: 'TSI',
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
    code: 'SARDINIAN',
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
    code: 'Druze',
    name: 'Druze / Levant (Druze)',
    category: 'Middle East & Jewish',
    geographicCenter: 'Mount Lebanon, Hermon, Carmel, & Hauran (Lebanon, Syria, Israel)',
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
    code: 'GLL',
    name: 'Gullah Geechee / Atlantic Coast (GLL)',
    category: 'Africa',
    geographicCenter: 'Lowcountry Sea Islands (South Carolina, Georgia, North-East Florida)',
    historicalTimeline: 'African Diaspora population preserved on isolated coastal Sea Islands, descended from West African rice-cultivating populations (Sierra Leone, Windward Coast, Senegambia, Bight of Biafra).',
    migrationPath: [
      'Enslavement & transport from Windward Coast (Sierra Leone/Liberia), Senegambia, and Central Africa to Charleston (~1700–1808 CE)',
      'Geographic & cultural isolation on barrier Sea Islands enabling preservation of Gullah language & African traditions',
      'High West African genomic retention (~90-95%) with minimal European admixture'
    ],
    evolutionaryAdaptations: [
      { trait: 'Malaria Protective Alleles', gene: 'ACKR1 / HBB', rsid: 'rs2814778', impact: 'High retention of Duffy null and sickle cell alleles conferring resistance in Lowcountry rice swamps.' }
    ],
    description: 'Gullah Geechee (GLL) represents the most direct genetic and cultural bridge to 18th-century West African rice-farming societies in North America, exhibiting high genetic affinity to Mende (MSL), Temne, and Wolof populations.',
    keyMarkers: ['rs2814778-C', 'Y-DNA E-M2', 'mtDNA L2a1, L3e, L1b'],
    haplogroupNotes: 'Y-DNA E-M2 (~85%), R1b; mtDNA L2a1, L3e, L1b, L3b.'
  },

  // ==========================================
  // EAST AFRICAN & NILOTIC LINEAGES
  // ==========================================
  {
    code: 'LWK',
    name: 'Luhya / East African (LWK)',
    category: 'Africa',
    geographicCenter: 'Western Kenya (Kakamega, Vihiga, Bungoma)',
    historicalTimeline: 'Bantu-speaking population of East Africa formed by the expansion of West-Central African Bantu farmers into the Great Lakes region (~1000 BCE), absorbing indigenous Nilotic and Cushitic pastoralists.',
    migrationPath: [
      'Bantu Migration out of West-Central Africa (Nigeria/Cameroon borderland, ~4,000 BP)',
      'Eastward expansion around Lake Victoria (~2,500 BP)',
      'Admixture with indigenous East African hunter-gatherers and Cushitic pastoralists'
    ],
    evolutionaryAdaptations: [
      { trait: 'Independent Lactase Persistence', gene: 'MCM6', rsid: 'rs145414006 (-14010*C)', impact: 'Convergent evolution for adult milk digestion in East African pastoralist environments.' },
      { trait: 'High-Altitude Hypoxia Tolerance', gene: 'EGLN1 / EPAS1', impact: 'Adaptive variants for Rift Valley highland altitudes.' }
    ],
    description: 'Luhya (LWK) represents East African Bantu populations. Their genetic structure reflects Bantu agriculturalist heritage blended with ancient Cushitic pastoralist and indigenous hunter-gatherer lineages.',
    keyMarkers: ['rs145414006-C', 'rs2814778-C', 'Y-DNA E-M2'],
    haplogroupNotes: 'Y-DNA E-M2 (~70%), E-M35 (~15%); mtDNA L2a, L3x, L0a.'
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
    name: 'Bengali / South Asian (BEB)',
    category: 'South Asia',
    geographicCenter: 'Bengal Delta (Bangladesh and West Bengal, India)',
    historicalTimeline: 'Tri-partite genetic mix: Ancestral South Indian (ASI, ~50%), Ancestral North Indian (ANI / Steppe herder, ~35%), and Austroasiatic / Tibeto-Burman East Asian admixture (~15%) via eastern river corridors.',
    migrationPath: [
      'First Wave Out-of-Africa coastal migration into South Asia (~60,000 BP)',
      'Indus Valley & Iranian Farmer migration into Subcontinent (~7,000–5,000 BP)',
      'Bronze Age Yamnaya Steppe herder expansion carrying Indo-Aryan languages (~3,800 BP)',
      'East Asian Tibeto-Burman & Austroasiatic gene flow down Brahmaputra Valley (~2,000 BP)'
    ],
    evolutionaryAdaptations: [
      { trait: 'Arsenic Metabolism Adaptation', gene: 'AS3MT', rsid: 'rs3740393', impact: 'Natural selection for efficient enzymatic methylation and clearance of inorganic environmental arsenic in Bengal Delta groundwater.' },
      { trait: 'Thalassemia / Cholera Resistance', gene: 'HBB / ABO', impact: 'Balancing selection in tropical deltaic river systems.' }
    ],
    description: 'Bengali (BEB) represents the eastern South Asian population of the Ganges-Brahmaputra Delta, blending South Asian ANI/ASI baselines with Austroasiatic and Tibeto-Burman East Asian components.',
    keyMarkers: ['rs3740393-G (AS3MT)', 'Y-DNA R1a-Y7', 'H-M69', 'O-M175'],
    haplogroupNotes: 'Y-DNA R1a-L657, H-M69, O-M175; mtDNA M30, M3, R0a, U2.'
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
    name: 'Han Chinese / Beijing (CHB)',
    category: 'East Asia',
    geographicCenter: 'Northern China (Yellow River Basin, Beijing, Hebei)',
    historicalTimeline: 'Northern Han Chinese population formed by Yellow River agricultural civilization (millet farming, ~8000 BCE), Yangshao & Longshan cultures, and historical southward expansions.',
    migrationPath: [
      'Southern route Out-of-Africa migration across South & SE Asia into East Asia (~50,000 BP)',
      'Upper Paleolithic establishment in East Asia (e.g. Tianyuan Man, ~40,000 BP)',
      'Neolithic Yellow River Basin millet farming demographic boom (~9,000–5,000 BP)',
      'Imperial Han dynasty expansions unifying Northern and Southern Han groups'
    ],
    evolutionaryAdaptations: [
      { trait: 'Alcohol Flush Reaction (ALDH2 Deficiency)', gene: 'ALDH2', rsid: 'rs671', impact: 'Derived A allele causes inactive acetaldehyde dehydrogenase, causing flushing and protective against alcoholism.' },
      { trait: 'East Asian Hair, Sweat & Dental Morph.', gene: 'EDAR', rsid: 'rs3827760', impact: 'Derived Val370Ala variant causing coarse hair shafts, shovel-shaped incisors, and increased eccrine sweat glands.' },
      { trait: 'Dry Earwax & Low Body Odor', gene: 'ABCC11', rsid: 'rs17822931', impact: 'Loss-of-function 538G>A mutation producing dry earwax and reduced apocrine body odor.' }
    ],
    description: 'Han Chinese in Beijing (CHB) is the primary benchmark for Northern East Asian genetics. Driven by Yellow River Neolithic farming expansions and characterized by near-fixation of EDAR 370A and ABCC11 dry earwax alleles.',
    keyMarkers: ['rs3827760-G (EDAR 370A)', 'rs671-A (ALDH2)', 'rs17822931-T (ABCC11)'],
    haplogroupNotes: 'Y-DNA O-M122 (O2), O-F3288, N-M231; mtDNA D4, M7, F1, B4.'
  },
  {
    code: 'JPT',
    name: 'Japanese / Yamato (JPT)',
    category: 'East Asia',
    geographicCenter: 'Mainland Japan (Honshu, Kyushu, Shikoku)',
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
    name: 'Peruvian / Indigenous American (PEL)',
    category: 'Americas',
    geographicCenter: 'Lima, Andean Highlands (Cusco, Puno), & Peruvian Coast',
    historicalTimeline: 'High Indigenous American genetic component (~80-90%) derived from Paleo-Indian expansion down the Pacific Rim (~15,000 BP), Central Andean highland adaptation (Lauricocha, ~8600 BP), and Inca Imperial civilization.',
    migrationPath: [
      'Siberian-Beringian migration across Bering Land Bridge / Kelp Highway (~16,000 BP)',
      'Rapid coastal Pacific route migration down South America (~15,000 BP)',
      'Early Andean highland settlement & adaptation to hypoxia (~9,000 BP)',
      'Development of Chavín, Moche, Tiwanaku, and Inca imperial states'
    ],
    evolutionaryAdaptations: [
      { trait: 'High-Altitude Hypoxia Tolerance', gene: 'EGLN1 / PRKAA1', impact: 'Natural selection for lower hemoglobin concentration to prevent polycythemia at 3,500+ meters altitude.' },
      { trait: 'Lipid Regulation & Fatty Liver Vulnerability', gene: 'PNPLA3', rsid: 'rs738409', impact: 'Derived G allele (I148M) selected under historic feast-and-famine conditions, predisposing to hepatic fat storage on modern diets.' },
      { trait: 'EDAR 370A Fixation', gene: 'EDAR', rsid: 'rs3827760', impact: 'Near 100% fixation of derived G allele inherited from Siberian ancestral stock.' }
    ],
    description: 'Peruvian (PEL) represents Indigenous American Andean and Pacific coastal ancestry. Exhibits high Native American genomic proportions (~85%) with specific physiological adaptations to high-altitude hypoxia in the Andes.',
    keyMarkers: ['rs3827760-G', 'rs738409-G', 'Y-DNA Q-M3', 'mtDNA B2, C1, D1'],
    haplogroupNotes: 'Y-DNA Q-M3 / Q-L54 (>90% in unadmixed males); mtDNA B2, C1b, D1, A2.'
  },
  {
    code: 'usr1',
    name: 'Upward Sun River 1 (USR1 / Ancient Beringian)',
    category: 'Americas',
    geographicCenter: 'Tanana River Valley, Interior Alaska',
    historicalTimeline: 'Landmark 11,500-year-old infant genome representing the Ancient Beringian lineage—the earliest known diverged branch of Native Americans that remained in Beringia while Northern and Southern Native Americans expanded southward.',
    migrationPath: [
      'Ancestral Native American divergence from East Asian / Ancient North Eurasian ancestors in Siberia (~36,000–25,000 BP)',
      'Beringian Standstill isolation in unglaciated Alaska/Beringia (~24,000–16,000 BP)',
      'USR1 branch remained in interior Alaska while Southern Native Americans (SNA) migrated south of the Laurentide Ice Sheet'
    ],
    evolutionaryAdaptations: [
      { trait: 'Sub-Arctic Cold Climate Adaptation', gene: 'TRPM8 / FADS1', impact: 'Adapts fatty acid synthesis to high-fat marine & megafauna meat diets.' },
      { trait: 'EDAR 370A Derived Allele', gene: 'EDAR', rsid: 'rs3827760', impact: 'Homozygous derived allele establishing EDAR presence in ancient Beringians.' }
    ],
    description: 'Upward Sun River 1 (USR1) is the founding reference genome for Ancient Beringians. Discovered in Alaska, USR1 proved that ancient Native Americans diverged in Beringia prior to entering North America.',
    keyMarkers: ['Y-DNA Q-L54', 'mtDNA C1b', 'rs3827760-G'],
    haplogroupNotes: 'mtDNA C1b; Y-DNA Q-L54 lineage.'
  },

  // ==========================================
  // OCEANIA & SAHUL LINEAGES
  // ==========================================
  {
    code: 'sgdp_papuan',
    name: 'Papuan / Oceanian (Papuan)',
    category: 'Oceania & Sahul',
    geographicCenter: 'Highlands & Lowlands of Papua New Guinea',
    historicalTimeline: 'Deep Paleolithic Sahul lineage (~50,000 BP) representing early modern human settlement of Australasia, retaining the world highest level of Denisovan archaic introgression (~4-6%).',
    migrationPath: [
      'Southern Express Route Out-of-Africa migration along Indian Ocean coast (~65,000–55,000 BP)',
      'Sea crossing across Wallace Line into Pleistocene Sahul (Australia + New Guinea landmass, ~50,000 BP)',
      'Admixture with archaic Denisovans in Southeast Asia (~45,000 BP)',
      'Highland agricultural isolation and taro/banana domestication in Kuk Swamp (~9,000 BP)'
    ],
    evolutionaryAdaptations: [
      { trait: 'Denisovan Archaic Immunity Introgression', gene: 'OAS1 / STAT2', impact: 'Introgressed Denisovan immune genes providing enhanced protection against tropical RNA viruses.' },
      { trait: 'High-Altitude Tropical Adaptation', gene: 'EPAS1 / EGLN1', impact: 'Adapted to life in rugged New Guinea Highlands.' }
    ],
    description: 'Papuan represents deep Oceanian Sahul ancestry. Having settled New Guinea ~50,000 years ago, Papuans carry ~4-6% Denisovan DNA and maintain extraordinary linguistic and genetic diversity.',
    keyMarkers: ['4-6% Denisovan Introgression', 'Y-DNA MS-P93', 'C-M130', 'mtDNA P, Q'],
    haplogroupNotes: 'Y-DNA K-M9, MS-P93, C-M130; mtDNA P, Q, M28.'
  },

  // ==========================================
  // CENTRAL ASIAN & SIBERIAN LINEAGES
  // ==========================================
  {
    code: 'sgdp_kyrgyz_kyrgyzstan',
    name: 'Kyrgyz / Central Asian (Kyrgyz)',
    category: 'Central Asia & Siberia',
    geographicCenter: 'Tian Shan Mountains, Kyrgyzstan, Central Asia',
    historicalTimeline: 'Central Asian Turkic population combining Ancient North Eurasian (ANE), East Asian (Mongolic/Siberian), and Western Eurasian (Steppe/Indo-Iranian) lineages along the Silk Road.',
    migrationPath: [
      'Bronze Age Indo-Iranian Andronovo & Afanasievo herder expansion into Central Asia (~4,000 BP)',
      'Turkic nomadic expansion out of Altai-Sayan mountains (~6th Century CE)',
      'Mongol Empire unification (13th Century CE) producing ~60% East Asian and ~40% West Eurasian autosomal blend'
    ],
    evolutionaryAdaptations: [
      { trait: 'High-Altitude Adaptation', gene: 'EPAS1', impact: 'Genetic adaptations to Tian Shan mountain ranges (3,000+ meters).' },
      { trait: 'Lactase Persistence & Mare Milk Metabolism', gene: 'MCM6', impact: 'Adapted to nomadic pastoralist horse-milk and dairy consumption.' }
    ],
    description: 'Kyrgyz represents Central Asian Turkic steppe populations. Situated along the Silk Road, their genome is a classic ~60/40 blend of East Asian (Siberian/Mongolic) and West Eurasian (Indo-Iranian) ancestries.',
    keyMarkers: ['Y-DNA R1a-Z93', 'C-M217', 'O-M122', 'mtDNA D4, C4, H, U'],
    haplogroupNotes: 'Y-DNA R1a-Z93 (~63%), C-M217 (~20%), N-M231; mtDNA D4, C4, G2, H.'
  }
];
