import masterAncient from '../data/master_ancient_profiles.json';

export interface IndividualMatch {
  sampleId: string;
  name: string;
  location: string;
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
    sampleId: sampleData.id,
    name: sampleData.name,
    location: sampleData.site || sampleData.location || 'Unknown',
    era: sampleData.period || sampleData.era || 'Unknown',
    affinity: Math.round(affinity),
    confidence: Math.round(confidence),
    sharedMarkers: overlappingMarkers
  };
}

export function calculateFamousMatches(userSnps: Record<string, string>): IndividualMatch[] {
  const matches: IndividualMatch[] = [];

  for (const [id, data] of Object.entries(masterAncient.samples)) {
    if (id === "_metadata") continue;

    const match = matchToAncientIndividual(userSnps, data);
    
    // Threshold: Only show matches with at least 5 markers overlapped 
    // or significant confidence/affinity
    if (match.sharedMarkers >= 3 && match.affinity >= 20) {
      matches.push(match);
    }
  }

  // Sort by affinity, then confidence
  const uniqueMatches = Array.from(new Map(matches.map(m => [m.sampleId, m])).values());
  return uniqueMatches.sort((a, b) => b.affinity - a.affinity || b.confidence - a.confidence).slice(0, 5);
}
