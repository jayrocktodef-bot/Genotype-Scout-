import React, { useMemo, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';

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
  segments: Record<string, Segment[]>;
  width?: number;
  height?: number;
}

export interface ChromosomePainterRef {
  getSnapshot: (scale?: number) => string;
}

export const ChromosomePainter = forwardRef<ChromosomePainterRef, ChromosomePainterProps>(({ 
  segments = {}, 
  width = 800, 
  height = 1000 
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      const chromSegments = segments[chrom] || [];
      chromSegments.forEach(seg => {
        const segY = y + (seg.start / maxLen) * usableHeight;
        const segH = ((seg.end - seg.start) / maxLen) * usableHeight;
        ctx.fillStyle = POP_COLORS[seg.continent] || '#475569';
        ctx.beginPath();
        ctx.roundRect(x, segY, chromWidth, Math.max(2 * scale, segH), 2 * scale);
        ctx.fill();
        
        // Add a subtle glow for high confidence
        if (seg.confidence > 0.9) {
            ctx.shadowBlur = 4 * scale;
            ctx.shadowColor = ctx.fillStyle;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
      });
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        draw(ctx);
      }
    }
  }, [segments, width, height]);

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
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className="max-w-full h-auto rounded-xl"
      />
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
