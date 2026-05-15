export interface LAIInterval {
  continent: string;
  start: number;
  end: number;
  confidence: number;
  chromosome?: string;
  strand?: 'A' | 'B';
}

/**
 * Highly optimizes ancestry rendering by merging adjacent segments
 * of the same population into a single block.
 * 
 * @param intervals Array of high-resolution ancestry segments
 * @returns Compressed ancestry segments
 */
export function fuseAncestryBlocks(intervals: LAIInterval[]): LAIInterval[] {
    if (intervals.length <= 1) return intervals;

    const fused: LAIInterval[] = [];
    let current = { ...intervals[0] };

    for (let i = 1; i < intervals.length; i++) {
        const next = intervals[i];

        // Check for adjacency and identical identity
        const isSamePop = next.continent === current.continent;
        const isSameChrom = next.chromosome === current.chromosome;
        const isSameStrand = next.strand === current.strand;
        
        // Use a small buffer (e.g., 500kb) for adjacency to handle minor gaps in marker density
        const isAdjacent = next.start <= current.end + 500000;

        if (isSamePop && isSameChrom && isSameStrand && isAdjacent) {
            // MERGE: Update the current block's endpoint
            current.end = next.end;
            // Weighted average for confidence (simple average for now)
            current.confidence = (current.confidence + next.confidence) / 2;
        } else {
            // BREAK: Push the finalized block and start a new one
            fused.push(current);
            current = { ...next };
        }
    }

    // Push the final block
    fused.push(current);
    return fused;
}
