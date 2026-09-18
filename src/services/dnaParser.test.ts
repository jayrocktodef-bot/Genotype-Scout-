import { describe, it, expect } from 'vitest';
import { 
  parseRawDNA, 
  parseRawDNAStream, 
  normalizeChromosome, 
  cleanGenotypeString, 
  detectHeaderColumns,
  detectVendorAndChip,
  sniffDelimiter,
  sniffAndBuildParsePlan,
  decompressGenomicBuffer,
  checkUnsupportedArchive,
  decodeTextBuffer,
  IUPAC_DEGENERATE_MAP,
  microPhaseDataset,
  parseVcfColumnLayout
} from './dnaParser';
import { GenomicsErrorCode } from './errorCaller';
import { parseDNAFile } from '../utils/dnaParser';
import { microPhase } from '../engines/ancestry/microPhaser';
import { correctPhasingErrors } from '../engines/ancestry/phasingCorrector';
import { zipSync, strToU8 } from 'fflate';

describe('dnaParser - Commercial Vendors & Edge Cases', () => {
  it('should parse 23andMe v1-v5 format correctly', () => {
    const rawData = `
# 23andMe v5
# rsid	chromosome	position	genotype
rs123	1	100	AA
rs456	Y	200	G
rs789	MT	300	C
rsIndel1	2	400	II
rsIndel2	3	500	D
rsSlash	4	600	A/G
rsPipe	5	700	C|T
`;
    const result = parseRawDNA(rawData);
    expect(result.format).toBe('23andMe');
    expect(result.chip).toBe('23andMe v5 (GSA)');
    expect(result.snpMap['rs123']).toBe('AA');
    expect(result.yMap['rs456']).toBe('G');
    expect(result.mtMap['300']).toBe('C');
    expect(result.snpMap['rsindel1']).toBe('II');
    expect(result.snpMap['rsindel2']).toBe('D');
    expect(result.snpMap['rsslash']).toBe('AG');
    expect(result.snpMap['rspipe']).toBe('CT');
    expect(result.snpCount).toBe(7);
  });

  it('should parse AncestryDNA v1-v3 format and correctly map chr25 to X (PAR) and chr26 to MT', () => {
    const rawData = `
# AncestryDNA v2
rsid	chromosome	position	allele1	allele2
rs123	1	100	A	A
rs456	Y	200	G	0
rs789	26	300	C	0
rsPar	25	15000	T	C
rsMissing	2	400	0	0
`;
    const result = parseRawDNA(rawData);
    expect(result.format).toBe('AncestryDNA');
    expect(result.snpMap['rs123']).toBe('AA');
    expect(result.yMap['rs456']).toBe('G');
    expect(result.mtMap['300']).toBe('C');
    // PAR chromosome 25 MUST map to X, NOT to MT
    expect(result.snpMetaMap['rspar'].chrom).toBe('X');
    expect(result.xMap['rspar']).toBe('CT');
    expect(result.snpMap['rsmissing']).toBeUndefined();
    expect(result.snpCount).toBe(4);
  });

  it('should parse MyHeritage CSV format correctly', () => {
    const rawData = `# MyHeritage DNA raw data
"RSID","CHROMOSOME","POSITION","RESULT"
"rs12345","1","1000","AG"
"rs67890","X","2000","CC"
"rsMito","MT","3000","A"
"rsNoCall","2","4000","--"
`;
    const result = parseRawDNA(rawData);
    expect(result.format).toBe('MyHeritage');
    expect(result.snpMap['rs12345']).toBe('AG');
    expect(result.xMap['rs67890']).toBe('CC');
    expect(result.mtMap['3000']).toBe('A');
    expect(result.snpMap['rsnocall']).toBeUndefined();
    expect(result.snpCount).toBe(3);
  });

  it('should parse FamilyTreeDNA (FTDNA) Family Finder CSV format', () => {
    const rawData = `RSID,CHROMOSOME,POSITION,RESULT
"rs111","1","500","AA"
"rs222","2","600","GT"
"rs333","Y","700","T"
`;
    const result = parseRawDNA(rawData);
    expect(result.format).toBe('FTDNA');
    expect(result.snpMap['rs111']).toBe('AA');
    expect(result.snpMap['rs222']).toBe('GT');
    expect(result.yMap['rs333']).toBe('T');
    expect(result.snpCount).toBe(3);
  });

  it('should parse Living DNA 5-column TSV format', () => {
    const rawData = `# Living DNA
rsid	chromosome	position	allele1	allele2
rs100	1	1000	A	G
rs200	X	2000	C	C
rs300	MT	3000	T	T
`;
    const result = parseRawDNA(rawData);
    expect(result.format).toBe('Living DNA');
    expect(result.snpMap['rs100']).toBe('AG');
    expect(result.xMap['rs200']).toBe('CC');
    expect(result.mtMap['3000']).toBe('T');
    expect(result.snpCount).toBe(3);
  });

  it('should adaptively parse TellmeGen inverted column layout (Chromosome,Position,Genotype,RSID)', () => {
    const rawData = `Chromosome,Position,Genotype,RSID
1,1001,AA,rs99901
2,2002,CT,rs99902
X,3003,G,rs99903
`;
    const result = parseRawDNA(rawData);
    expect(result.snpMap['rs99901']).toBe('AA');
    expect(result.snpMap['rs99902']).toBe('CT');
    expect(result.xMap['rs99903']).toBe('G');
    expect(result.snpMetaMap['rs99901'].chrom).toBe('1');
    expect(result.snpMetaMap['rs99901'].pos).toBe(1001);
    expect(result.snpCount).toBe(3);
  });

  it('should adaptively parse custom 5-column format (Chr,Pos,Allele1,Allele2,rsID)', () => {
    const rawData = `Chr,Pos,Allele1,Allele2,rsID
1,5000,A,G,rs5001
2,6000,C,T,rs6001
`;
    const result = parseRawDNA(rawData);
    expect(result.snpMap['rs5001']).toBe('AG');
    expect(result.snpMap['rs6001']).toBe('CT');
    expect(result.snpMetaMap['rs5001'].pos).toBe(5000);
  });

  it('should parse Affymetrix and Illumina probe sets and hydrate coordinate keys', () => {
    const rawData = `
# Illumina / Affymetrix array export
rsid	chromosome	position	genotype
Affx-12345	1	10000	AG
ILMN_67890	2	20000	CC
exm-1112	3	30000	TT
`;
    const result = parseRawDNA(rawData);
    expect(result.snpMap['affx-12345']).toBe('AG');
    expect(result.snpMap['chr1_10000']).toBe('AG');
    expect(result.snpMap['ilmn_67890']).toBe('CC');
    expect(result.snpMap['chr2_20000']).toBe('CC');
    expect(result.snpMap['exm-1112']).toBe('TT');
    expect(result.snpMap['chr3_30000']).toBe('TT');
    expect(result.snpCount).toBe(3);
  });

  it('should handle UTF-8 BOM character at start of file', () => {
    const rawData = '\uFEFF# 23andMe\n# rsid\tchromosome\tposition\tgenotype\nrs123\t1\t100\tAA\n';
    const result = parseRawDNA(rawData);
    expect(result.snpMap['rs123']).toBe('AA');
    expect(result.snpCount).toBe(1);
  });

  it('should parse semicolon-delimited CSV formats', () => {
    const rawData = `rsid;chromosome;position;genotype
rs123;1;100;AA
rs456;2;200;CT
`;
    const result = parseRawDNA(rawData);
    expect(result.snpMap['rs123']).toBe('AA');
    expect(result.snpMap['rs456']).toBe('CT');
    expect(result.snpCount).toBe(2);
  });

  it('should parse VCF format including phased genotypes, multi-allelic sites, and indels', () => {
    const rawData = `##fileformat=VCFv4.2
##FILTER=<ID=PASS,Description="All filters passed">
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE
1	100	rs123	A	G	.	PASS	.	GT	0/1
2	200	rsPhased	C	T	.	PASS	.	GT:PS	0|1:1001
Y	300	rs456	T	C	.	PASS	.	GT	1/1
MT	400	.	C	G,T	.	PASS	.	GT	2/2
3	500	rsIndel	A	AT	.	PASS	.	GT	0/1
`;
    const result = parseRawDNA(rawData);
    expect(result.format).toBe('VCF');
    expect(result.snpMap['rs123']).toBe('AG');
    expect(result.snpMap['rsphased']).toBe('CT');
    expect(result.yMap['rs456']).toBe('CC');
    expect(result.mtMap['400']).toBe('T');
    expect(result.snpMap['rsindel']).toBe('AI');
    expect(result.snpCount).toBe(5);
    // Phasing preservation
    expect(result.isPhased).toBe(true);
    expect(result.phasingMethod).toBe('VCF_PHASED');
    expect(result.haplotype1Map?.['rsphased']).toBe('C');
    expect(result.haplotype2Map?.['rsphased']).toBe('T');
    expect(result.phaseSets?.['rsphased']).toBe('1001');
  });

  it('should statistically micro-phase unphased commercial datasets with microPhaseDataset', () => {
    const rawData = `
# 23andMe v5
# rsid	chromosome	position	genotype
rs123	1	100	AG
rs456	1	200	CT
rs789	1	300	AA
`;
    const unphased = parseRawDNA(rawData);
    expect(unphased.isPhased).toBe(false);
    
    const phased = microPhaseDataset(unphased);
    expect(phased.isPhased).toBe(true);
    expect(phased.phasingMethod).toBe('STATISTICAL_MICROPHASED');
    expect(phased.haplotype1Map).toBeDefined();
    expect(phased.haplotype2Map).toBeDefined();
    expect(phased.haplotype1Map?.['rs123']).toBeDefined();
    expect(phased.haplotype2Map?.['rs123']).toBeDefined();
    expect((phased.haplotype1Map?.['rs123'] || '') + (phased.haplotype2Map?.['rs123'] || '')).toBe('AG');
  });

  it('should parse WeGene format with comments and Chinese headers', () => {
    const rawData = `# WeGene Raw Data Download
# 微基因原始数据
# rsid	chromosome	position	genotype
rs1001	1	5000	AA
rs1002	2	6000	AG
rs1003	Y	7000	G
rs1004	MT	8000	T
`;
    const result = parseRawDNA(rawData);
    expect(result.format).toBe('WeGene');
    expect(result.chip).toBe('WeGene Affymetrix/GSA');
    expect(result.snpMap['rs1001']).toBe('AA');
    expect(result.snpMap['rs1002']).toBe('AG');
    expect(result.yMap['rs1003']).toBe('G');
    expect(result.mtMap['8000']).toBe('T');
    expect(result.snpCount).toBe(4);
  });

  it('should parse 24Genetics and TellmeGen with Spanish column headers', () => {
    const rawData = `# 24Genetics export
Marcador,Cromosoma,Posición,Genotipo
rs8801,1,10000,CC
rs8802,2,20000,CT
rs8803,X,30000,A
rs8804,24,40000,G
`;
    const result = parseRawDNA(rawData);
    expect(result.format).toBe('24Genetics');
    expect(result.snpMap['rs8801']).toBe('CC');
    expect(result.snpMap['rs8802']).toBe('CT');
    expect(result.xMap['rs8803']).toBe('A');
    expect(result.yMap['rs8804']).toBe('G');
    expect(result.snpCount).toBe(4);
  });

  it('should parse Dante Labs GRCh38 VCF with chr prefixes, hemizygous calls, and symbolic indels', () => {
    const rawData = `##fileformat=VCFv4.2
##source=Dante Labs
##reference=GRCh38
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE1
chr1	10000	rsDante1	A	G	99	PASS	.	GT	0/1
chrX	20000	rsDanteX	C	T	99	PASS	.	GT	1
chrY	30000	rsDanteY	G	A	99	PASS	.	GT	1
chrM	40000	rsDanteMT	T	C	99	PASS	.	GT	1
chr2	50000	rsDanteDel	A	<DEL>	99	PASS	.	GT	0/1
chr3	60000	rsDanteIns	C	<INS>	99	PASS	.	GT	1/1
`;
    const result = parseRawDNA(rawData);
    expect(result.format).toBe('Dante Labs');
    expect(result.build).toBe('GRCh38');
    expect(result.snpMap['rsdante1']).toBe('AG');
    expect(result.xMap['rsdantex']).toBe('T'); // hemizygous call preserved
    expect(result.yMap['rsdantey']).toBe('A'); // hemizygous call preserved
    expect(result.mtMap['40000']).toBe('C');
    expect(result.snpMap['rsdantedel']).toBe('AD');
    expect(result.snpMap['rsdanteins']).toBe('II');
    expect(result.snpCount).toBe(6);
  });

  it('should parse Nebula Genomics WGS VCF format correctly', () => {
    const rawData = `##fileformat=VCFv4.3
##source=Nebula Genomics
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE_NEBULA
chr1	12345	rsNebula1	A	C	60	PASS	.	GT	0|1
chrY	67890	rsNebulaY	T	G	60	PASS	.	GT	1
`;
    const result = parseRawDNA(rawData);
    expect(result.format).toBe('Nebula Genomics');
    expect(result.snpMap['rsnebula1']).toBe('AC');
    expect(result.yMap['rsnebulay']).toBe('G');
    expect(result.snpCount).toBe(2);
  });

  it('should parse CircleDNA, Geno 2.0, and Genes for Good formats', () => {
    const circleText = `# CircleDNA Raw Data\nrs1\t1\t100\tAA\n`;
    expect(parseRawDNA(circleText).format).toBe('CircleDNA');

    const genoText = `# Geno 2.0 National Geographic\nrs2\t1\t200\tGG\n`;
    expect(parseRawDNA(genoText).format).toBe('Geno 2.0');

    const gfgText = `# Genes for Good\nrs3\t1\t300\tTT\n`;
    expect(parseRawDNA(gfgText).format).toBe('Genes for Good');
  });

  it('should handle AncestryDNA hemizygous split alleles 0 A and A 0 correctly', () => {
    const rawData = `# AncestryDNA raw data download
rsid	chromosome	position	allele1	allele2
rsZeroFirst	Y	100	0	A
rsZeroSecond	Y	200	G	0
rsDashFirst	Y	300	-	C
rsBothZero	Y	400	0	0
`;
    const result = parseRawDNA(rawData);
    expect(result.yMap['rszerofirst']).toBe('A');
    expect(result.yMap['rszerosecond']).toBe('G');
    expect(result.yMap['rsdashfirst']).toBe('C');
    expect(result.snpMap['rsbothzero']).toBeUndefined();
    expect(result.snpCount).toBe(3);
  });

  it('should accurately infer biological sex from Y-DNA and X chromosome heterozygosity', () => {
    // Male dataset with >15 Y-DNA calls
    let maleData = `# 23andMe v5\nrsid\tchromosome\tposition\tgenotype\n`;
    for (let i = 1; i <= 20; i++) {
      maleData += `rsY${i}\tY\t${1000 + i}\tA\n`;
    }
    const maleResult = parseRawDNA(maleData);
    expect(maleResult.inferredBiologicalSex).toBe('MALE');

    // Female dataset with 0 Y-DNA calls and heterozygous X calls
    let femaleData = `# 23andMe v5\nrsid\tchromosome\tposition\tgenotype\n`;
    for (let i = 1; i <= 60; i++) {
      femaleData += `rsX${i}\tX\t${5000000 + i * 1000}\t${i % 2 === 0 ? 'AG' : 'AA'}\n`;
    }
    const femaleResult = parseRawDNA(femaleData);
    expect(femaleResult.inferredBiologicalSex).toBe('FEMALE');
  });

  it('should parse files uniformly via parseDNAFile utility', () => {
    const rawData = `# 23andMe
rs123\t1\t100\tAA
rs456\t2\t200\tCT
`;
    const map = parseDNAFile(rawData);
    expect(map['rs123']).toBe('AA');
    expect(map['rs456']).toBe('CT');
  });

  it('should parse reordered AncestryDNA columns (chromosome, rsid, position, allele1, allele2)', () => {
    const rawData = `
# AncestryDNA New Format
chromosome\trsid\tposition\tallele1\tallele2
1\trs1001\t15000\tA\tG
2\trs1002\t25000\tC\tT
X\trs1003\t35000\tA\tA
`;
    const result = parseRawDNA(rawData);
    expect(result.snpMap['rs1001']).toBe('AG');
    expect(result.snpMap['rs1002']).toBe('CT');
    expect(result.xMap['rs1003']).toBe('AA');
    expect(result.snpMetaMap['rs1001'].chrom).toBe('1');
    expect(result.snpMetaMap['rs1001'].pos).toBe(15000);
    expect(result.snpCount).toBe(3);
  });

  it('should parse headerless raw data rows correctly using statistical content voting', () => {
    const rawData = `
rs101\t1\t100000\tAA
rs102\t1\t200000\tAG
rs103\t2\t300000\tGG
rs104\t3\t400000\tCT
rs105\tX\t500000\tCC
`;
    const result = parseRawDNA(rawData);
    expect(result.snpMap['rs101']).toBe('AA');
    expect(result.snpMap['rs102']).toBe('AG');
    expect(result.snpMap['rs103']).toBe('GG');
    expect(result.snpMap['rs104']).toBe('CT');
    expect(result.xMap['rs105']).toBe('CC');
    expect(result.snpCount).toBe(5);
  });

  it('should parse headerless inverted columns (chr, pos, gt, rsid) via content voting', () => {
    const rawData = `
1\t100000\tAA\trs201
1\t200000\tAG\trs202
2\t300000\tGG\trs203
3\t400000\tCT\trs204
X\t500000\tCC\trs205
`;
    const result = parseRawDNA(rawData);
    expect(result.snpMap['rs201']).toBe('AA');
    expect(result.snpMap['rs202']).toBe('AG');
    expect(result.snpMetaMap['rs201'].chrom).toBe('1');
    expect(result.snpMetaMap['rs201'].pos).toBe(100000);
    expect(result.snpCount).toBe(5);
  });

  it('should tolerate metadata and disclaimer lines without comment prefixes', () => {
    const rawData = `AncestryDNA raw data file version 3.0
Export Date: 2026-03-15
Terms of Service and Disclaimer: This genetic data is provided for informational purposes only.
rsid\tchromosome\tposition\tallele1\tallele2
rs901\t1\t50000\tA\tA
rs902\t2\t60000\tC\tG
rs903\tY\t70000\tT\t0
`;
    const result = parseRawDNA(rawData);
    expect(result.snpMap['rs901']).toBe('AA');
    expect(result.snpMap['rs902']).toBe('CG');
    expect(result.yMap['rs903']).toBe('T');
    expect(result.snpCount).toBe(3);
  });

  it('should throw error for empty file', () => {
    expect(() => parseRawDNA('')).toThrow('This file is completely empty.');
  });

  it('should throw error with ERR-4025FGD1 for invalid data', () => {
    const rawData = 'invalid data without columns';
    expect(() => parseRawDNA(rawData)).toThrow(/ERR-4025FGD1/);
  });
});

