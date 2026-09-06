import masterAncient from '../../data/master_ancient_profiles.json';

export interface ClusterMatch {
  clusterId: string;
  clusterName: string;
  affinity: 'High' | 'Moderate' | 'Low';
  haplogroup: string;
  origin: string;
  description: string;
  location: string;
  period: string;
  tags?: string[];
}

/**
 * Calculates high-confidence affinity between user's haplogroups and historical burial/site clusters.
 */
export function calculateHistoricalClusterMatches(userMtDna?: any, userYdna?: any): ClusterMatch[] {
  const matches: ClusterMatch[] = [];

  const mtStr = typeof userMtDna === 'string' ? userMtDna : (userMtDna?.name || userMtDna?.haplogroup || '');
  const yStr = typeof userYdna === 'string' ? userYdna : (userYdna?.name || userYdna?.haplogroup || '');

  if (!mtStr && !yStr) return matches;

  (masterAncient as any).clusters.forEach((cluster: any) => {
    // Maternal (mtDNA) matching
    if (mtStr) {
      const mtMatch = cluster.signatures.find((sig: any) => 
        mtStr === sig.haplogroup || mtStr.startsWith(sig.haplogroup + '.') || mtStr.startsWith(sig.haplogroup + '-')
      );

      if (mtMatch) {
        matches.push({
          clusterId: cluster.id,
          clusterName: cluster.name,
          affinity: 'High',
          haplogroup: mtMatch.haplogroup,
          origin: mtMatch.origin,
          description: cluster.description,
          location: cluster.location,
          period: cluster.period,
          tags: (cluster as any).tags
        });
      }
    }
  });

  return matches;
}
