import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Printer, Stethoscope, Dna, Settings2, Download } from 'lucide-react';

export interface ExportConfig {
  reportType: 'medical' | 'genetic';
  filters: {
    highImpactOnly: boolean;
    includeFullTable: boolean;
  };
}

interface ExportModuleProps {
  onGenerateReport: (config: ExportConfig) => void;
  datasetName: string;
}

export const ExportModule: React.FC<ExportModuleProps> = ({ onGenerateReport, datasetName }) => {
  const [reportType, setReportType] = useState<'medical' | 'genetic'>('medical');
  const [highImpactOnly, setHighImpactOnly] = useState(true);
  const [includeFullTable, setIncludeFullTable] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Printer className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Export & Reports</h2>
            <p className="text-slate-500">Generate high-quality PDF reports for {datasetName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Medical Report Selection */}
          <div 
            onClick={() => setReportType('medical')}
            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${
              reportType === 'medical' 
                ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/10' 
                : 'border-slate-200 dark:border-slate-800 hover:border-rose-300'
            }`}
          >
            <Stethoscope className={`w-8 h-8 mb-4 ${reportType === 'medical' ? 'text-rose-500' : 'text-slate-400'}`} />
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">Medical & Health</h3>
            <p className="text-sm text-slate-500 mb-4">
              Export clinical Pharmacogenomics (PGx), high-impact carrier status, Polygenic Risk Scores (PRS), and wellness traits.
            </p>
          </div>

          {/* Genetic Report Selection */}
          <div 
            onClick={() => setReportType('genetic')}
            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${
              reportType === 'genetic' 
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/10' 
                : 'border-slate-200 dark:border-slate-800 hover:border-teal-300'
            }`}
          >
            <Dna className={`w-8 h-8 mb-4 ${reportType === 'genetic' ? 'text-teal-500' : 'text-slate-400'}`} />
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">Ancestry & Genetic</h3>
            <p className="text-sm text-slate-500 mb-4">
              Export ancient DNA matches, haplogroups, admixture composition, and multi-kit kinship matching results.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-widest text-xs">
            <Settings2 className="w-4 h-4" />
            Report Configuration
          </div>
          
          <div className="space-y-4">
            {reportType === 'medical' && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={highImpactOnly} 
                  onChange={(e) => setHighImpactOnly(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">Filter High-Impact Only</div>
                  <div className="text-xs text-slate-500">Only include traits marked as Pathogenic, Moderate or High Risk. Excludes Benign and common traits.</div>
                </div>
              </label>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={includeFullTable} 
                onChange={(e) => setIncludeFullTable(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
              />
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">Include Raw Data Table</div>
                <div className="text-xs text-slate-500">Append a table of the underlying parsed SNPs at the end of the report (may generate a very long PDF).</div>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => onGenerateReport({ reportType, filters: { highImpactOnly, includeFullTable } })}
            className="flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform"
          >
            <Download className="w-5 h-5" />
            Generate PDF
          </button>
        </div>

      </div>
    </div>
  );
};
