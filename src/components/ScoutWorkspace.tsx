import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Globe, History, HeartPulse, Database, BookOpen, 
  Zap, Droplet, ArrowLeft, 
  Search, Settings, Play, X, Dna, Sparkles,
  Trash2, Users, Printer
} from 'lucide-react';

interface ScoutWorkspaceProps {
  oracleResults: any;
  populationProximity: any[];
  dataset: any;
  userSnps: Record<string, string>;
  onNavigateToTab: (tab: any, subTab?: string) => void;
  onReset: () => void;
  uiMode: 'desktop' | 'classic';
  onChangeUiMode: (mode: 'desktop' | 'classic') => void;
  currentApp: string | null;
  onOpenApp: (appId: string | null) => void;
  datasets: any[];
  activeDatasetIndex: number;
  setActiveDatasetIndex: (i: number) => void;
  children?: React.ReactNode;
}

export interface AppConfig {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  gradient: string;
  glowColor: string;
  targetTab: 'dashboard' | 'summary' | 'autosomal' | 'ancestry' | 'history' | 'health_traits' | 'markers' | 'rare_variants' | 'debug' | 'methodology' | 'ai_agent' | 'kit_comparison' | 'export';
  targetSubTab?: string;
  description: string;
  imageUrl?: string;
}

const ScoutWorkspace: React.FC<ScoutWorkspaceProps> = ({
  dataset,
  onNavigateToTab,
  onReset,
  uiMode,
  onChangeUiMode,
  currentApp,
  onOpenApp,
  datasets,
  activeDatasetIndex,
  setActiveDatasetIndex,
  children
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Define genetic analysis "Modules"
  const modules: AppConfig[] = useMemo(() => [
    {
      id: 'profile',
      name: 'Scout Profile',
      icon: User,
      gradient: 'from-amber-400 to-orange-600',
      glowColor: 'rgba(245, 158, 11, 0.45)',
      targetTab: 'summary',
      description: 'Comprehensive overview of your genetic origins and breakdown.',
      imageUrl: '/assets/profile_icon.png',
    },
    {
      id: 'ancestry_oracle',
      name: 'Ancestry Oracle',
      icon: Globe,
      gradient: 'from-teal-400 to-emerald-600',
      glowColor: 'rgba(20, 184, 166, 0.45)',
      targetTab: 'ancestry',
      targetSubTab: 'oracle',
      description: 'Run deep subpopulation queries and NNLS admixture optimization.',
      imageUrl: '/assets/oracle_icon.png',
    },
    {
      id: 'chromosome_painter',
      name: 'Chromosome Painter',
      icon: Dna,
      gradient: 'from-sky-400 to-indigo-500',
      glowColor: 'rgba(56, 189, 248, 0.45)',
      targetTab: 'ancestry',
      targetSubTab: 'painter',
      description: 'Segment-by-segment ancestral origin mapping of your 22 autosomes.',
      imageUrl: '/assets/painter_icon.png',
    },
    {
      id: 'ancestry_scout',
      name: 'Scout Score',
      icon: Zap,
      gradient: 'from-yellow-400 to-amber-500',
      glowColor: 'rgba(234, 179, 8, 0.45)',
      targetTab: 'ancestry',
      targetSubTab: 'scout',
      description: 'Analyze global admixture using ancestral score matrices.',
      imageUrl: '/assets/score_icon.png',
    },
    {
      id: 'haplogroups',
      name: 'Haplotypes',
      icon: Play,
      gradient: 'from-blue-500 to-indigo-600',
      glowColor: 'rgba(59, 130, 246, 0.45)',
      targetTab: 'history',
      targetSubTab: 'modern',
      description: 'Discover your paternal and maternal terminal haplogroups.',
      imageUrl: '/assets/haplogroups_icon.png',
    },
    {
      id: 'ancient_dna',
      name: 'Ancient Matches',
      icon: History,
      gradient: 'from-rose-500 to-pink-600',
      glowColor: 'rgba(244, 63, 94, 0.45)',
      targetTab: 'history',
      targetSubTab: 'ancient',
      description: 'Compare your DNA to historical and ancient tribes matches.',
      imageUrl: '/assets/ancient_icon.png',
    },
    {
      id: 'health',
      name: 'Health',
      icon: HeartPulse,
      gradient: 'from-emerald-400 to-teal-600',
      glowColor: 'rgba(16, 185, 129, 0.45)',
      targetTab: 'health_traits',
      targetSubTab: 'wellness',
      description: 'Explore drug response metabolism (PGx) and polygenic risk reports.',
      imageUrl: '/assets/health_icon.png',
    },
    {
      id: 'traits',
      name: 'Traits',
      icon: Sparkles,
      gradient: 'from-pink-400 to-rose-500',
      glowColor: 'rgba(244, 63, 94, 0.45)',
      targetTab: 'health_traits',
      targetSubTab: 'traits',
      description: 'Explore physical appearance, lifestyle, and nutrition traits.',
      imageUrl: '/assets/health_icon.png',
    },
    {
      id: 'blood',
      name: 'Blood Predictor',
      icon: Droplet,
      gradient: 'from-red-500 to-rose-600',
      glowColor: 'rgba(239, 68, 68, 0.45)',
      targetTab: 'health_traits',
      targetSubTab: 'blood',
      description: 'Predict ABO and Rhesus Factor blood groups from genetic data.',
      imageUrl: '/assets/blood_icon.png',
    },
    {
      id: 'prs',
      name: 'PRS Engine',
      icon: HeartPulse,
      gradient: 'from-indigo-500 to-purple-600',
      glowColor: 'rgba(99, 102, 241, 0.45)',
      targetTab: 'health_traits',
      targetSubTab: 'prs',
      description: 'Calculate Polygenic Risk Scores (PRS) for complex clinical traits.',
      imageUrl: '/assets/health_icon.png',
    },
    {
      id: 'markers',
      name: 'Genomic Markers',
      icon: Database,
      gradient: 'from-cyan-400 to-blue-600',
      glowColor: 'rgba(6, 182, 212, 0.45)',
      targetTab: 'autosomal',
      description: 'Search, filter, and inspect your parsed autosomal variants.',
      imageUrl: '/assets/markers_icon.png',
    },
    {
      id: 'rare_variants',
      name: 'Rare Variants',
      icon: Zap,
      gradient: 'from-fuchsia-400 to-purple-600',
      glowColor: 'rgba(192, 38, 211, 0.45)',
      targetTab: 'rare_variants',
      description: 'Identify internally tracked, unmapped, and potentially rare genetic variants.',
      imageUrl: '/assets/oracle_icon.png',
    },
    {
      id: 'kit_comparison',
      name: 'Kit Comparison',
      icon: Users,
      gradient: 'from-blue-400 to-indigo-600',
      glowColor: 'rgba(99, 102, 241, 0.45)',
      targetTab: 'kit_comparison',
      description: 'Side-by-side comparison of multiple kits, traits, and ancestry.',
      imageUrl: '/assets/kit_comparison_icon.png',
    },
    {
      id: 'export',
      name: 'Export & Reports',
      icon: Printer,
      gradient: 'from-rose-400 to-red-600',
      glowColor: 'rgba(244, 63, 94, 0.45)',
      targetTab: 'export',
      description: 'Generate high-quality PDF reports with customizable health filters.',
    },
    {
      id: 'ai_agent',
      name: 'AI Explainer',
      icon: Sparkles,
      gradient: 'from-purple-500 to-indigo-650',
      glowColor: 'rgba(139, 92, 246, 0.45)',
      targetTab: 'ai_agent',
      description: 'Your personal AI genomic guide. Ask questions and interpret your ancestry.',
      imageUrl: '/assets/ai_agent_icon.png',
    },
    {
      id: 'methodology',
      name: 'Methodology',
      icon: BookOpen,
      gradient: 'from-violet-500 to-purple-600',
      glowColor: 'rgba(139, 92, 246, 0.45)',
      targetTab: 'methodology',
      description: 'Learn the underlying math, science, and calculation engines.',
      imageUrl: '/assets/methodology_icon.png',
    },
    {
      id: 'clear_cache',
      name: 'Clear Cache',
      icon: Trash2,
      gradient: 'from-rose-500 to-red-600',
      glowColor: 'rgba(244, 63, 94, 0.45)',
      targetTab: 'clear_cache',
      description: 'Hard reset your local browser cache and reload the application.',
    }
  ], []);

  const handleLaunchModule = (moduleId: string) => {
    if (moduleId === 'clear_cache') {
      if (window.confirm("This will clear all saved genomic data and force a reload. Continue?")) {
        onReset();
      }
      return;
    }
    const selectedModule = modules.find(m => m.id === moduleId);
    if (!selectedModule) return;
    onNavigateToTab(selectedModule.targetTab, selectedModule.targetSubTab);
    onOpenApp(moduleId);
  };

  const handleGoHome = () => {
    onOpenApp(null);
  };

  const getModuleById = (moduleId: string) => modules.find(m => m.id === moduleId);

  const filteredModules = useMemo(() => {
    if (!searchQuery) return modules;
    return modules.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [modules, searchQuery]);

  return (
    <div className="relative w-full min-h-[85vh] flex flex-col transition-all duration-300">
      {/* Workspace Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-slate-50 via-slate-100 to-indigo-50/50 dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] transition-colors duration-500 rounded-[2rem]" />

      {/* Main Workspace Area */}
      <div className="relative z-10 flex-1 flex flex-col p-6 sm:p-12">
        <AnimatePresence mode="wait">
          {!currentApp && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col max-w-[1600px] mx-auto w-full"
            >
              {/* Header Panel */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    Genotype Scout
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                      Dataset: {dataset?.name?.split('.')[0] || 'Primary'} • 100% Offline Ready
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  {/* Search Bar */}
                  <div className="relative flex-1 md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search modules..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm"
                    />
                  </div>

                  {/* Dataset Picker Inline */}
                  {datasets && datasets.length > 1 && (
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      {datasets.map((d, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveDatasetIndex(i)}
                          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                            activeDatasetIndex === i 
                              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm' 
                              : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          {d.name?.split('.')[0] || `Kit ${i+1}`}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Settings / Reset Controls */}
                  <button
                    onClick={() => onChangeUiMode(uiMode === 'desktop' ? 'classic' : 'desktop')}
                    className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
                    title="Toggle Layout Mode"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onReset}
                    className="p-2.5 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/30 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors shadow-sm cursor-pointer"
                    title="Clear Session Cache"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredModules.map((mod, idx) => (
                  <motion.div
                    key={mod.id}
                    onClick={() => handleLaunchModule(mod.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/60 rounded-3xl p-6 cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div 
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${mod.gradient} flex items-center justify-center shrink-0 shadow-lg`}
                        style={{ boxShadow: `0 8px 16px -4px ${mod.glowColor}` }}
                      >
                        {mod.imageUrl ? (
                          <img src={mod.imageUrl} alt={mod.name} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          <mod.icon className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 leading-tight">
                        {mod.name}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {mod.description}
                    </p>
                  </motion.div>
                ))}
              </div>
              
              {filteredModules.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center p-8 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 border-dashed dark:border-slate-700">
                    <p className="text-slate-500 font-bold uppercase tracking-wider">No modules found matching "{searchQuery}"</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Module Full View Wrapper */}
          {currentApp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col w-full h-full bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
              {/* Minimalist Header / Breadcrumbs */}
              <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 flex items-center justify-between z-20">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleGoHome}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Workspace
                  </button>
                  <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
                  <div className="flex items-center gap-3">
                    {getModuleById(currentApp)?.imageUrl && (
                       <img src={getModuleById(currentApp)!.imageUrl} alt="" className="w-6 h-6 rounded object-cover shadow-sm" />
                    )}
                    <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      {getModuleById(currentApp)?.name}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={handleGoHome}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Module Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ScoutWorkspace;
