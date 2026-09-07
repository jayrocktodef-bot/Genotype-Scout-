import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, ShieldCheck, Sparkles, Terminal, Activity, Compass } from 'lucide-react';
import { retroAudio } from '../utils/retroAudio';

interface GenotypeParserProps {
  streamProgress: {
    step: string;
    processed: number;
    total: number;
    snps: number;
    percent?: number;
  };
}

type StageType = 'init' | 'scan' | 'scry' | 'victory';

interface StageMeta {
  id: StageType;
  title: string;
  stageNum: string;
  sprite: string;
  lore: string;
  color: string;
  badge: string;
}

const STAGES: Record<StageType, StageMeta> = {
  init: {
    id: 'init',
    title: 'MOUNTING GENOME ARRAY',
    stageNum: '1/4',
    sprite: '/assets/sprites/scout_boy/idle.png',
    lore: 'Scout Boy prepares his tools and mounts raw genomic bytes into memory.',
    color: 'from-amber-400 to-yellow-500',
    badge: 'INITIALIZING'
  },
  scan: {
    id: 'scan',
    title: 'TRAVERSING CHROMOSOMES',
    stageNum: '2/4',
    sprite: '/assets/sprites/scout_boy/scan.png',
    lore: 'Scout Boy strides across 23 chromosomes, scanning SNP loci and coordinates.',
    color: 'from-teal-400 to-emerald-500',
    badge: 'SCANNING'
  },
  scry: {
    id: 'scry',
    title: 'SCRYING ANCIENT & GLOBAL AIMS',
    stageNum: '3/4',
    sprite: '/assets/sprites/scout_boy/scry.png',
    lore: 'The glowing DNA crystal orb illuminates ancestral markers and population affinities.',
    color: 'from-indigo-400 to-purple-500',
    badge: 'SCRYING'
  },
  victory: {
    id: 'victory',
    title: 'EXPEDITION COMPLETE',
    stageNum: '4/4',
    sprite: '/assets/sprites/scout_boy/victory.png',
    lore: 'Level up! All genetic variants cataloged in sandboxed browser memory.',
    color: 'from-emerald-400 to-teal-400',
    badge: 'RESOLVED'
  }
};

