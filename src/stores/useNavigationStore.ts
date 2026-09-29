import { create } from 'zustand';
import { MainTabType } from '../hooks/useTabNavigation';

export type AncestrySubTab = 'oracle' | 'painter' | 'scout';
export type HealthSubTab = 'wellness' | 'traits' | 'blood' | 'prs';
export type HistorySubTab = 'modern' | 'ancient';
export type AncientSubTab = 'admixture' | 'matches' | 'archaic';
export type HaploType = 'paternal' | 'maternal';

interface NavigationState {
  activeTab: MainTabType;
  currentApp: string | null;
  activeAncestrySubTab: AncestrySubTab;
  activeHealthSubTab: HealthSubTab;
  activeHistorySubTab: HistorySubTab;
  activeAncientSubTab: AncientSubTab;
  activeCategory: string;
  activeHaploType: HaploType;
  isMethodologyOpen: boolean;
  selectedMethodologyModule: string | null;

  // Actions
  setActiveTab: (tab: MainTabType) => void;
  setCurrentApp: (app: string | null) => void;
  setActiveAncestrySubTab: (subTab: AncestrySubTab) => void;
  setActiveHealthSubTab: (subTab: HealthSubTab) => void;
  setActiveHistorySubTab: (subTab: HistorySubTab) => void;
  setActiveAncientSubTab: (subTab: AncientSubTab) => void;
  setActiveCategory: (cat: string) => void;
  setActiveHaploType: (haplo: HaploType) => void;
  openMethodology: (moduleId?: string | null) => void;
  closeMethodology: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeTab: 'dashboard',
  currentApp: null,
  activeAncestrySubTab: 'oracle',
  activeHealthSubTab: 'wellness',
  activeHistorySubTab: 'modern',
  activeAncientSubTab: 'admixture',
  activeCategory: 'Health',
  activeHaploType: 'paternal',
  isMethodologyOpen: false,
  selectedMethodologyModule: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setCurrentApp: (app) => set({ currentApp: app }),
  setActiveAncestrySubTab: (subTab) => set({ activeAncestrySubTab: subTab }),
  setActiveHealthSubTab: (subTab) => set({ activeHealthSubTab: subTab }),
  setActiveHistorySubTab: (subTab) => set({ activeHistorySubTab: subTab }),
  setActiveAncientSubTab: (subTab) => set({ activeAncientSubTab: subTab }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setActiveHaploType: (haplo) => set({ activeHaploType: haplo }),
  openMethodology: (moduleId) => set((state) => ({
    isMethodologyOpen: true,
    selectedMethodologyModule: moduleId || state.currentApp,
  })),
  closeMethodology: () => set({
    isMethodologyOpen: false,
    selectedMethodologyModule: null,
  }),
}));

export function tabToDefaultApp(
  tab: MainTabType,
  ancestrySub: AncestrySubTab = 'oracle',
  healthSub: HealthSubTab = 'wellness'
): string | null {
  switch (tab) {
    case 'summary':
      return 'profile';
    case 'ancestry':
      return ancestrySub === 'painter' ? 'chromosome_painter' : ancestrySub === 'scout' ? 'ancestry_scout' : 'ancestry_oracle';
    case 'history':
      return 'ancient_dna';
    case 'health_traits':
      return healthSub === 'wellness' ? 'health' : healthSub === 'blood' ? 'blood' : 'traits';
    case 'markers':
    case 'autosomal':
      return 'markers';
    case 'rare_variants':
      return 'rare_variants';
    case 'kit_comparison':
      return 'kit_comparison';
    case 'integrity':
      return 'integrity';
    case 'methodology':
      return 'methodology';
    case 'dashboard':
    case 'desktop':
    default:
      return null;
  }
}

