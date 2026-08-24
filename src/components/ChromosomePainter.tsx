import React, { useMemo, useState } from 'react';

const CHROMOSOME_LENGTHS: Record<string, number> = {
  "1": 248956422, "2": 242193529, "3": 198295559, "4": 190214555, "5": 181538259, "6": 170805979, 
  "7": 159345973, "8": 145138636, "9": 138394717, "10": 133797422, "11": 135086622, "12": 133851895, 
  "13": 115169878, "14": 107349540, "15": 102520552, "16": 90354753, "17": 83257441, "18": 80373285, 
  "19": 59128983, "20": 63025520, "21": 48129895, "22": 51304566, "X": 156040895
};

const POP_COLORS: Record<string, string> = {
  EUR: '#3b82f6',
  AFR: '#10b981',
  EAS: '#ef4444',
  SAS: '#f59e0b',
  AMR: '#a855f7',
  OCE: '#06b6d4',
  MID: '#f97316'
};

const REGION_NAMES: Record<string, string> = {
  EUR: 'European',
  AFR: 'African',
  EAS: 'East Asian',
  SAS: 'South Asian',
  AMR: 'Indigenous American',
  OCE: 'Oceanian',
  MID: 'Middle Eastern'
};

// Key Functional & Adaptation Gene Overlays
interface GeneAnnotation {
  symbol: string;
  name: string;
  chrom: string;
  pos: number;
  icon: string;
  trait: string;
}

const KEY_GENES: GeneAnnotation[] = [
  { symbol: 'DARC', name: 'ACKR1 / Duffy', chrom: '1', pos: 159345000, icon: '🦠', trait: 'Duffy Vivax Malaria Protection' },
  { symbol: 'EDAR', name: 'EDAR V370A', chrom: '2', pos: 108890000, icon: '💇', trait: 'Hair Thickness & Tooth Morphology' },
  { symbol: 'LCT', name: 'MCM6 / LCT', chrom: '2', pos: 135800000, icon: '🥛', trait: 'Adult Lactase Persistence' },
  { symbol: 'EPAS1', name: 'EPAS1', chrom: '2', pos: 46300000, icon: '🏔️', trait: 'Tibetan High Altitude Adaptation' },
  { symbol: 'ADH1B', name: 'ADH1B His48Arg', chrom: '4', pos: 99300000, icon: '🍷', trait: 'Accelerated Alcohol Clearance' },
  { symbol: 'SLC45A2', name: 'SLC45A2 L374F', chrom: '5', pos: 33900000, icon: '🎨', trait: 'European Light Skin Pigmentation' },
  { symbol: 'HBB', name: 'HBB HbS', chrom: '11', pos: 5220000, icon: '🩸', trait: 'Sickle Cell & Falciparum Protection' },
  { symbol: 'FADS1', name: 'FADS1 / FADS2', chrom: '11', pos: 61600000, icon: '🥗', trait: 'Fatty Acid Desaturase Adaptation' },
  { symbol: 'ALDH2', name: 'ALDH2 Glu504Lys', chrom: '12', pos: 111800000, icon: '🍺', trait: 'Alcohol Flush Reaction' },
  { symbol: 'HERC2', name: 'HERC2 / OCA2', chrom: '15', pos: 28100000, icon: '👁️', trait: 'Iris Color Enhancer (Blue/Brown)' },
  { symbol: 'SLC24A5', name: 'SLC24A5 A111T', chrom: '15', pos: 48100000, icon: '☀️', trait: 'European Light Skin Pigmentation' },
  { symbol: 'ABCC11', name: 'ABCC11 538G>A', chrom: '16', pos: 48200000, icon: '🧼', trait: 'Dry Earwax & Reduced Body Odor' },
];

interface Segment {
  continent: string;
  start: number;
  end: number;
  confidence: number;
}

interface ChromosomePainterProps {
  segments: Record<string, Segment[] | { strandA: Segment[]; strandB: Segment[] }>;
  width?: number;
  height?: number;
  onSegmentClick?: (chrom: string, strand: 'A' | 'B' | 'Both', segment: Segment, bp: number) => void;
}

