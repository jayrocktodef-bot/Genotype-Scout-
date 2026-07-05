// ── Module-level constants (allocated once) ──────────────────────────
const VALID_BASE_CODES = new Set([
  65/*A*/, 67/*C*/, 71/*G*/, 84/*T*/, 68/*D*/, 73/*I*/, 78/*N*/, 45/*-*/
]);

export function isValidGenotype(genotype: string): boolean {
  if (genotype === '--' || genotype === '__' || genotype === '00' || genotype === '??' || genotype === './.' || genotype === '.|.' || genotype === '-' || genotype === '.') {
    return false; // Treat uncalled/missing variants as invalid so they are skipped
  }
  const len = genotype.length;
  if (len === 0 || len > 2) return false;
  if (!VALID_BASE_CODES.has(genotype.charCodeAt(0))) return false;
  if (len === 2 && !VALID_BASE_CODES.has(genotype.charCodeAt(1))) return false;
  return true;
}

// ── Ultra-fast manual field extractor (replaces regex) ───────────────
// Handles tab, comma, and space delimited lines with optional quote wrapping.
// Returns null for non-data lines (comments, headers, blanks).
interface ParsedFields {
  markerId: string;  // already lowercased
  chrom: string;     // already uppercased, CHR prefix stripped
  posStr: string;
  pos: number;
  genotype: string;  // already uppercased
}

function fastParseLine(line: string, delim: number, delimStr: string): ParsedFields | null {
  // Field 0: rsID / marker ID
  let start = 0;
  let end = line.indexOf(delimStr, start);
  if (end === -1) return null;
  let field0 = line.substring(start, end);
  // Strip quotes
  if (field0.charCodeAt(0) === 34) field0 = field0.substring(1);
  if (field0.length > 0 && field0.charCodeAt(field0.length - 1) === 34) field0 = field0.substring(0, field0.length - 1);
  // Must start with 'rs' or 'i' followed by digit
  const c0 = field0.charCodeAt(0);
  if (c0 === 114 || c0 === 82) { // 'r' or 'R'
    const c1 = field0.charCodeAt(1);
    if (c1 !== 115 && c1 !== 83) return null; // 's' or 'S'
  } else if (c0 === 105 || c0 === 73) { // 'i' or 'I'
    // ok — internal marker
  } else {
    return null;
  }

  // Field 1: chromosome
  start = end + 1;
  // Skip consecutive delimiters (e.g. multiple spaces)
  while (start < line.length && line.charCodeAt(start) === delim) start++;
  end = line.indexOf(delimStr, start);
  if (end === -1) return null;
  let field1 = line.substring(start, end);
  if (field1.charCodeAt(0) === 34) field1 = field1.substring(1);
  if (field1.length > 0 && field1.charCodeAt(field1.length - 1) === 34) field1 = field1.substring(0, field1.length - 1);

  // Field 2: position
  start = end + 1;
  while (start < line.length && line.charCodeAt(start) === delim) start++;
  end = line.indexOf(delimStr, start);
  if (end === -1) end = line.length;
  let field2 = line.substring(start, end);
  if (field2.charCodeAt(0) === 34) field2 = field2.substring(1);
  if (field2.length > 0 && field2.charCodeAt(field2.length - 1) === 34) field2 = field2.substring(0, field2.length - 1);

  // Field 3+: genotype (may be 1 field "AG" or 2 fields "A" "G")
  start = end < line.length ? end + 1 : end;
  while (start < line.length && line.charCodeAt(start) === delim) start++;
  let genoEnd = line.indexOf(delimStr, start);
  if (genoEnd === -1) genoEnd = line.length;
  let field3 = line.substring(start, genoEnd);
  if (field3.charCodeAt(0) === 34) field3 = field3.substring(1);
  if (field3.length > 0 && field3.charCodeAt(field3.length - 1) === 34) field3 = field3.substring(0, field3.length - 1);

  let genotype = field3.toUpperCase();

  // Check for split alleles (AncestryDNA: "A\tG" → "AG")
  if (genotype.length === 1 && genoEnd < line.length) {
    let s2 = genoEnd + 1;
    while (s2 < line.length && line.charCodeAt(s2) === delim) s2++;
    let e2 = line.indexOf(delimStr, s2);
    if (e2 === -1) e2 = line.length;
    let allele2 = line.substring(s2, e2);
    if (allele2.charCodeAt(0) === 34) allele2 = allele2.substring(1);
    if (allele2.length > 0 && allele2.charCodeAt(allele2.length - 1) === 34) allele2 = allele2.substring(0, allele2.length - 1);
    if (allele2.length === 1) {
      genotype += allele2.toUpperCase();
    }
  }

  // Ancestry-specific "0" cleaning
  if (genotype.includes('0')) genotype = genotype.replace(/0/g, '');

  if (!isValidGenotype(genotype)) return null;

  // Sort SNP alleles alphabetically to be position independent (e.g. TC -> CT)
  if (genotype.length === 2 && genotype[0] !== 'I' && genotype[0] !== 'D' && genotype[1] !== 'I' && genotype[1] !== 'D') {
    if (genotype.charCodeAt(0) > genotype.charCodeAt(1)) {
      genotype = genotype[1] + genotype[0];
    }
  }

  let chrom = field1.toUpperCase();
  if (chrom.startsWith('CHR')) chrom = chrom.substring(3);
  if (chrom === '23') chrom = 'X';
  else if (chrom === '24') chrom = 'Y';
  else if (chrom === '25' || chrom === '26' || chrom === 'M') chrom = 'MT';

  let rawMarkerId = field0.toLowerCase();
  if (!rawMarkerId || rawMarkerId === '.' || rawMarkerId === '-') {
    rawMarkerId = `chr${chrom}_${field2}`.toLowerCase(); // Hydrate empty rsID with chr_pos
  }

  return {
    markerId: rawMarkerId,
    chrom,
    posStr: field2,
    pos: parseInt(field2, 10),
    genotype
  };
}

