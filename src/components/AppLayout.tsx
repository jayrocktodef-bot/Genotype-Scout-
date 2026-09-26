/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Dna } from 'lucide-react';
import Navigation from './Navigation';
import HeroUpload from './HeroUpload';
import AdBanner from './AdBanner';
import { GenotypeParser } from './GenotypeParser';
import { MethodologyPage } from './MethodologyPage';
import { MethodologyModal } from './MethodologyModal';
import { LegalOnboardingModal } from './LegalOnboardingModal';
import { ModuleIndexModal, IndexItem } from './ModuleIndexModal';
import { useLegalConsentStore } from '../stores/useLegalConsentStore';
import { GenomicsErrorBanner, PwaServiceWorkerManager } from '../features/common';

export interface AppLayoutProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  setCurrentApp: (app: string | null) => void;
  hasResults: boolean;
  theme: 'dark' | 'light';
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
  installPromptEvent: any;
  setInstallPromptEvent: (event: any) => void;
  handleInstallApp: () => void;
  resetApp: () => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
  pendingFiles: File[];
  setPendingFiles: React.Dispatch<React.SetStateAction<File[]>>;
  processFiles: (files: FileList | File[]) => void;
  processing: boolean;
  streamProgress: any;
  error: any;
  setError: (err: any) => void;
  isMethodologyOpen: boolean;
  closeMethodology: () => void;
  selectedMethodologyModule: string | null;
  currentApp: string | null;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeTab,
  setActiveTab,
  setCurrentApp,
  hasResults,
  theme,
  setTheme,
  installPromptEvent,
  setInstallPromptEvent,
  handleInstallApp,
  resetApp,
  fileRef,
  pendingFiles,
  setPendingFiles,
  processFiles,
  processing,
  streamProgress,
  error,
  setError,
  isMethodologyOpen,
  closeMethodology,
  selectedMethodologyModule,
  currentApp,
  children
}) => {
  const { hasAcceptedTerms, openLegalModal } = useLegalConsentStore();
  const [isIndexOpen, setIsIndexOpen] = useState(false);

  // Global Keyboard Shortcut: Cmd+K or Ctrl+K opens the Universal Module Index
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsIndexOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectModule = (item: IndexItem) => {
    setIsIndexOpen(false);
    if (item.type === 'external' && item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (item.id === 'legal') {
      openLegalModal();
      return;
    }
    if (item.id === 'methodology') {
      setActiveTab('methodology');
      setCurrentApp(null);
      return;
    }
    setCurrentApp(item.id);
    if (item.targetTab) {
      setActiveTab(item.targetTab);
    }
  };

  const handleProtectedProcessFiles = (files: FileList | File[]) => {
    if (!hasAcceptedTerms) {
      openLegalModal();
      return;
    }
    processFiles(files);
  };

  return (
    <div className={`bg-background text-foreground font-sans relative overflow-x-hidden ${!hasResults ? 'min-h-dvh bg-[#09090b]' : 'bg-[#09090b]'}`}>
      {/* Skip to Main Content for Screen Readers & Keyboard Navigation (WCAG 2.4.1) */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2.5 focus:bg-amber-400 focus:text-zinc-950 focus:font-black focus:text-xs focus:uppercase focus:tracking-wider focus:rounded-xl focus:shadow-2xl focus:ring-4 focus:ring-amber-500/50"
      >
        Skip to main content
      </a>

      {/* Screen Reader Live Region Announcer (WCAG 4.1.3) */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {processing ? 'Processing and parsing genetic data...' : error ? `Genomic error: ${error.message || 'Error occurred'}` : `Active section: ${activeTab}`}
      </div>

      {/* Dynamic Ambient Mesh */}
      {hasResults && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[140px] opacity-60 animate-pulse-soft motion-reduce:animate-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-600/5 rounded-full blur-[160px] opacity-40" />
          <div className="absolute top-[40%] right-[15%] w-[30%] h-[30%] bg-teal-500/[0.03] rounded-full blur-[120px] opacity-50" />
        </div>
      )}

      <div className="relative z-10">
        <Navigation 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentApp(null);
          }} 
          onGoHome={() => {
            setActiveTab('dashboard');
            setCurrentApp(null);
          }}
          onUploadNew={() => {
            if (!hasAcceptedTerms) {
              openLegalModal();
              return;
            }
            if (fileRef.current) {
              fileRef.current.value = '';
              fileRef.current.click();
            }
          }}
          onOpenLegal={openLegalModal}
          onOpenIndex={() => setIsIndexOpen(true)}
          hasResults={hasResults}
          theme={theme}
          onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          isInstallable={!!installPromptEvent}
          onInstallApp={handleInstallApp}
          onReset={resetApp}
        />

        <input 
          ref={fileRef} 
          type="file" 
          className="hidden" 
          accept="*" 
          multiple 
          onChange={(e) => {
            if (!hasAcceptedTerms) {
              openLegalModal();
              e.target.value = '';
              return;
            }
            if (e.target.files && e.target.files.length > 0) {
              setError(null);
              const newFiles = Array.from(e.target.files);
              setPendingFiles(prev => [...prev, ...newFiles]);
              e.target.value = '';
            }
          }} 
        />

        {activeTab === 'methodology' ? (
          <main id="main-content" tabIndex={-1} className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 focus:outline-none">
            <MethodologyPage 
              activeTab={activeTab} 
              initialModuleId={selectedMethodologyModule || currentApp || undefined} 
              onBack={() => {
                setActiveTab('dashboard');
                setCurrentApp(null);
              }}
            />
            <div className="mt-8 max-w-4xl mx-auto">
              <AdBanner format="auto" className="rounded-2xl" />
            </div>
          </main>
        ) : !hasResults ? (
          <main id="main-content" tabIndex={-1} className="max-w-[1360px] mx-auto px-1 sm:px-6 md:px-8 pt-24 sm:pt-28 focus:outline-none">
            <GenomicsErrorBanner error={error} variant="card" onDismiss={() => setError(null)} />

            {processing && (
              <div role="status" aria-live="polite">
                <GenotypeParser streamProgress={streamProgress} onCancel={resetApp} />
              </div>
            )}

            {!processing && (
              (activeTab === 'dashboard' || activeTab === 'desktop') ? (
                <>
                  <HeroUpload 
                    onFiles={(files) => handleProtectedProcessFiles(files)} 
                    processing={processing} 
                    onReset={resetApp}
                  />
                  <div className="max-w-4xl mx-auto mt-8 px-4">
                    <AdBanner format="auto" className="rounded-2xl" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-xl mx-auto">
                  <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/10">
                    <Dna className="w-10 h-10 text-amber-400" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2">
                    Dataset Required for {activeTab.replace(/_/g, ' ').toUpperCase()}
                  </h2>
                  <p className="text-sm text-zinc-400 max-w-md mb-8 leading-relaxed">
                    To view this genomic analysis module, upload your raw microarray or sequencing DNA file (23andMe, AncestryDNA, FTDNA, WGS, or VCF).
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        if (!hasAcceptedTerms) {
                          openLegalModal();
                          return;
                        }
                        fileRef.current?.click();
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
                    >
                      Upload DNA File
                    </button>
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold uppercase text-xs tracking-wider rounded-xl transition-all border border-zinc-700 active:scale-95 cursor-pointer"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              )
            )}
          </main>
        ) : (
          <>
            <GenomicsErrorBanner error={error} variant="bar" onDismiss={() => setError(null)} />

            {processing && (
              <div role="status" aria-live="polite" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <GenotypeParser streamProgress={streamProgress} onCancel={resetApp} />
              </div>
            )}

            {pendingFiles.length > 0 && (
              <div className="fixed top-10 left-0 right-0 z-50 px-6 py-3 bg-teal-900/95 border-b border-teal-500/30 flex items-center justify-between gap-4">
                <span className="text-teal-200 text-xs font-bold">{pendingFiles.length} Kit(s) pending — {pendingFiles.map(f => f.name).join(', ')}</span>
                <div className="flex gap-2">
                  <button onClick={() => setPendingFiles([])} className="px-3 py-1.5 text-xs font-black text-teal-400 hover:text-teal-200 border border-teal-700 rounded-lg">Cancel</button>
                  <button onClick={() => { handleProtectedProcessFiles(pendingFiles); setPendingFiles([]); }} className="px-4 py-1.5 text-xs font-black bg-teal-600 hover:bg-teal-500 text-white rounded-lg">Analyze</button>
                </div>
              </div>
            )}

            <main id="main-content" tabIndex={-1} className="focus:outline-none">
              {children}
            </main>
          </>
        )}

        <MethodologyModal
          isOpen={isMethodologyOpen}
          onClose={closeMethodology}
          activeModule={selectedMethodologyModule || currentApp}
          activeTab={activeTab}
        />

        <ModuleIndexModal
          isOpen={isIndexOpen}
          onClose={() => setIsIndexOpen(false)}
          onSelectModule={handleSelectModule}
        />

        <LegalOnboardingModal />

        <PwaServiceWorkerManager onInstallPromptChange={setInstallPromptEvent} />
      </div>
    </div>
  );
};
