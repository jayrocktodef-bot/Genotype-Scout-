import React, { useState, useMemo } from 'react';
import { processSubpopulations, AIM, UserGenotype } from './ancestryOracleLogic';
import { motion } from 'motion/react';
import { Target, HelpCircle, Layers, Globe, Info, Activity } from 'lucide-react';

interface BentoProps {
  userGenotypes: UserGenotype[];
  aimsDatabase: AIM[];
  precalculated?: any;
  }

const SubpopulationBento: React.FC<BentoProps> = ({ userGenotypes, aimsDatabase, precalculated }) => {
  const [showUnmapped, setShowUnmapped] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [modelType, setModelType] = useState<'euclidean' | 'admixture'>('euclidean');

  // Run or inherit Oracle Logic
  const results = useMemo(() => {
    if (precalculated) {
      return precalculated;
    }
    return processSubpopulations(userGenotypes, aimsDatabase);
  }, [userGenotypes, aimsDatabase, precalculated]);

  if (!results) {
    return <div className="text-slate-400 p-8 text-center">Processing genomic oracle...</div>;
  }

  // Check if a subpopulation matches a broad continental macro group
  const isContinentalMatch = (name: string) => {
    if (!name) return false;
    const n = name.toUpperCase();
    return n.includes('CONTINENTAL') || n.includes('SUPER POPULATION') || n.includes('(AFR)') || n.includes('(EUR)') || n.includes('(EAS)') || n.includes('(SAS)') || n.includes('(AMR)');
  };

  // Determine a classification label based on the shortest distance
  const getProximityLabel = (distance: number) => {
    if (distance < 0.12) return { text: 'Exceptional Genetic Affinity', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (distance < 0.16) return { text: 'Optimal Proximity Match', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' };
    if (distance < 0.22) return { text: 'Moderate Genetic Affinity', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
    return { text: 'Distal Ancestral Match', color: 'text-slate-400 bg-slate-500/10 border-slate-500/10' };
  };

  const topMatchDistance = results.breakdown?.[0]?.distance ?? 0;
  const topMatchLabel = getProximityLabel(topMatchDistance);

  // Filter admixture items that are reasonably informative (> 0.5%)
  const admixtureList = results.admixtureMix || [];
  

  return (
    <div className="bg-[#111213]/70 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-[2rem] p-2.5 sm:p-8 shadow-2xl text-white space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-teal-400">
            <Target className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#F5F6F7] tracking-tight">
              Deep Regional Match
            </h3>
            <p className="text-[10px] uppercase tracking-widest font-black text-teal-500">Oracle Engine v3</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
            Oracle Engine v3 deploys two parallel scientific architectures in a dedicated background Web Worker to bypass main thread locking:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
            <li>
              <strong>Cladistic Euclidean Proximity Model:</strong> Computes continuous multi-locus spatial offsets across Independence-Pruned (LD) Gene loci, applying critical negation filters for ancestral-derived SNP mismatches.
            </li>
            <li>
              <strong>Non-Negative Least Squares (NNLS) Coordinate Descent:</strong> Deconvolves mixed ancestral profiles by projecting user raw dosage vectors onto 1000 Genomes reference population frequencies.
            </li>
          </ul>
        </motion.div>
      )}

      {/* Model Selection Tabs */}
      <div className="flex bg-white/5 border border-white/5 p-1 rounded-2xl">
        <button
          onClick={() => setModelType('euclidean')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
            modelType === 'euclidean' 
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🎯 Proximity Fit (Euclidean)
        </button>
        <button
          onClick={() => setModelType('admixture')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
            modelType === 'admixture' 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🌍 Human Origins (K61)
        </button>
      </div>

      {/* Closest match card - only if Euclidean format is active */}
      {modelType === 'euclidean' && (
        <div className="p-6 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 rounded-2xl flex flex-col sm:flex-row items-stretch justify-between gap-6 shadow-inner">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
              {isContinentalMatch(results.topMatch) ? 'Continental / Super Population Match' : 'Closest Genomic Subpopulation'}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 tracking-tight break-words">
              {results.topMatch !== 'Unknown' ? results.topMatch : 'Establishing genotype...'}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Calculated across {results.subpopAimsUsed.toLocaleString()} ancestral markers (AIMs) with Gene LD protection.
            </p>
          </div>
          
          {results.topMatch !== 'Unknown' && (
            <div className="flex flex-col justify-center items-start sm:items-end gap-2 sm:self-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                {isContinentalMatch(results.topMatch) ? 'Continental Classification' : 'Euclidean Distance Fit'}
              </span>
              <div className="text-2xl font-black font-mono text-teal-400">
                d = {Number(topMatchDistance ?? 0).toFixed(4)}
              </div>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border ${isContinentalMatch(results.topMatch) ? 'text-teal-400 bg-teal-500/10 border-teal-500/20' : topMatchLabel.color}`}>
                {isContinentalMatch(results.topMatch) ? 'Continental / Super Population' : topMatchLabel.text}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Admixture mix view - active when admixture model is selected */}
      {modelType === 'admixture' && (
        <div className="p-6 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 rounded-2xl">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admixture Deconvolution Solver</p>
            <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 tracking-tight">
              {admixtureList.length > 0 ? admixtureList[0].name : 'Calculating optimal mixture...'}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Proportionate multi-source genetic mixture solved using Non-Negative Least Squares (NNLS).
            </p>
          </div>
        </div>
      )}

      {/* Subpopulation Breakdown List */}
      <div className="space-y-4">
        {modelType === 'euclidean' ? (
          <>
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-400" /> Regional Matches Breakdown (Ranked by Distance)
            </h4>
            
            {results.breakdown.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No specific subpopulation markers detected.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.breakdown.slice(0, 8).map((item: any, idx: number) => {
                  const label = getProximityLabel(item.distance);
                  const isContinental = isContinentalMatch(item?.subpop);
                  return (
                    <div key={item.subpop} className="flex flex-col justify-between p-5 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all shadow-lg shadow-black/20 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-teal-500/20 transition-all" />
                      
                      <div className="flex flex-col space-y-2 relative z-10">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-slate-400 text-[10px] bg-black/40 px-2.5 py-1 rounded-full border border-white/5">#{idx + 1}</span>
                          <span className={`text-[9px] font-bold px-2 py-1 rounded-md border ${isContinental ? 'text-teal-400 bg-teal-500/10 border-teal-500/20' : label.color}`}>
                            {isContinental ? 'Continental' : `${label.text.split(' ')[0]}`}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-100 break-words leading-tight mt-2 group-hover:text-teal-300 transition-colors">
                          {item?.subpop}
                        </h4>
                      </div>

                      <div className="mt-8 flex flex-col space-y-3 relative z-10">
                        <div className="flex justify-between items-end">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-0.5">Genetic Distance</span>
                            <span className="text-teal-400 text-xl font-black font-mono leading-none">{Number(item?.distance ?? 0).toFixed(4)}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono tracking-wide">{item?.markersCompared ?? 0} AIMs</span>
                        </div>
                        
                        <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5 p-px">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item?.similarityScore ?? 0}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.08 }}
                            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Human Origins (K61) Mixture
            </h4>
            
            {admixtureList.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No admixture components mapped.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {admixtureList.map((comp: any, idx: number) => (
                  <div key={comp.popCode} className="flex flex-col justify-between p-5 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all shadow-lg shadow-black/20 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-emerald-500/20 transition-all" />

                    <div className="flex flex-col space-y-2 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-slate-400 text-[10px] bg-black/40 px-2.5 py-1 rounded-full border border-white/5">#{idx + 1}</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-100 break-words leading-tight mt-1 group-hover:text-emerald-300 transition-colors">
                        {comp?.name ?? 'Unknown'}
                      </h4>
                    </div>

                    <div className="mt-8 flex flex-col space-y-3 relative z-10">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-0.5">Admixture CI</span>
                        <span className="text-emerald-400 text-2xl font-black font-mono leading-none mt-1">{Number(comp?.percentage ?? 0).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5 p-px">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${comp?.percentage ?? 0}%` }}
                          transition={{ duration: 1.0, ease: "easeOut", delay: idx * 0.05 }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
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
                  ● <span className="text-teal-400">{aim.rsid}</span> <span className="text-slate-500">(chr {aim.chromosome})</span>
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
