import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Dna, 
  ExternalLink, 
  Copy, 
  Check, 
  Grid, 
  List as ListIcon, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Sparkles, 
  Layers, 
  Activity, 
  Info,
  ArrowUpDown,
  FileSpreadsheet,
  FileJson,
  FileText,
  Globe,
  BookOpen
} from 'lucide-react';
import masterAims from '../data/master_aims_normalized.json';
import { CATEGORY_META, SIG_COLOR, CONTINENT_META, mapToRegion, SNP_LOOKUP } from '../genotypeData';

export interface MarkerRecord {
  markerId: string;
  rsid?: string;
  gene?: string;
  trait?: string;
  continent?: string;
  region?: string;
  subpop?: string | null;
  description?: string;
  alleles?: string[];
  significance?: string;
  category?: string;
  interpretations?: Record<string, string>;
  referenceUrl?: string;
  frequencies?: Record<string, number>;
  genotype?: string;
  status?: 'matched' | 'unmatched' | 'not_tested' | 'partial';
  chromosome?: string | number;
  position?: number;
  userGenotype?: string;
}

export function resolveMarkerRegion(m: any, dbEntry: any): string {
  // 1. Text inference check FIRST for strong, unambiguous diagnostic regional terms
  const text = `${m.trait || ''} ${m.description || ''} ${dbEntry?.trait || ''} ${dbEntry?.description || ''}`.toLowerCase();

  // Strong specific lineage keywords take precedence over potentially mismatched container tags
  if (text.includes('sahelian') || text.includes('senegambian') || text.includes('mandinka') || 
      text.includes('wolof') || text.includes('fula') || text.includes('bantu') || 
      text.includes('yoruba') || text.includes('khoe-san') || text.includes('nilotic') || text.includes('pygmy')) {
    return 'African';
  }
  if (text.includes('african-american') || text.includes('african american')) return 'African-American';
  if (text.includes('north african')) return 'North African';
  if (text.includes('central asian') || text.includes('siberian') || text.includes('altaian') || text.includes('yakut')) return 'Central Asian';
  if (text.includes('south asian') || text.includes('dravidian') || text.includes('indo-aryan') || text.includes('bengali') || text.includes('punjabi') || text.includes('gujarati') || text.includes('brahmin')) return 'South Asian';
  if (text.includes('east asian') || text.includes('han chinese') || text.includes('japanese') || text.includes('korean')) return 'East Asian';
  if (text.includes('native american') || text.includes('indigenous american') || text.includes('amerindian') || text.includes('mayan') || text.includes('pima') || text.includes('quechua')) return 'Native American';
  if (text.includes('oceanian') || text.includes('melanesian') || text.includes('polynesian') || text.includes('papuan')) return 'Oceanian';
  if (text.includes('middle east') || text.includes('near east') || text.includes('levant') || text.includes('arabian') || text.includes('ashkenazi') || text.includes('sephardic')) return 'Middle Eastern';
  if (text.includes('sub-saharan') || text.includes('african')) return 'African';
  if (text.includes('european') || text.includes('caucasian') || text.includes('celtic') || text.includes('slavic') || text.includes('germanic') || text.includes('scandinavian') || text.includes('iberian')) return 'European';

  // 2. Direct explicit region or continent property
  const explicit = m.region || m.continent || dbEntry?.region || dbEntry?.continent;
  if (explicit && explicit !== 'Global' && explicit !== 'Cosmopolitan' && explicit !== 'Multi-Way Informative') {
    return explicit === 'African American' ? 'African-American' : explicit;
  }

  // 3. Subpopulation tag
  const sub = m.subpop || m.subPopulation || dbEntry?.subpop || dbEntry?.subPopulation;
  if (sub) {
    const mapped = mapToRegion(sub);
    if (mapped !== 'Global') return mapped;
  }

  if (explicit) return explicit === 'African American' ? 'African-American' : explicit;
  return 'Global';
}

export function getRegionMeta(region?: string) {
  if (!region) return { color: '#10b981', icon: '🌐' };
  const norm = region === 'African American' ? 'African-American' : region;
  return (CONTINENT_META as any)[norm] || (CONTINENT_META as any)[mapToRegion(region)] || { color: '#10b981', icon: '🌐' };
}

interface GeneticMarkersBrowserProps {
  dataset: any;
  onOpenMethodology?: () => void;
}

const CHROMOSOME_LIST = [
  'All',
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', 'X', 'Y', 'MT'
];

