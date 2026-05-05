import React, { memo, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';

export const ModernAncestryOracle = memo(({ results }: { results: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const primaryAncestry = results?.primary?.continentalScores || {};
  
  const chartData = useMemo(() => {
    return Object.entries(primaryAncestry).map(([key, value]) => ({
      subject: key === 'Native American' ? 'American' : key,
      A: Number(value),
      fullMark: 100,
    }));
  }, [primaryAncestry]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] bg-[#111213]/70 backdrop-blur-xl border border-white/10 shadow-2xl"
    >
      <h2 className="text-3xl sm:text-4xl font-black text-[#F5F6F7] mb-2 tracking-tighter">Ancestry Oracle V2</h2>
      <p className="text-xs sm:text-sm font-bold text-[#4599FF] uppercase tracking-widest mb-8 sm:mb-8">High-Precision Admixture Analysis</p>
      
      <div className="mb-10 rounded-2xl frosted-glass border border-white/5 text-[#F5F6F7]">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex justify-between items-center p-6 text-left font-bold"
        >
          <h4>How this works</h4>
          {isExpanded ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
        </button>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          className="overflow-hidden"
        >
          <p className="p-6 pt-0 text-sm text-slate-400 leading-relaxed">
            The Ancestry Oracle is not a classic "ethnicity calculator." While mainstream services use imputation to fill in genetic gaps based on statistical models, this engine processes your raw, exact genome data. By directly analyzing specific, high-precision Ancestry Informative Markers (AIMs), we produce results that reflect your unique genotype, providing a granular look at your genetic lineage without relying on probabilistic data smoothing. This approach prioritizes data fidelity, ensuring your breakdown is derived from actual observed mutations across our curated population database rather than predictive modeling.
          </p>
        </motion.div>
      </div>
      
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
                stroke="#4599FF"
                fill="#4599FF"
                fillOpacity={0.3}
              />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc', borderRadius: '1rem', backdropFilter: 'blur(8px)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-4 sm:space-y-6 lg:col-span-1">
          {Object.entries(primaryAncestry).map(([name, value]) => (
            <div key={name} className="flex items-center justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#1a1b1d]/70 backdrop-blur-sm border border-white/5 hover:border-[#4599FF]/50 transition-colors">
              <span className="font-bold text-base sm:text-lg text-[#F5F6F7]">{name === 'Native American' ? 'American' : name}</span>
              <span className="font-mono font-black text-lg sm:text-xl text-[#4599FF]">{Number(value).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});
