import historicalClusters from '../../data/ancient_historical/historical_clusters.json';

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
export function calculateHistoricalClusterMatches(userMtDna?: string, userYdna?: string): ClusterMatch[] {
  const matches: ClusterMatch[] = [];

  if (!userMtDna && !userYdna) return matches;

  historicalClusters.clusters.forEach(cluster => {
    // Maternal (mtDNA) matching
    if (userMtDna) {
      const mtMatch = cluster.signatures.find(sig => 
        userMtDna === sig.haplogroup || userMtDna.startsWith(sig.haplogroup + '.') || userMtDna.startsWith(sig.haplogroup + '-')
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
