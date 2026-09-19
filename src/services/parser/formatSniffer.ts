import {
  GenotypeFormat,
  ColumnMapping,
  VcfColumnLayout,
  SniffedPlan
} from './types';
import { TAB, COMMA, SEMICOLON, SPACE, HASH } from './byteStream';

const CANDIDATE_DELIMS = ['\t', ',', ';', ' '];

export function isBoilerplateOrComment(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return true;
  const first = trimmed.charCodeAt(0);
  if (first === HASH /* # */ || trimmed.startsWith('//') || trimmed.startsWith('/*')) return true;
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('[data]') ||
    lower.startsWith('[header]') ||
    lower.startsWith('[manifest]') ||
    lower.startsWith('[snps]')
  ) {
    return true;
  }
  if (
    lower.includes('disclaimer') ||
    lower.includes('terms of service') ||
    lower.includes('export date') ||
    lower.includes('copyright') ||
    lower.startsWith('version:') ||
    lower.startsWith('date:') ||
    lower.startsWith('build:')
  ) {
    if (!lower.includes('rs') && !lower.includes('chr') && !lower.includes('position')) {
      return true;
    }
  }
  return false;
}

export function sniffDelimiter(sampleLines: string[]): { delim: number; delimStr: string } {
  const dataLines = sampleLines.filter(l => !isBoilerplateOrComment(l) && l.trim().length > 0).slice(0, 64);
  if (dataLines.length === 0) {
    return { delim: TAB, delimStr: '\t' };
  }

  let bestDelim = '\t';
  let bestScore = -1;

  for (const d of CANDIDATE_DELIMS) {
    const countFreq: Record<number, number> = {};
    let matchedLines = 0;

    for (const line of dataLines) {
      const count = d === ' ' ? line.trim().split(/ +/).length : line.split(d).length;
      if (count >= 3) {
        matchedLines++;
        countFreq[count] = (countFreq[count] || 0) + 1;
      }
    }

    if (matchedLines === 0) continue;

    let modeCount = 0;
    let modeFreq = 0;
    for (const [cntStr, freq] of Object.entries(countFreq)) {
      const cnt = Number(cntStr);
      if (freq > modeFreq) {
        modeFreq = freq;
        modeCount = cnt;
      }
    }

    const consistency = modeFreq / dataLines.length;
    const baseWeight = d === '\t' ? 1.2 : d === ',' ? 1.1 : d === ';' ? 1.05 : 0.9;
    const score = consistency * Math.log2(1 + modeCount) * baseWeight;

    if (score > bestScore) {
      bestScore = score;
      bestDelim = d;
    }
  }

  return { delim: bestDelim.charCodeAt(0), delimStr: bestDelim };
}

