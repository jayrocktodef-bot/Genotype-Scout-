import grafIndex from '../data/graf_10k_index.json';
import forensicAims from '../data/forensic_aims_master.json';
import deepAims from '../data/deep_resolution_aims.json';
import euroforgenPanel from '../data/euroforgen_name_panel.json';

export interface MarkerSetBenchmark {
  name: string;
  count: number;
  total: number;
  percentage: number;
  description: string;
}

export function calculateMarkerBenchmarks(userSnps: Record<string, string>): MarkerSetBenchmark[] {
  const normalizedSnps = Object.fromEntries(
    Object.entries(userSnps).map(([k, v]) => [k.toLowerCase(), v])
  );

  const benchmarks: MarkerSetBenchmark[] = [];

  // GRAF 10k
  const grafTotal = Object.keys(grafIndex).length;
  let grafCount = 0;
  for (const rsid in grafIndex) {
    if (normalizedSnps[rsid.toLowerCase()]) grafCount++;
  }
  benchmarks.push({
    name: 'NCBI GRAF-10k',
    count: grafCount,
    total: grafTotal,
    percentage: Math.round((grafCount / grafTotal) * 100),
    description: 'Ancestry fingerprinting set used by NCBI for population tracking.'
  });

  // Forensic AIMs
  const forensicTotal = forensicAims.length;
  let forensicCount = 0;
  for (const aim of forensicAims as any[]) {
    if (normalizedSnps[aim.rsid.toLowerCase()]) forensicCount++;
  }
  benchmarks.push({
    name: 'VISAGE Forensic AIMs',
    count: forensicCount,
    total: forensicTotal,
    percentage: Math.round((forensicCount / forensicTotal) * 100),
    description: 'Markers used in forensic science for continental admixture and phenotype prediction.'
  });

  // Deep Resolution / HLA
  const deepTotal = deepAims.length;
  let deepCount = 0;
  for (const aim of deepAims as any[]) {
    if (normalizedSnps[aim.rsid.toLowerCase()]) deepCount++;
  }
  benchmarks.push({
    name: 'Precision Ancestry (SGDP/HLA)',
    count: deepCount,
    total: deepTotal,
    percentage: Math.round((deepCount / deepTotal) * 100),
    description: 'High-resolution markers for fine-grained regional and immunological ancestry.'
  });

  // EUROFORGEN NAME
  if (euroforgenPanel && euroforgenPanel.markers) {
    const euroTotal = euroforgenPanel.markers.length;
    let euroCount = 0;
    for (const rsid of euroforgenPanel.markers) {
      if (normalizedSnps[rsid.toLowerCase()]) euroCount++;
    }
    benchmarks.push({
      name: 'EUROFORGEN NAME',
      count: euroCount,
      total: euroTotal,
      percentage: Math.round((euroCount / euroTotal) * 100),
      description: 'North Africa & Middle East specific markers for regional ancestry resolution.'
    });
  }

  return benchmarks;
}
