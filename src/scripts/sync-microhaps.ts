// src/scripts/sync-microhaps.ts
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const BASE_URL = "https://raw.githubusercontent.com/bioforensics/microhapdb/master/microhapdb/data/";

function parseCSV(content: string) {
    const lines = content.trim().split('\n');
    if (lines.length === 0) return [];
    
    // Simple CSV parser (doesn't handle quotes perfectly but usually enough for these files)
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((header, i) => {
            obj[header] = values[i]?.trim();
        });
        return obj;
    });
}

export async function syncMicroHapDB() {
    console.log("🧬 Cannibalizing MicroHapDB for Forensic-grade resolution...");

    try {
        console.log("📡 Fetching marker definitions...");
        const markersResp = await axios.get(`${BASE_URL}marker.csv`);
        console.log("📡 Fetching population frequencies...");
        const freqsResp = await axios.get(`${BASE_URL}frequency.csv`);

        const markers = parseCSV(markersResp.data);
        const freqs = parseCSV(freqsResp.data);

        console.log(`📊 Processing ${markers.length} markers and ${freqs.length} frequency records...`);

        // Calculate Ae per marker per population
        const markerPopFreqs: Record<string, Record<string, number[]>> = {};

        freqs.forEach((f: any) => {
            const mId = f.MarkerID;
            const pop = f.Population;
            const freq = parseFloat(f.Frequency);
            if (isNaN(freq)) return;
            
            if (!markerPopFreqs[mId]) markerPopFreqs[mId] = {};
            if (!markerPopFreqs[mId][pop]) markerPopFreqs[mId][pop] = [];
            markerPopFreqs[mId][pop].push(freq);
        });

        const markerAis: Record<string, number> = {};

        Object.entries(markerPopFreqs).forEach(([mId, pops]) => {
            let totalAe = 0;
            let popCount = 0;

            Object.entries(pops).forEach(([pop, fs]) => {
                const sumSq = fs.reduce((sum, p) => sum + p * p, 0);
                if (sumSq === 0) return;
                const ae = 1 / sumSq;
                totalAe += ae;
                popCount++;
            });

            if (popCount > 0) {
                markerAis[mId] = totalAe / popCount;
            }
        });

        // Sort by Global Mean Ae and take top 100
        const sortedIds = Object.keys(markerAis)
            .sort((a, b) => markerAis[b] - markerAis[a])
            .slice(0, 100);

        const kernel = sortedIds.map(mId => {
            const markerDef = markers.find((m: any) => m.ID === mId);
            const mFreqs = freqs.filter((f: any) => f.MarkerID === mId);
            
            const popWeights: Record<string, Record<string, number>> = {};
            mFreqs.forEach((f: any) => {
                if (!popWeights[f.Population]) popWeights[f.Population] = {};
                popWeights[f.Population][f.Haplotype] = parseFloat(f.Frequency);
            });

            return {
                id: mId,
                chrom: markerDef.Chrom,
                pos: markerDef.Start,
                snps: markerDef.SNPs.split(',').map((s: string) => s.trim()),
                global_ae: markerAis[mId],
                weights: popWeights
            };
        });

        const dataDir = path.join(process.cwd(), 'src', 'data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

        fs.writeFileSync(path.join(dataDir, 'microhap_top100_kernel.json'), JSON.stringify(kernel, null, 2));
        console.log(`✅ Success: Generated Forensic Kernel with ${kernel.length} markers at src/data/microhap_top100_kernel.json`);
    } catch (err) {
        console.error("❌ Failed to sync MicroHapDB:", err);
    }
}

// Check if run directly (ESM compatible check)
if (import.meta.url.includes(path.basename(process.argv[1] || ''))) {
    syncMicroHapDB();
}
