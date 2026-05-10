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
  let weightedDistance = 0;
  let totalWeight = 0;

  const markers = cultureData.genetic_profile?.key_markers;
  const weights = cultureData.genetic_profile?.marker_weights || {};

  if (!markers) return { score: 0, distance: 999 };

  for (const [rsid, expected] of Object.entries(markers)) {
    const userGenotype = userSnps[rsid.toLowerCase()];
    if (!userGenotype) continue;

    const weight = (weights as any)[rsid] || 1;
    totalWeight += weight;

    // Use Allelic Distance (IBS)
    let distance = 2; // Default to mismatch
    
    const u = (userGenotype as string).split('');
    const e = Array.isArray(expected) ? (expected[0] as string) : (expected as string);
    const esp = e.split('');
    
    if (userGenotype === e) {
      distance = 0;
    } else {
      // Check shared alleles
      const uArr = [...u];
      const eArr = [...esp];
      let shared = 0;
      uArr.forEach(a => {
        const idx = eArr.indexOf(a);
        if (idx !== -1) {
          shared++;
          eArr.splice(idx, 1);
        }
      });
      distance = 2 - shared;
    }

    weightedDistance += distance * weight;
  }

  const maxDist = totalWeight * 2;
  const score = maxDist > 0 ? Math.max(0, 100 * (1 - (weightedDistance / maxDist))) : 0;

  return { score, distance: weightedDistance };
}

export function calculateAncientAffinity(userSnps: Record<string, string>): CultureMatch[] {
  const matches: CultureMatch[] = [];

  for (const [id, data] of Object.entries(ancientCultures)) {
    if (id === "_metadata") continue;

    const { score, distance } = calculateWeightedAffinity(userSnps, data);
    
    // Only show cultures where the user has a significant affinity
    if (score >= 35) {
      matches.push({
        id,
        name: (data as any).name,
        matchScore: Math.round(score),
        description: (data as any).description,
        icon: (data as any).icon,
        color: (data as any).color,
        distance: distance
      } as any);
    }
  }

  // Sort by genetic distance (closest to furthest)
  return matches.sort((a: any, b: any) => a.distance - b.distance);
}