describe('dnaParser - Stream Processing', () => {
  it('should stream parse 23andMe file correctly', async () => {
    const rawData = `
# 23andMe v5
# rsid	chromosome	position	genotype
rs123	1	100	AA
rs456	Y	200	G
rs789	MT	300	C
`;
    const file = new File([rawData], '23andme.txt', { type: 'text/plain' });
    const progressCalls: any[] = [];
    const result = await parseRawDNAStream(file, undefined, (bytes, total, snps) => {
      progressCalls.push({ bytes, total, snps });
    });

    expect(result.format).toBe('23andMe');
    expect(result.snpMap['rs123']).toBe('AA');
    expect(result.yMap['rs456']).toBe('G');
    expect(result.mtMap['300']).toBe('C');
    expect(result.snpCount).toBe(3);
  });

  it('should stream parse VCF file correctly', async () => {
    const rawData = `##fileformat=VCFv4.2
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE
1	100	rs123	A	G	.	PASS	.	GT	0/1
Y	200	rs456	T	C	.	PASS	.	GT	1/1
MT	300	.	C	G,T	.	PASS	.	GT	2/2
`;
    const file = new File([rawData], 'vcf.vcf', { type: 'text/plain' });
    const result = await parseRawDNAStream(file);
    expect(result.format).toBe('VCF');
    expect(result.snpMap['rs123']).toBe('AG');
    expect(result.yMap['rs456']).toBe('CC');
    expect(result.mtMap['300']).toBe('T');
    expect(result.snpCount).toBe(3);
  });
});

