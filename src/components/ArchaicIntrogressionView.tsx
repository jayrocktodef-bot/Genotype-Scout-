import React, { memo } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Info, Flame, Shield, Snowflake, Brain } from 'lucide-react';
import { ArchaicIntrogressionResult } from '../lib/AncientAdmixtureCalculator';

interface ArchaicIntrogressionViewProps {
  results: ArchaicIntrogressionResult | null;
}

export const ArchaicIntrogressionView: React.FC<ArchaicIntrogressionViewProps> = memo(({ results }) => {
  if (!results || !results.details || results.details.length === 0) return null;

  // Find icons based on genes for a premium vibe
  const getGeneIcon = (gene: string) => {
    switch (gene.toUpperCase()) {
      case 'BNC2': return <Snowflake size={16} className="text-sky-400 animate-pulse" />;
      case 'OAS1': return <Shield size={16} className="text-emerald-400" />;
      case 'TLR1': return <ShieldAlert size={16} className="text-teal-400" />;
      case 'AHR': return <Flame size={16} className="text-orange-400" />;
      default: return <Brain size={16} className="text-purple-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] bg-[#141517] border border-purple-950/20 shadow-2xl relative overflow-hidden"
    >
      {/* Glow effect */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F5F6F7] mb-1 tracking-tighter">Archaic Hominin Introgression</h2>
            <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">Neanderthal & Denisovan Evolutionary Legacy</p>
          </div>
          
          <div className="flex items-center gap-4 bg-black/40 px-6 py-4 rounded-2xl border border-white/5 shadow-inner">
            <div className="text-right">
              <span className="block text-3xl font-black text-purple-400 leading-none tracking-tighter">
                {results.score.toFixed(1)}%
              </span>
              <span className="text-[9px] uppercase font-black tracking-widest text-slate-500">
                Archaic Allele Index
              </span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-left text-[10px] text-slate-400 leading-tight">
              <strong>{results.carriedAlleles} of {results.comparedMarkers * 2}</strong> alleles<br />
              detected as introgressed
            </div>
          </div>
        </div>

        {/* Introgression context gauge */}
        <div className="mb-10 bg-black/30 p-5 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
            <span>Introgression Level compared to modern reference populations</span>
            <span className="text-purple-400">
              {results.score > 25 ? 'High Carrier' : results.score > 10 ? 'Average Carrier' : 'Low Carrier'}
            </span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden relative">
            {/* Average carrier bar */}
            <div className="absolute left-[8%] right-[70%] h-full bg-slate-800 border-l border-r border-slate-700" title="Expected average range for non-Africans" />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${results.score}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)] z-10 relative"
            />
          </div>
          <div className="flex justify-between text-[8px] font-mono text-slate-500 mt-1.5 uppercase font-bold">
            <span>0% (Typical African baseline)</span>
            <span>10% - 25% (Average Non-African)</span>
            <span>50%+ (High Introgression Haplotype)</span>
          </div>
        </div>

        {/* Variant Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {results.details.map((item, idx) => (
            <motion.div
              key={item.rsid}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="p-5 rounded-xl bg-black/20 border border-white/5 hover:border-purple-500/20 transition-all flex flex-col justify-between"
            >
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                    {getGeneIcon(item.gene)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-[#F5F6F7]">{item.gene}</h4>
                      <span className="text-[8px] font-mono text-slate-500">{item.rsid}</span>
                    </div>
                    <p className="text-[10px] text-slate-450 leading-tight font-semibold truncate mt-0.5">{item.trait}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-black text-[#F5F6F7] bg-slate-900 border border-white/5 px-2 py-0.5 rounded">
                    {item.userGenotype}
                  </span>
                  <span className={`block text-[8px] font-black uppercase tracking-wider mt-1 ${
                    item.hasDerived 
                      ? 'text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded' 
                      : 'text-slate-600'
                  }`}>
                    {item.hasDerived ? 'Archaic Carrier' : 'Ancestral'}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-normal italic mt-2 border-t border-white/5 pt-3">
                "{item.history}"
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl flex items-start gap-3 text-left">
          <Info size={16} className="text-purple-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
            Neanderthal variants entered the modern human gene pool through interbreeding events in Western Asia approximately 50,000–60,000 years ago. These introgressed mutations have been retained because they provided survival benefits, particularly in skin barrier function, cold adaptation, and innate immune defense.
          </p>
        </div>
      </div>
    </motion.div>
  );
});
