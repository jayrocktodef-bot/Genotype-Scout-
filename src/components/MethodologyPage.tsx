import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Info, Code, Award, Landmark, Database, ChevronDown, ChevronUp, MessageCircle, Beaker, Shield } from 'lucide-react';
import { getMethodologyData } from './MethodologyModal';

const allSections = [
  { tabId: 'dashboard', emoji: '📊' },
  { tabId: 'summary', emoji: '🧬' },
  { tabId: 'autosomal', emoji: '🧩' },
  { tabId: 'oracle', emoji: '🎯' },
  { tabId: 'naive_oracle', emoji: '⚡' },
  { tabId: 'haplogroups', emoji: '🌳' },
  { tabId: 'ancient', emoji: '💀' },
  { tabId: 'compare', emoji: '🗺️' },
  { tabId: 'blood', emoji: '🩸' },
  { tabId: 'markers', emoji: '🔬' },
];

/**
 * Returns a plain-English, jargon-free explanation of each engine
 * that any non-scientist can understand.
 */
const getPlainEnglish = (tabId: string): string => {
  switch (tabId) {
    case 'dashboard':
      return 'When you upload your DNA file, we first check how much of your data overlaps with our reference database — kind of like checking how many puzzle pieces from your box match the picture on the lid. A higher overlap means we can give you more accurate results. We count exactly how many of your genetic markers we recognize out of the thousands we track.';

    case 'summary':
      return 'Think of this as your "report card" that pulls together all the separate analyses into one clean page. It gathers your ancestry percentages, your deep family line results, health-related markers, and other findings, then lays them out side-by-side so you can see the full picture without jumping between tabs.';

    case 'autosomal':
      return 'Your DNA is made of pairs of letters (A, T, C, G). At each specific location in your genome, you got one letter from your mom and one from your dad. We look at those letter pairs and compare them to known variants that scientists have already studied. If both your letters match a known variant, you\'re "homozygous" for it. If only one matches, you\'re "heterozygous." This tells us which traits or health markers are relevant to you.';

    case 'oracle':
      return 'Imagine you have a smoothie and you\'re trying to figure out exactly what fruits went into it. That\'s what NNLS does with your DNA — it looks at thousands of genetic markers and mathematically figures out the best combination of reference populations that, when mixed together, would produce a genetic profile like yours. The math guarantees that no population gets a negative percentage (you can\'t have -10% of something), and all percentages add up to exactly 100%.';

    case 'naive_oracle':
      return 'This is a faster, simpler version of the ancestry calculation. Instead of trying to figure out the whole "smoothie recipe" at once, it looks at each genetic marker one at a time and asks: "Which population is this single marker most common in?" Then it averages all those answers together. It\'s quicker but less precise than the full NNLS approach — think of it as a quick sketch vs. a detailed painting.';

    case 'haplogroups':
      return 'Your Y-chromosome (if male) is passed nearly unchanged from father to son, and your mitochondrial DNA is passed from mother to child. Over thousands of years, these lineages pick up unique mutations — like stamps in a passport showing where your ancestors traveled. We walk down a giant "family tree" of known mutations, checking which ones you carry, to find exactly where your paternal and maternal lines sit on humanity\'s deep ancestral map.';

    case 'ancient':
      return 'Scientists have extracted DNA from ancient skeletons found at archaeological sites — farmers from Turkey 9,000 years ago, hunters from Ice Age Europe, nomads from the Central Asian steppe. We compare your DNA to these ancient people to see which groups you\'re genetically closest to. It\'s like finding out which ancient "tribes" contributed most to your modern DNA makeup.';

    case 'compare':
      return 'Your DNA contains hundreds of thousands of data points — way too many to visualize at once. We use a technique that compresses all that information down into just a few coordinates, like squishing a 3D globe onto a flat map. This lets us plot you alongside global populations to show visually which groups you cluster closest to. Think of it as a "you are here" dot on a map of world genetics.';

    case 'blood':
      return 'Your blood type (A, B, AB, or O, plus Rh positive or negative) is determined by just a handful of specific genetic markers. We read those exact markers from your DNA file and apply straightforward biological rules — the same ones taught in biology class — to predict your blood type. It\'s one of the most reliable genetic predictions we can make, with accuracy above 99% in well-tested populations.';

    case 'markers':
      return 'Before we run any analysis, we check the quality of your DNA file itself — similar to how a mechanic inspects a car before a road trip. We look at what percentage of markers were successfully read by your testing company (the "call rate"), whether there are signs of data corruption, and what type of DNA chip was used. A higher call rate means your raw data is cleaner and your results will be more reliable.';

    default:
      return 'This section provides details on the analytical methods used by Genotype Scout.';
  }
};

