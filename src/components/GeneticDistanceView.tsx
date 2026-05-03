import React, { useMemo } from 'react';
import { calculateGeneticDistances } from '../utils/distanceCalculator';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const GeneticDistanceView = ({ dataset }: { dataset: any }) => {
  const distances = useMemo(() => {
    if (!dataset?.results) return {};
    // Map existing result structure to what distance calculator needs
    const genotypes = dataset.results.map((r: any) => ({
      rsid: r.rsid,
      genotype: r.genotype
    }));
    return calculateGeneticDistances(genotypes);
  }, [dataset]);

  const chartData = Object.entries(distances).map(([pop, dist]) => ({
    name: pop,
    distance: dist,
  })).sort((a, b) => a.distance - b.distance);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mt-6">
      <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight mb-6">Genetic Distance (Lower is closer)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip contentStyle={{ backgroundColor: '#111213', border: '1px solid #334155', borderRadius: '12px', color: '#F5F6F7', fontSize: '11px' }} />
            <Bar dataKey="distance" fill="#4599FF">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? "#4599FF" : "#64748b"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
