import React, { useMemo } from 'react';
import pcaModel from '../data/raw_aims/pca_model.json';
import { PCAMap } from './PCAMap';

interface PopulationComparisonTabProps {
  userSnps: Record<string, string>;
  populationProximity?: any[];
}

// Mapping for population abbreviations to full names
const POPULATION_NAME_MAP: Record<string, string> = {
  ACB: "African Caribbeans",
  ASW: "African Ancestry in Southwest US",
  BEB: "Bengali",
  CDX: "Chinese Dai",
  CEU: "Northern European",
  CHB: "Han Chinese (Beijing)",
  CHS: "Southern Han Chinese",
  CLM: "Colombian",
  ESN: "Esan (Nigeria)",
  FIN: "Finnish",
  GBR: "British",
  GIH: "Gujarati Indian",
  GWD: "Gambian",
  IBS: "Iberian",
  ITU: "Indian Telugu",
  JPT: "Japanese",
  KHV: "Kinh (Vietnam)",
  LWK: "Luhya (Kenya)",
  MSL: "Mende (Sierra Leone)",
  MXL: "Mexican Ancestry",
  PEL: "Peruvian",
  PJL: "Punjabi",
  PUR: "Puerto Rican",
  STU: "Sri Lankan Tamil",
  TSI: "Toscani (Italy)",
  YRI: "Yoruba (Nigeria)",
};

export const PopulationComparisonTab: React.FC<PopulationComparisonTabProps> = ({ userSnps, populationProximity }) => {
  // Use pre-calculated results or calculate if missing (fallback)
  const closestMatches = useMemo(() => {
    if (populationProximity && populationProximity.length > 0) {
      return populationProximity.slice(0, 15);
    }
    return [];
  }, [populationProximity]);

  // Project user SNPs into the PCA space
  const userCoordinates = useMemo(() => {
    if (!userSnps || Object.keys(userSnps).length === 0) return null;

    try {
      const { rsIDs, model } = pcaModel as any;
      const { means, U } = model;
      
      const userVector = rsIDs.map((rsid: string, i: number) => {
        const genotype = userSnps[rsid];
        if (!genotype) return means[i]; // Impute with population mean
        
        // Simple 0/0.5/1 encoding
        const val = genotype === 'AA' ? 0 : genotype === 'AG' ? 0.5 : 1;
        return val;
      });

      const pc1 = userVector.reduce((sum: number, val: number, i: number) => sum + (val - means[i]) * U[i][0], 0);
      const pc2 = userVector.reduce((sum: number, val: number, i: number) => sum + (val - means[i]) * U[i][1], 0);

      return { pc1, pc2 };
    } catch (e) {
      console.error('PCA Projection Error:', e);
      return null;
    }
  }, [userSnps]);

  if (!userSnps || Object.keys(userSnps).length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-900 rounded-xl border border-slate-800 dark:text-slate-400">
        No genotype data available. Please upload a file to see population comparisons.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">Global Reference Populations</h2>
          <div className="space-y-4">
            {closestMatches.map((match, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 font-medium">
                      {POPULATION_NAME_MAP[match.population] || match.population.replace('_', ' ')}
                      <span className="ml-2 text-[10px] text-slate-500 uppercase tracking-tighter bg-slate-800 px-1.5 py-0.5 rounded dark:text-slate-400">
                        {match.region}
                      </span>
                    </span>
                    <span className="text-emerald-400 font-mono">{Number(match.similarityScore || 0).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${match.similarityScore}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="space-y-6">
          <PCAMap userCoordinates={userCoordinates} />
          
          <div className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-lg">
            <p className="text-xs text-blue-300/70 leading-relaxed">
              <span className="font-bold text-blue-300 mr-1">Note:</span>
              These results display your genetic proximity to modern reference groups from the 1000 Genomes Project and HGDP. 
              Your position on the PCA map is projected using 150 Ancestry Informative Markers (AIMs).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
