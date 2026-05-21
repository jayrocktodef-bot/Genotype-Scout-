import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  Share2, 
  FileCheck, 
  Lock, 
  History, 
  Dna, 
  QrCode, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  EyeOff, 
  CloudRain
} from "lucide-react";
import { googleSignIn, initAuth, getAccessToken, logout } from "../services/googleAuth";
import { createGoogleSlidesPassport } from "../services/googleSlidesService";

interface ResultsPassportExporterProps {
  dataset: any;
}

export const ResultsPassportExporter: React.FC<ResultsPassportExporterProps> = ({ dataset }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [exportStatus, setExportStatus] = useState<"idle" | "authenticating" | "creating_deck" | "applying_layout" | "complete" | "error">("idle");
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Initialize Auth listeners
  useEffect(() => {
    const unsubscribe = initAuth(
      (firebaseUser, cachedToken) => {
        setUser(firebaseUser);
        setToken(cachedToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorDetails(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setErrorDetails(err?.message || "Google Authentication failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setNeedsAuth(true);
    setExportStatus("idle");
    setExportedUrl(null);
  };

  const handleExportToSlides = async () => {
    let currentToken = token;
    setExportStatus("authenticating");
    setErrorDetails(null);

    try {
      if (!currentToken) {
        // Re-request login if token got lost or expired
        const result = await googleSignIn();
        if (result) {
          currentToken = result.accessToken;
          setToken(currentToken);
          setUser(result.user);
          setNeedsAuth(false);
        } else {
          throw new Error("Missing active Google Storage permissions.");
        }
      }

      setExportStatus("creating_deck");
      // Orchestrate standard Slides compilation
      const presentationId = await createGoogleSlidesPassport(dataset, currentToken);
      
      setExportStatus("complete");
      setExportedUrl(`https://docs.google.com/presentation/d/${presentationId}/edit`);
    } catch (err: any) {
      console.error("Google Slides creation failed:", err);
      setExportStatus("error");
      setErrorDetails(err?.message || "Internal API write error. Verify Google Account permissions.");
    }
  };

  // Extract variables for local visual passport
  const yHaplo = dataset.predictedYDNA?.predicted?.name || "Not Detected / Female";
  const mtHaplo = dataset.predictedMtDNA?.predicted || "Not Detected";
  const chipName = dataset.chip || "GenScout Standard Core";
  const markerCount = dataset.snpCount || 10400;

  // Modern populations list
  const primaryOracle = dataset.analysis?.oracleResults?.primary || {};
  const continentalScores = primaryOracle.continentalScores || {};
  const subPopulations = primaryOracle.subPopulations || {};
  const topContinent = Object.entries(continentalScores)
    .sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "Global Citizen";

  const topPopulations = Object.entries(subPopulations)
    .map(([code, list]: [string, any]) => list?.[0]?.name || code)
    .slice(0, 3);

  // Pseudo-Passport Number based on file hash
  const getPassportNumber = () => {
    let hash = 0;
    const str = dataset.name || "DefaultExplorer";
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().substring(0, 6);
    return `GS-${hex || "9B420A"}`;
  };

  return (
    <div className="space-y-10" id="passport-tab-wrapper">
      {/* Exporter UI Controls */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-xl text-teal-400">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Passport Export Station</h3>
            </div>
            <p className="text-sm text-slate-500 max-w-xl">
              Export a detailed, design-centric <strong className="text-slate-700">Genomic Passport presentation</strong> directly to your Google Slides (Google Drive), structured perfectly with beautiful progress bars, lineage trees, and history clusters.
              <span className="block mt-2 font-semibold text-teal-600">🛡️ Zero Health and Wellness data is transmitted or exported. Complete privacy firewall.</span>
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            {needsAuth ? (
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="gsi-material-button w-full sm:w-auto justify-center"
                id="gsi-login-btn"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents font-bold text-xs tracking-wider">Connect Google Account</span>
                </div>
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between bg-slate-100/80 px-4 py-2 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{user?.displayName || "Google User"}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-[10px] font-bold text-slate-400 hover:text-red-500 underline ml-4"
                  >
                    Logout
                  </button>
                </div>

                <button
                  onClick={handleExportToSlides}
                  disabled={exportStatus !== "idle" && exportStatus !== "complete" && exportStatus !== "error"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-teal-400 font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all disabled:opacity-55"
                  id="google-slides-export-btn"
                >
                  <Share2 className="w-4 h-4" />
                  {exportStatus === "idle" && "Build Google Slides Deck"}
                  {exportStatus === "authenticating" && "Verifying Security Tokens..."}
                  {exportStatus === "creating_deck" && "Drafting Slide Presentations..."}
                  {exportStatus === "applying_layout" && "Compiling Vector Shapes..."}
                  {exportStatus === "complete" && "Slide Deck Compiled!"}
                  {exportStatus === "error" && "Rebuild Slide Presentation"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Status / Actions Callout */}
        <AnimatePresence mode="wait">
          {errorDetails && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-800">Presentation Build Interrupted</h4>
                <p className="text-xs text-red-600 mt-1">{errorDetails}</p>
              </div>
            </motion.div>
          )}

          {exportStatus === "complete" && exportedUrl && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-black text-emerald-900 uppercase tracking-wide">Passport Created Successfully!</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">Your bespoke slide deck is now active in your Google Drive folder.</p>
                </div>
              </div>
              <a 
                href={exportedUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all text-center"
              >
                Open Slide Deck ↗
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Screenshot Passport Container */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="text-center space-y-1">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Screenshot Portfolio</h4>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Your Biometric Ancestry Visa Card</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">This card is designed perfectly to fit a standard mobile crop or browser screenshot. Share your genome securely!</p>
        </div>

        {/* Premium Visa Passport Frame */}
        <div 
          className="relative bg-slate-950 text-slate-100 max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-[1.586/1]"
          id="visual-screenshot-passport-card"
        >
          {/* Passport Grid Gridline watermarks */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-25"></div>

          {/* Golden stamp / holographic sticker top right */}
          <div className="absolute top-10 right-10 flex flex-col items-center justify-center border border-teal-500/30 bg-teal-950/20 rounded-full w-24 h-24 text-center p-2 opacity-85 select-none rotate-6 leading-tight">
            <span className="text-[8px] font-black tracking-widest text-teal-400 uppercase">GENOTYPE</span>
            <Dna className="w-5 h-5 text-teal-300 my-1" />
            <span className="text-[7px] font-bold text-teal-500/80">SECURED LOCAL</span>
          </div>

          <div className="p-8 h-full flex flex-col justify-between relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Dna className="w-6 h-6 text-teal-400" />
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-100">Genomic Passport Visa</h3>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">International Bio-Geographical Registry</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black text-amber-500 tracking-widest uppercase">{getPassportNumber()}</span>
                <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Passport Number</p>
              </div>
            </div>

            {/* Passport Core Biometric Metadata */}
            <div className="grid grid-cols-12 gap-6 my-auto items-center">
              {/* Photo Area (Watermark Bio-Avatar) */}
              <div className="col-span-4 aspect-square bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group select-none">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                
                {/* Fingerprint / Genetic waveform placeholder */}
                <QrCode className="w-16 h-16 text-slate-800/80 mb-1" />
                <Lock className="w-3.5 h-3.5 text-teal-500/80 absolute bottom-3" />
                
                {/* Scan line effect */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-teal-500/20 shadow-lg shadow-teal-500 animate-scanner"></div>
              </div>

              {/* Data Rows */}
              <div className="col-span-8 grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Document Class</p>
                  <p className="text-xs font-bold text-slate-200 mt-0.5">GEN-S CORES</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Primary Admixture</p>
                  <p className="text-xs font-bold text-slate-200 mt-0.5">{topContinent}</p>
                </div>
                
                <div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Surname / Name</p>
                  <p className="text-xs font-black text-teal-400 mt-0.5 uppercase truncate max-w-[150px]">{dataset.name?.replace(/[\W_]+/g, " ") || "UNKNOWN EXPLORER"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Source Chip</p>
                  <p className="text-xs font-bold text-slate-200 mt-0.5 truncate max-w-[120px]">{chipName}</p>
                </div>

                <div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Paternal Haplogroup</p>
                  <p className="text-xs font-black text-slate-100 mt-0.5">{yHaplo}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Maternal Haplogroup</p>
                  <p className="text-xs font-black text-slate-100 mt-0.5">{mtHaplo}</p>
                </div>
              </div>
            </div>

            {/* Footer Zone with Machine Readable Zone look (MRZ) */}
            <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
              <div className="font-mono text-[9px] text-slate-500 tracking-[0.15em] uppercase select-all">
                P&lt;SCT{getPassportNumber().replace("-", "")}EXPLORER&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                <br />
                {yHaplo.padEnd(8, "<").substring(0, 8)}&lt;&lt;{mtHaplo.padEnd(8, "<").substring(0, 8)}&lt;{markerCount}SNPS&lt;&lt;&lt;&lt;GENSCOUT
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">Secure Audit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
