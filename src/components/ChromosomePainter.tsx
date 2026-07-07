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
  const [hoveredSegment, setHoveredSegment] = useState<{
    chrom: string;
    strand: 'A' | 'B' | 'Both';
    segment: Segment;
    x: number;
    y: number;
  } | null>(null);

  const handleMouseMove = (e: React.MouseEvent, chrom: string, strand: 'A' | 'B' | 'Both', segment: Segment) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
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
    return Object.keys(CHROMOSOME_LENGTHS).sort((a, b) => {
      if (a === 'X') return 1;
      if (b === 'X') return -1;
      return parseInt(a, 10) - parseInt(b, 10);
    });
  }, []);

  const isDiploid = useMemo(() => {
    return Object.values(segments).some(
      chromData => chromData && !Array.isArray(chromData) && (chromData as any).strandA
    );
  }, [segments]);

  return (
    <div className="w-full bg-[#0d0e10]/90 border border-white/5 rounded-3xl p-6 shadow-2xl relative">
      
      {/* Continental Highlighter Filter */}
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Highlight region:</div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveContinentFilter(null)}
            className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
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
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border transition-all flex items-center gap-1.5 ${
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
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
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

          return (
            <div key={chrom} className="group flex flex-col md:flex-row items-stretch gap-2 md:gap-4 p-3 bg-slate-900/30 hover:bg-slate-900/60 rounded-xl border border-white/[0.02] transition-colors">
              {/* Left Label Info */}
              <div className="flex md:flex-col justify-between md:justify-center w-full md:w-32 shrink-0 border-b md:border-b-0 md:border-r border-white/5 pb-2 md:pb-0 pr-0 md:pr-4">
                <span className="text-sm font-black text-white">Chr {chrom}</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{(length / 1000000).toFixed(1)} M bp</span>
              </div>

              {/* Tracks Container */}
              <div className="flex-1 flex flex-col justify-center gap-1.5 min-h-[36px] relative py-1">
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

      {/* Floating Tooltip */}
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

      {/* Bottom Info Bar */}
      <div className="mt-6 text-[10px] text-slate-500 flex justify-between items-center uppercase tracking-widest border-t border-white/5 pt-4 dark:text-slate-400">
        <span>Scroll vertically to explore chromosomes 1–X</span>
        <span>Interactive Inspector</span>
      </div>
    </div>
  );
};
