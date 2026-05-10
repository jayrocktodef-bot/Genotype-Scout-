import React, { memo, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, Dna, History, User, MapPin } from 'lucide-react';
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { EngineAncestryOracle } from './EngineAncestryOracle';
import { runAncestryOracle } from '../utils/ancestry/oracleEngine';
import { trackSickleCellHaplotype } from '../utils/ancestry/haplotypeTracker';

export const ModernAncestryOracle = memo(({ 
  results
}: { 
  results: any
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  type ViewMode = 'standard' | 'wholePanel' | 'engine';
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  
  const primaryAncestry = results?.primary?.continentalScores || {};
  const wholePanelAncestry = results?.wholePanel?.results || {};
  const engineAncestry = results?.engine || [];
  const panelMetadata = results?.wholePanel || {};
  
  const hbbMigration = useMemo(() => {
    return results.userSnps ? trackSickleCellHaplotype(results.userSnps) : null;
  }, [results.userSnps]);

  const hasEngineData = engineAncestry && engineAncestry.length > 0;
  
  const hasData = Object.keys(primaryAncestry).length > 0 || Object.keys(wholePanelAncestry).length > 0;
  
  if (!hasData) {
    return (
      <div className="p-12 text-center text-slate-500">
        No Ancestry Results Available - Please load and process a valid dataset.
      </div>
    );
  }
  
  const currentAncestry = viewMode === 'standard' ? primaryAncestry : wholePanelAncestry;
  
  const chartData = useMemo(() => {
    return Object.entries(currentAncestry).map(([key, value]) => ({
      subject: key === 'AMR' ? 'American' : (key === 'EAS' ? 'East Asian' : (key === 'SAS' ? 'South Asian' : (key === 'AFR' ? 'African' : (key === 'EUR' ? 'European' : key)))),
      A: Number(value),
      fullMark: 100,
    }));
  }, [currentAncestry, viewMode]);
  
  const getDisplayName = (code: string) => {
    const map: Record<string, string> = {
      'EUR': 'European',
      'AFR': 'African',
      'EAS': 'East Asian',
      'SAS': 'South Asian',
      'AMR': 'Native American'
    };
    return map[code] || code;
  };

    

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] bg-[#111213]/70 backdrop-blur-xl border border-white/10 shadow-2xl"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F5F6F7] mb-2 tracking-tighter">Ancestry Oracle V2</h2>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs sm:text-sm font-bold text-[#4599FF] uppercase tracking-widest">High-Precision Admixture Analysis</p>
            {viewMode === 'wholePanel' && panelMetadata.commercialCoreActive && (
              <div className="flex items-center gap-2 px-2 py-0.5 bg-[#4599FF]/10 border border-[#4599FF]/20 rounded text-[9px] font-black text-[#4599FF] uppercase tracking-wider animate-in fade-in slide-in-from-left-2 duration-500">
                <div className="w-1 h-1 rounded-full bg-[#4599FF] shadow-[0_0_5px_#4599FF]" />
                Multi-Panel Aggregate Active
              </div>
            )}
          </div>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button onClick={() => setViewMode('standard')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'standard' ? 'bg-[#4599FF] text-white' : 'text-slate-400 hover:text-white'}`}>Standard</button>
          <button onClick={() => setViewMode('wholePanel')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'wholePanel' ? 'bg-[#4599FF] text-white' : 'text-slate-400 hover:text-white'}`}>Whole Panel</button>
          {hasEngineData && (
            <button onClick={() => setViewMode('engine')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'engine' ? 'bg-[#4599FF] text-white' : 'text-slate-400 hover:text-white'}`}>GRAF Engine</button>
          )}
        </div>
      </div>
      
      <div className="mb-10 rounded-2xl frosted-glass border border-white/5 text-[#F5F6F7]">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex justify-between items-center p-6 text-left font-bold"
        >
          <h4>
            {viewMode === 'standard' ? 'How this works' : 
             viewMode === 'wholePanel' ? 'Genotype Scout Whole Panel' : 
             'Global Regional Ancestry Factor'}
          </h4>
          {isExpanded ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
        </button>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          className="overflow-hidden"
        >
          <p className="p-6 pt-0 text-sm text-slate-400 leading-relaxed">
            {viewMode === 'standard' ? (
              "The Ancestry Oracle is not a classic \"ethnicity calculator.\" While mainstream services use imputation to fill in genetic gaps based on statistical models, this engine processes your raw, exact genome data. By directly analyzing specific, high-precision Ancestry Informative Markers (AIMs), we produce results that reflect your unique genotype, providing a granular look at your genetic lineage without relying on probabilistic data smoothing."
            ) : viewMode === 'wholePanel' ? (
              `The Whole Panel model uses a Naive Bayes approach with Softmax normalization to compare your genome against the 1000 Genomes Project phase 3 reference database. This method calculates the maximum likelihood of your ancestry across super-populations using ${panelMetadata.markersUsed || 0} high-quality markers aggregated from professional forensic and research panels (NCBI GRAF, VISAGE Forensic, SGDP Precision, and Custom Curated Deep-Ancestry AIMs).`
            ) : (
              "The GRAF (Global Regional Ancestry Factor) engine uses a 10,000 SNP panel to resolve complex admixtures across 26 sub-populations. It employs a Maximum Likelihood estimation based on 1000 Genomes Project phase 3 allele frequencies, providing the highest resolution available for modern ancestry."
            )}
          </p>
        </motion.div>
      </div>

      {viewMode === 'engine' ? (
        <EngineAncestryOracle results={engineAncestry} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-center">
        <div className="h-[300px] sm:h-[450px] lg:col-span-2 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData} margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Ancestry"
                dataKey="A"
                stroke="#4599FF"
                fill="#4599FF"
                fillOpacity={0.3}
              />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc', borderRadius: '1rem', backdropFilter: 'blur(8px)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-4 sm:space-y-6 lg:col-span-1">
          {Object.entries(currentAncestry).map(([name, value]) => (
            <div key={name} className="flex items-center justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#1a1b1d]/70 backdrop-blur-sm border border-white/5 hover:border-[#4599FF]/50 transition-colors">
              <span className="font-bold text-base sm:text-lg text-[#F5F6F7]">{getDisplayName(name)}</span>
              <span className="font-mono font-black text-lg sm:text-xl text-[#4599FF]">{Number(value).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Forensic Detail Section */}
      {panelMetadata.microHaps && panelMetadata.microHaps.length > 0 ? (
        <div className="mt-12 space-y-8">
           {/* MicroHap Signatures */}
           {panelMetadata.microHaps && panelMetadata.microHaps.length > 0 && (
            <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-blue-500/20">
                  <Dna className="w-4 h-4 text-blue-400" />
                </div>
                <h4 className="text-sm font-black text-blue-400 uppercase tracking-widest">Forensic MicroHap Signatures</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {panelMetadata.microHaps.map((mh: any) => (
                  <div key={mh.id} className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-blue-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter font-mono">{mh.id}</span>
                      <span className="text-[10px] font-black text-indigo-400 uppercase">{mh.population}</span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-lg font-black text-[#F5F6F7]">{mh.signature}</span>
                      <span className="text-[10px] font-bold text-slate-500">Ae: {mh.confidence.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
           )}
        </div>
      ) : null}

      {/* Historical Haplotype Tracking for Sickle Cell / HBB */}
      {hbbMigration && (
        <div className="mt-12 p-8 rounded-[2rem] bg-red-500/5 border border-red-500/10 overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <MapPin size={120} />
           </div>
           <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 rounded-lg bg-red-500/20">
                <MapPin className="w-4 h-4 text-red-500" />
              </div>
              <h4 className="text-sm font-black text-red-500 uppercase tracking-widest">Historical Haplotype Tracker</h4>
           </div>
           <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <div className="flex-grow">
                 <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">Variant Lineage Detected</div>
                 <h5 className="text-xl font-black text-white mb-4">{hbbMigration.type} Pattern (HBB)</h5>
                 <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                   {hbbMigration.narrative}
                 </p>
              </div>
              <div className="min-w-[280px] p-6 rounded-2xl bg-black/40 border border-white/5">
                 <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Migration Path</div>
                 <div className="space-y-4">
                    {hbbMigration.path.split('→').map((node, i, arr) => (
                      <div key={node} className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-red-500' : 'bg-slate-700'}`}></div>
                          {i < arr.length - 1 && <div className="w-[1px] h-4 bg-slate-800"></div>}
                        </div>
                        <span className={`text-xs ${i === 0 ? 'font-bold text-slate-200' : 'text-slate-500'}`}>{node.trim()}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </motion.div>
  );
});
