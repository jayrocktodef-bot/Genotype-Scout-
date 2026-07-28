import React, { useState, useMemo } from 'react';
import { Users, ShieldAlert, ArrowRightLeft, Dna, HeartPulse, Pill, Sparkles, Activity, Scale, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { calculateBloodType } from '../engines/bloodTypeCalculator';
import { calculatePharmacogenomics } from '../services/pgxEngine';

export const KitComparisonModule = ({ datasets }: { datasets: any[] }) => {
  const [kitAIndex, setKitAIndex] = useState(0);
  const [kitBIndex, setKitBIndex] = useState(datasets.length > 1 ? 1 : 0);
  const [activeTab, setActiveTab] = useState<'overview' | 'ancestry' | 'blood_traits' | 'pgx' | 'ancient'>('overview');

  if (datasets.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">Insufficient Datasets</h2>
        <p className="text-slate-500 mt-4 max-w-lg dark:text-slate-400">
          To perform a side-by-side comparison, you need to load at least two genomic datasets into the workspace.
        </p>
      </div>
    );
  }

  const kitA = datasets[kitAIndex];
  const kitB = datasets[kitBIndex];

  // Extracts subpopulation admixture list
  const getSubpopMix = (dataset: any) => {
    const admixtureMix = dataset?.analysis?.subpopulationOracle?.all?.admixtureMix || dataset?.analysis?.subpopulationOracle?.admixtureMix || [];
    return [...admixtureMix].sort((a: any, b: any) => (b.percentage || 0) - (a.percentage || 0));
  };

  const mixA = useMemo(() => getSubpopMix(kitA), [kitA]);
  const mixB = useMemo(() => getSubpopMix(kitB), [kitB]);

  // Extract SNP maps
  const snpMapA = kitA?.mergedSnpMap || {};
  const snpMapB = kitB?.mergedSnpMap || {};

  // Kinship & Genetic Overlap Calculation
  const kinship = useMemo(() => {
    if (!snpMapA || !snpMapB) return null;
    let overlappingCount = 0;
    let identicalCount = 0;
    let ibs2 = 0, ibs1 = 0, ibs0 = 0;

    const keysA = Object.keys(snpMapA);
    for (const rsid of keysA) {
      const callA = snpMapA[rsid];
      const callB = snpMapB[rsid];
      if (!callA || !callB || callA === '--' || callB === '--' || callA.length !== 2 || callB.length !== 2) continue;

      overlappingCount++;
      const sortedA = callA.toUpperCase().split('').sort().join('');
      const sortedB = callB.toUpperCase().split('').sort().join('');

      if (sortedA === sortedB) {
        identicalCount++;
        ibs2++;
      } else {
        const aSet = new Set(sortedA.split(''));
        let shared = 0;
        for (const char of sortedB) {
          if (aSet.has(char)) shared++;
        }
        if (shared > 0) ibs1++;
        else ibs0++;
      }
    }

    if (overlappingCount < 50) return null;

    const concordanceRate = (identicalCount / overlappingCount) * 100;
    const kinCoefficient = (ibs2 + 0.5 * ibs1) / overlappingCount;

    let relationship = 'Distant / Unrelated';
    let badgeColor = 'bg-slate-500/20 text-slate-400 border-slate-500/30';

    if (concordanceRate > 98.0) {
      relationship = 'Identical Twin / Same Individual';
      badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    } else if (concordanceRate > 70.0 || kinCoefficient > 0.4) {
      relationship = '1st Degree Relative (Parent/Child or Full Sibling)';
      badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    } else if (concordanceRate > 45.0 || kinCoefficient > 0.2) {
      relationship = '2nd Degree Relative (Half-Sibling / Grandparent / Aunt / Uncle)';
      badgeColor = 'bg-teal-500/20 text-teal-300 border-teal-500/40';
    } else if (concordanceRate > 25.0 || kinCoefficient > 0.1) {
      relationship = '3rd Degree Relative (1st Cousin)';
      badgeColor = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
    }

    return {
      overlappingCount,
      concordanceRate,
      kinCoefficient,
      relationship,
      badgeColor,
      ibs2, ibs1, ibs0
    };
  }, [snpMapA, snpMapB]);

  // Blood Type Calculations
  const bloodA = useMemo(() => calculateBloodType(snpMapA), [snpMapA]);
  const bloodB = useMemo(() => calculateBloodType(snpMapB), [snpMapB]);

  // Pharmacogenomics Calculations
  const pgxA = useMemo(() => calculatePharmacogenomics(snpMapA), [snpMapA]);
  const pgxB = useMemo(() => calculatePharmacogenomics(snpMapB), [snpMapB]);

  // Key Trait Extraction Helpers
  const getTrait = (snpMap: Record<string, string>, rsid: string, map: Record<string, string>, defaultVal = 'Unknown') => {
    const call = (snpMap[rsid] || snpMap[rsid.toUpperCase()] || '--').toUpperCase().split('').sort().join('');
    return map[call] || defaultVal;
  };

  const traitsA = useMemo(() => ({
    caffeine: getTrait(snpMapA, 'rs762551', { 'AA': 'Fast Metabolizer ☕', 'AC': 'Slow Metabolizer 💤', 'CC': 'Slow Metabolizer 💤' }),
    lactose: getTrait(snpMapA, 'rs4988235', { 'AA': 'Lactase Persistent (Tolerant) 🥛', 'AG': 'Lactase Persistent (Tolerant) 🥛', 'GA': 'Lactase Persistent (Tolerant) 🥛', 'GG': 'Lactose Intolerant ⚠️' }),
    muscle: getTrait(snpMapA, 'rs1815739', { 'CC': 'Power / Sprinter (RR) ⚡', 'CT': 'Mixed Sprinter/Endurance (RX) 🏃', 'TC': 'Mixed Sprinter/Endurance (RX) 🏃', 'TT': 'Endurance (XX) 🧘' }),
    flush: getTrait(snpMapA, 'rs671', { 'GG': 'Normal Alcohol Tolerance 🍷', 'GA': 'Alcohol Flush Prone 😳', 'AG': 'Alcohol Flush Prone 😳', 'AA': 'Alcohol Flush Prone 😳' }),
    tas2r38: getTrait(snpMapA, 'rs713598', { 'CC': 'PTC Bitter Taster 🥦', 'CG': 'PTC Bitter Taster 🥦', 'GC': 'PTC Bitter Taster 🥦', 'GG': 'Non-Taster 🍟' }),
  }), [snpMapA]);

  const traitsB = useMemo(() => ({
    caffeine: getTrait(snpMapB, 'rs762551', { 'AA': 'Fast Metabolizer ☕', 'AC': 'Slow Metabolizer 💤', 'CC': 'Slow Metabolizer 💤' }),
    lactose: getTrait(snpMapB, 'rs4988235', { 'AA': 'Lactase Persistent (Tolerant) 🥛', 'AG': 'Lactase Persistent (Tolerant) 🥛', 'GA': 'Lactase Persistent (Tolerant) 🥛', 'GG': 'Lactose Intolerant ⚠️' }),
    muscle: getTrait(snpMapB, 'rs1815739', { 'CC': 'Power / Sprinter (RR) ⚡', 'CT': 'Mixed Sprinter/Endurance (RX) 🏃', 'TC': 'Mixed Sprinter/Endurance (RX) 🏃', 'TT': 'Endurance (XX) 🧘' }),
    flush: getTrait(snpMapB, 'rs671', { 'GG': 'Normal Alcohol Tolerance 🍷', 'GA': 'Alcohol Flush Prone 😳', 'AG': 'Alcohol Flush Prone 😳', 'AA': 'Alcohol Flush Prone 😳' }),
    tas2r38: getTrait(snpMapB, 'rs713598', { 'CC': 'PTC Bitter Taster 🥦', 'CG': 'PTC Bitter Taster 🥦', 'GC': 'PTC Bitter Taster 🥦', 'GG': 'Non-Taster 🍟' }),
  }), [snpMapB]);

  // Combined Population Comparison
  const combinedPopulations = useMemo(() => {
    const map = new Map<string, { name: string; popA: number; popB: number }>();
    mixA.forEach((item: any) => {
      const name = item.name || item.subpop || item.popCode;
      if (name) map.set(name, { name, popA: Number(item.percentage) || 0, popB: 0 });
    });
    mixB.forEach((item: any) => {
      const name = item.name || item.subpop || item.popCode;
      if (name) {
        const existing = map.get(name) || { name, popA: 0, popB: 0 };
        existing.popB = Number(item.percentage) || 0;
        map.set(name, existing);
      }
    });
    return Array.from(map.values())
      .filter(p => p.popA > 0.2 || p.popB > 0.2)
      .sort((a, b) => Math.max(b.popA, b.popB) - Math.max(a.popA, a.popB))
      .slice(0, 10);
  }, [mixA, mixB]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-8 text-white"
    >
      {/* Header & Kit Selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-100">Kit Comparison Studio</h2>
          </div>
          <p className="text-xs text-slate-400">Deep side-by-side comparison of kinship, ancestry admixture, blood types, PGx metabolizers, and traits.</p>
        </div>

        {/* Selectors */}
        <div className="flex items-center gap-3 bg-black/40 p-2.5 rounded-2xl border border-white/10 shadow-sm w-full md:w-auto">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-teal-400 uppercase tracking-wider mb-1 px-1">Primary Kit (A)</span>
            <select 
              value={kitAIndex}
              onChange={(e) => setKitAIndex(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-xs font-bold rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              {datasets.map((d: any, i: number) => (
                <option key={i} value={i}>{d.name?.split('.')[0] || `Kit ${i+1}`}</option>
              ))}
            </select>
          </div>

          <ArrowRightLeft className="w-4 h-4 text-slate-500 shrink-0 mx-1 self-center mt-3" />

          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider mb-1 px-1">Secondary Kit (B)</span>
            <select 
              value={kitBIndex}
              onChange={(e) => setKitBIndex(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-xs font-bold rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {datasets.map((d: any, i: number) => (
                <option key={i} value={i}>{d.name?.split('.')[0] || `Kit ${i+1}`}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Kinship Summary Card */}
      {kinship && (
        <div className="p-6 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                <Scale className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Genetic Kinship & IBS Concordance</h3>
                <p className="text-[11px] text-slate-400">Direct pairwise allele concordance computed across shared autosomal markers.</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-2xl border text-xs font-black uppercase tracking-widest text-center ${kinship.badgeColor}`}>
              {kinship.relationship}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Shared Markers</span>
              <span className="text-base sm:text-lg font-black font-mono text-emerald-400">{kinship.overlappingCount.toLocaleString()} SNPs</span>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Concordance Rate</span>
              <span className="text-base sm:text-lg font-black font-mono text-teal-300">{kinship.concordanceRate.toFixed(2)}%</span>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Kinship Coeff (θ)</span>
              <span className="text-base sm:text-lg font-black font-mono text-indigo-300">{kinship.kinCoefficient.toFixed(4)}</span>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">IBS2 / IBS1 / IBS0</span>
              <span className="text-xs font-mono font-bold text-slate-300 block truncate">{kinship.ibs2} / {kinship.ibs1} / {kinship.ibs0}</span>
            </div>
          </div>
        </div>
      )}

      {/* View Mode Sub-tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {[
          { id: 'overview', label: 'Overview & Haplogroups', icon: Users },
          { id: 'ancestry', label: 'Subpopulation Admixture', icon: Dna },
          { id: 'blood_traits', label: 'Blood & Wellness Traits', icon: HeartPulse },
          { id: 'pgx', label: 'Pharmacogenomics (PGx)', icon: Pill },
          { id: 'ancient', label: 'Ancient Lineages & Matches', icon: Sparkles },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                isActive 
                  ? 'bg-teal-500/20 border-teal-500/40 text-teal-300 shadow-lg shadow-teal-500/10' 
                  : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & Lineages */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Kit A */}
          <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-emerald-500" />
            <div>
              <h3 className="text-xl font-black text-white truncate">{kitA.name?.split('.')[0] || 'Kit A'}</h3>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{kitA.snpCount?.toLocaleString()} SNPs • {kitA.chip || 'Standard Array'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Maternal (mtDNA)</span>
                <span className="text-base font-black text-emerald-400 font-mono block truncate">{kitA.predictedMtDNA?.predicted || 'Unknown'}</span>
              </div>
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Paternal (Y-DNA)</span>
                <span className="text-base font-black text-teal-400 font-mono block truncate">{kitA.predictedYDNA?.predicted?.name || 'Unknown'}</span>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Top Subpopulations
              </h4>
              <div className="space-y-2">
                {mixA.slice(0, 4).map((pop: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-black/30 px-4 py-2.5 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-slate-200">{pop.name || pop.subpop}</span>
                    <span className="text-xs font-black font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                      {(pop.percentage || 0).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kit B */}
          <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 to-purple-500" />
            <div>
              <h3 className="text-xl font-black text-white truncate">{kitB.name?.split('.')[0] || 'Kit B'}</h3>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{kitB.snpCount?.toLocaleString()} SNPs • {kitB.chip || 'Standard Array'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Maternal (mtDNA)</span>
                <span className="text-base font-black text-indigo-400 font-mono block truncate">{kitB.predictedMtDNA?.predicted || 'Unknown'}</span>
              </div>
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Paternal (Y-DNA)</span>
                <span className="text-base font-black text-purple-400 font-mono block truncate">{kitB.predictedYDNA?.predicted?.name || 'Unknown'}</span>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Top Subpopulations
              </h4>
              <div className="space-y-2">
                {mixB.slice(0, 4).map((pop: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-black/30 px-4 py-2.5 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-slate-200">{pop.name || pop.subpop}</span>
                    <span className="text-xs font-black font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                      {(pop.percentage || 0).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Subpopulation Admixture Table */}
      {activeTab === 'ancestry' && (
        <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-lg font-black text-white">Subpopulation Admixture Side-by-Side</h3>
              <p className="text-xs text-slate-400">Comparing top population percentages between Kit A and Kit B.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="text-teal-400 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-400 block" /> {kitA.name?.split('.')[0]}</span>
              <span className="text-indigo-400 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-400 block" /> {kitB.name?.split('.')[0]}</span>
            </div>
          </div>

          <div className="space-y-4">
            {combinedPopulations.map((pop, idx) => {
              const diff = pop.popA - pop.popB;
              return (
                <div key={idx} className="p-4 bg-black/30 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-200">{pop.name}</span>
                    <span className="text-xs font-mono text-slate-400">
                      Delta: <strong className={diff > 0 ? 'text-teal-400' : diff < 0 ? 'text-indigo-400' : 'text-slate-400'}>{diff > 0 ? `+${diff.toFixed(1)}% (Kit A)` : diff < 0 ? `+${Math.abs(diff).toFixed(1)}% (Kit B)` : 'Identical'}</strong>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {/* Kit A Bar */}
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-bold text-teal-400 w-12 text-right">{pop.popA.toFixed(1)}%</span>
                      <div className="flex-1 bg-black/50 h-2 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full" style={{ width: `${Math.min(100, pop.popA)}%` }} />
                      </div>
                    </div>

                    {/* Kit B Bar */}
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-bold text-indigo-400 w-12 text-right">{pop.popB.toFixed(1)}%</span>
                      <div className="flex-1 bg-black/50 h-2 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full" style={{ width: `${Math.min(100, pop.popB)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Blood & Wellness Traits */}
      {activeTab === 'blood_traits' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Kit A Blood & Traits */}
          <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-xl space-y-6">
            <h3 className="text-lg font-black text-teal-300 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-teal-400" /> {kitA.name?.split('.')[0]} — Blood & Traits
            </h3>

            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Predicted Blood Group</span>
                <span className="text-xl font-black font-mono text-teal-400">{bloodA.bloodType || 'Unknown'}</span>
              </div>
              <p className="text-[11px] text-slate-400">Confidence: {bloodA.confidence || 'N/A'}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Wellness Marker Profile</h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-slate-400 font-bold">Caffeine Metabolism</span>
                  <span className="font-bold text-slate-200">{traitsA.caffeine}</span>
                </div>
                <div className="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-slate-400 font-bold">Lactose Tolerance</span>
                  <span className="font-bold text-slate-200">{traitsA.lactose}</span>
                </div>
                <div className="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-slate-400 font-bold">Muscle (ACTN3)</span>
                  <span className="font-bold text-slate-200">{traitsA.muscle}</span>
                </div>
                <div className="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-slate-400 font-bold">Alcohol Flush</span>
                  <span className="font-bold text-slate-200">{traitsA.flush}</span>
                </div>
                <div className="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-slate-400 font-bold">TAS2R38 Bitter Taste</span>
                  <span className="font-bold text-slate-200">{traitsA.tas2r38}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kit B Blood & Traits */}
          <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-xl space-y-6">
            <h3 className="text-lg font-black text-indigo-300 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-indigo-400" /> {kitB.name?.split('.')[0]} — Blood & Traits
            </h3>

            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Predicted Blood Group</span>
                <span className="text-xl font-black font-mono text-indigo-400">{bloodB.bloodType || 'Unknown'}</span>
              </div>
              <p className="text-[11px] text-slate-400">Confidence: {bloodB.confidence || 'N/A'}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Wellness Marker Profile</h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-slate-400 font-bold">Caffeine Metabolism</span>
                  <span className="font-bold text-slate-200">{traitsB.caffeine}</span>
                </div>
                <div className="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-slate-400 font-bold">Lactose Tolerance</span>
                  <span className="font-bold text-slate-200">{traitsB.lactose}</span>
                </div>
                <div className="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-slate-400 font-bold">Muscle (ACTN3)</span>
                  <span className="font-bold text-slate-200">{traitsB.muscle}</span>
                </div>
                <div className="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-slate-400 font-bold">Alcohol Flush</span>
                  <span className="font-bold text-slate-200">{traitsB.flush}</span>
                </div>
                <div className="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-slate-400 font-bold">TAS2R38 Bitter Taste</span>
                  <span className="font-bold text-slate-200">{traitsB.tas2r38}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Pharmacogenomics (PGx) */}
      {activeTab === 'pgx' && (
        <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-xl space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-emerald-400" /> Pharmacogenomics (PGx) Metabolizer Comparison
            </h3>
            <p className="text-xs text-slate-400">Comparing drug metabolizer phenotypes between kits.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Kit A PGx */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-teal-400">{kitA.name?.split('.')[0]} (Kit A)</h4>
              {pgxA.length > 0 ? pgxA.map((rpt, i) => (
                <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-200">{rpt.gene} — {rpt.drug}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${rpt.severity === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                      {rpt.phenotype}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{rpt.message}</p>
                </div>
              )) : <div className="p-4 bg-black/30 rounded-2xl border border-white/5 text-xs text-slate-400 italic">No high-risk PGx metabolizer alerts detected for Kit A.</div>}
            </div>

            {/* Kit B PGx */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">{kitB.name?.split('.')[0]} (Kit B)</h4>
              {pgxB.length > 0 ? pgxB.map((rpt, i) => (
                <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-200">{rpt.gene} — {rpt.drug}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${rpt.severity === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                      {rpt.phenotype}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{rpt.message}</p>
                </div>
              )) : <div className="p-4 bg-black/30 rounded-2xl border border-white/5 text-xs text-slate-400 italic">No high-risk PGx metabolizer alerts detected for Kit B.</div>}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Ancient Lineages & Historic Matches */}
      {activeTab === 'ancient' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Kit A Ancient */}
          <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-xl space-y-4">
            <h3 className="text-lg font-black text-teal-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" /> {kitA.name?.split('.')[0]} — Ancient Lineages
            </h3>
            <div className="space-y-2">
              {(kitA.analysis?.ancientAdmixture || []).length > 0 ? (kitA.analysis.ancientAdmixture || []).slice(0, 5).map((anc: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-3 bg-black/30 rounded-xl border border-white/5 text-xs">
                  <span className="font-bold text-slate-200">{anc.popCode || anc.name}</span>
                  <span className="font-mono font-bold text-teal-300">{(anc.percentage || 0).toFixed(1)}%</span>
                </div>
              )) : <p className="text-xs text-slate-400 italic">No ancient admixture calculated.</p>}
            </div>
          </div>

          {/* Kit B Ancient */}
          <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-xl space-y-4">
            <h3 className="text-lg font-black text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> {kitB.name?.split('.')[0]} — Ancient Lineages
            </h3>
            <div className="space-y-2">
              {(kitB.analysis?.ancientAdmixture || []).length > 0 ? (kitB.analysis.ancientAdmixture || []).slice(0, 5).map((anc: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-3 bg-black/30 rounded-xl border border-white/5 text-xs">
                  <span className="font-bold text-slate-200">{anc.popCode || anc.name}</span>
                  <span className="font-mono font-bold text-indigo-300">{(anc.percentage || 0).toFixed(1)}%</span>
                </div>
              )) : <p className="text-xs text-slate-400 italic">No ancient admixture calculated.</p>}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

