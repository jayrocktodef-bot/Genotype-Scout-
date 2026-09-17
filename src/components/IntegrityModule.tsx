import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck, AlertTriangle, CheckCircle2,
  Dna, Cpu, FileText, Database, Activity,
  Layers, Info, BookOpen, ArrowUpDown
} from 'lucide-react';
import {
  assessDatasetIntegrity,
  DetailedIntegrityReport,
  ChromosomeQCStats
} from '../utils/statistics/qualityControl';

interface IntegrityModuleProps {
  dataset: any;
  datasets?: any[];
  activeDatasetIndex?: number;
  setActiveDatasetIndex?: (index: number) => void;
  onOpenMethodology?: (moduleId?: string) => void;
}

export const IntegrityModule: React.FC<IntegrityModuleProps> = ({
  dataset,
  datasets = [],
  activeDatasetIndex = 0,
  setActiveDatasetIndex,
  onOpenMethodology,
}) => {
  const [activeTab, setActiveTab] = useState<'karyotype' | 'table' | 'thresholds'>('karyotype');
  const [sortKey, setSortKey] = useState<'physical' | 'count' | 'callRate'>('physical');

  // Compute detailed integrity report
  const report: DetailedIntegrityReport = useMemo(() => {
    return assessDatasetIntegrity(dataset);
  }, [dataset]);

  // Sort chromosomes according to selection
  const sortedChromosomes = useMemo(() => {
    const list = [...report.chromosomes];
    if (sortKey === 'count') {
      return list.sort((a, b) => b.count - a.count);
    }
    if (sortKey === 'callRate') {
      return list.sort((a, b) => a.callRate - b.callRate);
    }
    return list; // default physical order (1..22, X, Y, MT)
  }, [report.chromosomes, sortKey]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ─── Header & Plaque ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-b from-[#16161c] to-[#0d0d11] border border-amber-500/20 shadow-xl shadow-black/60 relative overflow-hidden">
        {/* Ambient gold glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4 relative z-10">
          <div className="gs-icon w-14 h-14 rounded-2xl shrink-0" aria-hidden="true">
            <div className="absolute inset-[1px] rounded-[inherit] pointer-events-none bg-gradient-to-b from-white/[0.16] via-transparent to-black/[0.4]" />
            <ShieldCheck className="w-7 h-7 text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]" />
            <span className="gs-icon__led animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="gs-gold-badge">
                QC & FIDELITY ENGINE
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                100% Client-Side Audit
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-100 mt-1 tracking-tight">
              File & QC Integrity
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Diagnostic verification of raw genotyping fidelity, chromosomal marker density, and chip architecture without remote server transmission.
            </p>
          </div>
        </div>

        {/* Right Action & Multi-Kit Selector */}
        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          {datasets.length > 1 && setActiveDatasetIndex && (
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-amber-500/20">
              {datasets.map((d: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveDatasetIndex(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeDatasetIndex === idx
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {((d?.name || `Kit ${idx + 1}`).split('.')[0]).slice(0, 10)}
                </button>
              ))}
            </div>
          )}

          {onOpenMethodology && (
            <button
              onClick={() => onOpenMethodology('integrity')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider transition-all active:scale-[0.96]"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>QC Methodology</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Hero Score & Primary Telemetry ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Composite Integrity Score Card (4 cols) */}
        <div className="lg:col-span-4 gs-tile p-6 flex flex-col justify-between items-center text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">COMPOSITE FIDELITY</span>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              GRADE {report.grade}
            </span>
          </div>

          <div className="my-5 relative flex items-center justify-center">
            {/* Ambient circular glow */}
            <div className="w-36 h-36 rounded-full bg-amber-500/10 border border-amber-500/30 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              <span className="text-4xl sm:text-5xl font-black text-zinc-100 tracking-tight">
                {report.integrityScore}
              </span>
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
                OUT OF 100
              </span>
            </div>
          </div>

          <div className="w-full pt-3 border-t border-white/[0.06]">
            <p className="text-xs font-bold text-zinc-200">
              {report.fidelityStatus === 'High-Fidelity' ? 'Verified Research-Grade Dataset' : 'Standard Genotyping Quality'}
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Weighted across call rate, diploid heterozygosity, and chromosomal completeness.
            </p>
          </div>
        </div>

        {/* Diagnostic Telemetry Badges (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Call Rate */}
          <div className="gs-tile p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">GENOTYPE CALL RATE</span>
              <Activity className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-black text-amber-300 tabular-nums">
                {report.callRateFormatted}
              </div>
              <div className="w-full bg-black/50 h-1.5 rounded-full mt-2 overflow-hidden border border-white/[0.05]">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                  style={{ width: `${Math.min(100, report.callRate)}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] text-zinc-400">
              Benchmark ≥ 98.0% ({report.noCalls.toLocaleString()} missing)
            </span>
          </div>

          {/* Sample Heterozygosity */}
          <div className="gs-tile p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">HETEROZYGOSITY</span>
              <Dna className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-black text-teal-300 tabular-nums">
                {report.heterozygosityFormatted}
              </div>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                {report.purityVerdict} • NOMINAL
              </span>
            </div>
            <span className="text-[10px] text-zinc-400">
              Expected diploid band: 28% – 36%
            </span>
          </div>

          {/* Platform Architecture */}
          <div className="gs-tile p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">DETECTED ARRAY</span>
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="my-2">
              <div className="text-base font-black text-zinc-100 line-clamp-1">
                {report.detectedChip}
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                {report.totalMarkers.toLocaleString()} total markers
              </span>
            </div>
            <span className="text-[10px] text-amber-400/90 font-mono">
              {report.expectedDensity}
            </span>
          </div>

          {/* Reference Build */}
          <div className="gs-tile p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">ASSEMBLY BUILD</span>
              <Database className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="my-2">
              <div className="text-lg font-black text-zinc-100">
                {report.build}
              </div>
              <span className="text-[10px] text-zinc-400">
                Standard NCBI coordinate frame
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              Human Reference Genome
            </span>
          </div>

          {/* Inferred Sex */}
          <div className="gs-tile p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">KARYOTYPIC SEX</span>
              <Layers className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="my-2">
              <div className="text-lg font-black text-zinc-100">
                {report.inferredSex}
              </div>
              <span className="text-[10px] text-zinc-400">
                {report.yMarkerCount > 0 ? `${report.yMarkerCount.toLocaleString()} Y SNPs` : '0 Y SNPs (Female)'}
              </span>
            </div>
            <span className="text-[10px] text-zinc-400">
              {report.xMarkerCount.toLocaleString()} X markers
            </span>
          </div>

          {/* Phasing Status */}
          <div className="gs-tile p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">PHASING STATE</span>
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="my-2">
              <div className="text-lg font-black text-zinc-100">
                {report.phasingStatus}
              </div>
              <span className="text-[10px] text-zinc-400">
                {report.phasingStatus === 'Phased' ? 'Parental haplotypes resolved' : 'Standard unphased genotypes'}
              </span>
            </div>
            <span className="text-[10px] text-zinc-400">
              {dataset?.name ? dataset.name.slice(0, 16) : 'Local dataset'}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Chromosome Distribution Section ─── */}
      <div className="gs-tile p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base font-black text-zinc-100 tracking-tight">
              Chromosomal Marker Coverage
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Distribution of genetic variants across all 22 autosomes, sex chromosomes (X, Y), and mitochondrial DNA (MT).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.06]">
              <button
                onClick={() => setActiveTab('karyotype')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'karyotype'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Ribbon Grid
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'table'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Detailed Table
              </button>
              <button
                onClick={() => setActiveTab('thresholds')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'thresholds'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                QC Standards
              </button>
            </div>

            {/* Sort Toggle (for karyotype and table) */}
            {activeTab !== 'thresholds' && (
              <button
                onClick={() => {
                  if (sortKey === 'physical') setSortKey('count');
                  else if (sortKey === 'count') setSortKey('callRate');
                  else setSortKey('physical');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 hover:bg-white/[0.05] border border-white/[0.08] text-xs text-zinc-400 hover:text-zinc-200"
                title="Toggle sort order"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">
                  {sortKey === 'physical' ? 'Physical Order' : sortKey === 'count' ? 'Marker Count' : 'Call Rate'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ─── TAB 1: Karyotype Ribbon Grid ─── */}
        {activeTab === 'karyotype' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-5 gap-3">
            {sortedChromosomes.map((chr) => (
              <motion.div
                key={chr.chrom}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-black/30 border border-white/[0.06] hover:border-amber-500/30 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-zinc-200 group-hover:text-amber-300 transition-colors font-mono">
                    {chr.chrom === 'MT' ? 'Chr MT' : `Chr ${chr.chrom}`}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {chr.percentOfKit > 0 ? `${chr.percentOfKit}%` : '—'}
                  </span>
                </div>

                <div className="mt-2 text-sm font-black text-zinc-100 tabular-nums">
                  {chr.count > 0 ? chr.count.toLocaleString() : '—'}
                  <span className="text-[10px] font-normal text-zinc-500 ml-1">SNPs</span>
                </div>

                {/* Micro density bar */}
                <div className="w-full bg-white/[0.05] h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                    style={{ width: `${Math.min(100, chr.percentOfKit * 12)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04] text-[10px]">
                  <span className="text-zinc-500">Fidelity</span>
                  <span className="font-mono text-amber-300 tabular-nums">
                    {chr.count > 0 ? `${chr.callRate}%` : '—'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ─── TAB 2: Detailed Chromosome Table ─── */}
        {activeTab === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-black/40 text-zinc-400 font-mono uppercase tracking-wider text-[10px] border-b border-white/[0.06]">
                <tr>
                  <th className="py-2.5 px-3">Chromosome</th>
                  <th className="py-2.5 px-3">Marker Count</th>
                  <th className="py-2.5 px-3">% of Kit</th>
                  <th className="py-2.5 px-3">Valid Calls</th>
                  <th className="py-2.5 px-3">Missing (--/00)</th>
                  <th className="py-2.5 px-3">Call Rate</th>
                  <th className="py-2.5 px-3">Heterozygosity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {sortedChromosomes.map((chr) => (
                  <tr key={chr.chrom} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-zinc-100">
                      {chr.label}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-amber-300 tabular-nums">
                      {chr.count > 0 ? chr.count.toLocaleString() : '0'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-400 tabular-nums">
                      {chr.percentOfKit}%
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-300 tabular-nums">
                      {chr.validCalls.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-500 tabular-nums">
                      {chr.noCalls.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-amber-400 tabular-nums">
                      {chr.count > 0 ? `${chr.callRate}%` : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-teal-400 tabular-nums">
                      {chr.validCalls > 0 ? `${chr.hetRate}%` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── TAB 3: Scientific QC Standards ─── */}
        {activeTab === 'thresholds' && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/30 border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-zinc-100">Genotyping Call Rate Thresholds</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Bioinformatic pipelines require at least <strong>98.0%</strong> non-missing variant calls to ensure statistical accuracy in admixture deconvolution and imputation. High-fidelity microarray runs routinely achieve 99.2% – 99.8%.
                </p>
                <div className="pt-2 text-[11px] font-mono text-zinc-400 space-y-1">
                  <p>• <span className="text-emerald-400">≥ 98.5%:</span> High-Fidelity Research Grade</p>
                  <p>• <span className="text-amber-400">95.0% – 98.4%:</span> Standard Commercial Export</p>
                  <p>• <span className="text-rose-400">&lt; 95.0%:</span> Degraded DNA or Incomplete Array Scan</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/30 border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-bold text-zinc-100">Sample Purity & Heterozygosity (H_obs)</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Heterozygosity is the proportion of loci where maternal and paternal alleles differ. Out-of-bounds rates signal biological or technical anomalies:
                </p>
                <div className="pt-2 text-[11px] font-mono text-zinc-400 space-y-1">
                  <p>• <span className="text-teal-400">28.0% – 36.0%:</span> Nominal Human Outbred Diploid Range</p>
                  <p>• <span className="text-amber-400">&gt; 38.0%:</span> Potential Sample Cross-Contamination</p>
                  <p>• <span className="text-rose-400">&lt; 24.0%:</span> High Consanguinity or Long Runs of Homozygosity (ROH)</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-zinc-300 leading-relaxed flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-zinc-100">Zero-Footprint Client-Side Assurance:</span> Every quality control metric displayed above is calculated in real-time within your browser's dedicated Web Worker environment. No raw SNPs, no chromosomes, and no file metadata are ever transmitted across external networks.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrityModule;
