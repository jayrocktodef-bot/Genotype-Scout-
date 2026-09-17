import React from 'react';
import { Sun, Moon, Download, RotateCcw } from 'lucide-react';

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
}

const Navigation: React.FC<NavigationProps> = ({
  onUploadNew,
  hasResults,
  theme = 'light',
  onThemeToggle,
  onInstallApp,
  isInstallable = false,
  onReset,
}) => (
  <nav 
    className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 backdrop-blur-xl border-b border-amber-500/20 bg-[#09090b]/95 text-zinc-100 transition-colors duration-200"
    style={{ paddingTop: 'env(safe-area-inset-top)' }}
  >
    {/* Logo */}
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center p-0.5 rounded-lg bg-gradient-to-br from-amber-300 via-amber-600 to-amber-900 shadow-sm shadow-amber-500/20">
        <img
          src="/icon-gold.svg"
          alt="Genotype Scout"
          className="w-7 h-7 rounded-[7px]"
        />
      </div>
      <div className="hidden sm:block">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-black tracking-tight leading-none text-zinc-100">Genotype Scout</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
        </div>
        <p className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 mt-0.5">
          WRITTEN IN THE GENOME
        </p>
      </div>
    </div>

    {/* Right controls */}
    <div className="flex items-center gap-2">
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
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/[0.08] hover:border-rose-500/30 text-[10px] font-black uppercase tracking-wider transition-all active:scale-[0.96]"
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
