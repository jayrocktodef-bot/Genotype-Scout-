import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Info, Code, Award, Landmark, Database, ChevronDown, ChevronUp, 
  MessageCircle, Beaker, Shield, Search, Sparkles, CheckCircle2, 
  HelpCircle, ExternalLink, Dna, Filter
} from 'lucide-react';
import { 
  MODULE_DOCUMENTATION, 
  ModuleDocumentation, 
  getDocumentationForModule 
} from '../data/moduleExplanations';

// Ordered canonical list of all 14 analysis modules
const MODULE_ORDER = [
  'profile',
  'ancestry_oracle',
  'glossary',
  'chromosome_painter',
  'ancestry_scout',
  'haplogroups',
  'ancient_dna',
  'health',
  'traits',
  'blood',
  'markers',
  'rare_variants',
  'kit_comparison',
  'methodology'
] as const;

const MODULE_EMOJIS: Record<string, string> = {
  profile: '👤',
  ancestry_oracle: '🌐',
  glossary: '📖',
  chromosome_painter: '🎨',
  ancestry_scout: '⚡',
  haplogroups: '🌳',
  ancient_dna: '💀',
  health: '🩺',
  traits: '✨',
  blood: '🩸',
  markers: '🔬',
  rare_variants: '🔍',
  kit_comparison: '👥',
  methodology: '🛡️'
};

interface MethodologyPageProps {
  activeTab?: string;
  initialModuleId?: string;
}

