import React, { useMemo } from 'react';
import { Shield, Info, Activity, AlertTriangle, Fingerprint, Map } from 'lucide-react';
import { computeEasternWoodlandsProxy } from '../engines/ancestry/easternWoodlandsProxy';

interface Props {
  dataset: any;
  oracleResults: any;
}

export const EasternWoodlandsProxyBento: React.FC<Props> = ({ dataset, oracleResults }) => {
  const result = useMemo(() => {
    return computeEasternWoodlandsProxy(dataset);
  }, [dataset]);

  const onnxEas = (oracleResults?.modern?.proportions?.EAS || 0);
  const hasEastAsianOverlap = onnxEas > 0.05;

  return (
    <div className="xl:col-span-12 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900/60 backdrop-blur-md border border-emerald-500/20 p-5 shadow-xl min-w-0 overflow-hidden relative mt-6">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-4 border-b border-emerald-500/20 pb-3 relative z-10">
        <Map className="w-4 h-4 text-emerald-400 shrink-0" />
        <div>
          <h3 className="text-xs font-black text-emerald-300 uppercase tracking-wider">
            Eastern Woodlands Proxy Signal
          </h3>
          <p className="text-[9px] text-emerald-200/60 mt-0.5">
            Directional proxy analysis on the North-South indigenous cline.
          </p>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Result & Confidence */}
        <div className="space-y-4">
          <div className="bg-black/20 rounded-xl p-4 border border-emerald-500/10">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Directional Alignment
            </h4>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2 capitalize">
              <Activity className="w-4 h-4 text-emerald-400" />
              {result.direction.replace('-', ' ')}
            </div>
            
            <div className="mt-3 text-xs text-slate-400">
              {result.message}
            </div>
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-3 text-xs text-amber-200">
            <Info className="w-4 h-4 shrink-0 text-amber-400" />
            <div className="space-y-2">
              <p><strong>Reference Gap Disclosure:</strong> This signal is compared against Central/South American references and ancient North American genomes (Scheib et al. 2018); <strong>no modern Northeastern Woodlands reference exists</strong> in the public domain.</p>
              <p><strong>Genealogical Next Steps:</strong> Genetic testing cannot name a tribe or assign community belonging. Your next steps for confirming Native heritage should be genealogical (older relatives, paper trail, community records).</p>
            </div>
          </div>

          {hasEastAsianOverlap && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex gap-3 text-xs text-rose-200 mt-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <p><strong>Confounding Factor:</strong> Elevated East Asian signal detected. These populations share deep ancient ancestry, which can confound Native American proxy signals.</p>
            </div>
          )}
        </div>

        {/* Right Col: Components */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
            Component Analysis
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-lg p-2.5">
              <span className="text-[11px] font-semibold text-slate-300">Proxy Marker Dosage</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                {result.score.toFixed(2)} / 1.00
              </span>
            </div>
            
            <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-lg p-2.5">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                Target SNPs Analyzed
                <Shield className="w-3 h-3 text-emerald-400" />
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border text-slate-400 bg-slate-800 border-white/10">
                {result.snpsDetected} found
              </span>
            </div>
            
            <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-700/50">
              <p className="text-[10px] text-slate-500 leading-relaxed">
                This algorithm measures allele frequencies along a North-South cline across the Americas, anchoring on ancient southwestern Ontario genomes and excluding markers driven by European admixture. Due to the lack of modern references from the US Eastern Woodlands, results are strictly directional and cannot provide percentages or tribal affiliations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
