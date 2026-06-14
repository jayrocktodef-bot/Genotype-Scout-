import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Globe, History, HeartPulse, Database, BookOpen, 
  Zap, Droplet, Wifi, BatteryCharging, ArrowLeft, 
  Circle, Square, Search, Mic, Settings, Play, X, Dna, Sparkles,
  Trash2
} from 'lucide-react';

interface AndroidDesktopProps {
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
  children?: React.ReactNode;
}

export interface AppConfig {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  gradient: string;
  glowColor: string;
  targetTab: 'dashboard' | 'summary' | 'autosomal' | 'ancestry' | 'history' | 'health_traits' | 'markers' | 'debug' | 'methodology';
  targetSubTab?: string;
  description: string;
  imageUrl?: string;
}

const AndroidDesktop: React.FC<AndroidDesktopProps> = ({
  oracleResults,
  populationProximity,
  dataset,
  userSnps,
  onNavigateToTab,
  onReset,
  uiMode,
  onChangeUiMode,
  currentApp,
  onOpenApp,
  children
}) => {
  const [time, setTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecentsOpen, setIsRecentsOpen] = useState(false);
  const [openedAppsHistory, setOpenedAppsHistory] = useState<string[]>([]);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate slight battery discharging/charging
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => {
        if (prev <= 15) return 98; // reset to simulate charging
        return prev - 1;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  };

  // Define 9 genetic analysis "Apps"
  const apps: AppConfig[] = useMemo(() => [
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
      description: 'Maternal vs. Paternal segment-by-segment ancestral origin mapping of your 22 autosomes.',
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
      icon: Play, // Simulated helix/modern lineage trigger
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
      id: 'methodology',
      name: 'Methodology',
      icon: BookOpen,
      gradient: 'from-violet-500 to-purple-600',
      glowColor: 'rgba(139, 92, 246, 0.45)',
      targetTab: 'methodology',
      description: 'Learn the underlying math, science, and calculation engines.',
      imageUrl: '/assets/methodology_icon.png',
    }
  ], []);

  // Float apps for the bottom dock (4 most popular)
  const dockApps = useMemo(() => {
    return apps.filter(app => ['profile', 'ancestry_oracle', 'haplogroups', 'health'].includes(app.id));
  }, [apps]);

  const handleLaunchApp = (appId: string) => {
    const selectedApp = apps.find(a => a.id === appId);
    if (!selectedApp) return;

    // Track history for Back button
    setOpenedAppsHistory(prev => {
      const next = prev.filter(x => x !== appId); // remove duplication
      return [...next, appId];
    });

    onNavigateToTab(selectedApp.targetTab, selectedApp.targetSubTab);
    onOpenApp(appId);
    setIsRecentsOpen(false);
  };

  const handleGoBack = () => {
    if (isRecentsOpen) {
      setIsRecentsOpen(false);
      return;
    }

    if (currentApp) {
      setOpenedAppsHistory(prev => {
        const next = [...prev];
        next.pop(); // Remove active app
        const previousAppId = next[next.length - 1] || null;
        
        if (previousAppId) {
          const prevApp = apps.find(a => a.id === previousAppId);
          if (prevApp) {
            onNavigateToTab(prevApp.targetTab, prevApp.targetSubTab);
            onOpenApp(previousAppId);
          } else {
            onOpenApp(null);
          }
        } else {
          onOpenApp(null);
        }
        return next;
      });
    }
  };

  const handleGoHome = () => {
    onOpenApp(null);
    setIsRecentsOpen(false);
  };

  const handleToggleRecents = () => {
    setIsRecentsOpen(prev => !prev);
  };

  const handleCloseAppFromRecents = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenedAppsHistory(prev => prev.filter(x => x !== appId));
    if (currentApp === appId) {
      onOpenApp(null);
    }
  };

  // Find app detail helper
  const getAppById = (appId: string) => apps.find(a => a.id === appId);

  // Filter apps based on search query
  const filteredApps = useMemo(() => {
    if (!searchQuery) return apps;
    return apps.filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()) || app.description.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [apps, searchQuery]);

  return (
    <div className="relative w-full min-h-[90vh] rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-all duration-300">
      {/* Desktop Wallpaper */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-slate-100 via-indigo-50/50 to-teal-50/50 dark:from-[#090b0e] dark:via-[#131922] dark:to-[#17112c] transition-colors duration-500" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/5 via-transparent to-transparent opacity-60" />

      {/* Simulated Android Status Bar */}
      <div className="relative z-10 w-full h-8 px-6 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 select-none">
        <div className="flex items-center gap-1.5">
          <span>Scout Mobile</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Connected to local sandbox"></span>
          <span className="text-[9px] uppercase bg-slate-200 dark:bg-slate-800/80 px-1.5 py-0.5 rounded tracking-wider">5G</span>
          <Wifi className="w-3.5 h-3.5" />
        </div>
        <div>
          <span>{formatTime(time)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono">{batteryLevel}%</span>
          <BatteryCharging className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
        </div>
      </div>

      {/* Main Desktop Workspace Area */}
      <div className="relative z-10 flex-1 flex flex-col p-6 sm:p-8 select-none">
        <AnimatePresence mode="wait">
          {!currentApp && !isRecentsOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-between"
            >
              {/* Widgets & Header Panel */}
              <div className="text-center pt-4 sm:pt-6 space-y-4">
                {/* Welcome Title & Status Widget */}
                <motion.div 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-block px-8 py-4 rounded-[2rem] bg-white/40 dark:bg-slate-900/35 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-xl shadow-slate-200/10 dark:shadow-none"
                >
                  <h1 className="text-3xl font-black text-slate-850 dark:text-slate-100 tracking-tighter">
                    Genotype Scout
                  </h1>
                  <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-slate-200/40 dark:border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-slate-650 dark:text-slate-350 tracking-wider uppercase">🧬 Core Synced • 100% Offline Ready</span>
                  </div>
                </motion.div>

                {/* Google-Style Pill Search Widget */}
                <div className="max-w-md mx-auto relative mt-2">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search traits, haplogroups, or markers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-200/40 dark:border-white/5 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all font-semibold shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center gap-1 text-slate-400">
                    <Mic className="w-4 h-4 cursor-pointer hover:text-slate-600" />
                  </div>
                </div>
              </div>

              {/* Grid of Circular Node Apps */}
              <div className="my-auto py-8">
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-y-8 gap-x-4 max-w-4xl mx-auto items-start justify-center">
                  {filteredApps.map((app) => (
                    <motion.div
                      key={app.id}
                      onClick={() => handleLaunchApp(app.id)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      className="flex flex-col items-center cursor-pointer group text-center"
                    >
                      <div 
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.75rem] bg-gradient-to-tr ${app.gradient} flex items-center justify-center text-white relative shadow-lg transition-shadow duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]`}
                        style={{
                          boxShadow: `0 10px 25px -5px ${app.glowColor}`
                        }}
                      >
                        {app.imageUrl ? (
                          <img 
                            src={app.imageUrl} 
                            alt={app.name} 
                            className="w-full h-full object-cover rounded-[1.75rem] group-hover:scale-105 transition-transform duration-300" 
                          />
                        ) : (
                          <app.icon className="w-7 h-7 sm:w-9 sm:h-9 text-white group-hover:rotate-6 transition-transform duration-300" />
                        )}
                        <div className="absolute inset-0 rounded-[1.75rem] border border-white/20 z-10" />
                        <div className="absolute inset-0 rounded-[1.75rem] bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-black text-slate-700 dark:text-slate-200 mt-2.5 tracking-tight uppercase break-words line-clamp-2 max-w-[80px]">
                        {app.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
                {filteredApps.length === 0 && (
                  <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    No matching apps found
                  </div>
                )}

                {/* External Links */}
                <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
                  <a 
                    href="https://writteninthegenome.blog" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white/30 dark:bg-slate-900/30 backdrop-blur-md border border-white/20 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all shadow-sm"
                  >
                    📝 Blog
                  </a>
                  <a 
                    href="https://www.facebook.com/share/g/1EFyWD35tB/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white/30 dark:bg-slate-900/30 backdrop-blur-md border border-white/20 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all shadow-sm"
                  >
                    👥 Facebook
                  </a>
                  <a 
                    href="https://givebutter.com/genotypescout" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-teal-500/10 dark:bg-teal-950/20 backdrop-blur-md border border-teal-500/20 dark:border-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 dark:hover:bg-teal-900/30 transition-all shadow-sm"
                  >
                    💚 Donate
                  </a>
                </div>
              </div>

              {/* Bottom Frosted Glass Dock */}
              <div className="max-w-md mx-auto w-full pt-4">
                <div className="px-6 py-4 rounded-[2rem] bg-white/20 dark:bg-slate-900/25 backdrop-blur-2xl border border-white/30 dark:border-white/5 shadow-xl flex items-center justify-around">
                  {dockApps.map((app) => (
                    <motion.button
                      key={app.id}
                      onClick={() => handleLaunchApp(app.id)}
                      whileHover={{ scale: 1.1, y: -4 }}
                      whileTap={{ scale: 0.93 }}
                      className="flex flex-col items-center gap-1 group relative cursor-pointer"
                      title={app.name}
                    >
                      <div 
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${app.gradient} flex items-center justify-center text-white relative shadow-md shadow-slate-900/10`}
                        style={{
                          boxShadow: `0 8px 18px -4px ${app.glowColor}`
                        }}
                      >
                        {app.imageUrl ? (
                          <img 
                            src={app.imageUrl} 
                            alt={app.name} 
                            className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300" 
                          />
                        ) : (
                          <app.icon className="w-5.5 h-5.5 text-white" />
                        )}
                        <div className="absolute inset-0 rounded-2xl border border-white/15" />
                      </div>
                      <span className="absolute -top-8 bg-slate-900 text-white text-[9px] font-black tracking-widest px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity uppercase pointer-events-none whitespace-nowrap">
                        {app.name}
                      </span>
                    </motion.button>
                  ))}

                  {/* Clear Cache button */}
                  <motion.button
                    onClick={onReset}
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.93 }}
                    className="flex flex-col items-center gap-1 group relative cursor-pointer"
                    title="Clear Cache"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 flex items-center justify-center border border-rose-100 dark:border-rose-900/30 shadow-sm">
                      <Trash2 className="w-5.5 h-5.5" />
                    </div>
                    <span className="absolute -top-8 bg-slate-900 text-white text-[9px] font-black tracking-widest px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity uppercase pointer-events-none whitespace-nowrap">
                      Clear Cache
                    </span>
                  </motion.button>

                  {/* Launcher settings widget icon */}
                  <motion.button
                    onClick={() => onChangeUiMode(uiMode === 'desktop' ? 'classic' : 'desktop')}
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.93 }}
                    className="flex flex-col items-center gap-1 group relative cursor-pointer"
                    title="Tab Mode"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-350 flex items-center justify-center border border-slate-300/40 dark:border-white/5 shadow-sm">
                      <Settings className="w-5.5 h-5.5" />
                    </div>
                    <span className="absolute -top-8 bg-slate-900 text-white text-[9px] font-black tracking-widest px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity uppercase pointer-events-none whitespace-nowrap">
                      Tab Mode
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Simulated App Window overlay */}
          {currentApp && !isRecentsOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-250/20 dark:border-slate-850/20 shadow-2xl overflow-hidden relative"
            >
              {/* App window Header */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleGoBack}
                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                    title="Back"
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
                      {getAppById(currentApp)?.name || 'Application'}
                    </h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      Dataset: {dataset?.name?.split('.')[0] || 'Primary'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGoHome}
                    className="p-1.5 hover:bg-slate-250 dark:hover:bg-slate-800 rounded-full text-slate-550 dark:text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    title="Minimize to Desktop"
                  >
                    <Circle className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>

              {/* App Content Frame */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/40 dark:bg-slate-900/10">
                {children}
              </div>
            </motion.div>
          )}

          {/* Multitasking / Recents Screen Overview */}
          {isRecentsOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col justify-between py-6 relative"
            >
              <div className="text-center select-none pt-2">
                <span className="px-4 py-1.5 bg-slate-200 dark:bg-slate-850 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Recent Applications
                </span>
              </div>

              {/* Horizontal carousel of open apps */}
              <div className="my-auto overflow-x-auto scrollbar-none py-6 flex items-center justify-start gap-6 px-12 md:justify-center">
                {openedAppsHistory.length > 0 ? (
                  openedAppsHistory.map((appId) => {
                    const app = getAppById(appId);
                    if (!app) return null;
                    const isActive = currentApp === appId;

                    return (
                      <motion.div
                        key={appId}
                        whileHover={{ y: -8, scale: 1.02 }}
                        onClick={() => handleLaunchApp(appId)}
                        className={`relative w-56 h-80 rounded-[2rem] bg-white dark:bg-slate-900 border-2 ${
                          isActive 
                            ? 'border-teal-500 shadow-xl shadow-teal-500/10 dark:shadow-none' 
                            : 'border-slate-200 dark:border-slate-800 shadow-md hover:border-slate-300'
                        } shrink-0 cursor-pointer overflow-hidden p-4 flex flex-col justify-between`}
                      >
                        {/* Header preview inside recent card */}
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3 select-none">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center relative shrink-0">
                              {app.imageUrl ? (
                                <img src={app.imageUrl} alt={app.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <div className={`w-full h-full bg-gradient-to-tr ${app.gradient} flex items-center justify-center text-white`}>
                                  <app.icon className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <span className="text-[10px] font-black tracking-tight text-slate-800 dark:text-slate-200 uppercase line-clamp-1">
                              {app.name}
                            </span>
                          </div>
                          <button
                            onClick={(e) => handleCloseAppFromRecents(appId, e)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            title="Close app"
                          >
                            <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                          </button>
                        </div>

                        {/* Simulated snapshot body */}
                        <div className="flex-1 flex flex-col items-center justify-center p-3 text-center bg-slate-50/50 dark:bg-slate-950/20 my-3 rounded-2xl border border-slate-100 dark:border-slate-850">
                          {app.imageUrl ? (
                            <img src={app.imageUrl} alt={app.name} className="w-14 h-14 rounded-xl object-cover mb-2 shadow" />
                          ) : (
                            <app.icon className="w-10 h-10 text-slate-400 mb-2 opacity-50" />
                          )}
                          <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-normal font-semibold">
                            {app.description}
                          </p>
                        </div>

                        {/* Card bottom active flag */}
                        <div className="text-center select-none pt-1">
                          {isActive ? (
                            <span className="text-[9px] font-black text-teal-600 tracking-wider uppercase">Active Session</span>
                          ) : (
                            <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase">Backgrounded</span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-20 text-slate-400 text-xs font-bold uppercase tracking-wider w-full select-none">
                    No recent applications open
                  </div>
                )}
              </div>

              {/* Launcher toggle reset settings inside multitasking view */}
              <div className="text-center pt-2">
                <button
                  onClick={handleGoHome}
                  className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-wider shadow"
                >
                  Clear Multitasking Space
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Simulated Android Navigation Bar (Gestures/Buttons) */}
      <div className="relative z-10 w-full h-12 bg-slate-900 border-t border-slate-850 flex items-center justify-around select-none">
        {/* Back Button (◀) */}
        <button 
          onClick={handleGoBack}
          className={`flex items-center justify-center w-14 h-8 rounded-xl transition-all ${
            currentApp || isRecentsOpen 
              ? 'text-white hover:bg-white/10 active:scale-90 cursor-pointer' 
              : 'text-slate-700 pointer-events-none'
          }`}
          title="Back"
        >
          <ArrowLeft className="w-5 h-5 shrink-0" />
        </button>

        {/* Home Button (●) */}
        <button 
          onClick={handleGoHome}
          className={`flex items-center justify-center w-14 h-8 rounded-xl text-white hover:bg-white/10 active:scale-90 cursor-pointer`}
          title="Home Desktop"
        >
          <Circle className="w-4 h-4 fill-current shrink-0" />
        </button>

        {/* Recents Multitasking (■) */}
        <button 
          onClick={handleToggleRecents}
          className={`flex items-center justify-center w-14 h-8 rounded-xl transition-all ${
            openedAppsHistory.length > 0
              ? 'text-white hover:bg-white/10 active:scale-90 cursor-pointer'
              : 'text-slate-700 pointer-events-none'
          }`}
          title="Recent Apps"
        >
          <Square className="w-4 h-4 fill-current shrink-0" />
        </button>
      </div>
    </div>
  );
};

export default AndroidDesktop;
