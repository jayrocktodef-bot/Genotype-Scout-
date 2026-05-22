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
      className="p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] bg-[#1a1b1d]/80 backdrop-blur-xl border border-amber-900/20 shadow-2xl relative overflow-hidden"
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
          {results.slice(0, 9).map((pop, index) => (
            <motion.div
              key={pop.popCode}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  {type === 'matches' ? <User size={20} /> : <History size={20} />}
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-black text-[#F5F6F7] leading-none mb-1">
                    {pop.score.toFixed(1)}%
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-tighter text-amber-500/70">
                    {type === 'matches' ? 'Genetic Match' : 'Affinity Score'}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-black text-[#F5F6F7] mb-1 truncate" title={pop.popName}>{pop.popName}</h3>
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase truncate">
                  <MapPin size={10} /> {pop.region}
                </div>
                <span className="text-slate-700">•</span>
                <div className="text-[9px] font-bold text-slate-500 uppercase truncate">
                  {pop.period}
                </div>
                {pop.age_bp && (
                  <>
                    <span className="text-slate-700">•</span>
                    <div className="text-[9px] font-bold text-amber-500/80 uppercase truncate">
                      {pop.age_bp.toLocaleString()} BP
                    </div>
                  </>
                )}
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed mb-4 line-clamp-3 italic">
                "{pop.description}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 truncate">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                   {pop.culture || 'Archaeological Sample'}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-600">
                    {pop.matchingMarkers} Markers
                  </span>
                  <button className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info size={14} />
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
