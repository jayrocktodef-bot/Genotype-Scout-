import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Info, Shield, Code, Award, Landmark, Database } from 'lucide-react';
import { getMethodologyData } from './MethodologyModal';

export const MethodologyPage: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const data = getMethodologyData(activeTab);

  return (
    <div className="p-6 sm:p-8 bg-[#111213] text-[#F5F6F7] min-h-screen">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 pb-8 border-b border-white/5">
          <div className="p-4 bg-[#4599FF]/10 border border-[#4599FF]/20 rounded-3xl text-[#4599FF]">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest font-black text-[#4599FF]">Genotype Scout</div>
            <h1 className="text-4xl font-black text-white tracking-tighter mt-1">{data.title}</h1>
          </div>
        </div>

        {/* Algorithm Badge */}
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex items-start gap-4">
          <Info className="w-6 h-6 text-[#4599FF] mt-1 shrink-0" />
          <div>
            <h2 className="font-extrabold text-[#4599FF] text-sm uppercase tracking-wider mb-1">Core Solver Engine</h2>
            <p className="font-mono text-base text-white">{data.algName}</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h3 className="font-black text-white text-base uppercase tracking-wider flex items-center gap-2">
            <Database className="w-5 h-5 text-[#4599FF]" /> Description
          </h3>
          <p className="text-slate-400 text-lg leading-relaxed">{data.description}</p>
        </div>

        {/* Formulas */}
        {data.formulas && data.formulas.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-black text-white text-base uppercase tracking-wider flex items-center gap-2">
              <Code className="w-5 h-5 text-[#4599FF]" /> Algebraic Modeling
            </h3>
            {data.formulas.map((f, i) => (
              <div key={i} className="p-6 rounded-3xl bg-[#070809] border border-white/5 space-y-4">
                <div className="text-xs font-black text-[#4599FF] uppercase tracking-widest">{f.label}</div>
                <div className="font-mono text-center text-lg py-6 px-4 bg-black/40 border border-white/5 rounded-2xl text-white font-black overflow-x-auto select-all">
                  {f.equation}
                </div>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{f.explanation}</p>
              </div>
            ))}
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data.metrics.map((m, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-extrabold">{m.label}</div>
              <div className="text-sm font-black text-[#F5F6F7] mt-2 font-mono uppercase tracking-tight">{m.value}</div>
            </div>
          ))}
        </div>

        {/* References */}
        <div className="pt-8 border-t border-white/5 space-y-4">
          <h3 className="font-black text-white text-base uppercase tracking-wider flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#4599FF]" /> Academic References
          </h3>
          <ul className="space-y-3">
            {data.references.map((r, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-400 items-start">
                <Award className="w-5 h-5 text-[#4599FF] shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
