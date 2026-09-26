/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, memo, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  Shield,
  FlaskConical,
  Dna,
  Activity,
  User,
  BookOpen,
  MapPin,
  Calendar,
  CheckCircle,
  Compass,
  History,
  Layers,
  Orbit,
  Radio,
} from 'lucide-react';
import {
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  CATEGORY_META,
  SIG_COLOR,
  CONTINENT_META,
  mapToRegion,
  Y_DNA_TREE,
  MT_DNA_TREE,
  SNP,
  identifyEndogamy,
} from '../genotypeData';
import { REGION_METADATA } from '../constants/regionInfo';
import { applyConfidenceIntervals } from '../utils/statistics/admixtureRigor';
import { humanizePopName } from './ancestryOracleLogic';
import { assignContinent } from '../constants/ancestryThemes';
import { 
  computePaintedAncestry, 
  runDatasetLAI, 
  type PaintedAncestryItem, 
  type PaintedAncestryCompositionResult 
} from '../utils/ancestry/paintedAncestry';
import { getHaplogroupDetails } from '../utils/haplogroupDetails';
import { calculateBloodType } from '../engines/bloodTypeCalculator';
import { Phase2Panel } from './Phase2Panel';
import { HaplogroupBento } from './HaplogroupBento';
import { YDNABento } from './YDNABento';
import { HaplogroupDistributionVisualizer } from './HaplogroupDistributionVisualizer';
import { enrichHaplogroupTree } from '../utils/haplogroupTreeUtils';

const RANK_BADGE_STYLES = [
  { label: '#1', badge: 'bg-amber-400/20 text-amber-300 border-amber-400/40 ring-1 ring-amber-400/20 shadow-amber-400/10' },
  { label: '#2', badge: 'bg-slate-300/20 text-slate-200 border-slate-300/40 ring-1 ring-slate-300/20' },
  { label: '#3', badge: 'bg-amber-700/20 text-amber-400 border-amber-600/40 ring-1 ring-amber-600/20' },
  { label: '#4', badge: 'bg-slate-800/80 text-slate-400 border-white/10' },
  { label: '#5', badge: 'bg-slate-800/80 text-slate-400 border-white/10' },
];


