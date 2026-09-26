/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Compass, Dna, Activity, HeartPulse, Sparkles,
  Droplet, Database, Zap, Users, ShieldCheck, BookOpen,
  Scale, ExternalLink, X, ArrowRight, CornerDownLeft
} from 'lucide-react';

export interface IndexItem {
  id: string;
  name: string;
  category: 'Ancestry & Population' | 'Health & Functional' | 'Diagnostics & Tools' | 'Reference & Legal';
  description: string;
  keywords: string[];
  icon: React.ComponentType<{ className?: string }>;
  targetTab?: string;
  type?: 'internal' | 'modal' | 'external';
  url?: string;
  badge?: string;
}

export const MODULE_DIRECTORY: IndexItem[] = [
  // ─── Ancestry & Population ─────────────────────────────────────────────
  {
    id: 'admixture',
    name: 'Modern Ancestry Oracle',
    category: 'Ancestry & Population',
    description: 'Calculate multi-continental ancestry percentages with regional subpopulation deconvolution.',
    keywords: ['ancestry', 'admixture', 'ethnicity', 'heritage', 'oracle', 'subpopulations', 'regions', 'microhaps'],
    icon: Dna,
    targetTab: 'ancestry',
    badge: 'Popular',
  },
  {
    id: 'chromosome_painter',
    name: 'Chromosome Painter',
    category: 'Ancestry & Population',
    description: 'Interactive visual and tabular map of maternal and paternal phased chromosome tracts.',
    keywords: ['chromosome', 'painter', 'phasing', 'haplotypes', 'maternal', 'paternal', 'segments', 'wcag', 'table'],
    icon: Activity,
    targetTab: 'ancestry',
    badge: 'Accessible',
  },
  {
    id: 'pca',
    name: 'PCA 3D Space',
    category: 'Ancestry & Population',
    description: 'Project genetic sample into 3D principal component coordinate space against 1000 Genomes & HGDP.',
    keywords: ['pca', 'eigenvectors', 'clustering', '3d', 'coordinates', 'dimensions', 'scatterplot', '1000g'],
    icon: Compass,
    targetTab: 'ancestry',
  },
  {
    id: 'history',
    name: 'Archaic & Ancient Introgression',
    category: 'Ancestry & Population',
    description: 'Neanderthal and Denisovan introgression rates, Bronze Age Eurasian tribes, and ancient matches.',
    keywords: ['archaic', 'ancient', 'neanderthal', 'denisovan', 'introgression', 'tribes', 'iron age', 'history'],
    icon: Compass,
    targetTab: 'history',
  },

  // ─── Health & Functional ───────────────────────────────────────────────
  {
    id: 'health',
    name: 'Health & Wellness (PGx)',
    category: 'Health & Functional',
    description: 'Pharmacogenomics drug metabolism response (CYP2D6, CYP2C19) and polygenic risk scores.',
    keywords: ['health', 'pharmacogenomics', 'pgx', 'drug', 'medicine', 'metabolism', 'prs', 'risk', 'cyp450'],
    icon: HeartPulse,
    targetTab: 'health_traits',
    badge: 'Clinical',
  },
  {
    id: 'traits',
    name: 'Physical & Lifestyle Traits',
    category: 'Health & Functional',
    description: 'Predict eye color (HERC2), hair pigmentation (MC1R), freckling, bitter taste (TAS2R38), and vitamins.',
    keywords: ['traits', 'eyes', 'hair', 'pigmentation', 'freckles', 'bitter taste', 'vitamins', 'caffeine', 'sleep'],
    icon: Sparkles,
    targetTab: 'health_traits',
  },
  {
    id: 'blood',
    name: 'Blood Group Predictor',
    category: 'Health & Functional',
    description: 'Predict ABO blood group and Rhesus D (RhD) factor from ABO and RHCE genetic markers.',
    keywords: ['blood', 'abo', 'rhesus', 'rh factor', 'antigen', 'transfusion', 'blood type', 'rhd'],
    icon: Droplet,
    targetTab: 'health_traits',
  },

  // ─── Diagnostics & Tools ───────────────────────────────────────────────
  {
    id: 'markers',
    name: 'Genomic Markers Browser',
    category: 'Diagnostics & Tools',
    description: 'Search, filter, and inspect your full autosomal genotype catalog with rsID and position lookups.',
    keywords: ['markers', 'snps', 'rsid', 'variants', 'autosomal', 'browser', 'catalog', 'search', 'genotypes'],
    icon: Database,
    targetTab: 'autosomal',
  },
  {
    id: 'rare_variants',
    name: 'Rare & Unmapped Variants',
    category: 'Diagnostics & Tools',
    description: 'Identify unusual, rare, or unmapped genetic alleles evaluated against global frequencies.',
    keywords: ['rare', 'novel', 'unmapped', 'alleles', 'low frequency', 'rare variants', 'mutations'],
    icon: Zap,
    targetTab: 'rare_variants',
  },
  {
    id: 'kit_comparison',
    name: 'Kit Comparison (Multi-Kit)',
    category: 'Diagnostics & Tools',
    description: 'Side-by-side comparison of multiple kits, shared matching segments, and parental inheritance.',
    keywords: ['kit comparison', 'trio', 'parental', 'inheritance', 'compare kits', 'diff', 'shared dna'],
    icon: Users,
    targetTab: 'kit_comparison',
  },
  {
    id: 'integrity',
    name: 'File & QC Integrity Engine',
    category: 'Diagnostics & Tools',
    description: 'Cryptographic SHA-256 kit fingerprint, Ti/Tv transition ratio, call rate, and heterozygosity index.',
    keywords: ['integrity', 'qc', 'quality control', 'sha256', 'hash', 'fingerprint', 'titv', 'heterozygosity', 'contamination'],
    icon: ShieldCheck,
    targetTab: 'integrity',
    badge: 'QC Engine',
  },

  // ─── Reference & Legal ─────────────────────────────────────────────────
  {
    id: 'subpopulations',
    name: 'Subpopulations Glossary',
    category: 'Reference & Legal',
    description: 'Anthropological and demographic profiles for 80+ global reference populations.',
    keywords: ['subpopulations', 'glossary', 'populations', 'reference panels', 'demographics', 'world'],
    icon: BookOpen,
    targetTab: 'subpopulations',
  },
  {
    id: 'methodology',
    name: 'Scientific Methodology Hub',
    category: 'Reference & Legal',
    description: 'Exhaustive formulas, mathematical models, algorithms, and validation whitepapers.',
    keywords: ['methodology', 'math', 'formulas', 'algorithms', 'whitepaper', 'benchmarks', 'academic'],
    icon: BookOpen,
    targetTab: 'methodology',
  },
  {
    id: 'legal',
    name: 'Legal Terms & Microarray Errors',
    category: 'Reference & Legal',
    description: 'Review clickwrap terms of service, microarray probe error rate disclosures, and research notice.',
    keywords: ['legal', 'terms', 'disclaimer', 'microarray error', 'consent', 'privacy', 'false positive'],
    icon: Scale,
    type: 'modal',
  },
  {
    id: 'superkit',
    name: 'Superkit Maker (Merge Kits)',
    category: 'Reference & Legal',
    description: 'External open-source tool to combine multiple raw DNA kits (Ancestry, 23andMe, FTDNA, MyHeritage).',
    keywords: ['superkit', 'merge', 'combine', 'multi-vendor', 'superkit maker', 'dna merge'],
    icon: ExternalLink,
    type: 'external',
    url: 'https://merge.writteninthegenome.blog',
    badge: 'External',
  }
];

