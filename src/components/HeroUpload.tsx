import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, Shield, Database, Lock, ArrowRight, Dna, 
  Sparkles, Volume2, VolumeX, Monitor, 
  Disc, Check, AlertCircle, RefreshCw, Layers
} from 'lucide-react';
import { SFX } from '../utils/audio/retroSynth';
import { CRTOverlay } from './retro/CRTOverlay';
import { RetroDNAHelix } from './retro/RetroDNAHelix';

interface HeroUploadProps {
  onFiles: (files: FileList | File[]) => void;
  processing: boolean;
  onReset: () => void;
}

type TabType = 'privacy' | 'database' | 'offline';

const TERMINAL_BOOT_LINES = [
  '> SYSTEM KERNEL INITIALIZED ...... [0x7F4A] OK',
  '> LOADING 17,042 PHASED AIMS ...... [KIDD/1000G] OK',
  '> POPULATION DECONVOLUTION ENGINE .. [MATRIX-K] READY',
  '> CHROMOSOME Y PHYLOTREE INDEX .... [MSY-TREE] MOUNTED',
  '> NETWORK EGRESS FIREWALL ......... [AIR-GAPPED: 0 BYTES]',
  '> CLIENT INDEXEDDB SANDBOX ........ [ISOLATED] OK',
  '> READY FOR SPECIMEN CARTRIDGE INSERTION ...'
];

