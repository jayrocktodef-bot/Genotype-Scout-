import { HaplogroupDefinition } from '../types/haplogroup';

export const Y_DNA_HAPLOGROUPS: HaplogroupDefinition[] = [
  {
    code: "Y-Adam",
    shortName: "A00 / Y-Adam",
    cladeName: "Y-Stem Root",
    lineageType: "PATERNAL_YDNA",
    parentClade: null,
    definingSnps: ["PR2921", "AF3"],
    ageYearsBp: "~275,000 BP",
    originRegion: "West / Central Africa",
    historicalDescription: "The most recent common paternal ancestor from whom all living humans are patrilineally descended. Discovered in Cameroon and ancient Central African hunter-gatherer lines.",
    ancientCultures: ["Middle Stone Age Africa"],
    highFrequencyModern: ["Cameroon Mbo (rare, ~1%)", "Central Africa"],
    migrationPath: [
      { order: 1, region: "Central Africa", timePeriod: "275,000 BP", description: "Emergence of deepest modern human Y-chromosome lineage." }
    ]
  },
  {
    code: "A",
    shortName: "Haplogroup A",
    cladeName: "A-L1085",
    lineageType: "PATERNAL_YDNA",
    parentClade: "Y-Adam",
    definingSnps: ["L1085", "M91", "P97", "rs17306671"],
    ageYearsBp: "~140,000 BP",
    originRegion: "Eastern and Southern Africa",
    historicalDescription: "One of the basal human paternal branches, primarily found in Khoisan hunter-gatherers of Southern Africa and Nilotic populations of East Africa.",
    ancientCultures: ["African Hunter-Gatherers"],
    highFrequencyModern: ["Khoisan (up to 50%)", "Dinka / Nilotic (40%)", "Ethiopia (15%)"],
    migrationPath: [
      { order: 1, region: "Rift Valley, East Africa", timePeriod: "140,000 BP", description: "Diversification across eastern and southern African hunting-gathering bands." }
    ]
  },
  {
    code: "BT",
    shortName: "BT Macroclade",
    cladeName: "BT-M9040",
    lineageType: "PATERNAL_YDNA",
    parentClade: "Y-Adam",
    definingSnps: ["M9040", "M8968"],
    ageYearsBp: "~130,000 BP",
    originRegion: "Sub-Saharan Africa",
    historicalDescription: "Parent clade to B and CT. Represents the broad expansion of anatomically modern humans across the African continent.",
    ancientCultures: ["Middle Paleolithic Africa"],
    highFrequencyModern: ["Ancestral to all Non-A lineages"],
    migrationPath: [
      { order: 1, region: "East Africa", timePeriod: "130,000 BP", description: "Ancestral split leading to B and out-of-Africa CT clades." }
    ]
  },
  {
    code: "CT",
    shortName: "CT Macroclade (Out of Africa Root)",
    cladeName: "CT-M168",
    lineageType: "PATERNAL_YDNA",
    parentClade: "BT",
    definingSnps: ["M168", "M294", "P9.1", "rs9306841"],
    ageYearsBp: "~88,000 BP",
    originRegion: "Northeast Africa / Near East",
    historicalDescription: "The defining common paternal lineage of all non-African men and significant North/East African populations. Marks the great human migration out of Africa.",
    ancientCultures: ["Early Out-of-Africa Pioneers"],
    highFrequencyModern: ["Ancestral to C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, T"],
    migrationPath: [
      { order: 1, region: "Northeast Africa", timePeriod: "88,000 BP", description: "Crossing the Bab-el-Mandeb / Sinai peninsula into Eurasia." }
    ]
  },
  {
    code: "E",
    shortName: "Haplogroup E",
    cladeName: "E-M96",
    lineageType: "PATERNAL_YDNA",
    parentClade: "CT",
    definingSnps: ["M96", "P29", "P150", "rs9786481"],
    ageYearsBp: "~65,000 BP",
    originRegion: "Northeast Africa / Levant",
    historicalDescription: "Major African and Mediterranean lineage, splitting into E1a and dominant E1b clades.",
    ancientCultures: ["Late Paleolithic Levant / Nile Valley"],
    highFrequencyModern: ["North Africa", "Horn of Africa", "Sub-Saharan Africa", "Southern Europe"],
    migrationPath: [
      { order: 1, region: "Red Sea Corridor", timePeriod: "65,000 BP", description: "Spread throughout the Sahara, Mediterranean, and sub-Saharan zones." }
    ]
  },
  {
    code: "E1b1a",
    shortName: "E-M2 (E-V38)",
    cladeName: "E1b1a / E-M2",
    lineageType: "PATERNAL_YDNA",
    parentClade: "E",
    definingSnps: ["M2", "V38", "P1", "rs2032597"],
    ageYearsBp: "~40,000 BP",
    originRegion: "West Africa",
    historicalDescription: "The predominant paternal lineage among West African and Bantu-speaking populations, carried across Africa during the agricultural Bantu expansion.",
    ancientCultures: ["Nok Culture", "Bantu Agricultural Pioneers"],
    highFrequencyModern: ["Nigeria (Yoruba, Igbo ~80-90%)", "Ghana (75%)", "African Americans (~60-70%)", "Central/Southern Africa (60-80%)"],
    migrationPath: [
      { order: 1, region: "West Africa (Niger-Congo)", timePeriod: "40,000 BP", description: "Agricultural revolution and population explosion." },
      { order: 2, region: "Sub-Saharan Africa", timePeriod: "3,000 BP", description: "Major Bantu migrations southward and eastward." }
    ]
  },
  {
    code: "E1b1b",
    shortName: "E-M35",
    cladeName: "E1b1b / E-M35",
    lineageType: "PATERNAL_YDNA",
    parentClade: "E",
    definingSnps: ["M35", "L117", "M215", "rs9306847"],
    ageYearsBp: "~35,000 BP",
    originRegion: "Horn of Africa / North Africa",
    historicalDescription: "Associated with the Afroasiatic language family and the early spread of pastoralism and Neolithic farming into Europe via the Mediterranean.",
    ancientCultures: ["Natufian", "Cardial Impressed Ware", "Capsian Culture"],
    highFrequencyModern: ["Berbers / North Africa (60-80%)", "Somalia (80%)", "Balkans (15-30%)", "Southern Europe (10-20%)"],
    migrationPath: [
      { order: 1, region: "Levant / Egypt", timePeriod: "25,000 BP", description: "Natufian hunter-gatherer expansion." },
      { order: 2, region: "Balkans & Western Mediterranean", timePeriod: "8,000 BP", description: "Neolithic maritime farmers reaching Europe." }
    ]
  },
  {
    code: "E-V13",
    shortName: "E-V13 (E1b1b1a1b1a)",
    cladeName: "E-V13 / E-L142",
    lineageType: "PATERNAL_YDNA",
    parentClade: "E1b1b",
    definingSnps: ["V13", "L142", "CTS1273", "rs9306848"],
    ageYearsBp: "~4,800 BP (Bronze Age)",
    originRegion: "Balkans / Southeast Europe",
    historicalDescription: "The primary European subclade of E1b1b, experiencing rapid Bronze Age demographic expansion in the Balkans and spreading with Greek, Thracian, Illyrian, and Roman populations.",
    ancientCultures: ["Balkan Bronze Age", "Mycenaean / Ancient Greek", "Roman Auxiliary troops"],
    highFrequencyModern: ["Kosovo Albanians (40-45%)", "Greeks (20-30%)", "Bulgarians (20%)", "Italy (10-15%)"],
    migrationPath: [
      { order: 1, region: "Balkans / Danube Valley", timePeriod: "4,800 BP", description: "Rapid Bronze Age expansion in Southeast Europe." },
      { order: 2, region: "Central & Western Europe", timePeriod: "2,000 BP", description: "Roman military deployment and classical Mediterranean trade." }
    ]
  },
  {
    code: "G",
    shortName: "Haplogroup G",
    cladeName: "G-M201",
    lineageType: "PATERNAL_YDNA",
    parentClade: "CT",
    definingSnps: ["M201", "P257", "U2", "rs2032630"],
    ageYearsBp: "~48,000 BP",
    originRegion: "Caucasus / Anatolia / Middle East",
    historicalDescription: "The primary paternal lineage of early Neolithic European farmers (EEF), who brought agriculture from Anatolia across Europe. Ötzi the Iceman belonged to haplogroup G2a.",
    ancientCultures: ["Linear Pottery (LBK)", "Cardial Ware", "Cardium Pottery", "Ötzi the Iceman"],
    highFrequencyModern: ["Georgia / Ossetia (60-70%)", "Sardinia (15-20%)", "Crete (10%)", "Caucasus (30-60%)"],
    migrationPath: [
      { order: 1, region: "Fertile Crescent / Anatolia", timePeriod: "12,000 BP", description: "Early domestication of wheat and sheep." },
      { order: 2, region: "Danube & Rhine Valleys", timePeriod: "7,500 BP", description: "Neolithic LBK expansion transforming prehistoric Europe." }
    ]
  },
  {
    code: "I",
    shortName: "Haplogroup I",
    cladeName: "I-M170",
    lineageType: "PATERNAL_YDNA",
    parentClade: "CT",
    definingSnps: ["M170", "M258", "P19", "rs2032608"],
    ageYearsBp: "~30,000 BP (Upper Paleolithic)",
    originRegion: "Europe (Indigenous European hunter-gatherers)",
    historicalDescription: "The oldest major indigenous European paternal lineage, associated with Upper Paleolithic Gravettian and Epigravettian mammoth hunters and cave painters.",
    ancientCultures: ["Gravettian", "Magdalenian", "Western Hunter-Gatherers (WHG)"],
    highFrequencyModern: ["Scandinavia", "Balkans", "Sardinia"],
    migrationPath: [
      { order: 1, region: "Central Europe / Balkans", timePeriod: "30,000 BP", description: "Gravettian cave artists and hunter-gatherers during Last Glacial Maximum." }
    ]
  },
  {
    code: "I1-M253",
    shortName: "I1 (Nordic / Viking Y-DNA)",
    cladeName: "I1 / I-M253",
    lineageType: "PATERNAL_YDNA",
    parentClade: "I",
    definingSnps: ["M253", "M307", "P30", "rs9341278"],
    ageYearsBp: "~4,700 BP (Nordic Bronze Age)",
    originRegion: "Scandinavia / Jutland Peninsula",
    historicalDescription: "The classic Scandinavian/Nordic paternal lineage. Experienced extreme founder effect in the Nordic Bronze Age and expanded with Germanic tribes and Viking seafaring conquests.",
    ancientCultures: ["Nordic Bronze Age", "Jastorf Culture", "Vikings / Anglo-Saxons", "Goths / Normans"],
    highFrequencyModern: ["Sweden (35-40%)", "Norway (32-35%)", "Denmark (30%)", "Finland (28%)", "England / Scotland (15-20%)"],
    migrationPath: [
      { order: 1, region: "Southern Scandinavia", timePeriod: "4,500 BP", description: "Nordic Bronze Age metal trade and agricultural expansion." },
      { order: 2, region: "British Isles, Normandy, Rus", timePeriod: "800 - 1050 CE", description: "Viking coastal raids and permanent settlements." }
    ]
  },
  {
    code: "I2-M438",
    shortName: "I2 (Dinaric & Sardinian)",
    cladeName: "I2 / I-M438 (I-L621)",
    lineageType: "PATERNAL_YDNA",
    parentClade: "I",
    definingSnps: ["M438", "P215", "L621", "rs17315758"],
    ageYearsBp: "~22,000 BP",
    originRegion: "Balkans / Southwestern Europe",
    historicalDescription: "Associated with Mesolithic European hunter-gatherers and later Slavic medieval expansions (I2a-Dinaric) as well as ancient Sardinian founders.",
    ancientCultures: ["Cucuteni-Trypillia", "Mesolithic Iron Gates", "Nuragic Sardinia", "Slavic Migrations"],
    highFrequencyModern: ["Bosnia & Herzegovina (60-70%)", "Croatia (35-45%)", "Serbia (35%)", "Sardinia (40%)"],
    migrationPath: [
      { order: 1, region: "Balkans & Carpathians", timePeriod: "20,000 BP", description: "Glacial refuge during Ice Age." },
      { order: 2, region: "Eastern & Southern Europe", timePeriod: "500 - 900 CE", description: "Medieval Slavic expansion across the Balkan peninsula." }
    ]
  },
  {
    code: "J1-M267",
    shortName: "J1 (Semitic / Arabian)",
    cladeName: "J1 / J-M267 (J-P58)",
    lineageType: "PATERNAL_YDNA",
    parentClade: "CT",
    definingSnps: ["M267", "L136", "P58", "rs13447352"],
    ageYearsBp: "~20,000 BP",
    originRegion: "Caucasus / Taurus Mountains / Zagros",
    historicalDescription: "Prominent paternal lineage of Semitic-speaking populations of the Arabian Peninsula, Levant, and North Africa (Cohen Modal Haplotype marker).",
    ancientCultures: ["Natufian", "Bronze Age Levant", "Nabataeans", "Early Islamic Caliphate"],
    highFrequencyModern: ["Yemen (70%)", "Saudi Arabia (50-60%)", "Iraq / Jordan (40%)", "Dagestan (80%)", "Ashkenazi Jewish (15-20%)"],
    migrationPath: [
      { order: 1, region: "Fertile Crescent / Arabia", timePeriod: "10,000 BP", description: "Pastoralist spread across arid deserts." },
      { order: 2, region: "North Africa & Iberia", timePeriod: "700 - 1200 CE", description: "Early Islamic expansion." }
    ]
  },
  {
    code: "J2-M172",
    shortName: "J2 (Greco-Roman & Anatolian)",
    cladeName: "J2 / J-M172 (J-M410, M67)",
    lineageType: "PATERNAL_YDNA",
    parentClade: "CT",
    definingSnps: ["M172", "M410", "M67", "rs2032604"],
    ageYearsBp: "~28,000 BP",
    originRegion: "Anatolia / Mesopotamia / Caucasus",
    historicalDescription: "Associated with the development of wine production, copper/bronze metallurgy, and classical maritime civilizations (Minoans, Phoenicians, Greeks, Etruscans, Romans).",
    ancientCultures: ["Minoan Civilization", "Phoenicians", "Ancient Greece", "Etruscans / Rome"],
    highFrequencyModern: ["Turkey (30%)", "Greece (25-30%)", "Southern Italy & Sicily (25%)", "Lebanon (30%)", "Iran (20%)"],
    migrationPath: [
      { order: 1, region: "Anatolia & Levant", timePeriod: "10,000 BP", description: "Neolithic agricultural & metallurgy spread." },
      { order: 2, region: "Aegean & Mediterranean Basin", timePeriod: "3,500 BP", description: "Minoan, Phoenician, and Greek maritime colonization." }
    ]
  },
  {
    code: "N-M231",
    shortName: "Haplogroup N (Uralic / Siberian)",
    cladeName: "N / N-M231 (N1c-Tat)",
    lineageType: "PATERNAL_YDNA",
    parentClade: "CT",
    definingSnps: ["M231", "LLY22g", "M178", "Tat", "rs34442126"],
    ageYearsBp: "~22,000 BP",
    originRegion: "East Asia / Southern Siberia",
    historicalDescription: "Predominant paternal marker of Finno-Ugric and Uralic peoples, migrating from Siberia across Northern Eurasia into the Baltic and Fennoscandia.",
    ancientCultures: ["Comb Ceramic Culture", "Seima-Turbino Phenomenon", "Ancient Finnic Tribes"],
    highFrequencyModern: ["Finland (60%)", "Estonia (35%)", "Lithuania / Latvia (40%)", "Yakuts / Siberia (75-90%)", "Northern Russia (20-30%)"],
    migrationPath: [
      { order: 1, region: "Lake Baikal / Siberia", timePeriod: "15,000 BP", description: "Trans-Siberian taiga hunter-fisher adaptations." },
      { order: 2, region: "Baltic Sea Region", timePeriod: "3,500 BP", description: "Bronze Age introduction of Finnic languages to northeastern Europe." }
    ]
  },
  {
    code: "O-M175",
    shortName: "Haplogroup O (East Asian)",
    cladeName: "O / O-M175 (O2-M122)",
    lineageType: "PATERNAL_YDNA",
    parentClade: "CT",
    definingSnps: ["M175", "M122", "M324", "rs2032651"],
    ageYearsBp: "~36,000 BP",
    originRegion: "Southeast / East Asia",
    historicalDescription: "The dominant paternal lineage of East and Southeast Asia, driving the expansion of rice agriculture (Yangtze) and millet farming (Yellow River).",
    ancientCultures: ["Yangshao Culture", "Longshan Culture", "Austronesian Expansion"],
    highFrequencyModern: ["Han Chinese (50-60%)", "Korea (45%)", "Vietnam (40%)", "Polynesia / Southeast Asia (30-50%)"],
    migrationPath: [
      { order: 1, region: "Yellow River & Yangtze Basins", timePeriod: "10,000 BP", description: "Neolithic agricultural intensification." },
      { order: 2, region: "Pacific Islands & East Asian Rim", timePeriod: "4,000 BP", description: "Austronesian seafaring out of Taiwan." }
    ]
  },
  {
    code: "Q-M242",
    shortName: "Haplogroup Q (Indigenous American & Siberian)",
    cladeName: "Q / Q-M242 (Q-M3)",
    lineageType: "PATERNAL_YDNA",
    parentClade: "CT",
    definingSnps: ["M242", "M3", "L54", "rs3894"],
    ageYearsBp: "~30,000 BP",
    originRegion: "Central Siberia / Altai Mountains",
    historicalDescription: "The founding paternal lineage of Indigenous Americans who crossed the Beringia land bridge during the Last Glacial Maximum, as well as native Siberian groups (Ket, Selkup).",
    ancientCultures: ["Clovis Culture", "Beringian Hunters", "Ancient Maya / Inca / Aztec Ancestors"],
    highFrequencyModern: ["Native South Americans (90-100%)", "Native North Americans (60-90%)", "Ket People of Siberia (90%)"],
    migrationPath: [
      { order: 1, region: "Bering Land Bridge", timePeriod: "16,000 BP", description: "Crossing from Siberia into North America." },
      { order: 2, region: "Mesoamerica & Andes", timePeriod: "13,000 BP", description: "Rapid southward expansion throughout the Americas." }
    ]
  },
  {
    code: "R1a-M417",
    shortName: "R1a (Corded Ware / Balto-Slavic & Indo-Iranian)",
    cladeName: "R1a1a1 / R-M417 (Z282, Z93)",
    lineageType: "PATERNAL_YDNA",
    parentClade: "CT",
    definingSnps: ["M420", "M17", "M417", "Z282", "Z93", "rs17315757"],
    ageYearsBp: "~5,500 BP (Late Copper / Early Bronze Age)",
    originRegion: "Pontic-Caspian Steppe / Eastern Europe",
    historicalDescription: "Associated with the spread of Proto-Indo-European languages, horse domestication, chariot warfare, and the Corded Ware archaeological culture.",
    ancientCultures: ["Corded Ware Culture", "Sintashta Charioteers", "Andronovo Culture", "Early Slavs"],
    highFrequencyModern: ["Poland (55-60%)", "Ukraine (45-50%)", "Russia (45%)", "Northern India (35-45%)", "Kyrgyzstan (60%)"],
    migrationPath: [
      { order: 1, region: "Pontic-Caspian Steppe", timePeriod: "5,500 BP", description: "Yamnaya / Corded Ware expansion into Central & Northern Europe." },
      { order: 2, region: "Central Asia & Indus Valley", timePeriod: "3,800 BP", description: "Sintashta-Andronovo chariot horizon into Iran and Northern India." }
    ]
  },
  {
    code: "R1b-M269",
    shortName: "R1b (Western European Core)",
    cladeName: "R1b1a1b / R-M269",
    lineageType: "PATERNAL_YDNA",
    parentClade: "CT",
    definingSnps: ["M343", "M269", "L23", "L51", "rs9786184"],
    ageYearsBp: "~6,000 BP",
    originRegion: "Pontic-Caspian Steppe / East-Central Europe",
    historicalDescription: "The dominant paternal lineage in Western Europe. Propelled by the Yamnaya steppe pastoralist migrations and Bell Beaker metallurgical network.",
    ancientCultures: ["Yamnaya Culture", "Bell Beaker Phenomenon", "Unetice Culture"],
    highFrequencyModern: ["Ireland (80-85%)", "Basque Country (85%)", "Scotland / Wales (75-80%)", "France / Spain (60-70%)"],
    migrationPath: [
      { order: 1, region: "Eurasian Steppe", timePeriod: "5,000 BP", description: "Yamnaya pastoralists migrate into the Danube basin." },
      { order: 2, region: "Rhine & Atlantic Facade", timePeriod: "4,400 BP", description: "Bell Beaker expansion replacing indigenous Neolithic male lineages." }
    ]
  },
  {
    code: "R1b-U106",
    shortName: "R-U106 (Proto-Germanic)",
    cladeName: "R1b1a1b1a1a1 / R-U106 (S21)",
    lineageType: "PATERNAL_YDNA",
    parentClade: "R1b-M269",
    definingSnps: ["U106", "S21", "M405", "rs2032598"],
    ageYearsBp: "~4,500 BP",
    originRegion: "Central / Northern Europe (Rhine-Weser Basin)",
    historicalDescription: "The primary Germanic branch of R1b. Associated with the Unetice Bronze Age, Jastorf Iron Age, and Anglo-Saxon / Frankish / Dutch expansions.",
    ancientCultures: ["Unetice Culture", "Jastorf Culture", "Anglo-Saxons", "Franks / Saxons"],
    highFrequencyModern: ["Netherlands (35%)", "Northern Germany (30%)", "England (20-25%)", "Denmark (18%)", "Austria (20%)"],
    migrationPath: [
      { order: 1, region: "Rhine-Elbe Region", timePeriod: "4,000 BP", description: "Consolidation of Proto-Germanic communities." },
      { order: 2, region: "North Sea & Britain", timePeriod: "450 - 600 CE", description: "Anglo-Saxon migrations across the English Channel." }
    ]
  },
  {
    code: "R1b-P312",
    shortName: "R-P312 (Italo-Celtic / Atlantic)",
    cladeName: "R1b1a1b1a1a2 / R-P312 (S116)",
    lineageType: "PATERNAL_YDNA",
    parentClade: "R1b-M269",
    definingSnps: ["P312", "S116", "rs34276300"],
    ageYearsBp: "~4,500 BP",
    originRegion: "Central / Western Europe",
    historicalDescription: "Parent clade to major Western European lineages: Celtic (L21), Iberian (DF27), and Alpine/Italo-Celtic (U152). Carried by the Bell Beaker people.",
    ancientCultures: ["Bell Beaker", "Hallstatt Celts", "La Tène Culture"],
    highFrequencyModern: ["Ireland (75%)", "Scotland (70%)", "France (50%)", "Spain (55%)", "Northern Italy (40%)"],
    migrationPath: [
      { order: 1, region: "Central Europe / Rhine Valley", timePeriod: "4,500 BP", description: "Bell Beaker metallurgical network diversification." }
    ]
  },
  {
    code: "R1b-L21",
    shortName: "R-L21 (Insular Celtic / Atlantic)",
    cladeName: "R1b1a1b1a1a2c / R-L21 (M529)",
    lineageType: "PATERNAL_YDNA",
    parentClade: "R1b-P312",
    definingSnps: ["L21", "M529", "S145", "rs11799226"],
    ageYearsBp: "~4,200 BP (Early Bronze Age)",
    originRegion: "British Isles / Brittany / Atlantic France",
    historicalDescription: "The defining paternal marker of Insular Celtic populations (Gaels, Britons, Picts). Found in extraordinary frequencies in Ireland, Scotland, and Wales.",
    ancientCultures: ["Atlantic Bronze Age", "Insular Celts", "Gaels / Scots / Picts", "Bretons"],
    highFrequencyModern: ["Western Ireland (75-80%)", "Scotland (50-60%)", "Wales (50%)", "Brittany (40%)", "Cornwall (35%)"],
    migrationPath: [
      { order: 1, region: "Atlantic Seaboard", timePeriod: "4,200 BP", description: "Bronze Age mining and maritime trade in tin and copper." },
      { order: 2, region: "Ireland & Scottish Highlands", timePeriod: "3,000 BP", description: "Cultural flowering of Gaelic kingdoms." }
    ]
  },
  {
    code: "R1b-U152",
    shortName: "R-U152 (Italo-Celtic / Alpine / Roman)",
    cladeName: "R1b1a1b1a1a2b / R-U152 (S28)",
    lineageType: "PATERNAL_YDNA",
    parentClade: "R1b-P312",
    definingSnps: ["U152", "S28", "rs12338"],
    ageYearsBp: "~4,300 BP",
    originRegion: "Alps / Switzerland / Northern Italy",
    historicalDescription: "Strongly correlated with the Hallstatt and La Tène Celtic cultures, the Villanova culture, and early Italic tribes including the ancestors of the Romans.",
    ancientCultures: ["Hallstatt Culture", "La Tène Culture", "Villanovan Culture", "Ancient Romans & Latins"],
    highFrequencyModern: ["Northern Italy / Tuscany (30-40%)", "Switzerland (25-30%)", "Eastern France (20%)", "Corsica (25%)"],
    migrationPath: [
      { order: 1, region: "Alpine Valleys / Switzerland", timePeriod: "4,300 BP", description: "Early metallurgy in copper and bronze." },
      { order: 2, region: "Po Valley & Italian Peninsula", timePeriod: "3,000 BP", description: "Villanovan and early Roman Republican consolidation." }
    ]
  },
  {
    code: "R1b-DF27",
    shortName: "R-DF27 (Iberian / Gascon)",
    cladeName: "R1b1a1b1a1a2a / R-DF27",
    lineageType: "PATERNAL_YDNA",
    parentClade: "R1b-P312",
    definingSnps: ["DF27", "S250", "rs16980479"],
    ageYearsBp: "~4,200 BP",
    originRegion: "Pyrenees / Iberian Peninsula / Southwest France",
    historicalDescription: "The predominant paternal lineage of the Iberian Peninsula, carried by ancient Iberians, Celtiberians, and Basque ancestors.",
    ancientCultures: ["El Argar Culture", "Celtiberians", "Ancient Iberians", "Basques"],
    highFrequencyModern: ["Basque Country (70%)", "Catalonia (45%)", "Spain / Portugal (40-50%)", "Gascony (40%)", "Latin America (via Spanish colonists)"],
    migrationPath: [
      { order: 1, region: "Pyrenees & Ebro Basin", timePeriod: "4,200 BP", description: "Bronze Age settlement across Iberia." },
      { order: 2, region: "Americas", timePeriod: "1500 - 1800 CE", description: "Spanish and Portuguese transatlantic exploration." }
    ]
  },
  {
    code: "E-M180",
    shortName: "E1b1a1a / E-M180",
    cladeName: "E-M180 (P279)",
    lineageType: "PATERNAL_YDNA",
    parentClade: "E1b1a",
    definingSnps: ["M180"],
    ageYearsBp: "~4,500 BP",
    originRegion: "West / Central Africa (Nigeria / Cameroon Grassfields)",
    historicalDescription: "Primary driver of the Sub-Saharan Bantu agricultural expansion and the ancestral lineage of the majority of African-descended males across the Americas.",
    ancientCultures: ["Bantu Agrarian Expansion", "Nok Culture"],
    highFrequencyModern: ["Yoruba (70%)", "Igbo (75%)", "African Americans (60%)", "Bantu populations (65%)"],
    migrationPath: [
      { order: 1, region: "Benue-Cross River Basin, Nigeria", timePeriod: "4,500 BP", description: "Invention of yam/oil palm agriculture and iron metallurgy triggering rapid demographic expansion." },
      { order: 2, region: "Congo Basin & Trans-Atlantic Ports", timePeriod: "3,000–400 BP", description: "Migration across Central/Southern Africa and dispersion during the Transatlantic slave trade." }
    ]
  },
  {
    code: "E-U175",
    shortName: "E1b1a1a1 / E-U175",
    cladeName: "E-U175",
    lineageType: "PATERNAL_YDNA",
    parentClade: "E-M180",
    definingSnps: ["U175"],
    ageYearsBp: "~3,500 BP",
    originRegion: "West Africa (Gulf of Guinea)",
    historicalDescription: "Major West African rainforest subclade with high concentration in modern Ghana (Akan, Ga), Benin, and Nigeria.",
    ancientCultures: ["West African Iron Age", "Kintampo Complex"],
    highFrequencyModern: ["Ghana (60%)", "Nigeria (55%)", "African Americans (35%)"],
    migrationPath: [
      { order: 1, region: "Gulf of Guinea Forest Zone", timePeriod: "3,500 BP", description: "Diversification into agricultural kingdoms across the West African coast." }
    ]
  },
  {
    code: "E-U290",
    shortName: "E1b1a1a1a / E-U290",
    cladeName: "E-U290",
    lineageType: "PATERNAL_YDNA",
    parentClade: "E-U175",
    definingSnps: ["U290"],
    ageYearsBp: "~3,000 BP",
    originRegion: "Bight of Benin & Bight of Biafra",
    historicalDescription: "Core ancestral marker for African Americans, Afro-Caribbeans, and Afro-Brazilians traced to historical Gold Coast and Slave Coast ports.",
    ancientCultures: ["Oyo Empire", "Kingdom of Benin", "Igbo-Ukwu"],
    highFrequencyModern: ["Yoruba (50%)", "Igbo (50%)", "African Americans (30%)", "Jamaica / Caribbean (35%)"],
    migrationPath: [
      { order: 1, region: "Lower Niger Basin", timePeriod: "3,000 BP", description: "Demographic explosion associated with bronze casting and centralized urban states." }
    ]
  },
  {
    code: "E-M58",
    shortName: "E1b1a1a1b / E-M58",
    cladeName: "E-M58",
    lineageType: "PATERNAL_YDNA",
    parentClade: "E-U175",
    definingSnps: ["M58"],
    ageYearsBp: "~2,800 BP",
    originRegion: "Central & Southern Africa",
    historicalDescription: "Diagnostic marker tracking the southern stream of the Bantu migration down into Angola, Mozambique, and South Africa.",
    ancientCultures: ["Southern Bantu Expansion", "Great Zimbabwe"],
    highFrequencyModern: ["Kongo (25%)", "Ovambo (20%)", "Zulu / Xhosa (15%)"],
    migrationPath: [
      { order: 1, region: "Congo Rainforest & Zambezi Basin", timePeriod: "2,500 BP", description: "Pioneering southward migration introducing cattle pastoralism and iron-working." }
    ]
  },
  {
    code: "E-CTS9883",
    shortName: "E-CTS9883",
    cladeName: "E-CTS9883",
    lineageType: "PATERNAL_YDNA",
    parentClade: "E-U290",
    definingSnps: ["CTS9883"],
    ageYearsBp: "~2,200 BP",
    originRegion: "West Africa",
    historicalDescription: "Fine-resolution terminal subclade within the West African U290 branch.",
    ancientCultures: ["West African Coastal Kingdoms"],
    highFrequencyModern: ["Nigeria", "Ghana", "African Americans"],
    migrationPath: [
      { order: 1, region: "West African Coastline", timePeriod: "2,000 BP", description: "Coastal settlement and trade expansion." }
    ]
  },
  {
    code: "Q-M3",
    shortName: "Q1a2a1a1 / Q-M3",
    cladeName: "Q-M3",
    lineageType: "PATERNAL_YDNA",
    parentClade: "Q-M242",
    definingSnps: ["M3"],
    ageYearsBp: "~15,000 BP",
    originRegion: "Beringia / North America",
    historicalDescription: "The predominant indigenous founding paternal lineage of the Americas, carried by over 80% of Native American men from the Arctic to Patagonia.",
    ancientCultures: ["Paleo-Indian", "Clovis", "Maya", "Inca", "Aztec", "Mississippian"],
    highFrequencyModern: ["Indigenous South Americans (up to 95%)", "Mesoamerican Maya/Nahua (80%)", "Native North Americans (60%)"],
    migrationPath: [
      { order: 1, region: "Bering Land Bridge", timePeriod: "15,000 BP", description: "Mutation occurred in the founding Paleo-Indian population during Beringian standstill." },
      { order: 2, region: "Pacific Coast & Great Plains", timePeriod: "14,000–12,000 BP", description: "Rapid southward dispersal along the ice-free corridor and coastal routes into South America." }
    ]
  },
  {
    code: "Q-M848",
    shortName: "Q-M848",
    cladeName: "Q-M848",
    lineageType: "PATERNAL_YDNA",
    parentClade: "Q-M3",
    definingSnps: ["M848"],
    ageYearsBp: "~12,000 BP",
    originRegion: "Mesoamerica & South America",
    historicalDescription: "The massive pan-Mesoamerican and South American expansion subclade associated with the rise of complex agricultural civilizations (Maya, Zapotec, Moche, Tiwanaku, Inca).",
    ancientCultures: ["Maya Civilization", "Andean Civilizations", "Amazonian Earthworks"],
    highFrequencyModern: ["Guatemala Maya (90%)", "Peruvian Quechua/Aymara (85%)", "Amazonian tribes (90%)"],
    migrationPath: [
      { order: 1, region: "Central America & Isthmus of Panama", timePeriod: "12,000 BP", description: "Entry and rapid diversification across the Andes and Amazon basin." }
    ]
  },
  {
    code: "Q-Z780",
    shortName: "Q-Z780",
    cladeName: "Q-Z780",
    lineageType: "PATERNAL_YDNA",
    parentClade: "Q-M242",
    definingSnps: ["Z780"],
    ageYearsBp: "~14,500 BP",
    originRegion: "North America (Montana / Western US)",
    historicalDescription: "Ancient Paleo-Indian lineage contemporary with Clovis culture, confirmed in the 12,600-year-old Anzick-1 child burial in Montana.",
    ancientCultures: ["Clovis Culture", "Western Stemmed Tradition"],
    highFrequencyModern: ["Native North Americans (rare surviving branches, ~5%)", "Central America"],
    migrationPath: [
      { order: 1, region: "Beringia to North American Plains", timePeriod: "14,500 BP", description: "Associated with megafauna hunting and Clovis fluted point technology." }
    ]
  },
  {
    code: "C-P39",
    shortName: "C-P39 / C2a1a1",
    cladeName: "C-P39",
    lineageType: "PATERNAL_YDNA",
    parentClade: "C",
    definingSnps: ["P39"],
    ageYearsBp: "~12,000 BP",
    originRegion: "North America (Subarctic / Great Plains)",
    historicalDescription: "Indigenous North American Y-DNA C lineage specific to Na-Dene (Athabaskan, Navajo, Apache) and Algonquian-speaking peoples (Cheyenne, Blackfoot, Ojibwe).",
    ancientCultures: ["Na-Dene Expansion", "Plains Indigenous Cultures"],
    highFrequencyModern: ["Navajo (up to 50%)", "Apache (45%)", "Cheyenne (25%)", "Chipewyan (40%)"],
    migrationPath: [
      { order: 1, region: "Alaska & Yukon", timePeriod: "12,000 BP", description: "Second wave of Beringian migration expanding into the American Southwest and Plains." }
    ]
  },
  {
    code: "O2a2b1-M117",
    shortName: "O-M117",
    cladeName: "O2a2b1-M117",
    lineageType: "PATERNAL_YDNA",
    parentClade: "O2",
    definingSnps: ["M117"],
    ageYearsBp: "~6,000 BP",
    originRegion: "Yellow River Valley, China",
    historicalDescription: "Primary founding lineage of Sino-Tibetan populations, linked to the Yangshao and Majiayao Neolithic millet-farming cultures.",
    ancientCultures: ["Yangshao Culture", "Majiayao Culture"],
    highFrequencyModern: ["Northern Han Chinese (20%)", "Tibetans (35%)", "Qiang (40%)", "Burmese (15%)"],
    migrationPath: [
      { order: 1, region: "Yellow River Basin", timePeriod: "6,000 BP", description: "Agricultural expansion southward into Han populations and westward onto the Tibetan Plateau." }
    ]
  },
  {
    code: "C2-F1067",
    shortName: "C2-F1067",
    cladeName: "C2-F1067",
    lineageType: "PATERNAL_YDNA",
    parentClade: "C",
    definingSnps: ["F1067"],
    ageYearsBp: "~8,000 BP",
    originRegion: "Northeast Asia / Manchuria / Mongolia",
    historicalDescription: "Major North Asian and Northeast Asian paternal branch prominent in Mongolic, Tungusic, Manchu, and Korean populations.",
    ancientCultures: ["Hongshan Culture", "Xiongnu Empire", "Mongol Empire"],
    highFrequencyModern: ["Mongolians (25%)", "Manchu (20%)", "Koreans (10%)", "Northern Han (10%)"],
    migrationPath: [
      { order: 1, region: "Liao River & Amur Basin", timePeriod: "8,000 BP", description: "Pastoralist and hunting adaptations across the Eurasian Steppe." }
    ]
  },
  {
    code: "H1a-M82",
    shortName: "H1a-M82",
    cladeName: "H1a-M82",
    lineageType: "PATERNAL_YDNA",
    parentClade: "H",
    definingSnps: ["M82"],
    ageYearsBp: "~9,000 BP",
    originRegion: "Northwest India / Indus Valley",
    historicalDescription: "Dominant South Asian lineage and the signature paternal founder marker of the Romani diaspora across Europe (~50% in European Romani).",
    ancientCultures: ["Indus Valley Civilization", "Medieval Romani Migration"],
    highFrequencyModern: ["Romani / Roma Gypsies (50%)", "Northwest India / Rajasthan (25%)", "Pakistan (15%)"],
    migrationPath: [
      { order: 1, region: "Rajasthan & Punjab", timePeriod: "9,000 BP", description: "Indigenous South Asian development." },
      { order: 2, region: "Middle East to Byzantine Balkans", timePeriod: "1,000 BP", description: "Romani migration into Southeast and Central Europe." }
    ]
  },
  {
    code: "C-M347",
    shortName: "C-M347",
    cladeName: "C1b2b / C-M347",
    lineageType: "PATERNAL_YDNA",
    parentClade: "C",
    definingSnps: ["M347"],
    ageYearsBp: "~45,000 BP",
    originRegion: "Sahul / Ancient Australia",
    historicalDescription: "The predominant indigenous founding paternal lineage of Aboriginal Australians, present continuously in Australia since the initial colonization of Sahul.",
    ancientCultures: ["Aboriginal Australian Dreamtime Cultures"],
    highFrequencyModern: ["Indigenous Aboriginal Australians (60-70%)"],
    migrationPath: [
      { order: 1, region: "Sundaland to Sahul", timePeriod: "50,000 BP", description: "Maritime crossing of Wallacea into ancient Pleistocene Australia." }
    ]
  }
,
{
    code: "R-M222",
    shortName: "R1b-M222",
    cladeName: "R1b1a1a2a1a2c1a1a1 / R-M222",
    lineageType: "PATERNAL_YDNA",
    parentClade: "R1b-L21",
    definingSnps: ["M222"],
    ageYearsBp: "~1,800 BP",
    originRegion: "Northwest Ireland (Donegal, Sligo, Mayo, Derry)",
    historicalDescription: "The iconic Northwest Irish dynasty marker associated with the Uí Néill high kings and the legendary 5th-century High King Niall of the Nine Hostages (~20% in NW Ireland).",
    ancientCultures: ["Early Christian Ireland", "Gaelic Kingdom of Ailech", "Uí Néill Dynasty"],
    highFrequencyModern: ["Northwest Ireland / Donegal (20%)", "Lowland Scotland (10%)", "Irish Diaspora (8%)"],
    migrationPath: [
      { order: 1, region: "Donegal & Ulster", timePeriod: "1,800 BP", description: "Demographic expansion of Gaelic dynastic lines across northern Ireland and western Scotland." }
    ]
  },
  {
    code: "R-L513",
    shortName: "R-L513",
    cladeName: "R-L513",
    lineageType: "PATERNAL_YDNA",
    parentClade: "R1b-L21",
    definingSnps: ["L513"],
    ageYearsBp: "~3,800 BP",
    originRegion: "Scotland & Northern Britain",
    historicalDescription: "Sub-branch of Atlantic Celtic L21 prominent in Scottish Highland and Hebridean clans (Clan Donald, Clan MacQuarrie).",
    ancientCultures: ["Caledonian Tribes", "Kingdom of Dál Riata"],
    highFrequencyModern: ["Scottish Highlands (15%)", "Hebrides", "Ulster"],
    migrationPath: [
      { order: 1, region: "Grampian Highlands & Argyll", timePeriod: "3,800 BP", description: "Bronze Age to Medieval clan settlement." }
    ]
  },
  {
    code: "R-Z195",
    shortName: "R-Z195",
    cladeName: "R-Z195 / SRY2627",
    lineageType: "PATERNAL_YDNA",
    parentClade: "R1b-DF27",
    definingSnps: ["SRY2627"],
    ageYearsBp: "~3,500 BP",
    originRegion: "Pyrenees & Northern Iberia",
    historicalDescription: "Signature Atlantic Bronze Age Iberian lineage, prominent in Basques, Catalans, and Gascons.",
    ancientCultures: ["Atlantic Bronze Age", "Vasconic Tribes"],
    highFrequencyModern: ["Basque Country (35%)", "Catalonia (20%)", "Northern Spain (18%)"],
    migrationPath: [
      { order: 1, region: "Pyrenean Valleys & Ebro Basin", timePeriod: "3,500 BP", description: "Continuous Iberian Bronze Age survival." }
    ]
  },
  {
    code: "R-YP254",
    shortName: "R-YP254",
    cladeName: "R1a-YP254",
    lineageType: "PATERNAL_YDNA",
    parentClade: "R1a-Z280",
    definingSnps: ["YP254"],
    ageYearsBp: "~2,000 BP",
    originRegion: "Central / Eastern Europe (Poland & Carpathians)",
    historicalDescription: "Major West Slavic paternal lineage associated with the Early Medieval Slavic expansion and the historical Polish Piast dynasty horizon.",
    ancientCultures: ["Przeworsk Culture", "Early Slavic Horizons"],
    highFrequencyModern: ["Poland (25%)", "Slovakia (20%)", "Czech Republic (15%)"],
    migrationPath: [
      { order: 1, region: "Vistula & Oder Basins", timePeriod: "2,000 BP", description: "Early Medieval Slavic demographic expansion." }
    ]
  },
  {
    code: "R-Z284",
    shortName: "R-Z284",
    cladeName: "R1a-Z284",
    lineageType: "PATERNAL_YDNA",
    parentClade: "R1a-M417",
    definingSnps: ["Z284"],
    ageYearsBp: "~4,200 BP",
    originRegion: "Scandinavia (Norway & Sweden)",
    historicalDescription: "The definitive Scandinavian Viking R1a branch (~20% in Norway), carried across the Danelaw in England, the Scottish Isles, and Iceland during Viking raids.",
    ancientCultures: ["Nordic Bronze Age", "Viking Age Clans"],
    highFrequencyModern: ["Norway (22%)", "Sweden (15%)", "Shetland & Orkney (12%)", "Iceland (15%)"],
    migrationPath: [
      { order: 1, region: "Norwegian Fjords & Western Sweden", timePeriod: "4,200 BP", description: "Nordic Bronze Age to Viking sea-voyages." }
    ]
  },
  {
    code: "R-L657",
    shortName: "R-L657",
    cladeName: "R1a-L657",
    lineageType: "PATERNAL_YDNA",
    parentClade: "R1a-Z93",
    definingSnps: ["L657"],
    ageYearsBp: "~4,000 BP",
    originRegion: "Central Asia to Northern India",
    historicalDescription: "Major Indo-Aryan branch associated with the southward migration of Sintashta/Andronovo steppe pastoralists into the Punjab and Gangetic plain.",
    ancientCultures: ["Sintashta Culture", "Vedic Civilization", "Painted Grey Ware"],
    highFrequencyModern: ["Northern India / Brahmins (up to 40%)", "Pakistan (25%)", "Bangladesh (15%)"],
    migrationPath: [
      { order: 1, region: "Bactria-Margiana to Indus Basin", timePeriod: "3,800 BP", description: "Vedic Sanskrit expansion across North India." }
    ]
  },
  {
    code: "R-Z2124",
    shortName: "R-Z2124",
    cladeName: "R1a-Z2124",
    lineageType: "PATERNAL_YDNA",
    parentClade: "R1a-Z93",
    definingSnps: ["Z2124"],
    ageYearsBp: "~4,200 BP",
    originRegion: "Eurasian Steppe (Kazakhstan / Southern Urals)",
    historicalDescription: "Signature paternal lineage of the ancient Scythians, Saka, and Sarmatian nomadic equestrian warriors.",
    ancientCultures: ["Andronovo Culture", "Scythian Nomads", "Saka Kings"],
    highFrequencyModern: ["Kyrgyz (60%)", "Pashtuns (35%)", "Tatars (25%)", "Tajiks (30%)"],
    migrationPath: [
      { order: 1, region: "Kazakh Steppe & Altai Mountains", timePeriod: "4,000 BP", description: "Nomadic pastoralist horse-riding expansion across the Silk Road steppe corridor." }
    ]
  },
  {
    code: "I-DF29",
    shortName: "I-DF29",
    cladeName: "I1a / I-DF29",
    lineageType: "PATERNAL_YDNA",
    parentClade: "I1-M253",
    definingSnps: ["DF29"],
    ageYearsBp: "~4,500 BP",
    originRegion: "Scandinavia (Denmark / Southern Sweden)",
    historicalDescription: "The predominant pan-Scandinavian founder lineage accounting for over 95% of living I1 men today.",
    ancientCultures: ["Nordic Stone Age", "Germanic Iron Age", "Vikings"],
    highFrequencyModern: ["Sweden (35%)", "Norway (30%)", "Denmark (30%)", "Finland (28%)"],
    migrationPath: [
      { order: 1, region: "Jutland & Scania", timePeriod: "4,500 BP", description: "Post-bottleneck demographic boom in Scandinavia." }
    ]
  },
  {
    code: "I-PH908",
    shortName: "I-PH908",
    cladeName: "I2a-Dinaric (I-PH908)",
    lineageType: "PATERNAL_YDNA",
    parentClade: "I2a",
    definingSnps: ["PH908"],
    ageYearsBp: "~1,800 BP",
    originRegion: "Carpathian Mountains to Dinaric Alps",
    historicalDescription: "The predominant South Slavic paternal marker (~50-70% in Herzegovina, Bosnia, and Dalmatia) tracking the 6th-century Slavic migration into the Balkans.",
    ancientCultures: ["Early Slavic Balkan Settlement"],
    highFrequencyModern: ["Herzegovina (70%)", "Bosnia (55%)", "Croatia (40%)", "Serbia (35%)"],
    migrationPath: [
      { order: 1, region: "Dinaric Mountain Corridor", timePeriod: "1,500 BP", description: "Rapid demographic expansion across the Western Balkans." }
    ]
  },
  {
    code: "E-CTS608",
    shortName: "E-CTS608",
    cladeName: "E-CTS608",
    lineageType: "PATERNAL_YDNA",
    parentClade: "E-U290",
    definingSnps: ["CTS608"],
    ageYearsBp: "~2,500 BP",
    originRegion: "Gold Coast (Ghana / Ivory Coast)",
    historicalDescription: "Prominent West African Akan, Ashanti, and Fante paternal lineage frequently identified in African American and Caribbean genealogies.",
    ancientCultures: ["Ashanti Empire", "Bono State"],
    highFrequencyModern: ["Ghana (35%)", "Ivory Coast (20%)", "African Americans (15%)", "Jamaica (18%)"],
    migrationPath: [
      { order: 1, region: "Pra and Volta Basins, Ghana", timePeriod: "2,500 BP", description: "Gold Coast agricultural development and Transatlantic diaspora." }
    ]
  },
  {
    code: "E-Z1707",
    shortName: "E-Z1707",
    cladeName: "E-Z1707",
    lineageType: "PATERNAL_YDNA",
    parentClade: "E-U290",
    definingSnps: ["Z1707"],
    ageYearsBp: "~2,200 BP",
    originRegion: "Bight of Biafra (Southeastern Nigeria / Cross River)",
    historicalDescription: "Key lineage of Igbo, Efik, and Ibibio populations of southeastern Nigeria; major ancestral component of the Virginia/Maryland and Caribbean diaspora.",
    ancientCultures: ["Kingdom of Nri", "Calabar Trading States"],
    highFrequencyModern: ["Igbo (45%)", "Efik (40%)", "African Americans (20%)"],
    migrationPath: [
      { order: 1, region: "Lower Niger & Cross River", timePeriod: "2,200 BP", description: "Agricultural and metallurgy center in southeastern Nigeria." }
    ]
  },
  {
    code: "E-M34",
    shortName: "E-M34",
    cladeName: "E1b1b1b2a / E-M34",
    lineageType: "PATERNAL_YDNA",
    parentClade: "E1b1b",
    definingSnps: ["M34"],
    ageYearsBp: "~7,000 BP",
    originRegion: "Levant & Eastern Mediterranean",
    historicalDescription: "Key Near Eastern / Levantine and Mediterranean lineage; confirmed patrilineage of Napoleon Bonaparte and frequent in Ashkenazi/Sephardic Jewish populations.",
    ancientCultures: ["Levantine Neolithic", "Canaanite & Phoenician City-States"],
    highFrequencyModern: ["Levant / Jordan / Palestine (15%)", "Sephardic Jews (12%)", "Corsica & Sicily (8%)"],
    migrationPath: [
      { order: 1, region: "Fertile Crescent & Mediterranean Coast", timePeriod: "7,000 BP", description: "Maritime trade and Neolithic agricultural expansion." }
    ]
  },
  {
    code: "J-P58",
    shortName: "J-P58",
    cladeName: "J1a2a1a / J-P58",
    lineageType: "PATERNAL_YDNA",
    parentClade: "J1-M267",
    definingSnps: ["P58"],
    ageYearsBp: "~5,500 BP",
    originRegion: "Arabian Peninsula & Southern Levant",
    historicalDescription: "The predominant Semitic paternal lineage in the Arabian Peninsula (>70% in Bedouin populations) and the primary carrier of the Y-chromosomal Aaron / Cohen Modal Haplotype.",
    ancientCultures: ["Arabian Bronze Age", "Nabataean Kingdom", "Ancient Israelites"],
    highFrequencyModern: ["Yemen (75%)", "Saudi Arabia (65%)", "Bedouin (70%)", "Cohanim / Jewish Priesthood (50%)"],
    migrationPath: [
      { order: 1, region: "Arabian Desert & Red Sea Coast", timePeriod: "5,500 BP", description: "Pastoralist expansion and Semitic language dispersal." }
    ]
  },
  {
    code: "G-L91",
    shortName: "G-L91",
    cladeName: "G2a2a1 / G-L91",
    lineageType: "PATERNAL_YDNA",
    parentClade: "G",
    definingSnps: ["L91"],
    ageYearsBp: "~8,000 BP",
    originRegion: "Anatolia & Alpine Europe / Sardinia / Corsica",
    historicalDescription: "The definitive Early European Farmer paternal lineage confirmed in Ötzi the Iceman (~5,300 BP in the Ötztal Alps) and modern Sardinians.",
    ancientCultures: ["Cardial Pottery Culture", "Ötzi the Iceman (Tyrol)", "Early European Farmers"],
    highFrequencyModern: ["Sardinia (15%)", "Corsica (12%)", "Tyrolean Alps (rare surviving)"],
    migrationPath: [
      { order: 1, region: "Anatolia to Alpine Europe", timePeriod: "8,000 BP", description: "Early agricultural migration across the Mediterranean basin." }
    ]
  },
];

