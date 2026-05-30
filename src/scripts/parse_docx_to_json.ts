import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

interface AimMarker {
  rsid: string;
  chromosome: string;
  position: number;
}

async function main() {
  try {
    const docxPath = path.resolve('New World Aims.docx');
    console.log('Reading DOCX from:', docxPath);
    const data = fs.readFileSync(docxPath);
    
    const zip = await JSZip.loadAsync(data);
    const docXmlFile = zip.file('word/document.xml');
    if (!docXmlFile) {
      console.error('word/document.xml not found!');
      return;
    }

    const documentXml = await docXmlFile.async('text');
    console.log('Document XML loaded. Length:', documentXml.length);

    // Split by </w:tr> to separate rows
    const rowSegments = documentXml.split('</w:tr>');
    console.log('Raw row segments parsed:', rowSegments.length);

    const parsedRows: string[][] = [];

    // Process rows
    for (const rowSeg of rowSegments) {
      if (!rowSeg.includes('<w:tr')) continue;

      const trStart = rowSeg.indexOf('<w:tr');
      const trContent = rowSeg.substring(trStart);

      // Split row by </w:tc> to separate cells
      const cellSegments = trContent.split('</w:tc>');
      const cells: string[] = [];

      for (const cellSeg of cellSegments) {
        if (!cellSeg.includes('<w:tc')) continue;

        const tcStart = cellSeg.indexOf('<w:tc');
        const tcContent = cellSeg.substring(tcStart);

        // Strip ALL XML tags to get pure plaintext
        const cleanText = tcContent.replace(/<[^>]+>/g, '').trim();
        cells.push(cleanText);
      }

      if (cells.length > 0) {
        parsedRows.push(cells);
      }
    }

    console.log(`Parsed ${parsedRows.length} active rows from table.`);

    // Extract European Substructure dataset for deduplication
    const europeanSubstructPath = path.resolve('src/data/raw_aims/european_substruct.json');
    let europeanMarkers: AimMarker[] = [];
    if (fs.existsSync(europeanSubstructPath)) {
      const euroData = fs.readFileSync(europeanSubstructPath, 'utf8');
      europeanMarkers = JSON.parse(euroData);
      console.log(`Loaded ${europeanMarkers.length} existing European substruct markers.`);
    } else {
      console.warn(`European substruct file not found at ${europeanSubstructPath}! Duplicate checking will be skipped.`);
    }

    // Build unique set of European rsids (all lowercased for safe comparison)
    const europeanRsids = new Set<string>();
    for (const marker of europeanMarkers) {
      europeanRsids.add(marker.rsid.toLowerCase().trim());
    }

    // Process and validate DOCX markers
    const newWorldMarkersMap = new Map<string, AimMarker>();
    let invalidRowsCount = 0;
    let internalDuplicatesCount = 0;
    let europeanOverlapCount = 0;

    for (let i = 1; i < parsedRows.length; i++) {
      const row = parsedRows[i];
      if (row.length < 3) {
        invalidRowsCount++;
        continue;
      }

      const rsidRaw = row[0].toLowerCase().trim();
      const chrRaw = row[1].trim();
      const posRaw = row[2].trim();

      // Basic regex check: rsid must start with 'rs' followed by digits
      if (!/^rs\d+$/.test(rsidRaw)) {
        invalidRowsCount++;
        continue;
      }

      const position = parseInt(posRaw, 10);
      if (isNaN(position) || position <= 0 || !chrRaw) {
        invalidRowsCount++;
        continue;
      }

      const marker: AimMarker = {
        rsid: rsidRaw,
        chromosome: chrRaw,
        position: position
      };

      // Check external overlap against European Aims
      if (europeanRsids.has(rsidRaw)) {
        europeanOverlapCount++;
        continue; // Exclude to avoid overlap
      }

      // Check internal duplicate
      if (newWorldMarkersMap.has(rsidRaw)) {
        internalDuplicatesCount++;
        continue;
      }

      newWorldMarkersMap.set(rsidRaw, marker);
    }

    const finalMarkers = Array.from(newWorldMarkersMap.values());
    console.log('\n--- PARSING & DEDUPLICATION REPORT ---');
    console.log(`Total table lines evaluated: ${parsedRows.length - 1}`);
    console.log(`Invalid / non-marker rows: ${invalidRowsCount}`);
    console.log(`Overlaps with European substruct: ${europeanOverlapCount}`);
    console.log(`Internal duplicates within DOCX: ${internalDuplicatesCount}`);
    console.log(`Total unique New World markers remaining: ${finalMarkers.length}`);
    console.log('---------------------------------------\n');

    // Create target directory if it doesn't exist
    const outputDir = path.resolve('src/data/raw_aims');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'new_world_aims.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalMarkers, null, 2), 'utf8');
    console.log(`Successfully created and wrote ${finalMarkers.length} markers to: ${outputPath}`);

  } catch (err) {
    console.error('Error in parse process:', err);
  }
}

main();
