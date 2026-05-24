import React, { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { HelpCircle } from 'lucide-react';

const mapCodeToName = (code: string): string => {
  const mapping: Record<string, string> = {
    'AFR': 'African',
    'AMR': 'Native/Mixed American',
    'EUR': 'European',
    'EAS': 'East Asian',
    'SAS': 'South Asian',
    'SIB': 'Siberian',
    'OCE': 'Oceanian',
    'MENA': 'Middle Eastern / North African',
    'Native_American_unadmixed': 'Native American (Unadmixed)',
    'AMR_admixed': 'Native American (Admixed)',
    'NAT': 'Native American',
    'MID': 'Middle Eastern',
    'ASI': 'Asian',
    'GLOBAL': 'Global Reference'
  };
  return mapping[code] || code;
};

export const NaiveAncestryOracle = memo(({ 
  results,
  onOpenMethodology
}: { 
  results: any;
  onOpenMethodology?: () => void;
}) => {
  const naiveEstimates = results?.naiveEstimates || {};
  const hasData = Object.keys(naiveEstimates).length > 0;

  const chartData = useMemo(() => {
    return Object.entries(naiveEstimates).map(([name, value]) => ({
      name: mapCodeToName(name),
      value: Number(value),
    })).sort((a, b) => b.value - a.value);
  }, [naiveEstimates]);

  if (!hasData) {
    return (
      <div className="p-12 text-center text-slate-500">
        No Naive Ancestry Results Available - Please load and process a valid dataset.
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-[2rem] bg-[#111213]/70 backdrop-blur-xl border border-white/10 shadow-2xl space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-1 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#4ECDC4] shadow-lg">
            <img 
              src="https://writteninthegenome.blog/wp-content/uploads/2026/05/17794114671357483599285632974525.webp" 
              alt="Scout Score"
              className="w-16 h-16 rounded-xl object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] mb-1">Scout Score</h2>
            <p className="text-sm font-bold text-[#4ECDC4] uppercase tracking-widest">Marker Frequency Est.</p>
          </div>
        </div>
        {onOpenMethodology && (
          <button
            onClick={onOpenMethodology}
            className="w-full sm:w-auto shrink-0 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-sm flex items-center justify-center gap-3 backdrop-blur"
          >
            <HelpCircle className="w-5 h-5 text-[#FFE66D]" />
            Methodology
          </button>
        )}
      </div>

      <div className="h-[400px] w-full min-w-0 relative bg-black/20 rounded-3xl p-4 border border-white/5">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={400} debounce={1}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={180} tick={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 600 }} />
            <Tooltip contentStyle={{ backgroundColor: '#111213', borderColor: '#4ECDC4', color: '#fff', borderRadius: '1rem' }} />
            <Bar dataKey="value" fill="#4ECDC4" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4ECDC4' : '#FF6B6B'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {chartData.map((data) => (
          <div key={data.name} className="flex justify-between items-center p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#4ECDC4]/50 transition-colors">
            <span className="font-bold text-slate-100">{data.name}</span>
            <span className="font-mono font-black text-[#FFE66D] text-lg">{(data.value || 0).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
});
