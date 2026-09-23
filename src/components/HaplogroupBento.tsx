import React, { memo } from 'react';
import { MapPin, ShieldAlert, Sparkles, Dna } from 'lucide-react';

interface PredictedMtDNA {
  predicted: string | null;
  path: string[];
  region?: string;
  description?: string;
  testedMarkers: any[];
  userMutations: string[];
  score: number;
  deepMatches: any[];
  tmrca?: {
    formattedTmrcaAge?: string;
    calibratedEraBceCe?: string;
    activeHistoricalEra?: { name: string };
  };
  empopQc?: {
    overallStatus: string;
    forensicCoherenceScorePct: number;
  };
}

interface HaplogroupBentoProps {
  predictedMt?: PredictedMtDNA;
}

export const HaplogroupBento = memo(({ predictedMt }: HaplogroupBentoProps) => {
  const haploCode = typeof predictedMt?.predicted === 'string'
    ? predictedMt.predicted
    : ((predictedMt as any)?.predicted?.name || (predictedMt as any)?.haplogroup || null);

  if (!predictedMt || !haploCode) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group flex flex-col h-full min-h-[300px]">
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
          <ShieldAlert className="w-12 h-12 text-slate-500 mb-3 dark:text-slate-400" />
          <div className="text-lg font-bold text-slate-300 mb-2">Lineage Unresolved</div>
          <p className="text-xs text-slate-400 px-4 max-w-sm">
            We could not confidently determine a maternal founder group based on your provided markers.
          </p>
        </div>
      </div>
    );
  }

  const isDeep = (predictedMt.path || []).length > 3;

  return (
    <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 relative overflow-hidden group shadow-2xl transition-all duration-700 hover:shadow-[0_0_50px_rgba(14,165,233,0.2)] hover:border-[#4599FF]/20 hover:-translate-y-1 flex flex-col h-full min-h-[300px]">
      
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4599FF]/5 via-transparent to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#4599FF]/10 rounded-full blur-[80px] pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-[#4599FF]/20 to-sky-400/20 p-2 rounded-xl border border-[#4599FF]/10">
            <Sparkles className="w-5 h-5 text-[#4599FF]" />
          </div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
            Maternal Haplogroup Oracle
          </h3>
        </div>
        {isDeep && (
          <div className="px-2.5 py-1 rounded-full bg-[#4599FF]/10 border border-[#4599FF]/20 text-[10px] font-bold text-[#4599FF] uppercase tracking-widest animate-pulse">
            High Resolution
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 mt-4 mb-4 min-w-0 w-full overflow-hidden">
        <div className="relative mb-2 max-w-full">
          <div className="text-3xl sm:text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 tracking-tighter break-words max-w-full px-2" title={haploCode}>
            {haploCode}
          </div>
          <div className="absolute -inset-4 bg-[#4599FF]/20 blur-2xl -z-10 rounded-full pointer-events-none" />
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 max-w-full min-w-0 px-2">
          {predictedMt.region && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#4599FF] uppercase tracking-wider bg-[#4599FF]/10 px-3 py-1 rounded-full border border-[#4599FF]/20 max-w-full min-w-0 break-words" title={predictedMt.region}>
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="break-words">{predictedMt.region}</span>
            </div>
          )}
          {predictedMt.tmrca && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 max-w-full min-w-0 break-words" title={`${predictedMt.tmrca.formattedTmrcaAge} (${predictedMt.tmrca.activeHistoricalEra?.name?.split('(')[0]?.trim()})`}>
              <Sparkles className="w-3 h-3 shrink-0" />
              <span className="break-words">{predictedMt.tmrca.formattedTmrcaAge} ({predictedMt.tmrca.activeHistoricalEra?.name?.split('(')[0]?.trim()})</span>
            </div>
          )}
          {predictedMt.empopQc && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 max-w-full min-w-0 break-words" title={`EMPOP: ${predictedMt.empopQc.forensicCoherenceScorePct}% Coherent`}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="break-words">EMPOP: {predictedMt.empopQc.forensicCoherenceScorePct}% Coherent</span>
            </div>
          )}
        </div>

        <p className="text-sm text-slate-300 leading-relaxed px-2 sm:px-6 mb-6 whitespace-normal break-words">
          {predictedMt.description || "An ancient maternal founder branch identified by your mitochondrial DNA mutations."}
        </p>

        <div className="w-full mt-auto grid grid-cols-3 gap-2 border-t border-slate-200/50 dark:border-white/10 pt-4 px-1 min-w-0">
          <div className="flex flex-col text-left min-w-0 overflow-hidden">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5 dark:text-slate-400 truncate" title="Phylo Score">Phylo Score</span>
            <span className="text-sm font-black text-[#4599FF] tabular-nums truncate">{(predictedMt.score ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex flex-col text-center min-w-0 overflow-hidden">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5 dark:text-slate-400 truncate" title="Path Depth">Path Depth</span>
            <span className="text-sm font-black text-indigo-400 tabular-nums truncate">{(predictedMt.path || []).length} Steps</span>
          </div>
          <div className="flex flex-col text-right min-w-0 overflow-hidden">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1 justify-end dark:text-slate-400 truncate" title="Processed">
              <Dna className="w-3 h-3 shrink-0"/> <span className="truncate">Processed</span>
            </span>
            <span className="text-sm font-black text-emerald-500 tabular-nums truncate">
              {(Array.isArray(predictedMt.testedMarkers) ? predictedMt.testedMarkers.length : 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      
    </div>
  );
});
