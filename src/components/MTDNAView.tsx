/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { Search, History, Activity, Flame } from 'lucide-react';
import { MT_DNA_TREE } from '../genotypeData';
import { enrichHaplogroupTree } from '../utils/haplogroupTreeUtils';
import { HaplogroupTreeView } from './HaplogroupTreeView';
import { HaplogroupDistributionVisualizer } from './HaplogroupDistributionVisualizer';
import { HaplogroupBento } from './HaplogroupBento';

const MTDNAView = memo(({ mtData, treeSearchTerm, setTreeSearchTerm, matchedTraits }: { 
  mtData: any, 
  treeSearchTerm: string, 
  setTreeSearchTerm: (val: string) => void,
  matchedTraits: any[]
}) => {
  const enrichedMtTree = useMemo(() => {
    if (!mtData) return null;
    return enrichHaplogroupTree(MT_DNA_TREE, mtData.path, mtData.testedMarkers);
  }, [mtData?.path, mtData?.testedMarkers]);

  const findNode = useCallback((name: string, node: any = enrichedMtTree): any | null => {
    if (!node || node.branchName === name) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(name, child);
        if (found) return found;
      }
    }
    return null;
  }, [enrichedMtTree]);

  const enrichedPath = useMemo(() => {
    if (!mtData) return [];
    return (mtData.path || []).map((step: string, idx: number) => {
      const node = findNode(step);
      // Fallback for nodes not in our primary tree (e.g., deep subclades)
      const isLast = idx === (mtData.path || []).length - 1;
      return {
        name: (step || '').replace("Haplogroup ", ""),
        region: node?.region || (isLast ? mtData.region : "Global"),
        description: node?.description || (isLast ? `Your most specific maternal lineage branch: ${(step || '').replace("Haplogroup ", "")}.` : "A transitional point in the maternal migration history."),
        historicalContext: node?.historicalContext,
        mutations: node?.mutations || []
      };
    });
  }, [mtData, findNode]);

  if (!mtData) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center space-y-4 max-w-xl mx-auto my-8">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
          <History className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-200">No Maternal Lineage (mtDNA) Markers Detected</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The active genotype dataset does not contain readable mitochondrial markers (chromosome MT or 26). Commercial microarray chips vary in mitochondrial coverage. If your file was expected to include mtDNA markers, try re-uploading the original raw archive.
        </p>
      </div>
    );
  }

  const derivedMarkers = mtData.testedMarkers ? mtData.testedMarkers.filter((m: any) => m.status === 'derived') : [];
  const markerPieData = derivedMarkers.map((m: any) => {
    const branch = ((mtData.path || []).find((p: string) => p && typeof p === 'string' && p.includes(m.mutation)) || mtData.predicted || 'Root').replace("Haplogroup ", "");
    return {
      name: m.mutation,
      branch: branch,
      value: 1
    };
  });

  return (
    <div className="animate-fade-up space-y-8 pb-12">
      {/* Hero Prediction Section */}
      <div className="grid grid-cols-1 gap-6">
        <HaplogroupDistributionVisualizer predictedMt={mtData} />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <HaplogroupBento predictedMt={mtData} />
      </div>

      {/* Migration Story and Marker Detail Layout */}
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-8">
          {/* Main Migration Story Card */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex items-center justify-between mb-12 relative z-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Your Maternal Odyssey</h3>
                <p className="text-sm text-slate-400 font-medium mt-1">Tracing the geographic and genetic path of your ancestors</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                 <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                 <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">Ancient to Modern</span>
              </div>
            </div>

            <div className="relative pl-8 md:pl-12 ml-2 md:ml-4 space-y-12 md:space-y-16 before:absolute before:left-0 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-rose-500 before:via-pink-500 before:to-transparent">
              {enrichedPath.map((step: any, idx: number) => {
                const isFirst = idx === 0;
                const isLast = idx === enrichedPath.length - 1;
                
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
                      isLast ? 'bg-rose-600 scale-110 rotate-12' : isFirst ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                    }`}>
                      <span className={`text-[10px] md:text-[11px] font-black ${isLast || isFirst ? 'text-white' : 'text-slate-500'}`}>{idx + 1}</span>
                    </div>

                    <div className="bg-slate-50/40 dark:bg-slate-900/40 p-4 sm:p-8 rounded-3xl border border-transparent group-hover:border-rose-200 dark:group-hover:border-rose-900/30 transition-all group-hover:shadow-xl group-hover:shadow-rose-100/50 dark:group-hover:shadow-none">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="space-y-1">
                          <h4 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none group-hover:text-rose-600 transition-colors">
                            {step.name === "mtDNA Root (Eve)" ? "Mitochondrial Eve" : step.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-300"></span>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.1em] uppercase">Originates in: {step.region}</span>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-3">
                           {isFirst && <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-[9px] font-black text-indigo-600 tracking-widest border border-indigo-100 dark:border-indigo-800 uppercase">Ancestor</span>}
                           {isLast && <span className="px-3 py-1 bg-rose-50 dark:bg-rose-900/30 rounded-lg text-[9px] font-black text-rose-600 tracking-widest border border-rose-100 dark:border-rose-800 uppercase">You Are Here</span>}
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                        {step.description}
                      </p>

                      {step.historicalContext && (
                        <div className="mb-6 p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-500/20 rounded-xl">
                          <div className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-[0.2em] mb-1">Historical Context</div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                            {step.historicalContext}
                          </p>
                        </div>
                      )}

                      {step.mutations.length > 0 && (
                        <div className="relative pt-4 border-t border-slate-200 dark:border-slate-700/50">
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                             🧬 Genetic Markers at this step
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {step.mutations.slice(0, 20).map((m: string) => (
                              <span key={m} className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-md transition-colors ${
                                (mtData.userMutations || []).includes(m)
                                  ? 'bg-rose-500 text-white shadow-sm'
                                  : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                              }`}>
                                {m}
                              </span>
                            ))}
                            {step.mutations.length > 20 && (
                              <span className="text-[10px] text-slate-400 font-bold self-center">+{step.mutations.length - 20}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
        </div>

        {/* Maternal Health Traits Section */}
        {matchedTraits && matchedTraits.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-4 mb-8">
              <span className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">🧬</span>
              Maternal Health Traits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedTraits.map((trait: any, idx: number) => (
                <div key={idx} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-black text-rose-600 dark:text-rose-400 font-mono tracking-tight">{trait.position} [{trait.allele}]</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-rose-100 dark:bg-rose-900/40 rounded-full text-rose-600 dark:text-rose-400 uppercase">Matched</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {trait.traits.map((t: string, i: number) => (
                       <div key={i} className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                         {t}
                       </div>
                     ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default MTDNAView;
export { MTDNAView };
