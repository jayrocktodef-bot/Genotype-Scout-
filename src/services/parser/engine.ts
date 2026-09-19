import {
  GenotypeFormat,
  VariantRecord,
  ParseOptions,
  ParsedGenomicDataset,
  SniffedPlan,
  GenomicsParseError
} from './types';
import {
  checkUnsupportedArchive,
  decodeTextBuffer,
  LineAssembler,
  DECODER,
  LF,
  CR,
  HASH,
  SLASH,
  TAB
} from './byteStream';
import { decompressGenomicBuffer } from './decompress';
import {
  isBoilerplateOrComment,
  sniffAndBuildParsePlan,
  detectVendorAndChip,
  detectHeaderColumns
} from './formatSniffer';
import {
  isPARRegion,
  parseVcfLine,
  normalizeChromosome
} from './vcfTokenizer';
import {
  parseLineBytes,
  parseAdaptiveLine,
  cleanGenotypeString
} from './tabularTokenizer';
import {
  GenomicsError,
  GenomicsErrorCode
} from '../errorCaller';

export function inferBiologicalSex(
  yCount: number,
  xHetCount: number,
  xTotalCount: number
): 'MALE' | 'FEMALE' | 'UNKNOWN' {
  if (yCount >= 15) return 'MALE';
  if (xTotalCount >= 50) {
    const xHetRate = xHetCount / xTotalCount;
    if (xHetRate > 0.08 && yCount <= 5) return 'FEMALE';
    if (xHetRate < 0.03 && yCount >= 10) return 'MALE';
  }
  if (yCount >= 10) return 'MALE';
  if (yCount <= 2 && xTotalCount > 20) return 'FEMALE';
  return 'UNKNOWN';
}

export function checkFileFormatHealth(textSample: string): {
  healthy: boolean;
  code?: GenomicsErrorCode;
  reason?: string;
  category?: string;
  solution?: string;
} {
  if (!textSample || textSample.trim().length === 0) {
    return {
      healthy: false,
      code: GenomicsErrorCode.ERR_FILE_EMPTY,
      category: 'Empty Dataset Spectrum',
      reason: 'This file is completely empty.',
      solution: 'Select a valid raw DNA text, csv, or vcf file exported from your testing provider.'
    };
  }

  const sample = textSample.slice(0, 4096).trim();
  const lower = sample.toLowerCase();

  if (
    lower.startsWith('<!doctype html') ||
    lower.startsWith('<html') ||
    lower.includes('<head>') ||
    lower.includes('<body>')
  ) {
    return {
      healthy: false,
      code: GenomicsErrorCode.ERR_FILE_HTML_WEBPAGE,
      category: 'HTML Document Detected',
      reason: 'The selected file is an HTML webpage rather than a raw DNA data export.',
      solution: 'Ensure you download the actual raw DNA data file from your provider rather than saving the results web page.'
    };
  }

  if (sample.startsWith('{') && sample.endsWith('}') && (lower.includes('"error"') || lower.includes('"message"'))) {
    return {
      healthy: false,
      code: GenomicsErrorCode.ERR_FILE_JSON_PAYLOAD,
      category: 'JSON Payload Detected',
      reason: 'The selected file is a JSON payload or API error response.',
      solution: 'Ensure you download your complete raw DNA data archive from your account settings.'
    };
  }

  if (sample.startsWith('%PDF-')) {
    return {
      healthy: false,
      code: GenomicsErrorCode.ERR_FILE_PDF_DOCUMENT,
      category: 'PDF Document Detected',
      reason: 'The selected file is a PDF report rather than raw genotype data.',
      solution: 'Download the raw text/CSV genotype data from your provider account instead of the PDF summary report.'
    };
  }

  return { healthy: true };
}

