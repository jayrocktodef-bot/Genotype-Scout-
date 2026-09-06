import { ALL_DEFINING_SNPS } from '../data/snpDatabase';
import { Y_DNA_HAPLOGROUPS, MT_DNA_HAPLOGROUPS } from '../data/haplogroupTree';
import { DIAGNOSTIC_LD_PROXIES } from '../data/ldProxies';
import { snpAliasResolver } from '../data/snpAliasIndex';
import { ParsedDnaData } from './dnaParser';
import {
  DnaAnalysisResult,
  EvaluatedMarker,
  HaplogroupDefinition,
  LineageAnalysis,
  LineageType,
  MarkerStatus
} from '../types/haplogroup';

interface HaploScore {
  haplogroup: HaplogroupDefinition;
  positives: number;
  weightedScore: number;
  negatives: number;
  totalMarkers: number;
  depth: number;
  hasAncestralConflict: boolean;
}

export class HaplogroupClassifier {
  public static analyze(kitName: string, parsedData: ParsedDnaData): DnaAnalysisResult {
    // 1. Evaluate all defining SNPs against user genomic data (with LD Proxy Imputation)
    const evaluatedMarkers = this.evaluateMarkersWithLD(parsedData);

    // 2. Classify Paternal Lineage (Y-DNA) with DAG Tree Walking & Negative Guarding
    const yMarkers = evaluatedMarkers.filter(m => m.snp.lineageType === 'PATERNAL_YDNA');
    const hasYData = parsedData.yDnaSnps > 0 || yMarkers.some(m => m.status !== 'NO_CALL');
    const paternalLineage = hasYData ? this.classifyLineage('PATERNAL_YDNA', yMarkers) : null;

    // 3. Classify Maternal Lineage (mtDNA) with Weighted Transversion Matrix
    const mtMarkers = evaluatedMarkers.filter(m => m.snp.lineageType === 'MATERNAL_MTDNA');
    const maternalLineage = this.classifyLineage('MATERNAL_MTDNA', mtMarkers);

    const isMale = paternalLineage !== null && yMarkers.some(m => m.status === 'POSITIVE_DERIVED');

    return {
      id: `kit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      kitName,
      timestamp: Date.now(),
      rawFileFormat: parsedData.format,
      totalSnpsParsed: parsedData.totalSnps,
      yDnaSnpsCount: parsedData.yDnaSnps,
      mtDnaSnpsCount: parsedData.mtDnaSnps,
      paternalLineage,
      maternalLineage,
      isMaleSample: isMale
    };
  }

  private static evaluateMarkersWithLD(parsedData: ParsedDnaData): EvaluatedMarker[] {
    const result: EvaluatedMarker[] = [];

    for (const snp of ALL_DEFINING_SNPS) {
      const rsidKey = snp.rsid.toLowerCase();
      const posKey = `${snp.chromosome.toLowerCase()}:${snp.position}`;

      let userGenotype = parsedData.snpByRsid[rsidKey] || parsedData.snpByPosition[posKey];

      // Multi-Vendor Alias Resolution: Check synonymous rsIDs, P-markers, CTS-numbers if uncalled
      if (!userGenotype || userGenotype === '--') {
        const aliasEntry = snpAliasResolver.resolveName(snp.name) || snpAliasResolver.resolveName(snp.rsid);
        if (aliasEntry) {
          for (const alias of aliasEntry.aliases) {
            const val = parsedData.snpByRsid[alias.toLowerCase()];
            if (val && val !== '--' && val !== '00' && val !== '??') {
              userGenotype = val;
              break;
            }
          }
        }
      }

      if (!userGenotype) userGenotype = '--';
      let isImputed = false;
      let imputedFrom = undefined;

      // LD Proxy Imputation: If primary SNP is uncalled or missing from commercial chip, test high r² proxies
      if ((userGenotype === '--' || !userGenotype) && DIAGNOSTIC_LD_PROXIES[snp.rsid]) {
        const proxies = DIAGNOSTIC_LD_PROXIES[snp.rsid];
        for (const proxy of proxies) {
          const proxyRsidKey = proxy.proxyRsid.toLowerCase();
          const proxyPosKey = `${proxy.proxyChr.toLowerCase()}:${proxy.proxyPos}`;
          const proxyGenotype = parsedData.snpByRsid[proxyRsidKey] || parsedData.snpByPosition[proxyPosKey];

          if (proxyGenotype && proxyGenotype !== '--' && proxyGenotype !== '00' && proxyGenotype !== '??') {
            if (this.isGenotypeMatching(proxyGenotype, proxy.proxyDerived)) {
              userGenotype = snp.derivedAllele;
              isImputed = true;
              imputedFrom = `${proxy.proxyRsid} (r²=${proxy.r2})`;
              break;
            } else if (this.isGenotypeMatching(proxyGenotype, proxy.proxyAncestral)) {
              userGenotype = snp.ancestralAllele;
              isImputed = true;
              imputedFrom = `${proxy.proxyRsid} (r²=${proxy.r2})`;
              break;
            }
          }
        }
      }

      let status: MarkerStatus = 'NO_CALL';
      let details = '';

      // Calculate mutation weight: Transversions (A<->C, G<->T) get 5x weight; Transitions (A<->G, C<->T) get 1x
      const mutationWeight = this.getMutationWeight(snp.ancestralAllele, snp.derivedAllele);

      if (userGenotype === '--' || !userGenotype) {
        status = 'NO_CALL';
        details = 'Marker uncalled or not covered in raw data.';
      } else if (this.isGenotypeMatching(userGenotype, snp.derivedAllele)) {
        status = 'POSITIVE_DERIVED';
        details = isImputed 
          ? `Derived allele [${snp.derivedAllele}] imputed via high LD proxy ${imputedFrom}. Positive for clade ${snp.haplogroup}.`
          : `Derived mutation detected (${snp.derivedAllele}). Positive for clade ${snp.haplogroup}.`;
      } else if (this.isGenotypeMatching(userGenotype, snp.ancestralAllele)) {
        status = 'NEGATIVE_ANCESTRAL';
        details = isImputed 
          ? `Ancestral base [${snp.ancestralAllele}] inferred via LD proxy ${imputedFrom}. Unmutated.`
          : `Ancestral allele observed (${snp.ancestralAllele}). Unmutated.`;
      } else {
        status = 'MISMATCH';
        details = `Genotype '${userGenotype}' differs from expected ancestral (${snp.ancestralAllele}) & derived (${snp.derivedAllele}).`;
      }

      result.push({
        snp,
        userGenotype,
        status,
        details,
        isImputed,
        imputedFrom,
        mutationWeight
      });
    }

    return result;
  }

  private static getMutationWeight(ancestral: string, derived: string): number {
    const a = ancestral.toUpperCase();
    const d = derived.toUpperCase();
    
    // Transitions: A <-> G, C <-> T (weight = 1.0)
    if ((a === 'A' && d === 'G') || (a === 'G' && d === 'A') ||
        (a === 'C' && d === 'T') || (a === 'T' && d === 'C')) {
      return 1.0;
    }
    // Transversions: A <-> C, A <-> T, C <-> G, G <-> T, Indels (weight = 4.5)
    return 4.5;
  }

  private static isGenotypeMatching(userGenotype: string, targetAllele: string): boolean {
    const u = userGenotype.toUpperCase();
    const t = targetAllele.toUpperCase();

    if (t === 'INS' || t === 'I') return u.includes('I') || u.includes('INS');
    if (t === 'DEL' || t === 'D') return u.includes('D') || u.includes('DEL');

    return u.includes(t);
  }

  private static classifyLineage(type: LineageType, markers: EvaluatedMarker[]): LineageAnalysis {
    const haplogroups = type === 'PATERNAL_YDNA' ? Y_DNA_HAPLOGROUPS : MT_DNA_HAPLOGROUPS;

    // Check ancestral status of major root clades to guard against false descendant matching
    const ancestralBlockedClades = new Set<string>();
    for (const m of markers) {
      if (m.status === 'NEGATIVE_ANCESTRAL') {
        ancestralBlockedClades.add(m.snp.haplogroup.toLowerCase());
      }
    }

    const scoredHaplos: HaploScore[] = haplogroups.map(haplo => {
      const haploMarkers = markers.filter(m => 
        haplo.definingSnps.some(s => 
          s.toLowerCase() === m.snp.name.toLowerCase() ||
          s.toLowerCase() === m.snp.rsid.toLowerCase() ||
          s.toLowerCase() === m.snp.haplogroup.toLowerCase() ||
          haplo.code.toLowerCase() === m.snp.haplogroup.toLowerCase()
        )
      );

      const positives = haploMarkers.filter(m => m.status === 'POSITIVE_DERIVED').length;
      const negatives = haploMarkers.filter(m => m.status === 'NEGATIVE_ANCESTRAL').length;

      // Calculate weighted mutational support
      const weightedScore = haploMarkers
        .filter(m => m.status === 'POSITIVE_DERIVED')
        .reduce((sum, m) => sum + (m.mutationWeight || 1.0), 0);

      // Check if any ancestor on the path was definitively negative (Ancestral Guard)
      const path = this.buildLineagePath(haplo, haplogroups);
      const hasAncestralConflict = path.some(p => ancestralBlockedClades.has(p.code.toLowerCase()) && p.code !== haplo.code);

      return {
        haplogroup: haplo,
        positives,
        weightedScore,
        negatives,
        totalMarkers: haploMarkers.length,
        depth: this.calculateCladeDepth(haplo, haplogroups),
        hasAncestralConflict
      };
    });

    // Valid candidates must not violate ancestral root boundaries and must have positive support
    const validCandidates = scoredHaplos.filter(h => h.positives > 0 && !h.hasAncestralConflict);

    validCandidates.sort((a, b) => {
      if (b.weightedScore !== a.weightedScore) return b.weightedScore - a.weightedScore;
      if (b.depth !== a.depth) return b.depth - a.depth;
      return a.negatives - b.negatives;
    });

    const bestCandidate = validCandidates[0] || scoredHaplos.filter(h => h.positives > 0)[0] || scoredHaplos[0] || {
      haplogroup: haplogroups[0],
      positives: 0,
      weightedScore: 0,
      negatives: 0,
      totalMarkers: 0,
      depth: 1,
      hasAncestralConflict: false
    };

    const treePath = this.buildLineagePath(bestCandidate.haplogroup, haplogroups);

    const totalPos = markers.filter(m => m.status === 'POSITIVE_DERIVED').length;
    const totalNeg = markers.filter(m => m.status === 'NEGATIVE_ANCESTRAL').length;

    let confidence = 30;
    if (bestCandidate.positives > 0) {
      const baseConfidence = bestCandidate.positives >= 3 ? 99 : (bestCandidate.positives === 2 ? 96 : 90);
      confidence = Math.max(50, Math.min(99, baseConfidence - (bestCandidate.negatives * 8)));
    }

    return {
      lineageType: type,
      terminalHaplogroup: bestCandidate.haplogroup,
      confidenceScore: confidence,
      positiveCount: totalPos,
      negativeCount: totalNeg,
      totalTestedMarkers: markers.length,
      lineageTreePath: treePath,
      evaluatedMarkers: markers
    };
  }

  private static calculateCladeDepth(haplo: HaplogroupDefinition, allHaplos: HaplogroupDefinition[]): number {
    let depth = 1;
    let current: HaplogroupDefinition | undefined = haplo;
    while (current?.parentClade) {
      depth++;
      const parentCode: string = current.parentClade;
      current = allHaplos.find(h => h.code.toLowerCase() === parentCode.toLowerCase());
    }
    return depth;
  }

  private static buildLineagePath(terminal: HaplogroupDefinition, allHaplos: HaplogroupDefinition[]): HaplogroupDefinition[] {
    const path: HaplogroupDefinition[] = [];
    let current: HaplogroupDefinition | undefined = terminal;
    while (current) {
      path.unshift(current);
      if (!current.parentClade) break;
      const parentCode: string = current.parentClade;
      current = allHaplos.find(h => h.code.toLowerCase() === parentCode.toLowerCase());
    }
    return path;
  }
}
