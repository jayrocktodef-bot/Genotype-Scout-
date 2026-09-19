import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Globe, History, HeartPulse, Database, BookOpen,
  Zap, Droplet, Dna, Sparkles, Trash2, Users,
  ChevronLeft, ChevronRight, WifiOff, Home, MoreHorizontal,
  Play, ArrowLeft, Search, X, ShieldCheck
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppConfig {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  gradient: string;
  glowColor: string;
  targetTab: 'dashboard' | 'summary' | 'autosomal' | 'ancestry' | 'history' | 'health_traits' | 'markers' | 'rare_variants' | 'debug' | 'methodology' | 'kit_comparison' | 'clear_cache' | 'integrity';
  targetSubTab?: string;
  description: string;
  imageUrl?: string;
  navGroup?: 'primary' | 'secondary';
}

interface ScoutWorkspaceProps {
  oracleResults: any;
  populationProximity: any[];
  dataset: any;
  userSnps: Record<string, string>;
  onNavigateToTab: (tab: any, subTab?: string) => void;
  onReset: () => void;
  currentApp: string | null;
  onOpenApp: (appId: string | null) => void;
  datasets: any[];
  activeDatasetIndex: number;
  setActiveDatasetIndex: (i: number) => void;
  onOpenMethodology?: (moduleId?: string) => void;
  children?: React.ReactNode;
}

// ─── Module Definitions (module scope — never inside component) ───────────────

