import React, { memo, useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Dna, HelpCircle, MapPin } from 'lucide-react';
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { trackSickleCellHaplotype } from '../utils/ancestry/haplotypeTracker';

const POP_COLORS: Record<string, string> = {
  EUR: '#3b82f6',
  AFR: '#10b981',
  EAS: '#ef4444',
  SAS: '#f59e0b',
  AMR: '#a855f7',
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
  const continentalScores = resultsToDisplay?.continentalScores || {};
  
  const hbbMigration = useMemo(() => {
    return results.userSnps ? trackSickleCellHaplotype(results.userSnps) : null;
  }, [results.userSnps]);

  const chartData = useMemo(() => {
    return Object.entries(continentalScores).map(([key, value]) => ({
      subject: key === 'AMR' ? 'American' : (key === 'EAS' ? 'East Asian' : (key === 'SAS' ? 'South Asian' : (key === 'AFR' ? 'African' : (key === 'EUR' ? 'European' : key)))),
      A: Number(value),
      fullMark: 100,
    }));
  }, [continentalScores]);

  const hasData = Object.keys(continentalScores).length > 0;
  
  if (!hasData) {
    return (
      <div className="p-12 text-center text-slate-500">
        No Ancestry Results Available - Please load and process a valid dataset.
      </div>
    );
  }
  
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
      className="space-y-6 sm:space-y-12"
    >
      {/* Standard Oracle Section */}
      <div className="p-2.5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl bg-[#111213]/70 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl sm:text-4xl font-black text-[#F5F6F7] mb-2 tracking-tighter">Ancestry Oracle V2</h2>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[10px] sm:text-xs font-bold text-[#4599FF] uppercase tracking-widest">High-Precision Admixture Analysis</p>
            </div>
          </div>
        </div>

        {mode === 'analyst' && (
        <div className="mb-10 p-6 rounded-2xl bg-teal-500/5 border border-teal-500/10 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-teal-500/25 transition-all">
          <div className="flex gap-4 items-start text-[#F5F6F7]">
            <Dna className="w-8 h-8 text-teal-400 mt-1 shrink-0" />
            <div>
              <h4 className="font-extrabold text-base tracking-tight mb-1">Non-Negative Least Squares (NNLS) Optimization Oracle</h4>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                The Ancestry Oracle is not a classic "ethnicity calculator." It directly analyzes your exact Ancestry Informative Markers (AIMs) database against modern 1000 Genomes references using raw genetic dosages through Non-Negative Least Squares optimization.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenMethodology}
            className="w-full sm:w-auto shrink-0 px-6 py-3 bg-teal-600/20 hover:bg-teal-600/35 border border-teal-500/30 text-teal-300 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-teal-400" />
            Methodology
          </button>
        </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-center">
          <div className="h-[300px] sm:h-[450px] lg:col-span-2 w-full min-w-0 relative">
            {isChartReady ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300} debounce={1}>
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
            ) : (
              <div className="w-full h-full bg-[#1e293b]/50 rounded-2xl animate-pulse" />
            )}
          </div>
          
          <div className="space-y-4 sm:space-y-6 lg:col-span-1">
            {Object.entries(continentalScores).map(([name, value]) => (
              <div key={name} className="flex items-center justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#1a1b1d]/70 backdrop-blur-sm border border-white/5 hover:border-[#4599FF]/50 transition-colors">
                <span className="font-bold text-base sm:text-lg text-[#F5F6F7]">{getDisplayName(name)}</span>
                <span className="font-mono font-black text-lg sm:text-xl text-[#4599FF]">{(Number(value) || 0).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subpopulation Affinity Section */}
      <div className="p-2.5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl bg-[#111213]/70 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F5F6F7] mb-2 tracking-tighter">Subpopulation Affinity</h2>
            <p className="text-[10px] sm:text-xs font-bold text-[#4599FF] uppercase tracking-widest">Genetic Proximity (Euclidean Distance)</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {(() => {
            const subPops = resultsToDisplay?.subPopulations || {};
            const allPops = Object.values(subPops).flat().sort((a: any, b: any) => a.distance - b.distance).slice(0, 5);
            if (allPops.length === 0) return <div className="text-slate-500 py-4">Insufficient markers to calculate affinities.</div>;
            return allPops.map((pop: any, idx: number) => {
              const maxDistance = 10;
              const closeness = Math.max(0, 100 - (pop.distance / maxDistance) * 100);
              return (
                <div key={pop.name} className="flex flex-col space-y-2 group">
                  <div className="flex justify-between items-end">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] font-black text-[#4599FF] w-4">{idx + 1}</span>
                      <span className="text-sm font-black text-[#F5F6F7] group-hover:text-[#4599FF] transition-colors">{formatPopName(pop.name)}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Distance</div>
                      <div className="text-sm font-mono font-black text-slate-300">{(pop.distance || 0).toFixed(3)}</div>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${closeness}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 }}
                      className={`h-full rounded-full ${
                        pop.distance < 3 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
                        pop.distance < 6 ? 'bg-[#4599FF]' : 'bg-slate-500'
                      }`}
                    />
                  </div>
                </div>
              );
            });
          })()}
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
                 <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Migration Path</div>
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
