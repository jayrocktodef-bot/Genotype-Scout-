import { RawSnp } from '../types/haplogroup';
import { YPhylotreeDataset, YPhylotreeBranch, YSnpRecord } from '../utils/yPhylotree';
import {
  isPalindromicMutation,
  matchGenotypeAllele,
  isYAmpliconicRegion
} from '../utils/genomicMasks';
import { isRecurrentSnp } from '../utils/homoplasyDatabase';
import { isPlatformNoisyLocus } from '../utils/chipNoiseDatabase';

export interface YDnaPredictionDetails {
  terminalHaplogroup: string;
  confidence: number;
  coverage: number;            // % of defining SNPs with allele data in user sample
  derivedSnpCount: number;     // number of derived-state defining SNPs matched
  ancestralSnpCount: number;   // number of ancestral-state defining SNPs matched
  nonPalindromicDerivedCount: number;
  palindromicDerivedCount: number;
  recurrentDerivedCount: number;
  isPalindromicAmbiguous: boolean;
  isProvisionalTerminal?: boolean;
  apexAnchorClade?: string;
  inferredBiologicalSex?: 'MALE' | 'FEMALE' | 'UNKNOWN';
  path: string[];              // traversal path from root to terminal
  rejectedBranches: string[];  // branches rejected due to ancestral defining SNPs
  derivedMarkers: {
    name: string;
    rsid?: string;
    allele: string;
    mutation?: string;
    branch: string;
    isPalindromic?: boolean;
    isAmpliconic?: boolean;
    isRecurrent?: boolean;
    isChipNoiseProne?: boolean;
  }[];
  ancestralMarkers: {
    name: string;
    rsid?: string;
    allele: string;
    mutation?: string;
    branch: string;
    isPalindromic?: boolean;
    isAmpliconic?: boolean;
    isRecurrent?: boolean;
    isChipNoiseProne?: boolean;
  }[];
}

export interface RawGenomicInput {
  snpByRsid: Record<string, string>;
  snpByPosition: Record<string, string>;
  platform?: string;
}

export type YDnaInput = RawGenomicInput | RawSnp[] | Array<{ name?: string; rsid?: string; allele: string }>;

/**
 * Phase 2 Y-DNA Phylogenetic Inference Engine (Enhanced with Signal Integrity)
 *
 * Traverses the ISOGG phylogenetic tree dataset with strict validation rules:
 * 1. Confirm derived-only: only accept a branch if defining SNPs are confirmed derived.
 * 2. Reject ancestral with Ampliconic & Consensus recovery:
 *    - Skip branches where defining SNPs are ancestral, UNLESS the ancestral call resides
 *      in known Y ampliconic/AZF microdeletion regions (structural unobserved), OR
 *    - Downstream descendant branches accumulate >= 2 derived markers.
 * 3. Palindromic SNP Guard:
 *    - A/T and C/G mutations are flag-tagged as palindromic (susceptible to unstranded array flip).
 *    - Sole-palindromic deep branches cannot overturn non-palindromic supported parents without >= 2 markers.
 * 4. Multi-modal genomic lookup & Indel normalization (D/I, -/+, <DEL>, <INS>).
 */
export class YDnaPredictorV2 {
  private dataset: YPhylotreeDataset;
  private branchMap: Map<string, YPhylotreeBranch>;
  private childrenMap: Map<string, YPhylotreeBranch[]>;

  constructor(dataset: YPhylotreeDataset) {
    this.dataset = dataset;
    this.branchMap = new Map();
    this.childrenMap = new Map();

    for (const branch of dataset.branches) {
      this.branchMap.set(branch.branchName, branch);
      const parentKey = branch.parent || 'root';
      if (!this.childrenMap.has(parentKey)) {
        this.childrenMap.set(parentKey, []);
      }
      this.childrenMap.get(parentKey)!.push(branch);
    }
  }