export async function parseRawDNAStream(
  file: File | Blob,
  allowlist?: Set<string>,
  onProgress?: (bytesProcessed: number, totalBytes: number, snpsFound: number) => void,
  targetSample?: string | number
): Promise<ParsedGenomicDataset> {
  const sampleSlice = file.slice(0, Math.min(65536, file.size));
  const sampleBuf = new Uint8Array(await sampleSlice.arrayBuffer());
  checkUnsupportedArchive(sampleBuf);

  // Auto-detect UTF-16 LE/BE encoding via BOM bytes
  const isUtf16 =
    sampleBuf.length >= 2 &&
    ((sampleBuf[0] === 0xff && sampleBuf[1] === 0xfe) ||
      (sampleBuf[0] === 0xfe && sampleBuf[1] === 0xff));

  if (isUtf16) {
    const fullBuf = new Uint8Array(await file.arrayBuffer());
    const text = decodeTextBuffer(fullBuf);
    return parseRawDNA(text, allowlist, onProgress, targetSample);
  }

  const isGzip = sampleBuf.length >= 2 && sampleBuf[0] === 0x1f && sampleBuf[1] === 0x8b;
  const isZip = sampleBuf.length >= 4 && sampleBuf[0] === 0x50 && sampleBuf[1] === 0x4b;

  if (isZip || (isGzip && typeof DecompressionStream === 'undefined')) {
    const fullBuf = new Uint8Array(await file.arrayBuffer());
    checkUnsupportedArchive(fullBuf);
    const decompressed = decompressGenomicBuffer(fullBuf);
    checkUnsupportedArchive(decompressed);
    const text = decodeTextBuffer(decompressed);
    return parseRawDNA(text, allowlist, onProgress, targetSample);
  }

  const snpMap: Record<string, string> = {};
  const snpMetaMap: Record<string, { chrom: string; pos: number }> = {};
  const xMap: Record<string, string> = {};
  const yMap: Record<string, string> = {};
  const mtMap: Record<string, string> = {};
  const haplotype1Map: Record<string, string> = {};
  const haplotype2Map: Record<string, string> = {};
  const phaseSets: Record<string, string> = {};
  let phasedCount = 0;
  let snpCount = 0;
  let yDnaCalledSnps = 0;
  let xHetCount = 0;
  let xTotalCount = 0;

  const totalBytes = file.size;
  let bytesProcessed = 0;

  const stream = isGzip ? file.stream().pipeThrough(new DecompressionStream('gzip')) : file.stream();
  const reader = stream.getReader();

  let firstChunkText = '';
  let initialBuffer = new Uint8Array(0);

  if (isGzip) {
    while (firstChunkText.length < 65536) {
      const { done, value } = await reader.read();
      if (done) break;
      const combined = new Uint8Array(initialBuffer.length + value.length);
      combined.set(initialBuffer);
      combined.set(value, initialBuffer.length);
      initialBuffer = combined;
      firstChunkText = DECODER.decode(initialBuffer, { stream: true });
    }

    const isInnerCompressed = initialBuffer.length >= 2 && (
      (initialBuffer[0] === 0x1f && initialBuffer[1] === 0x8b) ||
      (initialBuffer.length >= 4 && initialBuffer[0] === 0x50 && initialBuffer[1] === 0x4b)
    );
    if (isInnerCompressed) {
      const chunks: Uint8Array[] = [initialBuffer];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value && value.length > 0) chunks.push(value);
      }
      const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
      const fullDecomp = new Uint8Array(totalLen);
      let offset = 0;
      for (const c of chunks) {
        fullDecomp.set(c, offset);
        offset += c.length;
      }
      const finalDecomp = decompressGenomicBuffer(fullDecomp);
      checkUnsupportedArchive(finalDecomp);
      const text = decodeTextBuffer(finalDecomp);
      return parseRawDNA(text, allowlist, onProgress, targetSample);
    }
  } else {
    const firstSlice = file.slice(0, Math.min(65536, file.size));
    firstChunkText = await firstSlice.text();
  }

  const header = firstChunkText.slice(0, 1500);
  const health = checkFileFormatHealth(firstChunkText);
  if (!health.healthy) {
    throw new GenomicsParseError(health.reason || 'Invalid file format', {
      errorCode: health.code || GenomicsErrorCode.ERR_FILE_EMPTY,
      legacyCode: 'ERR-4025FGD1',
      headerPreview: header.slice(0, 300),
      errorCategory: health.category || 'Invalid File Format',
      subsystem: 'HEALTH_VALIDATION',
      suggestedSolution: health.solution,
      bytesTotal: file.size
    });
  }

  const sampleLines = firstChunkText.split(/\r?\n/);
  const plan: SniffedPlan = sniffAndBuildParsePlan(sampleLines, targetSample);
  const isVcf = plan.isVcf;
  const vcfLayout = plan.vcfLayout;

  const lineAssembler = new LineAssembler();
  let linesTotal = 0;
  let linesCommented = 0;
  let linesMalformed = 0;

  let vcfSkippedSymbolicAlt = 0;
  let vcfSkippedNoCall = 0;
  let vcfSkippedHomRef = 0;

  let recordsSinceYield = 0;
  const RECORDS_PER_YIELD = 8192;
  let lastYieldTime = performance.now();
  const YIELD_MS_INTERVAL = 150;

  const processLine = (lineBytes: Uint8Array) => {
    linesTotal++;
    if (lineBytes.length === 0) return;

    if (lineBytes[0] === HASH || lineBytes[0] === SLASH) {
      linesCommented++;
      return;
    }

    const lineStr = DECODER.decode(lineBytes);

    if (linesTotal <= 50 && detectHeaderColumns(lineStr, plan.delimStr) !== null) {
      return;
    }

    let record: VariantRecord | undefined;

    if (isVcf && vcfLayout) {
      const res = parseVcfLine(lineStr, vcfLayout);
      if (res.isNoCall) vcfSkippedNoCall++;
      if (res.isHomRef) vcfSkippedHomRef++;
      if (res.isSymbolicAlt) vcfSkippedSymbolicAlt++;
      record = res.record;
    } else {
      if ((plan.isStandard23andMe || plan.isStandardAncestry) && plan.delim === TAB) {
        record = parseLineBytes(lineBytes, 0, lineBytes.length, TAB) || undefined;
        if (!record && !isBoilerplateOrComment(lineStr)) {
          record = parseAdaptiveLine(lineStr, plan.delimStr, plan.mapping) || undefined;
        }
      } else if (!isBoilerplateOrComment(lineStr)) {
        record = parseAdaptiveLine(lineStr, plan.delimStr, plan.mapping) || undefined;
      }
    }

    if (record) {
      const { markerId, chrom, pos, posStr, genotype, isPhased, allele1, allele2, phaseSet } = record;
      const isYorMT = chrom === 'Y' || chrom === 'MT';
      const coordId = !isNaN(pos) ? `chr${chrom}_${pos}`.toLowerCase() : '';
      const coordIdNoChr = !isNaN(pos) ? `${chrom}_${pos}`.toLowerCase() : '';
      const markerLower = markerId.toLowerCase();

      if (
        !allowlist ||
        isYorMT ||
        allowlist.has(markerLower) ||
        (coordId && (allowlist.has(coordId) || allowlist.has(coordIdNoChr)))
      ) {
        snpCount++;
        snpMap[markerId] = genotype;

        if (!isNaN(pos)) {
          snpMetaMap[markerId] = { chrom, pos };
          if (coordId && !snpMap[coordId]) snpMap[coordId] = genotype;
        }

        if (isPhased && allele1 && allele2) {
          phasedCount++;
          haplotype1Map[markerId] = allele1;
          haplotype2Map[markerId] = allele2;
          if (coordId) {
            haplotype1Map[coordId] = allele1;
            haplotype2Map[coordId] = allele2;
          }
          if (phaseSet) phaseSets[markerId] = phaseSet;
        }

        if (chrom === 'X') {
          xMap[markerId] = genotype;
          xTotalCount++;
          if (genotype.length === 2 && genotype[0] !== genotype[1] && !isPARRegion('X', pos)) {
            xHetCount++;
          }
        } else if (chrom === 'Y') {
          yMap[markerId] = genotype;
          yDnaCalledSnps++;
        } else if (chrom === 'MT') {
          const allele = genotype.length === 2 && genotype[0] === genotype[1] ? genotype[0] : genotype;
          if (allele && allele[0] !== '-') mtMap[posStr] = allele;
        }
      }
    } else {
      linesMalformed++;
    }
  };

  // Process initial buffer if gzip
  if (initialBuffer.length > 0) {
    bytesProcessed += initialBuffer.length;
    for (const line of lineAssembler.pushChunk(initialBuffer)) {
      processLine(line);
    }
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      bytesProcessed += value.length;
      for (const line of lineAssembler.pushChunk(value)) {
        processLine(line);
        recordsSinceYield++;

        const now = performance.now();
        if (recordsSinceYield >= RECORDS_PER_YIELD || now - lastYieldTime > YIELD_MS_INTERVAL) {
          recordsSinceYield = 0;
          lastYieldTime = now;
          if (onProgress) {
            onProgress(bytesProcessed, totalBytes, snpCount);
          }
          // Cooperative macrotask yielding
          await new Promise<void>(resolve => setTimeout(resolve, 0));
        }
      }
    }
  }

  // Flush remaining line in carry buffer
  for (const line of lineAssembler.flush()) {
    processLine(line);
  }

  if (snpCount === 0) {
    let zeroSnpReason = 'unknown';
    let zeroSnpSuggestion =
      'Ensure the file lists autosomal SNPs with standard columns (rsID, chromosome, physical position, and allele genotype letters).';
    let specificCode: GenomicsErrorCode = GenomicsErrorCode.ERR_PARSE_ZERO_SNPS;

    if (isVcf && vcfSkippedSymbolicAlt > 0 && vcfSkippedHomRef > 0) {
      zeroSnpReason = `gvcf_nonref (${vcfSkippedSymbolicAlt.toLocaleString()} symbolic ALT rows, ${vcfSkippedHomRef.toLocaleString()} hom-ref rows)`;
      zeroSnpSuggestion =
        'This appears to be a gVCF (genomic VCF) file with reference-block records. Genotype Scout processes variant-only VCFs. Please export a variant-filtered VCF from your provider.';
      specificCode = GenomicsErrorCode.ERR_VCF_GVCF_NONREF_ONLY;
    } else if (isVcf && vcfSkippedSymbolicAlt > 0) {
      zeroSnpReason = `symbolic_alt_only (${vcfSkippedSymbolicAlt.toLocaleString()} rows skipped)`;
      zeroSnpSuggestion =
        'The VCF file contains only symbolic ALT alleles (<NON_REF>, <*>, etc.) typical of gVCF files. Please re-export your data as a variant-only VCF.';
      specificCode = GenomicsErrorCode.ERR_VCF_SYMBOLIC_ALT_ONLY;
    } else if (isVcf && vcfSkippedNoCall > 50) {
      zeroSnpReason = `all_no_call (${vcfSkippedNoCall.toLocaleString()} ./. records)`;
      zeroSnpSuggestion =
        'All genotype records are no-call (./.). This VCF may be malformed or empty. Please re-export your data from your provider.';
      specificCode = GenomicsErrorCode.ERR_VCF_ALL_NO_CALL;
    } else if (linesMalformed > linesTotal * 0.5 && linesTotal > 10) {
      zeroSnpReason = 'column_mismatch';
      zeroSnpSuggestion =
        'More than 50% of lines could not be parsed. The delimiter or column order may be non-standard.';
      specificCode = GenomicsErrorCode.ERR_PARSE_COLUMN_MISMATCH;
    }

    throw new GenomicsParseError(
      `ERR-4025FGD1 (${specificCode}): The file contains no parseable genetic markers. Reason: ${zeroSnpReason}.`,
      {
        errorCode: specificCode,
        legacyCode: 'ERR-4025FGD1',
        format: plan.format,
        chip: plan.chip,
        bytesTotal: file.size,
        linesTotal,
        linesCommented,
        linesMalformed,
        errorCategory: 'Empty Ingestion Spectrum (ERR-4025FGD1)',
        subsystem: 'STREAM_PARSER',
        suggestedSolution: zeroSnpSuggestion
      }
    );
  }

  if (onProgress) {
    onProgress(totalBytes, totalBytes, snpCount);
  }

  const inferredBiologicalSex = inferBiologicalSex(yDnaCalledSnps, xHetCount, xTotalCount);
  const isPhased = phasedCount > 0 && phasedCount >= Math.min(5, snpCount * 0.1);
  const phasingMethod = isPhased ? 'VCF_PHASED' : 'UNPHASED';

  let chip = plan.chip;
  if (chip === 'Standard Microarray / Raw Data' || chip === 'Unknown Chip') {
    if (snpCount > 900000) chip = 'High-Density Chip (Omni2.5 or similar)';
    else if (snpCount > 600000) chip = 'Standard GSA/OmniExpress Chip';
    else if (snpCount > 300000) chip = 'Low-Density Chip';
    else chip = `${plan.format} Raw Data`;
  }

  return {
    format: plan.format,
    chip,
    build: plan.build,
    sampleNames: isVcf && vcfLayout?.sampleNames && vcfLayout.sampleNames.length > 0 ? vcfLayout.sampleNames : undefined,
    selectedSample: isVcf && vcfLayout?.selectedSampleName ? vcfLayout.selectedSampleName : undefined,
    snpCount,
    rawSnpsCount: snpCount,
    totalSnps: snpCount,
    yDnaSnps: Object.keys(yMap).length,
    yDnaCalledSnps,
    mtDnaSnps: Object.keys(mtMap).length,
    inferredBiologicalSex,
    snpMap,
    snpMetaMap,
    xMap,
    yMap,
    mtMap,
    snpByRsid: snpMap,
    snpByPosition: Object.fromEntries(
      Object.entries(snpMetaMap).map(([rs, m]) => [`${m.chrom}:${m.pos}`, snpMap[rs]])
    ),
    isPhased,
    phasedCount,
    phasingMethod,
    haplotype1Map: Object.keys(haplotype1Map).length > 0 ? haplotype1Map : undefined,
    haplotype2Map: Object.keys(haplotype2Map).length > 0 ? haplotype2Map : undefined,
    phaseSets: Object.keys(phaseSets).length > 0 ? phaseSets : undefined
  };
}

