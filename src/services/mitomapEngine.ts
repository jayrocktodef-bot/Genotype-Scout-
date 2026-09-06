/**
 * 🧬 MITOMAP Human Mitochondrial Genome Annotation & Mutability Engine
 * Reference: MITOMAP (https://www.mitomap.org), rCRS NC_012920.1
 * Provides 37-gene locus mapping, mutability index, and functional annotations.
 */

export interface MitomapGeneRegion {
  symbol: string;
  name: string;
  category: 'Protein Coding' | 'tRNA' | 'rRNA' | 'Control Region';
  start: number;
  end: number;
  description: string;
  strand: 'H' | 'L';
}

export interface MitomapLocusAnnotation {
  position: number;
  gene: string;
  geneName: string;
  category: 'Protein Coding' | 'tRNA' | 'rRNA' | 'Control Region';
  regulatoryElement?: string;
  description: string;
  mutabilityIndex: 'Ultra-Conserved' | 'Moderate' | 'Hypervariable Hotspot';
  weightMultiplier: number;
  isHotspot: boolean;
}

export function getRegulatoryElement(pos: number): string | undefined {
  if (pos >= 110 && pos <= 441) return 'OH (Origin of Heavy Strand Replication)';
  if (pos >= 392 && pos <= 445) return 'LSP (Light Strand Promoter)';
  if (pos >= 545 && pos <= 567) return 'HSP1 (Heavy Strand Promoter 1)';
  if (pos >= 5721 && pos <= 5798) return 'OL (Origin of Light Strand Replication)';
  if (pos >= 16157 && pos <= 16172) return 'TAS (Termination Associated Sequence)';
  if (pos >= 16194 && pos <= 16208) return 'CSB I (Conserved Sequence Block I)';
  if (pos >= 299 && pos <= 315) return 'CSB II (Conserved Sequence Block II)';
  if (pos >= 213 && pos <= 235) return 'CSB III (Conserved Sequence Block III)';
  return undefined;
}