  private resolveSnpAllele(
    snp: YSnpRecord,
    input: RawGenomicInput
  ): string | null {
    // 1. By uppercased/lowercased name
    const byName = input.snpByRsid[snp.name.toLowerCase()] || input.snpByRsid[snp.name.toUpperCase()];
    if (byName && byName !== '--' && byName !== '00' && byName !== '??' && byName !== 'II') return byName;

    // 2. By rsid
    if (snp.rsid) {
      const byRsid = input.snpByRsid[snp.rsid.toLowerCase()] || input.snpByRsid[snp.rsid.toUpperCase()];
      if (byRsid && byRsid !== '--' && byRsid !== '00' && byRsid !== '??' && byRsid !== 'II') return byRsid;
    }

    // 3. By hg38 position
    if (snp.posHg38) {
      const byPos38 = input.snpByPosition[`y:${snp.posHg38}`];
      if (byPos38 && byPos38 !== '--' && byPos38 !== '00' && byPos38 !== '??' && byPos38 !== 'II') return byPos38;
    }

    // 4. By hg19 position
    if (snp.posHg19) {
      const byPos19 = input.snpByPosition[`y:${snp.posHg19}`];
      if (byPos19 && byPos19 !== '--' && byPos19 !== '00' && byPos19 !== '??' && byPos19 !== 'II') return byPos19;
    }

    return null;
  }

