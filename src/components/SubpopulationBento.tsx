import React, { useState, useMemo } from 'react';
import { processSubpopulations, AIM, UserGenotype } from './ancestryOracleLogic';
import { deconvolveMicrohaplotypes } from '../utils/ancestry/microhapAdmixture';
import { motion, AnimatePresence } from 'motion/react';
import {
  Target,
  Layers,
  Info,
  Activity,
  BookOpen,
  Globe,
  Compass,
  ShieldCheck,
  Sparkles,
  Dna,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2
} from 'lucide-react';

interface BentoProps {
  userGenotypes: UserGenotype[];
  aimsDatabase: AIM[];
  precalculated?: any;
  onOpenMethodology?: () => void;
}

export type PanelType = 'all' | 'kidd55' | 'seldin128' | 'euroforgen' | 'ramos' | 'microhap';

interface PanelMeta {
  id: PanelType;
  label: string;
  shortLabel: string;
  badge: string;
  countLabel: string;
  geographicFocus: string;
  modelType: string;
  resolution: string;
  description: string;
  citation: string;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PANEL_METADATA: Record<PanelType, PanelMeta> = {
  all: {
    id: 'all',
    label: 'Global K61 Reference',
    shortLabel: 'Global K61',
    badge: '17.7k AIMs',
    countLabel: '17,728 Phased Markers',
    geographicFocus: 'Worldwide & Regional Continuum',
    modelType: 'Euclidean Vector Distance (L2)',
    resolution: 'Continental & Sub-Continental',
    description: 'Comprehensive global index spanning 61 reference populations from the 1000 Genomes Project, Human Genome Diversity Project (HGDP), and Simons Genome Diversity Project (SGDP).',
    citation: 'Lazaridis et al. (Human Origins) / 1000 Genomes Consortium',
    accent: 'emerald',
    icon: Globe
  },
  kidd55: {
    id: 'kidd55',
    label: 'Kidd Lab 55 AIMs',
    shortLabel: 'Kidd 55',
    badge: '55 AIMs',
    countLabel: '55 Diagnostic Loci',
    geographicFocus: 'Global Continental Distinctions',
    modelType: 'Rosenberg In / Maximum Divergence',
    resolution: 'Continental Anchor',
    description: 'The Kenneth Kidd 55-AIM panel isolates maximum Fst divergent alleles separating African, European, East Asian, and Indigenous American continental groups with high statistical power.',
    citation: 'Kidd et al. (2014) Forensic Science International: Genetics',
    accent: 'cyan',
    icon: Target
  },
  seldin128: {
    id: 'seldin128',
    label: 'Seldin Lab 128 AIMs',
    shortLabel: 'Seldin 128',
    badge: '128 AIMs',
    countLabel: '128 Multi-Continental Loci',
    geographicFocus: 'Inter-Continental Admixture',
    modelType: 'Cosine Similarity / Metric Distance',
    resolution: 'Continental & Regional Admixture',
    description: 'Developed by Michael Seldin and Roman Kosoy to deconvolve 3-way and 4-way admixture in admixed populations (such as African Americans and Latinos) with minimal LD redundancy.',
    citation: 'Kosoy, Seldin et al. (2009) Human Mutation',
    accent: 'indigo',
    icon: ShieldCheck
  },
  euroforgen: {
    id: 'euroforgen',
    label: 'EuroForGen European',
    shortLabel: 'EuroForGen',
    badge: 'Substructure',
    countLabel: '128 Substructure AIMs',
    geographicFocus: 'European Regional Substructure',
    modelType: 'Micro-Geographic Variance Analysis',
    resolution: 'Sub-Continental (N/S/E/W Europe)',
    description: 'European Forensic Genetics (NAME) panel calibrated specifically to differentiate Northwest European, Mediterranean/Southern European, Slavic/Eastern European, and Scandinavian clades.',
    citation: 'Phillips et al. (EUROFORGEN Consortium, 2014)',
    accent: 'blue',
    icon: Compass
  },
  ramos: {
    id: 'ramos',
    label: 'Ramos African Substructure',
    shortLabel: 'Ramos Africa',
    badge: 'African Regional',
    countLabel: 'Targeted Regional AIMs',
    geographicFocus: 'Sub-Saharan African Regions',
    modelType: 'Regional Frequency Clustering',
    resolution: 'West, Bantu, & Nilotic Resolution',
    description: 'Optimized for fine-scale African population substructure, separating West African coastal groups, Bantu-speaking agriculturalists, and Nilotic/East African lineages.',
    citation: 'Ramos et al. (2014) Investigative Genetics',
    accent: 'amber',
    icon: Sparkles
  },
  microhap: {
    id: 'microhap',
    label: 'Microhaplotypes (Top 100)',
    shortLabel: 'Microhaps',
    badge: 'Multi-Allelic',
    countLabel: '100 Multi-Allelic Haplotypes',
    geographicFocus: 'High-Resolution Forensic Clusters',
    modelType: 'Non-Negative Least Squares (NNLS)',
    resolution: 'Multi-Allelic Haplotype Deconvolution',
    description: 'Multi-allelic microhaplotypes with 2–5 linked SNPs within 300 base pairs. Eliminates stutter artifacts and delivers forensic assignment accuracy without phase ambiguity.',
    citation: 'Kidd, Mezzavilla et al. (2018) MicroHapDB Consortium',
    accent: 'purple',
    icon: Dna
  }
};

const SubpopulationBento: React.FC<BentoProps> = ({ userGenotypes, aimsDatabase, precalculated, onOpenMethodology }) => {
  const [showUnmapped, setShowUnmapped] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [showAllSubpops, setShowAllSubpops] = useState(false);
  const [showAllUnmapped, setShowAllUnmapped] = useState(false);
  const [showMicrohaps, setShowMicrohaps] = useState(false);
  const [microhapSearch, setMicrohapSearch] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedPanel, setSelectedPanel] = useState<PanelType>('all');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const activePanelMeta = PANEL_METADATA[selectedPanel];

