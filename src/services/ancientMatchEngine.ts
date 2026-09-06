/**
 * Ancient Archaeological Lineage Matching Engine
 * 
 * Computes cladistic affinity, shared phylogenetic depth, and chronological
 * proximity between the user's analyzed lineages and sequenced ancient remains.
 */

import { ANCIENT_ARCHAEOLOGICAL_SPECIMENS, AncientSampleSpecimen } from '../data/ancientDnaDatabase';
import { HaplogroupDefinition } from '../types/haplogroup';

export interface AncientMatchScore {
  specimen: AncientSampleSpecimen;
  paternalMatchQuality: 'EXACT_SUBCLADE' | 'ANCESTRAL_MACROCLADE' | 'DISTANT' | 'NONE';
  maternalMatchQuality: 'EXACT_SUBCLADE' | 'ANCESTRAL_MACROCLADE' | 'DISTANT' | 'NONE';
  sharedAncestryScore: number; // 0 - 100
  paternalCladeExplanation: string;
  maternalCladeExplanation: string;
}

export function computeAncientMatches(
  userPaternalHaplo?: HaplogroupDefinition | null,
  userMaternalHaplo?: HaplogroupDefinition | null
): AncientMatchScore[] {
  const scores: AncientMatchScore[] = [];

  const userYCode = (userPaternalHaplo?.code || '').toUpperCase();
  const userYClade = (userPaternalHaplo?.cladeName || '').toUpperCase();
  const userMtCode = (userMaternalHaplo?.code || '').toUpperCase();
  const userMtClade = (userMaternalHaplo?.cladeName || '').toUpperCase();

  for (const specimen of ANCIENT_ARCHAEOLOGICAL_SPECIMENS) {
    const specY = specimen.paternalYdna.toUpperCase();
    const specMt = specimen.maternalMtdna.toUpperCase();

    let pScore = 0;
    let mScore = 0;
    let pQuality: AncientMatchScore['paternalMatchQuality'] = 'NONE';
    let mQuality: AncientMatchScore['maternalMatchQuality'] = 'NONE';

    let pExplain = 'No direct paternal haplogroup sharing.';
    let mExplain = 'No direct maternal haplogroup sharing.';

    // Evaluate Paternal (Y-DNA) Match
    if (userYCode && specY !== 'ARCHAIC HOMININ STEM') {
      const userMajorLetter = userYCode.charAt(0);
      const specMajorLetter = specY.charAt(0);

      if (userYCode.includes(specY) || specY.includes(userYCode)) {
        pQuality = 'EXACT_SUBCLADE';
        pScore = 50;
        pExplain = `Direct paternal clade sharing with ${specimen.name} (${specimen.paternalYdna}).`;
      } else if (userMajorLetter === specMajorLetter) {
        pQuality = 'ANCESTRAL_MACROCLADE';
        pScore = 30;
        pExplain = `Shares the major ${userMajorLetter} paternal lineage horizon with ${specimen.name}.`;
      } else if (specY.startsWith('BT') || specY.startsWith('CT') || specY.startsWith('K')) {
        pQuality = 'DISTANT';
        pScore = 15;
        pExplain = `Root ancestral branching leading to modern Eurasian/African clades.`;
      }
    }

    // Evaluate Maternal (mtDNA) Match
    if (userMtCode && specMt !== 'NEANDERTHAL MTDNA LINEAGE') {
      const userMajorLetter = userMtCode.charAt(0);
      const specMajorLetter = specMt.charAt(0);

      if (userMtCode.includes(specMt) || specMt.includes(userMtCode)) {
        mQuality = 'EXACT_SUBCLADE';
        mScore = 50;
        mExplain = `Direct maternal matriline sharing with ${specimen.name} (${specimen.maternalMtdna}).`;
      } else if (userMajorLetter === specMajorLetter) {
        mQuality = 'ANCESTRAL_MACROCLADE';
        mScore = 30;
        mExplain = `Shares the major ${userMajorLetter} maternal founder macroclade with ${specimen.name}.`;
      } else if (specMt.startsWith('L') || specMt.startsWith('M') || specMt.startsWith('N') || specMt.startsWith('R')) {
        mQuality = 'DISTANT';
        mScore = 15;
        mExplain = `Root maternal branching across paleolithic out-of-Africa expansions.`;
      }
    }

    const totalScore = Math.min(100, pScore + mScore);

    scores.push({
      specimen,
      paternalMatchQuality: pQuality,
      maternalMatchQuality: mQuality,
      sharedAncestryScore: totalScore,
      paternalCladeExplanation: pExplain,
      maternalCladeExplanation: mExplain
    });
  }

  // Sort by highest shared ancestry score first
  return scores.sort((a, b) => b.sharedAncestryScore - a.sharedAncestryScore);
}
