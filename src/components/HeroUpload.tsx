import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Shield, Zap, Lock, Database, Dna, ArrowRight, Info, FlaskConical } from 'lucide-react';

interface HeroUploadProps {
  onFiles: (files: FileList) => void;
  processing: boolean;
  onReset: () => void;
}

const HeroUpload: React.FC<HeroUploadProps> = ({ onFiles, processing, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

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
      onFiles(e.dataTransfer.files);
    }
  };

  // Generate bubbling particles for the lab scene
  const bubbles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${10 + (i * 7.5) + Math.random() * 5}%`,
    delay: i * 0.3,
    duration: 2.5 + Math.random() * 2,
    size: 4 + Math.random() * 10
  }));

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-up">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        {/* Curated Panel status chip */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-950/50 text-teal-650 dark:text-teal-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 ring-1 ring-teal-100 dark:ring-teal-800 animate-pulse-soft">
          <Database className="w-3 h-3" /> 10,000+ Genomic Markers Reference
        </div>
        
        {/* Main Header */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-800 dark:text-slate-100 mb-6 leading-[1.15]">
          The most private way to <br /> explore your <span className="text-teal-600 dark:text-teal-400">DNA heritage.</span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your raw data from 23andMe, AncestryDNA, or MyHeritage. 
          All analysis happens <span className="text-slate-800 dark:text-slate-200 font-bold underline decoration-teal-300 dark:decoration-teal-650 underline-offset-4">locally in your browser</span>. 
          Your privacy is our core architecture.
        </p>

        {/* Animated Science Laboratory Widget */}
        <div className="w-full max-w-md mx-auto p-6 rounded-[2rem] bg-white/40 dark:bg-slate-900/35 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-xl relative overflow-hidden h-56 flex flex-col items-center justify-between mb-8 select-none">
          {/* Lab Grid background lines */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500/5 via-transparent to-transparent opacity-60 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-teal-500/30 to-transparent pointer-events-none" />

          {/* Glowing DNA Double Helix Background */}
          <motion.div 
            className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-10 dark:opacity-15 pointer-events-none"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <svg width="100" height="200" viewBox="0 0 100 200" fill="none" className="text-teal-600 dark:text-teal-400">
              <path d="M15 15 C 40 50, 60 100, 40 150 C 30 175, 20 190, 15 195" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M85 15 C 60 50, 40 100, 60 150 C 70 175, 80 190, 85 195" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              {Array.from({ length: 9 }).map((_, idx) => {
                const y = 30 + idx * 16;
                const x1 = 15 + Math.sin(idx) * 15 + 25;
                const x2 = 85 - (15 + Math.sin(idx) * 15 + 25);
                return (
                  <line key={idx} x1={x1} y1={y} x2={x2} y2={y} stroke="currentColor" strokeWidth="1.5" strokeDasharray="1.5 2" opacity="0.6" />
                );
              })}
            </svg>
          </motion.div>

          {/* Bubbling lab beaker outline */}
          <div className="absolute left-6 bottom-4 text-teal-600/20 dark:text-teal-400/20 pointer-events-none">
            <FlaskConical size={72} className="stroke-[1.5]" />
          </div>

          {/* Bubble Particles */}
          {bubbles.map(bubble => (
            <motion.div
              key={bubble.id}
              className="absolute bottom-6 rounded-full bg-teal-400/20 dark:bg-teal-500/10 border border-teal-300/30 backdrop-blur-[1px] pointer-events-none"
              style={{
                left: bubble.left,
                width: bubble.size,
                height: bubble.size,
              }}
              animate={{
                y: [0, -140],
                opacity: [0, 0.7, 0],
                scale: [1, 1.25, 0.7]
              }}
              transition={{
                duration: processing ? bubble.duration * 0.45 : bubble.duration,
                repeat: Infinity,
                delay: bubble.delay,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Running Mascot Animation */}
          <div className="relative w-44 h-40 flex items-center justify-center z-10">
            <motion.div
              animate={{
                y: processing ? [0, -10, 0] : [0, -4, 0],
                x: processing ? [-3, 3, -3] : [-1, 1, -1]
              }}
              transition={{
                duration: processing ? 0.22 : 0.45,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full flex items-center justify-center p-2 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-white/5 shadow-md"
            >
              <img 
                src="/assets/mascot_running.png" 
                alt="Running Mascot" 
                className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal dark:invert-0 dark:brightness-100" 
              />
            </motion.div>
          </div>

          {/* Lab Status Label */}
          <div className="z-10 bg-slate-900/60 dark:bg-slate-950/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[9px] font-black tracking-widest uppercase text-teal-350 dark:text-teal-400">
            {processing ? '⚡ Calculating Admixture...' : '🧪 Genomic Lab Awaiting Sequence...'}
          </div>
        </div>

        {/* Drag-and-Drop Area Container */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`w-full max-w-xl mx-auto p-10 rounded-[2.5rem] bg-white/20 dark:bg-slate-900/25 backdrop-blur-2xl border-2 border-dashed ${
            isDragActive 
              ? 'border-teal-500 bg-teal-50/10 dark:bg-teal-950/10 shadow-[0_0_30px_rgba(20,184,166,0.15)]' 
              : 'border-slate-300/40 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20'
          } transition-all duration-300 relative shadow-2xl mb-12 group`}
        >
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className={`w-16 h-16 rounded-2xl ${isDragActive ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'} flex items-center justify-center transition-colors shadow`}>
              <Upload className={`w-8 h-8 ${isDragActive ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'}`} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
                {isDragActive ? 'Drop your genome file!' : 'Drag & drop raw DNA file'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Supports 23andMe, AncestryDNA, MyHeritage (.txt, .csv, .zip)
              </p>
            </div>
            
            <div className="w-full h-px bg-slate-200/50 dark:bg-slate-800/40 my-2" />
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <button 
                disabled={processing}
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-4 h-4" />
                {processing ? 'Analyzing...' : 'Browse Local Files'}
              </button>
              
              <button 
                onClick={onReset}
                className="w-full sm:w-auto px-8 py-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-2xl font-black text-sm hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 border border-rose-100 dark:border-rose-900/30"
              >
                Clear Local Cache
              </button>
            </div>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onFiles(e.target.files);
              }
            }}
            className="hidden" 
            accept=".txt,.csv,.zip"
          />
        </div>

        {/* Beta disclaimer */}
        <div className="max-w-2xl mx-auto mb-16 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 px-5 py-4 text-left">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700 mb-1">
                Beta — Research &amp; Educational Tool
              </p>
              <p className="text-sm text-amber-900/90 leading-relaxed">
                Genotype Scout is in active <span className="font-bold">beta</span> and is <span className="font-bold">not an ethnicity calculator</span>.
                It is a research and educational tool for exploring your raw genotype data, and its results are
                <span className="font-bold"> not directly comparable</span> to the ethnicity estimates from commercial tests
                like 23andMe or AncestryDNA. Findings are exploratory and are not medical or diagnostic advice.
              </p>
            </div>
          </div>
        </div>

        {/* Informational Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left w-full mt-12">
          
          {/* Bento Card 1: Curated AIMs */}
          <div className="p-8 premium-card hover:border-amber-100 transition-colors md:col-span-2 relative overflow-hidden bg-gradient-to-br from-white to-amber-50/10">
            <div className="absolute top-6 right-6">
              <span className="px-3 py-1 bg-amber-50 dark:bg-slate-800 text-amber-700 dark:text-amber-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-amber-100 dark:border-amber-900/30">
                Exclusive Native Cohorts
              </span>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
              <Dna className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg mb-2">Curated Amerind & Distinct Global AIMs</h3>
            <p className="text-sm text-slate-550 leading-relaxed mb-4">
              To represent the complex demographics of America more accurately, we have integrated a hand-curated panel of Ancestry Informative Markers (AIMs). These are optimized specifically to isolate high-precision Native American (North, Central, and South American indigenous cohorts) genomic profiles from modern European and African components.
            </p>
            <p className="text-xs text-slate-400 font-semibold">
              Resolves regional subclades, Mesoamerican ancestry, and First Nations markers.
            </p>
          </div>

          {/* Bento Card 2: Zero-Footprint */}
          <div className="p-8 premium-card hover:border-teal-100 transition-colors">
            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Zero-Footprint Sandbox</h3>
            <p className="text-sm text-slate-550 leading-relaxed">
              We never save, upload, or index your raw genetic data. Your DNA file is processed exclusively inside local client memory using active browser sandboxing and disappears upon closing the tab.
            </p>
          </div>
          
          {/* Bento Card 3: Bayesian */}
          <div className="p-8 premium-card hover:border-indigo-100 transition-colors">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Bayesian Likelihood Models</h3>
            <p className="text-sm text-slate-550 leading-relaxed">
              Our calculations match your genotypes with a broad 10,000 SNP reference dataset representing 26 distinct global sub-populations for high-fidelity regional clustering.
            </p>
          </div>
          
          {/* Bento Card 4: Verified Research */}
          <div className="p-8 premium-card hover:border-rose-100 transition-colors md:col-span-2">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Verified Research DB References</h3>
            <p className="text-sm text-slate-550 leading-relaxed">
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
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg mb-2">Deconvolving African American Admixture</h3>
            <p className="text-sm text-slate-550 leading-relaxed">
              African American ancestry is often highly complex due to centuries of structural admixture. Our algorithms specifically untangle these threads by isolating West African, European, and indigenous sub-components through high-resolution, phased marker analysis, ensuring greater precision in identifying your specific, regional heritage.
            </p>
          </div>
        </div>

        {/* Privacy Commitment Section */}
        <div className="mt-20 border-t border-slate-100 dark:border-slate-850 pt-16">
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-8 tracking-tight">Technical Data Privacy: How it works</h2>
          <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-10 text-left text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Lock size={200} />
            </div>
            <div className="relative z-10 grid md:grid-cols-3 gap-8">
              {/* Pillar 1 */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-teal-400">
                  <Shield size={20} /> 100% Local Execution
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  Genotype Scout uses your browser's <strong className="text-white">FileReader API</strong> to load your file into isolated RAM. Analysis happens within a sandboxed <strong className="text-white">Web Worker</strong>, completely separate from the main application thread.
                </p>
                <div className="bg-slate-800 dark:bg-slate-900 p-4 rounded-xl border border-slate-700 dark:border-slate-800">
                  <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                    <li>Zero server uploads.</li>
                    <li>CPU/RAM bound, not Network.</li>
                    <li>Isolated thread execution.</li>
                  </ul>
                </div>
              </div>
              
              {/* Pillar 2 */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-amber-400">
                  <Database size={20} /> Browser Isolation
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  If you choose to "Save," we use <strong className="text-white">IndexedDB</strong>—a browser-native storage engine. This is a secure database residing physically on your hard drive, NOT at our servers. It is scoped exclusively to this domain.
                </p>
                <div className="bg-slate-800 dark:bg-slate-900 p-4 rounded-xl border border-slate-700 dark:border-slate-800">
                  <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                    <li>Database = local file on disk.</li>
                    <li>Stores result-only.</li>
                    <li>Sandboxed origin access.</li>
                  </ul>
                </div>
              </div>

              {/* Pillar 3 */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-rose-400">
                  <Lock size={20} /> Absolute Verifiability
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  Privacy isn't just a claim—it's verifiable. Open your browser's Developer Tools (F12) and watch the <strong className="text-white">Network tab</strong> during analysis. You will see <strong className="text-white">zero traffic</strong> related to your DNA data.
                </p>
                <div className="bg-slate-800 dark:bg-slate-900 p-4 rounded-xl border border-slate-700 dark:border-slate-800">
                  <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                    <li>Verify with your own eyes.</li>
                    <li>Zero network calls for data.</li>
                    <li>Total control over cache.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Technical Pipeline Visualization */}
            <div className="mt-10 p-6 bg-slate-950 dark:bg-slate-900/60 rounded-2xl border border-slate-800 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex flex-col items-center gap-2">
                <span className="font-bold text-white">Your File</span>
                <div className="p-3 bg-slate-800 dark:bg-slate-800 rounded-lg">DNA File</div>
              </div>
              <ArrowRight size={24} className="text-slate-600" />
              <div className="flex flex-col items-center gap-2">
                <span className="font-bold text-white">Browser Core</span>
                <div className="p-3 bg-teal-900/30 border border-teal-800 rounded-lg text-teal-350">🧬 Sandboxed Worker</div>
              </div>
              <ArrowRight size={24} className="text-slate-600" />
              <div className="flex flex-col items-center gap-2">
                <span className="font-bold text-white">Results</span>
                <div className="p-3 bg-amber-900/30 border border-amber-800 rounded-lg text-amber-350">Local IndexedDB</div>
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
      </motion.div>
    </div>
  );
};

export default HeroUpload;
