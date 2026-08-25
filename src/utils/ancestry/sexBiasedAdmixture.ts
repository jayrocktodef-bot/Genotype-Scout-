/**
 * Sex-Biased Admixture Calculator
 * Compares Chromosome X ancestry proportions against Autosomal ancestry proportions
 * to identify sex-biased historical demographic processes (e.g., male European colonizers
 * + Indigenous American or African female founders).
 */

export interface AncestryRatioItem {
  continent: string;
  autosomalPct: number;
  xChromosomePct: number;
  ratio: number; // X / Autosomal
  direction: 'Female-Biased Lineage' | 'Male-Biased Lineage' | 'Balanced Transmission';
}

export interface SexBiasedAdmixtureReport {
  hasSexBias: boolean;
  primarySummary: string;
  historicalContext: string;
  ratios: AncestryRatioItem[];
}

export function calculateSexBiasedAdmixture(
  autosomalAncestry: Record<string, number>,
  xChromosomeAncestry: Record<string, number>
): SexBiasedAdmixtureReport {
  const ratios: AncestryRatioItem[] = [];
  const continents = Array.from(new Set([
    ...Object.keys(autosomalAncestry),
    ...Object.keys(xChromosomeAncestry)
  ]));

  let EuropeanMaleBias = false;
  let NativeFemaleBias = false;
  let AfricanFemaleBias = false;

  for (const pop of continents) {
    const autoPct = autosomalAncestry[pop] || 0;
    const xPct = xChromosomeAncestry[pop] || 0;

    let ratio = 1.0;
    if (autoPct > 0.01) {
      ratio = xPct / autoPct;
    } else if (xPct > 0.01) {
      ratio = 2.0; // High X-only representation
    }

    let direction: AncestryRatioItem['direction'] = 'Balanced Transmission';
    if (ratio >= 1.25 && xPct >= 3.0) {
      direction = 'Female-Biased Lineage';
      if (pop === 'AMR' || pop === 'NAT') NativeFemaleBias = true;
      if (pop === 'AFR') AfricanFemaleBias = true;
    } else if (ratio <= 0.75 && autoPct >= 3.0) {
      direction = 'Male-Biased Lineage';
      if (pop === 'EUR') EuropeanMaleBias = true;
    }

    ratios.push({
      continent: pop,
      autosomalPct: autoPct,
      xChromosomePct: xPct,
      ratio: Math.round(ratio * 100) / 100,
      direction
    });
  }

  ratios.sort((a, b) => b.autosomalPct - a.autosomalPct);

  let hasSexBias = false;
  let primarySummary = "Symmetrical maternal and paternal ancestry contributions detected across Chromosome X and autosomes.";
  let historicalContext = "Your Chromosome X lineage aligns closely with your overall autosomal genome, indicating an equal balance of male and female ancestors from each ancestral population.";

  if (EuropeanMaleBias && (NativeFemaleBias || AfricanFemaleBias)) {
    hasSexBias = true;
    primarySummary = "Strong historical sex-biased admixture detected: Male European & Female Indigenous/African ancestral founders.";
    historicalContext = "Your Chromosome X exhibits a significantly higher proportion of Indigenous/African ancestry and lower European ancestry relative to your autosomal genome. This genetic signature is characteristic of colonial-era admixture in the Americas, where European male settlers predominantly mated with indigenous or African female ancestors.";
  } else if (NativeFemaleBias || AfricanFemaleBias) {
    hasSexBias = true;
    primarySummary = "Maternal female-line enrichment detected on Chromosome X.";
    historicalContext = "Your Chromosome X carries an elevated percentage of non-European ancestry compared to your autosomal genome, indicating strong maternal inheritance from these ancestral groups.";
  } else if (EuropeanMaleBias) {
    hasSexBias = true;
    primarySummary = "Paternal male-line enrichment detected on autosomal genome relative to Chromosome X.";
    historicalContext = "Your autosomal genome contains higher European ancestry than your Chromosome X, suggesting predominant European paternal lineage in recent generations.";
  }

  return {
    hasSexBias,
    primarySummary,
    historicalContext,
    ratios
  };
}
