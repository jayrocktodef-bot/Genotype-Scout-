import masterAncient from '../data/master_ancient_profiles.json';

export interface IndividualMatch {
  sampleId: string;
  name: string;
  location: string;
  continent?: string;
  era: string;
  affinity: number;      // The similarity score
  confidence: number;    // How reliable the match is (0-100)
  sharedMarkers: number;
}

export function matchToAncientIndividual(
  userSnps: Record<string, string>,
  sampleData: any
): IndividualMatch {
  let weightedMatches = 0;
  let totalPossibleWeight = 0;
  let overlappingMarkers = 0;

  // The JSON uses "snps" or "genotypes"
  const markers = sampleData.snps || sampleData.genotypes || {}; 
  const weights = sampleData.weights || {};

  for (const [rsid, targetGenotype] of Object.entries(markers)) {
    const userGenotype = userSnps[rsid.toLowerCase()];
    if (!userGenotype) continue; // Marker missing in user data

    overlappingMarkers++;
    const weight = (weights as any)[rsid] || 1;
    totalPossibleWeight += weight;

    if (userGenotype === targetGenotype) {
      weightedMatches += weight;
    } else {
      weightedMatches -= (weight * 0.5); // Penalty for conflict
    }
  }

  // Calculate Affinity (The "Twin" Score)
  const affinity = totalPossibleWeight > 0 ? Math.max(0, (weightedMatches / totalPossibleWeight) * 100) : 0;

  // Calculate Confidence (The "Data Quality" Score)
  const confidence = Math.min(100, (overlappingMarkers / 30) * 100);

  return {
    sampleId: sampleData.id || sampleData.sampleId,
    name: sampleData.name,
    location: sampleData.site || sampleData.location || 'Unknown',
    continent: sampleData.continent || sampleData.region || 'Other',
    era: sampleData.period || sampleData.era || 'Unknown',
    affinity: Math.round(affinity),
    confidence: Math.round(confidence),
    sharedMarkers: overlappingMarkers
  };
}

export function calculateFamousMatches(userSnps: Record<string, string>): IndividualMatch[] {
  const matches: IndividualMatch[] = [];

  const rawSamples = [
    ...Object.values(masterAncient.samples).filter(s => (s as any).id),
    ...((masterAncient as any).matches || [])
  ];

  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  for (const data of rawSamples) {
    if (!data || typeof data !== 'object') continue;
    const id = (data as any).id || (data as any).sampleId;
    const rawName = ((data as any).name || '').toLowerCase();
    const nameKey = rawName.replace(/\(.*?\)/g, '').replace(/[^a-z]/g, '');

    if (id && !seenIds.has(id) && !seenNames.has(nameKey)) {
      seenIds.add(id);
      seenNames.add(nameKey);

      const match = matchToAncientIndividual(userSnps, data);
      if (match.sharedMarkers >= 3 && match.affinity >= 20) {
        matches.push(match);
      }
    }
  }

  // Sort by affinity, then confidence
  return matches.sort((a, b) => b.affinity - a.affinity || b.confidence - a.confidence).slice(0, 5);
}
