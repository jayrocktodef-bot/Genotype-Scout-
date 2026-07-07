import React, { memo } from 'react';
import { MapPin, ShieldAlert, Sparkles, Dna, CheckCircle2, ShieldX } from 'lucide-react';

interface PredictedYDNA {
  predicted?: { name: string; marker: string; continent: string; description: string } | null;
  path: string[];
  testedMarkers: any[];
  isoggMatches: any[];
  phase2?: {
    haplogroup: string;
    confidence: number;
    coverage: number;
    derivedMarkers: number;
    ancestralMarkers: number;
    rejectedBranches: string[];
    region?: string;
    description?: string;
  };
}

interface YDNABentoProps {
  yData?: PredictedYDNA;
}

export const YDNABento = memo(({ yData }: YDNABentoProps) => {
  if (!yData || (!yData.predicted && !yData.phase2)) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group flex flex-col h-full min-h-[300px]">
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
          <ShieldAlert className="w-12 h-12 text-slate-500 mb-3 dark:text-slate-400" />
          <div className="text-lg font-bold text-slate-300 mb-2">Paternal Lineage Unresolved</div>
          <p className="text-xs text-slate-400 px-4 max-w-sm">
            We could not confidently determine a paternal founder group. This usually happens if the uploaded DNA is from a female sample (lacking a Y-chromosome) or if the Y-DNA markers on the microarray chip were too sparse.
          </p>
        </div>
      </div>
    );
  }

  const isDeep = !!yData.phase2 || (yData.predicted && yData.predicted.name.length > 5);
  
  const displayHaplogroup = yData.phase2?.haplogroup || yData.predicted?.name || 'Unknown';
  const displayRegion = yData.phase2?.region || yData.predicted?.continent;
  const displayDescription = yData.phase2?.description || yData.predicted?.description || 'An ancient paternal founder branch identified by your Y-chromosome DNA mutations.';
  
  // Metrics
  const totalTested = yData.testedMarkers ? yData.testedMarkers.length : 0;
  const coverage = yData.phase2 ? yData.phase2.coverage : Math.min(100, Math.max(5, (totalTested / 500) * 100));
  const confidence = yData.phase2 ? yData.phase2.confidence : (totalTested > 50 ? 95 : 85);
  const derived = yData.phase2 ? yData.phase2.derivedMarkers : yData.testedMarkers.filter(m => m.isDerived).length;

  return (
    <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 relative overflow-hidden group shadow-2xl transition-all duration-700 hover:shadow-[0_0_50px_rgba(20,184,166,0.2)] hover:border-teal-500/20 hover:-translate-y-1 flex flex-col h-full min-h-[300px]">
      
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-[#14B8A6]/20 to-teal-400/20 p-2 rounded-xl border border-[#14B8A6]/10">
            <Sparkles className="w-5 h-5 text-[#14B8A6]" />
          </div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
            Paternal Haplogroup Oracle
          </h3>
        </div>
        {isDeep && (
          <div className="px-2.5 py-1 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/20 text-[10px] font-bold text-[#14B8A6] uppercase tracking-widest animate-pulse">
            High Resolution
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 mt-4 mb-4">
        <div className="relative mb-2">
          <div className="text-6xl sm:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 tracking-tighter">
            {displayHaplogroup}
          </div>
          <div className="absolute -inset-4 bg-[#14B8A6]/20 blur-2xl -z-10 rounded-full" />
        </div>
        
        {displayRegion && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#14B8A6] uppercase tracking-widest mb-4 bg-[#14B8A6]/10 px-3 py-1 rounded-full border border-[#14B8A6]/20">
            <MapPin className="w-3 h-3" />
            {displayRegion}
          </div>
        )}

        <p className="text-sm text-slate-300 leading-relaxed px-2 sm:px-6 mb-6 line-clamp-3">
          {displayDescription}
        </p>

        <div className="w-full mt-auto flex items-center justify-between border-t border-slate-200/50 pt-4 px-2">
          {yData.phase2 && (
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5 dark:text-slate-400">Confidence</span>
              <span className="text-sm font-black text-[#14B8A6]">{confidence.toFixed(1)}%</span>
            </div>
          )}
          <div className="flex flex-col text-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5 dark:text-slate-400">Path Depth</span>
            <span className="text-sm font-black text-indigo-400">{yData.path.length} Steps</span>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5 dark:text-slate-400">Coverage</span>
            <span className="text-sm font-black text-emerald-400">{coverage.toFixed(1)}%</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1 justify-end dark:text-slate-400"><Dna className="w-3 h-3"/> Processed</span>
            <span className="text-sm font-black text-blue-400">{totalTested.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
    </div>
  );
});
