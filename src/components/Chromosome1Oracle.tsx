import React, { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';

export const Chromosome1Oracle = memo(({ results }: { results: any }) => {
  const chrom1Ancestry = results?.primary?.chromosomeData?.['1'] || {};
  
  const chartData = useMemo(() => {
    return Object.entries(chrom1Ancestry).map(([key, value]) => ({
      subject: key === 'Native American' ? 'American' : key,
      A: Number(value),
      fullMark: 100,
    }));
  }, [chrom1Ancestry]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] bg-[#111213]/70 backdrop-blur-xl border border-white/10 shadow-2xl"
    >
      <h2 className="text-3xl sm:text-4xl font-black text-[#F5F6F7] mb-2 tracking-tighter">Chromosome 1 Oracle</h2>
      <p className="text-xs sm:text-sm font-bold text-[#4599FF] uppercase tracking-widest mb-8 sm:mb-12">Fine-Scale Ancestry: Chr 1</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-center">
        <div className="h-[300px] sm:h-[450px] lg:col-span-2 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData} margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Ancestry"
                dataKey="A"
                stroke="#FFD700"
                fill="#FFD700"
                fillOpacity={0.3}
              />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc', borderRadius: '1rem', backdropFilter: 'blur(8px)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-4 sm:space-y-6 lg:col-span-1">
          {Object.entries(chrom1Ancestry).length === 0 ? (
            <p className="text-slate-400">No significant ancestry data for Chr 1.</p>
          ) : (
            Object.entries(chrom1Ancestry).map(([name, value]) => (
              <div key={name} className="flex items-center justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#1a1b1d]/70 backdrop-blur-sm border border-white/5 hover:border-[#FFD700]/50 transition-colors">
                <span className="font-bold text-base sm:text-lg text-[#F5F6F7]">{name === 'Native American' ? 'American' : name}</span>
                <span className="font-mono font-black text-lg sm:text-xl text-[#FFD700]">{Number(value).toFixed(1)}%</span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
});
