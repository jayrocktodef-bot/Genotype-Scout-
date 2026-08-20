import React, { memo, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dna, MapPin, History, Info, User, Microscope, Globe, ChevronRight } from 'lucide-react';

// Continent metadata & colors
const CONTINENT_CONFIG: Record<string, { label: string; icon: string; badgeColor: string; bgGradient: string; borderColor: string }> = {
  Africa: {
    label: "Africa",
    icon: "🌍",
    badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    bgGradient: "from-emerald-950/30 to-black/40",
    borderColor: "border-emerald-500/30"
  },
  Americas: {
    label: "Americas",
    icon: "🌎",
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    bgGradient: "from-amber-950/30 to-black/40",
    borderColor: "border-amber-500/30"
  },
  Asia: {
    label: "Asia & Steppe",
    icon: "🌏",
    badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    bgGradient: "from-purple-950/30 to-black/40",
    borderColor: "border-purple-500/30"
  },
  Europe: {
    label: "Europe",
    icon: "🇪🇺",
    badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    bgGradient: "from-blue-950/30 to-black/40",
    borderColor: "border-blue-500/30"
  },
  Oceania: {
    label: "Oceania & Sahul",
    icon: "🏝️",
    badgeColor: "text-teal-400 bg-teal-500/10 border-teal-500/30",
    bgGradient: "from-teal-950/30 to-black/40",
    borderColor: "border-teal-500/30"
  },
  Other: {
    label: "Global / Unassigned",
    icon: "🌐",
    badgeColor: "text-slate-400 bg-slate-500/10 border-slate-500/30",
    bgGradient: "from-slate-900/30 to-black/40",
    borderColor: "border-slate-500/30"
  }
};

const resolveContinent = (pop: any): string => {
  if (pop.continent && CONTINENT_CONFIG[pop.continent]) return pop.continent;
  const text = `${pop.region || ''} ${pop.country || ''} ${pop.site || ''} ${pop.popName || ''} ${pop.culture || ''}`.toLowerCase();
  
  if (text.includes('africa') || text.includes('ethiopia') || text.includes('cameroon') || text.includes('sudan') || text.includes('morocco') || text.includes('namibia') || text.includes('botswana') || text.includes('ghana') || text.includes('egypt') || text.includes('mali') || text.includes('mota') || text.includes('nubian') || text.includes('taforalt') || text.includes('shum laka') || text.includes('ballito') || text.includes('asselar')) return 'Africa';
  if (text.includes('america') || text.includes('usa') || text.includes('brazil') || text.includes('peru') || text.includes('chile') || text.includes('montana') || text.includes('washington') || text.includes('nevada') || text.includes('maryland') || text.includes('clovis') || text.includes('anzick') || text.includes('luzia') || text.includes('beringian') || text.includes('kennewick') || text.includes('spirit cave')) return 'Americas';
  if (text.includes('oceania') || text.includes('australia') || text.includes('willandra') || text.includes('sahul') || text.includes('papuan') || text.includes('melanesia')) return 'Oceania';
  if (text.includes('asia') || text.includes('china') || text.includes('japan') || text.includes('india') || text.includes('turkey') || text.includes('anatolian') || text.includes('indus') || text.includes('tianyuan') || text.includes('jomon') || text.includes('rakhigarhi') || text.includes('boncuklu') || text.includes('yamnaya') || text.includes('eurasia') || text.includes('steppe')) return 'Asia';
  if (text.includes('europe') || text.includes('luxembourg') || text.includes('uk') || text.includes('england') || text.includes('germany') || text.includes('richard iii') || text.includes('loschbour') || text.includes('cheddar') || text.includes('stuttgart') || text.includes('kostenki')) return 'Europe';
  
  return 'Other';
};