  public predict(rawInput: YDnaInput): YDnaPredictionDetails {
    let input: RawGenomicInput;
    if (Array.isArray(rawInput)) {
      const snpByRsid: Record<string, string> = {};
      const snpByPosition: Record<string, string> = {};
      for (const item of rawInput) {
        if (!item.allele || item.allele === '--' || item.allele === '00' || item.allele === 'II' || item.allele === '??') {
          continue;
        }
        if (item.name) {
          snpByRsid[item.name.toLowerCase()] = item.allele;
          snpByRsid[item.name.toUpperCase()] = item.allele;
        }
        if (item.rsid) {
          snpByRsid[item.rsid.toLowerCase()] = item.allele;
          snpByRsid[item.rsid.toUpperCase()] = item.allele;
        }
        if ((item as any).posHg38) {
          snpByPosition[`y:${(item as any).posHg38}`] = item.allele;
        }
        if ((item as any).posHg19) {
          snpByPosition[`y:${(item as any).posHg19}`] = item.allele;
        }
      }
      input = { snpByRsid, snpByPosition };
    } else {
      input = rawInput;
    }

    let bestTerminal = 'A';
    let bestConfidence = 0;
    let bestCoverage = 0;
    let bestDerived = 0;
    let bestAncestral = 0;
    let bestPath: string[] = [];
    const rejectedBranches: string[] = [];
    let bestDepth = 0;
    let bestIsPalindromicAmbiguous = false;
    let bestIsProvisional = false;
    let bestApexAnchor: string | undefined = undefined;

    const matchedDerivedList: {
      name: string;
      rsid?: string;
      allele: string;
      mutation?: string;
      branch: string;
      isPalindromic?: boolean;
      isAmpliconic?: boolean;
      isRecurrent?: boolean;
      isChipNoiseProne?: boolean;
    }[] = [];

    const matchedAncestralList: {
      name: string;
      rsid?: string;
      allele: string;
      mutation?: string;
      branch: string;
      isPalindromic?: boolean;
      isAmpliconic?: boolean;
      isRecurrent?: boolean;
      isChipNoiseProne?: boolean;
    }[] = [];

    const traverse = (
      branchName: string,
      depth: number,
      path: string[],
      derivedSnps: Set<string>,
      ancestralSnps: Set<string>,
    ) => {
      const branch = this.branchMap.get(branchName);
      if (!branch) return;

      let localDerived = 0;
      let localAncestral = 0;
      let localCovered = 0;
      let newLocalDerived = 0;
      let localAmpliconicAncestral = 0;
      let localPalindromicDerived = 0;
      let localNonPalindromicDerived = 0;
      let localRecurrentDerived = 0;
      let localPrivateDerived = 0;
      let localNoiseProneDerived = 0;

      const newDerivedSnps = new Set(derivedSnps);
      const newAncestralSnps = new Set(ancestralSnps);

      for (const snp of branch.definingSNPs) {
        const rawAllele = this.resolveSnpAllele(snp, input);
        if (!rawAllele) continue;

        localCovered++;
        const isPalindromic = isPalindromicMutation(snp.ancestral, snp.derived);
        const isAmpliconic = isYAmpliconicRegion(snp.posHg19, snp.posHg38);
        const isRecurrent = isRecurrentSnp(snp.name, snp.rsid);
        const isNoiseProne = isPlatformNoisyLocus(snp.name, snp.rsid, input.platform);

        const isDerived = matchGenotypeAllele(rawAllele, snp.derived);
        const isAncestral = matchGenotypeAllele(rawAllele, snp.ancestral);

        if (isDerived) {
          localDerived++;
          if (isPalindromic) localPalindromicDerived++;
          else localNonPalindromicDerived++;

          if (isRecurrent) localRecurrentDerived++;
          else localPrivateDerived++;

          if (isNoiseProne) localNoiseProneDerived++;

          if (!derivedSnps.has(snp.name)) {
            newLocalDerived++;
            newDerivedSnps.add(snp.name);
            matchedDerivedList.push({
              name: snp.name,
              rsid: snp.rsid,
              allele: rawAllele,
              mutation: snp.mutation || `${snp.ancestral} to ${snp.derived}`,
              branch: branchName,
              isPalindromic,
              isAmpliconic,
              isRecurrent,
              isChipNoiseProne: isNoiseProne
            });
          }
        } else if (isAncestral) {
          localAncestral++;
          if (isAmpliconic) localAmpliconicAncestral++;

          if (!ancestralSnps.has(snp.name)) {
            newAncestralSnps.add(snp.name);
            matchedAncestralList.push({
              name: snp.name,
              rsid: snp.rsid,
              allele: rawAllele,
              mutation: snp.mutation || `${snp.ancestral} to ${snp.derived}`,
              branch: branchName,
              isPalindromic,
              isAmpliconic,
              isRecurrent,
              isChipNoiseProne: isNoiseProne
            });
          }
        }
      }

      const totalDerived = newDerivedSnps.size;
      const totalAncestral = newAncestralSnps.size;

      // Check descendant derived count helper
      const getDescendantDerivedCount = (nodeName: string): number => {
        let count = 0;
        const childBranches = this.childrenMap.get(nodeName) || [];
        for (const child of childBranches) {
          for (const snp of child.definingSNPs) {
            const uAllele = this.resolveSnpAllele(snp, input);
            if (uAllele && matchGenotypeAllele(uAllele, snp.derived)) {
              count++;
            }
          }
          count += getDescendantDerivedCount(child.branchName);
        }
        return count;
      };

      // Consensus & Ampliconic recovery check
      let bypassRejection = false;
      if (localAncestral > 0) {
        // 1. Ampliconic Mask: if ALL ancestral calls on this branch are located in ampliconic AZF regions,
        // treat as structural deletion/variation instead of phylogenetic branch veto
        if (localAmpliconicAncestral === localAncestral && (localDerived > 0 || getDescendantDerivedCount(branchName) > 0)) {
          bypassRejection = true;
        } else {
          // 2. Standard consensus recovery
          if (getDescendantDerivedCount(branchName) >= 2) {
            bypassRejection = true;
          }
        }
      }

      if (localAncestral > 0 && !bypassRejection) {
        rejectedBranches.push(branchName);
        return;
      }

      const children = this.childrenMap.get(branchName) || [];
      const isPassthrough = branch.definingSNPs.length === 0;

      if (totalDerived > 0 || isPassthrough) {
        // Deep terminal guard: depth >= 5 requires >= 2 derived SNPs
        const isDeepTerminal = depth >= 5 && children.length === 0;
        if (isDeepTerminal && totalDerived < 2) return;

        // Palindromic Guard: if this sub-branch has derived markers, but 100% of them are palindromic,
        // do not let a single palindromic marker at depth >= 4 finalize a terminal clade over verified parents
        const isSolelyPalindromic = localDerived > 0 && localNonPalindromicDerived === 0;
        if (isSolelyPalindromic && depth >= 4 && localDerived < 2 && children.length === 0) {
          return;
        }

        // Homoplasy Guard: a recurrent SNP alone cannot confirm terminal branch advancement
        // at depth >= 4 without at least one private SNP or multi-derived support
        const isSolelyRecurrent = localDerived > 0 && localPrivateDerived === 0;
        if (isSolelyRecurrent && depth >= 4 && localDerived < 2 && children.length === 0) {
          return;
        }

        // Chip Noise Guard: if this sub-branch has only 1 derived marker and it is known for commercial chip noise,
        // do not let it finalize a terminal leaf over verified parents
        const isSolelyNoiseProne = localDerived === 1 && localNoiseProneDerived === 1;
        if (isSolelyNoiseProne && depth >= 4 && children.length === 0) {
          return;
        }

        const totalSeen = totalDerived + totalAncestral;
        const confidence = totalSeen > 0 ? (totalDerived / totalSeen) * 100 : 0;

        const branchCoverage = branch.definingSNPs.length > 0
          ? (localCovered / branch.definingSNPs.length) * 100
          : 0;

        // Apex Fallback Check: if branch has >= 3 defining SNPs, but user data only tested 1 (coverage < 35%)
        // on a leaf, designate it as provisional and anchor to parent
        const isProvisionalLeaf = branch.definingSNPs.length >= 3 && localCovered === 1 && children.length === 0;

        if (
          newLocalDerived > 0 && (
            depth > bestDepth ||
            (depth === bestDepth && confidence > bestConfidence)
          )
        ) {
          bestDepth = depth;
          bestTerminal = branchName;
          bestConfidence = confidence;
          bestCoverage = branchCoverage;
          bestDerived = totalDerived;
          bestAncestral = totalAncestral;
          bestPath = [...path, branchName];
          bestIsPalindromicAmbiguous = isSolelyPalindromic;
          bestIsProvisional = isProvisionalLeaf;
          bestApexAnchor = isProvisionalLeaf ? (path[path.length - 1] || branch.parent || branchName) : undefined;
        }

        for (const child of children) {
          traverse(
            child.branchName,
            depth + 1,
            [...path, branchName],
            newDerivedSnps,
            newAncestralSnps
          );
        }
      }
    };

    // Traverse root clades
    const rootNodes = this.childrenMap.get('root') || [];
    if (rootNodes.length > 0) {
      for (const root of rootNodes) {
        traverse(root.branchName, 1, [], new Set<string>(), new Set<string>());
      }
    } else {
      traverse('A', 1, [], new Set<string>(), new Set<string>());
    }

    const finalTerminal = bestDerived > 0 ? bestTerminal : 'N/A';

    let palindromicCount = 0;
    let nonPalindromicCount = 0;
    let recurrentCount = 0;
    for (const d of matchedDerivedList) {
      if (d.isPalindromic) palindromicCount++;
      else nonPalindromicCount++;

      if (d.isRecurrent) recurrentCount++;
    }

    return {
      terminalHaplogroup: finalTerminal,
      confidence: bestDerived > 0 ? Math.round(bestConfidence * 100) / 100 : 0,
      coverage: bestDerived > 0 ? Math.round(bestCoverage * 100) / 100 : 0,
      derivedSnpCount: bestDerived,
      ancestralSnpCount: bestAncestral,
      nonPalindromicDerivedCount: nonPalindromicCount,
      palindromicDerivedCount: palindromicCount,
      recurrentDerivedCount: recurrentCount,
      isPalindromicAmbiguous: bestIsPalindromicAmbiguous,
      isProvisionalTerminal: bestIsProvisional,
      apexAnchorClade: bestApexAnchor,
      path: bestDerived > 0 ? bestPath : [],
      rejectedBranches,
      derivedMarkers: matchedDerivedList,
      ancestralMarkers: matchedAncestralList
    };
  }
}