export const MethodologyPage: React.FC<MethodologyPageProps> = ({ 
  activeTab, 
  initialModuleId 
}) => {
  // Map activeTab to canonical module id
  const targetInitial = useMemo(() => {
    if (initialModuleId && MODULE_DOCUMENTATION[initialModuleId]) return initialModuleId;
    if (activeTab) {
      const doc = getDocumentationForModule(activeTab);
      return doc.id;
    }
    return 'profile';
  }, [activeTab, initialModuleId]);

  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    () => new Set([targetInitial, 'ancestry_oracle'])
  );
  
  // Independent mode ('explainer' vs 'technical') per module card
  const [moduleModes, setModuleModes] = useState<Record<string, 'explainer' | 'technical'>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'PRIMARY' | 'TOOLS'>('ALL');

  const toggleModule = (id: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const setCardMode = (id: string, mode: 'explainer' | 'technical') => {
    setModuleModes(prev => ({ ...prev, [id]: mode }));
  };

  const expandAll = () => setExpandedModules(new Set(MODULE_ORDER));
  const collapseAll = () => setExpandedModules(new Set());

  // Filtered module list
  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MODULE_ORDER.filter(id => {
      const doc = MODULE_DOCUMENTATION[id];
      if (!doc) return false;

      if (categoryFilter !== 'ALL' && doc.category !== categoryFilter) {
        return false;
      }

      if (!q) return true;

      const inTitle = doc.title.toLowerCase().includes(q);
      const inId = doc.id.toLowerCase().includes(q);
      const inEngine = doc.technical.solverEngine.toLowerCase().includes(q);
      const inDescription = doc.technical.description.toLowerCase().includes(q);
      const inHeadline = doc.explainer.headline.toLowerCase().includes(q);
      const inReferences = doc.technical.references.some(r => r.toLowerCase().includes(q));

      return inTitle || inId || inEngine || inDescription || inHeadline || inReferences;
    });
  }, [searchQuery, categoryFilter]);

  return (
    <div className="space-y-10 pb-24 animate-fade-up max-w-6xl mx-auto">
      {/* Hero Header */}
      <section className="pt-4 sm:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-500 dark:text-cyan-400 shrink-0 shadow-sm shadow-cyan-500/10">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400">
                    CUSTODIAL REFERENCE HUB
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden sm:inline">
                    14 ACTIVE MODULES
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  Scientific Methodology & Explanations
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-mono font-bold uppercase tracking-wider shrink-0">
              <Shield className="w-4 h-4 text-teal-500" />
              <span>100% Client-Side • Zero Telemetry</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mt-4">
            Every analysis inside Genotype Scout adheres to peer-reviewed academic literature and open mathematical frameworks. 
            Select any module below to inspect its <span className="font-bold text-teal-600 dark:text-teal-400">Plain English Explainer</span> (for intuitive human takeaways) or its <span className="font-bold text-cyan-600 dark:text-cyan-400">Technical Methodology</span> (for exact equations, solver models, and academic citations).
          </p>
        </motion.div>
      </section>

      {/* Controls & Quick Filter Bar */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search equations, algorithms, citations, or topics…"
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
            />
          </div>

          {/* Category tabs & Expand/Collapse */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setCategoryFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                  categoryFilter === 'ALL'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                All (14)
              </button>
              <button
                onClick={() => setCategoryFilter('PRIMARY')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                  categoryFilter === 'PRIMARY'
                    ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Primary (5)
              </button>
              <button
                onClick={() => setCategoryFilter('TOOLS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                  categoryFilter === 'TOOLS'
                    ? 'bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Tools (9)
              </button>
            </div>

            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={expandAll}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-mono font-bold uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-[0.96]"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-mono font-bold uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-[0.96]"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>

        {/* Quick jump pills */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {MODULE_ORDER.map(id => {
            const doc = MODULE_DOCUMENTATION[id];
            if (!doc) return null;
            const isExpanded = expandedModules.has(id);
            return (
              <button
                key={id}
                onClick={() => {
                  setExpandedModules(prev => new Set(prev).add(id));
                  const el = document.getElementById(`methodology-card-${id}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-semibold transition-all border flex items-center gap-1.5 ${
                  isExpanded
                    ? 'bg-teal-500/10 border-teal-500/30 text-teal-700 dark:text-teal-300'
                    : 'bg-white/60 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-white/20'
                }`}
              >
                <span>{MODULE_EMOJIS[id] || '🔹'}</span>
                <span>{doc.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Module Methodology Cards */}
      <section className="space-y-6">
        {filteredModules.length > 0 ? (
          filteredModules.map((id, index) => {
            const doc = MODULE_DOCUMENTATION[id];
            if (!doc) return null;

            const isExpanded = expandedModules.has(id);
            const mode = moduleModes[id] || 'explainer';

            return (
              <motion.div
                id={`methodology-card-${id}`}
                key={id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                className="bg-white dark:bg-[#0c0d10] border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all tactile-3d-card"
              >
                {/* Header Bar */}
                <div className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4 border-b border-slate-100 dark:border-white/[0.06]">
                  {/* Left: Module Title & Solver Title */}
                  <button
                    onClick={() => toggleModule(id)}
                    className="flex items-start sm:items-center gap-3 sm:gap-4 text-left group flex-1 min-w-0 !transform-none"
                    aria-label={`Toggle documentation for ${doc.title}`}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-lg sm:text-xl shrink-0 group-hover:scale-105 transition-transform">
                      {MODULE_EMOJIS[id] || '🧬'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                          {doc.category}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                          ID: {doc.id}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mt-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {doc.title}
                      </h2>
                      <p className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {doc.technical.solverEngine}
                      </p>
                    </div>
                  </button>

                  {/* Right: Dual-Mode Switcher & Expand Chevron */}
                  <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3 shrink-0 w-full md:w-auto">
                    {/* Dual Mode Tab Switcher */}
                    <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 flex-1 sm:flex-initial justify-center">
                      <button
                        onClick={() => {
                          setCardMode(id, 'explainer');
                          if (!isExpanded) toggleModule(id);
                        }}
                        className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all text-center ${
                          mode === 'explainer'
                            ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 font-black'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        Plain English
                      </button>
                      <button
                        onClick={() => {
                          setCardMode(id, 'technical');
                          if (!isExpanded) toggleModule(id);
                        }}
                        className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all text-center ${
                          mode === 'technical'
                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        Technical
                      </button>
                    </div>

                    {/* Expand/Collapse Toggle Button */}
                    <button
                      onClick={() => toggleModule(id)}
                      aria-label="Expand or collapse section"
                      className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all shrink-0"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Card Body Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 bg-slate-50/50 dark:bg-black/20">
                        {mode === 'explainer' ? (
                          /* ─── PLAIN ENGLISH EXPLAINER ─── */
                          <div className="space-y-4 sm:space-y-6">
                            {/* Headline */}
                            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                              <div className="flex items-center gap-2 mb-2 text-teal-700 dark:text-teal-400">
                                <Sparkles className="w-4 h-4" />
                                <h3 className="text-xs font-mono font-bold uppercase tracking-widest">
                                  Core Principle
                                </h3>
                              </div>
                              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                                {doc.explainer.headline}
                              </p>
                            </div>

                            {/* The Real-World Analogy */}
                            <div className="p-5 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20">
                              <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400">
                                <HelpCircle className="w-4 h-4" />
                                <h3 className="text-xs font-mono font-bold uppercase tracking-widest">
                                  The Real-World Analogy
                                </h3>
                              </div>
                              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                                {doc.explainer.analogy}
                              </p>
                            </div>

                            {/* How We Calculated Your Results */}
                            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3">
                              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                <Beaker className="w-4 h-4 text-teal-500" />
                                <h3 className="text-xs font-mono font-bold uppercase tracking-widest">
                                  Step-by-Step: How We Derived Your Results
                                </h3>
                              </div>
                              <ul className="space-y-2.5">
                                {doc.explainer.howWeGotYourResults.map((step, sIdx) => (
                                  <li key={sIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Two Column Takeaways & Nuance */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-5 rounded-2xl bg-teal-500/[0.05] border border-teal-500/15">
                                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400 mb-2">
                                  What It Means For You
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                  {doc.explainer.whatItMeansForYou}
                                </p>
                              </div>

                              <div className="p-5 rounded-2xl bg-rose-500/[0.05] border border-rose-500/15">
                                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-rose-700 dark:text-rose-400 mb-2">
                                  Scientific Limits & Nuance
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                  {doc.explainer.caveatsAndNuance}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* ─── TECHNICAL METHODOLOGY ─── */
                          <div className="space-y-6">
                            {/* Computational Description */}
                            <div className="p-5 rounded-2xl bg-cyan-500/[0.05] border border-cyan-500/20 space-y-2">
                              <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400">
                                <Beaker className="w-4 h-4" />
                                <h3 className="text-xs font-mono font-bold uppercase tracking-widest">
                                  Solver Engine Specification
                                </h3>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-mono">
                                {doc.technical.description}
                              </p>
                            </div>

                            {/* Mathematical Equations */}
                            {doc.technical.formulas && doc.technical.formulas.length > 0 && (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                  <Code className="w-4 h-4 text-cyan-500" />
                                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest">
                                    Algebraic Modeling & Equations
                                  </h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                  {doc.technical.formulas.map((formula, fIdx) => (
                                    <div 
                                      key={fIdx}
                                      className="p-4 rounded-2xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 space-y-2"
                                    >
                                      <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                                        {formula.label}
                                      </div>
                                      <div className="font-mono text-center text-xs sm:text-sm py-3 px-4 bg-white dark:bg-slate-955 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-slate-100 font-bold overflow-x-auto select-all">
                                        {formula.equation}
                                      </div>
                                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                                        {formula.explanation}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Metrics Grid */}
                            {doc.technical.metrics && doc.technical.metrics.length > 0 && (
                              <div className="space-y-2">
                                <div className="text-xs font-mono font-bold uppercase tracking-widest text-slate-800 dark:text-slate-300">
                                  Diagnostic Metrics & Constants
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {doc.technical.metrics.map((metric, mIdx) => (
                                    <div
                                      key={mIdx}
                                      className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10"
                                    >
                                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                        {metric.label}
                                      </div>
                                      <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono mt-0.5 truncate">
                                        {metric.value}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Academic References */}
                            {doc.technical.references && doc.technical.references.length > 0 && (
                              <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3">
                                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                  <Landmark className="w-4 h-4 text-amber-500" />
                                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest">
                                    Academic & Peer-Reviewed Literature Citations
                                  </h3>
                                </div>
                                <ul className="space-y-2">
                                  {doc.technical.references.map((ref, rIdx) => (
                                    <li key={rIdx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-mono">
                                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                      <span>{ref}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3">
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">
              No methodology modules matched "{searchQuery}"
            </p>
            <button
              onClick={() => { setSearchQuery(''); setCategoryFilter('ALL'); }}
              className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-mono font-bold uppercase tracking-widest"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Footer Sovereignty Seal */}
      <section className="pt-8 border-t border-slate-200 dark:border-white/10 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Shield className="w-4 h-4 text-teal-500" />
          <span>Zero-Knowledge Genomic Privacy Standard</span>
        </div>
        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          All algorithms execute on local Web Workers in browser memory. No genomic sequences or coordinates are ever transferred over the internet.
        </p>
      </section>
    </div>
  );
};

export default MethodologyPage;
