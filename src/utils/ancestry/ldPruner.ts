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
 * Optimized for zero array allocations.
 */
export function calculateMarkerCorrelation(freqsA: Record<string, number>, freqsB: Record<string, number>): number {
  let count = 0;
  let sumA = 0;
  let sumB = 0;

  for (const p in freqsA) {
    const valB = freqsB[p];
    if (typeof valB === 'number') {
      sumA += freqsA[p];
      sumB += valB;
      count++;
    }
  }
  if (count < 3) return 0;

  const meanA = sumA / count;
  const meanB = sumB / count;

  let cov = 0;
  let varA = 0;
  let varB = 0;

  for (const p in freqsA) {
    const valB = freqsB[p];
    if (typeof valB === 'number') {
      const diffA = freqsA[p] - meanA;
      const diffB = valB - meanB;
      cov += diffA * diffB;
      varA += diffA * diffA;
      varB += diffB * diffB;
    }
  }

  if (varA === 0 || varB === 0) return 0;
  const r = cov / Math.sqrt(varA * varB);
  return r * r; // Return r^2
}

/**
 * Prunes a list of markers using a physical distance sliding window (default 50,000 bp)
 * and optional r^2 threshold filtering (r^2 < 0.1).
 * 
 * Within each window, we retain the marker with the highest informativeness weight.
 * 
 * @param markers List of genomic markers to prune
 * @param windowSizeBp Size of the sliding window in base pairs (default 50,000 bp)
 * @param maxR2 Maximum allowed LD r^2 correlation (default 0.10)
 * @returns Pruned list of independent markers
 */
export function pruneMarkersByPhysicalDistance<T extends GenomicMarker>(
  markers: T[],
  windowSizeBp = 50000,
  maxR2 = 0.10
): T[] {
  if (!markers || markers.length <= 1) return markers;

  const pruned: T[] = [];
  const chromGroups: Record<string, T[]> = {};

  for (let i = 0; i < markers.length; i++) {
    const marker = markers[i];
    if (!marker.chromosome || typeof marker.position !== 'number' || isNaN(marker.position)) {
      pruned.push(marker);
      continue;
    }
    const chrStr = String(marker.chromosome).toUpperCase().replace('CHR', '');
    if (!chromGroups[chrStr]) {
      chromGroups[chrStr] = [];
    }
    chromGroups[chrStr].push(marker);
  }

  for (const chr in chromGroups) {
    const list = chromGroups[chr];
    if (list.length === 1) {
      pruned.push(list[0]);
      continue;
    }

    list.sort((a, b) => a.position - b.position);

    let lastMarker = list[0];
    pruned.push(lastMarker);

    for (let i = 1; i < list.length; i++) {
      const current = list[i];
      if (current.position - lastMarker.position >= windowSizeBp) {
        if (current.frequencies && lastMarker.frequencies) {
          const r2 = calculateMarkerCorrelation(lastMarker.frequencies, current.frequencies);
          if (r2 > maxR2) {
            if ((current.weight || 0) > (lastMarker.weight || 0)) {
              pruned[pruned.length - 1] = current;
              lastMarker = current;
            }
            continue;
          }
        }
        pruned.push(current);
        lastMarker = current;
      } else if ((current.weight || 0) > (lastMarker.weight || 0)) {
        pruned[pruned.length - 1] = current;
        lastMarker = current;
      }
    }
  }

  return pruned;
}
