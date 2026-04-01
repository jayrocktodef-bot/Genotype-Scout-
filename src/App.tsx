/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { jsPDF } from "jspdf";
import { parseRawDNA, matchSNPs, groupByCategory, CATEGORY_META, SIG_COLOR, predictYDNAHaplogroup, calculateAncestryOracle, CONTINENT_META, analyzeMtDNA } from "./genotypeData";
import { saveResults, loadResults, clearResults } from "./services/storageService";

const LOGO_URI = "https://jequandavis.wpcomstaging.com/wp-content/uploads/2026/03/1000055020-e1773637919503.png";

export default function App() {
  const [datasets, setDatasets] = useState<{ name: string, results: any[], predictedYDNA?: any, predictedMtDNA?: any }[]>([]);
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
  const [activeTab, setActiveTab] = useState<'autosomal' | 'ydna' | 'mtdna' | 'oracle'>('autosomal');
  const [activeCategory, setActiveCategory] = useState<string>('Health');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

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
    document.documentElement.classList.add('dark');
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

  const updateDatasets = (newDataset: { name: string, results: any[], predictedYDNA?: any, predictedMtDNA?: any }) => {
    const newDatasets = [...datasets, newDataset];
    setDatasets(newDatasets);
    saveResults(newDatasets);
    setActiveDatasetIndex(newDatasets.length - 1);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
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
        const { snpMap, mtMap } = parseRawDNA(text);
        updateDatasets({ 
          name: file.name, 
          results: matchSNPs(snpMap),
          predictedYDNA: predictYDNAHaplogroup(snpMap),
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
              <span className="font-light text-slate-400">GENOTYPE</span> SCOUT
            </h1>
            <div className="flex flex-wrap gap-2 sm:gap-4 font-mono text-[10px] sm:text-xs">
              <a href="https://www.facebook.com/share/g/1H4NqczNgK/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-600">Facebook Group</a>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <a href="https://jequandavis.wordpress.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-600">Blog</a>
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
          <div className="text-xl font-bold text-sky-800 dark:text-sky-200 mb-2">Processing your DNA file...</div>
          <div className="text-sky-600 dark:text-sky-400 text-sm font-mono">Please wait while we analyze your markers</div>
        </div>
      )}

      {!results && !processing && (
        <div
          className={`border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-16 text-center cursor-pointer bg-white/50 dark:bg-slate-800/50 transition-all ${dragging ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20" : "hover:border-sky-500"}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); }}
        >
          <input ref={fileRef} type="file" className="hidden" accept=".csv,.txt" onChange={(e) => e.target.files && processFile(e.target.files[0])} />
          <div className="text-5xl mb-4">🧬</div>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Drop your raw DNA file (CSV/TXT) here</div>
          <div className="text-slate-500 dark:text-slate-400 text-sm font-mono">or click to browse · analysis runs entirely in your browser</div>
        </div>
      )}
      {results && (
        <div className="space-y-8">
          {datasets.length > 1 && (
            <div className="flex gap-2 mb-4">
              {datasets.map((d, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${activeDatasetIndex === i ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
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
                  className={`px-4 py-2 rounded-full text-sm font-bold ${statusFilter === status ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
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
              className={`px-6 py-3 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'autosomal' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              onClick={() => setActiveTab('autosomal')}
            >
              🧬 Autosomal DNA
            </button>
            <button 
              className={`px-6 py-3 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'oracle' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              onClick={() => setActiveTab('oracle')}
            >
              🔮 Ancestry Oracle
            </button>
            <button 
              className={`px-6 py-3 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'ydna' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              onClick={() => setActiveTab('ydna')}
            >
              👨 Y-DNA Paternal Lineage
            </button>
            <button 
              className={`px-6 py-3 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'mtdna' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              onClick={() => setActiveTab('mtdna')}
            >
              👩 mtDNA Maternal Lineage
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
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {availableCategories.map(category => {
                    const catMeta = CATEGORY_META[category as keyof typeof CATEGORY_META] || { color: "#0284c7", icon: "🌐" };
                    const isActive = currentCat === category;
                    return (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${isActive ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700' : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        style={isActive ? { color: catMeta.color } : {}}
                      >
                        <span className="text-lg">{catMeta.icon}</span>
                        <span>{category}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${isActive ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'bg-slate-200/50 dark:bg-slate-800 text-slate-400'}`}>
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
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{total} marker{total !== 1 ? "s" : ""} analyzed</p>
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
                      <div key={`${snp.markerId}-${snp.continent}`} className="trait-card rounded-xl p-6 border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 shadow-sm">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="font-mono text-xs text-sky-600 dark:text-sky-400 font-bold">{snp.rsid}</div>
                            <div className="font-bold text-slate-800 dark:text-slate-100 text-lg">{snp.trait}</div>
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
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{snp.description}</p>
                        {snp.status !== 'not_tested' && expandedSnps.has(snp.rsid) && (
                          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 grid grid-cols-[auto,1fr] gap-x-6 gap-y-2 items-start border border-slate-100 dark:border-slate-800">
                            <div className="font-mono text-[10px] text-slate-400 uppercase pt-1 font-bold">Genotype</div>
                            <div className="font-mono text-xl font-bold text-slate-800 dark:text-slate-100 tracking-widest">{snp.userGenotype}</div>
                            <div className="font-mono text-[10px] text-slate-400 uppercase pt-1 font-bold">What this means for you</div>
                            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
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
          {activeTab === 'oracle' && (
            <div className="mt-12 p-6 border-2 border-indigo-200 dark:border-indigo-800/50 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl">🔮</span>
                <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-300">Ancestry Oracle Prediction</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Analysis Result</span>
              </div>
              <p className="text-sm text-indigo-700 dark:text-indigo-400 mb-6">
                Based on your matched autosomal markers, your predicted Y-DNA haplogroup, and your predicted mtDNA haplogroup, here is a high-level estimate of your ancestral origins.
              </p>
              
              {(() => {
                const ancestrySnps = datasets[activeDatasetIndex].results.filter(r => r.category === 'Ancestry');
                const oracle = calculateAncestryOracle(ancestrySnps, datasets[activeDatasetIndex].predictedYDNA, datasets[activeDatasetIndex].predictedMtDNA);
                
                if (oracle.continents.length === 0) {
                  return (
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 text-center">
                      Not enough data to generate an ancestry prediction.
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-8">
                    <div className="space-y-4 bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                      <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-4">Continental Admixture</h3>
                      {oracle.continents.map((result, idx) => {
                        const meta = CONTINENT_META[result.continent as keyof typeof CONTINENT_META] || { color: '#94a3b8', icon: '🌍' };
                        return (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-10 text-center text-2xl">{meta.icon}</div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-base font-bold text-slate-700 dark:text-slate-200">{result.continent}</span>
                                <span className="text-base font-mono font-bold text-slate-600 dark:text-slate-400">{result.percentage.toFixed(1)}%</span>
                              </div>
                              <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all duration-1000" 
                                  style={{ width: `${result.percentage}%`, backgroundColor: meta.color }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {Object.keys(oracle.subPopulations).length > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2">
                          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Sub-Population Affinity</h3>
                          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(oracle.subPopulations).map(([continent, pops], idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-lg">{CONTINENT_META[continent as keyof typeof CONTINENT_META]?.icon || '📍'}</span>
                                <h4 className="font-bold text-slate-800 dark:text-slate-200">{continent} Sub-groups</h4>
                              </div>
                              <div className="space-y-3">
                                {pops.map((pop, pidx) => (
                                  <div key={pidx}>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="text-slate-600 dark:text-slate-400 font-medium">{pop.name}</span>
                                      <span className="text-slate-500 font-mono">{pop.percentage.toFixed(1)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-indigo-500 rounded-full" 
                                        style={{ width: `${pop.percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === 'ydna' && (
            <div className="mt-12 p-6 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl">🧪</span>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Y-DNA Paternal Lineage Prediction</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-600 dark:text-sky-400 uppercase tracking-wider">Analysis Result</span>
              </div>
              {datasets[activeDatasetIndex].predictedYDNA?.predicted ? (
                <div className="animate-fade-up">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 shrink-0 rounded-full bg-sky-600 flex items-center justify-center text-white text-sm sm:text-base font-bold text-center px-1 break-all leading-tight shadow-md">
                      {datasets[activeDatasetIndex].predictedYDNA.predicted.name}
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 font-mono uppercase tracking-tighter">Predicted Haplogroup</div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">Haplogroup {datasets[activeDatasetIndex].predictedYDNA.predicted.name}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {datasets[activeDatasetIndex].predictedYDNA.predicted.description && (
                      <span className="font-medium text-slate-700 dark:text-slate-200">{datasets[activeDatasetIndex].predictedYDNA.predicted.description} </span>
                    )}
                    This prediction is based on the presence of specific defining markers (SNPs) found on your Y-chromosome.
                  </p>
                  
                  {datasets[activeDatasetIndex].predictedYDNA.testedMarkers && datasets[activeDatasetIndex].predictedYDNA.testedMarkers.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        Tested Y-DNA Markers
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {[...datasets[activeDatasetIndex].predictedYDNA.testedMarkers].sort((a: any, b: any) => a.marker.localeCompare(b.marker)).map((marker: any, idx: number) => (
                          <div key={idx} className={`p-3 rounded-lg border text-xs shadow-sm transition-colors ${marker.isDerived ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50' : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>
                            <div className="flex justify-between items-start mb-1">
                              <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">{marker.marker}</div>
                              {marker.isDerived ? (
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">Derived (+)</span>
                              ) : (
                                <span className="text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">Ancestral (-)</span>
                              )}
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 mb-2 line-clamp-2" title={marker.trait}>{marker.trait}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 text-[10px] uppercase tracking-wider">Genotype:</span>
                              <span className="font-mono bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-bold">{marker.genotype}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 p-3 bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-800/30 rounded-lg text-xs text-sky-700 dark:text-sky-300 flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                    <p>Y-DNA is only present in biological males. If you are female, this result may reflect a paternal relative's data if you uploaded their file, or it may be inconclusive.</p>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-up">
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-5 mb-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                      <div>
                        <h3 className="text-amber-800 dark:text-amber-400 font-bold mb-2 text-base">No Y-DNA Haplogroup Predicted</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed mb-3">
                          We couldn't confidently predict a Y-DNA haplogroup from your data. This usually happens for one of two reasons:
                        </p>
                        <ul className="list-disc list-inside text-sm text-amber-700 dark:text-amber-300 space-y-1.5 ml-1">
                          <li><strong>Biological Sex:</strong> Y-DNA is only present in biological males. If you are female, your DNA file will not contain these markers.</li>
                          <li><strong>Testing Chip:</strong> The specific DNA testing service you used may not have tested the defining Y-chromosome markers we look for.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {datasets[activeDatasetIndex].predictedYDNA?.testedMarkers && datasets[activeDatasetIndex].predictedYDNA.testedMarkers.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        Tested Y-DNA Markers (No Derived Found)
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {[...datasets[activeDatasetIndex].predictedYDNA.testedMarkers].sort((a: any, b: any) => a.marker.localeCompare(b.marker)).map((marker: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-lg border text-xs bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                            <div className="flex justify-between items-start mb-1">
                              <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">{marker.marker}</div>
                              <span className="text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">Ancestral (-)</span>
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 mb-2 line-clamp-2" title={marker.trait}>{marker.trait}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 text-[10px] uppercase tracking-wider">Genotype:</span>
                              <span className="font-mono bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-bold">{marker.genotype}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'mtdna' && (
            <div className="mt-12 p-6 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl">🧬</span>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">mtDNA Maternal Lineage Prediction</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wider">Analysis Result</span>
              </div>
              {datasets[activeDatasetIndex].predictedMtDNA?.predicted ? (
                <div className="animate-fade-up">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 shrink-0 rounded-full bg-fuchsia-600 flex items-center justify-center text-white text-sm sm:text-base font-bold text-center px-1 break-all leading-tight shadow-md">
                      {datasets[activeDatasetIndex].predictedMtDNA.predicted.replace('Haplogroup ', '')}
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 font-mono uppercase tracking-tighter">Predicted Haplogroup</div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{datasets[activeDatasetIndex].predictedMtDNA.predicted}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    This prediction is based on the presence of specific defining mutations found in your mitochondrial DNA.
                  </p>

                  {datasets[activeDatasetIndex].predictedMtDNA.path && datasets[activeDatasetIndex].predictedMtDNA.path.length > 1 && (
                    <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fuchsia-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        Haplogroup Path
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        {datasets[activeDatasetIndex].predictedMtDNA.path.map((node: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${idx === datasets[activeDatasetIndex].predictedMtDNA.path.length - 1 ? 'bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-200 dark:border-fuchsia-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                              {node.replace('Haplogroup ', '')}
                            </span>
                            {idx < datasets[activeDatasetIndex].predictedMtDNA.path.length - 1 && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {datasets[activeDatasetIndex].predictedMtDNA.testedMarkers && datasets[activeDatasetIndex].predictedMtDNA.testedMarkers.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fuchsia-500"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        Tested mtDNA Mutations
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {[...datasets[activeDatasetIndex].predictedMtDNA.testedMarkers].sort((a: any, b: any) => parseInt(a.pos) - parseInt(b.pos)).map((marker: any, idx: number) => (
                          <div key={idx} className={`p-3 rounded-lg border text-xs shadow-sm transition-colors ${marker.status === 'derived' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50' : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>
                            <div className="flex justify-between items-start mb-1">
                              <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">{marker.mutation}</div>
                              {marker.status === 'derived' ? (
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">Derived (+)</span>
                              ) : (
                                <span className="text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">Ancestral (-)</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-slate-400 text-[10px] uppercase tracking-wider">Position:</span>
                              <span className="font-mono bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-bold">{marker.pos}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="animate-fade-up">
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-5 mb-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                      <div>
                        <h3 className="text-amber-800 dark:text-amber-400 font-bold mb-2 text-base">No mtDNA Haplogroup Predicted</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed mb-3">
                          We couldn't confidently predict an mtDNA haplogroup from your data. This usually happens because the specific DNA testing service you used may not have tested the defining mitochondrial markers we look for.
                        </p>
                      </div>
                    </div>
                  </div>
                  {datasets[activeDatasetIndex].predictedMtDNA?.testedMarkers && datasets[activeDatasetIndex].predictedMtDNA.testedMarkers.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        Tested mtDNA Mutations (No Derived Found)
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {[...datasets[activeDatasetIndex].predictedMtDNA.testedMarkers].sort((a: any, b: any) => parseInt(a.pos) - parseInt(b.pos)).map((marker: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-lg border text-xs bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                            <div className="flex justify-between items-start mb-1">
                              <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">{marker.mutation}</div>
                              <span className="text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">Ancestral (-)</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-slate-400 text-[10px] uppercase tracking-wider">Position:</span>
                              <span className="font-mono bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-bold">{marker.pos}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
