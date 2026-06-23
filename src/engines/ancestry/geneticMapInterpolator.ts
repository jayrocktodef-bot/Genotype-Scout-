
import geneticMap from '../../data/master_genetic_map.json';

type GeneticInterval = { pos: number; cm: number };

/**
 * GeneticMapInterpolator
 * Calculates interpolated centiMorgan distances based on physical base pair positions.
 */
export class GeneticMapInterpolator {
  private map: Record<string, GeneticInterval[]>;

  constructor() {
    this.map = geneticMap as Record<string, GeneticInterval[]>;
  }

  /**
   * getCentiMorgans
   * Returns the estimated cM value for a given chromosome and base pair position.
   */
  getCentiMorgans(chromosome: string, position: number): number {
    const chrom = chromosome.replace('chr', '');
    const intervals = this.map[chrom];

    if (!intervals || intervals.length === 0) {
      // Fallback: 1 cM per 1Mb if chromosome data is missing
      return position / 1000000;
    }

    // Binary search for the bounding intervals
    let low = 0;
    let high = intervals.length - 1;

    if (position <= intervals[low].pos) return intervals[low].cm;
    if (position >= intervals[high].pos) return intervals[high].cm;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midPos = intervals[mid].pos;

      if (midPos === position) return intervals[mid].cm;

      if (midPos < position) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    // Interpolate between high and low
    // After the loop, high is the index just before position, and low is the index just after
    const i1 = intervals[high];
    const i2 = intervals[low];

    const ratio = (position - i1.pos) / (i2.pos - i1.pos);
    return i1.cm + ratio * (i2.cm - i1.cm);
  }

  /**
   * getCMDistance
   * Returns the distance in cM between two positions on the same chromosome.
   */
  getCMDistance(chromosome: string, pos1: number, pos2: number): number {
    const cm1 = this.getCentiMorgans(chromosome, pos1);
    const cm2 = this.getCentiMorgans(chromosome, pos2);
    return Math.abs(cm2 - cm1);
  }
}

export const interpolator = new GeneticMapInterpolator();
