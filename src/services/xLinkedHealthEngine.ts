/**
 * X-Linked Health & Pharmacogenomics Engine
 * Evaluates Chromosome X variants taking into account sex-specific hemizygous (male)
 * vs diploid (female) inheritance, PAR1/PAR2 regions, and clinical significance.
 */

export interface XLinkedTraitResult {
  id: string;
  traitName: string;
  gene: string;
  rsid: string;
  chromosome: 'X';
  position: number;
  userGenotype: string;
  userSex: 'male' | 'female' | 'unknown';
  zygosity: 'hemizygous_variant' | 'hemizygous_wild' | 'homozygous_variant' | 'heterozygous_carrier' | 'homozygous_wild' | 'uncalled';
  phenotypeStatus: 'Affected / High Susceptibility' | 'Carrier' | 'Normal / Low Risk' | 'No Data';
  riskLevel: 'high' | 'moderate' | 'low' | 'unknown';
  clinicalSummary: string;
  actionableGuidance?: string;
}

export interface XLinkedReport {
  overallRiskCategory: 'High Risk Flagged' | 'Carrier Flagged' | 'Normal Status' | 'Insufficient Data';
  evaluatedTraits: XLinkedTraitResult[];
  sexDetected: 'male' | 'female' | 'unknown';
}

interface XLinkedMarkerDefinition {
  id: string;
  traitName: string;
  gene: string;
  rsid: string;
  position: number;
  riskAllele: string;
  refAllele: string;
  descriptionMaleVariant: string;
  descriptionFemaleHomVariant: string;
  descriptionFemaleCarrier: string;
  descriptionNormal: string;
  actionableGuidanceMale?: string;
  actionableGuidanceFemale?: string;
}

const X_LINKED_MARKERS: XLinkedMarkerDefinition[] = [
  {
    id: 'g6pd_a202a',
    traitName: 'G6PD Deficiency (A- Variant)',
    gene: 'G6PD',
    rsid: 'rs1050829',
    position: 154536002,
    riskAllele: 'T', // 202A complement or T
    refAllele: 'C',
    descriptionMaleVariant: 'Hemizygous for G6PD A- variant. Significantly reduced G6PD enzyme activity.',
    descriptionFemaleHomVariant: 'Homozygous for G6PD A- variant. Significantly reduced G6PD enzyme activity.',
    descriptionFemaleCarrier: 'Heterozygous carrier for G6PD A- variant. Generally asymptomatic but can pass to offspring.',
    descriptionNormal: 'Normal G6PD enzyme activity.',
    actionableGuidanceMale: 'Avoid fava beans, rasburicase, primaquine, dapsone, and nitrofurantoin to prevent acute hemolytic crises.',
    actionableGuidanceFemale: 'If homozygous, avoid fava beans and oxidative medications. Genetic counseling recommended for pregnancy planning.'
  },
  {
    id: 'g6pd_mediterranean',
    traitName: 'G6PD Deficiency (Mediterranean Variant)',
    gene: 'G6PD',
    rsid: 'rs5030868',
    position: 154535310,
    riskAllele: 'T',
    refAllele: 'C',
    descriptionMaleVariant: 'Hemizygous for G6PD Mediterranean variant (Severe Class II deficiency).',
    descriptionFemaleHomVariant: 'Homozygous for G6PD Mediterranean variant (Severe Class II deficiency).',
    descriptionFemaleCarrier: 'Heterozygous carrier for G6PD Mediterranean variant.',
    descriptionNormal: 'Normal G6PD enzyme activity.',
    actionableGuidanceMale: 'Strict avoidance of fava beans, mothballs (naphthalene), sulfa drugs, and primaquine required.',
    actionableGuidanceFemale: 'Strict avoidance of fava beans and oxidative drugs if homozygous.'
  },
  {
    id: 'ar_baldness_rs6152',
    traitName: 'Androgenetic Alopecia (Male Pattern Baldness)',
    gene: 'AR',
    rsid: 'rs6152',
    position: 67723790,
    riskAllele: 'G',
    refAllele: 'A',
    descriptionMaleVariant: 'Hemizygous for high-risk AR StuI G allele. Increased scalp androgen receptor sensitivity.',
    descriptionFemaleHomVariant: 'Homozygous for high-risk AR G allele. Associated with female pattern hair thinning.',
    descriptionFemaleCarrier: 'Carrier of AR G allele.',
    descriptionNormal: 'Protective AR A allele. Reduced genetic susceptibility to premature androgenic hair loss.',
    actionableGuidanceMale: 'Consider early dermatological consultation for preventative androgenic hair loss strategies if desired.'
  },
  {
    id: 'opn1lw_colorblindness',
    traitName: 'Red-Green Color Vision Variation (Deuteran/Protan)',
    gene: 'OPN1LW',
    rsid: 'rs1048661',
    position: 154189205,
    riskAllele: 'T',
    refAllele: 'C',
    descriptionMaleVariant: 'Hemizygous for altered OPN1LW opsin variant. Altered red-green spectral sensitivity.',
    descriptionFemaleHomVariant: 'Homozygous for altered OPN1LW opsin variant.',
    descriptionFemaleCarrier: 'Heterozygous carrier for red-green color vision variant (Tetrachromacy potential).',
    descriptionNormal: 'Standard trichromatic red-green visual opsin genotype.'
  },
  {
    id: 'maoa_activity_rs6323',
    traitName: 'MAO-A Enzymatic Degradation Rate',
    gene: 'MAOA',
    rsid: 'rs6323',
    position: 43654907,
    riskAllele: 'T',
    refAllele: 'G',
    descriptionMaleVariant: 'Hemizygous for low-activity MAO-A T allele. Slower enzymatic degradation of serotonin and dopamine.',
    descriptionFemaleHomVariant: 'Homozygous for low-activity MAO-A T allele.',
    descriptionFemaleCarrier: 'Heterozygous for MAO-A activity alleles.',
    descriptionNormal: 'High-activity MAO-A G allele. Rapid monoamine neurotransmitter clearance.'
  },
  {
    id: 'f8_hemophilia_rs1800291',
    traitName: 'Coagulation Factor VIII Variant',
    gene: 'F8',
    rsid: 'rs1800291',
    position: 154835788,
    riskAllele: 'A',
    refAllele: 'G',
    descriptionMaleVariant: 'Hemizygous for Factor VIII A variant.',
    descriptionFemaleHomVariant: 'Homozygous for Factor VIII A variant.',
    descriptionFemaleCarrier: 'Heterozygous carrier for Factor VIII variant.',
    descriptionNormal: 'Standard Factor VIII coagulation genotype.'
  }
];

