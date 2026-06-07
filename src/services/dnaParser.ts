export function isValidGenotype(genotype: string): boolean {
  if (!genotype || genotype.length > 2) return false;
  const validBases = new Set(['A', 'C', 'G', 'T', 'D', 'I', 'N', '-']);
  for (const base of genotype) {
    if (!validBases.has(base)) return false;
  }
  return true;
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

  // Hyper-optimized Regex Parsing Loop with optional quote support for MyHeritage/CSV formats
  const lineRegex = /^"?(rs\d+|i\d+)"?[\t, ]+"?((?:chr)?[\w]+)"?[\t, ]+"?(\d+)"?[\t, ]+"?([ACGTDIN-]{1,2})"?([\t, ]+"?([ACGTDIN-]))?"?/i;
  
  let linesTotal = 0;
  let linesCommented = 0;
  let linesMalformed = 0;

  const isVcf = format === "VCF";
  const totalLength = text.length;
  let lineStart = 0;
  let matchCount = 0;

  while (lineStart < totalLength) {
    let lineEnd = text.indexOf('\n', lineStart);
    if (lineEnd === -1) {
      lineEnd = totalLength;
    }
    const line = text.substring(lineStart, lineEnd).trim();
    lineStart = lineEnd + 1;
    linesTotal++;

    if (!line) continue;
    if (line.startsWith("#") || line.startsWith("//")) {
      linesCommented++;
      continue;
    }

    if (isVcf) {
      if (linesTotal % 10000 === 0 && onProgress) {
        onProgress(lineStart, totalLength, snpCount);
      }
      // VCF line layout: CHROM POS ID REF ALT QUAL FILTER INFO FORMAT SAMPLE
      const cols = line.split("\t");
      if (cols.length >= 10) {
        const chrom = cols[0].toUpperCase().replace("CHR", "");
        const posStr = cols[1];
        const pos = parseInt(posStr, 10);
        const id = cols[2];
        const ref = cols[3].toUpperCase();
        const alt = cols[4].toUpperCase();
        const formatCol = cols[8];
        const sampleCol = cols[9];

        const formatFields = formatCol.split(":");
        const gtIdx = formatFields.indexOf("GT");
        if (gtIdx !== -1) {
          const sampleFields = sampleCol.split(":");
          const gtVal = sampleFields[gtIdx];
          if (gtVal && gtVal !== "." && gtVal !== "./.") {
            const gtParts = gtVal.split(/[\/|]/);
            const altAlleles = alt.split(",");
            
            const getAllele = (idxStr: string) => {
              if (idxStr === "0") return ref;
              const idx = parseInt(idxStr, 10);
              if (idx >= 1 && idx <= altAlleles.length) {
                return altAlleles[idx - 1];
              }
              return "-";
            };

            const a1 = getAllele(gtParts[0]);
            const a2 = getAllele(gtParts[1] || gtParts[0]);
            const genotype = a1 + a2;

            if (isValidGenotype(genotype)) {
              const markerId = id !== "." ? id.toLowerCase() : `chr${chrom}_${pos}`.toLowerCase();
              const isYorMT = chrom === "Y" || chrom === "24" || chrom === "MT" || chrom === "M" || chrom === "26" || chrom === "25";
              
              if (!allowlist || isYorMT || allowlist.has(markerId)) {
                snpCount++;
                snpMap[markerId] = genotype;
                if (!isNaN(pos)) {
                  snpMetaMap[markerId] = { chrom, pos };
                  const coordId = `chr${chrom}_${pos}`.toLowerCase();
                  snpMap[coordId] = genotype;
                }
                if (chrom === "Y" || chrom === "24") {
                  yMap[markerId] = genotype;
                }
                if (chrom === "MT" || chrom === "M" || chrom === "26" || chrom === "25") {
                  const allele = genotype[0];
                  if (allele !== "-") {
                    mtMap[posStr] = allele;
                  }
                }
              }
            }
          }
        }
      } else {
        linesMalformed++;
      }
    } else {
      const match = lineRegex.exec(line);
      if (match) {
        matchCount++;
        if (matchCount % 10000 === 0 && onProgress) {
          onProgress(lineStart, totalLength, snpCount);
        }
        const markerId = match[1].toLowerCase();
        let chrom = match[2].toUpperCase();
        if (chrom.startsWith("CHR")) chrom = chrom.slice(3);
        const posStr = match[3];
        const pos = parseInt(posStr, 10);
        
        // Support multi-column genotype (AncestryDNA style: "A G" -> "AG")
        let genotype = match[4].toUpperCase();
        if (match[6]) {
          genotype += match[6].toUpperCase();
        }
        genotype = genotype.replace(/0/g, ""); // Ancestry specific cleaning

        if (!isValidGenotype(genotype)) continue;

        const isYorMT = chrom === "Y" || chrom === "24" || chrom === "MT" || chrom === "M" || chrom === "26" || chrom === "25";
        
        // Stream Filter: If allowlist is provided, skip unknown markers unless they are Y or MT
        if (allowlist && !isYorMT && !allowlist.has(markerId)) {
          continue;
        }

        snpCount++;
        
        // Store regular SNPs
        snpMap[markerId] = genotype;
        if (!isNaN(pos)) {
          snpMetaMap[markerId] = { chrom, pos };
          // Also index by coordinate-based ID for engines that need fallback lookup
          const coordId = `chr${chrom}_${pos}`.toLowerCase();
          if (!snpMap[coordId]) {
            snpMap[coordId] = genotype;
          }
        }
        
        // Extract Y-DNA mutations
        if (chrom === "Y" || chrom === "24") {
          yMap[markerId] = genotype;
        }
        
        // Extract mtDNA mutations
        if (chrom === "MT" || chrom === "M" || chrom === "26" || chrom === "25") {
          const allele = genotype[0];
          if (allele !== "-") {
            mtMap[posStr] = allele;
          }
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

  let remainder = "";
  // Single-line regex representing standard 23andMe / vcf / map lines
  const lineRegex = /^"?(rs\d+|i\d+)"?[\t, ]+"?((?:chr)?[\w]+)"?[\t, ]+"?(\d+)"?[\t, ]+"?([ACGTDIN-]{1,2})"?([\t, ]+"?([ACGTDIN-]))?"?/i;

  let linesTotal = 0;
  let linesCommented = 0;
  let linesMalformed = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    bytesProcessed += value.length;

    // Decode current chunk with streaming option
    const chunkText = decoder.decode(value, { stream: true });
    const fullText = remainder + chunkText;

    // Split on newlines
    const lines = fullText.split(/\r?\n/);
    
    // The last element may be incomplete
    remainder = lines.pop() || "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      linesTotal++;
      // Skip commented or empty lines
      if (!line) continue;
      if (line.startsWith("##")) {
        linesCommented++;
        continue;
      }
      if (line.startsWith("#")) {
        linesCommented++;
        continue;
      }

      if (isVcf) {
        const cols = line.split("\t");
        if (cols.length >= 10) {
          const chrom = cols[0].toUpperCase().replace("CHR", "");
          const posStr = cols[1];
          const pos = parseInt(posStr, 10);
          const id = cols[2];
          const ref = cols[3].toUpperCase();
          const alt = cols[4].toUpperCase();
          const formatCol = cols[8];
          const sampleCol = cols[9];

          const formatFields = formatCol.split(":");
          const gtIdx = formatFields.indexOf("GT");
          if (gtIdx !== -1) {
            const sampleFields = sampleCol.split(":");
            const gtVal = sampleFields[gtIdx];
            if (gtVal && gtVal !== "." && gtVal !== "./.") {
              const gtParts = gtVal.split(/[\/|]/);
              const altAlleles = alt.split(",");
              
              const getAllele = (idxStr: string) => {
                if (idxStr === "0") return ref;
                const idx = parseInt(idxStr, 10);
                if (idx >= 1 && idx <= altAlleles.length) {
                  return altAlleles[idx - 1];
                }
                return "-";
              };

              const a1 = getAllele(gtParts[0]);
              const a2 = getAllele(gtParts[1] || gtParts[0]);
              const genotype = a1 + a2;

              if (isValidGenotype(genotype)) {
                const markerId = id !== "." ? id.toLowerCase() : `chr${chrom}_${pos}`.toLowerCase();
                const isYorMT = chrom === "Y" || chrom === "24" || chrom === "MT" || chrom === "M" || chrom === "26" || chrom === "25";
                
                if (!allowlist || isYorMT || allowlist.has(markerId)) {
                  snpCount++;
                  snpMap[markerId] = genotype;
                  if (!isNaN(pos)) {
                    snpMetaMap[markerId] = { chrom, pos };
                    const coordId = `chr${chrom}_${pos}`.toLowerCase();
                    snpMap[coordId] = genotype;
                  }
                  if (chrom === "Y" || chrom === "24") {
                    yMap[markerId] = genotype;
                  }
                  if (chrom === "MT" || chrom === "M" || chrom === "26" || chrom === "25") {
                    const allele = genotype[0];
                    if (allele !== "-") {
                      mtMap[posStr] = allele;
                    }
                  }
                }
              }
            }
          }
        } else {
          linesMalformed++;
        }
        continue;
      }

      const match = lineRegex.exec(line);
      if (match) {
        const markerId = match[1].toLowerCase();
        let chrom = match[2].toUpperCase();
        if (chrom.startsWith("CHR")) chrom = chrom.slice(3);
        const posStr = match[3];
        const pos = parseInt(posStr, 10);
        
        let genotype = match[4].toUpperCase();
        if (match[6]) {
          genotype += match[6].toUpperCase();
        }
        genotype = genotype.replace(/0/g, ""); // Ancestry specific cleaning

        if (!isValidGenotype(genotype)) continue;

        const isYorMT = chrom === "Y" || chrom === "24" || chrom === "MT" || chrom === "M" || chrom === "26" || chrom === "25";
        
        if (allowlist && !isYorMT && !allowlist.has(markerId)) {
          continue;
        }

        snpCount++;
        
        snpMap[markerId] = genotype;
        if (!isNaN(pos)) {
          snpMetaMap[markerId] = { chrom, pos };
          const coordId = `chr${chrom}_${pos}`.toLowerCase();
          if (!snpMap[coordId]) {
            snpMap[coordId] = genotype;
          }
        }
        
        if (chrom === "Y" || chrom === "24") {
          yMap[markerId] = genotype;
        }
        
        if (chrom === "MT" || chrom === "M" || chrom === "26" || chrom === "25") {
          const allele = genotype[0];
          if (allele !== "-") {
            mtMap[posStr] = allele;
          }
        }
      } else {
        linesMalformed++;
      }
    }

    if (onProgress) {
      onProgress(bytesProcessed, totalBytes, snpCount);
    }
  }

  // Handle remaining text if any
  if (remainder) {
    const line = remainder;
    linesTotal++;
    if (line && !line.startsWith("#") && !line.startsWith("//") && !line.startsWith("##")) {
      if (isVcf) {
        const cols = line.split("\t");
        if (cols.length >= 10) {
          const chrom = cols[0].toUpperCase().replace("CHR", "");
          const posStr = cols[1];
          const pos = parseInt(posStr, 10);
          const id = cols[2];
          const ref = cols[3].toUpperCase();
          const alt = cols[4].toUpperCase();
          const formatCol = cols[8];
          const sampleCol = cols[9];

          const formatFields = formatCol.split(":");
          const gtIdx = formatFields.indexOf("GT");
          if (gtIdx !== -1) {
            const sampleFields = sampleCol.split(":");
            const gtVal = sampleFields[gtIdx];
            if (gtVal && gtVal !== "." && gtVal !== "./.") {
              const gtParts = gtVal.split(/[\/|]/);
              const altAlleles = alt.split(",");
              
              const getAllele = (idxStr: string) => {
                if (idxStr === "0") return ref;
                const idx = parseInt(idxStr, 10);
                if (idx >= 1 && idx <= altAlleles.length) {
                  return altAlleles[idx - 1];
                }
                return "-";
              };

              const a1 = getAllele(gtParts[0]);
              const a2 = getAllele(gtParts[1] || gtParts[0]);
              const genotype = a1 + a2;

              if (isValidGenotype(genotype)) {
                const markerId = id !== "." ? id.toLowerCase() : `chr${chrom}_${pos}`.toLowerCase();
                const isYorMT = chrom === "Y" || chrom === "24" || chrom === "MT" || chrom === "M" || chrom === "26" || chrom === "25";
                
                if (!allowlist || isYorMT || allowlist.has(markerId)) {
                  snpCount++;
                  snpMap[markerId] = genotype;
                  if (!isNaN(pos)) {
                    snpMetaMap[markerId] = { chrom, pos };
                    const coordId = `chr${chrom}_${pos}`.toLowerCase();
                    snpMap[coordId] = genotype;
                  }
                  if (chrom === "Y" || chrom === "24") {
                    yMap[markerId] = genotype;
                  }
                  if (chrom === "MT" || chrom === "M" || chrom === "26" || chrom === "25") {
                    const allele = genotype[0];
                    if (allele !== "-") {
                      mtMap[posStr] = allele;
                    }
                  }
                }
              }
            }
          }
        } else {
          linesMalformed++;
        }
      } else {
        const match = lineRegex.exec(line);
        if (match) {
          const markerId = match[1].toLowerCase();
          let chrom = match[2].toUpperCase();
          if (chrom.startsWith("CHR")) chrom = chrom.slice(3);
          const posStr = match[3];
          const pos = parseInt(posStr, 10);
          
          let genotype = match[4].toUpperCase();
          if (match[6]) {
            genotype += match[6].toUpperCase();
          }
          genotype = genotype.replace(/0/g, "");

          if (isValidGenotype(genotype)) {
            const isYorMT = chrom === "Y" || chrom === "24" || chrom === "MT" || chrom === "M" || chrom === "26" || chrom === "25";
            
            if (!allowlist || isYorMT || allowlist.has(markerId)) {
              snpCount++;
              snpMap[markerId] = genotype;
              if (!isNaN(pos)) {
                snpMetaMap[markerId] = { chrom, pos };
                const coordId = `chr${chrom}_${pos}`.toLowerCase();
                if (!snpMap[coordId]) {
                  snpMap[coordId] = genotype;
                }
              }
              if (chrom === "Y" || chrom === "24") {
                yMap[markerId] = genotype;
              }
              if (chrom === "MT" || chrom === "M" || chrom === "26" || chrom === "25") {
                const allele = genotype[0];
                if (allele !== "-") {
                  mtMap[posStr] = allele;
                }
              }
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

  return { snpMap, snpMetaMap, yMap, mtMap, format, chip, snpCount };
}
