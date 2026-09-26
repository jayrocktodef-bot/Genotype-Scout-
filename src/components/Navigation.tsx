import React from 'react';
import { Sun, Moon, Download, RotateCcw, Dna, ExternalLink, Home, Scale, Compass, GitCommit } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  onUploadNew: () => void;
  hasResults: boolean;
  theme?: 'dark' | 'light';
  onThemeToggle?: () => void;
  onInstallApp?: () => void;
  isInstallable?: boolean;
  onReset?: () => void;
  onGoHome?: () => void;
  onOpenLegal?: () => void;
  onOpenIndex?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  onUploadNew,
  hasResults,
  theme = 'light',
  onThemeToggle,
  onInstallApp,
  isInstallable = false,
  onReset,
  onGoHome,
  onOpenLegal,
  onOpenIndex,
}) => (
  <nav 
    className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 backdrop-blur-xl border-b border-amber-500/20 bg-[#09090b]/95 text-zinc-100 transition-colors duration-200"
    style={{ paddingTop: 'env(safe-area-inset-top)' }}
  >
    {/* Logo / Home link */}
    <button
      onClick={onGoHome}
      aria-label="Genotype Scout Home"
      title="Return to Dashboard / Launcher"
      className="flex items-center gap-3 text-left cursor-pointer group bg-transparent border-0 p-0 transition-opacity hover:opacity-90 active:scale-[0.98]"
    >
      <div className="relative flex items-center justify-center p-0.5 rounded-lg bg-gradient-to-br from-amber-300 via-amber-600 to-amber-900 shadow-sm shadow-amber-500/20 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.35)] transition-shadow">
        <img
          src="/icon-gold.svg"
          alt="Genotype Scout"
          className="w-7 h-7 rounded-[7px]"
        />
      </div>
      <div className="hidden sm:block">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-black tracking-tight leading-none text-zinc-100 group-hover:text-amber-200 transition-colors">Genotype Scout</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
        </div>
        <p className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 mt-0.5">
          WRITTEN IN THE GENOME
        </p>
      </div>
    </button>

    {/* Right controls */}
    <div className="flex items-center gap-2">
      {/* Home / Launcher button */}
      {hasResults && onGoHome ? (
        <button
          onClick={onGoHome}
          aria-label="Return to module launcher"
          title="Return to Module Launcher / Home"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider transition-all duration-150 active:scale-[0.96] shadow-sm cursor-pointer"
        >
          <Home className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          <span>Home</span>
        </button>
      ) : null}

      {/* Module Index / Quick Jump (Cmd+K) */}
      {onOpenIndex && (
        <button
          onClick={onOpenIndex}
          aria-label="Open Module Index and Command Palette (Ctrl+K or Cmd+K)"
          title="Module & Feature Index (Ctrl+K / ⌘K)"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider transition-all duration-150 active:scale-[0.96] shadow-sm cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          <span>Index</span>
          <kbd className="hidden sm:inline-block ml-0.5 px-1 py-0.5 bg-black/40 text-zinc-400 border border-amber-500/20 rounded text-[9px] font-mono leading-none">⌘K</kbd>
        </button>
      )}

      {/* Superkit Maker Link Icon */}
      <a
        href="https://merge.writteninthegenome.blog"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Superkit Maker (Merge Kits)"
        title="Superkit Maker: Merge multiple raw DNA kits (merge.writteninthegenome.blog)"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-teal-500/15 to-amber-500/15 hover:from-teal-500/25 hover:to-amber-500/25 text-teal-300 hover:text-teal-200 border border-teal-500/30 hover:border-teal-400/50 text-[10px] font-black uppercase tracking-wider transition-all duration-150 active:scale-[0.96] shadow-sm hover:shadow-[0_0_12px_rgba(20,184,166,0.25)]"
      >
        <Dna className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
        <span className="hidden sm:inline">Superkit Maker</span>
        <ExternalLink className="w-2.5 h-2.5 text-teal-400/80" aria-hidden="true" />
      </a>

      {/* Chromosome Phaser Link Icon */}
      <a
        href="https://phaser.writteninthegenome.blog"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chromosome Phaser (DNA Phasing Studio)"
        title="Chromosome Phaser: Phase maternal/paternal haplotypes & detect crossovers (phaser.writteninthegenome.blog)"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500/15 to-purple-500/15 hover:from-sky-500/25 hover:to-purple-500/25 text-sky-300 hover:text-sky-200 border border-sky-500/30 hover:border-sky-400/50 text-[10px] font-black uppercase tracking-wider transition-all duration-150 active:scale-[0.96] shadow-sm hover:shadow-[0_0_12px_rgba(56,189,248,0.25)]"
      >
        <GitCommit className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
        <span className="hidden md:inline">Phaser Studio</span>
        <ExternalLink className="w-2.5 h-2.5 text-sky-400/80" aria-hidden="true" />
      </a>

      {/* Legal & Microarray Terms Modal Trigger */}
      {onOpenLegal && (
        <button
          onClick={onOpenLegal}
          aria-label="View legal terms and disclaimers"
          title="View Legal Terms, Microarray Error Warnings & Disclaimers"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider transition-all duration-150 active:scale-[0.96] shadow-sm cursor-pointer"
        >
          <Scale className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          <span className="hidden md:inline">Legal Terms</span>
        </button>
      )}

      {isInstallable && onInstallApp ? (
        <button
          onClick={onInstallApp}
          aria-label="Install application"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider transition-[background-color] duration-150 active:scale-[0.96]"
          style={{ transitionProperty: 'background-color, transform' }}
        >
          <Download className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          <span className="hidden md:inline">Install App</span>
        </button>
      ) : null}

      {onThemeToggle ? (
        <button
          onClick={onThemeToggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05] transition-[color,background-color] duration-150 active:scale-[0.96]"
          style={{ transitionProperty: 'color, background-color, transform' }}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" /> : <Moon className="w-4 h-4 text-amber-400" aria-hidden="true" />}
        </button>
      ) : null}

      {onReset ? (
        <button
          onClick={onReset}
          aria-label="Force reset and clear cache"
          title="Force reset application and clear all caches"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-200/70 hover:text-rose-200 hover:bg-rose-500/10 border border-white/[0.08] hover:border-rose-500/30 text-[10px] font-black uppercase tracking-wider transition-all active:scale-[0.96]"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Clear Cache</span>
        </button>
      ) : null}

      {hasResults ? (
        <button
          onClick={onUploadNew}
          className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black rounded-full text-[10px] uppercase tracking-widest shadow-md shadow-amber-950/40 transition-[background-color] duration-150 active:scale-[0.96]"
          style={{ transitionProperty: 'background-color, transform' }}
        >
          New Analysis
        </button>
      ) : null}
    </div>
  </nav>
);

export default Navigation;
