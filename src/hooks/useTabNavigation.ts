import { useState, useEffect, useCallback } from 'react';
import { useNavigationStore } from '../stores/useNavigationStore';

export type MainTabType = 
  | 'dashboard' 
  | 'summary' 
  | 'autosomal' 
  | 'ancestry' 
  | 'history' 
  | 'health_traits' 
  | 'markers' 
  | 'rare_variants' 
  | 'debug' 
  | 'methodology' 
  | 'desktop' 
  | 'kit_comparison' 
  | 'integrity';

const VALID_TABS = new Set<MainTabType>([
  'dashboard',
  'summary',
  'autosomal',
  'ancestry',
  'history',
  'health_traits',
  'markers',
  'rare_variants',
  'debug',
  'methodology',
  'desktop',
  'kit_comparison',
  'integrity',
]);

function getTabFromHash(): MainTabType | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (VALID_TABS.has(hash as MainTabType)) {
    return hash as MainTabType;
  }
  return null;
}

/**
 * useTabNavigation
 * 
 * Synchronizes the active tab with the browser URL hash (#tab-name).
 * Enables:
 * 1. Deep linking (e.g. sharing / bookmarking #markers or #history)
 * 2. Full browser Back/Forward history navigation
 * 3. Graceful fallback to default 'dashboard'
 */
export function useTabNavigation(defaultTab: MainTabType = 'dashboard') {
  const [activeTab, setActiveTabState] = useState<MainTabType>(() => {
    return getTabFromHash() || defaultTab;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const tabFromHash = getTabFromHash();
      const nextTab = tabFromHash || defaultTab;
      setActiveTabState(nextTab);
      useNavigationStore.getState().setActiveTab(nextTab);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [defaultTab]);

  const setActiveTab = useCallback((newTab: MainTabType) => {
    setActiveTabState(newTab);
    useNavigationStore.getState().setActiveTab(newTab);
    if (typeof window !== 'undefined') {
      const currentHash = window.location.hash.replace(/^#\/?/, '').trim();
      if (currentHash !== newTab) {
        // Use history.pushState to create a navigable history entry
        window.history.pushState(null, '', `#${newTab}`);
      }
    }
  }, []);

  return [activeTab, setActiveTab] as const;
}
