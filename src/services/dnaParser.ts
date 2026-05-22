export function parseRawDNA(text: string, allowlist?: Set<string>) {
  const snpMap: Record<string, string> = {};
  const snpMetaMap: Record<string, { chrom: string, pos: number }> = {};
  const yMap: Record<string, string> = {};
  const mtMap: Record<string, string> = {};
  let format = "Unknown";
  let chip = "Unknown Chip";
  let snpCount = 0;
  
  // Try to detect chip from header
  const header = text.slice(0, 1000);
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
  }

  // Hyper-optimized Regex Parsing Loop with optional quote support for MyHeritage/CSV formats
  // Match: ["]rsID["] [sep] ["]chrom["] [sep] ["]pos["] [sep] ["]genotype["]
  // Note: Handles space/tab/comma separation and AncestryDNA multi-column genotypes
  const rowRegex = /^"?(rs\d+|i\d+)"?[\t, ]+"?((?:chr)?[\w]+)"?[\t, ]+"?(\d+)"?[\t, ]+"?([ACGTDI-]{1,2})"?([\t, ]+"?([ACGTDI-]))?"?/gmi;
  
  let match;
  while ((match = rowRegex.exec(text)) !== null) {
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

    if (!genotype || genotype === "--" || genotype === "__" || genotype === "00") continue;

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
  }

  // Refine chip detection based on SNP count if still unknown
  if (chip === "Unknown Chip") {
    if (snpCount > 900000) chip = "High-Density Chip (Omni2.5 or similar)";
    else if (snpCount > 600000) chip = "Standard GSA/OmniExpress Chip";
    else if (snpCount > 300000) chip = "Low-Density Chip";
    else chip = `${format} Raw Data`;
  }

  if (snpCount === 0) {
    throw new Error("The file appears to be empty or not in a supported raw DNA format (23andMe, AncestryDNA, MyHeritage, etc.).");
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
  }

  // Open the file stream
  const stream = file.stream();
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: false, ignoreBOM: true });

  let remainder = "";
  // Single-line regex representing standard 23andMe / vcf / map lines
  const lineRegex = /^"?(rs\d+|i\d+)"?[\t, ]+"?((?:chr)?[\w]+)"?[\t, ]+"?(\d+)"?[\t, ]+"?([ACGTDI-]{1,2})"?([\t, ]+"?([ACGTDI-]))?"?/i;

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
      // Skip commented or empty lines
      if (!line || line.startsWith("#") || line.startsWith("//")) continue;

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

        if (!genotype || genotype === "--" || genotype === "__" || genotype === "00") continue;

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
      }
    }

    if (onProgress) {
      onProgress(bytesProcessed, totalBytes, snpCount);
    }
  }

  // Handle remaining text if any
  if (remainder) {
    const line = remainder;
    if (line && !line.startsWith("#") && !line.startsWith("//")) {
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

        if (genotype && genotype !== "--" && genotype !== "__" && genotype !== "00") {
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
    throw new Error("The file appears to be empty or not in a supported raw DNA format.");
  }

  return { snpMap, snpMetaMap, yMap, mtMap, format, chip, snpCount };
}

