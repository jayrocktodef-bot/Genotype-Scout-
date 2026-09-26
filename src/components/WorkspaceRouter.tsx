/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { History, User, Flame, BookOpen } from 'lucide-react';

const FamousMatches = lazy(() => import("./FamousMatches").then(m => ({ default: m.FamousMatches })));
const PopulationComparisonTab = lazy(() => import("./PopulationComparisonTab").then(m => ({ default: m.PopulationComparisonTab })));
const MarkerBenchmarks = lazy(() => import("./MarkerBenchmarks").then(m => ({ default: m.MarkerBenchmarks })));
const SubpopulationBento = lazy(() => import("./SubpopulationBento"));
const SubpopulationGlossaryTab = lazy(() => import("./SubpopulationGlossaryTab").then(m => ({ default: m.SubpopulationGlossaryTab })));
const HealthWellnessTab = lazy(() => import("./HealthWellnessTab").then(m => ({ default: m.HealthWellnessTab })));
const GeneticMarkersBrowser = lazy(() => import("./GeneticMarkersBrowser").then(m => ({ default: m.GeneticMarkersBrowser })));
const BloodTypeView = lazy(() => import("./BloodTypeView").then(m => ({ default: m.BloodTypeView })));
const HealthTraitsTab = lazy(() => import("./HealthTraitsTab").then(m => ({ default: m.HealthTraitsTab })));
const ModernAncestryOracle = lazy(() => import("./ModernAncestryOracle").then(m => ({ default: m.ModernAncestryOracle })));
const NaiveAncestryOracle = lazy(() => import("./NaiveAncestryOracle").then(m => ({ default: m.NaiveAncestryOracle })));
const ChromosomePainterView = lazy(() => import("./ChromosomePainterView").then(m => ({ default: m.ChromosomePainterView })));
const AncientAncestryOracle = lazy(() => import("./AncientAncestryOracle").then(m => ({ default: m.AncientAncestryOracle })));
const IntegrityModule = lazy(() => import("./IntegrityModule"));
const RareVariantsView = lazy(() => import("./RareVariantsView"));
const ArchaicIntrogressionView = lazy(() => import("./ArchaicIntrogressionView").then(m => ({ default: m.ArchaicIntrogressionView })));
const KitComparisonModule = lazy(() => import("./KitComparisonModule").then(m => ({ default: m.KitComparisonModule })));
import { MethodologyPage } from './MethodologyPage';
import { ProfileSummary } from './ProfileSummary';
import { YDNAView } from './YDNAView';
import { MTDNAView } from './MTDNAView';
import AdBanner from './AdBanner';

export interface WorkspaceRouterProps {
  currentApp: string | null;
  datasets: any[];
  activeDatasetIndex: number;
  setActiveDatasetIndex: (idx: number) => void;
  oracleResults: any;
  populationProximity: any[];
  userSnps: Record<string, string>;
  famousMatches: any[];
  healthWellnessMatches: any[];
  userMatchedMitoTraits: any[];
  activeHaploType: string;
  setActiveHaploType: (type: 'paternal' | 'maternal') => void;
  activeYData: any;
  activeMtData: any;
  treeSearchTerm: string;
  setTreeSearchTerm: (term: string) => void;
  activeAncientSubTab: 'admixture' | 'matches' | 'archaic';
  setActiveAncientSubTab: (tab: 'admixture' | 'matches' | 'archaic') => void;
  ancientAdmixture: any[];
  archaicIntrogression: any;
  individualMatches: any[];
  activeTab: string;
  selectedMethodologyModule: string | null;
  onOpenMethodology: (moduleId: string) => void;
}