export interface ModuleIndexModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (item: IndexItem) => void;
}

export const ModuleIndexModal: React.FC<ModuleIndexModalProps> = ({
  isOpen,
  onClose,
  onSelectModule
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter items according to search query
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MODULE_DIRECTORY;

    return MODULE_DIRECTORY.filter(item => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.keywords.some(k => k.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  // Reset selected item index on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Keyboard navigation inside the index (Arrow keys, Enter, Esc)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelectModule(filteredItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose, onSelectModule]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Module & Feature Index"
        className="fixed inset-0 z-[120] flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#070809]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#16161c] to-[#0c0d10] border border-amber-500/30 rounded-2xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Header & Search Bar */}
          <div className="p-4 sm:p-5 border-b border-white/[0.08] relative">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-zinc-100 tracking-tight flex items-center gap-2">
                    <span>Module & Feature Index</span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                      Quick Jump
                    </span>
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-[10px] font-mono text-zinc-500">
                  <kbd className="px-1.5 py-0.5 bg-black/40 border border-white/10 rounded">ESC</kbd> to close
                </span>
                <button
                  onClick={onClose}
                  aria-label="Close module index"
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Input with real-time search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/80 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search modules, traits, tools, and algorithms (e.g. blood, pgx, phasing, prs)..."
                className="w-full pl-10 pr-10 py-2.5 bg-black/60 border border-amber-500/30 focus:border-amber-400/80 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Index Results List */}
          <div 
            ref={listRef}
            className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800"
          >
            {filteredItems.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <Compass className="w-10 h-10 text-zinc-600 mx-auto mb-3 opacity-60" />
                <p className="text-sm font-bold text-zinc-300">No matching module or tool found</p>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  Try searching for keywords like &quot;admixture&quot;, &quot;blood&quot;, &quot;traits&quot;, &quot;phasing&quot;, &quot;qc&quot;, or &quot;markers&quot;.
                </p>
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectModule(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    aria-label={`Jump to ${item.name}`}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 group cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 shadow-lg shadow-black/40'
                        : 'bg-black/20 border-white/[0.04] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 scale-105'
                        : 'bg-white/5 text-zinc-400 border border-white/5 group-hover:text-zinc-200'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-zinc-100 group-hover:text-amber-200 transition-colors">
                          {item.name}
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 bg-white/5 px-1.5 py-0.2 rounded border border-white/5">
                          {item.category}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="shrink-0 self-center pl-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        isSelected ? 'bg-amber-400 text-zinc-950 translate-x-0.5' : 'text-zinc-600 opacity-40 group-hover:opacity-100'
                      }`}>
                        {item.type === 'external' ? (
                          <ExternalLink className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-3 bg-black/40 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">↑</kbd>
                <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">↓</kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded flex items-center gap-0.5">
                  <CornerDownLeft className="w-2.5 h-2.5" /> Enter
                </kbd>
                <span>Select</span>
              </span>
            </div>
            <span className="text-zinc-400 font-bold">
              {filteredItems.length} Available Module{filteredItems.length === 1 ? '' : 's'}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
