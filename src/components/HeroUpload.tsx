import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, Shield, Zap, Lock, Database, Dna, ArrowRight } from 'lucide-react';

interface HeroUploadProps {
  onFiles: (files: FileList) => void;
  processing: boolean;
  onReset: () => void;
}

const HeroUpload: React.FC<HeroUploadProps> = ({ onFiles, processing, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-up">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-650 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 ring-1 ring-teal-100 animate-pulse-soft">
          <Database className="w-3 h-3" /> 10,000+ Genomic Markers Reference
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-800 mb-8 leading-[1.1]">
          The most private way to <br /> explore your <span className="text-teal-600">DNA heritage.</span>
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-16 leading-relaxed">
          Upload your raw data from 23andMe, AncestryDNA, or MyHeritage. 
          All analysis happens <span className="text-slate-800 font-bold underline decoration-teal-300 underline-offset-4">locally in your browser</span>. 
          Your privacy is our core architecture.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 max-w-md mx-auto">
          <button 
            disabled={processing}
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-slate-300 hover:bg-slate-800 transition-all flex items-center justify-center gap-4 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-6 h-6" />
            {processing ? 'Analyzing...' : 'Upload Raw DNA'}
          </button>
          
          <button 
            onClick={onReset}
            className="w-full sm:w-auto px-10 py-5 bg-rose-50 text-rose-600 rounded-[2rem] font-black text-lg shadow-lg shadow-rose-100 hover:bg-rose-100 transition-all flex items-center justify-center gap-4 hover:scale-105 active:scale-95 border border-rose-100"
          >
            Clear Cache
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onFiles(e.target.files);
              } else {
                // Optionally handle cancel here, e.g. onReset()
              }
            }}
            className="hidden" 
            accept=".txt,.csv,.zip"
          />
        </div>

        {/* Informational Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left w-full mt-12">
          
          {/* Bento Card 1: personally curated AIMs */}
          <div className="p-8 premium-card hover:border-amber-100 transition-colors md:col-span-2 relative overflow-hidden bg-gradient-to-br from-white to-amber-50/10">
            <div className="absolute top-6 right-6">
              <span className="px-3 py-1 bg-amber-55 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded-full border border-amber-100">
                Exclusive Native Cohorts
              </span>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
              <Dna className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg mb-2">Curated Amerind & Distinct Global AIMs</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              To represent the complex demographics of America more accurately, we have integrated a hand-curated panel of Ancestry Informative Markers (AIMs). These are optimized specifically to isolate high-precision Native American (North, Central, and South American indigenous cohorts) genomic profiles from modern European and African components.
            </p>
            <p className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <span>Resolves regional subclades, Mesoamerican ancestry, and First Nations markers.</span>
            </p>
          </div>

          {/* Bento Card 2 */}
          <div className="p-8 premium-card hover:border-teal-100 transition-colors">
            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Zero-Footprint Sandbox</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              We never save, upload, or index your raw genetic data. Your DNA file is processed exclusively inside local client memory using active browser sandboxing and disappears upon closing the tab.
            </p>
          </div>
          
          {/* Bento Card 3 */}
          <div className="p-8 premium-card hover:border-indigo-100 transition-colors">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Bayesian Likelihood Models</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Our calculations match your genotypes with a broad 10,000 SNP reference dataset representing 26 distinct global sub-populations for high-fidelity regional clustering.
            </p>
          </div>
          
          {/* Bento Card 4 */}
          <div className="p-8 premium-card hover:border-rose-100 transition-colors md:col-span-2">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Verified Research DB References</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              All ancestry predictions, star-allele pgx associations, and physiological traits are cross-referenced directly with peer-reviewed scientific literature data and standard index datasets.
            </p>
          </div>
        </div>

        {/* Gemini share case study link / Action section at the bottom */}
        <div className="mt-16 p-8 bg-slate-900 text-white rounded-[2.5rem] text-left relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-slate-950/20">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10"></div>
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-full text-[10px] font-black uppercase tracking-widest">
              Gemini Integration Showcase
            </span>
            <h3 className="text-2xl font-black text-slate-100 tracking-tight leading-snug">
              Interactive AI-Assisted Architecture Case Study
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore how we leveraged Gemini's advanced semantic modeling to develop Genotype Scout's privacy-centric, zero-footprint personal genetic kernels and local ancestry algorithm architectures. See the complete system blueprint on Google AI Studio.
            </p>
          </div>
          <a
            href="https://gemini.google.com/share/f95978efdaa8"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 w-full md:w-auto shrink-0 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl text-center shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Review AI Case Study <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </motion.div>
    </div>
  );
};

export default HeroUpload;
