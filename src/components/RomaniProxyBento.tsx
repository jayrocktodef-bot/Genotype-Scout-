import React, { useMemo } from 'react';
import { Shield, Info, Activity, AlertTriangle, Fingerprint } from 'lucide-react';
import { ParsedGenomicDataset } from '../services/parser/types';
import { RohDetector } from '../engines/ancestry/rohDetector';
import { computeRomaniProxySignal } from '../engines/ancestry/romaniProxy';

interface Props {
  dataset: any;
}

export const RomaniProxyBento: React.FC<Props> = ({ dataset }) => {
  const result = useMemo(() => {
    // Run RohDetector for F_ROH
    const rohDetector = new RohDetector();
    const rohResult = rohDetector.detect(dataset);

    const yDnaPath = dataset.predictedYDNA?.path || [];
    const mtDnaPath = dataset.predictedMtDNA?.path || [];

    return computeRomaniProxySignal(dataset, rohResult, yDnaPath, mtDnaPath);
  }, [dataset]);

  if (result.confidenceTier === 'None') return null;

  return (
    <div className="xl:col-span-12 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900/60 backdrop-blur-md border border-indigo-500/20 p-5 shadow-xl min-w-0 overflow-hidden relative">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-4 border-b border-indigo-500/20 pb-3 relative z-10">
        <Fingerprint className="w-4 h-4 text-indigo-400 shrink-0" />
        <div>
          <h3 className="text-xs font-black text-indigo-300 uppercase tracking-wider">
            Proxy Ancestry Signal
          </h3>
          <p className="text-[9px] text-indigo-200/60 mt-0.5">
            Composite genetic pattern analysis (v0).
          </p>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Result & Confidence */}
        <div className="space-y-4">
          <div className="bg-black/20 rounded-xl p-4 border border-indigo-500/10">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Detection Result
            </h4>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              Pattern Consistent With Romani Origins
            </div>
            
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Tier: {result.confidenceTier}
            </div>
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-3 text-xs text-amber-200">
            <Info className="w-4 h-4 shrink-0 text-amber-400" />
            <div className="space-y-1">
              <p><strong>Important Context:</strong> This is a proxy signal.</p>
              <p className="opacity-90 leading-relaxed">
                This algorithm detects elevated Northwestern Indian (Punjabi/Gujarati) genetic affinity. In users with predominant European ancestry, this proxy cannot reliably distinguish genuine Romani origins from other forms of recent South Asian admixture.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Components & Corroborators */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
            Component Analysis
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-lg p-2.5">
              <span className="text-[11px] font-semibold text-slate-300">NW Indian Ancestry Trace</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                Score: {(result.score * 100).toFixed(1)}% (Ranked)
              </span>
            </div>

            <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-lg p-2.5">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                Endogamy Signature (F_ROH)
                {result.fRoh >= 0.012 && <AlertTriangle className="w-3 h-3 text-amber-400" />}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${result.fRoh >= 0.012 ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-slate-400 bg-slate-800 border-white/10'}`}>
                {(result.fRoh * 100).toFixed(2)}%
              </span>
            </div>

            <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-lg p-2.5">
              <span className="text-[11px] font-semibold text-slate-300">Corroborating Uniparental Markers</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${result.yDnaMatch || result.mtDnaMatch ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-slate-400 bg-slate-800 border-white/10'}`}>
                {result.yDnaMatch || result.mtDnaMatch ? 'DETECTED' : 'NOT DETECTED'}
              </span>
            </div>

            {result.directSnpsDetected.length > 0 && (
              <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-lg p-2.5">
                <span className="text-[11px] font-semibold text-rose-300 flex items-center gap-1.5">
                  Direct Selected Loci (Non-Neutral)
                  <Shield className="w-3 h-3 text-rose-400" />
                </span>
                <div className="flex gap-1 text-[9px] font-mono">
                  {result.directSnpsDetected.map(snp => (
                    <span key={snp} className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded">
                      {snp}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
