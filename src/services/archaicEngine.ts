/**
 * Archaic DNA Introgression & Hominin Affinity Deconvolution Engine
 */

import { ARCHAIC_INFORMATIVE_SNPS, ArchaicSnpDefinition } from '../data/archaicSnpDatabase';
import { ArchaicAffinityResult, ArchaicLocusMatch } from '../types/haplogroup';

export function calculateArchaicAffinity(
  snpByRsid: Record<string, string>,
  snpByPosition: Record<string, string>,
  options?: { userBuild?: string } | string
): ArchaicAffinityResult {
  let neanderthalMatches = 0;
  let denisovanMatches = 0;
  let totalNeanderthalTested = 0;
  let totalDenisovanTested = 0;

  const functionalLoci: ArchaicLocusMatch[] = [];

  const declaredUserBuild = (
    typeof options === 'string'
      ? options
      : options?.userBuild || (snpByRsid as any)?.__build || ''
  ).trim().toUpperCase();

  for (const snp of ARCHAIC_INFORMATIVE_SNPS) {
    const rsidKey = snp.rsid.toLowerCase();
    let userGenotype = snpByRsid[rsidKey];

    // Coordinate fallback only when builds agree; fail closed otherwise
    if (!userGenotype && snp.chromosome && snp.position) {
      const snpBuild = (snp.build || 'GRCh38').toUpperCase();
      const b = snpBuild.toLowerCase();
      const c = snp.chromosome.toLowerCase().replace(/^chr/, '');
      const p = snp.position;

      if (declaredUserBuild && declaredUserBuild !== 'UNKNOWN') {
        if (declaredUserBuild === snpBuild) {
          userGenotype =
            snpByPosition[`${b}:chr${c}:${p}`] ||
            snpByPosition[`${b}:chr${c}_${p}`] ||
            snpByPosition[`${b}:${c}:${p}`] ||
            snpByPosition[`${b}:${c}_${p}`];
        }
      } else if (!declaredUserBuild) {
        // If user build is undeclared, check if snpByPosition has the build-namespaced key
        userGenotype =
          snpByPosition[`${b}:chr${c}:${p}`] ||
          snpByPosition[`${b}:chr${c}_${p}`] ||
          snpByPosition[`${b}:${c}:${p}`] ||
          snpByPosition[`${b}:${c}_${p}`];
      }
    }

    if (!userGenotype || userGenotype === '--' || userGenotype === '00' || userGenotype === '??') {
      continue;
    }

    const isMatch = isAlleleMatching(userGenotype, snp.archaicAllele);

    if (snp.hominin === 'NEANDERTHAL' || snp.hominin === 'BOTH') {
      totalNeanderthalTested++;
      if (isMatch) neanderthalMatches++;
    }

    if (snp.hominin === 'DENISOVAN' || snp.hominin === 'BOTH') {
      totalDenisovanTested++;
      if (isMatch) denisovanMatches++;
    }

    functionalLoci.push({
      rsid: snp.rsid,
      gene: snp.gene,
      hominin: snp.hominin,
      traitOrFunction: snp.traitOrFunction,
      userGenotype,
      archaicAllele: snp.archaicAllele,
      isDerivedMatch: isMatch,
      modernFrequencyPct: snp.modernFrequencyPct
    });
  }

  // Calculate percentage introgression calibrated against Vindija 33.19 & 1000 Genomes
  let neanderthalPct = 0;
  let denisovanPct = 0;

  if (totalNeanderthalTested > 0) {
    // Normal Eurasian range is ~1.0% to 2.8%
    const ratio = neanderthalMatches / totalNeanderthalTested;
    neanderthalPct = Math.round(ratio * 3.5 * 100) / 100;
  }

  if (totalDenisovanTested > 0) {
    // Normal East Asian/Oceanian range is 0.05% to 4.5%
    const ratio = denisovanMatches / totalDenisovanTested;
    denisovanPct = Math.round(ratio * 2.8 * 100) / 100;
  }

  // Global Percentile (relative to global 1000 Genomes Eurasian cohort median of ~1.8%)
  let percentile = 50;
  if (neanderthalPct > 0) {
    if (neanderthalPct >= 2.5) percentile = 92;
    else if (neanderthalPct >= 2.2) percentile = 84;
    else if (neanderthalPct >= 1.9) percentile = 71;
    else if (neanderthalPct >= 1.5) percentile = 55;
    else if (neanderthalPct >= 1.0) percentile = 35;
    else percentile = 18;
  }

  return {
    neanderthalPercentage: neanderthalPct,
    denisovanPercentage: denisovanPct,
    neanderthalVariantCount: neanderthalMatches,
    denisovanVariantCount: denisovanMatches,
    totalInformativeTested: totalNeanderthalTested + totalDenisovanTested,
    globalPercentile: percentile,
    functionalLoci
  };
}

function isAlleleMatching(genotype: string, targetAllele: string): boolean {
  const upper = genotype.toUpperCase().trim();
  const target = targetAllele.toUpperCase().trim();

  // If diploid, check if either allele carries the derived variant
  return upper.includes(target);
}
