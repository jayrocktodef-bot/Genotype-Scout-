
import fs from 'fs';
import path from 'path';

/**
 * Approximate chromosome lengths (bp) for GRCh37/38
 */
const CHROM_LENGTHS: Record<string, number> = {
  "1": 249250621, "2": 243199373, "3": 198022430, "4": 191154276, "5": 180915260,
  "6": 171115067, "7": 159138663, "8": 146364022, "9": 141213431, "10": 135534747,
  "11": 135006516, "12": 133851895, "13": 115169878, "14": 107349540, "15": 102531392,
  "16": 90354753, "17": 81195210, "18": 78077248, "19": 59128983, "20": 63025520,
  "21": 48129895, "22": 51304566
};

async function buildGeneticMap() {
  console.log('🧬 Building Genetic Map (Baseline Mathematical Approximation)...');

  const map: Record<string, Array<{ pos: number, cm: number }>> = {};

  for (const [chrom, length] of Object.entries(CHROM_LENGTHS)) {
    const intervals = [];
    const step = 500000; // 500kb
    let currentCm = 0;
    const midpoint = length / 2;
    const centromereStart = midpoint - 1500000;
    const centromereEnd = midpoint + 1500000;

    for (let pos = 0; pos <= length; pos += step) {
      intervals.push({ pos, cm: currentCm });

      // Approximate 1 cM per 1,000,000 BP
      // Skip accumulation in the 3Mb centromere gap
      if (pos < centromereStart || pos > centromereEnd) {
        currentCm += (step / 1000000);
      }
    }
    
    // Ensure the last position is covered
    if (intervals[intervals.length - 1].pos < length) {
      intervals.push({ pos: length, cm: currentCm });
    }

    map[chrom] = intervals;
  }

  const outputPath = path.join(process.cwd(), 'src/data/master_genetic_map.json');
  fs.writeFileSync(outputPath, JSON.stringify(map, null, 2));
  console.log(`✅ Genetic Map built and saved to ${outputPath}`);
}

buildGeneticMap();