describe('Phasing & MicroPhaser Engine', () => {
  it('should resolve strand orientation and align effect alleles in microPhaser', () => {
    const userSnps = [
      { rsid: 'rsHomo', genotype: 'AA' },
      { rsid: 'rsHeteroForward', genotype: 'AG' },
      { rsid: 'rsHeteroReverse', genotype: 'CT' } // Reverse strand complement for A/G effect allele
    ];

    const mockAimsDb: Record<string, any> = {
      'rshomo': { alleles: ['A'], frequencies: { AFR: 0.9, EUR: 0.8 } },
      'rsheteroforward': { alleles: ['A'], frequencies: { AFR: 0.9, EUR: 0.8 } },
      'rsheteroreverse': { alleles: ['A'], frequencies: { AFR: 0.9, EUR: 0.8 } }
    };

    const phased = microPhase(userSnps, mockAimsDb);
    expect(phased.strandA.length).toBe(3);
    expect(phased.strandB.length).toBe(3);
    // Homozygous site
    expect(phased.strandA[0]).toBe('A');
    expect(phased.strandB[0]).toBe('A');
    // Forward strand heterozygous: A is major -> strandA
    expect(phased.strandA[1]).toBe('A');
    expect(phased.strandB[1]).toBe('G');
    // Reverse strand complement (T corresponds to A): T is major -> strandA
    expect(phased.strandA[2]).toBe('T');
    expect(phased.strandB[2]).toBe('C');
    expect(phased.confidence).toBe(1.0);
  });

  it('should correct phasing errors using LAI feedback in correctPhasingErrors', () => {
    const strandA = ['A', 'G'];
    const strandB = ['G', 'A'];
    const rsids = ['rs1', 'rs2'];
    const markerToWindow = [0, 0];
    const populations = ['AFR', 'EUR'];

    // Mock LAI results where window 0 has pop AFR on strand A, and EUR on strand B
    const laiA = {
      smoothedProbs: new Float32Array([0.9, 0.1]),
      nWindows: 1,
      nPopulations: 2
    };
    const laiB = {
      smoothedProbs: new Float32Array([0.1, 0.9]),
      nWindows: 1,
      nPopulations: 2
    };

    const mockAimsDb: Record<string, any> = {
      'rs1': { alleles: ['A'], frequencies: { AFR: 0.99, EUR: 0.01 } },
      // rs2 is currently A on strand B (EUR) and G on strand A (AFR), but A is 99% in AFR and 1% in EUR!
      'rs2': { alleles: ['A'], frequencies: { AFR: 0.99, EUR: 0.01 } }
    };

    const corrected = correctPhasingErrors(
      strandA,
      strandB,
      laiA as any,
      laiB as any,
      mockAimsDb,
      rsids,
      markerToWindow,
      populations
    );

    // rs2 should be swapped so that allele 'A' goes to strand A (AFR)
    expect(corrected.strandA[1]).toBe('A');
    expect(corrected.strandB[1]).toBe('G');
  });

  it('should accurately sniff tab delimiter without confounding with spaces', () => {
    const lines = [
      '# This is a sample preamble',
      'rs123\t1\t1000\tAA',
      'rs456\t1\t2000\tGG',
      'rs789\t2\t3000\tCC'
    ];
    const { delim, delimStr } = sniffDelimiter(lines);
    expect(delimStr).toBe('\t');
    expect(delim).toBe(9);
  });

  it('should detect headers located past 64 preamble lines', () => {
    const preamble: string[] = [];
    for (let i = 0; i < 80; i++) {
      preamble.push(`# Disclaimer line ${i}: This genetic report is for informational purposes only.`);
    }
    const sampleLines = [
      ...preamble,
      '# rsid\tchromosome\tposition\tgenotype',
      'rs1001\t1\t123456\tAA',
      'rs1002\t1\t123457\tGG'
    ];
    const plan = sniffAndBuildParsePlan(sampleLines);
    expect(plan.mapping).toBeDefined();
    expect(plan.mapping.chromIdx).toBe(1);
    expect(plan.mapping.posIdx).toBe(2);
    expect(plan.mapping.gtIdx).toBe(3);
  });

  it('should extract the genomic file and discard README.txt from a ZIP archive', () => {
    const zipData = zipSync({
      'README.txt': strToU8('Company Disclaimers and Terms of Service. Do not parse this file.'),
      'genome_User_Full_2026.txt': strToU8('# rsid\tchromosome\tposition\tgenotype\nrs123\t1\t100\tAA\nrs456\t2\t200\tGG\n')
    });
    const extracted = decompressGenomicBuffer(zipData);
    const text = new TextDecoder().decode(extracted);
    expect(text).toContain('rs123');
    expect(text).not.toContain('Company Disclaimers');
  });

  it('should parse AncestryDNA split-allele format in streaming mode', async () => {
    const ancestryData = `# AncestryDNA raw data
# rsid\tchromosome\tposition\tallele1\tallele2
rs100\t1\t1000\tA\tA
rs200\t1\t2000\tA\tG
rs300\t2\t3000\tC\tT
rs400\tY\t4000\tG\t0
`;
    const blob = new Blob([ancestryData]);
    const parsed = await parseRawDNAStream(blob);
    expect(parsed.format).toBe('AncestryDNA');
    expect(parsed.snpCount).toBe(4);
    expect(parsed.snpMap['rs100']).toBe('AA');
    expect(parsed.snpMap['rs200']).toBe('AG');
    expect(parsed.snpMap['rs300']).toBe('CT');
    expect(parsed.snpMap['rs400']).toBe('G');
    expect(parsed.yMap['rs400']).toBe('G');
  });
});

