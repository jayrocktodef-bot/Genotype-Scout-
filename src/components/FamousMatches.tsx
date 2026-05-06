import React from 'react';
import { IndividualMatch } from '../utils/individualMatching';

export const FamousMatches: React.FC<{ matches: IndividualMatch[] }> = ({ matches }) => {
  if (matches.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-900/50 border border-dashed border-gray-800 rounded-xl">
        <p className="text-gray-500">No significant individual ancient matches found.</p>
        <p className="text-[10px] text-gray-600 mt-1">Requires overlapping markers with established ancient genomes.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {matches.map((m) => (
        <div key={m.sampleId} className="bg-gray-900 p-5 rounded-xl border border-gray-800 hover:border-gray-700 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">{m.name}</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest">{m.sampleId}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-400">{m.affinity}%</span>
              <p className="text-[10px] text-gray-500">AFFINITY</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-300">
              <span className="mr-2">📍</span> {m.location}
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <span className="mr-2">📅</span> {m.era}
            </div>

            {/* Confidence Gauge */}
            <div className="pt-2">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-gray-500 font-bold uppercase">Match Confidence</span>
                <span className={m.confidence > 70 ? "text-green-500" : m.confidence > 40 ? "text-yellow-500" : "text-red-500"}>
                  {m.confidence}% ({m.sharedMarkers} markers)
                </span>
              </div>
              <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    m.confidence > 70 ? "bg-green-500" : 
                    m.confidence > 40 ? "bg-yellow-500" : 
                    "bg-red-500"
                  }`}
                  style={{ width: `${m.confidence}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
