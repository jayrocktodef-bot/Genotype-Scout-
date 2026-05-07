/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useRef, useEffect, useMemo, memo } from "react";
import JSZip from 'jszip';
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp } from 'lucide-react';
// @ts-ignore
import { FixedSizeList as List } from 'react-window';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { jsPDF } from "jspdf";
import { groupByCategory, CATEGORY_META, SIG_COLOR, calculateAncestryOracle, CONTINENT_META, mapToRegion, Y_DNA_TREE, MT_DNA_TREE, SNP_DB, SNP, identifyEndogamy, getPrivateSNPs } from "./genotypeData";
import { ANCHOR_AIMS } from "./anchorAims";
import { saveResults, loadResults, clearResults } from "./services/storageService";
import { REGION_METADATA } from "./constants/regionInfo";
import { calculateAncientAffinity } from "./utils/ancientMatching";
import { calculateFamousMatches } from "./utils/individualMatching";
import { matchHealthAndWellness } from "./utils/healthMatching";
import { calculatePopulationProximity } from "./utils/populationComparison";
import { calculateMarkerBenchmarks } from "./utils/markerBenchmarks";
import { calculateFileIntegrity } from "./utils/statistics/qualityControl";
import { applyConfidenceIntervals } from "./utils/statistics/admixtureRigor";
import { AncientCulturesTab } from "./components/AncientCulturesTab";
import { FamousMatches } from "./components/FamousMatches";
import { HealthWellnessTab } from "./components/HealthWellnessTab";
import { PopulationComparisonTab } from "./components/PopulationComparisonTab";
import { MarkerBenchmarks } from "./components/MarkerBenchmarks";

import { BloodTypeView } from "./components/BloodTypeView";
import { HealthTraitsTab } from "./components/HealthTraitsTab";
import { ModernAncestryOracle } from "./components/ModernAncestryOracle";
import { Chromosome1Oracle } from "./components/Chromosome1Oracle";
import { AncientAncestryOracle } from "./components/AncientAncestryOracle";
import { calculateAncientAdmixture, calculateIndividualMatches } from "./lib/AncientAdmixtureCalculator";
import { calculateEthnicity, calculateProAncestry } from "./utils/admixtureCalculator";
import { getPopFrequencies } from "./data/GenomicDataService";
import mitoTraits from "./data/mitochondrial/mito_traits.json";

const LOGO_URI = "https://jequandavis.wpcomstaging.com/wp-content/uploads/2026/03/1000055020-e1773637919503.png";
const VERSION = "3.4.0-BETA";

