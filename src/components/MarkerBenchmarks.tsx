import React from 'react';
import { MarkerSetBenchmark } from '../utils/markerBenchmarks';

export const MarkerBenchmarks: React.FC<{ benchmarks: MarkerSetBenchmark[] }> = ({ benchmarks }) => {
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-black text-white mb-2">Panel Coverage Analysis</h2>
        <p className="text-slate-400 text-sm">
          Technical analysis of how many reference markers in your raw data overlap with professional genomic panels.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benchmarks.map((b) => (
          <div key={b.name} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="absolute top-0 right-0 p-4">
              <span className={`text-xs font-black px-2 py-1 rounded-full ${
                b.percentage > 70 ? 'bg-emerald-500/10 text-emerald-500' : 
                b.percentage > 30 ? 'bg-amber-500/10 text-amber-500' : 
                'bg-rose-500/10 text-rose-500'
              }`}>
                {b.percentage}%
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">{b.name}</h3>
            <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
              {b.description}
            </p>

            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-black text-white">{b.count}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Markers Detected</div>
              </div>
              <div className="text-right">
                <div className="text-slate-400 font-mono text-sm">/ {b.total}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Total in Set</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
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
