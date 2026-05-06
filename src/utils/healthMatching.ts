import pharmacogenomics from '../data/pharmacogenomics.json';
import clinicalHealth from '../data/clinical_health.json';
import appearanceTraits from '../data/appearance_traits.json';
import v5MarkersMaster from '../data/v5_markers_master.json';

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
        impacts.push({
          rsid: marker.rsid,
          name: marker.name || marker.clinical_impact || `${marker.gene} ${marker.variant}`,
          category: marker.categories[0].charAt(0).toUpperCase() + marker.categories[0].slice(1),
          trait: marker.condition || marker.gene || marker.categories[0],
          genotype: userGenotype,
          interpretation: marker.clinical_impact || marker.effect || (count === 2 ? `High impact (${targetAllele}${targetAllele})` : `Moderate impact (${targetAllele})`),
          impact: marker.clinical_impact_level?.toLowerCase() || marker.priority?.toLowerCase() || (count === 2 ? 'high' : 'moderate'),
          drugs: marker.drugs_affected || marker.drugs,
          evidence: marker.evidence,
          actionable: marker.actionable
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
          rsid,
          name: (data as any).name,
          category: 'Pharmacogenomics',
          trait: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
          genotype: userGenotype,
          interpretation: (data as any).effect,
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
          rsid,
          name: (data as any).name,
          category: 'Clinical Health',
          trait: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
          genotype: userGenotype,
          interpretation: count === 2 ? `Increased risk (${riskAllele}${riskAllele})` : `Partial risk (${riskAllele})`,
          impact: (data as any).impact || 'moderate',
          evidence: (data as any).description
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
        rsid: marker.rsid,
        name: marker.interpretation.name || marker.interpretation.trait || 'Trait Marker',
        category: marker.category,
        trait: marker.interpretation.trait || marker.category,
        genotype: userGenotype,
        interpretation: matchedInterpretation,
        impact: 'neutral',
        evidence: marker.interpretation.evidence ? `Evidence: ${marker.interpretation.evidence}` : undefined
      });
      processedRsids.add(marker.rsid.toLowerCase());
    }
  }

  return impacts;
}