export function detectHeaderColumns(headerLine: string, delim: string): ColumnMapping | null {
  const stripped = headerLine.replace(/^#+/, '').replace(/"/g, '').trim();
  const rawTokens = (delim === ' ' ? stripped.split(/\s+/) : stripped.split(delim)).map((t, i) => {
    let tok = t.trim().toLowerCase();
    if (i === 0 && tok.charCodeAt(0) === 0xfeff) tok = tok.slice(1);
    if (i === 0 && tok.startsWith('\xef\xbb\xbf')) tok = tok.slice(3);
    return tok;
  });
  if (rawTokens.length < 3) return null;

  let rsidIdx = -1;
  let chromIdx = -1;
  let posIdx = -1;
  let gtIdx = -1;
  let allele1Idx = -1;
  let allele2Idx = -1;

  for (let i = 0; i < rawTokens.length; i++) {
    const rawT = rawTokens[i];
    const t = rawT.replace(/[_-]/g, '');

    // RSID / Marker aliases
    if (
      t === 'rsid' ||
      t === 'rs' ||
      t === 'marker' ||
      t === 'snp' ||
      t === 'id' ||
      t === 'name' ||
      t === 'marcador' ||
      t === 'idmarcador' ||
      t === 'probesetid' ||
      t === 'dbsnprsid' ||
      t === 'probeset' ||
      t === 'probeid' ||
      t === 'markerid' ||
      t === 'snpname' ||
      t === 'markername' ||
      t === 'variantid' ||
      t === 'variant' ||
      t === 'idvariante' ||
      t === 'snpid' ||
      rawT === 'probe set id' ||
      rawT === 'dbsnp rs id' ||
      rawT === 'snp id'
    ) {
      if (rsidIdx === -1) rsidIdx = i;
    }
    // Chromosome aliases
    else if (
      t === 'chromosome' ||
      t === 'chrom' ||
      t === 'chr' ||
      t === 'cromosoma' ||
      t === 'chromosomename' ||
      t === 'chrname' ||
      t === 'chrid' ||
      t === 'seqid' ||
      t === 'contig'
    ) {
      if (chromIdx === -1) chromIdx = i;
    }
    // Position aliases
    else if (
      t === 'position' ||
      t === 'pos' ||
      t === 'posición' ||
      t === 'posicion' ||
      t === 'physicalposition' ||
      t === 'coordinate' ||
      t === 'physpos' ||
      t === 'location' ||
      t === 'chrpos' ||
      t === 'coordenada' ||
      t === 'b37pos' ||
      t === 'b38pos' ||
      t === 'start' ||
      t === 'posbp' ||
      rawT === 'physical position'
    ) {
      if (posIdx === -1) posIdx = i;
    }
    // Genotype (packed) aliases
    else if (
      t === 'genotype' ||
      t === 'result' ||
      t === 'call' ||
      t === 'gt' ||
      t === 'genotipo' ||
      t === 'resultado' ||
      t === 'genotypecall' ||
      t === 'alleles' ||
      t === 'genotyperesult' ||
      t === 'callresult'
    ) {
      if (gtIdx === -1) gtIdx = i;
    }
    // Allele 1 (split) aliases
    else if (
      t === 'allele1' ||
      t === 'allele1top' ||
      t === 'a1' ||
      t === 'alelo1' ||
      t === 'allelea' ||
      t === 'ref' ||
      t === 'reference' ||
      t === 'refallele' ||
      rawT === 'allele 1' ||
      rawT === 'allele1 - top' ||
      rawT === 'allele 1 - top' ||
      rawT === 'alelo 1' ||
      rawT === 'allele a' ||
      rawT === 'allele_1' ||
      rawT === 'alelo_1'
    ) {
      if (allele1Idx === -1) allele1Idx = i;
    }
    // Allele 2 (split) aliases
    else if (
      t === 'allele2' ||
      t === 'allele2top' ||
      t === 'a2' ||
      t === 'alelo2' ||
      t === 'alleleb' ||
      t === 'alt' ||
      t === 'alternate' ||
      t === 'altallele' ||
      rawT === 'allele 2' ||
      rawT === 'allele2 - top' ||
      rawT === 'allele 2 - top' ||
      rawT === 'alelo 2' ||
      rawT === 'allele b' ||
      rawT === 'allele_2' ||
      rawT === 'alelo_2'
    ) {
      if (allele2Idx === -1) allele2Idx = i;
    }
  }

  const hasSplit = allele1Idx !== -1 && allele2Idx !== -1;
  const isCustom =
    rsidIdx !== 0 ||
    chromIdx !== 1 ||
    posIdx !== 2 ||
    (hasSplit ? allele1Idx !== 3 || allele2Idx !== 4 : gtIdx !== 3 && gtIdx !== -1);

  if (chromIdx !== -1 && posIdx !== -1 && (gtIdx !== -1 || hasSplit || rsidIdx !== -1)) {
    return {
      rsidIdx: rsidIdx !== -1 ? rsidIdx : chromIdx !== 0 && posIdx !== 0 ? 0 : -1,
      chromIdx,
      posIdx,
      gtIdx: gtIdx !== -1 ? gtIdx : hasSplit ? -1 : 3,
      allele1Idx: allele1Idx !== -1 ? allele1Idx : hasSplit ? 3 : -1,
      allele2Idx: allele2Idx !== -1 ? allele2Idx : hasSplit ? 4 : -1,
      hasSplitAlleles: hasSplit,
      isCustom
    };
  }

  return null;
}

export function inferColumnMappingFromContent(sampleLines: string[], delim: string): ColumnMapping | null {
  const dataLines = sampleLines.filter(l => !isBoilerplateOrComment(l) && l.trim().length > 0).slice(0, 50);
  if (dataLines.length === 0) return null;

  const numColsSample = delim === ' ' ? dataLines[0].trim().split(/ +/).length : dataLines[0].split(delim).length;
  if (numColsSample < 3) return null;

  const rsidScores: number[] = new Array(numColsSample).fill(0);
  const chromScores: number[] = new Array(numColsSample).fill(0);
  const posScores: number[] = new Array(numColsSample).fill(0);
  const splitAlleleScores: number[] = new Array(numColsSample).fill(0);
  const packedGtScores: number[] = new Array(numColsSample).fill(0);

  const RSID_REGEX = /^rs\d+$/i;
  const PROBE_REGEX = /^[a-zA-Z0-9_\-\.]{3,30}$/;
  const CHROM_REGEX = /^(?:chr)?(?:[1-9]|1[0-9]|2[0-6]|x|y|m|mt|par|par1|par2|xy|un)$/i;

  let validRowCount = 0;

  for (const line of dataLines) {
    const rawTokens = (delim === ' ' ? line.trim().split(/ +/) : line.split(delim)).map(t => {
      let res = t.trim();
      if (res.startsWith('"') && res.endsWith('"') && res.length >= 2) {
        res = res.substring(1, res.length - 1).trim();
      }
      return res;
    });

    if (rawTokens.length < numColsSample) continue;
    validRowCount++;

    for (let c = 0; c < numColsSample; c++) {
      const val = rawTokens[c];

      if (RSID_REGEX.test(val)) {
        rsidScores[c] += 3;
      } else if (PROBE_REGEX.test(val) && !CHROM_REGEX.test(val) && isNaN(Number(val))) {
        rsidScores[c] += 1;
      }

      if (CHROM_REGEX.test(val)) {
        chromScores[c] += 3;
      }

      const num = Number(val);
      if (!isNaN(num) && Number.isInteger(num) && num >= 1 && num <= 300000000) {
        if (num > 26) {
          posScores[c] += 3;
        } else {
          posScores[c] += 1;
        }
      }

      if (val.length === 1 && (val === 'A' || val === 'C' || val === 'G' || val === 'T' || val === 'I' || val === 'D' || val === '0' || val === '.' || val === '-')) {
        splitAlleleScores[c] += 1;
      }

      if (val.length === 2 && /^[ACGTID]{2}$/i.test(val)) {
        packedGtScores[c] += 3;
      }
    }
  }

  if (validRowCount === 0) return null;

  let chromIdx = -1;
  let maxChromScore = 0;
  for (let c = 0; c < numColsSample; c++) {
    if (chromScores[c] > maxChromScore) {
      maxChromScore = chromScores[c];
      chromIdx = c;
    }
  }

  let posIdx = -1;
  let maxPosScore = 0;
  for (let c = 0; c < numColsSample; c++) {
    if (c === chromIdx) continue;
    if (posScores[c] > maxPosScore) {
      maxPosScore = posScores[c];
      posIdx = c;
    }
  }

  if (chromIdx === -1 && numColsSample >= 4) chromIdx = 1;
  if (posIdx === -1 && numColsSample >= 4) posIdx = 2;

  if (chromIdx === -1 || posIdx === -1) return null;

  let allele1Idx = -1;
  let allele2Idx = -1;
  let gtIdx = -1;

  const splitCandidateCols: number[] = [];
  for (let c = 0; c < numColsSample; c++) {
    if (c === posIdx || c === chromIdx) continue;
    if (splitAlleleScores[c] / validRowCount >= 0.4) {
      splitCandidateCols.push(c);
    }
  }

  if (splitCandidateCols.length >= 2) {
    allele1Idx = splitCandidateCols[0];
    allele2Idx = splitCandidateCols[1];
  } else {
    let maxGtScore = 0;
    for (let c = 0; c < numColsSample; c++) {
      if (c === posIdx || c === chromIdx) continue;
      if (packedGtScores[c] > maxGtScore) {
        maxGtScore = packedGtScores[c];
        gtIdx = c;
      }
    }
    if (gtIdx === -1 && numColsSample >= 4) {
      gtIdx = chromIdx !== 3 && posIdx !== 3 ? 3 : numColsSample - 1;
    }
  }

  const hasSplit = allele1Idx !== -1 && allele2Idx !== -1;
  if (!hasSplit && gtIdx === -1) return null;

  let rsidIdx = -1;
  let maxRsidScore = 0;
  for (let c = 0; c < numColsSample; c++) {
    if (c === posIdx || c === chromIdx || c === gtIdx || c === allele1Idx || c === allele2Idx) continue;
    if (rsidScores[c] > maxRsidScore) {
      maxRsidScore = rsidScores[c];
      rsidIdx = c;
    }
  }

  if (rsidIdx === -1) {
    for (let c = 0; c < numColsSample; c++) {
      if (c !== posIdx && c !== chromIdx && c !== gtIdx && c !== allele1Idx && c !== allele2Idx) {
        rsidIdx = c;
        break;
      }
    }
  }

  return {
    rsidIdx: rsidIdx !== -1 ? rsidIdx : 0,
    chromIdx,
    posIdx,
    gtIdx: gtIdx !== -1 ? gtIdx : hasSplit ? -1 : 3,
    allele1Idx: allele1Idx !== -1 ? allele1Idx : hasSplit ? 3 : -1,
    allele2Idx: allele2Idx !== -1 ? allele2Idx : hasSplit ? 4 : -1,
    hasSplitAlleles: hasSplit,
    isCustom: true
  };
}

export function detectVendorAndChip(headerText: string): {
  format: string;
  chip: string;
  build: 'GRCh37' | 'GRCh38' | 'T2T-CHM13' | 'hg18' | 'UNKNOWN';
} {
  const h = headerText.toLowerCase();
  let format = 'Unknown';
  let chip = 'Unknown Chip';
  let build: 'GRCh37' | 'GRCh38' | 'T2T-CHM13' | 'hg18' | 'UNKNOWN' = 'GRCh37';

  if (h.includes('chm13') || h.includes('t2t') || h.includes('t2t-chm13') || h.includes('hs1')) {
    build = 'T2T-CHM13';
  } else if (h.includes('grch38') || h.includes('hg38') || h.includes('build 38')) {
    build = 'GRCh38';
  } else if (h.includes('ncbi36') || h.includes('hg18') || h.includes('build 36')) {
    build = 'hg18';
  } else if (h.includes('grch37') || h.includes('hg19') || h.includes('build 37')) {
    build = 'GRCh37';
  }

  if (h.includes('23andme')) {
    format = '23andMe';
    if (h.includes('v5')) chip = '23andMe v5 (GSA)';
    else if (h.includes('v4')) chip = '23andMe v4 (OmniExpress)';
    else if (h.includes('v3')) chip = '23andMe v3 (OmniExpress)';
    else if (h.includes('v2')) chip = '23andMe v2 (Illumina)';
    else chip = '23andMe (Legacy)';
  } else if (h.includes('ancestrydna') || h.includes('ancestry')) {
    format = 'AncestryDNA';
    if (h.includes('v3') || h.includes('version: v3') || h.includes('version: 3')) chip = 'AncestryDNA v3 (GSA)';
    else if (h.includes('v2') || h.includes('version: v2') || h.includes('version: 2')) chip = 'AncestryDNA v2 (GSA)';
    else if (h.includes('v1') || h.includes('version: v1') || h.includes('version: 1')) chip = 'AncestryDNA v1 (OmniExpress)';
    else chip = 'AncestryDNA';
  } else if (h.includes('myheritage')) {
    format = 'MyHeritage';
    if (h.includes('##fileformat=vcf') || h.includes('#chrom') || h.includes('##source=myheritage')) {
      chip = 'MyHeritage WGS (VCF)';
    } else {
      chip = 'MyHeritage DNA (GSA)';
    }
  } else if (
    h.includes('family tree dna') ||
    h.includes('ftdna') ||
    (h.includes('rsid') && h.includes('result') && !h.includes('myheritage'))
  ) {
    format = 'FTDNA';
    chip = 'FTDNA Family Finder';
  } else if (h.includes('living dna') || h.includes('livingdna')) {
    format = 'Living DNA';
    chip = 'Living DNA (GSA)';
  } else if (h.includes('helix')) {
    format = 'Helix';
    chip = 'Helix Exome+ / Microarray';
  } else if (
    h.includes('color genomics') ||
    h.includes('color.com') ||
    (h.includes('variant_id') && h.includes('color'))
  ) {
    format = 'Color Genomics';
    chip = 'Color Genomics Clinical Panel/WGS';
  } else if (h.includes('sequencing.com') || (h.includes('sequencing') && !h.includes('23andme'))) {
    format = 'Sequencing.com';
    chip = 'Sequencing.com WGS';
  } else if (h.includes('sano genetics') || h.includes('sano')) {
    format = 'Sano Genetics';
    chip = 'Sano Genetics DNA';
  } else if (h.includes('veritas') || h.includes('mygenome')) {
    format = 'Veritas Genetics';
    chip = 'Veritas Genetics myGenome (WGS)';
  } else if (h.includes('tellmegen')) {
    format = 'TellmeGen';
    chip = 'TellmeGen Raw Data';
  } else if (h.includes('24genetics')) {
    format = '24Genetics';
    chip = '24Genetics Raw Data';
  } else if (h.includes('wegene')) {
    format = 'WeGene';
    chip = 'WeGene Affymetrix/GSA';
  } else if (h.includes('dante labs') || h.includes('dantelabs')) {
    format = 'Dante Labs';
    chip = 'Dante Labs Whole Genome';
  } else if (h.includes('nebula')) {
    format = 'Nebula Genomics';
    chip = 'Nebula Genomics WGS';
  } else if (h.includes('geno 2.0') || h.includes('genographic')) {
    format = 'Geno 2.0';
    chip = 'National Geographic Geno 2.0';
  } else if (h.includes('genes for good') || h.includes('genesforgood')) {
    format = 'Genes for Good';
    chip = 'Genes for Good Affymetrix/Illumina';
  } else if (h.includes('circledna')) {
    format = 'CircleDNA';
    chip = 'CircleDNA Whole Exome';
  } else if (
    h.includes('##fileformat=vcf') ||
    h.includes('#chrom\tpos\tid\tref\talt') ||
    h.includes('#chrom')
  ) {
    format = 'VCF';
    chip = 'Variant Call Format (VCF)';
  }

  return { format, chip, build };
}

export function parseVcfColumnLayout(
  sampleLines: string[],
  targetSample?: string | number
): VcfColumnLayout {
  let headerLine = '';
  for (const line of sampleLines) {
    if (line.toUpperCase().startsWith('#CHROM')) {
      headerLine = line;
      break;
    }
  }

  if (!headerLine) {
    return {
      chromIdx: 0,
      posIdx: 1,
      idIdx: 2,
      refIdx: 3,
      altIdx: 4,
      qualIdx: 5,
      filterIdx: 6,
      infoIdx: 7,
      formatIdx: 8,
      sampleIdx: 9,
      sampleNames: []
    };
  }

  const cols = headerLine.split('\t').map(c => c.trim());
  const chromIdx = cols.findIndex(c => c.toUpperCase() === '#CHROM');
  const posIdx = cols.findIndex(c => c.toUpperCase() === 'POS');
  const idIdx = cols.findIndex(c => c.toUpperCase() === 'ID');
  const refIdx = cols.findIndex(c => c.toUpperCase() === 'REF');
  const altIdx = cols.findIndex(c => c.toUpperCase() === 'ALT');
  const qualIdx = cols.findIndex(c => c.toUpperCase() === 'QUAL');
  const filterIdx = cols.findIndex(c => c.toUpperCase() === 'FILTER');
  const infoIdx = cols.findIndex(c => c.toUpperCase() === 'INFO');
  const formatIdx = cols.findIndex(c => c.toUpperCase() === 'FORMAT');

  const sampleNames = cols.slice(9);
  let sampleIdx = 9;
  let selectedSampleName: string | undefined;

  if (targetSample !== undefined && sampleNames.length > 0) {
    if (typeof targetSample === 'number') {
      const idx = targetSample;
      if (idx >= 0 && idx < sampleNames.length) {
        sampleIdx = 9 + idx;
        selectedSampleName = sampleNames[idx];
      }
    } else if (typeof targetSample === 'string') {
      const idx = sampleNames.findIndex(
        s => s.toLowerCase() === targetSample.toLowerCase()
      );
      if (idx !== -1) {
        sampleIdx = 9 + idx;
        selectedSampleName = sampleNames[idx];
      }
    }
  }

  if (!selectedSampleName && sampleNames.length > 0) {
    selectedSampleName = sampleNames[0];
  }

  return {
    chromIdx: chromIdx !== -1 ? chromIdx : 0,
    posIdx: posIdx !== -1 ? posIdx : 1,
    idIdx: idIdx !== -1 ? idIdx : 2,
    refIdx: refIdx !== -1 ? refIdx : 3,
    altIdx: altIdx !== -1 ? altIdx : 4,
    qualIdx: qualIdx !== -1 ? qualIdx : 5,
    filterIdx: filterIdx !== -1 ? filterIdx : 6,
    infoIdx: infoIdx !== -1 ? infoIdx : 7,
    formatIdx: formatIdx !== -1 ? formatIdx : 8,
    sampleIdx: sampleIdx,
    sampleNames,
    selectedSampleName
  };
}

export function sniffAndBuildParsePlan(
  sampleLines: string[],
  targetSample?: string | number
): SniffedPlan {
  const headerSample = sampleLines.slice(0, 100).join('\n');
  const detected = detectVendorAndChip(headerSample);

  let isVcf = false;
  let vcfLayout: VcfColumnLayout | undefined;

  for (const line of sampleLines) {
    if (line.toLowerCase().includes('##fileformat=vcf') || line.toUpperCase().startsWith('#CHROM')) {
      isVcf = true;
      vcfLayout = parseVcfColumnLayout(sampleLines, targetSample);
      break;
    }
  }

  const { delim, delimStr } = sniffDelimiter(sampleLines);

  let mapping: ColumnMapping | null = null;
  let headerLineIndex = -1;

  for (let i = 0; i < Math.min(sampleLines.length, 500); i++) {
    const line = sampleLines[i];
    if (!line || !line.trim()) continue;
    if (line.startsWith('#')) continue; // Comments are skipped automatically in the byte loop
    const detectedMap = detectHeaderColumns(line, delimStr);
    if (detectedMap) {
      mapping = detectedMap;
      headerLineIndex = i;
      break;
    }
  }

  if (!mapping && !isVcf) {
    mapping = inferColumnMappingFromContent(sampleLines, delimStr);
  }

  if (!mapping) {
    mapping = {
      rsidIdx: 0,
      chromIdx: 1,
      posIdx: 2,
      gtIdx: 3,
      allele1Idx: -1,
      allele2Idx: -1,
      hasSplitAlleles: false,
      isCustom: false
    };
  }

  const isStandard23andMe =
    detected.format === '23andMe' &&
    mapping.rsidIdx === 0 &&
    mapping.chromIdx === 1 &&
    mapping.posIdx === 2 &&
    mapping.gtIdx === 3 &&
    !mapping.hasSplitAlleles;

  const isStandardAncestry =
    detected.format === 'AncestryDNA' &&
    mapping.rsidIdx === 0 &&
    mapping.chromIdx === 1 &&
    mapping.posIdx === 2 &&
    mapping.hasSplitAlleles &&
    mapping.allele1Idx === 3 &&
    mapping.allele2Idx === 4;

  return {
    format: detected.format,
    chip: detected.chip,
    build: detected.build,
    delim,
    delimStr,
    isVcf,
    isStandard23andMe,
    isStandardAncestry,
    mapping,
    vcfLayout,
    headerLineIndex
  };
}
