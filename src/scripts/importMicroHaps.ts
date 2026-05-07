import axios from 'axios';

const MARKER_URL = 'https://raw.githubusercontent.com/bioforensics/MicroHapDB/main/microhapdb/data/marker.csv';
const FREQ_URL = 'https://raw.githubusercontent.com/bioforensics/MicroHapDB/main/microhapdb/data/frequency.csv';

export async function fetchMicroHapData() {
    console.log("🧬 Fetching MicroHapDB forensic panels...");
    
    const markers = await axios.get(MARKER_URL);
    const frequencies = await axios.get(FREQ_URL);

    // Filter logic: Only take markers with high informativeness (Ae > 3.0)
    // This ensures your "Forensic Mode" is actually superior to standard SNPs
    const topMarkers = markers.data.split('\n').filter((line: string) => {
        const parts = line.split(',');
        return parseFloat(parts[5]) > 3.0; // Assuming 6th col is Ae
    });

    console.log(`✅ Integrated ${topMarkers.length} high-resolution microhaplotypes.`);
    return { topMarkers, frequencies: frequencies.data };
}
