export function parseDNAFile(content: string): Record<string, string> {
  const lines = content.split('\n');
  const genotypes: Record<string, string> = {};

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;

    // Split by tab or space
    const parts = line.split(/\s+/);
    
    // 23andMe format: rsid, chr, pos, genotype
    if (parts.length >= 4 && parts[0].startsWith('rs')) {
      const rsid = parts[0];
      const genotype = parts[3];
      if (genotype && genotype.length <= 2 && genotype !== '--') {
        genotypes[rsid] = genotype;
      }
    }
    
    // AncestryDNA format: rsid, chr, pos, allele1, allele2
    if (parts.length >= 5 && parts[0].startsWith('rs')) {
      const rsid = parts[0];
      const a1 = parts[3];
      const a2 = parts[4];
      if (a1 && a2 && a1 !== '0' && a2 !== '0') {
        genotypes[rsid] = a1 + a2;
      }
    }
  }

  return genotypes;
}
