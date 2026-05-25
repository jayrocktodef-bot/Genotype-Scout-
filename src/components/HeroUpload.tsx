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
        
        {/* Bento Card: African American DNA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left w-full mt-8">
          <div className="p-8 premium-card hover:border-blue-100 transition-colors md:col-span-2 bg-gradient-to-br from-white to-blue-50/10">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <Dna className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg mb-2">Deconvolving African American Admixture</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              African American ancestry is often highly complex due to centuries of structural admixture. Our algorithms specifically untangle these threads by isolating West African, European, and indigenous sub-components through high-resolution, phased marker analysis, ensuring greater precision in identifying your specific, nuanced regional heritage.
            </p>
          </div>
        </div>

        {/* Privacy Commitment Section */}
        <div className="mt-20 border-t border-slate-100 pt-16">
          <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">Technical Data Privacy: How it works</h2>
          <div className="bg-slate-900 rounded-3xl p-10 text-left text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Lock size={200} />
            </div>
            <div className="relative z-10 grid md:grid-cols-3 gap-8">
              {/* Pillar 1: Local Execution */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-teal-400">
                  <Shield size={20} /> 100% Local Execution
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  Genotype Scout uses your browser's <strong className="text-white">FileReader API</strong> to load your file into isolated RAM. Analysis happens within a sandboxed <strong className="text-white">Web Worker</strong>, completely separate from the main application thread.
                </p>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                    <li>Zero server uploads.</li>
                    <li>CPU/RAM bound, not Network bound.</li>
                    <li>Isolated thread execution.</li>
                  </ul>
                </div>
              </div>
              
              {/* Pillar 2: Local Persistence */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-amber-400">
                  <Database size={20} /> Browser Isolation
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  If you choose to "Save," we use <strong className="text-white">IndexedDB</strong>—a browser-native storage engine. This is a secure database residing physically on your hard drive, NOT at our servers. It is scoped exclusively to this domain.
                </p>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                    <li>Database = local file on your disk.</li>
                    <li>Stores result-only.</li>
                    <li>Sandboxed origin access.</li>
                  </ul>
                </div>
              </div>

              {/* Pillar 3: Verification */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-rose-400">
                  <Lock size={20} /> Absolute Verifiability
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  Privacy isn't just a claim—it's verifiable. Open your browser's Developer Tools (F12) and watch the <strong className="text-white">Network tab</strong> during analysis. You will see <strong className="text-white">zero traffic</strong> related to your DNA data.
                </p>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                    <li>Verify with your own eyes.</li>
                    <li>Zero network calls for data.</li>
                    <li>Total control over cache.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Technical Pipeline Visualization */}
            <div className="mt-10 p-6 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex flex-col items-center gap-2">
                <span className="font-bold text-white">Your File</span>
                <div className="p-3 bg-slate-800 rounded-lg">DNA File</div>
              </div>
              <ArrowRight size={24} className="text-slate-600" />
              <div className="flex flex-col items-center gap-2">
                <span className="font-bold text-white">Browser Core</span>
                <div className="p-3 bg-teal-900/30 border border-teal-800 rounded-lg text-teal-300">沙 Sandboxed Worker</div>
              </div>
              <ArrowRight size={24} className="text-slate-600" />
              <div className="flex flex-col items-center gap-2">
                <span className="font-bold text-white">Results</span>
                <div className="p-3 bg-amber-900/30 border border-amber-800 rounded-lg text-amber-300">Local IndexedDB</div>
              </div>
            </div>

            {/* Privacy Policy Link */}
            <div className="mt-6 text-center text-xs text-slate-500">
              <a 
                href="https://writteninthegenome.blog/writteninthegenome-privacy-policy/your-dna-your-device-the-engineering-behind-genotype-scouts-zero-footprint-privacy/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-teal-400 hover:text-teal-300 underline font-semibold transition-colors"
              >
                View our detailed privacy policy and zero-footprint engineering.
              </a>
            </div>
          </div>
        </div>

        {/* Genotype Scout Character Artwork */}
        <div className="mt-16 w-full max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="group relative overflow-hidden bg-slate-50 rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-xl shadow-slate-100 hover:shadow-2xl transition-all hover:border-teal-50"
          >
            <div className="aspect-[2.1/1] w-full overflow-hidden rounded-2xl border border-slate-200 relative bg-slate-900 shadow-inner">
              <img 
                src="https://writteninthegenome.blog/wp-content/uploads/2026/05/17794109956991097490157538819964.png" 
                alt="Genotype Scout - Scout Boy Mascot Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
            </div>
            <div className="mt-4 text-center">
              <span className="text-[10px] font-black tracking-[0.2em] text-teal-650 uppercase bg-teal-50/50 px-3 py-1 rounded-full border border-teal-100">
                Official Mascot & Companion
              </span>
              <p className="mt-2 text-xs text-slate-400 font-mono font-medium">
                GENOTYPE SCOUT™ — Your privacy-first local genomic analysis suite.
              </p>
            </div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
};

export default HeroUpload;
