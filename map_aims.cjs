
const ANCHOR_AIMS = require('./temp_parse.js');

const userJson = [
  { "rsid": "rs10456201", "target_alleles": ["C"], "frequencies": { "AFR": 0.88, "EUR": 0.02, "EAS": 0.01, "AMR": 0.01 } },
  { "rsid": "rs10456202", "target_alleles": ["T"], "frequencies": { "AFR": 0.75, "EUR": 0.05, "EAS": 0.01, "AMR": 0.01 } },
  { "rsid": "rs10456203", "target_alleles": ["A"], "frequencies": { "AFR": 0.7, "EUR": 0.08, "EAS": 0.01, "AMR": 0.01 } },
  { "rsid": "rs1800414", "target_alleles": ["C"], "frequencies": { "AFR": 0.95, "EUR": 0.05, "EAS": 0.9, "AMR": 0.1 } },
  { "rsid": "rs2862", "target_alleles": ["A"], "frequencies": { "AFR": 0.9, "EUR": 0.1, "EAS": 0.05, "AMR": 0.1 } },
  { "rsid": "rs3340", "target_alleles": ["A"], "frequencies": { "AFR": 0.8, "EUR": 0.2, "EAS": 0.1, "AMR": 0.2 } },
  { "rsid": "rs1572318", "target_alleles": ["A"], "frequencies": { "AFR": 0.95, "EUR": 0.01, "EAS": 0.01, "AMR": 0.01 } },
  { "rsid": "rs10456206", "target_alleles": ["G"], "frequencies": { "AFR": 0.9, "EUR": 0.05, "EAS": 0.01, "AMR": 0.01 } },
  { "rsid": "rs10456207", "target_alleles": ["T"], "frequencies": { "AFR": 0.85, "EUR": 0.1, "EAS": 0.01, "AMR": 0.01 } },
  { "rsid": "rs1426654", "target_alleles": ["G"], "frequencies": { "AFR": 0.95, "EUR": 0.05, "EAS": 0.05, "AMR": 0.1 } },
  { "rsid": "rs16891982", "target_alleles": ["C"], "frequencies": { "AFR": 0.98, "EUR": 0.02, "EAS": 0.01, "AMR": 0.05 } },
  { "rsid": "rs12913832", "target_alleles": ["G"], "frequencies": { "AFR": 0.05, "EUR": 0.85, "EAS": 0.05, "AMR": 0.1 } },
  { "rsid": "rs1042602", "target_alleles": ["A"], "frequencies": { "AFR": 0.1, "EUR": 0.9, "EAS": 0.1, "AMR": 0.1 } },
  { "rsid": "rs1800407", "target_alleles": ["A"], "frequencies": { "AFR": 0.92, "EUR": 0.08, "EAS": 0.05, "AMR": 0.1 } },
  { "rsid": "rs10456218", "target_alleles": ["G"], "frequencies": { "AFR": 0.98, "EUR": 0.01, "EAS": 0.01, "AMR": 0.05 } },
  { "rsid": "rs10456219", "target_alleles": ["C"], "frequencies": { "AFR": 0.97, "EUR": 0.01, "EAS": 0.01, "AMR": 0.04 } },
  { "rsid": "rs10456220", "target_alleles": ["T"], "frequencies": { "AFR": 0.96, "EUR": 0.01, "EAS": 0.01, "AMR": 0.05 } },
  { "rsid": "rs10456221", "target_alleles": ["A"], "frequencies": { "AFR": 0.65, "EUR": 0.1, "EAS": 0.01, "AMR": 0.01 } },
  { "rsid": "rs10456222", "target_alleles": ["G"], "frequencies": { "AFR": 0.72, "EUR": 0.05, "EAS": 0.01, "AMR": 0.01 } },
  { "rsid": "rs3827760", "target_alleles": ["G"], "frequencies": { "AFR": 0.01, "EUR": 0.01, "EAS": 0.95, "AMR": 0.9 } },
  { "rsid": "rs671", "target_alleles": ["A"], "frequencies": { "AFR": 0.001, "EUR": 0.001, "EAS": 0.25, "AMR": 0.01 } },
  { "rsid": "rs1229984", "target_alleles": ["A"], "frequencies": { "AFR": 0.01, "EUR": 0.05, "EAS": 0.7, "AMR": 0.05 } },
  { "rsid": "rs17822931", "target_alleles": ["A"], "frequencies": { "AFR": 0.05, "EUR": 0.05, "EAS": 0.95, "AMR": 0.9 } },
  { "rsid": "rs1800414", "target_alleles": ["C"], "frequencies": { "AFR": 0.95, "EUR": 0.05, "EAS": 0.9, "AMR": 0.1 } },
  { "rsid": "rs1869901", "target_alleles": ["G"], "frequencies": { "AFR": 0.01, "AMR": 0.02, "EAS": 0.92, "EUR": 0.01 } },
  { "rsid": "rs1048943", "target_alleles": ["G"], "frequencies": { "AFR": 0.01, "AMR": 0.02, "EAS": 0.94, "EUR": 0.01 } },
  { "rsid": "rs7330728", "target_alleles": ["T"], "frequencies": { "AFR": 0.02, "AMR": 0.05, "EAS": 0.85, "EUR": 0.01 } },
  { "rsid": "rs10456199", "target_alleles": ["G"], "frequencies": { "AFR": 0.01, "AMR": 0.02, "EAS": 0.95, "EUR": 0.01 } },
  { "rsid": "rs10456200", "target_alleles": ["A"], "frequencies": { "AFR": 0.01, "AMR": 0.01, "EAS": 0.98, "EUR": 0.01 } },
  { "rsid": "rs1129038", "target_alleles": ["A"], "frequencies": { "AFR": 0.02, "EUR": 0.9, "EAS": 0.02, "AMR": 0.1 } },
  { "rsid": "rs1805007", "target_alleles": ["T"], "frequencies": { "AFR": 0, "EUR": 0.1, "EAS": 0, "AMR": 0.01 } },
  { "rsid": "rs12916300", "target_alleles": ["G"], "frequencies": { "AFR": 0.05, "EUR": 0.85, "EAS": 0.05, "AMR": 0.1 } },
  { "rsid": "rs4988235", "target_alleles": ["T"], "frequencies": { "AFR": 0.25, "EUR": 0.8, "EAS": 0.01, "AMR": 0.05 } },
  { "rsid": "rs12203592", "target_alleles": ["C"], "frequencies": { "AFR": 0.04, "AMR": 0.08, "EAS": 0.04, "EUR": 0.88 } },
  { "rsid": "rs2470102", "target_alleles": ["T"], "frequencies": { "EUR": 0.9, "AFR": 0.05, "EAS": 0.01, "AMR": 0.05 } },
  { "rsid": "rs909525", "target_alleles": ["T"], "frequencies": { "EUR": 0.95, "AFR": 0.01, "EAS": 0.01, "AMR": 0.01 } },
  { "rsid": "rs2303627", "target_alleles": ["A"], "frequencies": { "EUR": 0.9, "AFR": 0.05, "EAS": 0.01, "AMR": 0.05 } },
  { "rsid": "rs16891982", "target_alleles": ["G"], "frequencies": { "EUR": 0.98, "AFR": 0.02, "EAS": 0.01, "AMR": 0.05 } },
  { "rsid": "rs1426654", "target_alleles": ["A"], "frequencies": { "EUR": 0.99, "AFR": 0.05, "EAS": 0.05, "AMR": 0.15 } },
  { "rsid": "rs1042602", "target_alleles": ["A"], "frequencies": { "EUR": 0.90, "AFR": 0.10, "EAS": 0.10, "AMR": 0.10 } },
  { "rsid": "rs1126809", "target_alleles": ["A"], "frequencies": { "EUR": 0.85, "AFR": 0.01, "EAS": 0.01, "AMR": 0.05 } },
  { "rsid": "rs1667394", "target_alleles": ["T"], "frequencies": { "EUR": 0.88, "AFR": 0.02, "EAS": 0.05, "AMR": 0.10 } },
  { "rsid": "rs11568818", "target_alleles": ["A"], "frequencies": { "EUR": 0.15, "AFR": 0.0, "EAS": 0.0, "AMR": 0.01 } },
  { "rsid": "rs2814778", "target_alleles": ["T"], "frequencies": { "EUR": 0.99, "AFR": 0.01, "EAS": 0.99, "AMR": 0.90 } },
  { "rsid": "rs4778138", "target_alleles": ["A"], "frequencies": { "EUR": 0.85, "AFR": 0.02, "EAS": 0.02, "AMR": 0.10 } },
  { "rsid": "rs2228479", "target_alleles": ["A"], "frequencies": { "EUR": 0.70, "AFR": 0.05, "EAS": 0.05, "AMR": 0.15 } },
  { "rsid": "rs1048661", "target_alleles": ["G"], "frequencies": { "EUR": 0.80, "AFR": 0.10, "EAS": 0.10, "AMR": 0.15 } },
  { "rsid": "rs12821256", "target_alleles": ["A"], "frequencies": { "AFR": 0.28, "AMR": 0.1, "EAS": 0.2, "EUR": 0.58 } },
  { "rsid": "rs9999903", "target_alleles": ["C"], "frequencies": { "AFR": 0.3, "AMR": 0.05, "EAS": 0.02, "EUR": 0.15 } },
  { "rsid": "rs6119471", "target_alleles": ["T"], "frequencies": { "AFR": 0.38, "AMR": 0.06, "EAS": 0.04, "EUR": 0.22 } },
  { "rsid": "rs7722456", "target_alleles": ["A"], "frequencies": { "AFR": 0.42, "AMR": 0.05, "EAS": 0.04, "EUR": 0.18 } },
  { "rsid": "rs10911063", "target_alleles": ["T"], "frequencies": { "AFR": 0.12, "AMR": 0.02, "EAS": 0.01, "EUR": 0.08 } },
  { "rsid": "rs10911061", "target_alleles": ["C"], "frequencies": { "AFR": 0.1, "AMR": 0.01, "EAS": 0.01, "EUR": 0.06 } },
  { "rsid": "rs10456208", "target_alleles": ["C"], "frequencies": { "AFR": 0.35, "EUR": 0.1, "EAS": 0.01, "AMR": 0.05 } },
  { "rsid": "rs10456211", "target_alleles": ["T"], "frequencies": { "AFR": 0.32, "EUR": 0.08, "EAS": 0.01, "AMR": 0.04 } },
  { "rsid": "rs10456214", "target_alleles": ["G"], "frequencies": { "AFR": 0.3, "EUR": 0.06, "EAS": 0.01, "AMR": 0.03 } },
  { "rsid": "rs9000318", "target_alleles": ["A"], "frequencies": { "AFR": 0.15, "EUR": 0.25, "EAS": 0.02, "AMR": 0.05 } },
  { "rsid": "rs9000320", "target_alleles": ["C"], "frequencies": { "AFR": 0.25, "EUR": 0.18, "EAS": 0.03, "AMR": 0.06 } },
  { "rsid": "rs9000322", "target_alleles": ["A"], "frequencies": { "AFR": 0.2, "EUR": 0.18, "EAS": 0.02, "AMR": 0.05 } },
  { "rsid": "rs9000324", "target_alleles": ["C"], "frequencies": { "AFR": 0.15, "EUR": 0.2, "EAS": 0.02, "AMR": 0.04 } },
  { "rsid": "rs9000326", "target_alleles": ["A"], "frequencies": { "AFR": 0.18, "EUR": 0.22, "EAS": 0.02, "AMR": 0.05 } },
  { "rsid": "rs10456248", "target_alleles": ["T"], "frequencies": { "NAFR": 0.95, "AFR": 0.15, "EUR": 0.05, "EAS": 0.01 } },
  { "rsid": "rs10456249", "target_alleles": ["G"], "frequencies": { "NAFR": 0.88, "AFR": 0.25, "EUR": 0.02, "EAS": 0.01 } },
  { "rsid": "rs10456250", "target_alleles": ["C"], "frequencies": { "NAFR": 0.92, "AFR": 0.1, "EUR": 0.15, "EAS": 0.01 } },
  { "rsid": "rs10456251", "target_alleles": ["A"], "frequencies": { "NAFR": 0.9, "AFR": 0.2, "EUR": 0.05, "EAS": 0.01 } },
  { "rsid": "rs9282541", "target_alleles": ["A"], "frequencies": { "AFR": 0.01, "EUR": 0.01, "EAS": 0.01, "AMR": 0.15 } },
  { "rsid": "rs174570", "target_alleles": ["T"], "frequencies": { "AFR": 0.12, "EUR": 0.25, "EAS": 0.65, "AMR": 0.92 } },
  { "rsid": "rs20424", "target_alleles": ["T"], "frequencies": { "AFR": 0.01, "EUR": 0.01, "EAS": 0.05, "AMR": 0.45 } },
  { "rsid": "rs13342232", "target_alleles": ["T"], "frequencies": { "AFR": 0.01, "EUR": 0.01, "EAS": 0.01, "AMR": 0.5 } },
  { "rsid": "rs10456217", "target_alleles": ["C"], "frequencies": { "AFR": 0.01, "EUR": 0.05, "EAS": 0.3, "AMR": 0.85 } },
  { "rsid": "rs2144915", "target_alleles": ["G"], "frequencies": { "AFR": 0.01, "EUR": 0.01, "EAS": 0.05, "AMR": 0.95 } },
  { "rsid": "rs1800497", "target_alleles": ["T"], "frequencies": { "AFR": 0.3, "EUR": 0.2, "EAS": 0.3, "AMR": 0.7 } },
  { "rsid": "rs80356779", "target_alleles": ["T"], "frequencies": { "AMR": 0.95, "EAS": 0.05, "EUR": 0.01, "AFR": 0.01 } },
  { "rsid": "rs174583", "target_alleles": ["T"], "frequencies": { "AMR": 0.9, "EAS": 0.6, "EUR": 0.2, "AFR": 0.1 } },
  { "rsid": "rs11215559", "target_alleles": ["A"], "frequencies": { "AMR": 0.95, "EAS": 0.02, "EUR": 0.01, "AFR": 0.01 } },
  { "rsid": "rs12149627", "target_alleles": ["A"], "frequencies": { "AMR": 0.85, "EAS": 0.1, "AFR": 0.05, "EUR": 0.1 } },
  { "rsid": "rs4845571", "target_alleles": ["C"], "frequencies": { "AMR": 0.9, "EAS": 0.05, "AFR": 0.02, "EUR": 0.05 } },
  { "rsid": "rs1426654", "target_alleles": ["A"], "frequencies": { "AFR": 0.05, "EUR": 0.9, "EAS": 0.05, "AMR": 0.15 } },
  { "rsid": "rs1229984", "target_alleles": ["A"], "frequencies": { "AFR": 0.01, "EUR": 0.05, "EAS": 0.7, "AMR": 0.05 } },
  { "rsid": "rs334", "target_alleles": ["T"], "frequencies": { "AFR": 0.15, "EUR": 0.01, "EAS": 0, "AMR": 0.05 } },
  { "rsid": "rs4988235", "target_alleles": ["T"], "frequencies": { "AFR": 0.25, "EUR": 0.8, "EAS": 0.01, "AMR": 0.05 } },
  { "rsid": "rs1800414", "target_alleles": ["C"], "frequencies": { "AFR": 0.95, "EUR": 0.05, "EAS": 0.9, "AMR": 0.1 } },
  { "rsid": "rs2816030", "target_alleles": ["A"], "frequencies": { "SAS": 0.8, "EUR": 0.1, "AFR": 0.05, "EAS": 0.05 } },
  { "rsid": "rs12146713", "target_alleles": ["G"], "frequencies": { "SAS": 0.9, "EUR": 0.05, "AFR": 0.01, "EAS": 0.01 } },
  { "rsid": "rs11030104", "target_alleles": ["A"], "frequencies": { "SAS": 0.85, "EUR": 0.1, "AFR": 0.02, "EAS": 0.02 } },
  { "rsid": "rs10456201", "target_alleles": ["C"], "frequencies": { "SAS": 0.95, "EUR": 0.05, "AFR": 0.01, "EAS": 0.01 } },
  { "rsid": "rs10456202", "target_alleles": ["T"], "frequencies": { "SAS": 0.92, "EUR": 0.1, "AFR": 0.02, "EAS": 0.01 } },
  { "rsid": "rs10456233", "target_alleles": ["C"], "frequencies": { "SAS": 0.95, "EUR": 0.05, "AFR": 0.01, "EAS": 0.05 } },
  { "rsid": "rs10456234", "target_alleles": ["T"], "frequencies": { "SAS": 0.98, "EUR": 0.02, "AFR": 0.02, "EAS": 0.01 } },
  { "rsid": "rs10456235", "target_alleles": ["G"], "frequencies": { "SAS": 0.92, "EUR": 0.08, "AFR": 0.01, "EAS": 0.02 } },
  { "rsid": "rs10456236", "target_alleles": ["A"], "frequencies": { "SAS": 0.88, "EUR": 0.15, "AFR": 0.01, "EAS": 0.01 } },
  { "rsid": "rs10456237", "target_alleles": ["C"], "frequencies": { "SAS": 0.96, "EUR": 0.02, "AFR": 0.01, "EAS": 0.01 } },
  { "rsid": "rs10456228", "target_alleles": ["A"], "frequencies": { "MENA": 0.92, "EUR": 0.15, "AFR": 0.05, "EAS": 0.01 } },
  { "rsid": "rs10456229", "target_alleles": ["C"], "frequencies": { "MENA": 0.88, "EUR": 0.25, "AFR": 0.02, "EAS": 0.01 } },
  { "rsid": "rs10456230", "target_alleles": ["T"], "frequencies": { "MENA": 0.85, "EUR": 0.30, "AFR": 0.05, "EAS": 0.02 } },
  { "rsid": "rs10456231", "target_alleles": ["G"], "frequencies": { "MENA": 0.90, "EUR": 0.10, "AFR": 0.02, "EAS": 0.02 } },
  { "rsid": "rs10456232", "target_alleles": ["A"], "frequencies": { "MENA": 0.86, "EUR": 0.20, "AFR": 0.08, "EAS": 0.01 } },
  { "rsid": "rs9000296", "target_alleles": ["C"], "frequencies": { "AFR": 0.01, "AMR": 0.02, "EAS": 0.8, "EUR": 0.02 } },
  { "rsid": "rs9000298", "target_alleles": ["A"], "frequencies": { "AFR": 0.02, "AMR": 0.01, "EAS": 0.6, "EUR": 0.01 } },
  { "rsid": "rs9000300", "target_alleles": ["C"], "frequencies": { "AFR": 0.01, "AMR": 0.01, "EAS": 0.85, "EUR": 0.01 } },
  { "rsid": "rs9000302", "target_alleles": ["A"], "frequencies": { "AFR": 0.01, "AMR": 0.01, "EAS": 0.88, "EUR": 0.01 } },
  { "rsid": "rs9000304", "target_alleles": ["C"], "frequencies": { "AFR": 0.01, "AMR": 0.01, "EAS": 0.85, "EUR": 0.01 } },
  { "rsid": "rs10456223", "target_alleles": ["G"], "frequencies": { "AFR": 0.02, "AMR": 0.01, "EAS": 0.05, "EUR": 0.01 } },
  { "rsid": "rs10456224", "target_alleles": ["A"], "frequencies": { "AFR": 0.01, "AMR": 0.01, "EAS": 0.02, "EUR": 0.01 } },
  { "rsid": "rs10456225", "target_alleles": ["T"], "frequencies": { "AFR": 0.01, "AMR": 0.01, "EAS": 0.55, "EUR": 0.01 } },
  { "rsid": "rs10456226", "target_alleles": ["C"], "frequencies": { "AFR": 0.01, "AMR": 0.01, "EAS": 0.15, "EUR": 0.01 } },
  { "rsid": "rs10456227", "target_alleles": ["G"], "frequencies": { "AFR": 0.01, "AMR": 0.01, "EAS": 0.70, "EUR": 0.01 } }
];

