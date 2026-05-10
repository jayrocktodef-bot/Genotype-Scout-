import pharmacogenomics from '../data/pharmacogenomics.json';
import clinicalHealth from '../data/clinical_health.json';
import appearanceTraits from '../data/appearance_traits.json';
import v5MarkersMaster from '../data/v5_markers_master.json';
import autoimmuneHlaPanel from '../data/autoimmune_hla_panel.json';

export interface HealthImpact {
  rsid: string;
  name: string;
  category: string;
  trait: string;
  genotype: string;
  interpretation: string;
  impact: 'high' | 'moderate' | 'low' | 'neutral';
  drugs?: string[];
  evidence?: string;
  actionable?: any;
  masked?: boolean;
}

const SENSITIVE_TRAITS = [
    'Alzheimer',
    'Breast Cancer',
    'BRCA1',
    'BRCA2',
    'APOE',
    'Huntington',
    'Parkinson',
    'Lynch Syndrome',
    'Macular Degeneration'
];

function ensureString(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return JSON.stringify(val);
  }
  return String(val);
}

export function matchHealthAndWellness(userSnps: Record<string, string>): HealthImpact[] {
  const impacts: HealthImpact[] = [];
  const normalizedSnps = Object.fromEntries(
    Object.entries(userSnps).map(([k, v]) => [k.toLowerCase(), v])
  );
  
  const processedRsids = new Set<string>();

  // 1. Process V5 Master Markers (Highest Priority/Fidelity)
  for (const marker of v5MarkersMaster as any[]) {
    const userGenotype = normalizedSnps[marker.rsid.toLowerCase()];
    if (!userGenotype) continue;

    const riskAllele = marker.risk_allele;
    const variantAllele = marker.variant_allele;
    const targetAllele = riskAllele || variantAllele;

    if (targetAllele) {
      const count = (userGenotype.match(new RegExp(targetAllele, 'g')) || []).length;
      if (count > 0) {
        let interpretation = marker.clinical_impact || marker.effect;
        if (typeof interpretation === 'object' && interpretation !== null) {
          interpretation = (interpretation as any)[userGenotype] || (interpretation as any)[userGenotype.split('').reverse().join('')] || Object.values(interpretation)[0];
        }
        
        if (!interpretation || typeof interpretation !== 'string') {
          interpretation = count === 2 ? `High impact (${targetAllele}${targetAllele})` : `Moderate impact (${targetAllele})`;
        }

        let actionable = marker.actionable;
        if (actionable && typeof actionable === 'object' && !Array.isArray(actionable.recommendations)) {
          const genotypeData = actionable[userGenotype];
          if (genotypeData) {
            let recommendations: string[] = [];
            if (Array.isArray(genotypeData)) {
              recommendations = genotypeData.map(r => typeof r === 'object' ? JSON.stringify(r) : String(r));
            } else if (typeof genotypeData === 'object') {
              recommendations = Object.entries(genotypeData).map(([key, val]) => {
                const label = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                return `${label}: ${val}`;
              });
            } else {
              recommendations = [String(genotypeData)];
            }
            actionable = { recommendations };
          } else if (actionable.general || actionable.summary) {
            actionable = { recommendations: [actionable.general || actionable.summary] };
          }
        }

        const trait = ensureString(marker.condition || marker.gene || marker.categories?.[0] || 'Unknown');
        const name = ensureString(marker.name || marker.clinical_impact_short || `${marker.gene} ${marker.variant}`);
        const impact = marker.clinical_impact_level?.toLowerCase() || marker.priority?.toLowerCase() || (count === 2 ? 'high' : 'moderate') as any;

        const isSensitive = SENSITIVE_TRAITS.some(t => trait.includes(t) || name.includes(t));

        impacts.push({
          rsid: ensureString(marker.rsid),
          name,
          category: ensureString(marker.categories?.[0]?.charAt(0).toUpperCase() + marker.categories?.[0]?.slice(1) || 'Health'),
          trait,
          genotype: userGenotype,
          interpretation: ensureString(interpretation),
          impact,
          drugs: marker.drugs_affected || marker.drugs,
          evidence: ensureString(marker.evidence),
          actionable,
          masked: isSensitive && (impact === 'high' || impact === 'moderate')
        });
        processedRsids.add(marker.rsid.toLowerCase());
      }
    }
  }

  // 2. Process Pharmacogenomics (if not already handled)
  for (const [category, markers] of Object.entries(pharmacogenomics)) {
    for (const [rsid, data] of Object.entries(markers as any)) {
      if (processedRsids.has(rsid.toLowerCase())) continue;
      
      const userGenotype = normalizedSnps[rsid.toLowerCase()];
      if (!userGenotype) continue;

      const variantAllele = (data as any).variant_allele;
      const hasVariant = userGenotype.includes(variantAllele);

      if (hasVariant) {
        impacts.push({
          rsid: ensureString(rsid),
          name: ensureString((data as any).name),
          category: 'Pharmacogenomics',
          trait: ensureString(category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')),
          genotype: userGenotype,
          interpretation: ensureString((data as any).effect),
          impact: 'moderate',
          drugs: (data as any).drugs
        });
        processedRsids.add(rsid.toLowerCase());
      }
    }
  }

  // 3. Process Clinical Health
  for (const [category, markers] of Object.entries(clinicalHealth)) {
    for (const [rsid, data] of Object.entries(markers as any)) {
      if (processedRsids.has(rsid.toLowerCase())) continue;

      const userGenotype = normalizedSnps[rsid.toLowerCase()];
      if (!userGenotype) continue;

      const riskAllele = (data as any).risk_allele;
      const count = (userGenotype.match(new RegExp(riskAllele, 'g')) || []).length;

      if (count > 0) {
        impacts.push({
          rsid: ensureString(rsid),
          name: ensureString((data as any).name),
          category: 'Clinical Health',
          trait: ensureString(category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')),
          genotype: userGenotype,
          interpretation: ensureString(count === 2 ? `Increased risk (${riskAllele}${riskAllele})` : `Partial risk (${riskAllele})`),
          impact: (data as any).impact || 'moderate',
          evidence: ensureString((data as any).description)
        });
        processedRsids.add(rsid.toLowerCase());
      }
    }
  }

  // 4. Process Appearance Traits
  for (const marker of appearanceTraits as any[]) {
    // Appearance markers often have multi-allele interpretations, so we process them even if RSID exists 
    // because v5 might not have the specific phenotype text if it was extracted differently.
    // But for now let's just stick to processedRsids to avoid duplicates.
    if (processedRsids.has(marker.rsid.toLowerCase())) continue;

    const userGenotype = normalizedSnps[marker.rsid.toLowerCase()];
    if (!userGenotype) continue;

    const sortedGenotype = userGenotype.split('').sort().join('');
    const possibleKeys = [userGenotype, sortedGenotype];
    
    let matchedInterpretation = '';
    for (const key of possibleKeys) {
      if (marker.interpretation[key]) {
        matchedInterpretation = marker.interpretation[key];
        break;
      }
    }

    if (matchedInterpretation) {
      impacts.push({
        rsid: ensureString(marker.rsid),
        name: ensureString(marker.interpretation.name || marker.interpretation.trait || 'Trait Marker'),
        category: ensureString(marker.category),
        trait: ensureString(marker.interpretation.trait || marker.category),
        genotype: userGenotype,
        interpretation: ensureString(matchedInterpretation),
        impact: 'neutral',
        evidence: marker.interpretation.evidence ? `Evidence: ${ensureString(marker.interpretation.evidence)}` : undefined
      });
      processedRsids.add(marker.rsid.toLowerCase());
    }
  }

  // 5. Process HLA Autoimmune Markers
  for (const [rsid, data] of Object.entries(autoimmuneHlaPanel)) {
    if (processedRsids.has(rsid.toLowerCase())) continue;

    const userGenotype = normalizedSnps[rsid.toLowerCase()];
    if (!userGenotype) continue;

    const riskAllele = (data as any).risk_allele;
    const count = (userGenotype.match(new RegExp(riskAllele, 'g')) || []).length;

    if (count > 0) {
      const isProtective = (data as any).is_protective;
      const oddsRatio = (data as any).odds_ratio;
      
      let impact: 'high' | 'moderate' | 'low' | 'neutral' = 'neutral';
      if (!isProtective) {
        if (oddsRatio > 5 || count === 2) impact = 'high';
        else if (oddsRatio > 2) impact = 'moderate';
        else impact = 'low';
      } else {
        impact = 'low';
      }

      impacts.push({
        rsid: ensureString(rsid),
        name: ensureString(`${(data as any).gene} (${(data as any).hla_type})`),
        category: 'Autoimmune/HLA',
        trait: ensureString((data as any).condition),
        genotype: userGenotype,
        interpretation: isProtective 
          ? `Protective factor detected against ${(data as any).condition}.` 
          : `Increased susceptibility detected (${userGenotype}). Odds Ratio: ${oddsRatio}.`,
        impact,
        evidence: `HLA Type: ${(data as any).hla_type}. Risk Allele: ${riskAllele}.`
      });
      processedRsids.add(rsid.toLowerCase());
    }
  }

  return impacts;
}
