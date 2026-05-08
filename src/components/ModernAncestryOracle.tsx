import React, { memo, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { EngineAncestryOracle } from './EngineAncestryOracle';
import { runAncestryOracle } from '../utils/ancestry/oracleEngine';

export const ModernAncestryOracle = memo(({ results }: { results: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  type ViewMode = 'standard' | 'statistical' | 'engine';
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  
  const primaryAncestry = results?.primary?.continentalScores || {};
  const statisticalAncestry = results?.statistical?.results || {};
  const statsMetadata = results?.statistical || {};
  
  const hasData = Object.keys(primaryAncestry).length > 0 || Object.keys(statisticalAncestry).length > 0;
  
  if (!hasData) {
    return (
      <div className="p-12 text-center text-slate-500">
        No Ancestry Results Available - Please load and process a valid dataset.
      </div>
    );
  }
  
  const currentAncestry = viewMode === 'standard' ? primaryAncestry : statisticalAncestry;
  
  const chartData = useMemo(() => {
    return Object.entries(currentAncestry).map(([key, value]) => ({
      subject: key === 'AMR' ? 'American' : (key === 'EAS' ? 'East Asian' : (key === 'SAS' ? 'South Asian' : (key === 'AFR' ? 'African' : (key === 'EUR' ? 'European' : key)))),
      A: Number(value),
      fullMark: 100,
    }));
  }, [currentAncestry, viewMode]);
  
  const getDisplayName = (code: string) => {
    const map: Record<string, string> = {
      'EUR': 'European',
      'AFR': 'African',
      'EAS': 'East Asian',
      'SAS': 'South Asian',
      'AMR': 'Native American'
    };
    return map[code] || code;
  };

  if (viewMode === 'engine') {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button onClick={() => setViewMode('standard')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'standard' ? 'bg-[#4599FF] text-white' : 'text-slate-400 hover:text-white'}`}>Standard</button>
            <button onClick={() => setViewMode('statistical')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'statistical' ? 'bg-[#4599FF] text-white' : 'text-slate-400 hover:text-white'}`}>Statistical</button>
            <button onClick={() => setViewMode('engine')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'engine' ? 'bg-[#4599FF] text-white' : 'text-slate-400 hover:text-white'}`}>Engine</button>
          </div>
        </div>
        <EngineAncestryOracle results={runAncestryOracle([0,0,0], [])} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] bg-[#111213]/70 backdrop-blur-xl border border-white/10 shadow-2xl"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F5F6F7] mb-2 tracking-tighter">Ancestry Oracle V2</h2>
          <p className="text-xs sm:text-sm font-bold text-[#4599FF] uppercase tracking-widest">High-Precision Admixture Analysis</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button onClick={() => setViewMode('standard')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'standard' ? 'bg-[#4599FF] text-white' : 'text-slate-400 hover:text-white'}`}>Standard</button>
          <button onClick={() => setViewMode('statistical')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'statistical' ? 'bg-[#4599FF] text-white' : 'text-slate-400 hover:text-white'}`}>Statistical</button>
          <button onClick={() => setViewMode('engine')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'engine' ? 'bg-[#4599FF] text-white' : 'text-slate-400 hover:text-white'}`}>Engine</button>
        </div>
      </div>
      
      <div className="mb-10 rounded-2xl frosted-glass border border-white/5 text-[#F5F6F7]">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex justify-between items-center p-6 text-left font-bold"
        >
          <h4>{viewMode === 'standard' ? 'How this works' : 'Genotype Scout Model'}</h4>
          {isExpanded ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
        </button>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          className="overflow-hidden"
        >
          <p className="p-6 pt-0 text-sm text-slate-400 leading-relaxed">
            {viewMode === 'standard' ? (
              "The Ancestry Oracle is not a classic \"ethnicity calculator.\" While mainstream services use imputation to fill in genetic gaps based on statistical models, this engine processes your raw, exact genome data. By directly analyzing specific, high-precision Ancestry Informative Markers (AIMs), we produce results that reflect your unique genotype, providing a granular look at your genetic lineage without relying on probabilistic data smoothing."
            ) : (
              `The statistical model uses a Naive Bayes approach with Softmax normalization to compare your genome against the 1000 Genomes Project phase 3 reference database. This method calculates the maximum likelihood of your ancestry across super-populations using ${statsMetadata.markersUsed || 0} high-quality markers from professional panels (NCBI GRAF, VISAGE Forensic, and SGDP Precision AIMs). Precision: ${statsMetadata.precision || 'Standard'}.`
            )}
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
          {Object.entries(currentAncestry).map(([name, value]) => (
            <div key={name} className="flex items-center justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#1a1b1d]/70 backdrop-blur-sm border border-white/5 hover:border-[#4599FF]/50 transition-colors">
              <span className="font-bold text-base sm:text-lg text-[#F5F6F7]">{getDisplayName(name)}</span>
              <span className="font-mono font-black text-lg sm:text-xl text-[#4599FF]">{Number(value).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});
