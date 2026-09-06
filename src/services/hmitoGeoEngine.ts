/**
 * 🌍 hMITO DB (v1.0) Phylogeographic Geo-Mapping & Biogeographic Origin Engine
 * Reference: Shen-Gunther et al. 2023 (IJMS 24(17):13505, DOI: 10.3390/ijms241713505)
 */

export interface PhylogeographicDossier {
  haplogroup: string;
  macroClade: string;
  continentalHomeland: string;
  subRegionalBiogeography: string;
  historicalMigrationEpoch: string;
  primaryHistoricalPopulations: string[];
  modernDistributionHotspots: string[];
  paleoclimaticContext: string;
  archeologicalCorrelation: string;
}

const HMITO_GEOGRAPHIC_PROFILES: Record<string, PhylogeographicDossier> = {
  // W lineage profiles
  'W3A1': {
    haplogroup: 'W3a1',
    macroClade: 'W (N4a stem)',
    continentalHomeland: 'Central / Northwestern Europe & Pontic Steppe',
    subRegionalBiogeography: 'Eurasian Steppe to Central European Bell Beaker / Corded Ware Horizons',
    historicalMigrationEpoch: 'Late Neolithic to Early Bronze Age Expansion (~4,500 – 4,000 BP)',
    primaryHistoricalPopulations: ['Bell Beaker Metallurgists', 'Corded Ware Culture', 'Single Grave Culture'],
    modernDistributionHotspots: ['Germany', 'Scandinavia', 'British Isles', 'Poland', 'Northwestern Russia'],
    paleoclimaticContext: 'Post-glacial Sub-Boreal pastoralist expansion following the 4.2k climate event.',
    archeologicalCorrelation: 'Associated with Bell Beaker copper dagger/beaker burials (Halberstadt, Germany) and Corded Ware familial graves (Eulau, Germany).'
  },
  'W3A': {
    haplogroup: 'W3a',
    macroClade: 'W',
    continentalHomeland: 'Eastern Europe & Pontic-Caspian Steppe',
    subRegionalBiogeography: 'Central / Eastern European Forest-Steppe Zone',
    historicalMigrationEpoch: 'Chalcolithic to Corded Ware Horizon (~5,000 BP)',
    primaryHistoricalPopulations: ['Yamnaya Pastoralists', 'Corded Ware Early Adopters'],
    modernDistributionHotspots: ['Central Europe', 'Eastern Baltic', 'Finland', 'Northern India / Punjab'],
    paleoclimaticContext: 'Steppe horse domestication and wheeled transport dispersal.',
    archeologicalCorrelation: 'Eulau Corded Ware nuclear family cemetery.'
  },
  'W3': {
    haplogroup: 'W3',
    macroClade: 'W',
    continentalHomeland: 'Near East to Steppe Borderlands',
    subRegionalBiogeography: 'Caucasus & Northern Black Sea Steppe',
    historicalMigrationEpoch: 'Neolithic to Early Bronze Age Transition (~6,000 BP)',
    primaryHistoricalPopulations: ['Caucasus Hunter-Gatherers (CHG)', 'Early Steppe Pastoralists'],
    modernDistributionHotspots: ['Europe', 'Caucasus', 'Near East', 'Indo-Iranian Plateau'],
    paleoclimaticContext: 'Holocene thermal maximum pastoral migrations.',
    archeologicalCorrelation: 'Kurgan burial complex emergence.'
  },
  'W': {
    haplogroup: 'W',
    macroClade: 'N',
    continentalHomeland: 'West Eurasia & Near East',
    subRegionalBiogeography: 'Near Eastern Fertile Crescent to Mediterranean Basin',
    historicalMigrationEpoch: 'Upper Paleolithic (~20,000 – 15,000 BP)',
    primaryHistoricalPopulations: ['Near Eastern Epipaleolithic', 'Early Agriculturalists'],
    modernDistributionHotspots: ['Europe', 'North Africa', 'Middle East', 'South Asia'],
    paleoclimaticContext: 'Last Glacial Maximum (LGM) refuge expansion.',
    archeologicalCorrelation: 'Natufian and Early European Farmer horizons.'
  },

  // H lineage profiles
  'H1': {
    haplogroup: 'H1',
    macroClade: 'H (HV root)',
    continentalHomeland: 'Franco-Cantabrian Refugium / Western Europe',
    subRegionalBiogeography: 'Iberian Peninsula & Atlantic Europe',
    historicalMigrationEpoch: 'Post-LGM Mesolithic & Neolithic Repopulation (~13,000 BP)',
    primaryHistoricalPopulations: ['Magdalenian Hunter-Gatherers', 'Megalithic Atlantic Farmers'],
    modernDistributionHotspots: ['Basque Country (up to 30%)', 'Iberia', 'France', 'British Isles', 'Scandinavia'],
    paleoclimaticContext: 'Post-glacial climatic warming and forest expansion across Western Europe.',
    archeologicalCorrelation: 'Megalithic passage tombs and Atlantic Bronze Age networks.'
  },
  'H': {
    haplogroup: 'H',
    macroClade: 'HV',
    continentalHomeland: 'West Eurasia / Near East',
    subRegionalBiogeography: 'Near East & Anatolian Corridor to Europe',
    historicalMigrationEpoch: 'Early Upper Paleolithic to Neolithic (~25,000 – 8,000 BP)',
    primaryHistoricalPopulations: ['Early European Farmers (EEF)', 'European Hunter-Gatherer Refugia'],
    modernDistributionHotspots: ['Europe (40-45% of total population)', 'North Africa', 'Middle East'],
    paleoclimaticContext: 'Holocene agrarian revolution.',
    archeologicalCorrelation: 'Linear Pottery Culture (LBK), Cardial Impressed Ware, and Bell Beakers.'
  },

  // U lineages
  'U5B1': {
    haplogroup: 'U5b1',
    macroClade: 'U5 (Western Hunter-Gatherer)',
    continentalHomeland: 'Indigenous Paleolithic & Mesolithic Europe',
    subRegionalBiogeography: 'Western & Central European Forest Zone',
    historicalMigrationEpoch: 'Upper Paleolithic to Mesolithic (~20,000 – 9,000 BP)',
    primaryHistoricalPopulations: ['Western Hunter-Gatherers (WHG)', 'Sami Ancestral Matrilines (U5b1b1)'],
    modernDistributionHotspots: ['Northern Scandinavia (Sami)', 'Basque Country', 'Northern Spain', 'Central Europe'],
    paleoclimaticContext: 'Epipaleolithic forest hunter-gatherer adaptation.',
    archeologicalCorrelation: 'Cheddar Man (Somerset, UK) and Loschbour Man (Luxembourg).'
  },
  'U5': {
    haplogroup: 'U5',
    macroClade: 'U',
    continentalHomeland: 'Indigenous Upper Paleolithic Europe',
    subRegionalBiogeography: 'Pan-European Ice Age Mammoth Steppe to Atlantic Coast',
    historicalMigrationEpoch: 'Early Upper Paleolithic (~35,000 BP)',
    primaryHistoricalPopulations: ['Gravettian Mammoth Hunters', 'Magdalenian Cave Artists'],
    modernDistributionHotspots: ['Scandinavia', 'Baltic', 'Basque Country', 'Western Russia'],
    paleoclimaticContext: 'Deep Pleistocene Ice Age European survival.',
    archeologicalCorrelation: 'Dolní Věstonice and Gravettian cave sites.'
  },

  // African L lineages
  'L2A1': {
    haplogroup: 'L2a1',
    macroClade: 'L2 (Pan-African Matriarch)',
    continentalHomeland: 'Sub-Saharan West & Central Africa',
    subRegionalBiogeography: 'West African Forest & Savannah Homeland (Niger-Congo Basin)',
    historicalMigrationEpoch: 'Late Stone Age & Bantu Agrarian Expansion (~5,000 – 1,500 BP)',
    primaryHistoricalPopulations: ['Early Niger-Congo Agriculturalists', 'Bantu Expansion Pioneer Groups', 'African Diaspora Matriarchs'],
    modernDistributionHotspots: ['Ghana', 'Nigeria', 'Cameroon', 'Senegal', 'African American Diaspora (up to 20%)'],
    paleoclimaticContext: 'Green Sahara desiccation and equatorial forest agriculture.',
    archeologicalCorrelation: 'Nok Culture, Shum Laka Rock Shelter, and Great Zimbabwe.'
  },
  'L3': {
    haplogroup: 'L3',
    macroClade: 'L3 (Mother of Out-of-Africa Clades M & N)',
    continentalHomeland: 'East Africa / Horn of Africa',
    subRegionalBiogeography: 'East African Rift Valley to Red Sea Coast',
    historicalMigrationEpoch: 'Middle Stone Age (~70,000 – 60,000 BP)',
    primaryHistoricalPopulations: ['Anatomically Modern Humans', 'Southern Dispersal Pioneers'],
    modernDistributionHotspots: ['Ethiopia', 'Kenya', 'Somalia', 'West Africa', 'African Diaspora'],
    paleoclimaticContext: 'Marine Isotope Stage 4 (MIS 4) Out-of-Africa expansion wave.',
    archeologicalCorrelation: 'Middle Stone Age blade technology and shell bead ornaments.'
  },

  // Native American founder lineages
  'A2': {
    haplogroup: 'A2',
    macroClade: 'A (Beringian Founder)',
    continentalHomeland: 'Beringia to the Americas',
    subRegionalBiogeography: 'Pan-American Continental Dispersal',
    historicalMigrationEpoch: 'Terminal Pleistocene Beringian Standstill (~16,000 – 14,000 BP)',
    primaryHistoricalPopulations: ['First Peoples of the Americas', 'Paleo-Indian Pioneers'],
    modernDistributionHotspots: ['Indigenous North America', 'Mesoamerica (Maya/Nahua)', 'Amazon Basin', 'Andean Region'],
    paleoclimaticContext: 'Deglaciation of the Pacific Coastal Corridor and Ice-Free Corridor.',
    archeologicalCorrelation: 'Upward Sun River (Alaska) and Clovis archaeological horizon.'
  },
    // African L Lineages
  'L1B': {
    haplogroup: 'L1b',
    macroClade: 'L1',
    continentalHomeland: 'West Africa (Senegal / Guinea / Mali)',
    subRegionalBiogeography: 'Senegambia to Niger River Basin',
    historicalMigrationEpoch: 'Upper Paleolithic (~35,000 BP)',
    primaryHistoricalPopulations: ['Senegambian Foragers', 'West African Agronomists'],
    modernDistributionHotspots: ['Senegal (30%)', 'Mali', 'African Americans (18%)'],
    paleoclimaticContext: 'Savanna expansion during Late Pleistocene climatic fluctuations.',
    archeologicalCorrelation: 'Senegambian megalithic monuments and Ounjougou cultural complex.'
  },
  'L1C': {
    haplogroup: 'L1c',
    macroClade: 'L1',
    continentalHomeland: 'Central African Rainforest (Congo Basin / Cameroon)',
    subRegionalBiogeography: 'Equatorial Central African Rainforest Belt',
    historicalMigrationEpoch: 'Late Stone Age (~40,000 BP)',
    primaryHistoricalPopulations: ['BaAka & Biaka Rainforest Foragers', 'Bantu Early Adopters'],
    modernDistributionHotspots: ['Biaka Pygmies (95%)', 'Gabon (25%)', 'Cameroon (20%)', 'African Americans (7%)'],
    paleoclimaticContext: 'Continuous Pleistocene equatorial rainforest arboreal adaptations.',
    archeologicalCorrelation: 'Shum Laka rock shelter and ancient rainforest microlithic toolkits.'
  },
  'L3E': {
    haplogroup: 'L3e',
    macroClade: 'L3',
    continentalHomeland: 'Central / East Africa to Gulf of Guinea',
    subRegionalBiogeography: 'Sub-Saharan Bantu Agrarian Corridor',
    historicalMigrationEpoch: 'Late Pleistocene to Iron Age (~35,000 – 3,000 BP)',
    primaryHistoricalPopulations: ['Proto-Bantu Metallurgists', 'Niger-Congo Agrarian Pioneer Communities'],
    modernDistributionHotspots: ['Nigeria (25%)', 'Mozambique (35%)', 'African Americans (25%)', 'Caribbean (30%)'],
    paleoclimaticContext: 'Holocene Green Sahara drying driving southward migration.',
    archeologicalCorrelation: 'Nok culture terracotta and Early Iron Age smelting furnaces.'
  },
  'L3E2B': {
    haplogroup: 'L3e2b',
    macroClade: 'L3e',
    continentalHomeland: 'West-Central Africa (Angola / Congo / Bight of Benin)',
    subRegionalBiogeography: 'Atlantic West-Central African Coastal Horizon',
    historicalMigrationEpoch: 'Holocene (~12,000 – 400 BP)',
    primaryHistoricalPopulations: ['Kingdom of Kongo', 'Angolan & Mbundu Peoples'],
    modernDistributionHotspots: ['African Americans (15%)', 'Jamaica (18%)', 'Brazil (16%)', 'Angola (15%)'],
    paleoclimaticContext: 'Atlantic coastal maritime and forest agriculture.',
    archeologicalCorrelation: 'Mbanza Kongo royal capital excavations.'
  },
  'L0D': {
    haplogroup: 'L0d',
    macroClade: 'L0',
    continentalHomeland: 'Southern Africa (Kalahari / Cape Basin)',
    subRegionalBiogeography: 'Southern African Hunter-Gatherer Refugium',
    historicalMigrationEpoch: 'Middle Stone Age (~100,000 BP)',
    primaryHistoricalPopulations: ['San / Bushmen Click-Speaking Foragers'],
    modernDistributionHotspots: ['Kalahari San (70%)', 'Nama (50%)', 'South Africa'],
    paleoclimaticContext: 'Deepest modern human demographic continuity.',
    archeologicalCorrelation: 'Blombos Cave ochre engravings and Klasies River Caves.'
  },
  'B2': {
    haplogroup: 'B2',
    macroClade: 'B4',
    continentalHomeland: 'Beringia to American Southwest & Andes',
    subRegionalBiogeography: 'Pan-American Indigenous Founder Lineage',
    historicalMigrationEpoch: 'Terminal Pleistocene (~16,000 BP)',
    primaryHistoricalPopulations: ['Paleo-Indians', 'Anasazi / Pueblo', 'Maya', 'Inca'],
    modernDistributionHotspots: ['Pueblo / Hopi (70%)', 'Maya (40%)', 'Quechua / Aymara (30%)'],
    paleoclimaticContext: 'Deglaciation of the North American cordillera.',
    archeologicalCorrelation: 'Chaco Canyon Pueblo ruins and Andean mummy complexes.'
  },
  'D4H3A': {
    haplogroup: 'D4h3a',
    macroClade: 'D4',
    continentalHomeland: 'Pacific Coastal North America (Kelp Highway)',
    subRegionalBiogeography: 'Paleo-Indian Pacific Maritime Coastal Corridor',
    historicalMigrationEpoch: 'Late Glacial (~15,000 BP)',
    primaryHistoricalPopulations: ['Clovis Culture (Anzick-1)', 'Pacific Coastal Maritime Foragers'],
    modernDistributionHotspots: ['Fuegians / Yamana', 'Northwest Coast Native Americans', 'Mexican Indigenous (rare)'],
    paleoclimaticContext: 'Pacific kelp highway coastal foraging route south of the Cordilleran ice sheet.',
    archeologicalCorrelation: 'Anzick-1 Clovis child burial (Montana) and Shuká Káa (On Your Knees Cave, Alaska).'
  },
  'B4A1A1': {
    haplogroup: 'B4a1a1',
    macroClade: 'B4',
    continentalHomeland: 'Island Southeast Asia / Taiwan to Remote Oceania',
    subRegionalBiogeography: 'Lapita Maritime Oceanic Expansion ("Polynesian Motif")',
    historicalMigrationEpoch: 'Late Holocene (~3,500 – 1,000 BP)',
    primaryHistoricalPopulations: ['Lapita Maritime Navigators', 'Polynesian & Māori Voyagers'],
    modernDistributionHotspots: ['Samoa (95%)', 'Tonga (90%)', 'Māori / New Zealand (85%)', 'Hawaii (80%)'],
    paleoclimaticContext: 'ENSO trade wind voyaging across the open Pacific.',
    archeologicalCorrelation: 'Dentate-stamped Lapita pottery across the Bismarck Archipelago and Polynesia.'
  },
'X2A': {
    haplogroup: 'X2a',
    macroClade: 'X2',
    continentalHomeland: 'North America / Great Lakes & Pacific Northwest',
    subRegionalBiogeography: 'Indigenous North American Founder Lineage',
    historicalMigrationEpoch: 'Late Pleistocene to Early Holocene (~13,000 – 9,000 BP)',
    primaryHistoricalPopulations: ['Paleo-Indian Cascade & Archaic Peoples', 'Algonquian & Siouan Nations'],
    modernDistributionHotspots: ['Ojibwe', 'Nuu-chah-nulth', 'Yakama', 'Colville', 'Sioux'],
    paleoclimaticContext: 'Early Holocene Pacific Northwest riverine settlement.',
    archeologicalCorrelation: 'Kennewick Man ("The Ancient One", Columbia River, WA).'
  }
};

