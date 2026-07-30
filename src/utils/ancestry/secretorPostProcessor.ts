/**
 * Post-Processing Ancestry Refinement via Secretor Status (FUT2)
 * Genotype Scout v5.13.0
 * 
 * Uses key FUT2 functional variants (rs1047781, rs601338, rs281377) as secondary
 * diagnostic filters to fine-grain population assignments (e.g. East Asian sub-clustering,
 * Amerindian/Polynesian vs West Eurasian/African validation).
 */

export interface SubpopulationWeight {
  subpop: string;
  percentage: number;
}

export interface SecretorRefinementResult {
  refinedWeights: SubpopulationWeight[];
  appliedAdjustments: string[];
  eastAsianBoosted: boolean;
  amerindianFiltered: boolean;
}

/**
 * Refines initial subpopulation admixture percentages using user FUT2 SNP genotypes.
 * 
 * @param weights Initial subpopulation percentages from NNLS / Human Origins oracle
 * @param snpMap Key-value map of rsid -> genotype (e.g. { "rs1047781": "AT", "rs601338": "AA" })
 */
export function refineWithSecretorStatus(
  weights: SubpopulationWeight[],
  snpMap: Record<string, string>
): SecretorRefinementResult {
  if (!weights || weights.length === 0) {
    return {
      refinedWeights: [],
      appliedAdjustments: [],
      eastAsianBoosted: false,
      amerindianFiltered: false,
    };
  }

  const adjusted = weights.map(w => ({ ...w }));
  const appliedAdjustments: string[] = [];
  let eastAsianBoosted = false;
  let amerindianFiltered = false;

  // Normalize SNP keys to lowercase for lookup
  const normalizedMap: Record<string, string> = {};
  for (const [k, v] of Object.entries(snpMap)) {
    if (v && v !== '--' && v !== '00') {
      normalizedMap[k.toLowerCase()] = v.toUpperCase();
    }
  }

  const rs1047781 = normalizedMap['rs1047781']; // East Asian se385 (385A>T)
  const rs601338 = normalizedMap['rs601338'];   // European/African/S.Asian se428 (428G>A)
  const rs281377 = normalizedMap['rs281377'];   // African FUT2 (739C>T)

  // 1. East Asian Specificity (rs1047781 T allele - 385T)
  if (rs1047781 && (rs1047781.includes('T') || rs1047781 === 'AT' || rs1047781 === 'TT')) {
    const isHomozygous = rs1047781 === 'TT' || rs1047781 === 'T';
    const boostFactor = isHomozygous ? 1.25 : 1.15;

    let totalBoost = 0;
    adjusted.forEach(item => {
      const code = item.subpop.toUpperCase();
      if (['CHB', 'CHS', 'JPT', 'KHV', 'CDX', 'EAS_GNOMAD', 'EAST_ASIAN', 'JAPANESE', 'KOREAN', 'CHINESE'].some(p => code.includes(p))) {
        const oldP = item.percentage;
        item.percentage *= boostFactor;
        totalBoost += (item.percentage - oldP);
        eastAsianBoosted = true;
      }
    });

    if (eastAsianBoosted) {
      appliedAdjustments.push(
        `FUT2 rs1047781 (${rs1047781}): Confirmed East Asian se385 variant; applied +${Math.round((boostFactor - 1) * 100)}% weight boost to East/Southeast Asian sub-clusters.`
      );
    }
  }

  // 2. Native American / Polynesian Exclusion Check (rs601338 AA - Null Non-Secretor)
  if (rs601338 === 'AA' || rs601338 === 'A') {
    // Non-secretor AA is near-absent (<1%) in unmixed Amerindians / Polynesians.
    // If Amerindian/Polynesian component is falsely dominant, cap it and re-distribute to EUR/AFR.
    let amerindianWeight = 0;
    adjusted.forEach(item => {
      const code = item.subpop.toUpperCase();
      if (['PEL', 'MXL', 'PUR', 'CLM', 'AMR_GNOMAD', 'INDIGENOUS_AMERICAN', 'NATIVE_AMERICAN', 'SURUI', 'KARITIANA'].some(p => code.includes(p))) {
        amerindianWeight += item.percentage;
      }
    });

    if (amerindianWeight > 50) {
      amerindianFiltered = true;
      const reduction = amerindianWeight * 0.20; // 20% adjustment towards Eurasian/African
      adjusted.forEach(item => {
        const code = item.subpop.toUpperCase();
        if (['PEL', 'MXL', 'PUR', 'CLM', 'AMR_GNOMAD', 'INDIGENOUS_AMERICAN', 'NATIVE_AMERICAN', 'SURUI', 'KARITIANA'].some(p => code.includes(p))) {
          item.percentage = Math.max(0, item.percentage - (item.percentage / amerindianWeight) * reduction);
        } else {
          item.percentage += (item.percentage / (100 - amerindianWeight || 1)) * reduction;
        }
      });

      appliedAdjustments.push(
        `FUT2 rs601338 (AA): Homozygous non-secretor genotype detected (absent in unmixed Amerindians); refined Amerindian-Admixed weights.`
      );
    }
  }

  // 3. Sub-Saharan African Specificity (rs281377 TT)
  if (rs281377 === 'TT' || rs281377 === 'CT') {
    let africanBoost = false;
    adjusted.forEach(item => {
      const code = item.subpop.toUpperCase();
      if (['YRI', 'ESN', 'GWD', 'MSL', 'LWK', 'AFR_GNOMAD', 'BANTU', 'YORUBA'].some(p => code.includes(p))) {
        item.percentage *= 1.10;
        africanBoost = true;
      }
    });

    if (africanBoost) {
      appliedAdjustments.push(
        `FUT2 rs281377 (${rs281377}): Validated Sub-Saharan African mucosal lineage; fine-grained African sub-population weights.`
      );
    }
  }

  // 4. Re-normalize percentages to sum to 100%
  const totalSum = adjusted.reduce((acc, curr) => acc + curr.percentage, 0);
  if (totalSum > 0) {
    adjusted.forEach(item => {
      item.percentage = Math.round((item.percentage / totalSum) * 1000) / 10;
    });
  }

  return {
    refinedWeights: adjusted.sort((a, b) => b.percentage - a.percentage),
    appliedAdjustments,
    eastAsianBoosted,
    amerindianFiltered,
  };
}
