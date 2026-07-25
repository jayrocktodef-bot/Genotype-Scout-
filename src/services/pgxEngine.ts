export interface PGxReport {
  gene: string;
  drug: string;
  severity: 'High' | 'Moderate' | 'Low';
  message: string;
  phenotype: string;
}

export function calculatePharmacogenomics(snpMap: Record<string, string>): PGxReport[] {
  const reports: PGxReport[] = [];

  // CYP2C19 Logic (Clopidogrel, SSRIs)
  // rs12248560 (CYP2C19*17) T = increased function (Normal C)
  // rs4244285 (CYP2C19*2) A = no function (Normal G)
  // rs4986894 (CYP2C19*3) A = no function (Normal G)

  let cyp2c19_score = 2; // Normal metabolizer
  const rs12248560 = snpMap['rs12248560'] || '--';
  const rs4244285 = snpMap['rs4244285'] || '--';
  const rs4986894 = snpMap['rs4986894'] || '--';

  let hasNoFunction = 0;
  let hasIncreasedFunction = 0;

  // Check *17 (increased function)
  if (rs12248560.includes('T')) {
    hasIncreasedFunction += (rs12248560.match(/T/g) || []).length;
  }
  
  // Check *2 (no function)
  if (rs4244285.includes('A')) {
    hasNoFunction += (rs4244285.match(/A/g) || []).length;
  }

  // Check *3 (no function)
  if (rs4986894.includes('A')) {
    hasNoFunction += (rs4986894.match(/A/g) || []).length;
  }

  cyp2c19_score = cyp2c19_score - hasNoFunction + hasIncreasedFunction;

  let cyp2c19_phenotype = 'Normal Metabolizer';
  if (cyp2c19_score >= 3) cyp2c19_phenotype = 'Ultrarapid Metabolizer';
  if (cyp2c19_score === 1) cyp2c19_phenotype = 'Intermediate Metabolizer';
  if (cyp2c19_score <= 0) cyp2c19_phenotype = 'Poor Metabolizer';

  if (cyp2c19_phenotype === 'Poor Metabolizer') {
    reports.push({
      gene: 'CYP2C19',
      drug: 'Clopidogrel (Plavix)',
      severity: 'High',
      message: 'You are a Poor Metabolizer for CYP2C19. Clopidogrel may be ineffective, significantly increasing the risk of adverse cardiovascular events. CPIC recommends alternative antiplatelet therapy (e.g., prasugrel or ticagrelor).',
      phenotype: cyp2c19_phenotype
    });
    reports.push({
      gene: 'CYP2C19',
      drug: 'SSRIs (Escitalopram / Citalopram)',
      severity: 'Moderate',
      message: 'As a Poor Metabolizer, you may experience elevated plasma concentrations of certain SSRIs. CPIC recommends considering a 50% reduction of starting dose or selecting an alternative drug.',
      phenotype: cyp2c19_phenotype
    });
  } else if (cyp2c19_phenotype === 'Ultrarapid Metabolizer') {
    reports.push({
      gene: 'CYP2C19',
      drug: 'SSRIs (Escitalopram / Citalopram)',
      severity: 'Moderate',
      message: 'As an Ultrarapid Metabolizer, these drugs may be cleared too quickly from your system leading to therapy failure. CPIC recommends considering an alternative antidepressant.',
      phenotype: cyp2c19_phenotype
    });
  }

  // CYP2D6 Logic (Codeine, Antidepressants)
  // rs3892097 (CYP2D6*4) T = no function (Normal C)
  // rs1065852 (CYP2D6*10) T = decreased function (Normal C)

  let cyp2d6_score = 2.0;
  const rs3892097 = snpMap['rs3892097'] || '--';
  const rs1065852 = snpMap['rs1065852'] || '--';

  let hasDecreased = 0;
  let hasNone = 0;

  if (rs3892097.includes('T')) {
    hasNone += (rs3892097.match(/T/g) || []).length;
  }
  if (rs1065852.includes('T')) {
    hasDecreased += (rs1065852.match(/T/g) || []).length;
  }

  cyp2d6_score = cyp2d6_score - hasNone - (hasDecreased * 0.5);

  let cyp2d6_phenotype = 'Normal Metabolizer';
  if (cyp2d6_score <= 0) cyp2d6_phenotype = 'Poor Metabolizer';
  else if (cyp2d6_score <= 1.0) cyp2d6_phenotype = 'Intermediate Metabolizer';
  
  // Note: Ultrarapid for 2D6 usually requires CNV analysis (duplications), which arrays struggle with, so we skip it.

  if (cyp2d6_phenotype === 'Poor Metabolizer') {
    reports.push({
      gene: 'CYP2D6',
      drug: 'Codeine / Tramadol',
      severity: 'High',
      message: 'As a Poor Metabolizer, codeine will not be effectively converted to morphine, providing very little to no pain relief. CPIC recommends avoiding codeine and using alternative analgesics.',
      phenotype: cyp2d6_phenotype
    });
  }

  // SLCO1B1 (Statins)
  // rs4149056 (SLCO1B1*5) C = decreased function (Normal T)
  const rs4149056 = snpMap['rs4149056'] || '--';
  let slco1b1_risk = 0;
  if (rs4149056.includes('C')) {
    slco1b1_risk += (rs4149056.match(/C/g) || []).length;
  }

  if (slco1b1_risk === 2) {
    reports.push({
      gene: 'SLCO1B1',
      drug: 'Simvastatin',
      severity: 'High',
      message: 'You have significantly decreased SLCO1B1 function. This confers a high risk for statin-induced myopathy (muscle toxicity). CPIC recommends prescribing a lower dose or an alternative statin.',
      phenotype: 'Poor Function'
    });
  } else if (slco1b1_risk === 1) {
    reports.push({
      gene: 'SLCO1B1',
      drug: 'Simvastatin',
      severity: 'Moderate',
      message: 'You have intermediate SLCO1B1 function. There is an increased risk for statin-induced myopathy. CPIC recommends prescribing a lower dose or considering an alternative.',
      phenotype: 'Intermediate Function'
    });
  }

  // 1. DPYD (Fluoropyrimidines / 5-Fluorouracil / Capecitabine)
  // rs3918290 (DPYD*2A) A = no function
  // rs55886062 (DPYD*13) A = no function
  // rs67376798 (c.2846A>T) T = decreased function
  const rs3918290 = snpMap['rs3918290'] || snpMap['RS3918290'] || '--';
  const rs55886062 = snpMap['rs55886062'] || snpMap['RS55886062'] || '--';
  const rs67376798 = snpMap['rs67376798'] || snpMap['RS67376798'] || '--';
  
  let dpydNoFunction = 0;
  if (rs3918290.includes('A')) dpydNoFunction += (rs3918290.match(/A/g) || []).length;
  if (rs55886062.includes('A')) dpydNoFunction += (rs55886062.match(/A/g) || []).length;
  if (rs67376798.includes('T')) dpydNoFunction += (rs67376798.match(/T/g) || []).length;

  if (dpydNoFunction >= 2) {
    reports.push({
      gene: 'DPYD',
      drug: 'Fluorouracil (5-FU) / Capecitabine',
      severity: 'High',
      message: 'You carry complete DPYD deficiency. CPIC strongly recommends avoiding 5-FU and Capecitabine due to high risk of severe or life-threatening systemic toxicity.',
      phenotype: 'Poor Metabolizer'
    });
  } else if (dpydNoFunction === 1) {
    reports.push({
      gene: 'DPYD',
      drug: 'Fluorouracil (5-FU) / Capecitabine',
      severity: 'High',
      message: 'You carry partial DPYD deficiency. CPIC recommends a minimum 50% initial dose reduction for 5-FU/Capecitabine followed by therapeutic drug monitoring.',
      phenotype: 'Intermediate Metabolizer'
    });
  }

  // 2. TPMT & NUDT15 (Thiopurines / Azathioprine / 6-Mercaptopurine)
  // rs1800460 (TPMT*3B) C = no function
  // rs1142345 (TPMT*3C) G = no function
  // rs116855232 (NUDT15*3) T = no function
  const rs1800460 = snpMap['rs1800460'] || '--';
  const rs1142345 = snpMap['rs1142345'] || '--';
  const rs116855232 = snpMap['rs116855232'] || '--';

  let tpmtNoFunc = 0;
  if (rs1800460.includes('C')) tpmtNoFunc += (rs1800460.match(/C/g) || []).length;
  if (rs1142345.includes('G')) tpmtNoFunc += (rs1142345.match(/G/g) || []).length;
  if (rs116855232.includes('T')) tpmtNoFunc += (rs116855232.match(/T/g) || []).length;

  if (tpmtNoFunc >= 2) {
    reports.push({
      gene: 'TPMT / NUDT15',
      drug: 'Azathioprine / 6-Mercaptopurine',
      severity: 'High',
      message: 'You carry homozygous loss-of-function variants in TPMT or NUDT15. CPIC guidelines advise drastic dose reductions (90%) or alternative non-thiopurine agents to prevent severe myelosuppression.',
      phenotype: 'Poor Metabolizer'
    });
  } else if (tpmtNoFunc === 1) {
    reports.push({
      gene: 'TPMT / NUDT15',
      drug: 'Azathioprine / 6-Mercaptopurine',
      severity: 'Moderate',
      message: 'You carry a heterozygous loss-of-function variant in TPMT or NUDT15. CPIC recommends starting at 30-50% of the target thiopurine dose with routine blood count monitoring.',
      phenotype: 'Intermediate Metabolizer'
    });
  }

  // 3. CYP2C9 & VKORC1 (Warfarin Sensitivity)
  // rs1799853 (CYP2C9*2) T = decreased function
  // rs1057910 (CYP2C9*3) C = decreased function
  // rs9923231 (VKORC1 -1639G>A) T or A = increased sensitivity
  const rs1799853 = snpMap['rs1799853'] || '--';
  const rs1057910 = snpMap['rs1057910'] || '--';
  const rs9923231 = snpMap['rs9923231'] || '--';

  let warfarinSens = 0;
  if (rs1799853.includes('T')) warfarinSens += 1;
  if (rs1057910.includes('C')) warfarinSens += 1;
  if (rs9923231.includes('A') || rs9923231.includes('T')) warfarinSens += 1;

  if (warfarinSens >= 2) {
    reports.push({
      gene: 'CYP2C9 / VKORC1',
      drug: 'Warfarin',
      severity: 'High',
      message: 'You possess multiple sensitivity variants in CYP2C9 or VKORC1. CPIC algorithms recommend a significantly lower initial daily dose to prevent over-anticoagulation and bleeding risks.',
      phenotype: 'High Sensitivity'
    });
  } else if (warfarinSens === 1) {
    reports.push({
      gene: 'CYP2C9 / VKORC1',
      drug: 'Warfarin',
      severity: 'Moderate',
      message: 'You possess a sensitivity variant in CYP2C9 or VKORC1. Moderate initial dose reduction is recommended by CPIC algorithm guidelines.',
      phenotype: 'Moderate Sensitivity'
    });
  }

  // 4. HLA-B*57:01 Tag SNP (Abacavir Hypersensitivity)
  // rs2395029 G allele = tag for HLA-B*57:01
  const rs2395029 = snpMap['rs2395029'] || '--';
  if (rs2395029.includes('G')) {
    reports.push({
      gene: 'HLA-B',
      drug: 'Abacavir',
      severity: 'High',
      message: 'You carry the rs2395029(G) tag allele for HLA-B*57:01. Abacavir is contraindicated by CPIC and FDA guidelines due to high risk of severe multi-organ hypersensitivity reaction.',
      phenotype: 'HLA-B*57:01 Positive'
    });
  }

  return reports;
}
