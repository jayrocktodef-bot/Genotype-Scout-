import React, { memo, useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Dna, History, User, MapPin, Download, Share2, FileImage, Loader2, Sparkles, HelpCircle, X } from 'lucide-react';
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { trackSickleCellHaplotype } from '../utils/ancestry/haplotypeTracker';
import { ChromosomePainter, ChromosomePainterRef } from './ChromosomePainter';
import { workerPoolEngine } from '../engines/ancestry/workerPoolEngine';
import { POPULATION_MAP } from '../utils/populationMapper';
import jsPDF from 'jspdf';

const POP_COLORS: Record<string, string> = {
  EUR: '#3b82f6',
  AFR: '#10b981',
  EAS: '#ef4444',
  SAS: '#f59e0b',
  AMR: '#a855f7',
  OCE: '#06b6d4',
  MID: '#f97316'
};

interface Segment {
  continent: string;
  start: number;
  end: number;
  confidence: number;
}

export const ModernAncestryOracle = memo(({ 
  results,
  dataset,
  onOpenMethodology,
  mode = 'explorer'
}: { 
  results: any;
  dataset?: any;
  onOpenMethodology?: () => void;
  mode?: 'explorer' | 'analyst';
}) => {
  const [isChartReady, setIsChartReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsChartReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const [viewMode] = useState<'primary'>('primary');
  const [exporting] = useState(false);
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
        const snpsForLAI = dataset.results
          .filter((r: any) => {
            if (!r.chrom || r.pos === undefined) return false;
            const chrom = r.chrom.replace('chr', '').toUpperCase();
            const n = parseInt(chrom);
            return !isNaN(n) && n >= 1 && n <= 22;
          })
          .map((r: any) => ({
            rsid: (r.rsid || r.markerId).toLowerCase(),
            genotype: r.genotype || '--',
            chrom: r.chrom,
            pos: r.pos
          }));

        if (snpsForLAI.length === 0) return;

        const rsids = snpsForLAI.map((s: any) => s.rsid);
        const { getAimsByRsids } = await import('../services/dbHydrator');
        const aimsDb = await getAimsByRsids(rsids);
        
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

  const runHighResAnalysis = async () => {};
  const segmentsToPainter = null;

  const exportAncestryReport = async () => {};
  
  const resultsToDisplay = results?.primary;
  const continentalScores = resultsToDisplay?.continentalScores || {};
  
  const hbbMigration = useMemo(() => {
    return results.userSnps ? trackSickleCellHaplotype(results.userSnps) : null;
  }, [results.userSnps]);

  const chartData = useMemo(() => {
    return Object.entries(continentalScores).map(([key, value]) => ({
      subject: key === 'AMR' ? 'American' : (key === 'EAS' ? 'East Asian' : (key === 'SAS' ? 'South Asian' : (key === 'AFR' ? 'African' : (key === 'EUR' ? 'European' : key)))),
      A: Number(value),
      fullMark: 100,
    }));
  }, [continentalScores]);

  const hasData = Object.keys(continentalScores).length > 0;
  
  if (!hasData) {
    return (
      <div className="p-12 text-center text-slate-500">
        No Ancestry Results Available - Please load and process a valid dataset.
      </div>
    );
  }
  
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:space-y-12"
    >
      {/* Standard Oracle Section */}
      <div className="p-4 sm:p-8 md:p-12 rounded-3xl bg-[#111213]/70 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl sm:text-4xl font-black text-[#F5F6F7] mb-2 tracking-tighter">Ancestry Oracle V2</h2>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[10px] sm:text-xs font-bold text-[#4599FF] uppercase tracking-widest">High-Precision Admixture Analysis</p>
            </div>
          </div>
        </div>

        {mode === 'analyst' && (
        <div className="mb-10 p-6 rounded-2xl bg-teal-500/5 border border-teal-500/10 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-teal-500/25 transition-all">
          <div className="flex gap-4 items-start text-[#F5F6F7]">
            <Dna className="w-8 h-8 text-teal-400 mt-1 shrink-0" />
            <div>
              <h4 className="font-extrabold text-base tracking-tight mb-1">Non-Negative Least Squares (NNLS) Optimization Oracle</h4>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                The Ancestry Oracle is not a classic "ethnicity calculator." It directly analyzes your exact Ancestry Informative Markers (AIMs) database against modern 1000 Genomes references using raw genetic dosages through Non-Negative Least Squares optimization.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenMethodology}
            className="w-full sm:w-auto shrink-0 px-6 py-3 bg-teal-600/20 hover:bg-teal-600/35 border border-teal-500/30 text-teal-300 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-teal-400" />
            Methodology
          </button>
        </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-center">
          <div className="h-[300px] sm:h-[450px] lg:col-span-2 w-full min-w-0 relative">
            {isChartReady ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300} debounce={1}>
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
            ) : (
              <div className="w-full h-full bg-[#1e293b]/50 rounded-2xl animate-pulse" />
            )}
          </div>
          
          <div className="space-y-4 sm:space-y-6 lg:col-span-1">
            {Object.entries(continentalScores).map(([name, value]) => (
              <div key={name} className="flex items-center justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#1a1b1d]/70 backdrop-blur-sm border border-white/5 hover:border-[#4599FF]/50 transition-colors">
                <span className="font-bold text-base sm:text-lg text-[#F5F6F7]">{getDisplayName(name)}</span>
                <span className="font-mono font-black text-lg sm:text-xl text-[#4599FF]">{(Number(value) || 0).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Autosomal Chromosome Painting Map */}
      <div className="p-4 sm:p-8 md:p-12 rounded-3xl bg-[#111213]/70 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex items-start gap-4 text-[#F5F6F7] mb-6">
          <Dna className="w-8 h-8 text-[#4599FF] shrink-0 mt-1" />
          <div>
            <h3 className="text-xl sm:text-2xl font-black mb-1 tracking-tighter">Chromosome Painting Map</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Maternal vs. Paternal segment-by-segment ancestral origin mapping of your 22 autosomes. For each chromosome pair, the left chromatid represents Strand A (maternal) and the right chromatid represents Strand B (paternal) computed via hidden Markov model smoothing.
            </p>
          </div>
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
                          {selectedSegment.segment.continent === 'EUR' ? 'European' : 
                           selectedSegment.segment.continent === 'AFR' ? 'African' :
                           selectedSegment.segment.continent === 'EAS' ? 'East Asian' :
                           selectedSegment.segment.continent === 'SAS' ? 'South Asian' :
                           selectedSegment.segment.continent === 'AMR' ? 'Native American' : 
                           selectedSegment.segment.continent}
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

      {/* Historical Haplotype Tracking for Sickle Cell / HBB */}
      {hbbMigration && (
        <div className="mt-12 p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-red-500/5 border border-red-500/10 overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <MapPin size={120} />
           </div>
           <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 rounded-lg bg-red-500/20">
                <MapPin className="w-4 h-4 text-red-500" />
              </div>
              <h4 className="text-sm font-black text-red-500 uppercase tracking-widest">Historical Haplotype Tracker</h4>
           </div>
           <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <div className="flex-grow">
                 <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">Variant Lineage Detected</div>
                 <h5 className="text-xl font-black text-white mb-4">{hbbMigration.type} Pattern (HBB)</h5>
                 <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                   {hbbMigration.narrative}
                 </p>
              </div>
              <div className="w-full md:min-w-[280px] md:w-auto p-6 rounded-2xl bg-black/40 border border-white/5">
                 <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Migration Path</div>
                 <div className="space-y-4">
                    {hbbMigration.path.split('→').map((node, i, arr) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-red-500' : 'bg-slate-700'}`}></div>
                          {i < arr.length - 1 && <div className="w-[1px] h-4 bg-slate-800"></div>}
                        </div>
                        <span className={`text-xs ${i === 0 ? 'font-bold text-slate-200' : 'text-slate-500'}`}>{node.trim()}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </motion.div>
  );
});
