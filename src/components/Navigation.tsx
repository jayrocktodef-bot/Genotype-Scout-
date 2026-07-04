import React from 'react';
import { motion } from 'motion/react';
import { LayoutGrid, Globe, HeartPulse, History, FlaskConical, Database, User, BookOpen, Sun, Moon, Download, Sparkles, Users, Zap, Trash2 } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  onUploadNew: () => void;
  hasResults: boolean;
  theme?: 'dark' | 'light';
  onThemeToggle?: () => void;
  onInstallApp?: () => void;
  isInstallable?: boolean;
  uiMode?: 'desktop' | 'classic';
  onChangeUiMode?: (mode: 'desktop' | 'classic') => void;
  onReset?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  onUploadNew,
  hasResults,
  theme = 'light',
  onThemeToggle,
  onInstallApp,
  isInstallable = false,
  uiMode = 'desktop',
  onChangeUiMode,
  onReset
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'summary', label: 'Profile', icon: User },
    { id: 'ancestry', label: 'Ancestry & Pop', icon: Globe },
    { id: 'history', label: 'Lineages & History', icon: History },
    { id: 'health_traits', label: 'Health & Traits', icon: HeartPulse },
    { id: 'ai_agent', label: 'AI Explainer', icon: Sparkles },
    { id: 'autosomal', label: 'Markers', icon: Database },
    { id: 'rare_variants', label: 'Rare Variants', icon: Zap },
    { id: 'kit_comparison', label: 'Compare Kits', icon: Users },
    { id: 'export', label: 'Export', icon: Download },
    { id: 'methodology', label: 'Methodology', icon: BookOpen }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 menubar">
      <div className="w-full px-4 h-10 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
          onTabChange('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>
          <img 
            src="https://writteninthegenome.blog/wp-content/uploads/2026/03/cropped-1000055020-e1773637919503.webp" 
            alt="Genotype Scout Logo"
            className="w-6 h-6 rounded-md shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
          />
          <div className="hidden sm:flex items-center gap-2">
            <h2 className="text-sm font-black tracking-tighter text-slate-800 dark:text-slate-100 leading-none">Genotype Scout</h2>
            <p className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
              V5.13
            </p>
          </div>
        </div>

        {/* Desktop Tabs */}
        {hasResults && uiMode === 'classic' && (
          <div className="hidden xl:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'clear_cache') {
                    if (window.confirm("This will clear all saved genomic data and force a reload. Continue?")) {
                      if (onReset) onReset();
                    }
                    return;
                  }
                  onTabChange(tab.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 border-b-2 ${
                  activeTab === tab.id 
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 transition-colors ${activeTab === tab.id ? 'text-teal-500 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {hasResults && onChangeUiMode && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-inner mr-1 select-none">
              <button
                onClick={() => onChangeUiMode('desktop')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  uiMode === 'desktop'
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Scout Desktop
              </button>
              <button
                onClick={() => onChangeUiMode('classic')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  uiMode === 'classic'
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Tab Mode
              </button>
            </div>
          )}
          {isInstallable && onInstallApp && (
            <button
              onClick={onInstallApp}
              className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/30 border border-teal-100/40 dark:border-teal-900/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              aria-label="Install App"
              title="Install application to your home screen / desktop"
            >
              <Download className="w-4 h-4 animate-bounce" />
              <span className="hidden md:inline text-[10px] font-black uppercase tracking-wider">Install App</span>
            </button>
          )}
          {onThemeToggle && (
            <button
              onClick={onThemeToggle}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          {hasResults && (
            <button 
              onClick={onUploadNew}
              className="inline-flex px-4 py-2.5 sm:px-5 sm:py-2.5 bg-teal-600 text-white rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-lg shadow-teal-100 dark:shadow-teal-900/30 hover:bg-teal-700 hover:shadow-xl transition-all cursor-pointer"
            >
              New Analysis
            </button>
          )}
        </div>
      </div>

      {/* Streaming Mobile Tabs */}
      {hasResults && uiMode === 'classic' && (
        <div className="xl:hidden border-t border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
          <div className="overflow-x-auto scrollbar-none py-3">
            <div className="flex gap-2 px-4 w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'clear_cache') {
                      if (window.confirm("This will clear all saved genomic data and force a reload. Continue?")) {
                        if (onReset) onReset();
                      }
                      return;
                    }
                    onTabChange(tab.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border-b-2 whitespace-nowrap shrink-0 ${
                    activeTab === tab.id 
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400' 
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <tab.icon className={`w-3.5 h-3.5 transition-colors ${activeTab === tab.id ? 'text-teal-500 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  {tab.label}
                </button>
              ))}

              <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 self-center mx-1 shrink-0" />

              {/* External Links */}
              <a 
                href="https://writteninthegenome.blog" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 border-b-2 border-transparent hover:border-slate-300 dark:hover:border-slate-700 whitespace-nowrap shrink-0 transition-all"
              >
                Blog
              </a>
              <a 
                href="https://www.facebook.com/share/g/1EFyWD35tB/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 border-b-2 border-transparent hover:border-slate-300 dark:hover:border-slate-700 whitespace-nowrap shrink-0 transition-all"
              >
                Facebook
              </a>
              <a 
                href="https://givebutter.com/genotypescout" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 border-b-2 border-transparent hover:border-teal-300 dark:hover:border-teal-700 whitespace-nowrap shrink-0 transition-all"
              >
                Donate
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
