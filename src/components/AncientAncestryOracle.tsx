import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Dna, MapPin, History, Info, User, Microscope } from 'lucide-react';

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
  if (!results || results.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 sm:p-12 rounded-2xl sm:rounded-[3rem] bg-[#1a1b1d]/80 backdrop-blur-xl border border-amber-900/20 shadow-2xl relative overflow-hidden"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5">
        <Dna size={400} className="text-amber-500 rotate-12" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.filter(x => x).map((pop, index) => (
            <motion.div
              key={`${pop.popCode || 'unknown'}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="p-6 sm:p-7 rounded-2xl bg-black/50 border border-white/10 hover:border-amber-500/40 transition-all group shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform border border-amber-500/20">
                  {type === 'matches' ? <User size={22} /> : <History size={22} />}
                </div>
                <div className="text-right">
                  <span className="block text-3xl font-black text-white leading-none mb-1 tracking-tight">
                    {(pop.score || 0).toFixed(1)}%
                  </span>
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-400/90">
                    {type === 'matches' ? 'Genetic Match' : 'Admixture Proportion'}
                  </span>
                </div>
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

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
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
        </div>

        <div className="mt-10 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex flex-col sm:flex-row items-center gap-6">
          <div className="hidden sm:block p-3 rounded-xl bg-amber-500/20 text-amber-500">
            <Microscope size={24} />
          </div>
          <p className="text-sm text-slate-400 leading-relaxed text-center sm:text-left">
            <strong className="text-amber-500 block mb-1 uppercase tracking-wider text-xs">Methodology Note</strong>
            {type === 'matches' 
              ? "Individual matches are calculated by performing a point-by-point genotype comparison between your raw data and the published SNP calls from ancient remains. High percentages indicate direct shared ancestry or recent shared founders."
              : "Historical affinity is calculated by comparing your genotype against curated reference markers from peer-reviewed ancient DNA studies (Reich, Mathieson, Haak). High scores indicate shared mutations with these specific Mesolithic and Bronze Age populations."}
          </p>
        </div>
      </div>
    </motion.div>
  );
});
