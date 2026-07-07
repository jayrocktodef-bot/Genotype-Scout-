
import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import rhData from '../data/blood_markers.json';
import { calculateBloodType } from '../engines/bloodTypeCalculator';
const BLOOD_TYPE_SYSTEMS: Record<string, string[]> = {
  ABO: ["rs8176719", "rs8176746", "rs8176747", "rs8176750", "rs8176745", "rs8176741", "rs505922", "rs507666"],
  Rh: ["rs590787", "rs676785", "rs28362459", "rs609320", "rs6762788", "rs118204008", "rs606429", "rs11124803", "rs118204007", "rs676185", "i4001527"],
  Duffy: ["rs2814778", "rs12075", "rs34599049"],
  Kidd: ["rs1058396", "rs10755968"],
  MNS: ["rs7683365", "rs11273308", "rs2250101"],
  Kell: ["rs8176058", "rs12046423"],
  Secretor: ["rs601338", "rs602662", "rs1047781"],
  Lewis: ["rs3894326", "rs3745635", "rs28362491"],
  Colton: ["rs2836269"],
  Lutheran: ["rs2298661"],
  Cartwright: ["rs11551124"],
  Dombrock: ["rs11276"],
  Knops: ["rs1145322"],
  H_Antigen: ["rs1047781"],
  Diego: ["rs2285603"],
  Scianna: ["rs1018780"],
  "Landsteiner-Wiener": ["rs11545624"],
  Gerbich: ["rs2075592"],
  Xg: ["rs311103"],
};

const MARKER_METADATA: Record<string, any> = {
  "rs8176719": { effect: "c.261delG frameshift", antigen: "O" },
  "rs8176746": { effect: "p.Leu266Met (A1/A2)", antigen: "A1/A2" },
  "rs8176747": { effect: "p.Gly268Ala (B-specific)", antigen: "A/B" },
  "rs8176750": { effect: "p.Pro234Ser (A/B differentiation)", antigen: "A/B" },
  "rs8176745": { effect: "p.Arg176Gly", antigen: "A/B" },
  "rs8176741": { effect: "p.Met266Leu", antigen: "A" },
  "rs505922": { effect: "Associated with ABO group levels", antigen: "ABO" },
  "rs507666": { effect: "Regulatory variant for ABO levels", antigen: "ABO" },
  "rs590787": { effect: "Weak D / partial D", antigen: "D" },
  "rs676785": { effect: "C/c antigen polymorphism", antigen: "C/c" },
  "rs28362459": { effect: "E/e antigen polymorphism", antigen: "E/e" },
  "rs609320": { effect: "Rh system regulator", antigen: "Rh" },
  "rs6762788": { effect: "Rh factor D antigen", antigen: "D" },
  "rs118204008": { effect: "RHCE variation", antigen: "C/c E/e" },
  "rs606429": { effect: "RHCE variation (associated with E antigen)", antigen: "E/e" },
  "rs11124803": { effect: "RHD/RHCE variation", antigen: "Rh" },
  "rs118204007": { effect: "Rh factor marker", antigen: "Rh" },
  "rs676185": { effect: "Rh C/c variation", antigen: "C/c" },
  "i4001527": { effect: "RHD gene deletion (major determinant of RhD positive/negative status)", antigen: "D" },
  "rs2814778": { effect: "FY*0 — Duffy-null (Malaria resistance)", antigen: "Fy(null)" },
  "rs12075": { effect: "p.Gly42Asp (Fya vs Fyb)", antigen: "Fya/Fyb" },
  "rs34599049": { effect: "FY*X allele", antigen: "Fyx" },
  "rs1058396": { effect: "p.Asp280Asn (Jka vs Jkb)", antigen: "Jka/Jkb" },
  "rs10755968": { effect: "Kidd system regulator", antigen: "Kidd" },
  "rs7683365": { effect: "M vs N antigen (GYPA)", antigen: "M/N" },
  "rs11273308": { effect: "S vs s antigen (GYPB)", antigen: "S/s" },
  "rs2250101": { effect: "U antigen variation", antigen: "U" },
  "rs8176058": { effect: "p.Met193Ile (K vs k antigen)", antigen: "K/k" },
  "rs12046423": { effect: "Kell system regulator", antigen: "Kell" },
  "rs601338": { effect: "FUT2 non-secretor mutation (Se/se)", antigen: "Se" },
  "rs602662": { effect: "FUT2 regulator", antigen: "Se" },
  "rs3894326": { effect: "FUT3 mutation (Le/le)", antigen: "Le" },
  "rs3745635": { effect: "FUT3 variation", antigen: "Le" },
  "rs28362491": { effect: "Lewis group variation", antigen: "Le" },
  "rs1047781": { effect: "FUT1 (H-antigen) variation", antigen: "H" },
  "rs2836269": { effect: "p.Ala45Thr (Coa vs Cob antigen)", antigen: "Co" },
  "rs2298661": { effect: "Lutheran blood group polymorphism", antigen: "Lu" },
  "rs11551124": { effect: "Cartwright blood group polymorphism", antigen: "Yt" },
  "rs11276": { effect: "Dombrock blood group polymorphism", antigen: "Do" },
  "rs1145322": { effect: "Knops blood group polymorphism", antigen: "Kn" },
  "rs2285603": { effect: "p.Pro854Leu (Dia vs Dib antigen)", antigen: "Di" },
  "rs1018780": { effect: "p.Gly244Arg (Sc1 vs Sc2 antigen)", antigen: "Sc" },
  "rs11545624": { effect: "p.Gln70Arg (LWa vs LWb antigen)", antigen: "LW" },
  "rs2075592": { effect: "GYPC intron variant associated with Gerbich system", antigen: "Ge" },
  "rs311103": { effect: "Regulatory variant for Xg blood group expression", antigen: "Xg" },
};

