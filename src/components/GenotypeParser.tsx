import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dna, ShieldAlert, Cpu, Database, Activity } from 'lucide-react';

interface GenotypeParserProps {
  streamProgress: {
    step: string;
    processed: number;
    total: number;
    snps: number;
  };
}

export const GenotypeParser: React.FC<GenotypeParserProps> = ({ streamProgress }) => {
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  
  // Keep a running log of steps
  useEffect(() => {
    if (streamProgress.step) {
      setConsoleLogs(prev => {
        const next = [...prev, `[${new Date().toLocaleTimeString()}] ${streamProgress.step}`];
        // Keep last 6 logs
        return next.slice(-6);
      });
    }
  }, [streamProgress.step]);

  const percent = streamProgress.total > 0 
    ? Math.min(100, Math.round((streamProgress.processed / streamProgress.total) * 100)) 
    : 0;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-up max-w-2xl mx-auto relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Futuristic DNA Sequencer Ring */}
      <div className="relative w-32 h-32 mb-10">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-teal-500/30 dark:border-teal-500/20 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          className="absolute inset-2 border border-dashed border-indigo-500/40 dark:border-indigo-500/30 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-20 h-20 bg-gradient-to-tr from-teal-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-lg shadow-teal-500/20 text-white"
          >
            <Dna className="w-10 h-10 animate-pulse-soft" />
          </motion.div>
        </div>
        
        {/* Orbiting nucleotide particles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-teal-400 rounded-full shadow-md shadow-teal-400/50" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-indigo-400 rounded-full shadow-md shadow-indigo-400/50" />
        </motion.div>
      </div>

      <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2 tracking-tight">
        Sequencing Genotype Data
      </h2>
      
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-8 max-w-md">
        Parsing dataset, verifying coordinates, and mapping genetic variants in client sandboxed memory.
      </p>

      {/* Progress Metrics Panel */}
      <div className="w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-3 text-xs font-black uppercase tracking-wider text-slate-500">
          <span>Analysis Progress</span>
          <span className="text-teal-600 dark:text-teal-450 font-mono">{percent}%</span>
        </div>

        {/* Beautiful Glowing Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-4 overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-800">
          <motion.div 
            className="bg-gradient-to-r from-teal-500 to-indigo-500 h-full rounded-full relative overflow-hidden"
            style={{ width: `${percent}%` }}
            layout
          >
            {/* Glossy shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent w-1/2 animate-shimmer" style={{ animationDuration: '1.5s', animationIterationCount: 'infinite' }} />
          </motion.div>
        </div>
      </div>

      {/* Grid of live statistics */}
      <div className="grid grid-cols-3 gap-4 w-full mb-6 text-center">
        {/* Size counter */}
        <div className="p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-105/50 dark:border-slate-800/50 rounded-2xl">
          <span className="text-slate-400 dark:text-slate-500 block mb-1 text-[10px] uppercase font-black tracking-wider">Processed</span>
          <span className="text-slate-800 dark:text-slate-200 font-extrabold font-mono text-base">
            {(streamProgress.processed / (1024 * 1024)).toFixed(2)} MB
          </span>
        </div>
        {/* Total size */}
        <div className="p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-105/50 dark:border-slate-800/50 rounded-2xl">
          <span className="text-slate-400 dark:text-slate-500 block mb-1 text-[10px] uppercase font-black tracking-wider">File Size</span>
          <span className="text-slate-800 dark:text-slate-200 font-extrabold font-mono text-base">
            {(streamProgress.total / (1024 * 1024)).toFixed(2)} MB
          </span>
        </div>
        {/* Matches */}
        <div className="p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-105/50 dark:border-slate-800/50 rounded-2xl">
          <span className="text-slate-400 dark:text-slate-500 block mb-1 text-[10px] uppercase font-black tracking-wider">Matched Loci</span>
          <span className="text-teal-600 dark:text-teal-400 font-extrabold font-mono text-base font-black">
            {streamProgress.snps.toLocaleString()}
          </span>
        </div>
      </div>

      {/* DNA Live Sequencer Output Logs */}
      <div className="w-full bg-slate-950 dark:bg-black rounded-2xl p-5 border border-slate-900 font-mono text-left shadow-inner mb-8 overflow-hidden h-[180px] flex flex-col justify-end">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-2 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5"><Activity size={10} className="text-teal-400 animate-pulse" /> Sequencer Console</span>
          <span className="text-teal-400 font-bold">Online</span>
        </div>
        <div className="space-y-1.5 text-xs text-slate-400">
          <AnimatePresence initial={false}>
            {consoleLogs.map((log, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`truncate ${idx === consoleLogs.length - 1 ? 'text-teal-400 font-bold' : ''}`}
              >
                &gt; {log}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Privacy footer badge */}
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500">
        <Cpu size={12} className="text-teal-500" />
        <span>Hardware sandbox mode active</span>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <Database size={12} className="text-indigo-500" />
        <span>No network data exports</span>
      </div>
    </div>
  );
};
