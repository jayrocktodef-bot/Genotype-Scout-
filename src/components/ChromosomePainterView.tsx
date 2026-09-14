import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dna, Loader2, X, HelpCircle, Search } from 'lucide-react';
import { ChromosomePainter, CHROMOSOME_LENGTHS } from './ChromosomePainter';
import { computeDatasetLAI, computePaintedAncestry } from '../utils/ancestry/paintedAncestry';

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

function isNativeAmericanAIM(m: any): boolean {
  if (!m) return false;
  const reg = (m.region || m.continent || '').toLowerCase();
  if (reg.includes('native') || reg.includes('indigenous') || reg === 'amr') return true;
  if (m.frequencies) {
    const amrF = m.frequencies.AMR ?? m.frequencies.NAT ?? 0;
    const eurF = m.frequencies.EUR ?? 0;
    const afrF = m.frequencies.AFR ?? 0;
    const maxBackground = Math.max(eurF, afrF);
    if (amrF >= 0.50 && (amrF - maxBackground) >= 0.25) {
      return true;
    }
  }
  return false;
}

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
  const [parentalDiff, setParentalDiff] = useState<any>(null);
  const [laiError, setLaiError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState<{ chrom: string; strand: 'A' | 'B' | 'Both'; segment: Segment; bp: number } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeChromFocus, setActiveChromFocus] = useState<string>('ALL');
  const [activeRegionFilter, setActiveRegionFilter] = useState<string>('ALL');
  const [markerScope, setMarkerScope] = useState<'segment' | 'chromosome' | 'all'>('all');
  const [snpsUsedForLAI, setSnpsUsedForLAI] = useState<any[]>([]);
  const [snpSearchQuery, setSnpSearchQuery] = useState<string>('');
  const [displayLimit, setDisplayLimit] = useState<number>(60);

  const allMatchedAIMs = useMemo(() => {
    return snpsUsedForLAI.length > 0 ? snpsUsedForLAI : (dataset?.analysis?.aimsUsed || []);
  }, [snpsUsedForLAI, dataset]);

  const totalNativeCount = useMemo(() => {
    return allMatchedAIMs.filter(isNativeAmericanAIM).length;
  }, [allMatchedAIMs]);

  const displayedMarkers = useMemo(() => {
    if (allMatchedAIMs.length === 0) return [];
    let list = allMatchedAIMs;

    // 1. Scope filter: Segment vs Chromosome vs All
    if (markerScope === 'segment' && selectedSegment) {
      const { chrom, segment } = selectedSegment;
      const targetC = String(chrom).replace(/^chr/i, '').toUpperCase();
      list = list.filter((r: any) => {
        if (!r.chrom || r.pos === undefined) return false;
        const c = String(r.chrom).replace(/^chr/i, '').toUpperCase();
        return c === targetC && r.pos >= segment.start && r.pos <= segment.end;
      });
    } else if (markerScope === 'chromosome' || (activeChromFocus !== 'ALL' && markerScope !== 'all')) {
      const targetC = String(selectedSegment?.chrom || activeChromFocus).replace(/^chr/i, '').toUpperCase();
      if (targetC !== 'ALL') {
        list = list.filter((r: any) => {
          if (!r.chrom) return false;
          const c = String(r.chrom).replace(/^chr/i, '').toUpperCase();
          return c === targetC;
        });
      }
    }

    // 2. Region / Native American filter
    if (activeRegionFilter !== 'ALL') {
      if (activeRegionFilter === 'AMR') {
        list = list.filter(isNativeAmericanAIM);
      } else {
        list = list.filter((r: any) => {
          const reg = (r.region || r.continent || '').toLowerCase();
          return reg.includes(activeRegionFilter.toLowerCase());
        });
      }
    }

    // 3. Search query filter (rsID, gene, trait, region, genotype, chrom, position)
    if (snpSearchQuery.trim()) {
      const q = snpSearchQuery.trim().toLowerCase();
      list = list.filter((s: any) => 
        (s.rsid || '').toLowerCase().includes(q) ||
        (s.gene || '').toLowerCase().includes(q) ||
        (s.trait || '').toLowerCase().includes(q) ||
        (s.region || s.continent || '').toLowerCase().includes(q) ||
        (s.genotype || '').toLowerCase().includes(q) ||
        String(s.chrom || '').toLowerCase().includes(q) ||
        String(s.pos || '').includes(q)
      );
    }

    return list;
  }, [allMatchedAIMs, selectedSegment, activeChromFocus, markerScope, activeRegionFilter, snpSearchQuery]);

  useEffect(() => {
    if (!dataset) return;
    
    // 1. Instant cache hit from precalculated worker results
    if (dataset.analysis?.segments) {
      setLocalSegments(dataset.analysis.segments);
      if (dataset.analysis?.aimsUsed) {
        setSnpsUsedForLAI(dataset.analysis.aimsUsed);
      }
      if (dataset.analysis?.parentalDifferentiation) {
        setParentalDiff(dataset.analysis.parentalDifferentiation);
      }
      setCalculatingLAI(false);
      return;
    }

    // 2. High-speed in-memory computation fallback (<100ms)
    setCalculatingLAI(true);
    setLaiError(null);

    const timer = setTimeout(() => {
      try {
        const fallbackProportions = 
          dataset.analysis?.oracleResults?.primary?.continentalScores || 
          dataset.analysis?.oracleResults?.continentalScores || 
          dataset.analysis?.subpopulationOracle?.all?.continentalScores || 
          dataset.analysis?.naiveEstimates || 
          {};
        const result = computeDatasetLAI(dataset, fallbackProportions);

        if (result) {
          setLocalSegments(result.segments);
          setSnpsUsedForLAI(result.aimsUsed);
          if (result.parentalDifferentiation) {
            setParentalDiff(result.parentalDifferentiation);
          }
          if (dataset.analysis) {
            dataset.analysis.segments = result.segments;
            dataset.analysis.paintedAncestry = computePaintedAncestry(result.segments, fallbackProportions);
            dataset.analysis.aimsUsed = result.aimsUsed;
            if (result.parentalDifferentiation) {
              dataset.analysis.parentalDifferentiation = result.parentalDifferentiation;
            }
          }
        } else {
          setLaiError("No informative ancestry markers found for chromosome painting.");
        }
      } catch (err: any) {
        console.error("Failed to run local ancestry inference chromosome painting:", err);
        setLaiError(err?.message || 'Unknown error during Local Ancestry Inference.');
      } finally {
        setCalculatingLAI(false);
      }
    }, 10);

    return () => clearTimeout(timer);
  }, [dataset, retryCount]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6 sm:space-y-12"
    >
      <div className="p-2.5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl bg-[#111213]/70 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-start gap-4 text-[#F5F6F7]">
            <Dna className="w-8 h-8 text-[#4599FF] shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl sm:text-3xl sm:text-4xl font-black text-[#F5F6F7] mb-2 tracking-tighter">Chromosome Painting Map</h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
                Maternal vs. Paternal segment-by-segment ancestral origin mapping of your 22 autosomes. For each chromosome pair, the top chromatid represents Strand A (maternal) and the bottom chromatid represents Strand B (paternal) computed via hidden Markov model smoothing.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {allMatchedAIMs.length > 0 && (
              <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-700/60 px-3.5 py-2 rounded-xl text-xs shadow-inner">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Matched AIMs:</span>
                <span className="font-mono font-black text-white">{allMatchedAIMs.length}</span>
                <span className="text-slate-600">|</span>
                <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">🪶 Native American:</span>
                <span className="font-mono font-black text-amber-300">{totalNativeCount}</span>
              </div>
            )}

            <button
              onClick={() => {
                setMarkerScope('all');
                setIsDrawerOpen(true);
              }}
              className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-teal-300 border border-teal-500/40 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm"
            >
              <Search className="w-3.5 h-3.5 text-teal-400" />
              <span>Browse All Matched rsIDs ({allMatchedAIMs.length})</span>
            </button>

            {onOpenMethodology && (
              <button
                onClick={onOpenMethodology}
                className="w-full sm:w-auto shrink-0 px-5 py-2.5 bg-[#0d9488]/20 hover:bg-[#0d9488]/35 border border-[#0d9488]/30 text-teal-300 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-teal-400" />
                Methodology
              </button>
            )}
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
              parentalDifferentiation={parentalDiff}
              isMale={
                dataset?.inferredBiologicalSex === 'MALE' || 
                dataset?.analysis?.inferredBiologicalSex === 'MALE' ||
                dataset?.inferredSex === 'MALE' ||
                Boolean(dataset?.yMap && Object.keys(dataset.yMap).length > 20) ||
                Boolean(localSegments?.['Y'] && (localSegments['Y'] as any)?.isApplicable)
              }
              selectedChromFilter={activeChromFocus}
              onChromFilterChange={(c) => {
                setActiveChromFocus(c);
                setSelectedSegment(null);
                if (c !== 'ALL') {
                  setMarkerScope('chromosome');
                } else {
                  setMarkerScope('all');
                }
              }}
              onSegmentClick={(chrom, strand, segment, bp) => {
                setSelectedSegment({ chrom, strand, segment, bp });
                setActiveChromFocus(chrom);
                setMarkerScope('segment');
                setIsDrawerOpen(true);
              }}
            />

            {/* Detailed Segment / Chromosome Marker Inspector Drawer */}
            <AnimatePresence>
              {isDrawerOpen && (
                <motion.div 
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 60 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="absolute right-0 top-0 bottom-0 w-80 sm:w-[440px] bg-slate-900/98 border-l border-slate-800 text-white p-5 shadow-2xl flex flex-col justify-between overflow-y-auto z-30 rounded-r-3xl backdrop-blur-xl"
                >
                  <div className="space-y-4">
                    {/* Drawer Header */}
                    <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest block">
                          {selectedSegment 
                            ? `Chromosome ${selectedSegment.chrom} · ${selectedSegment.strand === 'A' ? 'Strand A (Maternal)' : 'Strand B (Paternal)'}` 
                            : (activeChromFocus !== 'ALL' ? `Chromosome ${activeChromFocus} Focus` : 'Genome-Wide AIMs Focus')}
                        </span>
                        <h4 className="text-lg font-black text-white mt-1 leading-tight">
                          {selectedSegment ? 'Segment & Marker Inspector' : 'Matched Chromosome Markers'}
                        </h4>
                      </div>
                      <button 
                        onClick={() => {
                          setIsDrawerOpen(false);
                          setSelectedSegment(null);
                        }}
                        className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Segment Specific Summary if a segment is clicked */}
                    {selectedSegment ? (
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
                          <span className="text-slate-400 font-bold block uppercase text-[9px]">Ancestry Origin</span>
                          <span className="text-xs font-black text-white mt-0.5 flex items-center gap-1.5">
                            <span 
                              className="w-2.5 h-2.5 rounded-full inline-block shrink-0" 
                              style={{ backgroundColor: POP_COLORS[selectedSegment.segment.continent] }}
                            />
                            {REGION_NAMES[selectedSegment.segment.continent] ?? selectedSegment.segment.continent}
                          </span>
                        </div>
                        <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
                          <span className="text-slate-400 font-bold block uppercase text-[9px]">Span / Certainty</span>
                          <span className="text-xs font-bold text-slate-200 mt-0.5 block font-mono">
                            {((selectedSegment.segment.end - selectedSegment.segment.start) / 1000000).toFixed(1)} Mb · {Math.round(selectedSegment.segment.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    ) : activeChromFocus !== 'ALL' ? (
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
                          <span className="text-slate-400 font-bold block uppercase text-[9px]">Chromosome</span>
                          <span className="text-xs font-black text-white mt-0.5 flex items-center gap-1.5 font-bold">
                            Chr {activeChromFocus}
                          </span>
                        </div>
                        <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
                          <span className="text-slate-400 font-bold block uppercase text-[9px]">Span / Length</span>
                          <span className="text-xs font-bold text-slate-200 mt-0.5 block font-mono">
                            {((CHROMOSOME_LENGTHS[activeChromFocus] || 0) / 1000000).toFixed(1)} Mb
                          </span>
                        </div>
                      </div>
                    ) : null}

                    {/* Y Chromosome Patrilineal Notice */}
                    {((selectedSegment?.chrom === 'Y') || (activeChromFocus === 'Y' && !selectedSegment)) && (
                      <div className="p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-xl text-[11px] space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                          <Dna className="w-3.5 h-3.5 shrink-0" />
                          <span>Patrilineal Y Chromosome (MSY)</span>
                        </div>
                        <p className="text-slate-300 text-[10px] leading-relaxed">
                          Passed down directly along the paternal lineage. The male-specific region does not recombine, reflecting unbroken patrilineal haplogroup ancestry and tested Y-SNPs.
                        </p>
                      </div>
                    )}

                    {/* Scope Tabs: Segment vs Chromosome vs Genome */}
                    <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
                      {selectedSegment && (
                        <button
                          onClick={() => setMarkerScope('segment')}
                          className={`flex-1 py-1 rounded-lg transition-all text-center ${markerScope === 'segment' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          Segment
                        </button>
                      )}
                      <button
                        onClick={() => setMarkerScope('chromosome')}
                        className={`flex-1 py-1 rounded-lg transition-all text-center ${markerScope === 'chromosome' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        {selectedSegment ? `Chr ${selectedSegment.chrom}` : (activeChromFocus !== 'ALL' ? `Chr ${activeChromFocus}` : 'Chrom Focus')}
                      </button>
                      <button
                        onClick={() => setMarkerScope('all')}
                        className={`flex-1 py-1 rounded-lg transition-all text-center ${markerScope === 'all' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        All Chromosomes
                      </button>
                    </div>

                    {/* Ancestry Quick Filters including Native American Focus */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        onClick={() => setActiveRegionFilter('ALL')}
                        className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border transition-all ${
                          activeRegionFilter === 'ALL'
                            ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        All ({allMatchedAIMs.length})
                      </button>

                      <button
                        onClick={() => setActiveRegionFilter(activeRegionFilter === 'AMR' ? 'ALL' : 'AMR')}
                        className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border transition-all flex items-center gap-1 ${
                          activeRegionFilter === 'AMR'
                            ? 'bg-amber-900/50 text-amber-300 border-amber-500 shadow-md scale-105'
                            : 'bg-amber-950/40 text-amber-400 border-amber-800/40 hover:bg-amber-950/70'
                        }`}
                      >
                        <span>🪶 Native American</span>
                        <span className="font-mono font-bold text-[9px] bg-amber-950 px-1 py-0.2 rounded border border-amber-700/60">{totalNativeCount}</span>
                      </button>

                      {['AFR', 'EUR', 'EAS'].map((pop) => (
                        <button
                          key={pop}
                          onClick={() => setActiveRegionFilter(activeRegionFilter === pop ? 'ALL' : pop)}
                          className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border transition-all ${
                            activeRegionFilter === pop
                              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {pop}
                        </button>
                      ))}
                    </div>

                    {/* Search Query Input */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                      <input 
                        type="text"
                        placeholder="Search rsID, gene (e.g. EDAR), region, or genotype..."
                        value={snpSearchQuery}
                        onChange={(e) => setSnpSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 text-slate-200 text-xs pl-8 pr-8 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500/60 placeholder:text-slate-500 font-mono"
                      />
                      {snpSearchQuery && (
                        <button 
                          onClick={() => setSnpSearchQuery('')}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Results Counter */}
                    <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-800/80 pb-1.5 font-bold uppercase tracking-wider">
                      <span>Showing {Math.min(displayLimit, displayedMarkers.length)} of {displayedMarkers.length} Markers</span>
                      {activeRegionFilter === 'AMR' && <span className="text-amber-400">Native American Filter Active</span>}
                    </div>

                    {/* Matched Markers List */}
                    <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin">
                      {displayedMarkers.slice(0, displayLimit).map((snp: any, i: number) => {
                        const reg = (snp.region || snp.continent || '').toLowerCase();
                        const isNative = reg.includes('native') || reg.includes('indigenous') || reg.includes('amr') || (snp.frequencies && (snp.frequencies.AMR >= 0.35 || snp.frequencies.NAT >= 0.35));

                        return (
                          <div 
                            key={i} 
                            className="flex flex-col gap-1.5 text-[11px] bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40 hover:border-teal-500/40 transition-all shadow-sm"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-mono text-sky-400 font-black text-xs">{snp.rsid || snp.markerId}</span>
                                {isNative && (
                                  <span className="text-[9px] font-black uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-600/50 px-1.5 py-0.5 rounded-md">
                                    🪶 Native American
                                  </span>
                                )}
                                {!isNative && snp.region && snp.region !== 'Global' && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded-md">
                                    {snp.region}
                                  </span>
                                )}
                              </div>
                              <span className="font-mono font-black text-teal-300 bg-teal-950/90 px-2 py-0.5 rounded-md border border-teal-700/60 text-xs">
                                {snp.genotype || '--'}
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                              <span>Chr {snp.chrom} : {(snp.pos / 1000000).toFixed(3)} Mb</span>
                              {snp.gene && snp.gene !== 'AIM Locus' && (
                                <span className="text-indigo-300 font-sans font-bold bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/40 text-[9px]">
                                  {snp.gene}
                                </span>
                              )}
                            </div>

                            {snp.trait && snp.trait !== 'Ancestry' && (
                              <div className="text-[9.5px] text-slate-300 font-sans truncate bg-slate-900/60 px-1.5 py-0.5 rounded">
                                {snp.trait}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {displayedMarkers.length === 0 && (
                        <div className="text-center py-8 text-slate-500 space-y-1">
                          <p className="text-xs font-bold uppercase tracking-wider">No matching DNA markers found</p>
                          <p className="text-[10px]">Try clearing search or choosing "All Chromosomes"</p>
                        </div>
                      )}

                      {displayedMarkers.length > displayLimit && (
                        <button
                          onClick={() => setDisplayLimit(prev => prev + 100)}
                          className="w-full py-2.5 bg-slate-800/90 hover:bg-slate-700 text-teal-300 text-xs font-bold rounded-xl border border-teal-500/30 transition-all mt-2 shadow-sm"
                        >
                          Load More (+100) — Showing {displayLimit} of {displayedMarkers.length}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-[9px] text-slate-500 text-center uppercase tracking-widest">
                    Interactive Segment & DNA Inspector · {allMatchedAIMs.length} AIMs Indexed
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
