import React from 'react';
import { Sun, Moon, Download } from 'lucide-react';

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
}) => (
  <nav className="fixed top-0 left-0 right-0 z-50 h-10 flex items-center justify-between px-4 bg-[#030712]/90 backdrop-blur-xl border-b border-white/[0.06]" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
    {/* Logo */}
    <div className="flex items-center gap-2.5">
      <img
        src="https://writteninthegenome.blog/wp-content/uploads/2026/03/cropped-1000055020-e1773637919503.webp"
        alt="Genotype Scout"
        className="w-5 h-5 rounded-md ring-1 ring-white/10"
      />
      <div className="hidden sm:block">
        <span className="text-sm font-black tracking-tight text-white leading-none">Genotype Scout</span>
      </div>
    </div>

    {/* Right controls */}
    <div className="flex items-center gap-2">
      {isInstallable && onInstallApp ? (
        <button
          onClick={onInstallApp}
          aria-label="Install application"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 border border-teal-500/20 text-[10px] font-black uppercase tracking-wider transition-[background-color] duration-150 active:scale-[0.96]"
          style={{ transitionProperty: 'background-color, transform' }}
        >
          <Download className="w-3 h-3" aria-hidden="true" />
          <span className="hidden md:inline">Install</span>
        </button>
      ) : null}

      {onThemeToggle ? (
        <button
          onClick={onThemeToggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-[color,background-color] duration-150 active:scale-[0.96]"
          style={{ transitionProperty: 'color, background-color, transform' }}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
        </button>
      ) : null}

      {hasResults ? (
        <button
          onClick={onUploadNew}
          className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-[background-color] duration-150 active:scale-[0.96]"
          style={{ transitionProperty: 'background-color, transform' }}
        >
          New Analysis
        </button>
      ) : null}
    </div>
  </nav>
);

export default Navigation;