const MODULES: AppConfig[] = [
  {
    id: 'profile',
    name: 'Scout Profile',
    icon: User,
    gradient: 'from-amber-400 to-orange-600',
    glowColor: 'rgba(245,158,11,0.45)',
    targetTab: 'summary',
    description: 'Comprehensive overview of your genetic origins and breakdown.',
    imageUrl: '/assets/profile_icon.png',
    navGroup: 'primary',
  },
  {
    id: 'ancestry_oracle',
    name: 'Ancestry Oracle',
    icon: Globe,
    gradient: 'from-teal-400 to-emerald-600',
    glowColor: 'rgba(20,184,166,0.45)',
    targetTab: 'ancestry',
    targetSubTab: 'oracle',
    description: 'Run deep subpopulation queries and NNLS admixture optimization.',
    imageUrl: '/assets/oracle_icon.png',
    navGroup: 'primary',
  },
  {
    id: 'glossary',
    name: 'Population Glossary',
    icon: BookOpen,
    gradient: 'from-[#4ECDC4] to-teal-700',
    glowColor: 'rgba(78,205,196,0.45)',
    targetTab: 'ancestry',
    description: 'Explore origin geographies, migration routes, and evolutionary traits for global populations.',
    imageUrl: '/assets/glossary_icon.png',
    navGroup: 'primary',
  },
  {
    id: 'chromosome_painter',
    name: 'Chromosome Painter',
    icon: Dna,
    gradient: 'from-sky-400 to-indigo-500',
    glowColor: 'rgba(56,189,248,0.45)',
    targetTab: 'ancestry',
    targetSubTab: 'painter',
    description: 'Segment-by-segment ancestral origin mapping of your 22 autosomes.',
    imageUrl: '/assets/painter_icon.png',
    navGroup: 'primary',
  },
  {
    id: 'ancestry_scout',
    name: 'Scout Score',
    icon: Zap,
    gradient: 'from-yellow-400 to-amber-500',
    glowColor: 'rgba(234,179,8,0.45)',
    targetTab: 'ancestry',
    targetSubTab: 'scout',
    description: 'Analyze global admixture using ancestral score matrices.',
    imageUrl: '/assets/score_icon.png',
    navGroup: 'secondary',
  },
  {
    id: 'haplogroups',
    name: 'Haplotypes',
    icon: Play,
    gradient: 'from-blue-500 to-indigo-600',
    glowColor: 'rgba(59,130,246,0.45)',
    targetTab: 'history',
    targetSubTab: 'modern',
    description: 'Discover your paternal and maternal terminal haplogroups.',
    imageUrl: '/assets/haplogroups_icon.png',
    navGroup: 'primary',
  },
  {
    id: 'ancient_dna',
    name: 'Ancient Matches',
    icon: History,
    gradient: 'from-rose-500 to-pink-600',
    glowColor: 'rgba(244,63,94,0.45)',
    targetTab: 'history',
    targetSubTab: 'ancient',
    description: 'Compare your DNA to historical and ancient tribes matches.',
    imageUrl: '/assets/ancient_icon.png',
    navGroup: 'primary',
  },
  {
    id: 'health',
    name: 'Health',
    icon: HeartPulse,
    gradient: 'from-emerald-400 to-teal-600',
    glowColor: 'rgba(16,185,129,0.45)',
    targetTab: 'health_traits',
    targetSubTab: 'wellness',
    description: 'Explore drug response metabolism (PGx) and polygenic risk reports.',
    imageUrl: '/assets/health_icon.png',
    navGroup: 'primary',
  },
  {
    id: 'traits',
    name: 'Traits',
    icon: Sparkles,
    gradient: 'from-pink-400 to-rose-500',
    glowColor: 'rgba(244,63,94,0.45)',
    targetTab: 'health_traits',
    targetSubTab: 'traits',
    description: 'Explore physical appearance, lifestyle, and nutrition traits.',
    imageUrl: '/assets/traits_icon.png',
    navGroup: 'secondary',
  },
  {
    id: 'blood',
    name: 'Blood Predictor',
    icon: Droplet,
    gradient: 'from-red-500 to-rose-600',
    glowColor: 'rgba(239,68,68,0.45)',
    targetTab: 'health_traits',
    targetSubTab: 'blood',
    description: 'Predict ABO and Rhesus Factor blood groups from genetic data.',
    imageUrl: '/assets/blood_icon.png',
    navGroup: 'secondary',
  },

  {
    id: 'markers',
    name: 'Genomic Markers',
    icon: Database,
    gradient: 'from-cyan-400 to-blue-600',
    glowColor: 'rgba(6,182,212,0.45)',
    targetTab: 'autosomal',
    description: 'Search, filter, and inspect your parsed autosomal variants.',
    imageUrl: '/assets/markers_icon.png',
    navGroup: 'secondary',
  },
  {
    id: 'rare_variants',
    name: 'Rare Variants',
    icon: Zap,
    gradient: 'from-fuchsia-400 to-purple-600',
    glowColor: 'rgba(192,38,211,0.45)',
    targetTab: 'rare_variants',
    description: 'Identify unmapped and potentially rare genetic variants.',
    imageUrl: '/assets/rare_variants_icon.png',
    navGroup: 'secondary',
  },
  {
    id: 'kit_comparison',
    name: 'Kit Comparison',
    icon: Users,
    gradient: 'from-blue-400 to-indigo-600',
    glowColor: 'rgba(99,102,241,0.45)',
    targetTab: 'kit_comparison',
    description: 'Side-by-side comparison of multiple kits, traits, and ancestry.',
    imageUrl: '/assets/kit_comparison_icon.png',
    navGroup: 'secondary',
  },
  {
    id: 'integrity',
    name: 'File & QC Integrity',
    icon: ShieldCheck,
    gradient: 'from-amber-500 to-amber-700',
    glowColor: 'rgba(245,158,11,0.45)',
    targetTab: 'integrity',
    description: 'Diagnostic audit of genotyping call rate, marker coverage, and file integrity.',
    imageUrl: '/assets/markers_icon.png',
    navGroup: 'secondary',
  },
  {
    id: 'methodology',
    name: 'Methodology',
    icon: BookOpen,
    gradient: 'from-violet-500 to-purple-600',
    glowColor: 'rgba(139,92,246,0.45)',
    targetTab: 'methodology',
    description: 'Learn the underlying math, science, and calculation engines.',
    imageUrl: '/assets/methodology_icon.png',
    navGroup: 'secondary',
  },
];

const PRIMARY_NAV = MODULES.filter(m => m.navGroup === 'primary');
const BOTTOM_NAV_MODULES = [
  MODULES.find(m => m.id === 'ancestry_oracle')!,
  MODULES.find(m => m.id === 'chromosome_painter')!,
  MODULES.find(m => m.id === 'haplogroups')!,
  MODULES.find(m => m.id === 'health')!,
];

// ─── GoldIcon (Tactile 3D Gold-Trimmed Icon Component) ─────────────────────────

