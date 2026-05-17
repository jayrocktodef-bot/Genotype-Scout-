import React, { useState, useMemo } from 'react';
import { processSubpopulations, AIM, UserGenotype } from './ancestryOracleLogic';

interface BentoProps {
  userGenotypes: UserGenotype[];
  aimsDatabase: AIM[];
}

const SubpopulationBento: React.FC<BentoProps> = ({ userGenotypes, aimsDatabase }) => {
  const [showUnmapped, setShowUnmapped] = useState(false);

  // Run the Oracle Logic
  const results = useMemo(() => {
    return processSubpopulations(userGenotypes, aimsDatabase);
  }, [userGenotypes, aimsDatabase]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          Deep Regional Match
        </h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          Oracle Engine
        </span>
      </div>

      <div className="mb-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Closest Subpopulation</p>
        <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
          {results.topMatch}
        </h1>
        <p className="text-xs text-gray-400 mt-2">
          Calculated using {results.subpopAimsUsed} localized AIMs.
        </p>
      </div>

      {/* Unmapped Markers Tagging Section */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setShowUnmapped(!showUnmapped)}
          className="text-sm font-medium text-gray-600 hover:text-indigo-500 flex items-center justify-between w-full transition-colors"
        >
          <span>Broad Continental Markers (No Subpop)</span>
          <span>{showUnmapped ? '▲' : '▼'}</span>
        </button>

        {showUnmapped && (
          <div className="mt-3 max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded p-3">
            <p className="text-xs text-gray-500 mb-2">
              The following {results.unmappedAims.length} markers only map to macro-continental families (e.g., Broadly European, Broadly African) and were excluded from the regional calculation:
            </p>
            <ul className="text-xs space-y-1 font-mono text-gray-600 dark:text-gray-300">
              {results.unmappedAims.slice(0, 50).map((aim: any) => (
                <li key={aim.rsid}>
                  {aim.rsid} (Chr: {aim.chromosome})
                </li>
              ))}
              {results.unmappedAims.length > 50 && (
                <li className="text-indigo-400 italic">...and {results.unmappedAims.length - 50} more.</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubpopulationBento;