export interface GenomicsParseErrorDetails {
  format?: string;
  chip?: string;
  bytesTotal?: number;
  linesTotal?: number;
  linesCommented?: number;
  linesMalformed?: number;
  headerPreview?: string;
  errorCategory?: string;
  suggestedSolution?: string;
}

export class GenomicsParseError extends Error {
  details: GenomicsParseErrorDetails;

  constructor(message: string, details: GenomicsParseErrorDetails) {
    super(message);
    this.name = "GenomicsParseError";
    this.details = details;
  }
}

export function checkFileFormatHealth(text: string): { healthy: boolean; reason?: string; category?: string; solution?: string } {
  if (!text || text.trim().length === 0) {
    return {
      healthy: false,
      category: "Empty Document",
      reason: "This file is completely empty.",
      solution: "Please check your DNA data export; it should be between 5MB and 45MB in size."
    };
  }
  
  const header = text.slice(0, 5000);

  // 1. Check for PDF
  if (header.startsWith("%PDF")) {
    return {
      healthy: false,
      category: "PDF Binary Document",
      reason: "The file is an Adobe PDF format report, not raw DNA text data.",
      solution: "Please upload the original raw data text download from your provider. Visual reports or PDFs cannot be processed by bioinformatics tools."
    };
  }

  // 2. Check for zip signature that bypassed client extract
  if (header.startsWith("PK\x03\x04") || header.includes("PK\u0003\u0004") || header.startsWith("PK\x05\x06") || header.startsWith("PK\x07\x08")) {
    return {
      healthy: false,
      category: "Direct Binary ZIP Archive",
      reason: "This file is a zipped archive. Although Genotype Scout unpacks standard ZIP files, this archive appears to be encrypted, corrupted, or nested in unreadable sub-directories.",
      solution: "Try unzipping the archive manually on your desktop first, and upload the enclosed plain text file (.txt or .csv)."
    };
  }

  // 3. Check for HTML
  if (header.trim().toLowerCase().startsWith("<!doctype html") || header.includes("<html") || header.includes("<head") || header.includes("schema.org")) {
    return {
      healthy: false,
      category: "HTML Webpage Page",
      reason: "The file is an HTML webpage, not raw DNA text data.",
      solution: "It look like you may have saved the vendor dashboard page using 'Save Page As'. Go back to your DNA provider, navigate to 'Settings / Download Raw Data', and request the real data download."
    };
  }

  // 4. Check for Excel or formats
  if (header.includes("workbook") || header.includes("<workbook") || header.includes("xmlns:o=\"urn:schemas-microsoft-com:office")) {
    return {
      healthy: false,
      category: "Excel Spreadsheet Format",
      reason: "The file is an Excel document or Microsoft Office XML representation.",
      solution: "Please export your spreadsheet or workbook into an ASCII/UTF-8 Tab-delimited plain text file (.txt or .csv) and try uploading again."
    };
  }

  // 5. Binary scan - excessive non-printable characters or null bytes
  let binaryCharCount = 0;
  const testLimit = Math.min(text.length, 1000);
  for (let i = 0; i < testLimit; i++) {
    const charCode = text.charCodeAt(i);
    // Null byte or strange unprintable characters indicating binary format (e.g. BAM, CRAM, BCF)
    if (charCode === 0 || (charCode < 32 && charCode !== 9 && charCode !== 10 && charCode !== 13)) {
      binaryCharCount++;
    }
  }
  if (binaryCharCount > 15) {
    return {
      healthy: false,
      category: "Non-Text Binary Format (BAM/CRAM/BCF)",
      reason: "The file contains non-text binary characters. Our browser-side consumer engine expects processed 23andMe standard text representation.",
      solution: "Please convert your BAM or FastQ sequence alignment data into 23andMe or AncestryDNA tab-delimited SNP format before analysis."
    };
  }

  return { healthy: true };
}

