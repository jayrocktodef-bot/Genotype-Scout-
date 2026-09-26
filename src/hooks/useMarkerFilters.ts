import { useState, useCallback, useEffect } from 'react';

export function useMarkerFilters() {
  const [statusFilter, setStatusFilter] = useState<'matched' | 'unmatched' | 'not_tested' | 'all'>('all');
  const [significanceFilter, setSignificanceFilter] = useState<string>('all');
  const [continentFilter, setContinentFilter] = useState<string>('all');
  const [geneFilter, setGeneFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [explorerSearch, setExplorerSearch] = useState<string>('');
  const [expandedSnps, setExpandedSnps] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(['Ancestry', 'Health', 'Pharmacogenomics', 'Traits', 'Carrier Status'])
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const expandAll = useCallback((categories: string[]) => {
    setExpandedCategories(new Set(categories));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const toggleExpand = useCallback((rsid: string) => {
    setExpandedSnps((prev) => {
      const next = new Set(prev);
      if (next.has(rsid)) next.delete(rsid);
      else next.add(rsid);
      return next;
    });
  }, []);

  return {
    statusFilter,
    setStatusFilter,
    significanceFilter,
    setSignificanceFilter,
    continentFilter,
    setContinentFilter,
    geneFilter,
    setGeneFilter,
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    explorerSearch,
    setExplorerSearch,
    expandedSnps,
    setExpandedSnps,
    expandedCategories,
    setExpandedCategories,
    expandAll,
    collapseAll,
    toggleCategory,
    toggleExpand,
  };
}