// ── ERR-4025FGD1 Regression Suite: Ancestry UK + MyHeritage WGS ──────────────
describe('ERR-4025FGD1 regression: Ancestry UK BOM + MyHeritage WGS gVCF', () => {
  it('should parse AncestryDNA UK export with UTF-8 BOM on the column header row', () => {
    // UK exports (Windows/Excel) prepend \uFEFF to the header row,
    // making the first token '\uFEFFrsid' instead of 'rsid'.
    const bom = '\uFEFF';
    const rawData = `# AncestryDNA
# Ancestry.co.uk raw data export
${bom}rsid\tchromosome\tposition\tallele1\tallele2
rs1234\t1\t100\tA\tG
rs5678\tX\t200\tC\tT
rs9012\tY\t300\tG\t0
`;
    const result = parseRawDNA(rawData);
    expect(result.format).toBe('AncestryDNA');
    expect(result.snpCount).toBeGreaterThanOrEqual(3);
    expect(result.snpMap['rs1234']).toBe('AG');
    expect(result.snpMap['rs5678']).toBe('CT');
    expect(result.yMap['rs9012']).toBe('G');
  });

  it('should throw a gvcf_nonref structured error for a pure gVCF <NON_REF> file', () => {
    const gvcfData = `##fileformat=VCFv4.2
##ALT=<ID=NON_REF,Description="Represents any possible alternative allele">
##INFO=<ID=END,Number=1,Type=Integer,Description="Stop position">
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE
chr1\t100\t.\tA\t<NON_REF>\t.\tPASS\t.\tGT\t0/0
chr1\t200\t.\tC\t<NON_REF>\t.\tPASS\t.\tGT\t0/0
chr1\t300\t.\tG\t<NON_REF>\t.\tPASS\t.\tGT\t0/0
`;
    expect(() => parseRawDNA(gvcfData)).toThrow(/gvcf_nonref|symbolic_alt_only|ERR-4025FGD1/);
  });

  it('should parse MyHeritage WGS VCF with mixed gVCF and real variant rows', () => {
    const mixedVcf = `##fileformat=VCFv4.2
##source=MyHeritage
##reference=GRCh38
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE
chr1\t100\trs111\tA\tG\t.\tPASS\t.\tGT\t0/1
chr1\t200\t.\tC\t<NON_REF>\t.\tPASS\tEND=500\tGT\t0/0
chr2\t300\trs222\tT\tC\t.\tPASS\t.\tGT\t1/1
chrY\t400\trs333\tG\tA\t.\tPASS\t.\tGT\t1
`;
    const result = parseRawDNA(mixedVcf);
    expect(result.format).toBe('MyHeritage');
    expect(result.chip).toBe('MyHeritage WGS (VCF)');
    expect(result.snpCount).toBeGreaterThanOrEqual(2);
    expect(result.snpMap['rs111']).toBeDefined();
    expect(result.snpMap['rs222']).toBe('CC'); // REF=T, ALT=C, GT=1/1 → homozygous ALT → CC
    expect(result.yMap['rs333']).toBeDefined();
  });

  it('should still parse <DEL>/<INS> structural variant ALTs (not gVCF placeholders)', () => {
    // <DEL> and <INS> are structural variants with real biological meaning.
    // They must NOT be caught by the gVCF placeholder guard.
    const svVcf = `##fileformat=VCFv4.2
##source=Dante Labs
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE1
chr2\t50000\trsSvDel\tA\t<DEL>\t99\tPASS\t.\tGT\t0/1
chr3\t60000\trsSvIns\tC\t<INS>\t99\tPASS\t.\tGT\t1/1
`;
    const result = parseRawDNA(svVcf);
    expect(result.snpMap['rsSvDel'.toLowerCase()]).toBeDefined(); // Should be 'AD'
    expect(result.snpMap['rsSvIns'.toLowerCase()]).toBeDefined(); // Should be 'II'
  });
});

