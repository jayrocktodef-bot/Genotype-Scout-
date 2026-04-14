export function parseDNAFile(content: string): Record<string, string> {
  const lines = content.split(/\r?\n/);
  const genotypes: Record<string, string> = {};

  for (let line of lines) {
    line = line.trim();
    // Skip comments and empty lines
    if (!line || line.startsWith('#')) continue;

    // Handle CSV (FTDNA, MyHeritage) and TSV (23andMe, Ancestry, Living DNA)
    // We remove quotes for FTDNA/MyHeritage CSV formats
    const parts = line.replace(/"/g, "").split(/[\t,]+/);
    
    if (parts.length < 4) continue;

    const markerId = parts[0].trim();
    
    // Skip header lines commonly found in FTDNA or other formats
    const lowerMarker = markerId.toLowerCase();
    if (lowerMarker === 'rsid' || lowerMarker === 'snp' || lowerMarker === 'marker') continue;

    let genotype = "";

    // AncestryDNA format: rsid, chr, pos, allele1, allele2
    // It has 5 columns where the last two are single alleles
    if (parts.length >= 5 && parts[3].length === 1 && parts[4].length === 1) {
      const a1 = parts[3].trim();
      const a2 = parts[4].trim();
      if (a1 !== '0' && a2 !== '0' && a1 !== '-' && a2 !== '-') {
        genotype = a1 + a2;
      }
    } else {
      // 23andMe, FTDNA, Living DNA, MyHeritage format: rsid, chr, pos, genotype
      genotype = parts[3].trim();
    }

    // Basic validation for genotype
    if (genotype && genotype !== '--' && genotype !== '00' && /^[ACTG]{1,2}$/i.test(genotype)) {
      genotypes[markerId] = genotype.toUpperCase();
    }
  }

  return genotypes;
}
