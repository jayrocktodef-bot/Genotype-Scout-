import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Compass, History, Dna, Info, X, ChevronRight, Globe, Sparkles, BookOpen } from 'lucide-react';
import { SUBPOPULATION_GLOSSARY_DATA, PopulationGlossaryItem } from '../data/subpopulationGlossaryData';

const CATEGORIES: ('All' | PopulationGlossaryItem['category'])[] = [
  'All',
  'Europe',
  'Africa',
  'Americas',
  'East Asia',
  'South Asia',
  'Middle East & Jewish',
  'Oceania & Sahul',
  'Central Asia & Siberia'
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Europe': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Africa': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'Americas': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  'East Asia': { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  'South Asia': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  'Middle East & Jewish': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  'Oceania & Sahul': { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
  'Central Asia & Siberia': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
};

export const SubpopulationGlossaryTab: React.FC<{ initialSearch?: string }> = ({ initialSearch = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<'All' | PopulationGlossaryItem['category']>('All');
  const [selectedPop, setSelectedPop] = useState<PopulationGlossaryItem | null>(null);

  const filteredPopulations = useMemo(() => {
    return SUBPOPULATION_GLOSSARY_DATA.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchesCategory;

      const matchesSearch = 
        item.code.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term) ||
        item.geographicCenter.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        (item.aliases && item.aliases.some(a => a.toLowerCase().includes(term))) ||
        item.evolutionaryAdaptations.some(a => a.trait.toLowerCase().includes(term) || a.gene.toLowerCase().includes(term));

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#111213]/80 backdrop-blur-3xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-10 pointer-events-none">
          <Globe size={320} className="text-teal-400 rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 text-[#4ECDC4] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen size={13} /> Subpopulation Atlas & Glossary
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono font-bold">
                {SUBPOPULATION_GLOSSARY_DATA.length} Reference Populations
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#4ECDC4] tracking-tight">
              Human Population Origins & Migration Routes
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Explore the geographical origins, historical migration timelines, evolutionary adaptations, and genetic signatures of reference populations across the globe.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-80 shrink-0">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search population, gene, or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#4ECDC4] transition-colors"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-1 border-t border-white/10 no-scrollbar">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-[#4ECDC4] text-slate-950 font-extrabold shadow-lg shadow-[#4ECDC4]/20 scale-105' 
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Population Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPopulations.map((pop) => {
          const colors = CATEGORY_COLORS[pop.category] || CATEGORY_COLORS['Europe'];

          return (
            <motion.div
              key={pop.code}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111213]/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-5 sm:p-6 text-white space-y-4 hover:border-[#4ECDC4]/40 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-3.5">
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${colors.bg} ${colors.text} ${colors.border}`}>
                      {pop.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mt-2 group-hover:text-[#4ECDC4] transition-colors">
                      {pop.name}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-black px-2 py-1 rounded bg-white/10 border border-white/10 text-slate-200 shrink-0">
                    {pop.code}
                  </span>
                </div>

                {/* Geography & Timeline */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-start gap-2 text-xs font-medium text-slate-300">
                    <MapPin size={14} className="text-[#4ECDC4] shrink-0 mt-0.5" />
                    <span>{pop.geographicCenter}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs font-medium text-slate-300">
                    <History size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>{pop.historicalTimeline}</span>
                  </div>
                </div>

                {/* Evolutionary Adaptations */}
                {pop.evolutionaryAdaptations.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#4ECDC4] flex items-center gap-1">
                      <Sparkles size={11} /> Key Evolutionary Adaptations
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {pop.evolutionaryAdaptations.map((adapt, idx) => (
                        <span key={idx} className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-200" title={adapt.impact}>
                          {adapt.trait} ({adapt.gene})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description Snippet */}
                <p className="text-xs text-slate-300 font-normal leading-relaxed line-clamp-3 italic pt-1">
                  "{pop.description}"
                </p>
              </div>

              {/* Action / Detail Trigger */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 font-semibold">
                  {pop.migrationPath.length} Migration Steps
                </span>
                <button
                  onClick={() => setSelectedPop(pop)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#4ECDC4] text-white hover:text-slate-950 font-bold text-xs transition-all flex items-center gap-1 group-hover:shadow-md"
                >
                  View Migration Route <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredPopulations.length === 0 && (
        <div className="p-12 text-center bg-[#111213]/80 border border-white/10 rounded-2xl text-slate-400 text-sm">
          No populations found matching "{searchTerm}". Try clearing search or selecting another region filter.
        </div>
      )}

      {/* Population Migration Modal */}
      <AnimatePresence>
        {selectedPop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111213] border border-white/15 rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-white space-y-6 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPop(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="space-y-2 pr-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded bg-[#4ECDC4]/10 text-[#4ECDC4] border border-[#4ECDC4]/30">
                    {selectedPop.category}
                  </span>
                  <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-white/10 text-slate-200">
                    {selectedPop.code}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {selectedPop.name}
                </h2>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <MapPin size={14} className="text-[#4ECDC4]" />
                  <span>{selectedPop.geographicCenter}</span>
                </div>
              </div>

              {/* Overview Description */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#4ECDC4] flex items-center gap-1.5">
                  <BookOpen size={14} /> Anthropological Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {selectedPop.description}
                </p>
              </div>

              {/* Migration Path Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Compass size={14} /> Ancient Migration Routes & Settlement Timeline
                </h4>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/15">
                  {selectedPop.migrationPath.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3">
                      <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#4ECDC4] border-2 border-[#111213] shrink-0" />
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium w-full">
                        <span className="font-mono text-[10px] font-black text-[#4ECDC4] uppercase tracking-widest block mb-0.5">
                          Step {idx + 1}
                        </span>
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evolutionary Adaptations Details */}
              {selectedPop.evolutionaryAdaptations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <Dna size={14} /> Key Evolutionary Adaptations & Natural Selection
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedPop.evolutionaryAdaptations.map((adapt, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-extrabold text-xs text-white">{adapt.trait}</span>
                          <span className="font-mono text-[10px] font-bold text-[#4ECDC4] px-1.5 py-0.5 rounded bg-white/10">
                            {adapt.gene} {adapt.rsid ? `• ${adapt.rsid}` : ''}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-normal leading-relaxed">
                          {adapt.impact}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Markers & Haplogroups */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Diagnostic Genetic Signatures & Haplogroup Notes
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPop.keyMarkers.map((marker, idx) => (
                    <span key={idx} className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#4ECDC4]/10 text-[#4ECDC4] border border-[#4ECDC4]/30">
                      {marker}
                    </span>
                  ))}
                </div>
                {selectedPop.haplogroupNotes && (
                  <p className="text-xs text-slate-300 font-semibold pt-1">
                    <span className="text-slate-400">Haplogroups:</span> {selectedPop.haplogroupNotes}
                  </p>
                )}
              </div>

              {/* Close Footer */}
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setSelectedPop(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#4ECDC4] text-slate-950 font-extrabold text-xs uppercase tracking-widest hover:bg-[#45b8b0] transition-colors"
                >
                  Close Atlas Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
