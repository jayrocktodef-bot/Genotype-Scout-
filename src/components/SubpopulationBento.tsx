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

    if (selectedPanel === 'microhap') {
      const userSnps = Object.fromEntries(userGenotypes.map(g => [g.rsid, g.genotype]));
      const mix = deconvolveMicrohaplotypes(userSnps);
      if (mix && mix.length > 0) {
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
    <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-xl text-white space-y-4 transition-all duration-700 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:border-emerald-500/20">
      
      {/* Top Header & Selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400 shrink-0">
            <Target className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-[#F5F6F7] tracking-tight">
                Human Origins (K61)
              </h3>
              <span className="bg-teal-500/15 border border-teal-500/20 text-teal-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                <Activity className="w-2.5 h-2.5 text-emerald-400 animate-pulse" /> Webworked
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Top Match: <span className="font-bold text-emerald-400">{breakdownList.length > 0 ? (breakdownList[0] as any).name || breakdownList[0].subpop : 'Calculating...'}</span>
            </p>
          </div>
        </div>
        
        {/* Selector Panel Dropdown */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <select
            value={selectedPanel}
            onChange={(e) => setSelectedPanel(e.target.value as PanelType)}
            className="bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 flex items-center gap-1 transition-all"
            title="Overview of our mathematical models"
          >
            <Info className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Info</span>
          </button>
        </div>
      </div>

      {/* Methodology Explanation */}
      {showExplain && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-3.5 rounded-xl bg-teal-500/5 border border-teal-500/10 text-xs text-slate-300 space-y-2 leading-relaxed"
        >
          <p className="font-bold text-teal-400 flex items-center gap-2">
            🧬 Scientific Formulation Framework
          </p>
          <p>
            The Genetic Distance Engine deploys an advanced scientific architecture in a background Web Worker:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
            <li>
              <strong>Euclidean Genetic Distance:</strong> Calculates raw vector distance between user genotype dosages and K61 Human Origins reference allele frequencies. Lower distances indicate closer genetic similarity.
            </li>
            <li>
              <strong>Microhaplotypes:</strong> Leverage multi-allelic haplotype dosages for high-precision Mixed Deconvolution.
            </li>
          </ul>
        </motion.div>
      )}

      {/* Compact Subpopulation Breakdown Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" /> Population Distances
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">Top {breakdownList.length} Matches</span>
        </div>
        
        {breakdownList.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">No populations mapped for this panel.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {breakdownList.map((comp: any, idx: number) => {
              const visualWidth = Math.max(5, 100 - (comp.distance * 200));
              
              return (
                <div key={comp.subpop} className="flex flex-col justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-all group relative overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-slate-400 text-[9px] bg-black/40 px-1.5 py-0.5 rounded border border-white/5">#{idx + 1}</span>
                    <span className="text-emerald-400 text-xs font-bold font-mono">
                      {Number(comp.distance).toFixed(3)}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 truncate leading-snug group-hover:text-emerald-300 transition-colors" title={comp?.name || comp?.subpop}>
                    {comp?.name || comp?.subpop || 'Unknown'}
                  </h4>

                  <div className="mt-2 w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5 p-px">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${visualWidth}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.03 }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    />
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
