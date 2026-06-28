import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Shield, Zap, Lock, Database, Dna, ArrowRight, Info, FileText, Smartphone, Globe, CheckCircle } from 'lucide-react';

interface HeroUploadProps {
  onFiles: (files: FileList) => void;
  processing: boolean;
  onReset: () => void;
}

type TabType = 'privacy' | 'scope' | 'install';

const HeroUpload: React.FC<HeroUploadProps> = ({ onFiles, processing, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('privacy');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
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
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
      onFiles(e.target.files);
    }
  };

  const handleClearCache = () => {
    if (window.confirm("This will clear all saved genomic data and force a reload. Continue?")) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for(let registration of registrations) { registration.unregister(); }
        });
      }
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach(name => caches.delete(name));
        });
      }
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-up relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-teal-500/10 to-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full relative z-10"
      >
        {/* Curated Reference Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-teal-600 dark:text-teal-300 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-8 ring-1 ring-teal-500/20 shadow-sm animate-pulse-soft">
          <Database className="w-3.5 h-3.5" /> 17,000+ Phased Genomic Markers Active
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-slate-800 dark:text-slate-100 mb-6 leading-[1.1] text-gradient">
          Decrypt Your DNA <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500 dark:from-teal-400 dark:to-emerald-400">100% Privately.</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Upload raw autosomal data. Genotype Scout decodes your genetic composition <span className="text-slate-800 dark:text-slate-200 font-bold underline decoration-teal-400 decoration-2 underline-offset-4">entirely inside your browser</span>.
        </p>

        {/* Drag & Drop Zone */}
        <motion.div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`relative max-w-2xl mx-auto mb-12 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden ${
            isDragActive 
              ? 'border-teal-500 bg-teal-500/5 dark:bg-teal-950/20 shadow-[0_0_30px_rgba(20,184,166,0.15)] scale-[1.02]' 
              : 'border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md hover:border-teal-400 hover:shadow-lg dark:hover:bg-slate-900/50 shadow-sm'
          }`}
        >
          {/* Animated corner decorations */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-300 dark:border-slate-700 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-300 dark:border-slate-700 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-300 dark:border-slate-700 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-300 dark:border-slate-700 rounded-br-sm pointer-events-none" />

          <div className="flex flex-col items-center justify-center py-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
              isDragActive ? 'bg-teal-500 text-white rotate-12 scale-110 shadow-lg shadow-teal-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}>
              <Upload className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-2">
              Drag and drop your DNA file here
            </h3>
            
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-6 max-w-sm">
              Supports <strong className="text-slate-600 dark:text-slate-300 font-semibold">.txt, .csv, or .zip</strong> raw datasets
            </p>
            
            <span className="px-6 py-3 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-black rounded-full text-xs uppercase tracking-widest transition-all shadow-md">
              Select File Manually
            </span>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            className="hidden" 
            accept=".txt,.csv,.zip"
          />
        </motion.div>

        {/* Decluttered Interactive Info Panel */}
        <div className="max-w-3xl mx-auto mt-16 bg-white/40 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/80 backdrop-blur-md rounded-[2.5rem] p-6 sm:p-8 shadow-xl text-left">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200/50 dark:border-slate-850 pb-4 mb-6 overflow-x-auto gap-2">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'privacy' 
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              🛡️ Privacy Sandbox
            </button>
            <button
              onClick={() => setActiveTab('scope')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'scope' 
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              🌍 Reference Scope
            </button>
            <button
              onClick={() => setActiveTab('install')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'install' 
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              📱 PWA Offline Setup
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="min-h-[220px]">
            <AnimatePresence mode="wait">
              {activeTab === 'privacy' && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5 text-teal-500">
                        <Shield className="w-4 h-4" /> Local Compute
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                        Uses browser-native FileReader API to parse files directly inside sandboxed RAM. Processing runs in an isolated thread worker.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5 text-emerald-500">
                        <Database className="w-4 h-4" /> Client Database
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                        Optional saving of results uses standard browser IndexedDB storage, protected by local origin sandboxing on your drive.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5 text-indigo-500">
                        <Lock className="w-4 h-4" /> Open Verification
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                        Open developer console (F12) Network Tab prior to drop. Verifiable zero byte server calls confirm absolute offline design.
                      </p>
                    </div>
                  </div>

                  {/* Flow pipeline */}
                  <div className="p-4 bg-slate-100/40 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" /> <span className="font-mono text-slate-650 dark:text-slate-300">RAW_DNA.txt</span>
                    </div>
                    <ArrowRight size={14} className="text-slate-350 dark:text-slate-650 rotate-90 sm:rotate-0" />
                    <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold">
                      <Dna className="w-4 h-4 animate-pulse-soft" /> Web Worker Sandbox
                    </div>
                    <ArrowRight size={14} className="text-slate-350 dark:text-slate-650 rotate-90 sm:rotate-0" />
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                      <Database className="w-4 h-4" /> Local IndexedDB Storage
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'scope' && (
                <motion.div
                  key="scope"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5 text-teal-500">
                        🌍 Global Reference Panels
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                        Matches your raw genetics against reference panels optimized to isolate distinct Native American subclades and broad global components.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5 text-indigo-500">
                        ⚡ Admixture Deconvolution
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                        Implements mathematical deconvolution matrices to distinguish sub-regional African, European, Asian, and indigenous populations.
                      </p>
                    </div>
                  </div>

                  {/* Provider List */}
                  <div className="p-4 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl text-center">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">
                      Optimized for industry standard exports
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-bold">
                      <span className="font-mono">23andMe</span>
                      <span>AncestryDNA</span>
                      <span>MyHeritage</span>
                      <span className="font-mono">FamilyTreeDNA</span>
                    </div>
                  </div>

                  {/* Research Disclosure */}
                  <div className="rounded-2xl border border-amber-200/60 dark:border-amber-900/30 bg-amber-50/40 dark:bg-amber-950/10 backdrop-blur-sm p-4 flex items-start gap-3">
                    <Info className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
                        Research &amp; Educational Tool Disclosure
                      </h4>
                      <p className="text-xs text-slate-650 dark:text-slate-405 leading-relaxed">
                        Genotype Scout is a browser-based analysis sandbox. It is not a commercial consumer ethnicity calculator, and its statistical alignments represent likelihood models for educational study. No data ever leaves your device.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'install' && (
                <motion.div
                  key="install"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                        <span className="text-base">🍏</span> iOS Safari Setup
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                        Open in <strong>Safari</strong>, tap the <strong>Share</strong> button at the bottom, and select <strong>"Add to Home Screen"</strong> to install as an offline-ready application.
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                        <span className="text-base">🤖</span> Android Chrome Setup
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-455 leading-relaxed">
                        Open in <strong>Chrome</strong>, tap the <strong>Menu (⋮)</strong> icon at the top right, and select <strong>"Add to Home screen"</strong> to install as an offline-ready application.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Subtle Cache Clear Button */}
        <div className="mt-16 text-center">
          <button
            onClick={handleClearCache}
            className="px-4 py-2 text-[10px] text-slate-400 dark:text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all rounded-full font-bold uppercase tracking-wider border border-transparent hover:border-rose-500/20"
          >
            Clear Local Cache &amp; Reset System
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroUpload;
