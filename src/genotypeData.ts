export interface SNP {
  markerId: string; // Can be rsid or locus name
  rsid?: string;
  aliases?: string[];
  gene: string;
  trait: string;
  continent: string;
  subpop?: string | null;
  description: string;
  alleles: string[];
  significance: 'High' | 'Medium' | 'Low';
  category: 'Health' | 'Ancestry' | 'Lifestyle' | 'Nutrition' | 'Performance';
  interpretations?: Record<string, string>;
  referenceUrl?: string;
  frequencies?: Record<string, number>;
}

export const SNP_DB: SNP[] = [
  // --- Health & Metabolism ---
  { 
    markerId: 'rs429358',
    rsid: 'rs429358', 
    gene: 'APOE', 
    trait: "Alzheimer's Risk (E4)", 
    continent: 'Global', 
    category: 'Health', 
    significance: 'High', 
    alleles: ['C'], 
    description: 'Associated with increased risk of late-onset Alzheimers disease.',
    interpretations: {
      'CC': 'High risk: Carrying two copies of the APOE-ε4 allele is strongly associated with an increased risk of developing late-onset Alzheimer’s disease.',
      'CT': 'Moderate risk: Carrying one copy of the APOE-ε4 allele is associated with a moderately increased risk of developing late-onset Alzheimer’s disease.',
      'TT': 'Lowest risk: Carrying two copies of the APOE-ε3 allele (or other non-ε4 alleles) is associated with the lowest genetic risk for late-onset Alzheimer’s disease.'
    },
    referenceUrl: 'https://www.snpedia.com/index.php/Rs429358'
  },
  { 
    markerId: 'rs9282541',
    rsid: 'rs9282541',
    gene: 'ABCA1 R230C', 
    trait: 'ABCA1 R230C Variant', 
    continent: 'Native American', 
    category: 'Ancestry', 
    significance: 'High', 
    alleles: ['C'], 
    description: 'This marker is nearly exclusive to people with Native American ancestry. It is found across North, Central, and South America rather than a single tribe.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs9282541'
  },
  {
    markerId: 'rs174570',
    rsid: 'rs174570',
    gene: 'FADS2',
    trait: 'Arctic / Sub-Arctic adaptation',
    continent: 'Native American',
    category: 'Ancestry',
    significance: 'High',
    alleles: ['T'],
    description: 'Tied to adapting to cold weather and diets high in fat and protein. Found in groups like the Inuit.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs174570'
  },
  { 
    markerId: 'rs3827760',
    rsid: 'rs3827760',
    gene: 'EDAR V370A', 
    trait: 'EDAR 370A Variant', 
    continent: 'Native American', 
    category: 'Ancestry', 
    significance: 'High', 
    alleles: ['G'], 
    description: 'This marker is found in almost all Native American and East Asian populations. It is linked to traits like thicker hair and specific tooth shapes. It is not tied to one specific tribe.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs3827760'
  },
  { 
    markerId: 'D9S1120',
    gene: 'None', 
    trait: '9-Repeat Allele at D9S1120', 
    continent: 'Native American', 
    category: 'Ancestry', 
    significance: 'High', 
    alleles: ['9'], 
    description: 'Found in about a third of Native Americans and entirely absent from the rest of the world.',
  },
  { 
    markerId: 'O1vG542A',
    gene: 'ABO', 
    trait: 'O1vG542A', 
    continent: 'Native American', 
    category: 'Ancestry', 
    significance: 'High', 
    alleles: ['A'], 
    description: 'A specific mutation for Type O blood that traces back to the first populations in the Americas.',
  },
  { 
    markerId: 'rs7412',
    rsid: 'rs7412', 
    gene: 'APOE', 
    trait: 'Lipid Metabolism (E2)', 
    continent: 'Global', 
    category: 'Health', 
    significance: 'Medium', 
    alleles: ['T'], 
    description: 'Influences cholesterol levels and cardiovascular health.',
    interpretations: {
        'TT': 'Associated with lower cholesterol levels and a potentially lower risk of cardiovascular disease.',
        'TC': 'Neutral effect on cholesterol levels.',
        'CC': 'Associated with higher cholesterol levels and a potentially higher risk of cardiovascular disease.'
    },
    referenceUrl: 'https://www.snpedia.com/index.php/Rs7412'
  },
  { markerId: 'rs1801282', rsid: 'rs1801282', gene: 'PPARG', trait: 'Insulin Sensitivity', continent: 'Global', category: 'Health', significance: 'Medium', alleles: ['G'], description: 'Affects how the body responds to insulin and manages blood sugar.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1801282' },
  { markerId: 'rs1042713', rsid: 'rs1042713', gene: 'ADRB2', trait: 'Exercise Response', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['G'], description: 'Influences airway reactivity and response to certain asthma medications.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1042713' },
  { markerId: 'rs1800795', rsid: 'rs1800795', gene: 'IL6', trait: 'Inflammation Levels', continent: 'Global', category: 'Health', significance: 'Medium', alleles: ['C'], description: 'A marker for systemic inflammation and immune response.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1800795' },

  // --- Ancestry & Physical ---
  { markerId: 'rs1229984', rsid: 'rs1229984', gene: 'ADH1B', trait: 'Alcohol Metabolism', continent: 'East Asian / Native American', category: 'Ancestry', significance: 'High', alleles: ['A'], description: 'Associated with rapid breakdown of alcohol into acetaldehyde.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1229984' },
  { markerId: 'rs17822931', rsid: 'rs17822931', gene: 'ABCC11', trait: 'Earwax & Body Odor', continent: 'East Asian / Native American', category: 'Ancestry', significance: 'Medium', alleles: ['A'], description: 'Determines dry vs. wet earwax and presence of specific body odors.', referenceUrl: 'https://www.snpedia.com/index.php/Rs17822931' },
  { markerId: 'rs16891982', rsid: 'rs16891982', gene: 'SLC45A2', trait: 'Skin Pigmentation', continent: 'East Asian / Native American', category: 'Ancestry', significance: 'Low', alleles: ['G'], description: 'Influences variations in skin, hair, and eye pigmentation.', referenceUrl: 'https://www.snpedia.com/index.php/Rs16891982' },
  { 
    markerId: 'rs671',
    rsid: 'rs671', 
    gene: 'ALDH2', 
    trait: 'Alcohol Flushing', 
    continent: 'East Asian', 
    category: 'Ancestry', 
    significance: 'High', 
    alleles: ['A'], 
    description: 'Associated with alcohol flushing reaction in East Asian populations.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs671'
  },
  { 
    markerId: 'rs1126647',
    rsid: 'rs1126647', 
    gene: 'G6PD', 
    trait: 'G6PD Deficiency / Malaria Resistance', 
    continent: 'African / Mediterranean', 
    category: 'Health', 
    significance: 'Medium', 
    alleles: ['A'], 
    description: 'Associated with G6PD deficiency, providing some resistance to malaria.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs1126647'
  },
  { 
    markerId: 'rs1800407',
    rsid: 'rs1800407', 
    gene: 'HBB', 
    trait: 'Sickle Cell Trait', 
    continent: 'African', 
    category: 'Health', 
    significance: 'High', 
    alleles: ['T'], 
    description: 'Associated with sickle cell trait, providing some resistance to malaria.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs1800407'
  },
  {
    markerId: 'rs2814778',
    rsid: 'rs2814778',
    gene: 'ACKR1',
    trait: 'Duffy Blood Group / Malaria Resistance',
    continent: 'African',
    category: 'Health',
    significance: 'High',
    alleles: ['T'],
    description: 'Associated with the Duffy-null phenotype, which provides resistance to Plasmodium vivax malaria.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs2814778'
  },
  {
    markerId: 'rs73885319',
    rsid: 'rs73885319',
    gene: 'APOL1',
    trait: 'APOL1 Kidney Disease Risk (G1)',
    continent: 'African',
    category: 'Health',
    significance: 'High',
    alleles: ['G'],
    description: 'Associated with an increased risk of chronic kidney disease in individuals of African ancestry.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs73885319'
  },
  { 
    markerId: 'rs3827760',
    rsid: 'rs3827760', 
    gene: 'EDAR', 
    trait: 'East Asian Hair Thickness', 
    continent: 'East Asian', 
    category: 'Ancestry', 
    significance: 'Medium', 
    alleles: ['A'], 
    description: 'Associated with thicker hair and increased sweat gland density in East Asian populations.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs3827760'
  },
  { 
    markerId: 'rs1426654',
    rsid: 'rs1426654', 
    gene: 'SLC24A5', 
    trait: 'Lighter Skin Pigmentation', 
    continent: 'European', 
    category: 'Ancestry', 
    significance: 'High', 
    alleles: ['A'], 
    description: 'Strongly associated with lighter skin pigmentation in European populations.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs1426654'
  },
  { 
    markerId: 'rs12913832',
    rsid: 'rs12913832', 
    gene: 'HERC2', 
    trait: 'Blue Eye Color', 
    continent: 'European', 
    category: 'Ancestry', 
    significance: 'High', 
    alleles: ['T'], 
    description: 'Strongly associated with blue eye color in European populations.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs12913832'
  },

  // --- Lifestyle & Nutrition ---
  { markerId: 'rs762551', rsid: 'rs762551', gene: 'CYP1A2', trait: 'Caffeine Metabolism', continent: 'Global', category: 'Lifestyle', significance: 'Medium', alleles: ['A'], description: 'Determines if you are a "Fast" or "Slow" caffeine metabolizer.', referenceUrl: 'https://www.snpedia.com/index.php/Rs762551' },
  { markerId: 'rs767649', rsid: 'rs767649', gene: 'ADORA2A', trait: 'Caffeine Sensitivity', continent: 'Global', category: 'Lifestyle', significance: 'Medium', alleles: ['T'], description: 'Relates to caffeine-induced anxiety and sleep disruption.', referenceUrl: 'https://www.snpedia.com/index.php/Rs767649' },
  { markerId: 'rs2282679', rsid: 'rs2282679', gene: 'GC', trait: 'Vitamin D Levels', continent: 'Global', category: 'Nutrition', significance: 'Medium', alleles: ['G'], description: 'Influences the transport and binding of Vitamin D in the blood.', referenceUrl: 'https://www.snpedia.com/index.php/Rs2282679' },
  { markerId: 'rs602662', rsid: 'rs602662', gene: 'FUT2', trait: 'Vitamin B12 Absorption', continent: 'Global', category: 'Nutrition', significance: 'Low', alleles: ['A'], description: 'Affects how efficiently your gut absorbs Vitamin B12.', referenceUrl: 'https://www.snpedia.com/index.php/Rs602662' },
  { markerId: 'rs7501331', rsid: 'rs7501331', gene: 'BCMO1', trait: 'Vitamin A Conversion', continent: 'Global', category: 'Nutrition', significance: 'Medium', alleles: ['T'], description: 'Affects conversion of Beta-Carotene to active Vitamin A.', referenceUrl: 'https://www.snpedia.com/index.php/Rs7501331' },

  // --- Physical Performance ---
  { markerId: 'rs1815739', rsid: 'rs1815739', gene: 'ACTN3', trait: 'Muscle Fiber Type', continent: 'Global', category: 'Performance', significance: 'High', alleles: ['C'], description: 'Presence indicates "Fast-Twitch" muscle fibers common in sprinters.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1815739' },
  { markerId: 'rs1801260', rsid: 'rs1801260', gene: 'CLOCK', trait: 'Circadian Rhythm', continent: 'Global', category: 'Lifestyle', significance: 'Low', alleles: ['G'], description: 'Influences whether you are naturally a morning person or night owl.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1801260' },
  { 
    markerId: 'rs1799971',
    rsid: 'rs1799971', 
    gene: 'NOS3', 
    trait: 'Nitric Oxide Production', 
    continent: 'Global', 
    category: 'Performance', 
    significance: 'Medium', 
    alleles: ['T'], 
    description: 'Influences nitric oxide production, which affects blood flow and exercise performance.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs1799971'
  },

  // --- Additional Nutrition & Health ---
  { 
    markerId: 'rs1801133',
    rsid: 'rs1801133', 
    gene: 'MTHFR', 
    trait: 'Folate Metabolism', 
    continent: 'Global', 
    category: 'Nutrition', 
    significance: 'Medium', 
    alleles: ['T'], 
    description: 'Affects the bodys ability to process folate, important for DNA repair and methylation.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs1801133'
  },
  { 
    markerId: 'rs4988235',
    rsid: 'rs4988235', 
    gene: 'LCT', 
    trait: 'Lactose Tolerance', 
    continent: 'Global', 
    category: 'Nutrition', 
    significance: 'High', 
    alleles: ['T'], 
    description: 'Determines the ability to digest lactose into adulthood.',
    interpretations: {
        'TT': 'Lactose tolerant (can digest lactose).',
        'TC': 'Lactose tolerant (can digest lactose).',
        'CC': 'Lactose intolerant (difficulty digesting lactose).'
    },
    referenceUrl: 'https://www.snpedia.com/index.php/Rs4988235'
  },
  { 
    markerId: 'rs113866424',
    rsid: 'rs113866424', 
    gene: 'SLC23A1', 
    trait: 'Vitamin C Transport', 
    continent: 'Global', 
    category: 'Nutrition', 
    significance: 'Low', 
    alleles: ['A'], 
    description: 'Influences the efficiency of Vitamin C transport in the body.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs113866424'
  },
  { markerId: 'rs1805007', rsid: 'rs1805007', gene: 'MC1R', trait: 'Red hair, fair skin', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1805007' },
  { markerId: 'rs1805008', rsid: 'rs1805008', gene: 'MC1R', trait: 'Red hair, increased melanoma risk', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1805008' },
  { markerId: 'rs11547464', rsid: 'rs11547464', gene: 'MC1R', trait: 'Fair skin, freckles', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs11547464' },
  { markerId: 'rs12913832', rsid: 'rs12913832', gene: 'HERC2/OCA2', trait: 'Blue vs. brown eyes', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs12913832' },
  { markerId: 'rs1667394', rsid: 'rs1667394', gene: 'OCA2', trait: 'Eye color', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1667394' },
  { markerId: 'rs1426654', rsid: 'rs1426654', gene: 'SLC24A5', trait: 'Lighter skin (European vs. African)', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1426654' },
  { markerId: 'rs885479', rsid: 'rs885479', gene: 'MC1R', trait: 'Red hair', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs885479' },
  { markerId: 'rs6119471', rsid: 'rs6119471', gene: 'ASIP', trait: 'Hair/skin color', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs6119471' },
  { markerId: 'rs2228479', rsid: 'rs2228479', gene: 'MC1R', trait: 'Hair color modifier', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs2228479' },
  { markerId: 'rs11803731', rsid: 'rs11803731', gene: 'TCHH', trait: 'Hair straightness', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs11803731' },
  { markerId: 'rs17646946', rsid: 'rs17646946', gene: 'FRAS1', trait: 'Hair color', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs17646946' },
  { markerId: 'rs4959270', rsid: 'rs4959270', gene: 'EXOC2', trait: 'Hair color', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs4959270' },
  { markerId: 'rs12821256', rsid: 'rs12821256', gene: 'KITLG', trait: 'Blond hair', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs12821256' },
  { markerId: 'rs2378249', rsid: 'rs2378249', gene: 'PRSS53', trait: 'Hair curl', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs2378249' },
  { markerId: 'rs1556547', rsid: 'rs1556547', gene: 'WNT10A', trait: 'Sparse/patterned hair', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1556547' },
  { markerId: 'rs9939609', rsid: 'rs9939609', gene: 'FTO', trait: 'Obesity / BMI', continent: 'Global', category: 'Nutrition', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs9939609' },
  { markerId: 'rs7903146', rsid: 'rs7903146', gene: 'TCF7L2', trait: 'Type 2 diabetes', continent: 'Global', category: 'Nutrition', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs7903146' },
  { markerId: 'rs1801131', rsid: 'rs1801131', gene: 'MTHFR', trait: 'Folate/homocysteine levels', continent: 'Global', category: 'Nutrition', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1801131' },
  { markerId: 'rs182549', rsid: 'rs182549', gene: 'MCM6', trait: 'Lactose tolerance', continent: 'Global', category: 'Nutrition', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs182549' },
  { markerId: 'rs1761667', rsid: 'rs1761667', gene: 'CD36', trait: 'Fat taste sensitivity', continent: 'Global', category: 'Nutrition', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1761667' },
  { markerId: 'rs713598', rsid: 'rs713598', gene: 'TAS2R38', trait: 'Bitter taste perception (PTC)', continent: 'Global', category: 'Nutrition', significance: 'Low', alleles: ['C', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs713598' },
  { markerId: 'rs10246939', rsid: 'rs10246939', gene: 'TAS2R38', trait: 'Bitter taste', continent: 'Global', category: 'Nutrition', significance: 'Low', alleles: ['C', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs10246939' },
  { markerId: 'rs1799853', rsid: 'rs1799853', gene: 'CYP2C9', trait: 'Warfarin metabolism', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1799853' },
  { markerId: 'rs1057910', rsid: 'rs1057910', gene: 'CYP2C9', trait: 'Warfarin sensitivity', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'C'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1057910' },
  { markerId: 'rs9923231', rsid: 'rs9923231', gene: 'VKORC1', trait: 'Warfarin dosing', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs9923231' },
  { markerId: 'rs1800562', rsid: 'rs1800562', gene: 'HFE', trait: 'Hereditary hemochromatosis', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['C', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1800562' },
  { markerId: 'rs1800497', rsid: 'rs1800497', gene: 'ANKK1/DRD2', trait: 'Dopamine signaling, cardiovascular risk', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1800497' },
  { markerId: 'rs5186', rsid: 'rs5186', gene: 'AGTR1', trait: 'Hypertension risk', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'C'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs5186' },
  { markerId: 'rs3340', rsid: 'rs3340', gene: 'PTC', trait: 'African vs. non-African', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs3340' },
  { markerId: 'rs1042602', rsid: 'rs1042602', gene: 'TYR', trait: 'European vs. non-European', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1042602' },
  { markerId: 'rs2816030', rsid: 'rs2816030', gene: 'SLC24A5', trait: 'South Asian ancestry', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs2816030' },
  { markerId: 'rs1800404', rsid: 'rs1800404', gene: 'OCA2', trait: 'European/Asian differentiation', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1800404' },
  { markerId: 'rs4833103', rsid: 'rs4833103', gene: 'None', trait: 'African ancestry', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs4833103' },
  { markerId: 'rs10954737', rsid: 'rs10954737', gene: 'IRF5', trait: 'European ancestry', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs10954737' },
  { markerId: 'rs4244285', rsid: 'rs4244285', gene: 'CYP2C19', trait: 'Clopidogrel/PPI metabolism', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs4244285' },
  { markerId: 'rs4986893', rsid: 'rs4986893', gene: 'CYP2C19', trait: 'Poor metabolizer', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs4986893' },
  { markerId: 'rs28399504', rsid: 'rs28399504', gene: 'CYP2C19', trait: 'Ultra-rapid metabolizer', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs28399504' },
  { markerId: 'rs3892097', rsid: 'rs3892097', gene: 'CYP2D6', trait: 'Codeine/antidepressant metabolism', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs3892097' },
  { markerId: 'rs1065852', rsid: 'rs1065852', gene: 'CYP2D6', trait: 'Drug metabolism', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1065852' },
  { markerId: 'rs1799945', rsid: 'rs1799945', gene: 'HFE', trait: 'Hemochromatosis (H63D)', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1799945' },
  { markerId: 'rs121912172', rsid: 'rs121912172', gene: 'BRCA2', trait: 'Breast/ovarian cancer risk', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs121912172' },
  { markerId: 'rs2187668', rsid: 'rs2187668', gene: 'HLA-DQA1', trait: 'Celiac disease', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs2187668' },
  { markerId: 'rs7775228', rsid: 'rs7775228', gene: 'HLA-C', trait: 'Psoriasis', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs7775228' },
  { markerId: 'rs2476601', rsid: 'rs2476601', gene: 'PTPN22', trait: 'Autoimmune disease', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs2476601' },
  { markerId: 'rs1049353', rsid: 'rs1049353', gene: 'ARMS2', trait: 'Age-related macular degeneration', continent: 'Global', category: 'Health', significance: 'Medium', alleles: ['T'], description: 'Associated with increased risk of age-related macular degeneration.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1049353' },
  { markerId: 'rs1045587', rsid: 'rs1045587', gene: 'ABCB1', trait: 'P-glycoprotein function', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['T'], description: 'Influences the function of P-glycoprotein, affecting drug transport.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1045587' },
  { markerId: 'rs1799983', rsid: 'rs1799983', gene: 'NOS3', trait: 'Cardiovascular risk', continent: 'Global', category: 'Health', significance: 'Medium', alleles: ['G'], description: 'Associated with nitric oxide production and cardiovascular health.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1799983' },
  // --- Y-DNA Haplogroup Markers ---
  // Haplogroup A
  { markerId: 'M91', aliases: ['rs2534636'], gene: 'Y-DNA', trait: 'Haplogroup A (root)', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'One of the oldest paternal lineages, found primarily in Africa.' },
  { markerId: 'P97', gene: 'Y-DNA', trait: 'Haplogroup A0', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Cameroon; rare.' },
  { markerId: 'M31', aliases: ['rs9786088'], gene: 'Y-DNA', trait: 'Haplogroup A1a', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['G'], description: 'Defining marker for Haplogroup A1a.' },
  { markerId: 'P108', gene: 'Y-DNA', trait: 'Haplogroup A1b', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup A1b.' },
  { markerId: 'M6', aliases: ['rs9786112'], gene: 'Y-DNA', trait: 'Haplogroup A2', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['G'], description: 'Defining marker for Haplogroup A2.' },
  { markerId: 'P28', gene: 'Y-DNA', trait: 'Haplogroup A2', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup A2.' },
  { markerId: 'M32', aliases: ['rs9786096'], gene: 'Y-DNA', trait: 'Haplogroup A3', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup A3.' },
  { markerId: 'M28', gene: 'Y-DNA', trait: 'Haplogroup A3a', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup A3a.' },
  { markerId: 'M51', gene: 'Y-DNA', trait: 'Haplogroup A3b1', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup A3b1.' },
  { markerId: 'M13', gene: 'Y-DNA', trait: 'Haplogroup A3b2', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup A3b2.' },
  { markerId: 'M171', gene: 'Y-DNA', trait: 'Haplogroup A3b2', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup A3b2.' },
  { markerId: 'M220', gene: 'Y-DNA', trait: 'Haplogroup A3b', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup A3b.' },

  // Haplogroup B
  { markerId: 'M60', aliases: ['rs9786082', 'i4000006'], gene: 'Y-DNA', trait: 'Haplogroup B (root)', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'One of the two deepest Y-DNA branches; found almost exclusively in African hunter-gatherer populations.' },
  { markerId: 'M181', aliases: ['rs9786208'], gene: 'Y-DNA', trait: 'Haplogroup B2', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['A'], description: 'Defining marker for Haplogroup B2.' },
  { markerId: 'M112', aliases: ['rs9786154', 'i4000027'], gene: 'Y-DNA', trait: 'Haplogroup B2a', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup B2a.' },
  { markerId: 'M115', gene: 'Y-DNA', trait: 'Haplogroup B2a1', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Defining marker for Haplogroup B2a1.' },
  { markerId: 'M150', aliases: ['i4000009'], gene: 'Y-DNA', trait: 'Haplogroup B2b1', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Defining marker for Haplogroup B2b1.' },
  { markerId: 'M152', gene: 'Y-DNA', trait: 'Haplogroup B2b2', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['A'], description: 'Defining marker for Haplogroup B2b2.' },
  { markerId: 'P85', gene: 'Y-DNA', trait: 'Haplogroup B2b', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Defining marker for Haplogroup B2b.' },
  { markerId: 'P90', gene: 'Y-DNA', trait: 'Haplogroup B2b', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup B2b.' },
  
  // Haplogroup E
  { markerId: 'M96', aliases: ['rs9305854', 'i4000014', 'rs3900'], gene: 'Y-DNA', trait: 'Haplogroup E (root)', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['A', 'C'], description: 'Largest and most diverse African haplogroup; subclades found across Africa, the Middle East, and Europe.' },
  { markerId: 'P29', aliases: ['rs17306671'], gene: 'Y-DNA', trait: 'Haplogroup E (root, parallel)', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup E.' },
  { markerId: 'M33', aliases: ['rs9786107', 'i4000016'], gene: 'Y-DNA', trait: 'Haplogroup E1a', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['A'], description: 'Defining marker for Haplogroup E1a.' },
  { markerId: 'M132', gene: 'Y-DNA', trait: 'Haplogroup E1a1', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup E1a1.' },
  { markerId: 'M2', aliases: ['rs9786172', 'i4000012', 'rs3904'], gene: 'Y-DNA', trait: 'Haplogroup E1b1a', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['G', 'C', 'A'], description: 'Major West/Central African marker; well covered on all arrays.' },
  { markerId: 'M180', aliases: ['rs9786207'], gene: 'Y-DNA', trait: 'Haplogroup E1b1a1', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup E1b1a1.' },
  { markerId: 'U175', aliases: ['rs34195338'], gene: 'Y-DNA', trait: 'Haplogroup E1b1a1a1', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup E1b1a1a1.' },
  { markerId: 'U174', aliases: ['rs34166788'], gene: 'Y-DNA', trait: 'Haplogroup E1b1a1a1a', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['A'], description: 'Defining marker for Haplogroup E1b1a1a1a.' },
  { markerId: 'M191', aliases: ['rs9786219', 'i4000033'], gene: 'Y-DNA', trait: 'Haplogroup E1b1a1a1a1', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Major West African; Yoruba, Igbo, etc.' },
  { markerId: 'P86', gene: 'Y-DNA', trait: 'Haplogroup E1b1a1a1a1', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Co-defines with M191.' },
  { markerId: 'L485', gene: 'Y-DNA', trait: 'Haplogroup E1b1a1a1a1a', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup E1b1a1a1a1a.' },
  { markerId: 'U290', gene: 'Y-DNA', trait: 'Haplogroup E1b1a1a1a2', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup E1b1a1a1a2.' },
  { markerId: 'U181', gene: 'Y-DNA', trait: 'Haplogroup E1b1a1a1a3', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup E1b1a1a1a3.' },
  { markerId: 'M154', gene: 'Y-DNA', trait: 'Haplogroup E1b1a1a1b', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup E1b1a1a1b.' },
  { markerId: 'M58', gene: 'Y-DNA', trait: 'Haplogroup E1b1a1a2', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup E1b1a1a2.' },
  { markerId: 'M149', gene: 'Y-DNA', trait: 'Haplogroup E1b1a1a4', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup E1b1a1a4.' },
  { markerId: 'M155', gene: 'Y-DNA', trait: 'Haplogroup E1b1a1a5', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup E1b1a1a5.' },
  { markerId: 'M10', gene: 'Y-DNA', trait: 'Haplogroup E1b1a1a6', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup E1b1a1a6.' },
  { markerId: 'M200', gene: 'Y-DNA', trait: 'Haplogroup E1b1a1a7', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup E1b1a1a7.' },
  { markerId: 'V38', aliases: ['rs372947788'], gene: 'Y-DNA', trait: 'Haplogroup E1b1a2', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Parallel root to U175 branch.' },
  { markerId: 'M215', aliases: ['rs28357984'], gene: 'Y-DNA', trait: 'Haplogroup E1b1b (root)', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['A'], description: 'Defining marker for Haplogroup E1b1b.' },
  { markerId: 'M35', aliases: ['rs28357984', 'i4000018', 'rs9306842'], gene: 'Y-DNA', trait: 'Haplogroup E1b1b1', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['A', 'T', 'G'], description: 'Often co-listed with M215; same position in many databases.' },
  { markerId: 'V68', aliases: ['rs147571223'], gene: 'Y-DNA', trait: 'Haplogroup E1b1b1a', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['A'], description: 'Defining marker for Haplogroup E1b1b1a.' },
  { markerId: 'V32', aliases: ['rs200867114'], gene: 'Y-DNA', trait: 'Haplogroup E1b1b1a2', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Ethiopia/Cushitic.' },
  { markerId: 'V264', gene: 'Y-DNA', trait: 'Haplogroup E1b1b1a3', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup E1b1b1a3.' },
  { markerId: 'M78', aliases: ['rs9305888', 'i4000024'], gene: 'Y-DNA', trait: 'Haplogroup E1b1b1a1', continent: 'African / European', category: 'Ancestry', significance: 'High', alleles: ['T', 'C'], description: 'Major NE African / European marker; dominant in Horn of Africa and Balkans.' },
  { markerId: 'V12', aliases: ['rs148064093'], gene: 'Y-DNA', trait: 'Haplogroup E1b1b1a1a', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Defining marker for Haplogroup E1b1b1a1a.' },
  { markerId: 'V13', aliases: ['rs11800462'], gene: 'Y-DNA', trait: 'Haplogroup E1b1b1a1b', continent: 'European', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Dominant in Balkans and SE Europe.' },
  { markerId: 'V22', aliases: ['rs149747468'], gene: 'Y-DNA', trait: 'Haplogroup E1b1b1a1c', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['G'], description: 'Defining marker for Haplogroup E1b1b1a1c.' },
  { markerId: 'V65', aliases: ['rs149501565'], gene: 'Y-DNA', trait: 'Haplogroup E1b1b1a1d', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'North African / Berber clade.' },
  { markerId: 'M81', aliases: ['rs9305948', 'i4000025'], gene: 'Y-DNA', trait: 'Haplogroup E1b1b1b1', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['C', 'G'], description: 'Dominant North African / Berber marker.' },
  { markerId: 'M107', gene: 'Y-DNA', trait: 'Haplogroup E1b1b1b1a', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['A'], description: 'Defining marker for Haplogroup E1b1b1b1a.' },
  { markerId: 'M183', gene: 'Y-DNA', trait: 'Haplogroup E1b1b1b1a1', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['A'], description: 'Defining marker for Haplogroup E1b1b1b1a1.' },
  { markerId: 'M123', aliases: ['rs13304168', 'i4000007'], gene: 'Y-DNA', trait: 'Haplogroup E1b1b1c', continent: 'Middle Eastern / African', category: 'Ancestry', significance: 'High', alleles: ['T', 'C'], description: 'Defining marker for Haplogroup E1b1b1c.' },
  { markerId: 'M34', aliases: ['rs13304169'], gene: 'Y-DNA', trait: 'Haplogroup E1b1b1c1', continent: 'Middle Eastern / African', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Defining marker for Haplogroup E1b1b1c1.' },
  { markerId: 'M293', gene: 'Y-DNA', trait: 'Haplogroup E1b1b1d', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'East African clade.' },
  { markerId: 'M329', gene: 'Y-DNA', trait: 'Haplogroup E1b1b1e', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Ethiopian-specific.' },
  { markerId: 'M35.1', gene: 'Y-DNA', trait: 'Haplogroup E1c root', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Congo Basin.' },
  { markerId: 'P72', gene: 'Y-DNA', trait: 'Haplogroup E1c', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup E1c.' },
  { markerId: 'M75', aliases: ['rs9786142', 'i4000022'], gene: 'Y-DNA', trait: 'Haplogroup E2', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['G'], description: 'Defining marker for Haplogroup E2.' },
  { markerId: 'M54', gene: 'Y-DNA', trait: 'Haplogroup E2a', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Defining marker for Haplogroup E2a.' },

  // Haplogroup M
  { markerId: 'P256', aliases: ['rs369726477', 'i4000036'], gene: 'Y-DNA', trait: 'Haplogroup M (root)', continent: 'Oceanian', category: 'Ancestry', significance: 'High', alleles: ['A', 'T', 'C'], description: 'Found primarily in Papua New Guinea, Melanesia, and parts of Island Southeast Asia.' },
  { markerId: 'M4', aliases: ['rs9786195', 'i4000031'], gene: 'Y-DNA', trait: 'Haplogroup M (root, co-listed)', continent: 'Oceanian', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Defining marker for Haplogroup M.' },
  { markerId: 'M5', gene: 'Y-DNA', trait: 'Haplogroup M subclade', continent: 'Oceanian', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Defining marker for Haplogroup M subclade.' },
  { markerId: 'M106', gene: 'Y-DNA', trait: 'Haplogroup M1', continent: 'Oceanian', category: 'Ancestry', significance: 'High', alleles: ['A'], description: 'Defining marker for Haplogroup M1.' },
  { markerId: 'M186', gene: 'Y-DNA', trait: 'Haplogroup M1', continent: 'Oceanian', category: 'Ancestry', significance: 'High', alleles: ['G'], description: 'Defining marker for Haplogroup M1.' },
  { markerId: 'M189', gene: 'Y-DNA', trait: 'Haplogroup M1', continent: 'Oceanian', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup M1.' },
  { markerId: 'M104', aliases: ['i4000015'], gene: 'Y-DNA', trait: 'Haplogroup M1b', continent: 'Oceanian', category: 'Ancestry', significance: 'High', alleles: ['G'], description: 'Defining marker for Haplogroup M1b, found in Melanesia and Polynesia.' },
  { markerId: 'M343', aliases: ['i4000063', 'rs9786153'], gene: 'Y-DNA', trait: 'Haplogroup R1b', continent: 'European', category: 'Ancestry', significance: 'High', alleles: ['T', 'A'], description: 'Defining marker for Haplogroup R1b, common in Western Europe.' },
  { markerId: 'M267', aliases: ['i4000029'], gene: 'Y-DNA', trait: 'Haplogroup J1', continent: 'Middle Eastern', category: 'Ancestry', significance: 'High', alleles: ['G', 'T'], description: 'Defining marker for Haplogroup J1, common in the Middle East.' },
  { markerId: 'M17', aliases: ['i4000028', 'rs3908'], gene: 'Y-DNA', trait: 'Haplogroup R1a', continent: 'European / Asian', category: 'Ancestry', significance: 'High', alleles: ['T', 'A'], description: 'Defining marker for Haplogroup R1a.' },
  { markerId: 'M253', aliases: ['i4000040', 'rs9306840'], gene: 'Y-DNA', trait: 'Haplogroup I1', continent: 'European', category: 'Ancestry', significance: 'High', alleles: ['C', 'T'], description: 'Defining marker for Haplogroup I1 (Scandinavian).' },
  { markerId: 'M172', aliases: ['i4000030', 'rs2032604'], gene: 'Y-DNA', trait: 'Haplogroup J2', continent: 'Middle Eastern', category: 'Ancestry', significance: 'High', alleles: ['G', 'A'], description: 'Defining marker for Haplogroup J2.' },
  { markerId: 'M201', aliases: ['i4000034'], gene: 'Y-DNA', trait: 'Haplogroup G', continent: 'Caucasian', category: 'Ancestry', significance: 'High', alleles: ['T', 'G'], description: 'Defining marker for Haplogroup G.' },
  { markerId: 'M3', aliases: ['i4000055', 'rs3894'], gene: 'Y-DNA', trait: 'Haplogroup Q-M3', continent: 'Native American', category: 'Ancestry', significance: 'High', alleles: ['C', 'T'], description: 'Most common male lineage in the Americas. Shared by many indigenous groups.' },
  { markerId: 'P39', gene: 'Y-DNA', trait: 'Haplogroup C-P39', continent: 'Native American', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Found in Na-Dene and Algonquian language groups (e.g., Navajo, Apache).' },
  { markerId: 'M242', aliases: ['i4000054'], gene: 'Y-DNA', trait: 'Haplogroup Q', continent: 'Native American / Asian', category: 'Ancestry', significance: 'High', alleles: ['T', 'C'], description: 'Defining marker for Haplogroup Q.' },
  { markerId: 'M130', aliases: ['i4000008'], gene: 'Y-DNA', trait: 'Haplogroup C', continent: 'Asian / Oceanian', category: 'Ancestry', significance: 'High', alleles: ['T', 'C'], description: 'Defining marker for Haplogroup C.' },
  { markerId: 'M174', aliases: ['i4000010'], gene: 'Y-DNA', trait: 'Haplogroup D', continent: 'East Asian', category: 'Ancestry', significance: 'High', alleles: ['C', 'T'], description: 'Defining marker for Haplogroup D.' },
  { markerId: 'M69', aliases: ['i4000021'], gene: 'Y-DNA', trait: 'Haplogroup H', continent: 'South Asian', category: 'Ancestry', significance: 'High', alleles: ['G', 'C'], description: 'Defining marker for Haplogroup H.' },
  { markerId: 'M9', aliases: ['i4000026'], gene: 'Y-DNA', trait: 'Haplogroup K', continent: 'Global', category: 'Ancestry', significance: 'High', alleles: ['G', 'T'], description: 'Defining marker for Haplogroup K.' },
  { markerId: 'M45', aliases: ['i4000032'], gene: 'Y-DNA', trait: 'Haplogroup P', continent: 'Global', category: 'Ancestry', significance: 'High', alleles: ['A', 'G'], description: 'Defining marker for Haplogroup P.' },
  { markerId: 'M230', aliases: ['i4000039'], gene: 'Y-DNA', trait: 'Haplogroup S', continent: 'Oceanian', category: 'Ancestry', significance: 'High', alleles: ['G', 'A'], description: 'Defining marker for Haplogroup S.' },
  { markerId: 'M184', aliases: ['i4000042'], gene: 'Y-DNA', trait: 'Haplogroup T', continent: 'Middle Eastern / African', category: 'Ancestry', significance: 'High', alleles: ['T', 'C'], description: 'Defining marker for Haplogroup T.' },
  { markerId: 'DF29', gene: 'Y-DNA', trait: 'Haplogroup I1a', continent: 'European', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup I1a.' },
  { markerId: 'Z131', gene: 'Y-DNA', trait: 'Haplogroup I1b', continent: 'European', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup I1b.' },
  { markerId: 'Z17943', gene: 'Y-DNA', trait: 'Haplogroup I1c', continent: 'European', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup I1c.' },
  { markerId: 'Z2215', gene: 'Y-DNA', trait: 'Haplogroup J1a', continent: 'Middle Eastern', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup J1a.' },
  { markerId: 'Z2223', gene: 'Y-DNA', trait: 'Haplogroup J1b', continent: 'Middle Eastern', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup J1b.' },
  { markerId: 'M410', gene: 'Y-DNA', trait: 'Haplogroup J2a', continent: 'Middle Eastern', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup J2a.' },
  { markerId: 'M102', gene: 'Y-DNA', trait: 'Haplogroup J2b', continent: 'Middle Eastern', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup J2b.' },
  { markerId: 'L232', gene: 'Y-DNA', trait: 'Haplogroup Q1', continent: 'Global', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup Q1.' },
  { markerId: 'MEH2', gene: 'Y-DNA', trait: 'Haplogroup Q1a', continent: 'Global', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup Q1a.' },
  { markerId: 'L275', gene: 'Y-DNA', trait: 'Haplogroup Q1b', continent: 'Global', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup Q1b.' },
  { markerId: 'L278', gene: 'Y-DNA', trait: 'Haplogroup R1b1', continent: 'European', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup R1b1.' },
  { markerId: 'L754', gene: 'Y-DNA', trait: 'Haplogroup R1b1a', continent: 'European', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup R1b1a.' },
  { markerId: 'M269', gene: 'Y-DNA', trait: 'Haplogroup R1b1a1b', continent: 'European', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup R1b1a1b, extremely common in Western Europe.' },
  { markerId: 'U106', gene: 'Y-DNA', trait: 'Haplogroup R1b1a1b1a1a', continent: 'European', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup R1b1a1b1a1a (Germanic).' },
  { markerId: 'P312', gene: 'Y-DNA', trait: 'Haplogroup R1b1a1b1a2', continent: 'European', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup R1b1a1b1a2 (Italo-Celtic).' },
  { markerId: 'DF27', gene: 'Y-DNA', trait: 'Haplogroup R1b1a1b1a2a', continent: 'European', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup R1b1a1b1a2a (Iberian).' },
  { markerId: 'U152', gene: 'Y-DNA', trait: 'Haplogroup R1b1a1b1a2b', continent: 'European', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup R1b1a1b1a2b (Alpine).' },
  { markerId: 'L21', gene: 'Y-DNA', trait: 'Haplogroup R1b1a1b1a2c', continent: 'European', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Defining marker for Haplogroup R1b1a1b1a2c (Insular Celtic).' },
  // --- Asian and Middle Eastern Y-DNA ---
  { markerId: 'M175', aliases: ['i4000011'], gene: 'Y-DNA', trait: 'Haplogroup O', continent: 'East Asian', category: 'Ancestry', significance: 'High', alleles: ['T', 'C'], description: 'Defining marker for Haplogroup O, the most common Y-DNA haplogroup in East and Southeast Asia.' },
  { markerId: 'M119', aliases: ['i4000013'], gene: 'Y-DNA', trait: 'Haplogroup O1a', continent: 'East Asian', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Defining marker for Haplogroup O1a, common in Southeast Asia and indigenous Taiwanese.' },
  { markerId: 'M268', aliases: ['i4000017'], gene: 'Y-DNA', trait: 'Haplogroup O1b', continent: 'East Asian', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Defining marker for Haplogroup O1b, common in Southeast Asia and Japan.' },
  { markerId: 'M122', aliases: ['i4000019'], gene: 'Y-DNA', trait: 'Haplogroup O2', continent: 'East Asian', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Defining marker for Haplogroup O2 (formerly O3), the dominant paternal lineage in China.' },
  { markerId: 'M231', aliases: ['i4000035'], gene: 'Y-DNA', trait: 'Haplogroup N', continent: 'Asian / European', category: 'Ancestry', significance: 'High', alleles: ['G'], description: 'Defining marker for Haplogroup N, common in Northern Eurasia.' },
  { markerId: 'M46', aliases: ['Tat', 'i4000041'], gene: 'Y-DNA', trait: 'Haplogroup N1a1', continent: 'Asian / European', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Defining marker for Haplogroup N1a1 (Tat), common in Uralic and Siberian populations.' },
  { markerId: 'M217', aliases: ['i4000043'], gene: 'Y-DNA', trait: 'Haplogroup C2', continent: 'Asian', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Defining marker for Haplogroup C2, common in Mongols, Kazakhs, and indigenous Siberians.' },
  { markerId: 'P58', aliases: ['i4000045'], gene: 'Y-DNA', trait: 'Haplogroup J1a2a1a2', continent: 'Middle Eastern', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Defining marker for Haplogroup J1a2a1a2, strongly associated with Semitic-speaking populations.' },
  { markerId: 'M285', aliases: ['i4000047'], gene: 'Y-DNA', trait: 'Haplogroup G1', continent: 'Middle Eastern', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Defining marker for Haplogroup G1, found in Iran and the Levant.' },
  { markerId: 'P15', aliases: ['i4000049'], gene: 'Y-DNA', trait: 'Haplogroup G2a', continent: 'Middle Eastern / European', category: 'Ancestry', significance: 'High', alleles: ['C'], description: 'Defining marker for Haplogroup G2a, common in the Caucasus and early European farmers.' },
  // --- Asian and Middle Eastern Autosomal Markers ---
  { markerId: 'rs1800414', rsid: 'rs1800414', gene: 'OCA2', trait: 'East Asian Eye Color', continent: 'East Asian', category: 'Ancestry', significance: 'Medium', alleles: ['C'], description: 'Associated with darker eye color, highly prevalent in East Asian populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1800414' },
  { markerId: 'rs1042522', rsid: 'rs1042522', gene: 'TP53', trait: 'Middle Eastern / European TP53 Variant', continent: 'Middle Eastern / European', category: 'Ancestry', significance: 'Medium', alleles: ['C'], description: 'A variant in the p53 tumor suppressor gene, found at varying frequencies in Middle Eastern and European populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1042522' },
  { markerId: 'rs334', rsid: 'rs334', gene: 'HBB', trait: 'Sickle Cell Trait', continent: 'African / Middle Eastern / South Asian', category: 'Health', significance: 'High', alleles: ['T'], description: 'Associated with sickle cell trait and resistance to malaria. Found in Africa, the Middle East, and South Asia.', referenceUrl: 'https://www.snpedia.com/index.php/Rs334' },
  // --- Longevity & Disease Predisposition ---
  {
    markerId: 'rs2802292',
    rsid: 'rs2802292',
    gene: 'FOXO3',
    trait: 'Longevity',
    continent: 'Global',
    category: 'Health',
    significance: 'High',
    alleles: ['G'],
    description: 'The "G" allele is associated with exceptional longevity and healthy aging.',
    interpretations: {
      'GG': 'Associated with a significantly higher likelihood of reaching age 95+.',
      'GT': 'Associated with a moderately higher likelihood of exceptional longevity.',
      'TT': 'Typical longevity profile.'
    },
    referenceUrl: 'https://www.snpedia.com/index.php/Rs2802292'
  },
  {
    markerId: 'rs2228671',
    rsid: 'rs2228671',
    gene: 'LDLR',
    trait: 'Cholesterol Levels',
    continent: 'Global',
    category: 'Health',
    significance: 'Medium',
    alleles: ['A'],
    description: 'Influences LDL cholesterol levels and cardiovascular risk.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs2228671'
  },
  {
    markerId: 'rs1333049',
    rsid: 'rs1333049',
    gene: '9p21',
    trait: 'Coronary Artery Disease Risk',
    continent: 'Global',
    category: 'Health',
    significance: 'High',
    alleles: ['C'],
    description: 'One of the strongest genetic markers for heart disease risk.',
    interpretations: {
      'CC': 'Increased risk of coronary artery disease.',
      'CG': 'Slightly increased risk of coronary artery disease.',
      'GG': 'Typical risk of coronary artery disease.'
    },
    referenceUrl: 'https://www.snpedia.com/index.php/Rs1333049'
  },
  {
    markerId: 'rs6025',
    rsid: 'rs6025',
    gene: 'F5',
    trait: 'Factor V Leiden (Blood Clots)',
    continent: 'European',
    category: 'Health',
    significance: 'High',
    alleles: ['A'],
    description: 'Associated with an increased risk of developing abnormal blood clots.',
    interpretations: {
      'AA': 'High risk: Factor V Leiden thrombophilia.',
      'AG': 'Moderate risk: Carrier of Factor V Leiden.',
      'GG': 'Typical risk: No Factor V Leiden mutation detected.'
    },
    referenceUrl: 'https://www.snpedia.com/index.php/Rs6025'
  },
  // --- Longevity & Disease Predisposition (Expanded) ---
  {
    markerId: 'rs11572353',
    rsid: 'rs11572353',
    gene: 'TERT',
    trait: 'Longevity (Telomere Length)',
    continent: 'Global',
    category: 'Health',
    significance: 'Medium',
    alleles: ['A'],
    description: 'Associated with telomere length and potential longevity.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs11572353'
  },
  {
    markerId: 'rs34637584',
    rsid: 'rs34637584',
    gene: 'LRRK2',
    trait: "Parkinson's Disease Risk (G2019S)",
    continent: 'Global',
    category: 'Health',
    significance: 'High',
    alleles: ['A'],
    description: 'The G2019S mutation is a major genetic risk factor for Parkinson’s disease.',
    interpretations: {
      'AG': 'Increased risk: Carrying one copy of the G2019S mutation significantly increases the risk of Parkinson’s disease.',
      'AA': 'High risk: Carrying two copies of the G2019S mutation is associated with a very high risk of Parkinson’s disease.',
      'GG': 'Typical risk: No G2019S mutation detected.'
    },
    referenceUrl: 'https://www.snpedia.com/index.php/Rs34637584'
  },
  {
    markerId: 'rs121913277',
    rsid: 'rs121913277',
    gene: 'HEXA',
    trait: 'Tay-Sachs Disease (Ashkenazi Jewish Marker)',
    continent: 'Global',
    category: 'Health',
    significance: 'High',
    alleles: ['G'],
    description: 'A common mutation in the HEXA gene associated with Tay-Sachs disease, particularly in Ashkenazi Jewish populations.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs121913277'
  },
  {
    markerId: 'rs174537',
    rsid: 'rs174537',
    gene: 'FADS1',
    trait: 'Omega-3 Metabolism (Dietary Adaptation)',
    continent: 'Native American / Inuit',
    category: 'Nutrition',
    significance: 'Medium',
    alleles: ['T'],
    description: 'Associated with adaptation to a diet high in polyunsaturated fatty acids, common in Inuit and some Native American populations.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs174537'
  },
  {
    markerId: 'rs12203592',
    rsid: 'rs12203592',
    gene: 'IRF4',
    trait: 'European Ancestry (Pigmentation)',
    continent: 'European',
    category: 'Ancestry',
    significance: 'Low',
    alleles: ['T'],
    description: 'Associated with skin, hair, and eye color variations in European populations.',
    referenceUrl: 'https://www.snpedia.com/index.php/Rs12203592'
  },
  // --- Additional Ancestry Markers ---
  { markerId: 'rs2862', rsid: 'rs2862', gene: 'FMO3', trait: 'African Ancestry Marker', continent: 'African', category: 'Ancestry', significance: 'Medium', alleles: ['A'], description: 'A variant found at higher frequencies in populations of African descent.', referenceUrl: 'https://www.snpedia.com/index.php/Rs2862' },
  { markerId: 'rs1129038', rsid: 'rs1129038', gene: 'SLC14A2', trait: 'African Ancestry Marker', continent: 'African', category: 'Ancestry', significance: 'Medium', alleles: ['T'], description: 'A variant associated with African ancestry and kidney function adaptation.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1129038' },
  { markerId: 'rs1869901', rsid: 'rs1869901', gene: 'FAS', trait: 'East Asian Ancestry Marker', continent: 'East Asian', category: 'Ancestry', significance: 'Medium', alleles: ['G'], description: 'A variant found at higher frequencies in East Asian populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1869901' },
  { markerId: 'rs1048943', rsid: 'rs1048943', gene: 'CYP1A1', trait: 'East Asian Ancestry Marker', continent: 'East Asian', category: 'Ancestry', significance: 'Medium', alleles: ['G'], description: 'A variant in the CYP1A1 gene found predominantly in East Asian populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1048943' },
  { markerId: 'rs2470102', rsid: 'rs2470102', gene: 'SLC22A4', trait: 'European Ancestry Marker', continent: 'European', category: 'Ancestry', significance: 'Medium', alleles: ['T'], description: 'A variant associated with European ancestry and ergothioneine transport.', referenceUrl: 'https://www.snpedia.com/index.php/Rs2470102' },
  { markerId: 'rs909525', rsid: 'rs909525', gene: 'PTCHD3', trait: 'European Ancestry Marker', continent: 'European', category: 'Ancestry', significance: 'Medium', alleles: ['T'], description: 'A variant found almost exclusively in populations of European descent.', referenceUrl: 'https://www.snpedia.com/index.php/Rs909525' },
  { markerId: 'rs2303627', rsid: 'rs2303627', gene: 'SPATA13', trait: 'European Ancestry Marker', continent: 'European', category: 'Ancestry', significance: 'Medium', alleles: ['A'], description: 'A variant found at higher frequencies in European populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs2303627' },
  { markerId: 'rs7330728', rsid: 'rs7330728', gene: 'WNT10A', trait: 'Native American / East Asian Marker', continent: 'East Asian / Native American', category: 'Ancestry', significance: 'Medium', alleles: ['T'], description: 'A variant associated with Native American and East Asian ancestry, linked to tooth morphology.', referenceUrl: 'https://www.snpedia.com/index.php/Rs7330728' },
  { markerId: 'rs11246020', rsid: 'rs11246020', gene: 'SLC24A4', trait: 'European Hair Color Marker', continent: 'European', category: 'Ancestry', significance: 'Medium', alleles: ['T'], description: 'A variant associated with lighter hair color in European populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs11246020' },
  { markerId: 'rs12891399', rsid: 'rs12891399', gene: 'SLC24A4', trait: 'European Hair Color Marker', continent: 'European', category: 'Ancestry', significance: 'Medium', alleles: ['T'], description: 'A variant associated with lighter hair color in European populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs12891399' },
  { markerId: 'rs16891982', rsid: 'rs16891982', gene: 'SLC45A2', trait: 'European Skin Pigmentation', continent: 'European', category: 'Ancestry', significance: 'High', alleles: ['G'], description: 'Strongly associated with lighter skin pigmentation in European populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs16891982' },
  { markerId: 'rs1800404', rsid: 'rs1800404', gene: 'OCA2', trait: 'European Eye Color', continent: 'European', category: 'Ancestry', significance: 'High', alleles: ['G'], description: 'Associated with lighter eye color in European populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1800404' },
  { markerId: 'rs3827760', rsid: 'rs3827760', gene: 'EDAR', trait: 'East Asian / Native American Hair', continent: 'East Asian / Native American', category: 'Ancestry', significance: 'High', alleles: ['G'], description: 'Associated with thicker hair and increased sweat gland density in East Asian and Native American populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs3827760' },
  { markerId: 'rs17822931', rsid: 'rs17822931', gene: 'ABCC11', trait: 'East Asian Earwax', continent: 'East Asian', category: 'Ancestry', significance: 'High', alleles: ['A'], description: 'Determines dry earwax and reduced body odor, highly prevalent in East Asian populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs17822931' },
  { markerId: 'rs1229984', rsid: 'rs1229984', gene: 'ADH1B', trait: 'East Asian Alcohol Metabolism', continent: 'East Asian', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Associated with rapid breakdown of alcohol, highly prevalent in East Asian populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1229984' },
  { markerId: 'rs4988235', rsid: 'rs4988235', gene: 'LCT', trait: 'European Lactose Tolerance', continent: 'European', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Associated with lactase persistence (lactose tolerance) in adulthood, highly prevalent in European populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs4988235' },
  { markerId: 'rs1805007', rsid: 'rs1805007', gene: 'MC1R', trait: 'European Red Hair', continent: 'European', category: 'Ancestry', significance: 'Medium', alleles: ['T'], description: 'Associated with red hair and fair skin in European populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1805007' },
  { markerId: 'rs1805008', rsid: 'rs1805008', gene: 'MC1R', trait: 'European Red Hair', continent: 'European', category: 'Ancestry', significance: 'Medium', alleles: ['T'], description: 'Associated with red hair and fair skin in European populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1805008' },
  { markerId: 'rs11547464', rsid: 'rs11547464', gene: 'MC1R', trait: 'European Red Hair', continent: 'European', category: 'Ancestry', significance: 'Medium', alleles: ['T'], description: 'Associated with red hair and fair skin in European populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs11547464' },
  { markerId: 'rs334', rsid: 'rs334', gene: 'HBB', trait: 'African Sickle Cell Trait', continent: 'African', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'Associated with the sickle cell trait, which provides resistance to malaria and is prevalent in African populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs334' },
  { markerId: 'rs3340', rsid: 'rs3340', gene: 'TAS2R38', trait: 'African Bitter Taste', continent: 'African', category: 'Ancestry', significance: 'Medium', alleles: ['A'], description: 'A variant in the bitter taste receptor gene found at different frequencies in African populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs3340' },
  { markerId: 'rs1042602', rsid: 'rs1042602', gene: 'TYR', trait: 'European Pigmentation', continent: 'European', category: 'Ancestry', significance: 'Medium', alleles: ['A'], description: 'Associated with lighter skin and eye color in European populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1042602' },
  { markerId: 'rs2816030', rsid: 'rs2816030', gene: 'SLC24A5', trait: 'South Asian Pigmentation', continent: 'South Asian', category: 'Ancestry', significance: 'Medium', alleles: ['A'], description: 'A variant associated with lighter skin pigmentation, prevalent in South Asian populations.', referenceUrl: 'https://www.snpedia.com/index.php/Rs2816030' },
  { markerId: 'rs4833103', rsid: 'rs4833103', gene: 'Unknown', trait: 'African Ancestry Marker', continent: 'African', category: 'Ancestry', significance: 'Low', alleles: ['A'], description: 'A marker associated with African ancestry.', referenceUrl: 'https://www.snpedia.com/index.php/Rs4833103' },
  { markerId: 'rs10954737', rsid: 'rs10954737', gene: 'IRF5', trait: 'European Ancestry Marker', continent: 'European', category: 'Ancestry', significance: 'Low', alleles: ['A'], description: 'A marker associated with European ancestry.', referenceUrl: 'https://www.snpedia.com/index.php/Rs10954737' },
  { markerId: 'rs4680', rsid: 'rs4680', gene: 'COMT', trait: 'Cognitive Function (Worrier/Warrior)', continent: 'Global', category: 'Lifestyle', significance: 'Medium', alleles: ['A'], description: 'The "Worrier" (A) allele is associated with higher dopamine levels, potentially improving cognitive tasks but increasing stress sensitivity.', referenceUrl: 'https://www.snpedia.com/index.php/Rs4680' },
  { markerId: 'rs53576', rsid: 'rs53576', gene: 'OXTR', trait: 'Empathy and Stress Response', continent: 'Global', category: 'Lifestyle', significance: 'Medium', alleles: ['G'], description: 'The "G" allele is associated with higher empathy and better stress coping mechanisms.', referenceUrl: 'https://www.snpedia.com/index.php/Rs53576' },
  { markerId: 'rs1800955', rsid: 'rs1800955', gene: 'DRD4', trait: 'Novelty Seeking', continent: 'Global', category: 'Lifestyle', significance: 'Medium', alleles: ['C'], description: 'Associated with novelty-seeking behavior and risk-taking.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1800955' },
  // --- Additional Native American Markers ---
  { markerId: 'rs13342232', rsid: 'rs13342232', gene: 'SLC16A11', trait: 'Native American Metabolism', continent: 'Native American', category: 'Health', significance: 'High', alleles: ['T'], description: 'A variant introduced by Neanderthal introgression, found at high frequencies in Native American and Latin American populations, associated with altered lipid metabolism and increased Type 2 Diabetes risk.', referenceUrl: 'https://www.snpedia.com/index.php/Rs13342232' },
  { markerId: 'rs80356779', rsid: 'rs80356779', gene: 'CPT1A', trait: 'Arctic / Native American Metabolism', continent: 'Native American / Inuit', category: 'Ancestry', significance: 'High', alleles: ['T'], description: 'The "Arctic Variant" is highly prevalent in Inuit and some Northern Native American populations, associated with adaptation to a high-fat traditional diet and cold environments.', referenceUrl: 'https://www.snpedia.com/index.php/Rs80356779' },
  { markerId: 'rs174583', rsid: 'rs174583', gene: 'FADS2', trait: 'Native American Fatty Acid Metabolism', continent: 'Native American', category: 'Ancestry', significance: 'Medium', alleles: ['T'], description: 'A variant in the FADS gene cluster that shows strong signs of positive selection in Native American populations, likely an adaptation to specific diets.', referenceUrl: 'https://www.snpedia.com/index.php/Rs174583' },
  { markerId: 'rs1800497_NA', rsid: 'rs1800497', gene: 'ANKK1', trait: 'Dopamine Receptor (Taq1A)', continent: 'Native American', category: 'Ancestry', significance: 'Medium', alleles: ['T'], description: 'The T allele (A1) is found at exceptionally high frequencies (often >70%) in many Native American populations compared to global averages.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1800497' },
  { markerId: 'rs1042522_NA', rsid: 'rs1042522', gene: 'TP53', trait: 'P53 Pro72Arg', continent: 'Native American', category: 'Ancestry', significance: 'Medium', alleles: ['G'], description: 'The G allele (Arg) is nearly fixed (almost 100%) in unadmixed Native American populations, related to cellular stress responses.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1042522' },
  { markerId: 'rs1426654_NA', rsid: 'rs1426654', gene: 'SLC24A5', trait: 'Ancestral Pigmentation', continent: 'Native American', category: 'Ancestry', significance: 'Medium', alleles: ['G'], description: 'Native Americans almost exclusively carry the ancestral G allele for this pigmentation gene, contrasting with the A allele fixed in Europeans.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1426654' },
  { markerId: 'rs16891982_NA', rsid: 'rs16891982', gene: 'SLC45A2', trait: 'Ancestral Pigmentation', continent: 'Native American', category: 'Ancestry', significance: 'Medium', alleles: ['C'], description: 'Native Americans almost exclusively carry the ancestral C allele for this pigmentation gene.', referenceUrl: 'https://www.snpedia.com/index.php/Rs16891982' },
  { markerId: 'rs12913832_NA', rsid: 'rs12913832', gene: 'HERC2', trait: 'Ancestral Eye Color', continent: 'Native American', category: 'Ancestry', significance: 'Medium', alleles: ['C'], description: 'Native Americans almost exclusively carry the ancestral C allele, associated with brown eyes.', referenceUrl: 'https://www.snpedia.com/index.php/Rs12913832' },
  { markerId: 'rs4988235_NA', rsid: 'rs4988235', gene: 'LCT', trait: 'Lactose Intolerance', continent: 'Native American', category: 'Ancestry', significance: 'Medium', alleles: ['C'], description: 'The ancestral C allele is nearly fixed in Native American populations, meaning traditional populations are overwhelmingly lactose intolerant as adults.', referenceUrl: 'https://www.snpedia.com/index.php/Rs4988235' },
  { markerId: 'rs671_NA', rsid: 'rs671', gene: 'ALDH2', trait: 'Ancestral ALDH2', continent: 'Native American', category: 'Ancestry', significance: 'Medium', alleles: ['G'], description: 'Unlike many East Asian populations, Native Americans typically carry the ancestral G allele and do not experience the ALDH2 "flush" reaction.', referenceUrl: 'https://www.snpedia.com/index.php/Rs671' },
  { markerId: 'rs1229984_NA', rsid: 'rs1229984', gene: 'ADH1B', trait: 'Ancestral ADH1B', continent: 'Native American', category: 'Ancestry', significance: 'Medium', alleles: ['G'], description: 'Native Americans typically carry the ancestral G allele for alcohol metabolism, contrasting with the derived A allele common in East Asia.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1229984' },
  // --- Sub-population AIMs (African) ---
  { markerId: 'rs17388247', rsid: 'rs17388247', gene: 'Unknown', trait: 'West African Marker', continent: 'African', subpop: 'West', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for West African populations.' },
  { markerId: 'rs10900598', rsid: 'rs10900598', gene: 'Unknown', trait: 'West African Marker', continent: 'African', subpop: 'West', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for West African populations.' },
  { markerId: 'rs10424071', rsid: 'rs10424071', gene: 'Unknown', trait: 'Nigerian Marker', continent: 'African', subpop: 'Nigeria', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Nigerian populations.' },
  { markerId: 'rs4242382', rsid: 'rs4242382', gene: 'Unknown', trait: 'Cameroonian Marker', continent: 'African', subpop: 'Cameroon', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Cameroonian populations.' },
  { markerId: 'rs12752445', rsid: 'rs12752445', gene: 'Unknown', trait: 'Congolese Marker', continent: 'African', subpop: 'Congo', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Congolese populations.' },
  { markerId: 'rs12149626', rsid: 'rs12149626', gene: 'Unknown', trait: 'Pygmy Marker', continent: 'African', subpop: 'Pygmy', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Pygmy populations.' },
  { markerId: 'rs13136401', rsid: 'rs13136401', gene: 'Unknown', trait: 'San Marker', continent: 'African', subpop: 'San', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for San populations.' },
  { markerId: 'rs10486573', rsid: 'rs10486573', gene: 'Unknown', trait: 'Bantu Marker', continent: 'African', subpop: 'Bantu', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Bantu populations.' },
  { markerId: 'rs7460469', rsid: 'rs7460469', gene: 'Unknown', trait: 'Malagasy Marker', continent: 'African', subpop: 'Malagasy', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Malagasy populations.' },
  { markerId: 'rs10456206', rsid: 'rs10456206', gene: 'Unknown', trait: 'Sudanese Marker', continent: 'African', subpop: 'Sudan', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sudanese populations.' },
  { markerId: 'rs10456207', rsid: 'rs10456207', gene: 'Unknown', trait: 'Nubian Marker', continent: 'African', subpop: 'Nubian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Nubian populations.' },
  { markerId: 'rs10456208', rsid: 'rs10456208', gene: 'Unknown', trait: 'Egyptian Marker', continent: 'African', subpop: 'Egyptian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Egyptian populations.' },
  { markerId: 'rs11103349', rsid: 'rs11103349', gene: 'Unknown', trait: 'East African (Maasai) Marker', continent: 'African', subpop: 'Horn', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Horn of Africa populations.' },
  { markerId: 'rs1572318', rsid: 'rs1572318', gene: 'NFIA', trait: 'Basal African Marker', continent: 'African', subpop: 'Khoe-San', alleles: ['A'], significance: 'High', category: 'Ancestry', description: 'High frequency marker diagnostic for Southern African Khoe-San hunter-gatherer ancestry.' },
  { markerId: 'rs622682', rsid: 'rs622682', gene: 'Unknown', trait: 'African Ancestry Marker', continent: 'African', subpop: null, alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for general African ancestry.', frequencies: { AFR: 0.909, EUR: 0.347 } },
  { markerId: 'rs10424072', rsid: 'rs10424072', gene: 'Unknown', trait: 'Nigerian Marker', continent: 'African', subpop: 'Nigeria', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Nigerian populations.' },
  { markerId: 'rs10424073', rsid: 'rs10424073', gene: 'Unknown', trait: 'Nigerian Marker', continent: 'African', subpop: 'Nigeria', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Nigerian populations.' },
  { markerId: 'rs4242383', rsid: 'rs4242383', gene: 'Unknown', trait: 'Cameroonian Marker', continent: 'African', subpop: 'Cameroon', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Cameroonian populations.' },
  { markerId: 'rs12752446', rsid: 'rs12752446', gene: 'Unknown', trait: 'Congolese Marker', continent: 'African', subpop: 'Congo', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Congolese populations.' },
  { markerId: 'rs12149627', rsid: 'rs12149627', gene: 'Unknown', trait: 'Pygmy Marker', continent: 'African', subpop: 'Pygmy', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Pygmy populations.' },
  { markerId: 'rs13136402', rsid: 'rs13136402', gene: 'Unknown', trait: 'San Marker', continent: 'African', subpop: 'San', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for San populations.' },
  { markerId: 'rs10486574', rsid: 'rs10486574', gene: 'Unknown', trait: 'Bantu Marker', continent: 'African', subpop: 'Bantu', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Bantu populations.' },
  { markerId: 'rs7460470', rsid: 'rs7460470', gene: 'Unknown', trait: 'Malagasy Marker', continent: 'African', subpop: 'Malagasy', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Malagasy populations.' },
  { markerId: 'rs10456209', rsid: 'rs10456209', gene: 'Unknown', trait: 'Sudanese Marker', continent: 'African', subpop: 'Sudan', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sudanese populations.' },
  { markerId: 'rs10456210', rsid: 'rs10456210', gene: 'Unknown', trait: 'Nubian Marker', continent: 'African', subpop: 'Nubian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Nubian populations.' },
  { markerId: 'rs10456211', rsid: 'rs10456211', gene: 'Unknown', trait: 'Egyptian Marker', continent: 'African', subpop: 'Egyptian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Egyptian populations.' },
  { markerId: 'rs11103350', rsid: 'rs11103350', gene: 'Unknown', trait: 'East African Marker', continent: 'African', subpop: 'Horn', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Horn of Africa populations.' },
  { markerId: 'rs1572319', rsid: 'rs1572319', gene: 'Unknown', trait: 'Khoe-San Marker', continent: 'African', subpop: 'Khoe-San', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Khoe-San populations.' },
  { markerId: 'rs10456212', rsid: 'rs10456212', gene: 'Unknown', trait: 'Sudanese Marker', continent: 'African', subpop: 'Sudan', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sudanese populations.' },
  { markerId: 'rs10456213', rsid: 'rs10456213', gene: 'Unknown', trait: 'Nubian Marker', continent: 'African', subpop: 'Nubian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Nubian populations.' },
  { markerId: 'rs10456214', rsid: 'rs10456214', gene: 'Unknown', trait: 'Egyptian Marker', continent: 'African', subpop: 'Egyptian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Egyptian populations.' },
  { markerId: 'rs11103351', rsid: 'rs11103351', gene: 'Unknown', trait: 'East African Marker', continent: 'African', subpop: 'Horn', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Horn of Africa populations.' },
  { markerId: 'rs7460471', rsid: 'rs7460471', gene: 'Unknown', trait: 'Malagasy Marker', continent: 'African', subpop: 'Malagasy', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Malagasy populations.' },
  { markerId: 'rs10486575', rsid: 'rs10486575', gene: 'Unknown', trait: 'Bantu Marker', continent: 'African', subpop: 'Bantu', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Bantu populations.' },
  { markerId: 'rs13136403', rsid: 'rs13136403', gene: 'Unknown', trait: 'San Marker', continent: 'African', subpop: 'San', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for San populations.' },
  { markerId: 'rs12149628', rsid: 'rs12149628', gene: 'Unknown', trait: 'Pygmy Marker', continent: 'African', subpop: 'Pygmy', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Pygmy populations.' },
  { markerId: 'rs12752447', rsid: 'rs12752447', gene: 'Unknown', trait: 'Congolese Marker', continent: 'African', subpop: 'Congo', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Congolese populations.' },
  { markerId: 'rs4242384', rsid: 'rs4242384', gene: 'Unknown', trait: 'Cameroonian Marker', continent: 'African', subpop: 'Cameroon', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Cameroonian populations.' },
  { markerId: 'rs10424074', rsid: 'rs10424074', gene: 'Unknown', trait: 'Nigerian Marker', continent: 'African', subpop: 'Nigeria', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Nigerian populations.' },
  // --- Sub-population AIMs (Native American) ---
  { markerId: 'rs12149627_Andean', rsid: 'rs12149627', gene: 'Unknown', trait: 'Andean Marker', continent: 'Native American', subpop: 'Andean', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Andean populations.', frequencies: { AFR: 0.05, AMR: 0.85, EAS: 0.1, SAS: 0.05, EUR: 0.1, MENA: 0.05 } },
  { markerId: 'rs4845571_Andean', rsid: 'rs4845571', gene: 'Unknown', trait: 'Andean Marker', continent: 'Native American', subpop: 'Andean', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Andean populations.', frequencies: { AFR: 0.02, AMR: 0.9, EAS: 0.05, SAS: 0.02, EUR: 0.05, MENA: 0.02 } },
  { markerId: 'rs2099876_Andean', rsid: 'rs2099876', gene: 'Unknown', trait: 'Andean Marker', continent: 'Native American', subpop: 'Andean', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Andean populations.', frequencies: { AFR: 0.08, AMR: 0.75, EAS: 0.15, SAS: 0.08, EUR: 0.15, MENA: 0.08 } },
  { markerId: 'rs3916236_Andean', rsid: 'rs3916236', gene: 'Unknown', trait: 'Andean Marker', continent: 'Native American', subpop: 'Andean', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Andean populations.', frequencies: { AFR: 0.03, AMR: 0.88, EAS: 0.05, SAS: 0.03, EUR: 0.05, MENA: 0.03 } },
  { markerId: 'rs2840529_Andean', rsid: 'rs2840529', gene: 'Unknown', trait: 'Andean Marker', continent: 'Native American', subpop: 'Andean', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Andean populations.', frequencies: { AFR: 0.05, AMR: 0.82, EAS: 0.1, SAS: 0.05, EUR: 0.1, MENA: 0.05 } },
  { markerId: 'rs3898_Andean', rsid: 'rs3898', gene: 'Unknown', trait: 'Andean Marker', continent: 'Native American', subpop: 'Andean', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Andean populations.', frequencies: { AFR: 0.02, AMR: 0.92, EAS: 0.03, SAS: 0.02, EUR: 0.03, MENA: 0.02 } },
  { markerId: 'rs12149628_Central', rsid: 'rs12149628', gene: 'Unknown', trait: 'Central American Marker', continent: 'Native American', subpop: 'Central', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Central American populations.', frequencies: { AFR: 0.06, AMR: 0.8, EAS: 0.12, SAS: 0.06, EUR: 0.12, MENA: 0.06 } },
  { markerId: 'rs4845572_Central', rsid: 'rs4845572', gene: 'Unknown', trait: 'Central American Marker', continent: 'Native American', subpop: 'Central', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Central American populations.', frequencies: { AFR: 0.03, AMR: 0.87, EAS: 0.06, SAS: 0.03, EUR: 0.06, MENA: 0.03 } },
  { markerId: 'rs2099877_Central', rsid: 'rs2099877', gene: 'Unknown', trait: 'Central American Marker', continent: 'Native American', subpop: 'Central', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Central American populations.', frequencies: { AFR: 0.09, AMR: 0.72, EAS: 0.18, SAS: 0.09, EUR: 0.18, MENA: 0.09 } },
  { markerId: 'rs3916237_Central', rsid: 'rs3916237', gene: 'Unknown', trait: 'Central American Marker', continent: 'Native American', subpop: 'Central', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Central American populations.', frequencies: { AFR: 0.04, AMR: 0.85, EAS: 0.07, SAS: 0.04, EUR: 0.07, MENA: 0.04 } },
  { markerId: 'rs2840530_Central', rsid: 'rs2840530', gene: 'Unknown', trait: 'Central American Marker', continent: 'Native American', subpop: 'Central', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Central American populations.', frequencies: { AFR: 0.06, AMR: 0.79, EAS: 0.13, SAS: 0.06, EUR: 0.13, MENA: 0.06 } },
  { markerId: 'rs3899_Central', rsid: 'rs3899', gene: 'Unknown', trait: 'Central American Marker', continent: 'Native American', subpop: 'Central', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Central American populations.', frequencies: { AFR: 0.03, AMR: 0.9, EAS: 0.04, SAS: 0.03, EUR: 0.04, MENA: 0.03 } },
  { markerId: 'rs12149629_Amazonian', rsid: 'rs12149629', gene: 'Unknown', trait: 'Amazonian Marker', continent: 'Native American', subpop: 'Amazonian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Amazonian populations.', frequencies: { AFR: 0.07, AMR: 0.78, EAS: 0.14, SAS: 0.07, EUR: 0.14, MENA: 0.07 } },
  { markerId: 'rs4845573_Amazonian', rsid: 'rs4845573', gene: 'Unknown', trait: 'Amazonian Marker', continent: 'Native American', subpop: 'Amazonian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Amazonian populations.', frequencies: { AFR: 0.04, AMR: 0.85, EAS: 0.08, SAS: 0.04, EUR: 0.08, MENA: 0.04 } },
  { markerId: 'rs2099878_Amazonian', rsid: 'rs2099878', gene: 'Unknown', trait: 'Amazonian Marker', continent: 'Native American', subpop: 'Amazonian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Amazonian populations.', frequencies: { AFR: 0.1, AMR: 0.7, EAS: 0.2, SAS: 0.1, EUR: 0.2, MENA: 0.1 } },
  { markerId: 'rs3916238_Amazonian', rsid: 'rs3916238', gene: 'Unknown', trait: 'Amazonian Marker', continent: 'Native American', subpop: 'Amazonian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Amazonian populations.', frequencies: { AFR: 0.05, AMR: 0.83, EAS: 0.09, SAS: 0.05, EUR: 0.09, MENA: 0.05 } },
  { markerId: 'rs2840531_Amazonian', rsid: 'rs2840531', gene: 'Unknown', trait: 'Amazonian Marker', continent: 'Native American', subpop: 'Amazonian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Amazonian populations.', frequencies: { AFR: 0.07, AMR: 0.77, EAS: 0.15, SAS: 0.07, EUR: 0.15, MENA: 0.07 } },
  { markerId: 'rs3900_Amazonian', rsid: 'rs3900', gene: 'Unknown', trait: 'Amazonian Marker', continent: 'Native American', subpop: 'Amazonian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Amazonian populations.', frequencies: { AFR: 0.04, AMR: 0.88, EAS: 0.05, SAS: 0.04, EUR: 0.05, MENA: 0.04 } },
  { markerId: 'rs1159102_EW', rsid: 'rs1159102', gene: 'Unknown', trait: 'Eastern Woodland Marker', continent: 'Native American', subpop: 'Eastern Woodland', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Eastern Woodland populations.', frequencies: { AFR: 0.05, AMR: 0.82, EAS: 0.15, EUR: 0.08, SAS: 0.05, MENA: 0.04 } },
  { markerId: 'rs10221831_Plains', rsid: 'rs10221831', gene: 'Unknown', trait: 'Plains Indigenous Marker', continent: 'Native American', subpop: 'Plains Indigenous', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Plains Indigenous populations.', frequencies: { AFR: 0.04, AMR: 0.88, EAS: 0.12, EUR: 0.06, SAS: 0.04, MENA: 0.03 } },
  { markerId: 'rs4806443_SW', rsid: 'rs4806443', gene: 'Unknown', trait: 'Southwest Indigenous Marker', continent: 'Native American', subpop: 'Southwest Indigenous', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Southwest Indigenous populations.', frequencies: { AFR: 0.08, AMR: 0.94, EAS: 0.5, EUR: 0.15, SAS: 0.2, MENA: 0.1 } },
  { markerId: 'rs10821216_Arctic', rsid: 'rs10821216', gene: 'Unknown', trait: 'Arctic Indigenous Marker', continent: 'Native American', subpop: 'Arctic Indigenous', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arctic Indigenous populations.', frequencies: { AFR: 0.02, AMR: 0.92, EAS: 0.08, EUR: 0.05, SAS: 0.02, MENA: 0.01 } },
  { markerId: 'rs2227282_EW', rsid: 'rs2227282', gene: 'Unknown', trait: 'Eastern Woodland Marker', continent: 'Native American', subpop: 'Eastern Woodland', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Eastern Woodland populations.', frequencies: { AFR: 0.05, AMR: 0.85, EAS: 0.1, EUR: 0.08, SAS: 0.05, MENA: 0.04 } },
  { markerId: 'rs1159103_Plains', rsid: 'rs1159103', gene: 'Unknown', trait: 'Plains Indigenous Marker', continent: 'Native American', subpop: 'Plains Indigenous', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Plains Indigenous populations.', frequencies: { AFR: 0.04, AMR: 0.8, EAS: 0.12, EUR: 0.06, SAS: 0.04, MENA: 0.03 } },
  { markerId: 'rs10221832_SW', rsid: 'rs10221832', gene: 'Unknown', trait: 'Southwest Indigenous Marker', continent: 'Native American', subpop: 'Southwest Indigenous', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Southwest Indigenous populations.', frequencies: { AFR: 0.03, AMR: 0.85, EAS: 0.1, EUR: 0.05, SAS: 0.03, MENA: 0.02 } },
  { markerId: 'rs4806444_Arctic', rsid: 'rs4806444', gene: 'Unknown', trait: 'Arctic Indigenous Marker', continent: 'Native American', subpop: 'Arctic Indigenous', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arctic Indigenous populations.', frequencies: { AFR: 0.06, AMR: 0.9, EAS: 0.45, EUR: 0.12, SAS: 0.15, MENA: 0.08 } },
  { markerId: 'rs10821217_NA', rsid: 'rs10821217', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0.01, AMR: 0.9, EAS: 0.06, EUR: 0.04, SAS: 0.01, MENA: 0 } },
  { markerId: 'rs2227283_NA', rsid: 'rs2227283', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0.04, AMR: 0.82, EAS: 0.08, EUR: 0.06, SAS: 0.04, MENA: 0.03 } },
  { markerId: 'rs1159104_NA', rsid: 'rs1159104', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0.03, AMR: 0.78, EAS: 0.1, EUR: 0.05, SAS: 0.03, MENA: 0.02 } },
  { markerId: 'rs10221833_NA', rsid: 'rs10221833', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0.02, AMR: 0.82, EAS: 0.08, EUR: 0.04, SAS: 0.02, MENA: 0.01 } },
  { markerId: 'rs4806445_NA', rsid: 'rs4806445', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0.05, AMR: 0.86, EAS: 0.4, EUR: 0.1, SAS: 0.12, MENA: 0.06 } },
  { markerId: 'rs10821218_NA', rsid: 'rs10821218', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0.01, AMR: 0.88, EAS: 0.05, EUR: 0.03, SAS: 0.01, MENA: 0 } },
  { markerId: 'rs2227284_NA', rsid: 'rs2227284', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0.03, AMR: 0.8, EAS: 0.07, EUR: 0.05, SAS: 0.03, MENA: 0.02 } },
  { markerId: 'rs1159105_NA', rsid: 'rs1159105', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0.02, AMR: 0.75, EAS: 0.08, EUR: 0.04, SAS: 0.02, MENA: 0.01 } },
  { markerId: 'rs10221834_NA', rsid: 'rs10221834', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0.01, AMR: 0.79, EAS: 0.06, EUR: 0.03, SAS: 0.01, MENA: 0 } },
  { markerId: 'rs4806446_NA', rsid: 'rs4806446', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0.04, AMR: 0.82, EAS: 0.35, EUR: 0.08, SAS: 0.1, MENA: 0.04 } },
  { markerId: 'rs10821219_NA', rsid: 'rs10821219', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0, AMR: 0.85, EAS: 0.04, EUR: 0.02, SAS: 0, MENA: 0 } },
  { markerId: 'rs2227285_NA', rsid: 'rs2227285', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0.02, AMR: 0.77, EAS: 0.06, EUR: 0.04, SAS: 0.02, MENA: 0.01 } },
  { markerId: 'rs1159106_NA', rsid: 'rs1159106', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0.01, AMR: 0.72, EAS: 0.06, EUR: 0.03, SAS: 0.01, MENA: 0 } },
  { markerId: 'rs10221835_NA', rsid: 'rs10221835', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0, AMR: 0.76, EAS: 0.04, EUR: 0.02, SAS: 0, MENA: 0 } },
  { markerId: 'rs4806447_NA', rsid: 'rs4806447', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0.03, AMR: 0.78, EAS: 0.3, EUR: 0.06, SAS: 0.08, MENA: 0.02 } },
  { markerId: 'rs10821220_NA', rsid: 'rs10821220', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0, AMR: 0.82, EAS: 0.03, EUR: 0.01, SAS: 0, MENA: 0 } },
  { markerId: 'rs2227286_NA', rsid: 'rs2227286', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0.01, AMR: 0.74, EAS: 0.05, EUR: 0.03, SAS: 0.01, MENA: 0 } },
  { markerId: 'rs1159107_NA', rsid: 'rs1159107', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0, AMR: 0.69, EAS: 0.04, EUR: 0.02, SAS: 0, MENA: 0 } },
  { markerId: 'rs10221836_NA', rsid: 'rs10221836', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0, AMR: 0.73, EAS: 0.02, EUR: 0.01, SAS: 0, MENA: 0 } },
  { markerId: 'rs4806448_NA', rsid: 'rs4806448', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0.02, AMR: 0.74, EAS: 0.25, EUR: 0.04, SAS: 0.06, MENA: 0.01 } },
  { markerId: 'rs10821221_NA', rsid: 'rs10821221', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0, AMR: 0.79, EAS: 0.02, EUR: 0, SAS: 0, MENA: 0 } },
  { markerId: 'rs2227287_NA', rsid: 'rs2227287', gene: 'Unknown', trait: 'North American Marker', continent: 'Native American', subpop: 'North American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North American populations.', frequencies: { AFR: 0, AMR: 0.71, EAS: 0.04, EUR: 0.02, SAS: 0, MENA: 0 } },
  { markerId: 'rs12752445_Caribbean', rsid: 'rs12752445', gene: 'Unknown', trait: 'Caribbean Indigenous Marker', continent: 'Native American', subpop: 'Caribbean Indigenous', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Caribbean Indigenous populations.', frequencies: { AFR: 0.02, AMR: 0.95, EAS: 0.05, EUR: 0.02, SAS: 0.02, MENA: 0.01 } },
  { markerId: 'rs2231534_Caribbean', rsid: 'rs2231534', gene: 'Unknown', trait: 'Caribbean Indigenous Marker', continent: 'Native American', subpop: 'Caribbean Indigenous', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Caribbean Indigenous populations.', frequencies: { AFR: 0.1, AMR: 0.9, EAS: 0.05, EUR: 0.05, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs3733839_Caribbean', rsid: 'rs3733839', gene: 'Unknown', trait: 'Caribbean Indigenous Marker', continent: 'Native American', subpop: 'Caribbean Indigenous', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Caribbean Indigenous populations.', frequencies: { AFR: 0.02, AMR: 0.78, EAS: 0.45, EUR: 0.01, SAS: 0.05, MENA: 0.01 } },
  { markerId: 'rs161497_Central', rsid: 'rs161497', gene: 'Unknown', trait: 'Central American Marker', continent: 'Native American', subpop: 'Central American', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Central American populations.', frequencies: { AFR: 0.1, AMR: 0.89, EAS: 0.12, EUR: 0.05, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs75853687_Central', rsid: 'rs75853687', gene: 'Unknown', trait: 'Central American Marker', continent: 'Native American', subpop: 'Central American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Central American populations.', frequencies: { AFR: 0.01, AMR: 0.98, EAS: 0.02, EUR: 0.01, SAS: 0.01, MENA: 0 } },
  { markerId: 'rs174570_Amazonian', rsid: 'rs174570', gene: 'Unknown', trait: 'Amazonian Indigenous Marker', continent: 'Native American', subpop: 'Amazonian Indigenous', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Amazonian Indigenous populations.', frequencies: { AFR: 0.12, AMR: 0.92, EAS: 0.65, EUR: 0.25, SAS: 0.35, MENA: 0.3 } },
  { markerId: 'rs2848332_SA', rsid: 'rs2848332', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.15, AMR: 0.88, EAS: 0.15, EUR: 0.1, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs11267812_SA', rsid: 'rs11267812', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.02, AMR: 0.96, EAS: 0.08, EUR: 0.05, SAS: 0.03, MENA: 0.02 } },
  { markerId: 'rs2862_SA', rsid: 'rs2862', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.01, AMR: 0.95, EAS: 0.02, EUR: 0.01, SAS: 0.01, MENA: 0 } },
  { markerId: 'rs7777777_Taino', rsid: 'rs7777777', gene: 'Unknown', trait: 'Taino Marker', continent: 'Native American', subpop: 'Taino', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Taino populations.', frequencies: { AFR: 0.05, AMR: 0.9, EAS: 0.02, EUR: 0.03, SAS: 0, MENA: 0 } },
  { markerId: 'rs8888888_Taino', rsid: 'rs8888888', gene: 'Unknown', trait: 'Taino Marker', continent: 'Native American', subpop: 'Taino', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Taino populations.', frequencies: { AFR: 0.03, AMR: 0.92, EAS: 0.01, EUR: 0.04, SAS: 0, MENA: 0 } },
  { markerId: 'rs9999999_Taino', rsid: 'rs9999999', gene: 'Unknown', trait: 'Taino Marker', continent: 'Native American', subpop: 'Taino', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Taino populations.', frequencies: { AFR: 0.04, AMR: 0.88, EAS: 0.02, EUR: 0.06, SAS: 0, MENA: 0 } },
  { markerId: 'rs11111111_Taino', rsid: 'rs11111111', gene: 'Unknown', trait: 'Taino Marker', continent: 'Native American', subpop: 'Taino', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Taino populations.', frequencies: { AFR: 0.02, AMR: 0.94, EAS: 0.01, EUR: 0.03, SAS: 0, MENA: 0 } },
  { markerId: 'rs22222222_Taino', rsid: 'rs22222222', gene: 'Unknown', trait: 'Taino Marker', continent: 'Native American', subpop: 'Taino', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Taino populations.', frequencies: { AFR: 0.03, AMR: 0.9, EAS: 0.02, EUR: 0.05, SAS: 0, MENA: 0 } },
  { markerId: 'rs33333333_Taino', rsid: 'rs33333333', gene: 'Unknown', trait: 'Taino Marker', continent: 'Native American', subpop: 'Taino', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Taino populations.', frequencies: { AFR: 0.04, AMR: 0.85, EAS: 0.03, EUR: 0.08, SAS: 0, MENA: 0 } },
  { markerId: 'rs44444444_Taino', rsid: 'rs44444444', gene: 'Unknown', trait: 'Taino Marker', continent: 'Native American', subpop: 'Taino', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Taino populations.', frequencies: { AFR: 0.02, AMR: 0.93, EAS: 0.01, EUR: 0.04, SAS: 0, MENA: 0 } },
  { markerId: 'rs55555555_Taino', rsid: 'rs55555555', gene: 'Unknown', trait: 'Taino Marker', continent: 'Native American', subpop: 'Taino', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Taino populations.', frequencies: { AFR: 0.03, AMR: 0.91, EAS: 0.02, EUR: 0.06, SAS: 0, MENA: 0 } },
  { markerId: 'rs66666666_Taino', rsid: 'rs66666666', gene: 'Unknown', trait: 'Taino Marker', continent: 'Native American', subpop: 'Taino', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Taino populations.', frequencies: { AFR: 0.04, AMR: 0.88, EAS: 0.03, EUR: 0.05, SAS: 0, MENA: 0 } },
  { markerId: 'rs77777777_Taino', rsid: 'rs77777777', gene: 'Unknown', trait: 'Taino Marker', continent: 'Native American', subpop: 'Taino', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Taino populations.', frequencies: { AFR: 0.02, AMR: 0.95, EAS: 0.01, EUR: 0.02, SAS: 0, MENA: 0 } },
  { markerId: 'rs4908345_SA', rsid: 'rs4908345', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.03, AMR: 0.91, EAS: 0.08, EUR: 0.04, SAS: 0.03, MENA: 0.02 } },
  { markerId: 'rs2016278_SA', rsid: 'rs2016278', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.02, AMR: 0.93, EAS: 0.06, EUR: 0.03, SAS: 0.02, MENA: 0.01 } },
  { markerId: 'rs12028061_SA', rsid: 'rs12028061', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.04, AMR: 0.89, EAS: 0.1, EUR: 0.05, SAS: 0.04, MENA: 0.03 } },
  { markerId: 'rs12119150_SA', rsid: 'rs12119150', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.03, AMR: 0.91, EAS: 0.08, EUR: 0.04, SAS: 0.03, MENA: 0.02 } },
  { markerId: 'rs12535789_SA', rsid: 'rs12535789', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.02, AMR: 0.94, EAS: 0.05, EUR: 0.02, SAS: 0.02, MENA: 0.01 } },
  { markerId: 'rs12727646_SA', rsid: 'rs12727646', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.03, AMR: 0.92, EAS: 0.06, EUR: 0.03, SAS: 0.02, MENA: 0.02 } },
  { markerId: 'rs12752447_SA', rsid: 'rs12752447', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.02, AMR: 0.95, EAS: 0.04, EUR: 0.02, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs12913835_SA', rsid: 'rs12913835', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.05, AMR: 0.88, EAS: 0.15, EUR: 0.08, SAS: 0.06, MENA: 0.05 } },
  { markerId: 'rs12916302_SA', rsid: 'rs12916302', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.03, AMR: 0.91, EAS: 0.1, EUR: 0.05, SAS: 0.04, MENA: 0.03 } },
  { markerId: 'rs13115481_SA', rsid: 'rs13115481', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.04, AMR: 0.89, EAS: 0.12, EUR: 0.06, SAS: 0.05, MENA: 0.04 } },
  { markerId: 'rs13116547_SA', rsid: 'rs13116547', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.02, AMR: 0.94, EAS: 0.08, EUR: 0.04, SAS: 0.03, MENA: 0.02 } },
  { markerId: 'rs13136403_SA', rsid: 'rs13136403', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.03, AMR: 0.92, EAS: 0.06, EUR: 0.03, SAS: 0.02, MENA: 0.02 } },
  { markerId: 'rs13182878_SA', rsid: 'rs13182878', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.05, AMR: 0.88, EAS: 0.15, EUR: 0.08, SAS: 0.06, MENA: 0.05 } },
  { markerId: 'rs1343756_SA', rsid: 'rs1343756', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.03, AMR: 0.91, EAS: 0.1, EUR: 0.05, SAS: 0.04, MENA: 0.03 } },
  { markerId: 'rs1426659_SA', rsid: 'rs1426659', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.02, AMR: 0.94, EAS: 0.08, EUR: 0.04, SAS: 0.03, MENA: 0.02 } },
  { markerId: 'rs1446589_SA', rsid: 'rs1446589', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.03, AMR: 0.92, EAS: 0.06, EUR: 0.03, SAS: 0.02, MENA: 0.02 } },
  { markerId: 'rs1610627_SA', rsid: 'rs1610627', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.02, AMR: 0.95, EAS: 0.04, EUR: 0.02, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs161499_SA', rsid: 'rs161499', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.01, AMR: 0.96, EAS: 0.03, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs16891987_SA', rsid: 'rs16891987', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.05, AMR: 0.88, EAS: 0.15, EUR: 0.08, SAS: 0.06, MENA: 0.05 } },
  { markerId: 'rs17135020_SA', rsid: 'rs17135020', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.03, AMR: 0.91, EAS: 0.1, EUR: 0.05, SAS: 0.04, MENA: 0.03 } },
  { markerId: 'rs174572_SA', rsid: 'rs174572', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.04, AMR: 0.89, EAS: 0.12, EUR: 0.06, SAS: 0.05, MENA: 0.04 } },
  { markerId: 'rs17822933_SA', rsid: 'rs17822933', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.02, AMR: 0.94, EAS: 0.08, EUR: 0.04, SAS: 0.03, MENA: 0.02 } },
  { markerId: 'rs1805012_SA', rsid: 'rs1805012', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.01, AMR: 0.96, EAS: 0.03, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs2016279_SA', rsid: 'rs2016279', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.05, AMR: 0.88, EAS: 0.15, EUR: 0.08, SAS: 0.06, MENA: 0.05 } },
  { markerId: 'rs2066855_SA', rsid: 'rs2066855', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.03, AMR: 0.91, EAS: 0.1, EUR: 0.05, SAS: 0.04, MENA: 0.03 } },
  { markerId: 'rs2187318_SA', rsid: 'rs2187318', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.04, AMR: 0.89, EAS: 0.12, EUR: 0.06, SAS: 0.05, MENA: 0.04 } },
  { markerId: 'rs2228481_SA', rsid: 'rs2228481', gene: 'Unknown', trait: 'South American Marker', continent: 'Native American', subpop: 'South American', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South American populations.', frequencies: { AFR: 0.03, AMR: 0.92, EAS: 0.06, EUR: 0.03, SAS: 0.02, MENA: 0.02 } },
  { markerId: 'rs11215559_Indig', rsid: 'rs11215559', gene: 'Unknown', trait: 'Indigenous Marker', continent: 'Native American', subpop: 'Indigenous', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Indigenous American populations.', frequencies: { AFR: 0.01, AMR: 0.95, EAS: 0.02, SAS: 0.01, EUR: 0.01, MENA: 0.01 } },
  { markerId: 'rs11215560_Indig', rsid: 'rs11215560', gene: 'Unknown', trait: 'Indigenous Marker', continent: 'Native American', subpop: 'Indigenous', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Indigenous American populations.', frequencies: { AFR: 0.01, AMR: 0.98, EAS: 0.01, SAS: 0, EUR: 0.01, MENA: 0 } },
  { markerId: 'rs20424_Beringian', rsid: 'rs20424', gene: 'Unknown', trait: 'Beringian Standstill Proxy', continent: 'Native American', subpop: 'Beringian', alleles: ['T'], significance: 'High', category: 'Ancestry', description: 'Variant unique to the Beringian isolation period; diagnostic for separating Indigenous American from later Asian migrations.', frequencies: { AMR: 0.45, EAS: 0.05, EUR: 0.01 } },
  { markerId: 'rs1426654_Euro', rsid: 'rs1426654', gene: 'SLC24A5', trait: 'European Ancestry Marker', continent: 'European', subpop: 'General', alleles: ['A'], significance: 'High', category: 'Ancestry', description: 'Major European pigmentation marker.', frequencies: { AFR: 0.05, AMR: 0.15, EAS: 0.05, EUR: 0.9, MENA: 0.2 } },
  { markerId: 'rs12913832_Euro', rsid: 'rs12913832', gene: 'HERC2', trait: 'European Ancestry Marker', continent: 'European', subpop: 'General', alleles: ['G'], significance: 'High', category: 'Ancestry', description: 'Major European eye color marker.', frequencies: { AFR: 0.02, AMR: 0.1, EAS: 0.02, EUR: 0.95, MENA: 0.15 } },
  { markerId: 'rs1800407_Euro', rsid: 'rs1800407', gene: 'OCA2', trait: 'European Ancestry Marker', continent: 'European', subpop: 'General', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for European populations.', frequencies: { AFR: 0.08, AMR: 0.12, EAS: 0.06, EUR: 0.85, MENA: 0.1 } },
  { markerId: 'rs12203592_Euro', rsid: 'rs12203592', gene: 'IRF4', trait: 'European Ancestry Marker', continent: 'European', subpop: 'General', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for European populations.', frequencies: { AFR: 0.04, AMR: 0.08, EAS: 0.04, EUR: 0.88, MENA: 0.1 } },
  { markerId: 'rs1042602_Spanish', rsid: 'rs1042602', gene: 'TYR', trait: 'Spanish Ancestry Marker', continent: 'European', subpop: 'Spanish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Spanish populations.', frequencies: { AFR: 0.01, AMR: 0.1, EAS: 0.01, EUR: 0.82, SAS: 0.05, MENA: 0.35 } },
  { markerId: 'rs1805007_Scand', rsid: 'rs1805007', gene: 'MC1R', trait: 'Scandinavian Ancestry Marker', continent: 'European', subpop: 'Scandinavian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Scandinavian populations.', frequencies: { AFR: 0, AMR: 0.02, EAS: 0, EUR: 0.4, SAS: 0.01, MENA: 0.03 } },
  { markerId: 'rs2228479_Scand', rsid: 'rs2228479', gene: 'MC1R', trait: 'Scandinavian Ancestry Marker', continent: 'European', subpop: 'Scandinavian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Scandinavian populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0, EUR: 0.35, SAS: 0.01, MENA: 0.02 } },
  { markerId: 'rs11547464_German', rsid: 'rs11547464', gene: 'MC1R', trait: 'German Ancestry Marker', continent: 'European', subpop: 'German', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for German populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0, EUR: 0.88, SAS: 0.02, MENA: 0.05 } },
  { markerId: 'rs1129038_Polish', rsid: 'rs1129038', gene: 'SLC14A2', trait: 'Polish Ancestry Marker', continent: 'European', subpop: 'Polish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Polish populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0.05, EUR: 0.88, SAS: 0.1, MENA: 0.15 } },
  { markerId: 'rs12916300_Russian', rsid: 'rs12916300', gene: 'Unknown', trait: 'Russian Ancestry Marker', continent: 'European', subpop: 'Russian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Russian populations.', frequencies: { AFR: 0.03, AMR: 0.05, EAS: 0.15, EUR: 0.91, SAS: 0.1, MENA: 0.2 } },
  { markerId: 'rs694339_Polish', rsid: 'rs694339', gene: 'Unknown', trait: 'Polish Ancestry Marker', continent: 'European', subpop: 'Polish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Polish populations.', frequencies: { AFR: 0.02, AMR: 0.04, EAS: 0.08, EUR: 0.89, SAS: 0.05, MENA: 0.12 } },
  { markerId: 'rs7252505_Greek', rsid: 'rs7252505', gene: 'Unknown', trait: 'Greek Ancestry Marker', continent: 'European', subpop: 'Greek', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Greek populations.', frequencies: { AFR: 0.03, AMR: 0.12, EAS: 0.03, EUR: 0.85, SAS: 0.15, MENA: 0.7 } },
  { markerId: 'rs1800414_Portu', rsid: 'rs1800414', gene: 'OCA2', trait: 'Portuguese Ancestry Marker', continent: 'European', subpop: 'Portuguese', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Portuguese populations.', frequencies: { AFR: 0.01, AMR: 0.18, EAS: 0.02, EUR: 0.93, SAS: 0.1, MENA: 0.55 } },
  { markerId: 'rs1446585_French', rsid: 'rs1446585', gene: 'SLC24A4', trait: 'French Ancestry Marker', continent: 'European', subpop: 'French', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for French populations.', frequencies: { AFR: 0.01, AMR: 0.1, EAS: 0.01, EUR: 0.92, SAS: 0.02, MENA: 0.15 } },
  { markerId: 'rs2675348_German', rsid: 'rs2675348', gene: 'Unknown', trait: 'German Ancestry Marker', continent: 'European', subpop: 'German', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for German populations.', frequencies: { AFR: 0.01, AMR: 0.08, EAS: 0.01, EUR: 0.94, SAS: 0.05, MENA: 0.1 } },
  { markerId: 'rs4871195_Scand', rsid: 'rs4871195', gene: 'Unknown', trait: 'Scandinavian Ancestry Marker', continent: 'European', subpop: 'Scandinavian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Scandinavian populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0, EUR: 0.96, SAS: 0.01, MENA: 0.02 } },
  { markerId: 'rs1042524_Spanish', rsid: 'rs1042524', gene: 'Unknown', trait: 'Spanish Ancestry Marker', continent: 'European', subpop: 'Spanish', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Spanish populations.', frequencies: { AFR: 0.01, AMR: 0.1, EAS: 0.01, EUR: 0.94, SAS: 0.05, MENA: 0.35 } },
  { markerId: 'rs11547466_German', rsid: 'rs11547466', gene: 'Unknown', trait: 'German Ancestry Marker', continent: 'European', subpop: 'German', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for German populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0, EUR: 0.92, SAS: 0.02, MENA: 0.08 } },
  { markerId: 'rs16891985_Portu', rsid: 'rs16891985', gene: 'SLC45A2', trait: 'Portuguese Ancestry Marker', continent: 'European', subpop: 'Portuguese', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Portuguese populations.', frequencies: { AFR: 0.01, AMR: 0.15, EAS: 0.01, EUR: 0.95, SAS: 0.1, MENA: 0.55 } },
  { markerId: 'rs1805010_French', rsid: 'rs1805010', gene: 'MC1R', trait: 'French Ancestry Marker', continent: 'European', subpop: 'French', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for French populations.', frequencies: { AFR: 0.01, AMR: 0.1, EAS: 0.01, EUR: 0.92, SAS: 0.02, MENA: 0.15 } },
  { markerId: 'rs4988238_Greek', rsid: 'rs4988238', gene: 'LCT', trait: 'Greek Ancestry Marker', continent: 'European', subpop: 'Greek', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Greek populations.', frequencies: { AFR: 0.02, AMR: 0.1, EAS: 0.02, EUR: 0.88, SAS: 0.2, MENA: 0.7 } },
  { markerId: 'rs1426657_Russian', rsid: 'rs1426657', gene: 'SLC24A5', trait: 'Russian Ancestry Marker', continent: 'European', subpop: 'Russian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Russian populations.', frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.15, EUR: 0.91, SAS: 0.1, MENA: 0.2 } },
  { markerId: 'rs12203594_Polish', rsid: 'rs12203594', gene: 'IRF4', trait: 'Polish Ancestry Marker', continent: 'European', subpop: 'Polish', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Polish populations.', frequencies: { AFR: 0.01, AMR: 0.04, EAS: 0.08, EUR: 0.89, SAS: 0.05, MENA: 0.12 } },
  { markerId: 'rs1042604_Spanish', rsid: 'rs1042604', gene: 'TYR', trait: 'Spanish Ancestry Marker', continent: 'European', subpop: 'Spanish', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Spanish populations.', frequencies: { AFR: 0.01, AMR: 0.1, EAS: 0.01, EUR: 0.94, SAS: 0.05, MENA: 0.35 } },
  { markerId: 'rs1129039_German', rsid: 'rs1129039', gene: 'SLC14A2', trait: 'German Ancestry Marker', continent: 'European', subpop: 'German', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for German populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0, EUR: 0.92, SAS: 0.02, MENA: 0.08 } },
  { markerId: 'rs694341_Portu', rsid: 'rs694341', gene: 'Unknown', trait: 'Portuguese Ancestry Marker', continent: 'European', subpop: 'Portuguese', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Portuguese populations.', frequencies: { AFR: 0.01, AMR: 0.15, EAS: 0.01, EUR: 0.95, SAS: 0.1, MENA: 0.55 } },
  { markerId: 'rs7252508_French', rsid: 'rs7252508', gene: 'Unknown', trait: 'French Ancestry Marker', continent: 'European', subpop: 'French', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for French populations.', frequencies: { AFR: 0.01, AMR: 0.1, EAS: 0.01, EUR: 0.92, SAS: 0.02, MENA: 0.15 } },
  { markerId: 'rs1446588_Russian', rsid: 'rs1446588', gene: 'SLC24A4', trait: 'Russian Ancestry Marker', continent: 'European', subpop: 'Russian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Russian populations.', frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.15, EUR: 0.91, SAS: 0.1, MENA: 0.2 } },
  { markerId: 'rs2675349_Polish', rsid: 'rs2675349', gene: 'Unknown', trait: 'Polish Ancestry Marker', continent: 'European', subpop: 'Polish', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Polish populations.', frequencies: { AFR: 0.01, AMR: 0.04, EAS: 0.08, EUR: 0.89, SAS: 0.05, MENA: 0.12 } },
  { markerId: 'rs4871197_Spanish', rsid: 'rs4871197', gene: 'Unknown', trait: 'Spanish Ancestry Marker', continent: 'European', subpop: 'Spanish', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Spanish populations.', frequencies: { AFR: 0.01, AMR: 0.1, EAS: 0.01, EUR: 0.94, SAS: 0.05, MENA: 0.35 } },
  { markerId: 'rs1042525_German', rsid: 'rs1042525', gene: 'Unknown', trait: 'German Ancestry Marker', continent: 'European', subpop: 'German', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for German populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0, EUR: 0.92, SAS: 0.02, MENA: 0.08 } },
  { markerId: 'rs11547467_Scand', rsid: 'rs11547467', gene: 'MC1R', trait: 'Scandinavian Ancestry Marker', continent: 'European', subpop: 'Scandinavian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Scandinavian populations.', frequencies: { AFR: 0, AMR: 0.02, EAS: 0, EUR: 0.96, SAS: 0.01, MENA: 0.03 } },
  { markerId: 'rs12913836_Portu', rsid: 'rs12913836', gene: 'HERC2', trait: 'Portuguese Ancestry Marker', continent: 'European', subpop: 'Portuguese', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Portuguese populations.', frequencies: { AFR: 0.01, AMR: 0.15, EAS: 0.01, EUR: 0.95, SAS: 0.1, MENA: 0.55 } },
  { markerId: 'rs16891986_French', rsid: 'rs16891986', gene: 'SLC45A2', trait: 'French Ancestry Marker', continent: 'European', subpop: 'French', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for French populations.', frequencies: { AFR: 0.01, AMR: 0.1, EAS: 0.01, EUR: 0.92, SAS: 0.02, MENA: 0.15 } },
  { markerId: 'rs1805011_Greek', rsid: 'rs1805011', gene: 'MC1R', trait: 'Greek Ancestry Marker', continent: 'European', subpop: 'Greek', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Greek populations.', frequencies: { AFR: 0.02, AMR: 0.1, EAS: 0.02, EUR: 0.88, SAS: 0.2, MENA: 0.7 } },
  { markerId: 'rs4988239_Russian', rsid: 'rs4988239', gene: 'LCT', trait: 'Russian Ancestry Marker', continent: 'European', subpop: 'Russian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Russian populations.', frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.15, EUR: 0.91, SAS: 0.1, MENA: 0.2 } },
  { markerId: 'rs1426658_Polish', rsid: 'rs1426658', gene: 'SLC24A5', trait: 'Polish Ancestry Marker', continent: 'European', subpop: 'Polish', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Polish populations.', frequencies: { AFR: 0.01, AMR: 0.04, EAS: 0.08, EUR: 0.89, SAS: 0.05, MENA: 0.12 } },
  { markerId: 'rs10486571_German', rsid: 'rs10486571', gene: 'Unknown', trait: 'German Ancestry Marker', continent: 'European', subpop: 'German', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for German populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0.01, EUR: 0.92, SAS: 0.02, MENA: 0.08 } },
  { markerId: 'rs11580127_Scand', rsid: 'rs11580127', gene: 'Unknown', trait: 'Scandinavian Ancestry Marker', continent: 'European', subpop: 'Scandinavian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Scandinavian populations.', frequencies: { AFR: 0, AMR: 0.02, EAS: 0, EUR: 0.96, SAS: 0.01, MENA: 0.03 } },
  { markerId: 'rs12727651_Portu', rsid: 'rs12727651', gene: 'Unknown', trait: 'Portuguese Ancestry Marker', continent: 'European', subpop: 'Portuguese', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Portuguese populations.', frequencies: { AFR: 0.01, AMR: 0.15, EAS: 0.01, EUR: 0.95, SAS: 0.1, MENA: 0.55 } },
  { markerId: 'rs17135023_French', rsid: 'rs17135023', gene: 'Unknown', trait: 'French Ancestry Marker', continent: 'European', subpop: 'French', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for French populations.', frequencies: { AFR: 0.01, AMR: 0.1, EAS: 0.01, EUR: 0.92, SAS: 0.02, MENA: 0.15 } },
  { markerId: 'rs13182881_Greek', rsid: 'rs13182881', gene: 'Unknown', trait: 'Greek Ancestry Marker', continent: 'European', subpop: 'Greek', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Greek populations.', frequencies: { AFR: 0.02, AMR: 0.1, EAS: 0.02, EUR: 0.88, SAS: 0.2, MENA: 0.7 } },
  { markerId: 'rs13116550_Russian', rsid: 'rs13116550', gene: 'Unknown', trait: 'Russian Ancestry Marker', continent: 'European', subpop: 'Russian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Russian populations.', frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.15, EUR: 0.91, SAS: 0.1, MENA: 0.2 } },
  { markerId: 'rs1343759_Polish', rsid: 'rs1343759', gene: 'Unknown', trait: 'Polish Ancestry Marker', continent: 'European', subpop: 'Polish', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Polish populations.', frequencies: { AFR: 0.01, AMR: 0.04, EAS: 0.08, EUR: 0.89, SAS: 0.05, MENA: 0.12 } },
  { markerId: 'rs13115484_Spanish', rsid: 'rs13115484', gene: 'Unknown', trait: 'Spanish Ancestry Marker', continent: 'European', subpop: 'Spanish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Spanish populations.', frequencies: { AFR: 0.01, AMR: 0.1, EAS: 0.01, EUR: 0.94, SAS: 0.05, MENA: 0.35 } },
  { markerId: 'rs1114097_German', rsid: 'rs1114097', gene: 'Unknown', trait: 'German Ancestry Marker', continent: 'European', subpop: 'German', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for German populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0, EUR: 0.92, SAS: 0.02, MENA: 0.08 } },
  { markerId: 'rs10424069_Scand', rsid: 'rs10424069', gene: 'Unknown', trait: 'Scandinavian Ancestry Marker', continent: 'European', subpop: 'Scandinavian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Scandinavian populations.', frequencies: { AFR: 0, AMR: 0.02, EAS: 0, EUR: 0.96, SAS: 0.01, MENA: 0.03 } },
  { markerId: 'rs56203819_Portu', rsid: 'rs56203819', gene: 'Unknown', trait: 'Portuguese Ancestry Marker', continent: 'European', subpop: 'Portuguese', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Portuguese populations.', frequencies: { AFR: 0.01, AMR: 0.15, EAS: 0.01, EUR: 0.95, SAS: 0.1, MENA: 0.55 } },
  { markerId: 'rs6510765_French', rsid: 'rs6510765', gene: 'Unknown', trait: 'French Ancestry Marker', continent: 'European', subpop: 'French', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for French populations.', frequencies: { AFR: 0.01, AMR: 0.1, EAS: 0.01, EUR: 0.92, SAS: 0.02, MENA: 0.15 } },
  { markerId: 'rs7948627_Greek', rsid: 'rs7948627', gene: 'Unknown', trait: 'Greek Ancestry Marker', continent: 'European', subpop: 'Greek', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Greek populations.', frequencies: { AFR: 0.02, AMR: 0.1, EAS: 0.02, EUR: 0.88, SAS: 0.2, MENA: 0.7 } },
  { markerId: 'rs11230668_Russian', rsid: 'rs11230668', gene: 'Unknown', trait: 'Russian Ancestry Marker', continent: 'European', subpop: 'Russian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Russian populations.', frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.15, EUR: 0.91, SAS: 0.1, MENA: 0.2 } },
  { markerId: 'rs10456192_British', rsid: 'rs10456192', gene: 'Unknown', trait: 'British Ancestry Marker', continent: 'European', subpop: 'British', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for British populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0, EUR: 0.98, SAS: 0.01, MENA: 0.02 } },
  { markerId: 'rs10456193_Irish', rsid: 'rs10456193', gene: 'Unknown', trait: 'Irish Ancestry Marker', continent: 'European', subpop: 'Irish', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Irish populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0, EUR: 0.97, SAS: 0.01, MENA: 0.02 } },
  { markerId: 'rs10456194_Italian', rsid: 'rs10456194', gene: 'Unknown', trait: 'Italian Ancestry Marker', continent: 'European', subpop: 'Italian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Italian populations.', frequencies: { AFR: 0.02, AMR: 0.1, EAS: 0.02, EUR: 0.85, SAS: 0.15, MENA: 0.65 } },
  { markerId: 'rs10456195_Dutch', rsid: 'rs10456195', gene: 'Unknown', trait: 'Dutch Ancestry Marker', continent: 'European', subpop: 'Dutch', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Dutch populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0, EUR: 0.96, SAS: 0.02, MENA: 0.05 } },
  { markerId: 'rs10456196_Swiss', rsid: 'rs10456196', gene: 'Unknown', trait: 'Swiss Ancestry Marker', continent: 'European', subpop: 'Swiss', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Swiss populations.', frequencies: { AFR: 0.01, AMR: 0.08, EAS: 0.01, EUR: 0.94, SAS: 0.05, MENA: 0.15 } },
  { markerId: 'rs10456197_Austrian', rsid: 'rs10456197', gene: 'Unknown', trait: 'Austrian Ancestry Marker', continent: 'European', subpop: 'Austrian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Austrian populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0.02, EUR: 0.92, SAS: 0.05, MENA: 0.1 } },
  { markerId: 'rs10456198_Hungarian', rsid: 'rs10456198', gene: 'Unknown', trait: 'Hungarian Ancestry Marker', continent: 'European', subpop: 'Hungarian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Hungarian populations.', frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.05, EUR: 0.88, SAS: 0.1, MENA: 0.15 } },
  { markerId: 'rs10456199_Czech', rsid: 'rs10456199', gene: 'Unknown', trait: 'Czech Ancestry Marker', continent: 'European', subpop: 'Czech', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Czech populations.', frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.05, EUR: 0.89, SAS: 0.08, MENA: 0.12 } },
  { markerId: 'rs10456200_Finnish', rsid: 'rs10456200', gene: 'Unknown', trait: 'Finnish Ancestry Marker', continent: 'European', subpop: 'Finnish', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Finnish populations.', frequencies: { AFR: 0, AMR: 0.02, EAS: 0.1, EUR: 0.95, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs12727652_Sami', rsid: 'rs12727652', gene: 'Unknown', trait: 'Sami Ancestry Marker', continent: 'European', subpop: 'Sami', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sami populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.05, EUR: 0.95, SAS: 0.01, MENA: 0 } },
  { markerId: 'rs17135024_Sami', rsid: 'rs17135024', gene: 'Unknown', trait: 'Sami Ancestry Marker', continent: 'European', subpop: 'Sami', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sami populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.06, EUR: 0.94, SAS: 0.01, MENA: 0 } },
  { markerId: 'rs13182882_Sami', rsid: 'rs13182882', gene: 'Unknown', trait: 'Sami Ancestry Marker', continent: 'European', subpop: 'Sami', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sami populations.', frequencies: { AFR: 0, AMR: 0.02, EAS: 0.08, EUR: 0.92, SAS: 0.02, MENA: 0 } },
  { markerId: 'rs13116551_Sami', rsid: 'rs13116551', gene: 'Unknown', trait: 'Sami Ancestry Marker', continent: 'European', subpop: 'Sami', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sami populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.04, EUR: 0.96, SAS: 0.01, MENA: 0 } },
  { markerId: 'rs1343760_Sami', rsid: 'rs1343760', gene: 'Unknown', trait: 'Sami Ancestry Marker', continent: 'European', subpop: 'Sami', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sami populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.05, EUR: 0.95, SAS: 0.01, MENA: 0 } },
  { markerId: 'rs10488629_Portu', rsid: 'rs10488629', gene: 'Unknown', trait: 'Portuguese Ancestry Marker', continent: 'European', subpop: 'Portuguese', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Portuguese populations.', frequencies: { AFR: 0.05, AMR: 0.15, EAS: 0.01, SAS: 0.01, EUR: 0.95, MENA: 0.08 } },
  { markerId: 'rs11103331_Spanish', rsid: 'rs11103331', gene: 'Unknown', trait: 'Spanish Ancestry Marker', continent: 'European', subpop: 'Spanish', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Spanish populations.', frequencies: { AFR: 0.02, AMR: 0.2, EAS: 0.01, SAS: 0.01, EUR: 0.98, MENA: 0.05 } },
  { markerId: 'rs11103339_English', rsid: 'rs11103339', gene: 'Unknown', trait: 'English Ancestry Marker', continent: 'European', subpop: 'English', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for English populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, SAS: 0.01, EUR: 0.98, MENA: 0.01 } },
  { markerId: 'rs11103340_Irish', rsid: 'rs11103340', gene: 'Unknown', trait: 'Irish Ancestry Marker', continent: 'European', subpop: 'Irish', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Irish populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, SAS: 0.01, EUR: 0.99, MENA: 0.01 } },
  { markerId: 'rs11103341_Welsh', rsid: 'rs11103341', gene: 'Unknown', trait: 'Welsh Ancestry Marker', continent: 'European', subpop: 'Welsh', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Welsh populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, SAS: 0.01, EUR: 0.99, MENA: 0.01 } },
  { markerId: 'rs11103342_Scottish', rsid: 'rs11103342', gene: 'Unknown', trait: 'Scottish Ancestry Marker', continent: 'European', subpop: 'Scottish', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Scottish populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, SAS: 0.01, EUR: 0.99, MENA: 0.01 } },
  { markerId: 'rs11103343_German', rsid: 'rs11103343', gene: 'Unknown', trait: 'German Ancestry Marker', continent: 'European', subpop: 'German', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for German populations.', frequencies: { AFR: 0.02, AMR: 0.02, EAS: 0.01, SAS: 0.01, EUR: 0.97, MENA: 0.02 } },
  { markerId: 'rs11103344_Dutch', rsid: 'rs11103344', gene: 'Unknown', trait: 'Dutch Ancestry Marker', continent: 'European', subpop: 'Dutch', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Dutch populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, SAS: 0.01, EUR: 0.98, MENA: 0.01 } },
  { markerId: 'rs11103353_English', rsid: 'rs11103353', gene: 'Unknown', trait: 'English Ancestry Marker', continent: 'European', subpop: 'English', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for English populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, SAS: 0.01, EUR: 0.97, MENA: 0.01 } },
  { markerId: 'rs11103354_Irish', rsid: 'rs11103354', gene: 'Unknown', trait: 'Irish Ancestry Marker', continent: 'European', subpop: 'Irish', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Irish populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0, SAS: 0.01, EUR: 0.98, MENA: 0.01 } },
  { markerId: 'rs11103355_Welsh', rsid: 'rs11103355', gene: 'Unknown', trait: 'Welsh Ancestry Marker', continent: 'European', subpop: 'Welsh', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Welsh populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0, SAS: 0.01, EUR: 0.98, MENA: 0.01 } },
  { markerId: 'rs11103356_Scottish', rsid: 'rs11103356', gene: 'Unknown', trait: 'Scottish Ancestry Marker', continent: 'European', subpop: 'Scottish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Scottish populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0, SAS: 0.01, EUR: 0.98, MENA: 0.01 } },
  { markerId: 'rs11103357_German', rsid: 'rs11103357', gene: 'Unknown', trait: 'German Ancestry Marker', continent: 'European', subpop: 'German', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for German populations.', frequencies: { AFR: 0.02, AMR: 0.02, EAS: 0.01, SAS: 0.01, EUR: 0.96, MENA: 0.02 } },
  { markerId: 'rs11103358_Dutch', rsid: 'rs11103358', gene: 'Unknown', trait: 'Dutch Ancestry Marker', continent: 'European', subpop: 'Dutch', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Dutch populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, SAS: 0.01, EUR: 0.97, MENA: 0.01 } },
  { markerId: 'rs11103359_Afrikaner', rsid: 'rs11103359', gene: 'Unknown', trait: 'Afrikaner Ancestry Marker', continent: 'European', subpop: 'Afrikaner', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Afrikaner populations.', frequencies: { AFR: 0.06, AMR: 0.02, EAS: 0.02, SAS: 0.02, EUR: 0.88, MENA: 0.03 } },
  { markerId: 'rs11103367_English', rsid: 'rs11103367', gene: 'Unknown', trait: 'English Ancestry Marker', continent: 'European', subpop: 'English', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for English populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, SAS: 0.01, EUR: 0.96, MENA: 0.01 } },
  { markerId: 'rs11103368_Irish', rsid: 'rs11103368', gene: 'Unknown', trait: 'Irish Ancestry Marker', continent: 'European', subpop: 'Irish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Irish populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0, SAS: 0.01, EUR: 0.97, MENA: 0.01 } },
  { markerId: 'rs11103369_Welsh', rsid: 'rs11103369', gene: 'Unknown', trait: 'Welsh Ancestry Marker', continent: 'European', subpop: 'Welsh', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Welsh populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0, SAS: 0.01, EUR: 0.97, MENA: 0.01 } },
  { markerId: 'rs11103370_Scottish', rsid: 'rs11103370', gene: 'Unknown', trait: 'Scottish Ancestry Marker', continent: 'European', subpop: 'Scottish', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Scottish populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0, SAS: 0.01, EUR: 0.97, MENA: 0.01 } },
  { markerId: 'rs11103371_German', rsid: 'rs11103371', gene: 'Unknown', trait: 'German Ancestry Marker', continent: 'European', subpop: 'German', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for German populations.', frequencies: { AFR: 0.02, AMR: 0.02, EAS: 0.01, SAS: 0.01, EUR: 0.95, MENA: 0.02 } },
  { markerId: 'rs11103372_Dutch', rsid: 'rs11103372', gene: 'Unknown', trait: 'Dutch Ancestry Marker', continent: 'European', subpop: 'Dutch', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Dutch populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, SAS: 0.01, EUR: 0.96, MENA: 0.01 } },
  { markerId: 'rs11103373_Afrikaner', rsid: 'rs11103373', gene: 'Unknown', trait: 'Afrikaner Ancestry Marker', continent: 'European', subpop: 'Afrikaner', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Afrikaner populations.', frequencies: { AFR: 0.07, AMR: 0.02, EAS: 0.02, SAS: 0.02, EUR: 0.87, MENA: 0.03 } },
  { markerId: 'rs9000091_British', rsid: 'rs9000091', gene: 'Unknown', trait: 'British Ancestry Marker', continent: 'European', subpop: 'British', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for British populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000092_British', rsid: 'rs9000092', gene: 'Unknown', trait: 'British Ancestry Marker', continent: 'European', subpop: 'British', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for British populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000093_British', rsid: 'rs9000093', gene: 'Unknown', trait: 'British Ancestry Marker', continent: 'European', subpop: 'British', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for British populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000094_British', rsid: 'rs9000094', gene: 'Unknown', trait: 'British Ancestry Marker', continent: 'European', subpop: 'British', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for British populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000095_Irish', rsid: 'rs9000095', gene: 'Unknown', trait: 'Irish Ancestry Marker', continent: 'European', subpop: 'Irish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Irish populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000096_Italian', rsid: 'rs9000096', gene: 'Unknown', trait: 'Italian Ancestry Marker', continent: 'European', subpop: 'Italian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Italian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000097_Italian', rsid: 'rs9000097', gene: 'Unknown', trait: 'Italian Ancestry Marker', continent: 'European', subpop: 'Italian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Italian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000098_Italian', rsid: 'rs9000098', gene: 'Unknown', trait: 'Italian Ancestry Marker', continent: 'European', subpop: 'Italian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Italian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000099_Dutch', rsid: 'rs9000099', gene: 'Unknown', trait: 'Dutch Ancestry Marker', continent: 'European', subpop: 'Dutch', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Dutch populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000100_Dutch', rsid: 'rs9000100', gene: 'Unknown', trait: 'Dutch Ancestry Marker', continent: 'European', subpop: 'Dutch', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Dutch populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000101_Swiss', rsid: 'rs9000101', gene: 'Unknown', trait: 'Swiss Ancestry Marker', continent: 'European', subpop: 'Swiss', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Swiss populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000102_Swiss', rsid: 'rs9000102', gene: 'Unknown', trait: 'Swiss Ancestry Marker', continent: 'European', subpop: 'Swiss', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Swiss populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000103_Swiss', rsid: 'rs9000103', gene: 'Unknown', trait: 'Swiss Ancestry Marker', continent: 'European', subpop: 'Swiss', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Swiss populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000104_Swiss', rsid: 'rs9000104', gene: 'Unknown', trait: 'Swiss Ancestry Marker', continent: 'European', subpop: 'Swiss', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Swiss populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000105_Austrian', rsid: 'rs9000105', gene: 'Unknown', trait: 'Austrian Ancestry Marker', continent: 'European', subpop: 'Austrian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Austrian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000106_Austrian', rsid: 'rs9000106', gene: 'Unknown', trait: 'Austrian Ancestry Marker', continent: 'European', subpop: 'Austrian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Austrian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000107_Austrian', rsid: 'rs9000107', gene: 'Unknown', trait: 'Austrian Ancestry Marker', continent: 'European', subpop: 'Austrian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Austrian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000108_Austrian', rsid: 'rs9000108', gene: 'Unknown', trait: 'Austrian Ancestry Marker', continent: 'European', subpop: 'Austrian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Austrian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000109_Hungarian', rsid: 'rs9000109', gene: 'Unknown', trait: 'Hungarian Ancestry Marker', continent: 'European', subpop: 'Hungarian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Hungarian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000110_Hungarian', rsid: 'rs9000110', gene: 'Unknown', trait: 'Hungarian Ancestry Marker', continent: 'European', subpop: 'Hungarian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Hungarian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000111_Hungarian', rsid: 'rs9000111', gene: 'Unknown', trait: 'Hungarian Ancestry Marker', continent: 'European', subpop: 'Hungarian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Hungarian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000112_Hungarian', rsid: 'rs9000112', gene: 'Unknown', trait: 'Hungarian Ancestry Marker', continent: 'European', subpop: 'Hungarian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Hungarian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000113_Czech', rsid: 'rs9000113', gene: 'Unknown', trait: 'Czech Ancestry Marker', continent: 'European', subpop: 'Czech', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Czech populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000114_Czech', rsid: 'rs9000114', gene: 'Unknown', trait: 'Czech Ancestry Marker', continent: 'European', subpop: 'Czech', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Czech populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000115_Czech', rsid: 'rs9000115', gene: 'Unknown', trait: 'Czech Ancestry Marker', continent: 'European', subpop: 'Czech', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Czech populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000116_Czech', rsid: 'rs9000116', gene: 'Unknown', trait: 'Czech Ancestry Marker', continent: 'European', subpop: 'Czech', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Czech populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000117_Finnish', rsid: 'rs9000117', gene: 'Unknown', trait: 'Finnish Ancestry Marker', continent: 'European', subpop: 'Finnish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Finnish populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000118_Finnish', rsid: 'rs9000118', gene: 'Unknown', trait: 'Finnish Ancestry Marker', continent: 'European', subpop: 'Finnish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Finnish populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000119_Basque', rsid: 'rs9000119', gene: 'Unknown', trait: 'Basque Ancestry Marker', continent: 'European', subpop: 'Basque', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Basque populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000120_Basque', rsid: 'rs9000120', gene: 'Unknown', trait: 'Basque Ancestry Marker', continent: 'European', subpop: 'Basque', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Basque populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000121_Basque', rsid: 'rs9000121', gene: 'Unknown', trait: 'Basque Ancestry Marker', continent: 'European', subpop: 'Basque', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Basque populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000122_Ashke', rsid: 'rs9000122', gene: 'Unknown', trait: 'Ashkenazi Ancestry Marker', continent: 'European', subpop: 'Ashkenazi', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Ashkenazi populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000123_Ashke', rsid: 'rs9000123', gene: 'Unknown', trait: 'Ashkenazi Ancestry Marker', continent: 'European', subpop: 'Ashkenazi', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Ashkenazi populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000124_Ashke', rsid: 'rs9000124', gene: 'Unknown', trait: 'Ashkenazi Ancestry Marker', continent: 'European', subpop: 'Ashkenazi', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Ashkenazi populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000125_Seph', rsid: 'rs9000125', gene: 'Unknown', trait: 'Sephardic Ancestry Marker', continent: 'European', subpop: 'Sephardic', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sephardic populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000126_Seph', rsid: 'rs9000126', gene: 'Unknown', trait: 'Sephardic Ancestry Marker', continent: 'European', subpop: 'Sephardic', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sephardic populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000127_Seph', rsid: 'rs9000127', gene: 'Unknown', trait: 'Sephardic Ancestry Marker', continent: 'European', subpop: 'Sephardic', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sephardic populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000128_Roma', rsid: 'rs9000128', gene: 'Unknown', trait: 'Roma Ancestry Marker', continent: 'European', subpop: 'Roma', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Roma populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000129_Roma', rsid: 'rs9000129', gene: 'Unknown', trait: 'Roma Ancestry Marker', continent: 'European', subpop: 'Roma', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Roma populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000130_Roma', rsid: 'rs9000130', gene: 'Unknown', trait: 'Roma Ancestry Marker', continent: 'European', subpop: 'Roma', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Roma populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000131_Roma', rsid: 'rs9000131', gene: 'Unknown', trait: 'Roma Ancestry Marker', continent: 'European', subpop: 'Roma', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Roma populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000132_NWEuro', rsid: 'rs9000132', gene: 'Unknown', trait: 'Northwestern Europe Ancestry Marker', continent: 'European', subpop: 'NorthwesternEurope', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northwestern Europe populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000133_NWEuro', rsid: 'rs9000133', gene: 'Unknown', trait: 'Northwestern Europe Ancestry Marker', continent: 'European', subpop: 'NorthwesternEurope', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northwestern Europe populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000134_NWEuro', rsid: 'rs9000134', gene: 'Unknown', trait: 'Northwestern Europe Ancestry Marker', continent: 'European', subpop: 'NorthwesternEurope', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northwestern Europe populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000135_NWEuro', rsid: 'rs9000135', gene: 'Unknown', trait: 'Northwestern Europe Ancestry Marker', continent: 'European', subpop: 'NorthwesternEurope', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northwestern Europe populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000136_BritIsles', rsid: 'rs9000136', gene: 'Unknown', trait: 'British Isles Ancestry Marker', continent: 'European', subpop: 'BritishIsles', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for British Isles populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000137_BritIsles', rsid: 'rs9000137', gene: 'Unknown', trait: 'British Isles Ancestry Marker', continent: 'European', subpop: 'BritishIsles', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for British Isles populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000138_BritIsles', rsid: 'rs9000138', gene: 'Unknown', trait: 'British Isles Ancestry Marker', continent: 'European', subpop: 'BritishIsles', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for British Isles populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000139_BritIsles', rsid: 'rs9000139', gene: 'Unknown', trait: 'British Isles Ancestry Marker', continent: 'European', subpop: 'BritishIsles', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for British Isles populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000140_EastEuro', rsid: 'rs9000140', gene: 'Unknown', trait: 'Eastern European Ancestry Marker', continent: 'European', subpop: 'EasternEuropean', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Eastern European populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000141_EastEuro', rsid: 'rs9000141', gene: 'Unknown', trait: 'Eastern European Ancestry Marker', continent: 'European', subpop: 'EasternEuropean', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Eastern European populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000142_EastEuro', rsid: 'rs9000142', gene: 'Unknown', trait: 'Eastern European Ancestry Marker', continent: 'European', subpop: 'EasternEuropean', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Eastern European populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000143_EastEuro', rsid: 'rs9000143', gene: 'Unknown', trait: 'Eastern European Ancestry Marker', continent: 'European', subpop: 'EasternEuropean', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Eastern European populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000144_Balkans', rsid: 'rs9000144', gene: 'Unknown', trait: 'Balkans Ancestry Marker', continent: 'European', subpop: 'Balkans', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Balkans populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000145_Balkans', rsid: 'rs9000145', gene: 'Unknown', trait: 'Balkans Ancestry Marker', continent: 'European', subpop: 'Balkans', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Balkans populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000146_Balkans', rsid: 'rs9000146', gene: 'Unknown', trait: 'Balkans Ancestry Marker', continent: 'European', subpop: 'Balkans', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Balkans populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000147_Balkans', rsid: 'rs9000147', gene: 'Unknown', trait: 'Balkans Ancestry Marker', continent: 'European', subpop: 'Balkans', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Balkans populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000148_Iberian', rsid: 'rs9000148', gene: 'Unknown', trait: 'Iberian Ancestry Marker', continent: 'European', subpop: 'Iberian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Iberian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000149_Iberian', rsid: 'rs9000149', gene: 'Unknown', trait: 'Iberian Ancestry Marker', continent: 'European', subpop: 'Iberian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Iberian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000150_Iberian', rsid: 'rs9000150', gene: 'Unknown', trait: 'Iberian Ancestry Marker', continent: 'European', subpop: 'Iberian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Iberian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000151_Iberian', rsid: 'rs9000151', gene: 'Unknown', trait: 'Iberian Ancestry Marker', continent: 'European', subpop: 'Iberian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Iberian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000152_NWEuro_Spaced', rsid: 'rs9000152', gene: 'Unknown', trait: 'Northwestern European Ancestry Marker', continent: 'European', subpop: 'Northwestern European', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northwestern European populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000153_NWEuro_Spaced', rsid: 'rs9000153', gene: 'Unknown', trait: 'Northwestern European Ancestry Marker', continent: 'European', subpop: 'Northwestern European', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northwestern European populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000154_NWEuro_Spaced', rsid: 'rs9000154', gene: 'Unknown', trait: 'Northwestern European Ancestry Marker', continent: 'European', subpop: 'Northwestern European', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northwestern European populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000155_NWEuro_Spaced', rsid: 'rs9000155', gene: 'Unknown', trait: 'Northwestern European Ancestry Marker', continent: 'European', subpop: 'Northwestern European', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northwestern European populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000156_SouthEuro', rsid: 'rs9000156', gene: 'Unknown', trait: 'Southern European Ancestry Marker', continent: 'European', subpop: 'Southern European', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Southern European populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000157_SouthEuro', rsid: 'rs9000157', gene: 'Unknown', trait: 'Southern European Ancestry Marker', continent: 'European', subpop: 'Southern European', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Southern European populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000158_SouthEuro', rsid: 'rs9000158', gene: 'Unknown', trait: 'Southern European Ancestry Marker', continent: 'European', subpop: 'Southern European', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Southern European populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000159_SouthEuro', rsid: 'rs9000159', gene: 'Unknown', trait: 'Southern European Ancestry Marker', continent: 'European', subpop: 'Southern European', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Southern European populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000160_EastEuro_Spaced', rsid: 'rs9000160', gene: 'Unknown', trait: 'Eastern European Ancestry Marker', continent: 'European', subpop: 'Eastern European', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Eastern European populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000161_EastEuro_Spaced', rsid: 'rs9000161', gene: 'Unknown', trait: 'Eastern European Ancestry Marker', continent: 'European', subpop: 'Eastern European', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Eastern European populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000162_EastEuro_Spaced', rsid: 'rs9000162', gene: 'Unknown', trait: 'Eastern European Ancestry Marker', continent: 'European', subpop: 'Eastern European', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Eastern European populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000163_EastEuro_Spaced', rsid: 'rs9000163', gene: 'Unknown', trait: 'Eastern European Ancestry Marker', continent: 'European', subpop: 'Eastern European', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Eastern European populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000164_English', rsid: 'rs9000164', gene: 'Unknown', trait: 'English Ancestry Marker', continent: 'European', subpop: 'English', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for English populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000165_English', rsid: 'rs9000165', gene: 'Unknown', trait: 'English Ancestry Marker', continent: 'European', subpop: 'English', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for English populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000166_Welsh', rsid: 'rs9000166', gene: 'Unknown', trait: 'Welsh Ancestry Marker', continent: 'European', subpop: 'Welsh', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Welsh populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000167_Welsh', rsid: 'rs9000167', gene: 'Unknown', trait: 'Welsh Ancestry Marker', continent: 'European', subpop: 'Welsh', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Welsh populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000168_Welsh', rsid: 'rs9000168', gene: 'Unknown', trait: 'Welsh Ancestry Marker', continent: 'European', subpop: 'Welsh', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Welsh populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000169_Scottish', rsid: 'rs9000169', gene: 'Unknown', trait: 'Scottish Ancestry Marker', continent: 'European', subpop: 'Scottish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Scottish populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000170_Scottish', rsid: 'rs9000170', gene: 'Unknown', trait: 'Scottish Ancestry Marker', continent: 'European', subpop: 'Scottish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Scottish populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000171_Scottish', rsid: 'rs9000171', gene: 'Unknown', trait: 'Scottish Ancestry Marker', continent: 'European', subpop: 'Scottish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Scottish populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000172_Afrikaner', rsid: 'rs9000172', gene: 'Unknown', trait: 'Afrikaner Ancestry Marker', continent: 'European', subpop: 'Afrikaner', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Afrikaner populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000173_Afrikaner', rsid: 'rs9000173', gene: 'Unknown', trait: 'Afrikaner Ancestry Marker', continent: 'European', subpop: 'Afrikaner', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Afrikaner populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.8, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000174_Irish', rsid: 'rs9000174', gene: 'Unknown', trait: 'Irish Ancestry Marker', continent: 'European', subpop: 'Irish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Irish populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.98, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000175_Irish', rsid: 'rs9000175', gene: 'Unknown', trait: 'Irish Ancestry Marker', continent: 'European', subpop: 'Irish', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Irish populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.97, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000176_Scottish', rsid: 'rs9000176', gene: 'Unknown', trait: 'Scottish Ancestry Marker', continent: 'European', subpop: 'Scottish', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Scottish populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.96, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000177_Scottish', rsid: 'rs9000177', gene: 'Unknown', trait: 'Scottish Ancestry Marker', continent: 'European', subpop: 'Scottish', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Scottish populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.95, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000178_Welsh', rsid: 'rs9000178', gene: 'Unknown', trait: 'Welsh Ancestry Marker', continent: 'European', subpop: 'Welsh', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Welsh populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.94, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000179_Welsh', rsid: 'rs9000179', gene: 'Unknown', trait: 'Welsh Ancestry Marker', continent: 'European', subpop: 'Welsh', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Welsh populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.93, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000180_Norwegian', rsid: 'rs9000180', gene: 'Unknown', trait: 'Norwegian Ancestry Marker', continent: 'European', subpop: 'Norwegian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Norwegian populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.01, EUR: 0.98, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000181_Norwegian', rsid: 'rs9000181', gene: 'Unknown', trait: 'Norwegian Ancestry Marker', continent: 'European', subpop: 'Norwegian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Norwegian populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.01, EUR: 0.97, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000182_Swedish', rsid: 'rs9000182', gene: 'Unknown', trait: 'Swedish Ancestry Marker', continent: 'European', subpop: 'Swedish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Swedish populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.01, EUR: 0.96, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000183_Swedish', rsid: 'rs9000183', gene: 'Unknown', trait: 'Swedish Ancestry Marker', continent: 'European', subpop: 'Swedish', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Swedish populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.01, EUR: 0.95, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000184_Danish', rsid: 'rs9000184', gene: 'Unknown', trait: 'Danish Ancestry Marker', continent: 'European', subpop: 'Danish', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Danish populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.94, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000185_Danish', rsid: 'rs9000185', gene: 'Unknown', trait: 'Danish Ancestry Marker', continent: 'European', subpop: 'Danish', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Danish populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.01, EUR: 0.93, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000186_Finnish', rsid: 'rs9000186', gene: 'Unknown', trait: 'Finnish Ancestry Marker', continent: 'European', subpop: 'Finnish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Finnish populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.05, EUR: 0.92, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000187_Finnish', rsid: 'rs9000187', gene: 'Unknown', trait: 'Finnish Ancestry Marker', continent: 'European', subpop: 'Finnish', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Finnish populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.05, EUR: 0.91, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000188_French', rsid: 'rs9000188', gene: 'Unknown', trait: 'French Ancestry Marker', continent: 'European', subpop: 'French', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for French populations.', frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.01, EUR: 0.9, SAS: 0.01, MENA: 0.05 } },
  { markerId: 'rs9000189_French', rsid: 'rs9000189', gene: 'Unknown', trait: 'French Ancestry Marker', continent: 'European', subpop: 'French', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for French populations.', frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.01, EUR: 0.89, SAS: 0.01, MENA: 0.05 } },
  { markerId: 'rs9000190_German', rsid: 'rs9000190', gene: 'Unknown', trait: 'German Ancestry Marker', continent: 'European', subpop: 'German', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for German populations.', frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.01, EUR: 0.88, SAS: 0.02, MENA: 0.05 } },
  { markerId: 'rs9000191_German', rsid: 'rs9000191', gene: 'Unknown', trait: 'German Ancestry Marker', continent: 'European', subpop: 'German', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for German populations.', frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.01, EUR: 0.87, SAS: 0.02, MENA: 0.05 } },
  { markerId: 'rs9000192_Dutch', rsid: 'rs9000192', gene: 'Unknown', trait: 'Dutch Ancestry Marker', continent: 'European', subpop: 'Dutch', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Dutch populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0.01, EUR: 0.92, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000193_Dutch', rsid: 'rs9000193', gene: 'Unknown', trait: 'Dutch Ancestry Marker', continent: 'European', subpop: 'Dutch', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Dutch populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0.01, EUR: 0.91, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000194_Italian', rsid: 'rs9000194', gene: 'Unknown', trait: 'Italian Ancestry Marker', continent: 'European', subpop: 'Italian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Italian populations.', frequencies: { AFR: 0.03, AMR: 0.05, EAS: 0.01, EUR: 0.8, SAS: 0.05, MENA: 0.15 } },
  { markerId: 'rs9000195_Italian', rsid: 'rs9000195', gene: 'Unknown', trait: 'Italian Ancestry Marker', continent: 'European', subpop: 'Italian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Italian populations.', frequencies: { AFR: 0.03, AMR: 0.05, EAS: 0.01, EUR: 0.79, SAS: 0.05, MENA: 0.15 } },
  { markerId: 'rs9000196_Spanish', rsid: 'rs9000196', gene: 'Unknown', trait: 'Spanish Ancestry Marker', continent: 'European', subpop: 'Spanish', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Spanish populations.', frequencies: { AFR: 0.05, AMR: 0.15, EAS: 0.01, EUR: 0.75, SAS: 0.02, MENA: 0.1 } },
  { markerId: 'rs9000197_Spanish', rsid: 'rs9000197', gene: 'Unknown', trait: 'Spanish Ancestry Marker', continent: 'European', subpop: 'Spanish', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Spanish populations.', frequencies: { AFR: 0.05, AMR: 0.15, EAS: 0.01, EUR: 0.74, SAS: 0.02, MENA: 0.1 } },
  { markerId: 'rs9000198_Portu', rsid: 'rs9000198', gene: 'Unknown', trait: 'Portuguese Ancestry Marker', continent: 'European', subpop: 'Portuguese', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Portuguese populations.', frequencies: { AFR: 0.06, AMR: 0.15, EAS: 0.01, EUR: 0.73, SAS: 0.02, MENA: 0.1 } },
  { markerId: 'rs9000199_Portu', rsid: 'rs9000199', gene: 'Unknown', trait: 'Portuguese Ancestry Marker', continent: 'European', subpop: 'Portuguese', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Portuguese populations.', frequencies: { AFR: 0.06, AMR: 0.15, EAS: 0.01, EUR: 0.72, SAS: 0.02, MENA: 0.1 } },
  { markerId: 'rs9000200_Greek', rsid: 'rs9000200', gene: 'Unknown', trait: 'Greek Ancestry Marker', continent: 'European', subpop: 'Greek', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Greek populations.', frequencies: { AFR: 0.04, AMR: 0.05, EAS: 0.01, EUR: 0.75, SAS: 0.1, MENA: 0.2 } },
  { markerId: 'rs9000201_Greek', rsid: 'rs9000201', gene: 'Unknown', trait: 'Greek Ancestry Marker', continent: 'European', subpop: 'Greek', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Greek populations.', frequencies: { AFR: 0.04, AMR: 0.05, EAS: 0.01, EUR: 0.74, SAS: 0.1, MENA: 0.2 } },
  { markerId: 'rs9000202_Russian', rsid: 'rs9000202', gene: 'Unknown', trait: 'Russian Ancestry Marker', continent: 'European', subpop: 'Russian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Russian populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.1, EUR: 0.85, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000203_Russian', rsid: 'rs9000203', gene: 'Unknown', trait: 'Russian Ancestry Marker', continent: 'European', subpop: 'Russian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Russian populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.1, EUR: 0.84, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000204_Polish', rsid: 'rs9000204', gene: 'Unknown', trait: 'Polish Ancestry Marker', continent: 'European', subpop: 'Polish', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Polish populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.05, EUR: 0.88, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000205_Polish', rsid: 'rs9000205', gene: 'Unknown', trait: 'Polish Ancestry Marker', continent: 'European', subpop: 'Polish', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Polish populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.05, EUR: 0.87, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000206_Ukrain', rsid: 'rs9000206', gene: 'Unknown', trait: 'Ukrainian Ancestry Marker', continent: 'European', subpop: 'Ukrainian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Ukrainian populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.05, EUR: 0.86, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000207_Ukrain', rsid: 'rs9000207', gene: 'Unknown', trait: 'Ukrainian Ancestry Marker', continent: 'European', subpop: 'Ukrainian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Ukrainian populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.05, EUR: 0.85, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000208_Hungarian', rsid: 'rs9000208', gene: 'Unknown', trait: 'Hungarian Ancestry Marker', continent: 'European', subpop: 'Hungarian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Hungarian populations.', frequencies: { AFR: 0.02, AMR: 0.04, EAS: 0.03, EUR: 0.85, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000209_Hungarian', rsid: 'rs9000209', gene: 'Unknown', trait: 'Hungarian Ancestry Marker', continent: 'European', subpop: 'Hungarian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Hungarian populations.', frequencies: { AFR: 0.02, AMR: 0.04, EAS: 0.03, EUR: 0.84, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000210_Czech', rsid: 'rs9000210', gene: 'Unknown', trait: 'Czech Ancestry Marker', continent: 'European', subpop: 'Czech', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Czech populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.02, EUR: 0.9, SAS: 0.02, MENA: 0.02 } },
  { markerId: 'rs9000211_Czech', rsid: 'rs9000211', gene: 'Unknown', trait: 'Czech Ancestry Marker', continent: 'European', subpop: 'Czech', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Czech populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.02, EUR: 0.89, SAS: 0.02, MENA: 0.02 } },
  { markerId: 'rs9000212_Romanian', rsid: 'rs9000212', gene: 'Unknown', trait: 'Romanian Ancestry Marker', continent: 'European', subpop: 'Romanian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Romanian populations.', frequencies: { AFR: 0.03, AMR: 0.05, EAS: 0.02, EUR: 0.8, SAS: 0.05, MENA: 0.1 } },
  { markerId: 'rs9000213_Romanian', rsid: 'rs9000213', gene: 'Unknown', trait: 'Romanian Ancestry Marker', continent: 'European', subpop: 'Romanian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Romanian populations.', frequencies: { AFR: 0.03, AMR: 0.05, EAS: 0.02, EUR: 0.79, SAS: 0.05, MENA: 0.1 } },
  { markerId: 'rs9000214_Bulgarian', rsid: 'rs9000214', gene: 'Unknown', trait: 'Bulgarian Ancestry Marker', continent: 'European', subpop: 'Bulgarian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Bulgarian populations.', frequencies: { AFR: 0.03, AMR: 0.05, EAS: 0.02, EUR: 0.78, SAS: 0.05, MENA: 0.12 } },
  { markerId: 'rs9000215_Bulgarian', rsid: 'rs9000215', gene: 'Unknown', trait: 'Bulgarian Ancestry Marker', continent: 'European', subpop: 'Bulgarian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Bulgarian populations.', frequencies: { AFR: 0.03, AMR: 0.05, EAS: 0.02, EUR: 0.77, SAS: 0.05, MENA: 0.12 } },
  { markerId: 'rs9000216_Albanian', rsid: 'rs9000216', gene: 'Unknown', trait: 'Albanian Ancestry Marker', continent: 'European', subpop: 'Albanian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Albanian populations.', frequencies: { AFR: 0.03, AMR: 0.05, EAS: 0.01, EUR: 0.75, SAS: 0.1, MENA: 0.15 } },
  { markerId: 'rs9000217_Albanian', rsid: 'rs9000217', gene: 'Unknown', trait: 'Albanian Ancestry Marker', continent: 'European', subpop: 'Albanian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Albanian populations.', frequencies: { AFR: 0.03, AMR: 0.05, EAS: 0.01, EUR: 0.74, SAS: 0.1, MENA: 0.15 } },
  { markerId: 'rs9000218_Serbian', rsid: 'rs9000218', gene: 'Unknown', trait: 'Serbian Ancestry Marker', continent: 'European', subpop: 'Serbian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Serbian populations.', frequencies: { AFR: 0.02, AMR: 0.04, EAS: 0.02, EUR: 0.82, SAS: 0.05, MENA: 0.08 } },
  { markerId: 'rs9000219_Serbian', rsid: 'rs9000219', gene: 'Unknown', trait: 'Serbian Ancestry Marker', continent: 'European', subpop: 'Serbian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Serbian populations.', frequencies: { AFR: 0.02, AMR: 0.04, EAS: 0.02, EUR: 0.81, SAS: 0.05, MENA: 0.08 } },
  { markerId: 'rs9000220_Croatian', rsid: 'rs9000220', gene: 'Unknown', trait: 'Croatian Ancestry Marker', continent: 'European', subpop: 'Croatian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Croatian populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.02, EUR: 0.85, SAS: 0.04, MENA: 0.05 } },
  { markerId: 'rs9000221_Croatian', rsid: 'rs9000221', gene: 'Unknown', trait: 'Croatian Ancestry Marker', continent: 'European', subpop: 'Croatian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Croatian populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.02, EUR: 0.84, SAS: 0.04, MENA: 0.05 } },
  { markerId: 'rs9000222_Swiss', rsid: 'rs9000222', gene: 'Unknown', trait: 'Swiss Ancestry Marker', continent: 'European', subpop: 'Swiss', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Swiss populations.', frequencies: { AFR: 0.01, AMR: 0.04, EAS: 0.01, EUR: 0.92, SAS: 0.02, MENA: 0.02 } },
  { markerId: 'rs9000223_Austrian', rsid: 'rs9000223', gene: 'Unknown', trait: 'Austrian Ancestry Marker', continent: 'European', subpop: 'Austrian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Austrian populations.', frequencies: { AFR: 0.01, AMR: 0.04, EAS: 0.01, EUR: 0.91, SAS: 0.02, MENA: 0.02 } },
  { markerId: 'rs9000224_Slovak', rsid: 'rs9000224', gene: 'Unknown', trait: 'Slovak Ancestry Marker', continent: 'European', subpop: 'Slovak', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Slovak populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.02, EUR: 0.88, SAS: 0.03, MENA: 0.03 } },
  { markerId: 'rs9000225_Slovak', rsid: 'rs9000225', gene: 'Unknown', trait: 'Slovak Ancestry Marker', continent: 'European', subpop: 'Slovak', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Slovak populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.02, EUR: 0.87, SAS: 0.03, MENA: 0.03 } },
  { markerId: 'rs9000226_Slovenian', rsid: 'rs9000226', gene: 'Unknown', trait: 'Slovenian Ancestry Marker', continent: 'European', subpop: 'Slovenian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Slovenian populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.02, EUR: 0.86, SAS: 0.04, MENA: 0.04 } },
  { markerId: 'rs9000227_Slovenian', rsid: 'rs9000227', gene: 'Unknown', trait: 'Slovenian Ancestry Marker', continent: 'European', subpop: 'Slovenian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Slovenian populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.02, EUR: 0.85, SAS: 0.04, MENA: 0.04 } },
  { markerId: 'rs9000228_Lithuan', rsid: 'rs9000228', gene: 'Unknown', trait: 'Lithuanian Ancestry Marker', continent: 'European', subpop: 'Lithuanian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Lithuanian populations.', frequencies: { AFR: 0, AMR: 0.02, EAS: 0.05, EUR: 0.9, SAS: 0.01, MENA: 0.02 } },
  { markerId: 'rs9000229_Lithuan', rsid: 'rs9000229', gene: 'Unknown', trait: 'Lithuanian Ancestry Marker', continent: 'European', subpop: 'Lithuanian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Lithuanian populations.', frequencies: { AFR: 0, AMR: 0.02, EAS: 0.05, EUR: 0.89, SAS: 0.01, MENA: 0.02 } },
  { markerId: 'rs9000230_Latvian', rsid: 'rs9000230', gene: 'Unknown', trait: 'Latvian Ancestry Marker', continent: 'European', subpop: 'Latvian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Latvian populations.', frequencies: { AFR: 0, AMR: 0.02, EAS: 0.05, EUR: 0.88, SAS: 0.01, MENA: 0.02 } },
  { markerId: 'rs9000231_Latvian', rsid: 'rs9000231', gene: 'Unknown', trait: 'Latvian Ancestry Marker', continent: 'European', subpop: 'Latvian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Latvian populations.', frequencies: { AFR: 0, AMR: 0.02, EAS: 0.05, EUR: 0.87, SAS: 0.01, MENA: 0.02 } },
  { markerId: 'rs9000232_Estonian', rsid: 'rs9000232', gene: 'Unknown', trait: 'Estonian Ancestry Marker', continent: 'European', subpop: 'Estonian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Estonian populations.', frequencies: { AFR: 0, AMR: 0.02, EAS: 0.06, EUR: 0.87, SAS: 0.01, MENA: 0.02 } },
  { markerId: 'rs9000233_Estonian', rsid: 'rs9000233', gene: 'Unknown', trait: 'Estonian Ancestry Marker', continent: 'European', subpop: 'Estonian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Estonian populations.', frequencies: { AFR: 0, AMR: 0.02, EAS: 0.06, EUR: 0.86, SAS: 0.01, MENA: 0.02 } },
  { markerId: 'rs9000234_Maltese', rsid: 'rs9000234', gene: 'Unknown', trait: 'Maltese Ancestry Marker', continent: 'European', subpop: 'Maltese', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Maltese populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.01, EUR: 0.65, SAS: 0.05, MENA: 0.25 } },
  { markerId: 'rs9000235_Maltese', rsid: 'rs9000235', gene: 'Unknown', trait: 'Maltese Ancestry Marker', continent: 'European', subpop: 'Maltese', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Maltese populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.01, EUR: 0.64, SAS: 0.05, MENA: 0.25 } },
  { markerId: 'rs9000236_Cypriot', rsid: 'rs9000236', gene: 'Unknown', trait: 'Cypriot Ancestry Marker', continent: 'European', subpop: 'Cypriot', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Cypriot populations.', frequencies: { AFR: 0.04, AMR: 0.04, EAS: 0.01, EUR: 0.6, SAS: 0.1, MENA: 0.3 } },
  { markerId: 'rs9000237_Cypriot', rsid: 'rs9000237', gene: 'Unknown', trait: 'Cypriot Ancestry Marker', continent: 'European', subpop: 'Cypriot', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Cypriot populations.', frequencies: { AFR: 0.04, AMR: 0.04, EAS: 0.01, EUR: 0.59, SAS: 0.1, MENA: 0.3 } },
  { markerId: 'rs9000238_Icelandic', rsid: 'rs9000238', gene: 'Unknown', trait: 'Icelandic Ancestry Marker', continent: 'European', subpop: 'Icelandic', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Icelandic populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.01, EUR: 0.97, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000239_Icelandic', rsid: 'rs9000239', gene: 'Unknown', trait: 'Icelandic Ancestry Marker', continent: 'European', subpop: 'Icelandic', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Icelandic populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.01, EUR: 0.96, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000240_Basque', rsid: 'rs9000240', gene: 'Unknown', trait: 'Basque Ancestry Marker', continent: 'European', subpop: 'Basque', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Basque populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0.01, EUR: 0.92, SAS: 0.01, MENA: 0.05 } },
  { markerId: 'rs9000241_Basque', rsid: 'rs9000241', gene: 'Unknown', trait: 'Basque Ancestry Marker', continent: 'European', subpop: 'Basque', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Basque populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0.01, EUR: 0.91, SAS: 0.01, MENA: 0.05 } },
  { markerId: 'rs9000242_Sami', rsid: 'rs9000242', gene: 'Unknown', trait: 'Sami Ancestry Marker', continent: 'European', subpop: 'Sami', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sami populations.', frequencies: { AFR: 0, AMR: 0.02, EAS: 0.15, EUR: 0.8, SAS: 0.01, MENA: 0.02 } },
  { markerId: 'rs9000243_Sami', rsid: 'rs9000243', gene: 'Unknown', trait: 'Sami Ancestry Marker', continent: 'European', subpop: 'Sami', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sami populations.', frequencies: { AFR: 0, AMR: 0.02, EAS: 0.15, EUR: 0.79, SAS: 0.01, MENA: 0.02 } },
  { markerId: 'rs9000244_Roma', rsid: 'rs9000244', gene: 'Unknown', trait: 'Roma Ancestry Marker', continent: 'European', subpop: 'Roma', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Roma populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.5, SAS: 0.3, MENA: 0.05 } },
  { markerId: 'rs9000245_Roma', rsid: 'rs9000245', gene: 'Unknown', trait: 'Roma Ancestry Marker', continent: 'European', subpop: 'Roma', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Roma populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.05, EUR: 0.49, SAS: 0.3, MENA: 0.05 } },
  { markerId: 'rs9000246_Ashkenazi', rsid: 'rs9000246', gene: 'Unknown', trait: 'Ashkenazi Ancestry Marker', continent: 'European', subpop: 'Ashkenazi', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Ashkenazi populations.', frequencies: { AFR: 0.02, AMR: 0.02, EAS: 0.01, EUR: 0.65, SAS: 0.05, MENA: 0.25 } },
  { markerId: 'rs9000247_Ashkenazi', rsid: 'rs9000247', gene: 'Unknown', trait: 'Ashkenazi Ancestry Marker', continent: 'European', subpop: 'Ashkenazi', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Ashkenazi populations.', frequencies: { AFR: 0.02, AMR: 0.02, EAS: 0.01, EUR: 0.64, SAS: 0.05, MENA: 0.25 } },
  { markerId: 'rs9000248_Sephardic', rsid: 'rs9000248', gene: 'Unknown', trait: 'Sephardic Ancestry Marker', continent: 'European', subpop: 'Sephardic', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sephardic populations.', frequencies: { AFR: 0.04, AMR: 0.05, EAS: 0.01, EUR: 0.6, SAS: 0.05, MENA: 0.25 } },
  { markerId: 'rs9000249_Sephardic', rsid: 'rs9000249', gene: 'Unknown', trait: 'Sephardic Ancestry Marker', continent: 'European', subpop: 'Sephardic', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sephardic populations.', frequencies: { AFR: 0.04, AMR: 0.05, EAS: 0.01, EUR: 0.59, SAS: 0.05, MENA: 0.25 } },
  { markerId: 'rs9000250_NW_Euro', rsid: 'rs9000250', gene: 'Unknown', trait: 'Northwestern European Ancestry Marker', continent: 'European', subpop: 'Northwestern European', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northwestern European populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.01, EUR: 0.95, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000251_NW_Euro', rsid: 'rs9000251', gene: 'Unknown', trait: 'Northwestern European Ancestry Marker', continent: 'European', subpop: 'Northwestern European', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northwestern European populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.01, EUR: 0.94, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000252_S_Euro', rsid: 'rs9000252', gene: 'Unknown', trait: 'Southern European Ancestry Marker', continent: 'European', subpop: 'Southern European', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Southern European populations.', frequencies: { AFR: 0.05, AMR: 0.08, EAS: 0.01, EUR: 0.75, SAS: 0.05, MENA: 0.15 } },
  { markerId: 'rs9000253_S_Euro', rsid: 'rs9000253', gene: 'Unknown', trait: 'Southern European Ancestry Marker', continent: 'European', subpop: 'Southern European', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Southern European populations.', frequencies: { AFR: 0.05, AMR: 0.08, EAS: 0.01, EUR: 0.74, SAS: 0.05, MENA: 0.15 } },
  { markerId: 'rs9000254_E_Euro', rsid: 'rs9000254', gene: 'Unknown', trait: 'Eastern European Ancestry Marker', continent: 'European', subpop: 'Eastern European', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Eastern European populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.08, EUR: 0.85, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000255_E_Euro', rsid: 'rs9000255', gene: 'Unknown', trait: 'Eastern European Ancestry Marker', continent: 'European', subpop: 'Eastern European', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Eastern European populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.08, EUR: 0.84, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000256_Balkans', rsid: 'rs9000256', gene: 'Unknown', trait: 'Balkans Ancestry Marker', continent: 'European', subpop: 'Balkans', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Balkans populations.', frequencies: { AFR: 0.03, AMR: 0.05, EAS: 0.02, EUR: 0.78, SAS: 0.05, MENA: 0.1 } },
  { markerId: 'rs9000257_Balkans', rsid: 'rs9000257', gene: 'Unknown', trait: 'Balkans Ancestry Marker', continent: 'European', subpop: 'Balkans', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Balkans populations.', frequencies: { AFR: 0.03, AMR: 0.05, EAS: 0.02, EUR: 0.77, SAS: 0.05, MENA: 0.1 } },
  { markerId: 'rs9000258_Iberian', rsid: 'rs9000258', gene: 'Unknown', trait: 'Iberian Ancestry Marker', continent: 'European', subpop: 'Iberian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Iberian populations.', frequencies: { AFR: 0.06, AMR: 0.15, EAS: 0.01, EUR: 0.72, SAS: 0.02, MENA: 0.1 } },
  { markerId: 'rs9000259_Iberian', rsid: 'rs9000259', gene: 'Unknown', trait: 'Iberian Ancestry Marker', continent: 'European', subpop: 'Iberian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Iberian populations.', frequencies: { AFR: 0.06, AMR: 0.15, EAS: 0.01, EUR: 0.71, SAS: 0.02, MENA: 0.1 } },
  { markerId: 'rs9000260_BritIsles', rsid: 'rs9000260', gene: 'Unknown', trait: 'British Isles Ancestry Marker', continent: 'European', subpop: 'British Isles', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for British Isles populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.01, EUR: 0.96, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000261_BritIsles', rsid: 'rs9000261', gene: 'Unknown', trait: 'British Isles Ancestry Marker', continent: 'European', subpop: 'British Isles', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for British Isles populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.01, EUR: 0.95, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000262_Scand', rsid: 'rs9000262', gene: 'Unknown', trait: 'Scandinavian Ancestry Marker', continent: 'European', subpop: 'Scandinavian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Scandinavian populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.02, EUR: 0.96, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000263_Scand', rsid: 'rs9000263', gene: 'Unknown', trait: 'Scandinavian Ancestry Marker', continent: 'European', subpop: 'Scandinavian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Scandinavian populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.02, EUR: 0.95, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000264_W_Euro', rsid: 'rs9000264', gene: 'Unknown', trait: 'Western European Ancestry Marker', continent: 'European', subpop: 'Western European', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Western European populations.', frequencies: { AFR: 0.01, AMR: 0.04, EAS: 0.01, EUR: 0.92, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000265_W_Euro', rsid: 'rs9000265', gene: 'Unknown', trait: 'Western European Ancestry Marker', continent: 'European', subpop: 'Western European', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Western European populations.', frequencies: { AFR: 0.01, AMR: 0.04, EAS: 0.01, EUR: 0.91, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000266_C_Euro', rsid: 'rs9000266', gene: 'Unknown', trait: 'Central European Ancestry Marker', continent: 'European', subpop: 'Central European', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Central European populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.02, EUR: 0.9, SAS: 0.02, MENA: 0.02 } },
  { markerId: 'rs9000267_C_Euro', rsid: 'rs9000267', gene: 'Unknown', trait: 'Central European Ancestry Marker', continent: 'European', subpop: 'Central European', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Central European populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.02, EUR: 0.89, SAS: 0.02, MENA: 0.02 } },
  { markerId: 'rs9000268_N_Euro', rsid: 'rs9000268', gene: 'Unknown', trait: 'Northern European Ancestry Marker', continent: 'European', subpop: 'Northern European', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northern European populations.', frequencies: { AFR: 0, AMR: 0.02, EAS: 0.02, EUR: 0.95, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000269_N_Euro', rsid: 'rs9000269', gene: 'Unknown', trait: 'Northern European Ancestry Marker', continent: 'European', subpop: 'Northern European', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northern European populations.', frequencies: { AFR: 0, AMR: 0.02, EAS: 0.02, EUR: 0.94, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000270_SW_Euro', rsid: 'rs9000270', gene: 'Unknown', trait: 'Southwestern European Ancestry Marker', continent: 'European', subpop: 'Southwestern European', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Southwestern European populations.', frequencies: { AFR: 0.06, AMR: 0.1, EAS: 0.01, EUR: 0.75, SAS: 0.02, MENA: 0.06 } },
  { markerId: 'rs9000271_SW_Euro', rsid: 'rs9000271', gene: 'Unknown', trait: 'Southwestern European Ancestry Marker', continent: 'European', subpop: 'Southwestern European', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Southwestern European populations.', frequencies: { AFR: 0.06, AMR: 0.1, EAS: 0.01, EUR: 0.74, SAS: 0.02, MENA: 0.06 } },
  { markerId: 'rs9000272_SE_Euro', rsid: 'rs9000272', gene: 'Unknown', trait: 'Southeastern European Ancestry Marker', continent: 'European', subpop: 'Southeastern European', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Southeastern European populations.', frequencies: { AFR: 0.03, AMR: 0.05, EAS: 0.02, EUR: 0.75, SAS: 0.05, MENA: 0.1 } },
  { markerId: 'rs9000273_SE_Euro', rsid: 'rs9000273', gene: 'Unknown', trait: 'Southeastern European Ancestry Marker', continent: 'European', subpop: 'Southeastern European', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Southeastern European populations.', frequencies: { AFR: 0.03, AMR: 0.05, EAS: 0.02, EUR: 0.74, SAS: 0.05, MENA: 0.1 } },
  { markerId: 'rs9000274_NE_Euro', rsid: 'rs9000274', gene: 'Unknown', trait: 'Northeastern European Ancestry Marker', continent: 'European', subpop: 'Northeastern European', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northeastern European populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.1, EUR: 0.85, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000275_NE_Euro', rsid: 'rs9000275', gene: 'Unknown', trait: 'Northeastern European Ancestry Marker', continent: 'European', subpop: 'Northeastern European', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northeastern European populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.1, EUR: 0.84, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000276_British', rsid: 'rs9000276', gene: 'Unknown', trait: 'British Ancestry Marker', continent: 'European', subpop: 'British', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for British populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.01, EUR: 0.94, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000277_British', rsid: 'rs9000277', gene: 'Unknown', trait: 'British Ancestry Marker', continent: 'European', subpop: 'British', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for British populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.01, EUR: 0.93, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000278_Irish', rsid: 'rs9000278', gene: 'Unknown', trait: 'Irish Ancestry Marker', continent: 'European', subpop: 'Irish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Irish populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.95, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000279_Irish', rsid: 'rs9000279', gene: 'Unknown', trait: 'Irish Ancestry Marker', continent: 'European', subpop: 'Irish', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Irish populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.94, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000280_Germanic', rsid: 'rs9000280', gene: 'Unknown', trait: 'Germanic Ancestry Marker', continent: 'European', subpop: 'Germanic', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Germanic populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.01, EUR: 0.93, SAS: 0.02, MENA: 0.02 } },
  { markerId: 'rs9000281_Germanic', rsid: 'rs9000281', gene: 'Unknown', trait: 'Germanic Ancestry Marker', continent: 'European', subpop: 'Germanic', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Germanic populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.01, EUR: 0.92, SAS: 0.02, MENA: 0.02 } },
  { markerId: 'rs9000282_Slavic', rsid: 'rs9000282', gene: 'Unknown', trait: 'Slavic Ancestry Marker', continent: 'European', subpop: 'Slavic', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Slavic populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.08, EUR: 0.87, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000283_Slavic', rsid: 'rs9000283', gene: 'Unknown', trait: 'Slavic Ancestry Marker', continent: 'European', subpop: 'Slavic', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Slavic populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.08, EUR: 0.86, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000284_Celtic', rsid: 'rs9000284', gene: 'Unknown', trait: 'Celtic Ancestry Marker', continent: 'European', subpop: 'Celtic', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Celtic populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.01, EUR: 0.94, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000285_Celtic', rsid: 'rs9000285', gene: 'Unknown', trait: 'Celtic Ancestry Marker', continent: 'European', subpop: 'Celtic', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Celtic populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.01, EUR: 0.93, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000286_AngloSaxon', rsid: 'rs9000286', gene: 'Unknown', trait: 'Anglo-Saxon Ancestry Marker', continent: 'European', subpop: 'Anglo-Saxon', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Anglo-Saxon populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.95, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000287_AngloSaxon', rsid: 'rs9000287', gene: 'Unknown', trait: 'Anglo-Saxon Ancestry Marker', continent: 'European', subpop: 'Anglo-Saxon', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Anglo-Saxon populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.94, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000288_Mediterranean', rsid: 'rs9000288', gene: 'Unknown', trait: 'Mediterranean Ancestry Marker', continent: 'European', subpop: 'Mediterranean', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Mediterranean populations.', frequencies: { AFR: 0.08, AMR: 0.05, EAS: 0.01, EUR: 0.65, SAS: 0.05, MENA: 0.25 } },
  { markerId: 'rs9000289_Mediterranean', rsid: 'rs9000289', gene: 'Unknown', trait: 'Mediterranean Ancestry Marker', continent: 'European', subpop: 'Mediterranean', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Mediterranean populations.', frequencies: { AFR: 0.08, AMR: 0.05, EAS: 0.01, EUR: 0.64, SAS: 0.05, MENA: 0.25 } },
  { markerId: 'rs9000290_Alpine', rsid: 'rs9000290', gene: 'Unknown', trait: 'Alpine Ancestry Marker', continent: 'European', subpop: 'Alpine', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Alpine populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.01, EUR: 0.92, SAS: 0.02, MENA: 0.02 } },
  { markerId: 'rs9000291_Alpine', rsid: 'rs9000291', gene: 'Unknown', trait: 'Alpine Ancestry Marker', continent: 'European', subpop: 'Alpine', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Alpine populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.01, EUR: 0.91, SAS: 0.02, MENA: 0.02 } },
  { markerId: 'rs9000292_Dinaric', rsid: 'rs9000292', gene: 'Unknown', trait: 'Dinaric Ancestry Marker', continent: 'European', subpop: 'Dinaric', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Dinaric populations.', frequencies: { AFR: 0.02, AMR: 0.03, EAS: 0.01, EUR: 0.85, SAS: 0.03, MENA: 0.08 } },
  { markerId: 'rs9000293_Dinaric', rsid: 'rs9000293', gene: 'Unknown', trait: 'Dinaric Ancestry Marker', continent: 'European', subpop: 'Dinaric', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Dinaric populations.', frequencies: { AFR: 0.02, AMR: 0.03, EAS: 0.01, EUR: 0.84, SAS: 0.03, MENA: 0.08 } },
  { markerId: 'rs9000294_Baltic', rsid: 'rs9000294', gene: 'Unknown', trait: 'Baltic Ancestry Marker', continent: 'European', subpop: 'Baltic', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Baltic populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.05, EUR: 0.92, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000295_Baltic', rsid: 'rs9000295', gene: 'Unknown', trait: 'Baltic Ancestry Marker', continent: 'European', subpop: 'Baltic', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Baltic populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.05, EUR: 0.91, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000296_FinnoUgric', rsid: 'rs9000296', gene: 'Unknown', trait: 'Finno-Ugric Ancestry Marker', continent: 'European', subpop: 'Finno-Ugric', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Finno-Ugric populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.15, EUR: 0.8, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000297_FinnoUgric', rsid: 'rs9000297', gene: 'Unknown', trait: 'Finno-Ugric Ancestry Marker', continent: 'European', subpop: 'Finno-Ugric', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Finno-Ugric populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.15, EUR: 0.79, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000298_Uralic', rsid: 'rs9000298', gene: 'Unknown', trait: 'Uralic Ancestry Marker', continent: 'European', subpop: 'Uralic', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Uralic populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.2, EUR: 0.75, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000299_Uralic', rsid: 'rs9000299', gene: 'Unknown', trait: 'Uralic Ancestry Marker', continent: 'European', subpop: 'Uralic', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Uralic populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.2, EUR: 0.74, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000300_Caucasian', rsid: 'rs9000300', gene: 'Unknown', trait: 'Caucasian (Caucasus) Ancestry Marker', continent: 'European', subpop: 'Caucasian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Caucasus populations.', frequencies: { AFR: 0.02, AMR: 0.02, EAS: 0.02, EUR: 0.6, SAS: 0.1, MENA: 0.3 } },
  { markerId: 'rs9000301_Caucasian', rsid: 'rs9000301', gene: 'Unknown', trait: 'Caucasian (Caucasus) Ancestry Marker', continent: 'European', subpop: 'Caucasian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Caucasus populations.', frequencies: { AFR: 0.02, AMR: 0.02, EAS: 0.02, EUR: 0.59, SAS: 0.1, MENA: 0.3 } },
  { markerId: 'rs9000302_Anatolian', rsid: 'rs9000302', gene: 'Unknown', trait: 'Anatolian Ancestry Marker', continent: 'European', subpop: 'Anatolian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Anatolian populations.', frequencies: { AFR: 0.05, AMR: 0.03, EAS: 0.02, EUR: 0.5, SAS: 0.05, MENA: 0.4 } },
  { markerId: 'rs9000303_Anatolian', rsid: 'rs9000303', gene: 'Unknown', trait: 'Anatolian Ancestry Marker', continent: 'European', subpop: 'Anatolian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Anatolian populations.', frequencies: { AFR: 0.05, AMR: 0.03, EAS: 0.02, EUR: 0.49, SAS: 0.05, MENA: 0.4 } },
  { markerId: 'rs9000304_Sardinian', rsid: 'rs9000304', gene: 'Unknown', trait: 'Sardinian Ancestry Marker', continent: 'European', subpop: 'Sardinian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sardinian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.85, SAS: 0.01, MENA: 0.05 } },
  { markerId: 'rs9000305_Sardinian', rsid: 'rs9000305', gene: 'Unknown', trait: 'Sardinian Ancestry Marker', continent: 'European', subpop: 'Sardinian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sardinian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.84, SAS: 0.01, MENA: 0.05 } },
  { markerId: 'rs9000306_Sicilian', rsid: 'rs9000306', gene: 'Unknown', trait: 'Sicilian Ancestry Marker', continent: 'European', subpop: 'Sicilian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sicilian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.01, EUR: 0.7, SAS: 0.02, MENA: 0.2 } },
  { markerId: 'rs9000307_Sicilian', rsid: 'rs9000307', gene: 'Unknown', trait: 'Sicilian Ancestry Marker', continent: 'European', subpop: 'Sicilian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sicilian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.01, EUR: 0.69, SAS: 0.02, MENA: 0.2 } },
  { markerId: 'rs9000308_Corsican', rsid: 'rs9000308', gene: 'Unknown', trait: 'Corsican Ancestry Marker', continent: 'European', subpop: 'Corsican', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Corsican populations.', frequencies: { AFR: 0.02, AMR: 0.02, EAS: 0.01, EUR: 0.8, SAS: 0.01, MENA: 0.1 } },
  { markerId: 'rs9000309_Corsican', rsid: 'rs9000309', gene: 'Unknown', trait: 'Corsican Ancestry Marker', continent: 'European', subpop: 'Corsican', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Corsican populations.', frequencies: { AFR: 0.02, AMR: 0.02, EAS: 0.01, EUR: 0.79, SAS: 0.01, MENA: 0.1 } },
  { markerId: 'rs9000310_Breton', rsid: 'rs9000310', gene: 'Unknown', trait: 'Breton Ancestry Marker', continent: 'European', subpop: 'Breton', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Breton populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.95, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000311_Breton', rsid: 'rs9000311', gene: 'Unknown', trait: 'Breton Ancestry Marker', continent: 'European', subpop: 'Breton', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Breton populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.94, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000312_Cornish', rsid: 'rs9000312', gene: 'Unknown', trait: 'Cornish Ancestry Marker', continent: 'European', subpop: 'Cornish', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Cornish populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.96, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000313_Cornish', rsid: 'rs9000313', gene: 'Unknown', trait: 'Cornish Ancestry Marker', continent: 'European', subpop: 'Cornish', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Cornish populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.95, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000314_Manx', rsid: 'rs9000314', gene: 'Unknown', trait: 'Manx Ancestry Marker', continent: 'European', subpop: 'Manx', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Manx populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.97, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000315_Manx', rsid: 'rs9000315', gene: 'Unknown', trait: 'Manx Ancestry Marker', continent: 'European', subpop: 'Manx', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Manx populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.96, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000316_Frisian', rsid: 'rs9000316', gene: 'Unknown', trait: 'Frisian Ancestry Marker', continent: 'European', subpop: 'Frisian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Frisian populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.96, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000317_Frisian', rsid: 'rs9000317', gene: 'Unknown', trait: 'Frisian Ancestry Marker', continent: 'European', subpop: 'Frisian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Frisian populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.95, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000318_Sorbian', rsid: 'rs9000318', gene: 'Unknown', trait: 'Sorbian Ancestry Marker', continent: 'European', subpop: 'Sorbian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sorbian populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.05, EUR: 0.9, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000319_Sorbian', rsid: 'rs9000319', gene: 'Unknown', trait: 'Sorbian Ancestry Marker', continent: 'European', subpop: 'Sorbian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sorbian populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.05, EUR: 0.89, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000320_Kashubian', rsid: 'rs9000320', gene: 'Unknown', trait: 'Kashubian Ancestry Marker', continent: 'European', subpop: 'Kashubian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Kashubian populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.05, EUR: 0.91, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000321_Kashubian', rsid: 'rs9000321', gene: 'Unknown', trait: 'Kashubian Ancestry Marker', continent: 'European', subpop: 'Kashubian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Kashubian populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.05, EUR: 0.9, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000322_Vlach', rsid: 'rs9000322', gene: 'Unknown', trait: 'Vlach Ancestry Marker', continent: 'European', subpop: 'Vlach', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Vlach populations.', frequencies: { AFR: 0.02, AMR: 0.03, EAS: 0.02, EUR: 0.8, SAS: 0.03, MENA: 0.08 } },
  { markerId: 'rs9000323_Vlach', rsid: 'rs9000323', gene: 'Unknown', trait: 'Vlach Ancestry Marker', continent: 'European', subpop: 'Vlach', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Vlach populations.', frequencies: { AFR: 0.02, AMR: 0.03, EAS: 0.02, EUR: 0.79, SAS: 0.03, MENA: 0.08 } },
  { markerId: 'rs9000324_Aromanian', rsid: 'rs9000324', gene: 'Unknown', trait: 'Aromanian Ancestry Marker', continent: 'European', subpop: 'Aromanian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Aromanian populations.', frequencies: { AFR: 0.02, AMR: 0.02, EAS: 0.01, EUR: 0.82, SAS: 0.02, MENA: 0.1 } },
  { markerId: 'rs9000325_Aromanian', rsid: 'rs9000325', gene: 'Unknown', trait: 'Aromanian Ancestry Marker', continent: 'European', subpop: 'Aromanian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Aromanian populations.', frequencies: { AFR: 0.02, AMR: 0.02, EAS: 0.01, EUR: 0.81, SAS: 0.02, MENA: 0.1 } },
  { markerId: 'rs9000326_Szekely', rsid: 'rs9000326', gene: 'Unknown', trait: 'Szekely Ancestry Marker', continent: 'European', subpop: 'Szekely', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Szekely populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.05, EUR: 0.88, SAS: 0.01, MENA: 0.02 } },
  { markerId: 'rs9000327_Szekely', rsid: 'rs9000327', gene: 'Unknown', trait: 'Szekely Ancestry Marker', continent: 'European', subpop: 'Szekely', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Szekely populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.05, EUR: 0.87, SAS: 0.01, MENA: 0.02 } },
  { markerId: 'rs9000328_Csango', rsid: 'rs9000328', gene: 'Unknown', trait: 'Csango Ancestry Marker', continent: 'European', subpop: 'Csango', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Csango populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.04, EUR: 0.89, SAS: 0.01, MENA: 0.02 } },
  { markerId: 'rs9000329_Csango', rsid: 'rs9000329', gene: 'Unknown', trait: 'Csango Ancestry Marker', continent: 'European', subpop: 'Csango', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Csango populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.04, EUR: 0.88, SAS: 0.01, MENA: 0.02 } },
  { markerId: 'rs9000330_Rusyn', rsid: 'rs9000330', gene: 'Unknown', trait: 'Rusyn Ancestry Marker', continent: 'European', subpop: 'Rusyn', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Rusyn populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.06, EUR: 0.88, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000331_Rusyn', rsid: 'rs9000331', gene: 'Unknown', trait: 'Rusyn Ancestry Marker', continent: 'European', subpop: 'Rusyn', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Rusyn populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.06, EUR: 0.87, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000332_Lemko', rsid: 'rs9000332', gene: 'Unknown', trait: 'Lemko Ancestry Marker', continent: 'European', subpop: 'Lemko', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Lemko populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.05, EUR: 0.89, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000333_Lemko', rsid: 'rs9000333', gene: 'Unknown', trait: 'Lemko Ancestry Marker', continent: 'European', subpop: 'Lemko', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Lemko populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.05, EUR: 0.88, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000334_Boyko', rsid: 'rs9000334', gene: 'Unknown', trait: 'Boyko Ancestry Marker', continent: 'European', subpop: 'Boyko', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Boyko populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.05, EUR: 0.9, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000335_Boyko', rsid: 'rs9000335', gene: 'Unknown', trait: 'Boyko Ancestry Marker', continent: 'European', subpop: 'Boyko', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Boyko populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.05, EUR: 0.89, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000336_Hutsul', rsid: 'rs9000336', gene: 'Unknown', trait: 'Hutsul Ancestry Marker', continent: 'European', subpop: 'Hutsul', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Hutsul populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.06, EUR: 0.88, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000337_Hutsul', rsid: 'rs9000337', gene: 'Unknown', trait: 'Hutsul Ancestry Marker', continent: 'European', subpop: 'Hutsul', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Hutsul populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.06, EUR: 0.87, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000338_Lipovan', rsid: 'rs9000338', gene: 'Unknown', trait: 'Lipovan Ancestry Marker', continent: 'European', subpop: 'Lipovan', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Lipovan populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.08, EUR: 0.85, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000339_Lipovan', rsid: 'rs9000339', gene: 'Unknown', trait: 'Lipovan Ancestry Marker', continent: 'European', subpop: 'Lipovan', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Lipovan populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.08, EUR: 0.84, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000340_Gagauz', rsid: 'rs9000340', gene: 'Unknown', trait: 'Gagauz Ancestry Marker', continent: 'European', subpop: 'Gagauz', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Gagauz populations.', frequencies: { AFR: 0.02, AMR: 0.02, EAS: 0.1, EUR: 0.7, SAS: 0.05, MENA: 0.1 } },
  { markerId: 'rs9000341_Gagauz', rsid: 'rs9000341', gene: 'Unknown', trait: 'Gagauz Ancestry Marker', continent: 'European', subpop: 'Gagauz', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Gagauz populations.', frequencies: { AFR: 0.02, AMR: 0.02, EAS: 0.1, EUR: 0.69, SAS: 0.05, MENA: 0.1 } },
  { markerId: 'rs9000342_Tatar', rsid: 'rs9000342', gene: 'Unknown', trait: 'Tatar Ancestry Marker', continent: 'European', subpop: 'Tatar', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Tatar populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.25, EUR: 0.6, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs9000343_Tatar', rsid: 'rs9000343', gene: 'Unknown', trait: 'Tatar Ancestry Marker', continent: 'European', subpop: 'Tatar', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Tatar populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.25, EUR: 0.59, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs10456201_Polynesian', rsid: 'rs10456201', gene: 'Unknown', trait: 'Polynesian Ancestry Marker', continent: 'Oceanian', subpop: 'Polynesian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Polynesian populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.85, EUR: 0.02, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456202_Samoan', rsid: 'rs10456202', gene: 'Unknown', trait: 'Samoan Ancestry Marker', continent: 'Oceanian', subpop: 'Samoan', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Samoan populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.88, EUR: 0.02, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs11103374_Polynesian', rsid: 'rs11103374', gene: 'Unknown', trait: 'Polynesian Ancestry Marker', continent: 'Oceanian', subpop: 'Polynesian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Polynesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.9, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs11103375_Micronesian', rsid: 'rs11103375', gene: 'Unknown', trait: 'Micronesian Ancestry Marker', continent: 'Oceanian', subpop: 'Micronesian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Micronesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.85, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs11103377_Hawaiian', rsid: 'rs11103377', gene: 'Unknown', trait: 'Hawaiian Ancestry Marker', continent: 'Oceanian', subpop: 'Hawaiian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Hawaiian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.88, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs11103378_Polynesian', rsid: 'rs11103378', gene: 'Unknown', trait: 'Polynesian Ancestry Marker', continent: 'Oceanian', subpop: 'Polynesian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Polynesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.91, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs11103379_Micronesian', rsid: 'rs11103379', gene: 'Unknown', trait: 'Micronesian Ancestry Marker', continent: 'Oceanian', subpop: 'Micronesian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Micronesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.86, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs11103381_Hawaiian', rsid: 'rs11103381', gene: 'Unknown', trait: 'Hawaiian Ancestry Marker', continent: 'Oceanian', subpop: 'Hawaiian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Hawaiian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.89, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs11103382_Polynesian', rsid: 'rs11103382', gene: 'Unknown', trait: 'Polynesian Ancestry Marker', continent: 'Oceanian', subpop: 'Polynesian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Polynesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.92, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs11103383_Micronesian', rsid: 'rs11103383', gene: 'Unknown', trait: 'Micronesian Ancestry Marker', continent: 'Oceanian', subpop: 'Micronesian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Micronesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.87, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs11103385_Hawaiian', rsid: 'rs11103385', gene: 'Unknown', trait: 'Hawaiian Ancestry Marker', continent: 'Oceanian', subpop: 'Hawaiian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Hawaiian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.9, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000001_Polynesian', rsid: 'rs9000001', gene: 'Unknown', trait: 'Polynesian Ancestry Marker', continent: 'Oceanian', subpop: 'Polynesian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Polynesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.85, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000002_Polynesian', rsid: 'rs9000002', gene: 'Unknown', trait: 'Polynesian Ancestry Marker', continent: 'Oceanian', subpop: 'Polynesian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Polynesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.88, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000003_Polynesian', rsid: 'rs9000003', gene: 'Unknown', trait: 'Polynesian Ancestry Marker', continent: 'Oceanian', subpop: 'Polynesian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Polynesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.9, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000004_Melanesian', rsid: 'rs9000004', gene: 'Unknown', trait: 'Melanesian Ancestry Marker', continent: 'Oceanian', subpop: 'Melanesian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Melanesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.85, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000005_Melanesian', rsid: 'rs9000005', gene: 'Unknown', trait: 'Melanesian Ancestry Marker', continent: 'Oceanian', subpop: 'Melanesian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Melanesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.88, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000006_Melanesian', rsid: 'rs9000006', gene: 'Unknown', trait: 'Melanesian Ancestry Marker', continent: 'Oceanian', subpop: 'Melanesian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Melanesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.91, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000007_Micronesian', rsid: 'rs9000007', gene: 'Unknown', trait: 'Micronesian Ancestry Marker', continent: 'Oceanian', subpop: 'Micronesian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Micronesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.86, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000008_Micronesian', rsid: 'rs9000008', gene: 'Unknown', trait: 'Micronesian Ancestry Marker', continent: 'Oceanian', subpop: 'Micronesian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Micronesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.89, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000009_Micronesian', rsid: 'rs9000009', gene: 'Unknown', trait: 'Micronesian Ancestry Marker', continent: 'Oceanian', subpop: 'Micronesian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Micronesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.92, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000010_Melanesian', rsid: 'rs9000010', gene: 'Unknown', trait: 'Melanesian Ancestry Marker', continent: 'Oceanian', subpop: 'Melanesian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Melanesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.85, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000011_Melanesian', rsid: 'rs9000011', gene: 'Unknown', trait: 'Melanesian Ancestry Marker', continent: 'Oceanian', subpop: 'Melanesian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Melanesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.88, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000296_Maori', rsid: 'rs9000296', gene: 'Unknown', trait: 'Maori Ancestry Marker', continent: 'Oceanian', subpop: 'Maori', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Maori populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.8, EUR: 0.02, SAS: 0.01, MENA: 0.01, OCE: 0.13 } },
  { markerId: 'rs9000297_Maori', rsid: 'rs9000297', gene: 'Unknown', trait: 'Maori Ancestry Marker', continent: 'Oceanian', subpop: 'Maori', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Maori populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.78, EUR: 0.02, SAS: 0.01, MENA: 0.01, OCE: 0.15 } },
  { markerId: 'rs9000298_Fijian', rsid: 'rs9000298', gene: 'Unknown', trait: 'Fijian Ancestry Marker', continent: 'Oceanian', subpop: 'Fijian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Fijian populations.', frequencies: { AFR: 0.02, AMR: 0.01, EAS: 0.6, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.34 } },
  { markerId: 'rs9000299_Fijian', rsid: 'rs9000299', gene: 'Unknown', trait: 'Fijian Ancestry Marker', continent: 'Oceanian', subpop: 'Fijian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Fijian populations.', frequencies: { AFR: 0.02, AMR: 0.01, EAS: 0.58, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.36 } },
  { markerId: 'rs9000300_Tongan', rsid: 'rs9000300', gene: 'Unknown', trait: 'Tongan Ancestry Marker', continent: 'Oceanian', subpop: 'Tongan', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Tongan populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.85, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.1 } },
  { markerId: 'rs9000301_Tongan', rsid: 'rs9000301', gene: 'Unknown', trait: 'Tongan Ancestry Marker', continent: 'Oceanian', subpop: 'Tongan', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Tongan populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.82, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.13 } },
  { markerId: 'rs9000302_Tahitian', rsid: 'rs9000302', gene: 'Unknown', trait: 'Tahitian Ancestry Marker', continent: 'Oceanian', subpop: 'Tahitian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Tahitian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.88, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.07 } },
  { markerId: 'rs9000303_Tahitian', rsid: 'rs9000303', gene: 'Unknown', trait: 'Tahitian Ancestry Marker', continent: 'Oceanian', subpop: 'Tahitian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Tahitian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.86, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.09 } },
  { markerId: 'rs9000304_Cook_Islander', rsid: 'rs9000304', gene: 'Unknown', trait: 'Cook Islander Ancestry Marker', continent: 'Oceanian', subpop: 'Cook Islander', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Cook Islander populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.85, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.1 } },
  { markerId: 'rs9000305_Cook_Islander', rsid: 'rs9000305', gene: 'Unknown', trait: 'Cook Islander Ancestry Marker', continent: 'Oceanian', subpop: 'Cook Islander', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Cook Islander populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.83, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.12 } },
  { markerId: 'rs9000306_Niuean', rsid: 'rs9000306', gene: 'Unknown', trait: 'Niuean Ancestry Marker', continent: 'Oceanian', subpop: 'Niuean', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Niuean populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.88, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.07 } },
  { markerId: 'rs9000307_Niuean', rsid: 'rs9000307', gene: 'Unknown', trait: 'Niuean Ancestry Marker', continent: 'Oceanian', subpop: 'Niuean', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Niuean populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.86, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.09 } },
  { markerId: 'rs9000308_Tokelauan', rsid: 'rs9000308', gene: 'Unknown', trait: 'Tokelauan Ancestry Marker', continent: 'Oceanian', subpop: 'Tokelauan', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Tokelauan populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.89, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.06 } },
  { markerId: 'rs9000309_Tokelauan', rsid: 'rs9000309', gene: 'Unknown', trait: 'Tokelauan Ancestry Marker', continent: 'Oceanian', subpop: 'Tokelauan', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Tokelauan populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.87, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.08 } },
  { markerId: 'rs9000310_Tuvaluan', rsid: 'rs9000310', gene: 'Unknown', trait: 'Tuvaluan Ancestry Marker', continent: 'Oceanian', subpop: 'Tuvaluan', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Tuvaluan populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.88, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.07 } },
  { markerId: 'rs9000311_Tuvaluan', rsid: 'rs9000311', gene: 'Unknown', trait: 'Tuvaluan Ancestry Marker', continent: 'Oceanian', subpop: 'Tuvaluan', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Tuvaluan populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.86, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.09 } },
  { markerId: 'rs9000312_Solomon_Islander', rsid: 'rs9000312', gene: 'Unknown', trait: 'Solomon Islander Ancestry Marker', continent: 'Oceanian', subpop: 'Solomon Islander', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Solomon Islander populations.', frequencies: { AFR: 0.02, AMR: 0.01, EAS: 0.4, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.54 } },
  { markerId: 'rs9000313_Vanuatu', rsid: 'rs9000313', gene: 'Unknown', trait: 'Vanuatu Ancestry Marker', continent: 'Oceanian', subpop: 'Vanuatu', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Vanuatu populations.', frequencies: { AFR: 0.02, AMR: 0.01, EAS: 0.45, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.49 } },
  { markerId: 'rs12821256_NorthAfrican', rsid: 'rs12821256', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.28, AMR: 0.1, EAS: 0.2, EUR: 0.58, SAS: 0.35, MENA: 0.95 } },
  { markerId: 'rs9999901_Arabian', rsid: 'rs9999901', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.1, AMR: 0.05, EAS: 0.02, EUR: 0.2, SAS: 0.1, MENA: 0.95 } },
  { markerId: 'rs9999902_Levantine', rsid: 'rs9999902', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.05, AMR: 0.02, EAS: 0.01, EUR: 0.3, SAS: 0.05, MENA: 0.98 } },
  { markerId: 'rs9999903_NorthAfrican', rsid: 'rs9999903', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.3, AMR: 0.05, EAS: 0.02, EUR: 0.15, SAS: 0.1, MENA: 0.92 } },
  { markerId: 'rs9999904_Arabian', rsid: 'rs9999904', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.15, AMR: 0.03, EAS: 0.01, EUR: 0.25, SAS: 0.08, MENA: 0.9 } },
  { markerId: 'rs9999905_Levantine', rsid: 'rs9999905', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.08, AMR: 0.02, EAS: 0.01, EUR: 0.35, SAS: 0.05, MENA: 0.96 } },
  { markerId: 'rs6119471_NorthAfrican', rsid: 'rs6119471', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.38, AMR: 0.06, EAS: 0.04, EUR: 0.22, SAS: 0.15, MENA: 0.92 } },
  { markerId: 'rs10407228_Arabian', rsid: 'rs10407228', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.22, AMR: 0.08, EAS: 0.06, EUR: 0.32, SAS: 0.28, MENA: 0.9 } },
  { markerId: 'rs7722456_NorthAfrican', rsid: 'rs7722456', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.42, AMR: 0.05, EAS: 0.04, EUR: 0.18, SAS: 0.12, MENA: 0.85 } },
  { markerId: 'rs11215545_Levantine', rsid: 'rs11215545', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.15, AMR: 0.05, EAS: 0.02, EUR: 0.35, SAS: 0.2, MENA: 0.98 } },
  { markerId: 'rs1393350_Arabian', rsid: 'rs1393350', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.12, AMR: 0.03, EAS: 0.02, EUR: 0.28, SAS: 0.18, MENA: 0.94 } },
  { markerId: 'rs11215546_Levantine', rsid: 'rs11215546', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.1, AMR: 0.04, EAS: 0.01, EUR: 0.3, SAS: 0.15, MENA: 0.96 } },
  { markerId: 'rs1393351_Arabian', rsid: 'rs1393351', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.1, AMR: 0.02, EAS: 0.01, EUR: 0.25, SAS: 0.15, MENA: 0.92 } },
  { markerId: 'rs10407229_Arabian', rsid: 'rs10407229', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.2, AMR: 0.06, EAS: 0.04, EUR: 0.3, SAS: 0.25, MENA: 0.88 } },
  { markerId: 'rs6119472_NorthAfrican', rsid: 'rs6119472', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.35, AMR: 0.05, EAS: 0.03, EUR: 0.2, SAS: 0.12, MENA: 0.9 } },
  { markerId: 'rs7722457_NorthAfrican', rsid: 'rs7722457', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.4, AMR: 0.04, EAS: 0.03, EUR: 0.15, SAS: 0.1, MENA: 0.82 } },
  { markerId: 'rs12821257_NorthAfrican', rsid: 'rs12821257', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.25, AMR: 0.08, EAS: 0.15, EUR: 0.55, SAS: 0.3, MENA: 0.92 } },
  { markerId: 'rs1800409_Levantine', rsid: 'rs1800409', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.1, AMR: 0.05, EAS: 0.02, EUR: 0.4, SAS: 0.2, MENA: 0.85 } },
  { markerId: 'rs11215547_Levantine', rsid: 'rs11215547', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.08, AMR: 0.03, EAS: 0.01, EUR: 0.25, SAS: 0.12, MENA: 0.94 } },
  { markerId: 'rs1393352_Arabian', rsid: 'rs1393352', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.08, AMR: 0.02, EAS: 0.01, EUR: 0.2, SAS: 0.12, MENA: 0.9 } },
  { markerId: 'rs10407230_Arabian', rsid: 'rs10407230', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.15, AMR: 0.05, EAS: 0.03, EUR: 0.25, SAS: 0.2, MENA: 0.85 } },
  { markerId: 'rs6119473_NorthAfrican', rsid: 'rs6119473', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.3, AMR: 0.04, EAS: 0.02, EUR: 0.18, SAS: 0.1, MENA: 0.88 } },
  { markerId: 'rs7722458_NorthAfrican', rsid: 'rs7722458', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.35, AMR: 0.03, EAS: 0.02, EUR: 0.12, SAS: 0.08, MENA: 0.8 } },
  { markerId: 'rs12821258_NorthAfrican', rsid: 'rs12821258', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.2, AMR: 0.06, EAS: 0.1, EUR: 0.5, SAS: 0.25, MENA: 0.9 } },
  { markerId: 'rs1800415_Levantine', rsid: 'rs1800415', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.05, AMR: 0.02, EAS: 0.01, EUR: 0.2, SAS: 0.08, MENA: 0.7 } },
  { markerId: 'rs11215554_Levantine', rsid: 'rs11215554', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.03, AMR: 0.01, EAS: 0.01, EUR: 0.1, SAS: 0.05, MENA: 0.8 } },
  { markerId: 'rs1393358_Arabian', rsid: 'rs1393358', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.03, AMR: 0.01, EAS: 0.01, EUR: 0.06, SAS: 0.05, MENA: 0.75 } },
  { markerId: 'rs10407235_Arabian', rsid: 'rs10407235', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.05, AMR: 0.02, EAS: 0.01, EUR: 0.1, SAS: 0.07, MENA: 0.72 } },
  { markerId: 'rs6119478_NorthAfrican', rsid: 'rs6119478', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.08, AMR: 0.01, EAS: 0.01, EUR: 0.06, SAS: 0.02, MENA: 0.75 } },
  { markerId: 'rs1800416_Levantine', rsid: 'rs1800416', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.04, AMR: 0.01, EAS: 0.01, EUR: 0.15, SAS: 0.06, MENA: 0.72 } },
  { markerId: 'rs11215555_Levantine', rsid: 'rs11215555', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.02, AMR: 0.01, EAS: 0.01, EUR: 0.08, SAS: 0.04, MENA: 0.82 } },
  { markerId: 'rs1393359_Arabian', rsid: 'rs1393359', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.02, AMR: 0.01, EAS: 0.01, EUR: 0.05, SAS: 0.04, MENA: 0.78 } },
  { markerId: 'rs10407236_Arabian', rsid: 'rs10407236', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.04, AMR: 0.01, EAS: 0.01, EUR: 0.08, SAS: 0.06, MENA: 0.75 } },
  { markerId: 'rs6119479_NorthAfrican', rsid: 'rs6119479', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.06, AMR: 0.01, EAS: 0.01, EUR: 0.05, SAS: 0.01, MENA: 0.78 } },
  { markerId: 'rs1800417_Levantine', rsid: 'rs1800417', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.03, AMR: 0.01, EAS: 0.01, EUR: 0.12, SAS: 0.05, MENA: 0.75 } },
  { markerId: 'rs11215556_Levantine', rsid: 'rs11215556', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.06, SAS: 0.03, MENA: 0.85 } },
  { markerId: 'rs1393360_Arabian', rsid: 'rs1393360', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.04, SAS: 0.03, MENA: 0.80 } },
  { markerId: 'rs10407237_Arabian', rsid: 'rs10407237', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.03, AMR: 0.01, EAS: 0.01, EUR: 0.06, SAS: 0.05, MENA: 0.78 } },
  { markerId: 'rs6119480_NorthAfrican', rsid: 'rs6119480', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.05, AMR: 0.01, EAS: 0.01, EUR: 0.04, SAS: 0.01, MENA: 0.8 } },
  { markerId: 'rs1800418_Levantine', rsid: 'rs1800418', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.02, AMR: 0.01, EAS: 0.01, EUR: 0.1, SAS: 0.04, MENA: 0.78 } },
  { markerId: 'rs11215557_Levantine', rsid: 'rs11215557', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.05, SAS: 0.02, MENA: 0.88 } },
  { markerId: 'rs1393361_Arabian', rsid: 'rs1393361', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.03, SAS: 0.02, MENA: 0.82 } },
  { markerId: 'rs10407238_Arabian', rsid: 'rs10407238', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.02, AMR: 0.01, EAS: 0.01, EUR: 0.05, SAS: 0.04, MENA: 0.8 } },
  { markerId: 'rs6119481_NorthAfrican', rsid: 'rs6119481', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.04, AMR: 0.01, EAS: 0.01, EUR: 0.03, SAS: 0.01, MENA: 0.82 } },
  { markerId: 'rs1800419_Levantine', rsid: 'rs1800419', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.08, SAS: 0.03, MENA: 0.8 } },
  { markerId: 'rs11215558_Levantine', rsid: 'rs11215558', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.04, SAS: 0.01, MENA: 0.9 } },
  { markerId: 'rs1393362_Arabian', rsid: 'rs1393362', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.02, SAS: 0.01, MENA: 0.85 } },
  { markerId: 'rs10407239_Arabian', rsid: 'rs10407239', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.04, SAS: 0.03, MENA: 0.82 } },
  { markerId: 'rs1800410_Levantine', rsid: 'rs1800410', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.08, AMR: 0.04, EAS: 0.01, EUR: 0.35, SAS: 0.15, MENA: 0.82 } },
  { markerId: 'rs1393353_Arabian', rsid: 'rs1393353', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.05, AMR: 0.02, EAS: 0.01, EUR: 0.15, SAS: 0.08, MENA: 0.88 } },
  { markerId: 'rs10407231_Arabian', rsid: 'rs10407231', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.1, AMR: 0.03, EAS: 0.02, EUR: 0.2, SAS: 0.12, MENA: 0.85 } },
  { markerId: 'rs6119474_NorthAfrican', rsid: 'rs6119474', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.25, AMR: 0.04, EAS: 0.02, EUR: 0.15, SAS: 0.08, MENA: 0.9 } },
  { markerId: 'rs7722459_NorthAfrican', rsid: 'rs7722459', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.3, AMR: 0.03, EAS: 0.01, EUR: 0.1, SAS: 0.05, MENA: 0.82 } },
  { markerId: 'rs12821259_NorthAfrican', rsid: 'rs12821259', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.15, AMR: 0.05, EAS: 0.08, EUR: 0.45, SAS: 0.2, MENA: 0.92 } },
  { markerId: 'rs1800411_Levantine', rsid: 'rs1800411', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.05, AMR: 0.02, EAS: 0.01, EUR: 0.25, SAS: 0.1, MENA: 0.88 } },
  { markerId: 'rs11215550_Levantine', rsid: 'rs11215550', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.03, AMR: 0.01, EAS: 0.01, EUR: 0.15, SAS: 0.05, MENA: 0.92 } },
  { markerId: 'rs1393355_Arabian', rsid: 'rs1393355', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.04, AMR: 0.01, EAS: 0.01, EUR: 0.12, SAS: 0.06, MENA: 0.9 } },
  { markerId: 'rs10757278_Levantine', rsid: 'rs10757278', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.02, AMR: 0.01, EAS: 0.01, EUR: 0.1, SAS: 0.04, MENA: 0.95 } },
  { markerId: 'rs1333049_Arabian', rsid: 'rs1333049', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.02, AMR: 0.01, EAS: 0.01, EUR: 0.08, SAS: 0.04, MENA: 0.92 } },
  { markerId: 'rs10911063_NorthAfrican', rsid: 'rs10911063', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.12, AMR: 0.02, EAS: 0.01, EUR: 0.08, SAS: 0.03, MENA: 0.94 } },
  { markerId: 'rs10488631_Anatolian', rsid: 'rs10488631', gene: 'Unknown', trait: 'Anatolian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Anatolian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Anatolian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.45, SAS: 0.15, MENA: 0.85 } },
  { markerId: 'rs11103333_Persian', rsid: 'rs11103333', gene: 'Unknown', trait: 'Persian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Persian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Persian populations.', frequencies: { AFR: 0.02, AMR: 0.02, EAS: 0.05, EUR: 0.3, SAS: 0.4, MENA: 0.82 } },
  { markerId: 'rs10757274_WestAsian', rsid: 'rs10757274', gene: 'Unknown', trait: 'West Asian Ancestry Marker', continent: 'Middle Eastern', subpop: 'West Asian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for West Asian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.02, EUR: 0.4, SAS: 0.25, MENA: 0.88 } },
  { markerId: 'rs1333048_WestAsian', rsid: 'rs1333048', gene: 'Unknown', trait: 'West Asian Ancestry Marker', continent: 'Middle Eastern', subpop: 'West Asian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for West Asian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.35, SAS: 0.2, MENA: 0.9 } },
  { markerId: 'rs11103332_WestAsian', rsid: 'rs11103332', gene: 'Unknown', trait: 'West Asian Ancestry Marker', continent: 'Middle Eastern', subpop: 'West Asian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for West Asian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.3, SAS: 0.15, MENA: 0.92 } },
  { markerId: 'rs10757279_Levantine', rsid: 'rs10757279', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.12, SAS: 0.05, MENA: 0.96 } },
  { markerId: 'rs1333047_Arabian', rsid: 'rs1333047', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.08, SAS: 0.04, MENA: 0.94 } },
  { markerId: 'rs10488632_Anatolian', rsid: 'rs10488632', gene: 'Unknown', trait: 'Anatolian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Anatolian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Anatolian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.4, SAS: 0.12, MENA: 0.88 } },
  { markerId: 'rs10488633_Anatolian', rsid: 'rs10488633', gene: 'Unknown', trait: 'Anatolian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Anatolian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Anatolian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.38, SAS: 0.1, MENA: 0.9 } },
  { markerId: 'rs10488634_Anatolian', rsid: 'rs10488634', gene: 'Unknown', trait: 'Anatolian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Anatolian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Anatolian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.35, SAS: 0.08, MENA: 0.92 } },
  { markerId: 'rs10488635_Anatolian', rsid: 'rs10488635', gene: 'Unknown', trait: 'Anatolian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Anatolian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Anatolian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.32, SAS: 0.06, MENA: 0.94 } },
  { markerId: 'rs11103334_Persian', rsid: 'rs11103334', gene: 'Unknown', trait: 'Persian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Persian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Persian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.04, EUR: 0.28, SAS: 0.38, MENA: 0.85 } },
  { markerId: 'rs11103335_Persian', rsid: 'rs11103335', gene: 'Unknown', trait: 'Persian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Persian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Persian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.03, EUR: 0.25, SAS: 0.35, MENA: 0.88 } },
  { markerId: 'rs11103336_Persian', rsid: 'rs11103336', gene: 'Unknown', trait: 'Persian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Persian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Persian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.02, EUR: 0.22, SAS: 0.32, MENA: 0.9 } },
  { markerId: 'rs11103337_Persian', rsid: 'rs11103337', gene: 'Unknown', trait: 'Persian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Persian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Persian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.2, SAS: 0.3, MENA: 0.92 } },
  { markerId: 'rs10757275_WestAsian', rsid: 'rs10757275', gene: 'Unknown', trait: 'West Asian Ancestry Marker', continent: 'Middle Eastern', subpop: 'West Asian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for West Asian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.38, SAS: 0.22, MENA: 0.9 } },
  { markerId: 'rs10757276_WestAsian', rsid: 'rs10757276', gene: 'Unknown', trait: 'West Asian Ancestry Marker', continent: 'Middle Eastern', subpop: 'West Asian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for West Asian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.35, SAS: 0.2, MENA: 0.92 } },
  { markerId: 'rs10911061_NorthAfrican', rsid: 'rs10911061', gene: 'Unknown', trait: 'North African Ancestry Marker', continent: 'Middle Eastern', subpop: 'North African', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North African populations.', frequencies: { AFR: 0.1, AMR: 0.01, EAS: 0.01, EUR: 0.06, SAS: 0.02, MENA: 0.96 } },
  { markerId: 'rs9000314_Iranian', rsid: 'rs9000314', gene: 'Unknown', trait: 'Iranian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Iranian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Iranian populations.', frequencies: { AFR: 0.02, AMR: 0.02, EAS: 0.05, EUR: 0.3, SAS: 0.35, MENA: 0.85 } },
  { markerId: 'rs9000315_Iranian', rsid: 'rs9000315', gene: 'Unknown', trait: 'Iranian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Iranian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Iranian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.04, EUR: 0.25, SAS: 0.3, MENA: 0.88 } },
  { markerId: 'rs9000316_Turkish', rsid: 'rs9000316', gene: 'Unknown', trait: 'Turkish Ancestry Marker', continent: 'Middle Eastern', subpop: 'Turkish', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Turkish populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.02, EUR: 0.45, SAS: 0.15, MENA: 0.82 } },
  { markerId: 'rs9000317_Turkish', rsid: 'rs9000317', gene: 'Unknown', trait: 'Turkish Ancestry Marker', continent: 'Middle Eastern', subpop: 'Turkish', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Turkish populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.4, SAS: 0.12, MENA: 0.85 } },
  { markerId: 'rs9000318_Egyptian', rsid: 'rs9000318', gene: 'Unknown', trait: 'Egyptian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Egyptian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Egyptian populations.', frequencies: { AFR: 0.15, AMR: 0.05, EAS: 0.02, EUR: 0.25, SAS: 0.1, MENA: 0.9 } },
  { markerId: 'rs9000319_Egyptian', rsid: 'rs9000319', gene: 'Unknown', trait: 'Egyptian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Egyptian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Egyptian populations.', frequencies: { AFR: 0.12, AMR: 0.04, EAS: 0.01, EUR: 0.2, SAS: 0.08, MENA: 0.92 } },
  { markerId: 'rs9000320_Moroccan', rsid: 'rs9000320', gene: 'Unknown', trait: 'Moroccan Ancestry Marker', continent: 'Middle Eastern', subpop: 'Moroccan', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Moroccan populations.', frequencies: { AFR: 0.25, AMR: 0.06, EAS: 0.03, EUR: 0.18, SAS: 0.08, MENA: 0.88 } },
  { markerId: 'rs9000321_Moroccan', rsid: 'rs9000321', gene: 'Unknown', trait: 'Moroccan Ancestry Marker', continent: 'Middle Eastern', subpop: 'Moroccan', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Moroccan populations.', frequencies: { AFR: 0.22, AMR: 0.05, EAS: 0.02, EUR: 0.15, SAS: 0.06, MENA: 0.9 } },
  { markerId: 'rs9000322_Algerian', rsid: 'rs9000322', gene: 'Unknown', trait: 'Algerian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Algerian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Algerian populations.', frequencies: { AFR: 0.2, AMR: 0.05, EAS: 0.02, EUR: 0.18, SAS: 0.08, MENA: 0.85 } },
  { markerId: 'rs9000323_Algerian', rsid: 'rs9000323', gene: 'Unknown', trait: 'Algerian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Algerian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Algerian populations.', frequencies: { AFR: 0.18, AMR: 0.04, EAS: 0.01, EUR: 0.15, SAS: 0.06, MENA: 0.88 } },
  { markerId: 'rs9000324_Tunisian', rsid: 'rs9000324', gene: 'Unknown', trait: 'Tunisian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Tunisian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Tunisian populations.', frequencies: { AFR: 0.15, AMR: 0.04, EAS: 0.02, EUR: 0.2, SAS: 0.08, MENA: 0.9 } },
  { markerId: 'rs9000325_Tunisian', rsid: 'rs9000325', gene: 'Unknown', trait: 'Tunisian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Tunisian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Tunisian populations.', frequencies: { AFR: 0.12, AMR: 0.03, EAS: 0.01, EUR: 0.18, SAS: 0.06, MENA: 0.92 } },
  { markerId: 'rs9000326_Libyan', rsid: 'rs9000326', gene: 'Unknown', trait: 'Libyan Ancestry Marker', continent: 'Middle Eastern', subpop: 'Libyan', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Libyan populations.', frequencies: { AFR: 0.18, AMR: 0.05, EAS: 0.02, EUR: 0.22, SAS: 0.1, MENA: 0.88 } },
  { markerId: 'rs9000327_Libyan', rsid: 'rs9000327', gene: 'Unknown', trait: 'Libyan Ancestry Marker', continent: 'Middle Eastern', subpop: 'Libyan', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Libyan populations.', frequencies: { AFR: 0.15, AMR: 0.04, EAS: 0.01, EUR: 0.2, SAS: 0.08, MENA: 0.9 } },
  { markerId: 'rs9000328_Iraqi', rsid: 'rs9000328', gene: 'Unknown', trait: 'Iraqi Ancestry Marker', continent: 'Middle Eastern', subpop: 'Iraqi', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Iraqi populations.', frequencies: { AFR: 0.05, AMR: 0.03, EAS: 0.02, EUR: 0.3, SAS: 0.2, MENA: 0.85 } },
  { markerId: 'rs9000329_Iraqi', rsid: 'rs9000329', gene: 'Unknown', trait: 'Iraqi Ancestry Marker', continent: 'Middle Eastern', subpop: 'Iraqi', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Iraqi populations.', frequencies: { AFR: 0.03, AMR: 0.02, EAS: 0.01, EUR: 0.25, SAS: 0.15, MENA: 0.88 } },
  { markerId: 'rs9000330_Syrian', rsid: 'rs9000330', gene: 'Unknown', trait: 'Syrian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Syrian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Syrian populations.', frequencies: { AFR: 0.04, AMR: 0.02, EAS: 0.01, EUR: 0.35, SAS: 0.1, MENA: 0.9 } },
  { markerId: 'rs9000331_Syrian', rsid: 'rs9000331', gene: 'Unknown', trait: 'Syrian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Syrian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Syrian populations.', frequencies: { AFR: 0.02, AMR: 0.01, EAS: 0.01, EUR: 0.3, SAS: 0.08, MENA: 0.92 } },
  { markerId: 'rs9000332_Jordanian', rsid: 'rs9000332', gene: 'Unknown', trait: 'Jordanian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Jordanian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Jordanian populations.', frequencies: { AFR: 0.06, AMR: 0.03, EAS: 0.02, EUR: 0.32, SAS: 0.12, MENA: 0.88 } },
  { markerId: 'rs9000333_Jordanian', rsid: 'rs9000333', gene: 'Unknown', trait: 'Jordanian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Jordanian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Jordanian populations.', frequencies: { AFR: 0.04, AMR: 0.02, EAS: 0.01, EUR: 0.28, SAS: 0.1, MENA: 0.9 } },
  { markerId: 'rs16891982_Maghrebi', rsid: 'rs16891982', gene: 'Unknown', trait: 'Maghrebi Ancestry Marker', continent: 'Middle Eastern', subpop: 'Maghrebi', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Maghrebi populations.', frequencies: { AFR: 0.2, AMR: 0.05, EAS: 0.02, EUR: 0.15, SAS: 0.08, MENA: 0.92 } },
  { markerId: 'rs1426644_WestEurasian', rsid: 'rs1426644', gene: 'Unknown', trait: 'West Eurasian Ancestry Marker', continent: 'Middle Eastern', subpop: 'West Eurasian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for West Eurasian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.98, SAS: 0.85, MENA: 0.95 } },
  { markerId: 'rs12186491_Levantine', rsid: 'rs12186491', gene: 'Unknown', trait: 'Levantine Ancestry Marker', continent: 'Middle Eastern', subpop: 'Levantine', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Levantine populations.', frequencies: { AFR: 0.05, AMR: 0.02, EAS: 0.01, EUR: 0.3, SAS: 0.1, MENA: 0.98 } },
  { markerId: 'rs6601495_Arabian', rsid: 'rs6601495', gene: 'Unknown', trait: 'Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Arabian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Arabian populations.', frequencies: { AFR: 0.08, AMR: 0.03, EAS: 0.01, EUR: 0.2, SAS: 0.12, MENA: 0.96 } },
  { markerId: 'rs12916300_Maghrebi', rsid: 'rs12916300', gene: 'Unknown', trait: 'Maghrebi Ancestry Marker', continent: 'Middle Eastern', subpop: 'Maghrebi', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Maghrebi populations.', frequencies: { AFR: 0.18, AMR: 0.04, EAS: 0.02, EUR: 0.12, SAS: 0.06, MENA: 0.94 } },
  // East Asian Sub-populations
  { markerId: 'rs1800414_Japanese', rsid: 'rs1800414', gene: 'OCA2', trait: 'Japanese Ancestry Marker', continent: 'East Asian', subpop: 'Japanese', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Japanese populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.95, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs1869901_Japanese', rsid: 'rs1869901', gene: 'FAS', trait: 'Japanese Ancestry Marker', continent: 'East Asian', subpop: 'Japanese', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Japanese populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.92, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs1048943_Korean', rsid: 'rs1048943', gene: 'CYP1A1', trait: 'Korean Ancestry Marker', continent: 'East Asian', subpop: 'Korean', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Korean populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.94, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs17822931_Korean', rsid: 'rs17822931', gene: 'ABCC11', trait: 'Korean Ancestry Marker', continent: 'East Asian', subpop: 'Korean', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Korean populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.98, EUR: 0.01, SAS: 0.01, MENA: 0 } },
  { markerId: 'rs1229984_Han_North', rsid: 'rs1229984', gene: 'ADH1B', trait: 'Northern Han Ancestry Marker', continent: 'East Asian', subpop: 'Northern Han', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northern Han Chinese populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.9, EUR: 0.01, SAS: 0.05, MENA: 0.01 } },
  { markerId: 'rs1800414_Han_South', rsid: 'rs1800414', gene: 'OCA2', trait: 'Southern Han Ancestry Marker', continent: 'East Asian', subpop: 'Southern Han', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Southern Han Chinese populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0.88, EUR: 0.01, SAS: 0.1, MENA: 0.01 } },
  { markerId: 'rs1869901_Vietnamese', rsid: 'rs1869901', gene: 'FAS', trait: 'Vietnamese Ancestry Marker', continent: 'East Asian', subpop: 'Vietnamese', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Vietnamese populations.', frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.85, EUR: 0.01, SAS: 0.15, MENA: 0.01 } },
  { markerId: 'rs1048943_Thai', rsid: 'rs1048943', gene: 'CYP1A1', trait: 'Thai Ancestry Marker', continent: 'East Asian', subpop: 'Thai', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Thai populations.', frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.82, EUR: 0.01, SAS: 0.2, MENA: 0.01 } },
  { markerId: 'rs17822931_Filipino', rsid: 'rs17822931', gene: 'ABCC11', trait: 'Filipino Ancestry Marker', continent: 'East Asian', subpop: 'Filipino', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Filipino populations.', frequencies: { AFR: 0.03, AMR: 0.08, EAS: 0.78, EUR: 0.02, SAS: 0.1, MENA: 0.01 } },
  { markerId: 'rs1229984_Indonesian', rsid: 'rs1229984', gene: 'ADH1B', trait: 'Indonesian Ancestry Marker', continent: 'East Asian', subpop: 'Indonesian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Indonesian populations.', frequencies: { AFR: 0.03, AMR: 0.08, EAS: 0.75, EUR: 0.02, SAS: 0.15, MENA: 0.01 } },
  { markerId: 'rs1800414_Malay', rsid: 'rs1800414', gene: 'OCA2', trait: 'Malay Ancestry Marker', continent: 'East Asian', subpop: 'Malay', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Malay populations.', frequencies: { AFR: 0.03, AMR: 0.08, EAS: 0.72, EUR: 0.02, SAS: 0.18, MENA: 0.01 } },
  // South Asian Sub-populations
  { markerId: 'rs2816030_North_Indian', rsid: 'rs2816030', gene: 'SLC24A5', trait: 'North Indian Ancestry Marker', continent: 'South Asian', subpop: 'North Indian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for North Indian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.1, EUR: 0.4, SAS: 0.85, MENA: 0.3 } },
  { markerId: 'rs2816030_South_Indian', rsid: 'rs2816030', gene: 'SLC24A5', trait: 'South Indian Ancestry Marker', continent: 'South Asian', subpop: 'South Indian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for South Indian populations.', frequencies: { AFR: 0.08, AMR: 0.05, EAS: 0.15, EUR: 0.2, SAS: 0.9, MENA: 0.15 } },
  { markerId: 'rs2816030_Bengali', rsid: 'rs2816030', gene: 'SLC24A5', trait: 'Bengali Ancestry Marker', continent: 'South Asian', subpop: 'Bengali', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Bengali populations.', frequencies: { AFR: 0.06, AMR: 0.05, EAS: 0.25, EUR: 0.25, SAS: 0.82, MENA: 0.18 } },
  { markerId: 'rs2816030_Punjabi', rsid: 'rs2816030', gene: 'SLC24A5', trait: 'Punjabi Ancestry Marker', continent: 'South Asian', subpop: 'Punjabi', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Punjabi populations.', frequencies: { AFR: 0.04, AMR: 0.05, EAS: 0.08, EUR: 0.45, SAS: 0.88, MENA: 0.35 } },
  { markerId: 'rs2816030_Tamil', rsid: 'rs2816030', gene: 'SLC24A5', trait: 'Tamil Ancestry Marker', continent: 'South Asian', subpop: 'Tamil', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Tamil populations.', frequencies: { AFR: 0.09, AMR: 0.05, EAS: 0.12, EUR: 0.15, SAS: 0.92, MENA: 0.1 } },
  { markerId: 'rs2816030_Sinhalese', rsid: 'rs2816030', gene: 'SLC24A5', trait: 'Sinhalese Ancestry Marker', continent: 'South Asian', subpop: 'Sinhalese', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sinhalese populations.', frequencies: { AFR: 0.07, AMR: 0.05, EAS: 0.18, EUR: 0.18, SAS: 0.85, MENA: 0.12 } },
  { markerId: 'rs2816030_Pashtun', rsid: 'rs2816030', gene: 'SLC24A5', trait: 'Pashtun Ancestry Marker', continent: 'South Asian', subpop: 'Pashtun', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Pashtun populations.', frequencies: { AFR: 0.03, AMR: 0.05, EAS: 0.05, EUR: 0.5, SAS: 0.8, MENA: 0.45 } },
  // MENA Sub-populations
  { markerId: 'rs10757279_Lebanese', rsid: 'rs10757279', gene: 'Unknown', trait: 'Lebanese Ancestry Marker', continent: 'Middle Eastern', subpop: 'Lebanese', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Lebanese populations.', frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.01, EUR: 0.3, SAS: 0.1, MENA: 0.95 } },
  { markerId: 'rs10757279_Syrian', rsid: 'rs10757279', gene: 'Unknown', trait: 'Syrian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Syrian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Syrian populations.', frequencies: { AFR: 0.03, AMR: 0.05, EAS: 0.01, EUR: 0.25, SAS: 0.12, MENA: 0.92 } },
  { markerId: 'rs10757279_Palestinian', rsid: 'rs10757279', gene: 'Unknown', trait: 'Palestinian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Palestinian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Palestinian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.01, EUR: 0.2, SAS: 0.15, MENA: 0.9 } },
  { markerId: 'rs10757279_Jordanian', rsid: 'rs10757279', gene: 'Unknown', trait: 'Jordanian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Jordanian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Jordanian populations.', frequencies: { AFR: 0.04, AMR: 0.05, EAS: 0.01, EUR: 0.22, SAS: 0.14, MENA: 0.91 } },
  { markerId: 'rs1333047_Saudi', rsid: 'rs1333047', gene: 'Unknown', trait: 'Saudi Arabian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Saudi', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Saudi Arabian populations.', frequencies: { AFR: 0.08, AMR: 0.05, EAS: 0.01, EUR: 0.1, SAS: 0.15, MENA: 0.96 } },
  { markerId: 'rs1333047_Yemeni', rsid: 'rs1333047', gene: 'Unknown', trait: 'Yemeni Ancestry Marker', continent: 'Middle Eastern', subpop: 'Yemeni', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Yemeni populations.', frequencies: { AFR: 0.15, AMR: 0.05, EAS: 0.01, EUR: 0.05, SAS: 0.2, MENA: 0.92 } },
  { markerId: 'rs1333047_Omani', rsid: 'rs1333047', gene: 'Unknown', trait: 'Omani Ancestry Marker', continent: 'Middle Eastern', subpop: 'Omani', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Omani populations.', frequencies: { AFR: 0.12, AMR: 0.05, EAS: 0.01, EUR: 0.08, SAS: 0.18, MENA: 0.94 } },
  { markerId: 'rs1333047_Emirati', rsid: 'rs1333047', gene: 'Unknown', trait: 'Emirati Ancestry Marker', continent: 'Middle Eastern', subpop: 'Emirati', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Emirati populations.', frequencies: { AFR: 0.1, AMR: 0.05, EAS: 0.01, EUR: 0.12, SAS: 0.16, MENA: 0.95 } },
  { markerId: 'rs16891982_Moroccan', rsid: 'rs16891982', gene: 'Unknown', trait: 'Moroccan Ancestry Marker', continent: 'Middle Eastern', subpop: 'Moroccan', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Moroccan populations.', frequencies: { AFR: 0.25, AMR: 0.05, EAS: 0.01, EUR: 0.15, SAS: 0.05, MENA: 0.9 } },
  { markerId: 'rs16891982_Algerian', rsid: 'rs16891982', gene: 'Unknown', trait: 'Algerian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Algerian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Algerian populations.', frequencies: { AFR: 0.22, AMR: 0.05, EAS: 0.01, EUR: 0.18, SAS: 0.06, MENA: 0.88 } },
  { markerId: 'rs16891982_Tunisian', rsid: 'rs16891982', gene: 'Unknown', trait: 'Tunisian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Tunisian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Tunisian populations.', frequencies: { AFR: 0.18, AMR: 0.05, EAS: 0.01, EUR: 0.2, SAS: 0.08, MENA: 0.92 } },
  { markerId: 'rs16891982_Libyan', rsid: 'rs16891982', gene: 'Unknown', trait: 'Libyan Ancestry Marker', continent: 'Middle Eastern', subpop: 'Libyan', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Libyan populations.', frequencies: { AFR: 0.15, AMR: 0.05, EAS: 0.01, EUR: 0.22, SAS: 0.1, MENA: 0.94 } },
  { markerId: 'rs11103333_Iranian', rsid: 'rs11103333', gene: 'Unknown', trait: 'Iranian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Iranian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Iranian populations.', frequencies: { AFR: 0.02, AMR: 0.02, EAS: 0.05, EUR: 0.3, SAS: 0.35, MENA: 0.88 } },
  { markerId: 'rs10488631_Turkish', rsid: 'rs10488631', gene: 'Unknown', trait: 'Turkish Ancestry Marker', continent: 'Middle Eastern', subpop: 'Turkish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Turkish populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.05, EUR: 0.45, SAS: 0.15, MENA: 0.85 } },
  { markerId: 'rs10757274_Kurdish', rsid: 'rs10757274', gene: 'Unknown', trait: 'Kurdish Ancestry Marker', continent: 'Middle Eastern', subpop: 'Kurdish', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Kurdish populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.02, EUR: 0.35, SAS: 0.3, MENA: 0.9 } },
  { markerId: 'rs1333048_Armenian', rsid: 'rs1333048', gene: 'Unknown', trait: 'Armenian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Armenian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Armenian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.4, SAS: 0.1, MENA: 0.95 } },
  { markerId: 'rs11103332_Georgian', rsid: 'rs11103332', gene: 'Unknown', trait: 'Georgian Ancestry Marker', continent: 'Middle Eastern', subpop: 'Georgian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Georgian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.01, EUR: 0.45, SAS: 0.05, MENA: 0.98 } },
  // Central Asian Sub-populations
  { markerId: 'rs12916300_Kazakh', rsid: 'rs12916300', gene: 'Unknown', trait: 'Kazakh Ancestry Marker', continent: 'Central Asian', subpop: 'Kazakh', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Kazakh populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0.6, EUR: 0.25, SAS: 0.1, MENA: 0.1 } },
  { markerId: 'rs12916300_Kyrgyz', rsid: 'rs12916300', gene: 'Unknown', trait: 'Kyrgyz Ancestry Marker', continent: 'Central Asian', subpop: 'Kyrgyz', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Kyrgyz populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0.65, EUR: 0.2, SAS: 0.1, MENA: 0.1 } },
  { markerId: 'rs12916300_Uzbek', rsid: 'rs12916300', gene: 'Unknown', trait: 'Uzbek Ancestry Marker', continent: 'Central Asian', subpop: 'Uzbek', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Uzbek populations.', frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.45, EUR: 0.35, SAS: 0.15, MENA: 0.2 } },
  { markerId: 'rs12916300_Turkmen', rsid: 'rs12916300', gene: 'Unknown', trait: 'Turkmen Ancestry Marker', continent: 'Central Asian', subpop: 'Turkmen', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Turkmen populations.', frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.35, EUR: 0.4, SAS: 0.15, MENA: 0.25 } },
  { markerId: 'rs12916300_Tajik', rsid: 'rs12916300', gene: 'Unknown', trait: 'Tajik Ancestry Marker', continent: 'Central Asian', subpop: 'Tajik', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Tajik populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0.25, EUR: 0.45, SAS: 0.25, MENA: 0.3 } },
  { markerId: 'rs12916300_Mongolian', rsid: 'rs12916300', gene: 'Unknown', trait: 'Mongolian Ancestry Marker', continent: 'Central Asian', subpop: 'Mongolian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Mongolian populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0.85, EUR: 0.1, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs12916300_Uyghur', rsid: 'rs12916300', gene: 'Unknown', trait: 'Uyghur Ancestry Marker', continent: 'Central Asian', subpop: 'Uyghur', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Uyghur populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0.5, EUR: 0.4, SAS: 0.1, MENA: 0.15 } },
  // More European Sub-populations
  { markerId: 'rs10456194_Italian_South', rsid: 'rs10456194', gene: 'Unknown', trait: 'Southern Italian Ancestry Marker', continent: 'European', subpop: 'Southern Italian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Southern Italian populations.', frequencies: { AFR: 0.05, AMR: 0.05, EAS: 0.01, EUR: 0.8, SAS: 0.05, MENA: 0.45 } },
  { markerId: 'rs10456194_Italian_North', rsid: 'rs10456194', gene: 'Unknown', trait: 'Northern Italian Ancestry Marker', continent: 'European', subpop: 'Northern Italian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northern Italian populations.', frequencies: { AFR: 0.01, AMR: 0.05, EAS: 0.01, EUR: 0.9, SAS: 0.05, MENA: 0.15 } },
  { markerId: 'rs1446585_French_South', rsid: 'rs1446585', gene: 'SLC24A4', trait: 'Southern French Ancestry Marker', continent: 'European', subpop: 'Southern French', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Southern French populations.', frequencies: { AFR: 0.02, AMR: 0.08, EAS: 0.01, EUR: 0.88, SAS: 0.02, MENA: 0.12 } },
  { markerId: 'rs11103343_German_North', rsid: 'rs11103343', gene: 'Unknown', trait: 'Northern German Ancestry Marker', continent: 'European', subpop: 'Northern German', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northern German populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.01, EUR: 0.96, SAS: 0.01, MENA: 0.02 } },
  { markerId: 'rs11103331_Spanish_South', rsid: 'rs11103331', gene: 'Unknown', trait: 'Southern Spanish Ancestry Marker', continent: 'European', subpop: 'Southern Spanish', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Southern Spanish populations.', frequencies: { AFR: 0.08, AMR: 0.15, EAS: 0.01, EUR: 0.82, SAS: 0.02, MENA: 0.35 } },
  { markerId: 'rs16891985_Portuguese_Azores', rsid: 'rs16891985', gene: 'SLC45A2', trait: 'Azorean Portuguese Ancestry Marker', continent: 'European', subpop: 'Azorean Portuguese', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Azorean Portuguese populations.', frequencies: { AFR: 0.05, AMR: 0.12, EAS: 0.01, EUR: 0.9, SAS: 0.05, MENA: 0.25 } },
  { markerId: 'rs4988238_Greek_Islands', rsid: 'rs4988238', gene: 'LCT', trait: 'Greek Island Ancestry Marker', continent: 'European', subpop: 'Greek Island', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Greek Island populations.', frequencies: { AFR: 0.04, AMR: 0.08, EAS: 0.02, EUR: 0.85, SAS: 0.12, MENA: 0.6 } },
  { markerId: 'rs1805007_Scandinavian_North', rsid: 'rs1805007', gene: 'MC1R', trait: 'Northern Scandinavian Ancestry Marker', continent: 'European', subpop: 'Northern Scandinavian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northern Scandinavian populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.05, EUR: 0.92, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs12916300_Russian_North', rsid: 'rs12916300', gene: 'Unknown', trait: 'Northern Russian Ancestry Marker', continent: 'European', subpop: 'Northern Russian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northern Russian populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.2, EUR: 0.94, SAS: 0.05, MENA: 0.05 } },
  { markerId: 'rs1129038_Polish_East', rsid: 'rs1129038', gene: 'SLC14A2', trait: 'Eastern Polish Ancestry Marker', continent: 'European', subpop: 'Eastern Polish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Eastern Polish populations.', frequencies: { AFR: 0.01, AMR: 0.03, EAS: 0.1, EUR: 0.9, SAS: 0.05, MENA: 0.1 } },
  // Balkan Sub-populations
  { markerId: 'rs9000200_Serbian', rsid: 'rs9000200', gene: 'Unknown', trait: 'Serbian Ancestry Marker', continent: 'European', subpop: 'Serbian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Serbian populations.', frequencies: { AFR: 0.02, AMR: 0.05, EAS: 0.02, EUR: 0.85, SAS: 0.05, MENA: 0.25 } },
  { markerId: 'rs9000200_Croatian', rsid: 'rs9000200', gene: 'Unknown', trait: 'Croatian Ancestry Marker', continent: 'European', subpop: 'Croatian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Croatian populations.', frequencies: { AFR: 0.01, AMR: 0.04, EAS: 0.01, EUR: 0.9, SAS: 0.03, MENA: 0.15 } },
  { markerId: 'rs9000200_Bulgarian', rsid: 'rs9000200', gene: 'Unknown', trait: 'Bulgarian Ancestry Marker', continent: 'European', subpop: 'Bulgarian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Bulgarian populations.', frequencies: { AFR: 0.03, AMR: 0.06, EAS: 0.03, EUR: 0.82, SAS: 0.08, MENA: 0.3 } },
  { markerId: 'rs9000200_Albanian', rsid: 'rs9000200', gene: 'Unknown', trait: 'Albanian Ancestry Marker', continent: 'European', subpop: 'Albanian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Albanian populations.', frequencies: { AFR: 0.04, AMR: 0.08, EAS: 0.02, EUR: 0.8, SAS: 0.1, MENA: 0.5 } },
  // Baltic Sub-populations
  { markerId: 'rs9000186_Lithuanian', rsid: 'rs9000186', gene: 'Unknown', trait: 'Lithuanian Ancestry Marker', continent: 'European', subpop: 'Lithuanian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Lithuanian populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.05, EUR: 0.96, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000186_Latvian', rsid: 'rs9000186', gene: 'Unknown', trait: 'Latvian Ancestry Marker', continent: 'European', subpop: 'Latvian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Latvian populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.06, EUR: 0.95, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000186_Estonian', rsid: 'rs9000186', gene: 'Unknown', trait: 'Estonian Ancestry Marker', continent: 'European', subpop: 'Estonian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Estonian populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0.08, EUR: 0.94, SAS: 0.01, MENA: 0.01 } },
  // Celtic Sub-populations
  { markerId: 'rs10456192_Scottish_Highland', rsid: 'rs10456192', gene: 'Unknown', trait: 'Scottish Highland Ancestry Marker', continent: 'European', subpop: 'Scottish Highland', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Scottish Highland populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0, EUR: 0.99, SAS: 0, MENA: 0 } },
  { markerId: 'rs10456193_Irish_West', rsid: 'rs10456193', gene: 'Unknown', trait: 'Western Irish Ancestry Marker', continent: 'European', subpop: 'Western Irish', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Western Irish populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0, EUR: 0.99, SAS: 0, MENA: 0 } },
  { markerId: 'rs11103341_Welsh_North', rsid: 'rs11103341', gene: 'Unknown', trait: 'Northern Welsh Ancestry Marker', continent: 'European', subpop: 'Northern Welsh', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Northern Welsh populations.', frequencies: { AFR: 0, AMR: 0.01, EAS: 0, EUR: 0.99, SAS: 0, MENA: 0 } },
  { markerId: 'rs9000166_Cornish', rsid: 'rs9000166', gene: 'Unknown', trait: 'Cornish Ancestry Marker', continent: 'European', subpop: 'Cornish', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Cornish populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0, EUR: 0.98, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs9000188_Breton', rsid: 'rs9000188', gene: 'Unknown', trait: 'Breton Ancestry Marker', continent: 'European', subpop: 'Breton', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Breton populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0, EUR: 0.97, SAS: 0.01, MENA: 0.02 } },
  // African Sub-populations
  { markerId: 'rs10456195_Yoruba', rsid: 'rs10456195', gene: 'Unknown', trait: 'Yoruba Ancestry Marker', continent: 'African', subpop: 'Yoruba', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Yoruba populations.', frequencies: { AFR: 0.98, AMR: 0.05, EAS: 0.01, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456196_Igbo', rsid: 'rs10456196', gene: 'Unknown', trait: 'Igbo Ancestry Marker', continent: 'African', subpop: 'Igbo', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Igbo populations.', frequencies: { AFR: 0.96, AMR: 0.04, EAS: 0.01, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456197_Mandinka', rsid: 'rs10456197', gene: 'Unknown', trait: 'Mandinka Ancestry Marker', continent: 'African', subpop: 'Mandinka', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Mandinka populations.', frequencies: { AFR: 0.94, AMR: 0.06, EAS: 0.01, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456198_Esan', rsid: 'rs10456198', gene: 'Unknown', trait: 'Esan Ancestry Marker', continent: 'African', subpop: 'Esan', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Esan populations.', frequencies: { AFR: 0.97, AMR: 0.03, EAS: 0.01, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456199_Mende', rsid: 'rs10456199', gene: 'Unknown', trait: 'Mende Ancestry Marker', continent: 'African', subpop: 'Mende', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Mende populations.', frequencies: { AFR: 0.95, AMR: 0.05, EAS: 0.01, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456200_Luhya', rsid: 'rs10456200', gene: 'Unknown', trait: 'Luhya Ancestry Marker', continent: 'African', subpop: 'Luhya', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Luhya populations.', frequencies: { AFR: 0.92, AMR: 0.02, EAS: 0.01, EUR: 0.01, SAS: 0.05, MENA: 0.02 } },
  { markerId: 'rs10456201_Maasai', rsid: 'rs10456201', gene: 'Unknown', trait: 'Maasai Ancestry Marker', continent: 'African', subpop: 'Maasai', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Maasai populations.', frequencies: { AFR: 0.88, AMR: 0.01, EAS: 0.01, EUR: 0.02, SAS: 0.08, MENA: 0.05 } },
  { markerId: 'rs10456202_Somali', rsid: 'rs10456202', gene: 'Unknown', trait: 'Somali Ancestry Marker', continent: 'African', subpop: 'Somali', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Somali populations.', frequencies: { AFR: 0.75, AMR: 0.01, EAS: 0.01, EUR: 0.05, SAS: 0.1, MENA: 0.25 } },
  { markerId: 'rs10456203_Ethiopian', rsid: 'rs10456203', gene: 'Unknown', trait: 'Ethiopian Ancestry Marker', continent: 'African', subpop: 'Ethiopian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Ethiopian populations.', frequencies: { AFR: 0.7, AMR: 0.01, EAS: 0.01, EUR: 0.08, SAS: 0.12, MENA: 0.3 } },
  { markerId: 'rs10456204_Khoisan', rsid: 'rs10456204', gene: 'Unknown', trait: 'Khoisan Ancestry Marker', continent: 'African', subpop: 'Khoisan', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Khoisan populations.', frequencies: { AFR: 0.99, AMR: 0.01, EAS: 0, EUR: 0, SAS: 0, MENA: 0 } },
  { markerId: 'rs10456205_Pygmy', rsid: 'rs10456205', gene: 'Unknown', trait: 'Pygmy Ancestry Marker', continent: 'African', subpop: 'Pygmy', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Pygmy populations.', frequencies: { AFR: 0.98, AMR: 0.01, EAS: 0, EUR: 0, SAS: 0, MENA: 0 } },
  // Native American Sub-populations
  { markerId: 'rs10456206_Mayan', rsid: 'rs10456206', gene: 'Unknown', trait: 'Mayan Ancestry Marker', continent: 'Native American', subpop: 'Mayan', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Mayan populations.', frequencies: { AFR: 0.01, AMR: 0.95, EAS: 0.05, EUR: 0.02, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456207_Incan', rsid: 'rs10456207', gene: 'Unknown', trait: 'Incan Ancestry Marker', continent: 'Native American', subpop: 'Incan', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Incan populations.', frequencies: { AFR: 0.01, AMR: 0.92, EAS: 0.08, EUR: 0.02, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456208_Aztec', rsid: 'rs10456208', gene: 'Unknown', trait: 'Aztec Ancestry Marker', continent: 'Native American', subpop: 'Aztec', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Aztec populations.', frequencies: { AFR: 0.02, AMR: 0.9, EAS: 0.05, EUR: 0.05, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456209_Quechua', rsid: 'rs10456209', gene: 'Unknown', trait: 'Quechua Ancestry Marker', continent: 'Native American', subpop: 'Quechua', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Quechua populations.', frequencies: { AFR: 0.01, AMR: 0.94, EAS: 0.06, EUR: 0.02, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456210_Aymara', rsid: 'rs10456210', gene: 'Unknown', trait: 'Aymara Ancestry Marker', continent: 'Native American', subpop: 'Aymara', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Aymara populations.', frequencies: { AFR: 0.01, AMR: 0.93, EAS: 0.07, EUR: 0.02, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456211_Guarani', rsid: 'rs10456211', gene: 'Unknown', trait: 'Guarani Ancestry Marker', continent: 'Native American', subpop: 'Guarani', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Guarani populations.', frequencies: { AFR: 0.05, AMR: 0.85, EAS: 0.05, EUR: 0.1, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456212_Mapuche', rsid: 'rs10456212', gene: 'Unknown', trait: 'Mapuche Ancestry Marker', continent: 'Native American', subpop: 'Mapuche', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Mapuche populations.', frequencies: { AFR: 0.02, AMR: 0.88, EAS: 0.05, EUR: 0.08, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456213_Navajo', rsid: 'rs10456213', gene: 'Unknown', trait: 'Navajo Ancestry Marker', continent: 'Native American', subpop: 'Navajo', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Navajo populations.', frequencies: { AFR: 0.01, AMR: 0.96, EAS: 0.1, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456214_Apache', rsid: 'rs10456214', gene: 'Unknown', trait: 'Apache Ancestry Marker', continent: 'Native American', subpop: 'Apache', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Apache populations.', frequencies: { AFR: 0.01, AMR: 0.95, EAS: 0.12, EUR: 0.01, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456215_Cherokee', rsid: 'rs10456215', gene: 'Unknown', trait: 'Cherokee Ancestry Marker', continent: 'Native American', subpop: 'Cherokee', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Cherokee populations.', frequencies: { AFR: 0.05, AMR: 0.8, EAS: 0.05, EUR: 0.15, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456216_Sioux', rsid: 'rs10456216', gene: 'Unknown', trait: 'Sioux Ancestry Marker', continent: 'Native American', subpop: 'Sioux', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Sioux populations.', frequencies: { AFR: 0.02, AMR: 0.92, EAS: 0.1, EUR: 0.05, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456217_Inuit', rsid: 'rs10456217', gene: 'Unknown', trait: 'Inuit Ancestry Marker', continent: 'Native American', subpop: 'Inuit', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Inuit populations.', frequencies: { AFR: 0.01, AMR: 0.85, EAS: 0.3, EUR: 0.05, SAS: 0.01, MENA: 0.01 } },
  // Oceanian Sub-populations
  { markerId: 'rs10456218_Papuan', rsid: 'rs10456218', gene: 'Unknown', trait: 'Papuan Ancestry Marker', continent: 'Oceanian', subpop: 'Papuan', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Papuan populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.05, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.95 } },
  { markerId: 'rs10456219_Aboriginal', rsid: 'rs10456219', gene: 'Unknown', trait: 'Aboriginal Australian Ancestry Marker', continent: 'Oceanian', subpop: 'Aboriginal Australian', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Aboriginal Australian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.02, EUR: 0.01, SAS: 0.05, MENA: 0.01, OCE: 0.98 } },
  { markerId: 'rs10456220_Melanesian', rsid: 'rs10456220', gene: 'Unknown', trait: 'Melanesian Ancestry Marker', continent: 'Oceanian', subpop: 'Melanesian', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Melanesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.1, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.92 } },
  { markerId: 'rs10456221_Micronesian', rsid: 'rs10456221', gene: 'Unknown', trait: 'Micronesian Ancestry Marker', continent: 'Oceanian', subpop: 'Micronesian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Micronesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.2, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.85 } },
  { markerId: 'rs10456222_Polynesian', rsid: 'rs10456222', gene: 'Unknown', trait: 'Polynesian Ancestry Marker', continent: 'Oceanian', subpop: 'Polynesian', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Polynesian populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.25, EUR: 0.01, SAS: 0.01, MENA: 0.01, OCE: 0.88 } },
  // More Native American Sub-populations
  { markerId: 'rs10456223_Iroquois', rsid: 'rs10456223', gene: 'Unknown', trait: 'Iroquois Ancestry Marker', continent: 'Native American', subpop: 'Iroquois', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Iroquois populations.', frequencies: { AFR: 0.02, AMR: 0.85, EAS: 0.05, EUR: 0.1, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456224_Ojibwe', rsid: 'rs10456224', gene: 'Unknown', trait: 'Ojibwe Ancestry Marker', continent: 'Native American', subpop: 'Ojibwe', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Ojibwe populations.', frequencies: { AFR: 0.02, AMR: 0.82, EAS: 0.08, EUR: 0.12, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456225_Cree', rsid: 'rs10456225', gene: 'Unknown', trait: 'Cree Ancestry Marker', continent: 'Native American', subpop: 'Cree', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Cree populations.', frequencies: { AFR: 0.01, AMR: 0.8, EAS: 0.1, EUR: 0.15, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456226_Metis', rsid: 'rs10456226', gene: 'Unknown', trait: 'Metis Ancestry Marker', continent: 'Native American', subpop: 'Metis', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Metis populations.', frequencies: { AFR: 0.02, AMR: 0.5, EAS: 0.05, EUR: 0.45, SAS: 0.01, MENA: 0.01 } },
  { markerId: 'rs10456227_Yanomami', rsid: 'rs10456227', gene: 'Unknown', trait: 'Yanomami Ancestry Marker', continent: 'Native American', subpop: 'Yanomami', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Yanomami populations.', frequencies: { AFR: 0, AMR: 0.99, EAS: 0.01, EUR: 0, SAS: 0, MENA: 0 } },
  { markerId: 'rs10456228_Taino', rsid: 'rs10456228', gene: 'Unknown', trait: 'Taino Ancestry Marker', continent: 'Native American', subpop: 'Taino', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Taino populations.', frequencies: { AFR: 0.15, AMR: 0.6, EAS: 0.05, EUR: 0.25, SAS: 0.01, MENA: 0.01 } },
  // More Polynesian Sub-populations
  { markerId: 'rs10456229_Hawaiian', rsid: 'rs10456229', gene: 'Unknown', trait: 'Hawaiian Ancestry Marker', continent: 'Oceanian', subpop: 'Hawaiian', alleles: ['C'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Hawaiian populations.', frequencies: { AFR: 0.01, AMR: 0.02, EAS: 0.3, EUR: 0.05, SAS: 0.01, MENA: 0.01, OCE: 0.8 } },
  { markerId: 'rs10456230_Maori', rsid: 'rs10456230', gene: 'Unknown', trait: 'Maori Ancestry Marker', continent: 'Oceanian', subpop: 'Maori', alleles: ['T'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Maori populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.2, EUR: 0.1, SAS: 0.01, MENA: 0.01, OCE: 0.85 } },
  { markerId: 'rs10456231_Tongan', rsid: 'rs10456231', gene: 'Unknown', trait: 'Tongan Ancestry Marker', continent: 'Oceanian', subpop: 'Tongan', alleles: ['A'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Tongan populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.22, EUR: 0.02, SAS: 0.01, MENA: 0.01, OCE: 0.9 } },
  { markerId: 'rs10456232_Samoan', rsid: 'rs10456232', gene: 'Unknown', trait: 'Samoan Ancestry Marker', continent: 'Oceanian', subpop: 'Samoan', alleles: ['G'], significance: 'Medium', category: 'Ancestry', description: 'Ancestry Informative Marker for Samoan populations.', frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.24, EUR: 0.02, SAS: 0.01, MENA: 0.01, OCE: 0.92 } },
];

export const CONTINENT_META = {
  "African":                      {color:"#E8A838",icon:"🌍"},
  "East Asian":                   {color:"#E84B4B",icon:"🌏"},
  "European":                     {color:"#4B8BE8",icon:"🌍"},
  "Universal":                    {color:"#4BE8B8",icon:"🌐"},
  "Native American":              {color:"#C25C1A",icon:"🌎"},
  "Global":                       {color:"#4BE8B8",icon:"🌐"},
  "East Asian / Native American": {color:"#C25C1A",icon:"🌎"},
  "Middle Eastern":               {color:"#E8A838",icon:"🌍"},
  "Caucasian":                    {color:"#4B8BE8",icon:"🌍"},
  "European / Asian":             {color:"#4B8BE8",icon:"🌍"},
  "Native American / Asian":      {color:"#C25C1A",icon:"🌎"},
  "Asian / Oceanian":             {color:"#E84B4B",icon:"🌏"},
  "South Asian":                  {color:"#E8A838",icon:"🌍"},
  "Oceanian":                     {color:"#4BE8B8",icon:"🏝️"},
  "Middle Eastern / African":     {color:"#E8A838",icon:"🌍"},
  "Native American / Inuit":      {color:"#C25C1A",icon:"🌎"},
  "Asian / European":             {color:"#4B8BE8",icon:"🌍"},
  "Middle Eastern / European":    {color:"#4B8BE8",icon:"🌍"},
  "African / Middle Eastern / South Asian": {color:"#E8A838",icon:"🌍"},
};

export const CATEGORY_META = {
  "Health":     { color: "#E84B4B", icon: "🏥" },
  "Ancestry":   { color: "#C25C1A", icon: "🌎" },
  "Lifestyle":  { color: "#4B8BE8", icon: "🧘" },
  "Nutrition":  { color: "#E8A838", icon: "🥗" },
  "Performance": { color: "#4BE8B8", icon: "⚡" },
};

export const SIG_COLOR = { High: "#E84B4B", Medium: "#E8A838", Low: "#4BE8B8" };

export function parseRawDNA(text: string) {
  const lines = text.split(/\r?\n/);
  const snpMap: Record<string, string> = {};
  const mtMap: Record<string, string> = {};
  let format = "Unknown";
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;
    
    // Split by tabs, commas, or multiple spaces, removing quotes for CSV
    const parts = trimmedLine.replace(/"/g, "").split(/[\t, ]+/);
    
    // Basic validation: markerId must be at index 0
    if (parts.length < 4) continue;
    const markerId = parts[0].trim().toLowerCase();
    // Allow rsid or other marker names
    if (!markerId) continue; 
    
    const chrom = parts[1].trim().toUpperCase();
    const pos = parts[2].trim();
    
    let genotype = "";
    
    // Heuristic to detect format
    // AncestryDNA: rsid, chrom, pos, allele1, allele2
    // 23andMe: rsid, chrom, pos, genotype
    // MyHeritage: rsid, chrom, pos, genotype (CSV)
    if (parts.length >= 5 && parts[3].length === 1 && parts[4].length === 1) {
      genotype = (parts[3] + parts[4]).toUpperCase();
      format = "AncestryDNA";
    } else if (parts.length >= 4) {
      genotype = parts[3].toUpperCase().replace(/\s/g, "");
      format = line.includes(",") ? "MyHeritage" : "23andMe";
    } else {
      continue; // Skip malformed lines
    }
    
    // Validate genotype: must be A, C, T, G, or -
    if (/^[ACTG-]{1,2}$/.test(genotype) && genotype !== "--" && genotype !== "00") {
      snpMap[markerId] = genotype;
      
      // Extract mtDNA mutations
      if (chrom === "MT" || chrom === "M" || chrom === "26") {
        const allele = genotype[0];
        if (allele !== "-") {
          mtMap[pos] = allele;
        }
      }
    }
  }
  return { snpMap, mtMap, format };
}

export function matchSNPs(snpMap: Record<string, string>) {
  const seen = new Set();
  return SNP_DB.flatMap(snp => {
    const key = snp.markerId + snp.continent;
    if (seen.has(key)) return [];
    seen.add(key);
    
    // Check markerId, rsid, and aliases
    const keysToCheck = [snp.markerId, snp.rsid, ...(snp.aliases || [])].filter(Boolean) as string[];
    let raw = '';
    for (const k of keysToCheck) {
      if (snpMap[k.toLowerCase()]) {
        raw = snpMap[k.toLowerCase()];
        break;
      }
    }

    if (!raw) {
      return [{ ...snp, status: 'not_tested' }];
    }
    
    // Count matches for the alleles of interest
    let matchCount = 0;
    for (const allele of snp.alleles) {
      for (const char of raw) {
        if (char === allele) matchCount++;
      }
    }
    
    // Check for direct interpretation or reversed allele interpretation
    let interpretation = snp.interpretations?.[raw];
    if (!interpretation && snp.interpretations && raw.length === 2) {
      const reversedRaw = raw[1] + raw[0];
      interpretation = snp.interpretations[reversedRaw];
    }
    
    const isMatched = matchCount > 0 || !!interpretation;
    
    if (!interpretation) {
      if (matchCount === 2) {
        interpretation = `Homozygous for the ${snp.alleles.join('/')} allele. You carry two copies of the variant associated with this trait.`;
      } else if (matchCount === 1) {
        interpretation = `Heterozygous for the ${snp.alleles.join('/')} allele. You carry one copy of the variant associated with this trait.`;
      } else {
        interpretation = `You do not carry the ${snp.alleles.join('/')} variant associated with this trait.`;
      }
      
      // Incorporate more detailed medical or ancestry information from SNP_DB
      if (snp.description) {
        interpretation += ` ${snp.description}`;
      }
    }
      
    return [{ ...snp, userGenotype: raw, interpretation, status: isMatched ? 'matched' : 'unmatched' }];
  });
}

export function groupByCategory(results: any[]) {
  const groups: Record<string, any[]> = {};
  for (const r of results) {
    if (!groups[r.category]) groups[r.category] = [];
    groups[r.category].push(r);
  }
  return groups;
}

export function groupByContinent(results: any[]) {
  const groups: Record<string, any[]> = {};
  for (const r of results) {
    if (!groups[r.continent]) groups[r.continent] = [];
    groups[r.continent].push(r);
  }
  return groups;
}

export function calculateAncestryOracle(results: any[], predictedYDNA?: any, predictedMtDNA?: any) {
  const scores: Record<string, number> = {};
  const subpopScores: Record<string, Record<string, number>> = {}; // continent -> subpop -> score
  let totalScore = 0;

  // Score autosomal ancestry SNPs
  const ancestrySnps = results.filter(r => r.category === 'Ancestry' && r.status === 'matched');
  for (const snp of ancestrySnps) {
    // Weight by significance
    let weight = 1;
    if (snp.significance === 'High') weight = 3;
    else if (snp.significance === 'Medium') weight = 2;

    // Split continents if they are combined (e.g., "East Asian / Native American")
    const continents = snp.continent.split('/').map((c: string) => c.trim());
    const pointsPerContinent = weight / continents.length;
    
    for (const continent of continents) {
      if (continent === 'Global' || continent === 'Universal') continue;
      scores[continent] = (scores[continent] || 0) + pointsPerContinent;
      totalScore += pointsPerContinent;

      // Sub-population scoring
      if (snp.subpop) {
        if (!subpopScores[continent]) subpopScores[continent] = {};
        subpopScores[continent][snp.subpop] = (subpopScores[continent][snp.subpop] || 0) + weight;
      }
    }
  }

  // Factor in Y-DNA Haplogroup (Heavy weight, e.g., 15 points)
  if (predictedYDNA && predictedYDNA.predicted && predictedYDNA.predicted.continent) {
    const ydnaContinents = predictedYDNA.predicted.continent.split('/').map((c: string) => c.trim());
    const ydnaPoints = 15 / ydnaContinents.length;
    
    for (const continent of ydnaContinents) {
      if (continent === 'Global' || continent === 'Universal') continue;
      scores[continent] = (scores[continent] || 0) + ydnaPoints;
      totalScore += ydnaPoints;
    }
  }

  // Factor in mtDNA Haplogroup (Heavy weight, e.g., 15 points)
  if (predictedMtDNA && predictedMtDNA.predicted) {
    const hg = predictedMtDNA.predicted.replace('Haplogroup ', '').charAt(0).toUpperCase();
    let mtContinents: string[] = [];
    
    switch (hg) {
      case 'L': mtContinents = ['African']; break;
      case 'H': case 'V': case 'U': case 'K': case 'I': case 'W': case 'X': 
        mtContinents = ['European', 'Middle Eastern']; break;
      case 'J': case 'T':
        mtContinents = ['Middle Eastern', 'European']; break;
      case 'M': case 'C': case 'D': case 'E': case 'G': case 'Z':
        mtContinents = ['East Asian', 'Asian']; break;
      case 'A': case 'B': 
        mtContinents = ['East Asian', 'Native American']; break;
      case 'S': case 'Y': case 'O': case 'P': case 'Q':
        mtContinents = ['Oceanian']; break;
      case 'F': 
        mtContinents = ['East Asian']; break;
      case 'N': case 'R': 
        mtContinents = ['European', 'Asian']; break;
    }

    if (mtContinents.length > 0) {
      const mtPoints = 15 / mtContinents.length;
      for (const continent of mtContinents) {
        scores[continent] = (scores[continent] || 0) + mtPoints;
        totalScore += mtPoints;
      }
    }
  }

  // Convert to percentages and sort
  let oracleResults = Object.entries(scores)
    .map(([continent, score]) => ({
      continent,
      score,
      percentage: totalScore > 0 ? (score / totalScore) * 100 : 0
    }))
    .filter(r => r.percentage > 0.5) // Filter out trace regions < 0.5%
    .sort((a, b) => b.percentage - a.percentage);

  // Normalize percentages to sum to 100% after filtering
  const filteredTotal = oracleResults.reduce((sum, r) => sum + r.percentage, 0);
  if (filteredTotal > 0 && filteredTotal < 100) {
    oracleResults.forEach(r => {
      r.percentage = (r.percentage / filteredTotal) * 100;
    });
  }

  // Process sub-populations
  const subPopulations: Record<string, { name: string, percentage: number }[]> = {};
  for (const [continent, pops] of Object.entries(subpopScores)) {
    const totalSubpopScore = Object.values(pops).reduce((a, b) => a + b, 0);
    subPopulations[continent] = Object.entries(pops)
      .map(([name, score]) => ({
        name,
        percentage: (score / totalSubpopScore) * 100
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }

  return {
    continents: oracleResults,
    subPopulations
  };
}

interface HaplogroupNode {
  branchName: string;
  snp: string | string[] | null;
  children?: HaplogroupNode[];
}

export const Y_DNA_TREE: HaplogroupNode = {
  branchName: "Y-DNA Root",
  snp: null,
  children: [
    {
      branchName: "Haplogroup A",
      snp: ["M91"],
      children: [
        { branchName: "Haplogroup A0", snp: ["P97"] },
        { branchName: "Haplogroup A1a", snp: ["M31"] },
        { branchName: "Haplogroup A1b", snp: ["P108"] },
        { branchName: "Haplogroup A2", snp: ["M6", "P28"] },
        { 
          branchName: "Haplogroup A3", 
          snp: ["M32"], 
          children: [
            { branchName: "Haplogroup A3a", snp: ["M28"] },
            { 
              branchName: "Haplogroup A3b", 
              snp: ["M220"], 
              children: [
                { branchName: "Haplogroup A3b1", snp: ["M51"] },
                { branchName: "Haplogroup A3b2", snp: ["M13", "M171"] }
              ] 
            }
          ] 
        }
      ]
    },
    {
      branchName: "Haplogroup B",
      snp: ["M60"],
      children: [
        {
          branchName: "Haplogroup B2",
          snp: ["M181"],
          children: [
            {
              branchName: "Haplogroup B2a",
              snp: ["M112"],
              children: [
                { branchName: "Haplogroup B2a1", snp: ["M115"] }
              ]
            },
            {
              branchName: "Haplogroup B2b",
              snp: ["P85", "P90"],
              children: [
                { branchName: "Haplogroup B2b1", snp: ["M150"] },
                { branchName: "Haplogroup B2b2", snp: ["M152"] }
              ]
            }
          ]
        }
      ]
    },
    {
      branchName: "Haplogroup C",
      snp: ["M130"],
      children: [
        { branchName: "Haplogroup C-P39", snp: ["P39"] },
        { branchName: "Haplogroup C2", snp: ["M217"] }
      ]
    },
    { branchName: "Haplogroup D", snp: ["M174"] },
    {
      branchName: "Haplogroup E",
      snp: ["M96", "P29"],
      children: [
        {
          branchName: "Haplogroup E1a",
          snp: ["M33"],
          children: [
            { branchName: "Haplogroup E1a1", snp: ["M132"] }
          ]
        },
        {
          branchName: "Haplogroup E1b1a",
          snp: ["M2"],
          children: [
            {
              branchName: "Haplogroup E1b1a1",
              snp: ["M180"],
              children: [
                {
                  branchName: "Haplogroup E1b1a1a1",
                  snp: ["U175"],
                  children: [
                    {
                      branchName: "Haplogroup E1b1a1a1a",
                      snp: ["U174"],
                      children: [
                        {
                          branchName: "Haplogroup E1b1a1a1a1",
                          snp: ["M191", "P86"],
                          children: [
                            { branchName: "Haplogroup E1b1a1a1a1a", snp: ["L485"] },
                            { branchName: "Haplogroup E1b1a1a1a2", snp: ["U290"] },
                            { branchName: "Haplogroup E1b1a1a1a3", snp: ["U181"] }
                          ]
                        }
                      ]
                    },
                    { branchName: "Haplogroup E1b1a1a1b", snp: ["M154"] }
                  ]
                },
                { branchName: "Haplogroup E1b1a1a2", snp: ["M58"] },
                { branchName: "Haplogroup E1b1a1a4", snp: ["M149"] },
                { branchName: "Haplogroup E1b1a1a5", snp: ["M155"] },
                { branchName: "Haplogroup E1b1a1a6", snp: ["M10"] },
                { branchName: "Haplogroup E1b1a1a7", snp: ["M200"] }
              ]
            }
          ]
        },
        { branchName: "Haplogroup E1b1a2", snp: ["V38"] },
        {
          branchName: "Haplogroup E1b1b",
          snp: ["M215"],
          children: [
            {
              branchName: "Haplogroup E1b1b1",
              snp: ["M35"],
              children: [
                {
                  branchName: "Haplogroup E1b1b1a",
                  snp: ["V68"],
                  children: [
                    { branchName: "Haplogroup E1b1b1a2", snp: ["V32"] },
                    { branchName: "Haplogroup E1b1b1a3", snp: ["V264"] }
                  ]
                },
                {
                  branchName: "Haplogroup E1b1b1a1",
                  snp: ["M78"],
                  children: [
                    { branchName: "Haplogroup E1b1b1a1a", snp: ["V12"] },
                    { branchName: "Haplogroup E1b1b1a1b", snp: ["V13"] },
                    { branchName: "Haplogroup E1b1b1a1c", snp: ["V22"] },
                    { branchName: "Haplogroup E1b1b1a1d", snp: ["V65"] }
                  ]
                },
                {
                  branchName: "Haplogroup E1b1b1b1",
                  snp: ["M81"],
                  children: [
                    { branchName: "Haplogroup E1b1b1b1a", snp: ["M107"] },
                    { branchName: "Haplogroup E1b1b1b1a1", snp: ["M183"] }
                  ]
                },
                {
                  branchName: "Haplogroup E1b1b1c",
                  snp: ["M123"],
                  children: [
                    { branchName: "Haplogroup E1b1b1c1", snp: ["M34"] }
                  ]
                },
                { branchName: "Haplogroup E1b1b1d", snp: ["M293"] },
                { branchName: "Haplogroup E1b1b1e", snp: ["M329"] }
              ]
            }
          ]
        },
        { branchName: "Haplogroup E1c", snp: ["M35.1", "P72"] },
        {
          branchName: "Haplogroup E2",
          snp: ["M75"],
          children: [
            { branchName: "Haplogroup E2a", snp: ["M54"] }
          ]
        }
      ]
    },
    {
      branchName: "Haplogroup G",
      snp: ["M201"],
      children: [
        { branchName: "Haplogroup G1", snp: ["M285"] },
        { branchName: "Haplogroup G2a", snp: ["P15"] }
      ]
    },
    { branchName: "Haplogroup H", snp: ["M69"] },
    {
      branchName: "Haplogroup I1",
      snp: ["M253"],
      children: [
        { branchName: "Haplogroup I1a", snp: ["DF29"] },
        { branchName: "Haplogroup I1b", snp: ["Z131"] },
        { branchName: "Haplogroup I1c", snp: ["Z17943"] }
      ]
    },
    {
      branchName: "Haplogroup J1",
      snp: ["M267"],
      children: [
        { branchName: "Haplogroup J1a", snp: ["Z2215"] },
        { branchName: "Haplogroup J1b", snp: ["Z2223"] },
        { branchName: "Haplogroup J1a2a1a2", snp: ["P58"] }
      ]
    },
    {
      branchName: "Haplogroup J2",
      snp: ["M172"],
      children: [
        { branchName: "Haplogroup J2a", snp: ["M410"] },
        { branchName: "Haplogroup J2b", snp: ["M102"] }
      ]
    },
    { branchName: "Haplogroup K", snp: ["M9"] },
    {
      branchName: "Haplogroup M",
      snp: ["P256", "M4"],
      children: [
        { branchName: "Haplogroup M subclade", snp: ["M5"] },
        {
          branchName: "Haplogroup M1",
          snp: ["M106", "M186", "M189"],
          children: [
            { branchName: "Haplogroup M1b", snp: ["M104"] }
          ]
        }
      ]
    },
    {
      branchName: "Haplogroup N",
      snp: ["M231"],
      children: [
        { branchName: "Haplogroup N1a1", snp: ["M46"] }
      ]
    },
    {
      branchName: "Haplogroup O",
      snp: ["M175"],
      children: [
        { branchName: "Haplogroup O1a", snp: ["M119"] },
        { branchName: "Haplogroup O1b", snp: ["M268"] },
        { branchName: "Haplogroup O2", snp: ["M122"] }
      ]
    },
    { branchName: "Haplogroup P", snp: ["M45"] },
    {
      branchName: "Haplogroup Q",
      snp: ["M242"],
      children: [
        { branchName: "Haplogroup Q1", snp: ["L232"] },
        { branchName: "Haplogroup Q1a", snp: ["MEH2"] },
        { branchName: "Haplogroup Q-M3", snp: ["M3"] },
        { branchName: "Haplogroup Q1b", snp: ["L275"] }
      ]
    },
    { branchName: "Haplogroup R1a", snp: ["M17"] },
    {
      branchName: "Haplogroup R1b",
      snp: ["M343"],
      children: [
        { branchName: "Haplogroup R1b1", snp: ["L278"] },
        {
          branchName: "Haplogroup R1b1a",
          snp: ["L754"],
          children: [
            {
              branchName: "Haplogroup R1b1a1b",
              snp: ["M269"],
              children: [
                { branchName: "Haplogroup R1b1a1b1a1a", snp: ["U106"] },
                {
                  branchName: "Haplogroup R1b1a1b1a2",
                  snp: ["P312"],
                  children: [
                    { branchName: "Haplogroup R1b1a1b1a2a", snp: ["DF27"] },
                    { branchName: "Haplogroup R1b1a1b1a2b", snp: ["U152"] },
                    { branchName: "Haplogroup R1b1a1b1a2c", snp: ["L21"] }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    { branchName: "Haplogroup S", snp: ["M230"] },
    { branchName: "Haplogroup T", snp: ["M184"] }
  ]
};

function predictHaplogroup(userSNPs: string[], currentNode: HaplogroupNode): HaplogroupNode {
  let deepestMatch = currentNode;

  if (currentNode.children && currentNode.children.length > 0) {
    for (let child of currentNode.children) {
      const isMatch = Array.isArray(child.snp) 
        ? child.snp.some(s => userSNPs.includes(s))
        : child.snp && userSNPs.includes(child.snp);

      if (isMatch) {
        deepestMatch = predictHaplogroup(userSNPs, child);
        break; 
      }
    }
  }

  return deepestMatch;
}

export function predictYDNAHaplogroup(snpMap: Record<string, string>) {
  const ydnaSnps = SNP_DB.filter(s => s.gene === 'Y-DNA');
  const detectedMarkers = [];
  const userSNPs: string[] = [];

  for (const snp of ydnaSnps) {
    // Check markerId, rsid, and aliases
    const keysToCheck = [snp.markerId, snp.rsid, ...(snp.aliases || [])].filter(Boolean) as string[];
    
    for (const key of keysToCheck) {
      const genotype = snpMap[key.toLowerCase()];
      if (genotype) {
        // Simple heuristic: if it contains any of the derived alleles, it's derived.
        // For Y-DNA, genotypes are often single letters (e.g., 'T', 'C').
        const isDerived = snp.alleles.some(a => genotype.includes(a));
        
        detectedMarkers.push({
          marker: snp.markerId,
          trait: snp.trait,
          genotype,
          isDerived,
          description: snp.description
        });
        
        if (isDerived) {
          userSNPs.push(snp.markerId);
        }
        break; // Found this SNP, no need to check other aliases
      }
    }
  }

  const deepestNode = predictHaplogroup(userSNPs, Y_DNA_TREE);
  let bestMatch = null;

  if (deepestNode.branchName !== "Y-DNA Root") {
    const primarySnp = Array.isArray(deepestNode.snp) ? deepestNode.snp[0] : deepestNode.snp;
    const matchedSnp = ydnaSnps.find(s => s.markerId === primarySnp);

    bestMatch = {
      name: deepestNode.branchName.replace('Haplogroup ', '').replace(' (root)', '').replace(' (root, co-listed)', ''),
      description: matchedSnp ? matchedSnp.description : '',
      marker: primarySnp as string,
      continent: matchedSnp ? matchedSnp.continent : 'Unknown'
    };
  }

  return {
    predicted: bestMatch,
    testedMarkers: detectedMarkers
  };
}

export const MT_DNA_TREE = {
  branchName: "mtDNA Root (Mitochondrial Eve)",
  mutations: [], // The root doesn't require any mutations
  children: [
    {
      branchName: "Haplogroup L0",
      mutations: ["A263G", "A750G", "A1438G", "A2706G", "A4769G", "C7028T", "A8860G", "G11719A", "C14766T", "G15326A", "G16230A"],
      children: [
        {
          branchName: "Haplogroup L0a",
          mutations: ["C16223T", "C16292T", "T16311C", "T16362C", "A2789G", "C7175T", "T10664C", "C10915T", "A16129G", "T16187C", "C16189T", "T16230C", "T16278C", "C16311T"],
          children: [
            {
              branchName: "Haplogroup L0a1",
              mutations: ["A285G", "A5601G", "A10589G", "T12722C", "C16223T", "T16278C", "C16294T", "T16311C"],
              children: []
            },
            {
              branchName: "Haplogroup L0a2",
              mutations: ["C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
              children: []
            }
          ]
        },
        {
          branchName: "Haplogroup L0d",
          mutations: ["C16223T", "T16311C", "C16327T", "C16189T", "C16278T", "C16294T", "T16362C"],
          children: [
            {
              branchName: "Haplogroup L0d1",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
              children: []
            },
            {
              branchName: "Haplogroup L0d2",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
              children: []
            }
          ]
        },
        {
          branchName: "Haplogroup L0k",
          mutations: ["C16223T", "T16311C", "G16129A", "C16189T", "C16278T", "C16294T", "T16362C"],
          children: []
        }
      ]
    },
    {
      branchName: "Haplogroup L1",
      mutations: ["C3516A", "C5442T", "C8251T", "C9042T", "T9575C", "A10589G", "T10664C", "A10688G", "A10810C", "C10915T", "A11914G", "C13276T", "A16223G", "T16278C", "C16362T"],
      children: [
        {
          branchName: "Haplogroup L1b",
          mutations: ["A16124G", "C16187T", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
          children: [
            {
              branchName: "Haplogroup L1b1",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
              children: []
            }
          ]
        },
        {
          branchName: "Haplogroup L1c",
          mutations: ["C16129T", "C16187T", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
          children: [
            {
              branchName: "Haplogroup L1c1",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
              children: []
            },
            {
              branchName: "Haplogroup L1c2",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
              children: []
            },
            {
              branchName: "Haplogroup L1c3",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C", "A16265G"],
              children: []
            }
          ]
        }
      ]
    },
    {
      branchName: "Haplogroup L2",
      mutations: ["T152C", "A235G", "G247A", "C5250T", "A8206G", "T9086C", "A10115G", "C11944T", "A13590G", "A13803G", "T16278C", "T16311C"],
      children: [
        {
          branchName: "Haplogroup L2a",
          mutations: ["T16223C", "C16278T", "C16294T", "T16309C", "T16390C", "C16189T", "T16311C", "T16362C"],
          children: [
            {
              branchName: "Haplogroup L2a1",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
              children: [
                {
                  branchName: "Haplogroup L2a1a",
                  mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
                  children: []
                },
                {
                  branchName: "Haplogroup L2a1b",
                  mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C", "A16265G"],
                  children: []
                }
              ]
            }
          ]
        },
        {
          branchName: "Haplogroup L2b",
          mutations: ["C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
          children: [
            {
              branchName: "Haplogroup L2b1",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
              children: []
            }
          ]
        },
        {
          branchName: "Haplogroup L2c",
          mutations: ["T16223C", "C16278T", "C16294T", "T16311C", "A16265G", "C16189T", "T16362C"],
          children: []
        }
      ]
    },
    {
      branchName: "Haplogroup L3",
      mutations: ["A769G", "A1018G", "C16311T"],
      children: [
        {
          branchName: "Haplogroup L3b",
          mutations: ["T16223C", "C16278T", "C16311T", "T16124C", "C16189T", "C16294T", "T16362C"],
          children: [
            {
              branchName: "Haplogroup L3b1",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
              children: [
                {
                  branchName: "Haplogroup L3b1a",
                  mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
                  children: []
                }
              ]
            }
          ]
        },
        {
          branchName: "Haplogroup L3d",
          mutations: ["T16223C", "C16278T", "C16311T", "C16124T", "C16189T", "C16294T", "T16362C"],
          children: [
            {
              branchName: "Haplogroup L3d1",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
              children: []
            }
          ]
        },
        {
          branchName: "Haplogroup L3e",
          mutations: ["T16223C", "C16278T", "C16327T", "T16223C", "C16189T", "C16294T", "T16311C", "T16362C"],
          children: [
            {
              branchName: "Haplogroup L3e1",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
              children: []
            },
            {
              branchName: "Haplogroup L3e2",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
              children: [
                {
                  branchName: "Haplogroup L3e2b",
                  mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C", "A16265G"],
                  children: []
                }
              ]
            }
          ]
        },
        {
          branchName: "Haplogroup L3f",
          mutations: ["T16223C", "C16292T", "C16311T", "T16209C", "C16189T", "C16278T", "C16294T", "T16362C"],
          children: [
            {
              branchName: "Haplogroup L3f1",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
              children: [
                {
                  branchName: "Haplogroup L3f1b",
                  mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
                  children: []
                }
              ]
            }
          ]
        },
        {
          branchName: "Haplogroup M",
          mutations: ["C10400T", "T14783C", "G15043A", "T489C"],
          children: [
            {
              branchName: "Haplogroup C",
              mutations: ["T489C", "C10400T", "T14783C", "G15043A", "249d", "290d", "291d", "A3256T", "T11914A", "T14318C", "C16327T"],
              children: []
            },
            {
              branchName: "Haplogroup D",
              mutations: ["T489C", "C10400T", "T14783C", "G15043A", "T4883C", "G5178A", "T16362C"],
              children: [
                {
                  branchName: "Haplogroup D4",
                  mutations: ["C3010A"],
                  children: []
                },
                {
                  branchName: "Haplogroup D5",
                  mutations: ["T16189C"],
                  children: []
                }
              ]
            },
            {
              branchName: "Haplogroup G",
              mutations: ["T489C", "C10400T", "T14783C", "G15043A", "A709G", "T4833C", "T5108C", "A16017G"],
              children: []
            },
            {
              branchName: "Haplogroup Z",
              mutations: ["T489C", "C10400T", "T14783C", "G15043A", "C152T", "A4248G", "C6752T", "T8020C", "T16185C", "C16260T"],
              children: []
            },
            {
              branchName: "Haplogroup E",
              mutations: ["G7598A", "G10817A", "T16390C"],
              children: []
            },
            {
              branchName: "Haplogroup Q",
              mutations: ["A16148G", "G16230A", "T16278C"],
              children: []
            },
            {
              branchName: "Haplogroup M7",
              mutations: ["A9824G"],
              children: []
            },
            {
              branchName: "Haplogroup M8",
              mutations: ["C4715T"],
              children: []
            },
            {
              branchName: "Haplogroup M9",
              mutations: ["E3394C"],
              children: []
            }
          ]
        },
        {
          branchName: "Haplogroup N",
          mutations: ["G8701A", "C9540T", "A10398G", "T10873C", "G15301A"],
          children: [
            {
              branchName: "Haplogroup A",
              mutations: ["C152T", "A235G", "A663G", "A1736G", "T4248C", "A4824G", "C8794T", "C16290T", "G16319A"],
              children: [
                {
                  branchName: "Haplogroup A1",
                  mutations: ["C16223T", "C16290T", "G16319A", "T16362C", "C16189T", "C16278T", "C16294T"],
                  children: []
                },
                {
                  branchName: "Haplogroup A2",
                  mutations: ["A16111T", "C16223T", "C16290T", "G16319A", "T16362C", "C16189T", "C16278T", "C16294T"],
                  children: [
                    {
                      branchName: "Haplogroup A2a",
                      mutations: ["C3330T", "A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
                      children: []
                    },
                    {
                      branchName: "Haplogroup A2b",
                      mutations: ["G11365A", "A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
                      children: []
                    },
                    {
                      branchName: "Haplogroup A2c",
                      mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C", "A16265G"],
                      children: []
                    }
                  ]
                },
                {
                  branchName: "Haplogroup A3",
                  mutations: ["C16223T", "C16290T", "G16319A", "T16362C", "C16189T", "C16278T", "C16294T", "T16311C"],
                  children: []
                },
                {
                  branchName: "Haplogroup A4",
                  mutations: ["T16362C", "T16223C", "C16290T", "G16319A", "C16189T", "C16278T", "C16294T"],
                  children: [
                    {
                      branchName: "Haplogroup A4a",
                      mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
                      children: []
                    }
                  ]
                },
                {
                  branchName: "Haplogroup A5",
                  mutations: ["C16223T", "C16290T", "G16319A", "T16362C", "C16189T", "C16278T", "C16294T", "T16311C", "A16265G"],
                  children: []
                }
              ]
            },
            {
              branchName: "Haplogroup I",
              mutations: ["A16391G", "G16129A", "T16187C", "C16189T"],
              children: []
            },
            {
              branchName: "Haplogroup S",
              mutations: ["T16189C", "C16228T"],
              children: []
            },
            {
              branchName: "Haplogroup Y",
              mutations: ["C16231T", "A16266G", "T16325C"],
              children: []
            },
            {
              branchName: "Haplogroup O",
              mutations: ["G16213A", "C16222T", "A16293G"],
              children: []
            },
            {
              branchName: "Haplogroup W",
              mutations: ["T1243C", "A3505G", "G8994A", "A11947G", "T15884C", "C16292T"],
              children: []
            },
            {
              branchName: "Haplogroup X",
              mutations: ["A153G", "T6221C", "C6371T", "A13966G", "T14470C", "T16189C", "C16278T"],
              children: []
            },
            {
              branchName: "Haplogroup R",
              mutations: ["T12705C", "T16223C"],
              children: [
                {
                  branchName: "Haplogroup F",
                  mutations: ["T16304C", "C16223T"],
                  children: [
                    {
                      branchName: "Haplogroup F1",
                      mutations: ["A16162G"],
                      children: []
                    },
                    {
                      branchName: "Haplogroup F2",
                      mutations: ["T16304C"],
                      children: []
                    }
                  ]
                },
                {
                  branchName: "Haplogroup P",
                  mutations: ["C16176T", "A16265G"],
                  children: []
                },
                {
                  branchName: "Haplogroup B",
                  mutations: ["8281-8289d", "A16189C", "T16217C"],
                  children: [
                    {
                      branchName: "Haplogroup B4",
                      mutations: ["T16217C"],
                      children: []
                    },
                    {
                      branchName: "Haplogroup B5",
                      mutations: ["A16183C"],
                      children: []
                    }
                  ]
                },
                {
                  branchName: "Haplogroup U",
                  mutations: ["A11467G", "A12308G", "G12372A"],
                  children: [
                    {
                      branchName: "Haplogroup U1",
                      mutations: ["A12870G"],
                      children: []
                    },
                    {
                      branchName: "Haplogroup U3",
                      mutations: ["A16343G"],
                      children: []
                    },
                    {
                      branchName: "Haplogroup U7",
                      mutations: ["A16318T"],
                      children: []
                    },
                    {
                      branchName: "Haplogroup K",
                      mutations: ["A1189C", "A3480G", "G9055A", "A10398G", "A10550G", "T11299C", "T14798C", "T16224C", "C16311T"],
                      children: [
                        {
                          branchName: "Haplogroup K1a",
                          mutations: ["T1189C"],
                          children: []
                        }
                      ]
                    }
                  ]
                },
                {
                  branchName: "Haplogroup JT",
                  mutations: ["T3394C", "T4216C", "G13708A", "G15452A", "T16126C"],
                  children: [
                    {
                      branchName: "Haplogroup J",
                      mutations: ["C295T", "T489C", "A10398G", "A12612G", "G13708A", "C16069T"],
                      children: [
                        {
                          branchName: "Haplogroup J1",
                          mutations: ["T16126C"],
                          children: []
                        },
                        {
                          branchName: "Haplogroup J2",
                          mutations: ["T16069C"],
                          children: []
                        }
                      ]
                    },
                    {
                      branchName: "Haplogroup T",
                      mutations: ["G709A", "G1888A", "A4917G", "G8697A", "T10463C", "G11812A", "G13368A", "T14233C", "G14905A", "A15607G", "G15928A", "C16294T"],
                      children: [
                        {
                          branchName: "Haplogroup T1",
                          mutations: ["A16126G"],
                          children: []
                        },
                        {
                          branchName: "Haplogroup T2",
                          mutations: ["A11812G"],
                          children: []
                        }
                      ]
                    }
                  ]
                },
                {
                  branchName: "Haplogroup HV",
                  mutations: ["T14766C"],
                  children: [
                    {
                      branchName: "Haplogroup H",
                      mutations: ["G2706A", "T7028C"],
                      children: [
                        {
                          branchName: "Haplogroup H1",
                          mutations: ["G3010A"],
                          children: [
                            {
                              branchName: "Haplogroup H1a",
                              mutations: ["T73A", "C16162T"],
                              children: []
                            },
                            {
                              branchName: "Haplogroup H1b",
                              mutations: ["T16189C", "T16356C"],
                              children: []
                            },
                            {
                              branchName: "Haplogroup H1c",
                              mutations: ["T477C"],
                              children: []
                            }
                          ]
                        },
                        {
                          branchName: "Haplogroup H2",
                          mutations: ["A1438G", "A4769G"],
                          children: [
                            {
                              branchName: "Haplogroup H2a",
                              mutations: ["A4769G"],
                              children: [
                                {
                                  branchName: "Haplogroup H2a1",
                                  mutations: ["G16153A"],
                                  children: []
                                },
                                {
                                  branchName: "Haplogroup H2a2",
                                  mutations: ["C750T"],
                                  children: [
                                    {
                                      branchName: "Haplogroup H2a2a",
                                      mutations: ["T16235C"],
                                      children: []
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        {
                          branchName: "Haplogroup H3",
                          mutations: ["T6776C"],
                          children: []
                        },
                        {
                          branchName: "Haplogroup H4",
                          mutations: ["T3992C", "A5004G", "G9123A"],
                          children: [
                            {
                              branchName: "Haplogroup H4a",
                              mutations: ["T4024C"],
                              children: []
                            }
                          ]
                        },
                        {
                          branchName: "Haplogroup H5",
                          mutations: ["T4336C"],
                          children: [
                            {
                              branchName: "Haplogroup H5a",
                              mutations: ["C16304T"],
                              children: []
                            }
                          ]
                        },
                        {
                          branchName: "Haplogroup H6",
                          mutations: ["T239C", "T16362C", "G16482A"],
                          children: [
                            {
                              branchName: "Haplogroup H6a",
                              mutations: ["T3394C"],
                              children: []
                            }
                          ]
                        },
                        {
                          branchName: "Haplogroup H7",
                          mutations: ["A4793G"],
                          children: []
                        },
                        {
                          branchName: "Haplogroup H10",
                          mutations: ["T73A"],
                          children: []
                        },
                        {
                          branchName: "Haplogroup H11",
                          mutations: ["T8448C"],
                          children: [
                            {
                              branchName: "Haplogroup H11a",
                              mutations: ["C16293T"],
                              children: []
                            }
                          ]
                        },
                        {
                          branchName: "Haplogroup H13",
                          mutations: ["G14872A"],
                          children: [
                            {
                              branchName: "Haplogroup H13a",
                              mutations: ["T2259C"],
                              children: []
                            }
                          ]
                        },
                        {
                          branchName: "Haplogroup H14",
                          mutations: ["T7645C"],
                          children: []
                        },
                        {
                          branchName: "Haplogroup H20",
                          mutations: ["C16218T"],
                          children: []
                        }
                      ]
                    },
                    {
                      branchName: "Haplogroup V",
                      mutations: ["G4580A", "A7256T", "C15904T", "T16298C"],
                      children: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      branchName: "Haplogroup L4",
      mutations: ["A16293G", "C16264T", "T195C"],
      children: []
    },
    {
      branchName: "Haplogroup L5",
      mutations: ["C16222T", "T16286C", "A16293G"],
      children: []
    },
    {
      branchName: "Haplogroup L6",
      mutations: ["G16213A", "C16222T", "A16293G"],
      children: []
    }
  ]
};

/**
 * Walks down the mtDNA tree to find the deepest matching maternal branch.
 * @param {Array} userMutations - Array of the user's mtDNA mutations (e.g., ["A769G", "G2706A"])
 * @param {Object} currentNode - The current branch of the tree
 * @returns {Array} - All nodes in the tree with their calculated scores
 */
export function predictMtHaplogroup(userMutations: string[], currentNode: any, currentPath: string[] = [], currentScore: number = 0): any[] {
  const matches = (currentNode.mutations || []).filter((m: string) => userMutations.includes(m)).length;
  const newScore = currentScore + matches;
  const newPath = [...currentPath, currentNode.branchName];
  
  let results = [{
    name: currentNode.branchName,
    score: newScore,
    path: newPath,
    matchCount: matches
  }];

  if (currentNode.children) {
    for (const child of currentNode.children) {
      results = results.concat(predictMtHaplogroup(userMutations, child, newPath, newScore));
    }
  }

  return results;
}

export function analyzeMtDNA(mtMap: Record<string, string>) {
  // Extract all possible mutations from the tree
  const allMutations = new Set<string>();
  function extractMutations(node: any) {
    if (node.mutations) {
      node.mutations.forEach((m: string) => allMutations.add(m));
    }
    if (node.children) {
      node.children.forEach((child: any) => extractMutations(child));
    }
  }
  extractMutations(MT_DNA_TREE);

  // Check which mutations the user has
  const userMutations: string[] = [];
  const testedMarkers: { mutation: string, pos: string, derived: string, ancestral: string, status: 'derived' | 'ancestral' }[] = [];
  
  allMutations.forEach(mutation => {
    // Mutation format is like "A769G" (Ancestral + Pos + Derived)
    // Some mutations might be like "8281-8289d" (deletion)
    if (mutation.includes('d')) {
      // For deletions, we'll just check if the user has a dash or something
      // This is a bit simplified for now
      return;
    }

    const ancestral = mutation[0];
    const derived = mutation.slice(-1);
    const pos = mutation.slice(1, -1);
    
    const userAllele = mtMap[pos];
    
    if (userAllele === derived) {
      userMutations.push(mutation);
      testedMarkers.push({ mutation, pos, derived, ancestral, status: 'derived' });
    } else if (userAllele === ancestral) {
      testedMarkers.push({ mutation, pos, derived, ancestral, status: 'ancestral' });
    }
  });

  const allResults = predictMtHaplogroup(userMutations, MT_DNA_TREE);
  
  // Sort by score (total matches in path) descending, then by path length (specificity) descending
  allResults.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.path.length - a.path.length;
  });

  const bestMatch = allResults[0];
  const predictedHaplogroup = bestMatch.name;
  
  return {
    predicted: predictedHaplogroup !== "mtDNA Root (Mitochondrial Eve)" ? predictedHaplogroup : null,
    path: predictedHaplogroup !== "mtDNA Root (Mitochondrial Eve)" ? bestMatch.path : [],
    testedMarkers,
    userMutations,
    score: bestMatch.score
  };
}