export function parseRawDNA(
  text: string, 
  allowlist?: Set<string>,
  onProgress?: (bytesProcessed: number, totalBytes: number, snpsFound: number) => void
) {
  const snpMap: Record<string, string> = {};
  const snpMetaMap: Record<string, { chrom: string, pos: number }> = {};
  const yMap: Record<string, string> = {};
  const mtMap: Record<string, string> = {};
  let format = "Unknown";
  let chip = "Unknown Chip";
  let snpCount = 0;
  
  // Try to detect format/chip early from header
  const header = text.slice(0, 1000);
  
  // Enforce file health check
  const health = checkFileFormatHealth(text);
  if (!health.healthy) {
    throw new GenomicsParseError(health.reason || "Invalid file format", {
      headerPreview: header.slice(0, 300),
      errorCategory: health.category,
      suggestedSolution: health.solution,
      bytesTotal: text.length
    });
  }

  if (header.includes("23andMe")) {
    format = "23andMe";
    if (header.includes("v5")) chip = "23andMe v5 (GSA)";
    else if (header.includes("v4")) chip = "23andMe v4 (OmniExpress)";
    else if (header.includes("v3")) chip = "23andMe v3 (OmniExpress)";
    else chip = "23andMe (Legacy)";
  } else if (header.includes("AncestryDNA")) {
    format = "AncestryDNA";
    if (header.includes("v3")) chip = "AncestryDNA v3 (GSA)";
    else if (header.includes("v2")) chip = "AncestryDNA v2 (GSA)";
    else if (header.includes("v1")) chip = "AncestryDNA v1 (OmniExpress)";
    else chip = "AncestryDNA";
  } else if (header.includes("MyHeritage")) {
    format = "MyHeritage";
    chip = "MyHeritage DNA (GSA)";
  } else if (header.includes("Family Tree DNA") || header.includes("FTDNA")) {
    format = "FTDNA";
    chip = "FTDNA Family Finder";
  } else if (header.includes("Living DNA")) {
    format = "Living DNA";
    chip = "Living DNA (GSA)";
  } else if (header.includes("##fileformat=VCF") || header.includes("#CHROM\tPOS\tID\tREF\tALT") || header.includes("#CHROM")) {
    format = "VCF";
    chip = "Variant Call Format (VCF)";
  }

  let linesTotal = 0;
  let linesCommented = 0;
  let linesMalformed = 0;

  const isVcf = format === "VCF";
  const totalLength = text.length;
  let lineStart = 0;
  let matchCount = 0;

  let delim: number | null = null;
  let delimStr = "";

  while (lineStart < totalLength) {
    let lineEnd = text.indexOf('\n', lineStart);
    if (lineEnd === -1) lineEnd = totalLength;

    // Strip \r without creating a trimmed copy
    let lineActualEnd = lineEnd;
    if (lineActualEnd > lineStart && text.charCodeAt(lineActualEnd - 1) === 13) lineActualEnd--;

    const lineLen = lineActualEnd - lineStart;
    lineStart = lineEnd + 1;
    linesTotal++;

    if (lineLen === 0) continue;

    const firstChar = text.charCodeAt(lineActualEnd - lineLen);
    if (firstChar === 35 /* # */ || (firstChar === 47 /* / */ && text.charCodeAt(lineActualEnd - lineLen + 1) === 47)) {
      linesCommented++;
      continue;
    }

    const line = text.substring(lineActualEnd - lineLen, lineActualEnd);

    if (isVcf) {
      if (linesTotal % 10000 === 0 && onProgress) {
        onProgress(lineStart, totalLength, snpCount);
      }
      const cols = line.split('\t');
      if (cols.length >= 10) {
        const chrom = cols[0].toUpperCase().replace('CHR', '');
        const posStr = cols[1];
        const pos = parseInt(posStr, 10);
        const id = cols[2];
        const ref = cols[3].toUpperCase();
        const alt = cols[4].toUpperCase();
        const formatCol = cols[8];
        const sampleCol = cols[9];

        const formatFields = formatCol.split(':');
        const gtIdx = formatFields.indexOf('GT');
        if (gtIdx !== -1) {
          const sampleFields = sampleCol.split(':');
          const gtVal = sampleFields[gtIdx];
          if (gtVal && gtVal !== '.' && gtVal !== './.') {
            const gtParts = gtVal.split(/[\/|]/);
            const altAlleles = alt.split(',');
            const getAllele = (idxStr: string) => {
              if (idxStr === '0') return ref;
              const idx = parseInt(idxStr, 10);
              return (idx >= 1 && idx <= altAlleles.length) ? altAlleles[idx - 1] : '-';
            };
            const a1 = getAllele(gtParts[0]);
            const a2 = getAllele(gtParts[1] || gtParts[0]);
            const genotype = a1 + a2;

            if (isValidGenotype(genotype)) {
              const markerId = id !== '.' ? id.toLowerCase() : `chr${chrom}_${pos}`.toLowerCase();
              const isYorMT = chrom === 'Y' || chrom === '24' || chrom === 'MT' || chrom === 'M' || chrom === '26' || chrom === '25';
              if (!allowlist || isYorMT || allowlist.has(markerId)) {
                snpCount++;
                snpMap[markerId] = genotype;
                if (!isNaN(pos)) {
                  snpMetaMap[markerId] = { chrom, pos };
                  snpMap[`chr${chrom}_${pos}`.toLowerCase()] = genotype;
                }
                if (chrom === 'Y' || chrom === '24') yMap[markerId] = genotype;
                if (chrom === 'MT' || chrom === 'M' || chrom === '26' || chrom === '25') {
                  const allele = genotype[0];
                  if (allele !== '-') mtMap[posStr] = allele;
                }
              }
            }
          }
        }
      } else {
        linesMalformed++;
      }
    } else {
      if (delim === null) {
        if (line.indexOf('\t') !== -1) {
          delim = 9;
          delimStr = '\t';
        } else if (line.indexOf(',') !== -1) {
          delim = 44;
          delimStr = ',';
        } else if (line.indexOf(' ') !== -1) {
          delim = 32;
          delimStr = ' ';
        } else {
          linesMalformed++;
          continue;
        }
      }
      // ── Fast manual field extraction (replaces regex) ──
      const parsed = fastParseLine(line, delim, delimStr);
      if (parsed) {
        matchCount++;
        if (matchCount % 10000 === 0 && onProgress) {
          onProgress(lineStart, totalLength, snpCount);
        }
        const { markerId, chrom, posStr, pos, genotype } = parsed;
        const isYorMT = chrom === 'Y' || chrom === '24' || chrom === 'MT' || chrom === 'M' || chrom === '26' || chrom === '25';

        if (allowlist && !isYorMT && !allowlist.has(markerId)) continue;

        snpCount++;
        snpMap[markerId] = genotype;
        if (!isNaN(pos)) {
          snpMetaMap[markerId] = { chrom, pos };
          const coordId = `chr${chrom}_${pos}`.toLowerCase();
          if (!snpMap[coordId]) snpMap[coordId] = genotype;
        }
        if (chrom === 'Y' || chrom === '24') yMap[markerId] = genotype;
        if (chrom === 'MT' || chrom === 'M' || chrom === '26' || chrom === '25') {
          const allele = genotype[0];
          if (allele !== '-') mtMap[posStr] = allele;
        }
      } else {
        linesMalformed++;
      }
    }
  }

  // Refine chip detection based on SNP count if still unknown
  if (chip === "Unknown Chip") {
    if (snpCount > 900000) chip = "High-Density Chip (Omni2.5 or similar)";
    else if (snpCount > 600000) chip = "Standard GSA/OmniExpress Chip";
    else if (snpCount > 300000) chip = "Low-Density Chip";
    else chip = `${format} Raw Data`;
  }

  if (snpCount === 0) {
    throw new GenomicsParseError(
      "The file contains no parseable genetic markers (SNPs). Please verify that the column layout matches our requirements.",
      {
        format,
        chip,
        bytesTotal: text.length,
        linesTotal: text.split(/\r?\n/).length,
        linesCommented,
        linesMalformed: text.split(/\r?\n/).length - linesCommented,
        headerPreview: header.slice(0, 300),
        errorCategory: "No Valid Genetic Markers Found",
        suggestedSolution: "Make sure that the file lists SNPs in the standard layout: rsID, chromosome, physical position, and allele genotype letters (e.g. AA, CT, GG)."
      }
    );
  }

  if (onProgress) {
    onProgress(totalLength, totalLength, snpCount);
  }

  return { snpMap, snpMetaMap, yMap, mtMap, format, chip, snpCount };
}

