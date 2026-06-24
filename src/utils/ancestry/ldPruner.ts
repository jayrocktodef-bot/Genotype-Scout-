/**
 * Physical Distance-Based Linkage Disequilibrium (LD) Pruner
 * 
 * Filters genomic markers to remove variants that are physically close on a chromosome,
 * which helps prevent double-counting of ancestral signals.
 */

export interface GenomicMarker {
  rsid: string;
  chromosome: string | number;
  position: number;
  weight?: number;
}

/**
 * Prunes a list of markers using a physical distance sliding window.
 * Within each window, we keep the marker with the highest weight (or the first one seen).
 * 
 * @param markers List of genomic markers to prune
 * @param windowSizeBp Size of the sliding window in base pairs (default 50,000 bp / 50kb)
 * @returns Pruned list of markers
 */
export function pruneMarkersByPhysicalDistance<T extends GenomicMarker>(
  markers: T[],
  windowSizeBp = 50000
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
        pruned.push(marker);
        lastPos = marker.position;
      } else {
        // If they are within the window, check if current marker has higher weight
        // and replace the previous one if it is more informative
        const lastIndex = pruned.length - 1;
        const lastMarker = pruned[lastIndex];
        if (
          lastMarker &&
          String(lastMarker.chromosome).toUpperCase().replace('CHR', '') === chr &&
          (marker.weight || 0) > (lastMarker.weight || 0)
        ) {
          pruned[lastIndex] = marker;
          // Keep the lastPos updated if we swapped it
          lastPos = marker.position;
        }
      }
    }
  }

  return pruned;
}
