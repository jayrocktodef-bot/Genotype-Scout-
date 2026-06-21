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
import { FamousMatches } from "./components/FamousMatches";
import { PopulationComparisonTab } from "./components/PopulationComparisonTab";
import { MarkerBenchmarks } from "./components/MarkerBenchmarks";
import SubpopulationBento from "./components/SubpopulationBento";
import { processSubpopulations } from "./components/ancestryOracleLogic";
import { GenotypeParser } from "./components/GenotypeParser";
import { loadMasterAims } from './data';
const masterAims = loadMasterAims();

import ScoutWorkspace from "./components/ScoutWorkspace";
import { BloodTypeView } from "./components/BloodTypeView";
import { HealthTraitsTab } from "./components/HealthTraitsTab";
import { inferRhFactor } from "./services/bloodPredictorService";

import { ModernAncestryOracle } from "./components/ModernAncestryOracle";
import { NaiveAncestryOracle } from "./components/NaiveAncestryOracle";
import { ChromosomePainterView } from "./components/ChromosomePainterView";
import { AncientAncestryOracle } from "./components/AncientAncestryOracle";
import { EngineAncestryOracle } from "./components/EngineAncestryOracle";
import { runAncestryOracle } from "./engines/ancestry/oracleEngine";
import { calculateAncientAdmixture, calculateIndividualMatches, calculateArchaicIntrogression } from "./lib/AncientAdmixtureCalculator";
import { calculateHistoricalClusterMatches } from "./engines/ancestry/historicalClusterEngine";
import { calculateProAncestry } from "./engines/admixtureCalculator";
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
import { KinshipModule } from './components/KinshipModule';
import { ExportModule, ExportConfig } from './components/ExportModule';
import { PrintableView } from './components/PrintableView';
import RareVariantsView from "./components/RareVariantsView";
import { HaplogroupBento } from "./components/HaplogroupBento";
import { YDNABento } from "./components/YDNABento";
import { ArchaicIntrogressionView } from "./components/ArchaicIntrogressionView";
import { PolygenicScores } from "./components/PolygenicScores";

const LOGO_URI = "https://writteninthegenome.blog/wp-content/uploads/2026/05/17794114671357483599285632974525.png";
const VERSION = "4.0.0-beta";

const normalizeBranchName = (name: string) => (name || "").toLowerCase().replace("haplogroup ", "").trim();