  React.useEffect(() => {
    if (precalculated) {
      if (precalculated[selectedPanel]) {
        setResults(precalculated[selectedPanel]);
        setLoading(false);
        return;
      }
      if (selectedPanel === 'all') {
        setResults(precalculated);
        setLoading(false);
        return;
      }
    }

    if (selectedPanel === 'microhap') {
      const userSnps = Object.fromEntries(userGenotypes.map(g => [g.rsid, g.genotype]));
      const mix = deconvolveMicrohaplotypes(userSnps);
      if (mix && mix.length > 0) {
        const locusCount = mix.locusCount || (mix as any).detectedLoci?.length || 100;
        setResults({
          topMatch: mix[0]?.name || 'Unknown',
          subpopAimsUsed: locusCount,
          unmappedAims: [],
          breakdown: mix.map(m => ({
            subpop: m.name,
            distance: m.distance,
            similarityScore: m.percentage,
            markersCompared: locusCount,
            count: locusCount
          })),
          admixtureMix: mix,
          detectedMicrohaps: mix.detectedLoci || []
        });
        setLoading(false);
        return;
      }
    }

    let active = true;
    setLoading(true);
    processSubpopulations(userGenotypes, aimsDatabase, undefined, undefined, selectedPanel)
      .then(res => {
        if (active) {
          setResults(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Error calculating panel:", err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userGenotypes, aimsDatabase, precalculated, selectedPanel]);

  // Filter and deduplicate the breakdown list to show unique top matches by genetic distance
  const rawBreakdown = results?.breakdown || [];
  const seenSubpopNames = new Set<string>();
  const deduplicatedBreakdown = useMemo(() => {
    return rawBreakdown.filter((comp: any) => {
      const rawName = (comp?.name || comp?.subpop || '').toLowerCase().trim();
      const cleanName = rawName.replace(/\s*\([^)]*\)/g, '').trim();
      if (!cleanName || seenSubpopNames.has(cleanName)) return false;
      seenSubpopNames.add(cleanName);
      return true;
    });
  }, [rawBreakdown]);

  // Filter by search query if user is exploring all
  const filteredBreakdown = useMemo(() => {
    if (!searchFilter.trim()) return deduplicatedBreakdown;
    const q = searchFilter.toLowerCase().trim();
    return deduplicatedBreakdown.filter((item: any) => {
      const name = (item?.name || item?.subpop || '').toLowerCase();
      return name.includes(q);
    });
  }, [deduplicatedBreakdown, searchFilter]);

  const breakdownList = showAllSubpops ? filteredBreakdown : deduplicatedBreakdown.slice(0, 12);
  const topMatch = deduplicatedBreakdown.length > 0 ? deduplicatedBreakdown[0] : null;
  const topMatchDistance = topMatch ? Number(topMatch.distance) : 0;
  
  // Calculate top match similarity percentage for confidence ring
  const topSimilarityPct = topMatch?.similarityScore !== undefined
    ? Math.round(Number(topMatch.similarityScore))
    : Math.max(10, Math.min(99, Math.round((1 - Math.min(1, topMatchDistance * 5)) * 100)));

  // SVG confidence circle calculation
  const ringRadius = 26;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = ringCircumference * (1 - topSimilarityPct / 100);

  if (!results && loading) {
    return (
      <div className="bg-slate-950/70 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-3 w-full max-w-full">
        <Activity className="w-6 h-6 text-emerald-400 animate-spin" />
        <p className="text-sm font-semibold tracking-wide">Recalibrating Reference Population Oracle...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-slate-950/70 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 text-center text-slate-400 w-full max-w-full">
        Processing genomic oracle...
      </div>
    );
  }

  return (
    <div className="bg-slate-950/70 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl text-white space-y-6 transition-all duration-500 hover:border-emerald-500/30 relative overflow-hidden w-full max-w-full">
      {/* Top Ambient Glow Line */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start border-b border-white/10 pb-4 w-full">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shrink-0 mt-0.5">
              <Dna className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight break-words">
                  Human Origins (K61) Oracle
                </h3>
                <span className="bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm shrink-0">
                  <Activity className="w-2.5 h-2.5 text-emerald-400 animate-pulse" /> Live Model
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium break-words leading-relaxed mt-0.5">
                Multi-panel population genetics & vector distance deconvolution across global reference cohorts
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setShowExplain(!showExplain)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer select-none ${
              showExplain
                ? 'bg-teal-500/20 border-teal-500/40 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.25)]'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
            title="Toggle scientific model description"
          >
            <Info className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>Panel Guide</span>
            {showExplain ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
          </button>

          {onOpenMethodology && (
            <button
              type="button"
              onClick={onOpenMethodology}
              className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 hover:bg-emerald-500/25 text-xs font-bold text-emerald-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] select-none shrink-0"
              title="View Subpopulation Oracle Scientific Whitepaper"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Methodology</span>
            </button>
          )}
        </div>
      </div>

      {/* Prominent Reference Panel Switcher */}
      <div className="space-y-3 bg-black/40 p-3.5 sm:p-4 rounded-xl border border-white/5 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              Reference Panel Switcher
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Click any panel to recalibrate genetic distances
          </span>
        </div>

        {/* Segmented Pill Selector with Zero Truncation & Flexible Auto-Height */}
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-6 gap-2 w-full">
          {(Object.keys(PANEL_METADATA) as PanelType[]).map((panelKey) => {
            const meta = PANEL_METADATA[panelKey];
            const isSelected = selectedPanel === panelKey;
            const Icon = meta.icon;

            return (
              <button
                key={panelKey}
                type="button"
                onClick={() => setSelectedPanel(panelKey)}
                className={`relative flex flex-col items-center justify-between p-2.5 rounded-xl border text-center transition-all cursor-pointer select-none group min-h-[76px] h-auto w-full min-w-0 ${
                  isSelected
                    ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-500/20 to-teal-500/10 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/10'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activePanelPill"
                    className="absolute inset-0 rounded-xl border-2 border-emerald-400/80 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                
                <div className="flex items-center justify-center gap-1.5 mb-1.5 w-full min-w-0">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                  <span className={`text-[11px] sm:text-xs font-extrabold tracking-tight leading-tight break-words text-center ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {meta.shortLabel}
                  </span>
                </div>

                <span className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-colors w-full break-words whitespace-normal block text-center leading-tight ${
                  isSelected ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40' : 'bg-black/50 text-slate-400 group-hover:text-slate-300 border border-white/5'
                }`}>
                  {meta.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Panel Intelligence Strip - Zero Clipping, Full Responsive Wrap */}
      <motion.div
        key={selectedPanel}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 w-full"
      >
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex flex-col justify-between min-w-0">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5 mb-1">
            <Globe className="w-3 h-3 text-emerald-400 shrink-0" /> Geographic Focus
          </div>
          <div className="text-xs font-bold text-slate-100 break-words leading-snug">
            {activePanelMeta.geographicFocus}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex flex-col justify-between min-w-0">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5 mb-1">
            <Target className="w-3 h-3 text-teal-400 shrink-0" /> Evaluated Markers
          </div>
          <div className="text-xs font-bold text-slate-100 font-mono break-words leading-snug">
            {results.subpopAimsUsed ? `${results.subpopAimsUsed.toLocaleString()} Kit Markers` : activePanelMeta.countLabel}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex flex-col justify-between min-w-0">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5 mb-1">
            <Activity className="w-3 h-3 text-cyan-400 shrink-0" /> Model Architecture
          </div>
          <div className="text-xs font-bold text-slate-100 break-words leading-snug">
            {activePanelMeta.modelType}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex flex-col justify-between min-w-0">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3 h-3 text-indigo-400 shrink-0" /> Target Resolution
          </div>
          <div className="text-xs font-bold text-slate-100 break-words leading-snug">
            {activePanelMeta.resolution}
          </div>
        </div>
      </motion.div>

      {/* Top Match Spotlight Hero Card */}
      {topMatch && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-slate-950/80 border border-emerald-500/25 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 w-full">
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/30 break-words">
                  Top Population Match · {activePanelMeta.shortLabel}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Rank #1 of {deduplicatedBreakdown.length}
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight break-words">
                {(topMatch as any).name || topMatch.subpop || 'Unknown Reference'}
              </h2>

              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed break-words">
                Closest reference cohort under the active <strong className="text-emerald-300 font-bold">{activePanelMeta.label}</strong> matrix with an absolute Euclidean vector distance of <span className="font-mono text-emerald-400 font-black">{topMatchDistance.toFixed(4)}</span>.
              </p>
            </div>

            {/* Confidence Ring Display */}
            <div className="flex items-center gap-3 self-start md:self-center bg-black/50 p-3 rounded-2xl border border-white/10 max-w-full">
              <div className="relative flex items-center justify-center shrink-0">
                <svg width="64" height="64" className="-rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r={ringRadius}
                    stroke="currentColor"
                    strokeWidth="5"
                    className="text-white/10"
                    fill="none"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r={ringRadius}
                    stroke="url(#topMatchGradient)"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    initial={{ strokeDashoffset: ringCircumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="topMatchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-sm font-black font-mono text-emerald-300">{topSimilarityPct}%</span>
                </div>
              </div>

              <div className="text-left space-y-0.5 pr-1 min-w-[90px] flex-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-bold">
                  Affinity Score
                </span>
                <span className="text-xs font-black text-white block break-words">
                  {topSimilarityPct >= 85 ? 'High Proximity' : topSimilarityPct >= 70 ? 'Moderate Proximity' : 'Distal Affinity'}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 block font-bold">
                  d = {topMatchDistance.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Methodology & Panel Citation Drawer */}
      <AnimatePresence>
        {showExplain && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-slate-300 space-y-3 leading-relaxed overflow-hidden w-full"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-500/20 pb-2">
              <span className="font-bold text-teal-300 flex items-center gap-2 text-sm break-words">
                🧬 Active Panel: {activePanelMeta.label}
              </span>
              <span className="text-[10px] font-mono text-teal-400 bg-teal-500/20 px-2 py-0.5 rounded border border-teal-500/30 self-start sm:self-auto max-w-full break-words whitespace-normal text-left">
                {activePanelMeta.citation}
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed break-words">
              {activePanelMeta.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px] text-slate-400">
              <div className="bg-black/40 p-3 rounded-lg border border-white/5 break-words">
                <strong className="text-slate-200 block mb-1">Euclidean Distance Metric:</strong>
                Calculates the square root of sum of squared allele dosage differences between user kit calls and reference population centroid vectors. Closer distance denotes higher genetic affinity.
              </div>
              <div className="bg-black/40 p-3 rounded-lg border border-white/5 break-words">
                <strong className="text-slate-200 block mb-1">Subpopulation Deduplication:</strong>
                Aliases and redundant regional cohorts are merged using standardized ISO/1000G population taxonomy to prevent duplicate hits.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Population Distance Spectrum Grid - Zero Text Clipping, Full Natural Wrap */}
      <div className="space-y-3 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-black uppercase text-slate-200 tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
              Population Distance Spectrum
            </h4>
            <span className="text-[10px] font-mono text-slate-400 block">
              |← Longer Bar / Lower Distance = Closer Genetic Affinity |
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {showAllSubpops && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Filter 61 populations..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-lg pl-8 pr-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-44"
                />
              </div>
            )}
            <span className="text-[10px] text-slate-400 font-mono bg-black/40 px-2 py-1 rounded-md border border-white/5 shrink-0">
              {showAllSubpops ? `Showing ${breakdownList.length} Populations` : `Top ${breakdownList.length} of ${deduplicatedBreakdown.length} Populations`}
            </span>
          </div>
        </div>

        {breakdownList.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4 text-center">
            {searchFilter ? `No populations matching "${searchFilter}"` : 'No populations mapped for this panel.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 w-full">
            {breakdownList.map((comp: any, idx: number) => {
              const distance = Number(comp.distance);
              // Invert width so closer distance = longer bar
              const visualWidth = Math.max(12, Math.min(100, Math.round(100 - (distance * 180))));
              
              // Quality dot rating: 5 dots for highest proximity
              const dotCount = distance < 0.020 ? 5 : distance < 0.035 ? 4 : distance < 0.050 ? 3 : 2;

              return (
                <div
                  key={(comp?.name || comp?.subpop || 'comp') + idx}
                  className="flex flex-col justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden h-full min-h-[96px] min-w-0"
                >
                  <div className="flex items-center justify-between mb-1.5 gap-1 min-w-0 w-full">
                    <span className="font-mono text-slate-400 text-[9px] bg-black/60 px-1.5 py-0.5 rounded border border-white/5 shrink-0 font-bold">
                      #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[9px] text-emerald-400/80 tracking-tighter font-bold" title={`${dotCount}/5 Match Confidence`}>
                        {'●'.repeat(dotCount)}{'○'.repeat(5 - dotCount)}
                      </span>
                      <span className="text-emerald-400 text-xs font-black font-mono tabular-nums">
                        {distance.toFixed(3)}
                      </span>
                    </div>
                  </div>

                  <h4
                    className="text-xs font-bold text-slate-200 leading-snug group-hover:text-emerald-300 transition-colors block mb-2 break-words flex-1"
                    title={comp?.name || comp?.subpop}
                  >
                    {comp?.name || comp?.subpop || 'Unknown'}
                  </h4>

                  <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5 p-px mt-auto">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${visualWidth}%` }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: idx * 0.02 }}
                      className={`h-full rounded-full ${
                        idx === 0
                          ? 'bg-gradient-to-r from-emerald-400 to-cyan-300'
                          : idx < 3
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-400'
                          : 'bg-gradient-to-r from-slate-500 to-teal-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {deduplicatedBreakdown.length > 12 && (
          <button
            type="button"
            onClick={() => setShowAllSubpops(!showAllSubpops)}
            className="w-full py-2.5 px-3 bg-white/[0.04] hover:bg-white/[0.08] text-emerald-300 text-xs font-bold rounded-xl border border-emerald-500/25 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] select-none text-center break-words whitespace-normal"
          >
            <span>{showAllSubpops ? 'Collapse to Top 12 Matches' : `Browse All (${deduplicatedBreakdown.length}) Reference Populations in Active Panel`}</span>
            <span className="font-mono text-xs">{showAllSubpops ? '▲' : '▼'}</span>
          </button>
        )}
      </div>

      {/* Detected Forensic Microhaplotypes Card (Microhap panel only) */}
      {selectedPanel === 'microhap' && results?.detectedMicrohaps?.length > 0 && (
        <div className="pt-3 border-t border-purple-500/20 w-full">
          <button
            type="button"
            onClick={() => setShowMicrohaps(!showMicrohaps)}
            className="text-xs font-bold text-slate-300 hover:text-purple-300 flex items-center justify-between w-full transition-colors py-2 px-3 bg-purple-950/20 hover:bg-purple-900/30 border border-purple-500/20 rounded-xl cursor-pointer select-none"
          >
            <span className="flex items-center gap-2 uppercase tracking-wider text-[11px] font-mono">
              <Dna className="w-4 h-4 text-purple-400 shrink-0" />
              Detected Forensic Microhaplotypes ({results.detectedMicrohaps.length} Loci Called)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-500/30">
                {results.detectedMicrohaps.filter((l: any) => !l.isHeterozygous).length} Hom · {results.detectedMicrohaps.filter((l: any) => l.isHeterozygous).length} Het
              </span>
              <span className="font-mono text-xs">{showMicrohaps ? '▲' : '▼'}</span>
            </div>
          </button>

          <AnimatePresence>
            {showMicrohaps && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-3 w-full"
              >
                <div className="bg-black/40 border border-purple-500/20 rounded-xl p-4 space-y-3 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Statistically phased Kenneth Kidd / MicroHapDB forensic loci detected in your kit. Multi-allelic haplotypes eliminate PCR stutter and provide single-locus ancestry discernment.
                    </p>
                    <div className="relative shrink-0">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Filter loci or rsIDs..."
                        value={microhapSearch}
                        onChange={(e) => setMicrohapSearch(e.target.value)}
                        className="bg-black/60 border border-white/10 rounded-lg pl-8 pr-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 w-48"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
                    {results.detectedMicrohaps
                      .filter((locus: any) => {
                        if (!microhapSearch.trim()) return true;
                        const q = microhapSearch.toLowerCase();
                        return locus.id.toLowerCase().includes(q) ||
                          locus.chrom.toLowerCase().includes(q) ||
                          locus.snps.some((s: string) => s.toLowerCase().includes(q)) ||
                          locus.calledHaplotypes.some((h: string) => h.toLowerCase().includes(q));
                      })
                      .map((locus: any) => (
                        <div
                          key={locus.id}
                          className="bg-white/[0.03] border border-white/5 hover:border-purple-500/30 rounded-lg p-2.5 space-y-1.5 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono text-xs font-bold text-purple-300">
                              {locus.id}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              chr{locus.chrom}:{locus.pos.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded border border-white/10">
                              {locus.calledHaplotypes[0]} {locus.isHeterozygous ? `/ ${locus.calledHaplotypes[1]}` : '(Homozygous)'}
                            </span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                              locus.isHeterozygous
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              {locus.isHeterozygous ? 'Het' : 'Hom'}
                            </span>
                          </div>

                          <div className="text-[10px] font-mono text-slate-400 truncate">
                            SNPs: {locus.typedSnps.join(', ')}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Unmapped Global/Continental Markers Accordion */}
      <div className="pt-3 border-t border-white/10 w-full">
        <button
          type="button"
          onClick={() => setShowUnmapped(!showUnmapped)}
          className="text-xs font-bold text-slate-400 hover:text-emerald-400 flex items-center justify-between w-full transition-colors py-1 cursor-pointer select-none"
        >
          <span className="flex items-center gap-2 uppercase tracking-wider text-[11px] break-words">
            <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
            Unmapped Global / Continental Markers ({results.unmappedAims?.length ?? 0})
          </span>
          <span className="font-mono text-xs">{showUnmapped ? '▲' : '▼'}</span>
        </button>

        <AnimatePresence>
          {showUnmapped && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-3 w-full"
            >
              <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-3 w-full">
                <p className="text-xs text-slate-400 leading-relaxed break-words">
                  These reference markers map to broad macro-continental lineages (e.g., Broadly European, Genomically Cosmopolitan) rather than fine-scale regional cohorts. They are evaluated in global frequency vectors but excluded from regional distance metrics to preserve sub-population specificity:
                </p>
                <ul className="text-xs font-mono text-slate-300 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
                  {(showAllUnmapped ? (results.unmappedAims || []) : (results.unmappedAims || []).slice(0, 48)).map((aim: any) => (
                    <li key={aim.rsid} className="bg-white/[0.02] px-2.5 py-1.5 rounded border border-white/5 flex items-center justify-between gap-1.5 text-[11px] min-w-0">
                      <span className="text-emerald-400 font-bold font-mono break-all">{aim.rsid}</span>{' '}
                      <span className="text-slate-400 text-[10px] font-mono shrink-0">chr {aim.chromosome}</span>
                    </li>
                  ))}
                </ul>
                {(results.unmappedAims || []).length > 48 && (
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setShowAllUnmapped(!showAllUnmapped)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer select-none"
                    >
                      {showAllUnmapped ? 'Collapse to 48 Markers' : `Show All ${(results.unmappedAims || []).length} Unmapped Markers`}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SubpopulationBento;
