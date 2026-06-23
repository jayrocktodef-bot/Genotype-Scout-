import { RawSnp, PredictionResult } from '../types/haplogroup';
import { YPhylotreeDataset, YPhylotreeBranch, YSnpRecord } from '../utils/yPhylotree';

export interface YDnaPredictionDetails {
  terminalHaplogroup: string;
  confidence: number;
  coverage: number;            // % of defining SNPs with allele data in user sample
  derivedSnpCount: number;     // number of derived-state defining SNPs matched
  ancestralSnpCount: number;   // number of ancestral-state defining SNPs matched
  path: string[];              // traversal path from root to terminal
  rejectedBranches: string[];  // branches rejected due to ancestral defining SNPs
}

/**
 * Phase 2: Y-DNA predictor powered by y_phylotree.json.
 *
 * Rules:
 * 1. Confirm derived-only: only accept a branch if ALL its defining SNPs that
 *    are present in the user sample are in derived state.
 * 2. Reject ancestral: skip any branch where any defining SNP is ancestral.
 * 3. Require ≥2 SNPs: for deep terminals (depth > 5), require at least 2
 *    confirming derived SNPs.
 * 4. Report coverage/confidence: track what % of the branch's defining SNPs
 *    the user has data for.
 */
export class YDnaPredictorV2 {
  private dataset: YPhylotreeDataset;
  private branchMap: Map<string, YPhylotreeBranch>;
  private childrenMap: Map<string, YPhylotreeBranch[]>;

  constructor(dataset: YPhylotreeDataset) {
    this.dataset = dataset;
    this.branchMap = new Map();
    this.childrenMap = new Map();

    // Index branches by name and build parent→children map
    for (const branch of dataset.branches) {
      this.branchMap.set(branch.branchName, branch);
      const parentKey = branch.parent || 'root';
      if (!this.childrenMap.has(parentKey)) {
        this.childrenMap.set(parentKey, []);
      }
      this.childrenMap.get(parentKey)!.push(branch);
    }
  }

  /**
   * Predict the most specific Y-haplogroup based on user SNP data.
   * Returns allele direction validation results + coverage metrics.
   */
  public predict(rawDna: RawSnp[]): YDnaPredictionDetails {
    const dnaMap = new Map(rawDna.map(s => [s.name || s.rsid, s.allele]));

    let bestTerminal = 'A';
    let bestConfidence = 0;
    let bestCoverage = 0;
    let bestDerived = 0;
    let bestAncestral = 0;
    let bestPath: string[] = [];
    const rejectedBranches: string[] = [];
    let bestDepth = 0;

    /**
     * Recursively traverse the tree. Only descend into a branch if:
     * - No defining SNPs are ancestral (rule 2)
     * - All known defining SNPs are derived (rule 1)
     * - Deep terminals have ≥2 derived SNPs (rule 3)
     */
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

      const newDerivedSnps = new Set(derivedSnps);
      const newAncestralSnps = new Set(ancestralSnps);

      // Scan this branch's defining SNPs
      for (const snp of branch.definingSNPs) {
        const userAllele = dnaMap.get(snp.name);
        if (!userAllele || userAllele === '--' || userAllele === '00' || userAllele === 'II') continue;

        localCovered++;
        const normalizedAllele = userAllele[0].toUpperCase();

        if (normalizedAllele === snp.derived.toUpperCase()) {
          localDerived++;
          if (!derivedSnps.has(snp.name)) {
            newLocalDerived++;
            newDerivedSnps.add(snp.name);
          }
        } else if (normalizedAllele === snp.ancestral.toUpperCase()) {
          localAncestral++;
          newAncestralSnps.add(snp.name);
        }
      }

      const totalDerived = newDerivedSnps.size;
      const totalAncestral = newAncestralSnps.size;

      // Consensus Check: if there are ancestral SNPs, check if any descendant branch has active derived markers.
      // If there are child branches with >=2 derived markers total, we bypass the ancestral rejection.
      let bypassRejection = false;
      if (localAncestral > 0) {
        let descendantDerivedCount = 0;
        const checkDescendants = (nodeName: string) => {
          const childBranches = this.childrenMap.get(nodeName) || [];
          for (const child of childBranches) {
            for (const snp of child.definingSNPs) {
              const userAllele = dnaMap.get(snp.name);
              if (userAllele && userAllele !== '--' && userAllele[0].toUpperCase() === snp.derived.toUpperCase()) {
                descendantDerivedCount++;
              }
            }
            checkDescendants(child.branchName);
          }
        };
        checkDescendants(branchName);
        if (descendantDerivedCount >= 2) {
          bypassRejection = true;
        }
      }

      // Rule 2: Reject if ANY defining SNP is ancestral (unless bypassed by consensus check)
      if (localAncestral > 0 && !bypassRejection) {
        rejectedBranches.push(branchName);
        return;
      }

      const children = this.childrenMap.get(branchName) || [];

      // A branch with no defining SNPs (e.g. root 'A') is a passthrough —
      // it can't confirm or reject, so always recurse into children.
      const isPassthrough = branch.definingSNPs.length === 0;

      // Rule 1: Only accept this node as a candidate if it has derived evidence.
      // Passthrough nodes still recurse but are not recorded as "best".
      if (totalDerived > 0 || isPassthrough) {
        // Rule 3: For deep terminals (depth >= 5), require ≥2 derived SNPs
        const isDeepTerminal = depth >= 5 && children.length === 0;
        if (isDeepTerminal && totalDerived < 2) return;

        // Calculate confidence: derived / (derived + ancestral) where seen
        const totalSeen = totalDerived + totalAncestral;
        const confidence = totalSeen > 0 ? (totalDerived / totalSeen) * 100 : 0;

        // Calculate coverage: % of this branch's defining SNPs we have data for
        const branchCoverage = branch.definingSNPs.length > 0
          ? (localCovered / branch.definingSNPs.length) * 100
          : 0;

        // Update best if we have new local derived evidence and are deeper or more confident
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
        }

        // Recurse into children
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

    // Root of the Y-DNA tree is 'A'
    traverse('A', 1, [], new Set<string>(), new Set<string>());

    return {
      terminalHaplogroup: bestTerminal,
      confidence: Math.round(bestConfidence * 100) / 100,
      coverage: Math.round(bestCoverage * 100) / 100,
      derivedSnpCount: bestDerived,
      ancestralSnpCount: bestAncestral,
      path: bestPath,
      rejectedBranches,
    };
  }
}