const ProfileSummary = memo(
  ({
    datasets,
    activeDatasetIndex,
    oracleResults,
    populationProximity,
    userSnps,
    famousMatches = [],
    healthImpacts = [],
    onOpenMethodology,
  }: {
    datasets: any[];
    activeDatasetIndex: number;
    oracleResults: any;
    populationProximity: any[];
    userSnps: Record<string, string>;
    famousMatches?: any[];
    healthImpacts?: any[];
    onOpenMethodology?: () => void;
  }) => {
    const [isChartReady, setIsChartReady] = useState(false);
    const [chartMode, setChartMode] = useState<'donut' | 'radar'>('donut');
    const [hoveredSlice, setHoveredSlice] = useState<{
      name: string;
      value: number;
      color: string;
      icon: string;
    } | null>(null);

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
          badge: `Moderate Confidence (${confPercent}%)`,
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
        return { pop, ...confidence };
      });
    }, [oracleResults]);

    const subOracle = dataset?.analysis?.subpopulationOracle || oracleResults?.subpopulationOracle;
    const allOracle = subOracle?.all || subOracle;
    const currentOracle = oracleResults?.primary;

    const sortedEngineResults = useMemo(() => {
      // 1. Prefer high-precision NNLS subpopulation admixture mix from (K61 All) subpopulationOracle
      const mix = allOracle?.admixtureMix;
      if (mix && Array.isArray(mix) && mix.length > 0) {
        const sorted = mix
          .filter((item: any) => (item.percentage || 0) > 0.1)
          .map((item: any) => ({
            name: humanizePopName(item.name || item.subpop || item.popCode),
            rawPopCode: item.popCode || '',
            percentage: Number(item.percentage) || 0,
          }))
          .sort((a: any, b: any) => b.percentage - a.percentage);
        if (sorted.length > 0) return sorted.slice(0, 5);
      }

      // 2. Secondary: Top Population Matches (Closest Distances) from (K61 All) subpopulationOracle
      const breakdown = allOracle?.breakdown;
      if (breakdown && Array.isArray(breakdown) && breakdown.length > 0) {
        const sorted = breakdown
          .slice(0, 5)
          .map((item: any) => ({
            name: humanizePopName(item.subpop || item.name || item.popCode),
            rawPopCode: item.popCode || '',
            percentage: Number(item.similarityScore || Math.max(0, 100 - (item.distance || 0) * 10)) || 0,
          }));
        if (sorted.length > 0) return sorted;
      }

      // 3. Fallback: oracleResults primary subPopulations
      const subpops = oracleResults?.primary?.subPopulations || {};
      return Object.values(subpops)
        .flat()
        .map((p: any) => ({
          name: humanizePopName(p.name),
          rawPopCode: p.code || '',
          percentage: p.percentage || 0,
        }))
        .sort((a: any, b: any) => (b.percentage || 0) - (a.percentage || 0))
        .slice(0, 5);
    }, [allOracle, dataset, oracleResults]);

    const fallbackScores = useMemo(() => {
      const scores: Record<string, number> = {};
      const mix = allOracle?.admixtureMix;
      if (mix && Array.isArray(mix) && mix.length > 0) {
        mix.forEach((item: any) => {
          const c = assignContinent(item.name || item.subpop || item.popCode, item.popCode);
          scores[c] = (scores[c] || 0) + (Number(item.percentage) || 0);
        });
      }
      if (Object.keys(scores).length === 0) {
        const rawScores = allOracle?.continentalScores || currentOracle?.continentalScores || {};
        Object.entries(rawScores).forEach(([k, v]) => {
          scores[k] = Number(v) || 0;
        });
      }
      return scores;
    }, [allOracle, currentOracle]);

    const [laiSegments, setLaiSegments] = useState<any>(dataset?.analysis?.segments || null);

    useEffect(() => {
      if (dataset?.analysis?.segments) {
        setLaiSegments(dataset.analysis.segments);
        return;
      }
      let active = true;
      runDatasetLAI(dataset, fallbackScores).then(segs => {
        if (active && segs) {
          if (dataset.analysis) {
            dataset.analysis.segments = segs;
          }
          setLaiSegments(segs);
        }
      });
      return () => { active = false; };
    }, [dataset, fallbackScores]);

    const paintedAncestry: PaintedAncestryCompositionResult = useMemo(() => {
      if (dataset?.analysis?.paintedAncestry && (laiSegments || dataset?.analysis?.segments)) {
        return dataset.analysis.paintedAncestry;
      }
      return computePaintedAncestry(laiSegments || dataset?.analysis?.segments, fallbackScores);
    }, [laiSegments, dataset, fallbackScores]);

    const continentalData = useMemo(() => {
      return paintedAncestry.items;
    }, [paintedAncestry]);

    const dominantContinent = useMemo(() => {
      return paintedAncestry.dominant;
    }, [paintedAncestry]);

    // Data for legacy radar view
    const ancestryRadarData = useMemo(() => {
      if (continentalData.length > 0) {
        return continentalData.map(c => ({
          name: c.name,
          value: c.percentage,
        }));
      }
      return [];
    }, [continentalData]);

    const topFamousMatches = useMemo(() => {
      if (!famousMatches || famousMatches.length === 0) return [];
      return [...famousMatches]
        .sort((a, b) => {
          const scoreA = a.affinity != null ? a.affinity : (a.matchPercentage || 0);
          const scoreB = b.affinity != null ? b.affinity : (b.matchPercentage || 0);
          return scoreB - scoreA;
        })
        .slice(0, 6);
    }, [famousMatches]);

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
                {onOpenMethodology && (
                  <button
                    type="button"
                    onClick={onOpenMethodology}
                    className="bg-teal-500/15 hover:bg-teal-500/30 border border-teal-500/40 rounded-xl px-3 py-1.5 flex items-center gap-1.5 backdrop-blur text-teal-300 font-black tracking-wider text-[9px] uppercase transition-all active:scale-95 cursor-pointer shadow-sm"
                    title="View Genomic Passport & Profile Methodology"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                    <span>Methodology & Info</span>
                  </button>
                )}
              </div>
            </div>

            {/* ===== Main Bento Grid ===== */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 min-w-0">
              {/* ===== CELL A : Admixture & Subpopulations (span 8) ===== */}
              <div className="xl:col-span-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 shadow-xl flex flex-col space-y-5 min-w-0 overflow-hidden">
                {/* Header & View Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
                  <div>
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.15em]">
                      Biogeographical Origins &amp; Deconvolution
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      Hierarchical continental partition and fine‑grained regional substructure.
                    </p>
                  </div>

                  {/* Visual mode switcher */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10 self-start sm:self-auto">
                    <button
                      onClick={() => setChartMode('donut')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        chartMode === 'donut'
                          ? 'bg-cyan-500 text-cyan-950 shadow-md shadow-cyan-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Orbit className="w-3.5 h-3.5" />
                      <span>Donut Ring</span>
                    </button>
                    <button
                      onClick={() => setChartMode('radar')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        chartMode === 'radar'
                          ? 'bg-cyan-500 text-cyan-950 shadow-md shadow-cyan-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Radar</span>
                    </button>
                  </div>
                </div>

                {/* Continental Genome Horizon Ribbon */}
                {continentalData.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" /> Continental Genome Horizon
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">100.0% Normalized Partition</span>
                    </div>

                    {/* Proportional ribbon bar */}
                    <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden flex border border-white/10 shadow-inner">
                      {continentalData.map((c) => (
                        <div
                          key={c.name}
                          style={{ width: `${c.value}%`, backgroundColor: c.color }}
                          className="h-full transition-all duration-300 hover:opacity-90 cursor-pointer"
                          onMouseEnter={() => setHoveredSlice({ name: c.name, value: c.value, color: c.color, icon: c.icon })}
                          onMouseLeave={() => setHoveredSlice(null)}
                          title={`${c.name}: ${c.value.toFixed(1)}%`}
                        />
                      ))}
                    </div>

                    {/* Horizon Legend Pills */}
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {continentalData.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setHoveredSlice(hoveredSlice?.name === c.name ? null : { name: c.name, value: c.value, color: c.color, icon: c.icon })}
                          className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                            hoveredSlice?.name === c.name
                              ? `${c.bg} ${c.border} ${c.text} ring-1 ring-white/20`
                              : 'bg-white/[0.03] border-white/5 text-slate-300 hover:bg-white/[0.08]'
                          }`}
                        >
                          <span>{c.icon}</span>
                          <span className="font-semibold">{c.name}:</span>
                          <span className="font-mono font-black text-white">{c.value.toFixed(1)}%</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-grid: Chart (Left) + Top Subpopulations (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
                  {/* Left Column: Visual Chart Display */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center border-r border-white/10 pr-0 lg:pr-4">
                    <div className="relative w-full h-[260px] flex items-center justify-center">
                      {isChartReady ? (
                        chartMode === 'donut' ? (
                          <>
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
                              <PieChart>
                                <Pie
                                  data={continentalData}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  innerRadius="60%"
                                  outerRadius="88%"
                                  paddingAngle={3}
                                  stroke="#0f172a"
                                  strokeWidth={2}
                                  onMouseEnter={(_, index) => {
                                    const item = continentalData[index];
                                    if (item) setHoveredSlice({ name: item.name, value: item.value, color: item.color, icon: item.icon });
                                  }}
                                  onMouseLeave={() => setHoveredSlice(null)}
                                >
                                  {continentalData.map((entry, index) => (
                                    <Cell key={`donut-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>

                            {/* Interactive Center Hub */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-3">
                              <AnimatePresence mode="wait">
                                <motion.div
                                  key={hoveredSlice ? hoveredSlice.name : dominantContinent.name}
                                  initial={{ opacity: 0, scale: 0.94 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.94 }}
                                  transition={{ duration: 0.15 }}
                                  className="flex flex-col items-center justify-center space-y-0.5"
                                >
                                  <span className="text-2xl filter drop-shadow-md">
                                    {hoveredSlice ? hoveredSlice.icon : dominantContinent.icon}
                                  </span>
                                  <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight leading-none pt-1">
                                    {(hoveredSlice ? hoveredSlice.value : dominantContinent.value).toFixed(1)}%
                                  </span>
                                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 truncate max-w-[130px]">
                                    {hoveredSlice ? hoveredSlice.name : dominantContinent.name}
                                  </span>
                                  <span className="text-[8px] font-bold uppercase tracking-widest text-cyan-400 font-mono">
                                    {hoveredSlice ? 'Inspected Clade' : 'Dominant Clade'}
                                  </span>
                                </motion.div>
                              </AnimatePresence>
                            </div>
                          </>
                        ) : (
                          <ResponsiveContainer
                            width="100%"
                            height="100%"
                            minWidth={0}
                            minHeight={250}
                            debounce={1}
                          >
                            <RadarChart
                              data={ancestryRadarData}
                              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                            >
                              <PolarGrid
                                stroke="rgba(148,163,184,0.2)"
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
                                fill="#06b6d4"
                                fillOpacity={0.25}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        )
                      ) : (
                        <div className="w-full h-full bg-slate-800/50 rounded-2xl animate-pulse" />
                      )}
                    </div>

                    <div className="flex justify-center gap-2 mt-2 flex-wrap text-[9px] font-mono">
                      {continentalData.map((anc: any, i: number) => (
                        <span
                          key={i}
                          className="text-slate-300 bg-slate-800/50 px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-1.5"
                        >
                          <span>{anc.icon}</span>
                          <strong>{anc.name}:</strong> {(anc.percentage || anc.value || 0).toFixed(1)}%
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Painted Ancestry Composition List */}
                  <div className="lg:col-span-7 space-y-2.5 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                          Painted Ancestry Composition
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20 font-bold">
                        Total Length: {paintedAncestry.totalMb.toLocaleString()} Mb
                      </span>
                    </div>

                    {(dataset?.snpCount || 0) > 0 && (dataset?.snpCount || 0) < 1000 ? (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">
                        <span>⚠️</span>
                        <span>Low marker coverage ({(dataset?.snpCount || 0).toLocaleString()} SNPs). Local ancestry painting requires a full microarray kit (100,000+ SNPs) for maximum segment resolution.</span>
                      </div>
                    ) : null}

                    {paintedAncestry.items.length > 0 ? (
                      paintedAncestry.items.map((pop, idx) => {
                        const rankStyle = RANK_BADGE_STYLES[idx] || RANK_BADGE_STYLES[4];

                        return (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-white/5 backdrop-blur border border-white/10 transition-all hover:border-white/20 hover:bg-white/[0.08] min-w-0 overflow-hidden"
                          >
                            <div className="flex items-center justify-between text-xs min-w-0 gap-2 mb-1.5">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                {/* Rank Medal Badge */}
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border shrink-0 ${rankStyle.badge}`}>
                                  {rankStyle.label}
                                </span>
                                <span className="font-bold text-slate-100 truncate min-w-0 flex items-center gap-1.5">
                                  <span>{pop.icon}</span>
                                  <span className="truncate">{pop.name}</span>
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {/* Mb & Tracts Badge */}
                                <span className="font-mono text-[9px] text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-full border border-white/5 tabular-nums">
                                  {pop.mb.toFixed(1)} Mb ({pop.tracts} {pop.tracts === 1 ? 'tract' : 'tracts'})
                                </span>

                                {/* Percentage */}
                                <span className="font-mono font-black text-white bg-white/10 px-2 py-0.5 rounded-full text-[11px] min-w-[44px] text-right tabular-nums">
                                  {pop.percentage.toFixed(1)}%
                                </span>
                              </div>
                            </div>

                            {/* Animated progress bar using continent gradient */}
                            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${pop.gradient} rounded-full transition-all duration-500`}
                                style={{
                                  width: `${Math.max(pop.percentage, 1.5)}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-8 text-center text-xs text-slate-500">
                        No local ancestry painting data present.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ===== CELL B : Lineages & Blood (span 4) ===== */}
              <div className="xl:col-span-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 flex flex-col justify-between shadow-xl space-y-4 min-w-0 overflow-hidden">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.15em]">
                    Uniparental Lineages &amp; Serology
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    Deep phylogenetic markers &amp; erythrocyte antigens.
                  </p>
                </div>

                <div className="space-y-3.5 my-auto min-w-0">
                  {/* Paternal Y-DNA */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur border border-teal-500/20 hover:border-teal-400/40 transition flex gap-3.5 items-center group min-w-0 overflow-hidden">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600/30 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/10 group-hover:scale-105 transition-transform">
                      <Compass className="w-5 h-5 text-teal-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest block leading-none truncate">
                          Paternal (Y‑DNA)
                        </span>
                        <span className="text-[8px] font-mono text-teal-400/80 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20 font-bold shrink-0">
                          Clade
                        </span>
                      </div>
                      <span className="text-base font-black text-white block truncate tracking-tight">
                        {yData?.phase2?.haplogroup ||
                          yData?.predicted?.name ||
                          yData?.predicted ||
                          'Unknown / Female Specimen'}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 font-mono block uppercase truncate mt-0.5">
                        {yData?.phase2?.region ||
                          yData?.predicted?.continent ||
                          yData?.region ||
                          'Universal Origin'}
                      </span>
                    </div>
                  </div>

                  {/* Maternal mtDNA */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur border border-rose-500/20 hover:border-rose-400/40 transition flex gap-3.5 items-center group min-w-0 overflow-hidden">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-600/30 to-pink-500/20 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/10 group-hover:scale-105 transition-transform">
                      <History className="w-5 h-5 text-rose-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest block leading-none truncate">
                          Maternal (mtDNA)
                        </span>
                        <span className="text-[8px] font-mono text-rose-400/80 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 font-bold shrink-0">
                          Mitochondrial
                        </span>
                      </div>
                      <span className="text-base font-black text-white block truncate tracking-tight">
                        {mtData?.predicted?.name || mtData?.predicted || 'Unknown'}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 font-mono block uppercase truncate mt-0.5">
                        {mtData?.region || mtData?.continent || 'Universal Origin'}
                      </span>
                    </div>
                  </div>

                  {/* Blood Type & Rh Factor */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur border border-red-500/20 hover:border-red-400/40 transition flex gap-3.5 items-center group min-w-0 overflow-hidden">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-lg backdrop-blur ${rhDisplay.pillColor} group-hover:scale-105 transition-transform`}
                    >
                      <FlaskConical className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[9px] font-black text-red-400 uppercase tracking-widest block leading-none truncate">
                          {rhDisplay.label || 'Predicted Blood Type'}
                        </span>
                        <span className="text-[8px] font-mono text-red-400/90 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 font-bold shrink-0">
                          ABO / Rh
                        </span>
                      </div>
                      <span className="text-base font-black text-white block truncate tracking-tight">
                        {rhDisplay.name}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 font-mono block uppercase truncate mt-0.5">
                        {rhDisplay.badge}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[9px] font-extrabold text-slate-400 bg-slate-900/60 border border-white/10 p-2.5 rounded-xl text-center select-none backdrop-blur flex items-center justify-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>100% In-Browser Local Processing • Zero Data Transmitted</span>
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
                      <p className="text-[9px] text-slate-400 mt-0.5">
                        Statistical error bounds based on ancestry‑informative marker count.
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
                              {humanizePopName(insight?.pop)}
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

            {/* ===== Ancestral Kinship & Ancient DNA Specimen Affinity ===== */}
            {topFamousMatches.length > 0 && (
              <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                      <Dna className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">
                        Ancestral Kinship &amp; Ancient DNA Specimen Affinity
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        Pairwise SNP matching against published archaeological benchmark genomes.
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full self-start sm:self-auto">
                    Archaeological Benchmark
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topFamousMatches.map((match: any, idx: number) => {
                    const affinity = match.affinity != null ? match.affinity : (match.matchPercentage != null ? Math.round(match.matchPercentage) : 0);
                    const loc = match.location || match.site || 'Archaeological Site';
                    const era = match.era || match.period || 'Ancient Era';
                    const sampleId = match.sampleId || `ANC-${idx + 1}`;
                    const markers = match.sharedMarkers || match.overlappingMarkers || null;

                    return (
                      <div
                        key={match.sampleId || idx}
                        className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur border border-white/10 hover:border-amber-500/40 transition-all duration-200 flex flex-col justify-between gap-3 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-300 group-hover:scale-105 transition-transform">
                              <User className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-black text-slate-100 truncate group-hover:text-amber-300 transition-colors">
                                {match.name || 'Ancient Individual'}
                              </h4>
                              <span className="text-[9px] font-mono text-amber-400/80 font-bold block uppercase tracking-widest truncate">
                                {sampleId}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-base font-black text-amber-400 font-mono tracking-tight block leading-none">
                              {affinity}%
                            </span>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block mt-0.5">
                              Affinity
                            </span>
                          </div>
                        </div>

                        {/* Visual mini affinity meter */}
                        <div className="w-full bg-slate-800/80 rounded-full h-1 overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(affinity, 5))}%` }}
                          />
                        </div>

                        <div className="space-y-1.5 pt-1 text-[10px] text-slate-400 border-t border-white/5">
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate">{loc}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate text-slate-300 font-medium">{era}</span>
                          </div>
                          {markers && (
                            <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500">
                              <Activity className="w-3 h-3 text-purple-400/70 shrink-0" />
                              <span>{markers} overlapping markers</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-teal-500 text-white rotate-180' : 'bg-slate-100 dark:bg-slate-800 text-teal-300/80 group-hover:text-teal-400'}`}>
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

const GroupedSNPCards = memo(({ 
  trait, 
  snps, 
  expandedSnps, 
  toggleExpand 
}: { 
  trait: string, 
  snps: any[], 
  expandedSnps: Set<string>, 
  toggleExpand: (rsid: string) => void 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const matchedCount = snps.filter(s => s.status === 'matched' || s.status === 'partial').length;

  return (
    <div className="border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden bg-slate-50/20 dark:bg-slate-900/10 mb-2">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 text-teal-600 dark:text-teal-400 font-bold text-xs">
            {snps.length}
          </div>
          <div>
            <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">{trait}</h5>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
              {matchedCount} / {snps.length} matched markers
            </p>
          </div>
        </div>
        <span className="text-slate-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
      </button>
      
      {isExpanded && (
        <div className="p-4 pt-0 space-y-3 border-t border-slate-50 dark:border-slate-700/50 mt-2 bg-white dark:bg-slate-800">
          <div className="grid grid-cols-1 gap-3 mt-2">
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
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(() => {
    const defaultSet = new Set<string>();
    if (filteredResults && filteredResults.length > 0) {
      filteredResults.forEach((s: any) => {
        if (s.continent) {
          const reg = mapToRegion(s.continent);
          if (reg) defaultSet.add(reg);
        }
      });
    }
    return defaultSet;
  });

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
                                <div key={i} className={`w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-[7px] font-bold ${s.status === 'matched' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-emerald-200/60'}`}>
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
                              {(() => {
                                const traitGroups: Record<string, any[]> = {};
                                snps.forEach((snp: any) => {
                                  const t = snp.trait || 'Other Markers';
                                  if (!traitGroups[t]) traitGroups[t] = [];
                                  traitGroups[t].push(snp);
                                });
                                return Object.entries(traitGroups).map(([trait, groupSnps]) => {
                                  if (groupSnps.length === 1) {
                                    const snp = groupSnps[0];
                                    return (
                                      <SNPCard 
                                        key={snp.rsid || snp.markerId}
                                        snp={snp} 
                                        isExpanded={expandedSnps.has(snp.rsid)} 
                                        onToggleExpand={toggleExpand} 
                                      />
                                    );
                                  }
                                  return (
                                    <GroupedSNPCards 
                                      key={trait}
                                      trait={trait}
                                      snps={groupSnps}
                                      expandedSnps={expandedSnps}
                                      toggleExpand={toggleExpand}
                                    />
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  (() => {
                    const traitGroups: Record<string, any[]> = {};
                    allSnpsInCategory.forEach((snp: any) => {
                      const t = snp.trait || 'Other Markers';
                      if (!traitGroups[t]) traitGroups[t] = [];
                      traitGroups[t].push(snp);
                    });
                    return Object.entries(traitGroups).map(([trait, groupSnps]) => {
                      if (groupSnps.length === 1) {
                        const snp = groupSnps[0];
                        return (
                          <SNPCard 
                            key={snp.rsid || snp.markerId}
                            snp={snp} 
                            isExpanded={expandedSnps.has(snp.rsid)} 
                            onToggleExpand={toggleExpand} 
                          />
                        );
                      }
                      return (
                        <GroupedSNPCards 
                          key={trait}
                          trait={trait}
                          snps={groupSnps}
                          expandedSnps={expandedSnps}
                          toggleExpand={toggleExpand}
                        />
                      );
                    });
                  })()
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
      <div className="mt-12 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/80 shadow-md backdrop-blur-sm">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-slate-500 dark:text-slate-400 text-center">
          Not enough data to generate an ancestry prediction.
        </div>
      </div>
    );
  }

  const { continentalScores, regionalScores, deepScores, subPopulations, chromosomeData, segments, confidenceIntervals } = currentData || { continentalScores: {}, regionalScores: {}, deepScores: {}, subPopulations: {}, chromosomeData: {}, segments: [], confidenceIntervals: {} };
  
  if (Object.keys(continentalScores).length === 0) {
    return (
      <div className="mt-12 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/80 shadow-md backdrop-blur-sm">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-slate-500 dark:text-slate-400 text-center">
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
    <div className="mt-12 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/80 shadow-md backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ancestry Oracle Prediction</h2>
      </div>

      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        <p><strong>Primary Mode:</strong> Uses only high-quality anchor AIMs for the most stable, conservative prediction.</p>
      </div>
      
      <div className="space-y-8">
        {/* Continental Admixture */}
        <div className="bg-slate-50/50 dark:bg-slate-950/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-4">Continental Admixture</h3>
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
          <div className="bg-slate-50/50 dark:bg-slate-950/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🗺️</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Regional Heritage (Granular)</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topGranular.map((pop: any) => (
                    <div key={pop.name} className='flex flex-col p-3 rounded-lg border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/60'>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider line-clamp-1">{formatPopName(pop.name)}</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-lg font-black text-slate-900 dark:text-slate-100">{(pop.percentage || 0).toFixed(2)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Endogamy Indicator */}
            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Endogamy Detection</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Based on contiguous segment analysis</p>
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


export default ProfileSummary;
export { ProfileSummary };
