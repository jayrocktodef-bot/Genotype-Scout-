/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useRef, useEffect, useMemo, memo, Suspense, lazy, startTransition } from "react";
import JSZip from 'jszip';
import { motion, AnimatePresence } from "motion/react";
import { useRegisterSW } from 'virtual:pwa-register/react';
// ...
const HealthWellnessTab = lazy(() => import("./components/HealthWellnessTab").then(m => ({ default: m.HealthWellnessTab })));
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  Shield, 
  FlaskConical, 
  X, 
  Dna,
  Search,
  Menu,
  Activity,
  User,
  Settings,
  HelpCircle,
  BookOpen,
  MapPin,
  Calendar,
  Award,
  Globe,
  CheckCircle,
  Compass,
  History
} from 'lucide-react';
import { MethodologyModal } from "./components/MethodologyModal";
// @ts-ignore
import { FixedSizeList as List } from 'react-window';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { jsPDF } from "jspdf";
import { groupByCategory, CATEGORY_META, SIG_COLOR, CONTINENT_META, mapToRegion, Y_DNA_TREE, MT_DNA_TREE, SNP_DB, SNP, identifyEndogamy, getPrivateSNPs } from "./genotypeData";
import { ANCHOR_AIMS } from "./anchorAims";
import { saveResults, loadResults, clearResults } from "./services/storageService";
import { REGION_METADATA } from "./constants/regionInfo";
import { calculateFamousMatches } from "./utils/individualMatching";
import { matchHealthAndWellness } from "./utils/healthMatching";
import { calculatePopulationProximity } from "./utils/ancestry/populationComparison";
import { getHaplogroupDetails } from "./utils/haplogroupDetails";
import { calculateMarkerBenchmarks } from "./utils/markerBenchmarks";
import { calculateFileIntegrity } from "./utils/statistics/qualityControl";
import { applyConfidenceIntervals } from "./utils/statistics/admixtureRigor";
const FamousMatches = lazy(() => import("./components/FamousMatches").then(m => ({ default: m.FamousMatches })));
const PopulationComparisonTab = lazy(() => import("./components/PopulationComparisonTab").then(m => ({ default: m.PopulationComparisonTab })));
const MarkerBenchmarks = lazy(() => import("./components/MarkerBenchmarks").then(m => ({ default: m.MarkerBenchmarks })));
const SubpopulationBento = lazy(() => import("./components/SubpopulationBento"));
import { processSubpopulations } from "./components/ancestryOracleLogic";
import { GenotypeParser } from "./components/GenotypeParser";
import { loadMasterAims } from './data';
const masterAims = loadMasterAims();

import ScoutWorkspace from "./components/ScoutWorkspace";
const BloodTypeView = lazy(() => import("./components/BloodTypeView").then(m => ({ default: m.BloodTypeView })));
const HealthTraitsTab = lazy(() => import("./components/HealthTraitsTab").then(m => ({ default: m.HealthTraitsTab })));
import { calculateBloodType } from "./engines/bloodTypeCalculator";

const ModernAncestryOracle = lazy(() => import("./components/ModernAncestryOracle").then(m => ({ default: m.ModernAncestryOracle })));
const NaiveAncestryOracle = lazy(() => import("./components/NaiveAncestryOracle").then(m => ({ default: m.NaiveAncestryOracle })));
const ChromosomePainterView = lazy(() => import("./components/ChromosomePainterView").then(m => ({ default: m.ChromosomePainterView })));
const AncientAncestryOracle = lazy(() => import("./components/AncientAncestryOracle").then(m => ({ default: m.AncientAncestryOracle })));
const EngineAncestryOracle = lazy(() => import("./components/EngineAncestryOracle").then(m => ({ default: m.EngineAncestryOracle })));
import { runAncestryOracle } from "./engines/ancestry/oracleEngine";
import { calculateAncientAdmixture, calculateIndividualMatches, calculateArchaicIntrogression } from "./lib/AncientAdmixtureCalculator";
import { calculateHistoricalClusterMatches } from "./engines/ancestry/historicalClusterEngine";
import { getPopFrequencies } from "./data/GenomicDataService";
import { forensicAimsMaster as forensicAims, graf10kIndex as grafIndex } from './data';
import masterMtdna from "./data/master_mtdna.json";
const mitoTraits = masterMtdna.traits;
import { MethodologyPage } from "./components/MethodologyPage";
import Dashboard from "./components/Dashboard";
import Navigation from "./components/Navigation";
import HeroUpload from "./components/HeroUpload";
import AdBanner from "./components/AdBanner";
import { Phase2Badge } from "./components/Phase2Badge";
import { Phase2Panel } from "./components/Phase2Panel";
import { AIGenomicAgent } from "./components/AIGenomicAgent";
import { KitComparisonModule } from './components/KitComparisonModule';
import { ExportModule, ExportConfig } from './components/ExportModule';
import { PrintableView } from './components/PrintableView';
const RareVariantsView = lazy(() => import("./components/RareVariantsView"));
import { HaplogroupBento } from "./components/HaplogroupBento";
import { YDNABento } from "./components/YDNABento";
const ArchaicIntrogressionView = lazy(() => import("./components/ArchaicIntrogressionView").then(m => ({ default: m.ArchaicIntrogressionView })));
const PolygenicScores = lazy(() => import("./components/PolygenicScores").then(m => ({ default: m.PolygenicScores })));

const LOGO_URI = "https://writteninthegenome.blog/wp-content/uploads/2026/05/17794114671357483599285632974525.png";
const VERSION = "5.13.0";

const normalizeBranchName = (name: string) => (name || "").toLowerCase().replace("haplogroup ", "").trim();

function enrichHaplogroupTree(tree: any, userPath: string[], testedMarkers: any[]) {
  if (!tree) return null;
  const cloned = structuredClone(tree);
  if (!userPath || userPath.length <= 1) return cloned;
  
  function findNodeInCloned(root: any, normalizedName: string): any | null {
    if (normalizeBranchName(root.branchName) === normalizedName) return root;
    if (root.children) {
      for (const child of root.children) {
        const found = findNodeInCloned(child, normalizedName);
        if (found) return found;
      }
    }
    return null;
  }
  
  for (let i = 1; i < userPath.length; i++) {
    const step = userPath[i];
    if (!step) continue;
    const normalizedStep = normalizeBranchName(step);
    
    const existing = findNodeInCloned(cloned, normalizedStep);
    if (!existing) {
      const parentStep = userPath[i - 1];
      const normalizedParent = normalizeBranchName(parentStep);
      const parentNode = findNodeInCloned(cloned, normalizedParent);
      
      if (parentNode) {
        if (!parentNode.children) parentNode.children = [];
        
        const snpsForNode = (testedMarkers || [])
          .filter((tm: any) => {
            const tmBranch = tm.branch || tm.mutation || "";
            const tmTrait = tm.trait || tm.description || "";
            return normalizeBranchName(tmBranch) === normalizedStep || normalizeBranchName(tmTrait).includes(normalizedStep);
          })
          .map((tm: any) => tm.marker || tm.mutation);

        parentNode.children.push({
          branchName: step.startsWith("Haplogroup ") ? step : `Haplogroup ${step}`,
          snp: snpsForNode.length > 0 ? snpsForNode : [],
          region: parentNode.region || "Global",
          description: `Precise sub-lineage identified via genotyping markers.`,
          children: []
        });
      }
    }
  }
  return cloned;
}