export const AncientAncestryOracle = memo(({ 
  results, 
  title = "Deep Time Oracle", 
  subtitle = "Ancient Admixture & Paleolithic Affinity",
  type = "admixture",
  onOpenMethodology
}: { 
  results: any[], 
  title?: string, 
  subtitle?: string,
  type?: 'admixture' | 'matches',
  onOpenMethodology?: () => void;
}) => {
  const [selectedContinent, setSelectedContinent] = useState<string>('ALL');

  const validResults = useMemo(() => (results || []).filter(Boolean), [results]);

  // Group results by continent
  const groupedByContinent = useMemo(() => {
    const map: Record<string, any[]> = {};
    validResults.forEach(pop => {
      const cont = resolveContinent(pop);
      if (!map[cont]) map[cont] = [];
      map[cont].push({ ...pop, resolvedContinent: cont });
    });
    return map;
  }, [validResults]);

  // Available continents with counts
  const continentTabs = useMemo(() => {
    const order = ['Africa', 'Americas', 'Europe', 'Asia', 'Oceania', 'Other'];
    const tabs: { key: string; label: string; icon: string; count: number }[] = [
      { key: 'ALL', label: 'All Continents', icon: '🌐', count: validResults.length }
    ];
    order.forEach(key => {
      if (groupedByContinent[key] && groupedByContinent[key].length > 0) {
        const cfg = CONTINENT_CONFIG[key] || CONTINENT_CONFIG.Other;
        tabs.push({
          key,
          label: cfg.label,
          icon: cfg.icon,
          count: groupedByContinent[key].length
        });
      }
    });
    return tabs;
  }, [groupedByContinent, validResults.length]);

  if (!results || results.length === 0) return null;

  const displayContinents = selectedContinent === 'ALL'
    ? Object.keys(groupedByContinent).sort()
    : [selectedContinent];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 sm:p-12 rounded-2xl sm:rounded-[3rem] bg-[#1a1b1d]/80 backdrop-blur-xl border border-amber-900/20 shadow-2xl relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5 pointer-events-none">
        <Dna size={400} className="text-amber-500 rotate-12" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5F6F7] mb-2 tracking-tighter">{title}</h2>
            <p className="text-xs sm:text-sm font-bold text-amber-500 uppercase tracking-widest">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            {onOpenMethodology && (
              <button
                onClick={onOpenMethodology}
                className="px-4 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-500 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Microscope size={12} /> Methodology
              </button>
            )}
            <div className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold font-mono">
              ENGINE V5.0
            </div>
          </div>
        </div>

        {/* Continent Filter Bar */}
        <div className="mb-10 flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-1 flex items-center gap-1.5">
            <Globe size={13} className="text-amber-400" /> Continent:
          </span>
          {continentTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedContinent(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedContinent === tab.key
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                selectedContinent === tab.key ? 'bg-black/20 text-black' : 'bg-white/10 text-amber-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Continental Groups Layout */}
        <div className="space-y-12">
          {displayContinents.map(continentKey => {
            const items = groupedByContinent[continentKey] || [];
            if (items.length === 0) return null;
            const cfg = CONTINENT_CONFIG[continentKey] || CONTINENT_CONFIG.Other;

            return (
              <div key={continentKey} className="space-y-5">
                {/* Continent Header Banner */}
                <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r ${cfg.bgGradient} border ${cfg.borderColor} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cfg.icon}</span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                        {cfg.label}
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-mono font-bold ${cfg.badgeColor}`}>
                          {items.length} {items.length === 1 ? 'Match' : 'Matches'}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">Ancient DNA sample alignments from {cfg.label}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-500 hidden sm:block" />
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {items.map((pop, index) => (
                      <motion.div
                        key={`${pop.popCode || 'unknown'}-${index}`}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.03 }}
                        className="p-6 sm:p-7 rounded-2xl bg-black/50 border border-white/10 hover:border-amber-500/40 transition-all group shadow-lg flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform border border-amber-500/20">
                              {type === 'matches' ? <User size={22} /> : <History size={22} />}
                            </div>
                            <div className="text-right">
                              <span className="block text-3xl font-black text-white leading-none mb-1 tracking-tight">
                                {(pop.score || 0).toFixed(1)}%
                              </span>
                              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/90">
                                {type === 'matches' ? 'Genetic Match' : 'Admixture Proportion'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badgeColor}`}>
                              {cfg.icon} {cfg.label}
                            </span>
                          </div>

                          <h3 className="text-xl font-black text-white mb-2 truncate" title={pop.popName}>{pop.popName}</h3>
                          <div className="flex flex-wrap items-center gap-2 mb-3.5">
                            <div className="flex items-center gap-1 text-xs font-bold text-slate-300 uppercase truncate dark:text-slate-200">
                              <MapPin size={12} className="text-amber-400 shrink-0" /> {pop.region}
                            </div>
                            <span className="text-slate-500">•</span>
                            <div className="text-xs font-bold text-slate-300 uppercase truncate dark:text-slate-200">
                              {pop.period}
                            </div>
                            {pop.age_bp && (
                              <>
                                <span className="text-slate-500">•</span>
                                <div className="text-xs font-bold text-amber-400 uppercase truncate">
                                  {pop.age_bp.toLocaleString()} BP
                                </div>
                              </>
                            )}
                          </div>

                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 font-normal italic">
                            "{pop.description}"
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 truncate dark:text-slate-200">
                             <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                             {pop.culture || (type === 'matches' ? 'Archaeological Sample' : 'Reference Clade')}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                              {pop.matchingMarkers} Markers
                            </span>
                            <button className="text-amber-400 opacity-80 group-hover:opacity-100 transition-opacity">
                              <Info size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* Methodology Note */}
        <div className="mt-10 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex flex-col sm:flex-row items-center gap-6">
          <div className="hidden sm:block p-3 rounded-xl bg-amber-500/20 text-amber-500">
            <Microscope size={24} />
          </div>
          <p className="text-sm text-slate-400 leading-relaxed text-center sm:text-left">
            <strong className="text-amber-500 block mb-1 uppercase tracking-wider text-xs">Methodology Note</strong>
            {type === 'matches' 
              ? "Individual matches are calculated by performing a point-by-point genotype comparison between your raw data and published SNP calls from ancient human remains, organized by geographic continent of origin."
              : "Historical affinity is calculated by comparing your genotype against curated reference markers from peer-reviewed ancient DNA studies (Reich, Mathieson, Haak) organized across continental lineages."}
          </p>
        </div>
      </div>
    </motion.div>
  );
});
