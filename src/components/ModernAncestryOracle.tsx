import React, { memo, useMemo, useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, Dna, History, User, MapPin, Download, Share2, FileImage, Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { trackSickleCellHaplotype } from '../utils/ancestry/haplotypeTracker';
import { ChromosomePainter, ChromosomePainterRef } from './ChromosomePainter';
import { workerPoolEngine } from '../engines/ancestry/workerPoolEngine';
import { POPULATION_MAP } from '../utils/populationMapper';
import jsPDF from 'jspdf';

export const ModernAncestryOracle = memo(({ 
  results,
  onOpenMethodology
}: { 
  results: any;
  onOpenMethodology?: () => void;
}) => {
  const [isChartReady, setIsChartReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsChartReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const [viewMode] = useState<'primary'>('primary');
  const [exporting] = useState(false);
  const [calculatingLAI] = useState(false);
  const [localSegments] = useState<any>(null);

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
      <div className="p-4 sm:p-8 md:p-12 rounded-3xl bg-[#111213]/70 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl sm:text-4xl font-black text-[#F5F6F7] mb-2 tracking-tighter">Ancestry Oracle V2</h2>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[10px] sm:text-xs font-bold text-[#4599FF] uppercase tracking-widest">High-Precision Admixture Analysis</p>
            </div>
          </div>
        </div>

        <>
        <div className="mb-10 p-6 rounded-2xl bg-teal-500/5 border border-teal-500/10 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-teal-500/25 transition-all">
          <div className="flex gap-4 items-start text-[#F5F6F7]">
            <Dna className="w-8 h-8 text-teal-400 mt-1 shrink-0" />
            <div>
              <h4 className="font-extrabold text-base tracking-tight mb-1">Euclidean Distance High Resolution Oracle</h4>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                The Ancestry Oracle is not a classic "ethnicity calculator." It directly analyzes your exact Ancestry Informative Markers (AIMs) database against modern 1000 Genomes references using raw genetic dosages.
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
        </>
      </div>


      {/* Forensic Detail Section */}
      {/* Whole panel details removed */}

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
