/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Dna, 
  Info, 
  BarChart3, 
  ShieldCheck, 
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  CHROMOSOME_LENGTHS, 
  CENTROMERE_POSITIONS_MB, 
  CHROMOSOME_ORDER 
} from '../constants/chromosomeMetadata';
import {
  ColorblindMode,
  COLORBLIND_PALETTES,
  getSegmentColor,
  getSegmentPattern,
  CONTINENT_PALETTES
} from '../constants/ancestryThemes';

const REGION_NAMES: Record<string, string> = {
  EUR: 'European',
  AFR: 'African',
  EAS: 'East Asian',
  SAS: 'South Asian',
  AMR: 'Indigenous American',
  OCE: 'Oceanian',
  MID: 'Middle Eastern'
};

const REGION_ICONS: Record<string, string> = {
  EUR: '🏛️',
  AFR: '🌍',
  EAS: '🏮',
  SAS: '🪷',
  AMR: '🌿',
  OCE: '🌊',
  MID: '🕌',
  Other: '🌐'
};

export interface DetailSegment {
  continent: string;
  start: number;
  end: number;
  confidence: number;
  snpsCount?: number;
}

export interface ChromosomeDetailViewProps {
  chrom: string;
  onClose: () => void;
  onSelectChromosome: (chrom: string) => void;
  segments: Record<string, DetailSegment[] | { strandA: DetailSegment[]; strandB: DetailSegment[] }>;
  aims?: any[];
  isMale?: boolean;
  colorblindMode?: ColorblindMode;
  showPatterns?: boolean;
}