export const WorkspaceRouter: React.FC<WorkspaceRouterProps> = ({
  currentApp,
  datasets,
  activeDatasetIndex,
  setActiveDatasetIndex,
  oracleResults,
  populationProximity,
  userSnps,
  famousMatches,
  healthWellnessMatches,
  userMatchedMitoTraits,
  activeHaploType,
  setActiveHaploType,
  activeYData,
  activeMtData,
  treeSearchTerm,
  setTreeSearchTerm,
  activeAncientSubTab,
  setActiveAncientSubTab,
  ancientAdmixture,
  archaicIntrogression,
  individualMatches,
  activeTab,
  selectedMethodologyModule,
  onOpenMethodology
}) => {
  const currentDataset = datasets[activeDatasetIndex];

  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-24 text-slate-500 animate-pulse dark:text-slate-400">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4" />
          <p className="font-bold tracking-widest uppercase text-xs">Loading Tool...</p>
        </div>
      }
    >
      {currentApp === 'profile' && (
        <div className="space-y-8 animate-fade-in">
          <ProfileSummary 
            datasets={datasets} 
            activeDatasetIndex={activeDatasetIndex} 
            oracleResults={oracleResults} 
            populationProximity={populationProximity}
            userSnps={userSnps}
            famousMatches={famousMatches}
            healthImpacts={healthWellnessMatches}
            onOpenMethodology={() => onOpenMethodology('profile')}
          />
        </div>
      )}

      {currentApp === 'glossary' && (
        <div className="space-y-8 animate-fade-in">
          <SubpopulationGlossaryTab 
            onOpenMethodology={() => onOpenMethodology('glossary')}
          />
        </div>
      )}

      {currentApp === 'ancestry_oracle' && (
        <div className="space-y-8 animate-fade-in">
          <SubpopulationBento 
            precalculated={currentDataset?.analysis?.subpopulationOracle}
            userGenotypes={Object.entries(userSnps).map(([rsid, genotype]) => ({ rsid, genotype }))}
            onOpenMethodology={() => onOpenMethodology('ancestry_oracle')}
          />
          <ModernAncestryOracle 
            results={oracleResults} 
            dataset={currentDataset} 
            onOpenMethodology={() => onOpenMethodology('ancestry_oracle')} 
            mode="analyst" 
          />
        </div>
      )}

      {currentApp === 'chromosome_painter' && (
        <div className="animate-fade-in">
          <ChromosomePainterView 
            dataset={currentDataset}
            onOpenMethodology={() => onOpenMethodology('chromosome_painter')}
          />
        </div>
      )}

      {currentApp === 'ancestry_scout' && (
        <div className="animate-fade-in">
          <NaiveAncestryOracle 
            results={currentDataset?.analysis || {}} 
            userSnps={userSnps}
            onOpenMethodology={() => onOpenMethodology('ancestry_scout')} 
          />
        </div>
      )}

      {currentApp === 'haplogroups' && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="inline-flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <button 
                onClick={() => setActiveHaploType('paternal')}
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                  activeHaploType === 'paternal' 
                    ? 'bg-teal-600 text-white shadow-md scale-105' 
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                ♂️ Paternal
              </button>
              <button 
                onClick={() => setActiveHaploType('maternal')}
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                  activeHaploType === 'maternal' 
                    ? 'bg-teal-600 text-white shadow-md scale-105' 
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                ♀️ Maternal
              </button>
            </div>

            <button
              type="button"
              onClick={() => onOpenMethodology('haplogroups')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 text-xs font-black tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
              title="View Haplogroup Determination & Phylogeny Methodology"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>Methodology & Info</span>
            </button>
          </div>

          {activeHaploType === 'paternal' ? (
            <YDNAView 
              yData={activeYData} 
              treeSearchTerm={treeSearchTerm}
              setTreeSearchTerm={setTreeSearchTerm}
            />
          ) : (
            <MTDNAView 
              mtData={activeMtData} 
              treeSearchTerm={treeSearchTerm}
              setTreeSearchTerm={setTreeSearchTerm}
              matchedTraits={userMatchedMitoTraits}
            />
          )}
        </div>
      )}

      {currentApp === 'ancient_dna' && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-center">
            <div className="p-1.5 bg-slate-100 dark:bg-[#111213]/40 rounded-2xl inline-flex border border-slate-200 dark:border-white/5 shadow-inner">
              <button
                onClick={() => setActiveAncientSubTab('admixture')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeAncientSubTab === 'admixture' 
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md scale-105' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <History size={14} /> Ancient Admixture
              </button>
              <button
                onClick={() => setActiveAncientSubTab('matches')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeAncientSubTab === 'matches' 
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md scale-105' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <User size={14} /> Sample Matches
              </button>
              <button
                onClick={() => setActiveAncientSubTab('archaic')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeAncientSubTab === 'archaic' 
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md scale-105' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Flame size={14} /> Neanderthal & Denisovan
              </button>
            </div>
          </div>

          {activeAncientSubTab === 'admixture' ? (
            <div className="space-y-8 animate-fade-in">
              <AncientAncestryOracle 
                results={ancientAdmixture} 
                title="Deep Time Oracle" 
                subtitle="Ancient Admixture & Paleolithic Affinity"
                type="admixture"
                onOpenMethodology={() => onOpenMethodology('ancient_dna')} 
              />
              <ArchaicIntrogressionView results={archaicIntrogression} />
            </div>
          ) : activeAncientSubTab === 'archaic' ? (
            <div className="space-y-8 animate-fade-in">
              <ArchaicIntrogressionView results={archaicIntrogression} />
            </div>
          ) : (
            <AncientAncestryOracle 
              results={individualMatches} 
              title="Fossil Specimen Matches" 
              subtitle="Direct Genetic Affinity to Ancient Individuals"
              type="matches"
              onOpenMethodology={() => onOpenMethodology('ancient_dna')} 
            />
          )}
        </div>
      )}

      {currentApp === 'health' && (
        <div className="space-y-8 animate-fade-in">
          <HealthWellnessTab 
            impacts={healthWellnessMatches} 
            userSnps={userSnps} 
            mode="analyst"
            onOpenMethodology={() => onOpenMethodology('health')}
          />
        </div>
      )}

      {currentApp === 'traits' && (
        <div className="space-y-8 animate-fade-in">
          <HealthTraitsTab 
            matchedTraits={userMatchedMitoTraits}
            autosomalMarkers={currentDataset?.results || []}
            userSnps={userSnps}
            onOpenMethodology={() => onOpenMethodology('traits')}
          />
        </div>
      )}

      {currentApp === 'blood' && (
        <div className="animate-fade-in">
          <BloodTypeView 
            dataset={currentDataset} 
            onOpenMethodology={() => onOpenMethodology('blood')}
          />
        </div>
      )}

      {currentApp === 'rare_variants' && (
        <div className="animate-fade-in">
          <RareVariantsView 
            variants={currentDataset?.rareAndNovelVariants || []} 
            onOpenMethodology={() => onOpenMethodology('rare_variants')}
          />
        </div>
      )}

      {currentApp === 'markers' && (
        <div className="animate-fade-in">
          <GeneticMarkersBrowser 
            dataset={currentDataset}
            onOpenMethodology={() => onOpenMethodology('markers')}
          />
        </div>
      )}

      {currentApp === 'kit_comparison' && (
        <div className="space-y-8 animate-fade-in">
          <KitComparisonModule 
            datasets={datasets} 
            onOpenMethodology={() => onOpenMethodology('kit_comparison')}
          />
        </div>
      )}

      {currentApp === 'integrity' && (
        <div className="space-y-8 animate-fade-in">
          <IntegrityModule 
            dataset={currentDataset}
            datasets={datasets}
            activeDatasetIndex={activeDatasetIndex}
            setActiveDatasetIndex={setActiveDatasetIndex}
            onOpenMethodology={() => onOpenMethodology('integrity')}
          />
        </div>
      )}

      {currentApp === 'methodology' && (
        <>
          <MethodologyPage 
            activeTab={activeTab} 
            initialModuleId={selectedMethodologyModule || currentApp || undefined} 
          />
          <div className="mt-8">
            <AdBanner format="auto" className="rounded-2xl" />
          </div>
        </>
      )}
    </Suspense>
  );
};
