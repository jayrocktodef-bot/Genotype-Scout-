import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Search, ShieldAlert, Fingerprint, Info, AlertTriangle } from 'lucide-react';

interface RareVariant {
  rsid: string;
  genotype: string;
  type: 'internal' | 'unmapped' | 'rare_allele';
  description?: string;
  globalFrequency?: number;
  rarity?: 'ultra_rare' | 'rare' | 'uncommon';
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
    <div className="space-y-8 animate-fade-up text-white">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            Rare & Novel Variants
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-1">
            Discovered <strong className="text-fuchsia-400 font-mono">{variants.length}</strong> unmapped or internally tracked variants in your dataset.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 shadow-inner">
          <button 
            onClick={() => setActiveTab('rare_allele')}
            className={`px-4 py-2 rounded-xl text-[10px] sm:text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'rare_allele' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Globally Rare ({rareAlleles.length})
          </button>
          <button 
            onClick={() => setActiveTab('internal')}
            className={`px-4 py-2 rounded-xl text-[10px] sm:text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'internal' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Internal ({internalVariants.length})
          </button>
          <button 
            onClick={() => setActiveTab('unmapped')}
            className={`px-4 py-2 rounded-xl text-[10px] sm:text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'unmapped' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Search className="w-3.5 h-3.5" />
            Unmapped ({unmappedVariants.length})
          </button>
        </div>
      </div>

      <div className="p-6 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-2xl sm:rounded-3xl flex gap-4 backdrop-blur-xl">
        <Info className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-extrabold text-sm text-fuchsia-200 mb-1">
            {activeTab === 'rare_allele' ? 'What are Globally Rare Alleles?' : activeTab === 'internal' ? 'What are Internal Variants?' : 'What are Unmapped Variants?'}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
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
              transition={{ delay: idx * 0.03 }}
              className="p-5 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col justify-between hover:border-fuchsia-500/30 transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${activeTab === 'internal' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : activeTab === 'rare_allele' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-base font-mono">{variant.rsid}</h3>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        Genotype: <span className="text-fuchsia-400 font-mono font-bold">{variant.genotype}</span>
                      </span>
                    </div>
                  </div>
                  {activeTab === 'rare_allele' && variant.rarity && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      variant.rarity === 'ultra_rare' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : variant.rarity === 'rare'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}>
                      {variant.rarity.replace('_', ' ')}
                    </span>
                  )}
                </div>
                {variant.description && (
                  <p className="text-xs text-slate-300 leading-relaxed mt-2 pl-1 break-words">
                    {variant.description}
                  </p>
                )}
              </div>
              {activeTab === 'rare_allele' && variant.globalFrequency !== undefined && (
                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <span>Global Allele Frequency (MAF)</span>
                  <span className="text-rose-400 text-xs font-mono font-bold">{(variant.globalFrequency * 100).toFixed(3)}%</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {activeVariants.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 font-extrabold uppercase tracking-wider text-xs bg-slate-900/40 border border-dashed border-white/10 rounded-3xl">
            No variants found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default RareVariantsView;