// ── Multi-Sample VCF, IUPAC, Unsupported Archives, and DTC/Clinical Adaptations ──
describe('DNA Parser Adaptations - Multi-Sample, IUPAC, Archives, UTF-16, Clinical Formats', () => {
  it('should detect multi-sample VCF columns and allow selecting specific sample by name or index', () => {
    const multiVcf = `##fileformat=VCFv4.2
##source=FamilyTrioPipeline
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tFATHER\tMOTHER\tCHILD
chr1\t1001\trs1001\tA\tG\t99\tPASS\t.\tGT\t0/1\t1/1\t0/1
chr1\t1002\trs1002\tC\tT\t99\tPASS\t.\tGT\t1/1\t0/0\t0/1
chrY\t2001\trs2001\tA\tC\t99\tPASS\t.\tGT\t1\t.\t1
`;
    // 1. Default selection should pick FATHER (index 0)
    const defaultResult = parseRawDNA(multiVcf);
    expect(defaultResult.sampleNames).toEqual(['FATHER', 'MOTHER', 'CHILD']);
    expect(defaultResult.selectedSample).toBe('FATHER');
    expect(defaultResult.snpMap['rs1001']).toBe('AG');
    expect(defaultResult.snpMap['rs1002']).toBe('TT');
    expect(defaultResult.yMap['rs2001']).toBe('C');

    // 2. Explicit selection of MOTHER
    const motherResult = parseRawDNA(multiVcf, undefined, undefined, 'MOTHER');
    expect(motherResult.selectedSample).toBe('MOTHER');
    expect(motherResult.snpMap['rs1001']).toBe('GG');
    // MOTHER has hom-ref (0/0) on rs1002
    expect(motherResult.snpMap['rs1002']).toBeUndefined();
    // MOTHER has no call (.) on chrY
    expect(motherResult.yMap['rs2001']).toBeUndefined();

    // 3. Explicit selection of CHILD (by index 2)
    const childResult = parseRawDNA(multiVcf, undefined, undefined, 2);
    expect(childResult.selectedSample).toBe('CHILD');
    expect(childResult.snpMap['rs1001']).toBe('AG');
    expect(childResult.snpMap['rs1002']).toBe('CT');
    expect(childResult.yMap['rs2001']).toBe('C');
  });

  it('should stream parse multi-sample VCF with target sample selection', async () => {
    const multiVcf = `##fileformat=VCFv4.2
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tPATIENT_A\tPATIENT_B
chr1\t5001\trs5001\tA\tT\t.\tPASS\t.\tGT\t0/0\t1/1
chr2\t5002\trs5002\tG\tC\t.\tPASS\t.\tGT\t0/1\t1/1
`;
    const blob = new Blob([multiVcf]);
    const parsed = await parseRawDNAStream(blob, undefined, undefined, 'PATIENT_B');
    expect(parsed.sampleNames).toEqual(['PATIENT_A', 'PATIENT_B']);
    expect(parsed.selectedSample).toBe('PATIENT_B');
    expect(parsed.snpMap['rs5001']).toBe('TT');
    expect(parsed.snpMap['rs5002']).toBe('CC');
  });

  it('should normalize IUPAC single-letter degenerate/ambiguity codes to 2-base genotypes without dropping', () => {
    // R=AG, Y=CT, S=CG, W=AT, K=GT, M=AC
    expect(cleanGenotypeString('R')).toBe('AG');
    expect(cleanGenotypeString('Y')).toBe('CT');
    expect(cleanGenotypeString('S')).toBe('CG');
    expect(cleanGenotypeString('W')).toBe('AT');
    expect(cleanGenotypeString('K')).toBe('GT');
    expect(cleanGenotypeString('M')).toBe('AC');

    const rawData = `# 23andMe with IUPAC calls
# rsid\tchromosome\tposition\tgenotype
rs101\t1\t101\tR
rs102\t1\t102\tY
rs103\t1\t103\tS
rs104\t1\t104\tW
rs105\t1\t105\tK
rs106\t1\t106\tM
rs107\t1\t107\t?
rs108\t1\t108\t00
rs109\t1\t109\tNA/NA
`;
    const result = parseRawDNA(rawData);
    expect(result.snpCount).toBe(6);
    expect(result.snpMap['rs101']).toBe('AG');
    expect(result.snpMap['rs102']).toBe('CT');
    expect(result.snpMap['rs103']).toBe('CG');
    expect(result.snpMap['rs104']).toBe('AT');
    expect(result.snpMap['rs105']).toBe('GT');
    expect(result.snpMap['rs106']).toBe('AC');
    // Uncalled rows should not be in snpMap
    expect(result.snpMap['rs107']).toBeUndefined();
    expect(result.snpMap['rs108']).toBeUndefined();
    expect(result.snpMap['rs109']).toBeUndefined();
  });

  it('should reject unsupported archive formats (.7z, .rar, .bz2, .xz) with actionable error code ERR_ARCHIVE_UNSUPPORTED', async () => {
    // 7-Zip magic bytes: 37 7A BC AF 27 1C
    const sevenZipBytes = new Uint8Array([0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c, 0x00, 0x01]);
    // RAR magic bytes: 52 61 72 21
    const rarBytes = new Uint8Array([0x52, 0x61, 0x72, 0x21, 0x1a, 0x07]);
    // Bzip2 magic bytes: 42 5A 68
    const bz2Bytes = new Uint8Array([0x42, 0x5a, 0x68, 0x39, 0x31]);
    // XZ magic bytes: FD 37 7A 58 5A 00
    const xzBytes = new Uint8Array([0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x00]);

    // Check helper directly
    expect(() => checkUnsupportedArchive(sevenZipBytes)).toThrowError();
    expect(() => checkUnsupportedArchive(rarBytes)).toThrowError();
    expect(() => checkUnsupportedArchive(bz2Bytes)).toThrowError();
    expect(() => checkUnsupportedArchive(xzBytes)).toThrowError();

    // Check decompressGenomicBuffer
    try {
      decompressGenomicBuffer(sevenZipBytes);
      expect.unreachable('Should have thrown GenomicsError');
    } catch (err: any) {
      expect(err.code).toBe(GenomicsErrorCode.ERR_ARCHIVE_UNSUPPORTED);
      expect(err.message).toContain('.7z');
    }

    try {
      decompressGenomicBuffer(rarBytes);
      expect.unreachable('Should have thrown GenomicsError');
    } catch (err: any) {
      expect(err.code).toBe(GenomicsErrorCode.ERR_ARCHIVE_UNSUPPORTED);
      expect(err.message).toContain('.rar');
    }

    // Check streaming early detection
    const blob7z = new Blob([sevenZipBytes]);
    await expect(parseRawDNAStream(blob7z)).rejects.toThrowError();
  });

  it('should parse quoted CSV fields and tolerate trailing ## comment footers (Helix)', () => {
    const helixData = `##fileformat=Helix_v1.0
##source=Helix
"rsid","chromosome","position","genotype"
"rs2001","1","200100","AA"
"rs2002","1","200200","AG"
"rs2003","2","200300","TT"
## Export completed successfully
## Checksum: abc12345
`;
    const result = parseRawDNA(helixData);
    expect(result.format).toBe('Helix');
    expect(result.snpCount).toBe(3);
    expect(result.snpMap['rs2001']).toBe('AA');
    expect(result.snpMap['rs2002']).toBe('AG');
    expect(result.snpMap['rs2003']).toBe('TT');
  });

  it('should parse AncestryDNA 2.0 with ref/alt split column headers', () => {
    const ancestry2 = `# AncestryDNA 2.0 export
rsid\tchromosome\tposition\tref\talt
rs3001\t1\t300100\tA\tC
rs3002\t2\t300200\tG\tG
rs3003\tY\t300300\tT\t0
`;
    const result = parseRawDNA(ancestry2);
    expect(result.snpCount).toBe(3);
    expect(result.snpMap['rs3001']).toBe('AC');
    expect(result.snpMap['rs3002']).toBe('GG');
    expect(result.yMap['rs3003']).toBe('T');
  });

  it('should parse Color Genomics clinical variants with variant_id format', () => {
    const colorData = `# Color Genomics export
"variant_id","chromosome","position","allele1","allele2"
"chr1-400100-A-G","1","400100","A","G"
"chr1-400200-C-C","1","400200","C","C"
"1-400300-T-A","1","400300","T","A"
`;
    const result = parseRawDNA(colorData);
    expect(result.format).toBe('Color Genomics');
    expect(result.snpCount).toBe(3);
    expect(result.snpMap['chr1-400100-a-g']).toBe('AG');
    expect(result.snpMap['chr1-400200-c-c']).toBe('CC');
    expect(result.snpMap['1-400300-t-a']).toBe('AT');
  });

  it('should decode UTF-16 LE and UTF-16 BE text files automatically', async () => {
    const content = '# rsid\tchromosome\tposition\tgenotype\nrs9901\t1\t990100\tAA\nrs9902\t1\t990200\tGG\n';
    
    // Encode UTF-16 LE with BOM (0xFF, 0xFE)
    const leBytes = new Uint8Array(2 + content.length * 2);
    leBytes[0] = 0xff;
    leBytes[1] = 0xfe;
    for (let i = 0; i < content.length; i++) {
      const code = content.charCodeAt(i);
      leBytes[2 + i * 2] = code & 0xff;
      leBytes[2 + i * 2 + 1] = (code >> 8) & 0xff;
    }

    const decodedLe = decodeTextBuffer(leBytes);
    expect(decodedLe).toContain('rs9901');

    // Parse UTF-16 LE via streaming
    const leBlob = new Blob([leBytes]);
    const parsedLe = await parseRawDNAStream(leBlob);
    expect(parsedLe.snpCount).toBe(2);
    expect(parsedLe.snpMap['rs9901']).toBe('AA');
    expect(parsedLe.snpMap['rs9902']).toBe('GG');

    // Encode UTF-16 BE with BOM (0xFE, 0xFF)
    const beBytes = new Uint8Array(2 + content.length * 2);
    beBytes[0] = 0xfe;
    beBytes[1] = 0xff;
    for (let i = 0; i < content.length; i++) {
      const code = content.charCodeAt(i);
      beBytes[2 + i * 2] = (code >> 8) & 0xff;
      beBytes[2 + i * 2 + 1] = code & 0xff;
    }

    const decodedBe = decodeTextBuffer(beBytes);
    expect(decodedBe).toContain('rs9902');
  });

  it('should detect T2T-CHM13 and hg18 builds alongside commercial vendors', () => {
    expect(detectVendorAndChip('# Reference: T2T-CHM13v2.0').build).toBe('T2T-CHM13');
    expect(detectVendorAndChip('# Reference: chm13').build).toBe('T2T-CHM13');
    expect(detectVendorAndChip('# Build: hg18 (NCBI36)').build).toBe('hg18');
    expect(detectVendorAndChip('# Build: NCBI36').build).toBe('hg18');
    expect(detectVendorAndChip('# Reference: GRCh38.p13').build).toBe('GRCh38');
    expect(detectVendorAndChip('# Reference: GRCh37 (hg19)').build).toBe('GRCh37');

    // Vendors
    expect(detectVendorAndChip('# Helix raw genotype export').format).toBe('Helix');
    expect(detectVendorAndChip('# Color Genomics clinical sequencing').format).toBe('Color Genomics');
    expect(detectVendorAndChip('# Sequencing.com WGS vcf').format).toBe('Sequencing.com');
    expect(detectVendorAndChip('# Sano Genetics export').format).toBe('Sano Genetics');
    expect(detectVendorAndChip('# Veritas Genetics myGenome').format).toBe('Veritas Genetics');
  });

  it('should throw specific GenomicsErrorCode for gVCF, symbolic ALT, no-call, and column mismatch failures', () => {
    // 1. gVCF non-ref
    const gvcfData = `##fileformat=VCFv4.2\n##ALT=<ID=NON_REF,Description="Non-ref">\n#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE\nchr1\t100\trs100\tA\t<NON_REF>\t.\tPASS\t.\tGT\t0/0\n`;
    try {
      parseRawDNA(gvcfData);
      expect.unreachable('Should throw error for gVCF nonref');
    } catch (err: any) {
      expect(err.code).toBe(GenomicsErrorCode.ERR_VCF_GVCF_NONREF_ONLY);
    }

    // 2. Symbolic ALT only
    const symbolicData = `##fileformat=VCFv4.2\n#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE\nchr1\t100\trs100\tA\t<NON_REF>\t.\tPASS\t.\tGT\t0/1\n`;
    try {
      parseRawDNA(symbolicData);
      expect.unreachable('Should throw error for symbolic ALT');
    } catch (err: any) {
      expect(err.code).toBe(GenomicsErrorCode.ERR_VCF_SYMBOLIC_ALT_ONLY);
    }

    // 3. All No-Call VCF
    let noCallLines = `##fileformat=VCFv4.2\n#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE\n`;
    for (let i = 0; i < 60; i++) {
      noCallLines += `chr1\t${1000 + i}\trs${i}\tA\tG\t.\tPASS\t.\tGT\t./.\n`;
    }
    try {
      parseRawDNA(noCallLines);
      expect.unreachable('Should throw error for all no-call VCF');
    } catch (err: any) {
      expect(err.code).toBe(GenomicsErrorCode.ERR_VCF_ALL_NO_CALL);
    }

    // 4. Column Mismatch
    let malformedData = `rsid\tchromosome\tposition\tgenotype\n`;
    for (let i = 0; i < 20; i++) {
      malformedData += `invalid_row_without_enough_tokens\n`;
    }
    try {
      parseRawDNA(malformedData);
      expect.unreachable('Should throw error for column mismatch');
    } catch (err: any) {
      expect(err.code).toBe(GenomicsErrorCode.ERR_PARSE_COLUMN_MISMATCH);
    }
  });
});