export async function parseRawDNAStream(
  file: File,
  allowlist?: Set<string>,
  onProgress?: (bytesProcessed: number, totalBytes: number, snpsFound: number) => void
) {
  const snpMap: Record<string, string> = {};
  const snpMetaMap: Record<string, { chrom: string, pos: number }> = {};
  const yMap: Record<string, string> = {};
  const mtMap: Record<string, string> = {};
  let format = "Unknown";
  let chip = "Unknown Chip";
  let snpCount = 0;
  let delim: number | null = null;
  let delimStr = "";

  const totalBytes = file.size;
  let bytesProcessed = 0;

  // Detect format/chip from primary slice of the header to avoid reading the whole file
  const firstSlice = file.slice(0, Math.min(50000, file.size));
  const firstChunkText = await firstSlice.text();
  const header = firstChunkText.slice(0, 1000);

  // Enforce format health diagnostics early on stream
  const health = checkFileFormatHealth(firstChunkText);
  if (!health.healthy) {
    throw new GenomicsParseError(health.reason || "Invalid file format", {
      headerPreview: header.slice(0, 300),
      errorCategory: health.category,
      suggestedSolution: health.solution,
      bytesTotal: file.size
    });
  }

  if (header.includes("23andMe")) {
    format = "23andMe";
    if (header.includes("v5")) chip = "23andMe v5 (GSA)";
    else if (header.includes("v4")) chip = "23andMe v4 (OmniExpress)";
    else if (header.includes("v3")) chip = "23andMe v3 (OmniExpress)";
    else chip = "23andMe (Legacy)";
  } else if (header.includes("AncestryDNA")) {
    format = "AncestryDNA";
    if (header.includes("v3")) chip = "AncestryDNA v3 (GSA)";
    else if (header.includes("v2")) chip = "AncestryDNA v2 (GSA)";
    else if (header.includes("v1")) chip = "AncestryDNA v1 (OmniExpress)";
    else chip = "AncestryDNA";
  } else if (header.includes("MyHeritage")) {
    format = "MyHeritage";
    chip = "MyHeritage DNA (GSA)";
  } else if (header.includes("Family Tree DNA") || header.includes("FTDNA")) {
    format = "FTDNA";
    chip = "FTDNA Family Finder";
  } else if (header.includes("Living DNA")) {
    format = "Living DNA";
    chip = "Living DNA (GSA)";
  } else if (header.includes("##fileformat=VCF") || header.includes("#CHROM\tPOS\tID\tREF\tALT") || header.includes("#CHROM")) {
    format = "VCF";
    chip = "Variant Call Format (VCF)";
  }

  const isVcf = format === "VCF";

  // Open the file stream
  const stream = file.stream();
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: false, ignoreBOM: true });

  let remainder = '';

  let linesTotal = 0;
  let linesCommented = 0;
  let linesMalformed = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    bytesProcessed += value.length;

    const chunkText = decoder.decode(value, { stream: true });
    const fullText = remainder + chunkText;

    // Fast line split using indexOf instead of regex
    let pos = 0;
    const ftLen = fullText.length;
    let lastNewline = -1;

    while (pos < ftLen) {
      const nlIdx = fullText.indexOf('\n', pos);
      if (nlIdx === -1) break; // rest is remainder

      let lineEnd = nlIdx;
      if (lineEnd > pos && fullText.charCodeAt(lineEnd - 1) === 13) lineEnd--;

      const lineLen = lineEnd - pos;
      linesTotal++;

      if (lineLen > 0) {
        const fc = fullText.charCodeAt(pos);
        if (fc === 35 /* # */) {
          linesCommented++;
        } else {
          const line = fullText.substring(pos, lineEnd);

          if (isVcf) {
            const cols = line.split('\t');
            if (cols.length >= 10) {
              const chrom = cols[0].toUpperCase().replace('CHR', '');
              const posStr = cols[1];
              const colPos = parseInt(posStr, 10);
              const id = cols[2];
              const ref = cols[3].toUpperCase();
              const alt = cols[4].toUpperCase();
              const formatCol = cols[8];
              const sampleCol = cols[9];

              const formatFields = formatCol.split(':');
              const gtIdx = formatFields.indexOf('GT');
              if (gtIdx !== -1) {
                const sampleFields = sampleCol.split(':');
                const gtVal = sampleFields[gtIdx];
                if (gtVal && gtVal !== '.' && gtVal !== './.') {
                  const gtParts = gtVal.split(/[\/|]/);
                  const altAlleles = alt.split(',');
                  const getAllele = (idxStr: string) => {
                    if (idxStr === '0') return ref;
                    const idx = parseInt(idxStr, 10);
                    return (idx >= 1 && idx <= altAlleles.length) ? altAlleles[idx - 1] : '-';
                  };
                  const a1 = getAllele(gtParts[0]);
                  const a2 = getAllele(gtParts[1] || gtParts[0]);
                  const genotype = a1 + a2;

                  if (isValidGenotype(genotype)) {
                    const markerId = id !== '.' ? id.toLowerCase() : `chr${chrom}_${colPos}`.toLowerCase();
                    const isYorMT = chrom === 'Y' || chrom === '24' || chrom === 'MT' || chrom === 'M' || chrom === '26' || chrom === '25';
                    if (!allowlist || isYorMT || allowlist.has(markerId)) {
                      snpCount++;
                      snpMap[markerId] = genotype;
                      if (!isNaN(colPos)) {
                        snpMetaMap[markerId] = { chrom, pos: colPos };
                        snpMap[`chr${chrom}_${colPos}`.toLowerCase()] = genotype;
                      }
                      if (chrom === 'Y' || chrom === '24') yMap[markerId] = genotype;
                      if (chrom === 'MT' || chrom === 'M' || chrom === '26' || chrom === '25') {
                        const allele = genotype[0];
                        if (allele !== '-') mtMap[posStr] = allele;
                      }
                    }
                  }
                }
              }
            } else {
              linesMalformed++;
            }
          } else {
            if (delim === null) {
              if (line.indexOf('\t') !== -1) {
                delim = 9;
                delimStr = '\t';
              } else if (line.indexOf(',') !== -1) {
                delim = 44;
                delimStr = ',';
              } else if (line.indexOf(' ') !== -1) {
                delim = 32;
                delimStr = ' ';
              } else {
                linesMalformed++;
                lastNewline = nlIdx;
                pos = nlIdx + 1;
                continue;
              }
            }
            // ── Fast manual field extraction (replaces regex) ──
            const parsed = fastParseLine(line, delim, delimStr);
            if (parsed) {
              const { markerId, chrom, posStr, pos: colPos, genotype } = parsed;
              const isYorMT = chrom === 'Y' || chrom === '24' || chrom === 'MT' || chrom === 'M' || chrom === '26' || chrom === '25';
              if (allowlist && !isYorMT && !allowlist.has(markerId)) {
                // skip
              } else {
                snpCount++;
                snpMap[markerId] = genotype;
                if (!isNaN(colPos)) {
                  snpMetaMap[markerId] = { chrom, pos: colPos };
                  const coordId = `chr${chrom}_${colPos}`.toLowerCase();
                  if (!snpMap[coordId]) snpMap[coordId] = genotype;
                }
                if (chrom === 'Y' || chrom === '24') yMap[markerId] = genotype;
                if (chrom === 'MT' || chrom === 'M' || chrom === '26' || chrom === '25') {
                  const allele = genotype[0];
                  if (allele !== '-') mtMap[posStr] = allele;
                }
              }
            } else {
              linesMalformed++;
            }
          }
        }
      }

      lastNewline = nlIdx;
      pos = nlIdx + 1;
    }

    remainder = lastNewline === -1 ? fullText : fullText.substring(lastNewline + 1);

    if (onProgress) {
      onProgress(bytesProcessed, totalBytes, snpCount);
    }
  }

  // Handle remaining text if any
  if (remainder) {
    const line = remainder.endsWith('\r') ? remainder.substring(0, remainder.length - 1) : remainder;
    linesTotal++;
    if (line && !line.startsWith('#')) {
      if (isVcf) {
        const cols = line.split('\t');
        if (cols.length >= 10) {
          const chrom = cols[0].toUpperCase().replace('CHR', '');
          const posStr = cols[1];
          const colPos = parseInt(posStr, 10);
          const id = cols[2];
          const ref = cols[3].toUpperCase();
          const alt = cols[4].toUpperCase();
          const formatCol = cols[8];
          const sampleCol = cols[9];
          const formatFields = formatCol.split(':');
          const gtIdx = formatFields.indexOf('GT');
          if (gtIdx !== -1) {
            const sampleFields = sampleCol.split(':');
            const gtVal = sampleFields[gtIdx];
            if (gtVal && gtVal !== '.' && gtVal !== './.') {
              const gtParts = gtVal.split(/[\/|]/);
              const altAlleles = alt.split(',');
              const getAllele = (idxStr: string) => {
                if (idxStr === '0') return ref;
                const idx = parseInt(idxStr, 10);
                return (idx >= 1 && idx <= altAlleles.length) ? altAlleles[idx - 1] : '-';
              };
              const a1 = getAllele(gtParts[0]);
              const a2 = getAllele(gtParts[1] || gtParts[0]);
              const genotype = a1 + a2;
              if (isValidGenotype(genotype)) {
                const markerId = id !== '.' ? id.toLowerCase() : `chr${chrom}_${colPos}`.toLowerCase();
                const isYorMT = chrom === 'Y' || chrom === '24' || chrom === 'MT' || chrom === 'M' || chrom === '26' || chrom === '25';
                if (!allowlist || isYorMT || allowlist.has(markerId)) {
                  snpCount++;
                  snpMap[markerId] = genotype;
                  if (!isNaN(colPos)) {
                    snpMetaMap[markerId] = { chrom, pos: colPos };
                    snpMap[`chr${chrom}_${colPos}`.toLowerCase()] = genotype;
                  }
                  if (chrom === 'Y' || chrom === '24') yMap[markerId] = genotype;
                  if (chrom === 'MT' || chrom === 'M' || chrom === '26' || chrom === '25') {
                    const allele = genotype[0];
                    if (allele !== '-') mtMap[posStr] = allele;
                  }
                }
              }
            }
          }
        } else {
          linesMalformed++;
        }
      } else {
        if (delim === null) {
          if (line.indexOf('\t') !== -1) {
            delim = 9;
            delimStr = '\t';
          } else if (line.indexOf(',') !== -1) {
            delim = 44;
            delimStr = ',';
          } else if (line.indexOf(' ') !== -1) {
            delim = 32;
            delimStr = ' ';
          } else {
            linesMalformed++;
          }
        }
      }
      if (delim !== null) {
        const parsed = fastParseLine(line, delim, delimStr);
        if (parsed) {
          const { markerId, chrom, posStr, pos: colPos, genotype } = parsed;
          const isYorMT = chrom === 'Y' || chrom === '24' || chrom === 'MT' || chrom === 'M' || chrom === '26' || chrom === '25';
          if (!allowlist || isYorMT || allowlist.has(markerId)) {
            snpCount++;
            snpMap[markerId] = genotype;
            if (!isNaN(colPos)) {
              snpMetaMap[markerId] = { chrom, pos: colPos };
              const coordId = `chr${chrom}_${colPos}`.toLowerCase();
              if (!snpMap[coordId]) snpMap[coordId] = genotype;
            }
            if (chrom === 'Y' || chrom === '24') yMap[markerId] = genotype;
            if (chrom === 'MT' || chrom === 'M' || chrom === '26' || chrom === '25') {
              const allele = genotype[0];
              if (allele !== '-') mtMap[posStr] = allele;
            }
          }
        } else {
          linesMalformed++;
        }
      }
    }
  }

  // Refine chip detection based on SNP count if still unknown
  if (chip === "Unknown Chip") {
    if (snpCount > 900000) chip = "High-Density Chip (Omni2.5 or similar)";
    else if (snpCount > 600000) chip = "Standard GSA/OmniExpress Chip";
    else if (snpCount > 300000) chip = "Low-Density Chip";
    else chip = `${format} Raw Data`;
  }

  if (snpCount === 0) {
    throw new GenomicsParseError(
      "The file contains no parseable genetic markers (SNPs). Please verify that the file represents local genome SNPs.",
      {
        format,
        chip,
        bytesTotal: file.size,
        linesTotal,
        linesCommented,
        linesMalformed,
        headerPreview: header.slice(0, 300),
        errorCategory: "Empty Ingestion Spectrum",
        suggestedSolution: "Make sure you downloaded 'all SNPs' or 'raw data text' rather than mitochondrial-only sequences or visual screenshots. The file should contain rsIDs and genotypes."
      }
    );
  }

  if (onProgress) {
    onProgress(file.size, file.size, snpCount);
  }

  return { snpMap, snpMetaMap, yMap, mtMap, format, chip, snpCount };
}