export function parseRawDNA(
  rawText: string,
  allowlist?: Set<string>,
  onProgress?: (bytesProcessed: number, totalBytes: number, snpsFound: number) => void,
  targetSample?: string | number
): ParsedGenomicDataset {
  let text = rawText;
  if (text.charCodeAt(0) === 0xfeff || text.charCodeAt(0) === 0xfffe) {
    text = text.slice(1);
  }

  const health = checkFileFormatHealth(text);
  if (!health.healthy) {
    throw new GenomicsParseError(health.reason || 'Invalid file format', {
      errorCode: health.code || GenomicsErrorCode.ERR_FILE_EMPTY,
      legacyCode: 'ERR-4025FGD1',
      headerPreview: text.slice(0, 300),
      errorCategory: health.category || 'Invalid File Format',
      subsystem: 'HEALTH_VALIDATION',
      suggestedSolution: health.solution,
      bytesTotal: text.length
    });
  }

  const sampleLines = text.slice(0, 65536).split(/\r?\n/);
  const plan = sniffAndBuildParsePlan(sampleLines, targetSample);
  const isVcf = plan.isVcf;
  const vcfLayout = plan.vcfLayout;

  const snpMap: Record<string, string> = {};
  const snpMetaMap: Record<string, { chrom: string; pos: number }> = {};
  const xMap: Record<string, string> = {};
  const yMap: Record<string, string> = {};
  const mtMap: Record<string, string> = {};
  const haplotype1Map: Record<string, string> = {};
  const haplotype2Map: Record<string, string> = {};
  const phaseSets: Record<string, string> = {};
  let phasedCount = 0;
  let snpCount = 0;
  let yDnaCalledSnps = 0;
  let xHetCount = 0;
  let xTotalCount = 0;

  let linesTotal = 0;
  let linesCommented = 0;
  let linesMalformed = 0;
  let vcfSkippedSymbolicAlt = 0;
  let vcfSkippedNoCall = 0;
  let vcfSkippedHomRef = 0;

  const lines = text.split(/\r?\n/);
  const totalLength = text.length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    linesTotal++;
    if (!line) continue;

    if (line.charCodeAt(0) === HASH || line.startsWith('//')) {
      linesCommented++;
      continue;
    }

    if (linesTotal <= 50 && detectHeaderColumns(line, plan.delimStr) !== null) {
      continue;
    }

    let record: VariantRecord | undefined;

    if (isVcf && vcfLayout) {
      const res = parseVcfLine(line, vcfLayout);
      if (res.isNoCall) vcfSkippedNoCall++;
      if (res.isHomRef) vcfSkippedHomRef++;
      if (res.isSymbolicAlt) vcfSkippedSymbolicAlt++;
      record = res.record;
    } else {
      record = parseAdaptiveLine(line, plan.delimStr, plan.mapping) || undefined;
    }

    if (record) {
      const { markerId, chrom, pos, posStr, genotype, isPhased, allele1, allele2, phaseSet } = record;
      const isYorMT = chrom === 'Y' || chrom === 'MT';
      const coordId = !isNaN(pos) ? `chr${chrom}_${pos}`.toLowerCase() : '';
      const coordIdNoChr = !isNaN(pos) ? `${chrom}_${pos}`.toLowerCase() : '';
      const markerLower = markerId.toLowerCase();

      if (
        !allowlist ||
        isYorMT ||
        allowlist.has(markerLower) ||
        (coordId && (allowlist.has(coordId) || allowlist.has(coordIdNoChr)))
      ) {
        snpCount++;
        snpMap[markerId] = genotype;

        if (!isNaN(pos)) {
          snpMetaMap[markerId] = { chrom, pos };
          if (coordId && !snpMap[coordId]) snpMap[coordId] = genotype;
        }

        if (isPhased && allele1 && allele2) {
          phasedCount++;
          haplotype1Map[markerId] = allele1;
          haplotype2Map[markerId] = allele2;
          if (coordId) {
            haplotype1Map[coordId] = allele1;
            haplotype2Map[coordId] = allele2;
          }
          if (phaseSet) phaseSets[markerId] = phaseSet;
        }

        if (chrom === 'X') {
          xMap[markerId] = genotype;
          xTotalCount++;
          if (genotype.length === 2 && genotype[0] !== genotype[1] && !isPARRegion('X', pos)) {
            xHetCount++;
          }
        } else if (chrom === 'Y') {
          yMap[markerId] = genotype;
          yDnaCalledSnps++;
        } else if (chrom === 'MT') {
          const allele = genotype.length === 2 && genotype[0] === genotype[1] ? genotype[0] : genotype;
          if (allele && allele[0] !== '-') mtMap[posStr] = allele;
        }
      }
    } else {
      linesMalformed++;
    }
  }

  if (snpCount === 0) {
    let zeroSnpReason = 'unknown';
    let zeroSnpSuggestion =
      'Make sure that the file lists SNPs with standard columns (rsID, chromosome, physical position, and allele genotype letters).';
    let specificCode: GenomicsErrorCode = GenomicsErrorCode.ERR_PARSE_ZERO_SNPS;

    if (isVcf && vcfSkippedSymbolicAlt > 0 && vcfSkippedHomRef > 0) {
      zeroSnpReason = `gvcf_nonref (${vcfSkippedSymbolicAlt.toLocaleString()} symbolic ALT rows, ${vcfSkippedHomRef.toLocaleString()} hom-ref rows)`;
      zeroSnpSuggestion =
        'This appears to be a gVCF (genomic VCF) file with reference-block records. Genotype Scout processes variant-only VCFs. Please export a variant-filtered VCF from your provider.';
      specificCode = GenomicsErrorCode.ERR_VCF_GVCF_NONREF_ONLY;
    } else if (isVcf && vcfSkippedSymbolicAlt > 0) {
      zeroSnpReason = `symbolic_alt_only (${vcfSkippedSymbolicAlt.toLocaleString()} rows skipped)`;
      zeroSnpSuggestion =
        'The VCF file contains only symbolic ALT alleles (<NON_REF>, <*>, etc.) typical of gVCF files. Please re-export your data as a variant-only VCF.';
      specificCode = GenomicsErrorCode.ERR_VCF_SYMBOLIC_ALT_ONLY;
    } else if (isVcf && vcfSkippedNoCall > 50) {
      zeroSnpReason = `all_no_call (${vcfSkippedNoCall.toLocaleString()} ./. records)`;
      zeroSnpSuggestion =
        'All genotype records are no-call (./.). This VCF may be malformed or empty. Please re-export your data from your provider.';
      specificCode = GenomicsErrorCode.ERR_VCF_ALL_NO_CALL;
    } else if (linesMalformed > linesTotal * 0.5 && linesTotal > 10) {
      zeroSnpReason = 'column_mismatch';
      zeroSnpSuggestion =
        'More than 50% of lines could not be parsed. The delimiter or column order may be non-standard.';
      specificCode = GenomicsErrorCode.ERR_PARSE_COLUMN_MISMATCH;
    }

    throw new GenomicsParseError(
      `ERR-4025FGD1 (${specificCode}): The file contains no parseable genetic markers. Reason: ${zeroSnpReason}.`,
      {
        errorCode: specificCode,
        legacyCode: 'ERR-4025FGD1',
        format: plan.format,
        chip: plan.chip,
        bytesTotal: text.length,
        linesTotal,
        linesCommented,
        linesMalformed,
        errorCategory: 'No Valid Genetic Markers Found (ERR-4025FGD1)',
        suggestedSolution: zeroSnpSuggestion
      }
    );
  }

  if (onProgress) {
    onProgress(totalLength, totalLength, snpCount);
  }

  const inferredBiologicalSex = inferBiologicalSex(yDnaCalledSnps, xHetCount, xTotalCount);
  const isPhased = phasedCount > 0 && phasedCount >= Math.min(5, snpCount * 0.1);
  const phasingMethod = isPhased ? 'VCF_PHASED' : 'UNPHASED';

  let chip = plan.chip;
  if (chip === 'Standard Microarray / Raw Data' || chip === 'Unknown Chip') {
    if (snpCount > 900000) chip = 'High-Density Chip (Omni2.5 or similar)';
    else if (snpCount > 600000) chip = 'Standard GSA/OmniExpress Chip';
    else if (snpCount > 300000) chip = 'Low-Density Chip';
    else chip = `${plan.format} Raw Data`;
  }

  return {
    format: plan.format,
    chip,
    build: plan.build,
    sampleNames: isVcf && vcfLayout?.sampleNames && vcfLayout.sampleNames.length > 0 ? vcfLayout.sampleNames : undefined,
    selectedSample: isVcf && vcfLayout?.selectedSampleName ? vcfLayout.selectedSampleName : undefined,
    snpCount,
    rawSnpsCount: snpCount,
    totalSnps: snpCount,
    yDnaSnps: Object.keys(yMap).length,
    yDnaCalledSnps,
    mtDnaSnps: Object.keys(mtMap).length,
    inferredBiologicalSex,
    snpMap,
    snpMetaMap,
    xMap,
    yMap,
    mtMap,
    snpByRsid: snpMap,
    snpByPosition: Object.fromEntries(
      Object.entries(snpMetaMap).map(([rs, m]) => [`${m.chrom}:${m.pos}`, snpMap[rs]])
    ),
    isPhased,
    phasedCount,
    phasingMethod,
    haplotype1Map: Object.keys(haplotype1Map).length > 0 ? haplotype1Map : undefined,
    haplotype2Map: Object.keys(haplotype2Map).length > 0 ? haplotype2Map : undefined,
    phaseSets: Object.keys(phaseSets).length > 0 ? phaseSets : undefined
  };
}