const HaplogroupTreeView = memo(({ node, userPath, level = 0, searchTerm = '', testedMarkers = [] }: { 
  node: any, 
  userPath: string[], 
  level?: number, 
  searchTerm?: string,
  testedMarkers?: any[]
}) => {
  const isMatch = userPath.includes(node.branchName);
  const matchesSearch = searchTerm && node.branchName.toLowerCase().includes(searchTerm.toLowerCase());
  const [isExpanded, setIsExpanded] = useState(true);

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
          {node.historicalContext && isExpanded && (
            <p className="text-[9px] text-rose-600 dark:text-rose-400 mt-1 italic border-l border-rose-200 dark:border-rose-800 pl-2 leading-tight">
              {node.historicalContext}
            </p>
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
  oracleResults,
  populationProximity,
  healthImpacts = []
}: { 
  datasets: any[], 
  activeDatasetIndex: number, 
  oracleResults: any,
  populationProximity: any[],
  healthImpacts?: any[]
}) => {
  const dataset = datasets[activeDatasetIndex];
  if (!dataset) return null;

  const yData = dataset.predictedYDNA || { predicted: null, path: [], testedMarkers: [] };
  const mtData = dataset.predictedMtDNA || { predicted: null, path: [], testedMarkers: [] };
  const primaryAncestry = oracleResults?.primary?.continentalScores || {};
  const subPopulations = oracleResults?.primary?.subPopulations || {};
  const topProximity = populationProximity.slice(0, 3);
  
  const ancestryChartData = Object.entries(primaryAncestry)
    .map(([name, value]) => ({ name, value: Number(value) }))
    .sort((a, b) => b.value - a.value);

  const findHaplogroupNode = (name: string, node: any = MT_DNA_TREE): any | null => {
    if (node.branchName === name) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findHaplogroupNode(name, child);
        if (found) return found;
      }
    }
    return null;
  };

  const enrichedMtPath = useMemo(() => {
    return mtData.path.map((step: string) => {
      const node = findHaplogroupNode(step);
      return {
        name: step,
        region: node?.region || "Unknown",
        description: node?.description || ""
      };
    });
  }, [mtData.path]);

  const markerSummary = useMemo(() => {
    const snpMap = dataset?.snps || {};
    const validCount = Object.keys(snpMap).length;
    const totalCount = dataset?.snpCount || validCount;
    
    // Calculate integrity using local data mapping (simulating the array expected by utility)
    const callRate = totalCount > 0 ? (validCount / totalCount) * 100 : 0;
    const integrity = {
      callRate: callRate.toFixed(2),
      isReliable: callRate > 98,
      status: callRate > 99 ? "High-Fidelity" : "Low-Quality"
    };
    
    // Quick panel check for summary
    const panels = [
      { name: 'GRAF-10k', count: 10000 },
      { name: 'Forensic AIMs', count: 180 },
      { name: 'Regional Panel', count: 111 }
    ];
    
    return {
      integrity,
      panels: panels.map(p => ({
        ...p,
        detected: Object.keys(snpMap).filter(k => k.toLowerCase().startsWith('rs')).length 
      }))
    };
  }, [dataset]);

  const statisticalInsights = useMemo(() => {
    const stats = oracleResults?.statistical;
    if (!stats || !stats.results) return null;

    const markersUsed = stats.markersUsed || 100;
    return Object.entries(stats.results).map(([pop, percentage]) => {
      const confidence = applyConfidenceIntervals(Number(percentage), markersUsed);
      return { pop, percentage, ...confidence };
    });
  }, [oracleResults]);

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
      className="mb-12 grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      {/* Ancestry & Affinities Consolidation - Bento Large */}
      <motion.div 
        variants={item}
        className="lg:col-span-8 p-6 sm:p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Ancestry Overview</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Continental Admixture & Regional Affinities</p>
          </div>
          <button 
            onClick={() => alert('Share functionality: Generating link/image...')}
            className="p-2 sm:px-5 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 print:hidden shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95"
          >
            <span className="hidden sm:inline">Share Profile</span>
            <span className="text-sm">📤</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {/* Radar Chart */}
          <div className="h-[260px] flex items-center justify-center bg-slate-50/80 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 relative group">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={ancestryChartData}>
                <PolarGrid stroke="#e2e8f0" strokeOpacity={0.5} />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Ancestry"
                  dataKey="value"
                  stroke="#4599FF"
                  fill="#4599FF"
                  fillOpacity={0.3}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '16px', color: '#0f172a', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Top Affinities */}
          <div className="flex flex-col justify-center space-y-5">
            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <div className="w-4 h-px bg-slate-200 dark:bg-slate-800"></div>
              Top Regional Affinities
            </div>
            {topProximity.length > 0 ? topProximity.map((pop: any, idx) => (
              <div key={pop.code} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight">Pop. {idx + 1}</span>
                    <span className="text-sm font-black text-slate-900 dark:text-slate-100">{pop.name}</span>
                  </div>
                  <span className="text-sm font-mono font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-lg">{pop.similarity.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${pop.similarity}%` }}
                    transition={{ duration: 1.2, ease: "circOut", delay: 0.3 + idx * 0.1 }}
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full"
                  />
                </div>
              </div>
            )) : <div className="text-slate-500 italic text-xs text-center py-8">Insufficient deep-ancestry markers detected.</div>}

            {statisticalInsights && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">95% Confidence Intervals</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded uppercase">Statistical Rigor Active</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {statisticalInsights.slice(0, 4).map((insight: any, i: number) => (
                    <div key={i} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50">
                      <div className="flex justify-between text-[9px] font-bold text-slate-500 mb-1">
                        <span>{insight.pop}</span>
                        <span className="text-blue-500">{insight.percentage}%</span>
                      </div>
                      <div className="text-[8px] text-slate-400 font-medium">Range: {insight.low}% – {insight.high}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </motion.div>

      {/* Haplogroup Quick Cards */}
      <motion.div 
        variants={item}
        className="lg:col-span-4 grid grid-cols-1 gap-6"
      >
        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_70%)] pointer-events-none"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Paternal Lineage</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Y-DNA</h4>
            </div>
            <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">♂️</div>
          </div>
          <div className="mt-4 relative z-10 flex items-end justify-between">
            <div>
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight mb-1">
                {yData?.predicted?.name || 'Unknown'}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{yData?.predicted?.continent || 'Global'}</p>
            </div>
            {yData?.predicted?.name && (
              <div className="text-5xl font-black opacity-10 select-none pointer-events-none transform translate-y-2">
                {yData.predicted.name[0]}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.05),transparent_70%)] pointer-events-none"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Maternal Lineage</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">mtDNA</h4>
            </div>
            <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">♀️</div>
          </div>
          <div className="mt-4 relative z-10 flex items-end justify-between">
            <div>
              <div className="text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight mb-1">
                {mtData?.predicted || 'Unknown'}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{mtData?.region || 'Global'}</p>
            </div>
            {mtData?.predicted && (
              <div className="text-5xl font-black opacity-10 select-none pointer-events-none transform translate-y-2">
                {mtData.predicted[0]}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Migration Paths - Full Width Modernized */}
      <motion.div 
        variants={item}
        className="lg:col-span-12 p-8 sm:p-10 rounded-[2.5rem] bg-slate-950 text-white shadow-2xl overflow-hidden relative border border-slate-800"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-600/5 blur-[120px] rounded-full -ml-64 -mb-64"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 relative z-10 gap-4">
          <div>
            <h4 className="text-xl font-black tracking-tight flex items-center gap-3">
              <span className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 shadow-inner">🗺️</span>
              Historical Migration Trajectories
            </h4>
            <div className="flex items-center gap-4 mt-2 ml-14">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Deep Ancestry Analysis</p>
              <div className="h-1 w-1 rounded-full bg-slate-700"></div>
              <p className="text-[10px] text-sky-500 font-bold uppercase tracking-[0.2em]">Validated by {markerSummary.panels[0].detected}+ Marker Overlap</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Call Rate</span>
              <span className={`text-xs font-mono font-black ${markerSummary.integrity.isReliable ? 'text-emerald-400' : 'text-amber-400'}`}>
                {markerSummary.integrity.callRate}%
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 px-4 py-2 bg-slate-900/50 rounded-full border border-slate-800/50">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              LIVE LINEAGE TRACKING
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xs font-black text-blue-400">♂</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paternal Timeline</div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-6">
              {yData?.path?.map((step: string, idx: number) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="flex flex-col items-center">
                    <motion.div 
                      whileHover={{ scale: 1.1, backgroundColor: '#3b82f6' }}
                      className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${idx === yData.path.length - 1 ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                    >
                      {step.replace("Haplogroup ", "")}
                    </motion.div>
                  </div>
                  {idx < yData.path.length - 1 && (
                    <div className="w-4 h-px bg-slate-800 group-hover:bg-blue-500/50 transition-colors"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-xs font-black text-rose-400">♀</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maternal Timeline</div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-6">
              {mtData?.path?.map((step: string, idx: number) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="flex flex-col items-center">
                    <motion.div 
                      whileHover={{ scale: 1.1, backgroundColor: '#f43f5e' }}
                      className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${idx === mtData.path.length - 1 ? 'bg-rose-600 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                    >
                      {step.replace("Haplogroup ", "")}
                    </motion.div>
                  </div>
                  {idx < mtData.path.length - 1 && (
                    <div className="w-4 h-px bg-slate-800 group-hover:bg-rose-500/50 transition-colors"></div>
                  )}
                </div>
              ))}
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
  expandedCategories, 
  toggleCategory, 
  expandedSnps, 
  toggleExpand,
  datasets,
  activeDatasetIndex
}: { 
  filteredResults: any[], 
  groupedCategories: Record<string, any[]>, 
  availableCategories: string[], 
  expandedCategories: Set<string>, 
  toggleCategory: (cat: string) => void, 
  expandedSnps: Set<string>, 
  toggleExpand: (rsid: string) => void,
  datasets: any[],
  activeDatasetIndex: number
}) => {
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());

  if (availableCategories.length === 0) return null;
  
  const allResults = datasets[activeDatasetIndex]?.results || [];
  const totalDatabaseMarkers = allResults.length || 1;
  const totalMatchedCount = allResults.filter(s => s.status === 'matched' || s.status === 'partial').length;

  const toggleRegion = (region: string) => {
    setExpandedRegions(prev => {
      const next = new Set(prev);
      if (next.has(region)) next.delete(region);
      else next.add(region);
      return next;
    });
  };

  const isRegionExpanded = (region: string) => expandedRegions.has(region);

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
        const isExpanded = expandedCategories.has(category);
        
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
                {isExpanded ? '▲' : '▼'}
              </div>
            </button>
            
            {isExpanded && (
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
                  ).sort((a: any, b: any) => {
                    // Sort by matched count descending
                    const aMatched = a[1].filter((s: any) => s.status === 'matched' || s.status === 'partial').length;
                    const bMatched = b[1].filter((s: any) => s.status === 'matched' || s.status === 'partial').length;
                    return bMatched - aMatched;
                  }).map(([region, snps]: [string, any[]]) => {
                    const matchedInRegion = snps.filter((s: any) => s.status === 'matched' || s.status === 'partial').length;
                    const regionExpanded = isRegionExpanded(region);
                    const regionMeta = (CONTINENT_META as any)[region] || { color: '#64748b' };

                    return (
                      <div key={region} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 mb-4 shadow-sm">
                        <button 
                          onClick={() => toggleRegion(region)}
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black" style={{ backgroundColor: regionMeta.color }}>
                              {region[0]}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-slate-100">{region}</h4>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {matchedInRegion} / {snps.length} Identifiers
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="hidden sm:flex -space-x-1 overflow-hidden">
                              {snps.slice(0, 5).map((s: any, i: number) => (
                                <div key={i} className={`w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-[7px] font-bold ${s.status === 'matched' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                  {s.genotype[0]}
                                </div>
                              ))}
                              {snps.length > 5 && <div className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 flex items-center justify-center text-[7px] font-bold text-slate-400">+{snps.length - 5}</div>}
                            </div>
                            <span className="text-slate-400">{regionExpanded ? '－' : '＋'}</span>
                          </div>
                        </button>
                        
                        {regionExpanded && (
                          <div className="p-4 pt-0 space-y-4 border-t border-slate-50 dark:border-slate-700/50 mt-2">
                            <div className="grid grid-cols-1 gap-4 mt-2">
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
                        )}
                      </div>
                    );
                  })
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

