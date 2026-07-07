import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dna, Loader2, X, HelpCircle } from 'lucide-react';
import { ChromosomePainter } from './ChromosomePainter';
import { ChromosomePainter3D } from './ChromosomePainter3D';
import { workerPoolEngine } from '../engines/ancestry/workerPoolEngine';

const POP_COLORS: Record<string, string> = {
  EUR: '#3b82f6',
  AFR: '#10b981',
  EAS: '#ef4444',
  SAS: '#f59e0b',
  AMR: '#a855f7',
  OCE: '#06b6d4',
  MID: '#f97316'
};

const REGION_NAMES: Record<string, string> = {
  EUR: 'European',
  AFR: 'African',
  EAS: 'East Asian',
  SAS: 'South Asian',
  AMR: 'Indigenous American',
  OCE: 'Oceanian',
  MID: 'Middle Eastern'
};

interface Segment {
  continent: string;
  start: number;
  end: number;
  confidence: number;
}

export const ChromosomePainterView = ({
  dataset,
  onOpenMethodology
}: {
  dataset?: any;
  onOpenMethodology?: () => void;
}) => {
  const [calculatingLAI, setCalculatingLAI] = useState(false);
  const [localSegments, setLocalSegments] = useState<any>(null);
  const [laiError, setLaiError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState<{ chrom: string; strand: 'A' | 'B' | 'Both'; segment: Segment; bp: number } | null>(null);
  const [snpsUsedForLAI, setSnpsUsedForLAI] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  const snpsInSegment = useMemo(() => {
    if (!selectedSegment || snpsUsedForLAI.length === 0) return [];
    const { chrom, segment } = selectedSegment;
    return snpsUsedForLAI.filter((r: any) => {
      if (!r.chrom || r.pos === undefined) return false;
      const c = r.chrom.replace('chr', '').toUpperCase();
      const targetC = chrom.replace('chr', '').toUpperCase();
      return c === targetC && r.pos >= segment.start && r.pos <= segment.end;
    });
  }, [selectedSegment, snpsUsedForLAI]);

  useEffect(() => {
    if (!dataset) return;
    
    let active = true;
    const runLAI = async () => {
      setCalculatingLAI(true);
      setLaiError(null);
      try {
        const userSnpMap: Record<string, string> = dataset.mergedSnpMap || {};
        const userMetaMap: Record<string, { chrom: string; pos: number }> = dataset.mergedSnpMetaMap || {};
        
        // Build a normalized lookup of user genotypes
        const normalizedUserSnpMap = new Map<string, string>();
        for (const [key, val] of Object.entries(userSnpMap)) {
          normalizedUserSnpMap.set(key.toLowerCase(), val as string);
        }

        // Build a normalized lookup of user chrom/pos metadata
        const normalizedMetaMap = new Map<string, { chrom: string; pos: number }>();
        for (const [key, val] of Object.entries(userMetaMap)) {
          normalizedMetaMap.set(key.toLowerCase(), val);
        }
        
        const { getAimsByRsids, getIndexedDBKeys } = await import('../services/dbHydrator');
        
        let aimsDb: Record<string, any> = {};
        let rawMatchingRsids: string[] = [];
        
        if (normalizedUserSnpMap.size > 0) {
          rawMatchingRsids = Array.from(normalizedUserSnpMap.keys());
          aimsDb = await getAimsByRsids(rawMatchingRsids);
        } else if (dataset.results && dataset.results.length > 0) {
          rawMatchingRsids = dataset.results.flatMap((r: any) => {
            const id = (r.rsid || r.markerId || "").toLowerCase();
            return id ? [id] : [];
          });
          aimsDb = await getAimsByRsids(rawMatchingRsids);
        }

        // Dynamically supplement any missing keys from static masterAims
        const missingRsids = rawMatchingRsids.filter(rsid => !aimsDb[rsid]);
        if (missingRsids.length > 0) {
          const { loadMasterAims } = await import('../data/index');
          const masterAims = loadMasterAims() as Record<string, any>;
          const baseMap = new Map<string, any>();
          for (const [key, val] of Object.entries(masterAims)) {
            const lowerKey = key.toLowerCase();
            baseMap.set(lowerKey, val);
            const base = lowerKey.split('_')[0];
            if (!baseMap.has(base)) {
              baseMap.set(base, val);
            }
          }
          for (const rsid of missingRsids) {
            const match = baseMap.get(rsid);
            if (match) {
              aimsDb[rsid] = match;
            }
          }
        }

        // Build snpsForLAI: cross-reference AIM keys with user SNPs
        // Use mergedSnpMetaMap from the raw file for chrom/pos (AIM entries often lack this data)
        let snpsForLAI = rawMatchingRsids
          .map((key) => {
            const aim = aimsDb[key];
            if (!aim) return null;
            const base = key.split('_')[0];
            const genotype = normalizedUserSnpMap.get(key) || normalizedUserSnpMap.get(base) || (dataset.results?.find((r: any) => (r.rsid || r.markerId || "").toLowerCase() === key)?.genotype) || '--';
            
            // Priority: user meta map (from raw file) → AIM entry → skip
            const meta = normalizedMetaMap.get(base) || normalizedMetaMap.get(key);
            let chrom: string | undefined;
            let pos: number | undefined;

            if (meta) {
              chrom = meta.chrom;
              pos = meta.pos;
            } else {
              // Fallback to AIM entry (may be "Unknown" or undefined)
              const aimChrom = aim?.chromosome || aim?.chrom;
              const aimPos = aim?.position !== undefined ? aim.position : aim?.pos;
              if (aimChrom && aimChrom !== 'Unknown' && aimChrom !== 'unknown') {
                chrom = String(aimChrom);
              }
              if (aimPos !== undefined) {
                pos = typeof aimPos === 'number' ? aimPos : parseInt(aimPos, 10);
              }
            }

            return {
              rsid: key,
              genotype: genotype || '--',
              chrom: chrom ? String(chrom).replace('chr', '').toUpperCase() : '',
              pos
            };
          })
          .filter((s): s is NonNullable<typeof s> => {
            if (!s || !s.chrom || s.pos === undefined || isNaN(s.pos)) return false;
            const chromStr = String(s.chrom).toUpperCase().replace('CHR', '');
            if (chromStr === 'X' || chromStr === '23') return true;
            const n = parseInt(chromStr, 10);
            return !isNaN(n) && n >= 1 && n <= 22;
          });

        if (snpsForLAI.length === 0) {
          setCalculatingLAI(false);
          return;
        }

        if (active) {
          setSnpsUsedForLAI(snpsForLAI);
        }

        const populations = ['AFR', 'EUR', 'EAS', 'AMR', 'SAS'];
        
        const segments = await workerPoolEngine.runParallelAncestry(
          snpsForLAI,
          aimsDb,
          populations
        );
        if (active) {
          setLocalSegments(segments);
        }
      } catch (err: any) {
        console.error("Failed to run local ancestry inference chromosome painting:", err);
        if (active) {
          setLaiError(err?.message || 'Unknown error during Local Ancestry Inference.');
        }
      } finally {
        if (active) {
          setCalculatingLAI(false);
        }
      }
    };
    
    runLAI();
    
    return () => {
      active = false;
    };
  }, [dataset, retryCount]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:space-y-12"
    >
      <div className="p-2.5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl bg-[#111213]/70 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-start gap-4 text-[#F5F6F7]">
            <Dna className="w-8 h-8 text-[#4599FF] shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl sm:text-3xl sm:text-4xl font-black text-[#F5F6F7] mb-2 tracking-tighter">Chromosome Painting Map</h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
                Maternal vs. Paternal segment-by-segment ancestral origin mapping of your 22 autosomes. For each chromosome pair, the left chromatid represents Strand A (maternal) and the right chromatid represents Strand B (paternal) computed via hidden Markov model smoothing.
              </p>
            </div>
          </div>
          {onOpenMethodology && (
            <button
              onClick={onOpenMethodology}
              className="w-full sm:w-auto shrink-0 px-6 py-3 bg-[#0d9488]/20 hover:bg-[#0d9488]/35 border border-[#0d9488]/30 text-teal-300 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-teal-400" />
              Methodology
            </button>
          )}
        </div>
        
        {calculatingLAI ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
            <Loader2 className="w-12 h-12 animate-spin text-teal-500" />
            <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Running High-Resolution Local Ancestry Inference...</span>
          </div>
        ) : localSegments ? (
          <div className="relative">
            {/* View Mode Toggle */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center bg-slate-900/80 backdrop-blur border border-white/10 rounded-xl p-1 z-20">
              <button 
                onClick={() => setViewMode('2d')}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${viewMode === '2d' ? 'bg-teal-500/20 text-teal-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                2D Flat
              </button>
              <button 
                onClick={() => setViewMode('3d')}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${viewMode === '3d' ? 'bg-indigo-500/20 text-indigo-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                3D Spatial
              </button>
            </div>

            {viewMode === '2d' ? (
              <ChromosomePainter 
                segments={localSegments} 
                width={700} 
                height={500} 
                onSegmentClick={(chrom, strand, segment, bp) => {
                  setSelectedSegment({ chrom, strand, segment, bp });
                }}
              />
            ) : (
              <ChromosomePainter3D
                segments={localSegments}
                activeContinentFilter={null}
                onSegmentClick={(chrom, strand, segment, bp) => {
                  setSelectedSegment({ chrom, strand, segment, bp });
                }}
              />
            )}
            {/* Detailed Segment Popover/Drawer */}
            <AnimatePresence>
              {selectedSegment && (
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="absolute right-0 top-0 bottom-0 w-80 bg-slate-900/95 border-l border-slate-800 text-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10 rounded-r-3xl"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest block">Chromosome {selectedSegment.chrom}</span>
                        <h4 className="text-lg font-black text-white mt-1 leading-none">Segment Details</h4>
                      </div>
                      <button 
                        onClick={() => setSelectedSegment(null)}
                        className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Ancestral Origin</span>
                        <span className="text-sm font-black text-white mt-1 block flex items-center gap-2">
                          <span 
                            className="w-2.5 h-2.5 rounded-full inline-block" 
                            style={{ backgroundColor: POP_COLORS[selectedSegment.segment.continent] }}
                          />
                          {REGION_NAMES[selectedSegment.segment.continent] ?? selectedSegment.segment.continent}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Genomic Coordinates</span>
                        <span className="text-xs font-mono font-bold text-slate-350 mt-1 block">
                          {(selectedSegment.segment.start / 1000000).toFixed(2)}M - {(selectedSegment.segment.end / 1000000).toFixed(2)}M bp
                        </span>
                      </div>

                      <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Confidence Rating</span>
                        <span className="text-xs font-bold text-slate-350 mt-1 block">
                          {(selectedSegment.segment.confidence * 100).toFixed(0)}% Certainty
                        </span>
                      </div>

                      <div className="pt-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Matched SNPs ({snpsInSegment.length})</span>
                        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
                          {snpsInSegment.slice(0, 30).map((snp: any, i: number) => (
                            <div key={i} className="flex justify-between items-center text-[10px] bg-slate-800/30 p-2 rounded-lg border border-slate-800">
                              <span className="font-mono text-sky-400">{snp.rsid || snp.markerId}</span>
                              <span className="font-mono text-slate-400">pos: {(snp.pos / 1000000).toFixed(2)}M</span>
                              <span className="font-mono font-black text-white">{snp.genotype || '--'}</span>
                            </div>
                          ))}
                          {snpsInSegment.length === 0 && (
                            <span className="text-[10px] text-slate-500 italic block dark:text-slate-400">No call SNPs in this segment window</span>
                          )}
                          {snpsInSegment.length > 30 && (
                            <span className="text-[9px] text-slate-500 text-center block pt-1 dark:text-slate-400">...and {snpsInSegment.length - 30} more SNPs</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 text-[9px] text-slate-500 text-center uppercase tracking-widest dark:text-slate-400">
                    Interactive Segment Inspector
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-10 space-y-4">
            <p className="text-slate-500 font-bold uppercase text-xs tracking-wider dark:text-slate-400">
              {laiError 
                ? `Chromosome painting error: ${laiError}`
                : 'Failed to load chromosome painting data. Make sure a raw kit has been successfully processed.'
              }
            </p>
            <button
              onClick={() => { setLocalSegments(null); setLaiError(null); setRetryCount(c => c + 1); }}
              className="px-6 py-2.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-black text-xs uppercase tracking-widest rounded-xl border border-teal-500/30 transition-all"
            >
              ↻ Retry Computation
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
