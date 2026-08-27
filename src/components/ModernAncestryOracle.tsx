import React, { memo, useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Dna, HelpCircle, MapPin } from 'lucide-react';
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { trackSickleCellHaplotype } from '../utils/ancestry/haplotypeTracker';

const POP_COLORS: Record<string, string> = {
  EUR: '#3b82f6',
  AFR: '#10b981',
  AFRAM: '#059669',
  EAS: '#ef4444',
  SAS: '#f59e0b',
  AMR: '#a855f7',
  AMER: '#db2777',
  OCE: '#06b6d4',
  MID: '#f97316'
};

const MODERN_POP_NAMES: Record<string, string> = {
  'Nilotic-Omotic': 'East African (Nilotic)',
  'Ancestral-South-Indian': 'South Asian (Dravidian)',
  'North-European-Baltic': 'North European & Baltic',
  'Uralic': 'Siberian & Uralic',
  'Australo-Melanesian': 'Australo-Melanesian',
  'East-Siberean': 'East Siberian',
  'Ancestral-Yayoi': 'Japanese (Yayoi)',
  'Caucasian-Near-Eastern': 'Caucasus & Near East',
  'Tibeto-Burman': 'Tibeto-Burman',
  'Austronesian': 'Southeast Asian (Austronesian)',
  'Central-African-Pygmean': 'Central African (Pygmy)',
  'Central-African-Hunter-Catherers': 'Central African Hunter-Gatherers',
  'Nilo-Sahrian': 'Nilo-Saharan',
  'North-African': 'North African',
  'Gedrosia-Caucasian': 'Caucasus & West Asian',
  'Cushitic': 'East African (Cushitic)',
  'Congo-Pygmean': 'Congo Basin (Pygmy)',
  'Bushmen': 'South African (Khoisan)',
  'South-Meso-Amerindian': 'Mesoamerican & South Amerindian',
  'South-West-European': 'Southwest European',
  'North-Amerindian': 'North Amerindian',
  'Arabic': 'Arabian',
  'North-Circumpolar': 'Arctic & Circumpolar',
  'Kalash': 'Hindukush (Kalash)',
  'Papuan-Australian': 'Papuan & Australian',
  'Baltic-Finnic': 'Baltic Finnic',
  'Bantu': 'West/Central African (Bantu)'
};

const formatPopName = (name: string) => {
  if (!name) return 'Unknown';
  return MODERN_POP_NAMES[name] || name.replace(/-/g, ' ');
};

interface Segment {
  continent: string;
  start: number;
  end: number;
  confidence: number;
}

