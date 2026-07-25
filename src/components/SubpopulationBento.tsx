import React, { useState, useMemo } from 'react';
import { processSubpopulations, AIM, UserGenotype } from './ancestryOracleLogic';
import { deconvolveMicrohaplotypes } from '../utils/ancestry/microhapAdmixture';
import { motion } from 'motion/react';
import { Target, Layers, Info, Activity } from 'lucide-react';

interface BentoProps {
  userGenotypes: UserGenotype[];
  aimsDatabase: AIM[];
  precalculated?: any;
}

type PanelType = 'all' | 'kidd55' | 'seldin128' | 'euroforgen' | 'ramos' | 'microhap';

const SubpopulationBento: React.FC<BentoProps> = ({ userGenotypes, aimsDatabase, precalculated }) => {
  const [showUnmapped, setShowUnmapped] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState<PanelType>('all');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (selectedPanel === 'microhap') {
      const userSnps = Object.fromEntries(userGenotypes.map(g => [g.rsid, g.genotype]));
      const mix = deconvolveMicrohaplotypes(userSnps);
      setResults({
        topMatch: mix[0]?.name || 'Unknown',
        subpopAimsUsed: mix.length,
        unmappedAims: [],
        breakdown: mix.map(m => ({
          subpop: m.name,
          distance: 1.0 - (m.percentage / 100.0),
          similarityScore: m.percentage,
          markersCompared: mix.length,
          count: mix.length
        })),
        admixtureMix: mix
      });
      setLoading(false);
      return;
    }

    if (precalculated) {
      if (precalculated[selectedPanel]) {
        setResults(precalculated[selectedPanel]);
        setLoading(false);
        return;
      }
      if (selectedPanel === 'all') {
        setResults(precalculated);
        setLoading(false);
        return;
      }
    }

    let active = true;
    setLoading(true);
    processSubpopulations(userGenotypes, aimsDatabase, undefined, undefined, selectedPanel)
      .then(res => {
        if (active) {
          setResults(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Error calculating panel:", err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userGenotypes, aimsDatabase, precalculated, selectedPanel]);

  if (!results) {
    return <div className="text-slate-400 p-8 text-center">Processing genomic oracle...</div>;
  }

  // Filter the breakdown list to show top matches by genetic distance
  const breakdownList = (results.breakdown || []).slice(0, 12);
  
  return (
    <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-2xl p-3 sm:p-5 shadow-xl text-white space-y-3 transition-all duration-300">
      
      {/* Header section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
            <Target className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#F5F6F7] tracking-tight">
              Human Origins Subpopulation Oracle
            </h3>
            <p className="text-[9px] uppercase tracking-widest font-black text-teal-500">Genetic Distance & Admixture Breakdown</p>
          </div>
        </div>
        
        {/* Selector Panel Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedPanel}
            onChange={(e) => setSelectedPanel(e.target.value as PanelType)}
            className="bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-300 font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">Global Reference (All AIMs)</option>
            <option value="kidd55">Kidd Lab 55 AIMs (Kidd55)</option>
            <option value="seldin128">Seldin Lab 128 AIMs</option>
            <option value="euroforgen">EuroForGen European Substructure</option>
            <option value="ramos">Ramos African Substructure</option>
            <option value="microhap">Microhaplotypes (Top 100 Multi-Allelic)</option>
          </select>

          <button 
            type="button"
            onClick={() => setShowExplain(!showExplain)}
            className="px-2.5 py-1 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 flex items-center gap-1 transition-all"
            title="Overview of our mathematical models"
          >
            <Info className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Info</span>
          </button>
          <span className="bg-teal-500/15 border border-teal-500/20 text-teal-400 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
            <Activity className="w-2.5 h-2.5 text-emerald-400 animate-pulse" /> Webworked
          </span>
        </div>
      </div>

      {/* Methodology Explanation */}
      {showExplain && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/10 text-xs text-slate-300 space-y-1.5 leading-tight"
        >
          <p className="font-bold text-teal-400 flex items-center gap-1.5">
            🧬 Scientific Formulation Framework
          </p>
          <p className="text-slate-400 text-[11px]">
            The Genetic Distance Engine deploys vector distance and NNLS admixture deconvolution in background Web Workers for maximum speed and responsiveness.
          </p>
        </motion.div>
      )}

      {/* Top Match Compact Banner */}
      <div className="px-3.5 py-2 bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900/60 border border-emerald-500/20 rounded-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest shrink-0">Closest Match:</span>
          <h4 className="text-sm sm:text-base font-black text-white truncate tracking-tight">
            {breakdownList.length > 0 ? (breakdownList[0] as any).name || breakdownList[0].subpop : 'Calculating optimal match...'}
          </h4>
        </div>
        {breakdownList.length > 0 && (
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shrink-0">
            Dist: {Number(breakdownList[0].distance).toFixed(4)}
          </span>
        )}
      </div>

      {/* Subpopulation Breakdown Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" /> Regional Subpopulation Distances
          </h4>
          <span className="text-[10px] font-mono text-slate-500">Showing Top 12 Matches</span>
        </div>
        
        {breakdownList.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No populations mapped.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {breakdownList.map((comp: any, idx: number) => {
              const visualWidth = Math.max(5, 100 - (comp.distance * 200));
              const popName = comp?.name || comp?.subpop || 'Unknown';
              
              return (
                <div key={comp.subpop} className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-all group flex flex-col justify-between space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-slate-400 text-[9px] bg-black/40 px-1.5 py-0.5 rounded border border-white/5 shrink-0">#{idx + 1}</span>
                    <span className="text-emerald-400 text-xs font-black font-mono shrink-0">
                      {Number(comp.distance).toFixed(3)}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-emerald-300 transition-colors" title={popName}>
                    {popName}
                  </h4>

                  <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5 p-px">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${visualWidth}%` }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.03 }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Unmapped Continental Markers Section */}
      {results.unmappedAims?.length > 0 && (
        <div className="pt-2 border-t border-white/10">
          <button 
            onClick={() => setShowUnmapped(!showUnmapped)}
            className="text-xs font-bold text-slate-400 hover:text-teal-400 flex items-center justify-between w-full transition-colors py-0.5"
          >
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[9px]">
              <Layers className="w-3 h-3" /> Unmapped Global Markers ({results.unmappedAims?.length ?? 0})
            </span>
            <span className="font-mono text-[10px]">{showUnmapped ? '▲' : '▼'}</span>
          </button>

          {showUnmapped && (
            <div className="mt-2 max-h-32 overflow-y-auto bg-black/30 border border-white/5 rounded-lg p-2.5">
              <ul className="text-[10px] space-y-0.5 font-mono text-slate-400 grid grid-cols-2 sm:grid-cols-3 gap-x-2">
                {(results.unmappedAims || []).slice(0, 30).map((aim: any) => (
                  <li key={aim.rsid} className="truncate">
                    ● <span className="text-teal-400">{aim.rsid}</span> <span className="text-slate-500">(chr {aim.chromosome})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubpopulationBento;
