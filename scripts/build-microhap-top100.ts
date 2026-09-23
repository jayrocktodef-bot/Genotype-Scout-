import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

async function buildMicroHapTop100() {
  console.log('Fetching MicroHapDB marker.csv...');
  const markerUrl = 'https://raw.githubusercontent.com/bioforensics/microhapdb/master/microhapdb/data/marker.csv';
  const markerRes = await fetch(markerUrl);
  if (!markerRes.ok) throw new Error(`Failed to fetch marker.csv: ${markerRes.statusText}`);
  const markerText = await markerRes.text();
  const markerLines = markerText.split('\n').filter(l => l.includes(','));

  const markers: Record<string, { id: string; chrom: string; pos: number; snps: string[]; source: string }> = {};
  for (let i = 1; i < markerLines.length; i++) {
    const cols = markerLines[i].split(',');
    const id = cols[0];
    const chrom = cols[3].replace(/^chr/i, '');
    const pos = parseInt(cols[4], 10) || 0;
    const rsidsStr = cols[8] || '';
    const source = cols[9] || '';
    if (!rsidsStr.includes('rs')) continue;
    const snps = rsidsStr.split(';').map(s => s.trim()).filter(s => s.startsWith('rs'));
    // Select standard forensic microhaplotypes with 2 to 4 SNPs
    if (snps.length >= 2 && snps.length <= 4) {
      markers[id] = { id, chrom, pos, snps, source };
    }
  }
  console.log(`Parsed ${Object.keys(markers).length} microhaplotype markers with 2-4 rsIDs.`);

  console.log('Fetching MicroHapDB frequency.csv.gz...');
  const freqUrl = 'https://raw.githubusercontent.com/bioforensics/microhapdb/master/microhapdb/data/frequency.csv.gz';
  const freqRes = await fetch(freqUrl);
  if (!freqRes.ok) throw new Error(`Failed to fetch frequency.csv.gz: ${freqRes.statusText}`);
  const freqBuf = Buffer.from(await freqRes.arrayBuffer());
  const freqText = zlib.gunzipSync(freqBuf).toString();
  const freqLines = freqText.split('\n');

  // Map 1000 Genomes / ALFRED populations to continental superpopulations
  const popToSuper: Record<string, string> = {
    YRI: 'AFR', LWK: 'AFR', GWD: 'AFR', MSL: 'AFR', ESN: 'AFR', ASW: 'AFR', ACB: 'AFR',
    CEU: 'EUR', TSI: 'EUR', FIN: 'EUR', GBR: 'EUR', IBS: 'EUR',
    CHB: 'EAS', JPT: 'EAS', CHS: 'EAS', CDX: 'EAS', KHV: 'EAS',
    GIH: 'SAS', PJL: 'SAS', BEB: 'SAS', STU: 'SAS', ITU: 'SAS',
    MXL: 'AMR', PUR: 'AMR', CLM: 'AMR', PEL: 'AMR'
  };

  const markerHapFreqs: Record<string, Record<string, Record<string, number[]>>> = {};

  for (let i = 1; i < freqLines.length; i++) {
    const line = freqLines[i];
    if (!line) continue;
    const cols = line.split(',');
    const mId = cols[0];
    if (!markers[mId]) continue;

    const pop = cols[1];
    const superPop = popToSuper[pop] || (['AFR', 'EUR', 'EAS', 'SAS', 'AMR'].includes(pop) ? pop : null);
    if (!superPop) continue;

    const rawAllele = cols[2];
    const hapString = rawAllele.replace(/:/g, '').toUpperCase();
    const freq = parseFloat(cols[3]);
    if (isNaN(freq)) continue;

    if (!markerHapFreqs[mId]) markerHapFreqs[mId] = {};
    if (!markerHapFreqs[mId][superPop]) markerHapFreqs[mId][superPop] = {};
    if (!markerHapFreqs[mId][superPop][hapString]) markerHapFreqs[mId][superPop][hapString] = [];
    markerHapFreqs[mId][superPop][hapString].push(freq);
  }

  const kernelList: any[] = [];
  const superPops = ['AFR', 'EUR', 'EAS', 'SAS', 'AMR'];

  for (const mId in markers) {
    const freqData = markerHapFreqs[mId];
    if (!freqData) continue;

    // Require representation in at least 4 superpopulations
    const availableSupers = Object.keys(freqData);
    if (availableSupers.length < 4) continue;

    const weights: Record<string, Record<string, number>> = {};
    for (const sp of superPops) {
      if (!freqData[sp]) continue;
      weights[sp] = {};
      for (const hap in freqData[sp]) {
        const arr = freqData[sp][hap];
        const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
        weights[sp][hap] = Math.round(avg * 1000) / 1000;
      }
    }

    // Calculate variance / differentiation power across superpopulations
    const allHaps = new Set<string>();
    superPops.forEach(sp => {
      if (weights[sp]) Object.keys(weights[sp]).forEach(h => allHaps.add(h));
    });

    let totalVar = 0;
    allHaps.forEach(h => {
      const vals = superPops.map(sp => (weights[sp] && weights[sp][h]) || 0);
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const v = vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length;
      totalVar += v;
    });

    const m = markers[mId];
    const isKidd = m.source.includes('Kidd') || m.id.includes('KK');
    const priority = isKidd ? 2.0 : 1.0;
    const chipBonus = m.snps.length <= 3 ? 1.4 : 1.0;
    const score = totalVar * priority * chipBonus;

    kernelList.push({
      id: m.id,
      chrom: m.chrom,
      pos: m.pos,
      snps: m.snps,
      score,
      weights
    });
  }

  kernelList.sort((a, b) => b.score - a.score);

  const top120 = kernelList.slice(0, 120).map(({ score, ...rest }) => rest);
  console.log(`Generated Top 120 forensic microhaplotypes!`);
  console.log(`Sample entry: ${top120[0].id} on chr${top120[0].chrom}, SNPs: [${top120[0].snps.join(', ')}]`);

  const outputPath = path.resolve(process.cwd(), 'src/data/raw_aims/microhap_top100_kernel.json');
  fs.writeFileSync(outputPath, JSON.stringify(top120, null, 2));
  console.log(`Wrote verified kernel to ${outputPath}`);
}

buildMicroHapTop100().catch(console.error);