interface GoldIconProps {
  icon: React.ComponentType<any>;
  size?: 'sm' | 'md' | 'lg';
  showLed?: boolean;
  className?: string;
}

const GoldIcon: React.FC<GoldIconProps> = ({ icon: Icon, size = 'md', showLed = false, className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-13 h-13 sm:w-14 sm:h-14 rounded-2xl',
    lg: 'w-16 h-16 rounded-2xl',
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6 sm:w-7 sm:h-7',
    lg: 'w-8 h-8',
  }[size];

  return (
    <div className={`gs-icon ${sizeClasses} ${className}`} aria-hidden="true">
      {/* Specular top light reflex */}
      <div className="absolute inset-[1px] rounded-[inherit] pointer-events-none bg-gradient-to-b from-white/[0.16] via-transparent to-black/[0.4]" />
      
      {/* Gold-embossed vector glyph with ambient shadow */}
      <Icon
        className={`${iconSizes} text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] transition-all duration-200 group-hover:text-amber-200 group-hover:scale-105`}
      />

      {/* Machined precision status LED indicator */}
      {showLed && <span className="gs-icon__led animate-pulse" />}
    </div>
  );
};

// ─── BannerHeader ─────────────────────────────────────────────────────────────

interface BannerHeaderProps {
  dataset: any;
  datasets: any[];
  activeDatasetIndex: number;
  setActiveDatasetIndex: (i: number) => void;
  onReset: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  showSearch: boolean;
  onOpenMethodology?: (moduleId?: string) => void;
}

