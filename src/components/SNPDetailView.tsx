
import React from 'react';
import { motion } from 'motion/react';
import { SNP } from '../types/genotype';
import { CONTINENT_META } from '../constants/genotypeConstants';

interface SNPDetailViewProps {
  snp: SNP;
}

export const SNPDetailView: React.FC<SNPDetailViewProps> = ({ snp }) => {
  const continentMeta = CONTINENT_META[snp.continent] || { color: '#94a3b8' };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">{snp.markerId}</h2>
          {snp.rsid && <p className="text-xs text-slate-500 font-mono mt-0.5">RSID: {snp.rsid}</p>}
        </div>
        <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm" style={{ backgroundColor: continentMeta.color }}>
          {snp.continent}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
        <div>
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gene</span>
          <span className="font-semibold text-slate-900 dark:text-slate-200">{snp.gene}</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trait</span>
          <span className="font-semibold text-slate-900 dark:text-slate-200">{snp.trait}</span>
        </div>
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {snp.description}
      </p>

      {snp.referenceUrl && (
        <a 
          href={snp.referenceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
        >
          View Reference Analysis &rarr;
        </a>
      )}
    </motion.div>
  );
};
