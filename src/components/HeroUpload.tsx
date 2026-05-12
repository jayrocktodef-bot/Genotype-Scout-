import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, Shield, Zap, Lock, Database } from 'lucide-react';

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
        className="max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 ring-1 ring-teal-100 animate-pulse-soft">
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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
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
            onChange={(e) => e.target.files && onFiles(e.target.files)}
            className="hidden" 
            accept=".txt,.csv,.zip"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          <div className="p-8 premium-card hover:border-teal-100 transition-colors">
            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Zero Data Storage</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Your data is never uploaded to a server. All processing is 100% local.</p>
          </div>
          
          <div className="p-8 premium-card hover:border-indigo-100 transition-colors">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">High Fidelity</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Using advanced Bayesian models and 10k SNP GRAF-pop panel.</p>
          </div>
          
          <div className="p-8 premium-card hover:border-rose-100 transition-colors">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Verified Markers</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Cross-referenced with HIrisPlex-S and OpenPGx research databases.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroUpload;
