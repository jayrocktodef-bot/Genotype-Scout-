/**
 * Physical Distance & Linkage Disequilibrium (LD) Pruner
 * 
 * Filters genomic markers to remove variants that are physically close on a chromosome or
 * in strong Linkage Disequilibrium (r^2 > 0.1), preventing double-counting of ancestral signals.
 */

export interface GenomicMarker {
  rsid: string;
  chromosome: string | number;
  position: number;
  weight?: number;
  frequencies?: Record<string, number>;
}

/**
 * Calculates estimated r^2 correlation between two bi-allelic markers across reference population frequencies.
 */
export function calculateMarkerCorrelation(freqsA: Record<string, number>, freqsB: Record<string, number>): number {
  const pops = Object.keys(freqsA).filter(p => typeof freqsB[p] === 'number');
  if (pops.length < 3) return 0;

  const meanA = pops.reduce((sum, p) => sum + freqsA[p], 0) / pops.length;
  const meanB = pops.reduce((sum, p) => sum + freqsB[p], 0) / pops.length;

  let cov = 0;
  let varA = 0;
  let varB = 0;

  pops.forEach(p => {
    const diffA = freqsA[p] - meanA;
    const diffB = freqsB[p] - meanB;
    cov += diffA * diffB;
    varA += diffA * diffA;
    varB += diffB * diffB;
  });

  if (varA === 0 || varB === 0) return 0;
  const r = cov / Math.sqrt(varA * varB);
  return r * r; // Return r^2
}

/**
 * Prunes a list of markers using a physical distance sliding window (default 250,000 bp / 250kb)
 * and optional r^2 threshold filtering (r^2 < 0.1).
 * 
 * Within each window, we retain the marker with the highest informativeness weight.
 * 
 * @param markers List of genomic markers to prune
 * @param windowSizeBp Size of the sliding window in base pairs (default 250,000 bp)
 * @param maxR2 Maximum allowed LD r^2 correlation (default 0.10)
 * @returns Pruned list of independent markers
 */
export function pruneMarkersByPhysicalDistance<T extends GenomicMarker>(
  markers: T[],
  windowSizeBp = 250000,
  maxR2 = 0.10
): T[] {
  // Group by chromosome
  const chromGroups: Record<string, T[]> = {};
  const unmapped: T[] = [];

  markers.forEach(marker => {
    if (!marker.chromosome || typeof marker.position !== 'number' || isNaN(marker.position)) {
      unmapped.push(marker);
      return;
    }
    const chrStr = String(marker.chromosome).toUpperCase().replace('CHR', '');
    if (!chromGroups[chrStr]) {
      chromGroups[chrStr] = [];
    }
    chromGroups[chrStr].push(marker);
  });

  const pruned: T[] = [...unmapped];

  // Apply sliding window on each chromosome
  for (const chr in chromGroups) {
    // Sort by position ascending
    const sorted = chromGroups[chr].sort((a, b) => a.position - b.position);
    let lastPos = -1;

    for (const marker of sorted) {
      if (lastPos === -1 || (marker.position - lastPos) >= windowSizeBp) {
        // If frequencies are available, check r^2 correlation against last retained marker
        const lastRetained = pruned[pruned.length - 1];
        if (
          lastRetained &&
          lastRetained.frequencies &&
          marker.frequencies
        ) {
          const r2 = calculateMarkerCorrelation(lastRetained.frequencies, marker.frequencies);
          if (r2 > maxR2) {
            // Keep higher weighted marker
            if ((marker.weight || 0) > (lastRetained.weight || 0)) {
              pruned[pruned.length - 1] = marker;
            }
            continue;
          }
        }

        pruned.push(marker);
        lastPos = marker.position;
      } else {
        // Within window boundary: check if current marker has higher weight and replace if more informative
        const lastIndex = pruned.length - 1;
        const lastMarker = pruned[lastIndex];
        if (
          lastMarker &&
          String(lastMarker.chromosome).toUpperCase().replace('CHR', '') === chr &&
          (marker.weight || 0) > (lastMarker.weight || 0)
        ) {
          pruned[lastIndex] = marker;
        }
      }
    }
  }

  return pruned;
}