/**
 * Resolves the hMITO DB phylogeographic origin dossier for a given maternal haplogroup.
 */
export function getHmitoPhylogeographicDossier(haplogroupCode: string): PhylogeographicDossier {
  const cleanCode = haplogroupCode.trim().toUpperCase();

  // 1. Direct exact match
  if (HMITO_GEOGRAPHIC_PROFILES[cleanCode]) {
    return HMITO_GEOGRAPHIC_PROFILES[cleanCode];
  }

  // 2. Hierarchical prefix match (e.g. W3a1a -> W3a1 -> W3a -> W3 -> W)
  for (let len = cleanCode.length - 1; len >= 1; len--) {
    const sub = cleanCode.substring(0, len);
    if (HMITO_GEOGRAPHIC_PROFILES[sub]) {
      return {
        ...HMITO_GEOGRAPHIC_PROFILES[sub],
        haplogroup: haplogroupCode
      };
    }
  }

  // 3. Fallback generic profile
  return {
    haplogroup: haplogroupCode,
    macroClade: haplogroupCode.charAt(0),
    continentalHomeland: 'Global Human Matrilineal Diversity Horizon',
    subRegionalBiogeography: 'Eurasian / African / American Biogeographic Corridor',
    historicalMigrationEpoch: 'Pleistocene to Holocene Transition',
    primaryHistoricalPopulations: ['Ancient Human Populations'],
    modernDistributionHotspots: ['Global Populations'],
    paleoclimaticContext: 'Post-glacial human population expansion.',
    archeologicalCorrelation: 'Correlated with ancient human archaeological remains.'
  };
}
