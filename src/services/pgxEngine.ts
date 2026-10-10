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
      message: 'CYP2C19 poor metabolizer phenotype predicted from your raw file. Research links this phenotype with reduced clopidogrel activation. Do not change antiplatelet therapy based on this app. Your prescriber can order confirmatory testing; published guidance is available from CPIC (https://cpicpgx.org/guidelines/).',
      phenotype: cyp2c19_phenotype
    });
    reports.push({
      gene: 'CYP2C19',
      drug: 'SSRIs (Escitalopram / Citalopram)',
      severity: 'Moderate',
      message: 'CYP2C19 poor metabolizer phenotype predicted from your raw file. Research links this phenotype with slower clearance of some SSRIs (escitalopram, citalopram). Do not change dose or stop antidepressants based on this app. Discuss with your prescriber.',
      phenotype: cyp2c19_phenotype
    });
  } else if (cyp2c19_phenotype === 'Ultrarapid Metabolizer') {
    reports.push({
      gene: 'CYP2C19',
      drug: 'SSRIs (Escitalopram / Citalopram)',
      severity: 'Moderate',
      message: 'CYP2C19 ultrarapid metabolizer phenotype predicted from your raw file. Research links this phenotype with faster clearance of some SSRIs. Do not change or stop medication based on this app. Discuss with your prescriber.',
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
      message: 'CYP2D6 poor metabolizer phenotype predicted from your raw file. Codeine needs CYP2D6 to become active, so pain relief may be reduced. Do not change pain medication based on this app. Talk to your doctor or pharmacist.',
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
      message: 'An SLCO1B1 poor-function genotype was found in your raw file, associated in research with higher rates of statin-related muscle symptoms. Do not change or stop your statin based on this app. Discuss with your prescriber.',
      phenotype: 'Poor Function'
    });
  } else if (slco1b1_risk === 1) {
    reports.push({
      gene: 'SLCO1B1',
      drug: 'Simvastatin',
      severity: 'Moderate',
      message: 'An SLCO1B1 intermediate-function genotype was found in your raw file, associated in research with a modest increase in statin-related muscle symptoms. Do not change dosing based on this app. Discuss with your prescriber.',
      phenotype: 'Intermediate Function'
    });
  }

  // VKORC1 (-1639G>A rs9923231) & CYP2C9 (*2 rs1799853, *3 rs1057910) Warfarin Sensitivity
  const rs9923231 = (snpMap['rs9923231'] || '--').toUpperCase();
  const rs1799853 = (snpMap['rs1799853'] || '--').toUpperCase();
  const rs1057910 = (snpMap['rs1057910'] || '--').toUpperCase();

  const isVkorc1Sensitive = rs9923231.includes('A');
  const hasCyp2c9Variant = rs1799853.includes('T') || rs1057910.includes('C');

  if (isVkorc1Sensitive || hasCyp2c9Variant) {
    const isHighSensitivity = rs9923231 === 'AA' || (rs1799853.includes('T') && rs1057910.includes('C'));
    reports.push({
      gene: 'VKORC1 / CYP2C9',
      drug: 'Warfarin (Coumadin)',
      severity: isHighSensitivity ? 'High' : 'Moderate',
      message: 'VKORC1/CYP2C9 variants associated with warfarin sensitivity were found in your raw file. Warfarin is dosed by clinicians using INR blood tests. Do not adjust any dose based on this app. Bring this result to your prescriber.',
      phenotype: isHighSensitivity ? 'High Sensitivity' : 'Intermediate Sensitivity'
    });
  }

  // DPYD (*2A rs3918290 severe 5-FU toxicity variant)
  const rs3918290 = (snpMap['rs3918290'] || '--').toUpperCase();
  if (rs3918290.includes('A')) {
    reports.push({
      gene: 'DPYD',
      drug: 'Fluorouracil (5-FU) / Capecitabine',
      severity: 'High',
      message: 'A DPYD loss-of-function allele (*2A, rs3918290) was found in your raw file. In clinical care this gene is tested before fluoropyrimidine chemotherapy because deficiency raises toxicity risk. This app is not a clinical test and the microarray call may be wrong. If you ever face this treatment decision, tell your oncology team and ask about clinical DPYD testing.',
      phenotype: rs3918290 === 'AA' ? 'Complete Deficiency' : 'Partial Deficiency'
    });
  }

  return reports;
}
