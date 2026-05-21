import fs from 'fs';
import path from 'path';

// Output summary files
const myRegionsPath = './my_regions.txt';
const myAimsPath = './my_aims.txt';

// --- Phase 1: Build the coordinate lookup from our index files ---
const coordsMap = new Map(); // rsid -> { chrom, pos }

// 1. Try to load positions from graf_10k_index.json
const grafIndexFile = path.resolve('./src/data/raw_aims/graf_10k_index.json');
if (fs.existsSync(grafIndexFile)) {
    console.log(`Loading coordinates from ${grafIndexFile}...`);
    try {
        const grafData = JSON.parse(fs.readFileSync(grafIndexFile, 'utf8'));
        for (const [rsid, info] of Object.entries(grafData)) {
            const cleanRsid = rsid.toLowerCase().trim();
            if (info.chr && info.pos) {
                coordsMap.set(cleanRsid, { chrom: info.chr, pos: info.pos });
            }
        }
    } catch (e) {
        console.warn(`Could not parse GRAF-10k index:`, e);
    }
}

// 2. Try to load positions from 1000genomes_frequencies.json
const genomesFile = path.resolve('./src/data/reference/1000genomes_frequencies.json');
if (fs.existsSync(genomesFile)) {
    console.log(`Loading coordinates from ${genomesFile}...`);
    try {
        const genomesData = JSON.parse(fs.readFileSync(genomesFile, 'utf8'));
        for (const [rsid, info] of Object.entries(genomesData)) {
            if (rsid.startsWith('_')) continue;
            const cleanRsid = rsid.toLowerCase().trim();
            if (info.chromosome && info.position) {
                coordsMap.set(cleanRsid, { chrom: info.chromosome, pos: info.position });
            }
        }
    } catch (e) {
        console.warn(`Could not parse 1000 genomes file:`, e);
    }
}

console.log(`Initialized database with ${coordsMap.size} unique SNP coordinates.`);

// --- Phase 2: Gather all unique candidate rsids from the project ---
const candidateRsids = new Set();

// Helper to sanitize research keys
function addRsid(raw) {
    if (!raw || typeof raw !== 'string') return;
    let clean = raw.trim().toLowerCase();
    // Strip trailing population tags (e.g. rs12345_afr, rs12345_eur)
    const suffixIndex = clean.indexOf('_');
    if (suffixIndex > 0) {
        clean = clean.substring(0, suffixIndex);
    }
    if (clean.startsWith('rs')) {
        candidateRsids.add(clean);
    }
}

// 1. Read from master_aims_normalized.json
const masterAimsPath = path.resolve('./src/data/master_aims_normalized.json');
if (fs.existsSync(masterAimsPath)) {
    console.log(`Gathering rsIDs from ${masterAimsPath}...`);
    try {
        const aimsData = JSON.parse(fs.readFileSync(masterAimsPath, 'utf8'));
        for (const key of Object.keys(aimsData)) {
            addRsid(key);
            if (aimsData[key].rsid) {
                addRsid(aimsData[key].rsid);
            }
        }
    } catch (e) {
        console.warn(`Could not read master aims:`, e);
    }
}

// 2. Read from aims_and_traits.json (nested)
const aimsTraitsFile = path.resolve('./src/data/reference/aims_and_traits.json');
if (fs.existsSync(aimsTraitsFile)) {
    console.log(`Gathering rsIDs from ${aimsTraitsFile}...`);
    try {
        const traitsData = JSON.parse(fs.readFileSync(aimsTraitsFile, 'utf8'));
        for (const [category, item] of Object.entries(traitsData)) {
            if (category.startsWith('_')) continue;
            for (const rsid of Object.keys(item)) {
                addRsid(rsid);
            }
        }
    } catch (e) {
        console.warn(`Could not read wellness traits:`, e);
    }
}

// 3. Read from snps.json
const snpsFile = path.resolve('./src/data/reference/snps.json');
if (fs.existsSync(snpsFile)) {
    console.log(`Gathering rsIDs from ${snpsFile}...`);
    try {
        const snpsData = JSON.parse(fs.readFileSync(snpsFile, 'utf8'));
        if (Array.isArray(snpsData)) {
            for (const item of snpsData) {
                if (item.rsid) addRsid(item.rsid);
                if (item.markerId) addRsid(item.markerId);
            }
        }
    } catch (e) {
        console.warn(`Could not read snps.json:`, e);
    }
}

// 4. Read from v5_markers_master.json
const v5File = path.resolve('./src/data/v5_markers_master.json');
if (fs.existsSync(v5File)) {
    console.log(`Gathering rsIDs from ${v5File}...`);
    try {
        const v5Data = JSON.parse(fs.readFileSync(v5File, 'utf8'));
        if (Array.isArray(v5Data)) {
            for (const item of v5Data) {
                if (item.rsid) addRsid(item.rsid);
            }
        }
    } catch (e) {
        console.warn(`Could not read v5 markers:`, e);
    }
}

console.log(`Found ${candidateRsids.size} unique candidate rsIDs across system databases.`);

// --- Phase 3: Resolve coordinates and output files ---
let regionsOutput = "";
let rsidOutput = "";
let resolvedCount = 0;

// Sort rsids naturally
const rsidList = Array.from(candidateRsids).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''), 10);
    const numB = parseInt(b.replace(/\D/g, ''), 10);
    return numA - numB;
});

for (const rsid of rsidList) {
    const coords = coordsMap.get(rsid);
    if (coords) {
        regionsOutput += `${coords.chrom}\t${coords.pos}\n`;
        rsidOutput += `${rsid}\n`;
        resolvedCount++;
    }
}

fs.writeFileSync(myRegionsPath, regionsOutput.trim());
fs.writeFileSync(myAimsPath, rsidOutput.trim());

console.log(`\nSuccess! Extracted and resolved coordinates for ${resolvedCount} out of ${candidateRsids.size} candidate markers.`);
console.log(`- my_regions.txt (tab-separated chromosome & position) has been generated.`);
console.log(`- my_aims.txt (clean single-column rsid list) has been generated.`);
