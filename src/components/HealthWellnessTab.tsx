import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HealthImpact } from '../utils/healthMatching';

interface HealthWellnessTabProps {
  impacts: HealthImpact[];
}

export const HealthWellnessTab: React.FC<HealthWellnessTabProps> = ({ impacts }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);

  const categories = ['All', ...new Set(impacts.map(i => i.category))];
  const filteredImpacts = activeCategory === 'All' 
    ? impacts 
    : impacts.filter(i => i.category === activeCategory);

  if (!acceptedDisclaimer) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 bg-slate-900 border border-slate-800 rounded-3xl text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] -mr-32 -mt-32"></div>
        <div className="text-5xl mb-6 relative z-10">⚠️</div>
        <h2 className="text-2xl font-black text-white mb-4 relative z-10 uppercase tracking-tight">Clinical Research & Educational Use Only</h2>
        
        <div className="space-y-4 text-left mb-8 relative z-10">
          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
            <p className="text-slate-300 text-sm leading-relaxed">
              <span className="font-bold text-red-400">Medical Disclaimer:</span> This report is generated for informational/educational purposes and is NOT a medical diagnosis, genetic counseling, or clinical advice. 
            </p>
          </div>
          
          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
            <p className="text-slate-300 text-sm leading-relaxed">
              <span className="font-bold text-amber-400">Environmental Factors:</span> Genetic predisposition only accounts for a fraction of your overall health profile. Lifestyle, environment, diet, and history play equally critical roles.
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
            <p className="text-slate-300 text-sm leading-relaxed">
              <span className="font-bold text-blue-400">Experimental Algorithm:</span> This tool uses open-source clinical databases and experimental matching algorithms. False positives and negatives are possible.
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-2xl border border-rose-500/30 ring-1 ring-rose-500/10">
            <p className="text-slate-300 text-sm leading-relaxed italic">
              <span className="font-bold text-rose-400">Strict Prohibitions:</span> Do NOT use this information to self-diagnose or change medication dosages. Any action taken based on this report is at your own risk.
            </p>
          </div>
        </div>

        <p className="text-slate-500 mb-8 text-[11px] leading-relaxed px-8">
          By continuing, you acknowledge that you will not use this data to make any medical decisions without consulting a qualified healthcare professional.
        </p>

        <button 
          onClick={() => setAcceptedDisclaimer(true)}
          className="w-full sm:w-auto px-12 py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-red-600/20 uppercase tracking-widest text-xs active:scale-95"
        >
          I Understand & Accept
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Health, Wellness & Traits</h2>
          <p className="text-gray-400 text-sm">Automated matching of clinical and appearance markers.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {filteredImpacts.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl text-slate-500">
          No matches found for the selected category in this dataset.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImpacts.map((item, idx) => (
            <motion.div
              key={`${item.rsid}-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase mb-1 block">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-tight">{item.trait}</h3>
                  <p className="text-xs text-slate-500 mt-1">{item.name}</p>
                </div>
                <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                  item.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                  item.impact === 'moderate' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {item.impact} {item.impact !== 'neutral' ? 'impact' : ''}
                </div>
              </div>

              <div className="mb-4 flex-1">
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 mb-3">
                  <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Your Genotype: {item.genotype}</div>
                  <p className="text-sm font-medium text-slate-200 leading-snug">
                    {item.interpretation}
                  </p>
                </div>
                {item.drugs && Array.isArray(item.drugs) && item.drugs.length > 0 && (
                  <div className="space-y-1 mb-3">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Affected Medications:</span>
                    <div className="flex flex-wrap gap-1">
                      {item.drugs.map(drug => (
                        <span key={drug} className="px-2 py-0.5 bg-slate-800 text-[10px] text-slate-400 rounded">
                          {drug}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {item.actionable && Array.isArray(item.actionable.recommendations) && (
                  <div className="space-y-1 mt-3">
                    <span className="text-[9px] font-bold text-emerald-500 uppercase">Recommendations:</span>
                    <ul className="space-y-1">
                      {item.actionable.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="text-[10px] text-slate-300 leading-tight flex items-start gap-1">
                          <span className="text-emerald-500">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.evidence && (
                  <p className="text-[10px] text-slate-500 italic mt-3">{item.evidence}</p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs font-mono text-slate-600">{item.rsid}</span>
                <button className="text-[10px] font-bold text-blue-500 hover:underline">
                  Source: SNPpedia
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