const BannerHeader: React.FC<BannerHeaderProps> = ({
  dataset,
  datasets,
  activeDatasetIndex,
  setActiveDatasetIndex,
  onReset,
  searchQuery,
  onSearchChange,
  showSearch,
  onOpenMethodology,
}) => {
  const filename = dataset?.name ?? null;
  const snpCount: number = dataset?.snpCount ?? 0;
  const chip: string = dataset?.chip ?? '';

  return (
    <header
      className="relative z-30 border-b border-amber-500/20 bg-[#09090b]/95 backdrop-blur-xl shrink-0"
      role="banner"
    >
      {/* Subtle genomic grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg,rgba(245,158,11,0.5) 0px,rgba(245,158,11,0.5) 1px,transparent 1px,transparent 24px)',
        }}
      />

      <div className="relative px-4 sm:px-6 py-3 flex items-center gap-4">
        {/* Status dot + dataset info */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
          </span>

          {filename !== null ? (
            <div className="min-w-0">
              <p
                className="text-[9px] font-mono font-bold uppercase tracking-[0.22em] text-amber-400 leading-none mb-0.5"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                ANALYZING DATASET
              </p>
              <p
                className="text-sm font-black text-zinc-100 truncate tracking-tight leading-none"
                style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
              >
                {filename}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-[9px] font-mono font-bold uppercase tracking-[0.22em] text-zinc-500 leading-none mb-0.5">
                READY TO ANALYZE
              </p>
              <p className="text-xs font-bold text-zinc-400 leading-none">
                No dataset loaded
              </p>
            </div>
          )}
        </div>

        {/* SNP count + chip — desktop only */}
        {filename !== null ? (
          <div className="hidden lg:flex items-center gap-6 shrink-0">
            <div className="text-center">
              <p
                className="text-xs font-black text-amber-300 tabular-nums leading-none"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {snpCount.toLocaleString()}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-500 mt-0.5">
                SNPs
              </p>
            </div>
            {chip !== '' ? (
              <div className="text-center">
                <p className="text-[10px] font-black text-zinc-300 leading-none">{chip}</p>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-500 mt-0.5">
                  Array
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search (only when showing launcher grid) */}
          {showSearch ? (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search modules…"
                className="w-36 sm:w-44 pl-7 pr-3 py-1.5 bg-black/40 border border-amber-500/20 rounded-lg text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-[border-color,box-shadow]"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              />
            </div>
          ) : null}

          {/* Offline badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25"
            title="100% Offline-Only Genomic Analysis"
          >
            <WifiOff className="w-3 h-3 text-amber-400" aria-hidden="true" />
            <span className="hidden sm:inline text-[9px] font-black uppercase tracking-[0.18em] text-amber-300">
              READY OFFLINE
            </span>
          </div>

          {/* Multi-dataset tabs */}
          {datasets.length > 1 ? (
            <div className="flex items-center gap-0.5 bg-black/40 rounded-lg p-0.5 border border-amber-500/20">
              {datasets.slice(0, 4).map((d: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveDatasetIndex(i)}
                  aria-label={`Switch to dataset ${d.name ?? `Kit ${i + 1}`}`}
                  className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-[background-color,color] duration-150 active:scale-[0.96] ${
                    activeDatasetIndex === i
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {((d.name ?? `Kit ${i + 1}`).split('.')[0]).slice(0, 8)}
                </button>
              ))}
            </div>
          ) : null}

          {/* Methodology Shortcut */}
          {onOpenMethodology && (
            <button
              onClick={() => onOpenMethodology('methodology')}
              aria-label="Scientific Methodology Hub"
              title="Open Scientific Methodology Hub"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 text-amber-300 hover:text-amber-200 transition-all text-[9px] font-mono font-black uppercase tracking-[0.15em] active:scale-[0.96]"
            >
              <BookOpen className="w-3 h-3 text-amber-400" />
              <span className="hidden md:inline">Methodology</span>
            </button>
          )}

          {/* Reset */}
          <button
            onClick={onReset}
            aria-label="Clear all data and reset"
            title="Clear session"
            className="p-2 rounded-lg border border-white/[0.08] text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 transition-[color,border-color] duration-150 active:scale-[0.96]"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom tagline stripe */}
      <div className="relative px-4 sm:px-6 pb-2 flex items-center justify-between border-t border-white/[0.04]">
        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400">
          GENOTYPE SCOUT • 100% CLIENT-SIDE GENOMIC ANALYSIS • ZERO SERVER UPLOAD
        </p>
        <p
          className="text-[8px] font-mono text-amber-400/80 tracking-[0.1em]"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          V5.22.0
        </p>
      </div>
    </header>
  );
};

// ─── SidebarNavItem ───────────────────────────────────────────────────────────

interface SidebarNavItemProps {
  mod: AppConfig;
  isActive: boolean;
  collapsed: boolean;
  onSelect: () => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ mod, isActive, collapsed, onSelect }) => (
  <button
    onClick={onSelect}
    aria-label={mod.name}
    title={mod.name}
    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-[background-color,color] duration-150 active:scale-[0.96] group ${
      isActive
        ? 'bg-amber-500/10 text-amber-300 border-l-2 border-amber-500'
        : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100'
    }`}
    style={{ transitionProperty: 'background-color, color, transform' }}
  >
    <GoldIcon icon={mod.icon} size="sm" />
    {collapsed ? null : (
      <span className="text-sm font-bold truncate text-left flex-1">{mod.name}</span>
    )}
    {isActive && !collapsed ? (
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] shrink-0" aria-hidden="true" />
    ) : null}
  </button>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  activeId: string | null;
  collapsed: boolean;
  onSelect: (id: string) => void;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeId, collapsed, onSelect, onToggle }) => (
  <aside
    className={`hidden lg:flex flex-col shrink-0 border-r border-amber-500/15 bg-[#09090b] overflow-hidden transition-[width] duration-200 ${
      collapsed ? 'w-[64px]' : 'w-[240px]'
    }`}
    aria-label="Module navigation"
  >
    {/* Home button */}
    <div className="p-2 border-b border-white/[0.06]">
      <button
        onClick={() => onSelect('__home__')}
        aria-label="Back to module launcher"
        title="Module Launcher"
        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-[background-color,color] duration-150 active:scale-[0.96] ${
          activeId === null
            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
            : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100'
        }`}
        style={{ transitionProperty: 'background-color, color, transform' }}
      >
        <Home className="w-4 h-4 shrink-0 text-amber-400" aria-hidden="true" />
        {collapsed ? null : (
          <span className="text-sm font-bold">All Modules</span>
        )}
      </button>
    </div>

    {/* Primary nav */}
    <div className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-none">
      {collapsed ? null : (
        <p className="px-2.5 pt-1 pb-1.5 text-[8px] font-black uppercase tracking-[0.25em] text-amber-400/70">
          Core Workflows
        </p>
      )}
      {PRIMARY_NAV.map(mod => (
        <SidebarNavItem
          key={mod.id}
          mod={mod}
          isActive={activeId === mod.id}
          collapsed={collapsed}
          onSelect={() => onSelect(mod.id)}
        />
      ))}

      {collapsed ? null : (
        <p className="px-2.5 pt-3 pb-1.5 text-[8px] font-black uppercase tracking-[0.25em] text-zinc-500">
          Genomic Tools
        </p>
      )}
      {MODULES.filter(m => m.navGroup === 'secondary').map(mod => (
        <SidebarNavItem
          key={mod.id}
          mod={mod}
          isActive={activeId === mod.id}
          collapsed={collapsed}
          onSelect={() => onSelect(mod.id)}
        />
      ))}
    </div>

    {/* Collapse toggle */}
    <div className="p-2 border-t border-white/[0.06]">
      <button
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="w-full flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-[color,background-color] duration-150 active:scale-[0.96]"
        style={{ transitionProperty: 'color, background-color, transform' }}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        ) : (
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        )}
      </button>
    </div>
  </aside>
);

