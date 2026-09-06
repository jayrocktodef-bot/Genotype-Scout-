import React, { memo, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dna, HelpCircle, MapPin, Orbit, LayoutGrid, Radio, ChevronRight, Globe, Layers } from 'lucide-react';
import { 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  RadarChart, 
  ResponsiveContainer, 
  Tooltip,
  PieChart,
  Pie,
  Cell 
} from 'recharts';
import { trackSickleCellHaplotype } from '../utils/ancestry/haplotypeTracker';
import { calculateAdmixtureCI } from '../utils/statistics/confidenceEngine';

import { CONTINENT_PALETTES, assignContinent } from '../constants/ancestryThemes';
export { CONTINENT_PALETTES, assignContinent };

export const ModernAncestryOracle = memo(({ 
  results,
  dataset,
  onOpenMethodology,
  mode = 'explorer'
}: { 
  results: any;
  dataset?: any;
  onOpenMethodology?: () => void;
  mode?: 'explorer' | 'analyst';
}) => {
  const [isChartReady, setIsChartReady] = useState(false);
  const [visualMode, setVisualMode] = useState<'sunburst' | 'bento' | 'radar'>('sunburst');
  const [hoveredSlice, setHoveredSlice] = useState<{
    name: string;
    value: number;
    continent?: string;
    color?: string;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsChartReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const rawSubpopulationEntries = useMemo(() => {
    const subOracle = dataset?.analysis?.subpopulationOracle || results?.subpopulationOracle;
    const mix = subOracle?.all?.admixtureMix || subOracle?.admixtureMix;

    if (mix && Array.isArray(mix) && mix.length > 0) {
      return mix
        .filter((item: any) => Number(item.percentage) > 0.1)
        .map((item: any) => ({
          popCode: item.popCode || '',
          name: item.name || item.subpop || item.popCode,
          percentage: Number(item.percentage) || 0
        }))
        .sort((a, b) => b.percentage - a.percentage);
    }

    const breakdown = subOracle?.all?.breakdown || subOracle?.breakdown;
    if (breakdown && Array.isArray(breakdown) && breakdown.length > 0) {
      return breakdown.slice(0, 12).map((item: any) => ({
        popCode: item.popCode || '',
        name: item.subpop || item.name || item.popCode,
        percentage: Number(item.similarityScore || item.percentage || 0)
      })).sort((a, b) => b.percentage - a.percentage);
    }

    const rawScores = results?.primary?.continentalScores || {};
    return Object.entries(rawScores).map(([name, score]) => ({
      popCode: '',
      name,
      percentage: Number(score) || 0
    })).sort((a, b) => b.percentage - a.percentage);
  }, [dataset, results]);

  const { continentalTotals, groupedSubpops } = useMemo(() => {
    const totals: Record<string, number> = {};
    const grouped: Record<string, Array<{ popCode: string; name: string; percentage: number }>> = {};

    rawSubpopulationEntries.forEach(item => {
      const continent = assignContinent(item.name, item.popCode);
      totals[continent] = (totals[continent] || 0) + item.percentage;
      if (!grouped[continent]) grouped[continent] = [];
      grouped[continent].push(item);
    });

    return { continentalTotals: totals, groupedSubpops: grouped };
  }, [rawSubpopulationEntries]);

  // Nested Donut Chart data: Inner Ring = Continents, Outer Ring = Subpopulations
  const { continentalPieData, subpopPieData } = useMemo(() => {
    const innerData: Array<{ name: string; value: number; color: string }> = [];
    const outerData: Array<{ name: string; value: number; continent: string; color: string }> = [];

    const sortedContinents = Object.entries(continentalTotals)
      .sort((a, b) => b[1] - a[1]);

    sortedContinents.forEach(([continent, totalVal]) => {
      const theme = CONTINENT_PALETTES[continent] || CONTINENT_PALETTES['Other'];
      innerData.push({
        name: continent,
        value: Number(totalVal.toFixed(1)),
        color: theme.base
      });

      const subpops = groupedSubpops[continent] || [];
      subpops.forEach((sp, spIdx) => {
        const tint = theme.tints[spIdx % theme.tints.length];
        outerData.push({
          name: sp.name,
          value: Number(sp.percentage.toFixed(1)),
          continent,
          color: tint
        });
      });
    });

    return { continentalPieData: innerData, subpopPieData: outerData };
  }, [continentalTotals, groupedSubpops]);

  // Chart data for legacy radar view
  const radarChartData = useMemo(() => {
    return rawSubpopulationEntries.slice(0, 16).map(item => ({
      subject: item.name,
      A: item.percentage,
      fullMark: 100
    }));
  }, [rawSubpopulationEntries]);

  const hbbMigration = useMemo(() => {
    return results?.userSnps ? trackSickleCellHaplotype(results.userSnps) : null;
  }, [results?.userSnps]);

  const hasData = rawSubpopulationEntries.length > 0;
  if (!hasData) {
    return (
      <div className="p-12 text-center text-slate-500 dark:text-slate-400">
        No Ancestry Results Available - Please load and process a valid dataset.
      </div>
    );
  }

  const topSubpop = rawSubpopulationEntries[0];
  const totalSnps = dataset?.snpsCount || 13383;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:space-y-10"
    >
      {/* Standard Oracle Section */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#111213]/80 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3 border-b border-white/5 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#F5F6F7] tracking-tight">Ancestry Oracle V2</h2>
              <span className="text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-400 px-2.5 py-0.5 rounded-full border border-cyan-500/20 font-bold">
                Two-Stage NNLS
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-[#4599FF] uppercase tracking-widest mt-0.5">
              High-Precision Admixture Analysis
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setVisualMode('sunburst')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                visualMode === 'sunburst'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>Hierarchical Ring</span>
            </button>
            <button
              onClick={() => setVisualMode('bento')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                visualMode === 'bento'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Horizon & Bento</span>
            </button>
            <button
              onClick={() => setVisualMode('radar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                visualMode === 'radar'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Radar</span>
            </button>
          </div>
        </div>

        {mode === 'analyst' && (
          <div className="mb-6 p-4 rounded-xl bg-teal-500/5 border border-teal-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 hover:border-teal-500/30 transition-all">
            <div className="flex gap-3 items-center text-[#F5F6F7]">
              <Dna className="w-5 h-5 text-teal-400 shrink-0" />
              <div>
                <h4 className="font-extrabold text-xs tracking-tight text-white">Hierarchical Admixture Decomposition</h4>
                <p className="text-xs text-slate-400 leading-normal max-w-xl">
                  First solves for orthogonal continental clades, then resolves within-clade subpopulation frequencies with Non-Negative Least Squares to eliminate cross-continental distortion.
                </p>
              </div>
            </div>
            {onOpenMethodology && (
              <button
                onClick={onOpenMethodology}
                className="w-full sm:w-auto shrink-0 px-3.5 py-1.5 bg-teal-600/20 hover:bg-teal-600/35 border border-teal-500/30 text-teal-300 font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
                Methodology
              </button>
            )}
          </div>
        )}

        {/* Proportional Admixture Horizon Bar */}
        <div className="mb-6 p-4 rounded-xl bg-black/30 border border-white/5 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Continental Genome Horizon
            </span>
            <span className="text-[10px] font-mono text-slate-500">100.0% Complete Partition</span>
          </div>

          <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden flex border border-white/5 shadow-inner">
            {Object.entries(continentalTotals)
              .sort((a, b) => b[1] - a[1])
              .map(([continent, pct]) => {
                const theme = CONTINENT_PALETTES[continent] || CONTINENT_PALETTES['Other'];
                return (
                  <div
                    key={continent}
                    style={{ width: `${pct}%`, backgroundColor: theme.base }}
                    className="h-full transition-all relative group"
                    title={`${continent}: ${pct.toFixed(1)}%`}
                  />
                );
              })}
          </div>

          {/* Horizon Legend Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {Object.entries(continentalTotals)
              .sort((a, b) => b[1] - a[1])
              .map(([continent, pct]) => {
                const theme = CONTINENT_PALETTES[continent] || CONTINENT_PALETTES['Other'];
                return (
                  <div 
                    key={continent}
                    className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.base }} />
                    <span className="font-semibold text-slate-300">{continent}:</span>
                    <span className="font-mono font-bold text-white">{pct.toFixed(1)}%</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* View 1: Hierarchical Sunburst / Nested Donut Ring */}
        {visualMode === 'sunburst' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 h-[360px] sm:h-[460px] w-full min-w-0 relative bg-black/30 rounded-2xl p-4 border border-white/5 flex items-center justify-center">
              {isChartReady ? (
                <>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
                    <PieChart>
                      {/* Inner Ring: Continental Clades */}
                      <Pie
                        data={continentalPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="34%"
                        outerRadius="54%"
                        stroke="#0f172a"
                        strokeWidth={2}
                        onMouseEnter={(_, index) => setHoveredSlice({
                          name: continentalPieData[index].name,
                          value: continentalPieData[index].value,
                          continent: continentalPieData[index].name,
                          color: continentalPieData[index].color
                        })}
                        onMouseLeave={() => setHoveredSlice(null)}
                      >
                        {continentalPieData.map((entry, index) => (
                          <Cell key={`inner-${index}`} fill={entry.color} />
                        ))}
                      </Pie>

                      {/* Outer Ring: Subpopulations */}
                      <Pie
                        data={subpopPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="58%"
                        outerRadius="86%"
                        stroke="#0f172a"
                        strokeWidth={2}
                        onMouseEnter={(_, index) => setHoveredSlice(subpopPieData[index])}
                        onMouseLeave={() => setHoveredSlice(null)}
                      >
                        {subpopPieData.map((entry, index) => (
                          <Cell key={`outer-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Interactive Hub */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-3">
                    <AnimatePresence mode="wait">
                      {hoveredSlice ? (
                        <motion.div
                          key={hoveredSlice.name}
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.92 }}
                          transition={{ duration: 0.12 }}
                          className="space-y-0.5 max-w-[170px]"
                        >
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block truncate">
                            {hoveredSlice.continent || 'Continent'}
                          </span>
                          <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                            {hoveredSlice.value.toFixed(1)}%
                          </span>
                          <span className="text-[11px] font-bold text-cyan-400 block truncate" title={hoveredSlice.name}>
                            {hoveredSlice.name}
                          </span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="default-hub"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-0.5 max-w-[170px]"
                        >
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">
                            Top Component
                          </span>
                          <span className="text-xl sm:text-2xl font-black text-white font-mono block">
                            {topSubpop?.percentage.toFixed(1)}%
                          </span>
                          <span className="text-[11px] font-bold text-slate-300 block truncate" title={topSubpop?.name}>
                            {topSubpop?.name || 'Ancestry'}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-[#1e293b]/40 rounded-xl animate-pulse" />
              )}
            </div>

            {/* Right: Subpopulations Ranked List */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                Deconvolved Subpopulations
              </span>
              {rawSubpopulationEntries.map((item, idx) => {
                const continent = assignContinent(item.name, item.popCode);
                const theme = CONTINENT_PALETTES[continent] || CONTINENT_PALETTES['Other'];
                const ci = calculateAdmixtureCI(item.percentage, totalSnps);
                const isHovered = hoveredSlice?.name === item.name;

                return (
                  <div 
                    key={idx}
                    onMouseEnter={() => setHoveredSlice({
                      name: item.name,
                      value: item.percentage,
                      continent,
                      color: theme.base
                    })}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`p-3 rounded-xl backdrop-blur-sm border transition-all cursor-pointer ${
                      isHovered 
                        ? 'bg-white/10 border-cyan-400/60 shadow-lg shadow-cyan-500/10' 
                        : 'bg-[#1a1b1d]/70 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${theme.bg} ${theme.text}`}>
                            {theme.icon} {continent}
                          </span>
                        </div>
                        <span className="font-bold text-xs sm:text-sm text-slate-200 block truncate" title={item.name}>
                          {item.name}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-black text-sm sm:text-base text-cyan-400 block">
                          {item.percentage.toFixed(1)}%
                        </span>
                        <span className="font-mono text-[9px] text-slate-400 block">
                          [{ci.low}%–{ci.high}%]
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-800/80 rounded-full h-1 mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isHovered ? 'bg-cyan-400' : 'bg-slate-400'
                        }`}
                        style={{ width: `${Math.max(item.percentage, 2)}%`, backgroundColor: isHovered ? undefined : theme.base }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View 2: Horizon & Bento Cards */}
        {visualMode === 'bento' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(groupedSubpops)
                .sort((a, b) => (continentalTotals[b[0]] || 0) - (continentalTotals[a[0]] || 0))
                .map(([continent, subpops]) => {
                  const theme = CONTINENT_PALETTES[continent] || CONTINENT_PALETTES['Other'];
                  const total = continentalTotals[continent] || 0;

                  return (
                    <div
                      key={continent}
                      className={`p-4 rounded-2xl bg-[#1a1b1d]/70 backdrop-blur-md border ${theme.border} space-y-3 shadow-lg flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{theme.icon}</span>
                            <h3 className="font-black text-sm text-white">{continent}</h3>
                          </div>
                          <span className={`font-mono font-black text-sm px-2.5 py-0.5 rounded-full ${theme.bg} ${theme.text}`}>
                            {total.toFixed(1)}%
                          </span>
                        </div>

                        <div className="space-y-2.5 mt-3">
                          {subpops.map((sp, sIdx) => {
                            const ci = calculateAdmixtureCI(sp.percentage, totalSnps);
                            return (
                              <div key={sIdx} className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-slate-300 truncate max-w-[180px]" title={sp.name}>
                                    {sp.name}
                                  </span>
                                  <div className="flex items-center gap-1.5 font-mono">
                                    <span className="text-[9px] text-slate-500">[{ci.low}%–{ci.high}%]</span>
                                    <span className="font-bold text-slate-200 text-xs">{sp.percentage.toFixed(1)}%</span>
                                  </div>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="h-full rounded-full transition-all"
                                    style={{ 
                                      width: `${Math.max(sp.percentage, 2)}%`,
                                      backgroundColor: theme.base 
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* View 3: Radar Chart (Legacy) */}
        {visualMode === 'radar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="h-[360px] sm:h-[460px] lg:col-span-2 w-full min-w-0 relative bg-black/20 rounded-2xl p-2 border border-white/5">
              {isChartReady ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300} debounce={1}>
                  <RadarChart cx="50%" cy="50%" outerRadius="82%" data={radarChartData} margin={{ top: 10, right: 15, bottom: 10, left: 15 }}>
                    <PolarGrid stroke="#334155" strokeWidth={1.2} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: window.innerWidth < 640 ? 8 : 10, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Ancestry"
                      dataKey="A"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.35}
                      strokeWidth={2}
                    />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#06b6d4', color: '#f8fafc', borderRadius: '0.75rem', backdropFilter: 'blur(8px)', fontSize: '0.75rem' }} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-[#1e293b]/50 rounded-xl animate-pulse" />
              )}
            </div>

            <div className="space-y-1.5 lg:col-span-1 max-h-[460px] overflow-y-auto pr-1">
              {rawSubpopulationEntries.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2.5 rounded-xl bg-[#1a1b1d]/70 backdrop-blur-sm border border-white/5 hover:border-cyan-500/50 transition-colors">
                  <span className="font-bold text-xs text-[#F5F6F7] truncate mr-2" title={item.name}>{item.name}</span>
                  <span className="font-mono font-bold text-xs text-cyan-400 shrink-0">{item.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Historical Haplotype Tracking for Sickle Cell / HBB */}
      {hbbMigration && (
        <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-red-500/5 border border-red-500/10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <MapPin size={120} />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-red-500/20">
              <MapPin className="w-4 h-4 text-red-500" />
            </div>
            <h4 className="text-xs font-black text-red-500 uppercase tracking-widest">Historical Haplotype Tracker</h4>
          </div>
          <div className="flex flex-col md:flex-row gap-6 relative z-10">
            <div className="flex-grow">
              <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">Variant Lineage Detected</div>
              <h5 className="text-lg sm:text-xl font-black text-white mb-2">{hbbMigration.type} Pattern (HBB)</h5>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
                {hbbMigration.narrative}
              </p>
            </div>
            <div className="w-full md:min-w-[280px] md:w-auto p-5 rounded-2xl bg-black/40 border border-white/5">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 dark:text-slate-400">Migration Path</div>
              <div className="space-y-3">
                {hbbMigration.path.split('→').map((node: string, i: number, arr: any[]) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-red-500' : 'bg-slate-700'}`}></div>
                      {i < arr.length - 1 && <div className="w-[1px] h-3 bg-slate-800"></div>}
                    </div>
                    <span className={`text-xs ${i === 0 ? 'font-bold text-slate-200' : 'text-slate-500'}`}>{node.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
});
