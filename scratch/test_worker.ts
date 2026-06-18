import { workerPoolEngine } from '../src/engines/ancestry/workerPoolEngine';

const aimsDatabase = {
  'rs1': {
    chrom: '1',
    pos: 1000,
    alleles: ['A', 'G'],
    frequencies: { EUR: 0.8, AFR: 0.1, EAS: 0.1 }
  },
  'rs2': {
    chrom: '1',
    pos: 2000,
    alleles: ['C', 'T'],
    frequencies: { EUR: 0.2, AFR: 0.7, EAS: 0.1 }
  },
  'rs3': {
    chrom: '1',
    pos: 3000,
    alleles: ['A', 'C'],
    frequencies: { EUR: 0.1, AFR: 0.1, EAS: 0.8 }
  }
};

const snps = [
  { rsid: 'rs1', genotype: 'AA', chrom: '1', pos: 1000 },
  { rsid: 'rs2', genotype: 'CC', chrom: '1', pos: 2000 },
  { rsid: 'rs3', genotype: 'AC', chrom: '1', pos: 3000 }
];

const populations = ['EUR', 'AFR', 'EAS', 'AMR', 'SAS'];

async function run() {
  console.log("Starting test...");
  try {
    const segments = await workerPoolEngine.runParallelAncestry(
      snps,
      aimsDatabase,
      populations,
      20,
      2,
      1
    );
    console.log("Segments:", JSON.stringify(segments, null, 2));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    workerPoolEngine.terminateAll();
  }
}

run();
