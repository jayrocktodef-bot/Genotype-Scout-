import React from 'react';
import { motion } from 'motion/react';
import { User, MapPin, Calendar, Activity, Info } from 'lucide-react';
import { IndividualMatch } from '../utils/individualMatching';

export const FamousMatches: React.FC<{ matches: IndividualMatch[] }> = ({ matches }) => {
  if (matches.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem]">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
          <User className="text-slate-300 w-8 h-8" />
        </div>
        <h4 className="text-lg font-black text-slate-800 mb-2">No Individual Matches Detected</h4>
        <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
          Your genome doesn't show high-affinity matching with our current database of ancient samples. 
          This is common with smaller marker panels.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {matches.map((m, idx) => (
        <motion.div 
          key={m.sampleId} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="premium-card p-8 group hover:scale-[1.02] transition-all"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 border border-teal-100 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 group-hover:text-teal-600 transition-colors tracking-tight">{m.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{m.sampleId}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-teal-600 tracking-tighter">{m.affinity}%</span>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Affinity</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
              <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              {m.location}
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
              <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              {m.era}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="flex justify-between items-end text-[10px] mb-3">
              <span className="text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-3 h-3 text-teal-500" />
                Match Confidence
              </span>
              <span className={`font-black px-2 py-0.5 rounded-full ${
                m.confidence > 70 ? "bg-teal-100 text-teal-700" : 
                m.confidence > 40 ? "bg-amber-100 text-amber-700" : 
                "bg-rose-100 text-rose-700"
              }`}>
                {m.confidence}% ({m.sharedMarkers} Markers)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${m.confidence}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 + idx * 0.1 }}
                className={`h-full rounded-full ${
                  m.confidence > 70 ? "bg-teal-500" : 
                  m.confidence > 40 ? "bg-amber-500" : 
                  "bg-rose-500"
                }`}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
