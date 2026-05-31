import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { HealthImpact } from '../utils/healthMatching';
import { PGxCard } from './PGxCard';
import { SafetyDisclaimer } from './SafetyDisclaimer';
import { Loader2 } from 'lucide-react';

interface HealthWellnessTabProps {
  impacts: HealthImpact[];
  userSnps: Record<string, string>;
}

export const HealthWellnessTab: React.FC<HealthWellnessTabProps> = ({ impacts = [], userSnps }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [healthResults, setHealthResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userSnps && Object.keys(userSnps).length > 0) {
      setLoading(true);
      const worker = new Worker(new URL('../workers/healthWorker.ts', import.meta.url), { type: 'module' });
      
      worker.onmessage = (e) => {
        const { type, payload } = e.data;
        if (type === 'HEALTH_RESULTS') {
          setHealthResults(payload);
          setLoading(false);
          worker.terminate();
        } else if (type === 'ERROR') {
          console.error("Health Worker Error:", payload);
          setLoading(false);
          worker.terminate();
        }
      };

      worker.onerror = (err) => {
        console.error("Health Worker Fatal Error:", err);
        setLoading(false);
        worker.terminate();
      };

      worker.postMessage({ type: 'ANALYZE_HEALTH', payload: { userSnps } });
    }
  }, [userSnps]);

  const medicationReports = useMemo(() => healthResults?.clinicalRisks || [], [healthResults]);

  const dietaryInsights = useMemo(() => healthResults?.dietaryTraits || [], [healthResults]);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set((impacts || []).map(i => i.category))];
    if (medicationReports.length > 0) {
      cats.push('Pharmacogenomics');
    }
    if (dietaryInsights.length > 0) {
      cats.push('Dietary');
    }
    return cats;
  }, [impacts, medicationReports, dietaryInsights]);

  const filteredImpacts = (activeCategory === 'All' 
    ? impacts 
    : impacts.filter(i => i.category === activeCategory)) || [];

  const showPgx = activeCategory === 'All' || activeCategory === 'Pharmacogenomics';
  const showDiet = activeCategory === 'All' || activeCategory === 'Dietary';

  if (loading && acceptedDisclaimer) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Analyzing Genomic Markers...</p>
      </div>
    );
  }

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
      <SafetyDisclaimer />
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-1">Health, Wellness & Traits</h2>
          <p className="text-slate-600 text-sm">Automated matching of clinical and appearance markers.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>


      {showPgx && medicationReports.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <h3 className="text-slate-900 font-black uppercase tracking-widest text-[10px]">Pharmacogenomic Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicationReports.map((report: any, idx: number) => (
              <motion.div
                key={`${report.drug}-${idx}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <PGxCard 
                  report={{
                    severity: report.severity || 'Low',
                    drug: report.drug,
                    message: report.insight,
                    gene: report.gene || 'Unknown'
                  }} 
                />
              </motion.div>
            ))}
          </div>
          <div className="h-px bg-slate-200 my-8"></div>
        </section>
      )}

      {showDiet && dietaryInsights.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <h3 className="text-slate-900 font-black uppercase tracking-widest text-[10px]">Dietary Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dietaryInsights.map((insight: any, idx: number) => (
              <motion.div
                key={`${insight.trait}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-emerald-500/30 transition-all group shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Nutrition</span>
                    <h4 className="text-xl font-black text-slate-900">{insight.trait}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                    🥗
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase ring-1 ring-slate-200">
                    {insight.desc}
                  </div>
                  <p className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                    {insight.advice}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="h-px bg-slate-200 my-8"></div>
        </section>
      )}

      {filteredImpacts.length === 0 && (!showPgx || medicationReports.length === 0) && (!showDiet || dietaryInsights.length === 0) ? (
        <div className="p-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl text-slate-500">
          No matches found for the selected category in this dataset.
        </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImpacts.map((item, idx) => (
              <HealthItemCard key={`${item.rsid}-${idx}`} item={item} idx={idx} />
            ))}
          </div>
        )
      }
    </div>
  );
};

const HealthItemCard: React.FC<{ item: HealthImpact; idx: number }> = ({ item, idx }) => {
  const [revealed, setRevealed] = useState(!item.masked);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.03 }}
      className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-slate-300 transition-all flex flex-col relative shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase mb-1 block">
            {item.category}
          </span>
          <h3 className="text-lg font-black text-slate-900 leading-tight">{item.trait}</h3>
          <p className="text-xs text-slate-500 mt-1">{item.name}</p>
        </div>
        <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
          item.impact === 'high' ? 'bg-red-100 text-red-700' :
          item.impact === 'moderate' ? 'bg-orange-100 text-orange-700' :
          'bg-green-100 text-green-700'
        }`}>
          {item.impact} {item.impact !== 'neutral' ? 'impact' : ''}
        </div>
      </div>

      <div className="mb-4 flex-1">
        {revealed ? (
          <>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-3">
              <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Your Genotype: {item.genotype}</div>
              <p className="text-sm font-medium text-slate-800 leading-snug">
                {item.interpretation}
              </p>
            </div>
            {item.drugs && Array.isArray(item.drugs) && item.drugs.length > 0 && (
              <div className="space-y-1 mb-3">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Affected Medications:</span>
                <div className="flex flex-wrap gap-1">
                  {item.drugs.map(drug => (
                    <span key={drug} className="px-2 py-0.5 bg-slate-100 text-[10px] text-slate-600 rounded">
                      {drug}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {item.actionable && Array.isArray(item.actionable.recommendations) && (
              <div className="space-y-1 mt-3">
                <span className="text-[9px] font-bold text-emerald-600 uppercase">Recommendations:</span>
                <ul className="space-y-1">
                  {item.actionable.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-[10px] text-slate-700 leading-tight flex items-start gap-1">
                      <span className="text-emerald-500">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              🔒
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Sensitive Health Info Masked</p>
            <button 
              onClick={() => setRevealed(true)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-black rounded-lg transition-colors uppercase tracking-widest"
            >
              Reveal Analysis
            </button>
          </div>
        )}
        {item.evidence && (
          <p className="text-[10px] text-slate-400 italic mt-3">{item.evidence}</p>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
        <a 
          href={`https://www.snpedia.com/index.php/${item.rsid}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs font-mono text-blue-600 hover:underline"
        >
          {item.rsid}
        </a>
        <span className="text-[10px] font-bold text-slate-400">
          SNPpedia
        </span>
      </div>
    </motion.div>
  );
};
