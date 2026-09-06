/**
 * Phylogenetic Branch Mutation Ladder Audit & Private Variant Caller
 * 
 * Inspects all intermediate cladistic nodes along the ancestral spine,
 * audits positive/negative/missing marker states, and identifies private
 * family variants and homoplasic back-mutations.
 */

import { HaplogroupDefinition, EvaluatedMarker, LineageType } from '../types/haplogroup';

export interface SpineLadderNode {
  clade: HaplogroupDefinition;
  depth: number;
  nodeStatus: 'CONFIRMED_POSITIVE' | 'PARTIALLY_CONFIRMED' | 'UNTESTED_NO_CALL' | 'DISCORDANT_NEGATIVE';
  positiveMarkers: EvaluatedMarker[];
  negativeMarkers: EvaluatedMarker[];
  uncalledMarkers: string[];
}

export interface PrivateVariantCandidate {
  rsid: string;
  chromosome: string;
  position?: number;
  observedGenotype: string;
  potentialCladeAssociation?: string;
  confidence: 'HIGH_CONFIDENCE' | 'POTENTIAL_ARTIFACT';
}

export interface BranchAuditResult {
  ladderNodes: SpineLadderNode[];
  totalSpineMarkersTested: number;
  totalSpineDerivedMatches: number;
  spineIntegrityScorePct: number;
  potentialPrivateVariants: PrivateVariantCandidate[];
  homoplasyWarnings: string[];
}

export function auditBranchSpineAndPrivateVariants(
  lineagePath: HaplogroupDefinition[],
  evaluatedMarkers: EvaluatedMarker[],
  lineageType: LineageType,
  novelOrUntestedMarkers: string[] = []
): BranchAuditResult {
  const ladderNodes: SpineLadderNode[] = [];
  const homoplasyWarnings: string[] = [];

  const markerMapByName = new Map<string, EvaluatedMarker>();
  const markerMapByRsid = new Map<string, EvaluatedMarker>();

  for (const em of evaluatedMarkers) {
    markerMapByName.set(em.snp.name.toUpperCase(), em);
    if (em.snp.rsid) {
      markerMapByRsid.set(em.snp.rsid.toLowerCase(), em);
    }
  }

  let totalSpineMarkersTested = 0;
  let totalSpineDerivedMatches = 0;

  // Walk every node along the ancestral spine from Root to Terminal
  for (let i = 0; i < lineagePath.length; i++) {
    const clade = lineagePath[i];
    const nodePositive: EvaluatedMarker[] = [];
    const nodeNegative: EvaluatedMarker[] = [];
    const nodeUncalled: string[] = [];

    for (const snpName of clade.definingSnps) {
      const match = markerMapByName.get(snpName.toUpperCase());

      if (match) {
        totalSpineMarkersTested++;
        if (match.status === 'POSITIVE_DERIVED') {
          nodePositive.push(match);
          totalSpineDerivedMatches++;
        } else if (match.status === 'NEGATIVE_ANCESTRAL') {
          nodeNegative.push(match);
        } else {
          nodeUncalled.push(snpName);
        }
      } else {
        nodeUncalled.push(snpName);
      }
    }

    let nodeStatus: SpineLadderNode['nodeStatus'] = 'UNTESTED_NO_CALL';
    if (nodePositive.length > 0 && nodeNegative.length === 0) {
      nodeStatus = 'CONFIRMED_POSITIVE';
    } else if (nodePositive.length > 0 && nodeNegative.length > 0) {
      nodeStatus = 'PARTIALLY_CONFIRMED';
      homoplasyWarnings.push(`Node ${clade.code} shows discordant calls: ${nodePositive.length} derived vs ${nodeNegative.length} ancestral.`);
    } else if (nodeNegative.length > 0) {
      nodeStatus = 'DISCORDANT_NEGATIVE';
      homoplasyWarnings.push(`Node ${clade.code} carries ancestral calls along an upstream spine position.`);
    }

    ladderNodes.push({
      clade,
      depth: i + 1,
      nodeStatus,
      positiveMarkers: nodePositive,
      negativeMarkers: nodeNegative,
      uncalledMarkers: nodeUncalled
    });
  }

  const spineIntegrityScorePct = totalSpineMarkersTested > 0
    ? Math.round((totalSpineDerivedMatches / totalSpineMarkersTested) * 100)
    : 100;

  // Private Variants: Novel derived variants not in standard backbone
  const potentialPrivateVariants: PrivateVariantCandidate[] = [];

  for (const markerName of novelOrUntestedMarkers) {
    potentialPrivateVariants.push({
      rsid: markerName,
      chromosome: lineageType === 'PATERNAL_YDNA' ? 'Y' : 'MT',
      observedGenotype: 'Derived (+)',
      confidence: 'HIGH_CONFIDENCE',
      potentialCladeAssociation: 'Downstream Private Branch'
    });
  }

  return {
    ladderNodes,
    totalSpineMarkersTested,
    totalSpineDerivedMatches,
    spineIntegrityScorePct,
    potentialPrivateVariants,
    homoplasyWarnings
  };
}
