
import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SNP } from '../types/genotype';
import { CONTINENT_META } from '../constants/genotypeConstants';
import { findFrequency, PopFrequencyEntry } from '../data/GenomicDataService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SNPDetailViewProps {
  snp: SNP;
}

export const SNPDetailView: React.FC<SNPDetailViewProps> = ({ snp }) => {
  const [isChartReady, setIsChartReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsChartReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const continentMeta = CONTINENT_META[snp.continent] || { color: '#94a3b8' };

  const frequencyData = useMemo(() => {
    if (!snp.rsid || !snp.genotype) return null;
    
    // Major population groups in 1000 Genomes
    const pops = ['GBR', 'YRI', 'CHB', 'GIH', 'PUR']; 
    const popNames: Record<string, string> = {
      'GBR': 'European',
      'YRI': 'African',
      'CHB': 'E. Asian',
      'GIH': 'S. Asian',
      'PUR': 'Americas'
    };

    return pops.map(pop => {
      const freq = findFrequency(snp.rsid || '', snp.genotype || '', pop);
      return {
        pop: popNames[pop],
        value: freq !== null ? freq * 100 : 0,
        popCode: pop
      };
    }).filter(d => d.value > 0);
  }, [snp.rsid, snp.genotype]);

  const isRare = useMemo(() => {
    if (!frequencyData || frequencyData.length === 0) return false;
    return frequencyData.every(d => d.value < 5);
  }, [frequencyData]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 bg-white dark:bg-slate-800 rounded-3xl border shadow-sm space-y-4 ${
        isRare 
          ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
          : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">{snp.markerId}</h2>
          {snp.rsid && <p className="text-xs text-slate-500 font-mono mt-0.5 dark:text-slate-400">RSID: {snp.rsid}</p>}
        </div>
        <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm" style={{ backgroundColor: continentMeta.color }}>
          {snp.continent}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
        <div>
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">Gene</span>
          <span className="font-semibold text-slate-900 dark:text-slate-200">{snp.gene}</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">Trait</span>
          <span className="font-semibold text-slate-900 dark:text-slate-200">{snp.trait}</span>
        </div>
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {snp.description}
      </p>

      {frequencyData && frequencyData.length > 0 && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Genotype Prevalence (1000 Genomes)</h4>
          <div className="h-40 w-full min-w-0 relative">
            {isChartReady ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={160} debounce={1}>
                <BarChart data={frequencyData} layout="vertical" margin={{ left: -20 }}>
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis 
                    dataKey="pop" 
                    type="category" 
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} 
                    width={70}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '10px', color: '#fff' }}
                    formatter={((value: number) => [`${(value || 0).toFixed(1)}%`, 'Prevalence']) as any}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                    {frequencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.popCode === 'GBR' ? '#4599FF' : entry.popCode === 'YRI' ? '#10b981' : '#f59e0b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-50/50 dark:bg-slate-900/50 rounded-xl animate-pulse" />
            )}
          </div>
        </div>
      )}

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
