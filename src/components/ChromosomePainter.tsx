import React, { useMemo, useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react';

const CHROMOSOME_LENGTHS: Record<string, number> = {
  "1": 248956422, "2": 242193529, "3": 198295559, "4": 190214555, "5": 181538259, "6": 170805979, "7": 159345973, "8": 145138636, "9": 138394717, "10": 133797422, "11": 135086622, "12": 133851895, "13": 115169878, "14": 107349540, "15": 102520552, "16": 90354753, "17": 83257441, "18": 80373285, "19": 59128983, "20": 63025520, "21": 48129895, "22": 51304566, "X": 156040895
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

export interface ChromosomePainterRef {
  getSnapshot: (scale?: number) => string;
}

export const ChromosomePainter = forwardRef<ChromosomePainterRef, ChromosomePainterProps>(({ 
  segments = {}, 
  width = 800, 
  height = 500,
  onSegmentClick
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<{ chrom: string; strand: 'A' | 'B' | 'Both'; segment: Segment; bp: number; clientX: number; clientY: number } | null>(null);

  const draw = (ctx: CanvasRenderingContext2D, scale: number = 1) => {
    const sw = width * scale;
    const sh = height * scale;
    const padding = 40 * scale;
    const chromWidth = 14 * scale;
    const gap = (sw - padding * 2) / 22;

    ctx.fillStyle = '#0f172a'; // Dark background
    ctx.fillRect(0, 0, sw, sh);

    const maxLen = Math.max(...Object.values(CHROMOSOME_LENGTHS));
    const usableHeight = sh - padding * 2;

    Object.keys(CHROMOSOME_LENGTHS).sort((a,b) => {
        if (a === 'X') return 1;
        if (b === 'X') return -1;
        return parseInt(a) - parseInt(b);
    }).forEach((chrom, idx) => {
      const len = CHROMOSOME_LENGTHS[chrom];
      const x = padding + idx * gap;
      const h = (len / maxLen) * usableHeight;
      const y = padding;

      // Draw shadow/track
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.roundRect(x, y, chromWidth, h, 4 * scale);
      ctx.fill();

      // Label
      ctx.fillStyle = '#94a3b8';
      ctx.font = `bold ${10 * scale}px Inter`;
      ctx.textAlign = 'center';
      ctx.fillText(chrom, x + chromWidth / 2, y - 10 * scale);

      // Draw Segments
      const chromData = segments[chrom] || [];
      const hasStrands = !Array.isArray(chromData) && (chromData as any).strandA && (chromData as any).strandB;

      if (hasStrands) {
        const strandA: Segment[] = (chromData as any).strandA || [];
        const strandB: Segment[] = (chromData as any).strandB || [];
        const halfWidth = chromWidth / 2 - 1 * scale;

        // Draw Strand A (Maternal)
        strandA.forEach(seg => {
          const segY = y + (seg.start / maxLen) * usableHeight;
          const segH = ((seg.end - seg.start) / maxLen) * usableHeight;
          ctx.fillStyle = POP_COLORS[seg.continent] || '#475569';
          ctx.beginPath();
          ctx.roundRect(x, segY, halfWidth, Math.max(2 * scale, segH), 1 * scale);
          ctx.fill();

          if (seg.confidence > 0.9) {
            ctx.shadowBlur = 2 * scale;
            ctx.shadowColor = ctx.fillStyle;
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        });

        // Draw Strand B (Paternal)
        strandB.forEach(seg => {
          const segY = y + (seg.start / maxLen) * usableHeight;
          const segH = ((seg.end - seg.start) / maxLen) * usableHeight;
          ctx.fillStyle = POP_COLORS[seg.continent] || '#475569';
          ctx.beginPath();
          ctx.roundRect(x + halfWidth + 2 * scale, segY, halfWidth, Math.max(2 * scale, segH), 1 * scale);
          ctx.fill();

          if (seg.confidence > 0.9) {
            ctx.shadowBlur = 2 * scale;
            ctx.shadowColor = ctx.fillStyle;
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        });
      } else {
        // Fallback: draw single bar
        const chromSegments = Array.isArray(chromData) ? chromData : [];
        chromSegments.forEach(seg => {
          const segY = y + (seg.start / maxLen) * usableHeight;
          const segH = ((seg.end - seg.start) / maxLen) * usableHeight;
          ctx.fillStyle = POP_COLORS[seg.continent] || '#475569';
          ctx.beginPath();
          ctx.roundRect(x, segY, chromWidth, Math.max(2 * scale, segH), 2 * scale);
          ctx.fill();
          
          if (seg.confidence > 0.9) {
              ctx.shadowBlur = 4 * scale;
              ctx.shadowColor = ctx.fillStyle;
              ctx.stroke();
              ctx.shadowBlur = 0;
          }
        });
      }

      // Draw Highlight Outline if hovered
      if (hovered && hovered.chrom === chrom) {
        const seg = hovered.segment;
        const segY = y + (seg.start / maxLen) * usableHeight;
        const segH = ((seg.end - seg.start) / maxLen) * usableHeight;
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5 * scale;
        ctx.shadowColor = POP_COLORS[seg.continent] || '#ffffff';
        ctx.shadowBlur = 8 * scale;
        ctx.beginPath();
        
        if (hovered.strand === 'A') {
          const halfWidth = chromWidth / 2 - 1 * scale;
          ctx.roundRect(x - 1 * scale, segY - 1 * scale, halfWidth + 2 * scale, Math.max(2 * scale, segH) + 2 * scale, 1 * scale);
        } else if (hovered.strand === 'B') {
          const halfWidth = chromWidth / 2 - 1 * scale;
          ctx.roundRect(x + halfWidth + 1 * scale, segY - 1 * scale, halfWidth + 2 * scale, Math.max(2 * scale, segH) + 2 * scale, 1 * scale);
        } else {
          ctx.roundRect(x - 1 * scale, segY - 1 * scale, chromWidth + 2 * scale, Math.max(2 * scale, segH) + 2 * scale, 2 * scale);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    });
  };

  const getCoordinatesFromEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    // Account for styling scaling
    const clickX = ((e.clientX - rect.left) / rect.width) * width;
    const clickY = ((e.clientY - rect.top) / rect.height) * height;

    const scale = 1;
    const padding = 40 * scale;
    const chromWidth = 14 * scale;
    const gap = (width - padding * 2) / 22;
    const maxLen = Math.max(...Object.values(CHROMOSOME_LENGTHS));
    const usableHeight = height - padding * 2;

    const sortedChroms = Object.keys(CHROMOSOME_LENGTHS).sort((a, b) => {
      if (a === 'X') return 1;
      if (b === 'X') return -1;
      return parseInt(a) - parseInt(b);
    });

    for (let idx = 0; idx < sortedChroms.length; idx++) {
      const chrom = sortedChroms[idx];
      const x = padding + idx * gap;
      const len = CHROMOSOME_LENGTHS[chrom];
      const h = (len / maxLen) * usableHeight;
      const y = padding;

      if (clickX >= x - 2 && clickX <= x + chromWidth + 2 && clickY >= y && clickY <= y + h) {
        const relativeY = clickY - y;
        const bp = (relativeY / h) * len;
        
        const chromData = segments[chrom] || [];
        const hasStrands = !Array.isArray(chromData) && (chromData as any).strandA && (chromData as any).strandB;

        if (hasStrands) {
          const strandA: Segment[] = (chromData as any).strandA || [];
          const strandB: Segment[] = (chromData as any).strandB || [];
          const halfWidth = chromWidth / 2 - 1 * scale;
          const isStrandA = clickX <= x + halfWidth;
          const activeStrand = isStrandA ? 'A' : 'B';
          const activeSegments = isStrandA ? strandA : strandB;

          const match = activeSegments.find(seg => bp >= seg.start && bp <= seg.end);
          if (match) {
            return { chrom, strand: activeStrand as 'A' | 'B', segment: match, bp, clientX: e.clientX, clientY: e.clientY };
          }
        } else {
          const chromSegments = Array.isArray(chromData) ? chromData : [];
          const match = chromSegments.find(seg => bp >= seg.start && bp <= seg.end);
          if (match) {
            return { chrom, strand: 'Both' as const, segment: match, bp, clientX: e.clientX, clientY: e.clientY };
          }
        }
      }
    }
    return null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCoordinatesFromEvent(e);
    setHovered(coords);
  };

  const handleMouseLeave = () => {
    setHovered(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCoordinatesFromEvent(e);
    if (coords && onSegmentClick) {
      onSegmentClick(coords.chrom, coords.strand, coords.segment, coords.bp);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        draw(ctx);
      }
    }
  }, [segments, width, height, hovered]);

  useImperativeHandle(ref, () => ({
    getSnapshot: (scale: number = 2) => {
      const snapshotCanvas = document.createElement('canvas');
      snapshotCanvas.width = width * scale;
      snapshotCanvas.height = height * scale;
      const ctx = snapshotCanvas.getContext('2d');
      if (ctx) {
        draw(ctx, scale);
      }
      return snapshotCanvas.toDataURL('image/png');
    }
  }));

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className="max-w-full h-auto rounded-xl cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />

      {/* Floating Tooltip */}
      {hovered && (
        <div 
          className="absolute z-20 bg-slate-900/95 border border-slate-700 text-white p-3 rounded-xl shadow-xl backdrop-blur-sm pointer-events-none text-[10px] leading-relaxed transition-all duration-100"
          style={{
            left: `${hovered.clientX - canvasRef.current!.getBoundingClientRect().left + 15}px`,
            top: `${hovered.clientY - canvasRef.current!.getBoundingClientRect().top + 15}px`,
          }}
        >
          <div className="font-black text-teal-400 uppercase tracking-widest text-[9px] mb-1">Chromosome {hovered.chrom}</div>
          <div><strong className="text-slate-400">Ancestry:</strong> <span className="font-extrabold" style={{ color: POP_COLORS[hovered.segment.continent] }}>{hovered.segment.continent}</span></div>
          {hovered.strand !== 'Both' && <div><strong className="text-slate-400">Strand:</strong> {hovered.strand === 'A' ? 'Strand A (Maternal)' : 'Strand B (Paternal)'}</div>}
          <div><strong className="text-slate-400">Range:</strong> {(hovered.segment.start / 1000000).toFixed(1)}M - {(hovered.segment.end / 1000000).toFixed(1)}M bp</div>
          <div><strong className="text-slate-400">Confidence:</strong> {(hovered.segment.confidence * 100).toFixed(0)}%</div>
          <div className="text-[8px] text-teal-300 font-bold mt-1.5 animate-pulse">🖱️ Click to inspect SNPs</div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {Object.entries(POP_COLORS).map(([pop, color]) => (
            <div key={pop} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pop}</span>
            </div>
        ))}
      </div>
    </div>
  );
});

ChromosomePainter.displayName = 'ChromosomePainter';
