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

type PanelType = 'all' | 'kidd55' | 'seldin128' | 'euroforgen' | 'microhap';

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
    <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-2xl sm:rounded-[2rem] p-2.5 sm:p-8 shadow-2xl text-white space-y-6 transition-all duration-700 hover:shadow-[0_0_50px_rgba(16,185,129,0.2)] hover:border-emerald-500/20">
      
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-teal-400">
            <Target className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#F5F6F7] tracking-tight">
              Human Origins (K61)
            </h3>
            <p className="text-[10px] uppercase tracking-widest font-black text-teal-500">Genetic Distance Engine</p>
          </div>
        </div>
        
        {/* Selector Panel Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedPanel}
            onChange={(e) => setSelectedPanel(e.target.value as PanelType)}
            className="bg-slate-800 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">Global Reference (All AIMs)</option>
            <option value="kidd55">Kidd Lab 55 AIMs (Kidd55)</option>
            <option value="seldin128">Seldin Lab 128 AIMs</option>
            <option value="euroforgen">EuroForGen European Substructure</option>
            <option value="microhap">Microhaplotypes (Top 100 Multi-Allelic)</option>
          </select>

          <button 
            type="button"
            onClick={() => setShowExplain(!showExplain)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-all"
            title="Overview of our mathematical models"
          >
            <Info className="w-4 h-4 text-teal-400" />
            <span className="hidden sm:inline">Methodology</span>
          </button>
          <span className="bg-teal-500/15 border border-teal-500/20 text-teal-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> Webworked
          </span>
        </div>
      </div>

      {/* Methodology Explanation */}
      {showExplain && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-5 rounded-2xl bg-teal-500/5 border border-teal-500/10 text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed"
        >
          <p className="font-bold text-teal-400 flex items-center gap-2">
            🧬 Scientific Formulation Framework
          </p>
          <p>
            The Genetic Distance Engine deploys an advanced scientific architecture in a dedicated background Web Worker to bypass main thread locking:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
            <li>
              <strong>Euclidean Genetic Distance:</strong> Calculates the raw vector distance between the user's genotype dosages and the K61 Human Origins reference population allele frequencies. Lower distances indicate closer genetic similarity.
            </li>
            <li>
              <strong>Microhaplotypes:</strong> Leverage small genomic regions containing closely linked SNPs to extract multi-allelic haplotype dosages for high-precision Mixed Deconvolution.
            </li>
          </ul>
        </motion.div>
      )}

      {/* Top Match view */}
      <div className="p-6 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 rounded-2xl">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Closest Population Match</p>
          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 tracking-tight">
            {breakdownList.length > 0 ? (breakdownList[0] as any).name || breakdownList[0].subpop : 'Calculating optimal match...'}
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            {selectedPanel === 'microhap' 
              ? 'NNLS Mixture proportion deconvolution from microhaplotype regions.' 
              : 'Population with the absolute lowest genetic distance (highest allele sharing) in chosen panel.'}
          </p>
        </div>
      </div>

      {/* Subpopulation Breakdown List */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" /> Top Population Distances
        </h4>
        
        {breakdownList.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No populations mapped.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {breakdownList.map((comp: any, idx: number) => {
              // Create a visual width representing closeness. Distance 0 = 100%, Distance 0.5 = 0%
              const visualWidth = Math.max(5, 100 - (comp.distance * 200));
              
              return (
                <div key={comp.subpop} className="flex flex-col justify-between p-5 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all shadow-lg shadow-black/20 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-emerald-500/20 transition-all" />

                  <div className="flex flex-col space-y-2 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-slate-400 text-[10px] bg-black/40 px-2.5 py-1 rounded-full border border-white/5">#{idx + 1}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-100 break-words leading-tight mt-1 group-hover:text-emerald-300 transition-colors">
                      {comp?.name || comp?.subpop || 'Unknown'}
                    </h4>
                  </div>

                  <div className="mt-8 flex flex-col space-y-3 relative z-10">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-0.5 dark:text-slate-400">Genetic Distance</span>
                      <span className="text-emerald-400 text-2xl font-black font-mono leading-none mt-1">
                        {Number(comp.distance).toFixed(4)}
                      </span>
                    </div>
                    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5 p-px">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${visualWidth}%` }}
                        transition={{ duration: 1.0, ease: "easeOut", delay: idx * 0.05 }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Broad Continental Markers Section */}
      <div className="pt-4 border-t border-white/10">
        <button 
          onClick={() => setShowUnmapped(!showUnmapped)}
          className="text-xs font-bold text-slate-400 hover:text-teal-400 flex items-center justify-between w-full transition-colors py-1"
        >
          <span className="flex items-center gap-2 uppercase tracking-wider text-[10px] sm:text-xs">
            <Layers className="w-4 h-4" /> Unmapped Global/Continental Markers ({results.unmappedAims?.length ?? 0})
          </span>
          <span className="font-mono">{showUnmapped ? '▲' : '▼'}</span>
        </button>

        {showUnmapped && (
          <div className="mt-4 max-h-40 overflow-y-auto bg-black/20 border border-white/5 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              These reference markers map to general macro-continental lineages (e.g., Broadly European, Genomically Cosmopolitan) rather than specific regional subpopulations. They are computed in global frequency vectors but excluded from regional Euclidean metrics to maintain specificity:
            </p>
            <ul className="text-xs space-y-1 font-mono text-slate-350 grid grid-cols-2 gap-x-4">
              {(results.unmappedAims || []).slice(0, 50).map((aim: any) => (
                <li key={aim.rsid} className="truncate">
                  ● <span className="text-teal-400">{aim.rsid}</span> <span className="text-slate-500 dark:text-slate-400">(chr {aim.chromosome})</span>
                </li>
              ))}
              {(results.unmappedAims || []).length > 50 && (
                <li className="text-teal-400/80 italic col-span-2">...and {results.unmappedAims.length - 50} more.</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubpopulationBento;