// Full 37-gene mitochondrial genome coordinate map (rCRS NC_012920.1)
export const MITOMAP_37_GENES: MitomapGeneRegion[] = [
  { symbol: 'D-Loop (HVR2/HVR3)', name: 'Control Region / D-Loop', category: 'Control Region', start: 1, end: 576, description: 'Non-coding regulatory region containing replication origins and promoter elements.', strand: 'H' },
  { symbol: 'MT-TF', name: 'tRNA Phenylalanine', category: 'tRNA', start: 577, end: 647, description: 'Transfers phenylalanine during mitochondrial translation.', strand: 'H' },
  { symbol: 'MT-RNR1', name: '12S Ribosomal RNA', category: 'rRNA', start: 648, end: 1601, description: 'Small subunit of the mitochondrial ribosome (12S rRNA).', strand: 'H' },
  { symbol: 'MT-TV', name: 'tRNA Valine', category: 'tRNA', start: 1602, end: 1670, description: 'Transfers valine during mitochondrial translation.', strand: 'H' },
  { symbol: 'MT-RNR2', name: '16S Ribosomal RNA', category: 'rRNA', start: 1671, end: 3229, description: 'Large subunit of the mitochondrial ribosome (16S rRNA).', strand: 'H' },
  { symbol: 'MT-TL1', name: 'tRNA Leucine 1', category: 'tRNA', start: 3230, end: 3304, description: 'Transfers leucine (UUR) during mitochondrial translation.', strand: 'H' },
  { symbol: 'MT-ND1', name: 'NADH Dehydrogenase 1', category: 'Protein Coding', start: 3307, end: 4262, description: 'Complex I subunit essential for oxidative phosphorylation electron transport.', strand: 'H' },
  { symbol: 'MT-TI', name: 'tRNA Isoleucine', category: 'tRNA', start: 4263, end: 4331, description: 'Transfers isoleucine during mitochondrial translation.', strand: 'H' },
  { symbol: 'MT-TQ', name: 'tRNA Glutamine', category: 'tRNA', start: 4329, end: 4400, description: 'Transfers glutamine during mitochondrial translation.', strand: 'L' },
  { symbol: 'MT-TM', name: 'tRNA Methionine', category: 'tRNA', start: 4402, end: 4469, description: 'Transfers methionine during mitochondrial translation.', strand: 'H' },
  { symbol: 'MT-ND2', name: 'NADH Dehydrogenase 2', category: 'Protein Coding', start: 4470, end: 5511, description: 'Complex I core hydrophobic proton-translocating subunit.', strand: 'H' },
  { symbol: 'MT-TW', name: 'tRNA Tryptophan', category: 'tRNA', start: 5512, end: 5579, description: 'Transfers tryptophan during mitochondrial translation.', strand: 'H' },
  { symbol: 'MT-TA', name: 'tRNA Alanine', category: 'tRNA', start: 5587, end: 5655, description: 'Transfers alanine during mitochondrial translation.', strand: 'L' },
  { symbol: 'MT-TN', name: 'tRNA Asparagine', category: 'tRNA', start: 5657, end: 5729, description: 'Transfers asparagine during mitochondrial translation.', strand: 'L' },
  { symbol: 'MT-TC', name: 'tRNA Cysteine', category: 'tRNA', start: 5761, end: 5826, description: 'Transfers cysteine during mitochondrial translation.', strand: 'L' },
  { symbol: 'MT-TY', name: 'tRNA Tyrosine', category: 'tRNA', start: 5826, end: 5891, description: 'Transfers tyrosine during mitochondrial translation.', strand: 'L' },
  { symbol: 'MT-CO1', name: 'Cytochrome c Oxidase I', category: 'Protein Coding', start: 5904, end: 7445, description: 'Complex IV catalytic core subunit; binds heme a, heme a3, and CuB.', strand: 'H' },
  { symbol: 'MT-TS1', name: 'tRNA Serine 1', category: 'tRNA', start: 7446, end: 7514, description: 'Transfers serine (UCN) during mitochondrial translation.', strand: 'L' },
  { symbol: 'MT-TD', name: 'tRNA Aspartate', category: 'tRNA', start: 7518, end: 7585, description: 'Transfers aspartate during mitochondrial translation.', strand: 'H' },
  { symbol: 'MT-CO2', name: 'Cytochrome c Oxidase II', category: 'Protein Coding', start: 7586, end: 8269, description: 'Complex IV subunit containing the binuclear CuA electron acceptor center.', strand: 'H' },
  { symbol: 'MT-TK', name: 'tRNA Lysine', category: 'tRNA', start: 8295, end: 8364, description: 'Transfers lysine during mitochondrial translation.', strand: 'H' },
  { symbol: 'MT-ATP8', name: 'ATP Synthase 8', category: 'Protein Coding', start: 8366, end: 8572, description: 'Complex V stator subunit required for ATP synthase assembly.', strand: 'H' },
  { symbol: 'MT-ATP6', name: 'ATP Synthase 6', category: 'Protein Coding', start: 8527, end: 9207, description: 'Complex V proton channel subunit (Fo) driving ATP synthesis rotation.', strand: 'H' },
  { symbol: 'MT-CO3', name: 'Cytochrome c Oxidase III', category: 'Protein Coding', start: 9207, end: 9990, description: 'Complex IV subunit maintaining catalytic subunit conformation.', strand: 'H' },
  { symbol: 'MT-TG', name: 'tRNA Glycine', category: 'tRNA', start: 9991, end: 10058, description: 'Transfers glycine during mitochondrial translation.', strand: 'H' },
  { symbol: 'MT-ND3', name: 'NADH Dehydrogenase 3', category: 'Protein Coding', start: 10059, end: 10404, description: 'Complex I membrane arm subunit involved in proton pumping.', strand: 'H' },
  { symbol: 'MT-TR', name: 'tRNA Arginine', category: 'tRNA', start: 10405, end: 10469, description: 'Transfers arginine during mitochondrial translation.', strand: 'H' },
  { symbol: 'MT-ND4L', name: 'NADH Dehydrogenase 4L', category: 'Protein Coding', start: 10470, end: 10766, description: 'Complex I small membrane subunit assisting proton translocation.', strand: 'H' },
  { symbol: 'MT-ND4', name: 'NADH Dehydrogenase 4', category: 'Protein Coding', start: 10760, end: 12137, description: 'Complex I large proton pumping channel subunit.', strand: 'H' },
  { symbol: 'MT-TH', name: 'tRNA Histidine', category: 'tRNA', start: 12138, end: 12206, description: 'Transfers histidine during mitochondrial translation.', strand: 'H' },
  { symbol: 'MT-TS2', name: 'tRNA Serine 2', category: 'tRNA', start: 12207, end: 12265, description: 'Transfers serine (AGY) during mitochondrial translation.', strand: 'H' },
  { symbol: 'MT-TL2', name: 'tRNA Leucine 2', category: 'tRNA', start: 12266, end: 12336, description: 'Transfers leucine (CUN) during mitochondrial translation.', strand: 'H' },
  { symbol: 'MT-ND5', name: 'NADH Dehydrogenase 5', category: 'Protein Coding', start: 12337, end: 14148, description: 'Complex I largest membrane subunit; primary proton translocation channel.', strand: 'H' },
  { symbol: 'MT-ND6', name: 'NADH Dehydrogenase 6', category: 'Protein Coding', start: 14149, end: 14673, description: 'Complex I subunit encoded on the light (L) strand.', strand: 'L' },
  { symbol: 'MT-TE', name: 'tRNA Glutamate', category: 'tRNA', start: 14674, end: 14742, description: 'Transfers glutamate during mitochondrial translation.', strand: 'L' },
  { symbol: 'MT-CYB', name: 'Cytochrome b', category: 'Protein Coding', start: 14747, end: 15887, description: 'Complex III catalytic subunit; transfers electrons from ubiquinol to cytochrome c1.', strand: 'H' },
  { symbol: 'MT-TT', name: 'tRNA Threonine', category: 'tRNA', start: 15888, end: 15953, description: 'Transfers threonine during mitochondrial translation.', strand: 'H' },
  { symbol: 'MT-TP', name: 'tRNA Proline', category: 'tRNA', start: 15956, end: 16023, description: 'Transfers proline during mitochondrial translation.', strand: 'L' },
  { symbol: 'D-Loop (HVR1)', name: 'Control Region / D-Loop', category: 'Control Region', start: 16024, end: 16569, description: 'Hypervariable Region 1 (HVR1) of the mitochondrial control region.', strand: 'H' }
];

