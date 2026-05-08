import React, { memo } from 'react';
import { motion } from 'motion/react';

export const EngineAncestryOracle = memo(({ results }: { results: any[] }) => {
  if (!results || results.length === 0) {
    return <div className="p-12 text-center text-slate-500">No Engine Results Available.</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 sm:p-12 rounded-[2rem] bg-[#111213]/70 border border-white/10"
    >
      <h2 className="text-3xl font-black text-[#F5F6F7] mb-6">Oracle Engine V1</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((r, i) => (
          <div key={i} className="p-4 rounded-xl bg-[#1a1b1d] border border-white/5">
            <div className="font-bold text-[#F5F6F7]">{r.population}</div>
            <div className="text-sm text-[#4599FF] font-mono">Distance: {r.distance.toFixed(4)}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
});