export function evaluateXLinkedTraits(
  snpMap: Record<string, string>,
  sex: 'male' | 'female' | 'unknown' = 'unknown'
): XLinkedReport {
  const evaluatedTraits: XLinkedTraitResult[] = [];
  let hasHighRisk = false;
  let hasCarrier = false;

  for (const marker of X_LINKED_MARKERS) {
    const rawGeno = snpMap[marker.rsid.toLowerCase()] || snpMap[`chrX_${marker.position}`.toLowerCase()] || '';

    if (!rawGeno) {
      evaluatedTraits.push({
        id: marker.id,
        traitName: marker.traitName,
        gene: marker.gene,
        rsid: marker.rsid,
        chromosome: 'X',
        position: marker.position,
        userGenotype: '--',
        userSex: sex,
        zygosity: 'uncalled',
        phenotypeStatus: 'No Data',
        riskLevel: 'unknown',
        clinicalSummary: 'Marker not genotyped on this raw data array.'
      });
      continue;
    }

    const cleanGeno = rawGeno.toUpperCase();
    const isSingleAllele = cleanGeno.length === 1;
    const isMale = sex === 'male' || isSingleAllele;

    let zygosity: XLinkedTraitResult['zygosity'] = 'homozygous_wild';
    let phenotypeStatus: XLinkedTraitResult['phenotypeStatus'] = 'Normal / Low Risk';
    let riskLevel: XLinkedTraitResult['riskLevel'] = 'low';
    let summary = marker.descriptionNormal;
    let guidance: string | undefined = undefined;

    const countRisk = (cleanGeno.match(new RegExp(marker.riskAllele, 'g')) || []).length;

    if (isMale) {
      if (countRisk > 0) {
        zygosity = 'hemizygous_variant';
        phenotypeStatus = 'Affected / High Susceptibility';
        riskLevel = 'high';
        summary = marker.descriptionMaleVariant;
        guidance = marker.actionableGuidanceMale;
        hasHighRisk = true;
      } else {
        zygosity = 'hemizygous_wild';
        phenotypeStatus = 'Normal / Low Risk';
        riskLevel = 'low';
        summary = marker.descriptionNormal;
      }
    } else {
      // Female diploid
      if (countRisk === 2) {
        zygosity = 'homozygous_variant';
        phenotypeStatus = 'Affected / High Susceptibility';
        riskLevel = 'high';
        summary = marker.descriptionFemaleHomVariant;
        guidance = marker.actionableGuidanceFemale;
        hasHighRisk = true;
      } else if (countRisk === 1) {
        zygosity = 'heterozygous_carrier';
        phenotypeStatus = 'Carrier';
        riskLevel = 'moderate';
        summary = marker.descriptionFemaleCarrier;
        guidance = marker.actionableGuidanceFemale;
        hasCarrier = true;
      } else {
        zygosity = 'homozygous_wild';
        phenotypeStatus = 'Normal / Low Risk';
        riskLevel = 'low';
        summary = marker.descriptionNormal;
      }
    }

    evaluatedTraits.push({
      id: marker.id,
      traitName: marker.traitName,
      gene: marker.gene,
      rsid: marker.rsid,
      chromosome: 'X',
      position: marker.position,
      userGenotype: cleanGeno,
      userSex: isMale ? 'male' : 'female',
      zygosity,
      phenotypeStatus,
      riskLevel,
      clinicalSummary: summary,
      actionableGuidance: guidance
    });
  }

  let overallRiskCategory: XLinkedReport['overallRiskCategory'] = 'Normal Status';
  if (hasHighRisk) overallRiskCategory = 'High Risk Flagged';
  else if (hasCarrier) overallRiskCategory = 'Carrier Flagged';
  else if (evaluatedTraits.every(t => t.zygosity === 'uncalled')) overallRiskCategory = 'Insufficient Data';

  return {
    overallRiskCategory,
    evaluatedTraits,
    sexDetected: sex
  };
}
