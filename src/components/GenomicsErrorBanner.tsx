/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';
import { formatDiagnosticTelemetry } from '../services/errorCaller';

export interface GenomicsErrorBannerProps {
  error: any;
  variant?: 'card' | 'bar';
  onDismiss: () => void;
}

export const GenomicsErrorBanner: React.FC<GenomicsErrorBannerProps> = ({
  error,
  variant = 'card',
  onDismiss,
}) => {
  if (!error) return null;

  const isDetailed = typeof error === 'object' && error !== null;
  const errMsg = isDetailed ? (error.message || "An unexpected error occurred during processing.") : error;
  const details = isDetailed ? error.details : null;
  const category = isDetailed ? (details?.errorCategory || error.category || error.name || "Genomic Analysis Blocked") : "Process Aborted";
  const subsystem = isDetailed ? (error.subsystem || details?.subsystem) : undefined;
  const errorCode = (isDetailed && (error.code || details?.errorCode))
    ? (error.code || details?.errorCode)
    : 'ERR_UNKNOWN';

  const handleCopyTelemetry = () => {
    const telemetry = formatDiagnosticTelemetry(error);
    navigator.clipboard.writeText(telemetry);
    alert("Diagnostic telemetry report copied to clipboard!");
  };

  if (variant === 'bar') {
    return (
      <div className="fixed top-12 left-0 right-0 z-50 px-4 py-2.5 bg-rose-950/95 border-b border-rose-500/40 text-rose-200 text-xs font-semibold flex flex-wrap items-center justify-between gap-3 backdrop-blur-md shadow-lg animate-fade-in">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-amber-400 font-bold">⚠️</span>
          <span>{errMsg}</span>
          <span className="px-2 py-0.5 rounded bg-rose-900 border border-rose-700 font-mono text-[10px] text-rose-300">
            {errorCode}
          </span>
          {subsystem && (
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
              {subsystem}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyTelemetry}
            className="px-2.5 py-1 bg-rose-900/80 hover:bg-rose-800 text-rose-100 rounded text-[11px] font-bold border border-rose-600/50 transition-colors cursor-pointer"
            title="Copy full telemetry report to clipboard"
          >
            📋 Copy Telemetry
          </button>
          <button 
            onClick={onDismiss} 
            className="text-rose-300 hover:text-white px-2 py-1 rounded cursor-pointer" 
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className="mb-12 p-8 rounded-[2.5rem] bg-white border border-rose-100 shadow-xl shadow-rose-100/40 animate-fade-in relative overflow-hidden z-50 dark:bg-slate-900">
      {/* Visual border gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-pink-400 to-amber-400" />
      
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Decorative Amber Warning Circle */}
        <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 flex items-center justify-center shrink-0 w-14 h-14">
          <span className="text-2xl">⚠️</span>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900">
              {category}
            </span>
            {subsystem && (
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[9px] font-bold uppercase tracking-wider rounded-full border border-slate-200 dark:border-slate-700">
                SUBSYSTEM: {subsystem}
              </span>
            )}
            {details?.failedEngine && (
              <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-mono text-[9px] font-bold uppercase tracking-wider rounded-full border border-amber-200 dark:border-amber-800">
                ENGINE: {details.failedEngine}
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-extrabold text-slate-800 mb-2 dark:text-slate-200">
            Genomic Analysis Blocked
          </h3>
          
          <p className="text-slate-600 font-semibold text-sm leading-relaxed mb-6 dark:text-slate-400">
            {errMsg}
          </p>

          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 dark:bg-slate-800">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide dark:text-slate-400">Diagnostic Reference Code</div>
              <div className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span>{errorCode}</span>
                {details?.legacyCode && details.legacyCode !== errorCode && (
                  <span className="text-xs text-slate-400 font-normal">({details.legacyCode})</span>
                )}
              </div>
            </div>
            <button 
              onClick={handleCopyTelemetry}
              className="text-xs px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm font-bold text-slate-700 hover:text-slate-900 hover:border-slate-300 active:bg-slate-100 transition-colors dark:text-slate-200 dark:bg-slate-900 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              📋 Copy Diagnostic Telemetry
            </button>
          </div>

          {details?.suggestedSolution && (
            <div className="mb-6 p-5 bg-teal-50/50 rounded-2xl border border-teal-100/60 dark:bg-teal-950/20 dark:border-teal-900/40">
              <h4 className="text-teal-800 dark:text-teal-300 font-extrabold text-xs uppercase tracking-widest mb-1.5">
                🟢 Recommended Action:
              </h4>
              <p className="text-slate-700 text-xs font-semibold leading-relaxed dark:text-slate-300">
                {details.suggestedSolution}
              </p>
            </div>
          )}

          {/* Troubleshooting suggestions list */}
          <div className="mb-6">
            <h4 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-3 dark:text-slate-400">
              Troubleshooting Guidelines:
            </h4>
            <ul className="space-y-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="text-teal-500 shrink-0">📎</span>
                <span><strong>Format:</strong> Tab-delimited (.txt), comma-separated (.csv), or standard VCF (.vcf) raw genome file.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-teal-500 shrink-0">📎</span>
                <span><strong>Encoding:</strong> ASCII or UTF-8 plain text (unencrypted, without passwords).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-teal-500 shrink-0">📎</span>
                <span><strong>Content:</strong> Must contain standard SNP calls with valid rsIDs (e.g. <code>rs3094315</code>) and allele pairs.</span>
              </li>
            </ul>
          </div>

          {/* Collapsible Technical Diagnostics */}
          {isDetailed && (
            <details className="group border-t border-slate-100 pt-6 dark:border-slate-800">
              <summary className="list-none flex items-center justify-between text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer select-none">
                <span className="flex items-center gap-1.5">
                  ⚙️ Technical Telemetry Diagnostics Log
                </span>
                <span className="transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              
              <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/60 font-mono text-[11px] leading-relaxed text-slate-600 space-y-2 overflow-auto dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700">
                <div><strong className="text-slate-700 dark:text-slate-300">Error Code:</strong> {errorCode}</div>
                <div><strong className="text-slate-700 dark:text-slate-300">Subsystem:</strong> {subsystem || 'UNKNOWN'}</div>
                <div><strong className="text-slate-700 dark:text-slate-300">Error Category:</strong> {details?.errorCategory || category}</div>
                {details?.fileName && (
                  <div><strong className="text-slate-700 dark:text-slate-300">File Name:</strong> {details.fileName}</div>
                )}
                {details?.failedEngine && (
                  <div><strong className="text-slate-700 dark:text-slate-300">Failed Engine:</strong> <span className="text-rose-600 dark:text-rose-400">{details.failedEngine}</span></div>
                )}
                {details?.bytesTotal !== undefined && (
                  <div><strong className="text-slate-700 dark:text-slate-300">File Ingestion Size:</strong> {(details.bytesTotal / (1024 * 1024)).toFixed(2)} MB ({details.bytesTotal.toLocaleString()} bytes)</div>
                )}
                {details?.linesTotal !== undefined && (
                  <div><strong className="text-slate-700 dark:text-slate-300">Total Rows Read:</strong> {details.linesTotal.toLocaleString()}</div>
                )}
                {details?.linesCommented !== undefined && (
                  <div><strong className="text-slate-700 dark:text-slate-300">Comment Headers Found:</strong> {details.linesCommented.toLocaleString()}</div>
                )}
                {details?.linesMalformed !== undefined && (
                  <div><strong className="text-slate-700 dark:text-slate-300">Malformed/Unrecognized Rows:</strong> {details.linesMalformed.toLocaleString()}</div>
                )}
                {details?.snpsParsed !== undefined && (
                  <div><strong className="text-slate-700 dark:text-slate-300">SNPs Matched:</strong> {details.snpsParsed.toLocaleString()}</div>
                )}
                {details?.headerPreview && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 mt-3">
                    <strong className="text-slate-700 dark:text-slate-300 block mb-1.5">Raw File Header Preview:</strong>
                    <pre className="p-3 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl overflow-x-auto select-all max-h-32 text-[10px] leading-normal font-mono">
                      {details.headerPreview}
                    </pre>
                  </div>
                )}
                {details?.stackTrace && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 mt-3">
                    <strong className="text-slate-700 dark:text-slate-300 block mb-1.5">Diagnostic Stack Trace:</strong>
                    <pre className="p-3 bg-slate-900 border border-slate-800 text-rose-300 rounded-xl overflow-x-auto select-all max-h-32 text-[10px] leading-normal font-mono">
                      {details.stackTrace}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>

        <button 
          onClick={onDismiss} 
          className="p-2 hover:bg-slate-100 active:bg-slate-200 rounded-full transition-all text-slate-400 hover:text-slate-600 self-end md:self-start md:mt-2 cursor-pointer dark:hover:bg-slate-800"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
