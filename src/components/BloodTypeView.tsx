
import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';

const BLOOD_TYPE_SYSTEMS: Record<string, string[]> = {
  ABO: ["rs8176719", "rs8176746", "rs8176747", "rs8176750", "rs8176745", "rs8176741"],
  Rh: ["rs590787", "rs676785", "rs28362459"],
  Duffy: ["rs2814778", "rs12075"],
  Kidd: ["rs1058396"],
  MNS: ["rs7683365", "rs11273308"],
  Kell: ["rs8176058"],
  Secretor: ["rs601338", "rs602662"],
  Lewis: ["rs3894326", "rs3745635"],
  P1PK: ["rs5751348"],
  Diego: ["rs2285644"],
};

const MARKER_METADATA: Record<string, any> = {
  "rs8176719": { effect: "c.261delG frameshift", antigen: "O" },
  "rs8176746": { effect: "p.Leu266Met", antigen: "A1/A2" },
  "rs8176747": { effect: "p.Gly268Ala", antigen: "A/B" },
  "rs8176750": { effect: "p.Pro234Ser", antigen: "A/B" },
  "rs8176745": { effect: "p.Arg176Gly", antigen: "A/B" },
  "rs8176741": { effect: "p.Met266Leu", antigen: "A" },
  "rs590787": { effect: "Weak D / partial D", antigen: "D" },
  "rs676785": { effect: "C/c antigen", antigen: "C/c" },
  "rs28362459": { effect: "E/e antigen", antigen: "E/e" },
  "rs2814778": { effect: "FY*0 — Duffy-null", antigen: "Fy(null)" },
  "rs12075": { effect: "p.Gly42Asp", antigen: "Fya/Fyb" },
  "rs1058396": { effect: "p.Asp280Asn", antigen: "Jka/Jkb" },
  "rs7683365": { effect: "M vs N antigen", antigen: "M/N" },
  "rs11273308": { effect: "S vs s antigen", antigen: "S/s" },
  "rs8176058": { effect: "p.Thr193Met", antigen: "K/k" },
  "rs601338": { effect: "p.Trp143Ter", antigen: "Se/se" },
  "rs602662": { effect: "p.Ala385Thr", antigen: "Se/se" },
  "rs3894326": { effect: "Lea/Leb phenotype", antigen: "Lea/Leb" },
  "rs3745635": { effect: "Lewis null", antigen: "Le(null)" },
  "rs5751348": { effect: "P1 vs P2 phenotype", antigen: "P1/P2" },
  "rs2285644": { effect: "Dia vs Dib antigen", antigen: "Dia/Dib" },
};

export const BloodTypeView = ({ dataset }: { dataset: any }) => {
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const { predictedABO, predictedRh, markerResults, coverage } = useMemo(() => {
    const rawResults = dataset?.results || [];
    const getGenotype = (rsid: string) => overrides[rsid] || rawResults.find((r: any) => r.rsid === rsid)?.genotype || "--";

    // ABO Logic
    const r719 = getGenotype("rs8176719");
    const r746 = getGenotype("rs8176746");
    const r747 = getGenotype("rs8176747");
    const r750 = getGenotype("rs8176750");

    let predicted = "Uncertain";
    if (r719 !== "--" && r746 !== "--" && r747 !== "--" && r750 !== "--") {
      const isO = r719.includes('del') || r719 === 'D' || r719 === 'II';
      const hasA = r746.includes('A') || r750.includes('A');
      const hasB = r747.includes('G') || r750.includes('G');
      if (isO) predicted = "Type O";
      else if (hasA && hasB) predicted = "Type AB";
      else if (hasA) predicted = "Type A";
      else if (hasB) predicted = "Type B";
      else predicted = "Type O (Carrier)";
    }

    // Rh Logic
    const r590 = getGenotype("rs590787"); // D
    const r676 = getGenotype("rs676785"); // Cc
    const r283 = getGenotype("rs28362459"); // Ee
    const dType = r590 !== "--" ? (r590.includes('A') ? "Positive (+)" : "Negative (-)") : "Unknown";
    const ccType = r676 !== "--" ? (r676.includes('C') ? "C" : "c") : "";
    const eeType = r283 !== "--" ? (r283.includes('E') ? "E" : "e") : "";
    const rh = `${dType} ${ccType}${eeType}`;

    const allMarkers = Object.entries(BLOOD_TYPE_SYSTEMS).flatMap(([system, rsids]) => 
      rsids.map(rsid => ({
        system,
        rsid,
        genotype: getGenotype(rsid),
        rawGenotype: rawResults.find((r: any) => r.rsid === rsid)?.genotype || "--",
        ...(MARKER_METADATA[rsid] || { effect: "Unknown", antigen: "Unknown" })
      }))
    );

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-700">
           <p className="text-sm text-slate-400">Predicted ABO Type</p>
           <h3 className="text-4xl font-black text-white">{predictedABO}</h3>
        </div>
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-700">
           <p className="text-sm text-slate-400">Predicted Rh Factor</p>
           <h3 className="text-4xl font-black text-white">{predictedRh}</h3>
        </div>
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-700">
           <p className="text-sm text-slate-400">Marker Coverage</p>
           <h3 className="text-4xl font-black text-white">{coverage.identified} / {coverage.total}</h3>
        </div>
      </div>

      <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-900 text-slate-500 uppercase">
              <th className="p-4">System</th>
              <th className="p-4">RSID</th>
              <th className="p-4">Raw</th>
              <th className="p-4">Override</th>
              <th className="p-4">Trait/Effect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-200">
            {markerResults.map((m, i) => (
              <tr key={i} className="hover:bg-slate-700/30">
                <td className="p-4 font-bold">{m.system}</td>
                <td className="p-4 font-mono">{m.rsid}</td>
                <td className="p-4 font-mono text-slate-400">{m.rawGenotype}</td>
                <td className="p-3">
                  <input type="text" placeholder={m.rawGenotype} className="w-24 px-2 py-1 bg-slate-950 border border-slate-700 rounded font-mono text-xs outline-none focus:border-sky-500" value={overrides[m.rsid] || ''} onChange={(e) => handleOverride(m.rsid, e.target.value)} />
                </td>
                <td className="p-4 text-slate-400">{m.effect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
