import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Search, ShieldAlert, Fingerprint, Info, AlertTriangle } from 'lucide-react';

interface RareVariant {
  rsid: string;
  genotype: string;
  type: 'internal' | 'unmapped' | 'rare_allele';
  description?: string;
  globalFrequency?: number;
}

interface RareVariantsViewProps {
  variants: RareVariant[];
}

const RareVariantsView: React.FC<RareVariantsViewProps> = ({ variants }) => {
  const [activeTab, setActiveTab] = useState<'internal' | 'unmapped' | 'rare_allele'>('rare_allele');

  const internalVariants = variants.filter(v => v.type === 'internal');
  const unmappedVariants = variants.filter(v => v.type === 'unmapped');
  const rareAlleles = variants.filter(v => v.type === 'rare_allele');

  const activeVariants = activeTab === 'internal' 
    ? internalVariants 
    : activeTab === 'unmapped' ? unmappedVariants : rareAlleles;

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            Rare & Novel Variants
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Discovered {variants.length} unmapped or internally tracked variants in your dataset.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <button 
            onClick={() => setActiveTab('rare_allele')}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'rare_allele' ? 'bg-fuchsia-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Globally Rare ({rareAlleles.length})
          </button>
          <button 
            onClick={() => setActiveTab('internal')}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'internal' ? 'bg-fuchsia-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Internal ({internalVariants.length})
          </button>
          <button 
            onClick={() => setActiveTab('unmapped')}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'unmapped' ? 'bg-fuchsia-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Search className="w-3.5 h-3.5" />
            Unmapped ({unmappedVariants.length})
          </button>
        </div>
      </div>

      <div className="p-6 premium-card bg-fuchsia-50/50 dark:bg-fuchsia-900/10 border-fuchsia-100 dark:border-fuchsia-900/30 flex gap-4">
        <Info className="w-6 h-6 text-fuchsia-600 shrink-0" />
        <div>
          <h4 className="font-bold text-fuchsia-900 dark:text-fuchsia-100 mb-1">
            {activeTab === 'rare_allele' ? 'What are Globally Rare Alleles?' : activeTab === 'internal' ? 'What are Internal Variants?' : 'What are Unmapped Variants?'}
          </h4>
          <p className="text-sm text-fuchsia-800/80 dark:text-fuchsia-200/70 leading-relaxed">
            {activeTab === 'rare_allele'
              ? 'These are variants where you carry an allele that is found in less than 1% of the global population according to our 1000 Genomes reference data.'
              : activeTab === 'internal' 
              ? 'These are variants with "i" prefixes (e.g., i4000300). Microarray manufacturers like 23andMe often use internal IDs for rare or novel clinical variants (like specific BRCA mutations) that did not have an official dbSNP RSID when the chip was designed.'
              : 'These variants start with "rs" but are not currently tracked in our local ancestry or health dictionaries. We have extracted a small sample of them.'
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {activeVariants.map((variant, idx) => (
            <motion.div
              key={variant.rsid}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="premium-card p-5 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === 'internal' ? 'bg-orange-50 text-orange-600' : activeTab === 'rare_allele' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg">{variant.rsid}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Genotype: <span className="text-fuchsia-600">{variant.genotype}</span>
                    </span>
                    {activeTab === 'rare_allele' && variant.globalFrequency !== undefined && (
                       <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                         MAF: <span className="text-rose-600">{(variant.globalFrequency * 100).toFixed(2)}%</span>
                       </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {activeVariants.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 font-bold uppercase tracking-wider text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            No variants found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default RareVariantsView;
