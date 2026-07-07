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

  return reports;
}