export const GenotypeParser: React.FC<GenotypeParserProps> = ({ streamProgress }) => {
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const lastMilestoneRef = useRef<number>(0);

  const percent = streamProgress.percent !== undefined 
    ? streamProgress.percent 
    : (streamProgress.total > 0 
        ? Math.min(100, Math.round((streamProgress.processed / streamProgress.total) * 100)) 
        : 0);

  // Determine current active expedition stage based on percentage & step name
  let currentStageKey: StageType = 'init';
  if (percent >= 88 || streamProgress.step.toLowerCase().includes('final') || streamProgress.step.toLowerCase().includes('complet')) {
    currentStageKey = 'victory';
  } else if (percent >= 50 || streamProgress.step.toLowerCase().includes('ancient') || streamProgress.step.toLowerCase().includes('oracle')) {
    currentStageKey = 'scry';
  } else if (percent >= 20 || streamProgress.step.toLowerCase().includes('reading') || streamProgress.step.toLowerCase().includes('pars') || streamProgress.step.toLowerCase().includes('snps')) {
    currentStageKey = 'scan';
  }
  const currentStage = STAGES[currentStageKey];

  // Keep a running log of steps and play sound on milestone progress
  useEffect(() => {
    if (streamProgress.step) {
      setConsoleLogs(prev => {
        const next = [...prev, `[${new Date().toLocaleTimeString()}] ${streamProgress.step}`];
        return next.slice(-6);
      });

      // Audio cues for retro delight
      if (percent >= 100 && lastMilestoneRef.current < 100) {
        lastMilestoneRef.current = 100;
        retroAudio.playFanfare();
      } else if (percent >= 75 && lastMilestoneRef.current < 75) {
        lastMilestoneRef.current = 75;
        retroAudio.playBlip(784, 0.05);
      } else if (percent >= 50 && lastMilestoneRef.current < 50) {
        lastMilestoneRef.current = 50;
        retroAudio.playBlip(659, 0.05);
      } else if (percent >= 25 && lastMilestoneRef.current < 25) {
        lastMilestoneRef.current = 25;
        retroAudio.playBlip(523, 0.05);
      } else {
        retroAudio.playBlip(440, 0.02, 0.015);
      }
    }
  }, [streamProgress.step, percent]);

  const handleToggleMute = () => {
    const muted = retroAudio.toggleMute();
    setIsMuted(muted);
  };

  // 20-segment retro HP/EXP bar calculation
  const totalBlocks = 20;
  const filledBlocks = Math.min(totalBlocks, Math.round((percent / 100) * totalBlocks));

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-4 px-4 text-center max-w-2xl mx-auto relative select-none">
      {/* Retro 8-bit Nintendo Cartridge Frame */}
      <div className="w-full bg-slate-900/95 dark:bg-[#0c101d]/95 backdrop-blur-xl border-4 border-slate-700 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl shadow-indigo-950/40 relative overflow-hidden text-left">
        
        {/* Subtle Scanlines CRT Layer */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.06] z-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)'
          }}
        />

        {/* Top Retro HUD Navigation Bar */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-slate-700/80 dark:border-slate-800 pb-2.5 mb-4 font-mono text-xs z-20 relative">
          <div className="flex items-center gap-2 text-amber-400 dark:text-amber-300 font-bold tracking-wider uppercase">
            <Compass size={15} className="animate-spin-slow text-amber-400" />
            <span>GENOTYPE SCOUT // EXPEDITION</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase bg-purple-950/70 border border-purple-600/50 text-purple-300 rounded">
              STAGE {currentStage.stageNum}
            </span>

            <button
              onClick={handleToggleMute}
              className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-slate-300 rounded border border-slate-600/60 transition-colors flex items-center gap-1.5 text-[11px] font-mono cursor-pointer"
              title={isMuted ? "Unmute 8-Bit Audio" : "Mute 8-Bit Audio"}
            >
              {isMuted ? (
                <>
                  <VolumeX size={13} className="text-rose-400" />
                  <span className="text-slate-400">MUTED</span>
                </>
              ) : (
                <>
                  <Volume2 size={13} className="text-teal-400" />
                  <span className="text-teal-300">8-BIT SFX</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Center Stage: Scout Boy 8-Bit Expedition */}
        <div className="relative flex flex-col items-center justify-center my-1 py-1 z-20">
          
          {/* Retro Pixel Tile Stage Background */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
            {/* Ambient Celestial Glow */}
            <div className="absolute inset-2 rounded-full bg-purple-600/20 dark:bg-purple-600/25 blur-xl pointer-events-none" />
            
            {/* Pixelated Pedestal Base */}
            <div className="absolute bottom-1 w-28 h-5 bg-slate-800/90 dark:bg-slate-900/90 border-2 border-slate-600/70 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-16 h-1 bg-gradient-to-r from-teal-500 via-indigo-400 to-amber-400 rounded-full opacity-70 animate-pulse" />
            </div>

            {/* Stepped Bobbing 8-Bit Sprite */}
            <motion.div
              key={currentStage.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: [0, -5, 0]
              }}
              transition={{
                y: {
                  repeat: Infinity,
                  duration: currentStage.id === 'victory' ? 0.7 : 1.2,
                  ease: "easeInOut"
                },
                scale: { duration: 0.25 }
              }}
              className="relative z-10"
            >
              <img
                src={currentStage.sprite}
                alt="Scout Boy"
                className="w-28 h-auto sm:w-36 object-contain select-none drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]"
                style={{ imageRendering: 'pixelated' }}
                loading="eager"
              />
            </motion.div>

            {/* Ambient 8-Bit Sparkles */}
            <div className="absolute top-2 right-2 pointer-events-none text-amber-300 animate-pulse">
              <Sparkles size={14} />
            </div>
            <div className="absolute top-6 left-4 pointer-events-none text-teal-400 animate-pulse-soft">
              <Sparkles size={13} />
            </div>
          </div>

          {/* Retro Speech Dialogue Banner */}
          <div className="mt-2 px-3.5 py-2 bg-slate-950/80 dark:bg-black/80 border-2 border-slate-700/80 dark:border-slate-800 rounded-xl max-w-md w-full text-center shadow-md">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-0.5 font-mono">
              [ {currentStage.badge} // {currentStage.title} ]
            </span>
            <p className="text-xs sm:text-sm font-medium text-slate-300 dark:text-slate-200 font-mono">
              "{currentStage.lore}"
            </p>
          </div>
        </div>

        {/* 8-Bit Segmented Progress Bar (Nintendo HP/EXP Bar Style) */}
        <div className="mb-4 z-20 relative">
          <div className="flex items-center justify-between mb-1.5 text-xs font-mono font-bold tracking-wider">
            <span className="text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
              <Activity size={12} className="text-teal-400 animate-pulse" />
              EXP PROGRESS
            </span>
            <span className="text-teal-400 dark:text-teal-300 font-mono font-black text-sm">
              [{percent}%]
            </span>
          </div>

          {/* Segmented Pixel Blocks */}
          <div className="grid grid-cols-20 gap-1 p-1 bg-slate-950 dark:bg-black border-2 border-slate-700/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-inner">
            {Array.from({ length: totalBlocks }).map((_, i) => {
              const isFilled = i < filledBlocks;
              const isLead = i === filledBlocks - 1;
              return (
                <div
                  key={i}
                  className={`h-3.5 rounded-sm transition-all duration-200 ${
                    isFilled 
                      ? isLead 
                        ? 'bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.8)]' 
                        : 'bg-gradient-to-t from-teal-500 to-emerald-400' 
                      : 'bg-slate-800/40 dark:bg-slate-900/60'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* RPG Quest Statistics Grid */}
        <div className="grid grid-cols-3 gap-2.5 w-full mb-4 text-center font-mono z-20 relative">
          {/* Processed Bytes */}
          <div className="p-2.5 bg-slate-950/70 dark:bg-black/70 border-2 border-slate-800 rounded-xl">
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5 text-[9px] uppercase font-bold tracking-wider">
              PROCESSED
            </span>
            <span className="text-slate-200 dark:text-slate-100 font-bold text-sm">
              {(streamProgress.processed / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>

          {/* Total File Size */}
          <div className="p-2.5 bg-slate-950/70 dark:bg-black/70 border-2 border-slate-800 rounded-xl">
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5 text-[9px] uppercase font-bold tracking-wider">
              FILE SIZE
            </span>
            <span className="text-slate-200 dark:text-slate-100 font-bold text-sm">
              {(streamProgress.total / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>

          {/* Matched Loci */}
          <div className="p-2.5 bg-slate-950/70 dark:bg-black/70 border-2 border-slate-800 rounded-xl">
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5 text-[9px] uppercase font-bold tracking-wider">
              MATCHED LOCI
            </span>
            <span className="text-amber-400 dark:text-amber-300 font-bold text-sm">
              {streamProgress.snps.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Retro Adventure Log / Terminal Window */}
        <div className="w-full bg-black/90 rounded-xl p-3.5 border-2 border-slate-800 font-mono text-left shadow-inner mb-3.5 overflow-hidden h-[135px] flex flex-col justify-end z-20 relative">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-800/80 pb-1 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-teal-400">
              <Terminal size={12} /> ADVENTURE LOG // CHIP SEQUENCER
            </span>
            <span className="text-emerald-400 font-bold">ONLINE ●</span>
          </div>

          <div className="space-y-1 text-xs text-slate-400">
            <AnimatePresence initial={false}>
              {consoleLogs.map((log, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`truncate flex items-center gap-1.5 ${
                    idx === consoleLogs.length - 1 ? 'text-teal-300 font-bold' : ''
                  }`}
                >
                  <span className="text-amber-400 font-black">&gt;</span>
                  <span>{log}</span>
                  {idx === consoleLogs.length - 1 && (
                    <span className="inline-block w-2 h-3.5 bg-teal-400 animate-pulse align-middle" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Retro Sandbox Privacy Seal */}
        <div className="flex items-center justify-center gap-2 text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 pt-1.5 border-t border-slate-800/60 z-20 relative">
          <ShieldCheck size={13} className="text-teal-400" />
          <span>100% Client-Side Sandbox</span>
          <span className="text-slate-600">|</span>
          <span>Zero Network Data Exports</span>
        </div>

      </div>
    </div>
  );
};
