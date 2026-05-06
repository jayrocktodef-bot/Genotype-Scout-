import { parseRawDNA } from '../services/dnaParser';
import { matchSNPs } from '../services/snpMatcher';
import { predictYDNAHaplogroup, analyzeMtDNA } from '../services/haplogroupPredictor';
import { Y_DNA_TREE } from '../constants/haplogroups';
import { getMarkerAllowlist } from '../utils/markerAllowlist';

self.onmessage = async (e: MessageEvent) => {
  const { files } = e.data;
  
  try {
    const allowlist = getMarkerAllowlist();

    const parsedFiles = files.map((file: { text: string, name: string }) => {
      return { ...parseRawDNA(file.text, allowlist), name: file.name };
    });

    if (parsedFiles.length === 0) {
      self.postMessage({ type: 'ERROR', error: "No files parsed" });
      return;
    }

    let mergedSnpMap: Record<string, string> = {};
    let mergedSnpMetaMap: Record<string, { chrom: string, pos: number }> = {};
    let mergedYMap: Record<string, string> = {};
    let mergedMtMap: Record<string, string> = {};
    let chips: string[] = [];
    let names: string[] = [];
    
    const duplicateMarkers: Record<string, { count: number, files: string[], genotypes: Set<string> }> = {};

    parsedFiles.forEach((pf: any) => {
      names.push(pf.name);
      if (pf.chip && pf.chip !== "Unknown Chip") {
        chips.push(pf.chip);
      }
      
      Object.entries(pf.snpMap).forEach(([rsid, genotype]: [string, any]) => {
        if (mergedSnpMap[rsid]) {
          if (!duplicateMarkers[rsid]) {
            duplicateMarkers[rsid] = { 
              count: 1, 
              files: [names[names.length - 2]], 
              genotypes: new Set([mergedSnpMap[rsid]]) 
            };
          }
          duplicateMarkers[rsid].count++;
          duplicateMarkers[rsid].files.push(pf.name);
          duplicateMarkers[rsid].genotypes.add(genotype);

          if (genotype.length > mergedSnpMap[rsid].length) {
            mergedSnpMap[rsid] = genotype;
          }
        } else {
          mergedSnpMap[rsid] = genotype;
        }
      });

      Object.assign(mergedSnpMetaMap, pf.snpMetaMap);
      
      Object.entries(pf.yMap).forEach(([rsid, genotype]: [string, any]) => {
        if (!mergedYMap[rsid] || mergedYMap[rsid].length < genotype.length) {
          mergedYMap[rsid] = genotype;
        }
      });

      Object.assign(mergedMtMap, pf.mtMap);
    });

    const uniqueSnps = Object.keys(mergedSnpMap).length;
    const mergedName = parsedFiles.length > 1 ? `Merged Kit (${parsedFiles.length} files)` : parsedFiles[0].name;
    const mergedChip = chips.length > 0 ? Array.from(new Set(chips)).join(" + ") : "Unknown Chip";

    const results = matchSNPs(mergedSnpMap, mergedSnpMetaMap);
    const predictedYDNA = predictYDNAHaplogroup(mergedYMap, Y_DNA_TREE);
    const predictedMtDNA = analyzeMtDNA(mergedMtMap);

    self.postMessage({
      type: 'SUCCESS',
      payload: {
        name: mergedName,
        results,
        chip: mergedChip,
        snpCount: uniqueSnps,
        predictedYDNA,
        predictedMtDNA,
        mergedSnpMap,
        mergedMtMap
      }
    });
  } catch (err) {
    self.postMessage({
      type: 'ERROR',
      error: err instanceof Error ? err.message : "Unknown worker error"
    });
  }
};