const updatedJson = userJson.map(item => {
  const match = ANCHOR_AIMS.find(aim => aim.rsid === item.rsid && aim.alleles.includes(item.target_alleles[0]));
  if (match) {
    return {
      ...item,
      frequencies: {
        AFR: match.frequencies.AFR || 0.01,
        EUR: match.frequencies.EUR || match.frequencies.MENA || 0.01,
        EAS: match.frequencies.EAS || 0.01,
        AMR: match.frequencies.AMR || 0.01
      }
    };
  } else {
    // Try to find by rsid and flip if needed
    const anyMatch = ANCHOR_AIMS.find(aim => aim.rsid === item.rsid);
    if (anyMatch) {
      // Flip frequencies
      return {
        ...item,
        frequencies: {
          AFR: parseFloat((1 - (anyMatch.frequencies.AFR || 0)).toFixed(4)),
          EUR: parseFloat((1 - (anyMatch.frequencies.EUR || anyMatch.frequencies.MENA || 0)).toFixed(4)),
          EAS: parseFloat((1 - (anyMatch.frequencies.EAS || 0)).toFixed(4)),
          AMR: parseFloat((1 - (anyMatch.frequencies.AMR || 0)).toFixed(4))
        }
      };
    }
  }
  return item;
});

console.log(JSON.stringify(updatedJson, null, 2));
