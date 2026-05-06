import React from 'react';
import { PopulationProximity } from '../utils/populationComparison';

export const PopulationComparisonTab: React.FC<{ proximityData: PopulationProximity[] }> = ({ proximityData }) => {
  const topMatches = proximityData.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg">
        <h3 className="text-blue-400 font-bold flex items-center">
          <span className="mr-2">ℹ️</span> Understanding Proximity
        </h3>
        <p className="text-sm text-gray-300 mt-1">
          This score represents genetic similarity to reference groups, not necessarily your ancestry percentage. 
          High scores indicate your genotypes are common in that specific population.
        </p>
      </div>

      <div className="space-y-4">
        {topMatches.map((pop, i) => (
          <div key={pop.code} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                #{i + 1}
              </div>
              <div>
                <h4 className="text-white font-bold">{pop.name}</h4>
                <p className="text-xs text-gray-500 uppercase tracking-tighter">{pop.region}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xl font-mono text-green-400">{pop.similarity}%</div>
              <div className="text-[10px] text-gray-600">{pop.markersMatched} markers</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