// Helper: Compute the ISBT official blood group phenotype from user genotypes
function getIsbtPhenotype(rsid: string, genotype: string, getGenotype: (rsid: string) => string): string {
  if (!genotype || genotype === "--" || genotype === "No Call" || genotype === "00") return "Not tested";
  
  const g = genotype.toUpperCase().replace(/[\s\/_]/g, '');
  if (g.length < 2) return "Uncertain";

  switch (rsid) {
    // --- Duffy System ---
    case 'rs12075': {
      const promoter = getGenotype('rs2814778').toUpperCase().replace(/[\s\/_]/g, '');
      if (promoter === 'CC') {
        return "Fy(a-b-) [Duffy Null - Malaria Resistant]";
      }
      if (g === 'AA' || g === 'TT') return "Fy(a+b-) [Fya Antigen Only]";
      if (g === 'GG' || g === 'CC') return "Fy(a-b+) [Fyb Antigen Only]";
      if (g === 'AG' || g === 'GA' || g === 'AT' || g === 'TA' || g === 'CG' || g === 'GC' || g === 'CT' || g === 'TC') return "Fy(a+b+) [Fya & Fyb Antigens Present]";
      return "Fy (Variable)";
    }
    case 'rs2814778': {
      if (g === 'CC') return "Fy(a-b-) [Erythroid Duffy Expression Silent / Vivax Malaria Resistant]";
      if (g === 'TT') return "Fy(a/b)+ [Normal Duffy Expression]";
      return "Fy(a/b)+ [Heterozygous Duffy Null Carrier]";
    }
    
    // --- Kidd System ---
    case 'rs1058396': {
      if (g === 'AA' || g === 'TT') return "Jk(a+b-) [Jka Antigen Only]";
      if (g === 'GG' || g === 'CC') return "Jk(a-b+) [Jkb Antigen Only]";
      if (g === 'AG' || g === 'GA' || g === 'AT' || g === 'TA' || g === 'CG' || g === 'GC' || g === 'CT' || g === 'TC') return "Jk(a+b+) [Jka & Jkb Antigens Present]";
      return "Jk (Variable)";
    }

    // --- Kell System ---
    case 'rs8176058': {
      if (g === 'CC' || g === 'GG') return "K+k- [Kell Antigen Present / Cellano Absent (Rare)]";
      if (g === 'TT' || g === 'AA') return "K-k+ [Kell Absent / Cellano Present (>99%)]";
      if (g === 'CT' || g === 'TC' || g === 'GA' || g === 'AG') return "K+k+ [Kell & Cellano Antigens Present (~9%)]";
      return "K/k (Variable)";
    }

    // --- MNS System ---
    case 'rs7683365': {
      if (g === 'CC' || g === 'GG') return "M+N- [M Antigen Only]";
      if (g === 'TT' || g === 'AA') return "M-N+ [N Antigen Only]";
      return "M+N+ [M & N Antigens Present]";
    }
    case 'rs11273308': {
      if (g === 'TT' || g === 'AA') return "S+s- [S Antigen Only]";
      if (g === 'CC' || g === 'GG') return "S-s+ [s Antigen Only]";
      return "S+s+ [S & s Antigens Present]";
    }

    // --- Lutheran System ---
    case 'rs2298661': {
      if (g === 'TT' || g === 'AA') return "Lu(a+b-) [Lua Antigen Only]";
      if (g === 'CC' || g === 'GG') return "Lu(a-b+) [Lub Antigen Only]";
      return "Lu(a+b+) [Lua & Lub Antigens Present]";
    }

    // --- Diego System ---
    case 'rs2285603': {
      if (g === 'TT' || g === 'AA') return "Di(a+b-) [Dia Antigen Only (Indigenous American/East Asian marker)]";
      if (g === 'CC' || g === 'GG') return "Di(a-b+) [Dib Antigen Only]";
      return "Di(a+b+) [Dia & Dib Antigens Present]";
    }

    // --- Colton System ---
    case 'rs2836269': {
      if (g === 'GG' || g === 'CC') return "Co(a+b-) [Coa Antigen Only]";
      if (g === 'AA' || g === 'TT') return "Co(a-b+) [Cob Antigen Only]";
      return "Co(a+b+) [Coa & Cob Antigens Present]";
    }

    // --- Dombrock System ---
    case 'rs11276': {
      if (g === 'GG' || g === 'CC') return "Do(a+b-) [Doa Antigen Only]";
      if (g === 'AA' || g === 'TT') return "Do(a-b+) [Dob Antigen Only]";
      return "Do(a+b+) [Doa & Dob Antigens Present]";
    }

    // --- Cartwright System ---
    case 'rs11551124': {
      if (g === 'CC' || g === 'GG') return "Yt(a+b-) [Yta Antigen Only]";
      if (g === 'TT' || g === 'AA') return "Yt(a-b+) [Ytb Antigen Only]";
      return "Yt(a+b+) [Yta & Ytb Antigens Present]";
    }

    // --- Secretor Status (FUT2) ---
    case 'rs601338': {
      if (g === 'AA' || g === 'TT') return "Non-secretor [Salivary antigens absent / Norovirus resistant (se/se)]";
      if (g === 'GG' || g === 'CC') return "Secretor [Salivary antigens secreted (Se/Se)]";
      return "Secretor [Salivary antigens secreted (Se/se)]";
    }

    default:
      return "Antigen Expressed (ISBT Conformant)";
  }
}