export const ChromosomePainter = ({ 
  segments = {}, 
  onSegmentClick 
}: ChromosomePainterProps) => {
  const [activeContinentFilter, setActiveContinentFilter] = useState<string | null>(null);
  const [selectedChromFilter, setSelectedChromFilter] = useState<string>('ALL');
  const [showGenePins, setShowGenePins] = useState<boolean>(true);
  const [hoveredSegment, setHoveredSegment] = useState<{
    chrom: string;
    strand: 'A' | 'B' | 'Both';
    segment: Segment;
    x: number;
    y: number;
  } | null>(null);

  const [hoveredGene, setHoveredGene] = useState<{
    gene: GeneAnnotation;
    x: number;
    y: number;
  } | null>(null);

  const handleMouseMove = (e: React.MouseEvent, chrom: string, strand: 'A' | 'B' | 'Both', segment: Segment) => {
    setHoveredSegment({
      chrom,
      strand,
      segment,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseLeave = () => {
    setHoveredSegment(null);
  };

  const sortedChroms = useMemo(() => {
    const list = Object.keys(CHROMOSOME_LENGTHS).sort((a, b) => {
      if (a === 'X') return 1;
      if (b === 'X') return -1;
      return parseInt(a, 10) - parseInt(b, 10);
    });
    if (selectedChromFilter !== 'ALL') {
      return list.filter(c => c === selectedChromFilter);
    }
    return list;
  }, [selectedChromFilter]);

  const isDiploid = useMemo(() => {
    return Object.values(segments).some(
      chromData => chromData && !Array.isArray(chromData) && (chromData as any).strandA
    );
  }, [segments]);

  // Total Mb painted per continent across all chromosomes
  const continentStats = useMemo(() => {
    const totals: Record<string, number> = {};
    let grandTotalMb = 0;

    Object.entries(segments).forEach(([chrom, chromData]) => {
      if (!chromData) return;
      const strandA: Segment[] = Array.isArray(chromData) ? chromData : (chromData.strandA || []);
      const strandB: Segment[] = Array.isArray(chromData) ? [] : (chromData.strandB || []);

      [...strandA, ...strandB].forEach(seg => {
        const mb = Math.max(0, (seg.end - seg.start) / 1000000);
        totals[seg.continent] = (totals[seg.continent] || 0) + mb;
        grandTotalMb += mb;
      });
    });

    if (grandTotalMb === 0) return [];

    return Object.entries(totals)
      .map(([code, mb]) => ({
        code,
        name: REGION_NAMES[code] || code,
        color: POP_COLORS[code] || '#94a3b8',
        mb,
        pct: (mb / grandTotalMb) * 100
      }))
      .sort((a, b) => b.pct - a.pct);
  }, [segments]);

  return (
    <div className="w-full bg-[#0d0e10]/90 border border-white/5 rounded-3xl p-4 sm:p-6 shadow-2xl relative space-y-5">
      
      {/* Ancestry Percentage Summary Header */}
      {continentStats.length > 0 && (
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
            <span className="uppercase tracking-wider">Painted Ancestry Composition</span>
            <span className="text-[10px] text-slate-400 font-mono">Total Length: {continentStats.reduce((a,b) => a + b.mb, 0).toFixed(0)} Mb</span>
          </div>

          {/* Stacked Progress Bar */}
          <div className="h-3 w-full bg-slate-950 rounded-lg overflow-hidden flex">
            {continentStats.map(stat => (
              <div 
                key={stat.code}
                style={{ width: `${stat.pct}%`, backgroundColor: stat.color }}
                className="h-full transition-all duration-300 hover:brightness-125"
                title={`${stat.name}: ${stat.pct.toFixed(1)}% (${stat.mb.toFixed(0)} Mb)`}
              />
            ))}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 pt-1">
            {continentStats.map(stat => (
              <div key={stat.code} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: stat.color }} />
                <span className="font-bold text-slate-200">{stat.name}:</span>
                <span className="font-mono font-black text-white">{stat.pct.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Bar: Chromosome Filter & Trait Gene Pins */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Chromosome Focus:</span>
          <select
            value={selectedChromFilter}
            onChange={(e) => setSelectedChromFilter(e.target.value)}
            className="bg-slate-950 text-teal-300 font-bold text-xs px-3 py-1.5 rounded-lg border border-teal-500/30 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Chromosomes (1–X)</option>
            {Object.keys(CHROMOSOME_LENGTHS).map(c => (
              <option key={c} value={c}>Chr {c}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowGenePins(!showGenePins)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
              showGenePins 
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm' 
                : 'bg-slate-800/40 text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            <span>🧬 Gene Badges</span>
            <span className="text-[10px] opacity-75">({showGenePins ? 'ON' : 'OFF'})</span>
          </button>
        </div>
      </div>

      {/* Continental Highlighter Filter */}
      <div className="flex flex-wrap justify-between items-center gap-3 bg-slate-900/30 p-3 rounded-2xl border border-white/5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Highlight Ancestry Region:</div>
        <div className="flex flex-wrap gap-1.5">
          <button 
            onClick={() => setActiveContinentFilter(null)}
            className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
              activeContinentFilter === null 
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/35' 
                : 'bg-slate-800/40 text-slate-400 border border-transparent hover:bg-slate-800/85'
            }`}
          >
            Show All
          </button>
          {Object.entries(POP_COLORS).map(([pop, color]) => (
            <button
              key={pop}
              onClick={() => setActiveContinentFilter(activeContinentFilter === pop ? null : pop)}
              className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border transition-all flex items-center gap-1.5 ${
                activeContinentFilter === pop 
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/35 shadow-sm'
                  : 'bg-slate-800/40 text-slate-400 border-transparent hover:bg-slate-800/85'
              }`}
            >
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
              {REGION_NAMES[pop] ?? pop}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Chromosome Stack */}
      <div className="space-y-3.5 max-h-[620px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        {sortedChroms.map((chrom) => {
          const length = CHROMOSOME_LENGTHS[chrom];
          const chromData = segments[chrom];
          
          const hasStrands = isDiploid;
          const strandA: Segment[] = chromData 
            ? (Array.isArray(chromData) ? chromData : (chromData as any).strandA || [])
            : [];
          const strandB: Segment[] = chromData
            ? (Array.isArray(chromData) ? [] : (chromData as any).strandB || [])
            : [];

          const chromGenes = KEY_GENES.filter(g => g.chrom === chrom);

          return (
            <div key={chrom} className="group flex flex-col md:flex-row items-stretch gap-2 md:gap-4 p-3 bg-slate-900/30 hover:bg-slate-900/60 rounded-xl border border-white/[0.02] transition-colors relative">
              {/* Left Label Info */}
              <div className="flex md:flex-col justify-between md:justify-center w-full md:w-32 shrink-0 border-b md:border-b-0 md:border-r border-white/5 pb-2 md:pb-0 pr-0 md:pr-4">
                <span className="text-sm font-black text-white">Chr {chrom}</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{(length / 1000000).toFixed(1)} M bp</span>
              </div>

              {/* Tracks Container */}
              <div className="flex-1 flex flex-col justify-center gap-1.5 min-h-[36px] relative py-1">
                
                {/* Gene Overlays */}
                {showGenePins && chromGenes.length > 0 && (
                  <div className="absolute -top-3 left-0 right-0 h-4 z-10 pointer-events-none">
                    {chromGenes.map(gene => {
                      const pctLeft = (gene.pos / length) * 100;
                      return (
                        <div 
                          key={gene.symbol}
                          className="absolute -translate-x-1/2 pointer-events-auto cursor-pointer group/gene"
                          style={{ left: `${pctLeft}%` }}
                          onMouseMove={(e) => setHoveredGene({ gene, x: e.clientX, y: e.clientY })}
                          onMouseLeave={() => setHoveredGene(null)}
                        >
                          <span className="text-xs filter drop-shadow hover:scale-125 transition-transform inline-block">
                            {gene.icon}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Strand A (Maternal) */}
                <div className="relative w-full h-4 bg-slate-950 rounded-md overflow-hidden border border-white/5">
                  {strandA.length === 0 ? (
                    <div className="absolute inset-0 bg-slate-800/20 flex items-center justify-center text-[7px] font-black text-slate-500 uppercase tracking-widest pointer-events-none dark:text-slate-400">
                      {chromData ? 'No Coverage' : 'No Data'}
                    </div>
                  ) : (
                    strandA.map((seg, i) => {
                      const startPos = i === 0 ? 0 : seg.start;
                      const endPos = i === strandA.length - 1 ? length : seg.end;
                      const pctLeft = (startPos / length) * 100;
                      const pctWidth = ((endPos - startPos) / length) * 100;
                      const isMuted = activeContinentFilter && activeContinentFilter !== seg.continent;
                      return (
                        <div
                          key={i}
                          className="absolute top-0 bottom-0 cursor-pointer transition-all duration-300 hover:brightness-125"
                          style={{
                            left: `${pctLeft}%`,
                            width: `${Math.max(0.2, pctWidth)}%`,
                            backgroundColor: POP_COLORS[seg.continent] || '#475569',
                            opacity: isMuted ? 0.15 : 1,
                            zIndex: isMuted ? 1 : 2
                          }}
                          onMouseMove={(e) => handleMouseMove(e, chrom, hasStrands ? 'A' : 'Both', { ...seg, start: startPos, end: endPos })}
                          onMouseLeave={handleMouseLeave}
                          onClick={() => onSegmentClick?.(chrom, hasStrands ? 'A' : 'Both', { ...seg, start: startPos, end: endPos }, (startPos + endPos) / 2)}
                        />
                      );
                    })
                  )}
                  {hasStrands && (
                    <div className="absolute left-2 top-0.5 text-[8px] font-black uppercase text-white/40 pointer-events-none tracking-widest">
                      Strand A (Maternal)
                    </div>
                  )}
                </div>

                {/* Strand B (Paternal) */}
                {hasStrands && (
                  <div className="relative w-full h-4 bg-slate-950 rounded-md overflow-hidden border border-white/5">
                    {strandB.length === 0 ? (
                      <div className="absolute inset-0 bg-slate-800/20 flex items-center justify-center text-[7px] font-black text-slate-500 uppercase tracking-widest pointer-events-none dark:text-slate-400">
                        {chromData ? 'No Coverage' : 'No Data'}
                      </div>
                    ) : (
                      strandB.map((seg, i) => {
                        const startPos = i === 0 ? 0 : seg.start;
                        const endPos = i === strandB.length - 1 ? length : seg.end;
                        const pctLeft = (startPos / length) * 100;
                        const pctWidth = ((endPos - startPos) / length) * 100;
                        const isMuted = activeContinentFilter && activeContinentFilter !== seg.continent;
                        return (
                          <div
                            key={i}
                            className="absolute top-0 bottom-0 cursor-pointer transition-all duration-300 hover:brightness-125"
                            style={{
                              left: `${pctLeft}%`,
                              width: `${Math.max(0.2, pctWidth)}%`,
                              backgroundColor: POP_COLORS[seg.continent] || '#475569',
                              opacity: isMuted ? 0.15 : 1,
                              zIndex: isMuted ? 1 : 2
                            }}
                            onMouseMove={(e) => handleMouseMove(e, chrom, 'B', { ...seg, start: startPos, end: endPos })}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => onSegmentClick?.(chrom, 'B', { ...seg, start: startPos, end: endPos }, (startPos + endPos) / 2)}
                          />
                        );
                      })
                    )}
                    <div className="absolute left-2 top-0.5 text-[8px] font-black uppercase text-white/40 pointer-events-none tracking-widest">
                      Strand B (Paternal)
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Segment Tooltip */}
      {hoveredSegment && (
        <div 
          className="fixed z-[9999] bg-slate-900/95 border border-slate-700/80 text-white p-3 rounded-xl shadow-2xl backdrop-blur-md pointer-events-none text-[10px] leading-relaxed transition-all duration-75"
          style={{
            left: `${hoveredSegment.x + 15}px`,
            top: `${hoveredSegment.y + 15}px`,
          }}
        >
          <div className="font-black text-teal-400 uppercase tracking-widest text-[9px] mb-1">
            Chromosome {hoveredSegment.chrom}
          </div>
          <div>
            <strong className="text-slate-400">Ancestry:</strong>{' '}
            <span className="font-extrabold" style={{ color: POP_COLORS[hoveredSegment.segment.continent] }}>
              {REGION_NAMES[hoveredSegment.segment.continent] ?? hoveredSegment.segment.continent}
            </span>
          </div>
          {hoveredSegment.strand !== 'Both' && (
            <div>
              <strong className="text-slate-400">Strand:</strong>{' '}
              {hoveredSegment.strand === 'A' ? 'Strand A (Maternal)' : 'Strand B (Paternal)'}
            </div>
          )}
          <div>
            <strong className="text-slate-400">Range:</strong>{' '}
            {(hoveredSegment.segment.start / 1000000).toFixed(1)}M - {(hoveredSegment.segment.end / 1000000).toFixed(1)}M bp
          </div>
          <div>
            <strong className="text-slate-400">Confidence:</strong>{' '}
            {(hoveredSegment.segment.confidence * 100).toFixed(0)}%
          </div>
          <div className="text-[8px] text-teal-300 font-bold mt-1.5 animate-pulse">🖱️ Click segment to list SNPs</div>
        </div>
      )}

      {/* Floating Gene Tooltip */}
      {hoveredGene && (
        <div 
          className="fixed z-[9999] bg-slate-900/95 border border-indigo-500/50 text-white p-3 rounded-xl shadow-2xl backdrop-blur-md pointer-events-none text-[10px] leading-relaxed transition-all duration-75"
          style={{
            left: `${hoveredGene.x + 15}px`,
            top: `${hoveredGene.y + 15}px`,
          }}
        >
          <div className="font-black text-indigo-400 uppercase tracking-widest text-[9px] mb-1 flex items-center gap-1">
            <span>{hoveredGene.gene.icon}</span>
            <span>{hoveredGene.gene.symbol} ({hoveredGene.gene.name})</span>
          </div>
          <div>
            <strong className="text-slate-400">Location:</strong> Chr {hoveredGene.gene.chrom}:{(hoveredGene.gene.pos / 1000000).toFixed(1)}M bp
          </div>
          <div>
            <strong className="text-slate-400">Trait Influence:</strong> {hoveredGene.gene.trait}
          </div>
        </div>
      )}

      {/* Bottom Info Bar */}
      <div className="mt-4 text-[10px] text-slate-500 flex justify-between items-center uppercase tracking-widest border-t border-white/5 pt-4 dark:text-slate-400">
        <span>Scroll vertically to explore chromosomes 1–X</span>
        <span>Interactive Segment & Marker Inspector</span>
      </div>
    </div>
  );
};
