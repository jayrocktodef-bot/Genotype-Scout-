import { parseRawDNA } from '../services/dnaParser';

/**
 * Universal DNA parser utility that extracts SNP genotype calls across all commercial
 * vendor formats (23andMe, AncestryDNA, MyHeritage, FTDNA, Living DNA, TellmeGen,
 * 24Genetics, WeGene, Dante Labs, Nebula Genomics, CircleDNA, and VCF).
 */
export function parseDNAFile(content: string, allowlist?: Set<string>): Record<string, string> {
  if (!content || content.trim().length === 0) return {};
  try {
    const parsed = parseRawDNA(content, allowlist);
    return parsed.snpMap;
  } catch (e) {
    console.warn("parseDNAFile warning:", e);
    return {};
  }
}