export const GeneticMarkersBrowser: React.FC<GeneticMarkersBrowserProps> = ({ dataset, onOpenMethodology }) => {
  // --- State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedChr, setSelectedChr] = useState<string>('All');
  const [selectedSignificance, setSelectedSignificance] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'matched' | 'partial' | 'unmatched'>('all');
  const [zygosityFilter, setZygosityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'rsid' | 'gene' | 'category' | 'significance' | 'chr'>('default');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(60);

  // Modal / Flyout State
  const [activeMarker, setActiveMarker] = useState<MarkerRecord | null>(null);
  const [copiedRsid, setCopiedRsid] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Category switch helper that resets region filter
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedRegion('All');
    setCurrentPage(1);
  };

  // --- Source Data Extraction ---
  const rawResults: MarkerRecord[] = useMemo(() => {
    return dataset?.results || [];
  }, [dataset]);

  // Enrich raw markers with SNP_LOOKUP and masterAims for chromosomes and positions
  const enrichedResults: MarkerRecord[] = useMemo(() => {
    const aimsMap = masterAims as Record<string, any>;
    return rawResults.map((m: any) => {
      const rsid = m.rsid || m.markerId || '';
      const cleanRsid = rsid.toLowerCase();
      const dbEntry = SNP_LOOKUP.get(cleanRsid) || aimsMap[rsid] || aimsMap[cleanRsid];
      
      const rawChr = m.chromosome || m.chr || dbEntry?.chromosome || dbEntry?.chr;
      const chr = rawChr ? String(rawChr).replace(/^chr/i, '') : 'Auto';
      const pos = m.position || m.pos || dbEntry?.position || dbEntry?.pos || 0;
      const alleles = m.alleles || dbEntry?.alleles || [];
      const resolvedRegion = resolveMarkerRegion(m, dbEntry);
      const gene = m.gene || dbEntry?.gene || (m.category === 'Ancestry' || (resolvedRegion && resolvedRegion !== 'Global') ? 'AIM Locus' : 'Intergenic');
      
      const rawTrait = m.trait || dbEntry?.trait || '';
      const rawDesc = m.description || dbEntry?.description || '';

      let trait = rawTrait;
      let description = rawDesc;

      const normTrait = (rawTrait || '').trim().toLowerCase();
      const normDesc = (rawDesc || '').trim().toLowerCase();

      // Deduplicate trait and description to avoid repeating identical sentences
      if (!trait && !description) {
        trait = resolvedRegion && resolvedRegion !== 'Global' ? `${resolvedRegion} Ancestry Tag` : 'Genomic Variant';
        description = resolvedRegion && resolvedRegion !== 'Global' ? `Ancestry Informative Marker for ${resolvedRegion} genetic lineage.` : '';
      } else if (normTrait && normDesc && (normTrait === normDesc || normDesc.startsWith(normTrait))) {
        // If trait is a full multi-word sentence (> 40 chars or starts with 'Empirical marker'), extract a concise tag
        if (rawTrait.length > 40 || rawTrait.startsWith('Empirical marker') || rawTrait.startsWith('Ancestry Informative')) {
          trait = dbEntry?.trait && dbEntry.trait !== rawTrait && dbEntry.trait.length <= 40
            ? dbEntry.trait
            : (resolvedRegion && resolvedRegion !== 'Global' ? `${resolvedRegion} Lineage AIM` : 'Ancestry Informative Marker');
        }
        description = rawDesc;
      } else if (!trait && description) {
        trait = resolvedRegion && resolvedRegion !== 'Global' ? `${resolvedRegion} Lineage AIM` : 'Ancestry Informative Marker';
      }

      const significance = m.significance || dbEntry?.significance || 'Low';
      const category = m.category || dbEntry?.category || ((resolvedRegion && resolvedRegion !== 'Global') ? 'Ancestry' : 'Other');

      return {
        ...m,
        continent: resolvedRegion,
        region: resolvedRegion,
        rsid: rsid || 'Unknown',
        chromosome: chr,
        position: Number(pos) || 0,
        alleles,
        gene,
        trait,
        significance,
        category,
        description
      };
    });
  }, [rawResults]);

  // --- Available Categories & Counts ---
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    enrichedResults.forEach(r => {
      if (r.category) set.add(r.category);
    });
    return ['All', ...Array.from(set).sort()];
  }, [enrichedResults]);

  // --- Available Regions & Counts for Ancestry Filtering ---
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    enrichedResults.forEach(r => {
      // In Ancestry category, or when All is selected, count regions for markers
      if (selectedCategory === 'All' || r.category === selectedCategory || (selectedCategory === 'Ancestry' && (r.category === 'Ancestry' || (r.region && r.region !== 'Global')))) {
        const rawReg = r.region || r.continent || 'Global';
        const reg = rawReg === 'African American' ? 'African-American' : rawReg;
        counts[reg] = (counts[reg] || 0) + 1;
      }
    });
    return counts;
  }, [enrichedResults, selectedCategory]);

  const regionsList = useMemo(() => {
    const priorityOrder = [
      'African',
      'European',
      'East Asian',
      'Native American',
      'South Asian',
      'Middle Eastern',
      'Central Asian',
      'North African',
      'Oceanian',
      'African-American',
      'Admixed American',
      'Cosmopolitan',
      'Multi-Way Informative',
      'Global'
    ];

    const present = Object.keys(regionCounts).filter(r => (regionCounts[r] || 0) > 0);
    present.sort((a, b) => {
      const idxA = priorityOrder.indexOf(a);
      const idxB = priorityOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return (regionCounts[b] || 0) - (regionCounts[a] || 0);
    });

    return ['All', ...present];
  }, [regionCounts]);

  // --- Chromosome Marker Counts ---
  const chrCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    enrichedResults.forEach(r => {
      const chrStr = String(r.chromosome).replace(/^chr/i, '');
      counts[chrStr] = (counts[chrStr] || 0) + 1;
    });
    return counts;
  }, [enrichedResults]);

  // --- Filtering & Sorting ---
  const filteredMarkers = useMemo(() => {
    return enrichedResults.filter(r => {
      // 1. Search filter
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matchesRsid = (r.rsid || '').toLowerCase().includes(q);
        const matchesGene = (r.gene || '').toLowerCase().includes(q);
        const matchesTrait = (r.trait || '').toLowerCase().includes(q);
        const matchesDesc = (r.description || '').toLowerCase().includes(q);
        const matchesContinent = (r.continent || '').toLowerCase().includes(q);
        const matchesRegion = (r.region || '').toLowerCase().includes(q);
        const matchesChr = String(r.chromosome || '').toLowerCase() === q || `chr${r.chromosome}`.toLowerCase() === q;
        if (!matchesRsid && !matchesGene && !matchesTrait && !matchesDesc && !matchesContinent && !matchesRegion && !matchesChr) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'All' && r.category !== selectedCategory) {
        return false;
      }

      // 2b. Region filter (especially for Ancestry)
      if (selectedRegion !== 'All') {
        const markerReg = (r.region || r.continent || '').toLowerCase();
        const selReg = selectedRegion.toLowerCase();
        
        const mappedMarkerReg = mapToRegion(r.region || r.continent || '').toLowerCase();
        const mappedSelReg = mapToRegion(selectedRegion).toLowerCase();

        const matchesExact = markerReg === selReg || (selReg === 'african-american' && markerReg === 'african american');
        const matchesMapped = mappedMarkerReg === selReg || (mappedMarkerReg !== 'global' && mappedMarkerReg === mappedSelReg);
        
        // Fallback only if marker has no specific continent/region (e.g. 'global' or intergenic)
        const matchesTrait = (markerReg === 'global' || !markerReg) && (
          (selReg === 'african' && (r.trait || '').toLowerCase().includes('african')) ||
          (selReg === 'european' && (r.trait || '').toLowerCase().includes('european')) ||
          (selReg === 'east asian' && (r.trait || '').toLowerCase().includes('east asian')) ||
          (selReg === 'native american' && (r.trait || '').toLowerCase().includes('native american')) ||
          (selReg === 'south asian' && (r.trait || '').toLowerCase().includes('south asian')) ||
          (selReg === 'middle eastern' && (r.trait || '').toLowerCase().includes('middle east')) ||
          (selReg === 'oceanian' && (r.trait || '').toLowerCase().includes('oceanian')) ||
          (selReg === 'central asian' && (r.trait || '').toLowerCase().includes('central asian')) ||
          (selReg === 'north african' && (r.trait || '').toLowerCase().includes('north african'))
        );

        if (!matchesExact && !matchesMapped && !matchesTrait) {
          return false;
        }
      }

      // 3. Chromosome filter
      if (selectedChr !== 'All') {
        const normalizedChr = String(r.chromosome).replace(/^chr/i, '');
        if (normalizedChr !== selectedChr) return false;
      }

      // 4. Significance filter
      if (selectedSignificance !== 'All' && r.significance !== selectedSignificance) {
        return false;
      }

      // 5. Match Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'matched' && r.status !== 'matched' && r.status !== 'partial') return false;
        if (statusFilter === 'partial' && r.status !== 'partial') return false;
        if (statusFilter === 'unmatched' && r.status !== 'unmatched' && r.status !== 'not_tested') return false;
      }

      // 6. Zygosity filter
      if (zygosityFilter !== 'all') {
        const geno = (r.genotype || '').toUpperCase().replace(/[\s\/_]/g, '');
        if (zygosityFilter === 'hom_alt') {
          // Homozygous alt
          if (geno.length < 2 || geno[0] !== geno[1] || geno === '--') return false;
        } else if (zygosityFilter === 'het') {
          // Heterozygous
          if (geno.length < 2 || geno[0] === geno[1] || geno === '--') return false;
        } else if (zygosityFilter === 'nocall') {
          if (geno !== '--' && geno !== '00' && geno !== 'NN' && geno !== 'NO CALL') return false;
        }
      }

      return true;
    }).sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'rsid') {
        cmp = (a.rsid || '').localeCompare(b.rsid || '');
      } else if (sortBy === 'gene') {
        cmp = (a.gene || '').localeCompare(b.gene || '');
      } else if (sortBy === 'category') {
        cmp = (a.category || '').localeCompare(b.category || '');
      } else if (sortBy === 'significance') {
        const rank: Record<string, number> = { 'High': 3, 'Medium': 2, 'Low': 1 };
        cmp = (rank[b.significance || 'Low'] || 0) - (rank[a.significance || 'Low'] || 0);
      } else if (sortBy === 'chr') {
        const numA = parseInt(String(a.chromosome).replace(/\D/g, ''), 10) || 99;
        const numB = parseInt(String(b.chromosome).replace(/\D/g, ''), 10) || 99;
        cmp = numA - numB;
      } else {
        // Default: Matched first, then High significance
        const statusRank = (s?: string) => s === 'matched' ? 3 : s === 'partial' ? 2 : 1;
        cmp = statusRank(b.status) - statusRank(a.status);
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [enrichedResults, searchTerm, selectedCategory, selectedRegion, selectedChr, selectedSignificance, statusFilter, zygosityFilter, sortBy, sortOrder]);

  // Reset pagination on filter change
  const totalPages = Math.max(1, Math.ceil(filteredMarkers.length / pageSize));
  const paginatedMarkers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMarkers.slice(start, start + pageSize);
  }, [filteredMarkers, currentPage, pageSize]);

  // --- Metrics Overview ---
  const stats = useMemo(() => {
    const total = enrichedResults.length || 1;
    const matched = enrichedResults.filter(r => r.status === 'matched' || r.status === 'partial').length;
    const highSig = enrichedResults.filter(r => r.significance === 'High').length;
    const matchPct = ((matched / total) * 100).toFixed(1);

    return { total, matched, highSig, matchPct };
  }, [enrichedResults]);

  // --- Copy RSID Helper ---
  const copyToClipboard = useCallback(async (rsid: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(rsid);
      setCopiedRsid(rsid);
      setTimeout(() => setCopiedRsid(null), 2000);
    } catch (err) {
      console.error('Failed to copy RSID:', err);
    }
  }, []);

  // --- Export Functionality ---
  const handleExport = (format: 'csv' | 'tsv' | 'json') => {
    setShowExportMenu(false);
    const dataToExport = filteredMarkers.map(m => ({
      rsid: m.rsid,
      gene: m.gene,
      chromosome: m.chromosome,
      position: m.position,
      genotype: m.genotype,
      status: m.status,
      category: m.category,
      significance: m.significance,
      trait: m.trait,
      continent: m.continent,
      description: m.description
    }));

    let fileContent = '';
    let mimeType = '';
    let fileExt = format;

    if (format === 'json') {
      fileContent = JSON.stringify(dataToExport, null, 2);
      mimeType = 'application/json';
    } else {
      const sep = format === 'csv' ? ',' : '\t';
      const headers = ['RSID', 'Gene', 'Chromosome', 'Position', 'Genotype', 'Status', 'Category', 'Significance', 'Trait', 'Region', 'Description'];
      const rows = dataToExport.map(d => [
        `"${d.rsid || ''}"`,
        `"${d.gene || ''}"`,
        `"${d.chromosome || ''}"`,
        `"${d.position || ''}"`,
        `"${d.genotype || ''}"`,
        `"${d.status || ''}"`,
        `"${d.category || ''}"`,
        `"${d.significance || ''}"`,
        `"${(d.trait || '').replace(/"/g, '""')}"`,
        `"${d.continent || ''}"`,
        `"${(d.description || '').replace(/"/g, '""')}"`
      ].join(sep));
      fileContent = [headers.join(sep), ...rows].join('\n');
      mimeType = format === 'csv' ? 'text/csv' : 'text/tab-separated-values';
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genotype_scout_markers_${new Date().toISOString().slice(0, 10)}.${fileExt}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters = 
    searchTerm !== '' || 
    selectedCategory !== 'All' || 
    selectedRegion !== 'All' ||
    selectedChr !== 'All' || 
    selectedSignificance !== 'All' || 
    statusFilter !== 'all' || 
    zygosityFilter !== 'all';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedRegion('All');
    setSelectedChr('All');
    setSelectedSignificance('All');
    setStatusFilter('all');
    setZygosityFilter('all');
    setCurrentPage(1);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* 1. Hero Summary & Metric Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950/80 border border-teal-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-12 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-black uppercase tracking-widest">
                <span>🧬</span> High-Density Genomic Markers Browser
              </div>
              {onOpenMethodology && (
                <button
                  type="button"
                  onClick={onOpenMethodology}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 hover:bg-teal-500/35 border border-teal-400/40 text-teal-200 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                  title="View Marker Browser Methodology & Curation Criteria"
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-300" />
                  <span>Methodology & Info</span>
                </button>
              )}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Explore Your <span className="text-teal-400">Variant Profile</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-medium">
              Interactive high-performance browser for annotated SNPs, allele dosages, phenotypic risk factors, and multi-population Ancestry Informative Markers.
            </p>
          </div>

          {/* Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3 shrink-0 min-w-0 w-full lg:w-auto">
            <div className="p-3 sm:p-3.5 xl:p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md min-w-0 flex flex-col justify-between overflow-hidden shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 truncate leading-tight" title="Total SNPs">Total SNPs</div>
              <div className="text-lg sm:text-xl xl:text-2xl font-black text-white font-mono tabular-nums tracking-tight leading-tight truncate">
                {dataset?.snpCount?.toLocaleString() || stats.total.toLocaleString()}
              </div>
              <div className="text-[10px] text-teal-400 font-medium mt-0.5 truncate leading-tight">{stats.matchPct}% Array Match</div>
            </div>

            <div className="p-3 sm:p-3.5 xl:p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md min-w-0 flex flex-col justify-between overflow-hidden shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 truncate leading-tight" title="Matched Markers">Matched Markers</div>
              <div className="text-lg sm:text-xl xl:text-2xl font-black text-emerald-400 font-mono tabular-nums tracking-tight leading-tight truncate">
                {stats.matched.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5 truncate leading-tight">Identified Calls</div>
            </div>

            <div className="p-3 sm:p-3.5 xl:p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md min-w-0 flex flex-col justify-between overflow-hidden shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 truncate leading-tight" title="High Significance">High Significance</div>
              <div className="text-lg sm:text-xl xl:text-2xl font-black text-rose-400 font-mono tabular-nums tracking-tight leading-tight truncate">
                {stats.highSig.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5 truncate leading-tight">Clinical / Phenotype</div>
            </div>

            <div className="p-3 sm:p-3.5 xl:p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md min-w-0 flex flex-col justify-between overflow-hidden shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 truncate leading-tight" title="Filtered Matches">Filtered Matches</div>
              <div className="text-lg sm:text-xl xl:text-2xl font-black text-sky-400 font-mono tabular-nums tracking-tight leading-tight truncate">
                {filteredMarkers.length.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5 truncate leading-tight">In Current View</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Chromosome Ribbon */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-2">
        <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400">
          <span className="uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
            <Layers className="w-3.5 h-3.5 text-teal-400" /> Chromosome Strip
          </span>
          <span className="text-[10px] text-slate-500">Jump to any autosomal or sex chromosome</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 pb-1 pt-0.5">
          {CHROMOSOME_LIST.map(chr => {
            const isSelected = selectedChr === chr;
            const count = chr === 'All' ? enrichedResults.length : (chrCounts[chr] || 0);
            return (
              <button
                key={chr}
                onClick={() => {
                  setSelectedChr(chr);
                  setCurrentPage(1);
                }}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-teal-500 text-slate-950 font-black shadow-lg shadow-teal-500/20' 
                    : 'bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                <span>{chr === 'All' ? 'All' : `Chr ${chr}`}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
                    isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive Filter Dock & Controls Bar */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[280px]">
            <input
              type="text"
              placeholder="Search RSID (e.g. rs121913529), Gene (BRCA1, APOE), Trait, or Region..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Select Dropdowns & View Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 outline-none focus:border-teal-500"
            >
              <option value="all">Status: All</option>
              <option value="matched">Status: Matched / Partial</option>
              <option value="unmatched">Status: Unmatched Only</option>
            </select>

            {/* Significance Filter */}
            <select
              value={selectedSignificance}
              onChange={(e) => {
                setSelectedSignificance(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 outline-none focus:border-teal-500"
            >
              <option value="All">Significance: All</option>
              <option value="High">Significance: High</option>
              <option value="Medium">Significance: Medium</option>
              <option value="Low">Significance: Low</option>
            </select>

            {/* Region Filter (Continental / Biogeographical Provenance) */}
            <select
              id="region-filter-select"
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-xl bg-slate-950 border text-xs font-bold outline-none transition-all ${
                selectedRegion !== 'All'
                  ? 'border-teal-400 text-teal-300 ring-1 ring-teal-400/30'
                  : 'border-slate-800 text-slate-200 focus:border-teal-500'
              }`}
            >
              <option value="All">Region: All</option>
              {regionsList.filter(r => r !== 'All').map(reg => (
                <option key={reg} value={reg}>
                  {getRegionMeta(reg).icon} {reg} ({regionCounts[reg] || 0})
                </option>
              ))}
            </select>

            {/* Zygosity Filter */}
            <select
              value={zygosityFilter}
              onChange={(e) => {
                setZygosityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 outline-none focus:border-teal-500"
            >
              <option value="all">Zygosity: All</option>
              <option value="het">Heterozygous (Carrier)</option>
              <option value="hom_alt">Homozygous (Both Alleles)</option>
              <option value="nocall">Missing / No Call</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 outline-none focus:border-teal-500"
            >
              <option value="default">Sort: Default (Priority)</option>
              <option value="rsid">Sort: RSID</option>
              <option value="gene">Sort: Gene</option>
              <option value="significance">Sort: Significance</option>
              <option value="chr">Sort: Chromosome</option>
              <option value="category">Sort: Category</option>
            </select>

            {/* View Mode Toggle Switch */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                title="Cards Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                title="Data Table Matrix View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span>Export</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-30 space-y-1"
                  >
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-200 hover:bg-teal-500/20 hover:text-teal-300 flex items-center gap-2 transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      Export CSV ({filteredMarkers.length})
                    </button>
                    <button
                      onClick={() => handleExport('tsv')}
                      className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-200 hover:bg-teal-500/20 hover:text-teal-300 flex items-center gap-2 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-sky-400" />
                      Export TSV ({filteredMarkers.length})
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-200 hover:bg-teal-500/20 hover:text-teal-300 flex items-center gap-2 transition-colors"
                    >
                      <FileJson className="w-4 h-4 text-amber-400" />
                      Export JSON ({filteredMarkers.length})
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Category Pills & Active Filter Reset Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {categoriesList.map(cat => {
              const isSelected = selectedCategory === cat;
              const meta = (CATEGORY_META as any)[cat] || { color: '#0d9488', icon: '🧬' };
              const count = cat === 'All' 
                ? enrichedResults.length 
                : enrichedResults.filter(r => r.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/30'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span>{cat}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-slate-300 font-mono font-bold">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold hover:bg-rose-500/30 transition-colors flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Interactive Biogeographical Region Filter Strip (Featured on Ancestry Tab) */}
        {(selectedCategory === 'Ancestry' || selectedRegion !== 'All') && (
          <motion.div 
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-slate-800/90 shadow-xl space-y-2.5"
          >
            <div className="flex items-center justify-between px-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 text-[11px]">
                  <span>🌎</span> Ancestral Biogeographic Regions
                </span>
                {selectedRegion !== 'All' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 font-bold">
                    Filtered: {selectedRegion}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                Filter Ancestry Informative Markers (AIMs) by world population
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 pb-1 pt-0.5">
              {regionsList.map(reg => {
                const isSelected = selectedRegion === reg;
                const meta = reg === 'All' ? { color: '#0d9488', icon: '🌐' } : getRegionMeta(reg);
                const count = reg === 'All' 
                  ? (selectedCategory === 'Ancestry' ? enrichedResults.filter(r => r.category === 'Ancestry').length : enrichedResults.length)
                  : (regionCounts[reg] || 0);

                return (
                  <button
                    key={reg}
                    id={`region-pill-${reg.toLowerCase().replace(/[\s\/_]/g, '-')}`}
                    onClick={() => {
                      setSelectedRegion(reg);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isSelected
                        ? 'text-white shadow-lg'
                        : 'bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/80'
                    }`}
                    style={{
                      backgroundColor: isSelected ? meta.color : undefined,
                      borderColor: isSelected ? meta.color : undefined,
                      boxShadow: isSelected ? `0 4px 14px 0 ${meta.color}40` : undefined
                    }}
                  >
                    <span>{meta.icon}</span>
                    <span>{reg === 'All' ? 'All Regions' : reg}</span>
                    <span 
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
                        isSelected ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {count.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* 4. Main Content: Grid View or Table View */}
      {filteredMarkers.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center mx-auto text-3xl text-slate-500">
            🧬
          </div>
          <h3 className="text-lg font-black text-white">No Genetic Markers Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            No variants in this dataset match your current search and filter settings. Try clearing the chromosome, category, or search filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-black text-xs hover:bg-teal-400 transition-all shadow-lg"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* --- Modern Card Grid View --- */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedMarkers.map((marker, idx) => {
            const meta = (CATEGORY_META as any)[marker.category || 'Ancestry'] || { color: '#0d9488', icon: '🧬' };
            const isMatched = marker.status === 'matched' || marker.status === 'partial';
            const geno = marker.genotype || '--';

            return (
              <motion.div
                key={(marker.rsid || marker.markerId || 'marker') + '-' + idx}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setActiveMarker(marker)}
                className="group relative p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/40 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4 min-w-0 overflow-hidden"
              >
                {/* Top Accent Strip */}
                <div 
                  className="absolute top-0 left-6 right-6 h-0.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: meta.color }}
                />

                <div className="space-y-2.5 min-w-0">
                  {/* Header: RSID, Copy, Category, Significance */}
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-sm font-black text-sky-400 tracking-tight truncate">
                        {marker.rsid}
                      </span>
                      <button
                        onClick={(e) => copyToClipboard(marker.rsid || '', e)}
                        className="p-1 rounded-md bg-slate-950 text-slate-400 hover:text-teal-300 transition-colors"
                        title="Copy RSID"
                      >
                        {copiedRsid === marker.rsid ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tight ${
                        SIG_COLOR[marker.significance as keyof typeof SIG_COLOR] || 'bg-slate-800 text-slate-400'
                      }`}>
                        {marker.significance || 'Low'}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                        Chr {marker.chromosome}
                      </span>
                    </div>
                  </div>

                  {/* Gene & Trait & Region */}
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[10px] font-mono font-black">
                        {marker.gene || 'Intergenic'}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {marker.category}
                      </span>
                      {marker.region && marker.region !== 'Global' && (
                        <span 
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border"
                          style={{
                            backgroundColor: `${getRegionMeta(marker.region).color}15`,
                            borderColor: `${getRegionMeta(marker.region).color}30`,
                            color: getRegionMeta(marker.region).color
                          }}
                        >
                          <span>{getRegionMeta(marker.region).icon}</span>
                          <span>{marker.region}</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                      {marker.trait || 'Genomic Variant'}
                    </h4>
                  </div>

                  {/* Description Preview */}
                  {marker.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-medium">
                      {marker.description}
                    </p>
                  )}
                </div>

                {/* Footer: Genotype Call & Match Status */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-500">Your Call:</span>
                    <span className={`px-2.5 py-1 rounded-lg font-mono text-xs font-black border ${
                      isMatched 
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}>
                      {geno}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-teal-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Details →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* --- High-Density Data Matrix Table View --- */
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">RSID</th>
                  <th className="px-4 py-3.5">Gene</th>
                  <th className="px-4 py-3.5">Chr : Pos</th>
                  <th className="px-4 py-3.5 text-center">Genotype</th>
                  <th className="px-4 py-3.5">Region</th>
                  <th className="px-4 py-3.5">Significance</th>
                  <th className="px-4 py-3.5">Trait / Biological Effect</th>
                  <th className="px-4 py-3.5 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-medium text-slate-300">
                {paginatedMarkers.map((marker, idx) => {
                  const isMatched = marker.status === 'matched' || marker.status === 'partial';
                  return (
                    <tr
                      key={(marker.rsid || marker.markerId || 'marker') + '-' + idx}
                      onClick={() => setActiveMarker(marker)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3.5">
                        <span className={`w-2.5 h-2.5 rounded-full inline-block ${
                          isMatched ? 'bg-emerald-400 shadow-sm shadow-emerald-500' : 'bg-slate-600'
                        }`} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-sky-400 group-hover:text-sky-300">
                            {marker.rsid}
                          </span>
                          <button
                            onClick={(e) => copyToClipboard(marker.rsid || '', e)}
                            className="text-slate-500 hover:text-teal-300 p-0.5"
                          >
                            {copiedRsid === marker.rsid ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-teal-300">
                        {marker.gene || 'N/A'}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-400 text-[11px]">
                        Chr {marker.chromosome} {marker.position ? `: ${marker.position}` : ''}
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono font-bold">
                        <span className={`px-2 py-0.5 rounded-lg border text-xs ${
                          isMatched ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                        }`}>
                          {marker.genotype || '--'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {marker.region && marker.region !== 'Global' ? (
                          <span 
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border whitespace-nowrap"
                            style={{
                              backgroundColor: `${getRegionMeta(marker.region).color}15`,
                              borderColor: `${getRegionMeta(marker.region).color}30`,
                              color: getRegionMeta(marker.region).color
                            }}
                          >
                            <span>{getRegionMeta(marker.region).icon}</span>
                            <span>{marker.region}</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 font-mono text-[11px]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tight ${
                          SIG_COLOR[marker.significance as keyof typeof SIG_COLOR] || 'bg-slate-800 text-slate-400'
                        }`}>
                          {marker.significance || 'Low'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs truncate text-white font-medium">
                        {marker.trait || marker.description || 'Genomic Marker'}
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-teal-400 group-hover:text-teal-300">
                        View ↗
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">
            Showing <span className="text-white font-bold">{((currentPage - 1) * pageSize) + 1}</span> to <span className="text-white font-bold">{Math.min(currentPage * pageSize, filteredMarkers.length)}</span> of <span className="text-teal-400 font-bold">{filteredMarkers.length.toLocaleString()}</span> markers
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              ← Previous
            </button>

            <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-teal-400">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* 6. Deep Marker Inspection Slide-out Sheet / Modal */}
      <AnimatePresence>
        {activeMarker && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={() => setActiveMarker(null)} />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '100%', opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative z-10 w-full max-w-xl h-full bg-slate-950 border-l border-slate-800 p-6 sm:p-8 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header: RSID, Significance, Close */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-black text-white font-mono tracking-tight">
                        {activeMarker.rsid}
                      </h3>
                      <button
                        onClick={(e) => copyToClipboard(activeMarker.rsid || '', e)}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-teal-300 transition-colors"
                        title="Copy RSID"
                      >
                        {copiedRsid === activeMarker.rsid ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {activeMarker.gene} · Chromosome {activeMarker.chromosome} {activeMarker.position ? `· Pos ${activeMarker.position}` : ''}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveMarker(null)}
                    className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Direct External Genomic Links */}
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`https://www.ncbi.nlm.nih.gov/snp/${activeMarker.rsid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/30 transition-all flex items-center gap-1.5"
                  >
                    <span>dbSNP Reference</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={`https://www.ncbi.nlm.nih.gov/clinvar/?term=${activeMarker.rsid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all flex items-center gap-1.5"
                  >
                    <span>ClinVar Clinical</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {activeMarker.gene && activeMarker.gene !== 'Intergenic' && (
                    <a
                      href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${activeMarker.gene}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-teal-400 hover:bg-teal-500/10 hover:border-teal-500/30 transition-all flex items-center gap-1.5"
                    >
                      <span>GeneCards ({activeMarker.gene})</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Genotype, Significance & Ancestral Region Cards */}
                <div className={`grid gap-3 ${activeMarker.region && activeMarker.region !== 'Global' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'}`}>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 min-w-0 overflow-hidden">
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1 truncate">Your Call</div>
                    <div className="text-xl font-mono font-black text-emerald-400 tabular-nums truncate">{activeMarker.genotype || '--'}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">Status: {activeMarker.status || 'Not tested'}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 min-w-0 overflow-hidden">
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1 truncate">Significance</div>
                    <div className="text-lg font-black text-rose-400 truncate">{activeMarker.significance || 'Low'}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">Category: {activeMarker.category || 'Ancestry'}</div>
                  </div>

                  {activeMarker.region && activeMarker.region !== 'Global' && (
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 min-w-0 overflow-hidden">
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1 truncate">Ancestral Region</div>
                      <div className="text-base font-black flex items-center gap-1.5 truncate" style={{ color: getRegionMeta(activeMarker.region).color }}>
                        <span className="shrink-0">{getRegionMeta(activeMarker.region).icon}</span>
                        <span className="truncate">{activeMarker.region}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">Lineage AIM</div>
                    </div>
                  )}
                </div>

                {/* Biological Effect & Trait Description */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-teal-400">Phenotypic Impact & Trait</h4>
                  <p className="text-sm font-bold text-white">{activeMarker.trait || 'Genomic Variant'}</p>
                  {activeMarker.description && 
                   activeMarker.description.trim().toLowerCase() !== (activeMarker.trait || '').trim().toLowerCase() && (
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {activeMarker.description}
                    </p>
                  )}
                </div>

                {/* Interpretations if available */}
                {activeMarker.interpretations && Object.keys(activeMarker.interpretations).length > 0 && (
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-teal-400">Allele Interpretation Matrix</h4>
                    <div className="space-y-2 text-xs">
                      {Object.entries(activeMarker.interpretations).map(([allele, interp]) => (
                        <div key={allele} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="font-mono font-bold text-sky-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                            {allele}
                          </span>
                          <span className="text-slate-300 leading-snug">{interp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons in Footer */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const jsonStr = JSON.stringify(activeMarker, null, 2);
                    navigator.clipboard.writeText(jsonStr);
                    setCopiedRsid(activeMarker.rsid || '');
                    setTimeout(() => setCopiedRsid(null), 2000);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 transition-colors"
                >
                  {copiedRsid === activeMarker.rsid ? '✓ Copied JSON' : 'Copy JSON'}
                </button>

                <button
                  onClick={() => setActiveMarker(null)}
                  className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/20"
                >
                  Close Sheet
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
