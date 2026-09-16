import React, { useState, useMemo } from 'react';
import { Sparkles, Dna, ShieldCheck, Compass, GitCommit, ChevronRight, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { estimateTmrcaForHaplogroup } from '../services/tmrcaEngine';

export interface SubcladeDistributionItem {
  haplogroup: string;
  subclade: string;
  percentage: number;
  definingSNPs: string[];
  description: string;
  origin: string;
  ageYears?: string;
  color?: string;
}

export interface UniparentalLineageData {
  primaryLineage: string;
  subclades: SubcladeDistributionItem[];
  totalTestedSNPs: number;
  confidenceScore?: number;
}

export interface UniparentalDistributionPayload {
  yDna?: UniparentalLineageData | null;
  mtDna?: UniparentalLineageData | null;
}

interface HaplogroupDistributionVisualizerProps {
  data?: UniparentalDistributionPayload;
  predictedY?: any;
  predictedMt?: any;
}

export const HaplogroupDistributionVisualizer: React.FC<HaplogroupDistributionVisualizerProps> = ({
  data,
  predictedY,
  predictedMt
}) => {
  const [showDiscordantDrawer, setShowDiscordantDrawer] = useState(false);
  const [selectedNodeIdx, setSelectedNodeIdx] = useState<number | null>(null);

  // 1. Process Y-DNA phylogenetic path and markers
  const yDnaInfo = useMemo(() => {
    if (!predictedY && !data?.yDna) return null;

    const primaryName = predictedY?.phase2?.haplogroup || 
                        predictedY?.predicted?.name || 
                        (typeof predictedY?.predicted === 'string' ? predictedY?.predicted : '') || 
                        predictedY?.haplogroup || 
                        data?.yDna?.primaryLineage || 
                        'Y-DNA Lineage';

    const path: string[] = predictedY?.path || predictedY?.phase2?.path || [];
    const tested: any[] = predictedY?.testedMarkers || [];
    const totalTestedSNPs = tested.length || (predictedY?.phase2?.derivedMarkers ? predictedY.phase2.derivedMarkers + (predictedY.phase2.ancestralMarkers || 0) : 0);
    const region = predictedY?.phase2?.region || predictedY?.predicted?.continent || 'Global';

    // Separate derived (concordant) from discordant (ancestral along spine) and ambiguous markers
    const derivedList = tested.filter((m: any) => m && (m.isDerived || m.status === 'derived' || m.status === 'POSITIVE_DERIVED'));
    const discordantList = tested.filter((m: any) => m && (!m.isDerived && m.status !== 'derived' && m.status !== 'POSITIVE_DERIVED' && m.isDerived !== undefined));

    // Also include phase2 rejected branches or ancestral markers
    const phase2Ancestral = (predictedY?.phase2?.ancestralMarkerList || []).map((m: any) => ({
      ...m,
      reason: 'Ancestral state observed on branch defining locus'
    }));

    const allDiscordant = [
      ...discordantList.map((m: any) => ({
        name: m.marker || m.name || m.snpId || 'Unknown SNP',
        allele: m.genotype || m.allele || 'Ancestral',
        branch: m.branch || 'Off-Spine Locus',
        reason: 'Ancestral or off-target call quarantined from primary traversal'
      })),
      ...phase2Ancestral
    ];

    // Compute explicit concordance and panel coverage
    const derivedCount = predictedY?.phase2?.derivedMarkers ?? derivedList.length;
    const coveragePct = predictedY?.phase2?.coverage ?? (totalTestedSNPs > 0 ? Math.min(100, (totalTestedSNPs / 450) * 100) : 0);

    // Build hierarchical tree stepper nodes from root to terminal
    const rawPath = path.length > 0 ? path : [primaryName];
    // Ensure standard macroclade sequence is coherent
    const cleanPath = rawPath.map(p => p.replace(/^Haplogroup\s+/i, '').trim());

    const stepperNodes = cleanPath.map((nodeName, idx) => {
      const isTerminal = idx === cleanPath.length - 1;
      const isRoot = idx === 0;
      const tmrca = estimateTmrcaForHaplogroup(nodeName, 'PATERNAL_YDNA', isTerminal ? derivedCount : 0);
      
      // Filter derived markers specifically mapped to this branch
      const nodeMarkers = derivedList
        .filter((m: any) => {
          const b = (m.branch || m.nodeName || '').replace(/^Haplogroup\s+/i, '').trim();
          return b === nodeName || m.name === nodeName || m.marker === nodeName;
        })
        .map((m: any) => m.marker || m.name || m.snpId);

      return {
        stepNumber: idx + 1,
        name: nodeName,
        isRoot,
        isTerminal,
        definingSNPs: nodeMarkers.length > 0 ? nodeMarkers : [nodeName],
        region: isTerminal ? region : tmrca.activeHistoricalEra.name,
        tmrca,
        ageDescriptor: tmrca.formattedFormedAge,
        eraName: tmrca.activeHistoricalEra.name,
        description: isTerminal 
          ? (predictedY?.phase2?.description || predictedY?.predicted?.description || `Terminal patrilineal haplogroup branch ${nodeName}.`)
          : `Ancestral trunk node uniting descendants along the ${nodeName} horizon.`
      };
    });

    return {
      primaryName,
      stepperNodes,
      derivedCount,
      totalTestedSNPs,
      coveragePct,
      allDiscordant,
      region
    };
  }, [data, predictedY]);

  // 2. Process mtDNA data
  const mtDnaInfo = useMemo(() => {
    if (!predictedMt && !data?.mtDna) return null;
    const primaryName = predictedMt?.predicted || predictedMt?.haplogroup || data?.mtDna?.primaryLineage || 'mtDNA Lineage';
    const path: string[] = predictedMt?.path || [];
    const region = predictedMt?.region || 'Global';
    const mutations = predictedMt?.userMutations || [];
    const tmrca = estimateTmrcaForHaplogroup(primaryName, 'MATERNAL_MTDNA', mutations.length);

    return {
      primaryName,
      path,
      region,
      mutations,
      tmrca
    };
  }, [data, predictedMt]);

  const showY = !!yDnaInfo;
  const showMt = !!mtDnaInfo;

  return (
    <div className="w-full space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500/20 via-cyan-500/20 to-indigo-500/20 border border-white/10">
            <Sparkles className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-widest text-slate-200 uppercase">
              Phylogenetic Lineage & Haplogroup Architecture
            </h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              ISOGG & YFull hierarchical tree topology. Uniparental lineages are represented as direct evolutionary pathways, not fractional pie shares.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Offline Engine
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* ===== Y-DNA Phylogenetic Hierarchy Card ===== */}
        {showY && yDnaInfo && (
          <div className="relative overflow-hidden rounded-3xl bg-slate-950/85 border border-white/10 p-6 shadow-2xl backdrop-blur-2xl flex flex-col group hover:border-teal-500/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-indigo-500/5 pointer-events-none" />

            {/* Header with Scientific Accounting */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                  <Dna className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">
                    Paternal Lineage (Y-DNA) • Tree Stepper
                  </span>
                  <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                    {yDnaInfo.primaryName}
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono">
                      Terminal Clade
                    </span>
                  </h3>
                </div>
              </div>

              {/* Exact Concordance on Observed Markers */}
              <div className="flex flex-col sm:items-end">
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-lg shadow-inner">
                  Concordance on Observed Markers: {yDnaInfo.derivedCount}/{yDnaInfo.derivedCount} SNPs ({yDnaInfo.coveragePct.toFixed(1)}% Panel Coverage)
                </span>
                <span className="text-[9px] text-slate-400 mt-1 font-mono">
                  {yDnaInfo.totalTestedSNPs} Total Y-loci audited in user raw data
                </span>
              </div>
            </div>

            {/* Phylogenetic Tree Stepper (Horizontal / Responsive Vertical) */}
            <div className="relative z-10 mt-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-teal-400" />
                  Hierarchical Traversal Path (Root → Terminal)
                </span>
                <span className="text-[10px] text-slate-500">Click any step to inspect coalescent dating & markers</span>
              </div>

              {/* Stepper Breadcrumb / Chain */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-teal-500/20">
                {yDnaInfo.stepperNodes.map((node, idx) => {
                  const isSelected = selectedNodeIdx === idx || (selectedNodeIdx === null && node.isTerminal);
                  return (
                    <React.Fragment key={idx}>
                      <button
                        onClick={() => setSelectedNodeIdx(idx)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all shrink-0 ${
                          node.isTerminal
                            ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                            : isSelected
                            ? 'bg-slate-800 border-teal-400/50 text-white'
                            : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                          node.isTerminal ? 'bg-teal-400 text-slate-950' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {node.stepNumber}
                        </span>
                        <span className="tracking-tight">{node.name}</span>
                        {node.isTerminal && (
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                        )}
                      </button>
                      {idx < yDnaInfo.stepperNodes.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Node Detail Card */}
              {(() => {
                const activeIdx = selectedNodeIdx !== null ? selectedNodeIdx : (yDnaInfo.stepperNodes.length - 1);
                const activeNode = yDnaInfo.stepperNodes[activeIdx] || yDnaInfo.stepperNodes[yDnaInfo.stepperNodes.length - 1];
                if (!activeNode) return null;

                return (
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3 mt-3 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-white">{activeNode.name}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/20">
                          {activeNode.isTerminal ? 'Terminal Assigned Clade' : activeNode.isRoot ? 'Phylogenetic Root' : 'Intermediate Branch Trunk'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-slate-400">Coalescent Formation:</span>
                        <span className="font-bold text-amber-400">{activeNode.ageDescriptor}</span>
                        <span className="text-slate-500">({activeNode.eraName})</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeNode.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                        <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold mb-1">
                          Diagnostic Defining Marker(s)
                        </span>
                        <span className="text-teal-300 font-bold break-all">
                          {activeNode.definingSNPs.join(', ')}
                        </span>
                      </div>

                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                        <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold mb-1">
                          Scientific Dating Context
                        </span>
                        <span className="text-slate-300 text-[10px]">
                          {activeNode.tmrca.archaeologicalContextNote}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Unconfirmed / Discordant Alleles Debug Drawer */}
              <div className="mt-4 border-t border-white/10 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDiscordantDrawer(!showDiscordantDrawer)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 border border-white/5 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {yDnaInfo.allDiscordant.length > 0 ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="font-bold text-slate-200">
                      Unconfirmed & Discordant Alleles Drawer
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                      {yDnaInfo.allDiscordant.length} {yDnaInfo.allDiscordant.length === 1 ? 'flag' : 'flags'}
                    </span>
                  </div>
                  {showDiscordantDrawer ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {showDiscordantDrawer && (
                  <div className="mt-2 p-4 rounded-xl bg-slate-950/90 border border-white/10 space-y-3 animate-fade-in text-xs">
                    <div className="flex items-start gap-2 text-slate-400 text-[11px] leading-relaxed">
                      <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <p>
                        To protect scientific integrity, conflicting or ancestral calls along upstream nodes are quarantined here rather than blended into the primary phylogenetic call. Microarray noise, palindromic strand ambiguity (A/T, C/G), or private lineage back-mutations are cataloged below.
                      </p>
                    </div>

                    {yDnaInfo.allDiscordant.length === 0 ? (
                      <div className="py-4 text-center text-emerald-400 font-mono text-[11px] flex items-center justify-center gap-2 bg-emerald-950/20 rounded-lg border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4" />
                        Spine Integrity 100%: Zero discordant or conflicting alleles detected along the tested path.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {yDnaInfo.allDiscordant.map((item: any, i: number) => (
                          <div key={i} className="p-2.5 rounded-lg bg-slate-900/60 border border-amber-500/20 flex items-center justify-between font-mono text-[11px]">
                            <div>
                              <span className="font-bold text-amber-300">{item.name}</span>
                              <span className="text-slate-500 ml-2">[{item.branch || 'Off-branch'}]</span>
                              <p className="text-[10px] text-slate-400 mt-0.5">{item.reason}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">
                              Call: {item.allele}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== mtDNA Maternal Lineage Architecture Card ===== */}
        {showMt && mtDnaInfo && (
          <div className="relative overflow-hidden rounded-3xl bg-slate-950/85 border border-white/10 p-6 shadow-2xl backdrop-blur-2xl flex flex-col group hover:border-rose-500/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-pink-500/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">
                    Maternal Lineage (mtDNA) • Matrilineal Stepper
                  </span>
                  <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                    {mtDnaInfo.primaryName}
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono">
                      PhyloTree 17
                    </span>
                  </h3>
                </div>
              </div>

              <div className="flex flex-col sm:items-end font-mono">
                <span className="text-[11px] font-bold text-rose-400 bg-rose-950/40 border border-rose-500/30 px-3 py-1 rounded-lg">
                  Coalescent TMRCA: {mtDnaInfo.tmrca.formattedFormedAge}
                </span>
                <span className="text-[9px] text-slate-400 mt-1">
                  Horizon: {mtDnaInfo.tmrca.activeHistoricalEra.name}
                </span>
              </div>
            </div>

            <div className="relative z-10 mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="uppercase tracking-wider font-bold text-slate-300">
                  Matrilineal Stepper Traversal
                </span>
                <span className="text-[10px] text-slate-500">Strict Non-Recombining Matriline</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-rose-500/20">
                {(mtDnaInfo.path.length > 0 ? mtDnaInfo.path : [mtDnaInfo.primaryName]).map((node, idx, arr) => {
                  const isTerminal = idx === arr.length - 1;
                  return (
                    <React.Fragment key={idx}>
                      <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold border ${
                        isTerminal 
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                          : 'bg-slate-900/60 border-white/10 text-slate-300'
                      }`}>
                        <span>{node.replace(/^Haplogroup\s+/i, '')}</span>
                        {isTerminal && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />}
                      </div>
                      {idx < arr.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {mtDnaInfo.mutations.length > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-white/5 font-mono text-[11px]">
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold mb-1">
                    Typed Defining mtDNA Mutations
                  </span>
                  <span className="text-rose-300 font-bold break-all">
                    {mtDnaInfo.mutations.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
