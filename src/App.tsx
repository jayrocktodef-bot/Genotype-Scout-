/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { jsPDF } from "jspdf";
import { parseRawDNA, matchSNPs, groupByCategory, CATEGORY_META, SIG_COLOR, calculateAncestryOracle, CONTINENT_META, predictYDNAHaplogroup, analyzeMtDNA, Y_DNA_TREE, MT_DNA_TREE, SNP_DB } from "./genotypeData";
import { ANCHOR_AIMS } from "./anchorAims";
import { saveResults, loadResults, clearResults } from "./services/storageService";

const LOGO_URI = "https://jequandavis.wpcomstaging.com/wp-content/uploads/2026/03/1000055020-e1773637919503.png";

const HaplogroupTreeView = ({ node, userPath, level = 0 }: { node: any, userPath: string[], level?: number, key?: any }) => {
  const isMatch = userPath.includes(node.branchName);
  const [isExpanded, setIsExpanded] = useState(isMatch || level === 0);

  // Auto-expand if userPath changes and this node is in it
  useEffect(() => {
    if (isMatch) setIsExpanded(true);
  }, [isMatch]);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={`ml-${level > 0 ? 4 : 0} ${level > 0 ? 'border-l border-slate-200 dark:border-slate-700' : ''} pl-2 py-1 transition-all duration-300`}>
      <div 
        className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
          isMatch 
            ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 shadow-sm' 
            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-center w-5 h-5">
          {hasChildren ? (
            <span className={`text-[10px] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
              ▶
            </span>
          ) : (
            <div className={`w-1.5 h-1.5 rounded-full ${isMatch ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-300 dark:bg-slate-600'}`} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-bold truncate ${isMatch ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
              {node.branchName}
            </span>
            {(node.snp || node.mutations) && (
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/50 px-1 rounded border border-slate-100 dark:border-slate-800">
                {node.snp ? node.snp.join(', ') : node.mutations.slice(0, 2).join(', ') + (node.mutations.length > 2 ? '...' : '')}
              </span>
            )}
            {isMatch && (
              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded animate-pulse">
                Your Lineage
              </span>
            )}
            {node.region && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono uppercase tracking-tighter border border-slate-200 dark:border-slate-700">
                {node.region}
              </span>
            )}
          </div>
          {isExpanded && node.description && (
            <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1 leading-tight max-w-md">
              {node.description}
            </p>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-1 animate-fade-down">
          {node.children.map((child: any, i: number) => (
            <HaplogroupTreeView key={i} node={child} userPath={userPath} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [datasets, setDatasets] = useState<{ name: string, results: any[], chip?: string, snpCount?: number, predictedYDNA?: any, predictedMtDNA?: any }[]>([]);
  const [activeDatasetIndex, setActiveDatasetIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'matched' | 'unmatched' | 'not_tested'>('matched');
  const [significanceFilter, setSignificanceFilter] = useState<string>('all');
  const [continentFilter, setContinentFilter] = useState<string>('all');
  const [geneFilter, setGeneFilter] = useState<string>('all');
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [darkMode, setDarkMode] = useState(true);
  const [expandedSnps, setExpandedSnps] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'autosomal' | 'oracle' | 'y-dna' | 'mt-dna'>('autosomal');
  const [activeCategory, setActiveCategory] = useState<string>('Health');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  useEffect(() => {
    // Light mode by default
  }, []);

  const toggleExpand = (rsid: string) => {
    setExpandedSnps(prev => {
      const next = new Set(prev);
      if (next.has(rsid)) next.delete(rsid);
      else next.add(rsid);
      return next;
    });
  };

  useEffect(() => {
    const saved = loadResults();
    if (saved) setDatasets(saved);
  }, []);

  const updateDatasets = (newDataset: { name: string, results: any[], chip?: string, snpCount?: number, predictedYDNA?: any, predictedMtDNA?: any }) => {
    const newDatasets = [...datasets, newDataset];
    setDatasets(newDatasets);
    saveResults(newDatasets);
    setActiveDatasetIndex(newDatasets.length - 1);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(datasets[activeDatasetIndex].results));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "genotype_results.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Genotype Scout Results", 10, 10);
    let y = 20;
    datasets[activeDatasetIndex].results?.forEach((snp: any, index: number) => {
      if (y > 280) { doc.addPage(); y = 10; }
      doc.text(`${index + 1}. ${snp.trait} (${snp.rsid}): ${snp.status}`, 10, y);
      y += 10;
    });
    doc.save("genotype_results.pdf");
  };

  const resetApp = () => {
    clearResults();
    setDatasets([]);
    setActiveDatasetIndex(0);
  };

  const processFile = useCallback((file: File) => {
    setProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => {
        const text = e.target?.result as string;
        const { snpMap, snpMetaMap, chip, snpCount, yMap, mtMap } = parseRawDNA(text);
        updateDatasets({ 
          name: file.name, 
          results: matchSNPs(snpMap, snpMetaMap),
          chip,
          snpCount,
          predictedYDNA: predictYDNAHaplogroup(yMap, Y_DNA_TREE),
          predictedMtDNA: analyzeMtDNA(mtMap)
        });
        setProcessing(false);
      }, 100);
    };
    reader.readAsText(file);
  }, [datasets]);

  const results = datasets.length > 0 ? datasets[activeDatasetIndex].results : null;

  const filteredResults = results ? results.filter(r => 
    r.status === statusFilter &&
    (significanceFilter === 'all' || r.significance === significanceFilter) &&
    (continentFilter === 'all' || r.continent === continentFilter) &&
    (geneFilter === 'all' || r.gene === geneFilter)
  ) : [];

  const uniqueSignificances = Array.from(new Set(results?.map(r => r.significance) || []));
  const uniqueContinents = Array.from(new Set(results?.map(r => r.continent) || []));
  const uniqueGenes = Array.from(new Set(results?.map(r => r.gene) || []));

  return (
    <div className="app-container max-w-4xl mx-auto p-4 sm:p-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <img className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-slate-200" src={LOGO_URI} alt="Logo" />
          <div>
            <div className="text-sky-600 text-[10px] sm:text-xs tracking-widest uppercase font-bold mb-1">DNA Ancestry & Trait Analyzer</div>
            <h1 className="text-3xl sm:text-4xl tracking-tighter mb-2">
              <span className="font-light text-slate-500 dark:text-slate-500">GENOTYPE</span> SCOUT
            </h1>
            <div className="flex flex-wrap gap-4 sm:gap-6 font-bold text-sm">
              <a href="https://www.facebook.com/share/g/1H4NqczNgK/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-200 transition-colors bg-sky-50 dark:bg-sky-900/30 px-3 py-1.5 rounded-lg border border-sky-100 dark:border-sky-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook Group
              </a>
              <a href="https://jequandavis.wordpress.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                Research Blog
              </a>
              <a href="https://paypal.me/jequandavis" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 transition-colors bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                Donate
              </a>
            </div>
          </div>
        </div>
        <button onClick={toggleDarkMode} className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 self-end sm:self-auto -mt-16 sm:mt-0">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {processing && (
        <div className="border-2 border-dashed border-sky-300 rounded-xl p-16 text-center bg-sky-50 dark:bg-sky-950/30">
          <div className="text-5xl mb-4 animate-spin">🧬</div>
          <div className="text-xl font-bold text-sky-900 dark:text-sky-200 mb-2">Processing your DNA file...</div>
          <div className="text-sky-700 dark:text-sky-400 text-sm font-mono mb-8">Please wait while we analyze your markers</div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <a href="https://jequandavis.wordpress.com" target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-sky-100 dark:border-sky-800 hover:border-sky-500 transition-all text-left group">
              <div className="font-bold text-sky-900 dark:text-sky-200 mb-1 group-hover:text-sky-600">Genetic Research</div>
              <div className="text-xs text-slate-600 dark:text-slate-500">Read about the latest findings in African genetic history.</div>
            </a>
            <a href="https://www.facebook.com/share/g/1H4NqczNgK/" target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-sky-100 dark:border-sky-800 hover:border-sky-500 transition-all text-left group">
              <div className="font-bold text-sky-900 dark:text-sky-200 mb-1 group-hover:text-sky-600">Community Forum</div>
              <div className="text-xs text-slate-600 dark:text-slate-500">Connect with others exploring their transatlantic roots.</div>
            </a>
          </div>
        </div>
      )}

      {!results && !processing && (
        <div className="animate-fade-up">
          <div className="upload-blurb mb-8">
            <div className="flex gap-4 mb-4 text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded-lg inline-block">
              <span>Ancestry Oracle Aims: {ANCHOR_AIMS.length.toLocaleString()}</span>
              <span>|</span>
              <span>Total Markers: {SNP_DB.length.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Welcome to Genotype Scout</h3>
              {datasets.length > 0 && (
                <button 
                  onClick={() => setActiveDatasetIndex(0)} 
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  View Previous Results <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              )}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-400 leading-relaxed">
              Genotype Scout is a privacy-first, browser-based DNA analyzer designed to help you explore your genetic heritage and health traits. 
              By analyzing your raw DNA file from services like 23andMe, AncestryDNA, or MyHeritage, we provide detailed insights into your 
              autosomal markers and a sophisticated Ancestry Oracle prediction. 
              <strong> Your data never leaves your computer; all processing happens locally in your browser.</strong>
            </p>
          </div>
          <div
            className={`border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-16 text-center cursor-pointer bg-white/50 dark:bg-slate-800/50 transition-all ${dragging ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20" : "hover:border-sky-500"}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); }}
          >
            <input ref={fileRef} type="file" className="hidden" accept=".csv,.txt" onChange={(e) => e.target.files && processFile(e.target.files[0])} />
            <div className="text-5xl mb-4">🧬</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Drop your raw DNA file (CSV/TXT) here</div>
            <div className="text-slate-600 dark:text-slate-500 text-sm font-mono">or click to browse · analysis runs entirely in your browser</div>
          </div>
        </div>
      )}
      {results && (
        <div className="space-y-8">
          {datasets.length > 1 && (
            <div className="flex gap-2 mb-4">
              {datasets.map((d, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${activeDatasetIndex === i ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-400'}`}
                  onClick={() => setActiveDatasetIndex(i)}
                >
                  {d.name}
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-4 mb-4 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {(['matched', 'unmatched', 'not_tested'] as const).map(status => (
                <button 
                  key={status}
                  className={`px-4 py-2 rounded-full text-sm font-bold ${statusFilter === status ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-400'}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <select className="bg-slate-200 dark:bg-slate-700 rounded-full px-4 py-2 text-sm font-bold" value={significanceFilter} onChange={(e) => setSignificanceFilter(e.target.value)}>
                <option value="all">All Significance</option>
                {uniqueSignificances.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="bg-slate-200 dark:bg-slate-700 rounded-full px-4 py-2 text-sm font-bold" value={continentFilter} onChange={(e) => setContinentFilter(e.target.value)}>
                <option value="all">All Continents</option>
                {uniqueContinents.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="bg-slate-200 dark:bg-slate-700 rounded-full px-4 py-2 text-sm font-bold" value={geneFilter} onChange={(e) => setGeneFilter(e.target.value)}>
                <option value="all">All Genes</option>
                {uniqueGenes.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={resetApp} className="px-4 py-2 rounded-full text-sm font-bold bg-rose-600 text-white">
                Reset
              </button>
              <button onClick={exportJSON} className="px-4 py-2 rounded-full text-sm font-bold bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900">
                Export JSON
              </button>
              <button onClick={exportPDF} className="px-4 py-2 rounded-full text-sm font-bold bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900">
                Export PDF
              </button>
            </div>
          </div>

          <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto scrollbar-hide">
            <button 
              className={`px-6 py-3 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'autosomal' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              onClick={() => setActiveTab('autosomal')}
            >
              🧬 Autosomal DNA
            </button>
            <button 
              className={`px-6 py-3 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'oracle' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              onClick={() => setActiveTab('oracle')}
            >
              🔮 Ancestry Oracle
            </button>
            <button 
              className={`px-6 py-3 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'y-dna' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              onClick={() => setActiveTab('y-dna')}
            >
              ♂️ Y-DNA
            </button>
            <button 
              className={`px-6 py-3 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'mt-dna' ? 'border-rose-500 text-rose-600 dark:text-rose-400' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              onClick={() => setActiveTab('mt-dna')}
            >
              ♀️ mtDNA
            </button>
          </div>

          {activeTab === 'autosomal' && (() => {
            const groupedCategories = groupByCategory(filteredResults || []);
            const availableCategories = Object.keys(groupedCategories);
            if (availableCategories.length === 0) return null;
            
            const currentCat = availableCategories.includes(activeCategory) ? activeCategory : availableCategories[0];
            const allSnpsInCategory = groupedCategories[currentCat];
            const meta = CATEGORY_META[currentCat as keyof typeof CATEGORY_META] || { color: "#0284c7", icon: "🌐" };
            
            const total = allSnpsInCategory.length;
            const matchedCount = allSnpsInCategory.filter(s => s.status === 'matched').length;
            const unmatchedCount = allSnpsInCategory.filter(s => s.status === 'unmatched').length;
            const notTestedCount = allSnpsInCategory.filter(s => s.status === 'not_tested').length;

            const CustomTooltip = ({ active, payload }: any) => {
              if (active && payload && payload.length) {
                const entry = payload[0];
                const percentage = ((entry.value / total) * 100).toFixed(1);
                return (
                  <div className="bg-slate-800 p-3 rounded-lg text-xs text-white shadow-xl border border-slate-700 min-w-[120px]">
                    <p className="font-bold mb-1 text-sm" style={{ color: entry.fill }}>{entry.name}</p>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-300">Count:</span>
                      <span className="font-mono">{entry.value}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-300">Percentage:</span>
                      <span className="font-mono">{percentage}%</span>
                    </div>
                  </div>
                );
              }
              return null;
            };

            return (
              <div className="animate-fade-up">
                {/* Chip Information (ISOGG inspired) */}
                {datasets[activeDatasetIndex].chip && (
                  <div className="mb-6 p-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 text-xl">
                        📟
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">Detected Platform</h4>
                        <p className="text-sm font-bold text-sky-900 dark:text-sky-100">{datasets[activeDatasetIndex].chip}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <h4 className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-widest">Total SNPs</h4>
                        <p className="text-sm font-mono font-bold text-sky-900 dark:text-sky-100">{datasets[activeDatasetIndex].snpCount?.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <h4 className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-widest">Database Match</h4>
                        <p className="text-sm font-mono font-bold text-sky-900 dark:text-sky-100">
                          {((matchedCount / total) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {availableCategories.map(category => {
                    const catMeta = CATEGORY_META[category as keyof typeof CATEGORY_META] || { color: "#0284c7", icon: "🌐" };
                    const isActive = currentCat === category;
                    return (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${isActive ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700' : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200'}`}
                        style={isActive ? { color: catMeta.color } : {}}
                      >
                        <span className="text-lg">{catMeta.icon}</span>
                        <span>{category}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${isActive ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'bg-slate-200/50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                          {groupedCategories[category].length}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Category Header/Summary */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600">
                        {meta.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold" style={{ color: meta.color }}>{currentCat}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">{total} marker{total !== 1 ? "s" : ""} analyzed</p>
                      </div>
                    </div>
                    
                    <div className="h-12 w-full sm:w-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={[{ matched: matchedCount, unmatched: unmatchedCount, notTested: notTestedCount }]} stackOffset="expand">
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" hide />
                          <Tooltip cursor={false} content={<CustomTooltip />} shared={false} />
                          <Bar dataKey="matched" name="Matched" stackId="a" fill="#10b981" radius={[4, 0, 0, 4]} />
                          <Bar dataKey="unmatched" name="Unmatched" stackId="a" fill="#f59e0b" />
                          <Bar dataKey="notTested" name="Not Tested" stackId="a" fill="#cbd5e1" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4 bg-slate-50/30 dark:bg-slate-900/30">
                    {currentCat === 'Ancestry' && (
                      <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-700 dark:text-amber-300 italic">
                        <strong>Important Note on Native American Markers:</strong> DNA markers can show broad regions or language groups, but they cannot point to one specific modern tribe. Groups traded, moved, and mixed for thousands of years, meaning these genetic markers are shared widely across the Americas.
                      </div>
                    )}
                    
                    {allSnpsInCategory.map((snp: any) => (
                      <div key={`${snp.markerId}-${snp.continent}`} className={`trait-card rounded-xl p-6 border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 shadow-sm ${snp.status === 'matched' ? 'ring-2 ring-sky-500' : ''}`}>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="font-mono text-xs text-sky-700 dark:text-sky-400 font-bold">{snp.rsid}</div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 text-lg">{snp.trait}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: `${SIG_COLOR[snp.significance as keyof typeof SIG_COLOR]}15`, color: SIG_COLOR[snp.significance as keyof typeof SIG_COLOR] }}>
                              {snp.significance} significance
                            </div>
                            {snp.status === 'matched' && (
                              <button onClick={() => toggleExpand(snp.rsid)} className="text-slate-400 hover:text-sky-600 dark:hover:text-sky-400">
                                {expandedSnps.has(snp.rsid) ? '▲' : '▼'}
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{snp.description}</p>
                        {snp.status !== 'not_tested' && expandedSnps.has(snp.rsid) && (
                          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 grid grid-cols-[auto,1fr] gap-x-6 gap-y-2 items-start border border-slate-100 dark:border-slate-800">
                            <div className="font-mono text-[10px] text-slate-500 dark:text-slate-500 uppercase pt-1 font-bold">Genotype</div>
                            <div className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100 tracking-widest">{snp.userGenotype}</div>
                            <div className="font-mono text-[10px] text-slate-500 dark:text-slate-500 uppercase pt-1 font-bold">What this means for you</div>
                            <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                              {snp.interpretation}
                              {snp.referenceUrl && (
                                <a href={snp.referenceUrl} target="_blank" rel="noopener noreferrer" className="block mt-2 text-sky-600 dark:text-sky-400 hover:underline text-xs font-mono">
                                  Learn more about {snp.rsid}
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
          {activeTab === 'oracle' && (() => {
            const ancestrySnps = datasets[activeDatasetIndex].results.filter(r => r.category === 'Ancestry');
            const oracle = calculateAncestryOracle(
              ancestrySnps,
              datasets[activeDatasetIndex].predictedYDNA?.predicted?.continent,
              datasets[activeDatasetIndex].predictedMtDNA?.region
            );
            const { continentalScores, regionalScores, deepScores } = oracle;
            
            if (Object.keys(continentalScores).length === 0) {
              return (
                <div className="mt-12 p-6 border-2 border-indigo-200 dark:border-indigo-800/50 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 shadow-sm">
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-500 text-center">
                    Not enough data to generate an ancestry prediction.
                  </div>
                </div>
              );
            }

            return (
              <div className="mt-12 p-6 border-2 border-indigo-200 dark:border-indigo-800/50 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 shadow-sm">
                <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-400 mb-6">Ancestry Oracle Prediction</h2>
                
                <div className="space-y-8">
                  {/* Continental Admixture */}
                  <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/30 shadow-sm">
                    <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-400 uppercase tracking-wider mb-4">Continental Admixture</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(continentalScores).map(([continent, percentage], idx) => {
                        const meta = CONTINENT_META[continent as keyof typeof CONTINENT_META] || { color: '#94a3b8', icon: '🌍' };
                        return (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-xl shadow-sm">{meta.icon}</div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{continent}</span>
                                <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">{percentage.toFixed(1)}%</span>
                              </div>
                              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                                <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: meta.color }}></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Regional Breakdown */}
                  <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/30 shadow-sm">
                    <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-400 uppercase tracking-wider mb-4">Regional Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(regionalScores).map(([region, score], idx) => (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-400">{region}</span>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{score.toFixed(1)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deep Affinity */}
                  <div className="bg-indigo-900 dark:bg-indigo-950 p-6 rounded-xl border border-indigo-700 shadow-sm text-indigo-100">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-indigo-300">Deep Affinity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(deepScores).map(([affinity, score], idx) => (
                        <div key={idx} className="p-3 bg-indigo-800/50 rounded-lg border border-indigo-700">
                          <span className="text-xs font-medium text-indigo-200">{affinity}</span>
                          <div className="text-lg font-bold text-white">{score.toFixed(1)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {activeTab === 'y-dna' && (() => {
            const yData = datasets[activeDatasetIndex].predictedYDNA;
            if (!yData) return null;

            return (
              <div className="animate-fade-up space-y-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-8 rounded-2xl border border-blue-100 dark:border-blue-800/50 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">♂️</div>
                  <div className="relative z-10">
                    <h3 className="text-blue-800 dark:text-blue-300 font-bold uppercase tracking-widest text-xs mb-2">Paternal Lineage Prediction</h3>
                    {yData.predicted ? (
                      <>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Haplogroup {yData.predicted.name}</h2>
                        <div className="flex flex-wrap gap-3 mb-6">
                          <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold shadow-sm">Marker: {yData.predicted.marker}</span>
                          <span className="px-3 py-1 bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-800 shadow-sm">Region: {yData.predicted.continent}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">{yData.predicted.description}</p>
                      </>
                    ) : (
                      <div className="py-8">
                        <h2 className="text-2xl font-bold text-slate-400">No specific Y-DNA haplogroup detected</h2>
                        <p className="text-slate-500 text-sm mt-2">This may be due to limited marker coverage on your DNA chip or a lineage not yet in our database.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600">🌳</span>
                        Phylogenetic Tree
                      </h3>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <HaplogroupTreeView node={Y_DNA_TREE} userPath={yData.path} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600">🔬</span>
                      Tested Markers
                    </h3>
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                      <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
                        {yData.testedMarkers.map((m: any, i: number) => (
                          <div key={i} className={`p-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center ${m.isDerived ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{m.marker}</div>
                              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">{m.trait}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono font-bold text-slate-400">{m.genotype}</span>
                              <span className={`w-2 h-2 rounded-full ${m.isDerived ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-200 dark:bg-slate-700'}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {activeTab === 'mt-dna' && (() => {
            const mtData = datasets[activeDatasetIndex].predictedMtDNA;
            if (!mtData) return null;

            return (
              <div className="animate-fade-up space-y-8">
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 p-8 rounded-2xl border border-rose-100 dark:border-rose-800/50 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">♀️</div>
                  <div className="relative z-10">
                    <h3 className="text-rose-800 dark:text-rose-300 font-bold uppercase tracking-widest text-xs mb-2">Maternal Lineage Prediction</h3>
                    {mtData.predicted ? (
                      <>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Haplogroup {mtData.predicted}</h2>
                        <div className="flex flex-wrap gap-3 mb-6">
                          <span className="px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-bold shadow-sm">Confidence Score: {mtData.score}</span>
                          <span className="px-3 py-1 bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 rounded-full text-xs font-bold border border-rose-200 dark:border-rose-800 shadow-sm">Region: {mtData.region}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">{mtData.description}</p>
                      </>
                    ) : (
                      <div className="py-8">
                        <h2 className="text-2xl font-bold text-slate-400">No specific mtDNA haplogroup detected</h2>
                        <p className="text-slate-500 text-sm mt-2">This may be due to limited marker coverage on your DNA chip or a lineage not yet in our database.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600">🌳</span>
                      Phylogenetic Tree
                    </h3>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
                      <HaplogroupTreeView node={MT_DNA_TREE} userPath={mtData.path} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600">🔬</span>
                      Tested Markers
                    </h3>
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                      <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
                        {mtData.testedMarkers.map((m: any, i: number) => (
                          <div key={i} className={`p-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center ${m.status === 'derived' ? 'bg-rose-50/30 dark:bg-rose-900/10' : ''}`}>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{m.mutation}</div>
                              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">Position: {m.pos} · {m.ancestral}→{m.derived}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${m.status === 'derived' ? 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                                {m.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      )}
    </div>
  );
}
