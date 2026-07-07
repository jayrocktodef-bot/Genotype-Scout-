import React from 'react';
import { Activity, ShieldCheck, Microscope, Database, BarChart3 } from 'lucide-react';
import { MarkerSetBenchmark } from '../utils/markerBenchmarks';

export const MarkerBenchmarks: React.FC<{ benchmarks: MarkerSetBenchmark[] }> = ({ benchmarks }) => {
  const totalFound = benchmarks.reduce((acc, b) => acc + b.count, 0);
  const totalPossible = benchmarks.reduce((acc, b) => acc + b.total, 0);
  const overallPercentage = totalPossible > 0 ? Math.round((totalFound / totalPossible) * 100) : 0;

  const getIcon = (name: string) => {
    if (name.includes('GRAF')) return <Database className="w-5 h-5" />;
    if (name.includes('Forensic')) return <ShieldCheck className="w-5 h-5" />;
    if (name.includes('Precision')) return <Microscope className="w-5 h-5" />;
    return <Activity className="w-5 h-5" />;
  };

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Panel Coverage Analysis</h2>
          <p className="text-slate-400 text-sm">
            Technical mapping of your raw data against professional genomic panels.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 dark:text-slate-400">Total Coverage</div>
          <div className="text-3xl font-black text-blue-400">{overallPercentage}%</div>
          <div className="text-xs text-slate-400 font-mono">
            {totalFound.toLocaleString()} / {totalPossible.toLocaleString()}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {benchmarks.map((b) => (
          <div key={b.name} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-slate-800/50 rounded-lg text-blue-400">
                {getIcon(b.name)}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                b.percentage > 70 ? 'bg-emerald-500/10 text-emerald-400' : 
                b.percentage > 30 ? 'bg-amber-500/10 text-amber-400' : 
                'bg-rose-500/10 text-rose-400'
              }`}>
                {b.percentage}%
              </span>
            </div>

            <h3 className="text-sm font-semibold text-white mb-1">{b.name}</h3>
            <p className="text-[11px] text-slate-500 mb-4 line-clamp-2 leading-relaxed dark:text-slate-400">
              {b.description}
            </p>

            <div className="flex items-end justify-between pt-4 border-t border-slate-800">
              <div className="text-xl font-black text-white">{b.count.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold text-right dark:text-slate-400">Detected</div>
            </div>
            
            <div className="mt-3 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  b.percentage > 70 ? 'bg-emerald-500' : 
                  b.percentage > 30 ? 'bg-amber-500' : 
                  'bg-rose-500'
                }`}
                style={{ width: `${b.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
