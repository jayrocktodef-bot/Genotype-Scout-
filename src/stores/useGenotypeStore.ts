import { create } from 'zustand';
import type { SerializedGenomicsError } from '../services/errorCaller';

export interface UserDataset {
  name: string;
  chip?: string;
  snpCount?: number;
  rawLineCount?: number;
  results?: any[];
  analysis?: any;
  yData?: any;
  mtData?: any;
  oracleResults?: any;
  famousMatches?: any[];
  healthImpacts?: any[];
  populationProximity?: any[];
  carrierStatuses?: any[];
  [key: string]: any;
}

interface GenotypeState {
  datasets: UserDataset[];
  activeDatasetIndex: number;
  userSnps: Record<string, string>;
  isAnalyzing: boolean;
  analysisProgress: number;
  analysisStage: string;
  error: SerializedGenomicsError | null;

  // Actions
  setDatasets: (datasets: UserDataset[] | ((prev: UserDataset[]) => UserDataset[])) => void;
  setActiveDatasetIndex: (index: number) => void;
  setUserSnps: (snps: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setAnalysisProgress: (progress: number, stage?: string) => void;
  setError: (error: SerializedGenomicsError | null) => void;
  clearAllData: () => void;
}

export const useGenotypeStore = create<GenotypeState>((set) => ({
  datasets: [],
  activeDatasetIndex: 0,
  userSnps: {},
  isAnalyzing: false,
  analysisProgress: 0,
  analysisStage: '',
  error: null,

  setDatasets: (datasets) => set((state) => ({
    datasets: typeof datasets === 'function' ? datasets(state.datasets) : datasets,
  })),
  setActiveDatasetIndex: (index) => set({ activeDatasetIndex: index }),
  setUserSnps: (snps) => set((state) => ({
    userSnps: typeof snps === 'function' ? snps(state.userSnps) : snps,
  })),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setAnalysisProgress: (progress, stage) => set((state) => ({
    analysisProgress: progress,
    analysisStage: stage !== undefined ? stage : state.analysisStage,
  })),
  setError: (error) => set({ error }),
  clearAllData: () => set({
    datasets: [],
    activeDatasetIndex: 0,
    userSnps: {},
    isAnalyzing: false,
    analysisProgress: 0,
    analysisStage: '',
    error: null,
  }),
}));
