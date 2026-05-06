export function parseRawDNA(text: string, allowlist?: Set<string>) {
  const lines = text.split(/\r?\n/);
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

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;
    
    // Split by tabs, commas, or multiple spaces, removing quotes for CSV
    const parts = trimmedLine.replace(/"/g, "").split(/[\t,]+/);
    
    // Basic validation: markerId must be at index 0
    if (parts.length < 4 || !parts[0]) continue;
    const markerId = parts[0].trim().toLowerCase();
    
    // Skip header lines
    if (markerId === "rsid" || markerId === "snp" || markerId === "marker" || markerId === "rs_id") continue;
    
    let chrom = parts[1].trim().toUpperCase();
    if (chrom.startsWith("CHR")) chrom = chrom.slice(3);
    
    const isYorMT = chrom === "Y" || chrom === "24" || chrom === "MT" || chrom === "M" || chrom === "26" || chrom === "25";
    
    // Stream Filter: If allowlist is provided, skip unknown markers unless they are Y or MT
    if (allowlist && !isYorMT && !allowlist.has(markerId)) {
      continue;
    }

    snpCount++;
    
    const posStr = parts[2].trim();
    const pos = parseInt(posStr, 10);
    
    let genotype = "";
    
    // Heuristic to detect format if not already detected from header
    if (format === "Unknown") {
      if (parts.length >= 5 && parts[3].length === 1 && parts[4].length === 1) {
        genotype = (parts[3] + parts[4]).toUpperCase();
        format = "AncestryDNA";
      } else if (parts.length >= 4) {
        genotype = parts[3].toUpperCase().replace(/\s/g, "");
        format = line.includes(",") ? "MyHeritage" : "23andMe";
      }
    } else {
      if (format === "AncestryDNA" && parts.length >= 5) {
        genotype = (parts[3] + parts[4]).toUpperCase().replace(/0/g, "");
      } else if (parts.length >= 4) {
        genotype = parts[3].toUpperCase().replace(/\s/g, "");
      }
    }

    if (!genotype) continue;
    
    // Validate genotype: must be A, C, T, G, or -
    if (/^[ACTG-]{1,2}$/.test(genotype) && genotype !== "--" && genotype !== "00") {
      snpMap[markerId] = genotype;
      if (!isNaN(pos)) {
        snpMetaMap[markerId] = { chrom, pos };
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
  }


  // Refine chip detection based on SNP count if still unknown
  if (chip === "Unknown Chip") {
    if (snpCount > 900000) chip = "High-Density Chip (Omni2.5 or similar)";
    else if (snpCount > 600000) chip = "Standard GSA/OmniExpress Chip";
    else if (snpCount > 300000) chip = "Low-Density Chip";
    else chip = `${format} Raw Data`;
  }

  if (snpCount > 0 && Object.keys(snpMap).length === 0) {
    throw new Error("No valid DNA data found in the file. Please ensure it's a supported raw DNA format (23andMe, AncestryDNA, MyHeritage, etc.).");
  }

  if (snpCount === 0) {
    throw new Error("The file appears to be empty or not a supported text format.");
  }

  return { snpMap, snpMetaMap, yMap, mtMap, format, chip, snpCount };
}
