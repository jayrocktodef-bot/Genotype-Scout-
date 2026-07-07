import { useState } from 'react';

interface Phase2Data {
  haplogroup: string;
  confidence: number;
  coverage: number;
  derivedMarkers: number;
  ancestralMarkers: number;
  path: string[];
  rejectedBranches: string[];
}

interface Phase2PanelProps {
  phase2: Phase2Data | null | undefined;
  /** The Phase 1 predicted haplogroup name, for comparison */
  phase1Haplogroup?: string | null;
}

/**
 * Phase2Panel — detailed collapsible card showing the full YDnaPredictorV2 result.
 * Rendered below the tree/markers grid in YDNAView.
 * Gracefully hides when phase2 is null or has no derived markers.
 */
export function Phase2Panel({ phase2, phase1Haplogroup }: Phase2PanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [showAllRejected, setShowAllRejected] = useState(false);

  if (!phase2 || phase2.derivedMarkers === 0) return null;

  const {
    haplogroup,
    confidence,
    coverage,
    derivedMarkers,
    ancestralMarkers,
    path,
    rejectedBranches,
  } = phase2;

  const differs = phase1Haplogroup && haplogroup !== phase1Haplogroup;

  const confTier =
    confidence >= 80 ? 'high' :
    confidence >= 50 ? 'mid'  : 'low';

  const confColor = {
    high: { bar: 'bg-emerald-500', text: 'text-emerald-400', ring: 'ring-emerald-500/30', label: 'High' },
    mid:  { bar: 'bg-amber-500',   text: 'text-amber-400',   ring: 'ring-amber-500/30',   label: 'Partial' },
    low:  { bar: 'bg-red-500',     text: 'text-red-400',     ring: 'ring-red-500/30',     label: 'Low' },
  }[confTier];

  const visibleRejected = showAllRejected ? rejectedBranches : rejectedBranches.slice(0, 6);

  return (
    <div
      id="phase2-panel"
      className="bg-slate-900 rounded-3xl border border-slate-700/60 shadow-xl overflow-hidden"
    >
      {/* Header — always visible */}
      <button
        id="phase2-panel-toggle"
        className="w-full flex items-center justify-between px-8 py-5 hover:bg-slate-800/60 transition-colors group"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        aria-controls="phase2-panel-body"
      >
        <div className="flex items-center gap-4">
          {/* Engine logo */}
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-lg shrink-0">
            🔬
          </div>
          <div className="text-left">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest dark:text-slate-400">
              Phase 2 · YDnaPredictorV2
            </div>
            <div className="text-base font-black text-white mt-0.5 flex items-center gap-2">
              {haplogroup}
              {differs && (
                <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  Differs from P1
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Confidence mini-pill */}
          <div className="hidden sm:flex flex-col items-end gap-0.5">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest dark:text-slate-400">Confidence</span>
            <span className={`text-sm font-black ${confColor.text}`}>{confidence.toFixed(0)}%</span>
          </div>
          {/* Coverage mini-pill */}
          <div className="hidden sm:flex flex-col items-end gap-0.5">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest dark:text-slate-400">Coverage</span>
            <span className="text-sm font-black text-blue-400">{coverage.toFixed(0)}%</span>
          </div>
          {/* Chevron */}
          <div className={`text-slate-500 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </button>

      {/* Body — visible when expanded */}
      {expanded && (
        <div
          id="phase2-panel-body"
          className="px-8 pb-8 space-y-6 border-t border-slate-800"
        >
          {/* Metric cards row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
            {/* Confidence */}
            <div className={`p-4 rounded-2xl bg-slate-800/60 ring-1 ${confColor.ring} flex flex-col gap-2`}>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest dark:text-slate-400">Confidence</div>
              <div className={`text-2xl font-black ${confColor.text}`}>{confidence.toFixed(1)}%</div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${confColor.bar}`}
                  style={{ width: `${Math.min(100, confidence)}%` }}
                />
              </div>
              <div className="text-[9px] text-slate-500 font-bold dark:text-slate-400">{confColor.label} signal</div>
            </div>

            {/* Coverage */}
            <div className="p-4 rounded-2xl bg-slate-800/60 ring-1 ring-blue-500/20 flex flex-col gap-2">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest dark:text-slate-400">Branch Coverage</div>
              <div className="text-2xl font-black text-blue-400">{coverage.toFixed(1)}%</div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min(100, coverage)}%` }}
                />
              </div>
              <div className="text-[9px] text-slate-500 font-bold dark:text-slate-400">of branch SNPs tested</div>
            </div>

            {/* Derived */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20 flex flex-col gap-1">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest dark:text-slate-400">Derived SNPs</div>
              <div className="text-2xl font-black text-emerald-400">{derivedMarkers}</div>
              <div className="text-[9px] text-slate-500 font-bold dark:text-slate-400">confirmed derived state</div>
            </div>

            {/* Ancestral */}
            <div className={`p-4 rounded-2xl flex flex-col gap-1 ${
              ancestralMarkers > 0
                ? 'bg-red-500/10 ring-1 ring-red-500/20'
                : 'bg-slate-800/60 ring-1 ring-slate-700/40'
            }`}>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest dark:text-slate-400">Ancestral SNPs</div>
              <div className={`text-2xl font-black ${ancestralMarkers > 0 ? 'text-red-400' : 'text-slate-500'}`}>
                {ancestralMarkers}
              </div>
              <div className="text-[9px] text-slate-500 font-bold dark:text-slate-400">
                {ancestralMarkers > 0 ? 'rejected (ancestral state)' : 'none — clean call'}
              </div>
            </div>
          </div>

          {/* Phase 1 vs Phase 2 comparison (only when they differ) */}
          {differs && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-2xl">⚠️</div>
              <div className="flex-1 text-sm text-amber-200 leading-relaxed">
                <span className="font-black">Call discrepancy detected.</span>{' '}
                Phase 1 predicts <span className="font-mono font-black text-white">{phase1Haplogroup}</span>{' '}
                while Phase 2 (allele-direction validated) predicts{' '}
                <span className="font-mono font-black text-emerald-300">{haplogroup}</span>.{' '}
                Phase 2 result is based on strict derived-only confirmation and is more reliable when coverage ≥ 50%.
              </div>
            </div>
          )}

          {/* V2 Traversal Path */}
          {path.length > 0 && (
            <div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 dark:text-slate-400">
                V2 Traversal Path
              </div>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-1">
                {path.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    {idx > 0 && <span className="text-slate-600 text-[10px] dark:text-slate-400">▶</span>}
                    <span className={`px-2 py-1 rounded text-[10px] font-bold font-mono ${
                      idx === path.length - 1
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {step.replace('Haplogroup ', '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rejected branches */}
          {rejectedBranches.length > 0 && (
            <div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Rejected Branches ({rejectedBranches.length}) — ancestral defining SNPs found
              </div>
              <div className="flex flex-wrap gap-1.5">
                {visibleRejected.map(b => (
                  <span
                    key={b}
                    className="px-2.5 py-1 bg-red-900/40 text-red-300 border border-red-800/50 rounded-lg text-[10px] font-mono font-bold"
                  >
                    {b}
                  </span>
                ))}
                {rejectedBranches.length > 6 && (
                  <button
                    id="phase2-show-more-rejected"
                    onClick={() => setShowAllRejected(v => !v)}
                    className="px-2.5 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-lg text-[10px] font-bold hover:bg-slate-700 transition-colors"
                  >
                    {showAllRejected ? 'Show less' : `+${rejectedBranches.length - 6} more`}
                  </button>
                )}
              </div>
              <p className="text-[9px] text-slate-600 mt-2 italic dark:text-slate-400">
                These branches were excluded because at least one of their defining SNPs was observed in the ancestral (non-derived) state in your data, which makes that branch phylogenetically impossible.
              </p>
            </div>
          )}

          {/* Method note */}
          <div className="pt-4 border-t border-slate-800 text-[9px] text-slate-600 leading-relaxed dark:text-slate-400">
            <span className="font-bold text-slate-500 dark:text-slate-400">Phase 2 method:</span>{' '}
            Tree traversal from haplogroup A with 4-rule validation — (1) derived-only confirmation, (2) ancestral branch rejection,
            (3) ≥2 SNPs required for deep terminals (depth ≥5), (4) coverage and confidence reporting.
            Allele directions sourced from ybrowse.org Y-SNP database via the Phase 1 generator.
          </div>
        </div>
      )}
    </div>
  );
}
