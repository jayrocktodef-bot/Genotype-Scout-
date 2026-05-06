import ancientCultures from '../data/reference/ancient_cultures.json';

export interface CultureMatch {
  id: string;
  name: string;
  matchScore: number; // Percentage of markers matched
  description: string;
  icon: string;
  color: string;
}

export function calculateWeightedAffinity(
  userSnps: Record<string, string>,
  cultureData: any
) {
  let totalWeight = 0;
  let userScore = 0;

  const markers = cultureData.genetic_profile?.key_markers;
  const weights = cultureData.genetic_profile?.marker_weights || {};

  if (!markers) return 0;

  for (const [rsid, expected] of Object.entries(markers)) {
    const userGenotype = userSnps[rsid.toLowerCase()];
    if (!userGenotype) continue;

    const weight = (weights as any)[rsid] || 1;
    totalWeight += weight;

    const isMatch = Array.isArray(expected) 
      ? (expected as string[]).includes(userGenotype) 
      : expected === userGenotype;

    if (isMatch) {
      userScore += weight;
    } else {
      userScore -= (weight * 0.5); 
    }
  }

  return totalWeight > 0 ? Math.max(0, Math.round((userScore / totalWeight) * 100)) : 0;
}

export function calculateAncientAffinity(userSnps: Record<string, string>): CultureMatch[] {
  const matches: CultureMatch[] = [];

  for (const [id, data] of Object.entries(ancientCultures)) {
    if (id === "_metadata") continue;

    const score = calculateWeightedAffinity(userSnps, data);
    
    // Only show cultures where the user has a significant affinity
    if (score >= 40) {
      matches.push({
        id,
        name: (data as any).name,
        matchScore: score,
        description: (data as any).description,
        icon: (data as any).icon,
        color: (data as any).color
      });
    }
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}
