import grafIndex from '../data/raw_aims/graf_10k_index.json';
import forensicAims from '../data/raw_aims/forensic_aims_master.json';
import deepAims from '../data/raw_aims/deep_resolution_aims.json';
import euroforgenPanel from '../data/raw_aims/euroforgen_name_panel.json';
import customCuratedMarkers from '../data/raw_aims/custom_curated_markers.json';

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

  // Custom Curated
  const customTotal = Object.keys(customCuratedMarkers).length;
  let customCount = 0;
  for (const rsid in customCuratedMarkers) {
    if (normalizedSnps[rsid.toLowerCase()]) customCount++;
  }
  benchmarks.push({
    name: 'Custom Curated Panel',
    count: customCount,
    total: customTotal,
    percentage: customTotal > 0 ? Math.round((customCount / customTotal) * 100) : 0,
    description: 'Specialized markers curated for high-precision diagnostic and research focus.'
  });

  // Kidd 55 AIM Panel
  const KIDD_55 = [
    "rs10756819", "rs10958548", "rs1108232", "rs1129038", "rs12203592", "rs12913832", 
    "rs13214040", "rs1351394", "rs1426654", "rs1476413", "rs1544325", "rs1617682", 
    "rs16891982", "rs17287498", "rs1800407", "rs1927914", "rs2066827", "rs2104511", 
    "rs2184030", "rs2238289", "rs2315024", "rs2336873", "rs2395858", "rs2527993", 
    "rs2814778", "rs3027440", "rs3122629", "rs3811801", "rs3827760", "rs444326", 
    "rs4540055", "rs4821544", "rs4973341", "rs4988235", "rs5006884", "rs5757827", 
    "rs6119471", "rs6133167", "rs682", "rs6995436", "rs7041", "rs7131232", 
    "rs7251928", "rs738322", "rs7495174", "rs7671167", "rs7739969", "rs8038629", 
    "rs849140", "rs8862", "rs910624", "rs9272376", "rs9829807", "rs9883255", "rs9951171"
  ];
  let kiddCount = 0;
  for (const rsid of KIDD_55) {
    if (normalizedSnps[rsid.toLowerCase()]) kiddCount++;
  }
  benchmarks.push({
    name: 'Kidd 55-AIM Panel',
    count: kiddCount,
    total: KIDD_55.length,
    percentage: Math.round((kiddCount / KIDD_55.length) * 100),
    description: 'Ancestry Informative Markers proposed by Kidd et al. optimized for global population structure.'
  });

  // Seldin 128 AIM Panel
  const SELDIN_128 = [
    "rs1008121", "rs10129215", "rs1042531", "rs10484725", "rs10521310", "rs10741285", 
    "rs10776839", "rs10862024", "rs10865507", "rs10888503", "rs10931559", "rs11003444", 
    "rs11024523", "rs11065987", "rs11083324", "rs11119561", "rs11211843", "rs11612053", 
    "rs11618683", "rs11646276", "rs11736767", "rs12048995", "rs12057771", "rs12242137", 
    "rs12255743", "rs12411516", "rs12519119", "rs12521575", "rs12543329", "rs12550186", 
    "rs12558488", "rs12563300", "rs12702758", "rs12723223", "rs12725178", "rs12752179", 
    "rs12771217", "rs12779603", "rs12781443", "rs12913832", "rs13028308", "rs13083697", 
    "rs13104680", "rs13115450", "rs13222530", "rs1337424", "rs1351394", "rs1380629", 
    "rs1385413", "rs1416952", "rs1418385", "rs1426654", "rs1433857", "rs1454530", 
    "rs1459424", "rs1469581", "rs1469584", "rs1481119", "rs1544325", "rs1544983", 
    "rs1551607", "rs1569420", "rs1600277", "rs1617682", "rs1617757", "rs1649987", 
    "rs167527", "rs16891982", "rs16912386", "rs17132398", "rs17205166", "rs17287498", 
    "rs17424610", "rs17441589", "rs1744654", "rs17457788", "rs17631341", "rs17711929", 
    "rs17713481", "rs17726590", "rs1800407", "rs1819777", "rs1864195", "rs1878347", 
    "rs1880476", "rs1883652", "rs1906252", "rs1927914", "rs2030509", "rs2064239", 
    "rs2066827", "rs2071650", "rs2075677", "rs2104511", "rs2120610", "rs2227658", 
    "rs2238289", "rs2240751", "rs2243550", "rs2252119", "rs2254425", "rs2268750", 
    "rs2286950", "rs2294101", "rs2297127", "rs2336873", "rs2358908", "rs2372580", 
    "rs2382813", "rs2395858", "rs2411933", "rs2432968", "rs2438183", "rs2527993", 
    "rs2581024", "rs2581030", "rs2610580", "rs2615462", "rs2814778", "rs2814800", 
    "rs2855800", "rs2891333", "rs3027440", "rs3122629", "rs346853", "rs3811801", 
    "rs3827760", "rs444326"
  ];
  let seldinCount = 0;
  for (const rsid of SELDIN_128) {
    if (normalizedSnps[rsid.toLowerCase()]) seldinCount++;
  }
  benchmarks.push({
    name: 'Seldin 128-AIM Panel',
    count: seldinCount,
    total: SELDIN_128.length,
    percentage: Math.round((seldinCount / SELDIN_128.length) * 100),
    description: 'Ancestry Informative Markers curated by Seldin et al. for robust continental structure differentiation.'
  });

  return benchmarks;
}