export const MT_DNA_HAPLOGROUPS: HaplogroupDefinition[] = [
  // ── Root: L0 — Mitochondrial Eve / Khoisan
  {
    code: "L0",
    shortName: "Haplogroup L0 (Mitochondrial Eve / Khoisan)",
    cladeName: "mtDNA-L0",
    lineageType: "MATERNAL_MTDNA",
    parentClade: null,
    definingSnps: ["146C", "16129A", "mt4312", "mt10664"],
    ageYearsBp: "~150,000 - 200,000 BP",
    originRegion: "Southern / Eastern Africa",
    historicalDescription: "Root maternal lineage — the matrilineal most recent common ancestor of all living humans (Mitochondrial Eve). Highest frequency in San / Khoisan hunter-gatherers of the Kalahari.",
    ancientCultures: ["Early Anatomically Modern Humans"],
    highFrequencyModern: ["San / Khoisan (70-90%)", "Southern Africa", "East Africa"],
    migrationPath: [
      { order: 1, region: "Kalahari / Southern Africa", timePeriod: "150,000 BP", description: "Deepest human maternal divergence — the root of the mitochondrial tree." }
    ]
  },
  // ── L1: Central / West African basal clade
  {
    code: "L1",
    shortName: "Haplogroup L1 (Central African Basal)",
    cladeName: "mtDNA-L1",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L0",
    definingSnps: ["3666A", "7055A"],
    ageYearsBp: "~120,000 BP",
    originRegion: "Central / West Africa",
    historicalDescription: "Basal maternal clade primarily found in Central and West African forest populations, Pygmy hunter-gatherers, and some Bantu groups.",
    ancientCultures: ["Central African Hunter-Gatherers", "Pygmy Groups"],
    highFrequencyModern: ["Central Africa Pygmies (60%)", "Cameroon (20%)", "West Africa (10%)"],
    migrationPath: [
      { order: 1, region: "Central African Rainforest", timePeriod: "120,000 BP", description: "Diversification of deep African maternal lineages." }
    ]
  },
  // ── L2: West African & African-American
  {
    code: "L2",
    shortName: "Haplogroup L2 (West & Central African)",
    cladeName: "mtDNA-L2",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L0",
    definingSnps: ["13590A", "16278T", "mt143", "mt789"],
    ageYearsBp: "~90,000 BP",
    originRegion: "West / Central Africa",
    historicalDescription: "Most widespread maternal haplogroup across sub-Saharan Africa, prominent in African Americans through the transatlantic period.",
    ancientCultures: ["Bantu Expansion", "West African Neolithic"],
    highFrequencyModern: ["West Africa (30-40%)", "Central Africa (35%)", "African Americans (~30%)"],
    migrationPath: [
      { order: 1, region: "West Africa", timePeriod: "90,000 BP", description: "Expansion across tropical and savannah zones." }
    ]
  },
  // ── L2a: Most common L2 subclade
  {
    code: "L2a",
    shortName: "Haplogroup L2a (Dominant West African subclade)",
    cladeName: "mtDNA-L2a",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L2",
    definingSnps: ["15950G"],
    ageYearsBp: "~60,000 BP",
    originRegion: "West Africa / Guinea Coast",
    historicalDescription: "The most frequent L2 branch, dominant in Guinea, Nigeria, Ghana. A major founding lineage among African Americans via the transatlantic slave trade.",
    ancientCultures: ["Yoruba / Igbo Ancestry"],
    highFrequencyModern: ["West Africa Guinea Coast (40-50%)", "African Americans (25%)"],
    migrationPath: [
      { order: 1, region: "Guinea-Nigeria Corridor", timePeriod: "60,000 BP", description: "Expansion of L2a across the West African coastal belt." }
    ]
  },
  // ── L2a1: subclade of L2a (corrected from L3)
  {
    code: "L2a1",
    shortName: "Haplogroup L2a1",
    cladeName: "mtDNA-L2a1",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L2a",
    definingSnps: ["3594T"],
    ageYearsBp: "~40,000 BP",
    originRegion: "West Africa",
    historicalDescription: "Prominent L2a subclade found in Nigerian and Ghanaian populations and in significant proportions of African Americans.",
    ancientCultures: ["West African Agricultural Communities"],
    highFrequencyModern: ["Nigeria (15%)", "Ghana (12%)", "African Americans (8%)"],
    migrationPath: [
      { order: 1, region: "West Africa", timePeriod: "40,000 BP", description: "L2a1 subclade expansion across West African farming communities." }
    ]
  },
  // ── L3: Out of Africa Ancestor
  {
    code: "L3",
    shortName: "Haplogroup L3 (Out of Africa Maternal Ancestor)",
    cladeName: "mtDNA-L3",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L0",
    definingSnps: ["769A", "1018A", "mt7256", "mt13650"],
    ageYearsBp: "~70,000 BP",
    originRegion: "East Africa (Horn of Africa)",
    historicalDescription: "Direct maternal ancestor to haplogroups M and N, which encompass every maternal lineage found outside of Africa.",
    ancientCultures: ["Out of Africa Migration Pioneers"],
    highFrequencyModern: ["Horn of Africa (Ethiopia, Somalia 30-40%)", "East Africa"],
    migrationPath: [
      { order: 1, region: "Horn of Africa", timePeriod: "70,000 BP", description: "Maternal lineage crossing into Eurasia giving rise to clades M and N." }
    ]
  },
  // ── M: Macrohaplogroup
  {
    code: "M",
    shortName: "Macrohaplogroup M (Eurasian / Asian / Indigenous American)",
    cladeName: "mtDNA-M",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L3",
    definingSnps: ["489C", "10400T", "16311C", "mt14783", "mt15043"],
    ageYearsBp: "~60,000 BP",
    originRegion: "South Asia / Coastal Eurasia",
    historicalDescription: "Major Eurasian founder clade. Dominant in South Asia and East Asia, giving rise to C, D, G, Z branches in Asia and the Americas.",
    ancientCultures: ["Southern Coastal Dispersal"],
    highFrequencyModern: ["India (60%)", "East Asia (50%)", "Indigenous Americans (C, D clades)"],
    migrationPath: [
      { order: 1, region: "Indian Ocean Rim", timePeriod: "60,000 BP", description: "Rapid coastal migration towards Sundaland and East Asia." }
    ]
  },
  // ── M7: Japan / East Asia
  {
    code: "M7",
    shortName: "Haplogroup M7 (East Asian / Japanese)",
    cladeName: "mtDNA-M7",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "M",
    definingSnps: ["4312C"],
    ageYearsBp: "~35,000 BP",
    originRegion: "East Asia / Japan",
    historicalDescription: "Prominent in Japan, Korea and Southeast Asia. Important for discriminating from D and C subclades of M.",
    ancientCultures: ["Jomon Japan", "Early East Asian Foragers"],
    highFrequencyModern: ["Japan (15%)", "Korea (8%)", "SE Asia (10%)"],
    migrationPath: [
      { order: 1, region: "East Asian Rim", timePeriod: "35,000 BP", description: "Coastal expansion across East Asia and the Japanese archipelago." }
    ]
  },
  // ── M8: Ancestor of C and Z
  {
    code: "M8",
    shortName: "Haplogroup M8 (Ancestor of C and Z)",
    cladeName: "mtDNA-M8",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "M",
    definingSnps: ["9824C"],
    ageYearsBp: "~40,000 BP",
    originRegion: "Northeast Asia / Siberia",
    historicalDescription: "Intermediate clade bridging M to haplogroups C and Z — critical node for Siberian and Native American classification.",
    ancientCultures: ["Northern Siberian Hunter-Gatherers"],
    highFrequencyModern: ["Ancestral to C and Z subclades"],
    migrationPath: [
      { order: 1, region: "Northeast Asia / Siberia", timePeriod: "40,000 BP", description: "Diversification of C and Z Siberian branches." }
    ]
  },
  // ── M9
  {
    code: "M9",
    shortName: "Haplogroup M9",
    cladeName: "mtDNA-M9",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "M",
    definingSnps: ["4715C"],
    ageYearsBp: "~38,000 BP",
    originRegion: "Central / Southeast Asia",
    historicalDescription: "Ancestor to haplogroup E and related Q-branch subclades prevalent in SE Asia and the Pacific.",
    ancientCultures: ["SE Asian Early Foragers"],
    highFrequencyModern: ["SE Asia (5%)", "Pacific Islands (5%)"],
    migrationPath: [
      { order: 1, region: "SE Asia", timePeriod: "38,000 BP", description: "Diversification towards Pacific island-hopping peoples." }
    ]
  },
  // ── C: Siberian / Native American founding lineage
  {
    code: "C",
    shortName: "Haplogroup C (Siberian / Indigenous American Founder)",
    cladeName: "mtDNA-C",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "M8",
    definingSnps: ["13263G", "11969A"],
    ageYearsBp: "~30,000 BP",
    originRegion: "Siberia / Northeast Asia",
    historicalDescription: "One of the five founding maternal lineages of Indigenous Americans. Also common in Altaic and Turkic Siberian groups.",
    ancientCultures: ["Clovis Culture", "Ancient Beringians", "Nenets / Evenks"],
    highFrequencyModern: ["Siberians (15-25%)", "Native North Americans (30-40%)", "Mongolians (10%)"],
    migrationPath: [
      { order: 1, region: "Lake Baikal / Siberia", timePeriod: "25,000 BP", description: "Cold-adapted Siberian ancestral populations." },
      { order: 2, region: "Bering Land Bridge / Americas", timePeriod: "16,000 BP", description: "One of the founding maternal clades crossing into the Americas." }
    ]
  },
  // ── Z: Siberian / Manchu / NE Asian
  {
    code: "Z",
    shortName: "Haplogroup Z (Siberian / Manchu NE Asian)",
    cladeName: "mtDNA-Z",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "M8",
    definingSnps: ["15784C"],
    ageYearsBp: "~20,000 BP",
    originRegion: "Northeast Asia / Manchuria",
    historicalDescription: "Sibling to haplogroup C. Found at low but consistent frequency across northeastern Asia including Koreans, Manchu, and Saami.",
    ancientCultures: ["Manchurian Nomads"],
    highFrequencyModern: ["Saami (12%)", "Korea (2-3%)", "Manchu / Tungusic (5%)"],
    migrationPath: [
      { order: 1, region: "Manchuria / NE China", timePeriod: "20,000 BP", description: "Z expansion across the northeastern Asian taiga." }
    ]
  },
  // ── D: Root (D*, D5 classification)
  {
    code: "D",
    shortName: "Haplogroup D (Siberian / East Asian Root)",
    cladeName: "mtDNA-D",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "M",
    definingSnps: ["2092C", "4883T"],
    ageYearsBp: "~45,000 BP",
    originRegion: "Northeast Asia / Central Siberia",
    historicalDescription: "Root clade to D4 and D5. Broad D* samples and the D5 subclade (Japanese, Korean) need the root markers for correct classification.",
    ancientCultures: ["Ancient Northern East Asians"],
    highFrequencyModern: ["Ancestral to D4 and D5 subclades"],
    migrationPath: [
      { order: 1, region: "Central Siberia", timePeriod: "45,000 BP", description: "Basal D diversification into D4 and D5 branches." }
    ]
  },
  // ── D4: East Asian / Siberian subclade
  {
    code: "D4",
    shortName: "Haplogroup D4 (East Asian / Siberian)",
    cladeName: "mtDNA-D4",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "D",
    definingSnps: ["8414T", "14668T", "mt3010"],
    ageYearsBp: "~28,000 BP",
    originRegion: "Northern East Asia / Southern Siberia",
    historicalDescription: "One of the most widespread maternal lineages in East Asia and Siberia. Subclades are also ancestral to Indigenous American haplogroup D lineages.",
    ancientCultures: ["Baikal Hunter-Gatherers", "Ancient Northern East Asians", "Jomon & Yayoi Japan"],
    highFrequencyModern: ["Northern Han Chinese (25-30%)", "Japanese (35%)", "Koreans (30%)", "Mongolians (25%)", "Siberians (30%)"],
    migrationPath: [
      { order: 1, region: "Northern China / Siberia", timePeriod: "28,000 BP", description: "Cold adaptation in Mammoth steppe environments." },
      { order: 2, region: "Japanese Archipelago & Yellow River", timePeriod: "10,000 BP", description: "Yayoi agricultural diffusion and Yayoi-Jomon admixture." }
    ]
  },
  // ── N: Macrohaplogroup
  {
    code: "N",
    shortName: "Macrohaplogroup N",
    cladeName: "mtDNA-N",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L3",
    definingSnps: ["8701G", "10398G", "150C", "10238C", "mt9540", "mt10873", "mt15301"],
    ageYearsBp: "~60,000 BP",
    originRegion: "Near East / South Asia",
    historicalDescription: "Parent to haplogroup R, which includes almost all European maternal lineages (H, V, J, T, U, K) as well as A, B, X, W, I.",
    ancientCultures: ["Early Eurasian Pioneers"],
    highFrequencyModern: ["Found across all non-African populations via daughter clades"],
    migrationPath: [
      { order: 1, region: "Near East / Anatolia", timePeriod: "60,000 BP", description: "Settlement of West Eurasia and diversification of haplogroup R." }
    ]
  },
  // ── X: Native American X2a + European Relic
  {
    code: "X",
    shortName: "Haplogroup X (Native American X2a & European Relic)",
    cladeName: "mtDNA-X",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "N",
    definingSnps: ["6371T", "14470C"],
    ageYearsBp: "~30,000 BP",
    originRegion: "Near East / Central Asia",
    historicalDescription: "One of the five Indigenous American founding clades (X2a). Also found in low frequencies in the Near East and Europe. Often mislabelled as U or N* without proper diagnostic markers.",
    ancientCultures: ["Clovis Culture Horizon", "Ancient Near Eastern Populations"],
    highFrequencyModern: ["Algonquin / Ojibwe (~25%)", "Druze (10%)", "Basques (3%)", "Near East (3-5%)"],
    migrationPath: [
      { order: 1, region: "Near East / Altai", timePeriod: "20,000 BP", description: "Trans-Eurasian migration of X2a clade into North America." },
      { order: 2, region: "North America (Great Lakes)", timePeriod: "14,000 BP", description: "X2a establishing presence in Algonquin and Ojibwe peoples." }
    ]
  },
  // ── HV: Ancestor of H and V (critical root node)
  {
    code: "HV",
    shortName: "Haplogroup HV (Ancestral to H and V)",
    cladeName: "mtDNA-HV",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "N",
    definingSnps: ["14766C"],
    ageYearsBp: "~30,000 BP",
    originRegion: "Near East / Caucasus",
    historicalDescription: "Basal ancestor to the H and V haplogroups. This intermediate node is critical for correct H/V classification — without it, H and V share no distinguishing root.",
    ancientCultures: ["Epipaleolithic Near East"],
    highFrequencyModern: ["Caucasus (HV0 ~5%)", "Near East (HV1 ~3%)", "Ancestral to H & V"],
    migrationPath: [
      { order: 1, region: "Caucasus / Near East", timePeriod: "30,000 BP", description: "Divergence of HV from N lineage, preceding H and V separation." }
    ]
  },
  // ── H: Helena (most common European maternal)
  {
    code: "H",
    shortName: "Haplogroup H (Helena — Queen of Europe)",
    cladeName: "mtDNA-H",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "HV",
    definingSnps: ["2706G", "7028C"],
    ageYearsBp: "~25,000 BP",
    originRegion: "Near East / Caucasus / Southern Europe",
    historicalDescription: "The single most common maternal lineage in modern Europe (~40-50% of all Europeans). Expanded massively from Ice Age refuges and during the Neolithic/Bronze Age.",
    ancientCultures: ["Epigravettian", "Bell Beaker", "Unetice", "Cardial Farmers"],
    highFrequencyModern: ["Spain / Basque (45-50%)", "United Kingdom (45%)", "Scandinavia (42%)", "Germany (43%)", "France (45%)"],
    migrationPath: [
      { order: 1, region: "Near East & Anatolia", timePeriod: "25,000 BP", description: "Divergence from HV stem." },
      { order: 2, region: "Iberian & Balkan Refuges", timePeriod: "18,000 BP", description: "Expansion across Western Europe after Ice Age retreat." }
    ]
  },
  // ── H1
  {
    code: "H1",
    shortName: "H1 (Western European Matriarch)",
    cladeName: "mtDNA-H1",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "H",
    definingSnps: ["3010A", "16189C"],
    ageYearsBp: "~13,000 BP",
    originRegion: "Franco-Cantabrian Refuge (Iberia / Southwest France)",
    historicalDescription: "Most frequent single subclade in Western Europe, expanding across the continent following the retreat of the glaciers.",
    ancientCultures: ["Magdalenian", "Megalithic Builders", "Celtic & Germanic Peoples"],
    highFrequencyModern: ["Basque Country (30%)", "Galicia & Portugal (25-30%)", "Norway (25%)", "British Isles (20-25%)"],
    migrationPath: [
      { order: 1, region: "Pyrenees & Bay of Biscay", timePeriod: "13,000 BP", description: "Rapid post-glacial demographic expansion." },
      { order: 2, region: "Atlantic Seaboard & Scandinavia", timePeriod: "8,000 BP", description: "Integration into early European farming and megalithic communities." }
    ]
  },
  // ── H2
  {
    code: "H2",
    shortName: "H2 (Eastern & Central European)",
    cladeName: "mtDNA-H2",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "H",
    definingSnps: ["1438A", "mt4769"],
    ageYearsBp: "~15,000 BP",
    originRegion: "Near East / Anatolia",
    historicalDescription: "Associated with early Neolithic farming expansions into Central Europe and the Mediterranean basin.",
    ancientCultures: ["Linear Pottery (LBK)", "Vinča Culture"],
    highFrequencyModern: ["Sardinia (8%)", "Central Europe (5-8%)", "Levant (4%)"],
    migrationPath: [
      { order: 1, region: "Anatolia to Balkans", timePeriod: "9,000 BP", description: "Neolithic agricultural dispersal." }
    ]
  },
  // ── H3
  {
    code: "H3",
    shortName: "H3 (Atlantic / Iberian)",
    cladeName: "mtDNA-H3",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "H",
    definingSnps: ["6776C"],
    ageYearsBp: "~11,000 BP",
    originRegion: "Iberia / Western Mediterranean",
    historicalDescription: "Second most common H branch in Western Europe, especially enriched in the Basque Country and Sardinia.",
    ancientCultures: ["Cardial Pottery", "Nuragic Sardinia", "Atlantic Bronze Age"],
    highFrequencyModern: ["Sardinia (18%)", "Basques (14%)", "Portugal (12%)", "Ireland (10%)"],
    migrationPath: [
      { order: 1, region: "Iberia & Western Mediterranean", timePeriod: "11,000 BP", description: "Maritime and coastal foraging and early pastoralism." }
    ]
  },
  // ── V: Post-LGM Iberian / Scandinavian
  {
    code: "V",
    shortName: "Haplogroup V (Post-LGM Iberian / Scandinavian)",
    cladeName: "mtDNA-V",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "HV",
    definingSnps: ["4580A", "15904T"],
    ageYearsBp: "~15,000 BP",
    originRegion: "Iberia / Southwest France (Glacial Refuge)",
    historicalDescription: "Associated with post-Last Glacial Maximum re-colonization of Scandinavia and northern Europe from the Iberian refugium. Particularly common in the Saami and Basques.",
    ancientCultures: ["Magdalenian Ice Age Survivors", "Post-Glacial Scandinavian Recolonizers"],
    highFrequencyModern: ["Saami (42%)", "Basques (10%)", "Norway (7%)", "Finland (5%)", "Spain (5%)"],
    migrationPath: [
      { order: 1, region: "Franco-Cantabrian Refuge", timePeriod: "15,000 BP", description: "Survival in Iberian ice-age refugium." },
      { order: 2, region: "Scandinavia & Baltic", timePeriod: "10,000 BP", description: "Post-glacial rapid northward expansion colonizing deglaciated Scandinavia." }
    ]
  },
  // ── W: South Asian / European N subclade
  {
    code: "W",
    shortName: "Haplogroup W (South Asian / NE European)",
    cladeName: "mtDNA-W",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "N",
    definingSnps: ["8994A", "7472T"],
    ageYearsBp: "~25,000 BP",
    originRegion: "South Asia / West Asia",
    historicalDescription: "Found in South Asia and at lower frequencies in the Near East and Eastern Europe. Represents an ancient N-derived lineage that entered South Asia from West Asia.",
    ancientCultures: ["Early South Asian Foragers"],
    highFrequencyModern: ["Pakistan / NW India (5-10%)", "Caucasus (4%)", "NE Europe (3%)"],
    migrationPath: [
      { order: 1, region: "West Asia / South Asia", timePeriod: "25,000 BP", description: "W expansion through the Iranian Plateau into the Indian subcontinent." }
    ]
  },
  // ── I: Northern European / Saami-associated
  {
    code: "I",
    shortName: "Haplogroup I (Northern European Relic)",
    cladeName: "mtDNA-I",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "N",
    definingSnps: ["10034C"],
    ageYearsBp: "~30,000 BP",
    originRegion: "Near East / Eastern Europe",
    historicalDescription: "An ancient N subclade found at low frequency across Europe. Associated with early European hunter-gatherers and remnant Near Eastern populations.",
    ancientCultures: ["Gravettian Hunter-Gatherers"],
    highFrequencyModern: ["Northern Europe 1-3%", "Near East (2%)", "Saami (5%)"],
    migrationPath: [
      { order: 1, region: "Near East to Eastern Europe", timePeriod: "25,000 BP", description: "Westward spread of I with early European hunter-gatherers." }
    ]
  },
  // ── U: Upper Paleolithic European Hunter-Gatherer root
  {
    code: "U",
    shortName: "Haplogroup U (Ancient Hunter-Gatherer)",
    cladeName: "mtDNA-U",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "N",
    definingSnps: ["12308G", "12372A", "mt1811"],
    ageYearsBp: "~45,000 BP",
    originRegion: "Near East / Europe",
    historicalDescription: "One of the oldest maternal lineages in Europe. Subclade U5 was the dominant maternal lineage of Western European Mesolithic hunter-gatherers (WHG).",
    ancientCultures: ["Aurignacian", "Gravettian", "Western Hunter-Gatherers (WHG)", "Cheddar Man"],
    highFrequencyModern: ["Scandinavia (U5 in Saami ~50%)", "Baltic States (15-20%)", "Caucasus (U4/U7)", "India (U2/U7)"],
    migrationPath: [
      { order: 1, region: "Balkans & Western Europe", timePeriod: "45,000 BP", description: "Upper Paleolithic colonization of ice-age Europe." }
    ]
  },
  // ── U2: South Asian subclade
  {
    code: "U2",
    shortName: "Haplogroup U2 (South Asian)",
    cladeName: "mtDNA-U2",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "U",
    definingSnps: ["1811G"],
    ageYearsBp: "~35,000 BP",
    originRegion: "South Asia / Subcontinent",
    historicalDescription: "Primarily found in South Asia (India, Pakistan), thought to represent a very early migration from the Near East into the Indian subcontinent.",
    ancientCultures: ["Early Indian Subcontinent Foragers"],
    highFrequencyModern: ["India (5-10%)", "Pakistan (5%)", "Bangladesh (4%)"],
    migrationPath: [
      { order: 1, region: "Near East to Subcontinent", timePeriod: "35,000 BP", description: "U2 colonization of South Asia." }
    ]
  },
  // ── U3: Middle East / Caucasus
  {
    code: "U3",
    shortName: "Haplogroup U3 (Middle East / Caucasus)",
    cladeName: "mtDNA-U3",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "U",
    definingSnps: ["14577C"],
    ageYearsBp: "~22,000 BP",
    originRegion: "Near East / Caucasus / Eastern Mediterranean",
    historicalDescription: "Present across the Caucasus, Near East, and Eastern Mediterranean. Traces to early Near Eastern populations.",
    ancientCultures: ["Epipaleolithic Levant"],
    highFrequencyModern: ["Caucasus (5%)", "Iran (4%)", "Turkey (3%)", "SE Europe (3%)"],
    migrationPath: [
      { order: 1, region: "Near East / Caucasus", timePeriod: "22,000 BP", description: "U3 spread across the Caucasus and Eastern Mediterranean." }
    ]
  },
  // ── U4: Northeast European / Central Asian
  {
    code: "U4",
    shortName: "Haplogroup U4 (Northeast European / Steppe)",
    cladeName: "mtDNA-U4",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "U",
    definingSnps: ["4646C"],
    ageYearsBp: "~25,000 BP",
    originRegion: "Northeast Europe / Central Asia",
    historicalDescription: "Found in Northeast European and Central Asian populations. Detected in Bronze Age Yamnaya steppe pastoralists.",
    ancientCultures: ["Yamnaya Steppe Pastoralists", "Corded Ware"],
    highFrequencyModern: ["Russia / Northern Europe (5%)", "Central Asia (4%)", "Finland (3%)"],
    migrationPath: [
      { order: 1, region: "NE Europe / Ural Region", timePeriod: "15,000 BP", description: "U4 spread across Northern Eurasia and Bronze Age steppe." }
    ]
  },
  // ── U5 (intermediate before U5b)
  {
    code: "U5",
    shortName: "Haplogroup U5 (WHG Ancestor)",
    cladeName: "mtDNA-U5",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "U",
    definingSnps: ["3197C"],
    ageYearsBp: "~30,000 BP",
    originRegion: "Europe (Pre-LGM)",
    historicalDescription: "The Mesolithic European maternal clade dominating Western European hunter-gatherers before the Neolithic farming transition. Required intermediate before classifying U5b.",
    ancientCultures: ["Pre-LGM European Hunter-Gatherers"],
    highFrequencyModern: ["Ancestral to U5a and U5b subclades"],
    migrationPath: [
      { order: 1, region: "Europe", timePeriod: "30,000 BP", description: "U5 establishing dominance across Ice Age Europe." }
    ]
  },
  // ── U5b: Cheddar Man / WHG
  {
    code: "U5b",
    shortName: "U5b (Mesolithic European Hunter-Gatherer)",
    cladeName: "mtDNA-U5b",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "U5",
    definingSnps: ["7768G", "16270T", "mt14182", "mt150"],
    ageYearsBp: "~22,000 BP",
    originRegion: "Southwestern Europe (Franco-Cantabrian Ice Age Refuge)",
    historicalDescription: "Iconic maternal lineage of post-glacial European hunter-gatherers, found in Cheddar Man and ancient burials across France, Spain, and Britain.",
    ancientCultures: ["Magdalenian", "Azilian", "Mesolithic Britain / Cheddar Man"],
    highFrequencyModern: ["Saami of Lapland (50%)", "Basques (15%)", "Finns (10%)", "Northern & Western Europe (8-12%)"],
    migrationPath: [
      { order: 1, region: "Franco-Cantabrian Caves", timePeriod: "20,000 BP", description: "Survival through the Last Glacial Maximum." },
      { order: 2, region: "Deglaciated Northern Europe", timePeriod: "11,000 BP", description: "Pioneering recolonization of Britain, Scandinavia, and the Baltic." }
    ]
  },
  // ── U7: Iran / Arabian Peninsula
  {
    code: "U7",
    shortName: "Haplogroup U7 (Iran / Arabia / South Asia)",
    cladeName: "mtDNA-U7",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "U",
    definingSnps: ["5999C"],
    ageYearsBp: "~18,000 BP",
    originRegion: "Iran / Arabian Peninsula",
    historicalDescription: "Found across Iran, the Arabian Peninsula, and India. Traces to early populations in the Iranian Plateau and Arabian refugia during the Last Glacial Maximum.",
    ancientCultures: ["Arabian Peninsula Foragers", "Iranian Plateau Early Populations"],
    highFrequencyModern: ["Iran (5%)", "Pakistan (4%)", "UAE / Arabia (4%)"],
    migrationPath: [
      { order: 1, region: "Iranian Plateau / Arabian Gulf", timePeriod: "18,000 BP", description: "U7 expansion from Persian Gulf refugia." }
    ]
  },
  // ── J1c: Neolithic Farming Expansion (Jasmine)
  {
    code: "J1c",
    shortName: "J1c (Jasmine — Neolithic Farming Expansion)",
    cladeName: "mtDNA-J1c",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "N",
    definingSnps: ["14798C", "16069T", "mt185", "mt295", "mt462"],
    ageYearsBp: "~15,000 BP",
    originRegion: "Near East / Fertile Crescent",
    historicalDescription: "Carried across Europe by early Neolithic farmers bringing agriculture, pottery, and animal husbandry into Central and Northern Europe.",
    ancientCultures: ["Linear Pottery (LBK)", "Starčevo–Körös", "Ancient Near Eastern Agronomists"],
    highFrequencyModern: ["Central Europe (8-12%)", "British Isles (8%)", "Scandinavia (7%)", "Near East (10%)"],
    migrationPath: [
      { order: 1, region: "Fertile Crescent", timePeriod: "12,000 BP", description: "Domestication of emmer wheat and goats." },
      { order: 2, region: "Danube River Valley", timePeriod: "7,500 BP", description: "Rapid spread of LBK farming across Western and Northern Europe." }
    ]
  },
  // ── T2: Yamnaya & Neolithic Steppe / Agrarian (Tara)
  {
    code: "T2",
    shortName: "T2 (Tara — Steppe & Neolithic Agrarian)",
    cladeName: "mtDNA-T2",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "N",
    definingSnps: ["8697A", "16126C", "mt709", "mt1888", "mt10463"],
    ageYearsBp: "~16,000 BP",
    originRegion: "Near East / Caucasus / Pontic Steppe",
    historicalDescription: "Associated with both the Neolithic agricultural diffusion and subsequent Bronze Age Yamnaya steppe pastoralist migrations.",
    ancientCultures: ["Yamnaya", "Corded Ware", "Neolithic Farmers"],
    highFrequencyModern: ["Eastern Europe (8-10%)", "Scandinavia (7%)", "Italy (6%)", "Iran / Levant (8%)"],
    migrationPath: [
      { order: 1, region: "Caucasus / Steppe", timePeriod: "10,000 BP", description: "Pastoralist adaptations." },
      { order: 2, region: "Northern & Eastern Europe", timePeriod: "5,000 BP", description: "Steppe expansions associated with Indo-European languages." }
    ]
  },
  // ── K1a: Ötzi / Cardial Mediterranean / Ashkenazi (Katrine)
  {
    code: "K1a",
    shortName: "K1a (Katrine — Ötzi & Cardial Mediterranean)",
    cladeName: "mtDNA-K1a",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "N",
    definingSnps: ["9055A", "10550G", "mt497", "mt1189"],
    ageYearsBp: "~16,000 BP",
    originRegion: "Near East / Anatolia / Mediterranean",
    historicalDescription: "Key marker of early European farmers and ancient Alpine populations. Ötzi the Iceman had an extinct subclade of K1 (K1f).",
    ancientCultures: ["Ötzi the Iceman", "Cardial Ware", "Levantine Early Farmers", "Ashkenazi Matriarchs"],
    highFrequencyModern: ["Ashkenazi Jewish (32%)", "Alps / Tyrol (8-10%)", "Cyprus (10%)", "Levant (8%)"],
    migrationPath: [
      { order: 1, region: "Levant & Anatolia", timePeriod: "15,000 BP", description: "Epipaleolithic origins." },
      { order: 2, region: "Mediterranean Basin & Alps", timePeriod: "8,000 BP", description: "Neolithic maritime migration to Italy, Spain, and Central Europe." }
    ]
  },
  // ── A2: Indigenous American Founder
  {
    code: "A2",
    shortName: "Haplogroup A2 (Indigenous American Founder)",
    cladeName: "mtDNA-A2",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "N",
    definingSnps: ["663G", "8794T", "mt1736", "mt4248", "mt4824"],
    ageYearsBp: "~16,000 BP",
    originRegion: "Beringia / Siberia",
    historicalDescription: "One of the five founding maternal lineages (A2, B2, C1, D1, X2a) of Indigenous American peoples.",
    ancientCultures: ["Clovis Culture", "Ancient Beringians", "Inuit / Thule", "Maya & Aztec Ancestors"],
    highFrequencyModern: ["Inuit / Saqqaq (90%)", "Navajo / Apache (60%)", "Central American Indigenous (50-70%)"],
    migrationPath: [
      { order: 1, region: "Bering Land Bridge", timePeriod: "16,000 BP", description: "Glacial standstill in Beringia before entering the Americas." },
      { order: 2, region: "North & Central America", timePeriod: "14,000 BP", description: "Ice-free corridor and Pacific coastal route." }
    ]
  },
  {
    code: "L1b",
    shortName: "L1b",
    cladeName: "L1b",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L1",
    definingSnps: ["3693G", "7389C", "15692G"],
    ageYearsBp: "~35,000 BP",
    originRegion: "West Africa (Senegal / Guinea / Mali)",
    historicalDescription: "Primary West African maternal founding lineage. Highly represented in African Americans (~15-20% of maternal lineages in the African diaspora).",
    ancientCultures: ["West African Upper Paleolithic", "Senegambian Megaliths"],
    highFrequencyModern: ["Senegal (Wolof, Mandinka, 30%)", "Nigeria (15%)", "African Americans (18%)"],
    migrationPath: [
      { order: 1, region: "Senegambia & Niger River Bend", timePeriod: "35,000 BP", description: "West African coastal and savanna diversification." }
    ]
  },
  {
    code: "L1c",
    shortName: "L1c",
    cladeName: "L1c",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L1",
    definingSnps: ["366C", "10810C", "14209C"],
    ageYearsBp: "~40,000 BP",
    originRegion: "Central African Rainforest (Congo / Gabon / Cameroon)",
    historicalDescription: "Ancient indigenous Central African maternal lineage, exceptionally frequent among BaAka, Mbuti, and Biaka rainforest foragers and neighboring Bantu groups.",
    ancientCultures: ["Central African Forager Traditions"],
    highFrequencyModern: ["Biaka Pygmies (95%)", "Bakola (90%)", "Gabon (25%)", "Cameroon (20%)", "African Americans (7%)"],
    migrationPath: [
      { order: 1, region: "Congo Basin", timePeriod: "40,000 BP", description: "Continuous habitation of the equatorial rainforest belt." }
    ]
  },
  {
    code: "L2b",
    shortName: "L2b",
    cladeName: "L2b",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L2",
    definingSnps: ["8020A", "16390A"],
    ageYearsBp: "~25,000 BP",
    originRegion: "West Africa",
    historicalDescription: "Prominent West African maternal lineage common in Sierra Leone, Liberia, and Ghana.",
    ancientCultures: ["West African Coastal Traditions"],
    highFrequencyModern: ["Sierra Leone (15%)", "Ghana (12%)", "African Americans (8%)"],
    migrationPath: [
      { order: 1, region: "Upper Guinea Coast", timePeriod: "25,000 BP", description: "Coastal rainforest and savanna development." }
    ]
  },
  {
    code: "L2c",
    shortName: "L2c",
    cladeName: "L2c",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L2",
    definingSnps: ["4820G", "10352C"],
    ageYearsBp: "~22,000 BP",
    originRegion: "Senegambia & Cabo Verde",
    historicalDescription: "Distinctive Senegambian maternal lineage frequent in modern Senegal, The Gambia, and Cabo Verde.",
    ancientCultures: ["Senegambian Shell Middens"],
    highFrequencyModern: ["Senegal (18%)", "Cabo Verde (20%)", "African Americans (6%)"],
    migrationPath: [
      { order: 1, region: "Senegal River Basin", timePeriod: "22,000 BP", description: "Coastal fishing and agricultural communities." }
    ]
  },
  {
    code: "L2d",
    shortName: "L2d",
    cladeName: "L2d",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L2",
    definingSnps: ["8584A", "16303G"],
    ageYearsBp: "~20,000 BP",
    originRegion: "West-Central Africa",
    historicalDescription: "West and Central African maternal lineage distributed along the Gulf of Guinea.",
    ancientCultures: ["West African Late Stone Age"],
    highFrequencyModern: ["Nigeria", "Cameroon", "African Diaspora"],
    migrationPath: [
      { order: 1, region: "Gulf of Guinea", timePeriod: "20,000 BP", description: "Settlement across the West African forest belt." }
    ]
  },
  {
    code: "L3b",
    shortName: "L3b",
    cladeName: "L3b",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L3",
    definingSnps: ["3579T", "16124C"],
    ageYearsBp: "~30,000 BP",
    originRegion: "Sahel / Lake Chad Basin / West Africa",
    historicalDescription: "Widespread Sahelian and West African lineage common in Chadic and Niger-Congo speaking populations.",
    ancientCultures: ["Gajiganna Culture", "Sahelian Pastoralists"],
    highFrequencyModern: ["Chad (15%)", "Nigeria (12%)", "Mali (14%)", "African Americans (8%)"],
    migrationPath: [
      { order: 1, region: "Lake Chad Basin", timePeriod: "30,000 BP", description: "Pastoralist migrations across the Green Sahara and Sahel." }
    ]
  },
  {
    code: "L3d",
    shortName: "L3d",
    cladeName: "L3d",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L3",
    definingSnps: ["6402T", "12172C"],
    ageYearsBp: "~28,000 BP",
    originRegion: "Central & West-Central Africa (Angola / Congo / Nigeria)",
    historicalDescription: "Key maternal lineage associated with the southern Bantu migration; strongly represented in African American and Afro-Brazilian populations.",
    ancientCultures: ["Bantu Agrarian Expansion"],
    highFrequencyModern: ["Angola (20%)", "DR Congo (18%)", "Nigeria (10%)", "African Americans (12%)", "Brazil (15%)"],
    migrationPath: [
      { order: 1, region: "Lower Congo & Angola", timePeriod: "28,000 BP", description: "Bantu expansion across South-Central Africa and maritime departure ports." }
    ]
  },
  {
    code: "L3e",
    shortName: "L3e",
    cladeName: "L3e",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L3",
    definingSnps: ["10512G"],
    ageYearsBp: "~35,000 BP",
    originRegion: "Central / East Africa",
    historicalDescription: "The most widespread maternal lineage of the Bantu expansion and the single most common mtDNA haplogroup in African Americans (~25-30%).",
    ancientCultures: ["Bantu Metallurgical Expansion"],
    highFrequencyModern: ["Nigeria (25%)", "Mozambique (35%)", "African Americans (25%)", "Caribbean (30%)"],
    migrationPath: [
      { order: 1, region: "Cameroon-Nigeria Borderlands", timePeriod: "35,000 BP", description: "Massive demographic explosion carrying farming and iron-working across Africa." }
    ]
  },
  {
    code: "L3e2b",
    shortName: "L3e2b",
    cladeName: "L3e2b",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L3e",
    definingSnps: ["5361C", "13803G"],
    ageYearsBp: "~12,000 BP",
    originRegion: "West-Central Africa (Gulf of Guinea / Angola)",
    historicalDescription: "Specific fine-branch subclade of L3e highly enriched in the Trans-Atlantic African diaspora.",
    ancientCultures: ["Kingdom of Kongo", "Angolan Diaspora"],
    highFrequencyModern: ["African Americans (15%)", "Jamaica (18%)", "Brazil (16%)", "Angola (15%)"],
    migrationPath: [
      { order: 1, region: "Angola & Bight of Benin", timePeriod: "12,000 BP", description: "Coastal settlement and diaspora dispersion." }
    ]
  },
  {
    code: "L0a",
    shortName: "L0a",
    cladeName: "L0a",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L0",
    definingSnps: ["3918T", "15148A"],
    ageYearsBp: "~40,000 BP",
    originRegion: "East Africa (Great Lakes & Horn of Africa)",
    historicalDescription: "Ancient Eastern and South-Central African maternal lineage with deep roots in Mozambique, Kenya, Tanzania, and Yemen.",
    ancientCultures: ["East African Late Stone Age"],
    highFrequencyModern: ["Mozambique (25%)", "Rwanda (20%)", "Ethiopia / Yemen (15%)"],
    migrationPath: [
      { order: 1, region: "East African Rift", timePeriod: "40,000 BP", description: "Diversification along the East African corridor." }
    ]
  },
  {
    code: "L0d",
    shortName: "L0d",
    cladeName: "L0d",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L0",
    definingSnps: ["3804C"],
    ageYearsBp: "~100,000 BP",
    originRegion: "Southern Africa (Kalahari / Cape Basin)",
    historicalDescription: "One of the most ancient surviving maternal branches of Homo sapiens, concentrated in Khoisan (!Kung, San, Nama) click-speaking hunter-gatherers.",
    ancientCultures: ["Southern African Middle Stone Age", "Klasies River Caves"],
    highFrequencyModern: ["San / Bushmen (up to 70%)", "Nama (50%)", "South Africa"],
    migrationPath: [
      { order: 1, region: "Kalahari Basin & Cape Coast", timePeriod: "100,000 BP", description: "Deepest maternal continuity in modern human evolutionary history." }
    ]
  },
  {
    code: "B2",
    shortName: "B2",
    cladeName: "B2",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "B4",
    definingSnps: ["494G"],
    ageYearsBp: "~16,000 BP",
    originRegion: "Beringia / North & South America",
    historicalDescription: "One of the five primary founding maternal lineages of Indigenous Americans. Characterized by the 9-base-pair deletion in COII/tRNA-Lys.",
    ancientCultures: ["Anasazi", "Pueblo", "Maya", "Inca", "Taíno"],
    highFrequencyModern: ["Pueblo & Hopi (up to 70%)", "Maya (40%)", "Andean Quechua/Aymara (30%)", "Puerto Rican maternal lines (15%)"],
    migrationPath: [
      { order: 1, region: "Beringia to American Southwest & Andes", timePeriod: "16,000 BP", description: "Pacific coastal and inland expansion down through Mesoamerica and South America." }
    ]
  },
  {
    code: "C1b",
    shortName: "C1b",
    cladeName: "C1b",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "C",
    definingSnps: ["3552A", "9545G"],
    ageYearsBp: "~15,000 BP",
    originRegion: "South & Central America",
    historicalDescription: "Major indigenous founder matriline dominant in South America, particularly in the Andes, Amazon basin, and Gran Chaco.",
    ancientCultures: ["Chinchorro Mummies", "Inca Empire", "Mapuche"],
    highFrequencyModern: ["Chile / Mapuche (50%)", "Bolivia / Peru (40%)", "Argentina / Brazil Indigenous"],
    migrationPath: [
      { order: 1, region: "Pacific Coast to Patagonia", timePeriod: "15,000 BP", description: "Rapid southward expansion reaching Monte Verde in southern Chile." }
    ]
  },
  {
    code: "C1c",
    shortName: "C1c",
    cladeName: "C1c",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "C",
    definingSnps: ["11404C", "15547C"],
    ageYearsBp: "~14,000 BP",
    originRegion: "Mesoamerica & North America",
    historicalDescription: "Indigenous American founding lineage found in Mexico (Nahua, Mixtec), the American Southwest, and Canadian First Nations.",
    ancientCultures: ["Aztec Empire", "Teotihuacan", "Chupícuaro"],
    highFrequencyModern: ["Central Mexico (25%)", "Northern Mexico / Southwest US (20%)"],
    migrationPath: [
      { order: 1, region: "Mesoamerican Highlands", timePeriod: "14,000 BP", description: "Settlement of highland valleys and agricultural development." }
    ]
  },
  {
    code: "C1d",
    shortName: "C1d",
    cladeName: "C1d",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "C",
    definingSnps: ["6235C", "8386C"],
    ageYearsBp: "~14,000 BP",
    originRegion: "Pan-American (North, Central & South America)",
    historicalDescription: "Widespread indigenous founding lineage distributed from Canada to Tierra del Fuego.",
    ancientCultures: ["Pan-American Indigenous Cultures"],
    highFrequencyModern: ["Uruguay (Charrua descendants)", "Colombia", "North American Indigenous"],
    migrationPath: [
      { order: 1, region: "North to South America", timePeriod: "14,000 BP", description: "Continuous continental dispersal." }
    ]
  },
  {
    code: "D1",
    shortName: "D1",
    cladeName: "D1",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "D",
    definingSnps: ["209C", "16271C"],
    ageYearsBp: "~16,000 BP",
    originRegion: "Beringia / Pan-American",
    historicalDescription: "Foundational pan-American indigenous maternal lineage, accounting for over 25% of all Indigenous American maternal genomes.",
    ancientCultures: ["Inuit", "Athabaskan", "Mississippian", "Andean Mummies"],
    highFrequencyModern: ["Patagonia / Yamana (up to 80%)", "Aleut (40%)", "Native North Americans (30%)", "Andeans (30%)"],
    migrationPath: [
      { order: 1, region: "Beringia to Tierra del Fuego", timePeriod: "16,000 BP", description: "Early coastal and interior migration spanning the entire length of the Western Hemisphere." }
    ]
  },
  {
    code: "D4h3a",
    shortName: "D4h3a",
    cladeName: "D4h3a (Clovis / Anzick)",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "D4",
    definingSnps: ["825A", "16241G"],
    ageYearsBp: "~15,000 BP",
    originRegion: "Pacific Coastal North America / Montana",
    historicalDescription: "Rare, iconic Pacific coastal founder lineage confirmed in the 12,600-year-old Anzick-1 Clovis child and ancient Alaskan coastal specimens (Shuká Káa).",
    ancientCultures: ["Clovis Culture (Anzick-1)", "On Your Knees Cave (Shuká Káa)"],
    highFrequencyModern: ["Southern Chile / Fuegians (rare)", "Mexican Indigenous (1-2%)", "Northwest Coast Native Americans (2-3%)"],
    migrationPath: [
      { order: 1, region: "Pacific Coast Kelp Highway", timePeriod: "15,000 BP", description: "Maritime coastal expansion south of the glacial ice sheets." }
    ]
  },
  {
    code: "X2a",
    shortName: "X2a",
    cladeName: "X2a (Kennewick / Ancient One)",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "X",
    definingSnps: ["153G", "16221T"],
    ageYearsBp: "~14,000 BP",
    originRegion: "Northern North America (Great Lakes / Columbia River)",
    historicalDescription: "Indigenous North American founder lineage confirmed in the ~9,000-year-old Kennewick Man ('The Ancient One') and prevalent among Algonquian and Siouan peoples.",
    ancientCultures: ["Kennewick Man (Ancient One)", "Old Copper Complex", "Hopewell"],
    highFrequencyModern: ["Ojibwe / Chippewa (up to 25%)", "Sioux / Lakota (15%)", "Yakama / Colville (Kennewick descendants)"],
    migrationPath: [
      { order: 1, region: "Pacific Northwest to Great Lakes", timePeriod: "14,000 BP", description: "Unique northern trans-continental distribution across North American woodlands." }
    ]
  },
  {
    code: "B4a1a1",
    shortName: "B4a1a1",
    cladeName: "B4a1a1 (Polynesian Motif)",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "B4",
    definingSnps: ["14022C", "16247G"],
    ageYearsBp: "~3,500 BP",
    originRegion: "Taiwan / Island Southeast Asia to Polynesia",
    historicalDescription: "The world-famous 'Polynesian Motif' that drove the Lapita oceanic colonization of Samoa, Tonga, Hawaii, Tahiti, Easter Island, and New Zealand (Māori).",
    ancientCultures: ["Lapita Maritime Culture", "Polynesian Voyagers"],
    highFrequencyModern: ["Polynesians / Māori / Samoans (up to 95%)", "Micronesians (75%)", "Madagascar (25%)"],
    migrationPath: [
      { order: 1, region: "Taiwan to Bismarck Archipelago", timePeriod: "3,500 BP", description: "Lapita maritime voyaging using double-hulled outrigger canoes." },
      { order: 2, region: "Remote Oceania (Hawaii, Rapa Nui, Aotearoa)", timePeriod: "1,500–800 BP", description: "Long-distance open ocean navigation across the Polynesian Triangle." }
    ]
  },
  {
    code: "F1a",
    shortName: "F1a",
    cladeName: "F1a",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "F",
    definingSnps: ["16232T"],
    ageYearsBp: "~18,000 BP",
    originRegion: "Southeast Asia (Vietnam / South China)",
    historicalDescription: "Dominant maternal lineage across Mainland and Island Southeast Asia, associated with Austroasiatic and Austronesian agricultural expansion.",
    ancientCultures: ["Đông Sơn Culture", "Maritime Southeast Asian Neolithic"],
    highFrequencyModern: ["Vietnam (25%)", "Thailand / Laos (20%)", "Indonesia / Philippines (15%)", "Southern China (12%)"],
    migrationPath: [
      { order: 1, region: "Red River Delta & Mekong Basin", timePeriod: "18,000 BP", description: "Rice agricultural expansion across Southeast Asia and the Sunda Islands." }
    ]
  },
  {
    code: "N9a",
    shortName: "N9a",
    cladeName: "N9a",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "N",
    definingSnps: ["12690C"],
    ageYearsBp: "~20,000 BP",
    originRegion: "East Asia (Yellow River / Korean Peninsula / Japan)",
    historicalDescription: "East Asian maternal lineage common in Korea, Japan (Yayoi agricultural expansion), and Northern Han Chinese.",
    ancientCultures: ["Yayoi Culture", "Mumun Pottery Period", "Longshan Culture"],
    highFrequencyModern: ["Korea (8%)", "Japan (7%)", "Northern China (6%)"],
    migrationPath: [
      { order: 1, region: "Shandong Peninsula & Korea to Japanese Archipelago", timePeriod: "20,000 BP", description: "Neolithic wet-rice farming expansion into Japan." }
    ]
  },
  {
    code: "M2",
    shortName: "M2",
    cladeName: "M2",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "M",
    definingSnps: ["16274G"],
    ageYearsBp: "~50,000 BP",
    originRegion: "South Asia (Indian Subcontinent)",
    historicalDescription: "Deep indigenous Indian maternal founder lineage, highest in Dravidian-speaking tribal populations of Southern and Central India.",
    ancientCultures: ["South Asian Paleolithic"],
    highFrequencyModern: ["Indian Dravidian / Tribal groups (up to 30%)", "South India (15%)", "Sri Lanka (10%)"],
    migrationPath: [
      { order: 1, region: "Deccan Plateau & Western Ghats", timePeriod: "50,000 BP", description: "Continuous indigenous presence since the Initial Out-of-Africa coastal migration." }
    ]
  },
  {
    code: "M3",
    shortName: "M3",
    cladeName: "M3",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "M",
    definingSnps: ["12979G"],
    ageYearsBp: "~45,000 BP",
    originRegion: "South Asia (Western & Northern India)",
    historicalDescription: "Ancient autochthonous South Asian maternal lineage frequent across Gujarat, Rajasthan, and the Gangetic plain.",
    ancientCultures: ["Indus Valley Agrarian Transitions"],
    highFrequencyModern: ["Western India / Gujarat (12%)", "North India (10%)"],
    migrationPath: [
      { order: 1, region: "Indus-Sarasvati River Basins", timePeriod: "45,000 BP", description: "Indigenous South Asian Pleistocene development." }
    ]
  },
  {
    code: "M5",
    shortName: "M5",
    cladeName: "M5",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "M",
    definingSnps: ["12285T"],
    ageYearsBp: "~40,000 BP",
    originRegion: "South Asia & Eastern India",
    historicalDescription: "Autochthonous Indian maternal lineage with wide distribution across caste and tribal communities in India and Bangladesh.",
    ancientCultures: ["Eastern Indian Neolithic"],
    highFrequencyModern: ["East India / Bengal / Odisha (15%)", "Central India (10%)"],
    migrationPath: [
      { order: 1, region: "Ganges Delta & Chota Nagpur Plateau", timePeriod: "40,000 BP", description: "Early hunter-gatherer and riverine adaptations." }
    ]
  }
,
{
    code: "H1a",
    shortName: "H1a",
    cladeName: "H1a",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "H1",
    definingSnps: ["73A"],
    ageYearsBp: "~11,000 BP",
    originRegion: "Franco-Cantabrian Refugium / Western Europe",
    historicalDescription: "Subclade of H1 associated with the post-glacial repopulation of Western Europe.",
    ancientCultures: ["Mesolithic Western Europe", "Megalithic Builders"],
    highFrequencyModern: ["Basque Country (15%)", "France (10%)", "British Isles (8%)"],
    migrationPath: [
      { order: 1, region: "Pyrenees & Bay of Biscay", timePeriod: "11,000 BP", description: "Post-LGM expansion into Atlantic Europe." }
    ]
  },
  {
    code: "H2a",
    shortName: "H2a",
    cladeName: "H2a",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "H2",
    definingSnps: ["4769G"],
    ageYearsBp: "~9,000 BP",
    originRegion: "Eastern Europe & Pontic Steppe",
    historicalDescription: "Prominent European and Steppe lineage found in Corded Ware and Germanic ancient specimens.",
    ancientCultures: ["Corded Ware Culture", "Germanic Tribes"],
    highFrequencyModern: ["Germany (8%)", "Poland (8%)", "Scandinavia (7%)"],
    migrationPath: [
      { order: 1, region: "Central & Eastern Europe", timePeriod: "9,000 BP", description: "Steppe to Central European agricultural integration." }
    ]
  },
  {
    code: "H3a",
    shortName: "H3a",
    cladeName: "H3a",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "H3",
    definingSnps: ["6776C"],
    ageYearsBp: "~8,000 BP",
    originRegion: "Iberia & Western Mediterranean",
    historicalDescription: "Fine-branch subclade of H3 with high modern concentration in Sardinia and the Basque Country.",
    ancientCultures: ["Nuragic Sardinia", "Iberian Megalithic"],
    highFrequencyModern: ["Sardinia (12%)", "Basques (10%)", "Galicia (8%)"],
    migrationPath: [
      { order: 1, region: "Iberian Atlantic Coast to Sardinia", timePeriod: "8,000 BP", description: "Maritime Mediterranean and Atlantic trade." }
    ]
  },
  {
    code: "H5a",
    shortName: "H5a",
    cladeName: "H5a",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "H",
    definingSnps: ["4336C"],
    ageYearsBp: "~8,500 BP",
    originRegion: "Central Europe & Balkans",
    historicalDescription: "Neolithic agriculturalist expansion lineage across the Danube basin into Central Europe.",
    ancientCultures: ["Linear Pottery Culture (LBK)", "Vinča Culture"],
    highFrequencyModern: ["Austria / Germany (6%)", "Balkans (5%)", "Czech Republic (5%)"],
    migrationPath: [
      { order: 1, region: "Danube River Corridor", timePeriod: "8,500 BP", description: "Early farmer expansion into temperate Europe." }
    ]
  },
  {
    code: "U5b1b",
    shortName: "U5b1b",
    cladeName: "U5b1b (Saami / Basque Ice Age Link)",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "U5b",
    definingSnps: ["5656G"],
    ageYearsBp: "~9,000 BP",
    originRegion: "Franco-Cantabrian Refugium to Lapland",
    historicalDescription: "Iconic post-glacial genetic link shared between the Saami of northern Scandinavia (~45%) and the Basques of northern Spain, tracking post-LGM hunter-gatherer expansion along the retreating ice sheets.",
    ancientCultures: ["Post-LGM Hunter-Gatherers", "Fosna / Komsa Culture"],
    highFrequencyModern: ["Saami (45%)", "Basques (5%)", "Berbers (rare ancient link)"],
    migrationPath: [
      { order: 1, region: "Franco-Cantabrian Coast to Northern Scandinavia", timePeriod: "9,000 BP", description: "Reindeer hunter migration following melting glaciers to the Arctic circle." }
    ]
  },
  {
    code: "U5b2a",
    shortName: "U5b2a",
    cladeName: "U5b2a (Cheddar Man)",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "U5b",
    definingSnps: ["16291T"],
    ageYearsBp: "~14,000 BP",
    originRegion: "Western Europe (Britain, France, Germany)",
    historicalDescription: "The definitive Western European Hunter-Gatherer (WHG) lineage confirmed in the ~10,000-year-old Cheddar Man skeleton found in Gough's Cave, Somerset, UK.",
    ancientCultures: ["Cheddar Man (Mesolithic UK)", "Magdalenian / Epipaleolithic"],
    highFrequencyModern: ["British Isles (4%)", "Scandinavia (3%)", "Western Europe (3%)"],
    migrationPath: [
      { order: 1, region: "Doggerland & British Isles", timePeriod: "10,000 BP", description: "Mesolithic hunter-gatherer presence before the inundation of Doggerland." }
    ]
  },
  {
    code: "U4a1",
    shortName: "U4a1",
    cladeName: "U4a1",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "U4",
    definingSnps: ["16179T"],
    ageYearsBp: "~12,000 BP",
    originRegion: "Eastern European Forest-Steppe & Urals",
    historicalDescription: "Eastern Hunter-Gatherer (EHG) and Steppe pastoralist matriline frequent in ancient Yamnaya and Corded Ware burials.",
    ancientCultures: ["Eastern Hunter-Gatherers", "Yamnaya Culture", "Khvalynsk"],
    highFrequencyModern: ["Northwest Russia (12%)", "Baltic (8%)", "Finland (7%)"],
    migrationPath: [
      { order: 1, region: "Volga-Ural Basin", timePeriod: "12,000 BP", description: "Steppe forest zone forager-pastoralist transitions." }
    ]
  },
  {
    code: "K1a1b1a",
    shortName: "K1a1b1a",
    cladeName: "K1a1b1a (Ashkenazi Founder)",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "K1a",
    definingSnps: ["16093C"],
    ageYearsBp: "~2,000 BP",
    originRegion: "Central / Eastern Europe (Rhineland / Poland)",
    historicalDescription: "One of the four major founding maternal lineages of Ashkenazi Jews, carried by approximately 32% of all Ashkenazi Jews worldwide; traces to a severe medieval bottleneck.",
    ancientCultures: ["Medieval Ashkenazi Rhineland Communities"],
    highFrequencyModern: ["Ashkenazi Jews (32%)", "European Diaspora"],
    migrationPath: [
      { order: 1, region: "Rhineland to Pale of Settlement", timePeriod: "1,200 BP", description: "Medieval European Jewish demographic bottleneck and expansion." }
    ]
  },
  {
    code: "W6a",
    shortName: "W6a",
    cladeName: "W6a (Samara Yamnaya)",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "W",
    definingSnps: ["16292T"],
    ageYearsBp: "~6,000 BP",
    originRegion: "Pontic-Caspian Steppe (Samara Basin, Russia)",
    historicalDescription: "Ancient Steppe maternal lineage directly sequenced from Yamnaya pastoralist kurgans along the Samara River in Russia.",
    ancientCultures: ["Yamnaya Steppe Culture", "Afanasievo Culture"],
    highFrequencyModern: ["Eastern Europe (rare)", "Caucasus", "Central Asia"],
    migrationPath: [
      { order: 1, region: "Samara River, Volga Basin", timePeriod: "5,000 BP", description: "Yamnaya pastoralist steppe expansion." }
    ]
  },
  {
    code: "L2a1a",
    shortName: "L2a1a",
    cladeName: "L2a1a",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "L2a",
    definingSnps: ["7805G"],
    ageYearsBp: "~18,000 BP",
    originRegion: "West & West-Central Africa",
    historicalDescription: "The single most prominent maternal founding lineage in the African diaspora, representing over 20% of African Americans and Afro-Caribbeans.",
    ancientCultures: ["Bantu Agrarian Expansion", "Kingdom of Benin"],
    highFrequencyModern: ["African Americans (22%)", "Nigeria (18%)", "Ghana (15%)", "Jamaica (20%)"],
    migrationPath: [
      { order: 1, region: "Gulf of Guinea to Central Africa", timePeriod: "18,000 BP", description: "Bantu demographic expansion and Transatlantic diaspora." }
    ]
  },
  {
    code: "A2a",
    shortName: "A2a",
    cladeName: "A2a",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "A2",
    definingSnps: ["16111T"],
    ageYearsBp: "~7,000 BP",
    originRegion: "Bering Strait / Arctic North America",
    historicalDescription: "Subclade of A2 dominant in Inuit, Yupik, and Aleut populations, as well as northern Athabaskans of Alaska and Canada.",
    ancientCultures: ["Thule Culture", "Dorset Culture", "Inuit Traditions"],
    highFrequencyModern: ["Inuit / Greenland (70%)", "Yupik (60%)", "Aleut (50%)"],
    migrationPath: [
      { order: 1, region: "Bering Sea to Greenland Coast", timePeriod: "7,000 BP", description: "Thule maritime Arctic expansion." }
    ]
  },
  {
    code: "D1a",
    shortName: "D1a",
    cladeName: "D1a",
    lineageType: "MATERNAL_MTDNA",
    parentClade: "D1",
    definingSnps: ["16311C"],
    ageYearsBp: "~12,000 BP",
    originRegion: "South America (Amazon Basin & Patagonia)",
    historicalDescription: "Indigenous South American maternal lineage found in Amazonian tribes, the Gran Chaco, and ancient Fuegian mummies.",
    ancientCultures: ["Amazonian Geoglyphs", "Patagonian Hunter-Gatherers"],
    highFrequencyModern: ["Amazonian Indigenous (40%)", "Gran Chaco (35%)", "Chilean Mapuche (25%)"],
    migrationPath: [
      { order: 1, region: "Amazon Basin to Southern Cone", timePeriod: "12,000 BP", description: "South American riverine and southern coastal expansion." }
    ]
  }
];

export const ALL_HAPLOGROUPS: HaplogroupDefinition[] = [
  ...Y_DNA_HAPLOGROUPS,
  ...MT_DNA_HAPLOGROUPS
];
