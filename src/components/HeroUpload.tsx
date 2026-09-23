import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, ShieldCheck, Database, Lock, Dna, 
  Check, RefreshCw, Layers, Cpu, WifiOff, 
  FlaskConical, ExternalLink, FileSpreadsheet,
  CheckCircle2, ArrowRight, ShieldAlert, Sparkles,
  Scale, AlertTriangle, Landmark, RotateCcw, Trash2
} from 'lucide-react';
import { forceResetAndClearCache } from '../utils/cacheManager';

interface HeroUploadProps {
  onFiles: (files: FileList | File[]) => void;
  processing: boolean;
  onReset: () => void;
}

type TabType = 'privacy' | 'compatibility' | 'offline' | 'advisory';

export const HeroUpload: React.FC<HeroUploadProps> = ({ onFiles, processing, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('privacy');
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      if (!isDragActive) setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFileName(file.name);
      onFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      onFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleZoneClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
      }
    }
  };

  const handleLoadDemoSpecimen = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoadingDemo) return;

    try {
      setIsLoadingDemo(true);
      const response = await fetch('/samples/Iberian_Portuguese_hu33FC53.txt');
      if (!response.ok) throw new Error('Benchmark specimen file not found');
      const blob = await response.blob();
      const file = new File([blob], 'Iberian_Portuguese_hu33FC53.txt', { type: 'text/plain' });
      setSelectedFileName(file.name);
      onFiles([file]);
    } catch (err) {
      console.error('Could not load benchmark specimen:', err);
    } finally {
      setIsLoadingDemo(false);
    }
  };

  const handleClearCache = async () => {
    if (isClearingCache) return;
    const confirmed = window.confirm(
      "NUCLEAR CACHE RESET & FRESH INSTALL\n\n" +
      "This action will completely reset your client workspace:\n" +
      "• Terminate active workers and unregister all Service Workers\n" +
      "• Delete all IndexedDB genome databases and caches\n" +
      "• Purge all CacheStorage assets and offline bundles\n" +
      "• Flush localStorage, sessionStorage, and cookies\n" +
      "• Cache-bust and reload the application into a 100% clean state\n\n" +
      "Your original DNA files on your computer/device remain completely safe and untouched.\n\n" +
      "Proceed with fresh install reset?"
    );

    if (confirmed) {
      try {
        setIsClearingCache(true);
        await forceResetAndClearCache(true);
      } catch (err) {
        console.error('Failed to perform fresh install reset:', err);
        setIsClearingCache(false);
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-start py-6 sm:py-10 px-4 sm:px-6 relative overflow-hidden bg-[#09090b] text-zinc-100">
      {/* Subtle Background Radial Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-teal-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        className="hidden" 
        accept="*"
        multiple
      />

      <div className="max-w-5xl w-full relative z-10 space-y-8">
        
        {/* =========================================================================
            1. INSTITUTIONAL BRAND HEADER & CREDENTIALS
            ========================================================================= */}
        <div className="text-center space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-mono tracking-wider shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="font-semibold text-zinc-200">WRITTEN IN THE GENOME</span>
            <span className="text-zinc-500">•</span>
            <span className="text-amber-400 font-bold">GENOTYPE SCOUT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Evidence-Led Computational Genomics <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-teal-300 bg-clip-text text-transparent">
              100% In-Browser & Air-Gapped.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Mount your raw DNA file directly into your device's memory. Genotype Scout processes population admixture, ancestral haplogroups, and clinical variants locally with <strong className="text-zinc-200">zero server uploads</strong> and <strong className="text-zinc-200">zero remote telemetry</strong>.
          </p>

          {/* Privacy & Standard Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Zero-Footprint Privacy</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono">
              <Cpu className="w-3.5 h-3.5 text-zinc-400" />
              <span>Isolated RAM Worker</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono">
              <WifiOff className="w-3.5 h-3.5 text-zinc-400" />
              <span>Network Air-Gapped</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Research & Entertainment Use</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. PRIMARY CLINICAL INTAKE TRAY (DROPZONE)
            ========================================================================= */}
        <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
          
          {/* Intake Tray Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Dna className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-100 tracking-tight">Genomic Specimen Intake Tray</h2>
                <p className="text-xs text-zinc-400">Ready for raw microarray or sequencing ingestion</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SANDBOX READY
              </span>
              <span className="text-xs font-mono text-zinc-500 hidden sm:inline">v5.22.0</span>
            </div>
          </div>

          {/* Interactive Drop Surface */}
          <div
            role="button"
            tabIndex={0}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={handleZoneClick}
            onKeyDown={handleKeyDown}
            className={`relative p-8 sm:p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 text-center flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
              isDragActive
                ? 'border-teal-400 bg-teal-500/10 shadow-lg shadow-teal-500/10 scale-[1.005]'
                : 'border-zinc-700/80 bg-zinc-950/60 hover:border-teal-500/50 hover:bg-zinc-950/90 shadow-inner'
            }`}
          >
            {/* Intake Icon */}
            <div className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center border transition-all duration-200 ${
              isDragActive
                ? 'border-teal-400 bg-teal-500/20 text-teal-300 scale-110 shadow-md shadow-teal-500/20'
                : 'border-zinc-700/80 bg-zinc-800/60 text-zinc-300 group-hover:text-white'
            }`}>
              <Upload className="w-7 h-7" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight">
              Drag & drop raw DNA file here, or browse
            </h3>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
              Standard consumer microarrays &amp; Whole Genome Sequencing (up to 2GB+ files supported via streaming): <span className="font-mono text-zinc-300">.txt</span>, <span className="font-mono text-zinc-300">.csv</span>, <span className="font-mono text-zinc-300">.vcf</span>, <span className="font-mono text-zinc-300">.vcf.gz</span>, <span className="font-mono text-zinc-300">.zip</span>
            </p>

            {/* Clean Primary File Select Button */}
            <button
              type="button"
              onClick={handleZoneClick}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm transition-all shadow-md shadow-amber-500/10 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Select Raw DNA File</span>
            </button>

            {selectedFileName && (
              <div className="mt-5 px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                <span>Selected: <strong>{selectedFileName}</strong></span>
              </div>
            )}
          </div>

          {/* Supported Vendors Ribbon */}
          <div className="pt-2">
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mb-2.5 text-center sm:text-left">
              Compatible Microarray & Sequencing Providers:
            </div>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start text-xs font-medium">
              {['23andMe (v2–v5)', 'AncestryDNA (v1–v2)', 'MyHeritage', 'FamilyTreeDNA', 'LivingDNA', 'WGS (VCF 4.2+)', 'Dante / Nebula'].map((vendor) => (
                <span key={vendor} className="px-3 py-1 rounded-lg bg-zinc-800/60 border border-zinc-700/60 text-zinc-300 text-xs">
                  {vendor}
                </span>
              ))}
            </div>
          </div>

          {/* Superkit Maker Direct Callout for Multiple Kits */}
          <div className="pt-4 border-t border-teal-900/30 bg-gradient-to-r from-teal-950/30 via-zinc-900/60 to-teal-950/20 -mx-6 sm:-mx-8 px-6 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 shadow-sm shadow-teal-950/40">
                <Dna className="w-4 h-4 text-teal-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-zinc-100 tracking-tight">
                    Have multiple raw DNA files? (AncestryDNA + 23andMe + WGS)
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
                    Superkit Maker
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Merge multiple kits into an enriched master superkit at <span className="text-teal-300 font-mono">merge.writteninthegenome.blog</span>.
                </p>
              </div>
            </div>

            <a
              href="https://merge.writteninthegenome.blog"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 hover:text-teal-200 border border-teal-500/30 hover:border-teal-400/50 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0 whitespace-nowrap active:scale-95"
              title="Open Superkit Maker: Merge multiple raw DNA kits into one superkit"
            >
              <Dna className="w-3.5 h-3.5 text-teal-400" />
              <span>Launch Superkit Maker</span>
              <ExternalLink className="w-3 h-3 text-teal-400/80" />
            </a>
          </div>

          {/* Benchmark Demo Specimen Action */}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <FlaskConical className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Don't have your raw data handy? Explore with a verified public benchmark:</span>
            </div>

            <button
              type="button"
              onClick={handleLoadDemoSpecimen}
              disabled={isLoadingDemo || isClearingCache}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              title="Loads Portuguese reference sample hu33FC53 from the Personal Genome Project"
            >
              {isLoadingDemo ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Loading Specimen...</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Load Benchmark Specimen (hu33FC53)</span>
                </>
              )}
            </button>
          </div>

          {/* Prominent Nuclear Cache Reset & Fresh Install Action */}
          <div className="pt-4 border-t border-rose-950/40 bg-gradient-to-r from-rose-950/30 via-zinc-950/60 to-zinc-950/40 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 sm:p-5 rounded-b-3xl border-b border-rose-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-sm shadow-rose-950/50">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-100 tracking-tight">
                    Reset Workspace &amp; Fresh Install
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                    Nuclear Purge
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                  Experiencing worker timeouts or stale caching? Purges all IndexedDB genomes, stops workers, wipes CacheStorage, and forces a pristine clean reload.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearCache}
              disabled={isClearingCache}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-zinc-950 font-bold text-xs tracking-wide transition-all shadow-lg shadow-rose-950/50 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
              title="Clears all client-stored profiles, workers, and caches as if it was a fresh install"
            >
              {isClearingCache ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-950" />
                  <span>Purging Caches &amp; Workers...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5 text-zinc-950" />
                  <span>Clear All Caches &amp; Fresh Install</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* =========================================================================
            RESEARCH, ENTERTAINMENT & TRIBAL AFFILIATION ADVISORY
            ========================================================================= */}
        <div className="bg-gradient-to-br from-amber-950/25 via-zinc-900/90 to-zinc-950/90 border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-sm shadow-amber-500/10">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-amber-200 tracking-tight flex items-center gap-2">
                  <span>Advisory: Research & Entertainment Scope</span>
                </h3>
                <p className="text-xs text-zinc-400">Important limitations on ancestry estimates, geographic locations, and tribal affiliation</p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-300/90 self-start sm:self-auto shrink-0">
              NON-CLINICAL & NON-LEGAL
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-xs text-zinc-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
              <div className="font-bold text-amber-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <h4>Research & Educational Exploration Only</h4>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Genotype Scout is engineered exclusively for academic study, educational exploration, and personal recreational inquiry. It is not a clinical diagnostics suite, paternity test, medical device, or legally certified record of lineage.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
              <div className="font-bold text-amber-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <h4>No Direct Tribal or Locational Affiliation</h4>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                This application <strong className="text-zinc-100 font-semibold">cannot connect you directly to any Indigenous tribe, clan, band, or discrete geographic municipality</strong>. Commercial genetic markers measure statistical affinity with contemporary and archaeological reference panels, not citizenship, cultural identity, or specific town residency.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-3 text-xs text-zinc-400 leading-relaxed">
            <Landmark className="w-4 h-4 text-amber-400/90 shrink-0 mt-0.5" />
            <p className="text-[11px] sm:text-xs">
              <strong className="text-amber-200/90">Indigenous Sovereignty & Enrollment Notice:</strong> Tribal enrollment, citizenship, and political status are governed exclusively by sovereign Indigenous nations through documented lineal descent, family registries, and tribal law. Commercial autosomal DNA tests cannot serve as proof of tribal affiliation or establish legal indigenous heritage.
            </p>
          </div>
        </div>

        {/* =========================================================================
            3. EVIDENTIARY STANDARDS & TECHNICAL SPECIFICATIONS (TABS)
            ========================================================================= */}
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
          {/* Tab Selection Header */}
          <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-4">
            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-teal-500/15 border border-teal-500/40 text-teal-300 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privacy Guarantees</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('compatibility')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'compatibility'
                  ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Reference Frameworks</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('offline')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'offline'
                  ? 'bg-zinc-800 border border-zinc-700 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline PWA Execution</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('advisory')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'advisory'
                  ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Tribal & Research Scope</span>
            </button>
          </div>

          {/* Tab Content Panels */}
          <AnimatePresence mode="wait">
            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="grid md:grid-cols-3 gap-4 text-xs"
              >
                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-teal-400 font-bold">
                    <Cpu className="w-4 h-4" />
                    <h4>Web Worker RAM Sandbox</h4>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    Raw genotype bytes are parsed exclusively inside a dedicated Web Worker memory heap. Zero chunks are ever dispatched across the network.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-teal-400 font-bold">
                    <Database className="w-4 h-4" />
                    <h4>Origin-Bounded IndexedDB</h4>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    Calculated profiles are persisted only to local browser IndexedDB storage, protected by standard same-origin security boundaries.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-teal-400 font-bold">
                    <Lock className="w-4 h-4" />
                    <h4>Auditable Air-Gap</h4>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    You can inspect network traffic via Browser DevTools (F12) or disconnect your WiFi entirely before dropping your DNA file; processing proceeds unaffected.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'compatibility' && (
              <motion.div
                key="compatibility"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="space-y-4 text-xs"
              >
                <p className="text-zinc-300 leading-relaxed">
                  Genotype Scout incorporates curated academic reference standards across 17,042 validated Ancestry Informative Markers (AIMs):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
                  <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                    <span className="text-amber-400 font-bold block mb-1">K61 GLOBAL AIMs</span>
                    <span className="text-zinc-400 text-[11px] leading-tight block">
                      Phased across 1000G, HGDP & SGDP reference populations.
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                    <span className="text-teal-400 font-bold block mb-1">ISOGG & YFULL</span>
                    <span className="text-zinc-400 text-[11px] leading-tight block">
                      Hierarchical paternal phylogenetic branch determination.
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                    <span className="text-sky-400 font-bold block mb-1">PHYLOTREE MT</span>
                    <span className="text-zinc-400 text-[11px] leading-tight block">
                      Maternal mitochondrial haplogroup classification tree.
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                    <span className="text-purple-400 font-bold block mb-1">CPIC & PHARMGKB</span>
                    <span className="text-zinc-400 text-[11px] leading-tight block">
                      Clinical guideline annotations for pharmacogenomics (PGx).
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'offline' && (
              <motion.div
                key="offline"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="grid md:grid-cols-2 gap-4 text-xs"
              >
                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                  <h4 className="font-bold text-zinc-100 flex items-center gap-2">
                    <span>📱</span> iOS / Safari Setup
                  </h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Tap the <strong>Share</strong> button in Safari, then select <strong>"Add to Home Screen"</strong> for full-screen air-gapped execution without an internet connection.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                  <h4 className="font-bold text-zinc-100 flex items-center gap-2">
                    <span>💻</span> Chrome / Desktop Setup
                  </h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Click the <strong>Install</strong> icon in your address bar or browser menu to install Genotype Scout as a standalone desktop scientific workstation.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'advisory' && (
              <motion.div
                key="advisory"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="grid md:grid-cols-2 gap-4 text-xs"
              >
                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                  <h4 className="font-bold text-amber-300 flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    <span>Biological Markers vs. Political Status</span>
                  </h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Genetic markers reflect ancient population movements and statistical allele frequencies across continental clines. In contrast, tribal membership is a political and legal relationship between an individual and a sovereign tribal nation. DNA test results cannot establish citizenship, inheritance, or legal claims to tribal lands.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                  <h4 className="font-bold text-amber-300 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span>Reference Datasets as Statistical Proxies</span>
                  </h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Subpopulation oracle labels represent mathematical proxies based on publicly accessible academic cohorts (e.g., 1000 Genomes, HGDP, SGDP). High similarity scores indicate shared deep ancestry with the reference sample, never verified personal origin in a specific modern village, reservation, or municipality.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* =========================================================================
            4. CLIENT ENVIRONMENT TELEMETRY & STORAGE MANAGEMENT
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-3 text-zinc-400">
            <span className="flex items-center gap-1.5 text-teal-400">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span>Workers: Multithreaded</span>
            </span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="text-zinc-400">IndexedDB: Active</span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="text-zinc-400">Network Egress: 0 B</span>
          </div>

          <button
            type="button"
            onClick={handleClearCache}
            disabled={isClearingCache}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-[11px] font-semibold transition-all cursor-pointer"
            title="Clears all client-stored profiles, workers, and caches as a fresh install"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isClearingCache ? 'animate-spin' : ''}`} />
            <span>{isClearingCache ? 'Purging All Storage...' : 'Fresh Install / Nuclear Cache Reset'}</span>
          </button>
        </div>

        {/* Footer Reference Link */}
        <div className="text-center pt-2 pb-6">
          <a
            href="https://writteninthegenome.blog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <span>An open-source initiative of Written In The Genome</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};

export default HeroUpload;
