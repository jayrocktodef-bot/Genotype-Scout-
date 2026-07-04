import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  Droplet, Eye, Activity, Map, ArrowRight, 
  Shield, HeartPulse, Sparkles, Fingerprint
} from 'lucide-react';

interface DashboardProps {
  oracleResults: any;
  populationProximity: any[];
  dataset: any;
  userSnps: Record<string, string>;
  onNavigateToTab: (tab: any, subTab?: string) => void;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  oracleResults, 
  dataset, 
  userSnps,
  onNavigateToTab,
  onReset
}) => {
  const [isChartReady, setIsChartReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsChartReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // 1. Ancestry (Continental Pie & Oracle Distance)
  const primaryAncestry = oracleResults?.primary?.continentalScores || {};
  const chartData = useMemo(() => {
    return Object.entries(primaryAncestry)
      .map(([name, value]) => ({ name, value: Math.round(Number(value) * 10) / 10 }))
      .sort((a, b) => b.value - a.value);
  }, [primaryAncestry]);
  const COLORS = ['#0d9488', '#6366f1', '#f43f5e', '#f59e0b', '#8b5cf6', '#10b981'];

  const topOracleMatch = oracleResults?.breakdown?.[0];

  // 2. Haplogroups
  const mtHaplo = dataset?.predictedMtDNA?.predicted || "Not Detected";
  const yHaplo = dataset?.predictedYDNA?.phase2?.haplogroup || dataset?.predictedYDNA?.predicted?.name || "N/A";

  // 3. Health & Traits
  const rawResults = dataset?.results || [];
  
  // Health: Get top 3 actionable/notable results
  const topHealth = useMemo(() => {
    return rawResults
      .filter((r: any) => (r.category === 'Health' || r.category === 'Pharmacogenomics') && r.status === 'matched')
      .slice(0, 3);
  }, [rawResults]);

  // Traits: Get top 3 interesting appearance/dietary traits
  const topTraits = useMemo(() => {
    return rawResults
      .filter((r: any) => (r.category === 'Trait' || r.category === 'Appearance' || r.category === 'Dietary') && r.status === 'matched')
      .slice(0, 3);
  }, [rawResults]);

  // 4. Blood Type Predictor (Lightweight summary)
  const bloodSummary = useMemo(() => {
    const r719 = userSnps["rs8176719"] || "--";
    const r746 = userSnps["rs8176746"] || "--";
    const r747 = userSnps["rs8176747"] || "--";
    const r750 = userSnps["rs8176750"] || "--";
    
    const isHomozygousO = ["DD", "--", "O/O", "-/-", "D/D"].includes(r719) || r719.split('').every((c:string) => c === '-' || c === 'D' || c === 'O');
    const hasA = r747.includes('G') || r750.includes('A') || r746.includes('G');
    const hasB = r747.includes('C') || r750.includes('G');

    let abo = "Uncertain";
    if (r719 !== "--") {
      if (isHomozygousO) abo = "Type O";
      else if (hasA && hasB) abo = "Type AB";
      else if (hasA) abo = "Type A";
      else if (hasB) abo = "Type B";
      else abo = "Type O (Likely)";
    } else if (hasA || hasB) {
      if (hasA && hasB) abo = "Type AB";
      else if (hasA) abo = "Type A";
      else if (hasB) abo = "Type B";
    }
    
    // Quick Rh inference from D antigen deletion proxy if possible
    const rh = "Predictor"; // Full Rh needs complex mapping, we just show ABO prominently
    return { abo, rh };
  }, [userSnps]);

  // 5. Ancient Matches
  const topAncientMatch = oracleResults?.ancientBreakdown?.[0] || oracleResults?.ancient?.[0];

  const greeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  return (
    <div className="space-y-6 animate-fade-up pb-20">
      <div className="flex items-center justify-between pt-2 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            System Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {greeting}, Explorer. Your genomic widgets are active.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Ancestry Hero Widget */}
        <motion.div
          onClick={() => onNavigateToTab('ancestry', 'painter')}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 premium-card p-5 cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="flex flex-col md:flex-row gap-8 items-center relative z-10 h-full">
            <div className="w-48 h-48 relative shrink-0">
              {isChartReady ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-slate-50 rounded-full animate-pulse" />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-800">{chartData[0]?.value || 0}%</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate max-w-[80px]">{chartData[0]?.name}</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xs font-black text-teal-600 uppercase tracking-[0.2em] mb-1">Global Ancestry</h3>
                <h2 className="text-2xl font-black text-slate-800 leading-tight">Continental Admixture</h2>
              </div>
              
              <div className="space-y-3">
                {chartData.slice(0, 3).map((item, idx) => (
                  <div key={item.name}>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-xs font-bold text-slate-700">{item.name}</span>
                      <span className="text-xs font-black text-teal-600">{item.value}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${item.value}%`, backgroundColor: COLORS[idx % COLORS.length] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Genetic Match (Oracle) */}
        <motion.div
          onClick={() => onNavigateToTab('ancestry', 'oracle')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card p-6 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 transition-transform group-hover:scale-110">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Closest Population</h3>
            {topOracleMatch ? (
              <>
                <h2 className="text-xl font-black text-slate-800 leading-tight mb-2">{topOracleMatch.name || topOracleMatch.subpop || topOracleMatch.population}</h2>
                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-mono font-bold">
                  Dist: {Number(topOracleMatch.distance || 0).toFixed(4)}
                </div>
              </>
            ) : (
              <p className="text-sm font-bold text-slate-500">Oracle Not Run</p>
            )}
          </div>
          <div className="mt-4 flex items-center text-indigo-600 text-xs font-black uppercase tracking-widest gap-2">
            View Oracle <ArrowRight className="w-3 h-3" />
          </div>
        </motion.div>

        {/* Haplogroups */}
        <motion.div
          onClick={() => onNavigateToTab('history', 'modern')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="premium-card p-6 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-50 flex items-center justify-center text-fuchsia-600 transition-transform group-hover:scale-110">
              <Fingerprint className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-fuchsia-500 transition-colors" />
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Terminal Haplogroups</h3>
          <div className="space-y-3">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase">Maternal (mtDNA)</span>
              <p className="text-lg font-black text-slate-800">{mtHaplo}</p>
            </div>
            {yHaplo !== "N/A" && (
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Paternal (Y-DNA)</span>
                <p className="text-lg font-black text-slate-800">{yHaplo}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Clinical Health Snapshot */}
        <motion.div
          onClick={() => onNavigateToTab('health_traits', 'wellness')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="premium-card p-6 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
              <HeartPulse className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Health Profile</h3>
          {topHealth.length > 0 ? (
            <ul className="space-y-2">
              {topHealth.map((h: any, i: number) => (
                <li key={i} className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-2 truncate">
                  <span className="text-emerald-600 mr-2">●</span>{h.phenotype}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs font-medium text-slate-500 italic">No significant health findings flagged in standard panel.</p>
          )}
        </motion.div>

        {/* Appearance & Lifestyle Traits */}
        <motion.div
          onClick={() => onNavigateToTab('health_traits', 'traits')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="premium-card p-6 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 transition-transform group-hover:scale-110">
              <Sparkles className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-pink-500 transition-colors" />
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Genetic Traits</h3>
          {topTraits.length > 0 ? (
            <ul className="space-y-2">
              {topTraits.map((t: any, i: number) => (
                <li key={i} className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-2 truncate">
                  <span className="text-pink-500 mr-2">✦</span>{t.phenotype}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs font-medium text-slate-500 italic">No specific appearance traits mapped.</p>
          )}
        </motion.div>

        {/* Blood Predictor & Ancient DNA (Split Grid) */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            onClick={() => onNavigateToTab('health_traits', 'blood')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 premium-card p-5 cursor-pointer group flex items-center justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-2 transition-transform group-hover:scale-110">
                <Droplet className="w-5 h-5" />
              </div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Blood Predictor</h3>
              <p className="text-2xl font-black text-slate-800">{bloodSummary.abo}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-red-500 transition-colors" />
          </motion.div>

          <motion.div
            onClick={() => onNavigateToTab('history', 'ancient')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2 premium-card p-5 cursor-pointer group flex items-center justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-2 transition-transform group-hover:scale-110">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Top Ancient Match</h3>
              <p className="text-lg font-black text-slate-800 truncate max-w-[200px]">
                {topAncientMatch ? (topAncientMatch.name || topAncientMatch.population) : "No Match Data"}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 transition-colors" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