// ─── BottomNavItem ────────────────────────────────────────────────────────────

interface BottomNavItemProps {
  mod: AppConfig;
  isActive: boolean;
  onSelect: () => void;
}

const BottomNavItem: React.FC<BottomNavItemProps> = ({ mod, isActive, onSelect }) => (
  <button
    onClick={onSelect}
    aria-label={mod.name}
    className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[44px] min-h-[44px] transition-[color] duration-150 active:scale-[0.96] ${
      isActive ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
    }`}
    style={{ transitionProperty: 'color, transform' }}
  >
    <mod.icon className="w-5 h-5" aria-hidden="true" />
    <span className="text-[8px] font-black uppercase tracking-wider leading-none">
      {mod.name.split(' ')[0]}
    </span>
  </button>
);

// ─── BottomNav ────────────────────────────────────────────────────────────────

interface BottomNavProps {
  activeId: string | null;
  onSelect: (id: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeId, onSelect }) => (
  <nav
    className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch bg-[#09090b]/95 backdrop-blur-xl border-t border-amber-500/20"
    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    aria-label="Primary navigation"
  >
    {/* Home */}
    <button
      onClick={() => onSelect('__home__')}
      aria-label="All Modules"
      className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[44px] min-h-[44px] transition-[color] duration-150 active:scale-[0.96] ${
        activeId === null ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
      }`}
      style={{ transitionProperty: 'color, transform' }}
    >
      <Home className="w-5 h-5" aria-hidden="true" />
      <span className="text-[8px] font-black uppercase tracking-wider leading-none">Home</span>
    </button>

    {BOTTOM_NAV_MODULES.map(mod => (
      <BottomNavItem
        key={mod.id}
        mod={mod}
        isActive={activeId === mod.id}
        onSelect={() => onSelect(mod.id)}
      />
    ))}

    {/* More */}
    <button
      onClick={() => onSelect('__more__')}
      aria-label="More modules"
      className="flex flex-col items-center justify-center gap-1 flex-1 min-w-[44px] min-h-[44px] text-zinc-500 hover:text-zinc-300 transition-[color] duration-150 active:scale-[0.96]"
      style={{ transitionProperty: 'color, transform' }}
    >
      <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
      <span className="text-[8px] font-black uppercase tracking-wider leading-none">More</span>
    </button>
  </nav>
);

// ─── ModuleCard ───────────────────────────────────────────────────────────────

interface ModuleCardProps {
  mod: AppConfig;
  index: number;
  onSelect: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ mod, index, onSelect }) => (
  <motion.button
    onClick={onSelect}
    aria-label={`Open ${mod.name}: ${mod.description}`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      delay: index * 0.025,
      duration: 0.22,
      ease: [0.2, 0, 0, 1],
    }}
    className="group gs-tile flex flex-col items-center justify-between p-4 sm:p-5 cursor-pointer text-left w-full h-full min-h-[185px]"
  >
    <div className="flex flex-col items-center text-center w-full">
      <GoldIcon icon={mod.icon} size="md" showLed={mod.navGroup === 'primary'} />
      <h3
        className="font-display text-sm font-black text-zinc-100 group-hover:text-amber-200 transition-colors text-center mt-3 leading-tight"
        style={{ textWrap: 'balance' } as React.CSSProperties}
      >
        {mod.name}
      </h3>
      <p className="text-[11px] text-zinc-400 group-hover:text-zinc-300 line-clamp-2 text-center mt-1.5 font-medium leading-snug">
        {mod.description}
      </p>
    </div>
    <div className="mt-3 flex items-center gap-1.5">
      <span className="gs-gold-badge">
        [LOCAL ENGINE]
      </span>
    </div>
  </motion.button>
);

