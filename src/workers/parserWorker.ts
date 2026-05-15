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
      const lines = text.split(/\r?\n/);
      const parsedData: any[] = [];

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line || line.startsWith('#')) continue;
        
        let rsid: string = "";
        let chromosome: string = "";
        let position: number = NaN;
        let genotype: string = "";

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
          const lowerLine = line.toLowerCase();
          if (lowerLine.startsWith('rsid') || lowerLine.startsWith('snp') || lowerLine.startsWith('marker')) continue;

          const parts = line.replace(/"/g, "").split(/[\t, ]+/);
          if (parts.length < 3) continue;

          rsid = parts[0].toLowerCase();
          chromosome = parts[1].toUpperCase().replace('CHR', '');
          position = parseInt(parts[2], 10);
          
          if (isNaN(position)) {
             position = parseInt(parts[3], 10);
             if (isNaN(position)) continue;
          }
          
          if (parts.length >= 5 && parts[3] && parts[4] && parts[3].length === 1 && parts[4].length === 1) {
            const a1 = parts[3].toUpperCase();
            const a2 = parts[4].toUpperCase();
            if (a1 !== '0' && a1 !== '-' && a2 !== '0' && a2 !== '-') genotype = a1 + a2;
          } else if (parts.length >= 4) {
            genotype = parts[3].toUpperCase();
          }
        }

        if (genotype && genotype !== "--" && genotype !== "00" && /^[ACTGDI]{1,2}$/i.test(genotype)) {
          parsedData.push({ rsid, chromosome, position, genotype });
        }

        if (i % 50000 === 0 && i > 0) {
          self.postMessage({ type: 'PROGRESS', current: i, total: lines.length });
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

