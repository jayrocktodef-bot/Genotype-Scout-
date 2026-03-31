export interface SNP {
  rsid: string;
  gene: string;
  trait: string;
  continent: string;
  description: string;
  alleles: string[];
  significance: 'High' | 'Medium' | 'Low';
  category: 'Health' | 'Ancestry' | 'Lifestyle' | 'Nutrition' | 'Performance';
  interpretations?: Record<string, string>;
  referenceUrl?: string;
}

export const SNP_DB: SNP[] = [
  // --- Health & Metabolism ---
  { 
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
  { rsid: 'rs1801282', gene: 'PPARG', trait: 'Insulin Sensitivity', continent: 'Global', category: 'Health', significance: 'Medium', alleles: ['G'], description: 'Affects how the body responds to insulin and manages blood sugar.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1801282' },
  { rsid: 'rs1042713', gene: 'ADRB2', trait: 'Exercise Response', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['G'], description: 'Influences airway reactivity and response to certain asthma medications.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1042713' },
  { rsid: 'rs1800795', gene: 'IL6', trait: 'Inflammation Levels', continent: 'Global', category: 'Health', significance: 'Medium', alleles: ['C'], description: 'A marker for systemic inflammation and immune response.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1800795' },

  // --- Ancestry & Physical ---
  { rsid: 'rs1229984', gene: 'ADH1B', trait: 'Alcohol Metabolism', continent: 'East Asian / Native American', category: 'Ancestry', significance: 'High', alleles: ['A'], description: 'Associated with rapid breakdown of alcohol into acetaldehyde.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1229984' },
  { rsid: 'rs17822931', gene: 'ABCC11', trait: 'Earwax & Body Odor', continent: 'East Asian / Native American', category: 'Ancestry', significance: 'Medium', alleles: ['A'], description: 'Determines dry vs. wet earwax and presence of specific body odors.', referenceUrl: 'https://www.snpedia.com/index.php/Rs17822931' },
  { rsid: 'rs16891982', gene: 'SLC45A2', trait: 'Skin Pigmentation', continent: 'East Asian / Native American', category: 'Ancestry', significance: 'Low', alleles: ['G'], description: 'Influences variations in skin, hair, and eye pigmentation.', referenceUrl: 'https://www.snpedia.com/index.php/Rs16891982' },
  { 
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
  { rsid: 'rs762551', gene: 'CYP1A2', trait: 'Caffeine Metabolism', continent: 'Global', category: 'Lifestyle', significance: 'Medium', alleles: ['A'], description: 'Determines if you are a "Fast" or "Slow" caffeine metabolizer.', referenceUrl: 'https://www.snpedia.com/index.php/Rs762551' },
  { rsid: 'rs767649', gene: 'ADORA2A', trait: 'Caffeine Sensitivity', continent: 'Global', category: 'Lifestyle', significance: 'Medium', alleles: ['T'], description: 'Relates to caffeine-induced anxiety and sleep disruption.', referenceUrl: 'https://www.snpedia.com/index.php/Rs767649' },
  { rsid: 'rs2282679', gene: 'GC', trait: 'Vitamin D Levels', continent: 'Global', category: 'Nutrition', significance: 'Medium', alleles: ['G'], description: 'Influences the transport and binding of Vitamin D in the blood.', referenceUrl: 'https://www.snpedia.com/index.php/Rs2282679' },
  { rsid: 'rs602662', gene: 'FUT2', trait: 'Vitamin B12 Absorption', continent: 'Global', category: 'Nutrition', significance: 'Low', alleles: ['A'], description: 'Affects how efficiently your gut absorbs Vitamin B12.', referenceUrl: 'https://www.snpedia.com/index.php/Rs602662' },
  { rsid: 'rs7501331', gene: 'BCMO1', trait: 'Vitamin A Conversion', continent: 'Global', category: 'Nutrition', significance: 'Medium', alleles: ['T'], description: 'Affects conversion of Beta-Carotene to active Vitamin A.', referenceUrl: 'https://www.snpedia.com/index.php/Rs7501331' },

  // --- Physical Performance ---
  { rsid: 'rs1815739', gene: 'ACTN3', trait: 'Muscle Fiber Type', continent: 'Global', category: 'Performance', significance: 'High', alleles: ['C'], description: 'Presence indicates "Fast-Twitch" muscle fibers common in sprinters.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1815739' },
  { rsid: 'rs1801260', gene: 'CLOCK', trait: 'Circadian Rhythm', continent: 'Global', category: 'Lifestyle', significance: 'Low', alleles: ['G'], description: 'Influences whether you are naturally a morning person or night owl.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1801260' },
  { 
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
  { rsid: 'rs1805007', gene: 'MC1R', trait: 'Red hair, fair skin', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1805007' },
  { rsid: 'rs1805008', gene: 'MC1R', trait: 'Red hair, increased melanoma risk', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1805008' },
  { rsid: 'rs11547464', gene: 'MC1R', trait: 'Fair skin, freckles', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs11547464' },
  { rsid: 'rs12913832', gene: 'HERC2/OCA2', trait: 'Blue vs. brown eyes', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs12913832' },
  { rsid: 'rs1667394', gene: 'OCA2', trait: 'Eye color', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1667394' },
  { rsid: 'rs1426654', gene: 'SLC24A5', trait: 'Lighter skin (European vs. African)', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1426654' },
  { rsid: 'rs885479', gene: 'MC1R', trait: 'Red hair', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs885479' },
  { rsid: 'rs6119471', gene: 'ASIP', trait: 'Hair/skin color', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs6119471' },
  { rsid: 'rs2228479', gene: 'MC1R', trait: 'Hair color modifier', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs2228479' },
  { rsid: 'rs11803731', gene: 'TCHH', trait: 'Hair straightness', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs11803731' },
  { rsid: 'rs17646946', gene: 'FRAS1', trait: 'Hair color', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs17646946' },
  { rsid: 'rs4959270', gene: 'EXOC2', trait: 'Hair color', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs4959270' },
  { rsid: 'rs12821256', gene: 'KITLG', trait: 'Blond hair', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs12821256' },
  { rsid: 'rs2378249', gene: 'PRSS53', trait: 'Hair curl', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs2378249' },
  { rsid: 'rs1556547', gene: 'WNT10A', trait: 'Sparse/patterned hair', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1556547' },
  { rsid: 'rs9939609', gene: 'FTO', trait: 'Obesity / BMI', continent: 'Global', category: 'Nutrition', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs9939609' },
  { rsid: 'rs7903146', gene: 'TCF7L2', trait: 'Type 2 diabetes', continent: 'Global', category: 'Nutrition', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs7903146' },
  { rsid: 'rs1801131', gene: 'MTHFR', trait: 'Folate/homocysteine levels', continent: 'Global', category: 'Nutrition', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1801131' },
  { rsid: 'rs182549', gene: 'MCM6', trait: 'Lactose tolerance', continent: 'Global', category: 'Nutrition', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs182549' },
  { rsid: 'rs1761667', gene: 'CD36', trait: 'Fat taste sensitivity', continent: 'Global', category: 'Nutrition', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1761667' },
  { rsid: 'rs713598', gene: 'TAS2R38', trait: 'Bitter taste perception (PTC)', continent: 'Global', category: 'Nutrition', significance: 'Low', alleles: ['C', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs713598' },
  { rsid: 'rs10246939', gene: 'TAS2R38', trait: 'Bitter taste', continent: 'Global', category: 'Nutrition', significance: 'Low', alleles: ['C', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs10246939' },
  { rsid: 'rs1799853', gene: 'CYP2C9', trait: 'Warfarin metabolism', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1799853' },
  { rsid: 'rs1057910', gene: 'CYP2C9', trait: 'Warfarin sensitivity', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'C'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1057910' },
  { rsid: 'rs9923231', gene: 'VKORC1', trait: 'Warfarin dosing', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs9923231' },
  { rsid: 'rs1800562', gene: 'HFE', trait: 'Hereditary hemochromatosis', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['C', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1800562' },
  { rsid: 'rs1800497', gene: 'ANKK1/DRD2', trait: 'Dopamine signaling, cardiovascular risk', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1800497' },
  { rsid: 'rs5186', gene: 'AGTR1', trait: 'Hypertension risk', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'C'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs5186' },
  { rsid: 'rs3340', gene: 'PTC', trait: 'African vs. non-African', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs3340' },
  { rsid: 'rs1042602', gene: 'TYR', trait: 'European vs. non-European', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['C', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1042602' },
  { rsid: 'rs2816030', gene: 'SLC24A5', trait: 'South Asian ancestry', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs2816030' },
  { rsid: 'rs1800404', gene: 'OCA2', trait: 'European/Asian differentiation', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1800404' },
  { rsid: 'rs4833103', gene: 'None', trait: 'African ancestry', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs4833103' },
  { rsid: 'rs10954737', gene: 'IRF5', trait: 'European ancestry', continent: 'Global', category: 'Ancestry', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs10954737' },
  { rsid: 'rs4244285', gene: 'CYP2C19', trait: 'Clopidogrel/PPI metabolism', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs4244285' },
  { rsid: 'rs4986893', gene: 'CYP2C19', trait: 'Poor metabolizer', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs4986893' },
  { rsid: 'rs28399504', gene: 'CYP2C19', trait: 'Ultra-rapid metabolizer', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs28399504' },
  { rsid: 'rs3892097', gene: 'CYP2D6', trait: 'Codeine/antidepressant metabolism', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs3892097' },
  { rsid: 'rs1065852', gene: 'CYP2D6', trait: 'Drug metabolism', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1065852' },
  { rsid: 'rs1799945', gene: 'HFE', trait: 'Hemochromatosis (H63D)', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs1799945' },
  { rsid: 'rs121912172', gene: 'BRCA2', trait: 'Breast/ovarian cancer risk', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs121912172' },
  { rsid: 'rs2187668', gene: 'HLA-DQA1', trait: 'Celiac disease', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['A', 'G'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs2187668' },
  { rsid: 'rs7775228', gene: 'HLA-C', trait: 'Psoriasis', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs7775228' },
  { rsid: 'rs2476601', gene: 'PTPN22', trait: 'Autoimmune disease', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['C', 'T'], description: '', referenceUrl: 'https://www.snpedia.com/index.php/Rs2476601' },
  { rsid: 'rs1049353', gene: 'ARMS2', trait: 'Age-related macular degeneration', continent: 'Global', category: 'Health', significance: 'Medium', alleles: ['T'], description: 'Associated with increased risk of age-related macular degeneration.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1049353' },
  { rsid: 'rs1045587', gene: 'ABCB1', trait: 'P-glycoprotein function', continent: 'Global', category: 'Health', significance: 'Low', alleles: ['T'], description: 'Influences the function of P-glycoprotein, affecting drug transport.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1045587' },
  { rsid: 'rs1799983', gene: 'NOS3', trait: 'Cardiovascular risk', continent: 'Global', category: 'Health', significance: 'Medium', alleles: ['G'], description: 'Associated with nitric oxide production and cardiovascular health.', referenceUrl: 'https://www.snpedia.com/index.php/Rs1799983' }
];

export const CONTINENT_META = {
  "African":                      {color:"#E8A838",icon:"🌍"},
  "East Asian":                   {color:"#E84B4B",icon:"🌏"},
  "European":                     {color:"#4B8BE8",icon:"🌍"},
  "Universal":                    {color:"#4BE8B8",icon:"🌐"},
  "Native American":              {color:"#C25C1A",icon:"🌎"},
  "Global":                       {color:"#4BE8B8",icon:"🌐"},
  "East Asian / Native American": {color:"#C25C1A",icon:"🌎"},
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
  let format = "Unknown";
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;
    
    // Split by tabs, commas, or multiple spaces
    const parts = trimmedLine.split(/[\t, ]+/);
    
    // Basic validation: rsid must be at index 0 and look like rs...
    if (parts.length < 4) continue;
    const rsid = parts[0].trim().toLowerCase();
    if (!rsid.match(/^rs\d+$/)) continue; 
    
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
      snpMap[rsid] = genotype;
    }
  }
  return { snpMap, format };
}

export function matchSNPs(snpMap: Record<string, string>) {
  const seen = new Set();
  return SNP_DB.flatMap(snp => {
    const key = snp.rsid + snp.continent;
    if (seen.has(key)) return [];
    seen.add(key);
    
    const raw = snpMap[snp.rsid.toLowerCase()];
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
    
    const isMatched = matchCount > 0 || (snp.interpretations && snp.interpretations[raw]);
    
    const interpretation = snp.interpretations && snp.interpretations[raw]
      ? snp.interpretations[raw]
      : matchCount > 0 
        ? `Detected ${matchCount} copy/copies of the ${snp.alleles.join('/')} allele(s).`
        : `No ${snp.alleles.join('/')} alleles detected.`;
      
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