// ─── AppLauncherGrid ──────────────────────────────────────────────────────────

interface AppLauncherGridProps {
  searchQuery: string;
  onSelectModule: (id: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Modules' },
  { id: 'ancestry', label: 'Ancestry & Oracle' },
  { id: 'lineage', label: 'Lineage & Ancient' },
  { id: 'health', label: 'Health & Traits' },
  { id: 'tools', label: 'Genomic Tools' },
];

const AppLauncherGrid: React.FC<AppLauncherGridProps> = ({ searchQuery, onSelectModule }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = useMemo(() => {
    let list = MODULES;
    if (selectedCategory === 'ancestry') {
      list = list.filter(m => ['ancestry_oracle', 'glossary', 'chromosome_painter', 'ancestry_scout'].includes(m.id));
    } else if (selectedCategory === 'lineage') {
      list = list.filter(m => ['haplogroups', 'ancient_dna'].includes(m.id));
    } else if (selectedCategory === 'health') {
      list = list.filter(m => ['health', 'traits', 'blood'].includes(m.id));
    } else if (selectedCategory === 'tools') {
      list = list.filter(m => ['markers', 'rare_variants', 'kit_comparison', 'integrity', 'methodology', 'profile'].includes(m.id));
    }

    const q = searchQuery.toLowerCase();
    return q
      ? list.filter(
          m =>
            m.name.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q)
        )
      : list;
  }, [searchQuery, selectedCategory]);

