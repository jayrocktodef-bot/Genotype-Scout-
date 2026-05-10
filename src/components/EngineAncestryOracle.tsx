import React, { memo } from 'react';
import { motion } from 'motion/react';

export const EngineAncestryOracle = memo(({ results }: { results: any[] }) => {
  if (!results || results.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white/5 rounded-3xl border border-dashed border-white/10">
        <div className="text-3xl mb-4">💿</div>
        <h3 className="text-xl font-bold text-white mb-2">Engine Data Not Found</h3>
        <p className="text-sm max-w-sm mx-auto">Please run <code>npm run sync-graf</code> in the terminal to fetch the 10,000 SNP population weights database.</p>
      </div>
    );
  }

  // Sort by highest percentage
  const sortedResults = [...results].sort((a, b) => (b.percentage || 0) - (a.percentage || 0));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 sm:p-12 rounded-[2.5rem] bg-[#111213]/70 backdrop-blur-xl border border-white/10 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#F5F6F7] tracking-tighter">Oracle Engine Refinement</h2>
          <p className="text-[10px] text-[#4599FF] font-black uppercase tracking-[0.2em] mt-1">10,000 SNP Resolution (GRAF Panel)</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-[#4599FF]/10 border border-[#4599FF]/20 text-[10px] font-black text-[#4599FF] uppercase tracking-widest">
          Likelihood Maximization Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {sortedResults.filter(r => (r.percentage || 0) > 0.01).map((r, i) => (
          <div key={i} className="p-5 rounded-2xl bg-[#1a1b1d]/80 border border-white/5 hover:border-[#4599FF]/30 transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div className="font-bold text-[#F5F6F7] text-lg leading-tight group-hover:text-[#4599FF] transition-colors">{r.population}</div>
              <div className="text-sm font-black text-[#4599FF] bg-[#4599FF]/5 px-2 py-0.5 rounded-lg">{(r.percentage || 0).toFixed(2)}%</div>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1 mb-4 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${r.percentage}%` }}
                 className="h-full bg-[#4599FF]"
               />
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Fit Confidence</span>
              <span className="font-mono">Dist: {r.distance.toFixed(3)}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/5 text-[10px] text-slate-400 leading-relaxed italic">
        * The GRAF Engine results are based on the Maximum Likelihood Estimation across 26 distinct global populations. 
        Unlike continental percentages, these sub-populations are highly correlated; the percentages represent 
        the relative statistical probability of your genotype matching each reference set.
      </div>
    </motion.div>
  );
});
