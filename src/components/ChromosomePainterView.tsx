import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dna, Loader2, X, HelpCircle } from 'lucide-react';
import { ChromosomePainter } from './ChromosomePainter';
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
  const [selectedSegment, setSelectedSegment] = useState<{ chrom: string; strand: 'A' | 'B' | 'Both'; segment: Segment; bp: number } | null>(null);

  const snpsInSegment = useMemo(() => {
    if (!selectedSegment || !dataset?.results) return [];
    const { chrom, segment } = selectedSegment;
    return dataset.results.filter((r: any) => {
      if (!r.chrom || r.pos === undefined) return false;
      const c = r.chrom.replace('chr', '').toUpperCase();
      const targetC = chrom.replace('chr', '').toUpperCase();
      return c === targetC && r.pos >= segment.start && r.pos <= segment.end;
    });
  }, [selectedSegment, dataset]);

  useEffect(() => {
    if (!dataset?.results || dataset.results.length === 0) return;
    
    let active = true;
    const runLAI = async () => {
      setCalculatingLAI(true);
      try {
        const rawRsids = dataset.results.map((r: any) => (r.rsid || r.markerId || "").toLowerCase()).filter(Boolean);
        const { getAimsByRsids } = await import('../services/dbHydrator');
        const aimsDb = await getAimsByRsids(rawRsids);

        const snpsForLAI = dataset.results
          .map((r: any) => {
            const rsid = (r.rsid || r.markerId || "").toLowerCase();
            const aim = aimsDb[rsid];
            const chrom = r.chrom || aim?.chromosome || aim?.chrom;
            const pos = r.pos !== undefined ? r.pos : (aim?.position !== undefined ? aim.position : aim?.pos);
            return {
              rsid,
              genotype: r.genotype || '--',
              chrom: chrom ? String(chrom).replace('chr', '').toUpperCase() : '',
              pos: typeof pos === 'number' ? pos : (pos ? parseInt(pos, 10) : undefined)
            };
          })
          .filter((s: any) => {
            if (!s.chrom || s.pos === undefined || isNaN(s.pos)) return false;
            const chromStr = String(s.chrom).toUpperCase().replace('CHR', '');
            if (chromStr === 'X' || chromStr === '23') return true;
            const n = parseInt(chromStr, 10);
            return !isNaN(n) && n >= 1 && n <= 22;
          });

        if (snpsForLAI.length === 0) return;

        const populations = ['AFR', 'EUR', 'EAS', 'AMR', 'SAS'];
        
        const segments = await workerPoolEngine.runParallelAncestry(
          snpsForLAI,
          aimsDb,
          populations
        );
        if (active) {
          setLocalSegments(segments);
        }
      } catch (err) {
        console.error("Failed to run local ancestry inference chromosome painting:", err);
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
  }, [dataset]);

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
            <ChromosomePainter 
              segments={localSegments} 
              width={700} 
              height={500} 
              onSegmentClick={(chrom, strand, segment, bp) => {
                setSelectedSegment({ chrom, strand, segment, bp });
              }}
            />
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
                            <span className="text-[10px] text-slate-500 italic block">No call SNPs in this segment window</span>
                          )}
                          {snpsInSegment.length > 30 && (
                            <span className="text-[9px] text-slate-500 text-center block pt-1">...and {snpsInSegment.length - 30} more SNPs</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 text-[9px] text-slate-500 text-center uppercase tracking-widest">
                    Interactive Segment Inspector
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500 font-bold uppercase text-xs tracking-wider">
            Failed to load chromosome painting data. Make sure a raw kit has been successfully processed.
          </div>
        )}
      </div>
    </motion.div>
  );
};
