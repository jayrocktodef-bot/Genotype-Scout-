import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, BookOpen, Info, Shield, HelpCircle, Code, Award, 
  Landmark, Database, Sparkles, CheckCircle2, Lock
} from 'lucide-react';
import { getDocumentationForModule, ModuleDocumentation } from '../data/moduleExplanations';

export interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: string;
  activeModule?: string | null;
}

export const getMethodologyData = (tabId: string) => {
  const doc = getDocumentationForModule(tabId);
  return {
    title: doc.title,
    algName: doc.technical.solverEngine,
    description: doc.technical.description,
    formulas: doc.technical.formulas,
    references: doc.technical.references,
    metrics: doc.technical.metrics
  };
};

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ 
  isOpen, 
  onClose, 
  activeTab, 
  activeModule 
}) => {
  const [modalMode, setModalMode] = useState<'explainer' | 'technical'>('explainer');
  const activeKey = activeModule || activeTab || 'methodology';
  const doc: ModuleDocumentation = useMemo(() => getDocumentationForModule(activeKey), [activeKey]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="methodology-modal-overlay" 
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#070809]/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-5xl max-h-[92vh] sm:max-h-[90vh] bg-[#0d0e10] border border-white/10 rounded-2xl sm:rounded-[2.5rem] shadow-2xl p-4 sm:p-6 md:p-8 text-white flex flex-col justify-between overflow-hidden tactile-3d-card"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3.5 pb-4 sm:pb-5 border-b border-white/10 shrink-0">
            {/* Top row on mobile: Title + Close Button */}
            <div className="flex items-center justify-between w-full md:w-auto gap-3 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-cyan-300">
                      {doc.category} MODULE
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                      ID: {doc.id}
                    </span>
                    <span className="hidden sm:flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <Shield className="w-3 h-3" /> 100% Client-Side In-Memory
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg md:text-xl font-display font-black text-white tracking-tight truncate mt-0.5">
                    {doc.title}
                  </h2>
                </div>
              </div>

              {/* Close Button on Mobile */}
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 shrink-0 md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop Actions / Mobile Row: Tactile Dual-Mode Tab Switcher + Desktop Close */}
            <div className="flex items-center justify-between w-full md:w-auto gap-2.5 shrink-0">
              <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10 w-full sm:w-auto">
                <button
                  onClick={() => setModalMode('explainer')}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono font-black uppercase tracking-wider transition-all text-center ${
                    modalMode === 'explainer'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Plain English Explainer
                </button>
                <button
                  onClick={() => setModalMode('technical')}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono font-black uppercase tracking-wider transition-all text-center ${
                    modalMode === 'technical'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Technical Methodology
                </button>
              </div>

              {/* Close Button on Desktop */}
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="hidden md:flex p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body: Full-Width Explainer & Technical Content */}
          <div className="flex flex-col gap-4 sm:gap-6 py-4 sm:py-6 overflow-y-auto pr-1 flex-1 min-h-0 custom-scrollbar w-full">
            <div className="w-full space-y-4 sm:space-y-5">
              {modalMode === 'explainer' ? (
                /* Plain English Explainer Tab Content */
                <div className="space-y-5 animate-fade-in">
                  {/* Headline & Analogy Insight Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 via-slate-900/60 to-slate-950 border border-cyan-500/20 shadow-lg relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-2 text-cyan-400">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                        Plain English Summary
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white leading-snug">
                      {doc.explainer.headline}
                    </p>
                    <div className="mt-3 pt-3 border-t border-cyan-500/15 text-xs text-cyan-200/90 leading-relaxed italic">
                      <span className="font-semibold text-cyan-300 not-italic">Everyday Analogy: </span>
                      {doc.explainer.analogy}
                    </div>
                  </div>

                  {/* How We Got Your Results */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      How We Computed Your Results
                    </h4>
                    <div className="space-y-2.5 mt-2">
                      {doc.explainer.howWeGotYourResults.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-black/30 border border-white/5">
                          <span className="font-mono text-xs font-black text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-500/10 shrink-0">
                            0{idx + 1}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What This Means For You */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-300 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      What This Means For You
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {doc.explainer.whatItMeansForYou}
                    </p>
                  </div>

                  {/* Scientific Nuance & Boundaries */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-rose-300 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />
                      Scientific Nuance & Limitations
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {doc.explainer.caveatsAndNuance}
                    </p>
                  </div>
                </div>
              ) : (
                /* Technical Methodology Tab Content */
                <div className="space-y-5 animate-fade-in">
                  {/* Solver Engine Badge & Description */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-cyan-400" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                        Active Solver Engine
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-display font-black text-white">
                      {doc.technical.solverEngine}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {doc.technical.description}
                    </p>
                  </div>

                  {/* Mathematical Formulations */}
                  {doc.technical.formulas && doc.technical.formulas.length > 0 && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                        <Award className="w-4 h-4 text-indigo-400" />
                        Mathematical Formulations & Equations
                      </h4>
                      <div className="space-y-3">
                        {doc.technical.formulas.map((form, fIdx) => (
                          <div key={fIdx} className="space-y-1.5 p-3.5 rounded-xl bg-black/60 border border-white/10">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                              {form.label}
                            </span>
                            <div className="font-mono text-xs text-cyan-300 bg-slate-950 p-2.5 rounded-lg border border-cyan-500/20 overflow-x-auto">
                              {form.equation}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                              {form.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Calibration Metrics Grid */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                      <Database className="w-4 h-4 text-teal-400" />
                      Engine Calibration & Operating Parameters
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {doc.technical.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono">
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">
                            {m.label}
                          </span>
                          <span className="text-xs font-black text-slate-200 mt-0.5 block">
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Literature Citations */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-amber-400" />
                      Peer-Reviewed Literature & Grounding
                    </h4>
                    <ul className="space-y-1.5">
                      {doc.technical.references.map((ref, rIdx) => (
                        <li key={rIdx} className="text-xs text-slate-400 flex items-start gap-2 leading-relaxed">
                          <span className="text-cyan-400 shrink-0 font-mono text-[10px]">[{rIdx + 1}]</span>
                          <span>{ref}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span>Zero Telemetry • Pure Client-Side Computation</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors border border-white/10 active:scale-95"
            >
              Close View
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default MethodologyModal;
