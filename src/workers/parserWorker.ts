/**
 * parserWorker.ts
 * Heavy-duty DNA file parsing in a background thread.
 */

self.onmessage = async (e: MessageEvent) => {
  const { type, file } = e.data;

  if (type === 'PARSE_FILE') {
    try {
      if (!(file instanceof Blob)) throw new Error("Invalid file object provided.");

      const text = await file.text();
      const fileName = (file as any).name || "Unknown File";
      if (!text || text.length < 10) throw new Error("File is empty or too small.");

      let format = "Unknown";
      let chip = "Unknown Chip";
      
      // Determine format without scanning the entire file
      const header = text.slice(0, 5000);
      if (header.includes("23andMe")) {
        format = "23andMe";
        if (header.includes("v5")) chip = "23andMe v5 (GSA)";
        else if (header.includes("v4")) chip = "23andMe v4 (OmniExpress)";
        else chip = "23andMe Data";
      } else if (header.includes("AncestryDNA")) {
        format = "AncestryDNA";
        chip = "AncestryDNA Data";
      } else if (header.includes("MyHeritage")) {
        format = "MyHeritage";
        chip = "MyHeritage Data";
      } else if (header.includes("FTDNA") || header.includes("Family Tree DNA")) {
        format = "FTDNA";
        chip = "FTDNA Data";
      } else if (header.includes("##fileformat=VCF")) {
        format = "VCF";
        chip = "VCF Genome Data";
      }

      const isVCF = format === "VCF";
      const parsedData: any[] = [];
      const textLen = text.length;
      let startIdx = 0;
      let lineCount = 0;

      // Efficient line-by-line scanning without creating a massive array
      while (startIdx < textLen) {
        let endIdx = text.indexOf('\n', startIdx);
        if (endIdx === -1) endIdx = textLen;
        
        const line = text.substring(startIdx, endIdx).trim();
        startIdx = endIdx + 1;
        
        if (!line || line.startsWith('#')) continue;
        lineCount++;
        
        let rsid = "";
        let chromosome = "";
        let position = NaN;
        let genotype = "";

        if (isVCF) {
          const parts = line.split('\t');
          if (parts.length < 10) continue;
          chromosome = parts[0].toUpperCase().replace('CHR', '');
          position = parseInt(parts[1], 10);
          rsid = (parts[2] === "." ? `vcf_${chromosome}_${position}` : parts[2]).toLowerCase();
          const ref = parts[3].toUpperCase();
          const alt = parts[4].toUpperCase().split(',')[0];
          const formatFields = parts[8].split(':');
          const gtIdx = formatFields.indexOf('GT');
          if (gtIdx !== -1) {
            const sampleData = parts[9].split(':');
            const gt = sampleData[gtIdx].replace('|', '/');
            if (gt === '0/0') genotype = ref + ref;
            else if (gt === '0/1' || gt === '1/0') genotype = ref + alt;
            else if (gt === '1/1') genotype = alt + alt;
          }
        } else {
          // Fast skip for header lines
          if (lineCount === 1 && (line.toLowerCase().startsWith('rsid') || line.toLowerCase().startsWith('snp') || line.toLowerCase().startsWith('marker'))) continue;

          const parts = line.replace(/"/g, "").split(/[\t, ]+/);
          if (parts.length < 3) continue;

          rsid = parts[0].toLowerCase();
          chromosome = parts[1].toUpperCase().replace('CHR', '');
          position = parseInt(parts[2], 10);
          
          if (isNaN(position)) {
             position = parseInt(parts[3], 10);
             if (isNaN(position)) continue;
          }
          
          // Optimized genotype extraction
          const col3 = parts[3];
          const col4 = parts[4];
          if (col3 && col4 && col3.length === 1 && col4.length === 1) {
             if (col3 !== '0' && col3 !== '-' && col4 !== '0' && col4 !== '-') genotype = col3.toUpperCase() + col4.toUpperCase();
          } else if (col3) {
            genotype = col3.toUpperCase();
          }
        }

        if (genotype && genotype !== "--" && genotype !== "00" && genotype.length <= 2) {
          parsedData.push({ rsid, chromosome, position, genotype });
        }

        if (lineCount % 50000 === 0) {
          self.postMessage({ type: 'PROGRESS', current: lineCount, total: 0 }); // Total lines unknown
        }
      }

      if (parsedData.length === 0) throw new Error("No variants found. Unsupported format or malformed file.");

      self.postMessage({
        type: 'SUCCESS',
        result: parsedData,
        fileName,
        chip,
        format,
        snpCount: parsedData.length
      });

    } catch (error: any) {
      self.postMessage({
        type: 'ERROR',
        error: error.message || "An unexpected error occurred during parsing."
      });
    }
  }
};

