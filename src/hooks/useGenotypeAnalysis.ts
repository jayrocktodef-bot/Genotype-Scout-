/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import JSZip from 'jszip';
import { saveResults, loadResults, saveSnpMapToOPFS } from '../services/storageService';
import { healCachedDatasets } from '../services/datasetAutoHealer';
import { forceResetAndClearCache } from '../utils/cacheManager';
import { serializeGenomicsError, type SerializedGenomicsError } from '../services/errorCaller';
import { mapToRegion } from '../utils/genotypeUtils';
import { calculateAncientAdmixture, calculateIndividualMatches, calculateArchaicIntrogression } from '../lib/AncientAdmixtureCalculator';
import { calculateFamousMatches } from '../utils/individualMatching';
import { matchHealthAndWellness } from '../utils/healthMatching';
import { calculatePopulationProximity } from '../utils/ancestry/populationComparison';
import { tabToDefaultApp } from '../stores/useNavigationStore';
import masterMtdna from '../data/master_mtdna.json';

const mitoTraits = masterMtdna.traits;

export interface UseGenotypeAnalysisProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  currentApp: string | null;
  setCurrentApp: (app: string | null) => void;
  activeAncestrySubTab: string;
  activeHealthSubTab: string;
}

export function useGenotypeAnalysis({
  activeTab,
  setActiveTab,
  currentApp,
  setCurrentApp,
  activeAncestrySubTab,
  activeHealthSubTab
}: UseGenotypeAnalysisProps) {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [activeDatasetIndex, setActiveDatasetIndex] = useState(0);
  const [ancientAdmixture, setAncientAdmixture] = useState<any[]>([]);
  const [populationProximity, setPopulationProximity] = useState<any[]>([]);
  const snpMaps = useRef<Record<number, Record<string, string>>>({});
  const activeWorkerRef = useRef<Worker | null>(null);
  const currentJobIdRef = useRef<string>('');

  useEffect(() => {
    return () => {
      activeWorkerRef.current?.terminate();
      activeWorkerRef.current = null;
      currentJobIdRef.current = '';
    };
  }, []);

  const isDemoParser = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('demo_parser');
  const [processing, setProcessing] = useState(isDemoParser);
  const [streamProgress, setStreamProgress] = useState<{
    processed: number;
    total: number;
    snps: number;
    step: string;
    percent?: number;
  }>(isDemoParser ? {
    processed: 16.78 * 1024 * 1024,
    total: 16.78 * 1024 * 1024,
    snps: 13449,
    step: "Finalizing EuroForGen & Microhaplotypes...",
    percent: 99
  } : { processed: 0, total: 0, snps: 0, step: "Ready", percent: 0 });

  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [error, setError] = useState<SerializedGenomicsError | null>(null);
  const [treeSearchTerm, setTreeSearchTerm] = useState<string>('');
  const [humanOriginsResults, setHumanOriginsResults] = useState<any[]>([]);
  const [grafResults, setGrafResults] = useState<any[]>([]);
  const [microHapResults, setMicroHapResults] = useState<any[]>([]);

  // Synchronize URL hash tab changes with workspace currentApp
  useEffect(() => {
    const targetApp = tabToDefaultApp(activeTab as any, activeAncestrySubTab as any, activeHealthSubTab as any);
    if (targetApp !== currentApp) {
      setCurrentApp(targetApp);
    }
  }, [activeTab, activeAncestrySubTab, activeHealthSubTab]);

  // When currentApp is closed (navigated back to launcher), reflect in URL hash
  useEffect(() => {
    if (currentApp === null && activeTab !== 'dashboard') {
      setActiveTab('dashboard');
    }
  }, [currentApp]);

  useEffect(() => {
    const checkForceReset = async () => {
      try {
        const CURRENT_BUILD = 'v5.19.0_cache_reset';
        const lastBuild = localStorage.getItem('genotype_scout_build');
        if (lastBuild !== CURRENT_BUILD) {
          console.log(`[App] Build version update registered: ${lastBuild} -> ${CURRENT_BUILD}`);
          localStorage.setItem('genotype_scout_build', CURRENT_BUILD);
        }
      } catch (e) {
        console.warn('[App] Could not write build version to localStorage:', e);
      }
    };
    checkForceReset();
  }, []);

  useEffect(() => {
    const init = async () => {
      const saved = await loadResults();
      if (saved) {
        const { updated, hasChanges } = await healCachedDatasets(saved, snpMaps);
        setDatasets(updated);
        if (hasChanges) {
          saveResults(updated);
        }
      }
    };
    init();
  }, []);

  const updateDatasets = async (newDataset: any) => {
    const newDatasets = [...datasets, newDataset];
    setDatasets(newDatasets);
    
    if (newDataset.analysis?.humanOriginsResults_raw) {
      setHumanOriginsResults(newDataset.analysis.humanOriginsResults_raw);
    }
    if (newDataset.analysis?.grafResults) {
      setGrafResults(newDataset.analysis.grafResults);
    }
    if (newDataset.analysis?.microHapResults) {
      setMicroHapResults(newDataset.analysis.microHapResults);
    }

    // Persist to IndexedDB and OPFS in parallel
    saveResults(newDatasets);
    if (newDataset.mergedSnpMap && Object.keys(newDataset.mergedSnpMap).length > 0) {
      const datasetKey = newDataset.id || newDataset.name;
      if (datasetKey) {
        saveSnpMapToOPFS(datasetKey, newDataset.mergedSnpMap).catch(err => {
          console.warn('[OPFS Storage] Background snp_map persistence note:', err);
        });
      }
    }

    setActiveDatasetIndex(newDatasets.length - 1);
  };

  useEffect(() => {
    if (datasets[activeDatasetIndex]?.analysis?.humanOriginsResults_raw) {
      setHumanOriginsResults(datasets[activeDatasetIndex].analysis.humanOriginsResults_raw);
    }
    if (datasets[activeDatasetIndex]?.analysis?.grafResults) {
      setGrafResults(datasets[activeDatasetIndex].analysis.grafResults);
    }
    if (datasets[activeDatasetIndex]?.analysis?.microHapResults) {
      setMicroHapResults(datasets[activeDatasetIndex].analysis.microHapResults);
    }
  }, [activeDatasetIndex, datasets]);

  const resetApp = async () => {
    setDatasets([]);
    setActiveDatasetIndex(0);
    await forceResetAndClearCache(true);
  };

  const processFiles = useCallback(async (files: FileList | File[]) => {
    setProcessing(true);
    setError(null);
    const fileArray = Array.isArray(files) ? files : Array.from(files);

    try {
      const expandedFiles: File[] = [];
      for (const file of fileArray) {
        if (file.name.toLowerCase().endsWith('.zip')) {
          if (file.size > 2000 * 1024 * 1024) {
            throw new Error(`The ZIP file "${file.name}" (${(file.size / (1024 * 1024)).toFixed(0)}MB) exceeds the 2GB browser zip extraction limit. Please extract it on your device and upload the enclosed .vcf, .txt, or .vcf.gz file directly for high-speed streaming ingestion.`);
          }
          const zip = await JSZip.loadAsync(file);
          const validKeys = Object.keys(zip.files).filter(k => {
            const lower = k.toLowerCase();
            if (zip.files[k].dir || lower.startsWith('__macosx/') || lower.includes('.ds_store') || lower.includes('..')) return false;
            if (lower.endsWith('.pdf') || lower.endsWith('.html') || lower.endsWith('.htm') ||
                lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') ||
                lower.endsWith('.gif') || lower.endsWith('.svg') || lower.endsWith('.doc') ||
                lower.endsWith('.docx') || lower.endsWith('.xml') || lower.endsWith('.json') ||
                lower.endsWith('.md') || lower.endsWith('.rtf')) return false;
            const baseName = lower.split('/').pop() || '';
            if (baseName.startsWith('readme') || baseName.startsWith('disclaimer') ||
                baseName.startsWith('terms') || baseName.startsWith('license') ||
                baseName.startsWith('manifest') || baseName.startsWith('metadata') ||
                baseName.startsWith('instructions')) return false;
            return true;
          });

          if (validKeys.length > 1) {
            validKeys.sort((a, b) => {
              const score = (key: string) => {
                const l = key.toLowerCase();
                let s = 0;
                if (l.endsWith('.vcf') || l.endsWith('.vcf.gz')) s += 100;
                if (l.endsWith('.txt') || l.endsWith('.txt.gz')) s += 90;
                if (l.endsWith('.csv') || l.endsWith('.csv.gz')) s += 80;
                if (l.endsWith('.tsv') || l.endsWith('.tsv.gz')) s += 70;
                if (l.endsWith('.dat')) s += 60;
                if (l.includes('genome') || l.includes('dna') || l.includes('ancestry') || l.includes('23andme') || l.includes('myheritage') || l.includes('ftdna') || l.includes('livingdna')) s += 30;
                return s;
              };
              return score(b) - score(a);
            });
          }

          const keysToExtract = validKeys.length > 0 ? (validKeys.length === 1 ? validKeys : [validKeys[0]]) : [];
          if (keysToExtract.length === 0) {
            throw new Error(`The ZIP file "${file.name}" does not contain recognized raw genomic data (.txt, .csv, .vcf, .tsv).`);
          }

          for (const relativePath of keysToExtract) {
            const content = await zip.files[relativePath].async('blob');
            const rawName = relativePath.split('/').pop() || relativePath;
            const sanitizedName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/^_+/, '');
            const unzippedFileName = sanitizedName.length > 0 ? sanitizedName : `extracted_${Date.now()}.txt`;
            expandedFiles.push(new File([content], unzippedFileName, { type: 'text/plain' }));
          }
        } else {
          expandedFiles.push(file);
        }
      }

      if (expandedFiles.length === 0) {
        throw new Error("No readable genomic files found to process.");
      }

      const fileContents = expandedFiles.map(file => ({
        name: file.name,
        file: file
      }));

      if (activeWorkerRef.current) {
        activeWorkerRef.current.terminate();
        activeWorkerRef.current = null;
      }

      const jobId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      currentJobIdRef.current = jobId;

      const worker = new Worker(new URL('../workers/genotypeWorker.ts', import.meta.url), { type: 'module' });
      activeWorkerRef.current = worker;

      let progressInterval: any = null;
      let progressRafId: number = 0;
      const cleanupProcessing = () => {
        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }
        if (progressRafId) {
          cancelAnimationFrame(progressRafId);
          progressRafId = 0;
        }
        if (activeWorkerRef.current === worker) {
          activeWorkerRef.current = null;
        }
        worker.terminate();
      };

      let sab: SharedArrayBuffer | null = null;
      let progressInt32: Int32Array | null = null;
      const isIsolated = typeof crossOriginIsolated !== 'undefined' ? crossOriginIsolated : true;
      const hasSAB = typeof SharedArrayBuffer !== 'undefined' && isIsolated;
      if (hasSAB) {
        try {
          sab = new SharedArrayBuffer(16);
          progressInt32 = new Int32Array(sab);
          progressInterval = setInterval(() => {
            if (!progressInt32) return;
            const processedLow = Atomics.load(progressInt32, 0);
            const totalLow = Atomics.load(progressInt32, 1);
            const snps = Atomics.load(progressInt32, 2);
            if (totalLow > 0) {
              const processedBytes = processedLow >>> 0;
              const totalBytes = totalLow >>> 0;
              const pct = Math.min(99, Math.round((processedBytes / totalBytes) * 100));
              setStreamProgress(prev => ({
                ...prev,
                processed: processedBytes,
                total: totalBytes,
                snps: Math.max(prev.snps, snps),
                percent: Math.max(prev.percent || 0, pct)
              }));
            }
          }, 150);
        } catch {
          sab = null;
          progressInt32 = null;
        }
      }

      let pendingProgressPayload: any = null;
      const applyProgressUpdate = () => {
        if (!pendingProgressPayload) return;
        const p = pendingProgressPayload;
        pendingProgressPayload = null;
        setStreamProgress(prev => ({
          processed: p.processed !== undefined ? p.processed : prev.processed,
          total: p.total !== undefined ? p.total : prev.total,
          snps: p.snps !== undefined ? p.snps : prev.snps,
          step: p.step || prev.step,
          percent: p.percent !== undefined ? p.percent : prev.percent
        }));
      };

      worker.onmessage = (e) => {
        const { type, payload, error: workerError, requestId } = e.data;
        if (requestId && requestId !== currentJobIdRef.current) {
          return;
        }

        if (type === 'PROGRESS') {
          pendingProgressPayload = payload;
          if (!progressRafId) {
            progressRafId = requestAnimationFrame(() => {
              progressRafId = 0;
              applyProgressUpdate();
            });
          }
        } else if (type === 'SUCCESS') {
          cleanupProcessing();
          const newIndex = datasets.length;
          snpMaps.current[newIndex] = payload.mergedSnpMap;
          updateDatasets({ 
            ...payload
          });
          setPendingFiles([]);
          setProcessing(false);
          cleanupProcessing();
        } else if (type === 'ERROR') {
          cleanupProcessing();
          const structured = serializeGenomicsError(workerError, 'GENOTYPE_WORKER');
          setError(structured);
          setProcessing(false);
        }
      };

      worker.onerror = (err) => {
        cleanupProcessing();
        console.error("Worker error encountered:", err);
        const structured = serializeGenomicsError(err, 'GENOTYPE_WORKER', {
          fileName: fileArray.map(f => f.name).join(', '),
          fileSize: fileArray.reduce((acc, f) => acc + f.size, 0),
          errorType: (err as any)?.type || 'error',
          filename: (err as any)?.filename,
          lineno: (err as any)?.lineno,
          colno: (err as any)?.colno,
        });
        setError(structured);
        setProcessing(false);
      };

      worker.postMessage({ 
        type: 'PROCESS_GENOME', 
        files: fileContents,
        sab,
        requestId: jobId
      });
    } catch (err) {
      console.error("Processing error:", err);
      setError(serializeGenomicsError(err, 'FILE_INGESTION'));
      setProcessing(false);
    }
  }, [datasets]);

  const results = datasets.length > 0 ? datasets[activeDatasetIndex]?.results : null;

  const oracleResults = useMemo(() => {
    const dataset = datasets[activeDatasetIndex];
    if (!dataset?.analysis?.oracleResults) return null;
    const oracle = dataset.analysis.oracleResults;

    const processOracle = (data: any) => {
      const { continentalScores: rawContinentalScores, regionalScores, deepScores, subPopulations, chromosomeData } = data;
      const continentalScores = Object.entries(rawContinentalScores).reduce((acc: Record<string, number>, [continent, score]) => {
        const region = mapToRegion(continent);
        acc[region] = (acc[region] || 0) + (score as number);
        return acc;
      }, {});
      return { continentalScores, regionalScores, deepScores, subPopulations, chromosomeData };
    };

    return {
      primary: processOracle(oracle.primary),
      engine: humanOriginsResults
    };
  }, [datasets, activeDatasetIndex, humanOriginsResults]);

  useEffect(() => {
    const dataset = datasets[activeDatasetIndex];
    if (!dataset) {
      setAncientAdmixture([]);
      return;
    }
    if (dataset.analysis?.ancientAdmixture) {
      setAncientAdmixture(dataset.analysis.ancientAdmixture);
      return;
    }
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) {
      setAncientAdmixture([]);
      return;
    }
    calculateAncientAdmixture(snpMap).then(res => {
      setAncientAdmixture(res);
    }).catch(err => {
      console.error("Ancient Admixture Error:", err);
      setAncientAdmixture([]);
    });
  }, [datasets, activeDatasetIndex, datasets[activeDatasetIndex]?.analysis?.ancientAdmixture]);

  const archaicIntrogression = useMemo(() => {
    const dataset = datasets[activeDatasetIndex];
    if (dataset?.analysis?.archaicIntrogression) return dataset.analysis.archaicIntrogression;
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return null;
    return calculateArchaicIntrogression(snpMap);
  }, [datasets, activeDatasetIndex]);

  const individualMatches = useMemo(() => {
    const dataset = datasets[activeDatasetIndex];
    if (dataset?.analysis?.individualMatches) return dataset.analysis.individualMatches;
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return [];
    return calculateIndividualMatches(snpMap, dataset?.analysis?.ancientAdmixture);
  }, [datasets, activeDatasetIndex]);

  const famousMatches = useMemo(() => {
    const dataset = datasets[activeDatasetIndex];
    if (dataset?.analysis?.famousMatches) return dataset.analysis.famousMatches;
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return [];
    return calculateFamousMatches(snpMap);
  }, [datasets, activeDatasetIndex]);

  const activeMtData = useMemo(() => {
    const dataset = datasets[activeDatasetIndex];
    return dataset?.predictedMtDNA || null;
  }, [datasets, activeDatasetIndex]);

  const activeYData = useMemo(() => {
    const dataset = datasets[activeDatasetIndex];
    return dataset?.predictedYDNA || null;
  }, [datasets, activeDatasetIndex]);

  const healthWellnessMatches = useMemo(() => {
    const dataset = datasets[activeDatasetIndex];
    if (dataset?.analysis?.healthWellness) return dataset.analysis.healthWellness;
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) return [];
    return matchHealthAndWellness(snpMap);
  }, [datasets, activeDatasetIndex]);

  useEffect(() => {
    const dataset = datasets[activeDatasetIndex];
    if (!dataset) {
      setPopulationProximity([]);
      return;
    }
    if (dataset.analysis?.populationProximity) {
      setPopulationProximity(dataset.analysis.populationProximity);
      return;
    }
    const snpMap = snpMaps.current[activeDatasetIndex];
    if (!snpMap) {
      setPopulationProximity([]);
      return;
    }
    calculatePopulationProximity(snpMap).then(res => {
      setPopulationProximity(res);
    }).catch(err => {
      console.error("Population Proximity Error:", err);
      setPopulationProximity([]);
    });
  }, [datasets, activeDatasetIndex, datasets[activeDatasetIndex]?.analysis?.populationProximity]);

  const userMatchedMitoTraits = useMemo(() => {
    const dataset = datasets[activeDatasetIndex];
    if (!dataset || !dataset.mergedMtMap) return [];
    
    const mtMap = dataset.mergedMtMap;
    return (mitoTraits as any[]).filter(trait => {
        const userAllele = mtMap[trait.position];
        if (!userAllele) return false;
        
        const alleleStr = trait.allele || '';
        if (alleleStr.includes('>')) {
          const [, derived] = alleleStr.split('>');
          return userAllele.toUpperCase() === derived.trim().toUpperCase();
        }
        
        return userAllele.toUpperCase() === alleleStr.trim().toUpperCase();
    });
  }, [datasets, activeDatasetIndex]);

  return {
    datasets,
    setDatasets,
    activeDatasetIndex,
    setActiveDatasetIndex,
    updateDatasets,
    snpMaps,
    results,
    processing,
    streamProgress,
    pendingFiles,
    setPendingFiles,
    error,
    setError,
    processFiles,
    resetApp,
    oracleResults,
    populationProximity,
    ancientAdmixture,
    archaicIntrogression,
    individualMatches,
    famousMatches,
    healthWellnessMatches,
    activeMtData,
    activeYData,
    userMatchedMitoTraits,
    treeSearchTerm,
    setTreeSearchTerm
  };
}
