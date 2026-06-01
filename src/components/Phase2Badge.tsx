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

interface Phase2BadgeProps {
  phase2: Phase2Data | null | undefined;
}

/**
 * Phase2Badge — inline confirmation indicator for YDNAView hero card.
 *
 * Confidence tiers:
 *   ≥ 80 → green  "V2 Confirmed"
 *   ≥ 50 → amber  "V2 Partial"
 *   <  50 → slate  "V2 Low Signal"
 *   null  → nothing rendered
 */
export function Phase2Badge({ phase2 }: Phase2BadgeProps) {
  const [open, setOpen] = useState(false);

  if (!phase2 || phase2.derivedMarkers === 0) return null;

  const { confidence, coverage, derivedMarkers, ancestralMarkers, rejectedBranches } = phase2;

  const tier =
    confidence >= 80 ? 'high' :
    confidence >= 50 ? 'mid' :
    'low';

  const tierStyles = {
    high: {
      pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      dot:  'bg-emerald-400',
      icon: '✅',
      label: 'V2 Confirmed',
    },
    mid: {
      pill: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      dot:  'bg-amber-400',
      icon: '⚠️',
      label: 'V2 Partial',
    },
    low: {
      pill: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
      dot:  'bg-slate-400',
      icon: '🔍',
      label: 'V2 Low Signal',
    },
  }[tier];

  return (
    <div className="relative inline-block">
      <button
        id="phase2-badge-btn"
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:opacity-80 transition-opacity ${tierStyles.pill}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${tierStyles.dot}`} />
        {tierStyles.label} {confidence.toFixed(0)}%
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
          />
          {/* Popover */}
          <div
            role="tooltip"
            id="phase2-badge-popover"
            className="absolute left-0 top-full mt-2 z-40 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 space-y-3 text-left"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Phase 2 Engine
              </span>
              <span className="text-[10px] font-mono text-slate-500">YDnaPredictorV2</span>
            </div>

            {/* Confidence */}
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>Confidence</span>
                <span className="text-white font-mono">{confidence.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    tier === 'high' ? 'bg-emerald-500' :
                    tier === 'mid'  ? 'bg-amber-500'   : 'bg-slate-500'
                  }`}
                  style={{ width: `${Math.min(100, confidence)}%` }}
                />
              </div>
            </div>

            {/* Coverage */}
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>Branch Coverage</span>
                <span className="text-white font-mono">{coverage.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min(100, coverage)}%` }}
                />
              </div>
            </div>

            {/* Derived / Ancestral chips */}
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-bold border border-emerald-500/30">
                {derivedMarkers} derived
              </span>
              {ancestralMarkers > 0 && (
                <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded-full text-[10px] font-bold border border-red-500/30">
                  {ancestralMarkers} ancestral
                </span>
              )}
            </div>

            {/* Rejected branches */}
            {rejectedBranches.length > 0 && (
              <div>
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  Rejected ({rejectedBranches.length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {rejectedBranches.slice(0, 5).map(b => (
                    <span key={b} className="px-1.5 py-0.5 bg-red-900/40 text-red-400 border border-red-800/50 rounded text-[9px] font-mono">
                      {b}
                    </span>
                  ))}
                  {rejectedBranches.length > 5 && (
                    <span className="text-[9px] text-slate-500 self-center">
                      +{rejectedBranches.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
