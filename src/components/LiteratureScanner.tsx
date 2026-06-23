import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Search, Loader2, BookOpen, Fingerprint, Users } from 'lucide-react';

interface NLPResult {
  entity_group: string;
  score: number;
  word: string;
  start: number;
  end: number;
}

export function LiteratureScanner() {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading_model' | 'ready' | 'analyzing' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Initialize AI Scanner');
  const [results, setResults] = useState<NLPResult[]>([]);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // We instantiate the worker only when the component mounts
    workerRef.current = new Worker(new URL('../workers/nlpWorker.ts', import.meta.url), { type: 'module' });

    workerRef.current.onmessage = (event) => {
      const { status: workerStatus, message: workerMsg, progress: workerProg, results: workerRes, error } = event.data;

      if (workerStatus === 'progress') {
        setStatus('loading_model');
        setProgress(workerProg);
        setMessage(workerMsg);
      } else if (workerStatus === 'ready') {
        setStatus('ready');
        setMessage('Ready to scan');
      } else if (workerStatus === 'analyzing') {
        setStatus('analyzing');
        setMessage(workerMsg);
      } else if (workerStatus === 'complete') {
        setStatus('ready');
        setMessage('Scan complete');
        setResults(workerRes || []);
      } else if (workerStatus === 'error') {
        setStatus('error');
        setMessage(error);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleInitialize = () => {
    workerRef.current?.postMessage({ action: 'initialize' });
  };

  const handleScan = () => {
    if (!inputText.trim() || status !== 'ready') return;
    workerRef.current?.postMessage({ action: 'scan', text: inputText });
  };

  // Helper to render highlighted text
  const renderHighlightedText = () => {
    if (!results.length) return <p className="text-gray-300 leading-relaxed">{inputText}</p>;

    // Sort results by start index
    const sortedResults = [...results].sort((a, b) => a.start - b.start);
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];

    // Map entity groups to Tailwind colors
    const colorMap: Record<string, string> = {
      'SNP': 'bg-amber-500/20 text-amber-300 border-amber-500/50',
      'HAPLOGROUP': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
      'POPULATION': 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    };

    sortedResults.forEach((res, i) => {
      // Remove the B- or I- prefix from BIO tags
      const entity = res.entity_group.replace(/^[BI]-/, '');
      
      // Handle potential overlapping/duplicate tokens from subword tokenization
      if (res.start < lastIndex) return;

      // Add text before the entity
      if (res.start > lastIndex) {
        elements.push(<span key={`text-${i}`}>{inputText.slice(lastIndex, res.start)}</span>);
      }

      // Add the entity
      elements.push(
        <span 
          key={`entity-${i}`}
          className={`inline-flex items-center px-1.5 mx-0.5 rounded border text-sm font-medium ${colorMap[entity] || 'bg-gray-500/20 text-gray-300'}`}
          title={`Confidence: ${(res.score * 100).toFixed(1)}%`}
        >
          {inputText.slice(res.start, res.end)}
          <span className="ml-1 text-[10px] uppercase opacity-70">[{entity}]</span>
        </span>
      );

      lastIndex = res.end;
    });

    // Add remaining text
    if (lastIndex < inputText.length) {
      elements.push(<span key="text-end">{inputText.slice(lastIndex)}</span>);
    }

    return <p className="text-gray-300 leading-relaxed">{elements}</p>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-indigo-400" />
            AI Literature Scanner
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Locally-running Neural Network designed to extract Genetic Markers and Populations from raw text.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span> Population
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Marker (SNP)
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Haplogroup
          </div>
        </div>
      </div>

      {status === 'idle' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center"
        >
          <BookOpen className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Load the ONNX Model</h3>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            The Named Entity Recognition model will be loaded securely into your browser. No data leaves your device.
          </p>
          <button 
            onClick={handleInitialize}
            className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
          >
            Load NLP Engine
          </button>
        </motion.div>
      )}

      {status === 'loading_model' && (
        <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-indigo-400 font-medium">{message}</span>
            <span className="text-gray-400">{progress}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-800">
            <div className="bg-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {(status === 'ready' || status === 'analyzing' || results.length > 0) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">Target Literature</label>
            <textarea
              className="w-full h-64 bg-slate-900 border border-slate-700 rounded-xl p-4 text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none custom-scrollbar"
              placeholder="Paste a paragraph from a scientific journal here (e.g., 'We found that the Yoruba population possesses the rs123456 marker associated with the L3 haplogroup...')"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              onClick={handleScan}
              disabled={status === 'analyzing' || !inputText.trim()}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 disabled:text-gray-500 text-white rounded-xl font-medium transition-colors flex justify-center items-center gap-2"
            >
              {status === 'analyzing' ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Scanning Neural Network...</>
              ) : (
                <><Search className="w-5 h-5" /> Scan Document</>
              )}
            </button>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">Extracted Entities</label>
            <div className="w-full h-[calc(16rem+3.5rem)] bg-slate-900 border border-slate-700 rounded-xl p-4 overflow-y-auto custom-scrollbar">
              {results.length === 0 && status !== 'analyzing' ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
                  <Fingerprint className="w-8 h-8 opacity-50" />
                  <p className="text-sm">No entities detected yet.</p>
                </div>
              ) : (
                renderHighlightedText()
              )}
            </div>
          </div>
        </motion.div>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
          <strong>Error:</strong> {message}
        </div>
      )}
    </div>
  );
}
