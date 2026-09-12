import { describe, it, expect } from 'vitest';
import { 
  parseRawDNA, 
  parseRawDNAStream, 
  normalizeChromosome, 
  cleanGenotypeString, 
  detectHeaderColumns,
  microPhaseDataset 
} from './dnaParser';
import { parseDNAFile } from '../utils/dnaParser';
import { microPhase } from '../engines/ancestry/microPhaser';
import { correctPhasingErrors } from '../engines/ancestry/phasingCorrector';

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

  it('should throw error for empty file', () => {
    expect(() => parseRawDNA('')).toThrow('This file is completely empty.');
  });

  it('should throw error for invalid data', () => {
    const rawData = 'invalid data without columns';
    expect(() => parseRawDNA(rawData)).toThrow('The file contains no parseable genetic markers (SNPs).');
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
});