export const HeroUpload: React.FC<HeroUploadProps> = ({ onFiles, processing, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('privacy');
  const [isMuted, setIsMuted] = useState<boolean>(() => SFX.isMuted());
  const [crtEnabled, setCrtEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('scout_crt_effect');
      return stored === 'true';
    } catch {
      return false;
    }
  });
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [bootLineIdx, setBootLineIdx] = useState(0);

  // Cycle simulated terminal lines
  useEffect(() => {
    const timer = setInterval(() => {
      setBootLineIdx((prev) => (prev + 1) % TERMINAL_BOOT_LINES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    const nowMuted = SFX.toggleMute();
    setIsMuted(nowMuted);
  };

  const toggleCrt = () => {
    const next = !crtEnabled;
    setCrtEnabled(next);
    try {
      localStorage.setItem('scout_crt_effect', String(next));
    } catch {}
    SFX.select();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      if (!isDragActive) {
        setIsDragActive(true);
        SFX.hover();
      }
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
      SFX.cartridgeInsert();
      onFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      SFX.cartridgeInsert();
      onFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleZoneClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    SFX.select();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleLoadDemoCartridge = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoadingDemo) return;

    try {
      setIsLoadingDemo(true);
      SFX.coin();
      const response = await fetch('/samples/Iberian_Portuguese_hu33FC53.txt');
      if (!response.ok) throw new Error('Demo sample file not found');
      const blob = await response.blob();
      const file = new File([blob], 'Iberian_Portuguese_hu33FC53.txt', { type: 'text/plain' });
      setSelectedFileName(file.name);
      SFX.cartridgeInsert();
      onFiles([file]);
    } catch (err) {
      console.error('Could not load demo specimen:', err);
      SFX.error();
    } finally {
      setIsLoadingDemo(false);
    }
  };

  const handleClearCache = () => {
    SFX.select();
    if (window.confirm("PURGE LOCAL ROM MEMORY & CACHE?\n\nThis resets all IndexedDB genomes and unregisters client service workers.")) {
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
    <div className="min-h-[90vh] flex flex-col items-center justify-start py-8 px-4 sm:px-6 relative overflow-hidden bg-[#05070a] text-slate-200 select-none">
      {/* CRT Scanline & Phosphor Overlay */}
      <CRTOverlay enabled={crtEnabled} />

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        className="hidden" 
        accept="*"
        multiple
      />

      <div className="max-w-5xl w-full relative z-10 space-y-6">
        
        {/* =========================================================================
            1. TOP ARCADE MARQUEE & SYSTEM TOGGLES
            ========================================================================= */}
        <header className="bg-[#0b1016] border-2 border-[#1e2a3a] pixel-shadow rounded-none p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Marquee Title with Blinking Coin LED */}
          <div className="flex items-center gap-2.5 overflow-hidden w-full sm:w-auto">
            <span className="w-3 h-3 bg-[#6bff9e] shadow-[0_0_8px_#6bff9e] animate-pulse shrink-0 inline-block" />
            <div className="font-arcade text-[10px] sm:text-xs text-[#6bff9e] glow-phosphor-text tracking-wider truncate">
              GENOTYPE SCOUT ▸ CYBER-LAB TERMINAL v5.17
            </div>
          </div>

          {/* Scrolling Telemetry Marquee Ticker */}
          <div className="hidden lg:flex flex-1 mx-4 overflow-hidden bg-[#05070a] border border-[#1e2a3a] py-1 px-3">
            <div className="animate-marquee font-terminal text-[#4fe3ff] text-sm tracking-widest uppercase">
              ★ 100% AIR-GAPPED DNA SEQUENCE DECODER ★ ZERO SERVER EGRESS ★ 17,000+ PHASED AIM MARKERS ACTIVE ★ 8/16-BIT RETRO ARCHITECTURE ★ INSERT SPECIMEN CARTRIDGE TO BEGIN ★&nbsp;
            </div>
          </div>

          {/* Quick Retro Toggles: Sound & CRT */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={toggleSound}
              onMouseEnter={() => SFX.hover()}
              className={`px-2.5 py-1 text-[10px] font-pixel uppercase border transition-all flex items-center gap-1.5 ${
                !isMuted 
                  ? 'bg-[#141b26] text-[#6bff9e] border-[#6bff9e]/60 shadow-[0_0_8px_rgba(107,255,158,0.2)]' 
                  : 'bg-[#05070a] text-slate-500 border-[#1e2a3a]'
              }`}
              title="Toggle Retro 8-Bit Audio Effects"
            >
              {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
              <span>{isMuted ? 'SFX: OFF' : 'SFX: ON'}</span>
            </button>

            <button
              onClick={toggleCrt}
              onMouseEnter={() => SFX.hover()}
              className={`px-2.5 py-1 text-[10px] font-pixel uppercase border transition-all flex items-center gap-1.5 ${
                crtEnabled 
                  ? 'bg-[#141b26] text-[#4fe3ff] border-[#4fe3ff]/60 shadow-[0_0_8px_rgba(79,227,255,0.2)]' 
                  : 'bg-[#05070a] text-slate-500 border-[#1e2a3a]'
              }`}
              title="Toggle CRT Scanline Simulation"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{crtEnabled ? 'CRT: ON' : 'CRT: OFF'}</span>
            </button>
          </div>
        </header>

        {/* =========================================================================
            2. HERO TITLE SECTION WITH TWIN PIXEL DNA HELICES
            ========================================================================= */}
        <div className="text-center py-4 relative">
          {/* Flanking DNA Pixel Animations for Desktop */}
          <div className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 opacity-80">
            <RetroDNAHelix width={56} height={120} speed={0.04} />
          </div>
          <div className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 opacity-80 scale-x-[-1]">
            <RetroDNAHelix width={56} height={120} speed={0.04} />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0b1016] border border-[#6bff9e]/40 text-[#6bff9e] text-[10px] font-pixel tracking-widest uppercase mb-4 pixel-shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PLAYER 1 · ZERO NETWORK STORAGE · AIR-GAPPED</span>
          </div>

          <h1 className="font-arcade text-2xl sm:text-3xl md:text-5xl text-white tracking-tight leading-snug mb-3">
            DECRYPT YOUR DNA <br />
            <span className="text-[#4fe3ff] glow-cyan-text">100% PRIVATELY.</span>
          </h1>

          <p className="font-terminal text-lg sm:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Mount your raw autosomal file into local RAM. Genotype Scout executes local population genetics <span className="text-[#6bff9e] underline decoration-[#6bff9e] underline-offset-4 font-bold">strictly inside your browser</span>.
          </p>
        </div>

        {/* =========================================================================
            3. MAIN TERMINAL CONSOLE: CARTRIDGE DROPZONE
            ========================================================================= */}
        <div className="bg-[#0b1016] border-2 border-[#1e2a3a] pixel-shadow p-5 sm:p-7 relative flex flex-col justify-between">
          {/* Corner pixel brackets */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#4fe3ff]" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#4fe3ff]" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#4fe3ff]" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#4fe3ff]" />

          {/* Cartridge Slot Header */}
          <div className="flex items-center justify-between border-b-2 border-[#1e2a3a] pb-3 mb-5">
            <div className="flex items-center gap-2 font-arcade text-xs text-[#4fe3ff]">
              <Disc className="w-4 h-4 animate-spin-slow text-[#ff4fd8]" />
              <span>CARTRIDGE SLOT A</span>
            </div>
            <span className="font-pixel text-[9px] uppercase px-2 py-0.5 bg-[#141b26] text-[#6bff9e] border border-[#6bff9e]/30">
              READY FOR INSERTION
            </span>
          </div>

          {/* Physical-Style Cartridge Bevel Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={handleZoneClick}
            onMouseEnter={() => SFX.hover()}
            className={`relative p-6 sm:p-8 border-2 border-dashed cursor-pointer transition-all duration-200 text-center flex flex-col items-center justify-center ${
              isDragActive
                ? 'border-[#6bff9e] bg-[#6bff9e]/10 shadow-[0_0_30px_rgba(107,255,158,0.3)] scale-[1.01]'
                : 'border-[#1e2a3a] bg-[#05070a]/80 hover:border-[#4fe3ff] hover:bg-[#141b26]/50 shadow-inner'
            }`}
          >
            {/* Animated Cartridge Reader Graphic */}
            <div className={`w-16 h-16 mb-4 flex items-center justify-center border-2 transition-transform duration-200 ${
              isDragActive
                ? 'border-[#6bff9e] bg-[#6bff9e]/20 text-[#6bff9e] scale-110 shadow-[0_0_15px_#6bff9e]'
                : 'border-[#1e2a3a] bg-[#141b26] text-[#4fe3ff]'
            }`}>
              <Upload className="w-8 h-8 animate-bounce-slow" />
            </div>

            <h3 className="font-arcade text-sm sm:text-base text-white mb-2 leading-relaxed">
              DROP RAW DNA SPECIMEN HERE
            </h3>

            <p className="font-terminal text-base sm:text-xl text-slate-400 mb-6 max-w-sm">
              Supports <strong className="text-[#6bff9e]">.TXT, .CSV, .ZIP, .GZ, .VCF</strong> raw chip files
            </p>

            {/* Chunky Arcade Button: Select File Manually */}
            <button
              type="button"
              onClick={handleZoneClick}
              onMouseEnter={() => SFX.hover()}
              className="font-arcade text-xs px-6 py-3 bg-[#4fe3ff] hover:bg-[#6bff9e] text-[#05070a] uppercase tracking-wider font-black pixel-shadow transition-transform active:translate-y-1 active:shadow-none"
            >
              SELECT FILE MANUALLY
            </button>

            {selectedFileName && (
              <div className="mt-4 font-terminal text-sm text-[#6bff9e] bg-[#05070a] border border-[#6bff9e]/40 px-3 py-1.5 flex items-center gap-2">
                <Check className="w-4 h-4 text-[#6bff9e]" />
                <span>LOADED: {selectedFileName}</span>
              </div>
            )}
          </div>

          {/* Instant Demo Specimen CTA */}
          <div className="mt-5 pt-4 border-t border-[#1e2a3a] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-400 font-terminal text-base">
              <span className="w-2 h-2 rounded-full bg-[#ffd23f] animate-ping shrink-0" />
              <span>No file on hand? Try the bundled Portuguese specimen:</span>
            </div>

            <button
              type="button"
              onClick={handleLoadDemoCartridge}
              onMouseEnter={() => SFX.hover()}
              disabled={isLoadingDemo}
              className="w-full sm:w-auto font-arcade text-[10px] px-4 py-2.5 bg-[#ffd23f] hover:bg-amber-300 text-[#05070a] uppercase font-black pixel-shadow-amber transition-transform active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2"
            >
              {isLoadingDemo ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>READING ROM...</span>
                </>
              ) : (
                <>
                  <span>🪙 INSERT COIN: LOAD DEMO</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* =========================================================================
            4. RETRO RPG QUEST LOG / KNOWLEDGE DECK (TABS)
            ========================================================================= */}
        <div className="bg-[#0b1016] border-2 border-[#1e2a3a] pixel-shadow p-5 sm:p-6 text-left">
          {/* Tab Selector Buttons */}
          <div className="flex flex-wrap gap-2 border-b-2 border-[#1e2a3a] pb-3 mb-5">
            <button
              onClick={() => { setActiveTab('privacy'); SFX.select(); }}
              onMouseEnter={() => SFX.hover()}
              className={`font-arcade text-[10px] px-3.5 py-2 uppercase border transition-all ${
                activeTab === 'privacy'
                  ? 'bg-[#4fe3ff] text-[#05070a] border-[#4fe3ff] font-black pixel-shadow-sm'
                  : 'bg-[#05070a] text-slate-400 border-[#1e2a3a] hover:text-white'
              }`}
            >
              [1] PRIVACY SANDBOX
            </button>

            <button
              onClick={() => { setActiveTab('database'); SFX.select(); }}
              onMouseEnter={() => SFX.hover()}
              className={`font-arcade text-[10px] px-3.5 py-2 uppercase border transition-all ${
                activeTab === 'database'
                  ? 'bg-[#6bff9e] text-[#05070a] border-[#6bff9e] font-black pixel-shadow-sm'
                  : 'bg-[#05070a] text-slate-400 border-[#1e2a3a] hover:text-white'
              }`}
            >
              [2] COMPATIBLE KITS
            </button>

            <button
              onClick={() => { setActiveTab('offline'); SFX.select(); }}
              onMouseEnter={() => SFX.hover()}
              className={`font-arcade text-[10px] px-3.5 py-2 uppercase border transition-all ${
                activeTab === 'offline'
                  ? 'bg-[#ffd23f] text-[#05070a] border-[#ffd23f] font-black pixel-shadow-sm'
                  : 'bg-[#05070a] text-slate-400 border-[#1e2a3a] hover:text-white'
              }`}
            >
              [3] OFFLINE PWA SETUP
            </button>
          </div>

          {/* Tab Contents */}
          <AnimatePresence mode="wait">
            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="grid md:grid-cols-3 gap-4 font-terminal text-base sm:text-lg"
              >
                <div className="p-3 bg-[#05070a] border border-[#1e2a3a]">
                  <h4 className="font-arcade text-xs text-[#6bff9e] mb-1.5 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> RAM WORKER
                  </h4>
                  <p className="text-slate-400 leading-snug">
                    Files are decoded in isolated browser memory. Zero byte chunks are uploaded to any server.
                  </p>
                </div>
                <div className="p-3 bg-[#05070a] border border-[#1e2a3a]">
                  <h4 className="font-arcade text-xs text-[#4fe3ff] mb-1.5 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" /> LOCAL STORAGE
                  </h4>
                  <p className="text-slate-400 leading-snug">
                    Results are saved to browser IndexedDB, bounded by local device origin security.
                  </p>
                </div>
                <div className="p-3 bg-[#05070a] border border-[#1e2a3a]">
                  <h4 className="font-arcade text-xs text-[#ffd23f] mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> F12 VERIFIED
                  </h4>
                  <p className="text-slate-400 leading-snug">
                    Verifiable air-gap. Disconnect your internet connection after loading the page and it works 100%.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'database' && (
              <motion.div
                key="database"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <p className="font-terminal text-slate-300 text-lg">
                  Genotype Scout automatically detects file headers, builds (GRCh37/hg19 and GRCh38/hg38), and delimiter structures for:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-arcade text-[10px] text-center">
                  <div className="p-3 bg-[#05070a] border border-[#1e2a3a] text-[#4fe3ff]">
                    <span className="block text-base mb-1">🧬</span>
                    23ANDME
                  </div>
                  <div className="p-3 bg-[#05070a] border border-[#1e2a3a] text-[#6bff9e]">
                    <span className="block text-base mb-1">🌲</span>
                    ANCESTRY DNA
                  </div>
                  <div className="p-3 bg-[#05070a] border border-[#1e2a3a] text-[#ffd23f]">
                    <span className="block text-base mb-1">📜</span>
                    MYHERITAGE
                  </div>
                  <div className="p-3 bg-[#05070a] border border-[#1e2a3a] text-[#ff4fd8]">
                    <span className="block text-base mb-1">🔬</span>
                    WGS / VCF 4.2+
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
                className="grid md:grid-cols-2 gap-4 font-terminal text-lg"
              >
                <div className="p-4 bg-[#05070a] border border-[#1e2a3a]">
                  <h4 className="font-arcade text-xs text-[#4fe3ff] mb-2">
                    🍏 IOS SAFARI PWA
                  </h4>
                  <p className="text-slate-400 leading-snug">
                    Tap the <strong>Share</strong> button at bottom, then tap <strong>"Add to Home Screen"</strong> for full-screen offline execution.
                  </p>
                </div>
                <div className="p-4 bg-[#05070a] border border-[#1e2a3a]">
                  <h4 className="font-arcade text-xs text-[#6bff9e] mb-2">
                    🤖 ANDROID / CHROME PWA
                  </h4>
                  <p className="text-slate-400 leading-snug">
                    Tap the <strong>(⋮) Menu</strong> at top-right, then select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* =========================================================================
            5. RETRO TERMINAL BOOT STREAM & CACHE PURGE
            ========================================================================= */}
        <div className="bg-[#05070a] border border-[#1e2a3a] p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-terminal text-sm sm:text-base text-[#6bff9e] truncate w-full sm:w-auto">
            <span className="animate-pulse">▶</span>
            <span className="tracking-wider">{TERMINAL_BOOT_LINES[bootLineIdx]}</span>
          </div>

          <button
            onClick={handleClearCache}
            onMouseEnter={() => SFX.hover()}
            className="font-arcade text-[9px] text-slate-500 hover:text-rose-400 uppercase tracking-widest transition-colors shrink-0"
          >
            [ PURGE ROM BUFFER & CACHE ]
          </button>
        </div>

      </div>
    </div>
  );
};

export default HeroUpload;
