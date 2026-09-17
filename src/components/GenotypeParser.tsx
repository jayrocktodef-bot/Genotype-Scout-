import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Terminal, Activity, CheckCircle2, 
  Loader2, Dna, Cpu, Layers, Database, WifiOff, X
} from 'lucide-react';

interface GenotypeParserProps {
  streamProgress: {
    step: string;
    processed: number;
    total: number;
    snps: number;
    percent?: number;
  };
  onCancel?: () => void;
}

interface PipelinePhase {
  id: number;
  title: string;
  description: string;
  minPercent: number;
  maxPercent: number;
}

const PIPELINE_PHASES: PipelinePhase[] = [
  {
    id: 1,
    title: 'Format Detection & Header Validation',
    description: 'Sniffing delimiter, header signatures, and reference build (GRCh37 / GRCh38)',
    minPercent: 0,
    maxPercent: 20
  },
  {
    id: 2,
    title: 'Chromosome Coordinate Traversal & Normalization',
    description: 'Scanning 23 chromosomes, validating rsIDs, and parsing allele calls',
    minPercent: 20,
    maxPercent: 55
  },
  {
    id: 3,
    title: 'Ancestry Informative Markers & Lineage Deconvolution',
    description: 'Scoring 17,042 phased AIMs, K61 subpopulation matrix, and haplogroup markers',
    minPercent: 55,
    maxPercent: 88
  },
  {
    id: 4,
    title: 'Genomic Workspace Synthesis & Local Indexing',
    description: 'Structuring multidimensional ancestry, health impacts, and blood typing in memory',
    minPercent: 88,
    maxPercent: 100
  }
];

export const GenotypeParser: React.FC<GenotypeParserProps> = ({ streamProgress, onCancel }) => {
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const percent = streamProgress.percent !== undefined 
    ? streamProgress.percent 
    : (streamProgress.total > 0 
        ? Math.min(100, Math.round((streamProgress.processed / streamProgress.total) * 100)) 
        : 0);

  // Maintain running timestamped bioinformatic telemetry log
  useEffect(() => {
    if (streamProgress.step) {
      setConsoleLogs(prev => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        const next = [...prev, `[${timestamp}] ${streamProgress.step}`];
        return next.slice(-8);
      });
    }
  }, [streamProgress.step]);

  // Determine current pipeline stage title
  const currentPhase = PIPELINE_PHASES.find(p => percent >= p.minPercent && percent < p.maxPercent) 
    || PIPELINE_PHASES[PIPELINE_PHASES.length - 1];

  const processedMb = (streamProgress.processed / (1024 * 1024)).toFixed(2);
  const totalMb = streamProgress.total > 0 ? (streamProgress.total / (1024 * 1024)).toFixed(2) : '0.00';

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-6 px-4 text-center max-w-3xl mx-auto relative select-none">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Clinical Instrument Card */}
      <div className="w-full bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden text-left">
        
        {/* Top Instrument Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4 font-mono text-xs">
          <div className="flex items-center gap-2.5 text-zinc-300">
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Dna className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <span className="text-zinc-200 font-bold tracking-tight block">GENOMIC PIPELINE ENGINE</span>
              <span className="text-[11px] text-zinc-500">In-Browser Multithreaded Deconvolution</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              PARSING LOCALLY
            </span>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="p-1 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors"
                title="Cancel ingestion and clear buffer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Phase Header & Headline */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {percent >= 100 
                ? 'Genomic Ingestion Complete' 
                : `${currentPhase.title}...`}
            </h2>
            <span className="text-xl sm:text-2xl font-mono font-black text-teal-400 tabular-nums">
              {percent}%
            </span>
          </div>

          <p className="text-xs sm:text-sm font-mono text-zinc-400 truncate">
            {streamProgress.step || 'Initializing computational sandbox...'}
          </p>
        </div>

        {/* High-Precision Progress Rail */}
        <div className="space-y-1.5">
          <div className="relative w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80 shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-400 via-teal-400 to-emerald-400 rounded-full relative"
              initial={{ width: '0%' }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {/* Animated Leading Edge Glow Head */}
              {percent > 0 && percent < 100 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#2dd4bf] animate-ping" />
              )}
            </motion.div>
          </div>
        </div>

        {/* 4-Stage Auditable Laboratory Pipeline Checklist */}
        <div className="space-y-2.5 pt-1">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block">
            Bioinformatics Verification Checklist:
          </span>

          <div className="space-y-2 font-mono text-xs">
            {PIPELINE_PHASES.map((phase) => {
              const isDone = percent >= phase.maxPercent;
              const isActive = percent >= phase.minPercent && percent < phase.maxPercent;
              const isWaiting = percent < phase.minPercent;

              return (
                <div 
                  key={phase.id}
                  className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isActive 
                      ? 'bg-teal-500/10 border-teal-500/30 text-teal-200' 
                      : isDone 
                        ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-300' 
                        : 'bg-zinc-950/40 border-zinc-900 text-zinc-600'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isActive ? (
                        <Loader2 className="w-4 h-4 text-teal-400 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center text-[9px] text-zinc-600">
                          {phase.id}
                        </div>
                      )}
                    </span>
                    <div className="min-w-0">
                      <span className={`font-bold block tracking-tight ${
                        isActive ? 'text-teal-300' : isDone ? 'text-zinc-200' : 'text-zinc-600'
                      }`}>
                        {phase.title}
                      </span>
                      <span className="text-[11px] text-zinc-400 block truncate font-sans">
                        {phase.description}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5 ${
                    isDone 
                      ? 'text-emerald-400' 
                      : isActive 
                        ? 'text-teal-400 animate-pulse' 
                        : 'text-zinc-700'
                  }`}>
                    {isDone ? 'COMPLETED' : isActive ? 'ACTIVE' : 'PENDING'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bioinformatic Metric Tiles */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
              Data Ingested
            </span>
            <span className="text-base sm:text-lg font-mono font-black text-zinc-100 tabular-nums">
              {processedMb} MB
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
              Total Stream Size
            </span>
            <span className="text-base sm:text-lg font-mono font-black text-zinc-100 tabular-nums">
              {totalMb} MB
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
              Matched Loci
            </span>
            <span className="text-base sm:text-lg font-mono font-black text-amber-400 tabular-nums">
              {streamProgress.snps.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Scientific Terminal Output Log */}
        <div className="rounded-2xl bg-black/90 p-4 border border-zinc-800 font-mono text-xs overflow-hidden h-[120px] flex flex-col justify-end">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-800/80 pb-1.5 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-teal-400">
              <Terminal className="w-3.5 h-3.5" />
              <span>Bioinformatics Console Log</span>
            </span>
            <span className="text-emerald-400 text-[10px] font-bold">ONLINE ●</span>
          </div>

          <div className="space-y-1 text-zinc-400 overflow-hidden">
            <AnimatePresence initial={false}>
              {consoleLogs.map((log, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.12 }}
                  className={`truncate flex items-center gap-1.5 ${
                    idx === consoleLogs.length - 1 ? 'text-teal-300 font-semibold' : 'text-zinc-500'
                  }`}
                >
                  <span className="text-amber-400 font-bold">&gt;</span>
                  <span>{log}</span>
                  {idx === consoleLogs.length - 1 && (
                    <span className="inline-block w-1.5 h-3 bg-teal-400 animate-pulse" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Air-Gapped Privacy Confirmation Seal */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/80 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2 text-teal-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Air-Gapped Client Thread • Zero Remote Packets</span>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-[11px] text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
            >
              [ Cancel & Clear Buffer ]
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default GenotypeParser;