function enrichHaplogroupTree(tree: any, userPath: string[], testedMarkers: any[]) {
  if (!tree) return null;
  const cloned = JSON.parse(JSON.stringify(tree));
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

const ProfileSummary = memo(({ 
  datasets, 
  activeDatasetIndex, 
  oracleResults,
  populationProximity,
  userSnps,
  famousMatches = [],
  healthImpacts = []
}: { 
  datasets: any[], 
  activeDatasetIndex: number, 
  oracleResults: any,
  populationProximity: any[],
  userSnps: Record<string, string>,
  famousMatches?: any[],
  healthImpacts?: any[]
}) => {
  const [isChartReady, setIsChartReady] = useState(false);
  useEffect(() => {
    setIsChartReady(false);
    const timer = setTimeout(() => setIsChartReady(true), 150);
    return () => clearTimeout(timer);
  }, [activeDatasetIndex]);

  const dataset = datasets[activeDatasetIndex];

  const rhInference = useMemo(() => {
    return inferRhFactor(userSnps || {});
  }, [userSnps]);

  const rhDisplay = useMemo(() => {
    if (!rhInference || rhInference.phenotype === "Unknown") {
      return { 
        name: "Unknown", 
        badge: "Confidence 0.0", 
        pillColor: "bg-slate-600 shadow-slate-600/10"
      };
    }
    const isPos = rhInference.phenotype === "Positive";
    const name = isPos ? "Rh+ Factor" : "Rh- Factor";
    const confPercent = Math.round(rhInference.confidence * 100);
    
    if (rhInference.confidence >= 0.8) {
      return { 
        name, 
        badge: `High Confidence (${confPercent}%)`, 
        pillColor: "bg-red-600 shadow-red-600/10"
      };
    } else {
      return { 
        name: `Likely ${isPos ? "Rh+" : "Rh-"}`, 
        badge: `Moderate/Low Confidence (${confPercent}%)`, 
        pillColor: "bg-amber-600 shadow-amber-600/10"
      };
    }
  }, [rhInference]);

  const statisticalInsights = useMemo(() => {
    const stats = oracleResults?.statistical;
    if (!stats || !stats.results) return null;

    const markersUsed = stats.markersUsed || 100;
    return Object.entries(stats.results).map(([pop, percentage]) => {
      const confidence = applyConfidenceIntervals(Number(percentage), markersUsed);
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

  const yData = dataset.predictedYDNA || { predicted: null, path: [], testedMarkers: [] };
  const mtData = dataset.predictedMtDNA || { predicted: null, path: [], testedMarkers: [] };
  
  const currentOracle = oracleResults?.primary;
  const ancestryScores = currentOracle?.continentalScores || {};
  
  const ancestryChartData = Object.entries(ancestryScores)
    .map(([name, value]) => ({ name, value: Number(value) }))
    .sort((a, b) => b.value - a.value);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 pb-8"
    >
      {/* Premium Dashboard Header Capsule */}
      <div className="p-4 rounded-3xl premium-card bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Genomic Passport Summary</h3>
          </div>
          <h2 className="text-lg font-black text-white tracking-tight mt-1 truncate max-w-md">
            {dataset.name || "Sample Specimen"}
          </h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-mono">
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400 font-bold block text-[8px] uppercase tracking-widest leading-none mb-1">Genotype Array</span>
            <span className="font-bold text-slate-200">{dataset.chip || "High-Density Array"}</span>
          </div>
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400 font-bold block text-[8px] uppercase tracking-widest leading-none mb-1">Markers Tested</span>
            <span className="font-bold text-slate-200">{dataset.snpCount ? `${dataset.snpCount.toLocaleString()} SNPs` : "Admixture Panel"}</span>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="font-black tracking-widest text-[9px] uppercase">LOCAL INTEGRITY OK</span>
          </div>
        </div>
      </div>

      {/* Main High-Density Bento Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* Cell A (Span 8) - Biogeographical Admixture & Subpopulation Deconvolution */}
        <div className="xl:col-span-8 p-5 premium-card flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-black text-slate-450 uppercase tracking-[0.15em]">Biogeographical Origins & Deconvolution</h3>
              <p className="text-[10px] text-slate-500 font-medium">Continental admixture proportions and refined subpopulation estimates.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Radar chart - span 5 */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center border-r border-slate-100/50 pr-0 lg:pr-4">
              <div className="relative w-full h-[150px] flex items-center justify-center">
                {isChartReady ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={150} debounce={1}>
                    <RadarChart data={ancestryChartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                      <PolarGrid stroke="#cbd5e1" strokeOpacity={0.6} />
                      <PolarAngleAxis dataKey="name" tick={{ fill: '#475569', fontSize: 8, fontWeight: 800 }} />
                      <Radar name="Origins" dataKey="value" stroke="#0d9488" fill="#0d9488" fillOpacity={0.12} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-slate-50/50 rounded-2xl animate-pulse" />
                )}
              </div>
              <div className="flex justify-center gap-3 mt-1 flex-wrap text-[9px] font-mono">
                {ancestryChartData.slice(0, 3).map((anc: any, i: number) => (
                  <span key={i} className="text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                    <strong>{anc.name}:</strong> {anc.value.toFixed(0)}%
                  </span>
                ))}
              </div>
            </div>

            {/* Subpopulations fit list - span 7 */}
            <div className="lg:col-span-7 space-y-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Top Subpopulation Contributions</span>
              {sortedEngineResults.length > 0 ? (
                sortedEngineResults.slice(0, 4).map((pop, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-50/70 border border-slate-100 flex flex-col justify-between">
                    <div className="flex justify-between items-center text-xs min-w-0 gap-2">
                      <span className="font-bold text-slate-700 truncate min-w-0">{formatPopName(pop.name || pop.popCode)}</span>
                      <span className="font-mono font-black text-teal-600 bg-teal-50 px-1.5 py-0.2 rounded text-[9px]">{(pop.percentage || 0).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1 my-1 overflow-hidden">
                      <div 
                        className="bg-teal-600 h-full rounded-full"
                        style={{ width: `${Math.max(pop.percentage || 0, 1)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  No advanced subpopulation data active.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cell B (Span 4) - Uni-parental Lineages (Maternal + Paternal + Rh) */}
        <div className="xl:col-span-4 p-5 premium-card flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3 mb-3">
            <h3 className="text-xs font-black text-slate-455 uppercase tracking-[0.15em]">Uniparental Lineages</h3>
            <p className="text-[10px] text-slate-500 font-medium">Cladistic deep maternal & paternal marker sets.</p>
          </div>

          <div className="space-y-2 my-auto">
            {/* Paternal Card */}
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-white to-teal-50/10 border border-teal-100/30 flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-teal-600/10">
                <Compass className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[8px] font-black text-teal-600 uppercase tracking-widest block leading-none mb-0.5">Paternal haplogroup (y-dna)</span>
                <span className="text-sm font-black text-slate-800 block truncate tracking-tight">{yData?.predicted?.name || 'Unknown / Female lineage'}</span>
                <span className="text-[9px] font-bold text-slate-400 font-mono block uppercase truncate mt-0.2">{yData?.predicted?.continent || 'Universal Genetic Origin'}</span>
              </div>
            </div>

            {/* Maternal Card */}
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-white to-rose-50/10 border border-rose-100/30 flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-600/10">
                <History className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[8px] font-black text-rose-600 uppercase tracking-widest block leading-none mb-0.5">Maternal haplogroup (mtdna)</span>
                <span className="text-sm font-black text-slate-800 block truncate tracking-tight">{mtData?.predicted || 'Unknown'}</span>
                <span className="text-[9px] font-bold text-slate-400 font-mono block uppercase truncate mt-0.2">{mtData?.region || 'Universal Genetic Origin'}</span>
              </div>
            </div>

            {/* Rh Factor Card */}
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-white to-red-50/10 border border-red-100/30 flex gap-3 items-center">
              <div className={`w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0 shadow-sm ${rhDisplay.pillColor}`}>
                <FlaskConical className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[8px] font-black text-red-600 uppercase tracking-widest block leading-none mb-0.5">Rhesus Factor (RHCE Surrogate)</span>
                <span className="text-sm font-black text-slate-800 block truncate tracking-tight">{rhDisplay.name}</span>
                <span className="text-[9px] font-bold text-slate-500 font-mono block uppercase truncate mt-0.2">{rhDisplay.badge}</span>
              </div>
            </div>
          </div>
          
          <div className="text-[8px] font-extrabold text-[#475569] bg-slate-50 border border-slate-100 p-1.5 rounded-lg text-center mt-3 select-none">
            🔒 Fully local processing: genomic privacy protected.
          </div>
        </div>

        {/* Statistical Rigor Container (Span 12) */}
        {statisticalInsights && (
          <div className="xl:col-span-12 p-4 premium-card">
            <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
              <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Confidence Interval Rigor (95% CI)</h3>
                <p className="text-[9px] text-slate-500 dark:text-slate-400">Statistical error bounds based on total AIM markers parsed.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statisticalInsights.slice(0, 4).map((insight: any, i: number) => (
                <div key={insight?.pop || i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-[10px] font-bold mb-1.5 min-w-0 gap-2">
                    <span className="text-slate-800 uppercase tracking-tight truncate min-w-0 flex-1">
                      {formatPopName(insight?.pop)}
                    </span>
                    <span className="text-emerald-600 font-black shrink-0">{insight?.percentage || 0}%</span>
                  </div>
                  
                  <div>
                    <div className="h-1.5 w-full bg-slate-200/80 rounded-full relative overflow-hidden">
                      <div 
                        className="absolute h-full bg-emerald-200/80" 
                        style={{ 
                          left: `${insight?.low || 0}%`, 
                          width: `${Math.max((insight?.high - insight?.low) || 0, 3)}%` 
                        }} 
                      />
                      <div 
                        className="absolute w-2 h-2 rounded-full bg-emerald-600 top-[-1px] -translate-x-1/2" 
                        style={{ left: `${insight?.percentage || 0}%` }} 
                      />
                    </div>
                    <div className="flex justify-between text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">
                      <span>Low: {insight?.low || 0}%</span>
                      <span>High: {insight?.high || 0}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
});

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
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg bg-slate-50 border border-slate-100 group-hover:bg-teal-50 transition-colors">
            {meta.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{snp.rsid}</span>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${SIG_COLOR[snp.significance as keyof typeof SIG_COLOR] || 'bg-slate-100 text-slate-500'}`}>
                {snp.significance}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-800 group-hover:text-teal-600 transition-colors leading-tight">{snp.trait}</h4>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Genotype</div>
            <div className="text-sm font-mono font-bold text-slate-800">{snp.genotype || '--'}</div>
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
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                {snp.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Gene</div>
                  <div className="text-xs font-bold text-slate-800">{snp.gene || 'N/A'}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Region</div>
                  <div className="text-xs font-bold text-slate-800">{snp.continent}</div>
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
                      <span className="text-xs font-mono font-bold text-slate-500">{Number(entry.value || 0).toFixed(1)}%</span>
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
                  <Phase2Badge phase2={yData.phase2} />
                </div>
                <p className="text-blue-50 text-sm leading-relaxed max-w-xl font-medium opacity-90 border-l-2 border-blue-300/30 pl-4 py-1 italic mb-6">
                  {yData.predicted.description || "Tracing the unbroken paternal line across civilizations and continents."}
                </p>
                
                {/* Lineage Path Highlight */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-3">Predicted Paternal Path</h4>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-1">
                    {yData.path.map((step: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-1">
                        {idx > 0 && <span className="text-blue-300/50 text-[10px]">▶</span>}
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${idx === yData.path.length - 1 ? 'bg-white text-blue-700 shadow-lg' : 'bg-white/10 text-white'}`}>
                          {(step || '').replace("Haplogroup ", "")}
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
                node={enrichedYTree} 
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
                   <span className="text-[10px] font-black uppercase text-slate-500">Ancient to Modern</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div 
          className="lg:col-span-1 bg-gradient-to-br from-rose-500 to-pink-700 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group"
        >
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

        <div 
          className="lg:col-span-2 bg-slate-900 p-8 rounded-[2rem] text-white flex flex-col shadow-2xl relative overflow-hidden group min-w-0"
        >
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
                 <div className="relative w-[180px] h-[180px] mx-auto flex items-center justify-center">
                      <PieChart width={180} height={180}>
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
                          {markerPieData.map((entry: any, index: number) => (
                             <Cell key={`cell-${index}`} fill={getHaploColor(entry.branch, true)} className="hover:opacity-80 transition-opacity" />
                          ))}
                        </Pie>
                        <Tooltip cursor={false} content={<CustomTooltip />} />
                      </PieChart>
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'summary' | 'autosomal' | 'ancestry' | 'history' | 'health_traits' | 'markers' | 'rare_variants' | 'debug' | 'methodology' | 'desktop' | 'ai_agent'>('dashboard');
  const [uiMode, setUiMode] = useState<'desktop' | 'classic'>('desktop');
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
        const updated = saved.map((ds: any, idx: number) => {
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
              const freshOracle = processSubpopulations(userGenotypes, []);
              ds.analysis.subpopulationOracle = freshOracle;
              hasChanges = true;
            }
          }
          return ds;
        });
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

  const handleUiModeChange = (mode: 'desktop' | 'classic') => {
    // Defer the heavy transition state update to a new event loop tick.
    // This allows the event handler to finish immediately and let the browser
    // paint the button's clicked/active state first, preventing INP block.
    setTimeout(() => {
      startTransition(() => {
        setUiMode(mode);
      });
    }, 20);
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
    
    const MAX_FILE_SIZE = 2000 * 1024 * 1024; // 2GB
    const largeFiles = fileArray.filter(f => f.size > MAX_FILE_SIZE);
    if (largeFiles.length > 0) {
      setError(`File(s) too large: ${largeFiles.map(f => f.name).join(', ')}. Max size is 2GB.`);
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

    try {
      // Ingest DNA using zero-copy Transferable ArrayBuffers to bypass main-thread cloning latency
      const fileContents = await Promise.all(
        fileArray.map(async (file) => {
          const buffer = await file.arrayBuffer();
          return {
            buffer,
            name: file.name
          };
        })
      );

      const worker = new Worker(new URL('./workers/genotypeWorker.ts', import.meta.url), { type: 'module' });
      
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
          setError(workerError?.message || workerError || "Processing failed in background worker.");
          setProcessing(false);
          worker.terminate();
        }
      };

      worker.onerror = (err) => {
        if (intervalId) clearInterval(intervalId);
        setError(`Worker error: ${err.message}`);
        setProcessing(false);
        worker.terminate();
      };

      // Extract ArrayBuffer instances for zero-copy Transferable list
      const transferables = fileContents.map(fc => fc.buffer);

      // Ship the processing request to the worker transferring ownership of ArrayBuffers
      worker.postMessage({ 
        type: 'PROCESS_GENOME', 
        files: fileContents,
        sab
      }, transferables);
    } catch (err) {
      if (intervalId) clearInterval(intervalId);
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

  const ancientAdmixture = useMemo(() => {
    const dataset = datasets[activeDatasetIndex];
    if (dataset?.analysis?.ancientAdmixture) return dataset.analysis.ancientAdmixture;
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return [];
    return calculateAncientAdmixture(snpMap);
  }, [datasets, activeDatasetIndex]);

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

  const populationProximity = useMemo(() => {
    const dataset = datasets[activeDatasetIndex];
    if (dataset?.analysis?.populationProximity) return dataset.analysis.populationProximity;
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return [];
    return calculatePopulationProximity(snpMap);
  }, [datasets, activeDatasetIndex]);

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
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans selection:bg-teal-200 selection:text-teal-900 transition-colors duration-500 relative overflow-x-hidden">
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
        uiMode={uiMode}
        onChangeUiMode={handleUiModeChange}
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

      <main className="max-w-[1360px] mx-auto px-1 sm:px-6 md:px-8 pt-24 sm:pt-28">
        {error && (
          (() => {
            const isDetailed = typeof error === 'object' && error !== null;
            const errMsg = isDetailed ? (error.message || "An unexpected error occurred during processing.") : error;
            const details = isDetailed ? error.details : null;
            const category = isDetailed ? (details?.errorCategory || error.name || "Analytical Mismatch") : "Process Aborted";

            return (
              <div className="mb-12 p-8 rounded-[2.5rem] bg-white border border-rose-100 shadow-xl shadow-rose-100/40 animate-fade-in relative overflow-hidden z-50">
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
                    
                    <h3 className="text-xl font-extrabold text-slate-800 mt-3 mb-2">
                      Genomic Analysis Blocked
                    </h3>
                    
                    <p className="text-slate-600 font-semibold text-sm leading-relaxed mb-6">
                      {errMsg}
                    </p>

                    {details?.suggestedSolution && (
                      <div className="mb-6 p-5 bg-teal-50/50 rounded-2xl border border-teal-100/60">
                        <h4 className="text-teal-800 font-extrabold text-xs uppercase tracking-widest mb-1.5">
                          🟢 Recommended Peer Action:
                        </h4>
                        <p className="text-slate-700 text-xs font-semibold leading-relaxed">
                          {details.suggestedSolution}
                        </p>
                      </div>
                    )}

                    {/* Troubleshooting suggestions list */}
                    <div className="mb-6">
                      <h4 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-3">
                        Troubleshooting Guidelines:
                      </h4>
                      <ul className="space-y-3 text-xs font-semibold text-slate-600">
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
                        
                        <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/60 font-mono text-[11px] leading-relaxed text-slate-600 space-y-2 overflow-auto">
                          <div><strong className="text-slate-700">Error Category:</strong> {details?.errorCategory || category}</div>
                          {details?.bytesTotal !== undefined && (
                            <div><strong className="text-slate-700">File Ingestion Size:</strong> {(details.bytesTotal / (1024 * 1024)).toFixed(2)} MB ({details.bytesTotal.toLocaleString()} bytes)</div>
                          )}
                          {details?.linesTotal !== undefined && (
                            <div><strong className="text-slate-700">Total Rows Read:</strong> {details.linesTotal.toLocaleString()}</div>
                          )}
                          {details?.linesCommented !== undefined && (
                            <div><strong className="text-slate-700">Comment Headers Found:</strong> {details.linesCommented.toLocaleString()}</div>
                          )}
                          {details?.linesMalformed !== undefined && (
                            <div><strong className="text-slate-700">Malformed/Unrecognized Rows:</strong> {details.linesMalformed.toLocaleString()}</div>
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

        {results && (
          <div className="space-y-12 animate-fade-in">

            {pendingFiles.length > 0 && (
              <div className="p-8 premium-card flex flex-col sm:flex-row items-center justify-between gap-6 bg-teal-50/30 border-teal-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{pendingFiles.length} Kit(s) Ready</h3>
                    <p className="text-xs text-slate-500">{pendingFiles.map(f => f.name).join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => setPendingFiles([])}
                    className="flex-1 sm:flex-none px-6 py-3 border border-slate-200 rounded-2xl text-xs font-black text-slate-500 hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      processFiles(pendingFiles);
                      setPendingFiles([]);
                    }}
                    className="flex-1 sm:flex-none px-8 py-3 bg-teal-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-teal-100 hover:bg-teal-700"
                  >
                    Start Analysis
                  </button>
                </div>
              </div>
            )}

            {uiMode === 'classic' ? (
              <>
                {/* Top Analysis Header Action Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-8">
                  <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">
                  <FlaskConical className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight capitalize select-none">
                    {activeTab === 'ancestry' ? 'Ancestry & Populations' : activeTab === 'history' ? 'Lineages & History' : activeTab === 'health_traits' ? 'Health & Traits' : activeTab === 'autosomal' ? 'Markers' : activeTab}
                  </h2>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                    Analyzing dataset: <span className="text-slate-600 font-mono font-black">{datasets[activeDatasetIndex]?.name}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Dataset Picker Inline */}
                {datasets.length > 1 && (
                  <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-slate-100 shadow-sm">
                    {datasets.map((d, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveDatasetIndex(i)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                          activeDatasetIndex === i 
                            ? 'bg-slate-900 text-white shadow-sm' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {d.name.split('.')[0]}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Methodology Button (Except Wellness) */}
                {!(activeTab === 'health_traits' && activeHealthSubTab === 'wellness') && (
                  <button
                    onClick={() => setIsMethodologyOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-teal-50 hover:bg-teal-100/90 border border-teal-200/40 text-teal-700 rounded-full text-[11px] font-extrabold uppercase tracking-wider transition-all shadow-sm"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-teal-500" />
                    Methodology
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + activeDatasetIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'dashboard' && (
                  <Dashboard 
                    oracleResults={oracleResults}
                    populationProximity={populationProximity}
                    dataset={datasets[activeDatasetIndex]}
                    userSnps={snpMaps.current[activeDatasetIndex] || {}}
                    onNavigateToTab={(tab: string) => {
                      if (tab === 'ancient_dna') {
                        setActiveTab('history');
                        setActiveHistorySubTab('ancient');
                      } else if (tab === 'haplogroups') {
                        setActiveTab('history');
                        setActiveHistorySubTab('modern');
                      } else if (tab === 'wellness') {
                        setActiveTab('health_traits');
                        setActiveHealthSubTab('wellness');
                      } else if (tab === 'blood') {
                        setActiveTab('health_traits');
                        setActiveHealthSubTab('blood');
                      } else {
                        setActiveTab(tab as any);
                      }
                    }}
                    onReset={resetApp}
                  />
                )}

                {activeTab === 'methodology' && (
                  <MethodologyPage activeTab={activeTab} />
                )}

                {activeTab === 'summary' && (
                  <div className="space-y-8">
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

                {activeTab === 'autosomal' && (
                  <div className="space-y-8 pb-20">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                      <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Genetic Markers</h2>
                        <p className="text-slate-500">Filtered view of your autosomal variants.</p>
                      </div>
                      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                        {(['matched', 'unmatched'] as const).map(status => (
                          <button 
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
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

                {activeTab === 'ancestry' && (
                  <div className="pb-20 space-y-8">
                    <div className="flex justify-center mb-4 overflow-x-auto pb-0.5">
                      <div className="inline-flex bg-[#111213]/40 p-1.5 rounded-2xl border border-white/5 shadow-inner shrink-0">
                        <button 
                          onClick={() => setActiveAncestrySubTab('oracle')}
                          className={`px-3 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeAncestrySubTab === 'oracle' ? 'bg-[#4599FF] text-white shadow-lg scale-105' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          🔬 High-Res Oracle
                        </button>
                        <button 
                          onClick={() => setActiveAncestrySubTab('painter')}
                          className={`px-3 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeAncestrySubTab === 'painter' ? 'bg-[#4599FF] text-white shadow-lg scale-105' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          🎨 Chromosome Painting
                        </button>
                        <button 
                          onClick={() => setActiveAncestrySubTab('scout')}
                          className={`px-3 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeAncestrySubTab === 'scout' ? 'bg-[#4599FF] text-white shadow-lg scale-105' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          ⚡ Scout Score
                        </button>
                      </div>
                    </div>

                    {activeAncestrySubTab === 'oracle' && (
                      <div className="space-y-8">
                         <SubpopulationBento 
                           precalculated={datasets[activeDatasetIndex]?.analysis?.subpopulationOracle}
                           userGenotypes={Object.entries(snpMaps.current[activeDatasetIndex] || {}).map(([rsid, genotype]) => ({ rsid, genotype }))}
                           aimsDatabase={Object.values(masterAims as any).map((aim: any) => ({
                             rsid: aim.rsid,
                             chromosome: aim.chromosome || 'Unknown',
                             subpop: aim.region, // Assuming region maps to subpop
                             continent: aim.region || 'Unknown',
                             alleles: Array.isArray(aim.alleles) ? aim.alleles.join(',') : (aim.alleles || '')
                           }))}
                         />
                         
                         <ModernAncestryOracle results={oracleResults} dataset={datasets[activeDatasetIndex]} onOpenMethodology={() => setIsMethodologyOpen(true)} mode="analyst" />
                      </div>
                    )}

                    {activeAncestrySubTab === 'painter' && (
                      <div className="animate-fade-in">
                         <ChromosomePainterView dataset={datasets[activeDatasetIndex]} onOpenMethodology={() => setIsMethodologyOpen(true)} />
                      </div>
                    )}

                    {activeAncestrySubTab === 'scout' && (
                      <div className="animate-fade-in">
                         <NaiveAncestryOracle 
                           results={datasets[activeDatasetIndex]?.analysis || {}} 
                           userSnps={snpMaps.current[activeDatasetIndex] || {}}
                           onOpenMethodology={() => setIsMethodologyOpen(true)} 
                         />
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'health_traits' && (
                  <div className="pb-20 space-y-8">
                    <div className="flex justify-center mb-4 overflow-x-auto pb-0.5">
                      <div className="inline-flex bg-slate-100 dark:bg-[#111213]/40 p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-inner shrink-0">
                        <button 
                          onClick={() => setActiveHealthSubTab('wellness')}
                          className={`px-3 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeHealthSubTab === 'wellness' ? 'bg-slate-900 dark:bg-[#4599FF] text-white shadow-lg scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                        >
                          🩺 Wellness & Risk
                        </button>
                        <button 
                          onClick={() => setActiveHealthSubTab('traits')}
                          className={`px-3 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeHealthSubTab === 'traits' ? 'bg-slate-900 dark:bg-[#4599FF] text-white shadow-lg scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                        >
                          ✨ Personal Traits
                        </button>
                        <button 
                          onClick={() => setActiveHealthSubTab('blood')}
                          className={`px-3 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeHealthSubTab === 'blood' ? 'bg-slate-900 dark:bg-[#4599FF] text-white shadow-lg scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                        >
                          🩸 Blood Type Predictor
                        </button>
                        <button 
                          onClick={() => setActiveHealthSubTab('prs')}
                          className={`px-3 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeHealthSubTab === 'prs' ? 'bg-slate-900 dark:bg-[#4599FF] text-white shadow-lg scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                        >
                          🧬 Polygenic Scores
                        </button>
                      </div>
                    </div>

                    {activeHealthSubTab === 'wellness' && (
                      <Suspense fallback={<div className="text-center p-12 text-slate-400">Loading Wellness Analysis...</div>}>
                        <HealthWellnessTab 
                          impacts={healthWellnessMatches} 
                          userSnps={snpMaps.current[activeDatasetIndex]} 
                          mode="analyst"
                        />
                      </Suspense>
                    )}

                    {activeHealthSubTab === 'traits' && (
                      <div className="animate-fade-in">
                        <HealthTraitsTab 
                          matchedTraits={userMatchedMitoTraits}
                          autosomalMarkers={datasets[activeDatasetIndex]?.results || []}
                          userSnps={snpMaps.current[activeDatasetIndex]}
                        />
                      </div>
                    )}

                    {activeHealthSubTab === 'blood' && (
                      <div className="animate-fade-in">
                        <BloodTypeView 
                          dataset={datasets[activeDatasetIndex]} 
                        />
                      </div>
                    )}

                    {activeHealthSubTab === 'prs' && (
                      <div className="animate-fade-in">
                        <PolygenicScores 
                          prsResults={datasets[activeDatasetIndex]?.prsResults}
                        />
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="pb-20 space-y-8">
                    <div className="flex justify-center mb-4 overflow-x-auto pb-0.5">
                      <div className="inline-flex bg-slate-100 dark:bg-[#111213]/40 p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-inner shrink-0">
                        <button 
                          onClick={() => setActiveHistorySubTab('modern')}
                          className={`px-3 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeHistorySubTab === 'modern' ? 'bg-slate-900 dark:bg-[#4599FF] text-white shadow-lg scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                        >
                          🧬 Modern Lineages
                        </button>
                        <button 
                          onClick={() => setActiveHistorySubTab('ancient')}
                          className={`px-3 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeHistorySubTab === 'ancient' ? 'bg-slate-900 dark:bg-[#4599FF] text-white shadow-lg scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                        >
                          💀 Ancient DNA Matches
                        </button>
                      </div>
                    </div>

                    {activeHistorySubTab === 'modern' ? (
                      <div className="space-y-8 animate-fade-in">
                        <div className="flex justify-center mb-8 overflow-x-auto pb-0.5">
                          <div className="inline-flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm shrink-0">
                            <button 
                              onClick={() => setActiveHaploType('paternal')}
                              className={`px-5 sm:px-8 py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeHaploType === 'paternal' ? 'bg-teal-600 text-white shadow-lg scale-105' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                              ♂️ Paternal
                            </button>
                            <button 
                              onClick={() => setActiveHaploType('maternal')}
                              className={`px-5 sm:px-8 py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeHaploType === 'maternal' ? 'bg-teal-600 text-white shadow-lg scale-105' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                              ♀️ Maternal
                            </button>
                          </div>
                        </div>

                        {activeHaploType === 'paternal' ? (
                          <div className="space-y-6">
                            <YDNABento
                              yData={datasets[activeDatasetIndex].predictedYDNA}
                            />
                            <YDNAView 
                              yData={datasets[activeDatasetIndex].predictedYDNA} 
                              treeSearchTerm={treeSearchTerm}
                              setTreeSearchTerm={setTreeSearchTerm}
                            />
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <HaplogroupBento 
                              predictedMt={datasets[activeDatasetIndex].predictedMtDNA}
                            />
                            <MTDNAView 
                              mtData={datasets[activeDatasetIndex].predictedMtDNA} 
                              treeSearchTerm={treeSearchTerm}
                              setTreeSearchTerm={setTreeSearchTerm}
                              matchedTraits={userMatchedMitoTraits}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-8 animate-fade-in">
                        <div className="flex justify-center overflow-x-auto pb-0.5">
                          <div className="p-1.5 bg-slate-100 rounded-2xl inline-flex border border-slate-200 shadow-inner shrink-0">
                            <button
                              onClick={() => setActiveAncientSubTab('admixture')}
                              className={`flex items-center gap-2 px-3 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                activeAncientSubTab === 'admixture' 
                                  ? 'bg-slate-900 text-white shadow-md scale-105' 
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              <History size={14} /> Ancient Admixture
                            </button>
                            <button
                              onClick={() => setActiveAncientSubTab('matches')}
                              className={`flex items-center gap-2 px-3 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                activeAncientSubTab === 'matches' 
                                  ? 'bg-slate-900 text-white shadow-md scale-105' 
                                  : 'text-slate-500 hover:text-slate-800'
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
                  </div>
                )}

                {activeTab === 'markers' && (
                  <div className="pb-20">
                    <MarkerBenchmarks benchmarks={markerBenchmarks} />
                  </div>
                )}

                {activeTab === 'rare_variants' && (
                  <div className="pb-20 animate-fade-in">
                    <RareVariantsView variants={datasets[activeDatasetIndex]?.rareAndNovelVariants || []} />
                  </div>
                )}

                {activeTab === 'ai_agent' && (
                  <div className="pb-20 animate-fade-in">
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

                {/* Ad placement between content sections */}
                <div className="max-w-4xl mx-auto my-8">
                  <AdBanner format="auto" className="rounded-2xl" />
                </div>

                {activeTab === 'debug' && (
                  <div className="p-8 premium-card">
                    <h3 className="text-xl font-black mb-4">Diagnostic Tool</h3>
                    <pre className="text-[10px] font-mono bg-slate-50 p-4 rounded-xl overflow-auto max-h-[400px]">
                      {JSON.stringify({
                        version: VERSION,
                        dataset: datasets[activeDatasetIndex]?.name,
                        snpCount: datasets[activeDatasetIndex]?.snpCount,
                        validSnps: Object.keys(snpMaps.current[activeDatasetIndex] || {}).length,
                        activeTab
                      }, null, 2)}
                    </pre>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <ScoutWorkspace
            oracleResults={oracleResults}
            populationProximity={populationProximity}
            dataset={datasets[activeDatasetIndex]}
            userSnps={snpMaps.current[activeDatasetIndex] || {}}
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
            uiMode={uiMode}
            onChangeUiMode={handleUiModeChange}
            currentApp={currentApp}
            onOpenApp={setCurrentApp}
          >
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
                  <div className="space-y-6">
                    <YDNABento
                      yData={datasets[activeDatasetIndex].predictedYDNA}
                    />
                    <YDNAView 
                      yData={datasets[activeDatasetIndex].predictedYDNA} 
                      treeSearchTerm={treeSearchTerm}
                      setTreeSearchTerm={setTreeSearchTerm}
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <HaplogroupBento 
                      predictedMt={datasets[activeDatasetIndex].predictedMtDNA}
                    />
                    <MTDNAView 
                      mtData={datasets[activeDatasetIndex].predictedMtDNA} 
                      treeSearchTerm={treeSearchTerm}
                      setTreeSearchTerm={setTreeSearchTerm}
                      matchedTraits={userMatchedMitoTraits}
                    />
                  </div>
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
                    <p className="text-slate-500">Filtered view of your autosomal variants.</p>
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

            {currentApp === 'kinship' && (
              <div className="space-y-8 animate-fade-in">
                <KinshipModule 
                  datasets={datasets} 
                  activeDatasetIndex={activeDatasetIndex} 
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
          </ScoutWorkspace>
        )}
      </div>
        )}
      </main>

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

