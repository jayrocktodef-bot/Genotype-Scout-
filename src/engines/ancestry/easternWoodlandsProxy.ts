import proxyData from '../../data/aims/easternWoodlandsProxySNPs.json';

export interface EasternWoodlandsProxyResult {
  score: number;
  direction: 'northern-affiliated' | 'indeterminate' | 'southern-affiliated';
  snpsDetected: number;
  message: string;
}

export function computeEasternWoodlandsProxy(
  dataset: any
): EasternWoodlandsProxyResult {
  let northernScore = 0;
  let maxNorthernScore = 0;
  let snpsDetected = 0;

  const userSnps = dataset.snpMap || {};

  for (const snp of proxyData) {
    const genotype = userSnps[snp.rsid];
    if (!genotype || genotype === '--' || genotype === '-') continue;

    let dosage = 0;
    if (genotype[0] === snp.targetAllele) dosage++;
    if (genotype.length > 1 && genotype[1] === snp.targetAllele) dosage++;

    // Anchor A is weighted heavier natively in the json or we just sum it up
    maxNorthernScore += snp.weight * 2;
    northernScore += snp.weight * dosage;
    if (dosage > 0) snpsDetected++;
  }

  // Normalize score
  const normalizedScore = maxNorthernScore > 0 ? northernScore / maxNorthernScore : 0;
  
  let direction: 'northern-affiliated' | 'indeterminate' | 'southern-affiliated' = 'indeterminate';
  let message = '';

  if (normalizedScore > 0.6) {
    direction = 'northern-affiliated';
    message = 'Proxy signal leans strongly toward northern Native American/Northeastern Woodlands reference populations.';
  } else if (normalizedScore < 0.4 && snpsDetected > 5) {
    direction = 'southern-affiliated';
    message = 'Proxy signal leans toward southern/Central American Native American reference populations.';
  } else if (snpsDetected > 0) {
    direction = 'indeterminate';
    message = 'Proxy signal is indeterminate or intermediate on the north-south cline.';
  } else {
    direction = 'indeterminate';
    message = 'Not enough informative markers detected for directional proxy.';
  }

  return {
    score: normalizedScore,
    direction,
    snpsDetected,
    message
  };
}
