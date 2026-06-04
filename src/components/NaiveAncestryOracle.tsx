import React, { memo, useMemo, useState, useEffect } from 'react';
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

const REGION_COLORS: Record<string, string> = {
  EUR: '#3b82f6', // European -> Blue
  AFR: '#10b981', // African -> Green
  EAS: '#ef4444', // East Asian -> Red
  SAS: '#f59e0b', // South Asian -> Yellow
  AMR: '#a855f7', // Native/Mixed American -> Purple
  NAT: '#ec4899', // Native American -> Pink
  Native_American_unadmixed: '#ec4899',
  AMR_admixed: '#db2777',
  OCE: '#06b6d4', // Oceanian -> Cyan
  MENA: '#f97316', // Middle Eastern / North African -> Orange
  MID: '#d97706', // Middle Eastern -> Amber
  SIB: '#14b8a6', // Siberian -> Teal
  ASI: '#6366f1', // Asian -> Indigo
  GLOBAL: '#64748b' // Global Reference -> Slate
};

export const NaiveAncestryOracle = memo(({ 
  results,
  onOpenMethodology
}: { 
  results: any;
  onOpenMethodology?: () => void;
}) => {
  const [isChartReady, setIsChartReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsChartReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const naiveEstimates = results?.naiveEstimates || {};
  const hasData = Object.keys(naiveEstimates).length > 0;

  const chartData = useMemo(() => {
    return Object.entries(naiveEstimates).map(([code, value]) => ({
      code,
      name: mapCodeToName(code),
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
      className="p-3 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-[#111213]/70 backdrop-blur-xl border border-white/10 shadow-2xl space-y-8"
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

      <div className="h-[400px] w-full min-w-0 relative bg-black/20 rounded-3xl p-2 sm:p-4 border border-white/5">
        {isChartReady ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={400} debounce={1}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 5, right: 10 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={150} tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 600 }} />
              <Tooltip contentStyle={{ backgroundColor: '#111213', borderColor: '#4ECDC4', color: '#fff', borderRadius: '1rem' }} />
              <Bar dataKey="value" fill="#4ECDC4" radius={[0, 8, 8, 0]}>
                {chartData.map((entry, index) => {
                  const color = REGION_COLORS[entry.code] || '#4ECDC4';
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full bg-slate-900/40 rounded-2xl animate-pulse" />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {chartData.map((data) => {
          const color = REGION_COLORS[data.code] || '#FFE66D';
          return (
            <div key={data.name} className="flex justify-between items-center p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#4ECDC4]/50 transition-colors">
              <span className="font-bold text-slate-100 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                {data.name}
              </span>
              <span className="font-mono font-black text-lg" style={{ color }}>{(data.value || 0).toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
});

