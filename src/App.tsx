/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useRef, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore
import { FixedSizeList as List } from 'react-window';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { jsPDF } from "jspdf";
import { groupByCategory, CATEGORY_META, SIG_COLOR, calculateAncestryOracle, CONTINENT_META, mapToRegion, Y_DNA_TREE, MT_DNA_TREE, SNP_DB, SNP } from "./genotypeData";
import { ANCHOR_AIMS } from "./anchorAims";
import { saveResults, loadResults, clearResults } from "./services/storageService";
import { REGION_METADATA } from "./constants/regionInfo";

const LOGO_URI = "https://jequandavis.wpcomstaging.com/wp-content/uploads/2026/03/1000055020-e1773637919503.png";

const HaplogroupTreeView = memo(({ node, userPath, level = 0, searchTerm = '', testedMarkers = [] }: { 
  node: any, 
  userPath: string[], 
  level?: number, 
  searchTerm?: string,
  testedMarkers?: any[]
}) => {
  const isMatch = userPath.includes(node.branchName);
  const matchesSearch = searchTerm && node.branchName.toLowerCase().includes(searchTerm.toLowerCase());
  const [isExpanded, setIsExpanded] = useState(isMatch || level < 1 || !!matchesSearch);

  useEffect(() => {
    if (matchesSearch) setIsExpanded(true);
  }, [matchesSearch]);

  const treeMarkers = node.snp || node.mutations || [];
  const hasChildren = node.children && node.children.length > 0;

  // Optimized marker match check
  const getMarkerStatus = (m: string) => {
    const tested = testedMarkers.find(tm => (tm.marker === m || tm.mutation === m));
    if (!tested) return 'untested';
    return (tested.isDerived || tested.status === 'derived') ? 'derived' : 'ancestral';
  };

  return (
    <div className={`ml-4 border-l border-slate-200 dark:border-slate-700 pl-4 my-1 ${matchesSearch ? 'ring-2 ring-sky-500/20 rounded-r' : ''}`}>
      <div 
        className={`flex items-center gap-2 cursor-pointer group py-1.5 px-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${isMatch ? 'bg-blue-50 dark:bg-blue-900/20' : ''} ${matchesSearch ? 'bg-sky-50 dark:bg-sky-900/30' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <motion.span 
          animate={{ rotate: isExpanded ? 90 : 0 }}
          className="text-xs text-slate-400 w-4 flex justify-center"
        >
          {hasChildren ? '▶' : '•'}
        </motion.span>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${isMatch ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'} ${matchesSearch ? 'text-sky-600 dark:text-sky-400 underline decoration-sky-500/50 underline-offset-2' : ''}`}>
              {node.branchName}
            </span>
            {node.region && (
              <span 
                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${(CONTINENT_META[node.region] || CONTINENT_META["Global"]).color}20`,
                  color: (CONTINENT_META[node.region] || CONTINENT_META["Global"]).color
                }}
              >
                {node.region}
              </span>
            )}
          </div>
          {node.description && (
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{node.description}</p>
          )}
          <AnimatePresence>
            {isExpanded && treeMarkers.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-1 mt-1 overflow-hidden"
              >
                {treeMarkers.map((m: string, idx: number) => {
                  const status = getMarkerStatus(m);
                  return (
                    <span 
                      key={idx} 
                      className={`text-[9px] font-mono px-1 py-0.5 rounded transition-colors ${
                        status === 'derived' 
                          ? 'bg-blue-600 text-white font-bold ring-1 ring-blue-400 shadow-sm' 
                          : status === 'ancestral'
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 border border-slate-300 dark:border-slate-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m}
                    </span>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {node.children.map((child: any, i: number) => (
              <HaplogroupTreeView key={i} node={child} userPath={userPath} level={level + 1} searchTerm={searchTerm} testedMarkers={testedMarkers} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const HAPLO_COLORS: Record<string, string> = {
  'R1b': '#7f1d1d', 'R1a': '#be123c', 'Q': '#991b1b', 'O3': '#ea580c',
  'J': '#65a30d', 'I': '#166534', 'H': '#059669', 'G': '#0ea5e9',
  'E3b': '#1e3a8a', 'E': '#2563eb', 'A': '#4338ca', 'B': '#6d28d9',
  'C': '#7c3aed', 'D': '#db2777', 'L': '#ca8a04', 'T': '#0891b2',
};

const MT_HAPLO_COLORS: Record<string, string> = {
  'L0': '#991b1b', 'L1': '#be123c', 'L2': '#e11d48', 'L3': '#f43f5e',
  'L4': '#fb7185', 'L5': '#fda4af', 'L6': '#fecdd3', 'M': '#7c3aed',
  'N': '#2563eb', 'R': '#0ea5e9', 'H': '#0891b2', 'V': '#0d9488',
  'J': '#059669', 'T': '#16a34a', 'U': '#65a30d', 'K': '#ca8a04',
  'I': '#d97706', 'W': '#ea580c', 'X': '#dc2626',
};

const getHaploColor = (name: string, isMt: boolean = false) => {
  const map = isMt ? MT_HAPLO_COLORS : HAPLO_COLORS;
  if (map[name]) return map[name];
  for (const key in map) {
    if (name.startsWith(key)) return map[key];
  }
  return isMt ? '#f43f5e' : '#64748b';
};

const ProfileSummary = memo(({ 
  datasets, 
  activeDatasetIndex, 
  oracleResults 
}: { 
  datasets: any[], 
  activeDatasetIndex: number, 
  oracleResults: any 
}) => {
  const dataset = datasets[activeDatasetIndex];
  if (!dataset) return null;

  const yData = dataset.predictedYDNA;
  const mtData = dataset.predictedMtDNA;
  const primaryAncestry = oracleResults?.primary?.continentalScores || {};
  const topContinent = Object.entries(primaryAncestry).sort((a: any, b: any) => b[1] - a[1])[0];
  const topSubPops = Object.entries(oracleResults?.primary?.subPopulations || {})
    .flatMap(([continent, pops]: [string, any]) => pops.map((p: any) => ({ ...p, continent })))
    .sort((a: any, b: any) => b.percentage - a.percentage)
    .slice(0, 5);

  const ancestryChartData = Object.entries(primaryAncestry)
    .map(([name, value]) => ({ name, value: Number(value) }))
    .sort((a, b) => b.value - a.value);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="mb-12 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-min"
    >
      {/* Main Ancestry Card - Large */}
      <motion.div 
        variants={item}
        className="md:col-span-4 lg:col-span-4 row-span-2 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex flex-col"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-xl">🌍</div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">Ancestry Composition</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Continental Breakdown</p>
            </div>
          </div>
          <button 
            onClick={() => alert('Share functionality: Generating link/image...')}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            <span>Share</span>
            <span>📤</span>
          </button>
          {topContinent && (
            <div className="text-right">
              <div className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">Primary</div>
              <div className="text-sm font-black text-slate-900 dark:text-slate-100">{topContinent[0]}</div>
            </div>
          )}
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ancestryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ancestryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CONTINENT_META[entry.name]?.color || '#cbd5e1'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {ancestryChartData.slice(0, 5).map((entry) => (
              <div key={entry.name} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CONTINENT_META[entry.name]?.color }}></div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">{entry.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">{entry.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Paternal Lineage - Medium */}
      <motion.div 
        variants={item}
        className="md:col-span-2 lg:col-span-2 p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 shadow-sm hover:shadow-md transition-all group"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">♂️</div>
          <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-widest">Paternal Lineage</h4>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter group-hover:scale-105 transition-transform origin-left inline-block">
            {yData?.predicted?.name || 'Unknown'}
          </span>
        </div>
        <div className="text-[10px] font-bold text-indigo-600/70 dark:text-indigo-400/70 uppercase mb-4">
          {yData?.predicted?.marker ? `Haplogroup ${yData.predicted.name}` : 'No specific clade detected'}
        </div>
        <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-indigo-50 dark:border-indigo-800/20">
          <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Defining Marker</div>
          <div className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300">{yData?.predicted?.marker || 'N/A'}</div>
        </div>
      </motion.div>

      {/* Maternal Lineage - Medium */}
      <motion.div 
        variants={item}
        className="md:col-span-2 lg:col-span-2 p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 shadow-sm hover:shadow-md transition-all group"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600">♀️</div>
          <h4 className="text-xs font-bold text-rose-900 dark:text-rose-300 uppercase tracking-widest">Maternal Lineage</h4>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter group-hover:scale-105 transition-transform origin-left inline-block">
            {mtData?.predicted || 'Unknown'}
          </span>
        </div>
        <div className="text-[10px] font-bold text-rose-600/70 dark:text-rose-400/70 uppercase mb-4">
          {mtData?.region || 'Global Maternal Line'}
        </div>
        <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-rose-50 dark:border-rose-800/20">
          <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Historical Region</div>
          <div className="text-xs font-bold text-rose-700 dark:text-rose-300">{mtData?.region || 'N/A'}</div>
        </div>
      </motion.div>

      {/* Top Affinities - Medium */}
      <motion.div 
        variants={item}
        className="md:col-span-2 lg:col-span-2 row-span-2 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">🎯</div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest">Top Affinities</h4>
        </div>
        <div className="space-y-4">
          {topSubPops.length > 0 ? topSubPops.map((pop: any, idx) => (
            <div key={pop.name} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{pop.name}</span>
                <span className="text-[10px] font-mono font-bold text-amber-600">{pop.percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${pop.percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                  className="bg-amber-500 h-full rounded-full"
                />
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-slate-400 text-[10px] italic">
              Insufficient data for sub-population mapping
            </div>
          )}
        </div>
      </motion.div>

      {/* Migration Paths - Wide */}
      <motion.div 
        variants={item}
        className="md:col-span-4 lg:col-span-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sky-400">🗺️</div>
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-widest">Historical Migration Paths</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Paternal (Y-DNA)</div>
              <div className="flex flex-wrap items-center gap-2">
                {yData?.path?.map((step: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    {idx > 0 && <span className="text-slate-600 text-[8px]">→</span>}
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${idx === yData.path.length - 1 ? 'bg-sky-500 border-sky-400 text-white' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                      {step.replace("Haplogroup ", "")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Maternal (mtDNA)</div>
              <div className="flex flex-wrap items-center gap-2">
                {mtData?.path?.map((step: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    {idx > 0 && <span className="text-slate-600 text-[8px]">→</span>}
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${idx === mtData.path.length - 1 ? 'bg-rose-500 border-rose-400 text-white' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                      {step.replace("Haplogroup ", "")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

const SNPCard = memo(({ snp, isExpanded, onToggleExpand }: { snp: any, isExpanded: boolean, onToggleExpand: (rsid: string) => void }) => {
  const meta = (CATEGORY_META as any)[snp.category] || { color: "#0284c7", icon: "🧬" };
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`p-4 rounded-xl border transition-all cursor-pointer group ${snp.status === 'partial' ? 'border-amber-400 bg-amber-50/10' : ''} ${isExpanded ? 'bg-white dark:bg-slate-800 border-sky-500 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-sky-300 shadow-sm'}`}
      onClick={() => onToggleExpand(snp.rsid)}
    >
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 group-hover:bg-sky-50 dark:group-hover:bg-sky-900/30 transition-colors"
          >
            {meta.icon}
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">{snp.rsid}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${SIG_COLOR[snp.significance as keyof typeof SIG_COLOR] || 'bg-slate-100 text-slate-600'}`}>
                {snp.significance}
              </span>
            </div>
            {snp.status === 'partial' && (
              <div className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-tighter">Partial Match</div>
            )}
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{snp.trait}</h4>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Genotype</div>
            <div className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">{snp.genotype || '--'}</div>
          </div>
          <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-600' : 'text-slate-400 group-hover:text-sky-500'}`}>
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="inline-block text-[10px]"
            >
              ▼
            </motion.span>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {snp.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gene</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{snp.gene || 'N/A'}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Region</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{snp.continent}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

const AutosomalView = memo(({ 
  filteredResults, 
  groupedCategories, 
  availableCategories, 
  collapsedCategories, 
  toggleCategory, 
  expandedSnps, 
  toggleExpand,
  datasets,
  activeDatasetIndex
}: { 
  filteredResults: any[], 
  groupedCategories: Record<string, any[]>, 
  availableCategories: string[], 
  collapsedCategories: Set<string>, 
  toggleCategory: (cat: string) => void, 
  expandedSnps: Set<string>, 
  toggleExpand: (rsid: string) => void,
  datasets: any[],
  activeDatasetIndex: number
}) => {
  if (availableCategories.length === 0) return null;
  
  const allResults = datasets[activeDatasetIndex]?.results || [];
  const totalDatabaseMarkers = allResults.length || 1;
  const totalMatchedCount = allResults.filter(s => s.status === 'matched' || s.status === 'partial').length;

  return (
    <div className="animate-fade-up">
      <div className="flex flex-wrap gap-2 mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <span className="text-sm font-bold text-slate-900 dark:text-slate-100 mr-2 self-center">Matches:</span>
        {availableCategories.map(category => {
          const allSnpsInCategory = groupedCategories[category];
          const matchedCount = allSnpsInCategory.filter(s => s.status === 'matched' || s.status === 'partial').length;
          const meta = (CATEGORY_META as any)[category] || { color: "#0284c7", icon: "🧬" };
          return (
            <div key={category} className="px-3 py-1 rounded-full text-xs font-bold border" style={{ borderColor: meta.color, color: meta.color, backgroundColor: `${meta.color}10` }}>
              {meta.icon} {category}: {matchedCount}
            </div>
          );
        })}
        <div className="flex-1" />
        {datasets[activeDatasetIndex] && (
          <div className="flex items-center gap-6">
            <div className="text-right">
              <h4 className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-widest">Total SNPs</h4>
              <p className="text-sm font-mono font-bold text-sky-900 dark:text-sky-100">{datasets[activeDatasetIndex].snpCount?.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <h4 className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-widest">Database Match</h4>
              <p className="text-sm font-mono font-bold text-sky-900 dark:text-sky-100">
                {((totalMatchedCount / totalDatabaseMarkers) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        )}
      </div>

      {availableCategories.map(category => {
        const allSnpsInCategory = groupedCategories[category];
        const meta = (CATEGORY_META as any)[category] || { color: "#0284c7", icon: "🌐" };
        const isCollapsed = collapsedCategories.has(category);
        
        const total = allSnpsInCategory.length;
        const matchedCount = allSnpsInCategory.filter(s => s.status === 'matched' || s.status === 'partial').length;
        
        return (
          <div key={category} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
            <button 
              onClick={() => toggleCategory(category)}
              className="w-full p-6 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600">
                  {meta.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: meta.color }}>{category}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {matchedCount} / {total} markers matched
                  </p>
                </div>
              </div>
              <div className="text-slate-400">
                {isCollapsed ? '▼' : '▲'}
              </div>
            </button>
            
            {!isCollapsed && (
              <div className="p-6 space-y-4 bg-slate-50/30 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700">
                {category === 'Ancestry' && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-700 dark:text-amber-300 italic">
                    <strong>Important Note:</strong> DNA markers show broad regions, not specific tribes.
                  </div>
                )}
                {category === 'Ancestry' ? (
                  Object.entries(
                    allSnpsInCategory.reduce((acc: Record<string, any[]>, snp: any) => {
                      const region = mapToRegion(snp.continent);
                      if (!acc[region]) acc[region] = [];
                      acc[region].push(snp);
                      return acc;
                    }, {})
                  ).map(([region, snps]: [string, any[]]) => (
                    <div key={region} className="space-y-4 mb-8 last:mb-0">
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200 dark:border-slate-700 pb-2 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        {region} Markers
                      </h4>
                      <div className="space-y-4">
                        {snps.map((snp: any) => (
                          <SNPCard 
                            key={`${snp.markerId}-${snp.continent}`} 
                            snp={snp} 
                            isExpanded={expandedSnps.has(snp.rsid)} 
                            onToggleExpand={toggleExpand} 
                          />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  allSnpsInCategory.map((snp: any) => (
                    <SNPCard 
                      key={`${snp.markerId}-${snp.continent}`} 
                      snp={snp} 
                      isExpanded={expandedSnps.has(snp.rsid)} 
                      onToggleExpand={toggleExpand} 
                    />
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

const ChromosomePainting = ({ data, segments }: { data: Record<string, Record<string, number>>, segments?: Record<string, any[]> }) => {
  const chroms = Array.from({ length: 22 }, (_, i) => (i + 1).toString());
  
  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">🎨</div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Chromosome Painting</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Local Ancestry Inference</p>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">Segment-based mapping</div>
      </div>

      <div className="space-y-3">
        {chroms.map(chrom => {
          const chromSegments = segments?.[chrom] || [];
          const maxPos = chromSegments.length > 0 ? Math.max(...chromSegments.map(s => s.end)) : 1;
          
          return (
            <div key={chrom} className="flex items-center gap-3 group">
              <div className="w-8 text-[10px] font-black text-slate-400 group-hover:text-indigo-500 transition-colors">CH{chrom}</div>
              <div className="flex-1 h-4 bg-slate-100 dark:bg-slate-900/50 rounded-full overflow-hidden relative border border-slate-200 dark:border-slate-800 shadow-inner">
                {chromSegments.length > 0 ? chromSegments.map((seg, idx) => {
                  const meta = CONTINENT_META[seg.continent] || { color: '#94a3b8' };
                  const width = Math.max(0.5, ((seg.end - seg.start) / maxPos) * 100);
                  const left = (seg.start / maxPos) * 100;
                  
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 + (seg.confidence * 0.3) }}
                      className="absolute top-0 h-full border-r border-black/5"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        backgroundColor: meta.color,
                      }}
                      title={`${seg.continent}: ${Math.round(seg.confidence * 100)}% confidence`}
                    />
                  );
                }) : (
                  <div className="h-full w-full bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 justify-center border-t border-slate-100 dark:border-slate-800 pt-6">
        {Object.entries(CONTINENT_META).map(([name, meta]) => (
          <div key={name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: meta.color }}></div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const OracleView = memo(({ oracleResults, ancestrySnps, selectedSubPop, setSelectedSubPop }: { oracleResults: any, ancestrySnps: any[], selectedSubPop: string | null, setSelectedSubPop: (sp: string | null) => void }) => {
  const [activeOracle, setActiveOracle] = useState<'primary' | 'secondary' | 'commercial'>('primary');

  if (!oracleResults) {
    return (
      <div className="mt-12 p-6 border-2 border-indigo-200 dark:border-indigo-800/50 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 shadow-sm">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 text-center">
          Not enough data to generate an ancestry prediction.
        </div>
      </div>
    );
  }

  const currentData = activeOracle === 'primary' 
    ? oracleResults.primary 
    : activeOracle === 'secondary' 
      ? oracleResults.secondary 
      : oracleResults.commercial;
  const { continentalScores, subPopulations, chromosomeData, segments, confidenceIntervals } = currentData;
  
  if (Object.keys(continentalScores).length === 0) {
    return (
      <div className="mt-12 p-6 border-2 border-indigo-200 dark:border-indigo-800/50 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 shadow-sm">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 text-center">
          Not enough data to generate an ancestry prediction.
        </div>
      </div>
    );
  }

  const pieData = Object.entries(continentalScores).map(([name, value]) => ({
    name,
    value: Number(value)
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="mt-12 p-6 border-2 border-indigo-200 dark:border-indigo-800/50 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-400">Ancestry Oracle Prediction</h2>
        
        <div className="flex p-1 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <div className="relative group">
            <button 
              onClick={() => { setActiveOracle('primary'); setSelectedSubPop(null); }}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeOracle === 'primary' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' : 'text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300'}`}
            >
              Primary (Matched)
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 dark:bg-slate-700 text-white text-[10px] rounded-lg shadow-xl z-50 pointer-events-none border border-slate-700 dark:border-slate-600">
              Uses only RSIDs from matched ancestry traits for high-confidence inference.
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-slate-700"></div>
            </div>
          </div>
          <div className="relative group">
            <button 
              onClick={() => { setActiveOracle('secondary'); setSelectedSubPop(null); }}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeOracle === 'secondary' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' : 'text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300'}`}
            >
              Secondary (All)
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 dark:bg-slate-700 text-white text-[10px] rounded-lg shadow-xl z-50 pointer-events-none border border-slate-700 dark:border-slate-600">
              Uses all available AIMs and markers for a broader, exploratory analysis.
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-slate-700"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white/50 dark:bg-slate-800/30 rounded-lg border border-indigo-100 dark:border-indigo-800/30 text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
        {activeOracle === 'primary' ? (
          <p><strong>Primary Mode:</strong> Uses only RSIDs from matched ancestry traits for high-confidence inference based on your specific trait matches.</p>
        ) : (
          <p><strong>Secondary Mode:</strong> Uses all available AIMs (Ancestry Informative Markers) and markers in the database for a broader, more exploratory analysis.</p>
        )}
      </div>
      
      <div className="space-y-8">
        {/* Continental Admixture */}
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/30 shadow-sm">
          <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-400 uppercase tracking-wider mb-4">Continental Admixture</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-64 w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => {
                      const meta = CONTINENT_META[entry.name as keyof typeof CONTINENT_META] || { color: '#94a3b8' };
                      return <Cell key={`cell-${index}`} fill={meta.color} />;
                    })}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const meta = CONTINENT_META[data.name as keyof typeof CONTINENT_META] || { color: '#94a3b8' };
                        return (
                          <div className="bg-slate-800 p-3 rounded-lg text-xs text-white shadow-xl border border-slate-700">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }}></div>
                              <span className="font-bold">{data.name}</span>
                            </div>
                            <div className="font-mono text-lg">{(data.value as number).toFixed(1)}%</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-1/2">
              {pieData.map((entry) => {
                const meta = CONTINENT_META[entry.name as keyof typeof CONTINENT_META] || { color: '#94a3b8' };
                const ci = confidenceIntervals?.[entry.name];
                const info = REGION_METADATA[entry.name];
                return (
                  <div key={entry.name} className="relative flex flex-col p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 group">
                    {info && (
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 w-64 p-3 bg-slate-800 text-white text-[10px] rounded-lg shadow-xl border border-slate-700 pointer-events-none">
                        <p className="font-bold mb-1">Genetic Significance</p>
                        <p className="mb-2">{info.significance}</p>
                        <p className="font-bold mb-1">Migration Patterns</p>
                        <p>{info.migration}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: meta.color }}></div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{entry.name}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-500">{(entry.value as number).toFixed(1)}%</span>
                    </div>
                    {ci && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
                          <div 
                            className="absolute h-full bg-indigo-400 opacity-40" 
                            style={{ 
                              left: `${ci.low}%`, 
                              width: `${Math.max(2, ci.high - ci.low)}%` 
                            }}
                          />
                        </div>
                        <span className="text-[9px] font-mono text-slate-400">
                          {ci.low.toFixed(1)}—{ci.high.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chromosome Painting */}
        {chromosomeData && <ChromosomePainting data={chromosomeData} segments={segments} />}

        {/* Sub-population Breakdown */}
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/30 shadow-sm">
          <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-400 uppercase tracking-wider mb-4">Sub-population Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(
              ancestrySnps.reduce((acc: any, snp: any) => {
                if (snp.subPopulation) {
                  acc[snp.subPopulation] = (acc[snp.subPopulation] || 0) + 1;
                }
                return acc;
              }, {})
            )
              .map(([name, count]: [string, any]) => ({ name, count }))
              .sort((a: any, b: any) => b.count - a.count)
              .slice(0, 5)
              .map((subPop: any, idx: number) => {
                const info = REGION_METADATA[subPop.name];
                return (
                  <button 
                    key={`${subPop.name}-${idx}`} 
                    onClick={() => setSelectedSubPop(subPop.name)}
                    className={`relative p-3 rounded-lg border text-left transition-colors group ${selectedSubPop === subPop.name ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-700' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800'}`}
                  >
                    {info && (
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 w-64 p-3 bg-slate-800 text-white text-[10px] rounded-lg shadow-xl border border-slate-700 pointer-events-none">
                        <p className="font-bold mb-1">Genetic Significance</p>
                        <p className="mb-2">{info.significance}</p>
                        <p className="font-bold mb-1">Migration Patterns</p>
                        <p>{info.migration}</p>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{subPop.name}</span>
                      <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">{subPop.count} markers</span>
                    </div>
                  </button>
                );
              })
            }
          </div>
          
          {selectedSubPop && (
            <div className="mt-6 p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Top 3 markers for {selectedSubPop}:</h4>
              <div className="space-y-2">
                {(Object.values(subPopulations).flat() as any[]).find((s: any) => s.name === selectedSubPop)?.topMarkers.map((marker: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs">
                      <span className="font-mono font-bold text-sky-700 dark:text-sky-400">{marker.rsid}</span>
                      <span className="text-slate-600 dark:text-slate-300 truncate flex-1 mx-2">{marker.trait}</span>
                      <span className="font-mono text-slate-900 dark:text-slate-100">{Number(marker.contribution).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
});

const YDNAView = memo(({ yData, treeSearchTerm, setTreeSearchTerm }: { yData: any, treeSearchTerm: string, setTreeSearchTerm: (v: string) => void }) => {
  if (!yData) return null;

  const derivedMarkers = yData.testedMarkers.filter((m: any) => m.isDerived);
  const markerPieData = derivedMarkers.map((m: any) => ({
    name: m.marker,
    branch: (m.branch || 'Unknown').replace("Haplogroup ", ""),
    value: 1
  }));

  return (
    <div className="animate-fade-up space-y-6">
      {/* Main Prediction Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20 text-9xl">♂️</div>
          <div className="relative z-10">
            <h3 className="text-blue-100 font-bold uppercase tracking-widest text-xs mb-2">Paternal Lineage</h3>
            {yData.predicted ? (
              <>
                <h2 className="text-5xl font-black mb-4 tracking-tighter">{yData.predicted.name}</h2>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold shadow-sm">Marker: {yData.predicted.marker}</span>
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold shadow-sm">Region: {yData.predicted.continent}</span>
                </div>
                
                {/* Lineage Path Highlight */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-3">Predicted Paternal Path</h4>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-1">
                    {yData.path.map((step: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-1">
                        {idx > 0 && <span className="text-blue-300/50 text-[10px]">▶</span>}
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${idx === yData.path.length - 1 ? 'bg-white text-blue-700 shadow-lg' : 'bg-white/10 text-white'}`}>
                          {step.replace("Haplogroup ", "")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <h2 className="text-3xl font-bold">No haplogroup detected</h2>
            )}
          </div>
        </div>
        
        {/* Marker Distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Y-Chromosome Haplogroups</h4>
          {markerPieData.length > 0 ? (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={markerPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={1}
                      dataKey="value"
                      label={false}
                      labelLine={false}
                    >
                      {markerPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getHaploColor(entry.branch)} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-800 p-2 rounded text-[10px] text-white shadow-xl border border-slate-700">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getHaploColor(data.branch) }}></div>
                                <span className="font-bold">{data.name}</span>
                              </div>
                              <div className="text-slate-400">Branch: {data.branch}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
                <div className="col-span-2 text-[8px] text-slate-400 mb-1">
                  Showing {markerPieData.length} derived markers
                </div>
                {Array.from(new Set(markerPieData.map(m => m.branch))).slice(0, 6).map((branch) => (
                  <div key={branch as string} className="flex items-center justify-between text-[9px]">
                    <div className="flex items-center gap-1 truncate">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: getHaploColor(branch as string) }}></div>
                      <span className="text-slate-600 dark:text-slate-400 truncate">{branch as string}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-[10px] italic">
              No derived markers found
            </div>
          )}
        </div>

        {/* Description Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">About this lineage</h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4">
              {yData.predicted?.description || "This lineage is not yet in our database or has limited marker coverage."}
            </p>
          </div>
          
          {yData.predicted && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm">🧬</span>
                <div className="text-[10px] font-bold text-blue-900 dark:text-blue-300">Match Confidence</div>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1 mb-1">
                <div 
                  className="bg-blue-600 h-1 rounded-full" 
                  style={{ width: `${Math.min(100, (derivedMarkers.length / 5) * 100)}%` }}
                ></div>
              </div>
              <div className="text-[9px] text-blue-600 dark:text-blue-400 font-bold">
                {derivedMarkers.length} derived markers found
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Subclade Analysis Section */}
      {yData.predicted && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-2xl">🧬</div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Subclade Analysis</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Detailed insights into your specific paternal branch</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">Defining Marker</div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{yData.predicted.marker}</div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                This SNP (Single Nucleotide Polymorphism) defines the terminal branch of your detected lineage.
              </p>
            </div>
            
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">Lineage Depth</div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{yData.path.length} Levels</div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Your lineage has been traced through {yData.path.length} distinct phylogenetic branching points.
              </p>
            </div>
            
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">Regional Association</div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{yData.predicted.continent}</div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                This subclade is most frequently observed in populations from {yData.predicted.continent}.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
            <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 mb-2 uppercase tracking-widest">Historical Context</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
              {yData.predicted.description || "Detailed historical data for this specific subclade is currently being compiled. This branch represents a unique point in the human paternal migration story."}
            </p>
          </div>
        </div>
      )}
      
      {/* Tree and Markers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phylogenetic Tree */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">🌳</span>
              Phylogenetic Tree
            </h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Find branch or SNP..." 
                className="bg-slate-100 dark:bg-slate-900 rounded-full px-4 py-1.5 pl-9 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none border border-slate-200 dark:border-slate-700 w-full sm:w-48 transition-all"
                value={treeSearchTerm}
                onChange={(e) => setTreeSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <HaplogroupTreeView 
                node={Y_DNA_TREE} 
                userPath={yData.path} 
                searchTerm={treeSearchTerm} 
                testedMarkers={yData.testedMarkers}
              />
          </div>
        </div>

        {/* Tested Markers */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">🔬</span>
            Tested Markers
          </h3>
          <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2">
            {yData.testedMarkers.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="text-3xl mb-3">🔬</div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">No Y-DNA Markers Found</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  This is common for female users or certain DNA tests with limited Y-chromosome coverage.
                </p>
              </div>
            ) : (
              yData.testedMarkers.map((m: any, i: number) => (
                <div key={i} className={`p-4 rounded-xl border ${m.isDerived ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{m.marker}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.isDerived ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      {m.isDerived ? 'Derived' : 'Ancestral'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase mb-1">{m.trait}</div>
                  {m.description && (
                    <div className="text-[10px] text-slate-600 dark:text-slate-400 italic mb-2 leading-tight border-l-2 border-blue-200 dark:border-blue-800 pl-2">
                      {m.description}
                    </div>
                  )}
                  <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 inline-block">
                    Genotype: {m.genotype}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

const MTDNAView = memo(({ mtData, treeSearchTerm, setTreeSearchTerm }: { mtData: any, treeSearchTerm: string, setTreeSearchTerm: (val: string) => void }) => {
  if (!mtData) return null;

  const derivedMarkers = mtData.testedMarkers.filter((m: any) => m.status === 'derived');
  const markerPieData = derivedMarkers.map((m: any) => {
    // Try to find the branch name from the path if possible, or use the mutation
    const branch = (mtData.path.find((p: string) => p.includes(m.mutation)) || mtData.predicted || 'Root').replace("Haplogroup ", "");
    return {
      name: m.mutation,
      branch: branch,
      value: 1
    };
  });

  return (
    <div className="animate-fade-up space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-rose-500 to-pink-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20 text-9xl">♀️</div>
          <div className="relative z-10">
            <h3 className="text-rose-100 font-bold uppercase tracking-widest text-xs mb-2">Maternal Lineage Prediction</h3>
            {mtData.predicted ? (
              <>
                <h2 className="text-5xl font-black mb-4 tracking-tighter">{mtData.predicted}</h2>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold shadow-sm">Confidence Score: {mtData.score}</span>
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold shadow-sm">Region: {mtData.region}</span>
                </div>
                
                {/* Lineage Path Highlight */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-[10px] font-bold text-rose-200 uppercase tracking-widest mb-3">Predicted Maternal Path</h4>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-1">
                    {mtData.path.map((step: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-1">
                        {idx > 0 && <span className="text-rose-300/50 text-[10px]">▶</span>}
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${idx === mtData.path.length - 1 ? 'bg-white text-rose-700 shadow-lg' : 'bg-white/10 text-white'}`}>
                          {step.replace("Haplogroup ", "")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <h2 className="text-3xl font-bold">No haplogroup detected</h2>
            )}
          </div>
        </div>

        {/* mtDNA Marker Distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">mtDNA Marker Distribution</h4>
          {markerPieData.length > 0 ? (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={markerPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={1}
                      dataKey="value"
                      label={false}
                      labelLine={false}
                    >
                      {markerPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getHaploColor(entry.branch, true)} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-800 p-2 rounded text-[10px] text-white shadow-xl border border-slate-700">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getHaploColor(data.branch, true) }}></div>
                                <span className="font-bold">{data.name}</span>
                              </div>
                              <div className="text-slate-400">Branch: {data.branch}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
                <div className="col-span-2 text-[8px] text-slate-400 mb-1">
                  Showing {markerPieData.length} derived markers
                </div>
                {Array.from(new Set(markerPieData.map(m => m.branch))).slice(0, 6).map((branch) => (
                  <div key={branch as string} className="flex items-center justify-between text-[9px]">
                    <div className="flex items-center gap-1 truncate">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: getHaploColor(branch as string, true) }}></div>
                      <span className="text-slate-600 dark:text-slate-400 truncate">{branch as string}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-[10px] italic">
              No derived markers found
            </div>
          )}
        </div>

        {/* Description Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">About this lineage</h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4">
              {mtData.description || "This lineage is not yet in our database or has limited marker coverage."}
            </p>
          </div>
          
          {mtData.predicted && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">Primary Region</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{mtData.region}</div>
            </div>
          )}
        </div>
      </div>

      {/* mtDNA Subclade Analysis Section */}
      {mtData.predicted && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-2xl">🧬</div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Maternal Subclade Analysis</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Detailed insights into your specific mitochondrial branch</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-2">Terminal Branch</div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{mtData.predicted}</div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                This represents the most specific maternal lineage identified from your genetic markers.
              </p>
            </div>
            
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-2">Mutation Path</div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{mtData.path.length} Steps</div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Your maternal line follows a path of {mtData.path.length} key mutations since Mitochondrial Eve.
              </p>
            </div>
            
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-2">Core Region</div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{mtData.region}</div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                This maternal lineage is historically rooted in the {mtData.region} region.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-6 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50">
            <h4 className="text-xs font-bold text-rose-900 dark:text-rose-300 mb-2 uppercase tracking-widest">Historical Context</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
              {mtData.description || "Detailed historical data for this specific maternal subclade is currently being compiled. This branch represents a unique point in the human maternal migration story."}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">🌳</span>
              Phylogenetic Tree
            </h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Find branch or mutation..." 
                className="bg-slate-100 dark:bg-slate-900 rounded-full px-4 py-1.5 pl-9 text-xs font-bold focus:ring-2 focus:ring-rose-500 outline-none border border-slate-200 dark:border-slate-700 w-full sm:w-48 transition-all"
                value={treeSearchTerm}
                onChange={(e) => setTreeSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            <HaplogroupTreeView 
              node={MT_DNA_TREE} 
              userPath={mtData.path} 
              searchTerm={treeSearchTerm} 
              testedMarkers={mtData.testedMarkers}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600">🔬</span>
            Tested Markers
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Marker Details</div>
              <div className="text-[10px] text-slate-400">{mtData.testedMarkers.length} markers tested</div>
            </div>
            <div className="max-h-[600px] overflow-y-auto scrollbar-hide divide-y divide-slate-100 dark:divide-slate-700/50">
              {mtData.testedMarkers.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-3xl mb-3">🔬</div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">No mtDNA Markers Found</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    We couldn't find any mitochondrial DNA markers in your file.
                  </p>
                </div>
              ) : (
                [...mtData.testedMarkers]
                  .sort((a: any, b: any) => {
                    if (a.status === 'derived' && b.status !== 'derived') return -1;
                    if (a.status !== 'derived' && b.status === 'derived') return 1;
                    return parseInt(a.pos) - parseInt(b.pos);
                  })
                  .map((m: any, i: number) => (
                  <div key={i} className={`p-4 transition-colors ${m.status === 'derived' ? 'bg-rose-50/40 dark:bg-rose-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${m.status === 'derived' ? 'bg-rose-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{m.mutation}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${m.status === 'derived' ? 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600'}`}>
                        {m.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-white/50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                        <div className="text-[8px] text-slate-400 uppercase font-bold mb-0.5">Position</div>
                        <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300">{m.pos}</div>
                      </div>
                      <div className="bg-white/50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                        <div className="text-[8px] text-slate-400 uppercase font-bold mb-0.5">Ancestral</div>
                        <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300">{m.ancestral}</div>
                      </div>
                      <div className="bg-white/50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                        <div className="text-[8px] text-slate-400 uppercase font-bold mb-0.5">Derived</div>
                        <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300">{m.derived}</div>
                      </div>
                    </div>

                    {m.description && (
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-900/30 p-2 rounded-lg border-l-2 border-rose-400 dark:border-rose-600">
                        {m.description}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const DebugView = ({ snps, aims, activeDataset }: { snps: SNP[], aims: any[], activeDataset?: any }) => {
  const regions = ['African', 'European', 'East Asian', 'South Asian', 'Native American', 'Middle Eastern', 'Oceanian'];
  
  const counts = regions.map(region => {
    const markerCount = snps.filter(s => s.continent === region).length;
    const aimCount = aims.filter(a => a.region === region).length;
    return { region, markerCount, aimCount };
  });

  // Calculate coverage if a dataset is active
  const coverage = activeDataset ? {
    matched: activeDataset.snpCount || 0,
    total: snps.length,
    percent: ((activeDataset.snpCount || 0) / snps.length * 100).toFixed(1)
  } : null;

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Database Overview */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-2xl">📊</div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Database Distribution</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Regional marker density in the reference panel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {counts.map(c => (
            <div key={c.region} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 group hover:border-indigo-500 transition-colors">
              <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">{c.region}</div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{c.markerCount.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Markers</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{c.aimCount.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">AIMs</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Coverage */}
      {activeDataset && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-6">SNP Coverage</h4>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-slate-500 uppercase">Matched SNPs</span>
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{coverage?.matched.toLocaleString()}</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-1000" 
                style={{ width: `${coverage?.percent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Your file covers <span className="font-bold text-indigo-600 dark:text-indigo-400">{coverage?.percent}%</span> of the reference database. 
              Higher coverage typically leads to more stable ancestry predictions.
            </p>
          </div>
        </div>
      )}

      {/* System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-1">Total Database Size</div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{(snps.length + aims.length).toLocaleString()} Entries</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-1">System Status</div>
              <div className="text-xs font-bold text-emerald-500 flex items-center gap-1 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Operational
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Chip Detection</div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{activeDataset?.chip || 'No file uploaded'}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Last Update</div>
              <div className="text-xs font-mono text-slate-400">2026-04-16</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function App() {
  const [snps, setSnps] = useState<SNP[]>(SNP_DB);
  const [datasets, setDatasets] = useState<{ name: string, results: any[], chip?: string, snpCount?: number, predictedYDNA?: any, predictedMtDNA?: any }[]>([]);
  const [activeDatasetIndex, setActiveDatasetIndex] = useState(0);
  const snpMaps = useRef<Record<number, Record<string, string>>>({});
  const [statusFilter, setStatusFilter] = useState<'matched' | 'unmatched' | 'not_tested'>('matched');
  const [significanceFilter, setSignificanceFilter] = useState<string>('all');
  const [continentFilter, setContinentFilter] = useState<string>('all');
  const [geneFilter, setGeneFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [explorerSearch, setExplorerSearch] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubPop, setSelectedSubPop] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [darkMode, setDarkMode] = useState(true);
  const [expandedSnps, setExpandedSnps] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'summary' | 'autosomal' | 'oracle' | 'y-dna' | 'mt-dna' | 'debug'>('autosomal');
  const [activeCategory, setActiveCategory] = useState<string>('Health');
  const [treeSearchTerm, setTreeSearchTerm] = useState<string>('');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const expandAll = (categories: string[]) => {
    setCollapsedCategories(new Set());
  };

  const collapseAll = (categories: string[]) => {
    setCollapsedCategories(new Set(categories));
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  useEffect(() => {
    // Light mode by default
  }, []);

  const toggleExpand = useCallback((rsid: string) => {
    setExpandedSnps(prev => {
      const next = new Set(prev);
      if (next.has(rsid)) next.delete(rsid);
      else next.add(rsid);
      return next;
    });
  }, []);

  useEffect(() => {
    const saved = loadResults();
    if (saved) setDatasets(saved);
  }, []);

  const updateDatasets = (newDataset: { name: string, results: any[], chip?: string, snpCount?: number, predictedYDNA?: any, predictedMtDNA?: any }) => {
    const newDatasets = [...datasets, newDataset];
    setDatasets(newDatasets);
    saveResults(newDatasets);
    setActiveDatasetIndex(newDatasets.length - 1);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(datasets[activeDatasetIndex].results));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "genotype_results.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Genotype Scout Results", 10, 10);
    let y = 20;
    datasets[activeDatasetIndex].results?.forEach((snp: any, index: number) => {
      if (y > 280) { doc.addPage(); y = 10; }
      doc.text(`${index + 1}. ${snp.trait} (${snp.rsid}): ${snp.status}`, 10, y);
      y += 10;
    });
    doc.save("genotype_results.pdf");
  };

  const resetApp = () => {
    clearResults();
    setDatasets([]);
    setActiveDatasetIndex(0);
  };

  const processFiles = useCallback(async (files: FileList | File[]) => {
    setProcessing(true);
    setError(null);
    const fileArray = Array.isArray(files) ? files : Array.from(files);
    
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    const largeFiles = fileArray.filter(f => f.size > MAX_FILE_SIZE);
    if (largeFiles.length > 0) {
      setError(`File(s) too large: ${largeFiles.map(f => f.name).join(', ')}. Max size is 50MB.`);
      setProcessing(false);
      return;
    }

    try {
      const fileContents = await Promise.all(fileArray.map(file => {
        return new Promise<{ text: string, name: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target?.result as string;
            if (!text || text.trim().length === 0) {
              reject(new Error(`File ${file.name} is empty.`));
            } else {
              resolve({ text, name: file.name });
            }
          };
          reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
          reader.readAsText(file);
        });
      }));

      const worker = new Worker(new URL('./workers/genotypeWorker.ts', import.meta.url), { type: 'module' });
      
      worker.onmessage = (e) => {
        const { type, payload, error: workerError } = e.data;
        if (type === 'SUCCESS') {
          const newIndex = datasets.length;
          snpMaps.current[newIndex] = payload.mergedSnpMap;
          updateDatasets({ 
            name: payload.name, 
            results: payload.results,
            chip: payload.chip,
            snpCount: payload.snpCount,
            predictedYDNA: payload.predictedYDNA,
            predictedMtDNA: payload.predictedMtDNA
          });
          setPendingFiles([]);
          setProcessing(false);
          worker.terminate();
        } else {
          setError(workerError || "Processing failed in background worker.");
          setProcessing(false);
          worker.terminate();
        }
      };

      worker.onerror = (err) => {
        setError(`Worker error: ${err.message}`);
        setProcessing(false);
        worker.terminate();
      };

      worker.postMessage({ files: fileContents });
    } catch (err) {
      console.error("Processing error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred during processing.");
      setProcessing(false);
    }
  }, [datasets]);

  const results = datasets.length > 0 ? datasets[activeDatasetIndex].results : null;

  const filteredResults = useMemo(() => {
    if (!results) return [];
    return results.filter(r => 
      (r.status === statusFilter || (statusFilter === 'matched' && r.status === 'partial')) &&
      (significanceFilter === 'all' || r.significance === significanceFilter) &&
      (continentFilter === 'all' || mapToRegion(r.continent) === continentFilter) &&
      (geneFilter === 'all' || r.gene === geneFilter) &&
      (debouncedSearchTerm === '' || 
        (r.rsid?.toLowerCase() || '').includes(debouncedSearchTerm.toLowerCase()) || 
        (r.trait?.toLowerCase() || '').includes(debouncedSearchTerm.toLowerCase()) ||
        (r.gene && r.gene.toLowerCase().includes(debouncedSearchTerm.toLowerCase())))
    );
  }, [results, statusFilter, significanceFilter, continentFilter, geneFilter, debouncedSearchTerm]);

  const uniqueSignificances = useMemo(() => Array.from(new Set(results?.map(r => r.significance) || [])), [results]);
  const uniqueContinents = Object.keys(CONTINENT_META);
  const uniqueGenes = useMemo(() => Array.from(new Set(results?.map(r => r.gene) || [])), [results]);

  const oracleResults = useMemo(() => {
    if (!datasets[activeDatasetIndex]?.results) return null;
    const ancestrySnps = datasets[activeDatasetIndex].results.filter(r => r.category === 'Ancestry');
    const oracle = calculateAncestryOracle(
      ancestrySnps,
      datasets[activeDatasetIndex].predictedYDNA?.predicted?.continent,
      datasets[activeDatasetIndex].predictedMtDNA?.region
    );

    const processOracle = (data: any) => {
      const { continentalScores: rawContinentalScores, regionalScores, deepScores, subPopulations } = data;
      const continentalScores = Object.entries(rawContinentalScores).reduce((acc: Record<string, number>, [continent, score]) => {
        const region = mapToRegion(continent);
        acc[region] = (acc[region] || 0) + (score as number);
        return acc;
      }, {});
      return { continentalScores, regionalScores, deepScores, subPopulations };
    };

    return {
      primary: processOracle(oracle.primary),
      secondary: processOracle(oracle.secondary),
      commercial: processOracle(oracle.commercial)
    };
  }, [datasets, activeDatasetIndex]);

  return (
    <div className="app-container relative max-w-4xl mx-auto p-4 sm:p-6">
      <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
        <div className="text-xs font-mono text-slate-400 dark:text-slate-500">v.2</div>
        <button onClick={toggleDarkMode} className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all hover:scale-110 shadow-sm border border-slate-300 dark:border-slate-600">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <img className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-slate-200" src={LOGO_URI} alt="Logo" />
          <div>
            <div className="text-sky-600 text-[10px] sm:text-xs tracking-widest uppercase font-bold mb-1">DNA Ancestry & Trait Analyzer</div>
            <h1 className="text-3xl sm:text-4xl tracking-tighter mb-2">
              <span className="font-light text-slate-500 dark:text-slate-400">GENOTYPE</span> SCOUT
            </h1>
            <div className="flex flex-wrap gap-3 sm:gap-4 font-bold text-xs">
              <a href="https://www.facebook.com/share/g/1H4NqczNgK/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-200 transition-colors bg-sky-50 dark:bg-sky-900/30 px-2 py-1 rounded-lg border border-sky-100 dark:border-sky-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook Group
              </a>
              <a href="https://jequandavis.wordpress.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                Research Blog
              </a>
              <a href="https://paypal.me/jequandavis" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 transition-colors bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                Donate
              </a>
            </div>
          </div>
        </div>
      </header>

      {processing && (
        <div className="border-2 border-dashed border-sky-300 rounded-xl p-16 text-center bg-sky-50 dark:bg-sky-950/30">
          <div className="text-5xl mb-4 animate-spin">🧬</div>
          <div className="text-xl font-bold text-sky-900 dark:text-sky-200 mb-2">Processing your DNA file...</div>
          <div className="text-sky-700 dark:text-sky-400 text-sm font-mono mb-8">Please wait while we analyze your markers</div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <a href="https://jequandavis.wordpress.com" target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-sky-100 dark:border-sky-800 hover:border-sky-500 transition-all text-left group">
              <div className="font-bold text-sky-900 dark:text-sky-200 mb-1 group-hover:text-sky-600">Genetic Research</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Read about the latest findings in African genetic history.</div>
            </a>
            <a href="https://www.facebook.com/share/g/1H4NqczNgK/" target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-sky-100 dark:border-sky-800 hover:border-sky-500 transition-all text-left group">
              <div className="font-bold text-sky-900 dark:text-sky-200 mb-1 group-hover:text-sky-600">Community Forum</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Connect with others exploring their transatlantic roots.</div>
            </a>
          </div>
        </div>
      )}

      {!results && !processing && (
        <div className="animate-fade-up">
          <div className="upload-blurb mb-8">
            <div className="flex gap-4 mb-4 text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded-lg inline-block">
              <span>Ancestry Oracle Aims: {ANCHOR_AIMS.length.toLocaleString()}</span>
              <span>|</span>
              <span>Total Markers: {snps.length.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Welcome to Genotype Scout</h3>
              {datasets.length > 0 && (
                <button 
                  onClick={() => setActiveDatasetIndex(0)} 
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  View Previous Results <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              )}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-400 leading-relaxed">
              Genotype Scout is a privacy-first, browser-based DNA analyzer designed to help you explore your genetic heritage and health traits. 
              By analyzing your raw DNA file from services like 23andMe, AncestryDNA, or MyHeritage, we provide detailed insights into your 
              autosomal markers and a sophisticated Ancestry Oracle prediction. 
              <strong> Your data never leaves your computer; all processing happens locally in your browser.</strong>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3 animate-shake">
              <div className="text-red-500 mt-0.5">⚠️</div>
              <div className="flex-1 text-left">
                <div className="text-sm font-bold text-red-800 dark:text-red-300">Analysis Error</div>
                <div className="text-xs text-red-700 dark:text-red-400 mt-1">{error}</div>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 dark:hover:text-red-200 transition-colors"
              >
                ✕
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div
              className={`border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 sm:p-10 text-center cursor-pointer bg-white/50 dark:bg-slate-800/50 transition-all ${dragging ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20" : "hover:border-sky-500"}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { 
                e.preventDefault(); 
                setDragging(false); 
                setError(null);
                const newFiles = Array.from(e.dataTransfer.files);
                setPendingFiles(prev => [...prev, ...newFiles]);
              }}
            >
              <input ref={fileRef} type="file" className="hidden" accept=".csv,.txt" multiple onChange={(e) => {
                if (e.target.files) {
                  setError(null);
                  const newFiles = Array.from(e.target.files);
                  setPendingFiles(prev => [...prev, ...newFiles]);
                }
              }} />
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🧬</div>
              <div className="text-sm sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Primary Kit</div>
              <div className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs">Drop main file or click</div>
            </div>

            <div
              className={`border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 sm:p-10 text-center cursor-pointer bg-white/50 dark:bg-slate-800/50 transition-all ${dragging ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "hover:border-indigo-500"}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { 
                e.preventDefault(); 
                setDragging(false); 
                setError(null);
                const newFiles = Array.from(e.dataTransfer.files);
                setPendingFiles(prev => [...prev, ...newFiles]);
              }}
            >
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">➕</div>
              <div className="text-sm sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Additional</div>
              <div className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs">Add file to merge</div>
            </div>
          </div>

          {pendingFiles.length > 0 && (
            <div className="mt-6 flex flex-col items-center animate-fade-in">
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {pendingFiles.map((f, i) => (
                  <div key={i} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {f.name}
                  </div>
                ))}
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  processFiles(pendingFiles);
                  setPendingFiles([]);
                }}
                className="px-8 py-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-lg shadow-sky-200 dark:shadow-none transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
              >
                <span className="text-xl">🚀</span>
                Analyze {pendingFiles.length} Kit{pendingFiles.length > 1 ? 's' : ''}
              </button>
              <button 
                onClick={() => setPendingFiles([])}
                className="mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          )}

          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Marker Explorer</h3>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search rsid or trait..." 
                  className="bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 pl-10 text-sm font-bold w-full sm:w-64 focus:ring-2 focus:ring-sky-500 outline-none border border-slate-200 dark:border-slate-700"
                  value={explorerSearch}
                  onChange={(e) => setExplorerSearch(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
              </div>
            </div>
            
            {explorerSearch ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {snps.filter(s => 
                  (s.rsid?.toLowerCase() || '').includes(explorerSearch.toLowerCase()) || 
                  (s.trait?.toLowerCase() || '').includes(explorerSearch.toLowerCase())
                ).slice(0, 6).map(s => (
                  <div key={s.markerId} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-1.5 py-0.5 rounded">{s.rsid}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.category}</span>
                    </div>
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">{s.trait}</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{s.description}</p>
                  </div>
                ))}
                {snps.filter(s => 
                  (s.rsid?.toLowerCase() || '').includes(explorerSearch.toLowerCase()) || 
                  (s.trait?.toLowerCase() || '').includes(explorerSearch.toLowerCase())
                ).length === 0 && (
                  <div className="col-span-full p-8 text-center text-slate-400 text-sm italic">
                    No markers found matching "{explorerSearch}"
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {['Health', 'Ancestry', 'Lifestyle', 'Nutrition', 'Performance'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setExplorerSearch(cat)}
                    className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-500 transition-all text-center group"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                      {CATEGORY_META[cat as keyof typeof CATEGORY_META]?.icon || '🧬'}
                    </div>
                    <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{cat}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {results && (
        <div className="space-y-8">
          <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2 border-b border-slate-100 dark:border-slate-800">
            <button 
              className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'autosomal' ? 'bg-sky-600 text-white shadow-md scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              onClick={() => setActiveTab('autosomal')}
            >
              🧬 Autosomal DNA
            </button>
            <button 
              className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'oracle' ? 'bg-indigo-600 text-white shadow-md scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              onClick={() => setActiveTab('oracle')}
            >
              🔮 Ancestry Oracle
            </button>
            <button 
              className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'y-dna' ? 'bg-blue-600 text-white shadow-md scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              onClick={() => setActiveTab('y-dna')}
            >
              ♂️ Y-DNA
            </button>
            <button 
              className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'mt-dna' ? 'bg-rose-600 text-white shadow-md scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              onClick={() => setActiveTab('mt-dna')}
            >
              ♀️ mtDNA
            </button>
            <button 
              className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'summary' ? 'bg-amber-600 text-white shadow-md scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              onClick={() => setActiveTab('summary')}
            >
              📊 Profile Summary
            </button>
            <button 
              className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'debug' ? 'bg-slate-800 text-white shadow-md scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              onClick={() => setActiveTab('debug')}
            >
              🛠️ Debug
            </button>
          </div>

          {datasets.length > 1 && (
            <div className="flex gap-2 mb-4">
              {datasets.map((d, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${activeDatasetIndex === i ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-400'}`}
                  onClick={() => setActiveDatasetIndex(i)}
                >
                  {d.name}
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-4 mb-4 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {(['matched', 'unmatched', 'not_tested'] as const).map(status => (
                <button 
                  key={status}
                  className={`px-4 py-2 rounded-full text-sm font-bold ${statusFilter === status ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-400'}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status.replace('_', ' ').toUpperCase()}
                </button>
              ))}
              <div className="flex gap-1 ml-2">
                <button 
                  onClick={() => expandAll(['Health', 'Ancestry', 'Lifestyle', 'Nutrition', 'Performance'])}
                  className="px-3 py-2 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                >
                  EXPAND ALL
                </button>
                <button 
                  onClick={() => collapseAll(['Health', 'Ancestry', 'Lifestyle', 'Nutrition', 'Performance'])}
                  className="px-3 py-2 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                >
                  COLLAPSE ALL
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <select className="bg-slate-200 dark:bg-slate-700 rounded-full px-4 py-2 text-sm font-bold" style={{ color: '#030303' }} value={significanceFilter} onChange={(e) => setSignificanceFilter(e.target.value)}>
                <option value="all">All Significance</option>
                {uniqueSignificances.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="bg-slate-200 dark:bg-slate-700 rounded-full px-4 py-2 text-sm font-bold" style={{ color: '#111214' }} value={continentFilter} onChange={(e) => setContinentFilter(e.target.value)}>
                <option value="all">All Regions</option>
                {uniqueContinents.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="bg-slate-200 dark:bg-slate-700 rounded-full px-4 py-2 text-sm font-bold" style={{ color: '#0d0e11' }} value={geneFilter} onChange={(e) => setGeneFilter(e.target.value)}>
                <option value="all">All Genes</option>
                {uniqueGenes.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search rsid, trait, or gene..." 
                  className="bg-slate-200 dark:bg-slate-700 rounded-full px-4 py-2 pl-10 text-sm font-bold w-full sm:w-64 focus:ring-2 focus:ring-sky-500 outline-none"
                  style={{ color: '#060404' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={resetApp} className="px-4 py-2 rounded-full text-sm font-bold bg-rose-600 text-white">
                Reset
              </button>
              <button onClick={exportJSON} className="px-4 py-2 rounded-full text-sm font-bold bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900">
                Export JSON
              </button>
              <button onClick={exportPDF} className="px-4 py-2 rounded-full text-sm font-bold bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900">
                Export PDF
              </button>
            </div>
          </div>

          {activeTab === 'summary' && (
            <ProfileSummary 
              datasets={datasets} 
              activeDatasetIndex={activeDatasetIndex} 
              oracleResults={oracleResults} 
            />
          )}

          {activeTab === 'autosomal' && (
            <AutosomalView 
              filteredResults={filteredResults}
              groupedCategories={groupByCategory(filteredResults || [])}
              availableCategories={Object.keys(groupByCategory(filteredResults || []))}
              collapsedCategories={collapsedCategories}
              toggleCategory={toggleCategory}
              expandedSnps={expandedSnps}
              toggleExpand={toggleExpand}
              datasets={datasets}
              activeDatasetIndex={activeDatasetIndex}
            />
          )}

          {activeTab === 'oracle' && (
            <OracleView 
              oracleResults={oracleResults}
              ancestrySnps={datasets[activeDatasetIndex].results.filter(r => r.category === 'Ancestry')}
              selectedSubPop={selectedSubPop}
              setSelectedSubPop={setSelectedSubPop}
            />
          )}

          {activeTab === 'heatmap' && (
            <HeatmapView 
              filteredResults={filteredResults}
            />
          )}

          {activeTab === 'y-dna' && (
            <YDNAView 
              yData={datasets[activeDatasetIndex].predictedYDNA} 
              treeSearchTerm={treeSearchTerm}
              setTreeSearchTerm={setTreeSearchTerm}
            />
          )}

          {activeTab === 'mt-dna' && (
            <MTDNAView 
              mtData={datasets[activeDatasetIndex].predictedMtDNA} 
              treeSearchTerm={treeSearchTerm}
              setTreeSearchTerm={setTreeSearchTerm}
            />
          )}

          {activeTab === 'debug' && (
            <DebugView 
              snps={snps} 
              aims={ANCHOR_AIMS} 
              activeDataset={datasets[activeDatasetIndex]} 
            />
          )}

        </div>
      )}
    </div>
  );
}
