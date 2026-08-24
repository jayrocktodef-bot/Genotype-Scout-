import React, { memo, useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Info, Flame, Shield, Snowflake, Brain, Mountain, Dna, Filter } from 'lucide-react';
import { ArchaicIntrogressionResult } from '../lib/AncientAdmixtureCalculator';

interface ArchaicIntrogressionViewProps {
  results: ArchaicIntrogressionResult | null;
}

export const ArchaicIntrogressionView: React.FC<ArchaicIntrogressionViewProps> = memo(({ results }) => {
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'Neanderthal' | 'Denisovan'>('ALL');
  const [carrierOnly, setCarrierOnly] = useState<boolean>(false);

  if (!results || !results.details || results.details.length === 0) return null;

  const filteredDetails = results.details.filter(item => {
    if (sourceFilter !== 'ALL' && item.source !== sourceFilter) return false;
    if (carrierOnly && !item.hasDerived) return false;
    return true;
  });

  const getGeneIcon = (gene: string, source: 'Neanderthal' | 'Denisovan') => {
    if (source === 'Denisovan') {
      if (gene.toUpperCase().includes('EPAS1')) return <Mountain size={16} className="text-cyan-400 animate-pulse" />;
      return <Dna size={16} className="text-teal-400" />;
    }
    switch (gene.toUpperCase()) {
      case 'BNC2': return <Snowflake size={16} className="text-sky-400 animate-pulse" />;
      case 'OAS1': return <Shield size={16} className="text-emerald-400" />;
      case 'TLR1': return <ShieldAlert size={16} className="text-amber-400" />;
      case 'AHR': return <Flame size={16} className="text-orange-400" />;
      default: return <Brain size={16} className="text-purple-400" />;
    }
  };

  const neanderthalData = results.neanderthal || {
    score: (results.carriedAlleles / Math.max(1, results.comparedMarkers * 2)) * 100,
    comparedMarkers: results.comparedMarkers,
    carriedAlleles: results.carriedAlleles,
    percentile: 'Average non-African'
  };

  const denisovanData = results.denisovan || {
    score: 0,
    comparedMarkers: 0,
    carriedAlleles: 0,
    percentile: 'Trace / Asian baseline'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] bg-[#141517] border border-purple-950/20 shadow-2xl relative overflow-hidden"
    >
      {/* Glow background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Archaic Hominin Detector
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F5F6F7] tracking-tighter">
              Neanderthal & Denisovan Legacy
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Deep archaic introgression analysis from Altai Neanderthal and Denisova 3 reference genomes
            </p>
          </div>

          <div className="flex items-center gap-4 bg-black/40 px-5 py-3.5 rounded-2xl border border-white/5 shadow-inner shrink-0">
            <div className="text-right">
              <span className="block text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-400 to-cyan-400 leading-none tracking-tighter">
                {results.score.toFixed(1)}%
              </span>
              <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400">
                Total Archaic Index
              </span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-left text-[10px] text-slate-400 leading-tight">
              <strong>{results.carriedAlleles} of {results.comparedMarkers * 2}</strong> alleles<br />
              detected as introgressed
            </div>
          </div>
        </div>

        {/* Dual Introgression Score Cards: Neanderthal & Denisovan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Neanderthal Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/20 via-black/40 to-purple-950/20 border border-amber-500/20 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">Archaic Species</span>
                <h3 className="text-xl font-black text-[#F5F6F7] tracking-tight flex items-center gap-2">
                  <Flame size={18} className="text-amber-400" />
                  Neanderthal DNA
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400 leading-none block">
                  {neanderthalData.score.toFixed(1)}%
                </span>
                <span className="text-[9px] font-bold text-slate-400">Introgression Index</span>
              </div>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, neanderthalData.score * 2.5)}%` }}
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
              <span>{neanderthalData.carriedAlleles} alleles detected ({neanderthalData.comparedMarkers} markers)</span>
              <span className="text-amber-300 font-bold">{neanderthalData.percentile}</span>
            </div>
          </div>

          {/* Denisovan Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/20 via-black/40 to-teal-950/20 border border-cyan-500/20 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">Archaic Species</span>
                <h3 className="text-xl font-black text-[#F5F6F7] tracking-tight flex items-center gap-2">
                  <Mountain size={18} className="text-cyan-400" />
                  Denisovan DNA
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-cyan-400 leading-none block">
                  {denisovanData.score.toFixed(1)}%
                </span>
                <span className="text-[9px] font-bold text-slate-400">Introgression Index</span>
              </div>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, denisovanData.score * 3.5)}%` }}
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full"
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
              <span>{denisovanData.carriedAlleles} alleles detected ({denisovanData.comparedMarkers} markers)</span>
              <span className="text-cyan-300 font-bold">{denisovanData.percentile}</span>
            </div>
          </div>
        </div>

        {/* Source Filter & Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 bg-black/30 p-3 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSourceFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                sourceFilter === 'ALL'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Archaic ({results.details.length})
            </button>

            <button
              onClick={() => setSourceFilter('Neanderthal')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                sourceFilter === 'Neanderthal'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame size={14} />
              Neanderthal ({results.details.filter(d => d.source === 'Neanderthal').length})
            </button>

            <button
              onClick={() => setSourceFilter('Denisovan')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                sourceFilter === 'Denisovan'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mountain size={14} />
              Denisovan ({results.details.filter(d => d.source === 'Denisovan').length})
            </button>
          </div>

          <button
            onClick={() => setCarrierOnly(!carrierOnly)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shrink-0 ${
              carrierOnly
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-black/20 text-slate-400 border-white/5 hover:text-slate-200'
            }`}
          >
            <Filter size={14} />
            {carrierOnly ? 'Showing Carried Alleles Only' : 'Show Carried & Ancestral'}
          </button>
        </div>

        {/* Variant Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDetails.map((item, idx) => (
            <motion.div
              key={item.rsid}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              className={`p-5 rounded-2xl bg-black/30 border transition-all flex flex-col justify-between ${
                item.source === 'Denisovan'
                  ? 'border-cyan-500/20 hover:border-cyan-500/40'
                  : 'border-white/5 hover:border-purple-500/20'
              }`}
            >
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex gap-2.5 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.source === 'Denisovan' ? 'bg-cyan-500/10' : 'bg-purple-500/10'
                  }`}>
                    {getGeneIcon(item.gene, item.source)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-[#F5F6F7]">{item.gene}</h4>
                      <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400">{item.rsid}</span>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                        item.source === 'Denisovan'
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}>
                        {item.source}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight font-semibold mt-1">{item.trait}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-black text-[#F5F6F7] bg-slate-900 border border-white/10 px-2 py-0.5 rounded-md block">
                    {item.userGenotype}
                  </span>
                  <span className={`block text-[8px] font-black uppercase tracking-wider mt-1.5 ${
                    item.hasDerived 
                      ? item.source === 'Denisovan' ? 'text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded' : 'text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded' 
                      : 'text-slate-600'
                  }`}>
                    {item.hasDerived ? `${item.source} Carrier` : 'Ancestral'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-normal italic mt-2 border-t border-white/5 pt-3 font-medium">
                "{item.history}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* Evolutionary Context Footer */}
        <div className="mt-8 p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl flex items-start gap-3 text-left">
          <Info size={18} className="text-purple-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
            Neanderthal and Denisovan variants entered the modern human gene pool through separate archaic interbreeding events in Eurasia approximately 45,000–60,000 years ago. Introgressed mutations like high-altitude <strong>EPAS1</strong> (Denisovan) and cold/skin barrier <strong>POU2F3 / BNC2</strong> (Neanderthal) were positively selected because they conferred crucial survival advantages outside Africa.
          </p>
        </div>
      </div>
    </motion.div>
  );
});