export const ModernAncestryOracle = memo(({ 
  results,
  dataset,
  onOpenMethodology,
  mode = 'explorer'
}: { 
  results: any;
  dataset?: any;
  onOpenMethodology?: () => void;
  mode?: 'explorer' | 'analyst';
}) => {
  const [isChartReady, setIsChartReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsChartReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const [viewMode] = useState<'primary'>('primary');
  const [exporting] = useState(false);

  const runHighResAnalysis = async () => {};
  const segmentsToPainter = null;

  const exportAncestryReport = async () => {};
  
  const resultsToDisplay = results?.primary;

  const subpopulationScores = useMemo(() => {
    // 1. Prefer high-precision NNLS subpopulation admixture mix from subpopulationOracle
    const subOracle = dataset?.analysis?.subpopulationOracle || results?.subpopulationOracle;
    const mix = subOracle?.all?.admixtureMix || subOracle?.admixtureMix;
    if (mix && Array.isArray(mix) && mix.length > 0) {
      const scores: Record<string, number> = {};
      mix.forEach((item: any) => {
        const name = item.name || item.subpop || item.popCode;
        if (name && item.percentage > 0.1) {
          scores[name] = Number(item.percentage);
        }
      });
      if (Object.keys(scores).length > 0) return scores;
    }

    // 2. Fallback to breakdown or primary continentalScores with humanized names
    const breakdown = subOracle?.all?.breakdown || subOracle?.breakdown;
    if (breakdown && Array.isArray(breakdown) && breakdown.length > 0) {
      const scores: Record<string, number> = {};
      breakdown.slice(0, 10).forEach((item: any) => {
        const name = item.subpop || item.name || item.popCode;
        if (name) {
          scores[name] = Number(item.similarityScore || item.percentage || 0);
        }
      });
      if (Object.keys(scores).length > 0) return scores;
    }

    // 3. Fallback to resultsToDisplay.continentalScores
    const rawScores = resultsToDisplay?.continentalScores || {};
    const mappedScores: Record<string, number> = {};
    const macroMap: Record<string, string> = {
      'EUR': 'European',
      'AFR': 'African',
      'AFRAM': 'African-American',
      'EAS': 'East Asian',
      'SAS': 'South Asian',
      'AMR': 'Indigenous American',
      'AMER': 'Admixed American',
      'MENA': 'Middle Eastern / North African',
      'OCE': 'Oceanian',
      'CAS': 'Central Asian & Siberian'
    };
    Object.entries(rawScores).forEach(([k, v]) => {
      const label = macroMap[k] || k;
      mappedScores[label] = Number(v);
    });
    return mappedScores;
  }, [dataset, results, resultsToDisplay]);
  
  const hbbMigration = useMemo(() => {
    return results.userSnps ? trackSickleCellHaplotype(results.userSnps) : null;
  }, [results.userSnps]);

  const chartData = useMemo(() => {
    return Object.entries(subpopulationScores).map(([label, value]) => ({
      subject: label,
      A: Number(value),
      fullMark: 100,
    }));
  }, [subpopulationScores]);

  const hasData = Object.keys(subpopulationScores).length > 0;
  
  if (!hasData) {
    return (
      <div className="p-12 text-center text-slate-500 dark:text-slate-400">
        No Ancestry Results Available - Please load and process a valid dataset.
      </div>
    );
  }
  
  const getDisplayName = (code: string) => {
    return code;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:space-y-12"
    >
      {/* Standard Oracle Section */}
      <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#111213]/70 backdrop-blur-xl border border-white/10 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2 border-b border-white/5 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#F5F6F7] tracking-tight">Ancestry Oracle V2</h2>
            <p className="text-[10px] sm:text-xs font-bold text-[#4599FF] uppercase tracking-widest">High-Precision Admixture Analysis</p>
          </div>
        </div>

        {mode === 'analyst' && (
        <div className="mb-4 p-3.5 rounded-xl bg-teal-500/5 border border-teal-500/10 flex flex-col sm:flex-row items-center justify-between gap-3 hover:border-teal-500/25 transition-all">
          <div className="flex gap-3 items-center text-[#F5F6F7]">
            <Dna className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <h4 className="font-extrabold text-xs tracking-tight">Non-Negative Least Squares (NNLS) Optimization Oracle</h4>
              <p className="text-xs text-slate-400 leading-normal max-w-xl">
                Directly analyzes your exact Ancestry Informative Markers (AIMs) against modern 1000 Genomes reference vectors using Non-Negative Least Squares optimization.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenMethodology}
            className="w-full sm:w-auto shrink-0 px-3.5 py-1.5 bg-teal-600/20 hover:bg-teal-600/35 border border-teal-500/30 text-teal-300 font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
            Methodology
          </button>
        </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 items-center">
          <div className="h-[320px] sm:h-[480px] lg:col-span-2 w-full min-w-0 relative bg-black/20 rounded-xl p-1.5 sm:p-2 border border-white/5">
            {isChartReady ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300} debounce={1}>
                <RadarChart cx="50%" cy="50%" outerRadius={window.innerWidth < 640 ? "68%" : "85%"} data={chartData} margin={{ top: 10, right: 15, bottom: 10, left: 15 }}>
                  <PolarGrid stroke="#334155" strokeWidth={1.2} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: window.innerWidth < 640 ? 9 : 11, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Ancestry"
                    dataKey="A"
                    stroke="#4599FF"
                    fill="#4599FF"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#4599FF', color: '#f8fafc', borderRadius: '0.75rem', backdropFilter: 'blur(8px)', fontSize: '0.75rem' }} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-[#1e293b]/50 rounded-xl animate-pulse" />
            )}
          </div>
          
          <div className="space-y-1.5 sm:space-y-2 lg:col-span-1 max-h-[320px] sm:max-h-[480px] overflow-y-auto pr-1">
            {Object.entries(subpopulationScores).map(([name, value]) => (
              <div key={name} className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[#1a1b1d]/70 backdrop-blur-sm border border-white/5 hover:border-[#4599FF]/50 transition-colors min-h-[44px]">
                <span className="font-bold text-xs sm:text-sm text-[#F5F6F7] whitespace-normal break-words max-w-none mr-2">{getDisplayName(name)}</span>
                <span className="font-mono font-bold text-xs sm:text-base text-[#4599FF] shrink-0 ml-2">{(Number(value) || 0).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* Historical Haplotype Tracking for Sickle Cell / HBB */}
      {hbbMigration && (
        <div className="mt-12 p-2.5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-red-500/5 border border-red-500/10 overflow-hidden relative group">
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
              <div className="w-full md:min-w-[280px] md:w-auto p-6 rounded-2xl bg-black/40 border border-white/5">
                 <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 dark:text-slate-400">Migration Path</div>
                 <div className="space-y-4">
                    {hbbMigration.path.split('→').map((node, i, arr) => (
                      <div key={i} className="flex items-center gap-3">
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