const HaplogroupTreeView = memo(({ node, userPath = [], level = 0, searchTerm = '', testedMarkers = [] }: { 
  node: any, 
  userPath?: string[], 
  level?: number, 
  searchTerm?: string,
  testedMarkers?: any[]
}) => {
  const safeUserPath = userPath || [];
  const normalizedUserPath = safeUserPath.map(p => normalizeBranchName(p));
  const isMatch = normalizedUserPath.includes(normalizeBranchName(node.branchName));
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
    <div className={`ml-2 sm:ml-4 border-l border-slate-100 pl-2 sm:pl-4 my-2 ${matchesSearch ? 'ring-2 ring-teal-500/20 rounded-r' : ''}`}>
      <div 
        className={`flex items-center gap-3 cursor-pointer group py-2 px-3 rounded-2xl transition-all ${isMatch ? 'bg-teal-50 text-teal-900 shadow-sm' : 'hover:bg-white'} ${matchesSearch ? 'bg-amber-50' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <motion.span 
          animate={{ rotate: isExpanded ? 90 : 0 }}
          className="text-[10px] text-slate-300 w-4 flex justify-center"
        >
          {hasChildren ? '▶' : '•'}
        </motion.span>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-black tracking-tight ${isMatch ? 'text-teal-700' : 'text-slate-700'} ${matchesSearch ? 'text-amber-700' : ''}`}>
              {node.branchName}
            </span>
            {node.region && (
              <span 
                className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${(CONTINENT_META[node.region] || CONTINENT_META["Global"]).color}15`,
                  color: (CONTINENT_META[node.region] || CONTINENT_META["Global"]).color
                }}
              >
                {node.region}
              </span>
            )}
          </div>
          {node.description && (
            <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-tight">{node.description}</p>
          )}
          {node.historicalContext && isExpanded && (
            <p className="text-[9px] text-rose-500 mt-2 font-bold italic border-l-2 border-rose-100 pl-2 leading-relaxed">
              {node.historicalContext}
            </p>
          )}
          <AnimatePresence>
            {isExpanded && treeMarkers.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-1 mt-2 overflow-hidden"
              >
                {treeMarkers.map((m: string, idx: number) => {
                  const status = getMarkerStatus(m);
                  return (
                    <span 
                      key={idx} 
                      className={`text-[8px] font-mono font-black px-2 py-0.5 rounded-full shadow-sm transition-all ${
                        status === 'derived' 
                          ? 'bg-teal-600 text-white' 
                          : status === 'ancestral'
                          ? 'bg-slate-100 text-slate-400 border border-slate-200'
                          : 'bg-slate-50 text-slate-300'
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
              <HaplogroupTreeView key={i} node={child} userPath={safeUserPath} level={level + 1} searchTerm={searchTerm} testedMarkers={testedMarkers} />
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

const ProfileSummary = memo(
  ({
    datasets,
    activeDatasetIndex,
    oracleResults,
    populationProximity,
    userSnps,
    famousMatches = [],
    healthImpacts = [],
  }: {
    datasets: any[];
    activeDatasetIndex: number;
    oracleResults: any;
    populationProximity: any[];
    userSnps: Record<string, string>;
    famousMatches?: any[];
    healthImpacts?: any[];
  }) => {
    const [isChartReady, setIsChartReady] = useState(false);
    useEffect(() => {
      setIsChartReady(false);
      const timer = setTimeout(() => setIsChartReady(true), 150);
      return () => clearTimeout(timer);
    }, [activeDatasetIndex]);

    const dataset = datasets[activeDatasetIndex];

    const bloodTypeAnalysis = useMemo(() => {
      return calculateBloodType(userSnps || {});
    }, [userSnps]);

    const rhDisplay = useMemo(() => {
      if (
        !bloodTypeAnalysis ||
        bloodTypeAnalysis.details.rhPhenotype === 'Unknown'
      ) {
        return {
          name: bloodTypeAnalysis?.bloodType || 'Unknown',
          badge: 'Confidence 0.0',
          pillColor: 'bg-slate-600 shadow-slate-600/10',
          label: 'Predicted Blood Type',
        };
      }
      const isPos = bloodTypeAnalysis.details.rhPhenotype === 'Positive';
      const bloodTypeStr =
        bloodTypeAnalysis.bloodType !== 'Unknown'
          ? bloodTypeAnalysis.bloodType
          : isPos
          ? 'Rh+'
          : 'Rh-';
      const confPercent = Math.round(
        (bloodTypeAnalysis.details.rhConfidence || 0) * 100,
      );

      if ((bloodTypeAnalysis.details.rhConfidence || 0) >= 0.8) {
        return {
          name: bloodTypeStr,
          badge: `High Confidence (${confPercent}%)`,
          pillColor: 'bg-red-600 shadow-red-600/10',
          label: 'Predicted Blood Type',
        };
      } else {
        return {
          name: `Likely ${bloodTypeStr}`,
          badge: `Moderate/Low Confidence (${confPercent}%)`,
          pillColor: 'bg-amber-600 shadow-amber-600/10',
          label: 'Predicted Blood Type',
        };
      }
    }, [bloodTypeAnalysis]);

    const statisticalInsights = useMemo(() => {
      const stats = oracleResults?.statistical;
      if (!stats || !stats.results) return null;

      const markersUsed = stats.markersUsed || 100;
      return Object.entries(stats.results).map(([pop, percentage]) => {
        const confidence = applyConfidenceIntervals(
          Number(percentage),
          markersUsed,
        );
        return { pop, percentage, ...confidence };
      });
    }, [oracleResults]);

    const sortedEngineResults = useMemo(() => {
      const subpopOracle = dataset?.analysis?.subpopulationOracle;
      const admixtureMix = subpopOracle?.admixtureMix || [];
      return [...admixtureMix]
        .sort((a: any, b: any) => (b.percentage || 0) - (a.percentage || 0))
        .slice(0, 5);
    }, [dataset]);

    if (!dataset) return null;

    const yData = dataset.predictedYDNA || {
      predicted: null,
      path: [],
      testedMarkers: [],
    };
    const mtData = dataset.predictedMtDNA || {
      predicted: null,
      path: [],
      testedMarkers: [],
    };

    const currentOracle = oracleResults?.primary;
    const ancestryScores = currentOracle?.continentalScores || {};

    const ancestryChartData = Object.entries(ancestryScores)
      .map(([name, value]) => ({ name, value: Number(value) }))
      .sort((a, b) => b.value - a.value);

    // ----- Famous matches extraction (if available) -----
    const topFamousMatches = useMemo(() => {
      if (!famousMatches || famousMatches.length === 0) return [];
      return famousMatches
        .sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
        .slice(0, 6);
    }, [famousMatches]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 pb-8"
      >
        {/* ===== Outer glass dashboard card ===== */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-950/90 backdrop-blur-xl p-6 shadow-2xl ring-1 ring-white/10">
          {/* Decorative gradient blobs */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-fuchsia-500/10 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 space-y-6">
            {/* ===== Header Capsule ===== */}
            <div className="rounded-2xl bg-slate-800/40 backdrop-blur-md border border-white/10 shadow-inner shadow-white/5 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-400">
                    Genomic Passport
                  </h3>
                  <h2 className="text-lg font-black text-white tracking-tight mt-0.5 truncate max-w-md">
                    {dataset.name || 'Sample Specimen'}
                  </h2>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono">
                <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur">
                  <span className="text-slate-400 font-bold block text-[8px] uppercase tracking-widest leading-none mb-1">
                    Array
                  </span>
                  <span className="font-bold text-slate-200">
                    {dataset.chip || 'High-Density Array'}
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur">
                  <span className="text-slate-400 font-bold block text-[8px] uppercase tracking-widest leading-none mb-1">
                    Markers
                  </span>
                  <span className="font-bold text-slate-200">
                    {dataset.snpCount
                      ? `${dataset.snpCount.toLocaleString()} SNPs`
                      : 'Admixture Panel'}
                  </span>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-1.5 flex items-center gap-1.5 backdrop-blur">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-black tracking-widest text-[9px] uppercase text-emerald-400">
                    LOCAL INTEGRITY OK
                  </span>
                </div>
              </div>
            </div>

            {/* ===== Main Bento Grid ===== */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
              {/* ===== CELL A : Admixture & Subpopulations (span 8) ===== */}
              <div className="xl:col-span-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 shadow-xl flex flex-col">
                <div className="border-b border-white/10 pb-4 mb-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.15em]">
                      Biogeographical Origins & Deconvolution
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      Continental admixture and fine‑grained substructure.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
                  {/* Radar chart */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center border-r border-white/10 pr-0 lg:pr-4">
                    <div className="relative w-full h-[250px] flex items-center justify-center">
                      {isChartReady ? (
                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                          minWidth={0}
                          minHeight={250}
                          debounce={1}
                        >
                          <RadarChart
                            data={ancestryChartData}
                            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                          >
                            <PolarGrid
                              stroke="rgba(148,163,184,0.25)"
                              strokeOpacity={1}
                            />
                            <PolarAngleAxis
                              dataKey="name"
                              tick={{
                                fill: '#94a3b8',
                                fontSize: 9,
                                fontWeight: 800,
                              }}
                            />
                            <Radar
                              name="Origins"
                              dataKey="value"
                              stroke="#06b6d4"
                              fill="url(#radarGradient)"
                              fillOpacity={0.3}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="w-full h-full bg-slate-800/50 rounded-2xl animate-pulse" />
                      )}
                    </div>
                    <div className="flex justify-center gap-3 mt-2 flex-wrap text-[9px] font-mono">
                      {ancestryChartData.slice(0, 3).map((anc: any, i: number) => (
                        <span
                          key={i}
                          className="text-slate-300 bg-slate-800/50 px-3 py-1 rounded-xl border border-white/10"
                        >
                          <strong>{anc.name}:</strong> {anc.value.toFixed(0)}%
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Subpopulations list */}
                  <div className="lg:col-span-7 space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      Top Subpopulation Contributions
                    </span>
                    {sortedEngineResults.length > 0 ? (
                      sortedEngineResults.slice(0, 4).map((pop, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white/5 backdrop-blur border border-white/10 transition hover:border-cyan-500/30"
                        >
                          <div className="flex justify-between items-center text-xs min-w-0 gap-2">
                            <span className="font-bold text-slate-200 truncate min-w-0">
                              {formatPopName(pop.name || pop.popCode)}
                            </span>
                            <span className="font-mono font-black text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full text-[10px]">
                              {(pop.percentage || 0).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-800/70 rounded-full h-1.5 mt-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all"
                              style={{
                                width: `${Math.max(pop.percentage || 0, 2)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-xs text-slate-500">
                        No advanced subpopulation data present.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ===== CELL B : Lineages & Blood (span 4) ===== */}
              <div className="xl:col-span-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 flex flex-col shadow-xl">
                <div className="border-b border-white/10 pb-4 mb-4">
                  <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.15em]">
                    Uniparental Lineages
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                    Deep paternal & maternal markers.
                  </p>
                </div>

                <div className="space-y-3 my-auto">
                  {/* Paternal */}
                  <div className="p-3 rounded-xl bg-white/5 backdrop-blur border border-teal-500/20 flex gap-3 items-center group hover:border-teal-400/40 transition">
                    <div className="w-10 h-10 rounded-xl bg-teal-600/30 flex items-center justify-center shrink-0 shadow shadow-teal-500/10">
                      <Compass className="w-5 h-5 text-teal-400" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest block leading-none mb-1">
                        Paternal (Y‑DNA)
                      </span>
                      <span className="text-sm font-black text-slate-100 block truncate tracking-tight">
                        {yData?.phase2?.haplogroup ||
                          yData?.predicted?.name ||
                          'Unknown / Female lineage'}
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 font-mono block uppercase truncate mt-0.5">
                        {yData?.phase2?.region ||
                          yData?.predicted?.continent ||
                          'Universal Origin'}
                      </span>
                    </div>
                  </div>

                  {/* Maternal */}
                  <div className="p-3 rounded-xl bg-white/5 backdrop-blur border border-rose-500/20 flex gap-3 items-center group hover:border-rose-400/40 transition">
                    <div className="w-10 h-10 rounded-xl bg-rose-600/30 flex items-center justify-center shrink-0 shadow shadow-rose-500/10">
                      <History className="w-5 h-5 text-rose-400" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest block leading-none mb-1">
                        Maternal (mtDNA)
                      </span>
                      <span className="text-sm font-black text-slate-100 block truncate tracking-tight">
                        {mtData?.predicted || 'Unknown'}
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 font-mono block uppercase truncate mt-0.5">
                        {mtData?.region || 'Universal Origin'}
                      </span>
                    </div>
                  </div>

                  {/* Blood type */}
                  <div className="p-3 rounded-xl bg-white/5 backdrop-blur border border-red-500/20 flex gap-3 items-center group hover:border-red-400/40 transition">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow ${rhDisplay.pillColor} backdrop-blur`}
                    >
                      <FlaskConical className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-black text-red-400 uppercase tracking-widest block leading-none mb-1">
                        {rhDisplay.label || 'Predicted Blood Type'}
                      </span>
                      <span className="text-sm font-black text-slate-100 block truncate">
                        {rhDisplay.name}
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 font-mono block uppercase truncate mt-0.5">
                        {rhDisplay.badge}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[8px] font-extrabold text-slate-500 bg-slate-800/50 border border-slate-700/50 p-2 rounded-xl text-center mt-4 select-none backdrop-blur">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Fully local processing: genomic privacy protected.
                </div>
              </div>

              {/* ===== CELL C : Statistical Confidence Intervals (span 12) ===== */}
              {statisticalInsights && (
                <div className="xl:col-span-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 shadow-xl">
                  <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                    <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                        Confidence Interval Rigor (95% CI)
                      </h3>
                      <p className="text-[9px] text-slate-500 mt-0.5">
                        Statistical error bounds based on ancestry‑informative
                        marker count.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statisticalInsights
                      .slice(0, 4)
                      .map((insight: any, i: number) => (
                        <div
                          key={insight?.pop || i}
                          className="p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10 flex flex-col transition hover:border-emerald-500/30"
                        >
                          <div className="flex justify-between items-center text-[11px] font-bold mb-2 min-w-0 gap-2">
                            <span className="text-slate-200 uppercase tracking-tight truncate min-w-0 flex-1">
                              {formatPopName(insight?.pop)}
                            </span>
                            <span className="text-emerald-400 font-black shrink-0">
                              {insight?.percentage || 0}%
                            </span>
                          </div>

                          {/* Custom interval bar */}
                          <div className="relative mt-2 mb-1">
                            <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden relative">
                              <div
                                className="absolute h-full bg-emerald-500/20 rounded-full"
                                style={{
                                  left: `${insight?.low || 0}%`,
                                  width: `${Math.max(
                                    (insight?.high || 0) -
                                      (insight?.low || 0),
                                    3,
                                  )}%`,
                                }}
                              />
                            </div>
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-glow shadow-emerald-500/50 border-2 border-white/30"
                              style={{
                                left: `calc(${insight?.percentage || 0}% - 6px)`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] font-bold text-slate-500 mt-2 uppercase tracking-widest">
                            <span>Low: {insight?.low || 0}%</span>
                            <span>High: {insight?.high || 0}%</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* ===== OPTIONAL: Famous Matches Section ===== */}
            {topFamousMatches.length > 0 && (
              <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                  <Dna className="w-4 h-4 text-purple-400" />
                  <div>
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                      Ancestral Kinship & Famous Matches
                    </h3>
                    <p className="text-[9px] text-slate-500 mt-0.5">
                      Genetic similarity with notable individuals
                      (non‑attributive).
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 justify-start">
                  {topFamousMatches.map((match: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-white/5 backdrop-blur border border-white/10 rounded-xl px-4 py-2.5 hover:border-purple-500/30 transition"
                    >
                      {/* Icon placeholder */}
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-purple-300" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-slate-200">
                          {match.name || 'Unknown'}
                        </p>
                        <p className="text-[10px] text-purple-400 font-mono font-semibold">
                          {match.matchPercentage != null
                            ? `${match.matchPercentage.toFixed(1)}% match`
                            : 'Similar'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  },
);


const SNPCard = memo(({ snp, isExpanded, onToggleExpand }: { snp: any, isExpanded: boolean, onToggleExpand: (rsid: string) => void }) => {
  const meta = (CATEGORY_META as any)[snp.category] || { color: "#0d9488", icon: "🧬" };
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`premium-card p-6 cursor-pointer group ${isExpanded ? 'ring-2 ring-teal-500 shadow-lg' : ''}`}
      onClick={() => onToggleExpand(snp.rsid)}
    >
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg bg-slate-50 border border-slate-100 group-hover:bg-teal-50 transition-colors dark:bg-slate-800">
            {meta.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{snp.rsid}</span>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${SIG_COLOR[snp.significance as keyof typeof SIG_COLOR] || 'bg-slate-100 text-slate-500'}`}>
                {snp.significance}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-800 group-hover:text-teal-600 transition-colors leading-tight dark:text-slate-200">{snp.trait}</h4>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Genotype</div>
            <div className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">{snp.genotype || '--'}</div>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-teal-500 text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:text-teal-500'}`}>
            <ChevronDown className="w-4 h-4" />
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
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-sm text-slate-500 leading-relaxed mb-6 dark:text-slate-400">
                {snp.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Gene</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{snp.gene || 'N/A'}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Region</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{snp.continent}</div>
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
  const totalMatchedCount = allResults.filter((s: any) => s.status === 'matched' || s.status === 'partial').length;

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
              <div className="p-6 space-y-4 bg-slate-50/30 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700/50">
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
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">
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
                              {snps.length > 5 && <div className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 flex items-center justify-center text-[7px] font-bold text-slate-400 dark:bg-slate-800">+{snps.length - 5}</div>}
                            </div>
                            <span className="text-slate-400">{regionExpanded ? '－' : '＋'}</span>
                          </div>
                        </button>
                        
                        {regionExpanded && (
                          <div className="p-4 pt-0 space-y-4 border-t border-slate-50 dark:border-slate-700/50 mt-2">
                            <div className="grid grid-cols-1 gap-4 mt-2">
                              {snps.map((snp: any, index: number) => (
                                <SNPCard 
                                  key={`${snp.rsid || snp.markerId || index}-${snp.continent}-${snp.gene || 'none'}-${index}`} 
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
                  allSnpsInCategory.map((snp: any, index: number) => (
                    <SNPCard 
                      key={`${snp.rsid || snp.markerId || index}-${snp.continent}-${snp.gene || 'none'}-${index}`} 
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

const MODERN_POP_NAMES: Record<string, string> = {
  'Nilotic-Omotic': 'East African (Nilotic)',
  'Ancestral-South-Indian': 'South Asian (Dravidian)',
  'North-European-Baltic': 'North European & Baltic',
  'Uralic': 'Siberian & Uralic',
  'Australo-Melanesian': 'Australo-Melanesian',
  'East-Siberean': 'East Siberian',
  'Ancestral-Yayoi': 'Japanese (Yayoi)',
  'Caucasian-Near-Eastern': 'Caucasus & Near East',
  'Tibeto-Burman': 'Tibeto-Burman',
  'Austronesian': 'Southeast Asian (Austronesian)',
  'Central-African-Pygmean': 'Central African (Pygmy)',
  'Central-African-Hunter-Catherers': 'Central African Hunter-Gatherers',
  'Nilo-Sahrian': 'Nilo-Saharan',
  'North-African': 'North African',
  'Gedrosia-Caucasian': 'Caucasus & West Asian',
  'Cushitic': 'East African (Cushitic)',
  'Congo-Pygmean': 'Congo Basin (Pygmy)',
  'Bushmen': 'South African (Khoisan)',
  'South-Meso-Amerindian': 'Mesoamerican & South Amerindian',
  'South-West-European': 'Southwest European',
  'North-Amerindian': 'North Amerindian',
  'Arabic': 'Arabian',
  'North-Circumpolar': 'Arctic & Circumpolar',
  'Kalash': 'Hindukush (Kalash)',
  'Papuan-Australian': 'Papuan & Australian',
  'Baltic-Finnic': 'Baltic Finnic',
  'Bantu': 'West/Central African (Bantu)'
};

const formatPopName = (name: string) => {
  if (!name) return 'Unknown';
  return MODERN_POP_NAMES[name] || name.replace(/-/g, ' ');
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
        <div className="text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">Ancestry Analysis</div>
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
                  <span className="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">{formatPopName(pop.name)}</span>
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
  const [isChartReady, setIsChartReady] = useState(false);
  useEffect(() => {
    setIsChartReady(false);
    const timer = setTimeout(() => setIsChartReady(true), 150);
    return () => clearTimeout(timer);
  }, [oracleResults]);

  const currentData = useMemo(() => {
    if (!oracleResults) return null;
    return oracleResults.primary;
  }, [oracleResults]);

  const endogamyScore = useMemo(() => {
    if (!currentData?.segments) return 0;
    return identifyEndogamy(currentData.segments);
  }, [currentData?.segments]);

  if (!oracleResults) {
    return (
      <div className="mt-12 p-6 border-2 border-indigo-200 dark:border-indigo-800/50 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 shadow-sm">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 text-center">
          Not enough data to generate an ancestry prediction.
        </div>
      </div>
    );
  }

  const { continentalScores, regionalScores, deepScores, subPopulations, chromosomeData, segments, confidenceIntervals } = currentData || { continentalScores: {}, regionalScores: {}, deepScores: {}, subPopulations: {}, chromosomeData: {}, segments: [], confidenceIntervals: {} };
  
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
      </div>

      <div className="mb-6 p-4 bg-white/50 dark:bg-slate-800/30 rounded-lg border border-indigo-100 dark:border-indigo-800/30 text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
        <p><strong>Primary Mode:</strong> Uses only high-quality anchor AIMs for the most stable, conservative prediction.</p>
      </div>
      
      <div className="space-y-8">
        {/* Continental Admixture */}
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/30 shadow-sm">
          <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-400 uppercase tracking-wider mb-4">Continental Admixture</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-64 w-full md:w-1/2 relative min-w-0">
              {isChartReady ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={256} debounce={1}>
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
                    <div className="font-mono text-lg">{Number(data.value || 0).toFixed(1)}%</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl animate-pulse" />
              )}
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
                      <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">{Number(entry.value || 0).toFixed(1)}%</span>
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
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider line-clamp-1">{formatPopName(pop.name)}</span>
                      </div>
                      <div className="flex items-end justify-between">
                    <span className="text-lg font-black text-slate-900 dark:text-slate-100">{(pop.percentage || 0).toFixed(2)}%</span>
                     <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400" title="Euclidean Distance">{(pop.distance || pop.dist || 0).toFixed(3)} D</span>
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

  const enrichedYTree = useMemo(() => {
    return enrichHaplogroupTree(Y_DNA_TREE, yData.path, yData.testedMarkers);
  }, [yData.path, yData.testedMarkers]);

  const enrichedYPath = useMemo(() => {
    if (!yData) return [];
    return (yData.path || []).map((step: string, idx: number) => {
      const details = getHaplogroupDetails(step, false);
      const isLast = idx === (yData.path || []).length - 1;
      return {
        name: (step || '').replace("Haplogroup ", ""),
        region: details.region,
        description: details.description || (isLast ? yData.predicted?.description : "A transitional point in the paternal migration history."),
        historicalContext: details.historicalContext
      };
    });
  }, [yData]);

  const derivedMarkers = yData.testedMarkers.filter((m: any) => m.isDerived);
  const markerPieData = derivedMarkers.map((m: any) => ({
    name: m.marker,
    branch: (m.branch || 'Unknown').replace("Haplogroup ", ""),
    value: 1
  }));

  return (
    <div className="animate-fade-up space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <YDNABento yData={yData} />
      </div>
      

      {/* Paternal Odyssey Migration Story */}
      {enrichedYPath.length > 0 && (
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center justify-between mb-12 relative z-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Your Paternal Odyssey</h3>
                  <p className="text-sm text-slate-400 font-medium mt-1">Tracing the geographic and genetic path of your ancestors</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                   <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                   <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">Ancient to Modern</span>
                </div>
              </div>

              <div className="relative pl-8 md:pl-12 ml-2 md:ml-4 space-y-12 md:space-y-16 before:absolute before:left-0 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-blue-50 before:via-indigo-500 before:to-transparent">
                {enrichedYPath.map((step: any, idx: number) => {
                  const isFirst = idx === 0;
                  const isLast = idx === enrichedYPath.length - 1;
                  
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative group cursor-default"
                    >
                      {/* Node Pin */}
                      <div className={`absolute -left-[44px] md:-left-[64px] top-0 w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center z-10 transition-all group-hover:rotate-12 ${
                        isLast ? 'bg-blue-600 scale-110 rotate-12' : isFirst ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                      }`}>
                        <span className={`text-[10px] md:text-[11px] font-black ${isLast || isFirst ? 'text-white' : 'text-slate-500'}`}>{idx + 1}</span>
                      </div>

                      <div className="bg-slate-50/40 dark:bg-slate-900/40 p-4 sm:p-8 rounded-3xl border border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-900/30 transition-all group-hover:shadow-xl group-hover:shadow-blue-100/50 dark:group-hover:shadow-none">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="space-y-1">
                            <h4 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none group-hover:text-blue-600 transition-colors">
                              {step.name === "Y-DNA Root (Adam)" ? "Y-Chromosomal Adam" : step.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.1em] uppercase">Originates in: {step.region}</span>
                            </div>
                          </div>
                          <div className="shrink-0 flex items-center gap-3">
                             {isFirst && <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-[9px] font-black text-indigo-600 tracking-widest border border-indigo-100 dark:border-indigo-800 uppercase">Ancestor</span>}
                             {isLast && <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-[9px] font-black text-blue-600 tracking-widest border border-blue-100 dark:border-blue-800 uppercase">You Are Here</span>}
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                          {step.description}
                        </p>

                        {step.historicalContext && (
                          <div className="mb-6 p-4 bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-blue-400 rounded-r-xl">
                            <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-1">Historical Context</div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                              {step.historicalContext}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 2 Analysis Panel */}
      <Phase2Panel
        phase2={yData.phase2}
        phase1Haplogroup={yData.predicted?.name ?? null}
      />
    </div>
  );
});

const MTDNAView = memo(({ mtData, treeSearchTerm, setTreeSearchTerm, matchedTraits }: { 
  mtData: any, 
  treeSearchTerm: string, 
  setTreeSearchTerm: (val: string) => void,
  matchedTraits: any[]
}) => {
  const enrichedMtTree = useMemo(() => {
    return enrichHaplogroupTree(MT_DNA_TREE, mtData.path, mtData.testedMarkers);
  }, [mtData.path, mtData.testedMarkers]);

  const findNode = useCallback((name: string, node: any = enrichedMtTree): any | null => {
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
    if (!mtData) return [];
    return (mtData.path || []).map((step: string, idx: number) => {
      const node = findNode(step);
      // Fallback for nodes not in our primary tree (e.g., deep subclades)
      const isLast = idx === (mtData.path || []).length - 1;
      return {
        name: (step || '').replace("Haplogroup ", ""),
        region: node?.region || (isLast ? mtData.region : "Global"),
        description: node?.description || (isLast ? `Your most specific maternal lineage branch: ${(step || '').replace("Haplogroup ", "")}.` : "A transitional point in the maternal migration history."),
        historicalContext: node?.historicalContext,
        mutations: node?.mutations || []
      };
    });
  }, [mtData, findNode]);

  if (!mtData) return null;

  const derivedMarkers = mtData.testedMarkers.filter((m: any) => m.status === 'derived');
  const markerPieData = derivedMarkers.map((m: any) => {
    const branch = ((mtData.path || []).find((p: string) => p && typeof p === 'string' && p.includes(m.mutation)) || mtData.predicted || 'Root').replace("Haplogroup ", "");
    return {
      name: m.mutation,
      branch: branch,
      value: 1
    };
  });

  return (
    <div className="animate-fade-up space-y-8 pb-12">
      {/* Hero Prediction Section */}
      <div className="grid grid-cols-1 gap-6">
        <HaplogroupBento predictedMt={mtData} />
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
                 <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">Ancient to Modern</span>
              </div>
            </div>

            <div className="relative pl-8 md:pl-12 ml-2 md:ml-4 space-y-12 md:space-y-16 before:absolute before:left-0 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-rose-500 before:via-pink-500 before:to-transparent">
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
                    <div className={`absolute -left-[44px] md:-left-[64px] top-0 w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center z-10 transition-all group-hover:rotate-12 ${
                      isLast ? 'bg-rose-600 scale-110 rotate-12' : isFirst ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                    }`}>
                      <span className={`text-[10px] md:text-[11px] font-black ${isLast || isFirst ? 'text-white' : 'text-slate-500'}`}>{idx + 1}</span>
                    </div>

                    <div className="bg-slate-50/40 dark:bg-slate-900/40 p-4 sm:p-8 rounded-3xl border border-transparent group-hover:border-rose-200 dark:group-hover:border-rose-900/30 transition-all group-hover:shadow-xl group-hover:shadow-rose-100/50 dark:group-hover:shadow-none">
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
                                (mtData.userMutations || []).includes(m)
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
                  <div className="text-[10px] text-slate-500 uppercase font-bold dark:text-slate-400">Markers</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{c.aimCount.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold dark:text-slate-400">AIMs</div>
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
              <span className="text-xs font-bold text-slate-500 uppercase dark:text-slate-400">Matched SNPs</span>
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{coverage?.matched.toLocaleString()}</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-1000" 
                style={{ width: `${coverage?.percent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed dark:text-slate-400">
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
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 dark:text-slate-400">Chip Detection</div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{activeDataset?.chip || 'No file uploaded'}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 dark:text-slate-400">Last Update</div>
              <div className="text-xs font-mono text-slate-400">2026-04-16</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  // PWA Register service worker hooks
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      console.log('SW registration error: ', error);
    },
  });

  // PWA Custom Installation trigger
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!installPromptEvent) return;
    installPromptEvent.prompt();
    const { outcome } = await installPromptEvent.userChoice;
    console.log(`User installation choice outcome: ${outcome}`);
    setInstallPromptEvent(null);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [snps, setSnps] = useState<SNP[]>(SNP_DB);
  const [datasets, setDatasets] = useState<{ 
    name: string, 
    results: any[], 
    chip?: string, 
    snpCount?: number, 
    predictedYDNA?: any, 
    predictedMtDNA?: any,
    mergedMtMap?: Record<string, string>,
    prsResults?: any,
    pgxResults?: any,
    rareAndNovelVariants?: any[],
    mergedSnpMap?: Record<string, string>,
    mergedSnpMetaMap?: Record<string, { chrom: string, pos: number }>,
    analysis?: any
  }[]>([]);
  const [activeDatasetIndex, setActiveDatasetIndex] = useState(0);
  const [ancientAdmixture, setAncientAdmixture] = useState<any[]>([]);
  const [populationProximity, setPopulationProximity] = useState<any[]>([]);
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
  const [streamProgress, setStreamProgress] = useState<{
    processed: number;
    total: number;
    snps: number;
    step: string;
    percent?: number;
  }>({ processed: 0, total: 0, snps: 0, step: "Ready", percent: 0 });
  const [dragging, setDragging] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [error, setError] = useState<any | null>(null);
  const [selectedSubPop, setSelectedSubPop] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [expandedSnps, setExpandedSnps] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'summary' | 'autosomal' | 'ancestry' | 'history' | 'health_traits' | 'markers' | 'rare_variants' | 'debug' | 'methodology' | 'desktop' | 'ai_agent' | 'kit_comparison' | 'export'>('dashboard');
  const [currentApp, setCurrentApp] = useState<string | null>(null);

  const [isPrinting, setIsPrinting] = useState(false);
  const [printConfig, setPrintConfig] = useState<ExportConfig | null>(null);

  const [activeAncestrySubTab, setActiveAncestrySubTab] = useState<'oracle' | 'painter' | 'scout'>('oracle');
  const [activeHealthSubTab, setActiveHealthSubTab] = useState<'wellness' | 'traits' | 'blood' | 'prs'>('wellness');
  const [activeHistorySubTab, setActiveHistorySubTab] = useState<'modern' | 'ancient'>('modern');

  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Health');
  const [activeHaploType, setActiveHaploType] = useState<'paternal' | 'maternal'>('paternal');
  const [activeAncientSubTab, setActiveAncientSubTab] = useState<'admixture' | 'matches'>('admixture');
  const [isPrivacyExpanded, setIsPrivacyExpanded] = useState(false);
  const [treeSearchTerm, setTreeSearchTerm] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [humanOriginsResults, setHumanOriginsResults] = useState<any[]>([]);
  const [grafResults, setGrafResults] = useState<any[]>([]);
  const [microHapResults, setMicroHapResults] = useState<any[]>([]);

  // Removed main-thread GRAF calculation useEffect

  const expandAll = (categories: string[]) => {
    setExpandedCategories(new Set(categories));
  };

  const collapseAll = (categories: string[]) => {
    setExpandedCategories(new Set());
  };

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



  const toggleExpand = useCallback((rsid: string) => {
    setExpandedSnps(prev => {
      const next = new Set(prev);
      if (next.has(rsid)) next.delete(rsid);
      else next.add(rsid);
      return next;
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      const saved = await loadResults();
      if (saved) {
        let hasChanges = false;
        const updated = await Promise.all(saved.map(async (ds: any, idx: number) => {
          // Backward compatibility: reconstruct mergedSnpMap if missing but results exist
          if (!ds.mergedSnpMap && ds.results) {
            console.log("Reconstructing mergedSnpMap from results for:", ds.name);
            const reconstructed: Record<string, string> = {};
            ds.results.forEach((r: any) => {
              const rsid = (r.rsid || r.markerId || "").toLowerCase();
              if (rsid && r.genotype && r.genotype !== '--') {
                reconstructed[rsid] = r.genotype;
              }
            });
            ds.mergedSnpMap = reconstructed;
            hasChanges = true;
          }

          if (ds.mergedSnpMap) {
            snpMaps.current[idx] = ds.mergedSnpMap;
          }

          if (ds.analysis && ds.mergedSnpMap) {
            const isCollapsed = !ds.analysis.subpopulationOracle || 
              !ds.analysis.subpopulationOracle.admixtureMix || 
              ds.analysis.subpopulationOracle.admixtureMix.length <= 1 ||
              (ds.analysis.subpopulationOracle.admixtureMix.length === 1 && 
               ds.analysis.subpopulationOracle.admixtureMix[0].percentage === 100);
            
            if (isCollapsed) {
              console.log("Recalculating subpopulationOracle for cached dataset:", ds.name);
              const userGenotypes = Object.entries(ds.mergedSnpMap).map(([rsid, genotype]) => ({ rsid, genotype: genotype as string }));
              const freshOracle = await processSubpopulations(userGenotypes, []);
              ds.analysis.subpopulationOracle = freshOracle;
              hasChanges = true;
            }
          }
          return ds;
        }));
        setDatasets(updated);
        if (hasChanges) {
          saveResults(updated);
        }
      }
    };
    init();
  }, []);

  const updateDatasets = async (newDataset: { 
    name: string, 
    results: any[], 
    chip?: string, 
    snpCount?: number, 
    predictedYDNA?: any, 
    predictedMtDNA?: any,
    mergedMtMap?: Record<string, string>,
    analysis?: any,
    mergedSnpMap?: Record<string, string>,
    mergedSnpMetaMap?: Record<string, { chrom: string; pos: number }>,
    rareAndNovelVariants?: any[]
  }) => {
    const newDatasets = [...datasets, newDataset];
    setDatasets(newDatasets);
    
    // Update local GRAF results state if available in the newest dataset
    if (newDataset.analysis?.humanOriginsResults_raw) {
      setHumanOriginsResults(newDataset.analysis.humanOriginsResults_raw);
    }
    if (newDataset.analysis?.grafResults) {
      setGrafResults(newDataset.analysis.grafResults);
    }
    if (newDataset.analysis?.microHapResults) {
      setMicroHapResults(newDataset.analysis.microHapResults);
    }

    saveResults(newDatasets);
    setActiveDatasetIndex(newDatasets.length - 1);
  };

  useEffect(() => {
    if (datasets[activeDatasetIndex]?.analysis?.humanOriginsResults_raw) {
      setHumanOriginsResults(datasets[activeDatasetIndex].analysis.humanOriginsResults_raw);
    }
    if (datasets[activeDatasetIndex]?.analysis?.grafResults) {
      setGrafResults(datasets[activeDatasetIndex].analysis.grafResults);
    }
    if (datasets[activeDatasetIndex]?.analysis?.microHapResults) {
      setMicroHapResults(datasets[activeDatasetIndex].analysis.microHapResults);
    }
  }, [activeDatasetIndex, datasets]);

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
    // Legacy jsPDF export, now deprecated by ExportModule
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

  const handleGenerateReport = (config: ExportConfig) => {
    setPrintConfig(config);
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  useEffect(() => {
    const handleAfterPrint = () => setIsPrinting(false);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const resetApp = async () => {
    // Clear dataset state
    setDatasets([]);
    setActiveDatasetIndex(0);
    
    // Clear local storage and IndexedDB results
    await clearResults();

    // Clear all service worker registrations to force a fresh download
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      } catch (err) {
        console.error('Failed to unregister service worker:', err);
      }
    }

    // Clear all browser caches (CacheStorage) to free up memory and storage
    if ('caches' in window) {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
      } catch (err) {
        console.error('Failed to clear cache storage:', err);
      }
    }

    // Perform a clean reload from the server, bypassing cache
    window.location.reload();
  };


  const processFiles = useCallback(async (files: FileList | File[]) => {
    setProcessing(true);
    setError(null);
    let fileArray = Array.isArray(files) ? files : Array.from(files);

    try {
      const expandedFiles: File[] = [];
      for (const file of fileArray) {
        if (file.name.toLowerCase().endsWith('.zip')) {
          if (file.size > 50 * 1024 * 1024) {
            throw new Error(`The ZIP file "${file.name}" is too large to safely extract in the browser. Please extract it on your computer and upload the uncompressed raw text or VCF file directly. Streaming supports massive files!`);
          }
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
      setError(e instanceof Error ? e.message : `Failed to process zip file: ${String(e)}`);
      setProcessing(false);
      return;
    }

    setStreamProgress({
      processed: 0,
      total: fileArray.reduce((acc, f) => acc + f.size, 0),
      snps: 0,
      step: "Ingesting DNA stream..."
    });

    let intervalId: any = null;
    let watchdogId: any = null;
    let lastProgressTime = Date.now();

    try {
      // Pass the raw File objects so the worker can use the asynchronous streaming parser to avoid blocking the event loop
      const fileContents = fileArray.map((file) => {
        return {
          file,
          name: file.name
        };
      });

      const worker = new Worker(new URL('./workers/genotypeWorker.ts', import.meta.url), { type: 'module' });
      
      watchdogId = setInterval(() => {
        if (Date.now() - lastProgressTime > 25000) {
          if (intervalId) clearInterval(intervalId);
          clearInterval(watchdogId);
          setError("ERR_WORKER_TIMEOUT_03: The genetic analysis worker stopped responding. Your dataset may be exceptionally large or heavily compressed. Please refresh and try extracting the ZIP first.");
          setProcessing(false);
          worker.terminate();
        }
      }, 5000);

      let sab: SharedArrayBuffer | null = null;
      let progressArray: Int32Array | null = null;

      if (typeof SharedArrayBuffer !== 'undefined' && typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated) {
        try {
          sab = new SharedArrayBuffer(16);
          progressArray = new Int32Array(sab);
          progressArray[0] = 0; // bytes processed
          progressArray[1] = fileArray.reduce((acc, f) => acc + f.size, 0); // total bytes
          progressArray[2] = 0; // matches found
          progressArray[3] = 1; // status (1 = parsing, 2 = analyzing, 3 = finished, 4 = error)

          intervalId = setInterval(() => {
            if (progressArray) {
              const processed = Atomics.load(progressArray, 0);
              const total = Atomics.load(progressArray, 1);
              const snps = Atomics.load(progressArray, 2);
              const statusVal = Atomics.load(progressArray, 3);

              let step = "Ingesting DNA stream...";
              let percent = 0;

              if (statusVal === 1) {
                step = "Ingesting DNA stream...";
                percent = total > 0 ? Math.round((processed / total) * 50) : 0;
              } else if (statusVal === 2) {
                step = "Engaging Bayesian Ancestry Engine...";
                percent = total > 0 ? 50 + Math.round((processed / total) * 45) : 50;
              } else if (statusVal === 3) {
                step = "Completing Profiler...";
                percent = 100;
              } else if (statusVal === 4) {
                step = "Ingestion failed.";
                clearInterval(intervalId);
                setError("Processing failed in background worker.");
                setProcessing(false);
                worker.terminate();
                return;
              }

              setStreamProgress({ processed, total, snps, step, percent });
            }
          }, 60);
        } catch (e) {
          console.warn("SharedArrayBuffer restriction active: Falling back to direct worker message passing.", e);
        }
      }

      worker.onmessage = (e) => {
        lastProgressTime = Date.now();
        const { type, payload, error: workerError } = e.data;
        if (type === 'PROGRESS') {
          const { processed, total, snps, step, completed, totalEngines, statusVal } = payload;
          setStreamProgress(prev => {
            const newProcessed = processed !== undefined ? processed : prev.processed;
            const newTotal = total !== undefined ? total : prev.total;
            const newSnps = snps !== undefined ? snps : prev.snps;
            
            let percent = prev.percent || 0;
            if (statusVal === 2 || (completed !== undefined && totalEngines !== undefined)) {
              percent = 50 + Math.round((completed / totalEngines) * 45);
            } else if (statusVal === 3) {
              percent = 100;
            } else {
              percent = newTotal > 0 ? Math.round((newProcessed / newTotal) * 50) : 0;
            }

            return {
              processed: newProcessed,
              total: newTotal,
              snps: newSnps,
              step: step || prev.step || "Ingesting DNA stream...",
              percent
            };
          });
        } else if (type === 'SUCCESS') {
          if (intervalId) clearInterval(intervalId);
          if (watchdogId) clearInterval(watchdogId);
          const newIndex = datasets.length;
          snpMaps.current[newIndex] = payload.mergedSnpMap;
          updateDatasets({ 
            name: payload.name, 
            results: payload.results,
            chip: payload.chip,
            snpCount: payload.snpCount,
            predictedYDNA: payload.predictedYDNA,
            predictedMtDNA: payload.predictedMtDNA,
            mergedMtMap: payload.mergedMtMap,
            analysis: payload.analysis,
            mergedSnpMap: payload.mergedSnpMap,
            mergedSnpMetaMap: payload.mergedSnpMetaMap,
            rareAndNovelVariants: payload.rareAndNovelVariants
          });
          setPendingFiles([]);
          setProcessing(false);
          worker.terminate();
        } else if (type === 'ERROR') {
          if (intervalId) clearInterval(intervalId);
          if (watchdogId) clearInterval(watchdogId);
          setError(workerError?.message || workerError || "Processing failed in background worker.");
          setProcessing(false);
          worker.terminate();
        }
      };

      worker.onerror = (err) => {
        if (intervalId) clearInterval(intervalId);
        if (watchdogId) clearInterval(watchdogId);
        setError(`Worker error: ${err.message}`);
        setProcessing(false);
        worker.terminate();
      };

      // Ship the processing request to the worker, passing the File objects directly
      worker.postMessage({ 
        type: 'PROCESS_GENOME', 
        files: fileContents,
        sab
      });
    } catch (err) {
      if (intervalId) clearInterval(intervalId);
      if (watchdogId) clearInterval(watchdogId);
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
    const dataset = datasets[activeDatasetIndex];
    if (!dataset?.analysis?.oracleResults) return null;
    const oracle = dataset.analysis.oracleResults;

    const processOracle = (data: any) => {
      const { continentalScores: rawContinentalScores, regionalScores, deepScores, subPopulations, chromosomeData } = data;
      const continentalScores = Object.entries(rawContinentalScores).reduce((acc: Record<string, number>, [continent, score]) => {
        const region = mapToRegion(continent);
        acc[region] = (acc[region] || 0) + (score as number);
        return acc;
      }, {});
      return { continentalScores, regionalScores, deepScores, subPopulations, chromosomeData };
    };

    return {
      primary: processOracle(oracle.primary),
      engine: humanOriginsResults
    };
  }, [datasets, activeDatasetIndex, humanOriginsResults]);

  useEffect(() => {
    const dataset = datasets[activeDatasetIndex];
    if (!dataset) {
      setAncientAdmixture([]);
      return;
    }
    if (dataset.analysis?.ancientAdmixture) {
      setAncientAdmixture(dataset.analysis.ancientAdmixture);
      return;
    }
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) {
      setAncientAdmixture([]);
      return;
    }
    calculateAncientAdmixture(snpMap).then(res => {
      setAncientAdmixture(res);
    }).catch(err => {
      console.error("Ancient Admixture Error:", err);
      setAncientAdmixture([]);
    });
  }, [datasets, activeDatasetIndex, datasets[activeDatasetIndex]?.analysis?.ancientAdmixture]);

  const archaicIntrogression = useMemo(() => {
    const dataset = datasets[activeDatasetIndex];
    if (dataset?.analysis?.archaicIntrogression) return dataset.analysis.archaicIntrogression;
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return null;
    return calculateArchaicIntrogression(snpMap);
  }, [datasets, activeDatasetIndex]);

  const individualMatches = useMemo(() => {
    const dataset = datasets[activeDatasetIndex];
    if (dataset?.analysis?.individualMatches) return dataset.analysis.individualMatches;
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return [];
    return calculateIndividualMatches(snpMap);
  }, [datasets, activeDatasetIndex]);

  const famousMatches = useMemo(() => {
    const dataset = datasets[activeDatasetIndex];
    if (dataset?.analysis?.famousMatches) return dataset.analysis.famousMatches;
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return [];
    return calculateFamousMatches(snpMap);
  }, [datasets, activeDatasetIndex]);

  const healthWellnessMatches = useMemo(() => {
    const dataset = datasets[activeDatasetIndex];
    if (dataset?.analysis?.healthWellness) return dataset.analysis.healthWellness;
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return [];
    return matchHealthAndWellness(snpMap);
  }, [datasets, activeDatasetIndex]);

  useEffect(() => {
    const dataset = datasets[activeDatasetIndex];
    if (!dataset) {
      setPopulationProximity([]);
      return;
    }
    if (dataset.analysis?.populationProximity) {
      setPopulationProximity(dataset.analysis.populationProximity);
      return;
    }
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) {
      setPopulationProximity([]);
      return;
    }
    calculatePopulationProximity(snpMap).then(res => {
      setPopulationProximity(res);
    }).catch(err => {
      console.error("Population Proximity Error:", err);
      setPopulationProximity([]);
    });
  }, [datasets, activeDatasetIndex, datasets[activeDatasetIndex]?.analysis?.populationProximity]);

  const markerBenchmarks = useMemo(() => {
    const dataset = datasets[activeDatasetIndex];
    if (dataset?.analysis?.markerBenchmarks) return dataset.analysis.markerBenchmarks;
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return [];
    return calculateMarkerBenchmarks(snpMap);
  }, [datasets, activeDatasetIndex]);

  const historicalClusterMatches = useMemo(() => {
    const dataset = datasets[activeDatasetIndex];
    if (!dataset) return [];
    
    const mtHaplo = dataset.predictedMtDNA?.predicted;
    const yHaplo = dataset.predictedYDNA?.predicted?.name;
    
    return calculateHistoricalClusterMatches(mtHaplo, yHaplo);
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
        const alleleStr = trait.allele || '';
        if (alleleStr.includes('>')) {
          const [ancestral, derived] = alleleStr.split('>');
          return userAllele.toUpperCase() === derived.trim().toUpperCase();
        }
        
        // Sometimes it's just the derived allele
        return userAllele.toUpperCase() === alleleStr.trim().toUpperCase();
    });
  }, [datasets, activeDatasetIndex]);

  if (isPrinting && printConfig) {
    return (
      <PrintableView 
        config={printConfig}
        dataset={datasets[activeDatasetIndex]}
        healthImpacts={healthWellnessMatches}
        oracleResults={oracleResults}
      />
    );
  }

  return (
    <div className={`bg-[#030712] text-slate-100 font-sans relative overflow-x-hidden ${!results ? 'min-h-dvh bg-slate-50 text-slate-800' : ''}`}>
      {/* Dynamic Premium Mesh Background (Light Mode) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-400/10 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-pulse-soft"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-sky-400/10 rounded-full blur-[150px] mix-blend-multiply opacity-50"></div>
      </div>
      <div className="relative z-10">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          setCurrentApp(null);
        }} 
        onUploadNew={() => fileRef.current?.click()}
        hasResults={!!results}
        theme={theme}
        onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        isInstallable={!!installPromptEvent}
        onInstallApp={handleInstallApp}
        onReset={resetApp}
      />

      <input 
        ref={fileRef} 
        type="file" 
        className="hidden" 
        accept=".csv,.txt,.zip" 
        multiple 
        onChange={(e) => {
          if (e.target.files) {
            setError(null);
            const newFiles = Array.from(e.target.files);
            setPendingFiles(prev => [...prev, ...newFiles]);
          }
        }} 
      />

      {!results ? (
        <>
      <main className="max-w-[1360px] mx-auto px-1 sm:px-6 md:px-8 pt-24 sm:pt-28">

        {error && (
          (() => {
            const isDetailed = typeof error === 'object' && error !== null;
            const errMsg = isDetailed ? (error.message || "An unexpected error occurred during processing.") : error;
            const details = isDetailed ? error.details : null;
            const category = isDetailed ? (details?.errorCategory || error.name || "Analytical Mismatch") : "Process Aborted";

            // Generate a simple deterministic error code based on the string value
            const generateErrorCode = (str: string) => {
              let hash = 0;
              for (let i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash |= 0;
              }
              return 'ERR-' + Math.abs(hash).toString(16).toUpperCase();
            };
            const errorCode = generateErrorCode(String(errMsg));

            return (
              <div className="mb-12 p-8 rounded-[2.5rem] bg-white border border-rose-100 shadow-xl shadow-rose-100/40 animate-fade-in relative overflow-hidden z-50 dark:bg-slate-900">
                {/* Visual border gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-pink-400 to-amber-400" />
                
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Decorative Amber Warning Circle */}
                  <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 flex items-center justify-center shrink-0 w-14 h-14">
                    <span className="text-2xl">⚠️</span>
                  </div>

                  <div className="flex-1">
                    <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-rose-100">
                      {category}
                    </span>
                    
                    <h3 className="text-xl font-extrabold text-slate-800 mt-3 mb-2 dark:text-slate-200">
                      Genomic Analysis Blocked
                    </h3>
                    
                    <p className="text-slate-600 font-semibold text-sm leading-relaxed mb-6 dark:text-slate-400">
                      {errMsg}
                    </p>

                    <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between dark:bg-slate-800">
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide dark:text-slate-400">Support Reference Code</div>
                        <div className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">{errorCode}</div>
                      </div>
                      <button 
                        onClick={() => navigator.clipboard.writeText(`Error: ${errMsg}\nCode: ${errorCode}`)}
                        className="text-xs px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm font-bold text-slate-600 hover:text-slate-900 hover:border-slate-300 active:bg-slate-100 transition-colors dark:text-slate-400 dark:bg-slate-900"
                      >
                        Copy Error
                      </button>
                    </div>

                    {details?.suggestedSolution && (
                      <div className="mb-6 p-5 bg-teal-50/50 rounded-2xl border border-teal-100/60">
                        <h4 className="text-teal-800 font-extrabold text-xs uppercase tracking-widest mb-1.5">
                          🟢 Recommended Peer Action:
                        </h4>
                        <p className="text-slate-700 text-xs font-semibold leading-relaxed dark:text-slate-300">
                          {details.suggestedSolution}
                        </p>
                      </div>
                    )}

                    {/* Troubleshooting suggestions list */}
                    <div className="mb-6">
                      <h4 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-3 dark:text-slate-400">
                        Troubleshooting Guidelines:
                      </h4>
                      <ul className="space-y-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2.5">
                          <span className="text-teal-500 shrink-0">📎</span>
                          <span><strong>Format:</strong> Tab-delimited (.txt) or comma-separated (.csv) raw genome file.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-teal-500 shrink-0">📎</span>
                          <span><strong>Encoding:</strong> ASCII or UTF-8 text representation (not zipped with passwords, and not PDF/raw image).</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-teal-500 shrink-0">📎</span>
                          <span><strong>Content:</strong> Must align with standard SNP templates including rsIDs (e.g. <code>rs3094315</code>) and allele combinations.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Collapsible Technical Diagnostics */}
                    {isDetailed && (
                      <details className="group border-t border-slate-100 pt-6">
                        <summary className="list-none flex items-center justify-between text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer select-none">
                          <span className="flex items-center gap-1.5">
                            ⚙️ Technical Telemetry Diagnostics Log
                          </span>
                          <span className="transition-transform group-open:rotate-180">
                            ▼
                          </span>
                        </summary>
                        
                        <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/60 font-mono text-[11px] leading-relaxed text-slate-600 space-y-2 overflow-auto dark:text-slate-400 dark:bg-slate-800">
                          <div><strong className="text-slate-700 dark:text-slate-300">Error Category:</strong> {details?.errorCategory || category}</div>
                          {details?.bytesTotal !== undefined && (
                            <div><strong className="text-slate-700 dark:text-slate-300">File Ingestion Size:</strong> {(details.bytesTotal / (1024 * 1024)).toFixed(2)} MB ({details.bytesTotal.toLocaleString()} bytes)</div>
                          )}
                          {details?.linesTotal !== undefined && (
                            <div><strong className="text-slate-700 dark:text-slate-300">Total Rows Read:</strong> {details.linesTotal.toLocaleString()}</div>
                          )}
                          {details?.linesCommented !== undefined && (
                            <div><strong className="text-slate-700 dark:text-slate-300">Comment Headers Found:</strong> {details.linesCommented.toLocaleString()}</div>
                          )}
                          {details?.linesMalformed !== undefined && (
                            <div><strong className="text-slate-700 dark:text-slate-300">Malformed/Unrecognized Rows:</strong> {details.linesMalformed.toLocaleString()}</div>
                          )}
                          {details?.headerPreview && (
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mt-3">
                              <strong className="text-slate-700 dark:text-slate-300 block mb-1.5">Raw File Header Preview:</strong>
                              <pre className="p-3 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl overflow-x-auto select-all max-h-32 text-[10px] leading-normal font-mono">
                                {details.headerPreview}
                              </pre>
                            </div>
                          )}
                        </div>
                      </details>
                    )}
                  </div>

                  <button 
                    onClick={() => setError(null)} 
                    className="p-2 hover:bg-slate-100 active:bg-slate-200 rounded-full transition-all text-slate-400 hover:text-slate-600 self-end md:self-start md:mt-2 cursor-pointer"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })()
        )}

        {processing && (
          <GenotypeParser streamProgress={streamProgress} />
        )}

        {!results && !processing && (
          <>
            <HeroUpload 
              onFiles={(files) => processFiles(files)} 
              processing={processing} 
              onReset={resetApp}
            />
            <div className="max-w-4xl mx-auto mt-8 px-4">
              <AdBanner format="auto" className="rounded-2xl" />
            </div>
          </>
        )}
      </main>
        </>
      ) : (
        <>
          {error ? (
            (() => {
              const isDetailed = typeof error === 'object' && error !== null;
              const errMsg = isDetailed ? (error.message || "An unexpected error occurred.") : error;
              return (
                <div className="fixed top-10 left-0 right-0 z-50 px-4 py-3 bg-rose-900/90 border-b border-rose-500/30 text-rose-200 text-xs font-bold flex items-center justify-between gap-3">
                  <span>⚠️ {errMsg}</span>
                  <button onClick={() => setError(null)} className="text-rose-300 hover:text-white px-2 py-1 rounded" aria-label="Dismiss error">✕</button>
                </div>
              );
            })()
          ) : null}

          {processing ? (
            <div className="fixed top-10 left-0 right-0 z-50"><GenotypeParser streamProgress={streamProgress} /></div>
          ) : null}

          {pendingFiles.length > 0 ? (
            <div className="fixed top-10 left-0 right-0 z-50 px-6 py-3 bg-teal-900/95 border-b border-teal-500/30 flex items-center justify-between gap-4">
              <span className="text-teal-200 text-xs font-bold">{pendingFiles.length} Kit(s) pending — {pendingFiles.map(f => f.name).join(', ')}</span>
              <div className="flex gap-2">
                <button onClick={() => setPendingFiles([])} className="px-3 py-1.5 text-xs font-black text-teal-400 hover:text-teal-200 border border-teal-700 rounded-lg">Cancel</button>
                <button onClick={() => { processFiles(pendingFiles); setPendingFiles([]); }} className="px-4 py-1.5 text-xs font-black bg-teal-600 hover:bg-teal-500 text-white rounded-lg">Analyze</button>
              </div>
            </div>
          ) : null}


          <ScoutWorkspace
            oracleResults={oracleResults}
            populationProximity={populationProximity}
            dataset={datasets[activeDatasetIndex]}
            userSnps={snpMaps.current[activeDatasetIndex] || {}}
            datasets={datasets}
            activeDatasetIndex={activeDatasetIndex}
            setActiveDatasetIndex={setActiveDatasetIndex}
            onNavigateToTab={(tab: string, subTab?: string) => {
              setActiveTab(tab as any);
              if (tab === 'ancestry' && subTab) {
                setActiveAncestrySubTab(subTab as any);
              } else if (tab === 'health_traits' && subTab) {
                setActiveHealthSubTab(subTab as any);
              } else if (tab === 'history' && subTab) {
                setActiveHistorySubTab(subTab as any);
              }
            }}
            onReset={resetApp}
            currentApp={currentApp}
            onOpenApp={setCurrentApp}
          >
            <Suspense fallback={
                  <div className="flex flex-col items-center justify-center py-24 text-slate-500 animate-pulse dark:text-slate-400">
                    <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4" />
                    <p className="font-bold tracking-widest uppercase text-xs">Loading Tool...</p>
                  </div>
                }>
            {currentApp === 'profile' && (
              <div className="space-y-8 animate-fade-in">
                <ProfileSummary 
                  datasets={datasets} 
                  activeDatasetIndex={activeDatasetIndex} 
                  oracleResults={oracleResults} 
                  populationProximity={populationProximity}
                  userSnps={snpMaps.current[activeDatasetIndex] || {}}
                  famousMatches={famousMatches}
                  healthImpacts={healthWellnessMatches}
                />
              </div>
            )}

            {currentApp === 'ancestry_oracle' && (
              <div className="space-y-8 animate-fade-in">
                <SubpopulationBento 
                  precalculated={datasets[activeDatasetIndex]?.analysis?.subpopulationOracle}
                  userGenotypes={Object.entries(snpMaps.current[activeDatasetIndex] || {}).map(([rsid, genotype]) => ({ rsid, genotype }))}
                  aimsDatabase={Object.values(masterAims as any).map((aim: any) => ({
                    rsid: aim.rsid,
                    chromosome: aim.chromosome || 'Unknown',
                    subpop: aim.region,
                    continent: aim.region || 'Unknown',
                    alleles: Array.isArray(aim.alleles) ? aim.alleles.join(',') : (aim.alleles || '')
                  }))}
                />
                <ModernAncestryOracle results={oracleResults} dataset={datasets[activeDatasetIndex]} onOpenMethodology={() => setIsMethodologyOpen(true)} mode="analyst" />
              </div>
            )}

            {currentApp === 'chromosome_painter' && (
              <div className="animate-fade-in">
                <ChromosomePainterView 
                  dataset={datasets[activeDatasetIndex]}
                  onOpenMethodology={() => setIsMethodologyOpen(true)}
                />
              </div>
            )}

            {currentApp === 'ancestry_scout' && (
              <div className="animate-fade-in">
                <NaiveAncestryOracle 
                  results={datasets[activeDatasetIndex]?.analysis || {}} 
                  userSnps={snpMaps.current[activeDatasetIndex] || {}}
                  onOpenMethodology={() => setIsMethodologyOpen(true)} 
                />
              </div>
            )}

            {currentApp === 'haplogroups' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex justify-center mb-8">
                  <div className="inline-flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <button 
                      onClick={() => setActiveHaploType('paternal')}
                      className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeHaploType === 'paternal' ? 'bg-teal-600 text-white shadow-lg scale-105' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-400'}`}
                    >
                      ♂️ Paternal
                    </button>
                    <button 
                      onClick={() => setActiveHaploType('maternal')}
                      className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeHaploType === 'maternal' ? 'bg-teal-600 text-white shadow-lg scale-105' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-400'}`}
                    >
                      ♀️ Maternal
                    </button>
                  </div>
                </div>

                {activeHaploType === 'paternal' ? (
                  <YDNAView 
                    yData={datasets[activeDatasetIndex].predictedYDNA} 
                    treeSearchTerm={treeSearchTerm}
                    setTreeSearchTerm={setTreeSearchTerm}
                  />
                ) : (
                  <MTDNAView 
                    mtData={datasets[activeDatasetIndex].predictedMtDNA} 
                    treeSearchTerm={treeSearchTerm}
                    setTreeSearchTerm={setTreeSearchTerm}
                    matchedTraits={userMatchedMitoTraits}
                  />
                )}
              </div>
            )}

            {currentApp === 'ancient_dna' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex justify-center">
                  <div className="p-1.5 bg-slate-100 dark:bg-[#111213]/40 rounded-2xl inline-flex border border-slate-200 dark:border-white/5 shadow-inner">
                    <button
                      onClick={() => setActiveAncientSubTab('admixture')}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        activeAncientSubTab === 'admixture' 
                          ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md scale-105' 
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <History size={14} /> Ancient Admixture
                    </button>
                    <button
                      onClick={() => setActiveAncientSubTab('matches')}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        activeAncientSubTab === 'matches' 
                          ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md scale-105' 
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <User size={14} /> Sample Matches
                    </button>
                  </div>
                </div>

                {activeAncientSubTab === 'admixture' ? (
                  <div className="space-y-8 animate-fade-in">
                    <AncientAncestryOracle 
                      results={ancientAdmixture} 
                      title="Deep Time Oracle" 
                      subtitle="Ancient Admixture & Paleolithic Affinity"
                      type="admixture"
                      onOpenMethodology={() => setIsMethodologyOpen(true)} 
                    />
                    <ArchaicIntrogressionView results={archaicIntrogression} />
                  </div>
                ) : (
                  <AncientAncestryOracle 
                    results={individualMatches} 
                    title="Fossil Specimen Matches" 
                    subtitle="Direct Genetic Affinity to Ancient Individuals"
                    type="matches"
                    onOpenMethodology={() => setIsMethodologyOpen(true)} 
                  />
                )}
              </div>
            )}

            {currentApp === 'health' && (
              <div className="space-y-8 animate-fade-in">
                <Suspense fallback={<div className="text-center p-12 text-slate-400">Loading Wellness Analysis...</div>}>
                  <HealthWellnessTab 
                    impacts={healthWellnessMatches} 
                    userSnps={snpMaps.current[activeDatasetIndex]} 
                    mode="analyst"
                  />
                </Suspense>
              </div>
            )}

            {currentApp === 'traits' && (
              <div className="space-y-8 animate-fade-in">
                <HealthTraitsTab 
                  matchedTraits={userMatchedMitoTraits}
                  autosomalMarkers={datasets[activeDatasetIndex]?.results || []}
                  userSnps={snpMaps.current[activeDatasetIndex]}
                />
              </div>
            )}

            {currentApp === 'blood' && (
              <div className="animate-fade-in">
                <BloodTypeView 
                  dataset={datasets[activeDatasetIndex]} 
                />
              </div>
            )}

            {currentApp === 'prs' && (
              <div className="animate-fade-in">
                <PolygenicScores 
                  prsResults={datasets[activeDatasetIndex]?.prsResults}
                />
              </div>
            )}

            {currentApp === 'rare_variants' && (
              <div className="animate-fade-in">
                <RareVariantsView variants={datasets[activeDatasetIndex]?.rareAndNovelVariants || []} />
              </div>
            )}

            {currentApp === 'markers' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Genetic Markers</h2>
                    <p className="text-slate-500 dark:text-slate-400">Filtered view of your autosomal variants.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    {(['matched', 'unmatched'] as const).map(status => (
                      <button 
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                
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
              </div>
            )}

            {currentApp === 'ai_agent' && (
              <div className="space-y-8 animate-fade-in">
                <AIGenomicAgent
                  dataset={datasets[activeDatasetIndex]}
                  oracleResults={oracleResults}
                  populationProximity={populationProximity}
                  famousMatches={famousMatches}
                  autosomalMarkers={datasets[activeDatasetIndex]?.results || []}
                  userSnps={snpMaps.current[activeDatasetIndex] || {}}
                />
              </div>
            )}

            {currentApp === 'kit_comparison' && (
              <div className="space-y-8 animate-fade-in">
                <KitComparisonModule 
                  datasets={datasets} 
                />
              </div>
            )}

            {currentApp === 'export' && (
              <div className="space-y-8 animate-fade-in">
                <ExportModule 
                  onGenerateReport={handleGenerateReport}
                  datasetName={datasets[activeDatasetIndex]?.name || 'Dataset'}
                />
              </div>
            )}

            {currentApp === 'methodology' && (
              <>
                <MethodologyPage activeTab={activeTab} />
                <div className="mt-8">
                  <AdBanner format="auto" className="rounded-2xl" />
                </div>
              </>
            )}
            </Suspense>
          </ScoutWorkspace>
        </>
      )}


      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
        activeTab={activeTab}
      />

      {/* PWA Toast Alerts */}
      <AnimatePresence>
        {needRefresh && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-white dark:bg-slate-900 border border-teal-500/25 dark:border-teal-500/25 p-5 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col gap-3 animate-fade-up"
            role="alert"
          >
            <div className="flex items-start gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <FlaskConical className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">Update Available</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal font-medium">
                  A new version of Genotype Scout is ready. Please save any active analysis before reloading.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end mt-1">
              <button
                onClick={() => setNeedRefresh(false)}
                className="px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Later
              </button>
              <button
                onClick={() => updateServiceWorker(true)}
                className="px-4 py-1.5 bg-teal-600 dark:bg-teal-500 text-white dark:text-slate-950 hover:bg-teal-700 dark:hover:bg-teal-400 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors shadow-lg shadow-teal-500/20"
              >
                Update Now
              </button>
            </div>
          </motion.div>
        )}

        {offlineReady && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-white dark:bg-slate-900 border border-teal-500/25 dark:border-teal-500/25 p-5 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col gap-3 animate-fade-up"
            role="alert"
          >
            <div className="flex items-start gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">Ready Offline</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal font-medium">
                  App has been cached successfully and is fully ready for 100% offline-only genomic analysis.
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-1">
              <button
                onClick={() => setOfflineReady(false)}
                className="px-4 py-1.5 bg-teal-600 dark:bg-teal-500 text-white dark:text-slate-950 hover:bg-teal-700 dark:hover:bg-teal-400 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors shadow-lg shadow-teal-500/20"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

