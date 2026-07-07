import React, { useState } from 'react';
import { Users, ShieldAlert, ArrowRightLeft } from 'lucide-react';
import { motion } from 'motion/react';

export const KitComparisonModule = ({ datasets }: { datasets: any[] }) => {
  const [kitAIndex, setKitAIndex] = useState(0);
  const [kitBIndex, setKitBIndex] = useState(datasets.length > 1 ? 1 : 0);

  if (datasets.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">Insufficient Datasets</h2>
        <p className="text-slate-500 mt-4 max-w-lg dark:text-slate-400">
          To perform a side-by-side comparison, you need to load at least two genomic datasets into the workspace.
        </p>
      </div>
    );
  }

  const kitA = datasets[kitAIndex];
  const kitB = datasets[kitBIndex];

  // Helper to extract top ancestry from the new engine
  const getTopAncestry = (dataset: any) => {
    const admixtureMix = dataset?.analysis?.subpopulationOracle?.admixtureMix || [];
    const sorted = [...admixtureMix].sort((a: any, b: any) => (b.percentage || 0) - (a.percentage || 0));
    return sorted.slice(0, 3);
  };

  const topAncestryA = getTopAncestry(kitA);
  const topAncestryB = getTopAncestry(kitB);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">Kit Comparison</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Compare DNA signatures, traits, and subpopulation admixtures side-by-side.</p>
        </div>

        {/* Kit Selectors */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm w-full md:w-auto">
          <select 
            value={kitAIndex}
            onChange={(e) => setKitAIndex(Number(e.target.value))}
            className="flex-1 md:flex-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold rounded-xl px-4 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            {datasets.map((d: any, i: number) => (
              <option key={i} value={i}>{d.name?.split('.')[0] || `Kit ${i+1}`}</option>
            ))}
          </select>
          <ArrowRightLeft className="w-4 h-4 text-slate-400 shrink-0 mx-1" />
          <select 
            value={kitBIndex}
            onChange={(e) => setKitBIndex(Number(e.target.value))}
            className="flex-1 md:flex-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold rounded-xl px-4 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            {datasets.map((d: any, i: number) => (
              <option key={i} value={i}>{d.name?.split('.')[0] || `Kit ${i+1}`}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Kit A */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-emerald-500"></div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-1 truncate">{kitA.name?.split('.')[0] || 'Kit A'}</h3>
            <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">{kitA.snpCount?.toLocaleString()} SNPs Tested • {kitA.chip || 'Unknown Array'}</p>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Maternal (mtDNA)</span>
                <span className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-200 truncate block">{kitA.predictedMtDNA?.predicted || 'Unknown'}</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Paternal (Y-DNA)</span>
                <span className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-200 truncate block">{kitA.predictedYDNA?.predicted?.name || 'Unknown'}</span>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                Top Ancestral Signatures
              </h4>
              <div className="space-y-2">
                {topAncestryA.length > 0 ? topAncestryA.map((pop: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/30 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{pop.name || pop.popCode}</span>
                    <span className="text-xs font-black font-mono text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2 py-0.5 rounded-md">{(pop.percentage || 0).toFixed(1)}%</span>
                  </div>
                )) : <p className="text-xs text-slate-400 italic py-2">No advanced subpopulation data available.</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Kit B */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-1 truncate">{kitB.name?.split('.')[0] || 'Kit B'}</h3>
            <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">{kitB.snpCount?.toLocaleString()} SNPs Tested • {kitB.chip || 'Unknown Array'}</p>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Maternal (mtDNA)</span>
                <span className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-200 truncate block">{kitB.predictedMtDNA?.predicted || 'Unknown'}</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Paternal (Y-DNA)</span>
                <span className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-200 truncate block">{kitB.predictedYDNA?.predicted?.name || 'Unknown'}</span>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Top Ancestral Signatures
              </h4>
              <div className="space-y-2">
                {topAncestryB.length > 0 ? topAncestryB.map((pop: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/30 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{pop.name || pop.popCode}</span>
                    <span className="text-xs font-black font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">{(pop.percentage || 0).toFixed(1)}%</span>
                  </div>
                )) : <p className="text-xs text-slate-400 italic py-2">No advanced subpopulation data available.</p>}
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
