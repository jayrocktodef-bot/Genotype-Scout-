import React from 'react';
import { CultureMatch } from '../utils/ancientMatching';

export const AncientCulturesTab: React.FC<{ matches: CultureMatch[] }> = ({ matches }) => {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Deep Ancestry & Ancient Cultures</h2>
        <p className="text-gray-400">Discover your affinity with historical populations based on key archaeological markers.</p>
      </header>

      {matches.length === 0 ? (
        <div className="p-12 text-center bg-gray-900/50 border border-dashed border-gray-800 rounded-2xl">
          <p className="text-gray-500">No strong ancient cultural affinities detected in your data.</p>
          <p className="text-xs text-gray-600 mt-2">Historical matching requires specific markers that may not be present in all raw data files.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matches.map((culture) => (
            <div 
              key={culture.id} 
              className="relative overflow-hidden bg-gray-900 border border-gray-800 rounded-2xl p-6 transition-all hover:border-gray-600"
            >
              {/* The Background Glow (using the culture's unique color) */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl rounded-full" 
                style={{ backgroundColor: culture.color }}
              />

              <div className="flex items-start gap-4">
                <span className="text-4xl">{culture.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xl font-bold text-white">{culture.name}</h3>
                    <span 
                      className="text-xs font-bold px-2 py-1 rounded" 
                      style={{ backgroundColor: `${culture.color}33`, color: culture.color }}
                    >
                      {culture.matchScore}% Match
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {culture.description}
                  </p>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000" 
                      style={{ width: `${culture.matchScore}%`, backgroundColor: culture.color }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
