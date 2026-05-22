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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#F5F6F7] mb-2">Scout Score</h2>
          <p className="text-sm font-bold text-[#4599FF] uppercase tracking-widest">Marker Frequency Est. (Raw AIMS)</p>
        </div>
        {onOpenMethodology && (
          <button
            onClick={onOpenMethodology}
            className="w-full sm:w-auto shrink-0 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-[#4599FF]" />
            Methodology
          </button>
        )}
      </div>

      <div className="h-[400px] w-full min-w-0 relative">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={400} debounce={1}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={180} tick={{ fill: '#94a3b8', fontSize: 13 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc', borderRadius: '1rem' }} />
            <Bar dataKey="value" fill="#4599FF" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4599FF' : '#55ABFF'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {chartData.map((data) => (
          <div key={data.name} className="flex justify-between items-center p-4 rounded-xl bg-[#1a1b1d] border border-white/5">
            <span className="font-bold text-slate-400">{data.name}</span>
            <span className="font-mono font-black text-[#4599FF]">{data.value.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
});
