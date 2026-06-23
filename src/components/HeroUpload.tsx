import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Shield, Zap, Lock, Database, Dna, ArrowRight, Info, FileText, CheckCircle, HelpCircle } from 'lucide-react';

interface HeroUploadProps {
  onFiles: (files: FileList) => void;
  processing: boolean;
  onReset: () => void;
}

const HeroUpload: React.FC<HeroUploadProps> = ({ onFiles, processing, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

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
          Upload raw autosomal data from 23andMe, AncestryDNA, or MyHeritage. 
          Genotype Scout decodes your genetic composition <span className="text-slate-800 dark:text-slate-200 font-bold underline decoration-teal-400 decoration-2 underline-offset-4">entirely inside your browser</span>.
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
          className={`relative max-w-2xl mx-auto mb-8 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden ${
            isDragActive 
              ? 'border-teal-500 bg-teal-500/5 dark:bg-teal-950/20 shadow-[0_0_30px_rgba(20,184,166,0.15)] scale-[1.02]' 
              : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md hover:border-teal-400 hover:shadow-lg dark:hover:bg-slate-900/80 shadow-sm'
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

        {/* Action Buttons & Cache Controller */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button 
            onClick={() => {
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
            }}
            className="px-6 py-3 w-full sm:w-auto bg-rose-50 hover:bg-rose-100/80 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-full font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-rose-100 dark:border-rose-900/30 shadow-sm"
          >
            Clear Local Cache & Force Reload
          </button>
        </div>

        {/* PWA Installation Instructions */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-16">
          <div className="flex-1 p-5 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-left shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <span className="text-xl">🍏</span> iOS Installation
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Open in <strong className="text-slate-700 dark:text-slate-300">Safari</strong>, tap the <strong className="text-slate-700 dark:text-slate-300">Share</strong> button at the bottom, and select <strong className="text-slate-700 dark:text-slate-300">"Add to Home Screen"</strong> to install as an offline-ready app.
            </p>
          </div>
          <div className="flex-1 p-5 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-left shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <span className="text-xl">🤖</span> Android Installation
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Open in <strong className="text-slate-700 dark:text-slate-300">Chrome</strong>, tap the <strong className="text-slate-700 dark:text-slate-300">Menu (⋮)</strong> icon at the top right, and select <strong className="text-slate-700 dark:text-slate-300">"Add to Home screen"</strong> to install as an offline-ready app.
            </p>
          </div>
        </div>

        {/* Supported Providers Bar */}
        <div className="mb-20">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">
            Optimized for industry standard exports
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 dark:opacity-45">
            <span className="font-mono text-sm font-bold tracking-tight text-slate-700 dark:text-slate-300">23andMe</span>
            <span className="font-sans text-sm font-black tracking-tight text-slate-700 dark:text-slate-300">AncestryDNA</span>
            <span className="font-sans text-sm font-bold tracking-tight text-slate-700 dark:text-slate-300">MyHeritage</span>
            <span className="font-mono text-sm font-bold tracking-tight text-slate-700 dark:text-slate-300">FamilyTreeDNA</span>
          </div>
        </div>

        {/* Informational Scope Alert */}
        <div className="max-w-3xl mx-auto mb-20 rounded-[2rem] border border-amber-200/60 dark:border-amber-900/30 bg-amber-50/40 dark:bg-amber-950/20 backdrop-blur-sm p-6 text-left shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1.5 flex items-center gap-1.5">
                Research &amp; Educational Tool Disclosure
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Genotype Scout is a browser-based analysis sandbox. It is <strong className="text-slate-800 dark:text-slate-200 font-extrabold">not a commercial consumer ethnicity calculator</strong>, and its mathematical models are not directly comparable to commercial estimates. Findings represent statistical likelihood alignments for educational study. No data ever leaves your device.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left w-full mt-12">
          
          {/* Amerind Card */}
          <div className="p-8 premium-card md:col-span-2 relative overflow-hidden bg-gradient-to-br from-white via-white to-teal-50/5 dark:from-slate-900 dark:to-slate-900/90 border border-slate-100 dark:border-slate-800 hover:border-teal-500/30 dark:hover:border-teal-400/20 transition-all duration-300 shadow-md">
            <div className="absolute top-6 right-6">
              <span className="px-3 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-teal-500/20">
                Granular Referencing
              </span>
            </div>
            <div className="w-12 h-12 bg-teal-500/10 dark:bg-teal-950/60 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6 shadow-sm">
              <Dna className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-xl mb-3">Curated Amerind &amp; Distinct Global AIMs</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Equipped with a specialized panel of Ancestry Informative Markers (AIMs) optimized to isolate high-precision Native American (North, Central, and South American indigenous cohorts) components. Designed to distinguish sub-regional cohorts from broad continental overlaps.
            </p>
            <p className="text-xs text-teal-600 dark:text-teal-500 font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Resolves regional subclades, Mesoamerican ancestry, and First Nations markers.
            </p>
          </div>

          {/* Admixture Card */}
          <div className="p-8 premium-card md:col-span-2 relative overflow-hidden bg-gradient-to-br from-white via-white to-indigo-50/5 dark:from-slate-900 dark:to-slate-900/90 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 dark:hover:border-indigo-400/20 transition-all duration-300 shadow-md">
            <div className="w-12 h-12 bg-indigo-500/10 dark:bg-indigo-950/60 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 shadow-sm">
              <Dna className="w-6 h-6 animate-pulse-soft" />
            </div>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-xl mb-3">Deconvolving African American Admixture</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              African American ancestry is highly complex due to historical structural admixture. Genotype Scout implements deconvolution algorithms to distinguish West African, East African, European, and indigenous components through phased genomic window analysis.
            </p>
          </div>

          {/* Privacy Card */}
          <div className="p-8 premium-card hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-700 dark:text-slate-300 mb-6 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-lg mb-2">Zero-Footprint Sandbox</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Genotype Scout operates entirely locally in isolated RAM. Your files never cross the network. Once you close this browser tab, all session memory is permanently destroyed.
            </p>
          </div>
          
          {/* Math Model Card */}
          <div className="p-8 premium-card hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-700 dark:text-slate-300 mb-6 shadow-sm">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-lg mb-2">Bayesian Likelihood Models</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Using a robust 17,000+ marker reference database representing distinct global sub-populations to execute statistical regional deconvolution and likelihood scoring.
            </p>
          </div>
          
          {/* Peer reviewed Card */}
          <div className="p-8 premium-card md:col-span-2 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-700 dark:text-slate-300 mb-6 shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-lg mb-2">Verified Peer-Reviewed Database References</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              All star-allele pgx markers, wellness indicators, physiological traits, and admixture frequency ratios are derived directly from published public medical and anthropological studies.
            </p>
          </div>
        </div>
        
        {/* Technical Data Privacy Accordion/Details */}
        <div className="mt-24 border-t border-slate-200/50 dark:border-slate-800/50 pt-16">
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-8 tracking-tight">Security Architecture: Sandbox Privacy</h2>
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-left text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-white">
              <Lock size={300} />
            </div>
            <div className="relative z-10 grid md:grid-cols-3 gap-8">
              {/* Pillar 1: Local Execution */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-3 text-teal-400">
                  <Shield size={20} className="shrink-0" /> Local Compute
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Uses the browser-native <strong className="text-white">FileReader API</strong> to load text files directly into RAM. All calculations run in an isolated <strong className="text-white">Web Worker</strong>, leaving the main interface thread unencumbered.
                </p>
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-800">
                  <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                    <li>No server API uploads</li>
                    <li>Browser sandboxed RAM</li>
                    <li>Multi-threaded compute</li>
                  </ul>
                </div>
              </div>
              
              {/* Pillar 2: Local Persistence */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-3 text-emerald-400">
                  <Database size={20} className="shrink-0" /> Client Database
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Results can be optionally saved on-device using <strong className="text-white">IndexedDB</strong>. This is a local database residing directly on your hard drive, completely isolated by the browser's Same-Origin policy.
                </p>
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-800">
                  <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                    <li>Data resides on your disk</li>
                    <li>Strict sandbox limits</li>
                    <li>IndexedDB local isolation</li>
                  </ul>
                </div>
              </div>

              {/* Pillar 3: Verification */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-3 text-indigo-400">
                  <Lock size={20} className="shrink-0" /> Open Verification
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Open your browser's Developer Tools (<kbd className="bg-slate-800 px-1.5 py-0.5 rounded font-mono border border-slate-700">F12</kbd>), navigate to the <strong className="text-white">Network tab</strong>, and upload your file. You will confirm <strong className="text-white">0 bytes</strong> of network traffic leave your browser.
                </p>
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-800">
                  <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                    <li>Verifiable in real-time</li>
                    <li>Inspect traffic logs</li>
                    <li>Open-source architecture</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Technical Pipeline Visualization */}
            <div className="mt-12 p-6 bg-slate-950/80 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-6">
              <div className="flex flex-col items-center gap-2 text-center w-full sm:w-auto">
                <span className="font-bold text-white uppercase tracking-wider text-[9px] text-slate-500">Input Data</span>
                <div className="px-5 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl w-full sm:w-44 flex items-center gap-2 justify-center">
                  <FileText className="w-4 h-4 text-slate-500" /> RAW_DNA.txt
                </div>
              </div>
              <ArrowRight size={20} className="text-slate-700 rotate-90 sm:rotate-0" />
              <div className="flex flex-col items-center gap-2 text-center w-full sm:w-auto">
                <span className="font-bold text-teal-400 uppercase tracking-wider text-[9px]">Local Analysis</span>
                <div className="px-5 py-3.5 bg-teal-950/20 border border-teal-900/40 rounded-2xl w-full sm:w-48 text-teal-300 flex items-center gap-2 justify-center">
                  <Dna className="w-4 h-4 text-teal-400 animate-pulse-soft" /> Web Worker Sandbox
                </div>
              </div>
              <ArrowRight size={20} className="text-slate-700 rotate-90 sm:rotate-0" />
              <div className="flex flex-col items-center gap-2 text-center w-full sm:w-auto">
                <span className="font-bold text-emerald-400 uppercase tracking-wider text-[9px]">Storage</span>
                <div className="px-5 py-3.5 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl w-full sm:w-44 text-emerald-300 flex items-center gap-2 justify-center">
                  <Database className="w-4 h-4 text-emerald-400" /> Device IndexedDB
                </div>
              </div>
            </div>

            {/* Privacy Policy Link */}
            <div className="mt-8 text-center text-xs">
              <a 
                href="https://writteninthegenome.blog/writteninthegenome-privacy-policy/your-dna-your-device-the-engineering-behind-genotype-scouts-zero-footprint-privacy/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-teal-400 hover:text-teal-300 underline font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Read more about our device-side engineering & privacy guarantees.</span>
                <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroUpload;