  return (
    <div style={{ contentVisibility: 'auto' }} className="space-y-5">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-[0.96] ${
              selectedCategory === cat.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                : 'bg-black/30 hover:bg-white/[0.05] text-zinc-400 hover:text-zinc-200 border border-white/[0.06]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((mod, i) => (
            <ModuleCard
              key={mod.id}
              mod={mod}
              index={i}
              onSelect={() => onSelectModule(mod.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-zinc-400 font-bold text-sm">No modules match</p>
          <p className="text-xs font-mono text-amber-400">"{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

// ─── ModuleViewHeader ─────────────────────────────────────────────────────────

interface ModuleViewHeaderProps {
  mod: AppConfig;
  onBack: () => void;
  onOpenMethodology?: (moduleId?: string) => void;
}

const ModuleViewHeader: React.FC<ModuleViewHeaderProps> = ({ mod, onBack, onOpenMethodology }) => (
  <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-amber-500/15 bg-[#09090b]/80 shrink-0">
    <div className="flex items-center gap-3 min-w-0">
      <button
        onClick={onBack}
        aria-label="Back to module launcher"
        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05] transition-[color,background-color] duration-150 active:scale-[0.96] shrink-0"
        style={{ transitionProperty: 'color, background-color, transform' }}
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
      </button>

      <GoldIcon icon={mod.icon} size="sm" />

      <div className="min-w-0">
        <h2
          className="text-sm font-black text-zinc-100 leading-none truncate"
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          {mod.name}
        </h2>
        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.18em] mt-0.5 max-w-xl truncate">
          {mod.description}
        </p>
      </div>
    </div>

    {onOpenMethodology && (
      <button
        onClick={() => onOpenMethodology(mod.id)}
        aria-label={`View methodology and documentation for ${mod.name}`}
        title="Open Methodology & Scientific Documentation"
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 text-amber-300 hover:text-amber-200 transition-all text-xs font-mono font-bold uppercase tracking-wider shrink-0 active:scale-[0.96] shadow-sm shadow-amber-500/10"
      >
        <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="hidden sm:inline">Methodology & Info</span>
        <span className="sm:hidden">Info</span>
      </button>
    )}
  </div>
);

// ─── EmptyState ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  onUploadNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onUploadNew }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
    className="flex flex-col items-center justify-center h-full gap-6 py-20"
  >
    <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/20 to-amber-400/10 flex items-center justify-center border border-amber-500/30 shadow-lg shadow-amber-500/10">
      <Dna className="w-10 h-10 text-amber-400" aria-hidden="true" />
    </div>
    <div className="text-center space-y-2">
      <h2
        className="text-xl font-black text-zinc-100"
        style={{ textWrap: 'balance' } as React.CSSProperties}
      >
        No Dataset Loaded
      </h2>
      <p
        className="text-sm text-zinc-400 max-w-xs"
        style={{ textWrap: 'pretty' } as React.CSSProperties}
      >
        Load a raw DNA file to unlock all genomic analysis modules.
      </p>
    </div>
    <button
      onClick={onUploadNew}
      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-amber-950/40 transition-[background-color] duration-150 active:scale-[0.96]"
      style={{ transitionProperty: 'background-color, transform' }}
    >
      Load New Dataset
    </button>
  </motion.div>
);

// ─── ScoutWorkspace (root shell) ──────────────────────────────────────────────

const ScoutWorkspace: React.FC<ScoutWorkspaceProps> = ({
  dataset,
  datasets,
  activeDatasetIndex,
  setActiveDatasetIndex,
  onNavigateToTab,
  onReset,
  currentApp,
  onOpenApp,
  onOpenMethodology,
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeModule = useMemo(
    () => (currentApp !== null ? MODULES.find(m => m.id === currentApp) ?? null : null),
    [currentApp]
  );

  const hasDataset = dataset !== null && dataset !== undefined;

  const handleSelectModule = (id: string) => {
    if (id === '__home__') {
      onOpenApp(null);
      return;
    }
    if (id === '__more__') {
      // On mobile "More", go home to show full grid
      onOpenApp(null);
      return;
    }
    if (id === 'clear_cache') {
      if (window.confirm('This will clear all saved genomic data and force a reload. Continue?')) {
        onReset();
      }
      return;
    }
    const mod = MODULES.find(m => m.id === id);
    if (mod) {
      onNavigateToTab(mod.targetTab, mod.targetSubTab);
      onOpenApp(id);
    }
  };

  return (
    <div
      className="flex flex-col bg-background text-foreground"
      style={{ height: 'calc(100dvh - 64px)', marginTop: '64px', paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Signature Banner Header */}
      <BannerHeader
        dataset={dataset}
        datasets={datasets}
        activeDatasetIndex={activeDatasetIndex}
        setActiveDatasetIndex={setActiveDatasetIndex}
        onReset={onReset}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={currentApp === null}
        onOpenMethodology={onOpenMethodology}
      />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — desktop only */}
        <Sidebar
          activeId={currentApp}
          collapsed={sidebarCollapsed}
          onSelect={handleSelectModule}
          onToggle={() => setSidebarCollapsed(c => !c)}
        />

        {/* Content area */}
        <main className="flex-1 flex flex-col overflow-hidden" id="main-content">
          <AnimatePresence mode="wait">
            {currentApp !== null ? (
              <motion.div
                key={currentApp}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                className="flex flex-col flex-1 overflow-hidden"
              >
                {/* Module view back-header */}
                {activeModule !== null ? (
                  <ModuleViewHeader 
                    mod={activeModule} 
                    onBack={() => onOpenApp(null)} 
                    onOpenMethodology={onOpenMethodology}
                  />
                ) : null}

                {/* Module content */}
                <div
                  className="flex-1 overflow-y-auto px-4 sm:px-6 py-6"
                  style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 4rem)' }}
                >
                  {hasDataset ? children : <EmptyState onUploadNew={() => onOpenApp(null)} />}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="launcher"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                className="flex-1 overflow-y-auto px-4 sm:px-6 py-6"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 5rem)' }}
              >
                {hasDataset ? (
                  <AppLauncherGrid
                    searchQuery={searchQuery}
                    onSelectModule={handleSelectModule}
                  />
                ) : (
                  <EmptyState onUploadNew={() => {}} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <BottomNav activeId={currentApp} onSelect={handleSelectModule} />
    </div>
  );
};

export default ScoutWorkspace;
