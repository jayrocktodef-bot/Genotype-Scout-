import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, AlertCircle, Link2, Dna, FileSearch } from 'lucide-react';
import { comparePairwise, KinshipResult } from '../engines/kinshipEngine';

export const KinshipModule = ({ datasets, activeDatasetIndex }: { datasets: any[], activeDatasetIndex: number }) => {
  const [results, setResults] = useState<KinshipResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (datasets.length < 2) {
      setResults([]);
      return;
    }
    
    let active = true;
    const runKinship = async () => {
      setIsProcessing(true);
      // Let the UI breathe before running synchronous heavy processing
      await new Promise(resolve => setTimeout(resolve, 50)); 
      try {
        const res = await comparePairwise(datasets, activeDatasetIndex);
        if (active) setResults(res);
      } catch (err) {
        console.error("Kinship error:", err);
      } finally {
        if (active) setIsProcessing(false);
      }
    };
    runKinship();
    return () => { active = false; };
  }, [datasets, activeDatasetIndex]);

  if (datasets.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-slate-800">
        <Users className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-6" />
        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 mb-2">Needs More Kits</h3>
        <p className="text-sm text-slate-500 max-w-md">
          To perform Identity by Descent (IBD) Kinship Matching, you need to load at least two genomic datasets into the workspace. 
        </p>
        <div className="mt-8 px-6 py-3 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 font-bold text-xs uppercase tracking-widest rounded-xl border border-teal-200 dark:border-teal-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Import another kit to begin
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="p-8 bg-[#111213]/70 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl">
        <div className="flex items-center gap-4 text-white mb-8">
          <Users className="w-10 h-10 text-[#4599FF]" />
          <div>
            <h2 className="text-3xl font-black tracking-tight">Kinship & IBD Matching</h2>
            <p className="text-sm text-slate-400">Comparing {datasets[activeDatasetIndex].name || `Kit ${activeDatasetIndex + 1}`} against {datasets.length - 1} other loaded kit(s).</p>
          </div>
        </div>

        {isProcessing ? (
          <div className="flex flex-col items-center py-20 text-slate-400">
            <div className="relative w-16 h-16 mb-4">
              <Dna className="w-full h-full text-indigo-500 animate-pulse absolute inset-0" />
              <div className="w-full h-full border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Running pairwise IBD segment detection...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {results.length === 0 ? (
              <div className="text-center py-10 text-slate-500 font-bold uppercase text-xs tracking-wider">
                No IBD matches found. These individuals are unrelated.
              </div>
            ) : (
              results.map((res, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg"
                >
                  <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xs">
                        {res.datasetAName.substring(0, 2).toUpperCase()}
                      </div>
                      <Link2 className="w-4 h-4 text-slate-500" />
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xs">
                        {res.datasetBName.substring(0, 2).toUpperCase()}
                      </div>
                      <h4 className="font-black text-white ml-2 text-lg">{res.datasetBName}</h4>
                    </div>
                    <div className="px-4 py-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-black text-xs uppercase tracking-widest rounded-lg">
                      {res.predictedRelationship}
                    </div>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-1">Total Shared DNA</span>
                      <span className="text-3xl font-black text-white">{res.totalSharedCM.toFixed(1)}</span>
                      <span className="text-xs text-slate-400 font-bold">cM</span>
                    </div>
                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-1">Longest Block</span>
                      <span className="text-3xl font-black text-white">{res.longestBlockCM.toFixed(1)}</span>
                      <span className="text-xs text-slate-400 font-bold">cM</span>
                    </div>
                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-1">Total Segments</span>
                      <span className="text-3xl font-black text-white">{res.segments.length}</span>
                      <span className="text-xs text-slate-400 font-bold">{'> 7 cM'}</span>
                    </div>
                  </div>

                  {res.segments.length > 0 && (
                    <div className="px-6 pb-6">
                      <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <FileSearch className="w-3.5 h-3.5" />
                        Top IBD Segments
                      </h5>
                      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase">
                            <tr>
                              <th className="px-4 py-2">Chr</th>
                              <th className="px-4 py-2">Start (Mbp)</th>
                              <th className="px-4 py-2">End (Mbp)</th>
                              <th className="px-4 py-2">SNPs</th>
                              <th className="px-4 py-2 text-right">Length (cM)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/50">
                            {res.segments.slice(0, 10).map((seg, idx) => (
                              <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                                <td className="px-4 py-2 font-black text-white">{seg.chrom}</td>
                                <td className="px-4 py-2 font-mono text-slate-400">{(seg.start / 1000000).toFixed(2)}</td>
                                <td className="px-4 py-2 font-mono text-slate-400">{(seg.end / 1000000).toFixed(2)}</td>
                                <td className="px-4 py-2 font-mono text-slate-400">{seg.snpsCount}</td>
                                <td className="px-4 py-2 text-right font-black text-indigo-400">{seg.lengthCM.toFixed(1)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {res.segments.length > 10 && (
                          <div className="px-4 py-2 text-center text-[10px] text-slate-500 bg-slate-900/30 uppercase tracking-widest font-bold">
                            + {res.segments.length - 10} more segments not shown
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
