import React, { memo } from 'react';
import { PrsTraitResult } from '../services/prsEngine';
import { Activity, ShieldAlert, HeartPulse, Dna } from 'lucide-react';

interface PolygenicScoresProps {
  prsResults?: PrsTraitResult[];
}

export const PolygenicScores = memo(({ prsResults }: PolygenicScoresProps) => {
  if (!prsResults || prsResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
        <ShieldAlert className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-xl font-black text-slate-700 dark:text-slate-300 mb-2">PRS Engine Not Available</h3>
        <p className="text-sm text-slate-500 max-w-md dark:text-slate-400">
          Your raw DNA file does not contain enough matching markers to calculate Polygenic Risk Scores accurately.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-[#111213] p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-2xl">
              <Activity className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Polygenic Risk Scores</h2>
              <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mt-1">Clinical Prediction Engine</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Polygenic Risk Scores (PRS) calculate your genetic predisposition to complex traits by combining the effects of dozens of genetic variants. Your scores are normalized against global population distributions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prsResults.map((result, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-full mb-3 inline-block">
                  {result.category}
                </span>
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">{result.traitName}</h3>
              </div>
              <div className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${
                result.riskLevel === 'High' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20' :
                result.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' :
                'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}>
                {result.riskLevel} Risk
              </div>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed flex-1">
              {result.description}
            </p>

            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-5 mb-4 relative overflow-hidden border border-slate-100 dark:border-slate-800/50">
              <div className="flex justify-between items-end mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Population Percentile</span>
                <span className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                  {result.percentile.toFixed(1)}<span className="text-sm text-slate-400">th</span>
                </span>
              </div>
              
              {/* Distribution Bar */}
              <div className="relative h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 w-full opacity-30" />
                <div 
                  className={`absolute top-0 bottom-0 w-1 ${
                    result.riskLevel === 'High' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' :
                    result.riskLevel === 'Low' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' :
                    'bg-slate-800 dark:bg-slate-200 shadow-[0_0_10px_rgba(100,116,139,0.5)]'
                  } z-10 transition-all duration-1000`}
                  style={{ left: `${Math.max(0, Math.min(100, result.percentile))}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Low Risk (0%)</span>
                <span>Average (50%)</span>
                <span>High Risk (100%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <HeartPulse className="w-3.5 h-3.5 text-indigo-400" /> Z-Score: {result.zScore.toFixed(2)}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Dna className="w-3.5 h-3.5" />
                {result.snpsTested} / {result.totalSnps} Markers
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
});
