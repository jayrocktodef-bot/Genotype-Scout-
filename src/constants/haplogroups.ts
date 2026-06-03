import { HaplogroupNode } from '../types/genotype';

export const Y_DNA_TREE: HaplogroupNode = {
  branchName: "Y-DNA Root (Adam)",
  snp: [],
  children: [
    {
      branchName: "Haplogroup A",
      snp: ["M91", "P97", "rs369315948", "rs2534636"],
      region: "Sub-Saharan Africa",
      description: "The oldest known Y-DNA lineage, representing the first major branch of the human paternal tree. It is found at its highest frequencies in Khoisan populations of Southern Africa and Nilotic populations in East Africa (Sudan, Ethiopia).",
      children: [
        { 
          branchName: "Haplogroup A0-T", 
          snp: ["V168", "L1088", "M31", "rs369315948"],
          region: "East/Central Africa",
          description: "A very ancient lineage that is the ancestor to almost all living men outside of the deepest A00 and A0 branches."
        },
        { 
          branchName: "Haplogroup A0", 
          snp: ["L991", "P97"],
          region: "West/Central Africa",
          description: "A rare and ancient lineage found primarily in Cameroon and neighboring regions."
        },
        { 
          branchName: "Haplogroup A1", 
          snp: ["P305"],
          region: "Central Africa",
          description: "Found in Central African populations, particularly in the Congo Basin."
        },
        { 
          branchName: "Haplogroup A1a", 
          snp: ["M31", "rs9786088"],
          region: "West Africa / Maghreb",
          description: "Found in West Africa (Gambia, Senegal) and occasionally in Northwest Africa."
        },
        { 
          branchName: "Haplogroup A1b", 
          snp: ["P108"],
          region: "Southern Africa",
          description: "Common among the Khoisan-speaking peoples of the Kalahari Desert.",
          children: [
            { 
              branchName: "Haplogroup A1b1", 
              snp: ["L419"],
              region: "Southern Africa",
              description: "A major subclade within the Khoisan populations."
            }
          ]
        },
        { 
          branchName: "Haplogroup A2", 
          snp: ["M6", "rs9786112", "P28"],
          region: "Southern Africa",
          description: "Found almost exclusively among the San people of Southern Africa."
        },
        { 
          branchName: "Haplogroup A3", 
          snp: ["M32", "rs9786096"],
          region: "East Africa",
          description: "Common in East African Nilotic populations, such as those in South Sudan and Ethiopia.",
          children: [
            { 
              branchName: "Haplogroup A3a", 
              snp: ["M28"],
              region: "East Africa",
              description: "Found in Ethiopia and surrounding regions."
            },
            { 
              branchName: "Haplogroup A3b", 
              snp: ["M220"],
              region: "East Africa",
              description: "Widespread in the Horn of Africa.",
              children: [
                { 
                  branchName: "Haplogroup A3b1", 
                  snp: ["M51"],
                  region: "East Africa",
                  description: "Specific to populations in the Nile Valley."
                },
                { 
                  branchName: "Haplogroup A3b2", 
                  snp: ["M13", "M171"],
                  region: "East Africa",
                  description: "A common marker in Ethiopia and Sudan."
                }
              ]
            }
          ]
        },
        { 
          branchName: "Haplogroup A00", 
          snp: ["FGC25932", "FGC25805", "YP2737", "FGC27036", "YP3298", "FGC26901", "Y126645", "FGC26916", "YP3230", "A12220", "FGC26580", "L1149", "FGC25576", "A4982", "YP2683", "A4984", "YP2995", "A4985", "YP3292", "A3807", "FGC25522", "YP2561", "FGC27152", "YP3359", "L1284"],
          region: "West Africa (Cameroon)",
          description: "The most basal known lineage of the human Y-chromosome, discovered in 2013. It diverged from all other known lineages over 300,000 years ago and is found primarily among the Mbo people of Cameroon."
        }
      ]
    },
    {
      branchName: "Haplogroup B",
      snp: ["M60", "BY31586", "CTS10487", "M8862", "rs17307044", "rs34436531"],
      region: "Central/Southern Africa",
      description: "One of the oldest Y-DNA lineages, found primarily in African hunter-gatherer populations such as the Pygmies of Central Africa and the Hadza of Tanzania.",
      children: [
        {
          branchName: "Haplogroup B1",
          snp: ["P1", "M236", "rs17306941"],
          region: "West Africa (Cameroon)",
          description: "A rare and ancient branch of Haplogroup B found primarily in Cameroon."
        },
        {
          branchName: "Haplogroup B2",
          snp: ["M182", "M181", "V2342", "rs9786088"],
          region: "Sub-Saharan Africa",
          description: "The main ancestral branch for most modern Haplogroup B lineages.",
          children: [
            {
              branchName: "B-M8633",
              snp: ["M8633", "CTS11573", "CTS1388", "M8691"],
              region: "Central Africa",
              description: "A sub-branch of Haplogroup B common in the Congo Basin."
            },
            {
              branchName: "B-V2342",
              snp: ["V2342", "BY14680", "L1453"],
              region: "East Africa",
              description: "A sub-branch found in East African populations like the Hadza."
            },
            {
              branchName: "Haplogroup B2a",
              snp: ["M150", "rs9785934", "V1047"],
              region: "Central Africa",
              description: "A major branch of Haplogroup B found among Bantu speakers and Pygmy groups.",
              children: [
                { 
                  branchName: "Haplogroup B2a1", 
                  snp: ["M218", "M115", "rs17307018"],
                  region: "Central Africa",
                  children: [
                    { 
                      branchName: "Haplogroup B2a1a", 
                      snp: ["M109", "rs17307019", "rs9786196"],
                      region: "Central Africa",
                      description: "Found in Central African populations."
                    }
                  ]
                }
              ]
            },
            {
              branchName: "Haplogroup B2b",
              snp: ["M112", "M192", "M247", "rs17307044", "P6"],
              region: "Southern Africa",
              description: "The most frequent branch of Haplogroup B among the Khoisan peoples of Southern Africa.",
              children: [
                { 
                  branchName: "Haplogroup B2b1", 
                  snp: ["M116.1", "M211", "rs17307047"],
                  region: "Southern Africa",
                  description: "A major marker for certain San groups."
                },
                { 
                  branchName: "Haplogroup B2b2", 
                  snp: ["P85", "P90", "M152", "rs17307052"],
                  region: "Southern Africa",
                  description: "Common among Khoisan hunter-gatherers."
                },
                { 
                  branchName: "Haplogroup B2b3", 
                  snp: ["rs17307044", "P7"],
                  region: "Southern Africa",
                  description: "Specific to South African indigenous populations."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      branchName: "Haplogroup C",
      snp: ["M130", "i4000008"],
      region: "Asia / Oceania / North America",
      description: "A major lineage that participated in the early coastal migration out of Africa. It is found at high frequencies in Mongolia, Siberia, Australia, and among some Native American groups.",
      children: [
        { 
          branchName: "Haplogroup C-P39", 
          snp: ["P39"],
          region: "North America",
          description: "Found among indigenous populations of North America, particularly Na-Dené speakers (Athabaskan)."
        },
        { 
          branchName: "Haplogroup C2", 
          snp: ["M217", "rs2032621", "i4000043"],
          region: "Central/East Asia",
          description: "The most common branch of Haplogroup C, widespread in Mongolia, Siberia, and Central Asia. Associated with the expansion of the Mongol Empire."
        }
      ]
    },
    { 
      branchName: "Haplogroup D", 
      snp: ["M174", "i4000010"],
      region: "East Asia / Andaman Islands",
      description: "A unique lineage found at high frequencies in Tibet, Japan (Ainu), and the Andaman Islands. It represents an early migration into East Asia that was later largely replaced by other groups.",
      children: [
        {
          branchName: "Haplogroup D1",
          snp: ["CTS11577"],
          region: "East Asia / Tibet",
          description: "The primary branch of D found in Tibet and surrounding regions.",
          children: [
            {
              branchName: "Haplogroup D1a1",
              snp: ["M15"],
              region: "Tibet / Southeast Asia",
              description: "Common among Tibeto-Burman speakers and found at low frequencies in Southeast Asia."
            },
            {
              branchName: "Haplogroup D1a2",
              snp: ["P99"],
              region: "Tibet / Central Asia",
              description: "Found primarily in Tibet and among some Central Asian populations."
            },
            {
              branchName: "Haplogroup D1b",
              snp: ["M55", "rs2032622"],
              region: "Japan",
              description: "The 'Ainu' or 'Jomon' marker, found at high frequencies in Japan, particularly among the Ainu people and in Okinawa. It represents the indigenous hunter-gatherer lineage of the Japanese archipelago."
            }
          ]
        },
        {
          branchName: "Haplogroup D2",
          snp: ["L1378"],
          region: "Andaman Islands / Philippines",
          description: "Found among the Onge and Jarawa people of the Andaman Islands and the Mamanwa of the Philippines."
        }
      ]
    },
    {
      branchName: "Haplogroup E",
      snp: ["M96", "P29", "rs9306841", "rs17306671", "rs9305854", "i4000014", "rs3900"],
      region: "Africa",
      description: "One of the most widespread Y-DNA lineages in the world, originating in Africa. It is the dominant lineage across the African continent, particularly in Sub-Saharan Africa, North Africa, and the Horn of Africa, with significant historical subclades also spreading into Europe and the Middle East.",
      children: [
        {
          branchName: "Haplogroup E1a",
          snp: ["M33", "rs9786107", "i4000016", "M132", "rs35191570"],
          region: "West Africa",
          description: "Found primarily in West Africa, especially in Mali, Gambia, and among the Dogon people.",
          children: [
            { 
              branchName: "Haplogroup E1a1", 
              snp: ["M132"],
              region: "West Africa",
              description: "A common subclade in the Sahel region."
            }
          ]
        },
        {
          branchName: "Haplogroup E1b1a",
          snp: ["M2", "V38", "rs9785941", "rs9786172", "i4000012", "rs3904", "rs144365313", "rs34767228", "rs2032653"],
          region: "Sub-Saharan Africa",
          description: "The dominant lineage in Sub-Saharan Africa, strongly associated with the Bantu expansion that spread agriculture and iron-working across Central, Eastern, and Southern Africa over the last 3,000 years.",
          children: [
            {
              branchName: "Haplogroup E1b1a1",
              snp: ["M180", "rs9786207"],
              region: "West/Central Africa",
              description: "The core lineage of the Bantu expansion.",
              children: [
                {
                  branchName: "Haplogroup E1b1a1a1",
                  snp: ["U175", "rs34195338"],
                  region: "West/Central Africa",
                  description: "A major lineage across West and Central Africa, common in Nigeria and Ghana.",
                  children: [
                    {
                      branchName: "Haplogroup E1b1a1a1a",
                      snp: ["U174", "rs34166788"],
                      region: "West Africa",
                      description: "Highly prevalent in West African coastal populations.",
                      children: [
                        {
                          branchName: "Haplogroup E1b1a1a1a1",
                          snp: ["M191", "P86", "rs9786219", "i4000033", "rs35817812", "rs35191570"],
                          region: "West Africa",
                          description: "Extremely common in West African populations like the Yoruba, Igbo, and Akan. It is also the most frequent lineage among African Americans.",
                          children: [
                            { 
                              branchName: "Haplogroup E1b1a1a1a1a", 
                              snp: ["L485", "rs13306283", "rs149021271"],
                              region: "West Africa",
                              description: "A major subclade within the M191 branch.",
                              children: [
                                { 
                                  branchName: "Haplogroup E1b1a1a1a1a1", 
                                  snp: ["U209"],
                                  region: "West Africa",
                                  description: "Found at high frequencies in the Bight of Benin region.",
                                  children: [
                                    { 
                                      branchName: "Haplogroup E1b1a1a1a1a1a", 
                                      snp: ["M263.2"],
                                      region: "West Africa",
                                      description: "A specific marker found in West African coastal groups."
                                    }
                                  ]
                                },
                                { 
                                  branchName: "Haplogroup E1b1a1a1a1a2", 
                                  snp: ["L515"],
                                  region: "West Africa",
                                  description: "Found in West African populations."
                                },
                                { 
                                  branchName: "Haplogroup E1b1a1a1a1a3", 
                                  snp: ["L516"],
                                  region: "West Africa",
                                  description: "Found in West African populations."
                                },
                                { 
                                  branchName: "Haplogroup E1b1a1a1a1a4", 
                                  snp: ["L517"],
                                  region: "West Africa",
                                  description: "Found in West African populations."
                                }
                              ]
                            },
                            { 
                              branchName: "Haplogroup E1b1a1a1a2", 
                              snp: ["U290", "rs17306816"],
                              region: "West/Central Africa",
                              description: "Common in the Bight of Biafra and Central African regions."
                            },
                            { 
                              branchName: "Haplogroup E1b1a1a1a3", 
                              snp: ["U181", "rs17306817"],
                              region: "West Africa",
                              description: "Found in West African populations."
                            }
                          ]
                        }
                      ]
                    },
                    { 
                      branchName: "Haplogroup E1b1a1a1b", 
                      snp: ["M154", "rs17306815"],
                      region: "Central Africa",
                      description: "Found in Central African populations."
                    }
                  ]
                },
                { 
                  branchName: "Haplogroup E1b1a1b", 
                  snp: ["M116.2"],
                  region: "East Africa",
                  description: "Found in East African populations."
                },
                { 
                  branchName: "Haplogroup E1b1a1a2", 
                  snp: ["M58"],
                  region: "West Africa",
                  description: "Found in West Africa."
                },
                { 
                  branchName: "Haplogroup E1b1a1a4", 
                  snp: ["M149"],
                  region: "East Africa",
                  description: "Found in East Africa."
                },
                { 
                  branchName: "Haplogroup E1b1a1a5", 
                  snp: ["M155"],
                  region: "East Africa",
                  description: "Found in East Africa."
                },
                { 
                  branchName: "Haplogroup E1b1a1a6", 
                  snp: ["M10"],
                  region: "Central Africa",
                  description: "Found in Central Africa."
                },
                { 
                  branchName: "Haplogroup E1b1a1a7", 
                  snp: ["M200"],
                  region: "Central Africa",
                  description: "Found in Central Africa."
                }
              ]
            },
            { 
              branchName: "Haplogroup E1b1a2", 
              snp: ["V38", "rs372947788"],
              region: "West Africa",
              description: "A basal branch of E-V38 found in West Africa."
            }
          ]
        },
        {
          branchName: "Haplogroup E1b1b",
          snp: ["M215", "M35", "rs2032654", "rs375228668", "rs28357984", "L539", "PF2431"],
          region: "North Africa / Horn of Africa / Mediterranean",
          description: "A major lineage in North Africa, the Horn of Africa, and the Mediterranean. It is associated with the spread of Afroasiatic languages and early farming movements into Europe.",
          children: [
            {
              branchName: "Haplogroup E1b1b1",
              snp: ["M35", "rs28357984", "i4000018", "rs9306842"],
              region: "North Africa / Horn of Africa",
              description: "The primary branch of E1b1b.",
              children: [
                {
                  branchName: "Haplogroup E1b1b1a",
                  snp: ["V68", "rs147571223"],
                  region: "North Africa / Mediterranean",
                  description: "A major branch found across North Africa and Southern Europe.",
                  children: [
                    {
                      branchName: "Haplogroup E1b1b1a1",
                      snp: ["M78", "rs9305888", "i4000024", "V12", "V13", "V22", "V65"],
                      region: "North Africa / Balkans",
                      description: "Widespread in North Africa and the Balkans. It is believed to have originated in Northeast Africa.",
                      children: [
                        { 
                          branchName: "Haplogroup E1b1b1a1a", 
                          snp: ["V12", "rs148064093"],
                          region: "Egypt / Sudan",
                          description: "The most common subclade in Southern Egypt and Sudan.",
                          children: [
                            { 
                              branchName: "Haplogroup E1b1b1a1a1", 
                              snp: ["M224"],
                              region: "Near East",
                              description: "A rare subclade found in the Near East."
                            },
                            { 
                              branchName: "Haplogroup E1b-Z834", 
                              snp: ["Z834"],
                              region: "Northeast Africa",
                              description: "Found in Northeast Africa."
                            }
                          ]
                        },
                        { 
                          branchName: "Haplogroup E1b1b1a1b", 
                          snp: ["V13", "rs11800462", "rs144618774"],
                          region: "Balkans / Europe",
                          description: "The most common E1b1b branch in Europe, particularly in the Balkans (Albania, Greece, Kosovo). It is associated with the expansion of farming and later Bronze/Iron Age movements in Southeast Europe.",
                          children: [
                    { 
                      branchName: "Haplogroup E1b1b1a1b1", 
                      snp: ["P177", "CTS5876", "rs17306818"],
                      region: "Balkans",
                      description: "A common subclade in the Balkan region."
                    },
                            { 
                              branchName: "Haplogroup E-CTS5876", 
                              snp: ["CTS5876"], 
                              region: "Balkans", 
                              description: "A major subclade of V13 found primarily in the Balkan peninsula." 
                            }
                          ]
                        },
                        { 
                          branchName: "Haplogroup E1b1b1a1c", 
                          snp: ["V22", "rs149747468", "rs17306812"],
                          region: "Egypt / Levant",
                          description: "Common in Egypt, the Levant, and the Arabian Peninsula."
                        },
                        { 
                          branchName: "Haplogroup E1b1b1a1d", 
                          snp: ["V65", "rs149501565", "rs17306821"],
                          region: "Northwest Africa (Maghreb)",
                          description: "Found at high frequencies among Berbers in Libya, Tunisia, and Morocco."
                        }
                      ]
                    },
                    { 
                      branchName: "Haplogroup E1b1b1a2", 
                      snp: ["V32", "rs200867114"],
                      region: "Horn of Africa",
                      description: "The dominant lineage in Somalia and among the Oromo of Ethiopia."
                    },
                    { 
                      branchName: "Haplogroup E1b1b1a3", 
                      snp: ["V264"],
                      region: "East Africa",
                      description: "Found in East African populations."
                    }
                  ]
                },
                {
                  branchName: "Haplogroup E1b1b1b1",
                  snp: ["M81", "rs9786119", "i4000019", "M183", "L19"],
                  region: "Northwest Africa (Maghreb)",
                  description: "The 'Berber' marker, found at very high frequencies among Berber-speaking populations in Morocco, Algeria, and Tunisia. It is almost entirely restricted to Northwest Africa.",
                  children: [
                    { 
                      branchName: "Haplogroup E1b1b1b1a", 
                      snp: ["M107"],
                      region: "Northwest Africa",
                      description: "A common subclade within the Berber populations."
                    },
                    { 
                      branchName: "Haplogroup E1b1b1b1b", 
                      snp: ["M183"],
                      region: "Northwest Africa",
                      description: "The most frequent subclade of E-M81."
                    }
                  ]
                },
                {
                  branchName: "Haplogroup E1b1b1c",
                  snp: ["M123", "rs2032655", "i4000020"],
                  region: "Levant / Near East",
                  description: "Common in the Levant (Palestine, Lebanon, Israel) and found at low frequencies in Southern Europe.",
                  children: [
                    { 
                      branchName: "Haplogroup E1b1b1c1", 
                      snp: ["M34"],
                      region: "Levant",
                      description: "The primary subclade of E-M123."
                    }
                  ]
                },
                { 
                  branchName: "Haplogroup E1b1b1d", 
                  snp: ["M293"],
                  region: "East Africa",
                  description: "Found in East African populations, particularly among Cushitic speakers."
                },
                { 
                  branchName: "Haplogroup E1b1b1e", 
                  snp: ["M329"],
                  region: "Ethiopia",
                  description: "Specific to Ethiopian populations."
                }
              ]
            },
            { 
              branchName: "Haplogroup E1b1b2", 
              snp: ["M281"],
              region: "Ethiopia",
              description: "A rare branch found in Ethiopia."
            }
          ]
        },
        { 
          branchName: "Haplogroup E2", 
          snp: ["M75", "rs9786142", "i4000022"],
          region: "East/Southern Africa",
          description: "Found primarily in East and Southern Africa.",
          children: [
            { 
              branchName: "Haplogroup E2a", 
              snp: ["M54"],
              region: "East Africa",
              description: "Found in East African populations."
            },
            { 
              branchName: "Haplogroup E2b", 
              snp: ["M85"],
              region: "Southern Africa",
              description: "Found in Southern African populations."
            }
          ]
        }
      ]
    },
    {
      branchName: "Haplogroup G",
      snp: ["M201", "i4000011"],
      region: "Caucasus / Middle East / Europe",
      description: "A lineage associated with the spread of early Neolithic farmers from the Near East into Europe. It is found at its highest frequencies in the Caucasus Mountains (Georgia, Ossetia).",
      children: [
        { 
          branchName: "Haplogroup G2a", 
          snp: ["P15", "rs2032626", "i4000044"],
          region: "Caucasus / Europe",
          description: "The most common branch of Haplogroup G in Europe, representing the legacy of the first European farmers."
        }
      ]
    },
    {
      branchName: "Haplogroup H",
      snp: ["M69", "i4000013"],
      region: "South Asia",
      description: "The primary paternal lineage of South Asia, found at high frequencies across the Indian subcontinent and among Romani populations in Europe.",
      children: [
        { 
          branchName: "Haplogroup H1", 
          snp: ["M52", "rs2032628", "i4000045"],
          region: "South Asia",
          description: "The most common branch of Haplogroup H."
        }
      ]
    },
    {
      branchName: "Haplogroup I",
      snp: ["M170", "i4000015"],
      region: "Europe",
      description: "One of the few major haplogroups that originated in Europe. It represents the lineage of the European hunter-gatherers who survived the Last Glacial Maximum.",
      children: [
        {
          branchName: "Haplogroup I1",
          snp: ["M253", "rs2032631", "i4000046"],
          region: "Northern Europe",
          description: "The 'Viking' or 'Scandinavian' marker, found at high frequencies in Norway, Sweden, and Denmark.",
          children: [
            { 
              branchName: "Haplogroup I1a", 
              snp: ["DF29"],
              region: "Northern Europe",
              description: "The main branch of I1."
            }
          ]
        },
        {
          branchName: "Haplogroup I2",
          snp: ["M438", "rs2032632", "i4000047"],
          region: "Southeastern Europe / Balkans",
          description: "Found at high frequencies in the Balkans (Bosnia, Croatia, Serbia) and Sardinia.",
          children: [
            { 
              branchName: "Haplogroup I2a", 
              snp: ["P37.2"],
              region: "Balkans",
              description: "The most common branch of I2 in the Balkan region."
            },
            { 
              branchName: "Haplogroup I2b", 
              snp: ["M436"],
              region: "Northwestern Europe",
              description: "Found primarily in Germany and the British Isles."
            }
          ]
        }
      ]
    },
    {
      branchName: "Haplogroup J",
      snp: ["M304", "i4000017"],
      region: "Middle East / Mediterranean",
      description: "A major lineage associated with the spread of Semitic languages and the expansion of agriculture and pastoralism in the Near East.",
      children: [
        {
          branchName: "Haplogroup J1",
          snp: ["M267", "rs2032635", "i4000048"],
          region: "Middle East / North Africa",
          description: "The 'Arabic' marker, found at very high frequencies in the Arabian Peninsula and among Semitic-speaking populations.",
          children: [
            { 
              branchName: "Haplogroup J1a2b", 
              snp: ["P58"],
              region: "Arabian Peninsula",
              description: "The most common subclade of J1 in the Arab world."
            }
          ]
        },
        {
          branchName: "Haplogroup J2",
          snp: ["M172", "rs2032636", "i4000049"],
          region: "Middle East / Mediterranean / South Asia",
          description: "Associated with the expansion of early civilizations in the Fertile Crescent, including the Phoenicians, Greeks, and Romans.",
          children: [
            { 
              branchName: "Haplogroup J2a", 
              snp: ["M410"],
              region: "Mediterranean / Near East",
              description: "Common in Crete, Italy, and Anatolia."
            },
            { 
              branchName: "Haplogroup J2b", 
              snp: ["M12"],
              region: "Balkans / South Asia",
              description: "Found in the Balkans and among some Indian populations."
            }
          ]
        }
      ]
    },
    {
      branchName: "Haplogroup L",
      snp: ["M20", "i4000021"],
      region: "South Asia / Middle East",
      description: "Found primarily in South Asia (India, Pakistan) and at lower frequencies in the Middle East.",
      children: [
        { 
          branchName: "Haplogroup L1", 
          snp: ["M76", "rs2032641", "i4000050"],
          region: "South Asia",
          description: "The most common branch of Haplogroup L."
        }
      ]
    },
    {
      branchName: "Haplogroup N",
      snp: ["M231", "i4000023"],
      region: "Northern Eurasia / Siberia",
      description: "A lineage associated with Uralic-speaking populations, found at high frequencies in Finland, the Baltic states, and across Northern Siberia.",
      children: [
        { 
          branchName: "Haplogroup N1c", 
          snp: ["Tat", "rs2032644", "i4000051"],
          region: "Northern Europe / Siberia",
          description: "The primary branch of Haplogroup N in Northern Europe."
        }
      ]
    },
    {
      branchName: "Haplogroup O",
      snp: ["M175", "i4000025"],
      region: "East Asia / Southeast Asia / Oceania",
      description: "The dominant paternal lineage of East and Southeast Asia, found in over half of all men in China, Japan, and Korea.",
      children: [
        { 
          branchName: "Haplogroup O1", 
          snp: ["MSY2.2", "rs2032647", "i4000052"],
          region: "Southeast Asia / Taiwan",
          description: "Associated with Austronesian-speaking populations."
        },
        { 
          branchName: "Haplogroup O2", 
          snp: ["P31", "rs2032648", "i4000053"],
          region: "Southeast Asia",
          description: "Common in Southeast Asia, particularly in Austroasiatic-speaking groups."
        },
        { 
          branchName: "Haplogroup O3", 
          snp: ["M122", "rs2032649", "i4000054"],
          region: "East Asia",
          description: "The most frequent branch of Haplogroup O, dominant among Han Chinese."
        }
      ]
    },
    {
      branchName: "Haplogroup Q",
      snp: ["M242", "i4000026"],
      region: "Central Asia / Siberia / Americas",
      description: "The primary paternal lineage of Native Americans, also found at high frequencies in parts of Siberia and Central Asia.",
      children: [
        { 
          branchName: "Haplogroup Q-M3", 
          snp: ["M3", "rs2032652", "i4000055"],
          region: "Americas",
          description: "The 'Native American' marker, found in nearly all indigenous groups of North and South America."
        }
      ]
    },
    {
      branchName: "Haplogroup R",
      snp: ["M207", "i4000028"],
      region: "Europe / South Asia / Central Asia",
      description: "The most common paternal lineage in Western Eurasia, split into two major branches that dominate Europe and South Asia respectively.",
      children: [
        {
          branchName: "Haplogroup R1a",
          snp: ["M420", "L146"],
          region: "Eastern Europe / South Asia / Central Asia",
          description: "Associated with the expansion of Indo-European languages.",
          children: [
            { 
              branchName: "Haplogroup R1a1", 
              snp: ["SRY10831.2", "M17", "M198", "rs2032657", "i4000056"],
              region: "Eastern Europe / South Asia",
              description: "The most common branch of R1a.",
              children: [
                {
                  branchName: "Haplogroup R1a-Z93",
                  snp: ["Z93", "Z94", "rs34614619"],
                  region: "South Asia / Central Asia",
                  description: "The 'Indo-Aryan' branch of R1a, dominant among Indo-European speaking populations of the Indian subcontinent and Central Asia."
                }
              ]
            }
          ]
        },
        {
          branchName: "Haplogroup R1b",
          snp: ["M343", "i4000029"],
          region: "Western Europe / Central Africa",
          description: "The dominant lineage of Western Europe, found in over 80% of men in Ireland, Scotland, and Wales. Also found in a unique branch in Central Africa (Chad/Cameroon).",
          children: [
            {
              branchName: "Haplogroup R1b1a2",
              snp: ["M269", "rs2032658", "i4000057"],
              region: "Western Europe",
              description: "The primary branch of R1b in Europe.",
              children: [
                { 
                  branchName: "Haplogroup R1b-L21", 
                  snp: ["L21"],
                  region: "British Isles / France",
                  description: "The 'Celtic' marker, dominant in Ireland and Britain."
                },
                { 
                  branchName: "Haplogroup R1b-U152", 
                  snp: ["U152"],
                  region: "Central Europe / Italy",
                  description: "The 'Italo-Celtic' marker, common in the Alps and Italy."
                },
                { 
                  branchName: "Haplogroup R1b-U106", 
                  snp: ["U106"],
                  region: "Northern Europe / Germany",
                  description: "The 'Germanic' marker, common in Germany, the Netherlands, and England."
                }
              ]
            },
            { 
              branchName: "Haplogroup R1b1c", 
              snp: ["V88"],
              region: "Central Africa",
              description: "A unique branch of R1b found at high frequencies in the Lake Chad basin, representing an ancient back-migration to Africa."
            }
          ]
        }
      ]
    },
    {
      branchName: "Haplogroup H",
      snp: ["L901", "M2713"],
      region: "South Asia (India/Pakistan)",
      description: "Found at its highest frequencies in South Asia, particularly among Dravidian and tribal populations of India. It represents a major indigenous lineage of the subcontinent.",
      children: [
        {
          branchName: "Haplogroup H1",
          snp: ["M69", "rs2032629"],
          region: "South Asia",
          description: "The primary branch of H, very common across India.",
          children: [
            {
              branchName: "Haplogroup H1a1",
              snp: ["M52", "rs2032628"],
              region: "India / Sri Lanka",
              description: "A major subclade prevalent in the South subcontinent."
            }
          ]
        },
        {
          branchName: "Haplogroup H3",
          snp: ["Z5857"],
          region: "South Asia / Romani",
          description: "Found in India and at high frequencies among the Romani (Gypsy) people, confirming their Indian origins."
        }
      ]
    },
    {
      branchName: "Haplogroup R2",
      snp: ["M479", "L266"],
      region: "South Asia / Central Asia",
      description: "Found primarily in South Asia (India, Pakistan) and occasionally in Central Asia and the Caucasus.",
      children: [
        {
          branchName: "Haplogroup R2a",
          snp: ["M124"],
          region: "South Asia",
          description: "The most frequent branch of R2 in the Indian subcontinent."
        }
      ]
    },
    {
      branchName: "Haplogroup T",
      snp: ["M184", "i4000030"],
      region: "Middle East / East Africa / Europe",
      description: "A lineage found at low frequencies across Western Eurasia and East Africa, associated with early maritime and pastoral movements.",
      children: [
        { 
          branchName: "Haplogroup T1", 
          snp: ["M70", "rs2032661", "i4000058"],
          region: "Middle East / East Africa",
          description: "The primary branch of Haplogroup T."
        }
      ]
    }
  ]
};

export const MT_DNA_TREE: HaplogroupNode = {
  branchName: "mtDNA Root (Eve)",
  mutations: [],
  historicalContext: "The common maternal ancestor of all living humans, estimated to have lived roughly 150,000 to 200,000 years ago in East Africa. Her lineage is the source of all mitochondrial DNA passed down from mother to child today.",
  children: [
    {
      branchName: "Haplogroup L0",
      mutations: ["T146C", "C182T", "A189G", "C195T", "T198C", "G200A", "T247C", "A523d", "C524d", "A769G", "A825t", "C1018T", "G2758A", "C3516A", "G3591A", "G4104A", "T4312C", "T5442C", "T7146C", "T7256C", "A7521G", "T8448C", "C8468T", "T8655C", "G9540A", "C10394T", "A10664G", "A10688G", "C10810T", "C10873T", "A10915G", "A11719G", "A11914G", "G12007A", "T12720C", "A13105G", "G13276A", "T13506C", "T13650C", "T14766C", "A15326G", "G16129A", "T16187C", "C16189T", "G16230A", "T16278C", "C16311T"],
      region: "Southern Africa",
      description: "The oldest branch of the human maternal tree, found at its highest frequencies among the Khoisan-speaking peoples of Southern Africa. It represents the most ancient surviving maternal lineage.",
      historicalContext: "L0 emerged over 130,000 years ago. Its persistence in Southern African hunter-gatherer populations provides a direct link to some of the earliest chapters of human evolution in the Kalahari region.",
      children: [
        { branchName: "L0a", mutations: ["G16209A", "T16230A"], region: "East/Central Africa" },
        { branchName: "L0d", mutations: ["C16168T", "A16247G"], region: "Southern Africa (San)" },
        { branchName: "L0k", mutations: ["T16224C", "C16266T"], region: "Southern Africa (Khoi)" }
      ]
    },
    {
      branchName: "Haplogroup L1",
      mutations: ["G3666A", "G3915A", "G3992A", "G4025A", "G4312A", "G4820A", "T6366C", "C7028T", "G8697A", "G9380A", "G10394A", "G10400A", "G10873A", "G12007A", "G12720A", "G13105A", "G13276A", "G13506A", "G13650A", "G14766A", "G15326A", "G16129A", "G16187A", "G16189A", "G16223A", "G16230A", "G16278A", "G16311A"],
      region: "Central/West Africa",
      description: "An ancient African lineage found primarily in Central and West Africa, particularly among Pygmy populations.",
      historicalContext: "Originating around 110,000 to 140,000 years ago, L1 is one of the foundational lineages of Central Africa, often associated with the early forest-dwelling ancestors of modern Pygmy groups.",
      children: [
        { branchName: "L1b", mutations: ["T16126C", "C16264T"], region: "West Africa" },
        { branchName: "L1c", mutations: ["T16187C", "C16189T"], region: "Central Africa" }
      ]
    },
    {
      branchName: "Haplogroup L2",
      mutations: ["G143A", "G1189A", "G2416A", "G3915A", "G4104A", "G4820A", "G7028A", "G8206A", "G9221A", "G10115A", "G10394A", "G10400A", "G10873A", "G11914A", "G12007A", "G12720A", "G13105A", "G13506A", "G13708A", "G14766A", "G15301A", "G15326A", "G16129A", "G16189A", "G16223A", "G16278A", "G16311A", "G16390A"],
      region: "Sub-Saharan Africa",
      description: "The most common and diverse maternal lineage in Africa, found across the entire continent. It is strongly associated with the Bantu expansion.",
      historicalContext: "L2 appeared around 70,000 to 90,000 years ago. Its massive distribution today is a direct result of the Bantu migrations starting 3,000 years ago, which carried agriculture and ironworking technology across much of sub-Saharan Africa.",
      children: [
        { branchName: "L2a", mutations: ["G16356A"], region: "West/Central/East Africa" },
        { branchName: "L2b", mutations: ["G16114A", "G16213A"], region: "West Africa" },
        { branchName: "L2c", mutations: ["G16209A"], region: "West Africa" },
        { branchName: "L2d", mutations: ["G16145A"], region: "West Africa" }
      ]
    },
    {
      branchName: "Haplogroup L4",
      mutations: ["G16230A", "T16311C"],
      region: "East Africa",
      description: "A lineage primarily found in East Africa, particularly among Hadza and Sandawe populations."
    },
    {
      branchName: "Haplogroup L5",
      mutations: ["C16148T", "C16187T", "C16189T"],
      region: "East Africa",
      description: "Found in East Africa, especially among Mbuti Pygmies."
    },
    {
      branchName: "Haplogroup L6",
      mutations: ["T16223C", "C16311T"],
      region: "Yemen / Ethiopia",
      description: "A rare lineage found in Yemen and Ethiopia."
    },
    {
      branchName: "Haplogroup L3",
      mutations: ["G760A", "G1014A", "G3594A", "G4104A", "G7028A", "G7256A", "G7521A", "G8468A", "G8655A", "G9540A", "G10394A", "G10400A", "G10810A", "G10873A", "G12720A", "G13105A", "G13276A", "G13506A", "G13650A", "G14766A", "G15326A", "G16129A", "G16223A", "G16311A"],
      region: "East Africa / Global Ancestor",
      description: "A pivotal lineage that originated in East Africa. It is the ancestor of all non-African maternal lineages (Haplogroups M and N).",
      historicalContext: "L3 arose ~70,000 years ago in East Africa. Its most significant historical role is that it provided the founding populations for the 'Out of Africa' migration, giving rise to all modern non-African populations.",
      children: [
        { branchName: "L3b", mutations: ["G16124A", "G16278A"], region: "West Africa" },
        { branchName: "L3d", mutations: ["G16124A", "G16223A"], region: "West/Central Africa" },
        { branchName: "L3e", mutations: ["G16327A"], region: "Central/Southern Africa" },
        { branchName: "L3f", mutations: ["G16209A"], region: "East Africa" },
        {
          branchName: "Haplogroup M",
          mutations: ["G489A", "G10400A", "G14783A", "G15043A"],
          region: "Asia / Oceania / Americas",
          description: "One of the two major lineages that migrated out of Africa. It is dominant in South and East Asia.",
          historicalContext: "M is one of the two main branches that left Africa ~65,000 years ago. It followed a rapid coastal route across South Asia and into Oceania, becoming a cornerstone of Asian genetic diversity.",
          children: [
            { branchName: "M1", mutations: ["T16129C", "C16189T", "T16223C", "G16249A", "T16311C"], region: "North Africa / Near East / East Africa", description: "The only branch of M that is common in Africa, specifically North and East Africa." },
            { 
              branchName: "M2-M6", 
              mutations: ["C16223T"], 
              region: "South Asia (India)", 
              description: "A group of ancient branches largely endemic to the Indian subcontinent.",
              children: [
                { branchName: "M2", mutations: ["G447G", "C16223T"], region: "South Asia" },
                { branchName: "M3", mutations: ["G482A", "C16223T"], region: "South Asia" },
                { branchName: "M5", mutations: ["C16223T", "A16311G"], region: "South Asia" }
              ]
            },
            { branchName: "M30", mutations: ["G16223A", "G16311A"], region: "South Asia", description: "A widespread South Asian branch." },
            { branchName: "M33", mutations: ["G16223A"], region: "South Asia" },
            { branchName: "M7", mutations: ["G16297A"], region: "East Asia (Japan/China)" },
            { branchName: "M8", mutations: ["G16319A"], region: "East Asia", children: [
              { branchName: "CZ", mutations: ["G16298A"], children: [
                { branchName: "C", mutations: ["G16327A"], region: "Siberia / Americas" },
                { branchName: "Z", mutations: ["G16185A"], region: "Northern Eurasia" }
              ]}
            ]},
            { branchName: "M9", mutations: ["G16223A", "G16311A"], region: "East Asia" },
            { branchName: "M10", mutations: ["G16129A"], region: "East Asia" },
            { 
              branchName: "Haplogroup D", 
              mutations: ["G16362A"], 
              region: "East Asia / Americas",
              historicalContext: "D is a widespread East Asian lineage and another founding member of the Native American gene pool. It is especially common in Siberia and East Asia."
            },
            { 
              branchName: "Haplogroup G", 
              mutations: ["G16223A"], 
              region: "East Asia / Siberia",
              historicalContext: "G originated in East Asia and is common among populations in the Altai region and Northern China."
            },
            { branchName: "Q", mutations: ["G16129A", "G16223A"], region: "Oceania" },
            { branchName: "E", mutations: ["T16311C", "G16362A"], region: "Island Southeast Asia / Oceania" }
          ]
        },
        {
          branchName: "Haplogroup N",
          mutations: ["G8701A", "G9540A", "G10398A", "G10873A", "G15301A"],
          region: "Eurasia / Oceania / Americas",
          description: "The other major lineage that migrated out of Africa. It is the ancestor of almost all European and many Asian lineages.",
          historicalContext: "N likely branched early from L3 after the exit from Africa. It moved into Southwest Asia and then radiated into Europe and Northern Asia, serving as the common maternal ancestor for nearly all West Eurasians.",
          children: [
            { branchName: "N1", mutations: ["G16147A", "G16223A"], children: [
              { branchName: "I", mutations: ["G16129A", "G16223A"], region: "Europe / Near East" }
            ]},
            { branchName: "N2", mutations: ["G16223A"], children: [
              { branchName: "W", mutations: ["G16223A", "G16292A"], region: "Europe / South Asia" }
            ]},
            { branchName: "U2", mutations: ["G16129A", "C16189T"], region: "South Asia / Central Asia / Europe", children: [
              { branchName: "U2i", mutations: ["A16129G", "C16189T"], region: "South Asia" },
              { branchName: "U2e", mutations: ["G16129A"], region: "Europe" }
            ]},
            { branchName: "U7", mutations: ["G16311A", "C16318T"], region: "South Asia / Middle East", description: "Found primarily in India, Iran, and the Caucasus." },
            { branchName: "N9", mutations: ["T16223C", "G16311A"], region: "East Asia / Siberia / Japan", children: [
              { branchName: "Y", mutations: ["G16126C", "G16231A"], region: "Siberia / East Asia" }
            ]},
            { 
              branchName: "Haplogroup A", 
              mutations: ["G16223A", "G16290A", "G16319A"], 
              region: "East Asia / Americas",
              historicalContext: "A is one of the founding lineages of the Americas. It is found across North and Central Asia and reached high frequencies among the indigenous peoples of North America."
            },
            { 
              branchName: "Haplogroup S", 
              mutations: ["G16223A"], 
              region: "Australia",
              historicalContext: "S is a lineage found exclusively among Indigenous Australians, representing an ancient isolation of over 50,000 years."
            },
            { branchName: "O", mutations: ["T16093C", "C16261T"], region: "Oceania / Southeast Asia" },
            {
              branchName: "Haplogroup X",
              mutations: ["A153G", "C6221T", "G14470A", "T16189C", "T16278C"],
              region: "Middle East / Europe / North America",
              description: "A rare but widely dispersed West Eurasian lineage. It is unique for being found in both Europe, the Near East, and among certain Native American groups (Algonquian speakers). It represents an ancient migration that reached the Americas independently of the main Beringian waves.",
              historicalContext: "X is one of the most enigmatic haplogroups. It likely originated in the Near East ~30,000 years ago. Its presence in pre-Columbian North America (X2a) has sparked many theories about ancient transatlantic migrations, though genetic evidence points to a Siberian route for its American branch.",
              children: [
                { branchName: "X1", mutations: ["T146C", "T152C"], region: "North/East Africa / Near East" },
                { 
                  branchName: "X2", 
                  mutations: ["C195T", "A247G"], 
                  region: "Europe / Near East / North America",
                  children: [
                    { branchName: "X2a", mutations: ["A200G", "T16213C", "G16213A", "C16278T"], region: "North America (Native American)" },
                    { branchName: "X2b", mutations: ["T226C", "G16189C"], region: "Europe / Near East" },
                    { branchName: "X2c", mutations: ["T146C", "T152C", "T16223C", "G16248A"], region: "Europe" },
                    { branchName: "X2d", mutations: ["T16223C", "G16391A", "A16248G"], region: "Europe / Middle East" },
                    { branchName: "X2e", mutations: ["G15310A", "T16223C"], region: "Europe / Middle East" },
                    { branchName: "X2f", mutations: ["G16390A"], region: "Caucasus / Middle East" }
                  ]
                }
              ]
            },
            {
              branchName: "Haplogroup R",
              mutations: ["G12705A", "G16223A"],
              region: "Eurasia",
              description: "A major sub-branch of N that gave rise to many of the most common European and South Asian lineages.",
              historicalContext: "Haplogroup R is essentially the 'grandparent' of most European maternal lines. It emerged over 50,000 years ago in Southwest Asia and gave rise to major subclades like H, V, J, and T, which successfully colonized the European continent during and after the Ice Age.",
              children: [
                { branchName: "R0", mutations: ["G16129A"], children: [
                  { branchName: "HV", mutations: ["G16129A"], children: [
                    { 
                      branchName: "Haplogroup H", 
                      mutations: ["G2706A", "G7028A"], 
                      region: "Europe / Near East", 
                      description: "The most common maternal lineage in Europe.",
                      historicalContext: "H is the dominant maternal lineage in Europe, found in nearly half of all native Europeans. It expanded rapidly across the continent following the Last Glacial Maximum (around 15,000 years ago) as humans re-colonized Northern Europe from southern refugia like the Franco-Cantabrian region."
                    },
                    { 
                      branchName: "Haplogroup V", 
                      mutations: ["G4580A", "G16298A"], 
                      region: "Northern Europe",
                      historicalContext: "Haplogroup V is often called the 'Saami marker' because it occurs at very high frequencies among the Saami people of Northern Scandinavia. It is believed to have expanded from a refuge in Southwest Europe after the last Ice Age."
                    }
                  ]}
                ]},
                { 
                  branchName: "Haplogroup B", 
                  mutations: ["G16189A", "G16217A"], 
                  region: "East Asia / Americas",
                  historicalContext: "B is one of the four founding maternal lineages of the Native American populations. It originated in East Asia and traveled across Beringia, though it is the only one of the 'Big Four' American haplogroups that has not been found in ancient remains from Northern Siberia as frequently as others."
                },
                { 
                  branchName: "Haplogroup F", 
                  mutations: ["G16304A"], 
                  region: "East Asia",
                  historicalContext: "F is a major lineage in Southeast Asia and Southern China. It is particularly associated with the expansion of rice-farming populations in East Asia."
                },
                { 
                  branchName: "JT", 
                  mutations: ["G16126C"], 
                  children: [
                    { 
                      branchName: "Haplogroup J", 
                      mutations: ["G16069A", "G16126C"], 
                      region: "Europe / Near East",
                      historicalContext: "J is one of the major lineages that arrived in Europe with the first Neolithic farmers from the Near East. It is often linked to the transition from hunter-gathering to agriculture."
                    },
                    { 
                      branchName: "Haplogroup T", 
                      mutations: ["G16126C", "G16294A"], 
                      region: "Europe / Near East",
                      historicalContext: "Similar to J, Haplogroup T is closely associated with the Neolithic revolution and the spread of pastoralism from the Fertile Crescent into Europe and North Africa."
                    }
                  ]
                },
                { branchName: "P", mutations: ["G16129A"], region: "Oceania" },
                { 
                  branchName: "Haplogroup U", 
                  mutations: ["G11467A", "G12308A", "G16270A"], 
                  region: "Europe / Near East / North Africa", 
                  description: "One of the oldest and most diverse lineages in Western Eurasia, originating over 50,000 years ago.",
                  historicalContext: "Haplogroup U originated in Western Asia and was among the first major lineages to settle in Europe. It diversified into several distinct branches (U1-U9). Most notably, U5 is considered the 'signature' lineage of European hunter-gatherers, having survived the Last Glacial Maximum in southern refugia before repopulating the north.",
                  children: [
                  { 
                    branchName: "Haplogroup K", 
                    mutations: ["G10550A", "G12308A"], 
                    region: "Europe / Near East",
                    description: "A major sub-branch of U8 that expanded significantly during the Neolithic period.",
                    historicalContext: "Haplogroup K (technically U8b) emerged in the Near East roughly 30,000 years ago. It is famous for its association with the spread of farming into Europe and its strong presence in Ashkenazi Jewish populations, where it reached high frequencies due to a major founder effect in the Middle Ages."
                  }
                ]}
              ]
            }
          ]
        }
      ]
    }
  ]
};
