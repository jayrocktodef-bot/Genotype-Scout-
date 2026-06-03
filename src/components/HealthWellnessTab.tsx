import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { HealthImpact } from '../utils/healthMatching';
import { PGxCard } from './PGxCard';
import { SafetyDisclaimer } from './SafetyDisclaimer';
import { Loader2, Sparkles, TrendingUp, Search, Printer } from 'lucide-react';

interface HealthWellnessTabProps {
  impacts: HealthImpact[];
  userSnps: Record<string, string>;
  mode?: 'explorer' | 'analyst';
}

const getZScoreFromPercentile = (p: number) => {
  const pClamped = Math.max(0.001, Math.min(0.999, p / 100));
  const x = 2 * pClamped - 1;
  const a = 0.147;
  const logTerm = Math.log(1 - x * x);
  const term1 = 2 / (Math.PI * a) + logTerm / 2;
  const innerSqrt = term1 * term1 - logTerm / a;
  const erfInv = Math.sign(x) * Math.sqrt(Math.sqrt(innerSqrt) - term1);
  return erfInv * Math.sqrt(2);
};

export const HealthWellnessTab: React.FC<HealthWellnessTabProps> = ({ impacts = [], userSnps, mode = 'explorer' }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [healthResults, setHealthResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [expandedPrs, setExpandedPrs] = useState<Record<string, boolean>>({});
  const [medSearch, setMedSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'All' | 'High' | 'Moderate' | 'Low'>('All');

  const togglePrs = (key: string) => {
    setExpandedPrs(prev => ({ ...prev, [key]: !prev[key] }));
  };

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

  const filteredMedicationReports = useMemo(() => {
    return medicationReports.filter((report: any) => {
      const matchesSearch = 
        (report.drug || '').toLowerCase().includes(medSearch.toLowerCase()) ||
        (report.gene || '').toLowerCase().includes(medSearch.toLowerCase()) ||
        (report.insight || '').toLowerCase().includes(medSearch.toLowerCase());
      const matchesSeverity = severityFilter === 'All' || report.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [medicationReports, medSearch, severityFilter]);

  const dietaryInsights = useMemo(() => healthResults?.dietaryTraits || [], [healthResults]);

  const polygenicRisks = useMemo(() => healthResults?.polygenicRisks || null, [healthResults]);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set((impacts || []).map(i => i.category))];
    if (polygenicRisks && Object.keys(polygenicRisks).length > 0) {
      cats.push('Polygenic Risk');
    }
    if (medicationReports.length > 0) {
      cats.push('Pharmacogenomics');
    }
    if (dietaryInsights.length > 0) {
      cats.push('Dietary');
    }
    return cats;
  }, [impacts, medicationReports, dietaryInsights, polygenicRisks]);

  const filteredImpacts = (activeCategory === 'All' 
    ? impacts 
    : impacts.filter(i => i.category === activeCategory)) || [];

  const showPrs = activeCategory === 'All' || activeCategory === 'Polygenic Risk';
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
      {/* Print-Only Clinician Header */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-800 pb-4">
        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Genotype Scout - Clinical PGx & Health Report</h1>
        <p className="text-xs font-mono text-slate-500 mt-1">
          Generated: {new Date().toLocaleDateString()} | Reference Guidelines: CPIC / PharmGKB
        </p>
        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[10px] leading-relaxed text-slate-700">
          <strong>Important Clinical Notice:</strong> This report is for professional reference and genotyping validation. All annotations correspond to PGx database versions. Clinical verification is recommended prior to any therapeutic dosage adjustments.
        </div>
      </div>

      <SafetyDisclaimer />
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-1">Health, Wellness & Traits</h2>
          <p className="text-slate-600 text-sm">Automated matching of clinical and appearance markers.</p>
        </div>
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none max-w-full snap-x shrink-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 snap-start ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>


      {showPrs && polygenicRisks && Object.keys(polygenicRisks).length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <h3 className="text-[#0f172a] font-black uppercase tracking-widest text-[10px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Polygenic Risk Scores (PRS)
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(polygenicRisks).map(([key, prs]: [string, any], idx: number) => {
              const userZ = getZScoreFromPercentile(prs.percentile);
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          prs.riskCategory === 'Elevated' ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30' :
                          prs.riskCategory === 'Low' ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/30' :
                          'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700'
                        }`}>
                          {prs.riskCategory}
                        </span>
                        <h4 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-2 leading-tight">{prs.name}</h4>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium">
                      {prs.description}
                    </p>
                  </div>

                  <div>
                    {/* Z-score and Statistical Parameters Box in Analyst Mode */}
                    {mode === 'analyst' && (
                      <div className="mb-4 p-3 bg-slate-950 text-slate-350 rounded-2xl font-mono text-[9px] border border-slate-900 space-y-1.5">
                        <div className="text-teal-400 font-bold uppercase tracking-wider text-[8px]">Analyst Metrics</div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                          <div>Z-Score: <span className="text-white font-bold">{userZ.toFixed(2)}</span></div>
                          <div>Mean (μ): <span className="text-slate-400">0.00</span></div>
                          <div>Std Dev (σ): <span className="text-slate-400">1.00</span></div>
                          <div>Formula: <span className="text-slate-400">PRS = ∑(w_i * x_i)</span></div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Percentile Rank</span>
                      <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{prs.percentile.toFixed(0)}%</span>
                    </div>

                    {/* SVG Bell Curve Visualizer */}
                    <div className="relative w-full h-24 mt-2">
                      <svg viewBox="0 0 200 80" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id={`curve-grad-${key}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.05" />
                            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.05" />
                          </linearGradient>
                          <linearGradient id={`stroke-grad-${key}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="50%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#f43f5e" />
                          </linearGradient>
                        </defs>

                        <path
                          d={(() => {
                            const width = 200;
                            const height = 80;
                            const points = [];
                            const steps = 60;
                            for (let i = 0; i <= steps; i++) {
                              const pct = i / steps;
                              const z = (pct - 0.5) * 6;
                              const y = height - (height - 10) * Math.exp(-0.5 * z * z);
                              const x = pct * width;
                              points.push(`${x},${y}`);
                            }
                            return `M 0,80 L ${points.join(' L ')} L 200,80 Z`;
                          })()}
                          fill={`url(#curve-grad-${key})`}
                          stroke={`url(#stroke-grad-${key})`}
                          strokeWidth="2"
                        />

                        <line x1="100" y1="10" x2="100" y2="80" stroke="#cbd5e1" strokeDasharray="2 2" strokeWidth="1" />

                        {(() => {
                          const width = 200;
                          const height = 80;
                          const userX = (prs.percentile / 100) * width;
                          const userZScore = (prs.percentile / 100 - 0.5) * 6;
                          const userY = height - (height - 10) * Math.exp(-0.5 * userZScore * userZScore);
                          const markerColor = prs.riskCategory === 'Elevated' ? '#f43f5e' : prs.riskCategory === 'Low' ? '#10b981' : '#3b82f6';
                          return (
                            <g>
                              <line
                                x1={userX}
                                y1={userY}
                                x2={userX}
                                y2="80"
                                stroke={markerColor}
                                strokeWidth="2"
                                className="animate-pulse"
                              />
                              <circle
                                cx={userX}
                                cy={userY}
                                r="5"
                                fill={markerColor}
                                stroke="#ffffff"
                                strokeWidth="1.5"
                              />
                              <circle
                                cx={userX}
                                cy={userY}
                                r="9"
                                fill="none"
                                stroke={markerColor}
                                strokeWidth="1"
                                opacity="0.4"
                                className="animate-ping"
                              />
                            </g>
                          );
                        })()}
                      </svg>

                      <div className="flex justify-between px-1 text-[8px] font-mono text-slate-400 mt-1 uppercase tracking-wider select-none">
                        <span>Low Risk</span>
                        <span>Average</span>
                        <span>Elevated Risk</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => togglePrs(key)}
                      className="mt-4 w-full text-left py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 transition-colors flex items-center justify-between"
                    >
                      <span>{expandedPrs[key] ? 'Hide Variant details' : 'Show Variant details'}</span>
                      <span>{expandedPrs[key] ? '▲' : '▼'}</span>
                    </button>

                    {expandedPrs[key] && (
                      <div className="mt-3 space-y-4">
                        {/* Visual Contribution Waterfall Chart */}
                        <div className="space-y-2">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">
                            Variant Contribution (Waterfall Breakdown)
                          </span>
                          <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-900 max-h-48 overflow-y-auto scrollbar-thin">
                            {(() => {
                              const maxContrib = Math.max(...prs.snpsEvaluated.map((s: any) => Math.abs(s.weight * s.dosage)), 0.1);
                              return prs.snpsEvaluated.map((s: any) => {
                                const contrib = s.weight * s.dosage;
                                const pct = (Math.abs(contrib) / maxContrib) * 100;
                                return (
                                  <div key={s.rsid} className="flex items-center justify-between text-[10px] font-mono py-1 border-b border-slate-900/60 last:border-0">
                                    <div className="w-20 truncate">
                                      <span className="text-sky-400 font-bold">{s.rsid}</span>
                                      <span className="text-slate-500 text-[9px] ml-1 uppercase">({s.genotype || '--'})</span>
                                    </div>

                                    {/* Dual-sided center-aligned bar */}
                                    <div className="flex-1 px-4 relative h-3 flex items-center justify-center">
                                      <div className="absolute left-1/2 w-0.5 h-full bg-slate-800 -translate-x-1/2" />
                                      {contrib > 0 ? (
                                        <div className="absolute left-1/2 h-2 bg-rose-500/80 rounded-r" style={{ width: `${pct / 2}%` }} />
                                      ) : contrib < 0 ? (
                                        <div className="absolute right-1/2 h-2 bg-emerald-500/80 rounded-l" style={{ width: `${pct / 2}%` }} />
                                      ) : null}
                                    </div>

                                    <div className="w-14 text-right">
                                      <span className={contrib > 0 ? 'text-rose-400' : contrib < 0 ? 'text-emerald-400' : 'text-slate-500'}>
                                        {contrib > 0 ? '+' : ''}{contrib.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-900 space-y-2 max-h-40 overflow-y-auto">
                          <table className="w-full text-left text-[9px]">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                                <th className="pb-1">Marker</th>
                                <th className="pb-1">Genotype</th>
                                <th className="pb-1 text-right">Weight</th>
                                <th className="pb-1 text-right">Dosage</th>
                              </tr>
                            </thead>
                            <tbody>
                              {prs.snpsEvaluated.map((s: any) => (
                                <tr key={s.rsid} className="border-b border-slate-900 last:border-0 text-slate-400 font-mono">
                                  <td className="py-1">{s.rsid}</td>
                                  <td className="py-1 uppercase">{s.genotype}</td>
                                  <td className="py-1 text-right">{(s.weight > 0 ? '+' : '') + s.weight.toFixed(2)}</td>
                                  <td className="py-1 text-right">{s.dosage.toFixed(1)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="h-px bg-slate-200 my-8"></div>
        </section>
      )}

      {showPgx && medicationReports.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <h3 className="text-slate-900 font-black uppercase tracking-widest text-[10px]">Pharmacogenomic Alerts</h3>
            </div>
            
            {/* Med search and filters */}
            <div className="flex flex-wrap gap-2 items-center print:hidden w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0 min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search meds or genes..."
                  value={medSearch}
                  onChange={(e) => setMedSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-[11px] bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <select
                value={severityFilter}
                onChange={(e: any) => setSeverityFilter(e.target.value)}
                className="px-2 py-1.5 text-[11px] bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Priority</option>
                <option value="High">High Priority</option>
                <option value="Moderate">Moderate Priority</option>
                <option value="Low">Low Priority</option>
              </select>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Print Summary
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicationReports.map((report: any, idx: number) => (
              <motion.div
                key={`${report.drug}-${idx}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
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

            {filteredMedicationReports.length === 0 && (
              <div className="col-span-full py-8 text-center text-xs text-slate-500 italic bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                No medication safety alerts match your search or filter.
              </div>
            )}
          </div>
          <div className="h-px bg-slate-200 my-8 print:hidden"></div>
        </section>
      )}

      {showDiet && dietaryInsights.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <h3 className="text-slate-900 dark:text-slate-100 font-black uppercase tracking-widest text-[10px]">Dietary Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dietaryInsights.map((insight: any, idx: number) => (
              <motion.div
                key={`${insight.trait}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all group shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Nutrition</span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-slate-100">{insight.trait}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    🥗
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase ring-1 ring-slate-200 dark:ring-slate-700/50">
                    {insight.desc}
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-350 group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors">
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
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400">
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
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col relative shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-1 block">
            {item.category}
          </span>
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight">{item.trait}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.name}</p>
        </div>
        <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
          item.impact === 'high' ? 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400' :
          item.impact === 'moderate' ? 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400' :
          'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400'
        }`}>
          {item.impact} {item.impact !== 'neutral' ? 'impact' : ''}
        </div>
      </div>

      <div className="mb-4 flex-1">
        {revealed ? (
          <>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/60 mb-3">
              <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Your Genotype: {item.genotype}</div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">
                {item.interpretation}
              </p>
            </div>
            {item.drugs && Array.isArray(item.drugs) && item.drugs.length > 0 && (
              <div className="space-y-1 mb-3">
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase">Affected Medications:</span>
                <div className="flex flex-wrap gap-1">
                  {item.drugs.map(drug => (
                    <span key={drug} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 rounded border border-slate-200/20">
                      {drug}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {item.actionable && Array.isArray(item.actionable.recommendations) && (
              <div className="space-y-1 mt-3">
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Recommendations:</span>
                <ul className="space-y-1">
                  {item.actionable.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-[10px] text-slate-700 dark:text-slate-300 leading-tight flex items-start gap-1">
                      <span className="text-emerald-500">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
              🔒
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Sensitive Health Info Masked</p>
            <button 
              onClick={() => setRevealed(true)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-850 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-black rounded-lg transition-colors uppercase tracking-widest cursor-pointer"
            >
              Reveal Analysis
            </button>
          </div>
        )}
        {item.evidence && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500 italic mt-3">{item.evidence}</p>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center">
        <a 
          href={`https://www.snpedia.com/index.php/${item.rsid}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline"
        >
          {item.rsid}
        </a>
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
          SNPpedia
        </span>
      </div>
    </motion.div>
  );
};