export const MethodologyPage: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['dashboard']));

  const toggleSection = (tabId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(tabId)) {
        next.delete(tabId);
      } else {
        next.add(tabId);
      }
      return next;
    });
  };

  const expandAll = () => setExpandedSections(new Set(allSections.map(s => s.tabId)));
  const collapseAll = () => setExpandedSections(new Set());

  return (
    <div className="space-y-10 pb-20 animate-fade-up">
      {/* Header */}
      <section className="pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                How It All Works
              </h1>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1">
                Methodology & Calculation Explainers
              </p>
            </div>
          </div>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            Every result in Genotype Scout is powered by transparent, peer-reviewed algorithms running 
            <span className="text-teal-600 dark:text-teal-400 font-bold"> entirely on your device</span>. 
            Below is a plain-English breakdown of each calculation, along with the technical details for those who want to dig deeper.
          </p>
        </motion.div>
      </section>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={expandAll}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          Collapse All
        </button>
      </div>

      {/* Engine Cards */}
      <div className="space-y-4">
        {allSections.map((section, idx) => {
          const data = getMethodologyData(section.tabId);
          const isExpanded = expandedSections.has(section.tabId);
          const plainEnglish = getPlainEnglish(section.tabId);

          return (
            <motion.div
              key={section.tabId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="premium-card overflow-hidden"
            >
              {/* Clickable Header */}
              <button
                onClick={() => toggleSection(section.tabId)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors !transform-none"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-2xl shrink-0">{section.emoji}</span>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight truncate">
                      {data.title}
                    </h2>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 font-mono mt-0.5 truncate">
                      {data.algName}
                    </p>
                  </div>
                </div>
                <div className="ml-4 shrink-0 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-6 pb-6 space-y-6 border-t border-slate-100 dark:border-slate-800 pt-6">

                      {/* Plain English Explainer — the star of the show */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/20 border border-teal-100 dark:border-teal-800/40">
                        <div className="flex items-center gap-2 mb-3">
                          <MessageCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <h3 className="text-xs font-black uppercase tracking-widest text-teal-700 dark:text-teal-400">
                            In Plain English
                          </h3>
                        </div>
                        <p className="text-sm sm:text-base text-teal-900 dark:text-teal-100 leading-relaxed font-medium">
                          {plainEnglish}
                        </p>
                      </div>

                      {/* Technical Description */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Beaker className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                          <h3 className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                            Technical Description
                          </h3>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                          {data.description}
                        </p>
                      </div>

                      {/* Formulas */}
                      {data.formulas && data.formulas.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                              Algebraic Modeling
                            </h3>
                          </div>
                          {data.formulas.map((f, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-3">
                              <div className="text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest">{f.label}</div>
                              <div className="font-mono text-center text-sm py-4 px-4 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-black overflow-x-auto select-all">
                                {f.equation}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">{f.explanation}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Metrics */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {data.metrics.map((m, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold">{m.label}</div>
                            <div className="text-sm font-black text-slate-700 dark:text-slate-300 mt-1 font-mono">{m.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* References */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                        <div className="flex items-center gap-2">
                          <Landmark className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                          <h3 className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                            Academic References
                          </h3>
                        </div>
                        <ul className="space-y-2">
                          {data.references.map((r, i) => (
                            <li key={i} className="flex gap-2 text-xs text-slate-500 dark:text-slate-400 items-start">
                              <Award className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Privacy Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-2 pt-8 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
      >
        <Shield className="w-4 h-4 text-teal-500" />
        All calculations run locally in your browser — your DNA never leaves your device
      </motion.div>
    </div>
  );
};
