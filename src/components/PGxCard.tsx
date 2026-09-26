import React from 'react';

interface PGxReport {
  severity: 'High' | 'Moderate' | 'Low';
  drug: string;
  message: string;
  gene: string;
}

export const PGxCard: React.FC<{ report: PGxReport }> = ({ report }) => {
  const severityColors = {
    High: 'border-red-500/40 bg-red-950/20 text-red-400',
    Moderate: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
    Low: 'border-blue-500/40 bg-blue-950/20 text-blue-400',
  };

  return (
    <div className={`p-5 rounded-2xl bg-slate-900 border shadow-xl transition-all hover:scale-[1.01] ${severityColors[report.severity] || 'border-slate-800 text-slate-400'}`}>
      <div className="flex justify-between items-center mb-3">
        <span className="font-black text-[10px] uppercase tracking-[0.2em]">
          {report.severity} Priority Alert
        </span>
        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest dark:text-slate-400">
          Source: CPIC 1A
        </span>
      </div>
      
      <h3 className="text-2xl font-black text-white tracking-tight leading-tight mb-2">
        {report.drug}
      </h3>
      
      <div className="p-4 bg-black/40 rounded-xl border border-white/5 mb-4">
        <p className="text-sm text-slate-300 leading-relaxed font-medium">
          {report.message}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-black uppercase rounded-lg border border-slate-700/50">
          Gene: <span className="text-slate-200">{report.gene}</span>
        </div>
        <div className="px-3 py-1 bg-slate-800/50 text-slate-500 text-[10px] font-black uppercase rounded-lg italic dark:text-slate-400">
          Genomic Marker Detected
        </div>
      </div>
    </div>
  );
};
