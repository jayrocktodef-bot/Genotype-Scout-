import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { POPULATION_MAP, CONTINENT_LABELS } from '../utils/populationMapper';

interface GranularAncestryViewProps {
  predictions: Record<string, number> | Array<{ population: string, score?: number, percentage?: number }>;
}

export const GranularAncestryView: React.FC<GranularAncestryViewProps> = ({ predictions }) => {
  // Normalize predictions into a consistent Record<string, number>
  const normalizedPredictions = useMemo(() => {
    if (Array.isArray(predictions)) {
      return predictions.reduce((acc, item) => {
        acc[item.population] = item.percentage ?? item.score ?? 0;
        return acc;
      }, {} as Record<string, number>);
    }
    return predictions;
  }, [predictions]);

  // Grouping logic
  const groupedData = useMemo(() => {
    const macroContinents: Record<string, { total: number; subPops: { code: string; name: string; score: number }[] }> = {};

    Object.entries(normalizedPredictions).forEach(([code, score]) => {
      if (score <= 0) return;

      const popInfo = POPULATION_MAP[code];
      const continentCode = popInfo?.continent || 'OTHER';
      const continentName = CONTINENT_LABELS[continentCode] || 'Other Clusters';

      if (!macroContinents[continentCode]) {
        macroContinents[continentCode] = { total: 0, subPops: [] };
      }

      macroContinents[continentCode].total += score;
      macroContinents[continentCode].subPops.push({
        code,
        name: popInfo?.name || code,
        score
      });
    });

    // Sort macro-continents by total score descending, and filter those > 1%
    return Object.entries(macroContinents)
      .filter(([_, data]) => data.total > 1)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([code, data]) => ({
        code,
        name: CONTINENT_LABELS[code] || 'Other Clusters',
        total: data.total,
        subPops: data.subPops.sort((a, b) => b.score - a.score)
      }));
  }, [normalizedPredictions]);

  if (groupedData.length === 0) return null;

  return (
    <div className="space-y-8 mt-12 bg-black/20 p-8 rounded-[2rem] border border-white/5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-black text-white tracking-tight">Granular Ancestry Analysis</h3>
        <span className="text-[10px] font-black text-[#4599FF] uppercase tracking-[0.2em] px-3 py-1 bg-[#4599FF]/10 rounded-full">
          High-Resolution (1KGP)
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groupedData.map((continent) => (
          <motion.div 
            key={continent.code}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col bg-white/5 rounded-2xl overflow-hidden border border-white/5"
          >
            <div className="p-5 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
              <span className="font-black text-slate-200 tracking-wider uppercase text-xs">{continent.name}</span>
              <span className="font-mono font-black text-[#4599FF]">{continent.total.toFixed(1)}%</span>
            </div>
            
            <div className="p-5 space-y-4">
              {continent.subPops.map((subPop) => (
                <div key={subPop.code} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400">
                    <span>{subPop.name} ({subPop.code})</span>
                    <span className="font-mono text-slate-300">{subPop.score.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(subPop.score / continent.total) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#4599FF]/40 to-[#4599FF]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