const CHROMOSOME_LENGTHS: Record<string, number> = {
  "1": 248956422, "2": 242193529, "3": 198295559, "4": 190214555, "5": 181538259,
  "6": 170805979, "7": 159345973, "8": 145138636, "9": 138394717, "10": 133797422,
  "11": 135086622, "12": 133275309, "13": 114364328, "14": 107043718, "15": 101991189,
  "16": 90338345, "17": 83257441, "18": 80373285, "19": 58617616, "20": 64444167,
  "21": 46709983, "22": 50818468
};

const SubpopulationAffinity = ({ oracleResults }: { oracleResults: any }) => {
  const subPopulations = oracleResults?.primary?.subPopulations || {};
  const allPops = Object.values(subPopulations).flat()
    .sort((a: any, b: any) => a.distance - b.distance) // Sort by distance ascending (closer first)
    .slice(0, 5);
  
  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">🧬</div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Subpopulation Affinity</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Similarity to reference populations</p>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">Euclidean Distance Analysis</div>
      </div>

      <div className="space-y-6">
        {allPops.length > 0 ? allPops.map((pop: any, idx) => {
          // Calculate a "Closeness" percentage for the progress bar based on distance
          // Distance < 2 is very close, > 10 is far.
          const maxDistance = 20;
          const closeness = Math.max(0, 100 - (pop.distance / maxDistance) * 100);
          
          return (
            <motion.div 
              key={pop.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-2 group"
            >
              <div className="flex justify-between items-end">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 w-4">{idx + 1}</span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">{pop.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Distance</div>
                    <div className="text-sm font-mono font-black text-slate-700 dark:text-slate-300">{(pop.distance || 0).toFixed(3)}</div>
                  </div>
                </div>
              </div>
              <div className="relative h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${closeness}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 + idx * 0.1 }}
                  className={`absolute top-0 left-0 h-full rounded-full ${
                    pop.distance < 3 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
                    pop.distance < 6 ? 'bg-blue-500' : 'bg-slate-400'
                  }`}
                />
              </div>
            </motion.div>
          );
        }) : (
          <div className="py-12 text-center">
            <div className="text-4xl mb-4 opacity-20">📡</div>
            <p className="text-sm text-slate-400 font-medium">Insufficient informative markers to calculate affinities.</p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
        <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
          * Euclidean distance measures the statistical gap between your profile and reference population datasets. 
          Values under <strong>3.0</strong> indicate very close affinity, while values above <strong>8.0</strong> suggest more distant matching.
        </p>
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
  const { continentalScores, regionalScores, deepScores, subPopulations, chromosomeData, segments, confidenceIntervals } = currentData;
  const endogamyScore = useMemo(() => identifyEndogamy(segments), [segments]);
  
  if (Object.keys(continentalScores).length === 0) {
    return (
      <div className="mt-12 p-6 border-2 border-indigo-200 dark:border-indigo-800/50 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 shadow-sm">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 text-center">
          Not enough data to generate an ancestry prediction.
        </div>
      </div>
    );
  }

  const pieData = useMemo(() => Object.entries(continentalScores).map(([name, value]) => ({
    name,
    value: Number(value)
  })).sort((a, b) => b.value - a.value), [continentalScores]);

  const topGranular = useMemo(() => Object.values(subPopulations).flat()
    .sort((a: any, b: any) => b.percentage - a.percentage)
    .slice(0, 3), [subPopulations]);

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
                    {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CONTINENT_META[entry.name as keyof typeof CONTINENT_META]?.color || '#4599FF'} />
                  ))}
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
                  <div className="font-mono text-lg">{((data.value as number) || 0).toFixed(1)}%</div>
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
                      <span className="text-xs font-mono font-bold text-slate-500">{((entry.value as number) || 0).toFixed(1)}%</span>
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
                          {(ci.low || 0).toFixed(1)}—{(ci.high || 0).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

{/* Remove continent sub-population div */}
          </div>
        </div>

        {/* Regional Heritage - Granular Analysis */}
        {topGranular.length > 0 && (
          <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/30 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🗺️</span>
              <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-400 uppercase tracking-wider">Regional Heritage (Granular)</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topGranular.map((pop: any) => (
                <div key={pop.name} className='flex flex-col p-3 rounded-lg border bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/20'>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider line-clamp-1">{pop.name}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-lg font-black text-slate-900 dark:text-slate-100">{(pop.percentage || 0).toFixed(2)}%</span>
                     <span className="text-[9px] font-mono font-bold text-slate-500" title="Euclidean Distance">{(pop.distance || pop.dist || 0).toFixed(3)} D</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subpopulation Affinity */}
        <SubpopulationAffinity oracleResults={oracleResults} />

        {/* Endogamy Indicator */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">Endogamy Detection</h3>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1">Based on contiguous segment analysis</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black ${endogamyScore > 150 ? 'bg-red-500 text-white' : endogamyScore > 50 ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
              {endogamyScore > 150 ? 'High' : endogamyScore > 50 ? 'Moderate' : 'Low'}
            </span>
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">{(endogamyScore || 0).toFixed(0)} Index</span>
          </div>
        </div>
      </div>
    </div>
  );
});

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].color || payload[0].fill }}></div>
          <p className="text-xs font-black text-white">{data.name || data.mutation}</p>
        </div>
        {data.branch && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{data.branch}</p>}
        {data.value !== undefined && data.name !== data.mutation && (
          <p className="text-[10px] text-slate-300 mt-1 italic">Contribution: {data.value}</p>
        )}
      </div>
    );
  }
  return null;
};

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
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
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
        
        {/* Combined Paternal Heritage Card */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
           <div className="md:col-span-5 lg:col-span-4">
             <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Haplogroup Distribution</h4>
             {markerPieData.length > 0 ? (
               <div className="h-[220px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={markerPieData}
                       cx="50%"
                       cy="50%"
                       innerRadius={45}
                       outerRadius={75}
                       paddingAngle={1}
                       dataKey="value"
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
             ) : (
               <div className="h-[220px] flex items-center justify-center text-slate-400 italic text-xs">No markers</div>
             )}
             <div className="mt-4 flex flex-wrap gap-2">
                {Array.from(new Set(markerPieData.map(m => m.branch))).slice(0, 4).map((branch) => (
                   <span key={branch as string} className="px-2 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg text-[9px] font-bold border border-slate-100 dark:border-slate-800">
                     {branch as string}
                   </span>
                ))}
             </div>
           </div>

           <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center h-full space-y-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 group hover:border-indigo-400 transition-colors">
                   <div className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mb-2">Defining SNP</div>
                   <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{yData.predicted?.marker}</div>
                </div>
                <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 group hover:border-indigo-400 transition-colors">
                   <div className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mb-2">Path Depth</div>
                   <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{yData.path.length} Steps</div>
                </div>
             </div>

             <div className="p-6 rounded-2xl bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[12px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                   <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                   Lineage Support Confidence
                </div>
                <div className="text-lg font-black text-blue-700 dark:text-blue-300">
                  {derivedMarkers.length} Derived Markers
                </div>
             </div>
           </div>
        </div>
      </div>
      
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

        {/* ISOGG Analysis */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3 mb-6 relative z-10">
            <span className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">🧬</span>
            ISOGG Database Analysis
          </h3>
          
          <div className="flex-1 overflow-y-auto max-h-[500px] space-y-3 relative z-10 pr-2 custom-scrollbar">
            {yData.isoggMatches && yData.isoggMatches.length > 0 ? (
              yData.isoggMatches.map((match: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{match.branch.branchName}</span>
                     <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-lg">
                       {match.matches.length} Match{match.matches.length > 1 ? 'es' : ''}
                     </span>
                   </div>
                   <div className="flex flex-wrap gap-1.5 leading-none">
                     {match.matches.slice(0, 10).map((m: string) => (
                       <span key={m} className="px-1.5 py-1 bg-white dark:bg-slate-800 rounded text-[9px] font-mono text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                         {m}
                       </span>
                     ))}
                     {match.matches.length > 10 && <span className="text-[9px] text-slate-400 font-bold">+{match.matches.length - 10} more</span>}
                   </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-6">
                <div className="text-4xl mb-4 opacity-20">🔍</div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">No deep ISOGG matches detected.</p>
                <p className="text-[10px] text-slate-400 mt-2 max-w-[200px]">Requires specific Y-chromosome markers not found in this dataset.</p>
              </div>
            )}
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

const MTDNAView = memo(({ mtData, treeSearchTerm, setTreeSearchTerm, matchedTraits }: { 
  mtData: any, 
  treeSearchTerm: string, 
  setTreeSearchTerm: (val: string) => void,
  matchedTraits: any[]
}) => {
  if (!mtData) return null;

  const findNode = useCallback((name: string, node: any = MT_DNA_TREE): any | null => {
    if (node.branchName === name) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(name, child);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const enrichedPath = useMemo(() => {
    return (mtData.path || []).map((step: string, idx: number) => {
      const node = findNode(step);
      // Fallback for nodes not in our primary tree (e.g., deep subclades)
      const isLast = idx === (mtData.path || []).length - 1;
      return {
        name: step.replace("Haplogroup ", ""),
        region: node?.region || (isLast ? mtData.region : "Global"),
        description: node?.description || (isLast ? `Your most specific maternal lineage branch: ${step.replace("Haplogroup ", "")}.` : "A transitional point in the maternal migration history."),
        historicalContext: node?.historicalContext,
        mutations: node?.mutations || []
      };
    });
  }, [mtData.path, mtData.region, findNode]);

  const derivedMarkers = mtData.testedMarkers.filter((m: any) => m.status === 'derived');
  const markerPieData = derivedMarkers.map((m: any) => {
    const branch = (mtData.path.find((p: string) => p.includes(m.mutation)) || mtData.predicted || 'Root').replace("Haplogroup ", "");
    return {
      name: m.mutation,
      branch: branch,
      value: 1
    };
  });

  return (
    <div className="animate-fade-up space-y-8 pb-12">
      {/* Hero Prediction Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-rose-500 to-pink-700 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 opacity-10 text-[12rem] select-none pointer-events-none group-hover:rotate-12 transition-transform duration-700">♀️</div>
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-rose-100 font-bold uppercase tracking-[0.2em] text-[10px] mb-4 opacity-80">Maternal Lineage (mtDNA)</h3>
            {mtData.predicted ? (
              <>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tighter"
                >
                  {mtData.predicted}
                </motion.h2>
                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="px-5 py-2 bg-white/20 backdrop-blur-md rounded-2xl text-[11px] font-black shadow-sm flex items-center gap-2 border border-white/10 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Confidence: {mtData.score}
                  </div>
                  <div className="px-5 py-2 bg-white/20 backdrop-blur-md rounded-2xl text-[11px] font-black shadow-sm border border-white/10 uppercase tracking-widest">
                    {mtData.region}
                  </div>
                </div>
                <div className="mt-auto">
                  <p className="text-rose-50 text-sm leading-relaxed max-w-xl font-medium opacity-90 border-l-2 border-rose-300/30 pl-4 py-1 italic">
                    {mtData.description || "Tracing the unbroken maternal line across civilizations and continents."}
                  </p>
                </div>
              </>
            ) : (
              <h2 className="text-3xl font-bold">Lineage Pending...</h2>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 p-8 rounded-[2rem] text-white flex flex-col shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl pointer-events-none">🧬</div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Evolutionary Pulse</h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl group-hover:bg-rose-500/20 transition-colors">🧬</div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider">SNP Resolution</div>
                    <div className="text-lg font-black">{mtData.testedMarkers.length} Markers</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl group-hover:bg-indigo-500/20 transition-colors">🛣️</div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Path Distance</div>
                    <div className="text-lg font-black">{enrichedPath.length} Milestones</div>
                  </div>
                </div>
              </div>
              <p className="text-[9px] text-slate-500 mt-8 leading-tight italic border-t border-white/5 pt-6">
                Mitochondrial Eve is our direct common maternal ancestor who lived ~150,000 to 200,000 years ago in Africa.
              </p>
            </div>
            
            <div className="flex flex-col justify-center items-center border-l border-white/5 pl-8">
               <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 w-full text-center">Marker Distribution</h4>
               {markerPieData.length > 0 ? (
                 <div className="relative w-full aspect-square max-h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={markerPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                        >
                          {markerPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getHaploColor(entry.branch, true)} className="hover:opacity-80 transition-opacity" />
                          ))}
                        </Pie>
                        <Tooltip cursor={false} content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-black text-white">{derivedMarkers.length}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Matches</span>
                    </div>
                 </div>
               ) : (
                 <div className="text-slate-500 text-xs italic">Insufficient data</div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Migration Story and Marker Detail Layout */}
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-8">
          {/* Main Migration Story Card */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex items-center justify-between mb-12 relative z-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Your Maternal Odyssey</h3>
                <p className="text-sm text-slate-400 font-medium mt-1">Tracing the geographic and genetic path of your ancestors</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                 <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                 <span className="text-[10px] font-black uppercase text-slate-500">Ancient to Modern</span>
              </div>
            </div>

            <div className="relative pl-12 ml-4 space-y-16 before:absolute before:left-0 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-rose-500 before:via-pink-500 before:to-transparent">
              {enrichedPath.map((step: any, idx: number) => {
                const isFirst = idx === 0;
                const isLast = idx === enrichedPath.length - 1;
                
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative group cursor-default"
                  >
                    {/* Node Pin */}
                    <div className={`absolute -left-[64px] top-0 w-12 h-12 rounded-2xl border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center z-10 transition-all group-hover:rotate-12 ${
                      isLast ? 'bg-rose-600 scale-110 rotate-12' : isFirst ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                    }`}>
                      <span className={`text-[11px] font-black ${isLast || isFirst ? 'text-white' : 'text-slate-500'}`}>{idx + 1}</span>
                    </div>

                    <div className="bg-slate-50/40 dark:bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-transparent group-hover:border-rose-200 dark:group-hover:border-rose-900/30 transition-all group-hover:shadow-xl group-hover:shadow-rose-100/50 dark:group-hover:shadow-none">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="space-y-1">
                          <h4 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none group-hover:text-rose-600 transition-colors">
                            {step.name === "mtDNA Root (Eve)" ? "Mitochondrial Eve" : step.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-300"></span>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.1em] uppercase">Originates in: {step.region}</span>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-3">
                           {isFirst && <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-[9px] font-black text-indigo-600 tracking-widest border border-indigo-100 dark:border-indigo-800 uppercase">Ancestor</span>}
                           {isLast && <span className="px-3 py-1 bg-rose-50 dark:bg-rose-900/30 rounded-lg text-[9px] font-black text-rose-600 tracking-widest border border-rose-100 dark:border-rose-800 uppercase">You Are Here</span>}
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                        {step.description}
                      </p>

                      {step.historicalContext && (
                        <div className="mb-6 p-4 bg-rose-50/50 dark:bg-rose-900/10 border-l-4 border-rose-400 rounded-r-xl">
                          <div className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-[0.2em] mb-1">Historical Context</div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                            {step.historicalContext}
                          </p>
                        </div>
                      )}

                      {step.mutations.length > 0 && (
                        <div className="relative pt-4 border-t border-slate-200 dark:border-slate-700/50">
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                             🧬 Genetic Markers at this step
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {step.mutations.slice(0, 20).map((m: string) => (
                              <span key={m} className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-md transition-colors ${
                                mtData.userMutations.includes(m)
                                  ? 'bg-rose-500 text-white shadow-sm'
                                  : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                              }`}>
                                {m}
                              </span>
                            ))}
                            {step.mutations.length > 20 && (
                              <span className="text-[10px] text-slate-400 font-bold self-center">+{step.mutations.length - 20}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* Maternal Library Card */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-10 shadow-sm overflow-hidden relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Maternal Library</h3>
                <p className="text-sm text-slate-400">Interactive mitochondrial phylogenetic navigator</p>
              </div>
              <div className="relative w-full max-w-sm">
                <input 
                  type="text"
                  placeholder="Jump to Haplogroup (e.g., L3, R0, H)..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                  value={treeSearchTerm}
                  onChange={(e) => setTreeSearchTerm(e.target.value)}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 min-h-[600px] overflow-hidden">
               <div className="overflow-x-auto">
                 <div className="min-w-[1000px]">
                   <HaplogroupTreeView 
                     node={MT_DNA_TREE} 
                     userPath={mtData.path} 
                     searchTerm={treeSearchTerm} 
                     testedMarkers={mtData.testedMarkers} 
                   />
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* PhyloTree Deep Analysis */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 blur-[80px] -mr-24 -mt-24 group-hover:bg-rose-500/10 transition-colors duration-1000"></div>
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-4 mb-8 relative z-10">
            <span className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-sm">🔬</span>
            PhyloTree Deep Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {mtData.deepMatches && mtData.deepMatches.length > 0 ? (
              mtData.deepMatches.slice(0, 15).map((match: any, idx: number) => (
                <div key={idx} className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900/30 transition-all hover:shadow-lg group/item">
                   <div className="flex justify-between items-start mb-3">
                     <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter group-hover/item:text-rose-600 transition-colors">{match.branch.branchName}</span>
                     <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/40 px-3 py-1 rounded-xl border border-rose-100 dark:border-rose-800/50 shadow-sm">
                       {match.matches.length} Mutations
                     </span>
                   </div>
                   <div className="flex flex-wrap gap-1.5 line-clamp-2">
                     {match.matches.map((m: string) => (
                       <span key={m} className="px-2 py-0.5 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-mono text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm">
                         {m}
                       </span>
                     ))}
                   </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <div className="text-6xl mb-6 grayscale opacity-20">🧬</div>
                <h4 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-2">Reference Refinement In Progress</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Requires specific deep-branch mutations not identified in current coverage.</p>
              </div>
            )}
          </div>
          
          {mtData.deepMatches && mtData.deepMatches.length > 15 && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Showing top 15 of {mtData.deepMatches.length} specific subclade matches</p>
            </div>
          )}
        </div>

        {/* Maternal Health Traits Section */}
        {matchedTraits && matchedTraits.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-4 mb-8">
              <span className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">🧬</span>
              Maternal Health Traits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedTraits.map((trait: any, idx: number) => (
                <div key={idx} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-black text-rose-600 dark:text-rose-400 font-mono tracking-tight">{trait.position} [{trait.allele}]</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-rose-100 dark:bg-rose-900/40 rounded-full text-rose-600 dark:text-rose-400 uppercase">Matched</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {trait.traits.map((t: string, i: number) => (
                       <div key={i} className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                         {t}
                       </div>
                     ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
  const matched = activeDataset?.results?.filter((r: any) => r.status === 'matched' || r.status === 'partial').length || 0;
  const coverage = activeDataset ? {
    matched: matched,
    total: snps.length,
    percent: ((matched / snps.length) * 100).toFixed(1)
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
  const [datasets, setDatasets] = useState<{ 
    name: string, 
    results: any[], 
    chip?: string, 
    snpCount?: number, 
    predictedYDNA?: any, 
    predictedMtDNA?: any,
    mergedMtMap?: Record<string, string>
  }[]>([]);
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
  const [activeTab, setActiveTab] = useState<'summary' | 'autosomal' | 'oracle' | 'y-dna' | 'mt-dna' | 'ancient' | 'ancient-cultures' | 'compare' | 'markers' | 'wellness' | 'blood' | 'debug'>('autosomal');
  const [activeCategory, setActiveCategory] = useState<string>('Health');
  const [isPrivacyExpanded, setIsPrivacyExpanded] = useState(false);
  const [treeSearchTerm, setTreeSearchTerm] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const expandAll = (categories: string[]) => {
    setExpandedCategories(new Set(categories));
  };

  const collapseAll = (categories: string[]) => {
    setExpandedCategories(new Set());
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
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

  const updateDatasets = (newDataset: { 
    name: string, 
    results: any[], 
    chip?: string, 
    snpCount?: number, 
    predictedYDNA?: any, 
    predictedMtDNA?: any,
    mergedMtMap?: Record<string, string>
  }) => {
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
    let fileArray = Array.isArray(files) ? files : Array.from(files);

    try {
      const expandedFiles: File[] = [];
      for (const file of fileArray) {
        if (file.name.toLowerCase().endsWith('.zip')) {
          const zip = await JSZip.loadAsync(file);
          for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
            if (!zipEntry.dir) {
              const content = await zipEntry.async('blob');
              expandedFiles.push(new File([content], relativePath, { type: 'text/plain' }));
            }
          }
        } else {
          expandedFiles.push(file);
        }
      }
      fileArray = expandedFiles;
    } catch (e) {
      setError(`Failed to process zip file: ${e instanceof Error ? e.message : String(e)}`);
      setProcessing(false);
      return;
    }
    
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
            predictedMtDNA: payload.predictedMtDNA,
            mergedMtMap: payload.mergedMtMap
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
      const { continentalScores: rawContinentalScores, regionalScores, deepScores, subPopulations, chromosomeData } = data;
      const continentalScores = Object.entries(rawContinentalScores).reduce((acc: Record<string, number>, [continent, score]) => {
        const region = mapToRegion(continent);
        acc[region] = (acc[region] || 0) + (score as number);
        return acc;
      }, {});
      return { continentalScores, regionalScores, deepScores, subPopulations, chromosomeData };
    };

    const snpMap = snpMaps.current[activeDatasetIndex] || {};
    const popFreqs = getPopFrequencies();
    const statisticalResults = calculateProAncestry(snpMap, popFreqs);

    return {
      primary: processOracle(oracle.primary),
      secondary: processOracle(oracle.secondary),
      commercial: processOracle(oracle.commercial),
      statistical: statisticalResults
    };
  }, [datasets, activeDatasetIndex]);

  const ancientAdmixture = useMemo(() => {
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return [];
    return calculateAncientAdmixture(snpMap);
  }, [datasets, activeDatasetIndex]);

  const individualMatches = useMemo(() => {
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return [];
    return calculateIndividualMatches(snpMap);
  }, [datasets, activeDatasetIndex]);

  const ancientCulturesMatches = useMemo(() => {
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return [];
    return calculateAncientAffinity(snpMap);
  }, [datasets, activeDatasetIndex]);

  const famousMatches = useMemo(() => {
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return [];
    return calculateFamousMatches(snpMap);
  }, [datasets, activeDatasetIndex]);

  const healthWellnessMatches = useMemo(() => {
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return [];
    return matchHealthAndWellness(snpMap);
  }, [datasets, activeDatasetIndex]);

  const populationProximity = useMemo(() => {
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return [];
    return calculatePopulationProximity(snpMap);
  }, [datasets, activeDatasetIndex]);

  const markerBenchmarks = useMemo(() => {
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return [];
    return calculateMarkerBenchmarks(snpMap);
  }, [datasets, activeDatasetIndex]);

  const userMatchedMitoTraits = useMemo(() => {
    const dataset = datasets[activeDatasetIndex];
    if (!dataset || !dataset.mergedMtMap) return [];
    
    const mtMap = dataset.mergedMtMap;
    return (mitoTraits as any[]).filter(trait => {
        const userAllele = mtMap[trait.position];
        if (!userAllele) return false;
        
        // trait.allele is like "G>A" or "A583G" or just "A"
        // Most common format in our parser is "G>A"
        if (trait.allele.includes('>')) {
          const [ancestral, derived] = trait.allele.split('>');
          return userAllele.toUpperCase() === derived.trim().toUpperCase();
        }
        
        // Sometimes it's just the derived allele
        return userAllele.toUpperCase() === trait.allele.trim().toUpperCase();
    });
  }, [datasets, activeDatasetIndex]);

  return (
    <div className="app-container relative max-w-5xl mx-auto p-4 sm:p-8 min-h-screen">
      <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
        <div className="text-[9px] font-black font-mono text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:border-sky-500 cursor-default">v.3</div>
        <button 
          onClick={toggleDarkMode} 
          className="p-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all hover:scale-110 active:scale-95 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      
      <header className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6 mb-12 sm:mb-16 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-125"></div>
            <img className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl relative z-10" src={LOGO_URI} alt="Genotype Scout Logo" />
          </motion.div>
          <div>
            <div className="text-blue-600 dark:text-blue-400 text-xs tracking-[0.4em] uppercase font-black mb-2 opacity-80">Genetics Reimagined</div>
            <h1 className="text-4xl sm:text-5xl tracking-tighter mb-4 leading-none flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
              <div>
                <span className="font-light text-slate-500 dark:text-slate-400 italic">GENOTYPE</span><br className="sm:hidden" /><span className="font-black" style={{ color: '#2450c3' }}>SCOUT</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">A Written In The Genome Tool</span>
            </h1>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 font-bold text-[10px] uppercase tracking-widest">
              <a href="https://jequandavis.wordpress.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                <span className="w-6 h-px bg-slate-300 dark:bg-slate-700 group-hover:bg-blue-500 transition-colors"></span>
                Research
              </a>
              <a href="https://www.facebook.com/share/g/1H4NqczNgK/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                <span className="w-6 h-px bg-slate-300 dark:bg-slate-700 group-hover:bg-blue-500 transition-colors"></span>
                Community
              </a>
              <a href="https://paypal.me/jequandavis" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 transition-colors">
                <span className="w-6 h-px bg-emerald-200 dark:bg-emerald-900/50 group-hover:bg-emerald-500 transition-colors"></span>
                Support
              </a>
            </div>
          </div>
        </div>
      </header>

      {processing && (
        <div className="border-2 border-dashed border-sky-300 dark:border-sky-800 rounded-[2.5rem] p-12 sm:p-24 text-center bg-white dark:bg-slate-900/50 shadow-inner">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="text-6xl mb-8 inline-block"
          >
            🧬
          </motion.div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">Analyzing Genomic Markers</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-md mx-auto mb-12">
            Sit tight while we process your SNPs and reconstruct your Ancestry Oracle profile. This takes a few moments.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-left">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">📚</div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1 line-clamp-1">Did you know?</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">Genotype Scout analyzes over {ANCHOR_AIMS.length.toLocaleString()} diagnostic markers for ancestry.</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-left">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4">🛡️</div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1 line-clamp-1">Privacy First</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">Your raw DNA data never leaves your device. All computation is local.</div>
            </div>
          </div>
        </div>
      )}

      {!results && !processing && (
        <div className="animate-fade-up">
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Browser-Based Analysis Node Active
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-slate-50 tracking-tighter mb-6 leading-none">
              Explore the history <br className="hidden sm:block" /> locked in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400">Genetics.</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mb-10">
              Unpack your 23andMe, AncestryDNA, MyHeritage, or Family Tree DNA (FTDNA) raw data. 
              Discover deep ancestry, health markers, and paternal lineages through our 
              <span className="font-black text-slate-900 dark:text-slate-100"> High-Precision Oracle.</span>
            </p>
            
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                  <button onClick={() => setIsPrivacyExpanded(!isPrivacyExpanded)} className="flex items-center gap-3 w-full text-left">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-xl shadow-sm">🔒</div>
                    <div className="flex-grow">
                      <div className="text-[10px] font-black uppercase text-indigo-500">Privacy First</div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Local computation</div>
                    </div>
                    {isPrivacyExpanded ? <ChevronUp className="w-5 h-5 text-slate-400"/> : <ChevronDown className="w-5 h-5 text-slate-400"/>}
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isPrivacyExpanded ? 'auto' : 0, opacity: isPrivacyExpanded ? 1 : 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Your DNA data is processed entirely in-browser. We scan over 11,000+ Ancestry Informative Markers (AIMs) and 100,000+ health/trait variants using high-performance local processing.
                    </p>
                  </motion.div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-xl shadow-sm">🧪</div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400">Forensic Integrity</div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">11,000+ Verified AIMs</div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-xl shadow-sm">⚡</div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400">Fast Analysis</div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Under 30 seconds</div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl shadow-sm">🔎</div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-blue-500">Deep Search Logic</div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">Active Kernels</div>
                    </div>
                  </div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter space-y-1">
                    <div>• 10k GRAF-10k Panels</div>
                    <div>• 180 Forensic markers</div>
                    <div>• 111 Regional Markers</div>
                    <div>• Proxy-Match Kernel: Active</div>
                    <div>• v5 Extended DB: Unified</div>
                  </div>
                </div>
              </div>
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

          <div className="flex justify-center mb-16 -mt-8">
            <motion.div
              whileHover={{ y: -5 }}
              onClick={() => fileRef.current?.click()}
              className={`group relative p-6 sm:p-10 w-full max-w-2xl rounded-[2.5rem] sm:rounded-[3rem] bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 cursor-pointer transition-all hover:border-sky-500 hover:shadow-2xl hover:shadow-sky-500/10 ${dragging ? "border-sky-500 shadow-2xl shadow-sky-500/20 ring-4 ring-sky-500/10" : ""}`}
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
              <input ref={fileRef} type="file" className="hidden" accept=".csv,.txt,.zip" multiple onChange={(e) => {
                if (e.target.files) {
                  setError(null);
                  const newFiles = Array.from(e.target.files);
                  setPendingFiles(prev => [...prev, ...newFiles]);
                }
              }} />
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center text-4xl sm:text-5xl mb-6 sm:mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">🧬</div>
                <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-500 border-2 sm:border-4 border-white dark:border-slate-900 shadow-sm flex items-center justify-center text-white text-[8px] sm:text-[10px] font-black">AI</div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mb-2 sm:mb-3 tracking-tight">Initialize Analysis</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 sm:mb-8 max-w-sm">
                Securely drop your raw DNA file (.txt or .csv) from 23andMe, Ancestry, MyHeritage, or FTDNA. All data stays local and private.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-full sm:w-auto text-center px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest group-hover:bg-sky-600 dark:group-hover:bg-sky-400 dark:group-hover:text-white transition-colors">
                  Select Kit
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">or drag & drop here</div>
              </div>

              {dragging && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="absolute inset-4 rounded-[2.5rem] bg-sky-500/90 backdrop-blur-sm flex flex-col items-center justify-center text-white z-50 pointer-events-none"
                 >
                    <div className="text-6xl mb-4">📥</div>
                    <div className="text-lg font-black uppercase tracking-widest">Release to Analyze</div>
                 </motion.div>
              )}
            </motion.div>
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
        </div>
      )}
      {results && (
        <div className="space-y-8 animate-fade-in">
          {/* Main Navigation Dock */}
          <div className="sticky top-0 z-40 -mx-4 sm:mx-0 px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-white/20 dark:border-slate-800 transition-all">
            <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-1.5 pb-0.5">
              {[
                { id: 'summary', label: 'Summary', icon: '📊', color: 'amber' },
                { id: 'ancient-cultures', label: 'Origins', icon: '🏛️', color: 'emerald' },
                { id: 'oracle', label: 'Oracle', icon: '🔮', color: 'indigo' },
                { id: 'compare', label: 'Compare', icon: '🌍', color: 'blue' },
                { id: 'ancient', label: 'Ancient', icon: '🏺', color: 'amber' },
                { id: 'wellness', label: 'Health', icon: '🧬', color: 'teal' },
                { id: 'autosomal', label: 'Traits', icon: '🧬', color: 'sky' },
                { id: 'y-dna', label: 'Y-DNA', icon: '♂️', color: 'blue' },
                { id: 'mt-dna', label: 'mtDNA', icon: '♀️', color: 'rose' },
                { id: 'markers', label: 'Panels', icon: '📋', color: 'indigo' },
                { id: 'debug', label: 'System', icon: '🛠️', color: 'slate' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1 sm:px-4 py-2 rounded-xl sm:rounded-full text-[9px] sm:text-xs font-black transition-all active:scale-95 ${
                    activeTab === tab.id 
                      ? `bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg` 
                      : `text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800`
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="tab-highlight"
                      className="absolute inset-0 rounded-xl sm:rounded-full bg-slate-900 dark:bg-white -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + activeDatasetIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {datasets.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-6 px-1">
                  {datasets.map((d, i) => (
                    <button
                      key={i}
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                        activeDatasetIndex === i 
                          ? 'bg-sky-600 text-white shadow-md' 
                          : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:border-sky-500'
                      }`}
                      onClick={() => setActiveDatasetIndex(i)}
                    >
                      {d.name.split('.')[0]}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 mb-8 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  {(['matched', 'unmatched', 'not_tested'] as const).map(status => (
                    <button 
                      key={status}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${statusFilter === status ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700'}`}
                      onClick={() => setStatusFilter(status)}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative group/search">
                    <input 
                      type="text" 
                      placeholder="Search markers..." 
                      className="bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2 pl-10 text-xs font-bold w-full sm:w-48 focus:w-64 transition-all focus:ring-2 focus:ring-sky-500 outline-none border border-slate-100 dark:border-slate-700"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-sky-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <button onClick={resetApp} className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-100 dark:border-rose-900/40 transition-all active:scale-90" title="Reset Session">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    </button>
                    <button onClick={exportPDF} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all active:scale-90" title="Export PDF">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              {activeTab === 'summary' && (
                <ProfileSummary 
                  datasets={datasets} 
                  activeDatasetIndex={activeDatasetIndex} 
                  oracleResults={oracleResults} 
                  populationProximity={populationProximity}
                  healthImpacts={healthWellnessMatches}
                />
              )}

              {activeTab === 'autosomal' && (
                <AutosomalView 
                  filteredResults={filteredResults}
                  groupedCategories={groupByCategory(filteredResults || [])}
                  availableCategories={Object.keys(groupByCategory(filteredResults || []))}
                  expandedCategories={expandedCategories}
                  toggleCategory={toggleCategory}
                  expandedSnps={expandedSnps}
                  toggleExpand={toggleExpand}
                  datasets={datasets}
                  activeDatasetIndex={activeDatasetIndex}
                />
              )}

              {activeTab === 'oracle' && (
                <ModernAncestryOracle results={oracleResults} />
              )}

              {activeTab === 'ancient' && (
                <div className="space-y-8">
                  <AncientAncestryOracle 
                    results={individualMatches} 
                    title="Ancient Relative Matches" 
                    subtitle="Genetic similarity to specific ancient individuals"
                    type="matches"
                  />
                  <AncientAncestryOracle 
                    results={ancientAdmixture} 
                    title="Deep Time Admixture" 
                    subtitle="Paleolithic and Mesolithic affinity by population group"
                    type="admixture"
                  />
                </div>
              )}

              {activeTab === 'ancient-cultures' && (
                <div className="space-y-12">
                  <AncientCulturesTab matches={ancientCulturesMatches} />
                  
                  <section className="space-y-6 pt-8 border-t border-gray-800">
                    <header>
                      <h2 className="text-3xl font-bold text-white mb-2">Famous Ancient Individuals</h2>
                      <p className="text-gray-400">Direct comparison with high-coverage ancient genomes from the archaeological record.</p>
                    </header>
                    <FamousMatches matches={famousMatches} />
                  </section>
                </div>
              )}

              {activeTab === 'wellness' && (
                <HealthWellnessTab impacts={healthWellnessMatches} userSnps={snpMaps.current[activeDatasetIndex]} />
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
                  matchedTraits={userMatchedMitoTraits}
                />
              )}

              {activeTab === 'compare' && (
                <PopulationComparisonTab proximityData={populationProximity} />
              )}

              {activeTab === 'markers' && (
                <MarkerBenchmarks benchmarks={markerBenchmarks} />
              )}

              {activeTab === 'debug' && (
                <div className="space-y-8">
                  <div className="p-8 rounded-[2rem] bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs overflow-auto max-h-[800px] shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <h3 className="text-white font-black uppercase tracking-widest text-[10px]">Active Kernel State</h3>
                    </div>
                    <pre className="p-4 bg-black/40 rounded-xl overflow-auto custom-scrollbar whitespace-pre-wrap">
                      {JSON.stringify({ 
                        version: VERSION,
                        activeTab, 
                        statusFilter, 
                        activeDatasetIndex, 
                        chip: datasets[activeDatasetIndex].chip,
                        snps: datasets[activeDatasetIndex].snpCount,
                        datasetMeta: datasets.map(d => ({ name: d.name, count: d.results.length }))
                      }, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