export const BloodTypeView = ({ dataset }: { dataset: any }) => {
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const { predictedABO, predictedRh, markerResults, coverage } = useMemo(() => {
    const rawResults = dataset?.results || [];
    const getGenotype = (rsid: string): string => {
      const val = overrides[rsid] || rawResults.find((r: any) => r.rsid === rsid)?.genotype;
      return val || "--";
    };

    // Use the central blood type engine for both ABO and Rh calculations
    const userSnpsForCalc: Record<string, string> = {};
    const coreMarkers = ["rs8176719", "rs8176746", "rs8176747", "rs8176750", ...Object.keys(rhData.rhSystem)];
    
    coreMarkers.forEach(rsid => {
      const g = getGenotype(rsid);
      if (g && g !== "--") {
        userSnpsForCalc[rsid] = g;
      }
    });

    const bloodCalc = calculateBloodType(userSnpsForCalc);
    const predicted = bloodCalc.details.abo !== "Unknown" ? `Type ${bloodCalc.details.abo}` : "Uncertain";

    let dType = "Unknown";
    if (bloodCalc.details.rhPhenotype !== "Unknown") {
      const isPositive = bloodCalc.details.rhPhenotype === "Positive";
      const conf = bloodCalc.details.rhConfidence || 0;
      if (conf >= 0.8) {
        dType = isPositive ? "Rh+ (High Confidence)" : "Rh- (High Confidence)";
      } else if (conf >= 0.5) {
        dType = isPositive ? "Likely Rh+ (Moderate Confidence)" : "Likely Rh- (Moderate Confidence)";
      } else {
        dType = "Unknown (Low Confidence)";
      }
    }

    const r676 = getGenotype("rs676785") || "--"; // C/c
    const r6761 = getGenotype("rs676185") || "--"; // C/c
    const r283 = getGenotype("rs28362459") || "--"; // E/e
    const r606 = getGenotype("rs606429") || "--"; // E/e

    // Sub-antigen detection
    // rs676785: C (G), c (A)
    // rs28362459: E (C), e (T)
    let ccType = "";
    if (r676 !== "--") {
      if (r676 === "GG") ccType = "CC";
      else if (r676 === "GA" || r676 === "AG") ccType = "Cc";
      else if (r676 === "AA") ccType = "cc";
    } else if (r6761 !== "--") {
      if (r6761 === "CC") ccType = "CC";
      else if (r6761 === "CT" || r6761 === "TC") ccType = "Cc";
      else if (r6761 === "TT") ccType = "cc";
    }

    let eeType = "";
    if (r283 !== "--") {
      if (r283 === "CC") eeType = "EE";
      else if (r283 === "CT" || r283 === "TC") eeType = "Ee";
      else if (r283 === "TT") eeType = "ee";
    } else if (r606 !== "--") {
      if (r606 === "CC") eeType = "EE";
      else if (r606 === "CT" || r606 === "TC") eeType = "Ee";
      else if (r606 === "TT") eeType = "ee";
    }

    const rh = `${dType}${ccType || eeType ? ' (' + ccType + eeType + ')' : ''}`;

    const allMarkers = Object.entries(BLOOD_TYPE_SYSTEMS).flatMap(([system, rsids]) => 
      rsids.map(rsid => {
        const genotype = getGenotype(rsid);
        const rawGenotype = rawResults.find((r: any) => r.rsid === rsid)?.genotype || "--";
        let meta = { ...(MARKER_METADATA[rsid] || { effect: "Unknown", antigen: "Unknown" }) };
        
        // Enrich from our new advanced rhSystem config
        const rhConfig = (rhData.rhSystem as any)[rsid];
        if (rhConfig && genotype !== "--") {
          const alleleInfo = rhConfig.alleles[genotype];
          if (alleleInfo) {
            meta = {
              ...meta,
              effect: `${alleleInfo.traitPhenotype} (Confidence: ${(alleleInfo.confidence * 100).toFixed(0)}%) — surrogate marker for RHD/RHCE`
            };
          }
        }
        
        const isbtPhenotype = getIsbtPhenotype(rsid, genotype, getGenotype);

        return {
          system,
          rsid,
          genotype,
          rawGenotype,
          isbtPhenotype,
          ...meta
        };
      })
    ).filter(m => m.genotype !== "--");

    const identifiedCount = allMarkers.filter(m => m.genotype !== "--").length;

    return { 
      predictedABO: predicted, 
      predictedRh: rh, 
      markerResults: allMarkers, 
      coverage: { identified: identifiedCount, total: allMarkers.length } 
    };
  }, [dataset, overrides]);

  const handleOverride = (rsid: string, value: string) => {
    setOverrides(prev => ({ ...prev, [rsid]: value.toUpperCase() }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-3.5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-slate-900 backdrop-blur-xl border border-slate-700 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
           <div className="absolute top-0 right-0 p-6 opacity-30 text-6xl pointer-events-none group-hover:rotate-12 transition-transform">🩸</div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ABO Grouping</p>
           <h3 className="text-3xl sm:text-5xl font-black text-white mt-2 tracking-tighter leading-none">{predictedABO}</h3>
        </div>
        <div className="p-3.5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-[#1a1b1d] backdrop-blur-xl border border-slate-700 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
           <div className="absolute top-0 right-0 p-6 opacity-30 text-6xl pointer-events-none group-hover:rotate-45 transition-transform">🧬</div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rhesus Factor</p>
           <h3 className="text-3xl sm:text-5xl font-black text-white mt-2 tracking-tighter leading-none">{predictedRh}</h3>
        </div>
        <div className="p-3.5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-slate-100 border border-slate-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative sm:col-span-2 lg:col-span-1">
           <div className="absolute top-0 right-0 p-6 opacity-20 text-6xl pointer-events-none">🔬</div>
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Sequencing Depth</p>
           <h3 className="text-3xl sm:text-5xl font-black text-slate-900 mt-2 tracking-tighter leading-none">
             {coverage.identified} 
             <span className="text-sm font-bold text-slate-500 ml-2">/ {coverage.total}</span>
           </h3>
        </div>
      </div>

      <div className="rounded-2xl sm:rounded-[2rem] frosted-glass border border-white/5 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-white/5 flex justify-between items-center">
          <h4 className="text-sm font-black text-[#F5F6F7] uppercase tracking-widest">Molecular Breakdown</h4>
          <span className="text-[10px] font-mono text-slate-400 uppercase">Interactive Sequence Map</span>
        </div>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scroll-thumb-slate-700">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">System</th>
                <th className="px-6 py-4">Marker</th>
                <th className="px-6 py-4 text-center">Reference</th>
                <th className="px-6 py-4">Modification</th>
                <th className="px-6 py-4">ISBT Predicted Phenotype</th>
                <th className="px-6 py-4">Biochemical Variant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
              {markerResults.map((m, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-black">{m.system}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sky-600 dark:text-sky-400">{m.rsid}</span>
                  </td>
                  <td className="px-6 py-4 text-center font-mono opacity-60">{m.rawGenotype}</td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      placeholder={m.rawGenotype} 
                      className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-[10px] outline-none focus:ring-1 focus:ring-sky-500 transition-all" 
                      value={overrides[m.rsid] || ''} 
                      onChange={(e) => handleOverride(m.rsid, e.target.value)} 
                    />
                  </td>
                  <td className="px-6 py-4 font-bold text-teal-600 dark:text-teal-400">{m.isbtPhenotype}</td>
                  <td className="px-6 py-4 italic opacity-70">{m.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
