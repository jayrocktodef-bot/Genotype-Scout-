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
import { parseRawDNA, matchSNPs, groupByCategory, CATEGORY_META, SIG_COLOR } from "./genotypeData";
import { saveResults, loadResults, clearResults } from "./services/storageService";

const LOGO_URI = "https://jequandavis.wpcomstaging.com/wp-content/uploads/2026/03/1000055020-e1773637919503.png";

export default function App() {
  const [datasets, setDatasets] = useState<{ name: string, results: any[] }[]>([]);
  const [activeDatasetIndex, setActiveDatasetIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'matched' | 'unmatched' | 'not_tested'>('matched');
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [darkMode, setDarkMode] = useState(false);
  const [expandedSnps, setExpandedSnps] = useState<Set<string>>(new Set());

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

  const updateDatasets = (newDataset: { name: string, results: any[] }) => {
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

  const processFile = useCallback((file: File) => {
    setProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => {
        const text = e.target?.result as string;
        const { snpMap } = parseRawDNA(text);
        updateDatasets({ name: file.name, results: matchSNPs(snpMap) });
        setProcessing(false);
      }, 100);
    };
    reader.readAsText(file);
  }, [datasets]);

  const results = datasets.length > 0 ? datasets[activeDatasetIndex].results : null;

  const filteredResults = results ? results.filter(r => r.status === statusFilter) : [];

  return (
    <div className="app-container max-w-4xl mx-auto p-6">
      <header className="flex items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <img className="w-20 h-20 rounded-full border-2 border-slate-200" src={LOGO_URI} alt="Logo" />
          <div>
            <div className="text-sky-600 text-xs tracking-widest uppercase font-bold mb-1">DNA Ancestry & Trait Analyzer</div>
            <h1 className="text-4xl tracking-tighter mb-2">GENOTYPE SCOUT</h1>
            <div className="flex gap-4 font-mono text-xs">
              <a href="https://www.facebook.com/share/g/1H4NqczNgK/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-600">Facebook Group</a>
              <span className="text-slate-300">|</span>
              <a href="https://jequandavis.wordpress.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-600">Blog</a>
            </div>
          </div>
        </div>
        <button onClick={toggleDarkMode} className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
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
          <div className="flex gap-4 mb-4 justify-between">
            <div className="flex gap-4">
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
            <div className="flex gap-2">
              <button onClick={exportJSON} className="px-4 py-2 rounded-full text-sm font-bold bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900">
                Export JSON
              </button>
              <button onClick={exportPDF} className="px-4 py-2 rounded-full text-sm font-bold bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900">
                Export PDF
              </button>
            </div>
          </div>
          {Object.entries(groupByCategory(results || [])).map(([category, allSnpsInCategory]) => {
            const meta = CATEGORY_META[category as keyof typeof CATEGORY_META] || { color: "#0284c7", icon: "🌐" };
            const filteredSnps = allSnpsInCategory.filter(snp => snp.status === statusFilter);
            
            const total = allSnpsInCategory.length;
            const matchedCount = allSnpsInCategory.filter(s => s.status === 'matched').length;
            const unmatchedCount = allSnpsInCategory.filter(s => s.status === 'unmatched').length;
            const notTestedCount = allSnpsInCategory.filter(s => s.status === 'not_tested').length;

            const CustomTooltip = ({ active, payload }: any) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-800 p-2 rounded text-xs text-white shadow-lg">
                    {payload.map((entry: any) => (
                      <p key={entry.dataKey}>
                        {entry.name}: {entry.value} ({((entry.value / total) * 100).toFixed(1)}%)
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            };

            return (
              <div key={category} className="animate-fade-up">
                <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xl">{meta.icon}</span>
                  <span className="text-lg font-bold" style={{ color: meta.color }}>{category}</span>
                  <div className="h-10 w-32 ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={[{ matched: matchedCount, unmatched: unmatchedCount, notTested: notTestedCount }]} stackOffset="expand">
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip cursor={false} content={<CustomTooltip />} />
                        <Bar dataKey="matched" name="Matched" stackId="a" fill="#10b981" />
                        <Bar dataKey="unmatched" name="Unmatched" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="notTested" name="Not Tested" stackId="a" fill="#cbd5e1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <span className="font-mono text-xs text-slate-400 ml-auto">{filteredSnps.length} marker{filteredSnps.length !== 1 ? "s" : ""}</span>
                </div>
                {filteredSnps.map((snp: any) => (
                  <div key={snp.rsid} className="trait-card rounded-xl p-6 mb-4">
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
                    {snp.status === 'matched' && expandedSnps.has(snp.rsid) && (
                      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 grid grid-cols-[auto,1fr] gap-x-6 gap-y-2 items-start border border-slate-100 dark:border-slate-800">
                        <div className="font-mono text-[10px] text-slate-400 uppercase pt-1 font-bold">Genotype</div>
                        <div className="font-mono text-xl font-bold text-slate-800 dark:text-slate-100 tracking-widest">{snp.userGenotype}</div>
                        <div className="font-mono text-[10px] text-slate-400 uppercase pt-1 font-bold">Interpretation</div>
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
            );
          })}
        </div>
      )}
    </div>
  );
}
