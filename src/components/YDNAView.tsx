/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Compass, Activity } from 'lucide-react';
import { Y_DNA_TREE } from '../genotypeData';
import { enrichHaplogroupTree } from '../utils/haplogroupTreeUtils';
import { getHaplogroupDetails } from '../utils/haplogroupDetails';
import { HaplogroupTreeView } from './HaplogroupTreeView';
import { HaplogroupDistributionVisualizer } from './HaplogroupDistributionVisualizer';
import { YDNABento } from './YDNABento';
import { Phase2Panel } from './Phase2Panel';

const YDNAView = memo(({ yData, treeSearchTerm, setTreeSearchTerm }: { yData: any, treeSearchTerm: string, setTreeSearchTerm: (v: string) => void }) => {
  if (!yData) return null;

  const enrichedYTree = useMemo(() => {
    return enrichHaplogroupTree(Y_DNA_TREE, yData.path, yData.testedMarkers);
  }, [yData.path, yData.testedMarkers]);

  const enrichedYPath = useMemo(() => {
    if (!yData) return [];
    return (yData.path || []).map((step: string, idx: number) => {
      const details = getHaplogroupDetails(step, false);
      const isLast = idx === (yData.path || []).length - 1;
      return {
        name: (step || '').replace("Haplogroup ", ""),
        region: details.region,
        description: details.description || (isLast ? yData.predicted?.description : "A transitional point in the paternal migration history."),
        historicalContext: details.historicalContext
      };
    });
  }, [yData]);

  const derivedMarkers = yData.testedMarkers ? yData.testedMarkers.filter((m: any) => m.isDerived) : [];
  const markerPieData = derivedMarkers.map((m: any) => ({
    name: m.marker,
    branch: (m.branch || 'Unknown').replace("Haplogroup ", ""),
    value: 1
  }));

  return (
    <div className="animate-fade-up space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <HaplogroupDistributionVisualizer predictedY={yData} />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <YDNABento yData={yData} />
      </div>
      

      {/* Paternal Odyssey Migration Story */}
      {enrichedYPath.length > 0 && (
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center justify-between mb-12 relative z-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Your Paternal Odyssey</h3>
                  <p className="text-sm text-slate-400 font-medium mt-1">Tracing the geographic and genetic path of your ancestors</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                   <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                   <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">Ancient to Modern</span>
                </div>
              </div>

              <div className="relative pl-8 md:pl-12 ml-2 md:ml-4 space-y-12 md:space-y-16 before:absolute before:left-0 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-blue-50 before:via-indigo-500 before:to-transparent">
                {enrichedYPath.map((step: any, idx: number) => {
                  const isFirst = idx === 0;
                  const isLast = idx === enrichedYPath.length - 1;
                  
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative group cursor-default"
                    >
                      {/* Node Pin */}
                      <div className={`absolute -left-[44px] md:-left-[64px] top-0 w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center z-10 transition-all group-hover:rotate-12 ${
                        isLast ? 'bg-blue-600 scale-110 rotate-12' : isFirst ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                      }`}>
                        <span className={`text-[10px] md:text-[11px] font-black ${isLast || isFirst ? 'text-white' : 'text-slate-500'}`}>{idx + 1}</span>
                      </div>

                      <div className="bg-slate-50/40 dark:bg-slate-900/40 p-4 sm:p-8 rounded-3xl border border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-900/30 transition-all group-hover:shadow-xl group-hover:shadow-blue-100/50 dark:group-hover:shadow-none">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="space-y-1">
                            <h4 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none group-hover:text-blue-600 transition-colors">
                              {step.name === "Y-DNA Root (Adam)" ? "Y-Chromosomal Adam" : step.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.1em] uppercase">Originates in: {step.region}</span>
                            </div>
                          </div>
                          <div className="shrink-0 flex items-center gap-3">
                             {isFirst && <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-[9px] font-black text-indigo-600 tracking-widest border border-indigo-100 dark:border-indigo-800 uppercase">Ancestor</span>}
                             {isLast && <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-[9px] font-black text-blue-600 tracking-widest border border-blue-100 dark:border-blue-800 uppercase">You Are Here</span>}
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                          {step.description}
                        </p>

                        {step.historicalContext && (
                          <div className="mb-6 p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-500/20 rounded-xl">
                            <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-1">Historical Context</div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                              {step.historicalContext}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 2 Analysis Panel */}
      <Phase2Panel
        phase2={yData.phase2}
        phase1Haplogroup={yData.predicted?.name ?? null}
      />
    </div>
  );
});


export default YDNAView;
export { YDNAView };