// MITOMAP consensus hypervariable hotspots
export const MITOMAP_HOTSPOT_POSITIONS = new Set<number>([
  146, 152, 195, 309, 315, 524, 525, 16093, 16182, 16183, 16189, 16223, 16311, 16362, 16519
]);

/**
 * Returns complete MITOMAP locus annotations for any position 1 - 16569
 */
export function getMitomapAnnotation(position: number): MitomapLocusAnnotation {
  const isHotspot = MITOMAP_HOTSPOT_POSITIONS.has(position);
  const regulatoryElement = getRegulatoryElement(position);

  // Find overlapping gene
  const match = MITOMAP_37_GENES.find(g => position >= g.start && position <= g.end);

  if (match) {
    let mutabilityIndex: MitomapLocusAnnotation['mutabilityIndex'] = 'Moderate';
    let weightMultiplier = 1.0;

    if (isHotspot) {
      mutabilityIndex = 'Hypervariable Hotspot';
      weightMultiplier = 0.35;
    } else if (match.category === 'Protein Coding' || match.category === 'rRNA') {
      mutabilityIndex = 'Ultra-Conserved';
      weightMultiplier = 1.35;
    }

    return {
      position,
      gene: match.symbol,
      geneName: match.name,
      category: match.category,
      regulatoryElement,
      description: match.description,
      mutabilityIndex,
      weightMultiplier,
      isHotspot
    };
  }

  // Intergenic non-coding nucleotide
  return {
    position,
    gene: regulatoryElement ? regulatoryElement.split(' ')[0] : 'Intergenic',
    geneName: 'Non-coding regulatory spacer',
    category: 'Control Region',
    regulatoryElement,
    description: 'Intergenic mitochondrial sequence spacer.',
    mutabilityIndex: isHotspot ? 'Hypervariable Hotspot' : 'Moderate',
    weightMultiplier: isHotspot ? 0.35 : 1.0,
    isHotspot
  };
}