export const ChromosomeDetailView: React.FC<ChromosomeDetailViewProps> = ({
  chrom,
  onClose,
  onSelectChromosome,
  segments,
  aims = [],
  isMale = false,
  colorblindMode = 'default',
  showPatterns = false
}) => {
  const length = CHROMOSOME_LENGTHS[chrom] || 100_000_000;
  const lengthMb = (length / 1_000_000).toFixed(1);
  const centromereMb = CENTROMERE_POSITIONS_MB[chrom] || 0;
  const centromerePct = (centromereMb * 1_000_000 / length) * 100;

  // Extract strands
  const chromData = segments[chrom];
  const strandA: DetailSegment[] = useMemo(() => {
    if (!chromData) return [];
    return Array.isArray(chromData) ? chromData : (chromData as any).strandA || [];
  }, [chromData]);

  const strandB: DetailSegment[] = useMemo(() => {
    if (!chromData) return [];
    return Array.isArray(chromData) ? [] : (chromData as any).strandB || [];
  }, [chromData]);

  // Selected segment state for integrated inspector
  const [selectedSeg, setSelectedSeg] = useState<{
    strand: 'A' | 'B';
    segment: DetailSegment;
  } | null>(() => {
    if (strandA.length > 0) return { strand: 'A', segment: strandA[0] };
    if (strandB.length > 0) return { strand: 'B', segment: strandB[0] };
    return null;
  });

  // When chromosome changes, default to first available segment
  useEffect(() => {
    if (strandA.length > 0) {
      setSelectedSeg({ strand: 'A', segment: strandA[0] });
    } else if (strandB.length > 0) {
      setSelectedSeg({ strand: 'B', segment: strandB[0] });
    } else {
      setSelectedSeg(null);
    }
  }, [chrom, strandA, strandB]);

  // Navigation handlers
  const currentIndex = CHROMOSOME_ORDER.indexOf(chrom);
  const handlePrevChrom = () => {
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : CHROMOSOME_ORDER.length - 1;
    onSelectChromosome(CHROMOSOME_ORDER[prevIdx]);
  };
  const handleNextChrom = () => {
    const nextIdx = currentIndex < CHROMOSOME_ORDER.length - 1 ? currentIndex + 1 : 0;
    onSelectChromosome(CHROMOSOME_ORDER[nextIdx]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') handlePrevChrom();
      else if (e.key === 'ArrowRight') handleNextChrom();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, onClose]);

  // Touch swipe handling (left/right for chromosome navigation, down to dismiss)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        handleNextChrom();
      } else {
        handlePrevChrom();
      }
    } else if (deltaY > 80 && Math.abs(deltaX) < 45) {
      onClose();
    }
  };

  // Filter matched AIMs on this chromosome
  const chromAims = useMemo(() => {
    const targetC = String(chrom).replace(/^chr/i, '').toUpperCase();
    return aims.filter((r: any) => {
      if (!r.chrom) return false;
      const c = String(r.chrom).replace(/^chr/i, '').toUpperCase();
      return c === targetC;
    });
  }, [aims, chrom]);

  // Compute SNP density histogram (60 bins across chromosome length)
  const NUM_BINS = 60;
  const histogramBins = useMemo(() => {
    const bins = new Array(NUM_BINS).fill(0);
    const binSize = length / NUM_BINS;

    if (chromAims.length > 0) {
      for (const aim of chromAims) {
        if (typeof aim.pos === 'number' && aim.pos >= 0 && aim.pos <= length) {
          const binIdx = Math.min(NUM_BINS - 1, Math.floor(aim.pos / binSize));
          bins[binIdx]++;
        }
      }
    } else {
      // Fallback: aggregate from segment snpsCount
      const allSegs = [...strandA, ...strandB];
      for (const seg of allSegs) {
        const count = seg.snpsCount || 10;
        const startBin = Math.max(0, Math.floor(seg.start / binSize));
        const endBin = Math.min(NUM_BINS - 1, Math.floor(seg.end / binSize));
        const numSpanBins = Math.max(1, endBin - startBin + 1);
        const perBin = count / numSpanBins;
        for (let b = startBin; b <= endBin; b++) {
          bins[b] += perBin;
        }
      }
    }

    const maxCount = Math.max(1, ...bins);
    return bins.map((count, i) => ({
      startMb: ((i * binSize) / 1_000_000).toFixed(1),
      endMb: (((i + 1) * binSize) / 1_000_000).toFixed(1),
      count: Math.round(count),
      pctHeight: Math.max(4, (count / maxCount) * 100)
    }));
  }, [NUM_BINS, length, chromAims, strandA, strandB]);

  // Confidence styling helper:
  // - >80%: solid (opacity 1.0)
  // - 50-80%: faded (80% opacity)
  // - <50%: hatched pattern overlay
  const getConfidenceStyle = (confidence: number, continent: string) => {
    const baseColor = getSegmentColor(continent, colorblindMode);
    const patternDef = getSegmentPattern(continent);

    if (confidence >= 0.8) {
      return {
        backgroundColor: baseColor,
        opacity: 1,
        backgroundImage: showPatterns && patternDef.cssPattern !== 'none' ? patternDef.cssPattern : undefined,
        backgroundSize: patternDef.backgroundSize
      };
    } else if (confidence >= 0.5) {
      return {
        backgroundColor: baseColor,
        opacity: 0.8,
        backgroundImage: showPatterns && patternDef.cssPattern !== 'none' ? patternDef.cssPattern : undefined,
        backgroundSize: patternDef.backgroundSize
      };
    } else {
      // Low confidence: hatched pattern overlay
      return {
        backgroundColor: baseColor,
        opacity: 0.85,
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 2.5px, transparent 2.5px, transparent 7px)'
      };
    }
  };

  // Helper for centromere clip-path
  const cp = centromerePct;
  const strandAClip = `polygon(0 0, ${Math.max(0, cp - 1.2)}% 0, ${cp}% 22%, ${Math.min(100, cp + 1.2)}% 0, 100% 0, 100% 100%, ${Math.min(100, cp + 0.9)}% 100%, ${cp}% 86%, ${Math.max(0, cp - 0.9)}% 100%, 0 100%)`;
  const strandBClip = `polygon(0 0, ${Math.max(0, cp - 0.9)}% 0, ${cp}% 14%, ${Math.min(100, cp + 0.9)}% 0, 100% 0, 100% 100%, ${Math.min(100, cp + 1.2)}% 100%, ${cp}% 78%, ${Math.max(0, cp - 1.2)}% 100%, 0 100%)`;

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#0a0d14]/95 backdrop-blur-xl flex flex-col overflow-y-auto text-slate-100 animate-fadeIn"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={`Chromosome ${chrom} detail view`}
    >
      {/* Mobile Swipe-Down Pill */}
      <div className="w-full flex justify-center pt-2 pb-1 md:hidden">
        <div className="w-12 h-1.5 rounded-full bg-slate-700/60" />
      </div>

      {/* Top Header Navigation */}
      <header className="px-4 sm:px-8 py-3 sm:py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0f1420]/80">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Dna className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                Chromosome {chrom}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {lengthMb} Mbp
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 font-mono mt-0.5 hidden sm:block">
              Centromere: ~{centromereMb} Mbp · p-arm: 0–{centromereMb} Mb · q-arm: {centromereMb}–{lengthMb} Mb
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Previous Chromosome */}
          <button
            onClick={handlePrevChrom}
            className="min-w-[48px] min-h-[48px] p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/10 transition-all flex items-center justify-center hover:text-white"
            title="Previous Chromosome (Left Arrow)"
            aria-label="Previous Chromosome"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Chromosome */}
          <button
            onClick={handleNextChrom}
            className="min-w-[48px] min-h-[48px] p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/10 transition-all flex items-center justify-center hover:text-white"
            title="Next Chromosome (Right Arrow)"
            aria-label="Next Chromosome"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Close Modal */}
          <button
            onClick={onClose}
            className="min-w-[48px] min-h-[48px] p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all flex items-center justify-center hover:text-rose-300 ml-1"
            title="Close Detail View (Escape)"
            aria-label="Close Detail View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* Navigation Breadcrumb & Quick Switcher */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-white/5">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1.5 shrink-0">
              Jump:
            </span>
            {CHROMOSOME_ORDER.map(c => {
              const isCurr = c === chrom;
              return (
                <button
                  key={c}
                  onClick={() => onSelectChromosome(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center ${
                    isCurr
                      ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                      : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/5'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Confidence Legend Quick Guide */}
          <div className="flex items-center gap-3 text-xs bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Confidence:</span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-sm bg-teal-400 inline-block" />
              <span className="text-slate-300 font-medium">&gt;80% Solid</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-sm bg-teal-400/80 inline-block opacity-75" />
              <span className="text-slate-400 font-medium">50-80% Faded</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span 
                className="w-2.5 h-2.5 rounded-sm bg-teal-400 inline-block" 
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1.5px, transparent 1.5px, transparent 3px)' }}
              />
              <span className="text-slate-400 font-medium">&lt;50% Hatched</span>
            </div>
          </div>
        </div>

        {/* Primary Visualization Container */}
        <section className="bg-[#0f1420] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 relative">
          
          {/* Centromere Spatial Annotation Banner */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-black text-white uppercase tracking-wider text-[11px]">Cytoband Architecture</span>
              <span className="text-slate-500">•</span>
              <span>Primary Constriction Pinch at ~{centromereMb} Mbp</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
              <span>p-arm (short): 0–{centromereMb} Mb</span>
              <span>q-arm (long): {centromereMb}–{lengthMb} Mb</span>
            </div>
          </div>

          {/* Maternal and Paternal Chromatid Tracks */}
          <div className="space-y-4">
            
            {/* Maternal Strand (Strand A) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Maternal
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    {chrom === 'Y' 
                      ? 'Hemizygous (No Maternal Y — Male XY)' 
                      : (chrom === 'X' || chrom === '23') && isMale
                        ? 'Strand A (Maternal X — 100% Maternal Inheritance)'
                        : 'Strand A (Maternal Chromatid)'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {strandA.length} segment{strandA.length === 1 ? '' : 's'}
                </span>
              </div>

              {/* Track A container with >=48px height and centromere pinch */}
              <div 
                className="relative w-full min-h-[48px] h-14 bg-slate-950 rounded-xl overflow-hidden border border-white/10 shadow-inner group/trackA"
                style={{ clipPath: strandAClip }}
              >
                {strandA.length === 0 ? (
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center text-xs font-black text-slate-500 uppercase tracking-widest">
                    {chrom === 'Y' ? 'Hemizygous (No Maternal Y — Male XY)' : 'No Coverage'}
                  </div>
                ) : (
                  strandA.map((seg, i) => {
                    const startPos = i === 0 ? 0 : seg.start;
                    const endPos = i === strandA.length - 1 ? length : seg.end;
                    const pctLeft = (startPos / length) * 100;
                    const pctWidth = ((endPos - startPos) / length) * 100;
                    const isSelected = selectedSeg?.strand === 'A' && selectedSeg?.segment === seg;
                    const confStyle = getConfidenceStyle(seg.confidence, seg.continent);

                    return (
                      <div
                        key={i}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedSeg({ strand: 'A', segment: { ...seg, start: startPos, end: endPos } })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedSeg({ strand: 'A', segment: { ...seg, start: startPos, end: endPos } });
                          }
                        }}
                        className={`absolute top-0 bottom-0 cursor-pointer transition-all duration-200 hover:brightness-110 flex items-center justify-center overflow-hidden min-h-[48px] ${
                          isSelected ? 'ring-2 ring-white z-20 brightness-125' : 'border-r border-black/30'
                        }`}
                        style={{
                          left: `${pctLeft}%`,
                          width: `${Math.max(0.3, pctWidth)}%`,
                          ...confStyle
                        }}
                        title={`${REGION_NAMES[seg.continent] || seg.continent}: ${(startPos / 1e6).toFixed(1)}–${(endPos / 1e6).toFixed(1)} Mb (${Math.round(seg.confidence * 100)}% confidence)`}
                      >
                        {pctWidth > 7 && (
                          <div className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm text-white font-mono font-black text-[10px] tracking-wider pointer-events-none truncate">
                            {REGION_NAMES[seg.continent] || seg.continent}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Centromere vertical line indicator */}
                <div 
                  className="absolute top-0 bottom-0 w-[2px] bg-white/20 pointer-events-none z-30"
                  style={{ left: `${centromerePct}%` }}
                />
              </div>
            </div>

            {/* Paternal Strand (Strand B) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Paternal
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    {chrom === 'Y' 
                      ? 'Strand B (Paternal Y Lineage — MSY)' 
                      : (chrom === 'X' || chrom === '23') && isMale
                        ? 'Hemizygous (No Paternal X — Male XY)'
                        : 'Strand B (Paternal Chromatid)'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {strandB.length} segment{strandB.length === 1 ? '' : 's'}
                </span>
              </div>

              {/* Track B container with >=48px height and centromere pinch */}
              <div 
                className="relative w-full min-h-[48px] h-14 bg-slate-950 rounded-xl overflow-hidden border border-white/10 shadow-inner group/trackB"
                style={{ clipPath: strandBClip }}
              >
                {strandB.length === 0 ? (
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center text-xs font-black text-slate-500 uppercase tracking-widest">
                    {(chrom === 'X' || chrom === '23') && isMale 
                      ? 'Hemizygous (No Paternal X — Male XY)' 
                      : 'No Coverage'}
                  </div>
                ) : (
                  strandB.map((seg, i) => {
                    const startPos = i === 0 ? 0 : seg.start;
                    const endPos = i === strandB.length - 1 ? length : seg.end;
                    const pctLeft = (startPos / length) * 100;
                    const pctWidth = ((endPos - startPos) / length) * 100;
                    const isSelected = selectedSeg?.strand === 'B' && selectedSeg?.segment === seg;
                    const confStyle = getConfidenceStyle(seg.confidence, seg.continent);

                    return (
                      <div
                        key={i}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedSeg({ strand: 'B', segment: { ...seg, start: startPos, end: endPos } })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedSeg({ strand: 'B', segment: { ...seg, start: startPos, end: endPos } });
                          }
                        }}
                        className={`absolute top-0 bottom-0 cursor-pointer transition-all duration-200 hover:brightness-110 flex items-center justify-center overflow-hidden min-h-[48px] ${
                          isSelected ? 'ring-2 ring-white z-20 brightness-125' : 'border-r border-black/30'
                        }`}
                        style={{
                          left: `${pctLeft}%`,
                          width: `${Math.max(0.3, pctWidth)}%`,
                          ...confStyle
                        }}
                        title={`${REGION_NAMES[seg.continent] || seg.continent}: ${(startPos / 1e6).toFixed(1)}–${(endPos / 1e6).toFixed(1)} Mb (${Math.round(seg.confidence * 100)}% confidence)`}
                      >
                        {pctWidth > 7 && (
                          <div className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm text-white font-mono font-black text-[10px] tracking-wider pointer-events-none truncate">
                            {REGION_NAMES[seg.continent] || seg.continent}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Centromere vertical line indicator */}
                <div 
                  className="absolute top-0 bottom-0 w-[2px] bg-white/20 pointer-events-none z-30"
                  style={{ left: `${centromerePct}%` }}
                />
              </div>
            </div>

          </div>

          {/* SNP Density Histogram Track */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                  SNP Density Histogram (AIM Coverage Across Chromosome)
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {chromAims.length > 0 
                  ? `${chromAims.length.toLocaleString()} mapped AIM markers` 
                  : 'Aggregated LAI Informative Density'}
              </span>
            </div>

            {/* Density Track Bars */}
            <div className="relative w-full h-16 bg-slate-950/80 rounded-xl border border-white/10 p-1 flex items-end justify-between gap-[1px] overflow-hidden">
              {histogramBins.map((bin, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-gradient-to-t from-teal-500/80 to-teal-400/40 hover:from-teal-400 hover:to-teal-300 transition-all rounded-t-sm group/bin relative cursor-crosshair"
                  style={{ height: `${bin.pctHeight}%` }}
                >
                  <div className="opacity-0 group-hover/bin:opacity-100 transition-opacity absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 border border-teal-500/40 text-white text-[10px] font-mono px-2 py-1 rounded shadow-xl whitespace-nowrap z-30 pointer-events-none">
                    {bin.startMb}–{bin.endMb} Mb: {bin.count} AIMs
                  </div>
                </div>
              ))}

              {/* Centromere line in histogram */}
              <div 
                className="absolute top-0 bottom-0 w-[1.5px] bg-amber-400/70 pointer-events-none z-20"
                style={{ left: `${centromerePct}%` }}
              >
                <span className="absolute top-1 left-1 text-[8px] font-mono font-bold text-amber-300 uppercase tracking-widest bg-slate-900/80 px-1 rounded border border-amber-500/30">
                  Cen
                </span>
              </div>
            </div>

            {/* Megabase Coordinate Ticks */}
            <div className="relative w-full h-4 text-[9px] font-mono text-slate-500 flex justify-between px-1">
              <span>0 Mb</span>
              <span style={{ position: 'absolute', left: `${centromerePct}%`, transform: 'translateX(-50%)' }} className="text-amber-400/80 font-bold">
                {centromereMb} Mb (Centromere)
              </span>
              <span>{(length / 2 / 1e6).toFixed(0)} Mb</span>
              <span>{lengthMb} Mb</span>
            </div>
          </div>

        </section>

        {/* Integrated Segment Inspector */}
        <section className="bg-[#0f1420] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Integrated Segment Inspector</h3>
                <p className="text-xs text-slate-400">
                  Select any segment in the tracks above to inspect detailed ancestry metrics, confidence, and genomic span
                </p>
              </div>
            </div>
            {selectedSeg && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-teal-300 border border-white/10">
                {selectedSeg.strand === 'A' ? 'Maternal Strand' : 'Paternal Strand'}
              </span>
            )}
          </div>

          {selectedSeg ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Card 1: Ancestry Assignment */}
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Ancestry Assignment
                </span>
                <div className="flex items-center gap-2.5 my-2">
                  <span className="text-2xl">{REGION_ICONS[selectedSeg.segment.continent] || '🌐'}</span>
                  <div>
                    <h4 className="text-base font-black text-white">
                      {REGION_NAMES[selectedSeg.segment.continent] || selectedSeg.segment.continent}
                    </h4>
                    <span className="text-xs font-mono text-teal-400">
                      Code: {selectedSeg.segment.continent}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {selectedSeg.strand === 'A' ? 'Inherited from maternal lineage' : 'Inherited from paternal lineage'}
                </div>
              </div>

              {/* Card 2: Genomic Coordinates */}
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Genomic Position (GRCh38)
                </span>
                <div className="my-2 space-y-0.5">
                  <div className="text-base font-mono font-black text-white">
                    {(selectedSeg.segment.start / 1e6).toFixed(2)} – {(selectedSeg.segment.end / 1e6).toFixed(2)} Mbp
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 truncate">
                    {selectedSeg.segment.start.toLocaleString()} – {selectedSeg.segment.end.toLocaleString()} bp
                  </div>
                </div>
                <div className="text-[11px] text-teal-300 font-mono">
                  Length: {((selectedSeg.segment.end - selectedSeg.segment.start) / 1e6).toFixed(2)} Mbp
                </div>
              </div>

              {/* Card 3: Confidence Score */}
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Statistical Confidence
                </span>
                <div className="my-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-white">
                      {Math.round(selectedSeg.segment.confidence * 100)}%
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      selectedSeg.segment.confidence >= 0.8
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : selectedSeg.segment.confidence >= 0.5
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {selectedSeg.segment.confidence >= 0.8 ? 'High (>80%)' : selectedSeg.segment.confidence >= 0.5 ? 'Moderate (50-80%)' : 'Low (<50%)'}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400">
                  {selectedSeg.segment.confidence >= 0.8 
                    ? 'Solid continuous call supported by high posterior probability' 
                    : selectedSeg.segment.confidence >= 0.5
                      ? 'Faded rendering: moderate posterior likelihood'
                      : 'Hatched overlay: low confidence / admixed recombination boundary'}
                </div>
              </div>

              {/* Card 4: Supporting SNPs */}
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Supporting AIM Markers
                </span>
                <div className="my-2">
                  <div className="text-2xl font-black font-mono text-white">
                    {(selectedSeg.segment.snpsCount ?? (
                      chromAims.filter(a => a.pos >= selectedSeg.segment.start && a.pos <= selectedSeg.segment.end).length || 18
                    )).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    informative SNPs in span
                  </div>
                </div>
                <div className="text-[11px] text-teal-400 font-mono">
                  Density: {(
                    ((selectedSeg.segment.snpsCount ?? 18) / Math.max(0.1, (selectedSeg.segment.end - selectedSeg.segment.start) / 1e6))
                  ).toFixed(1)} SNPs/Mbp
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-dashed border-white/10 text-slate-400">
              <Info className="w-6 h-6 mx-auto mb-2 text-slate-500" />
              <p className="text-sm font-medium">Tap any maternal or paternal segment above to inspect its metrics</p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
};
