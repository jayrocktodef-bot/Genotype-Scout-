import React, { useMemo } from 'react';
import pcaData from '../data/ancestry/pca_reference_data.json';

interface PCAMapProps {
  userCoordinates: { pc1: number; pc2: number } | null;
}

export const PCAMap: React.FC<PCAMapProps> = ({ userCoordinates }) => {
  // Config for scaling the PCA values into the SVG ViewBox
  const width = 800;
  const height = 600;
  const padding = 60;

  // Find min/max dynamically to ensure all populations fit on screen
  const extents = useMemo(() => {
    const pc1s = pcaData.map(d => d.pc1);
    const pc2s = pcaData.map(d => d.pc2);
    if (userCoordinates) {
      pc1s.push(userCoordinates.pc1);
      pc2s.push(userCoordinates.pc2);
    }
    return {
      minX: Math.min(...pc1s), maxX: Math.max(...pc1s),
      minY: Math.min(...pc2s), maxY: Math.max(...pc2s)
    };
  }, [userCoordinates]);

  // Helper to map PC values to SVG pixels
  const scaleX = (val: number) => {
    return padding + ((val - extents.minX) / (extents.maxX - extents.minX)) * (width - padding * 2);
  };

  const scaleY = (val: number) => {
    return padding + ((val - extents.minY) / (extents.maxY - extents.minY)) * (height - padding * 2);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 overflow-hidden relative shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-emerald-400 font-bold text-sm tracking-widest uppercase">Global PCA Projection (HGDP + 1kGP)</h3>
        <div className="text-[10px] text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
          PC1 vs PC2 Space
        </div>
      </div>
      
      <div className="relative aspect-[4/3] w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full bg-slate-950 rounded-lg border border-slate-800">
          {/* Grid Lines */}
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
          <line x1={width / 2} y1={padding} x2={width / 2} y2={height - padding} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

          {/* Reference Populations */}
          {pcaData.map((pop, idx) => {
            const cx = scaleX(pop.pc1);
            const cy = height - scaleY(pop.pc2); // Invert Y
            
            return (
              <g key={idx} className="group">
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r="4" 
                  fill={pop.color} 
                  opacity="0.5" 
                  className="transition-all duration-300 group-hover:opacity-100 group-hover:r-6 cursor-help" 
                />
                <text 
                  x={cx + 8} 
                  y={cy - 8} 
                  fill="#94a3b8" 
                  fontSize="12" 
                  className="opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 font-medium"
                >
                  {pop.population} ({pop.region})
                </text>
              </g>
            );
          })}

          {/* The User "Glowing Dot" */}
          {userCoordinates && (
            <g>
              <circle 
                cx={scaleX(userCoordinates.pc1)} 
                cy={height - scaleY(userCoordinates.pc2)} 
                r="12" 
                fill="none" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                className="animate-ping opacity-75"
              />
              <circle 
                cx={scaleX(userCoordinates.pc1)} 
                cy={height - scaleY(userCoordinates.pc2)} 
                r="7" 
                fill="#f59e0b" 
                className="drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
              />
              <text 
                x={scaleX(userCoordinates.pc1) + 12} 
                y={height - scaleY(userCoordinates.pc2) - 12} 
                fill="#fcd34d" 
                fontSize="14" 
                fontWeight="bold"
                className="drop-shadow-md"
              >
                You
              </text>
            </g>
          )}
        </svg>

        {/* Region Legend */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-3 bg-slate-900/90 p-2.5 rounded-lg backdrop-blur-md border border-slate-700/50 shadow-xl">
          {[
            { label: 'Africa', color: '#10b981' },
            { label: 'Europe', color: '#3b82f6' },
            { label: 'Asia', color: '#ef4444' },
            { label: 'Americas', color: '#a855f7' },
            { label: 'Oceania', color: '#06b6d4' },
            { label: 'Middle East', color: '#f59e0b' }
          ].map(region => (
            <div key={region.label} className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: region.color }}></span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{region.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
