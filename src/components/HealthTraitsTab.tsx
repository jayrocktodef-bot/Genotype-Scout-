import React, { useState } from 'react';
import { motion } from 'motion/react';

interface HealthTraitsTabProps {
  matchedTraits: Array<{
    position: string;
    allele: string;
    traits: string[];
    status: string;
  }>;
  autosomalMarkers: any[];
}

export const HealthTraitsTab: React.FC<HealthTraitsTabProps> = ({ matchedTraits, autosomalMarkers }) => {
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'maternal' | 'autosomal'>('autosomal');

  const healthMarkers = autosomalMarkers.filter(m => 
    (m.category === 'Health' || m.category === 'Nutrition' || m.category === 'Lifestyle') &&
    (m.status === 'matched' || m.status === 'partial')
  );

  if (!acceptedDisclaimer) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto flex flex-col items-center justify-center p-12 frosted-glass border-red-500/20 text-center shadow-xl shadow-red-500/5"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-inner">
          ⚠️
        </div>
        <h2 className="text-3xl font-black text-[#F5F6F7] mb-6 tracking-tight">Health & Trait Disclosure</h2>
        <div className="space-y-4 text-slate-300 mb-10 leading-relaxed font-medium">
          <p>
            The information in this section is sourced from public databases like <strong>MITOMAP</strong> and <strong>SNPedia</strong> for educational and research purposes only.
          </p>
          <p className="p-6 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-300 text-sm">
            <strong>Medical Disclaimer:</strong> This is NOT a diagnostic tool. It is not intended to treat, cure, or prevent any disease. Always consult a qualified healthcare professional regarding genetic data or health concerns.
          </p>
        </div>
        <button 
          onClick={() => setAcceptedDisclaimer(true)}
          className="px-10 py-5 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/20"
        >
          I UNDERSTAND, VIEW MY DATA
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-10">
        <div>
          <div className="text-red-600 dark:text-red-400 text-xs tracking-[0.4em] uppercase font-black mb-3 text-center md:text-left">Genomic Wellness Profile</div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter text-center md:text-left">Health & Trait Insights</h2>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setActiveSubTab('autosomal')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'autosomal' ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm' : 'text-slate-500'}`}
          >
            Autosomal markers
          </button>
          <button 
            onClick={() => setActiveSubTab('maternal')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'maternal' ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500'}`}
          >
            Maternal Traits
          </button>
        </div>
      </div>

      {activeSubTab === 'maternal' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Mitochondrial Variants</h3>
            <span className="px-4 py-1.5 bg-rose-50 dark:bg-rose-900/20 rounded-full text-[10px] font-black text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
              {matchedTraits.length} Confirmed Matches
            </span>
          </div>
          
          {matchedTraits.length === 0 ? (
            <div className="p-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 text-center">
              <div className="text-6xl mb-6 opacity-20 grayscale">🧬</div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2">No High-Confidence Traits Detected</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">Your current mitochondrial DNA profile does not contain entries from the Confirmed MITOMAP dataset.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedTraits.map((trait, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="frosted-glass p-8 rounded-[2.5rem] border border-white/5 hover:border-red-500/50 transition-all hover:shadow-2xl hover:shadow-red-500/5 group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Genomic Position</span>
                      <span className="text-lg font-mono font-black text-slate-900 dark:text-white tracking-tight">
                        {trait.position} <span className="text-red-500">[{trait.allele}]</span>
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      trait.status.toLowerCase().includes('confirmed') 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                        : 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    }`}>
                      {trait.status}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Associated Manifestations</div>
                    <div className="flex flex-wrap gap-2">
                      {trait.traits.map((t, i) => (
                        <div key={i} className="text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">SNP Health Markers</h3>
            <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full text-[10px] font-black text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
              {healthMarkers.length} Markers Matched
            </span>
          </div>

          {healthMarkers.length === 0 ? (
            <div className="p-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 text-center">
              <div className="text-6xl mb-6 opacity-20 grayscale">🥗</div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2">No Health Markers Detected</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">Your current genetic file does not contain any specific variants associated with the health traits in our database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthMarkers.map((marker, index) => (
                <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="frosted-glass p-8 rounded-[2.5rem] border border-white/5 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/5 group"
              >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{marker.rsid}</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors">
                        {marker.trait}
                      </span>
                    </div>
                    <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                      {marker.category}
                    </div>
                  </div>

                  <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Calculated Genetic Outcome</div>
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400 whitespace-pre-wrap">
                      {marker.interpretation || "No specific outcome recorded."}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {marker.description}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

