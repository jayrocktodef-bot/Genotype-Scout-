// src/scripts/sync-commercial-aims.ts
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const KIDD_55 = ["rs10756819", "rs10958548", "rs1108232", "rs1129038", "rs12203592", "rs12913832", "rs13214040", "rs1351394", "rs1426654", "rs1476413", "rs1544325", "rs1617682", "rs16891982", "rs17287498", "rs1800407", "rs1927914", "rs2066827", "rs2104511", "rs2184030", "rs2238289", "rs2315024", "rs2336873", "rs2395858", "rs2527993", "rs2814778", "rs3027440", "rs3122629", "rs3811801", "rs3827760", "rs444326", "rs4540055", "rs4821544", "rs4973341", "rs4988235", "rs5006884", "rs5757827", "rs6119471", "rs6133167", "rs682", "rs6995436", "rs7041", "rs7131232", "rs7251928", "rs738322", "rs7495174", "rs7671167", "rs7739969", "rs8038629", "rs849140", "rs8862", "rs910624", "rs9272376", "rs9829807", "rs9883255", "rs9951171"];

const SELDIN_128 = ["rs1008121", "rs10129215", "rs1042531", "rs10484725", "rs10521310", "rs10741285", "rs10776839", "rs10862024", "rs10865507", "rs10888503", "rs10931559", "rs11003444", "rs11024523", "rs11065987", "rs11083324", "rs11119561", "rs11211843", "rs11612053", "rs11618683", "rs11646276", "rs11736767", "rs12048995", "rs12057771", "rs12242137", "rs12255743", "rs12411516", "rs12519119", "rs12521575", "rs12543329", "rs12550186", "rs12558488", "rs12563300", "rs12702758", "rs12723223", "rs12725178", "rs12752179", "rs12771217", "rs12779603", "rs12781443", "rs12913832", "rs13028308", "rs13083697", "rs13104680", "rs13115450", "rs13222530", "rs1337424", "rs1351394", "rs1380629", "rs1385413", "rs1416952", "rs1418385", "rs1426654", "rs1433857", "rs1454530", "rs1459424", "rs1469581", "rs1469584", "rs1481119", "rs1544325", "rs1544983", "rs1551607", "rs1569420", "rs1600277", "rs1617682", "rs1617757", "rs1649987", "rs167527", "rs16891982", "rs16912386", "rs17132398", "rs17205166", "rs17287498", "rs17424610", "rs17441589", "rs1744654", "rs17457788", "rs17631341", "rs17711929", "rs17713481", "rs17726590", "rs1800407", "rs1819777", "rs1864195", "rs1878347", "rs1880476", "rs1883652", "rs1906252", "rs1927914", "rs2030509", "rs2064239", "rs2066827", "rs2071650", "rs2075677", "rs2104511", "rs2120610", "rs2227658", "rs2238289", "rs2240751", "rs2243550", "rs2252119", "rs2254425", "rs2268750", "rs2286950", "rs2294101", "rs2297127", "rs2336873", "rs2358908", "rs2372580", "rs2382813", "rs2395858", "rs2411933", "rs2432968", "rs2438183", "rs2527993", "rs2581024", "rs2581030", "rs2610580", "rs2615462", "rs2814778", "rs2814800", "rs2855800", "rs2891333", "rs3027440", "rs3122629", "rs346853", "rs3811801", "rs3827760", "rs444326"];

const ALL_AIMS = Array.from(new Set([...KIDD_55, ...SELDIN_128]));

export async function syncCommercialAims() {
    console.log(`🚀 Pulling weights for ${ALL_AIMS.length} Commercial AIMs...`);
    const db: Record<string, any> = {};

    for (const rsid of ALL_AIMS) {
        try {
            const response = await axios.get(`https://rest.ensembl.org/variation/human/${rsid}?content-type=application/json&pops=1`);
            const freqs = response.data.populations
                .filter((p: any) => p.population.includes('1000GENOMES:phase_3'))
                .reduce((acc: any, p: any) => {
                    const code = p.population.split(':').pop();
                    acc[code] = p.frequency;
                    return acc;
                }, {});
            
            db[rsid] = freqs;
            process.stdout.write('.'); // Progress indicator
            await new Promise(r => setTimeout(r, 200)); // Rate limit buffer
        } catch (e) {
            console.error(`\n❌ Failed: ${rsid}`);
        }
    }

    const dataDir = path.join(process.cwd(), 'src', 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    
    fs.writeFileSync(path.join(dataDir, 'commercial_aim_weights.json'), JSON.stringify(db, null, 2));
    console.log("\n✅ Commercial AIMs synced to src/data/commercial_aim_weights.json");
}

// If run directly
if (import.meta.url.endsWith(process.argv[1])) {
    syncCommercialAims();
}
