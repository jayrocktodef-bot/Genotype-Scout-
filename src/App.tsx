/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import ScoutWorkspace from './components/ScoutWorkspace';
import { WorkspaceRouter } from './components/WorkspaceRouter';
import { AppLayout } from './components/AppLayout';
import { useTabNavigation } from './hooks/useTabNavigation';
import { useNavigationStore } from './stores/useNavigationStore';
import { useGenotypeAnalysis } from './hooks/useGenotypeAnalysis';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useTabNavigation('dashboard');
  const {
    currentApp,
    setCurrentApp,
    activeAncestrySubTab,
    setActiveAncestrySubTab,
    activeHealthSubTab,
    setActiveHealthSubTab,
    activeHistorySubTab,
    setActiveHistorySubTab,
    activeAncientSubTab,
    setActiveAncientSubTab,
    activeHaploType,
    setActiveHaploType,
    isMethodologyOpen,
    selectedMethodologyModule,
    openMethodology: handleOpenMethodology,
    closeMethodology,
  } = useNavigationStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleInstallApp = async () => {
    if (!installPromptEvent) return;
    installPromptEvent.prompt();
    const { outcome } = await installPromptEvent.userChoice;
    console.log(`User installation choice outcome: ${outcome}`);
    setInstallPromptEvent(null);
  };

  const analysis = useGenotypeAnalysis({
    activeTab,
    setActiveTab,
    currentApp,
    setCurrentApp,
    activeAncestrySubTab,
    activeHealthSubTab
  });

  return (
    <AppLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      setCurrentApp={setCurrentApp}
      hasResults={Boolean(analysis.results)}
      theme={theme}
      setTheme={setTheme}
      installPromptEvent={installPromptEvent}
      setInstallPromptEvent={setInstallPromptEvent}
      handleInstallApp={handleInstallApp}
      resetApp={analysis.resetApp}
      fileRef={fileRef}
      pendingFiles={analysis.pendingFiles}
      setPendingFiles={analysis.setPendingFiles}
      processFiles={analysis.processFiles}
      processing={analysis.processing}
      streamProgress={analysis.streamProgress}
      error={analysis.error}
      setError={analysis.setError}
      isMethodologyOpen={isMethodologyOpen}
      closeMethodology={closeMethodology}
      selectedMethodologyModule={selectedMethodologyModule}
      currentApp={currentApp}
    >
      <ScoutWorkspace
        oracleResults={analysis.oracleResults}
        populationProximity={analysis.populationProximity}
        dataset={analysis.datasets[analysis.activeDatasetIndex]}
        userSnps={analysis.snpMaps.current[analysis.activeDatasetIndex] || {}}
        datasets={analysis.datasets}
        activeDatasetIndex={analysis.activeDatasetIndex}
        setActiveDatasetIndex={analysis.setActiveDatasetIndex}
        onNavigateToTab={(tab: string, subTab?: string) => {
          setActiveTab(tab as any);
          if (tab === 'ancestry' && subTab) {
            setActiveAncestrySubTab(subTab as any);
          } else if (tab === 'health_traits' && subTab) {
            setActiveHealthSubTab(subTab as any);
          } else if (tab === 'history' && subTab) {
            setActiveHistorySubTab(subTab as any);
          }
        }}
        onReset={analysis.resetApp}
        currentApp={currentApp}
        onOpenApp={setCurrentApp}
        onOpenMethodology={handleOpenMethodology}
        onUploadNew={() => fileRef.current?.click()}
      >
        <WorkspaceRouter
          currentApp={currentApp}
          datasets={analysis.datasets}
          activeDatasetIndex={analysis.activeDatasetIndex}
          setActiveDatasetIndex={analysis.setActiveDatasetIndex}
          oracleResults={analysis.oracleResults}
          populationProximity={analysis.populationProximity}
          userSnps={analysis.snpMaps.current[analysis.activeDatasetIndex] || {}}
          famousMatches={analysis.famousMatches}
          healthWellnessMatches={analysis.healthWellnessMatches}
          userMatchedMitoTraits={analysis.userMatchedMitoTraits}
          activeHaploType={activeHaploType}
          setActiveHaploType={setActiveHaploType}
          activeYData={analysis.activeYData}
          activeMtData={analysis.activeMtData}
          treeSearchTerm={analysis.treeSearchTerm}
          setTreeSearchTerm={analysis.setTreeSearchTerm}
          activeAncientSubTab={activeAncientSubTab}
          setActiveAncientSubTab={setActiveAncientSubTab}
          ancientAdmixture={analysis.ancientAdmixture}
          archaicIntrogression={analysis.archaicIntrogression}
          individualMatches={analysis.individualMatches}
          activeTab={activeTab}
          selectedMethodologyModule={selectedMethodologyModule}
          onOpenMethodology={handleOpenMethodology}
        />
      </ScoutWorkspace>
    </AppLayout>
  );
}
