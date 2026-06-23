import React from 'react';

interface PGxReport {
  severity: 'High' | 'Moderate' | 'Low';
  drug: string;
  message: string;
  gene: string;
}

export const PGxCard: React.FC<{ report: PGxReport }> = ({ report }) => {
  const severityColors = {
    High: 'border-red-600 bg-red-950/20 text-red-500',
    Moderate: 'border-amber-600 bg-amber-950/20 text-amber-500',
    Low: 'border-blue-600 bg-blue-950/20 text-blue-500',
  };

  return (
    <div className={`border-l-4 p-5 rounded-r-2xl bg-slate-900 border-slate-800 shadow-xl transition-all hover:scale-[1.02] ${severityColors[report.severity] || 'border-slate-600'}`}>
      <div className="flex justify-between items-center mb-3">
        <span className="font-black text-[10px] uppercase tracking-[0.2em]">
          {report.severity} Priority Alert
        </span>
        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
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
        <div className="px-3 py-1 bg-slate-800/50 text-slate-500 text-[10px] font-black uppercase rounded-lg italic">
          Genomic Marker Detected
        </div>
      </div>
    </div>
  );
};
